import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A pipeline that only runs when you manually click 'Build Now' defeats the purpose of CI/CD. The real power comes from triggers — automatic mechanisms that detect a new commit, pull request, or scheduled time and kick off the pipeline immediately. Jenkins supports four trigger types: SCM polling (periodically checks the repository), webhooks (the repository pushes a notification to Jenkins instantly), scheduled builds (cron-like syntax), and upstream job triggers (one job triggers another). Understanding all four and knowing when to use each is a critical operational skill.",
    np: "Manual 'Build Now' click गर्दा मात्र run हुने pipeline ले CI/CD को purpose defeat गर्छ। Real power trigger बाट आउँछ — automatic mechanism जसले new commit, pull request, वा scheduled time detect गरी immediately pipeline kick off गर्छ। Jenkins ले चार trigger type support गर्छ: SCM polling (periodically repository check), webhook (repository ले instantly Jenkins लाई notification push), scheduled build (cron-like syntax), र upstream job trigger (एउटा job ले अर्को trigger गर्छ)। चारैवटा बुझ्नु र प्रत्येक कहिले प्रयोग गर्ने थाहा पाउनु critical operational skill हो।",
    jp: "手動で 'Build Now' をクリックしたときにのみ実行されるパイプラインは CI/CD の目的を果たせません。本当の力はトリガーから来ます — 新しいコミット・プルリクエスト・スケジュールされた時刻を検出して即座にパイプラインを開始する自動メカニズム。Jenkins は 4 種類のトリガーをサポートします：SCM ポーリング（定期的にリポジトリをチェック）・Webhook（リポジトリが即座に Jenkins に通知をプッシュ）・スケジュールビルド（cron のような構文）・アップストリームジョブトリガー（1 つのジョブが別のジョブをトリガー）。4 つすべてを理解してそれぞれをいつ使うかを知ることは重要な運用スキルです。",
  } as const,
  o2: {
    en: "Today you configure GitHub webhooks to trigger Jenkins on every push and pull request, compare webhook delivery against polling overhead, write cron-syntax scheduled builds, chain jobs with upstream triggers, and set up a Multibranch Pipeline that automatically discovers feature branches and runs CI on each one.",
    np: "आज तपाईंले हरेक push र pull request मा Jenkins trigger गर्न GitHub webhook configure गर्नुहुनेछ, webhook delivery र polling overhead compare गर्नुहुनेछ, cron-syntax scheduled build लेख्नुहुनेछ, upstream trigger नाल job chain गर्नुहुनेछ, र automatically feature branch discover गरी हरेकमा CI run गर्ने Multibranch Pipeline setup गर्नुहुनेछ।",
    jp: "今日はすべてのプッシュとプルリクエストで Jenkins をトリガーする GitHub Webhook を設定し・Webhook デリバリーとポーリングオーバーヘッドを比較し・cron 構文のスケジュールビルドを書き・アップストリームトリガーでジョブをチェーンし・フィーチャーブランチを自動的に検出して各ブランチで CI を実行する Multibranch Pipeline を設定します。",
  } as const,
};

