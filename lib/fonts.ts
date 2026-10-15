import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

export const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500', '600'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
export const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' });
export const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });
// fuente del rastro de código; el canvas necesita el nombre real de la familia
export const trail = JetBrains_Mono({ subsets: ['latin'], weight: ['600'], variable: '--font-trail', display: 'swap' });

// El PDF del CV necesita fuentes estáticas: Chrome incrusta las variables (las de Google) como Type3
// y los lectores ATS extraen el texto partido. Mismas familias, archivos estáticos de Fontsource.
export const cvBody = localFont({
  src: [
    { path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2', weight: '400' },
    { path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-500-normal.woff2', weight: '500' },
    { path: '../node_modules/@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-600-normal.woff2', weight: '600' },
  ],
  variable: '--font-cv-body',
});
export const cvDisplay = localFont({
  src: '../node_modules/@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2',
  weight: '600',
  variable: '--font-cv-display',
});
