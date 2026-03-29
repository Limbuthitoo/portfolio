const path = require("path");
const fs = require("fs");
const { createServer } = require("http");
const { parse } = require("url");

// Resolve symlinked node_modules for cPanel Passenger
let nmPath = path.join(__dirname, "node_modules");
try { nmPath = fs.realpathSync(nmPath); } catch {}
const next = require(path.join(nmPath, "next"));

const app = next({ dir: __dirname, dev: false });
const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res, parse(req.url, true));
  }).listen(port, () => {
    console.log(`> Ready on port ${port}`);
  });
});
