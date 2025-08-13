// Script to check what's in the production database from deployment logs
import { db } from './server/db';
import { restaurants } from './shared/schema';

async function checkProdDatabase() {
  console.log('=== PRODUCTION DATABASE CHECK ===');
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 50) + '...');
  
  try {
    // Count total restaurants
    const allRestaurants = await db.select().from(restaurants);
    console.log('Total restaurants in database:', allRestaurants.length);
    
    // Check first 5 restaurants
    if (allRestaurants.length > 0) {
      console.log('\nFirst 5 restaurants:');
      allRestaurants.slice(0, 5).forEach(r => {
        console.log(`- ${r.name} (Score: ${r.veganScore}, City: ${r.city})`);
      });
    } else {
      console.log('\n❌ DATABASE IS EMPTY! No restaurants found.');
    }
    
  } catch (error) {
    console.error('❌ DATABASE CONNECTION ERROR:', error);
  }
  
  process.exit(0);
}

checkProdDatabase();