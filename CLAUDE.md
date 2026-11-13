# Atlas website: rules for Claude Code

You are building atlasleadco.com for Atlas, a one-person local practice in Saline, Michigan that helps small offices with AI, security and their web presence.
The owner has rejected two rounds of designs as "looks AI-built." Distinctiveness is the job.

Scope source: `tasks/SITE_SCOPE_2026-11-13.md` (owner brief, 2026-11-13). That file is **local only and gitignored** because this GitHub repo is public and the brief holds personal notes and unapproved draft prices. This file is the public-safe version of it. Read the brief for the draft prices and the full tables when you need them.

## The business (updated 2026-11-13)
- Name on the site: **Atlas**. Legal entity: Atlas Lead Group LLC. Footer: "Atlas Lead Group LLC" until the Atlas assumed name is filed.
- Logo: keep `atlas-logo.png` exactly as is. The owner made it. Don't redraw, recolor or crop it. Its lettering is white, so it needs a dark ground.
- Service area: **Ann Arbor and Saline** only.
- No founder name and no photo of the owner anywhere.
- Don't mention Prospector or Atlas Telephony on the site.
- Audience: owners and office managers of 5–50 person local businesses (property management, insurance agencies). Busy, skeptical of hype. They buy on clarity, trust and specific outcomes.

### Positioning: three pillars, one local partner
The site used to sell only AI. Atlas now sells three pillars together:
1. **Work smarter with AI**
2. **Stay protected** (security). A core pillar, not an add-on.
3. **Get found and win the call** (websites, Google profile, AI receptionist)

Homepage idea, to rewrite in plain language without the copy tells below: one local partner for the AI, the security and the web presence of a small office in Ann Arbor or Saline.

**Credential lines are not approved.** Don't publish any claim about who runs Atlas, their profession or their employer (for example "run by a working professional in X") without the owner's explicit yes in this conversation. Security buyers weigh credentials, so ask him once when the copy needs it.

**Capacity is limited.** Never promise 24/7 response, on-site emergencies or help-desk hours.

### Service catalog and availability labels
Show every service. Each carries one honest label:
- **Available now:** the owner can deliver it today.
- **Join the waitlist:** coming soon. A waitlist form only. Never a "buy" button, never wording that implies it can be ordered.

Work smarter with AI (page `/ai`)
- AI implementation sprint: set up Microsoft 365 Copilot, ChatGPT Business (renamed from ChatGPT Team in Aug 2025) or Claude Team; build 2–3 real workflows; train staff. Available now.
- AI training workshop: half-day team training on safe, productive AI use. Available now.
- AI assessment: written report on where AI saves the office time, with costs and step-by-step fixes. Available now.
- Custom automations: intake, scheduling, reporting and document workflows, quoted per project. Available now.

Stay protected (page `/security`)
- Security assessment: review of Microsoft 365 or Google settings, MFA, admin accounts, backups, endpoint protection and email security, checked against the controls cyber insurers ask about. Scored report with prioritized fixes. Available now.
- Security documentation pack: written security policy, incident response plan, access and password rules, backup and recovery plan, vendor list, and an evidence folder for the next insurance application. Available now.
- Microsoft 365 / Google Workspace hardening: MFA, admin lockdown, sign-in rules, backups. Available now.
- Email protection: filtering plus SPF, DKIM and DMARC set up properly. Available now.
- Security awareness training: phishing simulations plus short quarterly training. Available now.
- Monthly security lead: quarterly reviews, insurance renewal answers, a written report for the owner of the office. Available now.
- Firewall and network setup: project-based setup and hardening. **Label undecided: ask the owner.** Don't show it as Available now until he says so.
- Endpoint protection with 24/7 monitoring: proven engines plus a partner security operations center. Join the waitlist.
- Compliance programs: IRS WISP, FTC Safeguards Rule programs, CMMC readiness for defense suppliers. Join the waitlist.
- IT help desk: managed support for small offices. Join the waitlist.

Get found and win the call (page `/websites`, plus `/ai-receptionist` if the content needs its own page)
- Website rebuild: fast, honest site, up to 5 or up to 12 pages. Available now.
- Care plans: hosting, updates, backups, small edits, monthly report. Available now.
- Google Business Profile setup: client-owned profile, set up and optimized. Available now.
- Local SEO (monthly): citations, profile posts, on-page work, monthly report. Join the waitlist.
- AI receptionist: answers, qualifies callers, books into the calendar, logs calls. Join the waitlist.
- Missed-call text-back: automatic text reply to missed calls. Join the waitlist.
- Review requests: asks every customer for a review. Never filters, buys or writes reviews. Join the waitlist.

