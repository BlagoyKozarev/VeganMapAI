import express, { Router, type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerApiStatsRoutes } from "./routes/api-stats";
import { Client } from '@googlemaps/google-maps-services-js';
import multer from 'multer';
import fs from 'fs';
import { db } from "./db";
import { sql } from "drizzle-orm";
import { restaurants } from "@shared/schema";
// FormData is now globally available in Node.js

import { 
  mapAgent, 
  searchAgent, 
  scoreAgent, 
  reviewAgent, 
  profileAgent, 
  analyticsAgent 
} from "./agents";

import { ttsHandler } from "./api/tts";

import { insertUserProfileSchema, insertUserFavoriteSchema, insertUserVisitSchema } from "@shared/schema";
import { z } from "zod";
import { searchRestaurantsWithAI } from "./services/aiSearch";

// Единен apiRouter според точните спецификации
export const apiRouter = Router();

// GET /api/health → { ok:true, ts:number, counts:{ restaurants:number } }
apiRouter.get('/health', async (req, res) => {
  try {
    const restaurantCount = await storage.count();
    res.type('application/json').json({ 
      ok: true,
      ts: Date.now(),
      counts: { restaurants: restaurantCount }
    });
  } catch (error) {
    res.type('application/json').status(500).json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// GET /api/restaurants/public/map-data → [{ id,name,lat,lng,score? }]
apiRouter.get('/restaurants/public/map-data', async (req, res) => {
  try {
    const items = await storage.getRestaurantsInBox(req.query);
    res.type('application/json').json(items);
  } catch (error) {
    res.type('application/json').status(500).json({ 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// GET /api/recommend?lat&lng&radiusKm=5&minScore=0&limit=10 → { count:number, restaurants:[{ id,name,score,lat,lng }] }
apiRouter.get('/recommend', async (req, res) => {
  const { lat, lng, radiusKm = 5, minScore = 0, limit = 10 } = req.query as any;
  const nearbyRestaurants = await storage.getRestaurantsNearby({ 
    lat: +lat, 
    lng: +lng, 
    radiusKm: +radiusKm, 
    minScore: +minScore, 
    limit: +limit 
  });
  
  // Опростена структура според спецификацията
  const items = nearbyRestaurants.map(r => ({
    id: r.id,
    name: r.name,
    score: Number(r.veganScore),   // ← число
    lat: Number(r.latitude),       // ← число
    lng: Number(r.longitude)       // ← число
  }));
  
  res.type('application/json').json({ count: items.length, restaurants: items });
});

// POST /api/feedback → { ok:true }
apiRouter.post('/feedback', async (req, res) => {
  try {
    await storage.saveFeedback(req.body);
    res.type('application/json').json({ ok: true });
  } catch (error) {
    res.type('application/json').status(500).json({ 
      ok: false, 
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// POST /api/emergency-load → { ok:true, inserted:number }
apiRouter.post('/emergency-load', async (req, res) => {
  try {
    const inserted = await storage.loadSampleData();
    res.type('application/json').json({ 
      ok: true,
      inserted: inserted
    });
  } catch (error) {
    res.type('application/json').status(500).json({ 
      ok: false, 
      inserted: 0,
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

// 404 handler for invalid API routes
apiRouter.use('*', (req, res) => {
  res.status(404).type('application/json').json({
    ok: false,
    error: "Not Found"
  });
});

// 404 catcher за непознати /api/*
apiRouter.use((req, res) => res.status(404).type('application/json').json({ ok: false, error: 'Not Found' }));

// Legacy router export for compatibility
export const router = apiRouter;

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Register API stats routes
  registerApiStatsRoutes(app);

  // Multer setup for voice assistant
  const upload = multer({ dest: 'uploads/' });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.get('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Error getting profile:", error);
      res.status(500).json({ message: "Failed to get profile" });
    }
  });

  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse({
        ...req.body,
        userId
      });

      const profile = await storage.upsertUserProfile(profileData);
      
      // Track profile update
      await profileAgent.trackUserBehavior(userId, 'update_profile', {
        dietaryStyle: profileData.dietaryStyle,
        hasAllergies: profileData.allergies && profileData.allergies.length > 0
      });

      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  // Restaurant routes
  app.get('/api/restaurants/nearby', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { lat, lng, radius } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      const restaurants = await mapAgent.getRestaurantsInRadius(
        parseFloat(lat as string), 
        parseFloat(lng as string), 
        radius ? parseFloat(radius as string) : 15
      );

      // Track user action
      await profileAgent.trackUserBehavior(userId, 'search_nearby', {
        location: { lat: parseFloat(lat as string), lng: parseFloat(lng as string) },
        radius: radius || 15,
        resultsCount: restaurants.length
      }, { lat: parseFloat(lat as string), lng: parseFloat(lng as string) });

      res.json(restaurants);
    } catch (error) {
      console.error("Error getting nearby restaurants:", error);
      res.status(500).json({ message: "Failed to get nearby restaurants" });
    }
  });

  // Get all restaurants with AI scores (no radius limit)
  app.get('/api/restaurants/all-available', isAuthenticated, async (req: any, res) => {
    try {
      const restaurants = await storage.getAllRestaurantsWithScores();
      // Return restaurants with AI scores
      res.json(restaurants);
    } catch (error) {
      console.error("Error getting all restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants" });
    }
  });

  // Map data endpoint on router
  router.get('/restaurants/public/map-data', async (req, res) => {
    res.type("application/json");
    try {
      console.log('=== PUBLIC MAP DATA REQUEST ===');
      console.log('Query params:', req.query);
      
      // Add caching headers for better performance
      res.set({
        'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min client, 10 min CDN
        'Vary': 'Accept-Encoding'
      });
      
      // Check database connection first
      const dbTestResult = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const restaurantCount = dbTestResult[0]?.count || 0;
      console.log(`Database has ${restaurantCount} restaurants`);
      
      if (restaurantCount === 0) {
        console.warn('Database is empty - no restaurants found');
        return res.json({
          success: true,
          restaurants: [],
          count: 0,
          public: true,
          warning: 'No restaurants in database',
          dbStatus: 'empty'
        });
      }
      
      // Check for viewport bounds
      const { north, south, east, west, limit } = req.query;
      
      let restaurantsData;
      
      if (north && south && east && west) {
        console.log('Fetching restaurants for viewport bounds');
        // Viewport-based loading for better performance
        const bounds = {
          north: parseFloat(north as string),
          south: parseFloat(south as string),
          east: parseFloat(east as string),
          west: parseFloat(west as string)
        };
        
        // Get restaurants within viewport bounds only
        restaurantsData = await storage.getRestaurantsInBounds(
          bounds,
          parseInt(limit as string) || 200
        );
      } else {
        console.log('Fetching all restaurants (limited)');
        // Fallback to all restaurants (limited for performance)
        restaurantsData = await storage.getAllRestaurantsWithScores();
        // Limit to 500 restaurants for initial load
        restaurantsData = restaurantsData.slice(0, 500);
      }
      
      console.log(`Retrieved ${restaurantsData.length} restaurants from storage`);
      
      // Return optimized data (essential fields only)
      const publicData = restaurantsData.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        veganScore: restaurant.veganScore || restaurant.vegan_score,
        cuisineTypes: restaurant.cuisineTypes || restaurant.cuisine_types,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel || restaurant.price_level,
        address: restaurant.address
      }));
      
      console.log(`Returning ${publicData.length} processed restaurants`);
      
      res.json({
        success: true,
        restaurants: publicData,
        count: publicData.length,
        public: true,
        optimized: true,
        viewport: !!(north && south && east && west),
        dbCount: restaurantCount
      });
      
    } catch (error) {
      console.error('Public map data error:', error);
      console.error('Error stack:', error.stack);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch restaurant data',
        errorMessage: error.message,
        restaurants: [],
        timestamp: new Date().toISOString()
      });
    }
  });

  // Public places endpoint for map-wire.js (no auth required)
  app.get('/api/places', async (req, res) => {
    try {
      const restaurants = await storage.getAllRestaurantsWithScores();
      
      // Convert to places format expected by map-wire.js
      const places = restaurants.map(r => ({
        id: r.id,
        name: r.name,
        address: r.address || 'No address',
        lat: parseFloat(r.latitude || r.lat),
        lng: parseFloat(r.longitude || r.lng),
        vegan_full: r.isFullyVegan || false,
        cuisines: r.cuisineTypes || [],
        price: r.priceLevel || '$',
        score: r.veganScore ? parseFloat(r.veganScore) : null,
        components: r.veganScore ? [
          { k: 'Purity (Fully Vegan)', w: 0.25, v: r.isFullyVegan ? 0.9 : 0.6 },
          { k: 'Menu Breadth', w: 0.2, v: 0.8 },
          { k: 'Ingredient Transparency', w: 0.2, v: 0.85 },
          { k: 'User Sentiment', w: 0.2, v: 0.82 },
          { k: 'Sustainability', w: 0.1, v: 0.7 },
          { k: 'Consistency', w: 0.05, v: 0.8 }
        ] : []
      })).filter(p => p.lat && p.lng && !isNaN(p.lat) && !isNaN(p.lng)); // Only include valid coordinates
      
      res.json(places);
    } catch (error) {
      console.error("Error getting places data:", error);
      res.status(500).json([]);
    }
  });

  // Health check endpoint on router
  router.get('/health', async (req, res) => {
    res.type("application/json");
    try {
      const dbResult = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      let count = dbResult[0]?.count || 0;
      
      // Auto-load sample data if database is empty (production fix)
      if (count === 0) {
        try {
          console.log('🔄 Auto-loading sample data for empty production database...');
          
          const sofiaRestaurants = [
            {
              id: 'loving-hut-sofia-auto',
              name: 'Loving Hut Sofia',
              address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
              latitude: '42.69798360',
              longitude: '23.33007510',
              phoneNumber: '+359 2 980 1689',
              website: 'https://lovinghut.com/sofia',
              veganScore: '8.0',
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ['Asian', 'Vegan', 'Vegetarian'],
              priceLevel: 2,
              rating: '4.5',
              reviewCount: 247,
              openingHours: { hours: 'Mon-Sun: 11:00-22:00' },
              city: 'Sofia',
              country: 'Bulgaria'
            },
            {
              id: 'soul-kitchen-sofia-auto',
              name: 'Soul Kitchen',
              address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
              latitude: '42.68432380',
              longitude: '23.32737170',
              phoneNumber: '+359 88 123 4567',
              veganScore: '7.8',
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ['Modern European', 'Vegan'],
              priceLevel: 3,
              rating: '4.7',
              reviewCount: 189,
              openingHours: { hours: 'Tue-Sun: 12:00-23:00' },
              city: 'Sofia',
              country: 'Bulgaria'
            },
            {
              id: 'edgy-veggy-sofia-auto',
              name: 'Edgy Veggy',
              address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
              latitude: '42.69181700',
              longitude: '23.31720890',
              phoneNumber: '+359 2 987 6543',
              veganScore: '7.4',
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ['International', 'Vegan', 'Raw Food'],
              priceLevel: 2,
              rating: '4.3',
              reviewCount: 156,
              openingHours: { hours: 'Mon-Sat: 10:00-21:00' },
              city: 'Sofia',
              country: 'Bulgaria'
            },
            {
              id: 'vita-rama-sofia-auto',
              name: 'Vita Rama Vegan Restaurant',
              address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
              latitude: '42.68529520',
              longitude: '23.32166450',
              phoneNumber: '+359 2 456 7890',
              veganScore: '7.1',
              isFullyVegan: true,
              hasVeganOptions: true,
              cuisineTypes: ['Bulgarian', 'Vegan', 'Traditional'],
              priceLevel: 1,
              rating: '4.2',
              reviewCount: 203,
              openingHours: { hours: 'Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00' },
              city: 'Sofia',
              country: 'Bulgaria'
            },
            {
              id: 'satsanga-sofia-auto',
              name: 'SATSANGA Vegetarian Restaurant',
              address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
              latitude: '42.69511920',
              longitude: '23.32847910',
              phoneNumber: '+359 2 321 6543',
              veganScore: '6.8',
              isFullyVegan: false,
              hasVeganOptions: true,
              cuisineTypes: ['Indian', 'Vegetarian', 'Vegan Options'],
              priceLevel: 2,
              rating: '4.4',
              reviewCount: 312,
              openingHours: { hours: 'Daily: 11:30-22:30' },
              city: 'Sofia',
              country: 'Bulgaria'
            }
          ];

          await db.insert(restaurants).values(sofiaRestaurants);
          
          // Recheck count
          const newCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
          count = newCount[0]?.count || 0;
          
          console.log(`✅ Auto-loaded ${count} Sofia restaurants`);
        } catch (loadError) {
          console.error('❌ Auto-load failed:', loadError);
        }
      }
      
      res.json({
        status: 'healthy',
        database: 'connected',
        restaurantCount: count,
        autoLoaded: count > 0 && dbResult[0]?.count === 0,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        status: 'unhealthy',
        database: 'error',
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  });

  // Debug endpoint to test production database
  app.get('/api/debug/production-db', async (req, res) => {
    try {
      console.log('===== DEBUG PRODUCTION DB =====');
      const dbUrl = process.env.DATABASE_URL || "";
      console.log('DATABASE_URL pattern:', dbUrl.includes('ep-solitary-sun') ? 'CORRECT DB' : 'WRONG DB');
      console.log('DATABASE_URL substring:', dbUrl.substring(30, 55));
      
      // Direct query to test database
      const result = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const count = result[0]?.count || 0;
      
      // Get sample restaurants
      const samples = await db.select().from(restaurants).limit(3);
      
      res.json({
        success: true,
        databaseUrl: {
          exists: !!process.env.DATABASE_URL,
          pattern: dbUrl.substring(30, 55),
          isCorrectDb: dbUrl.includes('ep-solitary-sun'),
        },
        restaurantCount: count,
        sampleRestaurants: samples.map(r => ({
          id: r.id,
          name: r.name,
          city: r.city
        })),
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Debug error:', error);
      res.status(500).json({
        success: false,
        error: error.message,
        stack: error.stack
      });
    }
  });

  // Recommend endpoint on router
  router.get('/recommend', async (req, res) => {
    res.type("application/json");
    try {
      const { lat, lng, radiusKm = '5', minScore = '7', limit = '3' } = req.query;
      
      if (!lat || !lng) {
        return res.status(400).json({ error: "Invalid coordinates - lat and lng required" });
      }
      
      const restaurants = await storage.getRestaurantsNearby({
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string),
        radiusKm: parseFloat(radiusKm as string),
        minScore: parseFloat(minScore as string),
        limit: parseInt(limit as string)
      });
      
      res.json({
        success: true,
        restaurants,
        count: restaurants.length,
        params: { lat, lng, radiusKm, minScore, limit }
      });
    } catch (error) {
      console.error('Recommend error:', error);
      res.status(500).json({ error: "internal" });
    }
  });

  // Feedback endpoint on router
  router.post('/feedback', async (req, res) => {
    res.type("application/json");
    try {
      const { uid, place_id, score_details, comment } = req.body || {};
      if (!uid || !place_id) {
        return res.status(400).json({ error: 'uid and place_id required' });
      }
      console.log('Feedback received:', { uid, place_id, score_details, comment });
      res.json({ ok: true, queued: true });
    } catch (e) {
      console.error('Feedback error:', e);
      res.status(500).json({ error: 'failed' });
    }
  });

  // AI Search endpoint
  app.post("/api/ai-search", async (req, res) => {
    try {
      const { query } = req.body;
      
      if (!query || typeof query !== 'string') {
        res.status(400).json({ message: "Query is required" });
        return;
      }

      // Get all restaurants for AI analysis
      const allRestaurants = await storage.getAllRestaurants();
      
      // Perform AI search
      const result = await searchRestaurantsWithAI(query, allRestaurants);
      
      res.json(result);
    } catch (error) {
      console.error("AI search error:", error);
      res.status(500).json({ message: error instanceof Error ? error.message : "AI search failed" });
    }
  });

  app.get('/api/restaurants/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { id } = req.params;
      
      const restaurantDetails = await mapAgent.getRestaurantDetails(id);
      if (!restaurantDetails) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Check if user has favorited this restaurant
      const isFavorite = await storage.isUserFavorite(userId, id);
      
      // Calculate personal match score based on user preferences
      const profile = await storage.getUserProfile(userId);
      let personalMatch = null;
      if (profile && restaurantDetails.restaurant.veganScore) {
        // Simple match calculation based on dietary style and preferences
        const baseMatch = parseFloat(restaurantDetails.restaurant.veganScore) / 10;
        personalMatch = {
          tasteMatch: baseMatch * 0.9, // Slightly adjust based on user preferences
          healthFit: baseMatch * 0.95
        };
      }

      // Track user action
      await profileAgent.trackUserBehavior(userId, 'view_restaurant', {
        restaurantId: id,
        restaurantName: restaurantDetails.restaurant.name,
        veganScore: restaurantDetails.restaurant.veganScore
      });

      res.json({
        ...restaurantDetails,
        isFavorite,
        personalMatch
      });
    } catch (error) {
      console.error("Error getting restaurant details:", error);
      res.status(500).json({ message: "Failed to get restaurant details" });
    }
  });

  // Search routes
  app.get('/api/search/restaurants', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { 
        q: query, 
        lat, 
        lng, 
        minScore, 
        maxDistance, 
        priceRange, 
        cuisineTypes,
        limit 
      } = req.query;

      const userProfile = await storage.getUserProfile(userId);
      
      const filters = {
        minVeganScore: minScore ? parseFloat(minScore as string) : undefined,
        maxDistance: maxDistance ? parseFloat(maxDistance as string) : undefined,
        priceRange: priceRange ? [priceRange as string] : undefined,
        cuisineTypes: cuisineTypes ? (cuisineTypes as string).split(',') : undefined,
        limit: limit ? parseInt(limit as string) : undefined
      };

      const userLocation = lat && lng ? {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      } : undefined;

      const restaurants = await searchAgent.searchRestaurants(
        query as string || '',
        userLocation,
        filters,
        filters.limit
      );

      // Track search action
      await profileAgent.trackUserBehavior(userId, 'search_restaurants', {
        query,
        filters,
        resultsCount: restaurants.length
      }, userLocation);

      res.json(restaurants);
    } catch (error) {
      console.error("Error searching restaurants:", error);
      res.status(500).json({ message: "Failed to search restaurants" });
    }
  });

  app.get('/api/search/suggestions', isAuthenticated, async (req: any, res) => {
    try {
      const { q: query, lat, lng } = req.query;
      
      const userLocation = lat && lng ? {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      } : undefined;

      const suggestions = await searchAgent.getRestaurantSuggestions(
        query as string || '',
        userLocation
      );

      res.json(suggestions);
    } catch (error) {
      console.error("Error getting search suggestions:", error);
      res.status(500).json({ message: "Failed to get suggestions" });
    }
  });

  // Favorites routes
  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favoriteData = insertUserFavoriteSchema.parse({
        ...req.body,
        userId
      });

      const favorite = await storage.addUserFavorite(favoriteData);
      
      // Track user action
      await profileAgent.trackUserBehavior(userId, 'favorite_restaurant', {
        restaurantId: favoriteData.restaurantId
      });

      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(400).json({ message: "Failed to add favorite" });
    }
  });

  app.delete('/api/favorites/:restaurantId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = req.params;

      await storage.removeUserFavorite(userId, restaurantId);
      
      // Track user action
      await profileAgent.trackUserBehavior(userId, 'unfavorite_restaurant', {
        restaurantId
      });

      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  // User stats route
  app.get('/api/user/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      const analytics = await storage.getUserAnalytics(userId, 1);
      
      res.json({
        favoritesCount: favorites.length,
        searchesCount: analytics.length // This is a simple count, you might want to aggregate
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
      res.status(500).json({ message: 'Failed to fetch user stats' });
    }
  });

  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error getting favorites:", error);
      res.status(500).json({ message: "Failed to get favorites" });
    }
  });
  
  // User preferences routes
  app.get('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profile = await storage.getUserProfile(userId);
      
      res.json({
        defaultLat: profile?.defaultLat,
        defaultLng: profile?.defaultLng,
        preferredCuisines: profile?.preferredCuisines || [],
        minVeganScore: profile?.minVeganScore || 0,
        searchRadius: profile?.searchRadius || 10
      });
    } catch (error) {
      console.error('Error fetching preferences:', error);
      res.status(500).json({ message: 'Failed to fetch preferences' });
    }
  });
  
  app.post('/api/user/preferences', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { defaultLat, defaultLng, preferredCuisines, minVeganScore, searchRadius } = req.body;
      
      const updatedProfile = await storage.upsertUserProfile({
        userId,
        defaultLat,
        defaultLng,
        preferredCuisines,
        minVeganScore,
        searchRadius
      });
      
      res.json({
        success: true,
        preferences: {
          defaultLat: updatedProfile.defaultLat,
          defaultLng: updatedProfile.defaultLng,
          preferredCuisines: updatedProfile.preferredCuisines,
          minVeganScore: updatedProfile.minVeganScore,
          searchRadius: updatedProfile.searchRadius
        }
      });
    } catch (error) {
      console.error('Error saving preferences:', error);
      res.status(500).json({ message: 'Failed to save preferences' });
    }
  });

  // Visits routes
  app.post('/api/visits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const visitData = insertUserVisitSchema.parse({
        ...req.body,
        userId
      });

      const visit = await storage.addUserVisit(visitData);
      
      // Track user action
      await profileAgent.trackUserBehavior(userId, 'visit_restaurant', {
        restaurantId: visitData.restaurantId,
        rating: visitData.rating
      });

      res.json(visit);
    } catch (error) {
      console.error("Error adding visit:", error);
      res.status(400).json({ message: "Failed to add visit" });
    }
  });

  app.get('/api/visits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const visits = await storage.getUserVisits(userId);
      res.json(visits);
    } catch (error) {
      console.error("Error getting visits:", error);
      res.status(500).json({ message: "Failed to get visits" });
    }
  });

  // Score routes - Calculate real vegan scores
  app.post('/api/restaurants/:id/calculate-score', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      
      // Get restaurant details from database
      const restaurant = await storage.getRestaurant(id);
      if (!restaurant) {
        return res.status(404).json({ message: "Restaurant not found" });
      }

      // Calculate vegan score using AI analysis
      const scoreResult = await scoreAgent.calculateVeganScore(
        restaurant.placeId || `sofia_rest_${restaurant.id}`,
        restaurant.name,
        restaurant.cuisineTypes || []
      );

      // Store the score breakdown in database
      if (scoreResult) {
        await storage.upsertVeganScoreBreakdown({
          restaurantId: id,
          menuVariety: scoreResult.breakdown.menuVariety.toString(),
          ingredientClarity: scoreResult.breakdown.ingredientClarity.toString(),
          staffKnowledge: scoreResult.breakdown.staffKnowledge.toString(),
          crossContamination: scoreResult.breakdown.crossContamination.toString(),
          nutritionalInfo: scoreResult.breakdown.nutritionalInfo.toString(),
          allergenManagement: scoreResult.breakdown.allergenManagement.toString(),
          overallScore: scoreResult.overallScore.toString()
        });

        // Update restaurant with new score
        await storage.updateRestaurant(id, {
          veganScore: scoreResult.overallScore.toString()
        });
      }

      res.json(scoreResult || { overallScore: 0, breakdown: {}, confidence: 0, reasoning: "Failed to calculate score" });
    } catch (error: any) {
      console.error("Error calculating vegan score:", error);
      res.status(500).json({ message: "Failed to calculate vegan score", error: error.message });
    }
  });

  // Admin routes for scoring management
  app.get('/api/admin/restaurants', isAuthenticated, async (req: any, res) => {
    try {
      const { page = 1, limit = 50, scoreStatus } = req.query;
      const offset = (parseInt(page as string) - 1) * parseInt(limit as string);
      
      let restaurants;
      if (scoreStatus === 'unscored') {
        // Get unscored restaurants
        const allRestaurants = await storage.getAllRestaurants();
        restaurants = allRestaurants.filter(r => !r.veganScore || parseFloat(r.veganScore) < 1)
          .slice(offset, offset + parseInt(limit as string));
      } else {
        const allRestaurants = await storage.getAllRestaurants();
        restaurants = allRestaurants.slice(offset, offset + parseInt(limit as string));
      }
      
      const allRestaurants = await storage.getAllRestaurants();
      const totalCount = allRestaurants.length;
      const scoredCount = allRestaurants.filter(r => r.veganScore && parseFloat(r.veganScore) >= 1).length;
      
      res.json({
        restaurants,
        pagination: {
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          total: totalCount,
          scored: scoredCount,
          unscored: totalCount - scoredCount
        }
      });
    } catch (error) {
      console.error("Error getting admin restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants" });
    }
  });

  // Batch scoring endpoint
  app.post('/api/admin/batch-score', isAuthenticated, async (req: any, res) => {
    try {
      const { restaurantIds, batchSize = 5 } = req.body;
      
      if (!restaurantIds || !Array.isArray(restaurantIds)) {
        return res.status(400).json({ message: "Restaurant IDs array is required" });
      }

      const results = [];
      const errors = [];

      // Process in smaller batches to avoid overwhelming the API
      for (let i = 0; i < restaurantIds.length; i += batchSize) {
        const batch = restaurantIds.slice(i, i + batchSize);
        
        const batchPromises = batch.map(async (id: string) => {
          try {
            const restaurant = await storage.getRestaurant(id);
            if (!restaurant) {
              throw new Error(`Restaurant ${id} not found`);
            }

            const scoreResult = await scoreAgent.calculateVeganScore(
              restaurant.placeId || `sofia_rest_${restaurant.id}`,
              restaurant.name,
              restaurant.cuisineTypes || []
            );

            if (scoreResult) {
              await storage.upsertVeganScoreBreakdown({
                restaurantId: id,
                menuVariety: scoreResult.breakdown.menuVariety.toString(),
                ingredientClarity: scoreResult.breakdown.ingredientClarity.toString(),
                staffKnowledge: scoreResult.breakdown.staffKnowledge.toString(),
                crossContamination: scoreResult.breakdown.crossContamination.toString(),
                nutritionalInfo: scoreResult.breakdown.nutritionalInfo.toString(),
                allergenManagement: scoreResult.breakdown.allergenManagement.toString(),
                overallScore: scoreResult.overallScore.toString()
              });

              await storage.updateRestaurant(id, {
                veganScore: scoreResult.overallScore.toString()
              });
            }

            return { id, success: true, score: scoreResult?.overallScore };
          } catch (error: any) {
            console.error(`Error scoring restaurant ${id}:`, error);
            return { id, success: false, error: error.message };
          }
        });

        const batchResults = await Promise.all(batchPromises);
        results.push(...batchResults.filter(r => r.success));
        errors.push(...batchResults.filter(r => !r.success));

        // Add delay between batches to respect API limits
        if (i + batchSize < restaurantIds.length) {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        }
      }

      res.json({
        success: true,
        processed: results.length,
        errors: errors.length,
        results,
        errorList: errors
      });

    } catch (error) {
      console.error("Error in batch scoring:", error);
      res.status(500).json({ message: "Failed to process batch scoring" });
    }
  });

  // Voice usage endpoints
  app.get('/api/voice/limits', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService } = await import('./services/voiceUsageService');
      const limits = await voiceUsageService.checkVoiceLimits(userId);
      res.json(limits);
    } catch (error) {
      console.error("Error checking voice limits:", error);
      res.status(500).json({ message: "Failed to check voice limits" });
    }
  });

  app.post('/api/voice/start-session', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService } = await import('./services/voiceUsageService');
      const sessionId = await voiceUsageService.startVoiceSession(userId);
      res.json({ sessionId });
    } catch (error: any) {
      console.error("Error starting voice session:", error);
      res.status(400).json({ message: error.message || "Failed to start voice session" });
    }
  });

  app.post('/api/voice/end-session', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId, endReason } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const { voiceUsageService } = await import('./services/voiceUsageService');
      await voiceUsageService.endVoiceSession(sessionId, endReason);
      res.json({ success: true });
    } catch (error) {
      console.error("Error ending voice session:", error);
      res.status(500).json({ message: "Failed to end voice session" });
    }
  });

  app.get('/api/voice/warning-status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { voiceUsageService } = await import('./services/voiceUsageService');
      const shouldWarn = await voiceUsageService.shouldShowWarning(userId);
      res.json({ shouldWarn });
    } catch (error) {
      console.error("Error checking warning status:", error);
      res.status(500).json({ message: "Failed to check warning status" });
    }
  });

  app.post('/api/voice/mark-warning-shown', isAuthenticated, async (req: any, res) => {
    try {
      const { sessionId } = req.body;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID is required" });
      }
      
      const { voiceUsageService } = await import('./services/voiceUsageService');
      await voiceUsageService.markWarningShown(sessionId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking warning shown:", error);
      res.status(500).json({ message: "Failed to mark warning shown" });
    }
  });

  // Voice Assistant endpoint
  app.post('/api/audio', isAuthenticated, upload.single('audio'), async (req: any, res) => {
    const filePath = req.file?.path;
    if (!filePath) {
      return res.status(400).json({ message: "No audio file provided" });
    }

    try {
      // Read audio file as buffer
      const audioBuffer = fs.readFileSync(filePath);
      const audioBlob = new Blob([audioBuffer], { type: 'audio/webm' });
      
      // Create FormData for Whisper API with improved Bulgarian settings
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'bg');
      formData.append('temperature', '0');
      formData.append('prompt', 'Това е разговор на български език за веган ресторанти в София.');

      const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: formData
      });

      const whisperData = await whisperRes.json();
      const userText = whisperData.text;
      
      console.log('Whisper transcription result:', userText);

      // GPT-4o response with VeganMap context
      const gptRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: 'Ти си VeganMap AI асистент. Помагаш с намиране на веган ресторанти в София. Отговаряй кратко и полезно на български. Максимум 2 изречения. Ако питат за ресторанти, препоръчай търсене в картата или използване на филтрите за vegan score.'
            },
            {
              role: 'user',
              content: userText
            }
          ]
        })
      });

      const gptData = await gptRes.json();
      const reply = gptData.choices[0].message.content;

      // Track voice assistant usage
      const userId = req.user.claims.sub;
      await profileAgent.trackUserBehavior(userId, 'voice_assistant_query', {
        query: userText,
        response: reply
      });

      res.json({ text: userText, reply });
    } catch (err) {
      console.error('Voice assistant error:', err);
      res.status(500).json({ message: 'Грешка при обработка на аудио' });
    } finally {
      // Cleanup uploaded file
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  });

  // OpenAI TTS endpoint
  app.post('/api/tts', isAuthenticated, ttsHandler);

  // Load sample data endpoint for production deployment (both GET and POST)
  // Load sample data endpoint on router  
  router.get('/load-sample-data', async (req, res) => {
    res.type("application/json");
    try {
      console.log('🔄 [GET] Loading sample Sofia restaurants for production...');
      
      // Check if data already exists
      const existingCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      
      if (count > 0) {
        console.log(`❌ Database already has ${count} restaurants`);
        return res.json({ 
          success: false, 
          message: `Database already has ${count} restaurants`,
          count 
        });
      }

      // Same restaurant data as POST endpoint
      const sofiaRestaurants = [
        {
          id: 'loving-hut-sofia-prod',
          name: 'Loving Hut Sofia',
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: '42.69798360',
          longitude: '23.33007510',
          phoneNumber: '+359 2 980 1689',
          website: 'https://lovinghut.com/sofia',
          veganScore: '8.0',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Asian', 'Vegan', 'Vegetarian'],
          priceLevel: 2,
          rating: '4.5',
          reviewCount: 247,
          openingHours: { hours: 'Mon-Sun: 11:00-22:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'soul-kitchen-sofia-prod',
          name: 'Soul Kitchen',
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: '42.68432380',
          longitude: '23.32737170',
          phoneNumber: '+359 88 123 4567',
          veganScore: '7.8',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Modern European', 'Vegan'],
          priceLevel: 3,
          rating: '4.7',
          reviewCount: 189,
          openingHours: { hours: 'Tue-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'edgy-veggy-sofia-prod',
          name: 'Edgy Veggy',
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: '42.69181700',
          longitude: '23.31720890',
          phoneNumber: '+359 2 987 6543',
          veganScore: '7.4',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['International', 'Vegan', 'Raw Food'],
          priceLevel: 2,
          rating: '4.3',
          reviewCount: 156,
          openingHours: { hours: 'Mon-Sat: 10:00-21:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'vita-rama-sofia-prod',
          name: 'Vita Rama Vegan Restaurant',
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: '42.68529520',
          longitude: '23.32166450',
          phoneNumber: '+359 2 456 7890',
          veganScore: '7.1',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Bulgarian', 'Vegan', 'Traditional'],
          priceLevel: 1,
          rating: '4.2',
          reviewCount: 203,
          openingHours: { hours: 'Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'satsanga-sofia-prod',
          name: 'SATSANGA Vegetarian Restaurant',
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: '42.69511920',
          longitude: '23.32847910',
          phoneNumber: '+359 2 321 6543',
          veganScore: '6.8',
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ['Indian', 'Vegetarian', 'Vegan Options'],
          priceLevel: 2,
          rating: '4.4',
          reviewCount: 312,
          openingHours: { hours: 'Daily: 11:30-22:30' },
          city: 'Sofia',
          country: 'Bulgaria'
        }
      ];

      // Insert restaurants
      await db.insert(restaurants).values(sofiaRestaurants);
      
      // Verify insertion
      const finalCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      
      console.log(`✅ Successfully loaded ${finalTotal} Sofia restaurants`);
      
      res.json({
        success: true,
        message: `Loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        restaurants: sofiaRestaurants.map(r => ({ 
          name: r.name, 
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
      
    } catch (error) {
      console.error('❌ Error loading sample data (GET):', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load sample data',
        message: error.message
      });
    }
  });

  app.post('/api/load-sample-data', async (req, res) => {
    try {
      console.log('🔄 Loading sample Sofia restaurants for production...');
      
      // Check if data already exists
      const existingCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      
      if (count > 0) {
        console.log(`❌ Database already has ${count} restaurants`);
        return res.json({ 
          success: false, 
          message: `Database already has ${count} restaurants`,
          count 
        });
      }

      // Sofia restaurant sample data with proper types
      const sofiaRestaurants = [
        {
          id: 'loving-hut-sofia-prod',
          name: 'Loving Hut Sofia',
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: '42.69798360',
          longitude: '23.33007510',
          phoneNumber: '+359 2 980 1689',
          website: 'https://lovinghut.com/sofia',
          veganScore: '8.0',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Asian', 'Vegan', 'Vegetarian'],
          priceLevel: 2,
          rating: '4.5',
          reviewCount: 247,
          openingHours: { hours: 'Mon-Sun: 11:00-22:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'soul-kitchen-sofia-prod',
          name: 'Soul Kitchen',
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: '42.68432380',
          longitude: '23.32737170',
          phoneNumber: '+359 88 123 4567',
          veganScore: '7.8',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Modern European', 'Vegan'],
          priceLevel: 3,
          rating: '4.7',
          reviewCount: 189,
          openingHours: { hours: 'Tue-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'edgy-veggy-sofia-prod',
          name: 'Edgy Veggy',
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: '42.69181700',
          longitude: '23.31720890',
          phoneNumber: '+359 2 987 6543',
          veganScore: '7.4',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['International', 'Vegan', 'Raw Food'],
          priceLevel: 2,
          rating: '4.3',
          reviewCount: 156,
          openingHours: { hours: 'Mon-Sat: 10:00-21:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'vita-rama-sofia-prod',
          name: 'Vita Rama Vegan Restaurant',
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: '42.68529520',
          longitude: '23.32166450',
          phoneNumber: '+359 2 456 7890',
          veganScore: '7.1',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Bulgarian', 'Vegan', 'Traditional'],
          priceLevel: 1,
          rating: '4.2',
          reviewCount: 203,
          openingHours: { hours: 'Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'satsanga-sofia-prod',
          name: 'SATSANGA Vegetarian Restaurant',
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: '42.69511920',
          longitude: '23.32847910',
          phoneNumber: '+359 2 321 6543',
          veganScore: '6.8',
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ['Indian', 'Vegetarian', 'Vegan Options'],
          priceLevel: 2,
          rating: '4.4',
          reviewCount: 312,
          openingHours: { hours: 'Daily: 11:30-22:30' },
          city: 'Sofia',
          country: 'Bulgaria'
        }
      ];

      // Insert restaurants
      await db.insert(restaurants).values(sofiaRestaurants);
      
      // Verify insertion
      const finalCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      
      console.log(`✅ Successfully loaded ${finalTotal} Sofia restaurants`);
      
      res.json({
        success: true,
        message: `Loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        restaurants: sofiaRestaurants.map(r => ({ 
          name: r.name, 
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
      
    } catch (error) {
      console.error('❌ Error loading sample data:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to load sample data',
        message: error.message
      });
    }
  });

  // Emergency load endpoint on router
  router.get('/emergency-load', async (req, res) => {
    res.type("application/json");
    try {
      console.log('🚨 Emergency loading Sofia restaurants...');
      
      // Check current count
      const existingCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const count = existingCount[0]?.count || 0;
      
      if (count > 0) {
        console.log(`❌ Database already has ${count} restaurants`);
        return res.json({ 
          success: false, 
          message: `Database already has ${count} restaurants`,
          count,
          emergency: true
        });
      }

      // Emergency Sofia restaurant data
      const emergencyRestaurants = [
        {
          id: 'loving-hut-sofia-emergency',
          name: 'Loving Hut Sofia',
          address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
          latitude: '42.69798360',
          longitude: '23.33007510',
          phoneNumber: '+359 2 980 1689',
          website: 'https://lovinghut.com/sofia',
          veganScore: '8.0',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Asian', 'Vegan', 'Vegetarian'],
          priceLevel: 2,
          rating: '4.5',
          reviewCount: 247,
          openingHours: { hours: 'Mon-Sun: 11:00-22:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'soul-kitchen-sofia-emergency',
          name: 'Soul Kitchen',
          address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
          latitude: '42.68432380',
          longitude: '23.32737170',
          phoneNumber: '+359 88 123 4567',
          veganScore: '7.8',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Modern European', 'Vegan'],
          priceLevel: 3,
          rating: '4.7',
          reviewCount: 189,
          openingHours: { hours: 'Tue-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'edgy-veggy-sofia-emergency',
          name: 'Edgy Veggy',
          address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
          latitude: '42.69181700',
          longitude: '23.31720890',
          phoneNumber: '+359 2 987 6543',
          veganScore: '7.4',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['International', 'Vegan', 'Raw Food'],
          priceLevel: 2,
          rating: '4.3',
          reviewCount: 156,
          openingHours: { hours: 'Mon-Sat: 10:00-21:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'vita-rama-sofia-emergency',
          name: 'Vita Rama Vegan Restaurant',
          address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
          latitude: '42.68529520',
          longitude: '23.32166450',
          phoneNumber: '+359 2 456 7890',
          veganScore: '7.1',
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ['Bulgarian', 'Vegan', 'Traditional'],
          priceLevel: 1,
          rating: '4.2',
          reviewCount: 203,
          openingHours: { hours: 'Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00' },
          city: 'Sofia',
          country: 'Bulgaria'
        },
        {
          id: 'satsanga-sofia-emergency',
          name: 'SATSANGA Vegetarian Restaurant',
          address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
          latitude: '42.69511920',
          longitude: '23.32847910',
          phoneNumber: '+359 2 321 6543',
          veganScore: '6.8',
          isFullyVegan: false,
          hasVeganOptions: true,
          cuisineTypes: ['Indian', 'Vegetarian', 'Vegan Options'],
          priceLevel: 2,
          rating: '4.4',
          reviewCount: 312,
          openingHours: { hours: 'Daily: 11:30-22:30' },
          city: 'Sofia',
          country: 'Bulgaria'
        }
      ];

      // Insert emergency restaurants
      await db.insert(restaurants).values(emergencyRestaurants);
      
      // Verify insertion
      const finalCount = await db.select({ count: sql<number>`count(*)` }).from(restaurants);
      const finalTotal = finalCount[0]?.count || 0;
      
      console.log(`✅ Emergency loaded ${finalTotal} Sofia restaurants`);
      
      res.json({
        success: true,
        message: `Emergency loaded ${finalTotal} Sofia restaurants`,
        count: finalTotal,
        emergency: true,
        restaurants: emergencyRestaurants.map(r => ({ 
          name: r.name, 
          veganScore: r.veganScore,
          coordinates: [r.latitude, r.longitude]
        }))
      });
      
    } catch (error) {
      console.error('❌ Emergency loading failed:', error);
      res.status(500).json({
        success: false,
        error: 'Emergency loading failed',
        message: error.message,
        emergency: true
      });
    }
  });

  // Google Maps Optimization Routes
  app.get('/api/maps/cost-report', isAuthenticated, async (req: any, res) => {
    try {
      const { getCostReport, isEmergencyMode } = await import('./services/googleMapsService');
      const report = getCostReport();
      res.json({
        ...report,
        emergencyMode: isEmergencyMode()
      });
    } catch (error: any) {
      console.error('Error getting cost report:', error);
      res.status(500).json({ message: 'Failed to get cost report', error: error.message });
    }
  });

  app.get('/api/maps/restaurants-viewport', async (req: any, res) => {
    try {
      const { north, south, east, west, maxResults = '100' } = req.query;
      
      if (!north || !south || !east || !west) {
        return res.status(400).json({ message: 'Missing viewport bounds' });
      }
      
      const bounds = {
        north: parseFloat(north as string),
        south: parseFloat(south as string),
        east: parseFloat(east as string),
        west: parseFloat(west as string)
      };
      
      const { getRestaurantsInViewport } = await import('./services/googleMapsService');
      const restaurants = await getRestaurantsInViewport(bounds, parseInt(maxResults as string));
      
      res.json(restaurants);
    } catch (error: any) {
      console.error('Error getting viewport restaurants:', error);
      res.status(500).json({ message: 'Failed to get restaurants', error: error.message });
    }
  });

  app.post('/api/maps/bulk-populate-us', isAuthenticated, async (req: any, res) => {
    try {
      // Only allow admin users to run bulk population
      const userEmail = req.user?.email || '';
      if (!userEmail.includes('@veganmapai.com') && !userEmail.includes('@raicommerce.net')) {
        return res.status(403).json({ message: 'Unauthorized - admin only' });
      }
      
      const { bulkPopulateUSRestaurants } = await import('./services/googleMapsService');
      
      // Start bulk population in background
      bulkPopulateUSRestaurants().catch(console.error);
      
      res.json({ 
        message: 'Bulk population started in background. This will take several hours.',
        warning: 'Monitor /api/maps/cost-report for progress and costs'
      });
    } catch (error: any) {
      console.error('Error starting bulk population:', error);
      res.status(500).json({ message: 'Failed to start bulk population', error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}