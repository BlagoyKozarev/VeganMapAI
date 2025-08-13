
import { db } from './server/db';
import { restaurants } from './shared/schema';

async function loadSimpleRestaurants() {
  try {
    console.log('🔄 Loading simple restaurant data...');
    
    // Check current count
    const currentResult = await db.select().from(restaurants);
    console.log(`📊 Current restaurants in database: ${currentResult.length}`);
    
    // Clear existing data
    await db.delete(restaurants);
    console.log('🗑️ Cleared existing restaurants');
    
    // Create sample Sofia restaurants with correct data
    const sampleRestaurants = [
      {
        id: 'veggic-sofia-1',
        placeId: 'ChIJveggic1',
        name: 'Veggic',
        address: 'ул. Васил Априлов 20, София',
        city: 'София',
        latitude: 42.6977,
        longitude: 23.3219,
        phoneNumber: '+359 2 123 4567',
        website: null,
        rating: 4.8,
        reviewCount: 150,
        priceLevel: 2,
        cuisineTypes: ['Български', 'Веган'],
        veganScore: 9.2,
        isFullyVegan: true,
        isVerified: true,
        openingHours: JSON.stringify({
          "periods": [
            {"open": {"day": 1, "time": "0900"}, "close": {"day": 1, "time": "2200"}},
            {"open": {"day": 2, "time": "0900"}, "close": {"day": 2, "time": "2200"}},
            {"open": {"day": 3, "time": "0900"}, "close": {"day": 3, "time": "2200"}},
            {"open": {"day": 4, "time": "0900"}, "close": {"day": 4, "time": "2200"}},
            {"open": {"day": 5, "time": "0900"}, "close": {"day": 5, "time": "2200"}},
            {"open": {"day": 6, "time": "0900"}, "close": {"day": 6, "time": "2200"}}
          ]
        }),
        photos: [],
        geoHash: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'green-garden-sofia-2',
        placeId: 'ChIJgreen2',
        name: 'Green Garden',
        address: 'бул. Цар Освободител 15, София',
        city: 'София',
        latitude: 42.6965,
        longitude: 23.3238,
        phoneNumber: '+359 2 234 5678',
        website: null,
        rating: 4.5,
        reviewCount: 98,
        priceLevel: 2,
        cuisineTypes: ['Вегетарианска', 'Средиземноморска'],
        veganScore: 8.5,
        isFullyVegan: false,
        isVerified: true,
        openingHours: JSON.stringify({
          "periods": [
            {"open": {"day": 1, "time": "1000"}, "close": {"day": 1, "time": "2300"}},
            {"open": {"day": 2, "time": "1000"}, "close": {"day": 2, "time": "2300"}},
            {"open": {"day": 3, "time": "1000"}, "close": {"day": 3, "time": "2300"}},
            {"open": {"day": 4, "time": "1000"}, "close": {"day": 4, "time": "2300"}},
            {"open": {"day": 5, "time": "1000"}, "close": {"day": 5, "time": "2300"}},
            {"open": {"day": 6, "time": "1000"}, "close": {"day": 6, "time": "2300"}}
          ]
        }),
        photos: [],
        geoHash: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'plant-paradise-sofia-3',
        placeId: 'ChIJplant3',
        name: 'Plant Paradise',
        address: 'ул. Граф Игнатиев 5, София',
        city: 'София',
        latitude: 42.6934,
        longitude: 23.3275,
        phoneNumber: '+359 2 345 6789',
        website: null,
        rating: 4.7,
        reviewCount: 210,
        priceLevel: 3,
        cuisineTypes: ['Веган', 'Raw храни'],
        veganScore: 9.0,
        isFullyVegan: true,
        isVerified: true,
        openingHours: JSON.stringify({
          "periods": [
            {"open": {"day": 1, "time": "0800"}, "close": {"day": 1, "time": "2200"}},
            {"open": {"day": 2, "time": "0800"}, "close": {"day": 2, "time": "2200"}},
            {"open": {"day": 3, "time": "0800"}, "close": {"day": 3, "time": "2200"}},
            {"open": {"day": 4, "time": "0800"}, "close": {"day": 4, "time": "2200"}},
            {"open": {"day": 5, "time": "0800"}, "close": {"day": 5, "time": "2200"}},
            {"open": {"day": 6, "time": "0800"}, "close": {"day": 6, "time": "2200"}}
          ]
        }),
        photos: [],
        geoHash: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'loving-hut-sofia-4',
        placeId: 'ChIJloving4',
        name: 'Loving Hut Sofia',
        address: 'ул. Георги С. Раковски 113, София',
        city: 'София',
        latitude: 42.6979,
        longitude: 23.3300,
        phoneNumber: '+359 2 456 7890',
        website: null,
        rating: 4.6,
        reviewCount: 185,
        priceLevel: 2,
        cuisineTypes: ['Веган', 'Азиатска'],
        veganScore: 9.5,
        isFullyVegan: true,
        isVerified: true,
        openingHours: JSON.stringify({
          "periods": [
            {"open": {"day": 1, "time": "1100"}, "close": {"day": 1, "time": "2200"}},
            {"open": {"day": 2, "time": "1100"}, "close": {"day": 2, "time": "2200"}},
            {"open": {"day": 3, "time": "1100"}, "close": {"day": 3, "time": "2200"}},
            {"open": {"day": 4, "time": "1100"}, "close": {"day": 4, "time": "2200"}},
            {"open": {"day": 5, "time": "1100"}, "close": {"day": 5, "time": "2200"}},
            {"open": {"day": 6, "time": "1100"}, "close": {"day": 6, "time": "2200"}}
          ]
        }),
        photos: [],
        geoHash: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'edgy-veggy-sofia-5',
        placeId: 'ChIJedgy5',
        name: 'Edgy Veggy',
        address: 'ул. Княз Борис I 18Б, София',
        city: 'София',
        latitude: 42.6945,
        longitude: 23.3180,
        phoneNumber: '+359 2 567 8901',
        website: null,
        rating: 4.4,
        reviewCount: 92,
        priceLevel: 2,
        cuisineTypes: ['Веган', 'Модерна'],
        veganScore: 8.8,
        isFullyVegan: true,
        isVerified: true,
        openingHours: JSON.stringify({
          "periods": [
            {"open": {"day": 1, "time": "0900"}, "close": {"day": 1, "time": "2100"}},
            {"open": {"day": 2, "time": "0900"}, "close": {"day": 2, "time": "2100"}},
            {"open": {"day": 3, "time": "0900"}, "close": {"day": 3, "time": "2100"}},
            {"open": {"day": 4, "time": "0900"}, "close": {"day": 4, "time": "2100"}},
            {"open": {"day": 5, "time": "0900"}, "close": {"day": 5, "time": "2100"}},
            {"open": {"day": 6, "time": "0900"}, "close": {"day": 6, "time": "2100"}}
          ]
        }),
        photos: [],
        geoHash: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
    
    // Insert restaurants
    await db.insert(restaurants).values(sampleRestaurants);
    console.log(`✅ Inserted ${sampleRestaurants.length} sample restaurants`);
    
    // Verify
    const finalResult = await db.select().from(restaurants);
    console.log(`🎉 Success! Database now has ${finalResult.length} restaurants`);
    
    return finalResult;
    
  } catch (error) {
    console.error('❌ Error loading restaurants:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  loadSimpleRestaurants()
    .then(() => {
      console.log('✅ Simple restaurants loaded successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to load restaurants:', error);
      process.exit(1);
    });
}

export { loadSimpleRestaurants };
