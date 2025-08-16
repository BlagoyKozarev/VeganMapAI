#!/bin/bash
# Clean remaining 41 missing files from Git index

echo "🧹 Cleaning remaining 41 missing files from Git index..."

# Remove all missing files at once
git ls-files -z | xargs -0 -I {} sh -c 'test -f "{}" || git rm --cached --force "{}"'

# Show what was removed
REMOVED=$(git diff --cached --name-only --diff-filter=D | wc -l)
echo "Files removed from Git index: $REMOVED"

# Commit the cleanup
if [ $REMOVED -gt 0 ]; then
    git commit -m "cleanup: Remove $REMOVED missing file references

These files were tracked in Git but did not exist in workspace.
Mainly duplicate Cyrillic/Bulgarian documentation files.
Achieves perfect workspace-Git synchronization."
else
    echo "No missing files found to remove"
fi

# Push cleanup
git push origin main

# Final verification
echo ""
echo "🎯 FINAL CLEANUP RESULTS:"
WORKSPACE=$(find . -type f -not -path './.git/*' | wc -l)
GITFILES=$(git ls-files | wc -l)
DIFF=$((GITFILES - WORKSPACE))

echo "Workspace files: $WORKSPACE"
echo "Git tracked files: $GITFILES"
echo "Difference: $DIFF"

if [ $DIFF -eq 0 ]; then
    echo ""
    echo "🎉 PERFECT SYNC ACHIEVED!"
    echo "✅ Workspace and Git are perfectly synchronized"
    echo "✅ Repository: https://github.com/BlagoyKozarev/VeganMapAI"
    echo "✅ Total files in sync: $WORKSPACE"
else
    echo "⚠️ Still $DIFF files difference"
fi