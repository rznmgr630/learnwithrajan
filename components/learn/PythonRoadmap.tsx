"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LessonDayDetail } from "@/components/learn/LessonDayDetail";
import { RawPythonLessonDay } from "@/components/learn/RawPythonLessonDay";
import { pickLocalized } from "@/lib/i18n/pick";
import type { LessonDay } from "@/lib/learn/lesson-types";
import { PYTHON_DAY_1_LESSONS } from "@/lib/python-learning/python-day-1-lessons";
import { PYTHON_DAY_2_LESSONS } from "@/lib/python-learning/python-day-2-lessons";
import { PYTHON_DAY_3_LESSONS } from "@/lib/python-learning/python-day-3-lessons";
import { PYTHON_DAY_4_LESSONS } from "@/lib/python-learning/python-day-4-lessons";
import { PYTHON_DAY_5_LESSONS } from "@/lib/python-learning/python-day-5-lessons";
import { PYTHON_DAY_6_LESSONS } from "@/lib/python-learning/python-day-6-lessons";
import { PYTHON_DAY_7_LESSONS } from "@/lib/python-learning/python-day-7-lessons";
import { PYTHON_DAY_8_LESSONS } from "@/lib/python-learning/python-day-8-lessons";
import { PYTHON_DAY_9_LESSONS } from "@/lib/python-learning/python-day-9-lessons";
import { PYTHON_DAY_10_LESSONS } from "@/lib/python-learning/python-day-10-lessons";
import { PYTHON_DAY_11_LESSONS } from "@/lib/python-learning/python-day-11-lessons";
import { PYTHON_DAY_12_LESSONS } from "@/lib/python-learning/python-day-12-lessons";
import { PYTHON_DAY_13_LESSONS } from "@/lib/python-learning/python-day-13-lessons";
import { PYTHON_DAY_14_LESSONS } from "@/lib/python-learning/python-day-14-lessons";
import { PYTHON_DAY_15_LESSONS } from "@/lib/python-learning/python-day-15-lessons";
import { PYTHON_DAY_16_LESSONS } from "@/lib/python-learning/python-day-16-lessons";
import { PYTHON_DAY_17_LESSONS } from "@/lib/python-learning/python-day-17-lessons";
import { PYTHON_DAY_18_LESSONS } from "@/lib/python-learning/python-day-18-lessons";
import { PYTHON_DAY_19_LESSONS } from "@/lib/python-learning/python-day-19-lessons";
import { PYTHON_DAY_20_LESSONS } from "@/lib/python-learning/python-day-20-lessons";
import { PYTHON_DAY_23_LESSONS } from "@/lib/python-learning/python-day-23-lessons";
import { PYTHON_ROADMAP_WEEKS, PYTHON_TOTAL_DAYS } from "@/lib/python-learning/python-challenge-data";
import { usePythonProgress } from "@/hooks/use-python-progress";

const TAG_PILL = "rounded-full border border-[var(--border)]/60 bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--faint)]";
const LESSON_DAYS = {
  1: PYTHON_DAY_1_LESSONS,
  2: PYTHON_DAY_2_LESSONS,
  3: PYTHON_DAY_3_LESSONS,
  4: PYTHON_DAY_4_LESSONS,
  5: PYTHON_DAY_5_LESSONS,
  6: PYTHON_DAY_6_LESSONS,
  7: PYTHON_DAY_7_LESSONS,
  8: PYTHON_DAY_8_LESSONS,
  9: PYTHON_DAY_9_LESSONS,
  10: PYTHON_DAY_10_LESSONS,
  11: PYTHON_DAY_11_LESSONS,
  12: PYTHON_DAY_12_LESSONS,
  13: PYTHON_DAY_13_LESSONS,
  14: PYTHON_DAY_14_LESSONS,
  15: PYTHON_DAY_15_LESSONS,
  16: PYTHON_DAY_16_LESSONS,
  17: PYTHON_DAY_17_LESSONS,
  18: PYTHON_DAY_18_LESSONS,
  19: PYTHON_DAY_19_LESSONS,
  20: PYTHON_DAY_20_LESSONS,
  23: PYTHON_DAY_23_LESSONS,
};

const COMING_SOON = { en: "Content coming soon", np: "Content coming soon", jp: "Content coming soon" };

