#!/usr/bin/env tsx

import { db } from "./server/db";
import { restaurants } from "@shared/schema";

async function emergencyProductionFix() {
  console.log("🚨 EMERGENCY PRODUCTION DATABASE FIX");
  console.log("Current environment:", process.env.NODE_ENV);
  console.log("Database URL pattern:", process.env.DATABASE_URL?.substring(30, 55));
  
  try {
    // Force delete all data and reload
    console.log("💥 Clearing production database...");
    await db.delete(restaurants);
    
    console.log("📝 Loading critical Sofia restaurants...");
    const criticalData = [
      {
        id: "loving-hut-sofia-emergency",
        name: "Loving Hut Sofia",
        address: "ul. \"Vitosha\" 18, 1000 Sofia, Bulgaria",
        latitude: "42.69798360",
        longitude: "23.33007510",
        veganScore: "8.0",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["Asian", "Vegan"],
        priceLevel: "$$",
        rating: "4.5",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "soul-kitchen-emergency",
        name: "Soul Kitchen",
        address: "ul. \"Graf Ignatiev\" 12, 1000 Sofia, Bulgaria", 
        latitude: "42.68432380",
        longitude: "23.32737170",
        veganScore: "7.8",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["Modern European", "Vegan"],
        priceLevel: "$$$",
        rating: "4.7",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "edgy-veggy-emergency", 
        name: "Edgy Veggy",
        address: "bul. \"Vitosha\" 45, 1000 Sofia, Bulgaria",
        latitude: "42.69181700",
        longitude: "23.31720890", 
        veganScore: "7.4",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["International", "Vegan"],
        priceLevel: "$$",
        rating: "4.3",
        city: "Sofia",
        country: "Bulgaria"
      }
    ];
    
    await db.insert(restaurants).values(criticalData);
    
    const finalCount = await db.select().from(restaurants);
    console.log(`✅ SUCCESS: ${finalCount.length} restaurants loaded`);
    
    return finalCount.length;
    
  } catch (error) {
    console.error("❌ Emergency fix failed:", error);
    throw error;
  }
}

// Force set production mode for this script
process.env.NODE_ENV = "production";

emergencyProductionFix()
  .then(count => console.log(`🎯 Emergency fix complete: ${count} restaurants`))
  .catch(error => console.error("💥 Emergency fix failed:", error));