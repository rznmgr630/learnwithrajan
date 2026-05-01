import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Versioning is the contract between you and everyone who depends on your software. A version number communicates intent: is this a backward-compatible improvement, a breaking change, or just a bug fix? Semantic Versioning (SemVer) answers that question with a three-number system that the entire software ecosystem — npm, pip, Helm, Docker Hub — understands.",
    np: "Versioning तपाईं र तपाईंको software मा depend गर्ने सबैबीचको contract हो। Version number ले intent communicate गर्छ: यो backward-compatible improvement हो, breaking change हो, वा केवल bug fix हो? Semantic Versioning (SemVer) ले यो प्रश्नको उत्तर तीन-number system ले दिन्छ जुन सम्पूर्ण software ecosystem — npm, pip, Helm, Docker Hub — ले बुझ्छ।",
    jp: "バージョン管理は、あなたとあなたのソフトウェアに依存するすべての人との契約です。バージョン番号は意図を伝えます：これは後方互換性のある改善か、破壊的な変更か、それとも単なるバグ修正か？セマンティックバージョニング（SemVer）は、npm・pip・Helm・Docker Hub などのソフトウェアエコシステム全体が理解する 3 つの数字システムでその質問に答えます。",
  } as const,
  o2: {
    en: "Today you master SemVer semantics, Git tags (lightweight and annotated), how to generate changelogs from Conventional Commits, and how release automation tools like semantic-release eliminate human error from the version-bump-and-tag ceremony.",
    np: "आज तपाईंले SemVer semantics, Git tag (lightweight र annotated), Conventional Commits बाट changelog कसरी generate गर्ने, र semantic-release जस्ता release automation tool ले version-bump-and-tag ceremony बाट human error कसरी eliminate गर्छ master गर्नुहुनेछ।",
    jp: "本日は SemVer のセマンティクス・Git タグ（軽量と注釈付き）・Conventional Commits からの変更ログの生成・semantic-release などのリリース自動化ツールがバージョンバンプとタグ付けの作業から人的エラーをどのように排除するかをマスターします。",
  } as const,
};

