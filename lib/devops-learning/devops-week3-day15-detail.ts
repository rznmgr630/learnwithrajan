import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Git is not optional for DevOps — it is the single source of truth for every pipeline, infrastructure definition, configuration file, and deployment script you will ever manage. The difference between a DevOps engineer and a developer using Git is that you also version your infrastructure: Terraform, Kubernetes manifests, Ansible playbooks, and Dockerfiles all live in Git repositories.",
    np: "Git DevOps का लागि optional होइन — यो हरेक pipeline, infrastructure definition, configuration file, र deployment script को single source of truth हो। DevOps engineer र developer को Git प्रयोगमा फरक यो हो कि तपाईं infrastructure पनि version गर्नुहुन्छ: Terraform, Kubernetes manifest, Ansible playbook, र Dockerfile सबै Git repository मा रहन्छन्।",
    jp: "Git は DevOps においてオプションではありません — あなたが管理するすべてのパイプライン・インフラ定義・設定ファイル・デプロイスクリプトの唯一の信頼できる情報源です。DevOps エンジニアと開発者の Git 使用の違いは、インフラもバージョン管理することです：Terraform・Kubernetes マニフェスト・Ansible プレイブック・Dockerfile はすべて Git リポジトリに保存されます。",
  } as const,
  o2: {
    en: "Today you build a solid mental model of Git's three areas (working tree, staging area, repository), understand how commits form a DAG of history, and learn the core commands that every pipeline and automation script depends on.",
    np: "आज तपाईंले Git को तीन area (working tree, staging area, repository) को solid mental model बनाउनुहुनेछ, commit ले history को DAG कसरी form गर्छ बुझ्नुहुनेछ, र हरेक pipeline र automation script depend गर्ने core command सिक्नुहुनेछ।",
    jp: "本日は Git の 3 つの領域（作業ツリー・ステージングエリア・リポジトリ）のしっかりしたメンタルモデルを構築し、コミットが履歴の DAG を形成する仕組みを理解し、すべてのパイプラインと自動化スクリプトが依存するコアコマンドを学びます。",
  } as const,
};

