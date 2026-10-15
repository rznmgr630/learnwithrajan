"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { JapaneseDayDetailPanel } from "@/components/learn/JapaneseDayDetailPanel";
import { JapaneseWeeklyTestPanel } from "@/components/learn/JapaneseWeeklyTestPanel";
import {
  JAPANESE_N5_FULL_LEVEL_MOCK,
  JAPANESE_N5_WEEKS,
  JP_TOTAL_DAYS,
  resolveJapaneseWeeklyTestForRoadmap,
} from "@/lib/japanese-learning/n5/japanese-n5-data";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";
import { RichText } from "@/components/learn/RichText";
import { stripRichMarkers } from "@/lib/learn/strip-rich-markers";
import { pickLocalized } from "@/lib/i18n/pick";
import type { LessonNavTarget } from "@/components/learn/LessonNav";
import type { Locale } from "@/lib/i18n/types";

/** Single pill style for all topic tags — color comes from theme accent only elsewhere. */
const TAG_PILL =
  "rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_85%,transparent)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]";

const weeklyTestIds = [
  ...JAPANESE_N5_WEEKS.filter((w) => w.weeklyTest).map((w) => w.id),
  JAPANESE_N5_FULL_LEVEL_MOCK.id,
];

function weeklyTestNeighbour(currentId: string | null, offset: -1 | 1, locale: Locale): LessonNavTarget | null {
  if (currentId === null) return null;
  const id = weeklyTestIds[weeklyTestIds.indexOf(currentId) + offset];
  const test = id ? resolveJapaneseWeeklyTestForRoadmap(id) : undefined;
  return test ? { id, title: pickLocalized(test.title, locale) } : null;
}

