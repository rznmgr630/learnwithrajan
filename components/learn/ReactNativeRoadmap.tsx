"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import { stripRichMarkers } from "@/lib/learn/strip-rich-markers";
import { pickLocalized } from "@/lib/i18n/pick";
import { DayDetailPanel } from "@/components/learn/DayDetailPanel";
import { LessonDayDetail } from "@/components/learn/LessonDayDetail";
import type { LessonDay } from "@/lib/learn/lesson-types";
import { REACT_NATIVE_PHASE_0_LESSONS } from "@/lib/react-native-learning/react-native-phase-0-lessons";
import { REACT_NATIVE_DAY_1_LESSONS } from "@/lib/react-native-learning/react-native-day-1-lessons";
import { REACT_NATIVE_DAY_2_LESSONS } from "@/lib/react-native-learning/react-native-day-2-lessons";
import { REACT_NATIVE_DAY_3_LESSONS } from "@/lib/react-native-learning/react-native-day-3-lessons";
import { REACT_NATIVE_DAY_4_LESSONS } from "@/lib/react-native-learning/react-native-day-4-lessons";
import { REACT_NATIVE_DAY_5_LESSONS } from "@/lib/react-native-learning/react-native-day-5-lessons";
import { REACT_NATIVE_DAY_6_LESSONS } from "@/lib/react-native-learning/react-native-day-6-lessons";
import { REACT_NATIVE_DAY_7_LESSONS } from "@/lib/react-native-learning/react-native-day-7-lessons";
import { REACT_NATIVE_DAY_8_LESSONS } from "@/lib/react-native-learning/react-native-day-8-lessons";
import { REACT_NATIVE_DAY_9_LESSONS } from "@/lib/react-native-learning/react-native-day-9-lessons";
import { REACT_NATIVE_DAY_10_LESSONS } from "@/lib/react-native-learning/react-native-day-10-lessons";
import { REACT_NATIVE_DAY_11_LESSONS } from "@/lib/react-native-learning/react-native-day-11-lessons";
import { REACT_NATIVE_DAY_12_LESSONS } from "@/lib/react-native-learning/react-native-day-12-lessons";
import { REACT_NATIVE_DAY_13_LESSONS } from "@/lib/react-native-learning/react-native-day-13-lessons";
import { REACT_NATIVE_DAY_14_LESSONS } from "@/lib/react-native-learning/react-native-day-14-lessons";
import { REACT_NATIVE_DAY_15_LESSONS } from "@/lib/react-native-learning/react-native-day-15-lessons";
import { REACT_NATIVE_DAY_16_LESSONS } from "@/lib/react-native-learning/react-native-day-16-lessons";
import { REACT_NATIVE_DAY_17_LESSONS } from "@/lib/react-native-learning/react-native-day-17-lessons";
import { REACT_NATIVE_DAY_18_LESSONS } from "@/lib/react-native-learning/react-native-day-18-lessons";
import { REACT_NATIVE_DAY_19_LESSONS } from "@/lib/react-native-learning/react-native-day-19-lessons";
import { REACT_NATIVE_DAY_20_LESSONS } from "@/lib/react-native-learning/react-native-day-20-lessons";
import { REACT_NATIVE_DAY_21_LESSONS } from "@/lib/react-native-learning/react-native-day-21-lessons";
import { REACT_NATIVE_DAY_22_LESSONS } from "@/lib/react-native-learning/react-native-day-22-lessons";
import { REACT_NATIVE_DAY_23_LESSONS } from "@/lib/react-native-learning/react-native-day-23-lessons";
import { REACT_NATIVE_DAY_24_LESSONS } from "@/lib/react-native-learning/react-native-day-24-lessons";
import { REACT_NATIVE_DAY_25_LESSONS } from "@/lib/react-native-learning/react-native-day-25-lessons";
import { REACT_NATIVE_DAY_26_LESSONS } from "@/lib/react-native-learning/react-native-day-26-lessons";
import { REACT_NATIVE_DAY_27_LESSONS } from "@/lib/react-native-learning/react-native-day-27-lessons";
import { REACT_NATIVE_DAY_28_LESSONS } from "@/lib/react-native-learning/react-native-day-28-lessons";
import { REACT_NATIVE_DAY_29_LESSONS } from "@/lib/react-native-learning/react-native-day-29-lessons";
import { REACT_NATIVE_DAY_30_LESSONS } from "@/lib/react-native-learning/react-native-day-30-lessons";
import { REACT_NATIVE_DAY_31_LESSONS } from "@/lib/react-native-learning/react-native-day-31-lessons";
import { REACT_NATIVE_DAY_32_LESSONS } from "@/lib/react-native-learning/react-native-day-32-lessons";
import { REACT_NATIVE_DAY_33_LESSONS } from "@/lib/react-native-learning/react-native-day-33-lessons";
import { REACT_NATIVE_DAY_34_LESSONS } from "@/lib/react-native-learning/react-native-day-34-lessons";
import { REACT_NATIVE_DAY_35_LESSONS } from "@/lib/react-native-learning/react-native-day-35-lessons";
import { REACT_NATIVE_DAY_36_LESSONS } from "@/lib/react-native-learning/react-native-day-36-lessons";
import { REACT_NATIVE_DAY_37_LESSONS } from "@/lib/react-native-learning/react-native-day-37-lessons";
import { REACT_NATIVE_DAY_38_LESSONS } from "@/lib/react-native-learning/react-native-day-38-lessons";
import { REACT_NATIVE_DAY_39_LESSONS } from "@/lib/react-native-learning/react-native-day-39-lessons";
import { REACT_NATIVE_DAY_40_LESSONS } from "@/lib/react-native-learning/react-native-day-40-lessons";
import { REACT_NATIVE_DAY_41_LESSONS } from "@/lib/react-native-learning/react-native-day-41-lessons";
import { REACT_NATIVE_DAY_42_LESSONS } from "@/lib/react-native-learning/react-native-day-42-lessons";
import { REACT_NATIVE_DAY_43_LESSONS } from "@/lib/react-native-learning/react-native-day-43-lessons";
import { REACT_NATIVE_DAY_44_LESSONS } from "@/lib/react-native-learning/react-native-day-44-lessons";
import { REACT_NATIVE_DAY_45_LESSONS } from "@/lib/react-native-learning/react-native-day-45-lessons";
import {
  REACT_NATIVE_TOTAL_DAYS,
  REACT_NATIVE_ROADMAP_WEEKS,
} from "@/lib/react-native-learning/react-native-challenge-data";
import { useReactNativeProgress } from "@/hooks/use-react-native-progress";

