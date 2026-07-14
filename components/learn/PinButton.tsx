"use client";

import { usePinnedTracks } from "@/hooks/use-pinned-tracks";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function PinButton({ id, className = "" }: { id: string; className?: string }) {
  const { isPinned, togglePin } = usePinnedTracks();
  const { t } = useLocale();
  const pinned = isPinned(id);

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        togglePin(id);
      }}
      aria-pressed={pinned}
      aria-label={pinned ? t("pin.remove") : t("pin.add")}
      title={pinned ? t("pin.remove") : t("pin.add")}
      suppressHydrationWarning
      className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition ${
        pinned
          ? "border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_16%,transparent)] text-[var(--accent)]"
          : "border-[var(--border)] bg-[var(--surface)] text-[var(--faint)] hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:text-[var(--accent)]"
      } ${className}`}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill={pinned ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d="M12 21c-4.2-3.8-7-7.4-7-11a7 7 0 0 1 14 0c0 3.6-2.8 7.2-7 11Z" />
        <circle cx="12" cy="10" r="2.4" />
      </svg>
    </button>
  );
}
