"use client";

import { useState, useEffect } from "react";
import type { DsaProblem, SolutionLanguage } from "@/lib/dsa/dsa-problems";
import { LANGUAGE_LABELS, DIFFICULTY_COLOR, DIFFICULTY_LABEL } from "@/lib/dsa/dsa-problems";
import { DSATwoSumDiagram } from "@/components/learn/DSATwoSumDiagram";
import { DSAValidParenthesesDiagram } from "@/components/learn/DSAValidParenthesesDiagram";
import { DSAStockProfitDiagram } from "@/components/learn/DSAStockProfitDiagram";
import { DSAContainsDuplicateDiagram } from "@/components/learn/DSAContainsDuplicateDiagram";
import { DSAMaxSubarrayDiagram } from "@/components/learn/DSAMaxSubarrayDiagram";

const LANGUAGE_ORDER: SolutionLanguage[] = ["javascript", "typescript", "php", "java", "python"];

const LANG_DOT: Record<SolutionLanguage, string> = {
  javascript: "bg-yellow-400",
  typescript: "bg-blue-400",
  php: "bg-indigo-400",
  java: "bg-orange-400",
  python: "bg-sky-400",
};

const COMPLEXITY_META: Record<string, { approach: string; time: string; space: string }> = {
  "two-sum":                          { approach: "Hash map",       time: "O(n)", space: "O(n)" },
  "valid-parentheses":                { approach: "Stack",          time: "O(n)", space: "O(n)" },
  "best-time-to-buy-and-sell-stock":  { approach: "Greedy",         time: "O(n)", space: "O(1)" },
  "contains-duplicate":               { approach: "Hash set",       time: "O(n)", space: "O(n)" },
  "maximum-subarray":                 { approach: "Kadane's",       time: "O(n)", space: "O(1)" },
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
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_80%,transparent)] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${LANG_DOT[language]}`} />
          <span className="text-xs font-medium text-[var(--muted)]">{LANGUAGE_LABELS[language]}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
        >
          {copied ? (
            <><svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg><span className="text-emerald-400">Copied!</span></>
          ) : (
            <><svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"><path d="M7 3.5A1.5 1.5 0 018.5 2h3.879a1.5 1.5 0 011.06.44l3.122 3.12A1.5 1.5 0 0117 6.622V12.5a1.5 1.5 0 01-1.5 1.5h-1v-3.379a3 3 0 00-.879-2.121L10.5 5.379A3 3 0 008.379 4.5H7v-1z" /><path d="M4.5 6A1.5 1.5 0 003 7.5v9A1.5 1.5 0 004.5 18h7a1.5 1.5 0 001.5-1.5v-5.879a1.5 1.5 0 00-.44-1.06L9.44 6.439A1.5 1.5 0 008.378 6H4.5z" /></svg>Copy</>
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
    <code className="rounded border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)] px-1.5 py-0.5 font-mono text-sm text-[var(--accent)]">
      {children}
    </code>
  );
}

function renderDescription(text: string) {
  return text.split("\n").map((line, i) => {
    const parts = line.split(/(`[^`]+`)/g);
    return (
      <p key={i} className="mt-2 leading-relaxed text-[var(--muted)]">
        {parts.map((part, j) =>
          part.startsWith("`") && part.endsWith("`") ? (
            <InlineCode key={j}>{part.slice(1, -1)}</InlineCode>
          ) : (
            <span key={j} dangerouslySetInnerHTML={{ __html: part.replace(/\*\*(.+?)\*\*/g, "<strong class='text-[var(--text)]'>$1</strong>") }} />
          ),
        )}
      </p>
    );
  });
}

function ProblemDiagram({ slug }: { slug: string }) {
  if (slug === "two-sum") return <DSATwoSumDiagram />;
  if (slug === "valid-parentheses") return <DSAValidParenthesesDiagram />;
  if (slug === "best-time-to-buy-and-sell-stock") return <DSAStockProfitDiagram />;
  if (slug === "contains-duplicate") return <DSAContainsDuplicateDiagram />;
  if (slug === "maximum-subarray") return <DSAMaxSubarrayDiagram />;
  return null;
}

function ProblemContent({ problem }: { problem: DsaProblem }) {
  const [activeLang, setActiveLang] = useState<SolutionLanguage>("javascript");
  const availableLangs = LANGUAGE_ORDER.filter((l) => problem.solutions.some((s) => s.language === l));
  const activeSolution = problem.solutions.find((s) => s.language === activeLang);
  const meta = COMPLEXITY_META[problem.slug] ?? { approach: "Optimal", time: "O(n)", space: "O(n)" };
  const hasDiagram = !!ProblemDiagram({ slug: problem.slug });

  return (
    <div className="flex flex-col gap-8 p-5">
      {/* Description */}
      <section>
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Problem</h3>
        {renderDescription(problem.description)}
      </section>

      {/* Examples */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Examples</h3>
        <div className="flex flex-col gap-3">
          {problem.examples.map((ex, i) => (
            <div key={i} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
              <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-4 py-2">
                <span className="text-xs font-medium text-[var(--muted)]">Example {i + 1}</span>
              </div>
              <div className="space-y-1.5 p-4 font-mono text-sm">
                <div className="flex gap-3">
                  <span className="shrink-0 text-[var(--faint)]">Input</span>
                  <span className="text-[var(--text)]">{ex.input}</span>
                </div>
                <div className="flex gap-2">
                  <span className="shrink-0 text-[var(--faint)]">Output</span>
                  <span className="font-bold text-[var(--accent)]">{ex.output}</span>
                </div>
                {ex.explanation && (
                  <p className="border-t border-[var(--border)] pt-2 font-sans text-xs text-[var(--muted)]">{ex.explanation}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Constraints */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Constraints</h3>
        <ul className="space-y-2">
          {problem.constraints.map((c, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-50" />
              <span className="font-mono text-sm text-[var(--muted)]">{c}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Diagram */}
      {hasDiagram && (
        <section>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Visual Diagram</h3>
          <ProblemDiagram slug={problem.slug} />
        </section>
      )}

      {/* Solutions */}
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Solutions</h3>
            <p className="mt-0.5 text-xs text-[var(--faint)]">{meta.approach} approach</p>
          </div>
          <div className="flex gap-2">
            {[{ label: "Time", value: meta.time }, { label: "Space", value: meta.space }].map((c) => (
              <div key={c.label} className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-3 py-1.5 text-center">
                <p className="text-[10px] uppercase tracking-widest text-[var(--faint)]">{c.label}</p>
                <p className="font-mono text-sm font-bold text-[var(--accent)]">{c.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pill tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {availableLangs.map((lang) => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                activeLang === lang
                  ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_12px_-2px_var(--glow)]"
                  : "border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--text)]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${activeLang === lang ? "bg-current opacity-70" : LANG_DOT[lang]}`} />
              {LANGUAGE_LABELS[lang]}
            </button>
          ))}
        </div>

        {activeSolution && <CodeBlock code={activeSolution.code} language={activeLang} />}
      </section>
    </div>
  );
}

/* ─── Drawer shell ─────────────────────────────────────────────────────────── */

export function DSAProblemDrawer({
  problem,
  onClose,
}: {
  problem: DsaProblem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!problem) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [problem, onClose]);

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[var(--faint)]">#{problem.id}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                {DIFFICULTY_LABEL[problem.difficulty]}
              </span>
              {problem.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--faint)]">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-lg font-semibold leading-snug text-[var(--text)]">{problem.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          <ProblemContent problem={problem} />
        </div>
      </aside>
    </div>
  );
}
