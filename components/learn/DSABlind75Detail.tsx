"use client";

import { useState } from "react";
import type { Blind75Problem, Blind75Language } from "@/lib/dsa/blind75";
import {
  BLIND75_DIFFICULTY_COLOR,
  BLIND75_DIFFICULTY_LABEL,
  BLIND75_LANGUAGE_LABELS,
  BLIND75_LANG_DOT,
  BLIND75_LANGUAGE_ORDER,
} from "@/lib/dsa/blind75";

// ── helpers ──────────────────────────────────────────────────────────────────

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
      <h3 className="text-base font-semibold text-[var(--text)]">{children}</h3>
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

function CodeBlock({ code, language }: { code: string; language: Blind75Language }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_80%,transparent)] px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${BLIND75_LANG_DOT[language]}`} />
          <span className="text-xs font-medium text-[var(--muted)]">{BLIND75_LANGUAGE_LABELS[language]}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
        >
          {copied ? (
            <>
              <svg className="h-3.5 w-3.5 text-emerald-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
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

// ── main drawer ───────────────────────────────────────────────────────────────

export function DSABlind75Detail({
  problem,
  onClose,
}: {
  problem: Blind75Problem | null;
  onClose: () => void;
}) {
  const [activeLang, setActiveLang] = useState<Blind75Language>("javascript");

  if (!problem) return null;

  const hasDetail = !!problem.solutions?.length;
  const availableLangs = BLIND75_LANGUAGE_ORDER.filter((l) =>
    problem.solutions?.some((s) => s.language === l),
  );
  const activeSolution = problem.solutions?.find((s) => s.language === activeLang);

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        {/* ── header ── */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-[var(--faint)">#{problem.num}</span>
              {problem.difficulty && (
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${BLIND75_DIFFICULTY_COLOR[problem.difficulty]}`}>
                  {BLIND75_DIFFICULTY_LABEL[problem.difficulty]}
                </span>
              )}
              {problem.tags?.map((tag) => (
                <span key={tag} className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-0.5 text-xs text-[var(--muted)]">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">{problem.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              <span className="font-medium text-[var(--accent)]">{problem.pattern}</span>
              {" · "}
              <span className="font-mono text-xs">{problem.visual}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* ── body ── */}
        <div className="flex-1 overflow-y-auto p-5">
          {hasDetail ? (
            <div className="flex flex-col gap-8">
              {/* Problem */}
              <section>
                <SectionHeading>Problem</SectionHeading>
                <div className="mt-3">{renderDescription(problem.description!)}</div>
              </section>

              {/* Examples */}
              <section>
                <SectionHeading>Examples</SectionHeading>
                <div className="mt-3 flex flex-col gap-3">
                  {problem.examples!.map((ex, i) => (
                    <div key={i} className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
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
                  {problem.constraints!.map((c, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-50" />
                      <span className="font-mono text-sm text-[var(--muted)]">{c}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Solutions */}
              <section>
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <SectionHeading>Solutions</SectionHeading>
                    <p className="mt-1 pl-3.5 text-sm text-[var(--muted)]">{problem.approach}</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--faint)]">Time</p>
                      <p className="font-mono text-sm font-bold text-[var(--accent)]">{problem.timeComplexity}</p>
                    </div>
                    <div className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] px-3 py-2 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-[var(--faint)]">Space</p>
                      <p className="font-mono text-sm font-bold text-[var(--accent)]">{problem.spaceComplexity}</p>
                    </div>
                  </div>
                </div>

                {/* Language tabs */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {availableLangs.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setActiveLang(lang)}
                      className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
                        activeLang === lang
                          ? "bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_0_16px_-2px_var(--glow)]"
                          : "border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-[var(--muted)] hover:border-[var(--accent)]/30 hover:text-[var(--text)]"
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${activeLang === lang ? "bg-current opacity-70" : BLIND75_LANG_DOT[lang]}`} />
                      {BLIND75_LANGUAGE_LABELS[lang]}
                    </button>
                  ))}
                </div>

                <div className="mt-4">
                  {activeSolution && (
                    <CodeBlock code={activeSolution.code} language={activeLang} />
                  )}
                </div>
              </section>
            </div>
          ) : (
            /* Coming soon state */
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-8">
                <p className="text-4xl">🚧</p>
                <h3 className="mt-3 text-base font-semibold text-[var(--text)]">Detail coming soon</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  Full walkthrough for <span className="font-medium text-[var(--text)]">{problem.title}</span> is being written.
                </p>
                <p className="mt-3 text-xs text-[var(--faint)]">
                  Pattern: {problem.pattern} · {problem.visual}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
