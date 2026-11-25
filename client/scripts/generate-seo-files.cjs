const fs = require('fs');
const path = require('path');

const rootEnvPath = path.resolve(__dirname, '../../.env');
const publicDir = path.resolve(__dirname, '../public');

function readRootEnv() {
  if (!fs.existsSync(rootEnvPath)) return {};

  return fs.readFileSync(rootEnvPath, 'utf8')
    .split(/\r?\n/)
    .reduce((env, line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return env;

      const separatorIndex = trimmed.indexOf('=');
      if (separatorIndex === -1) return env;

      const key = trimmed.slice(0, separatorIndex).trim();
      const value = trimmed.slice(separatorIndex + 1).trim().replace(/^['"]|['"]$/g, '');
      env[key] = value;
      return env;
    }, {});
}

const rootEnv = readRootEnv();
const rawSiteUrl =
  process.env.VITE_SITE_URL ||
  rootEnv.VITE_SITE_URL ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL ||
  process.env.VERCEL_URL ||
  'http://localhost:3000';

const siteUrl = rawSiteUrl.startsWith('http') ? rawSiteUrl : `https://${rawSiteUrl}`;
const canonicalUrl = siteUrl.replace(/\/$/, '');
const today = new Date().toISOString().slice(0, 10);

fs.mkdirSync(publicDir, { recursive: true });

fs.writeFileSync(
  path.join(publicDir, 'robots.txt'),
  [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    `Sitemap: ${canonicalUrl}/sitemap.xml`,
    '',
  ].join('\n')
);

fs.writeFileSync(
  path.join(publicDir, 'sitemap.xml'),
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    `    <loc>${canonicalUrl}/</loc>`,
    `    <lastmod>${today}</lastmod>`,
    '    <changefreq>weekly</changefreq>',
    '    <priority>1.0</priority>',
    '  </url>',
    '</urlset>',
    '',
  ].join('\n')
);

console.log(`SEO files generated for ${canonicalUrl}`);
