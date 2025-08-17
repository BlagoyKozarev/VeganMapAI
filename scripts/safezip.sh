#!/bin/bash
# SafeZip script for VeganMapAI share functionality
# Creates a safe ZIP package with project files

echo "🔄 Starting VeganMapAI share refresh..."

# Create share directory if it doesn't exist
mkdir -p share

# Create a temporary manifest
cat > share/manifest.json << EOF
{
  "name": "VeganMapAI Share",
  "version": "1.0.0",
  "description": "VeganMapAI project share package",
  "files": [
    "README.md",
    "package.json",
    "client/src/components/ui/button.tsx"
  ],
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
  "size": 0
}
EOF

# Create ZIP with safe files (avoid large/sensitive files)
echo "📦 Creating ZIP package..."
zip -q share/veganmapai-share.zip \
  README.md \
  package.json \
  client/src/components/ui/button.tsx 2>/dev/null || true

# Update manifest with actual file size
if [ -f "share/veganmapai-share.zip" ]; then
  ZIP_SIZE=$(stat -c%s "share/veganmapai-share.zip" 2>/dev/null || stat -f%z "share/veganmapai-share.zip" 2>/dev/null || echo "0")
  
  # Update manifest with actual size
  cat > share/manifest.json << EOF
{
  "name": "VeganMapAI Share",
  "version": "1.0.0", 
  "description": "VeganMapAI project share package",
  "files": [
    "README.md",
    "package.json",
    "client/src/components/ui/button.tsx"
  ],
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
  "size": ${ZIP_SIZE}
}
EOF

  echo "✅ ZIP package created successfully (${ZIP_SIZE} bytes)"
else
  echo "❌ Failed to create ZIP package"
  exit 1
fi

echo "🎉 Share refresh completed!"