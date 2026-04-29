"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";
import { useJapaneseN4Progress } from "@/hooks/use-japanese-n4-progress";
import { TOTAL_DAYS } from "@/lib/challenge-data";
import { JP_TOTAL_DAYS } from "@/lib/japanese-learning/n5/japanese-n5-data";
import { JP_N4_TOTAL_DAYS } from "@/lib/japanese-learning/n4/japanese-n4-data";

const cardClass =
  "group flex flex-col rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-5 text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]";

export function LearningHubCards() {
  const { t } = useLocale();
  const { completedCount, percent } = useBackend30Progress();
  const jp = useJapaneseN5Progress();
  const jpN4 = useJapaneseN4Progress();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link href="/learn/backend-30-days" className={cardClass}>
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

      <Link href="/learn/japanese-n5" className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
              {t("hub.japanese.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.japanese.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
            suppressHydrationWarning
          >
            {jp.percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-[var(--muted)]">
              {jp.completedCount}/{JP_TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${jp.percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.backend.cta")}
        </span>
      </Link>

      <Link href="/learn/japanese-n4" className={cardClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
              {t("hub.japaneseN4.title")}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.japaneseN4.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
            suppressHydrationWarning
          >
            {jpN4.percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-[var(--muted)]">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-[var(--muted)]">
              {jpN4.completedCount}/{JP_N4_TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
            <div
              className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
              style={{ width: `${jpN4.percent}%` }}
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
