"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { signOut } from "firebase/auth";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useTheme } from "@/components/ThemeProvider";

const links = [
  { href: "/learn", key: "nav.learningHub" as const, icon: "M2 10l10-5 10 5-10 5-10-5Zm4 2v5c0 2.5 12 2.5 12 0v-5" },
  { href: "/blog", key: "nav.blog" as const, icon: "M4 4h16v16H4zM7 8h10M7 12h10M7 16h6" },
  { href: "/learn/compiler", key: "nav.compiler" as const, icon: "M8 9l3 3-3 3M13 15h3M3 4h18v16H3z" },
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
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const shouldShowAuthActions = !isLoading && !user;

  async function handleLogout() {
    await signOut(auth);
    setIsOpen(false);
  }
  const menuRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const { t } = useLocale();
  const pathname = usePathname();
  const mobileLinkClass = (href: string) => {
    const isActive = href === "/learn" ? pathname.startsWith(href) && !pathname.startsWith("/learn/compiler") : pathname === href || pathname.startsWith(`${href}/`);
    return `flex items-center gap-3 rounded-lg px-3 py-3 ${isActive ? "bg-[var(--elevated)] font-medium text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"}`;
  };

  useEffect(() => {
    setIsMounted(true);
    function closeMenu(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node) && !drawerRef.current?.contains(event.target as Node)) {
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

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  return (
    <div ref={menuRef} className="relative shrink-0">
      <button type="button" onClick={() => setIsOpen((value) => !value)} className="grid h-8 w-8 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)] max-lg:[&>svg:last-child]:hidden" aria-label="Menu" aria-expanded={isOpen} aria-haspopup="menu">
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current lg:hidden" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        <svg aria-hidden="true" viewBox="0 0 24 24" className="hidden h-4 w-4 fill-none stroke-current sm:block" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.1 2.1-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-3v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-2.1-2.1.1-.1A1.7 1.7 0 0 0 7 15a1.7 1.7 0 0 0-1.5-1H5.3v-3h.2A1.7 1.7 0 0 0 7 10a1.7 1.7 0 0 0-.3-1.9l-.1-.1 2.1-2.1.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2h3v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 2.1 2.1-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2v3h-.2a1.7 1.7 0 0 0-1.4 1Z" /></svg>
      </button>
      {isOpen && (
        <>
          <div role="menu" className="hidden lg:absolute lg:right-0 lg:top-10 lg:z-30 lg:block lg:w-48 lg:rounded-xl lg:border lg:border-[var(--border)] lg:bg-[var(--surface)] lg:p-2 lg:shadow-xl">
          {user && (
            <div className="flex items-center gap-2 border-b border-[var(--border)] px-2 py-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--elevated)] text-[var(--accent)]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg></span>
              <div className="min-w-0"><p title={user.displayName || "Learner"} className="truncate text-sm font-semibold text-[var(--text)]">{user.displayName || "Learner"}</p><p title={user.email ?? undefined} className="truncate text-xs text-[var(--muted)]">{user.email}</p></div>
            </div>
          )}
          <div className="flex items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-sm text-[var(--muted)]">
            <span>Theme</span>
            <ThemeToggle />
          </div>
          <div className="mt-1 flex items-center justify-between gap-3 border-t border-[var(--border)] px-2 pt-2">
            <span className="text-sm text-[var(--muted)]">Language</span>
            <LanguageSwitcher compact />
          </div>
          {user && <button type="button" onClick={handleLogout} className="mt-2 inline-flex w-full cursor-pointer items-center gap-2 rounded-lg border-t border-[var(--border)] px-2 pt-3 text-left text-sm font-medium text-red-500 transition hover:text-red-600"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 3v18H9" /></svg>Log out</button>}
          </div>
          {isMounted && createPortal(
            <div className="fixed inset-0 z-50 lg:hidden">
              <button type="button" aria-label="Close menu" onClick={() => setIsOpen(false)} className="absolute inset-0 bg-black/40" />
              <aside ref={drawerRef} className="absolute inset-y-0 right-0 flex w-80 max-w-[86vw] flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface)] p-5 shadow-2xl">
                <div className="mb-6 flex items-center justify-between"><span className="text-lg font-semibold text-[var(--text)]">Menu</span><button type="button" onClick={() => setIsOpen(false)} aria-label="Close menu" className="grid h-9 w-9 place-items-center rounded-lg text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round"><path d="m6 6 12 12M18 6 6 18" /></svg></button></div>
                <nav className={`space-y-1 border-b border-[var(--border)] pb-4 ${shouldShowAuthActions ? "" : "[&>a[href='/login']]:hidden [&>a[href='/register']]:hidden"}`}>
                  <Link href="/focus" onClick={() => setIsOpen(false)} className={mobileLinkClass("/focus")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></svg>Focus</Link>
                  <Link href="/learn" onClick={() => setIsOpen(false)} className={mobileLinkClass("/learn")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10l10-5 10 5-10 5-10-5Zm4 2v5c0 2.5 12 2.5 12 0v-5" /></svg>{t("nav.learningHub")}</Link>
                  <Link href="/blog" onClick={() => setIsOpen(false)} className={mobileLinkClass("/blog")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4zM7 8h10M7 12h10M7 16h6" /></svg>{t("nav.blog")}</Link>
                  <Link href="/library" onClick={() => setIsOpen(false)} className={mobileLinkClass("/library")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 3h14v18H5zM8 3v18" /></svg>{t("nav.library")}</Link>
                  <Link href="/learn/compiler" onClick={() => setIsOpen(false)} className={mobileLinkClass("/learn/compiler")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 9 3 3-3 3M13 15h3" /><rect x="3" y="4" width="18" height="16" rx="2" /></svg>Code Compiler</Link>
                  <Link href="/login" onClick={() => setIsOpen(false)} className={mobileLinkClass("/login")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 3v18H9" /></svg>Login</Link>
                  <Link href="/register" onClick={() => setIsOpen(false)} className={mobileLinkClass("/register")}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M19 8v6M16 11h6" /></svg>Register</Link>
                </nav>
                <div className="mt-auto space-y-3 border-t border-[var(--border)] pt-4"><div className="flex items-center justify-between px-3 py-2 text-sm text-[var(--muted)]"><span>Theme</span><ThemeToggle /></div><div className="flex items-center justify-between px-3 py-2 text-sm text-[var(--muted)]"><span>Language</span><LanguageSwitcher compact /></div></div>
              </aside>
            </div>,
            document.body,
          )}
        </>
      )}
    </div>
  );
}

export function SiteHeader() {
  const { t } = useLocale();
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const shouldShowAuthActions = !isLoading && !user;

  return (
    <header className="sticky top-0 z-20 w-full min-w-0 overflow-visible border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl min-w-0 items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6">
        <Link
          href="/"
          className="flex h-8 shrink-0 items-center rounded-lg border border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] bg-[var(--surface)] px-2 text-[var(--accent)] transition hover:border-[var(--accent)] hover:bg-[color-mix(in_oklab,var(--accent)_12%,var(--surface))] sm:block sm:h-auto sm:w-auto sm:border-0 sm:bg-transparent sm:px-0 sm:text-base sm:font-semibold sm:tracking-tight sm:text-[var(--text)] sm:hover:border-0 sm:hover:bg-transparent sm:hover:text-[var(--accent)]"
        >
          <span className="whitespace-nowrap text-sm font-semibold sm:text-base">{t("site.title")}</span>
        </Link>
        <div className="flex min-w-0 items-center gap-1 sm:gap-3">
          <nav className="hidden min-w-0 items-center gap-0 text-sm lg:flex lg:gap-1">
            <Link href="/focus" aria-current={pathname === "/focus" ? "page" : undefined} className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-2 transition sm:px-3 ${pathname === "/focus" ? "bg-[var(--elevated)] font-medium text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"}`}><svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3m0 14v3M2 12h3m14 0h3M4.9 4.9 7 7m10 10 2.1 2.1M19.1 4.9 17 7M7 17l-2.1 2.1" /></svg>Focus</Link>
            {links.map((item) => {
              const isActive = item.href === "/learn" ? pathname.startsWith(item.href) && !pathname.startsWith("/learn/compiler") : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`inline-flex items-center gap-1 whitespace-nowrap rounded-lg px-1.5 py-2 transition sm:px-3 ${isActive ? "bg-[var(--elevated)] font-medium text-[var(--text)]" : "text-[var(--muted)] hover:bg-[var(--elevated)] hover:text-[var(--text)]"}`}
                >
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={item.icon} /></svg>
                  {t(item.key)}
                </Link>
              );
            })}
          </nav>
          <div className={`hidden items-center gap-2 lg:flex ${shouldShowAuthActions ? "" : "!hidden"}`}>
            <Link href="/login" className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17l5-5-5-5M15 12H3" /><path d="M21 3v18H9" /></svg>Login</Link>
            <Link href="/register" className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-[var(--accent-fg)] transition hover:brightness-110"><svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="4" /><path d="M3 21v-2a6 6 0 0 1 12 0v2M19 8v6M16 11h6" /></svg>Register</Link>
          </div>
          <SettingsMenu />
        </div>
      </div>
    </header>
  );
}
