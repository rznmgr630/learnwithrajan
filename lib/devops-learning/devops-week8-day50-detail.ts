import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. It is the practice of automating the path from a developer's commit to production — running tests, building artefacts, scanning for vulnerabilities, and deploying software without manual intervention. Before CI/CD, teams would integrate code weekly, discover conflicts late, build by hand, and deploy with fear. With CI/CD, every push triggers a pipeline that validates the change in minutes, giving teams the confidence to deploy dozens of times per day.",
    np: "CI/CD भनेको Continuous Integration र Continuous Delivery/Deployment हो। यो developer को commit बाट production सम्मको path automate गर्ने practice हो — test run गर्ने, artefact build गर्ने, vulnerability scan गर्ने, र manual intervention बिना software deploy गर्ने। CI/CD अघि, team ले weekly code integrate गर्थे, conflict late पत्ता लगाउँथे, manually build गर्थे, र डरेर deploy गर्थे। CI/CD नाल, हरेक push ले pipeline trigger गर्छ जसले मिनेटमा change validate गर्छ, team लाई दिनमा dozens of times deploy गर्ने confidence दिन्छ।",
    jp: "CI/CD とは継続的インテグレーションと継続的デリバリー/デプロイメントを意味します。開発者のコミットから本番環境までのパスを自動化する実践です — テストの実行・アーティファクトのビルド・脆弱性のスキャン・手動介入なしのソフトウェアデプロイ。CI/CD 以前は、チームは週単位でコードを統合し、競合を遅れて発見し、手動でビルドし、恐る恐るデプロイしていました。CI/CD により、すべてのプッシュがパイプラインをトリガーし、数分で変更を検証するため、チームは 1 日に何十回もデプロイする自信を持てます。",
  } as const,
  o2: {
    en: "Today covers the conceptual foundation you need before touching any CI/CD tool: the three pillars (CI, CD delivery, CD deployment), the anatomy of a pipeline (stages, jobs, artefacts, gates), trunk-based development vs feature-branch workflows, the DORA metrics that measure pipeline health, and an overview of the major tools you will use in Week 8 (Jenkins) and beyond (GitHub Actions, GitLab CI).",
    np: "आज कुनैपनि CI/CD tool touch गर्नुअघि चाहिने conceptual foundation cover गर्छ: तीन pillar (CI, CD delivery, CD deployment), pipeline को anatomy (stage, job, artefact, gate), trunk-based development vs feature-branch workflow, pipeline health measure गर्ने DORA metric, र Week 8 (Jenkins) र त्यसपछि प्रयोग हुने major tool को overview (GitHub Actions, GitLab CI)।",
    jp: "今日は CI/CD ツールに触れる前に必要な概念的基盤をカバーします：3 つの柱（CI・CD デリバリー・CD デプロイメント）・パイプラインの解剖（ステージ・ジョブ・アーティファクト・ゲート）・トランクベース開発とフィーチャーブランチワークフロー・パイプラインの健全性を測定する DORA メトリクス・Week 8（Jenkins）以降に使用する主要ツールの概要（GitHub Actions・GitLab CI）。",
  } as const,
};

