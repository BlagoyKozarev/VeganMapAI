import https from 'https';

async function checkDeployment() {
  console.log('🔍 Checking VeganMapAI Deployment Status');
  console.log('=====================================\n');
  
  // Check multiple times with delay
  for (let i = 0; i < 5; i++) {
    console.log(`\n📊 Check #${i + 1} at ${new Date().toLocaleTimeString()}`);
    
    await new Promise((resolve) => {
      https.get('https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data', (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            console.log(`- Status: ${res.statusCode}`);
            console.log(`- Restaurant count: ${json.count}`);
            console.log(`- Deployment ID: ${res.headers['x-replit-deployment-id'] || 'not available'}`);
            
            if (json.count > 0) {
              console.log('\n✅ SUCCESS! Deployment is now serving restaurants!');
              process.exit(0);
            }
          } catch (e) {
            console.error('Parse error:', e);
          }
          resolve(null);
        });
      }).on('error', (e) => {
        console.error('Request error:', e);
        resolve(null);
      });
    });
    
    if (i < 4) {
      console.log('Waiting 15 seconds before next check...');
      await new Promise(resolve => setTimeout(resolve, 15000));
    }
  }
  
  console.log('\n❌ Still returning 0 restaurants after multiple checks.');
  console.log('\nPOSSIBLE ISSUES:');
  console.log('1. Deployment is using cached code');
  console.log('2. DATABASE_URL is not being read in production');
  console.log('3. Production build has different behavior');
}

checkDeployment();