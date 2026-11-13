# Hero directions: token plan and banned-list review

Logo fact that shapes everything: `atlas-logo.png` is transparent with a gold figure and globe and **white** lettering. The wordmark only reads on a dark surface, so every direction puts the logo on a dark panel or a dark ground. It is never recolored or cropped.

Shared copy rules: no dollar amounts, "fixed price" and "book a call", no founder name, no "our clients" or "our team", no em dashes, service area Ann Arbor and Saline only. Phone numbers in illustrations use the reserved fictional 555-01xx range.

---

## A. Work order (light, a form as the hero)

Subject: property management and insurance offices live on paper forms: work orders, applications, carbon-copy pads. The hero is the offer written as a work order, so the buyer reads exactly what they get.

| Token | Value | Role |
|---|---|---|
| Paper | #F2F3EF | page ground, cool grey-green, not cream |
| Ink | #1C2733 | body text and the header bar that carries the logo |
| Carbon blue | #234E8F | typed entries, links, the one button |
| Pink copy | #F0B9B6 | second sheet peeking under the form |
| Canary copy | #F2DE8C | third sheet |
| Stamp red | #B3261E | one rubber stamp |

Type: Libre Franklin 700 headline and 400 body (American office-form gothic). Courier Prime 400 only for text "typed" into the form fields.

Layout (left aligned):

```
1440
+--------------------------------------------------------------+
| [ink bar] logo                       How it works About Contact|
+--------------------------------------------------------------+
| H1 (5 cols)                       |  [canary]                 |
| sub                               |  [pink]                   |
| [Book a call]                     |  [WORK ORDER, tilted -1.5]|
|                                   |   fields, checkboxes,     |
|                                   |   stamp "Fixed price"     |
+--------------------------------------------------------------+
390: bar / H1 / sub / button / work order full width, sheets peek 8px
```

Review against the banned list, and what I changed:
- Hairline rules: the form needs fill-in lines, but I kept them inside the form only and gave the page itself none. Changed: no rule between header and hero.
- Stamp reads like an all-caps label. Changed: stamp text is sentence case ("Fixed price").
- First idea was a handwriting font for entries. That is a common generated-page tell. Changed to typed Courier Prime.
- First idea was a missed-call message slip. That illustrates offer 2, but offer 1 has priority. Changed to a sprint work order.
- Cards: only sheets, each a different color and offset, one soft shadow on the top sheet only.
- Motion: one moment, the stamp lands once on load. Nothing else moves. Disabled under reduced motion.
- No numbering (checkboxes and dashes, not 01/02/03), no arrows, no pills, no gradients.

---

## B. Gantry (light, Michigan highway guide signs)

Subject: everyone in Washtenaw County has driven under an I-94 or US-23 overhead sign. Three overhead panels are the three services, sized by priority. Sign color conventions carry meaning: green for guide, blue for services.

| Token | Value | Role |
|---|---|---|
| Concrete | #DCE1E0 | page ground |
| Guide green | #0B6B47 | the three service panels and the logo panel |
| Service blue | #0F5C9A | the single service-area sign |
| Sign white | #FFFFFF | sign borders and legend |
| Steel | #5B6769 | gantry beam and posts |
| Text | #1B2326 | body on concrete |

Type: Overpass 800 for legends and the headline, Overpass 400 for body. One family, based on Highway Gothic.

Layout (left aligned headline, gantry full width):

```
1440
| [green panel: logo]                  How it works About Contact |
| H1 (left, 7 cols)                                              |
| sub, [white regulatory-style "Book a call" sign]               |
|======= steel beam =============================================|
|  [ AI implementation sprint ]  [ AI receptionist ] [ Websites ]|
|        wide (5/11)                 (3/11)             (3/11)   |
|                                          [blue: Ann Arbor, Saline]
390: beam, then the three panels stacked, then the blue sign
```

