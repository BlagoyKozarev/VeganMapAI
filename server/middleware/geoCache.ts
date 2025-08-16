import { Request, Response, NextFunction } from 'express';

// Geohash-based caching for Google Maps API optimization
// Precision 6 = ~2km, TTL 7 days for restaurant data

interface GeoCacheEntry {
  data: any;
  expiresAt: number;
  geohash: string;
}

class GeoHashCache {
  private cache = new Map<string, GeoCacheEntry>();
  private readonly TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly PRECISION = 6; // ~2km accuracy

  // Simple geohash implementation for caching
  private geohash(lat: number, lng: number): string {
    const chars = '0123456789bcdefghjkmnpqrstuvwxyz';
    let idx = 0;
    let bit = 0;
    let even_bit = true;
    let geohash = '';
    
    let lat_min = -90.0, lat_max = 90.0;
    let lng_min = -180.0, lng_max = 180.0;
    
    while (geohash.length < this.PRECISION) {
      if (even_bit) {
        // longitude
        const mid = (lng_min + lng_max) / 2;
        if (lng >= mid) {
          idx = (idx << 1) + 1;
          lng_min = mid;
        } else {
          idx = idx << 1;
          lng_max = mid;
        }
      } else {
        // latitude
        const mid = (lat_min + lat_max) / 2;
        if (lat >= mid) {
          idx = (idx << 1) + 1;
          lat_min = mid;
        } else {
          idx = idx << 1;
          lat_max = mid;
        }
      }
      
      even_bit = !even_bit;
      
      if (++bit == 5) {
        geohash += chars[idx];
        bit = 0;
        idx = 0;
      }
    }
    
    return geohash;
  }

  set(lat: number, lng: number, data: any, prefix = 'places'): void {
    const hash = this.geohash(lat, lng);
    const key = `${prefix}:${hash}`;
    
    this.cache.set(key, {
      data,
      expiresAt: Date.now() + this.TTL_MS,
      geohash: hash
    });
  }

  get(lat: number, lng: number, prefix = 'places'): any | null {
    const hash = this.geohash(lat, lng);
    const key = `${prefix}:${hash}`;
    
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Stats for monitoring
  getStats() {
    const now = Date.now();
    const entries = Array.from(this.cache.values());
    const expired = entries.filter(e => now > e.expiresAt).length;
    
    return {
      totalEntries: this.cache.size,
      expiredEntries: expired,
      activeEntries: this.cache.size - expired,
      ttlDays: this.TTL_MS / (24 * 60 * 60 * 1000),
      precision: this.PRECISION
    };
  }
}

export const geoCache = new GeoHashCache();

// Cleanup interval - every hour
setInterval(() => {
  geoCache.cleanup();
}, 60 * 60 * 1000);

// Middleware for geo-cached responses
export const geoCacheMiddleware = (prefix = 'places') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return next();
    }
    
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return next();
    }
    
    // Check cache
    const cached = geoCache.get(latitude, longitude, prefix);
    if (cached) {
      console.log(`[GeoCache] HIT: ${prefix} at geohash ${geoCache['geohash'](latitude, longitude)}`);
      return res.json(cached);
    }
    
    // Store response in cache
    const originalJson = res.json.bind(res);
    res.json = function(data: any) {
      const cache = geoCache as any;
      geoCache.set(latitude, longitude, data, prefix);
      console.log(`[GeoCache] STORE: ${prefix} at precision ${cache.PRECISION}`);
      return originalJson(data);
    };
    
    next();
  };
};