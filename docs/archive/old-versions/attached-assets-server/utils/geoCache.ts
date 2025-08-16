import { createHash } from 'crypto';

interface CacheEntry {
  data: any;
  timestamp: number;
  expires: number;
}

interface GeoCacheConfig {
  ttl: number; // Time to live in milliseconds
  precision: number; // Geo-hash precision (higher = more precise areas)
}

export class GeoCache {
  private cache = new Map<string, CacheEntry>();
  private config: GeoCacheConfig;

  constructor(config: GeoCacheConfig = { ttl: 24 * 60 * 60 * 1000, precision: 6 }) {
    this.config = config;
    
    // Clean expired entries every hour
    setInterval(() => this.cleanup(), 60 * 60 * 1000);
  }

  /**
   * Generate geo-hash for latitude/longitude with specified precision
   */
  private generateGeoHash(lat: number, lng: number, precision: number = this.config.precision): string {
    const latRange = [-90, 90];
    const lngRange = [-180, 180];
    let geoHash = '';
    let isLat = true;
    
    for (let i = 0; i < precision * 5; i++) {
      if (isLat) {
        const mid = (latRange[0] + latRange[1]) / 2;
        if (lat >= mid) {
          geoHash += '1';
          latRange[0] = mid;
        } else {
          geoHash += '0';
          latRange[1] = mid;
        }
      } else {
        const mid = (lngRange[0] + lngRange[1]) / 2;
        if (lng >= mid) {
          geoHash += '1';
          lngRange[0] = mid;
        } else {
          geoHash += '0';
          lngRange[1] = mid;
        }
      }
      isLat = !isLat;
    }
    
    return geoHash;
  }

  /**
   * Generate cache key for Places API search
   */
  generatePlacesSearchKey(lat: number, lng: number, radius: number, type?: string): string {
    const geoHash = this.generateGeoHash(lat, lng);
    const radiusKey = Math.ceil(radius / 500); // Group by 500m intervals
    const typeKey = type || 'restaurant';
    
    return `places:${geoHash}:${radiusKey}:${typeKey}`;
  }

  /**
   * Generate cache key for Places Details
   */
  generatePlacesDetailsKey(placeId: string): string {
    return `details:${placeId}`;
  }

  /**
   * Generate cache key for Photos
   */
  generatePhotosKey(photoReference: string): string {
    return `photo:${photoReference}`;
  }

  /**
   * Store data in cache
   */
  set(key: string, data: any, customTtl?: number): void {
    const ttl = customTtl || this.config.ttl;
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      expires: Date.now() + ttl
    };
    
    this.cache.set(key, entry);
    console.log(`Cache SET: ${key} (TTL: ${Math.round(ttl / 1000 / 60)}min)`);
  }

  /**
   * Retrieve data from cache
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      console.log(`Cache MISS: ${key}`);
      return null;
    }
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      console.log(`Cache EXPIRED: ${key}`);
      return null;
    }
    
    console.log(`Cache HIT: ${key} (age: ${Math.round((Date.now() - entry.timestamp) / 1000 / 60)}min)`);
    return entry.data;
  }

  /**
   * Check if key exists and is not expired
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Delete specific key
   */
  delete(key: string): boolean {
    const deleted = this.cache.delete(key);
    if (deleted) {
      console.log(`Cache DELETE: ${key}`);
    }
    return deleted;
  }

  /**
   * Clear all cache
   */
  clear(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`Cache CLEARED: ${size} entries removed`);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;
    
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
        cleaned++;
      }
    }
    
    if (cleaned > 0) {
      console.log(`Cache CLEANUP: ${cleaned} expired entries removed`);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; hitRate?: number } {
    return {
      size: this.cache.size
    };
  }

  /**
   * Get nearby cache keys for expanding search radius
   */
  getNearbyKeys(lat: number, lng: number, radius: number, type?: string): string[] {
    const baseKey = this.generatePlacesSearchKey(lat, lng, radius, type);
    const keys = [baseKey];
    
    // Add adjacent geo-hash areas for edge cases
    const offsets = [
      { lat: 0.001, lng: 0 },    // North
      { lat: -0.001, lng: 0 },   // South  
      { lat: 0, lng: 0.001 },    // East
      { lat: 0, lng: -0.001 },   // West
    ];
    
    for (const offset of offsets) {
      const nearbyKey = this.generatePlacesSearchKey(
        lat + offset.lat, 
        lng + offset.lng, 
        radius, 
        type
      );
      if (nearbyKey !== baseKey) {
        keys.push(nearbyKey);
      }
    }
    
    return keys;
  }
}

// Export singleton instance
export const geoCache = new GeoCache({
  ttl: 24 * 60 * 60 * 1000, // 24 hours for places data
  precision: 6 // ~1.2km precision at equator
});

// Separate cache for photos with shorter TTL  
export const photoCache = new GeoCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days for photos
  precision: 4
});

// Cache for place details with longer TTL
export const detailsCache = new GeoCache({
  ttl: 7 * 24 * 60 * 60 * 1000, // 7 days for place details  
  precision: 8
});