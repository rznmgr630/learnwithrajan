import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const fig =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

const WEEK2_IDS = new Set<RoadmapDetailDiagramId>([
  "lb-round-robin",
  "lb-ha-failover",
  "erd-one-many",
  "deadlock-cycle",
  "cap-theorem",
  "primary-replica",
  "cqrs-sketch",
  "inverted-index",
  "queue-backpressure",
  "producer-consumer",
]);

export function isWeek2Diagram(id: RoadmapDetailDiagramId): boolean {
  return WEEK2_IDS.has(id);
}

export function Week2Diagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    // ── Day 8: Load balancer round-robin ──────────────────────────────
    case "lb-round-robin":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            L7 load balancer — round-robin across three backend instances
          </figcaption>
          <svg viewBox="0 0 420 160" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lb-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#38bdf8" />
              </marker>
            </defs>
            {/* Client */}
            <rect x="8" y="60" width="72" height="40" rx="4" fill="#1c1c1e" stroke="#3f3f46" strokeWidth="1" />
            <text x="44" y="78" textAnchor="middle" className="fill-neutral-300 text-[9px] font-semibold">Client</text>
            <text x="44" y="92" textAnchor="middle" className="fill-neutral-500 text-[8px]">browser / app</text>
            {/* Arrow client → LB */}
            <line x1="82" y1="80" x2="148" y2="80" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#lb-arr)" />
            {/* Load Balancer */}
            <rect x="152" y="44" width="90" height="72" rx="4" fill="#082f49" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="197" y="68" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">Load</text>
            <text x="197" y="82" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">Balancer</text>
            <text x="197" y="98" textAnchor="middle" className="fill-neutral-500 text-[8px]">nginx / ALB</text>
            <text x="197" y="110" textAnchor="middle" className="fill-neutral-600 text-[8px]">health checks ✓</text>
            {/* Arrows LB → backends */}
            <line x1="244" y1="64" x2="310" y2="40" stroke="#38bdf8" strokeWidth="1.2" markerEnd="url(#lb-arr)" />
            <line x1="244" y1="80" x2="310" y2="80" stroke="#38bdf8" strokeWidth="1.2" markerEnd="url(#lb-arr)" />
            <line x1="244" y1="96" x2="310" y2="120" stroke="#38bdf8" strokeWidth="1.2" markerEnd="url(#lb-arr)" />
            {/* Backends */}
            {[
              { y: 20, label: "Server A", req: "R1, R4" },
              { y: 60, label: "Server B", req: "R2, R5" },
              { y: 100, label: "Server C", req: "R3, R6" },
            ].map(({ y, label, req }) => (
              <g key={label}>
                <rect x="312" y={y} width="96" height="36" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.6" />
                <text x="360" y={y + 14} textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">{label}</text>
                <text x="360" y={y + 27} textAnchor="middle" className="fill-neutral-500 text-[8px]">{req}</text>
              </g>
            ))}
            <text x="8" y="152" className="fill-neutral-600 text-[8px]">Round-robin: R1→A, R2→B, R3→C, R4→A … Least-conn variant routes by active connection count.</text>
          </svg>
        </figure>
      );

    // ── Day 8: HA failover ────────────────────────────────────────────
    case "lb-ha-failover":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Active health check — unhealthy backend removed from rotation
          </figcaption>
          <svg viewBox="0 0 380 148" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="hc-ok" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
              <marker id="hc-fail" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
              </marker>
            </defs>
            {/* LB box */}
            <rect x="140" y="50" width="100" height="48" rx="4" fill="#082f49" stroke="#0ea5e9" strokeWidth="1.5" />
            <text x="190" y="72" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">Load Balancer</text>
            <text x="190" y="88" textAnchor="middle" className="fill-neutral-500 text-[8px]">probes /health every 5s</text>
            {/* Healthy server */}
            <rect x="14" y="54" width="96" height="40" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.5" />
            <text x="62" y="72" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Server A — healthy</text>
            <text x="62" y="85" textAnchor="middle" className="fill-emerald-400 text-[8px]">200 OK ← /health</text>
            {/* Unhealthy server */}
            <rect x="270" y="54" width="96" height="40" rx="4" fill="#3b0f14" stroke="#f87171" strokeWidth="1.5" />
            <text x="318" y="72" textAnchor="middle" className="fill-red-300 text-[9px] font-semibold">Server B — down</text>
            <text x="318" y="85" textAnchor="middle" className="fill-red-400 text-[8px]">timeout — removed</text>
            {/* Arrows */}
            <line x1="138" y1="74" x2="112" y2="74" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#hc-ok)" />
            <line x1="242" y1="74" x2="268" y2="74" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#hc-fail)" />
            <text x="8" y="116" className="fill-neutral-600 text-[8px]">After 3 failed probes, Server B is removed. Traffic flows only to A. When B recovers, re-added after 2 successful probes.</text>
          </svg>
        </figure>
      );

    // ── Day 9: ERD one-to-many ────────────────────────────────────────
    case "erd-one-many":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Entity-relationship — users ↔ posts (1:N) and posts ↔ tags (M:N via junction)
          </figcaption>
          <svg viewBox="0 0 440 160" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="erd-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#a78bfa" />
              </marker>
            </defs>
            {/* users */}
            <rect x="8" y="28" width="106" height="92" rx="4" fill="#1c1c1e" stroke="#a78bfa" strokeWidth="1.5" />
            <rect x="8" y="28" width="106" height="22" rx="4" fill="#2e1065" />
            <text x="61" y="44" textAnchor="middle" className="fill-violet-300 text-[10px] font-semibold">users</text>
            {["🔑 id BIGSERIAL PK", "email TEXT UNIQUE", "name TEXT", "created_at TIMESTAMPTZ"].map((f, i) => (
              <text key={i} x="16" y={66 + i * 14} className="fill-neutral-400 text-[8px]">{f}</text>
            ))}
            {/* posts */}
            <rect x="168" y="8" width="116" height="108" rx="4" fill="#1c1c1e" stroke="#38bdf8" strokeWidth="1.5" />
            <rect x="168" y="8" width="116" height="22" rx="4" fill="#082f49" />
            <text x="226" y="24" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">posts</text>
            {["🔑 id BIGSERIAL PK", "🔗 user_id FK → users", "title TEXT", "status TEXT", "created_at TIMESTAMPTZ"].map((f, i) => (
              <text key={i} x="176" y={46 + i * 14} className="fill-neutral-400 text-[8px]">{f}</text>
            ))}
            {/* tags */}
            <rect x="340" y="52" width="88" height="60" rx="4" fill="#1c1c1e" stroke="#fb923c" strokeWidth="1.5" />
            <rect x="340" y="52" width="88" height="22" rx="4" fill="#431407" />
            <text x="384" y="68" textAnchor="middle" className="fill-orange-300 text-[10px] font-semibold">tags</text>
            {["🔑 id BIGSERIAL PK", "name TEXT UNIQUE"].map((f, i) => (
              <text key={i} x="348" y={90 + i * 14} className="fill-neutral-400 text-[8px]">{f}</text>
            ))}
            {/* 1:N arrow users→posts */}
            <line x1="116" y1="68" x2="166" y2="50" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#erd-arr)" />
            <text x="122" y="52" className="fill-violet-400 text-[8px]">1</text>
            <text x="150" y="44" className="fill-violet-400 text-[8px]">N</text>
            {/* M:N via junction */}
            <rect x="284" y="62" width="52" height="44" rx="3" fill="#1c1c1e" stroke="#fb923c" strokeWidth="1" strokeOpacity="0.6" />
            <text x="310" y="78" textAnchor="middle" className="fill-orange-300 text-[8px] font-semibold">post_tags</text>
            <text x="310" y="92" textAnchor="middle" className="fill-neutral-500 text-[7px]">post_id FK</text>
            <text x="310" y="102" textAnchor="middle" className="fill-neutral-500 text-[7px]">tag_id FK</text>
            <line x1="286" y1="84" x2="248" y2="84" stroke="#fb923c" strokeWidth="1.2" markerEnd="url(#erd-arr)" />
            <line x1="338" y1="84" x2="340" y2="84" stroke="#fb923c" strokeWidth="1.2" markerEnd="url(#erd-arr)" />
          </svg>
        </figure>
      );

    // ── Day 10: Deadlock cycle ────────────────────────────────────────
    case "deadlock-cycle":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Deadlock — Tx A holds lock on Row 1, waits for Row 2; Tx B holds Row 2, waits for Row 1
          </figcaption>
          <svg viewBox="0 0 360 148" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="dl-hold" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
              <marker id="dl-wait" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
              </marker>
            </defs>
            {/* Tx A */}
            <rect x="12" y="50" width="90" height="44" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="57" y="68" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">Transaction A</text>
            <text x="57" y="84" textAnchor="middle" className="fill-neutral-500 text-[8px]">SELECT…FOR UPDATE</text>
            {/* Tx B */}
            <rect x="258" y="50" width="90" height="44" rx="4" fill="#3b0f14" stroke="#f87171" strokeWidth="1.5" />
            <text x="303" y="68" textAnchor="middle" className="fill-red-300 text-[10px] font-semibold">Transaction B</text>
            <text x="303" y="84" textAnchor="middle" className="fill-neutral-500 text-[8px]">SELECT…FOR UPDATE</text>
            {/* Row 1 */}
            <rect x="136" y="16" width="88" height="32" rx="3" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" />
            <text x="180" y="32" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">accounts.id = 1</text>
            <text x="180" y="44" textAnchor="middle" className="fill-neutral-500 text-[7px]">balance = 1000</text>
            {/* Row 2 */}
            <rect x="136" y="100" width="88" height="32" rx="3" fill="#451a03" stroke="#fb923c" strokeWidth="1" />
            <text x="180" y="116" textAnchor="middle" className="fill-orange-300 text-[9px] font-semibold">accounts.id = 2</text>
            <text x="180" y="128" textAnchor="middle" className="fill-neutral-500 text-[7px]">balance = 500</text>
            {/* A holds Row1, waits Row2 */}
            <line x1="90" y1="62" x2="134" y2="36" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#dl-hold)" />
            <text x="96" y="44" className="fill-emerald-400 text-[7px]">holds</text>
            <line x1="90" y1="78" x2="134" y2="106" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#dl-wait)" />
            <text x="96" y="102" className="fill-red-400 text-[7px]">waits</text>
            {/* B holds Row2, waits Row1 */}
            <line x1="258" y1="78" x2="226" y2="116" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#dl-hold)" />
            <text x="232" y="110" className="fill-emerald-400 text-[7px]">holds</text>
            <line x1="258" y1="62" x2="226" y2="38" stroke="#f87171" strokeWidth="1.5" strokeDasharray="4 2" markerEnd="url(#dl-wait)" />
            <text x="228" y="44" className="fill-red-400 text-[7px]">waits</text>
            <text x="8" y="144" className="fill-neutral-600 text-[8px]">Fix: always lock rows in a consistent order (lower ID first) to prevent the circular wait.</text>
          </svg>
        </figure>
      );

    // ── Day 11: CAP theorem ───────────────────────────────────────────
    case "cap-theorem":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            CAP theorem — distributed systems can guarantee at most 2 of 3 during a partition
          </figcaption>
          <svg viewBox="0 0 380 168" className="h-auto w-full" aria-hidden>
            {/* Triangle */}
            <polygon points="190,16 32,148 348,148" fill="none" stroke="#3f3f46" strokeWidth="1.5" />
            {/* C vertex */}
            <circle cx="190" cy="16" r="28" fill="#082f49" stroke="#38bdf8" strokeWidth="1.5" />
            <text x="190" y="12" textAnchor="middle" className="fill-sky-300 text-[10px] font-semibold">C</text>
            <text x="190" y="24" textAnchor="middle" className="fill-sky-400 text-[8px]">Consistent</text>
            {/* A vertex */}
            <circle cx="32" cy="148" r="28" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.5" />
            <text x="32" y="144" textAnchor="middle" className="fill-emerald-300 text-[10px] font-semibold">A</text>
            <text x="32" y="156" textAnchor="middle" className="fill-emerald-400 text-[8px]">Available</text>
            {/* P vertex */}
            <circle cx="348" cy="148" r="28" fill="#2e1065" stroke="#a78bfa" strokeWidth="1.5" />
            <text x="348" y="144" textAnchor="middle" className="fill-violet-300 text-[10px] font-semibold">P</text>
            <text x="348" y="156" textAnchor="middle" className="fill-violet-400 text-[8px]">Partition tol.</text>
            {/* CP zone */}
            <text x="148" y="74" textAnchor="middle" className="fill-sky-400/80 text-[8px]">CP</text>
            <text x="148" y="85" textAnchor="middle" className="fill-neutral-500 text-[7px]">MongoDB, etcd</text>
            {/* AP zone */}
            <text x="236" y="74" textAnchor="middle" className="fill-emerald-400/80 text-[8px]">AP</text>
            <text x="236" y="85" textAnchor="middle" className="fill-neutral-500 text-[7px]">Cassandra, Dynamo</text>
            {/* CA zone */}
            <text x="190" y="136" textAnchor="middle" className="fill-violet-400/80 text-[8px]">CA</text>
            <text x="190" y="147" textAnchor="middle" className="fill-neutral-500 text-[7px]">Single-node RDBMS</text>
          </svg>
        </figure>
      );

    // ── Day 12: Primary-replica ───────────────────────────────────────
    case "primary-replica":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Primary + two read replicas — WAL streaming, writes to primary only
          </figcaption>
          <svg viewBox="0 0 420 156" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="pr-wal" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#38bdf8" />
              </marker>
              <marker id="pr-read" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
            </defs>
            {/* App */}
            <rect x="8" y="58" width="80" height="40" rx="4" fill="#1c1c1e" stroke="#3f3f46" strokeWidth="1" />
            <text x="48" y="76" textAnchor="middle" className="fill-neutral-300 text-[9px] font-semibold">Application</text>
            <text x="48" y="90" textAnchor="middle" className="fill-neutral-500 text-[8px]">writes→primary</text>
            {/* Primary */}
            <rect x="144" y="40" width="100" height="56" rx="4" fill="#2d2000" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="194" y="62" textAnchor="middle" className="fill-amber-300 text-[10px] font-semibold">Primary</text>
            <text x="194" y="78" textAnchor="middle" className="fill-neutral-500 text-[8px]">reads + writes</text>
            <text x="194" y="90" textAnchor="middle" className="fill-neutral-600 text-[8px]">streams WAL →</text>
            {/* Replicas */}
            <rect x="302" y="16" width="106" height="44" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="355" y="34" textAnchor="middle" className="fill-sky-300 text-[9px] font-semibold">Replica 1</text>
            <text x="355" y="48" textAnchor="middle" className="fill-neutral-500 text-[8px]">reads only</text>
            <rect x="302" y="96" width="106" height="44" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="355" y="114" textAnchor="middle" className="fill-sky-300 text-[9px] font-semibold">Replica 2</text>
            <text x="355" y="128" textAnchor="middle" className="fill-neutral-500 text-[8px]">reads only</text>
            {/* App → Primary (write) */}
            <line x1="90" y1="78" x2="142" y2="70" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#pr-wal)" />
            {/* Primary → Replicas (WAL) */}
            <line x1="246" y1="60" x2="300" y2="38" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 2" markerEnd="url(#pr-wal)" />
            <line x1="246" y1="76" x2="300" y2="118" stroke="#38bdf8" strokeWidth="1.5" strokeDasharray="5 2" markerEnd="url(#pr-wal)" />
            {/* App ← Replicas (read) */}
            <line x1="88" y1="70" x2="300" y2="32" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#pr-read)" />
            <text x="8" y="150" className="fill-neutral-600 text-[8px]">Async WAL streaming: lag possible. After a write, route the immediate read-back to primary to avoid stale data.</text>
          </svg>
        </figure>
      );

    // ── Day 12: CQRS sketch ───────────────────────────────────────────
    case "cqrs-sketch":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            CQRS — command side writes to OLTP; events project to read-optimised stores
          </figcaption>
          <svg viewBox="0 0 440 152" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="cq-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#a78bfa" />
              </marker>
            </defs>
            {/* Client */}
            <rect x="8" y="56" width="72" height="40" rx="4" fill="#1c1c1e" stroke="#3f3f46" strokeWidth="1" />
            <text x="44" y="74" textAnchor="middle" className="fill-neutral-300 text-[9px] font-semibold">Client</text>
            {/* Command side */}
            <rect x="100" y="16" width="100" height="52" rx="4" fill="#2e1065" stroke="#a78bfa" strokeWidth="1.5" />
            <text x="150" y="34" textAnchor="middle" className="fill-violet-300 text-[10px] font-semibold">Command</text>
            <text x="150" y="48" textAnchor="middle" className="fill-violet-300 text-[10px] font-semibold">Handler</text>
            <text x="150" y="62" textAnchor="middle" className="fill-neutral-500 text-[8px]">validate + write</text>
            {/* OLTP DB */}
            <rect x="100" y="84" width="100" height="36" rx="4" fill="#2d2000" stroke="#f59e0b" strokeWidth="1" />
            <text x="150" y="100" textAnchor="middle" className="fill-amber-300 text-[9px] font-semibold">PostgreSQL</text>
            <text x="150" y="114" textAnchor="middle" className="fill-neutral-500 text-[8px]">normalised OLTP</text>
            {/* Event bus */}
            <rect x="224" y="44" width="72" height="36" rx="4" fill="#1c1c1e" stroke="#4ade80" strokeWidth="1" />
            <text x="260" y="60" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Event</text>
            <text x="260" y="74" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Bus</text>
            {/* Read stores */}
            <rect x="318" y="16" width="110" height="32" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="373" y="30" textAnchor="middle" className="fill-sky-300 text-[9px] font-semibold">Elasticsearch</text>
            <text x="373" y="42" textAnchor="middle" className="fill-neutral-500 text-[8px]">full-text search view</text>
            <rect x="318" y="56" width="110" height="32" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="373" y="70" textAnchor="middle" className="fill-sky-300 text-[9px] font-semibold">Redis</text>
            <text x="373" y="82" textAnchor="middle" className="fill-neutral-500 text-[8px]">dashboard counters</text>
            <rect x="318" y="96" width="110" height="32" rx="4" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="373" y="110" textAnchor="middle" className="fill-sky-300 text-[9px] font-semibold">Read Replica</text>
            <text x="373" y="122" textAnchor="middle" className="fill-neutral-500 text-[8px]">list/detail views</text>
            {/* Arrows */}
            <line x1="80" y1="66" x2="98" y2="50" stroke="#a78bfa" strokeWidth="1.2" markerEnd="url(#cq-arr)" />
            <line x1="80" y1="80" x2="316" y2="80" stroke="#4ade80" strokeWidth="1" strokeDasharray="4 2" markerEnd="url(#cq-arr)" />
            <line x1="150" y1="68" x2="150" y2="82" stroke="#f59e0b" strokeWidth="1.2" markerEnd="url(#cq-arr)" />
            <line x1="202" y1="42" x2="222" y2="52" stroke="#a78bfa" strokeWidth="1.2" markerEnd="url(#cq-arr)" />
            <line x1="298" y1="56" x2="316" y2="40" stroke="#4ade80" strokeWidth="1" markerEnd="url(#cq-arr)" />
            <line x1="298" y1="62" x2="316" y2="72" stroke="#4ade80" strokeWidth="1" markerEnd="url(#cq-arr)" />
            <line x1="298" y1="68" x2="316" y2="108" stroke="#4ade80" strokeWidth="1" markerEnd="url(#cq-arr)" />
            <text x="8" y="148" className="fill-neutral-600 text-[8px]">Commands write to normalised OLTP; domain events fan out to read projectors updating optimised read stores.</text>
          </svg>
        </figure>
      );

    // ── Day 13: Inverted index ────────────────────────────────────────
    case "inverted-index":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Inverted index — term → posting list (document IDs + positions)
          </figcaption>
          <svg viewBox="0 0 420 156" className="h-auto w-full" aria-hidden>
            {/* Documents */}
            {[
              { id: "Doc 1", text: '"distributed systems scale"', y: 14 },
              { id: "Doc 2", text: '"systems design patterns"',   y: 54 },
              { id: "Doc 3", text: '"distributed tracing guide"', y: 94 },
            ].map(({ id, text, y }) => (
              <g key={id}>
                <rect x="8" y={y} width="152" height="32" rx="3" fill="#1c1c1e" stroke="#3f3f46" strokeWidth="1" />
                <text x="16" y={y + 14} className="fill-neutral-400 text-[8px] font-semibold">{id}</text>
                <text x="16" y={y + 26} className="fill-neutral-500 text-[7px]">{text}</text>
              </g>
            ))}
            {/* Arrow */}
            <text x="168" y="82" className="fill-neutral-600 text-[9px]">→ index</text>
            {/* Inverted index entries */}
            {[
              { term: "distributed", docs: "Doc1(pos:0)  Doc3(pos:0)", y: 14, color: "#38bdf8" },
              { term: "systems",     docs: "Doc1(pos:1)  Doc2(pos:0)", y: 46, color: "#4ade80" },
              { term: "design",      docs: "Doc2(pos:1)",               y: 78, color: "#a78bfa" },
              { term: "patterns",    docs: "Doc2(pos:2)",               y: 110, color: "#fb923c" },
              { term: "scale",       docs: "Doc1(pos:2)",               y: 124, color: "#f87171" },
            ].map(({ term, docs, y, color }) => (
              <g key={term}>
                <rect x="212" y={y} width="196" height="24" rx="3" fill="#1c1c1e" stroke={color} strokeWidth="1" strokeOpacity="0.5" />
                <text x="220" y={y + 10} className="text-[8px] font-semibold" style={{ fill: color }}>{term}</text>
                <text x="220" y={y + 20} className="fill-neutral-500 text-[7px]">→ {docs}</text>
              </g>
            ))}
            <text x="8" y="148" className="fill-neutral-600 text-[8px]">Query "distributed systems": intersect posting lists → {"{Doc1}"} ranked by TF-IDF / BM25.</text>
          </svg>
        </figure>
      );

    // ── Day 14: Queue backpressure ────────────────────────────────────
    case "queue-backpressure":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Backpressure — bounded queue signals producer to slow down when full
          </figcaption>
          <svg viewBox="0 0 400 148" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="bp-fast" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#f87171" />
              </marker>
              <marker id="bp-slow" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#4ade80" />
              </marker>
              <marker id="bp-signal" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#fb923c" />
              </marker>
            </defs>
            {/* Producer */}
            <rect x="8" y="50" width="80" height="48" rx="4" fill="#3b0f14" stroke="#f87171" strokeWidth="1.5" />
            <text x="48" y="70" textAnchor="middle" className="fill-red-300 text-[10px] font-semibold">Producer</text>
            <text x="48" y="84" textAnchor="middle" className="fill-red-400 text-[8px]">10k msg/s</text>
            <text x="48" y="94" textAnchor="middle" className="fill-neutral-600 text-[7px]">(fast)</text>
            {/* Queue */}
            <rect x="110" y="30" width="160" height="88" rx="4" fill="#1c1c1e" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="190" y="48" textAnchor="middle" className="fill-amber-300 text-[9px] font-semibold">Bounded Queue (max=1000)</text>
            {/* Queue fill */}
            {[0,1,2,3,4,5,6,7,8,9].map((i) => (
              <rect key={i} x={118 + i * 14} y="56" width="12" height="48" rx="1"
                fill={i < 8 ? "#d97706" : "#3f3f46"} opacity={i < 8 ? 0.8 : 0.3} />
            ))}
            <text x="190" y="118" textAnchor="middle" className="fill-amber-400 text-[8px]">80% full — apply backpressure</text>
            {/* Consumer */}
            <rect x="292" y="50" width="80" height="48" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.5" />
            <text x="332" y="70" textAnchor="middle" className="fill-emerald-300 text-[10px] font-semibold">Consumer</text>
            <text x="332" y="84" textAnchor="middle" className="fill-emerald-400 text-[8px]">2k msg/s</text>
            <text x="332" y="94" textAnchor="middle" className="fill-neutral-600 text-[7px]">(slow)</text>
            {/* Arrows */}
            <line x1="90" y1="70" x2="108" y2="70" stroke="#f87171" strokeWidth="2" markerEnd="url(#bp-fast)" />
            <line x1="272" y1="74" x2="290" y2="74" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#bp-slow)" />
            {/* Backpressure signal */}
            <path d="M 190 32 Q 60 8 56 48" fill="none" stroke="#fb923c" strokeWidth="1.5" strokeDasharray="5 3" markerEnd="url(#bp-signal)" />
            <text x="88" y="14" className="fill-orange-400 text-[8px]">backpressure: slow down!</text>
            <text x="8" y="140" className="fill-neutral-600 text-[8px]">Without bounded queue + backpressure, consumer memory grows unbounded → OOM crash under load.</text>
          </svg>
        </figure>
      );

    // ── Day 14: Producer-consumer ─────────────────────────────────────
    case "producer-consumer":
      return (
        <figure className={fig}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Message queue patterns — work queue (competing consumers) vs pub/sub fan-out
          </figcaption>
          <svg viewBox="0 0 440 156" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="mq-arr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5 Z" fill="#a78bfa" />
              </marker>
            </defs>
            {/* Work queue section */}
            <text x="8" y="14" className="fill-neutral-400 text-[9px] font-semibold">Work queue — one message, one worker</text>
            <rect x="8" y="20" width="56" height="28" rx="3" fill="#2e1065" stroke="#a78bfa" strokeWidth="1" />
            <text x="36" y="38" textAnchor="middle" className="fill-violet-300 text-[8px]">Producer</text>
            <rect x="82" y="20" width="70" height="28" rx="3" fill="#2d2000" stroke="#f59e0b" strokeWidth="1" />
            <text x="117" y="38" textAnchor="middle" className="fill-amber-300 text-[8px]">Queue</text>
            {["Worker 1", "Worker 2", "Worker 3"].map((w, i) => (
              <g key={w}>
                <rect x="168" y={16 + i * 14} width="64" height="12" rx="2" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" strokeOpacity="0.6" />
                <text x="200" y={25 + i * 14} textAnchor="middle" className="fill-emerald-400 text-[7px]">{w}</text>
              </g>
            ))}
            <line x1="66" y1="34" x2="80" y2="34" stroke="#a78bfa" strokeWidth="1.2" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="28" x2="166" y2="22" stroke="#4ade80" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="34" x2="166" y2="34" stroke="#4ade80" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="40" x2="166" y2="42" stroke="#4ade80" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <text x="170" y="62" className="fill-neutral-600 text-[7px]">each message delivered to ONE worker</text>

            {/* Pub/Sub section */}
            <text x="8" y="84" className="fill-neutral-400 text-[9px] font-semibold">Pub/Sub — one message, all subscribers</text>
            <rect x="8" y="90" width="56" height="28" rx="3" fill="#2e1065" stroke="#a78bfa" strokeWidth="1" />
            <text x="36" y="108" textAnchor="middle" className="fill-violet-300 text-[8px]">Publisher</text>
            <rect x="82" y="90" width="70" height="28" rx="3" fill="#082f49" stroke="#38bdf8" strokeWidth="1" />
            <text x="117" y="102" textAnchor="middle" className="fill-sky-300 text-[8px]">Topic /</text>
            <text x="117" y="113" textAnchor="middle" className="fill-sky-300 text-[8px]">Exchange</text>
            {["Email svc", "Analytics", "Inventory"].map((s, i) => (
              <g key={s}>
                <rect x="168" y={86 + i * 18} width="64" height="14" rx="2" fill="#082f49" stroke="#38bdf8" strokeWidth="1" strokeOpacity="0.6" />
                <text x="200" y={96 + i * 18} textAnchor="middle" className="fill-sky-300 text-[7px]">{s}</text>
              </g>
            ))}
            <line x1="66" y1="104" x2="80" y2="104" stroke="#a78bfa" strokeWidth="1.2" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="100" x2="166" y2="93" stroke="#38bdf8" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="104" x2="166" y2="104" stroke="#38bdf8" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <line x1="154" y1="108" x2="166" y2="118" stroke="#38bdf8" strokeWidth="1" markerEnd="url(#mq-arr)" />
            <text x="170" y="140" className="fill-neutral-600 text-[7px]">same message delivered to ALL subscribers</text>

            {/* DLQ note */}
            <rect x="256" y="84" width="172" height="60" rx="4" fill="#1c1c1e" stroke="#f87171" strokeWidth="1" strokeOpacity="0.5" />
            <text x="342" y="100" textAnchor="middle" className="fill-red-300 text-[9px] font-semibold">Dead Letter Queue (DLQ)</text>
            <text x="264" y="116" className="fill-neutral-500 text-[7px]">Messages that fail N retries</text>
            <text x="264" y="128" className="fill-neutral-500 text-[7px]">are moved here for inspection.</text>
            <text x="264" y="140" className="fill-red-400 text-[7px]">Alert when DLQ depth &gt; 0.</text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
