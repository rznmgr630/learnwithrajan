"use client";

import { useState } from "react";
import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { SAY_REPLY_PAIRS, SPEAK_LIKE_A_PRO, UPGRADE_YOUR_ENGLISH, FULL_FORMS } from "@/lib/english-learning/speak-like-pro-data";
import type { SayReply, SpeakSwap, FullFormEntry } from "@/lib/english-learning/speak-like-pro-data";

type SpeakGroup = {
  title: string;
  items: SpeakSwap[];
};

const speakGroup = (ids: number[]) => ids.flatMap((id) => SPEAK_LIKE_A_PRO.filter((item) => item.id === id));

const SPEAK_LIKE_A_PRO_GROUPS: SpeakGroup[] = [
  {
    title: "Conversation & Social English",
    items: speakGroup([1, 3, 6, 8, 9, 10, 11, 12, 13, 14, 16, 19, 22, 30, 31, 32, 33, 40, 43, 44, 49]),
  },
  {
    title: "Feelings & People",
    items: speakGroup([4, 5, 17, 18, 21, 23, 28, 29, 38, 39, 46]),
  },
  {
    title: "Work & Daily Life",
    items: speakGroup([2, 24, 26, 34, 35, 36, 37, 41, 42, 47, 48]),
  },
  {
    title: "Idioms, Advice & Actions",
    items: speakGroup([7, 15, 20, 25, 27, 45]),
  },
  {
    title: "C1 Slang & Expressions",
    items: speakGroup([50, 51, 52, 53, 54, 55]),
  },
];

function SwapList({ items, fromLabel, toLabel }: { items: SpeakSwap[]; fromLabel: string; toLabel: string }) {
  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {items.map((s, idx) => (
        <div key={s.id} className="px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--muted)]">
                {fromLabel}: <span className="text-[var(--text)] line-through decoration-[var(--faint)]">{s.basic}</span>
              </span>
              <span className="text-[var(--faint)]">→</span>
              <span className="text-sm font-medium text-[var(--accent)]">
                {toLabel}: {s.upgraded}
              </span>
              </div>
            </div>
          </div>
      ))}
    </div>
  );
}

function SayReplyList({ items }: { items: SayReply[] }) {
  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {items.map((item) => (
        <div key={item.id} className="grid gap-1 px-5 py-4 sm:grid-cols-2 sm:gap-5">
          <p className="text-sm text-[var(--text)]"><span className="text-xs text-[var(--muted)]">Say: </span>{item.say}</p>
          <p className="text-sm font-medium text-[var(--accent)]"><span className="text-xs text-[var(--muted)]">Reply: </span>{item.reply}</p>
        </div>
      ))}
    </div>
  );
}

function FullFormList({ items }: { items: FullFormEntry[] }) {
  return (
    <div className="divide-y divide-[var(--border)] border-t border-[var(--border)]">
      {items.map((f, idx) => (
        <div key={f.id} className="px-5 py-4">
          <div className="flex items-baseline gap-3">
            <span className="w-6 shrink-0 font-mono text-xs text-[var(--faint)]">
              {String(idx + 1).padStart(2, "0")}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-[var(--text)]">{f.word}</span>
              <span className="text-[var(--faint)]">→</span>
              <span className="text-sm font-medium text-[var(--accent)]">{f.fullForm}</span>
            </div>
          </div>
        </div>
      ))}
      <p className="px-5 py-4 text-xs text-[var(--muted)]">
        These are popular "backronyms" (fun/motivational expansions), not official etymologies.
      </p>
    </div>
  );
}

type SectionId = "replies" | "conversation" | "feelings" | "work" | "idioms" | "slang" | "upgrade" | "fullforms";

const SECTIONS: { id: SectionId; title: string; count: number; render: () => React.ReactNode }[] = [
  { id: "replies", title: "Say It, Reply Naturally", count: SAY_REPLY_PAIRS.length, render: () => <SayReplyList items={SAY_REPLY_PAIRS} /> },
  { id: "conversation", title: "Conversation & Social English", count: SPEAK_LIKE_A_PRO_GROUPS[0].items.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO_GROUPS[0].items} fromLabel="Don't say" toLabel="Say" /> },
  { id: "feelings", title: "Feelings & People", count: SPEAK_LIKE_A_PRO_GROUPS[1].items.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO_GROUPS[1].items} fromLabel="Don't say" toLabel="Say" /> },
  { id: "work", title: "Work & Daily Life", count: SPEAK_LIKE_A_PRO_GROUPS[2].items.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO_GROUPS[2].items} fromLabel="Don't say" toLabel="Say" /> },
  { id: "idioms", title: "Idioms, Advice & Actions", count: SPEAK_LIKE_A_PRO_GROUPS[3].items.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO_GROUPS[3].items} fromLabel="Don't say" toLabel="Say" /> },
  { id: "slang", title: "C1 Slang & Expressions", count: SPEAK_LIKE_A_PRO_GROUPS[4].items.length, render: () => <SwapList items={SPEAK_LIKE_A_PRO_GROUPS[4].items} fromLabel="Don't say" toLabel="Say" /> },
  {
    id: "upgrade",
    title: "Upgrade Your English (Basic → Advanced)",
    count: UPGRADE_YOUR_ENGLISH.length,
    render: () => <SwapList items={UPGRADE_YOUR_ENGLISH} fromLabel="Basic" toLabel="Advanced" />,
  },
  { id: "fullforms", title: "Full Forms You Should Know", count: FULL_FORMS.length, render: () => <FullFormList items={FULL_FORMS} /> },
];

export function SpeakLikeProPage() {
  const [openSections, setOpenSections] = useState<Set<SectionId>>(new Set(["replies"]));

  function toggle(id: SectionId) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/language" labelKey="learn.backLanguage" />
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
            English fluency · sound natural
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">
            Speak Like A Pro
          </h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">
            Swap plain phrases and basic words for ones that sound natural and advanced.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3">
          {SECTIONS.map((section) => {
            const isOpen = openSections.has(section.id);
            return (
              <div
                key={section.id}
                className={`overflow-hidden rounded-2xl border transition-colors ${
                  isOpen
                    ? "border-[color-mix(in_oklab,var(--accent)_35%,var(--border))] bg-[var(--elevated)]"
                    : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_40%,transparent)]"
                }`}
              >
                <button
                  onClick={() => toggle(section.id)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
                >
                  <span className="text-sm font-medium text-[var(--text)]">{section.title}</span>
                  <div className="flex items-center gap-3">
                    <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-0.5 text-xs tabular-nums text-[var(--muted)]">
                      {section.count} items
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

                {isOpen && section.render()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
