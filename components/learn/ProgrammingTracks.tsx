"use client";

import Link from "next/link";
import { useId, useRef, useEffect, type ReactNode } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useGit7Progress } from "@/hooks/use-git-7-progress";
import { useReactProgress } from "@/hooks/use-react-progress";
import { useLaravelProgress } from "@/hooks/use-laravel-progress";
import { useNextjsProgress } from "@/hooks/use-nextjs-progress";
import { useNodejsProgress } from "@/hooks/use-nodejs-progress";
import { useJsProgress } from "@/hooks/use-js-progress";
import { useReactNativeProgress } from "@/hooks/use-react-native-progress";
import { useDevopsProgress } from "@/hooks/use-devops-progress";
import type { UiStringKey } from "@/lib/i18n/catalog";
import { TOTAL_DAYS } from "@/lib/challenge-data";
import { GIT_TOTAL_DAYS } from "@/lib/git-learning/git-challenge-data";
import { REACT_TOTAL_DAYS } from "@/lib/react-learning/react-challenge-data";
import { LARAVEL_TOTAL_DAYS } from "@/lib/laravel-learning/laravel-challenge-data";
import { NEXTJS_TOTAL_DAYS } from "@/lib/nextjs-learning/nextjs-challenge-data";
import { NODEJS_TOTAL_DAYS } from "@/lib/nodejs-learning/nodejs-challenge-data";
import { DEVOPS_TOTAL_DAYS } from "@/lib/devops-learning/devops-challenge-data";
import { learnHubCardClass } from "@/components/learn/learn-hub-card-class";
import { PinButton } from "@/components/learn/PinButton";
import { REACT_PROGRAMMING_OUTLINE, reactCurriculumLessonCount } from "@/lib/react-learning/react-curriculum";
import { LARAVEL_TOPIC_OUTLINE, laravelOutlineBulletCount, laravelOutlineTopicCount } from "@/lib/laravel-learning/laravel-curriculum";
import { NEXTJS_TOPIC_OUTLINE, nextjsOutlineBulletCount, nextjsOutlineTopicCount } from "@/lib/nextjs-learning/nextjs-curriculum";
import { NODEJS_TOPIC_OUTLINE, nodejsOutlineBulletCount, nodejsOutlineTopicCount } from "@/lib/nodejs-learning/nodejs-curriculum";
import { JS_TOPIC_OUTLINE, jsOutlineBulletCount, jsOutlineTopicCount } from "@/lib/js-learning/js-curriculum";
import { JS_TOTAL_DAYS } from "@/lib/js-learning/js-challenge-data";
import {
  REACT_NATIVE_TOPIC_OUTLINE,
  reactNativeOutlineBulletCount,
  reactNativeOutlineTopicCount,
} from "@/lib/react-native-learning/react-native-curriculum";
import { REACT_NATIVE_TOTAL_DAYS } from "@/lib/react-native-learning/react-native-challenge-data";

const gridClass = "grid gap-4 sm:grid-cols-2 lg:grid-cols-3";

