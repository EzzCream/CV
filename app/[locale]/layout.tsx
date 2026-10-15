import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { getDictionary, isLocale, locales, profile, siteUrl } from '@/lib/content';
import { body, display, mono, trail } from '@/lib/fonts';
import '../globals.css';

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#E5E7E6' },
    { media: '(prefers-color-scheme: dark)', color: '#0E1012' },
  ],
};

export async function generateMetadata({ params }: Omit<Props, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  const base = siteUrl();
  return {
    metadataBase: new URL(base),
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { es: '/es', en: '/en', 'x-default': '/es' },
    },
    openGraph: {
      type: 'profile',
      url: `/${locale}`,
      title: dict.meta.title,
      description: dict.meta.description,
      siteName: profile.person.fullName,
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      firstName: profile.person.firstName,
      lastName: profile.person.lastName,
    },
    twitter: { card: 'summary_large_image', title: dict.meta.title, description: dict.meta.description },
    authors: [{ name: profile.person.fullName, url: base }],
  };
}

// antes de pintar: aplica el tema guardado y marca que hay JS (evita parpadeos)
const bootScript = `try{var t=localStorage.getItem('theme');if(t==='dark'||t==='light')document.documentElement.setAttribute('data-theme',t)}catch(e){}document.documentElement.classList.add('js');`;

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.person.fullName,
    jobTitle: profile.person.jobTitle,
    email: `mailto:${profile.person.email}`,
    url: siteUrl(),
    image: `${siteUrl()}${profile.person.photo}`,
    worksFor: { '@type': 'Organization', name: profile.experience[0]?.company },
    address: { '@type': 'PostalAddress', addressLocality: profile.person.city, addressCountry: profile.person.country },
    sameAs: [profile.links.github, profile.links.linkedin],
    description: dict.meta.description,
  };
  return (
    <html lang={locale} className={`${display.variable} ${body.variable} ${mono.variable} ${trail.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person).replace(/</g, '\\u003c') }} />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
