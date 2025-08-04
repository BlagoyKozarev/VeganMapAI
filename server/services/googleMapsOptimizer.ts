// Google Maps API Optimization Service
// Target: 95% cost reduction for 250K restaurants
// Current: $50K initial cost → Target: $2.5K initial cost

import { Client } from '@googlemaps/google-maps-services-js';
import { storage } from '../storage';
import memoizee from 'memoizee';

interface RestaurantCache {
  placeId: string;
  basicData: any;
  detailedData?: any;
  photos?: string[];
  lastUpdated: Date;
  cacheLevel: 'basic' | 'detailed' | 'full';
}

interface GeoHashConfig {
  precision: number; // 5-7 for different zoom levels
  maxRestaurantsPerHash: number;
  cacheExpiry: number; // in days
}

export class GoogleMapsOptimizer {
  private cache: Map<string, RestaurantCache>;
  private geoHashCache: Map<string, string[]>; // geohash -> restaurant IDs
  private apiCallTracker: Map<string, number>; // daily API call tracking
  private emergencyMode: boolean = false;
  private client: Client;
  private apiKey: string;

  constructor(apiKey: string) {
    this.cache = new Map();
    this.geoHashCache = new Map();
    this.apiCallTracker = new Map();
    this.client = new Client({});
    this.apiKey = apiKey;
    
    // Load cached data from database on startup
    this.loadCacheFromDatabase();
  }

  /**
   * Load previously cached restaurant data from database
   */
  private async loadCacheFromDatabase(): Promise<void> {
    try {
      const cachedRestaurants = await storage.getAllRestaurants();
      console.log(`📦 Loading ${cachedRestaurants.length} restaurants from database cache`);
      
      for (const restaurant of cachedRestaurants) {
        if (restaurant.placeId) {
          const geoHash = this.generateGeoHash(
            parseFloat(restaurant.latitude),
            parseFloat(restaurant.longitude),
            6
          );
          
          // Add to geo-hash cache
          const existingHashes = this.geoHashCache.get(geoHash) || [];
          existingHashes.push(restaurant.id);
          this.geoHashCache.set(geoHash, existingHashes);
        }
      }
      
      console.log(`✅ Loaded ${this.geoHashCache.size} geo-hash regions`);
    } catch (error) {
      console.error('Failed to load cache from database:', error);
    }
  }

  /**
   * PHASE 1: Pre-populate US restaurant data using BULK operations
   */
  async bulkPopulateUSRestaurants(): Promise<void> {
    console.log('🚀 Starting BULK US restaurant population - this will take hours but save $40K+');

    const usCities = [
      { name: 'New York', lat: 40.7128, lng: -74.0060, radius: 50000 },
      { name: 'Los Angeles', lat: 34.0522, lng: -118.2437, radius: 80000 },
      { name: 'Chicago', lat: 41.8781, lng: -87.6298, radius: 50000 },
      { name: 'San Francisco', lat: 37.7749, lng: -122.4194, radius: 40000 },
      { name: 'Seattle', lat: 47.6062, lng: -122.3321, radius: 40000 },
      { name: 'Austin', lat: 30.2672, lng: -97.7431, radius: 35000 },
      { name: 'Portland', lat: 45.5152, lng: -122.6784, radius: 35000 },
      { name: 'Denver', lat: 39.7392, lng: -104.9903, radius: 40000 },
      { name: 'Boston', lat: 42.3601, lng: -71.0589, radius: 35000 },
      { name: 'Philadelphia', lat: 39.9526, lng: -75.1652, radius: 40000 },
      { name: 'Washington DC', lat: 38.9072, lng: -77.0369, radius: 35000 },
      { name: 'Miami', lat: 25.7617, lng: -80.1918, radius: 45000 },
      { name: 'Atlanta', lat: 33.7490, lng: -84.3880, radius: 40000 },
      { name: 'Phoenix', lat: 33.4484, lng: -112.0740, radius: 50000 },
      { name: 'San Diego', lat: 32.7157, lng: -117.1611, radius: 35000 },
      { name: 'Dallas', lat: 32.7767, lng: -96.7970, radius: 45000 },
      { name: 'Houston', lat: 29.7604, lng: -95.3698, radius: 50000 },
      { name: 'Las Vegas', lat: 36.1699, lng: -115.1398, radius: 30000 },
      { name: 'Minneapolis', lat: 44.9778, lng: -93.2650, radius: 35000 },
      { name: 'Detroit', lat: 42.3314, lng: -83.0458, radius: 40000 }
    ];

    for (const city of usCities) {
      if (this.emergencyMode) {
        console.warn('🚨 Emergency mode active - stopping bulk population');
        break;
      }
      
      console.log(`📍 Processing ${city.name}...`);
      
      // Use Google Places Text Search (cheaper than Nearby Search)
      await this.bulkTextSearch(city, [
        'vegan restaurant',
        'vegetarian restaurant', 
        'health food restaurant',
        'organic restaurant',
        'plant based restaurant'
      ]);

      // Rate limiting - important!
      await this.sleep(2000); // 2 seconds between cities
    }

    console.log('✅ Bulk population complete');
  }

