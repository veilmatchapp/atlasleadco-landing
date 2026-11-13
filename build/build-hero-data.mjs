// Globe line data: world coastlines at a low level of detail, plus the Great Lakes shorelines at full detail.
// Natural Earth land (public domain) via world-atlas, Natural Earth lakes (public domain).
// Output: site/assets/coast.bin and coast.json
//   land  : Int16 lon,lat in hundredths of a degree
//   lakes : Uint16 lon,lat across a bounding box (about 30 m steps)
import { readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { mesh } from 'topojson-client';
import { presimplify, simplify, sphericalTriangleArea } from 'topojson-simplify';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));

// world coastline: 110m land outlines, lightly simplified. Drop the antimeridian cut and the Antarctic base line.
const topo = presimplify(read('node_modules/world-atlas/land-110m.json'), sphericalTriangleArea);
const land = mesh(simplify(topo, 2e-6), topo.objects.land);
const keep = (a, b) => !(Math.abs(a[0]) > 179.9 && Math.abs(b[0]) > 179.9) && !(a[1] < -89.5 && b[1] < -89.5) && Math.abs(a[0] - b[0]) < 180;
const landRuns = [], landPts = [];
for (const line of land.coordinates) {
  let run = [line[0]];
  for (let i = 1; i < line.length; i++) {
    if (keep(line[i - 1], line[i])) run.push(line[i]);
    else { if (run.length > 1) { landRuns.push(run.length); landPts.push(...run); } run = [line[i]]; }
  }
  if (run.length > 1) { landRuns.push(run.length); landPts.push(...run); }
}

// Great Lakes shorelines from the Natural Earth lakes layer
const names = ['Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie', 'Lake Ontario', 'Lake Saint Clair'];
const lakes = read('data/lakes.json').features.filter((f) => names.includes(f.properties.name));
const rings = [];
for (const l of lakes) for (const poly of l.geometry.type === 'Polygon' ? [l.geometry.coordinates] : l.geometry.coordinates) for (const ring of poly) rings.push(ring);
let x0 = 180, x1 = -180, y0 = 90, y1 = -90;
for (const r of rings) for (const [x, y] of r) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
const box = [x0 - 0.05, y0 - 0.05, x1 + 0.05, y1 + 0.05];

const land16 = new Int16Array(landPts.length * 2);
landPts.forEach(([x, y], i) => { land16[i * 2] = Math.round(x * 100); land16[i * 2 + 1] = Math.round(y * 100); });
const lakeRuns = rings.map((r) => r.length), lakePts = rings.flat();
const lake16 = new Uint16Array(lakePts.length * 2);
lakePts.forEach(([x, y], i) => {
  lake16[i * 2] = Math.round(((x - box[0]) / (box[2] - box[0])) * 65535);
  lake16[i * 2 + 1] = Math.round(((y - box[1]) / (box[3] - box[1])) * 65535);
});

const out = Buffer.concat([Buffer.from(land16.buffer), Buffer.from(lake16.buffer)]);
writeFileSync(new URL('site/assets/coast.bin', root), out);
writeFileSync(new URL('site/assets/coast.json', root), JSON.stringify({ landRuns, lakeRuns, box }));
for (const f of ['site/assets/dots.bin', 'site/assets/dots.json']) if (existsSync(new URL(f, root))) rmSync(new URL(f, root));
console.log({ landRuns: landRuns.length, landPts: landPts.length, lakeRings: rings.length, lakePts: lakePts.length, KB: (out.length / 1024).toFixed(0), gzKB: 'see below' });
