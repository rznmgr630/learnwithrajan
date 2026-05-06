import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Amazon ECS (Elastic Container Service) is AWS's managed container orchestration service. You define what container to run (Task Definition), how many copies to keep running (Service), and ECS handles scheduling, health replacement, and rolling deploys. ECR (Elastic Container Registry) is AWS's fully managed Docker registry — private, integrated with IAM, and scanned for CVEs. Together ECS + ECR give you a production container platform without managing Kubernetes.",
    np: "Amazon ECS (Elastic Container Service) AWS को managed container orchestration service हो। तपाईंले कुन container run गर्ने (Task Definition), कतिवटा copy running राख्ने (Service) define गर्नुहुन्छ, र ECS ले scheduling, health replacement, र rolling deploy handle गर्छ। ECR (Elastic Container Registry) AWS को fully managed Docker registry हो — private, IAM सँग integrated, र CVE को लागि scanned। ECS + ECR सँगै Kubernetes manage नगरी production container platform दिन्छन्।",
    jp: "Amazon ECS（Elastic Container Service）は AWS のマネージドコンテナオーケストレーションサービスです。実行するコンテナ（タスク定義）・維持する実行数（サービス）を定義し、ECS がスケジューリング・ヘルス置き換え・ローリングデプロイを処理します。ECR（Elastic Container Registry）は AWS のフルマネージド Docker レジストリです — プライベートで IAM と統合され、CVE のスキャンが行われます。ECS + ECR を合わせることで、Kubernetes を管理することなく本番コンテナプラットフォームが得られます。",
  } as const,
  o2: {
    en: "Today you learn ECS core concepts (clusters, task definitions, services, launch types), the difference between EC2 and Fargate launch types, how to push images to ECR, create and run tasks and services, configure ALB integration, rolling updates, and auto-scaling for ECS services.",
    np: "आज तपाईंले ECS core concept (cluster, task definition, service, launch type), EC2 र Fargate launch type बीचको फरक, ECR मा image push गर्ने, task र service create र run गर्ने, ALB integration configure गर्ने, rolling update, र ECS service को लागि auto-scaling सिक्नुहुनेछ।",
    jp: "今日は ECS のコアコンセプト（クラスター・タスク定義・サービス・起動タイプ）・EC2 と Fargate 起動タイプの違い・ECR へのイメージのプッシュ・タスクとサービスの作成と実行・ALB 統合の設定・ローリングアップデート・ECS サービスの自動スケーリングを学びます。",
  } as const,
};

