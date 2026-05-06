import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "AWS Lambda is a serverless compute service — you upload code, define a trigger, and AWS runs it without you provisioning or managing any servers. You pay only for the time your code actually executes (billed in 1-ms increments). Lambda scales automatically from zero to thousands of concurrent executions and back to zero. This makes it ideal for event-driven workloads: image processing, API backends, scheduled jobs, and glue logic between AWS services.",
    np: "AWS Lambda एउटा serverless compute service हो — तपाईं code upload गर्नुहुन्छ, trigger define गर्नुहुन्छ, र AWS ले कुनै server provision वा manage नगरी run गर्छ। तपाईंले तपाईंको code actually execute गर्ने समयको मात्र भुक्तानी गर्नुहुन्छ (1-ms increment मा billed)। Lambda ले zero बाट हजारौं concurrent execution सम्म र फेरि zero मा automatically scale गर्छ। यसले यसलाई event-driven workload का लागि ideal बनाउँछ: image processing, API backend, scheduled job, र AWS service बीच glue logic।",
    jp: "AWS Lambda はサーバーレスコンピューティングサービスです — コードをアップロードしてトリガーを定義するだけで、AWS がサーバーをプロビジョニングまたは管理することなく実行します。コードが実際に実行された時間分だけ支払います（1 ミリ秒単位で課金）。Lambda はゼロから数千の同時実行まで自動的にスケールし、またゼロに戻ります。これにより、イベント駆動のワークロードに最適です：画像処理・API バックエンド・スケジュールジョブ・AWS サービス間のグルーロジック。",
  } as const,
  o2: {
    en: "Today you learn how Lambda executes your code (execution environments, cold starts, init phases), how to configure functions (memory, timeout, concurrency limits, layers, environment variables, IAM), the main event sources (API Gateway, S3, SQS, EventBridge, DynamoDB Streams), and how to deploy functions using the AWS CLI, SAM, and container images. Understanding cold starts and the execution environment lifecycle is critical for writing fast, predictable Lambda functions.",
    np: "आज तपाईंले Lambda ले code कसरी execute गर्छ (execution environment, cold start, init phase), function कसरी configure गर्ने (memory, timeout, concurrency limit, layer, environment variable, IAM), मुख्य event source (API Gateway, S3, SQS, EventBridge, DynamoDB Stream), र AWS CLI, SAM, र container image प्रयोग गरी function कसरी deploy गर्ने सिक्नुहुनेछ। Fast, predictable Lambda function लेख्न cold start र execution environment lifecycle बुझ्नु critical छ।",
    jp: "今日は Lambda がコードをどう実行するか（実行環境・コールドスタート・init フェーズ）・関数の設定方法（メモリ・タイムアウト・同時実行制限・レイヤー・環境変数・IAM）・主なイベントソース（API Gateway・S3・SQS・EventBridge・DynamoDB Streams）・AWS CLI・SAM・コンテナイメージを使った関数のデプロイ方法を学びます。高速で予測可能な Lambda 関数を書くには、コールドスタートと実行環境のライフサイクルを理解することが重要です。",
  } as const,
};

