import { readFileSync } from 'fs';
import pg from 'pg';

const { Pool } = pg;

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function seedFromGeoJSON() {
  try {
    console.log('Reading GeoJSON file...');
    const geojsonData = JSON.parse(readFileSync('./backend/geojson/sofia.geojson', 'utf8'));
    
    console.log(`Found ${geojsonData.features.length} features in GeoJSON`);
    
    // Generate more restaurants around Sofia
    const baseRestaurants = geojsonData.features;
    const expandedRestaurants = [];
    
    // Add original restaurants
    baseRestaurants.forEach((feature, index) => {
      const props = feature.properties;
      const coords = feature.geometry.coordinates; // [lng, lat]
      
      expandedRestaurants.push({
        id: props.id || `sofia_${index + 1}`,
        name: props.name || `Restaurant ${index + 1}`,
        latitude: coords[1], // lat is second
        longitude: coords[0], // lng is first
        address: props.address || '',
        city: 'Sofia',
        country: 'Bulgaria',
        cuisine_types: [props.cuisine || 'International'],
        price_level: props.price || '$',
        vegan_score: props.vegan_score || Math.random() * 10,
        rating: Math.random() * 5 + 1,
        is_fully_vegan: props.vegan_score >= 8,
        photo_urls: []
      });
    });
    
    // Generate variations around Sofia (expand dataset)
    const sofiaCenter = { lat: 42.6977, lng: 23.3219 };
    const radius = 0.1; // ~11km radius
    
    for (let i = 0; i < 100; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radius;
      
      const lat = sofiaCenter.lat + (distance * Math.cos(angle));
      const lng = sofiaCenter.lng + (distance * Math.sin(angle));
      
      expandedRestaurants.push({
        id: `generated_${i + 1}`,
        name: `Vegan Spot ${i + 1}`,
        latitude: lat,
        longitude: lng,
        address: `Address ${i + 1}, Sofia`,
        city: 'Sofia',
        country: 'Bulgaria',
        cuisine_types: ['Vegan', 'Healthy'],
        price_level: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
        vegan_score: Math.random() * 10,
        rating: Math.random() * 5 + 1,
        is_fully_vegan: Math.random() > 0.5,
        photo_urls: []
      });
    }
    
    console.log(`Generated ${expandedRestaurants.length} total restaurants`);
    
    // Insert restaurants
    let inserted = 0;
    for (const restaurant of expandedRestaurants) {
      try {
        await pool.query(`
          INSERT INTO restaurants (
            id, name, latitude, longitude, address, city, country,
            cuisine_types, price_level, vegan_score, rating, 
            is_fully_vegan, photo_urls
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING
        `, [
          restaurant.id,
          restaurant.name,
          restaurant.latitude.toString(),
          restaurant.longitude.toString(),
          restaurant.address,
          restaurant.city,
          restaurant.country,
          restaurant.cuisine_types,
          restaurant.price_level,
          restaurant.vegan_score.toString(),
          restaurant.rating.toString(),
          restaurant.is_fully_vegan,
          restaurant.photo_urls
        ]);
        inserted++;
        if (inserted % 20 === 0) {
          console.log(`Inserted ${inserted} restaurants...`);
        }
      } catch (error) {
        console.warn(`Failed to insert ${restaurant.id}:`, error.message);
      }
    }
    
    // Check final count
    const countResult = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    const finalCount = parseInt(countResult.rows[0].count);
    
    console.log(`Seed complete! Total restaurants in DB: ${finalCount}`);
    
    return finalCount;
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seedFromGeoJSON().then(() => process.exit(0)).catch(() => process.exit(1));