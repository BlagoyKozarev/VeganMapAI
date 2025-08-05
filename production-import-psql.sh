#!/bin/bash

# VeganMapAI Production Database Import Script
# Uses psql for direct PostgreSQL import with error handling

echo "🚀 VeganMapAI Production Database Import"
echo "======================================="
echo ""
echo "This script will import 408 restaurants into production"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to check if psql is available
check_psql() {
    if ! command -v psql &> /dev/null; then
        echo -e "${RED}❌ psql command not found!${NC}"
        echo ""
        echo "Installing PostgreSQL client..."
        # Try to install psql based on system
        if [[ "$OSTYPE" == "linux-gnu"* ]]; then
            sudo apt-get update && sudo apt-get install -y postgresql-client
        elif [[ "$OSTYPE" == "darwin"* ]]; then
            brew install postgresql
        fi
    else
        echo -e "${GREEN}✅ psql is available${NC}"
    fi
}

# Function to validate DATABASE_URL
validate_database_url() {
    local url=$1
    if [[ -z "$url" ]]; then
        return 1
    fi
    
    # Check if it contains required PostgreSQL components
    if [[ "$url" =~ postgresql:// ]] && [[ "$url" =~ @.*/ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to test database connection
test_connection() {
    local url=$1
    echo -n "Testing database connection... "
    
    if psql "$url" -c "SELECT 1;" &> /dev/null; then
        echo -e "${GREEN}✅ Connected successfully${NC}"
        return 0
    else
        echo -e "${RED}❌ Connection failed${NC}"
        return 1
    fi
}

# Main import process
echo "📋 Step 1: Environment Setup"
echo "============================"

# Check for psql
check_psql

# Get DATABASE_URL
if [[ -n "$DATABASE_URL" ]]; then
    echo -e "${YELLOW}Found DATABASE_URL in environment${NC}"
    PROD_URL="$DATABASE_URL"
else
    echo ""
    echo "Please provide your production DATABASE_URL:"
    echo "(Format: postgresql://user:password@host:port/database?sslmode=require)"
    echo ""
    read -p "DATABASE_URL: " PROD_URL
fi

# Validate URL
if ! validate_database_url "$PROD_URL"; then
    echo -e "${RED}❌ Invalid DATABASE_URL format${NC}"
    echo "Expected format: postgresql://user:password@host:port/database?sslmode=require"
    exit 1
fi

# Test connection
if ! test_connection "$PROD_URL"; then
    echo -e "${RED}❌ Cannot connect to database. Please check your DATABASE_URL${NC}"
    exit 1
fi

echo ""
echo "📊 Step 2: Pre-Import Check"
echo "=========================="

# Check current data
echo "Checking existing data..."
CURRENT_RESTAURANTS=$(psql "$PROD_URL" -t -c "SELECT COUNT(*) FROM restaurants;" 2>/dev/null || echo "0")
CURRENT_SCORES=$(psql "$PROD_URL" -t -c "SELECT COUNT(*) FROM vegan_score_breakdown;" 2>/dev/null || echo "0")

echo "Current database state:"
echo "- Restaurants: $CURRENT_RESTAURANTS"
echo "- Vegan Scores: $CURRENT_SCORES"

if [[ $CURRENT_RESTAURANTS -gt 0 ]]; then
    echo ""
    echo -e "${YELLOW}⚠️  Warning: Database already contains data!${NC}"
    echo "The import will DELETE existing data before inserting new records."
    read -p "Continue? (y/N): " confirm
    
    if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
        echo "Import cancelled."
        exit 0
    fi
fi

echo ""
echo "🔄 Step 3: Running Import"
echo "======================="

# Use the fixed SQL file
SQL_FILE="production-import-fixed.sql"

if [[ ! -f "$SQL_FILE" ]]; then
    echo -e "${RED}❌ SQL file not found: $SQL_FILE${NC}"
    echo "Please run fix-sql-import.sh first to generate the fixed SQL file"
    exit 1
fi

echo "Importing data from $SQL_FILE..."
echo ""

# Run import with error handling
if psql "$PROD_URL" -f "$SQL_FILE" -v ON_ERROR_STOP=1; then
    echo ""
    echo -e "${GREEN}✅ Import completed successfully!${NC}"
else
    echo ""
    echo -e "${RED}❌ Import failed with errors${NC}"
    echo "Please check the error messages above"
    exit 1
fi

echo ""
echo "📊 Step 4: Verification"
echo "====================="

# Verify import
echo "Verifying imported data..."
NEW_RESTAURANTS=$(psql "$PROD_URL" -t -c "SELECT COUNT(*) FROM restaurants;" 2>/dev/null || echo "0")
NEW_SCORES=$(psql "$PROD_URL" -t -c "SELECT COUNT(*) FROM vegan_score_breakdown;" 2>/dev/null || echo "0")

echo ""
echo "Import results:"
echo "- Restaurants imported: $NEW_RESTAURANTS (expected: 408)"
echo "- Vegan scores imported: $NEW_SCORES (expected: 201)"

# Check if import was successful
if [[ $NEW_RESTAURANTS -eq 408 ]] && [[ $NEW_SCORES -eq 201 ]]; then
    echo ""
    echo -e "${GREEN}✅ Import verification passed!${NC}"
    echo ""
    echo "🎉 SUCCESS! Your production database is ready!"
    echo ""
    echo "Next steps:"
    echo "1. Visit https://vegan-map-ai-bkozarev.replit.app"
    echo "2. The map should now show all 408 restaurants"
    echo "3. Check that restaurants have vegan scores"
else
    echo ""
    echo -e "${YELLOW}⚠️  Warning: Import counts don't match expected values${NC}"
    echo "This might indicate a partial import or data issues"
fi

echo ""
echo "📝 Additional Queries"
echo "==================="
echo ""
echo "To check specific restaurants:"
echo "psql \$DATABASE_URL -c \"SELECT name, vegan_score FROM restaurants WHERE vegan_score IS NOT NULL LIMIT 10;\""
echo ""
echo "To check restaurants by city:"
echo "psql \$DATABASE_URL -c \"SELECT COUNT(*), SUBSTRING(address FROM '.*, (.*)') as city FROM restaurants GROUP BY city;\""
echo ""
echo "To check score distribution:"
echo "psql \$DATABASE_URL -c \"SELECT COUNT(*), ROUND(CAST(vegan_score AS NUMERIC), 1) as score FROM restaurants WHERE vegan_score IS NOT NULL GROUP BY score ORDER BY score;\"" 