export const DEVOPS_DAY_53_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The four trigger types — comparison & when to use each",
        np: "चार trigger type — comparison र प्रत्येक कहिले प्रयोग गर्ने",
        jp: "4 種類のトリガー — 比較とそれぞれの使用タイミング",
      },
      blocks: [
        { type: "diagram", id: "devops-jenkins-triggers" },
        {
          type: "table",
          caption: {
            en: "Jenkins trigger types — mechanism, latency, and best use",
            np: "Jenkins trigger type — mechanism, latency, र best use",
            jp: "Jenkins トリガータイプ — メカニズム・レイテンシー・最適な用途",
          },
          headers: [
            { en: "Trigger", np: "Trigger", jp: "トリガー" },
            { en: "Mechanism", np: "Mechanism", jp: "メカニズム" },
            { en: "Latency", np: "Latency", jp: "レイテンシー" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "Webhook (push event)", np: "Webhook (push event)", jp: "Webhook（プッシュイベント）" },
              { en: "GitHub/GitLab HTTP POST to Jenkins on every push", np: "हरेक push मा GitHub/GitLab ले Jenkins लाई HTTP POST", jp: "すべてのプッシュで GitHub/GitLab が Jenkins に HTTP POST" },
              { en: "Seconds — fires immediately on git push", np: "Second — git push मा immediately fire", jp: "秒 — git push 直後に発火" },
              { en: "All CI pipelines; production recommendation", np: "सबै CI pipeline; production recommendation", jp: "すべての CI パイプライン；本番での推奨" },
            ],
            [
              { en: "SCM Polling", np: "SCM Polling", jp: "SCM ポーリング" },
              { en: "Jenkins checks the repo for new commits on a schedule (`H/5 * * * *`)", np: "Schedule मा Jenkins ले repo लाई new commit check (`H/5 * * * *`)", jp: "スケジュールで Jenkins がリポジトリに新しいコミットを確認（`H/5 * * * *`）" },
              { en: "Up to the poll interval (5–15 min typically)", np: "Poll interval सम्म (सामान्यतया 5–15 min)", jp: "ポーリング間隔まで（通常 5〜15 分）" },
              { en: "When webhooks are blocked by firewall or SCM has no webhook support", np: "Firewall ले webhook block गर्दा वा SCM मा webhook support छैन", jp: "ファイアウォールで Webhook がブロックされるか SCM が Webhook をサポートしない場合" },
            ],
            [
              { en: "Scheduled (cron)", np: "Scheduled (cron)", jp: "スケジュール（cron）" },
              { en: "Runs at fixed times regardless of code changes (`cron('0 2 * * *')`)", np: "Code change regardless fixed time मा run (`cron('0 2 * * *')`)", jp: "コードの変更に関わらず固定時刻に実行（`cron('0 2 * * *')`）" },
              { en: "Deterministic — runs at the exact scheduled time", np: "Deterministic — scheduled time exactly मा run", jp: "確定的 — スケジュールされた正確な時刻に実行" },
              { en: "Nightly builds, weekly security scans, scheduled reports", np: "Nightly build, weekly security scan, scheduled report", jp: "ナイトリービルド・週次セキュリティスキャン・スケジュールレポート" },
            ],
            [
              { en: "Upstream trigger", np: "Upstream trigger", jp: "アップストリームトリガー" },
              { en: "Job B starts automatically when Job A completes successfully", np: "Job A successfully complete भयो भने Job B automatically start", jp: "ジョブ A が正常に完了するとジョブ B が自動的に開始" },
              { en: "Immediate — fires on upstream job completion event", np: "Immediate — upstream job completion event मा fire", jp: "即時 — アップストリームジョブ完了イベントで発火" },
              { en: "Pipelines split across jobs (build → deploy, test → release)", np: "Job across split pipeline (build → deploy, test → release)", jp: "ジョブに分割されたパイプライン（build → deploy・test → release）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Configuring webhooks, polling, cron & Multibranch Pipelines",
        np: "Webhook, polling, cron र Multibranch Pipeline configure गर्ने",
        jp: "Webhook・ポーリング・cron・Multibranch Pipeline の設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Trigger configuration in Jenkinsfile & GitHub webhook setup",
            np: "Jenkinsfile मा trigger configuration र GitHub webhook setup",
            jp: "Jenkinsfile でのトリガー設定と GitHub Webhook のセットアップ",
          },
          code: `// ── Triggers block in Jenkinsfile ─────────────────────────────
pipeline {
  agent any

  triggers {
    // Webhook: GitHub sends a POST to http://<jenkins>/github-webhook/
    // No polling needed — zero latency on push
    githubPush()

    // SCM Poll: fallback if webhook delivery fails
    // H/5 = "every 5 minutes, offset randomly to avoid thundering herd"
    pollSCM('H/5 * * * *')

    // Scheduled: run a full security scan every night at 02:00
    cron('H 2 * * *')

    // Upstream: trigger this pipeline when 'build-api' succeeds
    upstream(upstreamProjects: 'build-api', threshold: hudson.model.Result.SUCCESS)
  }

  stages {
    stage('CI') {
      steps { sh 'make test' }
    }
  }
}

# ── GitHub Webhook Setup ────────────────────────────────────────
# In your GitHub repository:
# Settings → Webhooks → Add webhook
#   Payload URL:  http://<jenkins-public-ip>:8080/github-webhook/
#   Content type: application/json
#   Events:       ✓ Pushes  ✓ Pull requests
#
# In Jenkins:
# Install "GitHub Integration Plugin"
# Manage Jenkins → Configure System → GitHub Servers
#   Name: github
#   API URL: https://api.github.com
#   Credentials: GitHub Personal Access Token (secret text)
#   [Test connection]

# ── ngrok for local testing (Jenkins on localhost) ──────────────
# When Jenkins is on your laptop, GitHub can't reach it directly.
# ngrok creates a temporary public tunnel:
ngrok http 8080
# Use the https://xxxx.ngrok.io/github-webhook/ URL in GitHub settings

# ── Multibranch Pipeline — auto-discovers branches ──────────────
# New Item → Multibranch Pipeline
# Branch Sources → GitHub
#   Repository HTTPS URL: https://github.com/myorg/myrepo
#   Credentials: GitHub PAT
# Behaviors:
#   ✓ Discover branches
#   ✓ Discover pull requests from origin (both PR head and merge commit)
# Build Configuration: by Jenkinsfile (file: Jenkinsfile)
# Scan → Save → "Scan Multibranch Pipeline Now"
#
# Jenkins will:
# 1. Clone the repo
# 2. List all branches with a Jenkinsfile
# 3. Create a sub-pipeline for each (main, develop, feature/*)
# 4. Run CI on each independently
# 5. Delete the sub-pipeline when the branch is deleted

# ── Branch-specific logic with 'when' ──────────────────────────
stage('Deploy Production') {
  when {
    // Only deploy when building the main branch via Multibranch
    branch 'main'
    // AND the build was triggered by a push (not a scheduled scan)
    triggeredBy 'BranchIndexingCause'
  }
  steps {
    sh './scripts/deploy.sh production'
  }
}

# ── Inspect webhook deliveries ──────────────────────────────────
# GitHub: Settings → Webhooks → Recent Deliveries
# Each row shows HTTP status, payload, and Jenkins response
# Status 200 = Jenkins received and queued the build
# If you see 302 or network error: check Jenkins URL and firewall rules`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Set up a GitHub webhook pointing to your Jenkins instance. Make a small commit to the repository and confirm Jenkins starts the build within 5 seconds of the push. Check GitHub Settings → Webhooks → Recent Deliveries to see the HTTP 200 response from Jenkins.",
              np: "GitHub webhook setup गरी तपाईंको Jenkins instance point गर्नुहोस्। Repository मा small commit गर्नुहोस् र Jenkins ले push को 5 second भित्र build start गरेको confirm गर्नुहोस्। Jenkins बाट HTTP 200 response हेर्न GitHub Settings → Webhooks → Recent Deliveries check गर्नुहोस्।",
              jp: "Jenkins インスタンスを指す GitHub Webhook をセットアップする。リポジトリに小さなコミットをして Jenkins がプッシュから 5 秒以内にビルドを開始することを確認する。GitHub Settings → Webhooks → Recent Deliveries で Jenkins からの HTTP 200 レスポンスを確認する。",
            },
            {
              en: "Create a Multibranch Pipeline pointing at your repository. Create a feature branch (`git checkout -b feature/test-mb`), push it, and watch Jenkins automatically discover and build it. Then delete the branch on GitHub and confirm Jenkins removes the sub-pipeline.",
              np: "तपाईंको repository point गर्ने Multibranch Pipeline create गर्नुहोस्। Feature branch create गर्नुहोस् (`git checkout -b feature/test-mb`), push गर्नुहोस्, र Jenkins ले automatically discover गरी build गरेको हेर्नुहोस्। त्यसपछि GitHub मा branch delete गर्नुहोस् र Jenkins ले sub-pipeline remove गरेको confirm गर्नुहोस्।",
              jp: "リポジトリを指す Multibranch Pipeline を作成する。フィーチャーブランチ（`git checkout -b feature/test-mb`）を作成してプッシュし、Jenkins が自動的に検出してビルドするのを観察する。次に GitHub でブランチを削除して Jenkins がサブパイプラインを削除することを確認する。",
            },
            {
              en: "Add a `cron('H/2 * * * *')` trigger to your pipeline (every 2 minutes). Wait for it to fire automatically without a commit. Then change it to `cron('H 2 * * *')` (nightly). Open the pipeline's configure page and check the 'Build Triggers' section to understand the difference between cron and pollSCM scheduling.",
              np: "Pipeline मा `cron('H/2 * * * *')` trigger add गर्नुहोस् (हरेक 2 minute)। Commit बिना automatically fire भएको wait गर्नुहोस्। त्यसपछि `cron('H 2 * * *')` (nightly) मा change गर्नुहोस्। Pipeline को configure page open गरी cron र pollSCM scheduling बीचको फरक बुझ्न 'Build Triggers' section check गर्नुहोस्।",
              jp: "パイプラインに `cron('H/2 * * * *')` トリガーを追加する（2 分ごと）。コミットなしに自動的に発火するのを待つ。次に `cron('H 2 * * *')`（夜間）に変更する。パイプラインの設定ページを開いて 'Build Triggers' セクションで cron と pollSCM スケジューリングの違いを理解する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why is webhook delivery preferred over SCM polling in production?",
        np: "Production मा SCM polling भन्दा webhook delivery किन prefer गरिन्छ?",
        jp: "本番環境で SCM ポーリングより Webhook デリバリーが好まれる理由は？",
      },
      answer: {
        en: "Three reasons: (1) Latency — webhooks fire in seconds; polling waits up to the poll interval (often 5–15 minutes), slowing down feedback loops. (2) Load — polling makes an authenticated API call to GitHub on every interval for every job; at scale (50+ jobs) this can hit GitHub rate limits and waste CPU on the Jenkins controller. (3) Accuracy — polling can miss a commit if two pushes happen within one poll interval; webhooks fire for every event. The only reason to use polling is when Jenkins is behind a firewall that GitHub cannot reach — in that case, combine polling as a fallback with `pollSCM('H/5 * * * *')` alongside `githubPush()`.",
        np: "तीन कारण: (1) Latency — webhook second मा fire हुन्छ; polling poll interval सम्म (प्रायः 5–15 minute) कुर्छ, feedback loop slow हुन्छ। (2) Load — polling ले हरेक interval मा हरेक job को लागि GitHub मा authenticated API call गर्छ; scale मा (50+ job) यसले GitHub rate limit hit गर्न सक्छ र Jenkins controller मा CPU waste। (3) Accuracy — एउटा poll interval भित्र दुई push भयो भने polling ले commit miss गर्न सक्छ; webhook ले हरेक event को लागि fire हुन्छ। Polling प्रयोग गर्नुपर्ने एकमात्र कारण Jenkins firewall पछाडि छ जहाँ GitHub reach गर्न सक्दैन — त्यस case मा `githubPush()` सँगसाथ `pollSCM('H/5 * * * *')` fallback को रूपमा combine गर्नुहोस्।",
        jp: "3 つの理由：(1) レイテンシー — Webhook は秒単位で発火し；ポーリングはポーリング間隔（多くの場合 5〜15 分）まで待ち、フィードバックループが遅くなります。(2) 負荷 — ポーリングはすべてのジョブのすべての間隔で GitHub への認証済み API 呼び出しを行います；スケール時（50+ ジョブ）これが GitHub のレート制限に達し Jenkins コントローラーで CPU を無駄にする可能性があります。(3) 精度 — 1 つのポーリング間隔内に 2 つのプッシュが発生するとポーリングがコミットを見逃す可能性があります；Webhook はすべてのイベントで発火します。ポーリングを使用する唯一の理由は Jenkins が GitHub が到達できないファイアウォールの背後にある場合です — その場合は `githubPush()` と並行してフォールバックとして `pollSCM('H/5 * * * *')` を組み合わせてください。",
      },
      tag: { en: "webhooks", np: "Webhooks", jp: "Webhook" },
    },
    {
      question: {
        en: "What is a Multibranch Pipeline and when should I use it?",
        np: "Multibranch Pipeline के हो र कहिले प्रयोग गर्नुपर्छ?",
        jp: "Multibranch Pipeline とは何か、いつ使うべきか？",
      },
      answer: {
        en: "A Multibranch Pipeline is a Jenkins job type that automatically scans a repository, discovers every branch that contains a Jenkinsfile, and creates a separate pipeline for each. It is the correct way to run CI on feature branches and pull requests. When a developer opens a PR, Jenkins immediately runs CI on that branch. When the branch is merged and deleted, Jenkins removes its pipeline automatically. It eliminates the need to manually create a new Jenkins job for every feature branch. Use Multibranch Pipeline for all team repositories; use a regular Pipeline job only for single-branch workflows or scripts triggered by external events.",
        np: "Multibranch Pipeline एउटा Jenkins job type हो जसले automatically repository scan गर्छ, Jenkinsfile contain गर्ने हरेक branch discover गर्छ, र प्रत्येकको लागि separate pipeline create गर्छ। Feature branch र pull request मा CI run गर्ने यो correct way हो। Developer ले PR open गर्दा, Jenkins ले immediately त्यो branch मा CI run गर्छ। Branch merge र delete हुँदा, Jenkins ले आफ्नो pipeline automatically remove गर्छ। हरेक feature branch को लागि manually new Jenkins job create गर्ने आवश्यकता eliminate गर्छ। सबै team repository को लागि Multibranch Pipeline प्रयोग गर्नुहोस्; single-branch workflow वा external event ले trigger गर्ने script को लागि मात्र regular Pipeline job प्रयोग गर्नुहोस्।",
        jp: "Multibranch Pipeline は Jenkins のジョブタイプで、リポジトリを自動的にスキャンし・Jenkinsfile を含むすべてのブランチを検出し・それぞれに個別のパイプラインを作成します。フィーチャーブランチとプルリクエストで CI を実行する正しい方法です。開発者が PR をオープンすると、Jenkins はそのブランチで即座に CI を実行します。ブランチがマージされて削除されると、Jenkins はパイプラインを自動的に削除します。すべてのフィーチャーブランチに新しい Jenkins ジョブを手動で作成する必要がなくなります。すべてのチームリポジトリに Multibranch Pipeline を使用し；単一ブランチのワークフローまたは外部イベントでトリガーされるスクリプトにのみ通常の Pipeline ジョブを使用してください。",
      },
      tag: { en: "multibranch", np: "Multibranch", jp: "マルチブランチ" },
    },
  ],
};
