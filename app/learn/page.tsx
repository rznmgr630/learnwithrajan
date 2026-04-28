"use client";

import { LearningHubCards } from "@/components/learn/LearningHubCards";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LearnPage() {
  const { t } = useLocale();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">{t("learn.title")}</h1>
        <p className="mt-3 text-[var(--muted)]">{t("learn.subtitle")}</p>
      </div>
      <div className="mt-10">
        <LearningHubCards />
      </div>
    </div>
  );
}
