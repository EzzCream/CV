# Diseño: portafolio v2

| | |
| --- | --- |
| Estado | **Redefinido** el 14 oct 2026: hero “Rastro de código” (ver sección final). La dirección A y sus cambios quedan como historial. |
| Fecha | 14 oct 2026 |
| Vista previa | https://claude.ai/artifact/DL1m7UQnaMk31sgMn4MvdX (privada) |
| Requerimientos | DIS-01..09, ANI-01..09 en [REQUERIMIENTOS.md](REQUERIMIENTOS.md) |

Las dos direcciones cumplen [ANTI-PATRONES-IA.md](ANTI-PATRONES-IA.md) §2 y §3. Contrastes calculados con la fórmula de WCAG 2.x sobre el fondo de cada tema.

---

## A · Diagrama vivo

**Idea.** Oscar dibuja sistemas como diagramas de flujo de datos (editor de DFD y motor de layout Rust/WASM en ArgusEye). La página cuenta su carrera con esa notación: cada puesto es un proceso, la educación es un almacén de datos, las conexiones se colorean por tecnología (como su editor las colorea por protocolo) y un trust boundary punteado agrupa los productos en producción.

### Tokens

| Token | Claro | Oscuro | Uso | Contraste (claro / oscuro) |
| --- | --- | --- | --- | --- |
| `--paper` | `#EDEFEA` | `#0F1211` | Fondo | — |
| `--surface` | `#F6F7F4` | `#161A19` | Nodos | — |
| `--ink` | `#15181B` | `#E6E9E4` | Texto | 15.4 / 15.4 |
| `--muted` | `#545B58` | `#9AA29D` | Texto secundario | 6.0 / 7.2 |
| `--line` | `#C3C9C2` | `#2C3330` | Bordes, carril | decorativo |
| `--accent` | `#0B6E62` | `#4FC1AE` | Puesto actual, flujo final | 5.3 / 8.6 |
| `--flow-a` | `#9E4A16` | `#E39A62` | Flujos Java/Angular | 5.3 / 8.1 |
| `--flow-b` | `#34509E` | `#8EA6EE` | Flujos JavaScript | 6.5 / 7.9 |

### Tipografía

| Rol | Familia | Uso |
| --- | --- | --- |
| Display | Schibsted Grotesk 700/800 | Nombre, títulos de sección, empresas |
| Texto | Atkinson Hyperlegible 400/700 | Párrafos y viñetas |
| Utilidad | IBM Plex Mono 400/500 | Fechas, nodos, stack, navegación |

### Momento firma (ANI-01)

1. 0–700 ms: los seis nodos aparecen en orden cronológico (UPIICSA → ArgusEye), 140 ms entre cada uno, subiendo 6 px.
2. Cada conexión se traza 120 ms después de su nodo de origen.
3. 700–1100 ms: un paquete recorre la última conexión (Rommaana → ArgusEye) y el borde doble de ArgusEye parpadea una vez.
4. Hover: el nodo se eleva 2 px y resalta sus conexiones.
5. Reduced motion: diagrama completo, sin movimiento.

En móvil el diagrama se reorganiza en vertical (nodos apilados con conexiones verticales).

### Experiencia

Línea de tiempo vertical: carril con marcadores cuadrados (el actual relleno con `--accent`), fecha en mono, empresa en display, rol al lado, descripción de una línea, viñetas y stack como “puertos”. Los dos puestos más antiguos en formato compacto. El carril se rellena según el scroll.

---

## B · Hoja de flash

**Idea.** Oscar tatúa y diseñó pines. La página es una hoja de flash de estudio de tatuaje: cada puesto es una lámina numerada con un dibujo de línea propio (Argus de cien ojos para ArgusEye, granada = “rommaana” en árabe, rayo para Schneider Electric). El hero es una daga atravesando llaves de código con un listón “React · Rust · FastAPI”.

### Tokens

| Token | Claro | Oscuro | Uso | Contraste (claro / oscuro) |
| --- | --- | --- | --- | --- |
| `--skin` | `#F4F4F1` | `#121417` | Fondo | — |
| `--ink` | `#121417` | `#F1F1EE` | Texto, trazos | 16.7 / 16.3 |
| `--muted` | `#565B63` | `#A3A8B0` | Texto secundario | 6.2 / 7.7 |
| `--red` | `#B3232A` | `#FF6B6F` | Botón principal, listón | 6.0 / 6.7 |
| `--yellow` | `#E9B824` | `#F2C94C` | Solo relleno (nunca texto sobre el fondo claro: 1.7) | tinta sobre amarillo 10.0 |

