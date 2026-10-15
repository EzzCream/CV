# Portafolio de Oscar Rodríguez

Antes de escribir textos, diseñar, animar o programar cualquier cosa en este repo:

1. Lee [specs/ANTI-PATRONES-IA.md](specs/ANTI-PATRONES-IA.md). Es obligatorio: nada de lo que entre al sitio puede caer en esos patrones. Pasa la checklist de su sección 5 antes de dar un cambio por terminado.
2. Sigue [specs/REQUERIMIENTOS.md](specs/REQUERIMIENTOS.md). Cita los IDs (`FUN-03`, `MAIL-04`...) en commits y PRs.

Reglas de contenido que no se negocian:

- La fuente de verdad es `referencia-cv/` (local, ignorada por git). No inventes datos, métricas ni fechas.
- Canwe y "Freelancer" no aparecen en la página.
- No se publican métricas internas ni capturas de ArgusEye.
- No publiques nombres de repos internos, compañeros ni detalles confidenciales de ArgusEye o Rommaana.
- `referencia-cv/` nunca se versiona ni se copia a `public/`. Los PDFs públicos de `public/cv/` no salen de ahí: se generan con `npm run cv:pdf` desde `content/` (FUN-13). Si cambia el contenido, se regeneran.
