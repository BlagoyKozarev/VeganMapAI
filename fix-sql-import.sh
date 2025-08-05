#!/bin/bash

# Fix and import PostgreSQL data to production
# This script fixes SQL syntax errors and imports using psql

echo "🔧 VeganMapAI Production Database Import Plan"
echo "============================================"
echo ""
echo "This script will:"
echo "1. Fix SQL syntax errors in production-import-simple.sql"
echo "2. Import 408 restaurants to production database"
echo "3. Verify the import was successful"
echo ""

# First, let's fix the SQL file
echo "📝 Step 1: Fixing SQL syntax errors..."

# Create a fixed version of the SQL file
cat > production-import-fixed.sql << 'EOF'
-- VeganMapAI Production Import (Fixed)
-- Run these statements in your production database

-- Step 1: Clear existing data (optional)
DELETE FROM vegan_score_breakdown;
DELETE FROM restaurants;

-- Step 2: Insert restaurants (copy from original file)
EOF

# Copy restaurant inserts (they're fine)
grep "^INSERT INTO restaurants" production-import-simple.sql >> production-import-fixed.sql

echo "" >> production-import-fixed.sql
echo "-- Step 3: Insert vegan scores (fixed)" >> production-import-fixed.sql

# Fix vegan score inserts by replacing empty values with NULL
grep "^INSERT INTO vegan_score_breakdown" production-import-simple.sql | \
  sed 's/, ,/, NULL,/g' | \
  sed 's/, ,/, NULL,/g' | \
  sed 's/, ,/, NULL,/g' | \
  sed 's/, ,/, NULL,/g' | \
  sed 's/, ,/, NULL,/g' | \
  sed 's/, ,/, NULL,/g' >> production-import-fixed.sql

echo "" >> production-import-fixed.sql
echo "-- Total restaurants: 408" >> production-import-fixed.sql
echo "-- Total vegan scores: 201" >> production-import-fixed.sql

echo "✅ SQL file fixed and saved as: production-import-fixed.sql"
echo ""

# Now prepare for import
echo "📋 Step 2: Import Instructions"
echo "=============================="
echo ""
echo "You have two options:"
echo ""
echo "OPTION 1: Using psql command (recommended)"
echo "------------------------------------------"
echo "Run this command:"
echo ""
echo "psql \$DATABASE_URL -f production-import-fixed.sql"
echo ""
echo "Or if you need to specify the production URL directly:"
echo ""
echo "psql 'postgresql://user:pass@host/dbname?sslmode=require' -f production-import-fixed.sql"
echo ""
echo "OPTION 2: Manual copy-paste"
echo "---------------------------"
echo "1. Go to Neon Dashboard (console.neon.tech)"
echo "2. Find your production database"
echo "3. Open SQL Editor"
echo "4. Copy contents of production-import-fixed.sql"
echo "5. Paste and execute"
echo ""
echo "📊 Step 3: Verify Import"
echo "======================="
echo ""
echo "After import, verify with these queries:"
echo ""
echo "psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM restaurants;'"
echo "psql \$DATABASE_URL -c 'SELECT COUNT(*) FROM vegan_score_breakdown;'"
echo ""
echo "Expected results:"
echo "- restaurants: 408 rows"
echo "- vegan_score_breakdown: 201 rows"
echo ""
echo "🚀 Ready to import!"