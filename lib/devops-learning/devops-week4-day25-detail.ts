import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Day 6 covered Bash fundamentals. This day goes deeper into the patterns that separate amateur scripts from the ones that run reliably in production CI/CD: argument parsing, parallel execution, signal trapping, heredocs, and advanced string manipulation. These are the patterns you will copy into every serious Bash automation you write.",
    np: "Day 6 ले Bash fundamentals cover गर्यो। यो दिन ती pattern मा गहिरिन्छ जसले amateur script र production CI/CD मा reliably run हुने script बीच फरक छुट्याउँछ: argument parsing, parallel execution, signal trapping, heredoc, र advanced string manipulation।",
    jp: "Day 6 では Bash の基礎を扱いました。この日はより深く、アマチュアのスクリプトと本番 CI/CD で信頼性高く動くスクリプトを分けるパターンに踏み込みます。引数解析・並列実行・シグナルトラップ・ヒアドキュメント・高度な文字列操作。これらはあなたが書くすべての本格的な Bash 自動化にコピーするパターンです。",
  } as const,
  o2: {
    en: "By the end you will have a script template you can actually reuse: it parses named flags, validates input, cleans up on exit, runs tasks in parallel, and logs everything with timestamps — the skeleton of a real deploy or maintenance script.",
    np: "अन्तसम्म तपाईंसँग actually reuse गर्न सकिने script template हुनेछ: यसले named flag parse गर्छ, input validate गर्छ, exit मा cleanup गर्छ, task parallel मा run गर्छ, र timestamp सहित सबै log गर्छ — real deploy वा maintenance script को skeleton।",
    jp: "最終的には実際に再利用できるスクリプトテンプレートが手元に残ります。名前付きフラグを解析し・入力を検証し・終了時にクリーンアップし・タスクを並列実行し・タイムスタンプ付きですべてをログに記録します。本物のデプロイまたはメンテナンススクリプトの骨格です。",
  } as const,
};

