#!/usr/bin/env tsx

// Check deployment status and database connection

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { restaurants } from './shared/schema.js';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

async function checkDeployment() {
  console.log('🔍 Deployment Status Check');
  console.log('========================\n');

  // Check API
  try {
    const response = await fetch('https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data');
    const data = await response.json();
    console.log('📡 API Response:');
    console.log(`  - Success: ${data.success}`);
    console.log(`  - Count: ${data.count}`);
    console.log(`  - DB Connected: ${data.debug?.dbConnected}`);
    console.log(`  - Environment: ${data.debug?.nodeEnv}`);
  } catch (error) {
    console.error('❌ API Error:', error);
  }

  // Check production database directly
  const prodUrl = process.env.PRODUCTION_DATABASE_URL || 
    'postgresql://neondb_owner:npg_Ks8nuIrDCqe4@ep-solitary-sun-adx3l722.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require';
  
  try {
    const pool = new Pool({ connectionString: prodUrl });
    const db = drizzle({ client: pool, schema: { restaurants } });
    
    const count = await db.select().from(restaurants);
    console.log(`\n💾 Direct DB Check:`);
    console.log(`  - Restaurant count: ${count.length}`);
    if (count.length > 0) {
      console.log(`  - First restaurant: ${count[0].name}`);
      console.log(`  - Last restaurant: ${count[count.length - 1].name}`);
    }
    
    await pool.end();
  } catch (error) {
    console.error('❌ DB Error:', error);
  }
  
  console.log('\n💡 Next Steps:');
  console.log('1. If API shows 0 but DB has data -> Code deployment issue');
  console.log('2. Try: Deployments → Settings → Environment Variables');
  console.log('3. Ensure PRODUCTION_DATABASE_URL is set correctly');
}

checkDeployment();