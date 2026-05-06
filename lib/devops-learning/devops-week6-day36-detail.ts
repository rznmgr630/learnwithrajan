import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "CloudWatch is AWS's unified observability service — it collects metrics, log files, and events from every AWS resource and your own applications. Without it you are flying blind: you cannot set alarms on CPU spikes, you cannot search application logs across a fleet of EC2 instances, and you cannot build dashboards that show the health of your entire system at a glance.",
    np: "CloudWatch AWS को unified observability service हो — यसले हरेक AWS resource र तपाईंको आफ्नै application बाट metric, log file, र event collect गर्छ। यो बिना तपाईं अन्धो हुनुहुन्छ: CPU spike मा alarm set गर्न सक्नुहुन्न, EC2 instance को fleet मा application log खोज्न सक्नुहुन्न, र तपाईंको पूरा system को health एकनजरमा देखाउने dashboard बनाउन सक्नुहुन्न।",
    jp: "CloudWatch は AWS の統合オブザーバビリティサービスです — すべての AWS リソースと自分のアプリケーションからメトリクス・ログファイル・イベントを収集します。これがないと盲目的に飛ぶようなものです：CPU スパイクのアラームを設定できず・EC2 インスタンスのフリートにわたるアプリケーションログを検索できず・システム全体の健全性を一目で示すダッシュボードを構築できません。",
  } as const,
  o2: {
    en: "Today you master the four CloudWatch pillars: Metrics (numeric time-series data), Logs (text events from apps and AWS services), Alarms (thresholds that trigger automated responses), and Dashboards (visual health boards). You will also create custom metrics from application code, write CloudWatch Logs Insights queries, and wire alarms to SNS topics and Auto Scaling actions.",
    np: "आज तपाईंले चार CloudWatch pillar master गर्नुहुनेछ: Metric (numeric time-series data), Log (app र AWS service बाट text event), Alarm (automated response trigger गर्ने threshold), र Dashboard (visual health board)। तपाईंले application code बाट custom metric पनि create गर्नुहुनेछ, CloudWatch Logs Insights query लेख्नुहुनेछ, र alarm लाई SNS topic र Auto Scaling action सँग wire गर्नुहुनेछ।",
    jp: "今日は CloudWatch の 4 つの柱をマスターします：メトリクス（数値時系列データ）・ログ（アプリと AWS サービスからのテキストイベント）・アラーム（自動応答をトリガーするしきい値）・ダッシュボード（ビジュアルヘルスボード）。また、アプリケーションコードからカスタムメトリクスを作成し・CloudWatch Logs Insights クエリを書き・アラームを SNS トピックと Auto Scaling アクションに接続します。",
  } as const,
};

