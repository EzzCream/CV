// Genera la banda del correo de confirmación como PNG (public/email/trail.png).
// Antes era texto: cientos de caracteres aleatorios en spans de bajo contraste, que los filtros
// de Gmail leen como texto basura u oculto. Como imagen se ve igual y no cuenta como contenido.
// Uso: npm run email:assets (requiere Google Chrome instalado).
import { chromium } from '@playwright/test';

const COLS = 54, ROWS = 9, W = 600, H = 214;
const GLYPHS = '{}[]()<>/=+-*;:._|&%$#@!?0123456789ABCDEFabcdefx';
const C = { paper: '#E5E7E6', ink: '#0C0E10', red: '#B5121B' };

let seed = 7;
const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
const blobs = [
  { x: 0.7, y: 0.5, r: 0.42, a: 1.2 },
  { x: 0.36, y: 0.3, r: 0.24, a: 0.8 },
  { x: 0.92, y: 0.8, r: 0.2, a: 0.7 },
  { x: 0.12, y: 0.75, r: 0.16, a: 0.5 },
];
const esc = (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c] ?? c;
const rows = [];
for (let j = 0; j < ROWS; j++) {
  let row = '';
  for (let i = 0; i < COLS; i++) {
    const x = i / (COLS - 1), y = j / (ROWS - 1);
    let v = 0;
    for (const b of blobs) v += b.a * Math.max(0, 1 - Math.hypot((x - b.x) * 1.6, y - b.y) / b.r);
    v *= 0.75 + rand() * 0.5;
    const ch = esc(GLYPHS[Math.floor(rand() * GLYPHS.length)]);
    const red = Math.abs(i - Math.round(COLS * 0.72)) <= 1 && j === Math.round(ROWS / 2);
    if (red) row += `<b style="background:${C.red};color:#fff">${ch}</b>`;
    else if (v > 0.55) row += `<b style="background:${C.paper};color:${C.ink}">${ch}</b>`;
    else if (v > 0.32) row += `<b style="color:#9AA19F">${ch}</b>`;
    else if (v > 0.1) row += `<b style="color:#4F5559">${ch}</b>`;
    else row += `<b style="color:#2B3034">${ch}</b>`;
  }
  rows.push(row);
}

const html = `<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@600&display=block" rel="stylesheet">
<style>html,body{margin:0;background:${C.ink}}
.band{width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:center;font:600 13px/18px 'JetBrains Mono',monospace;white-space:pre;font-variant-ligatures:none;font-feature-settings:'liga' 0,'calt' 0}
b{font-weight:600}</style></head>
<body><div class="band"><div>${rows.join('<br>')}</div></div></body></html>`;

const browser = await chromium.launch(process.env.CV_BROWSER === 'chromium' ? {} : { channel: 'chrome' });
try {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.locator('.band').screenshot({ path: new URL('../public/email/trail.png', import.meta.url).pathname });
  console.log('OK /email/trail.png');
} finally {
  await browser.close();
}
