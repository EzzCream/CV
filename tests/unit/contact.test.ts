import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact';
import { fieldErrors } from '@/lib/contact-fields';
import { buildEmail } from '@/lib/mail';
import { buildConfirmation } from '@/lib/mail-confirmation';

const valid = { name: 'Ana López', email: 'ana@example.com', reason: 'job', message: 'Hola Oscar, tenemos una vacante para ti.', startedAt: 1, locale: 'es' };

describe('contactSchema', () => {
  it('acepta un mensaje válido', () => expect(contactSchema.safeParse(valid).success).toBe(true));
  it('recorta espacios del correo', () => expect(contactSchema.parse({ ...valid, email: '  ana@example.com ' }).email).toBe('ana@example.com'));
  it('rechaza mensajes cortos con la clave de error del diccionario', () => {
    const r = contactSchema.safeParse({ ...valid, message: 'corto' });
    expect(r.success).toBe(false);
    expect(r.error?.issues[0]?.message).toBe('messageShort');
  });
  it('rechaza motivos fuera de la lista', () => expect(contactSchema.safeParse({ ...valid, reason: 'spam' }).success).toBe(false));
});

describe('fieldErrors', () => {
  it('marca vacíos como requeridos', () => expect(fieldErrors({ name: ' ', email: '', message: '' })).toEqual({ name: 'required', email: 'required', message: 'required' }));
  it('valida formato y longitudes', () => expect(fieldErrors({ name: 'A', email: 'no-es-correo', message: 'x'.repeat(3001) })).toEqual({ name: 'nameLength', email: 'email', message: 'messageLong' }));
});

describe('buildEmail', () => {
  it('escapa HTML y arma el asunto', () => {
    const m = buildEmail({ name: 'Ana\r\nBcc: x@y.z', email: 'ana@example.com', reason: 'freelance', message: '<script>alert(1)</script>', locale: 'en' });
    expect(m.subject).toBe('[Portafolio] Proyecto freelance: Ana Bcc: x@y.z');
    expect(m.subject).not.toMatch(/[\r\n]/);
    expect(m.html).not.toContain('<script>');
    expect(m.html).toContain('&lt;script&gt;');
    expect(m.text).toContain('<script>alert(1)</script>');
  });
});

describe('buildConfirmation', () => {
  const now = new Date('2026-10-14T21:50:00-06:00');
  it('saluda por el primer nombre, en el idioma del sitio', () => {
    const es = buildConfirmation({ name: 'Ana López', reason: 'job', locale: 'es', now });
    expect(es.subject).toBe('Recibí tu mensaje');
    expect(es.html).toContain('Hola, Ana.');
    expect(es.text).toContain('Motivo: Oferta de empleo');
    const en = buildConfirmation({ name: 'Ana López', reason: 'freelance', locale: 'en', now });
    expect(en.subject).toBe('I got your message');
    expect(en.html).toContain('Hi, Ana.');
  });

  it('escapa el nombre y no acepta saltos de línea', () => {
    const m = buildConfirmation({ name: '<img src=x onerror=alert(1)>\r\nBcc', reason: 'other', locale: 'es', now });
    expect(m.html).not.toContain('<img src=x');
    expect(m.text).not.toMatch(/\r/);
  });

  it('no lleva texto de relleno ni fuentes remotas que los filtros lean como spam', () => {
    const m = buildConfirmation({ name: 'Ana', reason: 'job', locale: 'es', now });
    expect((m.html.match(/<span/g) ?? []).length).toBeLessThan(10);
    expect(m.html).toContain('/email/trail.png');
    expect(m.html).not.toContain('fonts.googleapis.com');
  });

  it('solo usa caracteres de teclado en el texto visible', () => {
    const m = buildConfirmation({ name: 'Ana', reason: 'job', locale: 'es', now });
    expect(m.text.match(/[^\x00-\x7FáéíóúüñÁÉÍÓÚÜÑ¿¡]/g)).toBeNull();
  });
});