export const DEVOPS_DAY_37_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Lambda execution model — cold starts, warm starts & lifecycle",
        np: "Lambda execution model — cold start, warm start र lifecycle",
        jp: "Lambda 実行モデル — コールドスタート・ウォームスタート・ライフサイクル",
      },
      blocks: [
        { type: "diagram", id: "devops-lambda" },
        {
          type: "paragraph",
          text: {
            en: "Every Lambda invocation runs inside an execution environment — a micro-VM managed by AWS. On a cold start, Lambda creates a new environment: downloads your deployment package, initializes the runtime (Node.js/Python/Java/etc.), and runs your initialization code outside the handler. This takes 100ms–1s depending on runtime and package size. On a warm start, Lambda reuses the existing environment (handler only runs — init code is skipped). Execution environments are typically reused for minutes to hours. The /tmp directory (512 MB–10 GB) persists across warm invocations. Never store secrets in /tmp — use Secrets Manager or Parameter Store.",
            np: "हरेक Lambda invocation execution environment भित्र run हुन्छ — AWS द्वारा manage गरिएको micro-VM। Cold start मा, Lambda ले नयाँ environment create गर्छ: deployment package download गर्छ, runtime initialize गर्छ (Node.js/Python/Java/आदि), र handler बाहिर initialization code run गर्छ। Runtime र package size अनुसार यसमा 100ms–1s लाग्छ। Warm start मा, Lambda ले existing environment reuse गर्छ (handler मात्र run हुन्छ — init code skip हुन्छ)। Execution environment सामान्यतया मिनेटदेखि घण्टासम्म reuse हुन्छ। /tmp directory (512 MB–10 GB) warm invocation across persist गर्छ। /tmp मा secret store नगर्नुहोस् — Secrets Manager वा Parameter Store प्रयोग गर्नुहोस्।",
            jp: "すべての Lambda 呼び出しは実行環境内で実行されます — AWS が管理するマイクロ VM。コールドスタートでは、Lambda が新しい環境を作成します：デプロイパッケージをダウンロードし、ランタイム（Node.js/Python/Java など）を初期化し、ハンドラー外の初期化コードを実行します。ランタイムとパッケージサイズに応じて 100ms〜1s かかります。ウォームスタートでは、Lambda が既存の環境を再利用します（ハンドラーのみ実行 — init コードはスキップ）。実行環境は通常、数分から数時間再利用されます。/tmp ディレクトリ（512 MB〜10 GB）はウォーム呼び出し間で保持されます。/tmp にシークレットを保存しない — Secrets Manager または Parameter Store を使用。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Cold start vs warm start — what runs, latency, and how to minimize cold start impact",
            np: "Cold start vs warm start — के run हुन्छ, latency, र cold start impact कसरी minimize गर्ने",
            jp: "コールドスタートとウォームスタートの比較 — 実行内容・レイテンシー・コールドスタートの影響を最小化する方法",
          },
          headers: [
            { en: "Phase", np: "Phase", jp: "フェーズ" },
            { en: "Cold Start", np: "Cold Start", jp: "コールドスタート" },
            { en: "Warm Start", np: "Warm Start", jp: "ウォームスタート" },
          ],
          rows: [
            [
              { en: "Environment provisioning", np: "Environment provisioning", jp: "環境プロビジョニング" },
              { en: "Happens — AWS creates a new micro-VM (~50–200ms)", np: "हुन्छ — AWS ले नयाँ micro-VM create गर्छ (~50–200ms)", jp: "発生 — AWS が新しいマイクロ VM を作成（〜50〜200ms）" },
              { en: "Skipped — existing environment reused", np: "Skip — existing environment reuse", jp: "スキップ — 既存環境を再利用" },
            ],
            [
              { en: "Runtime init (Node.js/Python/Java)", np: "Runtime init (Node.js/Python/Java)", jp: "ランタイム初期化（Node.js/Python/Java）" },
              { en: "Happens — JVM/V8 startup adds 200ms–1s (Java worst)", np: "हुन्छ — JVM/V8 startup ले 200ms–1s थप्छ (Java सबैभन्दा खराब)", jp: "発生 — JVM/V8 起動が 200ms〜1s 追加（Java が最悪）" },
              { en: "Skipped", np: "Skip", jp: "スキップ" },
            ],
            [
              { en: "Your init code (imports, DB connections)", np: "तपाईंको init code (import, DB connection)", jp: "初期化コード（インポート・DB 接続）" },
              { en: "Runs — keep it fast; initialize connections here once", np: "Run हुन्छ — यसलाई fast राख्नुहोस्; connection यहाँ एकपटक initialize गर्नुहोस्", jp: "実行 — 高速に保つ；接続はここで一度初期化する" },
              { en: "Skipped — reuses initialized state", np: "Skip — initialized state reuse", jp: "スキップ — 初期化済み状態を再利用" },
            ],
            [
              { en: "Handler execution", np: "Handler execution", jp: "ハンドラー実行" },
              { en: "Runs — your business logic", np: "Run — तपाईंको business logic", jp: "実行 — ビジネスロジック" },
              { en: "Runs — your business logic", np: "Run — तपाईंको business logic", jp: "実行 — ビジネスロジック" },
            ],
            [
              { en: "Total latency impact", np: "Total latency impact", jp: "合計レイテンシー影響" },
              { en: "Add ~100ms (Python/Node) to ~1s (Java/dotnet)", np: "~100ms (Python/Node) देखि ~1s (Java/dotnet) थप्नुहोस्", jp: "〜100ms（Python/Node）〜〜1s（Java/dotnet）追加" },
              { en: "Near zero — only your handler time", np: "Near zero — तपाईंको handler time मात्र", jp: "ほぼゼロ — ハンドラー時間のみ" },
            ],
            [
              { en: "Mitigation", np: "Mitigation", jp: "軽減策" },
              { en: "Provisioned Concurrency, smaller packages, SnapStart (Java)", np: "Provisioned Concurrency, smaller package, SnapStart (Java)", jp: "プロビジョニング済み同時実行数・小さいパッケージ・SnapStart（Java）" },
              { en: "N/A — keep functions warm with regular traffic", np: "N/A — regular traffic सँग function warm राख्नुहोस्", jp: "N/A — 定期的なトラフィックで関数をウォームに保つ" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Function configuration — memory, timeout, concurrency & layers",
        np: "Function configuration — memory, timeout, concurrency र layer",
        jp: "関数の設定 — メモリ・タイムアウト・同時実行数・レイヤー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Memory (128 MB–10 GB) is the primary knob: CPU is allocated proportionally (1 vCPU at 1,769 MB). More memory = faster execution for CPU-bound tasks, often cheaper overall because the function finishes sooner. Timeout (max 15 min): set it to the minimum you can. Concurrency: by default Lambda scales to the regional account limit (1,000–10,000). Use Reserved Concurrency to cap a function (prevents it from consuming all concurrency) and Provisioned Concurrency to pre-warm environments (eliminates cold starts for latency-sensitive APIs). Layers package shared dependencies (up to 5 layers, 250 MB unzipped total) — functions reference them by ARN so you don't repeat the same dependency in every package.",
            np: "Memory (128 MB–10 GB) primary knob हो: CPU proportionally allocate गरिन्छ (1,769 MB मा 1 vCPU)। बढी memory = CPU-bound task का लागि छिटो execution, प्रायः function छिटो सकिन्छ त्यसैले overall सस्तो हुन्छ। Timeout (max 15 min): सकेसम्म minimum मा set गर्नुहोस्। Concurrency: default मा Lambda regional account limit (1,000–10,000) सम्म scale गर्छ। Function cap गर्न (सबै concurrency consume गर्नबाट रोक्न) Reserved Concurrency र latency-sensitive API का लागि cold start eliminate गर्न (environment pre-warm गर्न) Provisioned Concurrency प्रयोग गर्नुहोस्। Layer ले shared dependency package गर्छ (maximum 5 layer, 250 MB unzipped total) — function ले ARN द्वारा reference गर्छ त्यसैले हरेक package मा same dependency repeat गर्नु पर्दैन।",
            jp: "メモリ（128 MB〜10 GB）が主要なノブです：CPU は比例的に割り当てられます（1,769 MB で 1 vCPU）。より多くのメモリ = CPU バウンドタスクで高速実行、関数がより早く終わるため全体的に安くなることが多い。タイムアウト（最大 15 分）：できる限り最小値に設定。同時実行数：デフォルトでは Lambda はリージョンのアカウント制限（1,000〜10,000）までスケール。Reserved Concurrency で関数を上限設定（すべての同時実行数を消費しないように）し、Provisioned Concurrency で環境をウォームアップ（レイテンシーに敏感な API のコールドスタートを排除）。レイヤーは共有依存関係をパッケージ化（最大 5 レイヤー、合計 250 MB 解凍済み）— 関数は ARN で参照するので、すべてのパッケージで同じ依存関係を繰り返す必要がありません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create, configure and update a Lambda function",
            np: "Lambda function create, configure र update गर्नुहोस्",
            jp: "Lambda 関数の作成・設定・更新",
          },
          code: `# ── Write a minimal Python handler ──
mkdir -p lambda-hello && cat > lambda-hello/handler.py << 'EOF'
import json, os, boto3

# Init code runs ONCE per execution environment (cold start only)
ssm = boto3.client('ssm')
DB_URL = ssm.get_parameter(Name='/myapp/prod/db-url', WithDecryption=True)['Parameter']['Value']

def lambda_handler(event, context):
    print(f"Event: {json.dumps(event)}")
    return {
        'statusCode': 200,
        'headers': {'Content-Type': 'application/json'},
        'body': json.dumps({'message': 'hello', 'env': os.environ.get('STAGE', 'dev')})
    }
EOF

# ── Package and deploy ──
cd lambda-hello && zip -r ../function.zip handler.py && cd ..

# Create the function (replace ACCOUNT_ID with your account)
aws lambda create-function \
    --function-name hello-api \
    --runtime python3.12 \
    --role arn:aws:iam::ACCOUNT_ID:role/LambdaExecRole \
    --handler handler.lambda_handler \
    --zip-file fileb://function.zip \
    --timeout 10 \
    --memory-size 256 \
    --environment Variables="{STAGE=prod}" \
    --description "Hello API handler"

# Update function code (after code changes)
aws lambda update-function-code \
    --function-name hello-api \
    --zip-file fileb://function.zip

# Publish a versioned immutable snapshot (good for aliases/canary deploys)
aws lambda publish-version \
    --function-name hello-api \
    --description "v2 — use SSM for DB_URL"

# Create/update the 'prod' alias pointing at version 2
aws lambda create-alias \
    --function-name hello-api \
    --name prod \
    --function-version 2

# ── Concurrency controls ──
# Reserve 100 concurrent executions for this function
aws lambda put-function-concurrency \
    --function-name hello-api \
    --reserved-concurrent-executions 100

# Pre-warm 10 environments (no cold starts — costs ~$0.015/hr per environment)
aws lambda put-provisioned-concurrency-config \
    --function-name hello-api \
    --qualifier prod \
    --provisioned-concurrent-executions 10

# ── Invoke synchronously for testing ──
aws lambda invoke \
    --function-name hello-api \
    --payload '{"path":"/","httpMethod":"GET"}' \
    --cli-binary-format raw-in-base64-out \
    response.json && cat response.json`,
        },
      ],
    },
    {
      title: {
        en: "Event sources — triggers that invoke Lambda",
        np: "Event source — Lambda invoke गर्ने trigger",
        jp: "イベントソース — Lambda を呼び出すトリガー",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Lambda integrates with dozens of AWS services. Two invocation models: Synchronous (caller waits for response — API Gateway, ALB, SDK direct calls) and Asynchronous (Lambda queues the event and returns immediately — S3, SNS, EventBridge; retries up to 2 times on failure; configure a Dead Letter Queue to capture failed events). Poll-based sources (SQS, DynamoDB Streams, Kinesis) use an Event Source Mapping — Lambda polls the source on your behalf and batches records into a single invocation.",
            np: "Lambda ले दर्जनौं AWS service सँग integrate गर्छ। दुई invocation model: Synchronous (caller ले response पर्खन्छ — API Gateway, ALB, SDK direct call) र Asynchronous (Lambda ले event queue गर्छ र immediately return गर्छ — S3, SNS, EventBridge; failure मा 2 पटकसम्म retry; failed event capture गर्न Dead Letter Queue configure गर्नुहोस्)। Poll-based source (SQS, DynamoDB Stream, Kinesis) ले Event Source Mapping प्रयोग गर्छ — Lambda ले तपाईंको तर्फबाट source poll गर्छ र record लाई single invocation मा batch गर्छ।",
            jp: "Lambda は数十の AWS サービスと統合します。2 つの呼び出しモデル：同期（呼び出し元が応答を待つ — API Gateway・ALB・SDK 直接呼び出し）と非同期（Lambda がイベントをキューイングしてすぐに返す — S3・SNS・EventBridge；失敗時に最大 2 回リトライ；失敗したイベントをキャプチャするデッドレターキューを設定）。ポールベースのソース（SQS・DynamoDB Streams・Kinesis）はイベントソースマッピングを使用 — Lambda が代わりにソースをポーリングしてレコードを 1 つの呼び出しにバッチ処理します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Common Lambda event sources — invocation model, typical use, and key config",
            np: "Common Lambda event source — invocation model, typical use, र key config",
            jp: "一般的な Lambda イベントソース — 呼び出しモデル・典型的な用途・主要設定",
          },
          headers: [
            { en: "Event Source", np: "Event Source", jp: "イベントソース" },
            { en: "Invocation Model", np: "Invocation Model", jp: "呼び出しモデル" },
            { en: "Typical Use", np: "Typical Use", jp: "典型的な用途" },
            { en: "Key Config", np: "Key Config", jp: "主要設定" },
          ],
          rows: [
            [
              { en: "API Gateway / ALB", np: "API Gateway / ALB", jp: "API Gateway / ALB" },
              { en: "Synchronous", np: "Synchronous", jp: "同期" },
              { en: "HTTP API / REST backend", np: "HTTP API / REST backend", jp: "HTTP API / REST バックエンド" },
              { en: "Payload format version, timeout (29s max for API GW)", np: "Payload format version, timeout (API GW को लागि 29s max)", jp: "ペイロードフォーマットバージョン・タイムアウト（API GW 最大 29 秒）" },
            ],
            [
              { en: "S3", np: "S3", jp: "S3" },
              { en: "Asynchronous", np: "Asynchronous", jp: "非同期" },
              { en: "Image resize, file ETL, virus scan on upload", np: "Image resize, file ETL, upload मा virus scan", jp: "画像リサイズ・ファイル ETL・アップロード時ウイルススキャン" },
              { en: "Event type filter (s3:ObjectCreated:*), prefix/suffix filter", np: "Event type filter (s3:ObjectCreated:*), prefix/suffix filter", jp: "イベントタイプフィルタ（s3:ObjectCreated:*）・プレフィックス/サフィックスフィルタ" },
            ],
            [
              { en: "SQS", np: "SQS", jp: "SQS" },
              { en: "Poll-based (Event Source Mapping)", np: "Poll-based (Event Source Mapping)", jp: "ポールベース（イベントソースマッピング）" },
              { en: "Reliable async job processing, decouple services", np: "Reliable async job processing, service decouple", jp: "信頼性の高い非同期ジョブ処理・サービスの疎結合" },
              { en: "Batch size (1–10,000), batch window, max concurrency, DLQ on SQS side", np: "Batch size (1–10,000), batch window, max concurrency, SQS side मा DLQ", jp: "バッチサイズ（1〜10,000）・バッチウィンドウ・最大同時実行数・SQS 側の DLQ" },
            ],
            [
              { en: "EventBridge (scheduled)", np: "EventBridge (scheduled)", jp: "EventBridge（スケジュール）" },
              { en: "Asynchronous", np: "Asynchronous", jp: "非同期" },
              { en: "Cron jobs — nightly reports, cache warm-up, data sync", np: "Cron job — nightly report, cache warm-up, data sync", jp: "Cron ジョブ — 夜間レポート・キャッシュウォームアップ・データ同期" },
              { en: "Cron expression or rate (rate(5 minutes))", np: "Cron expression वा rate (rate(5 minutes))", jp: "Cron 式またはレート（rate(5 minutes)）" },
            ],
            [
              { en: "DynamoDB Streams", np: "DynamoDB Stream", jp: "DynamoDB Streams" },
              { en: "Poll-based (Event Source Mapping)", np: "Poll-based (Event Source Mapping)", jp: "ポールベース（イベントソースマッピング）" },
              { en: "Change data capture, cache invalidation, cross-region replication", np: "Change data capture, cache invalidation, cross-region replication", jp: "変更データキャプチャ・キャッシュ無効化・クロスリージョンレプリケーション" },
              { en: "Starting position (TRIM_HORIZON / LATEST), batch size, bisect on error", np: "Starting position (TRIM_HORIZON / LATEST), batch size, bisect on error", jp: "開始位置（TRIM_HORIZON / LATEST）・バッチサイズ・エラー時の二分割" },
            ],
            [
              { en: "SNS", np: "SNS", jp: "SNS" },
              { en: "Asynchronous", np: "Asynchronous", jp: "非同期" },
              { en: "Fan-out pattern: one SNS publish → multiple Lambda functions", np: "Fan-out pattern: एउटा SNS publish → multiple Lambda function", jp: "ファンアウトパターン：1 SNS パブリッシュ → 複数の Lambda 関数" },
              { en: "Filter policy on SNS subscription to route message subsets", np: "Message subset route गर्न SNS subscription मा filter policy", jp: "メッセージサブセットをルーティングするための SNS サブスクリプションのフィルターポリシー" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Wire an S3 trigger, SQS event source mapping, and EventBridge schedule",
            np: "S3 trigger, SQS event source mapping, र EventBridge schedule wire गर्नुहोस्",
            jp: "S3 トリガー・SQS イベントソースマッピング・EventBridge スケジュールの接続",
          },
          code: `# ── S3 trigger — invoke Lambda on every new .jpg upload ──
# First allow S3 to invoke the function
aws lambda add-permission \
    --function-name image-resizer \
    --statement-id s3-trigger \
    --action lambda:InvokeFunction \
    --principal s3.amazonaws.com \
    --source-arn arn:aws:s3:::my-uploads-bucket \
    --source-account "$(aws sts get-caller-identity --query Account --output text)"

# Add the bucket notification
aws s3api put-bucket-notification-configuration \
    --bucket my-uploads-bucket \
    --notification-configuration '{
      "LambdaFunctionConfigurations": [{
        "LambdaFunctionArn": "arn:aws:lambda:us-east-1:ACCOUNT_ID:function:image-resizer",
        "Events": ["s3:ObjectCreated:*"],
        "Filter": {
          "Key": {
            "FilterRules": [
              {"Name": "suffix", "Value": ".jpg"}
            ]
          }
        }
      }]
    }'

# ── SQS event source mapping — Lambda polls the queue ──
aws lambda create-event-source-mapping \
    --function-name order-processor \
    --event-source-arn arn:aws:sqs:us-east-1:ACCOUNT_ID:orders-queue \
    --batch-size 10 \
    --maximum-batching-window-in-seconds 5 \
    --function-response-types ReportBatchItemFailures

# ReportBatchItemFailures: function returns which items failed so only those go back to queue
# Handler returns: {"batchItemFailures": [{"itemIdentifier": "messageId1"}]}

# ── EventBridge rule — run nightly-report at 02:00 UTC every day ──
aws events put-rule \
    --name nightly-report \
    --schedule-expression "cron(0 2 * * ? *)" \
    --state ENABLED

aws lambda add-permission \
    --function-name nightly-report \
    --statement-id eventbridge-trigger \
    --action lambda:InvokeFunction \
    --principal events.amazonaws.com \
    --source-arn arn:aws:events:us-east-1:ACCOUNT_ID:rule/nightly-report

aws events put-targets \
    --rule nightly-report \
    --targets '[{
      "Id": "1",
      "Arn": "arn:aws:lambda:us-east-1:ACCOUNT_ID:function:nightly-report",
      "Input": "{\"reportType\":\"daily\"}"
    }]'`,
        },
      ],
    },
    {
      title: {
        en: "Deployment — ZIP, container images & AWS SAM",
        np: "Deployment — ZIP, container image र AWS SAM",
        jp: "デプロイ — ZIP・コンテナイメージ・AWS SAM",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Lambda supports three deployment artifact types: (1) ZIP up to 50 MB direct / 250 MB via S3 — good for most use cases; (2) Container images up to 10 GB from ECR — use when you need a custom runtime, large ML models, or want the same Docker workflow as your other services; (3) Layers — ZIP containing shared libraries referenced by ARN. AWS SAM (Serverless Application Model) is a CloudFormation extension that makes defining Lambda functions, API Gateway routes, and SQS triggers much less verbose. The `sam build && sam deploy` workflow is the standard for production Lambda.",
            np: "Lambda ले तीन deployment artifact type support गर्छ: (1) ZIP direct मा 50 MB / S3 मार्फत 250 MB — धेरैजसो use case का लागि राम्रो; (2) ECR बाट Container image 10 GB सम्म — custom runtime, large ML model चाहिँदा, वा तपाईंका अन्य service जस्तै Docker workflow चाहिँदा प्रयोग गर्नुहोस्; (3) Layer — ARN द्वारा reference गरिएको shared library भएको ZIP। AWS SAM (Serverless Application Model) CloudFormation extension हो जसले Lambda function, API Gateway route, र SQS trigger define गर्न धेरै less verbose बनाउँछ। `sam build && sam deploy` workflow production Lambda को standard हो।",
            jp: "Lambda は 3 種類のデプロイアーティファクトをサポートします：(1) ZIP 直接 50 MB / S3 経由 250 MB — ほとんどのユースケースに適している；(2) ECR からのコンテナイメージ最大 10 GB — カスタムランタイム・大きな ML モデルが必要な場合、または他のサービスと同じ Docker ワークフローが必要な場合；(3) レイヤー — ARN で参照される共有ライブラリを含む ZIP。AWS SAM（Serverless Application Model）は CloudFormation 拡張で、Lambda 関数・API Gateway ルート・SQS トリガーの定義をはるかに簡潔にします。`sam build && sam deploy` ワークフローが本番 Lambda の標準です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Define a SAM template and deploy a serverless API",
            np: "SAM template define गर्नुहोस् र serverless API deploy गर्नुहोस्",
            jp: "SAM テンプレートの定義とサーバーレス API のデプロイ",
          },
          code: `# ── template.yaml (AWS SAM) ──
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Runtime: python3.12
    MemorySize: 256
    Timeout: 10
    Environment:
      Variables:
        STAGE: !Ref Stage
    Layers:
      - !Ref DepsLayer

Parameters:
  Stage:
    Type: String
    Default: prod

Resources:
  # Shared dependency layer (boto3 extras, etc.)
  DepsLayer:
    Type: AWS::Serverless::LayerVersion
    Properties:
      ContentUri: layers/deps/
      CompatibleRuntimes: [python3.12]
    Metadata:
      BuildMethod: python3.12

  # HTTP API function (API Gateway HTTP API v2)
  HelloFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/hello/
      Handler: handler.lambda_handler
      Events:
        GetHello:
          Type: HttpApi
          Properties:
            Path: /hello
            Method: GET
        PostHello:
          Type: HttpApi
          Properties:
            Path: /hello
            Method: POST

  # SQS-triggered processor with DLQ
  OrderProcessor:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: src/processor/
      Handler: handler.lambda_handler
      ReservedConcurrentExecutions: 50
      Events:
        OrdersQueue:
          Type: SQS
          Properties:
            Queue: !GetAtt OrdersQueue.Arn
            BatchSize: 10
            FunctionResponseTypes: [ReportBatchItemFailures]

  OrdersQueue:
    Type: AWS::SQS::Queue
    Properties:
      VisibilityTimeout: 60
      RedrivePolicy:
        deadLetterTargetArn: !GetAtt OrdersDLQ.Arn
        maxReceiveCount: 3

  OrdersDLQ:
    Type: AWS::SQS::Queue

Outputs:
  ApiUrl:
    Value: !Sub "https://\${ServerlessHttpApi}.execute-api.\${AWS::Region}.amazonaws.com"

# ── Build and deploy ──
# pip install aws-sam-cli
sam build
sam deploy \
    --stack-name my-serverless-app \
    --s3-bucket my-sam-artifacts \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides Stage=prod \
    --confirm-changeset

# Watch deploy progress
sam logs --name HelloFunction --stack-name my-serverless-app --tail

# Local testing (runs Lambda in a Docker container locally)
sam local invoke HelloFunction --event events/get-hello.json
sam local start-api --port 3000`,
        },
      ],
    },
    {
      title: {
        en: "IAM, environment variables & Secrets Manager",
        np: "IAM, environment variable र Secrets Manager",
        jp: "IAM・環境変数・Secrets Manager",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every Lambda function must have an execution role — an IAM role that AWS assumes when running your function. Grant least-privilege: only the permissions the function actually needs (S3 GetObject on a specific bucket, DynamoDB PutItem on a specific table). Environment variables are encrypted at rest with a KMS key (default service key or your own CMK). For sensitive values, retrieve them from AWS Secrets Manager or SSM Parameter Store at init time (not inside the handler — avoids an API call on every invocation). Cache the secret in a module-level variable so it is fetched once per execution environment.",
            np: "हरेक Lambda function मा execution role हुनुपर्छ — AWS ले तपाईंको function run गर्दा assume गर्ने IAM role। Least-privilege grant गर्नुहोस्: function लाई actually चाहिने permission मात्र (specific bucket मा S3 GetObject, specific table मा DynamoDB PutItem)। Environment variable rest मा KMS key सँग encrypt गरिन्छ (default service key वा तपाईंको आफ्नै CMK)। Sensitive value का लागि, init time मा AWS Secrets Manager वा SSM Parameter Store बाट retrieve गर्नुहोस् (handler भित्र होइन — हरेक invocation मा API call avoid गर्छ)। Secret execution environment प्रति एकपटक fetch हुन्छ ताकि module-level variable मा cache गर्नुहोस्।",
            jp: "すべての Lambda 関数には実行ロールが必要です — AWS が関数実行時に引き受ける IAM ロール。最小権限を付与：関数が実際に必要なアクセス許可のみ（特定のバケットへの S3 GetObject・特定のテーブルへの DynamoDB PutItem）。環境変数は KMS キー（デフォルトのサービスキーまたは独自の CMK）で保存時に暗号化されます。機密値については、AWS Secrets Manager または SSM Parameter Store から init 時に取得します（ハンドラー内ではなく — 呼び出しごとの API 呼び出しを回避）。シークレットを実行環境ごとに 1 回取得するようにモジュールレベル変数にキャッシュします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create an execution role, retrieve secrets at init time, and set function resource policy",
            np: "Execution role create गर्नुहोस्, init time मा secret retrieve गर्नुहोस्, र function resource policy set गर्नुहोस्",
            jp: "実行ロールの作成・init 時のシークレット取得・関数リソースポリシーの設定",
          },
          code: `# ── Create the execution role (trust policy for Lambda) ──
aws iam create-role \
    --role-name LambdaExecRole \
    --assume-role-policy-document '{
      "Version": "2012-10-17",
      "Statement": [{
        "Effect": "Allow",
        "Principal": {"Service": "lambda.amazonaws.com"},
        "Action": "sts:AssumeRole"
      }]
    }'

# Attach basic execution (CloudWatch Logs write access)
aws iam attach-role-policy \
    --role-name LambdaExecRole \
    --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Add least-privilege inline policy for this function's resources
aws iam put-role-policy \
    --role-name LambdaExecRole \
    --policy-name OrderProcessorPolicy \
    --policy-document '{
      "Version": "2012-10-17",
      "Statement": [
        {
          "Effect": "Allow",
          "Action": ["dynamodb:PutItem", "dynamodb:GetItem"],
          "Resource": "arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/Orders"
        },
        {
          "Effect": "Allow",
          "Action": ["secretsmanager:GetSecretValue"],
          "Resource": "arn:aws:secretsmanager:us-east-1:ACCOUNT_ID:secret:prod/db-creds*"
        },
        {
          "Effect": "Allow",
          "Action": ["sqs:ReceiveMessage", "sqs:DeleteMessage", "sqs:GetQueueAttributes"],
          "Resource": "arn:aws:sqs:us-east-1:ACCOUNT_ID:orders-queue"
        }
      ]
    }'

# ── Python handler — fetch secret ONCE at init time (not inside handler) ──
# handler.py
import json, os, boto3

# Module-level: runs once per execution environment (warm across invocations)
sm = boto3.client('secretsmanager')
secret = json.loads(
    sm.get_secret_value(SecretId='prod/db-creds')['SecretString']
)
DB_HOST = secret['host']
DB_PASS = secret['password']

def lambda_handler(event, context):
    # DB_HOST / DB_PASS are already fetched — no SM API call here
    records = event.get('Records', [])
    for record in records:
        body = json.loads(record['body'])
        process_order(body, DB_HOST, DB_PASS)
    return {'batchItemFailures': []}

# ── Update environment variables on an existing function ──
aws lambda update-function-configuration \
    --function-name order-processor \
    --environment Variables="{STAGE=prod,LOG_LEVEL=INFO}" \
    --timeout 30 \
    --memory-size 512`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a serverless image-processing pipeline",
        np: "Hands-on: serverless image-processing pipeline बनाउनुहोस्",
        jp: "ハンズオン：サーバーレス画像処理パイプラインを構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create two S3 buckets: `uploads-<your-id>` (source) and `thumbnails-<your-id>` (destination). Block all public access on both. Create an IAM execution role for Lambda with GetObject on the uploads bucket, PutObject on the thumbnails bucket, and AWSLambdaBasicExecutionRole.",
              np: "दुई S3 bucket create गर्नुहोस्: `uploads-<your-id>` (source) र `thumbnails-<your-id>` (destination)। दुवैमा सबै public access block गर्नुहोस्। Lambda को लागि IAM execution role create गर्नुहोस् — uploads bucket मा GetObject, thumbnails bucket मा PutObject, र AWSLambdaBasicExecutionRole।",
              jp: "2 つの S3 バケットを作成：`uploads-<your-id>`（ソース）と `thumbnails-<your-id>`（デスティネーション）。両方でパブリックアクセスをすべてブロック。Lambda 用の IAM 実行ロールを作成 — uploads バケットの GetObject・thumbnails バケットの PutObject・AWSLambdaBasicExecutionRole。",
            },
            {
              en: "Write a Python 3.12 Lambda handler (`handler.py`) that reads the uploaded image from `event['Records'][0]['s3']`, downloads it with `boto3.client('s3').get_object(...)`, resizes it to 128×128 using the Pillow library, and uploads the thumbnail to `thumbnails-<your-id>` with the same key.",
              np: "Python 3.12 Lambda handler (`handler.py`) लेख्नुहोस् जसले `event['Records'][0]['s3']` बाट uploaded image read गर्छ, `boto3.client('s3').get_object(...)` सँग download गर्छ, Pillow library प्रयोग गरी 128×128 मा resize गर्छ, र same key सँग `thumbnails-<your-id>` मा thumbnail upload गर्छ।",
              jp: "Python 3.12 Lambda ハンドラー（`handler.py`）を書く：`event['Records'][0]['s3']` からアップロードされた画像を読み取り、`boto3.client('s3').get_object(...)` でダウンロードし、Pillow ライブラリで 128×128 にリサイズし、同じキーで `thumbnails-<your-id>` にサムネイルをアップロードする。",
            },
            {
              en: "Package Pillow as a Lambda layer: `pip install Pillow -t python/ && zip -r pillow-layer.zip python/`. Publish the layer with `aws lambda publish-layer-version`. Create the Lambda function referencing the layer ARN.",
              np: "Pillow Lambda layer को रूपमा package गर्नुहोस्: `pip install Pillow -t python/ && zip -r pillow-layer.zip python/`। `aws lambda publish-layer-version` सँग layer publish गर्नुहोस्। Layer ARN reference गरी Lambda function create गर्नुहोस्।",
              jp: "Pillow を Lambda レイヤーとしてパッケージ化：`pip install Pillow -t python/ && zip -r pillow-layer.zip python/`。`aws lambda publish-layer-version` でレイヤーを公開。レイヤー ARN を参照して Lambda 関数を作成。",
            },
            {
              en: "Add the S3 trigger using `aws lambda add-permission` (to allow S3 to invoke) and `aws s3api put-bucket-notification-configuration` with event type `s3:ObjectCreated:*` filtered to `.jpg` suffix.",
              np: "`aws lambda add-permission` (S3 लाई invoke गर्न allow) र `.jpg` suffix filtered गरी event type `s3:ObjectCreated:*` सहित `aws s3api put-bucket-notification-configuration` प्रयोग गरी S3 trigger थप्नुहोस्।",
              jp: "`aws lambda add-permission`（S3 が呼び出せるように）と `.jpg` サフィックスでフィルタリングされたイベントタイプ `s3:ObjectCreated:*` の `aws s3api put-bucket-notification-configuration` を使って S3 トリガーを追加。",
            },
            {
              en: "Upload a JPEG test image to the uploads bucket with `aws s3 cp test.jpg s3://uploads-<your-id>/`. Wait a few seconds, then verify the thumbnail appears in the thumbnails bucket. Check the Lambda CloudWatch log stream for your print statements.",
              np: "`aws s3 cp test.jpg s3://uploads-<your-id>/` सँग uploads bucket मा JPEG test image upload गर्नुहोस्। केही second पर्खनुहोस्, त्यसपछि thumbnail thumbnails bucket मा देखिएको verify गर्नुहोस्। तपाईंका print statement को लागि Lambda CloudWatch log stream check गर्नुहोस्।",
              jp: "`aws s3 cp test.jpg s3://uploads-<your-id>/` で uploads バケットに JPEG テスト画像をアップロード。数秒待ってから、thumbnails バケットにサムネイルが表示されることを確認。print ステートメントの Lambda CloudWatch ログストリームを確認する。",
            },
            {
              en: "Create a CloudWatch alarm on the `Errors` metric for your function (threshold: > 0 errors in 1 evaluation period). Use `aws cloudwatch put-metric-alarm` with namespace `AWS/Lambda`, dimension `FunctionName=image-resizer`. Introduce a deliberate error (wrong bucket name) and confirm the alarm fires and you receive an SNS email.",
              np: "तपाईंको function को `Errors` metric मा CloudWatch alarm create गर्नुहोस् (threshold: 1 evaluation period मा > 0 error)। Namespace `AWS/Lambda`, dimension `FunctionName=image-resizer` सहित `aws cloudwatch put-metric-alarm` प्रयोग गर्नुहोस्। Deliberate error introduce गर्नुहोस् (गलत bucket name) र alarm fire भएको र SNS email प्राप्त भएको confirm गर्नुहोस्।",
              jp: "関数の `Errors` メトリクスに CloudWatch アラームを作成（しきい値：1 評価期間で > 0 エラー）。ネームスペース `AWS/Lambda`・ディメンション `FunctionName=image-resizer` で `aws cloudwatch put-metric-alarm` を使用。意図的なエラー（間違ったバケット名）を導入し、アラームが発火して SNS メールを受信することを確認する。",
            },
            {
              en: "Enable Provisioned Concurrency (1 environment) on your function using `aws lambda put-provisioned-concurrency-config`. Check the Lambda console — the init duration should drop to near-zero on the next invocation because the environment is already warm.",
              np: "`aws lambda put-provisioned-concurrency-config` प्रयोग गरी तपाईंको function मा Provisioned Concurrency (1 environment) enable गर्नुहोस्। Lambda console check गर्नुहोस् — environment already warm भएकोले अर्को invocation मा init duration near-zero मा drop हुनुपर्छ।",
              jp: "`aws lambda put-provisioned-concurrency-config` を使って関数の Provisioned Concurrency（1 環境）を有効化。Lambda コンソールを確認 — 環境がすでにウォームなので、次の呼び出しで init 時間がほぼゼロに低下するはずです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I avoid cold starts for a latency-sensitive API?",
        np: "Latency-sensitive API का लागि cold start कसरी avoid गर्ने?",
        jp: "レイテンシーに敏感な API でコールドスタートを回避するには？",
      },
      answer: {
        en: "Use Provisioned Concurrency on the function alias that handles production traffic. It pre-warms N execution environments so they are always ready to handle requests without any init phase. It costs roughly $0.015/hr per environment. For Java/.NET, also enable Lambda SnapStart (takes a snapshot of the initialized environment) which reduces cold start from ~1s to ~200ms without Provisioned Concurrency cost.",
        np: "Production traffic handle गर्ने function alias मा Provisioned Concurrency प्रयोग गर्नुहोस्। यसले N execution environment pre-warm गर्छ ताकि तिनीहरू कुनै init phase बिना request handle गर्न सधैं ready हुन्छन्। प्रति environment ~$0.015/hr cost लाग्छ। Java/.NET का लागि Lambda SnapStart पनि enable गर्नुहोस् (initialized environment को snapshot लिन्छ) जसले Provisioned Concurrency cost बिना cold start ~1s बाट ~200ms मा reduce गर्छ।",
        jp: "本番トラフィックを処理する関数エイリアスで Provisioned Concurrency を使用してください。N 個の実行環境をウォームアップするので、init フェーズなしにリクエストを処理できます。環境ごとに約 $0.015/時間かかります。Java/.NET の場合は Lambda SnapStart も有効化（初期化済み環境のスナップショットを取る）することで、Provisioned Concurrency のコストなしにコールドスタートを〜1s から〜200ms に削減できます。",
      },
      tag: { en: "cold-start", np: "Cold Start", jp: "コールドスタート" },
    },
    {
      question: {
        en: "What is the maximum Lambda timeout and when should I use Step Functions instead?",
        np: "Maximum Lambda timeout के हो र Step Functions कहिले प्रयोग गर्ने?",
        jp: "Lambda の最大タイムアウトはいくつで、Step Functions を使うべき状況は？",
      },
      answer: {
        en: "Lambda's maximum timeout is 15 minutes. If your workflow needs longer, or involves multiple steps, branching, retries, or human approval, use AWS Step Functions. Step Functions orchestrates a state machine where each state can call a Lambda function. It handles retries, error catching, parallel branches, and wait states (up to 1 year). Lambda is for single-function logic; Step Functions is for multi-step workflows.",
        np: "Lambda को maximum timeout 15 मिनेट हो। तपाईंको workflow लाई longer time चाहिन्छ, वा multiple step, branching, retry, वा human approval involve छ भने AWS Step Functions प्रयोग गर्नुहोस्। Step Functions ले state machine orchestrate गर्छ जहाँ प्रत्येक state ले Lambda function call गर्न सक्छ। यसले retry, error catching, parallel branch, र wait state (1 वर्षसम्म) handle गर्छ। Lambda single-function logic का लागि हो; Step Functions multi-step workflow का लागि हो।",
        jp: "Lambda の最大タイムアウトは 15 分です。ワークフローがより長い時間を必要とする場合、または複数のステップ・分岐・リトライ・人間の承認が含まれる場合は、AWS Step Functions を使用してください。Step Functions は各ステートが Lambda 関数を呼び出せるステートマシンをオーケストレーションします。リトライ・エラーキャッチ・並列ブランチ・待機状態（最大 1 年）を処理します。Lambda は単一機能ロジック用；Step Functions はマルチステップワークフロー用です。",
      },
      tag: { en: "architecture", np: "Architecture", jp: "アーキテクチャ" },
    },
    {
      question: {
        en: "When should I use a container image instead of a ZIP deployment?",
        np: "ZIP deployment को सट्टा container image कहिले प्रयोग गर्ने?",
        jp: "ZIP デプロイではなくコンテナイメージをいつ使うべきか？",
      },
      answer: {
        en: "Use container images when: (1) your deployment package exceeds 250 MB unzipped (e.g. ML inference with large model weights); (2) you need a custom runtime not supported by Lambda (e.g. a specific Ruby version); (3) your team already has Docker expertise and a container-based CI/CD pipeline. ZIP is simpler and faster to iterate on for most use cases. Container image cold starts are typically slightly longer than ZIP cold starts.",
        np: "(1) तपाईंको deployment package unzipped 250 MB भन्दा बढी छ (जस्तै large model weight सहित ML inference); (2) Lambda द्वारा support नगरिएको custom runtime चाहिन्छ (जस्तै specific Ruby version); (3) तपाईंको team मा Docker expertise र container-based CI/CD pipeline छ भने container image प्रयोग गर्नुहोस्। ZIP धेरैजसो use case का लागि simpler र छिटो iterate गर्न सकिन्छ। Container image cold start प्रायः ZIP cold start भन्दा थोरै लामो हुन्छ।",
        jp: "コンテナイメージを使うべき場合：(1) デプロイパッケージが解凍後 250 MB を超える（例：大きなモデルウェイトを持つ ML 推論）；(2) Lambda がサポートしていないカスタムランタイムが必要（例：特定の Ruby バージョン）；(3) チームが Docker の専門知識とコンテナベースの CI/CD パイプラインを持っている。ZIP はほとんどのユースケースでよりシンプルで反復が速い。コンテナイメージのコールドスタートは通常 ZIP のコールドスタートよりわずかに長い。",
      },
      tag: { en: "deployment", np: "Deployment", jp: "デプロイ" },
    },
    {
      question: {
        en: "How does Lambda pricing work — is it actually cheaper than EC2?",
        np: "Lambda pricing कसरी काम गर्छ — के यो actually EC2 भन्दा सस्तो हो?",
        jp: "Lambda の料金の仕組みは — 実際に EC2 より安いのか？",
      },
      answer: {
        en: "Lambda charges per request ($0.20/million) plus duration (GB-seconds). At 128 MB for 1ms, it is extremely cheap. For spiky or infrequent workloads, Lambda almost always beats EC2 because you pay zero when idle. For sustained high-throughput workloads (thousands of RPS 24/7), EC2 or containers are often cheaper because the per-GB-second cost adds up. Use the AWS Pricing Calculator to compare at your expected traffic level.",
        np: "Lambda ले प्रति request ($0.20/million) plus duration (GB-second) charge गर्छ। 1ms का लागि 128 MB मा, यो extremely सस्तो छ। Spiky वा infrequent workload का लागि, Lambda ले EC2 भन्दा लगभग हमेशा beat गर्छ किनभने idle मा zero भुक्तानी गर्नुपर्छ। Sustained high-throughput workload (24/7 हजारौं RPS) का लागि, EC2 वा container प्रायः सस्तो हुन्छ किनभने per-GB-second cost बढ्दै जान्छ। तपाईंको expected traffic level मा compare गर्न AWS Pricing Calculator प्रयोग गर्नुहोस्।",
        jp: "Lambda はリクエストごと（$0.20/百万）と時間（GB 秒）で課金されます。128 MB で 1ms なら非常に安い。スパイキーまたは低頻度のワークロードでは、アイドル時にゼロを支払うので Lambda がほぼ常に EC2 を上回ります。持続的な高スループットワークロード（24/7 で数千 RPS）の場合、GB 秒あたりのコストが積み上がるため EC2 またはコンテナの方が安いことが多い。予想されるトラフィックレベルで比較するには AWS 料金計算ツールを使用してください。",
      },
      tag: { en: "cost", np: "Cost", jp: "コスト" },
    },
  ],
};
