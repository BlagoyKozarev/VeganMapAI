#!/bin/bash
# List exactly which 38 files are missing

echo "📋 Listing all 38 missing files:"
echo "=================================="

COUNTER=0
git ls-files | while IFS= read -r file; do
  if [ ! -f "$file" ]; then
    ((COUNTER++))
    echo "$COUNTER. $file"
  fi
done

echo ""
echo "=================================="
echo "Total missing files: $(git ls-files | while read f; do [ ! -f "$f" ] && echo 1; done | wc -l)"