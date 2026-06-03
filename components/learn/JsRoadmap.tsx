"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import { stripRichMarkers } from "@/lib/learn/strip-rich-markers";
import { pickLocalized } from "@/lib/i18n/pick";
import { DayDetailPanel } from "@/components/learn/DayDetailPanel";
import { getAllJsRoadmapDays, JS_TOTAL_DAYS } from "@/lib/js-learning/js-challenge-data";
import { useJsProgress } from "@/hooks/use-js-progress";

const TAG_PILL =
  "rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_85%,transparent)] px-2 py-0.5 text-[11px] font-medium text-[var(--muted)]";

export function JsRoadmap() {
  const { locale } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = useJsProgress();
  const [detailDay, setDetailDay] = useState<number | null>(null);

  const barWidth = useMemo(
    () => `${Math.min(100, Math.round((completedCount / JS_TOTAL_DAYS) * 100))}%`,
    [completedCount],
  );

  const allDays = useMemo(() => getAllJsRoadmapDays(), []);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
            JavaScript · Fundamentals to Senior
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            25 days covering variables, closures, prototypes, async, event loop, TypeScript, and senior internals.
          </p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-[var(--muted)]">Overall progress</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-[var(--text)]">
              {completedCount}/{JS_TOTAL_DAYS} days
            </span>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
            style={{ width: barWidth }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-[var(--muted)]">{percent}% complete</p>
      </div>

      <ul
        className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
        id="js-roadmap-days"
        aria-label="JavaScript course days"
      >
        {allDays.map((d) => {
          const checked = isDone(d.day);
          return (
            <li
              key={d.day}
              className="flex flex-col rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] p-4 transition hover:border-[var(--accent)]"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-medium text-[var(--muted)]">Day {d.day}</span>
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  onClick={() => toggleDay(d.day)}
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
                aria-label={`Open details for day ${d.day}: ${stripRichMarkers(pickLocalized(d.title, locale))}`}
                className="mt-3 flex flex-1 flex-col rounded-lg text-left outline-offset-2 ring-offset-[var(--background)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--accent)]"
                onClick={() => setDetailDay(d.day)}
              >
                <span className="text-sm font-semibold leading-snug text-[var(--text)]">
                  <RichText text={pickLocalized(d.title, locale)} />
                </span>
                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {d.tags.map((tag) => (
                    <span key={`${d.day}-${tag.slug}`} className={TAG_PILL}>
                      <RichText text={pickLocalized(tag.label, locale)} />
                    </span>
                  ))}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <DayDetailPanel
        key={detailDay === null ? "closed" : `js-day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
        track="nodejs"
      />
    </div>
  );
}
