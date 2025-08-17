import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { Client } from '@googlemaps/google-maps-services-js';
import { isAuthenticated } from "./replitAuth.js";
import { apiRouter } from "./routes.js";

// Create v1 API router
export const v1Router = Router();

// Rate limits
const publicLimiter = rateLimit({ windowMs: 60_000, max: 60 });
const geoLimiter = rateLimit({ windowMs: 60_000, max: 10 });

v1Router.use(publicLimiter);

// Health + Version
v1Router.get('/healthz', (req, res) => res.json({ ok: true, ts: Date.now() }));
v1Router.get('/version', (req, res) =>
  res.json({
    git_sha: process.env.GIT_SHA ?? 'dev',
    node_env: process.env.NODE_ENV ?? 'dev'
  })
);

// OpenAPI JSON
v1Router.get('/openapi.json', (req, res) => {
  const p = path.join(process.cwd(), 'server', 'api', 'openapi.v1.json');
  res.type('application/json').send(fs.readFileSync(p, 'utf-8'));
});

// Swagger UI
const openapiPath = path.join(process.cwd(), 'server', 'api', 'openapi.v1.json');
const openapiDoc = JSON.parse(fs.readFileSync(openapiPath, 'utf-8'));
v1Router.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiDoc));

// Геокодиране (кеширано в паметта)
const gmaps = new Client({});
const geoCache = new Map<string, any>();
v1Router.get('/geocode', geoLimiter, async (req, res) => {
  try {
    const q = String(req.query.query ?? '').trim();
    if (!q) return res.status(400).json({ error: 'query required' });
    if (geoCache.has(q)) return res.json({ cached: true, result: geoCache.get(q) });

    const r = await gmaps.geocode({
      params: { address: q, key: process.env.GOOGLE_MAPS_API_KEY! }
    });
    geoCache.set(q, r.data);
    res.json({ cached: false, result: r.data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'geocode error' });
  }
});

// Reverse-geocode
v1Router.get('/reverse-geocode', geoLimiter, async (req, res) => {
  try {
    const lat = Number(req.query.lat), lng = Number(req.query.lng);
    if (!isFinite(lat) || !isFinite(lng)) return res.status(400).json({ error: 'lat,lng required' });
    const key = `${lat},${lng}`;
    if (geoCache.has(key)) return res.json({ cached: true, result: geoCache.get(key) });

    const r = await gmaps.reverseGeocode({
      params: { latlng: { lat, lng }, key: process.env.GOOGLE_MAPS_API_KEY! }
    });
    geoCache.set(key, r.data);
    res.json({ cached: false, result: r.data });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? 'reverse error' });
  }
});

// Reviews (минимален scaffold)
v1Router.get('/restaurants/:id/reviews', async (req, res) => {
  const id = String(req.params.id);
  const items: any[] = []; // Temp placeholder
  res.json({ count: items.length, items });
});

v1Router.post('/restaurants/:id/reviews', isAuthenticated, async (req: any, res) => {
  const id = String(req.params.id);
  const userId = req.user?.claims?.sub || 'anonymous';
  const { rating = 0, comment = '' } = req.body || {};
  // Temp response
  res.status(201).json({ ok: true, id: 'tmp-review-id' });
});

// Алиаси към legacy пътища за съвместимост
v1Router.get('/map-data', async (req, res, next) => {
  // Forward to existing map-data endpoint
  req.url = '/restaurants/public/map-data' + (req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '');
  return apiRouter(req, res, next);
});

v1Router.get('/recommend', (req, res, next) => {
  return apiRouter(req, res, next);
});