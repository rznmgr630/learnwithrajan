"use client";

import { useEffect } from "react";
import { JapaneseDetailBlockRenderer } from "@/components/learn/JapaneseDetailBlockRenderer";
import { RichText } from "@/components/learn/RichText";
import {
  getJapaneseN5DayContext,
  resolveJapaneseN5Detail,
} from "@/lib/japanese-learning/japanese-n5-data";

type Props = {
  dayNumber: number | null;
  onClose: () => void;
  isDone: (day: number) => boolean;
  onToggleDone: (day: number) => void;
};

function overviewParagraphs(overview: string | string[]): string[] {
  return Array.isArray(overview) ? overview : [overview];
}

export function JapaneseDayDetailPanel({ dayNumber, onClose, isDone, onToggleDone }: Props) {
  const open = dayNumber !== null;
  const ctx = dayNumber !== null ? getJapaneseN5DayContext(dayNumber) : null;
  const detail = ctx ? resolveJapaneseN5Detail(ctx.day) : null;

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

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close lesson detail"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-neutral-800 bg-neutral-950 shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-neutral-800 p-5">
          <div>
            <p className="text-xs font-medium text-rose-400/90">{ctx.weekTitle}</p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
              JLPT N5 · Minna no Nihongo I track
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-neutral-100">
              {ctx.day.title}
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
                className="rounded-full border border-rose-900/40 bg-rose-950/30 px-2.5 py-1 text-xs font-medium text-rose-100/95"
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
                <JapaneseDetailBlockRenderer blocks={sec.blocks} />
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
                : "bg-rose-600 text-white hover:bg-rose-500",
            ].join(" ")}
          >
            {done ? "Mark as not done" : "Mark day as done"}
          </button>
        </div>
      </aside>
    </div>
  );
}
