#!/usr/bin/env -S node --loader tsx/esm
import fs from "node:fs";
import path from "node:path";

const ROOT = "docs";
const MAX_AGE_DAYS = 30;
const errors: string[] = [];

function walk(dir: string) {
  if (!fs.existsSync(dir)) {
    console.log(`📁 Directory ${dir} doesn't exist yet`);
    return;
  }
  
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    const st = fs.statSync(p);
    
    if (st.isDirectory() && !f.startsWith('archive')) {
      walk(p);
    } else if (p.endsWith(".md")) {
      const txt = fs.readFileSync(p, "utf8");
      
      // Check for UPDATED_AT metadata
      const m = txt.match(/UPDATED_AT:\s*(\d{4}-\d{2}-\d{2})/);
      if (!m) { 
        errors.push(`❌ ${p}: missing UPDATED_AT metadata`); 
        continue; 
      }
      
      // Check document age
      const d = new Date(m[1]);
      const age = (Date.now() - d.getTime()) / (24 * 60 * 60 * 1000);
      if (age > MAX_AGE_DAYS) {
        errors.push(`⚠️  ${p}: stale for ${Math.floor(age)} days`);
      }
      
      // Check for SOURCE script reference
      if (!/SOURCE:\s*script:tools\//.test(txt)) {
        errors.push(`📝 ${p}: missing SOURCE script reference`);
      } else {
        console.log(`✅ ${p}: fresh and generated`);
      }
    }
  }
}

console.log(`🔍 Checking docs freshness (max age: ${MAX_AGE_DAYS} days)`);
walk(ROOT);

if (errors.length) { 
  console.error(`\n❌ Found ${errors.length} issues:\n${errors.join("\n")}`); 
  process.exit(1); 
}

console.log("\n🎉 All docs are fresh and properly generated!");