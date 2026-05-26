export function DSAValidParenthesesDiagram() {
  const input = "()[]{}"as const;
  const chars = input.split("");

  const steps = [
    { ch: "(", action: "push", stack: ["("],       match: null,  valid: null },
    { ch: ")", action: "pop",  stack: [],           match: "(",   valid: true },
    { ch: "[", action: "push", stack: ["["],        match: null,  valid: null },
    { ch: "]", action: "pop",  stack: [],           match: "[",   valid: true },
    { ch: "{", action: "push", stack: ["{"],        match: null,  valid: null },
    { ch: "}", action: "pop",  stack: [],           match: "{",   valid: true },
  ] as const;

  const OPEN = new Set(["(", "[", "{"]);

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-5 py-3">
        <span className="text-xs font-medium text-[var(--muted)]">Visual walkthrough — s = "()[]{}"</span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-400">
          Valid ✓
        </span>
      </div>

      <div className="flex flex-col gap-8 px-5 py-8">
        {/* Input string boxes */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">Input string</p>
          <div className="flex flex-wrap gap-2">
            {chars.map((ch, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-base font-bold transition ${
                    OPEN.has(ch)
                      ? "border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--accent)_12%,transparent)] text-[var(--accent)]"
                      : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                  }`}
                >
                  {ch}
                </div>
                <span className="font-mono text-[10px] text-[var(--faint)]">[{i}]</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--faint)]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border border-[var(--accent)]/40 bg-[color-mix(in_oklab,var(--accent)_12%,transparent)]" />
              Opening bracket → push
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded border border-emerald-500/40 bg-emerald-500/10" />
              Closing bracket → pop &amp; match
            </span>
          </div>
        </div>

        {/* Stack trace table */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">
            Stack trace — LIFO
          </p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
                  {["Step", "Char", "Action", "Stack after", "Result"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((step, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--border)] last:border-0 ${
                      step.valid === true
                        ? "bg-[color-mix(in_oklab,var(--accent)_5%,transparent)]"
                        : i % 2 === 1
                          ? "bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)]"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 text-[var(--faint)]">{i + 1}</td>
                    <td className={`px-4 py-2.5 font-bold ${OPEN.has(step.ch) ? "text-[var(--accent)]" : "text-emerald-400"}`}>
                      {step.ch}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--muted)]">
                      {step.action === "push" ? (
                        <span>push <span className="text-[var(--accent)]">{step.ch}</span></span>
                      ) : (
                        <span>pop → matched <span className="text-emerald-400">{step.match}</span></span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--text)]">
                      {step.stack.length > 0 ? `[${step.stack.join(", ")}]` : (
                        <span className="text-[var(--faint)]">[ ] empty</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-semibold">
                      {step.valid === true ? (
                        <span className="text-emerald-400">match ✓</span>
                      ) : (
                        <span className="text-[var(--faint)]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--faint)]">
            Stack is empty at the end → all brackets matched → <span className="font-semibold text-emerald-400">return true</span>
          </p>
        </div>
      </div>
    </figure>
  );
}
