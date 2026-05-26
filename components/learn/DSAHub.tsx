"use client";

import { useState } from "react";
import Link from "next/link";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";
import { DSAFundamentalsDrawer, type FundamentalTopicId } from "@/components/learn/DSAFundamentalsDrawer";
import { DSAProblemDrawer } from "@/components/learn/DSAProblemDrawer";
import type { DsaProblem } from "@/lib/dsa/dsa-problems";

const FUNDAMENTAL_TOPICS: { id: FundamentalTopicId; title: string; subtitle: string }[] = [
  {
    id: "big-o",
    title: "Big O Notation & Time Complexity",
    subtitle: "Understanding how to evaluate code efficiency",
  },
  {
    id: "space-complexity",
    title: "Space Complexity",
    subtitle: "Applying complexity analysis to memory usage",
  },
];

const LEVELS = [
  {
    slug: "basic",
    label: "Basic",
    hint: "Arrays · Hash maps · Strings · Simple recursion",
    problems: DSA_BASIC_PROBLEMS,
    active: true,
    accentClass: "from-emerald-500/20 to-emerald-500/0",
    badgeClass: "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.18)]",
    ctaClass: "text-emerald-400 hover:text-emerald-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.615z" />
        <path fillRule="evenodd" d="M9.99 2C5.582 2 2 5.528 2 9.875c0 4.347 3.582 7.875 7.99 7.875 4.408 0 7.99-3.528 7.99-7.875C17.98 5.528 14.398 2 9.99 2zM8.944 6.143c.19-.078.39-.138.606-.175V5.5a.75.75 0 011.5 0v.48c.195.04.384.094.565.16.642.235 1.205.686 1.435 1.37.046.14.07.286.07.436 0 .156-.027.308-.078.454-.296.844-1.185 1.285-1.992 1.517v2.683c.405-.058.787-.195 1.12-.406.482-.315.612-.648.612-.875a.75.75 0 011.5 0c0 .688-.372 1.292-.879 1.672a4.528 4.528 0 01-2.353.821v.34a.75.75 0 01-1.5 0v-.328a4.56 4.56 0 01-.95-.21c-.594-.214-1.178-.584-1.53-1.173a2.348 2.348 0 01-.346-1.234c0-.603.228-1.19.67-1.624.247-.24.539-.425.848-.554zm2.606 5.264v-2.56c.205.076.39.17.549.28.482.315.612.648.612.875s-.13.56-.612.875a2.717 2.717 0 01-.549.53z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "medium",
    label: "Medium",
    hint: "Trees · Stacks · Sliding window · BFS / DFS",
    problems: [] as typeof DSA_BASIC_PROBLEMS,
    active: false,
    accentClass: "from-amber-500/20 to-amber-500/0",
    badgeClass: "text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/30",
    borderClass: "border-amber-500/20 hover:border-amber-500/40",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(251,191,36,0.14)]",
    ctaClass: "text-amber-400 hover:text-amber-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 016.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.172a.75.75 0 010 1.06L6.11 12.295a.75.75 0 01-1.06-1.06l1.06-1.063a.75.75 0 011.061 0zm3.594 0a.75.75 0 011.06 0l1.062 1.062a.75.75 0 01-1.061 1.06l-1.06-1.06a.75.75 0 010-1.061zM10 14a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 14zM4.5 8a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    slug: "advanced",
    label: "Advanced",
    hint: "Dynamic programming · Graphs · Backtracking",
    problems: [] as typeof DSA_BASIC_PROBLEMS,
    active: false,
    accentClass: "from-rose-500/20 to-rose-500/0",
    badgeClass: "text-rose-400 bg-rose-500/10 ring-1 ring-rose-500/30",
    borderClass: "border-rose-500/20 hover:border-rose-500/40",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(244,63,94,0.14)]",
    ctaClass: "text-rose-400 hover:text-rose-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path fillRule="evenodd" d="M10 1a9 9 0 100 18A9 9 0 0010 1zM5.904 9.08a.75.75 0 010 1.06l-1.5 1.5a.75.75 0 01-1.06-1.06l1.5-1.5a.75.75 0 011.06 0zm8.253 0a.75.75 0 011.06 0l1.5 1.5a.75.75 0 01-1.06 1.06l-1.5-1.5a.75.75 0 010-1.06zM10 6.25a.75.75 0 01.75.75v2.69l1.72 1.72a.75.75 0 01-1.06 1.06l-2-2A.75.75 0 019.25 10V7a.75.75 0 01.75-.75z" clipRule="evenodd" />
      </svg>
    ),
  },
] as const;

