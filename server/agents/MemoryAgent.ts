// Memory Agent - Placeholder implementation for Beta
// Handles user favorites, recent searches, and visited places

interface UserMemory {
  userId?: string;
  favorites: string[];
  recentSearches: string[];
  visitedPlaces: string[];
  preferences: {
    cuisine: string[];
    allergens: string[];
    budget: number;
  };
}

interface MemoryResult {
  voiceResponse: string;
  textResponse: string;
  data?: any;
}

export class MemoryAgent {
  private memoryStore: Map<string, UserMemory> = new Map();

  async processMemoryQuery(query: string, context?: any): Promise<MemoryResult> {
    console.log('[MemoryAgent] Processing memory query:', query);
    
    const lowerQuery = query.toLowerCase();
    
    // Handle favorites
    if (lowerQuery.includes('favorite')) {
      return this.handleFavorites(query, context);
    }
    
    // Handle recent searches
    if (lowerQuery.includes('recent') || lowerQuery.includes('search')) {
      return this.handleRecentSearches(query, context);
    }
    
    // Handle visited places
    if (lowerQuery.includes('visited') || lowerQuery.includes('been')) {
      return this.handleVisitedPlaces(query, context);
    }
    
    // Handle preferences
    if (lowerQuery.includes('prefer') || lowerQuery.includes('like')) {
      return this.handlePreferences(query, context);
    }
    
    return {
      voiceResponse: "I didn't understand that memory request.",
      textResponse: "I can help you with favorites, recent searches, visited places, and preferences. What would you like to know?"
    };
  }

  private async handleFavorites(query: string, context?: any): Promise<MemoryResult> {
    const userId = context?.userId || 'anonymous';
    const userMemory = this.getOrCreateUserMemory(userId);
    
    if (query.includes('add') || query.includes('save')) {
      // Add to favorites (placeholder)
      return {
        voiceResponse: "Added to favorites.",
        textResponse: "Restaurant added to your favorites list.",
        data: { action: 'add_favorite' }
      };
    }
    
    if (query.includes('show') || query.includes('list')) {
      const favCount = userMemory.favorites.length;
      return {
        voiceResponse: favCount > 0 ? `You have ${favCount} favorites.` : "No favorites yet.",
        textResponse: favCount > 0 ? 
          `You have ${favCount} favorite restaurants saved.` : 
          "You haven't saved any favorite restaurants yet. Tap the heart icon on any restaurant to add it to your favorites."
      };
    }
    
    return {
      voiceResponse: "What would you like to do with favorites?",
      textResponse: "You can add restaurants to favorites or view your saved list."
    };
  }

  private async handleRecentSearches(query: string, context?: any): Promise<MemoryResult> {
    const userId = context?.userId || 'anonymous';
    const userMemory = this.getOrCreateUserMemory(userId);
    
    const recentCount = userMemory.recentSearches.length;
    
    return {
      voiceResponse: recentCount > 0 ? "Here are your recent searches." : "No recent searches.",
      textResponse: recentCount > 0 ?
        `Your recent searches:\n• ${userMemory.recentSearches.slice(0, 3).join('\n• ')}` :
        "You haven't made any searches yet. Try searching for vegan restaurants in your area."
    };
  }

  private async handleVisitedPlaces(query: string, context?: any): Promise<MemoryResult> {
    const userId = context?.userId || 'anonymous';
    const userMemory = this.getOrCreateUserMemory(userId);
    
    const visitedCount = userMemory.visitedPlaces.length;
    
    return {
      voiceResponse: visitedCount > 0 ? `You've visited ${visitedCount} places.` : "No visits recorded.",
      textResponse: visitedCount > 0 ?
        `You've visited ${visitedCount} restaurants. Check your profile for the full list.` :
        "No restaurant visits recorded yet. When you check in at restaurants, they'll appear here."
    };
  }

  private async handlePreferences(query: string, context?: any): Promise<MemoryResult> {
    const userId = context?.userId || 'anonymous';
    const userMemory = this.getOrCreateUserMemory(userId);
    
    if (userMemory.preferences.cuisine.length > 0) {
      const cuisines = userMemory.preferences.cuisine.slice(0, 3).join(', ');
      return {
        voiceResponse: `Your preferred cuisines are ${cuisines}.`,
        textResponse: `Your cuisine preferences: ${cuisines}\nBudget: ${'$'.repeat(userMemory.preferences.budget || 2)}`
      };
    }
    
    return {
      voiceResponse: "No preferences set yet.",
      textResponse: "You haven't set any preferences yet. Visit your profile to set cuisine preferences, allergen restrictions, and budget."
    };
  }

  private getOrCreateUserMemory(userId: string): UserMemory {
    if (!this.memoryStore.has(userId)) {
      this.memoryStore.set(userId, {
        userId,
        favorites: [],
        recentSearches: [],
        visitedPlaces: [],
        preferences: {
          cuisine: [],
          allergens: [],
          budget: 2
        }
      });
    }
    
    return this.memoryStore.get(userId)!;
  }

  // Methods for updating memory (to be called by other parts of the system)
  async addToRecentSearches(userId: string, searchQuery: string): Promise<void> {
    const userMemory = this.getOrCreateUserMemory(userId);
    userMemory.recentSearches.unshift(searchQuery);
    
    // Keep only last 10 searches
    userMemory.recentSearches = userMemory.recentSearches.slice(0, 10);
    
    console.log('[MemoryAgent] Added to recent searches:', searchQuery);
  }

  async addFavorite(userId: string, restaurantId: string): Promise<void> {
    const userMemory = this.getOrCreateUserMemory(userId);
    
    if (!userMemory.favorites.includes(restaurantId)) {
      userMemory.favorites.push(restaurantId);
      console.log('[MemoryAgent] Added favorite:', restaurantId);
    }
  }

  async removeFavorite(userId: string, restaurantId: string): Promise<void> {
    const userMemory = this.getOrCreateUserMemory(userId);
    userMemory.favorites = userMemory.favorites.filter(id => id !== restaurantId);
    
    console.log('[MemoryAgent] Removed favorite:', restaurantId);
  }

  async updatePreferences(userId: string, preferences: Partial<UserMemory['preferences']>): Promise<void> {
    const userMemory = this.getOrCreateUserMemory(userId);
    userMemory.preferences = { ...userMemory.preferences, ...preferences };
    
    console.log('[MemoryAgent] Updated preferences for user:', userId);
  }

  async getFavorites(userId: string): Promise<string[]> {
    const userMemory = this.getOrCreateUserMemory(userId);
    return userMemory.favorites;
  }

  async getPreferences(userId: string): Promise<UserMemory['preferences']> {
    const userMemory = this.getOrCreateUserMemory(userId);
    return userMemory.preferences;
  }
}