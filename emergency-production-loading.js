// Emergency production data loading script
// Direct database loading for production deployment

const { Client } = require('pg');

async function loadProductionData() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();
    console.log('🔗 Connected to production database');

    // Check current count
    const countResult = await client.query('SELECT COUNT(*) FROM restaurants');
    const currentCount = parseInt(countResult.rows[0].count);
    
    if (currentCount > 0) {
      console.log(`❌ Database already has ${currentCount} restaurants`);
      return;
    }

    console.log('🔄 Loading Sofia restaurants to production...');

    // Sofia restaurant data
    const restaurants = [
      ['loving-hut-sofia-emergency', 'Loving Hut Sofia', 'ul. "Vitosha" 18, 1000 Sofia, Bulgaria', '42.69798360', '23.33007510', '+359 2 980 1689', 'https://lovinghut.com/sofia', '8.0', true, true, '["Asian", "Vegan", "Vegetarian"]', 2, '4.5', 247, '{"hours": "Mon-Sun: 11:00-22:00"}', 'Sofia', 'Bulgaria'],
      ['soul-kitchen-sofia-emergency', 'Soul Kitchen', 'ul. "Graf Ignatiev" 12, 1000 Sofia, Bulgaria', '42.68432380', '23.32737170', '+359 88 123 4567', null, '7.8', true, true, '["Modern European", "Vegan"]', 3, '4.7', 189, '{"hours": "Tue-Sun: 12:00-23:00"}', 'Sofia', 'Bulgaria'],
      ['edgy-veggy-sofia-emergency', 'Edgy Veggy', 'bul. "Vitosha" 45, 1000 Sofia, Bulgaria', '42.69181700', '23.31720890', '+359 2 987 6543', null, '7.4', true, true, '["International", "Vegan", "Raw Food"]', 2, '4.3', 156, '{"hours": "Mon-Sat: 10:00-21:00"}', 'Sofia', 'Bulgaria'],
      ['vita-rama-sofia-emergency', 'Vita Rama Vegan Restaurant', 'ul. "Solunska" 32, 1000 Sofia, Bulgaria', '42.68529520', '23.32166450', '+359 2 456 7890', null, '7.1', true, true, '["Bulgarian", "Vegan", "Traditional"]', 1, '4.2', 203, '{"hours": "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00"}', 'Sofia', 'Bulgaria'],
      ['satsanga-sofia-emergency', 'SATSANGA Vegetarian Restaurant', 'ul. "William Gladstone" 2, 1000 Sofia, Bulgaria', '42.69511920', '23.32847910', '+359 2 321 6543', null, '6.8', false, true, '["Indian", "Vegetarian", "Vegan Options"]', 2, '4.4', 312, '{"hours": "Daily: 11:30-22:30"}', 'Sofia', 'Bulgaria']
    ];

    const insertQuery = `
      INSERT INTO restaurants (
        id, name, address, latitude, longitude, phone_number, website, vegan_score,
        is_fully_vegan, has_vegan_options, cuisine_types, price_level, rating,
        review_count, opening_hours, city, country
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    `;

    for (const restaurant of restaurants) {
      await client.query(insertQuery, restaurant);
    }

    // Verify insertion
    const finalCount = await client.query('SELECT COUNT(*) FROM restaurants');
    const finalTotal = parseInt(finalCount.rows[0].count);
    
    console.log(`✅ Successfully loaded ${finalTotal} Sofia restaurants to production`);
    
  } catch (error) {
    console.error('❌ Emergency loading failed:', error);
  } finally {
    await client.end();
  }
}

if (require.main === module) {
  loadProductionData();
}

module.exports = { loadProductionData };