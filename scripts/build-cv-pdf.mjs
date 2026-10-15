// Genera los PDFs del CV (ES y EN) desde la ruta imprimible /[locale]/cv (FUN-13).
// Uso: con el sitio corriendo (npm run dev o npm start), `npm run cv:pdf [url-base]`.
// Usa el Google Chrome instalado; con CV_BROWSER=chromium usa el Chromium de Playwright.
import { readFile } from 'node:fs/promises';
import { chromium } from '@playwright/test';

const base = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '');
const profile = JSON.parse(await readFile(new URL('../content/profile.json', import.meta.url), 'utf8'));

try {
  await fetch(`${base}/es/cv`, { method: 'HEAD' });
} catch {
  console.error(`No hay servidor en ${base}. Corre "npm run dev" o "npm start" en otra terminal.`);
  process.exit(1);
}

const browser = await chromium.launch(process.env.CV_BROWSER === 'chromium' ? {} : { channel: 'chrome' });
try {
  for (const locale of ['es', 'en']) {
    const page = await browser.newPage();
    const res = await page.goto(`${base}/${locale}/cv`, { waitUntil: 'networkidle' });
    if (!res?.ok()) throw new Error(`/${locale}/cv respondió ${res?.status()}`);
    await page.evaluate(() => document.fonts.ready);
    const out = new URL(`../public${profile.cv[locale]}`, import.meta.url);
    // tagged: estructura accesible (encabezados, listas) para lectores ATS y de pantalla
    await page.pdf({ path: out.pathname, preferCSSPageSize: true, printBackground: true, tagged: true });
    console.log(`OK ${profile.cv[locale]}`);
    await page.close();
  }
} finally {
  await browser.close();
}
