# 📥 Production Database Import Guide

## Current Status
- **Development DB**: 408 restaurants ✅
- **Production DB**: 0 restaurants ❌
- **Export File**: `restaurants-export.json` (ready) ✅

## Why I Can't Import Directly
I'm running in the development environment and cannot access your production database directly for security reasons. You need to run the import yourself with the production credentials.

## Option 1: Quick Shell Script (Recommended)
Run this command in the Shell:
```bash
./import-to-production.sh
```
The script will:
1. Ask for your production DATABASE_URL
2. Show what will be imported
3. Run the import to production

## Option 2: Manual Import Command
1. Get your production DATABASE_URL:
   - Go to **Deployments** tab
   - Click your deployment
   - Go to **Environment Variables**
   - Copy the `DATABASE_URL`

2. Run in Shell:
```bash
NODE_ENV=production DATABASE_URL="paste-your-url-here" tsx import-restaurants.ts
```

## Option 3: Database Pane (Visual)
1. Open **Database** pane (left sidebar)
2. Switch to **Production** database
3. Use the import feature
4. Select `restaurants-export.json`

## What Happens After Import
- Map will show 354 restaurants immediately
- All vegan scores will be active
- Users can browse without login
- Site will work properly

## Verification
After import, check:
```bash
curl https://vegan-map-ai-bkozarev.replit.app/api/restaurants/public/map-data
```
Should show: `"count": 354` (not 0)

## Need Help?
The production DATABASE_URL looks like:
```
postgresql://username:password@host.neon.tech/database_name
```