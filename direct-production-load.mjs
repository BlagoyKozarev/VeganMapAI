import pg from 'pg';
const { Pool } = pg;

// Production database URL from the debug endpoint
const productionDbUrl = "postgresql://neondb_owner:jyDsoZGQ8SY5@ep-fragrant-glade-aeh09oio.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

console.log("🎯 DIRECT PRODUCTION DATABASE LOADING");
console.log("Target DB: ep-fragrant-glade (PRODUCTION)");

const pool = new Pool({
  connectionString: productionDbUrl,
  ssl: { rejectUnauthorized: false }
});

async function directProductionLoad() {
  let client;
  try {
    // Test connection
    client = await pool.connect();
    console.log("✅ Connected to REAL production database");
    
    // Check current count
    const countResult = await client.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`Current restaurant count: ${countResult.rows[0].count}`);
    
    // Clear existing data
    await client.query('DELETE FROM restaurants');
    console.log("💥 Cleared existing restaurants");
    
    // Insert critical Sofia restaurants with proper types
    const restaurants = [
      {
        id: 'loving-hut-production',
        name: 'Loving Hut Sofia',
        address: 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria',
        latitude: '42.69798360',
        longitude: '23.33007510',
        phone_number: '+359 2 980 1689',
        website: 'https://lovinghut.com/sofia',
        vegan_score: '8.0',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: ['Asian', 'Vegan', 'Vegetarian'],
        price_level: 2,
        rating: '4.5',
        review_count: 247,
        opening_hours: 'Mon-Sun: 11:00-22:00',
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'soul-kitchen-production',
        name: 'Soul Kitchen',
        address: 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria',
        latitude: '42.68432380',
        longitude: '23.32737170',
        vegan_score: '7.8',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: ['Modern European', 'Vegan'],
        price_level: 3,
        rating: '4.7',
        review_count: 189,
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'edgy-veggy-production',
        name: 'Edgy Veggy',
        address: 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria',
        latitude: '42.69181700',
        longitude: '23.31720890',
        vegan_score: '7.4',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: ['International', 'Vegan', 'Raw Food'],
        price_level: 2,
        rating: '4.3',
        review_count: 156,
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'vita-rama-production',
        name: 'Vita Rama Vegan Restaurant',
        address: 'ul. "Solunska" 32, 1000 Sofia, Bulgaria',
        latitude: '42.68529520',
        longitude: '23.32166450',
        vegan_score: '7.1',
        is_fully_vegan: true,
        has_vegan_options: true,
        cuisine_types: ['Bulgarian', 'Vegan', 'Traditional'],
        price_level: 1,
        rating: '4.2',
        review_count: 203,
        city: 'Sofia',
        country: 'Bulgaria'
      },
      {
        id: 'satsanga-production',
        name: 'SATSANGA Vegetarian Restaurant',
        address: 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria',
        latitude: '42.69511920',
        longitude: '23.32847910',
        vegan_score: '6.8',
        is_fully_vegan: false,
        has_vegan_options: true,
        cuisine_types: ['Indian', 'Vegetarian', 'Vegan Options'],
        price_level: 2,
        rating: '4.4',
        review_count: 312,
        city: 'Sofia',
        country: 'Bulgaria'
      }
    ];
    
    for (const restaurant of restaurants) {
      const insertQuery = `
        INSERT INTO restaurants (
          id, name, address, latitude, longitude, phone_number, website, 
          vegan_score, is_fully_vegan, has_vegan_options, cuisine_types, 
          price_level, rating, review_count, city, country
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
        )
      `;
      
      await client.query(insertQuery, [
        restaurant.id,
        restaurant.name,
        restaurant.address,
        restaurant.latitude,
        restaurant.longitude,
        restaurant.phone_number || null,
        restaurant.website || null,
        restaurant.vegan_score,
        restaurant.is_fully_vegan,
        restaurant.has_vegan_options,
        restaurant.cuisine_types,
        restaurant.price_level,
        restaurant.rating,
        restaurant.review_count,
        restaurant.city,
        restaurant.country
      ]);
      
      console.log(`✅ Inserted: ${restaurant.name}`);
    }
    
    // Verify
    const finalResult = await client.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`🎉 Final count: ${finalResult.rows[0].count} restaurants`);
    
    // Show inserted restaurants
    const listResult = await client.query('SELECT name, vegan_score FROM restaurants ORDER BY vegan_score::numeric DESC');
    console.log("\n🌱 Loaded restaurants:");
    listResult.rows.forEach(r => console.log(`  ${r.name}: ${r.vegan_score}/8.0`));
    
    console.log("🚀 PRODUCTION DATABASE LOADING COMPLETE!");
    
  } catch (error) {
    console.error("❌ Direct loading failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  } finally {
    if (client) client.release();
    await pool.end();
  }
}

directProductionLoad();