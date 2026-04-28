import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";
import {
  isNodeRuntimeDiagram,
  NodeRuntimeDiagram,
} from "@/components/learn/NodeRuntimeDiagrams";
import {
  isWeek2Diagram,
  Week2Diagram,
} from "@/components/learn/Week2Diagrams";

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

export function DayDetailDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  if (isNodeRuntimeDiagram(id)) {
    return <NodeRuntimeDiagram id={id} />;
  }
  if (isWeek2Diagram(id)) {
    return <Week2Diagram id={id} />;
  }
  switch (id) {
    case "http11-sequential":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            HTTP/1.1 — sequential: Req 2 is blocked until Resp 1 arrives
            (head-of-line blocking)
          </figcaption>
          <svg viewBox="0 0 360 186" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="h11-r"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker
                id="h11-b"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker
                id="h11-g"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" />
              </marker>
              <marker
                id="h11-e"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
            </defs>
            {/* labels */}
            <text
              x="54"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Client
            </text>
            <text
              x="306"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Server
            </text>
            {/* timelines */}
            <line
              x1="54"
              y1="22"
              x2="54"
              y2="172"
              stroke="#3f3f46"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            <line
              x1="306"
              y1="22"
              x2="306"
              y2="172"
              stroke="#3f3f46"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Req 1 */}
            <line
              x1="54"
              y1="38"
              x2="300"
              y2="38"
              stroke="#38bdf8"
              strokeWidth="2"
              markerEnd="url(#h11-r)"
            />
            <text
              x="174"
              y="34"
              textAnchor="middle"
              className="fill-sky-400 text-[9px]"
            >
              GET /posts
            </text>
            {/* Resp 1 */}
            <line
              x1="306"
              y1="78"
              x2="60"
              y2="78"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="5 3"
              markerEnd="url(#h11-b)"
            />
            <text
              x="174"
              y="74"
              textAnchor="middle"
              className="fill-neutral-400 text-[9px]"
            >
              200 OK
            </text>
            {/* blocked indicator */}
            <rect
              x="28"
              y="40"
              width="22"
              height="36"
              rx="2"
              fill="#fbbf2415"
              stroke="#fbbf2440"
              strokeWidth="1"
            />
            <text
              x="39"
              y="62"
              textAnchor="middle"
              className="fill-amber-400/70 text-[8px]"
            >
              wait
            </text>
            {/* Req 2 — starts only after Resp 1 */}
            <line
              x1="54"
              y1="96"
              x2="300"
              y2="96"
              stroke="#a78bfa"
              strokeWidth="2"
              markerEnd="url(#h11-g)"
            />
            <text
              x="174"
              y="92"
              textAnchor="middle"
              className="fill-violet-400 text-[9px]"
            >
              GET /users
            </text>
            {/* Resp 2 */}
            <line
              x1="306"
              y1="136"
              x2="60"
              y2="136"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="5 3"
              markerEnd="url(#h11-e)"
            />
            <text
              x="174"
              y="132"
              textAnchor="middle"
              className="fill-neutral-500 text-[9px]"
            >
              200 OK
            </text>
            {/* caption */}
            <text
              x="180"
              y="180"
              textAnchor="middle"
              className="fill-neutral-500 text-[9px]"
            >
              Req 2 cannot start until Resp 1 is fully received.
            </text>
          </svg>
        </figure>
      );

    case "http2-multiplex":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            HTTP/2 — 3 streams in parallel over one TCP connection (TCP HoL
            still applies on loss)
          </figcaption>
          <svg viewBox="0 0 360 152" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="h2-r"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker
                id="h2-v"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#a78bfa" />
              </marker>
              <marker
                id="h2-g"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
              </marker>
            </defs>
            <text
              x="32"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Client
            </text>
            <text
              x="328"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Server
            </text>
            {/* TCP wrapper */}
            <rect
              x="56"
              y="26"
              width="248"
              height="86"
              rx="6"
              fill="none"
              stroke="#3f3f46"
              strokeWidth="1.5"
              strokeDasharray="6 3"
            />
            <text
              x="180"
              y="23"
              textAnchor="middle"
              className="fill-neutral-600 text-[9px]"
            >
              one TCP connection
            </text>
            {/* streams — simultaneous */}
            <line
              x1="56"
              y1="46"
              x2="298"
              y2="46"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#h2-r)"
            />
            <text
              x="174"
              y="42"
              textAnchor="middle"
              className="fill-sky-400 text-[9px]"
            >
              Stream 1 — GET /posts
            </text>
            <line
              x1="56"
              y1="69"
              x2="298"
              y2="69"
              stroke="#a78bfa"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#h2-v)"
            />
            <text
              x="174"
              y="65"
              textAnchor="middle"
              className="fill-violet-400 text-[9px]"
            >
              Stream 2 — GET /users
            </text>
            <line
              x1="56"
              y1="92"
              x2="298"
              y2="92"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#h2-g)"
            />
            <text
              x="174"
              y="88"
              textAnchor="middle"
              className="fill-emerald-400 text-[9px]"
            >
              Stream 3 — GET /tags
            </text>
            {/* note */}
            <text
              x="180"
              y="128"
              textAnchor="middle"
              className="fill-amber-400/80 text-[9px]"
            >
              ⚠ Packet loss on any stream stalls all streams (TCP reassembly is
              shared).
            </text>
            <text
              x="180"
              y="144"
              textAnchor="middle"
              className="fill-neutral-500 text-[9px]"
            >
              HTTP/3 / QUIC removes this coupling.
            </text>
          </svg>
        </figure>
      );

    case "http3-quic":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            HTTP/3 / QUIC — independent loss recovery: Stream 2 stalls, Streams
            1 &amp; 3 continue
          </figcaption>
          <svg viewBox="0 0 360 160" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="h3-r"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker
                id="h3-g"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#34d399" />
              </marker>
            </defs>
            <text
              x="32"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Client
            </text>
            <text
              x="328"
              y="18"
              textAnchor="middle"
              className="fill-neutral-400 text-[11px] font-medium"
            >
              Server
            </text>
            <text
              x="180"
              y="30"
              textAnchor="middle"
              className="fill-amber-400/80 text-[10px] font-medium"
            >
              UDP + QUIC (per-stream reliability)
            </text>
            {/* Stream 1 — OK */}
            <line
              x1="56"
              y1="48"
              x2="298"
              y2="48"
              stroke="#38bdf8"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#h3-r)"
            />
            <text
              x="174"
              y="44"
              textAnchor="middle"
              className="fill-sky-400 text-[9px]"
            >
              Stream 1 — OK ✓
            </text>
            {/* Stream 2 — packet loss, stalls mid-way */}
            <line
              x1="56"
              y1="78"
              x2="175"
              y2="78"
              stroke="#f87171"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="185" y="82" className="fill-red-400 text-[11px] font-bold">
              ✕
            </text>
            <line
              x1="196"
              y1="78"
              x2="298"
              y2="78"
              stroke="#f87171"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray="5 4"
            />
            <text
              x="174"
              y="70"
              textAnchor="middle"
              className="fill-red-400 text-[9px]"
            >
              Stream 2 — packet loss → retransmit (stalled)
            </text>
            {/* Stream 3 — OK, continues despite stream 2 stall */}
            <line
              x1="56"
              y1="108"
              x2="298"
              y2="108"
              stroke="#34d399"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd="url(#h3-g)"
            />
            <text
              x="174"
              y="104"
              textAnchor="middle"
              className="fill-emerald-400 text-[9px]"
            >
              Stream 3 — OK ✓ (not blocked by Stream 2)
            </text>
            {/* notes */}
            <text
              x="180"
              y="132"
              textAnchor="middle"
              className="fill-neutral-400 text-[9px]"
            >
              Each QUIC stream tracks its own sequence space.
            </text>
            <text
              x="180"
              y="148"
              textAnchor="middle"
              className="fill-neutral-500 text-[9px]"
            >
              Stream 2 retransmits independently; 1 and 3 are unaffected.
            </text>
          </svg>
        </figure>
      );

    case "request-response":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Typical HTTP exchange (method + path + headers → status + headers +
            body)
          </figcaption>
          <svg viewBox="0 0 360 100" className="h-auto w-full" aria-hidden>
            <rect
              x="16"
              y="24"
              width="100"
              height="52"
              rx="6"
              className="fill-neutral-800 stroke-neutral-600"
              strokeWidth="1"
            />
            <text x="28" y="46" className="fill-neutral-300 text-[10px]">
              GET /posts/7
            </text>
            <text x="28" y="62" className="fill-neutral-500 text-[9px]">
              Accept: application/json
            </text>
            <path
              d="M130 50 H 210"
              stroke="#64748b"
              strokeWidth="2"
              markerEnd="url(#reqresp-arr)"
            />
            <rect
              x="220"
              y="24"
              width="124"
              height="52"
              rx="6"
              className="fill-neutral-800 stroke-emerald-600/50"
              strokeWidth="1"
            />
            <text x="232" y="46" className="fill-emerald-300/90 text-[10px]">
              200 OK
            </text>
            <text x="232" y="62" className="fill-neutral-500 text-[9px]">
              {'{ "title": "…" }'}
            </text>
            <defs>
              <marker
                id="reqresp-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
            </defs>
          </svg>
        </figure>
      );

    case "status-401-403":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            401 vs 403 — identity vs permission
          </figcaption>
          <svg viewBox="0 0 360 108" className="h-auto w-full" aria-hidden>
            <rect
              x="12"
              y="16"
              width="150"
              height="76"
              rx="8"
              className="fill-amber-950/40 stroke-amber-600/40"
              strokeWidth="1"
            />
            <text
              x="24"
              y="40"
              className="fill-amber-200/90 text-[11px] font-semibold"
            >
              No / bad identity?
            </text>
            <text x="24" y="58" className="fill-neutral-400 text-[10px]">
              Missing token, expired JWT
            </text>
            <text
              x="24"
              y="80"
              className="fill-amber-300 text-[12px] font-bold"
            >
              → 401
            </text>
            <rect
              x="198"
              y="16"
              width="150"
              height="76"
              rx="8"
              className="fill-rose-950/35 stroke-rose-600/40"
              strokeWidth="1"
            />
            <text
              x="210"
              y="40"
              className="fill-rose-200/90 text-[11px] font-semibold"
            >
              Known user, not allowed?
            </text>
            <text x="210" y="58" className="fill-neutral-400 text-[10px]">
              Wrong role on resource
            </text>
            <text
              x="210"
              y="80"
              className="fill-rose-300 text-[12px] font-bold"
            >
              → 403
            </text>
          </svg>
        </figure>
      );

    case "acid-transaction":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            ACID transaction — commit path vs rollback path
          </figcaption>
          <svg viewBox="0 0 420 172" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="acid-ok"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker
                id="acid-rb"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#f87171" />
              </marker>
              <marker
                id="acid-n"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#71717a" />
              </marker>
            </defs>
            {/* BEGIN */}
            <rect
              x="12"
              y="68"
              width="64"
              height="28"
              rx="4"
              fill="#1c1c1e"
              stroke="#71717a"
              strokeWidth="1"
            />
            <text
              x="44"
              y="86"
              textAnchor="middle"
              className="fill-neutral-300 text-[9px] font-semibold"
            >
              BEGIN
            </text>
            <line
              x1="78"
              y1="82"
              x2="106"
              y2="82"
              stroke="#71717a"
              strokeWidth="1.5"
              markerEnd="url(#acid-n)"
            />
            {/* OPS block */}
            <rect
              x="108"
              y="56"
              width="80"
              height="52"
              rx="4"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.6"
            />
            <text
              x="148"
              y="76"
              textAnchor="middle"
              className="fill-sky-300 text-[9px] font-semibold"
            >
              SQL ops
            </text>
            <text
              x="148"
              y="90"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              UPDATE A
            </text>
            <text
              x="148"
              y="102"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              UPDATE B
            </text>
            <line
              x1="190"
              y1="82"
              x2="218"
              y2="82"
              stroke="#71717a"
              strokeWidth="1.5"
              markerEnd="url(#acid-n)"
            />
            {/* Decision diamond */}
            <polygon
              points="238,60 268,82 238,104 208,82"
              fill="#2d2000"
              stroke="#f59e0b"
              strokeWidth="1"
            />
            <text
              x="238"
              y="79"
              textAnchor="middle"
              className="fill-amber-300 text-[8px]"
            >
              all
            </text>
            <text
              x="238"
              y="91"
              textAnchor="middle"
              className="fill-amber-300 text-[8px]"
            >
              OK?
            </text>
            {/* COMMIT path */}
            <line
              x1="268"
              y1="82"
              x2="296"
              y2="82"
              stroke="#4ade80"
              strokeWidth="1.5"
              markerEnd="url(#acid-ok)"
            />
            <rect
              x="298"
              y="68"
              width="68"
              height="28"
              rx="4"
              fill="#1a2e1a"
              stroke="#4ade80"
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            <text
              x="332"
              y="83"
              textAnchor="middle"
              className="fill-emerald-300 text-[9px] font-semibold"
            >
              COMMIT
            </text>
            <text
              x="332"
              y="95"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              WAL fsync
            </text>
            <text x="268" y="78" className="fill-emerald-500 text-[8px]">
              yes
            </text>
            {/* ROLLBACK path */}
            <line
              x1="238"
              y1="104"
              x2="238"
              y2="132"
              stroke="#f87171"
              strokeWidth="1.5"
              markerEnd="url(#acid-rb)"
            />
            <rect
              x="180"
              y="134"
              width="116"
              height="28"
              rx="4"
              fill="#3b0f14"
              stroke="#f87171"
              strokeWidth="1"
              strokeOpacity="0.7"
            />
            <text
              x="238"
              y="149"
              textAnchor="middle"
              className="fill-red-300 text-[9px] font-semibold"
            >
              ROLLBACK
            </text>
            <text
              x="238"
              y="161"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              undo all ops — as if nothing ran
            </text>
            <text x="242" y="120" className="fill-red-400 text-[8px]">
              no / error
            </text>
            {/* Durability note */}
            <text x="298" y="112" className="fill-neutral-500 text-[8px]">
              Durability:
            </text>
            <text x="298" y="123" className="fill-neutral-500 text-[8px]">
              survives crash
            </text>
          </svg>
        </figure>
      );

    case "isolation-levels":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Isolation levels vs concurrency anomalies — ✅ prevented, ❌
            possible
          </figcaption>
          <svg viewBox="0 0 460 148" className="h-auto w-full" aria-hidden>
            {/* header row */}
            {[
              "Isolation level",
              "Dirty read",
              "Non-repeatable",
              "Phantom read",
              "Default in",
            ].map((h, i) => (
              <text
                key={h}
                x={i === 0 ? 8 : 118 + (i - 1) * 82}
                y="22"
                className="fill-neutral-400 text-[9px] font-semibold"
              >
                {h}
              </text>
            ))}
            <line
              x1="4"
              y1="28"
              x2="456"
              y2="28"
              stroke="#3f3f46"
              strokeWidth="1"
            />
            {[
              {
                level: "Read Uncommitted",
                dirty: "❌",
                nonrep: "❌",
                phantom: "❌",
                db: "—",
              },
              {
                level: "Read Committed",
                dirty: "✅",
                nonrep: "❌",
                phantom: "❌",
                db: "PostgreSQL",
              },
              {
                level: "Repeatable Read",
                dirty: "✅",
                nonrep: "✅",
                phantom: "❌",
                db: "MySQL InnoDB",
              },
              {
                level: "Serializable",
                dirty: "✅",
                nonrep: "✅",
                phantom: "✅",
                db: "explicit SET",
              },
            ].map(({ level, dirty, nonrep, phantom, db }, i) => {
              const y = 46 + i * 24;
              const bg = i % 2 === 0 ? "#1c1c1e" : "transparent";
              return (
                <g key={level}>
                  <rect
                    x="4"
                    y={y - 12}
                    width="452"
                    height="22"
                    rx="2"
                    fill={bg}
                  />
                  <text x="8" y={y} className="fill-neutral-300 text-[9px]">
                    {level}
                  </text>
                  <text
                    x="152"
                    y={y}
                    className={`text-[9px] ${dirty === "✅" ? "fill-emerald-400" : "fill-red-400"}`}
                  >
                    {dirty}
                  </text>
                  <text
                    x="234"
                    y={y}
                    className={`text-[9px] ${nonrep === "✅" ? "fill-emerald-400" : "fill-red-400"}`}
                  >
                    {nonrep}
                  </text>
                  <text
                    x="316"
                    y={y}
                    className={`text-[9px] ${phantom === "✅" ? "fill-emerald-400" : "fill-red-400"}`}
                  >
                    {phantom}
                  </text>
                  <text x="378" y={y} className="fill-neutral-500 text-[8px]">
                    {db}
                  </text>
                </g>
              );
            })}
            <text x="4" y="144" className="fill-amber-400/70 text-[8px]">
              Higher isolation = fewer anomalies + more locking overhead. Most
              apps only need Read Committed.
            </text>
          </svg>
        </figure>
      );

    case "btree-index":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            B-tree index — O(log n) tree traversal vs O(n) sequential scan
          </figcaption>
          <svg viewBox="0 0 420 180" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="bt-arr"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#71717a" />
              </marker>
              <marker
                id="bt-hit"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
            </defs>
            {/* B-tree side */}
            <text
              x="8"
              y="14"
              className="fill-sky-400 text-[9px] font-semibold"
            >
              B-tree index (height ≈ 3–4 for millions of rows)
            </text>
            {/* root */}
            <rect
              x="150"
              y="22"
              width="80"
              height="22"
              rx="3"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text
              x="190"
              y="37"
              textAnchor="middle"
              className="fill-sky-300 text-[9px]"
            >
              root [50 | 150]
            </text>
            {/* internal nodes */}
            <rect
              x="60"
              y="62"
              width="72"
              height="20"
              rx="3"
              fill="#1c1c1e"
              stroke="#52525b"
              strokeWidth="1"
            />
            <text
              x="96"
              y="76"
              textAnchor="middle"
              className="fill-neutral-300 text-[8px]"
            >
              [10 | 30]
            </text>
            <rect
              x="164"
              y="62"
              width="72"
              height="20"
              rx="3"
              fill="#1c1c1e"
              stroke="#52525b"
              strokeWidth="1"
            />
            <text
              x="200"
              y="76"
              textAnchor="middle"
              className="fill-neutral-300 text-[8px]"
            >
              [60 | 90]
            </text>
            {/* root → internal */}
            <line
              x1="170"
              y1="44"
              x2="114"
              y2="62"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            <line
              x1="210"
              y1="44"
              x2="200"
              y2="62"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            {/* leaf nodes (linked) */}
            {[10, 30, 60, 90].map((v, i) => (
              <g key={v}>
                <rect
                  x={20 + i * 84}
                  y="102"
                  width="72"
                  height="32"
                  rx="3"
                  fill={v === 60 ? "#1a2e1a" : "#1c1c1e"}
                  stroke={v === 60 ? "#4ade80" : "#3f3f46"}
                  strokeWidth={v === 60 ? 1.5 : 1}
                />
                <text
                  x={56 + i * 84}
                  y="116"
                  textAnchor="middle"
                  className="fill-neutral-300 text-[8px]"
                >
                  {v}
                </text>
                <text
                  x={56 + i * 84}
                  y="128"
                  textAnchor="middle"
                  className="fill-neutral-500 text-[7px]"
                >
                  → heap ptr
                </text>
                {i < 3 && (
                  <line
                    x1={92 + i * 84}
                    y1="118"
                    x2={104 + i * 84}
                    y2="118"
                    stroke="#3f3f46"
                    strokeWidth="1"
                    markerEnd="url(#bt-arr)"
                  />
                )}
              </g>
            ))}
            <text x="8" y="152" className="fill-emerald-400 text-[8px]">
              Query: WHERE id = 60 → 3 page reads (root + internal + leaf) vs
              full scan of all pages
            </text>
            {/* internal → leaves */}
            <line
              x1="90"
              y1="82"
              x2="56"
              y2="102"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            <line
              x1="108"
              y1="82"
              x2="140"
              y2="102"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            <line
              x1="184"
              y1="82"
              x2="224"
              y2="102"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            <line
              x1="220"
              y1="82"
              x2="308"
              y2="102"
              stroke="#52525b"
              strokeWidth="1"
              markerEnd="url(#bt-arr)"
            />
            {/* seq scan comparison */}
            <text x="8" y="170" className="fill-neutral-600 text-[8px]">
              Seq scan: reads every page in the table — O(n). Index: O(log n)
              traversal + heap fetch.
            </text>
          </svg>
        </figure>
      );

    case "rest-graphql-grpc":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            REST vs GraphQL vs gRPC — client/server interaction model
          </figcaption>
          <svg viewBox="0 0 460 192" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="rgg-a"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#71717a" />
              </marker>
              <marker
                id="rgg-b"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#38bdf8" />
              </marker>
              <marker
                id="rgg-g"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#a78bfa" />
              </marker>
              <marker
                id="rgg-r"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#34d399" />
              </marker>
            </defs>
            {/* Column headers */}
            {[
              ["REST", "#38bdf8", 76],
              ["GraphQL", "#a78bfa", 228],
              ["gRPC", "#34d399", 380],
            ].map(([label, color, x]) => (
              <text
                key={String(label)}
                x={Number(x)}
                y="16"
                textAnchor="middle"
                style={{ fill: String(color) }}
                className="text-[10px] font-semibold"
              >
                {label}
              </text>
            ))}
            {/* REST */}
            <rect
              x="12"
              y="26"
              width="128"
              height="22"
              rx="3"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="76"
              y="41"
              textAnchor="middle"
              className="fill-sky-300 text-[8px]"
            >
              GET /users/42/posts
            </text>
            <line
              x1="76"
              y1="50"
              x2="76"
              y2="60"
              stroke="#38bdf8"
              strokeWidth="1"
              markerEnd="url(#rgg-b)"
            />
            <rect
              x="12"
              y="62"
              width="128"
              height="22"
              rx="3"
              fill="#082f49"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="76"
              y="77"
              textAnchor="middle"
              className="fill-neutral-400 text-[8px]"
            >
              200 {"{"} id, title, body, author {"}"}
            </text>
            <text
              x="76"
              y="102"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ⚠ over-fetches
            </text>
            <text
              x="76"
              y="114"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              if client needs only title
            </text>
            <text
              x="76"
              y="132"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ HTTP cache works
            </text>
            <text
              x="76"
              y="144"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ any client
            </text>
            <text
              x="76"
              y="156"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              multiple endpoints
            </text>
            {/* GraphQL */}
            <rect
              x="164"
              y="26"
              width="128"
              height="36"
              rx="3"
              fill="#2e1065"
              stroke="#a78bfa"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="228"
              y="40"
              textAnchor="middle"
              className="fill-violet-300 text-[8px]"
            >
              POST /graphql
            </text>
            <text
              x="228"
              y="54"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              {"{ posts { title } }"}
            </text>
            <line
              x1="228"
              y1="64"
              x2="228"
              y2="74"
              stroke="#a78bfa"
              strokeWidth="1"
              markerEnd="url(#rgg-g)"
            />
            <rect
              x="164"
              y="76"
              width="128"
              height="22"
              rx="3"
              fill="#2e1065"
              stroke="#a78bfa"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="228"
              y="91"
              textAnchor="middle"
              className="fill-neutral-400 text-[8px]"
            >
              {"{ data: { posts: [{ title }] } }"}
            </text>
            <text
              x="228"
              y="114"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ exact fields, no waste
            </text>
            <text
              x="228"
              y="126"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ one endpoint
            </text>
            <text
              x="228"
              y="138"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ⚠ POST = no CDN cache
            </text>
            <text
              x="228"
              y="150"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ⚠ N+1 without DataLoader
            </text>
            {/* gRPC */}
            <rect
              x="316"
              y="26"
              width="132"
              height="36"
              rx="3"
              fill="#1a2e1a"
              stroke="#34d399"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            <text
              x="382"
              y="40"
              textAnchor="middle"
              className="fill-emerald-300 text-[8px]"
            >
              GetPost(id: "42")
            </text>
            <text
              x="382"
              y="54"
              textAnchor="middle"
              className="fill-neutral-500 text-[8px]"
            >
              Protobuf binary
            </text>
            <line
              x1="382"
              y1="64"
              x2="382"
              y2="74"
              stroke="#34d399"
              strokeWidth="1"
              markerEnd="url(#rgg-r)"
            />
            <rect
              x="316"
              y="76"
              width="132"
              height="22"
              rx="3"
              fill="#1a2e1a"
              stroke="#34d399"
              strokeWidth="1"
              strokeOpacity="0.4"
            />
            <text
              x="382"
              y="91"
              textAnchor="middle"
              className="fill-neutral-400 text-[8px]"
            >
              Post {"{"} id, title, … {"}"} binary
            </text>
            <text
              x="382"
              y="114"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ smallest payload
            </text>
            <text
              x="382"
              y="126"
              textAnchor="middle"
              className="fill-emerald-400/80 text-[8px]"
            >
              ✓ streaming built-in
            </text>
            <text
              x="382"
              y="138"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ⚠ needs code gen
            </text>
            <text
              x="382"
              y="150"
              textAnchor="middle"
              className="fill-amber-400/80 text-[8px]"
            >
              ⚠ no browser support
            </text>
            {/* dividers */}
            <line
              x1="152"
              y1="20"
              x2="152"
              y2="168"
              stroke="#27272a"
              strokeWidth="1"
            />
            <line
              x1="304"
              y1="20"
              x2="304"
              y2="168"
              stroke="#27272a"
              strokeWidth="1"
            />
            <text
              x="230"
              y="184"
              textAnchor="middle"
              className="fill-neutral-600 text-[8px]"
            >
              REST → public APIs · GraphQL → BFF / multi-client · gRPC →
              internal services
            </text>
          </svg>
        </figure>
      );

    case "cursor-pagination":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Cursor vs offset pagination — offset drifts on inserts; cursor stays
            stable
          </figcaption>
          <svg viewBox="0 0 460 172" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="cp-a"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#71717a" />
              </marker>
              <marker
                id="cp-r"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
              </marker>
              <marker
                id="cp-g"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
            </defs>
            {/* Labels */}
            <text
              x="114"
              y="14"
              textAnchor="middle"
              className="fill-red-400 text-[9px] font-semibold"
            >
              Offset (broken on insert)
            </text>
            <text
              x="344"
              y="14"
              textAnchor="middle"
              className="fill-emerald-400 text-[9px] font-semibold"
            >
              Cursor (stable)
            </text>
            <line
              x1="228"
              y1="8"
              x2="228"
              y2="168"
              stroke="#27272a"
              strokeWidth="1"
            />
            {/* Offset side — rows */}
            {[
              "Post E (new insert)",
              "Post D",
              "Post C",
              "Post B",
              "Post A",
            ].map((label, i) => {
              const y = 28 + i * 22;
              const isNew = i === 0;
              const isPage1 = i >= 1 && i <= 2;
              const isDupe = i === 2;
              return (
                <g key={label}>
                  <rect
                    x="12"
                    y={y}
                    width="148"
                    height="18"
                    rx="2"
                    fill={isNew ? "#3b0f14" : isDupe ? "#2d1a1a" : "#1c1c1e"}
                    stroke={isNew ? "#f87171" : isDupe ? "#fb923c" : "#3f3f46"}
                    strokeWidth={isNew ? 1.5 : 1}
                  />
                  <text
                    x="86"
                    y={y + 12}
                    textAnchor="middle"
                    className={`text-[8px] ${isNew ? "fill-red-300" : isDupe ? "fill-orange-300" : "fill-neutral-400"}`}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            <rect
              x="10"
              y="50"
              width="152"
              height="44"
              rx="2"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x="86"
              y="104"
              textAnchor="middle"
              className="fill-sky-400 text-[7px]"
            >
              Page 1: LIMIT 2 OFFSET 0
            </text>
            <rect
              x="10"
              y="72"
              width="152"
              height="44"
              rx="2"
              fill="none"
              stroke="#f87171"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x="86"
              y="126"
              textAnchor="middle"
              className="fill-red-400 text-[7px]"
            >
              Page 2: LIMIT 2 OFFSET 2 → Post C shown twice!
            </text>
            {/* Cursor side — rows */}
            {[
              "Post E (new insert)",
              "Post D",
              "Post C",
              "Post B",
              "Post A",
            ].map((label, i) => {
              const y = 28 + i * 22;
              const isNew = i === 0;
              return (
                <g key={label + "-r"}>
                  <rect
                    x="240"
                    y={y}
                    width="148"
                    height="18"
                    rx="2"
                    fill={isNew ? "#1a2e1a" : "#1c1c1e"}
                    stroke={isNew ? "#4ade80" : "#3f3f46"}
                    strokeWidth={isNew ? 1.5 : 1}
                  />
                  <text
                    x="314"
                    y={y + 12}
                    textAnchor="middle"
                    className={`text-[8px] ${isNew ? "fill-emerald-300" : "fill-neutral-400"}`}
                  >
                    {label}
                  </text>
                </g>
              );
            })}
            <rect
              x="238"
              y="50"
              width="152"
              height="44"
              rx="2"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x="314"
              y="104"
              textAnchor="middle"
              className="fill-sky-400 text-[7px]"
            >
              Page 1: WHERE ... LIMIT 2 → cursor = Post D
            </text>
            <rect
              x="238"
              y="72"
              width="152"
              height="44"
              rx="2"
              fill="none"
              stroke="#4ade80"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x="314"
              y="126"
              textAnchor="middle"
              className="fill-emerald-400 text-[7px]"
            >
              Page 2: WHERE key {"<"} cursor → Post C, Post B ✓
            </text>
            <text
              x="314"
              y="138"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              New insert shifts nothing — cursor is a key, not a position
            </text>
            <text
              x="230"
              y="160"
              textAnchor="middle"
              className="fill-neutral-600 text-[8px]"
            >
              Cursor query: WHERE (created_at, id) {"<"} ($ts, $id) ORDER BY
              created_at DESC LIMIT n
            </text>
          </svg>
        </figure>
      );

    case "rate-limit-token-bucket":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Token bucket — refill at rate R/sec, consume 1 per request, allow
            bursts up to capacity N
          </figcaption>
          <svg viewBox="0 0 420 168" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="tb-a"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#71717a" />
              </marker>
              <marker
                id="tb-g"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
              <marker
                id="tb-r"
                markerWidth="5"
                markerHeight="5"
                refX="4"
                refY="2.5"
                orient="auto"
              >
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
              </marker>
            </defs>
            {/* Bucket */}
            <rect
              x="148"
              y="48"
              width="84"
              height="80"
              rx="4"
              fill="#1c1c1e"
              stroke="#52525b"
              strokeWidth="1.5"
            />
            <text
              x="190"
              y="42"
              textAnchor="middle"
              className="fill-neutral-400 text-[9px]"
            >
              bucket (capacity = 10)
            </text>
            {/* Tokens inside bucket */}
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <circle
                key={i}
                cx={162 + (i % 4) * 18}
                cy={68 + Math.floor(i / 4) * 18}
                r="6"
                fill="#1e3a5f"
                stroke="#38bdf8"
                strokeWidth="1"
                strokeOpacity="0.7"
              />
            ))}
            <text
              x="190"
              y="120"
              textAnchor="middle"
              className="fill-sky-400 text-[8px]"
            >
              7 tokens left
            </text>
            {/* Refill arrow (top) */}
            <line
              x1="190"
              y1="20"
              x2="190"
              y2="46"
              stroke="#4ade80"
              strokeWidth="1.5"
              markerEnd="url(#tb-g)"
            />
            <text
              x="190"
              y="16"
              textAnchor="middle"
              className="fill-emerald-400 text-[8px]"
            >
              +R tokens/sec (refill)
            </text>
            {/* Request comes in (left) */}
            <line
              x1="50"
              y1="90"
              x2="146"
              y2="90"
              stroke="#38bdf8"
              strokeWidth="1.5"
              markerEnd="url(#tb-a)"
            />
            <text
              x="98"
              y="85"
              textAnchor="middle"
              className="fill-sky-400 text-[8px]"
            >
              request
            </text>
            {/* Allowed path (right) */}
            <line
              x1="234"
              y1="78"
              x2="310"
              y2="78"
              stroke="#4ade80"
              strokeWidth="1.5"
              markerEnd="url(#tb-g)"
            />
            <rect
              x="312"
              y="66"
              width="72"
              height="24"
              rx="3"
              fill="#1a2e1a"
              stroke="#4ade80"
              strokeWidth="1"
            />
            <text
              x="348"
              y="82"
              textAnchor="middle"
              className="fill-emerald-300 text-[8px]"
            >
              200 OK
            </text>
            <text
              x="270"
              y="73"
              textAnchor="middle"
              className="fill-emerald-400 text-[7px]"
            >
              token {">"} 0: consume 1
            </text>
            {/* Rejected path (right, lower) */}
            <line
              x1="234"
              y1="110"
              x2="310"
              y2="110"
              stroke="#f87171"
              strokeWidth="1.5"
              markerEnd="url(#tb-r)"
            />
            <rect
              x="312"
              y="98"
              width="72"
              height="24"
              rx="3"
              fill="#3b0f14"
              stroke="#f87171"
              strokeWidth="1"
            />
            <text
              x="348"
              y="114"
              textAnchor="middle"
              className="fill-red-300 text-[8px]"
            >
              429 Too Many
            </text>
            <text
              x="270"
              y="106"
              textAnchor="middle"
              className="fill-red-400 text-[7px]"
            >
              bucket empty
            </text>
            {/* Burst note */}
            <text x="14" y="148" className="fill-neutral-500 text-[8px]">
              Burst: if bucket is full (10 tokens), client can fire 10 rapid
              requests before rate-limiting kicks in.
            </text>
            <text x="14" y="160" className="fill-neutral-500 text-[8px]">
              Long-term average is always bounded by the refill rate R.
            </text>
          </svg>
        </figure>
      );

    // ── Day 5: Authentication & authorisation ──────────────────────────────
    case "jwt-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            JWT lifecycle — credentials in, signed token out, stateless
            validation on every request
          </figcaption>
          <svg viewBox="0 0 380 200" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="jwt-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker
                id="jwt-grn"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker
                id="jwt-sky"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
            </defs>
            {/* actors */}
            <rect
              x="10"
              y="10"
              width="60"
              height="24"
              rx="4"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />
            <text
              x="40"
              y="26"
              textAnchor="middle"
              className="fill-neutral-300 text-[9px]"
            >
              Client
            </text>
            <rect
              x="160"
              y="10"
              width="60"
              height="24"
              rx="4"
              fill="#1e293b"
              stroke="#334155"
              strokeWidth="1"
            />
            <text
              x="190"
              y="26"
              textAnchor="middle"
              className="fill-neutral-300 text-[9px]"
            >
              Server
            </text>
            {/* vertical lifelines */}
            <line
              x1="40"
              y1="34"
              x2="40"
              y2="196"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <line
              x1="190"
              y1="34"
              x2="190"
              y2="196"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {/* step 1: POST /login */}
            <line
              x1="40"
              y1="55"
              x2="184"
              y2="55"
              stroke="#94a3b8"
              strokeWidth="1.2"
              markerEnd="url(#jwt-arr)"
            />
            <text
              x="112"
              y="50"
              textAnchor="middle"
              className="fill-neutral-400 text-[8px]"
            >
              POST /login {"{"}email, password{"}"}
            </text>
            {/* step 2: validate + sign */}
            <rect
              x="170"
              y="62"
              width="40"
              height="16"
              rx="3"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            <text
              x="190"
              y="73"
              textAnchor="middle"
              className="fill-sky-300 text-[7px]"
            >
              sign JWT
            </text>
            {/* step 3: return token */}
            <line
              x1="190"
              y1="84"
              x2="46"
              y2="84"
              stroke="#4ade80"
              strokeWidth="1.2"
              markerEnd="url(#jwt-grn)"
            />
            <text
              x="112"
              y="80"
              textAnchor="middle"
              className="fill-green-400 text-[8px]"
            >
              200 {"{"}access_token, refresh_token{"}"}
            </text>
            {/* step 4: store in httpOnly cookie */}
            <rect
              x="10"
              y="92"
              width="60"
              height="16"
              rx="3"
              fill="#1e3a2f"
              stroke="#4ade80"
              strokeWidth="0.8"
            />
            <text
              x="40"
              y="103"
              textAnchor="middle"
              className="fill-green-300 text-[7px]"
            >
              httpOnly cookie
            </text>
            {/* step 5: API request with token */}
            <line
              x1="40"
              y1="118"
              x2="184"
              y2="118"
              stroke="#94a3b8"
              strokeWidth="1.2"
              markerEnd="url(#jwt-arr)"
            />
            <text
              x="112"
              y="113"
              textAnchor="middle"
              className="fill-neutral-400 text-[8px]"
            >
              GET /api/me Authorization: Bearer …
            </text>
            {/* step 6: verify signature */}
            <rect
              x="170"
              y="124"
              width="40"
              height="16"
              rx="3"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            <text
              x="190"
              y="135"
              textAnchor="middle"
              className="fill-sky-300 text-[7px]"
            >
              verify sig
            </text>
            {/* step 7: response */}
            <line
              x1="190"
              y1="146"
              x2="46"
              y2="146"
              stroke="#4ade80"
              strokeWidth="1.2"
              markerEnd="url(#jwt-grn)"
            />
            <text
              x="112"
              y="142"
              textAnchor="middle"
              className="fill-green-400 text-[8px]"
            >
              200 user data (no DB session lookup)
            </text>
            {/* JWT anatomy label */}
            <text x="270" y="20" className="fill-neutral-500 text-[8px]">
              JWT = header.payload.signature
            </text>
            <rect
              x="258"
              y="26"
              width="112"
              height="38"
              rx="3"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text x="264" y="38" className="fill-sky-400 text-[7px]">
              header: {"{"} alg, typ {"}"}
            </text>
            <text x="264" y="49" className="fill-amber-400 text-[7px]">
              payload: {"{"} sub, roles, exp {"}"}
            </text>
            <text x="264" y="60" className="fill-rose-400 text-[7px]">
              sig: HMAC(header.payload)
            </text>
            {/* expiry note */}
            <text x="258" y="76" className="fill-neutral-500 text-[7px]">
              access_token: 15 min | refresh: 7 d
            </text>
          </svg>
        </figure>
      );

    case "oauth2-code-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            OAuth2 authorisation code flow + PKCE — four parties, six steps
          </figcaption>
          <svg viewBox="0 0 420 220" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="oa-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker
                id="oa-grn"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>
            {/* four actor boxes */}
            {[
              { x: 10, label: "Browser" },
              { x: 110, label: "Your App" },
              { x: 230, label: "Auth Server" },
              { x: 340, label: "Resource" },
            ].map(({ x, label }) => (
              <g key={label}>
                <rect
                  x={x}
                  y="8"
                  width="64"
                  height="22"
                  rx="3"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={x + 32}
                  y="22"
                  textAnchor="middle"
                  className="fill-neutral-300 text-[8px]"
                >
                  {label}
                </text>
                <line
                  x1={x + 32}
                  y1="30"
                  x2={x + 32}
                  y2="216"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </g>
            ))}
            {/* step 1 */}
            <line
              x1="74"
              y1="48"
              x2="174"
              y2="48"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#oa-arr)"
            />
            <text
              x="122"
              y="44"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              1. click Login
            </text>
            {/* step 2 */}
            <line
              x1="174"
              y1="66"
              x2="282"
              y2="66"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#oa-arr)"
            />
            <text
              x="228"
              y="62"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              2. redirect /authorize + code_challenge
            </text>
            {/* step 3 */}
            <line
              x1="282"
              y1="84"
              x2="120"
              y2="84"
              stroke="#4ade80"
              strokeWidth="1"
              markerEnd="url(#oa-grn)"
            />
            <text
              x="200"
              y="80"
              textAnchor="middle"
              className="fill-green-400 text-[7px]"
            >
              3. user logs in → redirect with code + state
            </text>
            {/* step 4 */}
            <line
              x1="174"
              y1="104"
              x2="282"
              y2="104"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#oa-arr)"
            />
            <text
              x="228"
              y="100"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              4. POST /token (code + code_verifier)
            </text>
            {/* step 5 */}
            <line
              x1="282"
              y1="122"
              x2="180"
              y2="122"
              stroke="#4ade80"
              strokeWidth="1"
              markerEnd="url(#oa-grn)"
            />
            <text
              x="228"
              y="118"
              textAnchor="middle"
              className="fill-green-400 text-[7px]"
            >
              5. access_token + id_token
            </text>
            {/* step 6 */}
            <line
              x1="174"
              y1="142"
              x2="356"
              y2="142"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#oa-arr)"
            />
            <text
              x="264"
              y="138"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              6. GET /userinfo Authorization: Bearer …
            </text>
            {/* step 6 response */}
            <line
              x1="356"
              y1="158"
              x2="180"
              y2="158"
              stroke="#4ade80"
              strokeWidth="1"
              markerEnd="url(#oa-grn)"
            />
            <text
              x="264"
              y="154"
              textAnchor="middle"
              className="fill-green-400 text-[7px]"
            >
              200 {"{"} sub, email, name {"}"}
            </text>
            {/* PKCE note */}
            <rect
              x="8"
              y="174"
              width="400"
              height="34"
              rx="3"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text x="14" y="186" className="fill-amber-400 text-[7px]">
              PKCE: client generates code_verifier (random), sends
              code_challenge = SHA256(verifier) in step 2.
            </text>
            <text x="14" y="198" className="fill-neutral-400 text-[7px]">
              Step 4 sends the verifier — server recomputes the hash. Stolen
              codes cannot be exchanged without the verifier.
            </text>
          </svg>
        </figure>
      );

    case "rbac-model":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            RBAC — users assigned to roles; roles carry permissions; permissions
            map to resources
          </figcaption>
          <svg viewBox="0 0 380 180" className="h-auto w-full" aria-hidden>
            {/* column headers */}
            {[
              { x: 30, label: "Users", color: "#38bdf8" },
              { x: 140, label: "Roles", color: "#a78bfa" },
              { x: 250, label: "Permissions", color: "#fb923c" },
              { x: 340, label: "Resources", color: "#4ade80" },
            ].map(({ x, label, color }) => (
              <text
                key={label}
                x={x + 20}
                y="18"
                textAnchor="middle"
                style={{ fill: color }}
                className="text-[9px] font-semibold"
              >
                {label}
              </text>
            ))}
            {/* users */}
            {["Alice", "Bob", "Carol"].map((u, i) => (
              <g key={u}>
                <rect
                  x="10"
                  y={30 + i * 36}
                  width="60"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#38bdf8"
                  strokeWidth="0.8"
                />
                <text
                  x="40"
                  y={44 + i * 36}
                  textAnchor="middle"
                  className="fill-sky-300 text-[8px]"
                >
                  {u}
                </text>
              </g>
            ))}
            {/* roles */}
            {["admin", "editor", "viewer"].map((r, i) => (
              <g key={r}>
                <rect
                  x="120"
                  y={30 + i * 36}
                  width="60"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#a78bfa"
                  strokeWidth="0.8"
                />
                <text
                  x="150"
                  y={44 + i * 36}
                  textAnchor="middle"
                  className="fill-violet-300 text-[8px]"
                >
                  {r}
                </text>
              </g>
            ))}
            {/* permissions */}
            {["read", "write", "delete"].map((p, i) => (
              <g key={p}>
                <rect
                  x="230"
                  y={30 + i * 36}
                  width="60"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#fb923c"
                  strokeWidth="0.8"
                />
                <text
                  x="260"
                  y={44 + i * 36}
                  textAnchor="middle"
                  className="fill-orange-300 text-[8px]"
                >
                  {p}
                </text>
              </g>
            ))}
            {/* resources */}
            {["/users", "/posts", "/admin"].map((res, i) => (
              <g key={res}>
                <rect
                  x="320"
                  y={30 + i * 36}
                  width="52"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#4ade80"
                  strokeWidth="0.8"
                />
                <text
                  x="346"
                  y={44 + i * 36}
                  textAnchor="middle"
                  className="fill-green-300 text-[8px]"
                >
                  {res}
                </text>
              </g>
            ))}
            {/* arrows: user → role */}
            <line
              x1="70"
              y1="41"
              x2="120"
              y2="41"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="70"
              y1="77"
              x2="120"
              y2="77"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="70"
              y1="41"
              x2="120"
              y2="77"
              stroke="#64748b"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
            {/* role → permission */}
            <line
              x1="180"
              y1="41"
              x2="230"
              y2="41"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="180"
              y1="41"
              x2="230"
              y2="77"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="180"
              y1="41"
              x2="230"
              y2="113"
              stroke="#64748b"
              strokeWidth="0.8"
              strokeDasharray="2 2"
            />
            <line
              x1="180"
              y1="77"
              x2="230"
              y2="41"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="180"
              y1="77"
              x2="230"
              y2="77"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* permission → resource */}
            <line
              x1="290"
              y1="41"
              x2="320"
              y2="41"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="290"
              y1="77"
              x2="320"
              y2="77"
              stroke="#64748b"
              strokeWidth="1"
            />
            <line
              x1="290"
              y1="113"
              x2="320"
              y2="113"
              stroke="#64748b"
              strokeWidth="1"
            />
            {/* legend note */}
            <text x="10" y="165" className="fill-neutral-500 text-[7px]">
              Carol has viewer role → read permission only → can GET /posts, not
              DELETE /users
            </text>
          </svg>
        </figure>
      );

    // ── Day 6: Caching strategies ──────────────────────────────────────────
    case "cache-layers":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Cache hierarchy — latency and scope increase as you go deeper
          </figcaption>
          <svg viewBox="0 0 380 200" className="h-auto w-full" aria-hidden>
            {/* layers as concentric rounded rects */}
            {[
              {
                y: 10,
                h: 174,
                fill: "#1e3a5f",
                stroke: "#38bdf8",
                label: "HTTP Browser Cache",
                sub: "0 ms · per-browser · immutable assets",
                lx: 190,
              },
              {
                y: 28,
                h: 140,
                fill: "#1e3828",
                stroke: "#4ade80",
                label: "CDN Edge (Cloudflare, Fastly)",
                sub: "10-50 ms · global PoP · public API responses",
                lx: 190,
              },
              {
                y: 48,
                h: 104,
                fill: "#2d1e3a",
                stroke: "#a78bfa",
                label: "Redis / Memcached",
                sub: "1-5 ms · shared cluster · sessions, counters",
                lx: 190,
              },
              {
                y: 68,
                h: 68,
                fill: "#3a2e1e",
                stroke: "#fb923c",
                label: "In-process LRU",
                sub: "< 1 ms · single instance · config, flags",
                lx: 190,
              },
              {
                y: 90,
                h: 26,
                fill: "#1e1e1e",
                stroke: "#f87171",
                label: "Origin DB",
                sub: "100-500 ms",
                lx: 190,
              },
            ].map(({ y, h, fill, stroke, label, sub, lx }) => (
              <g key={label}>
                <rect
                  x="20"
                  y={y}
                  width="340"
                  height={h}
                  rx="8"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth="0.8"
                  opacity="0.6"
                />
                <text
                  x={lx}
                  y={y + 12}
                  textAnchor="middle"
                  style={{ fill: stroke }}
                  className="text-[8px] font-semibold"
                >
                  {label}
                </text>
                <text
                  x={lx}
                  y={y + 22}
                  textAnchor="middle"
                  className="fill-neutral-400 text-[7px]"
                >
                  {sub}
                </text>
              </g>
            ))}
          </svg>
        </figure>
      );

    case "cache-aside-pattern":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Cache-aside — app manages reads and write-invalidation explicitly
          </figcaption>
          <svg viewBox="0 0 420 190" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="ca-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
              <marker
                id="ca-grn"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker
                id="ca-red"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#f87171" />
              </marker>
            </defs>
            {/* boxes */}
            <rect
              x="10"
              y="20"
              width="60"
              height="22"
              rx="4"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <text
              x="40"
              y="34"
              textAnchor="middle"
              className="fill-sky-300 text-[9px]"
            >
              App
            </text>
            <rect
              x="160"
              y="20"
              width="60"
              height="22"
              rx="4"
              fill="#1e293b"
              stroke="#a78bfa"
              strokeWidth="1"
            />
            <text
              x="190"
              y="34"
              textAnchor="middle"
              className="fill-violet-300 text-[9px]"
            >
              Cache
            </text>
            <rect
              x="310"
              y="20"
              width="60"
              height="22"
              rx="4"
              fill="#1e293b"
              stroke="#4ade80"
              strokeWidth="1"
            />
            <text
              x="340"
              y="34"
              textAnchor="middle"
              className="fill-green-300 text-[9px]"
            >
              Database
            </text>
            {/* READ PATH */}
            <text
              x="10"
              y="58"
              className="fill-sky-400 text-[8px] font-semibold"
            >
              READ PATH
            </text>
            <line
              x1="70"
              y1="66"
              x2="154"
              y2="66"
              stroke="#94a3b8"
              strokeWidth="1.1"
              markerEnd="url(#ca-arr)"
            />
            <text
              x="112"
              y="62"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              check cache
            </text>
            <line
              x1="160"
              y1="80"
              x2="76"
              y2="80"
              stroke="#f87171"
              strokeWidth="1.1"
              markerEnd="url(#ca-red)"
            />
            <text
              x="112"
              y="76"
              textAnchor="middle"
              className="fill-red-400 text-[7px]"
            >
              MISS
            </text>
            <line
              x1="70"
              y1="95"
              x2="304"
              y2="95"
              stroke="#94a3b8"
              strokeWidth="1.1"
              markerEnd="url(#ca-arr)"
            />
            <text
              x="186"
              y="91"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              read DB
            </text>
            <line
              x1="310"
              y1="109"
              x2="226"
              y2="109"
              stroke="#4ade80"
              strokeWidth="1.1"
              markerEnd="url(#ca-grn)"
            />
            <text
              x="266"
              y="105"
              textAnchor="middle"
              className="fill-green-400 text-[7px]"
            >
              data
            </text>
            <line
              x1="220"
              y1="123"
              x2="76"
              y2="123"
              stroke="#94a3b8"
              strokeWidth="1.1"
              markerEnd="url(#ca-arr)"
            />
            <text
              x="148"
              y="117"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              write to cache (TTL=5m) + return
            </text>
            {/* WRITE PATH */}
            <text
              x="10"
              y="148"
              className="fill-amber-400 text-[8px] font-semibold"
            >
              WRITE PATH
            </text>
            <line
              x1="70"
              y1="158"
              x2="304"
              y2="158"
              stroke="#94a3b8"
              strokeWidth="1.1"
              markerEnd="url(#ca-arr)"
            />
            <text
              x="186"
              y="154"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              write DB
            </text>
            <line
              x1="70"
              y1="173"
              x2="154"
              y2="173"
              stroke="#f87171"
              strokeWidth="1.1"
              markerEnd="url(#ca-red)"
            />
            <text
              x="112"
              y="169"
              textAnchor="middle"
              className="fill-red-400 text-[7px]"
            >
              DEL key (invalidate)
            </text>
          </svg>
        </figure>
      );

    // ── Day 7: Error handling & logging ───────────────────────────────────
    case "log-correlation":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Correlation ID propagation — one ID ties logs across every service
            in a request
          </figcaption>
          <svg viewBox="0 0 420 190" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="lc-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
            </defs>
            {/* service boxes */}
            {[
              { x: 10, label: "Gateway" },
              { x: 120, label: "Service A" },
              { x: 230, label: "Service B" },
              { x: 340, label: "Service C" },
            ].map(({ x, label }) => (
              <g key={label}>
                <rect
                  x={x}
                  y="10"
                  width="70"
                  height="22"
                  rx="4"
                  fill="#1e293b"
                  stroke="#334155"
                  strokeWidth="1"
                />
                <text
                  x={x + 35}
                  y="24"
                  textAnchor="middle"
                  className="fill-neutral-300 text-[8px]"
                >
                  {label}
                </text>
                <line
                  x1={x + 35}
                  y1="32"
                  x2={x + 35}
                  y2="148"
                  stroke="#334155"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
              </g>
            ))}
            {/* incoming request */}
            <line
              x1="0"
              y1="50"
              x2="9"
              y2="50"
              stroke="#94a3b8"
              strokeWidth="1.2"
              markerEnd="url(#lc-arr)"
            />
            <text x="2" y="46" className="fill-neutral-500 text-[7px]">
              req
            </text>
            {/* generate correlation ID */}
            <rect
              x="10"
              y="56"
              width="70"
              height="16"
              rx="3"
              fill="#1e3a5f"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
            <text
              x="45"
              y="67"
              textAnchor="middle"
              className="fill-sky-300 text-[7px]"
            >
              gen corr_id
            </text>
            {/* propagate */}
            <line
              x1="80"
              y1="80"
              x2="120"
              y2="80"
              stroke="#38bdf8"
              strokeWidth="1.2"
              markerEnd="url(#lc-arr)"
            />
            <text
              x="100"
              y="76"
              textAnchor="middle"
              className="fill-sky-400 text-[7px]"
            >
              + corr_id
            </text>
            <line
              x1="190"
              y1="80"
              x2="230"
              y2="80"
              stroke="#38bdf8"
              strokeWidth="1.2"
              markerEnd="url(#lc-arr)"
            />
            <text
              x="210"
              y="76"
              textAnchor="middle"
              className="fill-sky-400 text-[7px]"
            >
              + corr_id
            </text>
            <line
              x1="300"
              y1="80"
              x2="340"
              y2="80"
              stroke="#38bdf8"
              strokeWidth="1.2"
              markerEnd="url(#lc-arr)"
            />
            <text
              x="320"
              y="76"
              textAnchor="middle"
              className="fill-sky-400 text-[7px]"
            >
              + corr_id
            </text>
            {/* log lines */}
            <text x="14" y="106" className="fill-neutral-500 text-[7px]">
              log: corr_id=req_abc
            </text>
            <text x="124" y="106" className="fill-neutral-500 text-[7px]">
              log: corr_id=req_abc
            </text>
            <text x="234" y="106" className="fill-neutral-500 text-[7px]">
              log: corr_id=req_abc
            </text>
            <text x="344" y="106" className="fill-neutral-500 text-[7px]">
              log: corr_id=req_abc
            </text>
            {/* aggregator band */}
            <rect
              x="10"
              y="120"
              width="400"
              height="24"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text
              x="210"
              y="131"
              textAnchor="middle"
              className="fill-sky-400 text-[8px] font-semibold"
            >
              Log Aggregator — filter: corr_id = req_abc
            </text>
            <text
              x="210"
              y="140"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              → complete timeline: Gateway → A → B → C in order
            </text>
            {/* arrow up from logs to aggregator */}
            <line
              x1="210"
              y1="113"
              x2="210"
              y2="120"
              stroke="#334155"
              strokeWidth="1"
            />
            {/* return corr_id in response */}
            <text x="10" y="162" className="fill-neutral-500 text-[7px]">
              Response header: X-Correlation-Id: req_abc (client includes in bug
              reports)
            </text>
          </svg>
        </figure>
      );

    case "error-classification":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Error classification — route each error to the right action
          </figcaption>
          <svg viewBox="0 0 400 200" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="ec-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#94a3b8" />
              </marker>
            </defs>
            {/* root */}
            <rect
              x="150"
              y="8"
              width="100"
              height="22"
              rx="4"
              fill="#1e293b"
              stroke="#94a3b8"
              strokeWidth="1"
            />
            <text
              x="200"
              y="22"
              textAnchor="middle"
              className="fill-neutral-300 text-[9px]"
            >
              Error received
            </text>
            {/* 4xx branch */}
            <line
              x1="200"
              y1="30"
              x2="80"
              y2="58"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#ec-arr)"
            />
            <text
              x="120"
              y="48"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              4xx?
            </text>
            <rect
              x="20"
              y="58"
              width="100"
              height="26"
              rx="4"
              fill="#1e2a1e"
              stroke="#4ade80"
              strokeWidth="1"
            />
            <text
              x="70"
              y="70"
              textAnchor="middle"
              className="fill-green-300 text-[8px]"
            >
              Client error
            </text>
            <text
              x="70"
              y="80"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              400 401 403 404 422
            </text>
            <rect
              x="20"
              y="96"
              width="100"
              height="36"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text
              x="70"
              y="108"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Log at warn/info
            </text>
            <text
              x="70"
              y="118"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Return descriptive error
            </text>
            <text
              x="70"
              y="128"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Do not retry
            </text>
            {/* 503 branch */}
            <line
              x1="200"
              y1="30"
              x2="200"
              y2="58"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#ec-arr)"
            />
            <text x="210" y="48" className="fill-neutral-500 text-[7px]">
              5xx transient?
            </text>
            <rect
              x="150"
              y="58"
              width="100"
              height="26"
              rx="4"
              fill="#2d1e1e"
              stroke="#fb923c"
              strokeWidth="1"
            />
            <text
              x="200"
              y="70"
              textAnchor="middle"
              className="fill-orange-300 text-[8px]"
            >
              Transient error
            </text>
            <text
              x="200"
              y="80"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              502 503 504 timeout
            </text>
            <rect
              x="150"
              y="96"
              width="100"
              height="36"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text
              x="200"
              y="108"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Log at warn
            </text>
            <text
              x="200"
              y="118"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Retry with backoff + jitter
            </text>
            <text
              x="200"
              y="128"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Alert if sustained
            </text>
            {/* 500 bug branch */}
            <line
              x1="200"
              y1="30"
              x2="320"
              y2="58"
              stroke="#94a3b8"
              strokeWidth="1"
              markerEnd="url(#ec-arr)"
            />
            <text
              x="282"
              y="48"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              500 bug?
            </text>
            <rect
              x="280"
              y="58"
              width="100"
              height="26"
              rx="4"
              fill="#2d1e1e"
              stroke="#f87171"
              strokeWidth="1"
            />
            <text
              x="330"
              y="70"
              textAnchor="middle"
              className="fill-red-300 text-[8px]"
            >
              Programmer error
            </text>
            <text
              x="330"
              y="80"
              textAnchor="middle"
              className="fill-neutral-500 text-[7px]"
            >
              500 unhandled exception
            </text>
            <rect
              x="280"
              y="96"
              width="100"
              height="36"
              rx="4"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="0.8"
            />
            <text
              x="330"
              y="108"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Log at error + stack
            </text>
            <text
              x="330"
              y="118"
              textAnchor="middle"
              className="fill-neutral-400 text-[7px]"
            >
              Return generic 500
            </text>
            <text
              x="330"
              y="128"
              textAnchor="middle"
              className="fill-red-400 text-[7px]"
            >
              Alert immediately
            </text>
            {/* 429 note */}
            <text x="10" y="150" className="fill-amber-400 text-[7px]">
              * 429 Too Many Requests is a client error but the client should
              retry after the Retry-After header delay.
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
