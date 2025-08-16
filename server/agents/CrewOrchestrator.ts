import { RecommendationAgent } from './RecommendationAgent';
import { ExplainabilityAgent } from './ExplainabilityAgent';
import { MemoryAgent } from './MemoryAgent';
import { AnalyticsAgent } from './AnalyticsAgent';

interface AgentResponse {
  agent: string;
  intent: string;
  inputs: any;
  outputs: any;
  userResponse: string;
}

interface UserQuery {
  text: string;
  location?: { lat: number; lng: number };
  preferences?: {
    cuisine?: string[];
    allergens?: string[];
    budget?: number;
  };
  context?: any;
}

export class CrewOrchestrator {
  private recommendationAgent: RecommendationAgent;
  private explainabilityAgent: ExplainabilityAgent;
  private memoryAgent: MemoryAgent;
  private analyticsAgent: AnalyticsAgent;

  constructor() {
    this.recommendationAgent = new RecommendationAgent();
    this.explainabilityAgent = new ExplainabilityAgent();
    this.memoryAgent = new MemoryAgent();
    this.analyticsAgent = new AnalyticsAgent();
  }

  async processQuery(query: UserQuery, isVoice: boolean = false): Promise<AgentResponse> {
    console.log('[CrewOrchestrator] Processing query:', query);
    
    try {
      // Determine intent and route to appropriate agent
      const intent = this.detectIntent(query.text);
      
      switch (intent) {
        case 'recommendation':
          return await this.handleRecommendation(query, isVoice);
        
        case 'explanation':
          return await this.handleExplanation(query, isVoice);
        
        case 'memory':
          return await this.handleMemory(query, isVoice);
        
        case 'analytics':
          return await this.handleAnalytics(query, isVoice);
        
        default:
          return await this.handleRecommendation(query, isVoice);
      }
    } catch (error) {
      console.error('[CrewOrchestrator] Error:', error);
      return {
        agent: 'CrewOrchestrator',
        intent: 'error',
        inputs: query,
        outputs: { error: (error as Error).message },
        userResponse: isVoice ? 
          "Sorry, I couldn't process that request." :
          "I encountered an error processing your request. Please try again."
      };
    }
  }

  private detectIntent(text: string): string {
    const lowerText = text.toLowerCase();
    
    // Explanation intent
    if (lowerText.includes('why') || lowerText.includes('score') || lowerText.includes('explain')) {
      return 'explanation';
    }
    
    // Memory intent
    if (lowerText.includes('favorite') || lowerText.includes('remember') || lowerText.includes('visited')) {
      return 'memory';
    }
    
    // Analytics intent (internal)
    if (lowerText.includes('analytics') || lowerText.includes('log')) {
      return 'analytics';
    }
    
    // Default to recommendation
    return 'recommendation';
  }

  private async handleRecommendation(query: UserQuery, isVoice: boolean): Promise<AgentResponse> {
    // Check if location is provided
    if (!query.location) {
      return {
        agent: 'CrewOrchestrator',
        intent: 'location_request',
        inputs: query,
        outputs: { needsLocation: true },
        userResponse: isVoice ? 
          "Where are you located?" :
          "I need your location to find nearby vegan restaurants. Please share your current location or search for a specific area."
      };
    }

    const recommendations = await this.recommendationAgent.getRecommendations({
      location: query.location,
      preferences: query.preferences || {},
      limit: 3
    });

    // Log analytics
    await this.analyticsAgent.logInteraction({
      type: 'recommendation_request',
      location: query.location,
      preferences: query.preferences,
      results: recommendations.length
    });

    const userResponse = isVoice ?
      this.formatVoiceRecommendations(recommendations) :
      this.formatTextRecommendations(recommendations);

    return {
      agent: 'RecommendationAgent',
      intent: 'recommendation',
      inputs: { location: query.location, preferences: query.preferences },
      outputs: { restaurants: recommendations },
      userResponse
    };
  }

  private async handleExplanation(query: UserQuery, isVoice: boolean): Promise<AgentResponse> {
    // Extract restaurant name or ID from query
    const restaurantInfo = this.extractRestaurantInfo(query.text);
    
    if (!restaurantInfo) {
      return {
        agent: 'ExplainabilityAgent',
        intent: 'explanation_error',
        inputs: query,
        outputs: { error: 'Restaurant not specified' },
        userResponse: isVoice ?
          "Which restaurant would you like me to explain?" :
          "Please specify which restaurant's vegan score you'd like me to explain."
      };
    }

    const explanation = await this.explainabilityAgent.explainScore(restaurantInfo);

    return {
      agent: 'ExplainabilityAgent',
      intent: 'explanation',
      inputs: { restaurantInfo },
      outputs: explanation,
      userResponse: isVoice ?
        `${restaurantInfo.name} scores ${explanation.score} because of ${explanation.reasons.slice(0, 2).join(' and ')}.` :
        `${restaurantInfo.name} has a Vegan Score of ${explanation.score}. Key factors: ${explanation.reasons.join(', ')}.`
    };
  }

  private async handleMemory(query: UserQuery, isVoice: boolean): Promise<AgentResponse> {
    const memoryResult = await this.memoryAgent.processMemoryQuery(query.text, query.context);

    return {
      agent: 'MemoryAgent',
      intent: 'memory',
      inputs: query,
      outputs: memoryResult,
      userResponse: isVoice ?
        memoryResult.voiceResponse :
        memoryResult.textResponse
    };
  }

  private async handleAnalytics(query: UserQuery, isVoice: boolean): Promise<AgentResponse> {
    const analyticsResult = await this.analyticsAgent.processAnalyticsQuery(query.text);

    return {
      agent: 'AnalyticsAgent',
      intent: 'analytics',
      inputs: query,
      outputs: analyticsResult,
      userResponse: isVoice ?
        "Analytics data logged." :
        "Analytics query processed successfully."
    };
  }

  private formatVoiceRecommendations(recommendations: any[]): string {
    if (recommendations.length === 0) {
      return "I didn't find any vegan restaurants nearby.";
    }
    
    if (recommendations.length === 1) {
      return `I found ${recommendations[0].name}.`;
    }
    
    const names = recommendations.slice(0, 2).map(r => r.name);
    return `Here are two options nearby: ${names.join(' and ')}.`;
  }

  private formatTextRecommendations(recommendations: any[]): string {
    if (recommendations.length === 0) {
      return "No vegan restaurants found in your area. Try expanding your search radius.";
    }

    const formattedList = recommendations.slice(0, 3).map(r => 
      `• ${r.name} - ${r.reason} (Score: ${r.veganScore})`
    ).join('\n');

    return `Found ${recommendations.length} vegan-friendly restaurants:\n\n${formattedList}`;
  }

  private extractRestaurantInfo(text: string): { name: string; id?: string } | null {
    // Simple extraction - in production, this would be more sophisticated
    const match = text.match(/(?:why does|explain|score for)\s+(.+?)\s+(?:have|score|get)/i);
    if (match) {
      return { name: match[1].trim() };
    }
    return null;
  }
}