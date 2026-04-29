"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { LanguageTracks } from "@/components/learn/LanguageTracks";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LearnLanguagePage() {
  const { t } = useLocale();

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{t("hub.sectionLanguage")}</h1>
          <p className="mt-3 text-[var(--muted)]">{t("hub.sectionLanguageHint")}</p>
        </div>
        <div className="mt-10">
          <LanguageTracks />
        </div>
      </div>
    </div>
  );
}
