# VeganMapAI Production Monitoring Setup

## UptimeRobot Configuration

### Health Check Monitor
- **URL**: https://www.veganmapai.ai/api/v1/healthz
- **Type**: HTTP(s) 
- **Interval**: 5 minutes
- **Expected Response**: `{"ok":true}`
- **Timeout**: 30 seconds

### Performance Monitor  
- **URL**: https://www.veganmapai.ai/api/v1/version
- **Type**: HTTP(s)
- **Interval**: 15 minutes
- **SLO**: p95 latency < 500ms
- **Timeout**: 10 seconds

### API Endpoints Monitor
- **URL**: https://www.veganmapai.ai/api/v1/map-data?minLat=42.6&minLng=23.2&maxLat=42.8&maxLng=23.5
- **Type**: HTTP(s)
- **Interval**: 30 minutes
- **Expected**: JSON array with restaurants
- **Timeout**: 15 seconds

## Alerting Channels

### Email Alerts
- Primary: admin@veganmapai.ai
- Secondary: backup@veganmapai.ai

### Telegram Webhook (Optional)
- Bot Token: Configure in UptimeRobot
- Chat ID: Production alerts channel

## Log Management

### Access Logs
- Format: JSON structured logging
- Rotation: Daily at midnight
- Retention: 7 days
- Compression: gzip

### Error Logs  
- Level: ERROR, WARN, INFO
- Format: JSON with timestamp, level, message, metadata
- Retention: 14 days for errors

### Metrics Logs
- Prometheus metrics at /api/v1/admin/metrics
- Collection interval: 1 minute
- Retention: 30 days

## Backup Strategy

### Daily Code Backup
```bash
#!/bin/bash
# Backup current deployment
DATE=$(date +%Y%m%d)
git archive --format=tar.gz --output="backup-${DATE}.tar.gz" HEAD
gsutil cp backup-${DATE}.tar.gz gs://veganmapai-backups/
```

### Database Backup
- PostgreSQL dump daily at 02:00 UTC
- Retention: 30 days
- Storage: Replit built-in backup + GCS

### Configuration Backup
- Environment variables (sanitized)
- OpenAPI specifications
- Deployment scripts

## Rollback Procedure

### Git-based Rollback
```bash
# Get previous stable tag
git tag --sort=-version:refname | head -5

# Rollback to specific tag
git checkout tags/v1.0.stable
npm run build
# Redeploy via Replit Deploy button
```

### Emergency Rollback
1. Access Replit project
2. Go to Version Control tab
3. Select last known good commit
4. Click "Restore to this version"
5. Restart deployment

## Performance Baselines

### Response Times (p95)
- `/healthz`: < 50ms
- `/version`: < 100ms  
- `/map-data`: < 500ms
- `/geocode`: < 1000ms

### Throughput
- Peak: 100 req/min
- Sustained: 60 req/min
- Rate limits active: 60/min general, 10/min geocoding

### Resource Usage
- Memory: < 512MB
- CPU: < 50% average
- Disk: < 1GB