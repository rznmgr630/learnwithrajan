import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "AWS cost management is not just about saving money — it is about understanding where money goes, eliminating waste, and making informed architectural decisions. The main tools are AWS Cost Explorer (visualize and analyse spending), AWS Budgets (alerts when spending exceeds a threshold), Cost Allocation Tags (attribute costs to teams/projects), and Savings Plans / Reserved Instances (commit to usage for up to 72% discount).",
    np: "AWS cost management पैसा बचाउनेमात्र होइन — पैसा कहाँ जान्छ बुझ्नु, फजुल खर्च हटाउनु, र informed architectural decision गर्नु हो। Main tool हरू: AWS Cost Explorer (spending visualize र analyse गर्नुहोस्), AWS Budgets (spending threshold exceed हुँदा alert), Cost Allocation Tag (cost लाई team/project मा attribute गर्नुहोस्), र Savings Plan / Reserved Instance (72% सम्म discount को लागि usage commit गर्नुहोस्)।",
    jp: "AWS コスト管理は単に節約するだけでなく、お金がどこに行くかを理解し、無駄を排除し、情報に基づいたアーキテクチャの決断を下すことです。主なツールは AWS Cost Explorer（支出の可視化と分析）・AWS Budgets（支出がしきい値を超えたときのアラート）・コスト配分タグ（コストをチームやプロジェクトに帰属させる）・Savings Plans / リザーブドインスタンス（最大 72% 割引のための使用量コミット）です。",
  } as const,
  o2: {
    en: "Today you learn how to read your AWS bill, identify the top cost drivers, set up Budgets with email alerts, tag resources for cost attribution, right-size EC2 instances, use Spot and Savings Plans, and apply the Well-Architected Framework's Cost Optimization pillar principles. This is the final day of Week 6 — you will finish with a complete AWS architecture best practices checklist.",
    np: "आज तपाईंले AWS bill कसरी पढ्ने, top cost driver identify गर्ने, email alert सहित Budget setup गर्ने, cost attribution को लागि resource tag गर्ने, EC2 instance right-size गर्ने, Spot र Savings Plan प्रयोग गर्ने, र Well-Architected Framework को Cost Optimization pillar principle apply गर्ने सिक्नुहुनेछ। यो Week 6 को अन्तिम दिन हो — तपाईं complete AWS architecture best practices checklist सँग finish गर्नुहुनेछ।",
    jp: "今日は AWS の請求書の読み方・コストの主要ドライバーの特定・メールアラート付きの予算設定・コスト帰属のためのリソースタグ付け・EC2 インスタンスの適正サイジング・スポットと Savings Plans の使用・Well-Architected Framework のコスト最適化の柱の原則の適用を学びます。これが Week 6 の最終日です — 完全な AWS アーキテクチャのベストプラクティスチェックリストで終わります。",
  } as const,
};

