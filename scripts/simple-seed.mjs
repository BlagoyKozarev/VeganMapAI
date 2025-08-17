import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

const generateSofiaRestaurants = () => {
  const sofiaCenter = { lat: 42.6977, lng: 23.3219 };
  const restaurants = [];
  
  // Base restaurants with good data
  const baseNames = [
    'Green Cat Vegan', 'Soul Kitchen Sofia', 'Veda House', 'Rainbow Factory',
    'Sunflower Café', 'Plant Power', 'Loving Hut', 'Veggie Delight',
    'Pure Food', 'Garden Bistro', 'Fresh & Wild', 'Green Heart',
    'Bloom Restaurant', 'Herbivore Hub', 'Natural Kitchen', 'Zen Garden'
  ];
  
  // Generate restaurants in Sofia area
  for (let i = 0; i < 200; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * 0.08; // ~9km radius
    
    const lat = sofiaCenter.lat + (distance * Math.cos(angle));
    const lng = sofiaCenter.lng + (distance * Math.sin(angle));
    
    const baseName = baseNames[i % baseNames.length];
    const suffix = i > 15 ? ` ${Math.floor(i/16) + 1}` : '';
    
    restaurants.push({
      id: `sofia_restaurant_${i + 1}`,
      name: `${baseName}${suffix}`,
      latitude: lat.toFixed(8),
      longitude: lng.toFixed(8),
      address: `Street ${i + 1}, Sofia`,
      phone: `+359 2 ${String(Math.floor(Math.random() * 900000) + 100000)}`,
      website: `https://${baseName.toLowerCase().replace(/[^a-z]/g, '')}.bg`,
      cuisine_types: JSON.stringify(['Vegan', 'Healthy', 'Bulgarian'][Math.floor(Math.random() * 3)]),
      price_level: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
      vegan_score: (Math.random() * 8 + 2).toFixed(1), // 2-10 range
      rating: (Math.random() * 2 + 3).toFixed(1), // 3-5 range
      is_fully_vegan: Math.random() > 0.3, // 70% fully vegan
      photo_urls: JSON.stringify([])
    });
  }
  
  return restaurants;
};

async function seed() {
  try {
    console.log('Generating Sofia restaurants...');
    const restaurants = generateSofiaRestaurants();
    
    console.log(`Inserting ${restaurants.length} restaurants...`);
    
    let inserted = 0;
    for (const restaurant of restaurants) {
      try {
        await pool.query(`
          INSERT INTO restaurants (
            id, name, latitude, longitude, address, phone, website,
            cuisine_types, price_level, vegan_score, rating, 
            is_fully_vegan, photo_urls
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO NOTHING
        `, [
          restaurant.id,
          restaurant.name,
          restaurant.latitude,
          restaurant.longitude,
          restaurant.address,
          restaurant.phone,
          restaurant.website,
          restaurant.cuisine_types,
          restaurant.price_level,
          restaurant.vegan_score,
          restaurant.rating,
          restaurant.is_fully_vegan,
          restaurant.photo_urls
        ]);
        inserted++;
        
        if (inserted % 50 === 0) {
          console.log(`Inserted ${inserted} restaurants...`);
        }
      } catch (error) {
        console.warn(`Failed to insert ${restaurant.id}:`, error.message);
      }
    }
    
    // Final count
    const countResult = await pool.query('SELECT COUNT(*) as count FROM restaurants');
    const finalCount = parseInt(countResult.rows[0].count);
    
    console.log(`Seed complete! Total restaurants: ${finalCount}`);
    return finalCount;
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

seed().then(() => process.exit(0)).catch(() => process.exit(1));