export type Locale = Record<string, string | Record<string, string>>;
export type Locales = {
  [langCode: string]: Locale;
};
