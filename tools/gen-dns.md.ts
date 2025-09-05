#!/usr/bin/env -S node --loader tsx/esm
import fs from "node:fs";

const dns = {
  A_root: "199.36.158.100",
  CNAME_www: "veganmapai.ai", 
  CNAME_auth: "veganmapai-1a8b7.web.app",
  TXT_root: "hosting-site=veganmapai-1a8b7",
  project_id: "veganmapai-1a8b7"
};

const md = `---
TITLE: VeganMapAI DNS Configuration
VERSION: 2025.09.05
UPDATED_AT: ${new Date().toISOString().slice(0,10)}
OWNER: @bkozarev
SOURCE: script:tools/gen-dns.md.ts
---

# DNS Records for veganmapai.ai

## Current DNS Configuration
- **A @ →** ${dns.A_root} (Firebase Hosting IP)
- **CNAME www →** ${dns.CNAME_www} (www redirect to root)
- **CNAME auth →** ${dns.CNAME_auth} (Firebase Auth subdomain)
- **TXT @ →** "${dns.TXT_root}" (Firebase domain verification)

## Firebase Project
- **Project ID:** ${dns.project_id}
- **Live URL:** https://${dns.project_id}.web.app
- **Custom Domain:** https://veganmapai.ai (pending SSL verification)

## Status
- ✅ Firebase Hosting configured
- ✅ Domain verification complete
- ⏳ SSL certificate pending (automatic after DNS propagation)

Generated on: ${new Date().toISOString()}
`;

fs.writeFileSync("docs/dns.md", md);
console.log("✅ Generated docs/dns.md");