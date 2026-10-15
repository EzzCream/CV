import { NextResponse, type NextRequest } from 'next/server';

const LOCALES = ['es', 'en'];

// idioma preferido según Accept-Language; español si no hay coincidencia
function preferred(header: string | null): string {
  const ranked = (header ?? '')
    .split(',')
    .map((part) => {
      const [tag = '', q] = part.trim().split(';q=');
      return { lang: tag.toLowerCase().split('-')[0] ?? '', q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q);
  return ranked.find((r) => LOCALES.includes(r.lang))?.lang ?? 'es';
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`))) return;
  const url = request.nextUrl.clone();
  url.pathname = `/${preferred(request.headers.get('accept-language'))}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // fuera: API, internos de Next y cualquier archivo con extensión (imágenes, PDFs, íconos)
  matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