### Tipografía

| Rol | Familia | Uso |
| --- | --- | --- |
| Display | Anybody (eje de anchura 50–150) | Nombre ancho, empresas estrechas |
| Texto | Libre Franklin 400/600 | Párrafos |
| Utilidad | DM Mono 400/500 | Números de lámina, fechas, navegación |

### Momento firma (ANI-01)

1. 0–1000 ms: el dibujo se traza trazo por trazo, 65 ms entre trazos.
2. 1000–1200 ms: entra el color (amarillo, rojo) y el texto del listón.
3. En paralelo, el nombre pasa de anchura 60 % a 150 %.
4. Hover en una lámina: su ícono se vuelve a trazar.
5. Reduced motion: dibujo y nombre en su estado final.

### Experiencia

Rejilla de láminas con borde de 2 px compartido, número de lámina (orden cronológico), fechas, ícono, empresa, rol y dos viñetas. La lámina actual con fondo amarillo tenue.

---

## Recomendación

A como base (se entiende en segundos y habla del trabajo para el que contratan a Oscar) con dos piezas de B en “Sobre mí”: un dibujo real de Oscar con trazo de tatuaje y los íconos de lámina como detalle.

## Decisión

**14 oct 2026.** Oscar elige **A · Diagrama vivo** como dirección del sitio, con dos piezas de B en la sección “Sobre mí”: un dibujo suyo con trazo de tatuaje y los íconos de lámina.

### Reglas de la mezcla

- **Todo el sitio usa los tokens, tipografías y animación de A.** B no aporta colores ni fuentes: nada de rojo `#B3232A`, amarillo `#E9B824`, Anybody, Libre Franklin ni DM Mono.
- **Íconos de lámina** (ojo de Argus, granada, brote, estrella, rayo): se redibujan en trazo `--ink` de 2.5–3 px con extremos redondeados, en un contenedor de 64 px. Aparecen en “Sobre mí” junto a la frase sobre los puestos y, como detalle opcional, en la línea de tiempo al pasar el cursor por cada puesto.
- **Dibujo de Oscar:** una ilustración real hecha por él (escaneada o vectorizada) en trazo de línea, monocroma en `--ink`, que se invierte sola en tema oscuro. Ocupa la columna visual de “Sobre mí” en lugar de una segunda foto.
- **Animación en “Sobre mí”:** el dibujo se traza una vez al entrar en pantalla (técnica del momento firma de B, 1 s máximo). Con reduced motion se muestra completo.
- La foto real de Oscar se mantiene, más pequeña, junto al texto.

### Pendientes de diseño

| ID | Pendiente | Quién |
| --- | --- | --- |
| P1 | Entregar el dibujo para “Sobre mí” (SVG, o PNG/escaneo de alta resolución para vectorizar) | Oscar |
| P2 | Versión vertical del diagrama del hero para móvil (≤ 600 px) | Diseño, en F3 |
| P3 | Íconos de lámina definitivos en trazo de A | Diseño, en F3 (Oscar puede dibujarlos) |
| P4 | Diseño de las secciones restantes: Proyectos, Habilidades, Educación, Contacto, 404 | Diseño, en F3 con los tokens de A |

### Cambios tras revisar el prototipo (14 oct 2026)

- **Hero sin diagrama.** El diagrama de trayectoria se elimina. En su lugar va una ilustración de Oscar hecha en CSS (cabello hacia un lado, lentes de armazón metálico, playera negra, brazo tatuado) escribiendo en su laptop, con taza y vapor.
- **Animación del hero (sustituye ANI-01):** al cargar, Oscar, la laptop y la taza suben en secuencia y los lentes “caen” en su lugar (≈1.1 s). Después, bucles discretos: parpadeo, manos tecleando, un brillo en los lentes, vapor y, de vez en cuando, levanta la mirada. Los ojos siguen al cursor en escritorio. Con reduced motion todo queda estático.
- **El párrafo del hero** ya no menciona el editor de diagramas ni Rust/WebAssembly.
- **Orden de secciones:** Hero → Sobre mí → Experiencia → Proyectos → Habilidades → Educación → Contacto.
- Los diagramas de arquitectura en Proyectos se mantienen.

