import { describe, expect, it } from 'vitest';
import { contactSchema } from '@/lib/contact';
import { fieldErrors } from '@/lib/contact-fields';
import { buildEmail } from '@/lib/mail';

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
