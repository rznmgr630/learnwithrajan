export function DSATwoSumDiagram() {
  const nums = [2, 7, 11, 15];
  const target = 9;
  const boxW = 52;
  const boxH = 44;
  const gap = 12;
  const totalW = nums.length * boxW + (nums.length - 1) * gap;
  const svgW = totalW + 40;
  const svgH = 160;
  const startX = 20;
  const boxY = 24;

  return (
    <figure className="mt-4 overflow-x-auto rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] p-5">
      <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--muted)]">Visual — Two Sum</p>
      <div className="flex flex-col items-center gap-4">
        {/* Target */}
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text)]">
          <span className="rounded bg-[var(--elevated)] px-2 py-0.5 font-mono text-xs text-[var(--muted)]">target</span>
          <span className="font-mono text-[var(--accent)]">= {target}</span>
        </div>

        {/* SVG array + arrows */}
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          width={svgW}
          height={svgH}
          className="overflow-visible"
          aria-label="Array diagram showing nums[0]=2 and nums[1]=7 sum to 9"
        >
          {nums.map((val, i) => {
            const x = startX + i * (boxW + gap);
            const isMatch = i === 0 || i === 1;
            return (
              <g key={i}>
                {/* Box */}
                <rect
                  x={x}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  rx={8}
                  ry={8}
                  fill={isMatch ? "color-mix(in oklab, var(--accent) 15%, transparent)" : "color-mix(in oklab, var(--elevated) 60%, transparent)"}
                  stroke={isMatch ? "var(--accent)" : "var(--border)"}
                  strokeWidth={isMatch ? 1.5 : 1}
                />
                {/* Value */}
                <text
                  x={x + boxW / 2}
                  y={boxY + boxH / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={18}
                  fontWeight={isMatch ? 700 : 400}
                  fill={isMatch ? "var(--accent)" : "var(--text)"}
                  fontFamily="ui-monospace, monospace"
                >
                  {val}
                </text>
                {/* Index */}
                <text
                  x={x + boxW / 2}
                  y={boxY + boxH + 16}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={11}
                  fill="var(--muted)"
                  fontFamily="ui-monospace, monospace"
                >
                  [{i}]
                </text>
              </g>
            );
          })}

          {/* Bracket / arc under index 0 and 1 */}
          {(() => {
            const x0 = startX + boxW / 2;
            const x1 = startX + (boxW + gap) + boxW / 2;
            const arcY = boxY + boxH + 36;
            const midX = (x0 + x1) / 2;
            return (
              <g>
                <path
                  d={`M ${x0} ${boxY + boxH + 22} L ${x0} ${arcY} L ${x1} ${arcY} L ${x1} ${boxY + boxH + 22}`}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth={1.5}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={0.7}
                />
                <text
                  x={midX}
                  y={arcY + 18}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={12}
                  fill="var(--accent)"
                  fontFamily="ui-monospace, monospace"
                  fontWeight={600}
                >
                  2 + 7 = 9 ✓
                </text>
                <text
                  x={midX}
                  y={arcY + 34}
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

        {/* Hash map trace */}
        <div className="w-full max-w-xs">
          <p className="mb-2 text-xs font-medium text-[var(--muted)]">Hash map trace (O(1) lookup)</p>
          <div className="overflow-hidden rounded-lg border border-[var(--border)] text-xs font-mono">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)]">
                  <th className="px-3 py-2 text-left text-[var(--muted)]">i</th>
                  <th className="px-3 py-2 text-left text-[var(--muted)]">nums[i]</th>
                  <th className="px-3 py-2 text-left text-[var(--muted)]">complement</th>
                  <th className="px-3 py-2 text-left text-[var(--muted)]">in map?</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { i: 0, val: 2, comp: 7, found: "No → store 2→0" },
                  { i: 1, val: 7, comp: 2, found: "Yes! → [0, 1]" },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className={
                      idx % 2 === 0
                        ? "border-b border-[var(--border)]"
                        : "border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_30%,transparent)]"
                    }
                  >
                    <td className="px-3 py-2 text-[var(--text)]">{row.i}</td>
                    <td className="px-3 py-2 text-[var(--text)]">{row.val}</td>
                    <td className="px-3 py-2 text-[var(--accent)]">{row.comp}</td>
                    <td className={`px-3 py-2 ${row.found.includes("Yes") ? "font-semibold text-emerald-500" : "text-[var(--muted)]"}`}>
                      {row.found}
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
