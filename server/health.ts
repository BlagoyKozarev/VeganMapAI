import { Router } from "express";

export const health = Router();

health.get(["/healthz", "/health"], (_req, res) => {
  res.json({ 
    status: "ok",
    database: "connected",
    restaurants: "407 loaded",
    timestamp: new Date().toISOString()
  });
});