/**
 * AI Agents for VeganMapAI
 * Handles various AI-powered interactions and recommendations
 */
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true 
});

// System prompts for different agents
const SYSTEM_PROMPTS = {
  MAIN: `
You are VeganMapAI Assistant, a helpful AI for discovering vegan restaurants in Sofia, Bulgaria. 

Guidelines:
- Reply in 1-2 short sentences maximum
- If asked "why this Vegan Score": explain with 2-3 key criteria (ingredients, preparation, certifications)
- If asked for recommendations: return 2-3 specific places with brief reasons
- Always request user location if missing for recommendations
- Focus on Sofia, Bulgaria restaurants only
- Language: English only
- Be conversational but concise for voice interaction
`,

  EXPLAINABILITY: `
You are the VeganMapAI Explainability Agent. Your job is to explain vegan scores and restaurant ratings clearly.

Rules:
- Explain scores using our 6-dimension system: Ingredients, Preparation, Menu Variety, Staff Knowledge, Certifications, Community Trust
- Always mention 2-3 specific criteria that influenced the score
- Keep explanations under 50 words for voice responses
- Use simple, clear language
`,

  RECOMMENDATION: `
You are the VeganMapAI Recommendation Agent. You suggest the best vegan restaurants based on user preferences.

Rules:
- Recommend 2-3 specific restaurants maximum
- Include brief reason for each recommendation (cuisine type, special features, location)
- Ask for location if not provided
- Consider user dietary restrictions if mentioned
- Keep responses under 60 words for voice interaction
`
};

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface AgentContext {
  userLocation?: { lat: number; lng: number };
  preferences?: string[];
  previousMessages?: ChatMessage[];
}

export async function askAgent(userText: string, context?: AgentContext): Promise<string> {
  try {
    console.log(`[AI Agent] Processing: "${userText}"`);
    
    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPTS.MAIN },
      { role: "user", content: userText }
    ];

    // Add context if available
    if (context?.userLocation) {
      messages.splice(1, 0, {
        role: "system",
        content: `User location: ${context.userLocation.lat}, ${context.userLocation.lng} (Sofia, Bulgaria)`
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      max_tokens: 150, // Limit for voice responses
      messages
    });

    const reply = response.choices[0]?.message?.content?.trim() || "Sorry, I didn't understand that.";
    console.log(`[AI Agent] Response: "${reply}"`);
    
    return reply;
  } catch (error: any) {
    console.error('[AI Agent] Error:', error.message);
    return "I'm having trouble right now. Please try again.";
  }
}

export async function explainVeganScore(restaurantName: string, score: number): Promise<string> {
  try {
    const prompt = `Explain why restaurant "${restaurantName}" has a vegan score of ${score}/10. Use our 6-dimension criteria.`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.2,
      max_tokens: 100,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.EXPLAINABILITY },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0]?.message?.content?.trim() || "Score based on ingredients, preparation, and menu variety.";
  } catch (error: any) {
    console.error('[Explainability Agent] Error:', error.message);
    return "Score based on our vegan criteria analysis.";
  }
}

export async function getRecommendations(userPreferences: string, location?: { lat: number; lng: number }): Promise<string> {
  try {
    const locationText = location ? `near ${location.lat}, ${location.lng}` : "in Sofia";
    const prompt = `Recommend vegan restaurants ${locationText} for someone who wants: ${userPreferences}`;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        { role: "system", content: SYSTEM_PROMPTS.RECOMMENDATION },
        { role: "user", content: prompt }
      ]
    });

    return response.choices[0]?.message?.content?.trim() || "Try Green Garden or Veggic for great vegan options.";
  } catch (error: any) {
    console.error('[Recommendation Agent] Error:', error.message);
    return "I'd recommend checking our map for top-rated vegan spots near you.";
  }
}

// Placeholder agents as specified in the master prompt
export function saveMemory(evt: { userId: string; text: string; ts: number }) {
  console.debug("MEMORY_EVT", evt);
  // TODO: Implement memory persistence
}

export function trackUX(evt: { name: string; meta: any; ts: number }) {
  console.debug("UX_EVT", evt);
  // TODO: Implement analytics tracking
}

// Voice-optimized response formatting
export function formatForVoice(text: string): string {
  // Ensure response is voice-friendly
  return text
    .replace(/[()[\]{}]/g, '') // Remove brackets
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
    .slice(0, 200); // Max 200 chars for voice
}

// Context-aware agent selection
export async function smartAgentResponse(userText: string, context?: AgentContext): Promise<string> {
  const lowerText = userText.toLowerCase();
  
  // Route to appropriate agent based on user intent
  if (lowerText.includes('score') || lowerText.includes('why') || lowerText.includes('rating')) {
    // Extract restaurant name if possible
    const match = userText.match(/restaurant|place|spot\s+(.+?)(?:\s|$)/i);
    const restaurantName = match?.[1] || "this restaurant";
    const score = Math.floor(Math.random() * 4) + 7; // Mock score 7-10
    return await explainVeganScore(restaurantName, score);
  }
  
  if (lowerText.includes('recommend') || lowerText.includes('suggest') || lowerText.includes('best')) {
    return await getRecommendations(userText, context?.userLocation);
  }
  
  // Default to main agent
  return await askAgent(userText, context);
}