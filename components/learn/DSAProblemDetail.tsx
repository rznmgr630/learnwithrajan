"use client";

import { useState } from "react";
import type { DsaProblem, SolutionLanguage } from "@/lib/dsa/dsa-problems";
import { LANGUAGE_LABELS, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/lib/dsa/dsa-problems";
import { DSATwoSumDiagram } from "@/components/learn/DSATwoSumDiagram";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

const LANGUAGE_ORDER: SolutionLanguage[] = ["javascript", "typescript", "php", "java", "python"];

function CodeBlock({ code, language }: { code: string; language: SolutionLanguage }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute right-3 top-3 z-10 rounded-md border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre className="overflow-x-auto rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)] p-5 pt-10 font-mono text-sm leading-relaxed text-[var(--text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)] px-1.5 py-0.5 font-mono text-sm text-[var(--accent)]">
      {children}
    </code>
  );
}

function renderDescription(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(`[^`]+`)/g);
    return (
      <p key={i} className="mt-2 text-[var(--text)] leading-relaxed">
        {parts.map((part, j) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <InlineCode key={j}>{part.slice(1, -1)}</InlineCode>
          ) : (
            <span key={j} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>") }} />
          ),
        )}
      </p>
    );
  });
}

export function DSAProblemDetail({ problem, backHref }: { problem: DsaProblem; backHref: string }) {
  const [activeLang, setActiveLang] = useState<SolutionLanguage>("javascript");

  const availableLangs = LANGUAGE_ORDER.filter((l) => problem.solutions.some((s) => s.language === l));
  const activeSolution = problem.solutions.find((s) => s.language === activeLang);

  return (
    <div>
      {/* Top bar */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href={backHref} />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Header */}
        <div className="flex flex-wrap items-start gap-3">
          <span className="rounded-full bg-[var(--elevated)] px-2.5 py-1 font-mono text-xs text-[var(--muted)]">
            #{problem.id}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
            {DIFFICULTY_LABEL[problem.difficulty]}
          </span>
          {problem.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
            >
              {tag}
            </span>
          ))}
        </div>

        <h1 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">{problem.title}</h1>

        {/* Description */}
        <section className="mt-6">{renderDescription(problem.description)}</section>

        {/* Examples */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-[var(--text)]">Examples</h2>
          <div className="mt-3 flex flex-col gap-4">
            {problem.examples.map((ex, i) => (
              <div key={i} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Example {i + 1}</p>
                <div className="space-y-1 font-mono text-sm">
                  <p>
                    <span className="text-[var(--muted)]">Input: </span>
                    <span className="text-[var(--text)]">{ex.input}</span>
                  </p>
                  <p>
                    <span className="text-[var(--muted)]">Output: </span>
                    <span className="font-semibold text-[var(--accent)]">{ex.output}</span>
                  </p>
                  {ex.explanation && (
                    <p className="mt-2 font-sans text-xs text-[var(--muted)]">
                      <span className="font-semibold">Explanation: </span>
                      {ex.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Constraints */}
        <section className="mt-8">
          <h2 className="text-base font-semibold text-[var(--text)]">Constraints</h2>
          <ul className="mt-3 flex flex-col gap-1.5">
            {problem.constraints.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--muted)]">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-60" />
                <span className="font-mono">{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Diagram */}
        {problem.slug === "two-sum" && (
          <section className="mt-8">
            <h2 className="text-base font-semibold text-[var(--text)]">Diagram</h2>
            <DSATwoSumDiagram />
          </section>
        )}

        {/* Solutions */}
        <section className="mt-10">
          <h2 className="text-base font-semibold text-[var(--text)]">Solutions</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">Hash map approach — O(n) time, O(n) space</p>

          {/* Language tabs */}
          <div className="mt-4 flex flex-wrap gap-2 border-b border-[var(--border)] pb-0">
            {availableLangs.map((lang) => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`rounded-t-lg border border-b-0 border-[var(--border)] px-4 py-2 text-sm font-medium transition ${
                  activeLang === lang
                    ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]"
                    : "bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"
                }`}
              >
                {LANGUAGE_LABELS[lang]}
              </button>
            ))}
          </div>

          <div className="mt-4">
            {activeSolution && <CodeBlock code={activeSolution.code} language={activeLang} />}
          </div>

          {/* Complexity */}
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-4 py-3">
              <p className="text-xs text-[var(--muted)]">Time Complexity</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--accent)]">O(n)</p>
            </div>
            <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-4 py-3">
              <p className="text-xs text-[var(--muted)]">Space Complexity</p>
              <p className="mt-0.5 font-mono text-sm font-semibold text-[var(--accent)]">O(n)</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
