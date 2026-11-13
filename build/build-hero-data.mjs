// Globe dots: coarse global land dots, dense Michigan land dots, and Great Lakes coastline dots.
// Output: hero/assets/dots.bin (Int16 xyz, 3 groups back to back) and dots.json (counts).
import { readFileSync, writeFileSync } from 'node:fs';
import { geoContains } from 'd3-geo';
import { feature } from 'topojson-client';
import { presimplify, simplify, sphericalTriangleArea } from 'topojson-simplify';

const root = new URL('../', import.meta.url);
const read = (p) => JSON.parse(readFileSync(new URL(p, root), 'utf8'));
const rad = Math.PI / 180;
const vec = (lon, lat) => [Math.cos(lat * rad) * Math.sin(lon * rad), Math.sin(lat * rad), Math.cos(lat * rad) * Math.cos(lon * rad)];

const topo110 = read('node_modules/world-atlas/land-110m.json');
const land110 = feature(topo110, topo110.objects.land);
const t50 = presimplify(read('node_modules/world-atlas/land-50m.json'), sphericalTriangleArea);
const land50 = feature(simplify(t50, 5e-7), t50.objects.land);

const names = ['Lake Superior', 'Lake Michigan', 'Lake Huron', 'Lake Erie', 'Lake Ontario', 'Lake Saint Clair'];
const lakes = read('data/lakes.json').features.filter((f) => names.includes(f.properties.name));
const inLake = (p) => lakes.some((l) => geoContains(l, p));

// 1. global: fibonacci lattice, land only, Great Lakes cut out
const N = 26000, ga = Math.PI * (3 - Math.sqrt(5));
const global = [];
for (let i = 0; i < N; i++) {
  const y = 1 - (2 * (i + 0.5)) / N, lat = Math.asin(y) / rad, lon = (((i * ga) / rad + 180) % 360 + 360) % 360 - 180;
  if (lat < -58) continue; // no Antarctica, it only adds a white cap of noise
  if (geoContains(land110, [lon, lat]) && !inLake([lon, lat])) global.push(vec(lon, lat));
}

// 2. Michigan region: dense grid on 50m land
const fill = [];
const step = 0.16;
for (let lat = 40.2; lat <= 49.6; lat += step) {
  const dl = step / Math.cos(lat * rad);
  for (let lon = -92.5; lon <= -75.0; lon += dl) {
    const p = [lon, lat];
    if (geoContains(land50, p) && !inLake(p)) fill.push(vec(lon, lat));
  }
}

// 3. coastline: lake outlines resampled
const coast = [];
const sp = 0.03;
const rings = (g) => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates).flat();
for (const l of lakes) for (const ring of rings(l.geometry)) {
  for (let i = 0; i < ring.length - 1; i++) {
    const [ax, ay] = ring[i], [bx, by] = ring[i + 1];
    const n = Math.max(1, Math.round(Math.hypot((bx - ax) * Math.cos(ay * rad), by - ay) / sp));
    for (let k = 0; k < n; k++) coast.push(vec(ax + ((bx - ax) * k) / n, ay + ((by - ay) * k) / n));
  }
}

const all = [...global, ...fill, ...coast];
const buf = new Int16Array(all.length * 3);
all.forEach((v, i) => { buf[i * 3] = Math.round(v[0] * 32767); buf[i * 3 + 1] = Math.round(v[1] * 32767); buf[i * 3 + 2] = Math.round(v[2] * 32767); });
writeFileSync(new URL('hero/assets/dots.bin', root), Buffer.from(buf.buffer));
writeFileSync(new URL('hero/assets/dots.json', root), JSON.stringify({ global: global.length, fill: fill.length, coast: coast.length }));
console.log({ global: global.length, fill: fill.length, coast: coast.length, KB: (buf.byteLength / 1024).toFixed(0) });
