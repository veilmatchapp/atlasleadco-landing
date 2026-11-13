// Build-time artwork drawn from the same data as the live globe: the static globe placeholder (inline SVG, so it
// is never an LCP candidate) and the engraved graticule used as a quiet background on the ink sections.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { geoOrthographic, geoPath, geoGraticule } from 'd3-geo';
import { mesh } from 'topojson-client';
import { presimplify, simplify, sphericalTriangleArea } from 'topojson-simplify';

const read = (p) => JSON.parse(readFileSync(fileURLToPath(new URL(`../${p}`, import.meta.url)), 'utf8'));
const topo = presimplify(read('node_modules/world-atlas/land-110m.json'), sphericalTriangleArea);
const land = mesh(simplify(topo, 2.5e-5), topo.objects.land); // coarse on purpose: this only shows until the live globe loads

let cachedGlobe = '', cachedEngrave = '';

// The globe as it first appears (tilted toward the viewer, Americas in front), matching the live render's opening pose.
export function globeSvg() {
  if (cachedGlobe) return cachedGlobe;
  const proj = geoOrthographic().rotate([60, -24]).translate([500, 500]).scale(498).clipAngle(90).precision(0.6);
  const gp = geoPath(proj).digits(0);
  const grat = gp(geoGraticule().step([15, 15])());
  const coast = gp(land);
  cachedGlobe = `<svg class="ph" viewBox="0 0 1000 1000" aria-hidden="true" focusable="false">
<defs><radialGradient id="phl" cx=".36" cy=".3" r=".75"><stop offset="0" style="stop-color:var(--gl-key);stop-opacity:.22"/><stop offset="1" style="stop-color:var(--gl-key);stop-opacity:0"/></radialGradient></defs>
<circle cx="500" cy="500" r="499" style="fill:var(--gl-body)"/>
<circle cx="500" cy="500" r="499" fill="url(#phl)"/>
<path d="${grat}" fill="none" style="stroke:var(--gl-grat)" stroke-opacity=".12" stroke-width="1" vector-effect="non-scaling-stroke"/>
<path d="${coast}" fill="none" style="stroke:var(--gl-coast)" stroke-opacity=".5" stroke-width="1.1" vector-effect="non-scaling-stroke"/>
<circle cx="500" cy="500" r="499" fill="none" style="stroke:var(--gl-rim)" stroke-opacity=".35" stroke-width="1.5" vector-effect="non-scaling-stroke"/>
</svg>`;
  return cachedGlobe;
}

// A large cropped graticule, drawn as fine lines. Used behind the ink sections at very low opacity.
export function engraveSvg(cls = 'engrave') {
  if (!cachedEngrave) {
    const proj = geoOrthographic().rotate([95, -18, 8]).translate([600, 600]).scale(560).clipAngle(90).precision(0.6);
    cachedEngrave = geoPath(proj).digits(0)(geoGraticule().step([10, 10])());
  }
  return `<svg class="${cls}" viewBox="0 0 1200 1200" aria-hidden="true" focusable="false" data-r="draw"><circle cx="600" cy="600" r="560" fill="none" stroke="currentColor" stroke-opacity=".5" vector-effect="non-scaling-stroke"/><path d="${cachedEngrave}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}
