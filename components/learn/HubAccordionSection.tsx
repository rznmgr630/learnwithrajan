"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { UiStringKey } from "@/lib/i18n/catalog";

const gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

/**
 * Collapsible heading with a card grid under it, shared by the learning hubs.
 * Open state persists per section so returning from a track reopens the group
 * the reader came from, and scrolls it back into view.
 */
export function HubAccordionSection({
  sectionId,
  titleKey,
  hintKey,
  defaultOpen = false,
  children,
}: {
  sectionId: string;
  titleKey: UiStringKey;
  hintKey: UiStringKey;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { t } = useLocale();
  const ref = useRef<HTMLDetailsElement>(null);
  // Use titleKey as the storage key — it's a stable string unlike the useId()-based sectionId
  const storageKey = `acc:${titleKey}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let shouldScroll = false;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        el.open = saved === "1";
        // Scroll into view only if this is the section the user last navigated from
        shouldScroll = saved === "1" && sessionStorage.getItem("acc:last") === storageKey;
      }
    } catch {}
    if (shouldScroll) {
      const timer = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(timer);
    }
    function onToggle() {
      try {
        sessionStorage.setItem(storageKey, el!.open ? "1" : "0");
        if (el!.open) sessionStorage.setItem("acc:last", storageKey);
      } catch {}
    }
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [storageKey]);

  return (
    <details
      ref={ref}
      id={sectionId}
      className="open:[&_.hub-chevron]:rotate-180 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{t(titleKey)}</h2>
          <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">{t(hintKey)}</p>
        </div>
        <svg
          className="hub-chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
        <div className={gridClass}>{children}</div>
      </div>
    </details>
  );
}
