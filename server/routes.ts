import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerApiStatsRoutes } from "./routes/api-stats";
import { Client } from '@googlemaps/google-maps-services-js';
import multer from 'multer';
import fs from 'fs';
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
      console.log(`Returning ${restaurants.length} restaurants with AI scores`);
      res.json(restaurants);
    } catch (error) {
      console.error("Error getting all restaurants:", error);
      res.status(500).json({ message: "Failed to get restaurants" });
    }
  });

  // PUBLIC endpoint for map data (no authentication required)
  app.get('/api/restaurants/public/map-data', async (req, res) => {
    try {
      console.log('Public map data request received');
      console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
      console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 30) + '...');
      
      // Get all restaurants with scores for public viewing
      const restaurants = await storage.getAllRestaurantsWithScores();
      
      // Return limited data for public access (essential fields only)
      const publicData = restaurants.map(restaurant => ({
        id: restaurant.id,
        name: restaurant.name,
        latitude: restaurant.latitude,
        longitude: restaurant.longitude,
        veganScore: restaurant.veganScore,
        cuisineTypes: restaurant.cuisineTypes,
        rating: restaurant.rating,
        priceLevel: restaurant.priceLevel,
        address: restaurant.address
      }));
      
      console.log(`Returning ${publicData.length} restaurants for public map view`);
      
      res.json({
        success: true,
        restaurants: publicData,
        count: publicData.length,
        public: true
      });
      
    } catch (error) {
      console.error('Public map data error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch restaurant data',
        restaurants: []
      });
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