export const DEVOPS_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Git's three areas — the mental model that explains everything",
        np: "Git का तीन area — सबथोक explain गर्ने mental model",
        jp: "Git の 3 つの領域 — すべてを説明するメンタルモデル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Almost every Git command confusion disappears once you internalize the three areas. The **working tree** is what you see in your editor — files on disk, possibly modified. The **staging area** (index) is a draft of your next commit — you explicitly choose which changes to include with `git add`. The **repository** (.git directory) is the permanent record of all commits. `git add` moves changes from working tree → staging; `git commit` moves them from staging → repository.",
            np: "Git को तीन area internalize गरेपछि लगभग हरेक Git command को confusion हराउँछ। **Working tree** तपाईंको editor मा देखिने चीज हो — disk मा file, सम्भवतः modified। **Staging area** (index) तपाईंको अर्को commit को draft हो — `git add` ले explicitly कुन changes समावेश गर्ने choose गर्नुहुन्छ। **Repository** (.git directory) सबै commit को permanent record हो।",
            jp: "3 つの領域を内面化すれば、ほぼすべての Git コマンドの混乱が消えます。**作業ツリー**はエディターで見るもの — ディスク上のファイル、変更されている可能性あり。**ステージングエリア**（インデックス）は次のコミットの下書き — `git add` で明示的にどの変更を含めるか選択します。**リポジトリ**（.git ディレクトリ）はすべてのコミットの永続的な記録です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Core workflow: init → add → commit → push",
            np: "Core workflow: init → add → commit → push",
            jp: "コアワークフロー: init → add → commit → push",
          },
          code: `# Initialize a new repository
git init my-project
cd my-project

# Configure identity (required for commits)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"
git config --global init.defaultBranch main   # set default branch name

# Check the state of the three areas
git status                    # most important command — run it constantly

# Stage specific files (working tree → staging)
git add README.md             # stage one file
git add src/                  # stage a directory
git add -p                    # interactive: choose hunks to stage (very useful)
git add .                     # stage everything (use with care)

# Unstage (staging → working tree, file unchanged)
git restore --staged README.md

# Commit (staging → repository)
git commit -m "feat: add README with project overview"
git commit --amend            # modify the last commit (only if not pushed)

# Connect to a remote and push
git remote add origin git@github.com:you/my-project.git
git push -u origin main       # -u sets upstream; future pushes just: git push

# Clone an existing repository
git clone git@github.com:org/repo.git
git clone --depth 1 git@github.com:org/repo.git  # shallow clone (faster in CI)`,
        },
        {
          type: "table",
          caption: {
            en: "git add vs git restore vs git reset — undoing things",
            np: "git add vs git restore vs git reset — things undo गर्नुहोस्",
            jp: "git add・git restore・git reset — 元に戻す方法",
          },
          headers: [
            { en: "Goal", np: "Goal", jp: "目標" },
            { en: "Command", np: "Command", jp: "コマンド" },
            { en: "Safe?", np: "Safe?", jp: "安全?" },
          ],
          rows: [
            [
              { en: "Discard working tree changes to a file", np: "File को working tree changes discard गर्नुहोस्", jp: "ファイルの作業ツリーの変更を破棄する" },
              { en: "`git restore <file>`", np: "`git restore <file>`", jp: "`git restore <file>`" },
              { en: "Destructive — changes lost", np: "Destructive — changes lost", jp: "破壊的 — 変更は失われる" },
            ],
            [
              { en: "Unstage a file (keep working tree change)", np: "File unstage गर्नुहोस् (working tree change राख्नुहोस्)", jp: "ファイルをアンステージ（作業ツリーの変更は保持）" },
              { en: "`git restore --staged <file>`", np: "`git restore --staged <file>`", jp: "`git restore --staged <file>`" },
              { en: "Safe", np: "Safe", jp: "安全" },
            ],
            [
              { en: "Undo last commit, keep changes staged", np: "Last commit undo, changes staged राख्नुहोस्", jp: "最後のコミットを元に戻し、変更はステージに保持" },
              { en: "`git reset --soft HEAD~1`", np: "`git reset --soft HEAD~1`", jp: "`git reset --soft HEAD~1`" },
              { en: "Safe", np: "Safe", jp: "安全" },
            ],
            [
              { en: "Undo last commit, keep changes unstaged", np: "Last commit undo, changes unstaged राख्नुहोस्", jp: "最後のコミットを元に戻し、変更はアンステージに保持" },
              { en: "`git reset --mixed HEAD~1`", np: "`git reset --mixed HEAD~1`", jp: "`git reset --mixed HEAD~1`" },
              { en: "Safe", np: "Safe", jp: "安全" },
            ],
            [
              { en: "Undo last commit, discard all changes", np: "Last commit undo, सबै changes discard गर्नुहोस्", jp: "最後のコミットを元に戻し、すべての変更を破棄" },
              { en: "`git reset --hard HEAD~1`", np: "`git reset --hard HEAD~1`", jp: "`git reset --hard HEAD~1`" },
              { en: "Destructive — use with care", np: "Destructive — सावधानी", jp: "破壊的 — 慎重に使用" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Inspecting history — log, diff, and show",
        np: "History निरीक्षण — log, diff, र show",
        jp: "履歴の検査 — log・diff・show",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reading Git history like a detective",
            np: "Detective जस्तै Git history पढ्नुहोस्",
            jp: "探偵のように Git 履歴を読む",
          },
          code: `# View commit history
git log                       # full log
git log --oneline             # compact: hash + message
git log --oneline --graph --all  # visual branch graph
git log --author="Alice"      # filter by author
git log --since="2 weeks ago" # filter by date
git log -- path/to/file       # commits that touched a specific file
git log -p -- path/to/file    # with the actual diff for each commit

# Show what changed
git diff                      # working tree vs staging (unstaged changes)
git diff --staged             # staging vs last commit (what will be committed)
git diff HEAD                 # working tree vs last commit (all changes)
git diff main..feature        # compare two branches
git diff abc1234..def5678     # compare two commits by hash

# Inspect a specific commit
git show abc1234              # commit message + full diff
git show abc1234:path/file    # show file content at that commit
git show HEAD~2               # two commits before current

# Find who changed a line (blame)
git blame src/app.py          # show author + commit for every line
git blame -L 50,70 src/app.py # only lines 50–70

# Search commit history
git log --grep="fix.*database" # commits where message matches regex
git log -S "function broken"   # commits that added/removed this string (pickaxe)`,
        },
      ],
    },
    {
      title: {
        en: ".gitignore and repository hygiene",
        np: ".gitignore र repository hygiene",
        jp: ".gitignore とリポジトリの衛生管理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`.gitignore` tells Git which files to never track. What you commit to a repository is permanent (even after deletion, history is forever unless force-rewritten). Never commit secrets, credentials, or large binary files. Use `.gitignore` patterns aggressively, and add a global ignore file for editor/OS noise that applies across all your repos.",
            np: "`.gitignore` ले Git लाई कुन file कहिल्यै track नगर्ने भनेर बताउँछ। Repository मा commit गरेको चीज permanent छ (deletion पछि पनि, history forever छ जबसम्म force-rewrite नगरिए)। Secret, credential, वा large binary file कहिल्यै commit नगर्नुहोस्।",
            jp: "`.gitignore` は Git にどのファイルを絶対に追跡しないかを伝えます。リポジトリにコミットしたものは永続的です（削除後でも、強制書き換えしない限り履歴は永遠に残ります）。シークレット・認証情報・大きなバイナリファイルは絶対にコミットしないでください。",
          },
        },
        {
          type: "code",
          title: {
            en: ".gitignore patterns and global config",
            np: ".gitignore pattern र global config",
            jp: ".gitignore パターンとグローバル設定",
          },
          code: `# .gitignore pattern syntax
*.log             # all .log files anywhere in the repo
logs/             # the logs/ directory and everything inside
!logs/keep.log    # exception: track this specific log file
/build            # only the root-level build/ dir (not src/build/)
**/*.tfstate      # all .tfstate files at any depth (Terraform state)
.env              # environment files with secrets
.env.*            # .env.local, .env.production, etc.
node_modules/     # npm dependencies (never commit these)
__pycache__/      # Python bytecode
.DS_Store         # macOS metadata noise
*.pyc

# Global gitignore (applies to ALL your repos, not tracked)
git config --global core.excludesFile ~/.gitignore_global
cat >> ~/.gitignore_global << 'EOF'
.DS_Store
Thumbs.db
.idea/
.vscode/
*.swp
*~
EOF

# If you accidentally committed a file, remove it from tracking
git rm --cached .env          # stop tracking but keep the file on disk
echo ".env" >> .gitignore
git commit -m "chore: stop tracking .env file"

# Check what is ignored
git status --ignored           # show ignored files
git check-ignore -v .env       # which .gitignore rule is matching

# Secrets already committed? Rotate them immediately — history rewrite alone is not enough
# Use git-filter-repo (not filter-branch) to scrub history if needed
pip install git-filter-repo
git filter-repo --path .env --invert-paths   # remove .env from all history`,
        },
      ],
    },
    {
      title: {
        en: "Remote workflows — fetch, pull, and push",
        np: "Remote workflow — fetch, pull, र push",
        jp: "リモートワークフロー — fetch・pull・push",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Working with remotes",
            np: "Remote सँग काम गर्नुहोस्",
            jp: "リモートを操作する",
          },
          code: `# List remotes
git remote -v                 # show all remotes with URLs

# Fetch vs pull — the most misunderstood distinction
git fetch origin              # download new commits, DO NOT merge into local branch
git fetch --all               # fetch from all remotes
git pull                      # fetch + merge (or rebase, if configured)
git pull --rebase             # fetch + rebase (preferred in most teams)
git pull --ff-only            # only fast-forward, abort if a merge is needed

# Push
git push                      # push current branch to its upstream
git push origin feature/login # push a specific branch
git push --force-with-lease   # safer force push (fails if remote has new commits)
git push --tags               # push annotated tags

# Track a remote branch locally
git checkout -b feature/login origin/feature/login
git switch -c feature/login --track origin/feature/login   # modern syntax

# Prune stale remote-tracking branches
git fetch --prune             # remove refs to remote branches that no longer exist
git remote prune origin       # explicit prune

# Configure pull behavior globally
git config --global pull.rebase true   # always rebase on pull (recommended)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`git pull --rebase` vs `git pull`** — plain `pull` creates a merge commit ('Merge branch main into feature/x') every time your branch is behind the remote. Over a long-lived branch this litters the history. `pull --rebase` re-applies your local commits on top of the updated remote branch, keeping history linear. Set it as the default: `git config --global pull.rebase true`.",
              np: "**`git pull --rebase` vs `git pull`** — plain `pull` ले हर पटक branch remote भन्दा पछाडि छ भने merge commit ('Merge branch main into feature/x') create गर्छ। Long-lived branch मा यसले history मा clutter थप्छ। `pull --rebase` ले updated remote branch माथि local commit re-apply गर्छ, history linear राख्छ।",
              jp: "**`git pull --rebase` 対 `git pull`** — 通常の `pull` はブランチがリモートより遅れるたびにマージコミット（'Merge branch main into feature/x'）を作成します。長期ブランチではこれが履歴を散らかします。`pull --rebase` は更新されたリモートブランチの上にローカルコミットを再適用し、履歴を線形に保ちます。デフォルトとして設定：`git config --global pull.rebase true`。",
            },
            {
              en: "**`--force-with-lease` not `--force`** — `git push --force` will overwrite whatever is on the remote, potentially destroying a teammate's commits if they pushed between your fetch and push. `--force-with-lease` checks that the remote ref hasn't changed since your last fetch and aborts if it has.",
              np: "**`--force-with-lease` not `--force`** — `git push --force` ले remote मा जे छ override गर्छ, तपाईंको fetch र push बीचमा teammate ले push गरे उनको commit destroy हुन सक्छ। `--force-with-lease` ले last fetch देखि remote ref बदलिएको छ कि छैन check गर्छ।",
              jp: "**`--force` ではなく `--force-with-lease`** — `git push --force` はリモートにあるものを上書きし、フェッチとプッシュの間にチームメートがプッシュした場合、そのコミットを破壊する可能性があります。`--force-with-lease` は最後のフェッチ以降リモートの参照が変わっていないことを確認し、変わっていれば中断します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Init a repo, make commits, and push to GitHub",
        np: "Hands-on: Repo init गर्नुहोस्, commit गर्नुहोस्, र GitHub मा push गर्नुहोस्",
        jp: "ハンズオン: リポジトリの初期化・コミット・GitHub へのプッシュ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Full first-repo walkthrough",
            np: "पूरा first-repo walkthrough",
            jp: "最初のリポジトリの完全なウォークスルー",
          },
          code: `# 1. Create and initialize
mkdir devops-practice && cd devops-practice
git init
git config user.name "Your Name"
git config user.email "you@example.com"

# 2. Create a .gitignore immediately (before anything else)
cat > .gitignore << 'EOF'
.env
*.log
__pycache__/
node_modules/
.DS_Store
EOF

# 3. Create a README
echo "# DevOps Practice" > README.md

# 4. Stage and commit
git add .gitignore README.md
git status                    # verify only these two files are staged
git commit -m "chore: initial commit with README and gitignore"

# 5. Create a script, stage it, inspect the diff before committing
cat > deploy.sh << 'EOF'
#!/bin/bash
set -euo pipefail
echo "Deploying version $1..."
EOF
chmod +x deploy.sh

git add deploy.sh
git diff --staged             # review what you are about to commit
git commit -m "feat: add deploy script skeleton"

# 6. View the history
git log --oneline

# 7. Connect to GitHub (create a repo on github.com first)
git remote add origin git@github.com:YOU/devops-practice.git
git branch -M main
git push -u origin main

# 8. Verify
git log --oneline --graph --all`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `git fetch` and `git pull`?",
        np: "`git fetch` र `git pull` बीच के फरक छ?",
        jp: "`git fetch` と `git pull` の違いは何か？",
      },
      answer: {
        en: "`git fetch` downloads commits, branches, and tags from the remote but does NOT change your working tree or local branches. You get to inspect what changed before integrating. `git pull` is `git fetch` + `git merge` (or rebase) — it automatically merges the remote changes into your current branch. In CI/CD pipelines and automation, always prefer `git fetch` followed by an explicit merge/rebase so you have control. In interactive work, `git pull --rebase` is convenient.",
        np: "`git fetch` ले remote बाट commit, branch, र tag download गर्छ तर working tree वा local branch CHANGE गर्दैन। Integrate गर्नु अघि के बदलियो inspect गर्न पाउनुहुन्छ। `git pull` = `git fetch` + `git merge` (वा rebase) — यसले automatically remote changes current branch मा merge गर्छ। CI/CD pipeline र automation मा, control को लागि `git fetch` followed by explicit merge/rebase prefer गर्नुहोस्।",
        jp: "`git fetch` はリモートからコミット・ブランチ・タグをダウンロードしますが、作業ツリーやローカルブランチは変更しません。統合する前に何が変わったか検査できます。`git pull` は `git fetch` + `git merge`（またはリベース）で、リモートの変更を自動的に現在のブランチにマージします。CI/CD パイプラインと自動化では、制御のために `git fetch` の後に明示的なマージ/リベースを優先してください。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
    {
      question: {
        en: "I accidentally committed a secret — what do I do?",
        np: "मैले गल्तीले secret commit गरें — के गर्ने?",
        jp: "誤ってシークレットをコミットしてしまった — どうすればいいか？",
      },
      answer: {
        en: "**Step 1: Rotate the secret immediately** — assume it is compromised. History rewriting does not help if someone already fetched or GitHub/GitLab cached it. Step 2: If the commit is not yet pushed, amend it: `git commit --amend`. Step 3: If it is already pushed, revoke access → use `git-filter-repo` to scrub history → force-push → contact your platform (GitHub has a secret-scanning feature that may have already cached it). Step 4: Add the pattern to `.gitignore` to prevent recurrence.",
        np: "**Step 1: Secret तुरुन्त rotate गर्नुहोस्** — compromised मान्नुहोस्। History rewrite ले मद्दत गर्दैन यदि कसैले already fetch गरेको छ वा GitHub/GitLab ले cache गरेको छ। Step 2: Commit अझैं push नभएको छ भने, amend: `git commit --amend`। Step 3: Already pushed छ भने, access revoke → `git-filter-repo` ले history scrub → force-push।",
        jp: "**ステップ 1：シークレットを直ちにローテーション** — 漏洩したと仮定してください。誰かがすでにフェッチしたか、GitHub/GitLab がキャッシュした場合、履歴の書き換えは助けになりません。ステップ 2：コミットがまだプッシュされていない場合、修正：`git commit --amend`。ステップ 3：すでにプッシュされている場合、アクセスを取り消す → `git-filter-repo` で履歴をスクラブ → 強制プッシュ → プラットフォームに連絡（GitHub のシークレットスキャン機能がすでにキャッシュしている可能性あり）。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
      callout: {
        en: "Rule: rotate first, clean history second. A rotated secret is safe even if it's in git history.",
        np: "Rule: पहिले rotate, पछि history clean। Rotated secret git history मा भए पनि safe छ।",
        jp: "ルール：まずローテーション、次に履歴のクリーン。ローテーションされたシークレットは git 履歴にあっても安全です。",
      },
    },
    {
      question: {
        en: "What makes a good commit message?",
        np: "राम्रो commit message कसरी लेख्ने?",
        jp: "良いコミットメッセージとはどのようなものか？",
      },
      answer: {
        en: "The Conventional Commits standard is the most widely adopted: `<type>(<scope>): <subject>`. Types: `feat` (new feature), `fix` (bug fix), `chore` (maintenance), `ci` (CI/CD change), `docs`, `refactor`, `test`. Examples: `feat(auth): add OAuth2 login flow`, `fix(deploy): handle missing env var in entrypoint`. The subject is imperative mood, no period, ≤72 chars. The body (optional) explains WHY, not what. Good commit messages make `git log --oneline` readable as a changelog.",
        np: "Conventional Commits standard सबभन्दा widely adopted छ: `<type>(<scope>): <subject>`। Types: `feat` (new feature), `fix` (bug fix), `chore` (maintenance), `ci` (CI/CD change), `docs`, `refactor`, `test`। Subject imperative mood, no period, ≤72 chars। Body (optional) ले WHY explain गर्छ। राम्रो commit message ले `git log --oneline` लाई changelog को रूपमा readable बनाउँछ।",
        jp: "Conventional Commits 標準が最も広く採用されています：`<type>(<scope>): <subject>`。タイプ：`feat`（新機能）・`fix`（バグ修正）・`chore`（メンテナンス）・`ci`（CI/CD の変更）・`docs`・`refactor`・`test`。主題は命令法、ピリオドなし、72 文字以内。本文（オプション）は何をしたかではなくなぜを説明します。良いコミットメッセージは `git log --oneline` をチェンジログとして読めるようにします。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
  ],
};
