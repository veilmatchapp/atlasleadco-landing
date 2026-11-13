# Atlas build: current state

## Process steps 2 to 5 (hero directions)
- [x] Open atlas-logo.png (gold figure and globe, white lettering, needs a dark ground)
- [x] Token plan for three directions, reviewed against the banned list (tasks/hero-plan.md)
- [x] Build A work order, B gantry, C globe in prototypes/
- [x] Screenshot each at 390px and 1440px (prototypes/screens/)
- [x] Critique screenshots, fix, remove one accessory from each
- [ ] Owner picks one direction

## Not started, waiting on the pick
- Pages: /ai-implementation, /ai-receptionist, /websites, /how-it-works, /about, /contact, /privacy
- Verification per CLAUDE.md step 7 (performance trace, axe, keyboard, reduced motion, contrast)
- Hosting plan check (Vercel Hobby is non-commercial), apex to www redirect, Web3Forms form

## Review
Prototypes are static HTML with no frameworks. Only C needs a build step (node build/build-c.mjs).
Old index.html is untouched.
