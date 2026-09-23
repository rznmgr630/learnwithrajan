const codeLines = [
  { width: "w-24", tone: "bg-violet-400/80" },
  { width: "w-44", tone: "bg-sky-400/70" },
  { width: "w-36", tone: "bg-emerald-400/70" },
  { width: "w-28", tone: "bg-amber-400/70" },
];

export function CodeLoader() {
  return (
    <div
      className="flex min-h-[60vh] items-center justify-center px-4"
      role="status"
      aria-live="polite"
      aria-label="Loading course"
    >
      <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_94%,transparent)] shadow-2xl shadow-black/10">
        <div className="flex items-center gap-1.5 border-b border-[var(--border)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[10px] text-[var(--faint)]">course.tsx</span>
        </div>

        <div className="space-y-3 p-5 font-mono">
          {codeLines.map((line, index) => (
            <div
              key={line.width}
              className="flex items-center gap-3 motion-safe:animate-pulse"
              style={{ animationDelay: `${index * 140}ms` }}
            >
              <span className="w-4 text-right text-[10px] tabular-nums text-[var(--faint)]">{index + 1}</span>
              <span className={`h-2 rounded-full ${line.width} ${line.tone}`} />
            </div>
          ))}

          <div className="flex items-center gap-3">
            <span className="w-4 text-right text-[10px] tabular-nums text-[var(--faint)]">5</span>
            <span className="h-4 w-2 bg-[var(--accent)] motion-safe:animate-pulse" />
          </div>
        </div>

        <p className="border-t border-[var(--border)] px-5 py-3 font-mono text-xs text-[var(--muted)]">
          Loading course...
        </p>
      </div>
    </div>
  );
}