export const DEVOPS_DAY_25_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Argument parsing with getopts and long flags",
        np: "getopts र long flag सहित argument parsing",
        jp: "getopts と長いフラグによる引数解析",
      },
      blocks: [
        { type: "diagram", id: "devops-bash-script-flow" },
        {
          type: "paragraph",
          text: {
            en: "Positional arguments (`$1`, `$2`) are fine for two-argument scripts. Anything more complex deserves proper flag parsing. `getopts` is POSIX and handles short flags (`-e production`). For long flags (`--environment production`), use a `while/case` loop — the standard pattern used by most DevOps tools.",
            np: "Positional argument (`$1`, `$2`) दुई argument script का लागि ठीक छ। थप complex कुराले proper flag parsing deserve गर्छ। `getopts` POSIX हो र short flag (`-e production`) handle गर्छ। Long flag (`--environment production`) का लागि, `while/case` loop प्रयोग गर्नुहोस् — अधिकांश DevOps tool ले प्रयोग गर्ने standard pattern।",
            jp: "位置引数（`$1`・`$2`）は 2 引数のスクリプトには問題ありません。それ以上複雑なものには適切なフラグ解析が必要です。`getopts` は POSIX でショートフラグ（`-e production`）を処理します。ロングフラグ（`--environment production`）には `while/case` ループを使います。ほとんどの DevOps ツールで使われる標準パターンです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Long flag parsing — the production pattern",
            np: "Long flag parsing — production pattern",
            jp: "ロングフラグ解析 — 本番パターン",
          },
          code: `#!/bin/bash
set -euo pipefail

# --- Defaults ---
ENVIRONMENT="production"
VERSION=""
DRY_RUN=false
VERBOSE=false

# --- Usage ---
usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] --version VERSION

Options:
  -e, --environment  ENV   Target environment (default: production)
  -v, --version      VER   Version to deploy (required)
  -n, --dry-run            Print commands but do not execute
      --verbose            Enable verbose output
  -h, --help               Show this help

Examples:
  $(basename "$0") --version 1.4.2
  $(basename "$0") --version 1.4.2 --environment staging --dry-run
EOF
}

# --- Parse flags ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    -e|--environment) ENVIRONMENT="$2"; shift 2 ;;
    -v|--version)     VERSION="$2";     shift 2 ;;
    -n|--dry-run)     DRY_RUN=true;     shift   ;;
    --verbose)        VERBOSE=true;     shift   ;;
    -h|--help)        usage; exit 0             ;;
    --)               shift; break              ;;    # end of flags
    -*)  echo "Unknown option: $1" >&2; usage; exit 1 ;;
    *)   break                                  ;;    # positional args start
  esac
done

# --- Validation ---
[[ -z "$VERSION" ]] && { echo "ERROR: --version is required" >&2; usage; exit 1; }
[[ "$ENVIRONMENT" =~ ^(production|staging|dev)$ ]] || {
  echo "ERROR: invalid environment '$ENVIRONMENT'" >&2; exit 1
}

# --- Conditional execution wrapper ---
run() {
  if [[ "$DRY_RUN" == true ]]; then
    echo "[DRY RUN] $*"
  else
    "$@"
  fi
}

[[ "$VERBOSE" == true ]] && set -x

echo "Deploying \${VERSION} to \${ENVIRONMENT}..."
run docker pull "myapp:\${VERSION}"
run docker tag  "myapp:\${VERSION}" "myapp:current-\${ENVIRONMENT}"`,
        },
      ],
    },
    {
      title: {
        en: "Trap — cleanup on any exit",
        np: "Trap — कुनै पनि exit मा cleanup",
        jp: "Trap — どんな終了でもクリーンアップ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Using trap for reliable cleanup",
            np: "Reliable cleanup का लागि trap प्रयोग गर्नुहोस्",
            jp: "確実なクリーンアップのための trap の使い方",
          },
          code: `#!/bin/bash
set -euo pipefail

LOCKFILE="/var/run/deploy.lock"
TMPDIR=""

cleanup() {
  local exit_code=$?
  echo "Cleaning up..." >&2

  # Remove lock file
  rm -f "$LOCKFILE"

  # Remove temp directory if it was created
  [[ -n "$TMPDIR" && -d "$TMPDIR" ]] && rm -rf "$TMPDIR"

  # Notify on failure
  if [[ $exit_code -ne 0 ]]; then
    echo "Deploy FAILED with exit code $exit_code" >&2
    # Could call notify_deploy.py here
  fi

  exit $exit_code
}

# Register cleanup for ANY exit: normal, error, or signal
trap cleanup EXIT

# Also handle specific signals explicitly
trap 'echo "Interrupted" >&2; exit 130' INT TERM

# --- Acquire a lock to prevent concurrent deploys ---
if ! mkdir "$LOCKFILE" 2>/dev/null; then
  echo "ERROR: Another deploy is already running (lock: $LOCKFILE)" >&2
  exit 1
fi

# --- Create temp workspace ---
TMPDIR=$(mktemp -d)
echo "Working in $TMPDIR"

# --- Do the work ---
# If any command fails, set -e triggers exit, trap cleanup runs automatically
curl -fsSL "https://releases.example.com/myapp-\${VERSION}.tar.gz" \
  -o "$TMPDIR/release.tar.gz"

tar -xzf "$TMPDIR/release.tar.gz" -C "$TMPDIR"

# Validate extracted contents
[[ -f "$TMPDIR/myapp/bin/server" ]] || {
  echo "ERROR: Binary not found in release archive" >&2
  exit 1
}

echo "Deploy completed successfully"
# cleanup runs automatically when the script exits`,
        },
      ],
    },
    {
      title: {
        en: "Parallel execution — run tasks concurrently",
        np: "Parallel execution — task concurrently run गर्नुहोस्",
        jp: "並列実行 — タスクを並行して実行する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Background jobs, wait, and parallel deployment",
            np: "Background job, wait, र parallel deployment",
            jp: "バックグラウンドジョブ・wait・並列デプロイ",
          },
          code: `#!/bin/bash
set -euo pipefail

SERVERS=("web1.internal" "web2.internal" "web3.internal")
VERSION="\${1:?Usage: \$0 <version>}"
FAILED=()

deploy_to_server() {
  local server="\$1"
  local log="/tmp/deploy-\${server}.log"

  echo "[\${server}] Starting deploy..." >&2
  if ssh "\${server}" "sudo /usr/local/bin/deploy.sh \${VERSION}" > "\${log}" 2>&1; then
    echo "[\${server}] SUCCESS" >&2
  else
    echo "[\${server}] FAILED (see \${log})" >&2
    return 1
  fi
}

# --- Parallel: deploy to all servers at once ---
declare -A pids   # associative array: server → PID

for server in "\${SERVERS[@]}"; do
  deploy_to_server "\${server}" &
  pids["\${server}"]=\$!
done

# Wait for all background jobs and collect failures
for server in "\${SERVERS[@]}"; do
  if ! wait "\${pids[\$server]}"; then
    FAILED+=("\${server}")
  fi
done

if [[ \${#FAILED[@]} -gt 0 ]]; then
  echo "FAILED on: \${FAILED[*]}" >&2
  exit 1
fi
echo "All \${#SERVERS[@]} servers deployed successfully"

# --- Throttled parallel: max N concurrent jobs ---
run_parallel() {
  local max_jobs="\$1"; shift
  local commands=("\$@")
  local running=0

  for cmd in "\${commands[@]}"; do
    eval "\${cmd}" &
    (( running++ ))
    if [[ \$running -ge \$max_jobs ]]; then
      wait -n 2>/dev/null || wait    # wait for any one job to finish
      (( running-- ))
    fi
  done
  wait    # wait for remaining jobs
}

# Health check all servers with at most 5 parallel checks
CHECKS=()
for server in "\${SERVERS[@]}"; do
  CHECKS+=("curl -sf http://\${server}/health")
done
run_parallel 5 "\${CHECKS[@]}"`,
        },
      ],
    },
    {
      title: {
        en: "Heredocs and advanced string techniques",
        np: "Heredoc र advanced string technique",
        jp: "ヒアドキュメントと高度な文字列テクニック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Heredocs, string manipulation, and nameref variables",
            np: "Heredoc, string manipulation, र nameref variable",
            jp: "ヒアドキュメント・文字列操作・nameref 変数",
          },
          code: `#!/bin/bash
set -euo pipefail

APP="myapp"
VERSION="1.4.2"
ENVIRONMENT="production"

# --- Heredoc: embed multi-line content in a script ---
# Variables are expanded inside heredoc by default
cat <<EOF > /etc/myapp/config.yaml
app:
  name: \${APP}
  version: \${VERSION}
  environment: \${ENVIRONMENT}
  log_level: warn
EOF

# Quoted delimiter ('EOF') disables variable expansion — use for code/configs
cat <<'EOF' > /usr/local/bin/health_check.sh
#!/bin/bash
curl -sf http://localhost:8080/health || exit 1
EOF
chmod +x /usr/local/bin/health_check.sh

# Indented heredoc (<<- strips leading TABS, not spaces)
	cat <<-EOF
	This heredoc
	can be indented with tabs
	EOF

# --- Advanced string manipulation ---
FILENAME="myapp-1.4.2-linux-amd64.tar.gz"

# Remove prefix up to first -
BASE="\${FILENAME#*-}"           # 1.4.2-linux-amd64.tar.gz (remove up to first -)

# Remove suffix from last .
NAME="\${FILENAME%.*}"           # myapp-1.4.2-linux-amd64.tar (remove last extension)
NAME="\${FILENAME%%.*}"          # myapp-1 (remove from first dot — greedy)

# Extract version from filename using parameter expansion
VERSION_PART="\${FILENAME#myapp-}"       # 1.4.2-linux-amd64.tar.gz
VERSION="\${VERSION_PART%%-*}"           # 1.4.2

# Replace characters
TAG="\${VERSION//./-}"                   # 1-4-2 (replace all dots)

# Substring
echo "\${VERSION:0:1}"                   # 1 (major version)
echo "\${VERSION:2:1}"                   # 4 (minor version)

# Test if a string matches a glob pattern
if [[ "$ENVIRONMENT" == prod* ]]; then
  echo "Production-like environment"
fi

# Test if a string matches a regex
if [[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  echo "Valid semver: $VERSION"
fi

# --- Nameref: dynamic variable names (Bash 4.3+) ---
declare_env_vars() {
  local -n ref=$1   # nameref: ref IS $1's name
  ref="set"
}

MY_VAR=""
declare_env_vars MY_VAR
echo "$MY_VAR"      # set`,
        },
      ],
    },
    {
      title: {
        en: "Reusable script template",
        np: "Reusable script template",
        jp: "再利用可能なスクリプトテンプレート",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "script-template.sh — copy this for every new script",
            np: "script-template.sh — हरेक नयाँ script का लागि यो copy गर्नुहोस्",
            jp: "script-template.sh — 新しいスクリプトごとにこれをコピーする",
          },
          code: `#!/bin/bash
# script-template.sh — production-grade script skeleton
set -euo pipefail
IFS=$'\\n\\t'   # stricter word splitting

# --- Script metadata ---
readonly SCRIPT_NAME="$(basename "$0")"
readonly SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
readonly LOG_FILE="/var/log/\${SCRIPT_NAME%.*}-$(date +%Y%m%d-%H%M%S).log"

# --- Defaults ---
ENVIRONMENT="production"
VERSION=""
DRY_RUN=false

# --- Logging ---
log()  { echo "[$(date +%T)] INFO  $*" | tee -a "$LOG_FILE"; }
warn() { echo "[$(date +%T)] WARN  $*" | tee -a "$LOG_FILE" >&2; }
die()  { echo "[$(date +%T)] ERROR $*" | tee -a "$LOG_FILE" >&2; exit 1; }

# --- Cleanup ---
TMPDIR_WORK=""
cleanup() {
  [[ -n "$TMPDIR_WORK" ]] && rm -rf "$TMPDIR_WORK"
  log "Script finished (exit $?)"
}
trap cleanup EXIT
trap 'die "Interrupted"' INT TERM

# --- Usage ---
usage() {
  cat <<EOF
Usage: $SCRIPT_NAME --version VER [--environment ENV] [--dry-run]

  -v, --version VER   Version to deploy (required)
  -e, --environment   Target environment [production|staging] (default: production)
  -n, --dry-run       Validate and print commands without executing
  -h, --help          Show this message
EOF
}

# --- Argument parsing ---
while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--version)     VERSION="$2";     shift 2 ;;
    -e|--environment) ENVIRONMENT="$2"; shift 2 ;;
    -n|--dry-run)     DRY_RUN=true;     shift   ;;
    -h|--help)        usage; exit 0             ;;
    *) die "Unknown argument: $1" ;;
  esac
done

# --- Validation ---
[[ -z "$VERSION" ]]  && { usage; die "--version is required"; }
[[ "$ENVIRONMENT" =~ ^(production|staging)$ ]] || die "Invalid environment: $ENVIRONMENT"
command -v docker &>/dev/null || die "docker not found on PATH"

# --- Execution wrapper ---
run() {
  log "RUN: $*"
  [[ "$DRY_RUN" == true ]] && return 0
  "$@"
}

# --- Main ---
TMPDIR_WORK="$(mktemp -d)"
log "=== $SCRIPT_NAME started: version=$VERSION environment=$ENVIRONMENT ==="

run docker pull "myapp:\${VERSION}"
run docker tag  "myapp:\${VERSION}" "myapp:\${ENVIRONMENT}-current"

log "=== Completed successfully ==="`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is IFS and why does `IFS=$'\\n\\t'` matter?",
        np: "IFS के हो र `IFS=$'\\n\\t'` किन महत्वपूर्ण छ?",
        jp: "IFS とは何か、`IFS=$'\\n\\t'` がなぜ重要か？",
      },
      answer: {
        en: "IFS (Internal Field Separator) is the character(s) Bash uses to split words and lines when doing word splitting on unquoted variable expansions and command substitutions. The default is space+tab+newline. This means a filename with a space (`my file.txt`) splits into two words when unquoted. Setting `IFS=$'\\n\\t'` removes the space from the separator, so space-containing filenames are handled more safely. Combined with always quoting variables (`\"$VAR\"`), this prevents a large class of subtle splitting bugs. It is not a complete fix — still always quote variables.",
        np: "IFS (Internal Field Separator) Bash ले unquoted variable expansion र command substitution मा word splitting गर्दा प्रयोग गर्ने character हो। Default space+tab+newline हो। `IFS=$'\\n\\t'` ले space हटाउँछ, जसले space-containing filename लाई बढी safely handle गर्छ। Always quoting variable (`\"$VAR\"`) सँग combine गर्नुहोस्।",
        jp: "IFS（内部フィールド区切り文字）は、Bash がクォートされていない変数展開とコマンド置換の単語分割に使用する文字です。デフォルトはスペース+タブ+改行です。`IFS=$'\\n\\t'` はスペースを区切り文字から除去し、スペースを含むファイル名をより安全に処理します。常に変数をクォートする（`\"$VAR\"`）と組み合わせることで、多くの微妙な分割バグを防ぎます。",
      },
      tag: { en: "bash", np: "Bash", jp: "Bash" },
    },
    {
      question: {
        en: "How do I capture both stdout and stderr from a command?",
        np: "Command बाट stdout र stderr दुवै कसरी capture गर्ने?",
        jp: "コマンドから stdout と stderr の両方をキャプチャするには？",
      },
      answer: {
        en: "To capture both into a variable: `OUTPUT=$(command 2>&1)`. The `2>&1` redirects stderr to stdout before the `$()` capture. To split them: `OUTPUT=$(command 2>/tmp/err.txt); ERRORS=$(cat /tmp/err.txt)`. To log both to a file while also displaying them: `command 2>&1 | tee -a logfile.txt`. To discard stderr: `command 2>/dev/null`. To fail if stderr has content: `OUTPUT=$(command 2>&1); [[ -z \"$(command 2>&1 1>/dev/null)\" ]] || die \"command printed to stderr\"`.",
        np: "दुवैलाई variable मा capture गर्न: `OUTPUT=$(command 2>&1)`। `2>&1` ले `$()` capture अघि stderr लाई stdout मा redirect गर्छ। दुवैलाई display गर्दै file मा log गर्न: `command 2>&1 | tee -a logfile.txt`। stderr discard गर्न: `command 2>/dev/null`।",
        jp: "両方を変数にキャプチャするには：`OUTPUT=$(command 2>&1)`。`2>&1` は `$()` キャプチャの前に stderr を stdout にリダイレクトします。表示しながら両方をファイルにログするには：`command 2>&1 | tee -a logfile.txt`。stderr を破棄するには：`command 2>/dev/null`。",
      },
      tag: { en: "bash", np: "Bash", jp: "Bash" },
    },
    {
      question: {
        en: "When should I use `declare -r` (readonly) for variables?",
        np: "Variable का लागि `declare -r` (readonly) कहिले प्रयोग गर्ने?",
        jp: "変数に `declare -r`（読み取り専用）をいつ使うべきか？",
      },
      answer: {
        en: "Use `readonly` (or `declare -r`) for constants that must not change during the script's execution: script name, script directory, log file path, version number passed as an argument. `readonly VAR=value` causes Bash to raise an error if anything later tries to reassign the variable. This prevents a class of bugs where a function accidentally reassigns a variable that other functions depend on. In the script template, `SCRIPT_NAME`, `SCRIPT_DIR`, and `LOG_FILE` are good candidates — they are derived at startup and should never change.",
        np: "Script execution को क्रममा बदल्न नहुने constant का लागि `readonly` (वा `declare -r`) प्रयोग गर्नुहोस्: script name, script directory, log file path। `readonly VAR=value` ले पछि केही variable reassign गर्न खोज्छ भने Bash ले error raise गर्छ।",
        jp: "スクリプト実行中に変更されてはならない定数には `readonly`（または `declare -r`）を使いましょう。スクリプト名・スクリプトディレクトリ・ログファイルパス。`readonly VAR=value` にすると、後で何かが変数を再代入しようとすると Bash がエラーを発生させます。スクリプトテンプレートでは `SCRIPT_NAME`・`SCRIPT_DIR`・`LOG_FILE` が良い候補です。",
      },
      tag: { en: "bash", np: "Bash", jp: "Bash" },
    },
  ],
};
