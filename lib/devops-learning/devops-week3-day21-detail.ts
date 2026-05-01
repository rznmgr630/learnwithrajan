import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Choosing a Git workflow is one of the most consequential decisions a DevOps team makes — it determines how often you deploy, how you handle hotfixes, and how much cognitive overhead developers carry. GitFlow was the dominant model for years; trunk-based development is increasingly replacing it for teams that want to ship daily.",
    np: "Git workflow छान्नु DevOps team ले गर्ने सबभन्दा महत्वपूर्ण निर्णयहरू मध्ये एक हो — यसले तपाईं कति पटक deploy गर्नुहुन्छ, hotfix कसरी handle गर्नुहुन्छ, र developer ले कति cognitive overhead बोक्छन् निर्धारण गर्छ। GitFlow वर्षौंसम्म dominant model थियो; trunk-based development ले दैनिक ship गर्न चाहने team लाई बिस्तारै replace गर्दैछ।",
    jp: "Git ワークフローの選択は、DevOps チームが下す最も重要な決断の一つです。デプロイ頻度・ホットフィックスの処理方法・開発者の認知負荷を決定します。GitFlow は長年主流でしたが、毎日リリースしたいチームにはトランクベース開発が急速に取って代わりつつあります。",
  } as const,
  o2: {
    en: "Today you build a clear mental model of GitFlow and trunk-based development — when each shines, what the branch rules are, and how CI/CD interacts differently with each model. You will leave knowing which to recommend and why.",
    np: "आज तपाईंले GitFlow र trunk-based development को स्पष्ट mental model बनाउनुहुनेछ — प्रत्येक कहिले राम्रो हुन्छ, branch rule के हुन्छन्, र CI/CD ले प्रत्येक model सँग कसरी फरक interact गर्छ। तपाईं कुन recommend गर्ने र किन भनेर जान्न छाड्नुहुनेछ।",
    jp: "本日は GitFlow とトランクベース開発の明確なメンタルモデルを構築します。それぞれがいつ輝くか・ブランチルールは何か・CI/CD が各モデルとどのように異なる相互作用をするか。どちらを推薦するか、そしてその理由がわかるようになります。",
  } as const,
};

