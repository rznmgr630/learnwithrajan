"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LibraryShelf() {
  const { t } = useLocale();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_76%,transparent)] px-6 py-9 shadow-sm sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[var(--accent)] opacity-15 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-52 w-52 rounded-full bg-violet-500 opacity-10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-3 text-sm font-medium text-[var(--accent)]">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[color-mix(in_oklab,var(--accent)_16%,transparent)]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-5 w-5 fill-none stroke-current" strokeWidth="1.8">
                <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Z" />
                <path d="M4 19a2.5 2.5 0 0 1 2.5-2.5H20" />
              </svg>
            </span>
            {t("library.eyebrow")}
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-tight text-[var(--text)] sm:text-5xl">{t("library.title")}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">{t("library.subtitle")}</p>
          <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_76%,transparent)] px-3 py-2 text-sm text-[var(--muted)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            {t("library.savedBooks")}
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="finance-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">{t("library.collection")}</p>
            <h2 id="finance-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{t("library.finance")}</h2>
          </div>
          <span className="hidden text-sm text-[var(--faint)] sm:block">01</span>
        </div>
        <div className="mt-5">
          <Link href="/library/finance/finance-book" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-72 overflow-hidden bg-[color-mix(in_oklab,var(--accent)_12%,var(--elevated))] p-8 sm:min-h-full">
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(135deg,transparent_40%,color-mix(in_oklab,var(--accent)_20%,transparent))]" />
              <Image src="/images/library/rich-dad-poor-dad.jpg" alt="Rich Dad Poor Dad cover" width={623} height={900} className="relative mx-auto h-60 w-auto rounded-md object-cover shadow-[12px_12px_0_color-mix(in_oklab,var(--accent)_22%,transparent)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]" />
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.financeBook.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.financeBook.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
