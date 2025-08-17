// Load environment variables FIRST - before any other imports
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

// Configure dotenv with explicit path
const envPath = path.join(process.cwd(), '.env');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('📁 Loading environment from .env file:', envPath);
  config({ path: envPath });
} else {
  console.log('🔐 Using environment variables from system/secrets');
}

// Validate required environment variables
function validateEnvironment() {
  const required = ['DATABASE_URL', 'OPENAI_API_KEY', 'GOOGLE_MAPS_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  console.log('✅ All required environment variables loaded successfully');
}

validateEnvironment();

import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import compression from "compression";
import { registerRoutes, apiRouter } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { initializeDatabase } from "./init-database.js";
import shareRouter from "./share-route";
import shareRefreshRouter from "./share-refresh";
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { Client } from '@googlemaps/google-maps-services-js';
import client from 'prom-client';

// Prometheus metrics setup
const reg = new client.Registry();
reg.setDefaultLabels({ app: 'veganmapai' });

client.collectDefaultMetrics({
  register: reg,
  prefix: 'veganmapai_',
  gcDurationBuckets: [0.05, 0.1, 0.2, 0.5, 1, 2]
});

const httpRequestDuration = new client.Histogram({
  name: 'veganmapai_http_request_duration_seconds',
  help: 'HTTP request duration',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
  registers: [reg]
});
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("trust proxy", 1);

// 1) security + json
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer({ method: req.method, route: req.path });
  res.on('finish', () => end({ status_code: String(res.statusCode) }));
  next();
});

// 2) CORS with allowlist
const allowlist = [
  'https://www.veganmapai.ai',
  'https://veganmapai.ai',
  'https://vegan-map-ai-bkozarev.replit.app',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    cb(null, allowlist.includes(origin));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Commit header для валидация на deployment
app.use((req, res, next) => { 
  res.setHeader('X-App-Commit', process.env.GIT_SHA ?? 'dev'); 
  next(); 
});

// Ping endpoint for health checks
app.get("/__ping", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// Share endpoints (before API and static)
app.use(shareRouter);
app.use(shareRefreshRouter);

// 3) API v1 endpoints inline - ПЪРВО добавяме v1
const publicLimiter = rateLimit({ windowMs: 60_000, max: 60 });
const geoLimiter = rateLimit({ windowMs: 60_000, max: 10 });

app.get('/api/v1/healthz', publicLimiter, (req, res) => res.json({ ok: true, ts: Date.now() }));
app.get('/api/v1/version', publicLimiter, (req, res) =>
  res.json({
    git_sha: process.env.GIT_SHA ?? 'dev',
    node_env: process.env.NODE_ENV ?? 'dev'
  })
);

// OpenAPI JSON
app.get('/api/v1/openapi.json', publicLimiter, (req, res) => {
  const p = join(process.cwd(), 'server', 'api', 'openapi.v1.json');
  res.type('application/json').send(readFileSync(p, 'utf-8'));
});

// Swagger UI with Basic Auth in production
const openapiPath = join(process.cwd(), 'server', 'api', 'openapi.v1.json');
const openapiDoc = JSON.parse(readFileSync(openapiPath, 'utf-8'));

const swaggerAuth = (req: any, res: any, next: any) => {
  if (process.env.NODE_ENV !== 'production') return next();
  
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Docs"');
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  const credentials = Buffer.from(auth.slice(6), 'base64').toString().split(':');
  const username = credentials[0];
  const password = credentials[1];
  
  if (username === process.env.SWAGGER_USER && password === process.env.SWAGGER_PASS) {
    return next();
  }
  
  res.setHeader('WWW-Authenticate', 'Basic realm="Swagger Docs"');
  return res.status(401).json({ error: 'Invalid credentials' });
};

app.use('/api/v1/docs', swaggerAuth, swaggerUi.serve, swaggerUi.setup(openapiDoc));

// Геокодиране
const gmaps = new Client({});
const geoCache = new Map<string, any>();
app.get('/api/v1/geocode', geoLimiter, async (req, res) => {
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

// Reviews placeholder
app.get('/api/v1/restaurants/:id/reviews', publicLimiter, async (req, res) => {
  const id = String(req.params.id);
  res.json({ count: 0, items: [] });
});

// Admin metrics endpoint with protection in production
app.get('/api/v1/admin/metrics', (req, res, next) => {
  if (process.env.NODE_ENV === 'production') {
    return req.headers['x-metrics-token'] === process.env.METRICS_TOKEN ? next() : res.status(401).end();
  }
  next();
}, async (req, res) => {
  res.set('Content-Type', reg.contentType);
  res.set('Cache-Control', 'no-store');
  res.end(await reg.metrics());
});

// Map-data alias (forward to legacy)
app.get('/api/v1/map-data', publicLimiter, async (req, res) => {
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  req.url = '/restaurants/public/map-data' + qs;
  return apiRouter(req, res, () => {});
});

// Recommend alias (forward to legacy)
app.get('/api/v1/recommend', publicLimiter, (req, res, next) => {
  const qs = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
  req.url = '/recommend' + qs;
  req.originalUrl = req.originalUrl.replace('/api/v1/recommend', '/api/recommend');
  return apiRouter(req, res, next);
});

// Emergency-load alias (forward to legacy)
app.post('/api/v1/emergency-load', publicLimiter, (req, res, next) => {
  req.url = '/emergency-load';
  req.originalUrl = req.originalUrl.replace('/api/v1/emergency-load', '/api/emergency-load');
  return apiRouter(req, res, next);
});

// 4) API РУТЕР – общия след v1
app.use('/api', apiRouter);

// 4) Static serving - dist/public folder (Vite output)
const distPath = path.join(process.cwd(), 'dist', 'public');

// Cache bust headers for HTML
app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.set('Cache-Control', 'no-store');
  }
  next();
});

// Static assets with proper cache headers
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { maxAge: '0', etag: false }));
  app.get('/manifest.json', (_, res) => res.sendFile(path.join(distPath, 'manifest.json')));
  app.get('/service-worker.js', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.sendFile(path.join(distPath, 'service-worker.js'));
  });
  
  // 5) SPA fallback - serve index.html for non-API routes
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/share/')) {
      // Add proper JSON 404 for API routes
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ ok: false, error: "Not Found" });
      }
      return next();
    }
    res.set('Cache-Control', 'no-store');
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
  throw err;
});

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize database with restaurant data if empty
  await initializeDatabase();

  // Setup Vite in development or serve static files in production
  // Important: setupVite must come AFTER API routes are registered
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();