"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { usePinnedTracks } from "@/hooks/use-pinned-tracks";
import { PinButton } from "@/components/learn/PinButton";
import { PINNABLE_TRACKS } from "@/lib/pinned-tracks";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { useGit7Progress } from "@/hooks/use-git-7-progress";
import { useReactProgress } from "@/hooks/use-react-progress";
import { useLaravelProgress } from "@/hooks/use-laravel-progress";
import { useNextjsProgress } from "@/hooks/use-nextjs-progress";
import { useNodejsProgress } from "@/hooks/use-nodejs-progress";
import { useJsProgress } from "@/hooks/use-js-progress";
import { useReactNativeProgress } from "@/hooks/use-react-native-progress";
import { useDevopsProgress } from "@/hooks/use-devops-progress";
import { useJapaneseN5Progress } from "@/hooks/use-japanese-n5-progress";
import { useJapaneseN4Progress } from "@/hooks/use-japanese-n4-progress";
import { useJapaneseN3Progress } from "@/hooks/use-japanese-n3-progress";

export function HomePinnedTracks() {
  const { t } = useLocale();
  const { pinned } = usePinnedTracks();

  const backend30 = useBackend30Progress();
  const git = useGit7Progress();
  const react = useReactProgress();
  const laravel = useLaravelProgress();
  const nextjs = useNextjsProgress();
  const nodejs = useNodejsProgress();
  const js = useJsProgress();
  const reactNative = useReactNativeProgress();
  const devops = useDevopsProgress();
  const jp = useJapaneseN5Progress();
  const jpN4 = useJapaneseN4Progress();
  const jpN3 = useJapaneseN3Progress();

  const percentById: Record<string, number> = {
    "backend-30-days": backend30.percent,
    "git-7-days": git.percent,
    react: react.percent,
    laravel: laravel.percent,
    nextjs: nextjs.percent,
    nodejs: nodejs.percent,
    javascript: js.percent,
    "react-native": reactNative.percent,
    devops: devops.percent,
    "japanese-n5": jp.percent,
    "japanese-n4": jpN4.percent,
    "japanese-n3": jpN3.percent,
  };

  const pinnedTracks = PINNABLE_TRACKS.filter((track) => pinned.has(track.id));

  return (
    <section id="pinned" className="border-b border-[var(--border)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-2xl font-semibold tracking-tight text-[var(--text)] sm:text-3xl">
          {t("home.pinnedTitle")}
        </h2>
        <p className="mt-2 max-w-xl text-[var(--muted)]">{t("home.pinnedSubtitle")}</p>

        {pinnedTracks.length === 0 ? (
          <div className="mt-10 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-[var(--border)] p-8">
            <p className="text-base font-semibold text-[var(--text)]">{t("home.pinnedEmptyTitle")}</p>
            <p className="max-w-md text-sm text-[var(--muted)]">{t("home.pinnedEmptyBody")}</p>
            <Link
              href="/learn"
              className="mt-2 inline-flex items-center justify-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-semibold text-[var(--text)] transition hover:bg-[var(--elevated)]"
            >
              {t("home.pinnedEmptyCta")}
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pinnedTracks.map((track) => {
              const percent = percentById[track.id];
              return (
                <div
                  key={track.id}
                  className="group flex flex-col gap-2 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_50%,transparent)] p-5 shadow-sm transition hover:border-[color-mix(in_oklab,var(--accent)_40%,var(--border))] hover:bg-[var(--elevated)]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-[var(--faint)]">
                      {t(track.groupKey)}
                    </p>
                    <PinButton id={track.id} />
                  </div>
                  <Link href={track.href} className="flex flex-1 flex-col">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base font-semibold text-[var(--text)] group-hover:text-[var(--accent)]">
                        {track.titleKey ? t(track.titleKey) : track.title}
                      </span>
                      {percent !== undefined && (
                        <span
                          className="shrink-0 rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--accent)]"
                          suppressHydrationWarning
                        >
                          {percent}%
                        </span>
                      )}
                    </div>
                    {percent !== undefined && (
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--elevated)]" suppressHydrationWarning>
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    )}
                    <span className="mt-auto pt-4 text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
                      {t("hub.category.cta")}
                    </span>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
