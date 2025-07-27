import { Client } from '@googlemaps/google-maps-services-js';
import OpenAI from 'openai';

const googleMapsClient = new Client();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface VeganScoreBreakdown {
  menuVariety: number;      // 0-10: Variety of vegan options
  ingredientClarity: number; // 0-10: Clear ingredient listing
  staffKnowledge: number;   // 0-10: Staff knowledge about vegan options
  crossContamination: number; // 0-10: Prevention of cross-contamination
  nutritionalInfo: number;  // 0-10: Available nutritional information
  allergenManagement: number; // 0-10: Allergen awareness and management
}

interface VeganScoreResult {
  overallScore: number;
  breakdown: VeganScoreBreakdown;
  confidence: number;
  reasoning: string;
}

export class ScoreAgent {
  
  /**
   * Calculate comprehensive vegan score for a restaurant using AI analysis
   */
  async calculateVeganScore(
    placeId: string,
    restaurantName: string,
    cuisineTypes?: string[]
  ): Promise<VeganScoreResult> {
    try {
      // Get detailed place information from Google Places
      const placeDetails = await this.getPlaceDetails(placeId);
      
      // Get reviews for analysis
      const reviews = placeDetails.reviews || [];
      
      // Analyze vegan-friendliness using AI
      const analysis = await this.analyzeVeganFriendliness({
        name: restaurantName,
        cuisineTypes: cuisineTypes || [],
        reviews: reviews.slice(0, 10), // Analyze top 10 reviews
        photos: placeDetails.photos?.slice(0, 5) || [],
        website: placeDetails.website,
        priceLevel: placeDetails.price_level
      });

      return analysis;
    } catch (error) {
      console.error('Error calculating vegan score:', error);
      
      // Fallback scoring based on cuisine type
      return this.getFallbackScore(cuisineTypes || []);
    }
  }

  /**
   * Get detailed place information from Google Places API
   */
  private async getPlaceDetails(placeId: string) {
    const response = await googleMapsClient.placeDetails({
      params: {
        place_id: placeId,
        fields: [
          'name',
          'reviews',
          'photos',
          'website',
          'price_level',
          'types'
        ],
        key: process.env.GOOGLE_MAPS_API_KEY!,
      },
    });

    return response.data.result;
  }

