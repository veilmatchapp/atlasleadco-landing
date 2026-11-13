// The globe: dark lacquer body, a very faint latitude/longitude grid, thin coastlines, and the Great Lakes shoreline
// that brightens and thickens as the camera pushes in. Loaded after first paint. Reads scroll-driven state S (see main.js).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, MeshPhysicalMaterial, Vector3, Quaternion, Matrix4,
  PMREMGenerator, ACESFilmicToneMapping, LineSegments, BufferGeometry, Float32BufferAttribute, LineBasicMaterial, DirectionalLight,
  ShaderMaterial, BackSide, AdditiveBlending, Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace, Color,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { LineSegments2 } from 'three/addons/lines/LineSegments2.js';
import { LineSegmentsGeometry } from 'three/addons/lines/LineSegmentsGeometry.js';
import { LineMaterial } from 'three/addons/lines/LineMaterial.js';

const FOV = 30;
const TAN = Math.tan((FOV * Math.PI) / 360);
const RAD = Math.PI / 180;
const AA = [-83.743, 42.2808]; // Ann Arbor
const vec = (lon, lat) => new Vector3(Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD));
const ease = (t) => t * t * (3 - 2 * t);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

const DEFAULTS = { body: 0x2a1910, key: 0xffd9a0, rim: 0xffb066, bloom: [255, 196, 110], glow: [0.95, 0.72, 0.34], grat: 0xc7a348, coast: 0xe4c987, lake: 0xf8e2a4 };
const GRAT_OP = 0.12;  // the grid is engraving, not a cage
const LAND_OP = 0.5;   // thin and faint
const LAND_W = 1.1;    // CSS px

// pairs of xyz for each polyline run, subdivided so long edges follow the curve of the sphere
function segments(points, runs, radius) {
  const out = [];
  const step = Math.cos(1.5 * RAD);
  let i = 0;
  for (const n of runs) {
    for (let k = 0; k < n - 1; k++) {
      const a = vec(points[(i + k) * 2], points[(i + k) * 2 + 1]), b = vec(points[(i + k + 1) * 2], points[(i + k + 1) * 2 + 1]);
      const d = a.dot(b);
      const parts = d < step ? Math.ceil(Math.acos(clamp(d, -1, 1)) / (1.5 * RAD)) : 1;
      let prev = a;
      for (let p = 1; p <= parts; p++) {
        const next = p === parts ? b : a.clone().lerp(b, p / parts).normalize();
        out.push(prev.x * radius, prev.y * radius, prev.z * radius, next.x * radius, next.y * radius, next.z * radius);
        prev = next;
      }
    }
    i += n;
  }
  return new Float32Array(out);
}

function fatLine(positions, color, width, opacity) {
  const g = new LineSegmentsGeometry();
  g.setPositions(positions);
  const m = new LineMaterial({ color, linewidth: width, transparent: true, opacity, depthWrite: false, worldUnits: false });
  const l = new LineSegments2(g, m);
  l.frustumCulled = false;
  return l;
}

function graticule(step, seg) {
  const p = [];
  const push = (a, b) => p.push(a.x, a.y, a.z, b.x, b.y, b.z);
  for (let lon = -180; lon < 180; lon += step) for (let i = 0; i < seg; i++) push(vec(lon, -90 + (180 * i) / seg), vec(lon, -90 + (180 * (i + 1)) / seg));
  for (let lat = -90 + step; lat < 90; lat += step) for (let i = 0; i < seg * 2; i++) push(vec(-180 + (360 * i) / (seg * 2), lat), vec(-180 + (360 * (i + 1)) / (seg * 2), lat));
  const g = new BufferGeometry();
  g.setAttribute('position', new Float32BufferAttribute(p, 3));
  return g;
}

