import { Client } from '@googlemaps/google-maps-services-js';
import OpenAI from 'openai';
import { AI_CONFIG } from '../config/aiConfig';

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
      // Check if this is a food establishment first
      if (!this.isFoodEstablishment(cuisineTypes || [])) {
        return this.getNonFoodScore();
      }

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
   * Check if establishment is food-related
   */
  private isFoodEstablishment(cuisineTypes: string[]): boolean {
    const foodTypes = [
      'restaurant', 'food', 'cafe', 'bakery', 'bar', 'meal_takeaway', 
      'meal_delivery', 'pizza', 'chinese', 'italian', 'indian', 'thai',
      'mexican', 'japanese', 'greek', 'mediterranean', 'vietnamese',
      'fast_food', 'deli', 'bistro', 'pub', 'grill', 'buffet'
    ];
    
    const primaryNonFoodTypes = [
      'lodging', 'night_club', 'real_estate_agency', 'hospital', 'gas_station'
    ];
    
    // If any primary non-food type is present without food types, it's not a food establishment
    const hasPrimaryNonFood = cuisineTypes.some(type => primaryNonFoodTypes.includes(type.toLowerCase()));
    const hasFood = cuisineTypes.some(type => foodTypes.includes(type.toLowerCase()));
    
    if (hasPrimaryNonFood && !hasFood) {
      return false;
    }
    
    // Must have at least one food-related type to be considered food establishment
    return hasFood;
  }

  /**
   * Return appropriate score for non-food establishments
   */
  private getNonFoodScore(): VeganScoreResult {
    const breakdown: VeganScoreBreakdown = {
      menuVariety: 0,
      ingredientClarity: 0,
      staffKnowledge: 0,
      crossContamination: 0,
      nutritionalInfo: 0,
      allergenManagement: 0
    };

    return {
      overallScore: 0,
      breakdown,
      confidence: 1.0, // High confidence - not a food place
      reasoning: 'Not a food establishment - vegan scoring not applicable'
    };
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
    // Try GBGPT first if enabled
    if (AI_CONFIG.GBGPT_ENABLED && AI_CONFIG.GBGPT_ENDPOINT) {
      try {
        console.log('🔄 Using GBGPT for scoring...');
        return await this.scoreWithGBGPT(restaurantData);
      } catch (error) {
        console.warn('⚠️ GBGPT failed, falling back to OpenAI:', error instanceof Error ? error.message : String(error));
      }
    }
    
    // Fallback to OpenAI (existing logic)
    return await this.scoreWithOpenAI(restaurantData);
  }

  /**
   * Score restaurant using GBGPT
   */
  private async scoreWithGBGPT(restaurantData: any): Promise<VeganScoreResult> {
    // TODO: Ще се имплементира когато имаме ngrok URL
    throw new Error('GBGPT endpoint not configured');
  }

  /**
   * Score restaurant using OpenAI
   */
  private async scoreWithOpenAI(restaurantData: any): Promise<VeganScoreResult> {
    const reviewText = restaurantData.reviews.length > 0 
      ? restaurantData.reviews.map((review: any, index: number) => 
          `${index + 1}. "${review.text}" (Rating: ${review.rating}/5)`
        ).join('\n')
      : 'No reviews available for analysis';
    
    const prompt = `Analyze this Sofia, Bulgaria restaurant for vegan-friendliness. Be realistic but fair in scoring.

Restaurant: ${restaurantData.name}
Cuisine Types: ${restaurantData.cuisineTypes.join(', ')}
Website: ${restaurantData.website || 'Not available'}
Price Level: ${restaurantData.priceLevel || 'Not specified'}

Customer Reviews:
${reviewText}

SCORING GUIDELINES (0-10 scale):
- 8-10: Excellent vegan options, clearly marked, knowledgeable staff
- 6-7: Good vegan choices, some clarity, decent awareness  
- 4-5: Limited but available vegan options, basic awareness
- 2-3: Very few vegan options, minimal awareness
- 0-1: No clear vegan options or hostile to vegan dining

Score each dimension realistically:
1. Menu Variety: How many vegan dishes/options are clearly available?
2. Ingredient Clarity: Are vegan items clearly marked or ingredients listed?
3. Staff Knowledge: Based on reviews, how aware is staff of vegan needs?
4. Cross-contamination Prevention: Evidence of separate cooking/preparation?
5. Nutritional Information: Availability of nutritional/calorie details?
6. Allergen Management: How well do they handle dietary restrictions?

Consider cuisine type context:
- Pizza/Italian: Usually has vegan options (marinara, vegetables)
- Indian/Mediterranean: Traditionally more vegan-friendly
- Chinese/Thai: Often has tofu/vegetable dishes
- Cafes: Usually have plant milk, salads, some vegan pastries
- Fast food: Limited but often has some vegan options

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
    // Check if it's a food establishment first
    if (!this.isFoodEstablishment(cuisineTypes)) {
      return this.getNonFoodScore();
    }

    const veganFriendlyCuisines = [
      'vegan', 'vegetarian', 'mediterranean', 'indian', 'thai', 'vietnamese', 
      'middle_eastern', 'lebanese', 'ethiopian', 'mexican', 'chinese', 'japanese'
    ];
    
    const moderatelyFriendly = [
      'pizza', 'italian', 'cafe', 'bakery', 'greek'
    ];
    
    const hasVeganCuisine = cuisineTypes.some(cuisine => 
      veganFriendlyCuisines.includes(cuisine.toLowerCase())
    );
    
    const hasModerateOptions = cuisineTypes.some(cuisine => 
      moderatelyFriendly.includes(cuisine.toLowerCase())
    );
    
    let baseScore: number;
    if (hasVeganCuisine) {
      baseScore = 5.5; // Higher baseline for vegan-friendly cuisines
    } else if (hasModerateOptions) {
      baseScore = 3.0; // Moderate baseline for pizza, cafes etc
    } else {
      baseScore = 1.5; // Conservative baseline for other food places
    }
    
    const breakdown: VeganScoreBreakdown = {
      menuVariety: Math.max(0.5, baseScore - 0.5),
      ingredientClarity: Math.max(0.5, baseScore - 1.5),
      staffKnowledge: Math.max(0.5, baseScore - 1.0),
      crossContamination: Math.max(0.5, baseScore - 2.0),
      nutritionalInfo: Math.max(0.5, baseScore - 2.5),
      allergenManagement: Math.max(0.5, baseScore - 1.5)
    };

    return {
      overallScore: baseScore,
      breakdown,
      confidence: 0.4, // Moderate confidence for fallback
      reasoning: `Fallback scoring: ${hasVeganCuisine ? 'Vegan-friendly' : hasModerateOptions ? 'Moderate' : 'Basic'} cuisine type`
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