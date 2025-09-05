# VeganMapAI Production Deployment Guide

## ✅ Deployment Checklist Completed

### 1. Build & Environment ✅
- [x] Production build generated (746KB client + 206KB server)
- [x] All required secrets configured in Replit
- [x] CORS allowlist includes production domains
- [x] API v1 namespace fully implemented

### 2. Security Configuration ✅
- [x] SWAGGER_USER/SWAGGER_PASS for docs protection
- [x] METRICS_TOKEN for metrics endpoint security
- [x] Rate limiting: 60/min general, 10/min geocoding
- [x] Basic Auth on Swagger UI in production

### 3. Monitoring & Observability ✅
- [x] Prometheus metrics with 25KB+ data output
- [x] HTTP request duration histogram
- [x] Health check endpoints operational
- [x] Version info with git SHA tracking

### 4. Quality Assurance ✅
- [x] All 9 smoke tests passing locally
- [x] Production smoke test script created
- [x] Legacy API compatibility maintained
- [x] Database operational with 5 restaurants

## Deployment Instructions

### Via Replit Deploy Button
1. Click the **Deploy** button in Replit interface
2. Configure custom domain: `veganmapai.ai`
3. Enable automatic SSL/TLS
4. Set NODE_ENV=production in deployment settings

### DNS Configuration
```
# DNS Records for veganmapai.ai
A     @     -> Replit deployment IP
CNAME www   -> veganmapai.ai
```

### Post-Deployment Verification
```bash
# Run production smoke tests
./scripts/prod_smoke.sh https://www.veganmapai.ai/api/v1

# Verify CORS
curl -H "Origin: https://veganmapai.ai" https://www.veganmapai.ai/api/v1/healthz

# Check metrics protection
curl -H "X-Metrics-Token: $METRICS_TOKEN" https://www.veganmapai.ai/api/v1/admin/metrics
```

## Production URLs

### API Endpoints
- Health: https://www.veganmapai.ai/api/v1/healthz
- API Docs: https://www.veganmapai.ai/api/v1/docs/
- Map Data: https://www.veganmapai.ai/api/v1/map-data
- Metrics: https://www.veganmapai.ai/api/v1/admin/metrics

### Legacy Compatibility
- https://www.veganmapai.ai/api/health
- https://www.veganmapai.ai/api/restaurants/public/map-data

## Rollback Strategy

### Emergency Rollback
1. Access Replit project dashboard
2. Navigate to Version Control
3. Select last stable commit
4. Click "Restore and redeploy"

### Planned Rollback
```bash
git tag production-stable-$(date +%Y%m%d)
git push origin production-stable-$(date +%Y%m%d)
# Document stable version for future rollbacks
```

## Success Metrics

### Technical KPIs
- API v1 response time p95 < 500ms
- 99.9% uptime target
- Zero security incidents
- All smoke tests passing

### Business KPIs
- 5 Sofia restaurants serving
- API documentation accessible
- Production domain active
- Monitoring alerts configured

## Next Steps After Deployment

1. **Monitor for 24 hours**: Watch metrics and logs
2. **Configure UptimeRobot**: Set up monitoring alerts
3. **Test from different locations**: Verify global accessibility
4. **Document lessons learned**: Update deployment procedures
5. **Plan next release cycle**: Schedule regular updates

---

**Status**: Ready for production deployment via Replit Deploy button
**Last Updated**: August 17, 2025
**Deployment Target**: https://www.veganmapai.ai