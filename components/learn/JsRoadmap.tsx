"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import { stripRichMarkers } from "@/lib/learn/strip-rich-markers";
import { pickLocalized } from "@/lib/i18n/pick";
import { DayDetailPanel } from "@/components/learn/DayDetailPanel";
import { JsLessonDayDetail } from "@/components/learn/JsLessonDayDetail";
import { JS_ROADMAP_WEEKS, JS_TOTAL_DAYS } from "@/lib/js-learning/js-challenge-data";
import { useJsProgress } from "@/hooks/use-js-progress";
import { JS_DAY_1_LESSONS } from "@/lib/js-learning/js-day-1-lessons";
import { JS_DAY_2_LESSONS } from "@/lib/js-learning/js-day-2-lessons";
import { JS_DAY_3_LESSONS } from "@/lib/js-learning/js-day-3-lessons";
import { JS_DAY_4_LESSONS } from "@/lib/js-learning/js-day-4-lessons";
import { JS_DAY_5_LESSONS } from "@/lib/js-learning/js-day-5-lessons";
import { JS_DAY_6_LESSONS } from "@/lib/js-learning/js-day-6-lessons";
import { JS_DAY_7_LESSONS } from "@/lib/js-learning/js-day-7-lessons";
import { JS_DAY_8_LESSONS } from "@/lib/js-learning/js-day-8-lessons";
import { JS_DAY_9_LESSONS } from "@/lib/js-learning/js-day-9-lessons";
import { JS_DAY_10_LESSONS } from "@/lib/js-learning/js-day-10-lessons";
import { JS_DAY_11_LESSONS } from "@/lib/js-learning/js-day-11-lessons";
import { JS_DAY_12_LESSONS } from "@/lib/js-learning/js-day-12-lessons";
import { JS_DAY_13_LESSONS } from "@/lib/js-learning/js-day-13-lessons";
import { JS_DAY_14_LESSONS } from "@/lib/js-learning/js-day-14-lessons";
import { JS_DAY_15_LESSONS } from "@/lib/js-learning/js-day-15-lessons";
import { JS_DAY_16_LESSONS } from "@/lib/js-learning/js-day-16-lessons";
import type { JsLessonDay } from "@/lib/js-learning/js-lesson-types";

const TAG_PILL =
  "rounded-full border border-[var(--border)]/60 bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--faint)]";

const LESSON_DAYS: Record<number, JsLessonDay> = {
  1: JS_DAY_1_LESSONS,
  2: JS_DAY_2_LESSONS,
  3: JS_DAY_3_LESSONS,
  4: JS_DAY_4_LESSONS,
  5: JS_DAY_5_LESSONS,
  6: JS_DAY_6_LESSONS,
  7: JS_DAY_7_LESSONS,
  8: JS_DAY_8_LESSONS,
  9: JS_DAY_9_LESSONS,
  10: JS_DAY_10_LESSONS,
  11: JS_DAY_11_LESSONS,
  12: JS_DAY_12_LESSONS,
  13: JS_DAY_13_LESSONS,
  14: JS_DAY_14_LESSONS,
  15: JS_DAY_15_LESSONS,
  16: JS_DAY_16_LESSONS,
};

