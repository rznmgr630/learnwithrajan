"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LearnBackNav() {
  const { t } = useLocale();

  return (
    <Link href="/learn" className="text-sm text-[var(--muted)] transition hover:text-[var(--text)]">
      {t("learn.back")}
    </Link>
  );
}
