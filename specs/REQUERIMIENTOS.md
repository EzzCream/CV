# Requerimientos: portafolio de Oscar Rodríguez v2

| | |
| --- | --- |
| Estado | Aprobado con decisiones D1–D10 (14 oct 2026) |
| Fecha | 14 oct 2026 |
| Responsable | Oscar Antonio Rodríguez Carmona |
| Documentos relacionados | [ANTI-PATRONES-IA.md](ANTI-PATRONES-IA.md), auditoría del 14 oct 2026, `referencia-cv/` (local, no versionado) |

## 0. Cómo leer este documento

- Cada requerimiento tiene un ID (`FUN-03`, `A11Y-02`…) para poder citarlo en issues y PRs.
- Prioridad: **P0** obligatorio para lanzar · **P1** debe estar poco después del lanzamiento · **P2** deseable.
- Cada requerimiento tiene un criterio de aceptación verificable.
- Las decisiones de Oscar están en la [sección 14](#14-decisiones-tomadas).

---

## 1. Objetivo

Reconstruir el portafolio como una aplicación React con un backend mínimo para el formulario de contacto, con un rediseño completo, contenido verificado y sin rasgos de sitio generado por IA.

### 1.1 Qué tiene que conseguir

1. Que un reclutador entienda en menos de 30 segundos quién es Oscar, qué hace hoy y qué ha construido.
2. Que el contenido sea **una sola fuente de verdad**: la web y el PDF salen de los mismos datos y no se contradicen.
3. Que cualquiera pueda escribirle desde la página y el correo llegue.
4. Que el diseño y las animaciones sean memorables y propios, no una plantilla.
5. Que se corrijan todos los hallazgos de la auditoría (trazabilidad en la [sección 13](#13-trazabilidad-con-la-auditoría)).

### 1.2 Público

| Público | Qué busca | Qué necesita ver primero |
| --- | --- | --- |
| Reclutador (no técnico) | Encaje, años, nivel de inglés, contacto | Rol, empresa actual, fechas, botón de CV |
| Líder técnico / CTO | Profundidad real | Proyectos con stack, decisiones y resultados; GitHub |
| Cliente freelance | Que resuelva su problema | Proyectos lanzados, contacto rápido |

### 1.3 Fuera de alcance

- Blog o CMS.
- Panel de administración.
- Más idiomas que español e inglés.
- Autenticación de usuarios.

---

## 2. Reglas de contenido

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| CNT-01 | P0 | La fuente de verdad del contenido es `referencia-cv/cv.json` y `experiencia-detallada.md`. Ningún dato entra a la web si no está ahí o no lo confirma Oscar. | Cada puesto, fecha, skill y proyecto publicado se puede encontrar en la fuente. |
| CNT-02 | P0 | **Canwe y “Freelancer · Frontend Developer” no aparecen en la página.** No están en el CV (D5). | Búsqueda de “Canwe” y “Freelancer” en el contenido publicado: 0 resultados. |
| CNT-03 | P0 | Experiencia publicada: ArgusEye (Software Developer, nov 2025–actualidad), Rommaana / TrustMango (Full Stack Developer, feb 2025–sep 2026), Artifields (FullStack Developer, mar–oct 2024), Monific (Front-end Developer, nov 2023–feb 2024), Schneider Electric (Computer Science Intern, 2022–2023, 4 meses). | Coincide con `cv.json`. |
| CNT-04 | P0 | Todas las fechas en formato mes/año y orden cronológico inverso. Se guardan en ISO (`2025-11`) y se formatean por idioma con `Intl.DateTimeFormat`. | No hay duraciones sueltas (“10 meses”) sin fechas. |
| CNT-05 | P0 | Nivel de inglés: “Conversacional y técnico” con el detalle de `cv.json`. Nunca “Fluent” ni “B1”. | Igual en web ES, web EN y PDF. |
| CNT-06 | P0 | Nombre completo “Oscar Antonio Rodríguez Carmona” en título, hero, PDF y datos estructurados. El alias EzzCream solo en el enlace a GitHub. | Ningún logo o título usa solo “EzzCream”. |
| CNT-07 | P0 | Cada logro tiene al menos un número, un nombre propio o una herramienta concreta, y cumple [ANTI-PATRONES-IA.md](ANTI-PATRONES-IA.md) §1. | Checklist §5 de la guía en verde. |
| CNT-08 | P0 | No se publican nombres de repos internos, personas, clientes o detalles confidenciales (por ejemplo `arguseyeprod`, Talos, nombres de compañeros). | Revisión manual antes de lanzar. |
| CNT-09 | P0 | No se publican métricas internas de ArgusEye (commits, posición como contribuidor) ni capturas del producto (D6). Los logros se cuentan por lo construido y su stack. | Ninguna cifra interna ni captura de ArgusEye en el sitio. |
| CNT-10 | P0 | Sin cifras de relleno (“15+ proyectos”, “5+ tecnologías”). | No existe una fila de métricas genérica. |
| CNT-11 | P0 | Cada skill de la lista está respaldada por un puesto o proyecto, y la UI muestra dónde se usó. | Cada skill enlaza a al menos un puesto o proyecto. |
| CNT-12 | P0 | El inglés se escribe en inglés natural, no traducido frase a frase. | Revisión con la guía §1.3. |
| CNT-13 | P0 | El “Sobre mí” se escribe con la voz de Oscar (primera persona, frases cortas). Los tatuajes y los pines van en una o dos frases, sin justificarlos con el trabajo. | Pasa la prueba rápida de la guía §1.4. |
| CNT-14 | P0 | El teléfono no se muestra en la web (privacidad). Solo correo, LinkedIn, GitHub y formulario. | El número no aparece en el HTML. |
| CNT-15 | P0 | Educación: Maestría en Arquitectura de Software, UTEL, sep 2026 – en curso (D7); Lic. Ciencias de la Informática, UPIICSA–IPN, 2020–2024; Lic. Comunicación Digital, UTEL, 2023–2026, en trámite de titulación (D8). | Coincide en web y PDF. |
| CNT-16 | P0 | El año del footer se genera automáticamente. | Muestra el año actual en ambos idiomas. |

---

## 3. Arquitectura y stack

### 3.1 Opción recomendada

| Capa | Elección | Por qué |
| --- | --- | --- |
| Framework | **Next.js (App Router) con React y TypeScript estricto** | Genera HTML estático por idioma (SEO, Open Graph, sin parpadeo), y trae rutas de API para el backend del correo en el mismo proyecto. Oscar ya lo usa en ArgusEye. |
| Backend de correo | Route Handler `POST /api/contact` | Un solo despliegue, sin servidor que mantener. |
| Envío de correo | Resend | Plan gratuito suficiente, buena entregabilidad, SDK simple. Requiere verificar el dominio `ezzcream.space` (D2). |
| Hosting | Vercel | Despliegue de previews por PR, funciones serverless, imágenes optimizadas. |
| Animación | Motion (motion.dev, antes Framer Motion) + View Transitions API | Animaciones declarativas en React, `useReducedMotion`, transiciones de layout. |
| Estilos | Una hoja global (`app/globals.css`) + tokens en CSS custom properties | Control total del diseño; evita el look por defecto de Tailwind/shadcn (guía §2.1). Se usó una hoja global en lugar de CSS Modules porque el diseño es una sola página portada tal cual del prototipo aprobado. |
| Validación | Zod, compartido entre cliente y servidor | Un solo esquema para el formulario y para el contenido JSON. |
| Calidad | ESLint, Prettier, TypeScript estricto, Knip (código muerto) | Ver §11. |
| Pruebas | Vitest + Testing Library, Playwright, axe-core, Lighthouse CI | Ver §11. |

**Decidido (D1):** Next.js en Vercel. Plan B si Vercel dejara de ser gratuito para este uso: Firebase Hosting + Cloud Functions.

### 3.2 Requerimientos de arquitectura

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| ARQ-01 | P0 | Todas las páginas públicas se generan como HTML estático en build (SSG). | `view-source` muestra el contenido completo sin ejecutar JS. |
| ARQ-02 | P0 | Rutas por idioma: `/es` y `/en`. La raíz `/` redirige según `Accept-Language` (por defecto `es`). | Ambas rutas indexables, con `hreflang`. |
| ARQ-03 | P0 | TypeScript en modo `strict`; sin `any` explícito. | `tsc --noEmit` sin errores. |
| ARQ-04 | P0 | Secretos solo en variables de entorno; existe `.env.example` sin valores reales. | Ningún secreto en el repo. |
| ARQ-05 | P1 | El JS se carga por sección cuando aplica (la animación firma no bloquea el primer render). | El hero es legible antes de que cargue la animación. |

### 3.3 Estructura de carpetas propuesta

```
app/
  [locale]/
    layout.tsx
    page.tsx
    cv/page.tsx            # versión imprimible para generar el PDF (P1)
  api/contact/route.ts
  sitemap.ts
  robots.ts
  not-found.tsx
components/                # un componente por carpeta, con su .module.css
content/
  profile.json             # datos que no se traducen
  es.json                  # textos en español
  en.json                  # textos en inglés
  schema.ts                # esquemas Zod de todo el contenido
lib/
  i18n.ts
  dates.ts
  email/
public/
  cv/                      # PDFs ES y EN
  images/
specs/                     # este documento y la guía anti-patrones
```

### 3.4 Costos

Objetivo: **0 USD al mes**, salvo la renovación del dominio (D1).

| Servicio | Plan | Límite relevante |
| --- | --- | --- |
| Vercel | Hobby (gratis, uso personal no comercial) | Suficiente para un portafolio |
| Vercel Analytics | Incluido en Hobby | Cuota mensual de eventos del plan gratuito |
| Resend | Gratis | 3 000 correos/mes, 100/día |
| Upstash Redis (rate limit) | Gratis | Muy por encima del tráfico esperado |
| Cloudflare Turnstile | Gratis | Sin límite práctico |
| Dominio `ezzcream.space` | Renovación anual | Único costo fijo |

Si algún límite se supera o cambian las condiciones, se aceptan planes de pago (D1). Los límites se verifican al configurar cada servicio en F4 y F7.

---

## 4. Contenido en JSON

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| JSON-01 | P0 | **Ningún texto visible está escrito en los componentes.** Todo sale de `content/*.json`. | Búsqueda de texto literal en JSX: solo nombres propios técnicos o claves. |
| JSON-02 | P0 | Separación de datos: `profile.json` guarda lo que no se traduce (fechas ISO, URLs, tecnologías, logos, IDs). `es.json` y `en.json` guardan solo texto. Se enlazan por ID. | Cambiar una fecha se hace en un solo archivo. |
| JSON-03 | P0 | El contenido se valida con Zod en build. Un JSON mal formado o con campos faltantes rompe el build con un mensaje claro. | Test que borra un campo y espera error. |
| JSON-04 | P0 | `es.json` y `en.json` tienen exactamente las mismas claves. | Test de paridad en CI. |
| JSON-05 | P0 | Sin claves huérfanas: toda clave del JSON se usa y todo uso tiene clave. | Test o script en CI. |
| JSON-06 | P0 | Los textos con enlaces o énfasis usan un formato seguro (marcado mínimo tipo `<link>…</link>` interpretado por el componente), nunca `innerHTML`. | Sin `dangerouslySetInnerHTML` para contenido. Excepciones únicas: el script de arranque del tema y el JSON-LD (escapado con `\u003c`), ambos en `app/[locale]/layout.tsx`. |
| JSON-07 | P1 | Los tipos de TypeScript se derivan del esquema Zod (`z.infer`). | Autocompletado de claves en el editor. |
| JSON-08 | P1 | Un `content/README.md` explica cómo editar textos, añadir un puesto o un proyecto. | Oscar puede añadir un puesto sin tocar componentes. |

Modelo de datos mínimo (ilustrativo):

```jsonc
// profile.json
{
  "person": { "name": "Oscar Antonio Rodríguez Carmona", "email": "…", "github": "…", "linkedin": "…" },
  "experience": [
    { "id": "arguseye", "company": "ArgusEye", "start": "2025-11", "end": null,
      "url": "…", "logo": "/images/logos/arguseye.svg",
      "stack": ["React", "TypeScript", "Rust", "WebAssembly", "FastAPI", "PostgreSQL"] }
  ],
  "projects": [ { "id": "trustmango-landing", "url": "https://trustmango.sa", "repo": null, "stack": [] } ]
}
// es.json
{
  "experience": {
    "arguseye": { "role": "Software Developer", "summary": "…", "highlights": ["…", "…"] }
  }
}
```

---

## 5. Secciones y funcionalidad

| ID | Prio | Sección | Requerimiento | Aceptación |
| --- | --- | --- | --- | --- |
| FUN-01 | P0 | Navegación | Enlaces a secciones, selector de idioma y de tema **visibles en todas las anchuras** (en móvil, dentro del menú). Menú móvil accesible (ver A11Y-05). | En 375 px se puede cambiar idioma y tema. |
| FUN-02 | P0 | Hero | Nombre completo, rol, empresa actual, una frase concreta (sin palabras prohibidas), botones “Escríbeme” y “Descargar CV”. Altura según contenido, no `100vh`. | La siguiente sección asoma en el primer pantallazo en escritorio. |
| FUN-03 | P0 | Experiencia | Línea de tiempo con **todos** los puestos visibles a la vez (sin carrusel). ArgusEye y Rommaana muestran logros ampliables; los demás, 2–3 viñetas. Cada puesto muestra fechas, rol, tipo de empresa y stack. | Sin autoplay; todo el contenido en el HTML. |
| FUN-04 | P0 | Proyectos | Sección nueva con los proyectos personales aprobados (D10): Health-app, MichiStore, Backend GraphQL y PhantomSneakers. Cada uno con problema, qué hizo Oscar, stack, resultado y enlaces a repo y/o demo. Opcional: la landing pública de TrustMango como caso de trabajo. Argus Bot se cuenta dentro de la experiencia en ArgusEye, sin capturas (D6). | Cada proyecto tiene al menos un enlace que responde 200 y una captura real. |
| FUN-05 | P0 | Habilidades | Agrupadas (Frontend, Backend, Sistemas, Datos, Cloud/DevOps, Arquitectura). Cada skill indica dónde se usó (hover/tap o lista). | Ninguna skill sin respaldo (CNT-11). |
| FUN-06 | P0 | Sobre mí | Texto corto con voz propia y una foto real optimizada. | Cumple CNT-13. |
| FUN-07 | P0 | Educación y certificados | Títulos con institución y fechas; certificados con emisor y duración. | Datos de CNT-15. |
| FUN-08 | P0 | Contacto | Formulario (ver §6) + correo visible y copiable + LinkedIn + GitHub. | Si el envío falla, el correo sigue disponible. |
| FUN-09 | P0 | Descarga de CV | El botón descarga el PDF del idioma activo. | `/es` → PDF ES, `/en` → PDF EN. |
| FUN-10 | P0 | Tema | Claro, oscuro y sistema; sin parpadeo al cargar; preferencia guardada. | Recargar en oscuro no muestra un destello claro. |
| FUN-11 | P0 | Idioma | Cambiar de idioma navega a la ruta equivalente conservando la sección. | `/es#experiencia` → `/en#experience`. |
| FUN-12 | P0 | 404 | Página 404 diseñada y traducida. | `/es/xyz` muestra la 404 propia. |
| FUN-13 | P1 | PDF generado | El PDF ES/EN se genera en build desde el mismo JSON (ruta imprimible `/[locale]/cv` + Playwright), en una columna y legible por ATS. | El texto extraído del PDF sale en orden y sin letras espaciadas. **Hecho (14 oct 2026):** `npm run cv:pdf` con el sitio corriendo. El CV usa Plex Sans y Cormorant estáticas (Fontsource) porque Chrome incrusta las variables como Type3 y el texto se extrae partido. |
| FUN-14 | P0 | PDF provisional (reemplazado por FUN-13) | Hasta tener FUN-13, se usan `CV_Oscar_Rodriguez_ES.pdf` y `_EN.pdf` de `referencia-cv/`, revisados contra CNT-03 y CNT-05. Su enlace al portafolio tiene que funcionar (apunta a `ezzcream.space`, que se reactiva en D2). | El PDF publicado coincide con la web y sus enlaces responden 200. |

---

## 6. Backend de correo

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| MAIL-01 | P0 | Endpoint `POST /api/contact` que recibe `name`, `email`, `reason` (empleo · freelance · otro), `message`. | Respuesta `200` con envío correcto. |
| MAIL-02 | P0 | Validación con Zod en servidor (además del cliente): nombre 2–80, correo válido, mensaje 20–3000 caracteres. | Datos inválidos → `400` con errores por campo. |
| MAIL-03 | P0 | Antispam: campo honeypot oculto + tiempo mínimo de llenado (3 s) + Cloudflare Turnstile en modo invisible. | Envíos de bot se descartan sin enviar correo. |
| MAIL-04 | P0 | Límite de 5 envíos por IP por hora (Upstash Redis / Vercel KV). | El sexto envío → `429` con mensaje traducido. |
| MAIL-05 | P0 | El correo llega a `CONTACT_TO` (variable de entorno) con `Reply-To` del remitente, asunto `[Portafolio] {motivo}: {nombre}`, y versión texto + HTML con el contenido escapado. | Responder desde Gmail contesta al remitente. |
| MAIL-06 | P0 | **Sin auto-respuesta al remitente** que repita su mensaje (evita que se use la página para enviar spam a terceros). La confirmación es en pantalla. | Solo sale un correo por envío, a Oscar. |
| MAIL-07 | P0 | Estados de UI: enviando, enviado, error de validación, error de red, límite alcanzado. Mensajes en el idioma activo, anunciados con `aria-live`. | Probado en e2e con el proveedor simulado. |
| MAIL-08 | P0 | Los logs no guardan el mensaje ni el correo del remitente. | Revisión de código. |
| MAIL-09 | P0 | Solo se aceptan peticiones del propio dominio (comprobación de `Origin`) y `Content-Type: application/json`, cuerpo máximo 10 KB. | Petición desde otro origen → `403`. |
| MAIL-10 | P1 | Pruebas unitarias del handler con el proveedor de correo simulado. | Cobertura de todos los estados de MAIL-07. |

Variables de entorno: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`, `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.

---

## 7. Rediseño

El rediseño se hace **antes** de programar las secciones y necesita aprobación.

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| DIS-01 | P0 | Cumple al 100 % [ANTI-PATRONES-IA.md](ANTI-PATRONES-IA.md) §2. | Checklist en verde. |
| DIS-02 | P0 | Entregable de diseño previo al código: dos direcciones visuales distintas, cada una con paleta, tipografías, una pantalla de hero y una de experiencia, en ambos temas. Oscar elige una. | Dirección aprobada por escrito en `specs/DISENO.md`. |
| DIS-03 | P0 | La dirección parte de una **idea propia de Oscar**. Propuesta inicial: *el diagrama vivo*. La trayectoria se presenta como un diagrama de flujo de datos (nodos = puestos y proyectos, aristas enrutadas en ángulo recto), en referencia directa a su trabajo en el motor de grafos Rust/WASM y el editor de DFD. Alternativa: trazo de línea inspirado en su trabajo de tatuaje. | La idea está documentada en `DISENO.md` con su justificación. |
| DIS-04 | P0 | Sistema de tokens: 4–6 colores con nombre, escala tipográfica, espaciado, radios y sombras, definidos en CSS custom properties, con valores para tema claro y oscuro. | Ningún color literal fuera de los tokens. |
| DIS-05 | P0 | Tipografía fuera de la lista prohibida de la guía; display + texto + mono; máximo 2 familias cargadas más la mono; `font-display: swap` y subset latino. | Sin Inter, Montserrat, Poppins, Space Grotesk, etc. |
| DIS-06 | P0 | Logos reales de empresas e instituciones en SVG o PNG optimizado; capturas reales de proyectos. Nada de iniciales en cuadros ni maquetas vacías. | Inventario de assets completo. |
| DIS-07 | P0 | Responsive desde 320 px hasta 1920 px, sin scroll horizontal. | Probado en 320, 375, 768, 1280, 1920. |
| DIS-08 | P0 | Layout distinto según el contenido de cada sección (línea de tiempo, rejilla de proyectos, lista de skills). No todas las secciones con eyebrow + título centrado. | Revisión visual. |
| DIS-09 | P1 | Imagen Open Graph diseñada por idioma (1200×630). | Vista previa correcta en LinkedIn y WhatsApp. |

---

## 8. Animaciones

“Pro” se define como pocas animaciones, coreografiadas, rápidas y con propósito. Ver guía §3.

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| ANI-01 | P0 | **Momento firma** en el hero ligado a DIS-03 (por ejemplo, el diagrama se traza y sus aristas se enrutan hacia el puesto actual). Máximo 1.2 s; interactivo al pasar el cursor (resalta conexiones reales). | Storyboard aprobado en `DISENO.md`. |
| ANI-02 | P0 | Línea de tiempo de experiencia con progreso ligado al scroll (sin secuestrar el scroll). | La rueda del ratón se comporta de forma nativa. |
| ANI-03 | P0 | Transiciones de cambio de tema y de idioma con View Transitions API, con fallback instantáneo. | Funciona en Chrome; en Safari/Firefox sin errores. |
| ANI-04 | P0 | Micro-interacciones con significado: estados del formulario, copiar correo, expandir logros, hover de proyectos que muestra la captura o el stack. | Cada una tiene un estado final claro. |
| ANI-05 | P0 | Solo `transform`, `opacity` y `clip-path`; 60 fps en un móvil de gama media (perfilado con CPU ×4 en DevTools). | Sin tareas largas > 50 ms por animación. |
| ANI-06 | P0 | `prefers-reduced-motion: reduce` desactiva todo movimiento no esencial, también en JS y canvas, y muestra el estado final del momento firma estático. | Probado con la preferencia activa. |
| ANI-07 | P0 | Ningún contenido depende de una animación para ser visible: en reposo y sin JS todo se lee. | Captura con JS desactivado muestra todo el texto. |
| ANI-08 | P0 | Prohibido: lista §3.1 de la guía (fade-up en todo, scroll-jacking, parallax decorativo, cursor custom, typewriter, contadores, autoplay). | Revisión de código. |
| ANI-09 | P1 | Las animaciones se pausan cuando su sección no es visible o la pestaña está oculta. | Sin `requestAnimationFrame` activo fuera de pantalla. |

---

## 9. Accesibilidad (WCAG 2.2 AA)

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| A11Y-01 | P0 | Contraste mínimo 4.5:1 en texto normal y 3:1 en texto grande y componentes, en ambos temas. | Verificado por token con una herramienta de contraste y axe. |
| A11Y-02 | P0 | Navegación completa con teclado, orden lógico, foco visible personalizado (`:focus-visible`). | Recorrido manual con Tab. |
| A11Y-03 | P0 | Enlace “Saltar al contenido”, landmarks (`header`, `nav`, `main`, `footer`) y un solo `h1`. | axe sin errores. |
| A11Y-04 | P0 | Formulario con `label` visibles, errores asociados con `aria-describedby` y anunciados con `aria-live`. | Probado con VoiceOver. |
| A11Y-05 | P0 | Menú móvil con `aria-expanded`, `aria-controls`, cierre con Esc y foco atrapado mientras está abierto. | Probado con teclado y VoiceOver. |
| A11Y-06 | P0 | `lang` correcto por ruta; `aria-label` traducidos; botones de tema e idioma con estado (`aria-pressed` o texto). | Lector de pantalla anuncia el estado. |
| A11Y-07 | P0 | Imágenes con `alt` descriptivo o vacío si son decorativas; los logos-enlace describen el destino. | axe sin errores. |
| A11Y-08 | P0 | Cumple ANI-06 y ANI-07. | — |
| A11Y-09 | P0 | Objetivos táctiles mínimo 24×24 px (ideal 44×44). | Revisión en 375 px. |

---

## 10. Rendimiento y SEO

### 10.1 Rendimiento

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| PERF-01 | P0 | Lighthouse móvil: Rendimiento ≥ 90, Accesibilidad 100, Buenas prácticas 100, SEO 100. | Lighthouse CI en cada PR. |
| PERF-02 | P0 | Core Web Vitals (móvil): LCP < 2.0 s, CLS < 0.05, INP < 200 ms. | Lighthouse CI + Vercel Speed Insights. |
| PERF-03 | P0 | JS inicial < 150 KB gzip. | Reporte de build. |
| PERF-04 | P0 | Imágenes con `next/image`: AVIF/WebP, tamaños responsivos, `width`/`height`, lazy fuera del primer pantallazo. Ninguna imagen > 200 KB. | Reporte de assets. |
| PERF-05 | P0 | Fuentes autoalojadas con `next/font`, subset y preload solo de la principal. | Sin petición a Google Fonts en runtime. |
| PERF-06 | P0 | Se eliminan del repo las imágenes sin uso (9.4 MB, incluido `PreviewMichi.gif` de 6.4 MB) o se convierten si se usan en Proyectos (vídeo MP4/WebM o WebP animado < 1 MB). | Knip/script sin assets huérfanos. |

### 10.2 SEO

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| SEO-01 | P0 | `title` y `description` por idioma, con nombre completo y rol, sin palabras prohibidas. | `<title>Oscar Antonio Rodríguez Carmona · Full Stack Developer</title>` o equivalente. |
| SEO-02 | P0 | Open Graph y Twitter Card completos por idioma con imagen (DIS-09). | Validador de LinkedIn Post Inspector. |
| SEO-03 | P0 | JSON-LD `Person` con nombre, puesto, empresa actual, ubicación y `sameAs` (LinkedIn, GitHub). | Rich Results Test sin errores. |
| SEO-04 | P0 | `hreflang` (`es`, `en`, `x-default`), `canonical` por ruta, `sitemap.xml` y `robots.txt` generados. | Presentes en el build. |
| SEO-05 | P0 | Favicon en SVG + PNG + `apple-touch-icon`, con tipos MIME correctos. Sin `meta keywords`. | Revisión del `<head>`. |
| ANA-01 | P1 | Vercel Analytics activo en producción, sin cookies ni banner de consentimiento (D9). | Las visitas aparecen en el panel de Vercel. |
| SEO-06 | P0 | La URL antigua `ezzcream.github.io/CV/` redirige al dominio nuevo (página estática con `meta refresh` y `canonical`). | Visitar la URL antigua lleva al sitio nuevo. |

---

## 11. Calidad, pruebas y repositorio

| ID | Prio | Requerimiento | Aceptación |
| --- | --- | --- | --- |
| QA-01 | P0 | CI en GitHub Actions: lint, typecheck, tests, Knip, build y Lighthouse CI en cada PR. | PR no se fusiona con CI en rojo. |
| QA-02 | P0 | Tests unitarios: esquema y paridad de contenido (JSON-03/04/05), formateo de fechas, validación y handler del formulario. | Vitest en verde. |
| QA-03 | P0 | Tests e2e (Playwright): navegación, cambio de idioma y tema, menú móvil, envío del formulario (éxito, error, límite) con el correo simulado. | Playwright en verde en Chromium y WebKit. |
| QA-04 | P0 | axe-core en e2e sobre `/es` y `/en`, en ambos temas. | 0 violaciones. |
| QA-05 | P0 | Sin código muerto, comentarios decorativos ni tokens sin definir (guía §4). | Knip y revisión. |
| QA-06 | P0 | Plantilla de PR con la checklist anti-IA (guía §5). | `.github/pull_request_template.md`. |
| REPO-01 | P0 | Eliminar `WORKING_FILE.md`, `.DS_Store`, `index.html`, `css/` y dependencias antiguas (`sass`, `nodemon`) al completar la migración. | No quedan archivos del sitio viejo. |
| REPO-02 | P0 | `.gitignore` incluye `.DS_Store`, `.env*` (salvo `.env.example`), `referencia-cv/`, `.next/`, `node_modules/`. | `git status` limpio tras build. |
| REPO-03 | P0 | README nuevo: qué es, captura, URL, stack, cómo correrlo, cómo editar contenido, variables de entorno. | README revisado. |
| REPO-04 | P0 | `CLAUDE.md` en la raíz que obligue a leer `specs/ANTI-PATRONES-IA.md` y este documento antes de tocar contenido, diseño o animación. | Archivo presente (creado el 14 oct 2026). |

---

## 12. Fases

| Fase | Entregable | Requerimientos | Puerta de salida |
| --- | --- | --- | --- |
| F0 · Contenido | Decisiones de la sección 14 (hechas); textos finales ES/EN en JSON; URLs de repos y demos de los 4 proyectos | CNT-*, JSON-01..05 | Oscar aprueba los textos |
| F1 · Diseño | `specs/DISENO.md` con dirección elegida, tokens, tipografía, storyboard del momento firma | DIS-01..06, ANI-01 | Oscar aprueba la dirección |
| F2 · Base del proyecto | Next.js, TS estricto, CI, i18n, carga y validación de JSON, tema | ARQ-*, QA-01, FUN-10, FUN-11 | CI en verde con página vacía en `/es` y `/en` |
| F3 · Secciones | Todas las secciones con contenido real, responsive | FUN-01..09, FUN-12, DIS-07, DIS-08 | Revisión visual en 5 anchuras |
| F4 · Correo | Endpoint, antispam, rate limit, estados de UI | MAIL-* | Correo real recibido en preview |
| F5 · Animación | Momento firma y micro-interacciones | ANI-* | 60 fps en móvil y reduced-motion probado |
| F6 · Calidad | Accesibilidad, rendimiento, SEO | A11Y-*, PERF-*, SEO-*, QA-02..06 | Lighthouse y axe en objetivo |
| F7 · Lanzamiento | Dominio, redirección desde GitHub Pages, limpieza del repo | SEO-06, REPO-*, FUN-13/14 | Sitio en producción |

---

## 13. Trazabilidad con la auditoría

Cada hallazgo de la auditoría del 14 oct 2026 queda cubierto por al menos un requerimiento.

| Hallazgo de la auditoría | Requerimiento |
| --- | --- |
| Enlace del PDF a `/About-Me/` da 404 | FUN-14, SEO-06 |
| Inglés “B1” vs “Fluent” | CNT-05 |
| Duraciones contradictorias (Schneider, Artifields) | CNT-03, CNT-04 |
| Descripciones copiadas en el PDF | FUN-13, FUN-14 |
| PDF sin ArgusEye | FUN-13, FUN-14 |
| Trabajos simultáneos / Canwe | CNT-02, CNT-03 |
| Puestos sin fechas | CNT-04 |
| Métricas del hero sin respaldo | CNT-10 |
| Sin sección de proyectos | FUN-04 |
| Logros sin números | CNT-07 |
| Identidad dispersa (EzzCream / nombres distintos) | CNT-06 |
| UTEL marcado en curso | CNT-15 |
| Skills sin respaldo | CNT-11, FUN-05 |
| Idiomas duplicados y mezclados | JSON-01, JSON-04 |
| © 2025 vs © 2026 | CNT-16 |
| Párrafo de hobby con conexión forzada | CNT-13 |
| PDF ilegible para ATS (letras espaciadas, dos columnas) | FUN-13 |
| Faltas de ortografía en el PDF | FUN-13, FUN-14 |
| Patrones de redacción IA (15 de 16) | CNT-07, CNT-12, CNT-13, guía §1 |
| Patrones de diseño IA (orbes, cuadrícula, violeta, maquetas, píldora…) | DIS-01..08, guía §2 |
| Experiencia escondida en carrusel con autoplay | FUN-03, ANI-08 |
| Sin selector de idioma en móvil | FUN-01 |
| Hero de 100vh | FUN-02 |
| Tags cuadrados por token sin definir | DIS-04, QA-05 |
| Logo ilegible en tema oscuro | CNT-06, DIS-04 |
| Parpadeo de tema/idioma al cargar | ARQ-01, FUN-10 |
| Contraste insuficiente | A11Y-01 |
| Autoplay sin pausa | FUN-03, ANI-08 |
| Animaciones JS ignoran reduced-motion | ANI-06 |
| Menú móvil sin ARIA ni foco | A11Y-05 |
| Sin foco visible | A11Y-02 |
| Botones con `aria-label` fijo en inglés | A11Y-06 |
| `setup.webp` de 1.6 MB y logos sobredimensionados | PERF-04 |
| Bucle de animación permanente | ANI-09 |
| Imágenes sin dimensiones ni lazy | PERF-04 |
| Montserrat en 5 pesos sin preconnect | DIS-05, PERF-05 |
| 9.4 MB de imágenes sin uso | PERF-06 |
| Sin Open Graph | SEO-02, DIS-09 |
| Sin datos estructurados | SEO-03 |
| Inglés no indexable | ARQ-01, ARQ-02, SEO-04 |
| Título sin apellido, meta description genérica | SEO-01 |
| Sin canonical/robots/sitemap, favicon mal tipado, keywords | SEO-04, SEO-05 |
| `WORKING_FILE.md` público | REPO-01 |
| README y `package.json` desactualizados | REPO-01, REPO-03 |
| `innerHTML` pierde `rel="noopener"` | JSON-06 |
| CSS muerto y claves huérfanas | JSON-05, QA-05 |
| Textos sin traducir | JSON-01, JSON-04 |
| `.DS_Store` versionado | REPO-02 |
| Teléfono público | CNT-14 |

---

## 14. Decisiones tomadas

Respondidas por Oscar el 14 oct 2026.

| ID | Pregunta | Decisión | Requerimientos afectados |
| --- | --- | --- | --- |
| D1 | Stack | **Next.js en Vercel**, siempre que no haya costo; si en algún momento hace falta pagar, se acepta. Firebase Hosting queda como plan B. | §3.1, §3.4 |
| D2 | Dominio | **Reactivar `ezzcream.space`** y configurar su DNS para Vercel y para Resend (SPF, DKIM). | SEO-06, MAIL-05, FUN-14 |
| D3 | Destino del formulario | **oscar.7n7@gmail.com** | MAIL-05 |
| D4 | Teléfono del PDF | **56 5284 5253**. En la web no se muestra. | CNT-14, FUN-13, FUN-14 |
| D5 | Freelancer | **Se quita**, igual que Canwe. | CNT-02 |
| D6 | Métricas y capturas de ArgusEye | **No se publican.** Se describe el trabajo sin cifras internas ni capturas del producto. | CNT-09, FUN-04, DIS-06 |
| D7 | Maestría | **Maestría en Arquitectura de Software, UTEL, sep 2026 – en curso.** | CNT-15 |
| D8 | Licenciatura UTEL | **Lic. Comunicación Digital, UTEL, 2023–2026, en trámite de titulación.** | CNT-15 |
| D9 | Analítica | **Vercel Analytics** (sin cookies). | ANA-01 |
| D10 | Proyectos personales publicables | **Health-app, MichiStore, Backend GraphQL y PhantomSneakers.** | FUN-04 |