const TAG_PILL =
  "rounded-full border border-[var(--border)]/60 bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--faint)]";

const dayGridClass = "grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3";

const REACT_NATIVE_LESSON_DAYS: Record<number, LessonDay> = {
  0: REACT_NATIVE_PHASE_0_LESSONS,
  1: REACT_NATIVE_DAY_1_LESSONS,
  2: REACT_NATIVE_DAY_2_LESSONS,
  3: REACT_NATIVE_DAY_3_LESSONS,
  4: REACT_NATIVE_DAY_4_LESSONS,
  5: REACT_NATIVE_DAY_5_LESSONS,
  6: REACT_NATIVE_DAY_6_LESSONS,
  7: REACT_NATIVE_DAY_7_LESSONS,
  8: REACT_NATIVE_DAY_8_LESSONS,
  9: REACT_NATIVE_DAY_9_LESSONS,
  10: REACT_NATIVE_DAY_10_LESSONS,
  11: REACT_NATIVE_DAY_11_LESSONS,
  12: REACT_NATIVE_DAY_12_LESSONS,
  13: REACT_NATIVE_DAY_13_LESSONS,
  14: REACT_NATIVE_DAY_14_LESSONS,
  15: REACT_NATIVE_DAY_15_LESSONS,
  16: REACT_NATIVE_DAY_16_LESSONS,
  17: REACT_NATIVE_DAY_17_LESSONS,
  18: REACT_NATIVE_DAY_18_LESSONS,
  19: REACT_NATIVE_DAY_19_LESSONS,
  20: REACT_NATIVE_DAY_20_LESSONS,
  21: REACT_NATIVE_DAY_21_LESSONS,
  22: REACT_NATIVE_DAY_22_LESSONS,
  23: REACT_NATIVE_DAY_23_LESSONS,
  24: REACT_NATIVE_DAY_24_LESSONS,
  25: REACT_NATIVE_DAY_25_LESSONS,
  26: REACT_NATIVE_DAY_26_LESSONS,
  27: REACT_NATIVE_DAY_27_LESSONS,
  28: REACT_NATIVE_DAY_28_LESSONS,
  29: REACT_NATIVE_DAY_29_LESSONS,
  30: REACT_NATIVE_DAY_30_LESSONS,
  31: REACT_NATIVE_DAY_31_LESSONS,
  32: REACT_NATIVE_DAY_32_LESSONS,
  33: REACT_NATIVE_DAY_33_LESSONS,
  34: REACT_NATIVE_DAY_34_LESSONS,
  35: REACT_NATIVE_DAY_35_LESSONS,
  36: REACT_NATIVE_DAY_36_LESSONS,
  37: REACT_NATIVE_DAY_37_LESSONS,
  38: REACT_NATIVE_DAY_38_LESSONS,
  39: REACT_NATIVE_DAY_39_LESSONS,
  40: REACT_NATIVE_DAY_40_LESSONS,
  41: REACT_NATIVE_DAY_41_LESSONS,
  42: REACT_NATIVE_DAY_42_LESSONS,
  43: REACT_NATIVE_DAY_43_LESSONS,
  44: REACT_NATIVE_DAY_44_LESSONS,
  45: REACT_NATIVE_DAY_45_LESSONS,
};

