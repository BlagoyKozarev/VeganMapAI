#!/usr/bin/env -S node --loader tsx/esm
/**
 * Master script to regenerate all documentation
 * Usage: npx tsx tools/generate-all.ts
 */

import { execSync } from "child_process";

console.log("🔄 Regenerating all VeganMapAI documentation...\n");

const generators = [
  "tools/gen-dns.md.ts",
  "tools/gen-firebase.md.ts", 
  "tools/gen-architecture.md.ts",
  "tools/gen-readme.md.ts"
];

for (const generator of generators) {
  try {
    console.log(`▶️  Running ${generator}`);
    execSync(`npx tsx ${generator}`, { stdio: 'pipe' });
  } catch (error) {
    console.error(`❌ Failed to run ${generator}:`, error);
    process.exit(1);
  }
}

console.log("\n🔍 Checking documentation freshness...");
try {
  execSync("npx tsx tools/stale-check.ts", { stdio: 'inherit' });
} catch (error) {
  console.error("❌ Stale check failed");
  process.exit(1);
}

console.log("\n✅ All documentation generated successfully!");