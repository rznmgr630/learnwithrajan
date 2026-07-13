"use client";

import { useState } from "react";
import type { LoksewaQA } from "@/lib/loksewa-learning/types";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path
        fillRule="evenodd"
        d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        clipRule="evenodd"
      />
    </svg>
  ) : (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.745-1.745a10.029 10.029 0 0 0 3.3-4.38 1.651 1.651 0 0 0 0-1.185A10.004 10.004 0 0 0 9.999 3a9.956 9.956 0 0 0-4.744 1.194L3.28 2.22ZM7.752 6.69l1.092 1.092a2.5 2.5 0 0 1 3.374 3.373l1.091 1.092a4 4 0 0 0-5.557-5.557Z"
        clipRule="evenodd"
      />
      <path d="M10.748 13.93l2.523 2.523a10.003 10.003 0 0 1-3.27.547c-4.258 0-7.894-2.66-9.337-6.41a1.651 1.651 0 0 1 0-1.186A10.007 10.007 0 0 1 2.839 6.02L6.07 9.252a4 4 0 0 0 4.678 4.678Z" />
    </svg>
  );
}

function ShuffleIcon() {
  return (
    <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138.75.75 0 0 0-1.449-.39Zm1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function QuestionCard({
  qa,
  revealed,
  onToggle,
}: {
  qa: LoksewaQA;
  revealed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent)]">
          {qa.id}
        </span>
        <div>
          <p className="text-sm text-[var(--text)]">{qa.questionEn}</p>
          <p className="mt-0.5 text-sm text-[var(--muted)]">{qa.questionNe}</p>
        </div>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className="mt-3 flex w-full items-center justify-between gap-2 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-left transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))]"
        aria-label={revealed ? "Hide answer" : "Show answer"}
      >
        {revealed ? (
          <span className="flex flex-col">
            <span className="text-sm font-medium text-[var(--text)]">{qa.answerEn}</span>
            <span className="text-sm text-[var(--muted)]">{qa.answerNe}</span>
          </span>
        ) : (
          <span className="text-sm tracking-widest text-[var(--faint)]">···</span>
        )}
        <EyeIcon open={revealed} />
      </button>
    </div>
  );
}

export interface QAFlashcardsProps {
  title: string;
  subtitle: string;
  items: LoksewaQA[];
}

export function QAFlashcards({ title, subtitle, items }: QAFlashcardsProps) {
  const [order, setOrder] = useState<LoksewaQA[]>(items);
  const [revealed, setRevealed] = useState<Set<number>>(new Set());

  const allShown = revealed.size === order.length;

  function toggleAll() {
    if (allShown) setRevealed(new Set());
    else setRevealed(new Set(order.map((qa) => qa.id)));
  }

  function toggleOne(id: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function shuffle() {
    setOrder((prev) => shuffleArray(prev));
    setRevealed(new Set());
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{title}</h1>
        <p className="mt-3 text-[var(--muted)]">{subtitle}</p>
      </div>

      <div className="mt-8 flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <ShuffleIcon />
          Shuffle
        </button>
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <EyeIcon open={!allShown} />
          {allShown ? "Hide All" : "Show All"}
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {order.map((qa) => (
          <QuestionCard key={qa.id} qa={qa} revealed={revealed.has(qa.id)} onToggle={() => toggleOne(qa.id)} />
        ))}
      </div>
    </div>
  );
}
