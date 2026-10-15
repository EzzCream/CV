// Validación del formulario en el navegador, sin Zod para no cargarlo en el cliente (PERF-03).
// El servidor vuelve a validar con contactSchema (lib/contact.ts).

export const reasons = ['job', 'freelance', 'other'] as const;

export type Field = 'name' | 'email' | 'message';
export type FieldError = 'required' | 'nameLength' | 'email' | 'messageShort' | 'messageLong';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function fieldErrors(input: Record<Field, string>): Partial<Record<Field, FieldError>> {
  const out: Partial<Record<Field, FieldError>> = {};
  const name = input.name.trim(), email = input.email.trim(), message = input.message.trim();
  if (!name) out.name = 'required';
  else if (name.length < 2 || name.length > 80) out.name = 'nameLength';
  if (!email) out.email = 'required';
  else if (!EMAIL.test(email) || email.length > 200) out.email = 'email';
  if (!message) out.message = 'required';
  else if (message.length < 20) out.message = 'messageShort';
  else if (message.length > 3000) out.message = 'messageLong';
  return out;
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Partial<Record<Field, FieldError>> }
  | { ok: false; error: 'rate' | 'server' | 'forbidden' | 'captcha' };
