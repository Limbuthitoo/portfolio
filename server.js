const path = require("path");
const fs = require("fs");
// Resolve symlinked node_modules for cPanel Passenger
const nm = path.join(__dirname, "node_modules");
try { module.paths.unshift(fs.realpathSync(nm)); } catch { module.paths.unshift(nm); }

const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

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
