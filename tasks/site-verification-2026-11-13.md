# Site verification, 2026-11-13 (CLAUDE.md step 7)

Run against `site/` served locally, built from commit `ad8c335`.

| Check | Result |
|---|---|
| axe (wcag2a, 2aa, 21a, 21aa, 22aa, best-practice) | Zero violations on all 10 pages (home, /ai, /security, /websites, /checkup, /how-it-works, /plans, /about, /contact, /privacy) at 390 and 1440. One real violation was found and fixed first: ivory text on the gold button inside the dark bundle panel. The home page was scanned at its hero state, not mid-scroll. |
| Console errors | None after adding an empty favicon declaration |
| Horizontal overflow | None on any page at 390 or 1440 |
| LCP (home, 390px, 4x CPU, fast 4G, cold cache, DevTools trace) | 707 ms. Target 2.0 s. The LCP element is the h1 headline. |
| CLS (same trace) | 0.00. Target 0.05. |
| INP | Not read from a DevTools trace. Measured with the Event Timing API under 4x CPU throttle through taps, keys and 25 wheel steps of the scroll sequence: slowest of 550 events 64 ms. Target 200 ms. |
| Keyboard-only | Home (10 stops) and /contact (14 stops): logical order, a visible outline of at least 2 px on every stop, every stop in view |
| Reduced motion | Home switches to four static frames, the globe and Lenis are off, the typed emails are complete, zero running animations |
| Text contrast | All token pairs pass (see `tasks/palette-B-deep-ink.md`, computed by `node build/contrast.mjs`). axe color-contrast passes on every page. Text drawn over the globe canvas cannot be measured by axe. |
| Form logic (stubbed Web3Forms) | Success shows only for a confirmed `success: true`. A 400, a 200 with `success: false` and a dropped connection all show an error with the fallback email. An unconfigured form is disabled and says it is not connected. |

## Not verified
- A real Web3Forms submission: no access key yet, so nothing was delivered to a real inbox.
- Performance traces of the inner pages and of the 1440 layout. Inner pages are static HTML and CSS with no 3D.
- The no-WebGL path by itself (it shares the reduced-motion code path, which was checked).
- Mid-scroll accessibility of the home sequence (stages 2 to 4).
- A pass with a real screen reader.

## Needs the owner
- Web3Forms access key (public by design) and a contact email, both for `site/config.js`
- Web3Forms key and contact email: the owner is setting these up. Paste both into `site/config.js`.
- Decided 2026-11-13: the privacy page states that Atlas does not sell information; no credential line about who runs Atlas; the site is a business card, so launch is low-stakes
- Not yet done, on the owner's word to launch: the live root `index.html` is still the old page. Switching the host to serve `site/`, the Vercel Hobby terms question and the apex to www redirect
- Prices stay hidden (SHOW_PRICES is false)
