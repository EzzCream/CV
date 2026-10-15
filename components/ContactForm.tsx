'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { Dictionary } from '@/content/schema';
import type { Locale } from '@/lib/content';
import { fieldErrors, reasons, type ContactResponse, type FieldError } from '@/lib/contact';
import { fill } from '@/lib/format';

type Field = 'name' | 'email' | 'message';
type Props = { locale: Locale; form: Dictionary['contact']['form']; errors: Dictionary['contact']['errors'] };

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: { sitekey: string; callback: (t: string) => void; 'expired-callback': () => void; language?: string }) => string;
      reset: (id?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const IDS: Record<Field, string> = { name: 'f-name', email: 'f-email', message: 'f-msg' };

export function ContactForm({ locale, form, errors }: Props) {
  const [fields, setFields] = useState<Partial<Record<Field, FieldError>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [message, setMessage] = useState('');
  const [sentTo, setSentTo] = useState('');
  const startedAt = useRef(0);
  const token = useRef<string | undefined>(undefined);
  const widget = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | undefined>(undefined);
  const [turnstileReady, setTurnstileReady] = useState(false);

  // marca de tiempo para el filtro de envíos instantáneos (bots)
  useEffect(() => {
    startedAt.current = Date.now();
  }, [status]);

  useEffect(() => {
    if (!SITE_KEY || !turnstileReady || !widget.current || !window.turnstile || status === 'sent') return;
    widget.current.replaceChildren();
    widgetId.current = window.turnstile.render(widget.current, {
      sitekey: SITE_KEY,
      language: locale,
      callback: (t) => (token.current = t),
      'expired-callback': () => (token.current = undefined),
    });
  }, [turnstileReady, status, locale]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const value = (k: string) => String(fd.get(k) ?? '');
    const input = { name: value('name'), email: value('email'), message: value('message') };
    const errs = fieldErrors(input);
    setFields(errs);
    setMessage('');
    const first = (Object.keys(IDS) as Field[]).find((k) => errs[k]);
    if (first) return document.getElementById(IDS[first])?.focus();

    setStatus('sending');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, reason: value('reason'), website: value('website'), startedAt: startedAt.current, token: token.current, locale }),
      });
      const data = (await res.json().catch(() => ({ ok: false, error: 'server' }))) as ContactResponse;
      if (data.ok) {
        setSentTo(input.email.trim());
        setStatus('sent');
        return;
      }
      if (data.error === 'validation') setFields(data.fields);
      setMessage(data.error === 'rate' ? errors.rateLimited : data.error === 'validation' ? '' : errors.server);
    } catch {
      setMessage(errors.network);
    }
    token.current = undefined;
    if (widgetId.current) window.turnstile?.reset(widgetId.current);
    setStatus('idle');
  }

  if (status === 'sent')
    return (
      <div className="ok" role="status">
        <pre>
          <b>$</b> send --to oscar{'\n'}
          <b>&gt;</b> 200 OK
        </pre>
        <p style={{ margin: 0, fontSize: '1.05rem' }}>{fill(form.success, { email: sentTo })}</p>
        <button className="btn" type="button" onClick={() => setStatus('idle')}>
          {form.sendAnother}
        </button>
      </div>
    );

  const err = (k: Field) => (fields[k] ? errors[fields[k]] : '');
  return (
    <form onSubmit={onSubmit} noValidate>
      {SITE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="lazyOnload" onReady={() => setTurnstileReady(true)} />}
      <div className="f2">
        <div className="f">
          <label htmlFor="f-name">{form.name}</label>
          <input id="f-name" name="name" autoComplete="name" maxLength={80} aria-invalid={!!fields.name} aria-describedby="e-name" />
          <span className="err" id="e-name">{err('name')}</span>
        </div>
        <div className="f">
          <label htmlFor="f-email">{form.email}</label>
          <input id="f-email" name="email" type="email" autoComplete="email" maxLength={200} aria-invalid={!!fields.email} aria-describedby="e-email" />
          <span className="err" id="e-email">{err('email')}</span>
        </div>
      </div>
      <div className="f">
        <label htmlFor="f-reason">{form.reason}</label>
        <select id="f-reason" name="reason" defaultValue="job">
          {reasons.map((r) => (
            <option key={r} value={r}>
              {form.reasons[r]}
            </option>
          ))}
        </select>
      </div>
      <div className="f">
        <label htmlFor="f-msg">{form.message}</label>
        <textarea id="f-msg" name="message" maxLength={3000} aria-invalid={!!fields.message} aria-describedby="h-msg e-msg" />
        <span className="hint" id="h-msg">{form.messageHint}</span>
        <span className="err" id="e-msg">{err('message')}</span>
      </div>
      <div className="hp" aria-hidden="true">
        <label htmlFor="f-web">{form.honeypot}</label>
        <input id="f-web" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {SITE_KEY && <div ref={widget} />}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn pri" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? form.sending : form.submit}
        </button>
        <span className="fstatus" role="status" aria-live="polite">
          {message}
        </span>
      </div>
    </form>
  );
}
