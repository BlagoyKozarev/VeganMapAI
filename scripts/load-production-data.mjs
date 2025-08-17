#!/usr/bin/env node
import fs from 'fs';

// Load full restaurant data
const data = JSON.parse(fs.readFileSync('restaurants-export.json', 'utf-8'));
const restaurants = data.restaurants || data;

console.log(`Loading ${restaurants.length} restaurants to production...`);

// Send to production in batches
const BATCH_SIZE = 50;
const BASE_URL = 'https://vegan-map-ai-bkozarev.replit.app';

for (let i = 0; i < restaurants.length; i += BATCH_SIZE) {
  const batch = restaurants.slice(i, i + BATCH_SIZE);
  console.log(`Sending batch ${i + 1}-${i + batch.length}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/load-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ restaurants: batch })
    });
    
    const result = await response.json();
    console.log(`✅ Batch result:`, result);
    
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 100));
  } catch (error) {
    console.error(`❌ Batch ${i} failed:`, error.message);
  }
}

console.log('✅ Production data loading complete');