export function DSAHub() {
  const [openTopic, setOpenTopic] = useState<FundamentalTopicId | null>(null);
  const [openProblem, setOpenProblem] = useState<DsaProblem | null>(null);

  return (
    <div className="min-h-screen">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href="/learn/programming" />
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6">
        {/* Hero */}
        <div className="relative mb-12">
          <div className="absolute -inset-x-4 -top-4 h-48 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
          <div className="relative">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
              <span className="text-xs font-medium text-[var(--accent)]">DSA Challenges</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
              Data Structures
              <br />
              <span className="text-[var(--accent)]">&amp; Algorithms</span>
            </h1>
            <p className="mt-4 max-w-xl text-[var(--muted)]">
              LeetCode-style problems from basic to advanced. Every problem comes with a description, visual
              diagram, and solutions in JavaScript, TypeScript, PHP, Java, and Python.
            </p>
          </div>
        </div>

        {/* Stats row */}
        <div className="mb-10 flex flex-wrap gap-4">
          {[
            { label: "Problems", value: DSA_BASIC_PROBLEMS.length.toString() },
            { label: "Languages", value: "5" },
            { label: "Levels", value: "3" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3"
            >
              <p className="font-mono text-xl font-bold text-[var(--accent)]">{stat.value}</p>
              <p className="text-xs text-[var(--muted)]">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Cards grid — Fundamentals first, then difficulty levels */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* ── Fundamentals card ── */}
          <div className="group relative overflow-hidden rounded-2xl border border-violet-500/30 bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-300 hover:border-violet-500/60 hover:shadow-[0_0_32px_-4px_rgba(139,92,246,0.18)]">
            <div className="h-1 w-full bg-gradient-to-r from-violet-500/20 to-violet-500/0 opacity-80" />

            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-xl p-2 text-violet-400 bg-violet-500/10 ring-1 ring-violet-500/30">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-violet-400 bg-violet-500/10 ring-1 ring-violet-500/30">
                  Fundamentals
                </span>
              </div>

              <h2 className="text-base font-semibold text-[var(--text)]">Fundamentals</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">Analysis · Big O · Space complexity</p>

              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-[var(--text)]">2</span>
                <span className="text-sm text-[var(--muted)]">topics</span>
              </div>
            </div>

            {/* Topic list */}
            <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
              <p className="mb-2 text-xs text-[var(--faint)]">Topics</p>
              {FUNDAMENTAL_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setOpenTopic(topic.id)}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
                >
                  <span className="h-1 w-1 shrink-0 rounded-full bg-violet-400 opacity-70" />
                  <span className="flex-1 truncate text-xs">{topic.title}</span>
                  <svg className="h-3 w-3 shrink-0 opacity-40" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* ── Difficulty level cards ── */}
          {LEVELS.map((level) => (
            <div
              key={level.slug}
              className={`group relative overflow-hidden rounded-2xl border bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-300 ${level.borderClass} ${level.glowClass}`}
            >
              <div className={`h-1 w-full bg-gradient-to-r ${level.accentClass} opacity-80`} />

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-xl p-2 ${level.badgeClass}`}>{level.icon}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${level.badgeClass}`}>
                    {level.label}
                  </span>
                </div>

                <h2 className="text-base font-semibold text-[var(--text)]">{level.label} Level</h2>
                <p className="mt-1 text-xs text-[var(--muted)]">{level.hint}</p>

                <div className="mt-4 flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)]">
                    {level.problems.length}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {level.problems.length === 1 ? "problem" : "problems"}
                  </span>
                </div>

                <div className="mt-4">
                  {level.active && level.problems.length > 0 ? (
                    <Link
                      href={`/learn/dsa/${level.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition ${level.ctaClass}`}
                    >
                      Start solving
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-sm text-[var(--faint)]">
                      <span className="h-1.5 w-1.5 rounded-full bg-[var(--faint)]" />
                      Coming soon
                    </span>
                  )}
                </div>
              </div>

              {/* Problem preview */}
              {level.active && level.problems.length > 0 && (
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="mb-2 text-xs text-[var(--faint)]">Recent</p>
                  {level.problems.slice(0, 3).map((p) => (
                    <button
                      key={p.slug}
                      onClick={() => setOpenProblem(p)}
                      className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
                    >
                      <span className="font-mono text-xs text-[var(--faint)]">#{p.id}</span>
                      <span className="flex-1 truncate text-xs">{p.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DSAFundamentalsDrawer topicId={openTopic} onClose={() => setOpenTopic(null)} />
      <DSAProblemDrawer problem={openProblem} onClose={() => setOpenProblem(null)} />
    </div>
  );
}
