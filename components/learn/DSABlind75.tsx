"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { DSABlind75Detail } from "@/components/learn/DSABlind75Detail";
import { DSAFundamentalsDrawer, type FundamentalTopicId } from "@/components/learn/DSAFundamentalsDrawer";
import { BLIND75_CATEGORIES, BLIND75_TOTAL, type Blind75Problem } from "@/lib/dsa/blind75";

const CATEGORY_COLORS: Record<string, { badge: string; dot: string; border: string }> = {
  array:                { badge: "text-emerald-400 bg-emerald-500/10 ring-1 ring-emerald-500/25", dot: "bg-emerald-400", border: "border-emerald-500/20" },
  binary:               { badge: "text-violet-400  bg-violet-500/10  ring-1 ring-violet-500/25",  dot: "bg-violet-400",  border: "border-violet-500/20" },
  "dynamic-programming":{ badge: "text-amber-400   bg-amber-500/10   ring-1 ring-amber-500/25",   dot: "bg-amber-400",   border: "border-amber-500/20" },
  graph:                { badge: "text-cyan-400    bg-cyan-500/10    ring-1 ring-cyan-500/25",    dot: "bg-cyan-400",    border: "border-cyan-500/20" },
  interval:             { badge: "text-rose-400    bg-rose-500/10    ring-1 ring-rose-500/25",    dot: "bg-rose-400",    border: "border-rose-500/20" },
  "linked-list":        { badge: "text-sky-400     bg-sky-500/10     ring-1 ring-sky-500/25",     dot: "bg-sky-400",     border: "border-sky-500/20" },
  matrix:               { badge: "text-orange-400  bg-orange-500/10  ring-1 ring-orange-500/25",  dot: "bg-orange-400",  border: "border-orange-500/20" },
  string:               { badge: "text-pink-400    bg-pink-500/10    ring-1 ring-pink-500/25",    dot: "bg-pink-400",    border: "border-pink-500/20" },
  tree:                 { badge: "text-teal-400    bg-teal-500/10    ring-1 ring-teal-500/25",    dot: "bg-teal-400",    border: "border-teal-500/20" },
  heap:                 { badge: "text-indigo-400  bg-indigo-500/10  ring-1 ring-indigo-500/25",  dot: "bg-indigo-400",  border: "border-indigo-500/20" },
};

const FUNDAMENTAL_TOPICS = [
  { id: "big-o" as FundamentalTopicId, label: "Big O Notation", subtitle: "Time complexity analysis" },
  { id: "space-complexity" as FundamentalTopicId, label: "Space Complexity", subtitle: "Memory usage analysis" },
];

