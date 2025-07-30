// Test improved scoring algorithm
import { scoreRestaurant } from './server/agents/scoreAgent';

const testRestaurants = [
  {
    name: 'Ресторант - Басейн "Синьо лято"',
    cuisineTypes: ["food","restaurant","establishment","point_of_interest"],
    placeId: 'test-1',
    address: 'Sofia, Bulgaria',
    latitude: '42.7',
    longitude: '23.3'
  },
  {
    name: 'Ресторант "Ламар"',
    cuisineTypes: ["establishment","point_of_interest","food","restaurant"],
    placeId: 'test-2',
    address: 'Sofia, Bulgaria',
    latitude: '42.7',
    longitude: '23.3'
  },
  {
    name: 'Hemingway Restaurant',
    cuisineTypes: ["point_of_interest","restaurant","establishment","food"],
    placeId: 'test-3',
    address: 'Sofia, Bulgaria',
    latitude: '42.7',
    longitude: '23.3'
  },
  {
    name: 'Wood-Lark Pub',
    cuisineTypes: ["food","restaurant","establishment","point_of_interest","bar"],
    placeId: 'test-4',
    address: 'Sofia, Bulgaria',
    latitude: '42.7',
    longitude: '23.3'
  },
  {
    name: 'Katrin - Irena Draganova',
    cuisineTypes: ["point_of_interest","establishment","restaurant","food"],
    placeId: 'test-5',
    address: 'Sofia, Bulgaria',
    latitude: '42.7',
    longitude: '23.3'
  }
];

async function testScoring() {
  console.log('Testing improved scoring algorithm...');
  
  for (const restaurant of testRestaurants) {
    try {
      console.log(`\nTesting: ${restaurant.name}`);
      const result = await scoreRestaurant(restaurant);
      console.log(`New score: ${result.veganScore}/10`);
      console.log(`Breakdown:`, result.breakdown);
    } catch (error) {
      console.error(`Error scoring ${restaurant.name}:`, error.message);
    }
  }
}

// Export for testing
export { testScoring };

if (require.main === module) {
  testScoring();
}