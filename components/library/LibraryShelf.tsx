"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LibraryShelf() {
  const { t } = useLocale();
  const financeCarouselRef = useRef<HTMLDivElement>(null);

  function scrollFinance(direction: "left" | "right") {
    financeCarouselRef.current?.scrollBy({
      left: direction === "left" ? -financeCarouselRef.current.clientWidth : financeCarouselRef.current.clientWidth,
      behavior: "smooth",
    });
  }

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
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => scrollFinance("left")} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]" aria-label="Previous finance book">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => scrollFinance("right")} className="grid h-9 w-9 place-items-center rounded-full border border-[var(--border)] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]" aria-label="Next finance book">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div ref={financeCarouselRef} className="mt-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Link href="/library/finance/finance-book" className="group grid min-w-full snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
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
          <Link href="/library/finance/the-psychology-of-money" className="group grid min-w-full snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#ddd8cd] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#fff6_0,transparent_42%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#f4f0e8] p-5 text-[#242424] shadow-[12px_12px_0_#9a928555] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#857c6e]">Morgan Housel</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The<br />Psychology<br />of Money</h3>
                <span className="h-1 w-12 bg-[#caa552]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.psychologyOfMoney.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.psychologyOfMoney.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/the-richest-man-in-babylon" className="group grid min-w-full snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#5e4030] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#d7a94d66_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between border border-[#dbb457] bg-[#211a19] p-5 text-[#f4d783] shadow-[12px_12px_0_#17111080] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">George S. Clason</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The Richest<br />Man in<br />Babylon</h3>
                <span className="h-1 w-12 bg-[#d7a94d]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.richestMan.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.richestMan.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="personal-development-heading">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-rose-500">{t("library.collection")}</p>
            <h2 id="personal-development-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{t("library.personalDevelopment")}</h2>
          </div>
          <span className="hidden text-sm text-[var(--faint)] sm:block">02</span>
        </div>
        <div className="mt-5">
          <Link href="/library/personal-development/power-of-your-subconscious-mind" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-rose-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative min-h-72 overflow-hidden bg-[color-mix(in_oklab,#ef4444_10%,var(--elevated))] p-8 sm:min-h-full">
              <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(135deg,transparent_40%,color-mix(in_oklab,#ef4444_20%,transparent))]" />
              <Image src="/images/library/power-of-your-subconscious-mind.png" alt="The Power of Your Subconscious Mind cover" width={627} height={1000} className="relative mx-auto h-60 w-auto rounded-md object-cover shadow-[12px_12px_0_color-mix(in_oklab,#ef4444_22%,transparent)] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]" />
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-rose-500"><span className="h-1.5 w-1.5 rounded-full bg-rose-500" />{t("library.personalDevelopment")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-rose-500">{t("library.subconsciousMind.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.subconsciousMind.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-rose-500 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}
