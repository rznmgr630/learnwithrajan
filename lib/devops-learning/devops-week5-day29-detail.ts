import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Cloud computing means renting compute, storage, and networking from a provider who manages the physical infrastructure. AWS is the market leader — over a third of the internet runs on it. Understanding AWS fundamentals is not optional for a modern DevOps engineer: your CI/CD pipelines, containers, secrets, DNS, and databases will live here.",
    np: "Cloud computing भनेको physical infrastructure manage गर्ने provider बाट compute, storage, र networking भाडामा लिनु हो। AWS market leader हो — एक तिहाई भन्दा बढी internet यसमा चल्छ। आधुनिक DevOps engineer का लागि AWS fundamentals बुझ्नु optional छैन: तपाईंको CI/CD pipeline, container, secret, DNS, र database यहाँ रहनेछन्।",
    jp: "クラウドコンピューティングとは、物理インフラを管理するプロバイダーからコンピューティング・ストレージ・ネットワーキングを借りることです。AWS は市場リーダーであり、インターネットの 3 分の 1 以上がその上で動いています。現代の DevOps エンジニアにとって AWS の基礎を理解することは任意ではありません：CI/CD パイプライン・コンテナ・シークレット・DNS・データベースがここに置かれます。",
  } as const,
  o2: {
    en: "Today is a survey of the landscape: cloud service models, AWS global infrastructure, the core service categories every DevOps engineer uses, and the AWS CLI that ties it all together. You will end with hands-on exploration of a real AWS environment so the concepts have concrete anchors.",
    np: "आज landscape को survey हो: cloud service model, AWS global infrastructure, हरेक DevOps engineer प्रयोग गर्ने core service category, र सबैलाई जोड्ने AWS CLI। तपाईंले real AWS environment को hands-on exploration सँग अन्त्य गर्नुहुनेछ जसले concept लाई concrete anchor दिन्छ।",
    jp: "今日はランドスケープの調査です：クラウドサービスモデル・AWS グローバルインフラ・すべての DevOps エンジニアが使うコアサービスカテゴリ・それらをつなぐ AWS CLI。概念に具体的な錨を与えるため、実際の AWS 環境のハンズオン探索で締めくくります。",
  } as const,
};

