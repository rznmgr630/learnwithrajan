"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { CURRENT_DAY, getAllRoadmapDays, TOTAL_DAYS } from "@/lib/challenge-data";

const allDays = getAllRoadmapDays();

export function HeroSection() {
  const { t } = useLocale();
  const pct = Math.round((Math.min(CURRENT_DAY, TOTAL_DAYS) / TOTAL_DAYS) * 100);

  return (
    <section className="relative flex flex-1 overflow-hidden border-b border-[var(--border)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--glow)] blur-3xl"
      />
      <div className="relative mx-auto flex max-w-5xl flex-1 flex-col px-4 py-16 sm:px-6 sm:py-24">
        <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          {t("hero.badge")}
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl sm:leading-tight">
          {t("hero.title")}
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-[var(--muted)]">
          {t("hero.body")}{" "}
          <span className="font-medium text-[var(--text)]">{t("hero.bodyMid")}</span> {t("hero.bodyEnd")}
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--faint)]">{t("hero.challengeDay")}</p>
            <p className="mt-1 font-mono text-3xl font-semibold text-[var(--text)]">
              {CURRENT_DAY}
              <span className="text-lg font-normal text-[var(--muted)]">/{TOTAL_DAYS}</span>
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--faint)]">{t("hero.progressSeed")}</p>
            <p className="mt-1 text-3xl font-semibold text-[var(--text)]">{pct}%</p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 sm:col-span-1">
            <p className="text-xs font-medium uppercase tracking-wide text-[var(--faint)]">{t("hero.todayTheme")}</p>
            <p className="mt-2 text-sm font-medium leading-snug text-[var(--text)]">
              {allDays.find((d) => d.day === CURRENT_DAY)?.title ?? "—"}
            </p>
          </div>
        </div>
        <div className="mt-auto pt-10">
          <Link
            href="/learn"
            className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-fg)] shadow-lg shadow-[color-mix(in_oklab,var(--accent)_35%,transparent)] transition hover:brightness-110"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
