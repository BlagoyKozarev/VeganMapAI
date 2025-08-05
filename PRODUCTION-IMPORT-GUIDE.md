# 📚 VeganMapAI Production Database Import Guide

## Overview
This guide helps you import 408 restaurants and 201 vegan scores into your production PostgreSQL database.

## Prerequisites
- Access to production DATABASE_URL
- PostgreSQL client (`psql`) installed
- Fixed SQL file: `production-import-fixed.sql`

## Import Methods

### Method 1: Automated Script (Recommended)
```bash
./production-import-psql.sh
```

This script will:
1. Validate your DATABASE_URL
2. Test database connection
3. Check existing data
4. Run the import
5. Verify results

### Method 2: Direct psql Command
```bash
# Using environment variable
psql $DATABASE_URL -f production-import-fixed.sql

# Or with direct URL
psql 'postgresql://user:pass@host/db?sslmode=require' -f production-import-fixed.sql
```

### Method 3: Manual via Neon Dashboard
1. Go to https://console.neon.tech
2. Open your production database
3. Navigate to SQL Editor
4. Copy contents of `production-import-fixed.sql`
5. Paste and execute

## Database URL Format
```
postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

Example:
```
postgresql://neondb_owner:npg_ABC123@ep-name.region.aws.neon.tech/neondb?sslmode=require
```

## Finding Your Production DATABASE_URL

### Option 1: Replit Deployments
1. Open Deployments tab
2. Click on your deployment
3. Go to Environment Variables
4. Copy DATABASE_URL value

### Option 2: Neon Dashboard
1. Login to console.neon.tech
2. Select your project
3. Go to Connection Details
4. Copy connection string

### Option 3: Ask Support
Email support@replit.com if you cannot find your production DATABASE_URL

## Verification Queries

After import, verify your data:

```bash
# Count restaurants
psql $DATABASE_URL -c "SELECT COUNT(*) FROM restaurants;"
# Expected: 408

# Count vegan scores
psql $DATABASE_URL -c "SELECT COUNT(*) FROM vegan_score_breakdown;"
# Expected: 201

# Check sample data
psql $DATABASE_URL -c "SELECT name, vegan_score FROM restaurants LIMIT 5;"
```

## Troubleshooting

### Connection Errors
- Verify DATABASE_URL format
- Check network connectivity
- Ensure SSL mode is set (`?sslmode=require`)

### Import Errors
- Check for SQL syntax errors
- Verify table structure matches
- Look for constraint violations

### Data Mismatch
- Run DELETE statements first to clear old data
- Check for duplicate key errors
- Verify source data integrity

## Error Messages

| Error | Solution |
|-------|----------|
| `psql: command not found` | Install PostgreSQL client |
| `FATAL: password authentication failed` | Check DATABASE_URL credentials |
| `SSL connection is required` | Add `?sslmode=require` to URL |
| `duplicate key value` | Clear existing data first |
| `relation does not exist` | Database schema not initialized |

## Next Steps

After successful import:
1. Visit your production site
2. Verify map shows restaurants
3. Test search functionality
4. Check vegan scores display

## Support

If you encounter issues:
1. Check error logs
2. Verify DATABASE_URL
3. Contact support@replit.com
4. Post on ask.replit.com