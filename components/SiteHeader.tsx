"use client";

import Link from "next/link";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { useLocale } from "@/components/i18n/LocaleProvider";

const links = [{ href: "/learn", key: "nav.learningHub" as const }];

export function SiteHeader() {
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="font-semibold tracking-tight text-[var(--text)] transition hover:text-[var(--accent)]"
        >
          {t("site.title")}
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <nav className="flex items-center gap-1 text-sm">
            {links.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <LanguageSwitcher className="shrink-0" />
        </div>
      </div>
    </header>
  );
}
