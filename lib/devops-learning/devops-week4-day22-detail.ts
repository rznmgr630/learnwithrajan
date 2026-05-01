import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Python is the scripting language of DevOps. It ships on every major Linux distro, reads and writes every data format you will encounter (JSON, YAML, CSV, INI), talks to every API, and has mature libraries for AWS, Kubernetes, Docker, and everything else in the cloud stack. When Bash gets messy, you reach for Python.",
    np: "Python DevOps को scripting language हो। यो हरेक major Linux distro मा आउँछ, तपाईंले सामना गर्ने हरेक data format (JSON, YAML, CSV, INI) पढ्न र लेख्न सक्छ, हरेक API सँग कुरा गर्छ, र AWS, Kubernetes, Docker, र cloud stack का बाँकी सबैका लागि mature library छ। Bash messy हुँदा तपाईं Python तर्फ पुग्नुहुन्छ।",
    jp: "Python は DevOps のスクリプト言語です。すべての主要な Linux ディストリビューションに同梱され、遭遇するすべてのデータ形式（JSON・YAML・CSV・INI）を読み書きし、すべての API と通信し、AWS・Kubernetes・Docker・クラウドスタックのすべてに成熟したライブラリがあります。Bash が複雑になったら Python の出番です。",
  } as const,
  o2: {
    en: "Today you build the Python foundation you need for DevOps work: the type system, control flow, functions, modules, and error handling. The goal is not to learn Python as a software engineer would — it is to learn enough Python to write reliable automation scripts in the next three days.",
    np: "आज तपाईंले DevOps काम का लागि आवश्यक Python foundation बनाउनुहुनेछ: type system, control flow, function, module, र error handling। Goal software engineer जस्तो Python सिक्नु होइन — अर्को तीन दिनमा reliable automation script लेख्न पुग्ने Python सिक्नु हो।",
    jp: "本日は DevOps 作業に必要な Python の基礎を構築します。型システム・制御フロー・関数・モジュール・エラー処理。目標はソフトウェアエンジニアのように Python を学ぶことではなく、次の 3 日間で信頼性の高い自動化スクリプトを書けるだけの Python を学ぶことです。",
  } as const,
};

