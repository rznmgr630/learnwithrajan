import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Observability** is the ability to understand a system's internal state from its external outputs alone. It is fundamentally different from traditional monitoring: monitoring checks known failure modes (\"is the CPU over 80%?\", \"is the health check endpoint returning 200?\") — it tells you when a pre-defined threshold is crossed. Observability goes further; it lets you investigate **unknown unknowns** — failures you did not anticipate and therefore never wrote an alert for. In a complex distributed system, most production incidents are novel: the bug is in the interaction between three services under a specific load pattern at a specific time of day. No threshold-based alert could have predicted it. The three pillars of observability are: **Metrics** — numeric measurements aggregated over time. Examples: CPU utilisation %, HTTP request rate (requests/second), error rate (errors/total requests), latency percentiles (p50/p95/p99 milliseconds). Metrics are cheap to store (a single number per time interval), fast to query, and ideal for dashboards and alerting. But they aggregate away details — a p99 latency spike tells you something is slow, not which request or which code path. **Logs** — timestamped, structured event records that capture what happened at a specific moment. A log entry records the exact state: which user made which request, what the database query was, what error was returned. Logs are the primary forensic tool for understanding a specific event. **Traces** — end-to-end records of a single request's journey through distributed services. A trace is composed of **spans** (one per service hop), each recording service name, operation, start time, duration, and status. Spans have parent-child relationships that reconstruct the full call tree, making it possible to see exactly where in a 12-service call chain a request spent 800ms. Each pillar answers a different diagnostic question: metrics tell you **something is wrong**, logs tell you **what happened**, traces tell you **where in the distributed system it went wrong**.",
    np: "**Observability** भनेको बाहिरी output मात्रबाट system को internal state बुझ्न सक्ने क्षमता हो। यो traditional monitoring भन्दा fundamentally different छ: monitoring ले known failure mode check गर्छ (\"CPU 80% भन्दा माथि छ?\", \"health check endpoint 200 return गर्दैछ?\") — यसले pre-defined threshold कहिले cross हुन्छ भन्छ। Observability अझ अगाडि जान्छ; यसले **unknown unknown** investigate गर्न दिन्छ — failure जुन anticipate नगरिएको र त्यसैले alert कहिल्यै लेखिएको छैन। Complex distributed system मा, धेरैजसो production incident novel छन्: bug दिनको specific load pattern र specific time मा तीनवटा service बीचको interaction मा छ। कुनै threshold-based alert ले predict गर्न सक्दैनथ्यो। Observability का तीन pillar छन्: **Metrics** — समयसँगै aggregate भएको numeric measurement। उदाहरण: CPU utilisation %, HTTP request rate (requests/second), error rate (errors/total requests), latency percentile (p50/p95/p99 millisecond)। Metric store गर्न सस्तो (प्रत्येक time interval मा single number), query गर्न fast, र dashboard र alerting को लागि ideal छ। तर तिनीहरूले detail aggregate गर्छन् — p99 latency spike ले केही slow छ भन्छ, कुन request वा कुन code path होइन। **Logs** — specific moment मा के भयो capture गर्ने timestamped, structured event record। Log entry ले exact state record गर्छ: कुन user ले कुन request गर्यो, database query के थियो, कुन error return भयो। Log specific event बुझ्नको लागि primary forensic tool हो। **Traces** — distributed service मार्फत single request को journey को end-to-end record। Trace **span** (प्रत्येक service hop को लागि एउटा) बाट बनेको छ, प्रत्येकले service name, operation, start time, duration, र status record गर्छ। Span को parent-child relationship ले full call tree reconstruct गर्छ, 12-service call chain मा request ले ठ्याक्कै कहाँ 800ms बिताएको देख्न सम्भव हुन्छ। प्रत्येक pillar ले different diagnostic question को जवाफ दिन्छ: metric ले भन्छ **कुनै कुरा गलत छ**, log ले भन्छ **के भयो**, trace ले भन्छ **distributed system मा कहाँ गलत भयो**।",
    jp: "**オブザーバビリティ**とは、外部出力だけからシステムの内部状態を理解できる能力です。これは従来のモニタリングとは根本的に異なります：モニタリングは既知の障害モードをチェックします（「CPU が 80% を超えているか？」「ヘルスチェックエンドポイントは 200 を返しているか？」）— 事前定義された閾値がいつ超えられたかを教えてくれます。オブザーバビリティはさらに踏み込みます；**未知の未知**を調査できます — 予期しなかったため、アラートを書くことすらなかった障害。複雑な分散システムでは、ほとんどの本番インシデントは新しいものです：バグは特定の時間帯の特定の負荷パターン下での 3 つのサービス間の相互作用にあります。閾値ベースのアラートでは予測できなかったでしょう。オブザーバビリティの 3 つの柱は：**メトリクス** — 時間をかけて集約された数値測定値。例：CPU 使用率 %・HTTP リクエストレート（リクエスト/秒）・エラーレート（エラー/総リクエスト）・レイテンシーパーセンタイル（p50/p95/p99 ミリ秒）。メトリクスは保存コストが低く（時間間隔ごとに 1 つの数値）、クエリが速く、ダッシュボードとアラートに最適です。しかし詳細を集約してしまいます — p99 レイテンシースパイクは何かが遅いことを示しますが、どのリクエストやコードパスかはわかりません。**ログ** — 特定の瞬間に何が起きたかを捉えるタイムスタンプ付きの構造化イベントレコード。ログエントリは正確な状態を記録します：どのユーザーがどのリクエストを行ったか、データベースクエリは何だったか、どのエラーが返されたか。ログは特定のイベントを理解するための主要なフォレンジックツールです。**トレース** — 分散サービスを通じた単一リクエストのジャーニーのエンドツーエンドの記録。トレースは**スパン**（サービスホップごとに 1 つ）で構成され、それぞれがサービス名・操作・開始時刻・期間・ステータスを記録します。スパンの親子関係が完全なコールツリーを再構築し、12 サービスのコールチェーンでリクエストがどこで 800ms を費やしたかを正確に確認できます。各柱は異なる診断の質問に答えます：メトリクスは**何かがおかしい**と教え、ログは**何が起きたか**を教え、トレースは**分散システムのどこで問題が発生したか**を教えます。",
  } as const,
  o2: {
    en: "**Structured logging** (emitting logs as JSON rather than free-form text) is a prerequisite for effective observability at scale. Unstructured text logs are readable by humans but nearly impossible to query efficiently at high volume: `grep`-based tools break down when you have 10,000 log lines per second across 200 pods. Every structured log record should include: `timestamp` (ISO 8601, UTC), `level` (INFO/WARN/ERROR/DEBUG), `service` (the emitting service name), `trace_id` (the distributed trace ID for cross-signal correlation), `span_id`, `request_id`, and the event `message`. Log aggregation platforms (Grafana Loki, Elasticsearch/ELK stack, AWS CloudWatch Logs Insights, Google Cloud Logging) index these structured fields for millisecond-latency queries: `level=ERROR AND service=payment-api AND trace_id=abc123`. **OpenTelemetry (OTel)** is the CNCF-standard instrumentation framework — a vendor-neutral SDK that instruments your application to emit metrics, logs, and traces in a standard wire format (OTLP protocol). You instrument your code once with the OTel SDK and configure exporters to send data to any backend: Prometheus (metrics), Jaeger or Grafana Tempo (traces), Loki (logs), or commercial platforms like Datadog, Honeycomb, or New Relic. This avoids vendor lock-in and lets you switch backends without re-instrumenting code. Two complementary methods guide what to instrument. The **RED method** (Rate, Errors, Duration) defines the three fundamental metrics to track on every service endpoint: request rate (how many requests/second), error rate (what fraction return errors), and duration/latency (how long requests take, at p50/p95/p99). The **USE method** (Utilization, Saturation, Errors) applies to every infrastructure resource: CPU utilization % (Utilization), request queue depth or threads waiting (Saturation), and error counters (Errors). Together, RED covers user-facing service health and USE covers the infrastructure beneath. **Cardinality** is the critical Prometheus scaling challenge: each unique combination of label values creates a new time series. Labels with unbounded cardinality — `user_id`, `request_id`, `URL path with IDs` — explode the number of series (Prometheus may manage millions) causing memory exhaustion and slow queries. Rule: use low-cardinality labels in metrics (e.g. `method`, `status_code`, `endpoint` — not `user_id`). For high-cardinality data, use tracing: a trace can carry arbitrary key-value attributes without affecting Prometheus performance.",
    np: "**Structured logging** (free-form text को सट्टा JSON को रूपमा log emit गर्नु) scale मा effective observability को prerequisite हो। Unstructured text log human ले readable छ तर high volume मा efficiently query गर्न लगभग impossible छ: `grep`-based tool ले 200 pod मा प्रति second 10,000 log line हुँदा काम गर्दैन। प्रत्येक structured log record मा हुनुपर्छ: `timestamp` (ISO 8601, UTC), `level` (INFO/WARN/ERROR/DEBUG), `service` (emitting service name), `trace_id` (cross-signal correlation को लागि distributed trace ID), `span_id`, `request_id`, र event `message`। Log aggregation platform (Grafana Loki, Elasticsearch/ELK stack, AWS CloudWatch Logs Insights, Google Cloud Logging) ले millisecond-latency query को लागि यी structured field index गर्छन्: `level=ERROR AND service=payment-api AND trace_id=abc123`। **OpenTelemetry (OTel)** CNCF-standard instrumentation framework हो — vendor-neutral SDK जसले standard wire format (OTLP protocol) मा metric, log, र trace emit गर्न application instrument गर्छ। OTel SDK सँग code एकपटक instrument गर्नुहोस् र कुनै पनि backend मा data पठाउन exporter configure गर्नुहोस्: Prometheus (metric), Jaeger वा Grafana Tempo (trace), Loki (log), वा Datadog, Honeycomb, वा New Relic जस्तो commercial platform। यसले vendor lock-in बाट बच्छ र code re-instrument नगरी backend switch गर्न दिन्छ। दुईवटा complementary method ले के instrument गर्ने guide गर्छन्। **RED method** (Rate, Errors, Duration) ले प्रत्येक service endpoint मा track गर्ने तीनवटा fundamental metric define गर्छ: request rate (कति requests/second), error rate (कति fraction error return गर्छ), र duration/latency (request कति समय लिन्छ, p50/p95/p99 मा)। **USE method** (Utilization, Saturation, Errors) ले प्रत्येक infrastructure resource मा apply हुन्छ: CPU utilization % (Utilization), request queue depth वा thread waiting (Saturation), र error counter (Errors)। मिलेर, RED ले user-facing service health र USE ले underlying infrastructure cover गर्छ। **Cardinality** critical Prometheus scaling challenge हो: label value को प्रत्येक unique combination ले new time series create गर्छ। Unbounded cardinality भएको label — `user_id`, `request_id`, `URL path with ID` — ले series को संख्या explode गर्छ (Prometheus ले million manage गर्न सक्छ) memory exhaustion र slow query ल्याउँछ। Rule: metric मा low-cardinality label प्रयोग गर्नुहोस् (जस्तै `method`, `status_code`, `endpoint` — `user_id` होइन)। High-cardinality data को लागि, tracing प्रयोग गर्नुहोस्: trace ले Prometheus performance affect नगरी arbitrary key-value attribute carry गर्न सक्छ।",
    jp: "**構造化ログ**（自由形式のテキストではなく JSON としてログを出力する）は、大規模での効果的なオブザーバビリティの前提条件です。非構造化テキストログは人間が読みやすいですが、大量では効率的にクエリすることがほぼ不可能です：200 ポッドで毎秒 10,000 ログ行がある場合、`grep` ベースのツールは機能しません。すべての構造化ログレコードには以下を含める必要があります：`timestamp`（ISO 8601・UTC）・`level`（INFO/WARN/ERROR/DEBUG）・`service`（出力サービス名）・`trace_id`（クロスシグナル相関のための分散トレース ID）・`span_id`・`request_id`・イベント `message`。ログ集約プラットフォーム（Grafana Loki・Elasticsearch/ELK スタック・AWS CloudWatch Logs Insights・Google Cloud Logging）はこれらの構造化フィールドをミリ秒レイテンシーのクエリ用にインデックスします：`level=ERROR AND service=payment-api AND trace_id=abc123`。**OpenTelemetry（OTel）**は CNCF 標準の計装フレームワークです — 標準ワイヤーフォーマット（OTLP プロトコル）でメトリクス・ログ・トレースを出力するようアプリケーションを計装するベンダー中立の SDK。OTel SDK でコードを一度計装し、任意のバックエンドにデータを送信するエクスポーターを設定します：Prometheus（メトリクス）・Jaeger または Grafana Tempo（トレース）・Loki（ログ）・または Datadog・Honeycomb・New Relic などの商用プラットフォーム。これによりベンダーロックインを避け、コードを再計装せずにバックエンドを切り替えられます。2 つの補完的な方法が何を計装すべきかをガイドします。**RED メソッド**（Rate・Errors・Duration）はすべてのサービスエンドポイントで追跡する 3 つの基本メトリクスを定義します：リクエストレート（リクエスト/秒）・エラーレート（どれだけの割合がエラーを返すか）・期間/レイテンシー（p50/p95/p99 でリクエストにかかる時間）。**USE メソッド**（Utilization・Saturation・Errors）はすべてのインフラリソースに適用されます：CPU 使用率 %（Utilization）・リクエストキュー深度または待機スレッド（Saturation）・エラーカウンター（Errors）。合わせると RED はユーザー向けサービスの健全性を、USE はその下のインフラをカバーします。**カーディナリティ**は重要な Prometheus スケーリングの課題です：ラベル値の各ユニークな組み合わせが新しい時系列を作成します。無制限のカーディナリティを持つラベル — `user_id`・`request_id`・`ID を含む URL パス` — は系列数を爆発させ（Prometheus は数百万を管理する可能性がある）メモリ枯渇と遅いクエリを引き起こします。ルール：メトリクスには低カーディナリティのラベルを使用する（例：`method`・`status_code`・`endpoint` — `user_id` ではない）。高カーディナリティデータにはトレーシングを使用する：トレースは Prometheus のパフォーマンスに影響せず任意のキーバリュー属性を運ぶことができます。",
  } as const,
};

