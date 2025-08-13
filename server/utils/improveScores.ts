/**
 * Script to improve vegan scores with more realistic distribution
 * Current average: 1.53, Target: more realistic 3-7 range for most restaurants
 */

import { db } from '../db.js';
import { restaurants } from '@shared/schema.js';
import { eq, sql } from 'drizzle-orm';

interface ScoreAdjustment {
  keyword: string;
  adjustment: number;
}

const scoreAdjustments: ScoreAdjustment[] = [
  // Vegan-specific restaurants get high scores
  { keyword: 'vegan', adjustment: 5 },
  { keyword: 'vegetarian', adjustment: 3.5 },
  { keyword: 'plant-based', adjustment: 4 },
  
  // Restaurant types with good vegan options
  { keyword: 'indian', adjustment: 2 },
  { keyword: 'thai', adjustment: 1.8 },
  { keyword: 'asian', adjustment: 1.5 },
  { keyword: 'chinese', adjustment: 1.5 },
  { keyword: 'japanese', adjustment: 1.3 },
  { keyword: 'sushi', adjustment: 1.2 },
  { keyword: 'mediterranean', adjustment: 1.5 },
  { keyword: 'middle eastern', adjustment: 1.5 },
  { keyword: 'falafel', adjustment: 2.5 },
  { keyword: 'mexican', adjustment: 1.2 },
  { keyword: 'italian', adjustment: 1 },
  { keyword: 'pizza', adjustment: 0.8 },
  { keyword: 'cafe', adjustment: 0.7 },
  { keyword: 'coffee', adjustment: 0.6 },
  { keyword: 'bakery', adjustment: 0.5 },
  
  // Likely to have fewer vegan options
  { keyword: 'steakhouse', adjustment: -1 },
  { keyword: 'bbq', adjustment: -1 },
  { keyword: 'barbecue', adjustment: -1 },
  { keyword: 'seafood', adjustment: -0.8 },
  { keyword: 'fish', adjustment: -0.8 },
  { keyword: 'burger', adjustment: 0.3 }, // Many now have vegan options
  { keyword: 'fast food', adjustment: 0.2 },
];

export async function improveVeganScores() {
  console.log('Starting vegan score improvement...');
  
  try {
    // Get all restaurants
    const allRestaurants = await db.select().from(restaurants);
    console.log(`Processing ${allRestaurants.length} restaurants...`);
    
    let updated = 0;
    
    for (const restaurant of allRestaurants) {
      const currentScore = parseFloat(restaurant.veganScore || '0');
      let newScore = currentScore;
      
      // Base score improvement (move from 1-2 range to 2-4 range)
      if (currentScore < 3) {
        newScore = currentScore + 1.5;
      }
      
      // Apply adjustments based on name and cuisine
      const nameAndCuisine = `${restaurant.name.toLowerCase()} ${(restaurant.cuisineTypes || []).join(' ').toLowerCase()}`;
      
      for (const { keyword, adjustment } of scoreAdjustments) {
        if (nameAndCuisine.includes(keyword)) {
          newScore += adjustment;
        }
      }
      
      // Ensure score stays within bounds
      newScore = Math.max(1, Math.min(10, newScore));
      
      // Round to 1 decimal place
      newScore = Math.round(newScore * 10) / 10;
      
      // Update if changed
      if (newScore !== currentScore) {
        await db
          .update(restaurants)
          .set({ 
            veganScore: newScore.toString(),
            updatedAt: new Date()
          })
          .where(eq(restaurants.id, restaurant.id));
        
        updated++;
        
        if (updated % 50 === 0) {
          console.log(`Updated ${updated} restaurants...`);
        }
      }
    }
    
    console.log(`✅ Score improvement complete! Updated ${updated} restaurants.`);
    
    // Show new statistics
    const stats = await db.execute(sql`
      SELECT 
        COUNT(*) as total,
        AVG(CAST(vegan_score AS DECIMAL))::NUMERIC(3,2) as avg_score,
        COUNT(CASE WHEN vegan_score::DECIMAL > 5 THEN 1 END) as high_score,
        COUNT(CASE WHEN vegan_score::DECIMAL BETWEEN 3 AND 5 THEN 1 END) as medium_score,
        COUNT(CASE WHEN vegan_score::DECIMAL < 3 THEN 1 END) as low_score
      FROM restaurants
    `);
    
    console.log('\nNew score distribution:', stats.rows[0]);
    
  } catch (error) {
    console.error('Error improving scores:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  improveVeganScores().then(() => process.exit(0));
}