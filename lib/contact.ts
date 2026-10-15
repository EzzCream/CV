import { z } from 'zod';

export const reasons = ['job', 'freelance', 'other'] as const;

// el mismo esquema valida en el navegador y en el servidor
export const contactSchema = z.object({
  name: z.string().trim().min(2, 'nameLength').max(80, 'nameLength'),
  email: z.string().trim().max(200, 'email').pipe(z.email('email')),
  reason: z.enum(reasons),
  message: z.string().trim().min(20, 'messageShort').max(3000, 'messageLong'),
  website: z.string().max(200).optional().default(''),
  startedAt: z.number().int().nonnegative(),
  token: z.string().max(4096).optional(),
  locale: z.enum(['es', 'en']).default('es'),
});

export type FieldError = 'required' | 'nameLength' | 'email' | 'messageShort' | 'messageLong';

export function fieldErrors(input: { name: string; email: string; message: string }): Partial<Record<'name' | 'email' | 'message', FieldError>> {
  const out: Partial<Record<'name' | 'email' | 'message', FieldError>> = {};
  const name = input.name.trim(), email = input.email.trim(), message = input.message.trim();
  if (!name) out.name = 'required';
  else if (name.length < 2 || name.length > 80) out.name = 'nameLength';
  if (!email) out.email = 'required';
  else if (!z.email().safeParse(email).success) out.email = 'email';
  if (!message) out.message = 'required';
  else if (message.length < 20) out.message = 'messageShort';
  else if (message.length > 3000) out.message = 'messageLong';
  return out;
}

export type ContactResponse =
  | { ok: true }
  | { ok: false; error: 'validation'; fields: Partial<Record<'name' | 'email' | 'message', FieldError>> }
  | { ok: false; error: 'rate' | 'server' | 'forbidden' | 'captcha' };