export const DEVOPS_DAY_50_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The three pillars — CI, CD Delivery, CD Deployment",
        np: "तीन pillar — CI, CD Delivery, CD Deployment",
        jp: "3 つの柱 — CI・CD デリバリー・CD デプロイメント",
      },
      blocks: [
        { type: "diagram", id: "devops-cicd-concepts" },
        {
          type: "table",
          caption: {
            en: "CI vs CD Delivery vs CD Deployment — scope, trigger, and human gate",
            np: "CI vs CD Delivery vs CD Deployment — scope, trigger, र human gate",
            jp: "CI vs CD デリバリー vs CD デプロイメント — スコープ・トリガー・人間のゲート",
          },
          headers: [
            { en: "Practice", np: "Practice", jp: "プラクティス" },
            { en: "What it automates", np: "What it automates", jp: "何を自動化するか" },
            { en: "Trigger", np: "Trigger", jp: "トリガー" },
            { en: "Human approval to prod?", np: "Prod に human approval?", jp: "本番への人間の承認？" },
          ],
          rows: [
            [
              { en: "Continuous Integration (CI)", np: "Continuous Integration (CI)", jp: "継続的インテグレーション（CI）" },
              { en: "Build + lint + test on every commit; merge only when green", np: "हरेक commit मा build + lint + test; green हुँदा मात्र merge", jp: "すべてのコミットでビルド + lint + テスト；グリーンの時のみマージ" },
              { en: "Every push / PR open", np: "हरेक push / PR open", jp: "すべてのプッシュ / PR オープン" },
              { en: "Not needed — CI validates, humans review code", np: "Not needed — CI validates, human review code", jp: "不要 — CI が検証し人間がコードをレビューする" },
            ],
            [
              { en: "Continuous Delivery", np: "Continuous Delivery", jp: "継続的デリバリー" },
              { en: "Build a production-ready artefact on every green CI run; artefact is deployable at any time", np: "हरेक green CI run मा production-ready artefact build; artefact कुनैपनि समय deployable", jp: "すべてのグリーン CI 実行で本番対応アーティファクトをビルド；いつでもデプロイ可能" },
              { en: "Every green CI build", np: "हरेक green CI build", jp: "すべてのグリーン CI ビルド" },
              { en: "Yes — a human decides when to trigger deployment", np: "Yes — human ले कहिले deploy trigger गर्ने decide", jp: "はい — いつデプロイをトリガーするかは人間が決定する" },
            ],
            [
              { en: "Continuous Deployment", np: "Continuous Deployment", jp: "継続的デプロイメント" },
              { en: "Every green build is automatically deployed to production with no human gate", np: "हरेक green build लाई human gate बिना automatically production मा deploy", jp: "すべてのグリーンビルドは人間のゲートなしに自動的に本番にデプロイされる" },
              { en: "Every green CI build", np: "हरेक green CI build", jp: "すべてのグリーン CI ビルド" },
              { en: "No — fully automated (requires excellent test coverage + observability)", np: "No — fully automated (excellent test coverage + observability चाहिन्छ)", jp: "いいえ — 完全に自動化（優れたテストカバレッジと可観測性が必要）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Pipeline anatomy, DORA metrics & tool landscape",
        np: "Pipeline anatomy, DORA metric र tool landscape",
        jp: "パイプラインの解剖・DORA メトリクス・ツール概観",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Pipeline stages — from commit to production (pseudocode)",
            np: "Pipeline stage — commit बाट production सम्म (pseudocode)",
            jp: "パイプラインステージ — コミットから本番まで（疑似コード）",
          },
          code: `# A typical CI/CD pipeline — 7 stages

# ── 1. SOURCE ─────────────────────────────────────────────────
# Triggered by: git push, PR open, tag push
# Actions: checkout code, set COMMIT_SHA and VERSION env vars
git checkout $BRANCH

# ── 2. LINT + STATIC ANALYSIS ─────────────────────────────────
# Fast feedback — fails in < 60 seconds
npm run lint                      # ESLint / Pylint / golangci-lint
npx tsc --noEmit                  # TypeScript type check
semgrep --config=auto .           # SAST (optional)

# ── 3. UNIT TESTS ─────────────────────────────────────────────
npm test -- --coverage
# Gate: coverage must be >= 80%; any failure blocks the pipeline

# ── 4. BUILD ──────────────────────────────────────────────────
docker build \\
  --build-arg GIT_SHA=$COMMIT_SHA \\
  --tag $IMAGE:$COMMIT_SHA \\
  .
docker push $IMAGE:$COMMIT_SHA

# ── 5. SCAN ───────────────────────────────────────────────────
trivy image --exit-code 1 --severity CRITICAL $IMAGE:$COMMIT_SHA
# Fail the pipeline on any CRITICAL CVE

# ── 6. INTEGRATION / E2E TESTS ───────────────────────────────
docker compose -f docker-compose.test.yml up --abort-on-container-exit
# Spins up the full stack; runs integration and smoke tests against it

# ── 7. DEPLOY ─────────────────────────────────────────────────
# Continuous Delivery:  human triggers this step (e.g. "Approve" button)
# Continuous Deployment: this runs automatically after stage 6 passes
#
# Deploy to staging first (always):
./scripts/deploy.sh staging $COMMIT_SHA
./scripts/smoke-test.sh https://staging.myapp.com

# Deploy to production (auto on CD, manual on CDelivery):
./scripts/deploy.sh production $COMMIT_SHA
./scripts/smoke-test.sh https://myapp.com

# If smoke test fails: auto-rollback to the previous image tag
# ./scripts/rollback.sh production $PREVIOUS_SHA`,
        },
        {
          type: "table",
          caption: {
            en: "DORA metrics — the four measures of software delivery performance",
            np: "DORA metric — software delivery performance को चार measure",
            jp: "DORA メトリクス — ソフトウェアデリバリーパフォーマンスの 4 つの指標",
          },
          headers: [
            { en: "Metric", np: "Metric", jp: "メトリクス" },
            { en: "Definition", np: "Definition", jp: "定義" },
            { en: "Elite performers", np: "Elite performers", jp: "エリートパフォーマー" },
            { en: "Low performers", np: "Low performers", jp: "ローパフォーマー" },
          ],
          rows: [
            [
              { en: "Deployment Frequency", np: "Deployment Frequency", jp: "デプロイ頻度" },
              { en: "How often code is deployed to production", np: "Code production मा कति पटक deploy हुन्छ", jp: "コードが本番にデプロイされる頻度" },
              { en: "Multiple times per day", np: "दिनमा धेरै पटक", jp: "1 日に複数回" },
              { en: "Once every 6+ months", np: "6+ महिनामा एक पटक", jp: "6 ヶ月以上に 1 回" },
            ],
            [
              { en: "Lead Time for Changes", np: "Lead Time for Changes", jp: "変更のリードタイム" },
              { en: "Time from commit to production", np: "Commit बाट production सम्म time", jp: "コミットから本番までの時間" },
              { en: "Less than 1 hour", np: "1 घण्टाभन्दा कम", jp: "1 時間未満" },
              { en: "1–6 months", np: "1–6 महिना", jp: "1〜6 ヶ月" },
            ],
            [
              { en: "Mean Time to Recovery (MTTR)", np: "Mean Time to Recovery (MTTR)", jp: "平均回復時間（MTTR）" },
              { en: "Time to restore service after a production failure", np: "Production failure पछि service restore गर्न time", jp: "本番障害後にサービスを復元する時間" },
              { en: "Less than 1 hour", np: "1 घण्टाभन्दा कम", jp: "1 時間未満" },
              { en: "1–6 months", np: "1–6 महिना", jp: "1〜6 ヶ月" },
            ],
            [
              { en: "Change Failure Rate", np: "Change Failure Rate", jp: "変更失敗率" },
              { en: "% of deployments that cause a production incident", np: "Production incident cause गर्ने deployment को %", jp: "本番インシデントを引き起こすデプロイの割合" },
              { en: "0–15%", np: "0–15%", jp: "0〜15%" },
              { en: "46–60%", np: "46–60%", jp: "46〜60%" },
            ],
          ],
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Write a simple shell script that mimics a CI pipeline: checkout (already done), lint a JS file, run a test, build a Docker image, and scan it with Trivy. Make the script exit with code 1 on any failure. This is the core of every CI tool — they just run shell commands in order.",
              np: "CI pipeline mimic गर्ने simple shell script लेख्नुहोस्: checkout (already done), JS file lint, test run, Docker image build, र Trivy नाल scan। कुनैपनि failure मा script लाई exit code 1 नाल exit गराउनुहोस्। यो हरेक CI tool को core हो — तिनीहरू shell command order मा run गर्छन्।",
              jp: "CI パイプラインを模倣するシンプルなシェルスクリプトを書く：チェックアウト（完了）・JS ファイルの lint・テスト実行・Docker イメージのビルド・Trivy でのスキャン。失敗した場合はスクリプトを終了コード 1 で終了させる。これはすべての CI ツールのコアです — シェルコマンドを順番に実行するだけです。",
            },
            {
              en: "Create a GitHub Actions workflow file (`.github/workflows/ci.yml`) with three jobs: `lint`, `test`, and `build`. Set `test` to `needs: lint` and `build` to `needs: test` so they run sequentially. Push a failing test and observe the workflow halt at the test stage in the Actions UI.",
              np: "`.github/workflows/ci.yml` नाल GitHub Actions workflow file create गर्नुहोस् तीन job नाल: `lint`, `test`, र `build`। `test` लाई `needs: lint` र `build` लाई `needs: test` set गर्नुहोस् sequential run को लागि। Failing test push गर्नुहोस् र Actions UI मा workflow test stage मा halt भएको observe गर्नुहोस्।",
              jp: "`.github/workflows/ci.yml` という GitHub Actions ワークフローファイルを 3 つのジョブで作成する：`lint`・`test`・`build`。`test` を `needs: lint` に、`build` を `needs: test` に設定して順次実行されるようにする。失敗するテストをプッシュして Actions UI でワークフローがテストステージで停止することを観察する。",
            },
            {
              en: "Look up your current team's (or a public project's) deployment frequency and lead time for changes. Where do they fall on the DORA scale (elite/high/medium/low)? Identify the single biggest bottleneck in the path from commit to production and write one sentence on how a CI/CD pipeline would address it.",
              np: "तपाईंको current team को (वा public project को) deployment frequency र lead time for changes lookup गर्नुहोस्। DORA scale (elite/high/medium/low) मा कहाँ पर्छ? Commit बाट production सम्मको path मा single biggest bottleneck identify गर्नुहोस् र CI/CD pipeline ले यसलाई कसरी address गर्छ एक sentence मा लेख्नुहोस्।",
              jp: "現在のチーム（または公開プロジェクト）のデプロイ頻度と変更のリードタイムを調べる。DORA スケール（エリート/高/中/低）のどこに当たるか？コミットから本番までのパスで最大のボトルネックを特定し、CI/CD パイプラインがそれをどのように解決するかを 1 文で書く。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Continuous Delivery and Continuous Deployment?",
        np: "Continuous Delivery र Continuous Deployment बीच के फरक छ?",
        jp: "継続的デリバリーと継続的デプロイメントの違いは何か？",
      },
      answer: {
        en: "Continuous Delivery means every green build produces a deployable artefact, but a human explicitly approves the production deployment. Continuous Deployment goes one step further — every green build is automatically deployed to production with no human gate. Delivery is safer for regulated industries (finance, healthcare) where changes need sign-off. Deployment is for mature engineering teams with high test coverage, feature flags, and canary deployment mechanisms — Netflix, Facebook, and GitHub all practice continuous deployment. Most teams start with Delivery and evolve toward Deployment as their testing and observability matures.",
        np: "Continuous Delivery भनेको हरेक green build ले deployable artefact produce गर्छ, तर human ले production deployment explicitly approve गर्छ। Continuous Deployment एक कदम अगाडि जान्छ — हरेक green build लाई human gate बिना automatically production मा deploy गरिन्छ। Delivery regulated industry (finance, healthcare) को लागि safer छ जहाँ change मा sign-off चाहिन्छ। Deployment high test coverage, feature flag, र canary deployment mechanism भएका mature engineering team को लागि हो — Netflix, Facebook, र GitHub सबैले continuous deployment practice गर्छन्। अधिकांश team Delivery बाट सुरु गर्छ र testing र observability mature हुँदै Deployment तर्फ evolve हुन्छ।",
        jp: "継続的デリバリーはすべてのグリーンビルドがデプロイ可能なアーティファクトを生成することを意味しますが、人間が本番デプロイを明示的に承認します。継続的デプロイメントはさらに一歩進みます — すべてのグリーンビルドは人間のゲートなしに自動的に本番にデプロイされます。デリバリーは変更に承認が必要な規制された業界（金融・医療）にとって安全です。デプロイメントは高いテストカバレッジ・フィーチャーフラグ・カナリアデプロイメントメカニズムを持つ成熟したエンジニアリングチーム向けです — Netflix・Facebook・GitHub はすべて継続的デプロイメントを実践しています。ほとんどのチームはデリバリーから始め、テストと可観測性が成熟するにつれてデプロイメントへと進化します。",
      },
      tag: { en: "CI/CD", np: "CI/CD", jp: "CI/CD" },
    },
    {
      question: {
        en: "Why is trunk-based development preferred over long-lived feature branches?",
        np: "Long-lived feature branch भन्दा trunk-based development किन prefer गरिन्छ?",
        jp: "長命フィーチャーブランチよりトランクベース開発が好まれる理由は？",
      },
      answer: {
        en: "Long-lived feature branches accumulate merge debt — the longer a branch lives, the bigger the merge conflict when it rejoins main. They also delay integration testing, meaning bugs are discovered days or weeks after introduction. Trunk-based development (committing small changes directly to main behind feature flags) keeps everyone integrated continuously, surfaces conflicts immediately, and is a prerequisite for continuous deployment. The key enabler is feature flags — you can merge incomplete features safely by gating them behind a flag that is off in production.",
        np: "Long-lived feature branch ले merge debt accumulate गर्छ — branch जति लामो बाँच्छ, main मा rejoin हुँदा merge conflict त्यति ठूलो। Integration testing पनि delay हुन्छ, अर्थात् bug introduce भएको days वा weeks पछि discover हुन्छ। Trunk-based development (feature flag पछाडि main मा directly small change commit) ले सबैलाई continuously integrated राख्छ, conflict immediately surface गर्छ, र continuous deployment को prerequisite हो। Key enabler feature flag हो — production मा off गरिएको flag पछाडि incomplete feature gate गरेर safely merge गर्न सकिन्छ।",
        jp: "長命フィーチャーブランチはマージ負債を蓄積します — ブランチが長く存続するほど、メインに戻る際のマージコンフリクトが大きくなります。また統合テストも遅延し、バグが導入から数日または数週間後に発見されます。トランクベース開発（フィーチャーフラグの裏でメインに直接小さな変更をコミット）はすべての人を継続的に統合し続け、コンフリクトを即座に表面化し、継続的デプロイメントの前提条件です。主要な要素はフィーチャーフラグです — 本番ではオフのフラグの裏に未完成の機能をゲートすることで安全にマージできます。",
      },
      tag: { en: "branching", np: "Branching", jp: "ブランチ戦略" },
    },
  ],
};