export async function createGlobe(canvas, S, { mobile = false, colors = {} } = {}) {
  const C = { ...DEFAULTS, ...colors };
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = env;
  pmrem.dispose();
  scene.environmentIntensity = 0.9;

  const camera = new PerspectiveCamera(FOV, 1, 0.003, 40);
  const globe = new Group();
  scene.add(globe);

  const key = new DirectionalLight(C.key, 1.5);
  key.position.set(-3, 2.6, 4);
  scene.add(key);
  const rim = new DirectionalLight(C.rim, 1.1); // kick from behind so the edge reads against the ground
  rim.position.set(3, 1, -3);
  scene.add(rim);

  // body: dark lacquer, so the lines sit on something with depth and the far side stays hidden
  const body = new Mesh(new SphereGeometry(0.985, 128, 96), new MeshPhysicalMaterial({ color: C.body, roughness: 0.55, metalness: 0.15, clearcoat: 0.45, clearcoatRoughness: 0.4, envMap: env, envMapIntensity: 0.35 }));
  globe.add(body);

  const grat = new LineSegments(graticule(15, 72), new LineBasicMaterial({ color: C.grat, transparent: true, opacity: GRAT_OP, depthWrite: false }));
  grat.scale.setScalar(1.001);
  globe.add(grat);

  // coastlines
  const meta = await (await fetch(new URL('../assets/coast.json', import.meta.url))).json();
  const buf = await (await fetch(new URL('../assets/coast.bin', import.meta.url))).arrayBuffer();
  const landN = meta.landRuns.reduce((a, b) => a + b, 0), lakeN = meta.lakeRuns.reduce((a, b) => a + b, 0);
  const land16 = new Int16Array(buf, 0, landN * 2), lake16 = new Uint16Array(buf, landN * 4, lakeN * 2);
  const landLL = new Float32Array(landN * 2), lakeLL = new Float32Array(lakeN * 2);
  for (let i = 0; i < landN * 2; i++) landLL[i] = land16[i] / 100;
  const [bx0, by0, bx1, by1] = meta.box;
  for (let i = 0; i < lakeN; i++) { lakeLL[i * 2] = bx0 + (lake16[i * 2] / 65535) * (bx1 - bx0); lakeLL[i * 2 + 1] = by0 + (lake16[i * 2 + 1] / 65535) * (by1 - by0); }
  const landLine = fatLine(segments(landLL, meta.landRuns, 1.002), C.coast, LAND_W, LAND_OP);
  const lakeLine = fatLine(segments(lakeLL, meta.lakeRuns, 1.0035), C.coast, LAND_W, LAND_OP);
  globe.add(landLine, lakeLine);
  const cCoast = new Color(C.coast), cLake = new Color(C.lake);

  // warm edge glow, additive, drawn behind the globe
  const glow = new Mesh(new SphereGeometry(1.13, 64, 48), new ShaderMaterial({
    side: BackSide, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uA: { value: 0.35 }, uC: { value: new Vector3(...C.glow) } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; uniform float uA; uniform vec3 uC; void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 3.2); gl_FragColor = vec4(uC * f * uA, f * uA); }',
  }));
  scene.add(glow);

  // a pool of light behind the globe, drawn in the scene so it lives in the same space as the object
  const bloomCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const bctx = bloomCanvas.getContext('2d');
  const [br, bg, bb] = C.bloom;
  const grad = bctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, `rgba(${br},${bg},${bb},0.9)`);
  grad.addColorStop(0.45, `rgba(${(br * 0.78) | 0},${(bg * 0.7) | 0},${(bb * 0.62) | 0},0.32)`);
  grad.addColorStop(1, `rgba(${(br * 0.45) | 0},${(bg * 0.36) | 0},${(bb * 0.3) | 0},0)`);
  bctx.fillStyle = grad; bctx.fillRect(0, 0, 256, 256);
  const bloomTex = new CanvasTexture(bloomCanvas); bloomTex.colorSpace = SRGBColorSpace;
  const bloom = new Sprite(new SpriteMaterial({ map: bloomTex, transparent: true, depthWrite: false, blending: AdditiveBlending, opacity: 0.2 }));
  bloom.position.set(0, 0, -1.2); bloom.scale.setScalar(6.2);
  scene.add(bloom);

  // orientations
  const aaV = vec(AA[0], AA[1]);
  const up = new Vector3(0, 1, 0).sub(aaV.clone().multiplyScalar(aaV.y)).normalize();
  const right = new Vector3().crossVectors(up, aaV).normalize();
  const qMich = new Quaternion().setFromRotationMatrix(new Matrix4().makeBasis(right, up, aaV).transpose());
  const qTilt = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), 0.42);
  const qYaw = new Quaternion(), qAuto = new Quaternion(), yAxis = new Vector3(0, 1, 0);
  let auto = 1.05;

  let w = 1, h = 1, D0 = 5, D1 = 2, D2 = 1.2, active = true, last = 0;
  const dpr = () => Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 2);
  const dist = (z) => (z <= 1 ? 1 + (D0 - 1) * Math.pow((D1 - 1) / (D0 - 1), z) : 1 + (D1 - 1) * Math.pow((D2 - 1) / (D1 - 1), z - 1));

  function resize() {
    const r = canvas.parentElement.getBoundingClientRect();
    w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
    renderer.setPixelRatio(dpr());
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    landLine.material.resolution.set(w, h); lakeLine.material.resolution.set(w, h);
    const m = Math.min(1, w / h);
    const cov = mobile ? 0.8 : 1.02; // fraction of half the short side the globe radius fills at rest; on desktop it bleeds off the frame
    D0 = Math.sqrt(1 + Math.pow(1 / (cov * TAN * m), 2));
    D1 = 1 + 0.42 / (2 * TAN * m);
    D2 = 1 + 0.0135 / (2 * TAN * m); // county-sized view
    S.sizes = { w, h };
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  function render(time) {
    if (!active) return;
    const dt = Math.min(0.05, last ? time - last : 0.016); last = time;
    auto += dt * 0.075 * (1 - S.rot);
    qYaw.setFromAxisAngle(yAxis, auto);
    qAuto.copy(qTilt).multiply(qYaw);
    globe.quaternion.slerpQuaternions(qAuto, qMich, ease(clamp(S.rot, 0, 1)));

    const D = dist(S.zoom);
    camera.position.set(0, 0, D);
    camera.near = Math.max(0.003, D - 1.4);
    camera.setViewOffset(w, h, -S.ox, -S.oy, w, h);
    camera.updateProjectionMatrix();

    // the lacquer's gloss and the key light would haze the close-up, so they fade as we dive
    const calm = 1 - ease(clamp(S.rot, 0, 1));
    key.intensity = 0.2 + 0.8 * calm;
    body.material.clearcoat = 0.05 + 0.4 * calm;

    // S.grat: the grid, S.global: the world coastline, S.coast: how strongly the Great Lakes line is picked out
    grat.material.opacity = GRAT_OP * S.grat; grat.visible = S.grat > 0.01;
    landLine.material.opacity = LAND_OP * S.global; landLine.visible = S.global > 0.01;
    lakeLine.material.opacity = Math.max(LAND_OP * S.global, 0.95 * S.coast);
    lakeLine.material.linewidth = LAND_W + 2.3 * S.coast + 1.5 * clamp(S.zoom - 1, 0, 1);
    lakeLine.material.color.copy(cCoast).lerp(cLake, S.coast);
    glow.material.uniforms.uA.value = 0.35 * Math.max(0, 1 - S.rot * 1.4);
    glow.visible = glow.material.uniforms.uA.value > 0.01;
    bloom.material.opacity = 0.2 * Math.max(0, 1 - S.rot * 1.6); bloom.visible = bloom.material.opacity > 0.005;
    renderer.render(scene, camera);
  }

  return { render, resize, setActive: (a) => { active = a; last = 0; }, dispose: () => renderer.dispose() };
}
