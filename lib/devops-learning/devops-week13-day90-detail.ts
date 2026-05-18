import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Grafana** is an open-source analytics and visualization platform that turns time-series data, logs, and traces into interactive dashboards. It is entirely **data-source-agnostic**: Grafana connects to Prometheus, Loki, Tempo, InfluxDB, Elasticsearch, CloudWatch, MySQL, PostgreSQL, and dozens of other backends through a plugin system — the same dashboard UI queries all of them using their native query languages. The core visual building block is the **panel**: a self-contained visualization unit configured with a data-source query, a visualization type, and display options. Grafana ships with a rich panel library — **Time series** (line/area/bar charts for metric trends), **Stat** (a single current value with optional coloured thresholds), **Gauge** (a value vs. a min/max range arc, ideal for CPU %/memory %), **Bar chart** (categorical comparison across endpoints or services), **Table** (multi-column sortable/filterable data), **Heatmap** (two-dimensional colour distribution, perfect for request latency histograms), **Logs** (streaming log lines from Loki with log-level colouring), and **Traces** (span waterfall view for distributed traces from Grafana Tempo). A **dashboard** is a collection of panels arranged in a flexible grid system. Rows can group panels thematically — one row per microservice, one row per infrastructure layer. Dashboards live inside **folders** in Grafana's organizational structure, and access control is enforced at the folder level through **organizations** (multi-tenant isolation) and teams/role assignments. **Template variables** are the feature that transforms static dashboards into dynamic, reusable tools: a variable like `$cluster` or `$namespace` appears as a dropdown at the top of the dashboard and injects its current value into every panel query as a label selector. Variables can be **query-typed** (populated from a PromQL `label_values()` call), **custom** (a fixed list like `production,staging,development`), **interval**, or **data-source** (to switch the entire dashboard between data sources). Grafana also connects to Prometheus by sending PromQL queries to the Prometheus HTTP API (`/api/v1/query_range`) and rendering the returned time-series JSON as charts — Grafana does not store metric data itself; it is purely a visualization and query layer on top of your existing backends. Finally, Grafana has a built-in **alerting system**: Alert Rules evaluate panel queries on a schedule (e.g. every 1 minute) and dispatch notifications via contact points (Slack, PagerDuty, email, webhooks) when conditions are breached — conceptually similar to Alertmanager, but embedded in the Grafana UI and capable of alerting on multiple data sources in a single rule.",
    np: "**Grafana** एक open-source analytics र visualization platform हो जसले time-series data, log, र trace लाई interactive dashboard मा बदल्छ। यो पूर्णतया **data-source-agnostic** छ: Grafana ले plugin system मार्फत Prometheus, Loki, Tempo, InfluxDB, Elasticsearch, CloudWatch, MySQL, PostgreSQL, र अरू धेरै backend मा connect गर्छ — एउटै dashboard UI ले तिनीहरू सबैलाई तिनीहरूको native query language प्रयोग गरेर query गर्छ। Core visual building block **panel** हो: data-source query, visualization type, र display option सँग configure गरिएको self-contained visualization unit। Grafana मा rich panel library छ — **Time series** (metric trend को लागि line/area/bar chart), **Stat** (optional coloured threshold सहित single current value), **Gauge** (min/max range arc विरुद्ध value, CPU %/memory % को लागि ideal), **Bar chart** (endpoint वा service मा categorical comparison), **Table** (multi-column sortable/filterable data), **Heatmap** (request latency histogram को लागि perfect दुई-आयामी colour distribution), **Logs** (log-level colouring सहित Loki बाट streaming log line), र **Traces** (Grafana Tempo बाट distributed trace को लागि span waterfall view)। **Dashboard** flexible grid system मा arrange गरिएको panel को collection हो। Row ले panel लाई thematically group गर्न सक्छ — प्रत्येक microservice को लागि एउटा row, प्रत्येक infrastructure layer को लागि एउटा row। Dashboard Grafana को organizational structure मा **folder** भित्र live गर्छ, र access control **organization** (multi-tenant isolation) र team/role assignment मार्फत folder level मा enforce हुन्छ। **Template variable** static dashboard लाई dynamic, reusable tool मा transform गर्ने feature हो: `$cluster` वा `$namespace` जस्तो variable dashboard को top मा dropdown को रूपमा देखिन्छ र label selector को रूपमा प्रत्येक panel query मा आफ्नो current value inject गर्छ। Variable **query-typed** (PromQL `label_values()` call बाट populate), **custom** (`production,staging,development` जस्तो fixed list), **interval**, वा **data-source** (पूरै dashboard data source बीच switch गर्न) हुन सक्छ। Grafana ले Prometheus HTTP API (`/api/v1/query_range`) मा PromQL query पठाएर र return भएको time-series JSON लाई chart को रूपमा render गरेर Prometheus सँग connect गर्छ — Grafana ले आफैं metric data store गर्दैन; यो purely तपाईंको existing backend माथि visualization र query layer हो। अन्तमा, Grafana मा built-in **alerting system** छ: Alert Rule ले schedule मा panel query evaluate गर्छ (जस्तै every 1 minute) र condition breach हुँदा contact point (Slack, PagerDuty, email, webhook) मार्फत notification dispatch गर्छ — Alertmanager सँग conceptually similar, तर Grafana UI मा embedded र single rule मा multiple data source मा alert गर्न सक्षम।",
    jp: "**Grafana** はオープンソースの分析・可視化プラットフォームで、時系列データ・ログ・トレースをインタラクティブなダッシュボードに変換します。完全に**データソース非依存**です：Grafana はプラグインシステムを通じて Prometheus・Loki・Tempo・InfluxDB・Elasticsearch・CloudWatch・MySQL・PostgreSQL など多数のバックエンドに接続します — 同じダッシュボード UI がネイティブのクエリ言語を使ってすべてをクエリします。コアの視覚的構成要素は**パネル**です：データソースクエリ・可視化タイプ・表示オプションで設定された自己完結型の可視化ユニット。Grafana にはリッチなパネルライブラリがあります — **時系列**（メトリクストレンド用の折れ線/エリア/棒グラフ）・**Stat**（オプションの色付き閾値を持つ単一の現在値）・**ゲージ**（min/max 範囲アーク対の値、CPU %/メモリ % に最適）・**棒グラフ**（エンドポイントやサービス間のカテゴリ比較）・**テーブル**（マルチカラムのソート/フィルタリング可能なデータ）・**ヒートマップ**（リクエストレイテンシーヒストグラムに最適な 2 次元カラー分布）・**ログ**（ログレベルの色付きで Loki からのストリーミングログ行）・**トレース**（Grafana Tempo からの分散トレース用スパンウォーターフォールビュー）。**ダッシュボード**は柔軟なグリッドシステムに配置されたパネルのコレクションです。行はパネルをテーマ別にグループ化できます — マイクロサービスごとに 1 行・インフラレイヤーごとに 1 行。ダッシュボードは Grafana の組織構造の**フォルダー**内に存在し、アクセス制御は**組織**（マルチテナント分離）とチーム/ロールの割り当てを通じてフォルダーレベルで適用されます。**テンプレート変数**は静的なダッシュボードを動的で再利用可能なツールに変換する機能です：`$cluster` や `$namespace` のような変数がダッシュボードの上部にドロップダウンとして表示され、ラベルセレクターとしてすべてのパネルクエリに現在の値を注入します。変数は**クエリ型**（PromQL の `label_values()` 呼び出しから入力）・**カスタム**（`production,staging,development` のような固定リスト）・**インターバル**・**データソース**（ダッシュボード全体をデータソース間で切り替える）にできます。Grafana は Prometheus HTTP API（`/api/v1/query_range`）に PromQL クエリを送信し、返された時系列 JSON をグラフとしてレンダリングすることで Prometheus に接続します — Grafana 自体はメトリクスデータを保存しません；既存のバックエンドの上の純粋な可視化・クエリレイヤーです。最後に Grafana には組み込みの**アラートシステム**があります：アラートルールはスケジュール（例：1 分ごと）でパネルクエリを評価し、条件が違反された際にコンタクトポイント（Slack・PagerDuty・メール・Webhook）経由で通知を送信します — Alertmanager と概念的に似ていますが、Grafana UI に組み込まれており、単一のルールで複数のデータソースにアラートできます。",
  } as const,
  o2: {
    en: "**Dashboard as code** is the practice of defining Grafana dashboards as JSON and provisioning them automatically — instead of clicking through the UI and hoping no one accidentally changes a panel. Every Grafana dashboard is, under the hood, a JSON document. You can export any dashboard via `Dashboard → Share → Export → Save to file`, store the JSON in a Git repository, peer-review it like any other infrastructure change, and auto-load it on Grafana startup via **provisioning**. Grafana provisioning uses three config layers: `grafana.ini` (global server settings), datasource provisioning YAMLs in `/etc/grafana/provisioning/datasources/` (define Prometheus, Loki, Tempo connections), and dashboard provisioning YAMLs in `/etc/grafana/provisioning/dashboards/` (tell Grafana which folders to scan for JSON files). With `updateIntervalSeconds: 30` and `disableDeletion: false`, Grafana polls the folder every 30 seconds and hot-reloads changed dashboards without a restart — enabling a GitOps workflow where a merged PR automatically updates production dashboards within 30 seconds. **Grafana annotations** are event markers overlaid on time-series panels as vertical lines with labels. They are ideal for correlating metric changes with deploys: when a deployment completes, your CI/CD pipeline posts an annotation to Grafana's API and every panel in the dashboard shows a vertical marker at that timestamp. Engineers can instantly see if a latency spike coincides with a deploy. The **four golden signals** (defined by Google SRE) provide a canonical dashboard structure for any service: **Latency** (how long requests take — track p50, p99, and separately track error latency vs. success latency), **Traffic** (how much demand is placed on the system — requests per second), **Errors** (the rate of failed requests — 5xx rate, or business-logic failures), and **Saturation** (how full/overloaded the service is — CPU %, thread pool queue depth, memory pressure). **Grafana Tempo** handles distributed tracing: you query it with TraceQL (`{resource.service.name=\"$job\" && duration > 500ms}`) to find slow traces directly from the Grafana UI without leaving the dashboard. **Grafana Loki** handles log aggregation: LogQL (`{service=\"$job\"} |= \"ERROR\" | json | level=\"ERROR\"`) filters and parses structured logs. The power of having all three in Grafana is **correlation**: Prometheus exemplars attach a `trace_id` to a histogram sample; when you click a latency spike in a Grafana dashboard, it opens the corresponding trace in Tempo; from that trace you click to the logs for that specific request in Loki. This metrics → traces → logs navigation happens in a single browser tab without switching tools. For infrastructure (nodes, pods), use **USE dashboards** (Utilization/Saturation/Errors per resource). For services (APIs, microservices), use **RED dashboards** (Rate/Errors/Duration per endpoint). Together these two templates cover every production observability need.",
    np: "**Dashboard as code** Grafana dashboard लाई JSON को रूपमा define गर्ने र automatically provision गर्ने practice हो — UI मा click गर्नुको र कसैले accidentally panel change गरिदिन्छ कि भनेर चिन्ता गर्नुको सट्टा। प्रत्येक Grafana dashboard, underlying मा, JSON document हो। तपाईंले `Dashboard → Share → Export → Save to file` मार्फत कुनै पनि dashboard export गर्न सक्नुहुन्छ, JSON लाई Git repository मा store गर्नुहोस्, अरू infrastructure change जस्तै peer-review गर्नुहोस्, र **provisioning** मार्फत Grafana startup मा auto-load गर्नुहोस्। Grafana provisioning ले तीनवटा config layer प्रयोग गर्छ: `grafana.ini` (global server setting), `/etc/grafana/provisioning/datasources/` मा datasource provisioning YAML (Prometheus, Loki, Tempo connection define गर्न), र `/etc/grafana/provisioning/dashboards/` मा dashboard provisioning YAML (JSON file scan गर्न कुन folder हो Grafana लाई बताउन)। `updateIntervalSeconds: 30` र `disableDeletion: false` सँग, Grafana ले every 30 second मा folder poll गर्छ र restart बिना changed dashboard hot-reload गर्छ — GitOps workflow enable गर्दै जहाँ merged PR ले 30 second भित्र automatically production dashboard update गर्छ। **Grafana annotation** label सहित vertical line को रूपमा time-series panel मा overlay गरिएको event marker हो। यो metric change लाई deploy सँग correlate गर्न ideal छ: deployment complete हुँदा, CI/CD pipeline ले Grafana को API मा annotation post गर्छ र dashboard को प्रत्येक panel ले त्यो timestamp मा vertical marker देखाउँछ। Engineer ले latency spike deploy सँग coincide हुन्छ कि हुँदैन instantly हेर्न सक्छन्। Google SRE ले define गरेका **four golden signal** ले कुनै पनि service को लागि canonical dashboard structure provide गर्छ: **Latency** (request कति समय लिन्छ — p50, p99 track गर्नुहोस्, र error latency vs. success latency छुट्टाछुट्टै track गर्नुहोस्), **Traffic** (system मा कति demand राखिएको छ — requests per second), **Errors** (failed request को rate — 5xx rate, वा business-logic failure), र **Saturation** (service कति full/overloaded छ — CPU %, thread pool queue depth, memory pressure)। **Grafana Tempo** ले distributed tracing handle गर्छ: तपाईंले TraceQL (`{resource.service.name=\"$job\" && duration > 500ms}`) सँग query गर्छ dashboard छाडेर Grafana UI बाटै slow trace directly find गर्न। **Grafana Loki** ले log aggregation handle गर्छ: LogQL (`{service=\"$job\"} |= \"ERROR\" | json | level=\"ERROR\"`) ले structured log filter र parse गर्छ। Grafana मा तिनैवटा राख्नुको power **correlation** हो: Prometheus exemplar ले histogram sample मा `trace_id` attach गर्छ; Grafana dashboard मा latency spike click गर्दा, Tempo मा corresponding trace open हुन्छ; त्यो trace बाट Loki मा त्यो specific request को log click गर्नुहुन्छ। यो metrics → traces → logs navigation tool switch नगरी single browser tab मा हुन्छ। Infrastructure (node, pod) को लागि **USE dashboard** (प्रत्येक resource को Utilization/Saturation/Errors) प्रयोग गर्नुहोस्। Service (API, microservice) को लागि **RED dashboard** (प्रत्येक endpoint को Rate/Errors/Duration) प्रयोग गर्नुहोस्। मिलेर यी दुईवटा template ले प्रत्येक production observability need cover गर्छन्।",
    jp: "**ダッシュボードのコード化**は、Grafana ダッシュボードを JSON として定義して自動的にプロビジョニングする実践です — UI をクリックして誰かが誤ってパネルを変更しないよう願う代わりに。すべての Grafana ダッシュボードは、内部的には JSON ドキュメントです。`Dashboard → Share → Export → Save to file` でダッシュボードをエクスポートし、JSON を Git リポジトリに保存し、他のインフラ変更と同様にピアレビューし、**プロビジョニング**を通じて Grafana 起動時に自動ロードできます。Grafana のプロビジョニングは 3 つの設定レイヤーを使用します：`grafana.ini`（グローバルサーバー設定）・`/etc/grafana/provisioning/datasources/` のデータソースプロビジョニング YAML（Prometheus・Loki・Tempo の接続を定義）・`/etc/grafana/provisioning/dashboards/` のダッシュボードプロビジョニング YAML（スキャンする JSON ファイルフォルダーを Grafana に指示）。`updateIntervalSeconds: 30` と `disableDeletion: false` で、Grafana は 30 秒ごとにフォルダーをポーリングし、再起動なしで変更されたダッシュボードをホットリロードします — マージされた PR が 30 秒以内に本番ダッシュボードを自動更新する GitOps ワークフローを実現します。**Grafana アノテーション**はラベル付きの縦線として時系列パネルにオーバーレイされるイベントマーカーです。デプロイとメトリクス変化を相関させるのに最適です：デプロイが完了すると CI/CD パイプラインが Grafana の API にアノテーションを投稿し、ダッシュボードのすべてのパネルがそのタイムスタンプに縦マーカーを表示します。エンジニアはレイテンシースパイクがデプロイと一致するかどうかを即座に確認できます。Google SRE が定義した**4 つのゴールデンシグナル**はあらゆるサービスの標準的なダッシュボード構造を提供します：**レイテンシー**（リクエストにかかる時間 — p50・p99 を追跡し、エラーレイテンシーと成功レイテンシーを別々に追跡）・**トラフィック**（システムへの需要量 — 1 秒あたりのリクエスト）・**エラー**（失敗したリクエストの率 — 5xx レート、またはビジネスロジックの失敗）・**飽和**（サービスがどれだけ満杯/過負荷か — CPU %・スレッドプールキュー深度・メモリ負荷）。**Grafana Tempo** は分散トレーシングを処理します：TraceQL（`{resource.service.name=\"$job\" && duration > 500ms}`）でクエリして Grafana UI からダッシュボードを離れずに直接遅いトレースを見つけます。**Grafana Loki** はログ集約を処理します：LogQL（`{service=\"$job\"} |= \"ERROR\" | json | level=\"ERROR\"`）が構造化ログをフィルタリング・解析します。Grafana に 3 つすべてを持つことの威力は**相関**です：Prometheus exemplar がヒストグラムサンプルに `trace_id` を添付します；Grafana ダッシュボードのレイテンシースパイクをクリックすると、Tempo の対応するトレースが開きます；そのトレースから Loki のその特定のリクエストのログをクリックします。このメトリクス → トレース → ログのナビゲーションはツールを切り替えることなく単一のブラウザタブで行われます。インフラ（ノード・ポッド）には**USE ダッシュボード**（リソースごとの Utilization/Saturation/Errors）を使用する。サービス（API・マイクロサービス）には**RED ダッシュボード**（エンドポイントごとの Rate/Errors/Duration）を使用する。合わせてこれら 2 つのテンプレートはすべての本番オブザーバビリティのニーズをカバーします。",
  } as const,
};

