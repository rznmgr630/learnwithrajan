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
        className="rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2 py-1.5 text-[var(--text)] outline-none transition hover:border-[var(--accent)] focus:border-[var(--accent)] focus:ring-1 focus:ring-[color-mix(in_oklab,var(--accent)_35%,transparent)]"
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
