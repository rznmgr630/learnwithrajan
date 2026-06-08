"use client";

import { useState, useEffect } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SYSTEM_DESIGN_CONCEPTS, CONCEPT_COUNT, SYSTEM_DESIGN_SECTIONS, type SystemDesignConcept } from "@/lib/system-design/concepts";
import { SYSTEM_DESIGN_DIAGRAMS } from "@/lib/system-design/diagrams";
import { SdDiagram } from "@/components/learn/SdDiagram";

function ConceptDrawer({ concept, onClose }: { concept: SystemDesignConcept | null; onClose: () => void }) {
  useEffect(() => {
    if (!concept) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [concept]);

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
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">
              {concept.section} · #{concept.id}
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-y-contain p-5 flex flex-col gap-6">
          {/* Tags */}
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

          {/* What it is */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">What it is</h3>
            <div className="space-y-3">
              {concept.description.split("\n\n").map((para, i) => (
                <p key={i} className="text-sm leading-relaxed text-[var(--text)]">
                  {para.split("\n").map((line, j, arr) => (
                    <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
                  ))}
                </p>
              ))}
            </div>
          </section>

          {/* Why it matters */}
          <section className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-400">Why it matters</h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.whyItMatters}</p>
          </section>

          {/* Diagram */}
          {SYSTEM_DESIGN_DIAGRAMS[concept.id] && (
            <section>
              <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--accent)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 1 1 2.828 2.828l-.793.793-2.828-2.828.793-.793ZM11.379 5.793 3 14.172V17h2.828l8.38-8.379-2.83-2.828Z" />
                </svg>
                Diagram
              </h3>
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-3">
                <SdDiagram config={SYSTEM_DESIGN_DIAGRAMS[concept.id]} uid={`sd-${concept.id}`} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--faint)]">{concept.diagramNote}</p>
            </section>
          )}

          {/* Real-world example */}
          <section>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Real-world example</h3>
            <p className="text-sm leading-relaxed text-[var(--text)]">{concept.example}</p>
          </section>

          {/* Interview tip */}
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

function ConceptCard({ concept, onClick }: { concept: SystemDesignConcept; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 font-mono text-xs font-bold text-[var(--accent)]">
        {concept.id}
      </span>
      <div className="min-w-0">
        <p className="font-semibold text-[var(--text)] group-hover:text-[var(--accent)] transition">
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

export function SystemDesign() {
  const [active, setActive] = useState<SystemDesignConcept | null>(null);

  return (
    <>
      <div className="min-h-screen">
        {/* Sticky nav */}
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
                System Design
                <br />
                <span className="text-[var(--accent)]">Interview Guide</span>
              </h1>
              <p className="mt-4 max-w-xl text-[var(--muted)]">
                The {CONCEPT_COUNT} core concepts that come up in every system design interview — with real-world
                examples, deep explanations, and actionable interview tips.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { label: "Concepts", value: `${CONCEPT_COUNT}` },
              { label: "Real-world examples", value: `${CONCEPT_COUNT}` },
              { label: "Interview tips", value: `${CONCEPT_COUNT}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3">
                <p className="font-mono text-xl font-bold text-[var(--accent)]">{s.value}</p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Concept list grouped by section */}
          <div className="flex flex-col gap-8">
            {SYSTEM_DESIGN_SECTIONS.map((section) => {
              const sectionConcepts = SYSTEM_DESIGN_CONCEPTS.filter((c) => c.section === section);
              if (sectionConcepts.length === 0) return null;
              return (
                <div key={section}>
                  <div className="mb-3 flex items-center gap-3">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{section}</h2>
                    <div className="flex-1 border-t border-[var(--border)]" />
                    <span className="text-[10px] text-[var(--faint)]">{sectionConcepts.length}</span>
                  </div>
                  <div className="flex flex-col gap-3">
                    {sectionConcepts.map((concept) => (
                      <ConceptCard key={concept.id} concept={concept} onClick={() => setActive(concept)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConceptDrawer concept={active} onClose={() => setActive(null)} />
    </>
  );
}
