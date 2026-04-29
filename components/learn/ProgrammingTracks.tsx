"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useGit7Progress } from "@/hooks/use-git-7-progress";
import { TOTAL_DAYS } from "@/lib/challenge-data";
import { GIT_TOTAL_DAYS } from "@/lib/git-learning/git-challenge-data";
import { learnHubCardClass } from "@/components/learn/learn-hub-card-class";

const gridClass = "grid gap-4 sm:grid-cols-2";

export function ProgrammingTracks() {
  const { t } = useLocale();
  const { completedCount, percent } = useBackend30Progress();
  const git = useGit7Progress();

  return (
    <div className={gridClass}>
      <Link href="/learn/backend-30-days" className={learnHubCardClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
              {t("hub.backend.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.backend.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
            suppressHydrationWarning
          >
            {percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-[var(--muted)]">
              {completedCount}/{TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.backend.cta")}
        </span>
      </Link>

      <Link href="/learn/git-7-days" className={learnHubCardClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
              {t("hub.git.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.git.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
            suppressHydrationWarning
          >
            {git.percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-[var(--muted)]">
              {git.completedCount}/{GIT_TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${git.percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.backend.cta")}
        </span>
      </Link>
    </div>
  );
}
