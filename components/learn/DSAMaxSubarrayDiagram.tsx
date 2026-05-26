export function DSAMaxSubarrayDiagram() {
  const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  // Kadane's trace
  const trace = nums.reduce<{ current: number; maxSum: number }[]>((acc, num, i) => {
    if (i === 0) return [{ current: num, maxSum: num }];
    const prev = acc[i - 1];
    const current = Math.max(num, prev.current + num);
    const maxSum = Math.max(prev.maxSum, current);
    return [...acc, { current, maxSum }];
  }, []);

  // Best subarray = [4, -1, 2, 1] → indices 3–6
  const subStart = 3;
  const subEnd = 6;
  const maxVal = Math.max(...nums.map(Math.abs));
  const chartH = 100;
  const barW = 28;
  const barGap = 8;
  const paddingX = 16;
  const svgW = nums.length * (barW + barGap) - barGap + paddingX * 2;
  const svgH = chartH + 60;
  const zeroY = chartH * 0.55; // zero line position

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-5 py-3">
        <span className="text-xs font-medium text-[var(--muted)]">nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]</span>
        <div className="flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-3 py-1">
          <span className="font-mono text-xs text-[var(--faint)]">max sum</span>
          <span className="font-mono text-sm font-bold text-[var(--accent)]">= 6</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-5 py-8">
        {/* Bar chart */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">
            Array values — winning subarray highlighted
          </p>
          <div className="flex justify-center overflow-x-auto">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="overflow-visible">
              {/* Zero baseline */}
              <line
                x1={paddingX - 6}
                y1={zeroY}
                x2={svgW - paddingX + 6}
                y2={zeroY}
                stroke="var(--border)"
                strokeWidth={1}
                strokeDasharray="3 3"
              />
              <text x={paddingX - 8} y={zeroY + 4} textAnchor="end" fontSize={9} fill="var(--faint)" fontFamily="ui-monospace, monospace">0</text>

              {/* Highlight band behind winning subarray */}
              {(() => {
                const x1 = paddingX + subStart * (barW + barGap) - 4;
                const x2 = paddingX + subEnd * (barW + barGap) + barW + 4;
                return (
                  <rect
                    x={x1} y={0} width={x2 - x1} height={zeroY + 10}
                    rx={8}
                    fill="color-mix(in oklab, var(--accent) 7%, transparent)"
                    stroke="var(--accent)"
                    strokeWidth={1}
                    strokeDasharray="4 3"
                    opacity={0.7}
                  />
                );
              })()}

              {nums.map((val, i) => {
                const x = paddingX + i * (barW + barGap);
                const inSub = i >= subStart && i <= subEnd;
                const isNeg = val < 0;
                const barH = Math.abs(Math.round((val / maxVal) * (zeroY * 0.85)));
                const barY = isNeg ? zeroY : zeroY - barH;

                return (
                  <g key={i}>
                    <rect
                      x={x} y={barY} width={barW} height={barH || 2} rx={4}
                      fill={
                        inSub && !isNeg
                          ? "color-mix(in oklab, var(--accent) 35%, transparent)"
                          : inSub && isNeg
                            ? "color-mix(in oklab, var(--accent) 18%, transparent)"
                            : isNeg
                              ? "color-mix(in oklab, #f43f5e 20%, transparent)"
                              : "color-mix(in oklab, var(--elevated) 80%, transparent)"
                      }
                      stroke={
                        inSub ? "var(--accent)" : isNeg ? "#f43f5e44" : "var(--border)"
                      }
                      strokeWidth={inSub ? 1.5 : 1}
                    />
                    {/* Value label */}
                    <text
                      x={x + barW / 2}
                      y={isNeg ? barY + barH + 11 : barY - 5}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={inSub ? 700 : 400}
                      fill={inSub ? "var(--accent)" : isNeg ? "#f87171" : "var(--muted)"}
                      fontFamily="ui-monospace, monospace"
                    >
                      {val}
                    </text>
                    {/* Index */}
                    <text
                      x={x + barW / 2}
                      y={zeroY + 22}
                      textAnchor="middle"
                      fontSize={9}
                      fill={inSub ? "var(--text)" : "var(--faint)"}
                      fontFamily="ui-monospace, monospace"
                    >
                      {i}
                    </text>
                  </g>
                );
              })}

              {/* "max subarray" label */}
              {(() => {
                const labelX = paddingX + subStart * (barW + barGap) + ((subEnd - subStart + 1) * (barW + barGap) - barGap) / 2;
                return (
                  <text
                    x={labelX} y={svgH - 6}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight={600}
                    fill="var(--accent)"
                    fontFamily="ui-monospace, monospace"
                  >
                    [4, -1, 2, 1] = 6
                  </text>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* Kadane trace table */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">
            Kadane's algorithm trace — O(n) one pass
          </p>
          <div className="overflow-x-auto">
            <div className="overflow-hidden rounded-xl border border-[var(--border)]">
              <table className="w-full border-collapse text-xs font-mono">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
                    {["i", "nums[i]", "current", "maxSum", "Note"].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-medium text-[var(--faint)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {trace.map((row, i) => {
                    const inSub = i >= subStart && i <= subEnd;
                    const isNewMax = i > 0 && row.maxSum > trace[i - 1].maxSum;
                    return (
                      <tr
                        key={i}
                        className={`border-b border-[var(--border)] last:border-0 ${
                          inSub
                            ? "bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]"
                            : i % 2 === 1
                              ? "bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)]"
                              : ""
                        }`}
                      >
                        <td className="px-3 py-2 text-[var(--faint)]">{i}</td>
                        <td className={`px-3 py-2 font-bold ${nums[i] < 0 ? "text-rose-400" : "text-[var(--text)]"}`}>
                          {nums[i]}
                        </td>
                        <td className={`px-3 py-2 ${inSub ? "font-bold text-[var(--accent)]" : "text-[var(--muted)]"}`}>
                          {row.current}
                        </td>
                        <td className={`px-3 py-2 font-semibold ${isNewMax ? "text-emerald-400" : "text-[var(--muted)]"}`}>
                          {row.maxSum}
                          {isNewMax && <span className="ml-1 text-[10px]">↑</span>}
                        </td>
                        <td className="px-3 py-2 text-[var(--faint)]">
                          {i === 0
                            ? "start"
                            : row.current === nums[i]
                              ? <span className="text-[var(--accent)]">reset (start fresh)</span>
                              : inSub && isNewMax
                                ? <span className="text-emerald-400">new max ✓</span>
                                : "extend"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-3 text-xs text-[var(--faint)]">
            Key insight: at each step, decide whether to <span className="text-[var(--accent)]">extend</span> the current subarray
            or <span className="text-[var(--accent)]">start fresh</span> at the current element.
          </p>
        </div>
      </div>
    </figure>
  );
}
