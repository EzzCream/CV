import { z } from 'zod';
import { reasons } from './contact-fields';

// validación del servidor; los mensajes son claves de contact.errors en los diccionarios
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
