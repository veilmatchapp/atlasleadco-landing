// Small reveals for the sections below the hero. Each kind of reveal is different on purpose (a mask rise for headings,
// a wipe for service rows, typing and toggles for the demos, a drawn line for the process, an assembling stack for the
// bundle), and every one plays once. With reduced motion everything is simply shown.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
root.classList.add('rv');

/* ---- the engraved globes: redrawn on a canvas so they turn slowly to the right, like the hero globe ---- */
const D = Math.PI / 180, TILT = 18 * D, ROLL = 8 * D, SPEED = 0.075; // radians per second, same as the hero
const lines = [];
for (let lon = -180; lon < 180; lon += 10) { const l = []; for (let lat = -80; lat <= 80; lat += 2) l.push([lat * D, lon * D]); lines.push(l); }
for (let lat = -80; lat <= 80; lat += 10) { const l = []; for (let lon = 0; lon <= 360; lon += 3) l.push([lat * D, lon * D]); lines.push(l); }
$$('svg.engrave').forEach((svg) => {
  const cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  cv.className = svg.getAttribute('class'); cv.setAttribute('aria-hidden', 'true'); cv.dataset.r = 'draw';
  svg.replaceWith(cv);
  let size = 0, dpr = 1, yaw = 0, last = 0, running = false;
  const size_ = () => { dpr = Math.min(devicePixelRatio || 1, 2); size = Math.round(cv.clientWidth * dpr); cv.width = cv.height = size; };
  const draw = () => {
    const R = size * 0.4667, c = size / 2, col = getComputedStyle(cv).color;
    ctx.clearRect(0, 0, size, size); ctx.lineWidth = dpr; ctx.strokeStyle = col;
    ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(c, c, R, 0, 6.2832); ctx.stroke(); ctx.globalAlpha = 1;
    const cT = Math.cos(TILT), sT = Math.sin(TILT), cR = Math.cos(ROLL), sR = Math.sin(ROLL);
    ctx.beginPath();
    for (const l of lines) {
      let pen = false;
      for (const [phi, lam0] of l) {
        const lam = lam0 + yaw, cp = Math.cos(phi);
        const x = cp * Math.sin(lam), y0 = Math.sin(phi), z0 = cp * Math.cos(lam);
        const y = y0 * cT - z0 * sT, z = y0 * sT + z0 * cT;
        if (z < 0) { pen = false; continue; }
        const px = c + R * (x * cR - y * sR), py = c - R * (x * sR + y * cR);
        if (pen) ctx.lineTo(px, py); else ctx.moveTo(px, py);
        pen = true;
      }
    }
    ctx.stroke();
  };
  const tick = (t) => {
    if (!running) return;
    yaw += (t - last) / 1000 * SPEED; last = t; draw(); requestAnimationFrame(tick);
  };
  size_(); yaw = 95 * D; draw();
  addEventListener('resize', () => { size_(); draw(); });
  if (reduce || !('IntersectionObserver' in window)) return;
  new IntersectionObserver((e) => {
    const on = e[0].isIntersecting;
    if (on && !running) { running = true; last = performance.now(); requestAnimationFrame(tick); } else if (!on) running = false;
  }).observe(cv);
});

/* ---- generic reveals: add .in once an element is on screen ---- */
const els = $$('[data-r]');
if (reduce || !('IntersectionObserver' in window)) els.forEach((e) => e.classList.add('in'));
else {
  // a clip-path wipe hides the element completely, and a fully clipped element is never reported as visible,
  // so wipe items are revealed when their parent list comes into view instead
  const wipes = new Map();
  els.filter((e) => e.dataset.r === 'wipe').forEach((e) => { const p = e.parentElement; if (!wipes.has(p)) wipes.set(p, []); wipes.get(p).push(e); });
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    (wipes.get(e.target) || [e.target]).forEach((x) => x.classList.add('in'));
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px', threshold: 0.1 });
  els.filter((e) => e.dataset.r !== 'wipe').forEach((e) => io.observe(e));
  wipes.forEach((_, p) => io.observe(p));
}

/* ---- demos: small illustrations that show the workflow, played once when they come into view ---- */
async function typeInto(el, text, cps = 36) {
  el.textContent = '';
  for (let i = 1; i <= text.length; i++) { el.textContent = text.slice(0, i); await sleep(1000 / cps); }
}
const show = (el) => el && el.classList.add('show');
const demos = {
  async ai(d) {
    const [ask, ans] = $$('.ty-t', d), steps = $$('[data-step]', d);
    show(steps[0]); await typeInto(ask, ask.dataset.text, 38); await sleep(350);
    show(steps[1]); await typeInto(ans, ans.dataset.text, 44); await sleep(250);
    for (const s of steps.slice(2)) { show(s); await sleep(420); }
  },
  async security(d) {
    for (const row of $$('.sw-row', d)) { show(row); await sleep(150); row.classList.add('on'); await sleep(520); }
    show($('.sw-done', d));
  },
  async web(d) {
    const steps = $$('[data-step]', d), t = $('.ty-t', d);
    show(steps[0]); await sleep(700);
    show(steps[1]); await typeInto(t, t.dataset.text, 38); await sleep(300);
    show(steps[2]);
  },
};
function $(s, r = document) { return r.querySelector(s); }
function finish(d) { $$('[data-step], .sw-row, .sw-done', d).forEach(show); $$('.sw-row', d).forEach((r) => r.classList.add('on')); $$('.ty-t', d).forEach((t) => { t.textContent = t.dataset.text; }); }
$$('[data-demo]').forEach((d) => {
  if (reduce || !('IntersectionObserver' in window)) { finish(d); return; }
  const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting) { io.disconnect(); demos[d.dataset.demo](d); } }, { threshold: 0.55 });
  io.observe(d);
});

/* ---- the process: a line draws between the steps as the section scrolls past ---- */
const track = $('[data-track]');
if (track) {
  const items = [...track.children], section = track.closest('section');
  const update = () => {
    const r = section.getBoundingClientRect(), vh = innerHeight;
    const p = reduce ? 1 : Math.min(1, Math.max(0, (vh * 0.8 - r.top - 140) / (r.height * 0.62)));
    track.style.setProperty('--p', p.toFixed(3));
    items.forEach((li, i) => li.classList.toggle('on', p >= (i + 0.15) / items.length));
  };
  addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
}
