import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Every application writes logs — JSON lines from microservices, combined access logs from nginx, syslog from the kernel. A DevOps engineer who can parse, filter, and aggregate those logs in Python can detect outages before users do, build cost dashboards, and turn raw noise into actionable insight. Unstructured logs buried in files die; structured logs flowing through pipelines scale.",
    np: "हरेक application log लेख्छ — microservice बाट JSON lines, nginx बाट combined access log, kernel बाट syslog। जो DevOps engineer Python मा log parse, filter, र aggregate गर्न सक्छ, उसले user भन्दा पहिले outage detect गर्न सक्छ, cost dashboard बनाउन सक्छ, र raw noise लाई actionable insight मा रूपान्तरण गर्न सक्छ। File मा गाडिएका unstructured log मर्छन्; pipeline मा बग्ने structured log scale गर्छन्।",
    jp: "すべてのアプリケーションはログを書きます — マイクロサービスからの JSON Lines、nginx からのアクセスログ、カーネルからの syslog。Python でログを解析・フィルタリング・集計できる DevOps エンジニアは、ユーザーより先に障害を検出し、コストダッシュボードを構築し、生のノイズを実行可能な洞察に変えられます。ファイルに埋もれた非構造化ログは死に、パイプラインを流れる構造化ログはスケールします。",
  } as const,
  o2: {
    en: "Today you build a practical toolkit: reading JSON Lines and YAML configs, processing CSV data with the standard library, extracting fields from unstructured text with regex, and configuring your own applications to emit structured JSON logs from day one. The capstone is a real log analyzer script you can drop onto any server.",
    np: "आज तपाईंले एक practical toolkit बनाउनुहुनेछ: JSON Lines र YAML config पढ्ने, standard library सँग CSV data process गर्ने, regex सँग unstructured text बाट field निकाल्ने, र आफ्नै application लाई day one देखि structured JSON log emit गर्न configure गर्ने। Capstone भनेको एउटा real log analyzer script हो जुन तपाईं कुनै पनि server मा deploy गर्न सक्नुहुन्छ।",
    jp: "本日は実践的なツールキットを構築します。JSON Lines と YAML 設定の読み込み、標準ライブラリを使った CSV データ処理、正規表現で非構造化テキストからフィールドを抽出、そして初日から構造化 JSON ログを出力するよう自身のアプリケーションを設定する方法です。仕上げとして、任意のサーバーに持ち込める本物のログ解析スクリプトを作ります。",
  } as const,
};

