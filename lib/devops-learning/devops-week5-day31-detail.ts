import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "EC2 (Elastic Compute Cloud) is AWS's virtual machine service. A DevOps engineer needs to know how to pick the right instance type, launch with the right storage and network config, secure it with security groups, and automate all of it without ever clicking the console. EC2 is the foundation for everything that runs on AWS that isn't serverless.",
    np: "EC2 (Elastic Compute Cloud) AWS को virtual machine service हो। एक DevOps engineer लाई सही instance type छनोट गर्न, सही storage र network config सहित launch गर्न, security group सँग secure गर्न, र console मा कहिल्यै click नगरी सबै automate गर्न जान्नु आवश्यक छ। EC2 AWS मा चल्ने serverless नभएको सबैको foundation हो।",
    jp: "EC2（Elastic Compute Cloud）は AWS の仮想マシンサービスです。DevOps エンジニアは、適切なインスタンスタイプの選択・正しいストレージとネットワーク設定でのラウンチ・セキュリティグループによるセキュア化・コンソールを一切クリックせずにすべてを自動化する方法を知る必要があります。EC2 はサーバーレスでない AWS 上で動くすべての基盤です。",
  } as const,
  o2: {
    en: "Today you go from the basics (AMI, instance types, key pairs) to the professional workflow: launch from CLI, connect via SSM instead of opening port 22, configure user-data bootstrap scripts, attach IAM roles, and use Elastic IPs correctly.",
    np: "आज तपाईं basics (AMI, instance type, key pair) बाट professional workflow सम्म जानुहुन्छ: CLI बाट launch गर्नुहोस्, port 22 खोल्नुको सट्टा SSM मार्फत connect गर्नुहोस्, user-data bootstrap script configure गर्नुहोस्, IAM role attach गर्नुहोस्, र Elastic IP सही रूपमा प्रयोग गर्नुहोस्।",
    jp: "今日は基礎（AMI・インスタンスタイプ・キーペア）からプロフェッショナルなワークフローへ進みます：CLI からのラウンチ・ポート 22 を開く代わりに SSM で接続・ユーザーデータブートストラップスクリプトの設定・IAM ロールのアタッチ・Elastic IP の正しい使い方。",
  } as const,
};

