import { readFileSync, writeFileSync } from 'node:fs';
const q = readFileSync(new URL('./q.txt', import.meta.url), 'utf8');
for (const u of ['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter']) {
  try {
    const r = await fetch(u, { method: 'POST', headers: { 'User-Agent': 'static-site-build/1.0', 'Accept': '*/*' }, body: new URLSearchParams({ data: q }), signal: AbortSignal.timeout(100000) });
    console.log(u, r.status);
    if (r.ok) { writeFileSync(new URL('../data/osm.json', import.meta.url), await r.text()); break; }
  } catch (e) { console.log(u, 'ERR', e.cause?.code || e.message); }
}
