"use client";

import { useId } from "react";
import type { Locale } from "@/lib/i18n/types";
import type { LocalizedString } from "@/lib/i18n/types";
import type { RoadmapDetailDiagramId } from "@/lib/challenge-data";
import { pickLocalized } from "@/lib/i18n/pick";
import { RichText } from "@/components/learn/RichText";

const figClass =
  "mt-3 overflow-hidden rounded-lg border border-[var(--border)] bg-[color-mix(in_oklab,var(--elevated)_45%,transparent)] text-[var(--text)]";

const GIT_IDS = new Set<RoadmapDetailDiagramId>([
  "git-workdir-staging-repo",
  "git-local-remote-workflow",
  "git-first-commit-flow",
  "git-branch-merge",
  "git-fetch-pull-push",
  "git-rebase-linearize",
  "git-stash-pop",
  "git-worktree",
  "git-pr-review-merge",
]);

export function isGitRoadmapDiagram(id: RoadmapDetailDiagramId): boolean {
  return GIT_IDS.has(id);
}

const CAPTIONS: Partial<Record<RoadmapDetailDiagramId, LocalizedString>> = {
  "git-workdir-staging-repo": {
    en: "Working directory → staging (index) → repository (.git). Each arrow is a Git command you run.",
    np: "कार्य → स्टेजिङ (index) → रेपो (.git)।",
    jp: "作業ツリー → ステージ（index）→ リポジトリ（.git）。矢印は主なコマンド。",
  },
  "git-local-remote-workflow": {
    en: "Classic classroom map: local three-step flow plus `origin`, then `git push` / `git pull` and `git checkout` (or `git switch`) moving snapshots between disk and history.",
    np: "कक्षा को मानचित्र: स्थानीय तीन चरण + `origin`, अनि `git push`/`git pull` र `git checkout` ले डिस्क र इतिहास जोड्छ।",
    jp: "定番の全体図: ローカルの3段階に加え `origin` があり、`git push` / `git pull` と `git checkout`（または `git switch`）で作業ツリーと履歴を行き来します。",
  },
  "git-first-commit-flow": {
    en: "Timeline: edits live in the working tree until `git add` copies blobs into the index, then `git commit` freezes a tree object.",
    np: "`git add` पछि `git commit` ले स्न्यापसट बन्द गर्छ।",
    jp: "`git add` で index に載せ、`git commit` でツリーが確定します。",
  },
  "git-branch-merge": {
    en: "Feature branch diverges from main; merge joins histories (merge commit) or fast-forwards the pointer.",
    np: "सुविधा ब्रान्च मुख्यबाट अलग हुन्छ; मर्जले जोड्छ।",
    jp: "feature が分岐し、マージで統合（マージコミットまたは早送り）。",
  },
  "git-fetch-pull-push": {
    en: "Fetch downloads remote objects; pull integrates; push uploads your reachable commits.",
    np: "Fetch ले डाउनलोड गर्छ; pull ले मिलाउँछ; push ले पठाउँछ।",
    jp: "fetch で取得、pull で取り込み、push で送信。",
  },
  "git-rebase-linearize": {
    en: "Rebase replays commits A′, B′ on top of main so the graph reads like a straight line.",
    np: "Rebase ले commit पुन: main माथि चलाउँछ।",
    jp: "rebase で A′・B′ のように積み直し、履歴を一直線に見せる。",
  },
  "git-stash-pop": {
    en: "Stash snapshots dirty work; pop reapplies it. Reflog still remembers dropped commits for recovery.",
    np: "Stash ले काम रोक्छ; pop ले फेरि लगाउँछ।",
    jp: "stash で退避、pop で復元。reflog で復旧の糸口に。",
  },
  "git-worktree": {
    en: "One `.git` directory, multiple checked-out directories. Each worktree pins its own HEAD/branch while sharing object storage.",
    np: "एउटा `.git`, धेरै checkout फोल्डर। प्रत्येक worktree ले आफ्नो HEAD/ब्रान्च राख्छ, वस्तु भण्डार साझा।",
    jp: "1つの `.git` に複数の作業ディレクトリ。各 worktree は独自の HEAD／ブランチを持ち、オブジェクトは共有します。",
  },
  "git-pr-review-merge": {
    en: "Branch → PR → review + CI → merge into main. Protected branches enforce the happy path.",
    np: "ब्रान्च → PR → समीक्षा + CI → main मा मर्ज।",
    jp: "ブランチ → PR → レビューと CI → main へマージ。",
  },
};

