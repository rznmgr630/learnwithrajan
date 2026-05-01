import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A branching strategy is the agreement a team makes about how code flows from a developer's machine to production. The wrong strategy creates merge nightmares, delayed releases, and hotfix chaos. The right strategy matches your team's release cadence — daily deploys need a different approach than quarterly releases.",
    np: "Branching strategy एउटा team ले developer को machine बाट production सम्म code कसरी flow गर्छ भन्ने सम्झौता हो। गलत strategy ले merge nightmare, delayed release, र hotfix chaos ल्याउँछ। सही strategy तपाईंको team को release cadence सँग match हुन्छ — daily deploy ले quarterly release भन्दा फरक approach चाहिन्छ।",
    jp: "ブランチ戦略とは、コードが開発者のマシンから本番環境にどのように流れるかについてチームが合意することです。間違った戦略はマージの悪夢・リリースの遅延・ホットフィックスの混乱を生みます。正しい戦略はチームのリリースサイクルに合致します — 日次デプロイは四半期リリースとは異なるアプローチが必要です。",
  } as const,
  o2: {
    en: "Today you compare the three dominant strategies — GitFlow, GitHub Flow, and trunk-based development — understand the mechanics of merge vs rebase vs squash, and learn when each is the right tool.",
    np: "आज तपाईं तीन dominant strategy — GitFlow, GitHub Flow, र trunk-based development — compare गर्नुहुनेछ, merge vs rebase vs squash को mechanics बुझ्नुहुनेछ, र कहिले कुन सही tool हो सिक्नुहुनेछ।",
    jp: "本日は 3 つの主要な戦略 — GitFlow・GitHub Flow・トランクベース開発 — を比較し、マージ・リベース・スカッシュの仕組みを理解し、それぞれがいつ正しいツールであるかを学びます。",
  } as const,
};

