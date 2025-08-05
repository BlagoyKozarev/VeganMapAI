# 🚨 URGENT: Fix Production Database

## Problem
Production site shows "Loading restaurants" because the production database is empty (0 restaurants).

## Quick Fix Instructions

### Option 1: Use Replit Database Pane (EASIEST)
1. Open the **Database** pane in Replit (left sidebar)
2. Switch to **Production** database 
3. Import the `restaurants-export.json` file
4. Restaurants will appear immediately on the live site

### Option 2: Manual Import via Console
1. Open Replit Shell
2. Set production environment:
   ```bash
   export NODE_ENV=production
   export DATABASE_URL="your-production-database-url"
   ```
3. Run import script:
   ```bash
   tsx import-restaurants.ts
   ```

### Option 3: Copy Database URL from Deployment
1. Go to Deployments tab
2. Click on your deployment
3. Go to "Environment Variables"
4. Copy the production DATABASE_URL
5. Run: `DATABASE_URL="paste-url-here" tsx import-restaurants.ts`

## What This Does
- Imports 408 restaurants with vegan scores
- Populates production database
- Makes the map work immediately

## Verification
After import, check: https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data
Should show `"count": 354` instead of `"count": 0`

## Data Exported
- 408 total restaurants
- 354 with AI vegan scores
- All Sofia locations
- File: `restaurants-export.json` (ready to import)