export const DEVOPS_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Semantic Versioning — MAJOR.MINOR.PATCH",
        np: "Semantic Versioning — MAJOR.MINOR.PATCH",
        jp: "セマンティックバージョニング — MAJOR.MINOR.PATCH",
      },
      blocks: [
        { type: "diagram", id: "devops-semver" },
        {
          type: "paragraph",
          text: {
            en: "SemVer (semver.org) defines three parts: **MAJOR** (incompatible API changes — callers must update their code), **MINOR** (new backward-compatible functionality — callers can upgrade without changes), **PATCH** (backward-compatible bug fixes). Pre-release versions use a hyphen suffix: `1.4.0-beta.1`, `2.0.0-rc.3`. Build metadata uses a plus suffix: `1.0.0+build.42`.",
            np: "SemVer ले तीन भाग define गर्छ: **MAJOR** (incompatible API change — caller ले code update गर्नुपर्छ), **MINOR** (new backward-compatible functionality — caller ले change बिना upgrade गर्न सक्छ), **PATCH** (backward-compatible bug fix)। Pre-release version ले hyphen suffix प्रयोग गर्छ: `1.4.0-beta.1`, `2.0.0-rc.3`।",
            jp: "SemVer は 3 つの部分を定義します：**MAJOR**（非互換の API 変更 — 呼び出し側はコードを更新する必要がある）・**MINOR**（後方互換性のある新機能 — 呼び出し側は変更なしでアップグレードできる）・**PATCH**（後方互換性のあるバグ修正）。プレリリースバージョンはハイフンサフィックスを使います：`1.4.0-beta.1`・`2.0.0-rc.3`。",
          },
        },
        {
          type: "table",
          caption: {
            en: "SemVer decision table — which number do I bump?",
            np: "SemVer decision table — कुन number bump गर्ने?",
            jp: "SemVer の決定テーブル — どの番号を上げるか？",
          },
          headers: [
            { en: "Change type", np: "Change type", jp: "変更タイプ" },
            { en: "Bump", np: "Bump", jp: "バンプ" },
            { en: "Reset", np: "Reset", jp: "リセット" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "Breaking change — existing callers will break", np: "Breaking change — existing caller break हुन्छ", jp: "破壊的変更 — 既存の呼び出し側が壊れる" },
              { en: "MAJOR", np: "MAJOR", jp: "MAJOR" },
              { en: "MINOR and PATCH → 0", np: "MINOR र PATCH → 0", jp: "MINOR と PATCH → 0" },
              { en: "1.4.2 → 2.0.0", np: "1.4.2 → 2.0.0", jp: "1.4.2 → 2.0.0" },
            ],
            [
              { en: "New feature, backward-compatible", np: "New feature, backward-compatible", jp: "新機能、後方互換性あり" },
              { en: "MINOR", np: "MINOR", jp: "MINOR" },
              { en: "PATCH → 0", np: "PATCH → 0", jp: "PATCH → 0" },
              { en: "1.4.2 → 1.5.0", np: "1.4.2 → 1.5.0", jp: "1.4.2 → 1.5.0" },
            ],
            [
              { en: "Bug fix, backward-compatible", np: "Bug fix, backward-compatible", jp: "バグ修正、後方互換性あり" },
              { en: "PATCH", np: "PATCH", jp: "PATCH" },
              { en: "Nothing", np: "Nothing", jp: "なし" },
              { en: "1.4.2 → 1.4.3", np: "1.4.2 → 1.4.3", jp: "1.4.2 → 1.4.3" },
            ],
            [
              { en: "Deprecation notice (not yet removed)", np: "Deprecation notice (अझैं remove नभएको)", jp: "非推奨通知（まだ削除されていない）" },
              { en: "MINOR", np: "MINOR", jp: "MINOR" },
              { en: "PATCH → 0", np: "PATCH → 0", jp: "PATCH → 0" },
              { en: "1.4.2 → 1.5.0 (document in changelog)", np: "1.4.2 → 1.5.0 (changelog मा document)", jp: "1.4.2 → 1.5.0（変更ログに記録）" },
            ],
            [
              { en: "Internal refactor, no API change", np: "Internal refactor, no API change", jp: "内部リファクタリング、API 変更なし" },
              { en: "PATCH", np: "PATCH", jp: "PATCH" },
              { en: "Nothing", np: "Nothing", jp: "なし" },
              { en: "1.4.2 → 1.4.3", np: "1.4.2 → 1.4.3", jp: "1.4.2 → 1.4.3" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Version 0.x.y is special** — MAJOR zero (`0.x.y`) means 'initial development': anything may change at any time, and breaking changes happen on MINOR bumps. Don't use `0.x.y` for public APIs you actually want others to depend on.",
              np: "**Version 0.x.y special छ** — MAJOR zero (`0.x.y`) को अर्थ 'initial development': कुनै पनि समयमा केहि पनि बदलिन सक्छ, र breaking change MINOR bump मा हुन्छ। Public API जसमा others depend गर्न चाहनुहुन्छ को लागि `0.x.y` प्रयोग नगर्नुहोस्।",
              jp: "**バージョン 0.x.y は特別** — MAJOR ゼロ（`0.x.y`）は「初期開発」を意味します：いつでも何でも変わる可能性があり、MINOR バンプで破壊的変更が起こります。他の人が依存することを実際に望むパブリック API には `0.x.y` を使わないでください。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Git tags — marking releases in history",
        np: "Git tag — history मा release mark गर्नुहोस्",
        jp: "Git タグ — 履歴にリリースをマークする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Lightweight vs annotated tags and release workflow",
            np: "Lightweight vs annotated tag र release workflow",
            jp: "軽量タグと注釈付きタグ、リリースワークフロー",
          },
          code: `# Lightweight tag (just a pointer to a commit — no metadata)
git tag v1.4.2
git tag v1.4.2 abc1234        # tag a specific commit

# Annotated tag (full object: tagger, date, message, GPG-signable)
git tag -a v1.4.2 -m "Release 1.4.2 — fix memory leak in cache module"
git tag -a v1.4.2 -m "Release 1.4.2" abc1234   # tag a specific commit

# View tags
git tag                        # list all tags
git tag -l "v1.*"              # filter by pattern
git show v1.4.2                # annotated: full metadata + commit

# Push tags to remote (NOT pushed by default)
git push origin v1.4.2         # push one tag
git push origin --tags         # push all tags
git push --follow-tags          # push reachable annotated tags with commits

# Delete tags
git tag -d v1.4.2              # delete locally
git push origin --delete v1.4.2  # delete on remote

# Checkout a tag (creates detached HEAD — for inspection only)
git checkout v1.4.2            # detached HEAD
git checkout -b hotfix/v1.4.3 v1.4.2   # create branch from tag (for hotfixes)

# Create a GitHub Release from a tag
gh release create v1.4.2 \
  --title "Release v1.4.2" \
  --notes "## Bug Fixes\n- Fix memory leak in cache module" \
  dist/app-linux-amd64.tar.gz dist/app-darwin-arm64.tar.gz`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Always use annotated tags for releases** — they are stored as first-class Git objects with a tagger identity, timestamp, and message. Lightweight tags are just aliases for commit hashes, have no metadata, and are easy to accidentally create on the wrong commit.",
              np: "**Release का लागि सधैं annotated tag प्रयोग गर्नुहोस्** — तिनीहरू tagger identity, timestamp, र message सहित first-class Git object को रूपमा store हुन्छन्। Lightweight tag केवल commit hash को alias हो, कुनै metadata छैन, र गलत commit मा accidental create हुन सक्छ।",
              jp: "**リリースには常に注釈付きタグを使用する** — これらはタグ付けした人の ID・タイムスタンプ・メッセージとともに一級 Git オブジェクトとして保存されます。軽量タグはコミットハッシュの単なるエイリアスで、メタデータがなく、誤って間違ったコミットに作成しやすいです。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Changelogs and automated releases",
        np: "Changelog र automated release",
        jp: "変更ログと自動化されたリリース",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Manually maintaining a CHANGELOG.md is error-prone and skipped under pressure. The solution is to derive the changelog automatically from Conventional Commits. Tools like `semantic-release`, `release-please` (Google), and `standard-version` analyze commits since the last tag, determine the version bump (feat → MINOR, fix → PATCH, BREAKING CHANGE footer → MAJOR), generate the changelog, create the tag, and publish — all in CI.",
            np: "Manually CHANGELOG.md maintain गर्नु error-prone छ र pressure मा skip हुन्छ। Solution Conventional Commits बाट automatically changelog derive गर्नु हो। `semantic-release`, `release-please` (Google), र `standard-version` जस्ता tool ले last tag देखि commit analyze गर्छन्, version bump determine गर्छन् (feat → MINOR, fix → PATCH, BREAKING CHANGE → MAJOR), changelog generate गर्छन्, tag create गर्छन्, र CI मा publish गर्छन्।",
            jp: "CHANGELOG.md を手動でメンテナンスするとエラーが発生しやすく、プレッシャー下でスキップされます。解決策は Conventional Commits から変更ログを自動的に導出することです。`semantic-release`・`release-please`（Google）・`standard-version` などのツールは最後のタグからコミットを分析し、バージョンバンプを決定し（feat → MINOR・fix → PATCH・BREAKING CHANGE → MAJOR）、変更ログを生成し、タグを作成し、CI ですべて公開します。",
          },
        },
        {
          type: "code",
          title: {
            en: "semantic-release and keep-a-changelog",
            np: "semantic-release र keep-a-changelog",
            jp: "semantic-release と keep-a-changelog",
          },
          code: `# Keep-a-changelog format (manual approach — keepachangelog.com)
# CHANGELOG.md structure:
# ## [Unreleased]
# ### Added
# - New OAuth2 login flow
# ### Fixed
# - Memory leak in cache module
# ## [1.4.1] - 2024-03-15
# ### Fixed
# - Null pointer in user serializer

# semantic-release (automated — derives everything from commits)
npm install --save-dev semantic-release \
  @semantic-release/changelog \
  @semantic-release/git \
  @semantic-release/github

# .releaserc.json
cat > .releaserc.json << 'EOF'
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    ["@semantic-release/changelog", {"changelogFile": "CHANGELOG.md"}],
    "@semantic-release/npm",
    ["@semantic-release/git", {"assets": ["CHANGELOG.md", "package.json"]}],
    "@semantic-release/github"
  ]
}
EOF

# CI workflow step (GitHub Actions)
# - name: Release
#   env:
#     GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
#     NPM_TOKEN: \${{ secrets.NPM_TOKEN }}
#   run: npx semantic-release

# release-please (Google's alternative — works via PRs)
# Creates a "Release PR" that bumps version and changelog
# You merge the PR when you want to release
# .release-please-manifest.json tracks versions per package`,
        },
        {
          type: "code",
          title: {
            en: "Manual SemVer release workflow (no automation tools)",
            np: "Manual SemVer release workflow (automation tool बिना)",
            jp: "手動 SemVer リリースワークフロー（自動化ツールなし）",
          },
          code: `# Step-by-step release process (e.g., bumping 1.4.1 → 1.5.0)

# 1. Ensure main is clean and CI is green
git switch main && git pull
git status   # should be clean

# 2. Update version in code
# Edit package.json, pyproject.toml, Chart.yaml, etc.
sed -i 's/"version": "1.4.1"/"version": "1.5.0"/' package.json

# 3. Update CHANGELOG.md (move [Unreleased] to [1.5.0] with today's date)

# 4. Commit the version bump
git add package.json CHANGELOG.md
git commit -m "chore(release): bump version to 1.5.0"

# 5. Create annotated tag
git tag -a v1.5.0 -m "Release v1.5.0

Features:
- Add dark mode support (#142)
- Add bulk export API (#156)

Bug fixes:
- Fix memory leak in cache (#161)"

# 6. Push commit and tag
git push origin main
git push origin v1.5.0

# 7. Create GitHub Release (drafts release notes from tag message)
gh release create v1.5.0 --verify-tag \
  --title "v1.5.0 — Dark mode & bulk export" \
  --notes-from-tag`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Tag and release a project",
        np: "Hands-on: Project tag र release गर्नुहोस्",
        jp: "ハンズオン: プロジェクトをタグ付けしてリリースする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "First full release cycle",
            np: "पहिलो full release cycle",
            jp: "最初の完全なリリースサイクル",
          },
          code: `# Assume you have a repo with several commits using Conventional Commits

# 1. View commits since last tag (or from the beginning)
git log --oneline $(git describe --tags --abbrev=0)..HEAD 2>/dev/null || \
  git log --oneline   # no previous tags

# 2. Determine version bump from commits
# feat: → MINOR bump
# fix:  → PATCH bump
# BREAKING CHANGE in footer → MAJOR bump

# 3. Prepare the release
VERSION="v1.0.0"
DATE=$(date +%Y-%m-%d)

# Update CHANGELOG.md
cat >> CHANGELOG.md << EOF

## [$VERSION] - $DATE
### Added
- feat: initial deployment pipeline
- feat: healthcheck endpoint

### Fixed
- fix: handle empty config gracefully
EOF

git add CHANGELOG.md
git commit -m "chore(release): update changelog for $VERSION"

# 4. Tag
git tag -a $VERSION -m "Release $VERSION — initial production release"

# 5. Push everything
git push origin main --follow-tags

# 6. Verify the tag is visible
git tag -l "v*"
git show $VERSION | head -10

# 7. List all releases in the repo
gh release list

# Extra: generate a simple changelog from git log
git log $(git describe --tags --abbrev=0 HEAD^)..HEAD \
  --pretty=format:"- %s (%h)" \
  --no-merges \
  | grep -E "^- (feat|fix|perf)"`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use v1.0.0 or 1.0.0 as the tag name?",
        np: "Tag name ko रूपमा v1.0.0 वा 1.0.0 प्रयोग गर्ने?",
        jp: "タグ名として v1.0.0 と 1.0.0 のどちらを使うべきか？",
      },
      answer: {
        en: "The `v` prefix is a convention, not part of the SemVer spec. GitHub, npm, and most tooling expect and handle both. The important thing is consistency within your project. Most ecosystems lean toward `v1.0.0` with a prefix. Helm charts use no prefix. Whatever you choose, codify it in your CONTRIBUTING.md and enforce it in CI.",
        np: "`v` prefix convention हो, SemVer spec को भाग होइन। GitHub, npm, र अधिकांश tooling दुवै expect र handle गर्छ। महत्त्वपूर्ण कुरा project भित्र consistency हो। अधिकांश ecosystem ले prefix सहित `v1.0.0` prefer गर्छन्। Helm chart ले prefix प्रयोग गर्दैन। Choose गर्ने कुरा CONTRIBUTING.md मा codify गरेर CI मा enforce गर्नुहोस्।",
        jp: "`v` プレフィックスは慣例であり、SemVer 仕様の一部ではありません。GitHub・npm・ほとんどのツールは両方を期待して処理します。重要なのはプロジェクト内での一貫性です。ほとんどのエコシステムはプレフィックス付きの `v1.0.0` を好みます。Helm チャートはプレフィックスを使いません。選択したものを CONTRIBUTING.md に明文化し、CI で強制してください。",
      },
      tag: { en: "versioning", np: "भर्सनिङ", jp: "バージョン管理" },
    },
    {
      question: {
        en: "How do I handle versioning for a Docker image?",
        np: "Docker image को versioning कसरी handle गर्ने?",
        jp: "Docker イメージのバージョン管理をどのように行うか？",
      },
      answer: {
        en: "Tag Docker images with multiple tags per build: the full SemVer (`1.5.0`), the major.minor (`1.5`), the major (`1`), and `latest`. This lets users pin as strictly or loosely as they need. In CI, also tag with the git commit SHA (`sha-abc1234`) for exact traceability. Never mutate the SHA tag — it is your immutable audit trail. The `latest` tag should point to the newest stable release, not the latest commit.",
        np: "Build प्रति multiple tag सहित Docker image tag गर्नुहोस्: full SemVer (`1.5.0`), major.minor (`1.5`), major (`1`), र `latest`। यसले user लाई strict वा loose pin गर्न दिन्छ। CI मा, exact traceability का लागि git commit SHA (`sha-abc1234`) ले पनि tag गर्नुहोस्। SHA tag कहिल्यै mutate नगर्नुहोस् — यो तपाईंको immutable audit trail हो।",
        jp: "ビルドごとに複数のタグで Docker イメージにタグを付けます：完全な SemVer（`1.5.0`）・major.minor（`1.5`）・major（`1`）・`latest`。これにより、ユーザーは必要に応じて厳密にも緩くもピン留めできます。CI では、正確なトレーサビリティのために git コミット SHA（`sha-abc1234`）でもタグ付けします。SHA タグは決して変更しないでください — それはイミュータブルな監査証跡です。",
      },
      tag: { en: "versioning", np: "भर्सनिङ", jp: "バージョン管理" },
    },
  ],
};
