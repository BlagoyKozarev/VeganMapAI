// FIXED import script for production database
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { restaurants, veganScoreBreakdown } from './shared/schema';
import fs from 'fs/promises';
import { sql } from 'drizzle-orm';

async function importToProduction() {
  console.log('🚀 VeganMapAI Production Import (FIXED VERSION)');
  console.log('===========================================\n');
  
  // Check for production DATABASE_URL
  const productionUrl = process.env.DATABASE_URL || process.argv[2];
  
  if (!productionUrl || !productionUrl.includes('neon.tech')) {
    console.error('❌ ERROR: Production DATABASE_URL not provided or invalid!');
    console.log('\nUsage:');
    console.log('  DATABASE_URL="postgresql://...neon.tech..." tsx import-production-fix.ts');
    console.log('  OR');
    console.log('  tsx import-production-fix.ts "postgresql://...neon.tech..."');
    console.log('\nGet your production DATABASE_URL from:');
    console.log('  Deployments → Your deployment → Environment Variables');
    process.exit(1);
  }
  
  try {
    // Create DIRECT connection to production (bypassing local db.ts)
    console.log('🔌 Connecting directly to production database...');
    const sqlClient = neon(productionUrl);
    const db = drizzle(sqlClient, { 
      schema: { restaurants, veganScoreBreakdown } 
    });
    
    // Test connection
    const [{ count: currentCount }] = await db.select({ 
      count: sql`count(*)::int` 
    }).from(restaurants);
    
    console.log(`✅ Connected! Current restaurants: ${currentCount}`);
    
    // Read export file
    console.log('\n📂 Reading restaurants-export.json...');
    const exportData = JSON.parse(
      await fs.readFile('restaurants-export.json', 'utf-8')
    );
    
    console.log(`📊 Found ${exportData.restaurants.length} restaurants to import`);
    
    // Clear existing data
    if (currentCount > 0) {
      console.log(`\n🗑️  Clearing ${currentCount} existing restaurants...`);
      await db.delete(veganScoreBreakdown);
      await db.delete(restaurants);
    }
    
    // Import restaurants in batches
    console.log('\n📥 Importing restaurants...');
    const batchSize = 50;
    for (let i = 0; i < exportData.restaurants.length; i += batchSize) {
      const batch = exportData.restaurants.slice(i, i + batchSize);
      await db.insert(restaurants).values(batch);
      process.stdout.write(`\r✅ Progress: ${Math.min(i + batchSize, exportData.restaurants.length)}/${exportData.restaurants.length} restaurants`);
    }
    
    // Import vegan scores
    console.log('\n\n📥 Importing vegan scores...');
    for (let i = 0; i < exportData.veganScoreBreakdown.length; i += batchSize) {
      const batch = exportData.veganScoreBreakdown.slice(i, i + batchSize);
      await db.insert(veganScoreBreakdown).values(batch);
      process.stdout.write(`\r✅ Progress: ${Math.min(i + batchSize, exportData.veganScoreBreakdown.length)}/${exportData.veganScoreBreakdown.length} scores`);
    }
    
    // Verify import
    console.log('\n\n🔍 Verifying import...');
    const [{ count: finalCount }] = await db.select({ 
      count: sql`count(*)::int` 
    }).from(restaurants);
    const [{ count: scoreCount }] = await db.select({ 
      count: sql`count(*)::int` 
    }).from(veganScoreBreakdown);
    
    console.log('\n✅ IMPORT SUCCESSFUL!');
    console.log('====================');
    console.log(`📊 Production database now contains:`);
    console.log(`   - ${finalCount} restaurants`);
    console.log(`   - ${scoreCount} vegan scores`);
    console.log('\n🌐 Check your site: https://vegan-map-ai-bkozarev.replit.app');
    console.log('   The map should now show restaurants!\n');
    
  } catch (error) {
    console.error('\n❌ Import failed:', error);
    console.log('\nCommon issues:');
    console.log('1. Wrong DATABASE_URL (must be production URL from Deployments)');
    console.log('2. Network issues connecting to Neon');
    console.log('3. Database credentials expired');
    process.exit(1);
  }
  
  process.exit(0);
}

importToProduction();