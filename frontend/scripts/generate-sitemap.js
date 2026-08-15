import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to manually load .env file variables without external dependencies
const loadEnv = () => {
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    content.split('\n').forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        const key = match[1];
        let value = match[2] || '';
        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        } else if (value.startsWith("'") && value.endsWith("'")) {
          value = value.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = value;
        }
      }
    });
  }
};

loadEnv();

// Helper to parse CLI arguments (e.g., --domain=https://example.com)
const getArg = (name) => {
  const arg = process.argv.find(a => a.startsWith(`--${name}=`));
  return arg ? arg.split('=')[1] : null;
};

// Determine domain: 1. CLI Arg  2. VITE_SITE_URL/SITE_URL from env  3. Default placeholder
const cliDomain = getArg('domain');
const envSiteUrl = process.env.VITE_SITE_URL || process.env.SITE_URL;
const DOMAIN = (cliDomain || envSiteUrl || 'https://yourdomain.com').replace(/\/$/, '');

console.log(`[Sitemap] Generating sitemap for domain: ${DOMAIN}`);

// Public pages based on react-router-dom configuration
const pages = [
  { path: '/', priority: '1.0', changefreq: 'daily' },
  { path: '/menu', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'weekly' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/gallery', priority: '0.7', changefreq: 'monthly' },
  { path: '/reservation', priority: '0.9', changefreq: 'weekly' }
];

const currentDate = new Date().toISOString().split('T')[0];

// Generate sitemap.xml content
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(page => `  <url>
    <loc>${DOMAIN}${page.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

// Generate sitemap.txt content
const sitemapTxt = pages.map(page => `${DOMAIN}${page.path}`).join('\n') + '\n';

// Directories to write the files to
const publicDir = path.resolve(__dirname, '../public');
const distDir = path.resolve(__dirname, '../dist');

const writeSitemapAssets = (targetDir, dirName) => {
  if (!fs.existsSync(targetDir)) return;

  const xmlPath = path.join(targetDir, 'sitemap.xml');
  const txtPath = path.join(targetDir, 'sitemap.txt');
  const robotsPath = path.join(targetDir, 'robots.txt');

  fs.writeFileSync(xmlPath, sitemapXml);
  fs.writeFileSync(txtPath, sitemapTxt);
  console.log(`[Sitemap] Wrote sitemap.xml and sitemap.txt to ${dirName}`);

  if (fs.existsSync(robotsPath)) {
    let robotsContent = fs.readFileSync(robotsPath, 'utf8');
    if (robotsContent.includes('Sitemap:')) {
      robotsContent = robotsContent.replace(/Sitemap:\s*\S+/g, `Sitemap: ${DOMAIN}/sitemap.xml`);
    } else {
      robotsContent = robotsContent.trim() + `\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
    }
    fs.writeFileSync(robotsPath, robotsContent);
    console.log(`[Sitemap] Updated robots.txt Sitemap directive in ${dirName}`);
  }
};

// Write to public folder
writeSitemapAssets(publicDir, 'public/');

// Write to build output (dist) folder if it exists
if (fs.existsSync(distDir)) {
  writeSitemapAssets(distDir, 'dist/');
}

console.log('[Sitemap] Generator completed successfully!');
