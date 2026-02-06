// Snap Dev Server with Hot Reload v0.2
import http from 'http';
import fs from 'fs';
import path from 'path';
import { parse } from './parser.js';
import { compile } from './compiler.js';

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml',
  '.txt': 'text/plain',
};

export function createDevServer(projectDir, port = 3000) {
  const pagesDir = fs.existsSync(path.join(projectDir, 'pages'))
    ? path.join(projectDir, 'pages') : projectDir;
  const clients = new Set();

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`);
    let pathname = url.pathname;

    if (pathname === '/__snap_sse') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive', 'Access-Control-Allow-Origin': '*' });
      clients.add(res);
      req.on('close', () => clients.delete(res));
      return;
    }

    let snapFile;
    if (pathname === '/') snapFile = findSnapFile(pagesDir, 'index');
    else snapFile = findSnapFile(pagesDir, pathname.slice(1).replace(/\/$/, ''));

    if (snapFile) {
      try {
        const source = fs.readFileSync(snapFile, 'utf-8');
        const ast = parse(source, path.dirname(snapFile));
        let html = compile(ast);
        html = html.replace('</body>', `<script>(function(){const e=new EventSource('/__snap_sse');e.onmessage=()=>location.reload();e.onerror=()=>setTimeout(()=>location.reload(),1000)})();</script></body>`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end(`<pre style="color:red;padding:2rem;font-family:monospace">${err.stack}</pre>`);
      }
      return;
    }

    const filePath = path.join(projectDir, pathname);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/html' });
    res.end('<h1>404 Not Found</h1>');
  });

  let watchTimeout;
  function setupWatch() {
    const dirs = [pagesDir];
    if (pagesDir !== projectDir) dirs.push(projectDir);
    for (const dir of dirs) {
      fs.watch(dir, { recursive: true }, (event, filename) => {
        if (filename && filename.endsWith('.snap')) {
          clearTimeout(watchTimeout);
          watchTimeout = setTimeout(() => { for (const c of clients) c.write('data: reload\n\n'); }, 100);
        }
      });
    }
  }

  server.listen(port, () => {
    console.log(`\n  🫰 Snap dev server running at http://localhost:${port}\n`);
    console.log(`  Watching for changes in ${pagesDir}\n`);
    setupWatch();
  });
  return server;
}

function findSnapFile(dir, name) {
  for (const c of [path.join(dir, `${name}.snap`), path.join(dir, name, 'index.snap')]) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export function buildProject(projectDir, outDir) {
  const pagesDir = fs.existsSync(path.join(projectDir, 'pages'))
    ? path.join(projectDir, 'pages') : projectDir;

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const files = findAllSnapFiles(pagesDir);
  const built = [];
  const pages = [];

  for (const file of files) {
    const source = fs.readFileSync(file, 'utf-8');
    const ast = parse(source, path.dirname(file));
    const html = compile(ast);
    const rel = path.relative(pagesDir, file).replace(/\.snap$/, '.html');
    const outFile = path.join(outDir, rel);
    fs.mkdirSync(path.dirname(outFile), { recursive: true });
    fs.writeFileSync(outFile, html);
    built.push(rel);
    pages.push(rel.replace(/\.html$/, '').replace(/index$/, ''));
  }

  // Generate sitemap.xml
  const sitemapEntries = pages.map(p => `  <url><loc>/${p}</loc></url>`).join('\n');
  fs.writeFileSync(path.join(outDir, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>`);

  // Generate robots.txt
  fs.writeFileSync(path.join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n`);

  return built;
}

function findAllSnapFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'dist' && entry.name !== 'node_modules') results.push(...findAllSnapFiles(full));
    else if (entry.name.endsWith('.snap')) results.push(full);
  }
  return results;
}

export function serveStatic(dir, port = 3000) {
  const server = http.createServer((req, res) => {
    let filePath = path.join(dir, req.url === '/' ? 'index.html' : req.url);
    if (!path.extname(filePath)) filePath += '.html';
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404); res.end('Not found');
    }
  });
  server.listen(port, () => console.log(`\n  🫰 Serving at http://localhost:${port}\n`));
}