export const DEVOPS_DAY_42_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Reading your bill — Cost Explorer & Budgets",
        np: "Bill पढ्नुहोस् — Cost Explorer र Budget",
        jp: "請求書の読み方 — Cost Explorer と予算",
      },
      blocks: [
        { type: "diagram", id: "devops-cost-management" },
        {
          type: "paragraph",
          text: {
            en: "Cost Explorer shows spending by service, region, account, tag, instance type, or usage type across any time range. The most useful views: (1) Monthly cost by service — find your top 3 spenders; (2) Daily cost trend — spot anomalies; (3) EC2 running hours by instance type — find over-provisioned instances. AWS Cost Anomaly Detection uses ML to alert on unusual spending spikes. AWS Budgets sends alerts when actual or forecasted spend exceeds a threshold — create at minimum a monthly total budget and a per-service budget for your top spenders.",
            np: "Cost Explorer ले कुनै पनि time range मा service, region, account, tag, instance type, वा usage type अनुसार spending देखाउँछ। सबैभन्दा useful view: (1) Service अनुसार monthly cost — top 3 spender find; (2) Daily cost trend — anomaly spot; (3) Instance type अनुसार EC2 running hour — over-provisioned instance find। AWS Cost Anomaly Detection ले unusual spending spike मा alert गर्न ML प्रयोग गर्छ। AWS Budget ले actual वा forecasted spend threshold exceed गर्दा alert पठाउँछ — कम्तिमा monthly total budget र top spender को लागि per-service budget create गर्नुहोस्।",
            jp: "Cost Explorer は任意の期間でサービス・リージョン・アカウント・タグ・インスタンスタイプ・使用タイプ別の支出を表示します。最も有用なビュー：(1) サービス別の月次コスト — トップ 3 の支出を見つける；(2) 日次コストの傾向 — 異常を発見；(3) インスタンスタイプ別の EC2 稼働時間 — 過剰プロビジョニングされたインスタンスを見つける。AWS コスト異常検出は ML を使って異常な支出スパイクをアラートします。AWS Budgets は実際または予測支出がしきい値を超えたときにアラートを送信します — 少なくとも月次合計予算とトップの支出サービスのサービス別予算を作成してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create cost budgets and enable cost allocation tags",
            np: "Cost budget create गर्नुहोस् र cost allocation tag enable गर्नुहोस्",
            jp: "コスト予算の作成とコスト配分タグの有効化",
          },
          code: `# ── Create a monthly total cost budget with email alert ──
aws budgets create-budget \
    --account-id "$ACCOUNT_ID" \
    --budget '{
      "BudgetName": "monthly-total",
      "BudgetLimit": {"Amount": "200", "Unit": "USD"},
      "TimeUnit": "MONTHLY",
      "BudgetType": "COST"
    }' \
    --notifications-with-subscribers '[
      {
        "Notification": {
          "NotificationType": "ACTUAL",
          "ComparisonOperator": "GREATER_THAN",
          "Threshold": 80,
          "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "ops@example.com"}]
      },
      {
        "Notification": {
          "NotificationType": "FORECASTED",
          "ComparisonOperator": "GREATER_THAN",
          "Threshold": 100,
          "ThresholdType": "PERCENTAGE"
        },
        "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "ops@example.com"}]
      }
    ]'

# ── Per-service budget: alert if EC2 exceeds $100/month ──
aws budgets create-budget \
    --account-id "$ACCOUNT_ID" \
    --budget '{
      "BudgetName": "ec2-monthly",
      "BudgetLimit": {"Amount": "100", "Unit": "USD"},
      "TimeUnit": "MONTHLY",
      "BudgetType": "COST",
      "CostFilters": {"Service": ["Amazon Elastic Compute Cloud - Compute"]}
    }' \
    --notifications-with-subscribers '[{
      "Notification": {
        "NotificationType": "ACTUAL",
        "ComparisonOperator": "GREATER_THAN",
        "Threshold": 90,
        "ThresholdType": "PERCENTAGE"
      },
      "Subscribers": [{"SubscriptionType": "EMAIL", "Address": "ops@example.com"}]
    }]'

# ── Enable cost allocation tags (required to filter Cost Explorer by tag) ──
# First tag your resources consistently:
aws ec2 create-tags --resources i-0abc123 \
    --tags Key=Team,Value=backend Key=Project,Value=api Key=Environment,Value=prod

# Activate the tag keys in Cost Explorer (one-time, per account)
aws ce update-cost-allocation-tags-status \
    --cost-allocation-tags-status \
      '[{"TagKey":"Team","Status":"Active"},{"TagKey":"Project","Status":"Active"},{"TagKey":"Environment","Status":"Active"}]'

# ── Query Cost Explorer: top services this month ──
aws ce get-cost-and-usage \
    --time-period Start=$(date -d "$(date +%Y-%m-01)" +%Y-%m-%d),End=$(date +%Y-%m-%d) \
    --granularity MONTHLY \
    --metrics BlendedCost \
    --group-by Type=DIMENSION,Key=SERVICE \
    --query "ResultsByTime[0].Groups[*].{Service:Keys[0],Cost:Metrics.BlendedCost.Amount}" \
    --output table | sort -k2 -rn | head -10`,
        },
      ],
    },
    {
      title: {
        en: "Right-sizing, Savings Plans & Spot Instances",
        np: "Right-sizing, Savings Plan र Spot Instance",
        jp: "適正サイジング・Savings Plans・スポットインスタンス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Right-sizing: use AWS Compute Optimizer to identify EC2 instances, Lambda functions, and ECS tasks where you are paying for capacity you are not using. Downsizing from `m5.2xlarge` to `m5.xlarge` immediately cuts that instance's cost in half. Savings Plans: commit to a consistent spend ($/hour) for 1 or 3 years and get up to 72% off on-demand prices. Compute Savings Plans are the most flexible — they apply to EC2, Fargate, and Lambda across all regions and instance families. Spot Instances: spare EC2 capacity at up to 90% discount — suitable for fault-tolerant, stateless workloads (batch processing, CI/CD runners, ML training). Spot instances can be reclaimed with a 2-minute warning.",
            np: "Right-sizing: तपाईं use नगरिएको capacity को लागि भुक्तानी गरिरहेका EC2 instance, Lambda function, र ECS task identify गर्न AWS Compute Optimizer प्रयोग गर्नुहोस्। `m5.2xlarge` बाट `m5.xlarge` मा downsizing गर्दा immediately त्यो instance को cost आधामा झर्छ। Savings Plan: 1 वा 3 वर्षको लागि consistent spend ($/hour) commit गर्नुहोस् र on-demand price मा 72% सम्म off पाउनुहोस्। Compute Savings Plan सबैभन्दा flexible छ — सबै region र instance family मा EC2, Fargate, र Lambda मा apply हुन्छ। Spot Instance: 90% सम्म discount मा spare EC2 capacity — fault-tolerant, stateless workload (batch processing, CI/CD runner, ML training) को लागि suitable। Spot instance 2-minute warning सहित reclaim गर्न सकिन्छ।",
            jp: "適正サイジング：使用していないキャパシティに対して支払いをしている EC2 インスタンス・Lambda 関数・ECS タスクを特定するために AWS Compute Optimizer を使用します。`m5.2xlarge` から `m5.xlarge` へのダウンサイジングにより、そのインスタンスのコストが直ちに半分になります。Savings Plans：1 年または 3 年間の一定支出（$/時間）にコミットして、オンデマンド価格から最大 72% オフを得ます。Compute Savings Plans が最も柔軟で — すべてのリージョンとインスタンスファミリーにわたって EC2・Fargate・Lambda に適用されます。スポットインスタンス：最大 90% 割引のスペア EC2 キャパシティ — フォールトトレラントでステートレスなワークロード（バッチ処理・CI/CD ランナー・ML トレーニング）に適しています。スポットインスタンスは 2 分間の警告とともに回収される場合があります。",
          },
        },
        {
          type: "table",
          caption: {
            en: "EC2 purchasing options — discount, commitment, and when to use",
            np: "EC2 purchasing option — discount, commitment, र कहिले प्रयोग गर्ने",
            jp: "EC2 購入オプション — 割引・コミットメント・使用タイミング",
          },
          headers: [
            { en: "Option", np: "Option", jp: "オプション" },
            { en: "Max Discount", np: "Max Discount", jp: "最大割引" },
            { en: "Commitment", np: "Commitment", jp: "コミットメント" },
            { en: "Best For", np: "Best For", jp: "最適用途" },
          ],
          rows: [
            [
              { en: "On-Demand", np: "On-Demand", jp: "オンデマンド" },
              { en: "0%", np: "0%", jp: "0%" },
              { en: "None", np: "छैन", jp: "なし" },
              { en: "Unpredictable workloads, short-term use, dev/test", np: "Unpredictable workload, short-term use, dev/test", jp: "予測不可能なワークロード・短期使用・開発/テスト" },
            ],
            [
              { en: "Compute Savings Plan", np: "Compute Savings Plan", jp: "コンピュート Savings Plan" },
              { en: "Up to 66%", np: "66% सम्म", jp: "最大 66%" },
              { en: "1 or 3 years ($/hr)", np: "1 वा 3 वर्ष ($/hr)", jp: "1 年または 3 年（$/時間）" },
              { en: "Baseline steady-state load — most flexible option", np: "Baseline steady-state load — सबैभन्दा flexible option", jp: "ベースラインの安定負荷 — 最も柔軟なオプション" },
            ],
            [
              { en: "EC2 Instance Savings Plan", np: "EC2 Instance Savings Plan", jp: "EC2 インスタンス Savings Plan" },
              { en: "Up to 72%", np: "72% सम्म", jp: "最大 72%" },
              { en: "1 or 3 years, specific family+region", np: "1 वा 3 वर्ष, specific family+region", jp: "1 年または 3 年・特定ファミリー+リージョン" },
              { en: "Predictable load on a specific instance family", np: "Specific instance family मा predictable load", jp: "特定のインスタンスファミリーの予測可能な負荷" },
            ],
            [
              { en: "Reserved Instance (Standard)", np: "Reserved Instance (Standard)", jp: "リザーブドインスタンス（スタンダード）" },
              { en: "Up to 72%", np: "72% सम्म", jp: "最大 72%" },
              { en: "1 or 3 years, specific type+AZ+OS", np: "1 वा 3 वर्ष, specific type+AZ+OS", jp: "1 年または 3 年・特定タイプ+AZ+OS" },
              { en: "Databases (RDS), steady EC2 with fixed requirements", np: "Database (RDS), fixed requirement सहित steady EC2", jp: "データベース（RDS）・固定要件の安定した EC2" },
            ],
            [
              { en: "Spot Instance", np: "Spot Instance", jp: "スポットインスタンス" },
              { en: "Up to 90%", np: "90% सम्म", jp: "最大 90%" },
              { en: "None — but can be reclaimed with 2-min notice", np: "छैन — तर 2-min notice सँग reclaim गर्न सकिन्छ", jp: "なし — ただし 2 分前通知で回収される場合あり" },
              { en: "Batch jobs, CI/CD, ML training, fault-tolerant workloads", np: "Batch job, CI/CD, ML training, fault-tolerant workload", jp: "バッチジョブ・CI/CD・ML トレーニング・フォールトトレラントなワークロード" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Well-Architected best practices — all 6 pillars",
        np: "Well-Architected best practice — सबै 6 pillar",
        jp: "Well-Architected ベストプラクティス — 6 つの柱すべて",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The AWS Well-Architected Framework evaluates architectures across six pillars. Use the AWS Well-Architected Tool (free in the console) to run a formal review against your workload. Each pillar has High Risk Issues (HRIs) — questions where a wrong answer signals a significant problem. Fix HRIs before moving to production.",
            np: "AWS Well-Architected Framework ले छ pillar मा architecture evaluate गर्छ। आफ्नो workload विरुद्ध formal review run गर्न AWS Well-Architected Tool (console मा free) प्रयोग गर्नुहोस्। प्रत्येक pillar मा High Risk Issue (HRI) छ — गलत answer ले significant problem signal गर्ने question। Production मा जानु अघि HRI fix गर्नुहोस्।",
            jp: "AWS Well-Architected Framework は 6 つの柱にわたってアーキテクチャを評価します。ワークロードに対して正式なレビューを実行するには AWS Well-Architected Tool（コンソールで無料）を使用してください。各柱には高リスクの問題（HRI）があります — 誤った回答が重大な問題を示す質問。本番に進む前に HRI を修正してください。",
          },
        },
        {
          type: "table",
          caption: {
            en: "AWS Well-Architected Framework — 6 pillars, core principle, and top best practices",
            np: "AWS Well-Architected Framework — 6 pillar, core principle, र top best practice",
            jp: "AWS Well-Architected Framework — 6 つの柱・コア原則・主要なベストプラクティス",
          },
          headers: [
            { en: "Pillar", np: "Pillar", jp: "柱" },
            { en: "Core Principle", np: "Core Principle", jp: "コア原則" },
            { en: "Top Best Practices", np: "Top Best Practice", jp: "主要なベストプラクティス" },
          ],
          rows: [
            [
              { en: "Operational Excellence", np: "Operational Excellence", jp: "運用上の優秀性" },
              { en: "Run and monitor systems to deliver business value and continuously improve processes", np: "Business value deliver गर्न system run र monitor; process continuously improve गर्नुहोस्", jp: "ビジネス価値を提供するためにシステムを実行・監視し、プロセスを継続的に改善する" },
              { en: "IaC for all infra; deploy small frequent changes; CloudWatch dashboards; runbooks for operations; post-incident reviews", np: "सबै infra को लागि IaC; small frequent change deploy; CloudWatch dashboard; operation को runbook; post-incident review", jp: "すべてのインフラに IaC；小規模で頻繁な変更をデプロイ；CloudWatch ダッシュボード；運用のランブック；インシデント後レビュー" },
            ],
            [
              { en: "Security", np: "Security", jp: "セキュリティ" },
              { en: "Protect information, systems, and assets while delivering business value", np: "Business value deliver गर्दा information, system, र asset protect गर्नुहोस्", jp: "ビジネス価値を提供しながら情報・システム・資産を保護する" },
              { en: "Least-privilege IAM; MFA on root; no long-term keys; encrypt data at rest and in transit; GuardDuty enabled; VPC for all resources; WAF on public endpoints", np: "Least-privilege IAM; root मा MFA; long-term key छैन; rest र transit मा data encrypt; GuardDuty enabled; सबै resource को लागि VPC; public endpoint मा WAF", jp: "最小権限 IAM；root に MFA；長期キーなし；保存時と転送時のデータ暗号化；GuardDuty 有効；すべてのリソースに VPC；パブリックエンドポイントに WAF" },
            ],
            [
              { en: "Reliability", np: "Reliability", jp: "信頼性" },
              { en: "Recover from failures automatically and meet demand dynamically", np: "Failure बाट automatically recover; dynamically demand meet गर्नुहोस्", jp: "障害から自動的に回復し、動的に需要を満たす" },
              { en: "Multi-AZ deployments; health checks and auto-replacement; backups with tested restores; chaos engineering; circuit breakers; loose coupling with SQS/SNS", np: "Multi-AZ deployment; health check र auto-replacement; tested restore सहित backup; chaos engineering; circuit breaker; SQS/SNS सँग loose coupling", jp: "マルチ AZ デプロイ；ヘルスチェックと自動置き換え；テスト済みリストア付きバックアップ；カオスエンジニアリング；サーキットブレーカー；SQS/SNS による疎結合" },
            ],
            [
              { en: "Performance Efficiency", np: "Performance Efficiency", jp: "パフォーマンス効率" },
              { en: "Use computing resources efficiently and maintain that efficiency as demand changes", np: "Computing resource efficiently प्रयोग गर्नुहोस् र demand change हुँदा त्यो efficiency maintain गर्नुहोस्", jp: "コンピューティングリソースを効率的に使用し、需要の変化に応じてその効率を維持する" },
              { en: "Choose the right instance type for the workload; CloudFront for static content; ElastiCache for DB reads; right-size with Compute Optimizer; serverless where appropriate", np: "Workload को लागि सही instance type छान्नुहोस्; static content को लागि CloudFront; DB read को लागि ElastiCache; Compute Optimizer सँग right-size; उचित ठाउँमा serverless", jp: "ワークロードに適したインスタンスタイプを選択；静的コンテンツに CloudFront；DB 読み取りに ElastiCache；Compute Optimizer で適正サイジング；適切な場合はサーバーレス" },
            ],
            [
              { en: "Cost Optimization", np: "Cost Optimization", jp: "コスト最適化" },
              { en: "Avoid unnecessary costs and understand where money is being spent", np: "Unnecessary cost avoid गर्नुहोस् र पैसा कहाँ खर्च भइरहेछ बुझ्नुहोस्", jp: "不必要なコストを避け、お金がどこで使われているかを理解する" },
              { en: "Delete unattached EBS/EIPs; Savings Plans for baseline; Spot for batch; S3 lifecycle policies; right-size instances; tag everything; monthly Cost Explorer review", np: "Unattached EBS/EIP delete; baseline को लागि Savings Plan; batch को लागि Spot; S3 lifecycle policy; instance right-size; सबैथोक tag; monthly Cost Explorer review", jp: "アタッチされていない EBS/EIP を削除；ベースラインに Savings Plans；バッチに Spot；S3 ライフサイクルポリシー；インスタンスの適正サイジング；すべてにタグ付け；月次 Cost Explorer レビュー" },
            ],
            [
              { en: "Sustainability", np: "Sustainability", jp: "持続可能性" },
              { en: "Minimize the environmental impact of running cloud workloads", np: "Cloud workload running को environmental impact minimize गर्नुहोस्", jp: "クラウドワークロードの実行による環境への影響を最小化する" },
              { en: "Prefer managed services (less idle compute); right-size aggressively; S3 Intelligent-Tiering; shutdown dev environments on schedule; use Graviton (ARM) instances for 20% better energy efficiency", np: "Managed service prefer गर्नुहोस् (कम idle compute); aggressively right-size; S3 Intelligent-Tiering; schedule मा dev environment shutdown; 20% राम्रो energy efficiency को लागि Graviton (ARM) instance प्रयोग गर्नुहोस्", jp: "マネージドサービスを優先（アイドルコンピュートが少ない）；積極的に適正サイジング；S3 Intelligent-Tiering；スケジュールで開発環境をシャットダウン；20% の優れたエネルギー効率のために Graviton（ARM）インスタンスを使用" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Quick-win cost reduction checklist",
        np: "Quick-win cost reduction checklist",
        jp: "すぐに効果のあるコスト削減チェックリスト",
      },
      blocks: [
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Delete all unattached EBS volumes (`aws ec2 describe-volumes --filters Name=status,Values=available`) — you pay for them even when no instance is attached.",
              np: "सबै unattached EBS volume delete गर्नुहोस् (`aws ec2 describe-volumes --filters Name=status,Values=available`) — instance attach नभएपनि तपाईं भुक्तानी गर्नुहुन्छ।",
              jp: "アタッチされていない EBS ボリュームをすべて削除する（`aws ec2 describe-volumes --filters Name=status,Values=available`）— インスタンスがアタッチされていなくても料金が発生します。",
            },
            {
              en: "Release all unattached Elastic IPs (`aws ec2 describe-addresses --filters Name=instance-id,Values=null`) — $0.005/hour per idle EIP adds up fast.",
              np: "सबै unattached Elastic IP release गर्नुहोस् (`aws ec2 describe-addresses --filters Name=instance-id,Values=null`) — प्रति idle EIP $0.005/hour छिटो थपिन्छ।",
              jp: "アタッチされていない Elastic IP をすべて解放する（`aws ec2 describe-addresses --filters Name=instance-id,Values=null`）— アイドル EIP あたり $0.005/時間はすぐに積み上がります。",
            },
            {
              en: "Set S3 lifecycle policies on every bucket to transition objects to S3-IA after 30 days and Glacier after 90 days for infrequently accessed data.",
              np: "हरेक bucket मा S3 lifecycle policy set गर्नुहोस् — infrequently accessed data को लागि 30 दिन पछि S3-IA मा र 90 दिन पछि Glacier मा object transition गर्नुहोस्।",
              jp: "すべてのバケットに S3 ライフサイクルポリシーを設定して、アクセス頻度の低いデータを 30 日後に S3-IA に、90 日後に Glacier にオブジェクトを移行します。",
            },
            {
              en: "Stop or terminate dev/staging EC2 instances outside business hours using AWS Instance Scheduler or an EventBridge + Lambda rule. A stopped instance costs only EBS.",
              np: "AWS Instance Scheduler वा EventBridge + Lambda rule प्रयोग गरी business hour बाहिर dev/staging EC2 instance stop वा terminate गर्नुहोस्। Stopped instance ले EBS मात्र cost लाग्छ।",
              jp: "AWS Instance Scheduler または EventBridge + Lambda ルールを使用して、営業時間外に開発/ステージング EC2 インスタンスを停止または終了します。停止したインスタンスは EBS のみのコストがかかります。",
            },
            {
              en: "Enable S3 Intelligent-Tiering for buckets with unpredictable access patterns — it automatically moves objects to cheaper tiers with no retrieval fee.",
              np: "Unpredictable access pattern भएको bucket को लागि S3 Intelligent-Tiering enable गर्नुहोस् — यसले automatically object लाई retrieval fee बिना सस्तो tier मा move गर्छ।",
              jp: "アクセスパターンが予測不可能なバケットに S3 Intelligent-Tiering を有効化する — 取得料金なしで自動的にオブジェクトをより安価なティアに移動します。",
            },
            {
              en: "Use AWS Compute Optimizer to right-size EC2 and Lambda. Even a one-size-down on your top 5 instances can save 40–50% on those instances.",
              np: "EC2 र Lambda right-size गर्न AWS Compute Optimizer प्रयोग गर्नुहोस्। Top 5 instance मा एक size down ले ती instance मा 40–50% save गर्न सक्छ।",
              jp: "AWS Compute Optimizer を使って EC2 と Lambda を適正サイジングする。上位 5 つのインスタンスでサイズを 1 段階下げるだけで、それらのインスタンスで 40〜50% の節約が可能です。",
            },
            {
              en: "Set a CloudWatch Log retention policy on ALL log groups. Logs that never expire are the most common hidden cost in new AWS accounts.",
              np: "सबै log group मा CloudWatch Log retention policy set गर्नुहोस्। कहिल्यै expire नहुने log नयाँ AWS account मा सबैभन्दा common hidden cost हो।",
              jp: "すべてのロググループに CloudWatch ログの保持ポリシーを設定する。期限切れにならないログは新しい AWS アカウントで最も一般的な隠れたコストです。",
            },
            {
              en: "Purchase Compute Savings Plans for your baseline (always-on) EC2 and Fargate usage. Even a 1-year, no-upfront plan gives ~33% off; 3-year all-upfront gives ~66% off.",
              np: "Baseline (always-on) EC2 र Fargate usage को लागि Compute Savings Plan purchase गर्नुहोस्। 1-year, no-upfront plan ले ~33% off दिन्छ; 3-year all-upfront ले ~66% off दिन्छ।",
              jp: "ベースライン（常時稼働）の EC2 と Fargate の使用量に対して Compute Savings Plans を購入する。1 年間・前払いなしのプランでも約 33% オフ；3 年間・全額前払いで約 66% オフ。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: cost audit and Week 6 review",
        np: "Hands-on: cost audit र Week 6 review",
        jp: "ハンズオン：コスト監査と Week 6 レビュー",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Open AWS Cost Explorer. Find your top 3 spending services this month. Note their costs and identify if any have unexpected spikes. Set the grouping to 'Usage Type' for the top service to understand exactly what you are paying for.",
              np: "AWS Cost Explorer खोल्नुहोस्। यो महिना top 3 spending service find गर्नुहोस्। तिनीहरूको cost note गर्नुहोस् र कुनैको unexpected spike छ कि check गर्नुहोस्। Exactly के को लागि भुक्तानी गरिरहनुभएको छ बुझ्न top service को लागि grouping 'Usage Type' मा set गर्नुहोस्।",
              jp: "AWS Cost Explorer を開く。今月のトップ 3 支出サービスを見つける。そのコストをメモし、予期しないスパイクがあるか確認する。正確に何に支払っているかを理解するために、トップサービスのグループ化を「使用タイプ」に設定する。",
            },
            {
              en: "Create two AWS Budgets: (1) a monthly total budget at $50 with alerts at 80% actual and 100% forecasted; (2) an EC2-specific budget at $20 with an alert at 90% actual. Confirm they appear in the Budgets console.",
              np: "दुई AWS Budget create गर्नुहोस्: (1) 80% actual र 100% forecasted मा alert सहित $50 मा monthly total budget; (2) 90% actual मा alert सहित $20 मा EC2-specific budget। Budgets console मा देखिएको confirm गर्नुहोस्।",
              jp: "2 つの AWS 予算を作成する：(1) 80% 実績と 100% 予測でアラート付きの月次合計予算 $50；(2) 90% 実績でアラート付きの EC2 専用予算 $20。予算コンソールに表示されることを確認する。",
            },
            {
              en: "Run the unattached EBS and EIP cleanup commands from the checklist. Document how many unattached resources you found and the monthly cost you eliminated.",
              np: "Checklist बाट unattached EBS र EIP cleanup command run गर्नुहोस्। कतिवटा unattached resource फेला पर्यो र कति monthly cost eliminate भयो document गर्नुहोस्।",
              jp: "チェックリストのアタッチされていない EBS と EIP のクリーンアップコマンドを実行する。見つけたアタッチされていないリソースの数と排除した月次コストをドキュメント化する。",
            },
            {
              en: "Tag five existing resources (EC2 instances, S3 buckets, RDS) with `Team`, `Environment`, and `Project` tags. Activate these tag keys in Cost Explorer using `aws ce update-cost-allocation-tags-status`. Note: tag attribution takes up to 24 hours to appear in billing data.",
              np: "पाँच existing resource (EC2 instance, S3 bucket, RDS) लाई `Team`, `Environment`, र `Project` tag सँग tag गर्नुहोस्। `aws ce update-cost-allocation-tags-status` प्रयोग गरी Cost Explorer मा यी tag key activate गर्नुहोस्। नोट: tag attribution billing data मा appear हुन 24 घण्टासम्म लाग्न सक्छ।",
              jp: "5 つの既存リソース（EC2 インスタンス・S3 バケット・RDS）に `Team`・`Environment`・`Project` タグでタグ付けする。`aws ce update-cost-allocation-tags-status` を使って Cost Explorer でこれらのタグキーを有効化する。注：タグの帰属が請求データに表示されるまで最大 24 時間かかる場合があります。",
            },
            {
              en: "Open the AWS Well-Architected Tool in the console. Create a new workload and run the lens review for the Security pillar only. Answer the questions honestly and note how many High Risk Issues your current architecture has. Create an improvement plan for the top 3 HRIs.",
              np: "Console मा AWS Well-Architected Tool खोल्नुहोस्। नयाँ workload create गर्नुहोस् र Security pillar मात्रको लागि lens review run गर्नुहोस्। Questions लाई honestly answer गर्नुहोस् र तपाईंको current architecture मा कतिवटा High Risk Issue छ note गर्नुहोस्। Top 3 HRI को लागि improvement plan create गर्नुहोस्।",
              jp: "コンソールで AWS Well-Architected Tool を開く。新しいワークロードを作成し、セキュリティの柱のみのレンズレビューを実行する。質問に正直に答え、現在のアーキテクチャにある高リスクの問題の数をメモする。上位 3 つの HRI の改善計画を作成する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What are the most common unexpected AWS costs for beginners?",
        np: "Beginner को लागि सबैभन्दा common unexpected AWS cost के हुन्?",
        jp: "初心者にとって最も一般的な予期しない AWS コストは何か？",
      },
      answer: {
        en: "In order of frequency: (1) CloudWatch Logs with no retention policy — they accumulate indefinitely; (2) Unattached EBS volumes and idle Elastic IPs left behind after deleting EC2 instances; (3) NAT Gateway data processing charges — NAT GW charges $0.045/GB processed; minimize by keeping traffic within the VPC or using VPC endpoints for S3/DynamoDB; (4) Data transfer out to the internet — first 100 GB/month free, then $0.09/GB; (5) RDS Multi-AZ standby instances running even during dev/test.",
        np: "Frequency क्रममा: (1) Retention policy बिना CloudWatch Log — indefinitely accumulate हुन्छ; (2) EC2 instance delete गरेपछि पछाडि छोडिएको unattached EBS volume र idle Elastic IP; (3) NAT Gateway data processing charge — NAT GW ले प्रति GB $0.045 charge गर्छ; S3/DynamoDB को लागि VPC endpoint प्रयोग गरेर VPC भित्र traffic राखेर minimize गर्नुहोस्; (4) Internet मा data transfer out — पहिलो 100 GB/month free, त्यसपछि $0.09/GB; (5) Dev/test को क्रममा पनि running रहने RDS Multi-AZ standby instance।",
        jp: "頻度順に：(1) 保持ポリシーのない CloudWatch ログ — 無期限に蓄積される；(2) EC2 インスタンス削除後に残されたアタッチされていない EBS ボリュームとアイドルの Elastic IP；(3) NAT ゲートウェイのデータ処理料金 — NAT GW は処理された GB あたり $0.045 を請求；S3/DynamoDB の VPC エンドポイントを使用して VPC 内にトラフィックを保つことで最小化；(4) インターネットへのデータ転送 — 最初の 100 GB/月は無料、その後 $0.09/GB；(5) 開発/テスト中も実行されている RDS Multi-AZ スタンバイインスタンス。",
      },
      tag: { en: "cost", np: "Cost", jp: "コスト" },
    },
    {
      question: {
        en: "Should I use Reserved Instances or Savings Plans?",
        np: "Reserved Instance वा Savings Plan — के प्रयोग गर्ने?",
        jp: "リザーブドインスタンスか Savings Plans か — どちらを使うべきか？",
      },
      answer: {
        en: "Prefer Savings Plans for EC2 and Fargate — they are more flexible (apply across instance families, sizes, and regions) with similar discount levels. Use Standard Reserved Instances for RDS (Savings Plans do not cover RDS) and for ElastiCache, Redshift, or OpenSearch where Reserved Instances still apply. The main exception: if you need a specific capacity reservation in a specific AZ, use a Zonal Reserved Instance — Savings Plans do not guarantee capacity.",
        np: "EC2 र Fargate को लागि Savings Plan prefer गर्नुहोस् — similar discount level सहित बढी flexible (instance family, size, र region across apply) छन्। RDS को लागि Standard Reserved Instance प्रयोग गर्नुहोस् (Savings Plan ले RDS cover गर्दैन) र ElastiCache, Redshift, वा OpenSearch को लागि जहाँ Reserved Instance अझै apply हुन्छ। Main exception: specific AZ मा specific capacity reservation चाहिन्छ भने Zonal Reserved Instance प्रयोग गर्नुहोस् — Savings Plan ले capacity guarantee गर्दैन।",
        jp: "EC2 と Fargate には Savings Plans を優先してください — 同様の割引レベルでより柔軟です（インスタンスファミリー・サイズ・リージョンをまたいで適用）。RDS（Savings Plans は RDS をカバーしない）と、リザーブドインスタンスがまだ適用される ElastiCache・Redshift・OpenSearch にはスタンダードリザーブドインスタンスを使用。主な例外：特定の AZ で特定のキャパシティ予約が必要な場合はゾーナルリザーブドインスタンスを使用 — Savings Plans はキャパシティを保証しません。",
      },
      tag: { en: "cost", np: "Cost", jp: "コスト" },
    },
  ],
};
