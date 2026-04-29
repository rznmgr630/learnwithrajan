"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { learnHubCardClass } from "@/components/learn/learn-hub-card-class";

const gridClass = "grid gap-4 sm:grid-cols-2";

export function LearningHubCards() {
  const { t } = useLocale();

  return (
    <div className={gridClass}>
      <Link href="/learn/programming" className={learnHubCardClass}>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
          {t("hub.sectionProgramming")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("hub.sectionProgrammingHint")}</p>
        <span className="mt-8 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.category.cta")}
        </span>
      </Link>

      <Link href="/learn/language" className={learnHubCardClass}>
        <h2 className="text-xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
          {t("hub.sectionLanguage")}
        </h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{t("hub.sectionLanguageHint")}</p>
        <span className="mt-8 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.category.cta")}
        </span>
      </Link>
    </div>
  );
}
