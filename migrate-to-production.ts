import { restaurants } from './shared/schema.js';
import { db } from './server/db.js';
import fs from 'fs';

async function migrateToProduction() {
  console.log('🚀 Starting production data migration...');
  
  try {
    // Read the restaurants data from the export file
    const data = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
    
    console.log(`📊 Found ${data.length} restaurants to migrate`);
    
    // Insert all restaurants
    if (data.length > 0) {
      await db.insert(restaurants).values(data);
      console.log('✅ Successfully migrated all restaurants to production!');
    }
    
    // Verify the migration
    const count = await db.select().from(restaurants);
    console.log(`✅ Production database now has ${count.length} restaurants`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
  
  process.exit(0);
}

migrateToProduction();