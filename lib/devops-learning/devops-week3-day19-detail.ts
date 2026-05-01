import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "As organizations scale, one of the most consequential architectural decisions they face is how to organize code across repositories. A monorepo puts everything in one place — one clone, one CI pipeline, atomic cross-service changes. A polyrepo gives each service its own repository — independent deployments, clear ownership, but coordination overhead. Neither is universally better; the right choice depends on team size, release coupling, and tooling maturity.",
    np: "Organization scale हुँदा, repository भर code कसरी organize गर्ने भन्ने सबभन्दा consequential architectural decision हो। Monorepo ले सबथोक एक ठाउँमा राख्छ — एक clone, एक CI pipeline, atomic cross-service change। Polyrepo ले हरेक service को आफ्नै repository दिन्छ — independent deployment, clear ownership, तर coordination overhead। कुनै पनि universally better होइन; सही choice team size, release coupling, र tooling maturity मा depend गर्छ।",
    jp: "組織が拡大するにつれて、最も重要なアーキテクチャ上の決定の一つは、リポジトリ全体にコードをどのように整理するかです。モノリポはすべてを一か所に置きます — 1 回のクローン・1 つの CI パイプライン・アトミックなクロスサービス変更。ポリリポは各サービスに独自のリポジトリを与えます — 独立したデプロイ・明確な所有権、しかし調整のオーバーヘッド。どちらが普遍的に優れているわけではなく、正しい選択はチームのサイズ・リリースの結合・ツールの成熟度に依存します。",
  } as const,
  o2: {
    en: "Today you understand the practical trade-offs of each approach, learn how Google/Meta/Microsoft run monorepos at scale, explore modern monorepo tooling (Nx, Turborepo), and configure CODEOWNERS for automated ownership enforcement.",
    np: "आज तपाईंले प्रत्येक approach को practical trade-off बुझ्नुहुनेछ, Google/Meta/Microsoft ले monorepo scale मा कसरी run गर्छन् सिक्नुहुनेछ, modern monorepo tooling (Nx, Turborepo) explore गर्नुहुनेछ, र automated ownership enforcement को लागि CODEOWNERS configure गर्नुहुनेछ।",
    jp: "本日は各アプローチの実用的なトレードオフを理解し、Google/Meta/Microsoft が大規模でモノリポをどのように運用するかを学び、最新のモノリポツール（Nx・Turborepo）を探索し、自動所有権適用のための CODEOWNERS を設定します。",
  } as const,
};

