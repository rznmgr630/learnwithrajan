import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Raw shell scripts start simple and become unmaintainable fast. Python CLI tools are the answer: they self-document with --help, handle errors gracefully, are installable as proper commands, and are testable with standard unit test frameworks. Today you build real, distributable CLI tools — the kind that end up in your team's internal toolbox and stay there for years.",
    np: "Raw shell script सुरुमा simple लाग्छ तर छिट्टै unmaintainable हुन्छ। Python CLI tool उत्तर हो: यसले --help सहित self-document गर्छ, error gracefully handle गर्छ, proper command को रूपमा install गर्न सकिन्छ, र standard unit test framework सँग test गर्न सकिन्छ। आज तपाईंले real, distributable CLI tool बनाउनुहुनेछ — जुन team को internal toolbox मा पुग्छ र वर्षौं टिक्छ।",
    jp: "生のシェルスクリプトははじめはシンプルで、すぐに保守不能になります。Python CLI ツールが答えです。--help で自己ドキュメント化し、エラーを適切に処理し、適切なコマンドとしてインストールでき、標準的な単体テストフレームワークでテストできます。今日はチームの内部ツールボックスに入り、何年も使われ続けるような、本物の配布可能な CLI ツールを構築します。",
  } as const,
  o2: {
    en: "You will compare three Python CLI frameworks — argparse (stdlib, zero dependencies), Click (decorator-based, battle-tested), and Typer (type-hint-driven, best developer experience today) — then package your tool so anyone on the team can install it with a single pip command.",
    np: "तपाईंले तीन Python CLI framework तुलना गर्नुहुनेछ — argparse (stdlib, zero dependency), Click (decorator-based, battle-tested), र Typer (type-hint-driven, आजको best developer experience) — त्यसपछि tool package गर्नुहुनेछ जसलाई team को जो कोहीले एउटै pip command ले install गर्न सकोस्।",
    jp: "3 つの Python CLI フレームワーク — argparse（stdlib、依存関係ゼロ）・Click（デコレーターベース、実績あり）・Typer（型ヒント駆動、現在最高の開発者体験）— を比較し、チームの誰もが単一の pip コマンドでインストールできるようにツールをパッケージ化します。",
  } as const,
};

