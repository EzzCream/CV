# Anti-patrones de IA

Guía obligatoria para todo el texto, diseño, animación y código de este portafolio. Si algo de esta lista aparece en un cambio, se corrige antes de hacer merge.

Investigación hecha en octubre de 2026. Las fuentes están al final.

## Por qué existe esta guía

Ninguna señal aislada prueba que algo lo hizo una IA. En una prueba, los reclutadores identificaron CVs de ChatGPT solo el 33 % de las veces. Lo que sí detectan, y por lo que descartan, es lo **genérico**: texto que cualquiera podría firmar y diseño que se parece a miles de sitios.

La regla de fondo es una sola:

> Cada frase, cada decisión visual y cada animación tiene que poder explicarse con algo real de Oscar: un proyecto, un dato, una herramienta que usó o algo que solo él haría.

Si no se puede explicar así, sobra.

---

## 1. Redacción

### 1.1 Palabras y frases prohibidas

Si aparece una de estas, se reescribe con un hecho concreto.

| Español | Inglés | Qué escribir en su lugar |
| --- | --- | --- |
| robusto, robusta | robust | Qué aguanta: “maneja 10 000 pólizas”, “con pruebas de paridad en CI” |
| escalable | scalable | Cuánto escala o no lo digas |
| de vanguardia, moderno, innovador | cutting-edge, modern, innovative | El nombre de la tecnología |
| sofisticado, premium, elegante | sophisticated, premium, elegant | Nada. Que lo demuestre el trabajo |
| extraordinario, increíble | extraordinary, amazing | Nada |
| apasionado por | passionate about | Lo que haces por gusto, con un ejemplo |
| experiencias digitales | digital experiences | “sitios”, “apps”, “el portal B2B de…” |
| soluciones (digitales, integrales) | solutions | El producto concreto |
| optimizar, optimización (sin dato) | optimize | “bajé el costo ocioso en Cloud Run”, “de 3 s a 800 ms” |
| significativamente, notablemente | significantly | El número |
| potenciar, impulsar, elevar | empower, elevate, unlock | Verbo literal: construí, migré, lancé |
| aprovechar al máximo | leverage | usé |
| sin fisuras, fluido | seamless | Nada |
| crucial, fundamental, esencial, vital | crucial, pivotal, vital | Nada, o explica por qué importa |
| fomentar, subrayar, resaltar | foster, underscore, highlight | Verbo literal |
| panorama, ecosistema (abstracto) | landscape, ecosystem | El nombre del sector |
| orientado a resultados, proactivo | results-driven, detail-oriented | Un resultado |
| de manera eficiente, de forma segura | efficiently, securely | Cómo: “con URLs firmadas V4” |
| superar expectativas | exceed expectations | Nada |
| explorar en profundidad | delve into | Nada |

### 1.2 Estructuras prohibidas

- **Coletilla en gerundio que afirma impacto.** “…, mejorando significativamente la experiencia de usuario.” Corta la frase antes de la coma o pon el dato.
- **Regla de tres por reflejo.** “Calidad del código, experiencia del usuario e innovación continua.” Si son dos cosas, escribe dos. Si son cuatro, cuatro.
- **“No solo X, sino Y” / “No es X, es Y”.** Afirma Y directamente.
- **Revelación tras dos puntos.** “Mi secreto: el detalle.” Escribe la frase completa.
- **Justificación forzada.** Unir un hobby al trabajo (“lo que me aporta creatividad que aplico en mis proyectos”). Si el hobby es interesante, cuéntalo y ya.
- **Cadenas de sustantivos.** “Desarrollo de…, creación de…, gestión de…, e integración de…”. Usa primera persona y verbos: construí, diseñé, lancé, migré.
- **Evitar “es”.** “Funge como”, “se erige como”, “serves as”, “stands as”. Usa “es”.
- **Grandilocuencia.** “Un testimonio de”, “juega un papel vital”, “sienta las bases”.
- **Atribución vaga.** “Los expertos coinciden”, “según la industria”.
- **Raya larga (—) como muletilla.** Usa coma, punto o paréntesis. La raya se permite solo en rangos tipográficos si el diseño lo pide, nunca como pausa dramática.
- **Comillas para etiquetas inventadas.** No pongas entre comillas un término que tú mismo acabas de crear.

### 1.3 Huellas de estructura

- **Bloques idénticos.** Si todas las viñetas miden 15–18 palabras y empiezan igual, varía. Un humano escribe con irregularidad.
- **Cuatro viñetas seguidas con verbos de LinkedIn** (lideré, impulsé, orquesté, encabecé). Mezcla con verbos simples.
- **Impacto sin números, herramientas ni contexto.** Cada logro necesita al menos uno de los tres.
- **Skills de moda sin evidencia.** Nada en la lista de habilidades que no aparezca en un puesto o proyecto.
- **Traducción literal.** El inglés se escribe en inglés natural (“Built…”, “Shipped…”, “Led the rebrand…”), no se traduce frase a frase del español (“Development of scalable…”).
- **Dos voces distintas.** La web, el PDF y LinkedIn tienen que sonar a la misma persona.
- **Cifras infladas o sin respaldo.** Nada de “15+ proyectos” si no se pueden enseñar 15.
- **Formato de chat.** Negritas en exceso, “**Etiqueta:** texto” en cada viñeta, títulos En Mayúscula Cada Palabra, emojis como viñetas, restos tipo `[Nombre de la empresa]`.