export const DEVOPS_DAY_36_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "CloudWatch architecture overview",
        np: "CloudWatch architecture overview",
        jp: "CloudWatch アーキテクチャの概要",
      },
      blocks: [
        { type: "diagram", id: "devops-cloudwatch" },
        {
          type: "paragraph",
          text: {
            en: "CloudWatch has four main services that work together. Metrics: time-series numeric data points emitted by AWS services every 1–5 minutes (or 1 second with high-resolution). Logs: text streams from EC2, Lambda, ECS, and custom apps — stored in log groups, further divided into log streams per source. Alarms: evaluate a metric against a threshold over N evaluation periods and fire actions (SNS notification, EC2 action, ASG policy). Dashboards: customizable widget boards that pull live metrics and log query results. All four are region-scoped — cross-region dashboards need explicit cross-region metric widgets.",
            np: "CloudWatch मा चार main service छन् जुन सँगै काम गर्छन्। Metric: AWS service बाट हर 1–5 मिनेट (वा high-resolution सँग 1 second) emit भएको time-series numeric data point। Log: EC2, Lambda, ECS, र custom app बाट text stream — log group मा store, प्रति source log stream मा divide। Alarm: N evaluation period मा threshold विरुद्ध metric evaluate गर्छ र action fire गर्छ (SNS notification, EC2 action, ASG policy)। Dashboard: live metric र log query result pull गर्ने customizable widget board। चारवटै region-scoped छन् — cross-region dashboard लाई explicit cross-region metric widget चाहिन्छ।",
            jp: "CloudWatch には連携して機能する 4 つの主要サービスがあります。メトリクス：AWS サービスから 1〜5 分ごと（高解像度では 1 秒）に送出される時系列数値データポイント。ログ：EC2・Lambda・ECS・カスタムアプリからのテキストストリーム — ロググループに保存され、ソースごとにログストリームに分割。アラーム：N 評価期間にわたってしきい値に対してメトリクスを評価し、アクション（SNS 通知・EC2 アクション・ASG ポリシー）を発火。ダッシュボード：ライブメトリクスとログクエリ結果を取得するカスタマイズ可能なウィジェットボード。すべて 4 つはリージョンスコープ — クロスリージョンダッシュボードには明示的なクロスリージョンメトリクスウィジェットが必要です。",
          },
        },
        {
          type: "table",
          caption: {
            en: "CloudWatch service comparison — what it stores, retention, cost model, and common use",
            np: "CloudWatch service comparison — के store गर्छ, retention, cost model, र सामान्य use",
            jp: "CloudWatch サービス比較 — 保存内容・保持期間・コストモデル・一般的な用途",
          },
          headers: [
            { en: "Service", np: "Service", jp: "サービス" },
            { en: "Data Type", np: "Data Type", jp: "データタイプ" },
            { en: "Default Retention", np: "Default Retention", jp: "デフォルト保持期間" },
            { en: "Pricing Unit", np: "Pricing Unit", jp: "価格単位" },
            { en: "Common Use", np: "Common Use", jp: "一般的な用途" },
          ],
          rows: [
            [
              { en: "Metrics", np: "Metric", jp: "メトリクス" },
              { en: "Numeric (integer/float)", np: "Numeric (integer/float)", jp: "数値（整数/浮動小数点）" },
              { en: "15 months (standard), 3 hours (high-res)", np: "15 महिना (standard), 3 घण्टा (high-res)", jp: "15 ヶ月（標準）、3 時間（高解像度）" },
              { en: "Per metric/month + API calls", np: "प्रति metric/month + API call", jp: "メトリクス/月 + API コール" },
              { en: "CPU utilization, request count, custom app metrics", np: "CPU utilization, request count, custom app metric", jp: "CPU 使用率・リクエスト数・カスタムアプリメトリクス" },
            ],
            [
              { en: "Logs", np: "Log", jp: "ログ" },
              { en: "Text / JSON events", np: "Text / JSON event", jp: "テキスト / JSON イベント" },
              { en: "Configurable (1 day – never expire)", np: "Configurable (1 दिन – कहिल्यै expire हुँदैन)", jp: "設定可能（1 日〜無期限）" },
              { en: "Per GB ingested + stored + queried", np: "प्रति GB ingested + stored + queried", jp: "GB 取り込み + 保存 + クエリ" },
              { en: "Application logs, Lambda output, VPC Flow Logs", np: "Application log, Lambda output, VPC Flow Log", jp: "アプリケーションログ・Lambda 出力・VPC フローログ" },
            ],
            [
              { en: "Alarms", np: "Alarm", jp: "アラーム" },
              { en: "Threshold state (OK/ALARM/INSUFFICIENT_DATA)", np: "Threshold state (OK/ALARM/INSUFFICIENT_DATA)", jp: "しきい値状態（OK/ALARM/INSUFFICIENT_DATA）" },
              { en: "N/A (alarm config stored indefinitely)", np: "N/A (alarm config indefinitely store)", jp: "N/A（アラーム設定は無期限保存）" },
              { en: "Per alarm/month", np: "प्रति alarm/month", jp: "アラーム/月" },
              { en: "Notify on CPU > 80%, auto-scale, stop idle instances", np: "CPU > 80% मा notify, auto-scale, idle instance stop", jp: "CPU > 80% 通知・自動スケール・アイドルインスタンス停止" },
            ],
            [
              { en: "Dashboards", np: "Dashboard", jp: "ダッシュボード" },
              { en: "Widget layout + metric/query config", np: "Widget layout + metric/query config", jp: "ウィジェットレイアウト + メトリクス/クエリ設定" },
              { en: "N/A (config stored indefinitely)", np: "N/A (config indefinitely store)", jp: "N/A（設定は無期限保存）" },
              { en: "Per dashboard/month (first 3 free)", np: "प्रति dashboard/month (पहिलो 3 free)", jp: "ダッシュボード/月（最初の 3 つは無料）" },
              { en: "NOC screens, on-call reference boards", np: "NOC screen, on-call reference board", jp: "NOC スクリーン・オンコール参照ボード" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "CloudWatch Metrics — namespaces, dimensions & custom metrics",
        np: "CloudWatch Metric — namespace, dimension र custom metric",
        jp: "CloudWatch メトリクス — ネームスペース・ディメンション・カスタムメトリクス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A metric is identified by three things: Namespace (e.g. `AWS/EC2`), MetricName (e.g. `CPUUtilization`), and Dimensions (key-value filters like `InstanceId=i-0abc`). AWS publishes hundreds of built-in metrics. High-Resolution metrics (StorageResolution=1) cost more and retain for only 3 hours at 1-second granularity. To publish custom metrics from your app, use the `put-metric-data` API or the CloudWatch agent (preferred for OS-level metrics like memory and disk, which EC2 does not report by default).",
            np: "Metric तीन कुराले identify गरिन्छ: Namespace (जस्तै `AWS/EC2`), MetricName (जस्तै `CPUUtilization`), र Dimension (key-value filter जस्तै `InstanceId=i-0abc`)। AWS ले सयौं built-in metric publish गर्छ। High-Resolution metric (StorageResolution=1) बढी cost लाग्छ र 1-second granularity मा मात्र 3 घण्टाको लागि retain हुन्छ। तपाईंको app बाट custom metric publish गर्न, `put-metric-data` API वा CloudWatch agent प्रयोग गर्नुहोस् (OS-level metric जस्तै memory र disk को लागि preferred — EC2 ले default मा report गर्दैन)।",
            jp: "メトリクスは 3 つの要素で識別されます：ネームスペース（例：`AWS/EC2`）・MetricName（例：`CPUUtilization`）・ディメンション（`InstanceId=i-0abc` のようなキーと値のフィルタ）。AWS は数百の組み込みメトリクスを公開しています。高解像度メトリクス（StorageResolution=1）はコストが高く、1 秒の粒度では 3 時間しか保持されません。アプリからカスタムメトリクスを公開するには、`put-metric-data` API または CloudWatch エージェント（EC2 がデフォルトで報告しないメモリやディスクなどの OS レベルメトリクスに推奨）を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Publish custom metrics and install the CloudWatch agent for memory/disk",
            np: "Custom metric publish गर्नुहोस् र memory/disk का लागि CloudWatch agent install गर्नुहोस्",
            jp: "カスタムメトリクスの公開と memory/disk 用 CloudWatch エージェントのインストール",
          },
          code: `# ── Publish a one-off custom metric via AWS CLI ──
aws cloudwatch put-metric-data \
    --namespace "MyApp/Orders" \
    --metric-name "OrdersProcessed" \
    --value 42 \
    --unit Count \
    --dimensions Environment=prod,Service=checkout

# Publish with a timestamp (useful for backfill or batch jobs)
aws cloudwatch put-metric-data \
    --namespace "MyApp/Orders" \
    --metric-name "ProcessingLatencyMs" \
    --value 123.5 \
    --unit Milliseconds \
    --timestamp "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --dimensions Environment=prod

# ── Python (boto3) — publish a high-resolution metric (1-second) ──
import boto3
cw = boto3.client('cloudwatch', region_name='us-east-1')

cw.put_metric_data(
    Namespace='MyApp/Orders',
    MetricData=[{
        'MetricName': 'QueueDepth',
        'Value': 157,
        'Unit': 'Count',
        'StorageResolution': 1,          # high-res: 1-second granularity
        'Dimensions': [{'Name': 'Queue', 'Value': 'orders-queue'}],
    }]
)

# ── Install CloudWatch Agent on Amazon Linux 2023 ──
# The agent collects memory, disk, and custom log files automatically.
sudo dnf install -y amazon-cloudwatch-agent

# Generate a config interactively (wizard)
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard

# Or deploy a pre-made config from SSM Parameter Store
aws ssm put-parameter \
    --name "/cloudwatch-agent/config/prod" \
    --type "String" \
    --value file://cloudwatch-agent-config.json

sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl \
    -a fetch-config \
    -m ec2 \
    -c ssm:/cloudwatch-agent/config/prod \
    -s

# ── cloudwatch-agent-config.json (collect mem + disk + app log) ──
{
  "metrics": {
    "namespace": "CWAgent",
    "metrics_collected": {
      "mem":  { "measurement": ["mem_used_percent"] },
      "disk": {
        "measurement": ["disk_used_percent"],
        "resources": ["/"]
      }
    }
  },
  "logs": {
    "logs_collected": {
      "files": {
        "collect_list": [{
          "file_path": "/var/log/myapp/app.log",
          "log_group_name": "/myapp/prod/application",
          "log_stream_name": "{instance_id}",
          "timezone": "UTC"
        }]
      }
    }
  }
}`,
        },
      ],
    },
    {
      title: {
        en: "CloudWatch Logs — log groups, log streams & Logs Insights",
        np: "CloudWatch Log — log group, log stream र Logs Insights",
        jp: "CloudWatch ログ — ロググループ・ログストリーム・Logs Insights",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Logs are organized in a two-level hierarchy: Log Group (e.g. `/myapp/prod`) → Log Stream (one stream per source, e.g. per EC2 instance or Lambda invocation). Set a retention policy on every log group — by default logs never expire and you pay indefinitely. CloudWatch Logs Insights is a query language for searching across log streams in seconds. Metric Filters extract numeric values from log patterns and convert them to CloudWatch metrics (e.g. count ERROR lines → alarm when > 10 errors/min).",
            np: "Log दुई-level hierarchy मा organize गरिन्छ: Log Group (जस्तै `/myapp/prod`) → Log Stream (प्रति source एउटा stream, जस्तै प्रति EC2 instance वा Lambda invocation)। हरेक log group मा retention policy set गर्नुहोस् — default मा log कहिल्यै expire हुँदैन र तपाईंले indefinitely भुक्तानी गर्नुहुन्छ। CloudWatch Logs Insights ले seconds मा log stream across खोज्ने query language हो। Metric Filter ले log pattern बाट numeric value extract गर्छ र CloudWatch metric मा convert गर्छ (जस्तै ERROR line count → > 10 error/min हुँदा alarm)।",
            jp: "ログは 2 段階の階層で整理されます：ロググループ（例：`/myapp/prod`）→ ログストリーム（ソースごとに 1 ストリーム、例：EC2 インスタンスごとまたは Lambda 呼び出しごと）。すべてのロググループに保持ポリシーを設定してください — デフォルトではログは期限切れにならず、無期限に料金を支払います。CloudWatch Logs Insights は数秒でログストリームを横断検索するクエリ言語です。メトリクスフィルタはログパターンから数値を抽出して CloudWatch メトリクスに変換します（例：ERROR 行のカウント → 毎分 10 エラー超でアラーム）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create log groups, set retention, query with Logs Insights, create metric filter",
            np: "Log group create गर्नुहोस्, retention set गर्नुहोस्, Logs Insights सँग query, metric filter create गर्नुहोस्",
            jp: "ロググループの作成・保持期間の設定・Logs Insights でのクエリ・メトリクスフィルタの作成",
          },
          code: `# ── Log Group management ──
# Create a log group with a 30-day retention policy
aws logs create-log-group --log-group-name /myapp/prod/application
aws logs put-retention-policy \
    --log-group-name /myapp/prod/application \
    --retention-in-days 30

# Apply 30-day retention to ALL log groups that have "Never expire" (cost hygiene)
aws logs describe-log-groups \
    --query "logGroups[?retentionInDays==null].logGroupName" \
    --output text | tr '\t' '\n' | while read lg; do
  echo "Setting retention on: $lg"
  aws logs put-retention-policy --log-group-name "$lg" --retention-in-days 30
done

# ── CloudWatch Logs Insights queries ──
# Find all ERROR logs in the last 1 hour
aws logs start-query \
    --log-group-name /myapp/prod/application \
    --start-time $(date -d '1 hour ago' +%s) \
    --end-time $(date +%s) \
    --query-string 'fields @timestamp, @message
                   | filter @message like /ERROR/
                   | sort @timestamp desc
                   | limit 50'

# Top 10 slowest API endpoints (assumes JSON log with "path" and "durationMs" fields)
# fields @timestamp, path, durationMs
# | filter ispresent(durationMs)
# | stats avg(durationMs) as avgMs, max(durationMs) as maxMs, count() as hits by path
# | sort avgMs desc
# | limit 10

# Count errors per minute (for an alarm metric)
# filter @message like /ERROR/
# | stats count() as errorCount by bin(1m)

# Poll for query results (replace QUERY_ID with the one returned above)
aws logs get-query-results --query-id QUERY_ID

# ── Metric Filter — count HTTP 5xx errors → CloudWatch metric ──
aws logs put-metric-filter \
    --log-group-name /myapp/prod/application \
    --filter-name "Http5xxErrors" \
    --filter-pattern "[host, ident, authuser, date, request, status_code=5*, size]" \
    --metric-transformations \
      metricName=Http5xxCount,metricNamespace=MyApp/Nginx,metricValue=1,defaultValue=0

# Confirm the filter is in place
aws logs describe-metric-filters \
    --log-group-name /myapp/prod/application \
    --filter-name-prefix "Http5xx"`,
        },
      ],
    },
    {
      title: {
        en: "CloudWatch Alarms — thresholds, actions & composite alarms",
        np: "CloudWatch Alarm — threshold, action र composite alarm",
        jp: "CloudWatch アラーム — しきい値・アクション・複合アラーム",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "An alarm watches a single metric (or math expression) over a sliding window of evaluation periods. States: OK (metric within threshold), ALARM (threshold breached), INSUFFICIENT_DATA (not enough data points yet). Actions trigger on state transitions: SNS topic (email/SMS/Lambda/PagerDuty), EC2 action (stop, reboot, terminate, recover), or ASG scaling policy. Composite Alarms combine multiple alarms with AND/OR logic — for example, only page on-call when BOTH CPU is high AND memory is high (reduces alert fatigue).",
            np: "Alarm ले evaluation period को sliding window मा single metric (वा math expression) हेर्छ। State: OK (metric threshold भित्र), ALARM (threshold breach), INSUFFICIENT_DATA (अझै पर्याप्त data point छैन)। Action state transition मा trigger हुन्छ: SNS topic (email/SMS/Lambda/PagerDuty), EC2 action (stop, reboot, terminate, recover), वा ASG scaling policy। Composite Alarm ले AND/OR logic सँग multiple alarm combine गर्छ — उदाहरणको लागि, CPU उच्च र memory उच्च दुवै हुँदा मात्र on-call page गर्नुहोस् (alert fatigue घटाउँछ)।",
            jp: "アラームは評価期間のスライディングウィンドウ上で単一のメトリクス（または数式）を監視します。状態：OK（メトリクスがしきい値内）・ALARM（しきい値違反）・INSUFFICIENT_DATA（まだデータポイントが不足）。アクションは状態遷移時にトリガー：SNS トピック（メール/SMS/Lambda/PagerDuty）・EC2 アクション（停止・再起動・終了・回復）・ASG スケーリングポリシー。複合アラームは複数のアラームを AND/OR ロジックで組み合わせます — たとえば CPU が高くかつメモリも高い場合のみオンコールにページ送信（アラート疲れを軽減）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create metric alarms, SNS topic, and a composite alarm",
            np: "Metric alarm, SNS topic, र composite alarm create गर्नुहोस्",
            jp: "メトリクスアラーム・SNS トピック・複合アラームの作成",
          },
          code: `# ── Create an SNS topic for alarm notifications ──
SNS_ARN=$(aws sns create-topic --name prod-alerts --query TopicArn --output text)

# Subscribe your email to the topic
aws sns subscribe \
    --topic-arn "$SNS_ARN" \
    --protocol email \
    --notification-endpoint ops@example.com

# ── High CPU alarm (ALARM if CPU > 80% for 3 consecutive 1-min periods) ──
aws cloudwatch put-metric-alarm \
    --alarm-name "prod-web-high-cpu" \
    --alarm-description "CPU > 80% for 3 minutes" \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \
    --dimensions Name=AutoScalingGroupName,Value=prod-web-asg \
    --statistic Average \
    --period 60 \
    --evaluation-periods 3 \
    --threshold 80 \
    --comparison-operator GreaterThanThreshold \
    --treat-missing-data notBreaching \
    --alarm-actions "$SNS_ARN" \
    --ok-actions "$SNS_ARN"

# ── High error-rate alarm (uses metric filter created earlier) ──
aws cloudwatch put-metric-alarm \
    --alarm-name "prod-web-5xx-errors" \
    --alarm-description "HTTP 5xx errors > 50 per minute" \
    --namespace MyApp/Nginx \
    --metric-name Http5xxCount \
    --statistic Sum \
    --period 60 \
    --evaluation-periods 2 \
    --threshold 50 \
    --comparison-operator GreaterThanThreshold \
    --treat-missing-data notBreaching \
    --alarm-actions "$SNS_ARN"

# ── Memory alarm using CloudWatch Agent metric ──
aws cloudwatch put-metric-alarm \
    --alarm-name "prod-web-high-memory" \
    --namespace CWAgent \
    --metric-name mem_used_percent \
    --dimensions Name=AutoScalingGroupName,Value=prod-web-asg \
    --statistic Average \
    --period 60 \
    --evaluation-periods 3 \
    --threshold 85 \
    --comparison-operator GreaterThanThreshold \
    --alarm-actions "$SNS_ARN"

# ── Composite Alarm: page on-call ONLY when BOTH CPU AND memory are high ──
aws cloudwatch put-composite-alarm \
    --alarm-name "prod-web-overload" \
    --alarm-description "CPU AND memory both critical — page on-call" \
    --alarm-rule "ALARM(prod-web-high-cpu) AND ALARM(prod-web-high-memory)" \
    --alarm-actions "$SNS_ARN"

# Check current alarm states
aws cloudwatch describe-alarms \
    --alarm-names "prod-web-high-cpu" "prod-web-5xx-errors" "prod-web-high-memory" \
    --query "MetricAlarms[*].{Name:AlarmName,State:StateValue,Reason:StateReason}"

# Force an alarm into ALARM state for testing (does not affect real metric)
aws cloudwatch set-alarm-state \
    --alarm-name "prod-web-high-cpu" \
    --state-value ALARM \
    --state-reason "manual test"`,
        },
      ],
    },
    {
      title: {
        en: "CloudWatch Dashboards & anomaly detection",
        np: "CloudWatch Dashboard र anomaly detection",
        jp: "CloudWatch ダッシュボードと異常検出",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Dashboards let you build a single-pane-of-glass view across services and regions. Each widget references one or more metrics with a period, statistic, and optional math expression. Anomaly Detection uses ML to model the expected band for a metric (accounting for daily/weekly seasonality) and can drive alarms without hard-coded thresholds. Use `ANOMALY_DETECTION_BAND()` as the threshold in an alarm to fire when the metric deviates more than N standard deviations from the model.",
            np: "Dashboard ले तपाईंलाई service र region across single-pane-of-glass view build गर्न दिन्छ। प्रत्येक widget ले period, statistic, र optional math expression सहित एक वा बढी metric reference गर्छ। Anomaly Detection ले metric को expected band model गर्न ML प्रयोग गर्छ (daily/weekly seasonality account गर्दै) र hard-coded threshold बिना alarm drive गर्न सक्छ। Metric model बाट N standard deviation भन्दा बढी deviate हुँदा fire गर्न alarm मा threshold को रूपमा `ANOMALY_DETECTION_BAND()` प्रयोग गर्नुहोस्।",
            jp: "ダッシュボードを使えばサービスとリージョンにわたる一元的なビューを構築できます。各ウィジェットは期間・統計・オプションの数式を持つ 1 つ以上のメトリクスを参照します。異常検出は ML を使って（日次/週次の季節性を考慮して）メトリクスの期待バンドをモデル化し、ハードコードされたしきい値なしにアラームを駆動できます。メトリクスがモデルから N 標準偏差以上逸脱したときに発火するアラームのしきい値として `ANOMALY_DETECTION_BAND()` を使用します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Create a CloudWatch Dashboard and enable anomaly detection",
            np: "CloudWatch Dashboard create गर्नुहोस् र anomaly detection enable गर्नुहोस्",
            jp: "CloudWatch ダッシュボードの作成と異常検出の有効化",
          },
          code: `# ── Create a production dashboard with 3 widgets (JSON body) ──
cat > dashboard-body.json << 'EOF'
{
  "widgets": [
    {
      "type": "metric",
      "width": 12, "height": 6,
      "properties": {
        "title": "Web Tier — CPU & Memory",
        "view": "timeSeries",
        "period": 60,
        "stat": "Average",
        "metrics": [
          ["AWS/EC2", "CPUUtilization", "AutoScalingGroupName", "prod-web-asg"],
          ["CWAgent",  "mem_used_percent", "AutoScalingGroupName", "prod-web-asg"]
        ]
      }
    },
    {
      "type": "metric",
      "width": 12, "height": 6,
      "properties": {
        "title": "ALB — Request Count & 5xx Errors",
        "view": "timeSeries",
        "period": 60,
        "metrics": [
          ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", "app/prod-alb/abc123", {"stat":"Sum","label":"Requests/min"}],
          ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", "app/prod-alb/abc123", {"stat":"Sum","label":"5xx/min","color":"#ff0000"}]
        ]
      }
    },
    {
      "type": "alarm",
      "width": 24, "height": 4,
      "properties": {
        "title": "Alarm Status",
        "alarms": [
          "arn:aws:cloudwatch:us-east-1:123456789012:alarm:prod-web-high-cpu",
          "arn:aws:cloudwatch:us-east-1:123456789012:alarm:prod-web-5xx-errors",
          "arn:aws:cloudwatch:us-east-1:123456789012:alarm:prod-web-high-memory",
          "arn:aws:cloudwatch:us-east-1:123456789012:alarm:prod-web-overload"
        ]
      }
    }
  ]
}
EOF

aws cloudwatch put-dashboard \
    --dashboard-name "prod-web-overview" \
    --dashboard-body file://dashboard-body.json

# ── Anomaly Detection — let ML set the alarm band ──
# Step 1: create the anomaly detection model on a metric
aws cloudwatch put-anomaly-detector \
    --namespace AWS/EC2 \
    --metric-name CPUUtilization \
    --dimensions Name=AutoScalingGroupName,Value=prod-web-asg \
    --stat Average

# Step 2: create an alarm that uses the model band (fires when CPU deviates >2σ)
aws cloudwatch put-metric-alarm \
    --alarm-name "prod-cpu-anomaly" \
    --alarm-description "CPU deviates from normal pattern by more than 2 std deviations" \
    --metrics '[
      {"Id":"m1","MetricStat":{"Metric":{"Namespace":"AWS/EC2","MetricName":"CPUUtilization","Dimensions":[{"Name":"AutoScalingGroupName","Value":"prod-web-asg"}]},"Period":300,"Stat":"Average"}},
      {"Id":"e1","Expression":"ANOMALY_DETECTION_BAND(m1, 2)","Label":"Expected band"}
    ]' \
    --comparison-operator GreaterThanUpperThreshold \
    --threshold-metric-id e1 \
    --evaluation-periods 3 \
    --treat-missing-data notBreaching \
    --alarm-actions "$SNS_ARN"`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: build a complete observability stack",
        np: "Hands-on: complete observability stack बनाउनुहोस्",
        jp: "ハンズオン：完全なオブザーバビリティスタックを構築する",
      },
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install the CloudWatch agent on an EC2 instance (Amazon Linux 2023). Use the config wizard (`/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard`) to enable memory and disk metrics, then start the agent. Confirm `mem_used_percent` and `disk_used_percent` appear in the CloudWatch console under the `CWAgent` namespace.",
              np: "EC2 instance (Amazon Linux 2023) मा CloudWatch agent install गर्नुहोस्। Memory र disk metric enable गर्न config wizard (`/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard`) प्रयोग गर्नुहोस्, त्यसपछि agent start गर्नुहोस्। CloudWatch console मा `CWAgent` namespace अन्तर्गत `mem_used_percent` र `disk_used_percent` देखिएको confirm गर्नुहोस्।",
              jp: "EC2 インスタンス（Amazon Linux 2023）に CloudWatch エージェントをインストールする。設定ウィザード（`/opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-config-wizard`）を使ってメモリとディスクメトリクスを有効化し、エージェントを起動する。CloudWatch コンソールの `CWAgent` ネームスペースに `mem_used_percent` と `disk_used_percent` が表示されることを確認する。",
            },
            {
              en: "Create a log group `/lab/app` with a 7-day retention policy. Write a small script that appends mock application logs (including some lines with `ERROR`) to a file, configure the agent to ship that file to `/lab/app`, and verify the log stream appears in the console.",
              np: "7-day retention policy सहित `/lab/app` log group create गर्नुहोस्। Mock application log (केही `ERROR` line सहित) file मा append गर्ने सानो script लेख्नुहोस्, agent लाई त्यो file `/lab/app` मा ship गर्न configure गर्नुहोस्, र log stream console मा देखिएको verify गर्नुहोस्।",
              jp: "7 日間の保持ポリシーで `/lab/app` ロググループを作成する。モックアプリケーションログ（`ERROR` の行を含む）をファイルに追記する小さなスクリプトを書き、エージェントがそのファイルを `/lab/app` に送信するよう設定し、ログストリームがコンソールに表示されることを確認する。",
            },
            {
              en: "Open CloudWatch Logs Insights. Query the `/lab/app` log group for all lines containing `ERROR` in the last 30 minutes. Then write a second query that counts errors per minute using `stats count() as errorCount by bin(1m)` and note the output.",
              np: "CloudWatch Logs Insights खोल्नुहोस्। पछिल्लो 30 मिनेटमा `ERROR` भएका सबै line को लागि `/lab/app` log group query गर्नुहोस्। त्यसपछि `stats count() as errorCount by bin(1m)` प्रयोग गरी प्रति मिनेट error count गर्ने दोस्रो query लेख्नुहोस् र output नोट गर्नुहोस्।",
              jp: "CloudWatch Logs Insights を開く。直近 30 分間の `ERROR` を含む全行を `/lab/app` ロググループで検索する。次に `stats count() as errorCount by bin(1m)` を使って 1 分ごとのエラー数を集計する 2 番目のクエリを書き、出力をメモする。",
            },
            {
              en: "Create a Metric Filter on `/lab/app` that counts every line containing `ERROR` into a metric named `AppErrorCount` in namespace `Lab/App`. Use `aws logs put-metric-filter` with `--filter-pattern '[..., level=\"ERROR\", ...]'` or simply `'?ERROR'` for plain-text logs.",
              np: "`ERROR` भएका हरेक line `/Lab/App` namespace मा `AppErrorCount` नामको metric मा count गर्ने `/lab/app` मा Metric Filter create गर्नुहोस्। Plain-text log का लागि `--filter-pattern '[..., level=\"ERROR\", ...]'` वा simply `'?ERROR'` सहित `aws logs put-metric-filter` प्रयोग गर्नुहोस्।",
              jp: "`ERROR` を含む各行を `Lab/App` ネームスペースの `AppErrorCount` というメトリクスにカウントする `/lab/app` へのメトリクスフィルタを作成する。プレーンテキストログには `--filter-pattern '[..., level=\"ERROR\", ...]'` または単純に `'?ERROR'` で `aws logs put-metric-filter` を使用する。",
            },
            {
              en: "Create an SNS topic and subscribe your email. Then create three alarms: (1) CPU > 80% for 3 periods on your instance, (2) `AppErrorCount` > 5 in 1 period (from the metric filter), (3) `mem_used_percent` > 85% from CWAgent. Verify each alarm appears in the CloudWatch console with state `OK` or `INSUFFICIENT_DATA`.",
              np: "SNS topic create गर्नुहोस् र तपाईंको email subscribe गर्नुहोस्। त्यसपछि तीन alarm create गर्नुहोस्: (1) तपाईंको instance मा 3 period का लागि CPU > 80%, (2) 1 period मा `AppErrorCount` > 5 (metric filter बाट), (3) CWAgent बाट `mem_used_percent` > 85%। हरेक alarm CloudWatch console मा `OK` वा `INSUFFICIENT_DATA` state सहित देखिएको verify गर्नुहोस्।",
              jp: "SNS トピックを作成してメールをサブスクライブする。次に 3 つのアラームを作成：(1) インスタンスの 3 期間で CPU > 80%、(2) 1 期間で `AppErrorCount` > 5（メトリクスフィルタから）、(3) CWAgent からの `mem_used_percent` > 85%。各アラームが CloudWatch コンソールに `OK` または `INSUFFICIENT_DATA` 状態で表示されることを確認する。",
            },
            {
              en: "Create a Composite Alarm that fires only when BOTH the CPU alarm AND the memory alarm are in ALARM state. Use `aws cloudwatch put-composite-alarm --alarm-rule 'ALARM(...) AND ALARM(...)'`. Test by using `set-alarm-state` to manually flip both component alarms to ALARM and verify the composite alarm transitions too.",
              np: "CPU alarm र memory alarm दुवै ALARM state मा हुँदा मात्र fire गर्ने Composite Alarm create गर्नुहोस्। `aws cloudwatch put-composite-alarm --alarm-rule 'ALARM(...) AND ALARM(...)'` प्रयोग गर्नुहोस्। `set-alarm-state` प्रयोग गरी दुवै component alarm manually ALARM मा flip गरेर test गर्नुहोस् र composite alarm पनि transition भएको verify गर्नुहोस्।",
              jp: "CPU アラームとメモリアラームの両方が ALARM 状態の場合のみ発火する複合アラームを作成する。`aws cloudwatch put-composite-alarm --alarm-rule 'ALARM(...) AND ALARM(...)'` を使用する。`set-alarm-state` を使って両方のコンポーネントアラームを手動で ALARM にフリップしてテストし、複合アラームも遷移することを確認する。",
            },
            {
              en: "Build a CloudWatch Dashboard with at least three widgets: (1) a time-series graph showing CPU and memory together, (2) a number widget showing current `AppErrorCount`, and (3) an alarm status widget listing all three alarms. Open the dashboard URL and confirm all widgets render live data.",
              np: "कम्तिमा तीन widget सहित CloudWatch Dashboard बनाउनुहोस्: (1) CPU र memory सँगै देखाउने time-series graph, (2) current `AppErrorCount` देखाउने number widget, र (3) तीनवटै alarm list गर्ने alarm status widget। Dashboard URL खोल्नुहोस् र सबै widget live data render गर्छन् confirm गर्नुहोस्।",
              jp: "少なくとも 3 つのウィジェットを持つ CloudWatch ダッシュボードを構築する：(1) CPU とメモリを一緒に表示する時系列グラフ、(2) 現在の `AppErrorCount` を表示する数値ウィジェット、(3) 3 つのアラームすべてを一覧表示するアラームステータスウィジェット。ダッシュボード URL を開き、すべてのウィジェットがライブデータをレンダリングすることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "EC2 does not report memory or disk metrics — why?",
        np: "EC2 ले memory वा disk metric report गर्दैन — किन?",
        jp: "EC2 がメモリやディスクメトリクスを報告しない — なぜか？",
      },
      answer: {
        en: "CloudWatch can only see what the hypervisor exposes. Memory and disk utilization live inside the OS, so AWS cannot access them without a guest agent. Install the CloudWatch agent and configure it to collect `mem_used_percent` and `disk_used_percent`. These land in the `CWAgent` namespace, not `AWS/EC2`.",
        np: "CloudWatch ले hypervisor expose गरेको मात्र देख्न सक्छ। Memory र disk utilization OS भित्र हुन्छन्, त्यसैले guest agent बिना AWS ले access गर्न सक्दैन। CloudWatch agent install गर्नुहोस् र `mem_used_percent` र `disk_used_percent` collect गर्न configure गर्नुहोस्। यी `AWS/EC2` होइन, `CWAgent` namespace मा land गर्छन्।",
        jp: "CloudWatch はハイパーバイザーが公開するものしか見られません。メモリとディスク使用率は OS 内に存在するため、ゲストエージェントなしに AWS はアクセスできません。CloudWatch エージェントをインストールして `mem_used_percent` と `disk_used_percent` を収集するよう設定してください。これらは `AWS/EC2` ではなく `CWAgent` ネームスペースに入ります。",
      },
      tag: { en: "metrics", np: "Metric", jp: "メトリクス" },
    },
    {
      question: {
        en: "What is INSUFFICIENT_DATA on an alarm — should I worry?",
        np: "Alarm मा INSUFFICIENT_DATA के हो — चिन्ता गर्नुपर्छ?",
        jp: "アラームの INSUFFICIENT_DATA とは何か — 心配すべきか？",
      },
      answer: {
        en: "INSUFFICIENT_DATA means the alarm has not collected enough data points to evaluate the threshold yet. This is normal for new alarms or after an instance restart. It is not the same as ALARM. Set `--treat-missing-data notBreaching` so the alarm does not fire spuriously before data arrives. If INSUFFICIENT_DATA persists, check that the metric is actually being published and the alarm's namespace/metric name/dimensions match exactly.",
        np: "INSUFFICIENT_DATA को मतलब alarm ले अझै threshold evaluate गर्न पर्याप्त data point collect गरेको छैन। नयाँ alarm वा instance restart पछि यो normal हो। यो ALARM जस्तो होइन। Data आउनु अघि alarm spuriously fire नगरोस् भनेर `--treat-missing-data notBreaching` set गर्नुहोस्। INSUFFICIENT_DATA persist भएमा, metric actually publish भइरहेको छ कि छैन र alarm को namespace/metric name/dimension exactly match गर्छ कि गर्दैन check गर्नुहोस्।",
        jp: "INSUFFICIENT_DATA はアラームがしきい値を評価するのに十分なデータポイントをまだ収集していないことを意味します。新しいアラームやインスタンス再起動後は正常です。ALARM と同じではありません。データが届く前にアラームが誤発報しないよう `--treat-missing-data notBreaching` を設定してください。INSUFFICIENT_DATA が続く場合は、メトリクスが実際に公開されているか、アラームのネームスペース/メトリクス名/ディメンションが完全に一致しているか確認してください。",
      },
      tag: { en: "alarms", np: "Alarm", jp: "アラーム" },
    },
    {
      question: {
        en: "How can I reduce my CloudWatch Logs costs?",
        np: "CloudWatch Logs cost कसरी घटाउने?",
        jp: "CloudWatch ログのコストを削減するには？",
      },
      answer: {
        en: "Logs cost has three parts: ingestion ($0.50/GB), storage ($0.03/GB/month), and Insights queries ($0.005/GB scanned). To cut costs: (1) set a retention policy on every log group — never leave it at 'Never Expire'; (2) filter noisy debug logs at the agent level before shipping; (3) use S3 Export for cold log archives; (4) use CloudWatch Logs subscription filters to stream to Kinesis or S3 directly for long-term retention at lower cost.",
        np: "Log cost तीन भागमा आउँछ: ingestion ($0.50/GB), storage ($0.03/GB/month), र Insights query ($0.005/GB scanned)। Cost घटाउन: (1) हरेक log group मा retention policy set गर्नुहोस् — कहिल्यै 'Never Expire' राख्नुहुँदैन; (2) shipping अघि agent level मा noisy debug log filter गर्नुहोस्; (3) cold log archive का लागि S3 Export प्रयोग गर्नुहोस्; (4) कम cost मा long-term retention का लागि directly Kinesis वा S3 मा stream गर्न CloudWatch Logs subscription filter प्रयोग गर्नुहोस्।",
        jp: "ログコストは 3 つの部分から来ます：取り込み（$0.50/GB）・ストレージ（$0.03/GB/月）・Insights クエリ（$0.005/GB スキャン）。コスト削減には：(1) すべてのロググループに保持ポリシーを設定 — 「無期限」にしない；(2) 送信前にエージェントレベルでノイズの多いデバッグログをフィルタ；(3) コールドログアーカイブに S3 エクスポートを使用；(4) 低コストの長期保持のため CloudWatch Logs サブスクリプションフィルタを使って Kinesis または S3 に直接ストリーミング。",
      },
      tag: { en: "cost", np: "Cost", jp: "コスト" },
    },
    {
      question: {
        en: "What's the difference between a Metric Filter and Logs Insights?",
        np: "Metric Filter र Logs Insights बीच के फरक छ?",
        jp: "メトリクスフィルタと Logs Insights の違いは何か？",
      },
      answer: {
        en: "Metric Filters run continuously on incoming log events and emit a CloudWatch metric in real time — you can alarm on them. Logs Insights is an ad-hoc query tool you run interactively or on a schedule. Use Metric Filters when you need a persistent, alarmable number (e.g. error rate). Use Logs Insights for debugging, root-cause analysis, and building one-off reports. You cannot alarm directly on a Logs Insights result, but you can schedule a query and publish the result as a custom metric.",
        np: "Metric Filter ले incoming log event मा continuously run गर्छ र real time मा CloudWatch metric emit गर्छ — तपाईंले alarm गर्न सक्नुहुन्छ। Logs Insights एउटा ad-hoc query tool हो जुन तपाईंले interactively वा schedule मा run गर्नुहुन्छ। Persistent, alarmable number (जस्तै error rate) चाहिँदा Metric Filter प्रयोग गर्नुहोस्। Debugging, root-cause analysis, र one-off report build गर्न Logs Insights प्रयोग गर्नुहोस्। तपाईं directly Logs Insights result मा alarm गर्न सक्नुहुन्न, तर query schedule गर्न र result custom metric को रूपमा publish गर्न सक्नुहुन्छ।",
        jp: "メトリクスフィルタは受信ログイベントに対して継続的に実行され、リアルタイムで CloudWatch メトリクスを送出します — アラームを設定できます。Logs Insights はインタラクティブまたはスケジュールで実行するアドホッククエリツールです。永続的でアラーム可能な数値（例：エラーレート）が必要な場合はメトリクスフィルタを使用。デバッグ・根本原因分析・単発レポートの構築には Logs Insights を使用。Logs Insights の結果に直接アラームを設定することはできませんが、クエリをスケジュールして結果をカスタムメトリクスとして公開することはできます。",
      },
      tag: { en: "logs", np: "Log", jp: "ログ" },
    },
  ],
};