function ProgrammingAccordionSection({
  sectionId,
  titleKey,
  hintKey,
  defaultOpen = false,
  children,
}: {
  sectionId: string;
  titleKey: UiStringKey;
  hintKey: UiStringKey;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const { t } = useLocale();
  const ref = useRef<HTMLDetailsElement>(null);
  // Use titleKey as the storage key — it's a stable string unlike the useId()-based sectionId
  const storageKey = `acc:${titleKey}`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let shouldScroll = false;
    try {
      const saved = sessionStorage.getItem(storageKey);
      if (saved !== null) {
        el.open = saved === "1";
        // Scroll into view only if this is the section the user last navigated from
        shouldScroll = saved === "1" && sessionStorage.getItem("acc:last") === storageKey;
      }
    } catch {}
    if (shouldScroll) {
      const timer = setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
      return () => clearTimeout(timer);
    }
    function onToggle() {
      try {
        sessionStorage.setItem(storageKey, el!.open ? "1" : "0");
        if (el!.open) sessionStorage.setItem("acc:last", storageKey);
      } catch {}
    }
    el.addEventListener("toggle", onToggle);
    return () => el.removeEventListener("toggle", onToggle);
  }, [storageKey]);

  return (
    <details
      ref={ref}
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
  const nodejs = useNodejsProgress();
  const js = useJsProgress();
  const reactNative = useReactNativeProgress();
  const devops = useDevopsProgress();
  const reactLessons = reactCurriculumLessonCount(REACT_PROGRAMMING_OUTLINE);
  const laravelTopics = laravelOutlineTopicCount(LARAVEL_TOPIC_OUTLINE);
  const laravelBullets = laravelOutlineBulletCount(LARAVEL_TOPIC_OUTLINE);
  const nextjsTopics = nextjsOutlineTopicCount(NEXTJS_TOPIC_OUTLINE);
  const nextjsBullets = nextjsOutlineBulletCount(NEXTJS_TOPIC_OUTLINE);
  const nodejsTopics = nodejsOutlineTopicCount(NODEJS_TOPIC_OUTLINE);
  const nodejsBullets = nodejsOutlineBulletCount(NODEJS_TOPIC_OUTLINE);
  const jsTopics = jsOutlineTopicCount(JS_TOPIC_OUTLINE);
  const jsBullets = jsOutlineBulletCount(JS_TOPIC_OUTLINE);
  const rnTopics = reactNativeOutlineTopicCount(REACT_NATIVE_TOPIC_OUTLINE);
  const rnBullets = reactNativeOutlineBulletCount(REACT_NATIVE_TOPIC_OUTLINE);

  return (
    <div className="flex flex-col gap-4">
      <ProgrammingAccordionSection
        sectionId={`${baseId}-frontend`}
        titleKey="hub.programming.groupFrontend"
        hintKey="hub.programming.groupFrontendHint"
      >
        <Link href="/learn/react" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.react.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.react.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {react.percent}%
              </span>
              <PinButton id="react" />
            </div>
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

        <Link href="/learn/javascript" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.js.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.js.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {js.percent}%
              </span>
              <PinButton id="javascript" />
            </div>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {js.completedCount}/{JS_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${js.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {jsTopics} {t("jsOutline.statsSections")} · {jsBullets} {t("jsOutline.statsBullets")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.js.cta")}
          </span>
        </Link>

        <Link href="/learn/react-native" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.reactNative.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.reactNative.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {reactNative.percent}%
              </span>
              <PinButton id="react-native" />
            </div>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {reactNative.completedCount}/{REACT_NATIVE_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${reactNative.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {rnTopics} {t("reactNativeOutline.statsSections")} · {rnBullets}{" "}
            {t("reactNativeOutline.statsBullets")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.reactNative.cta")}
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
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {nextjs.percent}%
              </span>
              <PinButton id="nextjs" />
            </div>
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
      >
        <Link href="/learn/backend-30-days" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.backend.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.backend.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {percent}%
              </span>
              <PinButton id="backend-30-days" />
            </div>
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
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {laravel.percent}%
              </span>
              <PinButton id="laravel" />
            </div>
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

        <Link href="/learn/nodejs" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.nodejs.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.nodejs.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {nodejs.percent}%
              </span>
              <PinButton id="nodejs" />
            </div>
          </div>
          <div className="mt-6" suppressHydrationWarning>
            <div className="flex items-center justify-between text-xs text-[var(--muted)]">
              <span>{t("hub.backend.progress")}</span>
              <span className="tabular-nums text-[var(--muted)]">
                {nodejs.completedCount}/{NODEJS_TOTAL_DAYS} {t("hub.backend.days")}
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--elevated)]">
              <div
                className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                style={{ width: `${nodejs.percent}%` }}
              />
            </div>
          </div>
          <p className="mt-4 text-xs text-[var(--muted)]">
            {nodejsTopics} {t("nodejsOutline.statsSections")} · {nodejsBullets} {t("nodejsOutline.statsBullets")}
          </p>
          <span className="mt-3 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.nodejs.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-database`}
        titleKey="hub.programming.groupDatabase"
        hintKey="hub.programming.groupDatabaseHint"
      >
        <Link href="/learn/sql" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.sql.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.sql.subtitle")}</p>
            </div>
            <PinButton id="sql" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Tables", "Joins", "Indexes", "ACID", "SQL"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.sql.cta")}
          </span>
        </Link>

        <Link href="/learn/mongodb" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.mongodb.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.mongodb.subtitle")}</p>
            </div>
            <PinButton id="mongodb" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Documents", "Aggregation", "Indexes", "Sharding", "NoSQL"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.mongodb.cta")}
          </span>
        </Link>

      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-baas`}
        titleKey="hub.programming.groupBaas"
        hintKey="hub.programming.groupBaasHint"
      >
        <Link href="/learn/supabase" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.supabase.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.supabase.subtitle")}</p>
            </div>
            <PinButton id="supabase" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Auth", "RLS", "Real-time", "Storage", "Edge Functions"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.supabase.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-messaging`}
        titleKey="hub.programming.groupMessaging"
        hintKey="hub.programming.groupMessagingHint"
      >
        <Link href="/learn/rabbitmq" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                RabbitMQ
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Message queues from zero to production</p>
            </div>
            <PinButton id="rabbitmq" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["AMQP", "Exchanges", "DLX", "Quorum Queues", "Patterns"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            Start learning →
          </span>
        </Link>

        <Link href="/learn/kafka" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                Apache Kafka
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">Event streaming from zero to production</p>
            </div>
            <PinButton id="kafka" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["Topics", "Partitions", "Consumer Groups", "Event Replay", "Exactly-once"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            Start learning →
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-devops`}
        titleKey="hub.programming.groupDevops"
        hintKey="hub.programming.groupDevopsHint"
      >
        <Link href="/learn/devops" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.devops.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.devops.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {devops.percent}%
              </span>
              <PinButton id="devops" />
            </div>
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
        sectionId={`${baseId}-dsa`}
        titleKey="hub.programming.groupDsa"
        hintKey="hub.programming.groupDsaHint"
      >
        <Link href="/learn/dsa" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.dsa.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.dsa.subtitle")}</p>
            </div>
            <PinButton id="dsa" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {(["Basic", "Medium", "Advanced"] as const).map((level) => (
              <span
                key={level}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                  level === "Basic"
                    ? "bg-emerald-500/10 text-emerald-500"
                    : level === "Medium"
                      ? "bg-amber-500/10 text-amber-500"
                      : "bg-rose-500/10 text-rose-500"
                }`}
              >
                {level}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.dsa.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-tools`}
        titleKey="hub.programming.groupTools"
        hintKey="hub.programming.groupToolsHint"
      >
        <Link href="/learn/git-7-days" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.git.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.git.subtitle")}</p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                suppressHydrationWarning
              >
                {git.percent}%
              </span>
              <PinButton id="git-7-days" />
            </div>
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

      <ProgrammingAccordionSection
        sectionId={`${baseId}-websites`}
        titleKey="hub.programming.groupWebsites"
        hintKey="hub.programming.groupWebsitesHint"
      >
        {[
          {
            name: "Exercism",
            url: "https://exercism.org",
            subtitle: "Writing clean code, language fundamentals and feedback-driven learning",
            tags: ["Clean Code", "79 Languages", "Mentorship"],
          },
          {
            name: "VisuAlgo",
            url: "https://visualgo.net",
            subtitle: "Visualizing algorithms, understanding how DS actually work and debugging logic gaps",
            tags: ["Algorithms", "Data Structures", "Visualizer"],
          },
          {
            name: "Project Euler",
            url: "https://projecteuler.net",
            subtitle: "Mathematical thinking, problem decomposition and deep reasoning",
            tags: ["Math", "Problem Solving", "Logic"],
          },
          {
            name: "Refactoring Guru",
            url: "https://refactoring.guru",
            subtitle: "Code structure, design patterns intuition and clean code thinking",
            tags: ["Design Patterns", "Refactoring", "Clean Code"],
          },
          {
            name: "Codewars",
            url: "https://codewars.com",
            subtitle: "Thinking in edge cases, writing expressive code and reading others' solutions",
            tags: ["Kata", "Edge Cases", "Code Review"],
          },
        ].map((site) => (
          <a
            key={site.name}
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className={learnHubCardClass}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                  {site.name}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted)]">{site.subtitle}</p>
              </div>
              <svg
                className="mt-1 h-4 w-4 shrink-0 text-[var(--faint)]"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {site.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
              Visit website →
            </span>
          </a>
        ))}
      </ProgrammingAccordionSection>

      <ProgrammingAccordionSection
        sectionId={`${baseId}-interview`}
        titleKey="hub.programming.groupInterview"
        hintKey="hub.programming.groupInterviewHint"
      >
        <Link href="/learn/system-design" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.systemDesign.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.systemDesign.subtitle")}</p>
            </div>
            <PinButton id="system-design" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["API", "Caching", "Sharding", "Kafka", "CAP Theorem"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.systemDesign.cta")}
          </span>
        </Link>

        <Link href="/learn/backend-engineering" className={learnHubCardClass}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
                {t("hub.backendEngineering.title")}
              </h3>
              <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.backendEngineering.subtitle")}</p>
            </div>
            <PinButton id="backend-engineering" />
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {["APIs", "Databases", "Caching", "Kafka", "Reliability"].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] px-2.5 py-1 text-xs text-[var(--muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
          <span className="mt-4 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
            {t("hub.backendEngineering.cta")}
          </span>
        </Link>
      </ProgrammingAccordionSection>
    </div>
  );
}
