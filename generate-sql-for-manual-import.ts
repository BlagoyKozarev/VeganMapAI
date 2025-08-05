// Generate SQL statements for manual import to production
import fs from 'fs/promises';

async function generateSQL() {
  console.log('📝 Generating SQL for manual production import...\n');
  
  try {
    // Read export file
    const exportData = JSON.parse(
      await fs.readFile('restaurants-export.json', 'utf-8')
    );
    
    let sql = '-- VeganMapAI Production Database Import\n';
    sql += '-- Generated on: ' + new Date().toISOString() + '\n\n';
    
    // Clear existing data
    sql += '-- Clear existing data (optional)\n';
    sql += 'DELETE FROM vegan_score_breakdown;\n';
    sql += 'DELETE FROM restaurants;\n\n';
    
    // Insert restaurants
    sql += '-- Insert restaurants\n';
    exportData.restaurants.forEach((r: any) => {
      const values = [
        `'${r.id}'`,
        `'${r.placeId}'`,
        `'${r.name.replace(/'/g, "''")}'`,
        `'${r.address.replace(/'/g, "''")}'`,
        r.latitude,
        r.longitude,
        r.phoneNumber ? `'${r.phoneNumber.replace(/'/g, "''")}'` : 'NULL',
        r.website ? `'${r.website.replace(/'/g, "''")}'` : 'NULL',
        r.priceLevel || 'NULL',
        `ARRAY[${r.cuisineTypes.map((c: string) => `'${c.replace(/'/g, "''")}'`).join(', ')}]::text[]`,
        r.openingHours ? `'${JSON.stringify(r.openingHours).replace(/'/g, "''")}'::jsonb` : 'NULL',
        r.veganScore || 'NULL',
        r.photoUrl ? `'${r.photoUrl.replace(/'/g, "''")}'` : 'NULL',
        r.lastUpdated ? `'${r.lastUpdated}'` : 'CURRENT_TIMESTAMP',
        r.rating || 'NULL',
        r.userRatingsTotal || 'NULL'
      ];
      
      sql += `INSERT INTO restaurants (id, place_id, name, address, latitude, longitude, phone_number, website, price_level, cuisine_types, opening_hours, vegan_score, photo_url, last_updated, rating, user_ratings_total) VALUES (${values.join(', ')});\n`;
    });
    
    sql += '\n-- Insert vegan scores\n';
    exportData.veganScoreBreakdown.forEach((s: any) => {
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
    });
    
    // Save to file
    await fs.writeFile('production-import.sql', sql);
    
    console.log('✅ SQL file generated: production-import.sql');
    console.log(`📊 Contains: ${exportData.restaurants.length} restaurants and ${exportData.veganScoreBreakdown.length} scores`);
    console.log('\n📋 To use:');
    console.log('1. Copy the contents of production-import.sql');
    console.log('2. Paste into your production database interface');
    console.log('3. Execute the SQL');
    
  } catch (error) {
    console.error('❌ Error generating SQL:', error);
  }
}

generateSQL();