  /**
   * Bulk Text Search - much cheaper than Places API
   */
  private async bulkTextSearch(city: any, queries: string[]): Promise<void> {
    for (const query of queries) {
      try {
        const searchQuery = `${query} in ${city.name}`;
        
        // Text Search API - $32 per 1000 requests vs $17 per 1000 for basic data
        const response = await this.makeTextSearchRequest(searchQuery, city);
        
        // Cache results with geo-hash
        await this.cacheRestaurantsWithGeoHash(response.data.results, city);
        
        // Rate limiting between queries
        await this.sleep(1000);
        
      } catch (error: any) {
        console.error(`Error in text search for ${query} in ${city.name}:`, error.message);
        
        if (error.message?.includes('QUOTA_EXCEEDED')) {
          console.warn('🚨 Daily quota exceeded - entering emergency mode');
          this.emergencyMode = true;
          return;
        }
      }
    }
  }

  /**
   * Intelligent Geo-Hash caching system
   */
  private async cacheRestaurantsWithGeoHash(restaurants: any[], city: any): Promise<void> {
    for (const restaurant of restaurants) {
      const geoHash = this.generateGeoHash(
        restaurant.geometry.location.lat,
        restaurant.geometry.location.lng,
        6 // precision for city-level caching
      );

      // Save to database
      try {
        const savedRestaurant = await storage.createRestaurant({
          name: restaurant.name,
          placeId: restaurant.place_id,
          address: restaurant.formatted_address || restaurant.vicinity,
          latitude: restaurant.geometry.location.lat.toString(),
          longitude: restaurant.geometry.location.lng.toString(),
          rating: restaurant.rating?.toString() || '0',
          priceLevel: restaurant.price_level || 0,
          cuisineTypes: restaurant.types || [],
          photos: restaurant.photos ? restaurant.photos.slice(0, 3).map((p: any) => p.photo_reference) : [],
          openingHours: restaurant.opening_hours || {},
          phoneNumber: restaurant.formatted_phone_number || '',
          website: restaurant.website || '',
          geoHash: geoHash
        });

        // Add to geo-hash cache
        const existingHashes = this.geoHashCache.get(geoHash) || [];
        existingHashes.push(savedRestaurant.id);
        this.geoHashCache.set(geoHash, existingHashes);
        
      } catch (error) {
        console.error('Failed to cache restaurant:', error);
      }
    }
  }

  /**
   * Smart restaurant loading based on viewport
   */
  async getRestaurantsInViewport(bounds: any, maxResults: number = 100): Promise<any[]> {
    const relevantGeoHashes = this.getGeoHashesInBounds(bounds);
    const restaurants: any[] = [];
    const seenIds = new Set<string>();

    for (const geoHash of relevantGeoHashes) {
      const restaurantIds = this.geoHashCache.get(geoHash) || [];
      
      for (const restaurantId of restaurantIds) {
        if (seenIds.has(restaurantId)) continue;
        
        const restaurant = await storage.getRestaurant(restaurantId);
        
        if (restaurant && this.isInViewport(
          { lat: parseFloat(restaurant.latitude), lng: parseFloat(restaurant.longitude) },
          bounds
        )) {
          restaurants.push(restaurant);
          seenIds.add(restaurantId);
          
          if (restaurants.length >= maxResults) {
            return restaurants;
          }
        }
      }
    }

    // If we don't have enough cached data, make targeted API calls
    if (restaurants.length < 20 && !this.emergencyMode) {
      console.log('📡 Making targeted API calls to fill viewport...');
      const center = {
        lat: (bounds.north + bounds.south) / 2,
        lng: (bounds.east + bounds.west) / 2
      };
      const additionalRestaurants = await this.makeTargetedNearbySearch(center, 20 - restaurants.length);
      restaurants.push(...additionalRestaurants);
    }

    return restaurants;
  }

