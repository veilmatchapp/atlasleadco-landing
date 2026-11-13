// Builds site/index.html (county SVG from the Census boundary + OSM roads/river) and bundles site/dist.
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { geoMercator, geoPath, geoContains } from 'd3-geo';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { headerHtml, footerHtml } from './site-content.mjs';
import { servicesSection, processSection, bundleSection, closeSection } from './sections.mjs';
import { globeSvg } from './art.mjs';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));

const census = read('data/washtenaw-census.geojson').features[0];
// d3 wants clockwise exterior rings on the sphere; Census GeoJSON is counter-clockwise
const flip = (rings) => rings.map((r) => r.slice().reverse());
census.geometry.coordinates = census.geometry.type === 'Polygon' ? flip(census.geometry.coordinates) : census.geometry.coordinates.map(flip);
const osm = read('data/osm.json').elements;

const W = 1000, PAD = 24;
const proj = geoMercator().fitWidth(W - 2 * PAD, census);
{
  const [[x0, y0]] = geoPath(proj).bounds(census);
  const [tx, ty] = proj.translate();
  proj.translate([tx - x0 + PAD, ty - y0 + PAD]);
}
const path = geoPath(proj).digits(1);
const H = Math.ceil(geoPath(proj).bounds(census)[1][1] + PAD);
const county = path(census);

const line = (w) => ({ type: 'Feature', geometry: { type: 'LineString', coordinates: w.geometry.map((p) => [p.lon, p.lat]) } });
const ways = (f) => osm.filter((e) => e.type === 'way' && f(e));
const roads = ways((e) => e.tags?.highway === 'motorway' && /I 94|US 23/.test(e.tags.ref || ''));
const river = ways((e) => e.tags?.waterway === 'river' && e.tags?.name === 'Huron River');
// only ways that touch the county, and drop ramps that sit entirely outside
const inCounty = (w) => w.geometry.some((p) => geoContains(census, [p.lon, p.lat]));
const paths = (ws, cls) => ws.filter(inCounty).map((w) => `<path class="${cls}" pathLength="1" d="${path(line(w))}"/>`).join('');

const AA = [-83.743, 42.2808], SA = [-83.7816, 42.1667];
const [ax, ay] = proj(AA), [sx, sy] = proj(SA);
const town = (id, x, y, name, anchor, dx) =>
  `<g class="town" id="${id}"><circle class="halo" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="26"/><circle class="dot" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="9"/><text x="${(x + dx).toFixed(1)}" y="${(y + 11).toFixed(1)}" text-anchor="${anchor}">${name}</text></g>`;

const svg = `<svg id="county" viewBox="0 0 ${W} ${H}" data-aa="${((ax / W) * 100).toFixed(2)} ${((ay / H) * 100).toFixed(2)}" role="img" aria-labelledby="county-t">
<title id="county-t">Outline of Washtenaw County, Michigan, with Ann Arbor and Saline marked</title>
<defs><pattern id="dots" width="18" height="18" patternUnits="userSpaceOnUse"><circle class="pat" cx="9" cy="9" r="1.7"/></pattern>
<clipPath id="cc"><path d="${county}"/></clipPath></defs>
<path class="base" d="${county}"/>
<path class="fillshape" d="${county}"/>
<g clip-path="url(#cc)">${paths(river, 'river')}${paths(roads, 'road')}</g>
<path class="outline" pathLength="1" d="${county}"/>
${town('aa', ax, ay, 'Ann Arbor', 'end', -22)}${town('sa', sx, sy, 'Saline', 'start', 22)}
</svg>`;

const src = readFileSync(new URL('site/index.src.html', root), 'utf8');
const credit = '<span class="credit">Globe coastlines and lakes: Natural Earth. County outline: US Census Bureau. Roads and river: OpenStreetMap contributors.</span>';
const html = src.replace('<!--COUNTY-->', svg).replace('<!--GLOBEPH-->', globeSvg()).replace('<!--HEADER-->', headerHtml('', false)).replace('<!--FOOTER-->', footerHtml(credit))
  .replace('<!--SERVICES-->', servicesSection({ homeOnly: true })).replace('<!--PROCESS-->', processSection()).replace('<!--BUNDLE-->', bundleSection()).replace('<!--CLOSE-->', closeSection());
writeFileSync(new URL('site/index.html', root), html);

rmSync(new URL('site/dist', root), { recursive: true, force: true });
await build({
  entryPoints: [fileURLToPath(new URL('site/src/main.js', root)), fileURLToPath(new URL('site/src/reveal.js', root))],
  outdir: fileURLToPath(new URL('site/dist', root)), bundle: true, splitting: true, format: 'esm', minify: true, target: 'es2020',
  chunkNames: '[name]-[hash]', legalComments: 'none', logLevel: 'info',
});
console.log('county svg', W, H, 'AA at', ((ax / W) * 100).toFixed(1) + '%', ((ay / H) * 100).toFixed(1) + '%');
