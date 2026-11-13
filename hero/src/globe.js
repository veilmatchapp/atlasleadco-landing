// Gold dotted globe. Loaded after first paint. Reads scroll-driven state S each frame (see main.js).
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, SphereGeometry, MeshPhysicalMaterial, InstancedMesh,
  InstancedBufferAttribute, Vector3, Quaternion, Matrix4, PMREMGenerator, ACESFilmicToneMapping, LineSegments,
  BufferGeometry, Float32BufferAttribute, LineBasicMaterial, DirectionalLight, ShaderMaterial, BackSide, AdditiveBlending,
  Sprite, SpriteMaterial, CanvasTexture, SRGBColorSpace,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const FOV = 30;
const TAN = Math.tan((FOV * Math.PI) / 360);
const RAD = Math.PI / 180;
const AA = [-83.743, 42.2808]; // Ann Arbor
const vec = (lon, lat) => new Vector3(Math.cos(lat * RAD) * Math.sin(lon * RAD), Math.sin(lat * RAD), Math.cos(lat * RAD) * Math.cos(lon * RAD));
const ease = (t) => t * t * (3 - 2 * t);

// scale each dot about its own centre with one uniform, so sizes animate without touching 14k matrices
// dots also fade out with distance from Ann Arbor (uFade = chord distance inner/outer), so the dense patch dissolves instead of ending at a box edge
function dotMaterial(color, rough, envMap, fade = [9, 10]) {
  const m = new MeshPhysicalMaterial({ color, metalness: 1, roughness: rough, envMap, envMapIntensity: 1.25 });
  const u = { value: 0 }, uC = { value: vec(AA[0], AA[1]) }, uF = { value: fade };
  m.userData.size = u;
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uSize = u; sh.uniforms.uCenter = uC; sh.uniforms.uFade = uF;
    sh.vertexShader = 'uniform float uSize; uniform vec3 uCenter; uniform vec2 uFade;\n' + sh.vertexShader.replace('#include <begin_vertex>',
      'float fall = 1.0 - smoothstep(uFade.x, uFade.y, distance(normalize(instanceMatrix[3].xyz), uCenter)); vec3 transformed = vec3( position ) * uSize * fall;');
  };
  return m;
}

