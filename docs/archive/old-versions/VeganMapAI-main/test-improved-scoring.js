// Test improved scoring algorithm
const { scoreRestaurant } = require('./server/agents/scoreAgent.ts');

const testRestaurants = [
  {
    name: 'Ресторант - Басейн "Синьо лято"',
    cuisine_types: ["food","restaurant","establishment","point_of_interest"]
  },
  {
    name: 'Ресторант "Ламар"',
    cuisine_types: ["establishment","point_of_interest","food","restaurant"]
  },
  {
    name: 'Hemingway Restaurant',
    cuisine_types: ["point_of_interest","restaurant","establishment","food"]
  },
  {
    name: 'Wood-Lark Pub',
    cuisine_types: ["food","restaurant","establishment","point_of_interest","bar"]
  },
  {
    name: 'Katrin - Irena Draganova',
    cuisine_types: ["point_of_interest","establishment","restaurant","food"]
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

testScoring();