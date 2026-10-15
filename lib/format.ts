import type { Dictionary, Profile } from '@/content/schema';
import type { Locale } from './content';

const MONTHS: Record<Locale, string[]> = {
  es: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
};

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''));
}

function yearMonth(value: string, locale: Locale): string {
  const [year, month] = value.split('-');
  return month ? `${MONTHS[locale][Number(month) - 1]} ${year}` : (year ?? value);
}

// "nov 2025 - hoy", "mar - oct 2024", "2022 - 2023, 4 meses"
export function formatRange(
  locale: Locale,
  dict: Dictionary,
  start: string,
  end: string | null,
  months?: number,
): string {
  const to = end ? yearMonth(end, locale) : dict.ui.present;
  const sameYear = end && start.length > 4 && end.length > 4 && start.slice(0, 4) === end.slice(0, 4);
  let out = sameYear ? `${MONTHS[locale][Number(start.slice(5)) - 1]} - ${to}` : `${yearMonth(start, locale)} - ${to}`;
  if (months) out += `, ${fill(dict.ui.months, { count: months })}`;
  return out;
}

export function nameOf(profile: Profile, id: string): string {
  return profile.experience.find((e) => e.id === id)?.company ?? profile.projects.find((p) => p.id === id)?.name ?? id;
}
