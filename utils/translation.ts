import locales from "../locales/index.ts";

export const translate = (expression, selectedLanguage, defaultLanguage) => {
  return locales[selectedLanguage][expression] as string ||
    locales[defaultLanguage][expression] as string || "translation not found";
};
