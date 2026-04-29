"use client";

import { useId } from "react";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { RichText } from "@/components/learn/RichText";
import type { GitCheatsheetVisualId } from "@/lib/git-learning/git-cheatsheet-visual-items";
import { GIT_ROADMAP_CHEATSHEET_ITEMS } from "@/lib/git-learning/git-cheatsheet-visual-items";
import { pickLocalized } from "@/lib/i18n/pick";

function MiniVisual({
  id,
  uid,
  beforeLabel,
  afterLabel,
}: {
  id: GitCheatsheetVisualId;
  uid: string;
  beforeLabel: string;
  afterLabel: string;
}) {
  const panel = "fill-[color-mix(in_oklab,var(--elevated)_55%,transparent)] stroke-[var(--border)]";
  const labelSm = "fill-[var(--muted)] text-[8px]";
  const labelMd = "fill-[var(--text)] text-[9px] font-medium";

  switch (id) {
    case "init":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full max-w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <rect x="12" y="22" width="116" height="88" rx="8" className={panel} strokeWidth="1.2" />
          <text x="70" y="46" textAnchor="middle" className={labelMd}>
            my-app/
          </text>
          <rect x="28" y="56" width="84" height="10" rx="2" className="fill-[color-mix(in_oklab,var(--surface)_70%,transparent)] stroke-[var(--border)]" strokeWidth="0.8" />
          <text x="70" y="64" textAnchor="middle" className="fill-[var(--faint)] text-[7px]">
            README.md
          </text>
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[9px] font-semibold">
            git init
          </text>
          <rect x="192" y="22" width="116" height="88" rx="8" className={panel} strokeWidth="1.2" />
          <text x="250" y="46" textAnchor="middle" className={labelMd}>
            my-app/
          </text>
          <rect x="208" y="56" width="84" height="10" rx="2" className="fill-[color-mix(in_oklab,var(--surface)_70%,transparent)] stroke-[var(--border)]" strokeWidth="0.8" />
          <rect x="238" y="78" width="58" height="24" rx="4" className="fill-amber-500/25 stroke-amber-600/50" strokeWidth="1.2" />
          <text x="267" y="94" textAnchor="middle" className="fill-[var(--text)] text-[8px] font-mono font-semibold">
            .git
          </text>
        </svg>
      );

    case "clone":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <ellipse cx="70" cy="64" rx="44" ry="28" className="fill-sky-500/15 stroke-sky-500/40" strokeWidth="1.2" />
          <text x="70" y="60" textAnchor="middle" className={labelMd}>
            remote
          </text>
          <text x="70" y="74" textAnchor="middle" className="fill-[var(--faint)] text-[7px]">
            on server
          </text>
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[9px] font-semibold">
            git clone
          </text>
          <rect x="192" y="28" width="116" height="84" rx="8" className={panel} strokeWidth="1.2" />
          <text x="250" y="50" textAnchor="middle" className={labelMd}>
            my-app/
          </text>
          <rect x="208" y="60" width="84" height="8" rx="2" className="fill-[color-mix(in_oklab,var(--surface)_70%,transparent)] stroke-[var(--border)]" strokeWidth="0.8" />
          <rect x="238" y="76" width="58" height="22" rx="4" className="fill-amber-500/25 stroke-amber-600/50" strokeWidth="1.2" />
          <text x="267" y="91" textAnchor="middle" className="fill-[var(--text)] text-[7px] font-mono">
            .git
          </text>
          <text x="250" y="106" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            origin →
          </text>
        </svg>
      );

    case "add":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <rect x="12" y="28" width="116" height="76" rx="8" className="fill-[color-mix(in_oklab,var(--surface)_40%,transparent)] stroke-dashed stroke-[var(--border)]" strokeWidth="1.5" strokeDasharray="4 3" />
          <text x="70" y="48" textAnchor="middle" className={labelSm}>
            working tree
          </text>
          <rect x="36" y="58" width="68" height="32" rx="4" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-[var(--border)]" strokeWidth="1" />
          <text x="70" y="78" textAnchor="middle" className="fill-[var(--text)] text-[8px] font-mono">
            app.ts
          </text>
          <text x="70" y="92" textAnchor="middle" className="fill-amber-600/90 text-[7px]">
            modified
          </text>
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[9px] font-semibold">
            git add
          </text>
          <rect x="192" y="28" width="116" height="76" rx="8" className="fill-teal-500/12 stroke-teal-500/45" strokeWidth="1.5" />
          <text x="250" y="48" textAnchor="middle" className={labelSm}>
            staging (index)
          </text>
          <rect x="216" y="58" width="68" height="32" rx="4" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-teal-500/55" strokeWidth="1" />
          <text x="250" y="78" textAnchor="middle" className="fill-[var(--text)] text-[8px] font-mono">
            app.ts
          </text>
        </svg>
      );

    case "commit":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <rect x="12" y="28" width="116" height="76" rx="8" className="fill-teal-500/12 stroke-teal-500/45" strokeWidth="1.5" />
          <text x="70" y="50" textAnchor="middle" className={labelSm}>
            staged snapshot
          </text>
          <circle cx="70" cy="72" r="6" className="fill-[var(--accent)]" />
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[9px] font-semibold">
            git commit
          </text>
          <rect x="192" y="28" width="116" height="76" rx="8" className={panel} strokeWidth="1.2" />
          <text x="250" y="48" textAnchor="middle" className={labelSm}>
            branch main
          </text>
          <line x1="230" y1="72" x2="270" y2="72" stroke="var(--border)" strokeWidth="2" />
          <circle cx="238" cy="72" r="5" className="fill-[var(--muted)]" />
          <circle cx="262" cy="72" r="6" className="fill-[var(--accent)]" />
          <text x="250" y="96" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            new commit
          </text>
        </svg>
      );

    case "branch":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <rect x="12" y="32" width="116" height="64" rx="8" className={panel} strokeWidth="1.2" />
          <text x="70" y="54" textAnchor="middle" className={labelMd}>
            main only
          </text>
          <line x1="36" y1="72" x2="104" y2="72" stroke="var(--border)" strokeWidth="2" />
          <circle cx="80" cy="72" r="5" className="fill-[var(--accent)]" />
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[8px] font-semibold">
            git switch -c
          </text>
          <rect x="192" y="32" width="116" height="64" rx="8" className={panel} strokeWidth="1.2" />
          <line x1="216" y1="72" x2="288" y2="72" stroke="var(--border)" strokeWidth="2" />
          <circle cx="224" cy="72" r="4" className="fill-[var(--muted)]" />
          <circle cx="248" cy="72" r="5" className="fill-[var(--accent)]" />
          <path d="M 248 72 Q 268 48 288 52" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
          <circle cx="292" cy="52" r="4" className="fill-emerald-500/80" />
          <text x="250" y="94" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            main · feature
          </text>
        </svg>
      );

    case "branchList":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git branch
          </text>
          <rect x="16" y="24" width="288" height="88" rx="8" className="fill-neutral-950/80 stroke-neutral-700/60" strokeWidth="1" />
          <text x="28" y="44" className="fill-emerald-400/95 font-mono text-[8px] font-semibold">
            * main
          </text>
          <text x="28" y="60" className="fill-zinc-300 font-mono text-[8px]">
            feature/login
          </text>
          <text x="28" y="76" className="fill-zinc-300 font-mono text-[8px]">
            fix/null-crash
          </text>
          <text x="28" y="96" className="fill-zinc-500 font-mono text-[7px]">
            chore/docs
          </text>
        </svg>
      );

    case "remoteSync":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <defs>
            <marker id={`ch-arrow-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#f43f5e" />
            </marker>
            <marker id={`ch-arrow2-${uid}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
            </marker>
          </defs>
          <rect x="24" y="36" width="100" height="56" rx="8" className={panel} strokeWidth="1.2" />
          <text x="74" y="58" textAnchor="middle" className={labelMd}>
            local
          </text>
          <rect x="48" y="66" width="52" height="18" rx="3" className="fill-amber-500/20 stroke-amber-600/45" strokeWidth="1" />
          <text x="74" y="79" textAnchor="middle" className="fill-[var(--text)] text-[7px] font-mono">
            .git
          </text>
          <rect x="196" y="36" width="100" height="56" rx="8" className="fill-amber-500/10 stroke-amber-600/35" strokeWidth="1.2" />
          <text x="246" y="58" textAnchor="middle" className={labelMd}>
            origin
          </text>
          <line x1="124" y1="52" x2="196" y2="44" stroke="#f43f5e" strokeWidth="1.8" markerEnd={`url(#ch-arrow-${uid})`} />
          <text x="158" y="40" textAnchor="middle" className="fill-[#f43f5e] text-[7px] font-semibold">
            push
          </text>
          <line x1="196" y1="84" x2="124" y2="76" stroke="#0ea5e9" strokeWidth="1.8" markerEnd={`url(#ch-arrow2-${uid})`} />
          <text x="158" y="98" textAnchor="middle" className="fill-sky-500 text-[7px] font-semibold">
            pull
          </text>
        </svg>
      );

    case "stash":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="70" y="14" textAnchor="middle" className={labelSm}>
            {beforeLabel}
          </text>
          <text x="250" y="14" textAnchor="middle" className={labelSm}>
            {afterLabel}
          </text>
          <rect x="12" y="26" width="116" height="82" rx="8" className={panel} strokeWidth="1.2" />
          <text x="70" y="46" textAnchor="middle" className={labelMd}>
            dirty tree
          </text>
          <rect x="28" y="54" width="28" height="18" rx="2" className="fill-rose-500/20 stroke-rose-500/40" strokeWidth="0.8" />
          <rect x="62" y="54" width="28" height="18" rx="2" className="fill-rose-500/20 stroke-rose-500/40" strokeWidth="0.8" />
          <rect x="96" y="54" width="28" height="18" rx="2" className="fill-rose-500/20 stroke-rose-500/40" strokeWidth="0.8" />
          <text x="160" y="68" textAnchor="middle" className="fill-[var(--accent)] text-[9px] font-semibold">
            git stash
          </text>
          <rect x="192" y="26" width="116" height="82" rx="8" className={panel} strokeWidth="1.2" />
          <text x="250" y="46" textAnchor="middle" className={labelMd}>
            clean tree
          </text>
          <rect x="216" y="56" width="68" height="36" rx="6" className="fill-violet-500/15 stroke-violet-500/45" strokeWidth="1" />
          <text x="250" y="80" textAnchor="middle" className="fill-[var(--text)] text-[8px] font-mono">
            stash@{"{0}"}
          </text>
        </svg>
      );

    case "log":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git log --oneline --graph
          </text>
          <rect x="16" y="24" width="288" height="88" rx="8" className="fill-neutral-950/80 stroke-neutral-700/60" strokeWidth="1" />
          {[
            { y: 44, hash: "a1b2c3d", msg: "feat: add login", branch: "HEAD→main", c: "#22c55e" },
            { y: 60, hash: "9f3e1a2", msg: "fix: form validation", branch: "", c: "var(--muted)" },
            { y: 76, hash: "5c8d0e7", msg: "chore: init project", branch: "", c: "var(--muted)" },
          ].map(({ y, hash, msg, branch, c }, i) => (
            <g key={i}>
              <circle cx="36" cy={y} r="4" fill={c} />
              {i < 2 && <line x1="36" y1={y + 4} x2="36" y2={y + 12} stroke="var(--muted)" strokeWidth="1" strokeOpacity="0.5" />}
              <text x="48" y={y + 4} className="fill-yellow-400/90 font-mono text-[7.5px]">{hash}</text>
              <text x="100" y={y + 4} className="fill-zinc-200 text-[7.5px]">{msg}</text>
              {branch ? <text x="220" y={y + 4} className="fill-sky-400 text-[7px] font-semibold">{branch}</text> : null}
            </g>
          ))}
        </svg>
      );

    case "diff":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git diff / git diff --staged
          </text>
          <rect x="16" y="24" width="288" height="88" rx="8" className="fill-neutral-950/80 stroke-neutral-700/60" strokeWidth="1" />
          <text x="30" y="43" className="fill-zinc-400 font-mono text-[7px]">--- a/app.ts</text>
          <text x="30" y="55" className="fill-zinc-400 font-mono text-[7px]">+++ b/app.ts</text>
          <rect x="24" y="60" width="272" height="14" rx="2" className="fill-rose-900/55" />
          <text x="30" y="71" className="fill-rose-400 font-mono text-[7.5px]">- const port = 3000;</text>
          <rect x="24" y="76" width="272" height="14" rx="2" className="fill-emerald-900/55" />
          <text x="30" y="87" className="fill-emerald-400 font-mono text-[7.5px]">+ const port = process.env.PORT ?? 3000;</text>
          <text x="30" y="104" className="fill-zinc-500 font-mono text-[7px]">@@ -12,1 +12,1 @@</text>
        </svg>
      );

    case "merge":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git merge feature → main
          </text>
          {/* main line */}
          <line x1="24" y1="80" x2="296" y2="80" stroke="var(--border)" strokeWidth="1.5" strokeOpacity="0.4" />
          {/* commits on main before branch */}
          <circle cx="40" cy="80" r="6" className="fill-[var(--muted)]" />
          <circle cx="80" cy="80" r="6" className="fill-[var(--muted)]" />
          {/* feature branch diverges */}
          <path d="M 80 80 Q 80 38 140 38" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
          <circle cx="140" cy="38" r="6" className="fill-[var(--accent)]" />
          <circle cx="200" cy="38" r="6" className="fill-[var(--accent)]" />
          <text x="170" y="28" textAnchor="middle" className="fill-[var(--accent)] text-[7.5px] font-semibold">feature</text>
          {/* merge commit */}
          <path d="M 200 38 Q 240 38 240 80" fill="none" stroke="var(--muted)" strokeWidth="1.5" />
          <circle cx="240" cy="80" r="8" className="fill-emerald-500/80 stroke-emerald-400/60" strokeWidth="1.5" />
          <text x="240" y="84" textAnchor="middle" className="fill-white text-[7px] font-bold">M</text>
          <circle cx="280" cy="80" r="6" className="fill-[var(--muted)]" />
          <text x="240" y="100" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">merge commit</text>
          <text x="280" y="68" textAnchor="middle" className="fill-sky-400 text-[7px] font-semibold">HEAD</text>
        </svg>
      );

    case "rebase":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="80" y="14" textAnchor="middle" className={labelSm}>
            before
          </text>
          <text x="240" y="14" textAnchor="middle" className={labelSm}>
            after rebase
          </text>
          {/* Before: diverged graph */}
          <line x1="16" y1="80" x2="152" y2="80" stroke="var(--border)" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="28" cy="80" r="5" className="fill-[var(--muted)]" />
          <circle cx="52" cy="80" r="5" className="fill-[var(--muted)]" />
          <text x="52" y="94" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">main</text>
          <path d="M 52 80 Q 52 44 80 44" fill="none" stroke="var(--muted)" strokeWidth="1.2" />
          <circle cx="80" cy="44" r="5" className="fill-[var(--accent)]" />
          <circle cx="108" cy="44" r="5" className="fill-[var(--accent)]" />
          <text x="94" y="34" textAnchor="middle" className="fill-[var(--accent)] text-[7px]">A  B</text>
          {/* Arrow */}
          <text x="163" y="66" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">→</text>
          {/* After: linear */}
          <line x1="172" y1="80" x2="308" y2="80" stroke="var(--border)" strokeWidth="1.2" strokeOpacity="0.4" />
          <circle cx="184" cy="80" r="5" className="fill-[var(--muted)]" />
          <circle cx="212" cy="80" r="5" className="fill-[var(--muted)]" />
          <circle cx="244" cy="80" r="5" className="fill-[var(--accent)]" />
          <circle cx="276" cy="80" r="5" className="fill-[var(--accent)]" />
          <text x="244" y="94" textAnchor="middle" className="fill-[var(--accent)] text-[7px]">A′</text>
          <text x="276" y="94" textAnchor="middle" className="fill-[var(--accent)] text-[7px]">B′</text>
          <text x="244" y="64" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">linear</text>
        </svg>
      );

    case "reset":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git reset --soft | --mixed | --hard
          </text>
          {/* commit chain */}
          <line x1="20" y1="60" x2="300" y2="60" stroke="var(--border)" strokeWidth="1.2" strokeOpacity="0.4" />
          {[
            { cx: 48, label: "C1" },
            { cx: 112, label: "C2" },
            { cx: 176, label: "C3" },
            { cx: 240, label: "C4 ← HEAD", accent: true },
          ].map(({ cx, label, accent }) => (
            <g key={cx}>
              <circle cx={cx} cy={60} r={8} className={accent ? "fill-[var(--accent)]" : "fill-[var(--muted)]"} />
              <text x={cx} y={80} textAnchor="middle" className={`${accent ? "fill-[var(--accent)]" : "fill-[var(--muted)]"} text-[7.5px]`}>
                {label}
              </text>
            </g>
          ))}
          {/* reset arrow */}
          <path d="M 176 44 L 176 36 L 108 36 L 108 44" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="3 2" />
          <text x="142" y="30" textAnchor="middle" className="fill-[var(--accent)] text-[7px] font-semibold">
            reset HEAD~2
          </text>
          {/* mode labels */}
          <text x="160" y="104" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            soft → index safe · mixed → unstage · hard → wipe tree
          </text>
        </svg>
      );

    case "worktree":
      return (
        <svg viewBox="0 0 320 120" className="h-auto w-full" aria-hidden>
          <text x="160" y="14" textAnchor="middle" className={labelSm}>
            git worktree add ../app-hotfix -b hotfix/fix
          </text>
          {/* shared .git database in the centre */}
          <rect x="120" y="44" width="80" height="36" rx="6" className="fill-amber-500/20 stroke-amber-600/50" strokeWidth="1.2" />
          <text x="160" y="59" textAnchor="middle" className="fill-[var(--text)] text-[8px] font-mono font-semibold">
            .git
          </text>
          <text x="160" y="73" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            shared objects
          </text>
          {/* left folder: main working directory */}
          <rect x="12" y="36" width="96" height="52" rx="8" className={panel} strokeWidth="1.2" />
          <text x="60" y="56" textAnchor="middle" className={labelMd}>
            my-app/
          </text>
          <text x="60" y="70" textAnchor="middle" className="fill-[var(--accent)] text-[7px]">
            feature/refactor
          </text>
          <text x="60" y="82" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            your branch
          </text>
          {/* connector left → .git */}
          <line x1="108" y1="62" x2="120" y2="62" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="3 2" />
          {/* right folder: worktree */}
          <rect x="212" y="36" width="96" height="52" rx="8" className="fill-emerald-500/10 stroke-emerald-500/40" strokeWidth="1.2" />
          <text x="260" y="56" textAnchor="middle" className={labelMd}>
            app-hotfix/
          </text>
          <text x="260" y="70" textAnchor="middle" className="fill-emerald-500/90 text-[7px]">
            hotfix/fix
          </text>
          <text x="260" y="82" textAnchor="middle" className="fill-[var(--muted)] text-[7px]">
            new worktree
          </text>
          {/* connector .git → right */}
          <line x1="200" y1="62" x2="212" y2="62" stroke="var(--border)" strokeWidth="1.2" strokeDasharray="3 2" />
        </svg>
      );

    default:
      return null;
  }
}

