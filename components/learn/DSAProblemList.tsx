"use client";

import { useState } from "react";
import type { DsaProblem } from "@/lib/dsa/dsa-problems";
import { DIFFICULTY_COLOR, DIFFICULTY_LABEL, DSA_BASIC_CATEGORIES } from "@/lib/dsa/dsa-problems";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { DSAProblemDrawer } from "@/components/learn/DSAProblemDrawer";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  arrays: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M4.5 2A1.5 1.5 0 003 3.5v13A1.5 1.5 0 004.5 18h11a1.5 1.5 0 001.5-1.5V7.621a1.5 1.5 0 00-.44-1.06l-4.12-4.122A1.5 1.5 0 0011.378 2H4.5zm2.25 8.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5zm0 3a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
    </svg>
  ),
  "linked-lists": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z" />
      <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z" />
    </svg>
  ),
  "stacks-queues": (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zm0 5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
    </svg>
  ),
  trees: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M9.664 1.319a.75.75 0 01.672 0 41.059 41.059 0 018.198 5.424.75.75 0 01-.254 1.285 31.372 31.372 0 00-7.86 3.83.75.75 0 01-.84 0 31.508 31.508 0 00-2.08-1.287V9.394c0-.244.065-.47.175-.666a31.422 31.422 0 00-3.104-1.411.75.75 0 01-.254-1.285 41.059 41.059 0 018.197-5.419zm-3.64 7.736a29.998 29.998 0 00-1.558-.75l-.107.006-.015.002a29.41 29.41 0 00-2.663 1.265l.02.005c.54.148 1.073.316 1.596.503A29.994 29.994 0 009.5 11.35V9.09a29.84 29.84 0 00-3.476-2.035zm7.404 2.437a29.41 29.41 0 00-2.663-1.265l-.015-.002-.107-.006a29.998 29.998 0 00-1.558.75A29.84 29.84 0 0010.5 9.09V11.35a29.994 29.994 0 003.472-1.522c.523-.187 1.056-.355 1.596-.503l.02-.005zM9 13.48V18a.75.75 0 001.5 0v-4.52a31.38 31.38 0 00-3-1.418V13.48z" clipRule="evenodd" />
    </svg>
  ),
  bst: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h9A1.5 1.5 0 0114 3.5v11.75A2.75 2.75 0 0016.75 18h-12A2.75 2.75 0 012 15.25V3.5zm3.75 7a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zm0 3a.75.75 0 000 1.5h4.5a.75.75 0 000-1.5h-4.5zM5 5.75A.75.75 0 015.75 5h4.5a.75.75 0 01.75.75v2.5a.75.75 0 01-.75.75h-4.5A.75.75 0 015 8.25v-2.5z" clipRule="evenodd" />
    </svg>
  ),
  heaps: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 11-4 0 2 2 0 014 0zM1.49 15.326a.78.78 0 01-.358-.442 3 3 0 014.308-3.516 6.484 6.484 0 00-1.905 3.959c-.023.222-.014.442.025.654a4.97 4.97 0 01-2.07-.655zM16.44 15.98a4.97 4.97 0 002.07-.654.78.78 0 00.357-.442 3 3 0 00-4.308-3.517 6.484 6.484 0 011.907 3.96 2.32 2.32 0 01-.026.654zM18 8a2 2 0 11-4 0 2 2 0 014 0zM5.304 16.19a.844.844 0 01-.277-.71 5 5 0 019.947 0 .843.843 0 01-.277.71A6.975 6.975 0 0110 18a6.974 6.974 0 01-4.696-1.81z" />
    </svg>
  ),
  graphs: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M5 2a1 1 0 00-1 1v1H3a1 1 0 000 2h1v1a1 1 0 002 0V6h1a1 1 0 000-2H6V3a1 1 0 00-1-1zm11 14a1 1 0 01-1 1h-1v1a1 1 0 01-2 0v-1h-1a1 1 0 010-2h1v-1a1 1 0 012 0v1h1a1 1 0 011 1zM9.293 5.293a1 1 0 011.414 0l5 5a1 1 0 01-1.414 1.414L10 7.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5z" clipRule="evenodd" />
    </svg>
  ),
  hashing: (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
      <path fillRule="evenodd" d="M9.493 2.853a.75.75 0 00-1.486-.205L7.545 6H4.198a.75.75 0 000 1.5h3.11l-.66 4.5H3.302a.75.75 0 000 1.5h3.12l-.46 3.148a.75.75 0 001.486.205L7.955 14h2.986l-.461 3.148a.75.75 0 001.486.205L12.456 14h3.346a.75.75 0 000-1.5h-3.11l.66-4.5h3.345a.75.75 0 000-1.5h-3.12l.46-3.148a.75.75 0 00-1.486-.205L12.045 6H9.059l.434-3.147zM8.81 7.5l-.66 4.5h2.986l.66-4.5H8.81z" clipRule="evenodd" />
    </svg>
  ),
};