export const DEVOPS_DAY_29_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Cloud service models — IaaS, PaaS, SaaS",
        np: "Cloud service model — IaaS, PaaS, SaaS",
        jp: "クラウドサービスモデル — IaaS・PaaS・SaaS",
      },
      blocks: [
        { type: "diagram", id: "devops-cloud-models" },
        {
          type: "table",
          caption: {
            en: "IaaS vs PaaS vs SaaS — what you manage vs what AWS manages",
            np: "IaaS vs PaaS vs SaaS — तपाईंले manage गर्ने vs AWS ले manage गर्ने",
            jp: "IaaS vs PaaS vs SaaS — あなたが管理するもの vs AWS が管理するもの",
          },
          headers: [
            { en: "Model", np: "Model", jp: "モデル" },
            { en: "You manage", np: "तपाईं manage गर्नुहुन्छ", jp: "あなたが管理" },
            { en: "AWS manages", np: "AWS manage गर्छ", jp: "AWS が管理" },
            { en: "AWS example", np: "AWS example", jp: "AWS の例" },
            { en: "When to pick", np: "कहिले रोज्ने", jp: "いつ選ぶか" },
          ],
          rows: [
            [
              { en: "IaaS", np: "IaaS", jp: "IaaS" },
              { en: "OS, runtime, app, data", np: "OS, runtime, app, data", jp: "OS・ランタイム・アプリ・データ" },
              { en: "Hypervisor, hardware, DC", np: "Hypervisor, hardware, DC", jp: "ハイパーバイザー・ハードウェア・DC" },
              { en: "EC2", np: "EC2", jp: "EC2" },
              { en: "Need full control over the stack", np: "Stack मा पूर्ण control चाहिन्छ", jp: "スタックへの完全制御が必要" },
            ],
            [
              { en: "PaaS", np: "PaaS", jp: "PaaS" },
              { en: "App code and data only", np: "App code र data मात्र", jp: "アプリコードとデータのみ" },
              { en: "OS, runtime, patching, scaling", np: "OS, runtime, patching, scaling", jp: "OS・ランタイム・パッチ・スケーリング" },
              { en: "Elastic Beanstalk, Lambda", np: "Elastic Beanstalk, Lambda", jp: "Elastic Beanstalk・Lambda" },
              { en: "Want to focus on code, not infra", np: "Infrastructure होइन code मा focus गर्न चाहन्छ", jp: "インフラではなくコードに集中したい" },
            ],
            [
              { en: "SaaS", np: "SaaS", jp: "SaaS" },
              { en: "Configuration and usage", np: "Configuration र usage", jp: "設定と利用" },
              { en: "Everything — app, runtime, OS, DC", np: "सबै — app, runtime, OS, DC", jp: "すべて — アプリ・ランタイム・OS・DC" },
              { en: "Cognito, WorkMail, Chime", np: "Cognito, WorkMail, Chime", jp: "Cognito・WorkMail・Chime" },
              { en: "Commodity capability, not a differentiator", np: "Commodity capability, differentiator होइन", jp: "コモディティ機能、差別化にならない" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "The shared responsibility model is the most important security concept in AWS: AWS is responsible for security **of** the cloud (hardware, facilities, hypervisor, managed service software). You are responsible for security **in** the cloud (your OS patches, your IAM policies, your encryption settings, your app code). Misunderstanding this boundary is the root cause of most AWS security breaches.",
            np: "Shared responsibility model AWS मा सबैभन्दा महत्वपूर्ण security concept हो: AWS ले cloud **को** security का लागि जिम्मेवार छ (hardware, facility, hypervisor, managed service software)। तपाईं cloud **भित्रको** security का लागि जिम्मेवार हुनुहुन्छ (तपाईंको OS patch, IAM policy, encryption setting, app code)। यो boundary गलत बुझ्नु अधिकांश AWS security breach को मूल कारण हो।",
            jp: "共有責任モデルは AWS で最も重要なセキュリティ概念です：AWS はクラウド**の**セキュリティ（ハードウェア・施設・ハイパーバイザー・マネージドサービスソフトウェア）に責任を持ちます。あなたはクラウド**内の**セキュリティ（OS パッチ・IAM ポリシー・暗号化設定・アプリコード）に責任を持ちます。この境界の誤解がほとんどの AWS セキュリティ侵害の根本原因です。",
          },
        },
      ],
    },
    {
      title: {
        en: "AWS global infrastructure",
        np: "AWS global infrastructure",
        jp: "AWS グローバルインフラ",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "AWS infrastructure building blocks and their DevOps relevance",
            np: "AWS infrastructure building block र तिनीहरूको DevOps relevance",
            jp: "AWS インフラの構成要素と DevOps における関連性",
          },
          headers: [
            { en: "Concept", np: "Concept", jp: "概念" },
            { en: "Definition", np: "परिभाषा", jp: "定義" },
            { en: "DevOps relevance", np: "DevOps relevance", jp: "DevOps における関連性" },
          ],
          rows: [
            [
              { en: "Region", np: "Region", jp: "リージョン" },
              { en: "A named geographic area (e.g. us-east-1 = N. Virginia). Contains 3+ AZs.", np: "Named geographic area (जस्तै us-east-1 = N. Virginia)। 3+ AZ समावेश छ।", jp: "名前付きの地理的エリア（例：us-east-1 = 北バージニア）。3 つ以上の AZ を含む。" },
              { en: "Choose based on user proximity, compliance, and service availability.", np: "User proximity, compliance, र service availability को आधारमा रोज्नुहोस्।", jp: "ユーザーの近さ・コンプライアンス・サービスの可用性に基づいて選択。" },
            ],
            [
              { en: "Availability Zone (AZ)", np: "Availability Zone (AZ)", jp: "アベイラビリティゾーン（AZ）" },
              { en: "An isolated data center (or cluster) within a region. They have separate power, cooling, and networking.", np: "Region भित्र isolated data center (वा cluster)। तिनीहरूसँग अलग power, cooling, र networking छ।", jp: "リージョン内の隔離されたデータセンター（またはクラスター）。それぞれ独立した電力・冷却・ネットワークを持つ。" },
              { en: "Always deploy across ≥ 2 AZs. If one AZ fails, traffic shifts to the other automatically.", np: "सधैं ≥ 2 AZ मा deploy गर्नुहोस्। एउटा AZ fail भएमा, traffic automatically अर्कोमा shift हुन्छ।", jp: "常に 2 つ以上の AZ にデプロイ。1 つの AZ が障害になると、トラフィックは自動的に他の AZ に移行。" },
            ],
            [
              { en: "Edge Location", np: "Edge Location", jp: "エッジロケーション" },
              { en: "CloudFront CDN PoP. Currently 400+ worldwide. Caches content close to end users.", np: "CloudFront CDN PoP। हाल 400+ worldwide। End user नजिक content cache गर्छ।", jp: "CloudFront CDN の PoP。現在世界 400 か所以上。エンドユーザーの近くでコンテンツをキャッシュ。" },
              { en: "Use CloudFront in front of S3 static sites and API Gateways to reduce latency globally.", np: "Global latency कम गर्न S3 static site र API Gateway अगाडि CloudFront प्रयोग गर्नुहोस्।", jp: "グローバルなレイテンシ削減のため S3 静的サイトと API Gateway の前に CloudFront を使用。" },
            ],
            [
              { en: "Local Zone", np: "Local Zone", jp: "ローカルゾーン" },
              { en: "An AWS infrastructure extension in a metro area. Single-digit millisecond latency for that city.", np: "Metro area मा AWS infrastructure extension। उस शहरका लागि single-digit millisecond latency।", jp: "都市圏の AWS インフラ拡張。その都市向けに一桁ミリ秒のレイテンシ。" },
              { en: "Use for latency-sensitive workloads like live video, gaming, or real-time trading in specific cities.", np: "Specific city मा live video, gaming, वा real-time trading जस्ता latency-sensitive workload का लागि प्रयोग गर्नुहोस्।", jp: "特定の都市でライブビデオ・ゲーム・リアルタイム取引などのレイテンシ敏感なワークロードに使用。" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Three rules for region selection: (1) **Latency** — pick the region closest to your users. Use `cloudping.info` to measure. (2) **Compliance** — GDPR requires EU data to stay in the EU; HIPAA workloads may need a specific region. (3) **Service availability** — not every AWS service is available in every region. Check the [region table](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) before architecting. Always deploy your production workloads across at least 2 AZs — this is table stakes, not a nice-to-have.",
            np: "Region selection का तीन नियम: (1) **Latency** — user सबैभन्दा नजिकको region रोज्नुहोस्। Measure गर्न `cloudping.info` प्रयोग गर्नुहोस्। (2) **Compliance** — GDPR ले EU data EU मा राख्न आवश्यक गर्छ; HIPAA workload लाई specific region चाहिन्छ। (3) **Service availability** — सबै AWS service सबै region मा उपलब्ध छैन। Architect गर्नु अघि region table check गर्नुहोस्। सधैं कम्तीमा 2 AZ मा production workload deploy गर्नुहोस् — यो optional होइन।",
            jp: "リージョン選択の 3 つのルール：(1) **レイテンシ** — ユーザーに最も近いリージョンを選ぶ。`cloudping.info` で測定。(2) **コンプライアンス** — GDPR は EU データが EU 内に留まることを要求；HIPAA ワークロードは特定のリージョンが必要な場合がある。(3) **サービス可用性** — すべての AWS サービスがすべてのリージョンで利用可能なわけではない。設計前にリージョンテーブルを確認。常に最低 2 つの AZ に本番ワークロードをデプロイ — これはオプションではなく最低限のこと。",
          },
        },
      ],
    },
    {
      title: {
        en: "Core AWS service categories",
        np: "Core AWS service category",
        jp: "AWS コアサービスカテゴリ",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "AWS service categories and what DevOps engineers use them for",
            np: "AWS service category र DevOps engineer ले तिनीहरू के का लागि प्रयोग गर्छन्",
            jp: "AWS サービスカテゴリと DevOps エンジニアがそれらを使う目的",
          },
          headers: [
            { en: "Category", np: "Category", jp: "カテゴリ" },
            { en: "Key services", np: "Key service", jp: "主要サービス" },
            { en: "DevOps use", np: "DevOps use", jp: "DevOps での用途" },
          ],
          rows: [
            [
              { en: "Compute", np: "Compute", jp: "コンピューティング" },
              { en: "EC2, Lambda, ECS, EKS", np: "EC2, Lambda, ECS, EKS", jp: "EC2・Lambda・ECS・EKS" },
              { en: "Run application servers, containers, and serverless functions", np: "Application server, container, र serverless function run गर्नुहोस्", jp: "アプリケーションサーバー・コンテナ・サーバーレス関数の実行" },
            ],
            [
              { en: "Storage", np: "Storage", jp: "ストレージ" },
              { en: "S3, EBS, EFS", np: "S3, EBS, EFS", jp: "S3・EBS・EFS" },
              { en: "Artifact storage, EC2 block storage, shared file systems for containers", np: "Artifact storage, EC2 block storage, container का लागि shared file system", jp: "アーティファクトストレージ・EC2 ブロックストレージ・コンテナ用共有ファイルシステム" },
            ],
            [
              { en: "Database", np: "Database", jp: "データベース" },
              { en: "RDS, DynamoDB, ElastiCache", np: "RDS, DynamoDB, ElastiCache", jp: "RDS・DynamoDB・ElastiCache" },
              { en: "Managed relational DBs, NoSQL, Redis/Memcached caching layer", np: "Managed relational DB, NoSQL, Redis/Memcached caching layer", jp: "マネージドリレーショナル DB・NoSQL・Redis/Memcached キャッシュレイヤー" },
            ],
            [
              { en: "Networking", np: "Networking", jp: "ネットワーキング" },
              { en: "VPC, Route 53, CloudFront, ELB", np: "VPC, Route 53, CloudFront, ELB", jp: "VPC・Route 53・CloudFront・ELB" },
              { en: "Network isolation, DNS, CDN, and load balancing", np: "Network isolation, DNS, CDN, र load balancing", jp: "ネットワーク分離・DNS・CDN・ロードバランシング" },
            ],
            [
              { en: "Security", np: "Security", jp: "セキュリティ" },
              { en: "IAM, KMS, Secrets Manager, GuardDuty", np: "IAM, KMS, Secrets Manager, GuardDuty", jp: "IAM・KMS・Secrets Manager・GuardDuty" },
              { en: "Access control, encryption key management, secret rotation, threat detection", np: "Access control, encryption key management, secret rotation, threat detection", jp: "アクセス制御・暗号化キー管理・シークレットのローテーション・脅威検出" },
            ],
            [
              { en: "DevOps / CI-CD", np: "DevOps / CI-CD", jp: "DevOps / CI-CD" },
              { en: "CodePipeline, CodeBuild, CloudFormation, CDK", np: "CodePipeline, CodeBuild, CloudFormation, CDK", jp: "CodePipeline・CodeBuild・CloudFormation・CDK" },
              { en: "Fully-managed CI/CD pipelines and infrastructure as code on AWS", np: "AWS मा fully-managed CI/CD pipeline र infrastructure as code", jp: "AWS 上の完全マネージド CI/CD パイプラインとインフラのコード化" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "The AWS free tier is more generous than most people realise. You get 750 hours/month of t2.micro or t3.micro EC2 (enough to run a server 24/7 for the whole month), 5 GB S3 standard storage, 25 GB DynamoDB, and 1 million Lambda invocations per month — indefinitely, not just for 12 months. Set a billing alert at $5 immediately after creating your account so a misconfigured resource does not surprise you with a bill.",
            np: "AWS free tier अधिकांश मानिसले सोचेभन्दा बढी generous छ। तपाईंले 750 hours/month t2.micro वा t3.micro EC2 (पूरै महिना 24/7 server run गर्न पुग्ने), 5 GB S3 standard storage, 25 GB DynamoDB, र 1 million Lambda invocation per month पाउनुहुन्छ — 12 month मात्र होइन, indefinitely। Account बनाएपछि तुरुन्तै $5 मा billing alert set गर्नुहोस् ताकि misconfigured resource ले bill ले अचम्म नपार्ओस्।",
            jp: "AWS 無料枠はほとんどの人が思う以上に充実しています。750 時間/月の t2.micro または t3.micro EC2（1 か月間 24/7 サーバーを実行するのに十分）・5 GB S3 標準ストレージ・25 GB DynamoDB・100 万回/月の Lambda 呼び出しが — 12 か月だけでなく、無期限で利用できます。アカウント作成直後に $5 の請求アラートを設定し、設定ミスのリソースで請求書に驚かないようにしましょう。",
          },
        },
      ],
    },
    {
      title: {
        en: "The AWS CLI — your command center",
        np: "AWS CLI — तपाईंको command center",
        jp: "AWS CLI — あなたのコマンドセンター",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Everything you can do in the AWS console can be done via the CLI — and the CLI is far better for automation and reproducibility. `aws configure` stores credentials in `~/.aws/credentials` and the region in `~/.aws/config`. Use **named profiles** (`aws configure --profile prod`) when you have multiple accounts — never share credentials between accounts. The `--output` flag accepts `json` (default), `yaml`, `table`, and `text`. The `--query` flag uses JMESPath to filter output — essential for scripting so you get exactly the field you need without `grep` or `jq` gymnastics.",
            np: "AWS console मा गर्न सकिने सबै काम CLI मार्फत गर्न सकिन्छ — र CLI automation र reproducibility का लागि धेरै राम्रो छ। `aws configure` ले `~/.aws/credentials` मा credential र `~/.aws/config` मा region store गर्छ। धेरै account भएमा **named profile** (`aws configure --profile prod`) प्रयोग गर्नुहोस् — account बीच credential कहिल्यै share नगर्नुहोस्। `--output` flag ले `json` (default), `yaml`, `table`, र `text` accept गर्छ। `--query` flag ले JMESPath प्रयोग गरी output filter गर्छ।",
            jp: "AWS コンソールでできることはすべて CLI でもでき、CLI は自動化と再現性において圧倒的に優れています。`aws configure` は `~/.aws/credentials` に認証情報を、`~/.aws/config` にリージョンを保存します。複数のアカウントがある場合は**名前付きプロファイル**（`aws configure --profile prod`）を使用 — アカウント間で認証情報を共有しないこと。`--output` フラグは `json`（デフォルト）・`yaml`・`table`・`text` を受け付けます。`--query` フラグは JMESPath を使って出力をフィルタリングします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Essential AWS CLI commands for day 1",
            np: "Day 1 का लागि essential AWS CLI command",
            jp: "初日に使う必須 AWS CLI コマンド",
          },
          code: `# --- Setup ---
# Install: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
aws --version   # aws-cli/2.x.x

# Configure default profile
aws configure
# AWS Access Key ID [None]: AKIA...
# AWS Secret Access Key [None]: ....
# Default region name [None]: us-east-1
# Default output format [None]: json

# Configure a named profile (for multiple accounts)
aws configure --profile prod
aws configure --profile staging

# --- Verify identity ---
aws sts get-caller-identity
# {
#     "UserId": "AIDAXXXXXXXXXXXXXXXX",
#     "Account": "123456789012",
#     "Arn": "arn:aws:iam::123456789012:user/rajan"
# }

# Use a specific profile
aws sts get-caller-identity --profile prod

# --- EC2: list instances ---
aws ec2 describe-instances --output table

# Filter: only running instances, show ID + Name tag + state
aws ec2 describe-instances \
    --filters "Name=instance-state-name,Values=running" \
    --query "Reservations[*].Instances[*].{ID:InstanceId,Name:Tags[?Key=='Name']|[0].Value,State:State.Name}" \
    --output table

# --- S3: basic operations ---
# List all buckets
aws s3 ls

# Create a bucket (bucket names are globally unique)
aws s3 mb s3://my-devops-learning-$(date +%s)

# Upload a file
aws s3 cp ./deploy.sh s3://my-bucket/scripts/deploy.sh

# Sync a directory
aws s3 sync ./dist/ s3://my-bucket/static/ --delete

# --- Useful output tricks ---
# Get just the instance IDs as a plain list (good for scripting)
aws ec2 describe-instances \
    --query "Reservations[*].Instances[*].InstanceId" \
    --output text

# Store output in a variable
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Running in account: $ACCOUNT_ID"`,
        },
      ],
    },
    {
      title: {
        en: "AWS Well-Architected Framework — 6 pillars",
        np: "AWS Well-Architected Framework — 6 pillar",
        jp: "AWS Well-Architected Framework — 6 つの柱",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Operational Excellence** — automate everything, make small frequent changes instead of infrequent large ones, anticipate failure. Use runbooks, dashboards, and alarms. Review and iterate.",
              np: "**Operational Excellence** — सबै automate गर्नुहोस्, कम frequent ठूलो परिवर्तनको सट्टा साना frequent परिवर्तन गर्नुहोस्, failure anticipate गर्नुहोस्। Runbook, dashboard, र alarm प्रयोग गर्नुहोस्।",
              jp: "**運用上の優秀性** — すべてを自動化し、大きな変更を少なくするのではなく小さな変更を頻繁に行い、障害を予測する。ランブック・ダッシュボード・アラームを使用する。",
            },
            {
              en: "**Security** — apply least privilege IAM, enable MFA, encrypt data at rest and in transit, use AWS Security Hub and GuardDuty, never put secrets in code or environment variables — use Secrets Manager.",
              np: "**Security** — least privilege IAM apply गर्नुहोस्, MFA enable गर्नुहोस्, data at rest र in transit encrypt गर्नुहोस्, AWS Security Hub र GuardDuty प्रयोग गर्नुहोस्, code वा environment variable मा secret कहिल्यै नराख्नुहोस् — Secrets Manager प्रयोग गर्नुहोस्।",
              jp: "**セキュリティ** — 最小権限の IAM を適用し、MFA を有効化し、保存中・転送中のデータを暗号化し、AWS Security Hub と GuardDuty を使用し、コードや環境変数にシークレットを入れない — Secrets Manager を使用。",
            },
            {
              en: "**Reliability** — deploy across multiple AZs, use Auto Scaling groups, set up health checks and circuit breakers, test failure with Chaos Engineering, design for graceful degradation.",
              np: "**Reliability** — multiple AZ मा deploy गर्नुहोस्, Auto Scaling group प्रयोग गर्नुहोस्, health check र circuit breaker set up गर्नुहोस्, Chaos Engineering सँग failure test गर्नुहोस्।",
              jp: "**信頼性** — 複数の AZ にデプロイし、Auto Scaling グループを使用し、ヘルスチェックとサーキットブレーカーを設定し、カオスエンジニアリングで障害をテストし、グレースフルデグラデーションのために設計する。",
            },
            {
              en: "**Performance Efficiency** — right-size your instances (do not run a c5.4xlarge for a low-traffic site), use managed services instead of self-hosted (RDS beats running your own PostgreSQL on EC2), measure and benchmark.",
              np: "**Performance Efficiency** — instance right-size गर्नुहोस् (low-traffic site का लागि c5.4xlarge नचलाउनुहोस्), self-hosted को सट्टा managed service प्रयोग गर्नुहोस् (RDS ले EC2 मा आफ्नै PostgreSQL चलाउनुभन्दा राम्रो), measure र benchmark गर्नुहोस्।",
              jp: "**パフォーマンス効率** — インスタンスを適切にサイジングし（低トラフィックサイトに c5.4xlarge を使わない）、セルフホストではなくマネージドサービスを使用し（RDS は EC2 上の自前 PostgreSQL より優れている）、測定してベンチマークする。",
            },
            {
              en: "**Cost Optimization** — use Reserved Instances or Savings Plans for predictable workloads (up to 72% cheaper than On-Demand), Spot Instances for fault-tolerant batch jobs, turn off dev environments outside business hours, use S3 lifecycle policies.",
              np: "**Cost Optimization** — predictable workload का लागि Reserved Instance वा Savings Plan प्रयोग गर्नुहोस् (On-Demand भन्दा 72% सस्तो), fault-tolerant batch job का लागि Spot Instance, business hour बाहिर dev environment बन्द गर्नुहोस्।",
              jp: "**コスト最適化** — 予測可能なワークロードには Reserved Instances または Savings Plans を使用（オンデマンドより最大 72% 安い）、耐障害性バッチジョブには Spot Instances を使用し、業務時間外に開発環境をオフにし、S3 ライフサイクルポリシーを使用する。",
            },
            {
              en: "**Sustainability** — choose regions with high renewable energy usage, right-size to avoid wasted resources, use serverless and managed services that AWS runs at higher utilisation than individual tenants, enable S3 Intelligent-Tiering.",
              np: "**Sustainability** — high renewable energy usage भएका region रोज्नुहोस्, wasted resource avoid गर्न right-size गर्नुहोस्, AWS ले individual tenant भन्दा बढी utilisation मा चलाउने serverless र managed service प्रयोग गर्नुहोस्।",
              jp: "**持続可能性** — 再生可能エネルギー使用率の高いリージョンを選び、リソースの無駄を避けるために適切にサイジングし、AWS が個別テナントより高い使用率で運用するサーバーレスやマネージドサービスを使用する。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: explore your first AWS environment",
        np: "Hands-on: पहिलो AWS environment explore गर्नुहोस्",
        jp: "ハンズオン：最初の AWS 環境を探索する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install the AWS CLI v2: follow the official guide for your OS at `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html`, then run `aws --version` to confirm.",
              np: "AWS CLI v2 install गर्नुहोस्: `https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html` मा आफ्नो OS को लागि official guide follow गर्नुहोस्, त्यसपछि confirm गर्न `aws --version` run गर्नुहोस्।",
              jp: "AWS CLI v2 をインストール：`https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html` の OS 別の公式ガイドに従い、`aws --version` を実行して確認する。",
            },
            {
              en: "Configure your credentials with `aws configure` (use an IAM user with AdministratorAccess for learning, NOT root access keys), then run `aws sts get-caller-identity` to verify you are authenticated.",
              np: "`aws configure` सँग credential configure गर्नुहोस् (learning का लागि AdministratorAccess सहितको IAM user प्रयोग गर्नुहोस्, root access key होइन), त्यसपछि authenticated छ भनी verify गर्न `aws sts get-caller-identity` run गर्नुहोस्।",
              jp: "`aws configure` で認証情報を設定（学習には root アクセスキーではなく AdministratorAccess を持つ IAM ユーザーを使用）し、`aws sts get-caller-identity` を実行して認証されていることを確認する。",
            },
            {
              en: "List all EC2 instances in your default region: `aws ec2 describe-instances --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name,Type:InstanceType}' --output table`",
              np: "Default region मा सबै EC2 instance list गर्नुहोस्: `aws ec2 describe-instances --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name,Type:InstanceType}' --output table`",
              jp: "デフォルトリージョンのすべての EC2 インスタンスを一覧表示：`aws ec2 describe-instances --query 'Reservations[*].Instances[*].{ID:InstanceId,State:State.Name,Type:InstanceType}' --output table`",
            },
            {
              en: "Create an S3 bucket with a unique name and upload a file: `aws s3 mb s3://devops-learning-$(date +%s) && echo 'hello from aws' > test.txt && aws s3 cp test.txt s3://YOUR-BUCKET/test.txt`",
              np: "Unique name सहित S3 bucket बनाउनुहोस् र file upload गर्नुहोस्: `aws s3 mb s3://devops-learning-$(date +%s) && echo 'hello from aws' > test.txt && aws s3 cp test.txt s3://YOUR-BUCKET/test.txt`",
              jp: "ユニークな名前で S3 バケットを作成してファイルをアップロード：`aws s3 mb s3://devops-learning-$(date +%s) && echo 'hello from aws' > test.txt && aws s3 cp test.txt s3://YOUR-BUCKET/test.txt`",
            },
            {
              en: "View recent CloudTrail API calls to see your own actions being logged: `aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=YOUR-USERNAME --max-results 10`",
              np: "आफ्नै action log भइरहेको देख्न recent CloudTrail API call हेर्नुहोस्: `aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=YOUR-USERNAME --max-results 10`",
              jp: "自分のアクションがログに記録されているのを確認するため、最近の CloudTrail API 呼び出しを表示：`aws cloudtrail lookup-events --lookup-attributes AttributeKey=Username,AttributeValue=YOUR-USERNAME --max-results 10`",
            },
            {
              en: "Open the AWS Console → Billing → Free Tier and set a billing alert at $5 via CloudWatch: Billing → Billing Preferences → enable 'Receive Billing Alerts', then create a CloudWatch alarm on the `EstimatedCharges` metric.",
              np: "AWS Console → Billing → Free Tier खोल्नुहोस् र CloudWatch मार्फत $5 मा billing alert set गर्नुहोस्: Billing → Billing Preferences → 'Receive Billing Alerts' enable गर्नुहोस्, त्यसपछि `EstimatedCharges` metric मा CloudWatch alarm बनाउनुहोस्।",
              jp: "AWS コンソール → Billing → Free Tier を開き、CloudWatch 経由で $5 の請求アラートを設定：Billing → Billing Preferences → 'Receive Billing Alerts' を有効化し、`EstimatedCharges` メトリクスに CloudWatch アラームを作成する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What's the difference between a region and an Availability Zone?",
        np: "Region र Availability Zone बीच के फरक छ?",
        jp: "リージョンとアベイラビリティゾーンの違いは？",
      },
      answer: {
        en: "A region is a geographic area — us-east-1 is Northern Virginia, eu-west-1 is Ireland. Each region contains multiple Availability Zones (AZs), which are physically separate data centres with independent power, cooling, and networking. us-east-1 has 6 AZs: us-east-1a through 1f. When you deploy across 2+ AZs, a power outage or flood in one data centre does not take down your service. This multi-AZ design is what separates 99.99% uptime from 99.9%.",
        np: "Region एउटा geographic area हो — us-east-1 Northern Virginia हो, eu-west-1 Ireland हो। प्रत्येक region मा multiple Availability Zone (AZ) छन्, जुन physically separate data centre हुन् independent power, cooling, र networking सहित। us-east-1 मा 6 AZ छन्: us-east-1a देखि 1f सम्म। 2+ AZ मा deploy गर्दा, एउटा data centre मा power outage वा flood ले service down गर्दैन।",
        jp: "リージョンは地理的エリアです — us-east-1 は北バージニア、eu-west-1 はアイルランドです。各リージョンには複数のアベイラビリティゾーン（AZ）が含まれており、それらは独立した電力・冷却・ネットワークを持つ物理的に別々のデータセンターです。us-east-1 には 6 つの AZ があります（us-east-1a〜1f）。2 つ以上の AZ にデプロイすると、1 つのデータセンターで停電や洪水が発生してもサービスは停止しません。",
      },
      tag: { en: "aws", np: "AWS", jp: "AWS" },
    },
    {
      question: {
        en: "How do I choose which AWS region to use?",
        np: "कुन AWS region प्रयोग गर्ने कसरी छान्ने?",
        jp: "どの AWS リージョンを使うか、どのように選ぶか？",
      },
      answer: {
        en: "Three factors in order of importance: (1) Compliance — if laws or contracts require data to stay in a specific geography (GDPR in EU, data sovereignty laws in India/China/Australia), that constraint wins. (2) User proximity — use cloudping.info to measure latency from your primary user locations to each region. A 50ms vs 200ms round trip is a real UX difference. (3) Service availability — not all services are GA in all regions. Check the AWS regional services list for any service critical to your architecture.",
        np: "महत्वको क्रममा तीन factor: (1) Compliance — यदि law वा contract ले data specific geography मा राख्न आवश्यक गर्छ (EU मा GDPR, India/China/Australia मा data sovereignty law), त्यो constraint जित्छ। (2) User proximity — primary user location बाट प्रत्येक region सम्म latency measure गर्न cloudping.info प्रयोग गर्नुहोस्। (3) Service availability — सबै service सबै region मा GA छैनन्।",
        jp: "重要度の順に 3 つの要素：(1) コンプライアンス — 法律や契約でデータを特定の地理に留める必要がある場合（EU の GDPR、インド/中国/オーストラリアのデータ主権法）、その制約が優先されます。(2) ユーザーの近さ — cloudping.info で主要ユーザーの場所から各リージョンへのレイテンシを測定する。50ms vs 200ms の往復は実際の UX の差です。(3) サービス可用性 — すべてのサービスがすべてのリージョンで GA ではありません。",
      },
      tag: { en: "aws", np: "AWS", jp: "AWS" },
    },
    {
      question: {
        en: "Is the AWS free tier enough for learning?",
        np: "AWS free tier सिकाइका लागि पर्याप्त छ?",
        jp: "AWS 無料枠は学習に十分か？",
      },
      answer: {
        en: "Yes for the vast majority of learning tasks. The always-free tier includes: 750 hours/month of t2.micro or t3.micro EC2 (enough to run one instance 24/7 all month), 5 GB S3 standard storage, 25 GB DynamoDB, and 1 million Lambda invocations/month. Set a billing alert at $5 immediately — it takes 2 minutes and prevents surprises. The most common trap is forgetting to stop a NAT Gateway (costs ~$32/month) or an Elastic IP that is not attached (small but ongoing cost). Always check the billing dashboard weekly while learning.",
        np: "हो, अधिकांश learning task का लागि। Always-free tier मा समावेश छ: 750 hours/month t2.micro वा t3.micro EC2, 5 GB S3 standard storage, 25 GB DynamoDB, र 1 million Lambda invocation/month। तुरुन्तै $5 मा billing alert set गर्नुहोस् — 2 minute लाग्छ र surprise रोक्छ। सबैभन्दा सामान्य trap NAT Gateway (महिनामा ~$32 खर्च) वा attached नभएको Elastic IP बिर्सनु हो।",
        jp: "ほとんどの学習タスクには十分です。常時無料枠には：750 時間/月の t2.micro または t3.micro EC2・5 GB S3 標準ストレージ・25 GB DynamoDB・100 万回/月の Lambda 呼び出しが含まれます。すぐに $5 の請求アラートを設定しましょう — 2 分かかり、驚きを防ぎます。最も一般的な罠は NAT Gateway（月約 $32）や接続されていない Elastic IP を削除し忘れることです。学習中は毎週請求ダッシュボードを確認しましょう。",
      },
      tag: { en: "aws", np: "AWS", jp: "AWS" },
    },
  ],
};
