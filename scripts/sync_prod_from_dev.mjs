#!/usr/bin/env node
import fetch from 'node-fetch';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const PROD = process.env.PROD_BASE || 'https://vegan-map-ai-bkozarev.replit.app';
const TOKEN = process.env.SEED_TOKEN;

if (!TOKEN) {
  console.error('❌ SEED_TOKEN missing - required for production ingest');
  console.error('Set SEED_TOKEN environment variable with secure token');
  process.exit(1);
}

console.log('🔄 Starting production sync from development database');
console.log(`🎯 Target: ${PROD}`);

try {
  console.log('📥 Fetching all restaurants from development...');
  const devResponse = await fetch('http://localhost:5000/api/restaurants/public/map-data');
  
  if (!devResponse.ok) {
    throw new Error(`Development API error: ${devResponse.status}`);
  }

  const dev = await devResponse.json();
  console.log(`✅ Development restaurants: ${dev.length}`);

  if (dev.length === 0) {
    console.warn('⚠️ No restaurants found in development database');
    process.exit(0);
  }

  // Chunk function for batch processing
  function chunk(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  console.log('📤 Starting batch upload to production...');
  let totalInserted = 0;
  const batches = chunk(dev, 200);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    console.log(`📦 Processing batch ${i + 1}/${batches.length} (${batch.length} restaurants)`);
    
    try {
      const response = await fetch(`${PROD}/api/v1/admin/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Seed-Token': TOKEN
        },
        body: JSON.stringify({ restaurants: batch })
      });

      if (!response.ok) {
        console.error(`❌ Batch ${i + 1} failed: ${response.status} ${response.statusText}`);
        continue;
      }

      const result = await response.json();
      const inserted = result.inserted || 0;
      console.log(`✅ Batch ${i + 1}: inserted ${inserted}/${batch.length} restaurants`);
      totalInserted += inserted;
      
      // Rate limiting - small delay between batches
      if (i < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      console.error(`❌ Batch ${i + 1} error:`, error.message);
    }
  }

  console.log(`🎉 Sync complete! Total inserted: ${totalInserted} restaurants`);

  // Verification step
  console.log('🔍 Verifying production database...');
  const bboxResponse = await fetch(`${PROD}/api/v1/map-data?minLat=42.5&minLng=23.0&maxLat=42.9&maxLng=23.7`);
  
  if (bboxResponse.ok) {
    const bbox = await bboxResponse.json();
    console.log(`✅ Production bbox count: ${bbox.length} restaurants`);
    
    if (bbox.length >= 400) {
      console.log('🎯 Success! Production database contains substantial dataset');
    } else {
      console.warn('⚠️ Production dataset smaller than expected');
    }
  } else {
    console.warn('⚠️ Could not verify production database');
  }

  console.log('🏁 Sync operation completed successfully');

} catch (error) {
  console.error('💥 Sync failed:', error.message);
  process.exit(1);
}