Bundles: a section on the home page plus `/pricing` or `/plans`. Example: **Atlas Essentials** = security baseline + email protection + awareness training + care plan, priced per office, monthly.

### Prices
The owner has not approved any prices. Show "Fixed price" and "Book a call". Show no dollar amounts anywhere.
- Build the price display as a component behind one config flag, `SHOW_PRICES=false`.
- The draft "from" prices are in the local brief only. While this repo is public, keep the price values **out of committed files**: read them at build time from a gitignored file, and ship no price strings in the built site unless the flag is true.

### The free Atlas Checkup (main call to action)
The primary button sitewide is **"Get a free Atlas Checkup"**. "Book a call" is the secondary button.
- Page `/checkup` explains the check. It uses only public information about the business: website speed on mobile, SSL, an outdated site, whether the email domain publishes SPF and DMARC records, online booking and chat, Google profile basics.
- State clearly that nothing is scanned, no logins are attempted and nothing touches their systems.
- Short request form on Web3Forms: business name, website, email, name. Success shows only when Web3Forms confirms receipt.
- Don't claim turnaround times or results the owner hasn't approved.

### Pages
Home, `/ai`, `/security`, `/websites` (and `/ai-receptionist` if needed), `/checkup`, `/how-it-works`, `/about`, `/contact`, `/privacy`, plus `/pricing` or `/plans` for bundles. The nav shows the three pillars plus Checkup.