---

## Nueva dirección: Rastro de código (14 oct 2026)

Oscar descartó, en este orden: el diagrama del hero, la ilustración de sí mismo (en CSS y en SVG), el estudio 3D (primitivas y React Three Fiber) y la tipografía cinética amarilla. Eligió el concepto de **tinta** y pidió convertirlo en **código**.

Vista previa: https://claude.ai/artifact/9G5kJALpWWEJnYgv12w1cN (opción 1).

### Hero

- **Retícula invisible de caracteres** (celdas de 16 px; 13 px en móvil) sobre fondo `#E5E7E6` con tinta `#0C0E10`.
- **Entrada:** una ráfaga de caracteres se expande detrás del nombre y se apaga poco a poco hasta revelarlo.
- **Cursor:** deja un rastro de caracteres que parpadean, se esparcen a los vecinos (difusión) y se apagan solos. Donde la energía supera 0.5 la celda se vuelve bloque sólido con el carácter en claro, y el texto encima se invierte (`mix-blend-mode: difference`). Un bloque rojo `#B5121B` parpadea en la posición del cursor.
- **Sin cursor (tras 1.4 s):** comportamientos al azar, casi siempre uno a la vez (25 % de probabilidad de dos), con pausas de 1.6–3.2 s:
  - código que se escribe solo (frases reales como `git push origin main`);
  - circuito ortogonal;
  - cursor errante;
  - pulso;
  - barrido;
  - columna que cae.

  El glitch se descartó por caótico. Los destellos sueltos son raros y salen solo en la mitad derecha.
- **Reduced motion:** estado final estático, sin animación.

### Tipografía

| Rol | Familia |
| --- | --- |
| Nombre | **Cormorant Garamond** 500, “Oscar” en redonda y “Rodríguez Carmona” en cursiva |
| Rastro, interfaz y datos | JetBrains Mono (rastro) e IBM Plex Mono (textos pequeños y botones) |

Tipografías probadas y descartadas: Grenze Gotisch, JetBrains Mono como nombre, Geist, Sora, Unbounded, Doto, Tektur, Syne, Bricolage Grotesque, Instrument Serif, Bodoni Moda, DM Serif Display, Playfair Display y Newsreader. Las de la ronda Geist/Sora/Unbounded/Newsreader se vieron con letra genérica por un error en el enlace de Google Fonts.

### Resto del sitio (prototipo completo, 14 oct 2026)

Prototipo: https://claude.ai/artifact/M9DHVKFXm4YvWCXFSzRXag

- **Tokens:** papel `#E5E7E6`, superficie `#EEF0EF`, tinta `#0C0E10`, gris `#4F5559`, línea `#C4C9C8`, rojo `#B5121B`. En modo oscuro se invierten (papel `#0E1012`, tinta `#E3E6E4`, rojo `#FF5C63`).
- **Tipografía:**
  - Cormorant Garamond para títulos y nombres de empresa, con cursivas;
  - IBM Plex Sans para el texto;
  - IBM Plex Mono para índices, fechas y etiquetas;
  - JetBrains Mono para el rastro.
- **Secciones:** índice lateral en mono (`01 // sobre-mi`) que se queda fijo al hacer scroll, y título grande en Cormorant que se decodifica (caracteres revueltos que se resuelven) al entrar en pantalla.
- **Experiencia:** formato de bitácora, con fechas en mono a la izquierda y viñetas con flecha roja. El puesto actual lleva una etiqueta roja “hoy”.
- **Proyectos:** rejilla de dos columnas con bordes compartidos y diagramas de arquitectura con flechas rojas.
- **Habilidades:** tabla por grupo, cada habilidad con dónde se usó.
- **Contacto:** formulario sobrio; al enviar responde con un mensaje tipo terminal (`$ send --to oscar ✓ 200 OK`).
- **Marca:** `oscar.rodriguez` con un cursor rojo que parpadea.
- Probado en escritorio (claro y oscuro) y en 375 px, sin scroll horizontal.

