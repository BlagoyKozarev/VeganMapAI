# 🔥 QUICK FIX: Production Database Connection

## Your Current Situation:
✅ Production database has 408 restaurants  
❌ Website shows "Loading restaurants..."  
❌ Deployment can't connect to database  

## 3-MINUTE FIX:

### 1️⃣ Get Your Production DATABASE_URL
Run this command in your terminal:
```bash
echo $DATABASE_URL
```
Copy the output - this is your working database URL.

### 2️⃣ Open Deployment Settings
1. Click **Deployments** tab
2. Click **vegan-map-ai-bkozarev**
3. Click **Environment Variables**

### 3️⃣ Add/Update DATABASE_URL
- **Variable Name:** DATABASE_URL
- **Value:** Paste the URL from step 1
- Click **Save**

### 4️⃣ Add Other Required Variables
Make sure these exist:
```
OPENAI_API_KEY = sk-proj-...
GOOGLE_MAPS_API_KEY = AIzaSy...
NODE_ENV = production
```

### 5️⃣ Redeploy
1. Click **Redeploy** button
2. Wait 2-3 minutes
3. Visit https://vegan-map-ai-bkozarev.replit.app

## Success Check:
- Map loads immediately
- Shows 408 restaurants
- No "Loading..." message

## Still Broken?
The issue is 100% the DATABASE_URL in deployment settings.
Your database has the data - deployment just can't reach it.