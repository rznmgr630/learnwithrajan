import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Most DevOps automation revolves around files and the OS: reading config files, writing reports, copying build artifacts, watching directories for changes, running processes, and reading environment variables. Python's standard library covers all of this without any external dependencies.",
    np: "अधिकांश DevOps automation file र OS वरिपरि घुम्छ: config file पढ्नु, report लेख्नु, build artifact copy गर्नु, directory मा change हेर्नु, process run गर्नु, र environment variable पढ्नु। Python को standard library ले कुनै external dependency बिना यो सबै cover गर्छ।",
    jp: "ほとんどの DevOps 自動化はファイルと OS を中心に展開します。設定ファイルの読み込み・レポートの書き込み・ビルドアーティファクトのコピー・ディレクトリの変更監視・プロセスの実行・環境変数の読み込み。Python の標準ライブラリは外部依存なしにこれらすべてをカバーします。",
  } as const,
  o2: {
    en: "Today you work with the four modules you will use in every non-trivial Python DevOps script: `pathlib` (modern file paths), `os` (environment and OS calls), `shutil` (file operations), and `subprocess` (running commands). Plus structured logging and JSON — the two universal data interchange tools.",
    np: "आज तपाईंले हरेक non-trivial Python DevOps script मा प्रयोग हुने चार module सँग काम गर्नुहुनेछ: `pathlib` (modern file path), `os` (environment र OS call), `shutil` (file operation), र `subprocess` (command run गर्नु)। साथै structured logging र JSON।",
    jp: "本日はあらゆる Python DevOps スクリプトで使う 4 つのモジュールを扱います。`pathlib`（モダンなファイルパス）・`os`（環境変数と OS 呼び出し）・`shutil`（ファイル操作）・`subprocess`（コマンド実行）。さらに構造化ログと JSON。",
  } as const,
};

