// WCAG contrast for the palette test. Usage: node build/contrast.mjs
const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

export const themes = {
  A: {
    ground: '#241711', ground2: '#3A261C', text: '#F2EADB', text2: '#D8CEBC', text3: '#B7AB98', gold: '#C7A348', goldHi: '#EBCB7C', secondary: '#7FB3AA',
    paper: '#F4F2EF', ink: '#2A1C14', ink2: '#4A3C32', mute: '#65574B', accentDark: '#2A6760', btnInk: '#241711', btnInkText: '#F2EADB',
  },
  B: {
    ground: '#101C2B', ground2: '#1B2B40', text: '#F3EBDD', text2: '#D5DAE1', text3: '#A9B6C5', gold: '#C7A348', goldHi: '#E6CB86', secondary: '#8FB4CC',
    paper: '#F1F4F7', ink: '#14202E', ink2: '#3A4A5C', mute: '#566577', accentDark: '#1B6670', btnInk: '#101C2B', btnInkText: '#F3EBDD',
  },
};
const pairs = (t) => [
  ['headline and body on ground', t.text, t.ground, 4.5],
  ['secondary text on ground', t.text2, t.ground, 4.5],
  ['muted text on ground (captions, credits)', t.text3, t.ground, 4.5],
  ['text on ground-2 panels', t.text, t.ground2, 4.5],
  ['muted text on ground-2 panels', t.text3, t.ground2, 4.5],
  ['gold links or marks on ground', t.gold, t.ground, 3],
  ['bright gold on ground', t.goldHi, t.ground, 4.5],
  ['secondary color on ground (links, river)', t.secondary, t.ground, 4.5],
  ['button label on gold button', t.ground, t.gold, 4.5],
  ['ink text on paper', t.ink, t.paper, 4.5],
  ['secondary ink on paper', t.ink2, t.paper, 4.5],
  ['muted ink on paper (waitlist labels)', t.mute, t.paper, 4.5],
  ['accent text on paper (Available now)', t.accentDark, t.paper, 4.5],
  ['button label on ink button', t.btnInkText, t.btnInk, 4.5],
  ['ink button against paper (non-text, 3:1)', t.btnInk, t.paper, 3],
  ['logo white lettering on ground', '#FFFFFF', t.ground, 4.5],
  ['logo gold figure on ground (graphic, 3:1)', '#C7A348', t.ground, 3],
];
if (process.argv[1].endsWith('contrast.mjs')) {
  for (const [k, t] of Object.entries(themes)) {
    console.log(`\n== Palette ${k}`);
    let bad = 0;
    for (const [name, fg, bg, min] of pairs(t)) { const r = ratio(fg, bg); if (r < min) bad++; console.log(`${r >= min ? 'ok  ' : 'FAIL'} ${r.toFixed(2).padStart(5)}:1 (needs ${min})  ${name}  ${fg} on ${bg}`); }
    console.log(bad ? `${bad} failing` : 'all pairs pass');
  }
}
