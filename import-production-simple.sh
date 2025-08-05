#!/bin/bash

echo "🚀 VeganMapAI Production Import - SIMPLE VERSION"
echo "=============================================="
echo ""
echo "This will import 408 restaurants to your PRODUCTION database."
echo ""
echo "📋 Instructions:"
echo "1. Go to Replit Deployments tab"
echo "2. Click on 'vegan-map-ai-bkozarev'"
echo "3. Go to 'Environment Variables'"
echo "4. Copy the DATABASE_URL value"
echo ""
echo "Paste your production DATABASE_URL below:"
echo "(It should look like: postgresql://username:password@...neon.tech/...)"
echo ""
read -p "DATABASE_URL: " PROD_URL

if [ -z "$PROD_URL" ]; then
    echo "❌ No URL provided. Exiting."
    exit 1
fi

# Validate it's a production URL
if [[ ! "$PROD_URL" == *"neon.tech"* ]]; then
    echo "❌ This doesn't look like a production Neon database URL!"
    echo "   Make sure you're using the URL from Deployments, not local development."
    exit 1
fi

echo ""
echo "🚀 Starting import to production..."
echo ""

# Run the fixed import script with production URL
DATABASE_URL="$PROD_URL" tsx import-production-fix.ts

echo ""
echo "✅ Done! Check https://vegan-map-ai-bkozarev.replit.app"