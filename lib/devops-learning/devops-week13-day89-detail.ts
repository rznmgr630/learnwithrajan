import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Alertmanager** is the dedicated notification hub in the Prometheus ecosystem. Prometheus itself is responsible for detection — it continuously evaluates alerting rules against scraped metrics and fires alerts when conditions are met. Alertmanager sits downstream of Prometheus and is responsible for notification: it receives alert payloads from Prometheus (and any other Prometheus-compatible system) via its HTTP API, then applies a pipeline of deduplication, grouping, and routing before dispatching notifications to receivers. The separation of concerns is intentional and powerful: you can have multiple Prometheus servers all reporting to a single Alertmanager cluster, swap notification backends without touching Prometheus configuration, and apply complex routing logic centrally. When Prometheus evaluates an alerting rule, a firing alert starts in the `inactive` state. Once the condition becomes true, the alert enters `pending` — it remains pending for the duration specified by the rule's `for` clause (e.g. `for: 5m` means the condition must hold continuously for 5 minutes). This prevents alerting on transient spikes. Once the `for` duration elapses, the alert transitions to `firing` and Prometheus sends an HTTP POST to every Alertmanager in its configuration. Alertmanager's **grouping** mechanism is critical for noise reduction. In a large fleet, a single misconfiguration can cause hundreds of alerts to fire simultaneously — e.g. a bad deployment to 50 pods generates 50 `HighErrorRate` alerts. Without grouping, your on-call engineer receives 50 separate pages within seconds. With `group_by: [alertname, cluster]`, Alertmanager batches all alerts sharing the same `alertname` and `cluster` labels into a single notification. The `group_wait` parameter (default 30s) controls how long Alertmanager waits for more alerts to arrive before sending the first notification for a new group — this allows related alerts to accumulate. `group_interval` (default 5m) controls how long to wait before sending subsequent notifications for an already-firing group. `repeat_interval` (default 4h) controls how long to wait before re-sending a notification for an unchanged group. **Deduplication** is a separate concern: if 5 Prometheus replicas all fire the same `NodeDown` alert for the same instance, Alertmanager receives 5 identical HTTP POSTs. It deduplicates by comparing the alert's label set — identical labels mean one notification is sent, not five. This is essential in Prometheus HA setups where multiple Prometheus replicas scrape the same targets.",
    np: "**Alertmanager** Prometheus ecosystem मा dedicated notification hub हो। Prometheus आफैँ detection को लागि जिम्मेवार छ — यसले scraped metric विरुद्ध alerting rule continuously evaluate गर्छ र condition पूरा भएमा alert fire गर्छ। Alertmanager ले Prometheus भन्दा downstream बसेर notification को जिम्मेवारी लिन्छ: यसले Prometheus (र अन्य Prometheus-compatible system) बाट HTTP API मार्फत alert payload receive गर्छ, त्यसपछि receiver मा notification dispatch गर्नु अघि deduplication, grouping, र routing को pipeline apply गर्छ। Concerns को यो separation intentional र powerful छ: तपाईंसँग multiple Prometheus server हुन सक्छन् जुन एउटै Alertmanager cluster मा report गर्छन्, Prometheus configuration नछोई notification backend swap गर्न सकिन्छ, र centrally complex routing logic apply गर्न सकिन्छ। Prometheus ले alerting rule evaluate गर्दा, firing alert `inactive` state मा सुरु हुन्छ। Condition true भएपछि, alert `pending` मा जान्छ — यो rule को `for` clause (जस्तै `for: 5m` भनेको condition 5 minute सम्म continuously hold हुनुपर्छ) द्वारा specified duration को लागि pending रहन्छ। यसले transient spike मा alert गर्न रोक्छ। `for` duration समाप्त भएपछि, alert `firing` मा transition हुन्छ र Prometheus ले आफ्नो configuration मा भएको प्रत्येक Alertmanager मा HTTP POST पठाउँछ। Alertmanager को **grouping** mechanism noise reduction को लागि critical छ। ठूलो fleet मा, एउटै misconfiguration ले सयौं alert simultaneously fire गर्न सक्छ — जस्तै 50 pod मा bad deployment ले 50 `HighErrorRate` alert generate गर्छ। Grouping बिना, on-call engineer ले seconds भित्र 50 अलग page receive गर्छ। `group_by: [alertname, cluster]` सँग, Alertmanager ले एउटै `alertname` र `cluster` label share गर्ने सबै alert लाई एउटै notification मा batch गर्छ। `group_wait` parameter (default 30s) ले नयाँ group को लागि पहिलो notification पठाउनु अघि Alertmanager ले थप alert आउन कति कुर्छ control गर्छ। `group_interval` (default 5m) ले already-firing group को लागि subsequent notification पठाउनु अघि कति कुर्छ control गर्छ। `repeat_interval` (default 4h) ले unchanged group को लागि notification पुनः पठाउनु अघि कति कुर्छ control गर्छ। **Deduplication** अलग concern हो: यदि 5 Prometheus replica ले सबैले एउटै instance को लागि एउटै `NodeDown` alert fire गर्छन् भने, Alertmanager ले 5 identical HTTP POST receive गर्छ। यसले alert को label set compare गरेर deduplicate गर्छ — identical label भनेको five होइन एउटा notification पठाइन्छ। यो Prometheus HA setup मा essential छ जहाँ multiple Prometheus replica ले एउटै target scrape गर्छन्।",
    jp: "**Alertmanager** は Prometheus エコシステムにおける専用の通知ハブです。Prometheus 自体は検出の責任を持ちます — スクレイプされたメトリクスに対してアラートルールを継続的に評価し、条件が満たされるとアラートを発火します。Alertmanager は Prometheus の下流に位置し、通知の責任を担います：HTTP API を通じて Prometheus（および他の Prometheus 互換システム）からアラートペイロードを受信し、レシーバーに通知をディスパッチする前に重複排除・グルーピング・ルーティングのパイプラインを適用します。この関心事の分離は意図的かつ強力です：複数の Prometheus サーバーが単一の Alertmanager クラスターにレポートでき、Prometheus の設定に触れずに通知バックエンドを交換でき、複雑なルーティングロジックを集中的に適用できます。Prometheus がアラートルールを評価すると、発火するアラートは `inactive` 状態から始まります。条件が真になると、アラートは `pending` に入ります — ルールの `for` 句で指定された期間（例：`for: 5m` は条件が 5 分間継続して保持される必要があることを意味します）の間、保留状態が続きます。これにより一時的なスパイクでのアラートが防止されます。`for` の期間が経過すると、アラートは `firing` に移行し、Prometheus はその設定内のすべての Alertmanager に HTTP POST を送信します。Alertmanager の**グルーピング**メカニズムはノイズ削減に不可欠です。大規模なフリートでは、1 つの誤設定が数百のアラートを同時に発火させる可能性があります — 例えば 50 のポッドへの不正なデプロイにより 50 件の `HighErrorRate` アラートが生成されます。グルーピングなしでは、オンコールエンジニアは数秒以内に 50 件の別々のページを受け取ります。`group_by: [alertname, cluster]` を使用すると、Alertmanager は同じ `alertname` と `cluster` ラベルを共有するすべてのアラートを単一の通知にバッチ処理します。`group_wait` パラメーター（デフォルト 30 秒）は、新しいグループの最初の通知を送信する前に Alertmanager がより多くのアラートの到着を待つ時間を制御します。`group_interval`（デフォルト 5 分）は既に発火中のグループへの後続通知を送信する前の待機時間を制御します。`repeat_interval`（デフォルト 4 時間）は変更されていないグループへの通知を再送する前の待機時間を制御します。**重複排除**は別の関心事です：5 つの Prometheus レプリカがすべて同じインスタンスの同じ `NodeDown` アラートを発火させると、Alertmanager は 5 つの同一の HTTP POST を受信します。アラートのラベルセットを比較して重複排除します — 同一のラベルは 5 件ではなく 1 件の通知が送信されることを意味します。これは複数の Prometheus レプリカが同じターゲットをスクレイプする Prometheus HA セットアップで不可欠です。",
  } as const,
  o2: {
    en: "Alertmanager supports a rich set of **receivers** — the integrations through which notifications are sent. **PagerDuty** is the gold standard for on-call paging: it integrates with on-call schedules, escalation policies, and acknowledgement workflows. Alertmanager sends alerts to PagerDuty using a `routing_key` that maps to a PagerDuty service. When the Prometheus alert resolves, Alertmanager automatically sends a resolution event to PagerDuty, auto-closing the incident. **Slack** is commonly used for informational and warning-severity alerts that require team awareness but not immediate wake-up action — you can craft rich messages using Slack's templating with `{{ .CommonAnnotations.summary }}`. **OpsGenie** supports multi-team escalation, on-call schedules, and priority-based routing. **Email** receivers require SMTP configuration and are typical for legacy operations teams or audit trails. **Webhook** receivers POST the alert JSON to any HTTP endpoint — the most flexible integration for custom automation, ITSM tools (ServiceNow, Jira), or chat systems that Alertmanager does not natively support. **Silences** are time-bounded suppressions that match alert labels. During planned maintenance (e.g. a scheduled disk replacement), you create a silence matching `alertname=~\"Disk.*\", instance=\"node01\"` with a duration covering the maintenance window. Any alert whose labels match the silence matchers is suppressed — it still appears in the Alertmanager UI as \"Silenced\" but no notification is sent. Silences can be created via the Alertmanager web UI or programmatically via the `amtool` CLI: `amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance\"`. Silences have an explicit expiry — they automatically un-silence at the end of their duration, ensuring you don't forget to re-enable alerting. **Inhibition rules** are configuration-driven suppressions that apply automatically based on the state of other alerts. The classic use case: if `NodeDown` is firing for `instance=node01`, suppress all alerts from that same instance (like `DiskWriteError`, `HighMemoryUsage`) because they are symptoms of the node outage, not independent problems. Sending pages for every symptom creates noise and distracts from the root cause. Inhibition rules use `source_matchers` (the parent alert) and `target_matchers` (the child alerts to suppress) with an optional `equal` list of label names that must match between source and target alerts (e.g. `equal: [instance]` ensures a `NodeDown` on `node01` only suppresses alerts from `node01`, not from all nodes). **Alertmanager HA** runs multiple Alertmanager replicas that use a gossip protocol (based on Hashicorp Memberlist) to synchronise alert state and deduplicate notifications across the cluster. When one replica receives an alert, it gossips to its peers so all replicas know the current notification state — this prevents all replicas from independently sending the same notification. Prometheus must be configured to send alerts to all Alertmanager replicas simultaneously (list all replicas in `alerting.alertmanagers` in `prometheus.yml`). The `amtool` CLI is the command-line interface for Alertmanager: `amtool check-config alertmanager.yml` validates the configuration without restarting; `amtool alert query` lists currently firing alerts; `amtool silence add` creates a silence; `amtool silence list` shows active silences; `amtool silence expire <id>` removes a silence before its scheduled expiry.",
    np: "Alertmanager ले **receiver** को rich set support गर्छ — notification पठाइने integration। **PagerDuty** on-call paging को gold standard हो: यो on-call schedule, escalation policy, र acknowledgement workflow सँग integrate हुन्छ। Alertmanager ले PagerDuty service मा map गर्ने `routing_key` प्रयोग गरेर PagerDuty मा alert पठाउँछ। Prometheus alert resolve हुँदा, Alertmanager ले automatically PagerDuty मा resolution event पठाउँछ, incident auto-close गर्छ। **Slack** प्रायः informational र warning-severity alert को लागि प्रयोग हुन्छ जसलाई team awareness चाहिन्छ तर immediate wake-up action चाहिँदैन — `{{ .CommonAnnotations.summary }}` सँग Slack को templating प्रयोग गरेर rich message craft गर्न सकिन्छ। **OpsGenie** ले multi-team escalation, on-call schedule, र priority-based routing support गर्छ। **Email** receiver मा SMTP configuration चाहिन्छ र legacy operations team वा audit trail को लागि typical छ। **Webhook** receiver ले alert JSON लाई कुनै पनि HTTP endpoint मा POST गर्छ — custom automation, ITSM tool (ServiceNow, Jira), वा Alertmanager ले natively support नगर्ने chat system को लागि सबैभन्दा flexible integration। **Silence** alert label match गर्ने time-bounded suppression हो। Planned maintenance (जस्तै scheduled disk replacement) को समयमा, maintenance window cover गर्ने duration सहित `alertname=~\"Disk.*\", instance=\"node01\"` match गर्ने silence create गर्नुहोस्। Silence matcher match गर्ने label भएको कुनै पनि alert suppress हुन्छ — यो Alertmanager UI मा \"Silenced\" को रूपमा देखिन्छ तर notification पठाइँदैन। Silence Alertmanager web UI मार्फत वा `amtool` CLI मार्फत programmatically create गर्न सकिन्छ: `amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance\"`। Silence को explicit expiry हुन्छ — यी automatically duration को अन्तमा un-silence हुन्छन्, alerting re-enable गर्न बिर्सने सुनिश्चित गर्दैन। **Inhibition rule** configuration-driven suppression हो जुन अन्य alert को state मा आधारित automatically apply हुन्छ। Classic use case: `instance=node01` को लागि `NodeDown` fire भइरहेको छ भने, त्यही instance बाट सबै alert (जस्तै `DiskWriteError`, `HighMemoryUsage`) suppress गर्नुहोस् किनभने तिनीहरू independent problem होइन node outage को symptom हुन्। प्रत्येक symptom को लागि page पठाउँदा noise create हुन्छ र root cause बाट ध्यान हट्छ। Inhibition rule ले `source_matchers` (parent alert) र `target_matchers` (suppress गर्ने child alert) source र target alert बीच match हुनुपर्ने label name को optional `equal` list सहित प्रयोग गर्छ (जस्तै `equal: [instance]` ले सुनिश्चित गर्छ कि `node01` को `NodeDown` ले केवल `node01` बाट alert suppress गर्छ, सबै node बाट होइन)। **Alertmanager HA** ले cluster मा alert state synchronise गर्न र notification deduplicate गर्न gossip protocol (Hashicorp Memberlist मा आधारित) प्रयोग गर्ने multiple Alertmanager replica run गर्छ। एउटा replica ले alert receive गर्दा, यसले peers मा gossip गर्छ ताकि सबै replica ले current notification state थाहा पाउन — यसले सबै replica लाई independently एउटै notification पठाउनबाट रोक्छ। Prometheus लाई simultaneously सबै Alertmanager replica मा alert पठाउन configure गर्नुपर्छ (`prometheus.yml` मा `alerting.alertmanagers` मा सबै replica list गर्नुहोस्)। `amtool` CLI Alertmanager को command-line interface हो: `amtool check-config alertmanager.yml` ले restart नगरी configuration validate गर्छ; `amtool alert query` ले currently firing alert list गर्छ; `amtool silence add` ले silence create गर्छ; `amtool silence list` ले active silence देखाउँछ; `amtool silence expire <id>` ले scheduled expiry अघि silence remove गर्छ।",
    jp: "Alertmanager は豊富な**レシーバー**セット — 通知が送信される統合 — をサポートします。**PagerDuty** はオンコールページングのゴールドスタンダードです：オンコールスケジュール・エスカレーションポリシー・承認ワークフローと統合されます。Alertmanager は PagerDuty サービスにマッピングされる `routing_key` を使用して PagerDuty にアラートを送信します。Prometheus アラートが解決すると、Alertmanager は自動的に PagerDuty に解決イベントを送信し、インシデントを自動クローズします。**Slack** は通常、チームの認識は必要だが即座の起床アクションは不要な情報的および警告レベルのアラートに使用されます — `{{ .CommonAnnotations.summary }}` を使った Slack のテンプレートでリッチなメッセージを作成できます。**OpsGenie** はマルチチームのエスカレーション・オンコールスケジュール・優先度ベースのルーティングをサポートします。**Email** レシーバーは SMTP 設定が必要で、レガシーオペレーションチームや監査証跡に典型的です。**Webhook** レシーバーはアラート JSON を任意の HTTP エンドポイントに POST します — カスタム自動化・ITSM ツール（ServiceNow・Jira）・Alertmanager がネイティブにサポートしないチャットシステムに対して最も柔軟な統合です。**サイレンス**はアラートラベルに一致する時間制限付きの抑制です。計画メンテナンス（例：スケジュールされたディスク交換）の際、メンテナンスウィンドウをカバーする期間で `alertname=~\"Disk.*\", instance=\"node01\"` に一致するサイレンスを作成します。サイレンスマッチャーに一致するラベルを持つアラートはすべて抑制されます — Alertmanager UI に「Silenced」として表示されますが通知は送信されません。サイレンスは Alertmanager Web UI または `amtool` CLI でプログラム的に作成できます：`amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance\"`。サイレンスには明示的な有効期限があります — 期間の終わりに自動的にサイレンスが解除され、アラートの再有効化を忘れないようにします。**抑制ルール**は他のアラートの状態に基づいて自動的に適用される設定駆動の抑制です。典型的なユースケース：`instance=node01` の `NodeDown` が発火している場合、そのインスタンスからのすべてのアラート（`DiskWriteError`・`HighMemoryUsage` など）を抑制します。なぜならそれらは独立した問題ではなくノード停止の症状だからです。すべての症状をページングするとノイズが発生し、根本原因から注意が逸れます。抑制ルールは `source_matchers`（親アラート）と `target_matchers`（抑制する子アラート）を使用し、ソースとターゲットアラート間で一致しなければならないラベル名のオプションの `equal` リストを持ちます（例：`equal: [instance]` は `node01` の `NodeDown` が `node01` からのアラートのみを抑制し、すべてのノードからのアラートは抑制しないことを保証します）。**Alertmanager HA** はゴシッププロトコル（Hashicorp Memberlist ベース）を使用してクラスター全体でアラート状態を同期し通知を重複排除する複数の Alertmanager レプリカを実行します。1 つのレプリカがアラートを受信すると、ピアにゴシップして全レプリカが現在の通知状態を認識します — これにより全レプリカが独立して同じ通知を送信するのを防ぎます。Prometheus はすべての Alertmanager レプリカに同時にアラートを送信するように設定する必要があります（`prometheus.yml` の `alerting.alertmanagers` にすべてのレプリカをリストする）。`amtool` CLI は Alertmanager のコマンドラインインターフェースです：`amtool check-config alertmanager.yml` は再起動なしで設定を検証します；`amtool alert query` は現在発火中のアラートをリストします；`amtool silence add` はサイレンスを作成します；`amtool silence list` はアクティブなサイレンスを表示します；`amtool silence expire <id>` はスケジュールされた有効期限前にサイレンスを削除します。",
  } as const,
};

