import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
const params = new URLSearchParams(location.search);
const isMobile = () => matchMedia('(max-width: 820px)').matches;
if (params.has('bare')) root.classList.add('bare');

/* ---------- typing: the full text is always laid out, so nothing reflows while it types ---------- */
const typers = $$('.ty');
const caret = Object.assign(document.createElement('span'), { className: 'caret' });
caret.setAttribute('aria-hidden', 'true');
typers.forEach((el) => {
  el._full = el.dataset.ty;
  el.innerHTML = '<span class="tt"></span><span class="rest"></span>';
  el._tt = el.firstChild; el._rest = el.lastChild;
  el._rest.textContent = el._full;
});
const setTyped = (el, n) => { el._tt.textContent = el._full.slice(0, n); el._rest.textContent = el._full.slice(n); };

if (root.classList.contains('static')) {
  typers.forEach((el) => setTyped(el, el._full.length));
} else {
  live();
}

function live() {
  root.classList.add('live');

  /* ---------- smooth scroll (Lenis honours prefers-reduced-motion itself) ---------- */
  const lenis = new Lenis({ autoRaf: false });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const stage = $('.stage'), seq = $('#sequence'), world = $('.world'), canvas = $('#globe');
  const heroCopy = $('.f1 .copy');
  const svg = $('#county'), box = $('.mapbox'), mapCap = $('.map figcaption');
  const outline = $('.outline', svg), fillshape = $('.fillshape', svg), base = $('.base', svg);
  const lines = $$('.road, .river', svg);
  const towns = $$('.town', svg), townText = $$('.town text', svg), halos = $$('.town .halo', svg);
  const mapLine = $$('.f3 .m > span'), mapAside = $('.f3 .aside'), mapCopy = $('.f3 .copy');
  const lap = $('.laptop'), f4Line = $('.f4 .w'), f4Aside = $('.f4 .aside'), f4Copy = $('.f4 .copy');
  const [a1, a2] = $$('.ask'), [s1, s2] = $$('.stat'), [m1, m2] = $$('.mail');

  const S = { rot: 0, zoom: 0, ox: 0, oy: 0, global: 1, fill: 0, coast: 0, grat: 1, sizes: { w: 1, h: 1 } };
  const W = () => stage.clientWidth, H = () => stage.clientHeight;
  // where the globe sits at rest: right of centre on desktop, high on phones
  const ox0 = () => (isMobile() ? 0 : 0.27 * W());
  const oy0 = () => (isMobile() ? -0.2 * H() : -0.02 * H());
  // where Ann Arbor sits on the county map, relative to the stage centre
  const aa = () => {
    const [px, py] = svg.dataset.aa.split(' ').map(Number);
    return { x: box.offsetLeft + (px / 100) * box.offsetWidth, y: box.offsetTop + (py / 100) * box.offsetHeight, px, py };
  };
  const fx = () => aa().x - W() / 2, fy = () => aa().y - H() / 2;
  const lapStartX = () => aa().x - (lap.offsetLeft + lap.offsetWidth / 2);
  const lapStartY = () => aa().y - (lap.offsetTop + lap.offsetHeight / 2);

  gsap.set([a1, s1, a2, s2, m2], { opacity: 0 });

  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: seq, start: 'top top', end: 'bottom bottom', scrub: 0.5, invalidateOnRefresh: true,
      onRefreshInit: () => { gsap.set(box, { transformOrigin: `${aa().px}% ${aa().py}%` }); },
      onUpdate: (self) => gate(self.progress),
    },
  });

  tl
    // stage 1 to 2: the headline lifts away, the globe turns to Michigan and the camera pushes in
    .to(heroCopy, { opacity: 0, y: () => -H() * 0.1, ease: 'power2.in', duration: 0.12 }, 0.07)
    .fromTo(S, { rot: 0 }, { rot: 1, duration: 0.34 }, 0.08)
    .fromTo(S, { zoom: 0, ox: ox0, oy: oy0 }, { zoom: 1, ox: fx, oy: fy, ease: 'power2.inOut', duration: 0.38 }, 0.08)
    .to(S, { grat: 0, duration: 0.18 }, 0.24)
    // the coarse dots shrink away while the dense Michigan dots and the coastline grow in
    .to(S, { global: 0, ease: 'power2.in', duration: 0.14 }, 0.3)
    .to(S, { coast: 1, ease: 'power2.out', duration: 0.16 }, 0.3)
    .to(S, { fill: 1, ease: 'power2.out', duration: 0.16 }, 0.36)
    .to(S, { zoom: 2, ease: 'power2.in', duration: 0.18 }, 0.46)
    // stage 3: the county grows out of the same screen point and draws itself
    .to(canvas, { opacity: 0, duration: 0.08 }, 0.58)
    .fromTo(box, { scale: 0.55, opacity: 0 }, { scale: 1, opacity: 1, ease: 'power2.out', duration: 0.1 }, 0.58)
    .fromTo(outline, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.09 }, 0.59)
    .fromTo(base, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.6)
    .fromTo(fillshape, { opacity: 0 }, { opacity: 1, duration: 0.07 }, 0.61)
    .fromTo(lines, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.05, stagger: { amount: 0.04 } }, 0.63)
    .fromTo(mapCap, { opacity: 0 }, { opacity: 1, duration: 0.05 }, 0.68)
    .fromTo(townText, { opacity: 0 }, { opacity: 1, duration: 0.03, stagger: { amount: 0.02 } }, 0.66)
    .fromTo(mapLine[0], { yPercent: 108 }, { yPercent: 0, ease: 'power3.out', duration: 0.05 }, 0.6)
    .fromTo(mapLine[1], { yPercent: 108 }, { yPercent: 0, ease: 'power3.out', duration: 0.05 }, 0.65)
    .fromTo(mapAside, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.69)
    // stage 4: the map dissolves toward Ann Arbor while the laptop screen grows out of that point
    .to(mapCopy, { opacity: 0, duration: 0.05 }, 0.74)
    .to(mapCap, { opacity: 0, duration: 0.03 }, 0.75)
    .to(box, { scale: 3.4, ease: 'power2.in', duration: 0.12 }, 0.76)
    .to(box, { opacity: 0, duration: 0.05 }, 0.76)
    .fromTo(lap, { scale: 0.07, x: lapStartX, y: lapStartY }, { scale: 1, x: 0, y: 0, ease: 'power3.out', duration: 0.14 }, 0.78)
    .fromTo(lap, { opacity: 0 }, { opacity: 1, duration: 0.03 }, 0.78)
    .fromTo(f4Line, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', ease: 'power2.inOut', duration: 0.06 }, 0.86)
    .fromTo(f4Aside, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.91)
    .to({}, { duration: 0.0001 }, 1); // pad so the timeline is exactly 1 long: positions above are scroll progress

  /* ---------- the assistant types by the clock once the screen has landed ---------- */
  const type = (el, cps) => {
    const o = { n: 0 };
    return gsap.to(o, {
      n: el._full.length, duration: el._full.length / cps, ease: 'none',
      onStart: () => el.insertBefore(caret, el._rest),
      onUpdate: () => setTyped(el, Math.round(o.n)),
      onComplete: () => { setTyped(el, el._full.length); caret.remove(); },
    });
  };
  const [promptA, promptB] = [a1, a2].map((e) => $('.ty', e));
  const subject = $('.m1 .fld .ty'), body1 = $('.m1 .bodytxt'), body2 = $('.m2 .bodytxt');
  const typing = gsap.timeline({ paused: true });
  typing
    .to(a1, { opacity: 1, duration: 0.25 })
    .add(type(promptA, 34))
    .to(s1, { opacity: 1, duration: 0.3 }, '+=0.2')
    .add(type(subject, 38), '+=0.15')
    .add(type(body1, 60))
    .to(a2, { opacity: 1, duration: 0.25 }, '+=0.5')
    .add(type(promptB, 34))
    .to(s2, { opacity: 1, duration: 0.3 }, '+=0.2')
    .to(m2, { opacity: 1, duration: 0.3 }, '+=0.1')
    .add(type(body2, 60), '+=0.1');
  let typed = false;
  const resetTyping = () => {
    typing.pause(0); typed = false; caret.remove();
    typers.forEach((el) => setTyped(el, 0));
    gsap.set([a1, s1, a2, s2, m2], { opacity: 0 });
  };
  resetTyping();

  /* ---------- gating: pause the render loop off screen, run and reset typing ---------- */
  let visible = true, globe = null, lastOn = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(stage);
  function gate(p) {
    if (globe) globe.setActive(visible && p < 0.7);
    const on = p > 0.66 && p < 0.8;
    if (on !== lastOn) { lastOn = on; towns.forEach((t) => t.classList.toggle('on', on)); }
    if (p > 0.905 && !typed) { typed = true; typing.restart(); }
    else if (p < 0.8 && typed) resetTyping();
  }

  /* ---------- the 3D chunk loads after the page has painted, so the headline stays the LCP ---------- */
  const start3D = () => import('./globe.js').then(async (m) => {
    globe = await m.createGlobe(canvas, S, { mobile: isMobile() });
    gsap.ticker.add((t) => globe.render(t));
    world.classList.add('ready');
    ScrollTrigger.refresh();
  });
  const idle = window.requestIdleCallback || ((f) => setTimeout(f, 200));
  if (document.readyState === 'complete') idle(start3D);
  else addEventListener('load', () => idle(start3D), { once: true });

  if (params.has('debug')) {
    window.__atlas = {
      S, tl, lenis, typing,
      seek: (p) => { const max = document.documentElement.scrollHeight - innerHeight; lenis.scrollTo(p * max, { immediate: true, force: true }); ScrollTrigger.update(); },
    };
  }
}
