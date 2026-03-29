const path = require("path");
// Ensure Passenger can find node_modules (cPanel symlink workaround)
module.paths.unshift(path.join(__dirname, "node_modules"));

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
