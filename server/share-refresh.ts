import express from "express";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const router = express.Router();
let isRefreshing = false;

// POST /share/refresh - Trigger share refresh via safezip.sh
router.post("/share/refresh", async (req, res) => {
  if (isRefreshing) {
    return res.status(429).json({
      error: "Refresh already in progress",
      code: 429,
      stdout: "",
      stderr: "Another refresh operation is currently running"
    });
  }

  isRefreshing = true;
  
  try {
    const scriptPath = path.join(process.cwd(), "scripts", "safezip.sh");
    
    // Check if script exists
    if (!fs.existsSync(scriptPath)) {
      isRefreshing = false;
      return res.status(404).json({
        error: "Script not found",
        code: 404,
        stdout: "",
        stderr: `Script not found at ${scriptPath}`
      });
    }

    // Make script executable
    try {
      fs.chmodSync(scriptPath, 0o755);
    } catch (chmodError) {
      // Ignore chmod errors, script might already be executable
    }

    const child = spawn("bash", [scriptPath], {
      cwd: process.cwd(),
      stdio: ["pipe", "pipe", "pipe"]
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      isRefreshing = false;
      res.json({
        code: code || 0,
        stdout: stdout.trim(),
        stderr: stderr.trim()
      });
    });

    child.on("error", (error) => {
      isRefreshing = false;
      res.status(500).json({
        error: "Script execution failed",
        code: 500,
        stdout: stdout.trim(),
        stderr: `Execution error: ${error.message}`
      });
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (isRefreshing) {
        child.kill("SIGTERM");
        isRefreshing = false;
        res.status(408).json({
          error: "Script execution timeout",
          code: 408,
          stdout: stdout.trim(),
          stderr: "Script execution timed out after 30 seconds"
        });
      }
    }, 30000);

  } catch (error) {
    isRefreshing = false;
    res.status(500).json({
      error: "Internal server error",
      code: 500,
      stdout: "",
      stderr: error instanceof Error ? error.message : "Unknown error"
    });
  }
});

export default router;