export const DEVOPS_DAY_26_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Why log parsing matters",
        np: "Log parsing किन महत्त्वपूर्ण छ",
        jp: "ログ解析が重要な理由",
      },
      blocks: [
        { type: "diagram", id: "devops-log-parsing" },
        {
          type: "paragraph",
          text: {
            en: "Applications produce logs in several formats depending on the stack. Microservices and modern tools like Docker and Kubernetes emit JSON Lines (one JSON object per line), which are machine-readable but verbose. Web servers like nginx and Apache use the combined log format — a compact, human-readable text line with a fixed field order. System daemons write syslog, which has a structured header (timestamp, hostname, process name, PID) followed by a free-text message. Knowing which format you are dealing with before writing a single line of code saves hours of frustration.",
            np: "Application ले stack अनुसार धेरै format मा log उत्पादन गर्छन्। Microservice र Docker, Kubernetes जस्ता modern tool ले JSON Lines (प्रति line एक JSON object) emit गर्छन् — machine-readable तर verbose। Nginx र Apache जस्ता web server ले combined log format प्रयोग गर्छन् — fixed field order सहितको compact, human-readable text line। System daemon ले syslog लेख्छ, जसमा structured header (timestamp, hostname, process name, PID) र free-text message हुन्छ। Code को एउटा line लेख्नु अघि कुन format हो भनेर जान्नाले घण्टौं frustration बचाउँछ।",
            jp: "アプリケーションはスタックに応じていくつかの形式でログを生成します。マイクロサービスや Docker・Kubernetes などのモダンなツールは JSON Lines（1 行に 1 つの JSON オブジェクト）を出力します — 機械読み取り可能ですが冗長です。nginx や Apache などの Web サーバーは combined log 形式を使います — 固定フィールド順序を持つコンパクトで人間が読めるテキスト行です。システムデーモンは syslog を書きます。構造化されたヘッダー（タイムスタンプ、ホスト名、プロセス名、PID）に続いて自由形式のメッセージが続きます。コードを一行も書く前に、どの形式を扱うかを知っておくと、何時間もの試行錯誤を省けます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Reading a JSON Lines log file and filtering errors",
            np: "JSON Lines log file पढ्ने र error filter गर्ने",
            jp: "JSON Lines ログファイルを読み込んでエラーをフィルタリング",
          },
          code: `#!/usr/bin/env python3
"""Parse a JSON Lines log file, filter errors, and summarise latency."""
import json
import sys
from pathlib import Path
from collections import defaultdict

LOG_FILE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("app.log")

# Always read line-by-line — never file.read() on a large log
error_count = 0
latencies = []
service_errors: dict[str, int] = defaultdict(int)

with LOG_FILE.open() as fh:
    for lineno, raw in enumerate(fh, start=1):
        raw = raw.strip()
        if not raw:
            continue  # skip blank lines

        try:
            entry = json.loads(raw)   # json.loads() parses a string
        except json.JSONDecodeError:
            print(f"Line {lineno}: not valid JSON — skipping", file=sys.stderr)
            continue

        # Extract fields safely with .get() — log schemas drift over time
        level    = entry.get("level", "info").lower()
        service  = entry.get("service", "unknown")
        duration = entry.get("duration_ms")

        if level in ("error", "fatal"):
            error_count += 1
            service_errors[service] += 1
            # Print structured error summary to stdout
            print(json.dumps({
                "ts":      entry.get("timestamp"),
                "service": service,
                "msg":     entry.get("message", ""),
                "trace":   entry.get("trace_id"),
            }))

        if isinstance(duration, (int, float)):
            latencies.append(duration)

# Summary to stderr so it doesn't pollute piped JSON output
if latencies:
    avg = sum(latencies) / len(latencies)
    p95 = sorted(latencies)[int(len(latencies) * 0.95)]
    print(f"\\nLatency — avg: {avg:.1f}ms  p95: {p95:.1f}ms", file=sys.stderr)

print(f"Errors: {error_count}", file=sys.stderr)
for svc, count in sorted(service_errors.items(), key=lambda x: -x[1]):
    print(f"  {svc}: {count}", file=sys.stderr)`,
        },
      ],
    },
    {
      title: {
        en: "Parsing JSON and YAML",
        np: "JSON र YAML parse गर्नुहोस्",
        jp: "JSON と YAML の解析",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Config file format comparison — when to use each",
            np: "Config file format तुलना — कहिले कुन प्रयोग गर्ने",
            jp: "設定ファイル形式の比較 — どれをいつ使うか",
          },
          headers: [
            { en: "Format", np: "Format", jp: "形式" },
            { en: "Load function", np: "Load function", jp: "読み込み関数" },
            { en: "Primary use case", np: "मुख्य use case", jp: "主なユースケース" },
            { en: "Standard library?", np: "Standard library?", jp: "標準ライブラリ？" },
          ],
          rows: [
            [
              { en: "JSON", np: "JSON", jp: "JSON" },
              { en: "json.load(f) / json.loads(s)", np: "json.load(f) / json.loads(s)", jp: "json.load(f) / json.loads(s)" },
              { en: "API responses, structured app logs", np: "API response, structured app log", jp: "API レスポンス・構造化ログ" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
            [
              { en: "YAML", np: "YAML", jp: "YAML" },
              { en: "yaml.safe_load(f)", np: "yaml.safe_load(f)", jp: "yaml.safe_load(f)" },
              { en: "Kubernetes manifests, CI/CD configs", np: "Kubernetes manifest, CI/CD config", jp: "Kubernetes マニフェスト・CI/CD 設定" },
              { en: "No (pip install pyyaml)", np: "होइन (pip install pyyaml)", jp: "いいえ（pip install pyyaml）" },
            ],
            [
              { en: "TOML", np: "TOML", jp: "TOML" },
              { en: "tomllib.load(f) (Python 3.11+)", np: "tomllib.load(f) (Python 3.11+)", jp: "tomllib.load(f)（Python 3.11+）" },
              { en: "pyproject.toml, Rust/Go tool configs", np: "pyproject.toml, Rust/Go tool config", jp: "pyproject.toml・Rust/Go ツール設定" },
              { en: "Yes (3.11+)", np: "हो (3.11+)", jp: "はい（3.11+）" },
            ],
            [
              { en: "INI", np: "INI", jp: "INI" },
              { en: "configparser.ConfigParser()", np: "configparser.ConfigParser()", jp: "configparser.ConfigParser()" },
              { en: "Legacy app configs, MySQL my.cnf", np: "Legacy app config, MySQL my.cnf", jp: "レガシーアプリ設定・MySQL my.cnf" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Loading, merging, and dumping JSON and YAML configs",
            np: "JSON र YAML config load, merge, र dump गर्नुहोस्",
            jp: "JSON・YAML 設定の読み込み・マージ・書き出し",
          },
          code: `#!/usr/bin/env python3
"""Load a base config (JSON) and overlay environment overrides (YAML)."""
import json
import yaml   # pip install pyyaml
import sys
from pathlib import Path

# --- JSON ---
def load_json(path: str) -> dict:
    with open(path) as f:
        return json.load(f)       # json.load() reads from a file object

base_cfg = load_json("config/base.json")

# Pretty-print JSON output (useful for debugging configs)
print(json.dumps(base_cfg, indent=2, sort_keys=True))

# Dump back to string for writing or sending over HTTP
payload = json.dumps({"status": "ok", "version": base_cfg.get("version")})

# --- YAML ---
def load_yaml(path: str) -> dict:
    with open(path) as f:
        return yaml.safe_load(f)  # safe_load prevents arbitrary code execution

env_override = load_yaml("config/production.yaml")

# Deep merge: overlay overrides on top of base
def deep_merge(base: dict, override: dict) -> dict:
    result = base.copy()
    for key, val in override.items():
        if isinstance(val, dict) and isinstance(result.get(key), dict):
            result[key] = deep_merge(result[key], val)
        else:
            result[key] = val
    return result

final_cfg = deep_merge(base_cfg, env_override)

# Access nested keys safely
db_host = final_cfg.get("database", {}).get("host", "localhost")
db_port = final_cfg.get("database", {}).get("port", 5432)
print(f"Connecting to {db_host}:{db_port}")

# Write merged config back as YAML (useful for generating k8s ConfigMaps)
with open("/tmp/merged-config.yaml", "w") as f:
    yaml.dump(final_cfg, f, default_flow_style=False, sort_keys=True)`,
        },
      ],
    },
    {
      title: {
        en: "CSV and TSV with the csv module",
        np: "csv module सँग CSV र TSV",
        jp: "csv モジュールを使った CSV・TSV 処理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Python's standard library csv module handles quoting, escaped commas, and different delimiters out of the box. Use csv.reader when you know the column positions by index. Use csv.DictReader when the first row is a header — you get each row as a dict keyed by column name, which makes the code self-documenting and resilient to column reordering. Reach for pandas when you need groupby, join, pivot, or statistical operations; for simple row-by-row filtering and transformation, the stdlib csv module is faster to import, easier to deploy, and requires no extra dependencies.",
            np: "Python को standard library csv module ले quoting, escaped comma, र फरक delimiter आफैले handle गर्छ। Column position index द्वारा थाहा हुँदा csv.reader प्रयोग गर्नुहोस्। पहिलो row header हुँदा csv.DictReader प्रयोग गर्नुहोस् — प्रत्येक row column name द्वारा key गरिएको dict को रूपमा पाइन्छ, जसले code self-documenting र column reordering मा resilient बनाउँछ। Groupby, join, pivot, वा statistical operation चाहिँदा pandas को सहारा लिनुहोस्; simple row-by-row filtering र transformation का लागि stdlib csv module छिटो import हुन्छ, deploy गर्न सजिलो छ, र कुनै extra dependency चाहिँदैन।",
            jp: "Python の標準ライブラリ csv モジュールは、クォート処理・エスケープされたカンマ・さまざまな区切り文字をすぐに使える形で処理します。列の位置をインデックスで知っている場合は csv.reader を使いましょう。最初の行がヘッダーの場合は csv.DictReader を使います — 各行は列名をキーとした辞書として取得でき、コードが自己文書化され、列の並び替えにも強くなります。groupby・join・pivot・統計的な操作が必要なときは pandas を使いましょう。シンプルな行単位のフィルタリングと変換には stdlib csv モジュールの方がインポートが速く、デプロイが簡単で、追加の依存関係が不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "DictReader — filter rows and write processed output CSV",
            np: "DictReader — row filter गर्नुहोस् र processed output CSV लेख्नुहोस्",
            jp: "DictReader — 行をフィルタリングして処理済み CSV を書き出す",
          },
          code: `#!/usr/bin/env python3
"""Read a deployment metrics CSV, filter failures, write a summary CSV."""
import csv
import sys
from pathlib import Path

INPUT  = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("deployments.csv")
OUTPUT = Path("failed-deployments.csv")

# Example input CSV:
# deploy_id,service,env,status,duration_s,deployer
# d-001,api,production,success,42,alice
# d-002,worker,staging,failed,7,bob

fieldnames_out = ["deploy_id", "service", "env", "duration_s", "deployer"]

failed = []

with INPUT.open(newline="") as infile:
    reader = csv.DictReader(infile)          # first row becomes column keys

    if reader.fieldnames is None:
        print("Empty or header-less CSV", file=sys.stderr)
        sys.exit(1)

    for row in reader:
        if row["status"].strip().lower() == "failed":
            failed.append({k: row[k] for k in fieldnames_out if k in row})

print(f"Found {len(failed)} failed deployments", file=sys.stderr)

with OUTPUT.open("w", newline="") as outfile:
    writer = csv.DictWriter(outfile, fieldnames=fieldnames_out)
    writer.writeheader()
    writer.writerows(failed)

print(f"Written to {OUTPUT}", file=sys.stderr)

# --- Reading TSV (tab-separated) ---
# Just pass delimiter='\\t' to reader/DictReader
with open("metrics.tsv", newline="") as f:
    reader = csv.DictReader(f, delimiter="\\t")
    for row in reader:
        print(row["latency_ms"])`,
        },
      ],
    },
    {
      title: {
        en: "Regex for unstructured logs",
        np: "Unstructured log का लागि regex",
        jp: "非構造化ログのための正規表現",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The nginx and Apache combined log format puts fields in a fixed order, but separated by spaces and quotes rather than a delimiter you can split on cleanly. Regular expressions with named capture groups are the right tool. Name every group ((?P<name>...)) — it makes the code self-documenting and lets you extract dict-like results with match.groupdict(). Always re.compile() your pattern outside the loop; compiled patterns are significantly faster when you are matching millions of lines.",
            np: "Nginx र Apache combined log format ले field लाई fixed order मा राख्छ, तर cleanly split गर्न सकिने delimiter को सट्टा space र quote ले छुट्याइएको हुन्छ। Named capture group सहितको regular expression नै सही tool हो। हरेक group लाई नाम दिनुहोस् ((?P<name>...)) — यसले code self-documenting बनाउँछ र match.groupdict() सँग dict-जस्तो result निकाल्न दिन्छ। आफ्नो pattern लाई loop बाहिर सधैं re.compile() गर्नुहोस्; compiled pattern ले लाखौं line match गर्दा उल्लेखनीय रूपमा छिटो हुन्छ।",
            jp: "nginx と Apache の combined log 形式はフィールドを固定順序で配置しますが、きれいに分割できる区切り文字ではなくスペースとクォートで区切られています。名前付きキャプチャグループを持つ正規表現が適切なツールです。すべてのグループに名前を付けましょう（(?P<name>...)）— コードが自己文書化され、match.groupdict() で辞書のような結果を取り出せます。ループの外で必ず re.compile() しておきましょう。コンパイル済みパターンは数百万行をマッチングするときに大幅に高速です。",
          },
        },
        {
          type: "code",
          title: {
            en: "nginx access log parser with named capture groups",
            np: "Named capture group सहितको nginx access log parser",
            jp: "名前付きキャプチャグループを使った nginx アクセスログパーサー",
          },
          code: `#!/usr/bin/env python3
"""Parse nginx combined access log and aggregate per-path request counts."""
import re
import sys
from collections import Counter
from pathlib import Path

# nginx combined log format:
# 10.0.0.1 - alice [10/May/2024:12:00:01 +0000] "GET /api/v1/users HTTP/1.1" 200 512 "-" "curl/7.88"
NGINX_PATTERN = re.compile(
    r'(?P<ip>\\S+)'                         # client IP
    r' \\S+ '                                # ident (always -)
    r'(?P<user>\\S+) '                      # auth user
    r'\\[(?P<time>[^\\]]+)\\] '             # timestamp
    r'"(?P<method>\\S+) '                   # HTTP method
    r'(?P<path>\\S+) '                      # request path
    r'(?P<proto>[^"]+)" '                   # protocol
    r'(?P<status>\\d{3}) '                  # status code
    r'(?P<bytes>\\d+|-) '                   # response bytes
    r'"(?P<referer>[^"]*)" '                # referer
    r'"(?P<agent>[^"]*)"'                   # user-agent
)

LOG_FILE = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("access.log")

path_counts: Counter = Counter()
status_counts: Counter = Counter()
parse_errors = 0

with LOG_FILE.open() as fh:
    for lineno, line in enumerate(fh, start=1):
        m = NGINX_PATTERN.match(line.strip())
        if not m:
            parse_errors += 1
            if parse_errors <= 3:
                print(f"No match at line {lineno}: {line[:80]!r}", file=sys.stderr)
            continue

        fields = m.groupdict()
        path   = fields["path"].split("?")[0]   # strip query string
        status = int(fields["status"])

        path_counts[path] += 1
        status_counts[status] += 1

print("\\nTop 10 paths:")
for path, count in path_counts.most_common(10):
    print(f"  {count:>8}  {path}")

print("\\nStatus distribution:")
for status, count in sorted(status_counts.items()):
    print(f"  {status}: {count}")

print(f"\\nParse errors: {parse_errors}", file=sys.stderr)`,
        },
      ],
    },
    {
      title: {
        en: "Structured logging in your own apps",
        np: "आफ्नै app मा structured logging",
        jp: "自分のアプリに構造化ログを組み込む",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The single highest-leverage thing you can do for observability is emit JSON from day one. The stdlib logging module supports it via a custom Formatter; the third-party structlog library makes it trivial and adds context chaining. With JSON logs you get free filtering with jq, free indexing in Elasticsearch or CloudWatch Logs Insights, and zero regex maintenance. Use RotatingFileHandler or StreamHandler to stdout and let your container runtime or log aggregator handle the rest.",
            np: "Observability का लागि तपाईंले गर्न सक्ने सबभन्दा उच्च-impact काम भनेको day one देखि JSON emit गर्नु हो। Stdlib logging module ले custom Formatter मार्फत यसलाई support गर्छ; third-party structlog library ले यसलाई trivial बनाउँछ र context chaining थप्छ। JSON log सँग तपाईंलाई jq सँग free filtering, Elasticsearch वा CloudWatch Logs Insights मा free indexing, र शून्य regex maintenance पाइन्छ। RotatingFileHandler वा stdout मा StreamHandler प्रयोग गर्नुहोस् र बाँकी container runtime वा log aggregator लाई सुम्पनुहोस्।",
            jp: "可観測性のために最も効果的にできることは、初日から JSON を出力することです。標準ライブラリの logging モジュールはカスタム Formatter を通じてこれをサポートしています。サードパーティの structlog ライブラリはこれを簡単にし、コンテキストチェーンを追加します。JSON ログがあれば、jq での無料フィルタリング、Elasticsearch や CloudWatch Logs Insights での無料インデックス化、正規表現のメンテナンス不要という恩恵を受けられます。RotatingFileHandler または stdout への StreamHandler を使い、残りはコンテナランタイムやログアグリゲーターに任せましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Configuring Python logging to emit JSON, then querying with jq",
            np: "Python logging लाई JSON emit गर्न configure गर्नुहोस्, त्यसपछि jq सँग query गर्नुहोस्",
            jp: "Python logging を JSON 出力に設定し、jq でクエリする",
          },
          code: `#!/usr/bin/env python3
"""Emit structured JSON logs from a Python service."""
import json
import logging
import sys
import traceback
from datetime import datetime, timezone

class JsonFormatter(logging.Formatter):
    """Format log records as single-line JSON objects."""

    SKIP_ATTRS = {
        "args", "exc_info", "exc_text", "filename", "funcName",
        "levelno", "lineno", "module", "msecs", "msg",
        "pathname", "process", "processName", "relativeCreated",
        "stack_info", "thread", "threadName",
    }

    def format(self, record: logging.LogRecord) -> str:
        entry: dict = {
            "timestamp": datetime.fromtimestamp(
                record.created, tz=timezone.utc
            ).isoformat(),
            "level":     record.levelname.lower(),
            "logger":    record.name,
            "message":   record.getMessage(),
        }
        if record.exc_info:
            entry["exception"] = self.formatException(record.exc_info)

        # Merge any extra= kwargs passed to the log call
        for key, val in record.__dict__.items():
            if key not in self.SKIP_ATTRS and not key.startswith("_"):
                entry[key] = val

        return json.dumps(entry, default=str)


def configure_logging(level: str = "INFO") -> None:
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JsonFormatter())
    logging.basicConfig(level=level, handlers=[handler])


configure_logging()
log = logging.getLogger("myservice")

# Usage
log.info("Server started", extra={"port": 8080, "env": "production"})
log.warning("Slow query", extra={"query": "SELECT * FROM orders", "duration_ms": 1240})

try:
    1 / 0
except ZeroDivisionError:
    log.exception("Unexpected error", extra={"request_id": "req-abc-123"})

# Query with jq on the command line:
#   python app.py 2>/dev/null | jq 'select(.level == "warning")'
#   python app.py 2>/dev/null | jq 'select(.duration_ms > 1000) | .query'`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a log analyzer script",
        np: "Hands-on: log analyzer script बनाउनुहोस्",
        jp: "実践：ログ解析スクリプトを構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Parse an nginx access log using the named-group regex pattern from Section 4 — accept the log file path as `sys.argv[1]`.",
              np: "Section 4 को named-group regex pattern प्रयोग गरेर nginx access log parse गर्नुहोस् — log file path `sys.argv[1]` को रूपमा स्वीकार गर्नुहोस्।",
              jp: "Section 4 の名前付きグループ正規表現パターンを使って nginx アクセスログを解析しましょう — ログファイルのパスを `sys.argv[1]` として受け取ります。",
            },
            {
              en: "Count unique client IPs using a `set` and print the total — this tells you how many distinct visitors hit the server.",
              np: "`set` प्रयोग गरेर unique client IP count गर्नुहोस् र total print गर्नुहोस् — यसले server मा कतिजना distinct visitor आए भनेर बताउँछ।",
              jp: "`set` を使って一意のクライアント IP を数え、合計を表示しましょう — これでサーバーに何件の異なる訪問者がいたかわかります。",
            },
            {
              en: "Find the top 5 paths by request count using `collections.Counter.most_common(5)` — strip query strings before counting.",
              np: "`collections.Counter.most_common(5)` प्रयोग गरेर request count द्वारा top 5 path खोज्नुहोस् — count गर्नु अघि query string हटाउनुहोस्।",
              jp: "`collections.Counter.most_common(5)` を使ってリクエスト数上位 5 パスを見つけましょう — カウント前にクエリ文字列を除去します。",
            },
            {
              en: "Collect all lines where the status code is 5xx (500–599) — print the IP, path, and timestamp for each; these are your server-side errors.",
              np: "Status code 5xx (500–599) भएका सबै line collect गर्नुहोस् — प्रत्येकको लागि IP, path, र timestamp print गर्नुहोस्; यिनीहरू तपाईंका server-side error हुन्।",
              jp: "ステータスコードが 5xx（500〜599）のすべての行を収集しましょう — それぞれの IP・パス・タイムスタンプを表示します。これらがサーバーサイドエラーです。",
            },
            {
              en: "Output a summary CSV with columns: `path, request_count, pct_of_total` — write it to `summary.csv` using `csv.DictWriter` and print the file path on completion.",
              np: "Columns: `path, request_count, pct_of_total` सहितको summary CSV output गर्नुहोस् — `csv.DictWriter` प्रयोग गरेर `summary.csv` मा लेख्नुहोस् र completion मा file path print गर्नुहोस्।",
              jp: "`path, request_count, pct_of_total` カラムを持つサマリー CSV を出力しましょう — `csv.DictWriter` を使って `summary.csv` に書き出し、完了時にファイルパスを表示します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between json.load() and json.loads()?",
        np: "json.load() र json.loads() बिचको फरक के हो?",
        jp: "json.load() と json.loads() の違いは何ですか？",
      },
      answer: {
        en: "`json.load(f)` reads from an open file object — it's what you use when you have a config file on disk. `json.loads(s)` parses a string — it's what you use when you receive JSON from an HTTP API response body or when you are processing a JSON Lines log where each line is a raw string. A common mistake is to open a file and pass the file path string to `json.loads()` rather than a file object to `json.load()`.",
        np: "`json.load(f)` ले open file object बाट पढ्छ — disk मा config file हुँदा यही प्रयोग गरिन्छ। `json.loads(s)` ले string parse गर्छ — HTTP API response body बाट JSON प्राप्त गर्दा वा JSON Lines log process गर्दा (जहाँ प्रत्येक line raw string हो) यही प्रयोग गरिन्छ। एउटा सामान्य गल्ती भनेको file खोलेर file object को सट्टा file path string `json.loads()` मा pass गर्नु हो।",
        jp: "`json.load(f)` は開いているファイルオブジェクトから読み込みます — ディスク上の設定ファイルがある場合に使います。`json.loads(s)` は文字列を解析します — HTTP API のレスポンスボディから JSON を受け取るときや、各行が生文字列の JSON Lines ログを処理するときに使います。よくある間違いは、ファイルを開いてファイルオブジェクトを `json.load()` に渡す代わりに、ファイルパス文字列を `json.loads()` に渡してしまうことです。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
    {
      question: {
        en: "When should I use pandas vs the csv module?",
        np: "pandas बनाम csv module कहिले प्रयोग गर्ने?",
        jp: "pandas と csv モジュールはどちらをいつ使うべきですか？",
      },
      answer: {
        en: "Use the stdlib csv module for simple row-by-row processing: filtering rows, renaming columns, writing output. It starts instantly, has no dependencies, and is safe to use in any environment. Reach for pandas when you need groupby aggregations, joins between two CSV files, pivot tables, or statistical summaries (mean, percentiles, std). Pandas loads the entire file into RAM, so for files larger than a few hundred MB it can be slow to start — profile before assuming it's the right choice.",
        np: "Simple row-by-row processing का लागि stdlib csv module प्रयोग गर्नुहोस्: row filter गर्ने, column rename गर्ने, output लेख्ने। यो instantly सुरु हुन्छ, कुनै dependency छैन, र कुनै पनि environment मा safe छ। Groupby aggregation, दुई CSV file बिच join, pivot table, वा statistical summary (mean, percentile, std) चाहिँदा pandas को सहारा लिनुहोस्। Pandas ले सम्पूर्ण file RAM मा load गर्छ, त्यसैले केही सय MB भन्दा ठूला file का लागि सुरु हुन ढिलो हुन सक्छ — सही choice मान्नु अघि profile गर्नुहोस्।",
        jp: "シンプルな行単位の処理には stdlib csv モジュールを使いましょう。行のフィルタリング・列の名前変更・出力の書き込みなどです。即座に起動し、依存関係がなく、あらゆる環境で安全に使えます。groupby 集計・2 つの CSV ファイル間の結合・ピボットテーブル・統計サマリー（平均・パーセンタイル・標準偏差）が必要なときは pandas を使いましょう。pandas はファイル全体を RAM に読み込むため、数百 MB を超えるファイルでは起動が遅くなることがあります — 適切な選択だと判断する前にプロファイリングしましょう。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
    {
      question: {
        en: "How do I handle log files larger than RAM?",
        np: "RAM भन्दा ठूला log file कसरी handle गर्ने?",
        jp: "RAM より大きなログファイルをどう扱えばよいですか？",
      },
      answer: {
        en: "Always process line by line — open the file in a with block and iterate over the file object directly (for line in fh:). Python's file iterator is a generator under the hood: it reads one line at a time into a small buffer and discards it before reading the next. Never call file.read() or file.readlines() on a multi-GB log — that loads the entire file into RAM and will cause your script to be killed by the OOM killer. If you need to process multiple passes (e.g., compute a per-line percentile), write intermediate results to a temp file between passes.",
        np: "सधैं line by line process गर्नुहोस् — file लाई with block मा खोल्नुहोस् र file object मा सिधै iterate गर्नुहोस् (for line in fh:)। Python को file iterator भित्रभित्रै generator हो: यसले एक पटकमा एउटा line सानो buffer मा पढ्छ र अर्को पढ्नु अघि त्यसलाई discard गर्छ। Multi-GB log मा कहिल्यै file.read() वा file.readlines() call नगर्नुहोस् — त्यसले सम्पूर्ण file RAM मा load गर्छ र script लाई OOM killer ले मार्छ। Multiple pass process गर्न परे (जस्तै per-line percentile compute गर्न), pass बिचमा intermediate result temporary file मा लेख्नुहोस्।",
        jp: "常に行単位で処理しましょう — with ブロックでファイルを開き、ファイルオブジェクトを直接イテレートします（for line in fh:）。Python のファイルイテレーターは内部的にジェネレーターです。一度に 1 行を小さなバッファに読み込み、次の行を読む前に破棄します。数 GB のログに対して file.read() や file.readlines() を呼び出さないでください — ファイル全体が RAM に読み込まれ、OOM キラーによってスクリプトが強制終了されます。複数パスの処理が必要な場合（例：行ごとのパーセンタイル計算）は、パスの間に中間結果を一時ファイルに書き出しましょう。",
      },
      tag: { en: "memory", np: "memory", jp: "メモリ" },
    },
  ],
};