### Modo presentación (probado y descartado, 14 oct 2026)

Se probó una presentación de 8 diapositivas con scroll-snap que luego se volvía landing. Oscar la descartó. El sitio es una landing normal desde el inicio.

### Comportamiento final del rastro (reescrito el 14 oct 2026)

**Fallas de la versión anterior:**
- una sola capa fija para todo: lo del hero se quedaba pegado a la pantalla al hacer scroll;
- el hero se apagaba con el 35 % todavía visible;
- se creaban observadores duplicados al cambiar de idioma;
- en móvil se reiniciaba con cada cambio de la barra del navegador;
- no detectaba cuando el mouse salía de la ventana;
- redibujaba sin parar aunque no hubiera nada que dibujar.

**Diseño actual: dos capas independientes**

| Capa | Dónde vive | Qué hace |
| --- | --- | --- |
| Hero | `<canvas>` dentro del hero (`position: absolute`), se mueve con él | Rastro del mouse a fuerza completa (bloques sólidos, nombre invertido con `mix-blend-mode: difference`), ráfaga de entrada y comportamientos automáticos tras 1.4 s sin mouse sobre el hero. Solo corre mientras el hero está en pantalla. |
| Cursor | `<canvas>` fijo detrás del contenido (`z-index: -1`, `pointer-events: none`), tamaño exacto de la ventana | Solo el rastro del mouse cuando el puntero está fuera del hero. Caracteres tenues (opacidad 75 % × alfa máx. 0.62), se apaga rápido (decay 0.966) y se duerme cuando no queda nada. Desactivado en táctil y con reduced motion. |

**Reglas comunes:**
- El puntero se escucha en `window`, así que el scroll nunca se bloquea.
- Al hacer scroll con el mouse quieto, el rastro sigue saliendo justo debajo del cursor, en la capa que corresponda.
- Al salir el mouse de la ventana (`pointerout` sin `relatedTarget`, o `blur`) se olvida su posición.
- El resize va con debounce y solo reinicia si cambia el ancho o la altura cambia más de 120 px.
- Un solo `requestAnimationFrame`, que se detiene con la pestaña oculta o sin nada que dibujar.
- El hero se vuelve a montar al cambiar de idioma, sin duplicar observadores.

**Probado:** carga, ráfaga, rastro y scroll con mouse quieto en el hero y en la página, salida del mouse, cambio de idioma y de tema, y 375 px sin desbordes.

### Íconos de empresa en Experiencia (14 oct 2026)

Se recuperaron los íconos de línea de la dirección B y van en la columna de fechas de cada puesto:
- el logo real de ArgusEye, una A sin barra con un punto al centro, con las proporciones de `argus_v8_icon` (repo `webpage`);
- granada para Rommaana (“rommaana” significa granada en árabe);
- brote para Artifields;
- estrella para Monific;
- rayo para Schneider Electric.

Son de 48 px, con trazo de tinta de 2.6 px. El del puesto actual (ArgusEye) destaca en un bloque rojo de 72 px que se abre al aparecer: la A en blanco se traza dentro y el punto parpadea como el cursor del hero. Se dibujan trazo por trazo (0.9 s) cuando el puesto entra en pantalla. Con reduced motion aparecen completos. El dato vive en `profile.json` (`experience[].icon`) y la descripción accesible en `experience.icons`.

### Navegación que sigue la página (14 oct 2026)

Un indicador rojo de 2 px bajo los enlaces de la barra se desliza (0.45 s) hacia la sección visible al hacer scroll, y el enlace activo pasa a tinta. La sección se calcula en el orden real de la página. Antes se calculaba en el orden de las claves del JSON y se quedaba marcando “Sobre mí”. Al llegar al final de la página se marca Contacto.

### Hero recompuesto (14 oct 2026)

El hero se veía vacío: el nombre solo a la izquierda y dos renglones diminutos arriba y abajo. Ahora tiene dos columnas, centradas en la altura:
- **Izquierda:** nombre en Cormorant (hasta 15 rem) con el apellido en cursiva, el párrafo de presentación (`hero.lead`) y los botones “Escríbeme” y “Descargar CV”.
- **Derecha:** una ficha técnica con datos reales en mono:
  - Ahora: rol y empresa de `experience[0]`;
  - Antes: `experience[1]`;
  - Stack;
  - Base: ciudad y hora local de CDMX en vivo;
  - Idiomas.
