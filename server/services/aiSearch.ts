import OpenAI from 'openai';
import type { Restaurant } from '../../shared/schema.js';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function searchRestaurantsWithAI(query: string, restaurants: Restaurant[]): Promise<{
  restaurants: Restaurant[];
  explanation: string;
}> {
  try {
    // Prepare restaurant data for AI analysis
    const restaurantData = restaurants.map(r => ({
      id: r.id,
      name: r.name,
      address: r.address,
      cuisineTypes: r.cuisineTypes || [],
      veganScore: r.veganScore || 0,
      rating: r.rating || 0,
      priceLevel: r.priceLevel || 0,
      latitude: r.latitude,
      longitude: r.longitude
    }));

    const systemPrompt = `You are a helpful vegan restaurant assistant. Analyze the user's query and find the most relevant restaurants from the provided list.
    
Consider these factors when searching:
- Restaurant names and addresses
- Cuisine types (e.g., Italian, Bulgarian, Asian)
- Vegan scores (0-5, where 5 is fully vegan)
- Google ratings (0-5)
- Price levels (1-4, where 1 is cheapest)
- Special dietary requirements mentioned (no soy, gluten-free, etc.)

Return a JSON response with:
{
  "restaurantIds": [array of restaurant IDs that match],
  "explanation": "Brief explanation of why these restaurants were selected"
}`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: `User query: "${query}"
          
Available restaurants:
${JSON.stringify(restaurantData, null, 2)}`
        }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 1000
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    
    // Filter restaurants based on AI's selection
    const selectedRestaurants = restaurants.filter(r => 
      result.restaurantIds?.includes(r.id)
    );

    return {
      restaurants: selectedRestaurants,
      explanation: result.explanation || 'Found restaurants matching your criteria.'
    };
  } catch (error) {
    console.error('AI search error:', error);
    throw new Error('Failed to process AI search');
  }
}