export const DEVOPS_DAY_40_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "ECS architecture — clusters, task definitions & services",
        np: "ECS architecture — cluster, task definition र service",
        jp: "ECS アーキテクチャ — クラスター・タスク定義・サービス",
      },
      blocks: [
        { type: "diagram", id: "devops-ecs-ecr" },
        {
          type: "paragraph",
          text: {
            en: "A Cluster is the logical boundary for ECS resources. A Task Definition is a blueprint (JSON) that specifies the container image, CPU/memory, port mappings, environment variables, IAM task role, logging configuration, and health check. A Task is a running instance of a task definition. A Service maintains a desired number of tasks running, integrates with ALB target groups, and handles rolling deploys. Two launch types: Fargate (serverless — AWS manages the underlying EC2 instances; you pay per vCPU/memory-second) and EC2 (you manage the EC2 instances in the cluster; cheaper for sustained loads, more control).",
            np: "Cluster ECS resource को logical boundary हो। Task Definition एउटा blueprint (JSON) हो जसले container image, CPU/memory, port mapping, environment variable, IAM task role, logging configuration, र health check specify गर्छ। Task task definition को running instance हो। Service ले desired number of task running maintain गर्छ, ALB target group सँग integrate गर्छ, र rolling deploy handle गर्छ। दुई launch type: Fargate (serverless — AWS ले underlying EC2 instance manage गर्छ; तपाईं प्रति vCPU/memory-second भुक्तानी गर्नुहुन्छ) र EC2 (तपाईंले cluster मा EC2 instance manage गर्नुहुन्छ; sustained load का लागि सस्तो, बढी control)।",
            jp: "クラスターは ECS リソースの論理的な境界です。タスク定義はコンテナイメージ・CPU/メモリ・ポートマッピング・環境変数・IAM タスクロール・ロギング設定・ヘルスチェックを指定する設計図（JSON）です。タスクはタスク定義の実行インスタンスです。サービスは希望するタスク数を維持し、ALB ターゲットグループと統合し、ローリングデプロイを処理します。2 つの起動タイプ：Fargate（サーバーレス — AWS が基盤となる EC2 インスタンスを管理；vCPU/メモリ秒単位で課金）と EC2（クラスター内の EC2 インスタンスを自分で管理；持続的な負荷では安く、より多くの制御）。",
          },
        },
        {
          type: "table",
          caption: {
            en: "EC2 vs Fargate launch type comparison",
            np: "EC2 vs Fargate launch type comparison",
            jp: "EC2 と Fargate 起動タイプの比較",
          },
          headers: [
            { en: "Aspect", np: "Aspect", jp: "側面" },
            { en: "EC2 Launch Type", np: "EC2 Launch Type", jp: "EC2 起動タイプ" },
            { en: "Fargate Launch Type", np: "Fargate Launch Type", jp: "Fargate 起動タイプ" },
          ],
          rows: [
            [
              { en: "Infra management", np: "Infra management", jp: "インフラ管理" },
              { en: "You manage EC2 instances, AMIs, capacity", np: "तपाईं EC2 instance, AMI, capacity manage गर्नुहुन्छ", jp: "自分で EC2 インスタンス・AMI・キャパシティを管理" },
              { en: "AWS manages all infra — no EC2 to patch", np: "AWS ले सबै infra manage गर्छ — patch गर्न EC2 छैन", jp: "AWS がすべてのインフラを管理 — パッチ適用する EC2 なし" },
            ],
            [
              { en: "Pricing", np: "Pricing", jp: "価格" },
              { en: "Pay for EC2 instances (even idle); Spot available", np: "EC2 instance को लागि भुक्तानी (idle मा पनि); Spot available", jp: "EC2 インスタンス料金（アイドル時も）；スポット利用可能" },
              { en: "Pay per task vCPU+memory per second; no idle cost", np: "प्रति task vCPU+memory प्रति second; idle cost छैन", jp: "タスクの vCPU+メモリ/秒で課金；アイドルコストなし" },
            ],
            [
              { en: "Cold start", np: "Cold start", jp: "コールドスタート" },
              { en: "Fast — containers start on running EC2 instances", np: "Fast — running EC2 instance मा container start", jp: "高速 — 実行中の EC2 インスタンスでコンテナ起動" },
              { en: "Slower (~30s) — AWS provisions compute on demand", np: "धिमा (~30s) — AWS ले on demand compute provision गर्छ", jp: "遅い（〜30秒）— AWS がオンデマンドでコンピュートをプロビジョニング" },
            ],
            [
              { en: "Use case", np: "Use case", jp: "ユースケース" },
              { en: "Sustained high-traffic, GPU workloads, Spot savings", np: "Sustained high-traffic, GPU workload, Spot savings", jp: "持続的な高トラフィック・GPU ワークロード・スポット節約" },
              { en: "Variable traffic, microservices, no ops overhead", np: "Variable traffic, microservice, no ops overhead", jp: "変動トラフィック・マイクロサービス・運用オーバーヘッドなし" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "ECR — build, push & pull container images",
        np: "ECR — container image build, push र pull गर्नुहोस्",
        jp: "ECR — コンテナイメージのビルド・プッシュ・プル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "ECR repositories are private by default and scanned for vulnerabilities on push (Enhanced scanning uses Inspector). Images are tagged and referenced by URI: `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPO_NAME:TAG`. IAM controls who can push/pull (via resource-based repository policies or identity-based policies). ECR caches Docker Hub images as pull-through caches to avoid rate limiting in CI/CD pipelines.",
            np: "ECR repository default मा private हुन्छ र push मा vulnerability को लागि scan गरिन्छ (Enhanced scanning ले Inspector प्रयोग गर्छ)। Image tag र URI द्वारा reference गरिन्छ: `ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPO_NAME:TAG`। IAM ले push/pull गर्न सक्ने को control गर्छ (resource-based repository policy वा identity-based policy मार्फत)। ECR ले CI/CD pipeline मा rate limiting avoid गर्न Docker Hub image लाई pull-through cache को रूपमा cache गर्छ।",
            jp: "ECR リポジトリはデフォルトでプライベートで、プッシュ時に脆弱性がスキャンされます（拡張スキャンは Inspector を使用）。イメージはタグ付けされ URI で参照されます：`ACCOUNT_ID.dkr.ecr.REGION.amazonaws.com/REPO_NAME:TAG`。IAM はプッシュ/プルできるユーザーを制御します（リソースベースのリポジトリポリシーまたはアイデンティティベースのポリシー経由）。ECR は CI/CD パイプラインでのレート制限を避けるために Docker Hub イメージをプルスルーキャッシュとしてキャッシュします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create an ECR repository, build and push an image",
            np: "ECR repository create गर्नुहोस्, image build र push गर्नुहोस्",
            jp: "ECR リポジトリの作成・イメージのビルドとプッシュ",
          },
          code: `ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"
REPO="my-app"
IMAGE_URI="$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/$REPO"

# ── Create ECR repository with vulnerability scanning ──
aws ecr create-repository \
    --repository-name "$REPO" \
    --image-scanning-configuration scanOnPush=true \
    --encryption-configuration encryptionType=AES256

# Enable lifecycle policy to keep only the last 10 images
aws ecr put-lifecycle-policy \
    --repository-name "$REPO" \
    --lifecycle-policy-text '{
      "rules": [{
        "rulePriority": 1,
        "description": "Keep last 10 images",
        "selection": {
          "tagStatus": "any",
          "countType": "imageCountMoreThan",
          "countNumber": 10
        },
        "action": {"type": "expire"}
      }]
    }'

# ── Authenticate Docker to ECR ──
aws ecr get-login-password --region "$REGION" | \
    docker login --username AWS --password-stdin "$ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com"

# ── Build, tag and push ──
# Dockerfile (simple Node.js app)
cat > Dockerfile << 'EOF'
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server.js"]
EOF

docker build -t "$REPO:latest" .
docker tag "$REPO:latest" "$IMAGE_URI:latest"
docker tag "$REPO:latest" "$IMAGE_URI:$(git rev-parse --short HEAD)"

docker push "$IMAGE_URI:latest"
docker push "$IMAGE_URI:$(git rev-parse --short HEAD)"

# Check scan results
aws ecr describe-image-scan-findings \
    --repository-name "$REPO" \
    --image-id imageTag=latest \
    --query 'imageScanFindings.findingSeverityCounts'`,
        },
      ],
    },
    {
      title: {
        en: "Task definitions, services & ALB integration",
        np: "Task definition, service र ALB integration",
        jp: "タスク定義・サービス・ALB 統合",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Create a Fargate task definition and ECS service behind an ALB",
            np: "ALB पछाडि Fargate task definition र ECS service create गर्नुहोस्",
            jp: "ALB の背後に Fargate タスク定義と ECS サービスを作成する",
          },
          code: `# ── Task Definition (Fargate) ──
aws ecs register-task-definition \
    --family my-app \
    --requires-compatibilities FARGATE \
    --network-mode awsvpc \
    --cpu 256 \
    --memory 512 \
    --execution-role-arn arn:aws:iam::$ACCOUNT_ID:role/ecsTaskExecutionRole \
    --task-role-arn arn:aws:iam::$ACCOUNT_ID:role/my-app-task-role \
    --container-definitions '[{
      "name": "my-app",
      "image": "'"$IMAGE_URI"':latest",
      "portMappings": [{"containerPort": 3000, "protocol": "tcp"}],
      "environment": [
        {"name": "NODE_ENV", "value": "production"},
        {"name": "PORT", "value": "3000"}
      ],
      "secrets": [
        {"name": "DB_PASSWORD", "valueFrom": "arn:aws:secretsmanager:us-east-1:'"$ACCOUNT_ID"':secret:prod/db-pass"}
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/my-app",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "my-app",
          "awslogs-create-group": "true"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 10
      },
      "essential": true
    }]'

# ── Create ALB target group for ECS (IP target type — required for Fargate) ──
TG_ARN=$(aws elbv2 create-target-group \
    --name my-app-tg \
    --protocol HTTP \
    --port 3000 \
    --vpc-id "$VPC_ID" \
    --target-type ip \
    --health-check-path /health \
    --health-check-interval-seconds 15 \
    --healthy-threshold-count 2 \
    --query 'TargetGroups[0].TargetGroupArn' --output text)

# ── Create the ECS Service ──
aws ecs create-service \
    --cluster prod-cluster \
    --service-name my-app \
    --task-definition my-app \
    --desired-count 2 \
    --launch-type FARGATE \
    --platform-version LATEST \
    --network-configuration "awsvpcConfiguration={
      subnets=[subnet-priv-1a,subnet-priv-1b],
      securityGroups=[$APP_SG],
      assignPublicIp=DISABLED
    }" \
    --load-balancers "targetGroupArn=$TG_ARN,containerName=my-app,containerPort=3000" \
    --deployment-configuration '{
      "deploymentCircuitBreaker": {"enable": true, "rollback": true},
      "maximumPercent": 200,
      "minimumHealthyPercent": 50
    }' \
    --enable-execute-command

# ── Rolling deploy: update service to new image tag ──
aws ecs update-service \
    --cluster prod-cluster \
    --service my-app \
    --force-new-deployment

# Watch the deployment
aws ecs describe-services \
    --cluster prod-cluster \
    --services my-app \
    --query 'services[0].deployments[*].{Status:status,Desired:desiredCount,Running:runningCount,Pending:pendingCount}'

# Shell into a running container (requires --enable-execute-command and SSM agent in image)
aws ecs execute-command \
    --cluster prod-cluster \
    --task TASK_ID \
    --container my-app \
    --command "/bin/sh" \
    --interactive`,
        },
      ],
    },
    {
      title: {
        en: "ECS Auto Scaling & hands-on",
        np: "ECS Auto Scaling र hands-on",
        jp: "ECS オートスケーリングとハンズオン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "ECS Service Auto Scaling uses Application Auto Scaling (not EC2 ASG). You register the service as a scalable target, then add scaling policies. Target Tracking is the easiest: scale out/in to keep average CPU or memory utilization at a target value, or use ALB RequestCountPerTarget. Step Scaling gives you finer control. For Fargate, scaling is instant (no EC2 boot time). Set minimum capacity ≥ 2 for high availability across AZs.",
            np: "ECS Service Auto Scaling ले Application Auto Scaling (EC2 ASG होइन) प्रयोग गर्छ। Service लाई scalable target को रूपमा register गर्नुहोस्, त्यसपछि scaling policy थप्नुहोस्। Target Tracking सबैभन्दा सजिलो छ: average CPU वा memory utilization target value मा राख्न scale out/in गर्नुहोस्, वा ALB RequestCountPerTarget प्रयोग गर्नुहोस्। Step Scaling ले तपाईंलाई finer control दिन्छ। Fargate को लागि, scaling instant हुन्छ (EC2 boot time छैन)। AZ across high availability को लागि minimum capacity ≥ 2 set गर्नुहोस्।",
            jp: "ECS サービスオートスケーリングは Application Auto Scaling（EC2 ASG ではなく）を使用します。サービスをスケーラブルターゲットとして登録し、スケーリングポリシーを追加します。ターゲットトラッキングが最も簡単です：平均 CPU またはメモリ使用率をターゲット値に維持するためにスケールアウト/インするか、ALB RequestCountPerTarget を使用します。ステップスケーリングはより細かい制御を提供します。Fargate の場合、スケーリングは即時です（EC2 の起動時間なし）。AZ をまたいだ高可用性のために最小キャパシティを ≥ 2 に設定します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Register ECS service for auto scaling and add target tracking policy",
            np: "Auto scaling को लागि ECS service register गर्नुहोस् र target tracking policy थप्नुहोस्",
            jp: "自動スケーリング用の ECS サービス登録とターゲットトラッキングポリシーの追加",
          },
          code: `# ── Register the ECS service as a scalable target ──
aws application-autoscaling register-scalable-target \
    --service-namespace ecs \
    --resource-id service/prod-cluster/my-app \
    --scalable-dimension ecs:service:DesiredCount \
    --min-capacity 2 \
    --max-capacity 20

# ── Target tracking: keep CPU at 50% ──
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --resource-id service/prod-cluster/my-app \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-name cpu-target-tracking \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
      "PredefinedMetricSpecification": {
        "PredefinedMetricType": "ECSServiceAverageCPUUtilization"
      },
      "TargetValue": 50.0,
      "ScaleInCooldown": 300,
      "ScaleOutCooldown": 60
    }'

# ── Target tracking: scale on ALB request count per target ──
aws application-autoscaling put-scaling-policy \
    --service-namespace ecs \
    --resource-id service/prod-cluster/my-app \
    --scalable-dimension ecs:service:DesiredCount \
    --policy-name request-count-tracking \
    --policy-type TargetTrackingScaling \
    --target-tracking-scaling-policy-configuration '{
      "PredefinedMetricSpecification": {
        "PredefinedMetricType": "ALBRequestCountPerTarget",
        "ResourceLabel": "app/prod-alb/abc123/targetgroup/my-app-tg/def456"
      },
      "TargetValue": 1000.0,
      "ScaleInCooldown": 300,
      "ScaleOutCooldown": 30
    }'

# ── CI/CD deploy script: build → push → force new deployment ──
#!/bin/bash
set -euo pipefail
COMMIT=$(git rev-parse --short HEAD)

aws ecr get-login-password --region us-east-1 | \
    docker login --username AWS --password-stdin "$IMAGE_URI"

docker build -t "$IMAGE_URI:$COMMIT" -t "$IMAGE_URI:latest" .
docker push "$IMAGE_URI:$COMMIT"
docker push "$IMAGE_URI:latest"

# Update task definition to use the new image tag
NEW_TD=$(aws ecs describe-task-definition --task-definition my-app \
    --query taskDefinition | \
    jq --arg img "$IMAGE_URI:$COMMIT" \
      '.containerDefinitions[0].image = $img | del(.taskDefinitionArn,.revision,.status,.requiresAttributes,.compatibilities,.registeredAt,.registeredBy)')

aws ecs register-task-definition --cli-input-json "$NEW_TD"

aws ecs update-service \
    --cluster prod-cluster \
    --service my-app \
    --task-definition my-app \
    --force-new-deployment`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create an ECR repository. Write a minimal Dockerfile (FROM nginx:alpine, copy a custom index.html, EXPOSE 80). Build, tag and push the image to ECR using `aws ecr get-login-password | docker login` and `docker push`.",
              np: "ECR repository create गर्नुहोस्। Minimal Dockerfile लेख्नुहोस् (FROM nginx:alpine, custom index.html copy, EXPOSE 80)। `aws ecr get-login-password | docker login` र `docker push` प्रयोग गरी image build, tag र ECR मा push गर्नुहोस्।",
              jp: "ECR リポジトリを作成する。最小限の Dockerfile を書く（FROM nginx:alpine、カスタム index.html のコピー、EXPOSE 80）。`aws ecr get-login-password | docker login` と `docker push` を使ってイメージをビルド・タグ付け・ECR にプッシュする。",
            },
            {
              en: "Create an ECS Fargate cluster (`aws ecs create-cluster --cluster-name lab-cluster --capacity-providers FARGATE`). Register a task definition using the image URI from ECR. Map container port 80.",
              np: "`aws ecs create-cluster --cluster-name lab-cluster --capacity-providers FARGATE` ECS Fargate cluster create गर्नुहोस्। ECR बाट image URI प्रयोग गरी task definition register गर्नुहोस्। Container port 80 map गर्नुहोस्।",
              jp: "`aws ecs create-cluster --cluster-name lab-cluster --capacity-providers FARGATE` で ECS Fargate クラスターを作成する。ECR のイメージ URI を使用してタスク定義を登録する。コンテナポート 80 をマッピングする。",
            },
            {
              en: "Create an ECS Service with desired-count 2, attached to an ALB target group (target type `ip`). Confirm both tasks reach RUNNING state and the ALB health check shows both targets healthy.",
              np: "Desired-count 2 र ALB target group (target type `ip`) attach गरिएको ECS Service create गर्नुहोस्। दुवै task RUNNING state मा पुगेको र ALB health check ले दुवै target healthy देखाएको confirm गर्नुहोस्।",
              jp: "desired-count 2 で ALB ターゲットグループ（ターゲットタイプ `ip`）にアタッチした ECS サービスを作成する。両方のタスクが RUNNING 状態になり、ALB ヘルスチェックが両方のターゲットを正常と表示することを確認する。",
            },
            {
              en: "Update the Dockerfile (e.g., change the index.html text), rebuild and push a new image tag, then trigger a rolling deploy with `aws ecs update-service --force-new-deployment`. Watch the deployment replace tasks one by one.",
              np: "Dockerfile update गर्नुहोस् (जस्तै index.html text बदल्नुहोस्), नयाँ image tag rebuild र push गर्नुहोस्, त्यसपछि `aws ecs update-service --force-new-deployment` सँग rolling deploy trigger गर्नुहोस्। Deployment ले task एक-एक गरी replace गर्छ हेर्नुहोस्।",
              jp: "Dockerfile を更新し（例：index.html のテキストを変更）、新しいイメージタグをリビルドしてプッシュし、`aws ecs update-service --force-new-deployment` でローリングデプロイをトリガーする。デプロイがタスクを 1 つずつ置き換えるのを監視する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the ecsTaskExecutionRole and why does my task fail without it?",
        np: "ecsTaskExecutionRole के हो र यो बिना मेरो task किन fail हुन्छ?",
        jp: "ecsTaskExecutionRole とは何か、なぜそれなしでタスクが失敗するのか？",
      },
      answer: {
        en: "The task execution role is assumed by the ECS agent (not your code) to pull the image from ECR, write logs to CloudWatch, and fetch secrets from Secrets Manager. Without it, the agent cannot pull the container image and the task fails with an auth error. The standard policy is `AmazonECSTaskExecutionRolePolicy`. Add additional inline policies if your task needs to fetch secrets (`secretsmanager:GetSecretValue`) or decrypt with KMS.",
        np: "Task execution role ECS agent (तपाईंको code होइन) द्वारा assume गरिन्छ — ECR बाट image pull गर्न, CloudWatch मा log write गर्न, र Secrets Manager बाट secret fetch गर्न। यो बिना, agent ले container image pull गर्न सक्दैन र task auth error सँग fail हुन्छ। Standard policy `AmazonECSTaskExecutionRolePolicy` हो। तपाईंको task लाई secret fetch (`secretsmanager:GetSecretValue`) वा KMS सँग decrypt गर्न आवश्यक छ भने additional inline policy थप्नुहोस्।",
        jp: "タスク実行ロールはコードではなく ECS エージェントによって引き受けられ、ECR からイメージをプル・CloudWatch にログを書き込み・Secrets Manager からシークレットを取得します。これがないとエージェントはコンテナイメージをプルできず、タスクは認証エラーで失敗します。標準ポリシーは `AmazonECSTaskExecutionRolePolicy` です。タスクがシークレットの取得（`secretsmanager:GetSecretValue`）や KMS での復号が必要な場合は追加のインラインポリシーを追加してください。",
      },
      tag: { en: "ecs", np: "ECS", jp: "ECS" },
    },
    {
      question: {
        en: "When should I use ECS over Lambda for containerized workloads?",
        np: "Containerized workload को लागि Lambda भन्दा ECS कहिले प्रयोग गर्ने?",
        jp: "コンテナ化されたワークロードで Lambda より ECS をいつ使うべきか？",
      },
      answer: {
        en: "Use ECS when: (1) your process runs longer than 15 minutes; (2) you need persistent TCP connections (WebSockets, gRPC streaming); (3) your image is larger than 10 GB; (4) you need more than 10 GB of memory or 6 vCPUs per task; (5) you have a long-running background worker pattern. Use Lambda when workloads are event-driven, short-lived, and you want zero idle cost.",
        np: "(1) तपाईंको process 15 मिनेट भन्दा लामो run हुन्छ; (2) persistent TCP connection (WebSocket, gRPC streaming) चाहिन्छ; (3) तपाईंको image 10 GB भन्दा ठूलो छ; (4) प्रति task 10 GB memory वा 6 vCPU भन्दा बढी चाहिन्छ; (5) long-running background worker pattern छ भने ECS प्रयोग गर्नुहोस्। Workload event-driven, short-lived छ र zero idle cost चाहिन्छ भने Lambda प्रयोग गर्नुहोस्।",
        jp: "(1) プロセスが 15 分以上実行される；(2) 永続的な TCP 接続が必要（WebSocket・gRPC ストリーミング）；(3) イメージが 10 GB より大きい；(4) タスクごとに 10 GB 以上のメモリまたは 6 vCPU 以上が必要；(5) 長時間実行するバックグラウンドワーカーパターンがある場合に ECS を使用してください。ワークロードがイベント駆動で短命、アイドルコストゼロが必要な場合は Lambda を使用します。",
      },
      tag: { en: "architecture", np: "Architecture", jp: "アーキテクチャ" },
    },
  ],
};
