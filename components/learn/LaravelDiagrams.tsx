import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";

const LARAVEL_DIAGRAM_IDS = new Set<RoadmapDetailDiagramId>([
  "laravel-request-lifecycle",
  "laravel-service-container",
  "laravel-eloquent-query",
  "laravel-eloquent-relations",
  "laravel-auth-guard",
  "laravel-queue-job",
  "laravel-api-resource",
  "laravel-test-pyramid",
]);

export function isLaravelRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return LARAVEL_DIAGRAM_IDS.has(id);
}

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

/** SVG diagrams for the Laravel learning roadmap (Day detail panel). */
export function LaravelDiagram({ id }: { id: RoadmapDetailDiagramId }) {
  switch (id) {
    // ─────────────────────────────────────────────────────────────
    // 1. Request lifecycle
    // ─────────────────────────────────────────────────────────────
    case "laravel-request-lifecycle":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Laravel request lifecycle — every HTTP request passes through the kernel, global middleware,
            router, route middleware, then the controller action before a response travels back
          </figcaption>
          <svg viewBox="0 0 440 160" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lrl-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="lrl-org" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#fb923c" />
              </marker>
            </defs>

            {/* Row 1: Browser → Kernel → Global Middleware → Router */}
            {(
              [
                { x: 8,   label: "Browser",         sub: "HTTP request",      stroke: "#52525b", tc: "fill-neutral-400" },
                { x: 110, label: "bootstrap/app",    sub: "kernel boot",       stroke: "#ef4444", tc: "fill-red-400" },
                { x: 214, label: "Global Middleware", sub: "TrimStrings etc.",  stroke: "#64748b", tc: "fill-neutral-400" },
                { x: 322, label: "Router",           sub: "URL matching",      stroke: "#38bdf8", tc: "fill-sky-300/90" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="20" width="98" height="40" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 49} y="37" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 49} y="51" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="106" y1="40" x2="110" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />
            <line x1="208" y1="40" x2="214" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />
            <line x1="312" y1="40" x2="322" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />

            {/* Down from Router */}
            <line x1="371" y1="60" x2="371" y2="78" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />

            {/* Row 2 (right-to-left): Route Middleware → Controller → Response */}
            {(
              [
                { x: 8,   label: "Response",         sub: "travels back",      stroke: "#fb923c", tc: "fill-orange-300" },
                { x: 144, label: "Controller",        sub: "action / return",   stroke: "#38bdf8", tc: "fill-sky-400/90" },
                { x: 272, label: "Route Middleware",  sub: "auth, throttle…",   stroke: "#64748b", tc: "fill-neutral-400" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="78" width="120" height="40" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 60} y="95" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 60} y="109" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="392" y1="98" x2="272" y2="98" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />
            <line x1="272" y1="98" x2="264" y2="98" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lrl-arr)" />
            <line x1="144" y1="98" x2="128" y2="98" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#lrl-org)" />

            <text x="220" y="150" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Request enters left → flows through each layer → Controller produces a response → same layers return it to Browser
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 2. Service Container
    // ─────────────────────────────────────────────────────────────
    case "laravel-service-container":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Service Container (IoC) — bind an interface to a concrete class in a Service Provider;
            Laravel auto-resolves constructor dependencies by type-hint
          </figcaption>
          <svg viewBox="0 0 440 190" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lsc-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="lsc-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
              </marker>
              <marker id="lsc-sky" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
            </defs>

            {/* Panel 1: Service Provider */}
            <rect x="8" y="12" width="128" height="82" rx="7" fill="#18181b" stroke="#ef4444" strokeWidth="1.2" />
            <text x="72" y="28" textAnchor="middle" className="fill-red-400 text-[8px] font-semibold">Service Provider</text>
            <text x="72" y="40" textAnchor="middle" className="fill-neutral-500 text-[7px]">boot() / register()</text>
            <rect x="16" y="48" width="112" height="38" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="24" y="62" className="fill-neutral-500 text-[7px]">$this-&gt;app-&gt;bind(</text>
            <text x="24" y="74" className="fill-sky-300/90 text-[7px]">  Interface::class,</text>
            <text x="24" y="84" className="fill-emerald-300/90 text-[7px]">  Concrete::class</text>
            <text x="24" y="94" className="fill-neutral-500 text-[7px]">);</text>

            {/* Arrow: Provider → Container */}
            <line x1="136" y1="53" x2="156" y2="53" stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#lsc-red)" />

            {/* Panel 2: IoC Container */}
            <rect x="156" y="12" width="128" height="82" rx="7" fill="#1e1a2f" stroke="#a78bfa" strokeWidth="1.4" />
            <text x="220" y="30" textAnchor="middle" className="fill-violet-300 text-[9px] font-semibold">IoC Container</text>
            <text x="220" y="43" textAnchor="middle" className="fill-violet-400/70 text-[7px]">app()</text>
            <rect x="168" y="50" width="104" height="18" rx="3" fill="#27272a" stroke="#52525b" />
            <text x="220" y="62" textAnchor="middle" className="fill-neutral-400 text-[7px]">binding registry</text>
            <rect x="168" y="72" width="104" height="18" rx="3" fill="#27272a" stroke="#52525b" />
            <text x="220" y="84" textAnchor="middle" className="fill-violet-300/80 text-[7px]">resolve(Interface)</text>

            {/* Arrow: Container → Controller */}
            <line x1="284" y1="53" x2="304" y2="53" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#lsc-sky)" />

            {/* Panel 3: Controller */}
            <rect x="304" y="12" width="128" height="82" rx="7" fill="#18181b" stroke="#38bdf8" strokeWidth="1.2" />
            <text x="368" y="28" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">Controller</text>
            <rect x="312" y="36" width="112" height="50" rx="4" fill="#0f172a" stroke="#334155" />
            <text x="320" y="49" className="fill-neutral-500 text-[7px]">function __construct(</text>
            <text x="320" y="61" className="fill-sky-300/90 text-[7px]">  Interface $dep</text>
            <text x="320" y="73" className="fill-neutral-500 text-[7px]">) {"{}"}</text>
            <text x="320" y="85" className="fill-emerald-300/80 text-[7px]">// auto-injected ✓</text>

            {/* Note strip */}
            <rect x="8" y="106" width="424" height="28" rx="5" fill="#1e1a2f" stroke="#a78bfa" strokeWidth="1" />
            <text x="220" y="118" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">
              Type-hint in constructor → Container resolves the binding → injects concrete instance
            </text>
            <text x="220" y="130" textAnchor="middle" className="fill-neutral-500 text-[7px]">
              Singletons, factories, and contextual bindings all supported
            </text>

            {/* Tip */}
            <rect x="8" y="146" width="424" height="36" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="20" y="159" className="fill-neutral-500 text-[7px]">// resolve manually anywhere:</text>
            <text x="20" y="173" className="fill-emerald-300/90 text-[8px]">$service = app(Interface::class);  // or dependency injection via constructor</text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 3. Eloquent query flow
    // ─────────────────────────────────────────────────────────────
    case "laravel-eloquent-query":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Eloquent query flow — method calls chain on the query builder; the SQL is compiled
            and executed once when you call get(), first(), or paginate()
          </figcaption>
          <svg viewBox="0 0 440 184" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="leq-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="leq-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Chain row */}
            {(
              [
                { x: 8,   label: "Post::",              sub: "Model facade",        stroke: "#ef4444", tc: "fill-red-400" },
                { x: 84,  label: "->where(…)",           sub: "filter",              stroke: "#38bdf8", tc: "fill-sky-300/90" },
                { x: 172, label: "->orderBy(…)",         sub: "sort",                stroke: "#a78bfa", tc: "fill-violet-300" },
                { x: 262, label: "->with('user')",       sub: "eager load",          stroke: "#fb923c", tc: "fill-orange-300" },
                { x: 352, label: "->paginate(15)",       sub: "executes SQL",        stroke: "#4ade80", tc: "fill-emerald-300" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="16" width="80" height="40" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 40} y="33" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 40} y="47" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="88" y1="36" x2="84" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#leq-arr)" />
            <line x1="164" y1="36" x2="172" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#leq-arr)" />
            <line x1="252" y1="36" x2="262" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#leq-arr)" />
            <line x1="342" y1="36" x2="352" y2="36" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#leq-arr)" />

            {/* Down from paginate */}
            <line x1="392" y1="56" x2="392" y2="74" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#leq-grn)" />

            {/* Compiled SQL box */}
            <rect x="8" y="74" width="424" height="34" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="20" y="88" className="fill-neutral-500 text-[7px]">compiled SQL →</text>
            <text x="100" y="88" className="fill-amber-300/90 text-[8px]">SELECT * FROM posts WHERE active = 1 ORDER BY created_at DESC LIMIT 15</text>
            <text x="20" y="102" className="fill-neutral-500 text-[7px]">+ eager load →</text>
            <text x="100" y="102" className="fill-sky-300/80 text-[7px]">SELECT * FROM users WHERE id IN (…)    ← single extra query (N+1 avoided)</text>

            {/* Arrow down */}
            <line x1="220" y1="108" x2="220" y2="126" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#leq-arr)" />

            {/* Result box */}
            <rect x="8" y="126" width="424" height="32" rx="5" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="141" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">
              LengthAwarePaginator — hydrated Post models with $post-&gt;user already loaded
            </text>
            <text x="220" y="153" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">
              no SQL runs until the terminal method — query builder is lazy
            </text>

            <text x="220" y="178" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              All builder methods return $this — chain as many constraints as needed before the terminal call
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 4. Eloquent relations
    // ─────────────────────────────────────────────────────────────
    case "laravel-eloquent-relations":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Eloquent relationship types — hasOne/hasMany (1:N), belongsTo (N:1),
            and belongsToMany (M:N via pivot table)
          </figcaption>
          <svg viewBox="0 0 440 220" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="ler-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="ler-sky" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker id="ler-org" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#fb923c" />
              </marker>
            </defs>

            {/* ── Row 1: hasOne 1:1 ── */}
            <text x="8" y="18" className="fill-neutral-500 text-[7px] font-semibold">1:1 — hasOne / belongsTo</text>
            <rect x="8" y="22" width="90" height="38" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="53" y="37" textAnchor="middle" className="fill-sky-400/90 text-[8px] font-semibold">users</text>
            <text x="53" y="51" textAnchor="middle" className="fill-neutral-500 text-[7px]">id (PK)</text>
            <line x1="98" y1="41" x2="152" y2="41" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#ler-sky)" />
            <text x="125" y="37" textAnchor="middle" className="fill-sky-300/80 text-[7px]">hasOne</text>
            <rect x="152" y="22" width="108" height="38" rx="5" fill="#18181b" stroke="#38bdf8" strokeWidth="1" />
            <text x="206" y="37" textAnchor="middle" className="fill-sky-300/90 text-[8px] font-semibold">profiles</text>
            <text x="206" y="51" textAnchor="middle" className="fill-neutral-500 text-[7px]">id, user_id (FK)</text>
            <text x="290" y="37" className="fill-neutral-600 text-[7px]">FK lives in profiles table</text>

            {/* ── Row 2: hasMany 1:N ── */}
            <text x="8" y="80" className="fill-neutral-500 text-[7px] font-semibold">1:N — hasMany / belongsTo</text>
            <rect x="8" y="84" width="90" height="38" rx="5" fill="#18181b" stroke="#fb923c" strokeWidth="1" />
            <text x="53" y="99" textAnchor="middle" className="fill-orange-300 text-[8px] font-semibold">users</text>
            <text x="53" y="113" textAnchor="middle" className="fill-neutral-500 text-[7px]">id (PK)</text>
            <line x1="98" y1="103" x2="152" y2="103" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#ler-org)" />
            <text x="125" y="99" textAnchor="middle" className="fill-orange-300/80 text-[7px]">hasMany</text>
            <rect x="152" y="84" width="108" height="38" rx="5" fill="#18181b" stroke="#fb923c" strokeWidth="1" />
            <text x="206" y="99" textAnchor="middle" className="fill-orange-300 text-[8px] font-semibold">posts</text>
            <text x="206" y="113" textAnchor="middle" className="fill-neutral-500 text-[7px]">id, user_id (FK)</text>
            <text x="290" y="99" className="fill-neutral-600 text-[7px]">FK lives in posts table;</text>
            <text x="290" y="111" className="fill-neutral-600 text-[7px]">one user → many posts</text>

            {/* ── Row 3: belongsToMany M:N ── */}
            <text x="8" y="142" className="fill-neutral-500 text-[7px] font-semibold">M:N — belongsToMany (pivot)</text>
            <rect x="8" y="146" width="90" height="50" rx="5" fill="#18181b" stroke="#a78bfa" strokeWidth="1" />
            <text x="53" y="161" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">users</text>
            <text x="53" y="175" textAnchor="middle" className="fill-neutral-500 text-[7px]">id (PK)</text>

            {/* pivot box */}
            <rect x="152" y="146" width="116" height="50" rx="5" fill="#1e1a2f" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="210" y="162" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">role_user (pivot)</text>
            <text x="210" y="175" textAnchor="middle" className="fill-neutral-500 text-[7px]">user_id (FK)</text>
            <text x="210" y="187" textAnchor="middle" className="fill-neutral-500 text-[7px]">role_id (FK)</text>

            <rect x="320" y="146" width="90" height="50" rx="5" fill="#18181b" stroke="#a78bfa" strokeWidth="1" />
            <text x="365" y="161" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">roles</text>
            <text x="365" y="175" textAnchor="middle" className="fill-neutral-500 text-[7px]">id (PK)</text>

            {/* arrows */}
            <line x1="98" y1="171" x2="152" y2="171" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#ler-arr)" />
            <line x1="268" y1="171" x2="320" y2="171" stroke="#a78bfa" strokeWidth="1.5" markerEnd="url(#ler-arr)" />

            <text x="220" y="212" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              $user-&gt;roles  &amp;  $role-&gt;users  — both sides use belongsToMany; pivot holds both FKs
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 5. Auth guards
    // ─────────────────────────────────────────────────────────────
    case "laravel-auth-guard":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Laravel auth guards — the 'web' guard uses sessions, the 'api' guard uses tokens (Sanctum);
            Auth::user() returns the resolved user for the current guard
          </figcaption>
          <svg viewBox="0 0 440 200" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lag-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="lag-sky" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#38bdf8" />
              </marker>
              <marker id="lag-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Left column: web guard */}
            <text x="10" y="16" className="fill-sky-400/90 text-[8px] font-semibold">web guard (session)</text>
            {(
              [
                { y: 22,  label: "Request",          sub: "browser HTTP",   stroke: "#52525b", tc: "fill-neutral-400" },
                { y: 72,  label: "Session Cookie",   sub: "PHPSESSID",      stroke: "#38bdf8", tc: "fill-sky-300/90" },
                { y: 122, label: "Session Store",    sub: "Redis / file",   stroke: "#38bdf8", tc: "fill-sky-300/90" },
              ] as const
            ).map(({ y, label, sub, stroke, tc }) => (
              <g key={y}>
                <rect x="8" y={y} width="112" height="38" rx="5" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x="64" y={y + 16} textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x="64" y={y + 30} textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="64" y1="60" x2="64" y2="72" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lag-arr)" />
            <line x1="64" y1="110" x2="64" y2="122" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lag-arr)" />
            <line x1="64" y1="160" x2="64" y2="174" stroke="#38bdf8" strokeWidth="1.5" markerEnd="url(#lag-sky)" />

            {/* Right column: api guard */}
            <text x="248" y="16" className="fill-orange-300 text-[8px] font-semibold">api guard (Sanctum token)</text>
            {(
              [
                { y: 22,  label: "Request",          sub: "mobile / SPA",    stroke: "#52525b",  tc: "fill-neutral-400" },
                { y: 72,  label: "Bearer Token",     sub: "Authorization:",  stroke: "#fb923c",  tc: "fill-orange-300" },
                { y: 122, label: "personal_access",  sub: "tokens table",    stroke: "#fb923c",  tc: "fill-orange-300" },
              ] as const
            ).map(({ y, label, sub, stroke, tc }) => (
              <g key={y}>
                <rect x="248" y={y} width="112" height="38" rx="5" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x="304" y={y + 16} textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x="304" y={y + 30} textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="304" y1="60" x2="304" y2="72" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lag-arr)" />
            <line x1="304" y1="110" x2="304" y2="122" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lag-arr)" />
            <line x1="304" y1="160" x2="304" y2="174" stroke="#fb923c" strokeWidth="1.5" markerEnd="url(#lag-arr)" />

            {/* Converge: User model */}
            <rect x="148" y="174" width="144" height="18" rx="4" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="186" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Auth::user() → User model ✓</text>

            <text x="220" y="198" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              Both guards resolve to the same User Eloquent model — use auth middleware per route group
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 6. Queue & job flow
    // ─────────────────────────────────────────────────────────────
    case "laravel-queue-job":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Queue &amp; job flow — dispatch pushes a serialized job onto the queue; a worker
            process picks it up and executes handle(); failed jobs go to the failed_jobs table
          </figcaption>
          <svg viewBox="0 0 440 178" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lqj-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="lqj-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
              <marker id="lqj-red" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#f87171" />
              </marker>
            </defs>

            {/* Top row: dispatch → queue → worker → handle */}
            {(
              [
                { x: 8,   label: "dispatch()",       sub: "serializes job",   stroke: "#ef4444", tc: "fill-red-400" },
                { x: 114, label: "Queue",             sub: "Redis/DB/SQS",    stroke: "#fb923c", tc: "fill-orange-300" },
                { x: 218, label: "queue:work",        sub: "worker process",  stroke: "#38bdf8", tc: "fill-sky-300/90" },
                { x: 326, label: "handle()",          sub: "business logic",  stroke: "#a78bfa", tc: "fill-violet-300" },
              ] as const
            ).map(({ x, label, sub, stroke, tc }) => (
              <g key={x}>
                <rect x={x} y="20" width="100" height="40" rx="6" fill="#18181b" stroke={stroke} strokeWidth="1" />
                <text x={x + 50} y="37" textAnchor="middle" className={`${tc} text-[8px] font-semibold`}>{label}</text>
                <text x={x + 50} y="51" textAnchor="middle" className="fill-neutral-500 text-[7px]">{sub}</text>
              </g>
            ))}
            <line x1="108" y1="40" x2="114" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lqj-arr)" />
            <line x1="214" y1="40" x2="218" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lqj-arr)" />
            <line x1="318" y1="40" x2="326" y2="40" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lqj-arr)" />

            {/* Down from handle() → two paths */}
            <line x1="376" y1="60" x2="376" y2="80" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lqj-arr)" />

            {/* Success path */}
            <rect x="302" y="80" width="130" height="34" rx="5" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="367" y="95" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">Success ✓</text>
            <text x="367" y="108" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">job deleted from queue</text>

            {/* Failure path (leftward from handle) */}
            <line x1="326" y1="60" x2="220" y2="60" stroke="#f87171" strokeWidth="1.2" strokeDasharray="4 3" markerEnd="url(#lqj-red)" />
            <rect x="120" y="80" width="170" height="50" rx="5" fill="#2d1515" stroke="#f87171" strokeWidth="1.2" />
            <text x="205" y="97" textAnchor="middle" className="fill-red-300 text-[8px] font-semibold">Exception thrown</text>
            <text x="205" y="110" textAnchor="middle" className="fill-neutral-500 text-[7px]">retry (up to $tries times)</text>
            <text x="205" y="123" textAnchor="middle" className="fill-red-400/80 text-[7px]">→ failed_jobs table (exhausted)</text>

            {/* Code hint */}
            <rect x="8" y="144" width="424" height="28" rx="5" fill="#0f172a" stroke="#334155" />
            <text x="20" y="157" className="fill-neutral-500 text-[7px]">dispatch:</text>
            <text x="68" y="157" className="fill-emerald-300/90 text-[8px]">SendWelcomeEmail::dispatch($user);</text>
            <text x="280" y="157" className="fill-neutral-500 text-[7px]">worker:</text>
            <text x="318" y="157" className="fill-sky-300/80 text-[8px]">php artisan queue:work</text>
            <text x="20" y="168" className="fill-neutral-500 text-[7px]">retry failed:</text>
            <text x="75" y="168" className="fill-amber-300/80 text-[8px]">php artisan queue:retry all</text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 7. API Resource
    // ─────────────────────────────────────────────────────────────
    case "laravel-api-resource":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            API Resource — transforms an Eloquent model or collection into a controlled JSON
            response; only the fields you define are exposed
          </figcaption>
          <svg viewBox="0 0 440 196" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="lar-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#64748b" />
              </marker>
              <marker id="lar-grn" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="#4ade80" />
              </marker>
            </defs>

            {/* Left: Model (all columns) */}
            <rect x="8" y="12" width="130" height="136" rx="7" fill="#18181b" stroke="#52525b" strokeWidth="1" />
            <text x="73" y="28" textAnchor="middle" className="fill-neutral-400 text-[8px] font-semibold">Eloquent Model</text>
            <text x="73" y="40" textAnchor="middle" className="fill-neutral-500 text-[7px]">all columns</text>
            {(
              [
                { y: 50, label: "id", color: "fill-neutral-400" },
                { y: 63, label: "user_id", color: "fill-neutral-500" },
                { y: 76, label: "password_hash", color: "fill-red-400/80" },
                { y: 89, label: "remember_token", color: "fill-red-400/80" },
                { y: 102, label: "title", color: "fill-neutral-400" },
                { y: 115, label: "body", color: "fill-neutral-400" },
                { y: 128, label: "created_at", color: "fill-neutral-500" },
                { y: 141, label: "updated_at", color: "fill-neutral-500" },
              ] as const
            ).map(({ y, label, color }) => (
              <text key={y} x="20" y={y} className={`${color} text-[7px]`}>• {label}</text>
            ))}

            {/* Middle: Resource transformer */}
            <rect x="160" y="12" width="120" height="136" rx="7" fill="#1e1a2f" stroke="#a78bfa" strokeWidth="1.2" />
            <text x="220" y="28" textAnchor="middle" className="fill-violet-300 text-[8px] font-semibold">PostResource</text>
            <text x="220" y="40" textAnchor="middle" className="fill-violet-400/70 text-[7px]">::toArray()</text>
            <rect x="170" y="48" width="100" height="14" rx="3" fill="#27272a" stroke="#52525b" />
            <text x="220" y="58" textAnchor="middle" className="fill-neutral-500 text-[7px]">filter / rename</text>
            <rect x="170" y="66" width="100" height="14" rx="3" fill="#27272a" stroke="#52525b" />
            <text x="220" y="76" textAnchor="middle" className="fill-neutral-500 text-[7px]">add computed fields</text>
            <rect x="170" y="84" width="100" height="14" rx="3" fill="#2d1515" stroke="#f87171" strokeWidth="1" />
            <text x="220" y="94" textAnchor="middle" className="fill-red-300/90 text-[7px]">strips sensitive fields</text>
            <rect x="170" y="102" width="100" height="14" rx="3" fill="#27272a" stroke="#52525b" />
            <text x="220" y="112" textAnchor="middle" className="fill-neutral-500 text-[7px]">nest relations</text>
            <rect x="170" y="120" width="100" height="22" rx="3" fill="#0f172a" stroke="#334155" />
            <text x="220" y="130" textAnchor="middle" className="fill-neutral-500 text-[7px]">return new</text>
            <text x="220" y="141" textAnchor="middle" className="fill-violet-300/80 text-[7px]">PostResource($post)</text>

            {/* Right: JSON output */}
            <rect x="302" y="12" width="130" height="136" rx="7" fill="#1a2e1a" stroke="#4ade80" strokeWidth="1.2" />
            <text x="367" y="28" textAnchor="middle" className="fill-emerald-300 text-[8px] font-semibold">JSON Response</text>
            <text x="367" y="40" textAnchor="middle" className="fill-emerald-400/70 text-[7px]">only safe fields</text>
            {(
              [
                { y: 55,  label: '"id": 42',              color: "fill-emerald-300/90" },
                { y: 68,  label: '"title": "Hello"',       color: "fill-emerald-300/90" },
                { y: 81,  label: '"body": "…"',            color: "fill-emerald-300/90" },
                { y: 94,  label: '"author": {',            color: "fill-sky-300/80" },
                { y: 107, label: '  "name": "Alice"',      color: "fill-sky-300/80" },
                { y: 120, label: '}',                      color: "fill-sky-300/80" },
                { y: 133, label: '"published_at": "…"',   color: "fill-amber-300/80" },
              ] as const
            ).map(({ y, label, color }) => (
              <text key={y} x="312" y={y} className={`${color} text-[7px]`}>{label}</text>
            ))}

            {/* Arrows */}
            <line x1="138" y1="80" x2="160" y2="80" stroke="#64748b" strokeWidth="1.5" markerEnd="url(#lar-arr)" />
            <line x1="280" y1="80" x2="302" y2="80" stroke="#4ade80" strokeWidth="1.5" markerEnd="url(#lar-grn)" />

            <text x="220" y="188" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              return new PostResource($post);  or  PostResource::collection($posts);
            </text>
          </svg>
        </figure>
      );

    // ─────────────────────────────────────────────────────────────
    // 8. Test pyramid
    // ─────────────────────────────────────────────────────────────
    case "laravel-test-pyramid":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            Laravel testing pyramid — Unit tests are fastest and most isolated; Feature (HTTP)
            tests cover full request cycles; browser tests (Dusk) cover E2E flows
          </figcaption>
          <svg viewBox="0 0 440 214" className="h-auto w-full" aria-hidden>

            {/* ── Pyramid tiers (bottom = widest) ── */}

            {/* Bottom tier: Unit */}
            <polygon points="60,190 380,190 340,130 100,130" fill="#14532d" stroke="#4ade80" strokeWidth="1.2" />
            <text x="220" y="160" textAnchor="middle" className="fill-emerald-300 text-[9px] font-semibold">Unit Tests</text>
            <text x="220" y="173" textAnchor="middle" className="fill-emerald-400/80 text-[7px]">most / fastest / no I/O</text>
            <text x="220" y="183" textAnchor="middle" className="fill-emerald-300/60 text-[6px]">it('computes tax', fn() =&gt; expect(tax(100))-&gt;toBe(10))</text>

            {/* Middle tier: Feature */}
            <polygon points="100,130 340,130 290,70 150,70" fill="#451a03" stroke="#fb923c" strokeWidth="1.2" />
            <text x="220" y="102" textAnchor="middle" className="fill-orange-300 text-[9px] font-semibold">Feature Tests (HTTP)</text>
            <text x="220" y="114" textAnchor="middle" className="fill-orange-400/80 text-[7px]">$this-&gt;actingAs($user)-&gt;get('/dashboard')-&gt;assertOk()</text>
            <text x="220" y="126" textAnchor="middle" className="fill-orange-300/60 text-[6px]">full request cycle, DB, middleware</text>

            {/* Top tier: Browser/Dusk */}
            <polygon points="150,70 290,70 255,22 185,22" fill="#450a0a" stroke="#f87171" strokeWidth="1.2" />
            <text x="220" y="46" textAnchor="middle" className="fill-red-300 text-[9px] font-semibold">Browser / Dusk</text>
            <text x="220" y="58" textAnchor="middle" className="fill-red-400/80 text-[7px]">E2E — slowest / fewest</text>

            {/* Right-side labels */}
            <line x1="390" y1="46" x2="268" y2="46" stroke="#f87171" strokeWidth="1" strokeDasharray="3 2" />
            <text x="394" y="50" className="fill-red-300/80 text-[7px]">slowest · fewest</text>

            <line x1="390" y1="100" x2="345" y2="100" stroke="#fb923c" strokeWidth="1" strokeDasharray="3 2" />
            <text x="394" y="104" className="fill-orange-300/80 text-[7px]">medium speed &amp; count</text>

            <line x1="390" y1="160" x2="384" y2="160" stroke="#4ade80" strokeWidth="1" strokeDasharray="3 2" />
            <text x="394" y="148" className="fill-emerald-300/80 text-[7px]">most numerous</text>
            <text x="394" y="160" className="fill-emerald-300/80 text-[7px]">fastest · isolated</text>

            {/* Bottom note */}
            <text x="220" y="206" textAnchor="middle" className="fill-neutral-600 text-[7px]">
              run: php artisan test   or   ./vendor/bin/pest   (Pest is the modern choice for Laravel)
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
