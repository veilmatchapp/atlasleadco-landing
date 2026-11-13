// Single source for the site's content: service catalog, labels, navigation, footer and the shared page shell.
// Labels come from the owner brief (see CLAUDE.md). A service labeled "wait" can only be joined on a waitlist, never bought.
import { readFileSync, existsSync } from 'node:fs';

export const BASE = 'https://www.atlasleadco.com';

// Prices stay hidden until the owner approves them. Values live in a gitignored file while this repo is public.
export const SHOW_PRICES = process.env.SHOW_PRICES === 'true';
const priceFile = new URL('../site/prices.local.json', import.meta.url);
const prices = SHOW_PRICES && existsSync(priceFile) ? JSON.parse(readFileSync(priceFile, 'utf8')) : {};
export const price = (id) => (SHOW_PRICES && prices[id] ? `<span class="price">${prices[id]}</span>` : '');

export const pillars = [
  {
    id: 'ai', slug: 'ai', name: 'Work smarter with AI', link: 'See the AI services',
    pitch: 'Set up the AI tools your staff already hear about, and teach people to use them safely.',
    services: [
      { id: 'ai-sprint', name: 'AI implementation sprint', home: true, label: 'now',
        short: 'Set up Microsoft 365 Copilot, ChatGPT Business or Claude Team, build 2 to 3 real workflows and train your staff.',
        long: 'Atlas sets up the AI tool your office will use (Microsoft 365 Copilot, ChatGPT Business or Claude Team), builds two or three workflows around work your staff repeat every week, and trains your people to use them. You choose the tool on the first call.' },
      { id: 'ai-workshop', name: 'AI training workshop', home: true, label: 'now',
        short: 'Half-day team training on safe, productive AI use.',
        long: 'A half-day session for your whole team on using AI tools well and safely: what to put in them, what to keep out, and how to check what they write.' },
      { id: 'ai-assessment', name: 'AI assessment', home: true, label: 'now',
        short: 'A written report on where AI saves your office time, with costs and step-by-step fixes.',
        long: 'Atlas reviews how your office works and writes up where AI would save time, what each option would cost and the steps to put it in place. You can act on the report yourself or ask Atlas to do the work.' },
      { id: 'ai-automations', name: 'Custom automations', home: true, label: 'now',
        short: 'Intake, scheduling, reporting and document workflows, quoted per project.',
        long: 'Workflows for intake, scheduling, reporting and documents, built around how your office already works and quoted per project.' },
    ],
  },
  {
    id: 'security', slug: 'security', name: 'Stay protected', link: 'See the security services',
    pitch: 'Close the gaps that cyber insurers ask about, and keep the paperwork ready for your next application.',
    services: [
      { id: 'sec-assessment', name: 'Security assessment', home: true, label: 'now',
        short: 'A review of your Microsoft 365 or Google settings, MFA, admin accounts, backups and email security, with a scored report and prioritized fixes.',
        long: 'Atlas reviews your Microsoft 365 or Google settings, MFA, admin accounts, backups, endpoint protection and email security, and checks them against the controls cyber insurers ask about. You get a scored report with the fixes in priority order.' },
      { id: 'sec-docs', name: 'Security documentation pack', home: true, label: 'now',
        short: 'Written policies, an incident response plan and an evidence folder for your next insurance application.',
        long: 'A written security policy, incident response plan, access and password rules, backup and recovery plan, a vendor list and an evidence folder you can use for your next insurance application.' },
      { id: 'sec-hardening', name: 'Microsoft 365 and Google Workspace hardening', home: true, label: 'now',
        short: 'MFA, admin lockdown, sign-in rules and backups.',
        long: 'Atlas tightens the settings that matter most: multi-factor authentication, admin accounts, sign-in rules and backups.' },
      { id: 'sec-email', name: 'Email protection', home: true, label: 'now',
        short: 'Filtering plus SPF, DKIM and DMARC set up properly.',
        long: 'Atlas sets up email filtering and the SPF, DKIM and DMARC records for your domain, and checks they are configured correctly.' },
      { id: 'sec-training', name: 'Security awareness training', label: 'now',
        short: 'Phishing simulations plus short quarterly training.',
        long: 'Simulated phishing emails plus short quarterly training for your staff.' },
      { id: 'sec-lead', name: 'Monthly security lead', label: 'now',
        short: 'Quarterly reviews, insurance renewal answers and a written report for the owner.',
        long: 'An ongoing arrangement: quarterly reviews of your setup, help answering your insurance renewal questions, and a written report for the owner of the office.' },
      { id: 'sec-firewall', name: 'Firewall and network setup', label: 'wait',
        short: 'Project-based setup and hardening.',
        long: 'Project-based firewall and network setup and hardening.' },
      { id: 'sec-edr', name: 'Endpoint protection with 24/7 monitoring', home: true, label: 'wait',
        short: 'Proven engines plus a partner security operations center.',
        long: 'Endpoint protection built on proven engines, watched around the clock by a partner security operations center.' },
      { id: 'sec-compliance', name: 'Compliance programs', label: 'wait',
        short: 'IRS WISP, FTC Safeguards Rule programs and CMMC readiness for defense suppliers.',
        long: 'Programs for the IRS written information security plan (WISP), the FTC Safeguards Rule, and CMMC readiness for defense suppliers.' },
      { id: 'sec-helpdesk', name: 'IT help desk', label: 'wait',
        short: 'Managed support for small offices.',
        long: 'Managed IT support for small offices.' },
    ],
  },
  {
    id: 'web', slug: 'websites', name: 'Get found and win the call', link: 'See the web services',
    pitch: 'A fast, honest website and a Google profile you own, so people find you and can reach you.',
    services: [
      { id: 'web-rebuild', name: 'Website rebuild', home: true, label: 'now', short: 'Up to 5 or up to 12 pages.',
        long: 'A fast, honest website for your office, in two sizes: up to 5 pages or up to 12 pages.' },
      { id: 'web-care', name: 'Care plans', home: true, label: 'now', short: 'Hosting, updates, backups, small edits and a monthly report.',
        long: 'Hosting, updates, backups, small edits and a monthly report, so the site stays current after launch.' },
      { id: 'web-gbp', name: 'Google Business Profile setup', home: true, label: 'now', short: 'A profile you own, set up and optimized.',
        long: 'A Google Business Profile that you own, set up and optimized.' },
      { id: 'web-seo', name: 'Local SEO (monthly)', label: 'wait', short: 'Citations, profile posts, on-page work and a monthly report.',
        long: 'Monthly local search work: citations, profile posts, on-page work and a monthly report.' },
      { id: 'web-receptionist', name: 'AI receptionist', home: true, label: 'wait', short: 'Answers, qualifies callers, books into your calendar and logs calls.',
        long: 'An AI receptionist that answers calls, qualifies callers, books into your calendar and logs every call. Built on existing platforms.' },
      { id: 'web-textback', name: 'Missed-call text-back', home: true, label: 'wait', short: 'An automatic text reply to missed calls.',
        long: 'An automatic text reply to the calls your office misses, connected to your calendar and logged.' },
      { id: 'web-reviews', name: 'Review requests', label: 'wait', short: 'Asks every customer for a review. Never filters, buys or writes reviews.',
        long: 'A request sent to every customer asking for a review. Atlas never filters who is asked, never buys reviews and never writes them.' },
    ],
  },
];

