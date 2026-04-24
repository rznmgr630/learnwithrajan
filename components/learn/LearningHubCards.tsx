"use client";

import Link from "next/link";
import { useBackend30Progress } from "@/hooks/use-backend-30-progress";
import { TOTAL_DAYS } from "@/lib/challenge-data";

export function LearningHubCards() {
  const { completedCount, percent } = useBackend30Progress();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <Link
        href="/learn/backend-30-days"
        className="group flex flex-col rounded-2xl border border-neutral-800 bg-neutral-900/50 p-5 text-left shadow-sm transition hover:border-sky-500/40 hover:bg-neutral-900"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-neutral-100 group-hover:text-sky-300">
              Backend in 30 days
            </h2>
            <p className="mt-1 text-sm text-neutral-500">Advanced roadmap · weeks & day cards</p>
          </div>
          <span
            className="rounded-full bg-neutral-800 px-2.5 py-1 text-xs font-semibold tabular-nums text-sky-300"
            suppressHydrationWarning
          >
            {percent}%
          </span>
        </div>
        <div className="mt-6" suppressHydrationWarning>
          <div className="flex items-center justify-between text-xs text-neutral-500">
            <span>Progress</span>
            <span className="tabular-nums text-neutral-400">
              {completedCount}/{TOTAL_DAYS} days
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-500 to-violet-500 transition-[width] duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <span className="mt-6 text-sm font-medium text-sky-400 transition group-hover:text-sky-300">
          Open roadmap →
        </span>
      </Link>
    </div>
  );
}
