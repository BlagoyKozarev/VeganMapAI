import fetch from 'node-fetch';

const PRODUCTION_URL = 'https://vegan-map-ai-bkozarev.replit.app';

async function testAPI() {
  console.log('🧪 Testing VeganMapAI Production API');
  console.log('=====================================\n');

  try {
    // Test 1: Public map data endpoint
    console.log('📍 Test 1: Public Map Data');
    const mapResponse = await fetch(`${PRODUCTION_URL}/api/restaurants/public/map-data`);
    const mapData = await mapResponse.json();
    
    console.log('Response status:', mapResponse.status);
    console.log('Restaurant count:', mapData.count);
    console.log('Success:', mapData.success);
    
    if (mapData.count === 0) {
      console.log('\n❌ CRITICAL: API returns 0 restaurants!');
      console.log('\nTroubleshooting steps:');
      console.log('1. Go to Deployments tab');
      console.log('2. Click on your deployment');
      console.log('3. Look for "Logs" or "Console" section');
      console.log('4. Check for database connection errors');
      console.log('\nOr try:');
      console.log('1. In Environment Variables, remove DATABASE_URL');
      console.log('2. Save (deployment will fail)');
      console.log('3. Add DATABASE_URL back with correct value');
      console.log('4. Save again (this forces a fresh connection)');
    }
    
    // Test 2: Check if site is up
    console.log('\n📍 Test 2: Site Health Check');
    const homeResponse = await fetch(PRODUCTION_URL);
    console.log('Homepage status:', homeResponse.status);
    console.log('Site is:', homeResponse.status === 200 ? '✅ UP' : '❌ DOWN');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testAPI();