### 1.4 Prueba rápida de un texto

Antes de aceptar cualquier texto, responde:

1. ¿Lo podría firmar otro desarrollador sin cambiar nada? → reescribir.
2. ¿Tiene un nombre propio, un número o una herramienta concreta? → si no, reescribir.
3. ¿Leído en voz alta suena a Oscar hablando? → si no, reescribir.
4. ¿Aparece alguna palabra de la tabla 1.1? → reescribir.

---

## 2. Diseño visual

### 2.1 Prohibido

| Patrón | Por qué |
| --- | --- |
| Gradientes violeta/índigo/azul sobre blanco, acentos `#6366F1`, `#8B5CF6`, `#818CF8` (paleta por defecto de Tailwind) | Es el color que un modelo pone cuando no hay marca |
| Orbes de gradiente difuminados, auroras, brillos, texto con glow | Decoración que no comunica nada |
| Cuadrícula de fondo con máscara radial, partículas, “líneas de energía” | Plantilla de landing SaaS |
| Glassmorphism (`backdrop-filter: blur`) por defecto | Default de shadcn/Tailwind |
| Navbar tipo píldora flotante con indicador deslizante | Plantilla repetida* |
| Hero centrado a pantalla completa con el nombre gigante y un punto de color | El hero más común del portafolio generado |
| Badge tipo píldora encima del H1 (“Disponible para proyectos”) | Plantilla SaaS |
| Eyebrow en mayúsculas + título grande centrado en **todas** las secciones | Ritmo mecánico |
| Fila de métricas “3+ años · 15+ proyectos · 5+ tecnologías” | Cifras de relleno* |
| Maquetas de navegador con bloques grises y tres puntos | Relleno que admite no tener capturas* |
| Avatares con inicial en cuadros de color en lugar de logos | Plantilla |
| Tres tarjetas idénticas con icono + título + texto | Layout de features genérico |
| `rounded-2xl` + `shadow-lg` + `p-6` en todo | Jerarquía plana, defaults sin tocar |
| Tarjetas dentro de tarjetas, puntos de estado decorativos | Sin significado |
| Un color de acento distinto por tarjeta | El énfasis se anula |
| Emojis como iconos o viñetas | Sustituye un sistema de iconos |
| Ratón animado de “scroll” | Cliché de portafolio* |
| Inter, Roboto, Open Sans, Lato, Montserrat, Poppins, Space Grotesk | Tipografías de convergencia |
| Crema `#F4F1EA` + serif + terracota; casi negro + un solo neón; columnas de periódico con filetes | Son los nuevos defaults “anti-IA”, igual de genéricos |
| Todo centrado | Falta de decisión de layout |
| Copy tipo “Transforma”, “Desbloquea”, “Lleva tu X al siguiente nivel” | Verbos de marketing de stock |

\* Observación de la comunidad sin fuente formal; se mantiene porque en este sitio ya se vio.

### 2.2 Obligatorio

- **Una idea visual tomada del trabajo real de Oscar.** Ejemplo: diagramas de flujo de datos, nodos y aristas enrutadas (su trabajo en el motor de grafos Rust/WASM y el editor de DFD de ArgusEye), o el trazo de línea de sus tatuajes. La idea se decide en la fase de diseño y se documenta.
- **Paleta propia** de 4–6 tokens con contraste AA verificado en ambos temas. Neutros con un leve sesgo hacia el acento, no gris puro.
- **Tipografía con carácter** fuera de la lista prohibida, emparejada con intención (display + texto + mono para datos).
- **Capturas y logos reales.** Si un proyecto está bajo NDA, se usa una captura difuminada o un diagrama propio, nunca una maqueta vacía.
- **Estructura que codifica información.** Numeración solo si hay secuencia real; eyebrows solo si aportan algo.
- **Layout variado** entre secciones según su contenido (una línea de tiempo no se ve como una rejilla de proyectos).

---

## 3. Animación

“Animaciones pro” significa **pocas, coreografiadas y con propósito**, no muchas.

### 3.1 Prohibido

- Fade-up en cada elemento al hacer scroll.
- Entrada escalonada de todo el hero con retrasos encadenados de más de 600 ms en total.
- Smooth-scroll que secuestra la rueda (scroll-jacking).
- Parallax de ratón sobre decoración.
- Cursor personalizado que sigue al ratón.
- Animaciones infinitas en bucle fuera del momento firma.
- Texto que se escribe solo (typewriter) o que rota palabras (“Soy desarrollador | diseñador | creador”).
- Contadores que suben de 0 a N.
- Carruseles con autoplay.
- Contenido que queda en `opacity: 0` hasta que un observer lo dispara.

### 3.2 Obligatorio

