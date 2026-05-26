"use client";

import { useState } from "react";
import Link from "next/link";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { DSA_BASIC_PROBLEMS } from "@/lib/dsa/dsa-problems";
import { DSAFundamentalsDrawer, type FundamentalTopicId } from "@/components/learn/DSAFundamentalsDrawer";

const FUNDAMENTALS = [
  {
    id: "big-o" as FundamentalTopicId,
    title: "Big O Notation & Time Complexity",
    subtitle: "How to evaluate code efficiency",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path fillRule="evenodd" d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" clipRule="evenodd" />
      </svg>
    ),
  },
  {
    id: "space-complexity" as FundamentalTopicId,
    title: "Space Complexity",
    subtitle: "Applying complexity analysis to memory usage",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
        <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z" />
        <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z" />
        <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z" />
      </svg>
    ),
  },
] as const;

const LEVELS = [
  {
    slug: "basic",
    label: "Basic",
    hint: "Arrays · Hash maps · Strings · Simple recursion",
    problems: DSA_BASIC_PROBLEMS,
    active: true,
    color: "emerald" as const,
    accentClass: "from-emerald-500/20 to-emerald-500/0",
    badgeClass: "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/30",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/60",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(52,211,153,0.18)]",
    ctaClass: "text-emerald-400 hover:text-emerald-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path d="M10.75 10.818v2.614A3.13 3.13 0 0011.888 13c.482-.315.612-.648.612-.875 0-.227-.13-.56-.612-.875a3.13 3.13 0 00-1.138-.432zM8.33 8.62c.053.055.115.11.184.164.208.16.46.284.736.363V6.603a2.45 2.45 0 00-.35.13c-.14.065-.27.143-.386.233-.377.292-.514.627-.514.909 0 .184.058.39.33.615z" />
        <path
          fillRule="evenodd"
          d="M9.99 2C5.582 2 2 5.528 2 9.875c0 4.347 3.582 7.875 7.99 7.875 4.408 0 7.99-3.528 7.99-7.875C17.98 5.528 14.398 2 9.99 2zM8.944 6.143c.19-.078.39-.138.606-.175V5.5a.75.75 0 011.5 0v.48c.195.04.384.094.565.16.642.235 1.205.686 1.435 1.37.046.14.07.286.07.436 0 .156-.027.308-.078.454-.296.844-1.185 1.285-1.992 1.517v2.683c.405-.058.787-.195 1.12-.406.482-.315.612-.648.612-.875a.75.75 0 011.5 0c0 .688-.372 1.292-.879 1.672a4.528 4.528 0 01-2.353.821v.34a.75.75 0 01-1.5 0v-.328a4.56 4.56 0 01-.95-.21c-.594-.214-1.178-.584-1.53-1.173a2.348 2.348 0 01-.346-1.234c0-.603.228-1.19.67-1.624.247-.24.539-.425.848-.554zm2.606 5.264v-2.56c.205.076.39.17.549.28.482.315.612.648.612.875s-.13.56-.612.875a2.717 2.717 0 01-.549.53z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    slug: "medium",
    label: "Medium",
    hint: "Trees · Stacks · Sliding window · BFS / DFS",
    problems: [] as typeof DSA_BASIC_PROBLEMS,
    active: false,
    color: "amber" as const,
    accentClass: "from-amber-500/20 to-amber-500/0",
    badgeClass: "text-amber-400 bg-amber-500/10 ring-1 ring-amber-500/30",
    borderClass: "border-amber-500/20 hover:border-amber-500/40",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(251,191,36,0.14)]",
    ctaClass: "text-amber-400 hover:text-amber-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M10 1a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 1zM5.05 3.05a.75.75 0 011.06 0l1.062 1.06A.75.75 0 016.11 5.173L5.05 4.11a.75.75 0 010-1.06zm9.9 0a.75.75 0 010 1.06l-1.06 1.062a.75.75 0 01-1.062-1.061l1.061-1.06a.75.75 0 011.06 0zM3 8a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 013 8zm11 0a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5A.75.75 0 0114 8zm-6.828 2.172a.75.75 0 010 1.06L6.11 12.295a.75.75 0 01-1.06-1.06l1.06-1.063a.75.75 0 011.061 0zm3.594 0a.75.75 0 011.06 0l1.062 1.062a.75.75 0 01-1.061 1.06l-1.06-1.06a.75.75 0 010-1.061zM10 14a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 0110 14zM4.5 8a5.5 5.5 0 1111 0 5.5 5.5 0 01-11 0z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  {
    slug: "advanced",
    label: "Advanced",
    hint: "Dynamic programming · Graphs · Backtracking",
    problems: [] as typeof DSA_BASIC_PROBLEMS,
    active: false,
    color: "rose" as const,
    accentClass: "from-rose-500/20 to-rose-500/0",
    badgeClass: "text-rose-400 bg-rose-500/10 ring-1 ring-rose-500/30",
    borderClass: "border-rose-500/20 hover:border-rose-500/40",
    glowClass: "hover:shadow-[0_0_32px_-4px_rgba(244,63,94,0.14)]",
    ctaClass: "text-rose-400 hover:text-rose-300",
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
        <path
          fillRule="evenodd"
          d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.outlook-1.087A5.5 5.5 0 005.5 10a5.5 5.5 0 1010.77-1.5 3.5 3.5 0 01-1.437.35c-.645 0-1.253-.185-1.771-.506a.75.75 0 00-.812 1.258 5 5 0 002.583.748A5.5 5.5 0 0013.5 4.938z"
          clipRule="evenodd"
        />
        <path
          fillRule="evenodd"
          d="M10 2a.75.75 0 01.75.75v7.5a.75.75 0 01-1.5 0v-7.5A.75.75 0 0110 2z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
] as const;

