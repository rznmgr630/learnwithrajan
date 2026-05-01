import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "High availability and elastic scaling are two of the main reasons companies move to AWS. An Application Load Balancer routes HTTP traffic across a fleet of EC2 instances. Auto Scaling Groups automatically launch new instances when CPU is high and terminate them when load drops — paying for capacity only when you need it. Together, they handle traffic spikes without manual intervention.",
    np: "High availability र elastic scaling कम्पनीहरू AWS मा जाने दुई मुख्य कारण हुन्। Application Load Balancer ले EC2 instance को fleet मा HTTP traffic route गर्छ। Auto Scaling Group ले CPU उच्च हुँदा automatically नयाँ instance launch गर्छ र load घट्दा terminate गर्छ — आवश्यक भएमा मात्र capacity को लागि भुक्तानी गर्छ। एकसाथ, तिनीहरूले manual intervention बिना traffic spike handle गर्छन्।",
    jp: "高可用性と弾力的なスケーリングは、企業が AWS に移行する主な理由の 2 つです。Application Load Balancer は EC2 インスタンスのフリートに HTTP トラフィックをルーティングします。Auto Scaling Group は CPU が高いときに自動的に新しいインスタンスを起動し、負荷が下がると終了します — 必要なときだけキャパシティに支払います。組み合わせることで、手動介入なしにトラフィックスパイクを処理します。",
  } as const,
  o2: {
    en: "Today you learn to design the complete horizontal scaling architecture: ALB listener rules, target groups, health checks, launch templates, ASG lifecycle hooks, and the scaling policies that connect CloudWatch metrics to capacity decisions. This is the pattern behind every major web application on AWS.",
    np: "आज तपाईंले complete horizontal scaling architecture design गर्न सिक्नुहुनेछ: ALB listener rule, target group, health check, launch template, ASG lifecycle hook, र CloudWatch metric लाई capacity decision सँग connect गर्ने scaling policy। यो AWS मा हरेक major web application पछाडिको pattern हो।",
    jp: "今日は完全な水平スケーリングアーキテクチャを設計することを学びます：ALB リスナールール・ターゲットグループ・ヘルスチェック・起動テンプレート・ASG ライフサイクルフック・CloudWatch メトリクスをキャパシティ決定に結びつけるスケーリングポリシー。これが AWS 上のすべての主要なウェブアプリの背後にあるパターンです。",
  } as const,
};