export const DEVOPS_DAY_31_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "AMIs, instance types & pricing",
        np: "AMI, instance type र pricing",
        jp: "AMI・インスタンスタイプ・料金体系",
      },
      blocks: [
        { type: "diagram", id: "devops-ec2-lifecycle" },
        {
          type: "table",
          caption: {
            en: "EC2 pricing models — model, discount, use case, and risk",
            np: "EC2 pricing model — model, discount, use case, र risk",
            jp: "EC2 の料金モデル — モデル・割引・ユースケース・リスク",
          },
          headers: [
            { en: "Model", np: "Model", jp: "モデル" },
            { en: "Discount", np: "Discount", jp: "割引" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
            { en: "Risk", np: "Risk", jp: "リスク" },
          ],
          rows: [
            [
              { en: "On-Demand", np: "On-Demand", jp: "オンデマンド" },
              { en: "None — pay per second", np: "कुनै छैन — प्रति second भुक्तानी", jp: "なし — 秒単位の課金" },
              { en: "Spiky or unpredictable workloads, new applications being tested, short-lived dev environments.", np: "Unpredictable workload, test गरिँदै गरेका नयाँ application, छोटो अवधिको dev environment।", jp: "スパイキーまたは予測不可能なワークロード・テスト中の新しいアプリ・短命な開発環境。" },
              { en: "Highest cost for stable workloads. No savings if you forget to terminate unused instances.", np: "Stable workload का लागि सबैभन्दा महँगो। Unused instance terminate गर्न बिर्सियो भने कुनै savings छैन।", jp: "安定したワークロードでは最も高コスト。未使用のインスタンスを終了し忘れると節約なし。" },
            ],
            [
              { en: "Reserved (1yr / 3yr)", np: "Reserved (1 वर्ष / 3 वर्ष)", jp: "リザーブド（1 年 / 3 年）" },
              { en: "30–72% off On-Demand", np: "On-Demand भन्दा 30–72% छूट", jp: "オンデマンドより 30〜72% 割引" },
              { en: "Steady-state production workloads — databases, always-on web servers, predictable traffic.", np: "Steady-state production workload — database, always-on web server, predictable traffic।", jp: "安定した本番ワークロード — データベース・常時稼働の Web サーバー・予測可能なトラフィック。" },
              { en: "You commit to a specific instance type and region. Changing instance family requires a new reservation.", np: "Specific instance type र region मा commit गर्नुपर्छ। Instance family बदल्न नयाँ reservation चाहिन्छ।", jp: "特定のインスタンスタイプとリージョンにコミット。インスタンスファミリーの変更には新しい予約が必要。" },
            ],
            [
              { en: "Spot", np: "Spot", jp: "スポット" },
              { en: "Up to 90% off On-Demand", np: "On-Demand भन्दा 90% सम्म छूट", jp: "オンデマンドより最大 90% 割引" },
              { en: "Fault-tolerant batch jobs, CI/CD build agents, ML training, stateless workers that can checkpoint.", np: "Fault-tolerant batch job, CI/CD build agent, ML training, checkpoint गर्न सक्ने stateless worker।", jp: "耐障害性のあるバッチジョブ・CI/CD ビルドエージェント・ML トレーニング・チェックポイント可能なステートレスワーカー。" },
              { en: "AWS can reclaim the instance with 2-minute warning. Never use for databases or stateful workloads without checkpointing.", np: "AWS ले 2 मिनेट warning सँग instance reclaim गर्न सक्छ। Checkpointing बिना database वा stateful workload मा कहिल्यै प्रयोग नगर्नुहोस्।", jp: "AWS は 2 分前の警告でインスタンスを回収できる。チェックポイントなしのデータベースやステートフルワークロードには絶対使わない。" },
            ],
            [
              { en: "Savings Plans", np: "Savings Plans", jp: "セービングスプラン" },
              { en: "Up to 66% off — commitment by $/hr", np: "66% सम्म छूट — $/hr को commitment", jp: "最大 66% 割引 — ドル/時間のコミット" },
              { en: "Flexible alternative to Reserved — applies across instance families and regions (Compute Savings Plans).", np: "Reserved को flexible alternative — instance family र region पार apply हुन्छ (Compute Savings Plans)।", jp: "リザーブドの柔軟な代替 — インスタンスファミリーとリージョンをまたいで適用（Compute Savings Plans）。" },
              { en: "You commit to a spend rate, not a specific instance. Ideal when you need flexibility across EC2, Fargate, and Lambda.", np: "Specific instance होइन, spend rate मा commit गर्नुहुन्छ। EC2, Fargate, र Lambda पार flexibility चाहिँदा ideal।", jp: "特定のインスタンスではなく支出レートにコミット。EC2・Fargate・Lambda をまたいだ柔軟性が必要な場合に理想的。" },
            ],
            [
              { en: "Dedicated Host", np: "Dedicated Host", jp: "専用ホスト" },
              { en: "No discount — most expensive", np: "कुनै छैन — सबैभन्दा महँगो", jp: "割引なし — 最も高価" },
              { en: "Compliance requirements (BYOL — bring your own Windows/SQL Server licence), regulatory mandates for physical isolation.", np: "Compliance requirement (BYOL — आफ्नै Windows/SQL Server licence), physical isolation को regulatory mandate।", jp: "コンプライアンス要件（BYOL — Windows/SQL Server ライセンスの持ち込み）・物理的分離の規制上の義務。" },
              { en: "Overkill for most workloads. Licensing mistakes with BYOL can be costly — engage AWS Support before purchasing.", np: "धेरैजसो workload का लागि overkill। BYOL सँग licensing mistake महँगो हुन सक्छ — खरिद गर्नु अघि AWS Support engage गर्नुहोस्।", jp: "ほとんどのワークロードにはやり過ぎ。BYOL のライセンスミスはコスト高になりうる — 購入前に AWS Support に相談を。" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "Instance families follow a predictable naming scheme: **t** (burstable, backed by CPU credits — ideal for dev/test), **m** (general purpose, balanced vCPU:RAM ratio — web servers, microservices), **c** (compute-optimised, high vCPU:RAM ratio — CI build runners, game servers), **r** (memory-optimised — databases, in-memory caches, Elasticsearch), **g** (GPU-backed — ML inference, video transcoding), **i** (storage-optimised NVMe — Kafka brokers, time-series databases). Within a family, size determines resources: `t3.micro` (2 vCPU / 1 GB) for a personal project, `t3.small` (2 vCPU / 2 GB) when you start hitting memory limits, `m5.large` (2 vCPU / 8 GB) when consistent CPU is needed without burst behaviour. Always consult the AWS pricing page or `aws ec2 describe-instance-types` before picking — the vCPU:RAM ratio and baseline network throughput matter as much as raw compute.",
            np: "Instance family को naming scheme predictable हुन्छ: **t** (burstable, CPU credit backed — dev/test का लागि ideal), **m** (general purpose, balanced vCPU:RAM ratio — web server, microservice), **c** (compute-optimised, उच्च vCPU:RAM ratio — CI build runner, game server), **r** (memory-optimised — database, in-memory cache, Elasticsearch), **g** (GPU-backed — ML inference, video transcoding), **i** (storage-optimised NVMe — Kafka broker, time-series database)। Family भित्र, size ले resource determine गर्छ: personal project का लागि `t3.micro` (2 vCPU / 1 GB), memory limit hit हुन थाल्दा `t3.small` (2 vCPU / 2 GB), burst behaviour बिना consistent CPU चाहिँदा `m5.large` (2 vCPU / 8 GB)। छनोट गर्नु अघि AWS pricing page वा `aws ec2 describe-instance-types` जरूर हेर्नुहोस्।",
            jp: "インスタンスファミリーは予測可能な命名規則に従います：**t**（バースト可能・CPU クレジット方式 — 開発/テストに最適）、**m**（汎用・バランスの取れた vCPU:RAM 比 — Web サーバー・マイクロサービス）、**c**（コンピューティング最適化・高 vCPU:RAM 比 — CI ビルドランナー・ゲームサーバー）、**r**（メモリ最適化 — データベース・インメモリキャッシュ・Elasticsearch）、**g**（GPU バック — ML 推論・動画トランスコード）、**i**（ストレージ最適化 NVMe — Kafka ブローカー・時系列データベース）。ファミリー内ではサイズがリソースを決定します：個人プロジェクトには `t3.micro`（2 vCPU / 1 GB）・メモリ上限に当たり始めたら `t3.small`（2 vCPU / 2 GB）・バースト挙動なしで一定の CPU が必要なら `m5.large`（2 vCPU / 8 GB）。選択前に必ず AWS 料金ページか `aws ec2 describe-instance-types` を確認しましょう。",
          },
        },
      ],
    },
    {
      title: {
        en: "Launching EC2 from the CLI (the professional way)",
        np: "CLI बाट EC2 launch गर्नुहोस् (professional तरिका)",
        jp: "CLI から EC2 をラウンチする（プロの方法）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Never use the AWS console to launch production instances. The console does not produce repeatable, auditable infrastructure. Use `aws ec2 run-instances` for one-off launches or Terraform for anything that lives longer than a day. The critical parameters every launch must define: AMI ID (pinned to a specific version, not 'latest'), instance type, subnet ID, security group IDs, IAM instance profile (so the instance has AWS credentials without key files), and a user-data script to configure the instance on first boot. Tagging with `env`, `owner`, `app`, and `cost-center` tags on every resource is non-negotiable for cost attribution and automation.",
            np: "Production instance launch गर्न कहिल्यै AWS console प्रयोग नगर्नुहोस्। Console ले repeatable, auditable infrastructure produce गर्दैन। One-off launch का लागि `aws ec2 run-instances` वा एक दिनभन्दा बढी बाँच्ने जुनसुकैका लागि Terraform प्रयोग गर्नुहोस्। हरेक launch मा define गर्नुपर्ने critical parameter: AMI ID ('latest' होइन, specific version मा pinned), instance type, subnet ID, security group ID, IAM instance profile, र user-data script। हरेक resource मा `env`, `owner`, `app`, र `cost-center` tag गर्नु cost attribution र automation का लागि अनिवार्य छ।",
            jp: "本番インスタンスのラウンチに AWS コンソールは絶対使わないでください。コンソールは再現可能で監査可能なインフラを生成しません。一回限りのラウンチには `aws ec2 run-instances`、1 日以上存続するものには Terraform を使用してください。すべてのラウンチで定義が必要な重要パラメータ：AMI ID（「最新」ではなく特定バージョンに固定）・インスタンスタイプ・サブネット ID・セキュリティグループ ID・IAM インスタンスプロファイル・ユーザーデータスクリプト。すべてのリソースに `env`・`owner`・`app`・`cost-center` タグを付けることはコスト配分と自動化のために必須です。",
          },
        },
        {
          type: "code",
          title: {
            en: "aws ec2 run-instances — complete production launch, describe, and terminate",
            np: "aws ec2 run-instances — complete production launch, describe, र terminate",
            jp: "aws ec2 run-instances — 完全な本番ラウンチ・説明・終了",
          },
          code: `# ---- Launch a production-ready EC2 instance ----
aws ec2 run-instances \\
  --image-id          ami-0c02fb55956c7d316 \\   # Amazon Linux 2 (us-east-1) — pin this, don't use 'latest'
  --instance-type     t3.micro \\
  --subnet-id         subnet-0a1b2c3d4e5f6a7b8 \\  # private or public subnet in your VPC
  --security-group-ids sg-0web1234abcd5678 \\
  --iam-instance-profile Name=MyAppProfile \\     # IAM role — no SSH keys needed for AWS API calls
  --key-name          rajan-ec2-key \\            # Only for emergency SSH access; prefer SSM instead
  --user-data         file://bootstrap.sh \\      # Runs as root on first boot
  --block-device-mappings '[
    {
      "DeviceName": "/dev/xvda",
      "Ebs": {
        "VolumeSize": 20,
        "VolumeType": "gp3",
        "Iops": 3000,
        "Encrypted": true,
        "DeleteOnTermination": true
      }
    }
  ]' \\
  --metadata-options HttpTokens=required \\       # Enforce IMDSv2 (blocks SSRF credential theft)
  --tag-specifications '
    [
      {
        "ResourceType": "instance",
        "Tags": [
          {"Key": "Name",        "Value": "web-server-prod-1"},
          {"Key": "env",         "Value": "production"},
          {"Key": "owner",       "Value": "platform-team"},
          {"Key": "app",         "Value": "acme-web"},
          {"Key": "cost-center", "Value": "engineering"}
        ]
      }
    ]' \\
  --count 1

# ---- Describe running instances filtered by tag, extract IPs ----
aws ec2 describe-instances \\
  --filters "Name=tag:env,Values=production" "Name=instance-state-name,Values=running" \\
  --query 'Reservations[*].Instances[*].{
      ID:InstanceId,
      Type:InstanceType,
      PrivateIP:PrivateIpAddress,
      PublicIP:PublicIpAddress,
      State:State.Name,
      LaunchTime:LaunchTime
    }' \\
  --output table

# ---- Terminate specific instances ----
aws ec2 terminate-instances \\
  --instance-ids i-0abcdef1234567890 i-0fedcba0987654321

# ---- Wait for an instance to be in 'running' state (useful in scripts) ----
aws ec2 wait instance-running --instance-ids i-0abcdef1234567890
echo "Instance is running"`,
        },
      ],
    },
    {
      title: {
        en: "Security groups — the firewall you actually use",
        np: "Security group — तपाईंले साँच्चिकै प्रयोग गर्ने firewall",
        jp: "セキュリティグループ — 実際に使うファイアウォール",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Security groups are **stateful** — if you allow inbound TCP 443, the response traffic is automatically allowed outbound without a separate rule. Rules are **additive** — there is no Deny rule type; anything not explicitly allowed is dropped. You can attach multiple security groups to one instance and their rules are unioned. The professional pattern for a 3-tier application: `web-sg` (allow 443 and 80 from `0.0.0.0/0` and `::/0`), `app-sg` (allow 8080 only from `web-sg`'s SG ID), `db-sg` (allow 5432 only from `app-sg`'s SG ID). Referencing SG IDs in rules (not CIDR blocks) means the rules apply dynamically to the entire fleet — when you add a new app server to `app-sg`, it automatically gets database access without touching `db-sg`.",
            np: "Security group **stateful** हुन्छन् — तपाईंले inbound TCP 443 allow गर्नुभयो भने, response traffic अलग rule बिना automatically outbound allow हुन्छ। Rule हरू **additive** हुन्छन् — Deny rule type छैन; explicitly allow नगरिएको जुनसुकै drop हुन्छ। एउटा instance मा धेरै security group attach गर्न सकिन्छ र तिनीहरूका rule union हुन्छन्। 3-tier application को professional pattern: `web-sg` (0.0.0.0/0 बाट 443 र 80 allow), `app-sg` (web-sg को SG ID बाट मात्र 8080 allow), `db-sg` (app-sg को SG ID बाट मात्र 5432 allow)। Rule मा SG ID reference गर्नाले (CIDR block होइन) सम्पूर्ण fleet मा dynamically apply हुन्छ — नयाँ app server `app-sg` मा थप्दा `db-sg` नछोई automatically database access पाउँछ।",
            jp: "セキュリティグループは**ステートフル**です — インバウンド TCP 443 を許可すると、レスポンストラフィックは別のルールなしで自動的にアウトバウンドで許可されます。ルールは**加算式**です — Deny ルールタイプはなく、明示的に許可されていないものはすべてドロップされます。1 つのインスタンスに複数のセキュリティグループをアタッチでき、そのルールは合算されます。3 層アプリのプロフェッショナルパターン：`web-sg`（0.0.0.0/0 から 443 と 80 を許可）・`app-sg`（`web-sg` の SG ID からのみ 8080 を許可）・`db-sg`（`app-sg` の SG ID からのみ 5432 を許可）。ルールで SG ID を参照する（CIDR ブロックでなく）と、フリート全体に動的に適用されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create security groups with SG chaining — web, app, and DB tiers",
            np: "SG chaining सहित security group बनाउनुहोस् — web, app, र DB tier",
            jp: "SG チェーニングでセキュリティグループを作成 — Web・アプリ・DB 層",
          },
          code: `VPC_ID="vpc-0a1b2c3d4e5f6a7b8"

# ---- Create the three security groups ----
WEB_SG=$(aws ec2 create-security-group \\
  --group-name web-sg \\
  --description "Allow HTTP/HTTPS from internet" \\
  --vpc-id "$VPC_ID" \\
  --query 'GroupId' --output text)

APP_SG=$(aws ec2 create-security-group \\
  --group-name app-sg \\
  --description "Allow app port from web tier only" \\
  --vpc-id "$VPC_ID" \\
  --query 'GroupId' --output text)

DB_SG=$(aws ec2 create-security-group \\
  --group-name db-sg \\
  --description "Allow Postgres from app tier only" \\
  --vpc-id "$VPC_ID" \\
  --query 'GroupId' --output text)

# ---- web-sg: allow 80 and 443 from the public internet ----
aws ec2 authorize-security-group-ingress \\
  --group-id "$WEB_SG" \\
  --ip-permissions \\
    'IpProtocol=tcp,FromPort=80,ToPort=80,IpRanges=[{CidrIp=0.0.0.0/0}]' \\
    'IpProtocol=tcp,FromPort=443,ToPort=443,IpRanges=[{CidrIp=0.0.0.0/0}]'

# ---- app-sg: allow port 8080 ONLY from web-sg (referenced by SG ID, not CIDR) ----
aws ec2 authorize-security-group-ingress \\
  --group-id "$APP_SG" \\
  --protocol tcp \\
  --port 8080 \\
  --source-group "$WEB_SG"

# ---- db-sg: allow Postgres 5432 ONLY from app-sg ----
aws ec2 authorize-security-group-ingress \\
  --group-id "$DB_SG" \\
  --protocol tcp \\
  --port 5432 \\
  --source-group "$APP_SG"

# ---- Tag all three for easy identification ----
for SG_ID in "$WEB_SG" "$APP_SG" "$DB_SG"; do
  aws ec2 create-tags --resources "$SG_ID" \\
    --tags Key=env,Value=production Key=owner,Value=platform-team
done

echo "web-sg=$WEB_SG  app-sg=$APP_SG  db-sg=$DB_SG"`,
        },
      ],
    },
    {
      title: {
        en: "User-data — bootstrap automation",
        np: "User-data — bootstrap automation",
        jp: "ユーザーデータ — ブートストラップ自動化",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "User-data is a script (or cloud-init YAML) that runs **once as root on the very first boot** of a new instance. It is limited to 16 KB. Use it to install packages, pull application config from S3, pull secrets from SSM Parameter Store or Secrets Manager, register with a configuration management tool (Ansible, Chef), and signal CloudFormation when the bootstrap is complete. The execution log is at `/var/log/cloud-init-output.log` — always check this file when an instance is not behaving as expected. If you need to re-run user-data (e.g. for debugging), stop the instance, modify the user-data, and start it again — but note this creates a new first-boot context only if you also clear the cloud-init state.",
            np: "User-data एउटा script (वा cloud-init YAML) हो जुन नयाँ instance को **पहिलो boot मा root को रूपमा एकपटक run** हुन्छ। यो 16 KB मा सीमित छ। Package install गर्न, S3 बाट application config pull गर्न, SSM Parameter Store वा Secrets Manager बाट secret pull गर्न, configuration management tool (Ansible, Chef) मा register गर्न, र bootstrap complete भएको CloudFormation लाई signal गर्न प्रयोग गर्नुहोस्। Execution log `/var/log/cloud-init-output.log` मा छ — instance expected रूपमा behave नगरेमा सधैं यो file check गर्नुहोस्।",
            jp: "ユーザーデータは、新しいインスタンスの**最初のブート時に root として一度だけ実行される**スクリプト（または cloud-init YAML）です。16 KB に制限されています。パッケージのインストール・S3 からのアプリ設定の取得・SSM パラメータストアや Secrets Manager からのシークレットの取得・設定管理ツール（Ansible・Chef）への登録・ブートストラップ完了時の CloudFormation へのシグナル送信に使用します。実行ログは `/var/log/cloud-init-output.log` にあります — インスタンスが期待通りに動作しない場合は必ずこのファイルを確認してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Complete user-data bootstrap script — install nginx, pull config from S3, signal CloudFormation",
            np: "Complete user-data bootstrap script — nginx install, S3 बाट config pull, CloudFormation signal",
            jp: "完全なユーザーデータブートストラップスクリプト — nginx のインストール・S3 からの設定取得・CloudFormation へのシグナル",
          },
          code: `#!/bin/bash
# user-data script for Amazon Linux 2 / Amazon Linux 2023
# This file is passed via --user-data file://bootstrap.sh at launch time
# Max size: 16 KB. Execution log: /var/log/cloud-init-output.log

set -euo pipefail   # Exit on error, unset var, pipe failure — makes failures visible in the log
exec > >(tee /var/log/user-data.log | logger -t user-data -s 2>/dev/console) 2>&1
# ^^^^ Redirect all output to the log file AND the system logger simultaneously

# ---- 1. Update the OS and install required packages ----
# Detect distro (Amazon Linux 2 uses yum; Amazon Linux 2023 uses dnf)
if command -v dnf &>/dev/null; then
  PKG_MGR=dnf
else
  PKG_MGR=yum
fi

$PKG_MGR update -y
$PKG_MGR install -y nginx aws-cli jq

# ---- 2. Pull application config from S3 (instance needs S3 read IAM role) ----
S3_CONFIG_BUCKET="acme-app-config"
S3_CONFIG_KEY="production/nginx/nginx.conf"
LOCAL_CONFIG_PATH="/etc/nginx/nginx.conf"

aws s3 cp "s3://${S3_CONFIG_BUCKET}/${S3_CONFIG_KEY}" "$LOCAL_CONFIG_PATH"
echo "Config downloaded from s3://${S3_CONFIG_BUCKET}/${S3_CONFIG_KEY}"

# ---- 3. Pull a secret from SSM Parameter Store ----
DB_PASSWORD=$(aws ssm get-parameter \\
  --name "/production/acme/db_password" \\
  --with-decryption \\
  --query Parameter.Value \\
  --output text)

# Write it to a secured environment file (chmod 600, owned by app user)
cat > /etc/acme/env.conf <<EOF
DB_PASSWORD=${DB_PASSWORD}
EOF
chmod 600 /etc/acme/env.conf
chown nginx:nginx /etc/acme/env.conf

# ---- 4. Enable and start nginx ----
systemctl enable nginx
systemctl start nginx
systemctl is-active --quiet nginx && echo "nginx is running" || { echo "nginx FAILED to start"; exit 1; }

# ---- 5. Signal CloudFormation that the instance is ready ----
# Only relevant when launched by CloudFormation with a WaitCondition resource
# If not using CloudFormation, remove this block
INSTANCE_ID=$(curl -s http://169.254.169.254/latest/meta-data/instance-id)
REGION=$(curl -s http://169.254.169.254/latest/meta-data/placement/region)

# If CFN_SIGNAL_URL is passed as an environment variable (via cfn-init or metadata):
if [[ -n "\${CFN_SIGNAL_URL:-}" ]]; then
  /opt/aws/bin/cfn-signal --success true --region "$REGION" "$CFN_SIGNAL_URL"
  echo "Sent success signal to CloudFormation"
fi

echo "Bootstrap complete for instance $INSTANCE_ID at $(date -u)"`,
        },
      ],
    },
    {
      title: {
        en: "SSM Session Manager — SSH without port 22",
        np: "SSM Session Manager — port 22 बिना SSH",
        jp: "SSM セッションマネージャー — ポート 22 なしの SSH",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "AWS Systems Manager Session Manager lets you open an interactive shell on any EC2 instance **without opening port 22, without a bastion host, and without distributing SSH keys**. The SSM agent is pre-installed on Amazon Linux 2 / Amazon Linux 2023 / Ubuntu 20.04 LTS and later. Your instance needs an IAM instance profile that includes the `AmazonSSMManagedInstanceCore` managed policy — that is the only requirement. All session activity is logged to CloudTrail (who connected, when, from which IP), and you can optionally stream the full session transcript to S3 or CloudWatch Logs for compliance. If SSM is unavailable (no agent, no IAM role, or the instance is in a private subnet with no VPC endpoint for SSM), you have no fallback — which is why setting up SSM from day 1 is critical.",
            np: "AWS Systems Manager Session Manager ले **port 22 नखोली, bastion host बिना, र SSH key distribute नगरी** जुनसुकै EC2 instance मा interactive shell open गर्न दिन्छ। SSM agent Amazon Linux 2 / Amazon Linux 2023 / Ubuntu 20.04 LTS र त्यसपछिमा pre-installed छ। तपाईंको instance लाई `AmazonSSMManagedInstanceCore` managed policy सहित IAM instance profile चाहिन्छ — त्यो मात्र requirement हो। सबै session activity CloudTrail मा log हुन्छ (को connect भयो, कहिले, कुन IP बाट), र compliance का लागि S3 वा CloudWatch Logs मा session transcript stream गर्न सकिन्छ।",
            jp: "AWS Systems Manager セッションマネージャーは、**ポート 22 を開くことなく・踏み台ホストなく・SSH キーを配布することなく**任意の EC2 インスタンスでインタラクティブシェルを開けます。SSM エージェントは Amazon Linux 2 / Amazon Linux 2023 / Ubuntu 20.04 LTS 以降にプリインストールされています。インスタンスには `AmazonSSMManagedInstanceCore` マネージドポリシーを含む IAM インスタンスプロファイルが必要です — これが唯一の要件です。すべてのセッションアクティビティは CloudTrail に記録され（誰が・いつ・どの IP から接続したか）、コンプライアンスのために S3 または CloudWatch Logs にセッションログをストリーミングできます。",
          },
        },
        {
          type: "code",
          title: {
            en: "SSM Session Manager — interactive session, remote commands, and port forwarding",
            np: "SSM Session Manager — interactive session, remote command, र port forwarding",
            jp: "SSM セッションマネージャー — インタラクティブセッション・リモートコマンド・ポートフォワーディング",
          },
          code: `# ---- Prerequisite: install the SSM plugin for the AWS CLI (do this once on your laptop) ----
# macOS:
brew install --cask session-manager-plugin
# Linux: download from https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html

# ---- 1. Start an interactive shell session ----
aws ssm start-session --target i-0abcdef1234567890
# Opens a bash shell on the remote instance as ssm-user
# No port 22 needed. No key pair needed. IAM permissions control who can connect.
# To restrict to specific instances, use IAM condition:
#   "Condition": { "StringEquals": { "ssm:resourceTag/env": "production" } }

# ---- 2. Run a one-shot remote command (non-interactive) ----
CMD_ID=$(aws ssm send-command \\
  --instance-ids i-0abcdef1234567890 \\
  --document-name "AWS-RunShellScript" \\
  --parameters 'commands=["systemctl status nginx", "df -h", "free -m"]' \\
  --query 'Command.CommandId' \\
  --output text)

# Wait for the command to finish and retrieve output
aws ssm get-command-invocation \\
  --command-id "$CMD_ID" \\
  --instance-id i-0abcdef1234567890 \\
  --query 'StandardOutputContent' \\
  --output text

# ---- 3. Run a command on ALL instances tagged env=production ----
aws ssm send-command \\
  --targets "Key=tag:env,Values=production" \\
  --document-name "AWS-RunShellScript" \\
  --parameters 'commands=["yum update -y --security"]' \\
  --output-s3-bucket-name "acme-ssm-command-output" \\
  --output-s3-key-prefix "security-patches/$(date +%Y-%m-%d)"

# ---- 4. Port forwarding — access a private RDS on localhost:5433 ----
# This tunnels localhost:5433 → remote instance → RDS endpoint:5432
# The EC2 instance is your jump host — no bastion server needed
aws ssm start-session \\
  --target i-0abcdef1234567890 \\
  --document-name AWS-StartPortForwardingSessionToRemoteHost \\
  --parameters '{
    "host":       ["my-db.cluster-xyz.us-east-1.rds.amazonaws.com"],
    "portNumber": ["5432"],
    "localPortNumber": ["5433"]
  }'
# Now connect your local psql or DBeaver to localhost:5433`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: launch a production-ready web server",
        np: "Hands-on: production-ready web server launch गर्नुहोस्",
        jp: "ハンズオン：本番対応の Web サーバーをラウンチする",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a VPC and public subnet (or use the default VPC for the exercise): `aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text`. Note the VPC ID and a public subnet ID within it.",
              np: "VPC र public subnet बनाउनुहोस् (वा exercise का लागि default VPC प्रयोग गर्नुहोस्): `aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text`। VPC ID र त्यसभित्र public subnet ID note गर्नुहोस्।",
              jp: "VPC とパブリックサブネットを作成する（または演習にはデフォルト VPC を使用）：`aws ec2 describe-vpcs --filters Name=isDefault,Values=true --query 'Vpcs[0].VpcId' --output text`。VPC ID とその中のパブリックサブネット ID をメモする。",
            },
            {
              en: "Create `web-sg` that allows inbound 80 and 443 from anywhere but has **no rule for port 22** — there is no SSH access in this setup: `aws ec2 create-security-group --group-name web-sg --description 'HTTP/HTTPS only' --vpc-id <VPC_ID>`",
              np: "`web-sg` बनाउनुहोस् जसले जहाँबाट पनि inbound 80 र 443 allow गर्छ तर **port 22 को कुनै rule छैन** — यो setup मा SSH access छैन: `aws ec2 create-security-group --group-name web-sg --description 'HTTP/HTTPS only' --vpc-id <VPC_ID>`",
              jp: "どこからでもインバウンド 80 と 443 を許可するが**ポート 22 のルールがない** `web-sg` を作成する — このセットアップには SSH アクセスがない：`aws ec2 create-security-group --group-name web-sg --description 'HTTP/HTTPS only' --vpc-id <VPC_ID>`",
            },
            {
              en: "Write a `bootstrap.sh` user-data script that installs and starts nginx: `#!/bin/bash`, `yum update -y`, `amazon-linux-extras install nginx1 -y`, `systemctl enable --now nginx`. Save the file locally.",
              np: "`bootstrap.sh` user-data script लेख्नुहोस् जसले nginx install र start गर्छ: `#!/bin/bash`, `yum update -y`, `amazon-linux-extras install nginx1 -y`, `systemctl enable --now nginx`। File locally save गर्नुहोस्।",
              jp: "nginx をインストールして起動するユーザーデータスクリプト `bootstrap.sh` を書く：`#!/bin/bash`・`yum update -y`・`amazon-linux-extras install nginx1 -y`・`systemctl enable --now nginx`。ファイルをローカルに保存する。",
            },
            {
              en: "Create an IAM role with `AmazonSSMManagedInstanceCore` and `AmazonS3ReadOnlyAccess` policies. Create an instance profile for it and attach the role. This gives your instance SSM connectivity and S3 read access — no SSH key needed.",
              np: "`AmazonSSMManagedInstanceCore` र `AmazonS3ReadOnlyAccess` policy सहित IAM role बनाउनुहोस्। यसका लागि instance profile बनाउनुहोस् र role attach गर्नुहोस्। यसले तपाईंको instance लाई SSM connectivity र S3 read access दिन्छ — SSH key चाहिँदैन।",
              jp: "`AmazonSSMManagedInstanceCore` と `AmazonS3ReadOnlyAccess` ポリシーを持つ IAM ロールを作成する。それ用のインスタンスプロファイルを作成してロールをアタッチする。これでインスタンスに SSH キー不要で SSM 接続と S3 読み取りアクセスが付与される。",
            },
            {
              en: "Launch a `t3.micro` Amazon Linux 2 instance with your `web-sg`, IAM instance profile, and the `bootstrap.sh` user-data script. Use `--metadata-options HttpTokens=required` to enforce IMDSv2. Do not supply a `--key-name` — you will use SSM instead.",
              np: "`web-sg`, IAM instance profile, र `bootstrap.sh` user-data script सहित `t3.micro` Amazon Linux 2 instance launch गर्नुहोस्। IMDSv2 enforce गर्न `--metadata-options HttpTokens=required` प्रयोग गर्नुहोस्। `--key-name` नदिनुहोस् — तपाईंले SSM प्रयोग गर्नुहुनेछ।",
              jp: "`web-sg`・IAM インスタンスプロファイル・`bootstrap.sh` ユーザーデータスクリプトを使って `t3.micro` Amazon Linux 2 インスタンスをラウンチする。IMDSv2 を強制するために `--metadata-options HttpTokens=required` を使用する。`--key-name` は指定しない — SSM を使うから。",
            },
            {
              en: "Verify SSM connectivity: once the instance reaches `running` state and the SSM agent registers (wait ~2 minutes), run `aws ssm start-session --target <INSTANCE_ID>`. You should get a shell. Run `curl localhost` inside the session to confirm nginx is serving.",
              np: "SSM connectivity verify गर्नुहोस्: instance `running` state मा पुगेपछि र SSM agent register भएपछि (~2 मिनेट पर्खनुहोस्), `aws ssm start-session --target <INSTANCE_ID>` run गर्नुहोस्। Shell पाउनुपर्छ। Nginx serve गरिरहेको confirm गर्न session भित्र `curl localhost` run गर्नुहोस्।",
              jp: "SSM 接続を確認する：インスタンスが `running` 状態になり SSM エージェントが登録されたら（約 2 分待つ）、`aws ssm start-session --target <INSTANCE_ID>` を実行する。シェルが取得できるはず。セッション内で `curl localhost` を実行して nginx がサービスを提供していることを確認する。",
            },
            {
              en: "Allocate an Elastic IP and associate it with the instance: `aws ec2 allocate-address --domain vpc` (note the AllocationId), then `aws ec2 associate-address --instance-id <ID> --allocation-id <ALLOC_ID>`. Test the web server by visiting the Elastic IP in your browser.",
              np: "Elastic IP allocate गर्नुहोस् र instance मा associate गर्नुहोस्: `aws ec2 allocate-address --domain vpc` (AllocationId note गर्नुहोस्), त्यसपछि `aws ec2 associate-address --instance-id <ID> --allocation-id <ALLOC_ID>`। Browser मा Elastic IP visit गरेर web server test गर्नुहोस्।",
              jp: "Elastic IP を割り当ててインスタンスに関連付ける：`aws ec2 allocate-address --domain vpc`（AllocationId をメモ）、次に `aws ec2 associate-address --instance-id <ID> --allocation-id <ALLOC_ID>`。ブラウザで Elastic IP にアクセスして Web サーバーをテストする。",
            },
            {
              en: "Clean up to avoid charges: terminate the instance, release the Elastic IP (`aws ec2 release-address --allocation-id <ALLOC_ID>`), and delete the security group. Verify all resources are removed with `aws ec2 describe-instances --filters Name=instance-state-name,Values=running`.",
              np: "Charge avoid गर्न clean up गर्नुहोस्: instance terminate गर्नुहोस्, Elastic IP release गर्नुहोस् (`aws ec2 release-address --allocation-id <ALLOC_ID>`), र security group delete गर्नुहोस्। `aws ec2 describe-instances --filters Name=instance-state-name,Values=running` सँग सबै resource remove भएको verify गर्नुहोस्।",
              jp: "課金を避けるためにクリーンアップする：インスタンスを終了し・Elastic IP をリリース（`aws ec2 release-address --allocation-id <ALLOC_ID>`）し・セキュリティグループを削除する。`aws ec2 describe-instances --filters Name=instance-state-name,Values=running` ですべてのリソースが削除されたことを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use Spot instances?",
        np: "Spot instance कहिले प्रयोग गर्नुपर्छ?",
        jp: "スポットインスタンスはいつ使うべきか？",
      },
      answer: {
        en: "For fault-tolerant workloads that can checkpoint and restart — CI/CD build agents, batch processing, ML training, and stateless data-processing workers. The key property is that your workload must be able to handle a 2-minute interruption notice and resume from a checkpoint without losing meaningful progress. Never use Spot for databases, primary web servers handling live traffic, or any stateful workload without a checkpointing strategy. Use Spot fleets or Auto Scaling groups with a mix of On-Demand and Spot to balance cost and availability.",
        np: "Checkpoint र restart गर्न सक्ने fault-tolerant workload का लागि — CI/CD build agent, batch processing, ML training, र stateless data-processing worker। मुख्य property यो हो कि तपाईंको workload ले 2-मिनेट interruption notice handle गर्न र meaningful progress नगुमाई checkpoint बाट resume गर्न सक्नुपर्छ। Database, live traffic handle गर्ने primary web server, वा checkpointing strategy बिना stateful workload का लागि Spot कहिल्यै प्रयोग नगर्नुहोस्।",
        jp: "チェックポイントと再起動ができる耐障害性のあるワークロードに — CI/CD ビルドエージェント・バッチ処理・ML トレーニング・ステートレスなデータ処理ワーカー。重要な特性は、ワークロードが 2 分前の中断通知を処理でき、意味のある進捗を失わずにチェックポイントから再開できることです。データベース・ライブトラフィックを処理するプライマリ Web サーバー・チェックポイント戦略のないステートフルなワークロードには絶対 Spot を使わないでください。",
      },
      tag: { en: "ec2", np: "EC2", jp: "EC2" },
    },
    {
      question: {
        en: "What is an AMI and how do I create one?",
        np: "AMI के हो र कसरी बनाउने?",
        jp: "AMI とは何か、どうやって作るか？",
      },
      answer: {
        en: "An Amazon Machine Image (AMI) is a snapshot of an EC2 instance's root volume combined with launch permissions and a block device mapping. It defines the operating system, pre-installed software, and configuration that new instances start with. Create a custom AMI with `aws ec2 create-image --instance-id i-0abcdef1234567890 --name 'my-app-v1.2.3' --no-reboot`. Baking your application into a custom AMI means new Auto Scaling instances reach a healthy state in seconds rather than minutes — no package installs at launch time. Version your AMIs with semantic version tags (`app=my-app`, `version=1.2.3`, `built-at=2026-05-01`) and automate AMI creation in your CI/CD pipeline using Packer.",
        np: "Amazon Machine Image (AMI) एउटा EC2 instance को root volume को snapshot हो जुन launch permission र block device mapping सहित combine गरिन्छ। यसले operating system, pre-installed software, र नयाँ instance ले सुरु गर्ने configuration define गर्छ। `aws ec2 create-image --instance-id i-0abcdef1234567890 --name 'my-app-v1.2.3' --no-reboot` सँग custom AMI बनाउनुहोस्। Application लाई custom AMI मा bake गर्नाले नयाँ Auto Scaling instance मिनेट होइन, second मा healthy state मा पुग्छ — launch time मा package install छैन।",
        jp: "Amazon Machine Image（AMI）は、EC2 インスタンスのルートボリュームのスナップショットにラウンチ権限とブロックデバイスマッピングを組み合わせたものです。新しいインスタンスが起動する際の OS・プリインストールされたソフトウェア・設定を定義します。`aws ec2 create-image --instance-id i-0abcdef1234567890 --name 'my-app-v1.2.3' --no-reboot` でカスタム AMI を作成します。アプリケーションをカスタム AMI に焼き込むことで、新しい Auto Scaling インスタンスが分単位でなく秒単位でヘルシー状態に達します。",
      },
      tag: { en: "ec2", np: "EC2", jp: "EC2" },
    },
    {
      question: {
        en: "Why use SSM instead of SSH?",
        np: "SSH को सट्टा SSM किन प्रयोग गर्ने?",
        jp: "SSH の代わりに SSM を使う理由は？",
      },
      answer: {
        en: "SSM Session Manager eliminates the entire attack surface of SSH: no open inbound ports (no port 22 to scan or exploit), no SSH key pairs to distribute and manage (no risk of key leaks, stale keys for departed employees, or key sprawl across teams), sessions are automatically logged to CloudTrail so you have a full audit trail of who ran what and when, it works through VPC without requiring an internet gateway or bastion host, and you can use IAM policies to control exactly which team members can connect to which instances based on tags. The only requirement is the SSM agent running on the instance and an IAM instance profile with `AmazonSSMManagedInstanceCore`.",
        np: "SSM Session Manager ले SSH को सम्पूर्ण attack surface हटाउँछ: कुनै open inbound port छैन (scan वा exploit गर्न port 22 छैन), distribute र manage गर्न SSH key pair छैन (key leak, छोडेका employee को stale key, वा team भरि key sprawl को जोखिम छैन), session automatically CloudTrail मा log हुन्छन् जसले कसले के कहिले run गर्यो को पूर्ण audit trail दिन्छ, internet gateway वा bastion host बिना VPC मार्फत काम गर्छ, र IAM policy प्रयोग गरेर tag को आधारमा कुन team member कुन instance मा connect गर्न सक्छ exactly control गर्न सकिन्छ।",
        jp: "SSM セッションマネージャーは SSH の攻撃面全体を排除します：オープンなインバウンドポートなし（スキャンや悪用のポート 22 がない）・SSH キーペアの配布と管理なし（キーの漏洩・退職した従業員の古いキー・チーム全体へのキーの拡散リスクなし）・セッションは自動的に CloudTrail に記録されるため誰がいつ何を実行したかの完全な監査証跡がある・インターネットゲートウェイや踏み台ホストなしで VPC 経由で機能する・IAM ポリシーを使ってタグに基づいてどのチームメンバーがどのインスタンスに接続できるかを正確に制御できる。",
      },
      tag: { en: "security", np: "Security", jp: "セキュリティ" },
    },
  ],
};
