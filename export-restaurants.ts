// Export restaurants from development database to JSON file
import { db } from './server/db';
import { restaurants, veganScoreBreakdown } from './shared/schema';
import fs from 'fs/promises';

async function exportRestaurants() {
  try {
    console.log('🔄 Exporting restaurants from development database...');
    
    // Get all restaurants
    const allRestaurants = await db.select().from(restaurants);
    console.log(`✅ Found ${allRestaurants.length} restaurants`);
    
    // Get all vegan score breakdowns
    const allScores = await db.select().from(veganScoreBreakdown);
    console.log(`✅ Found ${allScores.length} vegan score breakdowns`);
    
    // Create export data
    const exportData = {
      restaurants: allRestaurants,
      veganScoreBreakdown: allScores,
      exportedAt: new Date().toISOString(),
      count: {
        restaurants: allRestaurants.length,
        scores: allScores.length
      }
    };
    
    // Write to file
    await fs.writeFile(
      'restaurants-export.json',
      JSON.stringify(exportData, null, 2)
    );
    
    console.log('✅ Export complete! File: restaurants-export.json');
    console.log(`📊 Exported ${allRestaurants.length} restaurants with ${allScores.length} scores`);
    
    // Show sample data
    console.log('\n📍 Sample restaurants:');
    allRestaurants.slice(0, 3).forEach(r => {
      console.log(`  - ${r.name} (Score: ${r.veganScore})`);
    });
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

exportRestaurants();