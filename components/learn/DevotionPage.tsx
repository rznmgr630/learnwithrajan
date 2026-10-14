"use client";

import { LearnBackNav } from "@/components/learn/LearnBackNav";
import { VideoCard } from "@/components/learn/VideoCard";
import { DEVOTION_MANTRAS, DEVOTION_VIDEOS, FEATURED_MANTRA } from "@/lib/personal-development/devotion-data";

export function DevotionPage() {
  return (
    <div>
      <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_85%,transparent)]">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-4 py-4 sm:px-6">
          <LearnBackNav href="/learn/personal-development" labelKey="learn.backPersonalDevelopment" />
        </div>
      </div>

      <div className="relative overflow-hidden border-b border-[var(--border)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--glow)] blur-3xl"
        />
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
            Personal Development
          </span>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--text)] sm:text-4xl">Devotion</h1>
          <p className="mt-2 max-w-lg text-[var(--muted)]">A space for prayer, reflection, and spiritual practice.</p>
          <div className="mt-6 flex w-fit items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-2">
            <span className="font-mono text-xl font-bold text-[var(--accent)]">{DEVOTION_VIDEOS.length}</span>
            <span className="text-sm text-[var(--muted)]">video</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <section aria-labelledby="featured-mantra-heading">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-[var(--accent)]">Daily prayer</p>
              <h2 id="featured-mantra-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
                Featured mantra
              </h2>
            </div>
            <span className="rounded-full border border-[var(--border)] bg-[var(--elevated)] px-3 py-1 text-xs font-medium text-[var(--muted)]">
              {FEATURED_MANTRA.deity}
            </span>
          </div>

          <div className="mt-4 overflow-hidden rounded-2xl border border-[color-mix(in_oklab,var(--accent)_34%,var(--border))] bg-[color-mix(in_oklab,var(--accent)_8%,var(--surface))] p-6 sm:p-8">
            <p className="text-sm font-medium text-[var(--accent)]">{FEATURED_MANTRA.title}</p>
            <p className="mt-4 whitespace-pre-line font-serif text-2xl leading-relaxed text-[var(--text)] sm:text-3xl">
              {FEATURED_MANTRA.sanskrit}
            </p>
            <p className="mt-5 text-base italic leading-relaxed text-[var(--muted)]">{FEATURED_MANTRA.transliteration}</p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{FEATURED_MANTRA.meaning}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--muted)]">
              <span className="font-medium text-[var(--text)]">नेपाली अर्थ: </span>
              {FEATURED_MANTRA.nepaliMeaning}
            </p>
          </div>
        </section>

        <section className="mt-12" aria-labelledby="more-mantras-heading">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">Prayer collection</p>
            <h2 id="more-mantras-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
              More mantras
            </h2>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {DEVOTION_MANTRAS.map((mantra) => (
              <article key={mantra.title} className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold text-[var(--text)]">{mantra.title}</h3>
                  <span className="shrink-0 rounded-full bg-[var(--elevated)] px-2.5 py-1 text-xs text-[var(--muted)]">{mantra.deity}</span>
                </div>
                <p className="mt-4 whitespace-pre-line font-serif text-lg leading-relaxed text-[var(--text)]">{mantra.sanskrit}</p>
                <p className="mt-4 text-sm italic leading-relaxed text-[var(--muted)]">{mantra.transliteration}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{mantra.meaning}</p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                  <span className="font-medium text-[var(--text)]">नेपाली अर्थ: </span>
                  {mantra.nepaliMeaning}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-12" aria-labelledby="devotion-videos-heading">
          <div>
            <p className="text-sm font-medium text-[var(--accent)]">Listen and reflect</p>
            <h2 id="devotion-videos-heading" className="mt-1 text-2xl font-semibold tracking-tight text-[var(--text)]">
              Devotion videos
            </h2>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEVOTION_VIDEOS.map((v, i) => (
              <VideoCard key={v.id} v={v} index={i} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
