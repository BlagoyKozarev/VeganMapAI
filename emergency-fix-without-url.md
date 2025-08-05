# 🆘 Emergency Fix: If You Don't Have DATABASE_URL

## Option 1: Get from Neon Dashboard
1. Go to https://console.neon.tech
2. Login with your account
3. Find your VeganMapAI project
4. Click **Connection Details**
5. Select **PostgreSQL** connection type
6. Copy the connection string
7. Add `?sslmode=require` at the end

## Option 2: Find in Replit Secrets
1. In your Replit workspace
2. Click the lock icon (Secrets)
3. Look for DATABASE_URL
4. Copy the value

## Option 3: Create New Neon Database
If you can't find your database:
1. Go to https://console.neon.tech
2. Create new project "veganmapai-prod"
3. Get the connection string
4. Run the import script with new URL:
```bash
psql 'your-new-database-url' -f production-import-fixed.sql
```

## What Your DATABASE_URL Should Look Like:
```
postgresql://neondb_owner:npg_YourPasswordHere@ep-your-project-12345678.us-east-2.aws.neon.tech/neondb?sslmode=require
```

Parts:
- `neondb_owner` - Your database username
- `npg_YourPasswordHere` - Your database password
- `ep-your-project-12345678` - Your unique endpoint
- `us-east-2.aws.neon.tech` - Neon server region
- `neondb` - Database name
- `?sslmode=require` - REQUIRED for production