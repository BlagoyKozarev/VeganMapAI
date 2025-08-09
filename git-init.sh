#!/bin/bash

# Initialize Git repository and make first commit
echo "🌱 Initializing VeganMapAI Git repository..."

# Initialize git
git init

# Add all files
git add .

# Make initial commit
git commit -m "Initial commit: VeganMapAI with 477 restaurants, clustering, filters, and deployment-ready structure"

echo "✅ Git repository initialized!"
echo ""
echo "Next steps:"
echo "1. Create a new repository on GitHub"
echo "2. Add remote: git remote add origin https://github.com/YOUR_USERNAME/veganmapai.git"
echo "3. Push: git push -u origin main"
echo ""
echo "For deployment:"
echo "- GitHub Pages: Settings > Pages > Deploy from main branch /public folder"
echo "- Netlify: Connect GitHub repo, set publish directory to 'public'"
echo "- Vercel: Import from GitHub, set output directory to 'public'"