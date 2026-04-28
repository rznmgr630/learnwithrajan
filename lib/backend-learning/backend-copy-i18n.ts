import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import { pickLocalized } from "@/lib/i18n/pick";
import { BACKEND_COPY_MAP } from "@/lib/backend-learning/backend-copy-map-data";

/**
 * Resolves backend day-detail prose (overview, tables, FAQ, etc.) for np/jp.
 * Keys are exact English strings from `lib/backend-learning/day-*-detail.ts`.
 */
export function resolveBackendCopy(text: LocalizedString, locale: Locale): string {
  if (typeof text !== "string") return pickLocalized(text, locale);
  if (locale === "en") return text;
  const row = BACKEND_COPY_MAP[text];
  if (!row) return text;
  return locale === "np" ? row.np : row.jp;
}
