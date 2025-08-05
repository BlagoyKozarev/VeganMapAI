// Generate simple SQL INSERT statements from restaurants export
import fs from 'fs/promises';

async function generateSimpleSQL() {
  console.log('📝 Generating simple SQL statements...\n');
  
  try {
    // Read and fix the JSON file
    let jsonContent = await fs.readFile('restaurants-export.json', 'utf-8');
    
    // Remove any bad control characters
    jsonContent = jsonContent.replace(/[\x00-\x1F\x7F-\x9F]/g, ' ');
    
    const data = JSON.parse(jsonContent);
    
    // Start SQL file
    let sql = '-- VeganMapAI Simple Production Import\n';
    sql += '-- Run these statements in your production database\n\n';
    
    // Delete existing data (optional)
    sql += '-- Step 1: Clear existing data (optional)\n';
    sql += 'DELETE FROM vegan_score_breakdown;\n';
    sql += 'DELETE FROM restaurants;\n\n';
    
    // Generate restaurant inserts
    sql += '-- Step 2: Insert restaurants\n';
    let count = 0;
    
    for (const r of data.restaurants) {
      // Escape single quotes in strings
      const escape = (str) => str ? str.replace(/'/g, "''") : null;
      
      // Build values array
      const values = [
        `'${r.id}'`,
        `'${r.placeId}'`, 
        `'${escape(r.name)}'`,
        `'${escape(r.address)}'`,
        r.latitude,
        r.longitude,
        r.phoneNumber ? `'${escape(r.phoneNumber)}'` : 'NULL',
        r.website ? `'${escape(r.website)}'` : 'NULL',
        r.priceLevel || 'NULL',
        `ARRAY[${r.cuisineTypes.map(c => `'${escape(c)}'`).join(',')}]::text[]`,
        r.openingHours ? `'${JSON.stringify(r.openingHours).replace(/'/g, "''")}'::jsonb` : 'NULL',
        r.veganScore || 'NULL',
        r.photoUrl ? `'${escape(r.photoUrl)}'` : 'NULL',
        r.lastUpdated ? `'${r.lastUpdated}'` : 'CURRENT_TIMESTAMP',
        r.rating || 'NULL',
        r.userRatingsTotal || 'NULL'
      ];
      
      sql += `INSERT INTO restaurants (id, place_id, name, address, latitude, longitude, phone_number, website, price_level, cuisine_types, opening_hours, vegan_score, photo_url, last_updated, rating, user_ratings_total) VALUES (${values.join(', ')});\n`;
      
      count++;
      if (count % 10 === 0) {
        sql += '\n'; // Add blank line every 10 inserts for readability
      }
    }
    
    sql += `\n-- Total restaurants: ${data.restaurants.length}\n\n`;
    
    // Generate vegan score inserts
    sql += '-- Step 3: Insert vegan scores\n';
    count = 0;
    
    for (const s of data.veganScoreBreakdown) {
      const values = [
        `'${s.id}'`,
        `'${s.restaurantId}'`,
        s.menuOptionsScore,
        s.ingredientsScore,
        s.crossContaminationScore,
        s.certificationScore,
        s.staffKnowledgeScore,
        s.communityScore,
        s.overallScore,
        `'${s.lastUpdated}'`
      ];
      
      sql += `INSERT INTO vegan_score_breakdown (id, restaurant_id, menu_options_score, ingredients_score, cross_contamination_score, certification_score, staff_knowledge_score, community_score, overall_score, last_updated) VALUES (${values.join(', ')});\n`;
      
      count++;
      if (count % 10 === 0) {
        sql += '\n';
      }
    }
    
    sql += `\n-- Total vegan scores: ${data.veganScoreBreakdown.length}\n`;
    
    // Save to file
    await fs.writeFile('production-import-simple.sql', sql);
    
    console.log('✅ SQL file generated: production-import-simple.sql');
    console.log(`📊 Contains:`);
    console.log(`   - ${data.restaurants.length} restaurants`);
    console.log(`   - ${data.veganScoreBreakdown.length} vegan scores`);
    console.log('\n📋 Instructions:');
    console.log('1. Copy the contents of production-import-simple.sql');
    console.log('2. Paste into your production database console');
    console.log('3. Execute the SQL statements');
    console.log('\n✨ The production site will work immediately after execution!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nTrying alternative approach...');
  }
}

generateSimpleSQL();