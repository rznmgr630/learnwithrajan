"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { CourseSidebar, type CourseSidebarSection } from "@/components/learn/CourseSidebar";
import { CodeBlock } from "@/components/learn/CodeBlock";
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

const conceptBySlug = new Map(IT_OFFICER_CONCEPTS.map((c) => [c.slug, c]));

function topAncestorTitle(concept: ITOfficerConcept): string {
  let current = concept;
  while (current.parentSlug) {
    const parent = conceptBySlug.get(current.parentSlug);
    if (!parent) break;
    current = parent;
  }
  return current.title;
}

function ConceptDetail({ concept, index }: { concept: ITOfficerConcept; index: number }) {
  return (
    <div>
      <div className="sticky top-[101px] z-[5] overflow-hidden rounded-t-2xl border border-b-0 border-[var(--border)] bg-[var(--elevated)] shadow-sm">
        <div className="h-[3px] w-full shrink-0 bg-gradient-to-r from-[var(--accent)] via-[var(--accent)]/50 to-transparent" />
        <div className="border-b border-[var(--border)] px-6 py-5">
          <div className="mb-2 flex items-center gap-2">
            <span className="rounded-md bg-[var(--accent)]/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[var(--accent)]">
              {topAncestorTitle(concept)}
            </span>
            <span className="text-[10px] text-[var(--faint)]">#{index}</span>
          </div>
          <h2 className="text-2xl font-bold leading-snug text-[var(--text)]">{concept.title}</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">{concept.tagline}</p>
        </div>
      </div>

      <article className="overflow-hidden rounded-b-2xl border border-t-0 border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm">
        <div className="flex flex-col gap-7 px-6 py-6">
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

          {concept.code && (
            <section>
              <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
                <svg className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.79 5.23a.75.75 0 0 1 1.06 0l4 4a.75.75 0 0 1 0 1.06l-4 4a.75.75 0 1 1-1.06-1.06L16.13 10l-3.34-3.34a.75.75 0 0 1 0-1.06Zm-5.58 0a.75.75 0 0 1 0 1.06L3.87 10l3.34 3.34a.75.75 0 0 1-1.06 1.06l-4-4a.75.75 0 0 1 0-1.06l4-4a.75.75 0 0 1 1.06 0Z"
                    clipRule="evenodd"
                  />
                </svg>
                Code Example
              </h3>
              <CodeBlock code={concept.code} language={concept.codeLanguage} />
            </section>
          )}
        </div>
      </article>
    </div>
  );
}

const BASE_PATH = "/learn/loksewa/it-officer";

const orderedConcepts = IT_OFFICER_SECTIONS.flatMap(
  (section) => IT_OFFICER_CONCEPTS.filter((c) => c.section === section)
);
const positionOf = new Map(orderedConcepts.map((c, i) => [c.id, i + 1]));

function buildSidebarItems(sectionConcepts: ITOfficerConcept[], parentSlug: string | undefined): CourseSidebarSection["items"] {
  return sectionConcepts
    .filter((c) => c.parentSlug === parentSlug)
    .map((c) => {
      const ownChildren = buildSidebarItems(sectionConcepts, c.slug);
      const crossLinked = (c.crossLinkSlugs ?? [])
        .map((slug) => IT_OFFICER_CONCEPTS.find((x) => x.slug === slug))
        .filter((x): x is ITOfficerConcept => !!x)
        .map((x) => ({ id: x.id, label: x.title, href: `${BASE_PATH}/${x.slug}` }));
      const children = [...ownChildren, ...crossLinked];
      return {
        id: c.id,
        label: c.title,
        href: `${BASE_PATH}/${c.slug}`,
        ...(children.length ? { children } : {}),
      };
    });
}

const sidebarSections: CourseSidebarSection[] = IT_OFFICER_SECTIONS.map((section) => ({
  id: section,
  label: section,
  items: buildSidebarItems(IT_OFFICER_CONCEPTS.filter((c) => c.section === section), undefined),
}));

export function LoksewaITOfficerPage({ activeConcept }: { activeConcept?: ITOfficerConcept | null }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <div className="sticky top-14 z-10 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_80%,transparent)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-3 py-1.5 text-sm font-medium text-[var(--text)] transition hover:bg-[var(--elevated)] md:hidden"
          >
            <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 5A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zM2.75 14a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75z" clipRule="evenodd" />
            </svg>
            Syllabus
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:gap-8">
          <CourseSidebar
            heading="Syllabus"
            sections={sidebarSections}
            activeItemId={activeConcept?.id ?? null}
            storageKeyPrefix="acc:it-officer-sidebar"
            mobileOpen={mobileNavOpen}
            onMobileOpenChange={setMobileNavOpen}
            hideMobileTrigger
          />

          <div className="min-w-0 flex-1">
            {activeConcept ? (
              <ConceptDetail concept={activeConcept} index={positionOf.get(activeConcept.id)!} />
            ) : (
              <div className="relative flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="absolute -inset-x-4 -top-4 h-48 bg-gradient-to-b from-[var(--accent)]/5 to-transparent" />
                <div className="relative flex flex-col items-center">
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

                  <div className="mt-8 flex flex-wrap justify-center gap-4">
                    {[
                      { label: "Topics", value: `${IT_OFFICER_CONCEPT_COUNT}` },
                      { label: "Chapters", value: `${IT_OFFICER_CONCEPTS.filter((c) => !c.parentSlug).length}` },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-5 py-3">
                        <p className="font-mono text-xl font-bold text-[var(--accent)]">{s.value}</p>
                        <p className="text-xs text-[var(--muted)]">{s.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
