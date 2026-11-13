// Small reveals for the sections below the hero. Each kind of reveal is different on purpose (a mask rise for headings,
// a wipe for service rows, typing and toggles for the demos, a drawn line for the process, an assembling stack for the
// bundle), and every one plays once. With reduced motion everything is simply shown.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const root = document.documentElement;
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
root.classList.add('rv');

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
