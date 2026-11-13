// Washtenaw County boundary from US Census TIGERweb (public domain).
import { writeFileSync } from 'node:fs';
const base = 'https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/State_County/MapServer';
const h = { 'User-Agent': 'static-site-build/1.0' };
const info = await (await fetch(`${base}?f=json`, { headers: h })).json();
const layer = info.layers.find((l) => /^Counties$/i.test(l.name)) || info.layers.find((l) => /count/i.test(l.name));
console.log('layers', info.layers.map((l) => `${l.id}:${l.name}`).join(', '), '-> using', layer.id);
const q = new URLSearchParams({ where: "GEOID='26161'", outFields: 'NAME,GEOID,STATE,COUNTY', outSR: '4326', f: 'geojson', returnGeometry: 'true', geometryPrecision: '5' });
const r = await fetch(`${base}/${layer.id}/query?${q}`, { headers: h });
const j = await r.json();
console.log(r.status, j.features?.length, j.features?.[0]?.properties);
writeFileSync(new URL('../data/washtenaw-census.geojson', import.meta.url), JSON.stringify(j));
