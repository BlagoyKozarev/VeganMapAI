// Direct database query to check what's in production database
import { Pool } from '@neondatabase/serverless';

async function debugProductionQuery() {
  console.log("🔍 Direct Production Database Query\n");
  
  // Use the production DATABASE_URL that we set in deployment
  const productionUrl = "postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solitary-sun-adx3l722.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require";
  
  const pool = new Pool({ connectionString: productionUrl });
  
  try {
    // 1. Check table exists
    console.log("1️⃣ Checking if restaurants table exists...");
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'restaurants'
      );
    `);
    console.log("   Table exists:", tableCheck.rows[0].exists);
    
    // 2. Count restaurants
    console.log("\n2️⃣ Counting restaurants...");
    const countQuery = await pool.query("SELECT COUNT(*) FROM restaurants");
    console.log("   Total restaurants:", countQuery.rows[0].count);
    
    // 3. Get sample data
    console.log("\n3️⃣ Sample restaurants:");
    const sampleQuery = await pool.query("SELECT id, name, city FROM restaurants LIMIT 5");
    sampleQuery.rows.forEach(r => {
      console.log(`   - ${r.name} (${r.city})`);
    });
    
    // 4. Check if there are any filters that might cause 0 results
    console.log("\n4️⃣ Checking data integrity:");
    const fieldsQuery = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(id) as with_id,
        COUNT(name) as with_name,
        COUNT(latitude) as with_lat,
        COUNT(longitude) as with_lng,
        COUNT("veganScore") as with_score
      FROM restaurants
    `);
    console.log("   Data stats:", fieldsQuery.rows[0]);
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

debugProductionQuery();