#!/usr/bin/env node

/**
 * Script to clean up console.log statements from production code
 * Usage: node clean-console-logs.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const clientSrcPath = path.join(__dirname, 'client', 'src');
let totalRemoved = 0;

function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Match console.log statements (including multiline)
    const consoleLogRegex = /console\.(log|error|warn|info|debug)\s*\([^)]*\);?/g;
    
    // Count matches before removal
    const matches = content.match(consoleLogRegex);
    const matchCount = matches ? matches.length : 0;
    
    if (matchCount > 0) {
      // Remove console.log statements
      content = content.replace(consoleLogRegex, '');
      
      // Clean up empty lines left behind
      content = content.replace(/^\s*[\r\n]/gm, '');
      
      // Write back only if changes were made
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`✓ ${path.relative(__dirname, filePath)} - removed ${matchCount} console statements`);
        totalRemoved += matchCount;
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other non-source directories
      if (!['node_modules', '.git', 'dist', 'build'].includes(file)) {
        walkDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      removeConsoleLogs(filePath);
    }
  });
}

console.log('🧹 Cleaning console.log statements from client code...\n');
walkDirectory(clientSrcPath);
console.log(`\n✨ Total removed: ${totalRemoved} console statements`);