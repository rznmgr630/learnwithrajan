"use client";

import { useEffect, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DayDetailBlockRenderer } from "@/components/learn/DayDetailBlockRenderer";
import type { RoadmapDiagramTrack } from "@/components/learn/DayDetailBlockRenderer";
import { RichText } from "@/components/learn/RichText";
import { localizeRoadmapDayDetail } from "@/lib/backend-learning/localize-roadmap-detail";
import { localizeGitRoadmapDayDetail } from "@/lib/git-learning/localize-git-roadmap-detail";
import { getRoadmapDayContext, resolveDayDetail } from "@/lib/challenge-data";
import { getGitRoadmapDayContext, resolveGitDayDetail } from "@/lib/git-learning/git-challenge-data";
import { getReactRoadmapDayContext, resolveReactDayDetail } from "@/lib/react-learning/react-challenge-data";
import { localizeReactRoadmapDayDetail } from "@/lib/react-learning/localize-react-roadmap-detail";
import { getLaravelRoadmapDayContext, resolveLaravelDayDetail } from "@/lib/laravel-learning/laravel-challenge-data";
import { localizeLaravelRoadmapDayDetail } from "@/lib/laravel-learning/localize-laravel-roadmap-detail";
import { getNextjsRoadmapDayContext, resolveNextjsDayDetail } from "@/lib/nextjs-learning/nextjs-challenge-data";
import { localizeNextjsRoadmapDayDetail } from "@/lib/nextjs-learning/localize-nextjs-roadmap-detail";
import { getNodejsRoadmapDayContext, resolveNodejsDayDetail } from "@/lib/nodejs-learning/nodejs-challenge-data";
import { localizeNodejsRoadmapDayDetail } from "@/lib/nodejs-learning/localize-nodejs-roadmap-detail";
import { getDevopsRoadmapDayContext, resolveDevopsDayDetail } from "@/lib/devops-learning/devops-challenge-data";
import { localizeDevopsRoadmapDayDetail } from "@/lib/devops-learning/localize-devops-roadmap-detail";
import {
  getReactNativeRoadmapDayContext,
  resolveReactNativeDayDetail,
} from "@/lib/react-native-learning/react-native-challenge-data";
import { localizeReactNativeRoadmapDayDetail } from "@/lib/react-native-learning/localize-react-native-roadmap-detail";
import { splitFaqAnswerIntoParagraphs } from "@/lib/faq-answer-paragraphs";
import { pickLocalized } from "@/lib/i18n/pick";
import { stripLessonTimingFromTitle } from "@/lib/learn/strip-lesson-timing";

type DayDetailPanelProps = {
  dayNumber: number | null;
  onClose: () => void;
  isDone: (day: number) => boolean;
  onToggleDone: (day: number) => void;
  /** Defaults to backend 30-day roadmap. */
  track?: RoadmapDiagramTrack;
};

function overviewParagraphs(overview: string | string[]): string[] {
  const raw = Array.isArray(overview) ? overview : [overview];
  return raw.map((p) => p.trim()).filter((p) => p.length > 0);
}

