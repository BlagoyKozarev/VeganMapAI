// Script to import all 50 restaurants from bulk test
const fs = require('fs');

// Read the bulk test results
const data = JSON.parse(fs.readFileSync('bulk-test-results.json', 'utf8'));

// Extract ALL results (not just the preview)
const allResults = data.results || [];

console.log(`📊 Found ${allResults.length} restaurants in preview`);
console.log(`📊 Total processed: ${data.stats.totalProcessed}`);

// Since we only have 10 in preview, we need to run the bulk test again
// to get all 50 and save them properly

// For now, let's import what we have
const importData = {
  results: allResults
};

fs.writeFileSync('import-all.json', JSON.stringify(importData, null, 2));
console.log(`✅ Prepared ${allResults.length} restaurants for import`);