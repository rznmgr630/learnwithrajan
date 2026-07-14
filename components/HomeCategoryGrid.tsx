"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { UiStringKey } from "@/lib/i18n/catalog";

function CodeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 6 2 12l6 6M16 6l6 6-6 6" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />
    </svg>
  );
}

function SparkleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <path d="m14.5 9.5-2 5-5 2 2-5 5-2Z" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5v13Z" />
      <path d="M4 19.5V6.5" />
    </svg>
  );
}

interface Category {
  href: string;
  icon: ReactNode;
  titleKey: UiStringKey;
  hintKey: UiStringKey;
}

const CATEGORIES: Category[] = [
  { href: "/learn/programming", icon: <CodeIcon />, titleKey: "hub.sectionProgramming", hintKey: "hub.sectionProgrammingHint" },
  { href: "/learn/language", icon: <GlobeIcon />, titleKey: "hub.sectionLanguage", hintKey: "hub.sectionLanguageHint" },
  { href: "/learn/ai-prompts", icon: <SparkleIcon />, titleKey: "hub.sectionAiPrompts", hintKey: "hub.sectionAiPromptsHint" },
  { href: "/learn/personal-development", icon: <CompassIcon />, titleKey: "hub.sectionPersonalDev", hintKey: "hub.sectionPersonalDevHint" },
  { href: "/learn/loksewa", icon: <BookIcon />, titleKey: "hub.sectionLoksewa", hintKey: "hub.sectionLoksewaHint" },
];

export function HomeCategoryGrid() {
  const { t } = useLocale();

  return (
    <section id="explore" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          {t("home.exploreTitle")}
        </h2>
        <p className="mt-2 max-w-xl text-[var(--muted)]">{t("home.exploreSubtitle")}</p>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--border)] sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => (
            <Link
              key={category.href}
              href={category.href}
              className={`group flex flex-col gap-3 bg-[var(--background)] p-6 transition hover:bg-[var(--elevated)] ${
                index === CATEGORIES.length - 1 ? "lg:col-span-2" : ""
              }`}
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--muted)] transition group-hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] group-hover:text-[var(--accent)]">
                {category.icon}
              </span>
              <span className="text-base font-semibold text-[var(--text)]">{t(category.titleKey)}</span>
              <span className="text-sm text-[var(--muted)]">{t(category.hintKey)}</span>
              <span className="mt-auto pt-2 text-sm font-medium text-[var(--accent)] opacity-0 transition group-hover:opacity-100">
                {t("hub.category.cta")}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
