import 'server-only';

const dictionaries = {
  en: () => import('./en.json').then((module) => module.default),
  ar: () => import('./ar.json').then((module) => module.default),
};

export type Locale = keyof typeof dictionaries;

export const getDictionary = async (locale: Locale) => {
  // Fallback to English if an unsupported locale is passed
  const loadDictionary = dictionaries[locale] || dictionaries.en;
  return loadDictionary();
};
