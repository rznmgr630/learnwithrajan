import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Jenkins is the most widely deployed open-source CI/CD automation server. It has been the backbone of enterprise build pipelines for over a decade, and understanding it deeply — even as GitHub Actions and GitLab CI gain popularity — makes you a more versatile engineer. Jenkins runs on a master-agent architecture: the master (controller) schedules builds and serves the UI; agents (nodes) execute the actual pipeline steps. Everything Jenkins does is driven by plugins — there are over 1,800 of them.",
    np: "Jenkins सबैभन्दा widely deployed open-source CI/CD automation server हो। एक दशकभन्दा बढीदेखि enterprise build pipeline को backbone रहेको छ, र यसलाई deeply बुझ्नाले — GitHub Actions र GitLab CI popularity gain गर्दै गए पनि — तपाईंलाई more versatile engineer बनाउँछ। Jenkins ले master-agent architecture मा run हुन्छ: master (controller) ले build schedule गर्छ र UI serve गर्छ; agent (node) ले actual pipeline step execute गर्छ। Jenkins ले गर्ने सबैकुरा plugin द्वारा driven हुन्छ — 1,800 भन्दा बढी छन्।",
    jp: "Jenkins は最も広くデプロイされているオープンソースの CI/CD 自動化サーバーです。10 年以上にわたってエンタープライズのビルドパイプラインの基盤となっており、GitHub Actions や GitLab CI が人気を獲得している中でもそれを深く理解することで、より多才なエンジニアになれます。Jenkins はマスター/エージェントアーキテクチャで実行されます：マスター（コントローラー）がビルドをスケジュールして UI を提供し；エージェント（ノード）が実際のパイプラインステップを実行します。Jenkins がすることはすべてプラグインによって駆動されます — 1,800 以上あります。",
  } as const,
  o2: {
    en: "Today you install Jenkins on a Linux VM, complete the initial setup wizard, install essential plugins, configure global tools (JDK, Node.js, Docker), create your first credentials, and connect a build agent. You will run your first Freestyle job and understand the difference between Freestyle and Pipeline jobs before Day 52 dives into Declarative syntax.",
    np: "आज तपाईंले Linux VM मा Jenkins install गर्नुहुनेछ, initial setup wizard complete गर्नुहुनेछ, essential plugin install गर्नुहुनेछ, global tool configure गर्नुहुनेछ (JDK, Node.js, Docker), पहिलो credential create गर्नुहुनेछ, र build agent connect गर्नुहुनेछ। Day 52 ले Declarative syntax मा dive गर्नुअघि पहिलो Freestyle job run गर्नुहुनेछ र Freestyle र Pipeline job बीचको फरक बुझ्नुहुनेछ।",
    jp: "今日は Linux VM に Jenkins をインストールし、初期セットアップウィザードを完了し、必須プラグインをインストールし、グローバルツールを設定し（JDK・Node.js・Docker）、最初の認証情報を作成し、ビルドエージェントを接続します。Day 52 が宣言型構文に深く入る前に、最初の Freestyle ジョブを実行して Freestyle と Pipeline ジョブの違いを理解します。",
  } as const,
};

