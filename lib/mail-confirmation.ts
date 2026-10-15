import type { Locale } from './content';
import { getDictionary, profile } from './content';
import { fill } from './format';

// Confirmación al remitente (MAIL-06): texto fijo del diccionario, nunca el mensaje que escribió.
// HTML de correo: tablas y estilos en línea para Gmail, Apple Mail y Outlook. La banda del rastro es una
// imagen (scripts/build-email-assets.mjs): como texto, los caracteres aleatorios parecían spam.

type Input = { name: string; reason: 'job' | 'freelance' | 'other'; locale: Locale; now?: Date };

const C = { paper: '#E5E7E6', card: '#FFFFFF', ink: '#0C0E10', muted: '#4F5559', line: '#C4C9C8', red: '#B5121B', term: '#0C0E10', termText: '#E5E7E6', termMuted: '#9AA19F', termRed: '#FF5C63' };
const SERIF = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS = "'IBM Plex Sans', -apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";
const MONO = "'IBM Plex Mono', Menlo, Consolas, 'Courier New', monospace";
const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);


const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

function receivedAt(locale: Locale, now: Date) {
  const date = new Intl.DateTimeFormat(locale === 'es' ? 'es-MX' : 'en-US', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Mexico_City' }).format(now);
  return `${date} (CDMX)`;
}

export function buildConfirmation({ name, reason, locale, now = new Date() }: Input) {
  const d = getDictionary(locale), t = d.contact.confirmation;
  const first = oneLine(name).split(' ')[0] ?? '';
  const greeting = fill(t.greeting, { name: first });
  const reasonLabel = d.contact.form.reasons[reason];
  const when = receivedAt(locale, now);
  const site = profile.person.site;
  const links = [
    { label: t.site, href: `${site}/${locale}` },
    { label: 'GitHub', href: profile.links.github },
    { label: 'LinkedIn', href: profile.links.linkedin },
  ];

  const text = [
    greeting,
    '',
    t.body,
    '',
    `${t.reason}: ${reasonLabel}`,
    `${t.received}: ${when}`,
    '',
    t.replyHint,
    '',
    t.signoff,
    profile.person.fullName,
    t.role,
    `${site.replace('https://', '')}`,
    '',
    '--',
    t.footer,
  ].join('\n');

  const e = escapeHtml;
  const linkHtml = links
    .map((l) => `<a href="${e(l.href)}" style="color:${C.ink};text-decoration:none;border-bottom:2px solid ${C.red};padding-bottom:1px;font-family:${MONO};font-size:13px;font-weight:500;">${e(l.label)}</a>`)
    .join(`<span style="color:${C.line};padding:0 10px;">|</span>`);

  const html = `<!doctype html>
<html lang="${locale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${e(t.subject)}</title>
<style>
  @media (max-width: 620px) {
    .px { padding-left: 24px !important; padding-right: 24px !important; }
    .hello { font-size: 42px !important; }
  }
</style>
</head>
<body style="margin:0;padding:0;background:${C.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.paper};">${e(t.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.paper};">
<tr><td align="center" style="padding:40px 12px 32px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">

    <tr><td style="padding:0 4px 18px;">
      <a href="${e(site)}" style="text-decoration:none;color:${C.ink};font-family:${MONO};font-size:13px;font-weight:500;">oscar.rodriguez<span style="display:inline-block;width:8px;height:14px;background:${C.red};margin-left:4px;vertical-align:-2px;"></span></a>
    </td></tr>

    <tr><td style="background:${C.card};border:1px solid ${C.line};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr><td style="background:${C.term};line-height:0;font-size:0;"><img src="${e(site)}/email/trail.png" width="600" height="214" alt="" style="display:block;width:100%;max-width:600px;height:auto;border:0;outline:none;"></td></tr>
        <tr><td class="px" style="padding:44px 48px 8px;">
          <p style="margin:0 0 20px;font-family:${MONO};font-size:12px;color:${C.muted};"><b style="color:${C.red};font-weight:500;">01</b>&nbsp;&nbsp;// ${e(t.label)}</p>
          <h1 class="hello" style="margin:0 0 20px;font-family:${SERIF};font-weight:500;font-size:54px;line-height:1;color:${C.ink};">${e(greeting)}</h1>
          <p style="margin:0 0 28px;font-family:${SANS};font-size:16px;line-height:1.6;color:${C.ink};">${e(t.body)}</p>
        </td></tr>

        <tr><td class="px" style="padding:0 48px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${C.term};">
            <tr><td style="padding:20px 22px;font-family:${MONO};font-size:13px;line-height:1.75;color:${C.termText};">
              <span style="color:${C.termRed};">$</span> send --to oscar<br>
              <span style="color:${C.termRed};">&gt;</span> 200 OK<br>
              <span style="color:${C.termMuted};">${e(t.reason.toLowerCase())}:</span> ${e(reasonLabel)}<br>
              <span style="color:${C.termMuted};">${e(t.received.toLowerCase())}:</span> ${e(when)}
            </td></tr>
          </table>
        </td></tr>

        <tr><td class="px" style="padding:28px 48px 0;">
          <p style="margin:0 0 32px;font-family:${SANS};font-size:15px;line-height:1.6;color:${C.muted};">${e(t.replyHint)}</p>
          <p style="margin:0 0 4px;font-family:${SANS};font-size:15px;color:${C.muted};">${e(t.signoff)}</p>
          <p style="margin:0 0 4px;font-family:${SERIF};font-weight:500;font-size:26px;line-height:1.15;color:${C.ink};">${e(profile.person.fullName)}</p>
          <p style="margin:0 0 28px;font-family:${MONO};font-size:12px;color:${C.muted};">${e(t.role)}</p>
        </td></tr>

        <tr><td class="px" style="padding:20px 48px 36px;border-top:1px solid ${C.line};">
          ${linkHtml}
        </td></tr>
      </table>
    </td></tr>

    <tr><td style="padding:20px 4px 0;font-family:${SANS};font-size:12px;line-height:1.6;color:${C.muted};">${e(t.footer)}</td></tr>
  </table>
</td></tr>
</table>
</body>
</html>`;

  return { subject: t.subject, text, html };
}
