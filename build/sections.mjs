// The sections below the hero. Same type as the hero (large, light, tight), depth from layered dark panels on paper,
// and a different small reveal for each kind of content (see site/src/reveal.js).
import { pillars, steps, label, price } from './site-content.mjs';
import { engraveSvg } from './art.mjs';

export const row = (s, i, text = 'short') => `<li class="row${s.label === 'wait' ? ' wait' : ''}" data-r="wipe" style="--i:${i}"><div class="r-main"><b>${s.name}</b><span class="d">${s[text]}</span>${price(s.id)}</div>${label(s)}</li>`;

const demos = {
  ai: `<figure class="demo" data-demo="ai"><div class="win" aria-hidden="true">
      <div class="win-bar">Assistant</div>
      <div class="bub ask" data-step><span class="ty-t" data-text="Summarize this week's customer calls in one email."></span></div>
      <div class="bub ans" data-step><span class="ty-t" data-text="Here is a draft for you to review."></span></div>
      <ul class="out"><li data-step><i></i>Follow-ups to send</li><li data-step><i></i>Calls to return</li><li data-step><i></i>Questions for the owner</li></ul>
    </div><figcaption>Illustration of an assistant drafting a weekly summary. It is not a screenshot of any product.</figcaption></figure>`,
  security: `<figure class="demo" data-demo="security"><div class="win" aria-hidden="true">
      <div class="win-bar">Sign-in rules</div>
      <div class="sw-row"><span>Require MFA for every admin</span><i class="sw"></i></div>
      <div class="sw-row"><span>Block old sign-in methods</span><i class="sw"></i></div>
      <div class="sw-row"><span>Check that backups restore</span><i class="sw"></i></div>
      <div class="sw-row"><span>Protect the email domain (SPF, DKIM, DMARC)</span><i class="sw"></i></div>
      <p class="sw-done">Rules tightened</p>
    </div><figcaption>Illustration of a sign-in policy being tightened.</figcaption></figure>`,
  web: `<figure class="demo" data-demo="web"><div class="win" aria-hidden="true">
      <div class="win-bar">Messages</div>
      <div class="miss" data-step><b>Missed call</b><span>(734) 555-0142</span></div>
      <div class="bub auto" data-step><span class="ty-t" data-text="Sorry we missed your call. Reply with a good time and we will call you back."></span></div>
      <p class="logged" data-step>Logged to the calendar</p>
    </div><figcaption>Illustration of a missed-call text-back. This service is on the waitlist.</figcaption></figure>`,
};

const band = (p, homeOnly) => `    <article class="band" data-pillar="${p.id}">
      <div class="band-head">
        <h3 data-r="mask"><span>${p.name}</span></h3>
        <p data-r="fade">${p.pitch}</p>
        ${demos[p.id]}
      </div>
      <div class="band-body">
        <ul class="rows">
${p.services.filter((s) => !homeOnly || s.home).map((s, i) => '          ' + row(s, i)).join('\n')}
        </ul>
        <a class="more" href="/${p.slug}/">${p.link}</a>
      </div>
    </article>`;

export const servicesSection = ({ homeOnly = false } = {}) => `<section class="paper services" id="services" aria-labelledby="svc-h">
  <div class="paper-in">
    <h2 class="big" id="svc-h" data-r="mask"><span>One local partner for your AI, security and website.</span></h2>
    <p class="lede" data-r="fade">Atlas works with offices in Ann Arbor and Saline. Each service has a fixed price and starts with a call, and each one is labeled so you know what you can start today.</p>
${pillars.map((p) => band(p, homeOnly)).join('\n')}
    <div class="paper-cta" data-r="fade">
      <a class="btn btn--ink" href="/checkup/">Get a free Atlas Checkup</a>
      <a class="btn2" href="/contact/">Book a call</a>
      <p class="note">The Checkup uses only public information about your business. Nothing is scanned, no logins are tried and nothing touches your systems.</p>
    </div>
  </div>
</section>`;

export const processSection = () => `<section class="ink proc" id="process" aria-labelledby="proc-h">
  ${engraveSvg('engrave')}
  <div class="paper-in">
    <h2 class="big" id="proc-h" data-r="mask"><span>How it works</span></h2>
    <p class="lede on-ink" data-r="fade">The same four steps for every service.</p>
    <ol class="track" data-track>
${steps.map((s) => `      <li><span class="node"></span><span class="num">${steps.indexOf(s) + 1}</span><h3>${s.h}</h3><p>${s.p}</p></li>`).join('\n')}
    </ol>
  </div>
</section>`;

export const bundleSection = () => `<section class="paper bundle-s" id="plans" aria-labelledby="plans-h">
  <div class="paper-in">
    <h2 class="big" id="plans-h" data-r="mask"><span>Bundles for a whole office</span></h2>
    <p class="lede" data-r="fade">Some offices want the basics covered every month. A bundle groups services into one fixed monthly price per office.</p>
    <div class="stack" data-r="stack">
      <div class="layer l3"></div><div class="layer l2"></div>
      <div class="bundle2">
        <h3>Atlas Essentials</h3>
        <p>A security baseline for the office, kept up month after month.</p>
        <ul class="checks">
          <li style="--i:0"><i></i><span>Security baseline (the <a href="/security/">security assessment and fixes</a>)</span></li>
          <li style="--i:1"><i></i><span>Email protection</span></li>
          <li style="--i:2"><i></i><span>Security awareness training</span></li>
          <li style="--i:3"><i></i><span>A care plan for your website</span></li>
        </ul>
        <p class="price">Fixed price, per office, monthly. ${price('bundle-essentials') || 'Book a call for the price.'}</p>
        <a class="btn" href="/contact/">Book a call</a>
      </div>
    </div>
  </div>
</section>`;

export const closeSection = () => `<section class="ink close" id="start" aria-labelledby="start-h">
  ${engraveSvg('engrave engrave--low')}
  <div class="paper-in">
    <h2 class="big huge" id="start-h" data-r="mask"><span>Start with a free Atlas Checkup.</span></h2>
    <p class="lede on-ink" data-r="fade">Atlas looks at what is public about your business and tells you what it finds. No login, no scan, nothing touches your systems.</p>
    <div class="btns" data-r="fade"><a class="btn" href="/checkup/">Get a free Atlas Checkup</a><a class="btn btn--ghost" href="/contact/">Book a call</a></div>
  </div>
</section>`;
