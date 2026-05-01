import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Git hooks are scripts that Git executes automatically before or after events like commit, push, and merge. They are your last line of defense before bad code, bad commit messages, or secrets hit your repository. Unlike CI/CD which catches problems after the push, hooks catch problems on the developer's machine — instantly, before anything leaves the local repo.",
    np: "Git hook ती script हुन् जुन Git ले commit, push, र merge जस्ता event अघि वा पछि automatically execute गर्छ। यिनीहरू repository मा bad code, bad commit message, वा secret पुग्नु अघिको अन्तिम defense line हुन्। CI/CD ले push पछि problem catch गर्छ भने, hook ले developer को machine मा instantly problem catch गर्छ।",
    jp: "Git フックは、コミット・プッシュ・マージなどのイベントの前後に Git が自動的に実行するスクリプトです。悪いコード・悪いコミットメッセージ・シークレットがリポジトリに到達する前の最後の防衛線です。CI/CD がプッシュ後に問題を捕捉するのとは異なり、フックは開発者のマシンで即座に、ローカルリポジトリから何も出る前に問題を捕捉します。",
  } as const,
  o2: {
    en: "Today you learn the hook lifecycle, write practical pre-commit and commit-msg hooks from scratch, and set up the `pre-commit` framework and Husky so hooks are versioned in the repo and run consistently across every developer's machine.",
    np: "आज तपाईंले hook lifecycle सिक्नुहुनेछ, scratch बाट practical pre-commit र commit-msg hook लेख्नुहुनेछ, र `pre-commit` framework र Husky setup गर्नुहुनेछ ताकि hook repo मा versioned हुन् र हरेक developer को machine मा consistently run हुन्।",
    jp: "本日はフックのライフサイクルを学び、ゼロから実用的な pre-commit と commit-msg フックを作成し、`pre-commit` フレームワークと Husky をセットアップして、フックがリポジトリにバージョン管理され、すべての開発者のマシンで一貫して実行されるようにします。",
  } as const,
};

