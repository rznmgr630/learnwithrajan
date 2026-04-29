"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";
import type { UiStringKey } from "@/lib/i18n/catalog";

const DEFAULT_LABEL: UiStringKey = "learn.back";

type LearnBackNavProps = {
  href?: string;
  /** Catalog key for the link label (default: learn.back). */
  labelKey?: UiStringKey;
};

export function LearnBackNav({ href = "/learn", labelKey = DEFAULT_LABEL }: LearnBackNavProps) {
  const { t } = useLocale();

  return (
    <Link href={href} className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
      {t(labelKey)}
    </Link>
  );
}
