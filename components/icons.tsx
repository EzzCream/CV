import type { Profile } from '@/content/schema';

// íconos de cada empresa en trazo de línea; pathLength=1 permite dibujarlos al aparecer
const ICONS: Record<Profile['experience'][number]['icon'], React.ReactNode> = {
  argus: (
    <>
      <path className="ic" pathLength={1} style={{ strokeLinejoin: 'miter', strokeLinecap: 'butt', strokeWidth: 3.2 }} d="M10 54 L30 9 L50 54" />
      <circle className="dot" cx="30" cy="34" r="3.4" />
    </>
  ),
  pomegranate: (
    <>
      <circle className="ic" pathLength={1} cx="30" cy="38" r="20" />
      <path className="ic" pathLength={1} d="M22 20 L23 10 L27 16 L30 7 L33 16 L37 10 L38 20" />
      <path className="ic dots" d="M24 36h.1M34 34h.1M29 44h.1M38 42h.1M21 45h.1" />
    </>
  ),
  sprout: (
    <>
      <path className="ic" pathLength={1} d="M30 58 V28" />
      <path className="ic" pathLength={1} d="M30 38 C18 36 13 26 15 18 C25 20 30 28 30 38 Z" />
      <path className="ic" pathLength={1} d="M30 31 C42 29 47 19 45 12 C35 14 30 22 30 31 Z" />
      <path className="ic" pathLength={1} d="M12 58 H48" />
    </>
  ),
  star: (
    <>
      <path className="ic" pathLength={1} d="M30 6 L35 27 L56 32 L35 37 L30 58 L25 37 L4 32 L25 27 Z" />
      <circle className="ic" pathLength={1} cx="30" cy="32" r="4" />
    </>
  ),
  bolt: <path className="ic" pathLength={1} d="M34 4 L14 36 H29 L24 60 L46 26 H31 Z" />,
};

export function CompanyIcon({ icon, label }: { icon: keyof typeof ICONS; label: string }) {
  return (
    <svg className="xi" viewBox="0 0 60 64" role="img" aria-label={label}>
      <title>{label}</title>
      {ICONS[icon]}
    </svg>
  );
}
