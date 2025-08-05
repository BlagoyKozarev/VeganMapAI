#!/bin/bash

echo "🔍 Deployment Environment Checker"
echo "================================"
echo ""
echo "Current Local DATABASE_URL:"
if [ -n "$DATABASE_URL" ]; then
    echo "✅ DATABASE_URL is set locally"
    echo "   Host: $(echo $DATABASE_URL | grep -oP '(?<=@)[^/]+')"
    echo "   Database: $(echo $DATABASE_URL | grep -oP '(?<=/)[^?]+' | tail -1)"
    echo "   SSL Mode: $(echo $DATABASE_URL | grep -oP '(?<=sslmode=)[^&]*' || echo 'Not set')"
else
    echo "❌ DATABASE_URL not found in local environment"
fi

echo ""
echo "Required Deployment Environment Variables:"
echo "========================================="
echo "DATABASE_URL = [Your Neon production database URL]"
echo "OPENAI_API_KEY = [Your OpenAI API key]" 
echo "GOOGLE_MAPS_API_KEY = [Your Google Maps API key]"
echo "NODE_ENV = production"
echo ""
echo "⚠️  IMPORTANT: DATABASE_URL must end with ?sslmode=require"
