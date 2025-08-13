import fs from 'fs';

const inFile = process.argv[2];
const outFile = process.argv[3];

if (!inFile || !outFile) {
  console.error('Usage: node convert-to-geojson.mjs <input.json> <output.geojson>');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(inFile,'utf8'));

function pick(obj, paths) {
  for (const p of paths) {
    try {
      const v = p.split('.').reduce((o,k)=>o?.[k], obj);
      if (v !== undefined && v !== null) return v;
    } catch(_) {}
  }
  return undefined;
}

function asFeature(r) {
  // VeganMapAI specific field mappings
  const lat = pick(r, ['latitude','lat','location.lat','geometry.coordinates.1']);
  const lng = pick(r, ['longitude','lng','lon','location.lng','geometry.coordinates.0']);
  if (typeof lat !== 'number' || typeof lng !== 'number') {
    // Try parsing strings
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    if (isNaN(parsedLat) || isNaN(parsedLng)) return null;
    return createFeature(r, parsedLat, parsedLng);
  }
  return createFeature(r, lat, lng);
}

function createFeature(r, lat, lng) {
  const id = pick(r, ['id','place_id','slug']) ?? null;
  const name = pick(r, ['name','title']) ?? '';
  const veganScore = pick(r, ['veganScore','vegan_score','score']) ?? null;
  const price = pick(r, ['price','priceLevel']) ?? null;
  const cuisine = pick(r, ['cuisineTypes','cuisine','category']) ?? null;
  const rating = pick(r, ['rating']) ?? null;
  const address = pick(r, ['address','formatted_address']) ?? null;

  return {
    type: 'Feature',
    properties: { 
      id, 
      name, 
      vegan_score: veganScore ? parseFloat(veganScore) : null,
      price, 
      cuisine_types: Array.isArray(cuisine) ? cuisine : (cuisine ? [cuisine] : []),
      rating: rating ? parseFloat(rating) : null,
      address
    },
    geometry: { type: 'Point', coordinates: [lng, lat] }
  };
}

let features = [];

if (raw?.type === 'FeatureCollection' && Array.isArray(raw.features)) {
  features = raw.features;
} else if (raw?.success && Array.isArray(raw.restaurants)) {
  // VeganMapAI API response format
  features = raw.restaurants.map(asFeature).filter(Boolean);
} else {
  // Generic array formats
  const arr = Array.isArray(raw) ? raw
            : Array.isArray(raw.data) ? raw.data
            : Array.isArray(raw.results) ? raw.results
            : [];
  features = arr.map(asFeature).filter(Boolean);
}

const fc = { type: 'FeatureCollection', features };
fs.writeFileSync(outFile, JSON.stringify(fc, null, 2));
console.log(`✅ Converted ${features.length} restaurants to GeoJSON format: ${outFile}`);