const http = require('http');
const fs = require('fs');
const path = require('path');
const { build } = require('./build');

const ROOT = __dirname;
const DIST_DIR = path.join(ROOT, 'dist');
const PORT = process.env.PORT || 4000;
const WATCH_DIRS = ['content', 'templates', 'public', 'build.js'];

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const LIVERELOAD_SCRIPT = `
<script>
  new EventSource('/__livereload').onmessage = () => location.reload();
</script>
`;

let sseClients = [];

function notifyReload() {
  for (const res of sseClients) {
    res.write('data: reload\n\n');
  }
}

async function rebuild() {
  try {
    await build();
    notifyReload();
  } catch (err) {
    console.error('Build failed:', err.message);
  }
}

function resolveFilePath(urlPath) {
  let filePath = path.join(DIST_DIR, decodeURIComponent(urlPath.split('?')[0]));

  if (filePath.endsWith('/')) {
    filePath = path.join(filePath, 'index.html');
  }
  if (!path.extname(filePath) && fs.existsSync(path.join(filePath, 'index.html'))) {
    filePath = path.join(filePath, 'index.html');
  }

  return filePath;
}

const server = http.createServer((req, res) => {
  if (req.url === '/__livereload') {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    });
    res.write('\n');
    sseClients.push(res);
    req.on('close', () => {
      sseClients = sseClients.filter((client) => client !== res);
    });
    return;
  }

  const filePath = resolveFilePath(req.url);

  if (!filePath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 Not Found</h1>');
      return;
    }
    const ext = path.extname(filePath);
    if (ext === '.html') {
      const html = data.toString().replace('</body>', `${LIVERELOAD_SCRIPT}</body>`);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
      return;
    }
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

function watch() {
  let timer = null;
  const onChange = () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 100);
  };

  for (const entry of WATCH_DIRS) {
    const target = path.join(ROOT, entry);
    if (!fs.existsSync(target)) continue;
    fs.watch(target, { recursive: true }, onChange);
  }
}

rebuild();
watch();

server.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT} (watching for changes)`);
});