export const DEVOPS_DAY_16_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The three major branching strategies",
        np: "तीन प्रमुख branching strategy",
        jp: "3 つの主要なブランチ戦略",
      },
      blocks: [
        { type: "diagram", id: "devops-git-branching" },
        {
          type: "table",
          caption: {
            en: "Strategy comparison — which fits your team",
            np: "Strategy comparison — कुन तपाईंको team का लागि उपयुक्त छ",
            jp: "戦略の比較 — あなたのチームに合うのはどれか",
          },
          headers: [
            { en: "Strategy", np: "Strategy", jp: "戦略" },
            { en: "Best for", np: "Best for", jp: "最適な場面" },
            { en: "Release model", np: "Release model", jp: "リリースモデル" },
            { en: "Complexity", np: "Complexity", jp: "複雑さ" },
            { en: "Key branches", np: "Key branch", jp: "主要ブランチ" },
          ],
          rows: [
            [
              { en: "GitFlow", np: "GitFlow", jp: "GitFlow" },
              { en: "Versioned software, scheduled releases, multiple versions in production", np: "Versioned software, scheduled release, production मा multiple version", jp: "バージョン管理されたソフトウェア・計画的リリース・複数バージョンの本番運用" },
              { en: "Scheduled (e.g., quarterly)", np: "Scheduled (quarterly)", jp: "定期的（例：四半期）" },
              { en: "High", np: "High", jp: "高" },
              { en: "main, develop, feature/*, release/*, hotfix/*", np: "main, develop, feature/*, release/*, hotfix/*", jp: "main・develop・feature/*・release/*・hotfix/*" },
            ],
            [
              { en: "GitHub Flow", np: "GitHub Flow", jp: "GitHub Flow" },
              { en: "Web services, SaaS, continuous delivery to one environment", np: "Web service, SaaS, one environment मा continuous delivery", jp: "Web サービス・SaaS・1 つの環境への継続的デリバリー" },
              { en: "Continuous (any time)", np: "Continuous", jp: "継続的（いつでも）" },
              { en: "Low", np: "Low", jp: "低" },
              { en: "main + short-lived feature branches", np: "main + short-lived feature branch", jp: "main + 短命のフィーチャーブランチ" },
            ],
            [
              { en: "Trunk-based development", np: "Trunk-based development", jp: "トランクベース開発" },
              { en: "High-velocity teams, CI/CD mature, feature flags in use", np: "High-velocity team, CI/CD mature, feature flag use", jp: "高速チーム・成熟した CI/CD・フィーチャーフラグを使用" },
              { en: "Multiple times per day", np: "Day मा multiple times", jp: "1 日に複数回" },
              { en: "Low", np: "Low", jp: "低" },
              { en: "main only (+ very short feature branches ≤2 days)", np: "main only (+ ≤2 day feature branch)", jp: "main のみ（+ 2 日以内の非常に短いフィーチャーブランチ）" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "GitFlow — full lifecycle",
            np: "GitFlow — full lifecycle",
            jp: "GitFlow — 完全なライフサイクル",
          },
          code: `# Install git-flow extension (optional but helpful)
sudo apt install git-flow   # or: brew install git-flow

# Initialize GitFlow in a repo
git flow init               # sets up branch naming conventions

# Feature branch workflow
git flow feature start login-oauth       # creates feature/login-oauth from develop
# ... write code, commit ...
git flow feature finish login-oauth      # merges into develop, deletes branch

# Release branch workflow
git flow release start 1.2.0             # creates release/1.2.0 from develop
# ... last-minute fixes, bump version ...
git flow release finish 1.2.0            # merges into main AND develop, tags main

# Hotfix (emergency fix to production)
git flow hotfix start critical-bug       # branches from main
# ... fix the bug ...
git flow hotfix finish critical-bug      # merges into main AND develop, tags main

# Without git-flow extension (manual):
git checkout develop
git checkout -b feature/login-oauth develop
# ... work ...
git checkout develop && git merge --no-ff feature/login-oauth
git branch -d feature/login-oauth`,
        },
        {
          type: "code",
          title: {
            en: "GitHub Flow — simple and effective for SaaS",
            np: "GitHub Flow — SaaS का लागि simple र effective",
            jp: "GitHub Flow — SaaS に対してシンプルで効果的",
          },
          code: `# GitHub Flow: main is always deployable
# 1. Create a branch from main
git switch -c feature/add-dark-mode

# 2. Commit often, push often (enables CI to run)
git add .
git commit -m "feat: add dark mode toggle component"
git push -u origin feature/add-dark-mode

# 3. Open a Pull Request (do this early, not when done)
gh pr create --title "feat: dark mode" --body "See issue #42"

# 4. Address review feedback
git add .
git commit -m "fix: use CSS variable instead of hardcoded hex"
git push

# 5. Merge when CI is green and approved (squash recommended)
gh pr merge --squash --delete-branch

# 6. main is immediately deployed by CI/CD
# Done — no release branches, no develop branch`,
        },
      ],
    },
    {
      title: {
        en: "Merge vs rebase vs squash — choosing your integration strategy",
        np: "Merge vs rebase vs squash — integration strategy choose गर्नुहोस्",
        jp: "マージ・リベース・スカッシュ — 統合戦略の選択",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Integration strategies compared",
            np: "Integration strategy comparison",
            jp: "統合戦略の比較",
          },
          headers: [
            { en: "Strategy", np: "Strategy", jp: "戦略" },
            { en: "History shape", np: "History shape", jp: "履歴の形" },
            { en: "Preserves commits?", np: "Commit preserve?", jp: "コミットを保持?" },
            { en: "Best for", np: "Best for", jp: "最適な場面" },
          ],
          rows: [
            [
              { en: "Merge commit (--no-ff)", np: "Merge commit (--no-ff)", jp: "マージコミット（--no-ff）" },
              { en: "Branched — preserves topology", np: "Branched — topology preserve", jp: "分岐 — トポロジーを保持" },
              { en: "Yes — all branch commits visible", np: "Yes — सबै branch commit visible", jp: "はい — すべてのブランチコミットが見える" },
              { en: "GitFlow — want to see when features were merged", np: "GitFlow — feature कहिले merge भयो देख्न चाहिन्छ", jp: "GitFlow — フィーチャーのマージ時期を見たい場合" },
            ],
            [
              { en: "Fast-forward merge", np: "Fast-forward merge", jp: "ファストフォワードマージ" },
              { en: "Linear — no merge commit", np: "Linear — no merge commit", jp: "線形 — マージコミットなし" },
              { en: "Yes — all branch commits visible", np: "Yes — सबै branch commit visible", jp: "はい — すべてのブランチコミットが見える" },
              { en: "Solo work, trivial changes on short-lived branches", np: "Solo work, short-lived branch मा trivial change", jp: "一人作業・短命ブランチの些細な変更" },
            ],
            [
              { en: "Rebase + merge", np: "Rebase + merge", jp: "リベース + マージ" },
              { en: "Linear — replayed commits", np: "Linear — replayed commit", jp: "線形 — リプレイされたコミット" },
              { en: "Yes — commits rewritten onto target", np: "Yes — target 上に commit rewrite", jp: "はい — コミットがターゲットに書き換えられる" },
              { en: "GitHub Flow with clean history — each commit meaningful", np: "Clean history सहित GitHub Flow — each commit meaningful", jp: "クリーンな履歴の GitHub Flow — 各コミットに意味がある場合" },
            ],
            [
              { en: "Squash merge", np: "Squash merge", jp: "スカッシュマージ" },
              { en: "Linear — one commit per PR", np: "Linear — PR प्रति एक commit", jp: "線形 — PR ごとに 1 つのコミット" },
              { en: "No — all branch commits collapsed to one", np: "No — सबै branch commit एउटामा collapse", jp: "いいえ — すべてのブランチコミットが 1 つに折りたたまれる" },
              { en: "GitHub Flow — messy branch history, want clean main", np: "GitHub Flow — messy branch history, clean main चाहिन्छ", jp: "GitHub Flow — 乱雑なブランチ履歴、クリーンな main が必要な場合" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Rebase — the powerful history rewriter",
            np: "Rebase — शक्तिशाली history rewriter",
            jp: "リベース — 強力な履歴書き換えツール",
          },
          code: `# Basic rebase: move feature branch commits on top of main
git switch feature/add-payment
git rebase main               # replay commits on top of latest main

# Interactive rebase — rewrite the last N commits
git rebase -i HEAD~4          # opens editor with last 4 commits
# In the editor, for each commit choose:
# pick   → keep as-is
# reword → keep but edit message
# edit   → pause and amend the commit
# squash → merge into previous commit (keeps message)
# fixup  → merge into previous (discard message)
# drop   → delete the commit entirely

# Rebase onto a different base
git rebase --onto main old-base feature/branch   # transplant commits

# If conflicts arise during rebase
git rebase main
# CONFLICT: resolve the file(s)
git add resolved-file.ts
git rebase --continue         # proceed to next commit
# or:
git rebase --abort            # go back to before the rebase started

# GOLDEN RULE: never rebase commits that others have already pulled
# Rebasing rewrites commit hashes — if someone has those commits,
# you will force them into a diverged history nightmare`,
        },
      ],
    },
    {
      title: {
        en: "Branch management — naming, protection, and cleanup",
        np: "Branch management — naming, protection, र cleanup",
        jp: "ブランチ管理 — 命名・保護・クリーンアップ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Branch operations and naming conventions",
            np: "Branch operation र naming convention",
            jp: "ブランチ操作と命名規則",
          },
          code: `# Branch naming conventions (pick one and stick to it)
feature/TICKET-123-add-login      # feature/<ticket>-<short-desc>
fix/TICKET-456-null-pointer        # fix/<ticket>-<desc>
chore/update-dependencies         # chore/<desc>
release/1.4.0                      # release/<version>
hotfix/prod-crash-on-empty-cart   # hotfix/<desc>

# Create and switch to branches
git switch -c feature/new-ui       # modern (git 2.23+)
git checkout -b feature/new-ui     # classic equivalent

# List branches
git branch                         # local branches
git branch -r                      # remote branches
git branch -a                      # all
git branch -vv                     # with upstream and ahead/behind info

# Delete branches
git branch -d feature/merged-branch     # safe delete (must be merged)
git branch -D feature/unmerged-branch   # force delete (data loss risk)
git push origin --delete feature/merged-branch  # delete on remote

# Bulk cleanup: delete remote branches that are already merged to main
git fetch --prune
git branch -r --merged main | grep -v 'main$' | \
  sed 's/origin\///' | xargs -I{} git push origin --delete {}

# Set up branch protection on GitHub (via gh CLI)
gh api repos/:owner/:repo/branches/main/protection \
  --method PUT \
  --field required_pull_request_reviews='{"required_approving_review_count":1}' \
  --field required_status_checks='{"strict":true,"contexts":["ci/test","ci/lint"]}' \
  --field enforce_admins=true`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Branch protection rules** are non-negotiable on `main` in any team: require pull requests before merging, require CI checks to pass, require at least one approval, and prevent force-pushes. These rules make it physically impossible to break main by accident.",
              np: "**Branch protection rule** कुनै पनि team मा `main` मा non-negotiable छन्: merge गर्नु अघि pull request require, CI check pass require, कम्तिमा एक approval require, र force-push prevent। यी rule ले main accidental break गर्नु physically impossible बनाउँछन्।",
              jp: "**ブランチ保護ルール**はどのチームでも `main` において交渉の余地がありません：マージ前にプルリクエストを要求する・CI チェックの通過を要求する・少なくとも 1 つの承認を要求する・強制プッシュを防止する。これらのルールにより、誤って main を壊すことが物理的に不可能になります。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Simulate a full GitHub Flow cycle",
        np: "Hands-on: Full GitHub Flow cycle simulate गर्नुहोस्",
        jp: "ハンズオン: 完全な GitHub Flow サイクルをシミュレートする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Feature branch → PR → squash merge",
            np: "Feature branch → PR → squash merge",
            jp: "フィーチャーブランチ → PR → スカッシュマージ",
          },
          code: `# Starting point: clean main
git switch main && git pull

# 1. Create feature branch
git switch -c feature/PROJ-101-add-healthcheck

# 2. Make commits (simulate multiple WIP commits)
echo 'GET /health → 200 OK' > docs/api.md
git add docs/api.md
git commit -m "docs: sketch healthcheck endpoint"

cat > healthcheck.sh << 'EOF'
#!/bin/bash
curl -sf http://localhost:8080/health || exit 1
EOF
chmod +x healthcheck.sh
git add healthcheck.sh
git commit -m "feat: add healthcheck script"

git commit --allow-empty -m "wip: debugging"    # simulated WIP commit

# 3. Clean up history before PR (squash WIP commit)
git rebase -i HEAD~3
# In the editor: pick, pick, fixup (or squash)

# 4. Push and open PR
git push -u origin feature/PROJ-101-add-healthcheck
gh pr create --title "feat(ops): add healthcheck endpoint" \
  --body "Closes #101. Adds /health endpoint and shell probe."

# 5. Simulate review feedback
echo "# timeout 5s" >> healthcheck.sh
git add healthcheck.sh
git commit -m "fix: add timeout to healthcheck probe"
git push

# 6. Squash merge when approved
gh pr merge --squash --delete-branch

# 7. Verify main has one clean commit
git switch main && git pull
git log --oneline -5`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use rebase vs merge?",
        np: "Rebase vs merge कहिले प्रयोग गर्ने?",
        jp: "リベースとマージはいつ使うべきか？",
      },
      answer: {
        en: "Use **rebase** to update your feature branch with changes from main before merging — it keeps your branch's commit history clean and avoids noisy merge commits. Use **merge** (--no-ff) at the point of integrating a feature into main — it preserves the 'this was a feature branch' context in GitFlow. Never rebase commits that are already on the remote and that others might have pulled — this rewrites hashes and causes diverged history for everyone.",
        np: "Merge गर्नु अघि feature branch लाई main को changes सँग update गर्न **rebase** प्रयोग गर्नुहोस् — यसले branch को commit history clean राख्छ र noisy merge commit avoid गर्छ। Feature लाई main मा integrate गर्ने point मा **merge** (--no-ff) प्रयोग गर्नुहोस् — GitFlow मा 'यो feature branch थियो' context preserve गर्छ। Remote मा already भएका र अरूले pull गरेको हुन सक्ने commit कहिल्यै rebase नगर्नुहोस्।",
        jp: "マージする前にメインの変更でフィーチャーブランチを更新するために**リベース**を使います — ブランチのコミット履歴をきれいに保ち、ノイズの多いマージコミットを避けます。フィーチャーをメインに統合する時点で**マージ**（--no-ff）を使います — GitFlow では「これはフィーチャーブランチだった」というコンテキストを保持します。すでにリモートにあって他の人がプルした可能性があるコミットは絶対にリベースしないでください。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
    {
      question: {
        en: "What is trunk-based development and why do big tech companies use it?",
        np: "Trunk-based development के हो र ठूला tech company ले किन प्रयोग गर्छन्?",
        jp: "トランクベース開発とは何か、大手テック企業はなぜそれを使うのか？",
      },
      answer: {
        en: "Trunk-based development (TBD) means everyone commits directly to `main` (the 'trunk') or uses feature branches that live less than 2 days. It eliminates long-lived branches and the integration pain they cause. Google, Meta, and Netflix all practice TBD. The prerequisite is mature CI/CD (every commit triggers a full test suite in minutes) and feature flags (unfinished work ships behind a flag, not on a branch). TBD makes continuous deployment possible because main is always releasable.",
        np: "Trunk-based development (TBD) को अर्थ सबैले directly `main` (the 'trunk') मा commit गर्छन् वा 2 दिन भन्दा कम feature branch प्रयोग गर्छन्। यसले long-lived branch र तिनीहरूले ल्याउने integration pain हटाउँछ। Google, Meta, र Netflix सबैले TBD practice गर्छन्। Prerequisite: mature CI/CD र feature flag। TBD ले continuous deployment possible बनाउँछ किनकि main सधैं releasable छ।",
        jp: "トランクベース開発（TBD）は、全員が直接 `main`（「トランク」）にコミットするか、2 日未満しか存在しないフィーチャーブランチを使うことを意味します。長命のブランチとそれが引き起こす統合の苦労を排除します。Google・Meta・Netflix はすべて TBD を実践しています。前提条件は成熟した CI/CD（すべてのコミットが数分でフルテストスイートを起動する）とフィーチャーフラグ（未完成の作業はブランチではなくフラグの裏に出荷される）です。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
  ],
};
