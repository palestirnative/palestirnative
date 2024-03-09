export type Locale = {
  [key: string]: string | Record<string, string> | undefined;
  countries: Record<string, string>;
};
export type Locales = {
  [langCode: string]: Locale;
};
