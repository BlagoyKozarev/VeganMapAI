#!/usr/bin/env tsx

// Verify production after redeploy

async function verifyProduction() {
  console.log('🔍 Production Verification After Redeploy');
  console.log('======================================\n');

  // 1. Check public API
  console.log('1️⃣ Checking Public API...');
  try {
    const response = await fetch('https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data');
    const data = await response.json();
    
    console.log(`   ✅ API Status: ${response.status}`);
    console.log(`   📊 Restaurants: ${data.count}`);
    console.log(`   💾 DB Connected: ${data.debug?.dbConnected}`);
    console.log(`   🌍 Environment: ${data.debug?.nodeEnv}`);
    
    if (data.count === 0 && data.debug?.dbConnected) {
      console.log('\n⚠️  WARNING: API returns 0 restaurants but DB is connected!');
      console.log('   This means the deployment is not reading from the correct database.');
    }
  } catch (error) {
    console.error('   ❌ API Error:', error);
  }

  // 2. Check home page
  console.log('\n2️⃣ Checking Home Page...');
  try {
    const response = await fetch('https://vegan-map-ai-bkozarev.replit.app');
    console.log(`   ✅ Home Page Status: ${response.status}`);
    const html = await response.text();
    console.log(`   📄 Page Size: ${(html.length / 1024).toFixed(1)} KB`);
    console.log(`   🎯 Title Found: ${html.includes('VeganMapAI')}`);
  } catch (error) {
    console.error('   ❌ Home Page Error:', error);
  }

  // 3. Solution
  console.log('\n💡 SOLUTION:');
  console.log('─────────────');
  console.log('The deployment is using a DIFFERENT database than development!');
  console.log('\nYou have 2 options:');
  console.log('\n📌 Option 1: Use the SAME database (Recommended for now)');
  console.log('   1. Go to Replit → Deployments → Your deployment');
  console.log('   2. Click "Settings" → "Environment Variables"');
  console.log('   3. Add/Update: DATABASE_URL = <copy from Secrets tab>');
  console.log('   4. Save and Redeploy');
  console.log('\n📌 Option 2: Import data to production database');
  console.log('   1. Find the production DATABASE_URL in deployment settings');
  console.log('   2. Run the import script with that URL');
  console.log('\n🎯 For quick fix, use Option 1!');
}

verifyProduction();