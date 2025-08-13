import type { Express } from "express";
import { getApiStats } from "../services/googlePlaces";
import { geoCache, detailsCache, photoCache } from "../utils/geoCache";

export function registerApiStatsRoutes(app: Express) {
  // API usage statistics endpoint
  app.get('/api/stats/usage', (req, res) => {
    const stats = getApiStats();
    const cacheStats = {
      places: geoCache.getStats(),
      details: detailsCache.getStats(),
      photos: photoCache.getStats()
    };
    
    // Calculate estimated cost savings
    const totalApiCalls = stats.placesSearch + stats.placeDetails + stats.photos;
    const totalRequests = stats.cacheHits + stats.cacheMisses;
    const costPerCall = 0.001; // Approximate cost per API call in USD
    const estimatedSavings = stats.cacheHits * costPerCall;
    
    res.json({
      apiCalls: {
        placesSearch: stats.placesSearch,
        placeDetails: stats.placeDetails,
        photos: stats.photos,
        total: totalApiCalls
      },
      cache: {
        hits: stats.cacheHits,
        misses: stats.cacheMisses,
        hitRate: stats.cacheHitRate,
        totalRequests,
        sizes: cacheStats
      },
      costOptimization: {
        estimatedSavings: `$${estimatedSavings.toFixed(4)}`,
        potentialCosts: `$${(totalRequests * costPerCall).toFixed(4)}`,
        actualCosts: `$${(totalApiCalls * costPerCall).toFixed(4)}`,
        savingsPercentage: totalRequests > 0 ? (stats.cacheHits / totalRequests * 100).toFixed(1) + '%' : '0%'
      }
    });
  });
  
  // Clear cache endpoint (for development)
  app.post('/api/stats/clear-cache', (req, res) => {
    const beforeSizes = {
      places: geoCache.getStats().size,
      details: detailsCache.getStats().size,
      photos: photoCache.getStats().size
    };
    
    geoCache.clear();
    detailsCache.clear();
    photoCache.clear();
    
    res.json({
      message: 'Cache cleared successfully',
      clearedEntries: beforeSizes,
      newSizes: {
        places: geoCache.getStats().size,
        details: detailsCache.getStats().size,
        photos: photoCache.getStats().size
      }
    });
  });
}