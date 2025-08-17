import express from "express";
import path from "path";
import fs from "fs";

const router = express.Router();
const ZIP_PATH = path.join(process.cwd(), "share", "veganmapai-share.zip");
const MANIFEST_PATH = path.join(process.cwd(), "share", "manifest.json");

// GET /share/zip - Download ZIP file
router.get("/share/zip", (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
  });
  res.sendFile(ZIP_PATH);
});

// HEAD /share/zip - Get ZIP file headers without body
router.head("/share/zip", (req, res) => {
  if (fs.existsSync(ZIP_PATH)) {
    const stats = fs.statSync(ZIP_PATH);
    res.set({
      "Cache-Control": "no-store",
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
      "Content-Length": stats.size.toString(),
      "Last-Modified": stats.mtime.toUTCString(),
    });
    res.status(200).end();
  } else {
    res.status(404).end();
  }
});

// GET /share/manifest.json - Get manifest file
router.get("/share/manifest.json", (req, res) => {
  if (fs.existsSync(MANIFEST_PATH)) {
    res.set({
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    });
    res.sendFile(MANIFEST_PATH);
  } else {
    // Default manifest if file doesn't exist
    const defaultManifest = {
      name: "VeganMapAI Share",
      version: "1.0.0",
      description: "VeganMapAI project share package",
      files: [],
      created: new Date().toISOString(),
      size: 0
    };
    res.set({
      "Cache-Control": "no-store",
      "Content-Type": "application/json",
    });
    res.json(defaultManifest);
  }
});

export default router;