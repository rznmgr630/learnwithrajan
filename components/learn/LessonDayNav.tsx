"use client";

import { useLocale } from "@/components/i18n/LocaleProvider";

export type LessonDayNavTarget = {
  day: number;
  /** Already-localized, plain-text title for the target day. */
  title: string;
};

type LessonDayNavProps = {
  previous?: LessonDayNavTarget | null;
  next?: LessonDayNavTarget | null;
  onNavigate: (day: number) => void;
};

const cardClass =
  "group flex min-w-0 flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-left transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5";

/**
 * Previous/next day footer shared by every roadmap day detail view. Purely
 * presentational: the caller resolves which days are reachable and what the
 * titles say, so the same footer works for any track.
 */
export function LessonDayNav({ previous, next, onNavigate }: LessonDayNavProps) {
  const { t, tParams } = useLocale();

  if (!previous && !next) return null;

  return (
    <nav aria-label={t("lessonNav.label")} className="mt-2 grid gap-2 sm:grid-cols-2">
      {previous ? (
        <button
          type="button"
          onClick={() => onNavigate(previous.day)}
          className={cardClass}
          aria-label={tParams("lessonNav.previousAria", { day: previous.day, title: previous.title })}
        >
          <span className="text-[11px] font-medium text-[var(--muted)] transition group-hover:text-[var(--accent)]">
            ← {t("lessonNav.previous")}
          </span>
          <span className="truncate text-sm font-semibold text-[var(--text)]">
            {tParams("lessonNav.dayLabel", { day: previous.day })}
          </span>
          <span className="truncate text-xs text-[var(--muted)]">{previous.title}</span>
        </button>
      ) : (
        <span aria-hidden className="hidden sm:block" />
      )}

      {next ? (
        <button
          type="button"
          onClick={() => onNavigate(next.day)}
          className={`${cardClass} sm:items-end sm:text-right`}
          aria-label={tParams("lessonNav.nextAria", { day: next.day, title: next.title })}
        >
          <span className="text-[11px] font-medium text-[var(--muted)] transition group-hover:text-[var(--accent)]">
            {t("lessonNav.next")} →
          </span>
          <span className="max-w-full truncate text-sm font-semibold text-[var(--text)]">
            {tParams("lessonNav.dayLabel", { day: next.day })}
          </span>
          <span className="max-w-full truncate text-xs text-[var(--muted)]">{next.title}</span>
        </button>
      ) : null}
    </nav>
  );
}
