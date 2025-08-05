// Debug production API endpoint
const https = require('https');

console.log('🔍 Testing VeganMapAI Production API...\n');

const options = {
  hostname: 'vegan-map-ai-bkozarev.replit.app',
  path: '/api/restaurants/public/map-data',
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

const req = https.request(options, (res) => {
  console.log(`📡 Status Code: ${res.statusCode}`);
  console.log(`📋 Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log('\n✅ API Response:');
      console.log(`   Restaurant count: ${parsed.count || 0}`);
      console.log(`   Restaurants array length: ${parsed.restaurants ? parsed.restaurants.length : 0}`);
      
      if (parsed.restaurants && parsed.restaurants.length > 0) {
        console.log('\n📍 Sample restaurants:');
        parsed.restaurants.slice(0, 3).forEach(r => {
          console.log(`   - ${r.name} (${r.address})`);
        });
      } else {
        console.log('\n❌ No restaurants found in response!');
      }
    } catch (e) {
      console.log('\n❌ Error parsing response:', e.message);
      console.log('Raw response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error('❌ Request failed:', e.message);
});

req.end();