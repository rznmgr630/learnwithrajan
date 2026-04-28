"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pickLocalized } from "@/lib/i18n/pick";
import { DayDetailPanel } from "@/components/learn/DayDetailPanel";
import { ROADMAP_WEEKS, TOTAL_DAYS } from "@/lib/challenge-data";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";

const TAG_STYLES: Record<string, string> = {
  networking: "bg-sky-400/15 text-sky-100 border-sky-400/25",
  theory: "bg-violet-400/15 text-violet-100 border-violet-400/25",
  runtime: "bg-amber-400/15 text-amber-100 border-amber-400/25",
  core: "bg-amber-400/12 text-amber-50 border-amber-400/20",
  database: "bg-emerald-400/12 text-emerald-100 border-emerald-400/25",
  sql: "bg-emerald-400/12 text-emerald-50 border-emerald-400/20",
  design: "bg-violet-400/12 text-violet-50 border-violet-400/20",
  api: "bg-violet-300/10 text-violet-100 border-violet-300/20",
  security: "bg-rose-400/15 text-rose-100 border-rose-400/25",
  auth: "bg-rose-400/12 text-rose-50 border-rose-400/20",
  performance: "bg-amber-400/12 text-amber-100 border-amber-400/20",
  cache: "bg-amber-400/10 text-amber-50 border-amber-400/18",
  reliability: "bg-emerald-400/12 text-emerald-100 border-emerald-400/22",
  ops: "bg-emerald-400/10 text-emerald-50 border-emerald-400/18",
  architecture: "bg-cyan-400/12 text-cyan-100 border-cyan-400/22",
  nosql: "bg-lime-400/10 text-lime-100 border-lime-400/20",
  docker: "bg-sky-400/12 text-sky-50 border-sky-400/20",
  cicd: "bg-indigo-400/15 text-indigo-100 border-indigo-400/25",
  cloud: "bg-blue-400/12 text-blue-100 border-blue-400/22",
  observability: "bg-fuchsia-400/12 text-fuchsia-100 border-fuchsia-400/22",
};

function tagClass(slug: string) {
  return TAG_STYLES[slug] ?? "bg-neutral-500/15 text-neutral-200 border-neutral-500/25";
}

