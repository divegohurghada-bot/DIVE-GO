import { LanguageCode } from './languages';
import { TranslationSchema } from './types';
import { en, de, ar, ru } from './locales/group1';
import { fr, it, pl, nl } from './locales/group2';
import { cs, es, sv, no } from './locales/group3';
import { da, fi, hu, ro } from './locales/group4';
import { sk, uk, tr, pt } from './locales/group5';

export const TRANSLATIONS: Record<LanguageCode, TranslationSchema> = {
  en,
  de,
  ar,
  ru,
  fr,
  it,
  pl,
  nl,
  cs,
  es,
  sv,
  no,
  da,
  fi,
  hu,
  ro,
  sk,
  uk,
  tr,
  pt,
};

export const getTranslation = (code: LanguageCode): TranslationSchema => {
  return TRANSLATIONS[code] || TRANSLATIONS.en;
};

export * from './languages';
export * from './types';
