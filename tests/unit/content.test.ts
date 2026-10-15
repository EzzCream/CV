import { describe, expect, it } from 'vitest';
import es from '@/content/es.json';
import en from '@/content/en.json';
import { getDictionary, profile } from '@/lib/content';
import { formatRange } from '@/lib/format';

// rutas de todas las hojas del JSON, p. ej. "contact.form.name"
function keys(value: unknown, prefix = ''): string[] {
  if (Array.isArray(value) || value === null || typeof value !== 'object') return [prefix];
  return Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k));
}
const shape = (obj: unknown) => keys(obj).map((k) => k.replace(/\.\d+(?=\.|$)/g, '.#')).sort();

describe('diccionarios', () => {
  it('es y en tienen exactamente las mismas claves', () => {
    expect(shape(en).filter((k) => !k.startsWith('about.paragraphs'))).toEqual(shape(es).filter((k) => !k.startsWith('about.paragraphs')));
  });

  it('cada experiencia, proyecto y estudio del perfil tiene texto en ambos idiomas', () => {
    for (const locale of ['es', 'en'] as const) {
      const d = getDictionary(locale);
      for (const e of profile.experience) {
        expect(d.experience.items[e.id], `${locale}: ${e.id}`).toBeDefined();
        expect(d.experience.icons[e.icon], `${locale}: icono ${e.icon}`).toBeDefined();
      }
      for (const p of profile.projects) {
        expect(d.projects.items[p.id], `${locale}: ${p.id}`).toBeDefined();
        for (const n of p.architecture.nodes) expect(d.projects.items[p.id]?.nodes[n.id], `${locale}: ${p.id}/${n.id}`).toBeDefined();
      }
      for (const e of profile.education) expect(d.education.items[e.id]).toBeDefined();
      for (const c of profile.courses) expect(d.education.courses[c.id]).toBeDefined();
      for (const g of profile.skills) {
        expect(d.skills.groups[g.id]).toBeDefined();
        for (const it of g.items) if (it.id) expect(d.skills.labels[it.id]).toBeDefined();
      }
    }
  });

  it('no menciona puestos que no están en el CV', () => {
    const all = JSON.stringify([profile, es, en]).toLowerCase();
    expect(all).not.toContain('canwe');
    expect(all).not.toContain('freelancer');
  });

  it('las secciones tienen ids únicos por idioma', () => {
    for (const locale of ['es', 'en'] as const) {
      const ids = Object.values(getDictionary(locale).sections);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('formatRange', () => {
  const d = getDictionary('es');
  it('trabajo actual', () => expect(formatRange('es', d, '2025-11', null)).toBe(`nov 2025 - ${d.ui.present}`));
  it('mismo año abrevia el inicio', () => expect(formatRange('es', d, '2024-03', '2024-10')).toBe('mar - oct 2024'));
  it('años distintos', () => expect(formatRange('en', getDictionary('en'), '2025-02', '2026-09')).toBe('Feb 2025 - Sep 2026'));
  it('solo años con duración', () => expect(formatRange('es', d, '2022', '2023', 4)).toBe('2022 - 2023, 4 meses'));
});
