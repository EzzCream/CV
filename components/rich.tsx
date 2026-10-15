import { Fragment } from 'react';
import type { Profile } from '@/content/schema';

// marcado mínimo dentro de los textos del JSON: <code>...</code>, <tattoo>...</tattoo>, <pins>...</pins>
export function Rich({ text, links }: { text: string; links: Profile['links'] }) {
  const parts = text.split(/(<(code|tattoo|pins)>.*?<\/\2>)/g);
  const out: React.ReactNode[] = [];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i] ?? '';
    const m = /^<(code|tattoo|pins)>(.*?)<\/\1>$/.exec(part);
    if (m) {
      const [, tag, inner] = m;
      out.push(
        tag === 'code' ? (
          <code key={i} className="mono">{inner}</code>
        ) : (
          <a key={i} href={links[tag as 'tattoo' | 'pins']} target="_blank" rel="noopener noreferrer">
            {inner}
          </a>
        ),
      );
      i++; // salta el grupo capturado con el nombre de la etiqueta
    } else if (part) out.push(<Fragment key={i}>{part}</Fragment>);
  }
  return <>{out}</>;
}
