import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Modern infrastructure is API-driven. GitHub webhooks trigger pipelines. Slack notifies engineers of deploy status. PagerDuty receives incident alerts. AWS APIs provision servers. If you can write an HTTP request in Python, you can automate almost anything in a DevOps workflow — regardless of whether there is a dedicated CLI tool for it.",
    np: "आधुनिक infrastructure API-driven हो। GitHub webhook ले pipeline trigger गर्छ। Slack ले engineer लाई deploy status notify गर्छ। PagerDuty ले incident alert receive गर्छ। AWS API ले server provision गर्छ। यदि तपाईं Python मा HTTP request लेख्न सक्नुहुन्छ भने DevOps workflow मा प्रायः जे पनि automate गर्न सक्नुहुन्छ।",
    jp: "現代のインフラは API 駆動です。GitHub Webhook がパイプラインをトリガーします。Slack がエンジニアにデプロイ状況を通知します。PagerDuty がインシデントアラートを受け取ります。AWS API がサーバーをプロビジョニングします。Python で HTTP リクエストを書ければ、専用の CLI ツールがあるかどうかに関係なく、DevOps ワークフローのほぼすべてを自動化できます。",
  } as const,
  o2: {
    en: "Today you master the `requests` library, learn to authenticate with API keys and Bearer tokens, parse and produce JSON payloads, handle errors robustly, and build a real notification script that posts a deploy summary to Slack.",
    np: "आज तपाईंले `requests` library master गर्नुहुनेछ, API key र Bearer token सँग authenticate गर्न सिक्नुहुनेछ, JSON payload parse र produce गर्नुहुनेछ, error robustly handle गर्नुहुनेछ, र Slack मा deploy summary post गर्ने real notification script बनाउनुहुनेछ।",
    jp: "本日は `requests` ライブラリをマスターし、API キーと Bearer トークンで認証する方法を学び、JSON ペイロードを解析・生成し、エラーを堅牢に処理し、デプロイサマリーを Slack に投稿する本物の通知スクリプトを構築します。",
  } as const,
};

