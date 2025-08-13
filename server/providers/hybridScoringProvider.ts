import { GBGPTProvider } from './gbgptProvider.js';
import { ScoreAgent } from '../agents/scoreAgent.js';

/**
 * Hybrid scoring provider that tries GBGPT first, falls back to OpenAI
 */
export class HybridScoringProvider {
  private gbgpt: GBGPTProvider;
  private openaiAgent: ScoreAgent;
  private gbgptAvailable: boolean | null = null;
  
  constructor() {
    this.gbgpt = new GBGPTProvider();
    this.openaiAgent = new ScoreAgent();
    
    console.log('🔄 Hybrid Scoring Provider initialized - GBGPT primary, OpenAI fallback');
  }

  /**
   * Score restaurant using hybrid approach
   */
  async scoreRestaurant(restaurantData: any): Promise<any> {
    const startTime = Date.now();
    
    try {
      // Check if GBGPT is available (cache result for 5 minutes)
      if (this.gbgptAvailable === null) {
        console.log('🔍 Checking GBGPT availability...');
        this.gbgptAvailable = await this.gbgpt.isAvailable();
        
        // Cache availability check for 5 minutes
        setTimeout(() => {
          this.gbgptAvailable = null;
        }, 5 * 60 * 1000);
      }

      // Try GBGPT first if available
      if (this.gbgptAvailable) {
        console.log('🎯 Using GBGPT for scoring...');
        try {
          const result = await this.gbgpt.scoreRestaurant(restaurantData);
          const duration = Date.now() - startTime;
          console.log(`✅ GBGPT scoring successful in ${duration}ms`);
          return result;
        } catch (error: any) {
          console.log('⚠️ GBGPT failed, falling back to OpenAI:', error.message);
          // Mark as unavailable and continue with fallback
          this.gbgptAvailable = false;
        }
      }

      // Fallback to OpenAI using calculateVeganScore method
      console.log('🔄 Using OpenAI for scoring (fallback)...');
      const veganScore = await this.openaiAgent.calculateVeganScore(
        'test-place-id', // placeholder - not used in analysis anyway
        restaurantData.name,
        restaurantData.cuisineTypes || ['restaurant']
      );
      
      const duration = Date.now() - startTime;
      console.log(`✅ OpenAI scoring successful in ${duration}ms`);

      // Convert to hybrid format
      const result = {
        overallScore: veganScore.overallScore,
        dimensions: {
          menuVariety: veganScore.breakdown.menuVariety,
          ingredientClarity: veganScore.breakdown.ingredientClarity,
          staffKnowledge: veganScore.breakdown.staffKnowledge,
          crossContamination: veganScore.breakdown.crossContamination,
          nutritionalInfo: veganScore.breakdown.nutritionalInfo,
          allergenManagement: veganScore.breakdown.allergenManagement
        },
        reasoning: veganScore.reasoning,
        confidence: veganScore.confidence,
        provider: 'OpenAI (fallback)',
        timestamp: new Date().toISOString(),
        gbgptAttempted: this.gbgptAvailable !== false
      };
      
      return result;
      
    } catch (error: any) {
      console.error('❌ Both GBGPT and OpenAI scoring failed:', error);
      throw error;
    }
  }

  /**
   * Get provider status for monitoring
   */
  async getStatus(): Promise<any> {
    const [gbgptHealthy, openaiHealthy] = await Promise.allSettled([
      this.gbgpt.healthCheck(),
      this.testOpenAI()
    ]);

    return {
      gbgpt: {
        available: gbgptHealthy.status === 'fulfilled' ? gbgptHealthy.value : false,
        endpoint: process.env.GBGPT_API_URL,
        error: gbgptHealthy.status === 'rejected' ? gbgptHealthy.reason?.message : null
      },
      openai: {
        available: openaiHealthy.status === 'fulfilled' ? openaiHealthy.value : false,
        hasKey: !!process.env.OPENAI_API_KEY,
        error: openaiHealthy.status === 'rejected' ? openaiHealthy.reason?.message : null
      },
      fallbackActive: this.gbgptAvailable === false,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Test OpenAI connectivity
   */
  private async testOpenAI(): Promise<boolean> {
    try {
      // Quick test with minimal request
      const testData = {
        name: 'Test Restaurant',
        cuisineTypes: ['restaurant'],
        address: 'Test Address'
      };
      
      await this.scoreWithOpenAI(testData);
      return true;
    } catch (error) {
      console.error('OpenAI test failed:', error);
      return false;
    }
  }

  /**
   * Force refresh GBGPT availability check
   */
  async refreshGBGPTStatus(): Promise<boolean> {
    this.gbgptAvailable = null;
    this.gbgptAvailable = await this.gbgpt.isAvailable();
    return this.gbgptAvailable;
  }

  /**
   * Simple OpenAI scoring for fallback
   */
  private async scoreWithOpenAI(restaurantData: any): Promise<any> {
    // Create a compatible format for ScoreAgent
    const veganScore = await this.openaiAgent.calculateVeganScore(
      'test-place-id', // placeholder - not used in analysis
      restaurantData.name,
      restaurantData.cuisineTypes
    );

    // Convert to hybrid format
    return {
      overallScore: veganScore.overallScore,
      dimensions: {
        menuVariety: veganScore.breakdown.menuVariety,
        ingredientClarity: veganScore.breakdown.ingredientClarity,
        staffKnowledge: veganScore.breakdown.staffKnowledge,
        crossContamination: veganScore.breakdown.crossContamination,
        nutritionalInfo: veganScore.breakdown.nutritionalInfo,
        allergenManagement: veganScore.breakdown.allergenManagement
      },
      reasoning: veganScore.reasoning,
      confidence: veganScore.confidence,
      provider: 'OpenAI (fallback)',
      timestamp: new Date().toISOString()
    };
  }
}