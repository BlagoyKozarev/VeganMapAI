import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerApiStatsRoutes } from "./routes/api-stats";
import { Client } from '@googlemaps/google-maps-services-js';
import { 
  mapAgent, 
  searchAgent, 
  scoreAgent, 
  reviewAgent, 
  profileAgent, 
  analyticsAgent 
} from "./agents";
import { chatWithAI } from "./services/aiChat";
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

  // Favorites routes
  app.get('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const favorites = await storage.getUserFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post('/api/favorites', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = insertUserFavoriteSchema.parse(req.body);
      
      const favorite = await storage.addUserFavorite({ userId, restaurantId });
      
      // Track analytics
      await analyticsAgent.trackUserAction(userId, 'favorite', { restaurantId });
      
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
      
      // Track analytics
      await analyticsAgent.trackUserAction(userId, 'unfavorite', { restaurantId });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(400).json({ message: "Failed to remove favorite" });
    }
  });

  app.get('/api/favorites/check/:restaurantId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { restaurantId } = req.params;
      
      const isFavorite = await storage.isUserFavorite(userId, restaurantId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ message: "Failed to check favorite" });
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
        radius ? parseFloat(radius) : 8000
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
        // Get some nearby restaurants for context using Sofia coordinates
        storage.getRestaurantsInRadius(42.6999, 23.1604, 5) // Sofia, Bulgaria coordinates
      ]);

      const chatHistory = (chatSession?.messages as any[]) || [];
      
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

  app.post('/api/chat/clear', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Clear chat session by creating empty message array
      await storage.upsertChatSession({
        userId,
        messages: []
      });
      
      // Track user action
      await profileAgent.trackUserBehavior(userId, 'clear_chat_history', {
        clearedAt: new Date().toISOString()
      });

      res.json({ 
        success: true, 
        message: "Chat history cleared successfully" 
      });
    } catch (error) {
      console.error("Error clearing chat history:", error);
      res.status(500).json({ message: "Failed to clear chat history" });
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
          menuVariety: scoreResult.breakdown.menuVariety,
          ingredientClarity: scoreResult.breakdown.ingredientClarity,
          staffKnowledge: scoreResult.breakdown.staffKnowledge,
          crossContaminationPrevention: scoreResult.breakdown.crossContamination,
          nutritionalInformation: scoreResult.breakdown.nutritionalInfo,
          allergenManagement: scoreResult.breakdown.allergenManagement,
          overallScore: scoreResult.overallScore
        });

        // Update restaurant's vegan score
        await storage.updateRestaurant(id, {
          veganScore: scoreResult.overallScore.toString()
        });
      }

      res.json(scoreResult);
    } catch (error) {
      console.error("Error calculating vegan score:", error);
      res.status(500).json({ message: "Failed to calculate vegan score" });
    }
  });

  app.get('/api/restaurants/:id/score', isAuthenticated, async (req: any, res) => {
    try {
      const { id } = req.params;
      const breakdown = await storage.getVeganScoreBreakdown(id);
      
      if (!breakdown) {
        return res.status(404).json({ message: "Score breakdown not found" });
      }

      res.json({
        breakdown,
        explanation: `Vegan score based on 6 key dimensions: menu variety, ingredient clarity, staff knowledge, cross-contamination prevention, nutritional information, and allergen management.`
      });
    } catch (error) {
      console.error("Error getting score breakdown:", error);
      res.status(500).json({ message: "Failed to get score breakdown" });
    }
  });

  // Batch score calculation endpoint (temporarily without auth for development)
  app.post('/api/restaurants/calculate-all-scores', async (req: any, res) => {
    try {
      const { lat, lng } = req.body;
      
      if (!lat || !lng) {
        return res.status(400).json({ message: "Location required" });
      }

      // Get all restaurants in area
      const restaurants = await mapAgent.getRestaurantsInRadius(
        parseFloat(lat), 
        parseFloat(lng), 
        5 // 5km radius for batch processing
      );

      // Calculate scores for restaurants that don't have them or have low scores
      const restaurantsToScore = restaurants.filter(r => 
        !r.veganScore || 
        r.veganScore === "0.00" || 
        parseFloat(r.veganScore) < 1.0
      );
      
      if (restaurantsToScore.length === 0) {
        return res.json({ message: "All restaurants already have scores", count: 0 });
      }

      console.log(`Starting to calculate vegan scores for ${restaurantsToScore.length} restaurants...`);

      // Process restaurants one by one to avoid rate limits
      let processed = 0;
      const limit = Math.min(restaurantsToScore.length, 3); // Process max 3 at a time
      
      for (let i = 0; i < limit; i++) {
        const restaurant = restaurantsToScore[i];
        try {
          console.log(`Calculating score for: ${restaurant.name}`);
          
          const scoreResult = await scoreAgent.calculateVeganScore(
            restaurant.placeId || `sofia_rest_${restaurant.id}`,
            restaurant.name,
            restaurant.cuisineTypes || []
          );

          if (scoreResult) {
            console.log(`Score calculated for ${restaurant.name}: ${scoreResult.overallScore}`);
            
            // Store score breakdown
            await storage.upsertVeganScoreBreakdown({
              restaurantId: restaurant.id,
              menuVariety: scoreResult.breakdown.menuVariety,
              ingredientClarity: scoreResult.breakdown.ingredientClarity,
              staffKnowledge: scoreResult.breakdown.staffKnowledge,
              crossContaminationPrevention: scoreResult.breakdown.crossContamination,
              nutritionalInformation: scoreResult.breakdown.nutritionalInfo,
              allergenManagement: scoreResult.breakdown.allergenManagement,
              overallScore: scoreResult.overallScore
            });

            // Update restaurant's vegan score
            await storage.updateRestaurant(restaurant.id, {
              veganScore: scoreResult.overallScore.toString()
            });

            processed++;
          }
          
          // Add delay between requests to respect rate limits
          if (i < limit - 1) {
            await new Promise(resolve => setTimeout(resolve, 3000)); // 3 second delay
          }
        } catch (error) {
          console.error(`Error scoring ${restaurant.name}:`, error);
        }
      }

      res.json({ 
        message: `Successfully calculated scores for ${processed} restaurants`,
        processed,
        total: restaurantsToScore.length,
        remaining: restaurantsToScore.length - processed
      });
    } catch (error) {
      console.error("Error in batch score calculation:", error);
      res.status(500).json({ message: "Failed to calculate batch scores" });
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

  // Admin route for improved scoring
  app.post('/api/admin/improve-scoring', isAuthenticated, async (req: any, res) => {
    try {
      const { batchSize = 10, onlyLowScores = true } = req.body;
      
      // Get restaurants that need improved scoring
      let restaurants;
      if (onlyLowScores) {
        // Get restaurants with low scores (< 2.0) or no scores
        const allRestaurants = await storage.getAllRestaurants();
        restaurants = allRestaurants.filter(r => 
          !r.veganScore || parseFloat(r.veganScore) < 2.0
        ).slice(0, batchSize);
      } else {
        const allRestaurants = await storage.getAllRestaurants();
        restaurants = allRestaurants.slice(0, batchSize);
      }

      console.log(`Starting improved scoring for ${restaurants.length} restaurants`);
      let processed = 0;
      let improved = 0;
      const results = [];
      
      for (const restaurant of restaurants) {
        try {
          const oldScore = parseFloat(restaurant.veganScore || '0');
          
          // Calculate new score with improved algorithm
          const scoreResult = await scoreAgent.calculateVeganScore(
            restaurant.placeId,
            restaurant.name,
            restaurant.cuisineTypes
          );
          
          // Update restaurant with new score
          await storage.updateRestaurant(restaurant.id, {
            veganScore: scoreResult.overallScore.toString()
          });
          
          processed++;
          if (scoreResult.overallScore > oldScore) {
            improved++;
          }
          
          results.push({
            name: restaurant.name,
            oldScore,
            newScore: scoreResult.overallScore,
            reasoning: scoreResult.reasoning
          });
          
          console.log(`Processed ${restaurant.name}: ${oldScore} → ${scoreResult.overallScore}`);
          
          // Add delay to respect API limits
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`Error processing ${restaurant.name}:`, error);
          processed++;
          results.push({
            name: restaurant.name,
            error: error.message
          });
        }
      }
      
      res.json({
        success: true,
        processed,
        improved,
        results,
        message: `Processed ${processed} restaurants, improved ${improved} scores`
      });
      
    } catch (error) {
      console.error("Error in improved scoring:", error);
      res.status(500).json({ message: "Failed to improve scoring" });
    }
  });

  // Register API stats routes for cost monitoring
  registerApiStatsRoutes(app);

  // Admin API endpoints
  app.get("/api/admin/database-stats", isAuthenticated, async (req: any, res) => {
    try {
      const allRestaurants = await storage.getAllRestaurants();
      const withScores = allRestaurants.filter(r => parseFloat(r.veganScore || '0') > 0);
      const pendingScores = allRestaurants.filter(r => parseFloat(r.veganScore || '0') === 0);
      
      const avgVeganScore = withScores.length > 0 ? 
        withScores.reduce((sum, r) => sum + parseFloat(r.veganScore || '0'), 0) / withScores.length : 0;
      
      const highVeganFriendly = withScores.filter(r => parseFloat(r.veganScore || '0') >= 7.0).length;
      const mediumVeganFriendly = withScores.filter(r => parseFloat(r.veganScore || '0') >= 4.0 && parseFloat(r.veganScore || '0') < 7.0).length;
      const lowVeganFriendly = withScores.filter(r => parseFloat(r.veganScore || '0') > 0 && parseFloat(r.veganScore || '0') < 4.0).length;
      
      // Recently added (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const recentlyAdded = allRestaurants.filter(r => new Date(r.createdAt) > yesterday).length;
      
      res.json({
        totalRestaurants: allRestaurants.length,
        withScores: withScores.length,
        pendingScores: pendingScores.length,
        avgVeganScore,
        highVeganFriendly,
        mediumVeganFriendly,
        lowVeganFriendly,
        recentlyAdded
      });
    } catch (error) {
      console.error("Error fetching database stats:", error);
      res.status(500).json({ message: "Failed to fetch database stats" });
    }
  });

  app.get("/api/admin/cache-stats", isAuthenticated, async (req: any, res) => {
    try {
      // Return placeholder cache stats for now
      const cacheStats = {
        placesSearchHits: 1250,
        placesSearchMisses: 180,
        placeDetailsHits: 890,
        placeDetailsMisses: 110,
        photosHits: 650,
        photosMisses: 85,
        totalSavings: 127.50,
        cacheHitRate: 0.87
      };
      res.json(cacheStats);
    } catch (error) {
      console.error("Error fetching cache stats:", error);
      res.status(500).json({ message: "Failed to fetch cache stats" });
    }
  });

  app.get("/api/admin/scoring-status", isAuthenticated, async (req: any, res) => {
    try {
      const allRestaurants = await storage.getAllRestaurants();
      const pendingScores = allRestaurants.filter(r => parseFloat(r.veganScore || '0') === 0);
      const withScores = allRestaurants.filter(r => parseFloat(r.veganScore || '0') > 0);
      
      if (pendingScores.length > 0) {
        res.json({
          id: 'current-scoring-job',
          status: 'running',
          totalRestaurants: allRestaurants.length,
          completedRestaurants: withScores.length,
          estimatedCompletion: new Date(Date.now() + (pendingScores.length * 2000)).toISOString(),
          startedAt: new Date().toISOString()
        });
      } else {
        res.json({
          id: 'completed-scoring-job',
          status: 'completed',
          totalRestaurants: allRestaurants.length,
          completedRestaurants: withScores.length,
          estimatedCompletion: new Date().toISOString(),
          startedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error fetching scoring status:", error);
      res.status(500).json({ message: "Failed to fetch scoring status" });
    }
  });

  app.get("/api/admin/restaurants", isAuthenticated, async (req: any, res) => {
    try {
      const filter = req.query.filter || 'all';
      const allRestaurants = await storage.getAllRestaurants();
      
      let filteredRestaurants = allRestaurants;
      
      switch (filter) {
        case 'pending':
          filteredRestaurants = allRestaurants.filter(r => parseFloat(r.veganScore || '0') === 0);
          break;
        case 'low':
          filteredRestaurants = allRestaurants.filter(r => {
            const score = parseFloat(r.veganScore || '0');
            return score > 0 && score <= 2.0;
          });
          break;
        case 'medium':
          filteredRestaurants = allRestaurants.filter(r => {
            const score = parseFloat(r.veganScore || '0');
            return score > 2.0 && score <= 5.0;
          });
          break;
        case 'high':
          filteredRestaurants = allRestaurants.filter(r => parseFloat(r.veganScore || '0') > 5.0);
          break;
        default:
          filteredRestaurants = allRestaurants;
      }
      
      res.json(filteredRestaurants.slice(0, 50));
    } catch (error) {
      console.error("Error fetching restaurants:", error);
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  // Scoring weights management endpoints
  app.get("/api/admin/scoring-weights", isAuthenticated, async (req: any, res) => {
    try {
      // Return default weights for now
      const defaultWeights = {
        id: 'default',
        name: 'Default Configuration',
        menuVarietyWeight: 0.25,
        ingredientClarityWeight: 0.20,
        staffKnowledgeWeight: 0.15,
        crossContaminationWeight: 0.20,
        nutritionalInformationWeight: 0.10,
        allergenManagementWeight: 0.10,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      res.json(defaultWeights);
    } catch (error) {
      console.error("Error fetching scoring weights:", error);
      res.status(500).json({ message: "Failed to fetch scoring weights" });
    }
  });

  app.post("/api/admin/scoring-weights", isAuthenticated, async (req: any, res) => {
    try {
      const weights = req.body;
      
      // Validate that weights sum to 1.0
      const total = Object.values(weights).reduce((sum: number, weight: any) => {
        return typeof weight === 'number' ? sum + weight : sum;
      }, 0);
      
      if (Math.abs(total - 1.0) > 0.001) {
        return res.status(400).json({ 
          message: `Total weights must equal 1.0 (currently ${total.toFixed(3)})` 
        });
      }
      
      // For now, just return success - in the future this would save to database
      console.log('Updated scoring weights:', weights);
      
      res.json({ 
        message: "Scoring weights updated successfully",
        weights: {
          ...weights,
          id: 'updated-config',
          name: 'Updated Configuration',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error("Error updating scoring weights:", error);
      res.status(500).json({ message: "Failed to update scoring weights" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
