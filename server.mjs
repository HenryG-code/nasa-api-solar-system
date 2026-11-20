import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, isAbsolute, join, normalize, relative, sep } from "node:path";
import { createServer } from "node:http";

const PORT = Number(process.env.PORT || 3000);
const ROOT = process.cwd();

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
};

createServer((request, response) => {
  const pathname = (request.url || "/").split("?")[0];
  const requestPath = pathname === "/" ? "/index.html" : pathname;
  let decodedPath;

  try {
    decodedPath = decodeURIComponent(requestPath);
  } catch {
    response.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    response.end("Bad request");
    return;
  }

  const filePath = normalize(join(ROOT, decodedPath));
  const fromRoot = relative(ROOT, filePath);
  const leavesRoot = fromRoot === ".." || fromRoot.startsWith(`..${sep}`);
  const insideRoot = fromRoot !== "" && !leavesRoot && !isAbsolute(fromRoot);

  if (!insideRoot || !existsSync(filePath) || statSync(filePath).isDirectory()) {
    response.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": contentTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-store",
  });

  createReadStream(filePath).pipe(response);
}).listen(PORT, () => {
  console.log(`Universe Atlas is running at http://127.0.0.1:${PORT}`);
});