export const DEVOPS_DAY_35_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Application Load Balancer (ALB)",
        np: "Application Load Balancer (ALB)",
        jp: "Application Load Balancer（ALB）",
      },
      blocks: [
        { type: "diagram", id: "devops-alb-asg" },
        {
          type: "paragraph",
          text: {
            en: "ALB operates at Layer 7 (HTTP/HTTPS). It routes based on host header, path, query string, and HTTP method. Key concepts: Listener (port + protocol), Listener Rules (conditions → target group), Target Group (EC2 instances, IPs, Lambda, ECS tasks), Health Check (path, interval, thresholds). ALB supports HTTP/2, WebSockets, and TLS termination. Use ALB for web apps. Use NLB (Network Load Balancer) for TCP/UDP, extreme performance, or static IP requirements.",
            np: "ALB Layer 7 (HTTP/HTTPS) मा operate गर्छ। यसले host header, path, query string, र HTTP method मा आधारित route गर्छ। मुख्य concept: Listener (port + protocol), Listener Rule (condition → target group), Target Group (EC2 instance, IP, Lambda, ECS task), Health Check (path, interval, threshold)। ALB ले HTTP/2, WebSocket, र TLS termination support गर्छ। Web app का लागि ALB प्रयोग गर्नुहोस्। TCP/UDP, extreme performance, वा static IP requirement का लागि NLB प्रयोग गर्नुहोस्।",
            jp: "ALB はレイヤー 7（HTTP/HTTPS）で動作します。ホストヘッダー・パス・クエリ文字列・HTTP メソッドに基づいてルーティングします。主要なコンセプト：リスナー（ポート + プロトコル）・リスナールール（条件 → ターゲットグループ）・ターゲットグループ（EC2 インスタンス・IP・Lambda・ECS タスク）・ヘルスチェック（パス・間隔・しきい値）。ALB は HTTP/2・WebSocket・TLS 終端をサポートします。ウェブアプリには ALB を使用。TCP/UDP・極限パフォーマンス・静的 IP 要件には NLB を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create ALB, HTTPS listener, target groups, and path-based routing",
            np: "ALB, HTTPS listener, target group, र path-based routing create गर्नुहोस्",
            jp: "ALB・HTTPS リスナー・ターゲットグループ・パスベースルーティングの作成",
          },
          code: `# 1. Create the ALB (in public subnets)
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name prod-alb \
    --subnets subnet-pub-1a subnet-pub-1b \
    --security-groups sg-alb \
    --scheme internet-facing \
    --type application \
    --ip-address-type ipv4 \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)

# 2. Create target groups
WEB_TG=$(aws elbv2 create-target-group \
    --name web-tg \
    --protocol HTTP \
    --port 80 \
    --vpc-id vpc-0abc123 \
    --target-type instance \
    --health-check-path /health \
    --health-check-interval-seconds 30 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

API_TG=$(aws elbv2 create-target-group \
    --name api-tg \
    --protocol HTTP \
    --port 8080 \
    --vpc-id vpc-0abc123 \
    --target-type instance \
    --health-check-path /api/health \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)

# 3. Create HTTPS listener (port 443) with default action → web-tg
LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn "$ALB_ARN" \
    --protocol HTTPS \
    --port 443 \
    --certificates CertificateArn=arn:aws:acm:us-east-1:123456789012:certificate/abc-123 \
    --ssl-policy ELBSecurityPolicy-TLS13-1-2-2021-06 \
    --default-actions "Type=forward,TargetGroupArn=$WEB_TG" \
    --query 'Listeners[0].ListenerArn' \
    --output text)

# 4. Add path-based routing rule: /api/* → api-tg (higher priority wins first)
aws elbv2 create-rule \
    --listener-arn "$LISTENER_ARN" \
    --priority 10 \
    --conditions '[{"Field":"path-pattern","Values":["/api/*"]}]' \
    --actions "[{\"Type\":\"forward\",\"TargetGroupArn\":\"$API_TG\"}]"

# 5. Register existing instances with target groups
aws elbv2 register-targets \
    --target-group-arn "$WEB_TG" \
    --targets Id=i-0abc123 Id=i-0def456

# HTTP → HTTPS redirect on port 80
aws elbv2 create-listener \
    --load-balancer-arn "$ALB_ARN" \
    --protocol HTTP \
    --port 80 \
    --default-actions 'Type=redirect,RedirectConfig={Protocol=HTTPS,Port=443,StatusCode=HTTP_301}'`,
        },
      ],
    },
    {
      title: {
        en: "Health checks & connection draining",
        np: "Health check र connection draining",
        jp: "ヘルスチェックと接続ドレイニング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "ALB sends periodic health check requests (default: HTTP GET `/` every 30s, threshold: 2 consecutive successes/failures). Unhealthy targets are removed from rotation. Connection draining (deregistration delay, default 300s) lets in-flight requests complete before an instance is removed. Make your `/health` endpoint return 200 only when the app is fully ready — check DB connectivity, cache connection, etc.",
            np: "ALB ले periodic health check request पठाउँछ (default: हर 30s मा HTTP GET `/`, threshold: 2 consecutive success/failure)। Unhealthy target लाई rotation बाट remove गरिन्छ। Connection draining (deregistration delay, default 300s) ले instance remove हुनु अघि in-flight request complete हुन दिन्छ। `/health` endpoint ले app पूर्ण रूपमा ready भएमा मात्र 200 return गर्नुपर्छ — DB connectivity, cache connection, आदि check गर्नुहोस्।",
            jp: "ALB は定期的なヘルスチェックリクエストを送信します（デフォルト：30 秒ごとに HTTP GET `/`、しきい値：連続 2 回の成功/失敗）。不健全なターゲットはローテーションから除外されます。接続ドレイニング（登録解除の遅延、デフォルト 300 秒）はインスタンスが削除される前に処理中のリクエストを完了させます。`/health` エンドポイントはアプリが完全に準備できたときのみ 200 を返すようにしてください — DB 接続・キャッシュ接続などを確認します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Configure health check settings and connection draining",
            np: "Health check setting र connection draining configure गर्नुहोस्",
            jp: "ヘルスチェック設定と接続ドレイニングの設定",
          },
          code: `# Tune health check parameters on an existing target group
aws elbv2 modify-target-group \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/web-tg/abc \
    --health-check-path /health \
    --health-check-interval-seconds 15 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 3 \
    --health-check-timeout-seconds 5

# Reduce deregistration delay to 30s (good for fast-deploys; default is 300s)
aws elbv2 modify-target-group-attributes \
    --target-group-arn arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/web-tg/abc \
    --attributes Key=deregistration_delay.timeout_seconds,Value=30

# Enable ALB access logs to S3 (critical for debugging and audit)
aws elbv2 modify-load-balancer-attributes \
    --load-balancer-arn "$ALB_ARN" \
    --attributes \
      Key=access_logs.s3.enabled,Value=true \
      Key=access_logs.s3.bucket,Value=my-alb-logs \
      Key=access_logs.s3.prefix,Value=prod-alb \
      Key=idle_timeout.timeout_seconds,Value=60

# Check target health (which instances are healthy/unhealthy and why)
aws elbv2 describe-target-health \
    --target-group-arn "$WEB_TG" \
    --query "TargetHealthDescriptions[*].{Id:Target.Id,Port:Target.Port,State:TargetHealth.State,Reason:TargetHealth.Reason}"

# Example /health endpoint in Python Flask (checks DB before returning 200)
# @app.route('/health')
# def health():
#     try:
#         db.execute('SELECT 1')
#         redis_client.ping()
#         return {'status': 'ok'}, 200
#     except Exception as e:
#         return {'status': 'unhealthy', 'error': str(e)}, 503`,
        },
      ],
    },
    {
      title: {
        en: "Launch Templates — the ASG blueprint",
        np: "Launch Template — ASG blueprint",
        jp: "起動テンプレート — ASG のブループリント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A Launch Template defines what each new instance looks like: AMI, instance type, key pair, SGs, IAM profile, user-data, EBS config. Unlike Launch Configurations (deprecated), Launch Templates support versioning and mixed instance policies (on-demand + spot). Always use Launch Templates.",
            np: "Launch Template ले प्रत्येक नयाँ instance कस्तो देखिन्छ define गर्छ: AMI, instance type, key pair, SG, IAM profile, user-data, EBS config। Launch Configuration (deprecated) भन्दा फरक, Launch Template ले versioning र mixed instance policy (on-demand + spot) support गर्छ। सधैं Launch Template प्रयोग गर्नुहोस्।",
            jp: "起動テンプレートは各新しいインスタンスの外観を定義します：AMI・インスタンスタイプ・キーペア・SG・IAM プロファイル・ユーザーデータ・EBS 設定。起動設定（非推奨）とは異なり、起動テンプレートはバージョニングとミックスドインスタンスポリシー（オンデマンド + スポット）をサポートします。常に起動テンプレートを使用してください。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create and version a Launch Template",
            np: "Launch Template create र version गर्नुहोस्",
            jp: "起動テンプレートの作成とバージョン管理",
          },
          code: `# launch-template-data.json
{
  "ImageId": "ami-0abcdef1234567890",
  "InstanceType": "t3.medium",
  "KeyName": "prod-key",
  "SecurityGroupIds": ["sg-0webserver"],
  "IamInstanceProfile": {
    "Name": "WebAppInstanceProfile"
  },
  "UserData": "IyEvYmluL2Jhc2gKeXVtIHVwZGF0ZSAteQp5dW0gaW5zdGFsbCAteSBuZ2lueAo=",
  "BlockDeviceMappings": [
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
  ],
  "MetadataOptions": {
    "HttpEndpoint": "enabled",
    "HttpTokens": "required",
    "HttpPutResponseHopLimit": 1
  },
  "TagSpecifications": [
    {
      "ResourceType": "instance",
      "Tags": [{"Key": "Name", "Value": "prod-web"}, {"Key": "Environment", "Value": "production"}]
    }
  ]
}

# Create the initial version of the launch template
aws ec2 create-launch-template \
    --launch-template-name prod-web-lt \
    --version-description "v1 — nginx on Amazon Linux 2023" \
    --launch-template-data file://launch-template-data.json

# Create a new version (e.g., update AMI after patching)
aws ec2 create-launch-template-version \
    --launch-template-name prod-web-lt \
    --version-description "v2 — updated AMI ami-0newimage" \
    --source-version 1 \
    --launch-template-data '{"ImageId":"ami-0newimage"}'

# Set the new version as default
aws ec2 modify-launch-template \
    --launch-template-name prod-web-lt \
    --default-version 2

# Inspect all versions
aws ec2 describe-launch-template-versions \
    --launch-template-name prod-web-lt \
    --query "LaunchTemplateVersions[*].{Version:VersionNumber,Desc:VersionDescription,Default:DefaultVersion}"`,
        },
      ],
    },
    {
      title: {
        en: "Auto Scaling Groups & scaling policies",
        np: "Auto Scaling Group र scaling policy",
        jp: "Auto Scaling Group とスケーリングポリシー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An ASG maintains a fleet between min and max capacity. Three scaling policy types: (1) Target Tracking — maintain a metric at a target (e.g. CPU 50%); (2) Step Scaling — scale by X instances when metric crosses threshold Y; (3) Scheduled Scaling — scale at a known time (business hours). Predictive Scaling uses ML to forecast load. Use target tracking as the default — AWS manages the alarm thresholds automatically.",
            np: "ASG ले min र max capacity बीच fleet maintain गर्छ। तीन scaling policy type: (1) Target Tracking — metric लाई target मा maintain गर्नुहोस् (जस्तै CPU 50%); (2) Step Scaling — metric threshold Y पार गर्दा X instance द्वारा scale गर्नुहोस्; (3) Scheduled Scaling — थाहा भएको समयमा scale गर्नुहोस् (business hour)। Predictive Scaling ले load forecast गर्न ML प्रयोग गर्छ। Default को रूपमा target tracking प्रयोग गर्नुहोस् — AWS ले automatically alarm threshold manage गर्छ।",
            jp: "ASG は最小と最大のキャパシティの間でフリートを維持します。3 つのスケーリングポリシータイプ：(1) ターゲットトラッキング — メトリクスをターゲットに維持（例：CPU 50%）；(2) ステップスケーリング — メトリクスがしきい値 Y を超えたら X インスタンス分スケール；(3) スケジュールスケーリング — 既知の時間にスケール（業務時間）。予測スケーリングは ML を使って負荷を予測します。デフォルトとしてターゲットトラッキングを使用 — AWS がアラームのしきい値を自動的に管理します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Scaling policy comparison — when to use, complexity, reaction time, recommended",
            np: "Scaling policy comparison — कहिले प्रयोग गर्ने, complexity, reaction time, recommended",
            jp: "スケーリングポリシーの比較 — 使用タイミング・複雑さ・反応時間・推奨",
          },
          headers: [
            { en: "Policy Type", np: "Policy Type", jp: "ポリシータイプ" },
            { en: "When to Use", np: "कहिले प्रयोग गर्ने", jp: "使用タイミング" },
            { en: "Config Complexity", np: "Config Complexity", jp: "設定の複雑さ" },
            { en: "Reaction Time", np: "Reaction Time", jp: "反応時間" },
            { en: "Recommended?", np: "Recommended?", jp: "推奨？" },
          ],
          rows: [
            [
              { en: "Target Tracking", np: "Target Tracking", jp: "ターゲットトラッキング" },
              { en: "Default for most workloads — maintain CPU/requests at a target", np: "धेरैजसो workload को default — CPU/request लाई target मा maintain", jp: "ほとんどのワークロードのデフォルト — CPU/リクエストをターゲットに維持" },
              { en: "Low — pick metric + target value", np: "कम — metric + target value छान्नुहोस्", jp: "低 — メトリクスとターゲット値を選ぶだけ" },
              { en: "3–5 min (CloudWatch alarm + instance boot)", np: "3–5 min (CloudWatch alarm + instance boot)", jp: "3〜5 分（CloudWatch アラーム + インスタンス起動）" },
              { en: "Yes — start here", np: "हो — यहाँबाट सुरु गर्नुहोस्", jp: "はい — ここから始める" },
            ],
            [
              { en: "Step Scaling", np: "Step Scaling", jp: "ステップスケーリング" },
              { en: "Fine-grained control: scale by different amounts at different thresholds", np: "Fine-grained control: फरक threshold मा फरक amount द्वारा scale", jp: "きめ細かい制御：異なるしきい値で異なる量のスケール" },
              { en: "Medium — define step adjustments per alarm", np: "Medium — प्रति alarm step adjustment define गर्नुहोस्", jp: "中 — アラームごとにステップ調整を定義" },
              { en: "3–5 min (same as target tracking)", np: "3–5 min (target tracking जस्तै)", jp: "3〜5 分（ターゲットトラッキングと同じ）" },
              { en: "Sometimes — when target tracking is too coarse", np: "कहिलेकाहीँ — target tracking धेरै coarse हुँदा", jp: "場合による — ターゲットトラッキングが粗すぎる場合" },
            ],
            [
              { en: "Scheduled Scaling", np: "Scheduled Scaling", jp: "スケジュールスケーリング" },
              { en: "Known traffic patterns: scale up Mon–Fri 8am, scale down 8pm", np: "थाहा भएको traffic pattern: Mon–Fri बिहान 8 बजे scale up, राति 8 बजे scale down", jp: "既知のトラフィックパターン：月〜金 8 時にスケールアップ、20 時にスケールダウン" },
              { en: "Low — cron expression + desired/min/max", np: "कम — cron expression + desired/min/max", jp: "低 — cron 式 + desired/min/max" },
              { en: "Instant — pre-warms before traffic arrives", np: "Instant — traffic आउनु अघि pre-warms", jp: "即時 — トラフィックが来る前にウォームアップ" },
              { en: "Yes — combine with target tracking", np: "हो — target tracking सँग combine गर्नुहोस्", jp: "はい — ターゲットトラッキングと組み合わせる" },
            ],
            [
              { en: "Predictive Scaling", np: "Predictive Scaling", jp: "予測スケーリング" },
              { en: "Recurring patterns detected by ML — launches instances proactively", np: "ML द्वारा detect recurring pattern — proactively instance launch गर्छ", jp: "ML で検出された繰り返しパターン — プロアクティブにインスタンスを起動" },
              { en: "Low — enable it and let it learn", np: "कम — enable गर्नुहोस् र learn हुन दिनुहोस्", jp: "低 — 有効化して学習させる" },
              { en: "Zero lag — already scaled before traffic spike", np: "Zero lag — traffic spike अघि नै scaled", jp: "ゼロ遅延 — トラフィックスパイク前にすでにスケール済み" },
              { en: "Yes — enable alongside target tracking for spiky workloads", np: "हो — spiky workload का लागि target tracking सँगै enable गर्नुहोस्", jp: "はい — スパイクの多いワークロードではターゲットトラッキングと一緒に有効化" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Create ASG with launch template, attach to ALB, add target tracking policy",
            np: "Launch template सँग ASG create, ALB मा attach, target tracking policy थप्नुहोस्",
            jp: "起動テンプレートで ASG 作成・ALB へのアタッチ・ターゲットトラッキングポリシーの追加",
          },
          code: `# Create the Auto Scaling Group
aws autoscaling create-auto-scaling-group \
    --auto-scaling-group-name prod-web-asg \
    --launch-template LaunchTemplateName=prod-web-lt,Version='$Latest' \
    --min-size 2 \
    --max-size 10 \
    --desired-capacity 2 \
    --vpc-zone-identifier "subnet-priv-1a,subnet-priv-1b" \
    --health-check-type ELB \
    --health-check-grace-period 120 \
    --tags Key=Name,Value=prod-web,PropagateAtLaunch=true

# Attach the ASG to the ALB target group
aws autoscaling attach-load-balancer-target-groups \
    --auto-scaling-group-name prod-web-asg \
    --target-group-arns "$WEB_TG"

# Add a target tracking scaling policy (maintain average CPU at 50%)
aws autoscaling put-scaling-policy \
    --auto-scaling-group-name prod-web-asg \
    --policy-name cpu-target-tracking \
    --policy-type TargetTrackingScaling \
    --target-tracking-configuration '{
      "PredefinedMetricSpecification": {
        "PredefinedMetricType": "ASGAverageCPUUtilization"
      },
      "TargetValue": 50.0,
      "ScaleInCooldown": 300,
      "ScaleOutCooldown": 60
    }'

# Add a scheduled scale-out for business hours (Mon–Fri 8 AM UTC)
aws autoscaling put-scheduled-update-group-action \
    --auto-scaling-group-name prod-web-asg \
    --scheduled-action-name scale-out-business-hours \
    --recurrence "0 8 * * MON-FRI" \
    --min-size 4 \
    --desired-capacity 4

# Scale back down at night (Mon–Fri 8 PM UTC)
aws autoscaling put-scheduled-update-group-action \
    --auto-scaling-group-name prod-web-asg \
    --scheduled-action-name scale-in-nights \
    --recurrence "0 20 * * MON-FRI" \
    --min-size 2 \
    --desired-capacity 2

# Watch scaling activities in real time
aws autoscaling describe-scaling-activities \
    --auto-scaling-group-name prod-web-asg \
    --max-items 10 \
    --query "Activities[*].{Time:StartTime,Status:StatusCode,Cause:Cause}"`,
        },
      ],
    },
    {
      title: {
        en: "Lifecycle hooks — custom actions during scale-out/in",
        np: "Lifecycle hook — scale-out/in को क्रममा custom action",
        jp: "ライフサイクルフック — スケールアウト/インの際のカスタムアクション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Lifecycle hooks pause the launch or termination process while you run custom logic. On launch: wait for the instance to register with your service discovery, pull config from Parameter Store, warm up the cache. On termination: drain active connections, flush metrics, deregister from service mesh. Hooks can trigger Lambda, SQS, or SNS. Default timeout: 1 hour (heartbeat to extend).",
            np: "Lifecycle hook ले launch वा termination process pause गर्छ जबकि तपाईं custom logic run गर्नुहुन्छ। Launch मा: service discovery सँग instance register हुन पर्खनुहोस्, Parameter Store बाट config pull गर्नुहोस्, cache warm up गर्नुहोस्। Termination मा: active connection drain गर्नुहोस्, metric flush गर्नुहोस्, service mesh बाट deregister गर्नुहोस्। Hook ले Lambda, SQS, वा SNS trigger गर्न सक्छ। Default timeout: 1 घण्टा (extend गर्न heartbeat)।",
            jp: "ライフサイクルフックは、カスタムロジックを実行する間、起動または終了プロセスを一時停止します。起動時：インスタンスがサービスディスカバリに登録するのを待つ・Parameter Store から設定を取得・キャッシュをウォームアップ。終了時：アクティブな接続をドレイン・メトリクスをフラッシュ・サービスメッシュから登録解除。フックは Lambda・SQS・SNS をトリガーできます。デフォルトタイムアウト：1 時間（延長するにはハートビート）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create lifecycle hooks and Lambda handler to complete lifecycle action",
            np: "Lifecycle hook create गर्नुहोस् र lifecycle action complete गर्न Lambda handler",
            jp: "ライフサイクルフックの作成とライフサイクルアクションを完了する Lambda ハンドラー",
          },
          code: `# Create a LAUNCHING lifecycle hook (pauses instance in Pending:Wait state)
aws autoscaling put-lifecycle-hook \
    --lifecycle-hook-name on-launch-hook \
    --auto-scaling-group-name prod-web-asg \
    --lifecycle-transition autoscaling:EC2_INSTANCE_LAUNCHING \
    --notification-target-arn arn:aws:sqs:us-east-1:123456789012:asg-lifecycle-queue \
    --role-arn arn:aws:iam::123456789012:role/ASGLifecycleRole \
    --heartbeat-timeout 300 \
    --default-result CONTINUE

# Create a TERMINATING lifecycle hook (pauses in Terminating:Wait state)
aws autoscaling put-lifecycle-hook \
    --lifecycle-hook-name on-terminate-hook \
    --auto-scaling-group-name prod-web-asg \
    --lifecycle-transition autoscaling:EC2_INSTANCE_TERMINATING \
    --notification-target-arn arn:aws:sqs:us-east-1:123456789012:asg-lifecycle-queue \
    --role-arn arn:aws:iam::123456789012:role/ASGLifecycleRole \
    --heartbeat-timeout 120 \
    --default-result CONTINUE

# Lambda handler triggered from SQS (Python)
import boto3, json, logging

logger = logging.getLogger()
autoscaling = boto3.client('autoscaling')

def handler(event, context):
    for record in event['Records']:
        message = json.loads(record['body'])
        transition = message.get('LifecycleTransition', '')
        instance_id = message.get('EC2InstanceId')

        if transition == 'autoscaling:EC2_INSTANCE_LAUNCHING':
            # --- Custom launch logic ---
            logger.info(f"Instance {instance_id} launching — running warmup")
            # e.g. pull config from SSM, pre-load cache, register with Consul
            run_warmup(instance_id)

        elif transition == 'autoscaling:EC2_INSTANCE_TERMINATING':
            # --- Custom termination logic ---
            logger.info(f"Instance {instance_id} terminating — draining")
            drain_connections(instance_id)

        # MUST call CompleteLifecycleAction — instance stays Pending:Wait until this
        autoscaling.complete_lifecycle_action(
            LifecycleHookName=message['LifecycleHookName'],
            AutoScalingGroupName=message['AutoScalingGroupName'],
            LifecycleActionToken=message['LifecycleActionToken'],
            InstanceId=instance_id,
            LifecycleActionResult='CONTINUE'  # or 'ABANDON' to roll back
        )
        logger.info(f"Lifecycle action completed for {instance_id}")`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a self-healing auto-scaling web tier",
        np: "Hands-on: self-healing auto-scaling web tier बनाउनुहोस्",
        jp: "ハンズオン：自己修復する自動スケーリングウェブ層を構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a launch template with Amazon Linux 2023, nginx user-data, and an SSM instance profile. The user-data should install nginx, start it, and write an `/health` endpoint that returns HTTP 200.",
              np: "Amazon Linux 2023, nginx user-data, र SSM instance profile सहित launch template create गर्नुहोस्। User-data ले nginx install गर्नुपर्छ, सुरु गर्नुपर्छ, र HTTP 200 return गर्ने `/health` endpoint लेख्नुपर्छ।",
              jp: "Amazon Linux 2023・nginx ユーザーデータ・SSM インスタンスプロファイルで起動テンプレートを作成する。ユーザーデータは nginx をインストール・起動し、HTTP 200 を返す `/health` エンドポイントを書く必要があります。",
            },
            {
              en: "Create an ALB in public subnets with a target group (health check on `/health`, interval 15s, threshold 2) and an HTTPS listener. If you don't have an ACM certificate, use HTTP on port 80 for the exercise.",
              np: "Target group (health check `/health`, interval 15s, threshold 2) र HTTPS listener सहित public subnet मा ALB create गर्नुहोस्। ACM certificate नभएमा, exercise का लागि port 80 मा HTTP प्रयोग गर्नुहोस्।",
              jp: "ターゲットグループ（`/health` のヘルスチェック・間隔 15 秒・しきい値 2）と HTTPS リスナーでパブリックサブネットに ALB を作成する。ACM 証明書がない場合は、演習にはポート 80 の HTTP を使用する。",
            },
            {
              en: "Create an ASG (min 2, max 6, desired 2) using the launch template, across 2 AZs in private subnets. Set health check type to ELB with a 120s grace period so the ALB health check drives replacement.",
              np: "Private subnet मा 2 AZ मा launch template प्रयोग गरी ASG (min 2, max 6, desired 2) create गर्नुहोस्। Health check type ELB मा 120s grace period सहित set गर्नुहोस् ताकि ALB health check ले replacement drive गरोस्।",
              jp: "プライベートサブネットの 2 つの AZ にまたがる起動テンプレートを使って ASG（min 2・max 6・desired 2）を作成する。ALB ヘルスチェックが置き換えを駆動するよう、120 秒のグレース期間で ヘルスチェックタイプを ELB に設定する。",
            },
            {
              en: "Attach the ASG to the ALB target group: `aws autoscaling attach-load-balancer-target-groups --auto-scaling-group-name prod-web-asg --target-group-arns $WEB_TG`. Confirm both instances appear healthy in the target group.",
              np: "ASG लाई ALB target group मा attach गर्नुहोस्: `aws autoscaling attach-load-balancer-target-groups --auto-scaling-group-name prod-web-asg --target-group-arns $WEB_TG`। Target group मा दुवै instance healthy देखिएको confirm गर्नुहोस्।",
              jp: "ASG を ALB ターゲットグループにアタッチ：`aws autoscaling attach-load-balancer-target-groups --auto-scaling-group-name prod-web-asg --target-group-arns $WEB_TG`。ターゲットグループに両方のインスタンスが健全として表示されることを確認する。",
            },
            {
              en: "Add a target tracking policy to keep average CPU at 50% using `aws autoscaling put-scaling-policy` with `ASGAverageCPUUtilization`. The policy creates the CloudWatch alarms automatically.",
              np: "`ASGAverageCPUUtilization` सहित `aws autoscaling put-scaling-policy` प्रयोग गरी average CPU 50% मा राख्न target tracking policy थप्नुहोस्। Policy ले automatically CloudWatch alarm create गर्छ।",
              jp: "`ASGAverageCPUUtilization` で `aws autoscaling put-scaling-policy` を使って平均 CPU を 50% に維持するターゲットトラッキングポリシーを追加する。ポリシーは CloudWatch アラームを自動的に作成します。",
            },
            {
              en: "Terminate one instance manually using `aws ec2 terminate-instances --instance-ids i-0abc123`. Watch `aws autoscaling describe-scaling-activities` and the target group health check — the ASG should launch a replacement within 2-3 minutes.",
              np: "`aws ec2 terminate-instances --instance-ids i-0abc123` प्रयोग गरी manually एउटा instance terminate गर्नुहोस्। `aws autoscaling describe-scaling-activities` र target group health check हेर्नुहोस् — ASG ले 2-3 मिनेट भित्र replacement launch गर्नुपर्छ।",
              jp: "`aws ec2 terminate-instances --instance-ids i-0abc123` で手動でインスタンスを終了させる。`aws autoscaling describe-scaling-activities` とターゲットグループのヘルスチェックを監視する — ASG は 2〜3 分以内に代替インスタンスを起動するはずです。",
            },
            {
              en: "Generate load to trigger scale-out using `ab -n 100000 -c 100 http://ALB-DNS/` or `hey -n 100000 -c 100 http://ALB-DNS/`. Watch CloudWatch metrics for CPUUtilization and observe the ASG adding instances.",
              np: "`ab -n 100000 -c 100 http://ALB-DNS/` वा `hey -n 100000 -c 100 http://ALB-DNS/` प्रयोग गरी scale-out trigger गर्न load generate गर्नुहोस्। CPUUtilization का लागि CloudWatch metric हेर्नुहोस् र ASG ले instance थपिरहेको observe गर्नुहोस्।",
              jp: "`ab -n 100000 -c 100 http://ALB-DNS/` または `hey -n 100000 -c 100 http://ALB-DNS/` を使って負荷を生成してスケールアウトをトリガーする。CPUUtilization の CloudWatch メトリクスを監視し、ASG がインスタンスを追加するのを観察する。",
            },
            {
              en: "Set up a scheduled scale-in for nights and weekends using `aws autoscaling put-scheduled-update-group-action` with a cron expression. This ensures you don't pay for full capacity during off-peak hours.",
              np: "Cron expression सहित `aws autoscaling put-scheduled-update-group-action` प्रयोग गरी रात र weekend का लागि scheduled scale-in setup गर्नुहोस्। यसले off-peak hour मा full capacity को भुक्तानी नगर्ने सुनिश्चित गर्छ।",
              jp: "cron 式で `aws autoscaling put-scheduled-update-group-action` を使って夜間と週末のスケジュールスケールインを設定する。これによりオフピーク時間帯に全キャパシティの費用を払わずに済みます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I handle sessions in a load-balanced environment?",
        np: "Load-balanced environment मा session कसरी handle गर्ने?",
        jp: "ロードバランス環境でセッションをどう扱うか？",
      },
      answer: {
        en: "Store sessions outside the EC2 instances — use ElastiCache Redis for session state, or use ALB sticky sessions as a short-term workaround (but sticky sessions reduce the effectiveness of load balancing). Sticky sessions route a user to the same target for the duration of a cookie.",
        np: "EC2 instance बाहिर session store गर्नुहोस् — session state का लागि ElastiCache Redis प्रयोग गर्नुहोस्, वा short-term workaround को रूपमा ALB sticky session प्रयोग गर्नुहोस् (तर sticky session ले load balancing को effectiveness घटाउँछ)। Sticky session ले user लाई cookie को अवधिभर same target मा route गर्छ।",
        jp: "EC2 インスタンスの外にセッションを保存してください — セッション状態には ElastiCache Redis を使用するか、短期的な回避策として ALB スティッキーセッションを使用します（ただしスティッキーセッションはロードバランシングの効果を低下させます）。スティッキーセッションはクッキーの期間中、ユーザーを同じターゲットにルーティングします。",
      },
      tag: { en: "alb", np: "ALB", jp: "ALB" },
    },
    {
      question: {
        en: "What's the difference between ALB and NLB?",
        np: "ALB र NLB बीच के फरक छ?",
        jp: "ALB と NLB の違いは何か？",
      },
      answer: {
        en: "ALB is Layer 7 (HTTP/HTTPS) — path routing, host routing, header inspection, WebSocket support. NLB is Layer 4 (TCP/UDP) — ultra-low latency, static IPs, millions of requests/second, pass-through for TLS. Use ALB for web apps; NLB for gaming, IoT, or when you need a static IP for whitelisting.",
        np: "ALB Layer 7 (HTTP/HTTPS) हो — path routing, host routing, header inspection, WebSocket support। NLB Layer 4 (TCP/UDP) हो — ultra-low latency, static IP, लाखौं request/second, TLS को लागि pass-through। Web app का लागि ALB; gaming, IoT, वा whitelisting का लागि static IP चाहिँदा NLB प्रयोग गर्नुहोस्।",
        jp: "ALB はレイヤー 7（HTTP/HTTPS）— パスルーティング・ホストルーティング・ヘッダー検査・WebSocket サポート。NLB はレイヤー 4（TCP/UDP）— 超低遅延・静的 IP・毎秒数百万リクエスト・TLS のパススルー。ウェブアプリには ALB；ゲーミング・IoT・ホワイトリスト用の静的 IP が必要な場合は NLB を使用します。",
      },
      tag: { en: "alb", np: "ALB", jp: "ALB" },
    },
    {
      question: {
        en: "How quickly does Auto Scaling respond to a traffic spike?",
        np: "Auto Scaling ले traffic spike मा कति छिटो response गर्छ?",
        jp: "Auto Scaling はトラフィックスパイクにどれくらい速く対応するか？",
      },
      answer: {
        en: "Typically 3-5 minutes: CloudWatch alarm triggers (1 min data + 2 evaluation periods), ASG launches instance, instance boot + user-data (1-3 min), ALB health check passes. For spiky workloads, use Predictive Scaling or pre-warm with scheduled actions before the expected spike.",
        np: "सामान्यतया 3-5 मिनेट: CloudWatch alarm trigger हुन्छ (1 min data + 2 evaluation period), ASG ले instance launch गर्छ, instance boot + user-data (1-3 min), ALB health check pass हुन्छ। Spiky workload का लागि, Predictive Scaling वा expected spike अघि scheduled action सँग pre-warm प्रयोग गर्नुहोस्।",
        jp: "通常 3〜5 分：CloudWatch アラームのトリガー（1 分のデータ + 2 評価期間）・ASG がインスタンスを起動・インスタンスの起動 + ユーザーデータ（1〜3 分）・ALB ヘルスチェックの通過。スパイクの多いワークロードには、予測スケーリングを使用するか、予想されるスパイク前にスケジュールされたアクションでウォームアップします。",
      },
      tag: { en: "asg", np: "ASG", jp: "ASG" },
    },
  ],
};