export const DEVOPS_DAY_85_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The three pillars — metrics, logs & traces compared",
        np: "तीन pillar — metrics, logs र traces तुलना",
        jp: "3 つの柱 — メトリクス・ログ・トレースの比較",
      },
      blocks: [
        { type: "diagram", id: "devops-observability-pillars" },
        {
          type: "table",
          caption: {
            en: "Observability pillars — purpose, tools, data format, query language",
            np: "Observability pillar — purpose, tools, data format, query language",
            jp: "オブザーバビリティの柱 — 目的・ツール・データ形式・クエリ言語",
          },
          headers: [
            { en: "Pillar", np: "Pillar", jp: "柱" },
            {
              en: "What it answers",
              np: "के जवाफ दिन्छ",
              jp: "何に答えるか",
            },
            { en: "Tools", np: "Tools", jp: "ツール" },
            { en: "Data format", np: "Data format", jp: "データ形式" },
            { en: "Query example", np: "Query example", jp: "クエリ例" },
          ],
          rows: [
            [
              { en: "Metrics", np: "Metrics", jp: "メトリクス" },
              {
                en: "Is something wrong? (aggregated health signals over time)",
                np: "के कुनै कुरा गलत छ? (समयसँगै aggregated health signal)",
                jp: "何かおかしいか？（時間をかけて集約された健全性シグナル）",
              },
              {
                en: "Prometheus, Grafana, Datadog, CloudWatch",
                np: "Prometheus, Grafana, Datadog, CloudWatch",
                jp: "Prometheus・Grafana・Datadog・CloudWatch",
              },
              {
                en: "Float64 value + labels + timestamp (time series)",
                np: "Float64 value + label + timestamp (time series)",
                jp: "Float64 値 + ラベル + タイムスタンプ（時系列）",
              },
              {
                en: "`rate(http_requests_total[5m])`",
                np: "`rate(http_requests_total[5m])`",
                jp: "`rate(http_requests_total[5m])`",
              },
            ],
            [
              { en: "Logs", np: "Logs", jp: "ログ" },
              {
                en: "What happened at this specific moment for this request?",
                np: "यो specific moment मा यो request को लागि के भयो?",
                jp: "この特定の瞬間にこのリクエストで何が起きたか？",
              },
              {
                en: "Loki, Elasticsearch, CloudWatch Logs, Splunk",
                np: "Loki, Elasticsearch, CloudWatch Logs, Splunk",
                jp: "Loki・Elasticsearch・CloudWatch Logs・Splunk",
              },
              {
                en: "JSON / structured key-value with timestamp",
                np: "timestamp सहित JSON / structured key-value",
                jp: "タイムスタンプ付き JSON / 構造化キーバリュー",
              },
              {
                en: "`{service=\"api\"} |= \"ERROR\" | json | level=\"ERROR\"`",
                np: "`{service=\"api\"} |= \"ERROR\" | json | level=\"ERROR\"`",
                jp: "`{service=\"api\"} |= \"ERROR\" | json | level=\"ERROR\"`",
              },
            ],
            [
              { en: "Traces", np: "Traces", jp: "トレース" },
              {
                en: "Where in the distributed call chain did this request slow down or fail?",
                np: "Distributed call chain मा यो request कहाँ slow भयो वा fail भयो?",
                jp: "分散コールチェーンのどこでこのリクエストが遅くなったか失敗したか？",
              },
              {
                en: "Jaeger, Zipkin, Grafana Tempo, Honeycomb, Datadog APM",
                np: "Jaeger, Zipkin, Grafana Tempo, Honeycomb, Datadog APM",
                jp: "Jaeger・Zipkin・Grafana Tempo・Honeycomb・Datadog APM",
              },
              {
                en: "Spans (trace_id, span_id, parent_span_id, duration, attributes)",
                np: "Span (trace_id, span_id, parent_span_id, duration, attribute)",
                jp: "スパン（trace_id・span_id・parent_span_id・duration・attributes）",
              },
              {
                en: "Search by trace_id; filter spans > 500ms; group by service",
                np: "trace_id बाट search; 500ms भन्दा बढी span filter; service अनुसार group",
                jp: "trace_id で検索；500ms を超えるスパンのフィルタリング；サービスでグループ化",
              },
            ],
            [
              { en: "Events", np: "Events", jp: "イベント" },
              {
                en: "What discrete things happened? (deploys, config changes, alerts fired)",
                np: "के discrete कुरा भयो? (deploy, config change, alert fired)",
                jp: "どのような離散的な事象が起きたか？（デプロイ・設定変更・アラート発火）",
              },
              {
                en: "Grafana annotations, PagerDuty, OpsGenie, custom webhooks",
                np: "Grafana annotation, PagerDuty, OpsGenie, custom webhook",
                jp: "Grafana アノテーション・PagerDuty・OpsGenie・カスタム Webhook",
              },
              {
                en: "Timestamped record with tags and description",
                np: "Tag र description सहित timestamped record",
                jp: "タグと説明付きのタイムスタンプ付きレコード",
              },
              {
                en: "Overlay on Grafana dashboards as vertical markers",
                np: "Grafana dashboard मा vertical marker को रूपमा overlay",
                jp: "Grafana ダッシュボード上に縦マーカーとしてオーバーレイ",
              },
            ],
            [
              { en: "Profiles", np: "Profiles", jp: "プロファイル" },
              {
                en: "Which lines of code are consuming the most CPU/memory right now?",
                np: "अहिले कुन code line ले सबैभन्दा धेरै CPU/memory consume गर्दैछ?",
                jp: "今どのコード行が最も多くの CPU/メモリを消費しているか？",
              },
              {
                en: "Grafana Pyroscope, Parca, Google Cloud Profiler",
                np: "Grafana Pyroscope, Parca, Google Cloud Profiler",
                jp: "Grafana Pyroscope・Parca・Google Cloud Profiler",
              },
              {
                en: "Flamegraphs — call stack + time/memory attribution",
                np: "Flamegraph — call stack + time/memory attribution",
                jp: "フレームグラフ — コールスタック + 時間/メモリの帰属",
              },
              {
                en: "Filter flamegraph by function name; compare two time windows",
                np: "Function name बाट flamegraph filter; दुईवटा time window compare",
                jp: "関数名でフレームグラフをフィルタリング；2 つの時間ウィンドウを比較",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "SLI/SLO/SLA, RED/USE methods & structured logging",
        np: "SLI/SLO/SLA, RED/USE method र structured logging",
        jp: "SLI/SLO/SLA・RED/USE メソッド・構造化ログ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Structured logging, SLI/SLO, RED/USE metrics, OpenTelemetry setup & Prometheus alerting rule",
            np: "Structured logging, SLI/SLO, RED/USE metric, OpenTelemetry setup र Prometheus alerting rule",
            jp: "構造化ログ・SLI/SLO・RED/USE メトリクス・OpenTelemetry セットアップ・Prometheus アラートルール",
          },
          code: `# ── Structured Logging — BAD vs GOOD ────────────────────────────────

# BAD: unstructured — impossible to query at scale
# [2026-01-15 10:23:45] ERROR user 42 tried to pay but it failed again

# GOOD: structured JSON — every field is queryable
# {
#   "timestamp": "2026-01-15T10:23:45.123Z",  <- ISO 8601 UTC
#   "level":     "ERROR",
#   "service":   "payment-api",
#   "trace_id":  "4bf92f3577b34da6a3ce929d0e0e4736",  <- links to trace
#   "span_id":   "00f067aa0ba902b7",
#   "request_id":"req-8f3a9c",
#   "user_id":   42,                           <- high-cardinality: OK in logs
#   "message":   "payment processing failed",
#   "error":     "upstream timeout after 5001ms",
#   "amount_usd": 99.99,
#   "provider":  "stripe"
# }

# ── SLI / SLO / SLA Definitions (as comments) ────────────────────────

# SLI (Service Level Indicator) — the metric you measure
#   Example: availability = successful_requests / total_requests * 100
#   Example: p99_latency = 99th percentile of response time in ms

# SLO (Service Level Objective) — the target you commit to internally
#   Example: availability SLO = 99.9%  (allows 43.8 min downtime/month)
#   Example: p99 latency SLO  = < 200ms over any rolling 30-day window

# SLA (Service Level Agreement) — the contractual promise to customers
#   Example: SLA = 99.5% availability (weaker than SLO — SLO is a buffer)

# Error Budget = 100% - SLO
#   99.9% SLO -> 0.1% error budget -> 43.8 min/month allowed downtime
#   When error budget is exhausted: freeze feature work, focus on reliability

# ── RED Method — Python + prometheus_client ───────────────────────────
# Rate, Errors, Duration on every HTTP endpoint

from prometheus_client import Counter, Histogram, start_http_server
import time

# Rate: how many requests per second?
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"]  # low-cardinality labels only
)

# Errors: fraction of requests returning 5xx
ERROR_COUNT = Counter(
    "http_errors_total",
    "Total HTTP errors (5xx)",
    ["method", "endpoint"]
)

# Duration: latency distribution at p50/p95/p99
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["method", "endpoint"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
)

def handle_request(method, endpoint):
    start = time.time()
    try:
        # ... handle request ...
        status = 200
        REQUEST_COUNT.labels(method=method, endpoint=endpoint,
                             status_code=str(status)).inc()
    except Exception:
        status = 500
        ERROR_COUNT.labels(method=method, endpoint=endpoint).inc()
        REQUEST_COUNT.labels(method=method, endpoint=endpoint,
                             status_code=str(status)).inc()
        raise
    finally:
        REQUEST_LATENCY.labels(method=method,
                               endpoint=endpoint).observe(time.time() - start)

# ── USE Method — node_exporter Prometheus metrics (infrastructure) ────
# Utilization, Saturation, Errors on every resource

# CPU Utilization: what % of capacity is used?
#   rate(node_cpu_seconds_total{mode!="idle"}[5m]) / count(node_cpu_seconds_total{mode="idle"})

# CPU Saturation: are processes waiting for CPU (run queue)?
#   node_load1 / count(node_cpu_seconds_total{mode="idle"})

# Memory Utilization: what % of RAM is used?
#   (node_memory_MemTotal_bytes - node_memory_MemAvailable_bytes) / node_memory_MemTotal_bytes

# Disk Utilization: what % of disk I/O time is active?
#   rate(node_disk_io_time_seconds_total[5m])

# Network Errors: are packets being dropped?
#   rate(node_network_receive_errs_total[5m])

# ── OpenTelemetry SDK Setup (Python) ─────────────────────────────────
from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.grpc.metric_exporter import OTLPMetricExporter

# Configure trace exporter — sends to OTel Collector (Jaeger/Tempo backend)
tracer_provider = TracerProvider()
tracer_provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(tracer_provider)
tracer = trace.get_tracer(__name__)

# Use tracer in your code
with tracer.start_as_current_span("process-payment") as span:
    span.set_attribute("payment.user_id", user_id)   # high-cardinality OK in traces
    span.set_attribute("payment.amount_usd", amount)
    # ... process payment ...

# ── Prometheus Alerting Rule — SLO Error Budget Burn Rate ─────────────
# Alert when error budget is burning 5x faster than expected over 1 hour
# (multiwindow, multi-burn-rate alert — Google SRE book pattern)
#
# groups:
#   - name: slo-alerts
#     rules:
#       - alert: HighErrorBudgetBurnRate
#         expr: |
#           (
#             rate(http_errors_total[1h]) / rate(http_requests_total[1h]) > 5 * 0.001
#           ) and (
#             rate(http_errors_total[5m]) / rate(http_requests_total[5m]) > 5 * 0.001
#           )
#         for: 2m
#         labels:
#           severity: critical
#         annotations:
#           summary: "Error budget burning at 5x rate — SLO at risk"
#           description: "Error rate \${{ $labels.endpoint }} is \${{ $value | humanizePercentage }}"`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Instrument a simple Python Flask (or Go) HTTP service with all three RED method metrics using `prometheus_client` (Python) or the official Prometheus Go client. Create three metric objects: a `Counter` named `http_requests_total` with labels `[method, endpoint, status_code]`, a `Counter` named `http_errors_total` with labels `[method, endpoint]`, and a `Histogram` named `http_request_duration_seconds` with labels `[method, endpoint]` and realistic latency buckets. Wrap your route handler in a try/finally block to always record latency and always increment the request counter (even on errors). Run the service and use `curl` to send 50 successful requests and 10 intentional error requests to different endpoints. Open `http://localhost:8000/metrics` and verify all three metric families appear. Then run Prometheus locally (via Docker: `docker run -p 9090:9090 prom/prometheus`) with a scrape config targeting your service, and write PromQL queries to compute: (1) current request rate per endpoint, (2) error rate as a fraction, (3) p99 latency using `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))`.",
              np: "Python Flask (वा Go) HTTP service लाई `prometheus_client` (Python) वा official Prometheus Go client प्रयोग गरेर तीनैवटा RED method metric सँग instrument गर्नुहोस्। तीनवटा metric object create गर्नुहोस्: labels `[method, endpoint, status_code]` सहित `http_requests_total` नाम भएको `Counter`, labels `[method, endpoint]` सहित `http_errors_total` नाम भएको `Counter`, र labels `[method, endpoint]` र realistic latency bucket सहित `http_request_duration_seconds` नाम भएको `Histogram`। Latency सधैं record गर्न र request counter सधैं increment गर्न (error मा पनि) route handler लाई try/finally block मा wrap गर्नुहोस्। Service run गर्नुहोस् र different endpoint मा 50 successful request र 10 intentional error request पठाउन `curl` प्रयोग गर्नुहोस्। `http://localhost:8000/metrics` open गर्नुहोस् र तीनैवटा metric family appear भएको verify गर्नुहोस्। त्यसपछि तपाईंको service target गर्ने scrape config सहित locally Prometheus run गर्नुहोस् (Docker मार्फत: `docker run -p 9090:9090 prom/prometheus`) र compute गर्न PromQL query लेख्नुहोस्: (१) endpoint अनुसार current request rate, (२) fraction को रूपमा error rate, (३) `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` प्रयोग गरेर p99 latency।",
              jp: "`prometheus_client`（Python）または公式 Prometheus Go クライアントを使用して、すべての 3 つの RED メソッドメトリクスでシンプルな Python Flask（または Go）HTTP サービスを計装する。3 つのメトリクスオブジェクトを作成する：ラベル `[method, endpoint, status_code]` を持つ `http_requests_total` という `Counter`、ラベル `[method, endpoint]` を持つ `http_errors_total` という `Counter`、ラベル `[method, endpoint]` と現実的なレイテンシーバケットを持つ `http_request_duration_seconds` という `Histogram`。レイテンシーを常に記録してリクエストカウンターを常にインクリメントする（エラー時も）ために、ルートハンドラーを try/finally ブロックで囲む。サービスを実行し、`curl` を使って異なるエンドポイントに 50 の成功リクエストと 10 の意図的なエラーリクエストを送信する。`http://localhost:8000/metrics` を開いて 3 つすべてのメトリクスファミリーが表示されることを確認する。次にサービスをターゲットとするスクレイプ設定で Prometheus をローカルで実行し（Docker 経由：`docker run -p 9090:9090 prom/prometheus`）、次を計算する PromQL クエリを書く：(1) エンドポイントごとの現在のリクエストレート、(2) 割合としてのエラーレート、(3) `histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))` を使用した p99 レイテンシー。",
            },
            {
              en: "Practice structured logging and trace correlation in a two-service setup. Write two small HTTP services (Service A calls Service B). In Service A, generate a UUID `trace_id` and `request_id` for each incoming request and inject both into every log line as JSON fields. When Service A calls Service B, propagate the `trace_id` as an HTTP header (`X-Trace-Id`). In Service B, read the `X-Trace-Id` header and include it in all its log lines. Run both services and make several requests through Service A. Then grep/jq the logs and verify you can correlate all log lines from both services for a single request using the `trace_id`. Compare this to the same exercise without structured logging: search for the same request using only text grep — observe how much harder it is. This demonstrates why structured logging with a correlation ID is the foundation of observability in distributed systems. As an extension, add OpenTelemetry auto-instrumentation (`opentelemetry-instrument python app.py`) and see the trace spans in Jaeger (`docker run -p 16686:16686 jaegertracing/all-in-one`).",
              np: "दुईवटा service setup मा structured logging र trace correlation practice गर्नुहोस्। दुईवटा small HTTP service लेख्नुहोस् (Service A ले Service B call गर्छ)। Service A मा, प्रत्येक incoming request को लागि UUID `trace_id` र `request_id` generate गर्नुहोस् र दुवैलाई JSON field को रूपमा हरेक log line मा inject गर्नुहोस्। Service A ले Service B call गर्दा, `trace_id` लाई HTTP header (`X-Trace-Id`) को रूपमा propagate गर्नुहोस्। Service B मा, `X-Trace-Id` header पढ्नुहोस् र यसलाई आफ्ना सबै log line मा include गर्नुहोस्। दुवै service run गर्नुहोस् र Service A मार्फत धेरैवटा request गर्नुहोस्। त्यसपछि log grep/jq गर्नुहोस् र `trace_id` प्रयोग गरेर single request को लागि दुवै service बाट सबै log line correlate गर्न सक्नुहुन्छ verify गर्नुहोस्। Structured logging बिना same exercise सँग compare गर्नुहोस्: text grep मात्र प्रयोग गरेर same request खोज्नुहोस् — कति गाह्रो छ observe गर्नुहोस्। यसले distributed system मा structured logging with correlation ID किन observability को foundation हो demonstrate गर्छ। Extension को रूपमा, OpenTelemetry auto-instrumentation (`opentelemetry-instrument python app.py`) add गर्नुहोस् र Jaeger मा trace span हेर्नुहोस् (`docker run -p 16686:16686 jaegertracing/all-in-one`)।",
              jp: "2 つのサービス設定で構造化ログとトレース相関を練習する。2 つの小さな HTTP サービスを書く（サービス A がサービス B を呼び出す）。サービス A で、各受信リクエストに UUID `trace_id` と `request_id` を生成し、両方をすべてのログ行に JSON フィールドとして注入する。サービス A がサービス B を呼び出す際、`trace_id` を HTTP ヘッダー（`X-Trace-Id`）として伝播する。サービス B で `X-Trace-Id` ヘッダーを読み取り、すべてのログ行に含める。両方のサービスを実行し、サービス A を通じていくつかのリクエストを行う。次にログを grep/jq して、`trace_id` を使って単一リクエストの両サービスからすべてのログ行を相関させられることを確認する。構造化ログなしの同じ演習と比較する：テスト grep のみを使って同じリクエストを検索する — どれほど難しいかを観察する。これは分散システムにおいて相関 ID を持つ構造化ログがオブザーバビリティの基盤である理由を示します。拡張として、OpenTelemetry 自動計装（`opentelemetry-instrument python app.py`）を追加し、Jaeger でトレーススパンを確認する（`docker run -p 16686:16686 jaegertracing/all-in-one`）。",
            },
            {
              en: "Define SLIs and SLOs for a fictional API service and implement a Prometheus alerting rule based on error budget burn rate. Define two SLIs: availability (successful requests / total requests) and p99 latency (< 200ms). Set SLOs: 99.9% availability and 99% of requests under 200ms. Calculate the error budgets: availability budget = 0.1% = 43.8 minutes/month; latency budget = 1% of requests may exceed 200ms. Write a Prometheus alerting rule file (`slo-alerts.yaml`) with two alerts: (1) an availability burn rate alert that fires when the 1-hour error rate exceeds 5x the budget burn rate AND the 5-minute rate also exceeds 5x (multi-window to reduce false positives); (2) a latency SLO alert based on `histogram_quantile`. Load the rules into Prometheus and use `promtool check rules slo-alerts.yaml` to validate syntax. Then use `curl` to send a burst of 5xx responses to your test service and watch the alert transition from `inactive` → `pending` → `firing` in the Prometheus Alerts UI (`http://localhost:9090/alerts`). Document in comments what \"5x burn rate\" means: if you're burning budget 5x faster than steady state, you'll exhaust the monthly budget in 1/5th the time — 6 days instead of 30.",
              np: "Fictional API service को लागि SLI र SLO define गर्नुहोस् र error budget burn rate मा based Prometheus alerting rule implement गर्नुहोस्। दुईवटा SLI define गर्नुहोस्: availability (successful requests / total requests) र p99 latency (< 200ms)। SLO set गर्नुहोस्: 99.9% availability र 200ms भन्दा कम 99% request। Error budget calculate गर्नुहोस्: availability budget = 0.1% = 43.8 minutes/month; latency budget = 1% request ले 200ms exceed गर्न सक्छ। दुईवटा alert सहित Prometheus alerting rule file (`slo-alerts.yaml`) लेख्नुहोस्: (१) 1-hour error rate budget burn rate भन्दा 5x बढी हुँदा fire हुने availability burn rate alert र 5-minute rate पनि 5x बढी हुँदा (false positive कम गर्न multi-window); (२) `histogram_quantile` मा based latency SLO alert। Rule Prometheus मा load गर्नुहोस् र syntax validate गर्न `promtool check rules slo-alerts.yaml` प्रयोग गर्नुहोस्। त्यसपछि test service मा 5xx response को burst पठाउन `curl` प्रयोग गर्नुहोस् र Prometheus Alerts UI (`http://localhost:9090/alerts`) मा alert `inactive` → `pending` → `firing` transition हुन्छ हेर्नुहोस्। Comment मा document गर्नुहोस् \"5x burn rate\" भनेको के हो: steady state भन्दा 5x तेज budget burn गर्दैहुनुहुन्छ भने, 1/5 समयमा monthly budget exhaust हुन्छ — 30 को सट्टा 6 दिनमा।",
              jp: "架空の API サービスの SLI と SLO を定義し、エラーバジェット消費率に基づいた Prometheus アラートルールを実装する。2 つの SLI を定義する：可用性（成功リクエスト / 総リクエスト）と p99 レイテンシー（200ms 未満）。SLO を設定する：99.9% の可用性と 200ms 未満のリクエストの 99%。エラーバジェットを計算する：可用性バジェット = 0.1% = 43.8 分/月；レイテンシーバジェット = 1% のリクエストが 200ms を超えてもよい。2 つのアラートを持つ Prometheus アラートルールファイル（`slo-alerts.yaml`）を書く：(1) 1 時間のエラーレートがバジェット消費率の 5 倍を超え、5 分間のレートも 5 倍を超える場合に発火する可用性バーンレートアラート（誤報を減らすためのマルチウィンドウ）；(2) `histogram_quantile` に基づくレイテンシー SLO アラート。ルールを Prometheus にロードし、`promtool check rules slo-alerts.yaml` で構文を検証する。次に `curl` を使ってテストサービスに 5xx レスポンスのバーストを送信し、Prometheus アラート UI（`http://localhost:9090/alerts`）でアラートが `inactive` → `pending` → `firing` に遷移するのを見る。コメントに「5x バーンレート」が何を意味するかをドキュメント化する：定常状態より 5 倍速くバジェットを消費している場合、30 日ではなく 6 日で月次バジェットを使い果たすことになります。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between monitoring and observability, and why does the distinction matter?",
        np: "Monitoring र observability बीचको फरक के हो, र यो distinction किन महत्त्वपूर्ण छ?",
        jp: "モニタリングとオブザーバビリティの違いは何か、そしてなぜその区別が重要なのか？",
      },
      answer: {
        en: "The distinction is not semantic pedantry — it fundamentally changes how you build and operate systems. **Monitoring** is the practice of collecting and checking a predefined set of metrics and conditions. You decide in advance what signals matter (CPU > 80%, health endpoint returns non-200, queue depth > 1000) and you configure alerts for those thresholds. Monitoring is excellent for **known unknowns** — failure modes you have seen before or can reason about in advance. If your database ran out of disk space last month, you add a disk utilisation alert. Next time it happens, you'll be paged in time. But monitoring has a fundamental limitation: it can only alert on conditions you anticipated. The moment something new fails — a race condition between two microservices that only manifests under a specific concurrency pattern, a memory leak in a third-party library triggered by a specific UTF-8 sequence in user input — no threshold you pre-configured will fire. You are blind to **unknown unknowns**. **Observability** is the property of a system that allows you to ask arbitrary questions about its internal state and get answers — without deploying new code or adding new instrumentation. An observable system emits rich, interconnected telemetry (metrics, logs, traces all sharing correlation IDs) so that when something breaks in an unexpected way, you can explore the data interactively to find the cause. The key is **exploration**: with observability tooling, an engineer can say \"show me all requests that took longer than 2 seconds in the last 10 minutes, group by downstream service, for users whose account type is 'enterprise'\" — a query that no pre-written alert could have anticipated. This is what incident investigations in complex systems actually look like: exploratory, iterative, hypothesis-driven. **Why the distinction matters for DevOps engineers**: when you are designing instrumentation, monitoring mindset leads you to instrument only what you currently alert on — minimum viable telemetry. Observability mindset leads you to emit rich telemetry at every important decision point, with full context (user ID, request ID, feature flags active, upstream service versions) — because you do not know in advance which context will matter when debugging a future incident. The cost of emitting a structured log line with 20 fields is negligible; the cost of not having those fields during a 3am production incident is enormous. The practical implication: build both. Use monitoring (Prometheus alerts, CloudWatch alarms) for fast detection of known failure patterns and automatic paging. Use observability tooling (traces in Grafana Tempo, logs in Loki) for investigation and root cause analysis once the alert fires. Neither replaces the other.",
        np: "यो distinction semantic pedantry होइन — यसले system कसरी build र operate गर्ने fundamentally बदल्छ। **Monitoring** पूर्व-निर्धारित set of metric र condition collect र check गर्ने practice हो। तपाईंले advance मा कुन signal महत्त्वपूर्ण छ decide गर्नुहुन्छ (CPU > 80%, health endpoint non-200 return गर्छ, queue depth > 1000) र ती threshold को लागि alert configure गर्नुहुन्छ। Monitoring **known unknown** को लागि excellent छ — failure mode जुन तपाईंले पहिले देख्नुभयो वा advance मा reason गर्न सक्नुहुन्छ। यदि तपाईंको database गत महिना disk space सकियो भने, disk utilisation alert add गर्नुहुन्छ। अर्को पटक भएमा, समयमा page हुनुहुन्छ। तर monitoring को fundamental limitation छ: यसले तपाईंले anticipate गरेको condition मा मात्र alert गर्न सक्छ। एउटा नयाँ कुरा fail हुने बित्तिकै — specific concurrency pattern मा मात्र manifest हुने दुईवटा microservice बीचको race condition, user input मा specific UTF-8 sequence ले trigger हुने third-party library मा memory leak — तपाईंले pre-configure गरेको कुनै threshold fire हुँदैन। तपाईं **unknown unknown** को बारेमा blind हुनुहुन्छ। **Observability** system को property हो जसले तपाईंलाई new code deploy वा new instrumentation add नगरी internal state को बारेमा arbitrary question सोध्न र जवाफ पाउन दिन्छ। Observable system ले rich, interconnected telemetry (metric, log, trace सबैले correlation ID share गर्दै) emit गर्छ ताकि unexpected तरिकाले केही break भएमा, cause find गर्न data interactively explore गर्न सकियोस्। Key **exploration** हो: observability tooling सँग, engineer भन्न सक्छ \"पछिल्लो 10 minute मा 2 second भन्दा बढी लागेका सबै request देखाउनुहोस्, downstream service अनुसार group गर्नुहोस्, account type 'enterprise' भएको user को लागि\" — कुनै pre-written alert ले anticipate गर्न नसक्ने query। Complex system मा incident investigation actually यस्तै देखिन्छ: exploratory, iterative, hypothesis-driven। **DevOps engineer को लागि distinction किन महत्त्वपूर्ण छ**: instrumentation design गर्दा, monitoring mindset ले currently alert गर्ने कुरा मात्र instrument गर्न lead गर्छ — minimum viable telemetry। Observability mindset ले प्रत्येक important decision point मा full context (user ID, request ID, active feature flag, upstream service version) सहित rich telemetry emit गर्न lead गर्छ — किनभने future incident debug गर्दा कुन context matter गर्छ advance मा थाहा छैन। 20 field भएको structured log line emit गर्ने cost negligible छ; 3am production incident को समयमा ती field नभएको cost enormous छ।",
        jp: "この区別は意味論的なこだわりではありません — システムをどのように構築・運用するかを根本的に変えます。**モニタリング**は事前定義された一連のメトリクスと条件を収集してチェックする実践です。どのシグナルが重要かを事前に決め（CPU > 80%・ヘルスエンドポイントが非 200 を返す・キュー深度 > 1000）、それらの閾値のアラートを設定します。モニタリングは**既知の未知**に優れています — 以前に見たことがある、または事前に推論できる障害モード。先月データベースのディスク容量が不足したなら、ディスク使用率アラートを追加します。次に発生した際は適時に通知を受けます。しかしモニタリングには根本的な限界があります：予期した条件にしかアラートできません。新しい何かが失敗した瞬間 — 特定の並行性パターンでのみ現れる 2 つのマイクロサービス間のレース条件、ユーザー入力の特定の UTF-8 シーケンスによってトリガーされるサードパーティライブラリのメモリリーク — 事前設定した閾値は何も発火しません。**未知の未知**に対して盲目です。**オブザーバビリティ**は、新しいコードをデプロイしたり新しい計装を追加したりせずに、システムの内部状態について任意の質問をして答えを得られるシステムの特性です。観測可能なシステムはリッチで相互接続されたテレメトリ（メトリクス・ログ・トレースがすべて相関 ID を共有）を出力するため、予期しない方法で何かが壊れた際に、インタラクティブにデータを探索して原因を見つけられます。重要なのは**探索**です：オブザーバビリティツールを使えば、エンジニアは「過去 10 分間で 2 秒以上かかったすべてのリクエストをダウンストリームサービス別にグループ化して、アカウントタイプが 'enterprise' のユーザーについて表示して」と言えます — 事前に書かれたアラートでは予測できないクエリ。これが実際の複雑なシステムでのインシデント調査の姿です：探索的・反復的・仮説駆動。**DevOps エンジニアにとって区別が重要な理由**：計装を設計する際、モニタリングの考え方は現在アラートしているものだけを計装することにつながります — 最小限のテレメトリ。オブザーバビリティの考え方は、すべての重要な意思決定ポイントで完全なコンテキスト（ユーザー ID・リクエスト ID・アクティブなフィーチャーフラグ・アップストリームサービスのバージョン）とともにリッチなテレメトリを出力することにつながります — 将来のインシデントのデバッグ時にどのコンテキストが重要になるかを事前に知ることはできないから。20 フィールドを持つ構造化ログ行を出力するコストは無視できるほど小さく、午前 3 時の本番インシデント時にそれらのフィールドを持っていないコストは莫大です。",
      },
      tag: {
        en: "monitoring vs observability",
        np: "monitoring vs observability",
        jp: "モニタリング vs オブザーバビリティ",
      },
    },
    {
      question: {
        en: "What is cardinality in the context of metrics, and why is high cardinality a problem for Prometheus?",
        np: "Metric को context मा cardinality के हो, र high cardinality Prometheus को लागि problem किन हो?",
        jp: "メトリクスの文脈でカーディナリティとは何か、そして高カーディナリティがなぜ Prometheus の問題になるのか？",
      },
      answer: {
        en: "In the context of Prometheus metrics, **cardinality** refers to the total number of unique time series in your database. Each time series is uniquely identified by its metric name plus the full set of label name-value pairs. The cardinality of a metric is the product of the cardinality of each of its labels. For example: `http_requests_total` with labels `method` (4 values: GET/POST/PUT/DELETE) and `status_code` (6 values: 200/201/400/401/404/500) creates 4 × 6 = 24 time series. This is perfectly fine. The problem arises with **high-cardinality labels** — labels whose value set is large or unbounded. Common examples: `user_id` (could be 10 million unique values), `request_id` (completely unique per request), `ip_address` (unbounded), `customer_name` (unbounded string), `url` (if it includes path parameters like `/users/12345/orders/67890`). If you add `user_id` as a label to `http_requests_total` and you have 10 million users, each making requests, Prometheus must maintain 10 million separate time series for that metric alone — multiplied by every other label combination. **Why this is catastrophic for Prometheus**: Prometheus stores all active time series in memory (its TSDB uses a head chunk in RAM for recent data). Each time series requires approximately 3–5 KB of RAM just for its label set and metadata. At 10 million series per metric, you're looking at 30–50 GB of RAM for a single metric. Prometheus typically starts degrading when it exceeds 1–2 million active series: queries become slow (PromQL must iterate over millions of series), scraping starts dropping samples, and the process may OOM-kill. The write path also suffers: Prometheus must index every new label combination on ingestion — high-cardinality label sets cause index thrash. The **correct approach by data type**: use **metrics** with low-cardinality labels for aggregated signals (e.g. `endpoint`, `method`, `status_code`, `region` — typically fewer than 1,000 unique values per label). Use **traces** for high-cardinality per-request data: a trace span can carry `user_id=10234567`, `request_id=abc-xyz-123`, `customer_tier=enterprise` as span attributes without any impact on Prometheus — traces are stored per-document, not as indexed time series. Use **logs** for high-cardinality context that needs to be searchable at incident time. This is the architectural reason all three pillars are needed: they handle data at fundamentally different cardinalities. **Detection**: use `prometheus_tsdb_head_series` metric to monitor your own Prometheus cardinality. The `topk` PromQL function can help identify which metrics are contributing the most series: `topk(10, count by (__name__)({__name__=~\".+\"}))`. If you inherit a Prometheus instance with cardinality problems, the `prometheus_tsdb_symbol_table_size_bytes` metric spiking is often the first warning sign.",
        np: "Prometheus metric को context मा, **cardinality** भनेको database मा unique time series को total संख्या हो। प्रत्येक time series यसको metric name र label name-value pair को full set द्वारा uniquely identify हुन्छ। Metric को cardinality यसका label मध्ये प्रत्येकको cardinality को product हो। उदाहरण: labels `method` (4 value: GET/POST/PUT/DELETE) र `status_code` (6 value: 200/201/400/401/404/500) सहित `http_requests_total` ले 4 × 6 = 24 time series create गर्छ। यो perfectly fine छ। समस्या **high-cardinality label** सँग उत्पन्न हुन्छ — label जसको value set ठूलो वा unbounded छ। Common example: `user_id` (10 million unique value हुन सक्छ), `request_id` (प्रति request completely unique), `ip_address` (unbounded), `customer_name` (unbounded string), `url` (यदि यसमा `/users/12345/orders/67890` जस्तो path parameter छ भने)। `http_requests_total` मा `user_id` label add गर्नुभयो र 10 million user छन् भने, प्रत्येकले request गर्दा, Prometheus ले त्यो metric मात्रको लागि 10 million छुट्टाछुट्टै time series maintain गर्नुपर्छ — अरू प्रत्येक label combination ले multiply हुँदै। **Prometheus को लागि यो catastrophic किन छ**: Prometheus ले सबै active time series memory मा store गर्छ (यसको TSDB ले recent data को लागि RAM मा head chunk प्रयोग गर्छ)। प्रत्येक time series को label set र metadata को लागि मात्र approximately 3–5 KB RAM चाहिन्छ। Single metric मा 10 million series मा, single metric को लागि 30–50 GB RAM हुन्छ। Prometheus ले 1–2 million active series exceed गर्दा degrading सुरु गर्छ: query slow हुन्छ (PromQL ले million series iterate गर्नुपर्छ), scraping ले sample drop गर्छ, र process OOM-kill हुन सक्छ। Write path पनि suffer गर्छ: Prometheus ले ingestion मा प्रत्येक new label combination index गर्नुपर्छ — high-cardinality label set ले index thrash गर्छ। **Data type अनुसार correct approach**: aggregated signal को लागि low-cardinality label सहित **metric** प्रयोग गर्नुहोस् (जस्तै `endpoint`, `method`, `status_code`, `region` — सामान्यतया प्रति label 1,000 भन्दा कम unique value)। Per-request high-cardinality data को लागि **trace** प्रयोग गर्नुहोस्: trace span ले Prometheus मा कुनै impact नगरी `user_id=10234567`, `request_id=abc-xyz-123`, `customer_tier=enterprise` span attribute को रूपमा carry गर्न सक्छ — trace indexed time series को रूपमा होइन per-document store हुन्छ। Incident time मा searchable हुन आवश्यक high-cardinality context को लागि **log** प्रयोग गर्नुहोस्। यो architectural reason हो किन तीनैवटा pillar चाहिन्छ: तिनीहरूले fundamentally different cardinality मा data handle गर्छन्। **Detection**: आफ्नो Prometheus cardinality monitor गर्न `prometheus_tsdb_head_series` metric प्रयोग गर्नुहोस्। `topk` PromQL function ले कुन metric ले सबैभन्दा बढी series contribute गर्दैछ identify गर्न help गर्छ: `topk(10, count by (__name__)({__name__=~\".+\"}))}`।",
        jp: "Prometheus メトリクスの文脈では、**カーディナリティ**はデータベース内のユニークな時系列の総数を指します。各時系列はメトリクス名とラベルの名前-値ペアの完全なセットによって一意に識別されます。メトリクスのカーディナリティはその各ラベルのカーディナリティの積です。例：ラベル `method`（4 値：GET/POST/PUT/DELETE）と `status_code`（6 値：200/201/400/401/404/500）を持つ `http_requests_total` は 4 × 6 = 24 の時系列を作成します。これは全く問題ありません。問題は**高カーディナリティラベル** — 値セットが大きいか無制限のラベル — で発生します。一般的な例：`user_id`（1,000 万のユニークな値になりうる）・`request_id`（リクエストごとに完全にユニーク）・`ip_address`（無制限）・`customer_name`（無制限の文字列）・`url`（`/users/12345/orders/67890` のようなパスパラメータを含む場合）。`http_requests_total` に `user_id` ラベルを追加して 1,000 万ユーザーがいる場合、各ユーザーがリクエストを行うと Prometheus はそのメトリクスだけで 1,000 万の別々の時系列を維持しなければなりません — 他のすべてのラベルの組み合わせで乗算されます。**これが Prometheus にとって壊滅的な理由**：Prometheus はすべてのアクティブな時系列をメモリに保存します（その TSDB は最近のデータのために RAM にヘッドチャンクを使用）。各時系列はラベルセットとメタデータだけで約 3〜5 KB の RAM を必要とします。メトリクスごとに 1,000 万の系列では、単一のメトリクスで 30〜50 GB の RAM になります。Prometheus は通常 100〜200 万のアクティブな系列を超えると劣化し始めます：クエリが遅くなり（PromQL が何百万もの系列を反復しなければならない）、スクレイピングがサンプルを落とし始め、プロセスが OOM-kill される可能性があります。書き込みパスも影響を受けます：Prometheus は取り込み時にすべての新しいラベルの組み合わせをインデックスする必要があります — 高カーディナリティのラベルセットはインデックスのスラッシングを引き起こします。**データタイプ別の正しいアプローチ**：集約シグナルには低カーディナリティラベルを持つ**メトリクス**を使用する（例：`endpoint`・`method`・`status_code`・`region` — 通常ラベルごとに 1,000 未満のユニークな値）。リクエストごとの高カーディナリティデータには**トレース**を使用する：トレーススパンは Prometheus に何の影響も与えずに `user_id=10234567`・`request_id=abc-xyz-123`・`customer_tier=enterprise` をスパン属性として運ぶことができます — トレースはインデックス付き時系列としてではなくドキュメントごとに保存されます。インシデント時に検索可能である必要がある高カーディナリティのコンテキストには**ログ**を使用する。これが 3 つの柱すべてが必要な構造的な理由です：それらは根本的に異なるカーディナリティでデータを処理します。**検出**：`prometheus_tsdb_head_series` メトリクスを使用して自分の Prometheus のカーディナリティを監視する。`topk` PromQL 関数は最も多くの系列に貢献しているメトリクスを特定するのに役立ちます：`topk(10, count by (__name__)({__name__=~\".+\"}))`。",
      },
      tag: {
        en: "cardinality & Prometheus scaling",
        np: "cardinality र Prometheus scaling",
        jp: "カーディナリティと Prometheus のスケーリング",
      },
    },
  ],
};
