const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const indexHtml = path.join(distDir, 'index.html');

if (!fs.existsSync(indexHtml)) {
  console.error('dist/index.html not found');
  process.exit(1);
}

for (const route of ['admin', 'admin/dashboard']) {
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.copyFileSync(indexHtml, path.join(targetDir, 'index.html'));
}

console.log('Generated SPA route fallbacks: /admin, /admin/dashboard');
