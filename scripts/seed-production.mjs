import pg from 'pg';

const { Pool } = pg;

// Production database URL - update this if needed
const PRODUCTION_DB_URL = 'postgresql://neondb_owner:npg_6xcdtCO4XqKg@ep-shiny-frog-aehergve.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: PRODUCTION_DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function seedProduction() {
  try {
    console.log('Seeding PRODUCTION database with 255 restaurants...');
    
    // Check current count
    const currentCount = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`Current production DB count: ${currentCount.rows[0].count}`);
    
    const sofiaCenter = { lat: 42.6977, lng: 23.3219 };
    const baseNames = [
      'Green Cat Vegan', 'Soul Kitchen Sofia', 'Veda House', 'Rainbow Factory',
      'Sunflower Café', 'Plant Power', 'Loving Hut', 'Veggie Delight',
      'Pure Food', 'Garden Bistro', 'Fresh & Wild', 'Green Heart',
      'Bloom Restaurant', 'Herbivore Hub', 'Natural Kitchen', 'Zen Garden',
      'The Green Spot', 'Healthy Corner', 'Vegan Vibes', 'Earth Kitchen'
    ];
    
    let inserted = 0;
    let skipped = 0;
    
    // Generate 250 restaurants
    for (let i = 0; i < 250; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * 0.1; // ~11km radius
      
      const lat = sofiaCenter.lat + (distance * Math.cos(angle));
      const lng = sofiaCenter.lng + (distance * Math.sin(angle));
      
      const baseName = baseNames[i % baseNames.length];
      const suffix = i >= baseNames.length ? ` ${Math.floor(i/baseNames.length) + 1}` : '';
      
      try {
        const result = await pool.query(`
          INSERT INTO restaurants (
            id, name, address, latitude, longitude, 
            phone_number, website, price_level, cuisine_types, 
            rating, vegan_score, photos
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (id) DO NOTHING
          RETURNING id
        `, [
          `sofia_prod_${i + 1}`,
          `${baseName}${suffix}`,
          `Production Street ${i + 1}, Sofia District ${Math.floor(i/50) + 1}`,
          lat.toFixed(8),
          lng.toFixed(8),
          `+359 2 ${String(Math.floor(Math.random() * 900000) + 100000)}`,
          `https://${baseName.toLowerCase().replace(/[^a-z]/g, '')}.bg`,
          Math.floor(Math.random() * 4) + 1, // 1-4 price level
          `{${['Vegan', 'Healthy', 'Bulgarian', 'International'][Math.floor(Math.random() * 4)]}}`,
          (Math.random() * 2 + 3).toFixed(2), // 3.00-5.00 rating
          (Math.random() * 8 + 2).toFixed(2), // 2.00-10.00 vegan score
          '{}' // empty photos array
        ]);
        
        if (result.rows.length > 0) {
          inserted++;
        } else {
          skipped++;
        }
        
        if ((inserted + skipped) % 50 === 0) {
          console.log(`Progress: ${inserted} inserted, ${skipped} skipped...`);
        }
      } catch (error) {
        console.warn(`Failed to insert restaurant ${i + 1}:`, error.message);
        skipped++;
      }
    }
    
    // Final count
    const finalCountResult = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    const finalCount = parseInt(finalCountResult.rows[0].count);
    
    console.log(`\nProduction seed complete!`);
    console.log(`- Inserted: ${inserted} new restaurants`);
    console.log(`- Skipped: ${skipped} (conflicts/errors)`);
    console.log(`- Total in production DB: ${finalCount}`);
    
    // Show top vegan restaurants
    const topResult = await pool.query(`
      SELECT id, name, latitude, longitude, vegan_score 
      FROM restaurants 
      ORDER BY CAST(vegan_score AS DECIMAL) DESC 
      LIMIT 5
    `);
    
    console.log('\nTop vegan restaurants in production:');
    topResult.rows.forEach(r => {
      console.log(`  ${r.name}: ${r.vegan_score}/10 at (${r.latitude}, ${r.longitude})`);
    });
    
    return finalCount;
  } catch (error) {
    console.error('Production seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedProduction().then(() => process.exit(0)).catch(() => process.exit(1));