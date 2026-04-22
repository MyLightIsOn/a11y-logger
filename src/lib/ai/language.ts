const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  fr: 'French',
  es: 'Spanish',
  de: 'German',
};

export function getLanguageName(locale: string): string {
  return LANGUAGE_NAMES[locale] ?? 'English';
}
