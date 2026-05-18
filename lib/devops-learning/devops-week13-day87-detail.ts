import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Exporters** are small processes that translate metrics from third-party systems that do not natively speak the Prometheus exposition format into that format. The canonical example is the **node_exporter**: Linux itself does not expose Prometheus metrics, but node_exporter reads from `/proc` and `/sys` (the kernel's virtual filesystem interfaces) and translates CPU usage, memory, disk I/O, network stats, and hundreds of other host-level metrics into Prometheus format on port 9100. When you install node_exporter on every host, `prometheus.yml` scrapes all of them and you get a complete picture of your infrastructure without any application code changes. The Prometheus ecosystem has exporters for virtually every common system: **databases** (mysqld_exporter, postgres_exporter, mongodb_exporter, redis_exporter), **message queues** (kafka_exporter, rabbitmq_exporter), **web servers** (nginx-prometheus-exporter, apache_exporter), **cloud services** (cloudwatch_exporter for AWS, stackdriver_exporter for GCP), **hardware** (ipmi_exporter, smartctl_exporter), and **networking** (blackbox_exporter for probing HTTP/TCP/DNS/ICMP endpoints). The blackbox_exporter is particularly valuable: it does not run alongside your service — instead it probes endpoints from the outside (like a synthetic user would), measuring HTTP status codes, SSL certificate expiry, DNS resolution time, and TCP connection establishment. This gives you **external availability** — whether users can reach your service — distinct from the internal RED metrics your service reports about itself.",
    np: "**Exporter** सानो process हो जसले third-party system बाट metric translate गर्छ जुन natively Prometheus exposition format मा बोल्दैन त्यो format मा। Canonical example **node_exporter** हो: Linux आफैँले Prometheus metric expose गर्दैन, तर node_exporter ले `/proc` र `/sys` (kernel को virtual filesystem interface) बाट पढ्छ र CPU usage, memory, disk I/O, network stat, र सयौं अन्य host-level metric लाई port 9100 मा Prometheus format मा translate गर्छ। प्रत्येक host मा node_exporter install गर्दा, `prometheus.yml` ले ती सबैलाई scrape गर्छ र कुनै application code change बिना infrastructure को complete picture पाउनुहुन्छ। Prometheus ecosystem मा लगभग हरेक common system को लागि exporter छन्: **database** (mysqld_exporter, postgres_exporter, mongodb_exporter, redis_exporter), **message queue** (kafka_exporter, rabbitmq_exporter), **web server** (nginx-prometheus-exporter, apache_exporter), **cloud service** (AWS को लागि cloudwatch_exporter, GCP को लागि stackdriver_exporter), **hardware** (ipmi_exporter, smartctl_exporter), र **networking** (HTTP/TCP/DNS/ICMP endpoint probe गर्न blackbox_exporter)। Blackbox_exporter विशेष रूपमा valuable छ: यो तपाईंको service सँगै run हुँदैन — बरु यसले endpoint बाहिरबाट probe गर्छ (synthetic user जस्तै), HTTP status code, SSL certificate expiry, DNS resolution time, र TCP connection establishment measure गर्दै। यसले **external availability** दिन्छ — user ले service reach गर्न सक्छ कि सक्दैन — service ले आफ्नो बारेमा report गर्ने internal RED metric भन्दा distinct।",
    jp: "**エクスポーター**は、Prometheus 公開形式をネイティブに話さないサードパーティシステムからのメトリクスをその形式に変換する小さなプロセスです。標準的な例は **node_exporter** です：Linux 自体は Prometheus メトリクスを公開しませんが、node_exporter は `/proc` と `/sys`（カーネルの仮想ファイルシステムインターフェース）から読み取り、CPU 使用率・メモリ・ディスク I/O・ネットワーク統計・その他何百ものホストレベルのメトリクスをポート 9100 で Prometheus 形式に変換します。すべてのホストに node_exporter をインストールすると、`prometheus.yml` がそれらすべてをスクレイプし、アプリケーションコードを変更せずにインフラの完全な全体像が得られます。Prometheus エコシステムには実質的にすべての一般的なシステム向けのエクスポーターがあります：**データベース**（mysqld_exporter・postgres_exporter・mongodb_exporter・redis_exporter）・**メッセージキュー**（kafka_exporter・rabbitmq_exporter）・**Web サーバー**（nginx-prometheus-exporter・apache_exporter）・**クラウドサービス**（AWS 用の cloudwatch_exporter・GCP 用の stackdriver_exporter）・**ハードウェア**（ipmi_exporter・smartctl_exporter）・**ネットワーキング**（HTTP/TCP/DNS/ICMP エンドポイントをプローブする blackbox_exporter）。blackbox_exporter は特に価値があります：サービスと並行して実行されません — 代わりに外部からエンドポイントをプローブし（合成ユーザーのように）、HTTP ステータスコード・SSL 証明書の有効期限・DNS 解決時間・TCP 接続確立を測定します。これにより**外部可用性** — ユーザーがサービスに到達できるかどうか — が得られ、サービスが自身について報告する内部 RED メトリクスとは区別されます。",
  } as const,
  o2: {
    en: "**Service discovery (SD)** solves the problem of dynamic infrastructure: in a Kubernetes cluster or auto-scaling EC2 group, targets come and go constantly. Maintaining a static list in `prometheus.yml` is untenable — it would require a Prometheus config reload every time a pod starts or a node is added. Prometheus supports over 20 service discovery mechanisms built-in: `kubernetes_sd_configs` discovers pods, services, endpoints, nodes, and ingresses from the Kubernetes API server. `ec2_sd_configs` discovers EC2 instances via the AWS API. `consul_sd_configs` queries HashiCorp Consul's service catalog. `dns_sd_configs` does SRV record lookups. `file_sd_configs` reads a JSON/YAML file of targets that an external system (Ansible, Terraform, a custom script) populates. All SD mechanisms work the same way: Prometheus polls the SD source and maintains an up-to-date list of discovered targets. Each discovered target arrives with a set of metadata labels (`__meta_kubernetes_pod_name`, `__meta_ec2_instance_id`) that you can use in **relabeling** rules to filter, rename, or drop targets before they are scraped. **Relabeling** (`relabel_configs`) is Prometheus's powerful pre-scrape transformation pipeline. Common patterns: drop pods that do not have a specific annotation (`kubernetes.io/scrape: \"true\"`); extract the metrics port from an annotation rather than the default; add the Kubernetes namespace as a label to every metric. The `__address__` label contains the scrape address — you can rewrite it to change the host or port. Labels starting with `__` are stripped before the scraped metrics are stored, so they do not appear as metric labels. The `metric_relabel_configs` stage runs after scraping but before storage — use it to drop high-cardinality metrics from third-party exporters you don't control.",
    np: "**Service discovery (SD)** ले dynamic infrastructure को problem solve गर्छ: Kubernetes cluster वा auto-scaling EC2 group मा, target constantly आउँछन् र जान्छन्। `prometheus.yml` मा static list maintain गर्नु untenable छ — pod start हुँदा वा node add हुँदा Prometheus config reload चाहिन्थ्यो। Prometheus ले 20 भन्दा बढी service discovery mechanism built-in support गर्छ: `kubernetes_sd_configs` ले Kubernetes API server बाट pod, service, endpoint, node, र ingress discover गर्छ। `ec2_sd_configs` ले AWS API मार्फत EC2 instance discover गर्छ। `consul_sd_configs` ले HashiCorp Consul को service catalog query गर्छ। `dns_sd_configs` ले SRV record lookup गर्छ। `file_sd_configs` ले external system (Ansible, Terraform, custom script) ले populate गर्ने JSON/YAML file of target पढ्छ। सबै SD mechanism एउटै तरिकाले काम गर्छन्: Prometheus ले SD source poll गर्छ र discovered target को up-to-date list maintain गर्छ। प्रत्येक discovered target metadata label (`__meta_kubernetes_pod_name`, `__meta_ec2_instance_id`) को set सँग आउँछ जुन scrape हुनु अघि target filter, rename, वा drop गर्न **relabeling** rule मा प्रयोग गर्न सकिन्छ। **Relabeling** (`relabel_configs`) Prometheus को powerful pre-scrape transformation pipeline हो। Common pattern: specific annotation (`kubernetes.io/scrape: \"true\"`) नभएको pod drop गर्नुहोस्; default को सट्टा annotation बाट metrics port extract गर्नुहोस्; प्रत्येक metric मा Kubernetes namespace label को रूपमा add गर्नुहोस्। `__address__` label ले scrape address contain गर्छ — host वा port change गर्न rewrite गर्न सकिन्छ। `__` बाट सुरु हुने label scraped metric store हुनु अघि strip हुन्छ, त्यसैले metric label को रूपमा appear हुँदैन। `metric_relabel_configs` stage scraping पछि तर storage अघि run हुन्छ — नियन्त्रण नगर्ने third-party exporter बाट high-cardinality metric drop गर्न प्रयोग गर्नुहोस्।",
    jp: "**サービスディスカバリー（SD）**は動的インフラの問題を解決します：Kubernetes クラスターや Auto Scaling EC2 グループでは、ターゲットが常に来ては去ります。`prometheus.yml` に静的リストを維持することは持続不可能です — ポッドが起動するたびやノードが追加されるたびに Prometheus の設定のリロードが必要になります。Prometheus はビルトインで 20 以上のサービスディスカバリーメカニズムをサポートします：`kubernetes_sd_configs` は Kubernetes API サーバーからポッド・サービス・エンドポイント・ノード・イングレスを検出します。`ec2_sd_configs` は AWS API 経由で EC2 インスタンスを検出します。`consul_sd_configs` は HashiCorp Consul のサービスカタログをクエリします。`dns_sd_configs` は SRV レコードのルックアップを行います。`file_sd_configs` は外部システム（Ansible・Terraform・カスタムスクリプト）が入力する JSON/YAML ターゲットファイルを読み取ります。すべての SD メカニズムは同じ方法で動作します：Prometheus は SD ソースをポーリングし、発見されたターゲットの最新リストを維持します。各発見されたターゲットはメタデータラベル（`__meta_kubernetes_pod_name`・`__meta_ec2_instance_id`）のセットとともに到着し、スクレイプ前にターゲットをフィルタリング・名前変更・削除するための**リラベリング**ルールで使用できます。**リラベリング**（`relabel_configs`）は Prometheus の強力なプリスクレイプ変換パイプラインです。一般的なパターン：特定のアノテーション（`kubernetes.io/scrape: \"true\"`）を持たないポッドを削除；デフォルトではなくアノテーションからメトリクスポートを抽出；すべてのメトリクスに Kubernetes 名前空間をラベルとして追加。`__address__` ラベルにはスクレイプアドレスが含まれます — ホストやポートを変更するために書き換えることができます。`__` で始まるラベルはスクレイプされたメトリクスが保存される前に削除されるため、メトリクスラベルとして表示されません。`metric_relabel_configs` ステージはスクレイプ後・保存前に実行されます — 制御できないサードパーティエクスポーターからの高カーディナリティメトリクスを削除するために使用します。",
  } as const,
};

