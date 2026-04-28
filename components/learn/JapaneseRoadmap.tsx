"use client";

import { useMemo, useState } from "react";
import { JapaneseDayDetailPanel } from "@/components/learn/JapaneseDayDetailPanel";
import { JapaneseWeeklyTestPanel } from "@/components/learn/JapaneseWeeklyTestPanel";
import {
  JAPANESE_N5_FULL_LEVEL_MOCK,
  JAPANESE_N5_WEEKS,
  JP_TOTAL_DAYS,
  resolveJapaneseWeeklyTestForRoadmap,
} from "@/lib/japanese-learning/japanese-n5-data";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";

const TAG_STYLES: Record<string, string> = {
  "jlpt-n5": "bg-rose-400/15 text-rose-100 border-rose-400/25",
  minna: "bg-pink-400/15 text-pink-100 border-pink-400/25",
  sprint: "bg-indigo-400/15 text-indigo-100 border-indigo-400/25",
  grammar: "bg-fuchsia-400/12 text-fuchsia-100 border-fuchsia-400/22",
  particles: "bg-orange-400/12 text-orange-100 border-orange-400/22",
  kanji: "bg-amber-400/12 text-amber-100 border-amber-400/22",
  listening: "bg-sky-400/12 text-sky-100 border-sky-400/22",
};

function tagClass(slug: string) {
  return TAG_STYLES[slug] ?? "bg-neutral-500/15 text-neutral-200 border-neutral-500/25";
}

