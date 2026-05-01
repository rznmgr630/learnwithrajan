"use client";

import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const NEXTJS_DIAGRAM_IDS = new Set<RoadmapDetailDiagramId>([
  "nextjs-request-lifecycle",
  "nextjs-client-server-boundary",
  "nextjs-data-fetch-cache",
  "nextjs-render-strategies",
  "nextjs-api-route-flow",
  "nextjs-prisma-workflow",
  "nextjs-nextauth-flow",
  "nextjs-image-optimization",
  "nextjs-vercel-deploy",
]);

export function isNextjsRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return NEXTJS_DIAGRAM_IDS.has(id);
}

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

/** SVG diagrams for the Next.js learning roadmap (Day detail panel). */
export function NextjsDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    // ─────────────────────────────────────────────────────────────
    // 1. Request lifecycle
    // ─────────────────────────────────────────────────────────────
    case "nextjs-request-lifecycle":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            App Router request lifecycle — browser request flows through Next.js
            middleware, then to the matched Server Component which renders to
            HTML/RSC payload
          </figcaption>
          <svg viewBox="0 0 440 168" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="nrl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="nrl-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Row 1: Browser → CDN/Edge → Middleware → Route Match */}
            {(
              [
                { x: 8,   label: "Browser",      sub: "HTTP request",    stroke: "#52525b",  tc: "fill-neutral-400" },
                { x: 110, label: "CDN / Edge",    sub: "cache hit?",      stroke: "#38bdf8",  tc: "fill-sky-300/90" },
                { x: 222, label: "Middleware",    sub: "auth / redirect", stroke: "#a78bfa",  tc: "fill-violet-300" },
                { x: 330, label: "Route Match",   sub: "app/[slug]/page", stroke: "#52525b",  tc: "fill-neutral-400" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="20" width="96" height="40" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 48} y="37" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 48} y="51" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="104" y1="40" x2="110" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrl-arr)" />
            <line x1="206" y1="40" x2="222" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrl-arr)" />
            <line x1="318" y1="40" x2="330" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrl-arr)" />

            {/* Down from Route Match into Server Component */}
            <line x1="378" y1="60" x2="378" y2="80" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrl-arr)" />

            {/* RSC rendering zone label */}
            <rect x="8" y="80" width="424" height="50" rx="6" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="14" y="95" className="fill-sky-400/90 text-[8px] font-semibold">RSC rendering (server)</text>
            <rect x="14" y="100" width="140" height="22" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="84" y="114" textAnchor="middle" className="fill-sky-300/90 text-[8px]">Server Component</text>
            <line x1="154" y1="111" x2="190" y2="111" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nrl-arr)" />
            <rect x="190" y="100" width="90" height="22" rx="4" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1" />
            <text x="235" y="114" textAnchor="middle" className="fill-emerald-300 text-[8px]">render()</text>
            <line x1="280" y1="111" x2="316" y2="111" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#nrl-grn)" />
            <rect x="316" y="100" width="106" height="22" rx="4" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1" />
            <text x="369" y="111" textAnchor="middle" className="fill-emerald-300 text-[7px] font-semibold">HTML + RSC payload</text>
            <text x="369" y="121" textAnchor="middle" className="fill-neutral-500 text-[7px]">streamed to browser</text>

            <text x="220" y="158" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Middleware runs at the edge before route resolution — auth checks, locale redirects, A/B flags
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 2. Client/Server boundary
    // ─────────────────────────────────────────────────────────────
    case "nextjs-client-server-boundary":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Server and Client component tree — &apos;use client&apos; marks a boundary;
            everything below it runs on the client; Server Components above can
            still pass serializable props
          </figcaption>
          <svg viewBox="0 0 440 226" className="h-auto w-full" aria-hidden>
            {/* Legend */}
            <rect x="8"   y="8" width="10" height="10" rx="2" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="22"  y="17" className="fill-sky-300/90 text-[7px]">Server Component</text>
            <rect x="130" y="8" width="10" height="10" rx="2" fill="#431407" stroke="#fb923c" strokeWidth="1" />
            <text x="144" y="17" className="fill-orange-300/90 text-[7px]">Client Component</text>

            {/* Level 0: App */}
            <rect x="180" y="24" width="80" height="28" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="220" y="41" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">App (server)</text>

            <line x1="220" y1="52" x2="140" y2="72" stroke="#334155" strokeWidth="1" />
            <line x1="220" y1="52" x2="300" y2="72" stroke="#334155" strokeWidth="1" />

            {/* Level 1: Layout + Page */}
            <rect x="90"  y="72" width="100" height="28" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="140" y="89" textAnchor="middle" className="fill-sky-300/90 text-[8px]">Layout (server)</text>

            <rect x="250" y="72" width="100" height="28" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="300" y="89" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">Page (server)</text>

            <line x1="300" y1="100" x2="300" y2="118" stroke="#334155" strokeWidth="1" />

            {/* Level 2: ProductList (server) */}
            <rect x="230" y="118" width="140" height="28" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
            <text x="300" y="135" textAnchor="middle" className="fill-sky-300/90 text-[8px]">ProductList (server)</text>

            <line x1="300" y1="146" x2="300" y2="162" stroke="#334155" strokeWidth="1" />

            {/* "use client" boundary marker */}
            <line x1="8" y1="162" x2="432" y2="162" stroke="#fb923c" strokeWidth="1" strokeDasharray="5 3" />
            <rect x="8" y="154" width="90" height="16" rx="3" fill="#431407" />
            <text x="53" y="165" textAnchor="middle" className="fill-orange-300 text-[7px] font-semibold">&apos;use client&apos; boundary</text>

            {/* Level 3: ProductCard (use client) */}
            <rect x="220" y="172" width="160" height="28" rx="5" fill="#431407" stroke="#fb923c" strokeWidth="1.2" />
            <text x="300" y="186" textAnchor="middle" className="fill-orange-300 text-[8px] font-semibold">ProductCard (&apos;use client&apos;)</text>
            <text x="300" y="196" textAnchor="middle" className="fill-orange-400/70 text-[7px]">useState / onClick enabled</text>

            <line x1="300" y1="200" x2="300" y2="210" stroke="#fb923c" strokeWidth="1" />

            {/* Level 4: AddToCart (inherited) */}
            <rect x="220" y="210" width="160" height="12" rx="3" fill="#2c0f00" stroke="#fb923c" strokeOpacity={0.6} strokeWidth="1" />
            <text x="300" y="219" textAnchor="middle" className="fill-orange-400/80 text-[7px]">AddToCart (client — inherited)</text>

            <text x="220" y="224" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Props crossing the boundary must be serializable (no functions/classes)
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 3. Data fetch / cache options
    // ─────────────────────────────────────────────────────────────
    case "nextjs-data-fetch-cache":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            fetch() cache options in Next.js — three strategies determine when
            data is fetched and how long it stays cached
          </figcaption>
          <svg viewBox="0 0 440 180" className="h-auto w-full" aria-hidden>
            {/* Column headers */}
            {(
              [
                { x: 8,   w: 133, label: "force-cache",  sub: "Static",   stroke: "#38bdf8", bg: "#0c1a2e", tc: "fill-sky-300/90",    sc: "fill-sky-400/70" },
                { x: 153, w: 133, label: "revalidate: N", sub: "ISR",      stroke: "#f59e0b", bg: "#1c1200", tc: "fill-amber-300/90",  sc: "fill-amber-400/70" },
                { x: 298, w: 133, label: "no-store",      sub: "Dynamic",  stroke: "#f87171", bg: "#1c0808", tc: "fill-red-300/90",    sc: "fill-red-400/70" },
              ] as const
            ).map(({ x, w, label, sub, stroke, bg, tc, sc }) => (
              <g key={x}>
                <rect x={x} y="10" width={w} height="30" rx="5" fill={bg} stroke={stroke} strokeWidth="1.2" />
                <text x={x + w / 2} y="25" textAnchor="middle" className={`${tc} text-[9px] font-semibold`}>{label}</text>
                <text x={x + w / 2} y="36" textAnchor="middle" className={`${sc} text-[7px]`}>{sub}</text>
              </g>
            ))}

            {/* Rows of detail */}
            {(
              [
                {
                  y: 52,
                  cells: [
                    { x: 8,   w: 133, text: "Build-time or first",   sub: "request only",   stroke: "#38bdf8", tc: "fill-sky-300/80" },
                    { x: 153, w: 133, text: "Background refresh",     sub: "every N seconds", stroke: "#f59e0b", tc: "fill-amber-300/80" },
                    { x: 298, w: 133, text: "Every request",          sub: "no cache used",   stroke: "#f87171", tc: "fill-red-300/80" },
                  ],
                },
                {
                  y: 100,
                  cells: [
                    { x: 8,   w: 133, text: "CDN-cached forever",     sub: "fastest TTFB",    stroke: "#38bdf8", tc: "fill-sky-300/80" },
                    { x: 153, w: 133, text: "Stale-while-revalidate", sub: "fresh + fast",    stroke: "#f59e0b", tc: "fill-amber-300/80" },
                    { x: 298, w: 133, text: "Always fresh data",      sub: "slowest TTFB",    stroke: "#f87171", tc: "fill-red-300/80" },
                  ],
                },
                {
                  y: 148,
                  cells: [
                    { x: 8,   w: 133, text: "Static site / blog",    sub: "",                stroke: "#38bdf8", tc: "fill-sky-400/70" },
                    { x: 153, w: 133, text: "Product catalog",        sub: "",                stroke: "#f59e0b", tc: "fill-amber-400/70" },
                    { x: 298, w: 133, text: "Cart / stock / prices",  sub: "",                stroke: "#f87171", tc: "fill-red-400/70" },
                  ],
                },
              ] as const
            ).map(({ y, cells }) =>
              cells.map(({ x, w, text, sub, stroke, tc }) => (
                <g key={`${y}-${x}`}>
                  <rect x={x} y={y} width={w} height="40" rx="4" fill="#18181b" stroke={stroke} strokeOpacity={0.45} strokeWidth="1" />
                  <text x={x + w / 2} y={y + 16} textAnchor="middle" className={`${tc} text-[8px] font-medium`}>{text}</text>
                  {sub ? <text x={x + w / 2} y={y + 28} textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text> : null}
                </g>
              ))
            )}

            {/* Row labels on left */}
            <text x="4" y="76"  textAnchor="end" className="fill-neutral-600 text-[7px]" transform="rotate(-90,4,76)">when</text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 4. Rendering strategies
    // ─────────────────────────────────────────────────────────────
    case "nextjs-render-strategies":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Rendering strategies — Next.js chooses Static, ISR, or Dynamic
            per-segment based on data fetching config
          </figcaption>
          <svg viewBox="0 0 440 200" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="nrs-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
            </defs>

            {/* Top decision node */}
            <rect x="160" y="10" width="120" height="30" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1.2" />
            <text x="220" y="29" textAnchor="middle" className="fill-neutral-300 text-[9px] font-semibold">Next.js segment</text>

            {/* 3 branches */}
            <line x1="220" y1="40" x2="74"  y2="68" stroke="#334155" strokeWidth="1" />
            <line x1="220" y1="40" x2="220" y2="68" stroke="#334155" strokeWidth="1" />
            <line x1="220" y1="40" x2="366" y2="68" stroke="#334155" strokeWidth="1" />

            {/* Column headers */}
            {(
              [
                { x: 8,   label: "Static",  stroke: "#38bdf8", bg: "#0c1a2e", tc: "fill-sky-300/90" },
                { x: 154, label: "ISR",     stroke: "#f59e0b", bg: "#1c1200", tc: "fill-amber-300/90" },
                { x: 300, label: "Dynamic", stroke: "#f87171", bg: "#1c0808", tc: "fill-red-300/90" },
              ] as const
            ).map(({ x, label, stroke, bg, tc }) => (
              <g key={x}>
                <rect x={x} y="68" width="132" height="26" rx="5" fill={bg} stroke={stroke} strokeWidth="1.2" />
                <text x={x + 66} y="84" textAnchor="middle" className={`${tc} text-[9px] font-semibold`}>{label}</text>
              </g>
            ))}

            {/* Detail rows — config */}
            {(
              [
                {
                  y: 106,
                  cells: [
                    { x: 8,   label: "force-cache",          color: "#38bdf8" },
                    { x: 154, label: "revalidate: N",         color: "#f59e0b" },
                    { x: 300, label: "no-store / cookies()",  color: "#f87171" },
                  ],
                },
                {
                  y: 132,
                  cells: [
                    { x: 8,   label: "Built at deploy",       color: "#7dd3fc" },
                    { x: 154, label: "Re-built in background", color: "#fcd34d" },
                    { x: 300, label: "Per-request render",    color: "#fca5a5" },
                  ],
                },
                {
                  y: 158,
                  cells: [
                    { x: 8,   label: "Fastest · CDN cached",  color: "#38bdf8" },
                    { x: 154, label: "Fresh + fast",          color: "#f59e0b" },
                    { x: 300, label: "Always fresh · slowest", color: "#f87171" },
                  ],
                },
              ] as const
            ).map(({ y, cells }) =>
              cells.map(({ x, label, color }) => (
                <g key={`${y}-${x}`}>
                  <rect x={x} y={y} width="132" height="20" rx="3" fill="#18181b" stroke="#3f3f46" strokeWidth="0.8" />
                  <text x={x + 66} y={y + 13} textAnchor="middle" fontSize="7.5" style={{ fill: color }}>{label}</text>
                </g>
              ))
            )}

            <text x="220" y="195" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Next.js infers the strategy automatically — no manual page-type config needed
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 5. API Route / Route Handler flow
    // ─────────────────────────────────────────────────────────────
    case "nextjs-api-route-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Route Handler request flow — app/api/[resource]/route.ts handles HTTP
            verbs; GET reads data, POST validates with Zod then writes
          </figcaption>
          <svg viewBox="0 0 440 192" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="narf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="narf-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker id="narf-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f87171" />
              </marker>
            </defs>

            {/* Step 1: HTTP Request */}
            <rect x="8" y="16" width="84" height="36" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="50" y="32" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">HTTP Request</text>
            <text x="50" y="44" textAnchor="middle" className="fill-neutral-500 text-[7px]">GET / POST …</text>

            <line x1="92" y1="34" x2="106" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#narf-arr)" />

            {/* Step 2: route.ts */}
            <rect x="106" y="16" width="92" height="36" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="152" y="30" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">route.ts</text>
            <text x="152" y="42" textAnchor="middle" className="fill-sky-400/70 text-[7px]">export GET / POST</text>
            <text x="152" y="50" textAnchor="middle" className="fill-sky-400/70 text-[7px]">PUT / DELETE</text>

            <line x1="198" y1="34" x2="212" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#narf-arr)" />

            {/* Step 3: Parse */}
            <rect x="212" y="16" width="90" height="36" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="257" y="30" textAnchor="middle" className="fill-neutral-300 text-[8px]">parse params</text>
            <text x="257" y="42" textAnchor="middle" className="fill-neutral-500 text-[7px]">request.json()</text>
            <text x="257" y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">searchParams</text>

            <line x1="302" y1="34" x2="316" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#narf-arr)" />

            {/* Step 4: Zod validate */}
            <rect x="316" y="16" width="112" height="36" rx="5" fill="#18181b" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="372" y="30" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">Zod validate</text>
            <text x="372" y="42" textAnchor="middle" className="fill-violet-400/70 text-[7px]">schema.safeParse(body)</text>
            <text x="372" y="52" textAnchor="middle" className="fill-violet-400/70 text-[7px]">POST body</text>

            {/* Branch: success path */}
            <line x1="372" y1="52" x2="372" y2="68" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#narf-grn)" />
            <rect x="316" y="68" width="112" height="28" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1" />
            <text x="372" y="82" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">DB query (Prisma)</text>
            <text x="372" y="92" textAnchor="middle" className="fill-neutral-500 text-[7px]">prisma.model.create(…)</text>

            <line x1="372" y1="96" x2="372" y2="112" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#narf-grn)" />
            <rect x="316" y="112" width="112" height="26" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="372" y="126" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">NextResponse.json()</text>
            <text x="372" y="137" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">200 / 201 OK</text>

            {/* Branch: error path */}
            <line x1="316" y1="34" x2="220" y2="80" stroke="#f87171" strokeWidth="1.2" strokeDasharray="4 2" markerEnd="url(#narf-red)" />
            <rect x="138" y="80" width="128" height="26" rx="5" fill="#2d1515" stroke="#f87171" strokeWidth="1" />
            <text x="202" y="94" textAnchor="middle" className="fill-red-300 text-[8px] font-semibold">NextResponse.json(errors)</text>
            <text x="202" y="104" textAnchor="middle" className="fill-red-400/70 text-[7px]">400 Bad Request</text>
            <text x="290" y="68" className="fill-red-400/80 text-[7px]">invalid</text>
            <text x="330" y="59" className="fill-emerald-400/80 text-[7px]">success</text>

            <text x="220" y="158" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Route Handlers are edge-compatible — add export const runtime = &apos;edge&apos; for global low-latency
            </text>

            <rect x="8" y="168" width="424" height="18" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="14" y="180" className="fill-neutral-500 text-[7px]">app/api/products/route.ts  →  export async function POST(req: Request) {"{"} const body = await req.json(); … {"}"}</text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 6. Prisma workflow
    // ─────────────────────────────────────────────────────────────
    case "nextjs-prisma-workflow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Prisma workflow — schema.prisma defines the model, migrations sync the
            database, PrismaClient is the type-safe query builder
          </figcaption>
          <svg viewBox="0 0 440 188" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="npw-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="npw-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Stage 1: schema.prisma */}
            <rect x="8" y="10" width="96" height="88" rx="6" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="56" y="26" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">schema.prisma</text>
            <rect x="14" y="32" width="84" height="60" rx="3" fill="#0f172a" stroke="#334155" />
            <text x="20" y="44" className="fill-violet-300/90 text-[7px]">model User {"{"}</text>
            <text x="20" y="54" className="fill-neutral-400 text-[7px]">  id   Int @id</text>
            <text x="20" y="64" className="fill-neutral-400 text-[7px]">  name String</text>
            <text x="20" y="74" className="fill-neutral-400 text-[7px]">  email String</text>
            <text x="20" y="84" className="fill-violet-300/90 text-[7px]">{"}"}</text>

            <line x1="104" y1="54" x2="118" y2="54" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#npw-arr)" />

            {/* Stage 2: migrate dev */}
            <rect x="118" y="10" width="100" height="88" rx="6" fill="#18181b" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="168" y="26" textAnchor="middle" className="fill-amber-300/90 text-[8px] font-semibold">migrate dev</text>
            <rect x="124" y="32" width="88" height="32" rx="3" fill="#1c1200" stroke="#f59e0b" strokeOpacity={0.5} />
            <text x="168" y="46" textAnchor="middle" className="fill-amber-400/80 text-[7px]">npx prisma</text>
            <text x="168" y="57" textAnchor="middle" className="fill-amber-400/80 text-[7px]">migrate dev</text>
            <text x="124" y="78" className="fill-neutral-500 text-[7px]">→ SQL migration</text>
            <text x="124" y="88" className="fill-neutral-500 text-[7px]">   file created</text>

            <line x1="218" y1="54" x2="232" y2="54" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#npw-arr)" />

            {/* Stage 3: generate */}
            <rect x="232" y="10" width="100" height="88" rx="6" fill="#18181b" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="282" y="26" textAnchor="middle" className="fill-violet-300/90 text-[8px] font-semibold">generate</text>
            <rect x="238" y="32" width="88" height="32" rx="3" fill="#1a1030" stroke="#a78bfa" strokeOpacity={0.5} />
            <text x="282" y="46" textAnchor="middle" className="fill-violet-400/80 text-[7px]">npx prisma</text>
            <text x="282" y="57" textAnchor="middle" className="fill-violet-400/80 text-[7px]">generate</text>
            <text x="238" y="78" className="fill-neutral-500 text-[7px]">→ type-safe client</text>
            <text x="238" y="88" className="fill-neutral-500 text-[7px]">   emitted to .prisma/</text>

            <line x1="332" y1="54" x2="346" y2="54" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#npw-grn)" />

            {/* Stage 4: PrismaClient */}
            <rect x="346" y="10" width="86" height="88" rx="6" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="389" y="26" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">PrismaClient</text>
            <text x="352" y="42" className="fill-emerald-400/80 text-[7px]">findMany()</text>
            <text x="352" y="54" className="fill-emerald-400/80 text-[7px]">create({"{}"})</text>
            <text x="352" y="66" className="fill-emerald-400/80 text-[7px]">update({"{}"})</text>
            <text x="352" y="78" className="fill-emerald-400/80 text-[7px]">delete({"{}"})</text>
            <text x="352" y="90" className="fill-neutral-500 text-[7px]">fully typed</text>

            {/* DB cylinder at bottom */}
            <ellipse cx="168" cy="126" rx="40" ry="10" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
            <rect x="128" y="126" width="80" height="32" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
            <ellipse cx="168" cy="158" rx="40" ry="10" fill="#18181b" stroke="#f59e0b" strokeWidth="1" />
            <text x="168" y="145" textAnchor="middle" className="fill-amber-300/80 text-[7px] font-semibold">PostgreSQL / MySQL</text>
            <text x="168" y="155" textAnchor="middle" className="fill-neutral-500 text-[7px]">via DATABASE_URL</text>

            <line x1="168" y1="98" x2="168" y2="116" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#npw-arr)" />

            <text x="220" y="178" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Prisma Client is auto-generated — never hand-write SQL; schema is the source of truth
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 7. NextAuth session flow
    // ─────────────────────────────────────────────────────────────
    case "nextjs-nextauth-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            NextAuth session flow — user signs in via provider, NextAuth creates a
            JWT or database session, middleware validates on every protected request
          </figcaption>
          <svg viewBox="0 0 440 210" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="nnf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="nnf-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Top row: User → Sign In → Provider → NextAuth */}
            {(
              [
                { x: 8,   label: "User",             sub: "/login page",        stroke: "#52525b", tc: "fill-neutral-400" },
                { x: 110, label: "Sign In",           sub: "credentials/OAuth",  stroke: "#38bdf8", tc: "fill-sky-300/90" },
                { x: 222, label: "Provider",          sub: "Google / GitHub",    stroke: "#a78bfa", tc: "fill-violet-300" },
                { x: 330, label: "NextAuth handler",  sub: "/api/auth/[...nextauth]", stroke: "#38bdf8", tc: "fill-sky-400/90" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="14" width="96" height="40" rx="5" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 48} y="31" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 48} y="44" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="104" y1="34" x2="110" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nnf-arr)" />
            <line x1="206" y1="34" x2="222" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nnf-arr)" />
            <line x1="318" y1="34" x2="330" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nnf-arr)" />

            {/* Two branches from NextAuth: JWT (left) and DB session (right) */}
            <line x1="378" y1="54" x2="270" y2="82" stroke="#334155" strokeWidth="1" />
            <line x1="378" y1="54" x2="390" y2="82" stroke="#334155" strokeWidth="1" />

            {/* JWT branch */}
            <rect x="196" y="82" width="148" height="30" rx="5" fill="#0c1a2e" stroke="#38bdf8" strokeWidth="1" />
            <text x="270" y="98" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">JWT session (stateless)</text>
            <text x="270" y="109" textAnchor="middle" className="fill-sky-400/70 text-[7px]">signed token in cookie</text>

            {/* DB session branch */}
            <rect x="352" y="82" width="80" height="30" rx="5" fill="#1a1030" stroke="#a78bfa" strokeWidth="1" />
            <text x="392" y="96" textAnchor="middle" className="fill-violet-300/90 text-[8px] font-semibold">DB session</text>
            <text x="392" y="107" textAnchor="middle" className="fill-violet-400/70 text-[7px]">Prisma adapter</text>

            {/* Cookie → Middleware */}
            <line x1="270" y1="112" x2="270" y2="130" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#nnf-arr)" />

            <rect x="166" y="130" width="108" height="28" rx="5" fill="#18181b" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="144" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Cookie set on browser</text>
            <text x="220" y="155" textAnchor="middle" className="fill-neutral-500 text-[7px]">next-auth.session-token</text>

            <line x1="220" y1="158" x2="220" y2="174" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#nnf-grn)" />

            {/* Middleware validate */}
            <rect x="130" y="174" width="180" height="28" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="188" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Middleware validates token</text>
            <text x="220" y="199" textAnchor="middle" className="fill-neutral-500 text-[7px]">redirect to /login if invalid</text>

            <text x="220" y="207" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              withAuth() wraps the middleware — no manual JWT parsing needed
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 8. Image optimization
    // ─────────────────────────────────────────────────────────────
    case "nextjs-image-optimization":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Next/Image optimization pipeline — source image is transformed to
            WebP/AVIF at the right size for each device, served from cache
          </figcaption>
          <svg viewBox="0 0 440 192" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="nio-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="nio-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Source */}
            <rect x="8" y="16" width="72" height="40" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="44" y="33" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">Source</text>
            <text x="44" y="46" textAnchor="middle" className="fill-neutral-500 text-[7px]">PNG / JPG</text>

            <line x1="80" y1="36" x2="96" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nio-arr)" />

            {/* Next.js image server */}
            <rect x="96" y="16" width="100" height="40" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="146" y="30" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">Next.js Image</text>
            <text x="146" y="42" textAnchor="middle" className="fill-sky-400/70 text-[7px]">server / CDN endpoint</text>
            <text x="146" y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">/_next/image?url=…&w=…</text>

            <line x1="196" y1="36" x2="212" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nio-arr)" />

            {/* Format conversion */}
            <rect x="212" y="16" width="110" height="40" rx="5" fill="#18181b" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="267" y="30" textAnchor="middle" className="fill-violet-300/90 text-[8px] font-semibold">Format convert</text>
            <text x="267" y="42" textAnchor="middle" className="fill-violet-400/70 text-[7px]">WebP / AVIF (Accept header)</text>
            <text x="267" y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">+ resize to breakpoints</text>

            <line x1="322" y1="36" x2="338" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nio-arr)" />

            {/* CDN cache */}
            <rect x="338" y="16" width="94" height="40" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="385" y="30" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">CDN / Browser</text>
            <text x="385" y="42" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">cache-control:</text>
            <text x="385" y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">immutable / max-age</text>

            {/* Notes row */}
            <rect x="8" y="72" width="130" height="50" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
            <text x="73" y="88" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">Lazy loading</text>
            <text x="73" y="100" textAnchor="middle" className="fill-neutral-500 text-[7px]">loading=&quot;lazy&quot; default</text>
            <text x="73" y="112" textAnchor="middle" className="fill-neutral-500 text-[7px]">use priority for LCP</text>

            <rect x="155" y="72" width="130" height="50" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
            <text x="220" y="88" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">Prevents CLS</text>
            <text x="220" y="100" textAnchor="middle" className="fill-neutral-500 text-[7px]">width + height required</text>
            <text x="220" y="112" textAnchor="middle" className="fill-neutral-500 text-[7px]">reserves layout space</text>

            <rect x="302" y="72" width="130" height="50" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="0.8" />
            <text x="367" y="88" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">Breakpoints</text>
            <text x="367" y="100" textAnchor="middle" className="fill-neutral-500 text-[7px]">640 / 750 / 828 / 1080</text>
            <text x="367" y="112" textAnchor="middle" className="fill-neutral-500 text-[7px]">1200 / 1920 / 3840 px</text>

            {/* Code example */}
            <rect x="8" y="134" width="424" height="40" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="20" y="150" className="fill-violet-300/80 text-[7px]">{"<Image"}</text>
            <text x="20" y="162" className="fill-sky-300/80 text-[7px]">{"  src={heroImg}  alt=\"hero\"  width={1200}  height={630}  priority"}</text>
            <text x="20" y="173" className="fill-violet-300/80 text-[7px]">{"  sizes=\"(max-width:768px) 100vw, 50vw\" />"}</text>

            <text x="220" y="188" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              sizes prop tells the browser which image to download before layout is known
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 9. Vercel deployment pipeline
    // ─────────────────────────────────────────────────────────────
    case "nextjs-vercel-deploy":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Vercel deployment pipeline — git push triggers CI, Vercel builds and
            deploys to its global Edge Network
          </figcaption>
          <svg viewBox="0 0 440 196" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="nvd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="nvd-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker id="nvd-sky" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Step 1: git push */}
            <rect x="8" y="16" width="72" height="36" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="44" y="31" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">git push</text>
            <text x="44" y="44" textAnchor="middle" className="fill-neutral-500 text-[7px]">any branch</text>

            <line x1="80" y1="34" x2="96" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nvd-arr)" />

            {/* Step 2: GitHub */}
            <rect x="96" y="16" width="72" height="36" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="132" y="31" textAnchor="middle" className="fill-neutral-300 text-[8px] font-semibold">GitHub</text>
            <text x="132" y="44" textAnchor="middle" className="fill-neutral-500 text-[7px]">webhook →</text>

            <line x1="168" y1="34" x2="184" y2="34" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#nvd-arr)" />

            {/* Step 3: Vercel CI */}
            <rect x="184" y="16" width="108" height="36" rx="5" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="238" y="29" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">Vercel CI</text>
            <text x="238" y="40" textAnchor="middle" className="fill-sky-400/70 text-[7px]">npm run build</text>
            <text x="238" y="50" textAnchor="middle" className="fill-neutral-500 text-[7px]">next build → .next/</text>

            {/* Branch line from Vercel CI */}
            <line x1="238" y1="52" x2="156" y2="80" stroke="#334155" strokeWidth="1" />
            <line x1="238" y1="52" x2="320" y2="80" stroke="#334155" strokeWidth="1" />

            {/* Branch label */}
            <text x="172" y="70" className="fill-neutral-500 text-[7px]">non-main</text>
            <text x="296" y="70" className="fill-neutral-500 text-[7px]">main</text>

            {/* Preview URL */}
            <rect x="96" y="80" width="120" height="36" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="156" y="95" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">Preview URL</text>
            <text x="156" y="107" textAnchor="middle" className="fill-sky-400/70 text-[7px]">my-app-[hash].vercel.app</text>

            {/* Production */}
            <rect x="256" y="80" width="120" height="36" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="316" y="95" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Production</text>
            <text x="316" y="107" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">my-app.vercel.app</text>

            {/* Both point to Edge Network */}
            <line x1="156" y1="116" x2="200" y2="140" stroke="#38bdf8" strokeWidth="1.2" markerEnd="url(#nvd-sky)" />
            <line x1="316" y1="116" x2="272" y2="140" stroke="#4ade80" strokeWidth="1.2" markerEnd="url(#nvd-grn)" />

            {/* Edge Network */}
            <rect x="136" y="140" width="168" height="36" rx="5" fill="#0f172a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="155" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Vercel Edge Network</text>
            <text x="220" y="167" textAnchor="middle" className="fill-neutral-500 text-[7px]">100+ PoPs globally</text>
            <text x="220" y="177" textAnchor="middle" className="fill-neutral-500 text-[7px]">static + serverless + edge</text>

            <text x="220" y="192" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Each git push to a non-main branch gets an isolated preview — no staging server needed
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