export const DEVOPS_DAY_89_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Alertmanager pipeline — grouping, routing & deduplication",
        np: "Alertmanager pipeline — grouping, routing र deduplication",
        jp: "Alertmanager パイプライン — グルーピング・ルーティング・重複排除",
      },
      blocks: [
        { type: "diagram", id: "devops-alertmanager-architecture" },
        {
          type: "table",
          caption: {
            en: "Alertmanager receiver types — comparison by use case, config, and best fit",
            np: "Alertmanager receiver type — use case, config, र best fit द्वारा comparison",
            jp: "Alertmanager レシーバータイプ — ユースケース・設定・最適用途による比較",
          },
          headers: [
            { en: "Receiver", np: "Receiver", jp: "レシーバー" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
            { en: "Key config fields", np: "Key config field", jp: "主要設定フィールド" },
            { en: "Best for", np: "Best for", jp: "最適用途" },
          ],
          rows: [
            [
              { en: "PagerDuty", np: "PagerDuty", jp: "PagerDuty" },
              { en: "On-call paging with escalation policies and acknowledgement workflows", np: "Escalation policy र acknowledgement workflow सहित on-call paging", jp: "エスカレーションポリシーと承認ワークフローを伴うオンコールページング" },
              { en: "`routing_key`, `severity`, `description`, `client_url`", np: "`routing_key`, `severity`, `description`, `client_url`", jp: "`routing_key`・`severity`・`description`・`client_url`" },
              { en: "Critical incidents requiring immediate human response and tracked resolution", np: "Immediate human response र tracked resolution चाहिने critical incident", jp: "即座の人的対応と追跡された解決が必要なクリティカルインシデント" },
            ],
            [
              { en: "Slack", np: "Slack", jp: "Slack" },
              { en: "Team notification via channel messages with optional rich formatting", np: "Optional rich formatting सहित channel message मार्फत team notification", jp: "オプションのリッチフォーマットを伴うチャンネルメッセージによるチーム通知" },
              { en: "`api_url`, `channel`, `title`, `text`, `color`", np: "`api_url`, `channel`, `title`, `text`, `color`", jp: "`api_url`・`channel`・`title`・`text`・`color`" },
              { en: "Non-critical, informational, or warning alerts needing team visibility without paging", np: "Paging बिना team visibility चाहिने non-critical, informational, वा warning alert", jp: "ページングなしでチームの可視性が必要な非クリティカル・情報的・警告アラート" },
            ],
            [
              { en: "OpsGenie", np: "OpsGenie", jp: "OpsGenie" },
              { en: "Enterprise on-call management with multi-team escalation and priority routing", np: "Multi-team escalation र priority routing सहित enterprise on-call management", jp: "マルチチームエスカレーションと優先度ルーティングを伴うエンタープライズオンコール管理" },
              { en: "`api_key`, `priority`, `tags`, `responders`, `message`", np: "`api_key`, `priority`, `tags`, `responders`, `message`", jp: "`api_key`・`priority`・`tags`・`responders`・`message`" },
              { en: "Multi-team orgs where different alert types route to different on-call rotations", np: "Different alert type ले different on-call rotation मा route गर्ने multi-team org", jp: "異なるアラートタイプが異なるオンコールローテーションにルーティングされるマルチチーム組織" },
            ],
            [
              { en: "Email", np: "Email", jp: "Email" },
              { en: "SMTP-based email notification to an operations mailbox or distribution list", np: "Operations mailbox वा distribution list मा SMTP-based email notification", jp: "運用メールボックスまたは配布リストへの SMTP ベースのメール通知" },
              { en: "`smtp_from`, `to`, `subject`, `html`, `smarthost`", np: "`smtp_from`, `to`, `subject`, `html`, `smarthost`", jp: "`smtp_from`・`to`・`subject`・`html`・`smarthost`" },
              { en: "Legacy systems, compliance audit trails, or non-urgent daily digests", np: "Legacy system, compliance audit trail, वा non-urgent daily digest", jp: "レガシーシステム・コンプライアンス監査証跡・緊急でない日次ダイジェスト" },
            ],
            [
              { en: "Webhook", np: "Webhook", jp: "Webhook" },
              { en: "HTTP POST of alert JSON to any custom endpoint for arbitrary automation", np: "Arbitrary automation को लागि custom endpoint मा alert JSON को HTTP POST", jp: "任意の自動化のためのカスタムエンドポイントへのアラート JSON の HTTP POST" },
              { en: "`url`, `http_config`, `max_alerts`", np: "`url`, `http_config`, `max_alerts`", jp: "`url`・`http_config`・`max_alerts`" },
              { en: "Custom automation, ITSM tools (ServiceNow, Jira), or unsupported chat systems", np: "Custom automation, ITSM tool (ServiceNow, Jira), वा unsupported chat system", jp: "カスタム自動化・ITSM ツール（ServiceNow・Jira）・未サポートのチャットシステム" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "alertmanager.yml, Prometheus rules & amtool",
        np: "alertmanager.yml, Prometheus rule र amtool",
        jp: "alertmanager.yml・Prometheus ルール・amtool",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Complete alertmanager.yml, prometheus-alerts.yml & amtool commands",
            np: "Complete alertmanager.yml, prometheus-alerts.yml र amtool command",
            jp: "完全な alertmanager.yml・prometheus-alerts.yml・amtool コマンド",
          },
          code: `# ── alertmanager.yml — production routing tree example ───────────────
global:
  # SMTP for default email receiver
  smtp_smarthost: "smtp.example.com:587"
  smtp_from: "alertmanager@example.com"
  smtp_auth_username: "alertmanager@example.com"
  smtp_auth_password: "{{ env \"SMTP_PASSWORD\" }}"   # use env var, never hardcode
  smtp_require_tls: true

  # How long to wait before declaring an alert resolved (default 5m)
  resolve_timeout: 5m

# ── Routing tree ──────────────────────────────────────────────────────────
route:
  receiver: default                  # catch-all receiver for unmatched alerts
  group_by: [alertname, cluster]     # group alerts sharing these labels into one notification
  group_wait: 30s                    # wait 30s for sibling alerts before first notification
  group_interval: 5m                 # wait 5m before notifying about new alerts in existing group
  repeat_interval: 4h                # re-notify about unchanged firing alerts every 4h

  routes:
    # ── critical alerts → PagerDuty ──────────────────────────────────────
    - matchers:
        - name: severity
          value: critical
      receiver: pagerduty-critical
      group_wait: 10s                # page faster for critical alerts
      repeat_interval: 1h            # remind every hour until resolved
      continue: false                # stop routing here (don't fall through to further routes)

    # ── frontend team alerts → Slack #team-frontend ───────────────────────
    - matchers:
        - name: team
          value: frontend
      receiver: slack-frontend
      group_by: [alertname, service]
      group_wait: 1m
      repeat_interval: 6h

# ── Receivers ─────────────────────────────────────────────────────────────
receivers:
  # Default: send to ops email mailbox
  - name: default
    email_configs:
      - to: "ops@example.com"
        subject: '[{{ .Status | toUpper }}{{ if eq .Status "firing" }}:{{ .Alerts.Firing | len }}{{ end }}] {{ .CommonLabels.alertname }}'
        html: |
          {{ range .Alerts }}
          <b>Alert:</b> {{ .Annotations.summary }}<br/>
          <b>Description:</b> {{ .Annotations.description }}<br/>
          <b>Labels:</b> {{ range .Labels.SortedPairs }} {{ .Name }}={{ .Value }} {{ end }}<br/>
          <b>Source:</b> <a href="{{ .GeneratorURL }}">Prometheus</a><br/><br/>
          {{ end }}

  # PagerDuty: on-call paging for critical severity
  - name: pagerduty-critical
    pagerduty_configs:
      - routing_key: "{{ env \"PAGERDUTY_ROUTING_KEY\" }}"
        description: '{{ template "pagerduty.default.description" . }}'
        severity: critical
        client: "Alertmanager"
        client_url: "http://alertmanager.example.com"
        details:
          firing: '{{ template "pagerduty.default.instances" .Alerts.Firing }}'
          resolved: '{{ template "pagerduty.default.instances" .Alerts.Resolved }}'
          num_firing: '{{ .Alerts.Firing | len }}'

  # Slack: team-level notifications for frontend team
  - name: slack-frontend
    slack_configs:
      - api_url: "{{ env \"SLACK_WEBHOOK_URL\" }}"
        channel: "#team-frontend"
        send_resolved: true
        color: '{{ if eq .Status "firing" }}danger{{ else }}good{{ end }}'
        title: '{{ if eq .Status "firing" }}🔥 {{ end }}[{{ .Status | toUpper }}] {{ .CommonLabels.alertname }}'
        text: |
          {{ range .Alerts }}
          *Summary:* {{ .Annotations.summary }}
          *Description:* {{ .Annotations.description }}
          *Severity:* {{ .Labels.severity }}
          *Cluster:* {{ .Labels.cluster }}
          {{ end }}
        actions:
          - type: button
            text: "View in Prometheus"
            url: "{{ (index .Alerts 0).GeneratorURL }}"

# ── Inhibition rules ──────────────────────────────────────────────────────
inhibit_rules:
  # Suppress all alerts from an instance when NodeDown fires for that instance.
  # E.g. if node01 is down, suppress DiskWriteError, HighMemoryUsage, etc.
  # from node01 — they are symptoms, not root causes.
  - source_matchers:
      - name: alertname
        value: NodeDown
    target_matchers:
      - name: alertname
        value: NodeDown
        regex: false
    # Override: suppress ALL target alerts from the same instance, not just NodeDown copies
    # (remove the target_matchers restriction to suppress everything from that instance)
    equal: [instance]   # NodeDown on node01 only inhibits alerts with instance=node01

  # Suppress warning-level alerts when a critical alert for the same service is already firing.
  # Avoids double-paging when something is critically broken.
  - source_matchers:
      - name: severity
        value: critical
    target_matchers:
      - name: severity
        value: warning
    equal: [alertname, cluster, service]

---
# ── prometheus-alerts.yml — three alerting rules ──────────────────────────
groups:
  - name: application_alerts
    interval: 30s    # evaluate this group every 30s (overrides global evaluation_interval)
    rules:

      # Rule 1: High error rate — fires when >5% of requests are errors for 5 consecutive minutes
      - alert: HighErrorRate
        expr: |
          sum by (job, cluster) (
            rate(http_requests_total{status_code=~"5.."}[5m])
          )
          /
          sum by (job, cluster) (
            rate(http_requests_total[5m])
          ) > 0.05
        for: 5m
        labels:
          severity: critical
          team: backend
        annotations:
          summary: "High error rate on {{ $labels.job }} in {{ $labels.cluster }}"
          description: >-
            {{ $labels.job }} in cluster {{ $labels.cluster }} has a
            {{ $value | humanizePercentage }} error rate (threshold: 5%).
            This has been sustained for at least 5 minutes.
          runbook_url: "https://wiki.example.com/runbooks/high-error-rate"

      # Rule 2: High p99 latency — fires when p99 exceeds 500ms for 10 consecutive minutes
      - alert: HighLatency
        expr: |
          histogram_quantile(0.99,
            sum by (job, cluster, le) (
              rate(http_request_duration_seconds_bucket[5m])
            )
          ) > 0.5
        for: 10m
        labels:
          severity: warning
          team: backend
        annotations:
          summary: "High p99 latency on {{ $labels.job }}"
          description: >-
            p99 request latency for {{ $labels.job }} in {{ $labels.cluster }}
            is {{ $value | humanizeDuration }} (threshold: 500ms).
            Check for slow database queries or downstream service degradation.
          runbook_url: "https://wiki.example.com/runbooks/high-latency"

      # Rule 3: Node down — fires when a target is unreachable for 2 consecutive minutes
      - alert: NodeDown
        expr: up == 0
        for: 2m
        labels:
          severity: critical
          team: infrastructure
        annotations:
          summary: "Node {{ $labels.instance }} is unreachable"
          description: >-
            Prometheus has been unable to scrape {{ $labels.instance }}
            (job: {{ $labels.job }}) for more than 2 minutes.
            All dependent alerts from this instance will be inhibited.
          runbook_url: "https://wiki.example.com/runbooks/node-down"

---
# ── amtool — Alertmanager CLI commands ────────────────────────────────────

# Validate alertmanager.yml without restarting the server
amtool check-config alertmanager.yml

# Query currently firing alerts (default --alertmanager.url=http://localhost:9093)
amtool alert query

# Filter alerts by label matcher
amtool alert query alertname=NodeDown
amtool alert query severity=critical

# Create a silence: suppress all Disk.* alerts for 2h (planned maintenance)
amtool silence add \\
  --matchers='alertname=~"Disk.*"' \\
  --duration=2h \\
  --comment="Planned disk maintenance 2026-05-18 — disk array replacement on node01" \\
  --author="ops-team"

# Create a silence matching multiple label matchers (AND logic)
amtool silence add \\
  --matchers='alertname=~"Disk.*",instance="node01.prod"' \\
  --duration=4h \\
  --comment="Node01 disk maintenance window"

# List all active silences
amtool silence list

# Expire a silence before its scheduled end (get the ID from silence list)
amtool silence expire <silence-id>

# Check routing: preview which receiver an alert would be sent to
amtool config routes test \\
  --verify.receivers=pagerduty-critical \\
  alertname=HighErrorRate severity=critical cluster=prod-us-east

# Trigger a test alert via the Alertmanager HTTP API (for integration testing)
curl -X POST http://localhost:9093/api/v1/alerts \\
  -H "Content-Type: application/json" \\
  -d '[{
    "labels": {
      "alertname": "TestAlert",
      "severity": "critical",
      "cluster": "prod-us-east",
      "instance": "node01.prod"
    },
    "annotations": {
      "summary": "Test alert for routing verification",
      "description": "This is a manually triggered test alert"
    },
    "generatorURL": "http://prometheus.example.com/graph"
  }]'

# Reload Alertmanager config without restart (requires --web.enable-lifecycle)
curl -X POST http://localhost:9093/-/reload`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Deploy Alertmanager locally via Docker, write a complete `alertmanager.yml` with at least 3 different receivers (Slack webhook, email, and a webhook receiver pointing to `https://webhook.site` for testing). Create a routing tree where alerts with `severity=critical` go to both PagerDuty (or a webhook mock) AND Slack, while `severity=warning` alerts only go to Slack. Use `amtool check-config alertmanager.yml` to validate. Then trigger a test alert using the Alertmanager API (`curl -X POST http://localhost:9093/api/v1/alerts -d '[{\"labels\":{\"alertname\":\"TestAlert\",\"severity\":\"critical\"},\"annotations\":{\"summary\":\"test\"}}]'`) and verify it routes to the correct receiver. Observe the `group_wait` delay before the first notification fires.",
              np: "Docker मार्फत Alertmanager locally deploy गर्नुहोस्, कम्तीमा 3 different receiver (Slack webhook, email, र testing को लागि `https://webhook.site` मा point गर्ने webhook receiver) सहित complete `alertmanager.yml` लेख्नुहोस्। Routing tree create गर्नुहोस् जहाँ `severity=critical` भएको alert PagerDuty (वा webhook mock) र Slack दुवैमा जान्छन्, जबकि `severity=warning` alert केवल Slack मा जान्छन्। Validate गर्न `amtool check-config alertmanager.yml` प्रयोग गर्नुहोस्। त्यसपछि Alertmanager API प्रयोग गरेर test alert trigger गर्नुहोस् (`curl -X POST http://localhost:9093/api/v1/alerts -d '[{\"labels\":{\"alertname\":\"TestAlert\",\"severity\":\"critical\"},\"annotations\":{\"summary\":\"test\"}}]'`) र correct receiver मा route हुन्छ verify गर्नुहोस्। पहिलो notification fire हुनु अघि `group_wait` delay observe गर्नुहोस्।",
              jp: "Docker を介して Alertmanager をローカルにデプロイし、少なくとも 3 つの異なるレシーバー（Slack webhook・email・テスト用に `https://webhook.site` を指す webhook レシーバー）を持つ完全な `alertmanager.yml` を書く。`severity=critical` のアラートが PagerDuty（または webhook モック）と Slack の両方に送られ、`severity=warning` アラートが Slack のみに送られるルーティングツリーを作成する。`amtool check-config alertmanager.yml` を使用して検証する。次に Alertmanager API を使用してテストアラートをトリガーし（`curl -X POST http://localhost:9093/api/v1/alerts -d '[{\"labels\":{\"alertname\":\"TestAlert\",\"severity\":\"critical\"},\"annotations\":{\"summary\":\"test\"}}]'`）、正しいレシーバーにルーティングされることを確認する。最初の通知が発火する前の `group_wait` 遅延を観察する。",
            },
            {
              en: "Practice inhibition rules: write an alerting rule that fires `NodeDown` when `up == 0` for any target, and a second rule `DiskWriteError` that fires when disk write errors increase. Add an inhibition rule in Alertmanager that suppresses `DiskWriteError` when `NodeDown` is firing for the same `instance` label. Simulate `NodeDown` by stopping your test exporter. Verify in the Alertmanager UI that `DiskWriteError` is suppressed (shown as inhibited, not sent to receivers). This demonstrates why inhibition rules are essential: disk write errors during a node outage are symptoms, not root causes — paging on them creates noise.",
              np: "Inhibition rule practice गर्नुहोस्: कुनै पनि target को लागि `up == 0` हुँदा `NodeDown` fire गर्ने alerting rule लेख्नुहोस्, र disk write error बढ्दा fire हुने दोस्रो rule `DiskWriteError` लेख्नुहोस्। Alertmanager मा inhibition rule add गर्नुहोस् जसले एउटै `instance` label को लागि `NodeDown` fire भइरहेको बेला `DiskWriteError` suppress गर्छ। Test exporter stop गरेर `NodeDown` simulate गर्नुहोस्। Alertmanager UI मा `DiskWriteError` suppress भएको (inhibited देखाइएको, receiver मा नपठाइएको) verify गर्नुहोस्। यसले inhibition rule किन essential छ demonstrate गर्छ: node outage को समयमा disk write error symptom हो, root cause होइन — तिनीहरूमा paging गर्दा noise create हुन्छ।",
              jp: "抑制ルールを練習する：任意のターゲットで `up == 0` の場合に `NodeDown` を発火するアラートルールを書き、ディスク書き込みエラーが増加した場合に発火する 2 番目のルール `DiskWriteError` を書く。同じ `instance` ラベルの `NodeDown` が発火しているときに `DiskWriteError` を抑制する抑制ルールを Alertmanager に追加する。テストエクスポーターを停止して `NodeDown` をシミュレートする。Alertmanager UI で `DiskWriteError` が抑制されている（抑制済みと表示され、レシーバーに送信されていない）ことを確認する。これにより抑制ルールが不可欠な理由が示されます：ノード停止中のディスク書き込みエラーは根本原因ではなく症状です — それらをページングするとノイズが発生します。",
            },
            {
              en: "Practice silences with `amtool`: create a 2-hour silence that matches `alertname=~\"Disk.*\"` for a planned disk maintenance window. Use `amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance 2026-05-18\"`. List active silences with `amtool silence list`. Trigger a `DiskSpaceLow` test alert and verify it is silenced (appears in Alertmanager UI as \"Silenced\", no notification sent). Expire the silence early with `amtool silence expire <id>`. Verify the alert now routes normally. Document in a comment the difference between silences (temporary suppression for known events) and inhibition (conditional suppression based on other alert state).",
              np: "`amtool` सँग silence practice गर्नुहोस्: planned disk maintenance window को लागि `alertname=~\"Disk.*\"` match गर्ने 2-hour silence create गर्नुहोस्। `amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance 2026-05-18\"` प्रयोग गर्नुहोस्। `amtool silence list` सँग active silence list गर्नुहोस्। `DiskSpaceLow` test alert trigger गर्नुहोस् र silence भएको verify गर्नुहोस् (Alertmanager UI मा \"Silenced\" देखिन्छ, notification पठाइँदैन)। `amtool silence expire <id>` सँग silence early expire गर्नुहोस्। Alert अब normally route हुन्छ verify गर्नुहोस्। Comment मा silence (known event को लागि temporary suppression) र inhibition (अन्य alert state मा आधारित conditional suppression) बीचको difference document गर्नुहोस्।",
              jp: "`amtool` でサイレンスを練習する：計画されたディスクメンテナンスウィンドウのために `alertname=~\"Disk.*\"` に一致する 2 時間のサイレンスを作成する。`amtool silence add --matchers='alertname=~\"Disk.*\"' --duration=2h --comment=\"Planned disk maintenance 2026-05-18\"` を使用する。`amtool silence list` でアクティブなサイレンスをリストする。`DiskSpaceLow` テストアラートをトリガーし、サイレンス化されていることを確認する（Alertmanager UI に「Silenced」として表示され、通知が送信されない）。`amtool silence expire <id>` でサイレンスを早期に期限切れにする。アラートが正常にルーティングされることを確認する。コメントにサイレンス（既知のイベントのための一時的な抑制）と抑制（他のアラート状態に基づく条件付き抑制）の違いを文書化する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Prometheus alerting rule and Alertmanager, and how do they work together?",
        np: "Prometheus alerting rule र Alertmanager बीचको फरक के हो, र तिनीहरू सँगै कसरी काम गर्छन्?",
        jp: "Prometheus アラートルールと Alertmanager の違いは何で、それらはどのように連携して機能するのか？",
      },
      answer: {
        en: "Prometheus and Alertmanager solve fundamentally different problems in the alerting pipeline, and understanding their separation of concerns is key to operating both correctly. **Prometheus is the detection engine.** It scrapes metrics from your targets and evaluates alerting rules on a fixed schedule (`evaluation_interval`). An alerting rule is a PromQL expression with a threshold — when the expression returns a non-empty result, the alert is considered active. The lifecycle of an alert in Prometheus passes through three states: `inactive` (the condition is not met — no alert), `pending` (the condition IS met, but the `for` clause duration has not elapsed yet), and `firing` (the condition has been met continuously for the full `for` duration). The `for` clause is critical for production reliability: a `for: 5m` clause means the alert must be continuously true for 5 minutes before Prometheus reports it as firing. This suppresses transient spikes and prevents alert fatigue from brief anomalies. Without a `for` clause, a single scrape where a counter briefly returns a high value would generate a notification. **Alertmanager is the notification engine.** Once an alert transitions to `firing` in Prometheus, Prometheus sends an HTTP POST to all configured Alertmanager instances containing the alert labels, annotations, and `generatorURL`. Alertmanager receives this payload and applies its pipeline: deduplication (compare label sets to collapse identical alerts from multiple Prometheus replicas), grouping (batch related alerts into a single notification), routing (traverse the routing tree to find the matching receiver), and finally dispatching to the receiver (PagerDuty, Slack, email, etc.). The alert also goes through Alertmanager state transitions: an active alert may be `active` (will be notified), `silenced` (matches a silence — notification suppressed), or `inhibited` (suppressed by an inhibition rule because a parent alert is firing). When the PromQL condition becomes false, Prometheus marks the alert as resolved and sends a resolution notification to Alertmanager, which forwards it to the receiver (PagerDuty auto-resolves, Slack gets a green message). If Alertmanager goes down temporarily, Prometheus continues evaluating rules and buffering alerts — it retries delivery to Alertmanager. If Prometheus goes down, no new alerts fire and existing firing alerts eventually resolve (the Alertmanager `resolve_timeout` determines how long to wait before auto-resolving an alert for which no further firing notifications arrive). The clean separation means you can scale Prometheus horizontally (multiple shards) while having a single central Alertmanager HA cluster, or have staging and production Prometheus servers all routing to the same Alertmanager with routing rules that differentiate them by label.",
        np: "Prometheus र Alertmanager ले alerting pipeline मा fundamentally different problem solve गर्छन्, र तिनीहरूको concerns को separation बुझ्नु दुवैलाई correctly operate गर्न key छ। **Prometheus detection engine हो।** यसले target बाट metric scrape गर्छ र fixed schedule (`evaluation_interval`) मा alerting rule evaluate गर्छ। Alerting rule threshold सहित PromQL expression हो — expression ले non-empty result return गर्दा, alert active मानिन्छ। Prometheus मा alert को lifecycle तीन state मार्फत जान्छ: `inactive` (condition met छैन — कुनै alert छैन), `pending` (condition IS met, तर `for` clause duration समाप्त भएको छैन), र `firing` (condition पूरा `for` duration को लागि continuously met भएको छ)। `for` clause production reliability को लागि critical छ: `for: 5m` clause भनेको Prometheus ले firing report गर्नु अघि alert 5 minute सम्म continuously true हुनुपर्छ। यसले transient spike suppress गर्छ र brief anomaly बाट alert fatigue रोक्छ। `for` clause बिना, counter ले briefly high value return गर्ने single scrape ले notification generate गर्थ्यो। **Alertmanager notification engine हो।** Prometheus मा alert `firing` मा transition हुँदा, Prometheus ले सबै configured Alertmanager instance मा alert label, annotation, र `generatorURL` contain गर्ने HTTP POST पठाउँछ। Alertmanager ले यो payload receive गर्छ र आफ्नो pipeline apply गर्छ: deduplication (multiple Prometheus replica बाट identical alert collapse गर्न label set compare), grouping (related alert लाई single notification मा batch गर्नुहोस्), routing (matching receiver find गर्न routing tree traverse), र finally receiver (PagerDuty, Slack, email, आदि) मा dispatch। Alert ले Alertmanager state transition पनि जान्छ: active alert `active` (notify गरिनेछ), `silenced` (silence match गर्छ — notification suppressed), वा `inhibited` (parent alert fire भएकाले inhibition rule द्वारा suppressed) हुन सक्छ। PromQL condition false हुँदा, Prometheus ले alert resolved mark गर्छ र Alertmanager मा resolution notification पठाउँछ, जसले receiver मा forward गर्छ (PagerDuty auto-resolve हुन्छ, Slack ले green message पाउँछ)। Alertmanager temporarily down भएमा, Prometheus ले rule evaluate र alert buffer गर्दै रहन्छ — यसले Alertmanager मा delivery retry गर्छ। Prometheus down भएमा, नयाँ alert fire हुँदैन र existing firing alert eventually resolve हुन्छन् (Alertmanager `resolve_timeout` ले कति कुर्ने determine गर्छ)।",
        jp: "Prometheus と Alertmanager はアラートパイプラインで根本的に異なる問題を解決し、それらの関心事の分離を理解することが両方を正しく運用するための鍵です。**Prometheus は検出エンジンです。** ターゲットからメトリクスをスクレイプし、固定スケジュール（`evaluation_interval`）でアラートルールを評価します。アラートルールはしきい値を持つ PromQL 式です — 式が空でない結果を返すと、アラートはアクティブとみなされます。Prometheus におけるアラートのライフサイクルは 3 つの状態を通過します：`inactive`（条件が満たされていない — アラートなし）・`pending`（条件は満たされているが、`for` 句の期間がまだ経過していない）・`firing`（条件が `for` 期間全体にわたって継続的に満たされている）。`for` 句は本番の信頼性に不可欠です：`for: 5m` 句は Prometheus が発火を報告する前にアラートが 5 分間継続して真でなければならないことを意味します。これにより一時的なスパイクが抑制され、短い異常によるアラート疲れが防止されます。`for` 句なしでは、カウンターが一時的に高い値を返す単一のスクレイプが通知を生成します。**Alertmanager は通知エンジンです。** Prometheus でアラートが `firing` に移行すると、Prometheus はアラートラベル・アノテーション・`generatorURL` を含む HTTP POST をすべての設定された Alertmanager インスタンスに送信します。Alertmanager はこのペイロードを受信してパイプラインを適用します：重複排除（複数の Prometheus レプリカからの同一アラートを折りたたむためのラベルセット比較）・グルーピング（関連するアラートを単一の通知にバッチ処理）・ルーティング（一致するレシーバーを見つけるためのルーティングツリーの走査）・最終的にレシーバー（PagerDuty・Slack・email など）へのディスパッチ。アラートは Alertmanager の状態遷移も経ます：アクティブなアラートは `active`（通知される）・`silenced`（サイレンスに一致 — 通知抑制）・`inhibited`（親アラートが発火しているため抑制ルールによって抑制）になれます。PromQL 条件が偽になると Prometheus はアラートを解決済みとしてマークし Alertmanager に解決通知を送信し、それがレシーバーに転送されます（PagerDuty は自動解決・Slack はグリーンメッセージを受け取ります）。Alertmanager が一時的にダウンすると Prometheus はルールの評価とアラートのバッファリングを続けます — Alertmanager への配信を再試行します。Prometheus がダウンすると新しいアラートは発火せず、既存の発火中のアラートは最終的に解決されます（Alertmanager の `resolve_timeout` がいつ自動解決するかを決定します）。",
      },
      tag: {
        en: "Prometheus rules vs Alertmanager",
        np: "Prometheus rules vs Alertmanager",
        jp: "Prometheus ルール対 Alertmanager",
      },
    },
    {
      question: {
        en: "When should you use silences versus inhibition rules, and what are the risks of each?",
        np: "Silence vs inhibition rule कहिले प्रयोग गर्ने, र प्रत्येकको risk के हो?",
        jp: "サイレンスと抑制ルールはいつ使うべきで、それぞれのリスクは何か？",
      },
      answer: {
        en: "Silences and inhibition rules both suppress alert notifications, but they operate on entirely different principles and serve different operational use cases. Choosing the wrong tool causes real operational risk. **Silences are manual, time-bounded suppressions** created by a human operator in response to a specific known event. They match alert labels using matchers and suppress all matching alerts for a defined duration. Use silences for: (1) **Planned maintenance windows** — when you are replacing a disk, restarting a service, or deploying a major change, create a silence covering the maintenance window so alerts from the affected components do not page during the expected disruption. (2) **Known flapping services during a deploy** — if a canary deploy is causing intermittent 5xx errors while traffic shifts, silence `HighErrorRate` for the canary pods for 30 minutes to avoid noise during the controlled transition. (3) **Active incident investigation** — when you are already working an incident, silence the child symptom alerts to keep the noise down while the on-call focuses on the root cause. Silences are created with an explicit expiry — they always end, which is intentional. You cannot create a permanent silence in Alertmanager (if you need a permanent suppression, use an inhibition rule instead). **Risk of silences**: the most dangerous failure mode is a silence that outlasts the event it was created for. An engineer creates a 4-hour silence for a maintenance window that takes only 30 minutes, forgets to expire it early, and the system has a real outage 2 hours later during the silence period. The alert fires but no notification is sent. This risk is mitigated by: (a) always adding a detailed `--comment` that includes the person's name and the event description; (b) using the shortest reasonable duration (not round numbers like \"4h just to be safe\"); (c) reviewing active silences at the start of every on-call shift; (d) never creating silences matching overly broad matchers like `severity=critical` — always scope to specific `alertname` and `instance`. **Inhibition rules are configuration-driven, automatic suppressions** defined in `alertmanager.yml`. They suppress `target_matchers` alerts when `source_matchers` alerts are firing for the same label values listed in `equal`. Use inhibition rules for: (1) **Structural dependencies** — if `NodeDown` fires, suppress `HighMemoryUsage`, `DiskWriteError`, and `HighCPU` for the same instance because they are symptoms, not causes. (2) **Cluster-level cascade** — if a `ClusterNetworkPartition` alert fires, suppress individual pod communication alerts because they will all resolve when the partition heals. (3) **Severity deduplication** — if a `critical` alert is already firing for a `job+cluster`, suppress `warning` alerts for the same combination to reduce noise. **Risk of inhibition rules**: an over-broad inhibition rule that shares labels with many unrelated alerts can accidentally suppress critical notifications. For example, if `equal: [cluster]` is specified for a `NodeDown` inhibition, a `NodeDown` on any node in the cluster suppresses ALL target alerts in the entire cluster, not just from the affected node — a single flapping monitor can silence your entire cluster's alerting. Always add as many label constraints in `target_matchers` as possible and prefer narrow `equal` lists (`equal: [instance]` not `equal: [cluster]`). Test inhibition rules explicitly by simulating the parent alert and verifying via `amtool alert query` that the expected child alerts show as inhibited. Inhibition rules should also be reviewed in post-mortems: if a major incident was missed because an inhibition rule suppressed a key alert, the rule's matchers must be tightened.",
        np: "Silence र inhibition rule दुवैले alert notification suppress गर्छन्, तर तिनीहरू entirely different principle मा operate गर्छन् र different operational use case serve गर्छन्। गलत tool choose गर्दा real operational risk हुन्छ। **Silence manual, time-bounded suppression** हो जुन specific known event को response मा human operator द्वारा create गरिन्छ। यसले matcher प्रयोग गरेर alert label match गर्छ र defined duration को लागि सबै matching alert suppress गर्छ। Silence यसको लागि प्रयोग गर्नुहोस्: (१) **Planned maintenance window** — disk replace, service restart, वा major change deploy गर्दा, expected disruption को समयमा affected component बाट alert page नगरोस् भनी maintenance window cover गर्ने silence create गर्नुहोस्। (२) **Deploy को समयमा known flapping service** — canary deploy ले traffic shift हुँदा intermittent 5xx error cause गरिरहेको छ भने, controlled transition को समयमा noise avoid गर्न 30 minute को लागि canary pod को `HighErrorRate` silence गर्नुहोस्। (३) **Active incident investigation** — incident work गरिरहँदा, on-call ले root cause मा focus गर्दा noise कम राख्न child symptom alert silence गर्नुहोस्। Silence explicit expiry सहित create गरिन्छ — यिनीहरू सधैं end हुन्छन्, जुन intentional हो। Alertmanager मा permanent silence create गर्न सकिँदैन (permanent suppression चाहिएमा, inhibition rule प्रयोग गर्नुहोस्)। **Silence को risk**: सबैभन्दा खतरनाक failure mode त्यो silence हो जुन यसको लागि create गरिएको event भन्दा लामो हुन्छ। Engineer ले 30 minute मात्र लाग्ने maintenance window को लागि 4-hour silence create गर्छ, early expire गर्न बिर्सन्छ, र silence period मा 2 घन्टा पछि real outage हुन्छ। Alert fire हुन्छ तर notification पठाइँदैन। यो risk यसरी mitigate गरिन्छ: (क) सधैं person को नाम र event description सहित detailed `--comment` add गर्नुहोस्; (ख) shortest reasonable duration प्रयोग गर्नुहोस्; (ग) प्रत्येक on-call shift को सुरुमा active silence review गर्नुहोस्; (घ) कहिल्यै `severity=critical` जस्तो overly broad matcher match गर्ने silence create नगर्नुहोस् — सधैं specific `alertname` र `instance` मा scope गर्नुहोस्। **Inhibition rule configuration-driven, automatic suppression** हो जुन `alertmanager.yml` मा define गरिन्छ। यसले `equal` मा listed label value को लागि `source_matchers` alert fire भइरहेको बेला `target_matchers` alert suppress गर्छ। Inhibition rule यसको लागि प्रयोग गर्नुहोस्: (१) **Structural dependency** — `NodeDown` fire भएमा, एउटै instance को `HighMemoryUsage`, `DiskWriteError`, र `HighCPU` suppress गर्नुहोस् किनभने तिनीहरू cause होइन symptom हुन्। (२) **Cluster-level cascade** — `ClusterNetworkPartition` alert fire भएमा, individual pod communication alert suppress गर्नुहोस् किनभने partition heal हुँदा सबै resolve हुन्छन्। **Inhibition rule को risk**: many unrelated alert सँग label share गर्ने over-broad inhibition rule ले accidentally critical notification suppress गर्न सक्छ। Always `target_matchers` मा जति सक्यो label constraint add गर्नुहोस् र narrow `equal` list prefer गर्नुहोस् (`equal: [cluster]` होइन `equal: [instance]`)।",
        jp: "サイレンスと抑制ルールはどちらもアラート通知を抑制しますが、まったく異なる原則で動作し、異なる運用ユースケースに対応します。間違ったツールを選択すると実際の運用リスクが生じます。**サイレンスは手動の時間制限付き抑制**で、特定の既知のイベントに応じて人間のオペレーターが作成します。マッチャーを使用してアラートラベルに一致し、定義された期間のすべての一致するアラートを抑制します。サイレンスの使用場面：(1) **計画されたメンテナンスウィンドウ** — ディスクの交換・サービスの再起動・大規模な変更のデプロイ時に、予想される停止中に影響を受けるコンポーネントからのアラートがページングしないようにメンテナンスウィンドウをカバーするサイレンスを作成する。(2) **デプロイ中の既知のフラッピングサービス** — カナリアデプロイがトラフィックシフト中に断続的な 5xx エラーを引き起こしている場合、制御された移行中のノイズを避けるためにカナリアポッドの `HighErrorRate` を 30 分間サイレンスにする。(3) **アクティブなインシデント調査** — インシデントに対応中は、オンコールが根本原因に集中できるようにサブ症状アラートをサイレンスにしてノイズを減らす。サイレンスは明示的な有効期限付きで作成されます — 常に終了し、これは意図的です。Alertmanager では永続的なサイレンスを作成できません（永続的な抑制が必要な場合は抑制ルールを使用する）。**サイレンスのリスク**：最も危険な障害モードは、作成されたイベントよりも長続きするサイレンスです。エンジニアが 30 分で終わるメンテナンスウィンドウのために 4 時間のサイレンスを作成し、早期に期限切れにするのを忘れ、サイレンス期間の 2 時間後に本当の停止が発生します。アラートは発火しますが通知は送信されません。このリスクは：(a) 常に人物の名前とイベントの説明を含む詳細な `--comment` を追加する；(b) 最短の合理的な期間を使用する；(c) すべてのオンコールシフトの開始時にアクティブなサイレンスを確認する；(d) `severity=critical` のような過度に広いマッチャーに一致するサイレンスを作成しない — 常に特定の `alertname` と `instance` にスコープする、によって軽減されます。**抑制ルールは設定駆動の自動抑制**で `alertmanager.yml` に定義されます。`equal` にリストされたラベル値の `source_matchers` アラートが発火しているときに `target_matchers` アラートを抑制します。抑制ルールの使用場面：(1) **構造的依存関係** — `NodeDown` が発火した場合、それらは原因ではなく症状なので同じインスタンスの `HighMemoryUsage`・`DiskWriteError`・`HighCPU` を抑制する。(2) **クラスターレベルのカスケード** — `ClusterNetworkPartition` アラートが発火した場合、パーティションが回復するとすべて解決されるため個々のポッド通信アラートを抑制する。**抑制ルールのリスク**：多くの無関係なアラートとラベルを共有する過度に広い抑制ルールは誤って重要な通知を抑制することがあります。`target_matchers` にできるだけ多くのラベル制約を追加し、狭い `equal` リストを優先してください（`equal: [cluster]` ではなく `equal: [instance]`）。",
      },
      tag: {
        en: "silences vs inhibition",
        np: "silences vs inhibition",
        jp: "サイレンス対抑制",
      },
    },
  ],
};
