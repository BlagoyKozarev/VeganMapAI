#!/bin/bash
# SafeZip script for VeganMapAI share functionality
# Creates a comprehensive ZIP package with project files

# Configuration
MAX_MB_PER_FILE=${MAX_MB_PER_FILE:-8}
MAX_FILES=${MAX_FILES:-40000}
MAX_BYTES_PER_FILE=$((MAX_MB_PER_FILE * 1024 * 1024))

echo "🔄 Starting VeganMapAI comprehensive share refresh..."
echo "📋 Config: MAX_MB_PER_FILE=${MAX_MB_PER_FILE}, MAX_FILES=${MAX_FILES}"

# Create share directory if it doesn't exist
mkdir -p share

# Read include patterns from assist.include if it exists
INCLUDE_PATTERNS=()
if [ -f "assist.include" ]; then
  while IFS= read -r pattern; do
    [ -n "$pattern" ] && [ "${pattern:0:1}" != "#" ] && INCLUDE_PATTERNS+=("$pattern")
  done < assist.include
else
  # Fallback patterns
  INCLUDE_PATTERNS=("README.md" "package.json" "client/src/components/ui/button.tsx")
fi

echo "📦 Collecting files based on ${#INCLUDE_PATTERNS[@]} patterns..."

# Find all files matching patterns, excluding sensitive/large files
TEMP_LIST=$(mktemp)
for pattern in "${INCLUDE_PATTERNS[@]}"; do
  find . -name "$pattern" -type f 2>/dev/null >> "$TEMP_LIST" || true
  find . -path "./$pattern" -type f 2>/dev/null >> "$TEMP_LIST" || true
done

# Filter out unwanted directories and files
filtered_files=$(cat "$TEMP_LIST" | grep -v -E '\.(env|pem|key|crt|p12)$' | \
  grep -v -E '/(node_modules|\.next|dist|build|\.git|\.cache|\.venv|venv|__pycache__)/' | \
  sort -u)

# Apply file size and count limits
valid_files=()
file_count=0

while IFS= read -r file; do
  if [ -f "$file" ] && [ $file_count -lt $MAX_FILES ]; then
    file_size=$(stat -c%s "$file" 2>/dev/null || stat -f%z "$file" 2>/dev/null || echo "0")
    if [ "$file_size" -le "$MAX_BYTES_PER_FILE" ]; then
      valid_files+=("$file")
      ((file_count++))
    fi
  fi
done <<< "$filtered_files"

rm -f "$TEMP_LIST"

echo "✅ Found ${#valid_files[@]} valid files to include"

# Create ZIP with collected files
echo "📦 Creating comprehensive ZIP package..."
if [ ${#valid_files[@]} -gt 0 ]; then
  zip -q share/veganmapai-share.zip "${valid_files[@]}" 2>/dev/null || true
else
  # Fallback with basic files
  zip -q share/veganmapai-share.zip README.md package.json 2>/dev/null || true
fi

# Create comprehensive manifest
if [ -f "share/veganmapai-share.zip" ]; then
  ZIP_SIZE=$(stat -c%s "share/veganmapai-share.zip" 2>/dev/null || stat -f%z "share/veganmapai-share.zip" 2>/dev/null || echo "0")
  
  # Create manifest with included files list
  cat > share/manifest.json << EOF
{
  "name": "VeganMapAI Comprehensive Share",
  "version": "2.0.0", 
  "description": "Complete VeganMapAI project package for external analysis",
  "includes": $(printf '%s\n' "${INCLUDE_PATTERNS[@]}" | jq -R . | jq -s .),
  "fileCount": ${#valid_files[@]},
  "maxFileSizeMB": ${MAX_MB_PER_FILE},
  "maxFiles": ${MAX_FILES},
  "created": "$(date -u +"%Y-%m-%dT%H:%M:%S.%3NZ")",
  "size": ${ZIP_SIZE}
}
EOF

  echo "✅ Comprehensive ZIP package created successfully"
  echo "📊 Stats: ${#valid_files[@]} files, ${ZIP_SIZE} bytes"
else
  echo "❌ Failed to create ZIP package"
  exit 1
fi

echo "🎉 Comprehensive share refresh completed!"