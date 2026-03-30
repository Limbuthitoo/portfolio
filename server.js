// Standalone Next.js server for cPanel
// This uses the self-contained build from .next/standalone — no node_modules needed
const path = require("path");
const fs = require("fs");

// Copy .env.local into standalone dir so Next.js can find it
const rootEnv = path.join(__dirname, ".env.local");
const standaloneEnv = path.join(__dirname, ".next", "standalone", ".env.local");
if (fs.existsSync(rootEnv)) {
  fs.copyFileSync(rootEnv, standaloneEnv);
}

// Let the standalone server bind to localhost
// cPanel Passenger will proxy to it
process.env.HOSTNAME = "127.0.0.1";
process.env.PORT = process.env.PORT || "3000";

process.chdir(path.join(__dirname, ".next", "standalone"));
require(path.join(__dirname, ".next", "standalone", "server.js"));
