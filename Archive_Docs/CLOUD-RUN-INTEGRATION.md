# Cloud Run Integration Complete

## Enhanced Deployment Architecture

VeganMapAI now supports comprehensive Cloud Run deployment with automated environment synchronization.

### Key Components

**Main Deployment Script: `gcp-full-deploy.sh`**
- CDN deployment to Google Cloud Storage
- Cloud Run service updates with environment variables
- Automatic URL discovery and environment sync
- Service: `veganmapai-service` in `europe-central2`

**Bootstrap Script: `gcp-cloud-run-deploy.sh`**
- Complete Cloud Run service deployment from source
- Artifact Registry setup and Docker build
- Service account authentication
- Full production environment bootstrap

### Deployment Flow

1. **Data Export**: PostgreSQL → GeoJSON conversion (407 restaurants)
2. **CDN Upload**: Global distribution via Cloud Storage
3. **Cloud Run Update**: Service environment variables synchronized
4. **Environment Sync**: Local .env files updated with production URLs

### Configuration

**Local Environment (.env.local):**
```bash
NEXT_PUBLIC_API_BASE=http://localhost:5000  # Development
NEXT_PUBLIC_CDN_GEOJSON=https://storage.googleapis.com/veganmapai-cdn-460216r9/geojson/sofia.geojson
CLOUD_RUN_SERVICE=veganmapai-service
CLOUD_RUN_REGION=europe-central2
```

**Production Environment:**
- Managed via Replit secrets system (secure)
- Cloud Run service automatically configured
- CDN URL synchronized across all environments

### Benefits

**Hybrid Architecture:**
- Local development with database access
- Production scaling via Cloud Run
- Global performance through CDN
- Automatic failover between data sources

**Operational Excellence:**
- Single script deployment pipeline
- Environment synchronization
- Service discovery and URL management
- Comprehensive testing and validation

### Usage

**Full Deployment:**
```bash
./gcp-full-deploy.sh
```

**Cloud Run Bootstrap (initial setup):**
```bash
./gcp-cloud-run-deploy.sh
```

Both scripts handle service authentication, environment management, and comprehensive testing automatically.