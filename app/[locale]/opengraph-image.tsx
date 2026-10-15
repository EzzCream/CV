import { ImageResponse } from 'next/og';
import { getDictionary, isLocale, locales, profile } from '@/lib/content';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Oscar Antonio Rodríguez Carmona | Full Stack Developer';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

// misma composición que el hero: papel, tinta, un bloque rojo y una fila de código
export default async function OpengraphImage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const dict = getDictionary(isLocale(locale) ? locale : 'es');
  const code = '{ } [ ] < / > = + * ; 0 1 # & $ @ { } < / > = + * ; 0 1 # & $ @';
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', background: '#E5E7E6', color: '#0C0E10', padding: 72, fontFamily: 'serif' }}>
        <div style={{ display: 'flex', fontSize: 22, fontFamily: 'monospace', color: '#4F5559' }}>
          <span>oscar.rodriguez</span>
          <span style={{ width: 12, height: 26, background: '#B5121B', marginLeft: 6 }} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 150, lineHeight: 1, letterSpacing: -4 }}>Oscar</div>
          <div style={{ fontSize: 64, lineHeight: 1.1, fontStyle: 'italic' }}>{profile.person.lastName}</div>
          <div style={{ fontSize: 28, marginTop: 28, fontFamily: 'sans-serif', color: '#4F5559', maxWidth: 820 }}>{`${dict.meta.description.split('.')[0]}.`}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 22, fontFamily: 'monospace', color: '#C4C9C8' }}>{code}</div>
      </div>
    ),
    size,
  );
}
