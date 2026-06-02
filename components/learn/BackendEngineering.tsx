"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import {
  BACKEND_CONCEPTS,
  BACKEND_CATEGORIES,
  BACKEND_CONCEPT_COUNT,
  type BackendConcept,
} from "@/lib/backend-engineering/concepts";

function ConceptDrawer({ concept, onClose }: { concept: BackendConcept | null; onClose: () => void }) {
  if (!concept) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
              #{concept.id} · {concept.category}
            </span>
            <h2 className="text-xl font-bold leading-snug text-[var(--text)]">{concept.title}</h2>
            <p className="text-sm text-[var(--muted)]">{concept.tagline}</p>
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

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          <div className="flex flex-wrap gap-2">
            {concept.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-0.5 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">What it is</h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.description}</p>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">Why it matters</h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.whyItMatters}</p>
          </section>

          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Real-world example</h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.example}</p>
          </section>

          <section className="rounded-xl border border-[var(--accent)]/20 bg-[var(--accent)]/5 p-4">
            <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
              <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              Interview tip
            </h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.interviewTip}</p>
          </section>
        </div>
      </aside>
    </div>
  );
}

function ConceptCard({ concept, onClick }: { concept: BackendConcept; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 font-mono text-xs font-bold text-[var(--accent)]">
        {concept.id}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-[var(--text)] transition group-hover:text-[var(--accent)]">
          {concept.title}
        </p>
        <p className="mt-0.5 text-sm text-[var(--muted)]">{concept.tagline}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {concept.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[var(--border)] px-2 py-0.5 text-[10px] text-[var(--faint)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <svg
        className="ml-auto mt-1 h-4 w-4 shrink-0 text-[var(--faint)] transition group-hover:translate-x-0.5 group-hover:text-[var(--accent)]"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
      </svg>
    </button>
  );
}

export function BackendEngineering() {
  const [active, setActive] = useState<BackendConcept | null>(null);

  return (
    <>
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
            <LearnBackNav href="/learn/programming" labelKey="learn.backProgramming" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6">
          {/* Hero */}
          <div className="relative mb-10">
            <div className="absolute -inset-x-4 -top-4 h-48 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                <span className="text-xs font-medium text-[var(--accent)]">Interview Prep</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
                Backend Engineering
                <br />
                <span className="text-[var(--accent)]">Concepts</span>
              </h1>
              <p className="mt-4 max-w-xl text-[var(--muted)]">
                The {BACKEND_CONCEPT_COUNT} concepts every backend engineer needs to know — APIs, databases, caching,
                distributed systems, and reliability. Each card has a deep explanation, real-world example, and an
                interview tip.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { label: "Concepts", value: `${BACKEND_CONCEPT_COUNT}` },
              { label: "Categories", value: `${BACKEND_CATEGORIES.length}` },
              { label: "Interview tips", value: `${BACKEND_CONCEPT_COUNT}` },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3"
              >
                <p className="font-mono text-xl font-bold text-[var(--accent)]">{s.value}</p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-10">
            {BACKEND_CATEGORIES.map((category) => {
              const concepts = BACKEND_CONCEPTS.filter((c) => c.category === category);
              return (
                <section key={category}>
                  <div className="mb-4 flex items-center gap-3">
                    <h2 className="text-lg font-bold tracking-tight text-[var(--text)]">{category}</h2>
                    <span className="rounded-full bg-[var(--accent)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--accent)]">
                      {concepts.length}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {concepts.map((concept) => (
                      <ConceptCard key={concept.id} concept={concept} onClick={() => setActive(concept)} />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      </div>

      <ConceptDrawer concept={active} onClose={() => setActive(null)} />
    </>
  );
}
