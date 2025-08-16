import { storage } from '../storage';
import { generateRestaurantRecommendations } from '../services/openai';
import { UserProfile, InsertUserProfile } from '@shared/schema';

export class ProfileAgent {
  async createUserProfile(userId: string, profileData: Omit<InsertUserProfile, 'userId'>): Promise<UserProfile> {
    try {
      const profile = await storage.createUserProfile({
        ...profileData,
        userId,
        isProfileComplete: this.isProfileComplete(profileData)
      });

      // Track profile creation
      await storage.addUserAnalytics({
        userId,
        actionType: 'profile_created',
        actionData: {
          dietaryStyle: profileData.dietaryStyle,
          allergiesCount: profileData.allergies?.length || 0,
          cuisinesCount: profileData.preferredCuisines?.length || 0
        }
      });

      return profile;
    } catch (error) {
      console.error('ProfileAgent: Error creating user profile:', error);
      throw new Error('Failed to create user profile');
    }
  }

  async updateUserProfile(userId: string, updates: Partial<InsertUserProfile>): Promise<UserProfile> {
    try {
      const existingProfile = await storage.getUserProfile(userId);
      if (!existingProfile) {
        throw new Error('Profile not found');
      }

      const updatedData = { ...updates };
      
      // Check if profile is now complete
      const mergedData = { ...existingProfile, ...updates };
      updatedData.isProfileComplete = this.isProfileComplete(mergedData);

      const profile = await storage.updateUserProfile(userId, updatedData);

      // Track profile updates
      await storage.addUserAnalytics({
        userId,
        actionType: 'profile_updated',
        actionData: {
          updatedFields: Object.keys(updates),
          isComplete: updatedData.isProfileComplete
        }
      });

      return profile;
    } catch (error) {
      console.error('ProfileAgent: Error updating user profile:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const profile = await storage.getUserProfile(userId);
      return profile || null;
    } catch (error) {
      console.error('ProfileAgent: Error getting user profile:', error);
      throw new Error('Failed to get user profile');
    }
  }

  async generatePersonalizedRecommendations(
    userId: string,
    userLocation: { lat: number; lng: number },
    limit: number = 10
  ): Promise<string[]> {
    try {
      const profile = await storage.getUserProfile(userId);
      if (!profile) {
        throw new Error('User profile not found');
      }

      // Get nearby restaurants
      const nearbyRestaurants = await storage.getRestaurantsInRadius(
        userLocation.lat,
        userLocation.lng,
        (profile.maxDistance || 2000) / 1000 // Convert to km
      );

      // Filter by user preferences
      let filteredRestaurants = nearbyRestaurants;

      // Filter by dietary style minimum score
      const minScore = this.getMinScoreForDietaryStyle(profile.dietaryStyle);
      filteredRestaurants = filteredRestaurants.filter(r => 
        r.veganScore && parseFloat(r.veganScore) >= minScore
      );

      // Filter by price range
      if (profile.priceRange) {
        const acceptablePrices = this.getAcceptablePriceRanges(profile.priceRange);
        filteredRestaurants = filteredRestaurants.filter(r => 
          r.priceLevel && acceptablePrices.includes(r.priceLevel)
        );
      }

      // Filter by cuisine preferences
      if (profile.preferredCuisines && profile.preferredCuisines.length > 0) {
        filteredRestaurants = filteredRestaurants.filter(r => 
          r.cuisineTypes?.some(cuisine => 
            profile.preferredCuisines!.includes(cuisine.toLowerCase())
          )
        );
      }

      // Filter by allergen safety
      if (profile.allergies && profile.allergies.length > 0) {
        const safeRestaurants = [];
        for (const restaurant of filteredRestaurants) {
          const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurant.id);
          if (scoreBreakdown && parseFloat(scoreBreakdown.allergenManagement) >= 7.0) {
            safeRestaurants.push(restaurant);
          }
        }
        filteredRestaurants = safeRestaurants;
      }

      // Use AI for final ranking
      const recommendations = await generateRestaurantRecommendations(
        profile,
        userLocation,
        filteredRestaurants
      );

      return recommendations.slice(0, limit);
    } catch (error) {
      console.error('ProfileAgent: Error generating recommendations:', error);
      return [];
    }
  }

