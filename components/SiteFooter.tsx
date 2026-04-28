"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 text-sm text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>{t("footer.tagline")}</p>
        <p className="font-mono text-xs text-[var(--faint)]">learnwithrajan</p>
      </div>
    </footer>
  );
}
