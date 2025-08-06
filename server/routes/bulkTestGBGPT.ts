import express from 'express';
import { GBGPTProvider } from '../providers/gbgptProvider.js';
import { HybridScoringProvider } from '../providers/hybridScoringProvider.js';
import { db } from '../db.js';
import { restaurants } from '../../shared/schema.js';

const router = express.Router();

/**
 * Bulk import и scoring на нови ресторанти
 */
router.post('/bulk-test-gbgpt', async (req, res) => {
  try {
    console.log('🚀 Starting bulk GBGPT test with 50 Sofia restaurants...');
    
    // Sample София ресторанти за тестване
    const testRestaurants = [
      {
        name: "Кафе-ресторант Космос",
        address: "ул. Витоша 45, София",
        cuisineTypes: ["cafe", "bulgarian"],
        lat: 42.6977,
        lng: 23.3219,
        description: "Традиционна българска кухня с модерен подход"
      },
      {
        name: "Пица Темпо",
        address: "бул. Васил Левски 132, София", 
        cuisineTypes: ["pizza", "italian"],
        lat: 42.6869,
        lng: 23.3228,
        description: "Италианска пицария с fresh ingredients"
      },
      {
        name: "Ресторант Made in Home",
        address: "ул. Оборище 42, София",
        cuisineTypes: ["modern_european", "healthy"],
        lat: 42.6886,
        lng: 23.3394,
        description: "Здравословна кухня с домашен вкус"
      },
      {
        name: "Ethno",
        address: "ул. Дякон Игнатий 4, София",
        cuisineTypes: ["traditional", "bulgarian"],
        lat: 42.6948,
        lng: 23.3227,
        description: "Автентична българска кухня в стилна обстановка"
      },
      {
        name: "Rainbow Factory",
        address: "ул. Цар Самуил 25, София",
        cuisineTypes: ["healthy", "vegetarian"],
        lat: 42.6953,
        lng: 23.3264,
        description: "Здравословни и vegetarian опции"
      },
      {
        name: "Salad Studio",
        address: "бул. Витоша 89, София",
        cuisineTypes: ["healthy", "salads"],
        lat: 42.6934,
        lng: 23.3197,
        description: "Fresh салати и здравословни ястия"
      },
      {
        name: "Bistro Pesto",
        address: "ул. Шишман 12, София",
        cuisineTypes: ["italian", "bistro"],
        lat: 42.6891,
        lng: 23.3312,
        description: "Италианско bistro с fresh pasta"
      },
      {
        name: "Green House",
        address: "ул. Граф Игнатиев 64, София",
        cuisineTypes: ["healthy", "organic"],
        lat: 42.6847,
        lng: 23.3254,
        description: "Органична храна и зелени smoothies"
      },
      {
        name: "Asia Garden",
        address: "бул. Черни връх 47, София",
        cuisineTypes: ["asian", "thai"],
        lat: 42.6712,
        lng: 23.3156,
        description: "Автентична азиатска кухня"
      },
      {
        name: "Vegetarian Delight",
        address: "ул. Раковски 95, София", 
        cuisineTypes: ["vegetarian", "vegan"],
        lat: 42.6923,
        lng: 23.3278,
        description: "100% vegetarian ресторант с vegan опции"
      },
      {
        name: "Суши Бар Мидори",
        address: "бул. България 69, София",
        cuisineTypes: ["japanese", "sushi"],
        lat: 42.6643,
        lng: 23.2870,
        description: "Автентично японско суши и веган rolls"
      },
      {
        name: "La Bamba",
        address: "ул. Гладстон 14, София",
        cuisineTypes: ["mexican", "tex_mex"],
        lat: 42.6939,
        lng: 23.3252,
        description: "Мексиканска кухня с растителни опции"
      },
      {
        name: "BioFresh",
        address: "ул. Солунска 44, София",
        cuisineTypes: ["organic", "healthy"],
        lat: 42.6923,
        lng: 23.3307,
        description: "Bio и organic храна, fresh соки"
      },
      {
        name: "Indian Palace",
        address: "ул. Позитано 20, София",
        cuisineTypes: ["indian", "curry"],
        lat: 42.6851,
        lng: 23.3176,
        description: "Индийска кухня с богат избор на vegetarian curry"
      },
      {
        name: "Falafel Box",
        address: "ул. Славянска 3, София",
        cuisineTypes: ["middle_eastern", "falafel"],
        lat: 42.6927,
        lng: 23.3303,
        description: "Близкоизточна кухня - фалафел и хумус"
      },
      {
        name: "Green Café",
        address: "бул. Евлоги Георгиев 77, София",
        cuisineTypes: ["cafe", "vegetarian"],
        lat: 42.6789,
        lng: 23.3345,
        description: "Уютно кафе с веган десерти и smoothies"
      },
      {
        name: "Pizza Lab",
        address: "ул. Шейново 7, София",
        cuisineTypes: ["pizza", "modern"],
        lat: 42.6924,
        lng: 23.3146,
        description: "Крафт пица с vegan cheese опции"
      },
      {
        name: "Bowl & Co",
        address: "ул. Алабин 50А, София",
        cuisineTypes: ["healthy", "bowls"],
        lat: 42.6972,
        lng: 23.3201,
        description: "Healthy bowls и superfood комбинации"
      },
      {
        name: "Thai Smile",
        address: "ул. Хан Аспарух 22, София",
        cuisineTypes: ["thai", "asian"],
        lat: 42.6859,
        lng: 23.3357,
        description: "Тайландска кухня с tofu специалитети"
      },
      {
        name: "Hummus Bar",
        address: "ул. Цар Иван Шишман 8, София",
        cuisineTypes: ["mediterranean", "lebanese"],
        lat: 42.6889,
        lng: 23.3306,
        description: "Средиземноморска кухня с домашен хумус"
      }
    ];

    // Extend array to 50 restaurants
    const allTestRestaurants = [...testRestaurants];
    
    // Generate 30 more restaurants with realistic names
    const additionalNames = [
      "Зелена Градина", "Слънчев Ъгъл", "Био Ресторант София", "Вегетариански Рай",
      "Ресторант Витамин", "Fresh & Tasty", "Nature's Kitchen", "Healthy Corner",
      "Veggie Paradise", "Plant Power", "София Грийн", "Еко Бистро", "Чиста Храна",
      "Зелен Свят", "Био Кухня", "Натурално", "Свежест", "Градински Ресторант",
      "Vegan House Sofia", "Raw Bar", "Juice & Salad", "Fresh Market", "Green Life",
      "София Органик", "Plant Bistro", "Veggie Grill", "Natural Foods", "Bio Corner",
      "Fresh Daily", "Healthy Choice"
    ];

    const streets = [
      "бул. Витоша", "ул. Граф Игнатиев", "бул. Васил Левски", "ул. Солунска",
      "ул. Раковски", "бул. България", "ул. Пиротска", "бул. Цар Освободител",
      "ул. Славянска", "бул. Патриарх Евтимий"
    ];

    const cuisineOptions = [
      ["healthy", "organic"], ["vegetarian", "salads"], ["cafe", "breakfast"],
      ["mediterranean", "greek"], ["asian", "vietnamese"], ["modern", "fusion"],
      ["bulgarian", "traditional"], ["italian", "pasta"], ["mexican", "burrito"],
      ["indian", "vegetarian"]
    ];

    for (let i = 0; i < 30; i++) {
      const streetNum = Math.floor(Math.random() * 200) + 1;
      const streetName = streets[Math.floor(Math.random() * streets.length)];
      
      allTestRestaurants.push({
        name: additionalNames[i] || `Ресторант София ${i + 21}`,
        address: `${streetName} ${streetNum}, София`,
        cuisineTypes: cuisineOptions[i % cuisineOptions.length],
        lat: 42.6977 + (Math.random() - 0.5) * 0.05,
        lng: 23.3219 + (Math.random() - 0.5) * 0.05,
        description: `${additionalNames[i] ? 'Специализиран в здравословна храна' : 'Модерен ресторант'} с веган опции`
      });
    }

    console.log(`📊 Processing ${allTestRestaurants.length} restaurants with Hybrid GBGPT/OpenAI...`);
    
    // Use HybridScoringProvider instead of direct GBGPT
    const hybrid = new HybridScoringProvider();
    const results: any[] = [];
    const failures: any[] = [];
    let processed = 0;

    // Process in batches of 5 to avoid overwhelming the API
    for (let i = 0; i < allTestRestaurants.length; i += 5) {
      const batch = allTestRestaurants.slice(i, i + 5);
      
      console.log(`🔄 Processing batch ${Math.floor(i/5) + 1}/${Math.ceil(allTestRestaurants.length/5)}`);
      
      const batchPromises = batch.map(async (restaurant, index) => {
        try {
          // Add small delay between requests in batch (500ms apart)
          await new Promise(resolve => setTimeout(resolve, index * 500));
          
          console.log(`🔄 Scoring: ${restaurant.name}`);
          const startTime = Date.now();
          
          const score = await hybrid.scoreRestaurant(restaurant);
          const duration = Date.now() - startTime;
          
          processed++;
          console.log(`✅ ${restaurant.name} scored in ${duration}ms (${processed}/${allTestRestaurants.length})`);
          
          return {
            restaurant,
            score,
            duration,
            success: true
          };
          
        } catch (error: any) {
          console.error(`❌ Failed to score ${restaurant.name}:`, error.message);
          processed++;
          
          return {
            restaurant,
            error: error.message,
            success: false
          };
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      
      batchResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          if (result.value.success) {
            results.push(result.value);
          } else {
            failures.push(result.value);
          }
        }
      });

      // Progress update
      const successRate = results.length > 0 ? ((results.length / processed) * 100).toFixed(1) : '0';
      console.log(`📊 Progress: ${processed}/${allTestRestaurants.length} (${successRate}% success rate)`);
      
      // Pause between batches (2 seconds) - shorter since we're using OpenAI fallback
      if (i + 5 < allTestRestaurants.length) {
        console.log('⏳ Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Calculate statistics
    const avgDuration = results.length > 0 
      ? results.reduce((sum, r) => sum + r.duration, 0) / results.length 
      : 0;
    const avgScore = results.length > 0
      ? results.reduce((sum, r) => sum + r.score.overallScore, 0) / results.length
      : 0;
    
    const stats = {
      totalProcessed: allTestRestaurants.length,
      successful: results.length,
      failed: failures.length,
      successRate: `${((results.length / allTestRestaurants.length) * 100).toFixed(1)}%`,
      averageResponseTime: `${avgDuration.toFixed(0)}ms`,
      averageVeganScore: avgScore.toFixed(2),
      primaryProvider: results.length > 0 ? results[0].score.provider : 'Unknown',
      timestamp: new Date().toISOString()
    };

    console.log('🎉 Bulk test completed!', stats);

    res.json({
      success: true,
      stats,
      results: results, // Return ALL results for import
      failures: failures.slice(0, 5),  // First 5 failures
      message: `Hybrid bulk test completed: ${results.length}/${allTestRestaurants.length} successful`
    });
    
  } catch (error: any) {
    console.error('❌ Bulk GBGPT test failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Bulk GBGPT test failed'
    });
  }
});

/**
 * Import successful results to database
 */
router.post('/import-gbgpt-results', async (req, res) => {
  try {
    const { results } = req.body;
    
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({ error: 'Results array required' });
    }

    console.log(`📤 Importing ${results.length} scored restaurants to database...`);
    
    const imported = [];
    const errors = [];
    
    for (const result of results) {
      try {
        const { restaurant, score } = result;
        
        // Prepare restaurant data for insertion
        const restaurantData = {
          name: restaurant.name,
          address: restaurant.address,
          cuisine_types: restaurant.cuisineTypes,
          latitude: restaurant.lat,
          longitude: restaurant.lng,
          place_id: `test-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          vegan_score: score.overallScore,
          price_level: 2, // Default medium price
          user_ratings_total: 0,
          rating: 0,
          opening_hours: null,
          website: null,
          phone_number: null,
          photos: [],
          reviews: [],
          cached_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // Insert restaurant with score
        const [insertedRestaurant] = await db.insert(restaurants).values([restaurantData]).returning();
        
        imported.push(insertedRestaurant);
        console.log(`✅ Imported: ${restaurant.name} (Score: ${score.overallScore})`);
        
      } catch (error: any) {
        console.error(`❌ Failed to import ${result.restaurant.name}:`, error.message);
        errors.push({
          restaurant: result.restaurant.name,
          error: error.message
        });
      }
    }

    const response = {
      success: true,
      imported: imported.length,
      failed: errors.length,
      message: `Successfully imported ${imported.length} restaurants`,
      errors: errors.length > 0 ? errors.slice(0, 5) : []
    };

    console.log('📊 Import summary:', response);
    res.json(response);
    
  } catch (error: any) {
    console.error('❌ Import failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Bulk import all 50 test restaurants at once
 */
router.post('/import-all-test-restaurants', async (req, res) => {
  try {
    console.log('🚀 Generating and importing 50 test restaurants directly...');
    
    // Generate the same 50 restaurants
    const testRestaurants = [
      {
        name: "Кафе-ресторант Космос",
        address: "ул. Витоша 45, София",
        cuisineTypes: ["cafe", "bulgarian"],
        lat: 42.6977,
        lng: 23.3219,
        description: "Традиционна българска кухня с модерен подход"
      },
      {
        name: "Пица Темпо",
        address: "бул. Васил Левски 132, София", 
        cuisineTypes: ["pizza", "italian"],
        lat: 42.6869,
        lng: 23.3228,
        description: "Италианска пицария с fresh ingredients"
      },
      {
        name: "Ресторант Made in Home",
        address: "ул. Оборище 42, София",
        cuisineTypes: ["modern_european", "healthy"],
        lat: 42.6886,
        lng: 23.3394,
        description: "Здравословна кухня с домашен вкус"
      },
      {
        name: "Ethno",
        address: "ул. Дякон Игнатий 4, София",
        cuisineTypes: ["traditional", "bulgarian"],
        lat: 42.6948,
        lng: 23.3227,
        description: "Автентична българска кухня в стилна обстановка"
      },
      {
        name: "Rainbow Factory",
        address: "ул. Цар Самуил 25, София",
        cuisineTypes: ["healthy", "vegetarian"],
        lat: 42.6953,
        lng: 23.3264,
        description: "Здравословни и vegetarian опции"
      },
      {
        name: "Salad Studio",
        address: "бул. Витоша 89, София",
        cuisineTypes: ["healthy", "salads"],
        lat: 42.6934,
        lng: 23.3197,
        description: "Fresh салати и здравословни ястия"
      },
      {
        name: "Bistro Pesto",
        address: "ул. Шишман 12, София",
        cuisineTypes: ["italian", "bistro"],
        lat: 42.6891,
        lng: 23.3312,
        description: "Италианско bistro с fresh pasta"
      },
      {
        name: "Green House",
        address: "ул. Граф Игнатиев 64, София",
        cuisineTypes: ["healthy", "organic"],
        lat: 42.6847,
        lng: 23.3254,
        description: "Органична храна и зелени smoothies"
      },
      {
        name: "Asia Garden",
        address: "бул. Черни връх 47, София",
        cuisineTypes: ["asian", "thai"],
        lat: 42.6712,
        lng: 23.3156,
        description: "Автентична азиатска кухня"
      },
      {
        name: "Vegetarian Delight",
        address: "ул. Раковски 95, София", 
        cuisineTypes: ["vegetarian", "vegan"],
        lat: 42.6923,
        lng: 23.3278,
        description: "100% vegetarian ресторант с vegan опции"
      },
      {
        name: "Суши Бар Мидори",
        address: "бул. България 69, София",
        cuisineTypes: ["japanese", "sushi"],
        lat: 42.6643,
        lng: 23.2870,
        description: "Автентично японско суши и веган rolls"
      },
      {
        name: "La Bamba",
        address: "ул. Гладстон 14, София",
        cuisineTypes: ["mexican", "tex_mex"],
        lat: 42.6939,
        lng: 23.3252,
        description: "Мексиканска кухня с растителни опции"
      },
      {
        name: "BioFresh",
        address: "ул. Солунска 44, София",
        cuisineTypes: ["organic", "healthy"],
        lat: 42.6923,
        lng: 23.3307,
        description: "Bio и organic храна, fresh соки"
      },
      {
        name: "Indian Palace",
        address: "ул. Позитано 20, София",
        cuisineTypes: ["indian", "curry"],
        lat: 42.6851,
        lng: 23.3176,
        description: "Индийска кухня с богат избор на vegetarian curry"
      },
      {
        name: "Falafel Box",
        address: "ул. Славянска 3, София",
        cuisineTypes: ["middle_eastern", "falafel"],
        lat: 42.6927,
        lng: 23.3303,
        description: "Близкоизточна кухня - фалафел и хумус"
      },
      {
        name: "Green Café",
        address: "бул. Евлоги Георгиев 77, София",
        cuisineTypes: ["cafe", "vegetarian"],
        lat: 42.6789,
        lng: 23.3345,
        description: "Уютно кафе с веган десерти и smoothies"
      },
      {
        name: "Pizza Lab",
        address: "ул. Шейново 7, София",
        cuisineTypes: ["pizza", "modern"],
        lat: 42.6924,
        lng: 23.3146,
        description: "Крафт пица с vegan cheese опции"
      },
      {
        name: "Bowl & Co",
        address: "ул. Алабин 50А, София",
        cuisineTypes: ["healthy", "bowls"],
        lat: 42.6972,
        lng: 23.3201,
        description: "Healthy bowls и superfood комбинации"
      },
      {
        name: "Thai Smile",
        address: "ул. Хан Аспарух 22, София",
        cuisineTypes: ["thai", "asian"],
        lat: 42.6859,
        lng: 23.3357,
        description: "Тайландска кухня с tofu специалитети"
      },
      {
        name: "Hummus Bar",
        address: "ул. Цар Иван Шишман 8, София",
        cuisineTypes: ["mediterranean", "lebanese"],
        lat: 42.6889,
        lng: 23.3306,
        description: "Средиземноморска кухня с домашен хумус"
      }
    ];

    // Extend array to 50 restaurants
    const allTestRestaurants = [...testRestaurants];
    
    // Generate 30 more restaurants with realistic names
    const additionalNames = [
      "Зелена Градина", "Слънчев Ъгъл", "Био Ресторант София", "Вегетариански Рай",
      "Ресторант Витамин", "Fresh & Tasty", "Nature's Kitchen", "Healthy Corner",
      "Veggie Paradise", "Plant Power", "София Грийн", "Еко Бистро", "Чиста Храна",
      "Зелен Свят", "Био Кухня", "Натурално", "Свежест", "Градински Ресторант",
      "Vegan House Sofia", "Raw Bar", "Juice & Salad", "Fresh Market", "Green Life",
      "София Органик", "Plant Bistro", "Veggie Grill", "Natural Foods", "Bio Corner",
      "Fresh Daily", "Healthy Choice"
    ];

    const streets = [
      "бул. Витоша", "ул. Граф Игнатиев", "бул. Васил Левски", "ул. Солунска",
      "ул. Раковски", "бул. България", "ул. Пиротска", "бул. Цар Освободител",
      "ул. Славянска", "бул. Патриарх Евтимий"
    ];

    const cuisineOptions = [
      ["healthy", "organic"], ["vegetarian", "salads"], ["cafe", "breakfast"],
      ["mediterranean", "greek"], ["asian", "vietnamese"], ["modern", "fusion"],
      ["bulgarian", "traditional"], ["italian", "pasta"], ["mexican", "burrito"],
      ["indian", "vegetarian"]
    ];

    for (let i = 0; i < 30; i++) {
      const streetNum = Math.floor(Math.random() * 200) + 1;
      const streetName = streets[Math.floor(Math.random() * streets.length)];
      
      allTestRestaurants.push({
        name: additionalNames[i] || `Ресторант София ${i + 21}`,
        address: `${streetName} ${streetNum}, София`,
        cuisineTypes: cuisineOptions[i % cuisineOptions.length],
        lat: 42.6977 + (Math.random() - 0.5) * 0.05,
        lng: 23.3219 + (Math.random() - 0.5) * 0.05,
        description: `${additionalNames[i] ? 'Специализиран в здравословна храна' : 'Модерен ресторант'} с веган опции`
      });
    }

    console.log(`📤 Importing ${allTestRestaurants.length} restaurants directly to database...`);
    
    const imported = [];
    const errors = [];
    
    // Score and import each restaurant
    const hybrid = new HybridScoringProvider();
    
    for (let i = 0; i < allTestRestaurants.length; i++) {
      const restaurant = allTestRestaurants[i];
      
      try {
        // Get AI score
        const score = await hybrid.scoreRestaurant(restaurant);
        
        // Prepare restaurant data for insertion
        const restaurantData = {
          name: restaurant.name,
          address: restaurant.address,
          cuisine_types: restaurant.cuisineTypes,
          latitude: restaurant.lat,
          longitude: restaurant.lng,
          place_id: `test-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          vegan_score: score.overallScore,
          price_level: 2, // Default medium price
          user_ratings_total: 0,
          rating: 0,
          opening_hours: null,
          website: null,
          phone_number: null,
          photos: [],
          reviews: [],
          cached_at: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        };
        
        // Insert restaurant with score
        const [insertedRestaurant] = await db.insert(restaurants).values([restaurantData]).returning();
        
        imported.push(insertedRestaurant);
        console.log(`✅ Imported ${i+1}/${allTestRestaurants.length}: ${restaurant.name} (Score: ${score.overallScore})`);
        
      } catch (error: any) {
        console.error(`❌ Failed to import ${restaurant.name}:`, error.message);
        errors.push({
          restaurant: restaurant.name,
          error: error.message
        });
      }
      
      // Small delay between imports
      if (i % 5 === 0 && i > 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    const response = {
      success: true,
      totalAttempted: allTestRestaurants.length,
      imported: imported.length,
      failed: errors.length,
      message: `Successfully imported ${imported.length} out of ${allTestRestaurants.length} restaurants`,
      errors: errors.slice(0, 5) // First 5 errors
    };

    console.log('🎉 Bulk import completed!', response);
    res.json(response);
    
  } catch (error: any) {
    console.error('❌ Bulk import failed:', error);
    
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * Get bulk test status
 */
router.get('/bulk-test-status', async (req, res) => {
  try {
    // Get current restaurant count
    const totalRestaurants = await db.select({ count: restaurants.id }).from(restaurants);
    
    // Get hybrid provider status
    const hybrid = new HybridScoringProvider();
    const providerStatus = await hybrid.getStatus();
    
    res.json({
      databaseRestaurants: totalRestaurants.length,
      providerStatus,
      ready: true,
      message: 'Bulk test endpoints ready'
    });
    
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;