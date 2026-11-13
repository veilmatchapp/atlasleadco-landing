// Generates the static globe and Washtenaw County inset for prototypes/c-globe.
// Inputs: world-atlas (Natural Earth land, public domain) and data/osm.json (OpenStreetMap, ODbL).
import { readFileSync, writeFileSync } from 'node:fs';
import { geoOrthographic, geoMercator, geoPath, geoGraticule, geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { presimplify, simplify, sphericalTriangleArea } from 'topojson-simplify';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));

const ANN_ARBOR = [-83.7430, 42.2808];
const SALINE = [-83.7816, 42.1667];

/* ---------- globe ---------- */
const topo = presimplify(read('node_modules/world-atlas/land-50m.json'), sphericalTriangleArea);
const land = feature(simplify(topo, 4e-6), topo.objects.land);
const R = 500;
const globe = geoOrthographic().translate([R, R]).scale(R).rotate([-ANN_ARBOR[0], -ANN_ARBOR[1]]).clipAngle(90).precision(0.8);
const gp = geoPath(globe).digits(0);
const landD = gp(land);
const gratD = gp(geoGraticule().step([15, 15])());
const [mx, my] = globe(ANN_ARBOR);
const lakesD = gp(read('data/lakes.json'));

const globeSvg = `<svg class="globe" viewBox="0 0 1000 1000" role="img" aria-labelledby="globe-t">
<title id="globe-t">Globe centered on Ann Arbor, Michigan</title>
<circle cx="500" cy="500" r="500" fill="#083D48"/>
<path d="${gratD}" fill="none" stroke="#F4F1E8" stroke-opacity=".26" stroke-width="1.4"/>
<path d="${landD}" fill="#E3D8B8"/>
<path d="${lakesD}" fill="#083D48"/>
<circle cx="500" cy="500" r="499" fill="none" stroke="#F4F1E8" stroke-opacity=".5" stroke-width="2"/>
</svg>`;

/* ---------- county inset ---------- */
const osm = read('data/osm.json').elements;
const rel = osm.find((e) => e.type === 'relation');
const eq = (a, b) => a.lat === b.lat && a.lon === b.lon;
function stitch(ways) {
  const rings = [];
  const rest = ways.map((w) => w.slice());
  while (rest.length) {
    let ring = rest.shift();
    let grew = true;
    while (grew && !eq(ring[0], ring[ring.length - 1])) {
      grew = false;
      for (let i = 0; i < rest.length; i++) {
        const w = rest[i], s = ring[0], e = ring[ring.length - 1];
        if (eq(e, w[0])) ring = ring.concat(w.slice(1));
        else if (eq(e, w[w.length - 1])) ring = ring.concat(w.slice(0, -1).reverse());
        else if (eq(s, w[w.length - 1])) ring = w.slice(0, -1).concat(ring);
        else if (eq(s, w[0])) ring = w.slice(1).reverse().concat(ring);
        else continue;
        rest.splice(i, 1); grew = true; break;
      }
    }
    rings.push(ring);
  }
  return rings;
}
const outer = rel.members.filter((m) => m.role === 'outer' && m.geometry).map((m) => m.geometry);
const rings = stitch(outer).sort((a, b) => b.length - a.length);
const ring = rings[0].map((p) => [p.lon, p.lat]);
if (ring[0][0] !== ring.at(-1)[0] || ring[0][1] !== ring.at(-1)[1]) throw new Error('county ring did not close');
const county = { type: 'Feature', geometry: { type: 'Polygon', coordinates: [ring] } };

const W = 300, PAD = 16;
const proj = geoMercator().fitWidth(W - 2 * PAD, county);
{ const [[x0, y0]] = geoPath(proj).bounds(county); const [tx, ty] = proj.translate(); proj.translate([tx - x0 + PAD, ty - y0 + PAD]); }
const path = geoPath(proj).digits(0);
const H = Math.ceil(geoPath(proj).bounds(county)[1][1] + PAD);
const line = (coords) => ({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords.map((p) => [p.lon, p.lat]) } });

const hwy = osm.filter((e) => e.type === 'way' && e.tags?.highway === 'motorway');
const i94 = hwy.filter((e) => /I 94/.test(e.tags.ref || ''));
const us23 = hwy.filter((e) => /US 23/.test(e.tags.ref || ''));
const river = osm.filter((e) => e.type === 'way' && e.tags?.waterway === 'river');
const d = (ways) => ways.map((w) => path(line(w.geometry))).join('');

// label anchor: the vertex inside the county closest to a target point
function anchor(ways, target) {
  let best = null, bd = Infinity;
  for (const w of ways) for (const p of w.geometry) {
    const c = [p.lon, p.lat];
    if (!geoContains(county, c)) continue;
    const dd = (c[0] - target[0]) ** 2 + (c[1] - target[1]) ** 2;
    if (dd < bd) { bd = dd; best = c; }
  }
  return proj(best);
}
const aI94 = anchor(i94, [-84.07, 42.22]);
const aUS23 = anchor(us23, [-83.69, 42.385]);
const [ax, ay] = proj(ANN_ARBOR), [sx, sy] = proj(SALINE);
const tag = (x, y, t, w) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"><rect x="${-w / 2}" y="-9" width="${w}" height="18" rx="3" fill="#F4F1E8" stroke="#083D48" stroke-width="1.4"/><text y="4.5" text-anchor="middle" font-size="12" font-weight="700" fill="#083D48">${t}</text></g>`;

const insetSvg = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="inset-t" class="county">
<title id="inset-t">Map of Washtenaw County, Michigan, with Ann Arbor and Saline marked</title>
<defs><clipPath id="cc"><path d="${path(county)}"/></clipPath></defs>
<path d="${path(county)}" fill="#E3D8B8" stroke="#083D48" stroke-width="1.6" stroke-linejoin="round"/>
<g clip-path="url(#cc)" fill="none" stroke-linecap="round" stroke-linejoin="round">
<path d="${d(river)}" stroke="#3E8EA0" stroke-width="3"/>
<path d="${d(i94)}" stroke="#083D48" stroke-width="3.4"/>
<path d="${d(us23)}" stroke="#083D48" stroke-width="3.4"/>
</g>
${tag(aI94[0], aI94[1], 'I-94', 38)}${tag(aUS23[0], aUS23[1], 'US-23', 46)}
<g fill="#F26B4F" stroke="#F4F1E8" stroke-width="2.2"><circle cx="${ax.toFixed(1)}" cy="${ay.toFixed(1)}" r="6.5"/><circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="6.5"/></g>
<g font-size="14.5" font-weight="700" fill="#062C34" paint-order="stroke" stroke="#E3D8B8" stroke-width="4" stroke-linejoin="round">
<text x="${(ax + 4).toFixed(1)}" y="${(ay + 25).toFixed(1)}" text-anchor="end">Ann Arbor</text>
<text x="${(sx + 11).toFixed(1)}" y="${(sy + 5).toFixed(1)}">Saline</text></g>
</svg>`;

const src = readFileSync(new URL('prototypes/c-globe/index.src.html', root), 'utf8');
const out = src.replace('<!--GLOBE-->', globeSvg).replace('<!--INSET-->', insetSvg);
writeFileSync(new URL('prototypes/c-globe/index.html', root), out);
console.log('marker on globe', mx.toFixed(1), my.toFixed(1), '| globe svg KB', (globeSvg.length / 1024).toFixed(0), '| inset KB', (insetSvg.length / 1024).toFixed(0), '| ring pts', ring.length);
