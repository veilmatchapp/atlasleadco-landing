// Builds the inner pages into site/<slug>/index.html from build/site-content.mjs.
import { mkdirSync, writeFileSync } from 'node:fs';
import { pillars, waitlistServices, label, price, page, processSection, bundleSection, closeSection, formScript, steps } from './site-content.mjs';

const out = (slug, html) => {
  const dir = new URL(`../site/${slug}/`, import.meta.url);
  mkdirSync(dir, { recursive: true });
  writeFileSync(new URL('index.html', dir), html);
};

const field = (name, text, { type = 'text', required = true, hint = '', auto = '' } = {}) =>
  `<label>${text}${hint ? ` <small>${hint}</small>` : ''}<input type="${type}" name="${name}"${required ? ' required' : ''}${auto ? ` autocomplete="${auto}"` : ''}></label>`;
const form = ({ id, subject, fields, submit }) => `<form class="form" id="${id}" data-form="${id}" data-subject="${subject}" novalidate>
  ${fields}
  <div class="hp" aria-hidden="true"><label>Leave this empty<input type="checkbox" name="botcheck" tabindex="-1" autocomplete="off"></label></div>
  <button class="btn btn--ink btn--block" type="submit">${submit}</button>
  <p class="form-status" role="status" aria-live="polite" hidden></p>
</form>`;

/* ---- pillar pages ---- */
const serviceItems = (list) => list.map((s) => `<li><h3>${s.name}</h3><p>${s.long}</p>${price(s.id)}${label(s)}</li>`).join('\n');
const pillarBody = (p, extra = '') => {
  const now = p.services.filter((s) => s.label === 'now'), wait = p.services.filter((s) => s.label === 'wait');
  return `<section class="paper"><div class="wrap">
  <div class="group"><h2 class="s group-h">Available now</h2><ul class="svc-list">${serviceItems(now)}</ul></div>
  ${wait.length ? `<div class="group" id="waitlist-services"><h2 class="s group-h">Coming soon: join the waitlist</h2><p>These are not available to order yet. Join the waitlist and Atlas will tell you when they are.</p><ul class="svc-list">${serviceItems(wait)}</ul></div>` : ''}
</div></section>${extra}${processSection()}${closeSection()}`;
};

const ai = pillars.find((p) => p.id === 'ai'), sec = pillars.find((p) => p.id === 'security'), web = pillars.find((p) => p.id === 'web');

out('ai', page({
  slug: 'ai', current: '/ai/', title: 'AI for small offices | Atlas, Ann Arbor and Saline',
  desc: 'Atlas sets up Microsoft 365 Copilot, ChatGPT Business or Claude Team for your office, builds two or three workflows and trains your staff. Fixed price. Ann Arbor and Saline.',
  h1: 'Get AI working in your office.', lede: 'Atlas sets up the AI tool your office will use, builds the workflows, and trains your staff. Every job has a fixed price, for offices in Ann Arbor and Saline.',
  body: pillarBody(ai),
}));

out('security', page({
  slug: 'security', current: '/security/', title: 'Security for small offices | Atlas, Ann Arbor and Saline',
  desc: 'Atlas reviews your Microsoft 365 or Google setup, tightens the settings that matter and writes the security paperwork cyber insurers ask for. Ann Arbor and Saline.',
  h1: 'Close the security gaps cyber insurers ask about.', lede: 'Atlas reviews how your office is set up, tightens the settings that matter most, and writes down the policies your next insurance application asks for.',
  body: pillarBody(sec, `<section class="paper"><div class="wrap"><h2 class="s">What Atlas does not offer today</h2>
  <ul class="plain"><li>Atlas is not a 24/7 service and does not promise a response time.</li><li>Atlas does not offer on-site emergency response.</li><li>Atlas does not run a help desk with set hours. Managed IT help is on the waitlist above.</li></ul>
  <p class="fine">If something is urgent, call your insurer or a provider that offers emergency response.</p></div></section>`),
}));

