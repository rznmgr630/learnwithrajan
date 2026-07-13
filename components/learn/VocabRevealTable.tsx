"use client";

import { useState } from "react";
import { EyeIcon, ShuffleIcon } from "@/components/learn/reveal-icons";

export interface VocabRevealRow {
  sn: number;
  word: string;
  romaji: string;
  kanji?: string;
  meaning: string;
  example: string;
}

export interface VocabRevealTableLabels {
  showAll: string;
  hideAll: string;
  shuffle: string;
}

export function VocabRevealTable({ rows, labels }: { rows: VocabRevealRow[]; labels: VocabRevealTableLabels }) {
  const [revealed, setRevealed] = useState<Set<number>>(new Set());
  const [order, setOrder] = useState<VocabRevealRow[]>(rows);

  const allShown = revealed.size === order.length;

  function toggleAll() {
    if (allShown) setRevealed(new Set());
    else setRevealed(new Set(order.map((r) => r.sn)));
  }

  function toggleOne(sn: number) {
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(sn)) next.delete(sn);
      else next.add(sn);
      return next;
    });
  }

  function shuffle() {
    setOrder((prev) => {
      const arr = [...prev];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    });
    setRevealed(new Set());
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <ShuffleIcon />
          {labels.shuffle}
        </button>
        <button
          type="button"
          onClick={toggleAll}
          className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--muted)] transition hover:text-[var(--text)]"
        >
          <EyeIcon open={!allShown} />
          {allShown ? labels.hideAll : labels.showAll}
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_92%,transparent)]">
              {["#", "Word", "Romaji", "Kanji", "Meaning", "Example"].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3 py-2 text-left text-[11px] font-semibold text-[var(--text)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {order.map((row) => {
              const shown = revealed.has(row.sn);
              return (
                <tr
                  key={row.sn}
                  className="border-b border-[var(--border)]/70 last:border-0 odd:bg-[color-mix(in_oklab,var(--elevated)_18%,transparent)]"
                >
                  <td className="px-3 py-2.5 text-xs text-[var(--faint)]">{row.sn}</td>
                  <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.word}</td>
                  <td className="px-3 py-2.5 font-mono text-xs text-[var(--muted)]">{row.romaji}</td>
                  <td className="px-3 py-2.5 text-base text-[var(--text)]">{row.kanji ?? "—"}</td>
                  <td className="px-3 py-2.5 text-xs text-[var(--muted)]">
                    <button
                      type="button"
                      onClick={() => toggleOne(row.sn)}
                      className="flex items-center gap-1.5 transition hover:text-[var(--text)]"
                      aria-label={shown ? "Hide meaning" : "Show meaning"}
                    >
                      {shown ? (
                        <span>{row.meaning}</span>
                      ) : (
                        <span className="tracking-widest text-[var(--faint)]">···</span>
                      )}
                      <EyeIcon open={shown} />
                    </button>
                  </td>
                  <td className="px-3 py-2.5 text-sm text-[var(--text)]">{row.example}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
