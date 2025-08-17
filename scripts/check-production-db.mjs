import pg from 'pg';

const { Pool } = pg;

// Check the production database directly
const PRODUCTION_DB_URL = 'postgresql://neondb_owner:npg_6xcdtCO4XqKg@ep-shiny-frog-aehergve.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
  connectionString: PRODUCTION_DB_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkProduction() {
  try {
    console.log('Checking PRODUCTION database...');
    
    // Total count
    const countResult = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    console.log(`Total restaurants: ${countResult.rows[0].count}`);
    
    // Sample records
    const sampleResult = await pool.query(`
      SELECT id, name, latitude, longitude, vegan_score 
      FROM restaurants 
      ORDER BY created_at DESC 
      LIMIT 10
    `);
    
    console.log('\nLatest 10 restaurants:');
    sampleResult.rows.forEach((r, i) => {
      console.log(`${i+1}. ${r.name} (${r.id}): ${r.vegan_score}/10 at (${r.latitude}, ${r.longitude})`);
    });
    
    // Check bbox query
    const bboxResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM restaurants 
      WHERE CAST(latitude AS DECIMAL) >= 42.5 
        AND CAST(latitude AS DECIMAL) <= 42.9 
        AND CAST(longitude AS DECIMAL) >= 23.0 
        AND CAST(longitude AS DECIMAL) <= 23.7
    `);
    
    console.log(`\nSofia bbox (42.5-42.9, 23.0-23.7): ${bboxResult.rows[0].count} restaurants`);
    
    // Check for emergeny records
    const emergencyResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM restaurants 
      WHERE id LIKE '%emergency%'
    `);
    
    console.log(`Emergency records: ${emergencyResult.rows[0].count}`);
    
    // Check for prod records 
    const prodResult = await pool.query(`
      SELECT COUNT(*) as count 
      FROM restaurants 
      WHERE id LIKE 'sofia_prod_%'
    `);
    
    console.log(`Production seeded records: ${prodResult.rows[0].count}`);
    
  } catch (error) {
    console.error('Production check failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

checkProduction().then(() => process.exit(0)).catch(() => process.exit(1));