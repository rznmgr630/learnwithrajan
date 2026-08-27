"use client";

import { useState } from "react";
import { RichText } from "@/components/learn/RichText";
import { pickLocalized } from "@/lib/i18n/pick";
import { useJsLessonQuizProgress } from "@/hooks/use-js-lesson-quiz-progress";
import type { LocalizedString } from "@/lib/i18n/types";

/**
 * Minimal shape a quiz question must satisfy. Kept structural so both the JS
 * lesson quizzes and the roadmap day quizzes can use this without either
 * module depending on the other's types.
 */
export type LessonQuizQuestion = {
  question: LocalizedString;
  options: LocalizedString[];
  correctIndex: number;
  explanation: LocalizedString;
};

export function LessonQuiz({
  quizId,
  questions,
  locale,
}: {
  quizId: string;
  questions: LessonQuizQuestion[];
  locale: "en" | "np" | "jp";
}) {
  const { getResult, recordResult } = useJsLessonQuizProgress();
  const stored = getResult(quizId);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const allAnswered = questions.every((_, i) => answers[i] !== undefined);
  const score = questions.reduce((acc, q, i) => (answers[i] === q.correctIndex ? acc + 1 : acc), 0);

  return (
    <div className="space-y-4">
      {stored && !submitted ? (
        <div className="flex items-center justify-between rounded-xl border border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_8%,transparent)] px-4 py-3">
          <span className="text-sm font-medium text-[var(--text)]">
            Previously completed: {stored.score}/{stored.total}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Retake quiz
          </button>
        </div>
      ) : null}

      {questions.map((q, qi) => {
        const selected = answers[qi];
        const isCorrect = selected === q.correctIndex;
        return (
          <div
            key={qi}
            className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_28%,transparent)] p-4"
          >
            <p className="text-sm font-medium text-[var(--text)]">
              <span className="mr-2 font-mono text-xs text-[var(--muted)]">{qi + 1}.</span>
              <RichText text={pickLocalized(q.question, locale)} />
            </p>
            <div className="mt-3 space-y-2">
              {q.options.map((opt, oi) => {
                const isSelected = selected === oi;
                const revealed = submitted;
                let stateClass = "border-[var(--border)] hover:border-[var(--accent)]/50";
                if (revealed && oi === q.correctIndex) {
                  stateClass = "border-emerald-500/60 bg-emerald-500/10";
                } else if (revealed && isSelected && oi !== q.correctIndex) {
                  stateClass = "border-red-500/60 bg-red-500/10";
                } else if (isSelected) {
                  stateClass = "border-[var(--accent)] bg-[var(--accent)]/10";
                }
                return (
                  <button
                    key={oi}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                    className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm text-[var(--text)] transition ${stateClass} disabled:cursor-default`}
                  >
                    <RichText text={pickLocalized(opt, locale)} />
                  </button>
                );
              })}
            </div>
            {submitted ? (
              <div
                className={`mt-3 rounded-lg border px-3 py-2 text-xs leading-relaxed ${
                  isCorrect
                    ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400"
                    : "border-red-500/40 bg-red-500/5 text-red-400"
                }`}
              >
                <RichText text={pickLocalized(q.explanation, locale)} />
              </div>
            ) : null}
          </div>
        );
      })}

      {!submitted ? (
        <button
          type="button"
          disabled={!allAnswered}
          onClick={() => {
            setSubmitted(true);
            recordResult(quizId, score, questions.length);
          }}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Check answers ({Object.keys(answers).length}/{questions.length} answered)
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--elevated)] px-4 py-3">
          <span className="text-sm font-semibold text-[var(--text)]">
            Score: {score}/{questions.length}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="text-xs font-semibold text-[var(--accent)] hover:underline"
          >
            Retake quiz
          </button>
        </div>
      )}
    </div>
  );
}
