import OpenAI from "openai";
import type { UserProfile, Restaurant } from "@shared/schema";

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface ChatContext {
  userProfile?: UserProfile;
  nearbyRestaurants: Restaurant[];
  chatHistory: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  suggestions?: string[];
  restaurantRecommendations?: {
    id: string;
    name: string;
    reason: string;
  }[];
}

export async function chatWithAI(userMessage: string, context: ChatContext): Promise<ChatResponse> {
  try {
    // Build context for the AI
    const systemPrompt = `You are VeganAI, an expert assistant for VeganMapAI - a platform that helps users find vegan-friendly restaurants with comprehensive scoring.

Your role:
- Help users discover great vegan and vegan-friendly restaurants
- Explain our 6-dimension vegan scoring system (Menu Variety, Ingredient Clarity, Staff Knowledge, Cross-contamination Prevention, Nutritional Information, Allergen Management)
- Provide personalized recommendations based on user preferences
- Answer questions about plant-based dining and veganism
- Be friendly, knowledgeable, and helpful

User Profile Context:
${context.userProfile ? `
- Dietary Style: ${context.userProfile.dietaryStyle}
- Allergies: ${context.userProfile.allergies?.join(', ') || 'None specified'}
- Preferred Cuisines: ${context.userProfile.preferredCuisines?.join(', ') || 'None specified'}
- Price Range: ${context.userProfile.priceRange}
- Max Distance: ${context.userProfile.maxDistance}m
` : 'No user profile available'}

Nearby Restaurants Context:
${context.nearbyRestaurants.map(r => `
- ${r.name} (Score: ${r.veganScore}/10, Cuisine: ${r.cuisineTypes?.join(', ') || 'Not specified'}, Price: ${r.priceLevel || 'Not specified'})
`).join('')}

Guidelines:
- Keep responses conversational and helpful
- Reference specific restaurants when relevant
- Suggest concrete actions when possible
- If asked about scoring, explain our comprehensive 6-dimension system
- Always prioritize user safety regarding allergies`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      // Include last few messages for context
      ...context.chatHistory.slice(-4).map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const aiMessage = response.choices[0].message.content || "I'm sorry, I couldn't process your request right now.";

    // Extract restaurant recommendations if the AI mentioned specific places
    const restaurantRecommendations: ChatResponse['restaurantRecommendations'] = [];
    
    context.nearbyRestaurants.forEach(restaurant => {
      if (aiMessage.toLowerCase().includes(restaurant.name.toLowerCase())) {
        restaurantRecommendations.push({
          id: restaurant.id,
          name: restaurant.name,
          reason: `Mentioned in response - Score: ${restaurant.veganScore}/10`
        });
      }
    });

    // Generate suggestions based on the conversation
    const suggestions: string[] = [];
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('score') || lowerMessage.includes('rating')) {
      suggestions.push("How is scoring calculated?");
    }
    if (lowerMessage.includes('nearby') || lowerMessage.includes('near')) {
      suggestions.push("Find nearby vegan places");
    }
    if (lowerMessage.includes('allergy') || lowerMessage.includes('allergic')) {
      suggestions.push("Allergy-friendly options");
    }
    if (lowerMessage.includes('best') || lowerMessage.includes('recommend')) {
      suggestions.push("Best vegan restaurants");
    }

    return {
      message: aiMessage,
      suggestions: suggestions.length > 0 ? suggestions : undefined,
      restaurantRecommendations: restaurantRecommendations.length > 0 ? restaurantRecommendations : undefined
    };

  } catch (error) {
    console.error("Error in AI chat:", error);
    
    // Fallback response
    return {
      message: "I'm experiencing some technical difficulties right now. Please try asking your question again, or use the search feature to find restaurants directly.",
      suggestions: [
        "Find nearby vegan places",
        "How is scoring calculated?",
        "Best vegan restaurants"
      ]
    };
  }
}