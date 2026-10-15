import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { Resend } from 'resend';
import { profile, siteUrl } from '@/lib/content';
import { contactSchema } from '@/lib/contact';
import type { ContactResponse, Field, FieldError } from '@/lib/contact-fields';
import { buildEmail } from '@/lib/mail';
import { buildConfirmation } from '@/lib/mail-confirmation';

const MAX_BODY = 10 * 1024;
const MIN_FILL_MS = 3000;
const LIMIT = 5;
const WINDOW_MS = 60 * 60 * 1000;

const json = (body: ContactResponse, status = 200) => Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });

/* límite de 5 envíos por IP por hora: Upstash en producción, memoria del proceso como respaldo */
const redisLimiter =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(LIMIT, '1 h'), prefix: 'contact' })
    : null;
const hits = new Map<string, number[]>();
async function allowed(ip: string): Promise<boolean> {
  if (redisLimiter) return (await redisLimiter.limit(ip)).success;
  const now = Date.now(), recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMIT) return false;
  recent.push(now);
  hits.set(ip, recent);
  return true;
}

function sameOrigin(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;
  try {
    const host = new URL(origin).host;
    return host === new URL(req.url).host || host === req.headers.get('host') || host === new URL(siteUrl()).host;
  } catch {
    return false;
  }
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body: new URLSearchParams({ secret, response: token, remoteip: ip }),
  });
  const data = (await res.json().catch(() => ({ success: false }))) as { success?: boolean };
  return data.success === true;
}

export async function POST(req: Request) {
  if (!sameOrigin(req)) return json({ ok: false, error: 'forbidden' }, 403);
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY) return json({ ok: false, error: 'validation', fields: {} }, 413);

  const raw = await req.text();
  if (new TextEncoder().encode(raw).length > MAX_BODY) return json({ ok: false, error: 'validation', fields: {} }, 413);
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: 'validation', fields: {} }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    const fields: Partial<Record<Field, FieldError>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === 'name' || key === 'email' || key === 'message') fields[key] ??= issue.message as FieldError;
    }
    return json({ ok: false, error: 'validation', fields }, 400);
  }
  const data = parsed.data;

  // los bots llenan el campo oculto o envían al instante: se les responde como si todo saliera bien
  if (data.website || Date.now() - data.startedAt < MIN_FILL_MS) return json({ ok: true });

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'local';
  try {
    if (!(await allowed(ip))) return json({ ok: false, error: 'rate' }, 429);
  } catch {
    console.error('[contact] rate limiter unavailable');
  }
  if (!(await verifyTurnstile(data.token, ip))) return json({ ok: false, error: 'captcha' }, 400);

  const { subject, text, html } = buildEmail(data);
  const key = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO, from = process.env.CONTACT_FROM;
  if (!key || !to || !from) {
    if (process.env.NODE_ENV !== 'production') {
      // en desarrollo no se envía nada: solo se confirma que el flujo llegó hasta aquí (sin datos personales)
      console.info(`[contact] simulated send (${data.reason}, ${data.message.length} chars)`);
      return json({ ok: true });
    }
    console.error('[contact] missing RESEND_API_KEY, CONTACT_TO or CONTACT_FROM');
    return json({ ok: false, error: 'server' }, 500);
  }

  const resend = new Resend(key);
  const { error } = await resend.emails.send({ from, to, replyTo: data.email, subject, text, html });
  if (error) {
    console.error(`[contact] resend error: ${error.name}`);
    return json({ ok: false, error: 'server' }, 502);
  }

  // confirmación al remitente (MAIL-06): texto fijo, sin su mensaje; si falla, el envío a Oscar ya salió
  const confirmation = buildConfirmation({ name: data.name, reason: data.reason, locale: data.locale });
  const address = /<([^>]+)>/.exec(from)?.[1] ?? from;
  const sent = await resend.emails.send({
    from: `${profile.person.firstName.split(' ')[0]} ${profile.person.lastName.split(' ')[0]} <${address}>`,
    to: data.email,
    replyTo: to,
    subject: confirmation.subject,
    text: confirmation.text,
    html: confirmation.html,
  });
  if (sent.error) console.error(`[contact] confirmation error: ${sent.error.name}`);
  return json({ ok: true });
}
