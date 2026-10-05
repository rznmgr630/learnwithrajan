"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { BrandMark } from "@/components/BrandMark";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/learn", key: "nav.learningHub" as const, icon: "M2 10l10-5 10 5-10 5-10-5Zm4 2v5c0 2.5 12 2.5 12 0v-5" },
  { href: "/library", key: "nav.library" as const, icon: "M5 3h14v18H5zM8 3v18" },
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
          <Link
            href="/learn/compiler"
            role="menuitem"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 9 3 3-3 3M13 15h3" /><rect x="3" y="4" width="18" height="16" rx="2" /></svg>
            Code Compiler
          </Link>
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 w-full min-w-0 overflow-x-clip border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg border border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] bg-[var(--surface)] text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] sm:block sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent sm:text-base sm:font-semibold sm:tracking-tight sm:text-[var(--text)] sm:hover:border-0 sm:hover:bg-transparent sm:hover:text-[var(--accent)]"
        >
          <BrandMark className="h-4 w-4 sm:hidden" />
          <span className="hidden whitespace-nowrap sm:inline">{t("site.title")}</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <nav className="flex min-w-0 items-center gap-0 text-sm sm:gap-1">
            <Link href="/focus" aria-current={pathname === "/focus" ? "page" : undefined} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-2 transition sm:px-3 ${pathname === "/focus" ? "bg-[var(--elevated)] font-medium text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></svg>Focus</Link>
            {links.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`${item.href === "/library" ? "hidden min-[360px]:inline-flex" : "inline-flex"} items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-2 transition sm:px-3 ${isActive ? "bg-[var(--elevated)] font-medium text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"}`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
