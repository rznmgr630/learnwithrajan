"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { LessonDayDetail } from "@/components/learn/LessonDayDetail";
import { pickLocalized } from "@/lib/i18n/pick";
import { NODEJS_DAY_1_LESSONS as NESTJS_DAY_1_LESSONS } from "@/lib/nestjs-learning/nestjs-day-1-lessons";
import { TYPESCRIPT_DAY_2_LESSONS } from "@/lib/nestjs-learning/nestjs-day-2-lessons";
import { TYPESCRIPT_DAY_3_LESSONS } from "@/lib/nestjs-learning/nestjs-day-3-lessons";
import { HTTP_DAY_4_LESSONS } from "@/lib/nestjs-learning/nestjs-day-4-lessons";
import { REST_DAY_5_LESSONS } from "@/lib/nestjs-learning/nestjs-day-5-lessons";
import { NESTJS_DAY_6_LESSONS } from "@/lib/nestjs-learning/nestjs-day-6-lessons";
import { NESTJS_DAY_7_LESSONS } from "@/lib/nestjs-learning/nestjs-day-7-lessons";
import { NESTJS_ROADMAP_WEEKS, NESTJS_TOTAL_DAYS } from "@/lib/nestjs-learning/nestjs-challenge-data";
import { useNestjsProgress } from "@/hooks/use-nestjs-progress";

const TAG_PILL = "rounded-full border border-[var(--border)]/60 bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-2 py-0.5 text-[10px] font-medium tracking-wide text-[var(--faint)]";
const LESSON_DAYS = { 1: NESTJS_DAY_1_LESSONS, 2: TYPESCRIPT_DAY_2_LESSONS, 3: TYPESCRIPT_DAY_3_LESSONS, 4: HTTP_DAY_4_LESSONS, 5: REST_DAY_5_LESSONS, 6: NESTJS_DAY_6_LESSONS, 7: NESTJS_DAY_7_LESSONS };

export function NestjsRoadmap() {
  const { locale, t } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = useNestjsProgress();
  const [lessonDay, setLessonDay] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{t("nestjsRoadmap.title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("nestjsRoadmap.subtitle")}</p>
      </div>

      <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6" suppressHydrationWarning>
        <div className="flex items-center justify-between gap-3 text-sm text-[var(--muted)]">
          <span>{t("nodejsRoadmap.overallProgress")}</span>
          <span className="tabular-nums text-[var(--text)]">{completedCount}/{NESTJS_TOTAL_DAYS} {t("hub.backend.days")}</span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
          <div className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--muted)]">{percent}{t("nodejsRoadmap.percentComplete")}</p>
      </div>

      <div className="mt-8 flex flex-col gap-10">
        {NESTJS_ROADMAP_WEEKS.map((phase) => (
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
                        <span className="mt-3 text-[11px] font-medium text-[var(--accent)]">View lesson →</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>

      {lessonDay !== null ? <LessonDayDetail open onClose={() => setLessonDay(null)} day={LESSON_DAYS[lessonDay as keyof typeof LESSON_DAYS]} previousDay={lessonDay > 1 ? { day: lessonDay - 1, title: pickLocalized(LESSON_DAYS[(lessonDay - 1) as keyof typeof LESSON_DAYS].title, locale) } : null} nextDay={lessonDay < NESTJS_TOTAL_DAYS ? { day: lessonDay + 1, title: pickLocalized(LESSON_DAYS[(lessonDay + 1) as keyof typeof LESSON_DAYS].title, locale) } : null} onNavigateDay={setLessonDay} track="nestjs" /> : null}
    </div>
  );
}