- **Pie del hero:** “↓ Sobre mí” y la pista del cursor.
- Cada texto lleva `mix-blend-mode: difference`, así que se invierte cuando pasa el rastro. Entra escalonado al cargar (90 ms).
- En móvil va en una columna, con altura mínima de una pantalla.

### Dibujos de código en el hero (14 oct 2026)

Oscar descartó la ficha técnica de experiencia. El lado derecho del hero ahora es un área donde el motor del rastro **dibuja con código**: cada dibujo se arma celda por celda (≈0.8 s, de arriba abajo con algo de azar), se sostiene 3.2 s y se disuelve en el rastro. Después de una pausa de 1.5 s sigue el siguiente.

| Dibujo | Caracteres | Color |
| --- | --- | --- |
| Michi (orejas, ojos, nariz, bigotes) | `MIAU` | tinta |
| Corazón (con brillo) | `<3` | tinta |
| Café (taza, asa y vapor) | `CAFE` | tinta |
| `</>` | `{}</>` | tinta |
| 02 de Evangelion (serif condensada) | `EVA` | rojo |

- Los huecos de cada forma (ojos, asa, brillo) se mantienen claros a la fuerza, porque la difusión los rellenaría.
- Si el mouse pasa por el dibujo mientras se sostiene, esa parte se desarma.
- Las formas viven en `SHAPES` (lienzo de 100×100; `destination-out` abre huecos) y se escalan al área disponible.

**Ajuste (14 oct 2026):** se quitaron la escritura con el teclado, el pie que decía qué se dibujaba y la pista “Mueve el cursor”. El área de dibujo ocupa todo el lado derecho y el pie del hero solo tiene “↓ Sobre mí”.

**Ajuste de composición (14 oct 2026):** el contenido del hero va en un contenedor centrado de 1260 px como máximo, con columnas 1.15 / 0.85 centradas en la altura. Así el nombre y el dibujo se acercan al centro en lugar de quedar pegados a las esquinas, sobre todo en pantallas anchas. El pie del hero se alinea con el mismo contenedor.

## Implementación en Next.js (14 oct 2026)

El prototipo aprobado (v15) se portó sin cambios visuales:

- `app/globals.css`: la hoja del prototipo; las fuentes llegan por `next/font` como `--font-display`, `--font-body`, `--font-mono` y `--font-trail`.
- `components/trail/engine.ts`: el motor del rastro tipado (retícula, agentes, dibujos). Recibe el nombre real de las familias de `next/font`, porque el canvas no puede leer variables CSS.
- `components/Header.tsx`: menú, idioma (conserva la sección), tema, indicador deslizante y fondo sólido al salir del hero.
- El cambio de idioma ahora navega entre `/es` y `/en` en lugar de re-renderizar en el mismo documento.
- Ajuste: el fondo sólido del header se activa con `rootMargin: -80px` (antes `-56px`). Al saltar a «Sobre mí», el `scroll-padding-top` de 64 px dejaba visible el pie del hero detrás del header transparente.

## Ajustes por la revisión de calidad (14 oct 2026)

- La entrada del hero dura 510 ms en total (`--d` 0, 2 y 4 a 90 ms) para cumplir la regla de la guía (menos de 600 ms).
- El párrafo del hero no tiene animación de entrada. Es el elemento LCP: con fade, Lighthouse lo cuenta después de toda la hidratación (LCP simulado de 4 s contra 2 s sin fade).
- El rastro arranca con `requestIdleCallback` (máximo 1,2 s) y en equipos lentos dibuja el hero cuadro de por medio.
- Sobre rojo se usa `--on-red`: blanco en claro y casi negro en oscuro. Blanco sobre el rojo del tema oscuro daba 3.02:1.
- Excepción consciente a la regla de "nada en bucle infinito": el cursor del logo y el punto de ArgusEye parpadean. Son parte del motivo del cursor y Oscar pidió que ArgusEye destacara.
- Solo se precargan las fuentes del primer pantallazo (Cormorant 500 e IBM Plex Sans). Las fuentes estáticas del CV viven en `lib/fonts-cv.ts` para que no se precarguen en el sitio.
