import { getDictionary } from './content';

type Message = { name: string; email: string; reason: 'job' | 'freelance' | 'other'; message: string; locale: 'es' | 'en' };

const escapeHtml = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c] ?? c);
// un salto de línea en el asunto permitiría inyectar cabeceras
const oneLine = (s: string) => s.replace(/[\r\n\t]+/g, ' ').trim();

// el correo llega a Oscar, así que siempre va en español
export function buildEmail(m: Message) {
  const reason = getDictionary('es').contact.form.reasons[m.reason];
  const subject = `[Portafolio] ${reason}: ${oneLine(m.name)}`.slice(0, 160);
  const meta = [`Nombre: ${oneLine(m.name)}`, `Correo: ${m.email}`, `Motivo: ${reason}`, `Idioma del sitio: ${m.locale}`];
  const text = `${meta.join('\n')}\n\n${m.message}\n`;
  const html = `<div style="font:15px/1.6 system-ui,sans-serif;color:#0C0E10">
<p style="margin:0 0 16px;color:#4F5559">${meta.map(escapeHtml).join('<br>')}</p>
<p style="margin:0;white-space:pre-wrap">${escapeHtml(m.message)}</p>
</div>`;
  return { subject, text, html };
}