export function GitDiagram({ id, locale }: { id: RoadmapDetailDiagramId; locale: Locale }) {
  const cap = CAPTIONS[id];
  const caption = cap ? pickLocalized(cap, locale) : "";
  const uid = useId().replace(/:/g, "");

  switch (id) {
    case "git-workdir-staging-repo":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 400 120" className="h-auto w-full" aria-hidden>
            <defs>
              <marker id="gws-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
                <path d="M0,0 L8,4 L0,8 Z" className="fill-[var(--accent)]" />
              </marker>
            </defs>
            <rect x="16" y="28" width="100" height="64" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="66" y="52" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              Working tree
            </text>
            <text x="66" y="72" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              git add
            </text>
            <line x1="118" y1="60" x2="152" y2="60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#gws-arrow)" />
            <rect x="156" y="28" width="100" height="64" rx="8" className="fill-[color-mix(in_oklab,var(--accent)_12%,transparent)] stroke-[var(--accent)]" strokeWidth="1.5" strokeOpacity="0.5" />
            <text x="206" y="52" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              Staging
            </text>
            <text x="206" y="72" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              index
            </text>
            <line x1="258" y1="60" x2="292" y2="60" stroke="var(--accent)" strokeWidth="2" markerEnd="url(#gws-arrow)" />
            <rect x="296" y="28" width="88" height="64" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="340" y="52" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              .git
            </text>
            <text x="340" y="72" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              commit
            </text>
          </svg>
        </figure>
      );

    case "git-local-remote-workflow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 520 218" className="h-auto w-full" aria-hidden>
            <defs>
              <marker
                id={`glrw-arrow-${uid}`}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <path d="M0,0 L7,3.5 L0,7 Z" fill="#f43f5e" />
              </marker>
            </defs>
            {/* zone labels */}
            <text x="120" y="16" textAnchor="middle" className="fill-[var(--muted)] text-[10px] font-semibold tracking-wide">
              Local
            </text>
            <text x="420" y="16" textAnchor="middle" className="fill-[var(--muted)] text-[10px] font-semibold tracking-wide">
              Remote
            </text>
            <rect
              x="10"
              y="22"
              width="318"
              height="186"
              rx="10"
              className="fill-[color-mix(in_oklab,var(--accent)_6%,transparent)] stroke-[var(--border)]"
              strokeWidth="1"
              strokeOpacity="0.45"
            />
            <rect
              x="332"
              y="22"
              width="178"
              height="186"
              rx="10"
              className="fill-[color-mix(in_oklab,#f97316_10%,var(--elevated))] stroke-[var(--border)]"
              strokeWidth="1"
              strokeOpacity="0.5"
            />
            {/* boxes */}
            <rect x="28" y="38" width="86" height="46" rx="6" className="fill-sky-500/20 stroke-sky-500/55" strokeWidth="1.5" />
            <text x="71" y="60" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold leading-tight">
              working
            </text>
            <text x="71" y="72" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold leading-tight">
              directory
            </text>
            <rect x="126" y="38" width="86" height="46" rx="6" className="fill-teal-500/18 stroke-teal-500/55" strokeWidth="1.5" />
            <text x="169" y="64" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              staging area
            </text>
            <rect x="224" y="38" width="86" height="46" rx="6" className="fill-emerald-500/18 stroke-emerald-500/55" strokeWidth="1.5" />
            <text x="267" y="64" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              local repo
            </text>
            <rect x="378" y="38" width="96" height="46" rx="6" className="fill-amber-500/22 stroke-amber-600/55" strokeWidth="1.5" />
            <text x="426" y="64" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              remote repo
            </text>
            {/* lifelines */}
            {[71, 169, 267, 426].map((cx) => (
              <line
                key={cx}
                x1={cx}
                y1="86"
                x2={cx}
                y2="188"
                className="stroke-[var(--border)]"
                strokeWidth="1"
                strokeDasharray="4 3"
                strokeOpacity="0.85"
              />
            ))}
            {/* git add */}
            <line x1="114" y1="60" x2="126" y2="60" stroke="#f43f5e" strokeWidth="2" markerEnd={`url(#glrw-arrow-${uid})`} />
            <text x="120" y="54" textAnchor="middle" className="fill-[#f43f5e] text-[8px] font-semibold">
              git add
            </text>
            {/* git commit */}
            <line x1="212" y1="60" x2="224" y2="60" stroke="#f43f5e" strokeWidth="2" markerEnd={`url(#glrw-arrow-${uid})`} />
            <text x="218" y="54" textAnchor="middle" className="fill-[#f43f5e] text-[8px] font-semibold">
              git commit
            </text>
            {/* git push — local to remote (upper) */}
            <path
              d="M 310 44 Q 340 28 378 44"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              markerEnd={`url(#glrw-arrow-${uid})`}
            />
            <text x="344" y="30" textAnchor="middle" className="fill-[#f43f5e] text-[8px] font-semibold">
              git push
            </text>
            {/* git pull — remote to local */}
            <path
              d="M 378 78 Q 330 92 310 78"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              markerEnd={`url(#glrw-arrow-${uid})`}
            />
            <text x="344" y="96" textAnchor="middle" className="fill-[#f43f5e] text-[8px] font-semibold">
              git pull
            </text>
            {/* git checkout — long return from local to working directory */}
            <path
              d="M 267 86 L 267 168 L 71 168 L 71 86"
              fill="none"
              stroke="#f43f5e"
              strokeWidth="2"
              strokeLinejoin="round"
              markerEnd={`url(#glrw-arrow-${uid})`}
            />
            <text x="120" y="182" textAnchor="start" className="fill-[#f43f5e] text-[8px] font-semibold">
              git checkout / switch
            </text>
          </svg>
        </figure>
      );

    case "git-first-commit-flow":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 420 100" className="h-auto w-full" aria-hidden>
            <circle cx="60" cy="50" r="10" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="60" y="54" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              edit
            </text>
            <line x1="72" y1="50" x2="118" y2="50" stroke="var(--accent)" strokeWidth="2" />
            <polygon points="118,50 110,45 110,55" className="fill-[var(--accent)]" />
            <circle cx="150" cy="50" r="10" className="fill-[color-mix(in_oklab,var(--accent)_18%,transparent)] stroke-[var(--accent)]" strokeWidth="1.5" />
            <text x="150" y="54" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              add
            </text>
            <line x1="162" y1="50" x2="208" y2="50" stroke="var(--accent)" strokeWidth="2" />
            <polygon points="208,50 200,45 200,55" className="fill-[var(--accent)]" />
            <rect x="220" y="36" width="88" height="28" rx="6" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="264" y="54" textAnchor="middle" className="fill-[var(--text)] text-[10px] font-semibold">
              commit
            </text>
            <line x1="310" y1="50" x2="350" y2="50" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 3" />
            <polygon points="350,50 342,45 342,55" className="fill-[var(--muted)]" />
            <text x="380" y="54" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              HEAD
            </text>
          </svg>
        </figure>
      );

    case "git-branch-merge":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 400 140" className="h-auto w-full" aria-hidden>
            <circle cx="60" cy="100" r="8" className="fill-[var(--accent)]" />
            <text x="60" y="124" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              main
            </text>
            <path d="M 60 92 Q 60 40 140 40" fill="none" stroke="var(--accent)" strokeWidth="2" />
            <circle cx="140" cy="40" r="8" className="fill-[color-mix(in_oklab,var(--accent)_35%,var(--elevated))]" />
            <text x="140" y="28" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              feature
            </text>
            <path d="M 140 48 Q 140 88 68 92" fill="none" stroke="var(--muted)" strokeWidth="2" strokeDasharray="4 3" />
            <text x="100" y="78" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              merge
            </text>
            <circle cx="220" cy="100" r="8" className="fill-[var(--accent)]" />
            <text x="220" y="124" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              tip
            </text>
          </svg>
        </figure>
      );

    case "git-fetch-pull-push":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 420 130" className="h-auto w-full" aria-hidden>
            <rect x="20" y="24" width="120" height="44" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="80" y="50" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              local
            </text>
            <rect x="280" y="24" width="120" height="44" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_65%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="340" y="50" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              origin
            </text>
            <line x1="140" y1="38" x2="270" y2="38" stroke="var(--accent)" strokeWidth="2" />
            <text x="205" y="34" textAnchor="middle" className="fill-[var(--accent)] text-[8px]">
              push
            </text>
            <line x1="270" y1="58" x2="140" y2="58" stroke="var(--muted)" strokeWidth="2" strokeDasharray="5 4" />
            <text x="205" y="72" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              fetch
            </text>
            <text x="210" y="108" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              pull ≈ fetch + integrate
            </text>
          </svg>
        </figure>
      );

    case "git-rebase-linearize":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 400 110" className="h-auto w-full" aria-hidden>
            <text x="12" y="20" className="fill-[var(--muted)] text-[9px]">
              before
            </text>
            <circle cx="50" cy="48" r="7" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1" />
            <circle cx="90" cy="32" r="7" className="fill-[var(--accent)]" />
            <circle cx="130" cy="48" r="7" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1" />
            <line x1="57" y1="48" x2="83" y2="36" stroke="var(--muted)" strokeWidth="1.5" />
            <line x1="97" y1="36" x2="123" y2="48" stroke="var(--muted)" strokeWidth="1.5" />
            <text x="200" y="56" textAnchor="middle" className="fill-[var(--muted)] text-[10px]">
              rebase
            </text>
            <text x="220" y="20" className="fill-[var(--muted)] text-[9px]">
              after
            </text>
            <circle cx="280" cy="48" r="7" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1" />
            <circle cx="310" cy="48" r="7" className="fill-[var(--accent)]" />
            <circle cx="340" cy="48" r="7" className="fill-[var(--accent)]" />
            <line x1="287" y1="48" x2="303" y2="48" stroke="var(--accent)" strokeWidth="1.5" />
            <line x1="317" y1="48" x2="333" y2="48" stroke="var(--accent)" strokeWidth="1.5" />
          </svg>
        </figure>
      );

    case "git-stash-pop":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 380 100" className="h-auto w-full" aria-hidden>
            <rect x="24" y="30" width="100" height="40" rx="6" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="74" y="54" textAnchor="middle" className="fill-[var(--text)] text-[10px]">
              WIP changes
            </text>
            <line x1="126" y1="50" x2="168" y2="50" stroke="var(--accent)" strokeWidth="2" />
            <text x="147" y="44" textAnchor="middle" className="fill-[var(--accent)] text-[8px]">
              stash
            </text>
            <rect x="172" y="26" width="88" height="48" rx="6" className="fill-[color-mix(in_oklab,var(--accent)_10%,transparent)] stroke-[var(--accent)]" strokeWidth="1.2" strokeOpacity="0.6" />
            <text x="216" y="54" textAnchor="middle" className="fill-[var(--text)] text-[10px] font-semibold">
              stack
            </text>
            <line x1="262" y1="50" x2="304" y2="50" stroke="var(--accent)" strokeWidth="2" />
            <text x="283" y="44" textAnchor="middle" className="fill-[var(--accent)] text-[8px]">
              pop
            </text>
            <rect x="308" y="30" width="56" height="40" rx="6" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="336" y="54" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              apply
            </text>
          </svg>
        </figure>
      );

    case "git-worktree":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 420 152" className="h-auto w-full" aria-hidden>
            <rect
              x="156"
              y="44"
              width="108"
              height="64"
              rx="10"
              className="fill-[color-mix(in_oklab,var(--accent)_14%,transparent)] stroke-[var(--accent)]"
              strokeWidth="1.5"
              strokeOpacity="0.55"
            />
            <text x="210" y="72" textAnchor="middle" className="fill-[var(--text)] text-[11px] font-semibold">
              .git
            </text>
            <text x="210" y="92" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              shared objects
            </text>
            <rect x="16" y="24" width="120" height="48" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="76" y="46" textAnchor="middle" className="fill-[var(--text)] text-[10px] font-semibold">
              ../app-main
            </text>
            <text x="76" y="62" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              branch: main
            </text>
            <line x1="136" y1="48" x2="156" y2="68" stroke="var(--accent)" strokeWidth="1.8" />
            <rect x="284" y="24" width="120" height="48" rx="8" className="fill-[color-mix(in_oklab,var(--elevated)_70%,transparent)] stroke-[var(--border)]" strokeWidth="1.5" />
            <text x="344" y="46" textAnchor="middle" className="fill-[var(--text)] text-[10px] font-semibold">
              ../app-hotfix
            </text>
            <text x="344" y="62" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              branch: hotfix
            </text>
            <line x1="284" y1="48" x2="264" y2="68" stroke="var(--accent)" strokeWidth="1.8" />
            <text x="210" y="132" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              git worktree add ../app-hotfix -b hotfix
            </text>
          </svg>
        </figure>
      );

    case "git-pr-review-merge":
      return (
        <figure className={figClass}>
          <figcaption className="border-b border-[var(--border)] px-3 py-2 text-xs font-medium text-[var(--muted)]">
            <RichText text={caption} />
          </figcaption>
          <svg viewBox="0 0 420 118" className="h-auto w-full" aria-hidden>
            <rect x="16" y="36" width="72" height="36" rx="6" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1" />
            <text x="52" y="58" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              branch
            </text>
            <line x1="90" y1="54" x2="128" y2="54" stroke="var(--accent)" strokeWidth="2" />
            <text x="109" y="48" textAnchor="middle" className="fill-[var(--accent)] text-[8px]">
              PR
            </text>
            <rect x="132" y="28" width="96" height="52" rx="6" className="fill-[color-mix(in_oklab,var(--accent)_8%,transparent)] stroke-[var(--accent)]" strokeWidth="1" strokeOpacity="0.5" />
            <text x="180" y="50" textAnchor="middle" className="fill-[var(--text)] text-[9px] font-semibold">
              review + CI
            </text>
            <text x="180" y="66" textAnchor="middle" className="fill-[var(--muted)] text-[8px]">
              approve
            </text>
            <line x1="230" y1="54" x2="278" y2="54" stroke="var(--accent)" strokeWidth="2" />
            <rect x="282" y="36" width="56" height="36" rx="6" className="fill-[var(--elevated)] stroke-[var(--border)]" strokeWidth="1" />
            <text x="310" y="58" textAnchor="middle" className="fill-[var(--text)] text-[9px]">
              merge
            </text>
            <line x1="340" y1="54" x2="388" y2="54" stroke="var(--muted)" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="404" y="58" textAnchor="middle" className="fill-[var(--muted)] text-[9px]">
              main
            </text>
          </svg>
        </figure>
      );

    default:
      return null;
  }
}
