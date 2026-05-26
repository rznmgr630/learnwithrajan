export function DSAStockProfitDiagram() {
  const prices = [7, 1, 5, 3, 6, 4];
  const buyIdx = 1;   // price = 1  (min)
  const sellIdx = 4;  // price = 6  (max profit)
  const maxProfit = prices[sellIdx] - prices[buyIdx];

  const chartH = 120;
  const barW = 36;
  const barGap = 12;
  const chartPaddingX = 24;
  const maxVal = Math.max(...prices);
  const svgW = prices.length * (barW + barGap) - barGap + chartPaddingX * 2;
  const svgH = chartH + 48;

  const steps = prices.map((price, i) => {
    const minSoFar = Math.min(...prices.slice(0, i + 1));
    const profitSoFar = price - minSoFar;
    return { price, minSoFar, profitSoFar };
  });

  return (
    <figure className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-5 py-3">
        <span className="text-xs font-medium text-[var(--muted)]">prices = [7, 1, 5, 3, 6, 4]</span>
        <div className="flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/8 px-3 py-1">
          <span className="font-mono text-xs text-[var(--faint)]">max profit</span>
          <span className="font-mono text-sm font-bold text-[var(--accent)]">= {maxProfit}</span>
        </div>
      </div>

      <div className="flex flex-col gap-8 px-5 py-8">
        {/* Bar chart */}
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">Price chart</p>
          <div className="flex justify-center">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} width={svgW} height={svgH} className="overflow-visible">
              {prices.map((price, i) => {
                const x = chartPaddingX + i * (barW + barGap);
                const barH = Math.round((price / maxVal) * chartH);
                const y = chartH - barH;
                const isBuy = i === buyIdx;
                const isSell = i === sellIdx;

                return (
                  <g key={i}>
                    {/* Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barW}
                      height={barH}
                      rx={6}
                      fill={
                        isBuy
                          ? "color-mix(in oklab, var(--accent) 30%, transparent)"
                          : isSell
                            ? "color-mix(in oklab, #34d399 30%, transparent)"
                            : "color-mix(in oklab, var(--elevated) 80%, transparent)"
                      }
                      stroke={
                        isBuy
                          ? "var(--accent)"
                          : isSell
                            ? "#34d399"
                            : "var(--border)"
                      }
                      strokeWidth={isBuy || isSell ? 1.5 : 1}
                    />

                    {/* Price label on top */}
                    <text
                      x={x + barW / 2}
                      y={y - 6}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={isBuy || isSell ? 700 : 400}
                      fill={isBuy ? "var(--accent)" : isSell ? "#34d399" : "var(--muted)"}
                      fontFamily="ui-monospace, monospace"
                    >
                      {price}
                    </text>

                    {/* Day label */}
                    <text
                      x={x + barW / 2}
                      y={chartH + 16}
                      textAnchor="middle"
                      fontSize={10}
                      fill={isBuy || isSell ? "var(--text)" : "var(--faint)"}
                      fontFamily="ui-monospace, monospace"
                    >
                      d{i}
                    </text>

                    {/* Buy / Sell tag */}
                    {(isBuy || isSell) && (
                      <text
                        x={x + barW / 2}
                        y={chartH + 30}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight={700}
                        fill={isBuy ? "var(--accent)" : "#34d399"}
                        fontFamily="ui-sans-serif, system-ui, sans-serif"
                      >
                        {isBuy ? "BUY" : "SELL"}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Arrow from buy to sell */}
              {(() => {
                const x0 = chartPaddingX + buyIdx * (barW + barGap) + barW / 2;
                const x1 = chartPaddingX + sellIdx * (barW + barGap) + barW / 2;
                const yBuy = chartH - Math.round((prices[buyIdx] / maxVal) * chartH) - 10;
                const ySell = chartH - Math.round((prices[sellIdx] / maxVal) * chartH) - 10;
                const midY = Math.min(yBuy, ySell) - 18;
                return (
                  <g opacity={0.7}>
                    <path
                      d={`M ${x0} ${yBuy} C ${x0} ${midY}, ${x1} ${midY}, ${x1} ${ySell}`}
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                    <polygon
                      points={`${x1},${ySell} ${x1 - 4},${ySell - 8} ${x1 + 4},${ySell - 8}`}
                      fill="var(--accent)"
                    />
                  </g>
                );
              })()}
            </svg>
          </div>
        </div>

        {/* One-pass trace table */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-widest text-[var(--faint)]">
            One-pass greedy trace
          </p>
          <div className="overflow-hidden rounded-xl border border-[var(--border)]">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
                  {["Day", "Price", "Min so far", "Profit if sold", "Max profit"].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {steps.map((step, i) => {
                  const isBuy = i === buyIdx;
                  const isSell = i === sellIdx;
                  const runningMax = Math.max(...steps.slice(0, i + 1).map((s) => s.profitSoFar));
                  return (
                    <tr
                      key={i}
                      className={`border-b border-[var(--border)] last:border-0 ${
                        isSell
                          ? "bg-[color-mix(in_oklab,#34d399_7%,transparent)]"
                          : isBuy
                            ? "bg-[color-mix(in_oklab,var(--accent)_7%,transparent)]"
                            : i % 2 === 1
                              ? "bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)]"
                              : ""
                      }`}
                    >
                      <td className="px-4 py-2.5 text-[var(--faint)]">{i}</td>
                      <td className={`px-4 py-2.5 font-bold ${isBuy ? "text-[var(--accent)]" : isSell ? "text-emerald-400" : "text-[var(--text)]"}`}>
                        {step.price}
                        {isBuy && <span className="ml-1.5 text-[10px] font-normal text-[var(--accent)]">← min</span>}
                        {isSell && <span className="ml-1.5 text-[10px] font-normal text-emerald-400">← sell here</span>}
                      </td>
                      <td className="px-4 py-2.5 text-[var(--muted)]">{step.minSoFar}</td>
                      <td className={`px-4 py-2.5 ${step.profitSoFar === maxProfit ? "font-bold text-emerald-400" : "text-[var(--muted)]"}`}>
                        {step.profitSoFar}
                      </td>
                      <td className="px-4 py-2.5 font-semibold text-[var(--accent)]">{runningMax}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-[var(--faint)]">
            Buy at day {buyIdx} (price = {prices[buyIdx]}), sell at day {sellIdx} (price = {prices[sellIdx]}) →{" "}
            <span className="font-semibold text-emerald-400">profit = {maxProfit}</span>
          </p>
        </div>
      </div>
    </figure>
  );
}
