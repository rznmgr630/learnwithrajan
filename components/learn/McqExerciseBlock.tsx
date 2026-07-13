"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n/types";

export interface ResolvedMcq {
  question: string;
  choices: string[];
  correctIndex: number;
  explanation?: string;
}

export function McqExerciseBlock({ mcqs, locale }: { mcqs: ResolvedMcq[]; locale: Locale }) {
  const [answers, setAnswers] = useState<(number | null)[]>(() => mcqs.map(() => null));
  const [revealed, setRevealed] = useState(false);

  const allAnswered = answers.every((a) => a !== null);
  const score = answers.filter((a, i) => a === mcqs[i].correctIndex).length;
  const total = mcqs.length;

  function pick(qi: number, ci: number) {
    if (revealed) return;
    setAnswers((prev) => {
      const next = [...prev];
      next[qi] = ci;
      return next;
    });
  }

  const scoreMsg =
    score === total
      ? locale === "np" ? "पूर्ण अंक!" : "Perfect score!"
      : score >= 7
        ? locale === "np" ? "उत्कृष्ट काम!" : "Great work!"
        : score >= 5
          ? locale === "np" ? "पढाई जारी राख्नुस्!" : "Keep studying!"
          : locale === "np" ? "पाठ पुनरावलोकन गर्नुस् र फेरि प्रयास गर्नुस्।" : "Review the lesson and try again.";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text)]">
          {locale === "np" ? `व्यायाम — ${total} प्रश्नहरू` : `Exercise — ${total} Questions`}
        </h3>
        {revealed && (
          <span className="rounded-full bg-[color-mix(in_oklab,var(--accent)_20%,transparent)] px-2.5 py-0.5 text-xs font-bold text-[var(--accent)]">
            {score} / {total}
          </span>
        )}
      </div>

      {mcqs.map((mcq, qi) => {
        const picked = answers[qi];
        return (
          <div
            key={qi}
            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] p-3.5"
          >
            <p className="text-sm font-medium text-[var(--text)]">
              <span className="mr-1.5 text-[var(--muted)]">Q{qi + 1}.</span>
              {mcq.question}
            </p>
            <div className="mt-2.5 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
              {mcq.choices.map((choice, ci) => {
                let cls = "w-full rounded-lg border px-3 py-2 text-left text-xs transition ";
                if (revealed) {
                  if (ci === mcq.correctIndex)
                    cls += "border-green-500 bg-[color-mix(in_oklab,#22c55e_12%,transparent)] text-green-400";
                  else if (ci === picked)
                    cls += "border-red-500 bg-[color-mix(in_oklab,#ef4444_12%,transparent)] text-red-400";
                  else cls += "border-[var(--border)] text-[var(--muted)] opacity-40";
                } else if (picked === ci) {
                  cls += "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text)]";
                } else {
                  cls += "border-[var(--border)] text-[var(--muted)] hover:border-[color-mix(in_oklab,var(--accent)_50%,var(--border))] hover:text-[var(--text)]";
                }
                return (
                  <button
                    key={ci}
                    type="button"
                    disabled={revealed}
                    className={cls}
                    onClick={() => pick(qi, ci)}
                  >
                    {String.fromCharCode(65 + ci)}. {choice}
                  </button>
                );
              })}
            </div>
            {revealed && picked !== mcq.correctIndex && mcq.explanation && (
              <p className="mt-2.5 text-xs leading-relaxed text-[var(--muted)]">
                <span className="font-semibold text-[var(--accent)]">
                  {locale === "np" ? "व्याख्या: " : "Explanation: "}
                </span>
                {mcq.explanation}
              </p>
            )}
          </div>
        );
      })}

      {allAnswered && !revealed && (
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="w-full rounded-xl bg-[var(--accent)] py-2.5 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"
        >
          {locale === "np" ? "उत्तर जाँच गर्नुस्" : "Check Answers"}
        </button>
      )}

      {revealed && (
        <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-center">
          <p className="font-bold text-[var(--text)]">{scoreMsg}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {locale === "np" ? `अंक: ${score} / ${total}` : `Score: ${score} out of ${total}`}
          </p>
          <button
            type="button"
            onClick={() => {
              setAnswers(mcqs.map(() => null));
              setRevealed(false);
            }}
            className="mt-3 rounded-lg border border-[var(--border)] px-4 py-1.5 text-xs text-[var(--muted)] transition hover:text-[var(--text)]"
          >
            {locale === "np" ? "फेरि प्रयास गर्नुस्" : "Try again"}
          </button>
        </div>
      )}
    </div>
  );
}
