import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './shared/schema';

const PRODUCTION_URL = 'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solitary-sun-adx3l722.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';

async function checkScores() {
  console.log('🔍 Checking VeganScore values in production...\n');
  
  try {
    const sql = neon(PRODUCTION_URL);
    const db = drizzle(sql, { schema });
    
    // Get all restaurants
    const restaurants = await db.select().from(schema.restaurants);
    console.log(`Total restaurants: ${restaurants.length}`);
    
    // Check vegan scores
    const withScores = restaurants.filter(r => r.veganScore && parseFloat(r.veganScore) > 0);
    const withZeroScores = restaurants.filter(r => r.veganScore === '0' || r.veganScore === '0.0');
    const withNullScores = restaurants.filter(r => !r.veganScore);
    
    console.log(`\nVegan Score Analysis:`);
    console.log(`✅ With scores > 0: ${withScores.length}`);
    console.log(`⚠️  With score = 0: ${withZeroScores.length}`);
    console.log(`❌ With NULL score: ${withNullScores.length}`);
    
    if (withScores.length === 0) {
      console.log('\n🚨 PROBLEM IDENTIFIED: No restaurants have vegan scores > 0!');
      console.log('This is why the API returns 0 restaurants.');
      console.log('\nThe getAllRestaurantsWithScores() function filters out score=0 restaurants!');
    }
    
    // Show sample restaurants
    console.log('\nSample restaurants:');
    restaurants.slice(0, 3).forEach(r => {
      console.log(`- ${r.name}: veganScore=${r.veganScore}`);
    });
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkScores();