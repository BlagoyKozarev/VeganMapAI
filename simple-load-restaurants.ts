
import { db } from './server/db';
import { restaurants } from './shared/schema';
import fs from 'fs';

async function loadRestaurants() {
  try {
    console.log('🔄 Loading restaurants...');
    
    // Check current count
    const currentResult = await db.select().from(restaurants);
    console.log(`📊 Current restaurants in database: ${currentResult.length}`);
    
    if (currentResult.length > 100) {
      console.log('✅ Database already has restaurants loaded');
      return;
    }
    
    // Try to read restaurants-export.json first
    let restaurantsData = [];
    
    try {
      const exportData = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
      console.log(`📂 Found ${exportData.length} restaurants in export file`);
      restaurantsData = exportData;
    } catch (error) {
      console.log('❌ Could not read restaurants-export.json:', error.message);
      
      // Fallback to places.json
      try {
        const placesData = JSON.parse(fs.readFileSync('public/assets/data/places.json', 'utf-8'));
        console.log(`📂 Found ${placesData.length} places in local JSON`);
        restaurantsData = placesData;
      } catch (error2) {
        console.log('❌ Could not read places.json either:', error2.message);
      }
    }
    
    // If we have no data, create some sample restaurants
    if (restaurantsData.length === 0) {
      console.log('📝 Creating sample restaurants for Sofia...');
      restaurantsData = [
        {
          id: 'rest_1',
          name: 'Vegan Heaven',
          address: 'ул. Витоша 1, София',
          lat: 42.6977,
          lng: 23.3219,
          place_id: 'ChIJvegan1',
          vegan_score: 9.5,
          vegan_full: true,
          cuisines: ['vegan', 'healthy'],
          rating: 4.8,
          price: 2
        },
        {
          id: 'rest_2', 
          name: 'Green Garden',
          address: 'бул. Цар Освободител 15, София',
          lat: 42.6965,
          lng: 23.3238,
          place_id: 'ChIJvegan2',
          vegan_score: 8.5,
          vegan_full: false,
          cuisines: ['vegetarian', 'mediterranean'],
          rating: 4.5,
          price: 2
        },
        {
          id: 'rest_3',
          name: 'Plant Paradise',
          address: 'ул. Граф Игнатиев 5, София',
          lat: 42.6934,
          lng: 23.3275,
          place_id: 'ChIJvegan3',
          vegan_score: 9.0,
          vegan_full: true,
          cuisines: ['vegan', 'raw'],
          rating: 4.7,
          price: 3
        }
      ];
    }
    
    console.log(`🔄 Processing ${restaurantsData.length} restaurants...`);
    
    // Clear existing and insert new
    await db.delete(restaurants);
    
    const processedRestaurants = restaurantsData.map((r, index) => ({
      id: r.id || `rest_${index + 1}`,
      placeId: r.place_id || r.placeId || `place_${index + 1}`,
      name: r.name || `Restaurant ${index + 1}`,
      address: r.address || 'София, България',
      city: 'София',
      latitude: parseFloat((r.lat || r.latitude || '42.6977').toString()),
      longitude: parseFloat((r.lng || r.longitude || '23.3219').toString()),
      phoneNumber: r.phone_number || r.phoneNumber || null,
      website: r.website || null,
      rating: r.rating ? parseFloat(r.rating.toString()) : 4.5,
      reviewCount: r.review_count || r.reviewCount || 100,
      priceLevel: r.price || r.priceLevel || r.price_level || 2,
      cuisineTypes: Array.isArray(r.cuisines) ? r.cuisines : 
                   Array.isArray(r.cuisineTypes) ? r.cuisineTypes : 
                   Array.isArray(r.cuisine_types) ? r.cuisine_types : ['restaurant'],
      veganScore: r.vegan_score || r.veganScore ? 
                 parseFloat((r.vegan_score || r.veganScore).toString()) : 
                 Math.floor(Math.random() * 5) + 5, // Random score 5-10
      isFullyVegan: r.vegan_full || r.isFullyVegan || r.is_fully_vegan || false,
      isVerified: r.isVerified || r.is_verified || false,
      openingHours: r.opening_hours || r.openingHours || null,
      photos: Array.isArray(r.photos) ? r.photos : [],
      geoHash: r.geo_hash || r.geoHash || null,
      createdAt: new Date(),
      updatedAt: new Date()
    }));
    
    // Insert in batches
    const batchSize = 10;
    for (let i = 0; i < processedRestaurants.length; i += batchSize) {
      const batch = processedRestaurants.slice(i, i + batchSize);
      await db.insert(restaurants).values(batch);
      console.log(`✅ Inserted batch ${Math.ceil((i + 1) / batchSize)} (${batch.length} restaurants)`);
    }
    
    // Verify
    const finalResult = await db.select().from(restaurants);
    console.log(`🎉 Success! Database now has ${finalResult.length} restaurants`);
    
  } catch (error) {
    console.error('❌ Error loading restaurants:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  loadRestaurants()
    .then(() => {
      console.log('✅ Restaurants loaded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to load restaurants:', error);
      process.exit(1);
    });
}

export { loadRestaurants };
