// GeoJSON Loader with CDN fallback capability
// Prioritizes CDN but falls back to API if needed

interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
  properties: {
    id: string;
    name: string;
    address: string;
    rating?: number;
    vegan_score?: number;
    [key: string]: any;
  };
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

interface LoadResult {
  data: GeoJSONCollection;
  source: 'cdn' | 'api';
  loadTime: number;
  error?: string;
}

class GeoJSONLoader {
  private readonly CDN_URL = 'https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson';
  private readonly API_URL = '/api/restaurants/geojson';
  private readonly TIMEOUT = 5000; // 5 seconds
  
  private cache: {
    data?: GeoJSONCollection;
    timestamp?: number;
    source?: 'cdn' | 'api';
  } = {};

  /**
   * Load restaurant GeoJSON data with CDN-first approach
   */
  async load(): Promise<LoadResult> {
    const startTime = performance.now();

    // Check cache (valid for 1 hour)
    if (this.cache.data && this.cache.timestamp && 
        Date.now() - this.cache.timestamp < 3600000) {
      return {
        data: this.cache.data,
        source: this.cache.source!,
        loadTime: performance.now() - startTime
      };
    }

    // Try CDN first
    try {
      console.log('[GeoJSON] Attempting CDN load:', this.CDN_URL);
      const data = await this.loadFromCDN();
      
      this.cache = {
        data,
        timestamp: Date.now(),
        source: 'cdn'
      };

      return {
        data,
        source: 'cdn',
        loadTime: performance.now() - startTime
      };
    } catch (cdnError) {
      console.warn('[GeoJSON] CDN failed, falling back to API:', cdnError);
      
      // Fallback to API
      try {
        const data = await this.loadFromAPI();
        
        this.cache = {
          data,
          timestamp: Date.now(),
          source: 'api'
        };

        return {
          data,
          source: 'api',
          loadTime: performance.now() - startTime,
          error: `CDN failed: ${cdnError}`
        };
      } catch (apiError) {
        console.error('[GeoJSON] Both CDN and API failed:', { cdnError, apiError });
        throw new Error(`Failed to load restaurant data: CDN (${cdnError}), API (${apiError})`);
      }
    }
  }

  /**
   * Load from CDN with timeout
   */
  private async loadFromCDN(): Promise<GeoJSONCollection> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

    try {
      const response = await fetch(this.CDN_URL, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/geo+json,application/json',
        }
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`CDN HTTP ${response.status}`);
      }

      const data = await response.json();
      this.validateGeoJSON(data);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Load from local API
   */
  private async loadFromAPI(): Promise<GeoJSONCollection> {
    const response = await fetch(this.API_URL, {
      headers: {
        'Accept': 'application/geo+json,application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`API HTTP ${response.status}`);
    }

    const data = await response.json();
    this.validateGeoJSON(data);
    return data;
  }

  /**
   * Validate GeoJSON structure
   */
  private validateGeoJSON(data: any): asserts data is GeoJSONCollection {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid GeoJSON: not an object');
    }

    if (data.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: not a FeatureCollection');
    }

    if (!Array.isArray(data.features)) {
      throw new Error('Invalid GeoJSON: features is not an array');
    }

    if (data.features.length === 0) {
      throw new Error('Invalid GeoJSON: no features found');
    }

    // Validate first feature structure
    const firstFeature = data.features[0];
    if (!firstFeature || firstFeature.type !== 'Feature') {
      throw new Error('Invalid GeoJSON: invalid feature structure');
    }

    if (!firstFeature.geometry || firstFeature.geometry.type !== 'Point') {
      throw new Error('Invalid GeoJSON: invalid geometry');
    }

    if (!Array.isArray(firstFeature.geometry.coordinates) || 
        firstFeature.geometry.coordinates.length !== 2) {
      throw new Error('Invalid GeoJSON: invalid coordinates');
    }
  }

  /**
   * Clear cache (useful for development)
   */
  clearCache(): void {
    this.cache = {};
  }

  /**
   * Get cache status
   */
  getCacheStatus() {
    return {
      cached: !!this.cache.data,
      timestamp: this.cache.timestamp,
      source: this.cache.source,
      age: this.cache.timestamp ? Date.now() - this.cache.timestamp : undefined
    };
  }
}

// Export singleton instance
export const geoJSONLoader = new GeoJSONLoader();
export type { GeoJSONFeature, GeoJSONCollection, LoadResult };