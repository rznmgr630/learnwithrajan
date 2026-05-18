import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Prometheus** is an open-source systems monitoring and alerting toolkit originally built at SoundCloud and now a CNCF graduated project. Its architecture is deliberately simple and opinionated: Prometheus is a **pull-based** monitoring system. Rather than waiting for applications to push metrics to a central server, Prometheus periodically scrapes HTTP endpoints (by default `/metrics`) that expose metrics in its text exposition format. This design choice has profound implications: the monitoring system controls the scrape interval, not the application; you can scrape any endpoint with `curl` to debug instrumentation; and the scraping target list is configuration-managed, so adding or removing a target does not require code changes in the application. Prometheus stores all data in a custom **time-series database (TSDB)** on local disk. The TSDB is optimised for write-heavy workloads (millions of samples per second), efficient compression (Gorilla-style delta-of-delta encoding reduces a float64 + timestamp pair from 16 bytes to ~1.37 bytes on average), and fast range queries (scanning all values of a metric over a time window). Each metric **sample** is a (timestamp, float64) pair. Samples are grouped into **time series**, each identified by a unique combination of metric name and label key-value pairs: `http_requests_total{method=\"GET\", status_code=\"200\", service=\"api\"}`. Prometheus does **not** support arbitrary string values as metric values — only float64. Strings, events, and categorical data belong in logs or traces.",
    np: "**Prometheus** open-source systems monitoring र alerting toolkit हो जुन मूलतः SoundCloud मा build गरिएको थियो र अहिले CNCF graduated project हो। यसको architecture deliberately simple र opinionated छ: Prometheus **pull-based** monitoring system हो। Application ले central server मा metric push गर्न कुर्नुको सट्टा, Prometheus ले periodic रूपमा metric आफ्नो text exposition format मा expose गर्ने HTTP endpoint (default मा `/metrics`) scrape गर्छ। यो design choice को गहिरो implications छ: monitoring system ले scrape interval control गर्छ, application ले होइन; instrumentation debug गर्न `curl` सँग कुनै पनि endpoint scrape गर्न सकिन्छ; र scraping target list configuration-managed छ, त्यसैले target add वा remove गर्न application मा code change आवश्यक छैन। Prometheus ले local disk मा custom **time-series database (TSDB)** मा सबै data store गर्छ। TSDB write-heavy workload (प्रति second million sample), efficient compression (Gorilla-style delta-of-delta encoding ले float64 + timestamp pair लाई average मा 16 byte बाट ~1.37 byte मा घटाउँछ), र fast range query (time window मा metric का सबै value scan गर्नु) को लागि optimised छ। प्रत्येक metric **sample** (timestamp, float64) pair हो। Sample **time series** मा group हुन्छन्, प्रत्येक metric name र label key-value pair को unique combination द्वारा identify हुन्छ: `http_requests_total{method=\"GET\", status_code=\"200\", service=\"api\"}`। Prometheus ले metric value को रूपमा arbitrary string value support गर्दैन — float64 मात्र। String, event, र categorical data log वा trace मा belong गर्छन्।",
    jp: "**Prometheus** はもともと SoundCloud で構築され、現在は CNCF の卒業プロジェクトとなっているオープンソースのシステム監視およびアラートツールキットです。そのアーキテクチャは意図的にシンプルで意見を持ちます：Prometheus は**プルベース**の監視システムです。アプリケーションがセントラルサーバーにメトリクスをプッシュするのを待つのではなく、Prometheus はテキスト公開形式でメトリクスを公開する HTTP エンドポイント（デフォルトで `/metrics`）を定期的にスクレイプします。この設計の選択は深い意味を持ちます：監視システムがスクレイプ間隔を制御し、アプリケーションではない；計装をデバッグするために `curl` で任意のエンドポイントをスクレイプできる；スクレイプターゲットリストは設定管理されているため、ターゲットの追加や削除にアプリケーションのコード変更が不要。Prometheus はすべてのデータをローカルディスク上のカスタム**時系列データベース（TSDB）**に保存します。TSDB は書き込みの多いワークロード（1 秒あたり数百万のサンプル）・効率的な圧縮（Gorilla スタイルのデルタオブデルタエンコーディングにより float64 + タイムスタンプのペアを平均 16 バイトから約 1.37 バイトに削減）・高速な範囲クエリ（時間ウィンドウにわたるメトリクスのすべての値のスキャン）向けに最適化されています。各メトリクスの**サンプル**は（タイムスタンプ、float64）のペアです。サンプルは**時系列**にグループ化され、メトリクス名とラベルのキーバリューペアのユニークな組み合わせで識別されます：`http_requests_total{method=\"GET\", status_code=\"200\", service=\"api\"}`。Prometheus はメトリクス値として任意の文字列値をサポートしません — float64 のみ。文字列・イベント・カテゴリデータはログやトレースに属します。",
  } as const,
  o2: {
    en: "Prometheus defines **four metric types** that map to different measurement semantics. A **Counter** is a monotonically increasing value that only goes up (or resets to zero on process restart): total HTTP requests, total bytes sent, total errors. Never use a counter for values that can go down — use a gauge instead. Counters are most useful when combined with the `rate()` function to compute how fast they are increasing. A **Gauge** is a value that can go up or down arbitrarily: current memory usage, number of active connections, queue depth, temperature. Gauges are the raw current state; you query them directly (no `rate()` needed). A **Histogram** samples observations and counts them in configurable buckets: `http_request_duration_seconds_bucket{le=\"0.1\"}` = requests that completed in ≤ 100ms. Histograms also track sum and count, enabling `histogram_quantile()` to estimate percentiles. Buckets must be defined at instrument time — choose them based on your SLO thresholds. A **Summary** also tracks observations and provides pre-computed quantiles (configured at the client), but summaries cannot be aggregated across instances because quantiles are mathematically non-additive. For most use cases, prefer Histograms. The **Prometheus data model** is a flat label-based model: every time series is a set of key=value labels. There is no hierarchy — no concept of \"namespace.service.metric\" like StatsD. Instead, you encode hierarchy in labels: `{job=\"payment-api\", instance=\"10.0.0.1:8080\", method=\"POST\"}`. Prometheus automatically adds two labels during scraping: `job` (the scrape job name from your config) and `instance` (the `host:port` being scraped). The `__name__` internal label holds the metric name — all labels starting with `__` are internal and stripped from query results.",
    np: "Prometheus ले **चार metric type** define गर्छ जो different measurement semantics मा map हुन्छन्। **Counter** monotonically increasing value हो जुन केवल माथि जान्छ (वा process restart मा zero मा reset हुन्छ): total HTTP request, total byte sent, total error। Decrease हुन सक्ने value को लागि counter कहिल्यै नप्रयोग गर्नुहोस् — gauge प्रयोग गर्नुहोस्। Counter सबैभन्दा उपयोगी हुन्छ जब कति छिटो बढ्दैछ compute गर्न `rate()` function सँग combine गरिन्छ। **Gauge** arbitrarily माथि वा तल जान सक्ने value हो: current memory usage, active connection को संख्या, queue depth, temperature। Gauge raw current state हो; तपाईंले directly query गर्नुहुन्छ (`rate()` चाहिँदैन)। **Histogram** ले configurable bucket मा observation sample र count गर्छ: `http_request_duration_seconds_bucket{le=\"0.1\"}` = ≤ 100ms मा complete भएको request। Histogram ले sum र count पनि track गर्छ, `histogram_quantile()` लाई percentile estimate गर्न enable गर्दै। Bucket instrument time मा define गर्नुपर्छ — आफ्नो SLO threshold मा आधारित छान्नुहोस्। **Summary** ले पनि observation track गर्छ र pre-computed quantile (client मा configured) provide गर्छ, तर summary लाई instance पार aggregate गर्न सकिँदैन किनभने quantile mathematically non-additive छन्। धेरैजसो use case को लागि, Histogram prefer गर्नुहोस्। **Prometheus data model** flat label-based model हो: प्रत्येक time series key=value label को set हो। कुनै hierarchy छैन — StatsD जस्तो \"namespace.service.metric\" को concept छैन। त्यसको सट्टा, label मा hierarchy encode गर्नुहोस्: `{job=\"payment-api\", instance=\"10.0.0.1:8080\", method=\"POST\"}`। Prometheus ले scraping को समयमा automatically दुईवटा label add गर्छ: `job` (config बाट scrape job name) र `instance` (scrape भइरहेको `host:port`)। `__name__` internal label ले metric name hold गर्छ — `__` बाट सुरु हुने सबै label internal छन् र query result बाट strip हुन्छन्।",
    jp: "Prometheus は異なる測定セマンティクスにマッピングされる**4 つのメトリクスタイプ**を定義します。**Counter** は単調増加する値で、上昇するだけです（またはプロセス再起動時にゼロにリセット）：HTTP リクエストの総数・送信バイトの総数・エラーの総数。下がりうる値にカウンターを使用しないこと — 代わりにゲージを使用する。カウンターは `rate()` 関数と組み合わせて増加速度を計算する際に最も役立ちます。**Gauge** は任意に上下できる値です：現在のメモリ使用量・アクティブな接続数・キューの深さ・温度。ゲージは生の現在の状態です；直接クエリします（`rate()` は不要）。**Histogram** は観測値をサンプリングして設定可能なバケットでカウントします：`http_request_duration_seconds_bucket{le=\"0.1\"}` = 100ms 以下で完了したリクエスト。ヒストグラムは合計とカウントも追跡し、`histogram_quantile()` でパーセンタイルを推定できます。バケットは計装時に定義する必要があります — SLO しきい値に基づいて選択する。**Summary** も観測値を追跡し、事前計算されたパーセンタイル（クライアントで設定）を提供しますが、パーセンタイルは数学的に加算不可能なため、サマリーはインスタンス間で集約できません。ほとんどのユースケースでは Histogram を優先してください。**Prometheus データモデル**はフラットなラベルベースのモデルです：すべての時系列はキーバリューラベルのセットです。階層はなく、StatsD のような「namespace.service.metric」の概念もありません。代わりに、ラベルに階層をエンコードします：`{job=\"payment-api\", instance=\"10.0.0.1:8080\", method=\"POST\"}`。Prometheus はスクレイプ時に自動的に 2 つのラベルを追加します：`job`（設定からのスクレイプジョブ名）と `instance`（スクレイプされている `host:port`）。`__name__` 内部ラベルはメトリクス名を保持します — `__` で始まるすべてのラベルは内部用であり、クエリ結果から削除されます。",
  } as const,
};