export function GitRoadmapVisualCheatsheet() {
  const { locale, t } = useLocale();
  const uid = useId().replace(/:/g, "");
  const beforeLabel = t("gitRoadmap.cheatsheetBefore");
  const afterLabel = t("gitRoadmap.cheatsheetAfter");

  return (
    <section
      className="mt-12 scroll-mt-8 rounded-2xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--surface)_88%,transparent)] p-5 shadow-sm sm:p-6"
      id="git-visual-cheatsheet"
      aria-labelledby="git-visual-cheatsheet-title"
    >
      <h2 id="git-visual-cheatsheet-title" className="text-lg font-semibold tracking-tight text-[var(--text)]">
        {t("gitRoadmap.cheatsheetHeading")}
      </h2>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[var(--muted)]">
        <RichText text={t("gitRoadmap.cheatsheetIntro")} />
      </p>
      <p className="mt-1 text-xs text-[var(--faint)]">{t("gitRoadmap.cheatsheetLegend")}</p>

      <ul className="mt-8 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2">
        {GIT_ROADMAP_CHEATSHEET_ITEMS.map((item) => (
          <li
            key={item.cmd}
            className="flex flex-col overflow-hidden rounded-xl border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_38%,transparent)]"
          >
            <div className="border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_25%,transparent)] px-4 py-3">
              <code className="font-mono text-[13px] font-semibold text-[var(--accent)]">{item.cmd}</code>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                <RichText text={pickLocalized(item.description, locale)} />
              </p>
            </div>
            <div className="relative bg-[color-mix(in_oklab,var(--background)_40%,transparent)] px-2 py-3">
              <div className="mt-1">
                <MiniVisual
                  id={item.visual}
                  uid={uid}
                  beforeLabel={item.hideBeforeAfterLabels ? "" : beforeLabel}
                  afterLabel={item.hideBeforeAfterLabels ? "" : afterLabel}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
