export function DSATwoSumDiagram() {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const boxW = 64;
  const boxH = 52;
  const gap = 16;
  const totalW = nums.length * boxW + (nums.length - 1) * gap;
  const svgW = totalW + 48;
  const svgH = 172;
  const startX = 24;
  const boxY = 20;

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-5 py-3">
        <span className="text-xs font-medium text-[var(--muted)]">Visual walkthrough — nums = [2, 7, 11, 15]</span>
        <div className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_80%,transparent)] px-3 py-1">
          <span className="font-mono text-xs text-[var(--faint)]">target</span>
          <span className="font-mono text-sm font-bold text-[var(--accent)]">= {target}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-8 px-5 py-8">
        {/* Array SVG */}
        <div className="w-full overflow-x-auto">
          <div className="flex justify-center">
            <svg
              viewBox={`0 0 ${svgW} ${svgH}`}
              width={svgW}
              height={svgH}
              className="overflow-visible"
              aria-label="Array [2, 7, 11, 15] — nums[0] and nums[1] highlighted"
            >
              {/* Glow behind matched boxes */}
              <rect
                x={startX - 4}
                y={boxY - 4}
                width={boxW * 2 + gap + 8}
                height={boxH + 8}
                rx={14}
                fill="color-mix(in oklab, var(--accent) 8%, transparent)"
              />

              {nums.map((val, i) => {
                const x = startX + i * (boxW + gap);
                const isMatch = i === 0 || i === 1;
                return (
                  <g key={i}>
                    <rect
                      x={x}
                      y={boxY}
                      width={boxW}
                      height={boxH}
                      rx={10}
                      fill={
                        isMatch
                          ? "color-mix(in oklab, var(--accent) 18%, transparent)"
                          : "color-mix(in oklab, var(--elevated) 50%, transparent)"
                      }
                      stroke={isMatch ? "var(--accent)" : "var(--border)"}
                      strokeWidth={isMatch ? 1.5 : 1}
                    />
                    {/* Value */}
                    <text
                      x={x + boxW / 2}
                      y={boxY + boxH / 2}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={20}
                      fontWeight={isMatch ? 700 : 400}
                      fill={isMatch ? "var(--accent)" : "var(--text)"}
                      fontFamily="ui-monospace, monospace"
                    >
                      {val}
                    </text>
                    {/* Index label */}
                    <text
                      x={x + boxW / 2}
                      y={boxY + boxH + 18}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={11}
                      fill="var(--faint)"
                      fontFamily="ui-monospace, monospace"
                    >
                      [{i}]
                    </text>
                  </g>
                );
              })}

              {/* Bracket under [0] and [1] */}
              {(() => {
                const x0 = startX + boxW / 2;
                const x1 = startX + (boxW + gap) + boxW / 2;
                const arcY = boxY + boxH + 38;
                const midX = (x0 + x1) / 2;
                return (
                  <g opacity={0.85}>
                    <path
                      d={`M ${x0} ${boxY + boxH + 24} L ${x0} ${arcY} L ${x1} ${arcY} L ${x1} ${boxY + boxH + 24}`}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <text
                      x={midX}
                      y={arcY + 20}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={13}
                      fontWeight={700}
                      fill="var(--accent)"
                      fontFamily="ui-monospace, monospace"
                    >
                      2 + 7 = 9 ✓
                    </text>
                    <text
                      x={midX}
                      y={arcY + 38}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize={11}
                      fill="var(--muted)"
                      fontFamily="ui-monospace, monospace"
                    >
                      → return [0, 1]
                    </text>
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Hash map step-by-step trace */}
        <div className="w-full max-w-md">
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">
            Hash map trace — O(1) lookup per step
          </p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
                  {["i", "nums[i]", "complement", "in map?"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { i: 0, val: 2, comp: 7, found: false, note: "store 2 → 0" },
                  { i: 1, val: 7, comp: 2, found: true, note: "→ [0, 1] 🎯" },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-[var(--border)] last:border-0 transition ${
                      row.found
                        ? "bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]"
                        : idx % 2 === 1
                          ? "bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)]"
                          : ""
                    }`}
                  >
                    <td className="px-4 py-2.5 text-[var(--muted)]">{row.i}</td>
                    <td className="px-4 py-2.5 font-bold text-[var(--text)]">{row.val}</td>
                    <td className="px-4 py-2.5 text-[var(--accent)]">{row.comp}</td>
                    <td className={`px-4 py-2.5 font-semibold ${row.found ? "text-emerald-400" : "text-[var(--faint)]"}`}>
                      {row.found ? row.note : `No — ${row.note}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </figure>
  );
}
