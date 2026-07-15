"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { IT_OFFICER_SYLLABUS } from "@/lib/loksewa-learning/it-officer-syllabus-data";

const TOTAL_CHAPTERS = IT_OFFICER_SYLLABUS.length;

export function LoksewaITOfficerPage() {
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set([1]));

  function toggle(id: number) {
    setOpenChapters((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/loksewa" labelKey="learn.backLoksewa" />
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl"
        />
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Loksewa · Master IT Officer
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Master IT Officer Syllabus
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Full syllabus broken into chapters — expand a chapter to see its topics.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
              <span className="font-mono text-xl font-bold text-[var(--accent)]">{TOTAL_CHAPTERS}</span>
              <span className="text-sm text-[var(--muted)]">chapters</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          {IT_OFFICER_SYLLABUS.map((chapter) => {
            const isOpen = openChapters.has(chapter.id);
            return (
              <div
                key={chapter.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[var(--elevated)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
                }`}
              >
                <button
                  onClick={() => toggle(chapter.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
                >
                  <span className="text-sm font-medium text-[var(--text)]">{chapter.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs tabular-nums text-[var(--muted)]">
                      {chapter.sections.length} sections
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div className="flex flex-col gap-5 border-t border-[var(--border)] px-5 py-4">
                    {chapter.sections.map((section) => (
                      <div key={section.title}>
                        <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">
                          {section.title}
                        </h4>
                        <ul className="mt-2 flex flex-col gap-1.5">
                          {section.points.map((point) => (
                            <li key={point.title}>
                              <div className="flex items-baseline gap-2">
                                <span className="text-[var(--faint)]">•</span>
                                <span className="text-sm text-[var(--text)]">{point.title}</span>
                              </div>
                              {point.subPoints && (
                                <ul className="mt-1 flex flex-col gap-1 pl-5">
                                  {point.subPoints.map((sub) => (
                                    <li key={sub} className="flex items-baseline gap-2">
                                      <span className="text-xs text-[var(--faint)]">↳</span>
                                      <span className="text-sm text-[var(--muted)]">{sub}</span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
