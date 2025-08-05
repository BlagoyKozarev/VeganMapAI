// Quick fix for production column name mismatch
import { db, pool } from "./server/db";
import { sql } from "drizzle-orm";

async function fixProductionColumns() {
  console.log("🔧 Fixing production column names...\n");
  
  try {
    // Check current column names
    const columnsQuery = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'restaurants'
    `);
    
    console.log("Current columns:");
    console.log(columnsQuery.rows.map(r => r.column_name).join(', '));
    
    // Check if we need to rename columns
    const hasSnakeCase = columnsQuery.rows.some(r => r.column_name === 'vegan_score');
    const hasCamelCase = columnsQuery.rows.some(r => r.column_name === 'veganScore');
    
    if (hasSnakeCase && !hasCamelCase) {
      console.log("\n❌ Production has snake_case columns, but code expects camelCase");
      console.log("This is causing the API to return 0 restaurants\n");
      
      // Test raw query
      const testQuery = await pool.query(`
        SELECT id, name, vegan_score, price_level 
        FROM restaurants 
        LIMIT 5
      `);
      
      console.log("✅ Raw query works fine:");
      testQuery.rows.forEach(r => {
        console.log(`   - ${r.name} (score: ${r.vegan_score})`);
      });
      
      console.log("\n📝 Solution: Update Drizzle schema to use snake_case in production");
    } else {
      console.log("\n✅ Column names look correct");
    }
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

fixProductionColumns();