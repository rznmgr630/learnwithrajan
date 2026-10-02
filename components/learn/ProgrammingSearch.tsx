"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { pickLocalized } from "@/lib/i18n/pick";
import { PROGRAMMING_SEARCH_ROADMAPS, PROGRAMMING_SEARCH_TOPICS, PROGRAMMING_SEARCH_TRACKS } from "@/lib/programming-search";

type SearchResult = { title: string; subtitle: string; href: string };

function normalizeSearchTerm(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export function ProgrammingSearch() {
  const { locale } = useLocale();
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(query);
    if (!normalizedQuery) return [];

    const tracks: SearchResult[] = PROGRAMMING_SEARCH_TRACKS.map((track) => ({
      title: track.title,
      subtitle: "Learning track",
      href: track.href,
    }));
    const days: SearchResult[] = PROGRAMMING_SEARCH_ROADMAPS.flatMap((roadmap) =>
      roadmap.weeks.flatMap((week) => week.days.map((day) => ({
        title: pickLocalized(day.title, locale),
        subtitle: `${roadmap.track} · Day ${day.day}`,
        href: `${roadmap.href}?day=${day.day}`,
      }))),
    );
    const topics: SearchResult[] = PROGRAMMING_SEARCH_TOPICS.map((topic) => ({
      ...topic,
      subtitle: "System Design topic",
    }));

    return [...tracks, ...days, ...topics]
      .filter((result) => normalizeSearchTerm(`${result.title} ${result.subtitle}`).includes(normalizedQuery))
      .slice(0, 10);
  }, [locale, query]);

  return (
    <div className="relative mb-6">
      <label className="sr-only" htmlFor="programming-search">Search programming lessons</label>
      <input
        id="programming-search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search tracks or lesson topics"
        className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-sm text-[var(--text)] outline-none placeholder:text-[var(--faint)] focus:border-[var(--accent)]"
      />
      {results.length > 0 ? (
        <div className="absolute z-10 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--elevated)] shadow-xl">
          {results.map((result) => (
            <Link key={result.href} href={result.href} onClick={() => setQuery("")} className="block border-b border-[var(--border)] px-4 py-3 last:border-0 hover:bg-[var(--surface)]">
              <span className="block text-sm font-medium text-[var(--text)]">{result.title}</span>
              <span className="text-xs text-[var(--muted)]">{result.subtitle}</span>
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
