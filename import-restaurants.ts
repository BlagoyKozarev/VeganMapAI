// Import restaurants to production database from JSON file
import { db } from './server/db';
import { restaurants, veganScoreBreakdown } from './shared/schema';
import fs from 'fs/promises';
import { sql } from 'drizzle-orm';

async function importRestaurants() {
  try {
    console.log('📥 Importing restaurants to database...');
    
    // Check if we're in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    if (isDevelopment) {
      console.warn('⚠️  WARNING: Running in development mode!');
      console.log('To import to production, set NODE_ENV=production');
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise(resolve => {
        readline.question('Continue with development database? (y/N): ', resolve);
      });
      readline.close();
      
      if (answer?.toLowerCase() !== 'y') {
        console.log('Import cancelled');
        process.exit(0);
      }
    }
    
    // Read export file
    const exportData = JSON.parse(
      await fs.readFile('restaurants-export.json', 'utf-8')
    );
    
    console.log(`📊 Found ${exportData.count.restaurants} restaurants to import`);
    
    // Clear existing data (optional - comment out if you want to append)
    console.log('🗑️  Clearing existing data...');
    await db.delete(veganScoreBreakdown);
    await db.delete(restaurants);
    
    // Import restaurants in batches
    const batchSize = 50;
    for (let i = 0; i < exportData.restaurants.length; i += batchSize) {
      const batch = exportData.restaurants.slice(i, i + batchSize);
      await db.insert(restaurants).values(batch);
      console.log(`✅ Imported ${Math.min(i + batchSize, exportData.restaurants.length)}/${exportData.restaurants.length} restaurants`);
    }
    
    // Import vegan scores in batches
    for (let i = 0; i < exportData.veganScoreBreakdown.length; i += batchSize) {
      const batch = exportData.veganScoreBreakdown.slice(i, i + batchSize);
      await db.insert(veganScoreBreakdown).values(batch);
      console.log(`✅ Imported ${Math.min(i + batchSize, exportData.veganScoreBreakdown.length)}/${exportData.veganScoreBreakdown.length} scores`);
    }
    
    // Verify import
    const [{ count: restaurantCount }] = await db.select({ count: sql`count(*)::int` }).from(restaurants);
    const [{ count: scoreCount }] = await db.select({ count: sql`count(*)::int` }).from(veganScoreBreakdown);
    
    console.log('\n✅ Import complete!');
    console.log(`📊 Database now contains:`);
    console.log(`   - ${restaurantCount} restaurants`);
    console.log(`   - ${scoreCount} vegan scores`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

importRestaurants();