## Hard rules
- Nothing fake: no invented stats, testimonials, reviews, client logos, "trusted by" bars, ratings, awards, or review schema (FTC 16 CFR 465 plus the owner's standard). Label illustrations as illustrations.
- Don't imply a track record ("most clients", "our clients") or a team ("our experts"). This is one person.
- Honest availability: a service labeled Join the waitlist is never described as something a visitor can buy or start today.
- The form must show success only when the form service confirms receipt. On failure, show an error and a fallback contact.
- Never commit secrets. **This repo is public:** also keep personal notes about the owner, and unapproved prices, out of committed files.
- After every completed task: commit, push, confirm local main equals origin/main, and report the hash.
- Plan first. Show the owner screenshots before building full pages.

## Banned defaults (these are why earlier rounds looked AI-made)
Don't use any of these unless the owner asks for them by name:
- A near-black background with one gold or acid accent and nothing else going on.
- Broadsheet layout: hairline rules everywhere, a left label rail, newspaper columns.
- ALL-CAPS tracked eyebrow labels above headings; monospace micro-labels; strings joined with middle dots ("A · B · C").
- One word in a headline set in italic, bold or a different color.
- "01 / 02 / 03" numbering on anything that isn't a real sequence.
- "→" appended to buttons and links; pill buttons by default.
- Identical rounded cards with the same radius and shadow; gradient washes; a green "status" dot pill.
- The same fade-and-slide-up on every section; cursor glows; marquees; preloaders or intro screens.
- Literal metaphors drawn flat in CSS (paper forms, rubber stamps, road signs). Round 2 was rejected for this.
- A centered hero with a headline, subhead and two buttons, unless chosen on purpose.
- Copy tells: em dashes, "Built different", "Real results", "Ready to…?", "unlock", "seamless", "leverage", "elevate", three-word fragment headlines.

## What "premium" means here (round 2 was rejected as basic)
Read the reference board first: https://claude.ai/artifact/LeyhAkSYBD5w3W522FE1zp
- **Motion is required.** The owner wants a living, animated site, not a static one. Motion is welcome when it shows something; it's banned only when it's the same generic effect stamped on everything.
- **Real media is required.** Every reference leans on rendered 3D, real footage or real product UI. A page made only of CSS boxes will look basic, however clean it is.
- **Craft over cleverness.** One simple idea, executed with a lot of polish: light, material, easing and type tuned by eye from screenshots.
- **A full scroll, not a single screen.** Show the whole home page rhythm, never a hero plus a footer.

## Signature moment (the one big idea)
Reference technique: jeskojets.com (scroll carries you through one object). Material reference: harkcap.com. Office-UI reference: endex.ai.
1. Open: warm deep-dark page (palette under test, see Color); a **3D globe** on a dark lacquer body with a subtle rim light (Three.js, physical material, environment light), turning slowly. The globe is drawn as a **very faint latitude and longitude grid** (about every 15°, line opacity about 0.08 to 0.15, reading as fine engraving, not a cage) plus **thin, faint coastlines** from real data at a low level of detail. No dot continents. Large headline low-left; primary button "Get a free Atlas Checkup", secondary "Book a call".
2. Scroll in (GSAP ScrollTrigger, pinned, scrubbed): the globe turns to Michigan; the camera pushes in; the **Great Lakes coastline line brightens and thickens**, then hands off to the county map.
3. Land on Washtenaw County (Census boundary data as SVG); Ann Arbor and Saline light up.
4. The map gives way to a laptop screen: a recreated email and assistant window typing out a renewal letter and a follow-up email. Label it as an illustration. Don't use real Microsoft screenshots or logos without checking their trademark rules. Consider one equally honest illustration for security (for example a recreated sign-in policy screen being tightened, labeled as an illustration).
5. Then calm sections on light "paper" grounds (services for all three pillars, process, bundles, about, contact), with small reveals that demonstrate each workflow.
Hero copy must introduce all three pillars, not only AI. Credit the coastline data source on the page.
Smooth scroll: Lenis (respects reduced motion). Reduced motion: four still frames. No WebGL: a pre-rendered image. The headline must stay the LCP element; load the 3D right after it.

## Color
Two palettes are under test: **A, refined walnut** (gold only for the logo, the button and key highlights) and **B, deep ink** (dark blue-slate ground, the logo's gold as the single warm accent, real secondary tones). Token plans are in `tasks/palette-A-refined-walnut.md` and `tasks/palette-B-deep-ink.md`. The owner picks; until then both live behind a theme switch. Business sections below the hero use light paper grounds. Every text pair must reach 4.5:1 contrast, and the logo must be checked on the chosen ground.

## Process (required)
1. Load the frontend-design skill before any design work.
2. Ground the design in this subject: Washtenaw County, small local offices, the Atlas figure and globe in the owner's logo. Distinctive choices come from the subject, not from "premium SaaS."
3. Write a short token plan (4–6 hex colors, type roles, layout concept with ASCII wireframes). Review it against the banned list above. Revise anything generic and say what you changed.
4. Build the signature moment above (stages 1–4) as one direction, done properly, before any other page.
5. Record a short scroll video at 1440px plus screenshots at 390px with Playwright. Compare them side by side with the reference sites and fix whatever looks cheaper. Then show the owner.
6. Once the owner approves the hero, build the rest of the page and the pages listed above.
7. Verify every page:
   - Playwright screenshots at 390 and 1440
   - a Chrome DevTools performance trace (LCP ≤ 2.0s throttled, CLS ≤ 0.05, INP ≤ 200ms)
   - an axe scan with zero violations
   - keyboard-only pass, reduced-motion pass, contrast ≥ 4.5:1
8. Use Context7 for current Three.js/GSAP APIs. Don't write library code from memory. If its tools aren't loaded in the session, query its MCP server directly.

### Order of work (2026-11-13 brief)
1. Update this file, commit and push.
2. Globe change (grid plus coastlines), screenshots, before/after sheet, owner review.
3. Palette A/B side by side, owner picks.
4. Pages and copy for all three pillars, the checkup and bundles (prices hidden), then full verification.
Commit and push after each step and report the hash. Stop for owner review after steps 2 and 3.

## Technical defaults
- Static HTML/CSS/JS with a small build step. No framework unless there's a reason. Self-host fonts and subset them (≤ 120 KB total).
- The globe must earn its place: real data, centered on Ann Arbor, three.js with DPR capped, paused off-screen, and a static image fallback for reduced motion or no WebGL. Old site used three r128 from cdnjs. Don't reuse that.
- Forms: Web3Forms free plan (250 submissions/month) for the checkup, the contact form and the waitlist. The access key is public by design.
- Hosting: the site is currently on Vercel. Hobby is non-commercial only, so check the plan before launch. The alternative is Cloudflare Pages.
- The bare domain atlasleadco.com has no A record today. Fix the apex → www redirect at launch.
- Schema: ProfessionalService with areaServed Ann Arbor and Saline. No street address and no reviews markup.

## Reference
- Research report (audit, references, sources): https://claude.ai/artifact/NmFsUQXBRWzfTKJhn1ECS7
- Rejected brief and prototypes: https://claude.ai/artifact/Qhg6kfVoujBMvyNK8U4kDk. These show what NOT to repeat.
- Reference board: https://claude.ai/artifact/LeyhAkSYBD5w3W522FE1zp
- Owner brief 2026-11-13: `tasks/SITE_SCOPE_2026-11-13.md` (local only)
