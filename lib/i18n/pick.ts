import type { Locale, LocalizedString } from "@/lib/i18n/types";

export function pickLocalized(value: LocalizedString | undefined, locale: Locale): string {
  if (value === undefined) return "";
  if (typeof value === "string") return value;
  return value[locale] ?? value.en;
}

/** HTML `lang` attribute (BCP 47). */
export function htmlLangForLocale(locale: Locale): string {
  switch (locale) {
    case "jp":
      return "ja";
    case "np":
      return "ne";
    default:
      return "en";
  }
}
