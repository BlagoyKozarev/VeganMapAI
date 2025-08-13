
import { db } from './db';
import { restaurants } from '../shared/schema';

const sampleRestaurants = [
  {
    id: 'rest_1',
    name: 'Veggic',
    address: 'ул. Васил Априлов 20, София',
    latitude: '42.6977',
    longitude: '23.3219',
    city: 'София',
    country: 'България',
    cuisineTypes: ['Български', 'Веган'],
    priceLevel: '$$',
    veganScore: '9.2',
    isFullyVegan: true,
    rating: '4.5'
  },
  {
    id: 'rest_2',
    name: 'Rainbow Factory',
    address: 'ул. Оборище 18, София',
    latitude: '42.6844',
    longitude: '23.3258',
    city: 'София',
    country: 'България',
    cuisineTypes: ['Международна', 'Веган'],
    priceLevel: '$',
    veganScore: '8.8',
    isFullyVegan: true,
    rating: '4.3'
  },
  {
    id: 'rest_3',
    name: 'Soul Kitchen',
    address: 'ул. Шишман 18, София',
    latitude: '42.6969',
    longitude: '23.3203',
    city: 'София',
    country: 'България',
    cuisineTypes: ['Международна', 'Здравословна'],
    priceLevel: '$$',
    veganScore: '7.5',
    isFullyVegan: false,
    rating: '4.1'
  },
  {
    id: 'rest_4',
    name: 'Green House',
    address: 'бул. Витоша 85, София',
    latitude: '42.7038',
    longitude: '23.3237',
    city: 'София',
    country: 'България',
    cuisineTypes: ['Италианска', 'Веган опции'],
    priceLevel: '$$$',
    veganScore: '6.8',
    isFullyVegan: false,
    rating: '4.0'
  },
  {
    id: 'rest_5',
    name: 'Healthy Corner',
    address: 'ул. Граф Игнатиев 15, София',
    latitude: '42.6990',
    longitude: '23.3324',
    city: 'София',
    country: 'България',
    cuisineTypes: ['Здравословна', 'Сурова храна'],
    priceLevel: '$$',
    veganScore: '8.5',
    isFullyVegan: true,
    rating: '4.4'
  }
];

export async function seedRestaurants() {
  try {
    console.log('🌱 Seeding restaurants...');
    
    // Clear existing data
    await db.delete(restaurants);
    
    // Insert sample restaurants
    await db.insert(restaurants).values(sampleRestaurants);
    
    console.log(`✅ Successfully seeded ${sampleRestaurants.length} restaurants`);
  } catch (error) {
    console.error('❌ Error seeding restaurants:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedRestaurants()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
