"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { ProgrammingTracks } from "@/components/learn/ProgrammingTracks";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LearnProgrammingPage() {
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
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{t("hub.sectionProgramming")}</h1>
          <p className="mt-3 text-[var(--muted)]">{t("hub.sectionProgrammingHint")}</p>
        </div>
        <div className="mt-10">
          <ProgrammingTracks />
        </div>
      </div>
    </div>
  );
}
