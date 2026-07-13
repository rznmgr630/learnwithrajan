"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { learnHubCardClass } from "@/components/learn/learn-hub-card-class";

export function LoksewaTracks() {
  const { t } = useLocale();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link href="/learn/loksewa/geography" className={learnHubCardClass}>
        <h3 className="text-lg font-semibold tracking-tight text-[var(--text)] group-hover:text-[var(--accent)]">
          {t("hub.loksewaGeography.title")}
        </h3>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("hub.loksewaGeography.subtitle")}</p>
        <span className="mt-6 block text-sm font-medium text-[var(--accent)] transition group-hover:brightness-110">
          {t("hub.loksewaGeography.cta")}
        </span>
      </Link>
    </div>
  );
}
