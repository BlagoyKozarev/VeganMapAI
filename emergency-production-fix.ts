// Direct connection to production database to check what's really happening
import { Pool } from '@neondatabase/serverless';
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';

neonConfig.webSocketConstructor = ws;

async function emergencyProductionCheck() {
  console.log("🚨 EMERGENCY PRODUCTION CHECK\n");
  
  // The DATABASE_URL we set in production deployment
  const prodUrl = "postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solitary-sun-adx3l722.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  const pool = new Pool({ connectionString: prodUrl });
  
  try {
    console.log("1️⃣ Connecting to production database...");
    
    // Count restaurants
    const countResult = await pool.query("SELECT COUNT(*) as count FROM restaurants");
    console.log(`✅ Restaurants in production DB: ${countResult.rows[0].count}`);
    
    // First check what columns exist
    const columnsResult = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'restaurants'
    `);
    console.log("\n2️⃣ Available columns:");
    console.log(columnsResult.rows.map(r => r.column_name).join(', '));
    
    // Get sample with existing columns
    const sampleResult = await pool.query("SELECT id, name FROM restaurants LIMIT 3");
    console.log("\n3️⃣ Sample restaurants:");
    sampleResult.rows.forEach(r => {
      console.log(`   - ${r.name}`);
    });
    
    // Check all fields
    const fieldsResult = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT("veganScore") as with_score,
        COUNT(latitude) as with_lat,
        COUNT(longitude) as with_lng
      FROM restaurants
    `);
    console.log("\n3️⃣ Data integrity:", fieldsResult.rows[0]);
    
    // Test the exact query that storage.ts uses
    console.log("\n4️⃣ Testing exact storage query...");
    const storageQuery = await pool.query("SELECT * FROM restaurants LIMIT 5");
    console.log(`   Query returned ${storageQuery.rows.length} rows`);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

emergencyProductionCheck();