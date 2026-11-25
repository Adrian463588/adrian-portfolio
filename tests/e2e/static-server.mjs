import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const outDir = path.resolve(process.cwd(), "out");
const port = Number(process.env.PORT || 4173);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url || "/", `http://127.0.0.1:${port}`);
  const safeRel = path.normalize(decodeURIComponent(reqUrl.pathname)).replace(/^(\.\.(\/|\\|$))+/, "");
  let target = path.join(outDir, safeRel);

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    target = path.join(target, "index.html");
  } else if (!fs.existsSync(target) && !path.extname(target)) {
    const htmlCandidate = `${target}.html`;
    const indexCandidate = path.join(target, "index.html");
    if (fs.existsSync(indexCandidate)) target = indexCandidate;
    else if (fs.existsSync(htmlCandidate)) target = htmlCandidate;
  }

  if (!target.startsWith(outDir) || !fs.existsSync(target) || fs.statSync(target).isDirectory()) {
    const notFound = path.join(outDir, "404.html");
    res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
    if (fs.existsSync(notFound)) {
      fs.createReadStream(notFound).pipe(res);
    } else {
      res.end("Not Found");
    }
    return;
  }

  const ext = path.extname(target).toLowerCase();
  res.writeHead(200, { "Content-Type": mimeTypes[ext] || "application/octet-stream" });
  fs.createReadStream(target).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log(`Static server listening at http://127.0.0.1:${port}`);
});
