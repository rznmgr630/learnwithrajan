"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { EyeIcon, ShuffleIcon } from "@/components/learn/reveal-icons";

const PAGE_NUMBERS = [
  [1, 12],
  [2, 8],
  [3, 6],
  [4, 29],
  [5, 57],
  [6, 5],
  [7, 3],
  [8, 15],
  [9, 74],
  [10, 2],
  [11, 6],
  [12, 97],
  [13, 45],
  [14, 5],
  [15, 7],
  [16, 16],
  [17, 73],
  [22, 26],
  [23, 42],
  [24, 35],
  [25, 96],
] as const;

export function PageNumberReferencePage() {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [order, setOrder] = useState(() => [...PAGE_NUMBERS]);
  const allShown = revealed.size === order.length;

  function toggleAll() {
    if (allShown) setRevealed(new Set());
    else setRevealed(new Set(PAGE_NUMBERS.map(([page]) => page)));
  }

  function toggleNumber(page: number) {
    setRevealed((previous) => {
      const next = new Set(previous);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  }

  function shuffle() {
    setOrder((previous) => {
      const next = [...previous];
      for (let index = next.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [next[index], next[randomIndex]] = [next[randomIndex], next[index]];
      }
      return next;
    });
    setRevealed(new Set());
  }

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/personal-development" labelKey="learn.backPersonalDevelopment" />
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          Personal Development
        </span>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Page Number Reference</h1>
        <p className="mt-2 text-[var(--muted)]">A clean table of the page and number pairs from your notes.</p>

        <div className="mt-8 flex justify-end gap-2">
          <a
            href="https://drive.google.com/file/d/1jIQpt9RW7NzS7RUbf8jNKEzNVGKM8wgE/view?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            Resource ↗
          </a>
          <button
            type="button"
            onClick={shuffle}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            <ShuffleIcon />
            Random
          </button>
          <button
            type="button"
            onClick={toggleAll}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-2 text-xs font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            <EyeIcon open={!allShown} />
            {allShown ? "Hide all numbers" : "Show all numbers"}
          </button>
        </div>

        <div className="mt-2 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-sm">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)] text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
              <tr>
                <th scope="col" className="px-5 py-3 font-medium">Page</th>
                <th scope="col" className="px-5 py-3 font-medium">Number</th>
              </tr>
            </thead>
            <tbody>
              {order.map(([page, number]) => {
                const shown = revealed.has(page);

                return (
                  <tr key={page} className="border-t border-[var(--border)] text-[var(--text)]">
                    <td className="px-5 py-3 font-medium">{page}</td>
                    <td className="px-5 py-3 font-mono">
                      <button
                        type="button"
                        onClick={() => toggleNumber(page)}
                        className="flex items-center gap-2 transition hover:text-[var(--accent)]"
                        aria-label={shown ? `Hide number for page ${page}` : `Show number for page ${page}`}
                      >
                        {shown ? <span>{number}</span> : <span className="tracking-widest text-[var(--faint)]">···</span>}
                        <EyeIcon open={shown} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