export const DEVOPS_DAY_51_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Jenkins architecture — controller, agents & plugins",
        np: "Jenkins architecture — controller, agent र plugin",
        jp: "Jenkins アーキテクチャ — コントローラー・エージェント・プラグイン",
      },
      blocks: [
        { type: "diagram", id: "devops-jenkins-architecture" },
        {
          type: "table",
          caption: {
            en: "Essential Jenkins plugins to install immediately after setup",
            np: "Setup पछि immediately install गर्नुपर्ने essential Jenkins plugin",
            jp: "セットアップ直後にインストールすべき重要な Jenkins プラグイン",
          },
          headers: [
            { en: "Plugin", np: "Plugin", jp: "プラグイン" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
          ],
          rows: [
            [
              { en: "Pipeline", np: "Pipeline", jp: "Pipeline" },
              { en: "Enables Jenkinsfile-based declarative and scripted pipelines", np: "Jenkinsfile-based declarative र scripted pipeline enable गर्छ", jp: "Jenkinsfile ベースの宣言型およびスクリプト型パイプラインを有効化" },
            ],
            [
              { en: "Git / GitHub Branch Source", np: "Git / GitHub Branch Source", jp: "Git / GitHub Branch Source" },
              { en: "Clones repositories and creates Multibranch Pipelines from GitHub/GitLab", np: "Repository clone र GitHub/GitLab बाट Multibranch Pipeline create", jp: "リポジトリをクローンして GitHub/GitLab から Multibranch Pipeline を作成" },
            ],
            [
              { en: "Docker Pipeline", np: "Docker Pipeline", jp: "Docker Pipeline" },
              { en: "Adds `docker.image()` DSL and allows running pipeline steps inside containers", np: "`docker.image()` DSL add र container भित्र pipeline step run गर्न allow", jp: "`docker.image()` DSL を追加し、コンテナ内でパイプラインステップを実行可能に" },
            ],
            [
              { en: "Credentials Binding", np: "Credentials Binding", jp: "Credentials Binding" },
              { en: "Injects stored secrets as environment variables in pipeline steps (withCredentials)", np: "Pipeline step मा stored secret लाई env variable inject (withCredentials)", jp: "パイプラインステップにストアされたシークレットを環境変数として注入（withCredentials）" },
            ],
            [
              { en: "Blue Ocean", np: "Blue Ocean", jp: "Blue Ocean" },
              { en: "Modern pipeline visualization UI — shows stage progress, logs, and failures visually", np: "Modern pipeline visualization UI — stage progress, log, र failure visually", jp: "モダンなパイプライン可視化 UI — ステージの進行・ログ・失敗を視覚的に表示" },
            ],
            [
              { en: "Warnings Next Generation", np: "Warnings Next Generation", jp: "Warnings Next Generation" },
              { en: "Parses lint/test reports and shows trend graphs (ESLint, Checkstyle, SpotBugs)", np: "Lint/test report parse र trend graph show (ESLint, Checkstyle, SpotBugs)", jp: "lint/テストレポートを解析してトレンドグラフを表示（ESLint・Checkstyle・SpotBugs）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Installation, initial setup & connecting a build agent",
        np: "Installation, initial setup र build agent connect गर्ने",
        jp: "インストール・初期設定・ビルドエージェントの接続",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Install Jenkins on Ubuntu, configure tools, and add an SSH agent",
            np: "Ubuntu मा Jenkins install, tool configure, र SSH agent add",
            jp: "Ubuntu に Jenkins をインストールし、ツールを設定して SSH エージェントを追加する",
          },
          code: `# ── Install Java (Jenkins requires Java 17 or 21) ──
sudo apt-get update
sudo apt-get install -y fontconfig openjdk-21-jre

# ── Add Jenkins apt repo and install ──
sudo wget -O /usr/share/keyrings/jenkins-keyring.asc \\
  https://pkg.jenkins.io/debian-stable/jenkins.io-2023.key

echo "deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] \\
  https://pkg.jenkins.io/debian-stable binary/" | \\
  sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null

sudo apt-get update
sudo apt-get install -y jenkins

# ── Start and enable ──
sudo systemctl enable jenkins
sudo systemctl start jenkins
sudo systemctl status jenkins

# ── Get initial admin password ──
sudo cat /var/lib/jenkins/secrets/initialAdminPassword

# ── Open http://<server-ip>:8080 in your browser ──
# 1. Paste the initial admin password
# 2. Choose "Install suggested plugins"
# 3. Create your admin user
# 4. Set Jenkins URL (http://<server-ip>:8080/)

# ── Configure Docker inside Jenkins ──
# Allow jenkins user to run Docker commands
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins

# ── Configure Global Tools (Manage Jenkins → Tools) ──
# JDK: add name "jdk21", JAVA_HOME=/usr/lib/jvm/java-21-openjdk-amd64
# NodeJS plugin: add name "node20", version 20.x
# Docker: add name "docker", install automatically or path /usr/bin/docker

# ── Add credentials (Manage Jenkins → Credentials) ──
# Kind: Username with password  → Docker Hub login
# Kind: Secret text            → API tokens, kubeconfig
# Kind: SSH Username with key  → agent and server SSH

# ── Connect an SSH build agent (Manage Jenkins → Nodes) ──
# New Node → name: "agent-1", type: Permanent Agent
# Remote root directory: /var/lib/jenkins
# Launch method: Launch agents via SSH
#   Host: <agent-ip>
#   Credentials: SSH key created above
#   Host Key Verification Strategy: Non-verifying (or Known Hosts)

# ── Verify agent is online ──
# Dashboard → Manage Jenkins → Nodes → agent-1 → status: "In sync"

# ── Run your first Freestyle job ──
# New Item → "hello-world" → Freestyle project
# Build step: Execute shell
#   echo "Build #$BUILD_NUMBER by Jenkins"
#   java -version
#   docker --version
# Save → Build Now → Console Output`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install Jenkins on a VM or Docker container. Complete the setup wizard, install the recommended plugins, and create an admin user. Navigate to Manage Jenkins → System Information and record the Jenkins version, Java version, and home directory.",
              np: "VM वा Docker container मा Jenkins install गर्नुहोस्। Setup wizard complete गर्नुहोस्, recommended plugin install गर्नुहोस्, र admin user create गर्नुहोस्। Manage Jenkins → System Information navigate गरी Jenkins version, Java version, र home directory record गर्नुहोस्।",
              jp: "VM または Docker コンテナに Jenkins をインストールする。セットアップウィザードを完了し、推奨プラグインをインストールし、管理者ユーザーを作成する。Manage Jenkins → System Information に移動して Jenkins バージョン・Java バージョン・ホームディレクトリを記録する。",
            },
            {
              en: "Install the Pipeline, Git, Docker Pipeline, and Credentials Binding plugins from Manage Jenkins → Plugins. Restart Jenkins and verify they appear in the installed list. These are the foundation for every pipeline you will write this week.",
              np: "Manage Jenkins → Plugins बाट Pipeline, Git, Docker Pipeline, र Credentials Binding plugin install गर्नुहोस्। Jenkins restart गरी installed list मा appear भएको verify गर्नुहोस्। यी यो हप्ता लेख्ने हर pipeline को foundation हुन्।",
              jp: "Manage Jenkins → Plugins から Pipeline・Git・Docker Pipeline・Credentials Binding プラグインをインストールする。Jenkins を再起動してインストール済みリストに表示されることを確認する。これらは今週書くすべてのパイプラインの基盤です。",
            },
            {
              en: "Create a Freestyle job that runs `echo $BUILD_NUMBER`, `git --version`, `docker --version`, and `node --version` in a shell step. Run it 5 times and observe the build history. Then look at the workspace on disk at `/var/lib/jenkins/workspace/<job-name>` to understand where Jenkins checks out code.",
              np: "Shell step मा `echo $BUILD_NUMBER`, `git --version`, `docker --version`, र `node --version` run गर्ने Freestyle job create गर्नुहोस्। 5 पटक run गरी build history observe गर्नुहोस्। त्यसपछि Jenkins ले code checkout गर्ने ठाउँ बुझ्न `/var/lib/jenkins/workspace/<job-name>` मा disk मा workspace हेर्नुहोस्।",
              jp: "シェルステップで `echo $BUILD_NUMBER`・`git --version`・`docker --version`・`node --version` を実行する Freestyle ジョブを作成する。5 回実行してビルド履歴を観察する。次に Jenkins がコードをチェックアウトする場所を理解するために `/var/lib/jenkins/workspace/<job-name>` でディスク上のワークスペースを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I run Jenkins on a VM or in Docker?",
        np: "Jenkins VM मा run गर्ने कि Docker मा?",
        jp: "Jenkins は VM で実行すべきか Docker で実行すべきか？",
      },
      answer: {
        en: "For learning, Docker is the fastest way: `docker run -d -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts-jdk21`. For production, a dedicated VM or bare-metal server is more stable — Jenkins' home directory `/var/lib/jenkins` contains all job configs, credentials, and build history. In production, mount that directory to a persistent volume (EBS, NFS) and set up daily snapshots. Never store Jenkins state inside a container without a volume.",
        np: "Learning को लागि, Docker सबैभन्दा fast way हो: `docker run -d -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts-jdk21`। Production को लागि, dedicated VM वा bare-metal server बढी stable छ — Jenkins को home directory `/var/lib/jenkins` मा सबै job config, credential, र build history छ। Production मा, त्यो directory लाई persistent volume (EBS, NFS) मा mount गर्नुहोस् र daily snapshot setup गर्नुहोस्। Volume बिना container भित्र Jenkins state कहिल्यै store नगर्नुहोस्।",
        jp: "学習用には Docker が最速です：`docker run -d -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts-jdk21`。本番環境では専用の VM またはベアメタルサーバーがより安定しています — Jenkins のホームディレクトリ `/var/lib/jenkins` にはすべてのジョブ設定・認証情報・ビルド履歴が含まれています。本番環境ではそのディレクトリを永続ボリューム（EBS・NFS）にマウントし、日次スナップショットを設定してください。ボリュームなしでコンテナ内に Jenkins の状態を保存しないでください。",
      },
      tag: { en: "setup", np: "Setup", jp: "セットアップ" },
    },
    {
      question: {
        en: "What is the difference between a Freestyle job and a Pipeline job?",
        np: "Freestyle job र Pipeline job बीच के फरक छ?",
        jp: "Freestyle ジョブと Pipeline ジョブの違いは何か？",
      },
      answer: {
        en: "A Freestyle job is configured through the UI — you click and fill forms to define build steps, SCM config, and post-build actions. It is quick to set up but not version-controlled and hard to review in code review. A Pipeline job is defined in a Jenkinsfile (code) that lives in the repository alongside the application. It is version-controlled, reviewable, reproducible, and supports complex workflows (parallel stages, retries, input gates, Docker agents). Always use Pipeline for any real project. Freestyle is useful only for quick experiments or legacy migrations.",
        np: "Freestyle job UI मार्फत configure हुन्छ — build step, SCM config, र post-build action define गर्न click र form fill गर्नुहुन्छ। Setup गर्न quick छ तर version-controlled छैन र code review मा hard छ। Pipeline job एउटा Jenkinsfile (code) मा define हुन्छ जुन application को साथ repository मा रहन्छ। Version-controlled, reviewable, reproducible, र complex workflow support गर्छ (parallel stage, retry, input gate, Docker agent)। कुनैपनि real project को लागि Pipeline हमेशा प्रयोग गर्नुहोस्। Freestyle quick experiment वा legacy migration को लागि मात्र useful छ।",
        jp: "Freestyle ジョブは UI を通じて設定されます — ビルドステップ・SCM 設定・ビルド後アクションを定義するためにクリックしてフォームを入力します。セットアップは素早いですが、バージョン管理されておらずコードレビューが難しい。Pipeline ジョブはアプリケーションと同じリポジトリに存在する Jenkinsfile（コード）で定義されます。バージョン管理・レビュー可能・再現可能で、複雑なワークフロー（並列ステージ・リトライ・入力ゲート・Docker エージェント）をサポートします。本番プロジェクトには常に Pipeline を使用してください。Freestyle はクイック実験またはレガシー移行にのみ有用です。",
      },
      tag: { en: "jobs", np: "Jobs", jp: "ジョブ" },
    },
  ],
};
