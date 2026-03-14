const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 7700;
const PASSWORD = 'iphone';

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const server = http.createServer((req, res) => {
  // Basic auth check
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Command Center"', 'Content-Type': 'text/plain' });
    return res.end('Authentication required');
  }
  const [user, pass] = Buffer.from(auth.split(' ')[1], 'base64').toString().split(':');
  if (pass !== PASSWORD) {
    res.writeHead(401, { 'WWW-Authenticate': 'Basic realm="Command Center"', 'Content-Type': 'text/plain' });
    return res.end('Invalid password');
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Command Center running on http://127.0.0.1:${PORT}`);
});