export function DSAHub() {
  const [openTopic, setOpenTopic] = useState<FundamentalTopicId | null>(null);

  return (
    <div className="min-h-screen">
      {/* Top nav */}
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

        {/* Fundamentals section */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <div className="h-4 w-0.5 rounded-full bg-[var(--accent)] opacity-60" />
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--muted)]">
              Fundamentals — Analysis
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {FUNDAMENTALS.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setOpenTopic(topic.id)}
                className="group flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] px-5 py-4 text-left transition hover:border-[var(--accent)]/40 hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:shadow-[0_0_20px_-6px_color-mix(in_oklab,var(--accent)_20%,transparent)]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[var(--accent)]/20 bg-[var(--accent)]/8 text-[var(--accent)]">
                  {topic.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-[var(--text)] group-hover:text-[var(--accent)] transition truncate">
                    {topic.title}
                  </p>
                  <p className="mt-0.5 text-xs text-[var(--muted)] truncate">{topic.subtitle}</p>
                </div>
                <svg
                  className="h-4 w-4 shrink-0 text-[var(--faint)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Level cards */}
        <div className="grid gap-5 sm:grid-cols-3">
          {LEVELS.map((level) => (
            <div
              key={level.slug}
              className={`group relative overflow-hidden rounded-2xl border bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-300 ${level.borderClass} ${level.glowClass}`}
            >
              {/* Gradient top accent */}
              <div className={`h-1 w-full bg-gradient-to-r ${level.accentClass} opacity-80`} />

              <div className="p-6">
                {/* Icon + badge row */}
                <div className="mb-4 flex items-center justify-between">
                  <span className={`rounded-xl p-2 ${level.badgeClass}`}>{level.icon}</span>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${level.badgeClass}`}>
                    {level.label}
                  </span>
                </div>

                <h2 className="text-lg font-semibold text-[var(--text)]">{level.label} Level</h2>
                <p className="mt-1.5 text-sm text-[var(--muted)]">{level.hint}</p>

                {/* Problem count */}
                <div className="mt-5 flex items-center gap-2">
                  <span className="font-mono text-2xl font-bold text-[var(--text)]">
                    {level.problems.length}
                  </span>
                  <span className="text-sm text-[var(--muted)]">
                    {level.problems.length === 1 ? "problem" : "problems"}
                  </span>
                </div>

                {/* CTA */}
                <div className="mt-5">
                  {level.active && level.problems.length > 0 ? (
                    <Link
                      href={`/learn/dsa/${level.slug}`}
                      className={`inline-flex items-center gap-1.5 text-sm font-semibold transition ${level.ctaClass}`}
                    >
                      Start solving
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                          clipRule="evenodd"
                        />
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

              {/* Problem preview list (basic only) */}
              {level.active && level.problems.length > 0 && (
                <div className="border-t border-[var(--border)] px-4 pb-4 pt-3">
                  <p className="mb-2 text-xs text-[var(--faint)]">Recent</p>
                  {level.problems.slice(0, 3).map((p) => (
                    <Link
                      key={p.slug}
                      href={`/learn/dsa/${p.difficulty}/${p.slug}`}
                      className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] hover:text-[var(--text)]"
                    >
                      <span className="font-mono text-xs text-[var(--faint)]">#{p.id}</span>
                      <span className="flex-1 truncate">{p.title}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <DSAFundamentalsDrawer topicId={openTopic} onClose={() => setOpenTopic(null)} />
    </div>
  );
}