export const DEVOPS_DAY_21_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "GitFlow — the structured branching model",
        np: "GitFlow — structured branching model",
        jp: "GitFlow — 構造化されたブランチモデル",
      },
      blocks: [
        { type: "diagram", id: "devops-git-branching" },
        {
          type: "paragraph",
          text: {
            en: "GitFlow defines five branch types with strict rules about what merges into what. It was designed for projects with scheduled release cycles — desktop software, mobile apps, APIs with versioned contracts. The separation between `develop` and `main` provides a stable release branch while development continues. The cost: parallel long-lived branches create merge overhead and slow down delivery.",
            np: "GitFlow ले पाँच branch type define गर्छ जसमा के कहाँ merge हुन्छ भन्ने strict rule छ। यो scheduled release cycle भएको project — desktop software, mobile app, versioned contract भएको API — का लागि design गरिएको थियो। `develop` र `main` बीचको separation ले development जारी राख्दै stable release branch provide गर्छ। Cost: parallel long-lived branch ले merge overhead बढाउँछ र delivery ढिलो बनाउँछ।",
            jp: "GitFlow は 5 種類のブランチタイプと、何が何にマージされるかの厳格なルールを定義します。スケジュールされたリリースサイクルを持つプロジェクト（デスクトップソフトウェア・モバイルアプリ・バージョン管理された契約の API）向けに設計されました。`develop` と `main` の分離により、開発を続けながら安定したリリースブランチが維持されます。コスト：長期間並行するブランチがマージのオーバーヘッドを生み、デリバリーを遅らせます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "GitFlow branch types and rules",
            np: "GitFlow branch प्रकार र नियम",
            jp: "GitFlow ブランチの種類とルール",
          },
          headers: [
            { en: "Branch", np: "Branch", jp: "ブランチ" },
            { en: "Lifetime", np: "अवधि", jp: "存続期間" },
            { en: "Created from", np: "कहाँबाट", jp: "作成元" },
            { en: "Merges into", np: "कहाँ merge", jp: "マージ先" },
            { en: "Purpose", np: "उद्देश्य", jp: "目的" },
          ],
          rows: [
            [
              { en: "main", np: "main", jp: "main" },
              { en: "Permanent", np: "स्थायी", jp: "永続" },
              { en: "—", np: "—", jp: "—" },
              { en: "—", np: "—", jp: "—" },
              { en: "Production-ready code; every commit is a release", np: "Production-ready code; हरेक commit एउटा release", jp: "本番対応コード。すべてのコミットがリリース" },
            ],
            [
              { en: "develop", np: "develop", jp: "develop" },
              { en: "Permanent", np: "स्थायी", jp: "永続" },
              { en: "main", np: "main", jp: "main" },
              { en: "—", np: "—", jp: "—" },
              { en: "Integration branch; next release is built here", np: "Integration branch; अर्को release यहाँ बन्छ", jp: "統合ブランチ。次のリリースはここで構築" },
            ],
            [
              { en: "feature/*", np: "feature/*", jp: "feature/*" },
              { en: "Days–weeks", np: "दिन–हप्ता", jp: "数日〜数週間" },
              { en: "develop", np: "develop", jp: "develop" },
              { en: "develop", np: "develop", jp: "develop" },
              { en: "One feature per branch; merged via PR", np: "प्रति branch एउटा feature; PR मार्फत merge", jp: "ブランチごとに 1 機能。PR でマージ" },
            ],
            [
              { en: "release/*", np: "release/*", jp: "release/*" },
              { en: "Days", np: "दिन", jp: "数日" },
              { en: "develop", np: "develop", jp: "develop" },
              { en: "main + develop", np: "main + develop", jp: "main + develop" },
              { en: "Release prep: bug fixes only, version bump", np: "Release prep: bug fix मात्र, version bump", jp: "リリース準備：バグ修正のみ、バージョン更新" },
            ],
            [
              { en: "hotfix/*", np: "hotfix/*", jp: "hotfix/*" },
              { en: "Hours–days", np: "घन्टा–दिन", jp: "数時間〜数日" },
              { en: "main", np: "main", jp: "main" },
              { en: "main + develop", np: "main + develop", jp: "main + develop" },
              { en: "Emergency production fix; bypasses develop", np: "Emergency production fix; develop bypass", jp: "緊急の本番修正。develop をバイパス" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "GitFlow commands (using git-flow tool or raw git)",
            np: "GitFlow command (git-flow tool वा raw git प्रयोग गरेर)",
            jp: "GitFlow コマンド（git-flow ツールまたは生の git）",
          },
          code: `# Install git-flow (optional helper — just wraps git commands)
# macOS: brew install git-flow-avh
# Ubuntu: apt install git-flow

# Initialize GitFlow in a repo
git flow init           # interactive — sets branch names
# or manually:
git checkout -b develop

# Feature workflow
git flow feature start my-feature       # → creates feature/my-feature from develop
# ... make commits ...
git flow feature finish my-feature      # → merges to develop, deletes branch

# Raw git equivalent:
git checkout develop
git checkout -b feature/my-feature
# ... commits ...
git checkout develop
git merge --no-ff feature/my-feature   # --no-ff preserves the branch history
git branch -d feature/my-feature

# Release workflow
git flow release start 1.4.0            # → creates release/1.4.0 from develop
# ... only bug fixes, bump version in package.json/VERSION ...
git flow release finish 1.4.0
# → merges to main (tagged v1.4.0) AND back to develop

# Hotfix workflow
git flow hotfix start critical-auth-fix  # → from main
# ... fix the bug ...
git flow hotfix finish critical-auth-fix
# → merges to main (tagged) AND develop`,
        },
      ],
    },
    {
      title: {
        en: "Trunk-based development — ship daily",
        np: "Trunk-based development — दैनिक ship गर्नुहोस्",
        jp: "トランクベース開発 — 毎日リリース",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In trunk-based development (TBD), all developers commit directly to `main` (the 'trunk') or use very short-lived feature branches (max 1–2 days) that integrate back to `main` multiple times per day. There is no `develop` branch. CI runs on every commit to `main` and if it passes, the code is deployable. Feature flags (toggling incomplete features in the code at runtime) replace long-lived feature branches.",
            np: "Trunk-based development (TBD) मा, सबै developer `main` (the 'trunk') मा directly commit गर्छन् वा धेरै छोटो-lived feature branch (अधिकतम 1–2 दिन) प्रयोग गर्छन् जुन दिनमा धेरै पटक `main` मा integrate हुन्छ। कुनै `develop` branch छैन। CI ले `main` मा हरेक commit मा run गर्छ र pass भयो भने code deployable हुन्छ। Feature flag ले long-lived feature branch replace गर्छ।",
            jp: "トランクベース開発（TBD）では、すべての開発者が `main`（「トランク」）に直接コミットするか、1〜2 日以内の非常に短命なフィーチャーブランチを使い、1 日に複数回 `main` に統合します。`develop` ブランチはありません。CI はすべてのコミットで実行され、通過すればコードはデプロイ可能です。フィーチャーフラグが長命なフィーチャーブランチに取って代わります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Trunk-based development workflow",
            np: "Trunk-based development workflow",
            jp: "トランクベース開発のワークフロー",
          },
          code: `# Daily workflow on trunk-based development

# 1. Always start from an up-to-date trunk
git checkout main
git pull origin main

# 2. Create a very short-lived branch (optional — some teams commit directly)
git checkout -b alice/add-retry-logic

# 3. Make small, focused commits
git add src/http_client.py
git commit -m "feat: add exponential backoff to HTTP retries"

# 4. Keep up with main frequently (rebase, not merge — keeps history clean)
git fetch origin
git rebase origin/main

# 5. Open a PR — code review is fast because the diff is small
# → CI runs: lint, tests, build
# → If green, merge to main (squash or rebase merge)
git push origin alice/add-retry-logic

# 6. Feature flags for incomplete work
# Instead of keeping a long-lived branch, merge the code behind a flag:

# Python example:
import os
if os.getenv("FEATURE_NEW_CHECKOUT", "false") == "true":
    return new_checkout_flow()
else:
    return legacy_checkout_flow()

# The flag is off in production, on in staging for testing.
# When the feature is complete and validated, remove the flag entirely.

# Release tags on trunk-based development
# Every green main commit is a potential release.
# Tag releases explicitly:
git tag -a v2.3.1 -m "Release v2.3.1"
git push origin v2.3.1`,
        },
      ],
    },
    {
      title: {
        en: "GitHub Flow — the pragmatic middle ground",
        np: "GitHub Flow — व्यावहारिक मध्यम मार्ग",
        jp: "GitHub Flow — 現実的な中間点",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "GitHub Flow is a simplified model used by most SaaS teams: one permanent branch (`main`) plus short-lived feature branches. Unlike TBD there is no direct commit to `main` — everything goes through a PR. Unlike GitFlow there is no `develop` or `release` branch — `main` is always deployable and you deploy from it directly. It is the right model for web services that deploy multiple times per day.",
            np: "GitHub Flow अधिकांश SaaS team ले प्रयोग गर्ने simplified model हो: एउटा permanent branch (`main`) र छोटो-lived feature branch। TBD भन्दा फरक: `main` मा direct commit छैन — सबै कुरा PR मार्फत जान्छ। GitFlow भन्दा फरक: कुनै `develop` वा `release` branch छैन — `main` सधैं deployable हुन्छ।",
            jp: "GitHub Flow はほとんどの SaaS チームが使う簡略モデルです。1 つの永続ブランチ（`main`）と短命なフィーチャーブランチ。TBD と違って `main` への直接コミットはなく、すべてが PR を経由します。GitFlow と違って `develop` や `release` ブランチはなく、`main` は常にデプロイ可能で、そこから直接デプロイします。1 日に複数回デプロイする Web サービスに適したモデルです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Rules**: `main` is always deployable → create a branch → add commits → open a PR → review and discuss → deploy from the branch to staging → merge to main → deploy to production.",
              np: "**नियम**: `main` सधैं deployable → branch बनाउनुहोस् → commit थप्नुहोस् → PR खोल्नुहोस् → review र छलफल → branch बाट staging मा deploy → main मा merge → production मा deploy।",
              jp: "**ルール**：`main` は常にデプロイ可能 → ブランチを作る → コミットを追加 → PR を開く → レビューと議論 → ブランチからステージングにデプロイ → main にマージ → 本番にデプロイ。",
            },
            {
              en: "**Branch naming** matters for automation: `feat/`, `fix/`, `chore/` prefixes let CI pipelines apply different rules (e.g., only run integration tests on `feat/` branches).",
              np: "**Branch naming** automation का लागि महत्वपूर्ण छ: `feat/`, `fix/`, `chore/` prefix ले CI pipeline लाई फरक rule apply गर्न दिन्छ (जस्तै, `feat/` branch मा मात्र integration test run गर्नुहोस्)।",
              jp: "**ブランチ命名**は自動化において重要です。`feat/`・`fix/`・`chore/` の接頭辞により、CI パイプラインが異なるルールを適用できます（例：`feat/` ブランチでのみ統合テストを実行）。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Choosing a workflow — the decision framework",
        np: "Workflow छान्नु — निर्णय framework",
        jp: "ワークフローの選択 — 意思決定フレームワーク",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "When to use each workflow",
            np: "कहिले कुन workflow प्रयोग गर्ने",
            jp: "それぞれのワークフローをいつ使うか",
          },
          headers: [
            { en: "Signal", np: "संकेत", jp: "シグナル" },
            { en: "Use this", np: "यो प्रयोग गर्नुहोस्", jp: "このモデルを使う" },
          ],
          rows: [
            [
              { en: "Multiple versioned releases in the wild simultaneously (mobile app, desktop software, on-prem)", np: "एकसाथ धेरै versioned release (mobile app, desktop, on-prem)", jp: "複数バージョンが同時に存在（モバイル・デスクトップ・オンプレ）" },
              { en: "GitFlow", np: "GitFlow", jp: "GitFlow" },
            ],
            [
              { en: "SaaS web service, deploy multiple times/day, single production version", np: "SaaS web service, दिनमा धेरै पटक deploy, एउटा production version", jp: "SaaS Web サービス、1 日複数回デプロイ、単一の本番バージョン" },
              { en: "GitHub Flow or Trunk-based", np: "GitHub Flow वा Trunk-based", jp: "GitHub Flow またはトランクベース" },
            ],
            [
              { en: "Team practices CI rigorously (tests run in < 10 min, coverage > 80%)", np: "Team ले CI rigorous रूपमा practice गर्छ (test < 10 min मा run, coverage > 80%)", jp: "CI を厳格に実践（テストが 10 分以内、カバレッジ 80% 超）" },
              { en: "Trunk-based development", np: "Trunk-based development", jp: "トランクベース開発" },
            ],
            [
              { en: "Small team (< 5 devs), simple product, want minimum process", np: "सानो team (< 5 dev), simple product, minimum process चाहिन्छ", jp: "小規模チーム（5 名未満）、シンプルなプロダクト、最小限のプロセス" },
              { en: "GitHub Flow", np: "GitHub Flow", jp: "GitHub Flow" },
            ],
            [
              { en: "Regulated industry (fintech, healthcare) — audit trail, approval gates", np: "Regulated industry (fintech, healthcare) — audit trail, approval gate", jp: "規制産業（フィンテック・医療）— 監査証跡・承認ゲート" },
              { en: "GitFlow with protected branches + required reviews", np: "Protected branch + required review सहित GitFlow", jp: "保護ブランチ + 必須レビュー付き GitFlow" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Protecting branches in GitHub/GitLab",
            np: "GitHub/GitLab मा branch protect गर्नुहोस्",
            jp: "GitHub/GitLab でブランチを保護する",
          },
          code: `# GitHub CLI — protect the main branch
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["ci/tests","ci/lint"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field restrictions=null

# What this enforces:
# - CI (tests + lint) must pass before merge
# - At least 1 approval required
# - No one (including admins) can push directly to main
# - Branch must be up-to-date before merge

# Git aliases that help enforce discipline locally
git config --global alias.sync 'pull --rebase --autostash'
git config --global alias.done '!git checkout main && git sync && git branch -d @{-1}'

# Prevent accidental direct push to main
# (add to .git/hooks/pre-push in each repo)
BRANCH=$(git symbolic-ref HEAD | sed -e 's,.*/\\(.*\\),\\1,')
if [ "$BRANCH" = "main" ]; then
  echo "Direct push to main is not allowed. Open a PR."
  exit 1
fi`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should the `--no-ff` flag be used when merging feature branches?",
        np: "Feature branch merge गर्दा `--no-ff` flag प्रयोग गर्नुपर्छ?",
        jp: "フィーチャーブランチをマージするとき `--no-ff` フラグを使うべきか？",
      },
      answer: {
        en: "`--no-ff` (no fast-forward) forces a merge commit even when a fast-forward would be possible, preserving the record that 'these commits were a feature branch'. Without it, git may fast-forward and the history looks like all commits were made directly on `main`. In GitFlow, `--no-ff` is standard so you can see where features began and ended. In trunk-based development with squash merging, every PR becomes a single commit on `main` regardless — so `--no-ff` vs `--ff` is irrelevant.",
        np: "`--no-ff` (no fast-forward) ले fast-forward सम्भव भएर पनि merge commit force गर्छ, 'यी commit feature branch थिए' भन्ने record preserve गर्दै। यो नभएमा git fast-forward गर्न सक्छ र history मा सबै commit `main` मा directly गरिएजस्तो देखिन्छ। GitFlow मा `--no-ff` standard हो। Trunk-based development मा squash merge सँग, हरेक PR `main` मा single commit बन्छ — त्यसैले `--no-ff` बनाम `--ff` irrelevant हुन्छ।",
        jp: "`--no-ff`（高速マージなし）は、高速マージが可能な場合でもマージコミットを強制し、「これらのコミットはフィーチャーブランチだった」という記録を保持します。これがないと、git は高速マージを行い、すべてのコミットが `main` に直接行われたように見えます。GitFlow では `--no-ff` が標準です。スカッシュマージのトランクベース開発では、すべての PR が `main` 上の単一コミットになるため、`--no-ff` は無関係です。",
      },
      tag: { en: "git", np: "Git", jp: "Git" },
    },
    {
      question: {
        en: "What is a squash merge and when should I use it?",
        np: "Squash merge के हो र कहिले प्रयोग गर्ने?",
        jp: "スカッシュマージとは何か、いつ使うべきか？",
      },
      answer: {
        en: "A squash merge takes all commits from a branch and combines them into a single new commit on `main`. The branch's intermediate commits (\"WIP\", \"fix typo\", \"oops\") disappear from the main branch history. This gives `main` a clean linear history where every commit is a complete, meaningful unit. Use it in GitHub Flow and trunk-based development. Avoid it in GitFlow where you want to preserve the full commit graph for release tracking. The tradeoff: `git blame` on individual lines becomes less informative since all changes trace back to the squash commit.",
        np: "Squash merge ले branch का सबै commit लिएर `main` मा एउटा नयाँ commit मा combine गर्छ। Branch का intermediate commit (\"WIP\", \"fix typo\", \"oops\") main branch history बाट हराउँछन्। यसले `main` लाई clean linear history दिन्छ जहाँ हरेक commit complete, meaningful unit हो। GitHub Flow र trunk-based development मा यो प्रयोग गर्नुहोस्।",
        jp: "スカッシュマージはブランチのすべてのコミットを取り込み、`main` 上の単一の新しいコミットに結合します。ブランチの中間コミット（「WIP」「タイポ修正」「おっと」）はメインブランチの履歴から消えます。これにより `main` がクリーンな線形履歴になり、すべてのコミットが完全で意味のある単位になります。GitHub Flow とトランクベース開発で使いましょう。リリーストラッキングのために完全なコミットグラフを保持したい GitFlow では避けましょう。",
      },
      tag: { en: "git", np: "Git", jp: "Git" },
    },
    {
      question: {
        en: "How do feature flags work in practice?",
        np: "Feature flag व्यवहारमा कसरी काम गर्छ?",
        jp: "フィーチャーフラグは実際にどのように動くのか？",
      },
      answer: {
        en: "Feature flags are if-statements in your code that check a configuration value to decide which code path to run. At the simplest level, an environment variable: `if ENV['NEW_CHECKOUT'] == 'true'`. More sophisticated systems use a feature flag service (LaunchDarkly, Unleash, AWS AppConfig) that lets you toggle features without deploying, roll out to a percentage of users, or target specific users/regions. The key discipline: flags must be temporary. Set a date to remove each flag, otherwise your codebase accumulates dead branches and the technical debt compounds.",
        np: "Feature flag तपाईंको code मा if-statement हुन् जसले कुन code path run गर्ने निर्णय गर्न configuration value check गर्छ। सरल level मा, environment variable: `if ENV['NEW_CHECKOUT'] == 'true'`। अझ sophisticated system ले feature flag service (LaunchDarkly, Unleash, AWS AppConfig) प्रयोग गर्छ। Key discipline: flag temporary हुनुपर्छ।",
        jp: "フィーチャーフラグは、どのコードパスを実行するかを決めるために設定値を確認するコード内の if 文です。最もシンプルなレベルでは環境変数：`if ENV['NEW_CHECKOUT'] == 'true'`。より高度なシステムはフィーチャーフラグサービス（LaunchDarkly・Unleash・AWS AppConfig）を使い、デプロイなしでの切り替え・ユーザーの一部へのロールアウト・特定ユーザー/リージョンへのターゲティングを可能にします。重要な規律：フラグは一時的でなければなりません。各フラグを削除する期日を設定してください。",
      },
      tag: { en: "workflow", np: "कार्यप्रवाह", jp: "ワークフロー" },
    },
  ],
};
