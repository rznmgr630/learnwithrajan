import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";
import { isNodeRuntimeDiagram, NodeRuntimeDiagram } from "@/components/learn/NodeRuntimeDiagrams";

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900/40 text-neutral-200";

export function DayDetailDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  if (isNodeRuntimeDiagram(id)) {
    return <NodeRuntimeDiagram id={id} />;
  }
  switch (id) {
    case "http11-sequential":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            HTTP/1.1 — one in flight per connection (head-of-line blocking)
          </figcaption>
          <svg viewBox="0 0 360 140" className="h-auto w-full text-neutral-300" aria-hidden>
            <text x="12" y="22" className="fill-neutral-500 text-[11px]">
              Client
            </text>
            <text x="300" y="22" className="fill-neutral-500 text-[11px]">
              Server
            </text>
            <line x1="60" y1="70" x2="300" y2="70" stroke="currentColor" strokeWidth="2" opacity="0.35" />
            <rect x="12" y="40" width="44" height="18" rx="3" className="fill-sky-600/40 stroke-sky-500/60" strokeWidth="1" />
            <text x="18" y="53" className="fill-neutral-200 text-[10px]">
              Req1
            </text>
            <rect x="12" y="64" width="44" height="18" rx="3" className="fill-violet-600/30 stroke-violet-500/50" strokeWidth="1" />
            <text x="18" y="77" className="fill-neutral-200 text-[10px]">
              Req2
            </text>
            <rect x="12" y="88" width="44" height="18" rx="3" className="fill-emerald-600/30 stroke-emerald-500/50" strokeWidth="1" />
            <text x="18" y="101" className="fill-neutral-200 text-[10px]">
              Req3
            </text>
            <path d="M56 49 H 120 V 75 H 56" fill="none" stroke="#38bdf8" strokeWidth="2" markerEnd="url(#http11-arr)" />
            <path d="M56 75 H 200 V 101 H 56" fill="none" stroke="#a78bfa" strokeWidth="2" opacity="0.9" />
            <path d="M56 101 H 260 V 127 H 56" fill="none" stroke="#34d399" strokeWidth="2" opacity="0.9" />
            <defs>
              <marker id="http11-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
            </defs>
            <text x="12" y="132" className="fill-neutral-500 text-[10px]">
              {"Req2 waits for Req1's response on the same connection."}
            </text>
          </svg>
        </figure>
      );

    case "http2-multiplex":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            HTTP/2 — many streams, one TCP connection (still one byte stream underneath)
          </figcaption>
          <svg viewBox="0 0 360 130" className="h-auto w-full" aria-hidden>
            <text x="12" y="20" className="fill-neutral-500 text-[11px]">
              TCP tunnel
            </text>
            <rect x="40" y="32" width="280" height="72" rx="6" className="fill-neutral-800/80 stroke-neutral-600" strokeWidth="1" />
            <line x1="52" y1="44" x2="308" y2="44" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="62" x2="308" y2="62" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
            <line x1="52" y1="80" x2="308" y2="80" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
            <text x="52" y="118" className="fill-neutral-500 text-[10px]">
              Streams multiplex · TCP loss can still stall all streams until retransmit.
            </text>
          </svg>
        </figure>
      );

    case "http3-quic":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            HTTP/3 — QUIC streams over UDP (independent loss recovery per stream)
          </figcaption>
          <svg viewBox="0 0 360 130" className="h-auto w-full" aria-hidden>
            <text x="140" y="22" className="fill-amber-400/90 text-[11px] font-medium">
              UDP + QUIC
            </text>
            <path d="M20 95 Q 90 40 180 50 T 340 45" fill="none" stroke="#52525b" strokeWidth="1.5" strokeDasharray="4 3" />
            <line x1="40" y1="48" x2="300" y2="48" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="68" x2="280" y2="68" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
            <line x1="40" y1="88" x2="260" y2="88" stroke="#34d399" strokeWidth="3" strokeLinecap="round" />
            <text x="12" y="118" className="fill-neutral-500 text-[10px]">
              Packet loss on stream A does not have to block B/C the same way as single TCP HOL.
            </text>
          </svg>
        </figure>
      );

    case "request-response":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            Typical HTTP exchange (method + path + headers → status + headers + body)
          </figcaption>
          <svg viewBox="0 0 360 100" className="h-auto w-full" aria-hidden>
            <rect x="16" y="24" width="100" height="52" rx="6" className="fill-neutral-800 stroke-neutral-600" strokeWidth="1" />
            <text x="28" y="46" className="fill-neutral-300 text-[10px]">
              GET /posts/7
            </text>
            <text x="28" y="62" className="fill-neutral-500 text-[9px]">
              Accept: application/json
            </text>
            <path d="M130 50 H 210" stroke="#64748b" strokeWidth="2" markerEnd="url(#reqresp-arr)" />
            <rect x="220" y="24" width="124" height="52" rx="6" className="fill-neutral-800 stroke-emerald-600/50" strokeWidth="1" />
            <text x="232" y="46" className="fill-emerald-300/90 text-[10px]">
              200 OK
            </text>
            <text x="232" y="62" className="fill-neutral-500 text-[9px]">
              {'{ "title": "…" }'}
            </text>
            <defs>
              <marker id="reqresp-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
            </defs>
          </svg>
        </figure>
      );

    case "status-401-403":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-neutral-800 px-3 py-2 text-xs font-medium text-neutral-400">
            401 vs 403 — identity vs permission
          </figcaption>
          <svg viewBox="0 0 360 108" className="h-auto w-full" aria-hidden>
            <rect x="12" y="16" width="150" height="76" rx="8" className="fill-amber-950/40 stroke-amber-600/40" strokeWidth="1" />
            <text x="24" y="40" className="fill-amber-200/90 text-[11px] font-semibold">
              No / bad identity?
            </text>
            <text x="24" y="58" className="fill-neutral-400 text-[10px]">
              Missing token, expired JWT
            </text>
            <text x="24" y="80" className="fill-amber-300 text-[12px] font-bold">
              → 401
            </text>
            <rect x="198" y="16" width="150" height="76" rx="8" className="fill-rose-950/35 stroke-rose-600/40" strokeWidth="1" />
            <text x="210" y="40" className="fill-rose-200/90 text-[11px] font-semibold">
              Known user, not allowed?
            </text>
            <text x="210" y="58" className="fill-neutral-400 text-[10px]">
              Wrong role on resource
            </text>
            <text x="210" y="80" className="fill-rose-300 text-[12px] font-bold">
              → 403
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