export const waitlistServices = pillars.flatMap((p) => p.services).filter((s) => s.label === 'wait');

export const label = (s) => (s.label === 'now' ? '<span class="lbl now">Available now</span>' : '<a class="lbl wait" href="/contact/#waitlist">Join the waitlist</a>');

export const steps = [
  { h: 'Start with a Checkup or a call', p: 'Atlas looks at what is public about your business, or talks through what you need.' },
  { h: 'Agree the scope and a fixed price', p: 'You see what is included before any work starts.' },
  { h: 'Atlas does the work', p: 'Set up, configured and written down, on the tools your office already uses.' },
  { h: 'Handover and follow-up', p: 'Your staff learn it. Ongoing plans, like a care plan or a monthly security lead, are optional.' },
];

export const nav = [
  { href: '/ai/', text: 'AI' }, { href: '/security/', text: 'Security' }, { href: '/websites/', text: 'Websites' }, { href: '/checkup/', text: 'Checkup' },
];
export const footerLinks = [
  { href: '/how-it-works/', text: 'How it works' }, { href: '/plans/', text: 'Plans' }, { href: '/about/', text: 'About' }, { href: '/contact/', text: 'Contact' }, { href: '/privacy/', text: 'Privacy' },
];

export const headerHtml = (current = '', solid = true) => `<header class="top${solid ? ' solid page' : ''}">
  <a class="brand" href="/" aria-label="Atlas Lead Group, home"><img src="/atlas-logo.png" width="600" height="281" alt="Atlas Lead Group"></a>
  <nav aria-label="Main">${nav.map((n) => `<a href="${n.href}"${n.href === current ? ' aria-current="page"' : ''}>${n.text}</a>`).join('')}</nav>
</header>`;

