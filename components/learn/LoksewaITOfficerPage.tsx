"use client";

import { useState, useEffect } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import {
  IT_OFFICER_CONCEPTS,
  IT_OFFICER_CONCEPT_COUNT,
  IT_OFFICER_SECTIONS,
  type ITOfficerConcept,
} from "@/lib/loksewa-learning/it-officer-syllabus-data";

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

function SectionLabel({ label, color = "accent" }: { label: string; color?: "accent" | "blue" }) {
  const dotColor = color === "blue" ? "bg-blue-400" : "bg-[var(--accent)]";
  const textColor = color === "blue" ? "text-blue-400" : "text-[var(--accent)]";
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={`h-1.5 w-1.5 rounded-full ${dotColor}`} />
      <h3 className={`text-xs font-semibold uppercase tracking-widest ${textColor}`}>{label}</h3>
    </div>
  );
}

function ConceptDrawer({ concept, index, onClose }: { concept: ITOfficerConcept | null; index: number; onClose: () => void }) {
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
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />

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

        <div className="flex-1 overflow-y-auto overscroll-y-contain px-6 py-6 flex flex-col gap-7">
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

          <section>
            <SectionLabel label="Explanation" color="accent" />
            <div className="space-y-2.5">
              {concept.description.split("\n\n").map((para, i) => renderParagraph(para, i))}
            </div>
          </section>

          {concept.note && (
            <section className="rounded-xl border border-blue-500/20 border-l-4 border-l-blue-500/60 bg-blue-500/5 p-4">
              <SectionLabel label="Key Takeaway" color="blue" />
              <div className="space-y-2.5">
                {concept.note.split("\n\n").map((para, i) => renderParagraph(para, i))}
              </div>
            </section>
          )}

          {concept.diagram && (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M1 5.25A2.25 2.25 0 0 1 3.25 3h13.5A2.25 2.25 0 0 1 19 5.25v9.5A2.25 2.25 0 0 1 16.75 17H3.25A2.25 2.25 0 0 1 1 14.75v-9.5Zm1.5 5.81v3.69c0 .414.336.75.75.75h13.5a.75.75 0 0 0 .75-.75v-2.69l-2.22-2.219a.75.75 0 0 0-1.06 0l-1.91 1.909-.48-.479a.75.75 0 0 0-1.06 0L6.22 14.53l-.97-.97a.75.75 0 0 0-1.06 0l-1.69 1.69V11.06Zm14.5-5.81A.75.75 0 0 0 16.75 4.5H3.25a.75.75 0 0 0-.75.75V9.25l1.97-1.97a.75.75 0 0 1 1.06 0l.98.98 1.909-1.91a.75.75 0 0 1 1.06 0l2.219 2.22 1.47-1.47a.75.75 0 0 1 1.061 0L17 8.939V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
                Flow Diagram
              </h3>
              <pre className="rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] p-4 font-mono text-xs leading-relaxed text-[var(--text)] overflow-x-auto whitespace-pre">
                {concept.diagram}
              </pre>
            </section>
          )}
        </div>
      </aside>
    </div>
  );
}

function ConceptCard({ concept, index, onClick }: { concept: ITOfficerConcept; index: number; onClick: () => void }) {
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

const orderedConcepts = IT_OFFICER_SECTIONS.flatMap(
  (section) => IT_OFFICER_CONCEPTS.filter((c) => c.section === section)
);
const positionOf = new Map(orderedConcepts.map((c, i) => [c.id, i + 1]));

export function LoksewaITOfficerPage() {
  const [active, setActive] = useState<ITOfficerConcept | null>(null);

  return (
    <>
      <div className="min-h-screen">
        <div className="sticky top-0 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center gap-4 px-4 py-3 sm:px-6">
            <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pb-20 pt-12 sm:px-6">
          <div className="relative mb-10">
            <div className="absolute -inset-x-4 -top-4 h-48 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
            <div className="relative">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-3 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_6px_var(--accent)]" />
                <span className="text-xs font-medium text-[var(--accent)]">Loksewa Exam Prep</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-[var(--text)] sm:text-5xl">
                Master IT Officer
                <br />
                <span className="text-[var(--accent)]">Syllabus</span>
              </h1>
              <p className="mt-4 max-w-xl text-[var(--muted)]">
                The {IT_OFFICER_CONCEPT_COUNT} core topics of the IT Officer syllabus, organized by chapter — with
                full explanations and exam-focused key takeaways.
              </p>
            </div>
          </div>

          <div className="mb-10 flex flex-wrap gap-4">
            {[
              { label: "Topics", value: `${IT_OFFICER_CONCEPT_COUNT}` },
              { label: "Chapters", value: `${IT_OFFICER_SECTIONS.length}` },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3">
                <p className="font-mono text-xl font-bold text-[var(--accent)]">{s.value}</p>
                <p className="text-xs text-[var(--muted)]">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            {IT_OFFICER_SECTIONS.map((section) => {
              const sectionConcepts = IT_OFFICER_CONCEPTS.filter((c) => c.section === section);
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
