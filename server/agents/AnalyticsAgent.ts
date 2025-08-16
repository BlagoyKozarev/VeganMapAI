// Analytics Agent - Logs user interactions for analytics dashboard

interface AnalyticsEvent {
  timestamp: string;
  type: string;
  userId?: string;
  data: any;
  sessionId?: string;
}

interface AnalyticsQuery {
  query: string;
  results?: any;
}

export class AnalyticsAgent {
  private events: AnalyticsEvent[] = [];
  
  async logInteraction(eventData: {
    type: string;
    userId?: string;
    data?: any;
    sessionId?: string;
  }): Promise<void> {
    const event: AnalyticsEvent = {
      timestamp: new Date().toISOString(),
      type: eventData.type,
      userId: eventData.userId || 'anonymous',
      data: eventData.data || {},
      sessionId: eventData.sessionId || 'default'
    };
    
    this.events.push(event);
    
    // Keep only last 1000 events in memory (production would use proper storage)
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }
    
    console.log('[AnalyticsAgent] Logged event:', event.type, event.data);
    
    // In production, this would send to analytics service
    this.sendToAnalyticsService(event);
  }

  async processAnalyticsQuery(query: string): Promise<AnalyticsQuery> {
    console.log('[AnalyticsAgent] Processing analytics query:', query);
    
    // Simple analytics queries for development
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('count') || lowerQuery.includes('total')) {
      return {
        query,
        results: {
          totalEvents: this.events.length,
          uniqueUsers: new Set(this.events.map(e => e.userId)).size,
          topEventTypes: this.getTopEventTypes()
        }
      };
    }
    
    if (lowerQuery.includes('search')) {
      const searchEvents = this.events.filter(e => e.type.includes('search'));
      return {
        query,
        results: {
          totalSearches: searchEvents.length,
          topSearchTerms: this.getTopSearchTerms(searchEvents)
        }
      };
    }
    
    if (lowerQuery.includes('recommendation')) {
      const recEvents = this.events.filter(e => e.type.includes('recommendation'));
      return {
        query,
        results: {
          totalRecommendations: recEvents.length,
          avgResultsPerRequest: this.getAvgResults(recEvents)
        }
      };
    }
    
    return {
      query,
      results: {
        message: 'Analytics query processed',
        availableMetrics: ['counts', 'searches', 'recommendations']
      }
    };
  }

  private sendToAnalyticsService(event: AnalyticsEvent): void {
    // Placeholder for actual analytics service integration
    // In production, this would send to Google Analytics, Mixpanel, etc.
    
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics] Event:', {
        type: event.type,
        timestamp: event.timestamp,
        data: JSON.stringify(event.data).slice(0, 100)
      });
    }
  }

  private getTopEventTypes(): { type: string; count: number }[] {
    const typeCounts = new Map<string, number>();
    
    this.events.forEach(event => {
      const count = typeCounts.get(event.type) || 0;
      typeCounts.set(event.type, count + 1);
    });
    
    return Array.from(typeCounts.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }

  private getTopSearchTerms(searchEvents: AnalyticsEvent[]): { term: string; count: number }[] {
    const termCounts = new Map<string, number>();
    
    searchEvents.forEach(event => {
      const query = event.data?.query || event.data?.q;
      if (query && typeof query === 'string') {
        const count = termCounts.get(query) || 0;
        termCounts.set(query, count + 1);
      }
    });
    
    return Array.from(termCounts.entries())
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getAvgResults(recEvents: AnalyticsEvent[]): number {
    if (recEvents.length === 0) return 0;
    
    const totalResults = recEvents.reduce((sum, event) => {
      return sum + (event.data?.results || 0);
    }, 0);
    
    return Math.round((totalResults / recEvents.length) * 100) / 100;
  }

  // Predefined event logging methods for common interactions
  async logSearch(userId: string, searchParams: any, resultCount: number): Promise<void> {
    await this.logInteraction({
      type: 'search_performed',
      userId,
      data: { ...searchParams, resultCount }
    });
  }

  async logRecommendationRequest(userId: string, location: any, preferences: any, resultCount: number): Promise<void> {
    await this.logInteraction({
      type: 'recommendation_request',
      userId,
      data: { location, preferences, resultCount }
    });
  }

  async logRestaurantView(userId: string, restaurantId: string, source: string): Promise<void> {
    await this.logInteraction({
      type: 'restaurant_viewed',
      userId,
      data: { restaurantId, source }
    });
  }

  async logFavoriteAction(userId: string, restaurantId: string, action: 'add' | 'remove'): Promise<void> {
    await this.logInteraction({
      type: 'favorite_action',
      userId,
      data: { restaurantId, action }
    });
  }

  async logVoiceInteraction(userId: string, query: string, response: string, agent: string): Promise<void> {
    await this.logInteraction({
      type: 'voice_interaction',
      userId,
      data: { query, response, agent }
    });
  }

  async logMapInteraction(userId: string, action: string, location?: any): Promise<void> {
    await this.logInteraction({
      type: 'map_interaction',
      userId,
      data: { action, location }
    });
  }

  // Get analytics summary for dashboard
  async getAnalyticsSummary(): Promise<any> {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(e => new Date(e.timestamp) > last24h);
    
    return {
      last24Hours: {
        totalEvents: recentEvents.length,
        uniqueUsers: new Set(recentEvents.map(e => e.userId)).size,
        topEvents: this.getTopEventTypes(),
        searches: recentEvents.filter(e => e.type.includes('search')).length,
        recommendations: recentEvents.filter(e => e.type.includes('recommendation')).length,
        voiceInteractions: recentEvents.filter(e => e.type === 'voice_interaction').length
      },
      allTime: {
        totalEvents: this.events.length,
        uniqueUsers: new Set(this.events.map(e => e.userId)).size,
        topEventTypes: this.getTopEventTypes()
      }
    };
  }
}