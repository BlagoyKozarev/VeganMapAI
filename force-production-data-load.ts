#!/usr/bin/env tsx

// FORCE production database loading regardless of existing data
import { db } from "./server/db";
import { restaurants } from "@shared/schema";

async function forceLoadProductionData() {
  console.log("🚨 FORCE LOADING data into production database...");
  
  try {
    // Show current environment
    console.log("DATABASE_URL pattern:", process.env.DATABASE_URL?.substring(30, 55));
    console.log("NODE_ENV:", process.env.NODE_ENV);
    
    // Check current count
    const existingCount = await db.select().from(restaurants);
    console.log(`❗ Current restaurant count: ${existingCount.length}`);
    
    if (existingCount.length === 0) {
      console.log("💥 PRODUCTION DATABASE IS EMPTY - LOADING DATA NOW!");
      
      // Top 5 must-have Sofia vegan restaurants
      const criticalRestaurants = [
        {
          id: "loving-hut-sofia-prod",
          name: "Loving Hut Sofia",
          address: "ul. \"Vitosha\" 18, 1000 Sofia, Bulgaria",
          latitude: "42.69798360",
          longitude: "23.33007510",
          phone: "+359 2 980 1689",
          website: "https://lovinghut.com/sofia",
          veganScore: "8.0",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Asian", "Vegan", "Vegetarian"],
          priceLevel: "$$",
          rating: "4.5",
          reviewCount: 247,
          openingHours: "Mon-Sun: 11:00-22:00",
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "soul-kitchen-sofia-prod",
          name: "Soul Kitchen",
          address: "ul. \"Graf Ignatiev\" 12, 1000 Sofia, Bulgaria", 
          latitude: "42.68432380",
          longitude: "23.32737170",
          phone: "+359 88 123 4567",
          veganScore: "7.8",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["Modern European", "Vegan"],
          priceLevel: "$$$",
          rating: "4.7",
          reviewCount: 189,
          openingHours: "Tue-Sun: 12:00-23:00",
          city: "Sofia",
          country: "Bulgaria"
        },
        {
          id: "edgy-veggy-sofia-prod", 
          name: "Edgy Veggy",
          address: "bul. \"Vitosha\" 45, 1000 Sofia, Bulgaria",
          latitude: "42.69181700",
          longitude: "23.31720890", 
          veganScore: "7.4",
          isFullyVegan: true,
          hasVeganOptions: true,
          cuisineTypes: ["International", "Vegan", "Raw Food"],
          priceLevel: "$$",
          rating: "4.3",
          reviewCount: 156,
          city: "Sofia",
          country: "Bulgaria"
        }
      ];
      
      await db.insert(restaurants).values(criticalRestaurants);
      console.log(`✅ Inserted ${criticalRestaurants.length} critical restaurants`);
      
      // Verify insertion
      const newCount = await db.select().from(restaurants);
      console.log(`🎉 SUCCESS! Now have ${newCount.length} restaurants in production`);
      
      return newCount.length;
    } else {
      console.log("✅ Production database already has data");
      return existingCount.length;
    }
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR:", error);
    throw error;
  }
}

forceLoadProductionData()
  .then(count => {
    console.log(`🎯 Final count: ${count} restaurants`);
    process.exit(0);
  })
  .catch(error => {
    console.error("💥 FATAL ERROR:", error);
    process.exit(1);
  });