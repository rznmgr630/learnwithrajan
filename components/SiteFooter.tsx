"use client";

import Link from "next/link";
import { useLocale } from "@/components/i18n/LocaleProvider";

const AUTHOR_SITE = "https://rajanmidun.com.np";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="mt-auto border-t border-[var(--border)] py-10">
      <div className="mx-auto flex max-w-5xl justify-center px-4 sm:px-6">
        <p
          className="inline-flex flex-wrap items-center justify-center gap-x-1 text-center text-sm text-[var(--muted)]"
          aria-label={t("footer.creditAria")}
        >
          <span>{t("footer.creditBeforeHeart")}</span>
          <span className="text-rose-400/95" aria-hidden="true">
            ♥
          </span>
          <span>{t("footer.creditAfterHeart")}</span>
          <Link
            href={AUTHOR_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[var(--accent)] underline-offset-2 hover:underline"
          >
            {t("footer.authorName")}
          </Link>
        </p>
      </div>
    </footer>
  );
}
