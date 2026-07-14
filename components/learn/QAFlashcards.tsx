"use client";

import { useState } from "react";
import type { QAFlashcardItem } from "@/lib/qa-flashcards-types";
import { EyeIcon, ShuffleIcon } from "@/components/learn/reveal-icons";
import { FuriganaText } from "@/components/learn/FuriganaText";

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
  displayNumber,
  revealed,
  onToggle,
}: {
  qa: QAFlashcardItem;
  displayNumber: number;
  revealed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 shrink-0 rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs font-semibold tabular-nums text-[var(--accent)]">
          {displayNumber}
        </span>
        <div>
          <p className="text-sm text-[var(--text)]">
            <FuriganaText text={qa.questionEn} />
          </p>
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
            <span className="text-sm font-medium text-[var(--text)]">
              <FuriganaText text={qa.answerEn} />
            </span>
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
  items: QAFlashcardItem[];
}

export function QAFlashcards({ title, subtitle, items }: QAFlashcardsProps) {
  const [order, setOrder] = useState<QAFlashcardItem[]>(items);
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
        {order.map((qa, index) => (
          <QuestionCard
            key={qa.id}
            qa={qa}
            displayNumber={index + 1}
            revealed={revealed.has(qa.id)}
            onToggle={() => toggleOne(qa.id)}
          />
        ))}
      </div>
    </div>
  );
}
