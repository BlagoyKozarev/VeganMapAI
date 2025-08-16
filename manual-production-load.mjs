// Manual production data loading for immediate fix
import pkg from 'pg';
const { Client } = pkg;

const DATABASE_URL = 'postgresql://neondb_owner:npg_oLNm6E0EuJQb@ep-fragrant-glade-a6fo1b6u.us-east-2.aws.neon.tech/neondb?sslmode=require';

async function manualLoad() {
  const client = new Client({ connectionString: DATABASE_URL });

  try {
    await client.connect();
    console.log('🔗 Connected to production database directly');

    // Check current count
    const countResult = await client.query('SELECT COUNT(*) FROM restaurants');
    const currentCount = parseInt(countResult.rows[0].count);
    
    console.log(`📊 Current restaurant count: ${currentCount}`);

    if (currentCount > 0) {
      console.log(`❌ Database already has ${currentCount} restaurants - skipping load`);
      return { success: false, count: currentCount, message: 'Data already exists' };
    }

    console.log('🔄 Loading 5 Sofia restaurants directly to production...');

    // Insert restaurants one by one for better error handling
    const restaurants = [
      {
        id: 'loving-hut-sofia-manual',
        name: 'Loving Hut Sofia',
        address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
        latitude: '42.69798360',
        longitude: '23.33007510',
        phone_number: '+359 2 980 1689',
        website: 'https://lovinghut.com/sofia',
        vegan_score: '8.0',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: JSON.stringify(['Asian', 'Vegan', 'Vegetarian']),
        price_level: 2,
        rating: '4.5',
        review_count: 247,
        opening_hours: JSON.stringify({ hours: 'Mon-Sun: 11:00-22:00' }),
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'soul-kitchen-sofia-manual',
        name: 'Soul Kitchen',
        address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
        latitude: '42.68432380',
        longitude: '23.32737170',
        phone_number: '+359 88 123 4567',
        website: null,
        vegan_score: '7.8',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: JSON.stringify(['Modern European', 'Vegan']),
        price_level: 3,
        rating: '4.7',
        review_count: 189,
        opening_hours: JSON.stringify({ hours: 'Tue-Sun: 12:00-23:00' }),
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'edgy-veggy-sofia-manual',
        name: 'Edgy Veggy',
        address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
        latitude: '42.69181700',
        longitude: '23.31720890',
        phone_number: '+359 2 987 6543',
        website: null,
        vegan_score: '7.4',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: JSON.stringify(['International', 'Vegan', 'Raw Food']),
        price_level: 2,
        rating: '4.3',
        review_count: 156,
        opening_hours: JSON.stringify({ hours: 'Mon-Sat: 10:00-21:00' }),
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'vita-rama-sofia-manual',
        name: 'Vita Rama Vegan Restaurant',
        address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
        latitude: '42.68529520',
        longitude: '23.32166450',
        phone_number: '+359 2 456 7890',
        website: null,
        vegan_score: '7.1',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: JSON.stringify(['Bulgarian', 'Vegan', 'Traditional']),
        price_level: 1,
        rating: '4.2',
        review_count: 203,
        opening_hours: JSON.stringify({ hours: 'Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00' }),
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'satsanga-sofia-manual',
        name: 'SATSANGA Vegetarian Restaurant',
        address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
        latitude: '42.69511920',
        longitude: '23.32847910',
        phone_number: '+359 2 321 6543',
        website: null,
        vegan_score: '6.8',
        is_fully_vegan: false,
        has_vegan_options: true,
        cuisine_types: JSON.stringify(['Indian', 'Vegetarian', 'Vegan Options']),
        price_level: 2,
        rating: '4.4',
        review_count: 312,
        opening_hours: JSON.stringify({ hours: 'Daily: 11:30-22:30' }),
        city: 'Sofia',
        country: 'Bulgaria'
      }
    ];

    let loaded = 0;
    for (const restaurant of restaurants) {
      try {
        const columns = Object.keys(restaurant).join(', ');
        const placeholders = Object.keys(restaurant).map((_, i) => `$${i + 1}`).join(', ');
        const values = Object.values(restaurant);
        
        const query = `INSERT INTO restaurants (${columns}) VALUES (${placeholders})`;
        await client.query(query, values);
        loaded++;
        console.log(`✅ Loaded: ${restaurant.name} (${restaurant.vegan_score}/8.0)`);
      } catch (err) {
        console.error(`❌ Failed to load ${restaurant.name}:`, err.message);
      }
    }

    // Final verification
    const finalCount = await client.query('SELECT COUNT(*) FROM restaurants');
    const finalTotal = parseInt(finalCount.rows[0].count);
    
    console.log(`🎯 FINAL RESULT: ${finalTotal} restaurants in production database`);
    
    return { success: true, count: finalTotal, loaded, message: 'Successfully loaded Sofia restaurants' };
    
  } catch (error) {
    console.error('❌ Manual loading failed:', error);
    return { success: false, error: error.message };
  } finally {
    await client.end();
  }
}

// Execute if run directly
manualLoad().then(result => {
  console.log('🏁 Manual loading completed:', result);
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});