out('websites', page({
  slug: 'websites', current: '/websites/', title: 'Websites, Google profile and call handling | Atlas, Ann Arbor and Saline',
  desc: 'A fast, honest website rebuild, care plans and a Google Business Profile you own, for offices in Ann Arbor and Saline. AI receptionist and missed-call text-back on the waitlist.',
  h1: 'A fast, honest website, and a Google profile you own.', lede: 'Atlas rebuilds your website, looks after it, and sets up the profile people see when they search for you. Fixed price, for offices in Ann Arbor and Saline.',
  body: pillarBody(web),
}));

/* ---- checkup ---- */
out('checkup', page({
  slug: 'checkup', current: '/checkup/', title: 'Free Atlas Checkup | Atlas, Ann Arbor and Saline',
  desc: 'A free look at what is public about your business: mobile speed, SSL, email records, online booking and your Google profile. Nothing is scanned and nothing touches your systems.',
  h1: 'Get a free Atlas Checkup.', lede: 'Atlas looks at what anyone can see about your business online and tells you what it finds. It takes a short request form.', ctas: '',
  body: `<section class="paper"><div class="wrap cols">
  <div>
    <h2 class="s">What Atlas looks at</h2>
    <ul class="plain">
      <li>How fast your website loads on a phone</li>
      <li>Whether your website uses SSL (the padlock)</li>
      <li>Whether the website looks out of date</li>
      <li>Whether your email domain publishes SPF and DMARC records</li>
      <li>Whether visitors can book online or chat</li>
      <li>The basics of your Google profile</li>
    </ul>
    <h2 class="s">What Atlas does not do</h2>
    <p>The Checkup uses only public information. Nothing is scanned, no logins are tried, and nothing touches your systems.</p>
  </div>
  <div>
    <h2 class="s">Ask for your Checkup</h2>
    ${form({ id: 'checkup', subject: 'New Atlas Checkup request', submit: 'Request my Checkup',
      fields: [field('business', 'Business name', { auto: 'organization' }), field('website', 'Website', { type: 'url', hint: '(for example https://example.com)', auto: 'url' }), field('email', 'Email', { type: 'email', auto: 'email' }), field('name', 'Your name', { auto: 'name' })].join('\n  ') })}
  </div>
</div></section>`,
  scripts: formScript,
}));

/* ---- how it works, plans ---- */
out('how-it-works', page({
  slug: 'how-it-works', current: '', title: 'How it works | Atlas, Ann Arbor and Saline',
  desc: 'Four steps for every Atlas service: a Checkup or a call, a fixed-price scope, the work, and a handover.',
  h1: 'How it works.', lede: 'The same four steps for every service, and a clear label on whether a service is available now.',
  body: `${processSection()}<section class="paper"><div class="wrap cols">
  <div><h2 class="s">Fixed price</h2><p>Before any work starts, Atlas writes down what is included and the price. If the scope changes, you agree the change first.</p></div>
  <div><h2 class="s">Available now, or on the waitlist</h2><p>Each service is labeled. <strong>Available now</strong> means Atlas can do it today. <strong>Join the waitlist</strong> means it is coming and cannot be ordered yet. Joining a waitlist is free and does not commit you to anything.</p></div>
</div></section>${closeSection()}`,
}));

out('plans', page({
  slug: 'plans', current: '', title: 'Plans and bundles | Atlas, Ann Arbor and Saline',
  desc: 'Bundles that group Atlas services into one fixed monthly price per office, such as Atlas Essentials.',
  h1: 'Plans for the whole office.', lede: 'A bundle groups services into one fixed monthly price per office, so the basics stay covered.',
  body: `${bundleSection()}${closeSection()}`,
}));

