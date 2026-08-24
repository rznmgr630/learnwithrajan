"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export type LessonNavTarget = {
  /** Rendered as "Day 3" above the title. Omit for content that isn't day-based. */
  day?: number;
  /** Already-localized, plain-text title for the target. */
  title: string;
  /** Route to link to. Omit to fall back to the onNavigate callback. */
  href?: string;
};

type LessonNavProps = {
  previous?: LessonNavTarget | null;
  next?: LessonNavTarget | null;
  /** Used for targets without an href, e.g. a drawer that swaps content in place. */
  onNavigate?: (target: LessonNavTarget) => void;
};

const cardClass =
  "group flex min-w-0 flex-col gap-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-left transition hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5";

/**
 * Previous/next footer shared by roadmap day drawers and syllabus doc pages.
 * Purely presentational: the caller resolves which targets are reachable and
 * supplies localized titles, so the same footer works for any track.
 */
export function LessonNav({ previous, next, onNavigate }: LessonNavProps) {
  const { t, tParams } = useLocale();

  if (!previous && !next) return null;

  function label(target: LessonNavTarget, direction: "previous" | "next") {
    const ariaKey =
      target.day === undefined
        ? (`lessonNav.${direction}ItemAria` as const)
        : (`lessonNav.${direction}Aria` as const);
    return tParams(ariaKey, { day: target.day ?? "", title: target.title });
  }

  function body(target: LessonNavTarget, direction: "previous" | "next") {
    return (
      <>
        <span className="text-[11px] font-medium text-[var(--muted)] transition group-hover:text-[var(--accent)]">
          {direction === "previous" ? `← ${t("lessonNav.previous")}` : `${t("lessonNav.next")} →`}
        </span>
        {target.day === undefined ? (
          <span className="max-w-full truncate text-sm font-semibold text-[var(--text)]">{target.title}</span>
        ) : (
          <>
            <span className="max-w-full truncate text-sm font-semibold text-[var(--text)]">
              {tParams("lessonNav.dayLabel", { day: target.day })}
            </span>
            <span className="max-w-full truncate text-xs text-[var(--muted)]">{target.title}</span>
          </>
        )}
      </>
    );
  }

  function card(target: LessonNavTarget, direction: "previous" | "next") {
    const className = direction === "next" ? `${cardClass} sm:items-end sm:text-right` : cardClass;

    if (target.href) {
      return (
        <Link href={target.href} className={className} aria-label={label(target, direction)}>
          {body(target, direction)}
        </Link>
      );
    }

    return (
      <button
        type="button"
        onClick={() => onNavigate?.(target)}
        className={className}
        aria-label={label(target, direction)}
      >
        {body(target, direction)}
      </button>
    );
  }

  return (
    <nav aria-label={t("lessonNav.label")} className="mt-2 grid gap-2 sm:grid-cols-2">
      {previous ? card(previous, "previous") : <span aria-hidden className="hidden sm:block" />}
      {next ? card(next, "next") : null}
    </nav>
  );
}
