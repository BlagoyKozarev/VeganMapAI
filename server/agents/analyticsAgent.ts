import { storage } from '../storage';
import { UserAnalytics } from '@shared/schema';

export interface AnalyticsReport {
  totalUsers: number;
  activeUsers: number;
  popularCuisines: { [cuisine: string]: number };
  avgSessionDuration: number;
  topRestaurants: { restaurantId: string; views: number; name?: string }[];
  userBehaviorPatterns: {
    searchFrequency: number;
    avgDistanceTraveled: number;
    preferredTimeOfDay: string;
  };
}

export interface UserBehaviorInsights {
  searchPatterns: string[];
  favoriteLocations: { lat: number; lng: number; frequency: number }[];
  cuisinePreferences: { [cuisine: string]: number };
  visitingHours: { [hour: string]: number };
  recommendations: string[];
}

export class AnalyticsAgent {
  async generateMonthlyReport(month: number, year: number): Promise<AnalyticsReport> {
    try {
      // This would typically involve complex analytics queries
      // For now, we'll provide a simplified implementation
      
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);

      // Get all analytics data for the month
      // Note: This is simplified - in production you'd want more efficient queries
      const allAnalytics = await this.getAnalyticsForPeriod(startDate, endDate);

      const totalUsers = new Set(allAnalytics.map(a => a.userId)).size;
      const activeUsers = new Set(
        allAnalytics
          .filter(a => ['search_restaurants', 'view_restaurant', 'favorite_restaurant'].includes(a.actionType))
          .map(a => a.userId)
      ).size;

      // Analyze popular cuisines
      const cuisineFrequency: { [cuisine: string]: number } = {};
      allAnalytics
        .filter(a => a.actionData?.cuisineTypes)
        .forEach(a => {
          if (Array.isArray(a.actionData.cuisineTypes)) {
            a.actionData.cuisineTypes.forEach((cuisine: string) => {
              cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
            });
          }
        });

      // Calculate top restaurants by views
      const restaurantViews: { [restaurantId: string]: number } = {};
      allAnalytics
        .filter(a => a.actionType === 'view_restaurant' && a.actionData?.restaurantId)
        .forEach(a => {
          const restaurantId = a.actionData.restaurantId;
          restaurantViews[restaurantId] = (restaurantViews[restaurantId] || 0) + 1;
        });

      const topRestaurants = Object.entries(restaurantViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([restaurantId, views]) => ({ restaurantId, views }));

      // Add restaurant names
      for (const restaurant of topRestaurants) {
        const restaurantData = await storage.getRestaurant(restaurant.restaurantId);
        restaurant.name = restaurantData?.name;
      }

      // Analyze user behavior patterns
      const searchActions = allAnalytics.filter(a => a.actionType === 'search_restaurants');
      const searchFrequency = searchActions.length / Math.max(totalUsers, 1);

      // Calculate average distance traveled
      const distanceActions = allAnalytics.filter(a => 
        a.location && a.actionData?.restaurantLocation
      );
      
      let avgDistanceTraveled = 0;
      if (distanceActions.length > 0) {
        const totalDistance = distanceActions.reduce((sum, action) => {
          const distance = this.calculateDistance(
            action.location!.lat,
            action.location!.lng,
            action.actionData.restaurantLocation.lat,
            action.actionData.restaurantLocation.lng
          );
          return sum + distance;
        }, 0);
        avgDistanceTraveled = totalDistance / distanceActions.length;
      }

      // Find preferred time of day
      const hourFrequency: { [hour: string]: number } = {};
      allAnalytics.forEach(action => {
        const hour = new Date(action.timestamp!).getHours();
        hourFrequency[hour] = (hourFrequency[hour] || 0) + 1;
      });

      const preferredHour = Object.entries(hourFrequency)
        .sort(([,a], [,b]) => b - a)[0]?.[0];

      const preferredTimeOfDay = this.getTimeOfDayLabel(parseInt(preferredHour || '12'));

      return {
        totalUsers,
        activeUsers,
        popularCuisines: cuisineFrequency,
        avgSessionDuration: 0, // Would need session tracking for this
        topRestaurants,
        userBehaviorPatterns: {
          searchFrequency: Math.round(searchFrequency * 100) / 100,
          avgDistanceTraveled: Math.round(avgDistanceTraveled * 100) / 100,
          preferredTimeOfDay
        }
      };
    } catch (error) {
      console.error('AnalyticsAgent: Error generating monthly report:', error);
      throw new Error('Failed to generate analytics report');
    }
  }

  async analyzeUserBehavior(userId: string): Promise<UserBehaviorInsights> {
    try {
      const userAnalytics = await storage.getUserAnalytics(userId, 1000);

      // Analyze search patterns
      const searchActions = userAnalytics.filter(a => a.actionType === 'search_restaurants');
      const searchPatterns = this.extractSearchPatterns(searchActions);

      // Find favorite locations
      const locationActions = userAnalytics.filter(a => a.location);
      const favoriteLocations = this.findFavoriteLocations(locationActions);

      // Analyze cuisine preferences
      const cuisinePreferences: { [cuisine: string]: number } = {};
      userAnalytics
        .filter(a => a.actionData?.cuisineTypes)
        .forEach(action => {
          if (Array.isArray(action.actionData.cuisineTypes)) {
            action.actionData.cuisineTypes.forEach((cuisine: string) => {
              cuisinePreferences[cuisine] = (cuisinePreferences[cuisine] || 0) + 1;
            });
          }
        });

      // Analyze visiting hours
      const visitingHours: { [hour: string]: number } = {};
      userAnalytics.forEach(action => {
        const hour = new Date(action.timestamp!).getHours().toString();
        visitingHours[hour] = (visitingHours[hour] || 0) + 1;
      });

      // Generate recommendations based on behavior
      const recommendations = await this.generateBehaviorRecommendations(userAnalytics);

      return {
        searchPatterns,
        favoriteLocations,
        cuisinePreferences,
        visitingHours,
        recommendations
      };
    } catch (error) {
      console.error('AnalyticsAgent: Error analyzing user behavior:', error);
      throw new Error('Failed to analyze user behavior');
    }
  }

  async trackUserSession(
    userId: string,
    sessionStart: Date,
    sessionEnd: Date,
    actions: string[]
  ): Promise<void> {
    try {
      await storage.addUserAnalytics({
        userId,
        actionType: 'session_completed',
        actionData: {
          duration: sessionEnd.getTime() - sessionStart.getTime(),
          actionsCount: actions.length,
          actions: actions
        }
      });
    } catch (error) {
      console.error('AnalyticsAgent: Error tracking user session:', error);
      // Don't throw error for analytics tracking failures
    }
  }

  async getPopularTrends(limit: number = 10): Promise<{
    trendingCuisines: string[];
    trendingLocations: { lat: number; lng: number; name?: string }[];
    trendingRestaurants: string[];
  }> {
    try {
      // Get recent analytics (last 30 days)
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const recentAnalytics = await this.getAnalyticsForPeriod(thirtyDaysAgo, new Date());

      // Trending cuisines
      const cuisineFrequency: { [cuisine: string]: number } = {};
      recentAnalytics
        .filter(a => a.actionData?.cuisineTypes)
        .forEach(a => {
          if (Array.isArray(a.actionData.cuisineTypes)) {
            a.actionData.cuisineTypes.forEach((cuisine: string) => {
              cuisineFrequency[cuisine] = (cuisineFrequency[cuisine] || 0) + 1;
            });
          }
        });

      const trendingCuisines = Object.entries(cuisineFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([cuisine]) => cuisine);

      // Trending restaurants
      const restaurantViews: { [restaurantId: string]: number } = {};
      recentAnalytics
        .filter(a => a.actionType === 'view_restaurant' && a.actionData?.restaurantId)
        .forEach(a => {
          const restaurantId = a.actionData.restaurantId;
          restaurantViews[restaurantId] = (restaurantViews[restaurantId] || 0) + 1;
        });

      const trendingRestaurants = Object.entries(restaurantViews)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([restaurantId]) => restaurantId);

      // Trending locations (simplified)
      const locationActions = recentAnalytics.filter(a => a.location);
      const trendingLocations = this.findFavoriteLocations(locationActions).slice(0, limit);

      return {
        trendingCuisines,
        trendingLocations,
        trendingRestaurants
      };
    } catch (error) {
      console.error('AnalyticsAgent: Error getting popular trends:', error);
      return {
        trendingCuisines: [],
        trendingLocations: [],
        trendingRestaurants: []
      };
    }
  }

  private async getAnalyticsForPeriod(startDate: Date, endDate: Date): Promise<UserAnalytics[]> {
    // This is a simplified implementation
    // In production, you'd want a more efficient query
    const allAnalytics = await storage.getUserAnalytics('', 10000);
    return allAnalytics.filter(a => {
      const actionDate = new Date(a.timestamp!);
      return actionDate >= startDate && actionDate <= endDate;
    });
  }

  private extractSearchPatterns(searchActions: UserAnalytics[]): string[] {
    const patterns: { [pattern: string]: number } = {};
    
    searchActions.forEach(action => {
      if (action.actionData?.query) {
        const query = action.actionData.query.toLowerCase();
        patterns[query] = (patterns[query] || 0) + 1;
      }
    });

    return Object.entries(patterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([pattern]) => pattern);
  }

  private findFavoriteLocations(locationActions: UserAnalytics[]): { lat: number; lng: number; frequency: number }[] {
    const locationFrequency: { [key: string]: { lat: number; lng: number; frequency: number } } = {};
    
    locationActions.forEach(action => {
      if (action.location) {
        // Round coordinates to create location clusters
        const roundedLat = Math.round(action.location.lat * 100) / 100;
        const roundedLng = Math.round(action.location.lng * 100) / 100;
        const key = `${roundedLat},${roundedLng}`;
        
        if (locationFrequency[key]) {
          locationFrequency[key].frequency++;
        } else {
          locationFrequency[key] = {
            lat: roundedLat,
            lng: roundedLng,
            frequency: 1
          };
        }
      }
    });

    return Object.values(locationFrequency)
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 5);
  }

  private async generateBehaviorRecommendations(userAnalytics: UserAnalytics[]): Promise<string[]> {
    const recommendations: string[] = [];

    // Analyze search vs. visit ratio
    const searchCount = userAnalytics.filter(a => a.actionType === 'search_restaurants').length;
    const visitCount = userAnalytics.filter(a => a.actionType === 'visit_restaurant').length;
    
    if (searchCount > visitCount * 3) {
      recommendations.push('Try visiting some of the restaurants you\'ve been searching for!');
    }

    // Check for cuisine diversity
    const cuisineTypes = new Set();
    userAnalytics
      .filter(a => a.actionData?.cuisineTypes)
      .forEach(a => {
        if (Array.isArray(a.actionData.cuisineTypes)) {
          a.actionData.cuisineTypes.forEach((cuisine: string) => cuisineTypes.add(cuisine));
        }
      });

    if (cuisineTypes.size < 3) {
      recommendations.push('Explore more diverse cuisine types to find new favorites!');
    }

    // Check for review activity
    const reviewCount = userAnalytics.filter(a => a.actionType === 'review_submitted').length;
    if (reviewCount === 0 && visitCount > 0) {
      recommendations.push('Consider leaving reviews to help other vegan diners!');
    }

    return recommendations;
  }

  private getTimeOfDayLabel(hour: number): string {
    if (hour >= 5 && hour < 12) return 'Morning';
    if (hour >= 12 && hour < 17) return 'Afternoon';
    if (hour >= 17 && hour < 21) return 'Evening';
    return 'Night';
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

export const analyticsAgent = new AnalyticsAgent();