export function DayDetailPanel({
  dayNumber,
  onClose,
  isDone,
  onToggleDone,
  track = "backend",
}: DayDetailPanelProps) {
  const { locale, t } = useLocale();
  const open = dayNumber !== null;
  const ctx =
    dayNumber !== null
      ? track === "git"
        ? getGitRoadmapDayContext(dayNumber)
        : track === "react"
          ? getReactRoadmapDayContext(dayNumber)
          : track === "laravel"
            ? getLaravelRoadmapDayContext(dayNumber)
            : track === "nextjs"
              ? getNextjsRoadmapDayContext(dayNumber)
              : track === "nodejs"
                ? getNodejsRoadmapDayContext(dayNumber)
                : track === "react-native"
                  ? getReactNativeRoadmapDayContext(dayNumber)
                  : track === "devops"
                    ? getDevopsRoadmapDayContext(dayNumber)
                    : getRoadmapDayContext(dayNumber)
      : null;
  const detailRaw = ctx
    ? track === "git"
      ? resolveGitDayDetail(ctx.day)
      : track === "react"
        ? resolveReactDayDetail(ctx.day)
        : track === "laravel"
          ? resolveLaravelDayDetail(ctx.day)
          : track === "nextjs"
            ? resolveNextjsDayDetail(ctx.day)
            : track === "nodejs"
              ? resolveNodejsDayDetail(ctx.day)
              : track === "react-native"
                ? resolveReactNativeDayDetail(ctx.day)
                : track === "devops"
                  ? resolveDevopsDayDetail(ctx.day)
                  : resolveDayDetail(ctx.day)
    : null;
  const detail = detailRaw
    ? track === "git"
      ? localizeGitRoadmapDayDetail(detailRaw, locale)
      : track === "react"
        ? localizeReactRoadmapDayDetail(detailRaw, locale)
        : track === "laravel"
          ? localizeLaravelRoadmapDayDetail(detailRaw, locale)
          : track === "nextjs"
            ? localizeNextjsRoadmapDayDetail(detailRaw, locale)
            : track === "nodejs"
              ? localizeNodejsRoadmapDayDetail(detailRaw, locale)
              : track === "react-native"
                ? localizeReactNativeRoadmapDayDetail(detailRaw, locale)
                : track === "devops"
                  ? localizeDevopsRoadmapDayDetail(detailRaw, locale)
                  : localizeRoadmapDayDetail(detailRaw, locale)
    : null;
  const [openFaq, setOpenFaq] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    setOpenFaq(new Set());
  }, [dayNumber, track]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open || !ctx || !detail || dayNumber === null) return null;

  const done = isDone(dayNumber);
  const intro = overviewParagraphs(detail.overview);
  const hideOverviewWhenSections =
    (track === "react" ||
      track === "laravel" ||
      track === "nextjs" ||
      track === "nodejs" ||
      track === "react-native") &&
    (detail.sections?.length ?? 0) > 0;
  const introToShow = hideOverviewWhenSections ? [] : intro;
  const faq = detail.faq ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close day detail"
        onClick={onClose}
      />
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div>
            <p className="text-xs font-medium text-[var(--muted)]">
              <RichText text={stripLessonTimingFromTitle(pickLocalized(ctx.weekTitle, locale))} />
            </p>
            <h2 className="mt-1 text-lg font-semibold leading-snug text-[var(--text)]">
              {t("jpRoadmap.dayPrefix")} {ctx.day.day}:{" "}
              <RichText text={stripLessonTimingFromTitle(pickLocalized(ctx.day.title, locale))} />
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          <div className="flex flex-wrap gap-2">
            {ctx.day.tags.map((tag) => (
              <span
                key={`${ctx.day.day}-${tag.slug}`}
                className="rounded-full border border-[var(--border)] bg-[var(--elevated)] px-2.5 py-1 text-xs font-medium text-[var(--muted)]"
              >
                <RichText text={pickLocalized(tag.label, locale)} />
              </span>
            ))}
          </div>

          {introToShow.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t("jpDetail.overviewHeading")}
              </h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
                {introToShow.map((p, i) => (
                  <p key={i}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {detail.sections?.map((sec) => (
            <div key={sec.title}>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                <RichText text={stripLessonTimingFromTitle(sec.title)} />
              </h3>
              {sec.blocks && sec.blocks.length > 0 ? (
                <DayDetailBlockRenderer blocks={sec.blocks} locale={locale} diagramTrack={track} />
              ) : sec.items && sec.items.length > 0 ? (
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--muted)]">
                  {sec.items.map((line, i) => (
                    <li key={i} className="pl-1">
                      <RichText text={line} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}

          {faq.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t("backendDetail.selfCheckHeading")}
                <span className="ml-1 font-mono text-[11px] font-normal text-[var(--faint)]">
                  ({faq.length})
                </span>
              </h3>
              <p className="mt-1 text-xs text-[var(--muted)]">
                {track === "git"
                  ? t("gitDetail.selfCheckHint")
                  : track === "react"
                    ? t("reactDetail.selfCheckHint")
                    : track === "laravel"
                      ? t("laravelDetail.selfCheckHint")
                      : track === "nextjs"
                        ? t("nextjsDetail.selfCheckHint")
                        : track === "nodejs"
                          ? t("nodejsDetail.selfCheckHint")
                          : track === "react-native"
                            ? t("reactNativeDetail.selfCheckHint")
                            : track === "devops"
                              ? t("devopsDetail.selfCheckHint")
                              : t("backendDetail.selfCheckHint")}
              </p>
              <ul className="mt-3 space-y-2" role="list">
                {faq.map((item, i) => {
                  const expanded = openFaq.has(i);
                  return (
                    <li
                      key={i}
                      className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_28%,transparent)]"
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        id={`faq-q-${dayNumber}-${i}`}
                        aria-controls={`faq-a-${dayNumber}-${i}`}
                        onClick={() => {
                          setOpenFaq((prev) => {
                            const next = new Set(prev);
                            if (next.has(i)) next.delete(i);
                            else next.add(i);
                            return next;
                          });
                        }}
                        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-sm font-medium text-[var(--text)] transition hover:bg-[color-mix(in_oklab,var(--elevated)_55%,transparent)]"
                      >
                        <span className="min-w-0 leading-snug">
                          <span className="mr-2 font-mono text-xs text-[var(--muted)] tabular-nums">
                            {String(i + 1).padStart(2, "0")}.
                          </span>
                          <RichText text={stripLessonTimingFromTitle(item.question)} />
                        </span>
                        <svg
                          className={`mt-0.5 h-5 w-5 shrink-0 text-[var(--muted)] transition-transform ${expanded ? "rotate-180" : ""}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {expanded ? (
                        <div
                          id={`faq-a-${dayNumber}-${i}`}
                          role="region"
                          aria-labelledby={`faq-q-${dayNumber}-${i}`}
                          className="border-t border-[var(--border)] px-4 py-3 text-sm leading-relaxed text-[var(--muted)]"
                        >
                          {item.tag ? (
                            <p className="mb-3">
                              <span className="inline-flex rounded-full border border-[var(--border)]/90 bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--text)]">
                                <RichText text={item.tag} />
                              </span>
                            </p>
                          ) : null}
                          <div className="space-y-3">
                            {splitFaqAnswerIntoParagraphs(item.answer).map((para, pi) => (
                              <p key={pi}>
                                <RichText text={para} />
                              </p>
                            ))}
                          </div>
                          {item.callout ? (
                            <blockquote className="mt-4 border-l-2 border-[var(--border)] pl-3 text-sm text-[var(--muted)]">
                              <RichText text={item.callout} />
                            </blockquote>
                          ) : null}
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          {detail.bullets && detail.bullets.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t("jpDetail.practiceChecklist")}
              </h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--muted)]">
                {detail.bullets.map((line, i) => (
                  <li key={i} className="pl-1">
                    <RichText text={line} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="border-t border-[var(--border)] p-5">
          <button
            type="button"
            onClick={() => onToggleDone(dayNumber)}
            className={[
              "flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition",
              done
                ? "bg-[var(--elevated)] text-[var(--text)] hover:bg-[color-mix(in_oklab,var(--elevated)_88%,var(--accent))]"
                : "bg-[var(--accent)] text-[var(--accent-fg)] hover:brightness-110",
            ].join(" ")}
          >
            {done ? t("jpDetail.markDayNotDone") : t("jpDetail.markDayDone")}
          </button>
        </div>
      </aside>
    </div>
  );
}
