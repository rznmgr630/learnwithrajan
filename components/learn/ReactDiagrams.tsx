import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const REACT_DIAGRAM_IDS = new Set<RoadmapDetailDiagramId>(["react-virtual-dom"]);

export function isReactRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return REACT_DIAGRAM_IDS.has(id);
}

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

/** SVG diagrams for the React learning roadmap (Day detail panel). */
export function ReactDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    case "react-virtual-dom":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Virtual DOM — React keeps lightweight element trees in memory, diffs
            them, then applies the smallest set of updates to the real DOM
          </figcaption>
          <svg viewBox="0 0 440 218" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id="rvd-arr"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker
                id="rvd-commit"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            <text
              x="220"
              y="14"
              textAnchor="middle"
              className="fill-neutral-400 text-[10px] font-semibold"
            >
              In-memory element trees (virtual description)
            </text>

            {/* Previous tree panel */}
            <rect
              x="12"
              y="22"
              width="188"
              height="78"
              rx="8"
              fill="#18181b"
              stroke="#52525b"
              strokeWidth="1"
            />
            <text x="24" y="38" className="fill-neutral-500 text-[9px] font-medium">
              Previous render
            </text>
            <rect x="24" y="46" width="72" height="16" rx="2" fill="#27272a" stroke="#3f3f46" />
            <text x="30" y="57" className="fill-neutral-400 text-[8px]">
              {"<div>"}
            </text>
            <rect x="32" y="66" width="68" height="14" rx="2" fill="#1e293b" stroke="#334155" />
            <text x="38" y="76" className="fill-sky-400/90 text-[7px]">
              {"<h1>Hi</h1>"}
            </text>
            <rect x="32" y="82" width="68" height="14" rx="2" fill="#27272a" stroke="#52525b" />
            <text x="38" y="92" className="fill-neutral-400 text-[7px]">
              {"<p>v1</p>"}
            </text>

            {/* Next tree panel */}
            <rect
              x="240"
              y="22"
              width="188"
              height="78"
              rx="8"
              fill="#18181b"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <text x="252" y="38" className="fill-sky-400/90 text-[9px] font-medium">
              Current render
            </text>
            <rect x="252" y="46" width="72" height="16" rx="2" fill="#27272a" stroke="#3f3f46" />
            <text x="258" y="57" className="fill-neutral-400 text-[8px]">
              {"<div>"}
            </text>
            <rect x="260" y="66" width="68" height="14" rx="2" fill="#1e293b" stroke="#334155" />
            <text x="266" y="76" className="fill-sky-400/90 text-[7px]">
              {"<h1>Hi</h1>"}
            </text>
            <rect
              x="260"
              y="82"
              width="68"
              height="14"
              rx="2"
              fill="#1e3a2f"
              stroke="#4ade80"
              strokeWidth="1"
            />
            <text x="266" y="92" className="fill-emerald-300 text-[7px] font-medium">
              {"<p>v2</p>"} ← changed
            </text>

            {/* Diff label between panels */}
            <text
              x="220"
              y="64"
              textAnchor="middle"
              className="fill-amber-400/90 text-[9px] font-semibold"
            >
              diff
            </text>

            {/* Arrow reconcile → DOM */}
            <line
              x1="220"
              y1="104"
              x2="220"
              y2="124"
              stroke="#64748b"
              strokeWidth="1.5"
              markerEnd="url(#rvd-arr)"
            />
            <text x="232" y="118" className="fill-neutral-500 text-[8px]">
              reconcile
            </text>

            {/* Real DOM strip */}
            <text x="16" y="132" className="fill-emerald-400/80 text-[9px] font-semibold">
              Real DOM (browser)
            </text>
            <rect
              x="12"
              y="138"
              width="416"
              height="56"
              rx="8"
              fill="#0f172a"
              stroke="#334155"
              strokeWidth="1"
            />
            <text x="24" y="158" className="fill-neutral-500 text-[8px]">
              div
            </text>
            <rect
              x="24"
              y="164"
              width="120"
              height="22"
              rx="3"
              fill="#1e293b"
              stroke="#38bdf8"
              strokeOpacity={0.45}
            />
            <text x="30" y="179" className="fill-sky-300/90 text-[8px]">
              h1: “Hi”
            </text>
            <text x="160" y="158" className="fill-neutral-500 text-[8px]">
              ↳ only text in
            </text>
            <text x="160" y="170" className="fill-neutral-500 text-[8px]">
              this subtree patched
            </text>
            <rect
              x="268"
              y="164"
              width="140"
              height="22"
              rx="3"
              fill="#1a2e1a"
              stroke="#4ade80"
              strokeWidth="1.2"
            />
            <text x="276" y="179" className="fill-emerald-300 text-[8px] font-medium">
              p text node → “v2”
            </text>

            <line
              x1="334"
              y1="100"
              x2="334"
              y2="162"
              stroke="#4ade80"
              strokeWidth="1.2"
              strokeDasharray="4 3"
              markerEnd="url(#rvd-commit)"
            />

            <text x="220" y="208" textAnchor="middle" className="fill-neutral-500 text-[8px]">
              h1 subtree reused · only the {"<p>"} content commit runs — fewer DOM writes than
              rebuilding the whole page
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
