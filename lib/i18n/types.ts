/** UI and metadata locales (content languages), not necessarily matching HTML `lang` codes. */
export type Locale = "en" | "np" | "jp";

/** Triple translations for UI chrome and English explanatory blurbs. Plain `string` = leave as-is (e.g. Japanese-only copy). */
export type LocalizedString = string | { en: string; np: string; jp: string };

export const LOCALES: Locale[] = ["en", "np", "jp"];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  np: "नेपाली",
  jp: "日本語",
};

/** Regional flags shown next to locale names in the language switcher. */
export const LOCALE_FLAGS: Record<Locale, string> = {
  en: "🇬🇧",
  np: "🇳🇵",
  jp: "🇯🇵",
};
