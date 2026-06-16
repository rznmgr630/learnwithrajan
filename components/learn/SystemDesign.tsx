"use client";

import { useState, useEffect } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SYSTEM_DESIGN_CONCEPTS, CONCEPT_COUNT, SYSTEM_DESIGN_SECTIONS, type SystemDesignConcept } from "@/lib/system-design/concepts";
import { SYSTEM_DESIGN_DIAGRAMS } from "@/lib/system-design/diagrams";
import { SdDiagram } from "@/components/learn/SdDiagram";

function renderLine(text: string) {
  const parts = text.split(/(<b>[^<]+<\/b>|`[^`]+`)/g);
  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("<b>") && part.endsWith("</b>"))
          return <strong key={i} className="font-semibold text-[var(--text)]">{part.slice(3, -4)}</strong>;
        if (part.startsWith("`") && part.endsWith("`"))
          return <code key={i} className="rounded bg-[var(--elevated)] px-1.5 py-0.5 font-mono text-xs text-[var(--accent)]">{part.slice(1, -1)}</code>;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function renderParagraph(text: string, i: number) {
  const lines = text.split("\n");
  const elements = lines.map((line, j) => {
    if (/^\s*↳/.test(line)) {
      const content = line.replace(/^\s*↳\s*/, "");
      return (
        <div key={j} className="flex items-start gap-2 pl-5">
          <span className="mt-0.5 shrink-0 text-xs text-[var(--accent)]/50">↳</span>
          <span className="text-sm leading-relaxed text-[var(--muted)]">{renderLine(content)}</span>
        </div>
      );
    }
    if (line.startsWith("• ")) {
      return (
        <div key={j} className="flex items-start gap-2.5">
          <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]/50" />
          <span className="text-sm leading-relaxed text-[var(--text)]">{renderLine(line.slice(2))}</span>
        </div>
      );
    }
    const numMatch = line.match(/^(\d+)\.\s(.+)$/);
    if (numMatch) {
      return (
        <div key={j} className="flex items-start gap-3">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/15 font-mono text-[10px] font-bold text-[var(--accent)]">
            {numMatch[1]}
          </span>
          <span className="text-sm leading-relaxed text-[var(--text)]">{renderLine(numMatch[2])}</span>
        </div>
      );
    }
    if (!line.trim()) return null;
    return (
      <p key={j} className="text-sm leading-relaxed text-[var(--text)]">
        {renderLine(line)}
      </p>
    );
  });

  return (
    <div key={i} className="space-y-1.5">
      {elements}
    </div>
  );
}

function SectionLabel({ label, color = "accent" }: { label: string; color?: "accent" | "amber" | "muted" | "blue" }) {
  const dotColor =
    color === "amber" ? "bg-amber-400" :
    color === "muted" ? "bg-[var(--muted)]" :
    color === "blue" ? "bg-blue-400" :
    "bg-[var(--accent)]";
  const textColor =
    color === "amber" ? "text-amber-400" :
    color === "muted" ? "text-[var(--muted)]" :
    color === "blue" ? "text-blue-400" :
    "text-[var(--accent)]";
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <h3 className={`text-xs font-semibold uppercase tracking-widest ${textColor}`}>{label}</h3>
    </div>
  );
}

function ConceptDrawer({ concept, index, onClose }: { concept: SystemDesignConcept | null; index: number; onClose: () => void }) {
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
      <aside className="relative flex h-full w-full max-w-2xl flex-col bg-[var(--background)] shadow-2xl">
        {/* Top accent gradient line */}
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] px-6 py-5">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
                {concept.section}
              </span>
              <span className="text-[10px] text-[var(--faint)]">#{index}</span>
            </div>
            <h2 className="text-2xl font-bold leading-snug text-[var(--text)]">{concept.title}</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">{concept.tagline}</p>
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
        <div className="flex-1 overflow-y-auto overscroll-y-contain px-6 py-6 flex flex-col gap-7">

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {concept.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* What it is */}
          <section>
            <SectionLabel label="What it is" color="accent" />
            <div className="space-y-2.5">
              {concept.description.split("\n\n").map((para, i) => renderParagraph(para, i))}
            </div>
          </section>

          {/* Note */}
          {concept.note && (
            <section className="rounded-xl border border-blue-500/20 border-l-4 border-l-blue-500/60 bg-blue-500/5 p-4">
              <SectionLabel label="Key Takeaway" color="blue" />
              <div className="space-y-2.5">
                {concept.note.split("\n\n").map((para, i) => renderParagraph(para, i))}
              </div>
            </section>
          )}

          {/* Why it matters */}
          <section className="rounded-xl border border-amber-500/20 border-l-4 border-l-amber-500/60 bg-amber-500/5 p-4">
            <SectionLabel label="Why it matters" color="amber" />
            <div className="space-y-2.5">
              {concept.whyItMatters.split("\n\n").map((para, i) => renderParagraph(para, i))}
            </div>
          </section>

          {/* Diagram */}
          {SYSTEM_DESIGN_DIAGRAMS[concept.id] && (
            <section>
              <SectionLabel label="Diagram" color="accent" />
              <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-3">
                <SdDiagram config={SYSTEM_DESIGN_DIAGRAMS[concept.id]} uid={`sd-${concept.id}`} />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-[var(--faint)]">{concept.diagramNote}</p>
            </section>
          )}

          {/* Real-world example */}
          <section>
            <SectionLabel label="Real-world example" color="muted" />
            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)] p-4 space-y-2.5">
              {concept.example.split("\n\n").map((para, i) => renderParagraph(para, i))}
            </div>
          </section>

          {/* Interview tip */}
          <section className="rounded-xl border border-[var(--accent)]/20 border-l-4 border-l-[var(--accent)] bg-[var(--accent)]/5 p-4">
            <SectionLabel label="Interview tip" color="accent" />
            <div className="space-y-2.5">
              {concept.interviewTip.split("\n\n").map((para, i) => renderParagraph(para, i))}
            </div>
          </section>

        </div>
      </aside>
    </div>
  );
}

function ConceptCard({ concept, index, onClick }: { concept: SystemDesignConcept; index: number; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer items-start gap-4 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-4 text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 font-mono text-xs font-bold text-[var(--accent)]">
        {index}
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

const orderedConcepts = SYSTEM_DESIGN_SECTIONS.flatMap(
  (section) => SYSTEM_DESIGN_CONCEPTS.filter((c) => c.section === section)
);
const positionOf = new Map(orderedConcepts.map((c, i) => [c.id, i + 1]));

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
                      <ConceptCard key={concept.id} concept={concept} index={positionOf.get(concept.id)!} onClick={() => setActive(concept)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <ConceptDrawer concept={active} index={active ? positionOf.get(active.id)! : 0} onClose={() => setActive(null)} />
    </>
  );
}
