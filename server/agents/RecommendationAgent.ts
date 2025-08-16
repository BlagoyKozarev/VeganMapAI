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
      const { lat, lng } = location;
      const maxDistance = 5; // 5km radius
      const minScore = 0; // Accept all scores for now
      
      // Build cuisine array filter
      const cuisinesArr = preferences.cuisine || [];
      const allergensArr = preferences.allergens || [];
      
      // Use proper Haversine formula with parameter binding
      const query = `
        WITH params AS (
          SELECT
            ${lat}::float8 AS lat, ${lng}::float8 AS lng,
            ${maxDistance}::float8 AS radius_km, ${minScore}::int AS min_score,
            ARRAY[${cuisinesArr.map((c: string) => `'${c}'`).join(',')}]::text[] AS cuisines,
            ARRAY[${allergensArr.map((a: string) => `'${a}'`).join(',')}]::text[] AS allergens,
            ${limit}::int AS lim
        )
        SELECT r.id, r.name, r.latitude, r.longitude,
               r.vegan_score, r.cuisine_types, r.price_level, r.address, r.rating,
               2 * 6371 * asin(
                 sqrt(
                   sin(radians((r.latitude - p.lat)/2))^2 +
                   cos(radians(p.lat)) * cos(radians(r.latitude)) *
                   sin(radians((r.longitude - p.lng)/2))^2
                 )
               ) AS distance_km
        FROM restaurants r, params p
        WHERE COALESCE(r.vegan_score, 0) >= p.min_score
          AND (
            ARRAY_LENGTH(p.cuisines, 1) IS NULL OR ARRAY_LENGTH(p.cuisines, 1) = 0
            OR r.cuisine_types && p.cuisines
          )
          AND 2 * 6371 * asin(
                 sqrt(
                   sin(radians((r.latitude - p.lat)/2))^2 +
                   cos(radians(p.lat)) * cos(radians(r.latitude)) *
                   sin(radians((r.longitude - p.lng)/2))^2
                 )
               ) <= p.radius_km
        ORDER BY distance_km ASC, COALESCE(r.vegan_score, 0) DESC
        LIMIT (SELECT lim FROM params)
      `;
      
      console.log('[RecommendationAgent] Query:', query);
      
      const results = await db.execute(sql.raw(query));
      const restaurants = (results as any)?.rows || results || [];
      
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
        distance_km: parseFloat(r.distance_km) || 0,
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
      const restaurants = (results as any)?.rows || results || [];
      
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