  /**
   * Lazy loading of detailed restaurant data ONLY when user clicks
   */
  async getRestaurantDetails(placeId: string, forceRefresh: boolean = false): Promise<any> {
    // Check database cache first
    const restaurants = await storage.getAllRestaurants();
    const cached = restaurants.find(r => r.placeId === placeId);
    
    if (cached && !forceRefresh) {
      // If we have recent detailed data, return it
      if (cached.website && cached.phoneNumber && cached.updatedAt && this.isFreshEnough(new Date(cached.updatedAt), 7)) {
        return cached;
      }
    }

    // Make Places Details API call only if necessary
    console.log(`📡 Fetching details for ${placeId}`);
    
    try {
      const details = await this.makePlaceDetailsRequest(placeId);
      
      // Update database with detailed data
      if (cached) {
        await storage.updateRestaurant(cached.id, {
          phoneNumber: details.result.formatted_phone_number || '',
          website: details.result.website || '',
          openingHours: details.result.opening_hours || {}
        });
      }

      this.trackAPICall('place_details');
      return details.result;
      
    } catch (error) {
      console.error('Failed to fetch restaurant details:', error);
      return cached || null;
    }
  }

  /**
   * Photo loading optimization - load photos on demand
   */
  async getRestaurantPhotos(placeId: string, maxPhotos: number = 3): Promise<string[]> {
    const restaurants = await storage.getAllRestaurants();
    const cached = restaurants.find(r => r.placeId === placeId);
    
    if (cached?.photos && cached.photos.length > 0) {
      // Generate photo URLs from references
      return cached.photos.slice(0, maxPhotos).map((ref: string) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${this.apiKey}`
      );
    }

    // Photos are expensive - load only when necessary
    try {
      const details = await this.getRestaurantDetails(placeId);
      const photoRefs = details.photos?.slice(0, maxPhotos).map((p: any) => p.photo_reference) || [];
      
      // Update cache
      if (cached && photoRefs.length > 0) {
        await storage.updateRestaurant(cached.id, {
          photos: photoRefs
        });
      }

      return photoRefs.map((ref: string) => 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=${this.apiKey}`
      );
      
    } catch (error) {
      console.error('Failed to load photos:', error);
      return [];
    }
  }

  /**
   * Emergency mode - when reaching daily limits
   */
  private activateEmergencyMode(): void {
    this.emergencyMode = true;
    console.warn('🚨 Emergency mode activated - serving cached data only');
  }

  /**
   * API call tracking and quota management
   */
  private trackAPICall(type: string): void {
    const today = new Date().toDateString();
    const key = `${today}-${type}`;
    const count = this.apiCallTracker.get(key) || 0;
    this.apiCallTracker.set(key, count + 1);

    // Check daily limits
    const dailyTotal = Array.from(this.apiCallTracker.entries())
      .filter(([k]) => k.startsWith(today))
      .reduce((sum, [, count]) => sum + count, 0);

    if (dailyTotal > 8000) { // 80% of 10K daily quota
      console.warn('⚠️ Approaching daily API limit');
    }

    if (dailyTotal > 9500) { // 95% of quota
      this.activateEmergencyMode();
    }
  }

  /**
   * Cost estimation and reporting
   */
  getCostReport(): any {
    const costs = {
      textSearch: this.getAPICallCount('text_search') * 0.032,
      nearbySearch: this.getAPICallCount('nearby_search') * 0.032,
      placeDetails: this.getAPICallCount('place_details') * 0.017,
      photos: this.getAPICallCount('photos') * 0.007
    };

    return {
      daily: Object.values(costs).reduce((a, b) => a + b, 0),
      monthly: Object.values(costs).reduce((a, b) => a + b, 0) * 30,
      breakdown: costs,
      apiCalls: {
        today: this.getTodayAPICallCount(),
        limit: 10000,
        remaining: 10000 - this.getTodayAPICallCount()
      }
    };
  }

