REPLIT AGENT — FROM MOCKUP TO REAL PROJECT + GIT + DEPLOY + README

Цел:
Да превърнем мокъпа в работещ проект, да запазим всички текущи функции (overlay, filters, score panel, clusters), да подготвим Git и деплой, и да добавим README.md.

============================================================
# Step 1: Project layout (keep everything we already built)
============================================================
- Ensure public assets and pages are organized:

  /public/
    index.html                ← home (new)
    /pages/
      mock-step1.html         ← legacy mock (keep for reference)
      settings.html           ← theme settings page
      api.html                ← API early access landing
      score-methodology.html  ← Vegan Score docs
    /assets/
      /css/
        map-ux.css            ← overlay UI
        map-cluster.css       ← cluster minimal styling
      /js/
        map-ux.js             ← overlay behavior (search pill, chips, FABs, sheet, drawer)
        map-wire.js           ← data loading, filters, Leaflet + clustering glue
      /data/
        places.json           ← fallback data
      icons.svg               ← final icon sprite

- The map page remains available at: /test-map  (uses Leaflet + markercluster + our JS/CSS)
- Make sure /public is the static root.

============================================================
# Step 2: Create /public/index.html (home integrating the map)
============================================================
1) Create /public/index.html with:
   - Header (Search + Sign in)
   - Hero (short value prop)
   - A "Launch map" CTA that links to /test-map
   - Footer links to /pages/settings.html, /pages/api.html, /pages/score-methodology.html

2) Keep /test-map as the primary map experience (already functional).

(Note: If index.html already exists, update it to match the above; DO NOT remove /test-map.)

============================================================
# Step 3: Verify script/css includes on /test-map
============================================================
At the bottom of /test-map HTML, before </body>, ensure this exact order:

  <link rel="stylesheet" href="/assets/css/map-ux.css">
  <link rel="stylesheet" href="/assets/css/map-cluster.css"><!-- minimal cluster style -->
  <!-- Leaflet + MarkerCluster must be loaded earlier on the page -->
  <script src="/assets/js/map-ux.js"></script>
  <script src="/assets/js/map-wire.js"></script>
  <script>
    window.VM_UX && window.VM_UX.init();
    window.VM_WIRE && window.VM_WIRE.init();
  </script>

Also ensure Leaflet + markercluster are included (CDN):
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css">
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css">
  <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

============================================================
# Step 4: Server (static or Node/Express)
============================================================
A) Static-only deploy (GitHub Pages/Netlify/Vercel-static): use /public as site root.

B) Node/Express (optional for future API):
   - Create server.js at repo root (if not present):

     const express = require('express');
     const path = require('path');
     const app = express();
     app.use(express.static(path.join(__dirname, 'public')));
     const PORT = process.env.PORT || 3000;
     app.listen(PORT, () => console.log('Server running on :' + PORT));

   - In package.json add:
     {
       "name": "veganmapai",
       "version": "1.0.0",
       "private": true,
       "scripts": {
         "start": "node server.js",
         "build": "echo \"No build step (static files)\""
       },
       "dependencies": {
         "express": "^4.19.2"
       }
     }

============================================================
# Step 5: Git setup
============================================================
1) Create .gitignore at repo root with:
   node_modules/
   .replit
   *.log
   .DS_Store

2) Initialize and push:
   git init
   git add .
   git commit -m "Initial working project: map overlay, filters, clustering, score panel"
   # if main branch differs, adjust accordingly
   git branch -M main
   git remote add origin <GITHUB_REPO_URL>
   git push -u origin main

============================================================
# Step 6: Smoke tests before deploy
============================================================
- /index.html opens (has link to /test-map)
- /test-map:
  - Loads Leaflet map
  - Overlay visible (search pill + chips + FABs)
  - "Use my location" recenters map
  - Clusters visible; hover/active styles applied
  - Search + Only fully vegan + More filters drawer (Apply Filters) all filter markers
  - Click marker → bottom sheet opens; "View Vegan Score" opens right panel
- /pages/api.html loads (modal link from nav if applicable)
- /pages/score-methodology.html loads
- /pages/settings.html (theme light/dark) works; default is light

============================================================
# Step 7: Deploy
============================================================
Option A (Static):
  - Deploy /public to GitHub Pages / Netlify / Vercel (static).
  - Ensure index.html is entry; test all routes.

Option B (Node/Express):
  - Deploy to Render/Railway/Heroku/Vercel-Node.
  - Port must be process.env.PORT or 3000.
  - After deploy, verify the same smoke tests.

============================================================
# Step 8: Add README.md (create/overwrite at repo root)
============================================================

# README.md (paste exactly)

# VeganMapAI
Discover top vegan-friendly places with an AI-driven score and clean, Google Maps–style UI.

## Features
- **Map overlay UI**: search pill, compact chips, floating action buttons (My Location, Profile, AI Assistant).
- **Marker clustering**: Leaflet.markercluster with a minimal, accessible style.
- **Filters**:
  - Quick: *Only fully vegan*, basic search (name / cuisine / address)
  - Drawer (*More filters*): Price, Cuisine, Allergens, Minimum rating
- **Score breakdown**: “View Vegan Score” opens a right-side panel with component weights and details.
- **Theme**: Light by default; Dark optional via Settings.
- **Data loading**: API-first (`/api/places`), with local fallback (`/assets/data/places.json`).

## Project structure