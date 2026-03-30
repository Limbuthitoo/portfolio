// Standalone Next.js server for cPanel
// This uses the self-contained build from .next/standalone — no node_modules needed
const path = require("path");
process.chdir(path.join(__dirname, ".next", "standalone"));
require(path.join(__dirname, ".next", "standalone", "server.js"));
