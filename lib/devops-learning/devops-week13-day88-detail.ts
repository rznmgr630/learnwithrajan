import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**PromQL** (Prometheus Query Language) is a functional query language designed specifically for time-series data. Unlike SQL, which operates on rows and columns, PromQL operates on **time series** and is built around two concepts: an **instant vector** (the current value of a set of time series at a single point in time) and a **range vector** (the values of a set of time series over a time window). Understanding the difference is essential: `http_requests_total` (no brackets) returns an instant vector — the current value of every matching time series. `http_requests_total[5m]` returns a range vector — the last 5 minutes of samples for every matching series. Range vectors cannot be graphed directly; they must first be passed through an aggregation function like `rate()`, `increase()`, or `delta()`. The `rate(counter[window])` function computes the per-second average increase of a counter over the window, handling counter resets transparently. Use `rate()` with a window at least 4× the scrape interval (for a 15s scrape interval, use `[1m]` minimum) to avoid gaps in the computed rate. `irate()` computes the instantaneous rate from the last two samples — more responsive but noisier. For counters that represent totals where you want the absolute increase over a window (not per-second), use `increase(counter[window])`. PromQL is **strongly typed**: you cannot mix instant vectors and scalars arbitrarily; functions accept specific argument types and the type of the result is deterministic. The `/api/v1/query` endpoint evaluates an instant vector query; `/api/v1/query_range` evaluates over a time range (used by Grafana for graphs).",
    np: "**PromQL** (Prometheus Query Language) time-series data को लागि specifically designed functional query language हो। SQL जस्तो जुन row र column मा operate गर्छ, PromQL ले **time series** मा operate गर्छ र दुईवटा concept मा build भएको छ: **instant vector** (single point in time मा time series को set को current value) र **range vector** (time window मा time series को set को value)। Difference बुझ्नु essential छ: `http_requests_total` (no bracket) ले instant vector return गर्छ — matching time series को current value। `http_requests_total[5m]` ले range vector return गर्छ — प्रत्येक matching series को last 5 minute को sample। Range vector directly graph गर्न सकिँदैन; पहिले `rate()`, `increase()`, वा `delta()` जस्तो aggregation function मार्फत pass गर्नुपर्छ। `rate(counter[window])` function ले window मा counter को per-second average increase compute गर्छ, counter reset transparently handle गर्दै। Gap avoid गर्न scrape interval भन्दा कम्तीमा 4× window सहित `rate()` प्रयोग गर्नुहोस् (15s scrape interval को लागि, minimum `[1m]` प्रयोग गर्नुहोस्)। `irate()` ले last two sample बाट instantaneous rate compute गर्छ — more responsive तर noisier। Per-second होइन window मा absolute increase चाहने total represent गर्ने counter को लागि, `increase(counter[window])` प्रयोग गर्नुहोस्। PromQL **strongly typed** छ: instant vector र scalar arbitrarily mix गर्न सकिँदैन; function ले specific argument type accept गर्छ र result को type deterministic छ।",
    jp: "**PromQL**（Prometheus クエリ言語）は時系列データのために特別に設計された関数型クエリ言語です。行と列で操作する SQL とは異なり、PromQL は**時系列**で操作し、2 つの概念を中心に構築されています：**インスタントベクター**（単一時点での時系列セットの現在の値）と**レンジベクター**（時間ウィンドウにわたる時系列セットの値）。違いを理解することが重要です：`http_requests_total`（括弧なし）はインスタントベクターを返します — 一致するすべての時系列の現在の値。`http_requests_total[5m]` はレンジベクターを返します — すべての一致する系列の過去 5 分間のサンプル。レンジベクターは直接グラフ化できません；`rate()`・`increase()`・`delta()` などの集約関数を通じて渡す必要があります。`rate(counter[window])` 関数はウィンドウ全体のカウンターの 1 秒あたりの平均増加を計算し、カウンターのリセットを透過的に処理します。ギャップを避けるにはスクレイプ間隔の少なくとも 4 倍のウィンドウで `rate()` を使用する（15 秒のスクレイプ間隔には最低 `[1m]` を使用）。`irate()` は最後の 2 つのサンプルから瞬時レートを計算します — より応答的ですがノイズが多い。1 秒あたりではなくウィンドウ全体の絶対的な増加が必要な合計を表すカウンターには `increase(counter[window])` を使用する。PromQL は**強く型付け**されています：インスタントベクターとスケーラーを任意に混在させることはできません；関数は特定の引数タイプを受け入れ、結果のタイプは決定論的です。",
  } as const,
  o2: {
    en: "**Aggregation operators** collapse multiple time series into fewer time series (or a single value). The most important are `sum()`, `avg()`, `min()`, `max()`, `count()`, `topk()`, and `bottomk()`. All support `by` and `without` clauses to control which labels are preserved: `sum by (endpoint) (rate(http_requests_total[5m]))` sums request rates across all instances, grouped by `endpoint` — the `job`, `instance`, and `status_code` labels are dropped. `sum without (instance) (rate(http_requests_total[5m]))` keeps all labels except `instance`. **Binary operations** (arithmetic and comparison) between two instant vectors require label matching. `http_errors_total / http_requests_total` only works if both sides have identical label sets for each pair of series — Prometheus matches series by all labels. Use `on(label1, label2)` to restrict matching to specific labels, or `ignoring(label)` to exclude a label from matching. The `group_left` and `group_right` modifiers enable many-to-one and one-to-many joins — essential for enriching metric data with metadata from another metric. **Subqueries** let you apply range-vector functions to instant-vector queries: `max_over_time(rate(http_requests_total[5m])[1h:5m])` computes the maximum observed per-second request rate over the past hour at 5-minute resolution. Subqueries are powerful but expensive — use sparingly. **Recording rules** pre-compute expensive queries and save the result as a new metric: `record: job:http_requests_total:rate5m` with expression `sum by (job) (rate(http_requests_total[5m]))`. This runs on Prometheus's evaluation interval (every 15s) and stores the result as `job:http_requests_total:rate5m` — dashboards and alerts can query this cached metric instead of recomputing the expensive aggregation on every request.",
    np: "**Aggregation operator** ले multiple time series लाई fewer time series (वा single value) मा collapse गर्छ। सबैभन्दा महत्त्वपूर्ण `sum()`, `avg()`, `min()`, `max()`, `count()`, `topk()`, र `bottomk()` हुन्। सबैले कुन label preserve हुन्छ control गर्न `by` र `without` clause support गर्छन्: `sum by (endpoint) (rate(http_requests_total[5m]))` ले सबै instance मा request rate sum गर्छ, `endpoint` द्वारा group गर्दै — `job`, `instance`, र `status_code` label drop हुन्छन्। `sum without (instance) (rate(http_requests_total[5m]))` ले `instance` बाहेक सबै label राख्छ। दुईवटा instant vector बीचको **Binary operation** (arithmetic र comparison) को लागि label matching चाहिन्छ। `http_errors_total / http_requests_total` ले मात्र काम गर्छ यदि दुवै side मा series को प्रत्येक pair को लागि identical label set छ भने — Prometheus ले सबै label द्वारा series match गर्छ। Specific label मा matching restrict गर्न `on(label1, label2)` प्रयोग गर्नुहोस्, वा matching बाट label exclude गर्न `ignoring(label)` प्रयोग गर्नुहोस्। `group_left` र `group_right` modifier ले many-to-one र one-to-many join enable गर्छ — अर्को metric बाट metadata सँग metric data enrich गर्न essential। **Recording rule** ले expensive query pre-compute गर्छ र result नयाँ metric को रूपमा save गर्छ: expression `sum by (job) (rate(http_requests_total[5m]))` सहित `record: job:http_requests_total:rate5m`। यो Prometheus को evaluation interval (every 15s) मा run हुन्छ र result `job:http_requests_total:rate5m` को रूपमा store गर्छ — dashboard र alert ले हरेक request मा expensive aggregation recompute गर्नुको सट्टा यो cached metric query गर्न सक्छन्।",
    jp: "**集約演算子**は複数の時系列をより少ない時系列（または単一の値）に折りたたみます。最も重要なのは `sum()`・`avg()`・`min()`・`max()`・`count()`・`topk()`・`bottomk()` です。すべては保持するラベルを制御するための `by` と `without` 句をサポートします：`sum by (endpoint) (rate(http_requests_total[5m]))` はすべてのインスタンスのリクエストレートを `endpoint` でグループ化して合計します — `job`・`instance`・`status_code` ラベルは削除されます。`sum without (instance) (rate(http_requests_total[5m]))` は `instance` を除くすべてのラベルを保持します。2 つのインスタントベクター間の**バイナリ演算**（算術と比較）はラベルのマッチングが必要です。`http_errors_total / http_requests_total` は両側の系列の各ペアに同一のラベルセットがある場合にのみ機能します — Prometheus はすべてのラベルで系列をマッチングします。マッチングを特定のラベルに制限するには `on(label1, label2)` を使用し、ラベルをマッチングから除外するには `ignoring(label)` を使用します。`group_left` と `group_right` 修飾子は多対一および一対多の結合を可能にします — 別のメトリクスからのメタデータでメトリクスデータを強化するために不可欠。**サブクエリ**によりインスタントベクタークエリにレンジベクター関数を適用できます：`max_over_time(rate(http_requests_total[5m])[1h:5m])` は 5 分の解像度で過去 1 時間に観測された最大の 1 秒あたりリクエストレートを計算します。**記録ルール**は高コストなクエリを事前計算して結果を新しいメトリクスとして保存します：式 `sum by (job) (rate(http_requests_total[5m]))` を持つ `record: job:http_requests_total:rate5m`。これは Prometheus の評価間隔（15 秒ごと）で実行され、結果を `job:http_requests_total:rate5m` として保存します — ダッシュボードとアラートは高コストな集約を毎回再計算する代わりにこのキャッシュされたメトリクスをクエリできます。",
  } as const,
};