function dotMesh(geo, mat, src, from, count) {
  const mesh = new InstancedMesh(geo, mat, count);
  const a = new Float32Array(count * 16);
  for (let i = 0; i < count; i++) {
    const s = (from + i) * 3, o = i * 16;
    a[o] = a[o + 5] = a[o + 10] = a[o + 15] = 1;
    a[o + 12] = src[s] / 32767; a[o + 13] = src[s + 1] / 32767; a[o + 14] = src[s + 2] / 32767;
  }
  mesh.instanceMatrix = new InstancedBufferAttribute(a, 16);
  mesh.frustumCulled = false;
  return mesh;
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

export async function createGlobe(canvas, S, { mobile = false } = {}) {
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

  const key = new DirectionalLight(0xffd9a0, 1.5);
  key.position.set(-3, 2.6, 4);
  scene.add(key);
  const rim = new DirectionalLight(0xffb066, 1.1); // warm kick from behind so the edge reads against walnut
  rim.position.set(3, 1, -3);
  scene.add(rim);

  // body: dark lacquer so back-side dots are hidden and the surface catches highlights
  const body = new Mesh(new SphereGeometry(0.985, 128, 96), new MeshPhysicalMaterial({ color: 0x2a1910, roughness: 0.55, metalness: 0.15, clearcoat: 0.45, clearcoatRoughness: 0.4, envMap: env, envMapIntensity: 0.35 }));
  globe.add(body);

  const grat = new LineSegments(graticule(30, 48), new LineBasicMaterial({ color: 0xc7a348, transparent: true, opacity: 0.3, depthWrite: false }));
  grat.scale.setScalar(1.001);
  globe.add(grat);

  // dots
  const meta = await (await fetch(new URL('../assets/dots.json', import.meta.url))).json();
  const src = new Int16Array(await (await fetch(new URL('../assets/dots.bin', import.meta.url))).arrayBuffer());
  const geo = new SphereGeometry(1, 6, 4);
  const mGlobal = dotMaterial(0xd7b25a, 0.3, env), mFill = dotMaterial(0xc7a348, 0.34, env, [0.045, 0.082]), mCoast = dotMaterial(0xf3d78c, 0.25, env);
  const dGlobal = dotMesh(geo, mGlobal, src, 0, meta.global);
  const dFill = dotMesh(geo, mFill, src, meta.global, meta.fill);
  const dCoast = dotMesh(geo, mCoast, src, meta.global + meta.fill, meta.coast);
  globe.add(dGlobal, dFill, dCoast);

  // warm edge glow, additive, drawn behind the globe
  const glow = new Mesh(new SphereGeometry(1.13, 64, 48), new ShaderMaterial({
    side: BackSide, transparent: true, depthWrite: false, blending: AdditiveBlending,
    uniforms: { uA: { value: 0.5 } },
    vertexShader: 'varying vec3 vN; varying vec3 vV; void main(){ vec4 mv = modelViewMatrix * vec4(position,1.0); vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }',
    fragmentShader: 'varying vec3 vN; varying vec3 vV; uniform float uA; void main(){ float f = pow(abs(dot(normalize(vN), normalize(vV))), 3.2); gl_FragColor = vec4(vec3(0.95,0.72,0.34) * f * uA, f * uA); }',
  }));
  scene.add(glow);

  // a pool of warm light behind the globe, drawn in the scene so it lives in the same space as the object
  const bloomCanvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 });
  const bctx = bloomCanvas.getContext('2d');
  const grad = bctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  grad.addColorStop(0, 'rgba(255,196,110,0.9)'); grad.addColorStop(0.45, 'rgba(200,140,70,0.32)'); grad.addColorStop(1, 'rgba(120,70,30,0)');
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
    const m = Math.min(1, w / h);
    const cov = mobile ? 0.8 : 1.02; // fraction of half the short side the globe radius fills at rest; on desktop it bleeds off the frame
    D0 = Math.sqrt(1 + Math.pow(1 / (cov * TAN * m), 2));
    D1 = 1 + 0.42 / (2 * TAN * m);
    D2 = 1 + 0.0135 / (2 * TAN * m); // county-sized view
    S.sizes = { w, h };
  }
  resize();
  new ResizeObserver(resize).observe(canvas.parentElement);

  const sizeBase = mobile ? 1.4 : 1;
  function render(time) {
    if (!active) return;
    const dt = Math.min(0.05, last ? time - last : 0.016); last = time;
    auto += dt * 0.075 * (1 - S.rot);
    qYaw.setFromAxisAngle(yAxis, auto);
    qAuto.copy(qTilt).multiply(qYaw);
    globe.quaternion.slerpQuaternions(qAuto, qMich, ease(Math.min(1, Math.max(0, S.rot))));

    const D = dist(S.zoom);
    camera.position.set(0, 0, D);
    camera.near = Math.max(0.003, D - 1.4);
    camera.setViewOffset(w, h, -S.ox, -S.oy, w, h);
    camera.updateProjectionMatrix();

    // the lacquer's gloss and the key light would haze the close-up, so they fade as we dive
    const calm = 1 - ease(Math.min(1, Math.max(0, S.rot)));
    key.intensity = 0.25 + 1.25 * calm;
    body.material.clearcoat = 0.05 + 0.4 * calm;
    const k = Math.min(1.6, Math.max(0.2, (D - 1) / (D1 - 1)));
    const near = Math.max(0.04, k); // dots keep a steady size on screen as the camera closes in; their spacing opens up instead
    const gk = Math.min(1, (D - 1) / (D0 - 1));
    mGlobal.userData.size.value = 0.0105 * sizeBase * S.global * gk;
    mFill.userData.size.value = 0.00088 * near * S.fill;
    mCoast.userData.size.value = 0.00078 * near * S.coast;
    dGlobal.visible = S.global > 0.01; dFill.visible = S.fill > 0.01; dCoast.visible = S.coast > 0.01;
    grat.material.opacity = 0.3 * S.grat; grat.visible = S.grat > 0.01;
    glow.material.uniforms.uA.value = 0.5 * Math.max(0, 1 - S.rot * 1.4);
    glow.visible = glow.material.uniforms.uA.value > 0.01;
    bloom.material.opacity = 0.2 * Math.max(0, 1 - S.rot * 1.6); bloom.visible = bloom.material.opacity > 0.005;
    renderer.render(scene, camera);
  }

  return { render, resize, setActive: (a) => { active = a; last = 0; }, dispose: () => renderer.dispose() };
}
