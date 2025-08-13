import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export interface VeganScoreAnalysis {
  menuVariety: number;
  ingredientClarity: number;
  staffKnowledge: number;
  crossContaminationPrevention: number;
  nutritionalInformation: number;
  allergenManagement: number;
  overallScore: number;
  reasoning: string;
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  restaurantRecommendations?: any[];
}

export async function analyzeVeganFriendliness(
  restaurantData: {
    name: string;
    description?: string;
    menu?: string;
    reviews?: string[];
    cuisine?: string[];
  }
): Promise<VeganScoreAnalysis> {
  try {
    const prompt = `
      Analyze the following restaurant data and provide a comprehensive vegan-friendliness score.
      Rate each dimension from 0-10 and provide an overall score:
      
      Restaurant: ${restaurantData.name}
      Description: ${restaurantData.description || 'N/A'}
      Menu: ${restaurantData.menu || 'N/A'}
      Cuisine Types: ${restaurantData.cuisine?.join(', ') || 'N/A'}
      Reviews: ${restaurantData.reviews?.slice(0, 5).join('\n') || 'N/A'}
      
      Evaluate these 6 dimensions:
      1. Menu Variety (0-10): How many vegan options are available?
      2. Ingredient Clarity (0-10): How clearly are ingredients listed and vegan items marked?
      3. Staff Knowledge (0-10): Based on reviews, how knowledgeable is staff about vegan options?
      4. Cross-contamination Prevention (0-10): How well does the restaurant prevent cross-contamination?
      5. Nutritional Information (0-10): How well does the restaurant provide nutritional information?
      6. Allergen Management (0-10): How well does the restaurant handle allergen concerns?
      
      Respond with JSON in this exact format:
      {
        "menuVariety": number,
        "ingredientClarity": number,
        "staffKnowledge": number,
        "crossContaminationPrevention": number,
        "nutritionalInformation": number,
        "allergenManagement": number,
        "overallScore": number,
        "reasoning": "detailed explanation of the scoring"
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a vegan nutrition expert and restaurant analyst. Provide accurate, detailed vegan-friendliness scores based on the provided data."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Ensure all scores are within valid range
    const validatedResult: VeganScoreAnalysis = {
      menuVariety: Math.max(0, Math.min(10, result.menuVariety || 0)),
      ingredientClarity: Math.max(0, Math.min(10, result.ingredientClarity || 0)),
      staffKnowledge: Math.max(0, Math.min(10, result.staffKnowledge || 0)),
      crossContaminationPrevention: Math.max(0, Math.min(10, result.crossContaminationPrevention || 0)),
      nutritionalInformation: Math.max(0, Math.min(10, result.nutritionalInformation || 0)),
      allergenManagement: Math.max(0, Math.min(10, result.allergenManagement || 0)),
      overallScore: Math.max(0, Math.min(10, result.overallScore || 0)),
      reasoning: result.reasoning || "Analysis completed based on available data."
    };

    return validatedResult;
  } catch (error) {
    console.error("Error analyzing vegan friendliness:", error);
    throw new Error("Failed to analyze vegan friendliness: " + (error as Error).message);
  }
}

export async function chatWithAI(
  message: string,
  context: {
    userProfile?: any;
    nearbyRestaurants?: any[];
    chatHistory?: any[];
  }
): Promise<ChatResponse> {
  try {
    const systemPrompt = `
      You are VeganAI, a helpful assistant specializing in vegan and plant-based dining.
      You help users find vegan-friendly restaurants, explain vegan scores, and answer questions about plant-based dining.
      
      User Profile: ${JSON.stringify(context.userProfile || {})}
      Nearby Restaurants: ${JSON.stringify(context.nearbyRestaurants?.slice(0, 5) || [])}
      
      Guidelines:
      - Be helpful, friendly, and knowledgeable about vegan dining
      - Provide specific restaurant recommendations when relevant
      - Explain vegan scores clearly (0-10 scale with 6 dimensions)
      - Offer practical advice about dining out as a vegan
      - Be mindful of user's allergies and dietary restrictions
      
      Respond with JSON in this format:
      {
        "message": "your response message",
        "suggestions": ["optional array of quick reply suggestions"],
        "restaurantRecommendations": ["optional array of restaurant IDs to highlight"]
      }
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(context.chatHistory || []).slice(-10), // Last 10 messages for context
      { role: "user", content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages as any,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    return {
      message: result.message || "I'm here to help you find amazing vegan places!",
      suggestions: result.suggestions || [],
      restaurantRecommendations: result.restaurantRecommendations || []
    };
  } catch (error) {
    console.error("Error in AI chat:", error);
    throw new Error("Failed to process chat message: " + (error as Error).message);
  }
}

export async function generateRestaurantRecommendations(
  userProfile: any,
  userLocation: { lat: number; lng: number },
  restaurants: any[]
): Promise<string[]> {
  try {
    const prompt = `
      Based on the user profile and available restaurants, recommend the top 5 restaurants.
      
      User Profile: ${JSON.stringify(userProfile)}
      User Location: ${JSON.stringify(userLocation)}
      Available Restaurants: ${JSON.stringify(restaurants.slice(0, 20))}
      
      Consider:
      - User's dietary style and allergies
      - Restaurant vegan scores
      - Distance from user
      - User's preferred cuisines and price range
      - Recent user behavior patterns
      
      Respond with JSON array of restaurant IDs in order of recommendation:
      {
        "recommendations": ["restaurant_id_1", "restaurant_id_2", ...]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a personalized restaurant recommendation engine for vegan-friendly dining."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return result.recommendations || [];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [];
  }
}
