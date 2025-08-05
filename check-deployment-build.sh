#!/bin/bash

echo "🔍 Checking if deployment build was successful..."

# Test build locally to see if it produces the fix
echo -e "\n📦 Building locally..."
npm run build

echo -e "\n🔍 Checking if fix is in built files..."
grep -r "snakeCase\|vegan_score\|price_level" dist/ || echo "❌ Fix not found in build"

echo -e "\n📝 Check if storage.ts was built correctly..."
if [ -f "dist/index.js" ]; then
    echo "✅ Build file exists"
    echo "Size: $(ls -lh dist/index.js | awk '{print $5}')"
else
    echo "❌ Build file missing"
fi