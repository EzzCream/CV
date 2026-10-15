import profileJson from '@/content/profile.json';
import es from '@/content/es.json';
import en from '@/content/en.json';
import { dictionarySchema, profileSchema, type Dictionary, type Profile } from '@/content/schema';

export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];

// el contenido se valida al compilar: un JSON incompleto rompe el build con un mensaje claro
export const profile: Profile = profileSchema.parse(profileJson);
const dictionaries: Record<Locale, Dictionary> = {
  es: dictionarySchema.parse(es),
  en: dictionarySchema.parse(en),
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || profile.person.site).replace(/\/$/, '');
}