export const DEVOPS_DAY_86_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Prometheus architecture & the four metric types",
        np: "Prometheus architecture र चार metric type",
        jp: "Prometheus アーキテクチャと 4 つのメトリクスタイプ",
      },
      blocks: [
        { type: "diagram", id: "devops-prometheus-architecture" },
        {
          type: "table",
          caption: {
            en: "Prometheus metric types — when to use each",
            np: "Prometheus metric type — कहिले कुन प्रयोग गर्ने",
            jp: "Prometheus メトリクスタイプ — それぞれをいつ使うか",
          },
          headers: [
            { en: "Type", np: "Type", jp: "タイプ" },
            { en: "Behaviour", np: "Behaviour", jp: "動作" },
            { en: "Use for", np: "Use for", jp: "用途" },
            { en: "Key functions", np: "Key function", jp: "主な関数" },
            { en: "Example metric name", np: "Example metric name", jp: "メトリクス名の例" },
          ],
          rows: [
            [
              { en: "Counter", np: "Counter", jp: "カウンター" },
              { en: "Monotonically increasing; resets to 0 on restart", np: "Monotonically increasing; restart मा 0 मा reset", jp: "単調増加；再起動時に 0 にリセット" },
              { en: "Totals: requests, errors, bytes sent", np: "Total: request, error, byte sent", jp: "合計：リクエスト・エラー・送信バイト" },
              { en: "`rate()`, `increase()`, `irate()`", np: "`rate()`, `increase()`, `irate()`", jp: "`rate()`・`increase()`・`irate()`" },
              { en: "`http_requests_total`, `errors_total`", np: "`http_requests_total`, `errors_total`", jp: "`http_requests_total`・`errors_total`" },
            ],
            [
              { en: "Gauge", np: "Gauge", jp: "ゲージ" },
              { en: "Can go up or down; current snapshot value", np: "माथि वा तल जान सक्छ; current snapshot value", jp: "上下できる；現在のスナップショット値" },
              { en: "Current state: memory, active connections, queue depth", np: "Current state: memory, active connection, queue depth", jp: "現在の状態：メモリ・アクティブ接続・キューの深さ" },
              { en: "`min_over_time()`, `max_over_time()`, `avg_over_time()`", np: "`min_over_time()`, `max_over_time()`, `avg_over_time()`", jp: "`min_over_time()`・`max_over_time()`・`avg_over_time()`" },
              { en: "`node_memory_MemAvailable_bytes`, `go_goroutines`", np: "`node_memory_MemAvailable_bytes`, `go_goroutines`", jp: "`node_memory_MemAvailable_bytes`・`go_goroutines`" },
            ],
            [
              { en: "Histogram", np: "Histogram", jp: "ヒストグラム" },
              { en: "Bucketed observation counts + sum + count; aggregatable", np: "Bucketed observation count + sum + count; aggregatable", jp: "バケット化された観測カウント + 合計 + カウント；集約可能" },
              { en: "Latency distributions, request sizes; p99 via `histogram_quantile`", np: "Latency distribution, request size; `histogram_quantile` मार्फत p99", jp: "レイテンシー分布・リクエストサイズ；`histogram_quantile` で p99" },
              { en: "`histogram_quantile()`, `rate()` on `_bucket`", np: "`histogram_quantile()`, `_bucket` मा `rate()`", jp: "`histogram_quantile()`・`_bucket` への `rate()`" },
              { en: "`http_request_duration_seconds`", np: "`http_request_duration_seconds`", jp: "`http_request_duration_seconds`" },
            ],
            [
              { en: "Summary", np: "Summary", jp: "サマリー" },
              { en: "Pre-computed client-side quantiles + sum + count; not aggregatable", np: "Pre-computed client-side quantile + sum + count; aggregatable छैन", jp: "事前計算されたクライアント側パーセンタイル + 合計 + カウント；集約不可" },
              { en: "Pre-computed percentiles when you can't choose histogram buckets in advance", np: "Histogram bucket advance मा choose गर्न नसक्दा pre-computed percentile", jp: "ヒストグラムバケットを事前に選択できない場合の事前計算パーセンタイル" },
              { en: "Direct `{quantile=\"0.99\"}` selector (no aggregation possible)", np: "Direct `{quantile=\"0.99\"}` selector (aggregation possible छैन)", jp: "直接 `{quantile=\"0.99\"}` セレクター（集約不可）" },
              { en: "`go_gc_duration_seconds`", np: "`go_gc_duration_seconds`", jp: "`go_gc_duration_seconds`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Prometheus configuration, TSDB internals & scraping",
        np: "Prometheus configuration, TSDB internal र scraping",
        jp: "Prometheus 設定・TSDB 内部・スクレイピング",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "prometheus.yml scrape config, metric exposition format & TSDB compaction",
            np: "prometheus.yml scrape config, metric exposition format र TSDB compaction",
            jp: "prometheus.yml スクレイプ設定・メトリクス公開形式・TSDB コンパクション",
          },
          code: `# ── prometheus.yml — minimal scrape configuration ────────────────────
global:
  scrape_interval:     15s   # How often to scrape targets (default 1m)
  evaluation_interval: 15s   # How often to evaluate alerting rules
  scrape_timeout:      10s   # Timeout per individual scrape request

scrape_configs:
  # ── Prometheus scrapes itself ─────────────────────────────────────
  - job_name: "prometheus"
    static_configs:
      - targets: ["localhost:9090"]

  # ── Your application ──────────────────────────────────────────────
  - job_name: "payment-api"
    scrape_interval: 10s          # Override global for this job
    metrics_path: /metrics        # Default; change if app uses /prometheus
    scheme: http                  # http or https
    static_configs:
      - targets:
          - "10.0.0.10:8080"
          - "10.0.0.11:8080"
        labels:                   # Extra labels added to every scraped series
          environment: "production"
          region: "us-east-1"

  # ── node_exporter (infrastructure metrics) ────────────────────────
  - job_name: "node"
    static_configs:
      - targets:
          - "10.0.0.10:9100"
          - "10.0.0.11:9100"

# ── Prometheus Text Exposition Format (/metrics output) ───────────────
# Each metric family is preceded by HELP and TYPE comments:

# HELP http_requests_total Total HTTP requests received
# TYPE http_requests_total counter
http_requests_total{method="GET",endpoint="/api/users",status_code="200"} 48291
http_requests_total{method="GET",endpoint="/api/users",status_code="404"} 23
http_requests_total{method="POST",endpoint="/api/orders",status_code="201"} 1847

# HELP http_request_duration_seconds HTTP request latency
# TYPE http_request_duration_seconds histogram
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.005"} 8234
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.01"}  14821
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.025"} 38900
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.05"}  45231
http_request_duration_seconds_bucket{endpoint="/api/users",le="0.1"}   47891
http_request_duration_seconds_bucket{endpoint="/api/users",le="+Inf"}  48291
http_request_duration_seconds_sum{endpoint="/api/users"}   1203.44
http_request_duration_seconds_count{endpoint="/api/users"} 48291

# HELP go_goroutines Number of goroutines currently running
# TYPE go_goroutines gauge
go_goroutines 42

# ── TSDB Storage Layout (on disk) ─────────────────────────────────────
# /prometheus/
# ├── data/
# │   ├── 01H7X.../ (immutable block — 2h default)
# │   │   ├── chunks/   (compressed sample data, ~128MB each)
# │   │   ├── index     (label → series mapping for fast lookups)
# │   │   └── meta.json (block time range, stats)
# │   ├── 01H7Y.../ (another block)
# │   └── wal/          (Write-Ahead Log — in-memory head chunk backup)
#       └── 00000001    (WAL segment — ~128MB, replayed on crash recovery)

# TSDB compaction: Prometheus background-merges 2h blocks into larger
# blocks (up to --storage.tsdb.max-block-duration, default 10% of
# --storage.tsdb.retention.time). Compaction: deduplicates series,
# tombstone-removes deleted data, and applies downsampling (in Thanos/Cortex).

# ── Key Prometheus CLI flags ──────────────────────────────────────────
# --storage.tsdb.path=/prometheus/data   (default ./data)
# --storage.tsdb.retention.time=15d      (default 15d; also --retention.size)
# --web.enable-lifecycle                 (enable /-/reload HTTP endpoint)
# --web.enable-admin-api                 (enable /api/v1/admin/* endpoints)
# --query.max-concurrency=20             (max concurrent PromQL queries)

# ── Reload config without restart ─────────────────────────────────────
# curl -X POST http://localhost:9090/-/reload
# (requires --web.enable-lifecycle flag)`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Instrument a Go or Python HTTP service with all four Prometheus metric types. Create: (1) a Counter `http_requests_total` with labels `method`, `endpoint`, `status_code`; (2) a Gauge `active_connections` that you increment on connection open and decrement on close; (3) a Histogram `http_request_duration_seconds` with buckets `[.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5]`; (4) a Summary `db_query_duration_seconds` with quantiles `{0.5: 0.05, 0.9: 0.01, 0.99: 0.001}`. Run the service and `curl http://localhost:8080/metrics` — identify each metric family in the output. Note which metrics produce multiple lines (histogram buckets) vs single lines. Then write a simple `prometheus.yml` with `static_configs` pointing at your service and run `docker run -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus`. Confirm the target shows as UP in `http://localhost:9090/targets`.",
              np: "Go वा Python HTTP service लाई चारैवटा Prometheus metric type सँग instrument गर्नुहोस्। Create गर्नुहोस्: (१) labels `method`, `endpoint`, `status_code` सहित Counter `http_requests_total`; (२) connection open मा increment र close मा decrement हुने Gauge `active_connections`; (३) bucket `[.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5]` सहित Histogram `http_request_duration_seconds`; (४) quantile `{0.5: 0.05, 0.9: 0.01, 0.99: 0.001}` सहित Summary `db_query_duration_seconds`। Service run गर्नुहोस् र `curl http://localhost:8080/metrics` — output मा प्रत्येक metric family identify गर्नुहोस्। कुन metric ले multiple line (histogram bucket) vs single line produce गर्छ note गर्नुहोस्। त्यसपछि आफ्नो service लाई point गर्ने `static_configs` सहित simple `prometheus.yml` लेख्नुहोस् र `docker run -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus` run गर्नुहोस्। `http://localhost:9090/targets` मा target UP देखिन्छ confirm गर्नुहोस्।",
              jp: "Go または Python の HTTP サービスをすべての 4 つの Prometheus メトリクスタイプで計装する。作成する：(1) ラベル `method`・`endpoint`・`status_code` を持つ Counter `http_requests_total`；(2) 接続オープン時にインクリメント・クローズ時にデクリメントする Gauge `active_connections`；(3) バケット `[.005, .01, .025, .05, .1, .25, .5, 1, 2.5, 5]` を持つ Histogram `http_request_duration_seconds`；(4) パーセンタイル `{0.5: 0.05, 0.9: 0.01, 0.99: 0.001}` を持つ Summary `db_query_duration_seconds`。サービスを実行して `curl http://localhost:8080/metrics` — 出力の各メトリクスファミリーを識別する。どのメトリクスが複数行（ヒストグラムバケット）対単一行を生成するかに注目する。次に、サービスを指す `static_configs` を持つシンプルな `prometheus.yml` を書き、`docker run -p 9090:9090 -v $(pwd)/prometheus.yml:/etc/prometheus/prometheus.yml prom/prometheus` を実行する。`http://localhost:9090/targets` でターゲットが UP として表示されることを確認する。",
            },
            {
              en: "Explore the Prometheus TSDB internals. Run Prometheus for at least 30 minutes while scraping your service. Then use `promtool tsdb analyze /path/to/prometheus/data` to inspect the database. Note: the number of time series, the highest-cardinality metric names, the most common label names, and the compression ratio (bytes per sample). Then, deliberately introduce a high-cardinality label by adding `request_id` as a Prometheus label (not a log field) to one of your metrics. Scrape for 5 minutes and run `tsdb analyze` again — observe the series count explosion. This demonstrates concretely why `request_id` belongs in logs/traces, not Prometheus labels. Finally, find the WAL directory (`data/wal/`) and observe how Prometheus writes new data to the WAL before compacting it into blocks.",
              np: "Prometheus TSDB internal explore गर्नुहोस्। आफ्नो service scrape गर्दै कम्तीमा 30 minute Prometheus run गर्नुहोस्। त्यसपछि database inspect गर्न `promtool tsdb analyze /path/to/prometheus/data` प्रयोग गर्नुहोस्। Note गर्नुहोस्: time series को संख्या, highest-cardinality metric name, सबैभन्दा common label name, र compression ratio (bytes per sample)। त्यसपछि, आफ्नो metric मध्ये एउटामा `request_id` लाई log field होइन Prometheus label को रूपमा add गरेर deliberately high-cardinality label introduce गर्नुहोस्। 5 minute scrape गर्नुहोस् र फेरि `tsdb analyze` run गर्नुहोस् — series count explosion observe गर्नुहोस्। यसले concretely demonstrate गर्छ किन `request_id` Prometheus label होइन log/trace मा belong गर्छ। अन्तमा, WAL directory (`data/wal/`) find गर्नुहोस् र Prometheus ले new data WAL मा लेख्न block मा compact गर्नु अघि observe गर्नुहोस्।",
              jp: "Prometheus TSDB の内部を探索する。サービスをスクレイプしながら少なくとも 30 分間 Prometheus を実行する。次に `promtool tsdb analyze /path/to/prometheus/data` を使用してデータベースを検査する。注目する点：時系列の数・最高カーディナリティのメトリクス名・最も一般的なラベル名・圧縮率（サンプルあたりのバイト数）。次に、メトリクスの 1 つに `request_id` をログフィールドではなく Prometheus ラベルとして追加することで、意図的に高カーディナリティラベルを導入する。5 分間スクレイプして再度 `tsdb analyze` を実行する — 系列数の爆発を観察する。これにより、`request_id` が Prometheus ラベルではなくログ/トレースに属する理由が具体的に示されます。最後に、WAL ディレクトリ（`data/wal/`）を見つけ、Prometheus がブロックにコンパクション前に WAL に新しいデータを書き込む様子を観察する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does Prometheus use a pull model instead of push, and what are the tradeoffs?",
        np: "Prometheus ले push को सट्टा pull model किन प्रयोग गर्छ, र tradeoff के हो?",
        jp: "Prometheus がプッシュではなくプルモデルを使用する理由と、そのトレードオフは？",
      },
      answer: {
        en: "The pull model's core advantage is **operational simplicity and control**. The Prometheus server owns the scrape schedule — you know exactly when samples were collected, at what interval, and whether a target was reachable. If a target is down, Prometheus records `up=0` and can alert on it. In a push model, a silent target (crashed process, network partition) is indistinguishable from a target that simply has not pushed yet — you need heartbeat metrics or TTL logic to detect absence. With pull, absence of a scrape response is a signal in itself. Pull also makes **debugging effortless**: to check what metrics a service exposes, just `curl http://service:8080/metrics`. No agent configuration, no credentials, no firewall rules for outbound push traffic needed on the target side. The monitoring configuration lives in Prometheus (who to scrape, how often) rather than being scattered across every service's push configuration. **Tradeoffs against push**: pull requires Prometheus to reach every target directly — in highly dynamic environments (Lambda functions, batch jobs, ephemeral containers that live for < 15s), pull is impractical. For these cases, Prometheus provides the **Pushgateway**: a short-term metrics store where ephemeral jobs can push their final metrics before exiting. Prometheus then scrapes the Pushgateway. The Pushgateway is explicitly not intended for service-level metrics from long-lived services — it is specifically for batch jobs and cron-style processes. Another pull disadvantage: Prometheus needs network access to all scrape targets. In a network-segmented environment (VPCs with strict ingress rules), you may need to deploy Prometheus inside each segment or use **remote_write** to federate metrics to a central system. The **Prometheus federation** pattern (one Prometheus scraping another Prometheus's `/federate` endpoint) and **remote_write** to systems like Thanos, Cortex, or Mimir solve the horizontal scalability and long-term retention limitations of single-node Prometheus.",
        np: "Pull model को core advantage **operational simplicity र control** हो। Prometheus server ले scrape schedule own गर्छ — sample ठ्याक्कै कहिले collect भयो, कुन interval मा, र target reachable थियो कि थिएन तपाईंलाई थाहा छ। Target down छ भने, Prometheus ले `up=0` record गर्छ र alert गर्न सक्छ। Push model मा, silent target (crashed process, network partition) र केवल push नगरेको target मा अन्तर गर्न सकिँदैन — absence detect गर्न heartbeat metric वा TTL logic चाहिन्छ। Pull सँग, scrape response को absence आफैँ signal हो। Pull ले **debugging effortless** पनि बनाउँछ: service ले के metric expose गर्छ check गर्न, केवल `curl http://service:8080/metrics` गर्नुहोस्। Target side मा outbound push traffic को लागि agent configuration, credential, वा firewall rule आवश्यक छैन। Monitoring configuration Prometheus मा रहन्छ (को scrape गर्ने, कति पटक) प्रत्येक service को push configuration मा scattered नभई। **Push विरुद्ध Tradeoff**: pull को लागि Prometheus ले प्रत्येक target directly reach गर्नुपर्छ — highly dynamic environment (Lambda function, batch job, < 15s बाँच्ने ephemeral container) मा pull impractical छ। यी case को लागि, Prometheus ले **Pushgateway** provide गर्छ: short-term metrics store जहाँ ephemeral job ले exit अघि final metric push गर्न सक्छ। Prometheus ले त्यसपछि Pushgateway scrape गर्छ। Pushgateway explicitly long-lived service बाट service-level metric को लागि intended छैन — यो specifically batch job र cron-style process को लागि हो।",
        jp: "プルモデルの核心的な利点は**運用のシンプルさとコントロール**です。Prometheus サーバーがスクレイプスケジュールを所有します — サンプルがいつ収集されたか、どのような間隔で、ターゲットが到達可能だったかどうかを正確に把握しています。ターゲットがダウンしていれば Prometheus は `up=0` を記録し、それをアラートできます。プッシュモデルでは、サイレントなターゲット（クラッシュしたプロセス・ネットワーク分断）と単にまだプッシュしていないターゲットを区別できません — 欠如を検出するためにハートビートメトリクスや TTL ロジックが必要です。プルでは、スクレイプレスポンスの欠如がそれ自体シグナルです。プルはまた**デバッグを簡単**にします：サービスが公開するメトリクスを確認するには、`curl http://service:8080/metrics` するだけです。ターゲット側でエージェント設定・認証情報・アウトバウンドプッシュトラフィックのファイアウォールルールは不要です。監視設定はすべてのサービスのプッシュ設定に分散するのではなく Prometheus に集中します（誰をスクレイプするか・どのくらいの頻度で）。**プッシュとのトレードオフ**：プルは Prometheus がすべてのターゲットに直接到達することを要求します — 高度に動的な環境（Lambda 関数・バッチジョブ・15 秒未満の一時的なコンテナ）ではプルは非現実的です。これらのケースでは Prometheus は **Pushgateway** を提供します：一時的なジョブが終了前に最終メトリクスをプッシュできる短期メトリクスストア。Prometheus は次に Pushgateway をスクレイプします。Pushgateway は長命サービスのサービスレベルメトリクス向けでは明示的にありません — 具体的にはバッチジョブと cron スタイルのプロセス向けです。",
      },
      tag: {
        en: "pull vs push model",
        np: "pull vs push model",
        jp: "プル対プッシュモデル",
      },
    },
    {
      question: {
        en: "When should I use a Histogram vs a Summary, and why is the Histogram almost always the right choice?",
        np: "Histogram vs Summary कहिले प्रयोग गर्ने, र Histogram किन लगभग सधैं सही choice हो?",
        jp: "ヒストグラムとサマリーをいつ使うべきで、なぜヒストグラムがほぼ常に正しい選択なのか？",
      },
      answer: {
        en: "The fundamental difference is **where quantiles are computed**: in a Histogram, quantiles are computed server-side at query time by Prometheus using `histogram_quantile(0.99, rate(...[5m]))`. In a Summary, quantiles are pre-computed client-side inside the instrumented application before the data is even scraped. This difference drives everything else. **Histograms are aggregatable; summaries are not.** If you have 10 instances of a service each reporting a p99 latency of 50ms, the true p99 across all 10 instances is not necessarily 50ms — it depends on the distribution of requests each instance handled. With a Histogram, Prometheus can aggregate the bucket counts from all 10 instances and compute the actual p99 across the entire fleet. With a Summary, the per-instance quantiles cannot be mathematically combined — you'd have to pick one instance's value as representative, which is misleading for horizontal scaling scenarios. **Histograms require upfront bucket selection.** You must choose your histogram buckets when you write the instrumentation code, before you know what the actual latency distribution looks like. This is a real limitation: if your SLO is 200ms and all your buckets are 1s, 5s, 10s, you cannot compute p99 at the 200ms level. Choose buckets around your SLO boundaries: `[0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]` for a 200ms SLO. Prometheus 2.40+ supports **native histograms** (also called sparse histograms) which automatically adapt bucket boundaries and avoid the upfront selection problem. **Summaries are useful when**: you need accurate high-precision quantiles for a single-instance application (not horizontally scaled); the quantile boundaries are known in advance and fixed; you cannot tolerate the approximation error of bucket-based quantile estimation. In practice, for service instrumentation in a distributed system, Histograms with appropriately-chosen buckets cover 99% of use cases and should be the default choice. The aggregatability property alone makes them worth the bucket-selection overhead.",
        np: "Fundamental difference **quantile कहाँ compute हुन्छ** हो: Histogram मा, quantile Prometheus ले `histogram_quantile(0.99, rate(...[5m]))` प्रयोग गरेर query time मा server-side compute हुन्छ। Summary मा, quantile data scrape हुनु अघि नै instrumented application भित्र client-side pre-compute हुन्छ। यो difference ले बाँकी सबै drive गर्छ। **Histogram aggregatable छन्; summary छैन।** यदि service का 10 instance प्रत्येकले 50ms को p99 latency report गर्दैछन् भने, 10 instance मा true p99 जरुरी 50ms होइन — यो प्रत्येक instance ले handle गरेको request को distribution मा depend गर्छ। Histogram सँग, Prometheus ले 10 instance बाट bucket count aggregate गर्न र पूरै fleet मा actual p99 compute गर्न सक्छ। Summary सँग, per-instance quantile mathematically combine गर्न सकिँदैन — तपाईंले एउटा instance को value representative को रूपमा pick गर्नुपर्थ्यो, जुन horizontal scaling scenario को लागि misleading हुन्छ। **Histogram मा upfront bucket selection चाहिन्छ।** Instrumentation code लेख्दा actual latency distribution कस्तो देखिन्छ थाहा नहुँदा bucket choose गर्नुपर्छ। यो real limitation हो: तपाईंको SLO 200ms छ र सबै bucket 1s, 5s, 10s छन् भने, 200ms level मा p99 compute गर्न सकिँदैन। SLO boundary को वरिपरि bucket छान्नुहोस्: 200ms SLO को लागि `[0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]`। Prometheus 2.40+ ले **native histogram** (sparse histogram पनि भनिन्छ) support गर्छ जुन bucket boundary automatically adapt गर्छ र upfront selection problem avoid गर्छ।",
        jp: "根本的な違いは**パーセンタイルがどこで計算されるか**です：ヒストグラムでは、パーセンタイルは Prometheus が `histogram_quantile(0.99, rate(...[5m]))` を使ってクエリ時にサーバー側で計算します。サマリーでは、パーセンタイルはデータがスクレイプされる前に計装されたアプリケーション内でクライアント側で事前計算されます。この違いが他のすべてを決定します。**ヒストグラムは集約可能；サマリーはそうでない。** サービスの 10 インスタンスが各々 p99 レイテンシーを 50ms と報告している場合、10 インスタンス全体の真の p99 は必ずしも 50ms ではありません — 各インスタンスが処理したリクエストの分布に依存します。ヒストグラムを使えば、Prometheus は 10 インスタンスからバケットカウントを集約してフリート全体の実際の p99 を計算できます。サマリーでは、インスタンスごとのパーセンタイルを数学的に結合できません — 水平スケーリングシナリオでは誤解を招く、1 つのインスタンスの値を代表として選ぶしかありません。**ヒストグラムは事前のバケット選択が必要です。** 実際のレイテンシー分布がどのように見えるかを知る前に、計装コードを書く際にヒストグラムのバケットを選択する必要があります。これは本当の制限です：SLO が 200ms でバケットがすべて 1s・5s・10s の場合、200ms レベルで p99 を計算できません。SLO の境界周辺でバケットを選択する：200ms SLO の場合は `[0.01, 0.05, 0.1, 0.2, 0.5, 1.0, 2.0, 5.0]`。Prometheus 2.40+ はバケット境界を自動的に適応させ事前選択の問題を回避する**ネイティブヒストグラム**をサポートしています。",
      },
      tag: {
        en: "histogram vs summary",
        np: "histogram vs summary",
        jp: "ヒストグラム対サマリー",
      },
    },
  ],
};
