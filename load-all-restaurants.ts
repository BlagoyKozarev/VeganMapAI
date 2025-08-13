
import { db } from './server/db';
import { restaurants, veganScoreBreakdown } from './shared/schema';
import fs from 'fs';

async function loadAllRestaurants() {
  try {
    console.log('📥 Loading all restaurants from JSON export...');
    
    // Check current count
    const currentResult = await db.select().from(restaurants);
    console.log(`📊 Current restaurants in database: ${currentResult.length}`);
    
    // Read the export file
    const exportData = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
    console.log(`📂 Found ${exportData.restaurants?.length || exportData.length} restaurants in export file`);
    
    const restaurantsData = exportData.restaurants || exportData;
    
    if (!Array.isArray(restaurantsData)) {
      throw new Error('Invalid export data format');
    }
    
    // Clear existing data
    console.log('🗑️ Clearing existing restaurants...');
    await db.delete(restaurants);
    
    // Process in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < restaurantsData.length; i += batchSize) {
      const batch = restaurantsData.slice(i, i + batchSize);
      
      const processedBatch = batch.map(r => ({
        id: r.id,
        placeId: r.placeId || r.place_id,
        name: r.name,
        address: r.address,
        latitude: parseFloat(r.latitude?.toString() || '0'),
        longitude: parseFloat(r.longitude?.toString() || '0'),
        phoneNumber: r.phoneNumber || r.phone_number || null,
        website: r.website || null,
        rating: r.rating ? parseFloat(r.rating.toString()) : null,
        reviewCount: r.reviewCount || r.review_count || null,
        priceLevel: r.priceLevel || r.price_level || null,
        cuisineTypes: Array.isArray(r.cuisineTypes) ? r.cuisineTypes : 
                     Array.isArray(r.cuisine_types) ? r.cuisine_types : [],
        veganScore: r.veganScore || r.vegan_score ? 
                   parseFloat((r.veganScore || r.vegan_score).toString()) : 0,
        isFullyVegan: r.isFullyVegan || r.is_fully_vegan || false,
        isVerified: r.isVerified || r.is_verified || false,
        openingHours: r.openingHours || r.opening_hours || null,
        photos: Array.isArray(r.photos) ? r.photos : [],
        geoHash: r.geoHash || r.geo_hash || null,
        createdAt: r.createdAt || r.created_at || new Date(),
        updatedAt: r.updatedAt || r.updated_at || new Date()
      }));
      
      await db.insert(restaurants).values(processedBatch);
      imported += processedBatch.length;
      
      console.log(`✅ Imported batch ${Math.ceil((i + 1) / batchSize)} - Total: ${imported}/${restaurantsData.length}`);
    }
    
    // Verify import
    const finalResult = await db.select().from(restaurants);
    console.log(`🎉 Import complete! Database now has ${finalResult.length} restaurants`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  loadAllRestaurants()
    .then(() => {
      console.log('✅ All restaurants loaded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to load restaurants:', error);
      process.exit(1);
    });
}

export { loadAllRestaurants };