export const DEVOPS_DAY_18_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Hook types and where they live",
        np: "Hook type र ती कहाँ रहन्छन्",
        jp: "フックの種類と保存場所",
      },
      blocks: [
        { type: "diagram", id: "devops-git-hooks" },
        {
          type: "paragraph",
          text: {
            en: "Hooks live in `.git/hooks/` as plain executable shell scripts. Git ships sample scripts with a `.sample` suffix — remove the suffix to activate them. Because `.git/` is not tracked by Git, hooks are not shared with teammates by default. The `pre-commit` framework and Husky solve this by storing hook configuration in tracked files and symlinking into `.git/hooks/` on install.",
            np: "Hook ले `.git/hooks/` मा plain executable shell script को रूपमा रहन्छन्। Git ले `.sample` suffix सहित sample script ship गर्छ — activate गर्न suffix हटाउनुहोस्। `.git/` Git ले track गर्दैन भने, hook default मा teammate सँग share हुँदैन। `pre-commit` framework र Husky ले hook configuration tracked file मा store गरेर install मा `.git/hooks/` मा symlink गरेर यो solve गर्छन्।",
            jp: "フックは `.git/hooks/` にプレーンな実行可能シェルスクリプトとして存在します。Git は `.sample` サフィックス付きのサンプルスクリプトを同梱しています — 有効にするにはサフィックスを削除します。`.git/` は Git によって追跡されないため、フックはデフォルトではチームメートと共有されません。`pre-commit` フレームワークと Husky は、フック設定をトラッキング対象ファイルに保存し、インストール時に `.git/hooks/` にシンボリックリンクを作ることでこれを解決します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common Git hooks and their DevOps uses",
            np: "सामान्य Git hook र तिनीहरूको DevOps use",
            jp: "一般的な Git フックと DevOps での用途",
          },
          headers: [
            { en: "Hook", np: "Hook", jp: "フック" },
            { en: "When", np: "कहिले", jp: "タイミング" },
            { en: "Exit non-zero → ?", np: "Exit non-zero → ?", jp: "非ゼロで終了 → ?" },
            { en: "Common uses", np: "सामान्य use", jp: "一般的な用途" },
          ],
          rows: [
            [
              { en: "pre-commit", np: "pre-commit", jp: "pre-commit" },
              { en: "Before commit message is entered", np: "Commit message enter गर्नु अघि", jp: "コミットメッセージ入力前" },
              { en: "Aborts commit", np: "Commit abort", jp: "コミットを中断" },
              { en: "Lint code, run fast tests, check for secrets, format code", np: "Lint code, fast test run, secret check, code format", jp: "コードのリント・高速テスト・シークレットチェック・コードフォーマット" },
            ],
            [
              { en: "commit-msg", np: "commit-msg", jp: "commit-msg" },
              { en: "After commit message written, before commit", np: "Commit message लेखेपछि, commit अघि", jp: "コミットメッセージ記述後、コミット前" },
              { en: "Aborts commit", np: "Commit abort", jp: "コミットを中断" },
              { en: "Enforce Conventional Commits format, require ticket number", np: "Conventional Commits format enforce, ticket number require", jp: "Conventional Commits 形式の強制・チケット番号の要求" },
            ],
            [
              { en: "pre-push", np: "pre-push", jp: "pre-push" },
              { en: "Before `git push` sends data", np: "`git push` data पठाउनु अघि", jp: "`git push` がデータを送る前" },
              { en: "Aborts push", np: "Push abort", jp: "プッシュを中断" },
              { en: "Run full test suite, prevent pushing to main directly", np: "Full test suite run, directly main push prevent", jp: "フルテストスイートの実行・main への直接プッシュ防止" },
            ],
            [
              { en: "pre-receive (server)", np: "pre-receive (server)", jp: "pre-receive（サーバー）" },
              { en: "On server when push is received", np: "Push receive भएपछि server मा", jp: "プッシュ受信時にサーバーで" },
              { en: "Rejects the push", np: "Push reject", jp: "プッシュを拒否" },
              { en: "Enforce branch naming, block force-push to protected branches", np: "Branch naming enforce, protected branch मा force-push block", jp: "ブランチ命名の強制・保護ブランチへの強制プッシュのブロック" },
            ],
            [
              { en: "post-receive (server)", np: "post-receive (server)", jp: "post-receive（サーバー）" },
              { en: "On server after push completes", np: "Push complete भएपछि server मा", jp: "プッシュ完了後にサーバーで" },
              { en: "Cannot abort", np: "Abort गर्न सकिँदैन", jp: "中断できない" },
              { en: "Trigger CI, send notifications, update issue tracker", np: "CI trigger, notification पठाउनुहोस्, issue tracker update", jp: "CI のトリガー・通知の送信・課題トラッカーの更新" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Writing hooks from scratch",
        np: "Scratch बाट hook लेख्नुहोस्",
        jp: "ゼロからフックを書く",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "pre-commit hook: lint + secret detection",
            np: "pre-commit hook: lint + secret detection",
            jp: "pre-commit フック: リント + シークレット検出",
          },
          code: `#!/bin/bash
# .git/hooks/pre-commit
# Make executable: chmod +x .git/hooks/pre-commit
set -euo pipefail

echo "→ Running pre-commit checks..."

# 1. Check for debugging statements
STAGED=$(git diff --cached --name-only --diff-filter=d)

if echo "$STAGED" | grep -qE '\.(py|js|ts)$'; then
  if git diff --cached | grep -E '^\+.*(console\.log|debugger|import pdb|breakpoint\(\))'; then
    echo "✗ Debugging statement found in staged changes. Remove it."
    exit 1
  fi
fi

# 2. Detect common secret patterns (basic — use Gitleaks in production)
SECRET_PATTERN='(password|secret|api_key|token|private_key)\s*=\s*["\x27][^"\x27]{8,}'
if git diff --cached | grep -iE "$SECRET_PATTERN"; then
  echo "✗ Possible secret detected in staged changes."
  echo "  Use environment variables or a secrets manager instead."
  exit 1
fi

# 3. Run linter on staged Python files
PY_FILES=$(echo "$STAGED" | grep '\.py$' || true)
if [ -n "$PY_FILES" ]; then
  if command -v ruff &>/dev/null; then
    ruff check $PY_FILES || { echo "✗ Ruff lint failed."; exit 1; }
  elif command -v flake8 &>/dev/null; then
    flake8 $PY_FILES || { echo "✗ Flake8 lint failed."; exit 1; }
  fi
fi

# 4. Run linter on staged JS/TS files
JS_FILES=$(echo "$STAGED" | grep -E '\.(js|ts|jsx|tsx)$' || true)
if [ -n "$JS_FILES" ]; then
  if command -v eslint &>/dev/null; then
    npx eslint $JS_FILES || { echo "✗ ESLint failed."; exit 1; }
  fi
fi

echo "✓ pre-commit checks passed."`,
        },
        {
          type: "code",
          title: {
            en: "commit-msg hook: enforce Conventional Commits",
            np: "commit-msg hook: Conventional Commits enforce गर्नुहोस्",
            jp: "commit-msg フック: Conventional Commits の強制",
          },
          code: `#!/bin/bash
# .git/hooks/commit-msg
# Receives path to the commit message file as $1
set -euo pipefail

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

# Allow merge commits and revert commits through
if echo "$COMMIT_MSG" | grep -qE '^(Merge|Revert) '; then
  exit 0
fi

# Conventional Commits pattern
# type(optional-scope): subject
PATTERN='^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert)(\([a-z0-9-]+\))?: .{1,72}$'

if ! echo "$COMMIT_MSG" | head -1 | grep -qE "$PATTERN"; then
  echo "✗ Invalid commit message format."
  echo ""
  echo "  Expected: <type>(<scope>): <subject>"
  echo "  Types: feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert"
  echo "  Example: feat(auth): add OAuth2 login"
  echo "  Example: fix: handle null pointer in serializer"
  echo ""
  echo "  Got: $(head -1 "$COMMIT_MSG_FILE")"
  exit 1
fi

# Optional: require ticket number (e.g., PROJ-123 in scope or body)
# Uncomment to enable:
# if ! grep -qE '(PROJ-[0-9]+|#[0-9]+)' "$COMMIT_MSG_FILE"; then
#   echo "✗ Commit must reference a ticket (e.g., PROJ-123 or #42)"
#   exit 1
# fi

echo "✓ Commit message format valid."`,
        },
      ],
    },
    {
      title: {
        en: "The pre-commit framework — shareable hooks",
        np: "pre-commit framework — shareable hook",
        jp: "pre-commit フレームワーク — 共有可能なフック",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The `pre-commit` framework (pre-commit.com) manages hooks as versioned dependencies defined in `.pre-commit-config.yaml`. It installs each hook in an isolated virtual environment, runs them against staged files only, and makes it trivial to share the same hooks across a team. It also has a large ecosystem of ready-made hooks for common tools.",
            np: "` pre-commit` framework (pre-commit.com) ले hook `.pre-commit-config.yaml` मा defined versioned dependency को रूपमा manage गर्छ। यसले हरेक hook isolated virtual environment मा install गर्छ, staged file मात्र मा run गर्छ, र team भर same hook share गर्न trivial बनाउँछ।",
            jp: "`pre-commit` フレームワーク（pre-commit.com）は、`.pre-commit-config.yaml` で定義されたバージョン管理された依存関係としてフックを管理します。各フックを隔離された仮想環境にインストールし、ステージされたファイルにのみ実行し、チーム全体で同じフックを共有することを簡単にします。",
          },
        },
        {
          type: "code",
          title: {
            en: "pre-commit framework setup",
            np: "pre-commit framework setup",
            jp: "pre-commit フレームワークのセットアップ",
          },
          code: `# Install
pip install pre-commit
# or: brew install pre-commit

# .pre-commit-config.yaml (commit this file!)
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: trailing-whitespace       # remove trailing whitespace
      - id: end-of-file-fixer         # ensure files end with newline
      - id: check-yaml                # validate YAML syntax
      - id: check-json                # validate JSON syntax
      - id: check-merge-conflict      # detect unresolved merge conflicts
      - id: detect-private-key        # block private keys
      - id: no-commit-to-branch       # block direct commits to main
        args: ['--branch', 'main', '--branch', 'master']

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff                      # Python linter
      - id: ruff-format               # Python formatter

  - repo: https://github.com/pre-commit/mirrors-eslint
    rev: v8.57.0
    hooks:
      - id: eslint
        files: \.(js|ts|jsx|tsx)$
        additional_dependencies: ['eslint@8.57.0']

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks                  # comprehensive secret scanning
EOF

# Install hooks into .git/hooks/ (each developer runs this once)
pre-commit install
pre-commit install --hook-type commit-msg   # for commit-msg hooks too

# Run manually against all files (useful in CI or initial setup)
pre-commit run --all-files

# Run a specific hook
pre-commit run trailing-whitespace --all-files

# Update hooks to latest versions
pre-commit autoupdate`,
        },
        {
          type: "code",
          title: {
            en: "Husky — hooks for Node.js projects",
            np: "Husky — Node.js project का लागि hook",
            jp: "Husky — Node.js プロジェクト向けフック",
          },
          code: `# Husky manages hooks via package.json (Node.js ecosystem)
npm install --save-dev husky

# Initialize Husky
npx husky init   # creates .husky/ directory and adds prepare script

# Add a pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
npx lint-staged   # runs linters only on staged files
EOF

# Add a commit-msg hook
cat > .husky/commit-msg << 'EOF'
#!/bin/sh
npx --no -- commitlint --edit $1
EOF

# lint-staged config in package.json
# "lint-staged": {
#   "*.{js,ts,jsx,tsx}": ["eslint --fix", "prettier --write"],
#   "*.py": ["ruff check --fix", "ruff format"],
#   "*.{yaml,yml}": ["prettier --write"]
# }

# commitlint config — validates Conventional Commits
npm install --save-dev @commitlint/cli @commitlint/config-conventional
echo "export default { extends: ['@commitlint/config-conventional'] };" \
  > commitlint.config.js`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Set up hooks for a real project",
        np: "Hands-on: Real project का लागि hook setup गर्नुहोस्",
        jp: "ハンズオン: 実際のプロジェクトにフックをセットアップする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Full hook setup from scratch",
            np: "Scratch बाट full hook setup",
            jp: "ゼロからの完全なフックセットアップ",
          },
          code: `# Scenario: Python project, needs lint + secret check + commit format

# 1. Install pre-commit
pip install pre-commit

# 2. Create config
cat > .pre-commit-config.yaml << 'EOF'
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    rev: v4.5.0
    hooks:
      - id: detect-private-key
      - id: check-yaml
      - id: no-commit-to-branch
        args: ['--branch', 'main']

  - repo: https://github.com/astral-sh/ruff-pre-commit
    rev: v0.3.0
    hooks:
      - id: ruff
      - id: ruff-format

  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.18.2
    hooks:
      - id: gitleaks
EOF

# 3. Create commit-msg hook manually (pre-commit doesn't do this by default)
mkdir -p .git/hooks
cat > .git/hooks/commit-msg << 'HOOK'
#!/bin/bash
MSG=$(cat "$1")
PATTERN='^(feat|fix|docs|chore|ci|refactor|test|perf)(\([a-z-]+\))?: .{1,72}'
if ! echo "$MSG" | head -1 | grep -qE "$PATTERN"; then
  echo "✗ Bad commit message. Use: type(scope): subject"
  exit 1
fi
HOOK
chmod +x .git/hooks/commit-msg

# 4. Install pre-commit hooks
pre-commit install

# 5. Test: try to commit a bad message
git commit --allow-empty -m "bad message"    # should fail

# 6. Test: try to commit a hardcoded secret
echo 'API_KEY="sk-abc123secret"' > test_secret.py
git add test_secret.py
git commit -m "fix: test"   # gitleaks should catch this

# 7. Make a proper commit
rm test_secret.py
git commit -m "chore: set up pre-commit hooks for code quality"

# 8. Verify hooks are installed
ls -la .git/hooks/ | grep -v sample`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Can developers bypass hooks? How do I prevent it?",
        np: "Developer ले hook bypass गर्न सक्छन्? यो कसरी prevent गर्ने?",
        jp: "開発者はフックをバイパスできるか？どのように防ぐか？",
      },
      answer: {
        en: "Yes — `git commit --no-verify` skips all client-side hooks. This is why client-side hooks are a convenience layer, not a security control. Your CI/CD pipeline must enforce the same checks independently. Treat hooks as fast feedback for developers, not as the authoritative gate. Server-side hooks (`pre-receive`) are harder to bypass (require access to the server), but for GitHub/GitLab, branch protection rules + required CI status checks are the server-side equivalent.",
        np: "हो — `git commit --no-verify` ले सबै client-side hook skip गर्छ। त्यसैले client-side hook convenience layer हो, security control होइन। CI/CD pipeline ले independently same check enforce गर्नुपर्छ। Hook लाई developer को fast feedback को रूपमा treat गर्नुहोस्, authoritative gate को रूपमा होइन।",
        jp: "はい — `git commit --no-verify` はすべてのクライアントサイドフックをスキップします。これがクライアントサイドフックがセキュリティ制御ではなく便利さの層である理由です。CI/CD パイプラインは同じチェックを独立して強制する必要があります。フックを開発者への高速フィードバックとして扱い、権威あるゲートとしてではなく扱ってください。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
    {
      question: {
        en: "How do I share hooks across a team without pre-commit or Husky?",
        np: "pre-commit वा Husky बिना team भर hook share कसरी गर्ने?",
        jp: "pre-commit や Husky なしでチーム全体にフックを共有する方法は？",
      },
      answer: {
        en: "Store your hook scripts in a tracked directory (e.g., `scripts/hooks/`) and configure Git to use it as the hooks directory: `git config core.hooksPath scripts/hooks`. Add this command to your project's setup instructions or a `Makefile` target (`make setup`). Unlike `.git/hooks/`, the `scripts/hooks/` directory is committed and shared with everyone who clones the repo. Developers just need to run the setup step once.",
        np: "Hook script tracked directory (जस्तै `scripts/hooks/`) मा store गरेर Git लाई hooks directory को रूपमा configure गर्नुहोस्: `git config core.hooksPath scripts/hooks`। यो command project को setup instruction वा `Makefile` target (`make setup`) मा थप्नुहोस्। `.git/hooks/` भिन्न, `scripts/hooks/` directory committed र repo clone गर्ने सबैसँग shared हुन्छ।",
        jp: "フックスクリプトをトラッキング対象のディレクトリ（例：`scripts/hooks/`）に保存し、Git がそれをフックディレクトリとして使うように設定します：`git config core.hooksPath scripts/hooks`。このコマンドをプロジェクトのセットアップ手順や `Makefile` ターゲット（`make setup`）に追加します。`.git/hooks/` とは異なり、`scripts/hooks/` ディレクトリはコミットされ、リポジトリをクローンした全員と共有されます。",
      },
      tag: { en: "git", np: "git", jp: "Git" },
    },
  ],
};
