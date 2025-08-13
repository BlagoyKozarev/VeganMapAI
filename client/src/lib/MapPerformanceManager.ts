// MapPerformanceManager.ts - Smart Loading System for 250K+ Restaurants
// Handles massive datasets with viewport-based loading and memory management
interface Restaurant {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  veganScore: string;
  cuisineTypes?: string[];
  rating?: number;
  priceLevel?: number;
}
interface ViewportBounds {
  north: number;
  south: number;
  east: number;
  west: number;
  zoom: number;
}
interface PerformanceMetrics {
  markersLoaded: number;
  renderTime: number;
  memoryUsage: number;
  lastUpdate: number;
}
export class MapPerformanceManager {
  private allRestaurants: Restaurant[] = [];
  private visibleRestaurants: Restaurant[] = [];
  private spatialIndex: Map<string, Restaurant[]> = new Map();
  private currentBounds: ViewportBounds | null = null;
  private performanceMetrics: PerformanceMetrics = {
    markersLoaded: 0,
    renderTime: 0,
    memoryUsage: 0,
    lastUpdate: 0
  };
  // Configuration
  private readonly MAX_MARKERS_PER_VIEWPORT = 1000; // Increased to show all restaurants
  private readonly GRID_SIZE = 0.01; // ~1km grid cells
  private readonly MIN_ZOOM_FOR_INDIVIDUAL_MARKERS = 12;
  private readonly PERFORMANCE_MONITORING_INTERVAL = 5000;
  constructor() {
    this.startPerformanceMonitoring();
  }
  /**
   * Initialize with full restaurant dataset
   */
  public async initializeDataset(restaurants: Restaurant[]): Promise<void> {
    const startTime = performance.now();
    this.allRestaurants = restaurants;
    this.buildSpatialIndex();
    const loadTime = performance.now() - startTime;
    // Performance logging removed for production
    // Update metrics
    this.performanceMetrics.lastUpdate = Date.now();
  }
  /**
   * Build spatial index for fast viewport queries
   */
  private buildSpatialIndex(): void {
    this.spatialIndex.clear();
    for (const restaurant of this.allRestaurants) {
      const gridKey = this.getGridKey(restaurant.latitude, restaurant.longitude);
      if (!this.spatialIndex.has(gridKey)) {
        this.spatialIndex.set(gridKey, []);
      }
      this.spatialIndex.get(gridKey)!.push(restaurant);
    }
    // Spatial index built
  }
  /**
   * Get grid key for spatial indexing
   */
  private getGridKey(lat: number, lng: number): string {
    const gridLat = Math.floor(lat / this.GRID_SIZE) * this.GRID_SIZE;
    const gridLng = Math.floor(lng / this.GRID_SIZE) * this.GRID_SIZE;
    return `${gridLat.toFixed(3)},${gridLng.toFixed(3)}`;
  }
  /**
   * Update viewport and get restaurants to display
   */
  public updateViewport(bounds: ViewportBounds): Restaurant[] {
    const startTime = performance.now();
    this.currentBounds = bounds;
    // Get restaurants in viewport using spatial index
    const viewportRestaurants = this.getRestaurantsInViewport(bounds);
    // Apply intelligent filtering based on zoom level
    const filteredRestaurants = this.applyPerformanceFiltering(viewportRestaurants, bounds);
    this.visibleRestaurants = filteredRestaurants;
    // Update performance metrics
    const renderTime = performance.now() - startTime;
    this.performanceMetrics.markersLoaded = filteredRestaurants.length;
    this.performanceMetrics.renderTime = renderTime;
    return filteredRestaurants;
  }
  /**
   * Get restaurants within viewport bounds using spatial index
   */
  private getRestaurantsInViewport(bounds: ViewportBounds): Restaurant[] {
    const restaurants: Restaurant[] = [];
    // Calculate grid cells that intersect with viewport
    const minGridLat = Math.floor(bounds.south / this.GRID_SIZE) * this.GRID_SIZE;
    const maxGridLat = Math.ceil(bounds.north / this.GRID_SIZE) * this.GRID_SIZE;
    const minGridLng = Math.floor(bounds.west / this.GRID_SIZE) * this.GRID_SIZE;
    const maxGridLng = Math.ceil(bounds.east / this.GRID_SIZE) * this.GRID_SIZE;
    // Iterate through relevant grid cells
    for (let gridLat = minGridLat; gridLat <= maxGridLat; gridLat += this.GRID_SIZE) {
      for (let gridLng = minGridLng; gridLng <= maxGridLng; gridLng += this.GRID_SIZE) {
        const gridKey = `${gridLat.toFixed(3)},${gridLng.toFixed(3)}`;
        const cellRestaurants = this.spatialIndex.get(gridKey) || [];
        // Filter restaurants that are actually within bounds
        for (const restaurant of cellRestaurants) {
          if (this.isInBounds(restaurant, bounds)) {
            restaurants.push(restaurant);
          }
        }
      }
    }
    return restaurants;
  }
  /**
   * Check if restaurant is within bounds
   */
  private isInBounds(restaurant: Restaurant, bounds: ViewportBounds): boolean {
    return restaurant.latitude >= bounds.south &&
           restaurant.latitude <= bounds.north &&
           restaurant.longitude >= bounds.west &&
           restaurant.longitude <= bounds.east;
  }
  /**
   * Apply performance-based filtering to prevent browser overload
   */
  private applyPerformanceFiltering(restaurants: Restaurant[], bounds: ViewportBounds): Restaurant[] {
    // Adjust max markers based on zoom level
    let maxMarkers = this.MAX_MARKERS_PER_VIEWPORT;
    if (bounds.zoom < 10) {
      maxMarkers = 500; // City overview level - show more
    } else if (bounds.zoom < 12) {
      maxMarkers = 600; // District level - show more
    } else if (bounds.zoom < 14) {
      maxMarkers = 800; // Neighborhood level - show more
    } else {
      maxMarkers = 1000; // Street level - show all
    }
    // If under limit, return all
    if (restaurants.length <= maxMarkers) {
      return restaurants;
    }
    // Priority-based filtering
    return this.prioritizeRestaurants(restaurants, maxMarkers);
  }
  /**
   * Prioritize restaurants for display when filtering is needed
   */
  private prioritizeRestaurants(restaurants: Restaurant[], maxCount: number): Restaurant[] {
    // Sort by priority: vegan score (desc) → rating (desc) → random
    const sortedRestaurants = [...restaurants].sort((a, b) => {
      // Primary: Vegan score
      const scoreA = parseFloat(a.veganScore) || 0;
      const scoreB = parseFloat(b.veganScore) || 0;
      if (scoreA !== scoreB) return scoreB - scoreA;
      // Secondary: Rating
      const ratingA = a.rating || 0;
      const ratingB = b.rating || 0;
      if (ratingA !== ratingB) return ratingB - ratingA;
      // Tertiary: Random for variety
      return Math.random() - 0.5;
    });
    // Ensure maxCount is valid to prevent RangeError
    const safeMaxCount = Math.max(0, maxCount);
    return sortedRestaurants.slice(0, safeMaxCount);
  }
  /**
   * Get clustering recommendations based on zoom level
   */
  public getClusteringStrategy(zoom: number): 'cluster' | 'individual' | 'hybrid' {
    if (zoom < this.MIN_ZOOM_FOR_INDIVIDUAL_MARKERS) {
      return 'cluster';
    } else if (zoom > 15) {
      return 'individual';
    } else {
      return 'hybrid';
    }
  }
  /**
   * Memory cleanup for browser performance
   */
  public cleanup(): void {
    this.visibleRestaurants = [];
    // Force garbage collection hint
    if ((window as any).gc) {
      (window as any).gc();
    }
  }
  /**
   * Get performance metrics
   */
  public getPerformanceMetrics(): PerformanceMetrics {
    return { ...this.performanceMetrics };
  }
  /**
   * Start performance monitoring
   */
  private startPerformanceMonitoring(): void {
    setInterval(() => {
      if ((performance as any).memory) {
        this.performanceMetrics.memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
      }
      // Log performance warnings
      if (this.performanceMetrics.markersLoaded > this.MAX_MARKERS_PER_VIEWPORT * 0.9) {
      }
      if (this.performanceMetrics.renderTime > 100) {
      }
    }, this.PERFORMANCE_MONITORING_INTERVAL);
  }
  /**
   * Search restaurants within current viewport
   */
  public searchInViewport(query: string): Restaurant[] {
    if (!query.trim()) return this.visibleRestaurants;
    const lowerQuery = query.toLowerCase();
    return this.visibleRestaurants.filter(restaurant => 
      restaurant.name.toLowerCase().includes(lowerQuery) ||
      restaurant.cuisineTypes?.some(cuisine => 
        cuisine.toLowerCase().includes(lowerQuery)
      )
    );
  }
  /**
   * Get restaurants by quality tier for progressive loading
   */
  public getRestaurantsByTier(tier: 'premium' | 'good' | 'basic'): Restaurant[] {
    const scoreThresholds = {
      premium: 4.0,
      good: 3.0,
      basic: 0
    };
    const minScore = scoreThresholds[tier];
    return this.visibleRestaurants.filter(restaurant => {
      const score = parseFloat(restaurant.veganScore) || 0;
      return score >= minScore;
    });
  }
  /**
   * Batch update for real-time data changes
   */
  public updateRestaurants(updatedRestaurants: Restaurant[]): void {
    // Update spatial index efficiently
    const updatedIds = new Set(updatedRestaurants.map(r => r.id));
    // Remove outdated entries
    this.allRestaurants = this.allRestaurants.filter(r => !updatedIds.has(r.id));
    // Add updated entries
    this.allRestaurants.push(...updatedRestaurants);
    // Rebuild affected grid cells only
    this.buildSpatialIndex();
  }
  /**
   * Get statistics for debugging
   */
  public getStatistics(): object {
    return {
      totalRestaurants: this.allRestaurants.length,
      visibleRestaurants: this.visibleRestaurants.length,
      gridCells: this.spatialIndex.size,
      averageRestaurantsPerCell: this.allRestaurants.length / this.spatialIndex.size,
      performanceMetrics: this.performanceMetrics,
      memoryEstimate: `${(this.allRestaurants.length * 200 / 1024 / 1024).toFixed(2)}MB`
    };
  }
}
// Export performance configuration
export const PERFORMANCE_CONFIG = {
  MAX_MARKERS_PER_VIEWPORT: 2000,
  GRID_SIZE: 0.01,
  MIN_ZOOM_FOR_INDIVIDUAL_MARKERS: 12,
  PERFORMANCE_MONITORING_INTERVAL: 5000
} as const;