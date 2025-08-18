# GCS CDN Integration for VeganMapAI

## Overview
Integration of Google Cloud Storage (GCS) as a Content Delivery Network (CDN) for serving GeoJSON restaurant data with improved performance and global distribution.

## Architecture

### Current Implementation
1. **Local GeoJSON Generation**: `scripts/export-geojson.js`
2. **File Location**: `sofia.geojson` (363KB, 511 restaurants)
3. **API Endpoint**: `/api/restaurants/geojson`
4. **Static Serving**: Available for CDN upload

### GCS CDN Structure
```
gs://veganmapai-cdn/
├── geojson/
│   └── sofia.geojson
└── assets/
    └── (future static assets)
```

## Implementation Steps

### 1. GeoJSON Export ✅
- **Script**: `scripts/export-geojson.js`
- **Output**: `sofia.geojson` (363,070 bytes)
- **Features**: 511 restaurants with full metadata
- **Format**: RFC 7946 compliant GeoJSON

### 2. API Endpoint ✅
- **URL**: `GET /api/restaurants/geojson`
- **Headers**:
  - `Content-Type: application/geo+json`
  - `Cache-Control: public, max-age=3600`
  - `Access-Control-Allow-Origin: *`
- **Status**: Working and serving 511 restaurants

### 3. GCS Upload Script 🟡
- **Script**: `scripts/upload-geojson-gcs.sh`
- **Bucket**: `veganmapai-cdn`
- **Path**: `geojson/sofia.geojson`
- **Status**: Ready, needs authentication

## Environment Configuration

### Required Variables (.env.gcs)
```env
# GCS CDN URLs
VITE_GEOJSON_CDN_URL=https://storage.googleapis.com/veganmapai-cdn/geojson/sofia.geojson
VITE_GEOJSON_FALLBACK_URL=/api/restaurants/geojson

# GCS Configuration
GCS_BUCKET_NAME=veganmapai-cdn
GCS_PROJECT_ID=centered-inn-460216-r9
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

## CDN Benefits

### Performance Improvements
- **Global Distribution**: Reduced latency worldwide
- **Edge Caching**: 24-hour cache with immutable headers
- **Bandwidth Optimization**: Offload from main server
- **Compression**: Automatic gzip/brotli compression

### Server Load Reduction
- **Static Serving**: No database queries for map data
- **Reduced API Calls**: Direct CDN access
- **Improved Availability**: CDN redundancy

## Integration Strategy

### Frontend Implementation
```typescript
// CDN-first approach with fallback
const GEOJSON_CDN_URL = import.meta.env.VITE_GEOJSON_CDN_URL;
const GEOJSON_FALLBACK_URL = import.meta.env.VITE_GEOJSON_FALLBACK_URL;

async function loadRestaurantData() {
  try {
    // Try CDN first
    const response = await fetch(GEOJSON_CDN_URL);
    if (response.ok) {
      return await response.json();
    }
    throw new Error('CDN not available');
  } catch (error) {
    // Fallback to API
    console.log('Using fallback API endpoint');
    return await fetch(GEOJSON_FALLBACK_URL).then(r => r.json());
  }
}
```

### Deployment Process
1. **Export GeoJSON**: `node scripts/export-geojson.js`
2. **Upload to GCS**: `./scripts/upload-geojson-gcs.sh`
3. **Update Environment**: Set CDN URL
4. **Deploy Frontend**: With CDN integration
5. **Monitor Performance**: Track CDN usage

## Monitoring & Maintenance

### Update Workflow
1. Database changes detected
2. Automatic GeoJSON regeneration
3. CDN upload with versioning
4. Cache invalidation if needed

### Performance Metrics
- **CDN Hit Rate**: Target >95%
- **Load Time**: <500ms for GeoJSON
- **Bandwidth Savings**: Estimated 80%
- **Global Latency**: <200ms worldwide

## Security & Access

### CDN Configuration
- **Public Access**: `allUsers:objectViewer`
- **CORS Headers**: All origins allowed
- **Cache Headers**: `public, max-age=86400, immutable`
- **Content-Type**: `application/geo+json`

### Rate Limiting
- **CDN**: No limits (Google handles)
- **Fallback API**: 60 requests/minute
- **Upload**: Authenticated only

## Status: Ready for Deployment

✅ **GeoJSON Export**: Complete and tested
✅ **API Endpoint**: Working with proper headers
✅ **Upload Script**: Ready for authentication
🟡 **GCS Authentication**: Needs service account
🔄 **Frontend Integration**: Pending CDN deployment
🔄 **Monitoring**: Pending setup

## Next Steps
1. **Provide GCS service account credentials**
2. **Execute CDN upload**: `./scripts/upload-geojson-gcs.sh`
3. **Update environment variables**
4. **Test CDN availability**
5. **Deploy with CDN integration**