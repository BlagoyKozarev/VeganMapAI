import { db, pool } from "./server/db";
import { restaurants } from "./shared/schema";

async function checkProductionLive() {
  console.log("🔍 Checking Production Live Status...\n");

  try {
    // 1. Test database connection
    console.log("1️⃣ Testing database connection...");
    const dbUrl = process.env.DATABASE_URL || "";
    console.log(`   Database URL pattern: ${dbUrl.substring(0, 50)}...`);
    
    // 2. Check restaurants count
    const restaurantsList = await db.select().from(restaurants);
    console.log(`   ✅ Database connected! Found ${restaurantsList.length} restaurants\n`);

    // 3. Test production API
    console.log("2️⃣ Testing production API...");
    const response = await fetch("https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data");
    const data = await response.json();
    
    console.log(`   Response status: ${response.status}`);
    console.log(`   Restaurants returned: ${data.count || 0}`);
    console.log(`   API response:`, JSON.stringify(data, null, 2));

    // 4. Compare results
    console.log("\n3️⃣ Analysis:");
    if (restaurantsList.length > 0 && data.count === 0) {
      console.log("   ❌ Database has restaurants but API returns 0!");
      console.log("   🔧 Possible causes:");
      console.log("      - Production code may be outdated");
      console.log("      - API query logic may be different");
      console.log("      - Database connection in production may be failing");
    } else if (restaurantsList.length === data.count) {
      console.log("   ✅ Everything is working correctly!");
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await pool.end();
    process.exit(0);
  }
}

checkProductionLive();