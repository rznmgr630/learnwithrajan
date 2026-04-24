"use client";

import { useEffect, useState } from "react";
import { DayDetailBlockRenderer } from "@/components/learn/DayDetailBlockRenderer";
import { RichText } from "@/components/learn/RichText";
import { getRoadmapDayContext, resolveDayDetail } from "@/lib/challenge-data";
import { splitFaqAnswerIntoParagraphs } from "@/lib/faq-answer-paragraphs";

type DayDetailPanelProps = {
  dayNumber: number | null;
  onClose: () => void;
  isDone: (day: number) => boolean;
  onToggleDone: (day: number) => void;
};

function overviewParagraphs(overview: string | string[]): string[] {
  return Array.isArray(overview) ? overview : [overview];
}

export function DayDetailPanel({ dayNumber, onClose, isDone, onToggleDone }: DayDetailPanelProps) {
  const open = dayNumber !== null;
  const ctx = dayNumber !== null ? getRoadmapDayContext(dayNumber) : null;
  const detail = ctx ? resolveDayDetail(ctx.day) : null;
  const [openFaq, setOpenFaq] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !ctx || !detail || dayNumber === null) return null;

  const done = isDone(dayNumber);
  const intro = overviewParagraphs(detail.overview);
  const faq = detail.faq ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close day detail"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-800 p-5">
          <div>
            <p className="text-xs font-medium text-neutral-500">{ctx.weekTitle}</p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-neutral-100">
              Day {ctx.day.day}: {ctx.day.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-neutral-400 transition hover:bg-neutral-800 hover:text-neutral-100"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2">
            {ctx.day.tags.map((t) => (
              <span
                key={`${ctx.day.day}-${t.slug}`}
                className="rounded-full border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs font-medium text-neutral-300"
              >
                {t.label}
              </span>
            ))}
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">Overview</h3>
            <div className="mt-2 space-y-3 text-sm leading-relaxed text-neutral-300">
              {intro.map((p, i) => (
                <p key={i}>
                  <RichText text={p} />
                </p>
              ))}
            </div>
          </div>

          {detail.sections?.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                {sec.title}
              </h3>
              {sec.blocks && sec.blocks.length > 0 ? (
                <DayDetailBlockRenderer blocks={sec.blocks} />
              ) : sec.items && sec.items.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-300 marker:text-neutral-500">
                  {sec.items.map((line, i) => (
                    <li key={i} className="pl-1">
                      <RichText text={line} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {faq.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Self-check questions
                {faq.length > 0 ? (
                  <span className="ml-1 font-mono text-[11px] font-normal text-neutral-600">
                    ({faq.length})
                  </span>
                ) : null}
              </h3>
              <p className="mt-1 text-xs text-neutral-500">
                All collapsed by default — click a question to reveal its answer; click again to hide
                it. You can keep several open at once.
              </p>
              <ul className="mt-3 space-y-2" role="list">
                {faq.map((item, i) => {
                  const expanded = openFaq.has(i);
                  return (
                    <li
                      key={i}
                      className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/25"
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        id={`faq-q-${dayNumber}-${i}`}
                        aria-controls={`faq-a-${dayNumber}-${i}`}
                        onClick={() => {
                          setOpenFaq((prev) => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i);
                            else next.add(i);
                            return next;
                          });
                        }}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-neutral-100 transition hover:bg-neutral-800/40"
                      >
                        <span className="min-w-0 leading-snug">
                          <span className="mr-2 font-mono text-xs text-neutral-500 tabular-nums">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          <RichText text={item.question} />
                        </span>
                        <svg
                          className={`mt-0.5 h-5 w-5 shrink-0 text-neutral-500 transition-transform ${expanded ? "rotate-180" : ""}`}
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
                          id={`faq-a-${dayNumber}-${i}`}
                          role="region"
                          aria-labelledby={`faq-q-${dayNumber}-${i}`}
                          className="border-t border-neutral-800 px-4 py-3 text-sm leading-relaxed text-neutral-300"
                        >
                          {item.tag ? (
                            <p className="mb-3">
                              <span className="inline-flex rounded-full border border-neutral-700/90 bg-neutral-800/50 px-2.5 py-0.5 text-xs font-medium text-neutral-200">
                                {item.tag}
                              </span>
                            </p>
                          ) : null}
                          <div className="space-y-3">
                            {splitFaqAnswerIntoParagraphs(item.answer).map((para, pi) => (
                              <p key={pi}>
                                <RichText text={para} />
                              </p>
                            ))}
                          </div>
                          {item.callout ? (
                            <blockquote className="mt-4 border-l-2 border-neutral-600 pl-3 text-sm text-neutral-400">
                              <RichText text={item.callout} />
                            </blockquote>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {detail.bullets && detail.bullets.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Practice checklist
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-neutral-300 marker:text-neutral-500">
                {detail.bullets.map((line, i) => (
                  <li key={i} className="pl-1">
                    <RichText text={line} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="border-t border-neutral-800 p-5">
          <button
            type="button"
            onClick={() => onToggleDone(dayNumber)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
              done
                ? "bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
                : "bg-sky-600 text-white hover:bg-sky-500",
            ].join(" ")}
          >
            {done ? "Mark as not done" : "Mark day as done"}
          </button>
        </div>
      </aside>
    </div>
  );
}
