import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  mapAgent, 
  searchAgent, 
  scoreAgent, 
  reviewAgent, 
  profileAgent, 
  analyticsAgent 
} from "./agents";
import { chatWithAI } from "./services/openai";
import { insertUserProfileSchema, insertUserFavoriteSchema, insertUserVisitSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      const profile = await storage.getUserProfile(userId);
      
      res.json({ 
        ...user, 
        profile,
        hasProfile: !!profile,
        isProfileComplete: profile?.isProfileComplete || false
      });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Profile routes
  app.post('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const profileData = insertUserProfileSchema.parse(req.body);
      
      // Add userId to the profile data for creation
      const fullProfileData = { ...profileData, userId };
      const profile = await profileAgent.createUserProfile(userId, fullProfileData);
      res.json(profile);
    } catch (error) {
      console.error("Error creating profile:", error);
      res.status(400).json({ message: "Failed to create profile" });
    }
  });

  app.put('/api/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const updates = insertUserProfileSchema.partial().parse(req.body);
      
      const profile = await profileAgent.updateUserProfile(userId, updates);
      res.json(profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(400).json({ message: "Failed to update profile" });
    }
  });

  app.get('/api/profile/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const stats = await profileAgent.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error getting user stats:", error);
      res.status(500).json({ message: "Failed to get user stats" });
    }
  });

  // Map routes - add restaurants from Google Places
  app.post('/api/restaurants/populate', isAuthenticated, async (req: any, res) => {
    try {
      const { lat, lng, radius } = req.body;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Latitude and longitude required" });
      }

      await mapAgent.fetchAndStoreRestaurants(
        parseFloat(lat), 
        parseFloat(lng), 
        radius ? parseFloat(radius) : 2000
      );

      const restaurants = await mapAgent.getRestaurantsInRadius(
        parseFloat(lat), 
        parseFloat(lng), 
        2
      );

      res.json({ 
        message: "Restaurants populated successfully", 
        count: restaurants.length,
        restaurants 
      });
    } catch (error) {
      console.error("Error populating restaurants:", error);
      res.status(500).json({ message: "Failed to populate restaurants" });
    }
  });

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
        radius ? parseFloat(radius as string) : 2
      );

      // Track user action
      await profileAgent.trackUserBehavior(userId, 'search_nearby', {
        location: { lat: parseFloat(lat as string), lng: parseFloat(lng as string) },
        radius: radius || 2,
        resultsCount: restaurants.length
      }, { lat: parseFloat(lat as string), lng: parseFloat(lng as string) });

      res.json(restaurants);
    } catch (error) {
      console.error("Error getting nearby restaurants:", error);
      res.status(500).json({ message: "Failed to get nearby restaurants" });
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
      
      // Calculate personal match
      const profile = await storage.getUserProfile(userId);
      let personalMatch = null;
      if (profile) {
        personalMatch = await scoreAgent.calculatePersonalMatch(id, profile);
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
        maxDistance: maxDistance ? parseInt(maxDistance as string) : userProfile?.maxDistance,
        priceRange: priceRange ? (priceRange as string).split(',') : undefined,
        cuisineTypes: cuisineTypes ? (cuisineTypes as string).split(',') : undefined,
        allergies: userProfile?.allergies || undefined
      };

      const userLocation = lat && lng ? {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      } : undefined;

      const restaurants = await searchAgent.searchRestaurants(
        query as string || '',
        userLocation,
        filters,
        limit ? parseInt(limit as string) : 20
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

  // AI Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;

      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get user context
      const [userProfile, chatSession, nearbyRestaurants] = await Promise.all([
        storage.getUserProfile(userId),
        storage.getChatSession(userId),
        // Get some nearby restaurants for context (if user location available)
        storage.getRestaurantsInRadius(40.7128, -74.0060, 5) // Default to NYC, would use actual location
      ]);

      const chatHistory = (chatSession?.messages as any[]) || [];
      
      const { chatWithAI } = await import('./services/aiChat');
      const response = await chatWithAI(message, {
        userProfile,
        nearbyRestaurants: nearbyRestaurants.slice(0, 5),
        chatHistory: chatHistory.slice(-10) // Last 10 messages
      });

      // Update chat session
      const updatedMessages = [
        ...chatHistory,
        { role: 'user', content: message, timestamp: new Date() },
        { role: 'assistant', content: response.message, timestamp: new Date() }
      ];

      await storage.upsertChatSession({
        userId,
        messages: updatedMessages
      });

      // Track chat interaction
      await profileAgent.trackUserBehavior(userId, 'ai_chat', {
        messageLength: message.length,
        responseLength: response.message.length,
        suggestionsProvided: response.suggestions?.length || 0
      });

      res.json(response);
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const chatSession = await storage.getChatSession(userId);
      
      res.json({
        messages: chatSession?.messages || []
      });
    } catch (error) {
      console.error("Error getting chat history:", error);
      res.status(500).json({ message: "Failed to get chat history" });
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

  // Score routes
  app.get('/api/restaurants/:id/score', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const breakdown = await scoreAgent.getScoreBreakdown(id);
      
      if (!breakdown) {
        return res.status(404).json({ message: "Score breakdown not found" });
      }

      const explanation = await scoreAgent.getScoreExplanation(id);
      
      res.json({
        breakdown,
        explanation
      });
    } catch (error) {
      console.error("Error getting score breakdown:", error);
      res.status(500).json({ message: "Failed to get score breakdown" });
    }
  });

  // Recommendations routes
  app.get('/api/recommendations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { lat, lng, limit } = req.query;

      if (!lat || !lng) {
        return res.status(400).json({ message: "Location required for recommendations" });
      }

      const userLocation = {
        lat: parseFloat(lat as string),
        lng: parseFloat(lng as string)
      };

      const recommendations = await profileAgent.generatePersonalizedRecommendations(
        userId,
        userLocation,
        limit ? parseInt(limit as string) : 10
      );

      // Get restaurant details for recommendations
      const restaurantDetails = await Promise.all(
        recommendations.map(id => storage.getRestaurant(id))
      );

      const validRestaurants = restaurantDetails.filter(r => r !== undefined);

      // Track recommendations
      await profileAgent.trackUserBehavior(userId, 'view_recommendations', {
        recommendationsCount: validRestaurants.length,
        location: userLocation
      }, userLocation);

      res.json(validRestaurants);
    } catch (error) {
      console.error("Error getting recommendations:", error);
      res.status(500).json({ message: "Failed to get recommendations" });
    }
  });

  // Analytics routes (protected - could add admin check)
  app.get('/api/analytics/trends', isAuthenticated, async (req: any, res) => {
    try {
      const { limit } = req.query;
      const trends = await analyticsAgent.getPopularTrends(
        limit ? parseInt(limit as string) : 10
      );
      res.json(trends);
    } catch (error) {
      console.error("Error getting trends:", error);
      res.status(500).json({ message: "Failed to get trends" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
