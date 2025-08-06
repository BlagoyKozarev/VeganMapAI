#!/bin/bash

echo "==========================================="
echo "  IMPORT НА РЕСТОРАНТИ В PRODUCTION"
echo "==========================================="
echo ""

# Проверка дали SQL файлът съществува
if [ ! -f "production-import-simple.sql" ]; then
    echo "❌ Липсва SQL файл. Генериране..."
    tsx generate-simple-sql.ts
fi

echo "📊 SQL файлът съдържа:"
echo "   $(grep -c "INSERT INTO" production-import-simple.sql) ресторанта"
echo ""

echo "🔍 Проверка на production база..."
curl -s https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data | \
    python3 -c "import sys, json; data = json.load(sys.stdin); print(f'   Текущо в production: {data[\"count\"]} ресторанта')"

echo ""
echo "==========================================="
echo "  ИНСТРУКЦИИ ЗА РЪЧЕН IMPORT:"
echo "==========================================="
echo ""
echo "1. Отворете Database панела (долу вляво в Replit)"
echo "2. Превключете на 'Production' таб"
echo "3. Кликнете на 'Query' бутона"
echo "4. Копирайте съдържанието на production-import-simple.sql"
echo "5. Поставете го в query полето"
echo "6. Натиснете 'Run Query'"
echo ""
echo "След това production ще има всички 408 ресторанта!"
echo ""
echo "Файл за копиране: production-import-simple.sql"
echo "==========================================="