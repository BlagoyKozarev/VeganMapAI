import { restaurants } from './shared/schema.js';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import fs from 'fs';

async function importToProduction() {
  console.log('🚀 Direct Production Import');
  console.log('==========================\n');
  
  // Check for production DATABASE_URL
  const prodUrl = process.env.PRODUCTION_DATABASE_URL || process.env.DATABASE_URL;
  
  if (!prodUrl) {
    console.error('❌ No DATABASE_URL found!');
    console.log('Please set PRODUCTION_DATABASE_URL environment variable');
    process.exit(1);
  }
  
  console.log('📊 Using database URL:', prodUrl.substring(0, 30) + '...');
  
  try {
    // Create production connection
    const pool = new Pool({ connectionString: prodUrl });
    const db = drizzle({ client: pool, schema: { restaurants } });
    
    // Check current state
    const existing = await db.select().from(restaurants);
    console.log(`📊 Current restaurants in production: ${existing.length}`);
    
    if (existing.length > 0) {
      console.log('⚠️  Production database already has data!');
      return;
    }
    
    // Load export data
    const data = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
    console.log(`📥 Loading ${data.length} restaurants from export...`);
    
    // Insert in batches
    const batchSize = 50;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      await db.insert(restaurants).values(batch);
      console.log(`✅ Imported ${i + batch.length}/${data.length}`);
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