export const DEVOPS_DAY_19_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Monorepo vs polyrepo — the trade-offs",
        np: "Monorepo vs polyrepo — trade-off",
        jp: "モノリポ対ポリリポ — トレードオフ",
      },
      blocks: [
        { type: "diagram", id: "devops-monorepo-structure" },
        {
          type: "table",
          caption: {
            en: "Monorepo vs polyrepo: when each wins",
            np: "Monorepo vs polyrepo: कहिले कुन जित्छ",
            jp: "モノリポ対ポリリポ：それぞれが優れる場面",
          },
          headers: [
            { en: "Dimension", np: "Dimension", jp: "次元" },
            { en: "Monorepo", np: "Monorepo", jp: "モノリポ" },
            { en: "Polyrepo", np: "Polyrepo", jp: "ポリリポ" },
          ],
          rows: [
            [
              { en: "Cross-service changes", np: "Cross-service change", jp: "クロスサービスの変更" },
              { en: "Atomic — one PR touches multiple services", np: "Atomic — एक PR ले multiple service touch गर्छ", jp: "アトミック — 1 つの PR が複数のサービスに触れる" },
              { en: "Requires coordinated PRs across repos", np: "Repo भर coordinated PR चाहिन्छ", jp: "リポジトリをまたがる調整済み PR が必要" },
            ],
            [
              { en: "Code sharing / reuse", np: "Code sharing / reuse", jp: "コード共有/再利用" },
              { en: "Trivial — import directly by path", np: "Trivial — path ले directly import", jp: "簡単 — パスで直接インポート" },
              { en: "Requires published packages with versioning overhead", np: "Versioning overhead सहित published package चाहिन्छ", jp: "バージョン管理オーバーヘッドのある公開パッケージが必要" },
            ],
            [
              { en: "CI build times", np: "CI build time", jp: "CI ビルド時間" },
              { en: "Slow without affected-build tooling; fast with it", np: "Affected-build tooling बिना slow; सहित fast", jp: "影響を受けたビルドツールなしでは遅い；あれば速い" },
              { en: "Fast — each repo builds independently", np: "Fast — हरेक repo independently build", jp: "速い — 各リポジトリが独立してビルドする" },
            ],
            [
              { en: "Access control", np: "Access control", jp: "アクセス制御" },
              { en: "Coarser — CODEOWNERS per directory", np: "Coarser — directory प्रति CODEOWNERS", jp: "粗い — ディレクトリごとの CODEOWNERS" },
              { en: "Fine-grained — repo-level permissions per service", np: "Fine-grained — service प्रति repo-level permission", jp: "細かい — サービスごとのリポジトリレベルの権限" },
            ],
            [
              { en: "Tooling complexity", np: "Tooling complexity", jp: "ツールの複雑さ" },
              { en: "Needs build orchestration (Nx, Turborepo, Bazel)", np: "Build orchestration चाहिन्छ (Nx, Turborepo, Bazel)", jp: "ビルドオーケストレーションが必要（Nx・Turborepo・Bazel）" },
              { en: "Simple — each repo is self-contained", np: "Simple — हरेक repo self-contained", jp: "シンプル — 各リポジトリが自己完結している" },
            ],
            [
              { en: "Dependency management", np: "Dependency management", jp: "依存関係の管理" },
              { en: "Unified — one lockfile, consistent versions", np: "Unified — एक lockfile, consistent version", jp: "統一 — 1 つのロックファイル、一貫したバージョン" },
              { en: "Independent — each repo can use different versions", np: "Independent — हरेक repo ले different version प्रयोग गर्न सक्छ", jp: "独立 — 各リポジトリが異なるバージョンを使える" },
            ],
            [
              { en: "Developer experience", np: "Developer experience", jp: "開発者体験" },
              { en: "One clone, one IDE setup, unified history", np: "एक clone, एक IDE setup, unified history", jp: "1 回のクローン・1 つの IDE セットアップ・統一された履歴" },
              { en: "Multiple clones, context switching between repos", np: "Multiple clone, repo बीच context switching", jp: "複数のクローン、リポジトリ間のコンテキスト切り替え" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Google's entire codebase (~86TB)** lives in a single monorepo (Piper, a proprietary VCS). Facebook uses a monorepo for all of their code. Microsoft uses a monorepo (the Windows repo with Office). They invest heavily in custom tooling to make it scale. Without that investment, a naive monorepo scales poorly.",
              np: "**Google को सम्पूर्ण codebase (~86TB)** एउटा monorepo (Piper, proprietary VCS) मा छ। Facebook ले सबै code मा monorepo प्रयोग गर्छ। Microsoft ले monorepo (Office सहितको Windows repo) प्रयोग गर्छ। तिनीहरूले scale गर्न custom tooling मा heavily invest गर्छन्।",
              jp: "**Google のコードベース全体（〜86TB）** は 1 つのモノリポ（Piper、独自の VCS）に存在します。Facebook はすべてのコードにモノリポを使用しています。Microsoft はモノリポ（Office 入りの Windows リポジトリ）を使用しています。それらをスケールさせるために、カスタムツールに多大な投資をしています。その投資なしでは、素朴なモノリポはスケールしません。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Monorepo tooling — Nx and Turborepo",
        np: "Monorepo tooling — Nx र Turborepo",
        jp: "モノリポツール — Nx と Turborepo",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The core problem monorepo tools solve is **affected builds**: in a repo with 50 packages, you should not rebuild all 50 when you only changed one. Nx and Turborepo maintain a dependency graph of your packages and compute which ones are affected by a given change, then rebuild/retest only those — using a distributed cache to skip work that hasn't changed.",
            np: "Monorepo tool ले solve गर्ने core problem **affected build** हो: 50 package भएको repo मा, एउटा मात्र बदलिँदा 50 सबै rebuild गर्नु हुँदैन। Nx र Turborepo ले package को dependency graph maintain गर्छन् र दिइएको change ले कुन affected छन् compute गर्छन्, त्यसपछि केवल ती rebuild/retest गर्छन् — unchanged work skip गर्न distributed cache प्रयोग गरेर।",
            jp: "モノリポツールが解決するコアの問題は**影響を受けたビルド**です：50 パッケージを持つリポジトリで、1 つだけ変更した場合、50 すべてを再ビルドすべきではありません。Nx と Turborepo はパッケージの依存グラフを維持し、特定の変更によって影響を受けるものを計算し、それらだけを再ビルド/再テストします — 変更されていない作業をスキップするために分散キャッシュを使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Turborepo — fast builds for JS/TS monorepos",
            np: "Turborepo — JS/TS monorepo का लागि fast build",
            jp: "Turborepo — JS/TS モノリポの高速ビルド",
          },
          code: `# Create a Turborepo monorepo
npx create-turbo@latest my-monorepo
cd my-monorepo

# Structure:
# my-monorepo/
# ├── apps/
# │   ├── web/          (Next.js app)
# │   └── api/          (Express API)
# ├── packages/
# │   ├── ui/           (shared React components)
# │   ├── config/       (shared ESLint, TSConfig)
# │   └── utils/        (shared utilities)
# ├── turbo.json        (pipeline config)
# └── package.json      (workspace root)

# turbo.json — define the build pipeline
cat turbo.json
# {
#   "pipeline": {
#     "build": {
#       "dependsOn": ["^build"],  // build deps first (^= dependencies)
#       "outputs": ["dist/**"]    // cache these outputs
#     },
#     "test": {
#       "dependsOn": ["build"],
#       "outputs": []
#     },
#     "lint": { "outputs": [] }
#   }
# }

# Run builds — Turborepo parallelizes and caches automatically
npx turbo build                   # build everything (in dependency order)
npx turbo build --filter=web      # build only 'web' and its dependencies
npx turbo test --filter=...api    # test packages that depend on 'api'

# See what would run (dry run)
npx turbo build --dry-run

# Remote caching (team shares cache — skip CI work done locally)
npx turbo login                   # authenticate with Vercel
npx turbo link                    # link to remote cache`,
        },
        {
          type: "code",
          title: {
            en: "Nx — feature-rich monorepo for any language",
            np: "Nx — कुनै पनि language का लागि feature-rich monorepo",
            jp: "Nx — あらゆる言語に対応した機能豊富なモノリポ",
          },
          code: `# Create an Nx workspace
npx create-nx-workspace@latest my-workspace
cd my-workspace

# Visualize the dependency graph in browser
npx nx graph

# Run only affected projects (since last commit or vs main)
npx nx affected --target=build           # build affected projects
npx nx affected --target=test            # test affected projects
npx nx affected --target=lint            # lint affected projects
npx nx affected --base=main --head=HEAD  # affected between main and HEAD

# Run tasks in parallel
npx nx run-many --target=build --parallel=5

# Add a new app or library
npx nx generate @nx/next:app web-dashboard
npx nx generate @nx/js:library shared-utils --directory=libs/shared

# Check project dependencies
npx nx show project web-dashboard
npx nx show project web-dashboard --web   # open in browser

# CI integration — only run what changed
# GitHub Actions:
# - run: npx nx affected --target=test --base=origin/main
# - run: npx nx affected --target=build --base=origin/main`,
        },
      ],
    },
    {
      title: {
        en: "CODEOWNERS — automated code review assignment",
        np: "CODEOWNERS — automated code review assignment",
        jp: "CODEOWNERS — 自動コードレビュー割り当て",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "CODEOWNERS file patterns and enforcement",
            np: "CODEOWNERS file pattern र enforcement",
            jp: "CODEOWNERS ファイルのパターンと適用",
          },
          code: `# .github/CODEOWNERS (GitHub) or CODEOWNERS (GitLab/Bitbucket)
# When a PR touches a file matching a pattern, the listed owners
# are automatically added as required reviewers.

# Global owner (fallback for anything not matched below)
*                          @platform-team

# Infrastructure — any change to Terraform needs infra review
/infra/                    @infra-team
*.tf                       @infra-team
*.tfvars                   @infra-team

# CI/CD pipelines
/.github/workflows/        @devops-team
/Jenkinsfile               @devops-team

# Frontend — UI team owns all frontend code
/apps/web/                 @frontend-team
/packages/ui/              @frontend-team

# Backend services
/apps/api/                 @backend-team
/apps/auth-service/        @security-team @backend-team

# Shared utilities — multiple owners required
/packages/utils/           @backend-team @frontend-team

# Specific files that need extra scrutiny
/apps/api/src/auth/        @security-team
/.github/CODEOWNERS        @platform-team   # protect the CODEOWNERS file itself

# Pattern rules (same as .gitignore):
# /dir/     → only the root-level dir
# dir/      → any dir named 'dir' at any depth
# *.ext     → any file with that extension
# !pattern  → negate/exclude

# Enforce CODEOWNERS on GitHub:
# → Repository Settings → Branches → main → Require review from CODEOWNERS
# → This makes it impossible to merge without the designated team's approval`,
        },
      ],
    },
    {
      title: {
        en: "Scaling Git — sparse checkout and partial clone",
        np: "Git scale गर्नुहोस् — sparse checkout र partial clone",
        jp: "Git のスケーリング — スパースチェックアウトと部分クローン",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Working with large repos efficiently",
            np: "Large repo सँग efficiently काम गर्नुहोस्",
            jp: "大規模リポジトリを効率的に操作する",
          },
          code: `# Partial clone — download only what you need (objects fetched on demand)
git clone --filter=blob:none --sparse git@github.com:org/monorepo.git
cd monorepo

# Sparse checkout — work only with specific directories
git sparse-checkout set apps/api packages/utils packages/config
git sparse-checkout list               # see what is checked out
git sparse-checkout add infra/         # add more directories
git sparse-checkout set --cone apps/   # cone mode (faster, simpler patterns)

# Shallow clone — only recent history (great for CI)
git clone --depth 1 git@github.com:org/repo.git   # only latest commit
git fetch --deepen=10                              # add 10 more commits of history
git fetch --unshallow                              # get full history if needed

# Combine for maximum CI speed
git clone --filter=blob:none --depth 1 --sparse git@github.com:org/monorepo.git
git sparse-checkout set apps/api packages/utils

# Git LFS (Large File Storage) — for binary files in monorepos
git lfs install
git lfs track "*.psd" "*.png" "*.zip"  # store these in LFS, not in git
cat .gitattributes                      # LFS adds entries here
git add .gitattributes *.png
git commit -m "chore: track binary assets with LFS"
git push  # LFS files upload to the LFS server separately`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Structure a monorepo with shared packages",
        np: "Hands-on: Shared package सहित monorepo structure गर्नुहोस्",
        jp: "ハンズオン: 共有パッケージを持つモノリポを構築する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Bootstrap a minimal monorepo structure",
            np: "Minimal monorepo structure bootstrap गर्नुहोस्",
            jp: "最小限のモノリポ構造をブートストラップする",
          },
          code: `# Create the structure manually (language-agnostic)
mkdir -p monorepo/{apps/{api,web},packages/{utils,config},infra}
cd monorepo
git init

# Root package.json (npm workspaces)
cat > package.json << 'EOF'
{
  "name": "monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*"],
  "scripts": {
    "build": "turbo build",
    "test": "turbo test",
    "lint": "turbo lint"
  }
}
EOF

# Shared utils package
cat > packages/utils/package.json << 'EOF'
{
  "name": "@myorg/utils",
  "version": "1.0.0",
  "main": "index.js"
}
EOF
echo 'module.exports = { formatDate: (d) => d.toISOString() };' \
  > packages/utils/index.js

# API app that uses shared utils
cat > apps/api/package.json << 'EOF'
{
  "name": "@myorg/api",
  "version": "1.0.0",
  "dependencies": {
    "@myorg/utils": "*"
  }
}
EOF
echo 'const { formatDate } = require("@myorg/utils"); console.log(formatDate(new Date()));' \
  > apps/api/index.js

# CODEOWNERS
mkdir -p .github
cat > .github/CODEOWNERS << 'EOF'
*                @everyone
/apps/api/       @backend-team
/apps/web/       @frontend-team
/packages/       @platform-team
/infra/          @infra-team
EOF

# .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
.turbo/
*.log
EOF

npm install   # hoists shared deps to root node_modules

git add .
git commit -m "chore: bootstrap monorepo structure with shared utils"`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I decide between monorepo and polyrepo?",
        np: "Monorepo र polyrepo बीच कसरी decide गर्ने?",
        jp: "モノリポとポリリポをどのように決定するか？",
      },
      answer: {
        en: "Use a **monorepo** if: your services share significant code (shared libraries, design systems, types), you need atomic cross-service changes, or you want unified tooling and dependency management. Use a **polyrepo** if: services are genuinely independent (different teams, tech stacks, release cadences), you need strict access control per service, or your teams don't need to coordinate across services often. Most early-stage startups benefit from a monorepo; large enterprises with separate business units often prefer polyrepos.",
        np: "**Monorepo** प्रयोग गर्नुहोस् यदि: service ले significant code share गर्छन्, atomic cross-service change चाहिन्छ, वा unified tooling चाहिन्छ। **Polyrepo** प्रयोग गर्नुहोस् यदि: service genuinely independent छन् (different team, tech stack, release cadence), service प्रति strict access control चाहिन्छ। अधिकांश early-stage startup ले monorepo बाट benefit पाउँछन्।",
        jp: "次の場合は**モノリポ**を使います：サービスが重要なコードを共有する（共有ライブラリ・デザインシステム・型）、アトミックなクロスサービス変更が必要、統一されたツールと依存関係管理が必要。次の場合は**ポリリポ**を使います：サービスが本当に独立している（異なるチーム・技術スタック・リリースサイクル）、サービスごとの厳格なアクセス制御が必要、チームがサービスをまたいで頻繁に調整する必要がない。ほとんどの初期スタートアップはモノリポから恩恵を受けます。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
    {
      question: {
        en: "What is a git submodule and should I use it?",
        np: "Git submodule के हो र प्रयोग गर्नुपर्छ?",
        jp: "Git サブモジュールとは何か、使うべきか？",
      },
      answer: {
        en: "A git submodule is a pointer from one repository to a specific commit in another repository. It lets you embed one repo inside another without copying files. In theory it enables code sharing between polyrepos. In practice, submodules are notorious for confusing developers — cloning a repo with submodules requires `--recurse-submodules`, updating them requires `git submodule update --remote`, and they are a common source of 'it works on my machine' problems. Prefer proper packages (npm, pip) or a monorepo over submodules in almost all cases.",
        np: "Git submodule एउटा repository बाट अर्को repository को specific commit को pointer हो। यसले file copy नगरी एक repo भित्र अर्को embed गर्न दिन्छ। Theory मा polyrepo बीच code sharing enable गर्छ। Practice मा, submodule ले developer confuse गर्नमा notorious छ। Submodule भन्दा proper package (npm, pip) वा monorepo prefer गर्नुहोस्।",
        jp: "Git サブモジュールは、あるリポジトリから別のリポジトリの特定のコミットへのポインターです。ファイルをコピーせずに 1 つのリポジトリを別のリポジトリ内に埋め込むことができます。理論上はポリリポ間のコード共有を可能にします。実際には、サブモジュールは開発者を混乱させることで悪名高く、ほぼすべての場合においてサブモジュールよりも適切なパッケージ（npm・pip）またはモノリポを優先してください。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
  ],
};
