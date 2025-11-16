const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown',
};

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './README.md';
  }
  
  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Meme Studio Extension - Documentation</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
      color: #333;
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px;
      border-radius: 10px;
      margin-bottom: 30px;
    }
    .card {
      background: white;
      padding: 30px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      margin-bottom: 20px;
    }
    h1 { margin: 0 0 10px 0; }
    h2 { color: #667eea; margin-top: 0; }
    ul { line-height: 1.8; }
    a { color: #667eea; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .footer {
      text-align: center;
      padding: 20px;
      color: #666;
    }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>🎨 Meme Studio - Chrome Extension</h1>
    <p>Welcome to the development server! This server helps you view documentation and extension files.</p>
  </div>
  
  <div class="card">
    <h2>📚 Documentation</h2>
    <ul>
      <li><a href="/README.md">README.md</a> - Main documentation</li>
      <li><a href="/CONTRIBUTING.md">CONTRIBUTING.md</a> - How to contribute</li>
      <li><a href="/CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a> - Community guidelines</li>
      <li><a href="/LICENSE">LICENSE</a> - MIT License</li>
      <li><a href="/CHANGELOG.md">CHANGELOG.md</a> - Version history</li>
    </ul>
  </div>
  
  <div class="card">
    <h2>🔧 Extension Files</h2>
    <ul>
      <li><a href="/manifest.json">manifest.json</a> - Extension configuration</li>
      <li><a href="/sidebar.html">sidebar.html</a> - Main UI</li>
      <li><a href="/sidebar.js">sidebar.js</a> - Core JavaScript</li>
      <li><a href="/background.js">background.js</a> - Service worker</li>
    </ul>
  </div>
  
  <div class="card">
    <h2>🚀 How to Load in Chrome</h2>
    <ol>
      <li>Open Chrome and go to <code>chrome://extensions/</code></li>
      <li>Enable "Developer mode" (toggle in top-right)</li>
      <li>Click "Load unpacked"</li>
      <li>Select this project directory</li>
      <li>Click the extension icon to use it!</li>
    </ol>
  </div>
  
  <div class="footer">
    <p>Made with ❤️ by the Meme Studio community</p>
    <p>This is a development server running on port ${PORT}</p>
  </div>
</body>
</html>
        `, 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      if (extname === '.md') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Meme Studio - ${path.basename(filePath)}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
      color: #333;
      line-height: 1.6;
    }
    .container {
      background: white;
      padding: 40px;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    pre {
      background: #f0f0f0;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    code {
      background: #f0f0f0;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    a { color: #667eea; }
    h1, h2, h3 { color: #667eea; }
    .back { margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="back"><a href="/">← Back to home</a></div>
    <pre>${content.toString().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
  </div>
</body>
</html>
        `, 'utf-8');
      } else {
        res.writeHead(200, { 'Content-Type': mimeType });
        res.end(content, 'utf-8');
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║  🎨 Meme Studio Extension - Development Server       ║
╚═══════════════════════════════════════════════════════╝

✓ Server running at: http://0.0.0.0:${PORT}
✓ Documentation available at: http://localhost:${PORT}

📚 Available endpoints:
   • /                 - Home page
   • /README.md        - Main documentation
   • /CONTRIBUTING.md  - Contribution guidelines
   • /manifest.json    - Extension manifest
   • /sidebar.html     - Main UI file

🔧 To load the extension in Chrome:
   1. Open chrome://extensions/
   2. Enable "Developer mode"
   3. Click "Load unpacked"
   4. Select this directory

Press Ctrl+C to stop the server
`);
});