function CategorySection({
  category,
  problems,
  onSelectProblem,
}: {
  category: (typeof DSA_BASIC_CATEGORIES)[number];
  problems: DsaProblem[];
  onSelectProblem: (p: DsaProblem) => void;
}) {
  const [open, setOpen] = useState(problems.length > 0);
  const hasProblems = problems.length > 0;

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_30%,transparent)]"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-[var(--accent)]">
          {CATEGORY_ICONS[category.id]}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[var(--text)]">{category.label}</span>
            {hasProblems ? (
              <span className="rounded-full bg-[var(--accent)]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[var(--accent)]">
                {problems.length}
              </span>
            ) : (
              <span className="rounded-full border border-[var(--border)] px-2 py-0.5 font-mono text-xs text-[var(--faint)]">
                0
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-[var(--muted)]">{category.hint}</p>
        </div>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--faint)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="border-t border-[var(--border)]">
          {hasProblems ? (
            <div className="flex flex-col gap-1 p-2">
              {problems.map((problem, idx) => (
                <button
                  key={problem.slug}
                  onClick={() => onSelectProblem(problem)}
                  className="group flex w-full items-center gap-3 overflow-hidden rounded-xl px-4 py-3 text-left transition-all hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:shadow-[0_0_16px_-6px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
                >
                  <span className="w-7 shrink-0 font-mono text-xs font-semibold tabular-nums text-[var(--faint)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 text-sm font-medium text-[var(--text)] transition group-hover:text-[var(--accent)]">
                    {problem.title}
                  </span>
                  <div className="hidden flex-wrap gap-1 sm:flex">
                    {problem.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2 py-0.5 text-xs text-[var(--muted)]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${DIFFICULTY_COLOR[problem.difficulty]}`}>
                    {DIFFICULTY_LABEL[problem.difficulty]}
                  </span>
                  <svg
                    className="h-3.5 w-3.5 shrink-0 text-[var(--faint)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-2 px-5 py-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--faint)]" />
              <span className="text-sm text-[var(--faint)]">Coming soon</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function DSAProblemList({
  problems,
  difficulty,
  backHref,
}: {
  problems: DsaProblem[];
  difficulty: string;
  backHref: string;
}) {
  const [openProblem, setOpenProblem] = useState<DsaProblem | null>(null);

  const problemsByCategory = DSA_BASIC_CATEGORIES.map((cat) => ({
    category: cat,
    problems: problems.filter((p) => p.category === cat.id),
  }));

  return (
    <div className="min-h-screen">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href={backHref} labelKey="learn.backDsa" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-10 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                difficulty === "Basic"
                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30"
                  : difficulty === "Medium"
                    ? "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30"
                    : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30"
              }`}
            >
              {difficulty}
            </span>
            <span className="rounded-full bg-[var(--elevated)] px-2.5 py-1 font-mono text-xs tabular-nums text-[var(--muted)]">
              {problems.length} problems
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text)] sm:text-3xl">
            {difficulty} Problems
          </h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {difficulty === "Basic"
              ? "Foundational patterns across core data structures — arrays, hashing, stacks, trees, and more."
              : difficulty === "Medium"
                ? "Intermediate problems requiring trees, stacks, sliding windows, or BFS/DFS."
                : "Advanced algorithmic challenges — DP, graphs, backtracking, and beyond."}
          </p>
        </div>

        {/* Categorized sections */}
        <div className="flex flex-col gap-3">
          {problemsByCategory.map(({ category, problems: catProblems }) => (
            <CategorySection
              key={category.id}
              category={category}
              problems={catProblems}
              onSelectProblem={setOpenProblem}
            />
          ))}
        </div>
      </div>

      <DSAProblemDrawer problem={openProblem} onClose={() => setOpenProblem(null)} />
    </div>
  );
}
