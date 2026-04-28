import type { Locale } from "@/lib/i18n/types";

export const LOCALE_STORAGE_KEY = "lwlr-locale";

export function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (raw === "en" || raw === "np" || raw === "jp") return raw;
  } catch {
    /* ignore */
  }
  return null;
}

export function writeStoredLocale(locale: Locale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
}
