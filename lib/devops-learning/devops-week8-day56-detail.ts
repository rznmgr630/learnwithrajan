import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Once you have more than five Jenkins pipelines, you will notice a painful problem: every Jenkinsfile duplicates the same 40 lines for Docker authentication, Slack notifications, and artifact uploading. A bug in those 40 lines means editing 50 files. Jenkins Shared Libraries solve this by letting you extract reusable pipeline logic into a version-controlled Git repository that any pipeline can import with a single `@Library` annotation. A shared library lives in a `src/` (Groovy classes), `vars/` (callable pipeline steps), and `resources/` (templates, scripts) directory. Once registered in Jenkins, every pipeline can call your custom `slackNotify()`, `dockerPush()`, or `runTests()` step as if it were a built-in Jenkins step.",
    np: "पाँचभन्दा बढी Jenkins pipeline हुँदा एउटा painful problem notice गर्नुहुनेछ: हरेक Jenkinsfile ले Docker authentication, Slack notification, र artifact upload को लागि same 40 line duplicate गर्छ। ती 40 line मा bug भयो भने 50 file edit गर्नुपर्छ। Jenkins Shared Library ले यो solve गर्छ — reusable pipeline logic लाई version-controlled Git repository मा extract गर्न दिन्छ जुन कुनै पनि pipeline ले single `@Library` annotation सँग import गर्न सक्छ। Shared library `src/` (Groovy class), `vars/` (callable pipeline step), र `resources/` (template, script) directory मा बस्छ। Jenkins मा register भएपछि, हरेक pipeline ले `slackNotify()`, `dockerPush()`, वा `runTests()` step लाई built-in Jenkins step जस्तै call गर्न सक्छ।",
    jp: "5 つ以上の Jenkins パイプラインを持つようになると、痛ましい問題に気付きます：すべての Jenkinsfile が Docker 認証・Slack 通知・アーティファクトアップロードのために同じ 40 行を複製しています。その 40 行のバグは 50 ファイルの編集を意味します。Jenkins Shared Library はこれを解決します — 再利用可能なパイプラインロジックを、単一の `@Library` アノテーションでどのパイプラインもインポートできるバージョン管理された Git リポジトリに抽出できます。共有ライブラリは `src/`（Groovy クラス）・`vars/`（呼び出し可能なパイプラインステップ）・`resources/`（テンプレート・スクリプト）ディレクトリに存在します。Jenkins に登録されると、すべてのパイプラインが組み込みの Jenkins ステップのように `slackNotify()`・`dockerPush()`・`runTests()` ステップを呼び出せます。",
  } as const,
  o2: {
    en: "Today you build a complete shared library with a `vars/dockerBuild.groovy` callable step and a `src/org/myorg/Slack.groovy` utility class. You register the library in Jenkins, call it from a Jenkinsfile with `@Library('myorg-pipeline-lib')`, configure dynamic Docker agents that spin up a fresh container per stage, and compare static vs dynamic agent provisioning in terms of build isolation and startup overhead.",
    np: "आज तपाईंले `vars/dockerBuild.groovy` callable step र `src/org/myorg/Slack.groovy` utility class सहित complete shared library build गर्नुहुनेछ। Library Jenkins मा register गर्नुहुनेछ, `@Library('myorg-pipeline-lib')` सहित Jenkinsfile बाट call गर्नुहुनेछ, per stage fresh container spin up गर्ने dynamic Docker agent configure गर्नुहुनेछ, र build isolation र startup overhead को term मा static vs dynamic agent provisioning compare गर्नुहुनेछ।",
    jp: "今日は `vars/dockerBuild.groovy` 呼び出し可能ステップと `src/org/myorg/Slack.groovy` ユーティリティクラスを持つ完全な共有ライブラリを構築します。ライブラリを Jenkins に登録し・`@Library('myorg-pipeline-lib')` で Jenkinsfile から呼び出し・ステージごとに新しいコンテナを起動する動的 Docker エージェントを設定し・ビルドの分離とスタートアップオーバーヘッドの観点から静的と動的なエージェントプロビジョニングを比較します。",
  } as const,
};

