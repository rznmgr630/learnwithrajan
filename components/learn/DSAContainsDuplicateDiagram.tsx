export function DSAContainsDuplicateDiagram() {
  const nums = [1, 2, 3, 1];
  const steps = [
    { num: 1, setAfter: [1],       duplicate: false },
    { num: 2, setAfter: [1, 2],    duplicate: false },
    { num: 3, setAfter: [1, 2, 3], duplicate: false },
    { num: 1, setAfter: [1, 2, 3], duplicate: true  },
  ];

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-5 py-3">
        <span className="text-xs font-medium text-[var(--muted)]">Visual walkthrough — nums = [1, 2, 3, 1]</span>
        <span className="rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 font-mono text-xs font-semibold text-rose-400">
          Duplicate found ✓
        </span>
      </div>

      <div className="flex flex-col gap-8 px-5 py-8">
        {/* Input array */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">Input array</p>
          <div className="flex flex-wrap gap-2">
            {nums.map((n, i) => {
              const isDup = i === nums.lastIndexOf(n) && nums.indexOf(n) !== i;
              return (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border font-mono text-base font-bold ${
                      isDup
                        ? "border-rose-500/50 bg-rose-500/15 text-rose-400"
                        : "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] text-[var(--text)]"
                    }`}
                  >
                    {n}
                  </div>
                  <span className="font-mono text-[10px] text-[var(--faint)]">[{i}]</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Set trace */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">Hash set trace</p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
                  {["Step", "num", "In set?", "Action", "Set state"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((step, i) => (
                  <tr
                    key={i}
                    className={`border-b border-[var(--border)] last:border-0 ${
                      step.duplicate
                        ? "bg-[color-mix(in_oklab,#f43f5e_8%,transparent)]"
                        : i % 2 === 1
                          ? "bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)]"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 text-[var(--faint)]">{i + 1}</td>
                    <td className={`px-4 py-2.5 font-bold ${step.duplicate ? "text-rose-400" : "text-[var(--accent)]"}`}>
                      {step.num}
                    </td>
                    <td className={`px-4 py-2.5 font-semibold ${step.duplicate ? "text-rose-400" : "text-[var(--faint)]"}`}>
                      {step.duplicate ? "Yes! 🔴" : "No"}
                    </td>
                    <td className="px-4 py-2.5 text-[var(--muted)]">
                      {step.duplicate
                        ? <span className="font-semibold text-rose-400">return true</span>
                        : <span>add <span className="text-[var(--accent)]">{step.num}</span> to set</span>
                      }
                    </td>
                    <td className="px-4 py-2.5 text-[var(--muted)]">
                      {"{" + step.setAfter.join(", ") + "}"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--faint)]">
            At step 4, <span className="font-mono font-semibold text-rose-400">1</span> is already in the set →{" "}
            <span className="font-semibold text-rose-400">return true</span> immediately (early exit).
          </p>
        </div>
      </div>
    </figure>
  );
}
