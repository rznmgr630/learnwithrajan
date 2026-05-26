"use client";

import { useEffect } from "react";

export type FundamentalTopicId = "big-o" | "space-complexity";

interface Section {
  heading: string;
  body: React.ReactNode;
}

/* ─── Content ─────────────────────────────────────────────────────────────── */

const COMPLEXITIES = [
  { notation: "O(1)",      name: "Constant",      example: "Array index access",        color: "text-emerald-400",  bar: "w-[4%]",   barColor: "bg-emerald-500" },
  { notation: "O(log n)",  name: "Logarithmic",   example: "Binary search",             color: "text-teal-400",     bar: "w-[10%]",  barColor: "bg-teal-500" },
  { notation: "O(n)",      name: "Linear",        example: "Linear scan / hash map",    color: "text-sky-400",      bar: "w-[25%]",  barColor: "bg-sky-500" },
  { notation: "O(n log n)",name: "Linearithmic",  example: "Merge sort, heap sort",     color: "text-yellow-400",   bar: "w-[45%]",  barColor: "bg-yellow-500" },
  { notation: "O(n²)",     name: "Quadratic",     example: "Nested loops, bubble sort", color: "text-orange-400",   bar: "w-[70%]",  barColor: "bg-orange-500" },
  { notation: "O(2ⁿ)",     name: "Exponential",   example: "Recursive Fibonacci",       color: "text-rose-400",     bar: "w-[90%]",  barColor: "bg-rose-500" },
];

const RULES = [
  { rule: "Drop constants",        bad: "O(2n)",      good: "O(n)",   why: "Constant multipliers don't change the growth trend." },
  { rule: "Drop lower-order terms",bad: "O(n² + n)",  good: "O(n²)",  why: "The dominant term dominates as n → ∞." },
  { rule: "Different inputs = different variables", bad: "O(n)", good: "O(a + b)", why: "Two independent arrays need separate variables." },
];

const SPACE_EXAMPLES = [
  { complexity: "O(1)",  example: "Two Sum — two variables (min, max)",              color: "text-emerald-400" },
  { complexity: "O(n)",  example: "Contains Duplicate — Set of n elements",         color: "text-sky-400" },
  { complexity: "O(n)",  example: "Valid Parentheses — Stack grows up to n",        color: "text-sky-400" },
  { complexity: "O(n²)", example: "2-D DP table — grid of n × n cells",            color: "text-orange-400" },
  { complexity: "O(n)",  example: "Recursive calls — call stack up to n deep",     color: "text-yellow-400" },
];

function InlineCode({ children }: { children: string }) {
  return (
    <code className="rounded border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)] px-1.5 py-0.5 font-mono text-sm text-[var(--accent)]">
      {children}
    </code>
  );
}

function SectionBlock({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">{heading}</h3>
      {children}
    </div>
  );
}