  /**
   * Use AI to analyze vegan-friendliness
   */
  private async analyzeVeganFriendliness(restaurantData: any): Promise<VeganScoreResult> {
    const prompt = `Analyze this restaurant for vegan-friendliness and provide a detailed scoring breakdown.

Restaurant: ${restaurantData.name}
Cuisine Types: ${restaurantData.cuisineTypes.join(', ')}
Website: ${restaurantData.website || 'Not available'}
Price Level: ${restaurantData.priceLevel || 'Not specified'}

Reviews (for analysis):
${restaurantData.reviews.map((review: any, index: number) => 
  `${index + 1}. "${review.text}" (Rating: ${review.rating}/5)`
).join('\n')}

Please analyze and score on a scale of 0-10 for each dimension:

1. Menu Variety (0-10): How many vegan options are available?
2. Ingredient Clarity (0-10): Are ingredients clearly listed/labeled?
3. Staff Knowledge (0-10): How knowledgeable is staff about vegan options?
4. Cross-contamination Prevention (0-10): Measures to prevent cross-contamination?
5. Nutritional Information (0-10): Available nutritional details?
6. Allergen Management (0-10): Allergen awareness and management?

Respond with JSON in this exact format:
{
  "menuVariety": number,
  "ingredientClarity": number,
  "staffKnowledge": number,
  "crossContamination": number,
  "nutritionalInfo": number,
  "allergenManagement": number,
  "overallScore": number,
  "confidence": number,
  "reasoning": "string explanation"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a vegan dining expert. Analyze restaurants for vegan-friendliness based on available data. Be thorough but realistic in your scoring."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
      temperature: 0.3
    });

    const analysis = JSON.parse(response.choices[0].message.content || '{}');
    
    // Calculate overall score as weighted average
    const breakdown: VeganScoreBreakdown = {
      menuVariety: Math.max(0, Math.min(10, analysis.menuVariety || 0)),
      ingredientClarity: Math.max(0, Math.min(10, analysis.ingredientClarity || 0)),
      staffKnowledge: Math.max(0, Math.min(10, analysis.staffKnowledge || 0)),
      crossContamination: Math.max(0, Math.min(10, analysis.crossContamination || 0)),
      nutritionalInfo: Math.max(0, Math.min(10, analysis.nutritionalInfo || 0)),
      allergenManagement: Math.max(0, Math.min(10, analysis.allergenManagement || 0))
    };

    const overallScore = (
      breakdown.menuVariety * 0.25 +           // 25% weight
      breakdown.ingredientClarity * 0.20 +     // 20% weight  
      breakdown.staffKnowledge * 0.15 +        // 15% weight
      breakdown.crossContamination * 0.20 +    // 20% weight
      breakdown.nutritionalInfo * 0.10 +       // 10% weight
      breakdown.allergenManagement * 0.10      // 10% weight
    );

    return {
      overallScore: Math.round(overallScore * 10) / 10, // Round to 1 decimal
      breakdown,
      confidence: Math.max(0, Math.min(1, analysis.confidence || 0.7)),
      reasoning: analysis.reasoning || 'Analysis based on available restaurant data'
    };
  }

  /**
   * Fallback scoring when AI analysis fails
   */
  private getFallbackScore(cuisineTypes: string[]): VeganScoreResult {
    const veganFriendlyCuisines = [
      'vegan', 'vegetarian', 'mediterranean', 'indian', 'thai', 'vietnamese', 
      'middle_eastern', 'lebanese', 'ethiopian', 'mexican'
    ];
    
    const hasVeganCuisine = cuisineTypes.some(cuisine => 
      veganFriendlyCuisines.includes(cuisine.toLowerCase())
    );
    
    const baseScore = hasVeganCuisine ? 6.5 : 4.0;
    
    const breakdown: VeganScoreBreakdown = {
      menuVariety: baseScore,
      ingredientClarity: baseScore - 1,
      staffKnowledge: baseScore - 0.5,
      crossContamination: baseScore - 1.5,
      nutritionalInfo: baseScore - 2,
      allergenManagement: baseScore - 1
    };

    return {
      overallScore: baseScore,
      breakdown,
      confidence: 0.3, // Low confidence for fallback
      reasoning: 'Fallback scoring based on cuisine type analysis'
    };
  }

  /**
   * Batch calculate scores for multiple restaurants
   */
  async calculateBatchScores(restaurants: Array<{
    placeId: string;
    name: string;
    cuisineTypes?: string[];
  }>): Promise<Map<string, VeganScoreResult>> {
    const results = new Map<string, VeganScoreResult>();
    
    // Process in batches to avoid rate limits
    const batchSize = 5;
    for (let i = 0; i < restaurants.length; i += batchSize) {
      const batch = restaurants.slice(i, i + batchSize);
      
      const batchPromises = batch.map(async (restaurant) => {
        try {
          const score = await this.calculateVeganScore(
            restaurant.placeId,
            restaurant.name,
            restaurant.cuisineTypes
          );
          return { placeId: restaurant.placeId, score };
        } catch (error) {
          console.error(`Error scoring ${restaurant.name}:`, error);
          return { 
            placeId: restaurant.placeId, 
            score: this.getFallbackScore(restaurant.cuisineTypes || [])
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      batchResults.forEach(({ placeId, score }) => {
        results.set(placeId, score);
      });

      // Add delay between batches to respect rate limits
      if (i + batchSize < restaurants.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return results;
  }
}

export const scoreAgent = new ScoreAgent();