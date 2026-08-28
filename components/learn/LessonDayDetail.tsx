"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText, RichParagraph } from "@/components/learn/RichText";
import { LessonNav, type LessonNavTarget } from "@/components/learn/LessonNav";
import { LessonVideos } from "@/components/learn/LessonVideos";
import { LessonQuiz } from "@/components/learn/LessonQuiz";
import { SelfCheckList } from "@/components/learn/SelfCheckList";
import { pickLocalized } from "@/lib/i18n/pick";
import { useJsLessonQuizProgress } from "@/hooks/use-js-lesson-quiz-progress";
import type { Lesson, LessonDay } from "@/lib/learn/lesson-types";
import { scrollOpenSectionIntoView } from "@/lib/learn/scroll-open-section";

type Tab = "explanation" | "diagram" | "code" | "takeaways" | "mistakes" | "quiz";

const TABS: { id: Tab; label: string }[] = [
  { id: "explanation", label: "Explanation" },
  { id: "diagram", label: "Visual Diagram" },
  { id: "code", label: "Code Example" },
  { id: "takeaways", label: "Key Takeaways" },
  { id: "mistakes", label: "Common Mistakes" },
  { id: "quiz", label: "Mini Quiz" },
];

function TabIcon({ id, className }: { id: Tab; className?: string }) {
  const common = { viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
  switch (id) {
    case "explanation":
      return (
        <svg className={className} {...common}>
          <line x1="3" y1="5" x2="17" y2="5" />
          <line x1="3" y1="10" x2="17" y2="10" />
          <line x1="3" y1="15" x2="11" y2="15" />
        </svg>
      );
    case "diagram":
      return (
        <svg className={className} {...common}>
          <rect x="3" y="10" width="3" height="7" rx="0.5" />
          <rect x="8.5" y="6" width="3" height="11" rx="0.5" />
          <rect x="14" y="3" width="3" height="14" rx="0.5" />
        </svg>
      );
    case "code":
      return (
        <svg className={className} {...common}>
          <polyline points="7,5 2,10 7,15" />
          <polyline points="13,5 18,10 13,15" />
        </svg>
      );
    case "takeaways":
      return (
        <svg className={className} {...common}>
          <circle cx="10" cy="10" r="7.25" />
          <polyline points="7,10 9.3,12.3 13.5,7.5" />
        </svg>
      );
    case "mistakes":
      return (
        <svg className={className} {...common}>
          <path d="M10 3.5 17.5 16.5 2.5 16.5Z" />
          <line x1="10" y1="8" x2="10" y2="11.5" />
          <circle cx="10" cy="14" r="0.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "quiz":
      return (
        <svg className={className} {...common}>
          <circle cx="10" cy="10" r="7.25" />
          <path d="M8 8.2c0-1.1.9-2 2-2s2 .8 2 2c0 1-1.2 1.4-1.6 2.1-.2.3-.3.6-.3 1" />
          <circle cx="10" cy="14" r="0.4" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

const ChevronIcon = ({ expanded }: { expanded: boolean }) => (
  <svg
    className={`h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden
  >
    <path
      fillRule="evenodd"
      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
      clipRule="evenodd"
    />
  </svg>
);

function LessonAccordionItem({
  lesson,
  index,
  locale,
  expanded,
  onToggle,
  quizIdPrefix,
}: {
  lesson: Lesson;
  index: number;
  locale: "en" | "np" | "jp";
  expanded: boolean;
  onToggle: () => void;
  quizIdPrefix: string;
}) {
  const [tab, setTab] = useState<Tab>("explanation");
  const { getResult } = useJsLessonQuizProgress();
  const quizId = `${quizIdPrefix}.${lesson.id}`;
  const quizDone = getResult(quizId);
  const itemRef = useRef<HTMLDivElement>(null);

  /** Collapsing the lesson above shifts this one, so bring it back to the top. */
  function handleToggle() {
    const willExpand = !expanded;
    onToggle();
    if (willExpand) scrollOpenSectionIntoView(itemRef.current);
  }

  return (
    <div
      ref={itemRef}
      className="shrink-0 scroll-mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)]"
    >
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={expanded}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 font-mono text-xs font-bold text-[var(--accent)]">
            {index + 1}
          </span>
          <div>
            <p className="text-sm font-semibold text-[var(--text)]">
              <RichText text={pickLocalized(lesson.title, locale)} />
            </p>
            <p className="text-xs text-[var(--muted)]">
              {lesson.durationMinutes} min
              {quizDone ? ` · Quiz: ${quizDone.score}/${quizDone.total}` : ""}
            </p>
          </div>
        </div>
        <ChevronIcon expanded={expanded} />
      </button>

      {expanded ? (
        <div className="border-t border-[var(--border)] p-5">
          <div className="flex gap-5 overflow-x-auto border-b border-[var(--border)]">
            {TABS.map((tb) => {
              const active = tab === tb.id;
              return (
                <button
                  key={tb.id}
                  type="button"
                  onClick={() => setTab(tb.id)}
                  className={`relative flex shrink-0 items-center gap-1.5 whitespace-nowrap px-0.5 pb-3 text-xs font-medium transition-colors ${
                    active ? "text-[var(--text)]" : "text-[var(--muted)] hover:text-[var(--text)]"
                  }`}
                >
                  <TabIcon id={tb.id} className={`h-4 w-4 transition-colors ${active ? "text-[var(--accent)]" : "text-[var(--faint)]"}`} />
                  {tb.label}
                  <span
                    className={`absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--accent)] transition-opacity ${
                      active ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-4">
            {tab === "explanation" ? (
              <RichParagraph
                text={pickLocalized(lesson.explanation, locale)}
                className="text-sm leading-relaxed text-[var(--text)]"
              />
            ) : null}

            {tab === "diagram" ? (
              <div className="overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950 p-3">
                <pre className="font-mono text-[11px] leading-relaxed text-zinc-100">{lesson.diagram}</pre>
              </div>
            ) : null}

            {tab === "code" ? (
              <div className="overflow-x-auto rounded-lg border border-neutral-700 bg-neutral-950">
                <div className="border-b border-neutral-700 px-3 py-1.5 text-[11px] font-medium text-zinc-400">
                  <RichText text={pickLocalized(lesson.codeExample.title, locale)} />
                </div>
                <pre className="p-3 font-mono text-[11px] leading-relaxed text-zinc-100">
                  {lesson.codeExample.code}
                </pre>
              </div>
            ) : null}

            {tab === "takeaways" ? (
              <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--text)] marker:text-[var(--accent)]">
                {lesson.keyTakeaways.map((item, i) => (
                  <li key={i}>
                    <RichText text={pickLocalized(item, locale)} />
                  </li>
                ))}
              </ul>
            ) : null}

            {tab === "mistakes" ? (
              <ul className="space-y-2">
                {lesson.commonMistakes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2 text-sm leading-relaxed text-[var(--text)]"
                  >
                    <span className="mt-0.5 shrink-0 text-amber-400">⚠</span>
                    <RichText text={pickLocalized(item, locale)} />
                  </li>
                ))}
              </ul>
            ) : null}

            {tab === "quiz" ? <LessonQuiz quizId={quizId} questions={lesson.quiz} locale={locale} /> : null}
          </div>

          {lesson.youtubeIds?.length ? (
            <LessonVideos
              videos={lesson.youtubeIds.map((id) => ({ id }))}
              title={pickLocalized(lesson.title, locale)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function LessonDayDetail({
  open,
  onClose,
  day,
  previousDay,
  nextDay,
  onNavigateDay,
  track = "js",
}: {
  open: boolean;
  onClose: () => void;
  day: LessonDay;
  previousDay?: LessonNavTarget | null;
  nextDay?: LessonNavTarget | null;
  onNavigateDay?: (day: number) => void;
  /** Namespaces stored quiz scores, so two tracks' day 3 do not collide. */
  track?: string;
}) {
  const { locale, t } = useLocale();
  const quizIdPrefix = `${track}-day-${day.day}`;
  const [expandedLesson, setExpandedLesson] = useState<number | null>(0);
  const { getResult } = useJsLessonQuizProgress();
  const finalResult = getResult(`${quizIdPrefix}.final`);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close day detail"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div>
            <h2 className="text-lg font-semibold leading-snug text-[var(--text)]">
              📚 Day {day.day} — <RichText text={pickLocalized(day.title, locale)} />
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
              <span>⏱ {day.totalMinutes} min</span>
              <span>🎯 {pickLocalized(day.difficulty, locale)}</span>
              <span>📖 {day.lessons.length} lessons</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto overscroll-y-contain p-5">
          {day.lessons.map((lesson, i) => (
            <LessonAccordionItem
              key={lesson.id}
              lesson={lesson}
              index={i}
              locale={locale}
              expanded={expandedLesson === i}
              onToggle={() => setExpandedLesson((prev) => (prev === i ? null : i))}
              quizIdPrefix={quizIdPrefix}
            />
          ))}

          {day.selfCheck?.length ? (
            <SelfCheckList
              key={quizIdPrefix}
              items={day.selfCheck}
              idPrefix={`${quizIdPrefix}-selfcheck`}
              heading={t("backendDetail.selfCheckHeading")}
              hint={t("backendDetail.selfCheckHint")}
              locale={locale}
            />
          ) : null}

          <div className="mt-2 shrink-0 rounded-2xl border border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_6%,var(--elevated))] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[var(--text)]">🏁 Final Quiz</h3>
              <span className="text-xs font-medium text-[var(--muted)]">
                {day.finalQuiz.length} Questions
                {finalResult ? ` · Completed ${finalResult.score}/${finalResult.total}` : ""}
              </span>
            </div>
            <div className="mt-4">
              <LessonQuiz quizId={`${quizIdPrefix}.final`} questions={day.finalQuiz} locale={locale} />
            </div>
          </div>

          {day.practice?.length ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t("jpDetail.practiceChecklist")}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--muted)]">
                {day.practice.map((line, i) => (
                  <li key={i} className="pl-1">
                    <RichText text={pickLocalized(line, locale)} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {onNavigateDay ? (
            <LessonNav
              previous={previousDay}
              next={nextDay}
              onNavigate={(target) => {
                if (target.day !== undefined) onNavigateDay(target.day);
              }}
            />
          ) : null}
        </div>
      </aside>
    </div>
  );
}
