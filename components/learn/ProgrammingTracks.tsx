"use client";

import Link from "next/link";
import { useId, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useGit7Progress } from "@/hooks/use-git-7-progress";
import { useReactProgress } from "@/hooks/use-react-progress";
import { useLaravelProgress } from "@/hooks/use-laravel-progress";
import { useNextjsProgress } from "@/hooks/use-nextjs-progress";
import { useDevopsProgress } from "@/hooks/use-devops-progress";
import type { UiStringKey } from "@/lib/i18n/catalog";
import { TOTAL_DAYS } from "@/lib/challenge-data";
import { GIT_TOTAL_DAYS } from "@/lib/git-learning/git-challenge-data";
import { REACT_TOTAL_DAYS } from "@/lib/react-learning/react-challenge-data";
import { LARAVEL_TOTAL_DAYS } from "@/lib/laravel-learning/laravel-challenge-data";
import { NEXTJS_TOTAL_DAYS } from "@/lib/nextjs-learning/nextjs-challenge-data";
import { DEVOPS_TOTAL_DAYS } from "@/lib/devops-learning/devops-challenge-data";
import { learnHubCardClass } from "@/components/learn/learn-hub-card-class";
import { REACT_PROGRAMMING_OUTLINE, reactCurriculumLessonCount } from "@/lib/react-learning/react-curriculum";
import { LARAVEL_TOPIC_OUTLINE, laravelOutlineBulletCount, laravelOutlineTopicCount } from "@/lib/laravel-learning/laravel-curriculum";
import { NEXTJS_TOPIC_OUTLINE, nextjsOutlineBulletCount, nextjsOutlineTopicCount } from "@/lib/nextjs-learning/nextjs-curriculum";

const gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

function ProgrammingAccordionSection({
  sectionId,
  titleKey,
  hintKey,
  defaultOpen = true,
  children,
}: {
  sectionId: string;
  titleKey: UiStringKey;
  hintKey: UiStringKey;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { t } = useLocale();

  return (
    <details
      id={sectionId}
      className="open:[&_.programming-chevron]:rotate-180 overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_92%,transparent)] shadow-sm"
      {...(defaultOpen ? { open: true } : {})}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5 text-left transition hover:bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] [&::-webkit-details-marker]:hidden">
        <div className="min-w-0">
          <h2 className="text-base font-semibold tracking-tight text-[var(--text)]">{t(titleKey)}</h2>
          <p className="mt-0.5 text-xs leading-snug text-[var(--muted)]">{t(hintKey)}</p>
        </div>
        <svg
          className="programming-chevron h-5 w-5 shrink-0 text-[var(--muted)] transition-transform duration-200"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </summary>
      <div className="border-t border-[var(--border)] px-4 pb-4 pt-4">
        <div className={gridClass}>{children}</div>
      </div>
    </details>
  );
}

export function ProgrammingTracks() {
  const { t } = useLocale();
  const baseId = useId();
  const { completedCount, percent } = useBackend30Progress();
  const git = useGit7Progress();
  const react = useReactProgress();
  const laravel = useLaravelProgress();
  const nextjs = useNextjsProgress();
  const devops = useDevopsProgress();
  const reactLessons = reactCurriculumLessonCount(REACT_PROGRAMMING_OUTLINE);
  const laravelTopics = laravelOutlineTopicCount(LARAVEL_TOPIC_OUTLINE);
  const laravelBullets = laravelOutlineBulletCount(LARAVEL_TOPIC_OUTLINE);
  const nextjsTopics = nextjsOutlineTopicCount(NEXTJS_TOPIC_OUTLINE);
  const nextjsBullets = nextjsOutlineBulletCount(NEXTJS_TOPIC_OUTLINE);

  return (
    <div className="flex flex-col gap-4">
      <ProgrammingAccordionSection
        sectionId={`${baseId}-frontend`}
        titleKey="hub.programming.groupFrontend"
        hintKey="hub.programming.groupFrontendHint"
        defaultOpen
      >
        <Link href="/learn/react" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.react.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.react.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {react.percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {react.completedCount}/{REACT_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${react.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {REACT_PROGRAMMING_OUTLINE.length} {t("reactOutline.statsSections")} · {reactLessons}{" "}
            {t("reactOutline.statsLessons")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.react.cta")}
          </span>
        </Link>

        <Link href="/learn/nextjs" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.nextjs.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.nextjs.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {nextjs.percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {nextjs.completedCount}/{NEXTJS_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${nextjs.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {nextjsTopics} {t("nextjsOutline.statsSections")} · {nextjsBullets} {t("nextjsOutline.statsBullets")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.nextjs.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-backend`}
        titleKey="hub.programming.groupBackend"
        hintKey="hub.programming.groupBackendHint"
        defaultOpen
      >
        <Link href="/learn/backend-30-days" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.backend.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.backend.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {completedCount}/{TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
          <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>

        <Link href="/learn/laravel" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.laravel.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.laravel.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {laravel.percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {laravel.completedCount}/{LARAVEL_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${laravel.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {laravelTopics} {t("laravelOutline.statsSections")} · {laravelBullets} {t("laravelOutline.statsBullets")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.laravel.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-devops`}
        titleKey="hub.programming.groupDevops"
        hintKey="hub.programming.groupDevopsHint"
        defaultOpen
      >
        <Link href="/learn/devops" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.devops.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.devops.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {devops.percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {devops.completedCount}/{DEVOPS_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${devops.percent}%` }}
              />
            </div>
          </div>
          <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-tools`}
        titleKey="hub.programming.groupTools"
        hintKey="hub.programming.groupToolsHint"
        defaultOpen
      >
        <Link href="/learn/git-7-days" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.git.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.git.subtitle")}</p>
            </div>
            <span
              className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
              suppressHydrationWarning
            >
              {git.percent}%
            </span>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {git.completedCount}/{GIT_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${git.percent}%` }}
              />
            </div>
          </div>
          <span className="mt-6 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backend.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>
    </div>
  );
}
