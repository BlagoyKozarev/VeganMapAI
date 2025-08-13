import https from 'https';

console.log('🔍 Debugging VeganMapAI Production API');
console.log('=====================================\n');

// Test public endpoint
const url = 'https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data';

https.get(url, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('📡 API Response Status:', res.statusCode);
    console.log('📋 Response Headers:', res.headers);
    
    try {
      const json = JSON.parse(data);
      console.log('\n📊 Response Data:');
      console.log('- Success:', json.success);
      console.log('- Restaurant Count:', json.count);
      console.log('- Public Access:', json.public);
      
      if (json.count === 0) {
        console.log('\n⚠️  WARNING: API returns 0 restaurants!');
        console.log('Possible causes:');
        console.log('1. Deployment not using production DATABASE_URL');
        console.log('2. Database connection issue');
        console.log('3. Storage implementation issue');
      } else {
        console.log('\n✅ SUCCESS: API returns', json.count, 'restaurants!');
      }
    } catch (e) {
      console.error('❌ Failed to parse response:', e);
      console.log('Raw response:', data);
    }
  });
}).on('error', (e) => {
  console.error('❌ Request failed:', e);
});