export const DEVOPS_DAY_23_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "pathlib — the modern way to work with file paths",
        np: "pathlib — file path सँग काम गर्ने modern तरिका",
        jp: "pathlib — ファイルパスを扱うモダンな方法",
      },
      blocks: [
        { type: "diagram", id: "devops-linux-os-stack" },
        {
          type: "paragraph",
          text: {
            en: "`pathlib.Path` treats file paths as objects with methods, not as strings to concatenate with `/` or `os.path.join`. It works identically on Linux, macOS, and Windows — important when your scripts run in CI on Linux but are developed on macOS. Use `pathlib` for all new code; reserve `os.path` only for legacy compatibility.",
            np: "`pathlib.Path` ले file path लाई `/` वा `os.path.join` सँग concatenate गर्ने string होइन, method सहितको object को रूपमा treat गर्छ। यो Linux, macOS, र Windows मा identically काम गर्छ। नयाँ code का लागि `pathlib` प्रयोग गर्नुहोस्।",
            jp: "`pathlib.Path` はファイルパスを、`/` や `os.path.join` で連結する文字列ではなく、メソッドを持つオブジェクトとして扱います。Linux・macOS・Windows で同一に動作します。すべての新しいコードに `pathlib` を使いましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "pathlib essentials for DevOps",
            np: "DevOps का लागि pathlib essentials",
            jp: "DevOps のための pathlib の基本",
          },
          code: `#!/usr/bin/env python3
from pathlib import Path

# Creating paths (OS-agnostic)
project = Path("/var/www/myapp")
config = project / "config" / "app.json"    # / operator joins paths
logs = project / "logs"

# Inspection
print(config.exists())          # True/False
print(config.is_file())
print(config.is_dir())
print(config.stat().st_size)    # bytes
print(config.stem)              # "app" (filename without extension)
print(config.suffix)            # ".json"
print(config.parent)            # /var/www/myapp/config
print(config.name)              # "app.json"

# Reading and writing
text = config.read_text()                   # read entire file as string
data = config.read_bytes()                  # read as bytes
config.write_text('{"key": "value"}')       # overwrite
config.write_bytes(b"binary data")

# Iteration and globbing
for log_file in logs.glob("*.log"):
    print(log_file)

for py_file in project.rglob("*.py"):       # recursive
    print(py_file)

# Creation and deletion
logs.mkdir(parents=True, exist_ok=True)     # like mkdir -p
config.unlink(missing_ok=True)              # delete file (no error if missing)
logs.rmdir()                                # delete empty directory

# Useful in automation
BUILD_DIR = Path(__file__).parent / "dist"  # relative to this script
BUILD_DIR.mkdir(exist_ok=True)

# Listing directory
entries = sorted(BUILD_DIR.iterdir())
files_only = [p for p in BUILD_DIR.iterdir() if p.is_file()]

# Get the home directory
home = Path.home()                          # /home/ubuntu, /root, etc.
ssh_dir = home / ".ssh"`,
        },
      ],
    },
    {
      title: {
        en: "os and environment variables",
        np: "os र environment variable",
        jp: "os と環境変数",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reading config from the environment",
            np: "Environment बाट config पढ्नुहोस्",
            jp: "環境から設定を読み取る",
          },
          code: `#!/usr/bin/env python3
import os
import sys

# Reading environment variables
db_host = os.environ["DB_HOST"]               # KeyError if not set
db_host = os.environ.get("DB_HOST", "localhost")  # safe with default
db_port = int(os.environ.get("DB_PORT", "5432"))

# Fail fast on missing required variables
def require_env(key: str) -> str:
    value = os.environ.get(key)
    if not value:
        print(f"ERROR: {key} environment variable is required", file=sys.stderr)
        sys.exit(1)
    return value

app_secret = require_env("APP_SECRET_KEY")

# Setting environment variables for child processes
os.environ["PYTHONDONTWRITEBYTECODE"] = "1"

# All environment variables
for key, value in sorted(os.environ.items()):
    print(f"{key}={value!r}")

# Current working directory
cwd = os.getcwd()
print(f"Running from: {cwd}")

# Change working directory
os.chdir("/var/www/myapp")

# Process info
print(f"PID: {os.getpid()}")
print(f"UID: {os.getuid()}")      # effective user ID
print(f"Running as root: {os.getuid() == 0}")

# Path utilities (prefer pathlib for new code)
print(os.path.exists("/etc/nginx/nginx.conf"))
print(os.path.join("/var/www", "myapp", "dist"))    # /var/www/myapp/dist
print(os.path.expanduser("~/.ssh/id_ed25519"))      # expands ~`,
        },
      ],
    },
    {
      title: {
        en: "Reading and writing structured data — JSON and YAML",
        np: "Structured data पढ्नुहोस् र लेख्नुहोस् — JSON र YAML",
        jp: "構造化データの読み書き — JSON と YAML",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "JSON (stdlib) and YAML (PyYAML) in scripts",
            np: "Script मा JSON (stdlib) र YAML (PyYAML)",
            jp: "スクリプトでの JSON（標準ライブラリ）と YAML（PyYAML）",
          },
          code: `#!/usr/bin/env python3
import json
from pathlib import Path

# --- JSON ---
# Read
config_path = Path("/etc/myapp/config.json")
with config_path.open() as f:
    config = json.load(f)

# Or the shortcut
config = json.loads(config_path.read_text())

# Write
config["version"] = "1.4.2"
config["updated_at"] = "2026-05-01"

with config_path.open("w") as f:
    json.dump(config, f, indent=2)

# Or: config_path.write_text(json.dumps(config, indent=2))

# Parse JSON from a command output
import subprocess
result = subprocess.run(
    ["docker", "inspect", "myapp"],
    capture_output=True, text=True, check=True
)
containers = json.loads(result.stdout)
ip = containers[0]["NetworkSettings"]["IPAddress"]

# Pretty print for debugging
print(json.dumps(config, indent=2, sort_keys=True))

# --- YAML (requires: pip install pyyaml) ---
import yaml

# Read a Kubernetes manifest
manifest_path = Path("deployment.yaml")
with manifest_path.open() as f:
    manifest = yaml.safe_load(f)     # always safe_load, never yaml.load()

# Read multi-document YAML (---)
with manifest_path.open() as f:
    docs = list(yaml.safe_load_all(f))

# Modify and write back
manifest["spec"]["replicas"] = 3
manifest["spec"]["template"]["spec"]["containers"][0]["image"] = "myapp:1.4.2"

with manifest_path.open("w") as f:
    yaml.dump(manifest, f, default_flow_style=False)

# Write multiple documents
docs = [deployment, service, ingress]
with Path("all.yaml").open("w") as f:
    yaml.dump_all(docs, f, default_flow_style=False)`,
        },
      ],
    },
    {
      title: {
        en: "shutil — file operations for automation",
        np: "shutil — automation का लागि file operation",
        jp: "shutil — 自動化のためのファイル操作",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Copy, move, archive, and disk usage",
            np: "Copy, move, archive, र disk usage",
            jp: "コピー・移動・アーカイブ・ディスク使用量",
          },
          code: `#!/usr/bin/env python3
import shutil
from pathlib import Path
import datetime

# Copy a file (preserving metadata)
shutil.copy2("config.json", "config.json.bak")

# Copy an entire directory tree
shutil.copytree("dist/", "dist_backup/")

# Move (rename)
shutil.move("dist_old/", "dist_archive/")

# Delete an entire directory tree (be careful!)
shutil.rmtree("tmp/", ignore_errors=True)

# Create a backup archive (tar.gz, zip, etc.)
backup_name = f"myapp-{datetime.date.today().isoformat()}"
shutil.make_archive(
    base_name=f"/var/backups/{backup_name}",   # output path (no extension)
    format="gztar",                             # tar.gz
    root_dir="/var/www",                        # chdir to this before archiving
    base_dir="myapp",                           # what to archive inside root_dir
)
# Creates: /var/backups/myapp-2026-05-01.tar.gz

# Extract an archive
shutil.unpack_archive("release.tar.gz", extract_dir="/var/www/myapp-new")

# Check disk space before deploying
usage = shutil.disk_usage("/var/www")
free_gb = usage.free / (1024 ** 3)
if free_gb < 1.0:
    print(f"ERROR: only {free_gb:.1f} GB free on /var/www", file=__import__("sys").stderr)
    __import__("sys").exit(1)

# Find a command on PATH (like 'which')
docker_path = shutil.which("docker")
if not docker_path:
    print("ERROR: docker is not installed or not on PATH")
    __import__("sys").exit(1)
print(f"Using docker at: {docker_path}")

# Practical deploy pattern: atomic swap
# 1. Extract new version to a staging directory
shutil.unpack_archive("release-1.4.2.tar.gz", "/var/www/myapp-1.4.2")
# 2. Verify it (run tests, check files)
# 3. Atomic swap: rename is atomic on the same filesystem
current = Path("/var/www/myapp")
old = Path("/var/www/myapp-old")
new = Path("/var/www/myapp-1.4.2")
if current.exists():
    current.rename(old)         # mv current → old
new.rename(current)             # mv new → current (atomic)`,
        },
      ],
    },
    {
      title: {
        en: "Structured logging — output that tools can process",
        np: "Structured logging — tool ले process गर्न सक्ने output",
        jp: "構造化ログ — ツールが処理できる出力",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Setting up logging for production DevOps scripts",
            np: "Production DevOps script का लागि logging setup गर्नुहोस्",
            jp: "本番 DevOps スクリプト向けのロギング設定",
          },
          code: `#!/usr/bin/env python3
import logging
import sys
import os

def setup_logging(level: str = "INFO") -> logging.Logger:
    """Configure logging for a DevOps script."""
    log_level = getattr(logging, level.upper(), logging.INFO)

    handler = logging.StreamHandler(sys.stderr)
    handler.setLevel(log_level)

    # Human-readable for terminals
    formatter = logging.Formatter(
        fmt="%(asctime)s [%(levelname)s] %(message)s",
        datefmt="%Y-%m-%dT%H:%M:%S",
    )
    handler.setFormatter(formatter)

    root = logging.getLogger()
    root.setLevel(log_level)
    root.addHandler(handler)
    return root


log = setup_logging(os.environ.get("LOG_LEVEL", "INFO"))

# Usage
log.debug("Detailed debug info (only visible at DEBUG level)")
log.info("Deploy started: version=%s environment=%s", "1.4.2", "production")
log.warning("Disk space below 20%%: %.1f GB free", 1.8)
log.error("Health check failed after %d attempts", 10)
log.exception("Unexpected error:")   # adds full stack trace automatically

# Contextual logging with extra fields (useful for log aggregation)
log.info(
    "Container started: name=%s image=%s port=%d",
    "myapp-web",
    "myapp:1.4.2",
    8080,
)`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why use pathlib instead of os.path?",
        np: "`os.path` को सट्टा `pathlib` किन प्रयोग गर्ने?",
        jp: "`os.path` ではなく `pathlib` を使う理由は？",
      },
      answer: {
        en: "`os.path` gives you functions that take strings: `os.path.join('/var/www', 'app', 'dist')`. `pathlib` gives you objects with methods: `Path('/var/www') / 'app' / 'dist'`. The result is less error-prone (no accidental double slashes, no forgetting to join), more readable, and cross-platform without extra work. `pathlib` also directly provides `.read_text()`, `.write_text()`, `.glob()`, and `.stat()` — operations you would otherwise combine multiple os/io calls to achieve.",
        np: "`os.path` ले string लिने function दिन्छ: `os.path.join('/var/www', 'app', 'dist')`। `pathlib` ले method सहितको object दिन्छ: `Path('/var/www') / 'app' / 'dist'`। Result कम error-prone, बढी readable, र extra work बिना cross-platform हुन्छ।",
        jp: "`os.path` は文字列を受け取る関数を提供します：`os.path.join('/var/www', 'app', 'dist')`。`pathlib` はメソッドを持つオブジェクトを提供します：`Path('/var/www') / 'app' / 'dist'`。結果はエラーが少なく・読みやすく・追加作業なしでクロスプラットフォームです。`pathlib` は `.read_text()`・`.write_text()`・`.glob()`・`.stat()` も直接提供します。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
    {
      question: {
        en: "Why `yaml.safe_load()` and not `yaml.load()`?",
        np: "`yaml.load()` नभएर `yaml.safe_load()` किन?",
        jp: "`yaml.load()` ではなく `yaml.safe_load()` を使う理由は？",
      },
      answer: {
        en: "`yaml.load()` can execute arbitrary Python objects embedded in YAML — a security vulnerability if you ever load YAML from an untrusted source (user uploads, external configs, CI inputs). `yaml.safe_load()` only parses standard YAML types (strings, numbers, lists, dicts) and raises an error on anything else. It has been the recommended default since PyYAML 5.1. Always use `safe_load` unless you specifically need to deserialize Python objects, which you almost never do in DevOps scripts.",
        np: "`yaml.load()` ले YAML मा embedded arbitrary Python object execute गर्न सक्छ — untrusted source (user upload, external config, CI input) बाट YAML load गर्नु परेमा security vulnerability। `yaml.safe_load()` ले standard YAML type मात्र parse गर्छ। DevOps script मा सधैं `safe_load` प्रयोग गर्नुहोस्।",
        jp: "`yaml.load()` は YAML に埋め込まれた任意の Python オブジェクトを実行できます。信頼できないソース（ユーザーアップロード・外部設定・CI 入力）から YAML を読み込む場合のセキュリティ脆弱性です。`yaml.safe_load()` は標準的な YAML 型（文字列・数値・リスト・辞書）のみを解析し、それ以外はエラーを発生させます。DevOps スクリプトでは常に `safe_load` を使いましょう。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
  ],
};