export const DEVOPS_DAY_88_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "PromQL query patterns — from basic selectors to advanced aggregation",
        np: "PromQL query pattern — basic selector देखि advanced aggregation सम्म",
        jp: "PromQL クエリパターン — 基本セレクターから高度な集約まで",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "PromQL function reference — common functions grouped by use case",
            np: "PromQL function reference — use case अनुसार group गरिएका common function",
            jp: "PromQL 関数リファレンス — ユースケース別にグループ化された一般的な関数",
          },
          headers: [
            { en: "Function / operator", np: "Function / operator", jp: "関数 / 演算子" },
            { en: "Input type", np: "Input type", jp: "入力タイプ" },
            { en: "What it does", np: "के गर्छ", jp: "何をするか" },
            { en: "When to use", np: "कहिले प्रयोग गर्ने", jp: "いつ使うか" },
          ],
          rows: [
            [
              { en: "`rate(c[w])`", np: "`rate(c[w])`", jp: "`rate(c[w])`" },
              { en: "Range vector (counter)", np: "Range vector (counter)", jp: "レンジベクター（カウンター）" },
              { en: "Per-second average increase over window `w`; handles resets", np: "Window `w` मा per-second average increase; reset handle गर्छ", jp: "ウィンドウ `w` での 1 秒あたりの平均増加；リセットを処理" },
              { en: "Dashboards, alerting rules; use window ≥ 4× scrape interval", np: "Dashboard, alerting rule; scrape interval को ≥ 4× window प्रयोग", jp: "ダッシュボード・アラートルール；スクレイプ間隔の ≥ 4 倍のウィンドウを使用" },
            ],
            [
              { en: "`irate(c[w])`", np: "`irate(c[w])`", jp: "`irate(c[w])`" },
              { en: "Range vector (counter)", np: "Range vector (counter)", jp: "レンジベクター（カウンター）" },
              { en: "Instantaneous rate from last 2 samples — volatile", np: "Last 2 sample बाट instantaneous rate — volatile", jp: "最後の 2 サンプルからの瞬時レート — 不安定" },
              { en: "Real-time dashboards where spikes matter; not for alerts", np: "Spike matter हुने real-time dashboard; alert को लागि होइन", jp: "スパイクが重要なリアルタイムダッシュボード；アラートには不向き" },
            ],
            [
              { en: "`increase(c[w])`", np: "`increase(c[w])`", jp: "`increase(c[w])`" },
              { en: "Range vector (counter)", np: "Range vector (counter)", jp: "レンジベクター（カウンター）" },
              { en: "Total increase in counter over window (≈ rate × window seconds)", np: "Window मा counter को total increase (≈ rate × window second)", jp: "ウィンドウ全体のカウンターの総増加（≈ rate × ウィンドウ秒数）" },
              { en: "\"How many errors occurred in the last hour?\"", np: "\"पछिल्लो घन्टामा कति error भयो?\"", jp: "「過去 1 時間に何件のエラーが発生したか？」" },
            ],
            [
              { en: "`histogram_quantile(φ, rate(h_bucket[w]))`", np: "`histogram_quantile(φ, rate(h_bucket[w]))`", jp: "`histogram_quantile(φ, rate(h_bucket[w]))`" },
              { en: "Scalar + instant vector (histogram bucket)", np: "Scalar + instant vector (histogram bucket)", jp: "スカラー + インスタントベクター（ヒストグラムバケット）" },
              { en: "Estimate the φ-quantile (e.g. 0.99 = p99) from histogram buckets", np: "Histogram bucket बाट φ-quantile (जस्तै 0.99 = p99) estimate गर्नुहोस्", jp: "ヒストグラムバケットから φ 分位数（例：0.99 = p99）を推定" },
              { en: "SLO latency tracking; use `le` label; always compute on `rate()`", np: "SLO latency tracking; `le` label प्रयोग; सधैं `rate()` मा compute", jp: "SLO レイテンシー追跡；`le` ラベルを使用；常に `rate()` で計算" },
            ],
            [
              { en: "`sum by (labels) (v)`", np: "`sum by (labels) (v)`", jp: "`sum by (labels) (v)`" },
              { en: "Instant vector", np: "Instant vector", jp: "インスタントベクター" },
              { en: "Sum across series, keeping only listed labels", np: "Listed label मात्र राखेर series मा sum", jp: "リストされたラベルのみ保持して系列を合計" },
              { en: "Fleet-wide totals grouped by service, region, or pod", np: "Service, region, वा pod द्वारा group गरिएको fleet-wide total", jp: "サービス・リージョン・ポッドでグループ化されたフリート全体の合計" },
            ],
            [
              { en: "`topk(k, v)`", np: "`topk(k, v)`", jp: "`topk(k, v)`" },
              { en: "Instant vector", np: "Instant vector", jp: "インスタントベクター" },
              { en: "Return the k time series with the highest values", np: "Highest value भएको k time series return गर्नुहोस्", jp: "最高値を持つ k 個の時系列を返す" },
              { en: "\"Which 5 pods have the highest error rate right now?\"", np: "\"अहिले कुन 5 pod मा highest error rate छ?\"", jp: "「現在最も高いエラー率を持つ 5 つのポッドは？」" },
            ],
            [
              { en: "`label_replace(v, dst, src, regex, repl)`", np: "`label_replace(v, dst, src, regex, repl)`", jp: "`label_replace(v, dst, src, regex, repl)`" },
              { en: "Instant vector", np: "Instant vector", jp: "インスタントベクター" },
              { en: "Create/modify a label using a regex on another label's value", np: "अर्को label को value मा regex प्रयोग गरेर label create/modify गर्नुहोस्", jp: "別のラベルの値に正規表現を使用してラベルを作成/変更する" },
              { en: "Extract environment from pod name; normalise metric label values", np: "Pod name बाट environment extract; metric label value normalise", jp: "ポッド名から環境を抽出；メトリクスラベル値の正規化" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "PromQL in practice — real queries for SLOs, RED, and recording rules",
        np: "PromQL in practice — SLO, RED, र recording rule को लागि real query",
        jp: "実践的な PromQL — SLO・RED・記録ルールの実際のクエリ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "PromQL query cookbook: availability, latency, saturation, recording rules",
            np: "PromQL query cookbook: availability, latency, saturation, recording rule",
            jp: "PromQL クエリクックブック：可用性・レイテンシー・飽和・記録ルール",
          },
          code: `# ── Instant selectors & label matchers ───────────────────────────────
# Equality:       http_requests_total{job="api", status_code="200"}
# Not equal:      http_requests_total{status_code!="200"}
# Regex match:    http_requests_total{endpoint=~"/api/.*"}
# Regex not match:http_requests_total{endpoint!~"/health|/metrics"}

# ── RED Method queries ─────────────────────────────────────────────────

# Rate: per-second request rate per endpoint (last 5 min)
sum by (endpoint) (
  rate(http_requests_total[5m])
)

# Error rate as a percentage
100 * sum by (endpoint) (
  rate(http_requests_total{status_code=~"5.."}[5m])
) / sum by (endpoint) (
  rate(http_requests_total[5m])
)

# p99 latency using histogram (requires histogram, not summary)
histogram_quantile(0.99,
  sum by (endpoint, le) (
    rate(http_request_duration_seconds_bucket[5m])
  )
)
# NOTE: must include 'le' in the by() clause — it's the bucket boundary label

# p50 and p99 in a single query using a vector
histogram_quantile(0.99, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))
histogram_quantile(0.50, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))

# ── Availability SLI (30-day rolling window) ───────────────────────────
# Fraction of successful requests (non-5xx) over 30 days
(
  sum(increase(http_requests_total{status_code!~"5.."}[30d]))
  /
  sum(increase(http_requests_total[30d]))
) * 100
# Expected value: 99.9% for a 99.9% SLO target

# ── Binary operations: error ratio with label matching ─────────────────
# This divides two vectors — they must have matching labels
sum by (job, endpoint) (rate(http_errors_total[5m]))
/
sum by (job, endpoint) (rate(http_requests_total[5m]))

# Many-to-one join: enrich metric with metadata from another metric
# Attach node region label to container-level CPU metric:
container_cpu_usage_seconds_total
* on(node) group_left(region)
  node_meta{region=~".+"}   # node_meta is a metric with region label

# ── USE Method: infrastructure resource queries ────────────────────────
# CPU utilisation (fraction 0-1)
1 - avg by (instance) (
  rate(node_cpu_seconds_total{mode="idle"}[5m])
)

# Memory utilisation
1 - (
  node_memory_MemAvailable_bytes
  / node_memory_MemTotal_bytes
)

# Disk utilisation (I/O busy fraction)
rate(node_disk_io_time_seconds_total[5m])

# ── Recording rules (rules/recording.yml) ─────────────────────────────
# Pre-compute expensive aggregations; results stored as new metric series
# Naming convention: level:metric:operation  (e.g. job:http_requests:rate5m)
#
# groups:
#   - name: http_recording_rules
#     interval: 30s   # evaluate every 30s (default: global evaluation_interval)
#     rules:
#       - record: job:http_requests_total:rate5m
#         expr: sum by (job) (rate(http_requests_total[5m]))
#
#       - record: job:http_errors_total:rate5m
#         expr: sum by (job) (rate(http_requests_total{status_code=~"5.."}[5m]))
#
#       - record: job:http_error_ratio:rate5m
#         expr: |
#           job:http_errors_total:rate5m
#           /
#           job:http_requests_total:rate5m
#
#       - record: job:http_p99_latency:rate5m
#         expr: |
#           histogram_quantile(0.99,
#             sum by (job, le) (
#               rate(http_request_duration_seconds_bucket[5m])
#             )
#           )

# Load recording rules in prometheus.yml:
# rule_files:
#   - "rules/*.yml"

# ── Subquery (expensive — use recording rules instead when possible) ───
# Maximum p99 latency observed over the past hour, evaluated at 5-min resolution
max_over_time(
  histogram_quantile(0.99,
    sum by (le) (rate(http_request_duration_seconds_bucket[5m]))
  )[1h:5m]
)

# ── Useful debugging queries ──────────────────────────────────────────
# Count of active time series in Prometheus itself
prometheus_tsdb_head_series

# Which metrics have the most series (top 10 by cardinality)?
topk(10, count by (__name__) ({__name__=~".+"}))

# Scrape duration — which targets are slow to scrape?
topk(5, scrape_duration_seconds)

# Is any target down?
up == 0`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Practice the five most important PromQL patterns using your instrumented service from Day 86. Write and run each of the following in the Prometheus expression browser (`http://localhost:9090/graph`): (1) current per-second request rate grouped by endpoint; (2) error rate as a percentage per endpoint; (3) p99 latency using `histogram_quantile`; (4) which endpoint has the highest error rate right now using `topk(3, ...)`; (5) the fraction of requests that complete within 100ms: `sum(rate(http_request_duration_seconds_bucket{le=\"0.1\"}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))`. For each query, switch between the Table and Graph views. Note which queries return instant vectors (single value per series) vs range vectors (error). Then deliberately send 100 error requests and watch the error rate spike in the graph view with a 15-second refresh.",
              np: "Day 86 को instrumented service प्रयोग गरेर पाँचवटा सबैभन्दा महत्त्वपूर्ण PromQL pattern practice गर्नुहोस्। Prometheus expression browser (`http://localhost:9090/graph`) मा निम्न प्रत्येक लेख्नुहोस् र run गर्नुहोस्: (१) endpoint अनुसार group गरिएको current per-second request rate; (२) endpoint अनुसार percentage मा error rate; (३) `histogram_quantile` प्रयोग गरेर p99 latency; (४) `topk(3, ...)` प्रयोग गरेर अहिले कुन endpoint मा highest error rate छ; (५) 100ms भित्र complete हुने request को fraction: `sum(rate(http_request_duration_seconds_bucket{le=\"0.1\"}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))`। प्रत्येक query को लागि, Table र Graph view बीच switch गर्नुहोस्। कुन query ले instant vector (series अनुसार single value) vs range vector (error) return गर्छ note गर्नुहोस्। त्यसपछि deliberately 100 error request पठाउनुहोस् र 15-second refresh सहित graph view मा error rate spike हेर्नुहोस्।",
              jp: "Day 86 の計装されたサービスを使用して、最も重要な 5 つの PromQL パターンを練習する。Prometheus 式ブラウザ（`http://localhost:9090/graph`）で以下をそれぞれ書いて実行する：(1) エンドポイント別にグループ化された現在の 1 秒あたりリクエストレート；(2) エンドポイントごとのパーセンテージでのエラーレート；(3) `histogram_quantile` を使用した p99 レイテンシー；(4) `topk(3, ...)` を使用して現在最もエラーレートが高いエンドポイント；(5) 100ms 以内に完了するリクエストの割合：`sum(rate(http_request_duration_seconds_bucket{le=\"0.1\"}[5m])) / sum(rate(http_request_duration_seconds_count[5m]))`。各クエリでテーブルビューとグラフビューを切り替える。どのクエリがインスタントベクター（系列ごとに単一の値）対レンジベクター（エラー）を返すかに注目する。次に意図的に 100 件のエラーリクエストを送信し、15 秒更新でグラフビューのエラーレートのスパイクを観察する。",
            },
            {
              en: "Create a recording rules file (`rules/recording.yml`) with five recording rules that pre-compute the RED method queries and a p99 latency metric. Use the naming convention `level:metric:operation` (e.g. `job:http_requests_total:rate5m`). Load the rules file in `prometheus.yml` under `rule_files`. Wait one evaluation interval (15s), then query the recording rule metrics directly in the Prometheus browser. Compare the query execution time of the original expensive query vs the recording rule metric — run `curl 'http://localhost:9090/api/v1/query?query=...' -s | jq .stats` to see query evaluation duration. Set the recording rule interval to 30s and observe that querying the recorded metric is always sub-millisecond. Finally, write an alerting rule that uses a recording rule metric rather than recomputing from raw counters — this is the production pattern for alerting at scale.",
              np: "RED method query र p99 latency metric pre-compute गर्ने पाँचवटा recording rule सहित recording rules file (`rules/recording.yml`) create गर्नुहोस्। Naming convention `level:metric:operation` प्रयोग गर्नुहोस् (जस्तै `job:http_requests_total:rate5m`)। `prometheus.yml` मा `rule_files` अन्तर्गत rules file load गर्नुहोस्। एउटा evaluation interval (15s) wait गर्नुहोस्, त्यसपछि Prometheus browser मा directly recording rule metric query गर्नुहोस्। Original expensive query vs recording rule metric को query execution time compare गर्नुहोस् — query evaluation duration हेर्न `curl 'http://localhost:9090/api/v1/query?query=...' -s | jq .stats` run गर्नुहोस्। Recording rule interval 30s मा set गर्नुहोस् र recorded metric query गर्नु सधैं sub-millisecond छ observe गर्नुहोस्। अन्तमा, raw counter बाट recompute गर्नुको सट्टा recording rule metric प्रयोग गर्ने alerting rule लेख्नुहोस् — यो scale मा alerting को लागि production pattern हो।",
              jp: "RED メソッドクエリと p99 レイテンシーメトリクスを事前計算する 5 つの記録ルールを持つ記録ルールファイル（`rules/recording.yml`）を作成する。命名規則 `level:metric:operation`（例：`job:http_requests_total:rate5m`）を使用する。`prometheus.yml` の `rule_files` 以下にルールファイルをロードする。1 つの評価間隔（15 秒）待ってから、Prometheus ブラウザで記録ルールのメトリクスを直接クエリする。元の高コストなクエリ対記録ルールメトリクスのクエリ実行時間を比較する — クエリ評価時間を確認するために `curl 'http://localhost:9090/api/v1/query?query=...' -s | jq .stats` を実行する。記録ルールの間隔を 30 秒に設定し、記録されたメトリクスのクエリが常にサブミリ秒であることを観察する。最後に、生カウンターから再計算するのではなく記録ルールのメトリクスを使用するアラートルールを書く — これはスケールでのアラートの本番パターンです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between an instant vector and a range vector, and why do I keep getting \"expected type instant vector\" errors?",
        np: "Instant vector र range vector बीचको फरक के हो, र \"expected type instant vector\" error किन आउँछ?",
        jp: "インスタントベクターとレンジベクターの違いは何で、なぜ「expected type instant vector」エラーが続くのか？",
      },
      answer: {
        en: "An **instant vector** is a set of time series where each series has exactly one sample — the value at the current evaluation timestamp. `http_requests_total` returns an instant vector. An instant vector can be graphed, aggregated, used in arithmetic, and compared. A **range vector** is a set of time series where each series has multiple samples — all values within the specified time window before the evaluation timestamp. `http_requests_total[5m]` returns a range vector. Range vectors cannot be graphed directly, cannot be aggregated with `sum()`/`avg()`, and cannot be used in arithmetic expressions — they are only valid as input to specific range-vector functions: `rate()`, `irate()`, `increase()`, `delta()`, `deriv()`, `predict_linear()`, `resets()`, `changes()`, `avg_over_time()`, `min_over_time()`, `max_over_time()`, `sum_over_time()`, `count_over_time()`, `last_over_time()`. The \"expected type instant vector\" error means you passed a range vector (e.g., `metric[5m]`) where PromQL expected an instant vector. The fix is almost always to wrap the range vector in a function: `rate(metric[5m])` for counters, `avg_over_time(metric[5m])` for gauges. The other common mistake is passing `rate(metric[5m])` (which returns an instant vector) to a function that expects a range vector — this produces \"expected type range vector\" in the opposite direction. Mental model: think of a range vector as a \"raw time window of samples\" — it is intermediate data, not queryable by itself. Functions transform range vectors into instant vectors that can be graphed and operated on.",
        np: "**Instant vector** time series को set हो जहाँ प्रत्येक series मा exactly एउटा sample छ — current evaluation timestamp मा value। `http_requests_total` ले instant vector return गर्छ। Instant vector graph, aggregate, arithmetic मा प्रयोग, र compare गर्न सकिन्छ। **Range vector** time series को set हो जहाँ प्रत्येक series मा multiple sample छन् — evaluation timestamp अघि specified time window भित्रका सबै value। `http_requests_total[5m]` ले range vector return गर्छ। Range vector directly graph गर्न सकिँदैन, `sum()`/`avg()` सँग aggregate गर्न सकिँदैन, र arithmetic expression मा प्रयोग गर्न सकिँदैन — यो specific range-vector function को input को रूपमा मात्र valid छ: `rate()`, `irate()`, `increase()`, `delta()`, `avg_over_time()`, `min_over_time()`, `max_over_time()` आदि। \"expected type instant vector\" error को अर्थ PromQL ले instant vector expect गरेको ठाउँमा range vector (जस्तै `metric[5m]`) pass गर्नुभयो। Fix लगभग सधैं range vector लाई function मा wrap गर्नु हो: counter को लागि `rate(metric[5m])`, gauge को लागि `avg_over_time(metric[5m])`।",
        jp: "**インスタントベクター**は各系列がちょうど 1 つのサンプル — 現在の評価タイムスタンプでの値 — を持つ時系列のセットです。`http_requests_total` はインスタントベクターを返します。インスタントベクターはグラフ化・集約・算術での使用・比較ができます。**レンジベクター**は各系列が複数のサンプル — 評価タイムスタンプ前の指定された時間ウィンドウ内のすべての値 — を持つ時系列のセットです。`http_requests_total[5m]` はレンジベクターを返します。レンジベクターは直接グラフ化できず、`sum()`/`avg()` で集約できず、算術式で使用できません — 特定のレンジベクター関数への入力としてのみ有効です：`rate()`・`irate()`・`increase()`・`delta()`・`avg_over_time()`・`min_over_time()`・`max_over_time()` など。「expected type instant vector」エラーは、PromQL がインスタントベクターを期待している場所にレンジベクター（例：`metric[5m]`）を渡したことを意味します。修正はほぼ常にレンジベクターを関数でラップすることです：カウンターには `rate(metric[5m])`、ゲージには `avg_over_time(metric[5m])`。メンタルモデル：レンジベクターを「サンプルの生の時間ウィンドウ」と考えてください — それは中間データであり、それ自体ではクエリできません。",
      },
      tag: {
        en: "instant vs range vector",
        np: "instant vs range vector",
        jp: "インスタント対レンジベクター",
      },
    },
  ],
};
