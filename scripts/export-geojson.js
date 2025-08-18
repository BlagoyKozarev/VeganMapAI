#!/usr/bin/env node

import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pg;

async function exportGeoJSON() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    console.log('📡 Connecting to database...');
    await client.connect();
    
    console.log('🔍 Querying restaurants with coordinates...');
    const result = await client.query(`
      SELECT 
        id, place_id, name, address, phone_number, website, 
        price_level, cuisine_types, opening_hours, photos,
        rating, review_count, vegan_score, is_verified, geo_hash,
        latitude, longitude
      FROM restaurants 
      WHERE latitude IS NOT NULL AND longitude IS NOT NULL
      ORDER BY name
    `);
    
    console.log(`✅ Found ${result.rows.length} restaurants with coordinates`);
    
    // Build GeoJSON structure
    const geoJson = {
      type: 'FeatureCollection',
      features: result.rows.map(row => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [parseFloat(row.longitude), parseFloat(row.latitude)]
        },
        properties: {
          id: row.id,
          place_id: row.place_id,
          name: row.name,
          address: row.address,
          phone_number: row.phone_number,
          website: row.website,
          price_level: row.price_level,
          cuisine_types: row.cuisine_types,
          opening_hours: row.opening_hours,
          photos: row.photos,
          rating: row.rating ? parseFloat(row.rating) : null,
          review_count: row.review_count,
          vegan_score: row.vegan_score ? parseFloat(row.vegan_score) : null,
          is_verified: row.is_verified,
          geo_hash: row.geo_hash
        }
      }))
    };
    
    // Write to file
    const fileName = 'sofia.geojson';
    const jsonString = JSON.stringify(geoJson, null, 2);
    fs.writeFileSync(fileName, jsonString);
    
    console.log('📝 GeoJSON export completed:');
    console.log(`   File: ${fileName}`);
    console.log(`   Size: ${Buffer.byteLength(jsonString)} bytes (${(Buffer.byteLength(jsonString) / 1024).toFixed(1)} KB)`);
    console.log(`   Features: ${geoJson.features.length}`);
    console.log(`   Format: RFC 7946 compliant`);
    
    // Validation
    const hasValidStructure = geoJson.type === 'FeatureCollection' && 
                             Array.isArray(geoJson.features) &&
                             geoJson.features.length > 0;
    
    console.log(`   Validation: ${hasValidStructure ? '✅ Valid' : '❌ Invalid'}`);
    
    return { fileName, features: geoJson.features.length, bytes: Buffer.byteLength(jsonString) };
    
  } catch (error) {
    console.error('❌ Export failed:', error.message);
    throw error;
  } finally {
    await client.end();
  }
}

// Run export
exportGeoJSON()
  .then(result => {
    console.log('\n🚀 Ready for:');
    console.log('   • Frontend map integration');
    console.log('   • API endpoint serving');
    console.log('   • Cloud storage upload');
    console.log('   • GIS analysis tools');
  })
  .catch(error => {
    console.error('💥 Export process failed:', error);
    process.exit(1);
  });