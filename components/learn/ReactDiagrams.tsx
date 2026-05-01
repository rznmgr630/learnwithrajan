import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const REACT_DIAGRAM_IDS = new Set<RoadmapDetailDiagramId>([
  "react-virtual-dom",
  "react-render-cycle",
  "react-component-tree",
  "react-data-flow",
  "react-use-effect-lifecycle",
  "react-immutable-update",
  "react-controlled-input",
]);

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

    case "react-render-cycle":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            React re-render cycle — state or props change triggers a render,
            produces a new VDOM tree, diffs with the previous snapshot, then
            patches only what changed in the real DOM
          </figcaption>
          <svg viewBox="0 0 440 152" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="rrc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="rrc-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            <text x="220" y="13" textAnchor="middle" className="fill-neutral-500 text-[9px] font-semibold">
              What happens on every state / props change
            </text>

            {/* ── Row 1: trigger → render → VDOM ── */}
            <rect x="8" y="22" width="100" height="42" rx="6" fill="#18181b" stroke="#f59e0b" strokeWidth="1.2" />
            <text x="58" y="39" textAnchor="middle" className="fill-amber-400/90 text-[8px] font-semibold">state / props</text>
            <text x="58" y="52" textAnchor="middle" className="fill-amber-400/90 text-[8px] font-semibold">change</text>

            <line x1="108" y1="43" x2="144" y2="43" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rrc-arr)" />

            <rect x="144" y="22" width="90" height="42" rx="6" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="189" y="39" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">render()</text>
            <text x="189" y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">pure fn, no DOM</text>

            <line x1="234" y1="43" x2="270" y2="43" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rrc-arr)" />

            <rect x="270" y="22" width="106" height="42" rx="6" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="323" y="39" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">new VDOM</text>
            <text x="323" y="52" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">tree (in memory)</text>

            {/* down turn from row-1 right box to row-2 right box */}
            <line x1="323" y1="64" x2="323" y2="86" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rrc-arr)" />

            {/* ── Row 2: reconcile → patch ── */}
            <rect x="270" y="86" width="106" height="42" rx="6" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="323" y="103" textAnchor="middle" className="fill-neutral-400 text-[8px] font-semibold">diff &amp;</text>
            <text x="323" y="116" textAnchor="middle" className="fill-neutral-400 text-[8px] font-semibold">reconcile</text>

            {/* leftward arrow row-2 */}
            <line x1="270" y1="107" x2="238" y2="107" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rrc-arr)" />

            <rect x="120" y="86" width="118" height="42" rx="6" fill="#0f172a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="179" y="103" textAnchor="middle" className="fill-emerald-400/90 text-[8px] font-semibold">Real DOM</text>
            <text x="179" y="116" textAnchor="middle" className="fill-emerald-300 text-[7px]">minimal patch applied ✓</text>

            <text x="220" y="146" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Only the nodes that actually changed are written — no full page re-paint
            </text>
          </svg>
        </figure>
      );

    case "react-component-tree":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Component tree — React apps are a hierarchy of components; each
            component owns its own props-in / JSX-out boundary
          </figcaption>
          <svg viewBox="0 0 440 202" className="h-auto w-full" aria-hidden>
            {/* ── Level 0: App ── */}
            <rect x="184" y="10" width="72" height="28" rx="5" fill="#1e3a2f" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="28" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">&lt;App /&gt;</text>

            {/* lines App → Header / main */}
            <line x1="220" y1="38" x2="100" y2="66" stroke="#334155" strokeWidth="1" />
            <line x1="220" y1="38" x2="330" y2="66" stroke="#334155" strokeWidth="1" />

            {/* ── Level 1: Header + main ── */}
            <rect x="60" y="66" width="80" height="28" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="100" y="84" textAnchor="middle" className="fill-sky-300/90 text-[8px]">&lt;Header /&gt;</text>

            <rect x="290" y="66" width="80" height="28" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="330" y="84" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">&lt;main&gt;</text>

            {/* lines Header → (leaf), main → ListGroup + Sidebar */}
            <line x1="100" y1="94" x2="100" y2="118" stroke="#334155" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="330" y1="94" x2="274" y2="122" stroke="#334155" strokeWidth="1" />
            <line x1="330" y1="94" x2="382" y2="122" stroke="#334155" strokeWidth="1" />

            {/* Header leaf note */}
            <text x="100" y="130" textAnchor="middle" className="fill-neutral-600 text-[7px]">leaf — renders nav</text>

            {/* ── Level 2: ListGroup + Sidebar ── */}
            <rect x="228" y="122" width="92" height="28" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="274" y="140" textAnchor="middle" className="fill-sky-300/90 text-[8px]">&lt;ListGroup /&gt;</text>

            <rect x="348" y="122" width="72" height="28" rx="5" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="384" y="140" textAnchor="middle" className="fill-neutral-400 text-[8px]">&lt;Sidebar /&gt;</text>

            {/* lines ListGroup → Item×3 */}
            <line x1="274" y1="150" x2="196" y2="172" stroke="#334155" strokeWidth="1" />
            <line x1="274" y1="150" x2="274" y2="172" stroke="#334155" strokeWidth="1" />
            <line x1="274" y1="150" x2="352" y2="172" stroke="#334155" strokeWidth="1" />

            {/* ── Level 3: ListItems ── */}
            {([
              { cx: 196, label: "&lt;li /&gt;" },
              { cx: 274, label: "&lt;li /&gt;" },
              { cx: 352, label: "&lt;li /&gt;" },
            ] as const).map(({ cx, label }) => (
              <g key={cx}>
                <rect x={cx - 26} y="172" width="52" height="22" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
                <text x={cx} y="186" textAnchor="middle" className="fill-neutral-500 text-[7px]">{label}</text>
              </g>
            ))}

            {/* Props label */}
            <text x="220" y="197" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Each component receives props from its parent and returns JSX — a tree of descriptions, not real DOM nodes
            </text>
          </svg>
        </figure>
      );

    case "react-data-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Unidirectional data flow — props carry data down the tree; callbacks
            (on… functions) carry events back up. React enforces this direction.
          </figcaption>
          <svg viewBox="0 0 440 190" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="rdf-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="rdf-blue" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker id="rdf-amber" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f59e0b" />
              </marker>
            </defs>

            {/* ── Parent box ── */}
            <rect x="12" y="12" width="416" height="66" rx="7" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="30" y="30" className="fill-sky-400/90 text-[8px] font-semibold">App  (parent — owns state)</text>
            <text x="30" y="46" className="fill-neutral-400 text-[7px]">const [count, setCount] = useState(0)</text>
            <text x="30" y="60" className="fill-neutral-500 text-[7px]">const handleAdd = () =&gt; setCount(c =&gt; c + 1)</text>

            {/* ── Arrow labels between boxes ── */}
            {/* Left side: props arrow going DOWN */}
            <text x="128" y="90" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">props (data)</text>
            <text x="128" y="100" textAnchor="middle" className="fill-neutral-600 text-[7px]">count, onAdd</text>
            <line x1="128" y1="78" x2="128" y2="118" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#rdf-blue)" />

            {/* Right side: callback arrow going UP */}
            <text x="312" y="90" textAnchor="middle" className="fill-amber-400/90 text-[8px] font-semibold">on… callback</text>
            <text x="312" y="100" textAnchor="middle" className="fill-neutral-600 text-[7px]">onAdd()</text>
            <line x1="312" y1="118" x2="312" y2="78" stroke="#f59e0b" strokeWidth="1.5" markerEnd="url(#rdf-amber)" />

            {/* ── Child box ── */}
            <rect x="12" y="118" width="416" height="54" rx="7" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="30" y="136" className="fill-neutral-400 text-[8px] font-semibold">CounterControls  (child — reads props, fires callbacks)</text>
            <text x="30" y="152" className="fill-neutral-500 text-[7px]">function CounterControls({"{ count, onAdd }"}) {"{"}</text>
            <text x="30" y="163" className="fill-neutral-500 text-[7px]">  return &lt;button onClick={"{onAdd}"}&gt;{"{count}"}&lt;/button&gt;</text>

            <text x="220" y="184" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Child never mutates props — it calls the callback and the parent decides whether / how to update
            </text>
          </svg>
        </figure>
      );

    case "react-use-effect-lifecycle":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            useEffect lifecycle — effect timing across mount, dependency change,
            and unmount. React always runs cleanup before the next effect.
          </figcaption>
          <svg viewBox="0 0 440 206" className="h-auto w-full" aria-hidden>
            {/* column widths: 3 × 130 + 2 × 25 gaps = 440 */}
            {(
              [
                { x: 8,   label: "1 · Mount",       color: "#38bdf8", stroke: "#38bdf8" },
                { x: 155, label: "2 · deps change",  color: "#f59e0b", stroke: "#f59e0b" },
                { x: 302, label: "3 · Unmount",      color: "#f87171", stroke: "#f87171" },
              ] as const
            ).map(({ x, label, color, stroke }) => (
              <g key={x}>
                <rect x={x} y="12" width="130" height="26" rx="5" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 65} y="28" textAnchor="middle" style={{ fill: color }} fontSize="8" fontWeight="600">{label}</text>
              </g>
            ))}

            {/* ── Phase 1: Mount ── */}
            <rect x="8" y="50" width="130" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
            <text x="73" y="64" textAnchor="middle" className="fill-neutral-400 text-[7px]">component renders</text>

            <line x1="73" y1="72" x2="73" y2="84" stroke="#334155" strokeWidth="1" />

            <rect x="8" y="84" width="130" height="22" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" />
            <text x="73" y="98" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">▶ effect runs</text>

            <line x1="73" y1="106" x2="73" y2="118" stroke="#334155" strokeWidth="1" />

            <rect x="8" y="118" width="130" height="22" rx="4" fill="#18181b" stroke="#3f3f46" />
            <text x="73" y="132" textAnchor="middle" className="fill-neutral-500 text-[7px]">effect stays active…</text>

            {/* ── Phase 2: deps change ── */}
            <rect x="155" y="50" width="130" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
            <text x="220" y="64" textAnchor="middle" className="fill-neutral-400 text-[7px]">state / prop in deps list changes</text>

            <line x1="220" y1="72" x2="220" y2="84" stroke="#334155" strokeWidth="1" />

            <rect x="155" y="84" width="130" height="22" rx="4" fill="#2d1f00" stroke="#f59e0b" strokeWidth="1" />
            <text x="220" y="98" textAnchor="middle" className="fill-amber-300 text-[8px] font-semibold">⏹ cleanup runs first</text>

            <line x1="220" y1="106" x2="220" y2="118" stroke="#334155" strokeWidth="1" />

            <rect x="155" y="118" width="130" height="22" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" />
            <text x="220" y="132" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">▶ effect re-runs</text>

            {/* ── Phase 3: Unmount ── */}
            <rect x="302" y="50" width="130" height="22" rx="4" fill="#27272a" stroke="#3f3f46" />
            <text x="367" y="64" textAnchor="middle" className="fill-neutral-400 text-[7px]">component removed from tree</text>

            <line x1="367" y1="72" x2="367" y2="84" stroke="#334155" strokeWidth="1" />

            <rect x="302" y="84" width="130" height="22" rx="4" fill="#2d1f00" stroke="#f87171" strokeWidth="1" />
            <text x="367" y="98" textAnchor="middle" className="fill-red-300 text-[8px] font-semibold">⏹ final cleanup runs</text>

            <rect x="302" y="118" width="130" height="22" rx="4" fill="#18181b" stroke="#3f3f46" />
            <text x="367" y="132" textAnchor="middle" className="fill-neutral-600 text-[7px]">effect does not re-run</text>

            {/* ── Code example ── */}
            <rect x="8" y="152" width="424" height="42" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="20" y="167" className="fill-neutral-500 text-[7px]">useEffect(() =&gt; {"{"}</text>
            <text x="20" y="179" className="fill-sky-300/80 text-[7px]">  const id = setInterval(tick, 1000);    // effect — subscribe</text>
            <text x="20" y="191" className="fill-amber-400/80 text-[7px]">  return () =&gt; clearInterval(id);        // cleanup — unsubscribe</text>
            <text x="266" y="191" className="fill-neutral-500 text-[7px]">{"}, [tick])"}</text>
          </svg>
        </figure>
      );

    case "react-immutable-update":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Immutable state update — React detects changes by reference equality;
            mutating an object in place keeps the same reference so React skips
            the re-render
          </figcaption>
          <svg viewBox="0 0 440 168" className="h-auto w-full" aria-hidden>
            {/* ── WRONG side ── */}
            <rect x="8" y="12" width="202" height="26" rx="5" fill="#2d1515" stroke="#f87171" strokeWidth="1.2" />
            <text x="109" y="28" textAnchor="middle" className="fill-red-300 text-[8px] font-semibold">✗  Mutation (wrong)</text>

            <rect x="8" y="46" width="202" height="36" rx="5" fill="#18181b" stroke="#3f3f46" />
            <text x="20" y="60" className="fill-neutral-400 text-[7px]">// mutate in place</text>
            <text x="20" y="74" className="fill-red-300/90 text-[8px]">user.name = "Bob"</text>

            <line x1="109" y1="82" x2="109" y2="96" stroke="#334155" strokeWidth="1" />

            <rect x="8" y="96" width="202" height="22" rx="4" fill="#2d1515" stroke="#f87171" strokeWidth="1" />
            <text x="109" y="110" textAnchor="middle" className="fill-red-400/90 text-[7px]">same object reference — no re-render ✗</text>

            <line x1="109" y1="118" x2="109" y2="130" stroke="#334155" strokeWidth="1" />

            <rect x="8" y="130" width="202" height="28" rx="4" fill="#18181b" stroke="#52525b" />
            <text x="109" y="146" textAnchor="middle" className="fill-neutral-500 text-[8px]">UI stays stale even though</text>
            <text x="109" y="157" textAnchor="middle" className="fill-neutral-500 text-[7px]">the JS variable changed</text>

            {/* ── divider ── */}
            <line x1="220" y1="8" x2="220" y2="160" stroke="#3f3f46" strokeWidth="1" strokeDasharray="4 3" />
            <text x="220" y="90" textAnchor="middle" className="fill-neutral-600 text-[8px] font-semibold">vs</text>

            {/* ── CORRECT side ── */}
            <rect x="230" y="12" width="202" height="26" rx="5" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="331" y="28" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">✓  Spread copy (correct)</text>

            <rect x="230" y="46" width="202" height="36" rx="5" fill="#18181b" stroke="#3f3f46" />
            <text x="242" y="60" className="fill-neutral-400 text-[7px]">// create a new object</text>
            <text x="242" y="74" className="fill-emerald-300/90 text-[8px]">setUser({"{"} ...user, name: "Bob" {"}"})</text>

            <line x1="331" y1="82" x2="331" y2="96" stroke="#334155" strokeWidth="1" />

            <rect x="230" y="96" width="202" height="22" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1" />
            <text x="331" y="110" textAnchor="middle" className="fill-emerald-400/90 text-[7px]">new reference → React schedules re-render ✓</text>

            <line x1="331" y1="118" x2="331" y2="130" stroke="#334155" strokeWidth="1" />

            <rect x="230" y="130" width="202" height="28" rx="4" fill="#18181b" stroke="#3f3f46" />
            <text x="331" y="146" textAnchor="middle" className="fill-neutral-400 text-[8px]">component re-renders with</text>
            <text x="331" y="157" textAnchor="middle" className="fill-neutral-400 text-[7px]">the updated value visible</text>
          </svg>
        </figure>
      );

    case "react-controlled-input":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Controlled input cycle — React owns the value: every keystroke flows
            through state, making the UI a pure reflection of that state at all times
          </figcaption>
          <svg viewBox="0 0 440 148" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="rci-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="rci-sky" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Step boxes left-to-right across the top */}
            {(
              [
                { x: 8,   label: "user types",     sub: "keypress",         stroke: "#52525b", tc: "fill-neutral-400" },
                { x: 110, label: "onChange fires",  sub: "e.target.value",   stroke: "#38bdf8", tc: "fill-sky-300/90" },
                { x: 222, label: "setState(val)",   sub: "schedules render",  stroke: "#38bdf8", tc: "fill-sky-400/90" },
                { x: 330, label: "re-render",       sub: "fn runs again",    stroke: "#4ade80", tc: "fill-emerald-300" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="20" width="96" height="42" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 48} y="38" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 48} y="52" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}

            {/* Top-row arrows */}
            <line x1="104" y1="41" x2="110" y2="41" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rci-arr)" />
            <line x1="206" y1="41" x2="222" y2="41" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rci-arr)" />
            <line x1="318" y1="41" x2="330" y2="41" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#rci-arr)" />

            {/* Down from re-render → feedback box */}
            <line x1="378" y1="62" x2="378" y2="90" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#rci-sky)" />

            {/* Feedback strip */}
            <rect x="8" y="90" width="416" height="30" rx="5" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="220" y="108" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">
              {"<input value={title} onChange={e => setTitle(e.target.value)} />"}
            </text>

            {/* Return arrow from input box back to step 1 */}
            <line x1="104" y1="105" x2="8" y2="105" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" />
            <line x1="8" y1="105" x2="8" y2="62" stroke="#38bdf8" strokeWidth="1" strokeDasharray="3 2" markerEnd="url(#rci-sky)" />

            <text x="220" y="138" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              React sets input.value = state on every render — the browser never leads; state is the single source of truth
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
