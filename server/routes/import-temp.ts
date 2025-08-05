import { Router } from 'express';
import { restaurants } from '@shared/schema';
import { db } from '../db';

const router = Router();

// TEMPORARY IMPORT ENDPOINT - Direct copy from dev DB
router.get('/api/emergency-import-2025', async (req, res) => {
  try {
    // Get all restaurants from current database
    const allRestaurants = await db.select().from(restaurants);
    
    return res.json({
      success: true,
      message: `Database has ${allRestaurants.length} restaurants`,
      count: allRestaurants.length,
      instruction: allRestaurants.length === 0 ? 
        'Database is empty! Need to import data manually.' : 
        'Database already has data.'
    });
  } catch (error: any) {
    console.error('Check error:', error);
    return res.status(500).json({ 
      error: 'Check failed', 
      details: error.message 
    });
  }
});

export default router;