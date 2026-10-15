import { Cormorant_Garamond, IBM_Plex_Mono, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';

// solo se precargan las fuentes del primer pantallazo: el nombre (display) y el texto (body)
export const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['500'], style: ['normal', 'italic'], variable: '--font-display', display: 'swap' });
export const body = IBM_Plex_Sans({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-body', display: 'swap' });
export const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap', preload: false });
// fuente del rastro de código; el canvas necesita el nombre real de la familia
export const trail = JetBrains_Mono({ subsets: ['latin'], weight: ['600'], variable: '--font-trail', display: 'swap', preload: false });

