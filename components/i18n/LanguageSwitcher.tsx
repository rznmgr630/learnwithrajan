"use client";

import { LOCALE_FLAGS, LOCALE_LABELS, LOCALES, type Locale } from "@/lib/i18n/types";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useLocale();

  return (
    <div className={`flex items-center ${className}`}>
      <select
        value={locale}
        onChange={(e) => setLocale(e.target.value as Locale)}
        className="rounded-lg border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-neutral-200 outline-none transition hover:border-neutral-600 focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/30"
        aria-label={t("nav.language")}
      >
        {LOCALES.map((loc) => (
          <option key={loc} value={loc}>
            {LOCALE_FLAGS[loc]} {LOCALE_LABELS[loc]}
          </option>
        ))}
      </select>
    </div>
  );
}
