import localFont from 'next/font/local';

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
