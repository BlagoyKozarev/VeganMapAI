// debug-sofia-restaurants.ts - Check Sofia restaurants in production database

import { db } from './server/db.js';
import { restaurants } from './shared/schema.js';
import { sql } from 'drizzle-orm';

async function debugSofiaRestaurants() {
  console.log('🔍 Debugging Sofia restaurants in database...');
  
  try {
    // 1. Check total restaurant count
    const totalCount = await db.select({ count: sql`count(*)` }).from(restaurants);
    console.log(`📊 Total restaurants in database: ${totalCount[0].count}`);
    
    // 2. Check restaurants in Sofia area (latitude/longitude bounds)
    const sofiaRestaurants = await db.select().from(restaurants).where(
      sql`latitude BETWEEN 42.6 AND 42.8 AND longitude BETWEEN 23.2 AND 23.4`
    );
    console.log(`🇧🇬 Sofia area restaurants: ${sofiaRestaurants.length}`);
    
    // 3. Check restaurants with Bulgaria in address
    const bulgariaRestaurants = await db.select().from(restaurants).where(
      sql`address ILIKE '%Bulgaria%' OR address ILIKE '%София%' OR address ILIKE '%Sofia%'`
    );
    console.log(`🏠 Restaurants with Bulgaria in address: ${bulgariaRestaurants.length}`);
    
    // 4. Sample Sofia restaurants
    if (sofiaRestaurants.length > 0) {
      console.log('📍 Sample Sofia restaurants:');
      sofiaRestaurants.slice(0, 5).forEach(restaurant => {
        console.log(`  • ${restaurant.name} (${restaurant.latitude}, ${restaurant.longitude})`);
        console.log(`    Score: ${restaurant.veganScore}, Address: ${restaurant.address}`);
      });
    }
    
    // 5. Check for any geographic filtering in environment
    console.log('🌍 Environment check:');
    console.log(`  NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`  DATABASE_URL region: ${process.env.DATABASE_URL?.includes('aws') ? 'AWS' : 'Other'}`);
    
    // 6. Check recent restaurants (last 30 days)
    const recentRestaurants = await db.select().from(restaurants).where(
      sql`created_at >= NOW() - INTERVAL '30 days'`
    );
    console.log(`📅 Restaurants added in last 30 days: ${recentRestaurants.length}`);
    
    // 7. Geographic distribution
    const byCountry = await db.select({
      country: sql`CASE 
        WHEN address ILIKE '%Bulgaria%' OR address ILIKE '%София%' THEN 'Bulgaria'
        WHEN address ILIKE '%United States%' OR address ILIKE '%USA%' THEN 'USA'  
        WHEN address ILIKE '%New York%' OR address ILIKE '%NYC%' THEN 'USA-NYC'
        ELSE 'Other'
      END`,
      count: sql`count(*)`
    }).from(restaurants).groupBy(sql`CASE 
      WHEN address ILIKE '%Bulgaria%' OR address ILIKE '%София%' THEN 'Bulgaria'
      WHEN address ILIKE '%United States%' OR address ILIKE '%USA%' THEN 'USA'  
      WHEN address ILIKE '%New York%' OR address ILIKE '%NYC%' THEN 'USA-NYC'
      ELSE 'Other'
    END`);
    
    console.log('🌍 Geographic distribution:');
    byCountry.forEach(row => {
      console.log(`  ${row.country}: ${row.count} restaurants`);
    });
    
    // 8. Check if there's any active filtering in the API
    console.log('\n💡 Possible solutions:');
    
    if (sofiaRestaurants.length === 0) {
      console.log('❌ No Sofia restaurants found in database');
      console.log('   → Need to import Sofia restaurant data');
      console.log('   → Check if data was migrated to production');
    } else {
      console.log('✅ Sofia restaurants exist in database');
      console.log('   → Check frontend API calls');
      console.log('   → Check geographic filtering in code');
      console.log('   → Check map viewport bounds');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    console.log('🔧 Check DATABASE_URL connection string');
  }
}

// Additional function to check API endpoint
async function checkRestaurantAPI() {
  console.log('\n🔌 Testing restaurant API endpoint...');
  
  try {
    // Test the all-available endpoint used by the app
    const response = await fetch('http://localhost:5000/api/restaurants/all-available');
    const data = await response.json();
    
    console.log(`📡 API Response: ${data.length || 0} restaurants`);
    
    // Check for Sofia restaurants in the response
    const sofiaInAPI = data.filter((r: any) => {
      const lat = parseFloat(r.latitude);
      const lng = parseFloat(r.longitude);
      return lat >= 42.6 && lat <= 42.8 && lng >= 23.2 && lng <= 23.4;
    });
    
    console.log(`🇧🇬 Sofia restaurants in API response: ${sofiaInAPI.length}`);
    
    if (sofiaInAPI.length > 0) {
      console.log('📍 Sample from API:');
      sofiaInAPI.slice(0, 3).forEach((r: any) => {
        console.log(`  • ${r.name} (${r.latitude}, ${r.longitude})`);
      });
    }
    
  } catch (error) {
    console.log('⚠️ API test failed:', error);
  }
}

// Export for manual execution
export { debugSofiaRestaurants, checkRestaurantAPI };

// Auto-run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  debugSofiaRestaurants().then(() => {
    return checkRestaurantAPI();
  }).then(() => {
    console.log('\n✅ Debug complete');
    process.exit(0);
  });
}