export const footerHtml = (extra = '') => `<footer class="end">
  <div class="end-in">
    <div><strong>Atlas</strong><br>Atlas Lead Group LLC. Serving Ann Arbor and Saline, Michigan.</div>
    <nav aria-label="Footer">${footerLinks.map((n) => `<a href="${n.href}">${n.text}</a>`).join('')}</nav>
    <p class="legal">Microsoft 365 Copilot is a Microsoft product, ChatGPT is an OpenAI product and Claude is an Anthropic product. Atlas is independent of all three.${extra}</p>
  </div>
</footer>`;

export const ctaButtons = '<div class="btns"><a class="btn" href="/checkup/">Get a free Atlas Checkup</a><a class="btn btn--ghost" href="/contact/">Book a call</a></div>';

export const formScript = '<script src="/config.js"></script><script src="/forms.js" defer></script>';

export function page({ slug, title, desc, current, h1, lede, body, hero = true, ctas = ctaButtons, scripts = '' }) {
  const url = `${BASE}/${slug ? slug + '/' : ''}`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#101C2B">
<link rel="canonical" href="${url}">
<link rel="icon" href="data:,">
<link rel="preload" href="/fonts/grotesk-600.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/base.css">
<link rel="stylesheet" href="/pages.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${headerHtml(current)}
<main id="main">
${hero ? `<section class="phero"><div class="phero-in"><h1>${h1}</h1><p class="lede">${lede}</p>${ctas}</div></section>` : ''}
${body}
</main>
${footerHtml()}
${scripts}
</body>
</html>
`;
}

// reusable blocks
export const servicesSection = ({ homeOnly = false } = {}) => `<section class="paper" id="services" aria-labelledby="svc-h">
  <div class="paper-in">
    <h2 id="svc-h">One local partner for your AI, your security and your website.</h2>
    <p class="lede">Atlas works with offices in Ann Arbor and Saline. Each service has a fixed price and starts with a call, and each one is labeled so you know what you can start today.</p>
    <div class="pillars">
${pillars.map((p) => `      <article class="pillar">
        <h3>${p.name}</h3>
        <p>${p.pitch}</p>
        <ul class="svc">
${p.services.filter((s) => !homeOnly || s.home).map((s) => `          <li><b>${s.name}</b><span class="d">${s.short}</span>${label(s)}</li>`).join('\n')}
        </ul>
        <a class="more" href="/${p.slug}/">${p.link}</a>
      </article>`).join('\n')}
    </div>
    <div class="paper-cta">
      <a class="btn btn--ink" href="/checkup/">Get a free Atlas Checkup</a>
      <a class="btn2" href="/contact/">Book a call</a>
      <p class="note">The Checkup uses only public information about your business. Nothing is scanned, no logins are tried and nothing touches your systems.</p>
    </div>
  </div>
</section>`;

export const processSection = () => `<section class="paper" id="process" aria-labelledby="proc-h">
  <div class="paper-in">
    <h2 id="proc-h">How it works</h2>
    <p class="lede">The same four steps for every service.</p>
    <ol class="steps">
${steps.map((s) => `      <li><h3>${s.h}</h3><p>${s.p}</p></li>`).join('\n')}
    </ol>
  </div>
</section>`;

export const bundleSection = () => `<section class="paper" id="plans" aria-labelledby="plans-h">
  <div class="paper-in">
    <h2 id="plans-h">Bundles for a whole office</h2>
    <p class="lede">Some offices want the basics covered every month. A bundle groups services into one fixed monthly price per office.</p>
    <div class="bundle">
      <h3>Atlas Essentials</h3>
      <p>A security baseline for the office, kept up month after month.</p>
      <ul>
        <li>Security baseline (the <a href="/security/">security assessment and fixes</a>)</li>
        <li>Email protection</li>
        <li>Security awareness training</li>
        <li>A care plan for your website</li>
      </ul>
      <p class="price">Fixed price, per office, monthly. ${price('bundle-essentials') || 'Book a call for the price.'}</p>
      <a class="btn" href="/contact/">Book a call</a>
    </div>
  </div>
</section>`;

export const closeSection = () => `<section class="paper" id="start" aria-labelledby="start-h">
  <div class="paper-in">
    <h2 id="start-h">Start with a free Atlas Checkup.</h2>
    <p class="lede">Atlas looks at what is public about your business and tells you what it finds. No login, no scan, nothing touches your systems.</p>
    <div class="paper-cta"><a class="btn btn--ink" href="/checkup/">Get a free Atlas Checkup</a><a class="btn2" href="/contact/">Book a call</a></div>
  </div>
</section>`;
