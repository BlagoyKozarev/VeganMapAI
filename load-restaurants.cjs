// Quick script to load restaurants from SQL file into development database
const fs = require('fs');

// Read the SQL file
const sqlContent = fs.readFileSync('production-clean.sql', 'utf8');

// Extract INSERT statements
const insertLines = sqlContent.split('\n').filter(line => 
  line.trim().startsWith('INSERT INTO restaurants')
);

console.log(`Found ${insertLines.length} restaurants in SQL file`);

// Parse each INSERT statement to extract values
const restaurants = insertLines.map(line => {
  // Extract values from INSERT statement
  const valuesMatch = line.match(/VALUES \((.*)\);/);
  if (!valuesMatch) return null;
  
  // Split values more carefully, respecting quoted strings
  const values = [];
  let current = '';
  let inQuotes = false;
  let i = 0;
  const str = valuesMatch[1];
  
  while (i < str.length) {
    const char = str[i];
    if (char === "'" && !inQuotes) {
      inQuotes = true;
      i++;
      continue;
    } else if (char === "'" && inQuotes) {
      inQuotes = false;
      i++;
      if (i < str.length && str[i] === ',') {
        values.push(current);
        current = '';
        i += 2; // skip comma and space
        continue;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim() === 'NULL' ? null : (parseFloat(current) || current));
      current = '';
      i += 2; // skip comma and space
      continue;
    } else {
      current += char;
    }
    i++;
  }
  // Add the last value
  if (current) {
    values.push(current.trim() === 'NULL' ? null : (parseFloat(current) || current));
  }
  
  return {
    id: values[0],
    placeId: values[1],
    name: values[2],
    address: values[3],
    latitude: values[4].toString(),
    longitude: values[5].toString(),
    veganScore: values[6] || 0,
    rating: values[7],
    priceLevel: values[8],
    cuisineTypes: [],
    phoneNumber: null,
    website: null,
    openingHours: null,
    photos: null
  };
}).filter(Boolean);

console.log(`Processed ${restaurants.length} restaurants`);

// Create JSON export file
const exportData = {
  restaurants: restaurants,
  generatedAt: new Date().toISOString(),
  source: 'production-clean.sql'
};

fs.writeFileSync('restaurants-export.json', JSON.stringify(exportData, null, 2));
console.log('✅ Created restaurants-export.json file');
console.log(`📊 Ready to load ${restaurants.length} restaurants into database`);