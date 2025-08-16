# Git Commands for VeganMapAI

## Option 1: Clean Git Start (Recommended)
```bash
# Remove existing git (if any)
rm -rf .git

# Initialize fresh repository
git init

# Add all files
git add .

# Initial commit
git commit -m "Initial commit: VeganMapAI production-ready with 477 restaurants"
```

## Option 2: Continue with existing Git
```bash
# Check current status
git status

# Add any new files
git add .

# Commit changes
git commit -m "Production structure ready: public folder, landing page, documentation"
```

## Push to GitHub
```bash
# Add remote (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/veganmapai.git

# Push to main branch
git push -u origin main
```

## Deploy Options

### GitHub Pages (Static)
1. Go to Settings → Pages
2. Source: Deploy from branch
3. Branch: main
4. Folder: /public
5. Save

### Netlify (Static)
1. Connect GitHub repo
2. Build command: (leave empty)
3. Publish directory: public
4. Deploy

### Vercel (Static)
1. Import from GitHub
2. Framework Preset: Other
3. Output Directory: public
4. Deploy

### For Node.js deployment (Render/Railway)
Use the full project with server.js