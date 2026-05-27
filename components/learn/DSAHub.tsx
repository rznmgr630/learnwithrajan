"use client";

import { useState } from "react";
import Link from "next/link";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { BLIND75_TOTAL } from "@/lib/dsa/blind75";
import { DSAFundamentalsDrawer, type FundamentalTopicId } from "@/components/learn/DSAFundamentalsDrawer";

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

export function DSAHub() {
  const [openTopic, setOpenTopic] = useState<FundamentalTopicId | null>(null);

  return (
    <div className="min-h-screen">
      {/* Sticky top nav */}
      <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
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
            { label: "Problems", value: BLIND75_TOTAL.toString() },
            { label: "Languages", value: "5" },
            { label: "Topics", value: "2" },
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

        {/* Cards grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          {/* ── Blind 75 card ── */}
          <Link
            href="/learn/dsa/blind75"
            className="group relative overflow-hidden rounded-2xl border border-orange-500/30 bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] transition-all duration-300 hover:border-orange-500/60 hover:shadow-[0_0_32px_-4px_rgba(249,115,22,0.18)]"
          >
            <div className="h-1 w-full bg-gradient-to-r from-orange-500/20 to-orange-500/0 opacity-80" />
            <div className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="rounded-xl p-2 text-orange-400 bg-orange-500/10 ring-1 ring-orange-500/30">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                  </svg>
                </span>
                <span className="rounded-full px-2.5 py-1 text-xs font-semibold text-orange-400 bg-orange-500/10 ring-1 ring-orange-500/30">
                  Must-Know
                </span>
              </div>
              <h2 className="text-base font-semibold text-[var(--text)]">Blind 75</h2>
              <p className="mt-1 text-xs text-[var(--muted)]">Top interview patterns & visual hints</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="font-mono text-2xl font-bold text-[var(--text)]">{BLIND75_TOTAL}</span>
                <span className="text-sm text-[var(--muted)]">problems</span>
              </div>
              <div className="mt-4">
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-400 transition group-hover:text-orange-300">
                  View list
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
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

              <div className="mt-5 flex flex-wrap gap-2">
                {FUNDAMENTAL_TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setOpenTopic(topic.id)}
                    className="rounded-full border border-violet-500/20 bg-violet-500/8 px-3 py-1 text-xs font-medium text-violet-400 transition hover:border-violet-500/40 hover:bg-violet-500/15"
                  >
                    {topic.id === "big-o" ? "Big O Notation" : "Space Complexity"}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      <DSAFundamentalsDrawer topicId={openTopic} onClose={() => setOpenTopic(null)} />
    </div>
  );
}
