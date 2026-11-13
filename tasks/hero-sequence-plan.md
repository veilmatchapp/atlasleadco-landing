# Signature moment: token plan and banned-list review

Scope: stages 1 to 4 only (globe, dive to Michigan, Washtenaw County, laptop). No other sections or pages yet.
Techniques: Three.js physical gold material with environment light (globe), GSAP ScrollTrigger scrub (choreography), Lenis (smooth scroll).
APIs were checked with Context7 this session (three.js, gsap, lenis) before any library code was written.

## Why this is not the rejected rounds
- Round 1 and 2 were CSS boxes and literal metaphors (form, stamp, signs). Here the media is a rendered 3D globe and real geography. The only CSS-drawn artifact is the laptop screen, and it is a working screen showing text being typed, not a picture of a thing.
- The globe, the map and the laptop are one continuous camera move. Nothing is stamped on every section.

## Tokens
| Token | Hex | Role |
|---|---|---|
| Walnut | #241711 | page ground, warm deep-dark (brief asks for warm deep-dark) |
| Ember | #3A261C | globe body, laptop bezel surround, map fill |
| Gold | #C7A348 | the logo's gold: dots, graticule, button, town markers |
| Bright gold | #EBCB7C | lit dots and the two towns when they light up |
| Ivory | #F2EADB | headline and body text |
| Patina | #6FA39B | the Huron River and the only cool note on the dark stages |
| Screen paper | #F6F5F2 | laptop UI surface (the one light surface on the page) |

Type: Schibsted Grotesk 600 for headlines (tight tracking, huge, low-left), 400 for body. Inter 400/600 only inside the laptop UI, because that is what office software looks like. Total fonts well under 120 KB.

## Layout concept
```
1440 stage 1                     stage 3                         stage 4
+------------------------+       +------------------------+      +------------------------+
| logo              nav  |       | logo              nav  |      | logo              nav  |
|              .-----.   |       |                  _____ |      |        +-------------+ |
|            .' gold  '. |       |                 / AA* \|      |        | laptop      | |
|            | globe   | |       |   (map, real    |  Sal*| |      |  text  | typing UI   | |
| Get AI     '.       .' |       |    Census line) \______/|      |  low-  +-------------+ |
| working in  '-.___.-'  |       | The tools are global.   |      |  left  =====lip=====   |
| your office. [Book]    |       | Setting them up ...     |      | caption (illustration) |
+------------------------+       +------------------------+      +------------------------+
390: same order, visual on top half, text low, laptop screen without the base
```
Alignment: all text left aligned, low on the stage. The visual object sits right of center on desktop and above the text on phones.

## Choreography (one scroll, 640vh desktop, 520vh phone)
| Progress | What moves |
|---|---|
| 0 to 0.07 | globe turns slowly on its own, headline holds |
| 0.07 to 0.40 | headline lifts away; globe turns Ann Arbor to the front; camera pushes in |
| 0.30 to 0.50 | the coarse global dots shrink away as dense Michigan dots and the Great Lakes coastline dots grow in |
| 0.50 to 0.68 | WebGL fades as the Census county outline draws in from the same screen point; Ann Arbor and Saline light up; the line appears |
| 0.76 to 0.92 | the map dissolves toward the Ann Arbor dot while the laptop screen grows out of that same point |
| 0.90 on | the assistant types the renewal letter, then the follow-up (time based, so it is readable at any scroll speed) |

## Review against the banned list, and what I changed
- Near-black plus one gold accent: the brief requires warm deep-dark and a gold globe, so the ground is a warm walnut rather than black, and the page carries a cool patina note, a light laptop surface and a lit map, so gold is not the only thing going on. Changed: first thought was #14100D (reads as black); moved to #241711.
- Pill buttons and arrows: the single "Book a call" is a squared gold button with no arrow.
- ALL-CAPS eyebrows, mono micro-labels, middle dots, numbered markers: none. Map labels are sentence case.
- One styled word in a headline: none. Changed: I considered setting "local" in gold in the stage 3 line, and cut it.
- Same fade-and-slide on every section: each stage has its own motion (dive, draw-in, grow-from-a-point, typing). There is no repeated reveal.
- Literal CSS metaphor: the laptop is a screen with a thin bezel and a metal lip, no keyboard, no drawn desk. Changed: dropped a full CSS laptop body.
- Centered hero: headline is low-left, globe right.
- Copy: no em dashes, "Ready to", "unlock", "seamless", "leverage", "elevate". Headline is a full sentence.
- Hard rules: the laptop is labeled as an illustration, names are made up (example.com addresses, a made-up property manager), no Microsoft logos or screenshots, no stats, no prices.

## Fallbacks
- Reduced motion or no WebGL: four stacked still frames (globe, Michigan, county, laptop with the text already typed). Lenis stays off.
- The headline is HTML text and stays the LCP element. The three.js chunk loads after the page is painted.
- DPR capped at 2 (1.5 on phones). The render loop pauses when the stage is off screen or the globe is faded out.

## Data and credits
- Land: Natural Earth (public domain). Lakes: Natural Earth. County outline: US Census TIGERweb (public domain). Roads and river: OpenStreetMap contributors (credit shown on the map frame).

## Changes made while building and critiquing screenshots
- Dots were unit-sized blobs: my shader patch targeted the expanded chunk, but at compile time the shader still holds `#include <begin_vertex>`. Patched the include.
- Body looked like silver glass with a purple rim. Made the body dark lacquer, the key and rim light warm, and gave each material its own environment map (a scene-level environment ignores per-material intensity in this three.js version).
- Coarse dots ballooned to 40px beads on the dive. They now keep a steady screen size as the camera closes in, so they read as sparse specks while the Great Lakes coastline grows in.
- The dense Michigan patch had hard rectangular edges. Dot size now falls off with distance from Ann Arbor.
- The county outline appeared at a scale that didn't match the lakes behind it. The camera now zooms to county scale (about 50 km across) before the SVG takes over, and the Huron River from OpenStreetMap lands on the Lake Erie shore the globe draws.
- The Census polygon had counter-clockwise rings, which d3 reads as the whole globe minus the county. Reversed the rings. Ann Arbor now sits at 65% across the county, matching its real longitude.
- Timeline was 5 long instead of 1 because a stagger over about 100 road and river paths added to its duration. Fixed to a fixed total and padded to exactly 1.
- The tan haze at close range was the key light on the lacquer. Gloss and key light now fade as the camera dives.
- Phones: dropped the second prompt and status lines, lowered the map below the header, shrank the stage 4 line so the window and headline do not overlap.
- Stills for reduced motion and no WebGL are captured from the live globe (84 KB and 20 KB).
