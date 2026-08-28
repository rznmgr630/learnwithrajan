"use client";

import { useEffect } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { DayDetailBlockRenderer } from "@/components/learn/DayDetailBlockRenderer";
import type { RoadmapDiagramTrack } from "@/components/learn/DayDetailBlockRenderer";
import { RichText, RichParagraph } from "@/components/learn/RichText";
import { SelfCheckList } from "@/components/learn/SelfCheckList";
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
import { getJsRoadmapDayContext, resolveJsDayDetail } from "@/lib/js-learning/js-challenge-data";
import { localizeJsRoadmapDayDetail } from "@/lib/js-learning/localize-js-roadmap-detail";
import { getDevopsRoadmapDayContext, resolveDevopsDayDetail } from "@/lib/devops-learning/devops-challenge-data";
import { localizeDevopsRoadmapDayDetail } from "@/lib/devops-learning/localize-devops-roadmap-detail";
import {
  getReactNativeRoadmapDayContext,
  resolveReactNativeDayDetail,
} from "@/lib/react-native-learning/react-native-challenge-data";
import { localizeReactNativeRoadmapDayDetail } from "@/lib/react-native-learning/localize-react-native-roadmap-detail";
import { LessonQuiz } from "@/components/learn/LessonQuiz";
import { pickLocalized } from "@/lib/i18n/pick";
import { stripLessonTimingFromTitle } from "@/lib/learn/strip-lesson-timing";
import { stripRichMarkers } from "@/lib/learn/strip-rich-markers";
import { LessonNav, type LessonNavTarget } from "@/components/learn/LessonNav";

type DayDetailPanelProps = {
  dayNumber: number | null;
  onClose: () => void;
  isDone: (day: number) => boolean;
  onToggleDone: (day: number) => void;
  /** Defaults to backend 30-day roadmap. */
  track?: RoadmapDiagramTrack;
  /** Enables the previous/next footer; receives the day to open. */
  onNavigateDay?: (day: number) => void;
};

function dayContextFor(track: RoadmapDiagramTrack, dayNumber: number) {
  switch (track) {
    case "git":
      return getGitRoadmapDayContext(dayNumber);
    case "react":
      return getReactRoadmapDayContext(dayNumber);
    case "laravel":
      return getLaravelRoadmapDayContext(dayNumber);
    case "nextjs":
      return getNextjsRoadmapDayContext(dayNumber);
    case "nodejs":
      return getNodejsRoadmapDayContext(dayNumber);
    case "js":
      return getJsRoadmapDayContext(dayNumber);
    case "react-native":
      return getReactNativeRoadmapDayContext(dayNumber);
    case "devops":
      return getDevopsRoadmapDayContext(dayNumber);
    default:
      return getRoadmapDayContext(dayNumber);
  }
}

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
  onNavigateDay,
}: DayDetailPanelProps) {
  const { locale, t } = useLocale();
  const open = dayNumber !== null;
  const ctx = dayNumber !== null ? dayContextFor(track, dayNumber) : null;

  function neighbour(offset: -1 | 1): LessonNavTarget | null {
    if (dayNumber === null) return null;
    const day = dayNumber + offset;
    const neighbourCtx = day >= 1 ? dayContextFor(track, day) : null;
    if (!neighbourCtx) return null;
    return {
      day,
      title: stripRichMarkers(stripLessonTimingFromTitle(pickLocalized(neighbourCtx.day.title, locale))),
    };
  }
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
              : track === "js"
                ? resolveJsDayDetail(ctx.day)
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
              : track === "js"
                ? localizeJsRoadmapDayDetail(detailRaw, locale)
                : track === "react-native"
                ? localizeReactNativeRoadmapDayDetail(detailRaw, locale)
                : track === "devops"
                  ? localizeDevopsRoadmapDayDetail(detailRaw, locale)
                  : localizeRoadmapDayDetail(detailRaw, locale)
    : null;

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
      track === "js" ||
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

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto overscroll-y-contain p-5">
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
              <div className="mt-2 space-y-3">
                {introToShow.map((p, i) => (
                  <div key={i}>
                    <RichParagraph text={p} />
                  </div>
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

          <SelfCheckList
            key={`${track}-${dayNumber}`}
            items={faq}
            idPrefix={`faq-${dayNumber}`}
            heading={t("backendDetail.selfCheckHeading")}
            hint={track === "git"
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
            locale={locale}
          />

          {detail.quiz && detail.quiz.length > 0 ? (
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">
                {t("dayDetail.finalQuiz")}
              </h3>
              <div className="mt-3">
                <LessonQuiz
                  quizId={`${track}-day-${dayNumber}.final`}
                  questions={detail.quiz}
                  locale={locale}
                />
              </div>
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

          {onNavigateDay ? (
            <LessonNav
              previous={neighbour(-1)}
              next={neighbour(1)}
              onNavigate={(target) => {
                if (target.day !== undefined) onNavigateDay(target.day);
              }}
            />
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