export const DEVOPS_DAY_28_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Why Python CLI tools beat raw scripts",
        np: "Python CLI tool किन raw script भन्दा राम्रो",
        jp: "Python CLI ツールが生スクリプトより優れている理由",
      },
      blocks: [
        { type: "diagram", id: "devops-cli-tool" },
        {
          type: "paragraph",
          text: {
            en: "A raw Bash script has no --help, crashes with cryptic errors, and cannot be installed as a first-class command. Python CLI tools fix all three problems. The three main choices are: **argparse** (built into stdlib — verbose, but always available, no pip install needed), **Click** (decorator-based, readable, the industry workhorse since 2014), and **Typer** (wraps Click, driven by Python type hints, generates help text and validation automatically — the best DX for new projects today). Pick Typer for new tools unless you have a strong reason not to.",
            np: "Raw Bash script मा --help छैन, cryptic error सँग crash हुन्छ, र first-class command को रूपमा install गर्न सकिँदैन। Python CLI tool यी तीनै समस्या ठीक गर्छ। तीन मुख्य choice: **argparse** (stdlib मा built-in — verbose, तर सधैं उपलब्ध, pip install चाहिँदैन), **Click** (decorator-based, readable, 2014 देखि industry workhorse), र **Typer** (Click wrap गर्छ, Python type hint ले driven, automatically help text र validation generate गर्छ — आज नयाँ project का लागि best DX)। नयाँ tool का लागि Typer रोज्नुहोस् जबसम्म बलियो कारण नभएसम्म।",
            jp: "生の Bash スクリプトには --help がなく、不可解なエラーでクラッシュし、ファーストクラスのコマンドとしてインストールできません。Python CLI ツールはこの 3 つの問題をすべて解決します。主な選択肢は 3 つです：**argparse**（stdlib に組み込み — 冗長ですが常に利用可能、pip install 不要）、**Click**（デコレーターベース、読みやすい、2014 年からの業界の主力）、**Typer**（Click をラップ、Python 型ヒントで駆動、ヘルプテキストとバリデーションを自動生成 — 今日の新規プロジェクトに最高の DX）。強い理由がなければ新しいツールには Typer を選びましょう。",
          },
        },
      ],
    },
    {
      title: {
        en: "argparse — the stdlib baseline",
        np: "argparse — stdlib baseline",
        jp: "argparse — stdlib のベースライン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "argparse supports subcommands (called sub-parsers), positional arguments, optional arguments with -- flags, type coercion (type=int), restricted choices (choices=['prod','staging']), and nargs for multiple values. It is the right choice when you cannot install third-party packages — for example, a bootstrap script that runs before your virtualenv exists.",
            np: "argparse ले subcommand (sub-parser भनिन्छ), positional argument, -- flag सहित optional argument, type coercion (type=int), restricted choice (choices=['prod','staging']), र multiple value का लागि nargs support गर्छ। यो सही choice हो जब third-party package install गर्न सकिँदैन — उदाहरणका लागि, virtualenv अस्तित्वमा आउनु अघि चल्ने bootstrap script।",
            jp: "argparse はサブコマンド（サブパーサーと呼ばれる）・位置引数・-- フラグを持つオプション引数・型強制（type=int）・制限された選択肢（choices=['prod','staging']）・複数値のための nargs をサポートします。virtualenv が存在する前に実行されるブートストラップスクリプトなど、サードパーティパッケージをインストールできない場合に適した選択肢です。",
          },
        },
        {
          type: "code",
          title: {
            en: "deploy CLI with argparse subcommands",
            np: "argparse subcommand सहितको deploy CLI",
            jp: "argparse サブコマンドを使った deploy CLI",
          },
          code: `#!/usr/bin/env python3
"""deploy — a service deployment CLI built with argparse."""
import argparse
import sys
import subprocess

def cmd_start(args):
    print(f"[deploy] Starting service in {args.env} ({args.region})")
    # Real implementation would call your deployment API / kubectl / etc.
    subprocess.run(
        ["kubectl", "rollout", "restart", f"deployment/myapp-{args.env}"],
        check=True,
    )

def cmd_status(args):
    result = subprocess.run(
        ["kubectl", "rollout", "status", f"deployment/myapp-{args.env}"],
        capture_output=True, text=True,
    )
    print(result.stdout)
    if result.returncode != 0:
        print(result.stderr, file=sys.stderr)
        sys.exit(1)

def cmd_rollback(args):
    confirm = input(f"Roll back {args.env}? [y/N] ")
    if confirm.lower() != "y":
        print("Aborted.")
        sys.exit(0)
    subprocess.run(
        ["kubectl", "rollout", "undo", f"deployment/myapp-{args.env}"],
        check=True,
    )

def build_parser():
    parser = argparse.ArgumentParser(
        description="Deploy services to Kubernetes",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    sub = parser.add_subparsers(dest="command", required=True)

    # deploy start --env production --region us-east-1
    start = sub.add_parser("start", help="Roll out a new version")
    start.add_argument("--env", choices=["production", "staging", "dev"],
                       default="staging", help="Target environment")
    start.add_argument("--region", default="us-east-1",
                       help="AWS region (default: us-east-1)")
    start.set_defaults(func=cmd_start)

    # deploy status --env production
    status = sub.add_parser("status", help="Check rollout status")
    status.add_argument("--env", choices=["production", "staging", "dev"],
                        default="staging")
    status.set_defaults(func=cmd_status)

    # deploy rollback
    rollback = sub.add_parser("rollback", help="Undo the last rollout")
    rollback.add_argument("--env", choices=["production", "staging", "dev"],
                          default="staging")
    rollback.set_defaults(func=cmd_rollback)

    return parser

if __name__ == "__main__":
    args = build_parser().parse_args()
    args.func(args)`,
        },
      ],
    },
    {
      title: {
        en: "Click — decorator-based CLIs",
        np: "Click — decorator-based CLI",
        jp: "Click — デコレーターベースの CLI",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`@click.command()` turns a function into a CLI command. `@click.option()` adds -- flags with types, defaults, and help text. `@click.argument()` adds positional arguments. `@click.group()` creates a subcommand group. Click also provides built-in prompts (`prompt=True`), confirmation (`click.confirm()`), and ANSI colors via `click.echo(click.style('text', fg='green'))` — no third-party color library needed.",
            np: "`@click.command()` ले function लाई CLI command मा बदल्छ। `@click.option()` ले type, default, र help text सहित -- flag थप्छ। `@click.argument()` ले positional argument थप्छ। `@click.group()` ले subcommand group बनाउँछ। Click ले built-in prompt (`prompt=True`), confirmation (`click.confirm()`), र `click.echo(click.style('text', fg='green'))` मार्फत ANSI color पनि provide गर्छ।",
            jp: "`@click.command()` は関数を CLI コマンドに変換します。`@click.option()` は型・デフォルト値・ヘルプテキスト付きの -- フラグを追加します。`@click.argument()` は位置引数を追加します。`@click.group()` はサブコマンドグループを作成します。Click は組み込みのプロンプト（`prompt=True`）・確認（`click.confirm()`）・`click.echo(click.style('text', fg='green'))` による ANSI カラーも提供します。",
          },
        },
        {
          type: "code",
          title: {
            en: "same deploy CLI rewritten in Click",
            np: "Click मा rewrite गरिएको उही deploy CLI",
            jp: "Click で書き直した同じ deploy CLI",
          },
          code: `#!/usr/bin/env python3
"""deploy — rewritten with Click. Notice how much cleaner this is."""
import subprocess
import sys
import click

ENV_CHOICES = click.Choice(["production", "staging", "dev"], case_sensitive=False)

@click.group()
def cli():
    """Deploy services to Kubernetes."""

@cli.command()
@click.option("--env", "-e", type=ENV_CHOICES, default="staging", show_default=True,
              help="Target environment")
@click.option("--region", "-r", default="us-east-1", show_default=True,
              help="AWS region")
def start(env, region):
    """Roll out a new version."""
    click.echo(click.style(f"Starting deployment to {env} ({region})", fg="cyan"))
    subprocess.run(
        ["kubectl", "rollout", "restart", f"deployment/myapp-{env}"],
        check=True,
    )
    click.echo(click.style("Deployment triggered.", fg="green"))

@cli.command()
@click.option("--env", "-e", type=ENV_CHOICES, default="staging", show_default=True)
def status(env):
    """Check rollout status."""
    result = subprocess.run(
        ["kubectl", "rollout", "status", f"deployment/myapp-{env}"],
        capture_output=True, text=True,
    )
    click.echo(result.stdout)
    if result.returncode != 0:
        click.echo(click.style(result.stderr, fg="red"), err=True)
        sys.exit(1)

@cli.command()
@click.option("--env", "-e", type=ENV_CHOICES, default="staging", show_default=True)
def rollback(env):
    """Undo the last rollout."""
    click.confirm(f"Roll back {env}?", abort=True)   # aborts with exit code 1 if No
    click.echo(click.style(f"Rolling back {env}...", fg="yellow"))
    subprocess.run(
        ["kubectl", "rollout", "undo", f"deployment/myapp-{env}"],
        check=True,
    )
    click.echo(click.style("Rollback complete.", fg="green"))

if __name__ == "__main__":
    cli()

# Usage:
#   python deploy.py start --env production --region us-east-1
#   python deploy.py status --env staging
#   python deploy.py rollback --env production`,
        },
      ],
    },
    {
      title: {
        en: "Typer — modern type-hint-driven CLIs",
        np: "Typer — modern type-hint-driven CLI",
        jp: "Typer — モダンな型ヒント駆動の CLI",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Typer wraps Click and lets Python type hints do the heavy lifting. You annotate function parameters with types like `str`, `int`, `bool`, or `Enum`, and Typer generates the CLI options, validation, and --help text automatically. For new projects Typer is the best choice: 50% less boilerplate than argparse, fully type-checked by mypy, and the generated --help output is beautiful out of the box.",
            np: "Typer ले Click wrap गर्छ र Python type hint लाई heavy lifting गर्न दिन्छ। तपाईं function parameter लाई `str`, `int`, `bool`, वा `Enum` जस्ता type ले annotate गर्नुहुन्छ, र Typer ले automatically CLI option, validation, र --help text generate गर्छ। नयाँ project का लागि Typer सर्वोत्तम choice: argparse भन्दा 50% कम boilerplate, mypy ले fully type-checked, र generated --help output box बाट नै राम्रो।",
            jp: "Typer は Click をラップし、Python の型ヒントに重労働をさせます。関数パラメータに `str`・`int`・`bool`・`Enum` などの型を注釈付けすると、Typer が CLI オプション・バリデーション・--help テキストを自動的に生成します。新規プロジェクトには Typer が最善の選択肢です：argparse より 50% 少ないボイラープレート、mypy による完全な型チェック、生成された --help 出力はそのままで美しい。",
          },
        },
        {
          type: "code",
          title: {
            en: "Typer version of the deploy CLI — 50% less code",
            np: "Typer version को deploy CLI — 50% कम code",
            jp: "deploy CLI の Typer バージョン — コードが 50% 減",
          },
          code: `#!/usr/bin/env python3
"""deploy — Typer version. Type hints ARE the CLI definition."""
from enum import Enum
import subprocess
import sys
import typer

app = typer.Typer(help="Deploy services to Kubernetes.", add_completion=False)

class Env(str, Enum):
    production = "production"
    staging    = "staging"
    dev        = "dev"

@app.command()
def start(
    env: Env = typer.Option(Env.staging, "--env", "-e", help="Target environment"),
    region: str = typer.Option("us-east-1", "--region", "-r", help="AWS region"),
):
    """Roll out a new version."""
    typer.echo(typer.style(f"Starting deployment to {env.value} ({region})", fg=typer.colors.CYAN))
    subprocess.run(
        ["kubectl", "rollout", "restart", f"deployment/myapp-{env.value}"],
        check=True,
    )
    typer.echo(typer.style("Deployment triggered.", fg=typer.colors.GREEN))

@app.command()
def status(
    env: Env = typer.Option(Env.staging, "--env", "-e"),
):
    """Check rollout status."""
    result = subprocess.run(
        ["kubectl", "rollout", "status", f"deployment/myapp-{env.value}"],
        capture_output=True, text=True,
    )
    typer.echo(result.stdout)
    if result.returncode != 0:
        typer.echo(typer.style(result.stderr, fg=typer.colors.RED), err=True)
        raise typer.Exit(code=1)

@app.command()
def rollback(
    env: Env = typer.Option(Env.staging, "--env", "-e"),
    yes: bool = typer.Option(False, "--yes", "-y", help="Skip confirmation"),
):
    """Undo the last rollout."""
    if not yes:
        typer.confirm(f"Roll back {env.value}?", abort=True)
    typer.echo(typer.style(f"Rolling back {env.value}...", fg=typer.colors.YELLOW))
    subprocess.run(
        ["kubectl", "rollout", "undo", f"deployment/myapp-{env.value}"],
        check=True,
    )
    typer.echo(typer.style("Rollback complete.", fg=typer.colors.GREEN))

if __name__ == "__main__":
    app()`,
        },
      ],
    },
    {
      title: {
        en: "Packaging and distributing your CLI",
        np: "CLI package र distribute गर्नुहोस्",
        jp: "CLI のパッケージングと配布",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "CLI distribution methods — trade-offs",
            np: "CLI distribution method — trade-off",
            jp: "CLI 配布方法 — トレードオフ",
          },
          headers: [
            { en: "Method", np: "Method", jp: "方法" },
            { en: "How", np: "कसरी", jp: "方法" },
            { en: "Audience", np: "Audience", jp: "対象者" },
            { en: "Trade-off", np: "Trade-off", jp: "トレードオフ" },
          ],
          rows: [
            [
              { en: "pyproject.toml entry_points", np: "pyproject.toml entry_points", jp: "pyproject.toml entry_points" },
              { en: "pip install .", np: "pip install .", jp: "pip install ." },
              { en: "Python developers", np: "Python developer", jp: "Python 開発者" },
              { en: "Requires Python; simplest for internal tools", np: "Python चाहिन्छ; internal tool का लागि simplest", jp: "Python が必要；内部ツールに最もシンプル" },
            ],
            [
              { en: "pipx install", np: "pipx install", jp: "pipx install" },
              { en: "pipx install git+https://...", np: "pipx install git+https://...", jp: "pipx install git+https://..." },
              { en: "Python developers", np: "Python developer", jp: "Python 開発者" },
              { en: "Isolated install, no venv management needed", np: "Isolated install, venv manage गर्न आवश्यक छैन", jp: "隔離されたインストール、venv 管理不要" },
            ],
            [
              { en: "Homebrew tap", np: "Homebrew tap", jp: "Homebrew tap" },
              { en: "brew install myorg/tap/mytool", np: "brew install myorg/tap/mytool", jp: "brew install myorg/tap/mytool" },
              { en: "macOS users", np: "macOS user", jp: "macOS ユーザー" },
              { en: "Great UX; requires maintaining a tap repo", np: "राम्रो UX; tap repo maintain गर्न आवश्यक", jp: "優れた UX；tap リポジトリの管理が必要" },
            ],
            [
              { en: "Docker image", np: "Docker image", jp: "Docker イメージ" },
              { en: "docker run myorg/mytool", np: "docker run myorg/mytool", jp: "docker run myorg/mytool" },
              { en: "Any platform", np: "कुनै पनि platform", jp: "任意のプラットフォーム" },
              { en: "Most portable; Docker required; slower startup", np: "सबैभन्दा portable; Docker चाहिन्छ; slower startup", jp: "最も移植性が高い；Docker 必要；起動が遅い" },
            ],
            [
              { en: "PyInstaller binary", np: "PyInstaller binary", jp: "PyInstaller バイナリ" },
              { en: "Single-file executable", np: "Single-file executable", jp: "単一ファイル実行可能ファイル" },
              { en: "Non-Python users", np: "Non-Python user", jp: "非 Python ユーザー" },
              { en: "No Python needed; large file (50–100 MB)", np: "Python चाहिँदैन; ठूलो file (50–100 MB)", jp: "Python 不要；大きなファイル（50〜100 MB）" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "pyproject.toml with entry_point + local dev install",
            np: "entry_point + local dev install सहित pyproject.toml",
            jp: "entry_point + ローカル開発インストール付き pyproject.toml",
          },
          code: `# pyproject.toml  (PEP 517/518 — works with pip, poetry, hatch)
[build-system]
requires      = ["hatchling"]
build-backend = "hatchling.build"

[project]
name            = "deploy-cli"
version         = "0.1.0"
description     = "Internal deployment tool for ACME Engineering"
requires-python = ">=3.10"
dependencies    = [
    "typer>=0.9.0",
    "rich>=13.0.0",      # pretty terminal output
    "boto3>=1.34.0",     # AWS SDK
]

[project.scripts]
# After install, 'deploy' becomes a real shell command
deploy = "deploy_cli.main:app"

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "pytest-cov",
]

# --- Local development workflow ---
# 1. Create a venv
#    python3 -m venv .venv && source .venv/bin/activate
#
# 2. Install in editable mode (changes to source are reflected immediately)
#    pip install -e ".[dev]"
#
# 3. The 'deploy' command is now on PATH:
#    deploy start --env staging
#    deploy --help
#
# --- Publishing to a private PyPI (e.g., AWS CodeArtifact) ---
# pip install build twine
# python -m build
# twine upload --repository codeartifact dist/*`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a server-audit CLI tool",
        np: "Hands-on: server-audit CLI tool बनाउनुहोस्",
        jp: "ハンズオン：サーバー監査 CLI ツールを構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Scaffold the project: `mkdir saudit && cd saudit && python3 -m venv .venv && source .venv/bin/activate && pip install typer rich paramiko`",
              np: "Project scaffold गर्नुहोस्: `mkdir saudit && cd saudit && python3 -m venv .venv && source .venv/bin/activate && pip install typer rich paramiko`",
              jp: "プロジェクトのスキャフォールド：`mkdir saudit && cd saudit && python3 -m venv .venv && source .venv/bin/activate && pip install typer rich paramiko`",
            },
            {
              en: "Implement `saudit check --host server.internal` — SSH into the host using paramiko, run `df -h`, `free -m`, and `top -bn1`, capture output, and display a Rich table summarising disk/memory/CPU usage with colour-coded thresholds (green < 70%, yellow < 85%, red >= 85%).",
              np: "`saudit check --host server.internal` implement गर्नुहोस् — paramiko प्रयोग गरी host मा SSH गर्नुहोस्, `df -h`, `free -m`, र `top -bn1` run गर्नुहोस्, output capture गर्नुहोस्, र colour-coded threshold (green < 70%, yellow < 85%, red >= 85%) सहित disk/memory/CPU usage summarize गर्ने Rich table display गर्नुहोस्।",
              jp: "`saudit check --host server.internal` を実装 — paramiko を使ってホストに SSH し、`df -h`・`free -m`・`top -bn1` を実行し、出力をキャプチャし、色分けされたしきい値（green < 70%、yellow < 85%、red >= 85%）でディスク/メモリ/CPU 使用率を要約した Rich テーブルを表示します。",
            },
            {
              en: "Implement `saudit report --output csv` — run the same checks, then write results to a CSV file (`hostname, timestamp, disk_pct, mem_pct, cpu_pct`) so you can import it into a spreadsheet or feed it to a monitoring script.",
              np: "`saudit report --output csv` implement गर्नुहोस् — उही check run गर्नुहोस्, त्यसपछि CSV file मा result लेख्नुहोस् (`hostname, timestamp, disk_pct, mem_pct, cpu_pct`) जसलाई spreadsheet मा import वा monitoring script लाई feed गर्न सकिन्छ।",
              jp: "`saudit report --output csv` を実装 — 同じチェックを実行し、結果を CSV ファイル（`hostname, timestamp, disk_pct, mem_pct, cpu_pct`）に書き込んで、スプレッドシートにインポートしたりモニタリングスクリプトに渡せるようにします。",
            },
            {
              en: "Implement `saudit compare --host1 web1 --host2 web2` — run checks on both hosts in parallel using `concurrent.futures.ThreadPoolExecutor`, then display a side-by-side diff table highlighting any metric that differs by more than 10%.",
              np: "`saudit compare --host1 web1 --host2 web2` implement गर्नुहोस् — `concurrent.futures.ThreadPoolExecutor` प्रयोग गरी दुवै host मा parallel check run गर्नुहोस्, त्यसपछि 10% भन्दा बढी फरक हुने metric highlight गर्दै side-by-side diff table display गर्नुहोस्।",
              jp: "`saudit compare --host1 web1 --host2 web2` を実装 — `concurrent.futures.ThreadPoolExecutor` を使って両方のホストで並行してチェックを実行し、10% 以上異なる指標を強調表示したサイドバイサイドの差分テーブルを表示します。",
            },
            {
              en: "Package it: add a `pyproject.toml` with `[project.scripts] saudit = \"saudit.main:app\"`, run `pip install -e .`, and verify that `saudit --help` shows all three subcommands with their options.",
              np: "Package गर्नुहोस्: `pyproject.toml` मा `[project.scripts] saudit = \"saudit.main:app\"` थप्नुहोस्, `pip install -e .` run गर्नुहोस्, र `saudit --help` ले सबै तीन subcommand तिनीहरूको option सहित देखाउँछ भनी verify गर्नुहोस्।",
              jp: "パッケージ化：`pyproject.toml` に `[project.scripts] saudit = \"saudit.main:app\"` を追加し、`pip install -e .` を実行し、`saudit --help` がすべての 3 つのサブコマンドとそのオプションを表示することを確認します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "argparse, Click, or Typer — which should I use?",
        np: "argparse, Click, वा Typer — कुन प्रयोग गर्ने?",
        jp: "argparse・Click・Typer — どれを使うべき？",
      },
      answer: {
        en: "Typer for new projects — type hints give you validation, auto-generated help, and mypy compatibility with minimal boilerplate. Click if you need advanced plugin systems, complex callback chains, or your team already knows it well. argparse if you cannot add any dependencies — bootstrap scripts, scripts that run inside a minimal Docker image, or code shipped to customers who have only stdlib.",
        np: "नयाँ project का लागि Typer — type hint ले validation, auto-generated help, र minimal boilerplate सँग mypy compatibility दिन्छ। Click यदि तपाईंलाई advanced plugin system, complex callback chain चाहिन्छ, वा team ले यो राम्रो जान्दछ। argparse यदि कुनै dependency थप्न सकिँदैन — bootstrap script, minimal Docker image भित्र run हुने script, वा केवल stdlib भएका customer लाई ship गरिएको code।",
        jp: "新規プロジェクトには Typer — 型ヒントで最小限のボイラープレートでバリデーション・自動生成されたヘルプ・mypy 互換性が得られます。高度なプラグインシステム・複雑なコールバックチェーンが必要な場合、またはチームがすでに熟知している場合は Click。依存関係を追加できない場合は argparse — ブートストラップスクリプト・最小限の Docker イメージ内で実行されるスクリプト・stdlib しか持たない顧客に出荷するコード。",
      },
      tag: { en: "cli", np: "CLI", jp: "CLI" },
    },
    {
      question: {
        en: "How do I test CLI tools?",
        np: "CLI tool कसरी test गर्ने?",
        jp: "CLI ツールをどのようにテストするか？",
      },
      answer: {
        en: "Click provides `CliRunner` which invokes commands in-process (no subprocess spawn), captures stdout/stderr, and lets you assert on exit codes. Typer uses the exact same runner because it is built on Click. Example: `from click.testing import CliRunner; result = CliRunner().invoke(app, ['start', '--env', 'staging']); assert result.exit_code == 0`. This makes CLI testing as fast and straightforward as testing any other Python function.",
        np: "Click ले `CliRunner` provide गर्छ जसले command in-process invoke गर्छ (subprocess spawn छैन), stdout/stderr capture गर्छ, र exit code मा assert गर्न दिन्छ। Typer ले ठीक उही runner प्रयोग गर्छ किनभने यो Click मा built छ। Example: `from click.testing import CliRunner; result = CliRunner().invoke(app, ['start', '--env', 'staging']); assert result.exit_code == 0`।",
        jp: "Click は `CliRunner` を提供し、コマンドをインプロセスで呼び出し（サブプロセスの生成なし）、stdout/stderr をキャプチャし、終了コードのアサートができます。Typer は Click 上に構築されているため、まったく同じランナーを使用します。例：`from click.testing import CliRunner; result = CliRunner().invoke(app, ['start', '--env', 'staging']); assert result.exit_code == 0`。これにより CLI のテストが他の Python 関数のテストと同様に高速で簡単になります。",
      },
      tag: { en: "testing", np: "Testing", jp: "テスト" },
    },
    {
      question: {
        en: "How do I distribute a CLI to non-Python users?",
        np: "Non-Python user लाई CLI कसरी distribute गर्ने?",
        jp: "Python を使わないユーザーに CLI をどのように配布するか？",
      },
      answer: {
        en: "PyInstaller (`pip install pyinstaller && pyinstaller --onefile deploy.py`) creates a single binary that bundles the Python interpreter — no Python installation required on the target machine. Docker is the most portable option: wrap your tool in a minimal image and users run it with `docker run`. For macOS-heavy teams, a Homebrew tap is the best user experience. For Python-savvy teams, `pipx install` installs the tool in an isolated environment so it never conflicts with other packages.",
        np: "PyInstaller (`pip install pyinstaller && pyinstaller --onefile deploy.py`) ले Python interpreter bundle गरेको single binary बनाउँछ — target machine मा Python installation आवश्यक छैन। Docker सबैभन्दा portable option हो: tool लाई minimal image मा wrap गर्नुहोस् र user ले `docker run` ले run गर्छन्। macOS-heavy team का लागि Homebrew tap सर्वोत्तम user experience हो। Python-savvy team का लागि `pipx install` ले tool लाई isolated environment मा install गर्छ।",
        jp: "PyInstaller（`pip install pyinstaller && pyinstaller --onefile deploy.py`）は Python インタープリターをバンドルした単一バイナリを作成します — ターゲットマシンに Python インストールは不要です。Docker は最も移植性の高いオプションです：ツールを最小限のイメージにラップし、ユーザーは `docker run` で実行します。macOS 中心のチームには Homebrew tap が最高のユーザー体験です。Python に精通したチームには `pipx install` がツールを隔離された環境にインストールし、他のパッケージと競合しません。",
      },
      tag: { en: "packaging", np: "Packaging", jp: "パッケージング" },
    },
  ],
};