export const DEVOPS_DAY_24_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The requests library — HTTP for humans",
        np: "requests library — human का लागि HTTP",
        jp: "requests ライブラリ — 人間のための HTTP",
      },
      blocks: [
        { type: "diagram", id: "devops-cicd-pipeline" },
        {
          type: "code",
          title: {
            en: "GET, POST, headers, and authentication",
            np: "GET, POST, header, र authentication",
            jp: "GET・POST・ヘッダー・認証",
          },
          code: `#!/usr/bin/env python3
# pip install requests
import requests
import sys

# --- GET request ---
response = requests.get("https://api.github.com/repos/nginx/nginx")
print(response.status_code)        # 200
print(response.headers["Content-Type"])
data = response.json()             # parse JSON body
print(data["stargazers_count"])

# --- Timeout — ALWAYS set one in automation scripts ---
# Without a timeout, a hung server blocks your script forever
response = requests.get(
    "https://api.example.com/health",
    timeout=10,        # 10 second timeout (connect + read)
)

# --- Raise an exception for 4xx/5xx responses ---
try:
    response = requests.get("https://api.example.com/data", timeout=10)
    response.raise_for_status()    # raises HTTPError for 4xx/5xx
    data = response.json()
except requests.exceptions.HTTPError as exc:
    print(f"HTTP error: {exc.response.status_code} {exc.response.url}", file=sys.stderr)
    sys.exit(1)
except requests.exceptions.ConnectionError:
    print("Connection failed — is the service up?", file=sys.stderr)
    sys.exit(1)
except requests.exceptions.Timeout:
    print("Request timed out after 10s", file=sys.stderr)
    sys.exit(1)

# --- POST with JSON body ---
payload = {"text": "Deploy completed: myapp v1.4.2"}
response = requests.post(
    "https://hooks.slack.com/services/TOKEN",
    json=payload,       # automatically sets Content-Type: application/json
    timeout=10,
)
response.raise_for_status()

# --- Authentication ---
# API key in header
response = requests.get(
    "https://api.example.com/deployments",
    headers={"Authorization": "Bearer TOKEN_HERE"},
    timeout=10,
)

# Basic auth
response = requests.get(
    "https://registry.example.com/v2/",
    auth=("username", "password"),
    timeout=10,
)

# --- Query parameters ---
response = requests.get(
    "https://api.github.com/repos/owner/repo/commits",
    params={"per_page": 10, "sha": "main"},    # appended as ?per_page=10&sha=main
    timeout=10,
)`,
        },
      ],
    },
    {
      title: {
        en: "Using a Session for multiple requests",
        np: "धेरै request का लागि Session प्रयोग गर्नुहोस्",
        jp: "複数リクエストへの Session の使用",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "requests.Session — reuse connections and headers",
            np: "requests.Session — connection र header reuse गर्नुहोस्",
            jp: "requests.Session — 接続とヘッダーの再利用",
          },
          code: `#!/usr/bin/env python3
import requests
import os

# Session reuses TCP connections (faster for multiple requests to same host)
# and lets you set default headers/auth once
class GitHubClient:
    BASE_URL = "https://api.github.com"

    def __init__(self, token: str):
        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github.v3+json",
            "X-GitHub-Api-Version": "2022-11-28",
        })
        self.session.timeout = 15

    def get_repo(self, owner: str, repo: str) -> dict:
        resp = self.session.get(f"{self.BASE_URL}/repos/{owner}/{repo}")
        resp.raise_for_status()
        return resp.json()

    def create_release(self, owner: str, repo: str, tag: str, body: str) -> dict:
        resp = self.session.post(
            f"{self.BASE_URL}/repos/{owner}/{repo}/releases",
            json={"tag_name": tag, "name": f"Release {tag}", "body": body},
        )
        resp.raise_for_status()
        return resp.json()

    def list_workflow_runs(self, owner: str, repo: str, status: str = "failure") -> list:
        resp = self.session.get(
            f"{self.BASE_URL}/repos/{owner}/{repo}/actions/runs",
            params={"status": status, "per_page": 5},
        )
        resp.raise_for_status()
        return resp.json()["workflow_runs"]


# Usage
github = GitHubClient(token=os.environ["GITHUB_TOKEN"])
repo = github.get_repo("owner", "myapp")
print(f"Default branch: {repo['default_branch']}")
print(f"Open issues: {repo['open_issues_count']}")`,
        },
      ],
    },
    {
      title: {
        en: "Handling pagination",
        np: "Pagination handle गर्नुहोस्",
        jp: "ページネーションの処理",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Iterating paginated API responses",
            np: "Paginated API response iterate गर्नुहोस्",
            jp: "ページネーションされた API レスポンスを反復処理する",
          },
          code: `#!/usr/bin/env python3
import requests
from typing import Generator

def paginate(session: requests.Session, url: str, **kwargs) -> Generator[dict, None, None]:
    """Yield items from a GitHub-style paginated API."""
    while url:
        resp = session.get(url, **kwargs)
        resp.raise_for_status()
        yield from resp.json()

        # GitHub uses Link header: <url>; rel="next"
        link = resp.links.get("next", {})
        url = link.get("url")   # None on last page → loop ends


def paginate_offset(session: requests.Session, url: str, page_size: int = 100):
    """Yield items from an offset-based paginated API."""
    page = 1
    while True:
        resp = session.get(url, params={"page": page, "per_page": page_size})
        resp.raise_for_status()
        items = resp.json()
        if not items:
            break
        yield from items
        if len(items) < page_size:
            break   # last page
        page += 1


# Collect all open PRs across pages
session = requests.Session()
session.headers["Authorization"] = "Bearer TOKEN"

all_prs = list(paginate(
    session,
    "https://api.github.com/repos/owner/repo/pulls",
    params={"state": "open", "per_page": 100},
))
print(f"Found {len(all_prs)} open PRs")`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: A real deploy notification script",
        np: "Hands-on: वास्तविक deploy notification script",
        jp: "ハンズオン: 本物のデプロイ通知スクリプト",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "notify_deploy.py — post a deploy summary to Slack",
            np: "notify_deploy.py — Slack मा deploy summary post गर्नुहोस्",
            jp: "notify_deploy.py — デプロイサマリーを Slack に投稿する",
          },
          code: `#!/usr/bin/env python3
"""Post a deploy notification to a Slack channel via Incoming Webhook.

Usage:
    export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."
    python notify_deploy.py --service myapp --version 1.4.2 --env production --status success
"""
import argparse
import os
import sys
import subprocess
import requests


def get_git_info() -> dict:
    """Collect git context for the notification."""
    def git(args):
        try:
            return subprocess.run(
                ["git"] + args, capture_output=True, text=True, check=True
            ).stdout.strip()
        except subprocess.CalledProcessError:
            return "unknown"

    return {
        "sha": git(["rev-parse", "--short", "HEAD"]),
        "author": git(["log", "-1", "--format=%an"]),
        "message": git(["log", "-1", "--format=%s"]),
    }


def post_slack(webhook_url: str, payload: dict) -> None:
    resp = requests.post(webhook_url, json=payload, timeout=10)
    resp.raise_for_status()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--service", required=True)
    parser.add_argument("--version", required=True)
    parser.add_argument("--env", required=True)
    parser.add_argument("--status", choices=["success", "failure", "started"], required=True)
    args = parser.parse_args()

    webhook_url = os.environ.get("SLACK_WEBHOOK_URL")
    if not webhook_url:
        print("SLACK_WEBHOOK_URL is not set", file=sys.stderr)
        sys.exit(1)

    git = get_git_info()
    icon = {"success": ":white_check_mark:", "failure": ":x:", "started": ":rocket:"}[args.status]
    color = {"success": "good", "failure": "danger", "started": "#439FE0"}[args.status]

    payload = {
        "attachments": [{
            "color": color,
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": f"{icon} *Deploy {args.status.upper()}*: "
                                f"\`{args.service}\` *{args.version}* → *{args.env}*",
                    },
                },
                {
                    "type": "context",
                    "elements": [
                        {"type": "mrkdwn", "text": f"Commit \`{git['sha']}\` by {git['author']}"},
                        {"type": "mrkdwn", "text": f"_{git['message']}_"},
                    ],
                },
            ],
        }]
    }

    try:
        post_slack(webhook_url, payload)
        print(f"Notified Slack: {args.service} {args.version} {args.status}")
    except requests.exceptions.RequestException as exc:
        print(f"Slack notification failed: {exc}", file=sys.stderr)
        # Non-fatal: don't fail the deploy because Slack is down
        sys.exit(0)


if __name__ == "__main__":
    main()`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I use `requests` or the built-in `urllib`?",
        np: "`requests` वा built-in `urllib` प्रयोग गर्ने?",
        jp: "`requests` と組み込みの `urllib` のどちらを使うべきか？",
      },
      answer: {
        en: "Use `requests` for all real scripts — it handles connection pooling, automatic JSON encoding/decoding, `raise_for_status()`, and authentication in a fraction of the code `urllib` requires. The only case for `urllib` is when you cannot install packages (some locked-down CI environments, AWS Lambda with tight size limits, or a standard library-only script meant to run on any Python). Even then, `http.client` from the stdlib is usable but verbose. For anything non-trivial, `requests` or `httpx` (async-capable) is the right choice.",
        np: "सबै real script का लागि `requests` प्रयोग गर्नुहोस् — यसले connection pooling, automatic JSON encoding/decoding, `raise_for_status()`, र authentication लाई `urllib` ले जति code चाहिन्छ त्यसको fraction मा handle गर्छ। `urllib` को case केवल package install गर्न नसकिने (केही locked-down CI environment, AWS Lambda) मा हो।",
        jp: "すべての実用的なスクリプトには `requests` を使いましょう。接続プーリング・自動 JSON エンコード/デコード・`raise_for_status()`・認証を、`urllib` に必要なコードのほんの一部で処理します。`urllib` を使うのは、パッケージをインストールできない場合（一部のロックされた CI 環境・サイズ制限の厳しい AWS Lambda）だけです。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
    {
      question: {
        en: "How do I handle API rate limits automatically?",
        np: "API rate limit automatically कसरी handle गर्ने?",
        jp: "API レート制限を自動的に処理するには？",
      },
      answer: {
        en: "Check for a 429 response and respect the `Retry-After` header (seconds to wait). For GitHub, the `X-RateLimit-Remaining` header tells you how many requests are left. A simple retry wrapper: if response is 429, sleep for `int(response.headers.get('Retry-After', 60))` seconds then retry. For scripts that make large numbers of API calls, add a small `time.sleep(0.1)` between requests to stay under rate limits proactively.",
        np: "429 response check गर्नुहोस् र `Retry-After` header (कति सेकेन्ड कुर्ने) respect गर्नुहोस्। GitHub का लागि, `X-RateLimit-Remaining` header ले कति request बाँकी छ भन्छ। Simple retry wrapper: response 429 छ भने `int(response.headers.get('Retry-After', 60))` second sleep गर्नुहोस् र retry गर्नुहोस्।",
        jp: "429 レスポンスを確認し、`Retry-After` ヘッダー（待機する秒数）を尊重します。GitHub の場合、`X-RateLimit-Remaining` ヘッダーが残りリクエスト数を示します。シンプルなリトライラッパー：レスポンスが 429 なら `int(response.headers.get('Retry-After', 60))` 秒スリープしてリトライします。大量の API コールを行うスクリプトでは、予防的にリクエスト間に小さな `time.sleep(0.1)` を入れます。",
      },
      tag: { en: "python", np: "Python", jp: "Python" },
    },
  ],
};
