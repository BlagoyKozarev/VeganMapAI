// Quick deployment fix script
// This checks common deployment issues

import { db } from './server/db';

async function checkDeploymentIssues() {
  console.log('=== DEPLOYMENT ERROR CHECK ===\n');
  
  // 1. Check environment variables
  console.log('1. ENVIRONMENT VARIABLES:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
  console.log(`   PORT: ${process.env.PORT || '5000'}`);
  
  // 2. Test database connection
  console.log('\n2. DATABASE CONNECTION:');
  try {
    const count = await db.query.restaurants.findMany({
      limit: 1
    });
    console.log(`   ✅ Database connected (${count.length} test record)`);
  } catch (error: any) {
    console.log(`   ❌ Database error: ${error.message}`);
  }
  
  // 3. Check for common issues
  console.log('\n3. COMMON DEPLOYMENT ISSUES:');
  console.log('   • If DATABASE_URL is missing → Secrets not synced');
  console.log('   • If database connection fails → Production DB not configured');
  console.log('   • If port error → Port binding issue');
  
  console.log('\n=== SOLUTIONS ===');
  console.log('1. Go to Secrets (🔑 icon) and ensure DATABASE_URL is set');
  console.log('2. In Deployment settings, check "Environment Variables"');
  console.log('3. Try "Redeploy" again after fixing');
}

checkDeploymentIssues().catch(console.error);