#!/bin/bash
# Organize attached_assets instead of deleting

echo "🔧 Organizing attached_assets structure..."

# Create archive directories
mkdir -p archive/{documents,images,backups,versions,prompts,temp}

# Move important documents
mv attached_assets/*API*.xlsx archive/documents/ 2>/dev/null
mv attached_assets/*архитектура*.docx archive/documents/ 2>/dev/null
mv attached_assets/*Gemini*.docx archive/documents/ 2>/dev/null

# Move images  
mv attached_assets/image_*.png archive/images/ 2>/dev/null

# Move version backups
mv attached_assets/VeganMapAI*.zip archive/backups/ 2>/dev/null
mv attached_assets/*Extended_Pack*.zip archive/backups/ 2>/dev/null

# Move old versions (keep only if needed)
echo "Found version directories:"
ls -la attached_assets/ | grep "VeganMapAI-main\|upgraded_full\|voice_assistant"

# Move prompts
mv attached_assets/*Prompt*.docx archive/prompts/ 2>/dev/null
mv attached_assets/*Prompt*.txt archive/prompts/ 2>/dev/null

# Move temp pasted files
mv attached_assets/Pasted--* archive/temp/ 2>/dev/null

echo "Organization completed. Review archive/ structure before final cleanup."
ls -la archive/