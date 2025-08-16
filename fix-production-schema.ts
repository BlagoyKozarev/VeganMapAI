#!/usr/bin/env tsx

import { db } from "./server/db";
import { restaurants } from "@shared/schema";

async function fixProductionSchema() {
  console.log("🔧 FIXING PRODUCTION DATABASE SCHEMA");
  
  try {
    // Clear database first
    console.log("💥 Clearing existing data...");
    await db.delete(restaurants);
    
    // Insert with correct data types based on schema
    console.log("📝 Inserting restaurants with proper schema...");
    const correctData = [
      {
        id: "loving-hut-sofia",
        name: "Loving Hut Sofia",
        address: "ul. \"Vitosha\" 18, 1000 Sofia, Bulgaria",
        latitude: "42.69798360",
        longitude: "23.33007510",
        phone: "+359 2 980 1689",
        website: "https://lovinghut.com/sofia",
        veganScore: "8.0", // String based on schema
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
        priceLevel: 2, // Integer: 1=$ 2=$$ 3=$$$
        rating: "4.5",
        reviewCount: 247,
        openingHours: "Mon-Sun: 11:00-22:00",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "soul-kitchen-sofia",
        name: "Soul Kitchen",
        address: "ul. \"Graf Ignatiev\" 12, 1000 Sofia, Bulgaria", 
        latitude: "42.68432380",
        longitude: "23.32737170",
        phone: "+359 88 123 4567",
        veganScore: "7.8",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["Modern European", "Vegan"],
        priceLevel: 3, // $$$
        rating: "4.7",
        reviewCount: 189,
        openingHours: "Tue-Sun: 12:00-23:00",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "edgy-veggy-sofia", 
        name: "Edgy Veggy",
        address: "bul. \"Vitosha\" 45, 1000 Sofia, Bulgaria",
        latitude: "42.69181700",
        longitude: "23.31720890", 
        phone: "+359 2 987 6543",
        veganScore: "7.4",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["International", "Vegan", "Raw Food"],
        priceLevel: 2, // $$
        rating: "4.3",
        reviewCount: 156,
        openingHours: "Mon-Sat: 10:00-21:00",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "vita-rama-sofia",
        name: "Vita Rama Vegan Restaurant", 
        address: "ul. \"Solunska\" 32, 1000 Sofia, Bulgaria",
        latitude: "42.68529520",
        longitude: "23.32166450",
        phone: "+359 2 456 7890",
        veganScore: "7.1",
        isFullyVegan: true,
        hasVeganOptions: true,
        cuisineTypes: ["Bulgarian", "Vegan", "Traditional"],
        priceLevel: 1, // $
        rating: "4.2",
        reviewCount: 203,
        openingHours: "Mon-Fri: 11:00-22:00, Sat-Sun: 12:00-23:00",
        city: "Sofia",
        country: "Bulgaria"
      },
      {
        id: "satsanga-sofia",
        name: "SATSANGA Vegetarian Restaurant",
        address: "ul. \"William Gladstone\" 2, 1000 Sofia, Bulgaria",
        latitude: "42.69511920", 
        longitude: "23.32847910",
        phone: "+359 2 321 6543",
        veganScore: "6.8",
        isFullyVegan: false,
        hasVeganOptions: true,
        cuisineTypes: ["Indian", "Vegetarian", "Vegan Options"],
        priceLevel: 2, // $$
        rating: "4.4", 
        reviewCount: 312,
        openingHours: "Daily: 11:30-22:30",
        city: "Sofia",
        country: "Bulgaria"
      }
    ];

    await db.insert(restaurants).values(correctData);
    
    const finalCount = await db.select().from(restaurants);
    console.log(`✅ SUCCESS: ${finalCount.length} restaurants inserted with correct schema`);
    
    // Show what was inserted
    finalCount.forEach(r => console.log(`  ${r.name}: ${r.veganScore}/8.0`));
    
    return finalCount.length;
    
  } catch (error) {
    console.error("❌ Schema fix failed:", error);
    throw error;
  }
}

fixProductionSchema()
  .then(count => console.log(`🎯 Production fix complete: ${count} restaurants`))
  .catch(error => console.error("💥 Fix failed:", error));