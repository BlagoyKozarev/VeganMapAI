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
import shareRouter from "./share-route.js";
import shareRefreshRouter from "./share-refresh.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set("trust proxy", 1);

// 1) security + json
app.disable('x-powered-by');
app.use(express.json({ limit: '1mb' }));

// 2) CORS (ограничи по origin)
const allow = [
  'https://vegan-map-ai-bkozarev.replit.app',
  'http://localhost:5000',
  'http://127.0.0.1:5000'
];
app.use(cors({
  origin: (o, cb) => !o || allow.includes(o) ? cb(null, true) : cb(null, false),
  credentials: false,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Commit header для валидация на deployment
app.use((req, res, next) => { 
  res.setHeader('X-App-Commit', process.env.GIT_SHA ?? 'dev'); 
  next(); 
});

// 3) API РУТЕР – ПРЕДИ Vite/статиката и всеки catch-all
app.use('/api', apiRouter);

// Share endpoints
app.use('/', shareRouter);
app.use('/', shareRefreshRouter);

// 4) static/PWA
const distDir = path.join(__dirname, "../dist/public");
if (fs.existsSync(distDir)) {
  app.use('/assets', express.static(path.join(distDir, 'assets'), { maxAge: '7d', immutable: true }));
  app.get('/manifest.json', (_, res) => res.sendFile(path.join(distDir, 'manifest.json')));
  app.get('/service-worker.js', (req, res) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.sendFile(path.join(distDir, 'service-worker.js'));
  });
  
  // 5) SPA fallback (само за НЕ-API)
  app.get('*', (req, res, next) => req.path.startsWith('/api/') ? next() : res.sendFile(path.join(distDir, 'index.html')));
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
  
  // Initialize database with restaurant data if empty (only in development)
  if (process.env.NODE_ENV !== 'production') {
    await initializeDatabase();
  }

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