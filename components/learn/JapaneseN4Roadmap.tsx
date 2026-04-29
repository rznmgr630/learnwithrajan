"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { JapaneseN4DayDetailPanel } from "@/components/learn/JapaneseN4DayDetailPanel";
import { JapaneseWeeklyTestPanel } from "@/components/learn/JapaneseWeeklyTestPanel";
import {
  JAPANESE_N4_FULL_LEVEL_MOCK,
  JAPANESE_N4_WEEKS,
  JP_N4_TOTAL_DAYS,
  resolveJapaneseN4WeeklyTestForRoadmap,
} from "@/lib/japanese-learning/n4/japanese-n4-data";
import { useJapaneseN4Progress } from "@/hooks/use-japanese-n4-progress";
import { pickLocalized } from "@/lib/i18n/pick";

const TAG_PILL =
  "rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_85%,transparent)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]";

export function JapaneseN4Roadmap() {
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
  } = useJapaneseN4Progress();
  const [openWeekId, setOpenWeekId] = useState<string | null>("jn4-w1");
  const [detailDay, setDetailDay] = useState<number | null>(null);
  const [weeklyTestWeekId, setWeeklyTestWeekId] = useState<string | null>(null);

  const barWidth = useMemo(
    () => `${Math.min(100, Math.round((completedCount / JP_N4_TOTAL_DAYS) * 100))}%`,
    [completedCount],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{t("jpN4Roadmap.title")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("jpN4Roadmap.subtitle")}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">{t("jpN4Roadmap.overallProgress")}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-[var(--text)]">
              {completedCount}/{JP_N4_TOTAL_DAYS} {t("jpN4Roadmap.days")}
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
          {t("jpN4Roadmap.percentComplete")}
        </p>
        <p className="mt-1 text-right text-xs text-[var(--faint)]">
          {t("jpN4Roadmap.weeklyTestsProgress")} {weeklyTestsCompletedCount}/{weeklyTestTotal} {t("jpN4Roadmap.markedDone")}
        </p>
      </div>

      <div className="mt-8 space-y-2" id="jp-n4-roadmap-weeks">
        {JAPANESE_N4_WEEKS.map((week) => {
          const open = openWeekId === week.id;
          const doneInWeek = week.days.filter((d) => isDone(d.day)).length;
          const totalInWeek = week.days.length;
          const wt = week.weeklyTest;
          const weeklyMarked = wt ? isWeeklyTestDone(wt.id) : false;

          return (
            <div
              key={week.id}
              className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)]"
            >
              <button
                type="button"
                onClick={() => setOpenWeekId((cur) => (cur === week.id ? null : week.id))}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] sm:px-5"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
                <span className="flex-1 font-medium text-[var(--text)]">{pickLocalized(week.title, locale)}</span>
                <span className="text-sm tabular-nums text-[var(--muted)]">
                  {doneInWeek}/{totalInWeek} {t("jpN4Roadmap.doneSlash")}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M6.22 5.22a.75.75 0 0 1 1.06 0L10 7.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L6.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open ? (
                <div className="border-t border-[var(--border)] px-4 py-5 sm:px-5">
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {week.days.map((d) => {
                      const checked = isDone(d.day);
                      return (
                        <li
                          key={d.day}
                          className="flex flex-col rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] p-4 transition hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))]"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-[var(--muted)]">
                              {t("jpN4Roadmap.dayPrefix")} {d.day}
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
                            aria-label={`Open details for day ${d.day}: ${d.title}`}
                            className="mt-3 flex flex-1 flex-col rounded-lg text-left outline-offset-2 ring-offset-[var(--background)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                            onClick={() => setDetailDay(d.day)}
                          >
                            <h3 className="text-sm font-semibold leading-snug text-[var(--text)]">{d.title}</h3>
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
                    <div className="mt-6 border-t border-[var(--border)] pt-6">
                      <div className="flex flex-col gap-4 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">
                            {t("jpN4Roadmap.weeklyRecapLabel")}
                          </p>
                          <h4 className="mt-2 text-base font-semibold leading-snug text-[var(--text)]">
                            {pickLocalized(wt.title, locale)}
                          </h4>
                          <p className="mt-1 text-xs leading-relaxed text-[var(--muted)]">{pickLocalized(wt.subtitle, locale)}</p>
                          <p className="mt-2 text-[11px] text-[var(--faint)]">
                            {wt.subTests?.length
                              ? t("jpN4Roadmap.fivePapersBlurb")
                              : tParams("jpN4Roadmap.singlePaperBlurb", {
                                  from: wt.coversDayRange[0],
                                  to: wt.coversDayRange[1],
                                })}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-[var(--muted)]">{t("jpN4Roadmap.done")}</span>
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
                            {t("jpN4Roadmap.openUnitTest")}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-10" id="jp-n4-roadmap-full-mock">
        <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-5 shadow-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--muted)]">{t("jpN4Roadmap.courseFinale")}</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-[var(--text)]">
            {pickLocalized(JAPANESE_N4_FULL_LEVEL_MOCK.title, locale)}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
            {pickLocalized(JAPANESE_N4_FULL_LEVEL_MOCK.subtitle, locale)}
          </p>
          <p className="mt-3 text-[11px] leading-relaxed text-[var(--faint)]">
            {tParams("jpN4Roadmap.fullMockBlurb", {
              from: JAPANESE_N4_FULL_LEVEL_MOCK.coversDayRange[0],
              to: JAPANESE_N4_FULL_LEVEL_MOCK.coversDayRange[1],
            })}
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--muted)]">{t("jpN4Roadmap.done")}</span>
              <button
                type="button"
                role="checkbox"
                aria-checked={isWeeklyTestDone(JAPANESE_N4_FULL_LEVEL_MOCK.id)}
                onClick={() => toggleWeeklyTest(JAPANESE_N4_FULL_LEVEL_MOCK.id)}
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition",
                  isWeeklyTestDone(JAPANESE_N4_FULL_LEVEL_MOCK.id)
                    ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                    : "border-[var(--border)] bg-[var(--elevated)] hover:border-[var(--accent)]",
                ].join(" ")}
                aria-label={
                  isWeeklyTestDone(JAPANESE_N4_FULL_LEVEL_MOCK.id)
                    ? t("weeklyPanel.markMockNotDone")
                    : t("weeklyPanel.markMockDone")
                }
              >
                {isWeeklyTestDone(JAPANESE_N4_FULL_LEVEL_MOCK.id) ? (
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
              onClick={() => setWeeklyTestWeekId(JAPANESE_N4_FULL_LEVEL_MOCK.id)}
              className="rounded-lg bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
            >
              {t("jpN4Roadmap.openFullMock")}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-4" id="jp-n4-roadmap-bottom">
        <p id="jp-n4-roadmap-blurb" className="max-w-2xl text-center text-sm leading-relaxed text-[var(--muted)]">
          {t("jpN4Roadmap.bottomBlurb")}
        </p>
      </div>

      <JapaneseN4DayDetailPanel
        key={detailDay === null ? "closed" : `jn4-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
      />

      <JapaneseWeeklyTestPanel
        key={weeklyTestWeekId === null ? "wt-closed" : `wt-n4-${weeklyTestWeekId}`}
        test={
          weeklyTestWeekId === null
            ? null
            : (resolveJapaneseN4WeeklyTestForRoadmap(weeklyTestWeekId) ?? null)
        }
        onClose={() => setWeeklyTestWeekId(null)}
        isWeeklyTestDone={isWeeklyTestDone}
        onToggleWeeklyTest={toggleWeeklyTest}
      />
    </div>
  );
}