export function DSABlind75() {
  const [active, setActive] = useState<Blind75Problem | null>(null);
  const [openTopic, setOpenTopic] = useState<FundamentalTopicId | null>(null);

  return (
    <>
      <div className="min-h-screen">
        {/* Sticky nav */}
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-3 sm:px-6">
            <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 pb-20 pt-12 sm:px-6">
          {/* Hero */}
          <div className="relative mb-10">
            <div className="absolute -inset-x-4 -top-4 h-48 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                <span className="text-xs font-medium text-[var(--accent)]">Interview Prep</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
                Blind
                <span className="text-[var(--accent)]"> 75</span>
              </h1>
              <p className="mt-4 max-w-xl text-[var(--muted)]">
                The most frequently asked LeetCode problems in technical interviews. Click any problem to
                see the description, examples, and solutions in 5 languages.
              </p>
            </div>
          </div>

          {/* Fundamentals */}
          <div className="mb-10">
            <div className="mb-3 flex items-center gap-3">
              <div className="h-5 w-0.5 rounded-full bg-violet-400 opacity-70" />
              <h2 className="text-base font-semibold text-[var(--text)]">Fundamentals</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {FUNDAMENTAL_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => setOpenTopic(topic.id)}
                  className="group flex items-center gap-3 rounded-xl border border-violet-500/20 bg-[color-mix(in_oklab,var(--surface)_90%,transparent)] px-4 py-3 text-left transition hover:border-violet-500/50 hover:bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)]"
                >
                  <span className="rounded-lg bg-violet-500/10 p-2 text-violet-400 ring-1 ring-violet-500/20">
                    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path fillRule="evenodd" d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" clipRule="evenodd" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-medium text-[var(--text)]">{topic.label}</p>
                    <p className="text-xs text-[var(--muted)]">{topic.subtitle}</p>
                  </div>
                  <svg className="ml-1 h-4 w-4 shrink-0 text-[var(--faint)] transition group-hover:text-violet-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                  </svg>
                </button>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { label: "Problems", value: BLIND75_TOTAL.toString() },
              { label: "Categories", value: BLIND75_CATEGORIES.length.toString() },
              { label: "Languages", value: "5" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3">
                <p className="font-mono text-xl font-bold text-[var(--accent)]">{s.value}</p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Category accordions */}
          <div className="flex flex-col gap-4">
            {(() => {
              // Precompute cumulative offsets so every problem gets a clean sequential number
              const offsets = BLIND75_CATEGORIES.reduce<number[]>((acc, cat, i) => {
                acc.push(i === 0 ? 0 : acc[i - 1] + BLIND75_CATEGORIES[i - 1].problems.length);
                return acc;
              }, []);
              return BLIND75_CATEGORIES.map((cat, catIndex) => {
              const colors = CATEGORY_COLORS[cat.id] ?? CATEGORY_COLORS["array"];
              return (
                <details
                  key={cat.id}
                  className={`group overflow-hidden rounded-xl border bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm open:[&_.chevron]:rotate-180 ${colors.border}`}
                  open={catIndex === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
                    <div className="flex items-center gap-3">
                      <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                      <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
                        {catIndex + 1}. {cat.name}
                      </h2>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${colors.badge}`}>
                        {cat.problems.length}
                      </span>
                    </div>
                    <svg
                      className="chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </summary>

                  <div className="border-t border-[var(--border)]">
                    {/* Table header */}
                    <div className="grid grid-cols-[2.5rem_1fr_1fr_1fr] gap-x-4 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_30%,transparent)] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted)]">
                      <span>#</span>
                      <span>Problem</span>
                      <span>Pattern</span>
                      <span>Visual</span>
                    </div>

                    {/* Rows */}
                    {cat.problems.map((p, i) => {
                      const hasDetail = !!p.solutions?.length;
                      const displayNum = offsets[catIndex] + i + 1;
                      return (
                        <button
                          key={p.num}
                          onClick={() => setActive(p)}
                          className={`grid w-full grid-cols-[2.5rem_1fr_1fr_1fr] gap-x-4 px-4 py-3 text-left text-sm transition hover:bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] ${i < cat.problems.length - 1 ? "border-b border-[var(--border)]" : ""}`}
                        >
                          {/* # */}
                          <span className="font-mono text-xs text-[var(--muted)] pt-0.5">{displayNum}</span>

                          {/* Problem name */}
                          <div className="flex items-start gap-1.5 min-w-0">
                            <span className={`cursor-pointer font-medium leading-snug ${hasDetail ? "text-[var(--accent)]" : "text-[var(--text)]"}`}>
                              {p.title}
                            </span>
                            {p.premium && <span className="mt-0.5 shrink-0 text-amber-400" title="Premium">🔒</span>}
                            {hasDetail && (
                              <span className="mt-0.5 shrink-0 rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--accent)]">
                                NEW
                              </span>
                            )}
                          </div>

                          {/* Pattern */}
                          <span className="text-[var(--text)] leading-snug">{p.pattern}</span>

                          {/* Visual */}
                          <span className="font-mono text-xs text-[var(--muted)] leading-snug break-all">{p.visual}</span>
                        </button>
                      );
                    })}
                  </div>
                </details>
              );
            });
            })()}
          </div>

          <p className="mt-8 text-center text-xs text-[var(--faint)]">
            🔒 Premium problems require a LeetCode subscription · Problems with{" "}
            <span className="rounded-full bg-[var(--accent)]/10 px-1.5 py-0.5 text-[9px] font-semibold text-[var(--accent)]">NEW</span>{" "}
            badge have full walkthroughs
          </p>
        </div>
      </div>

      <DSABlind75Detail problem={active} onClose={() => setActive(null)} />
      <DSAFundamentalsDrawer topicId={openTopic} onClose={() => setOpenTopic(null)} />
    </>
  );
}