export const DEVOPS_DAY_22_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Python basics — types, variables, and data structures",
        np: "Python basics — type, variable, र data structure",
        jp: "Python の基本 — 型・変数・データ構造",
      },
      blocks: [
        { type: "diagram", id: "devops-cicd-pipeline" },
        {
          type: "code",
          title: {
            en: "The types you use in DevOps scripts daily",
            np: "DevOps script मा दैनिक प्रयोग हुने type",
            jp: "DevOps スクリプトで毎日使う型",
          },
          code: `#!/usr/bin/env python3
# Python 3.8+ (standard on Ubuntu 20.04+)

# --- Strings ---
service = "nginx"
version = "1.24.0"
full_name = f"{service}-{version}"          # f-strings are your best friend
multiline = """
  upstream backend {
      server 127.0.0.1:8080;
  }
"""
print(full_name.upper())                    # NGINX-1.24.0
print(full_name.replace("nginx", "haproxy"))
print(",".join(["web1", "web2", "web3"]))  # web1,web2,web3
servers = "web1,web2,web3".split(",")       # ['web1', 'web2', 'web3']

# --- Numbers ---
port = 8080
max_retries = 5
timeout_secs = 30.0

# --- Booleans ---
is_production = True
debug_mode = False

# --- Lists (ordered, mutable) ---
servers = ["web1", "web2", "db1"]
servers.append("cache1")
servers.remove("db1")
print(servers[0])       # web1
print(servers[-1])      # last item
print(servers[1:3])     # slice: ['web2', 'cache1']

# --- Dicts (key-value, your JSON equivalent) ---
config = {
    "host": "10.0.0.5",
    "port": 5432,
    "database": "app_db",
    "ssl": True,
}
print(config["host"])
print(config.get("timeout", 30))            # safe access with default
config["max_connections"] = 100             # add/update

# --- Sets (unique values) ---
deployed_regions = {"us-east-1", "eu-west-1"}
deployed_regions.add("ap-southeast-1")
print("us-east-1" in deployed_regions)     # True

# Type checking (useful in scripts)
print(type(config))     # <class 'dict'>
print(isinstance(port, int))  # True`,
        },
      ],
    },
    {
      title: {
        en: "Control flow — conditionals, loops, and comprehensions",
        np: "Control flow — conditional, loop, र comprehension",
        jp: "制御フロー — 条件分岐・ループ・内包表記",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "if/elif/else, for, while, and list comprehensions",
            np: "if/elif/else, for, while, र list comprehension",
            jp: "if/elif/else・for・while・リスト内包表記",
          },
          code: `#!/usr/bin/env python3
import sys

# --- Conditionals ---
environment = "production"

if environment == "production":
    replicas = 3
elif environment == "staging":
    replicas = 2
else:
    replicas = 1

# Inline (ternary)
log_level = "warn" if environment == "production" else "debug"

# Truthy/falsy — important for config checks
database_url = ""                       # empty string is falsy
if not database_url:
    print("ERROR: DATABASE_URL is required", file=sys.stderr)
    sys.exit(1)

# --- for loops ---
servers = ["web1", "web2", "web3"]
for server in servers:
    print(f"Deploying to {server}...")

# Loop with index
for i, server in enumerate(servers):
    print(f"[{i+1}/{len(servers)}] {server}")

# Loop over dict
config = {"host": "localhost", "port": 5432}
for key, value in config.items():
    print(f"{key} = {value}")

# --- while loop ---
retries = 0
max_retries = 5
import time

while retries < max_retries:
    # try_health_check() -- placeholder
    success = True  # simulated
    if success:
        break
    retries += 1
    time.sleep(2 ** retries)  # exponential backoff: 2, 4, 8, 16s
else:
    # the else on a while runs if loop completed without break
    print("Service never became healthy")
    sys.exit(1)

# --- List comprehensions (concise, fast) ---
servers = ["web1", "web2", "db1", "cache1"]

# Filter: only web servers
web_servers = [s for s in servers if s.startswith("web")]
# → ['web1', 'web2']

# Transform: uppercase all
upper = [s.upper() for s in servers]

# Dict comprehension
port_map = {server: 8080 + i for i, server in enumerate(servers)}
# → {'web1': 8080, 'web2': 8081, 'db1': 8082, 'cache1': 8083}`,
        },
      ],
    },
    {
      title: {
        en: "Functions — writing reusable, testable DevOps code",
        np: "Function — reusable, testable DevOps code लेख्नुहोस्",
        jp: "関数 — 再利用可能でテスト可能な DevOps コードを書く",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Functions, type hints, and docstrings",
            np: "Function, type hint, र docstring",
            jp: "関数・型ヒント・docstring",
          },
          code: `#!/usr/bin/env python3
import sys
import time
import logging
from typing import Optional

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger(__name__)

# Type hints make functions self-documenting and catch bugs early
def wait_for_health(
    url: str,
    max_retries: int = 10,
    delay_secs: float = 3.0,
) -> bool:
    """Poll a health endpoint until it returns 200 or retries are exhausted.

    Returns True if healthy, False if not healthy after all retries.
    """
    import urllib.request
    import urllib.error

    for attempt in range(1, max_retries + 1):
        try:
            with urllib.request.urlopen(url, timeout=5) as resp:
                if resp.status == 200:
                    log.info("Service healthy at %s (attempt %d)", url, attempt)
                    return True
        except (urllib.error.URLError, OSError):
            pass
        log.info("Waiting for %s... (%d/%d)", url, attempt, max_retries)
        time.sleep(delay_secs)

    log.error("Service at %s never became healthy", url)
    return False


def parse_env(key: str, default: Optional[str] = None, required: bool = False) -> str:
    """Read an environment variable with validation."""
    import os
    value = os.environ.get(key, default)
    if required and not value:
        log.error("Required environment variable %s is not set", key)
        sys.exit(1)
    return value or ""


def retry(func, max_attempts: int = 3, exceptions: tuple = (Exception,)):
    """Decorator-style retry wrapper."""
    for attempt in range(1, max_attempts + 1):
        try:
            return func()
        except exceptions as exc:
            if attempt == max_attempts:
                raise
            wait = 2 ** attempt
            log.warning("Attempt %d failed: %s. Retrying in %ds...", attempt, exc, wait)
            time.sleep(wait)


# --- Using the functions ---
db_host = parse_env("DB_HOST", required=True)
app_url = parse_env("APP_URL", default="http://localhost:8080")

if not wait_for_health(f"{app_url}/health"):
    sys.exit(1)`,
        },
      ],
    },
    {
      title: {
        en: "Error handling and the sys module",
        np: "Error handling र sys module",
        jp: "エラー処理と sys モジュール",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "try/except, exit codes, and stderr",
            np: "try/except, exit code, र stderr",
            jp: "try/except・終了コード・stderr",
          },
          code: `#!/usr/bin/env python3
import sys
import json
import logging

log = logging.getLogger(__name__)

# --- try/except ---
def load_config(path: str) -> dict:
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        log.error("Config file not found: %s", path)
        sys.exit(1)
    except json.JSONDecodeError as exc:
        log.error("Invalid JSON in %s: %s", path, exc)
        sys.exit(1)
    except PermissionError:
        log.error("Cannot read %s: permission denied", path)
        sys.exit(1)

# --- Exit codes (critical for CI/CD) ---
# sys.exit(0)  → success
# sys.exit(1)  → general failure
# Use consistent non-zero codes in your scripts

# --- stderr vs stdout ---
# Diagnostic messages → stderr (not captured by CI, doesn't pollute piped output)
# Data output → stdout (captured by $(), pipes, logs)
print("web1,web2,web3")                        # stdout — data
print("Starting deploy...", file=sys.stderr)   # stderr — diagnostic

# --- Catching all exceptions as a safety net ---
def main():
    try:
        config = load_config("deploy.json")
        # ... do work ...
    except KeyboardInterrupt:
        log.warning("Interrupted by user")
        sys.exit(130)   # 128 + SIGINT(2) — convention
    except Exception as exc:
        log.exception("Unexpected error: %s", exc)
        sys.exit(1)

# --- __name__ guard — critical for importable scripts ---
if __name__ == "__main__":
    main()
# Without this, running 'import myscript' would execute main() automatically`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Catch specific exceptions**, not bare `except:` or `except Exception:` everywhere. A bare `except` swallows `KeyboardInterrupt` and `SystemExit`, making your script impossible to interrupt or stop.",
              np: "**Specific exception catch** गर्नुहोस्, सर्वत्र bare `except:` वा `except Exception:` होइन। Bare `except` ले `KeyboardInterrupt` र `SystemExit` निल्छ, जसले script interrupt वा stop गर्न असम्भव बनाउँछ।",
              jp: "**特定の例外をキャッチ**しましょう。どこでも bare の `except:` や `except Exception:` を使わないように。bare の `except` は `KeyboardInterrupt` と `SystemExit` を飲み込み、スクリプトを中断・停止できなくします。",
            },
            {
              en: "**`log.exception()`** automatically appends the full stack trace to the log message — far more useful than `log.error(str(exc))` when debugging production failures.",
              np: "**`log.exception()`** ले automatically log message मा full stack trace append गर्छ — production failure debug गर्दा `log.error(str(exc))` भन्दा धेरै उपयोगी।",
              jp: "**`log.exception()`** はログメッセージにフルスタックトレースを自動的に付加します。本番障害のデバッグ時に `log.error(str(exc))` よりはるかに役立ちます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Running shell commands from Python",
        np: "Python बाट shell command run गर्नुहोस्",
        jp: "Python からシェルコマンドを実行する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "subprocess — the right way to run commands",
            np: "subprocess — command run गर्ने सही तरिका",
            jp: "subprocess — コマンドを実行する正しい方法",
          },
          code: `#!/usr/bin/env python3
import subprocess
import sys

# subprocess.run — the modern API (Python 3.5+)

# Run a command and check for failure
result = subprocess.run(
    ["git", "rev-parse", "--short", "HEAD"],
    capture_output=True,
    text=True,
    check=True,          # raises CalledProcessError if exit code != 0
)
git_sha = result.stdout.strip()
print(f"Current commit: {git_sha}")

# Run and capture output for scripting
def get_output(cmd: list[str]) -> str:
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return result.stdout.strip()

running_containers = get_output(["docker", "ps", "-q"]).splitlines()

# Run with shell=True ONLY when you need shell features (globs, pipes)
# NEVER use shell=True with user-supplied input — command injection risk!
result = subprocess.run(
    "docker ps | grep nginx | wc -l",
    shell=True, capture_output=True, text=True
)
count = int(result.stdout.strip())

# Stream output in real time (useful for long-running commands)
def run_streaming(cmd: list[str]) -> int:
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, text=True)
    for line in process.stdout:
        print(line, end="")
    process.wait()
    return process.returncode

exit_code = run_streaming(["docker", "build", "-t", "myapp:latest", "."])
if exit_code != 0:
    print("Docker build failed", file=sys.stderr)
    sys.exit(1)

# Safe: build command list from variables (never concatenate strings)
image = "myapp"
tag = "1.4.2"
cmd = ["docker", "pull", f"{image}:{tag}"]   # ✓ safe
# cmd = f"docker pull {image}:{tag}"         # ✗ injection risk if image is untrusted`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Python instead of Bash?",
        np: "Bash को सट्टा Python कहिले प्रयोग गर्ने?",
        jp: "Bash の代わりに Python をいつ使うべきか？",
      },
      answer: {
        en: "Use Bash when: you are mostly gluing existing CLI tools together, the script is under ~50 lines, or it needs to run on any POSIX system without installing anything. Use Python when: you need to parse JSON/YAML/XML, make HTTP API calls, do non-trivial string manipulation, handle complex error cases, write unit tests for the script, or the logic has more than 2–3 levels of nesting. A good rule: if you find yourself using `awk`, `sed`, or `perl -e` inside a Bash script, that script should probably be Python.",
        np: "Bash प्रयोग गर्नुहोस् जब: तपाईं mostly existing CLI tool जोड्दै हुनुहुन्छ, script ~50 line भन्दा कम छ, वा केही install नगरी कुनै POSIX system मा run गर्न आवश्यक छ। Python प्रयोग गर्नुहोस् जब: JSON/YAML/XML parse गर्न, HTTP API call गर्न, complex error handle गर्न, वा logic मा 2–3 भन्दा बढी nesting level छ।",
        jp: "Bash を使うのは：既存の CLI ツールを主につなぎ合わせる場合・スクリプトが約 50 行以下の場合・何もインストールせずに POSIX システムで実行する必要がある場合。Python を使うのは：JSON/YAML/XML を解析する場合・HTTP API を呼び出す場合・複雑なエラー処理が必要な場合・ロジックのネストが 2〜3 レベルを超える場合。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
    {
      question: {
        en: "What is a virtual environment and do I need one for DevOps scripts?",
        np: "Virtual environment के हो र DevOps script का लागि चाहिन्छ?",
        jp: "仮想環境とは何か、DevOps スクリプトには必要か？",
      },
      answer: {
        en: "A virtual environment (venv) is an isolated Python installation where you can install packages without affecting the system Python. For DevOps scripts: yes, always use one on developer laptops (`python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`). In CI/CD and Docker containers, a venv is optional since the container provides isolation — but still good practice. Never `pip install` as root or into the system Python on a server you care about.",
        np: "Virtual environment (venv) एउटा isolated Python installation हो जहाँ system Python affect नगरी package install गर्न सकिन्छ। DevOps script का लागि: हो, developer laptop मा सधैं प्रयोग गर्नुहोस् (`python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`)। CI/CD र Docker container मा venv optional छ। Server मा root को रूपमा वा system Python मा कहिल्यै `pip install` नगर्नुहोस्।",
        jp: "仮想環境（venv）はシステムの Python に影響を与えずにパッケージをインストールできる、隔離された Python インストールです。DevOps スクリプト向け：開発者のラップトップでは常に使いましょう（`python3 -m venv .venv && source .venv/bin/activate && pip install -r requirements.txt`）。CI/CD や Docker コンテナではコンテナが分離を提供するため venv はオプションですが、それでもよい慣習です。サーバーで root として、またはシステムの Python に `pip install` しないようにしましょう。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
  ],
};
