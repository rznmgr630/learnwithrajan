"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";
import { TOTAL_DAYS } from "@/lib/challenge-data";
import { JP_TOTAL_DAYS } from "@/lib/japanese-learning/japanese-n5-data";

export function LearningHubCards() {
  const { t } = useLocale();
  const { completedCount, percent } = useBackend30Progress();
  const jp = useJapaneseN5Progress();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/learn/backend-30-days"
        className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-left shadow-sm transition hover:border-sky-500/40 hover:bg-neutral-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-100 group-hover:text-sky-300">
              {t("hub.backend.title")}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{t("hub.backend.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-sky-300"
            suppressHydrationWarning
          >
            {percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-neutral-400">
              {completedCount}/{TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-sky-400 transition group-hover:text-sky-300">
          {t("hub.backend.cta")}
        </span>
      </Link>

      <Link
        href="/learn/japanese-n5"
        className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-left shadow-sm transition hover:border-rose-500/40 hover:bg-neutral-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-100 group-hover:text-rose-300">
              {t("hub.japanese.title")}
            </h2>
            <p className="mt-1 text-sm text-neutral-500">{t("hub.japanese.subtitle")}</p>
          </div>
          <span
            className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-rose-300"
            suppressHydrationWarning
          >
            {jp.percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>{t("hub.backend.progress")}</span>
            <span className="tabular-nums text-neutral-400">
              {jp.completedCount}/{JP_TOTAL_DAYS} {t("hub.backend.days")}
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-[width] duration-500"
              style={{ width: `${jp.percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-rose-400 transition group-hover:text-rose-300">
          {t("hub.backend.cta")}
        </span>
      </Link>
    </div>
  );
}
