import { db } from '../server/db';
import { restaurants } from '../shared/schema';
import * as fs from 'fs';

async function massiveSeed() {
  try {
    console.log('Starting massive seed...');
    
    // Read GeoJSON file
    const geojsonPath = './backend/geojson/sofia.geojson';
    const geojsonData = JSON.parse(fs.readFileSync(geojsonPath, 'utf8'));
    
    const restaurantsToInsert = geojsonData.features.map((feature: any, index: number) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates; // [lng, lat]
      
      return {
        id: props.id || `sofia_${index + 1}`,
        name: props.name || `Restaurant ${index + 1}`,
        latitude: String(coords[1]), // lat is second
        longitude: String(coords[0]), // lng is first
        address: props.address || '',
        city: 'Sofia',
        country: 'Bulgaria',
        cuisineTypes: [props.cuisine || 'International'],
        priceLevel: props.price || '$',
        veganScore: String(props.vegan_score || Math.random() * 10),
        rating: String(Math.random() * 5 + 1),
        isFullyVegan: props.vegan_score >= 8,
        photoUrls: []
      };
    });
    
    console.log(`Preparing to insert ${restaurantsToInsert.length} restaurants...`);
    
    // Insert in batches
    const batchSize = 50;
    let inserted = 0;
    
    for (let i = 0; i < restaurantsToInsert.length; i += batchSize) {
      const batch = restaurantsToInsert.slice(i, i + batchSize);
      
      try {
        await db.insert(restaurants).values(batch).onConflictDoNothing();
        inserted += batch.length;
        console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}, total: ${inserted}`);
      } catch (error: any) {
        console.warn(`Batch ${Math.floor(i/batchSize) + 1} failed:`, error.message);
      }
    }
    
    // Final count
    const finalCount = await db.$count(restaurants);
    console.log(`Massive seed complete! Total restaurants in DB: ${finalCount}`);
    
    return finalCount;
  } catch (error) {
    console.error('Massive seed failed:', error);
    throw error;
  }
}

massiveSeed().then(() => process.exit(0)).catch(() => process.exit(1));