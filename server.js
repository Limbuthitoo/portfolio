// Standalone Next.js server for cPanel
// This uses the self-contained build from .next/standalone — no node_modules needed
const path = require("path");

// Let the standalone server bind to all interfaces on whatever port is available
// cPanel Passenger will proxy to it
process.env.HOSTNAME = "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";

process.chdir(path.join(__dirname, ".next", "standalone"));
require(path.join(__dirname, ".next", "standalone", "server.js"));
