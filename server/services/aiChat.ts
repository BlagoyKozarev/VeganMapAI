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
    const systemPrompt = `You are VeganAI, a concise assistant for VeganMapAI platform.

COMMUNICATION STYLE:
- Be brief, clear, and direct
- Give results, not explanations of your task
- No repetitive phrases or verbose introductions
- Maximum 2-3 sentences per response
- Focus on actionable information

USER CONTEXT:
${context.userProfile ? `Dietary: ${context.userProfile.dietaryStyle}, Allergies: ${context.userProfile.allergies?.join(', ') || 'None'}, Price: ${context.userProfile.priceRange}` : 'No profile'}

NEARBY RESTAURANTS:
${context.nearbyRestaurants.slice(0, 3).map(r => `${r.name} (${r.veganScore}/10)`).join(', ')}

RULES:
- Answer directly without task repetition
- Mention specific restaurant names when relevant
- For scoring questions: briefly explain the 6 criteria
- Always note allergies if relevant`;

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