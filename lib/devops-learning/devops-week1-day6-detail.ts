import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Shell scripts are the glue of DevOps. Every deploy pipeline, backup cron job, and server health check you will ever write starts here. Bash is not pretty, but it is everywhere — the same script that runs on your laptop runs on EC2, inside a Docker container, and in your Jenkins agent.",
    np: "Shell script DevOps को गोंद हो। तपाईंले लेख्ने हरेक deploy pipeline, backup cron job, र server health check यहींबाट सुरु हुन्छ। Bash राम्रो देखिँदैन तर यो सर्वत्र छ — तपाईंको laptop मा चल्ने उही script EC2 मा, Docker container भित्र, र Jenkins agent मा पनि चल्छ।",
    jp: "シェルスクリプトは DevOps の接着剤です。あなたが書くすべてのデプロイパイプライン・バックアップ cron ジョブ・サーバーヘルスチェックはここから始まります。Bash はきれいではありませんが、どこにでもあります。ラップトップで動くスクリプトは EC2・Docker コンテナ・Jenkins エージェントでも同じように動きます。",
  } as const,
  o2: {
    en: "Today you learn the core building blocks: variables, conditionals, loops, functions, and exit codes. By the end you will have written a reusable deploy script that validates prerequisites, runs steps, and exits non-zero on failure — the same pattern used in real CI/CD pipelines.",
    np: "आज तपाईंले मूल building block सिक्नुहुनेछ: variable, conditional, loop, function, र exit code। अन्तसम्म तपाईंले एउटा reusable deploy script लेख्नुहुनेछ जसले prerequisite validate गर्छ, step run गर्छ, र failure मा non-zero exit गर्छ — वास्तविक CI/CD pipeline मा प्रयोग हुने उही pattern।",
    jp: "本日は変数・条件分岐・ループ・関数・終了コードというコアの構成要素を学びます。最終的には、前提条件を検証し、ステップを実行し、失敗時に非ゼロで終了する再利用可能なデプロイスクリプトを書きます。これは実際の CI/CD パイプラインで使われるパターンと同じです。",
  } as const,
};

