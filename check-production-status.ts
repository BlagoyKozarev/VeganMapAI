// Check production deployment status
import https from 'https';

console.log('🔍 Checking VeganMapAI Production Status...\n');

// Test production API
const testEndpoint = (path: string, description: string) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'vegan-map-ai-bkozarev.replit.app',
      path: path,
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`${description}:`);
        console.log(`  Status: ${res.statusCode}`);
        
        try {
          const json = JSON.parse(data);
          if (path.includes('map-data')) {
            console.log(`  Restaurants: ${json.count || 0}`);
            console.log(`  Array length: ${json.restaurants?.length || 0}`);
            if (json.restaurants?.length > 0) {
              console.log(`  First restaurant: ${json.restaurants[0].name}`);
            }
          }
          console.log(`  Success: ${json.success || false}`);
        } catch (e) {
          console.log(`  Response: ${data.substring(0, 100)}...`);
        }
        console.log('');
        resolve(null);
      });
    });

    req.on('error', (e) => {
      console.log(`${description}: ❌ Failed - ${e.message}\n`);
      resolve(null);
    });

    req.end();
  });
};

async function checkAll() {
  await testEndpoint('/api/restaurants/public/map-data', '📍 Public Map Data');
  await testEndpoint('/api/health', '🏥 Health Check');
  await testEndpoint('/', '🏠 Home Page');
  
  console.log('\n📝 Summary:');
  console.log('If map-data shows 0 restaurants, the production database is empty.');
  console.log('If it shows 408 restaurants, check the frontend for issues.');
}

checkAll();