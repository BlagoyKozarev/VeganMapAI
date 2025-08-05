import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { readFileSync } from 'fs';
import * as schema from './shared/schema';

// Production DATABASE_URL
const PRODUCTION_URL = 'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solitary-sun-adx3l722.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function importData() {
  console.log('🚀 Direct Production Import Starting...');
  
  try {
    // Connect to production database
    const sql = neon(PRODUCTION_URL);
    const db = drizzle(sql, { schema });
    
    // Check current state
    const currentRestaurants = await db.select().from(schema.restaurants);
    console.log(`📊 Current restaurants in production: ${currentRestaurants.length}`);
    
    // Read export file
    const exportData = JSON.parse(readFileSync('./restaurants-export.json', 'utf-8'));
    console.log(`📂 Found ${exportData.restaurants.length} restaurants to import`);
    
    if (currentRestaurants.length > 0) {
      console.log('⚠️  Production database already has data!');
      console.log('Checking if it matches...');
      
      if (currentRestaurants.length === exportData.restaurants.length) {
        console.log('✅ Production database already has all restaurants!');
        return;
      }
    }
    
    // Clear existing data if needed
    if (currentRestaurants.length > 0 && currentRestaurants.length !== exportData.restaurants.length) {
      console.log('🗑️  Clearing existing data...');
      await db.delete(schema.veganScoreBreakdowns);
      await db.delete(schema.restaurants);
    }
    
    // Import restaurants
    console.log('📥 Importing restaurants...');
    const insertedRestaurants = await db.insert(schema.restaurants)
      .values(exportData.restaurants)
      .returning();
    
    console.log(`✅ Imported ${insertedRestaurants.length} restaurants`);
    
    // Import scores
    if (exportData.scores.length > 0) {
      console.log('📥 Importing vegan scores...');
      await db.insert(schema.veganScoreBreakdowns)
        .values(exportData.scores);
      console.log(`✅ Imported ${exportData.scores.length} vegan scores`);
    }
    
    // Verify final state
    const finalCount = await db.select().from(schema.restaurants);
    console.log(`\n🎉 SUCCESS! Production now has ${finalCount.length} restaurants`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importData();