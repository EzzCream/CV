import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('idiomas y rutas', () => {
  test('la raíz redirige según el idioma del navegador', async ({ request }) => {
    for (const [lang, path] of [['en-US,en;q=0.9', '/en'], ['es-MX,es;q=0.9', '/es'], ['fr-FR', '/es']] as const) {
      const res = await request.get('/', { headers: { 'Accept-Language': lang }, maxRedirects: 0 });
      expect(res.status(), lang).toBe(307);
      expect(new URL(res.headers().location ?? '', 'http://x').pathname, lang).toBe(path);
    }
  });

  test('una ruta inexistente responde 404', async ({ page }) => {
    const res = await page.goto('/es/no-existe');
    expect(res?.status()).toBe(404);
    await expect(page.getByRole('heading', { name: 'Esta página no existe' })).toBeVisible();
  });
});

test.describe('página principal', () => {
  test('muestra el nombre, las secciones y el CV del idioma activo', async ({ page }) => {
    await page.goto('/es');
    await expect(page.locator('h1')).toContainText('Oscar');
    for (const id of ['sobre-mi', 'experiencia', 'proyectos', 'habilidades', 'contacto']) await expect(page.locator(`#${id}`)).toHaveCount(1);
    const cv = page.getByRole('link', { name: 'Descargar CV (PDF)' });
    await expect(cv).toHaveAttribute('href', '/cv/Oscar-Rodriguez-Carmona-CV-ES.pdf');
    await expect(cv).toHaveAttribute('download', 'Oscar-Rodriguez-Carmona-CV-ES.pdf');

    await page.goto('/en');
    await expect(page.getByRole('link', { name: 'Download CV (PDF)' })).toHaveAttribute('href', '/cv/Oscar-Rodriguez-Carmona-CV-EN.pdf');
  });

  test('los PDFs existen y se sirven como descarga', async ({ request }) => {
    for (const lang of ['ES', 'EN']) {
      const res = await request.get(`/cv/Oscar-Rodriguez-Carmona-CV-${lang}.pdf`);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type']).toBe('application/pdf');
      expect(res.headers()['content-disposition']).toBe('attachment');
    }
  });

  test('no hay scroll horizontal', async ({ page }) => {
    await page.goto('/es');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflow).toBe(false);
  });

  test('el texto visible solo usa caracteres de teclado', async ({ page }) => {
    for (const path of ['/es', '/en', '/es/cv', '/en/cv']) {
      await page.goto(path);
      const text = await page.locator('body').innerText();
      expect(text.match(/[^\x00-\x7FáéíóúüñÁÉÍÓÚÜÑ¿¡]/g), path).toBeNull();
    }
  });
});

test.describe('navegación', () => {
  test('el cambio de idioma conserva la sección', async ({ page, isMobile }) => {
    test.skip(isMobile, 'en móvil el enlace vive en el menú');
    await page.goto('/es');
    await page.evaluate(() => document.getElementById('proyectos')?.scrollIntoView({ behavior: 'instant' }));
    const lang = page.locator('.tools.desk a');
    await expect(lang).toHaveAttribute('href', '/en#projects');
    await lang.click();
    await expect(page).toHaveURL(/\/en#projects$/);
  });

  test('el menú móvil abre, recibe el foco y cierra con Escape', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'solo móvil');
    await page.goto('/es');
    const menu = page.getByRole('button', { name: 'Abrir menú' });
    await menu.click();
    await expect(page.locator('#sheet')).toBeVisible();
    await expect(page.locator('#sheet a').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(page.locator('#sheet')).toBeHidden();
    await expect(menu).toBeFocused();
  });

  test('el tema elegido se guarda', async ({ page, isMobile }) => {
    test.skip(isMobile, 'el botón de tema de escritorio');
    await page.emulateMedia({ colorScheme: 'light' });
    await page.goto('/es');
    await page.getByRole('button', { name: 'Tema oscuro' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });
});

test.describe('formulario de contacto', () => {
  test('valida los campos antes de enviar', async ({ page }) => {
    await page.goto('/es#contacto');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.locator('#e-name')).toHaveText('Este campo es obligatorio.');
    await expect(page.locator('#f-name')).toBeFocused();
    await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true');
  });

  test('muestra la confirmación cuando el envío sale bien', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ json: { ok: true } }));
    await page.goto('/es#contacto');
    await page.locator('#f-name').fill('Ana López');
    await page.locator('#f-email').fill('ana@example.com');
    await page.locator('#f-msg').fill('Hola Oscar, tenemos una vacante que te puede interesar.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.getByRole('status').filter({ hasText: 'Te contesto a ana@example.com' })).toBeVisible();
  });

  test('muestra el aviso de límite cuando el servidor responde 429', async ({ page }) => {
    await page.route('**/api/contact', (route) => route.fulfill({ status: 429, json: { ok: false, error: 'rate' } }));
    await page.goto('/es#contacto');
    await page.locator('#f-name').fill('Ana López');
    await page.locator('#f-email').fill('ana@example.com');
    await page.locator('#f-msg').fill('Hola Oscar, tenemos una vacante que te puede interesar.');
    await page.getByRole('button', { name: 'Enviar mensaje' }).click();
    await expect(page.locator('.fstatus[role="status"]')).not.toBeEmpty();
  });

  test('el endpoint rechaza otro origen y datos inválidos', async ({ request }) => {
    const bad = await request.post('/api/contact', { headers: { Origin: 'https://otro.example' }, data: {} });
    expect(bad.status()).toBe(403);
    const invalid = await request.post('/api/contact', { headers: { Origin: 'http://localhost:3100' }, data: { name: 'A', email: 'x', reason: 'job', message: 'corto', startedAt: 1 } });
    expect(invalid.status()).toBe(400);
    expect((await invalid.json()).fields).toEqual({ name: 'nameLength', email: 'email', message: 'messageShort' });
  });
});

test.describe('accesibilidad', () => {
  for (const path of ['/es', '/en', '/es/cv']) {
    test(`sin fallas graves de axe en ${path}`, async ({ page }) => {
      test.slow();
      await page.goto(path);
      // el contraste se mide con el texto ya visible, no a mitad de la animación de entrada
      await page.waitForFunction(() => document.getAnimations().every((a) => a.playState === 'finished' || a.effect?.getTiming().iterations === Infinity));
      const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
      const serious = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      expect(serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }

  test('con movimiento reducido no hay animaciones de entrada', async ({ browser, baseURL }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', baseURL });
    const page = await ctx.newPage();
    await page.goto('/es');
    expect(await page.locator('h1').evaluate((el) => getComputedStyle(el).animationName)).toBe('none');
    await ctx.close();
  });
});
