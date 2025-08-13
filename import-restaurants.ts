// Import restaurants to production database from JSON file
import { db } from './server/db';
import { restaurants, veganScoreBreakdown } from './shared/schema';
import fs from 'fs/promises';
import { sql } from 'drizzle-orm';

async function importRestaurants() {
  try {
    console.log('📥 Importing restaurants to database...');
    
    // Check environment
    const isProduction = process.env.NODE_ENV === 'production';
    const dbUrl = process.env.DATABASE_URL;
    
    console.log(`📍 Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
    console.log(`🔗 Database: ${dbUrl?.includes('neon.tech') ? 'Neon (Production)' : 'Local/Dev'}`);
    
    if (!isProduction) {
      console.warn('⚠️  WARNING: Not in production mode!');
      console.log('To import to production, run with: NODE_ENV=production DATABASE_URL="your-prod-url"');
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