export const DEVOPS_DAY_90_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Panel types, data sources & variable templating",
        np: "Panel type, data source र variable templating",
        jp: "パネルタイプ・データソース・変数テンプレーティング",
      },
      blocks: [
        { type: "diagram", id: "devops-grafana-architecture" },
        {
          type: "table",
          caption: {
            en: "Grafana panel types — visualization category, best use case, key config, and example",
            np: "Grafana panel type — visualization category, best use case, key config, र example",
            jp: "Grafana パネルタイプ — 可視化カテゴリ・最適なユースケース・主要設定・例",
          },
          headers: [
            { en: "Panel type", np: "Panel type", jp: "パネルタイプ" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
            { en: "Key config", np: "Key config", jp: "主要設定" },
            { en: "Example use case", np: "Example use case", jp: "ユースケース例" },
          ],
          rows: [
            [
              { en: "Time series", np: "Time series", jp: "時系列" },
              {
                en: "Metric trends over time — lines, bars, or filled areas for counters and gauges",
                np: "समयसँगै metric trend — counter र gauge को लागि line, bar, वा filled area",
                jp: "時間をかけたメトリクスのトレンド — カウンターとゲージの折れ線・棒・塗りつぶしエリア",
              },
              {
                en: "Fill mode (none/below/between), line width, legend (min/max/current), stack series",
                np: "Fill mode (none/below/between), line width, legend (min/max/current), stack series",
                jp: "フィルモード（なし/下/間）・線幅・凡例（最小/最大/現在）・系列のスタック",
              },
              {
                en: "HTTP request rate (requests/sec) over last 24 hours, one line per endpoint",
                np: "पछिल्लो 24 घन्टामा HTTP request rate (requests/sec), प्रत्येक endpoint को एउटा line",
                jp: "過去 24 時間の HTTP リクエストレート（リクエスト/秒）、エンドポイントごとに 1 本の線",
              },
            ],
            [
              { en: "Stat", np: "Stat", jp: "Stat" },
              {
                en: "Current single value with colour-coded health at a glance — no trend needed",
                np: "एक नजरमा colour-coded health सहित current single value — trend आवश्यक छैन",
                jp: "一目でカラーコード化された健全性を持つ現在の単一値 — トレンドは不要",
              },
              {
                en: "Thresholds (green/yellow/red), colour mode (background/value), unit, decimals",
                np: "Threshold (green/yellow/red), colour mode (background/value), unit, decimal",
                jp: "閾値（緑/黄/赤）・カラーモード（背景/値）・単位・小数点",
              },
              {
                en: "Current active database connections — green below 80, yellow 80–150, red above 150",
                np: "Current active database connection — 80 भन्दा कम green, 80–150 yellow, 150 माथि red",
                jp: "現在のアクティブなデータベース接続 — 80 未満は緑、80〜150 は黄、150 超は赤",
              },
            ],
            [
              { en: "Gauge", np: "Gauge", jp: "ゲージ" },
              {
                en: "Current value as a position on a min–max arc — instantly communicates headroom",
                np: "min–max arc मा position को रूपमा current value — headroom instantly communicate गर्छ",
                jp: "min-max アークの位置としての現在の値 — 余裕を即座に伝える",
              },
              {
                en: "Min, max, threshold steps, orientation (horizontal/vertical/radial), unit",
                np: "Min, max, threshold step, orientation (horizontal/vertical/radial), unit",
                jp: "最小・最大・閾値ステップ・向き（水平/垂直/放射状）・単位",
              },
              {
                en: "CPU usage % with arc turning yellow at 70% and red at 85%",
                np: "CPU usage % 70% मा arc yellow र 85% मा red हुने",
                jp: "CPU 使用率 %（70% で黄色、85% で赤になるアーク）",
              },
            ],
            [
              { en: "Bar chart", np: "Bar chart", jp: "棒グラフ" },
              {
                en: "Comparing a metric across discrete categories at a single point in time",
                np: "Single point in time मा discrete category मा metric compare गर्न",
                jp: "単一時点での離散カテゴリ間のメトリクスの比較",
              },
              {
                en: "X-axis field (category), Y-axis (value), bar orientation, colour by field",
                np: "X-axis field (category), Y-axis (value), bar orientation, colour by field",
                jp: "X 軸フィールド（カテゴリ）・Y 軸（値）・棒の向き・フィールド別カラー",
              },
              {
                en: "Total requests per API endpoint in the last 1 hour — spot which route is busiest",
                np: "पछिल्लो 1 घन्टामा API endpoint अनुसार total request — कुन route सबैभन्दा busy छ spot गर्न",
                jp: "過去 1 時間の API エンドポイントごとの総リクエスト — 最も忙しいルートを特定",
              },
            ],
            [
              { en: "Table", np: "Table", jp: "テーブル" },
              {
                en: "Multi-column data where exact values matter and sorting/filtering is needed",
                np: "Exact value matter गर्ने र sorting/filtering आवश्यक multi-column data",
                jp: "正確な値が重要でソート/フィルタリングが必要なマルチカラムデータ",
              },
              {
                en: "Column filtering, column sorting, cell colour thresholds, pagination, value mapping",
                np: "Column filtering, column sorting, cell colour threshold, pagination, value mapping",
                jp: "列フィルタリング・列ソート・セルカラー閾値・ページネーション・値マッピング",
              },
              {
                en: "Top 10 slowest API endpoints — table with columns: endpoint, p99 latency, error rate, req/s",
                np: "Top 10 slowest API endpoint — column: endpoint, p99 latency, error rate, req/s सहित table",
                jp: "上位 10 の最も遅い API エンドポイント — カラム：エンドポイント・p99 レイテンシー・エラー率・リクエスト/秒",
              },
            ],
            [
              { en: "Heatmap", np: "Heatmap", jp: "ヒートマップ" },
              {
                en: "Distribution of values over time — shows where data is concentrated across buckets",
                np: "समयसँगै value को distribution — bucket मा data कहाँ concentrate छ देखाउँछ",
                jp: "時間をかけた値の分布 — バケット全体でデータがどこに集中しているかを示す",
              },
              {
                en: "Colour scheme (scheme/opacity), bucket size, X/Y axis (time/value), data format",
                np: "Colour scheme (scheme/opacity), bucket size, X/Y axis (time/value), data format",
                jp: "カラースキーム（スキーム/不透明度）・バケットサイズ・X/Y 軸（時間/値）・データ形式",
              },
              {
                en: "HTTP request latency distribution — dark colour shows where most requests cluster (e.g. 20–50ms bucket)",
                np: "HTTP request latency distribution — dark colour ले धेरैजसो request cluster हुने ठाउँ देखाउँछ (जस्तै 20–50ms bucket)",
                jp: "HTTP リクエストレイテンシー分布 — 濃い色がほとんどのリクエストがクラスタリングされる場所を示す（例：20〜50ms バケット）",
              },
            ],
            [
              { en: "Logs", np: "Logs", jp: "ログ" },
              {
                en: "Streaming log lines from Loki (LogQL) — structured or unstructured log display",
                np: "Loki (LogQL) बाट streaming log line — structured वा unstructured log display",
                jp: "Loki（LogQL）からのストリーミングログ行 — 構造化または非構造化ログ表示",
              },
              {
                en: "Log level colouring, deduplication, prettify JSON, show/hide time, wrap lines",
                np: "Log level colouring, deduplication, prettify JSON, show/hide time, wrap line",
                jp: "ログレベルのカラーリング・重複排除・JSON の整形・時間の表示/非表示・行の折り返し",
              },
              {
                en: "Loki query showing ERROR-level logs for a specific service during an incident window",
                np: "Incident window मा specific service को ERROR-level log देखाउने Loki query",
                jp: "インシデントウィンドウ中の特定サービスの ERROR レベルログを表示する Loki クエリ",
              },
            ],
            [
              { en: "Traces", np: "Traces", jp: "トレース" },
              {
                en: "Distributed trace visualization — span waterfall showing call tree and durations",
                np: "Distributed trace visualization — call tree र duration देखाउने span waterfall",
                jp: "分散トレース可視化 — コールツリーと所要時間を示すスパンウォーターフォール",
              },
              {
                en: "Tempo data source, TraceQL query, span search by attribute, service graph view",
                np: "Tempo data source, TraceQL query, attribute द्वारा span search, service graph view",
                jp: "Tempo データソース・TraceQL クエリ・属性によるスパン検索・サービスグラフビュー",
              },
              {
                en: "Grafana Tempo trace exploration — find all traces for payment-api where duration > 500ms",
                np: "Grafana Tempo trace exploration — payment-api को लागि duration > 500ms भएका सबै trace find गर्न",
                jp: "Grafana Tempo トレース探索 — duration > 500ms の payment-api のすべてのトレースを検索",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Dashboard provisioning, PromQL panels & annotations",
        np: "Dashboard provisioning, PromQL panel र annotation",
        jp: "ダッシュボードプロビジョニング・PromQL パネル・アノテーション",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Grafana provisioning YAML, dashboard JSON snippet, LogQL, TraceQL & folder structure",
            np: "Grafana provisioning YAML, dashboard JSON snippet, LogQL, TraceQL र folder structure",
            jp: "Grafana プロビジョニング YAML・ダッシュボード JSON スニペット・LogQL・TraceQL・フォルダー構造",
          },
          code: `# ── grafana/provisioning/datasources/prometheus.yml ──────────────────
# Automatically provisions Prometheus as a data source on Grafana startup.
# Mount this directory: -v $(pwd)/grafana/provisioning:/etc/grafana/provisioning

apiVersion: 1

datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090   # Docker service name; use localhost:9090 for local
    isDefault: true
    jsonData:
      timeInterval: "15s"         # match your Prometheus scrape_interval
      httpMethod: POST
      exemplarTraceIdDestinations:  # link exemplars → Tempo traces
        - name: trace_id
          datasourceUid: tempo      # must match the Tempo data source uid below

  - name: Loki
    type: loki
    access: proxy
    url: http://loki:3100
    jsonData:
      derivedFields:              # extract trace_id from logs → link to Tempo
        - matcherRegex: '"trace_id":"([^"]+)"'
          name: TraceID
          url: '\${__value.raw}'
          datasourceUid: tempo

  - name: Tempo
    uid: tempo
    type: tempo
    access: proxy
    url: http://tempo:3200
    jsonData:
      tracesToLogsV2:             # link Tempo spans → Loki logs
        datasourceUid: loki
        filterByTraceID: true
        filterBySpanID: false

# ── grafana/provisioning/dashboards/default.yml ───────────────────────
# Tell Grafana where to find dashboard JSON files.

apiVersion: 1

providers:
  - name: "default"
    type: file
    disableDeletion: false        # allow deleting dashboards by removing JSON file
    updateIntervalSeconds: 30     # poll every 30 seconds for changes (GitOps friendly)
    allowUiUpdates: false         # prevent UI edits diverging from Git source of truth
    options:
      path: /var/lib/grafana/dashboards   # mount your dashboards/ dir here
      foldersFromFilesStructure: true     # subdirectory names become Grafana folder names

# ── grafana/dashboards/my-service-red.json (snippet) ─────────────────
# A minimal dashboard JSON showing: a time series panel with PromQL,
# template variable definitions, and an annotation query.
#
# {
#   "title": "My Service — RED Dashboard",
#   "uid":   "my-service-red",
#   "schemaVersion": 39,
#   "refresh": "30s",
#
#   "templating": {
#     "list": [
#       {
#         "name":       "job",
#         "type":       "query",
#         "label":      "Service",
#         "datasource": { "type": "prometheus", "uid": "\${DS_PROMETHEUS}" },
#         "definition": "label_values(up, job)",    // populates dropdown from Prometheus
#         "query":      { "query": "label_values(up, job)", "refId": "A" },
#         "refresh":    2,                           // refresh on time range change
#         "sort":       1                            // alphabetical
#       },
#       {
#         "name":       "instance",
#         "type":       "query",
#         "label":      "Instance",
#         "datasource": { "type": "prometheus", "uid": "\${DS_PROMETHEUS}" },
#         "definition": "label_values(up{job=\"$job\"}, instance)",
#         "query":      { "query": "label_values(up{job=\"$job\"}, instance)", "refId": "B" },
#         "multi":      true,                        // allow selecting multiple instances
#         "includeAll": true,                        // adds "All" option
#         "refresh":    2
#       }
#     ]
#   },
#
#   "annotations": {
#     "list": [
#       {
#         "name":       "Deployments",
#         "datasource": { "type": "prometheus", "uid": "\${DS_PROMETHEUS}" },
#         "enable":     true,
#         "expr":       "changes(kube_deployment_status_observed_generation{deployment=\"$job\"}[2m]) > 0",
#         "step":       "60s",
#         "titleFormat": "Deploy: $job",
#         "iconColor":  "blue"
#       }
#     ]
#   },
#
#   "panels": [
#     {
#       "type":  "timeseries",
#       "title": "Request Rate",
#       "gridPos": { "x": 0, "y": 0, "w": 12, "h": 8 },
#       "targets": [
#         {
#           "datasource": { "type": "prometheus" },
#           "expr": "sum by (endpoint) (rate(http_requests_total{job=\"$job\",instance=~\"$instance\"}[5m]))",
#           "legendFormat": "{{ endpoint }}"
#         }
#       ],
#       "fieldConfig": {
#         "defaults": {
#           "unit": "reqps",
#           "custom": { "fillOpacity": 10, "lineWidth": 2 }
#         }
#       }
#     }
#   ]
# }

# ── LogQL example — Grafana Loki ──────────────────────────────────────
# Filter logs for the selected $job service, show only ERROR-level JSON logs.
# Use this in a Logs panel or a stat panel (count of errors).

{service="$job"} |= "ERROR" | json | level="ERROR"

# Extended: parse latency field and filter slow requests logged as errors:
{service="$job"} | json | level="ERROR" | duration > 1s

# Count errors per minute (use in Time series panel with instant query):
sum(count_over_time({service="$job"} | json | level="ERROR" [1m]))

# ── TraceQL example — Grafana Tempo ───────────────────────────────────
# Find all traces for the selected service where the root span took > 500ms.
# Use in Traces panel or Tempo Explorer tab.

{ resource.service.name = "$job" && duration > 500ms }

# Filter by HTTP status code attribute (set by OpenTelemetry instrumentation):
{ resource.service.name = "$job" && span.http.status_code >= 500 }

# Find traces that hit a specific downstream service:
{ resource.service.name = "$job" } >> { resource.service.name = "payment-api" }

# ── Dashboard folder structure ─────────────────────────────────────────
# Organize dashboards by team or service area.
# With foldersFromFilesStructure: true, subdirectory name = Grafana folder name.
#
# grafana/
# ├── provisioning/
# │   ├── datasources/
# │   │   └── prometheus.yml        # auto-provision Prometheus, Loki, Tempo
# │   └── dashboards/
# │       └── default.yml           # scan /var/lib/grafana/dashboards/
# └── dashboards/
#     ├── platform/                 # → Grafana folder "platform"
#     │   ├── nodes-use.json        # Node USE dashboard
#     │   └── kubernetes-pods.json  # K8s pods overview
#     ├── backend/                  # → Grafana folder "backend"
#     │   ├── api-service-red.json  # API service RED dashboard
#     │   └── payment-api-red.json  # Payment service RED dashboard
#     └── business/                 # → Grafana folder "business"
#         └── revenue-metrics.json  # Business KPI dashboard`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Build a complete RED method dashboard for a test service in Grafana. Run Grafana locally (`docker run -p 3000:3000 grafana/grafana`). Add Prometheus as a data source (Settings → Data Sources → Add data source → Prometheus → URL: `http://host.docker.internal:9090`). Create a new dashboard with 4 panels: (a) Request rate time series: `sum(rate(http_requests_total{job=\"my-service\"}[5m])) by (endpoint)` — use \"Fill below to\" to make it a stacked area chart, set legend to show current/min/max; (b) Error rate stat panel: `sum(rate(http_errors_total{job=\"my-service\"}[5m])) / sum(rate(http_requests_total{job=\"my-service\"}[5m])) * 100` with thresholds at 1% (yellow) and 5% (red); (c) p99 latency time series: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job=\"my-service\"}[5m])) by (le, endpoint))`; (d) Active instances stat: `count(up{job=\"my-service\"} == 1)`. Save the dashboard and export its JSON (`Dashboard → Share → Export → Save to file`) — store it in `dashboards/my-service-red.json`. This dashboard JSON is now your infrastructure-as-code artifact; every future change should be made to the JSON file and peer-reviewed via a pull request.",
              np: "Grafana मा test service को लागि complete RED method dashboard build गर्नुहोस्। Grafana locally run गर्नुहोस् (`docker run -p 3000:3000 grafana/grafana`)। Prometheus data source add गर्नुहोस् (Settings → Data Sources → Add data source → Prometheus → URL: `http://host.docker.internal:9090`)। 4 panel सहित नयाँ dashboard create गर्नुहोस्: (क) Request rate time series: `sum(rate(http_requests_total{job=\"my-service\"}[5m])) by (endpoint)` — stacked area chart बनाउन \"Fill below to\" प्रयोग गर्नुहोस्, current/min/max देखाउन legend set गर्नुहोस्; (ख) Error rate stat panel: `sum(rate(http_errors_total{job=\"my-service\"}[5m])) / sum(rate(http_requests_total{job=\"my-service\"}[5m])) * 100` 1% मा threshold (yellow) र 5% मा (red) सहित; (ग) p99 latency time series: `histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job=\"my-service\"}[5m])) by (le, endpoint))`; (घ) Active instances stat: `count(up{job=\"my-service\"} == 1)`। Dashboard save गर्नुहोस् र यसको JSON export गर्नुहोस् (`Dashboard → Share → Export → Save to file`) — `dashboards/my-service-red.json` मा store गर्नुहोस्। यो dashboard JSON अब तपाईंको infrastructure-as-code artifact हो; भविष्यका सबै परिवर्तन JSON file मा गर्नुपर्छ र pull request मार्फत peer-review हुनुपर्छ।",
              jp: "Grafana でテストサービスの完全な RED メソッドダッシュボードを構築する。Grafana をローカルで実行する（`docker run -p 3000:3000 grafana/grafana`）。Prometheus をデータソースとして追加する（Settings → Data Sources → Add data source → Prometheus → URL: `http://host.docker.internal:9090`）。4 つのパネルで新しいダッシュボードを作成する：(a) リクエストレートの時系列：`sum(rate(http_requests_total{job=\"my-service\"}[5m])) by (endpoint)` — 「Fill below to」を使ってスタックエリアチャートにし、凡例を current/min/max 表示に設定；(b) エラーレートの Stat パネル：`sum(rate(http_errors_total{job=\"my-service\"}[5m])) / sum(rate(http_requests_total{job=\"my-service\"}[5m])) * 100`（1% で黄・5% で赤の閾値）；(c) p99 レイテンシーの時系列：`histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket{job=\"my-service\"}[5m])) by (le, endpoint))`；(d) アクティブインスタンスの Stat：`count(up{job=\"my-service\"} == 1)`。ダッシュボードを保存して JSON をエクスポートし（`Dashboard → Share → Export → Save to file`）、`dashboards/my-service-red.json` に保存する。この JSON はインフラのコードアーティファクトです；将来のすべての変更は JSON ファイルに行い、プルリクエストでピアレビューされる必要があります。",
            },
            {
              en: "Add dashboard variables to make your RED dashboard reusable across environments. Add two template variables: `$env` (type: Custom, values: `production,staging,development`) and `$job` (type: Query, query: `label_values(up{env=\"$env\"}, job)`, refresh: On time range change). Update all panel queries to include `{env=\"$env\", job=\"$job\"}` label selectors. Observe how selecting a different `$env` value in the dropdown automatically re-queries all panels with the new label. Add a third variable `$instance` (type: Query, query: `label_values(up{env=\"$env\", job=\"$job\"}, instance)`, multi-value: true, include all option: true) so operators can drill down to individual instances. Add a \"repeat row\" for `$instance` so that each selected instance gets its own row of panels — in the Row options, set \"Repeat for\" to `$instance` and \"Repeat direction\" to Horizontal. This pattern — start broad (env → job) and let operators drill down (job → instance) — is the foundation of production dashboard design. With these three variables, a single dashboard JSON file serves every service in every environment, eliminating dozens of near-identical static dashboards.",
              np: "RED dashboard लाई environment मा reusable बनाउन dashboard variable add गर्नुहोस्। दुईवटा template variable add गर्नुहोस्: `$env` (type: Custom, values: `production,staging,development`) र `$job` (type: Query, query: `label_values(up{env=\"$env\"}, job)`, refresh: On time range change)। सबै panel query मा `{env=\"$env\", job=\"$job\"}` label selector include गर्न update गर्नुहोस्। Dropdown मा different `$env` value select गर्दा automatically सबै panel नयाँ label सहित re-query हुन्छ observe गर्नुहोस्। तेस्रो variable `$instance` add गर्नुहोस् (type: Query, query: `label_values(up{env=\"$env\", job=\"$job\"}, instance)`, multi-value: true, include all option: true) ताकि operator individual instance मा drill down गर्न सकून्। प्रत्येक selected instance लाई आफ्नै panel row पाउन \"repeat row\" add गर्नुहोस् — Row option मा, \"Repeat for\" लाई `$instance` र \"Repeat direction\" लाई Horizontal set गर्नुहोस्। यो pattern — broad सुरु गर्नुहोस् (env → job) र operator लाई drill down गर्न दिनुहोस् (job → instance) — production dashboard design को foundation हो। यी तीन variable सँग, single dashboard JSON file ले हरेक environment मा हरेक service serve गर्छ, धेरैवटा near-identical static dashboard eliminate गर्दै।",
              jp: "RED ダッシュボードを環境間で再利用可能にするためにダッシュボード変数を追加する。2 つのテンプレート変数を追加する：`$env`（タイプ：カスタム、値：`production,staging,development`）と `$job`（タイプ：クエリ、クエリ：`label_values(up{env=\"$env\"}, job)`、更新：時間範囲変更時）。すべてのパネルクエリを `{env=\"$env\", job=\"$job\"}` ラベルセレクターを含むように更新する。ドロップダウンで異なる `$env` 値を選択すると、すべてのパネルが新しいラベルで自動的に再クエリされることを観察する。3 番目の変数 `$instance`（タイプ：クエリ、クエリ：`label_values(up{env=\"$env\", job=\"$job\"}, instance)`、複数値：true、すべてを含むオプション：true）を追加して、オペレーターが個々のインスタンスにドリルダウンできるようにする。各選択されたインスタンスが自身のパネル行を持つように「repeat row」を追加する — 行オプションで「Repeat for」を `$instance`、「Repeat direction」を Horizontal に設定する。このパターン — 広く始めて（env → job）オペレーターがドリルダウンできるようにする（job → instance）— は本番ダッシュボード設計の基盤です。これら 3 つの変数で、単一のダッシュボード JSON ファイルがすべての環境のすべてのサービスを提供し、何十もの似たような静的ダッシュボードを排除します。",
            },
            {
              en: "Set up dashboard provisioning so your Grafana instance automatically loads dashboards from a directory on startup. Create the following directory structure: `grafana/provisioning/datasources/prometheus.yml`, `grafana/provisioning/dashboards/default.yml`, and `grafana/dashboards/my-service-red.json`. Write `prometheus.yml` to define Prometheus at `http://host.docker.internal:9090` as the default data source. Write `default.yml` to scan the `grafana/dashboards/` folder with `updateIntervalSeconds: 30`, `disableDeletion: false`, and `allowUiUpdates: false`. Mount these directories into the Grafana Docker container: `docker run -v $(pwd)/grafana/provisioning:/etc/grafana/provisioning -v $(pwd)/grafana/dashboards:/var/lib/grafana/dashboards -p 3000:3000 grafana/grafana`. Start Grafana and navigate to Dashboards — verify your dashboard loads automatically without any manual import. Now open `my-service-red.json` in a text editor, add a new panel (copy an existing panel JSON block and change the title and PromQL expression), save the file, and wait up to 30 seconds — the dashboard updates in the Grafana UI without restarting the container or clicking Import. This is dashboard-as-code in practice: dashboards live in a Git repository, changes are reviewed via pull requests, and the update propagates automatically. Commit the full `grafana/` directory to your repository and add it to your CI pipeline.",
              np: "Dashboard provisioning set up गर्नुहोस् ताकि Grafana instance ले startup मा directory बाट automatically dashboard load गरोस्। निम्न directory structure create गर्नुहोस्: `grafana/provisioning/datasources/prometheus.yml`, `grafana/provisioning/dashboards/default.yml`, र `grafana/dashboards/my-service-red.json`। Default data source को रूपमा `http://host.docker.internal:9090` मा Prometheus define गर्न `prometheus.yml` लेख्नुहोस्। `updateIntervalSeconds: 30`, `disableDeletion: false`, र `allowUiUpdates: false` सहित `grafana/dashboards/` folder scan गर्न `default.yml` लेख्नुहोस्। यी directory Grafana Docker container मा mount गर्नुहोस्: `docker run -v $(pwd)/grafana/provisioning:/etc/grafana/provisioning -v $(pwd)/grafana/dashboards:/var/lib/grafana/dashboards -p 3000:3000 grafana/grafana`। Grafana start गर्नुहोस् र Dashboards navigate गर्नुहोस् — dashboard कुनै manual import बिना automatically load हुन्छ verify गर्नुहोस्। अब text editor मा `my-service-red.json` open गर्नुहोस्, नयाँ panel add गर्नुहोस् (existing panel JSON block copy गर्नुहोस् र title र PromQL expression change गर्नुहोस्), file save गर्नुहोस्, र 30 second सम्म wait गर्नुहोस् — container restart वा Import click नगरी Grafana UI मा dashboard update हुन्छ। यो dashboard-as-code practice मा हो: dashboard Git repository मा live गर्छ, change pull request मार्फत review हुन्छ, र update automatically propagate हुन्छ। पूरै `grafana/` directory आफ्नो repository मा commit गर्नुहोस् र CI pipeline मा add गर्नुहोस्।",
              jp: "ダッシュボードプロビジョニングを設定して、Grafana インスタンスが起動時にディレクトリからダッシュボードを自動的にロードするようにする。以下のディレクトリ構造を作成する：`grafana/provisioning/datasources/prometheus.yml`・`grafana/provisioning/dashboards/default.yml`・`grafana/dashboards/my-service-red.json`。`prometheus.yml` を書いて `http://host.docker.internal:9090` の Prometheus をデフォルトデータソースとして定義する。`default.yml` を書いて `updateIntervalSeconds: 30`・`disableDeletion: false`・`allowUiUpdates: false` で `grafana/dashboards/` フォルダーをスキャンする。これらのディレクトリを Grafana Docker コンテナにマウントする：`docker run -v $(pwd)/grafana/provisioning:/etc/grafana/provisioning -v $(pwd)/grafana/dashboards:/var/lib/grafana/dashboards -p 3000:3000 grafana/grafana`。Grafana を起動してダッシュボードに移動する — ダッシュボードが手動インポートなしに自動的にロードされることを確認する。次にテキストエディタで `my-service-red.json` を開き、新しいパネルを追加し（既存のパネル JSON ブロックをコピーしてタイトルと PromQL 式を変更）、ファイルを保存し、最大 30 秒待つ — コンテナを再起動したりインポートをクリックしたりせずに Grafana UI でダッシュボードが更新される。これが実践でのダッシュボードのコード化です：ダッシュボードは Git リポジトリに存在し、変更はプルリクエストでレビューされ、更新は自動的に伝播します。`grafana/` ディレクトリ全体をリポジトリにコミットし、CI パイプラインに追加する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Grafana alerting and Prometheus alerting, and which should you use?",
        np: "Grafana alerting र Prometheus alerting बीचको फरक के हो, र कुन प्रयोग गर्नुपर्छ?",
        jp: "Grafana アラートと Prometheus アラートの違いは何か、どちらを使うべきか？",
      },
      answer: {
        en: "Both systems can alert on Prometheus metrics, but they operate differently and serve different roles in a mature observability stack. **Prometheus alerting (Prometheus alert rules + Alertmanager)**: alerting rules are evaluated by the Prometheus server itself on every evaluation interval (typically 15–30 seconds). Rules are defined in YAML files (`rules/alerts.yml`) stored in version control alongside your infrastructure code. Alertmanager handles deduplication, grouping, silencing, inhibition, and routing notifications to Slack, PagerDuty, OpsGenie, email, or any webhook. This system is **decoupled from Grafana**: it works even if Grafana is down, it has been battle-tested at enormous scale (Google, GitLab, Cloudflare), and every alert and routing rule is a reviewable YAML diff. Configuration drift is impossible — your `helm upgrade` or `kubectl apply` changes the rules atomically. **Grafana alerting (Alert Rules in the Grafana UI)**: Grafana's own alerting engine evaluates queries on a schedule using its unified alerting system. The compelling advantage is **multi-source alerts**: a single alert rule can combine a Prometheus metric with a Loki log count or a Tempo trace latency — impossible in pure Prometheus. Grafana alerting also supports alert rules defined in dashboards, meaning the same PromQL expression powering a panel can be promoted to an alert with one click, and the alert state is visible directly in the dashboard panel. Contact points and notification policies are configured in the Grafana UI (or via provisioning YAML). The disadvantage: Grafana alerting depends on Grafana being healthy. If your Grafana instance crashes during an incident, the alerting system goes silent at the exact moment you need it most. Grafana also historically had more evaluation lag and less granular control over grouping/inhibition compared to Alertmanager. **Production recommendation**: use Prometheus + Alertmanager as the primary alerting system for all infrastructure SLO alerts, availability alerts, and latency breach alerts — anything critical enough to page an on-call engineer. These alerts must fire even when Grafana is down. Use Grafana alerting for non-critical business-logic alerts that need to correlate metrics with logs (e.g. \"error rate is elevated AND we're seeing Java OOM exceptions in Loki\"), for team-specific alerts that are managed in dashboards by developers rather than platform engineers, and for convenience alerts that are acceptable to miss occasionally. Never rely solely on Grafana alerting for critical production incidents — the dependency on Grafana uptime is a single point of failure. A best-practice hybrid: Prometheus handles SLO/infrastructure paging; Grafana alerting handles developer-facing soft alerts. Run both systems with the same contact points (Slack channels, PagerDuty services) so alerts from both appear in the same place.",
        np: "दुवै system Prometheus metric मा alert गर्न सक्छन्, तर तिनीहरू differently operate गर्छन् र mature observability stack मा different role serve गर्छन्। **Prometheus alerting (Prometheus alert rule + Alertmanager)**: alerting rule लाई Prometheus server ले नै प्रत्येक evaluation interval (सामान्यतया 15–30 second) मा evaluate गर्छ। Rule YAML file (`rules/alerts.yml`) मा define हुन्छन् जुन version control मा infrastructure code सँगै store हुन्छन्। Alertmanager ले deduplication, grouping, silencing, inhibition, र Slack, PagerDuty, OpsGenie, email, वा कुनै webhook मा notification routing handle गर्छ। यो system **Grafana बाट decoupled** छ: Grafana down भए पनि काम गर्छ, यो enormous scale मा battle-tested छ (Google, GitLab, Cloudflare), र प्रत्येक alert र routing rule reviewable YAML diff हो। Configuration drift impossible छ — तपाईंको `helm upgrade` वा `kubectl apply` ले rule atomically change गर्छ। **Grafana alerting (Grafana UI मा Alert Rule)**: Grafana को आफ्नै alerting engine ले unified alerting system प्रयोग गरेर schedule मा query evaluate गर्छ। Compelling advantage **multi-source alert** हो: single alert rule ले Prometheus metric लाई Loki log count वा Tempo trace latency सँग combine गर्न सक्छ — pure Prometheus मा impossible। Grafana alerting ले dashboard मा define गरिएका alert rule पनि support गर्छ, अर्थात् panel power गर्ने same PromQL expression लाई one click मा alert मा promote गर्न सकिन्छ, र alert state dashboard panel मा directly visible छ। **Production recommendation**: सबै infrastructure SLO alert, availability alert, र latency breach alert को लागि primary alerting system को रूपमा Prometheus + Alertmanager प्रयोग गर्नुहोस् — on-call engineer page गर्न पुग्ने critical कुरा। Grafana down भए पनि यी alert fire हुनुपर्छ। Business-logic alert को लागि Grafana alerting प्रयोग गर्नुहोस् जसलाई metric लाई log सँग correlate गर्न आवश्यक छ, developer-specific alert जुन developer ले dashboard मा manage गर्छन्, र occasionally miss गर्न acceptable soft alert को लागि। Critical production incident को लागि solely Grafana alerting मा rely नगर्नुहोस् — Grafana uptime मा dependency single point of failure हो।",
        jp: "両システムとも Prometheus メトリクスにアラートできますが、異なる方法で動作し、成熟したオブザーバビリティスタックで異なる役割を果たします。**Prometheus アラート（Prometheus アラートルール + Alertmanager）**：アラートルールは Prometheus サーバー自体が各評価間隔（通常 15〜30 秒）で評価します。ルールはインフラコードと並んでバージョン管理に保存された YAML ファイル（`rules/alerts.yml`）で定義されます。Alertmanager は重複排除・グループ化・サイレンシング・抑制・Slack/PagerDuty/OpsGenie/メール/Webhook への通知ルーティングを処理します。このシステムは**Grafana から切り離されています**：Grafana がダウンしても動作し、大規模でバトルテスト済みで（Google・GitLab・Cloudflare）、すべてのアラートとルーティングルールはレビュー可能な YAML diff です。設定のドリフトは不可能です — `helm upgrade` や `kubectl apply` がルールを原子的に変更します。**Grafana アラート（Grafana UI のアラートルール）**：Grafana 独自のアラートエンジンが統合アラートシステムを使ってスケジュールでクエリを評価します。魅力的な利点は**マルチソースアラート**です：単一のアラートルールが Prometheus メトリクスと Loki ログカウントや Tempo トレースレイテンシーを組み合わせられます — 純粋な Prometheus では不可能。Grafana アラートはダッシュボードで定義されたアラートルールもサポートし、パネルを駆動する同じ PromQL 式をワンクリックでアラートに昇格でき、アラート状態がダッシュボードパネルに直接表示されます。**本番での推奨**：すべてのインフラ SLO アラート・可用性アラート・レイテンシー違反アラートのプライマリアラートシステムとして Prometheus + Alertmanager を使用する — オンコールエンジニアにページするほど重要なもの。これらのアラートは Grafana がダウンしても発火する必要があります。メトリクスとログを相関させる必要があるビジネスロジックアラート（例：「エラー率が高く Loki で Java OOM 例外が見られる」）、開発者がダッシュボードで管理するチーム固有のアラート、そして時々見逃しても許容できるソフトアラートに Grafana アラートを使用する。クリティカルな本番インシデントに Grafana アラートだけに依存しないでください — Grafana のアップタイムへの依存は単一障害点です。ベストプラクティスのハイブリッド：Prometheus が SLO/インフラのページングを処理し、Grafana アラートが開発者向けのソフトアラートを処理する。",
      },
      tag: {
        en: "Grafana vs Prometheus alerting",
        np: "Grafana vs Prometheus alerting",
        jp: "Grafana 対 Prometheus アラート",
      },
    },
    {
      question: {
        en: "How do Grafana exemplars work and how do they connect metrics to traces?",
        np: "Grafana exemplar कसरी काम गर्छ र metrics लाई traces सँग कसरी connect गर्छ?",
        jp: "Grafana の exemplar はどのように機能し、メトリクスとトレースをどのように接続するか？",
      },
      answer: {
        en: "Exemplars are one of the most powerful yet least-understood features in the Prometheus/Grafana ecosystem. They bridge the gap between the aggregated world of metrics and the per-request world of traces without requiring a separate indexing system. **What an exemplar is**: an exemplar is a specific sample data point attached to a metric observation that carries additional key-value metadata — most importantly, a `trace_id` and optionally a `span_id`. When your application records a histogram observation (e.g. \"this HTTP request took 450ms\"), the Prometheus client library can simultaneously record the `trace_id` of the OpenTelemetry span associated with that exact request as an exemplar on the same observation. Prometheus stores exemplars in a separate in-memory ring buffer alongside regular time-series samples (it does not persist them across restarts by default — they are ephemeral). **How Grafana visualizes them**: when you view a Time series or Heatmap panel backed by a histogram metric and exemplars are enabled on the Prometheus data source, Grafana queries Prometheus for both the aggregated time series and the exemplars via `/api/v1/query_exemplars`. Grafana renders exemplars as small diamond markers (`◇`) directly on the chart, positioned at the timestamp and value of the exemplar sample — for example, a diamond at time 14:32:15 at Y=450ms meaning \"this specific request took 450ms and had trace_id=abc123\". **The metrics-to-traces jump**: clicking a diamond marker in Grafana opens a drawer or navigates to Grafana Tempo, automatically pre-populated with the `trace_id` from the exemplar. The engineer goes from \"I can see p99 latency spiked at 14:32\" to \"here is the exact trace of one of the slow requests that caused the spike\" — without manually copying a trace_id or leaving the dashboard. This is the metrics-to-traces correlation. **The traces-to-logs jump**: from the Tempo trace view, Grafana uses derived fields configured in the Loki data source to extract the same `trace_id` from Loki log lines and present a clickable link to the corresponding logs. The complete navigation chain: Grafana dashboard (metric spike) → click exemplar diamond → Tempo trace (span waterfall) → click trace_id in log link → Loki logs (exact log lines for that request). **Setup requirements** for exemplars to work end-to-end: (1) your application must expose exemplars — in Python with `prometheus_client`, use `Counter.inc(exemplar={\"trace_id\": current_trace_id})` or the `Histogram.observe(duration, exemplar={\"trace_id\": current_trace_id})` overload; in Go, use `prometheus.MustRegister` with `prometheus.CounterOpts` and the `prometheus/client_golang` exemplar methods; (2) Prometheus must be started with `--enable-feature=exemplar-storage` (disabled by default); (3) the Grafana Prometheus data source must have \"Exemplars\" enabled in the data source settings (toggle in the datasource UI or set `exemplarTraceIdDestinations` in the provisioning YAML); (4) a Grafana Tempo data source must exist with its UID referenced in the exemplar destination config so Grafana knows which backend to open when a diamond is clicked. Exemplars are most valuable for latency histograms on high-traffic services: at 10,000 requests/second, you cannot store individual traces for every request, but you can store the trace_id of the one request that happened to be slowest in each 15-second scrape interval — giving you a direct link to a real example of the worst-case latency you are trying to diagnose.",
        np: "Exemplar Prometheus/Grafana ecosystem मा सबैभन्दा powerful तर कम बुझिएको feature मध्ये एक हो। तिनीहरूले separate indexing system बिना metric को aggregated world र trace को per-request world बीचको gap bridge गर्छन्। **Exemplar के हो**: exemplar एउटा specific sample data point हो जुन metric observation मा attach हुन्छ र additional key-value metadata carry गर्छ — सबैभन्दा महत्त्वपूर्ण, `trace_id` र optional `span_id`। Application ले histogram observation record गर्दा (जस्तै \"यो HTTP request 450ms लाग्यो\"), Prometheus client library ले simultaneously त्यो exact request सँग associated OpenTelemetry span को `trace_id` same observation मा exemplar को रूपमा record गर्न सक्छ। Prometheus ले exemplar लाई regular time-series sample सँगसँगै छुट्टाछुट्टै in-memory ring buffer मा store गर्छ (default मा restart मा persist गर्दैन — ephemeral हुन्छ)। **Grafana ले कसरी visualize गर्छ**: Prometheus data source मा exemplar enable भएको histogram metric backed Time series वा Heatmap panel हेर्दा, Grafana ले `/api/v1/query_exemplars` मार्फत aggregated time series र exemplar दुवैको लागि Prometheus query गर्छ। Grafana ले chart मा directly small diamond marker (`◇`) को रूपमा exemplar render गर्छ, exemplar sample को timestamp र value मा position गर्दै — उदाहरण: time 14:32:15 मा Y=450ms मा diamond अर्थात् \"यो specific request 450ms लाग्यो र trace_id=abc123 थियो\"। **Metrics-to-traces jump**: Grafana मा diamond marker click गर्दा drawer open हुन्छ वा Grafana Tempo मा navigate हुन्छ, automatically exemplar बाट `trace_id` सँग pre-populate हुन्छ। Engineer \"14:32 मा p99 latency spike भयो हेर्न सक्छु\" बाट \"spike गराउने एउटा slow request को exact trace यहाँ छ\" — manually trace_id copy नगरी वा dashboard नछाडी। यो metrics-to-traces correlation हो। **Traces-to-logs jump**: Tempo trace view बाट, Grafana ले Loki data source मा configure गरिएको derived field प्रयोग गरेर Loki log line बाट same `trace_id` extract गर्छ र corresponding log मा clickable link present गर्छ। **Setup requirement**: (१) application ले exemplar expose गर्नुपर्छ — Python मा `prometheus_client` सँग, `Counter.inc(exemplar={\"trace_id\": current_trace_id})` वा `Histogram.observe(duration, exemplar={\"trace_id\": current_trace_id})` प्रयोग गर्नुहोस्; (२) Prometheus `--enable-feature=exemplar-storage` सँग start हुनुपर्छ; (३) Grafana Prometheus data source मा \"Exemplars\" enable हुनुपर्छ; (४) exemplar destination config मा UID reference सहित Grafana Tempo data source exist हुनुपर्छ।",
        jp: "Exemplar は Prometheus/Grafana エコシステムで最も強力でありながら最も理解されていない機能の 1 つです。別のインデックスシステムを必要とせずに、メトリクスの集約された世界とトレースのリクエストごとの世界の間のギャップを橋渡しします。**exemplar とは**：exemplar はメトリクス観測に添付された特定のサンプルデータポイントで、追加のキーバリューメタデータを運びます — 最も重要なのは `trace_id` とオプションの `span_id`。アプリケーションがヒストグラム観測を記録する際（例：「この HTTP リクエストは 450ms かかった」）、Prometheus クライアントライブラリはその正確なリクエストに関連する OpenTelemetry スパンの `trace_id` を同じ観測の exemplar として同時に記録できます。Prometheus は exemplar を通常の時系列サンプルと並んで別個のインメモリリングバッファに保存します（デフォルトでは再起動をまたいで永続化しません — 一時的なものです）。**Grafana による可視化**：Prometheus データソースで exemplar が有効になっているヒストグラムメトリクスに基づいた時系列またはヒートマップパネルを表示する際、Grafana は `/api/v1/query_exemplars` を通じて集約された時系列と exemplar の両方を Prometheus にクエリします。Grafana は exemplar を小さなダイヤモンドマーカー（`◇`）としてチャートに直接レンダリングし、exemplar サンプルのタイムスタンプと値に配置します。**メトリクスからトレースへのジャンプ**：Grafana でダイヤモンドマーカーをクリックすると、exemplar の `trace_id` で自動的にプリポピュレートされた Grafana Tempo にナビゲートします。エンジニアは「14:32 に p99 レイテンシーのスパイクが見える」から「スパイクを引き起こした遅いリクエストの 1 つの正確なトレースがここにある」へ — trace_id を手動でコピーしたりダッシュボードを離れたりせずに。これがメトリクスからトレースへの相関です。**トレースからログへのジャンプ**：Tempo トレースビューから、Grafana は Loki データソースで設定された派生フィールドを使用して Loki ログ行から同じ `trace_id` を抽出し、対応するログへのクリック可能なリンクを提示します。完全なナビゲーションチェーン：Grafana ダッシュボード（メトリクスのスパイク）→ exemplar ダイヤモンドをクリック → Tempo トレース（スパンウォーターフォール）→ ログリンクの trace_id をクリック → Loki ログ（そのリクエストの正確なログ行）。**セットアップ要件**：(1) アプリケーションが exemplar を公開する必要がある — Python の `prometheus_client` では `Counter.inc(exemplar={\"trace_id\": current_trace_id})` または `Histogram.observe(duration, exemplar={\"trace_id\": current_trace_id})` オーバーロードを使用；(2) Prometheus は `--enable-feature=exemplar-storage` で起動する必要がある；(3) Grafana Prometheus データソースで「Exemplars」が有効になっている必要がある；(4) ダイヤモンドがクリックされたときにどのバックエンドを開くかを Grafana が知るために、exemplar 宛先設定でその UID が参照された Grafana Tempo データソースが存在する必要がある。",
      },
      tag: {
        en: "exemplars & metrics-to-traces",
        np: "exemplar र metrics-to-traces",
        jp: "exemplar とメトリクスからトレースへ",
      },
    },
  ],
};