export function BackendRoadmap() {
  const { locale, t } = useLocale();
  const { completedCount, percent, toggleDay, isDone } = useBackend30Progress();
  const [openWeekId, setOpenWeekId] = useState<string | null>("w1");
  const [detailDay, setDetailDay] = useState<number | null>(null);

  const barWidth = useMemo(() => `${Math.min(100, Math.round((completedCount / TOTAL_DAYS) * 100))}%`, [completedCount]);

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-10 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-100 sm:text-3xl">{t("backendRoadmap.title")}</h1>
          <p className="mt-1 text-sm text-neutral-500">{t("backendRoadmap.subtitle")}</p>
        </div>
      </div>

      <div
        className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 shadow-xl sm:p-6"
        suppressHydrationWarning
      >
        <div className="flex items-center justify-between gap-3">
          <span className="text-sm text-neutral-400">{t("backendRoadmap.overallProgress")}</span>
          <div className="flex items-center gap-3">
            <span className="text-sm tabular-nums text-neutral-200">
              {completedCount}/{TOTAL_DAYS} {t("hub.backend.days")}
            </span>
            <button
              type="button"
              className="grid h-8 w-8 place-items-center rounded-lg text-neutral-500 transition hover:bg-neutral-800 hover:text-neutral-300"
              aria-label="More options"
            >
              <span className="text-lg leading-none">⋯</span>
            </button>
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-[width] duration-500"
            style={{ width: barWidth }}
          />
        </div>
        <p className="mt-2 text-right text-xs text-neutral-500">
          {percent}
          {t("backendRoadmap.percentComplete")}
        </p>
      </div>

      <div className="mt-8 space-y-2" id="roadmap-weeks">
        {ROADMAP_WEEKS.map((week) => {
          const open = openWeekId === week.id;
          const doneInWeek = week.days.filter((d) => isDone(d.day)).length;
          const totalInWeek = week.days.length;

          return (
            <div
              key={week.id}
              className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40"
            >
              <button
                type="button"
                onClick={() => setOpenWeekId((cur) => (cur === week.id ? null : week.id))}
                className="flex w-full items-center gap-3 px-4 py-4 text-left transition hover:bg-neutral-800/50 sm:px-5"
              >
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${week.dotClass}`} aria-hidden />
                <span className="flex-1 font-medium text-neutral-100">{pickLocalized(week.title, locale)}</span>
                <span className="text-sm tabular-nums text-neutral-500">
                  {doneInWeek}/{totalInWeek} {t("jpRoadmap.doneSlash")}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-neutral-500 transition-transform ${open ? "rotate-0" : "-rotate-90"}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M6.22 5.22a.75.75 0 0 1 1.06 0L10 7.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L6.22 6.28a.75.75 0 0 1 0-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              {open ? (
                <div className="border-t border-neutral-800 px-4 py-5 sm:px-5">
                  <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {week.days.map((d) => {
                      const checked = isDone(d.day);
                      return (
                        <li
                          key={d.day}
                          className="flex flex-col rounded-xl border border-neutral-800 bg-neutral-800/40 p-4 transition hover:border-neutral-700"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-xs font-medium text-neutral-500">
                              {t("jpRoadmap.dayPrefix")} {d.day}
                            </span>
                            <button
                              type="button"
                              role="checkbox"
                              aria-checked={checked}
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDay(d.day);
                              }}
                              className={[
                                "grid h-5 w-5 shrink-0 place-items-center rounded border transition",
                                checked
                                  ? "border-sky-500 bg-sky-500 text-neutral-950"
                                  : "border-neutral-600 bg-neutral-900 hover:border-neutral-500",
                              ].join(" ")}
                            >
                              {checked ? (
                                <svg className="h-3 w-3" viewBox="0 0 12 12" fill="none" aria-hidden>
                                  <path
                                    d="M2.5 6L5 8.5L9.5 3.5"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              ) : null}
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={`Open details for day ${d.day}: ${pickLocalized(d.title, locale)}`}
                            className="mt-3 flex flex-1 flex-col rounded-lg text-left outline-offset-2 ring-offset-neutral-950 transition hover:bg-neutral-800/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-500/60"
                            onClick={() => setDetailDay(d.day)}
                          >
                            <h3 className="text-sm font-semibold leading-snug text-neutral-100">
                              {pickLocalized(d.title, locale)}
                            </h3>
                            <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                              {d.tags.map((tag) => (
                                <span
                                  key={`${d.day}-${tag.slug}`}
                                  className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagClass(tag.slug)}`}
                                >
                                  {pickLocalized(tag.label, locale)}
                                </span>
                              ))}
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="mt-14 flex flex-col items-center gap-4" id="roadmap-bottom">
        <button
          type="button"
          className="grid h-11 w-11 place-items-center rounded-full border border-neutral-700 bg-neutral-900 text-neutral-400 shadow-inner transition hover:border-neutral-600 hover:text-neutral-200"
          aria-label="Scroll to description"
          onClick={() => document.getElementById("roadmap-blurb")?.scrollIntoView({ behavior: "smooth" })}
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
            <path
              fillRule="evenodd"
              d="M10 3a.75.75 0 0 1 .75.75v10.19l2.22-2.22a.75.75 0 1 1 1.06 1.06l-3.5 3.5a.75.75 0 0 1-1.06 0l-3.5-3.5a.75.75 0 1 1 1.06-1.06l2.22 2.22V3.75A.75.75 0 0 1 10 3Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <p id="roadmap-blurb" className="max-w-2xl text-center text-sm leading-relaxed text-neutral-500">
          {t("backendRoadmap.bottomBlurb")}
        </p>
      </div>

      <DayDetailPanel
        key={detailDay === null ? "closed" : `day-${detailDay}`}
        dayNumber={detailDay}
        onClose={() => setDetailDay(null)}
        isDone={isDone}
        onToggleDone={(day) => toggleDay(day)}
      />
    </div>
  );
}
