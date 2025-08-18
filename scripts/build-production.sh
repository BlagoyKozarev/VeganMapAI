#!/usr/bin/env bash
set -euo pipefail

echo "[BUILD] Starting production build process..."
echo ""

# Step 1: Replace date placeholders
echo "[BUILD] Step 1: Replacing date placeholders"
bash scripts/replace_date.sh

# Step 2: Build frontend
echo ""
echo "[BUILD] Step 2: Building frontend with Vite"
vite build

# Step 3: Build backend
echo ""
echo "[BUILD] Step 3: Building backend server"
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo ""
echo "[BUILD] ✅ Production build complete!"
echo "[BUILD] Frontend: dist/ directory"
echo "[BUILD] Backend: dist/index.js"
echo "[BUILD] Ready for deployment"