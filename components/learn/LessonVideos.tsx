"use client";

import { useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";

export type LessonVideo = {
  id: string;
  /** Shown as the tab label. Falls back to "Part N" when absent. */
  title?: string;
};

type LessonVideosProps = {
  videos: LessonVideo[];
  /** Already-localized lesson title, used for the iframe accessible name. */
  title: string;
};

function Player({ videoId, title }: { videoId: string; title: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--border)]">
      <div className="relative w-full pb-[56.25%]">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
    </div>
  );
}

/**
 * Renders a lesson's videos. A single video is shown on its own; several are
 * put behind Part tabs so the page stays short and only the chosen one loads.
 */
export function LessonVideos({ videos, title }: LessonVideosProps) {
  const { t, tParams } = useLocale();
  const [active, setActive] = useState(0);

  if (!videos.length) return null;

  if (videos.length === 1) {
    return (
      <div className="mt-4">
        <Player videoId={videos[0].id} title={videos[0].title ?? title} />
      </div>
    );
  }

  const partLabel = (index: number) =>
    videos[index].title ?? tParams("lessonVideos.part", { part: index + 1 });

  return (
    <div className="mt-4">
      <div
        role="tablist"
        aria-label={t("lessonVideos.label")}
        className="mb-2 flex flex-wrap gap-2"
      >
        {videos.map((video, i) => (
          <button
            key={video.id}
            type="button"
            role="tab"
            aria-selected={i === active}
            onClick={() => setActive(i)}
            title={partLabel(i)}
            className={`max-w-[14rem] truncate rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
              i === active
                ? "border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--accent)]"
                : "border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)]/50 hover:text-[var(--text)]"
            }`}
          >
            {partLabel(i)}
          </button>
        ))}
      </div>
      <Player videoId={videos[active].id} title={`${title} — ${partLabel(active)}`} />
    </div>
  );
}
