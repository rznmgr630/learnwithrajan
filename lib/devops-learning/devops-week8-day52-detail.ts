import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A Jenkinsfile is a text file that defines your pipeline as code. The Declarative syntax (introduced in Jenkins 2.x) is the modern, recommended approach — it has a strict, readable structure that enforces best practices and integrates naturally with Blue Ocean, Multibranch Pipelines, and IDE plugins. Understanding Declarative syntax deeply means you can write, review, and debug any CI/CD pipeline in Jenkins without touching the UI.",
    np: "Jenkinsfile एउटा text file हो जसले तपाईंको pipeline लाई code को रूपमा define गर्छ। Declarative syntax (Jenkins 2.x मा introduce) आधुनिक, recommended approach हो — यसमा strict, readable structure छ जसले best practice enforce गर्छ र Blue Ocean, Multibranch Pipeline, र IDE plugin सँग naturally integrate हुन्छ। Declarative syntax deeply बुझ्नाले UI छुँदै नगरी Jenkins मा कुनैपनि CI/CD pipeline write, review, र debug गर्न सकिन्छ।",
    jp: "Jenkinsfile はパイプラインをコードとして定義するテキストファイルです。宣言型構文（Jenkins 2.x で導入）はモダンで推奨されるアプローチです — 厳格で読みやすい構造を持ち、ベストプラクティスを強制し、Blue Ocean・Multibranch Pipeline・IDE プラグインと自然に統合されます。宣言型構文を深く理解することで、UI に触れることなく Jenkins のあらゆる CI/CD パイプラインを書き・レビューし・デバッグできます。",
  } as const,
  o2: {
    en: "Today you learn every block in the Declarative syntax — pipeline, agent, environment, options, parameters, stages, stage, steps, post, when — and how they compose into real pipelines. You will write a complete multi-stage CI pipeline that checks out code, lints, tests, builds a Docker image, scans it with Trivy, and pushes to a registry, using credentials safely and running steps inside Docker containers.",
    np: "आज तपाईंले Declarative syntax को हर block — pipeline, agent, environment, options, parameters, stages, stage, steps, post, when — र ती कसरी real pipeline मा compose हुन्छन् सिक्नुहुनेछ। Code checkout, lint, test, Docker image build, Trivy नाल scan, र registry मा push गर्ने, credential safely प्रयोग गर्दै र Docker container भित्र step run गर्दै complete multi-stage CI pipeline लेख्नुहुनेछ।",
    jp: "今日は宣言型構文のすべてのブロック — pipeline・agent・environment・options・parameters・stages・stage・steps・post・when — とそれらが実際のパイプラインにどう組み合わさるかを学びます。コードのチェックアウト・lint・テスト・Docker イメージのビルド・Trivy によるスキャン・レジストリへのプッシュを行う完全なマルチステージ CI パイプラインを、認証情報を安全に使用しながら Docker コンテナ内でステップを実行して書きます。",
  } as const,
};

