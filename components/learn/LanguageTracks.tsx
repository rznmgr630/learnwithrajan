"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";
import { useJapaneseN4Progress } from "@/hooks/use-japanese-n4-progress";
import { useJapaneseN3Progress } from "@/hooks/use-japanese-n3-progress";
import { JP_TOTAL_DAYS } from "@/lib/japanese-learning/n5/japanese-n5-data";
import { JP_N4_TOTAL_DAYS } from "@/lib/japanese-learning/n4/japanese-n4-data";
import { JP_N3_TOTAL_DAYS } from "@/lib/japanese-learning/n3/japanese-n3-data";
import { DuolingoMeaningCard } from "@/components/learn/DuolingoMeaningCard";

const subCardClass =
  "group flex flex-col rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4 transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]";

export function LanguageTracks() {
  const { t } = useLocale();
  const jp = useJapaneseN5Progress();
  const jpN4 = useJapaneseN4Progress();
  const jpN3 = useJapaneseN3Progress();

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--text)]">Japanese</h2>
        <p className="mt-1 text-sm text-[var(--muted)]">JLPT tracks · N5 to N3 · Duolingo vocabulary</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* N5 */}
        <Link href="/learn/japanese-n5" className={subCardClass}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.japanese.title")}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{t("hub.japanese.subtitle")}</p>
            </div>
            <span
              className="shrink-0 rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {jp.percent}%
            </span>
          </div>
          <div className="mt-4" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums">{jp.completedCount}/{JP_TOTAL_DAYS} {t("hub.backend.days")}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${jp.percent}%` }}
              />
            </div>
          </div>
          <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>

        {/* N4 */}
        <Link href="/learn/japanese-n4" className={subCardClass}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.japaneseN4.title")}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{t("hub.japaneseN4.subtitle")}</p>
            </div>
            <span
              className="shrink-0 rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {jpN4.percent}%
            </span>
          </div>
          <div className="mt-4" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums">{jpN4.completedCount}/{JP_N4_TOTAL_DAYS} {t("hub.backend.days")}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${jpN4.percent}%` }}
              />
            </div>
          </div>
          <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>

        {/* N3 */}
        <Link href="/learn/japanese-n3" className={subCardClass}>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.japaneseN3.title")}
              </p>
              <p className="mt-0.5 line-clamp-2 text-xs text-[var(--muted)]">{t("hub.japaneseN3.subtitle")}</p>
            </div>
            <span
              className="shrink-0 rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {jpN3.percent}%
            </span>
          </div>
          <div className="mt-4" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums">{jpN3.completedCount}/{JP_N3_TOTAL_DAYS} {t("hub.backend.days")}</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${jpN3.percent}%` }}
              />
            </div>
          </div>
          <span className="mt-auto pt-4 text-xs font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>

        {/* Duolingo */}
        <DuolingoMeaningCard />
      </div>
    </div>
  );
}
