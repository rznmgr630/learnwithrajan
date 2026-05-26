"use client";

import Link from "next/link";
import { useId } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";

const DIFFICULTY_SECTIONS = [
  {
    slug: "basic",
    label: "Basic",
    hint: "Foundational patterns — arrays, hash maps, strings, and simple recursion.",
    problems: DSA_BASIC_PROBLEMS,
    active: true,
  },
  {
    slug: "medium",
    label: "Medium",
    hint: "Intermediate problems — trees, stacks, sliding window, BFS / DFS.",
    problems: [],
    active: false,
  },
  {
    slug: "advanced",
    label: "Advanced",
    hint: "Hard algorithmic challenges — dynamic programming, graphs, backtracking.",
    problems: [],
    active: false,
  },
] as const;

const DIFF_COLOR = {
  basic: "text-emerald-500 bg-emerald-500/10",
  medium: "text-amber-500 bg-amber-500/10",
  advanced: "text-rose-500 bg-rose-500/10",
} as const;

export function DSAHub() {
  const baseId = useId();

  return (
    <div>
      {/* Top bar */}
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/programming" />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        {/* Hero */}
        <div className="max-w-2xl">
          <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">DSA Problems</h1>
          <p className="mt-3 text-[var(--muted)]">
            LeetCode-style data structures &amp; algorithms problems — from basic to advanced. Each problem includes
            a description, worked diagram, and solutions in JavaScript, TypeScript, PHP, Java, and Python.
          </p>
        </div>

        {/* Level sections */}
        <div className="mt-10 flex flex-col gap-4">
          {DIFFICULTY_SECTIONS.map((section) => (
            <details
              key={section.slug}
              id={`${baseId}-${section.slug}`}
              className="open:[&_.dsa-chevron]:rotate-180 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm"
              open={section.active}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
                <div className="flex min-w-0 items-center gap-3">
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${DIFF_COLOR[section.slug]}`}>
                    {section.label}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs leading-snug text-[var(--muted)]">{section.hint}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 font-mono text-xs tabular-nums text-[var(--muted)]">
                    {section.problems.length} problem{section.problems.length !== 1 ? "s" : ""}
                  </span>
                  <svg
                    className="dsa-chevron h-5 w-5 text-[var(--muted)] transition-transform duration-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </summary>

              <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
                {section.active && section.problems.length > 0 ? (
                  <>
                    {/* Problem list preview */}
                    <div className="mb-4 overflow-hidden rounded-xl border border-[var(--border)]">
                      <table className="w-full border-collapse text-sm">
                        <tbody>
                          {section.problems.map((p, i) => (
                            <tr
                              key={p.slug}
                              className={`group border-b border-[var(--border)] last:border-0 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] ${i % 2 === 0 ? "" : "bg-[color-mix(in_oklab,var(--elevated)_20%,transparent)]"}`}
                            >
                              <td className="px-4 py-3 font-mono text-xs text-[var(--muted)]">{p.id}</td>
                              <td className="px-4 py-3 font-medium text-[var(--text)] group-hover:text-[var(--accent)]">
                                <Link href={`/learn/dsa/${p.difficulty}/${p.slug}`}>{p.title}</Link>
                              </td>
                              <td className="hidden px-4 py-3 sm:table-cell">
                                <div className="flex flex-wrap gap-1">
                                  {p.tags.map((tag) => (
                                    <span
                                      key={tag}
                                      className="rounded-full border border-[var(--border)] px-2 py-0.5 text-xs text-[var(--muted)]"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Link
                      href={`/learn/dsa/${section.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] transition hover:brightness-110"
                    >
                      View all {section.label} problems
                      <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </>
                ) : (
                  <p className="py-4 text-center text-sm text-[var(--muted)]">
                    {section.active ? "No problems yet." : "Coming soon — check back later."}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
