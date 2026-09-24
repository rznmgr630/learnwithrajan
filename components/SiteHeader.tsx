"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/learn", key: "nav.learningHub" as const },
  { href: "/library", key: "nav.library" as const },
];

function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
    >
      {isDark ? (
        /* Sun icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      ) : (
        /* Moon icon */
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
        </svg>
      )}
    </button>
  );
}

function SettingsMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]" aria-label="Settings" aria-expanded={isOpen} aria-haspopup="menu">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.4 1Z" /></svg>
      </button>
      {isOpen && (
        <div role="menu" className="absolute right-0 top-10 z-30 w-48 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-2 shadow-xl">
          <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)]">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-[var(--border)] px-2 pt-2">
            <span className="text-sm text-[var(--muted)]">Language</span>
            <LanguageSwitcher compact />
          </div>
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-20 w-full min-w-0 overflow-x-clip border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-[var(--elevated)] text-xs font-bold tracking-tight text-[var(--text)] transition hover:text-[var(--accent)] sm:block sm:h-auto sm:w-auto sm:bg-transparent sm:text-base sm:font-semibold"
        >
          <span className="sm:hidden">LR</span>
          <span className="hidden whitespace-nowrap sm:inline">{t("site.title")}</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <nav className="flex min-w-0 items-center gap-0 text-sm sm:gap-1">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${item.href === "/library" ? "hidden min-[360px]:inline-flex" : "inline-flex"} whitespace-nowrap rounded-lg px-1.5 py-2 text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)] sm:px-3`}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
