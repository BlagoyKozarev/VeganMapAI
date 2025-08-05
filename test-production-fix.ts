// Test production fix locally
import { db, pool } from "./server/db";
import { sql } from "drizzle-orm";

async function testProductionFix() {
  console.log("🧪 Testing production column fix...\n");
  
  try {
    // Simulate production environment
    process.env.NODE_ENV = 'production';
    
    // Test the exact query from storage.ts
    const result = await db.execute(sql`
      SELECT 
        id,
        place_id as "placeId",
        name,
        address,
        latitude,
        longitude,
        phone_number as "phoneNumber",
        website,
        price_level as "priceLevel",
        cuisine_types as "cuisineTypes",
        opening_hours as "openingHours",
        photos,
        rating,
        review_count as "reviewCount",
        vegan_score as "veganScore",
        is_verified as "isVerified",
        created_at as "createdAt",
        updated_at as "updatedAt",
        geo_hash as "geoHash"
      FROM restaurants
      LIMIT 5
    `);
    
    console.log(`✅ Production query returned ${result.rows.length} restaurants`);
    console.log("\nSample data:");
    result.rows.forEach((r: any) => {
      console.log(`- ${r.name} (score: ${r.veganScore})`);
    });
    
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
  }
}

testProductionFix();