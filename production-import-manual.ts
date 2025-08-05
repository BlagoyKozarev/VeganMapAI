#!/usr/bin/env tsx

// Manual production import script
// Run this after deployment to populate the production database

import { restaurants } from './shared/schema.js';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from 'ws';
import fs from 'fs';

// Configure WebSocket for local execution
neonConfig.webSocketConstructor = ws;

const PRODUCTION_URL = process.env.DATABASE_URL!;

async function importToProduction() {
  console.log('🚀 Manual Production Import');
  console.log('==========================\n');
  
  try {
    // Create production connection
    const pool = new Pool({ connectionString: PRODUCTION_URL });
    const db = drizzle({ client: pool, schema: { restaurants } });
    
    // Check current state
    const existing = await db.select().from(restaurants);
    console.log(`📊 Current restaurants in production: ${existing.length}`);
    
    if (existing.length > 0) {
      console.log('⚠️  Production database already has data!');
      console.log('Do you want to continue? This will add more restaurants.');
      return;
    }
    
    // Load export data
    const fileContent = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
    const data = fileContent.restaurants || fileContent;
    console.log(`📥 Loading ${data.length} restaurants from export...`);
    
    // Insert in batches
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      try {
        await db.insert(restaurants).values(batch);
        successCount += batch.length;
        console.log(`✅ Imported ${successCount}/${data.length}`);
      } catch (error) {
        console.error(`❌ Failed batch ${i}-${i+batchSize}:`, error);
      }
    }
    
    // Verify
    const final = await db.select().from(restaurants);
    console.log(`\n✅ SUCCESS! Production now has ${final.length} restaurants!`);
    
    await pool.end();
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

importToProduction();