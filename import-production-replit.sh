#!/bin/bash

echo "================================"
echo "  IMPORT В REPLIT PRODUCTION"
echo "================================"

# Проверка на production URL
PROD_DB_URL=$(curl -s https://vegan-map-ai-bkozarev.replit.app/api/health 2>/dev/null | grep -o "database.*true" || echo "API не отговаря")

echo "Status: $PROD_DB_URL"

# Използваме psql директно с production URL ако е наличен
if [ -n "$PRODUCTION_DATABASE_URL" ]; then
    echo "Намерен PRODUCTION_DATABASE_URL"
    psql "$PRODUCTION_DATABASE_URL" < production-import-simple.sql
    echo "✅ Import завършен през production URL"
elif [ -n "$DATABASE_URL" ]; then
    echo "Използвам DATABASE_URL за import"
    psql "$DATABASE_URL" < production-import-simple.sql
    echo "✅ Import завършен през development URL"
else
    echo "❌ Няма налична DATABASE_URL"
fi

echo ""
echo "Проверка на резултата..."
curl -s https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data | \
    python3 -c "import sys, json; d=json.load(sys.stdin); print(f'Production ресторанти: {d.get(\"count\", 0)}')"