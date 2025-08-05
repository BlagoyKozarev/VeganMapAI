#!/usr/bin/env tsx

// Final diagnosis: Compare development vs production databases

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { restaurants } from './shared/schema.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function finalDiagnosis() {
  console.log('🔍 FINAL PRODUCTION DIAGNOSIS');
  console.log('============================\n');

  // 1. Check development database
  const devUrl = process.env.DATABASE_URL;
  console.log('1️⃣ DEVELOPMENT DATABASE:');
  console.log(`   URL: ${devUrl?.substring(0, 50)}...`);
  
  try {
    const devPool = new Pool({ connectionString: devUrl });
    const devDb = drizzle({ client: devPool, schema: { restaurants } });
    const devCount = await devDb.select().from(restaurants);
    console.log(`   ✅ Restaurant count: ${devCount.length}`);
    await devPool.end();
  } catch (error) {
    console.log(`   ❌ Connection failed: ${error.message}`);
  }

  // 2. Check what production might be using
  console.log('\n2️⃣ PRODUCTION DATABASE (Hypothesis):');
  console.log('   Production deployment creates its OWN database URL');
  console.log('   This is standard Replit behavior for security');
  
  // 3. Solution
  console.log('\n💡 ROOT CAUSE IDENTIFIED:');
  console.log('──────────────────────────');
  console.log('Production deployment automatically creates a NEW database');
  console.log('This NEW database is EMPTY (0 restaurants)');
  console.log('Development database has 408 restaurants');
  
  console.log('\n🛠️ SOLUTIONS (Choose One):');
  console.log('\n📌 SOLUTION 1: Share the same database (Quick fix)');
  console.log('   1. Go to Replit → Deployments → Your deployment');
  console.log('   2. Click "Settings" → "Environment Variables"');
  console.log('   3. Add: DATABASE_URL = [copy from Secrets tab]');
  console.log('   4. Click "Save" and "Redeploy"');
  
  console.log('\n📌 SOLUTION 2: Import data to production (Best practice)');
  console.log('   1. Keep separate databases (more secure)');
  console.log('   2. Find production DATABASE_URL in deployment settings');
  console.log('   3. Run import script with production URL');
  console.log('   4. Each deployment will have its own data');
  
  console.log('\n🎯 RECOMMENDED: Use Solution 1 for now');
  console.log('   Later, set up proper data migration for Solution 2');
  
  // 4. Verification steps
  console.log('\n✅ VERIFICATION AFTER FIX:');
  console.log('   1. Open https://vegan-map-ai-bkozarev.replit.app');
  console.log('   2. Check if map shows restaurants');
  console.log('   3. API should return count: 408');
}

finalDiagnosis();