export const DEVOPS_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Script anatomy — shebang, execution, and exit codes",
        np: "Script anatomy — shebang, execution, र exit code",
        jp: "スクリプトの解剖 — shebang・実行・終了コード",
      },
      blocks: [
        { type: "diagram", id: "devops-bash-script-flow" },
        {
          type: "paragraph",
          text: {
            en: "Every shell script starts with a shebang (`#!/bin/bash`) — it tells the kernel which interpreter to use. Without it, the script is treated as a series of shell commands run in the current shell, which breaks portability. After writing a script, you must mark it executable before you can run it directly.",
            np: "हरेक shell script shebang (`#!/bin/bash`) बाट सुरु हुन्छ — यसले kernel लाई कुन interpreter प्रयोग गर्ने भनेर बताउँछ। यो नभएमा script current shell मा command को series को रूपमा run हुन्छ, जसले portability तोड्छ। Script लेखेपछि यसलाई सिधै run गर्नु अघि executable mark गर्नुपर्छ।",
            jp: "すべてのシェルスクリプトは shebang（`#!/bin/bash`）で始まります。これはカーネルにどのインタープリターを使うかを伝えます。これがないとスクリプトは現在のシェルで実行されるコマンドの連続として扱われ、移植性が損なわれます。スクリプトを書いた後、直接実行する前に実行可能フラグを立てる必要があります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Creating and running your first script",
            np: "आफ्नो पहिलो script बनाउनुहोस् र run गर्नुहोस्",
            jp: "最初のスクリプトの作成と実行",
          },
          code: `#!/bin/bash
# hello.sh — the simplest useful script

echo "Hello from $(hostname) at $(date)"

# Exit codes: 0 = success, non-zero = failure
# Every command you run sets $? to its exit code
ls /nonexistent 2>/dev/null
echo "ls exit code: $?"   # prints 2

exit 0   # explicit success (optional if last command succeeded)`,
        },
        {
          type: "code",
          title: {
            en: "Making scripts executable and running them",
            np: "Script लाई executable बनाउनुहोस् र run गर्नुहोस्",
            jp: "スクリプトを実行可能にして実行する",
          },
          code: `# Mark executable
chmod +x hello.sh

# Run directly (shebang determines interpreter)
./hello.sh

# Run explicitly via bash (no execute bit needed)
bash hello.sh

# Run with strict mode — always use this in production scripts
bash -x hello.sh    # trace: print each command before running it
bash -n hello.sh    # dry-run: parse for syntax errors without executing

# Best practice: open every production script with this line
set -euo pipefail
# -e  exit immediately if any command fails
# -u  treat unset variables as errors
# -o pipefail  a piped command fails if any part of the pipe fails`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`set -euo pipefail` is the single most important line you can add to a script. Without `-e`, a failed `mv` silently continues and your deploy corrupts production.",
              np: "`set -euo pipefail` एउटा script मा थप्न सक्ने सबभन्दा महत्वपूर्ण line हो। `-e` बिना failed `mv` ले silently जारी राख्छ र तपाईंको deploy ले production corrupt गर्छ।",
              jp: "`set -euo pipefail` はスクリプトに追加できる最も重要な一行です。`-e` がないと、失敗した `mv` がサイレントに続行して本番環境を壊すことがあります。",
            },
            {
              en: "Exit code `0` means success. Anything else is failure. This is how `if`, `&&`, `||`, and CI/CD systems decide what to do next.",
              np: "Exit code `0` को अर्थ सफलता हो। अरू जेसुकै failure हो। यसैले `if`, `&&`, `||`, र CI/CD system ले अर्को के गर्ने निर्णय गर्छ।",
              jp: "終了コード `0` は成功を意味します。それ以外は失敗です。`if`・`&&`・`||`・CI/CD システムはこれを使って次の行動を決定します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Variables, quoting, and string operations",
        np: "Variable, quoting, र string operation",
        jp: "変数・クォート・文字列操作",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Variables and quoting rules",
            np: "Variable र quoting नियमहरू",
            jp: "変数とクォートのルール",
          },
          code: `#!/bin/bash
set -euo pipefail

# Assigning variables — NO spaces around =
APP_NAME="myapp"
VERSION="1.4.2"
DEPLOY_DIR="/var/www/\${APP_NAME}"   # braces for clarity inside strings

# Reading variables
echo "\$APP_NAME"          # myapp
echo "\${APP_NAME}"        # same — braces required when followed by alphanumeric

# Quoting rules (critical — bugs live here)
FILE="my file.txt"
ls \$FILE       # WRONG: word-splits to 'ls my file.txt' → "my" not found
ls "\$FILE"     # CORRECT: preserves spaces

# Command substitution
CURRENT_DATE=\$(date +%Y-%m-%d)
GIT_SHA=\$(git rev-parse --short HEAD)
RUNNING_PROCS=\$(ps aux | wc -l)

echo "Deploying \${APP_NAME} \${VERSION} on \${CURRENT_DATE}"

# Default values — essential for safe scripts
ENVIRONMENT=\${1:-production}      # use first argument, default to 'production'
LOG_LEVEL=\${LOG_LEVEL:-info}      # use env var if set, else 'info'
DEPLOY_DIR=\${DEPLOY_DIR:-/tmp/deploy}

# String operations
echo "\${APP_NAME^^}"            # MYAPP (uppercase)
echo "\${APP_NAME:0:3}"          # mya (substring: offset 0, length 3)
echo "\${VERSION//./-}"          # 1-4-2 (replace all dots with dashes)
echo "\${#APP_NAME}"             # 5 (string length)`,
        },
      ],
    },
    {
      title: {
        en: "Conditionals and tests",
        np: "Conditional र test",
        jp: "条件分岐とテスト",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "if/elif/else and the test command",
            np: "if/elif/else र test command",
            jp: "if/elif/else と test コマンド",
          },
          code: `#!/bin/bash
set -euo pipefail

FILE="/etc/nginx/nginx.conf"
USER="deploy"
PORT=8080

# File tests
if [[ -f "\$FILE" ]]; then
  echo "Config exists"
elif [[ -d "/etc/nginx" ]]; then
  echo "nginx dir exists but config missing"
else
  echo "nginx not installed"
fi

# String comparison
if [[ "\$ENVIRONMENT" == "production" ]]; then
  echo "Running production checks..."
fi

if [[ -z "\$API_KEY" ]]; then   # -z = empty string
  echo "ERROR: API_KEY is not set" >&2
  exit 1
fi

# Numeric comparison ([[ ]] uses -eq -ne -lt -gt -le -ge)
if [[ \$PORT -lt 1024 ]]; then
  echo "Warning: privileged port requires root"
fi

# Common test flags
# -f file    regular file exists
# -d path    directory exists
# -r file    file is readable
# -w file    file is writable
# -x file    file is executable
# -z str     string is empty
# -n str     string is non-empty
# -e path    any path (file or dir) exists

# Combining conditions
if [[ -f "\$FILE" && -r "\$FILE" ]]; then
  echo "Config is readable"
fi

if [[ "\$USER" == "root" || "\$USER" == "deploy" ]]; then
  echo "Authorized user"
fi`,
        },
      ],
    },
    {
      title: {
        en: "Loops — iterating over files, arrays, and sequences",
        np: "Loop — file, array, र sequence मा iterate गर्नुहोस्",
        jp: "ループ — ファイル・配列・シーケンスの反復処理",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "for, while, and until loops",
            np: "for, while, र until loop",
            jp: "for・while・until ループ",
          },
          code: `#!/bin/bash
set -euo pipefail

# for loop over a list
for SERVER in web1 web2 web3; do
  echo "Deploying to \$SERVER..."
  ssh "\$SERVER" "sudo systemctl restart myapp"
done

# for loop over files (glob — always quote to handle spaces)
for FILE in /etc/nginx/conf.d/*.conf; do
  echo "Validating \$FILE"
  nginx -t -c "\$FILE"
done

# C-style for loop
for ((i=1; i<=5; i++)); do
  echo "Attempt \$i of 5"
  curl -sf http://localhost/health && break
  sleep 2
done

# while loop — read lines from a file or command output
while IFS= read -r LINE; do
  echo "Processing: \$LINE"
done < /etc/hosts

# while with a condition
RETRIES=0
while ! curl -sf http://localhost/health; do
  RETRIES=\$((RETRIES + 1))
  if [[ \$RETRIES -ge 5 ]]; then
    echo "ERROR: service never became healthy" >&2
    exit 1
  fi
  echo "Waiting for service... (attempt \$RETRIES)"
  sleep 3
done

# Arrays
SERVERS=("web1" "web2" "db1")
echo "First: \${SERVERS[0]}"
echo "All:   \${SERVERS[@]}"
echo "Count: \${#SERVERS[@]}"

for SERVER in "\${SERVERS[@]}"; do
  echo "Pinging \$SERVER"
done`,
        },
      ],
    },
    {
      title: {
        en: "Functions — reusable blocks with arguments and return values",
        np: "Function — argument र return value सहित reusable block",
        jp: "関数 — 引数と戻り値を持つ再利用可能なブロック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Defining and calling functions",
            np: "Function define र call गर्नुहोस्",
            jp: "関数の定義と呼び出し",
          },
          code: `#!/bin/bash
set -euo pipefail

# Function definition — must appear before first call
log() {
  local LEVEL="\$1"
  local MSG="\$2"
  echo "[\$(date +%H:%M:%S)] [\$LEVEL] \$MSG"
}

die() {
  log "ERROR" "\$1"
  exit 1
}

check_dependency() {
  local CMD="\$1"
  if ! command -v "\$CMD" &>/dev/null; then
    die "Required command '\$CMD' not found. Install it and retry."
  fi
  log "INFO" "\$CMD is available"
}

wait_for_health() {
  local URL="\$1"
  local MAX_RETRIES="\${2:-10}"
  local RETRY=0

  while [[ \$RETRY -lt \$MAX_RETRIES ]]; do
    if curl -sf "\$URL" &>/dev/null; then
      log "INFO" "Service healthy at \$URL"
      return 0
    fi
    RETRY=\$((RETRY + 1))
    log "INFO" "Waiting... (\$RETRY/\$MAX_RETRIES)"
    sleep 3
  done

  return 1   # caller decides what to do on failure
}

# Using the functions
check_dependency "docker"
check_dependency "curl"

if ! wait_for_health "http://localhost:8080/health"; then
  die "Service failed to start after \$MAX_RETRIES attempts"
fi`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Use `local` for all variables inside functions — without it, they leak into the global scope and cause hard-to-debug side effects.",
              np: "Function भित्र सबै variable का लागि `local` प्रयोग गर्नुहोस् — यो नभएमा तिनीहरू global scope मा leak हुन्छन् र debug गर्न गाह्रो side effect निम्त्याउँछ।",
              jp: "関数内のすべての変数には `local` を使いましょう。これがないとグローバルスコープに漏れ、デバッグが難しい副作用を引き起こします。",
            },
            {
              en: "Functions return exit codes (0–255), not strings. To return a value, use `echo` inside the function and capture it with `RESULT=$(my_func)`.",
              np: "Function ले exit code (0–255) return गर्छ, string होइन। Value return गर्न function भित्र `echo` प्रयोग गर्नुहोस् र `RESULT=$(my_func)` ले capture गर्नुहोस्।",
              jp: "関数は終了コード（0〜255）を返します。文字列ではありません。値を返すには関数内で `echo` を使い、`RESULT=$(my_func)` でキャプチャします。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: A real deploy script",
        np: "Hands-on: वास्तविक deploy script",
        jp: "ハンズオン: 本物のデプロイスクリプト",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "deploy.sh — a production-style deployment script",
            np: "deploy.sh — production-style deployment script",
            jp: "deploy.sh — 本番スタイルのデプロイスクリプト",
          },
          code: `#!/bin/bash
set -euo pipefail

# Usage: ./deploy.sh <version> [environment]
#   ./deploy.sh 1.4.2 staging
#   ./deploy.sh 1.4.2            # defaults to production

VERSION="\${1:?Usage: \$0 <version> [environment]}"
ENVIRONMENT="\${2:-production}"
APP="myapp"
DEPLOY_DIR="/var/www/\${APP}"
BACKUP_DIR="/var/backups/\${APP}"
LOG_FILE="/var/log/deploy-\$(date +%Y%m%d-%H%M%S).log"

log()  { echo "[\$(date +%T)] \$*" | tee -a "\$LOG_FILE"; }
die()  { log "FATAL: \$*"; exit 1; }

# Prerequisites
for CMD in docker curl tar; do
  command -v "\$CMD" &>/dev/null || die "\$CMD not found"
done

[[ "\$EUID" -ne 0 ]] && die "Must run as root or with sudo"

log "=== Deploying \${APP} \${VERSION} to \${ENVIRONMENT} ==="

# Backup current version
if [[ -d "\$DEPLOY_DIR" ]]; then
  log "Backing up current deployment..."
  mkdir -p "\$BACKUP_DIR"
  tar -czf "\${BACKUP_DIR}/\${APP}-backup-\$(date +%Y%m%d-%H%M%S).tar.gz" "\$DEPLOY_DIR"
fi

# Pull new image
log "Pulling docker image \${APP}:\${VERSION}..."
docker pull "\${APP}:\${VERSION}"

# Stop current container gracefully
log "Stopping current container..."
docker stop "\${APP}" 2>/dev/null || true
docker rm   "\${APP}" 2>/dev/null || true

# Start new container
log "Starting \${APP}:\${VERSION}..."
docker run -d \\
  --name "\${APP}" \\
  --restart unless-stopped \\
  -p 8080:8080 \\
  -e "APP_ENV=\${ENVIRONMENT}" \\
  "\${APP}:\${VERSION}"

# Health check
log "Waiting for service to become healthy..."
RETRIES=0
until curl -sf http://localhost:8080/health; do
  RETRIES=\$((RETRIES+1))
  [[ \$RETRIES -ge 10 ]] && die "Service failed health check after 30s"
  sleep 3
done

log "=== Deployment successful: \${APP} \${VERSION} is live ==="`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use `[[ ]]` vs `[ ]` for conditions?",
        np: "Condition का लागि `[[ ]]` बनाम `[ ]` कहिले प्रयोग गर्ने?",
        jp: "条件に `[[ ]]` と `[ ]` のどちらを使うべきか？",
      },
      answer: {
        en: "Always use `[[ ]]` (double brackets) in Bash scripts — it is a Bash keyword that handles word splitting, globbing, and empty-string cases correctly without extra quoting. `[ ]` (single bracket) is the POSIX `/usr/bin/[` binary, kept for `#!/bin/sh` portability. Since your DevOps scripts target Bash specifically, `[[ ]]` is safer and clearer.",
        np: "Bash script मा सधैं `[[ ]]` (double bracket) प्रयोग गर्नुहोस् — यो Bash keyword हो जसले extra quoting बिना word splitting, globbing, र empty-string case सही तरिकाले handle गर्छ। `[ ]` (single bracket) POSIX `/usr/bin/[` binary हो, `#!/bin/sh` portability का लागि राखिएको। तपाईंको DevOps script Bash target गर्छ भने `[[ ]]` सुरक्षित र स्पष्ट छ।",
        jp: "Bash スクリプトでは常に `[[ ]]`（二重括弧）を使いましょう。これは Bash のキーワードで、余分なクォートなしに単語分割・グロブ展開・空文字列ケースを正しく処理します。`[ ]`（単一括弧）は POSIX の `/usr/bin/[` バイナリで、`#!/bin/sh` の移植性のために残っています。DevOps スクリプトが Bash をターゲットにしているなら、`[[ ]]` の方が安全で明確です。",
      },
      tag: { en: "scripting", np: "स्क्रिप्टिङ", jp: "スクリプト" },
    },
    {
      question: {
        en: "Why does my script fail only in CI but work on my laptop?",
        np: "मेरो script CI मा मात्र fail हुन्छ तर laptop मा काम गर्छ, किन?",
        jp: "スクリプトが CI でだけ失敗してラップトップでは動くのはなぜか？",
      },
      answer: {
        en: "Usually one of three causes: (1) Missing PATH — CI agents run with a minimal PATH and your tool (node, python, aws) is not on it. Fix: use absolute paths or explicitly export PATH in your script. (2) Unset variables — your laptop has `SOME_VAR` in `.bashrc`; CI does not. Fix: `set -u` will catch this immediately. (3) Locale/encoding — CI often runs `LANG=C`, which changes sort order and text processing. Fix: add `export LC_ALL=C` at the top of scripts that process text.",
        np: "सामान्यतया तीन कारण मध्ये एउटा: (1) Missing PATH — CI agent ले minimal PATH सँग run गर्छ र तपाईंको tool (node, python, aws) त्यसमा छैन। Fix: absolute path प्रयोग गर्नुहोस् वा script मा explicitly PATH export गर्नुहोस्। (2) Unset variable — तपाईंको laptop मा `.bashrc` मा `SOME_VAR` छ; CI मा छैन। Fix: `set -u` ले यो तुरुन्त catch गर्छ। (3) Locale/encoding — CI प्रायः `LANG=C` सँग run हुन्छ। Fix: text process गर्ने script को माथि `export LC_ALL=C` थप्नुहोस्।",
        jp: "通常、3 つの原因のいずれかです。(1) PATH の欠落 — CI エージェントは最小限の PATH で実行され、ツール（node・python・aws）がそこにありません。修正：絶対パスを使うか、スクリプト内で明示的に PATH をエクスポートします。(2) 未設定の変数 — ラップトップの `.bashrc` には `SOME_VAR` があるが CI にはない。修正：`set -u` で即座にキャッチできます。(3) ロケール/エンコーディング — CI は `LANG=C` で実行されることが多く、ソート順やテキスト処理が変わります。修正：テキストを処理するスクリプトの先頭に `export LC_ALL=C` を追加します。",
      },
      tag: { en: "scripting", np: "स्क्रिप्टिङ", jp: "スクリプト" },
    },
    {
      question: {
        en: "How do I handle errors gracefully without set -e?",
        np: "`set -e` बिना error gracefully कसरी handle गर्ने?",
        jp: "`set -e` なしでエラーを適切に処理するには？",
      },
      answer: {
        en: "Use the `||` operator to handle individual failures: `some_command || { log 'failed'; exit 1; }`. For cleanup on any exit (including errors), use `trap`: `trap 'rm -f /tmp/lockfile' EXIT`. The `trap` runs even on `set -e` exits, making it the correct place for cleanup logic.",
        np: "Individual failure handle गर्न `||` operator प्रयोग गर्नुहोस्: `some_command || { log 'failed'; exit 1; }`। कुनै पनि exit (error सहित) मा cleanup का लागि `trap` प्रयोग गर्नुहोस्: `trap 'rm -f /tmp/lockfile' EXIT`। `trap` `set -e` exit मा पनि run हुन्छ, जसले यसलाई cleanup logic को सही ठाउँ बनाउँछ।",
        jp: "個々の失敗を処理するには `||` 演算子を使います：`some_command || { log 'failed'; exit 1; }`。エラーを含むあらゆる終了時のクリーンアップには `trap` を使います：`trap 'rm -f /tmp/lockfile' EXIT`。`trap` は `set -e` による終了でも実行されるため、クリーンアップロジックの正しい場所です。",
      },
      tag: { en: "scripting", np: "स्क्रिप्टिङ", jp: "スクリプト" },
    },
    {
      question: {
        en: "What is the difference between `$@` and `$*`?",
        np: "`$@` र `$*` बीच के फरक छ?",
        jp: "`$@` と `$*` の違いは何か？",
      },
      answer: {
        en: 'Both expand to all positional arguments, but the quoting behavior differs. `"$@"` expands each argument as a separate word (preserving spaces inside arguments) — always use this. `"$*"` joins all arguments into one word with IFS separator — useful only when you intentionally want a single string. Rule: use `"$@"` in loops and when passing args to another command.',
        np: 'दुवैले सबै positional argument expand गर्छन्, तर quoting behavior फरक छ। `"$@"` प्रत्येक argument लाई अलग word को रूपमा expand गर्छ (argument भित्रको space preserve गर्दै) — सधैं यो प्रयोग गर्नुहोस्। `"$*"` ले सबै argument लाई IFS separator सहित एउटा word मा join गर्छ। Rule: loop र अर्को command मा arg pass गर्दा `"$@"` प्रयोग गर्नुहोस्।',
        jp: '両方とも全ての位置引数に展開されますが、クォートの動作が異なります。`"$@"` は各引数を別々の単語として展開します（引数内のスペースを保持）。常にこれを使いましょう。`"$*"` は全引数を IFS 区切りで 1 つの単語にまとめます。ルール：ループや引数を別コマンドに渡す場合は `"$@"` を使います。',
      },
      tag: { en: "scripting", np: "स्क्रिप्टिङ", jp: "スクリプト" },
    },
  ],
};