- **Un momento firma** ligado a la idea visual (por ejemplo, el diagrama que se traza y enruta sus aristas al cargar).
- **Micro-interacciones** con significado: estado de enviado del formulario, cambio de idioma, cambio de tema, hover que revela información real.
- Solo `transform` y `opacity` (o `clip-path`), 60 fps en un móvil de gama media.
- `prefers-reduced-motion`: versión estática completa, también en JS y canvas.
- El contenido es legible sin JavaScript y sin esperar animaciones.
- Duraciones de 150–400 ms para UI y hasta 1.2 s para el momento firma.

---

## 4. Código

### 4.1 Prohibido

- Comentarios que repiten el código o adjetivos en comentarios (“Ultra Premium”, “Smooth”, “Beautiful”).
- Banners decorativos (`// ======== SECTION ========`).
- Código muerto: estilos, funciones, claves de traducción o imágenes sin uso.
- Tokens o variables usados sin definir (como `--radius-full` en la versión anterior).
- Comentarios que contradicen el código (“Apple blue #0071e3” sobre un acento violeta).
- `try/catch` y comprobaciones de null alrededor de código que no puede fallar.
- Nombres genéricos: `data`, `info`, `result`, `handleStuff`.
- Afirmaciones de rendimiento sin medir (“optimized”, “blazing fast”).
- Documentos de trabajo del agente en el repo (planes, `WORKING_FILE.md`, logs de fases).
- Reimplementar utilidades que ya existen en el proyecto.

### 4.2 Obligatorio

- Comentarios solo para explicar **por qué**, nunca qué.
- Lint, typecheck y detector de código muerto en CI.
- Cada PR pasa la checklist de la sección 5.

---

## 5. Checklist de revisión

Copiar en cada PR que toque contenido, estilos o animación.

```md
### Anti-patrones IA
- [ ] Ningún texto usa palabras de la tabla 1.1 (ES ni EN)
- [ ] Cada logro tiene un número, un nombre propio o una herramienta concreta
- [ ] Sin coletillas en gerundio, reglas de tres reflejas ni "no solo X sino Y"
- [ ] Sin rayas largas como pausa
- [ ] El inglés está escrito en inglés natural, no traducido frase a frase
- [ ] Sin colores, fondos o componentes de la tabla 2.1
- [ ] Imágenes y logos reales, sin maquetas vacías
- [ ] Animaciones: ninguna de la lista 3.1; reduced-motion probado
- [ ] Sin comentarios decorativos, código muerto ni tokens sin definir
```

---

## Fuentes

**Redacción**
- Wikipedia, Signs of AI writing (WikiProject AI Cleanup): https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing
- TechCrunch sobre la guía de Wikipedia: https://techcrunch.com/2025/11/20/the-best-guide-to-spotting-ai-writing-comes-from-wikipedia/
- Reed, Seven ways to spot AI on a CV: https://www.reed.com/articles/seven-ways-to-spot-ai-on-a-cv-or-covering-letter
- Simplify, Can recruiters tell if AI wrote your resume?: https://simplify.jobs/blog/can-recruiters-tell-if-ai-wrote-your-resume
- Michael Page, How to recognise an AI-generated CV: https://www.michaelpage.co.uk/recruitment-expertise/management-advice/how-to-recognise-ai-generated-cv
- Hiration, AI-written resume detection: https://www.hiration.com/blog/ai-written-resume-detection/
- Harvey Nash, Could you spot an AI-generated CV?: https://www.harveynash.co.uk/latest-news/recruitment-trends-ai-assisted-cvs-could-you-spot-an-ai-generated-cv-
- Instant Offices (dato del 33 %): https://www.instantoffices.com/blog/featured/can-recruiters-spot-ai-generated-cvs/
- Vandal / El Español, ¿Usas IA para tu currículum?: https://vandal.elespanol.com/noticia/r33319/usas-ia-para-hacer-tu-curriculum-los-reclutadores-lo-saben-y-asi-puedes-evitar-que-te-descarten-por-usar-chatgpt
- INESEM, Cómo saber si un texto está generado con ChatGPT: https://www.inesem.es/revistadigital/gestion-empresarial/como-saber-si-un-texto-esta-generado-en-chatgpt
- Plus AI, palabras más usadas por ChatGPT: https://plusai.com/es/blog/the-most-overused-chatgpt-words

**Diseño y código**
- Anthropic, Improving frontend design through skills: https://claude.com/blog/improving-frontend-design-through-skills
- Why does AI make everything blue/indigo: https://chaiovercode.substack.com/p/why-does-ai-make-everything-blue
- The Fountain Institute, Signs of a vibe-coded UI: https://www.thefountaininstitute.com/blog/signs-vibe-coded-ui
- CodeMySpec, Vibe-coded websites look the same: https://codemyspec.com/blog/vibe-coded-websites-look-the-same
- Managed Code, Why AI websites look the same: https://managed-code.com/blog-post/why-ai-websites-look-the-same
- Kitemetric, Spotting AI-generated code: https://kitemetric.com/blogs/spotting-ai-generated-python-code-7-key-indicators
