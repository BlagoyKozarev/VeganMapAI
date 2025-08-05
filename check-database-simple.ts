import { db } from './server/db';
import { restaurants } from './shared/schema';

async function checkDatabase() {
  try {
    console.log('=== CHECKING DATABASE ===');
    console.log('DATABASE_URL:', process.env.DATABASE_URL?.substring(0, 30) + '...');
    console.log('Environment:', process.env.NODE_ENV || 'development');
    
    const allRestaurants = await db.select().from(restaurants);
    
    console.log('\n✅ DATABASE STATUS:');
    console.log(`Total restaurants: ${allRestaurants.length}`);
    
    if (allRestaurants.length === 0) {
      console.log('\n❌ DATABASE IS EMPTY!');
      console.log('Need to import data from development database.');
    } else {
      console.log('\n✅ Database has data!');
      console.log('Sample restaurants:');
      allRestaurants.slice(0, 3).forEach(r => {
        console.log(`- ${r.name} (${r.address})`);
      });
    }
    
    console.log('\n=== CHECK COMPLETE ===');
    process.exit(0);
  } catch (error) {
    console.error('❌ ERROR:', error);
    process.exit(1);
  }
}

checkDatabase();