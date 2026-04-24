import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const fig =
  "mt-3 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40 text-neutral-200";

const NODE_IDS = new Set<RoadmapDetailDiagramId>([
  "node-one-thread-io",
  "node-event-loop-phases",
  "node-execution-priority",
  "go-goroutine-mn",
]);

export function isNodeRuntimeDiagram(id: RoadmapDetailDiagramId): boolean {
  return NODE_IDS.has(id);
}

export function NodeRuntimeDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    case "node-one-thread-io":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            One thread runs JS — I/O wait is offloaded to libuv / OS
          </figcaption>
          <svg viewBox="0 0 400 200" className="h-auto w-full" aria-hidden>
            <rect x="20" y="60" width="100" height="80" rx="8" className="fill-amber-950/50 stroke-amber-600/40" strokeWidth="1" />
            <text x="32" y="90" className="fill-amber-100/90 text-[10px] font-semibold">
              V8 + JS
            </text>
            <text x="32" y="110" className="fill-neutral-500 text-[9px]">
              one thread
            </text>
            <text x="32" y="128" className="fill-neutral-500 text-[9px]">
              (your handlers)
            </text>
            <path d="M 125 100 L 180 100" className="stroke-sky-500" strokeWidth="2" markerEnd="url(#n-arw)" />
            <rect x="180" y="50" width="200" height="100" rx="8" className="fill-sky-950/40 stroke-sky-500/30" strokeWidth="1" />
            <text x="192" y="72" className="fill-sky-200/90 text-[10px] font-semibold">
              libuv + OS
            </text>
            <text x="192" y="90" className="fill-neutral-500 text-[9px]">
              epoll / kqueue / IOCP
            </text>
            <text x="192" y="110" className="fill-neutral-500 text-[9px]">
              10k+ open sockets/FDs wait here
            </text>
            <text x="192" y="132" className="fill-neutral-500 text-[9px]">
              bytes ready → callback queued
            </text>
            <text x="20" y="188" className="fill-neutral-500 text-[9px]">
              While a DB or socket waits, the thread can run other ready callbacks.
            </text>
            <defs>
              <marker id="n-arw" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="#38bdf8" />
              </marker>
            </defs>
          </svg>
        </figure>
      );

    case "node-event-loop-phases":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            Simplified event loop (libuv) — one turn / “tick” is more subtle in practice
          </figcaption>
          <svg viewBox="0 0 420 100" className="h-auto w-full" aria-hidden>
            {[
              "timers",
              "pending",
              "poll",
              "check",
              "close",
            ].map((label, i) => (
              <g key={label} transform={`translate(${12 + i * 78}, 20)`}>
                <rect width="70" height="36" rx="4" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
                <text x="6" y="24" className="fill-neutral-200 text-[9px]">
                  {label}
                </text>
              </g>
            ))}
            <path
              d="M 10 80 Q 200 100 400 80"
              fill="none"
              className="stroke-violet-500/40"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text x="120" y="95" className="fill-violet-400/80 text-[9px]">
              cycle + microtasks between phases (see next diagram)
            </text>
          </svg>
        </figure>
      );

    case "node-execution-priority":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            Order in one turn: sync stack → `process.nextTick` → Promises → macrotasks
          </figcaption>
          <svg viewBox="0 0 320 220" className="h-auto w-full" aria-hidden>
            <rect x="20" y="8" width="280" height="32" rx="4" className="fill-rose-950/30 stroke-rose-500/40" strokeWidth="1" />
            <text x="32" y="30" className="fill-rose-100/90 text-[10px]">
              1. Synchronous call stack (runs to completion in this run)
            </text>
            <text x="160" y="46" className="fill-neutral-500 text-[9px]">
              ↓
            </text>
            <rect x="20" y="50" width="280" height="32" rx="4" className="fill-amber-950/30 stroke-amber-500/40" strokeWidth="1" />
            <text x="32" y="72" className="fill-amber-100/90 text-[10px]">
              2. `process.nextTick` queue (drain all)
            </text>
            <text x="160" y="88" className="fill-neutral-500 text-[9px]">
              ↓
            </text>
            <rect x="20" y="92" width="280" height="32" rx="4" className="fill-sky-950/30 stroke-sky-500/40" strokeWidth="1" />
            <text x="32" y="114" className="fill-sky-100/90 text-[10px]">
              3. Promise microtasks (`.then` / `await` continuation)
            </text>
            <text x="160" y="130" className="fill-neutral-500 text-[9px]">
              ↓
            </text>
            <rect x="20" y="134" width="280" height="32" rx="4" className="fill-emerald-950/30 stroke-emerald-500/40" strokeWidth="1" />
            <text x="32" y="156" className="fill-emerald-100/90 text-[10px]">
              4. Macrotasks (`setTimeout`, I/O close callbacks, …)
            </text>
            <text x="20" y="200" className="fill-red-400/80 text-[9px]">
              Footgun: recursive `nextTick` can starve timers and I/O.
            </text>
          </svg>
        </figure>
      );

    case "go-goroutine-mn":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            Go: many goroutines scheduled onto a small pool of OS threads (M:N)
          </figcaption>
          <svg viewBox="0 0 400 160" className="h-auto w-full" aria-hidden>
            <text x="20" y="24" className="fill-cyan-300/90 text-[10px] font-medium">
              Goroutines (thousands, ~2KB stacks)
            </text>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <circle
                key={i}
                cx={32 + (i % 4) * 32}
                cy={44 + Math.floor(i / 4) * 24}
                r="8"
                className="fill-cyan-600/40 stroke-cyan-500/50"
                strokeWidth="1"
              />
            ))}
            <text x="180" y="50" className="fill-neutral-500 text-lg">
              →
            </text>
            <text x="220" y="24" className="fill-amber-300/90 text-[10px] font-medium">
              OS threads (e.g. GOMAXPROCS)
            </text>
            <rect x="220" y="36" width="160" height="100" rx="6" className="fill-amber-950/30 stroke-amber-500/30" strokeWidth="1" />
            <text x="232" y="88" className="fill-amber-100/80 text-[9px]">
              Scheduler picks runnable
            </text>
            <text x="232" y="110" className="fill-amber-100/80 text-[9px]">
              goroutine per blocked read
            </text>
            <text x="20" y="148" className="fill-neutral-500 text-[9px]">
              Blocking on `Read` → runtime parks goroutine, runs others on the same thread.
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
