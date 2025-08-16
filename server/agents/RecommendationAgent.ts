import { db } from '../db';
import { sql } from 'drizzle-orm';

interface RecommendationRequest {
  location: { lat: number; lng: number };
  preferences: {
    cuisine?: string[];
    allergens?: string[];
    budget?: number;
  };
  limit?: number;
}

interface Restaurant {
  id: string;
  name: string;
  lat: number;
  lng: number;
  veganScore: number;
  priceLevel: number;
  cuisineTypes: string[];
  address: string;
  rating?: number;
  distance_km: number;
  reason: string;
}

export class RecommendationAgent {
  async getRecommendations(request: RecommendationRequest): Promise<Restaurant[]> {
    console.log('[RecommendationAgent] Getting recommendations:', request);
    
    try {
      const { location, preferences, limit = 3 } = request;
      
      // Simple query without complex parameter binding for now
      const maxDistance = 5; // 5km radius
      const lat = location.lat;
      const lng = location.lng;
      
      let whereConditions = [`
        (6371 * acos(
          cos(radians(${lat})) * cos(radians(latitude)) *
          cos(radians(longitude) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(latitude))
        )) <= ${maxDistance}
      `];
      
      // Budget filter (price level)
      if (preferences.budget && preferences.budget <= 4) {
        whereConditions.push(`price_level <= ${preferences.budget}`);
      }
      
      // Cuisine preference - simplified for now
      if (preferences.cuisine && preferences.cuisine.length > 0) {
        const cuisineFilter = preferences.cuisine.map(c => `cuisine_types ILIKE '%${c}%'`).join(' OR ');
        whereConditions.push(`(${cuisineFilter})`);
      }
      
      const whereClause = 'WHERE ' + whereConditions.join(' AND ');
      
      const query = `
        SELECT 
          id, name, latitude, longitude, vegan_score, price_level, 
          cuisine_types, address, rating,
          (6371 * acos(
            cos(radians(${lat})) * cos(radians(latitude)) *
            cos(radians(longitude) - radians(${lng})) +
            sin(radians(${lat})) * sin(radians(latitude))
          )) as distance_km
        FROM restaurants 
        ${whereClause}
        ORDER BY 
          CASE 
            WHEN vegan_score IS NOT NULL THEN vegan_score 
            ELSE 0 
          END DESC,
          distance_km ASC
        LIMIT ${limit}
      `;
      
      console.log('[RecommendationAgent] Query:', query);
      
      const results = await db.execute(sql.raw(query));
      const restaurants = results || [];
      
      // Process and add recommendation reasons
      return restaurants.map((r: any) => ({
        id: r.id,
        name: r.name,
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        veganScore: r.vegan_score || 0,
        priceLevel: r.price_level || 1,
        cuisineTypes: r.cuisine_types || [],
        address: r.address,
        rating: r.rating,
        distance_km: parseFloat(r.distance_km),
        reason: this.generateReason(r, preferences)
      }));
      
    } catch (error) {
      console.error('[RecommendationAgent] Error:', error);
      return [];
    }
  }

  private generateReason(restaurant: any, preferences: any): string {
    const reasons = [];
    
    // Vegan score reasoning
    if (restaurant.vegan_score >= 8) {
      reasons.push('excellent vegan options');
    } else if (restaurant.vegan_score >= 6) {
      reasons.push('good vegan menu');
    } else if (restaurant.vegan_score > 0) {
      reasons.push('vegan-friendly');
    } else {
      reasons.push('has vegan options');
    }
    
    // Distance reasoning
    if (restaurant.distance_km < 0.5) {
      reasons.push('very close');
    } else if (restaurant.distance_km < 2) {
      reasons.push('nearby');
    }
    
    // Price reasoning
    if (preferences.budget && restaurant.price_level <= preferences.budget) {
      reasons.push('budget-friendly');
    }
    
    // Cuisine match
    if (preferences.cuisine && restaurant.cuisine_types) {
      const matchingCuisines = preferences.cuisine.filter(c => 
        restaurant.cuisine_types.some((rc: string) => 
          rc.toLowerCase().includes(c.toLowerCase())
        )
      );
      if (matchingCuisines.length > 0) {
        reasons.push(`serves ${matchingCuisines[0]}`);
      }
    }
    
    // Rating reasoning
    if (restaurant.rating && restaurant.rating >= 4.5) {
      reasons.push('highly rated');
    }
    
    return reasons.slice(0, 2).join(', ') || 'available option';
  }

  async getRestaurantById(id: string): Promise<Restaurant | null> {
    try {
      const query = `
        SELECT id, name, latitude, longitude, vegan_score, price_level, 
               cuisine_types, address, rating
        FROM restaurants 
        WHERE id = '${id}'
      `;
      
      const results = await db.execute(sql.raw(query));
      const restaurants = results || [];
      
      if (restaurants.length === 0) return null;
      
      const r = restaurants[0];
      return {
        id: r.id,
        name: r.name,
        lat: parseFloat(r.latitude),
        lng: parseFloat(r.longitude),
        veganScore: r.vegan_score || 0,
        priceLevel: r.price_level || 1,
        cuisineTypes: r.cuisine_types || [],
        address: r.address,
        rating: r.rating,
        distance_km: 0,
        reason: 'selected restaurant'
      };
      
    } catch (error) {
      console.error('[RecommendationAgent] Error getting restaurant by ID:', error);
      return null;
    }
  }
}