  async trackUserBehavior(
    userId: string,
    actionType: string,
    actionData: any,
    location?: { lat: number; lng: number }
  ): Promise<void> {
    try {
      await storage.addUserAnalytics({
        userId,
        actionType,
        actionData,
        location
      });
    } catch (error) {
      console.error('ProfileAgent: Error tracking user behavior:', error);
      // Don't throw error for analytics tracking failures
    }
  }

  async getUserStats(userId: string): Promise<{
    placesVisited: number;
    favorites: number;
    reviews: number;
    avgVeganScore: number;
  }> {
    try {
      const [visits, favorites, analytics] = await Promise.all([
        storage.getUserVisits(userId),
        storage.getUserFavorites(userId),
        storage.getUserAnalytics(userId, 1000)
      ]);

      const reviewsCount = analytics.filter(a => a.actionType === 'review_submitted').length;
      
      // Calculate average vegan score of visited places
      let avgVeganScore = 0;
      if (visits.length > 0) {
        const visitedRestaurants = await Promise.all(
          visits.map(visit => storage.getRestaurant(visit.restaurantId))
        );
        const scores = visitedRestaurants
          .filter(r => r && r.veganScore)
          .map(r => parseFloat(r!.veganScore!));
        
        if (scores.length > 0) {
          avgVeganScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
        }
      }

      return {
        placesVisited: visits.length,
        favorites: favorites.length,
        reviews: reviewsCount,
        avgVeganScore: Math.round(avgVeganScore * 10) / 10
      };
    } catch (error) {
      console.error('ProfileAgent: Error getting user stats:', error);
      return {
        placesVisited: 0,
        favorites: 0,
        reviews: 0,
        avgVeganScore: 0
      };
    }
  }

  async getPersonalizedFilters(userId: string): Promise<{
    suggestedCuisines: string[];
    suggestedPriceRange: string;
    suggestedMaxDistance: number;
  }> {
    try {
      const analytics = await storage.getUserAnalytics(userId, 500);
      const profile = await storage.getUserProfile(userId);

      // Analyze user behavior to suggest better filters
      const searchActions = analytics.filter(a => a.actionType === 'search_restaurants');
      const viewActions = analytics.filter(a => a.actionType === 'view_restaurant');

      let suggestedCuisines: string[] = [];
      let suggestedPriceRange = profile?.priceRange || '$$';
      let suggestedMaxDistance = profile?.maxDistance || 2000;

      // Analyze frequently searched cuisines
      const cuisineFrequency: { [key: string]: number } = {};
      searchActions.forEach(action => {
        if (action.actionData?.cuisineTypes) {
          action.actionData.cuisineTypes.forEach((cuisine: string) => {
            cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
          });
        }
      });

      suggestedCuisines = Object.entries(cuisineFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([cuisine]) => cuisine);

      // Analyze distance patterns
      const distances = viewActions
        .filter(action => action.location && action.actionData?.restaurantLocation)
        .map(action => this.calculateDistance(
          action.location!.lat,
          action.location!.lng,
          action.actionData.restaurantLocation.lat,
          action.actionData.restaurantLocation.lng
        ));

      if (distances.length > 0) {
        const avgDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        suggestedMaxDistance = Math.round(avgDistance * 1000 * 1.2); // Add 20% buffer
      }

      return {
        suggestedCuisines,
        suggestedPriceRange,
        suggestedMaxDistance
      };
    } catch (error) {
      console.error('ProfileAgent: Error getting personalized filters:', error);
      return {
        suggestedCuisines: [],
        suggestedPriceRange: '$$',
        suggestedMaxDistance: 2000
      };
    }
  }

  private isProfileComplete(profileData: any): boolean {
    return !!(
      profileData.dietaryStyle &&
      profileData.priceRange &&
      profileData.maxDistance &&
      (profileData.preferredCuisines && profileData.preferredCuisines.length > 0)
    );
  }

  private getMinScoreForDietaryStyle(dietaryStyle: string): number {
    const minScores = {
      'vegan': 7.0,
      'vegetarian': 5.0,
      'flexitarian': 3.0
    };
    return minScores[dietaryStyle as keyof typeof minScores] || 5.0;
  }

  private getAcceptablePriceRanges(userPriceRange: string): string[] {
    const ranges = {
      '$': ['$'],
      '$$': ['$', '$$'],
      '$$$': ['$$', '$$$'],
      '$$$$': ['$$$', '$$$$']
    };
    return ranges[userPriceRange as keyof typeof ranges] || ['$', '$$'];
  }

  private calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}

export const profileAgent = new ProfileAgent();
