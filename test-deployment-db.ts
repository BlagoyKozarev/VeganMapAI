// Test script to check database connection directly
import { Client } from '@neondatabase/serverless';

async function testDatabaseConnection() {
  console.log('\n=== TESTING DATABASE CONNECTION ===');
  
  // Test with the correct DATABASE_URL
  const correctUrl = 'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solid-block-a59dqz1u.us-east-2.aws.neon.tech/veganmapai?sslmode=require';
  
  try {
    const client = new Client(correctUrl);
    await client.connect();
    
    const result = await client.query('SELECT COUNT(*) FROM restaurants');
    console.log('✅ Direct connection successful!');
    console.log(`🍽️ Total restaurants: ${result.rows[0].count}`);
    
    const scoreResult = await client.query('SELECT COUNT(*) FROM restaurants WHERE vegan_score IS NOT NULL');
    console.log(`📊 Restaurants with scores: ${scoreResult.rows[0].count}`);
    
    await client.end();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
}

testDatabaseConnection();