export function JapaneseRoadmap() {
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
  const [openWeekId, setOpenWeekId] = useState<string | null>("jn5-w1");
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
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">
            Japanese · JLPT N5 in 30 days
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            Built around Minna no Nihongo I Lessons 1–25 · conversation · particles · grammar · kanji · MCQ ·
            listening cues
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-neutral-400">Overall progress</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-neutral-200">
              {completedCount}/{JP_TOTAL_DAYS} days
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-[width] duration-500"
            style={{ width: barWidth }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-neutral-500">{percent}% complete</p>
        <p className="mt-1 text-right text-xs text-neutral-600">
          Weekly tests + full mock: {weeklyTestsCompletedCount}/{weeklyTestTotal} marked done
        </p>
      </div>

      <div className="mt-8 space-y-2" id="jp-roadmap-weeks">
        {JAPANESE_N5_WEEKS.map((week) => {
          const open = openWeekId === week.id;
          const doneInWeek = week.days.filter((d) => isDone(d.day)).length;
          const totalInWeek = week.days.length;
          const wt = week.weeklyTest;
          const weeklyMarked = wt ? isWeeklyTestDone(wt.id) : false;

          return (
            <div
              key={week.id}
              className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40"
            >
              <button
                type="button"
                onClick={() => setOpenWeekId((cur) => (cur === week.id ? null : week.id))}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-neutral-800/50 sm:px-5"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
                <span className="flex-1 font-medium text-neutral-100">{week.title}</span>
                <span className="text-sm tabular-nums text-neutral-500">
                  {doneInWeek}/{totalInWeek} done
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
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
                <div className="border-t border-neutral-800 px-4 py-5 sm:px-5">
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {week.days.map((d) => {
                      const checked = isDone(d.day);
                      return (
                        <li
                          key={d.day}
                          className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-800/40 p-4 transition hover:border-rose-900/40"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-neutral-500">Day {d.day}</span>
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
                                  ? "border-rose-500 bg-rose-500 text-neutral-950"
                                  : "border-neutral-600 bg-neutral-900 hover:border-neutral-500",
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
                            className="mt-3 flex flex-1 flex-col rounded-lg text-left outline-offset-2 ring-offset-neutral-950 transition hover:bg-neutral-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-rose-500/60"
                            onClick={() => setDetailDay(d.day)}
                          >
                            <h3 className="text-sm font-semibold leading-snug text-neutral-100">{d.title}</h3>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                              {d.tags.map((t) => (
                                <span
                                  key={`${d.day}-${t.slug}`}
                                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagClass(t.slug)}`}
                                >
                                  {t.label}
                                </span>
                              ))}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>

                  {wt ? (
                    <div className="mt-6 border-t border-neutral-800 pt-6">
                      <div className="flex flex-col gap-4 rounded-xl border border-indigo-900/35 bg-gradient-to-br from-indigo-950/40 to-neutral-950/40 p-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-indigo-300/90">
                            Weekly recap · JLPT-style unit test
                          </p>
                          <h4 className="mt-2 text-base font-semibold leading-snug text-neutral-100">{wt.title}</h4>
                          <p className="mt-1 text-xs leading-relaxed text-neutral-500">{wt.subtitle}</p>
                          <p className="mt-2 text-[11px] text-neutral-600">
                            {wt.subTests?.length ? (
                              <>
                                Five papers (Test 1–5), 20 MCQs each · vocab · kanji · grammar · reading · listening
                                (embedded clip + links) · submit to score
                              </>
                            ) : (
                              <>
                                Covers Days {wt.coversDayRange[0]}–{wt.coversDayRange[1]} · vocab · grammar · reading ·
                                listening · submit to score
                              </>
                            )}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-neutral-500">Done</span>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={weeklyMarked}
                              onClick={() => toggleWeeklyTest(wt.id)}
                              className={[
                                "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition",
                                weeklyMarked
                                  ? "border-indigo-500 bg-indigo-500 text-neutral-950"
                                  : "border-neutral-600 bg-neutral-900 hover:border-neutral-500",
                              ].join(" ")}
                              aria-label={
                                weeklyMarked ? "Mark weekly test not completed" : "Mark weekly test completed"
                              }
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
                            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                          >
                            Open unit test
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

      <div className="mt-10" id="jp-roadmap-full-mock">
        <div className="rounded-2xl border border-amber-900/45 bg-gradient-to-br from-amber-950/35 via-neutral-950/40 to-neutral-900/40 p-5 shadow-xl sm:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-300/95">Course finale · JLPT format</p>
          <h3 className="mt-2 text-lg font-semibold leading-snug text-neutral-100">{JAPANESE_N5_FULL_LEVEL_MOCK.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-neutral-400">{JAPANESE_N5_FULL_LEVEL_MOCK.subtitle}</p>
          <p className="mt-3 text-[11px] leading-relaxed text-neutral-600">
            One paper covering Days {JAPANESE_N5_FULL_LEVEL_MOCK.coversDayRange[0]}–{JAPANESE_N5_FULL_LEVEL_MOCK.coversDayRange[1]} ·
            言語知識（文字・語彙）· 言語知識（文法）· 読解 · 聴解 · embedded listening clip · submit to score
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-500">Done</span>
              <button
                type="button"
                role="checkbox"
                aria-checked={isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)}
                onClick={() => toggleWeeklyTest(JAPANESE_N5_FULL_LEVEL_MOCK.id)}
                className={[
                  "grid h-8 w-8 shrink-0 place-items-center rounded-lg border transition",
                  isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)
                    ? "border-amber-500 bg-amber-500 text-neutral-950"
                    : "border-neutral-600 bg-neutral-900 hover:border-neutral-500",
                ].join(" ")}
                aria-label={
                  isWeeklyTestDone(JAPANESE_N5_FULL_LEVEL_MOCK.id)
                    ? "Mark full mock as not completed"
                    : "Mark full mock as completed"
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
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-amber-500"
            >
              Open full mock exam
            </button>
          </div>
        </div>
      </div>

      <div className="mt-14 flex flex-col items-center gap-4" id="jp-roadmap-bottom">
        <p
          id="jp-roadmap-blurb"
          className="max-w-2xl text-center text-sm leading-relaxed text-neutral-500"
        >
          Tick days as you finish them — progress stays in this browser. Each lesson mirrors{" "}
          <span className="font-mono text-xs text-neutral-400">みんなの日本語</span> chapter order with
          conversation, particle drills, grammar tables, kanji cards, MCQs, and listening tasks (pair with your
          textbook audio). After each week, use the weekly JLPT-style unit test; at the end of the course, open the
          full mock exam (same submit-to-score flow). Coming later: JLPT N4 track using the same layout.
        </p>
      </div>

      <JapaneseDayDetailPanel
        key={detailDay === null ? "closed" : `jp-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
      />

      <JapaneseWeeklyTestPanel
        key={weeklyTestWeekId === null ? "wt-closed" : `wt-${weeklyTestWeekId}`}
        test={
          weeklyTestWeekId === null
            ? null
            : (resolveJapaneseWeeklyTestForRoadmap(weeklyTestWeekId) ?? null)
        }
        onClose={() => setWeeklyTestWeekId(null)}
        isWeeklyTestDone={isWeeklyTestDone}
        onToggleWeeklyTest={toggleWeeklyTest}
      />
    </div>
  );
}
