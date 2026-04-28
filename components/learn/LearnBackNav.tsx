"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

export function LearnBackNav() {
  const { t } = useLocale();

  return (
    <Link href="/learn" className="text-sm text-neutral-500 transition hover:text-neutral-300">
      {t("learn.back")}
    </Link>
  );
}
