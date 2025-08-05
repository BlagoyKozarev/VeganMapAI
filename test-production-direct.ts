// Test production database connection directly
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import * as schema from './shared/schema';

async function testProductionDB() {
  const productionUrl = process.env.DATABASE_URL;
  
  if (!productionUrl) {
    console.error('❌ No DATABASE_URL provided!');
    console.log('Usage: DATABASE_URL="your-production-url" tsx test-production-direct.ts');
    process.exit(1);
  }
  
  console.log('🔍 Testing Production Database Connection...');
  console.log(`📍 URL contains neon.tech: ${productionUrl.includes('neon.tech')}`);
  
  try {
    // Create direct connection to production
    const sqlClient = neon(productionUrl);
    const db = drizzle(sqlClient, { schema });
    
    // Test query
    const [{ count }] = await db.select({ 
      count: sql`count(*)::int` 
    }).from(schema.restaurants);
    
    console.log(`\n✅ Connection successful!`);
    console.log(`📊 Restaurants in production: ${count}`);
    
    if (count === 0) {
      console.log('\n❌ Production database is EMPTY!');
      console.log('The import script did not populate the production database.');
    } else {
      // Get sample restaurants
      const samples = await db.select().from(schema.restaurants).limit(3);
      console.log('\n📍 Sample restaurants:');
      samples.forEach(r => {
        console.log(`   - ${r.name} (${r.address})`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Connection failed:', error);
    console.log('\nPossible issues:');
    console.log('1. Wrong DATABASE_URL');
    console.log('2. Network/firewall blocking connection');
    console.log('3. Database credentials expired');
  }
  
  process.exit(0);
}

testProductionDB();