export const DEVOPS_DAY_87_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Exporter ecosystem & scrape job patterns",
        np: "Exporter ecosystem र scrape job pattern",
        jp: "エクスポーターエコシステムとスクレイプジョブパターン",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Common Prometheus exporters — what they monitor and their default ports",
            np: "Common Prometheus exporter — के monitor गर्छन् र default port",
            jp: "一般的な Prometheus エクスポーター — 何を監視するかとデフォルトポート",
          },
          headers: [
            { en: "Exporter", np: "Exporter", jp: "エクスポーター" },
            { en: "Monitors", np: "Monitor गर्छ", jp: "監視対象" },
            { en: "Default port", np: "Default port", jp: "デフォルトポート" },
            { en: "Key metrics", np: "Key metric", jp: "主要メトリクス" },
          ],
          rows: [
            [
              { en: "node_exporter", np: "node_exporter", jp: "node_exporter" },
              { en: "Linux host: CPU, memory, disk, network, filesystem", np: "Linux host: CPU, memory, disk, network, filesystem", jp: "Linux ホスト：CPU・メモリ・ディスク・ネットワーク・ファイルシステム" },
              { en: "9100", np: "9100", jp: "9100" },
              { en: "`node_cpu_seconds_total`, `node_memory_MemAvailable_bytes`, `node_disk_io_time_seconds_total`", np: "`node_cpu_seconds_total`, `node_memory_MemAvailable_bytes`, `node_disk_io_time_seconds_total`", jp: "`node_cpu_seconds_total`・`node_memory_MemAvailable_bytes`・`node_disk_io_time_seconds_total`" },
            ],
            [
              { en: "blackbox_exporter", np: "blackbox_exporter", jp: "blackbox_exporter" },
              { en: "External probing: HTTP/HTTPS, TCP, DNS, ICMP", np: "External probing: HTTP/HTTPS, TCP, DNS, ICMP", jp: "外部プローブ：HTTP/HTTPS・TCP・DNS・ICMP" },
              { en: "9115", np: "9115", jp: "9115" },
              { en: "`probe_success`, `probe_duration_seconds`, `probe_ssl_earliest_cert_expiry`", np: "`probe_success`, `probe_duration_seconds`, `probe_ssl_earliest_cert_expiry`", jp: "`probe_success`・`probe_duration_seconds`・`probe_ssl_earliest_cert_expiry`" },
            ],
            [
              { en: "postgres_exporter", np: "postgres_exporter", jp: "postgres_exporter" },
              { en: "PostgreSQL: connections, replication lag, query stats, lock waits", np: "PostgreSQL: connection, replication lag, query stat, lock wait", jp: "PostgreSQL：接続・レプリケーションラグ・クエリ統計・ロック待ち" },
              { en: "9187", np: "9187", jp: "9187" },
              { en: "`pg_stat_activity_count`, `pg_replication_lag`, `pg_locks_count`", np: "`pg_stat_activity_count`, `pg_replication_lag`, `pg_locks_count`", jp: "`pg_stat_activity_count`・`pg_replication_lag`・`pg_locks_count`" },
            ],
            [
              { en: "redis_exporter", np: "redis_exporter", jp: "redis_exporter" },
              { en: "Redis: memory, hit rate, connected clients, replication", np: "Redis: memory, hit rate, connected client, replication", jp: "Redis：メモリ・ヒット率・接続クライアント・レプリケーション" },
              { en: "9121", np: "9121", jp: "9121" },
              { en: "`redis_memory_used_bytes`, `redis_keyspace_hits_total`, `redis_connected_clients`", np: "`redis_memory_used_bytes`, `redis_keyspace_hits_total`, `redis_connected_clients`", jp: "`redis_memory_used_bytes`・`redis_keyspace_hits_total`・`redis_connected_clients`" },
            ],
            [
              { en: "kube-state-metrics", np: "kube-state-metrics", jp: "kube-state-metrics" },
              { en: "Kubernetes object state: pod phase, deployment replicas, resource limits", np: "Kubernetes object state: pod phase, deployment replica, resource limit", jp: "Kubernetes オブジェクト状態：ポッドフェーズ・デプロイメントレプリカ・リソース制限" },
              { en: "8080", np: "8080", jp: "8080" },
              { en: "`kube_pod_status_phase`, `kube_deployment_status_replicas_unavailable`, `kube_node_status_condition`", np: "`kube_pod_status_phase`, `kube_deployment_status_replicas_unavailable`, `kube_node_status_condition`", jp: "`kube_pod_status_phase`・`kube_deployment_status_replicas_unavailable`・`kube_node_status_condition`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Kubernetes service discovery & relabeling",
        np: "Kubernetes service discovery र relabeling",
        jp: "Kubernetes サービスディスカバリーとリラベリング",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Kubernetes SD config, relabeling patterns & blackbox_exporter probe",
            np: "Kubernetes SD config, relabeling pattern र blackbox_exporter probe",
            jp: "Kubernetes SD 設定・リラベリングパターン・blackbox_exporter プローブ",
          },
          code: `# ── Kubernetes Pod SD — scrape only annotated pods ───────────────────
scrape_configs:
  - job_name: "kubernetes-pods"
    kubernetes_sd_configs:
      - role: pod               # discover all pods in the cluster
        # role options: node | pod | service | endpoints | ingress

    relabel_configs:
      # 1. Only scrape pods that have annotation prometheus.io/scrape: "true"
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
        action: keep            # drop anything that does NOT match the regex
        regex: "true"

      # 2. Override the scrape path if annotation prometheus.io/path is set
      - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_path]
        action: replace
        target_label: __metrics_path__
        regex: "(.+)"           # only apply if annotation is non-empty

      # 3. Override the scrape port from annotation prometheus.io/port
      - source_labels: [__address__, __meta_kubernetes_pod_annotation_prometheus_io_port]
        action: replace
        regex: "([^:]+)(?::\\d+)?;(\\d+)"
        replacement: "$1:$2"
        target_label: __address__

      # 4. Preserve useful k8s labels on every scraped metric
      - action: labelmap
        regex: "__meta_kubernetes_pod_label_(.+)"  # copies all pod labels

      - source_labels: [__meta_kubernetes_namespace]
        action: replace
        target_label: kubernetes_namespace

      - source_labels: [__meta_kubernetes_pod_name]
        action: replace
        target_label: kubernetes_pod_name

  # ── Kubernetes Node SD — scrape node_exporter on every node ──────────
  - job_name: "kubernetes-nodes"
    kubernetes_sd_configs:
      - role: node

    relabel_configs:
      # node_exporter runs on port 9100; kubelet advertises port 10250
      - source_labels: [__address__]
        regex: "(.+):10250"
        replacement: "$1:9100"
        target_label: __address__

  # ── Blackbox exporter — external HTTP probe ───────────────────────────
  - job_name: "blackbox-http"
    metrics_path: /probe
    params:
      module: [http_2xx]        # use the http_2xx module (defined in blackbox.yml)
    static_configs:
      - targets:
          - "https://api.example.com/health"
          - "https://app.example.com"
    relabel_configs:
      # Move the target URL into a label, then set __address__ to the exporter
      - source_labels: [__address__]
        target_label: __param_target
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: "blackbox-exporter:9115"

# ── blackbox.yml (exporter config) ───────────────────────────────────────
# modules:
#   http_2xx:
#     prober: http
#     timeout: 10s
#     http:
#       valid_http_versions: ["HTTP/1.1", "HTTP/2.0"]
#       valid_status_codes: [200, 204]
#       fail_if_ssl: false
#       fail_if_not_ssl: true   # alert if someone is serving plain HTTP
#       tls_config:
#         insecure_skip_verify: false
#   tcp_connect:
#     prober: tcp
#     timeout: 5s

# ── metric_relabel_configs — drop unwanted metrics post-scrape ────────────
# Useful when a third-party exporter produces high-cardinality metrics
# you cannot control.
#
# scrape_configs:
#   - job_name: "some-exporter"
#     ...
#     metric_relabel_configs:
#       # Drop any metric whose name contains "per_user" (high-cardinality)
#       - source_labels: [__name__]
#         regex: ".*per_user.*"
#         action: drop
#       # Drop a specific high-cardinality label from all metrics
#       - regex: "user_id"
#         action: labeldrop

# ── file_sd_configs — for externally-managed target lists ────────────────
# scrape_configs:
#   - job_name: "external-hosts"
#     file_sd_configs:
#       - files: ["/etc/prometheus/targets/*.json"]
#         refresh_interval: 30s   # re-read files every 30s
#
# /etc/prometheus/targets/web-servers.json:
# [
#   {
#     "targets": ["web01:9100", "web02:9100"],
#     "labels": {"env": "production", "team": "platform"}
#   }
# ]`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Set up node_exporter and postgres_exporter (or redis_exporter) on your local machine or a VM using Docker. For node_exporter: `docker run -d --net=\"host\" --pid=\"host\" -v \"/:/host:ro,rslave\" quay.io/prometheus/node-exporter:latest --path.rootfs=/host`. For redis_exporter: spin up a Redis container, then `docker run -d -p 9121:9121 oliver006/redis_exporter --redis.addr redis://host.docker.internal:6379`. Confirm both expose metrics at their default ports. Add both as scrape jobs in `prometheus.yml` and verify they appear as UP targets in Prometheus. Then write PromQL queries for: (1) CPU usage per core: `1 - rate(node_cpu_seconds_total{mode=\"idle\"}[5m])`; (2) memory utilization: `1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes`; (3) Redis cache hit rate: `rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))`.",
              np: "Docker प्रयोग गरेर node_exporter र postgres_exporter (वा redis_exporter) local machine वा VM मा setup गर्नुहोस्। node_exporter को लागि: `docker run -d --net=\"host\" --pid=\"host\" -v \"/:/host:ro,rslave\" quay.io/prometheus/node-exporter:latest --path.rootfs=/host`। Redis_exporter को लागि: Redis container spin up गर्नुहोस्, त्यसपछि `docker run -d -p 9121:9121 oliver006/redis_exporter --redis.addr redis://host.docker.internal:6379`। दुवैले आफ्नो default port मा metric expose गर्छन् confirm गर्नुहोस्। दुवैलाई `prometheus.yml` मा scrape job को रूपमा add गर्नुहोस् र Prometheus मा UP target को रूपमा appear हुन्छन् verify गर्नुहोस्। त्यसपछि यी PromQL query लेख्नुहोस्: (१) core अनुसार CPU usage: `1 - rate(node_cpu_seconds_total{mode=\"idle\"}[5m])`; (२) memory utilization: `1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes`; (३) Redis cache hit rate: `rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))`।",
              jp: "Docker を使用してローカルマシンまたは VM に node_exporter と postgres_exporter（または redis_exporter）をセットアップする。node_exporter の場合：`docker run -d --net=\"host\" --pid=\"host\" -v \"/:/host:ro,rslave\" quay.io/prometheus/node-exporter:latest --path.rootfs=/host`。redis_exporter の場合：Redis コンテナを起動し、`docker run -d -p 9121:9121 oliver006/redis_exporter --redis.addr redis://host.docker.internal:6379`。両方がデフォルトポートでメトリクスを公開することを確認する。両方を `prometheus.yml` のスクレイプジョブとして追加し、Prometheus で UP ターゲットとして表示されることを確認する。次の PromQL クエリを書く：(1) コアごとの CPU 使用率：`1 - rate(node_cpu_seconds_total{mode=\"idle\"}[5m])`；(2) メモリ使用率：`1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes`；(3) Redis キャッシュヒット率：`rate(redis_keyspace_hits_total[5m]) / (rate(redis_keyspace_hits_total[5m]) + rate(redis_keyspace_misses_total[5m]))`。",
            },
            {
              en: "Configure the blackbox_exporter to probe at least three external HTTP/HTTPS endpoints (e.g. your own service, a public API, a third-party dependency). Write a `blackbox.yml` with both an `http_2xx` module (that fails if not HTTPS) and a `tcp_connect` module. Add the blackbox scrape job to `prometheus.yml` using the relabeling pattern that converts the target URL into an `instance` label. Then write PromQL queries for: (1) which endpoints are currently down: `probe_success == 0`; (2) SSL certificate expiry in days: `(probe_ssl_earliest_cert_expiry - time()) / 86400`; (3) average HTTP probe duration by target: `avg by (instance) (probe_duration_seconds)`. Set up an alerting rule that fires when any endpoint has been down for more than 2 minutes or an SSL cert expires in fewer than 30 days.",
              np: "कम्तीमा तीनवटा external HTTP/HTTPS endpoint probe गर्न blackbox_exporter configure गर्नुहोस् (जस्तै आफ्नै service, public API, third-party dependency)। `http_2xx` module (HTTPS नभएमा fail हुने) र `tcp_connect` module दुवै सहित `blackbox.yml` लेख्नुहोस्। Target URL लाई `instance` label मा convert गर्ने relabeling pattern प्रयोग गरेर `prometheus.yml` मा blackbox scrape job add गर्नुहोस्। त्यसपछि यी PromQL query लेख्नुहोस्: (१) अहिले down भएको endpoint: `probe_success == 0`; (२) SSL certificate expiry दिनमा: `(probe_ssl_earliest_cert_expiry - time()) / 86400`; (३) target अनुसार average HTTP probe duration: `avg by (instance) (probe_duration_seconds)`। कुनै endpoint 2 minute भन्दा बढी down भएमा वा SSL cert 30 दिनभन्दा कम मा expire हुँदा fire हुने alerting rule setup गर्नुहोस्।",
              jp: "少なくとも 3 つの外部 HTTP/HTTPS エンドポイント（例：自分のサービス・パブリック API・サードパーティの依存関係）をプローブするために blackbox_exporter を設定する。`http_2xx` モジュール（HTTPS でない場合に失敗する）と `tcp_connect` モジュールの両方を持つ `blackbox.yml` を書く。ターゲット URL を `instance` ラベルに変換するリラベリングパターンを使用して、`prometheus.yml` に blackbox スクレイプジョブを追加する。次の PromQL クエリを書く：(1) 現在ダウンしているエンドポイント：`probe_success == 0`；(2) 日数での SSL 証明書の有効期限：`(probe_ssl_earliest_cert_expiry - time()) / 86400`；(3) ターゲット別の平均 HTTP プローブ時間：`avg by (instance) (probe_duration_seconds)`。エンドポイントが 2 分以上ダウンしているか SSL 証明書の有効期限が 30 日未満になった場合に発火するアラートルールを設定する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `relabel_configs` and `metric_relabel_configs`, and when do I use each?",
        np: "`relabel_configs` र `metric_relabel_configs` बीचको फरक के हो, र कहिले कुन प्रयोग गर्ने?",
        jp: "`relabel_configs` と `metric_relabel_configs` の違いは何で、それぞれをいつ使うのか？",
      },
      answer: {
        en: "`relabel_configs` runs **before scraping** — it operates on the discovered target metadata to decide whether and how to scrape a target. The input labels are the `__meta_*` labels from the service discovery mechanism plus the `__address__` label. Use `relabel_configs` to: filter targets (keep/drop based on annotations or SD metadata), rewrite the scrape address or path, inject labels from SD metadata onto the scraped metrics (e.g. copy the Kubernetes pod name into a `pod` label). The critical point: `relabel_configs` determines whether a target is scraped at all — dropping a target here means zero HTTP requests and zero storage for that target. `metric_relabel_configs` runs **after scraping, before storage** — it operates on the individual metric samples collected from a target. Use it to: drop metrics from third-party exporters that you cannot control (high-cardinality or unwanted metric names), drop or rename specific labels from scraped metrics, keep only a subset of metrics from a noisy exporter. The key distinction: `relabel_configs` is about **target management**; `metric_relabel_configs` is about **metric filtering and reshaping after collection**. Both use the same relabeling action syntax (`keep`, `drop`, `replace`, `labelmap`, `labeldrop`, `labelkeep`, `hashmod`). Order of execution: service discovery → `relabel_configs` → HTTP scrape → `metric_relabel_configs` → TSDB write.",
        np: "`relabel_configs` **scraping अघि** run हुन्छ — यसले discovered target metadata मा operate गर्छ target scrape गर्ने कि नगर्ने र कसरी गर्ने decide गर्न। Input label service discovery mechanism बाट `__meta_*` label र `__address__` label हुन्। `relabel_configs` यसको लागि प्रयोग गर्नुहोस्: target filter गर्न (annotation वा SD metadata मा आधारित keep/drop), scrape address वा path rewrite गर्न, SD metadata बाट scraped metric मा label inject गर्न (जस्तै Kubernetes pod name लाई `pod` label मा copy गर्न)। Critical point: `relabel_configs` ले target scrape हुन्छ कि हुँदैन determine गर्छ — target यहाँ drop गर्दा त्यो target को लागि zero HTTP request र zero storage हुन्छ। `metric_relabel_configs` **scraping पछि, storage अघि** run हुन्छ — target बाट collect गरिएको individual metric sample मा operate गर्छ। यसको लागि प्रयोग गर्नुहोस्: control गर्न नसकिने third-party exporter बाट metric drop गर्न (high-cardinality वा unwanted metric name), scraped metric बाट specific label drop वा rename गर्न, noisy exporter बाट metric को subset मात्र राख्न।",
        jp: "`relabel_configs` は**スクレイプ前**に実行されます — 発見されたターゲットのメタデータに基づいてターゲットをスクレイプするかどうか・どのようにするかを決定します。入力ラベルはサービスディスカバリーメカニズムからの `__meta_*` ラベルと `__address__` ラベルです。`relabel_configs` の用途：ターゲットをフィルタリング（アノテーションや SD メタデータに基づいて保持/削除）・スクレイプアドレスやパスを書き換え・SD メタデータからスクレイプされたメトリクスにラベルを注入（例：Kubernetes ポッド名を `pod` ラベルにコピー）。重要点：`relabel_configs` はターゲットがスクレイプされるかどうかを決定します — ここでターゲットを削除すると、そのターゲットへの HTTP リクエストがゼロになりストレージもゼロになります。`metric_relabel_configs` は**スクレイプ後・保存前**に実行されます — ターゲットから収集された個々のメトリクスサンプルに操作します。用途：制御できないサードパーティエクスポーターからのメトリクスを削除・スクレイプされたメトリクスから特定のラベルを削除または名前変更・ノイズの多いエクスポーターからのメトリクスのサブセットのみを保持。実行順序：サービスディスカバリー → `relabel_configs` → HTTP スクレイプ → `metric_relabel_configs` → TSDB 書き込み。",
      },
      tag: {
        en: "relabeling pipeline",
        np: "relabeling pipeline",
        jp: "リラベリングパイプライン",
      },
    },
  ],
};
