import express from "express";
import path from "path";

const router = express.Router();
const ZIP_PATH = path.join(process.cwd(), "share", "veganmapai-share.zip");

router.get("/share/zip", (req, res) => {
  res.set({
    "Cache-Control": "no-store",
    "Content-Type": "application/zip",
    "Content-Disposition": 'attachment; filename="veganmapai-share.zip"',
  });
  res.sendFile(ZIP_PATH);
});

export default router;