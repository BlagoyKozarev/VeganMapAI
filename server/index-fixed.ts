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
import { registerRoutes, router as apiRouter } from "./routes.js";
import { setupVite, serveStatic, log } from "./vite.js";
import { initializeDatabase } from "./init-database.js";

const app = express();
app.set("trust proxy", 1);

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

// Compression and parsing middleware
app.use(compression({
  level: 6,
  threshold: 1024,
  filter: (req: Request, res: Response) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false }));

// API ROUTES FIRST - CRITICAL FOR PRODUCTION
app.use("/api", apiRouter);

// Service worker explicit
app.get("/service-worker.js", (_req, res) => {
  res.type("application/javascript");
  res.sendFile(path.join(__dirname, "../dist/service-worker.js"));
});

// Static files AFTER API
app.use(express.static(path.join(__dirname, "../dist"), { maxAge: "1h" }));

// SPA fallback LAST (non-API only)
app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

// API 404 JSON (catch unmatched /api/*)
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Not found" });
});

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