export function ReactNativeRoadmap() {
  const { locale, t } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = useReactNativeProgress();
  const [detailDay, setDetailDay] = useState<number | null>(null);
  const [lessonDay, setLessonDay] = useState<number | null>(null);

  const barWidth = useMemo(
    () => `${Math.min(100, Math.round((completedCount / REACT_NATIVE_TOTAL_DAYS) * 100))}%`,
    [completedCount],
  );

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
            {t("reactNativeRoadmap.title")}
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">{t("reactNativeRoadmap.subtitle")}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">{t("reactNativeRoadmap.overallProgress")}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-[var(--text)]">
              {completedCount}/{REACT_NATIVE_TOTAL_DAYS} {t("hub.backend.days")}
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
          {t("reactNativeRoadmap.percentComplete")}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-10" id="react-native-roadmap-days" aria-label={t("reactNativeRoadmap.daysListAria")}>
        {REACT_NATIVE_ROADMAP_WEEKS.map((week) => (
          <section key={week.id}>
            <div className="mb-4 flex items-center gap-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                {pickLocalized(week.title, locale)}
              </h2>
              <div className="flex-1 border-t border-[var(--border)]" />
              <span className="text-[10px] tabular-nums text-[var(--faint)]">{week.days.length}</span>
            </div>
            <ul className={dayGridClass}>
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
                        onClick={() => (REACT_NATIVE_LESSON_DAYS[d.day] ? setLessonDay(d.day) : setDetailDay(d.day))}
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
          </section>
        ))}
      </div>

      {lessonDay !== null && (
        <LessonDayDetail
          key={`react-native-lesson-day-${lessonDay}`}
          open
          onClose={() => setLessonDay(null)}
          day={REACT_NATIVE_LESSON_DAYS[lessonDay]}
          track="react-native"
        />
      )}

      <DayDetailPanel
        key={detailDay === null ? "closed" : `rn-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
        onNavigateDay={setDetailDay}
        track="react-native"
      />
    </div>
  );
}
