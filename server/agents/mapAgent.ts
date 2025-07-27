import { storage } from '../storage';
import { analyzeVeganFriendliness } from '../services/openai';
import { Restaurant } from '@shared/schema';

export class MapAgent {
  async getRestaurantsInRadius(
    lat: number, 
    lng: number, 
    radiusKm: number = 2
  ): Promise<Restaurant[]> {
    try {
      const restaurants = await storage.getRestaurantsInRadius(lat, lng, radiusKm);
      return restaurants.filter(r => r.veganScore && Number(r.veganScore) > 0);
    } catch (error) {
      console.error('MapAgent: Error getting restaurants in radius:', error);
      throw new Error('Failed to fetch nearby restaurants');
    }
  }

  async getRestaurantDetails(restaurantId: string): Promise<{
    restaurant: Restaurant;
    scoreBreakdown: any;
    isFavorite?: boolean;
  } | null> {
    try {
      const restaurant = await storage.getRestaurant(restaurantId);
      if (!restaurant) return null;

      const scoreBreakdown = await storage.getVeganScoreBreakdown(restaurantId);
      
      return {
        restaurant,
        scoreBreakdown,
      };
    } catch (error) {
      console.error('MapAgent: Error getting restaurant details:', error);
      throw new Error('Failed to fetch restaurant details');
    }
  }

  async updateRestaurantLocation(
    restaurantId: string,
    lat: number,
    lng: number
  ): Promise<Restaurant> {
    try {
      return await storage.updateRestaurant(restaurantId, {
        latitude: lat.toString(),
        longitude: lng.toString(),
      });
    } catch (error) {
      console.error('MapAgent: Error updating restaurant location:', error);
      throw new Error('Failed to update restaurant location');
    }
  }

  async analyzeNewRestaurant(googlePlacesData: any): Promise<Restaurant> {
    try {
      // First, check if restaurant already exists
      const existingRestaurant = await storage.getRestaurantByPlaceId(googlePlacesData.place_id);
      if (existingRestaurant) {
        return existingRestaurant;
      }

      // Create new restaurant entry
      const newRestaurant = await storage.createRestaurant({
        placeId: googlePlacesData.place_id,
        name: googlePlacesData.name,
        address: googlePlacesData.formatted_address,
        latitude: googlePlacesData.geometry.location.lat.toString(),
        longitude: googlePlacesData.geometry.location.lng.toString(),
        phoneNumber: googlePlacesData.formatted_phone_number,
        website: googlePlacesData.website,
        priceLevel: this.mapPriceLevel(googlePlacesData.price_level),
        cuisineTypes: googlePlacesData.types || [],
        openingHours: googlePlacesData.opening_hours,
        photos: googlePlacesData.photos?.map((photo: any) => photo.photo_reference) || [],
        rating: googlePlacesData.rating?.toString(),
        reviewCount: googlePlacesData.user_ratings_total || 0,
      });

      // Analyze vegan friendliness
      const veganAnalysis = await analyzeVeganFriendliness({
        name: newRestaurant.name,
        description: googlePlacesData.editorial_summary?.overview,
        cuisine: newRestaurant.cuisineTypes,
        reviews: googlePlacesData.reviews?.map((r: any) => r.text) || [],
      });

      // Update restaurant with vegan score
      const updatedRestaurant = await storage.updateRestaurant(newRestaurant.id, {
        veganScore: veganAnalysis.overallScore.toString(),
      });

      // Store score breakdown
      await storage.upsertVeganScoreBreakdown({
        restaurantId: newRestaurant.id,
        menuVariety: veganAnalysis.menuVariety.toString(),
        ingredientClarity: veganAnalysis.ingredientClarity.toString(),
        staffKnowledge: veganAnalysis.staffKnowledge.toString(),
        crossContaminationPrevention: veganAnalysis.crossContaminationPrevention.toString(),
        nutritionalInformation: veganAnalysis.nutritionalInformation.toString(),
        allergenManagement: veganAnalysis.allergenManagement.toString(),
        overallScore: veganAnalysis.overallScore.toString(),
      });

      return updatedRestaurant;
    } catch (error) {
      console.error('MapAgent: Error analyzing new restaurant:', error);
      throw new Error('Failed to analyze restaurant data');
    }
  }

  private mapPriceLevel(priceLevel?: number): '$' | '$$' | '$$$' | '$$$$' | null {
    if (priceLevel === undefined || priceLevel === null) return null;
    
    const mapping: { [key: number]: '$' | '$$' | '$$$' | '$$$$' } = {
      1: '$',
      2: '$$',
      3: '$$$',
      4: '$$$$',
    };
    
    return mapping[priceLevel] || '$$';
  }

  async getRestaurantsByBounds(
    north: number,
    south: number,
    east: number,
    west: number
  ): Promise<Restaurant[]> {
    try {
      // Calculate center point and approximate radius
      const centerLat = (north + south) / 2;
      const centerLng = (east + west) / 2;
      
      // Approximate radius calculation (this could be more precise)
      const radiusKm = Math.max(
        this.calculateDistance(centerLat, centerLng, north, centerLng),
        this.calculateDistance(centerLat, centerLng, centerLat, east)
      );

      return await this.getRestaurantsInRadius(centerLat, centerLng, radiusKm);
    } catch (error) {
      console.error('MapAgent: Error getting restaurants by bounds:', error);
      throw new Error('Failed to fetch restaurants in area');
    }
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

export const mapAgent = new MapAgent();