function pendingPythonDay(day: number): LessonDay {
  const roadmapDay = PYTHON_ROADMAP_WEEKS.flatMap((phase) => phase.days).find((item) => item.day === day);

  return {
    day,
    title: roadmapDay?.title ?? COMING_SOON,
    totalMinutes: 0,
    difficulty: COMING_SOON,
    lessons: [
      {
        id: `python-day-${day}-coming-soon`,
        title: COMING_SOON,
        durationMinutes: 0,
        explanation: COMING_SOON,
        diagram: "Content coming soon",
        codeExample: { title: COMING_SOON, code: "Content coming soon" },
        keyTakeaways: [COMING_SOON],
        commonMistakes: [COMING_SOON],
        quiz: [],
        rawMiniQuiz: COMING_SOON,
      },
    ],
    finalQuiz: [],
  };
}

export function PythonRoadmap() {
  const { locale, t } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = usePythonProgress();
  const [lessonDay, setLessonDay] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{t("pythonRoadmap.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("pythonRoadmap.subtitle")}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6" suppressHydrationWarning>
        <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <span>{t("nodejsRoadmap.overallProgress")}</span>
          <span className="tabular-nums text-[var(--text)]">{completedCount}/{PYTHON_TOTAL_DAYS} {t("hub.backend.days")}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--muted)]">{percent}{t("nodejsRoadmap.percentComplete")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {PYTHON_ROADMAP_WEEKS.map((phase) => (
          <section key={phase.id}>
            <div className="mb-4 flex items-center gap-3">
              <span className={`h-2 w-2 shrink-0 rounded-full ${phase.dotClass}`} aria-hidden />
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{pickLocalized(phase.title, locale)}</h2>
              <div className="flex-1 border-t border-[var(--border)]" />
            </div>
            <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {phase.days.map((day) => {
                const checked = isDone(day.day);
                return (
                  <li key={day.day} className={`group relative flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 ${checked ? "border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_6%,var(--elevated))]" : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] hover:-translate-y-0.5 hover:border-[var(--accent)]/50 hover:shadow-xl hover:shadow-black/10"}`}>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`inline-flex items-center rounded-md px-2 py-0.5 font-mono text-[11px] font-bold tabular-nums ${checked ? "bg-[var(--accent)]/15 text-[var(--accent)]" : "border border-[var(--border)] bg-[var(--elevated)] text-[var(--faint)]"}`}>{String(day.day).padStart(2, "0")}</span>
                        <button type="button" role="checkbox" aria-label={`Mark day ${day.day} complete`} aria-checked={checked} onClick={() => toggleDay(day.day)} className={`grid h-5 w-5 place-items-center rounded-full border ${checked ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-fg)]" : "border-[var(--border)]"}`}>
                          {checked ? "✓" : null}
                        </button>
                      </div>
                      <button type="button" onClick={() => setLessonDay(day.day)} className="mt-3 flex flex-1 flex-col text-left outline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]">
                        <span className={`text-sm font-semibold leading-snug ${checked ? "text-[var(--muted)]" : "text-[var(--text)] group-hover:text-[var(--accent)]"}`}>{pickLocalized(day.title, locale)}</span>
                        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">{day.tags.map((tag) => <span key={tag.slug} className={TAG_PILL}>{pickLocalized(tag.label, locale)}</span>)}</div>
                        <span className="mt-3 text-[11px] font-medium text-[var(--accent)]">{day.day <= 15 ? "View lesson →" : "View sections →"}</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {lessonDay !== null && (lessonDay <= 10 || lessonDay === 21 || lessonDay === 22 || lessonDay === 24 || lessonDay === 25 || lessonDay === 26) ? <RawPythonLessonDay day={lessonDay} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 11 ? <LessonDayDetail open day={PYTHON_DAY_11_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 12 ? <LessonDayDetail open day={PYTHON_DAY_12_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 13 ? <LessonDayDetail open day={PYTHON_DAY_13_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 14 ? <LessonDayDetail open day={PYTHON_DAY_14_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 15 ? <LessonDayDetail open day={PYTHON_DAY_15_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 16 ? <LessonDayDetail open day={PYTHON_DAY_16_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 17 ? <LessonDayDetail open day={PYTHON_DAY_17_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 18 ? <LessonDayDetail open day={PYTHON_DAY_18_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 19 ? <LessonDayDetail open day={PYTHON_DAY_19_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 20 ? <LessonDayDetail open day={PYTHON_DAY_20_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay === 23 ? <LessonDayDetail open day={PYTHON_DAY_23_LESSONS} onClose={() => setLessonDay(null)} /> : null}
      {lessonDay !== null && lessonDay > 20 && lessonDay !== 21 && lessonDay !== 22 && lessonDay !== 23 && lessonDay !== 24 && lessonDay !== 25 && lessonDay !== 26 ? <LessonDayDetail open day={pendingPythonDay(lessonDay)} onClose={() => setLessonDay(null)} /> : null}
    </div>
  );
}
