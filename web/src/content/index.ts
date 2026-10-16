import am from './am';
import en from './en';
import type { Dictionary } from './types';

export const LOCALES = ['en', 'am'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

const DICTIONARIES: Record<Locale, Dictionary> = { en, am };

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}

export type { Dictionary } from './types';
