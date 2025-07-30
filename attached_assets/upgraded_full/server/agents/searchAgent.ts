import { storage } from '../storage';
import { Restaurant } from '@shared/schema';

export interface SearchFilters {
  minVeganScore?: number;
  maxDistance?: number;
  priceRange?: string[];
  cuisineTypes?: string[];
  allergies?: string[];
  dietaryStyle?: string;
}

export class SearchAgent {
  async searchRestaurants(
    query: string,
    userLocation?: { lat: number; lng: number },
    filters?: SearchFilters,
    limit: number = 20
  ): Promise<Restaurant[]> {
    try {
      let restaurants = await storage.searchRestaurants(
        query,
        userLocation?.lat,
        userLocation?.lng,
        {
          minVeganScore: filters?.minVeganScore,
          priceRange: filters?.priceRange,
          cuisineTypes: filters?.cuisineTypes,
        }
      );

      // Apply additional filters
      if (filters?.maxDistance && userLocation) {
        restaurants = restaurants.filter(restaurant => {
          const distance = this.calculateDistance(
            userLocation.lat,
            userLocation.lng,
            parseFloat(restaurant.latitude),
            parseFloat(restaurant.longitude)
          );
          return distance <= (filters.maxDistance! / 1000); // Convert meters to km
        });
      }

      // Filter by allergens (exclude restaurants that don't handle user's allergies well)
      if (filters?.allergies && filters.allergies.length > 0) {
        const safeRestaurants = [];
        for (const restaurant of restaurants) {
          const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurant.id);
          if (scoreBreakdown && parseFloat(scoreBreakdown.allergenManagement) >= 7.0) {
            safeRestaurants.push(restaurant);
          }
        }
        restaurants = safeRestaurants;
      }

      return restaurants.slice(0, limit);
    } catch (error) {
      console.error('SearchAgent: Error searching restaurants:', error);
      throw new Error('Failed to search restaurants');
    }
  }

  async getRestaurantSuggestions(
    partialQuery: string,
    userLocation?: { lat: number; lng: number }
  ): Promise<string[]> {
    try {
      const restaurants = await storage.searchRestaurants(
        partialQuery,
        userLocation?.lat,
        userLocation?.lng
      );

      // Extract unique suggestions
      const suggestions = new Set<string>();
      
      restaurants.forEach(restaurant => {
        // Add restaurant name
        if (restaurant.name.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(restaurant.name);
        }
        
        // Add cuisine types
        restaurant.cuisineTypes?.forEach(cuisine => {
          if (cuisine.toLowerCase().includes(partialQuery.toLowerCase())) {
            suggestions.add(cuisine);
          }
        });
      });

      return Array.from(suggestions).slice(0, 10);
    } catch (error) {
      console.error('SearchAgent: Error getting suggestions:', error);
      return [];
    }
  }

  async filterByUserPreferences(
    restaurants: Restaurant[],
    userProfile: any
  ): Promise<Restaurant[]> {
    try {
      let filtered = [...restaurants];

      // Filter by dietary style
      if (userProfile.dietaryStyle) {
        const minScore = this.getMinScoreForDietaryStyle(userProfile.dietaryStyle);
        filtered = filtered.filter(r => 
          r.veganScore && parseFloat(r.veganScore) >= minScore
        );
      }

      // Filter by price range
      if (userProfile.priceRange) {
        const userPriceRanges = this.expandPriceRange(userProfile.priceRange);
        filtered = filtered.filter(r => 
          r.priceLevel && userPriceRanges.includes(r.priceLevel)
        );
      }

      // Filter by preferred cuisines
      if (userProfile.preferredCuisines && userProfile.preferredCuisines.length > 0) {
        filtered = filtered.filter(r => 
          r.cuisineTypes?.some(cuisine => 
            userProfile.preferredCuisines.includes(cuisine.toLowerCase())
          )
        );
      }

      // Sort by vegan score and distance
      filtered.sort((a, b) => {
        const scoreA = parseFloat(a.veganScore || '0');
        const scoreB = parseFloat(b.veganScore || '0');
        return scoreB - scoreA; // Higher scores first
      });

      return filtered;
    } catch (error) {
      console.error('SearchAgent: Error filtering by preferences:', error);
      return restaurants;
    }
  }

  async searchByLocation(
    locationName: string,
    filters?: SearchFilters
  ): Promise<{ restaurants: Restaurant[]; location: { lat: number; lng: number } | null }> {
    try {
      // This would typically use a geocoding service like Google Maps Geocoding API
      // For now, we'll simulate with a basic search
      const restaurants = await storage.searchRestaurants(locationName, undefined, undefined, filters);
      
      return {
        restaurants: restaurants.slice(0, 20),
        location: null // Would be populated by geocoding service
      };
    } catch (error) {
      console.error('SearchAgent: Error searching by location:', error);
      throw new Error('Failed to search by location');
    }
  }

  private getMinScoreForDietaryStyle(dietaryStyle: string): number {
    const minScores = {
      'vegan': 8.0,
      'vegetarian': 6.0,
      'flexitarian': 4.0
    };
    return minScores[dietaryStyle as keyof typeof minScores] || 5.0;
  }

  private expandPriceRange(priceRange: string): string[] {
    const ranges = {
      '$': ['$'],
      '$$': ['$', '$$'],
      '$$$': ['$$', '$$$'],
      '$$$$': ['$$$', '$$$$']
    };
    return ranges[priceRange as keyof typeof ranges] || ['$', '$$'];
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

export const searchAgent = new SearchAgent();