  // Utility methods
  private generateGeoHash(lat: number, lng: number, precision: number): string {
    const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';
    let idx = 0;
    let bit = 0;
    let evenBit = true;
    let geohash = '';

    const latRange = [-90, 90];
    const lngRange = [-180, 180];

    while (geohash.length < precision) {
      if (evenBit) {
        const mid = (lngRange[0] + lngRange[1]) / 2;
        if (lng > mid) {
          idx |= (1 << (4 - bit));
          lngRange[0] = mid;
        } else {
          lngRange[1] = mid;
        }
      } else {
        const mid = (latRange[0] + latRange[1]) / 2;
        if (lat > mid) {
          idx |= (1 << (4 - bit));
          latRange[0] = mid;
        } else {
          latRange[1] = mid;
        }
      }

      evenBit = !evenBit;

      if (bit < 4) {
        bit++;
      } else {
        geohash += BASE32[idx];
        bit = 0;
        idx = 0;
      }
    }

    return geohash;
  }

  private getGeoHashesInBounds(bounds: any): string[] {
    const hashes: string[] = [];
    
    const latStep = (bounds.north - bounds.south) / 10;
    const lngStep = (bounds.east - bounds.west) / 10;

    for (let lat = bounds.south; lat <= bounds.north; lat += latStep) {
      for (let lng = bounds.west; lng <= bounds.east; lng += lngStep) {
        hashes.push(this.generateGeoHash(lat, lng, 6));
      }
    }

    return Array.from(new Set(hashes)); // Remove duplicates
  }

  private isInViewport(location: any, bounds: any): boolean {
    return location.lat >= bounds.south && 
           location.lat <= bounds.north && 
           location.lng >= bounds.west && 
           location.lng <= bounds.east;
  }

  private isFreshEnough(lastUpdated: Date, maxAgeDays: number): boolean {
    const ageInDays = (Date.now() - lastUpdated.getTime()) / (1000 * 60 * 60 * 24);
    return ageInDays <= maxAgeDays;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getAPICallCount(type: string): number {
    const today = new Date().toDateString();
    return this.apiCallTracker.get(`${today}-${type}`) || 0;
  }

  private getTodayAPICallCount(): number {
    const today = new Date().toDateString();
    return Array.from(this.apiCallTracker.entries())
      .filter(([k]) => k.startsWith(today))
      .reduce((sum, [, count]) => sum + count, 0);
  }

  // Actual API methods
  private async makeTextSearchRequest(query: string, location: any): Promise<any> {
    this.trackAPICall('text_search');
    
    return this.client.textSearch({
      params: {
        query,
        location: `${location.lat},${location.lng}`,
        radius: location.radius,
        type: 'restaurant' as any,
        key: this.apiKey
      }
    });
  }

  private async makePlaceDetailsRequest(placeId: string): Promise<any> {
    this.trackAPICall('place_details');
    
    return this.client.placeDetails({
      params: {
        place_id: placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'website', 
                 'opening_hours', 'rating', 'price_level', 'photos', 'types', 'url'],
        key: this.apiKey
      }
    });
  }

  private async makeTargetedNearbySearch(center: any, maxResults: number): Promise<any[]> {
    this.trackAPICall('nearby_search');
    
    try {
      const response = await this.client.placesNearby({
        params: {
          location: `${center.lat},${center.lng}`,
          radius: 5000,
          type: 'restaurant' as any,
          keyword: 'vegan vegetarian',
          key: this.apiKey
        }
      });

      const results = response.data.results.slice(0, maxResults);
      
      // Cache these results too
      await this.cacheRestaurantsWithGeoHash(results, { name: 'Viewport search', ...center });
      
      return results;
    } catch (error) {
      console.error('Nearby search failed:', error);
      return [];
    }
  }
}

// Memoized singleton instance
export const getGoogleMapsOptimizer = memoizee(
  (apiKey: string) => new GoogleMapsOptimizer(apiKey),
  { primitive: true }
);