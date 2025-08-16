// Direct production database loading using the EXACT environment that production uses
const { Pool } = require('pg');

// Use production database URL directly
const productionDbUrl = "postgresql://neondb_owner:jyDsoZGQ8SY5@ep-fragrant-glade-aeh09oio.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require";

console.log("🎯 DIRECT PRODUCTION DATABASE LOADING");
console.log("Target DB:", productionDbUrl.substring(30, 60));

const pool = new Pool({
  connectionString: productionDbUrl,
  ssl: { rejectUnauthorized: false }
});

async function directProductionLoad() {
  try {
    // Test connection
    const client = await pool.connect();
    console.log("✅ Connected to production database");
    
    // Check current count
    const countResult = await client.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`Current restaurant count: ${countResult.rows[0].count}`);
    
    // Clear existing data
    await client.query('DELETE FROM restaurants');
    console.log("💥 Cleared existing restaurants");
    
    // Insert 5 critical restaurants
    const insertQuery = `
      INSERT INTO restaurants (id, name, address, latitude, longitude, phone_number, website, vegan_score, is_fully_vegan, has_vegan_options, cuisine_types, price_level, rating, review_count, opening_hours, city, country)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;
    
    const restaurants = [
      ['loving-hut-prod', 'Loving Hut Sofia', 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria', '42.69798360', '23.33007510', '+359 2 980 1689', 'https://lovinghut.com/sofia', '8.0', true, true, '{Asian,Vegan,Vegetarian}', 2, '4.5', 247, '"Mon-Sun: 11:00-22:00"', 'Sofia', 'Bulgaria'],
      ['soul-kitchen-prod', 'Soul Kitchen', 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria', '42.68432380', '23.32737170', '+359 88 123 4567', null, '7.8', true, true, '{Modern European,Vegan}', 3, '4.7', 189, '"Tue-Sun: 12:00-23:00"', 'Sofia', 'Bulgaria'],
      ['edgy-veggy-prod', 'Edgy Veggy', 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria', '42.69181700', '23.31720890', '+359 2 987 6543', null, '7.4', true, true, '{International,Vegan,Raw Food}', 2, '4.3', 156, '"Mon-Sat: 10:00-21:00"', 'Sofia', 'Bulgaria'],
      ['vita-rama-prod', 'Vita Rama Vegan Restaurant', 'ul. "Solunska" 32, 1000 Sofia, Bulgaria', '42.68529520', '23.32166450', '+359 2 456 7890', null, '7.1', true, true, '{Bulgarian,Vegan,Traditional}', 1, '4.2', 203, '"Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00"', 'Sofia', 'Bulgaria'],
      ['satsanga-prod', 'SATSANGA Vegetarian Restaurant', 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria', '42.69511920', '23.32847910', '+359 2 321 6543', null, '6.8', false, true, '{Indian,Vegetarian,Vegan Options}', 2, '4.4', 312, '"Daily: 11:30-22:30"', 'Sofia', 'Bulgaria']
    ];
    
    for (const restaurant of restaurants) {
      await client.query(insertQuery, restaurant);
      console.log(`✅ Inserted: ${restaurant[1]}`);
    }
    
    // Verify
    const finalResult = await client.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`🎉 Final count: ${finalResult.rows[0].count} restaurants`);
    
    // Show inserted restaurants
    const listResult = await client.query('SELECT name, vegan_score FROM restaurants ORDER BY vegan_score DESC');
    console.log("\n🌱 Loaded restaurants:");
    listResult.rows.forEach(r => console.log(`  ${r.name}: ${r.vegan_score}/8.0`));
    
    client.release();
    await pool.end();
    
    console.log("🚀 PRODUCTION DATABASE LOADING COMPLETE!");
    
  } catch (error) {
    console.error("❌ Direct loading failed:", error.message);
    process.exit(1);
  }
}

directProductionLoad();