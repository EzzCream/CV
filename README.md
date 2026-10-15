# Oscar Antonio Rodríguez Carmona | Portafolio

Sitio personal en [ezzcream.space](https://ezzcream.space): Next.js 16 (App Router), React 19 y TypeScript, en español (`/es`) e inglés (`/en`). Incluye un formulario de contacto que envía correo con Resend.

## Correr en local

```sh
npm install
cp .env.example .env.local   # opcional: sin RESEND_API_KEY el envío se simula
npm run dev
```

## Scripts

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Build de producción (valida los JSON de contenido) |
| `npm run check` | Lint, tipos, pruebas unitarias y Knip |
| `npm test` | Pruebas unitarias (Vitest) |
| `npm run test:e2e` | Pruebas de punta a punta y accesibilidad (Playwright + axe) en escritorio y móvil |
| `npm run cv:pdf` | Regenera `public/cv/*.pdf` desde `/es/cv` y `/en/cv` (con el sitio corriendo y Google Chrome instalado) |

## Dónde está cada cosa

- `content/`: todos los textos. `profile.json` guarda los datos que no se traducen y `es.json`/`en.json` los textos. `schema.ts` valida ambos con Zod al compilar.
- `app/[locale]/`: layout (fuentes, metadatos, JSON-LD), página y 404.
- `app/api/contact/route.ts`: endpoint del formulario. Comprueba el Origin, limita el cuerpo a 10 KB, valida con Zod, filtra bots (honeypot y tiempo mínimo), admite Turnstile opcional, limita a 5 envíos por IP por hora y envía con Resend.
- `app/[locale]/cv/`: versión imprimible del CV; de ahí salen los PDFs. El teléfono solo aparece en el PDF.
- `components/trail/`: el rastro de código del hero y del cursor (canvas).
- `proxy.ts`: redirige `/` al idioma del navegador.
- `specs/`: requerimientos, decisiones de diseño y la guía de anti-patrones de IA.

## Variables de entorno

Ver `.env.example`. En producción son obligatorias `RESEND_API_KEY`, `CONTACT_TO` y `CONTACT_FROM`. El dominio de `CONTACT_FROM` debe estar verificado en Resend. Upstash (límite de envíos compartido) y Turnstile son opcionales.
