#!/bin/bash

# Import restaurants to production database
# This script helps import the restaurants data to production

echo "🚀 VeganMapAI Production Database Import"
echo "======================================="
echo ""
echo "This script will import 408 restaurants to your production database."
echo ""
echo "⚠️  IMPORTANT: You need your production DATABASE_URL"
echo ""
echo "Where to find it:"
echo "1. Go to Deployments tab in Replit"
echo "2. Click on your deployment (vegan-map-ai-bkozarev)" 
echo "3. Go to 'Environment Variables'"
echo "4. Copy the DATABASE_URL value"
echo ""
read -p "Paste your production DATABASE_URL here: " PROD_DB_URL

if [ -z "$PROD_DB_URL" ]; then
    echo "❌ No DATABASE_URL provided. Exiting."
    exit 1
fi

echo ""
echo "📊 Ready to import:"
echo "   - 408 restaurants"
echo "   - 201 vegan scores"
echo "   - Target: Production database"
echo ""
read -p "Continue with import? (y/N): " confirm

if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
    echo "Import cancelled."
    exit 0
fi

echo ""
echo "🔄 Starting import..."

# Run the import with production DATABASE_URL
NODE_ENV=production DATABASE_URL="$PROD_DB_URL" tsx import-restaurants.ts

echo ""
echo "✅ Import complete! Check https://vegan-map-ai-bkozarev.replit.app"