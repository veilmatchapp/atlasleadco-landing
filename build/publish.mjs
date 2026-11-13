// Assembles public/ from site/: exactly the files visitors need, no screenshots, video or sources.
// Vercel serves public/ as plain static files (see vercel.json); nothing is built on Vercel.
import { cpSync, rmSync, mkdirSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const root = (p) => fileURLToPath(new URL(`../${p}`, import.meta.url));
const pages = ['ai', 'security', 'websites', 'checkup', 'how-it-works', 'plans', 'about', 'contact', 'privacy'];
// empty public/ rather than deleting the folder itself: on Windows a server running inside it would block the delete
mkdirSync(root('public'), { recursive: true });
for (const name of readdirSync(root('public'))) rmSync(root(`public/${name}`), { recursive: true, force: true });
for (const f of ['index.html', 'base.css', 'pages.css', 'sections.css', 'hero.css', 'config.js', 'forms.js', 'atlas-logo.png']) cpSync(root(`site/${f}`), root(`public/${f}`));
for (const d of ['fonts', 'dist', ...pages]) cpSync(root(`site/${d}`), root(`public/${d}`), { recursive: true });
mkdirSync(root('public/assets'));
for (const f of ['coast.bin', 'coast.json', 'still-globe.webp', 'still-michigan.webp']) cpSync(root(`site/assets/${f}`), root(`public/assets/${f}`));
const base = 'https://www.atlasleadco.com';
writeFileSync(root('public/robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
writeFileSync(root('public/sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${['', ...pages.map((p) => `${p}/`)].map((p) => `  <url><loc>${base}/${p}</loc></url>`).join('\n')}\n</urlset>\n`);
for (const p of ['index.html', ...pages.map((p) => `${p}/index.html`), 'dist/main.js']) if (!existsSync(root(`public/${p}`))) throw new Error(`missing ${p}`);
console.log('public/ ready');
