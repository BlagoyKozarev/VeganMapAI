// Generate clean SQL for production import
import { db } from './server/db';
import * as fs from 'fs';

async function generateCleanSQL() {
  console.log('Generating clean SQL for production import...');
  
  const restaurants = await db.query.restaurants.findMany({
    orderBy: (restaurants, { asc }) => [asc(restaurants.name)]
  });
  
  console.log(`Found ${restaurants.length} restaurants`);
  
  let sql = `-- VeganMapAI Production Database Import
-- Generated: ${new Date().toISOString()}
-- Total restaurants: ${restaurants.length}

-- Clear existing data
TRUNCATE TABLE restaurants CASCADE;

-- Import all restaurants
`;
  
  for (const r of restaurants) {
    const name = r.name.replace(/'/g, "''");
    const address = r.address.replace(/'/g, "''");
    const rating = r.rating !== null ? r.rating : 'NULL';
    const priceLevel = r.priceLevel !== null ? `'${r.priceLevel}'` : 'NULL';
    
    sql += `INSERT INTO restaurants (id, place_id, name, address, latitude, longitude, vegan_score, rating, price_level) VALUES `;
    sql += `('${r.id}', '${r.placeId}', '${name}', '${address}', ${r.latitude}, ${r.longitude}, ${r.veganScore}, ${rating}, ${priceLevel});\n`;
  }
  
  // Save to file
  fs.writeFileSync('production-clean.sql', sql);
  console.log('SQL file created: production-clean.sql');
  console.log(`Total lines: ${sql.split('\n').length}`);
  console.log(`File size: ${(sql.length / 1024).toFixed(2)} KB`);
}

generateCleanSQL().catch(console.error);