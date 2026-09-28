"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LibraryShelf() {
  const { t } = useLocale();
  const financeCarouselRef = useRef<HTMLDivElement>(null);
  const financeTouchStartRef = useRef<{ x: number; y: number } | undefined>(undefined);
  const [financePage, setFinancePage] = useState(0);
  const [pinnedBook, setPinnedBook] = useState<string>();
  const financeBookCount = 10;

  useEffect(() => {
    setPinnedBook(window.localStorage.getItem("library:pinned-book") ?? undefined);
  }, []);

  useEffect(() => {
    financeCarouselRef.current?.scrollTo({ left: 0 });
    setFinancePage(0);
  }, [pinnedBook]);

  function getBookOrder(pdfUrl: string) {
    return pinnedBook === pdfUrl ? -1 : 0;
  }

  function getFinanceSlideWidth() {
    const carousel = financeCarouselRef.current;
    const firstSlide = carousel?.children[0] as HTMLElement | undefined;
    const secondSlide = carousel?.children[1] as HTMLElement | undefined;

    return secondSlide && firstSlide ? Math.abs(secondSlide.offsetLeft - firstSlide.offsetLeft) : carousel?.clientWidth ?? 0;
  }

  function scrollFinance(direction: "left" | "right") {
    const nextPage = Math.max(0, Math.min(financeBookCount - 1, financePage + (direction === "left" ? -1 : 1)));
    const carousel = financeCarouselRef.current;
    carousel?.scrollTo({
      left: nextPage * getFinanceSlideWidth(),
      behavior: "smooth",
    });
    setFinancePage(nextPage);
  }

  function updateFinancePage() {
    const carousel = financeCarouselRef.current;
    const slideWidth = getFinanceSlideWidth();
    if (!carousel || !slideWidth) {
      return;
    }

    setFinancePage(Math.max(0, Math.min(financeBookCount - 1, Math.round(carousel.scrollLeft / slideWidth))));
  }

  function handleFinanceTouchStart(event: React.TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];
    financeTouchStartRef.current = { x: touch.clientX, y: touch.clientY };
  }

  function handleFinanceTouchEnd(event: React.TouchEvent<HTMLDivElement>) {
    const start = financeTouchStartRef.current;
    const touch = event.changedTouches[0];
    financeTouchStartRef.current = undefined;

    if (!start || !touch) {
      return;
    }

    const horizontalDistance = touch.clientX - start.x;
    const verticalDistance = touch.clientY - start.y;
    if (Math.abs(horizontalDistance) < 56 || Math.abs(horizontalDistance) <= Math.abs(verticalDistance)) {
      return;
    }

    scrollFinance(horizontalDistance < 0 ? "right" : "left");
  }

  return (
    <main className="mx-auto w-full min-w-0 max-w-5xl overflow-x-hidden px-4 py-10 sm:px-6 sm:py-14">
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
        <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">{t("library.collection")}</p>
            <h2 id="finance-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">{t("library.finance")}</h2>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button type="button" onClick={() => scrollFinance("left")} disabled={financePage === 0} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--elevated)] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Previous finance book">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => scrollFinance("right")} disabled={financePage === financeBookCount - 1} className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--border)] bg-[var(--elevated)] text-[var(--text)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-35" aria-label="Next finance book">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
            </button>
          </div>
        </div>
        <div ref={financeCarouselRef} onScroll={updateFinancePage} onTouchStart={handleFinanceTouchStart} onTouchEnd={handleFinanceTouchEnd} className="mt-5 flex w-full snap-x snap-mandatory touch-pan-y gap-4 overflow-hidden scroll-smooth pb-2">
          <Link href="/library/finance/finance-book" style={{ order: getBookOrder("/api/library/finance-book") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
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
          <Link href="/library/finance/the-psychology-of-money" style={{ order: getBookOrder("/api/library/psychology-of-money") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
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
          <Link href="/library/finance/the-richest-man-in-babylon" style={{ order: getBookOrder("/api/library/richest-man-in-babylon") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
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
          <Link href="/library/finance/the-simple-path-to-wealth" style={{ order: getBookOrder("/api/library/the-simple-path-to-wealth") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#d8e6dc] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffff99_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#f8f5e9] p-5 text-[#194c3e] shadow-[12px_12px_0_#4b7d6a55] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#4b7d6a]">J. L. Collins</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The Simple<br />Path to<br />Wealth</h3>
                <span className="h-1 w-12 bg-[#d5a547]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.simplePath.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.simplePath.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/the-millionaire-next-door" style={{ order: getBookOrder("/api/library/the-millionaire-next-door") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#e4e5e8] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffffcc_0,transparent_46%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#274c75] p-5 text-white shadow-[12px_12px_0_#18314f66] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#b9d5ef]">Stanley & Danko</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The<br />Millionaire<br />Next Door</h3>
                <span className="h-1 w-12 bg-[#d5a547]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.millionaireNextDoor.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.millionaireNextDoor.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/i-will-teach-you-to-be-rich" style={{ order: getBookOrder("/api/library/i-will-teach-you-to-be-rich") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#ecd8d4] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#d83a30] p-5 text-white shadow-[12px_12px_0_#9c211d55] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#ffe1a7]">Ramit Sethi</p>
                <h3 className="font-serif text-3xl leading-[0.95]">I Will Teach<br />You to<br />Be Rich</h3>
                <span className="h-1 w-12 bg-[#ffe1a7]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.iWillTeachYou.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.iWillTeachYou.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/your-money-or-your-life" style={{ order: getBookOrder("/api/library/your-money-or-your-life") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#e0e8f1] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffffcc_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#24486d] p-5 text-white shadow-[12px_12px_0_#16324e66] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#d7edf8]">Robin & Dominguez</p>
                <h3 className="font-serif text-3xl leading-[0.95]">Your Money<br />or Your<br />Life</h3>
                <span className="h-1 w-12 bg-[#f3c969]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.yourMoneyYourLife.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.yourMoneyYourLife.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/the-intelligent-investor" style={{ order: getBookOrder("/api/library/the-intelligent-investor") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#ded9c9] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#38573b] p-5 text-[#f4edd0] shadow-[12px_12px_0_#263d2a66] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#cce0a5]">Benjamin Graham</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The<br />Intelligent<br />Investor</h3>
                <span className="h-1 w-12 bg-[#d6b64c]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.intelligentInvestor.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.intelligentInvestor.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/a-random-walk-down-wall-street" style={{ order: getBookOrder("/api/library/a-random-walk-down-wall-street") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#e8ddd0] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#ba4534] p-5 text-[#fff8e9] shadow-[12px_12px_0_#84302566] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe3a7]">Burton G. Malkiel</p>
                <h3 className="font-serif text-3xl leading-[0.95]">A Random<br />Walk Down<br />Wall Street</h3>
                <span className="h-1 w-12 bg-[#ffe3a7]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.randomWalk.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.randomWalk.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-[var(--accent-fg)] transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/finance/the-total-money-makeover" style={{ order: getBookOrder("/api/library/the-total-money-makeover") }} className="group grid w-full shrink-0 snap-start overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-[color-mix(in_oklab,var(--accent)_45%,var(--border))] hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#dce6ee] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#164e86] p-5 text-white shadow-[12px_12px_0_#0e315466] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#b9dcf8]">Dave Ramsey</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The Total<br />Money<br />Makeover</h3>
                <span className="h-1 w-12 bg-[#f6bf3f]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-[var(--accent)]"><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />{t("library.finance")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">{t("library.totalMoneyMakeover.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.totalMoneyMakeover.subtitle")}</p>
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
        <div className="mt-5 space-y-4">
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
          <Link href="/library/personal-development/eat-that-frog" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#dcefd1] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#5f9d39] p-5 text-[#fff8cf] shadow-[12px_12px_0_#3d702666] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e8f7ad]">Brian Tracy</p>
                <h3 className="font-serif text-3xl leading-[0.95]">Eat<br />That<br />Frog!</h3>
                <span className="h-1 w-12 bg-[#f6cf46]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-emerald-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />{t("library.personalDevelopment")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-emerald-600">{t("library.eatThatFrog.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.eatThatFrog.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/personal-development/atomic-habits" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-amber-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#eee7d4] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#ffffffcc_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#f5f2e8] p-5 text-[#252525] shadow-[12px_12px_0_#b79a5555] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8e7440]">James Clear</p>
                <h3 className="font-serif text-3xl leading-[0.95]">Atomic<br />Habits</h3>
                <span className="h-1 w-12 bg-[#d2ae4c]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-amber-600"><span className="h-1.5 w-1.5 rounded-full bg-amber-500" />{t("library.personalDevelopment")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-amber-600">{t("library.atomicHabits.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.atomicHabits.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/personal-development/the-7-habits" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-sky-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#dbe9ef] p-8 sm:min-h-full">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#ffffffbb_0,transparent_48%)]" />
              <div className="relative flex h-60 w-40 flex-col justify-between bg-[#1e6a8b] p-5 text-white shadow-[12px_12px_0_#174e6655] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#cdeaf5]">Stephen R. Covey</p>
                <h3 className="font-serif text-3xl leading-[0.95]">The 7<br />Habits</h3>
                <span className="h-1 w-12 bg-[#f4c85a]" />
              </div>
            </div>
            <div className="flex flex-col p-7 sm:p-9">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-sky-600"><span className="h-1.5 w-1.5 rounded-full bg-sky-500" />{t("library.personalDevelopment")}</div>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-sky-600">{t("library.sevenHabits.title")}</h3>
              <p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.sevenHabits.subtitle")}</p>
              <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-sky-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span>
            </div>
          </Link>
          <Link href="/library/personal-development/how-to-win-friends" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-indigo-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#e8e1d7] p-8 sm:min-h-full"><div className="relative flex h-60 w-40 flex-col justify-between bg-[#1f3559] p-5 text-[#f7e9bd] shadow-[12px_12px_0_#18294555] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]"><p className="text-xs font-semibold uppercase tracking-[0.16em]">Dale Carnegie</p><h3 className="font-serif text-3xl leading-[0.95]">How to<br />Win Friends</h3><span className="h-1 w-12 bg-[#d6ae54]" /></div></div>
            <div className="flex flex-col p-7 sm:p-9"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-indigo-600"><span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />{t("library.personalDevelopment")}</div><h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-indigo-600">{t("library.howToWinFriends.title")}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.howToWinFriends.subtitle")}</p><span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span></div>
          </Link>
          <Link href="/library/personal-development/mindset" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-violet-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#e6ddf1] p-8 sm:min-h-full"><div className="relative flex h-60 w-40 flex-col justify-between bg-[#4c317b] p-5 text-[#fbecff] shadow-[12px_12px_0_#39235f55] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[2deg]"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#e8d2ff]">Carol S. Dweck</p><h3 className="font-serif text-3xl leading-[0.95]">Mindset</h3><span className="h-1 w-12 bg-[#f0c45b]" /></div></div>
            <div className="flex flex-col p-7 sm:p-9"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-violet-600"><span className="h-1.5 w-1.5 rounded-full bg-violet-500" />{t("library.personalDevelopment")}</div><h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-violet-600">{t("library.mindset.title")}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.mindset.subtitle")}</p><span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span></div>
          </Link>
          <Link href="/library/personal-development/the-mountain-is-you" className="group grid overflow-hidden rounded-3xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] shadow-sm transition hover:-translate-y-1 hover:border-orange-400/50 hover:shadow-xl sm:grid-cols-[220px_1fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden bg-[#eadccf] p-8 sm:min-h-full"><div className="relative flex h-60 w-40 flex-col justify-between bg-[#ad4b2a] p-5 text-[#fff5dc] shadow-[12px_12px_0_#76301f55] transition duration-300 group-hover:-translate-y-1 group-hover:rotate-[-2deg]"><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#ffe0a0]">Brianna Wiest</p><h3 className="font-serif text-3xl leading-[0.95]">The<br />Mountain<br />Is You</h3><span className="h-1 w-12 bg-[#f1c45f]" /></div></div>
            <div className="flex flex-col p-7 sm:p-9"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-orange-600"><span className="h-1.5 w-1.5 rounded-full bg-orange-500" />{t("library.personalDevelopment")}</div><h3 className="mt-4 text-2xl font-semibold tracking-tight text-[var(--text)] group-hover:text-orange-600">{t("library.mountainIsYou.title")}</h3><p className="mt-3 max-w-md text-sm leading-6 text-[var(--muted)]">{t("library.mountainIsYou.subtitle")}</p><span className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-medium text-white transition group-hover:brightness-110">{t("library.continueReading")}<span aria-hidden="true">→</span></span></div>
          </Link>
        </div>
      </section>
    </main>
  );
}
