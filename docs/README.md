---
TITLE: VeganMapAI Documentation Index
VERSION: 2025.09.05
UPDATED_AT: 2025-09-05
OWNER: @bkozarev
SOURCE: script:tools/gen-readme.md.ts
---

# VeganMapAI Documentation

This documentation is auto-generated and version-controlled to ensure accuracy.

## Current Documentation

### System Configuration
- [🌐 DNS Configuration](dns.md) - Domain setup and DNS records
- [🔥 Firebase Setup](firebase.md) - Hosting, auth, and services
- [🏗️ Architecture Overview](architecture.md) - System design and tech stack

### Project Information
- [📖 Project Guide](../replit.md) - Main project documentation

## Maintenance

All documentation files are generated using scripts in `/tools/`:

```bash
# Generate fresh documentation
npx tsx tools/gen-dns.md.ts
npx tsx tools/gen-firebase.md.ts  
npx tsx tools/gen-architecture.md.ts
npx tsx tools/gen-readme.md.ts

# Check for stale docs
npx tsx tools/stale-check.ts
```

## Archive

Old documentation is preserved in `archive/YYYY-MM-DD/` directories for reference.

---
*Last updated: 2025-09-05*
