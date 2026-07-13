"use client";

import { useState } from "react";
import type { DsaProblem, SolutionLanguage } from "@/lib/dsa/dsa-problems";
import { LANGUAGE_LABELS, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/lib/dsa/dsa-problems";
import { DSATwoSumDiagram } from "@/components/learn/DSATwoSumDiagram";
import { DSAValidParenthesesDiagram } from "@/components/learn/DSAValidParenthesesDiagram";
import { DSAStockProfitDiagram } from "@/components/learn/DSAStockProfitDiagram";
import { DSAContainsDuplicateDiagram } from "@/components/learn/DSAContainsDuplicateDiagram";
import { DSAMaxSubarrayDiagram } from "@/components/learn/DSAMaxSubarrayDiagram";
import { LearnBackNav } from "@/components/learn/LearnBackNav";

const LANGUAGE_ORDER: SolutionLanguage[] = ["javascript", "typescript", "php", "java", "python"];

const LANG_DOT: Record<SolutionLanguage, string> = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-400",
  php: "bg-indigo-400",
  java: "bg-orange-400",
  python: "bg-sky-400",
};

function CodeBlock({ code, language }: { code: string; language: SolutionLanguage }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      {/* Code block header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_80%,transparent)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${LANG_DOT[language]}`} />
          <span className="text-xs font-medium text-[var(--muted)]">{LANGUAGE_LABELS[language]}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" />
                <path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="overflow-x-auto bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-5 font-mono text-sm leading-relaxed text-[var(--text)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)] px-1.5 py-0.5 font-mono text-sm text-[var(--accent)]">
      {children}
    </code>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-5 w-0.5 rounded-full bg-[var(--accent)] opacity-70" />
      <h2 className="text-base font-semibold text-[var(--text)]">{children}</h2>
    </div>
  );
}

function renderDescription(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(`[^`]+`)/g);
    return (
      <p key={i} className="mt-2 leading-relaxed text-[var(--text)]">
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
    <div className="min-h-screen">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href={backHref} labelKey="learn.backDsa" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
        {/* Problem header */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] p-6 sm:p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-transparent" />
          <div className="relative">
            {/* Meta row */}
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[var(--faint)]">#{problem.id}</span>
              <span className="text-[var(--faint)]">·</span>
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
            <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">{problem.title}</h1>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* Description */}
          <section>
            <SectionHeading>Problem</SectionHeading>
            <div className="mt-3">{renderDescription(problem.description)}</div>
          </section>

          {/* Examples */}
          <section>
            <SectionHeading>Examples</SectionHeading>
            <div className="mt-3 flex flex-col gap-3">
              {problem.examples.map((ex, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]"
                >
                  <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-4 py-2">
                    <span className="text-xs font-medium text-[var(--muted)]">Example {i + 1}</span>
                  </div>
                  <div className="space-y-2 p-4 font-mono text-sm">
                    <div className="flex gap-3">
                      <span className="shrink-0 text-[var(--faint)]">Input</span>
                      <span className="text-[var(--text)]">{ex.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="shrink-0 text-[var(--faint)]">Output</span>
                      <span className="font-bold text-[var(--accent)]">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <p className="border-t border-[var(--border)] pt-2 font-sans text-xs text-[var(--muted)]">
                        {ex.explanation}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Constraints */}
          <section>
            <SectionHeading>Constraints</SectionHeading>
            <ul className="mt-3 space-y-2">
              {problem.constraints.map((c, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-50" />
                  <span className="font-mono text-sm text-[var(--muted)]">{c}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Diagram */}
          {(problem.slug === "two-sum" ||
            problem.slug === "valid-parentheses" ||
            problem.slug === "best-time-to-buy-and-sell-stock" ||
            problem.slug === "contains-duplicate" ||
            problem.slug === "maximum-subarray") && (
            <section>
              <SectionHeading>Visual Diagram</SectionHeading>
              <div className="mt-3">
                {problem.slug === "two-sum" && <DSATwoSumDiagram />}
                {problem.slug === "valid-parentheses" && <DSAValidParenthesesDiagram />}
                {problem.slug === "best-time-to-buy-and-sell-stock" && <DSAStockProfitDiagram />}
                {problem.slug === "contains-duplicate" && <DSAContainsDuplicateDiagram />}
                {problem.slug === "maximum-subarray" && <DSAMaxSubarrayDiagram />}
              </div>
            </section>
          )}

          {/* Solutions */}
          <section>
            {(() => {
              const meta: Record<string, { approach: string; time: string; space: string }> = {
                "two-sum":                              { approach: "Hash map",         time: "O(n)",      space: "O(n)"   },
                "valid-parentheses":                    { approach: "Stack",            time: "O(n)",      space: "O(n)"   },
                "best-time-to-buy-and-sell-stock":      { approach: "Greedy one-pass",  time: "O(n)",      space: "O(1)"   },
                "contains-duplicate":                   { approach: "Hash set",         time: "O(n)",      space: "O(n)"   },
                "maximum-subarray":                     { approach: "Kadane's",         time: "O(n)",      space: "O(1)"   },
                "product-of-array-except-self":         { approach: "Prefix/suffix",    time: "O(n)",      space: "O(1)"   },
                "move-zeroes":                          { approach: "Two pointers",     time: "O(n)",      space: "O(1)"   },
                "remove-duplicates-from-sorted-array":  { approach: "Two pointers",     time: "O(n)",      space: "O(1)"   },
                "container-with-most-water":            { approach: "Two pointers",     time: "O(n)",      space: "O(1)"   },
                "three-sum":                            { approach: "Sort + two ptrs",  time: "O(n²)",     space: "O(1)"   },
                "sort-colors":                          { approach: "Dutch Natl Flag",  time: "O(n)",      space: "O(1)"   },
                "rotate-array":                         { approach: "Triple reverse",   time: "O(n)",      space: "O(1)"   },
                "majority-element":                     { approach: "Boyer-Moore",      time: "O(n)",      space: "O(1)"   },
                "missing-number":                       { approach: "Gauss formula",    time: "O(n)",      space: "O(1)"   },
                "maximum-product-subarray":             { approach: "DP min/max",       time: "O(n)",      space: "O(1)"   },
                "find-minimum-in-rotated-sorted-array": { approach: "Binary search",    time: "O(log n)",  space: "O(1)"   },
                "merge-sorted-array":                   { approach: "Two pointers",     time: "O(m+n)",    space: "O(1)"   },
                "two-sum-ii-input-array-is-sorted":     { approach: "Two pointers",     time: "O(n)",      space: "O(1)"   },
                "merge-intervals":                      { approach: "Sort + scan",      time: "O(n log n)", space: "O(n)"  },
              };
              const m = meta[problem.slug] ?? { approach: "Optimal", time: "O(n)", space: "O(n)" };
              return (
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <SectionHeading>Solutions</SectionHeading>
                    <p className="mt-1 pl-3.5 text-sm text-[var(--muted)]">{m.approach} approach</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--faint)]">Time</p>
                      <p className="font-mono text-sm font-bold text-[var(--accent)]">{m.time}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--faint)]">Space</p>
                      <p className="font-mono text-sm font-bold text-[var(--accent)]">{m.space}</p>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Language pill tabs */}
            <div className="mt-4 flex flex-wrap gap-2">
              {availableLangs.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setActiveLang(lang)}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                    activeLang === lang
                      ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_16px_-2px_var(--glow)]"
                      : "border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:bg-[color-mix(in_oklab,var(--elevated)_80%,transparent)] hover:text-[var(--text)]"
                  }`}
                >
                  <span className={`h-2 w-2 rounded-full ${activeLang === lang ? "bg-current opacity-70" : LANG_DOT[lang]}`} />
                  {LANGUAGE_LABELS[lang]}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {activeSolution && <CodeBlock code={activeSolution.code} language={activeLang} />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