export const DEVOPS_DAY_56_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Shared library structure & agent types — comparison",
        np: "Shared library structure र agent type — comparison",
        jp: "共有ライブラリの構造とエージェントタイプ — 比較",
      },
      blocks: [
        { type: "diagram", id: "devops-jenkins-advanced" },
        {
          type: "table",
          caption: {
            en: "Shared library directory layout and agent types",
            np: "Shared library directory layout र agent type",
            jp: "共有ライブラリのディレクトリ構造とエージェントタイプ",
          },
          headers: [
            { en: "Concept", np: "Concept", jp: "概念" },
            { en: "Location / syntax", np: "Location / syntax", jp: "場所 / 構文" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "vars/ step", np: "vars/ step", jp: "vars/ ステップ" },
              { en: "`vars/myStep.groovy` — `def call(Map cfg)` method", np: "`vars/myStep.groovy` — `def call(Map cfg)` method", jp: "`vars/myStep.groovy` — `def call(Map cfg)` メソッド" },
              { en: "Callable like a built-in step from any Jenkinsfile", np: "Jenkinsfile बाट built-in step जस्तै callable", jp: "任意の Jenkinsfile から組み込みステップのように呼び出し可能" },
              { en: "`dockerBuild image: 'nginx', tag: env.BUILD_NUMBER`", np: "`dockerBuild image: 'nginx', tag: env.BUILD_NUMBER`", jp: "`dockerBuild image: 'nginx', tag: env.BUILD_NUMBER`" },
            ],
            [
              { en: "src/ class", np: "src/ class", jp: "src/ クラス" },
              { en: "`src/org/myorg/Slack.groovy` — standard Groovy class", np: "`src/org/myorg/Slack.groovy` — standard Groovy class", jp: "`src/org/myorg/Slack.groovy` — 標準 Groovy クラス" },
              { en: "Reusable utility logic (API clients, formatters, validators)", np: "Reusable utility logic (API client, formatter, validator)", jp: "再利用可能なユーティリティロジック（API クライアント・フォーマッター・バリデーター）" },
              { en: "`new org.myorg.Slack(this).send('#builds', 'Deploy OK')`", np: "`new org.myorg.Slack(this).send('#builds', 'Deploy OK')`", jp: "`new org.myorg.Slack(this).send('#builds', 'Deploy OK')`" },
            ],
            [
              { en: "resources/ file", np: "resources/ file", jp: "resources/ ファイル" },
              { en: "`resources/deploy.sh` — loaded with `libraryResource()`", np: "`resources/deploy.sh` — `libraryResource()` सँग load", jp: "`resources/deploy.sh` — `libraryResource()` で読み込み" },
              { en: "Shell scripts, Helm chart templates, config files bundled with the library", np: "Library सँग bundle गरिएका shell script, Helm chart template, config file", jp: "ライブラリにバンドルされたシェルスクリプト・Helm チャートテンプレート・設定ファイル" },
              { en: "`def script = libraryResource('deploy.sh'); sh script`", np: "`def script = libraryResource('deploy.sh'); sh script`", jp: "`def script = libraryResource('deploy.sh'); sh script`" },
            ],
            [
              { en: "Static agent", np: "Static agent", jp: "静的エージェント" },
              { en: "`agent { label 'linux' }` — runs on a pre-registered persistent node", np: "`agent { label 'linux' }` — pre-registered persistent node मा run", jp: "`agent { label 'linux' }` — 事前登録された永続ノードで実行" },
              { en: "Low startup overhead; node must be managed and kept alive", np: "Low startup overhead; node manage गरी alive राख्नुपर्छ", jp: "低起動オーバーヘッド；ノードは管理して生かし続ける必要がある" },
              { en: "Dedicated build server, macOS node for Xcode builds", np: "Dedicated build server, Xcode build को लागि macOS node", jp: "専用ビルドサーバー・Xcode ビルド用の macOS ノード" },
            ],
            [
              { en: "Docker agent", np: "Docker agent", jp: "Docker エージェント" },
              { en: "`agent { docker { image 'node:20' } }` — per-stage container", np: "`agent { docker { image 'node:20' } }` — per-stage container", jp: "`agent { docker { image 'node:20' } }` — ステージごとのコンテナ" },
              { en: "Clean build environment every time; 5–15s startup cost per stage", np: "हरेक पटक clean build environment; per stage 5–15s startup cost", jp: "毎回クリーンなビルド環境；ステージごとに 5〜15 秒の起動コスト" },
              { en: "Node.js build on Linux agent without installing Node globally", np: "Node globally install नगरी Linux agent मा Node.js build", jp: "Node をグローバルにインストールせずに Linux エージェントで Node.js ビルド" },
            ],
            [
              { en: "Kubernetes agent", np: "Kubernetes agent", jp: "Kubernetes エージェント" },
              { en: "`agent { kubernetes { yaml '...' } }` — pod provisioned on-demand", np: "`agent { kubernetes { yaml '...' } }` — on-demand pod provision", jp: "`agent { kubernetes { yaml '...' } }` — オンデマンドでプロビジョニングされたポッド" },
              { en: "Elastic scaling; each build is a fresh ephemeral pod", np: "Elastic scaling; हरेक build fresh ephemeral pod", jp: "弾力的スケーリング；各ビルドは新しいエフェメラルポッド" },
              { en: "CI at scale (100+ parallel builds) without static agent fleet", np: "Static agent fleet बिना scale मा CI (100+ parallel build)", jp: "静的エージェントフリートなしでスケールで CI（100 以上の並列ビルド）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Building and consuming a Jenkins shared library",
        np: "Jenkins shared library build र consume गर्ने",
        jp: "Jenkins 共有ライブラリの構築と使用",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Shared library layout + vars/dockerBuild.groovy + src/Slack.groovy + Jenkinsfile consumer",
            np: "Shared library layout + vars/dockerBuild.groovy + src/Slack.groovy + Jenkinsfile consumer",
            jp: "共有ライブラリのレイアウト + vars/dockerBuild.groovy + src/Slack.groovy + Jenkinsfile コンシューマー",
          },
          code: `# ── Shared library repo layout ──────────────────────────────────
myorg-pipeline-lib/
├── vars/
│   ├── dockerBuild.groovy      # callable step: dockerBuild(...)
│   ├── runTests.groovy         # callable step: runTests(...)
│   └── slackNotify.groovy      # callable step: slackNotify(...)
├── src/
│   └── org/myorg/
│       ├── Docker.groovy       # utility class
│       └── Slack.groovy        # utility class
└── resources/
    └── deploy.sh               # loaded via libraryResource()


// ── vars/dockerBuild.groovy ─────────────────────────────────────
def call(Map config = [:]) {
    def image   = config.image   ?: error('dockerBuild: image required')
    def tag     = config.tag     ?: env.BUILD_NUMBER
    def registry = config.registry ?: 'registry.myorg.io'

    docker.withRegistry("https://\${registry}", 'ecr-credentials') {
        def img = docker.build("\${image}:\${tag}")
        img.push()
        img.push('latest')
        echo "Pushed \${image}:\${tag} and \${image}:latest"
    }
}


// ── src/org/myorg/Slack.groovy ──────────────────────────────────
package org.myorg

class Slack implements Serializable {
    def script

    Slack(script) { this.script = script }

    def send(String channel, String message, String color = 'good') {
        script.slackSend(
            channel: channel,
            color:   color,
            message: "\${message} — Build <\${script.env.BUILD_URL}|#\${script.env.BUILD_NUMBER}>"
        )
    }

    def failure(String channel) {
        send(channel, ":x: FAILED: \${script.env.JOB_NAME}", 'danger')
    }

    def success(String channel) {
        send(channel, ":white_check_mark: SUCCESS: \${script.env.JOB_NAME}", 'good')
    }
}


// ── Consumer Jenkinsfile ────────────────────────────────────────
@Library('myorg-pipeline-lib@main') _        // load shared library at 'main' branch

pipeline {
  // Docker agent — fresh Node 20 container for each stage
  agent { docker { image 'node:20-alpine'; reuseNode true } }

  environment {
    IMAGE_NAME = 'myorg/api'
  }

  stages {
    stage('Test') {
      steps {
        // Call shared library step — same as built-in Jenkins step
        runTests(tool: 'jest', coverageThreshold: 80)
      }
    }

    stage('Build & Push') {
      steps {
        // Call dockerBuild step from vars/dockerBuild.groovy
        dockerBuild(image: env.IMAGE_NAME, tag: env.BUILD_NUMBER, registry: 'ecr.amazonaws.com/123456789')
      }
    }

    stage('Deploy') {
      when { branch 'main' }
      steps {
        sh libraryResource('deploy.sh')   // load script from resources/
      }
    }
  }

  post {
    success {
      script {
        new org.myorg.Slack(this).success('#ci-alerts')
      }
    }
    failure {
      script {
        new org.myorg.Slack(this).failure('#ci-alerts')
      }
    }
  }
}


// ── Register the library in Jenkins ────────────────────────────
// Manage Jenkins → Configure System → Global Pipeline Libraries
// Name:          myorg-pipeline-lib
// Default version: main
// Source Code Management: Git
//   Project Repository: https://github.com/myorg/myorg-pipeline-lib.git
//   Credentials: github-pat
// ✓ Load implicitly (makes it available without @Library in every pipeline)
//   OR
// ✓ Allow default version to be overridden  (explicit @Library('lib@v1.2.0') for pinning)


# ── Kubernetes agent example ─────────────────────────────────────
pipeline {
  agent {
    kubernetes {
      yaml """
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: node
    image: node:20-alpine
    command: [sleep, infinity]
  - name: docker
    image: docker:24-dind
    securityContext: { privileged: true }
"""
      defaultContainer 'node'
    }
  }
  stages {
    stage('Test') {
      steps { sh 'npm ci && npm test' }
    }
    stage('Build image') {
      steps {
        container('docker') {
          sh 'docker build -t myapp:latest .'
        }
      }
    }
  }
}`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a new Git repository named `myorg-pipeline-lib`. Add a `vars/slackNotify.groovy` with a `def call(String message)` function that echoes the message (stub the actual Slack call if you don't have credentials). Register it in Jenkins under Global Pipeline Libraries and call it from an existing Jenkinsfile with `@Library('myorg-pipeline-lib') _`. Verify the echo appears in the build log.",
              np: "`myorg-pipeline-lib` नामको new Git repository create गर्नुहोस्। Message echo गर्ने `def call(String message)` function सहित `vars/slackNotify.groovy` add गर्नुहोस् (credential छैन भने actual Slack call stub गर्नुहोस्)। Jenkins मा Global Pipeline Libraries अन्तर्गत register गर्नुहोस् र `@Library('myorg-pipeline-lib') _` सहित existing Jenkinsfile बाट call गर्नुहोस्। Build log मा echo appear भएको verify गर्नुहोस्।",
              jp: "`myorg-pipeline-lib` という名前の新しい Git リポジトリを作成する。メッセージをエコーする `def call(String message)` 関数を持つ `vars/slackNotify.groovy` を追加する（認証情報がない場合は実際の Slack 呼び出しをスタブする）。Jenkins の Global Pipeline Libraries に登録し・`@Library('myorg-pipeline-lib') _` で既存の Jenkinsfile から呼び出す。ビルドログにエコーが表示されることを確認する。",
            },
            {
              en: "Change a pipeline stage from `agent any` to `agent { docker { image 'python:3.12-slim' } }`. Run the pipeline and observe that Python is available in that stage without installing it on the Jenkins node. Check the build log for the `docker pull` line. Then change the image to `node:20-alpine` for a JavaScript stage and confirm `node --version` outputs the correct version.",
              np: "Pipeline stage लाई `agent any` बाट `agent { docker { image 'python:3.12-slim' } }` मा change गर्नुहोस्। Pipeline run गर्नुहोस् र Jenkins node मा install नगरी नै त्यो stage मा Python available भएको observe गर्नुहोस्। Build log मा `docker pull` line check गर्नुहोस्। त्यसपछि JavaScript stage को लागि image `node:20-alpine` मा change गर्नुहोस् र `node --version` ले correct version output गर्छ confirm गर्नुहोस्।",
              jp: "パイプラインステージを `agent any` から `agent { docker { image 'python:3.12-slim' } }` に変更する。パイプラインを実行して Jenkins ノードにインストールせずにそのステージで Python が利用可能であることを観察する。ビルドログで `docker pull` 行を確認する。次に JavaScript ステージのイメージを `node:20-alpine` に変更して `node --version` が正しいバージョンを出力することを確認する。",
            },
            {
              en: "Move a repeated code block (e.g., `withCredentials` + `docker build` + `docker push`) from three separate Jenkinsfiles into a `vars/dockerPush.groovy` shared library step. Update all three Jenkinsfiles to call `dockerPush(image: 'myapp', tag: env.BUILD_NUMBER)`. Confirm all three pipelines still build successfully and that you only need to maintain one copy of the docker logic.",
              np: "Repeated code block (जस्तै, `withCredentials` + `docker build` + `docker push`) तीनवटा अलग Jenkinsfile बाट `vars/dockerPush.groovy` shared library step मा move गर्नुहोस्। तीनवटै Jenkinsfile `dockerPush(image: 'myapp', tag: env.BUILD_NUMBER)` call गर्न update गर्नुहोस्। तीनवटै pipeline अझै successfully build हुन्छ confirm गर्नुहोस् र docker logic को एउटा copy मात्र maintain गर्नुपर्छ।",
              jp: "繰り返されるコードブロック（例：`withCredentials` + `docker build` + `docker push`）を 3 つの別々の Jenkinsfile から `vars/dockerPush.groovy` 共有ライブラリステップに移動する。3 つの Jenkinsfile すべてを `dockerPush(image: 'myapp', tag: env.BUILD_NUMBER)` を呼び出すように更新する。3 つのパイプラインすべてが正常にビルドされることを確認し、docker ロジックのコピーを 1 つだけ管理すればよいことを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `vars/` and `src/` in a Jenkins shared library?",
        np: "Jenkins shared library मा `vars/` र `src/` बीचको फरक के हो?",
        jp: "Jenkins 共有ライブラリの `vars/` と `src/` の違いは何か？",
      },
      answer: {
        en: "`vars/` contains pipeline steps: each `.groovy` file becomes a callable step in any Jenkinsfile. The file `vars/deployApp.groovy` with a `def call(...)` method can be called as `deployApp(...)` directly in any pipeline — no import needed. The Groovy is executed in the pipeline script context with full access to Jenkins globals (`env`, `sh`, `docker`, etc.). `src/` contains regular Groovy classes organized in a package structure (`src/org/myorg/Docker.groovy`). They must be explicitly imported with `import org.myorg.Docker` and instantiated with `new Docker(this)`. They cannot access Jenkins globals directly — you pass `this` (the pipeline script reference) into the constructor. Use `vars/` for simple pipeline logic steps, `src/` for complex reusable utilities that benefit from object-oriented design (error handling classes, API clients, formatters).",
        np: "`vars/` ले pipeline step contain गर्छ: हरेक `.groovy` file कुनै पनि Jenkinsfile मा callable step बन्छ। `def call(...)` method सहित `vars/deployApp.groovy` file लाई कुनै पनि pipeline मा `deployApp(...)` को रूपमा directly call गर्न सकिन्छ — import चाहिँदैन। Groovy ले Jenkins globals (`env`, `sh`, `docker`, आदि) को full access सहित pipeline script context मा execute हुन्छ। `src/` ले package structure मा organized regular Groovy class contain गर्छ (`src/org/myorg/Docker.groovy`)। `import org.myorg.Docker` सँग explicitly import गरी `new Docker(this)` सँग instantiate गर्नुपर्छ। तिनीहरूले directly Jenkins global access गर्न सक्दैनन् — `this` (pipeline script reference) constructor मा pass गर्नुपर्छ। Simple pipeline logic step को लागि `vars/` प्रयोग गर्नुहोस्, object-oriented design (error handling class, API client, formatter) बाट benefit हुने complex reusable utility को लागि `src/` प्रयोग गर्नुहोस्।",
        jp: "`vars/` はパイプラインステップを含みます：各 `.groovy` ファイルが任意の Jenkinsfile で呼び出し可能なステップになります。`def call(...)` メソッドを持つ `vars/deployApp.groovy` ファイルは、どのパイプラインでも `deployApp(...)` として直接呼び出せます — インポート不要。Groovy は Jenkins グローバル（`env`・`sh`・`docker` など）への完全アクセスを持つパイプラインスクリプトコンテキストで実行されます。`src/` はパッケージ構造で整理された通常の Groovy クラスを含みます（`src/org/myorg/Docker.groovy`）。`import org.myorg.Docker` で明示的にインポートして `new Docker(this)` でインスタンス化する必要があります。Jenkins グローバルに直接アクセスできません — `this`（パイプラインスクリプト参照）をコンストラクターに渡します。シンプルなパイプラインロジックステップには `vars/` を使用し、オブジェクト指向設計（エラー処理クラス・API クライアント・フォーマッター）の恩恵を受ける複雑な再利用可能なユーティリティには `src/` を使用します。",
      },
      tag: { en: "shared library", np: "Shared Library", jp: "共有ライブラリ" },
    },
    {
      question: {
        en: "When should I use a Docker agent vs a Kubernetes agent in Jenkins?",
        np: "Jenkins मा Docker agent vs Kubernetes agent कहिले प्रयोग गर्नुपर्छ?",
        jp: "Jenkins で Docker エージェントと Kubernetes エージェントをいつ使うべきか？",
      },
      answer: {
        en: "Docker agent (`agent { docker { image '...' } }`) is the right choice when you have a small team with a single Jenkins node or a small static agent fleet. It gives you build isolation (clean environment per build) and tool version flexibility without managing multiple nodes. The tradeoff: all builds queue on the same Docker host — you cannot scale horizontally by adding more parallel builds without adding more nodes. Kubernetes agent (`agent { kubernetes { ... } }`) is the right choice at scale. Each build gets its own ephemeral pod on your Kubernetes cluster. New builds scale out by spinning up new pods; when the build finishes the pod is deleted. This means 100 parallel builds can run simultaneously without managing any agent fleet. The tradeoff: Kubernetes cluster required, more complex YAML pod spec, slightly higher startup overhead (~30–60 seconds for pod scheduling) vs Docker (~5–15 seconds). Use Docker agent for projects with < 20 parallel builds; use Kubernetes agent when you need elastic scaling.",
        np: "Docker agent (`agent { docker { image '...' } }`) सही choice हो जब तपाईंसँग single Jenkins node वा small static agent fleet सहित small team छ। यसले multiple node manage नगरी build isolation (per build clean environment) र tool version flexibility दिन्छ। Tradeoff: सबै build same Docker host मा queue हुन्छ — more node add नगरी horizontally scale गर्न सक्नुहुन्न। Kubernetes agent (`agent { kubernetes { ... } }`) scale मा सही choice हो। हरेक build ले Kubernetes cluster मा आफ्नै ephemeral pod पाउँछ। New build ले new pod spin up गरी scale out हुन्छ; build सकिएपछि pod delete हुन्छ। यसको मतलब 100 parallel build simultaneously run हुन सक्छ कुनै agent fleet manage नगरी। Tradeoff: Kubernetes cluster required, more complex YAML pod spec, Docker (~5–15 second) भन्दा slightly higher startup overhead (~30–60 second pod scheduling)। < 20 parallel build भएका project को लागि Docker agent प्रयोग गर्नुहोस्; elastic scaling चाहिँदा Kubernetes agent प्रयोग गर्नुहोस्।",
        jp: "Docker エージェント（`agent { docker { image '...' } }`）は、単一の Jenkins ノードまたは小規模な静的エージェントフリートを持つ小規模チームに適した選択です。複数のノードを管理せずにビルドの分離（ビルドごとのクリーンな環境）とツールバージョンの柔軟性を提供します。トレードオフ：すべてのビルドが同じ Docker ホストでキューに入ります — さらにノードを追加しないと水平スケールできません。Kubernetes エージェント（`agent { kubernetes { ... } }`）はスケール時の適切な選択です。各ビルドは Kubernetes クラスターに独自のエフェメラルポッドを取得します。新しいビルドは新しいポッドを起動することでスケールアウトし；ビルドが完了するとポッドは削除されます。つまりエージェントフリートを管理せずに 100 の並列ビルドを同時に実行できます。トレードオフ：Kubernetes クラスターが必要・より複雑な YAML ポッド仕様・Docker（5〜15 秒）よりわずかに高い起動オーバーヘッド（ポッドスケジューリングに 30〜60 秒）。並列ビルドが 20 未満のプロジェクトには Docker エージェントを使用し；弾力的スケーリングが必要なときは Kubernetes エージェントを使用します。",
      },
      tag: { en: "agents", np: "Agents", jp: "エージェント" },
    },
  ],
};
