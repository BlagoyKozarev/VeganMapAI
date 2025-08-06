import express from 'express';
import { GBGPTProvider } from '../providers/gbgptProvider.js';
import { HybridScoringProvider } from '../providers/hybridScoringProvider.js';

const router = express.Router();

/**
 * Test endpoint за GBGPT integration
 */
router.post('/test-gbgpt', async (req, res) => {
  try {
    const { restaurantName } = req.body;
    
    const testRestaurant = {
      name: restaurantName || 'Test Restaurant',
      address: 'Sofia, Bulgaria',
      cuisineTypes: ['restaurant', 'food'],
      reviews: [
        { text: 'Имат добри vegan опции' },
        { text: 'Персоналът знае какво е vegan' }
      ]
    };

    console.log('🧪 Testing GBGPT with sample restaurant...');
    
    const gbgpt = new GBGPTProvider();
    const startTime = Date.now();
    const result = await gbgpt.scoreRestaurant(testRestaurant);
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      result,
      duration: `${duration}ms`,
      message: `GBGPT test successful in ${duration/1000}s`
    });
    
  } catch (error: any) {
    console.error('❌ GBGPT test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'GBGPT test failed - check logs'
    });
  }
});

/**
 * Health check endpoint
 */
router.get('/gbgpt-health', async (req, res) => {
  try {
    const gbgpt = new GBGPTProvider();
    const isHealthy = await gbgpt.healthCheck();
    
    res.json({
      healthy: isHealthy,
      timestamp: new Date().toISOString(),
      endpoint: process.env.GBGPT_API_URL
    });
    
  } catch (error: any) {
    res.status(500).json({
      healthy: false,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * Test hybrid scoring (GBGPT + OpenAI fallback)
 */
router.post('/test-hybrid-scoring', async (req, res) => {
  try {
    const { restaurantName } = req.body;
    
    const testRestaurant = {
      name: restaurantName || 'Hybrid Test Restaurant',
      address: 'Sofia, Bulgaria',
      cuisineTypes: ['restaurant', 'food'],
      reviews: [
        { text: 'Имат добри vegan опции' },
        { text: 'Персоналът знае какво е vegan' }
      ]
    };

    console.log('🔄 Testing Hybrid Scoring Provider...');
    
    const hybrid = new HybridScoringProvider();
    const startTime = Date.now();
    const result = await hybrid.scoreRestaurant(testRestaurant);
    const duration = Date.now() - startTime;

    res.json({
      success: true,
      result,
      duration: `${duration}ms`,
      message: `Hybrid scoring successful in ${duration/1000}s`,
      provider: result.provider
    });
    
  } catch (error: any) {
    console.error('❌ Hybrid scoring test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Hybrid scoring test failed - check logs'
    });
  }
});

/**
 * Get provider status
 */
router.get('/provider-status', async (req, res) => {
  try {
    const hybrid = new HybridScoringProvider();
    const status = await hybrid.getStatus();
    
    res.json(status);
    
  } catch (error: any) {
    res.status(500).json({
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;