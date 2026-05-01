import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const fig =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

const NODE_IDS = new Set<RoadmapDetailDiagramId>([
  "node-one-thread-io",
  "node-event-loop-phases",
  "node-execution-priority",
  "nodejs-require-resolution",
  "nodejs-express-middleware-chain",
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
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            One JS thread + libuv/OS handles all waiting — bidirectional handoff
          </figcaption>
          <svg viewBox="0 0 400 180" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="nio-fwd"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker
                id="nio-bck"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
              </marker>
            </defs>
            {/* JS thread box */}
            <rect
              x="12"
              y="40"
              width="130"
              height="90"
              rx="6"
              fill="#451a03"
              stroke="#d97706"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="22"
              y="62"
              className="fill-amber-200 text-[10px] font-semibold"
            >
              JS Thread (V8)
            </text>
            <text x="22" y="80" className="fill-neutral-400 text-[9px]">
              runs callbacks
            </text>
            <text x="22" y="96" className="fill-neutral-400 text-[9px]">
              one at a time
            </text>
            <text x="22" y="114" className="fill-neutral-500 text-[9px]">
              idle while waiting
            </text>
            {/* libuv/OS box */}
            <rect
              x="240"
              y="28"
              width="148"
              height="114"
              rx="6"
              fill="#082f49"
              stroke="#0ea5e9"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="252"
              y="50"
              className="fill-sky-300 text-[10px] font-semibold"
            >
              libuv + OS
            </text>
            <text x="252" y="68" className="fill-neutral-400 text-[9px]">
              epoll / kqueue / IOCP
            </text>
            <text x="252" y="86" className="fill-neutral-500 text-[9px]">
              10k+ fds registered
            </text>
            <text x="252" y="104" className="fill-neutral-500 text-[9px]">
              DB · disk · network
            </text>
            <text x="252" y="122" className="fill-neutral-500 text-[9px]">
              DNS · timers
            </text>
            {/* forward arrow: register I/O */}
            <line
              x1="144"
              y1="72"
              x2="236"
              y2="58"
              stroke="#38bdf8"
              strokeWidth="1.5"
              markerEnd="url(#nio-fwd)"
            />
            <text x="160" y="58" className="fill-sky-400 text-[8px]">
              register fd / hand off
            </text>
            {/* back arrow: data ready → callback queued */}
            <line
              x1="238"
              y1="100"
              x2="144"
              y2="108"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeDasharray="5 3"
              markerEnd="url(#nio-bck)"
            />
            <text x="152" y="122" className="fill-emerald-400 text-[8px]">
              data ready → queue callback
            </text>
            {/* bottom note */}
            <text x="12" y="164" className="fill-neutral-500 text-[9px]">
              While fds wait in the OS, the JS thread is free to run other ready
              callbacks.
            </text>
          </svg>
        </figure>
      );

    case "node-event-loop-phases":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Event loop phases — microtasks drain between every phase transition
          </figcaption>
          <svg viewBox="0 0 480 148" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="elp-arr"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#71717a" />
              </marker>
              <marker
                id="elp-cyc"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#a78bfa" />
              </marker>
            </defs>
            {/* phases */}
            {[
              { label: "timers", sub: "setTimeout\nsetInterval", x: 8 },
              { label: "pending", sub: "I/O errors\nfrom prev tick", x: 100 },
              {
                label: "poll",
                sub: "← waits here\nfor I/O",
                x: 192,
                highlight: true,
              },
              { label: "check", sub: "setImmediate", x: 284 },
              { label: "close", sub: "socket.on\n('close')", x: 376 },
            ].map(({ label, sub, x, highlight }) => (
              <g key={label}>
                <rect
                  x={x}
                  y="18"
                  width="84"
                  height="52"
                  rx="4"
                  fill={highlight ? "#1e3a5f" : "#1c1c1e"}
                  stroke={highlight ? "#38bdf8" : "#3f3f46"}
                  strokeWidth={highlight ? 1.5 : 1}
                />
                <text
                  x={x + 6}
                  y="36"
                  className={`text-[9px] font-semibold ${highlight ? "fill-sky-300" : "fill-neutral-200"}`}
                >
                  {label}
                </text>
                {sub.split("\n").map((line, i) => (
                  <text
                    key={i}
                    x={x + 6}
                    y={50 + i * 12}
                    className="fill-neutral-500 text-[8px]"
                  >
                    {line}
                  </text>
                ))}
              </g>
            ))}
            {/* phase arrows */}
            {[100, 192, 284, 376].map((x) => (
              <line
                key={x}
                x1={x - 2}
                y1="44"
                x2={x + 2}
                y2="44"
                stroke="#71717a"
                strokeWidth="1"
                markerEnd="url(#elp-arr)"
              />
            ))}
            {/* microtask drain label */}
            <text
              x="240"
              y="86"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ↑ nextTick + Promise microtasks drain between every phase ↑
            </text>
            {/* cycle arrow */}
            <path
              d="M 460 44 Q 470 110 240 128 Q 10 110 8 70"
              fill="none"
              stroke="#a78bfa"
              strokeWidth="1.2"
              strokeDasharray="5 3"
              markerEnd="url(#elp-cyc)"
            />
            <text
              x="240"
              y="140"
              textAnchor="middle"
              className="fill-violet-400/70 text-[8px]"
            >
              loop repeats — Poll blocks when idle, wakes on I/O
            </text>
          </svg>
        </figure>
      );

    case "node-execution-priority":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Execution priority — output order: 1 → 4 → 2 → 3 → 5
          </figcaption>
          <svg viewBox="0 0 340 232" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="ep-arr"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#52525b" />
              </marker>
            </defs>
            {/* row 1 — sync */}
            <rect
              x="16"
              y="8"
              width="308"
              height="34"
              rx="4"
              fill="#3b0f14"
              stroke="#f87171"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="26"
              y="24"
              className="fill-red-300 text-[9px] font-semibold"
            >
              ① Sync call stack
            </text>
            <text x="26" y="36" className="fill-neutral-500 text-[8px]">
              runs to completion — no interruption
            </text>
            <line
              x1="170"
              y1="44"
              x2="170"
              y2="54"
              stroke="#52525b"
              strokeWidth="1.5"
              markerEnd="url(#ep-arr)"
            />
            {/* row 2 — nextTick */}
            <rect
              x="16"
              y="56"
              width="308"
              height="34"
              rx="4"
              fill="#451a03"
              stroke="#fb923c"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="26"
              y="72"
              className="fill-orange-300 text-[9px] font-semibold"
            >
              ② process.nextTick{" "}
              <tspan className="fill-neutral-500 text-[8px]">
                (drain completely)
              </tspan>
            </text>
            <text x="26" y="84" className="fill-red-400/70 text-[8px]">
              ⚠ recursive nextTick here = starvation
            </text>
            <line
              x1="170"
              y1="92"
              x2="170"
              y2="102"
              stroke="#52525b"
              strokeWidth="1.5"
              markerEnd="url(#ep-arr)"
            />
            {/* row 3 — promise */}
            <rect
              x="16"
              y="104"
              width="308"
              height="34"
              rx="4"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="26"
              y="120"
              className="fill-sky-300 text-[9px] font-semibold"
            >
              ③ Promise microtasks{" "}
              <tspan className="fill-neutral-500 text-[8px]">
                (.then / await / queueMicrotask)
              </tspan>
            </text>
            <text x="26" y="132" className="fill-neutral-500 text-[8px]">
              drain completely before any macrotask runs
            </text>
            <line
              x1="170"
              y1="140"
              x2="170"
              y2="150"
              stroke="#52525b"
              strokeWidth="1.5"
              markerEnd="url(#ep-arr)"
            />
            {/* row 4 — macrotasks */}
            <rect
              x="16"
              y="152"
              width="308"
              height="34"
              rx="4"
              fill="#1a2e1a"
              stroke="#4ade80"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="26"
              y="168"
              className="fill-emerald-300 text-[9px] font-semibold"
            >
              ④ Macrotasks
            </text>
            <text x="26" y="180" className="fill-neutral-500 text-[8px]">
              setTimeout(0) · setImmediate · I/O callbacks — one per loop turn
            </text>
            {/* example output */}
            <text x="16" y="206" className="fill-neutral-600 text-[8px]">
              console.log(1) · setTimeout(→5) · Promise.then(→3) · nextTick(→2)
              · console.log(4)
            </text>
            <text x="16" y="220" className="fill-violet-400/80 text-[8px]">
              Output: 1 → 4 → 2 → 3 → 5
            </text>
          </svg>
        </figure>
      );

    case "nodejs-require-resolution":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            What happens when you call{" "}
            <code className="text-[var(--text)]">require(&apos;./file&apos;)</code>{" "}
            — resolve → run once → cache → reuse the same exports object
          </figcaption>
          <svg viewBox="0 0 440 200" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="nrr-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker
                id="nrr-grn"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>
            <text x="220" y="14" textAnchor="middle" className="fill-neutral-400 text-[10px] font-semibold">
              CommonJS <tspan className="fill-sky-400">require</tspan> — first load vs cached load
            </text>
            {/* Row 1 */}
            <rect x="12" y="28" width="96" height="36" rx="6" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="60" y="48" textAnchor="middle" className="fill-sky-300 text-[9px]">
              Your code
            </text>
            <text x="60" y="58" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              require(&apos;./api&apos;)
            </text>
            <line x1="110" y1="46" x2="132" y2="46" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrr-arr)" />
            <rect x="136" y="28" width="100" height="36" rx="6" fill="#1c1c1e" stroke="#71717a" strokeWidth="1" />
            <text x="186" y="46" textAnchor="middle" className="fill-neutral-300 text-[9px]">
              Resolve path
            </text>
            <text x="186" y="58" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              file · index · node_modules
            </text>
            <line x1="238" y1="46" x2="258" y2="46" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrr-arr)" />
            <polygon points="262,36 292,46 262,56" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
            <text x="312" y="42" className="fill-amber-300 text-[9px] font-semibold">
              In require.cache?
            </text>
            <text x="312" y="54" className="fill-neutral-500 text-[8px]">
              same absolute path = hit
            </text>
            {/* Yes branch */}
            <line x1="292" y1="52" x2="292" y2="72" stroke="#4ade80" strokeWidth="1.2" />
            <text x="300" y="68" className="fill-emerald-400 text-[8px]">
              yes →
            </text>
            <rect x="318" y="76" width="110" height="32" rx="6" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" />
            <text x="373" y="94" textAnchor="middle" className="fill-emerald-300 text-[9px]">
              Return cached exports
            </text>
            <line x1="373" y1="108" x2="373" y2="124" stroke="#4ade80" strokeWidth="1" markerEnd="url(#nrr-grn)" />
            {/* No branch */}
            <line x1="272" y1="46" x2="272" y2="112" stroke="#f87171" strokeWidth="1" strokeDasharray="4 3" />
            <text x="228" y="100" className="fill-red-400 text-[8px]">
              no ↓
            </text>
            <rect x="28" y="112" width="120" height="40" rx="6" fill="#3b0f14" stroke="#f87171" strokeWidth="1" strokeOpacity="0.6" />
            <text x="88" y="128" textAnchor="middle" className="fill-red-300 text-[9px] font-semibold">
              Wrap file in function
            </text>
            <text x="88" y="142" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              (exports, require, module, …)
            </text>
            <line x1="150" y1="132" x2="178" y2="132" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrr-arr)" />
            <rect x="182" y="112" width="96" height="40" rx="6" fill="#082f49" stroke="#0ea5e9" strokeWidth="1" />
            <text x="230" y="130" textAnchor="middle" className="fill-sky-300 text-[9px]">
              Run once
            </text>
            <text x="230" y="144" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              module.exports fills
            </text>
            <line x1="280" y1="132" x2="308" y2="132" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrr-arr)" />
            <rect x="312" y="112" width="116" height="40" rx="6" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="1" />
            <text x="370" y="130" textAnchor="middle" className="fill-sky-300 text-[9px]">
              Store in cache
            </text>
            <text x="370" y="144" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              require.cache[key]
            </text>
            <text x="220" y="176" textAnchor="middle" className="fill-neutral-500 text-[9px]">
              Same object returned everywhere — mutations to exports are visible to all importers.
            </text>
          </svg>
        </figure>
      );

    case "nodejs-express-middleware-chain":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Express middleware — each function can modify{" "}
            <code className="text-[var(--text)]">req</code>/<code className="text-[var(--text)]">res</code>, call{" "}
            <code className="text-[var(--text)]">next()</code>, or send a response (stops the chain)
          </figcaption>
          <svg viewBox="0 0 440 168" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="nem-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
            </defs>
            <text x="24" y="22" className="fill-neutral-400 text-[10px] font-semibold">
              Incoming HTTP request
            </text>
            <line x1="24" y1="28" x2="24" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="416" y1="28" x2="416" y2="140" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
            {[
              { x: 36, label: "① cors()", sub: "sets headers", color: "#38bdf8" },
              { x: 134, label: "② express.json()", sub: "parses body", color: "#a78bfa" },
              { x: 232, label: "③ auth middleware", sub: "may 401", color: "#fb923c" },
              { x: 330, label: "④ route handler", sub: "GET /api/items", color: "#4ade80" },
            ].map(({ x, label, sub, color }) => (
              <g key={label}>
                <rect
                  x={x}
                  y="44"
                  width="82"
                  height="44"
                  rx="6"
                  fill="#1c1c1e"
                  stroke={color}
                  strokeWidth="1.2"
                  strokeOpacity="0.75"
                />
                <text x={x + 8} y="64" className="fill-neutral-200 text-[9px] font-semibold">
                  {label}
                </text>
                <text x={x + 8} y="78" className="fill-neutral-500 text-[8px]">
                  {sub}
                </text>
              </g>
            ))}
            {/* gaps between boxes: 118→134, 216→232, 314→330, 412→418 */}
            <line x1="118" y1="66" x2="132" y2="66" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nem-arr)" />
            <line x1="216" y1="66" x2="230" y2="66" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nem-arr)" />
            <line x1="314" y1="66" x2="328" y2="66" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nem-arr)" />
            <line x1="412" y1="66" x2="418" y2="66" stroke="#4ade80" strokeWidth="2" markerEnd="url(#nem-arr)" />
            <text x="428" y="62" className="fill-emerald-400 text-[8px]">
              HTTP response
            </text>
            <rect x="44" y="108" width="352" height="44" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="220" y="128" textAnchor="middle" className="fill-amber-400/90 text-[9px]">
              If any step calls <tspan className="fill-orange-300">next(err)</tspan> → skips normal handlers → Express error middleware (4 args)
            </text>
            <text x="220" y="142" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              Order matters: put parsers and auth before routes; mount error handler last.
            </text>
          </svg>
        </figure>
      );

    case "go-goroutine-mn":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Go M:N scheduler — goroutines (G) multiplexed onto OS threads (M),
            bound to logical CPUs (P)
          </figcaption>
          <svg viewBox="0 0 440 168" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="go-arr"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#22d3ee" />
              </marker>
            </defs>
            {/* goroutines column */}
            <text
              x="18"
              y="16"
              className="fill-cyan-300 text-[9px] font-semibold"
            >
              Goroutines (G)
            </text>
            <text x="18" y="27" className="fill-neutral-500 text-[8px]">
              ~2 KB stacks, cheap
            </text>
            {[
              {
                label: "G1 running",
                y: 36,
                color: "#164e63",
                border: "#22d3ee",
                textColor: "fill-cyan-300",
              },
              {
                label: "G2 running",
                y: 60,
                color: "#164e63",
                border: "#22d3ee",
                textColor: "fill-cyan-300",
              },
              {
                label: "G3 parked (I/O)",
                y: 84,
                color: "#2d1a1a",
                border: "#f87171",
                textColor: "fill-red-300",
              },
              {
                label: "G4 runnable",
                y: 108,
                color: "#1a2e1a",
                border: "#4ade80",
                textColor: "fill-emerald-300",
              },
              {
                label: "G5 runnable",
                y: 132,
                color: "#1a2e1a",
                border: "#4ade80",
                textColor: "fill-emerald-300",
              },
            ].map(({ label, y, color, border, textColor }) => (
              <g key={label}>
                <rect
                  x="16"
                  y={y}
                  width="108"
                  height="20"
                  rx="3"
                  fill={color}
                  stroke={border}
                  strokeWidth="1"
                  strokeOpacity="0.7"
                />
                <text x="22" y={y + 14} className={`${textColor} text-[8px]`}>
                  {label}
                </text>
              </g>
            ))}
            {/* arrows G1/G2 → threads */}
            <line
              x1="126"
              y1="46"
              x2="196"
              y2="62"
              stroke="#22d3ee"
              strokeWidth="1.2"
              markerEnd="url(#go-arr)"
            />
            <line
              x1="126"
              y1="70"
              x2="196"
              y2="100"
              stroke="#22d3ee"
              strokeWidth="1.2"
              markerEnd="url(#go-arr)"
            />
            {/* OS threads column */}
            <text
              x="200"
              y="16"
              className="fill-amber-300 text-[9px] font-semibold"
            >
              OS Threads (M)
            </text>
            <text x="200" y="27" className="fill-neutral-500 text-[8px]">
              GOMAXPROCS = num CPUs
            </text>
            {[
              { label: "Thread 1", sub: "running G1", y: 50 },
              { label: "Thread 2", sub: "running G2", y: 88 },
            ].map(({ label, sub, y }) => (
              <g key={label}>
                <rect
                  x="198"
                  y={y}
                  width="108"
                  height="32"
                  rx="3"
                  fill="#2d2000"
                  stroke="#f59e0b"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <text x="206" y={y + 14} className="fill-amber-200 text-[9px]">
                  {label}
                </text>
                <text
                  x="206"
                  y={y + 26}
                  className="fill-neutral-500 text-[8px]"
                >
                  {sub}
                </text>
              </g>
            ))}
            {/* arrows threads → CPU */}
            <line
              x1="308"
              y1="66"
              x2="358"
              y2="76"
              stroke="#f59e0b"
              strokeWidth="1.2"
              markerEnd="url(#go-arr)"
            />
            <line
              x1="308"
              y1="104"
              x2="358"
              y2="108"
              stroke="#f59e0b"
              strokeWidth="1.2"
              markerEnd="url(#go-arr)"
            />
            {/* CPU column */}
            <text
              x="362"
              y="16"
              className="fill-violet-300 text-[9px] font-semibold"
            >
              CPU cores (P)
            </text>
            {[
              { label: "Core 1", y: 60 },
              { label: "Core 2", y: 94 },
            ].map(({ label, y }) => (
              <g key={label}>
                <rect
                  x="360"
                  y={y}
                  width="68"
                  height="24"
                  rx="3"
                  fill="#2e1065"
                  stroke="#a78bfa"
                  strokeWidth="1"
                  strokeOpacity="0.5"
                />
                <text x="368" y={y + 16} className="fill-violet-300 text-[9px]">
                  {label}
                </text>
              </g>
            ))}
            {/* parked note */}
            <text x="16" y="158" className="fill-red-400/70 text-[8px]">
              G3 parked on I/O → scheduler puts G4 or G5 on a free thread. No OS
              thread blocked.
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
