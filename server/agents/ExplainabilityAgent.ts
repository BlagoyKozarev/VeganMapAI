import { db } from '../db';
import { sql } from 'drizzle-orm';

interface RestaurantInfo {
  name: string;
  id?: string;
}

interface ScoreExplanation {
  score: number;
  reasons: string[];
  factors: {
    menu: number;
    reviews: number;
    options: number;
    allergens: number;
  };
}

export class ExplainabilityAgent {
  async explainScore(restaurantInfo: RestaurantInfo): Promise<ScoreExplanation> {
    console.log('[ExplainabilityAgent] Explaining score for:', restaurantInfo);
    
    try {
      // Find restaurant by name or ID
      const restaurant = await this.findRestaurant(restaurantInfo);
      
      if (!restaurant) {
        return {
          score: 0,
          reasons: ['Restaurant not found in database'],
          factors: { menu: 0, reviews: 0, options: 0, allergens: 0 }
        };
      }
      
      // Generate explanation based on available data
      const explanation = this.generateExplanation(restaurant);
      
      return explanation;
      
    } catch (error) {
      console.error('[ExplainabilityAgent] Error:', error);
      return {
        score: 0,
        reasons: ['Unable to analyze restaurant score'],
        factors: { menu: 0, reviews: 0, options: 0, allergens: 0 }
      };
    }
  }

  private async findRestaurant(info: RestaurantInfo): Promise<any> {
    let query: string;
    let params: any[];
    
    if (info.id) {
      query = `
        SELECT id, name, vegan_score, price_level, cuisine_types, 
               address, rating, phone_number, website
        FROM restaurants 
        WHERE id = '${info.id}'
      `;
    } else {
      query = `
        SELECT id, name, vegan_score, price_level, cuisine_types, 
               address, rating, phone_number, website
        FROM restaurants 
        WHERE name ILIKE '%${info.name}%'
        LIMIT 1
      `;
    }
    
    const results = await db.execute(sql.raw(query));
    const restaurants = results || [];
    
    return restaurants.length > 0 ? restaurants[0] : null;
  }

  private generateExplanation(restaurant: any): ScoreExplanation {
    const score = restaurant.vegan_score || 0;
    const reasons: string[] = [];
    const factors = { menu: 0, reviews: 0, options: 0, allergens: 0 };
    
    // Score range explanations
    if (score >= 9) {
      reasons.push('fully vegan establishment');
      factors.menu = 100;
      factors.options = 100;
    } else if (score >= 8) {
      reasons.push('extensive vegan menu');
      factors.menu = 90;
      factors.options = 85;
    } else if (score >= 7) {
      reasons.push('good vegan options');
      factors.menu = 75;
      factors.options = 70;
    } else if (score >= 6) {
      reasons.push('decent vegan choices');
      factors.menu = 60;
      factors.options = 65;
    } else if (score >= 5) {
      reasons.push('some vegan items');
      factors.menu = 50;
      factors.options = 50;
    } else if (score > 0) {
      reasons.push('limited vegan options');
      factors.menu = 30;
      factors.options = 35;
    } else {
      reasons.push('vegan options may be limited');
      factors.menu = 20;
      factors.options = 25;
    }
    
    // Cuisine type factors
    if (restaurant.cuisine_types) {
      const cuisines = restaurant.cuisine_types;
      
      if (cuisines.includes('vegan') || cuisines.includes('vegetarian')) {
        reasons.push('specialized in plant-based food');
        factors.menu += 20;
      }
      
      if (cuisines.includes('mediterranean') || cuisines.includes('middle_eastern')) {
        reasons.push('cuisine naturally includes vegan dishes');
        factors.options += 15;
      }
      
      if (cuisines.includes('asian') || cuisines.includes('indian')) {
        reasons.push('traditional plant-based options');
        factors.options += 10;
      }
    }
    
    // Rating influence
    if (restaurant.rating) {
      if (restaurant.rating >= 4.5) {
        reasons.push('excellent customer reviews');
        factors.reviews = 90;
      } else if (restaurant.rating >= 4.0) {
        reasons.push('positive customer feedback');
        factors.reviews = 75;
      } else if (restaurant.rating >= 3.5) {
        factors.reviews = 60;
      } else {
        factors.reviews = 40;
      }
    } else {
      factors.reviews = 50; // Neutral when no rating
    }
    
    // Price level considerations
    if (restaurant.price_level) {
      if (restaurant.price_level <= 2) {
        reasons.push('affordable pricing');
      }
    }
    
    // Website/contact availability (suggests better service)
    if (restaurant.website || restaurant.phone_number) {
      factors.allergens += 20;
    }
    
    // Ensure factors don't exceed 100
    Object.keys(factors).forEach(key => {
      factors[key as keyof typeof factors] = Math.min(factors[key as keyof typeof factors], 100);
    });
    
    // Limit reasons to top 3 most relevant
    const topReasons = reasons.slice(0, 3);
    
    return {
      score: score,
      reasons: topReasons,
      factors
    };
  }

  async getBatchExplanations(restaurantIds: string[]): Promise<Map<string, ScoreExplanation>> {
    const explanations = new Map<string, ScoreExplanation>();
    
    try {
      const idList = restaurantIds.map(id => `'${id}'`).join(',');
      const query = `
        SELECT id, name, vegan_score, price_level, cuisine_types, 
               address, rating, phone_number, website
        FROM restaurants 
        WHERE id IN (${idList})
      `;
      
      const results = await db.execute(sql.raw(query));
      const restaurants = results || [];
      
      for (const restaurant of restaurants) {
        const explanation = this.generateExplanation(restaurant);
        explanations.set(restaurant.id, explanation);
      }
      
    } catch (error) {
      console.error('[ExplainabilityAgent] Error in batch explanations:', error);
    }
    
    return explanations;
  }
}