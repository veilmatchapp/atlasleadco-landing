# Atlas build: current state

## Signature moment, stages 1 to 4 (hero/)
- [x] Read CLAUDE.md and the reference board
- [x] Context7 used for three.js, GSAP and Lenis APIs (queried over stdio, the MCP tools were not loaded in the session)
- [x] Token plan reviewed against the banned list (tasks/hero-sequence-plan.md)
- [x] Build: gold 3D globe, dive to Michigan, Census county map, laptop screen with typed emails
- [x] Screenshots at 390 and 1440, critique, fixes
- [x] Scroll video at 1440 (hero/video/scroll-1440.webm)
- [ ] Owner approves the hero

## 2026-11-13 brief (tasks/SITE_SCOPE_2026-11-13.md, local only)
- [x] 1. CLAUDE.md rewritten for three pillars, committed and pushed (eee373f)
- [x] 2. Globe change: grid and thin coastlines, before/after sheet, stills and video regenerated
- [ ] 2. Owner reviews the globe
- [x] 3. Palette A vs B built side by side (?theme=a or ?theme=b), token plans in tasks/palette-*.md
- [ ] 3. Owner picks a palette
- [x] 4a. Site structure: hero/ promoted to site/ (new site root; the repo-root index.html is still the old live page), shared tokens and shell, content catalog in build/site-content.mjs (labels single-sourced, firewall on the waitlist)
- [x] 4b. Pages built: home (three-pillar hero, services, process, bundle, close), /ai, /security, /websites, /checkup, /how-it-works, /plans, /about, /contact, /privacy
- [x] 4c. axe: zero violations on all 10 pages at 390 and 1440 (home scanned at its hero state only)
- [ ] 4d. Still open: DevTools performance trace (LCP, CLS, INP), keyboard-only pass, reduced-motion pass, real form test
- [ ] Needs the owner: Web3Forms access key, contact email for the fallback, privacy page review, credential line yes or no, launch plan (root index.html swap, Vercel plan, apex redirect)

## Not started, waiting on approval
- Calm sections (services, 4-step process, about, contact) and the other pages
- Step 7 verification per CLAUDE.md (performance trace, axe, keyboard, contrast)
- Hosting plan, apex redirect, Web3Forms form
