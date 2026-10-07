"use client";

import Link from "next/link";

export default function ErrorPage({ reset }: Readonly<{ reset: () => void }>) {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-16">
      <section className="max-w-md rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-xl">
        <p className="text-sm font-medium text-[var(--accent)]">Something went wrong</p>
        <h1 className="mt-3 text-2xl font-semibold text-[var(--text)]">This page could not load.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)]">Try again. If the problem continues, return home and try another section.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="rounded-xl bg-[var(--accent)] px-4 py-2.5 text-sm font-semibold text-[var(--accent-fg)]">
            Try again
          </button>
          <Link href="/" className="rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--text)]">
            Go home
          </Link>
        </div>
      </section>
    </main>
  );
}
