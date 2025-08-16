// Improve all 0.0 score restaurants with enhanced algorithm
const { exec } = require('child_process');

const batchCommand = `
cd server && npx tsx -e "
import { db } from './db.ts';
import { restaurants } from '../shared/schema.ts';
import { eq } from 'drizzle-orm';
import { ScoreAgent } from './agents/scoreAgent.ts';

const scoreAgent = new ScoreAgent();

async function improveZeroScores() {
  const zeroRestaurants = await db.select().from(restaurants).where(eq(restaurants.veganScore, '0.00')).limit(15);
  console.log('Processing ' + zeroRestaurants.length + ' restaurants...');
  
  let improved = 0;
  for (const restaurant of zeroRestaurants) {
    try {
      console.log('Processing: ' + restaurant.name);
      const result = await scoreAgent.calculateVeganScore(restaurant.placeId, restaurant.name, restaurant.cuisineTypes || []);
      
      await db.update(restaurants).set({
        veganScore: result.overallScore.toFixed(2),
        veganScoreBreakdown: result.breakdown,
        updatedAt: new Date()
      }).where(eq(restaurants.id, restaurant.id));
      
      console.log('Updated: ' + restaurant.name + ' -> ' + result.overallScore + '/10');
      improved++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error('Failed: ' + restaurant.name);
    }
  }
  console.log('Improved: ' + improved + ' restaurants');
}

improveZeroScores().catch(console.error);
"
`;

exec(batchCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);
});