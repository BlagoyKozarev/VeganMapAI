interface GBGPTRequest {
  model: string;
  prompt: string;
  max_tokens: number;
  temperature: number;
  top_p?: number;
}

interface GBGPTResponse {
  choices: Array<{
    text: string;
    index: number;
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class GBGPTProvider {
  private apiUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor() {
    this.apiUrl = process.env.GBGPT_API_URL || 'http://192.168.0.245:5000/v1/completions';
    this.apiKey = process.env.GBGPT_API_KEY || 'R@icommerce23';
    this.timeout = 20000; // 20 секунди - GBGPT е бавен!
    
    // Log connection info for debugging
    console.log('🤖 GBGPT Provider initialized:', {
      url: this.apiUrl,
      hasKey: !!this.apiKey,
      timeout: this.timeout
    });
  }

  /**
   * Score restaurant using GBGPT - BG language optimized
   */
  async scoreRestaurant(restaurantData: any): Promise<any> {
    console.log(`🔄 GBGPT scoring restaurant: ${restaurantData.name} (може да отнеме 10-15 сек)`);
    
    const prompt = this.createScoringPrompt(restaurantData);
    
    try {
      const response = await this.makeRequest({
        model: "gpt-3.5-turbo",
        prompt,
        max_tokens: 600,
        temperature: 0.2,
        top_p: 0.9
      });

      return this.parseScoringResponse(response);
      
    } catch (error: any) {
      console.error('❌ GBGPT scoring failed:', error.message);
      throw error;
    }
  }

  /**
   * Core API request method with robust error handling
   */
  private async makeRequest(payload: GBGPTRequest): Promise<string> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      console.log('📡 Making GBGPT API request... (може да отнеме време)');
      
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'User-Agent': 'VeganMapAI/1.0'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`GBGPT API Error ${response.status}: ${errorText}`);
      }

      const data: GBGPTResponse = await response.json();
      
      if (!data.choices || data.choices.length === 0) {
        throw new Error('GBGPT returned no choices');
      }

      return data.choices[0].text.trim();
      
    } catch (error: any) {
      clearTimeout(timeoutId);
      
      if (error.name === 'AbortError') {
        throw new Error(`GBGPT timeout after ${this.timeout/1000}s - server is slow`);
      }
      
      throw error;
    }
  }

  /**
   * Create scoring prompt in Bulgarian for better GBGPT understanding
   */
  private createScoringPrompt(restaurant: any): string {
    return `Анализирай този ресторант за vegan-friendliness и върни САМО JSON:

Ресторант: ${restaurant.name}
Адрес: ${restaurant.address || 'Неизвестен'}
Тип кухня: ${restaurant.cuisineTypes?.join(', ') || 'Неизвестен'}
Отзиви: ${restaurant.reviews?.slice(0, 3)?.map((r: any) => r.text)?.join(' | ') || 'Няма отзиви'}

Върни точно този JSON формат (без допълнителен текст):
{
  "menuVariety": [число 1-10],
  "ingredientClarity": [число 1-10], 
  "staffKnowledge": [число 1-10],
  "crossContamination": [число 1-10],
  "nutritionalInfo": [число 1-10],
  "allergenManagement": [число 1-10],
  "reasoning": "кратко обяснение на български",
  "confidence": [число 0.1-1.0]
}`;
  }

  /**
   * Parse GBGPT response and convert to VeganMapAI format
   */
  private parseScoringResponse(response: string): any {
    try {
      // Try to parse JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in GBGPT response');
      }

      const parsed = JSON.parse(jsonMatch[0]);
      
      // Convert to VeganMapAI format
      const totalScore = (
        parsed.menuVariety +
        parsed.ingredientClarity +
        parsed.staffKnowledge +
        parsed.crossContamination +
        parsed.nutritionalInfo +
        parsed.allergenManagement
      ) / 6;

      return {
        overallScore: Math.round((totalScore / 10) * 5 * 10) / 10, // Convert to 1-5 scale
        dimensions: {
          menuVariety: parsed.menuVariety,
          ingredientClarity: parsed.ingredientClarity,
          staffKnowledge: parsed.staffKnowledge,
          crossContamination: parsed.crossContamination,
          nutritionalInfo: parsed.nutritionalInfo,
          allergenManagement: parsed.allergenManagement
        },
        reasoning: parsed.reasoning,
        confidence: parsed.confidence || 0.5,
        provider: 'GBGPT',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('❌ Failed to parse GBGPT response:', error);
      throw new Error('Invalid GBGPT response format');
    }
  }

  /**
   * Health check for GBGPT connectivity
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testResponse = await this.makeRequest({
        model: "gpt-3.5-turbo",
        prompt: "Respond with: OK",
        max_tokens: 10,
        temperature: 0
      });

      return testResponse.toLowerCase().includes('ok');
      
    } catch (error: any) {
      console.error('❌ GBGPT health check failed:', error.message || error);
      
      // Check if it's a network connectivity issue
      if (error.cause?.code === 'UND_ERR_CONNECT_TIMEOUT' || 
          error.message?.includes('fetch failed')) {
        console.log('🔌 GBGPT server appears to be unreachable from this environment');
        console.log('💡 This is expected when running in Replit cloud environment');
        console.log('📝 GBGPT integration is ready for local deployment');
      }
      
      return false;
    }
  }

  /**
   * Check if GBGPT is available (for fallback logic)
   */
  async isAvailable(): Promise<boolean> {
    try {
      // Quick connection test without full request
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 3000); // Quick 3s timeout
      
      await fetch(this.apiUrl, {
        method: 'GET',
        signal: controller.signal,
        headers: { 'User-Agent': 'VeganMapAI-Health-Check' }
      });
      
      return true;
    } catch {
      return false;
    }
  }
}