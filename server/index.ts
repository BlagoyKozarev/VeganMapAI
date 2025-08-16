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
  // In Replit or production, env vars might be set via secrets/system
}

// Debug environment variables (only in development)
if (process.env.NODE_ENV === 'development') {
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
  console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY);
  console.log('GOOGLE_MAPS_API_KEY exists:', !!process.env.GOOGLE_MAPS_API_KEY);
}

// Validate required environment variables
function validateEnvironment() {
  const required = ['DATABASE_URL', 'OPENAI_API_KEY', 'GOOGLE_MAPS_API_KEY'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing environment variables:', missing);
    console.error('Please ensure .env file contains all required variables');
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  console.log('✅ All required environment variables loaded successfully');
}

// Validate before other imports that might use env vars
validateEnvironment();

import express, { type Request, Response, NextFunction } from "express";
import multer from 'multer';
import cors from "cors";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { health } from "./health.js";
import { initializeDatabase } from "./init-database.js";
import testGBGPTRouter from './routes/testGBGPT.js';
import bulkTestGBGPTRouter from './routes/bulkTestGBGPT.js';
import { geoCache, geoCacheMiddleware } from './middleware/geoCache.js';
import { stt, tts } from './voice.js';

const app = express();

// CORS Configuration
const allowedOrigins = [
  "https://www.veganmapai.ai",
  "https://vegan-map-ai-bkozarev.replit.app",
  "http://localhost:5173",
  process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : undefined
].filter(Boolean);

app.use(cors({
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Allow same-origin requests
    if (allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// Backend in-memory cache with TTL
type CacheEntry<T> = { value: T; expiresAt: number };
const cache = new Map<string, CacheEntry<any>>();
const TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCache<T>(k: string): T | null {
  const e = cache.get(k);
  if (!e) return null;
  if (Date.now() > e.expiresAt) {
    cache.delete(k);
    return null;
  }
  return e.value;
}

function setCache<T>(k: string, v: T, ttl = TTL_MS) {
  cache.set(k, { value: v, expiresAt: Date.now() + ttl });
}

function makeKey(q: any) {
  const { n, s, e, w, profile = "default" } = q;
  return `bbox:${n}:${s}:${e}:${w}:${profile}`;
}

// Clean expired cache entries periodically
setInterval(() => {
  const now = Date.now();
  cache.forEach((entry, key) => {
    if (now > entry.expiresAt) {
      cache.delete(key);
    }
  });
}, TTL_MS);

// Add compression middleware for better performance
app.use(compression({
  level: 6, // Balanced compression level
  threshold: 1024, // Only compress responses > 1KB
  filter: (req: Request, res: Response) => {
    // Compress text-based responses
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  // Standard rate limit handling
  handler: (req, res, next, options) => {
    res.status(options.statusCode).json(options.message);
  }
});

// Apply rate limiting to API routes only
app.use('/api', limiter);

// Health check endpoints (both /health and /healthz)
app.use(health);

app.use(express.json({ limit: '1mb' })); // Limit JSON payload size
app.use(express.urlencoded({ extended: false }));

// Serve static files from public directory
app.use(express.static(path.join(process.cwd(), 'public')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Add geo-cached places endpoint BEFORE other routes
app.get('/api/places', geoCacheMiddleware('places'), async (req, res) => {
  try {
    const { n, s, e, w, profile } = req.query;
    
    // Validate bbox parameters
    if (!n || !s || !e || !w) {
      return res.status(400).json({ 
        error: 'Missing bbox parameters: n (north), s (south), e (east), w (west) required' 
      });
    }
    
    const key = makeKey(req.query);
    console.log(`[Cache] Checking key: ${key}`);
    
    // Check cache first
    const cached = getCache<any[]>(key);
    if (cached) {
      console.log(`[Cache] HIT: Returning ${cached.length} restaurants from cache`);
      return res.json(cached);
    }
    
    console.log(`[Cache] MISS: Fetching fresh data for bbox`);
    
    // For demo purposes, return sample data
    // In real implementation, this would query the database with bbox filtering
    const data = [
      { id: "1", name: "Vegan Spot", lat: 42.695, lng: 23.332, veganScore: 8.7 },
      { id: "2", name: "Green Deli", lat: 42.696, lng: 23.331, veganScore: 7.9 },
    ];
    
    console.log(`[Cache] Storing ${data.length} restaurants in cache`);
    setCache(key, data);
    
    res.json(data);
  } catch (error) {
    console.error('[Places API] Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register main routes
registerRoutes(app);

// Voice Routes
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB limit
app.post("/voice/stt", upload.single("audio"), stt);
app.post("/voice/tts", express.json(), tts);

// Add GBGPT test routes
app.use('/api', testGBGPTRouter);
app.use('/api', bulkTestGBGPTRouter);

// Add public test map routes
app.get('/test-map', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-public.html'));
});

app.get('/test-map-v50', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v50.html'));
});

app.get('/test-map-v60', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v60.html'));
});

app.get('/test-map-v70', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v70.html'));
});

app.get('/test-map-v75', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v75.html'));
});

app.get('/test-map-v76', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v76.html'));
});

app.get('/test-map-v80', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v80.html'));
});

app.get('/test-map-v95', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v95.html'));
});

app.get('/test-map-v96', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v96.html'));
});

app.get('/test-map-v97', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v97.html'));
});

app.get('/test-map-v98', (_req: Request, res: Response) => {
  res.sendFile(path.join(process.cwd(), 'test-map-v98.html'));
});

// Serve public directory for new structure
app.use('/public', express.static(path.join(process.cwd(), 'public')));

(async () => {
  const server = await registerRoutes(app);
  
  // Initialize database with restaurant data if empty (only in development)
  // In production, the database already has the data
  if (process.env.NODE_ENV !== 'production') {
    await initializeDatabase();
  }

  // --- Feedback endpoint ---
  app.post('/api/feedback', async (req: Request, res: Response) => {
    try {
      const { uid, place_id, score_details, comment } = req.body || {};
      if (!uid || !place_id) {
        return res.status(400).json({ error: 'uid and place_id required' });
      }
      // TODO: add Firestore write here when firebase-admin is wired
      console.log('Feedback received:', { uid, place_id, score_details, comment });
      res.json({ ok: true, queued: true });
    } catch (e) {
      console.error('Feedback error:', e);
      res.status(500).json({ error: 'failed' });
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
