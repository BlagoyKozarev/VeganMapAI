import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const ZIP_PATH = path.resolve(__dirname, "../share/veganmapai-share.zip");
const MANIFEST_PATH = path.resolve(__dirname, "../share/manifest.json");

// GET /share/zip - Download ZIP file
router.get("/share/zip", (_req, res) => {
  if (!fs.existsSync(ZIP_PATH)) return res.status(404).send("zip missing");
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
  });
  res.sendFile(ZIP_PATH);
});

// HEAD /share/zip - Get ZIP file headers without body
router.head("/share/zip", (_req, res) => {
  if (!fs.existsSync(ZIP_PATH)) return res.status(404).end();
  const { size, mtime } = fs.statSync(ZIP_PATH);
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
    "Content-Length": String(size),
    "Last-Modified": mtime.toUTCString(),
  });
  res.status(200).end();
});

// GET /share/manifest.json - Get manifest file
router.get("/share/manifest.json", (_req, res) => {
  if (!fs.existsSync(MANIFEST_PATH)) return res.status(404).json({error:"manifest missing"});
  res.set("Cache-Control", "no-store");
  res.sendFile(MANIFEST_PATH);
});

export default router;