const BIG_O_CONTENT: Section[] = [
  {
    heading: "What is Big O?",
    body: (
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        Big O notation describes how an algorithm's <strong className="text-[var(--text)]">runtime or resource usage grows</strong> relative
        to the input size <InlineCode>n</InlineCode>. It captures the <em>worst-case</em> behaviour and ignores constants — we care
        about the shape of the curve, not the exact number of operations.
      </p>
    ),
  },
  {
    heading: "Common complexities",
    body: (
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
              <th className="px-4 py-2.5 text-left font-mono text-xs font-medium text-[var(--faint)]">Notation</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--faint)]">Name</th>
              <th className="hidden px-4 py-2.5 text-left text-xs font-medium text-[var(--faint)] sm:table-cell">Example</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-[var(--faint)]">Growth</th>
            </tr>
          </thead>
          <tbody>
            {COMPLEXITIES.map((row, i) => (
              <tr key={i} className={`border-b border-[var(--border)] last:border-0 ${i % 2 === 1 ? "bg-[color-mix(in_oklab,var(--elevated)_20%,transparent)]" : ""}`}>
                <td className={`px-4 py-2.5 font-mono text-sm font-bold ${row.color}`}>{row.notation}</td>
                <td className="px-4 py-2.5 text-xs text-[var(--muted)]">{row.name}</td>
                <td className="hidden px-4 py-2.5 text-xs text-[var(--faint)] sm:table-cell">{row.example}</td>
                <td className="px-4 py-2.5">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--elevated)]">
                    <div className={`h-full rounded-full ${row.barColor} ${row.bar}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
  {
    heading: "How to read a function",
    body: (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
          <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-4 py-2">
            <span className="text-xs font-medium text-[var(--muted)]">JavaScript</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-sm text-[var(--text)]">{`function example(nums) {     // n = nums.length
  const seen = new Map();    // O(n) space
  for (const n of nums) {    // loop → O(n) time
    if (seen.has(n)) ...;    // O(1) per lookup
    seen.set(n, true);       // O(1) per insert
  }
}
// Overall: O(n) time, O(n) space`}</pre>
        </div>
        <p className="text-xs text-[var(--faint)]">
          Count loops (multiplied when nested), ignore single operations — they're O(1).
        </p>
      </div>
    ),
  },
  {
    heading: "Simplification rules",
    body: (
      <div className="flex flex-col gap-2">
        {RULES.map((r, i) => (
          <div key={i} className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-4">
            <p className="mb-2 text-xs font-semibold text-[var(--text)]">{r.rule}</p>
            <div className="flex items-center gap-2 font-mono text-sm">
              <span className="text-rose-400 line-through opacity-70">{r.bad}</span>
              <span className="text-[var(--faint)]">→</span>
              <span className="font-bold text-emerald-400">{r.good}</span>
            </div>
            <p className="mt-2 text-xs text-[var(--faint)]">{r.why}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "Quick reference — our problems so far",
    body: (
      <div className="overflow-hidden rounded-xl border border-[var(--border)]">
        <table className="w-full border-collapse text-xs font-mono">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_70%,transparent)]">
              <th className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">Problem</th>
              <th className="px-4 py-2.5 text-left font-medium text-[var(--faint)]">Time</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Two Sum",               "O(n)"],
              ["Valid Parentheses",     "O(n)"],
              ["Buy & Sell Stock",      "O(n)"],
              ["Contains Duplicate",   "O(n)"],
              ["Maximum Subarray",     "O(n)"],
            ].map(([name, time], i) => (
              <tr key={i} className={`border-b border-[var(--border)] last:border-0 ${i % 2 === 1 ? "bg-[color-mix(in_oklab,var(--elevated)_20%,transparent)]" : ""}`}>
                <td className="px-4 py-2.5 text-[var(--muted)]">{name}</td>
                <td className="px-4 py-2.5 font-bold text-emerald-400">{time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ),
  },
];

const SPACE_CONTENT: Section[] = [
  {
    heading: "What is space complexity?",
    body: (
      <p className="text-sm leading-relaxed text-[var(--muted)]">
        Space complexity measures how much <strong className="text-[var(--text)]">additional memory</strong> an algorithm uses
        relative to input size <InlineCode>n</InlineCode>. We usually track <em>auxiliary space</em> — memory the algorithm
        allocates itself, not counting the input.
      </p>
    ),
  },
  {
    heading: "Auxiliary vs total space",
    body: (
      <div className="flex flex-col gap-3">
        {[
          {
            label: "Auxiliary space",
            desc: "Extra memory allocated by the algorithm (variables, data structures, call stack).",
            color: "border-[var(--accent)]/30 bg-[color-mix(in_oklab,var(--accent)_6%,transparent)]",
          },
          {
            label: "Total space",
            desc: "Auxiliary space + the input itself. Usually we report auxiliary unless the problem says otherwise.",
            color: "border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]",
          },
        ].map((item) => (
          <div key={item.label} className={`rounded-xl border p-4 ${item.color}`}>
            <p className="text-xs font-semibold text-[var(--text)]">{item.label}</p>
            <p className="mt-1 text-xs text-[var(--muted)]">{item.desc}</p>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "Common space patterns",
    body: (
      <div className="flex flex-col gap-2">
        {SPACE_EXAMPLES.map((ex, i) => (
          <div key={i} className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] px-4 py-3">
            <span className={`shrink-0 font-mono text-sm font-bold ${ex.color}`}>{ex.complexity}</span>
            <span className="text-xs text-[var(--muted)]">{ex.example}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    heading: "Recursion & the call stack",
    body: (
      <div className="space-y-3">
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Each recursive call pushes a frame onto the call stack. A function that calls itself <InlineCode>n</InlineCode> times
          deep uses <strong className="text-[var(--text)]">O(n) stack space</strong> even if it allocates no other memory.
        </p>
        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)]">
          <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_60%,transparent)] px-4 py-2">
            <span className="text-xs font-medium text-[var(--muted)]">Call stack — factorial(4)</span>
          </div>
          <div className="space-y-1 p-4">
            {["factorial(4)", "factorial(3)", "factorial(2)", "factorial(1)"].map((frame, i, arr) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-lg border border-[var(--border)] px-3 py-2 font-mono text-xs"
                style={{ marginLeft: `${i * 12}px` }}
              >
                <span className="text-[var(--text)]">{frame}</span>
                {i === arr.length - 1 && <span className="text-emerald-400 text-[10px]">← top of stack</span>}
              </div>
            ))}
            <p className="pt-1 text-right text-[10px] text-[var(--faint)]">depth = 4 → O(n) space</p>
          </div>
        </div>
      </div>
    ),
  },
  {
    heading: "Space vs time trade-off",
    body: (
      <div className="rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_35%,transparent)] p-4">
        <p className="text-sm leading-relaxed text-[var(--muted)]">
          Many optimisations trade space for speed. The Two Sum hash map is a classic example:
          a brute-force O(n²) / O(1) solution becomes O(n) / O(n) by caching seen values.
          Knowing both dimensions helps you pick the right trade-off for the constraints given.
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[
            { label: "Brute force", time: "O(n²)", space: "O(1)", color: "text-orange-400" },
            { label: "Hash map",    time: "O(n)",  space: "O(n)", color: "text-emerald-400" },
          ].map((row) => (
            <div key={row.label} className="rounded-lg border border-[var(--border)] p-3">
              <p className={`text-xs font-semibold ${row.color}`}>{row.label}</p>
              <p className="mt-1 font-mono text-xs text-[var(--muted)]">Time: {row.time}</p>
              <p className="font-mono text-xs text-[var(--muted)]">Space: {row.space}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
];

const TOPIC_CONTENT: Record<FundamentalTopicId, { title: string; subtitle: string; sections: Section[] }> = {
  "big-o": {
    title: "Big O Notation & Time Complexity",
    subtitle: "How to evaluate code efficiency",
    sections: BIG_O_CONTENT,
  },
  "space-complexity": {
    title: "Space Complexity",
    subtitle: "Applying complexity analysis to memory usage",
    sections: SPACE_CONTENT,
  },
};

/* ─── Drawer ───────────────────────────────────────────────────────────────── */

interface Props {
  topicId: FundamentalTopicId | null;
  onClose: () => void;
}

export function DSAFundamentalsDrawer({ topicId, onClose }: Props) {
  // Close on Escape
  useEffect(() => {
    if (!topicId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [topicId, onClose]);

  if (!topicId) return null;
  const topic = TOPIC_CONTENT[topicId];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      {/* Panel */}
      <aside className="relative flex h-full w-full max-w-2xl flex-col border-l border-[var(--border)] bg-[var(--background)] shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--border)] p-5">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="rounded-full border border-[var(--accent)]/20 bg-[var(--accent)]/8 px-2.5 py-0.5 text-xs font-medium text-[var(--accent)]">
                Fundamentals
              </span>
            </div>
            <h2 className="text-lg font-semibold leading-snug text-[var(--text)]">{topic.title}</h2>
            <p className="mt-0.5 text-sm text-[var(--muted)]">{topic.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[var(--muted)] transition hover:bg-[var(--elevated)] hover:text-[var(--text)]"
            aria-label="Close"
          >
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-1 flex-col gap-8 overflow-y-auto p-5">
          {topic.sections.map((sec) => (
            <SectionBlock key={sec.heading} heading={sec.heading}>
              {sec.body}
            </SectionBlock>
          ))}
        </div>
      </aside>
    </div>
  );
}
