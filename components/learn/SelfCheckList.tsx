"use client";

import { useState } from "react";
import { RichText, RichParagraph } from "@/components/learn/RichText";
import { pickLocalized } from "@/lib/i18n/pick";
import { splitFaqAnswerIntoParagraphs } from "@/lib/faq-answer-paragraphs";
import { stripLessonTimingFromTitle } from "@/lib/learn/strip-lesson-timing";
import type { SelfCheckItem } from "@/lib/learn/self-check-types";
import type { Locale } from "@/lib/i18n/types";

export function SelfCheckList({
  items,
  idPrefix,
  heading,
  hint,
  locale,
}: {
  items: SelfCheckItem[];
  /** Namespaces the question/answer element ids so two lists can coexist. */
  idPrefix: string;
  heading: string;
  hint: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());

  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
        {heading}
        <span className="ml-1 font-mono text-[11px] font-normal text-[var(--faint)]">
          ({items.length})
        </span>
      </h3>
      <p className="mt-1 text-xs text-[var(--muted)]">{hint}</p>
      <ul className="mt-3 space-y-2" role="list">
        {items.map((item, i) => {
          const expanded = open.has(i);
          return (
            <li
              key={i}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_28%,transparent)]"
            >
              <button
                type="button"
                aria-expanded={expanded}
                id={`${idPrefix}-q-${i}`}
                aria-controls={`${idPrefix}-a-${i}`}
                onClick={() => {
                  setOpen((prev) => {
                    const next = new Set(prev);
                    if (next.has(i)) next.delete(i);
                    else next.add(i);
                    return next;
                  });
                }}
                className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)]"
              >
                <span className="min-w-0 leading-snug">
                  <span className="mr-2 font-mono text-xs text-[var(--muted)] tabular-nums">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <RichText text={stripLessonTimingFromTitle(pickLocalized(item.question, locale))} />
                </span>
                <svg
                  className={`mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
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
              </button>
              {expanded ? (
                <div
                  id={`${idPrefix}-a-${i}`}
                  role="region"
                  aria-labelledby={`${idPrefix}-q-${i}`}
                  className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
                >
                  {item.tag ? (
                    <p className="mb-3">
                      <span className="inline-flex rounded-full border border-[var(--border)]/90 bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--text)]">
                        <RichText text={pickLocalized(item.tag, locale)} />
                      </span>
                    </p>
                  ) : null}
                  <div className="space-y-3">
                    {splitFaqAnswerIntoParagraphs(pickLocalized(item.answer, locale)).map((para, pi) => (
                      <RichParagraph key={pi} text={para} />
                    ))}
                  </div>
                  {item.callout ? (
                    <blockquote className="mt-4 border-l-2 border-[var(--border)] pl-3 text-sm text-[var(--muted)]">
                      <RichText text={pickLocalized(item.callout, locale)} />
                    </blockquote>
                  ) : null}
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
