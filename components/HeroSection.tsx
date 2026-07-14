"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const TOPICS = [
  "Backend", "Frontend", "System Design", "DevOps",
  "Node.js", "Next.js", "React", "JavaScript", "DSA", "Japanese",
];

export function HeroSection() {
  const { t } = useLocale();

  return (
    <section className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 sm:py-28">
        <p className="inline-flex w-fit items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--faint)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {t("hero.badge")}
        </p>

        <h1 className="mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-6xl sm:leading-[1.1]">
          {t("hero.title")}
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          {t("hero.body")}
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--text)] px-5 py-2.5 text-sm font-semibold text-[var(--background)] transition hover:brightness-110"
          >
            {t("hero.cta")}
          </Link>
          <Link
            href="#pinned"
            className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-5 py-2.5 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--elevated)]"
          >
            {t("hero.ctaSecondary")}
          </Link>
        </div>

        <p className="mt-8 max-w-xl text-sm leading-loose text-[var(--faint)]">
          {TOPICS.join(" · ")}
        </p>
      </div>
    </section>
  );
}
