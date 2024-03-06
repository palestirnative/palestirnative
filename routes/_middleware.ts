import { getCookies } from "$std/http/cookie.ts";
import locales from "../locales/index.ts";
import { Category } from "../types/category.ts";
import { Locale } from "../types/locale.ts";
import db from "../utils/db/db.ts";
export interface AppState {
  defaultLanguage: string;
  translate: (expressio: string) => string;
  locale: Locale;
  selectedLanguage: string;
  categories: Category[];
  pathname: string;
  search?: string;
  category?: string;
  country?: string;
}
const defaultLanguage = "en";

export async function handler(
  req: Request,
  ctx: { state: AppState; next: () => Promise<Response> },
) {
  const cookies = getCookies(req.headers);

  const language = cookies.language;

  let selectedLanguage = defaultLanguage;

  if (language && locales[language]) {
    selectedLanguage = language;
  } else {
    const acceptedLanguages = req.headers.get("accept-language") || "";
    const parsedAcceptedLanguages = acceptedLanguages.split(",").map(
      (rawLanguageItem) => {
        const [languageCode, weight = 1] = rawLanguageItem.trim().split(";q=");
        return {
          languageCode: languageCode.split("-")[0],
          weight: Number(weight),
        };
      },
    ).sort((a, b) => b.weight - a.weight);

    const firstExistingLanguage = parsedAcceptedLanguages.find(
      (parsedLanguage) => {
        return locales[parsedLanguage.languageCode];
      },
    );

    if (firstExistingLanguage) {
      selectedLanguage = firstExistingLanguage.languageCode;
    }
  }
  ctx.state.locale = locales[selectedLanguage];
  ctx.state.translate = (expression) => {
    return locales[selectedLanguage][expression] as string ||
      locales[defaultLanguage][expression] as string || "translation not found";
  };
  ctx.state.selectedLanguage = selectedLanguage;

  const categories = await db.collection("categories").find()
    .toArray() as unknown as Category[];
  ctx.state.categories = categories;

  const url = new URL(req.url);
  ctx.state.pathname = url.pathname;
  ctx.state.search = url.searchParams?.get("search") || "";
  ctx.state.category = url.searchParams?.get("category") || "";
  ctx.state.country = url.searchParams?.get("country") || "";
  ctx.state.defaultLanguage = defaultLanguage;

  const response = await ctx.next();
  return response;
}
