"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { JapaneseDetailBlockRenderer } from "@/components/learn/JapaneseDetailBlockRenderer";
import { RichText } from "@/components/learn/RichText";
import type { UiStringKey } from "@/lib/i18n/catalog";
import {
  getJapaneseN4DayContext,
  resolveJapaneseN4Detail,
} from "@/lib/japanese-learning/n4/japanese-n4-data";
import type { LocalizedString } from "@/lib/japanese-learning/types";
import { pickLocalized } from "@/lib/i18n/pick";

type Props = {
  dayNumber: number | null;
  onClose: () => void;
  isDone: (day: number) => boolean;
  onToggleDone: (day: number) => void;
};

function normalizeOverview(overview: LocalizedString | LocalizedString[]): LocalizedString[] {
  return Array.isArray(overview) ? overview : [overview];
}

function n4TagLabel(slug: string, translate: (key: UiStringKey) => string): string {
  const map: Record<string, UiStringKey> = {
    "jlpt-n4": "jpDetail.tag.jlptN4",
    "minna-ii": "jpDetail.tag.minnaII",
    sprint: "jpDetail.tag.sprint",
    listening: "jpDetail.tag.listening",
    grammar: "jpDetail.tag.grammar",
    particles: "jpDetail.tag.particles",
    kanji: "jpDetail.tag.kanji",
  };
  const key = map[slug];
  return key ? translate(key) : slug;
}

function Accordion({
  number,
  title,
  defaultOpen = false,
  children,
}: {
  number: number;
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)]">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]"
      >
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[10px] font-bold text-[var(--accent-fg)]">
          {number}
        </span>
        <span className="flex-1 text-sm font-semibold text-[var(--text)]">{title}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-[var(--muted)] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden
        >
          <path d="M8 10.94 2.53 5.47l.94-.94L8 9.06l4.53-4.53.94.94z" />
        </svg>
      </button>
      {open && (
        <div className="border-t border-[var(--border)] px-4 py-4">{children}</div>
      )}
    </div>
  );
}

export function JapaneseN4DayDetailPanel({ dayNumber, onClose, isDone, onToggleDone }: Props) {
  const { locale, t } = useLocale();
  const open = dayNumber !== null;
  const ctx = dayNumber !== null ? getJapaneseN4DayContext(dayNumber) : null;
  const detail = ctx ? resolveJapaneseN4Detail(ctx.day) : null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !ctx || !detail || dayNumber === null) return null;

  const done = isDone(dayNumber);
  const intro = normalizeOverview(detail.overview);
  const sections = detail.sections ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label={t("weeklyPanel.close")}
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div>
            <p className="text-xs font-medium text-[var(--accent)]">
              <RichText text={pickLocalized(ctx.weekTitle, locale)} />
            </p>
            <p className="mt-0.5 text-[11px] font-medium uppercase tracking-wide text-[var(--muted)]">
              {t("japaneseN4Day.trackLabel")}
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-[var(--text)]">
              {t("jpN4Roadmap.dayPrefix")} {ctx.day.day}: <RichText text={ctx.day.title} />
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label={t("weeklyPanel.close")}
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto p-5">
          <div className="flex flex-col gap-3">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {ctx.day.tags.map((tag) => (
              <span
                key={`${ctx.day.day}-${tag.slug}`}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_85%,transparent)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
              >
                {n4TagLabel(tag.slug, t)}
              </span>
            ))}
          </div>

          {/* Overview */}
          <div className="space-y-1.5 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)] px-4 py-3.5">
            {intro.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed text-[var(--muted)]">
                <RichText text={pickLocalized(p, locale)} />
              </p>
            ))}
          </div>

          {/* Sections as accordions */}
          {sections.map((sec, si) => (
            <Accordion
              key={`jn4-sec-${si}`}
              number={si + 1}
              title={pickLocalized(sec.title, locale)}
              defaultOpen={si === 0}
            >
              {sec.blocks && sec.blocks.length > 0 ? (
                <JapaneseDetailBlockRenderer blocks={sec.blocks} />
              ) : sec.items && sec.items.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--faint)]">
                  {sec.items.map((line, i) => (
                    <li key={i} className="pl-1">
                      <RichText text={pickLocalized(line, locale)} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </Accordion>
          ))}

          {/* Practice checklist */}
          {detail.bullets && detail.bullets.length > 0 ? (
            <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_42%,transparent)] px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t("jpDetail.practiceChecklist")}</p>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--faint)]">
                {detail.bullets.map((line, i) => (
                  <li key={i} className="pl-1">
                    <RichText text={pickLocalized(line, locale)} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          </div>
        </div>

        <div className="border-t border-[var(--border)] p-5">
          <button
            type="button"
            onClick={() => onToggleDone(dayNumber)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
              done
                ? "bg-[var(--elevated)] text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--elevated)_88%,var(--accent))]"
                : "bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-110",
            ].join(" ")}
          >
            {done ? t("jpDetail.markDayNotDone") : t("jpDetail.markDayDone")}
          </button>
        </div>
      </aside>
    </div>
  );
}