export const DEVOPS_DAY_52_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Declarative syntax reference — every block explained",
        np: "Declarative syntax reference — हर block explained",
        jp: "宣言型構文リファレンス — すべてのブロックの説明",
      },
      blocks: [
        { type: "diagram", id: "devops-jenkins-pipeline" },
        {
          type: "table",
          caption: {
            en: "Declarative Jenkinsfile blocks — purpose and key options",
            np: "Declarative Jenkinsfile block — purpose र key option",
            jp: "宣言型 Jenkinsfile ブロック — 目的と主なオプション",
          },
          headers: [
            { en: "Block", np: "Block", jp: "ブロック" },
            { en: "Scope", np: "Scope", jp: "スコープ" },
            { en: "Purpose & key options", np: "Purpose र key option", jp: "目的と主なオプション" },
          ],
          rows: [
            [
              { en: "pipeline {}", np: "pipeline {}", jp: "pipeline {}" },
              { en: "Top-level", np: "Top-level", jp: "トップレベル" },
              { en: "Root wrapper — must be the outermost block", np: "Root wrapper — outermost block हुनुपर्छ", jp: "ルートラッパー — 最外部のブロックでなければならない" },
            ],
            [
              { en: "agent", np: "agent", jp: "agent" },
              { en: "Pipeline or stage", np: "Pipeline or stage", jp: "パイプラインまたはステージ" },
              { en: "Where to run: `any`, `none`, `label 'linux'`, `docker { image 'node:20' }`, `kubernetes {}`", np: "どこで run: `any`, `none`, `label 'linux'`, `docker { image 'node:20' }`, `kubernetes {}`", jp: "実行場所：`any`・`none`・`label 'linux'`・`docker { image 'node:20' }`・`kubernetes {}`" },
            ],
            [
              { en: "environment {}", np: "environment {}", jp: "environment {}" },
              { en: "Pipeline or stage", np: "Pipeline or stage", jp: "パイプラインまたはステージ" },
              { en: "Set env vars; supports `credentials('id')` to pull secrets from Jenkins store", np: "Env var set; Jenkins store बाट secret pull गर्न `credentials('id')` support", jp: "env 変数を設定；Jenkins ストアからシークレットを取得する `credentials('id')` をサポート" },
            ],
            [
              { en: "options {}", np: "options {}", jp: "options {}" },
              { en: "Pipeline or stage", np: "Pipeline or stage", jp: "パイプラインまたはステージ" },
              { en: "`timeout(time:10,unit:'MINUTES')`, `retry(3)`, `skipDefaultCheckout()`, `disableConcurrentBuilds()`", np: "`timeout(time:10,unit:'MINUTES')`, `retry(3)`, `skipDefaultCheckout()`, `disableConcurrentBuilds()`", jp: "`timeout(time:10,unit:'MINUTES')`・`retry(3)`・`skipDefaultCheckout()`・`disableConcurrentBuilds()`" },
            ],
            [
              { en: "parameters {}", np: "parameters {}", jp: "parameters {}" },
              { en: "Pipeline", np: "Pipeline", jp: "パイプライン" },
              { en: "Declare inputs: `string`, `booleanParam`, `choice` — accessible as `params.NAME`", np: "Input declare: `string`, `booleanParam`, `choice` — `params.NAME` मा accessible", jp: "入力を宣言：`string`・`booleanParam`・`choice` — `params.NAME` でアクセス可能" },
            ],
            [
              { en: "stages / stage", np: "stages / stage", jp: "stages / stage" },
              { en: "Pipeline", np: "Pipeline", jp: "パイプライン" },
              { en: "Ordered list of named stages; stages can be sequential, parallel, or nested", np: "Named stage の ordered list; sequential, parallel, वा nested हुन सक्छ", jp: "名前付きステージの順序リスト；順次・並列・ネストが可能" },
            ],
            [
              { en: "steps {}", np: "steps {}", jp: "steps {}" },
              { en: "Stage", np: "Stage", jp: "ステージ" },
              { en: "Shell commands (`sh`), scripts, DSL steps (`checkout`, `docker`, `withCredentials`)", np: "Shell command (`sh`), script, DSL step (`checkout`, `docker`, `withCredentials`)", jp: "シェルコマンド（`sh`）・スクリプト・DSL ステップ（`checkout`・`docker`・`withCredentials`）" },
            ],
            [
              { en: "when {}", np: "when {}", jp: "when {}" },
              { en: "Stage", np: "Stage", jp: "ステージ" },
              { en: "Conditionally run a stage: `branch 'main'`, `tag '*'`, `expression { params.DEPLOY }`", np: "Stage conditionally run: `branch 'main'`, `tag '*'`, `expression { params.DEPLOY }`", jp: "ステージを条件付きで実行：`branch 'main'`・`tag '*'`・`expression { params.DEPLOY }`" },
            ],
            [
              { en: "post {}", np: "post {}", jp: "post {}" },
              { en: "Pipeline or stage", np: "Pipeline or stage", jp: "パイプラインまたはステージ" },
              { en: "`always`, `success`, `failure`, `unstable`, `cleanup` — runs after the stage/pipeline regardless of result", np: "`always`, `success`, `failure`, `unstable`, `cleanup` — result regardless stage/pipeline पछि run", jp: "`always`・`success`・`failure`・`unstable`・`cleanup` — 結果に関わらずステージ/パイプライン後に実行" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Complete CI Jenkinsfile — lint → test → build → scan → push",
        np: "Complete CI Jenkinsfile — lint → test → build → scan → push",
        jp: "完全な CI Jenkinsfile — lint → test → build → scan → push",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Production-quality declarative Jenkinsfile",
            np: "Production-quality declarative Jenkinsfile",
            jp: "本番品質の宣言型 Jenkinsfile",
          },
          code: `// Jenkinsfile — place at repo root
pipeline {

  // Run on any available agent (or label 'linux')
  agent any

  // ── Pipeline-level options ──────────────────────────────────
  options {
    timeout(time: 20, unit: 'MINUTES')   // kill hung builds
    disableConcurrentBuilds()            // no parallel runs of same branch
    buildDiscarder(logRotator(numToKeepStr: '20'))
  }

  // ── Build parameters ────────────────────────────────────────
  parameters {
    booleanParam(name: 'DEPLOY_TO_STAGING', defaultValue: false,
                 description: 'Promote image to staging after CI passes')
    choice(name: 'LOG_LEVEL', choices: ['info', 'debug', 'warn'],
           description: 'App log level for this build')
  }

  // ── Pipeline-level environment ──────────────────────────────
  environment {
    IMAGE        = "myorg/api"
    REGISTRY     = "registry.hub.docker.com"
    // credentials() pulls from Jenkins Credential Store — never hardcode!
    DOCKER_CREDS = credentials('dockerhub-creds')   // USERNAME + PASSWORD vars
    SONAR_TOKEN  = credentials('sonar-token')       // secret text
  }

  stages {

    // ── 1. Checkout ─────────────────────────────────────────
    stage('Checkout') {
      steps {
        checkout scm    // uses the SCM configured on the job (Git + branch)
        sh 'git log -1 --oneline'
      }
    }

    // ── 2. Lint ──────────────────────────────────────────────
    stage('Lint') {
      // Run inside a Node container — no Node.js needed on the agent
      agent { docker { image 'node:20-alpine'; reuseNode true } }
      steps {
        sh 'npm ci --frozen-lockfile'
        sh 'npm run lint'
        sh 'npx tsc --noEmit'
      }
      post {
        always {
          // Archive lint report for Warnings NG plugin
          recordIssues tools: [esLint(pattern: 'eslint-report.xml')]
        }
      }
    }

    // ── 3. Unit Tests ────────────────────────────────────────
    stage('Test') {
      agent { docker { image 'node:20-alpine'; reuseNode true } }
      steps {
        sh 'npm test -- --coverage --reporters=default --reporters=jest-junit'
      }
      post {
        always {
          junit 'test-results/**/*.xml'          // publish JUnit report
          publishHTML target: [                   // coverage HTML
            reportDir: 'coverage/lcov-report',
            reportFiles: 'index.html',
            reportName: 'Coverage Report'
          ]
        }
      }
    }

    // ── 4. Build Docker image ────────────────────────────────
    stage('Build') {
      steps {
        script {
          def sha = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
          env.IMAGE_TAG = "\${IMAGE}:\${sha}"
          sh "docker build -t \${IMAGE_TAG} ."
        }
      }
    }

    // ── 5. Scan ──────────────────────────────────────────────
    stage('Scan') {
      steps {
        // Fail on CRITICAL CVEs; Trivy must be installed on the agent
        sh "trivy image --exit-code 1 --severity CRITICAL \${IMAGE_TAG}"
      }
    }

    // ── 6. Push ──────────────────────────────────────────────
    stage('Push') {
      steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-creds',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker push \${IMAGE_TAG}
          '''
        }
      }
    }

    // ── 7. Deploy to staging (conditional) ──────────────────
    stage('Deploy Staging') {
      when { expression { return params.DEPLOY_TO_STAGING } }
      steps {
        sh "./scripts/deploy.sh staging \${IMAGE_TAG}"
      }
    }
  }

  // ── Post-pipeline actions ───────────────────────────────────
  post {
    success {
      echo "Pipeline passed — image: \${IMAGE_TAG}"
      // slackSend channel: '#ci', message: "Build passed: \${IMAGE_TAG}"
    }
    failure {
      echo "Pipeline FAILED — check the logs"
    }
    always {
      // Clean up Docker images on the agent to save disk space
      sh 'docker image prune -f || true'
      cleanWs()   // wipe the workspace after the build
    }
  }
}`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a new Pipeline job, paste the Jenkinsfile above (simplified for your project), and run it. Observe the stage visualization in Blue Ocean. Click into each stage to read its log output and understand what ran in each step.",
              np: "New Pipeline job create गर्नुहोस्, माथिको Jenkinsfile paste गर्नुहोस् (तपाईंको project को लागि simplified), र run गर्नुहोस्। Blue Ocean मा stage visualization observe गर्नुहोस्। प्रत्येक step मा के run भयो बुझ्न each stage मा click गरी log output पढ्नुहोस्।",
              jp: "新しい Pipeline ジョブを作成し、上記の Jenkinsfile（プロジェクト用に簡略化）を貼り付けて実行する。Blue Ocean でステージの可視化を観察する。各ステップで何が実行されたかを理解するために各ステージをクリックしてログ出力を読む。",
            },
            {
              en: "Add a `parallel` block inside the `stages` to run `Lint` and `Test` simultaneously. Verify in Blue Ocean that both stages start at the same time and the `Build` stage only starts after both pass. Compare total pipeline time with and without parallelism.",
              np: "`Lint` र `Test` एकसाथ run गर्न `stages` भित्र `parallel` block add गर्नुहोस्। Blue Ocean मा दुवै stage एकसाथ start भएको verify गर्नुहोस् र `Build` stage दुवै pass भएपछि मात्र start भएको verify गर्नुहोस्। Parallelism नाल र बिना total pipeline time compare गर्नुहोस्।",
              jp: "`stages` 内に `parallel` ブロックを追加して `Lint` と `Test` を同時に実行する。Blue Ocean で両方のステージが同時に開始することと `Build` ステージが両方がパスした後にのみ開始することを確認する。並列ありとなしの合計パイプライン時間を比較する。",
            },
            {
              en: "Add a Docker Hub credential in Jenkins Credential Store. Reference it in the pipeline via `withCredentials`. Verify the password does NOT appear in the console output (Jenkins masks it as `****`). Run `docker login` inside the step and push a test image.",
              np: "Jenkins Credential Store मा Docker Hub credential add गर्नुहोस्। `withCredentials` मार्फत pipeline मा reference गर्नुहोस्। Console output मा password appear नभएको verify गर्नुहोस् (Jenkins ले `****` मा mask गर्छ)। Step भित्र `docker login` run गर्नुहोस् र test image push गर्नुहोस्।",
              jp: "Jenkins Credential Store に Docker Hub の認証情報を追加する。`withCredentials` を通じてパイプラインで参照する。パスワードがコンソール出力に表示されないことを確認する（Jenkins は `****` でマスクする）。ステップ内で `docker login` を実行してテストイメージをプッシュする。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Declarative and Scripted pipeline syntax?",
        np: "Declarative र Scripted pipeline syntax बीच के फरक छ?",
        jp: "宣言型とスクリプト型パイプライン構文の違いは何か？",
      },
      answer: {
        en: "Scripted syntax is pure Groovy — `node { stage('Build') { sh 'make' } }`. It is extremely flexible but has no enforced structure, making pipelines hard to read and validate. Declarative syntax wraps a subset of Groovy in a structured DSL with required blocks (`pipeline`, `agent`, `stages`). It is easier to read, supported by Blue Ocean's visual editor, and validated at parse time (syntax errors are caught before running). The `script {}` block inside Declarative gives you access to the full Groovy API when you need it. Use Declarative for all new pipelines; reach for `script {}` only for complex logic that Declarative cannot express.",
        np: "Scripted syntax pure Groovy हो — `node { stage('Build') { sh 'make' } }`। Extremely flexible छ तर enforced structure छैन, pipeline read र validate गर्न hard बनाउँछ। Declarative syntax ले structured DSL मा Groovy को subset wrap गर्छ required block नाल (`pipeline`, `agent`, `stages`)। Read गर्न easier, Blue Ocean को visual editor ले support, र parse time मा validate हुन्छ (syntax error run गर्नुअघि catch हुन्छ)। Declarative भित्रको `script {}` block ले आवश्यक पर्दा full Groovy API access दिन्छ। सबै new pipeline को लागि Declarative प्रयोग गर्नुहोस्; Declarative express गर्न नसक्ने complex logic को लागि मात्र `script {}` प्रयोग गर्नुहोस्।",
        jp: "スクリプト型構文は純粋な Groovy です — `node { stage('Build') { sh 'make' } }`。非常に柔軟ですが強制された構造がなく、パイプラインの読み取りと検証が難しくなります。宣言型構文は必須ブロック（`pipeline`・`agent`・`stages`）を持つ構造化された DSL に Groovy のサブセットをラップします。読みやすく・Blue Ocean のビジュアルエディターでサポートされ・パース時に検証されます（実行前に構文エラーが検出される）。宣言型内の `script {}` ブロックは必要な時に完全な Groovy API へのアクセスを提供します。すべての新しいパイプラインには宣言型を使用し；宣言型で表現できない複雑なロジックにのみ `script {}` を使用してください。",
      },
      tag: { en: "syntax", np: "Syntax", jp: "構文" },
    },
    {
      question: {
        en: "How do I safely use secrets in a Jenkinsfile without exposing them in logs?",
        np: "Log मा expose नगरी Jenkinsfile मा safely secret कसरी प्रयोग गर्ने?",
        jp: "ログに公開せずに Jenkinsfile でシークレットを安全に使用するにはどうすればよいか？",
      },
      answer: {
        en: "Store secrets in Jenkins Credential Store (Manage Jenkins → Credentials). Access them in Declarative pipelines via `environment { MY_TOKEN = credentials('token-id') }` or inside steps with `withCredentials([string(credentialsId: 'token-id', variable: 'MY_TOKEN')])`. Jenkins automatically masks the value in console output, replacing it with `****`. Never echo credentials directly, never pass them as command-line arguments (visible in process lists), and never store them in the Jenkinsfile itself or in environment variables outside the `withCredentials` scope.",
        np: "Jenkins Credential Store मा secret store गर्नुहोस् (Manage Jenkins → Credentials)। Declarative pipeline मा `environment { MY_TOKEN = credentials('token-id') }` वा step भित्र `withCredentials([string(credentialsId: 'token-id', variable: 'MY_TOKEN')])` मार्फत access गर्नुहोस्। Jenkins ले automatically console output मा value mask गर्छ, `****` नाल replace गर्दै। Credential directly echo नगर्नुहोस्, command-line argument को रूपमा pass नगर्नुहोस् (process list मा visible), र Jenkinsfile मा वा `withCredentials` scope बाहिर environment variable मा store नगर्नुहोस्।",
        jp: "Jenkins 認証情報ストアにシークレットを保存してください（Manage Jenkins → Credentials）。宣言型パイプラインでは `environment { MY_TOKEN = credentials('token-id') }` または `withCredentials([string(credentialsId: 'token-id', variable: 'MY_TOKEN')])` でステップ内からアクセスします。Jenkins はコンソール出力で値を自動的にマスクし、`****` に置き換えます。認証情報を直接エコーしたり・コマンドライン引数として渡したり（プロセスリストで見える）・Jenkinsfile 自体や `withCredentials` スコープ外の環境変数に保存したりしないでください。",
      },
      tag: { en: "secrets", np: "Secrets", jp: "シークレット" },
    },
  ],
};
