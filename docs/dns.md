---
TITLE: VeganMapAI DNS Configuration
VERSION: 2025.09.05
UPDATED_AT: 2025-09-05
OWNER: @bkozarev
SOURCE: script:tools/gen-dns.md.ts
---

# DNS Records for veganmapai.ai

## Current DNS Configuration
- **A @ →** 199.36.158.100 (Firebase Hosting IP)
- **CNAME www →** veganmapai.ai (www redirect to root)
- **CNAME auth →** veganmapai-1a8b7.web.app (Firebase Auth subdomain)
- **TXT @ →** "hosting-site=veganmapai-1a8b7" (Firebase domain verification)

## Firebase Project
- **Project ID:** veganmapai-1a8b7
- **Live URL:** https://veganmapai-1a8b7.web.app
- **Custom Domain:** https://veganmapai.ai (pending SSL verification)

## Status
- ✅ Firebase Hosting configured
- ✅ Domain verification complete
- ⏳ SSL certificate pending (automatic after DNS propagation)

Generated on: 2025-09-05T14:02:50.957Z
