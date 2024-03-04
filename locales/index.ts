import en from "./en.ts";
import ar from "./ar.ts";
import fr from "./fr.ts";
import tr from "./tr.ts";
import ru from "./ru.ts";
import es from "./es.ts";
import ms from "./ms.ts";
import bs from "./bs.ts";
import fa from "./fa.ts";
import hi from "./hi.ts";
import ur from "./ur.ts";
import bn from "./bn.ts";
import id from "./id.ts";
import de from "./de.ts";
import pt from "./pt.ts";
import sq from "./sq.ts";
import it from "./it.ts";
import { Locales } from "../types/locale.ts";

const locales: Locales = {
  en,
  ar,
  fr,
  tr,
  ru,
  es,
  ms,
  bs,
  fa,
  hi,
  ur,
  bn,
  id,
  de,
  pt,
  sq,
  it,
};
type LanguageMeta = { code: string; name: string };
export const languages: LanguageMeta[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "es", name: "Español" },
  { code: "ms", name: "Melayu" },
  { code: "bs", name: "Bosanski" },
  { code: "fa", name: "فارسی" },
  { code: "hi", name: "हिन्दी" },
  { code: "ur", name: "اردو" },
  { code: "bn", name: "বাংলা" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "sq", name: "Shqip" },
  { code: "it", name: "Italiano" },
];
export default locales;