export function JapaneseRoadmap() {
  const { locale, t, tParams } = useLocale();
  const {
    completedCount,
    percent,
    toggleDay,
    isDone,
    weeklyTestsCompletedCount,
    weeklyTestTotal,
    toggleWeeklyTest,
    isWeeklyTestDone,
  } = useJapaneseN5Progress();
  const [detailDay, setDetailDay] = useState<number | null>(null);
  const [weeklyTestWeekId, setWeeklyTestWeekId] = useState<string | null>(null);

  const barWidth = useMemo(
    () => `${Math.min(100, Math.round((completedCount / JP_TOTAL_DAYS) * 100))}%`,
    [completedCount],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{t("jpRoadmap.title")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("jpRoadmap.subtitle")}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">{t("jpRoadmap.overallProgress")}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-[var(--text)]">
              {completedCount}/{JP_TOTAL_DAYS} {t("jpRoadmap.days")}
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
            style={{ width: barWidth }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--muted)]">
          {percent}
          {t("jpRoadmap.percentComplete")}
        </p>
        <p className="mt-1 text-right text-xs text-[var(--faint)]">
          {t("jpRoadmap.weeklyTestsProgress")} {weeklyTestsCompletedCount}/{weeklyTestTotal} {t("jpRoadmap.markedDone")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-10" id="jp-roadmap-weeks">
        {JAPANESE_N5_WEEKS.map((week) => {
          const doneInWeek = week.days.filter((d) => isDone(d.day)).length;
          const totalInWeek = week.days.length;
          const wt = week.weeklyTest;
          const weeklyMarked = wt ? isWeeklyTestDone(wt.id) : false;

          return (
            <div key={week.id}>
              <div className="mb-4 flex items-center gap-3">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
                <h2 className="flex-1 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                  <RichText text={pickLocalized(week.title, locale)} />
                </h2>
                <div className="flex-1 border-t border-[var(--border)]" />
                <span className="text-sm tabular-nums text-[var(--muted)]">
                  {doneInWeek}/{totalInWeek} {t("jpRoadmap.doneSlash")}
                </span>
              </div>

              <div>
                <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
                    {week.days.map((d) => {
                      const checked = isDone(d.day);
                      return (
                        <li
                          key={d.day}
                          className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-black/10"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="inline-flex items-center rounded-md border border-[var(--border)] bg-[var(--elevated)] px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums text-[var(--faint)]">
                              {t("jpRoadmap.dayPrefix")} {d.day}
                            </span>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={checked}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDay(d.day);
                              }}
                              className={[
                                "grid h-5 w-5 shrink-0 place-items-center rounded border transition",
                                checked
                                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                                  : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]",
                              ].join(" ")}
                            >
                              {checked ? (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                                  <path
                                    d="M2.5 6L5 8.5L9.5 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : null}
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={`Open details for day ${d.day}: ${stripRichMarkers(d.title)}`}
                            className="mt-3 flex flex-1 flex-col text-left outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => setDetailDay(d.day)}
                          >
                            <h3 className="text-sm font-semibold leading-snug text-[var(--text)] transition-colors duration-150 group-hover:text-[var(--accent)]">
                              <RichText text={d.title} />
                            </h3>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                              {d.tags.map((tag) => (
                                <span
                                  key={`${d.day}-${tag.slug}`}
                                  className={TAG_PILL}
                                >
                                  {tag.label}
                                </span>
                              ))}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                </ul>

                {wt ? (
                  <div className="mt-5 border-t border-[var(--border)] pt-5">
                      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                            {t("jpRoadmap.weeklyRecapLabel")}
                          </p>
                          <h4 className="mt-2 text-base font-semibold leading-snug text-[var(--text)]">
                            <RichText text={pickLocalized(wt.title, locale)} />
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">
                            <RichText text={pickLocalized(wt.subtitle, locale)} />
                          </p>
                          <p className="mt-2 text-[11px] text-[var(--faint)]">
                            {wt.subTests?.length
                              ? t("jpRoadmap.fivePapersBlurb")
                              : tParams("jpRoadmap.singlePaperBlurb", {
                                  from: wt.coversDayRange[0],
                                  to: wt.coversDayRange[1],
                                })}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted)]">{t("jpRoadmap.done")}</span>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={weeklyMarked}
                              onClick={() => toggleWeeklyTest(wt.id)}
                              className={[
                                "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition",
                                weeklyMarked
                                  ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                                  : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]",
                              ].join(" ")}
                              aria-label={weeklyMarked ? t("weeklyPanel.markNotDone") : t("weeklyPanel.markDone")}
                            >
                              {weeklyMarked ? (
                                <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" aria-hidden>
                                  <path
                                    d="M2.5 6L5 8.5L9.5 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : null}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => setWeeklyTestWeekId(week.id)}
                            className="rounded-lg bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
                          >
                            {t("jpRoadmap.openUnitTest")}
                          </button>
                        </div>
                      </div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-10" id="jp-roadmap-full-mock">
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-5 shadow-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{t("jpRoadmap.courseFinale")}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--text)]">
            <RichText text={pickLocalized(JAPANESE_N5_FULL_LEVEL_MOCK.title, locale)} />
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            <RichText text={pickLocalized(JAPANESE_N5_FULL_LEVEL_MOCK.subtitle, locale)} />
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--faint)]">
            {tParams("jpRoadmap.fullMockBlurb", {
              from: JAPANESE_N5_FULL_LEVEL_MOCK.coversDayRange[0],
              to: JAPANESE_N5_FULL_LEVEL_MOCK.coversDayRange[1],
            })}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">{t("jpRoadmap.done")}</span>
              <button
                type="button"
                role="checkbox"
                aria-checked={isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)}
                onClick={() => toggleWeeklyTest(JAPANESE_N5_FULL_LEVEL_MOCK.id)}
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition",
                  isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]",
                ].join(" ")}
                aria-label={
                  isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)
                    ? t("weeklyPanel.markMockNotDone")
                    : t("weeklyPanel.markMockDone")
                }
              >
                {isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id) ? (
                  <svg className="h-3.5 w-3.5" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2.5 6L5 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : null}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setWeeklyTestWeekId(JAPANESE_N5_FULL_LEVEL_MOCK.id)}
              className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
            >
              {t("jpRoadmap.openFullMock")}
            </button>
          </div>
        </div>
      </div>

      <JapaneseDayDetailPanel
        key={detailDay === null ? "closed" : `jp-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
        onNavigateDay={setDetailDay}
      />

      <JapaneseWeeklyTestPanel
        key={weeklyTestWeekId === null ? "wt-closed" : `wt-${weeklyTestWeekId}`}
        test={
          weeklyTestWeekId === null
            ? null
            : (resolveJapaneseWeeklyTestForRoadmap(weeklyTestWeekId) ?? null)
        }
        onClose={() => setWeeklyTestWeekId(null)}
        previous={weeklyTestNeighbour(weeklyTestWeekId, -1, locale)}
        next={weeklyTestNeighbour(weeklyTestWeekId, 1, locale)}
        onNavigate={setWeeklyTestWeekId}
        isWeeklyTestDone={isWeeklyTestDone}
        onToggleWeeklyTest={toggleWeeklyTest}
      />
    </div>
  );
}
