#!/usr/bin/env -S node --loader tsx/esm
import fs from "node:fs";

const firebase = {
  project_id: "veganmapai-1a8b7",
  project_name: "VeganMapAI",
  hosting_url: "https://veganmapai-1a8b7.web.app",
  custom_domain: "veganmapai.ai",
  auth_providers: ["Google", "Apple", "Facebook", "Twitter"],
  ga4_id: "G-2Q6WZ51YKV"
};

const md = `---
TITLE: Firebase Configuration & Authentication
VERSION: 2025.09.05  
UPDATED_AT: ${new Date().toISOString().slice(0,10)}
OWNER: @bkozarev
SOURCE: script:tools/gen-firebase.md.ts
---

# Firebase Project Configuration

## Project Details
- **Project ID:** ${firebase.project_id}
- **Project Name:** ${firebase.project_name}
- **Hosting URL:** ${firebase.hosting_url}
- **Custom Domain:** ${firebase.custom_domain}

## Authentication Providers
${firebase.auth_providers.map(provider => `- ✅ ${provider}`).join('\n')}

## Services Enabled
- ✅ **Hosting** - Static site deployment with PWA support
- ✅ **Authentication** - OAuth providers + custom domains
- ✅ **Analytics** - GA4 tracking (${firebase.ga4_id})
- ✅ **Admin SDK** - Server-side authentication

## Domain Configuration
- **Primary:** veganmapai.ai
- **WWW:** www.veganmapai.ai → veganmapai.ai (redirect)
- **Auth:** auth.veganmapai.ai → Firebase Auth

## Security Configuration
- ✅ HTTPS enforced
- ✅ CORS configured for API access
- ✅ Service Worker cache headers: no-cache, no-store, must-revalidate
- ✅ Firebase Admin SDK with token verification

## Recent Changes
- **2025-09-05:** PWA Service Worker headers fixed with radical no-cache approach
- **2025-08-19:** Complete Firebase secrets integration and Admin SDK setup
- **2025-08-18:** GCS CDN integration for restaurant data

Generated on: ${new Date().toISOString()}
`;

fs.writeFileSync("docs/firebase.md", md);
console.log("✅ Generated docs/firebase.md");