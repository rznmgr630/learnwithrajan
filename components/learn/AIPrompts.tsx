"use client";

import Image from "next/image";
import { useState } from "react";
import type { PromptItem } from "@/lib/ai-prompts/types";
import { PROMPTS } from "@/lib/ai-prompts/prompts-data";
import { SLASH_CATEGORIES } from "@/lib/ai-prompts/slash-categories-data";
import { PROMPT_VISUALS } from "@/components/learn/ai-prompt-visuals";

const CATEGORIES = Array.from(new Set(PROMPTS.map((p) => p.category)));

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied" : "Copy prompt"}
      className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--elevated)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:text-[var(--accent)]"
    >
      {copied ? (
        <>
          <svg className="h-3.5 w-3.5 text-emerald-500" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 8.5l3.5 3.5 7-7" />
          </svg>
          <span className="text-emerald-500">Copied!</span>
        </>
      ) : (
        <>
          <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
            <path strokeLinecap="round" d="M5.5 10.5H4a1.5 1.5 0 01-1.5-1.5V4A1.5 1.5 0 014 2.5h5A1.5 1.5 0 0110.5 4v1.5" />
          </svg>
          Copy prompt
        </>
      )}
    </button>
  );
}

function PromptDrawer({ item, onClose }: { item: PromptItem | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" aria-label="Close" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] p-5">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-[var(--accent)]">{item.category}</span>
            <h2 className="truncate text-lg font-semibold leading-snug text-[var(--text)]">{item.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
          {item.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.image} alt={item.imageAlt ?? item.title} className="h-auto w-full rounded-xl border border-[var(--border)]" />
          ) : PROMPT_VISUALS[item.title] ? (
            <div className={`flex h-48 items-center justify-center rounded-xl bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient}`}>
              {PROMPT_VISUALS[item.title].icon}
            </div>
          ) : null}
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">Prompt</span>
              <CopyButton text={item.prompt} />
            </div>
            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_70%,transparent)] px-4 py-3">
              <p className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-[var(--text)]">{item.prompt}</p>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}

function PromptCard({ item, onClick }: { item: PromptItem; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] text-left shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
    >
      {item.image ? (
        <div className="overflow-hidden">
          <Image
            src={item.image}
            alt={item.imageAlt ?? item.title}
            width={400}
            height={280}
            className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      ) : PROMPT_VISUALS[item.title] ? (
        <div className={`flex h-44 items-center justify-center bg-gradient-to-br ${PROMPT_VISUALS[item.title].gradient} transition duration-300 group-hover:brightness-110`}>
          {PROMPT_VISUALS[item.title].icon}
        </div>
      ) : null}
      <div className="flex flex-1 items-center px-4 py-4">
        <span className="text-sm font-semibold tracking-wide text-[var(--text)] group-hover:text-[var(--accent)]">
          {item.title}
        </span>
      </div>
    </button>
  );
}

export function AIPrompts() {
  const [active, setActive] = useState<PromptItem | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  return (
    <>
      <div className="flex flex-col gap-4">
        {CATEGORIES.map((category) => {
          const items = PROMPTS.filter((p) => p.category === category);
          const isOpen = openCategory === category;
          return (
            <details
              key={category}
              className="group overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm open:[&_.cat-chevron]:rotate-180"
              open={isOpen}
              onToggle={(e) => {
                if (e.currentTarget.open) setOpenCategory(category);
                else setOpenCategory((prev) => (prev === category ? null : prev));
              }}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{category}</h2>
                  <span className="rounded-full bg-[var(--elevated)] px-2 py-0.5 text-xs text-[var(--muted)]">
                    {items.length}
                  </span>
                </div>
                <svg
                  className="cat-chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                </svg>
              </summary>
              <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((item) => (
                    <PromptCard key={item.id} item={item} onClick={() => setActive(item)} />
                  ))}
                </div>
              </div>
            </details>
          );
        })}

        {/* Slash command cheat sheets */}
        <div className="mt-2 flex flex-col gap-4">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">
            AI Slash Commands
            <span className="ml-2 text-xs font-normal text-[var(--muted)]">— paste into any AI chat</span>
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SLASH_CATEGORIES.map((cat) => (
              <div
                key={cat.title}
                className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] overflow-hidden"
              >
                <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                  <span className="ml-2 text-xs font-semibold text-[var(--text)]">{cat.title}</span>
                </div>
                <ul className="px-4 py-3 flex flex-col gap-1.5">
                  {cat.commands.map((c) => (
                    <li key={c.cmd} className="flex items-baseline gap-2 text-sm">
                      <span className="font-mono text-[var(--accent)] shrink-0">{c.cmd}</span>
                      <span className="text-[var(--muted)] text-xs">— {c.desc}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <PromptDrawer item={active} onClose={() => setActive(null)} />
    </>
  );
}
