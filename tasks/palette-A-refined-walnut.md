# Palette A: refined walnut

Intent: keep the warm, local feel and the logo's gold, but spend gold only where it means something. Gold is the logo, the one button and the key highlights (the two town markers and the Great Lakes line at the Michigan stage). Everything else is ivory, walnut and patina.

Switch to it with `?theme=a` (it is the default).

## Tokens
| Token | Hex | Role |
|---|---|---|
| Walnut | #241711 | ground of the hero and footer, button label on gold |
| Ember | #3A261C | map fill, panels |
| Ivory | #F2EADB | headline and body text |
| Gold | #C7A348 | the logo, the button, town markers (the logo's own gold) |
| Bright gold | #EBCB7C | the Great Lakes line at full strength, lit towns |
| Patina | #7FB3AA | secondary: river, dot grid on the county map, secondary marks |
| Paper | #F4F2EF | light sections below the hero |
| Walnut ink | #2A1C14 | text on paper, ink button |
| Paper accent | #2A6760 | "Available now" labels and links on paper |

Type roles (shared with B): Schibsted Grotesk 400 for the hero headline, 600 for other headings, 400 for body. Inter only inside the laptop illustration.

## What changed from the current look
- Globe grid and coastlines moved from gold to ivory (grid 0.12 opacity, coast 0.5). Gold appears on the globe only when the Great Lakes line is picked out.
- County map dot grid moved from gold to patina. Roads stay ivory, the river is patina, the towns are gold.
- Light paper sections for services, process and pricing, with an ink (walnut) button on paper.

## Contrast (computed by `node build/contrast.mjs`)
| Pair | Ratio | Needs |
|---|---|---|
| Ivory on walnut (headline, body) | 14.57 | 4.5 |
| Secondary text on walnut | 11.18 | 4.5 |
| Muted text on walnut (captions, credits) | 7.71 | 4.5 |
| Ivory on ember | 11.92 | 4.5 |
| Muted text on ember | 6.30 | 4.5 |
| Gold on walnut | 7.27 | 3 |
| Bright gold on walnut | 11.09 | 4.5 |
| Patina on walnut | 7.41 | 4.5 |
| Walnut label on gold button | 7.27 | 4.5 |
| Walnut ink on paper | 14.74 | 4.5 |
| Secondary ink on paper | 9.47 | 4.5 |
| Muted ink on paper (waitlist labels) | 6.23 | 4.5 |
| Paper accent on paper | 5.86 | 4.5 |
| Ivory on ink button | 14.57 | 4.5 |
| Ink button against paper (non-text) | 15.59 | 3 |
Every pair passes.

## The logo on this ground
White lettering on walnut is 17.42:1, and the gold figure on walnut is 7.27:1. In the enlarged crop on the sheet both read cleanly. Over the paper section the header takes the walnut ground so the lettering stays visible.

## Banned-list review
- Near-black plus one gold accent: not the case. The ground is a warm walnut, the secondary is patina, the sections below are light paper, and gold is rationed rather than the only color.
- Brown and gold leaning "luxury or law firm": reduced by taking gold off the globe and map and putting it only on marks. Judge this on the sheet.
- No pills, arrows, eyebrow labels, numbering, gradients or identical cards. The three pillars are plain columns.
- Warm paper is a cool-leaning off-white (#F4F2EF), not a cream.
