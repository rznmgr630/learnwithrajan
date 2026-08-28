"use client";

import { RichText, RichParagraph } from "@/components/learn/RichText";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pickLocalized } from "@/lib/i18n/pick";
import type { LessonProject } from "@/lib/learn/lesson-types";

function List({
  label,
  items,
  ordered,
  locale,
}: {
  label: string;
  items: LessonProject["steps"];
  ordered?: boolean;
  locale: ReturnType<typeof useLocale>["locale"];
}) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <div className="mt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{label}</h4>
      <Tag
        className={`mt-2 space-y-2 pl-5 text-sm leading-relaxed text-[var(--muted)] marker:text-[var(--muted)] ${
          ordered ? "list-decimal" : "list-disc"
        }`}
      >
        {items.map((line, i) => (
          <li key={i} className="pl-1">
            <RichText text={pickLocalized(line, locale)} />
          </li>
        ))}
      </Tag>
    </div>
  );
}

export function LessonProjectCard({ project }: { project: LessonProject }) {
  const { locale, t } = useLocale();

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_28%,transparent)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--text)]">🛠 {t("lessonProject.heading")}</h3>
        <span className="inline-flex rounded-full border border-[var(--border)]/90 bg-[color-mix(in_oklab,var(--elevated)_58%,transparent)] px-2.5 py-0.5 text-xs font-medium text-[var(--text)]">
          <RichText text={pickLocalized(project.name, locale)} />
        </span>
      </div>

      <p className="mt-2 text-sm font-medium text-[var(--text)]">
        <RichText text={pickLocalized(project.goal, locale)} />
      </p>

      <div className="mt-2 space-y-3 text-sm leading-relaxed text-[var(--muted)]">
        {pickLocalized(project.brief, locale)
          .split("\n\n")
          .map((para, i) => (
            <RichParagraph key={i} text={para} />
          ))}
      </div>

      <List label={t("lessonProject.steps")} items={project.steps} ordered locale={locale} />
      <List label={t("lessonProject.acceptance")} items={project.acceptance} locale={locale} />
      {project.stretch?.length ? (
        <List label={t("lessonProject.stretch")} items={project.stretch} locale={locale} />
      ) : null}
    </div>
  );
}