export function JsRoadmap() {
  const { locale, t } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = useJsProgress();
  const [detailDay, setDetailDay] = useState<number | null>(null);
  const [lessonDay, setLessonDay] = useState<number | null>(null);

  const barWidth = useMemo(
    () => `${Math.min(100, Math.round((completedCount / JS_TOTAL_DAYS) * 100))}%`,
    [completedCount],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{t("jsRoadmap.title")}</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("jsRoadmap.subtitle")}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">{t("jsRoadmap.overallProgress")}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-[var(--text)]">
              {completedCount}/{JS_TOTAL_DAYS} {t("hub.backend.days")}
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
          {t("jsRoadmap.percentComplete")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-10" id="js-roadmap-days" aria-label={t("jsRoadmap.daysListAria")}>
        {JS_ROADMAP_WEEKS.map((week) => (
          <div key={week.id}>
            <div className="mb-4 flex items-center gap-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                {pickLocalized(week.title, locale)}
              </h2>
              <div className="flex-1 border-t border-[var(--border)]" />
              <span className="text-[10px] tabular-nums text-[var(--faint)]">{week.days.length}</span>
            </div>

            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {week.days.map((d) => {
                const checked = isDone(d.day);
                return (
                  <li
                    key={d.day}
                    className={[
                      "group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200",
                      checked
                        ? "border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_6%,var(--elevated))]"
                        : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-black/10",
                    ].join(" ")}
                  >
                    {checked && (
                      <div className="h-[2px] bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />
                    )}

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span
                          className={[
                            "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums",
                            checked
                              ? "bg-[var(--accent)]/15 text-[var(--accent)]"
                              : "border border-[var(--border)] bg-[var(--elevated)] text-[var(--faint)]",
                          ].join(" ")}
                        >
                          {String(d.day).padStart(2, "0")}
                        </span>

                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={checked}
                          onClick={(e) => { e.stopPropagation(); toggleDay(d.day); }}
                          className={[
                            "grid h-5 w-5 shrink-0 place-items-center rounded-full border transition-all duration-150",
                            checked
                              ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]"
                              : "border-[var(--border)] bg-transparent hover:border-[var(--accent)]/60",
                          ].join(" ")}
                        >
                          {checked && (
                            <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                              <path d="M2.5 6L5 8.5L9.5 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      </div>

                      <button
                        type="button"
                        aria-label={`Open details for day ${d.day}: ${stripRichMarkers(pickLocalized(d.title, locale))}`}
                        className="mt-3 flex flex-1 flex-col text-left outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                        onClick={() => (LESSON_DAYS[d.day] ? setLessonDay(d.day) : setDetailDay(d.day))}
                      >
                        <span
                          className={[
                            "text-sm font-semibold leading-snug transition-colors duration-150",
                            checked ? "text-[var(--muted)]" : "text-[var(--text)] group-hover:text-[var(--accent)]",
                          ].join(" ")}
                        >
                          <RichText text={pickLocalized(d.title, locale)} />
                        </span>

                        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                          {d.tags.map((tag) => (
                            <span key={`${d.day}-${tag.slug}`} className={TAG_PILL}>
                              <RichText text={pickLocalized(tag.label, locale)} />
                            </span>
                          ))}
                        </div>

                        <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                          <span>View lesson</span>
                          <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                            <path d="M4.5 3L8.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </button>
                    </div>

                    <span className="pointer-events-none absolute bottom-2 right-3 select-none font-mono text-7xl font-black leading-none text-[var(--text)]/[0.04]" aria-hidden>
                      {String(d.day).padStart(2, "0")}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-center gap-4" id="js-roadmap-bottom">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border)] bg-[var(--elevated)] text-[var(--muted)] shadow-inner transition hover:border-[var(--accent)] hover:text-[var(--text)]"
          aria-label="Scroll to description"
          onClick={() => document.getElementById("js-roadmap-blurb")?.scrollIntoView({ behavior: "smooth" })}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 0 1 .75.75v10.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.75A.75.75 0 0 1 10 3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <p id="js-roadmap-blurb" className="max-w-2xl text-center text-sm leading-relaxed text-[var(--muted)]">
          {t("jsRoadmap.bottomBlurb")}
        </p>
      </div>

      <DayDetailPanel
        key={detailDay === null ? "closed" : `js-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
        track="js"
      />

      {lessonDay !== null ? (
        <JsLessonDayDetail
          key={`js-lesson-day-${lessonDay}`}
          open
          onClose={() => setLessonDay(null)}
          day={LESSON_DAYS[lessonDay]}
        />
      ) : null}
    </div>
  );
}