/* ---- about, contact, privacy ---- */
out('about', page({
  slug: 'about', current: '', title: 'About Atlas | Ann Arbor and Saline',
  desc: 'Atlas is a local practice in Saline, Michigan that helps small offices with AI, security and their web presence.',
  h1: 'A local practice for small offices.', lede: 'Atlas helps offices in Ann Arbor and Saline get AI working, stay protected and get found.',
  body: `<section class="paper"><div class="wrap cols">
  <div><h2 class="s">Based in Saline, serving Ann Arbor and Saline</h2><p>Atlas Lead Group LLC is based in Saline, Michigan. Atlas works with owners and office managers of small local businesses, such as property management companies and insurance agencies.</p></div>
  <div><h2 class="s">How Atlas works</h2><ul class="plain"><li>Every service has a fixed price you agree before work starts.</li><li>Every service is labeled as available now or on the waitlist.</li><li>Reports and documents are written in plain language.</li></ul></div>
  <div><h2 class="s">What Atlas will not do</h2><ul class="plain"><li>Promise 24/7 response, on-site emergency visits or help-desk hours.</li><li>Scan or log in to your systems as part of a free Checkup.</li><li>Filter, buy or write reviews.</li></ul></div>
  <div><h2 class="s">Independent of the tools</h2><p>Atlas sets up the tools that fit your office. Microsoft, OpenAI and Anthropic make Microsoft 365 Copilot, ChatGPT and Claude. Atlas is independent of all three.</p></div>
</div></section>${closeSection()}`,
}));

out('contact', page({
  slug: 'contact', current: '', title: 'Contact | Atlas, Ann Arbor and Saline',
  desc: 'Book a call with Atlas, or join the waitlist for a service that is coming soon.',
  h1: 'Book a call.', lede: 'Tell Atlas a little about your office and what you want to look at. Atlas replies by email to set up the call.', ctas: '',
  body: `<section class="paper"><div class="wrap cols">
  <div id="call"><h2 class="s">Book a call</h2>
    ${form({ id: 'contact', subject: 'New call request from the Atlas site', submit: 'Send request',
      fields: [field('name', 'Your name', { auto: 'name' }), field('email', 'Email', { type: 'email', auto: 'email' }), field('business', 'Business name', { required: false, auto: 'organization' }), `<label>What would you like to talk about?<textarea name="message" required></textarea></label>`].join('\n  ') })}
  </div>
  <div id="waitlist"><h2 class="s">Join a waitlist</h2><p>These services are coming soon. Pick one and Atlas will email you when it is available. It is free and does not commit you to anything.</p>
    ${form({ id: 'waitlist', subject: 'New waitlist signup from the Atlas site', submit: 'Join the waitlist',
      fields: [field('name', 'Your name', { auto: 'name' }), field('email', 'Email', { type: 'email', auto: 'email' }), `<label>Which service?<select name="service" required><option value="">Choose a service</option>${waitlistServices.map((s) => `<option>${s.name}</option>`).join('')}</select></label>`].join('\n  ') })}
  </div>
</div></section>`,
  scripts: formScript,
}));

out('privacy', page({
  slug: 'privacy', current: '', title: 'Privacy | Atlas, Ann Arbor and Saline',
  desc: 'What information the Atlas site collects and how it is used.',
  h1: 'Privacy.', lede: 'A short, plain description of what this site collects.', ctas: '',
  body: `<section class="paper"><div class="wrap">
  <h2 class="s">What you send</h2><p>If you use a form on this site, Atlas receives what you type: your name, email, business name, website, and any message. Atlas uses it to reply to you and to prepare your Checkup or call.</p>
  <h2 class="s">Who handles it</h2><p>Form submissions are sent through Web3Forms (web3forms.com), a third-party form service, and delivered to Atlas by email. This site is hosted on Vercel, which keeps standard server logs.</p>
  <h2 class="s">What the site does not use</h2><p>This site has no advertising, no analytics and no tracking cookies. Fonts are served from this site, not from a third party.</p>
  <h2 class="s">Waitlists</h2><p>If you join a waitlist, Atlas uses your email only to tell you when that service is available.</p>
  <h2 class="s">Your choices</h2><p>You can ask Atlas to delete what you sent by writing to the email address on the contact page.</p>
  <p class="fine">This page describes how the site works today. If that changes, this page changes.</p>
</div></section>`,
}));

console.log('pages built:', ['ai', 'security', 'websites', 'checkup', 'how-it-works', 'plans', 'about', 'contact', 'privacy'].join(', '), `| steps ${steps.length}`);
