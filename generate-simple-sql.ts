import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

async function generateSQL() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: false
  });

  try {
    console.log('📊 Генериране на SQL файл от development базата...');
    
    // Вземаме всички ресторанти
    const result = await pool.query(`
      SELECT 
        id,
        place_id,
        name,
        address,
        latitude,
        longitude,
        phone_number,
        website,
        price_level,
        cuisine_types,
        opening_hours,
        photos,
        rating,
        review_count,
        vegan_score,
        is_verified,
        created_at,
        updated_at,
        geo_hash
      FROM restaurants
      ORDER BY id
    `);
    
    console.log(`Намерени ${result.rows.length} ресторанта`);
    
    let sqlContent = '-- VeganMapAI Restaurant Data Import\n';
    sqlContent += '-- Generated on ' + new Date().toISOString() + '\n\n';
    
    for (const restaurant of result.rows) {
      // Escape single quotes
      const escapeSingle = (str) => str ? str.replace(/'/g, "''") : null;
      
      sqlContent += `INSERT INTO restaurants (
        id, place_id, name, address, latitude, longitude, 
        phone_number, website, price_level, cuisine_types, 
        opening_hours, photos, rating, review_count, 
        vegan_score, is_verified, created_at, updated_at, geo_hash
      ) VALUES (
        '${restaurant.id}',
        '${restaurant.place_id}',
        '${escapeSingle(restaurant.name)}',
        '${escapeSingle(restaurant.address)}',
        ${restaurant.latitude},
        ${restaurant.longitude},
        ${restaurant.phone_number ? `'${escapeSingle(restaurant.phone_number)}'` : 'NULL'},
        ${restaurant.website ? `'${escapeSingle(restaurant.website)}'` : 'NULL'},
        ${restaurant.price_level ? `'${restaurant.price_level}'` : 'NULL'},
        ${restaurant.cuisine_types ? `'{${restaurant.cuisine_types.join(',')}}'` : 'NULL'},
        ${restaurant.opening_hours ? `'${JSON.stringify(restaurant.opening_hours).replace(/'/g, "''")}'` : 'NULL'},
        ${restaurant.photos ? `'{${restaurant.photos.join(',')}}'` : 'NULL'},
        ${restaurant.rating || 'NULL'},
        ${restaurant.review_count || 'NULL'},
        ${restaurant.vegan_score},
        ${restaurant.is_verified},
        '${restaurant.created_at.toISOString()}',
        '${restaurant.updated_at.toISOString()}',
        ${restaurant.geo_hash ? `'${restaurant.geo_hash}'` : 'NULL'}
      ) ON CONFLICT (id) DO NOTHING;\n\n`;
    }
    
    // Запазваме във файл
    fs.writeFileSync('production-import-simple.sql', sqlContent);
    console.log('✅ SQL файл създаден: production-import-simple.sql');
    console.log(`📊 Общо ${result.rows.length} INSERT заявки`);
    
  } catch (error) {
    console.error('❌ Грешка:', error.message);
  } finally {
    await pool.end();
  }
}

generateSQL();