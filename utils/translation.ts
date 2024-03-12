import locales from "../locales/index.ts";

type translate = (
  expression: string,
  selectedLanguage: string,
  defaultLanguage: string,
) => string;

export const translate: translate = (
  expression,
  selectedLanguage,
  defaultLanguage,
) => {
  return locales[selectedLanguage][expression] as string ||
    locales[defaultLanguage][expression] as string || "translation not found";
};