Review, and what I changed:
- A centered hero is banned. Gantries are symmetrical, so I kept the headline left aligned above it and let panel widths be unequal.
- Identical rounded cards: signs share a corner radius by convention, so I made width encode priority (sprint widest), gave panel 1 a taller legend, and kept zero shadows.
- First idea included a yellow "Missed calls ahead" warning diamond and a brown panel. Cut: too cute for skeptical owners, and extra colors weaken the one idea.
- Arrows: sign arrows are drawn as SVG sign artwork, never appended to link text.
- Motion: none. Focus rings are visible.
- Near-black or gold-only: not applicable. Light ground, gold appears only in the logo.

---

## C. Globe (petrol teal, real land, local zoom)

Subject: the logo is Atlas holding a globe. The real globe is centered on Ann Arbor, then one inset zooms to Washtenaw County with the two towns. The idea: the tools are the same worldwide, setting them up is local work.

| Token | Value | Role |
|---|---|---|
| Petrol | #0B4F5C | ground and logo surface |
| Deep water | #083D48 | globe ocean |
| Sand | #E3D8B8 | land and inset map |
| Vermilion | #F26B4F | Ann Arbor and Saline markers, the button |
| Chalk | #F4F1E8 | text on petrol |
| Graticule | rgba(244,241,232,.28) | globe lines |

Type: Libre Caslon Text 700 for headline, 400 for body, 400 italic only for water labels (a real map convention, not a headline accent).

Layout (left aligned text, oversized cropped globe):

```
1440
| logo (on petrol)                     How it works About Contact |
| H1 (6 cols)                          .--------------.          |
| sub                                .'   real land     '.       |
| [Book a call]    [inset: county   /   Ann Arbor *      \       |
|                   Ann Arbor/Saline]\                    /  <- cropped by viewport
390: text first, globe below cropped in half, inset overlaps its edge
```

Review, and what I changed:
- First plan was near-black navy ground with a gold graticule. That is exactly the rejected old site (#080810 plus #D4A853 plus a globe). Changed: petrol teal ground, sand land, a vermilion marker, and gold kept out of the page entirely so it is only the logo's.
- Old site used three r128 from cdnjs. Changed: no JavaScript at all. The globe is a static SVG generated at build time from Natural Earth land data, so reduced-motion and no-WebGL fallbacks are the default.
- Italic: only on the Huron River label.
- Motion: one moment, a leader line draws from the globe marker to the inset on load, off under reduced motion.
- No eyebrow labels, numbering, pills, gradients or glow.
- Honest map: inset shows real OpenStreetMap geometry (county boundary, I-94, US-23, Huron River) and carries the credit "Map data from OpenStreetMap contributors".

---

## Cross-cutting
- Placeholders: prototypes link to /contact and similar paths that do not exist yet.
- Fonts per direction: A 29 KB, B 16 KB, C 51 KB (limit 120 KB).
- Context7 not needed: no Three.js or GSAP in any direction.

---

## Changes made after screenshot critique

**A (work order)**
- Stamp covered the Price entry at both widths. Moved it into reserved space at the bottom of the form.
- Courier entries wrapped with orphaned words. Shortened every entry to fit one line.
- Nav wrapped at 390px. Added nowrap and a fluid logo width.
- Accessory removed: the canary sheet. The pink sheet alone carries the carbon-copy idea.

**B (gantry)**
- At 1440px the panels sat below the fold. Moved the intro text and button beside the headline.
- Equal-height panels left panel 3 half empty. Panels now size to their content, so heights step down with content weight.
- On narrow screens, brackets hung off the panel above. The signs now hang from one steel post.
- Moved the blue sign into the grid under panels 2 and 3 to close a dead gap.
- Accessory removed: the steel side posts.

**C (globe)**
- Inset caption was cut off by the hero edge, and labels collided. Repositioned the inset, fit its height to the county shape, moved the labels.
- The land layer has no Great Lakes, so the marker looked misplaced. Added Natural Earth lakes (public domain) cut out of the land.
- Globe SVG was 439 KB. Simplified coastline with topojson-simplify and rounded coordinates: 86 KB, page about 36 KB gzipped.
- Mobile had no marker and framed the Arctic. Marker now shares the globe's frame, and the globe is centered on Ann Arbor.
- Accessory removed: the "Huron River" italic label, which also removed the italic font (C fonts now 32 KB). Also cut the note under the button.
