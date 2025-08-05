import { restaurants } from '../shared/schema.js';
import { db } from './db.js';
import fs from 'fs';
import path from 'path';

export async function initializeDatabase() {
  try {
    // Check if database has restaurants
    const existingRestaurants = await db.select().from(restaurants);
    
    if (existingRestaurants.length === 0) {
      console.log('📊 Database is empty, initializing with restaurant data...');
      
      // Check if export file exists
      const exportPath = path.join(process.cwd(), 'restaurants-export.json');
      
      if (fs.existsSync(exportPath)) {
        const data = JSON.parse(fs.readFileSync(exportPath, 'utf-8'));
        console.log(`📥 Loading ${data.length} restaurants...`);
        
        // Insert in batches to avoid timeout
        const batchSize = 50;
        for (let i = 0; i < data.length; i += batchSize) {
          const batch = data.slice(i, i + batchSize);
          await db.insert(restaurants).values(batch);
          console.log(`✅ Inserted ${i + batch.length}/${data.length} restaurants`);
        }
        
        console.log('✅ Database initialized successfully!');
      } else {
        console.log('⚠️ No restaurants-export.json found, database will remain empty');
      }
    } else {
      console.log(`✅ Database already has ${existingRestaurants.length} restaurants`);
    }
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    // Don't crash the app, just log the error
  }
}