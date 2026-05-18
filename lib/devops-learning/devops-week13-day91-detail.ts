import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**SLO engineering** is the discipline of translating abstract reliability goals into measurable, actionable engineering constraints. It begins with the **SLI** (Service Level Indicator) — a precise, quantitative measure of some aspect of service behavior. The three canonical SLIs are: **availability** (the fraction of valid requests that return a successful response — typically non-5xx HTTP status codes — over a given window: `successful_requests / total_requests`), **latency** (the fraction of requests that complete within a threshold, e.g. \"what percentage of requests finish in under 200ms\"), and **throughput** (the rate of successful request processing, measured in requests per second). A well-chosen SLI must be measurable without ambiguity, causally linked to user experience, and stable enough to set a meaningful target against. An **SLO** (Service Level Objective) is a target value or range for an SLI, expressed over a rolling time window. A production-grade SLO looks like: \"99.9% of HTTP requests to the `/checkout` endpoint return a 2xx or 3xx status code within 200ms, measured over any rolling 30-day window.\" The rolling window is critical — it means the SLO is continuously evaluated, not reset monthly. An **SLA** (Service Level Agreement) is a contractual promise made to external customers or stakeholders, enforceable with financial penalties or credits. SLAs are deliberately weaker than SLOs by design: if your SLO is 99.9%, your SLA might be 99.5%. The gap is the buffer — it gives the engineering team time to detect a breach, respond, and recover before it becomes a contractual violation. The **error budget** is the operational consequence of an SLO: `error budget = 100% - SLO`. For a 99.9% availability SLO, the error budget is 0.1% — which translates to: 0.1% × 30 days × 24 hours × 60 minutes = **43.2 minutes of allowed downtime per month**. Error budgets transform reliability from a vague aspiration into a shared engineering resource. When the budget is healthy (most of it unspent), the team can move fast: ship features, take risks, experiment with rollouts. When the budget is burning fast or nearly exhausted, reliability work takes precedence — no new features until the system is stable. This creates a rational, data-driven negotiation between product (who wants velocity) and engineering (who wants stability). Multi-window, multi-burn-rate alerting — the pattern described in the Google SRE Workbook — solves the fundamental problem with naive threshold alerts. **Burn rate** is the ratio of observed error rate to the SLO error budget rate: `burn_rate = observed_error_rate / slo_error_rate`. A burn rate of 1.0 means you are consuming your error budget at exactly the rate that would exhaust it in 30 days. A burn rate of 14.4 means you will exhaust the budget in 2 hours (`30 days / 14.4 = ~2 hours`). A burn rate of 6 means exhaustion in 5 days. A burn rate of 3 means exhaustion in 10 days. These thresholds map directly to alert severity: 14.4x → page immediately (critical); 6x → Slack warning; 3x → ticket/info. The two-window structure (e.g. a 1-hour window AND a 5-minute window, both must simultaneously exceed the burn rate threshold) is essential: the long window confirms the burn is sustained — not a 30-second spike — and prevents false positives; the short window ensures the alert fires quickly when the burn rate is genuinely high and sustained.",
    np: "**SLO engineering** भनेको abstract reliability goal लाई measurable, actionable engineering constraint मा translate गर्ने discipline हो। यो **SLI** (Service Level Indicator) बाट सुरु हुन्छ — service behavior को कुनै पक्षको precise, quantitative measure। तीनवटा canonical SLI यस्ता छन्: **availability** (दिइएको window मा successful response return गर्ने valid request को fraction — सामान्यतया non-5xx HTTP status code: `successful_requests / total_requests`), **latency** (threshold भित्र complete हुने request को fraction, जस्तै \"200ms भित्र कति % request सकिन्छ\"), र **throughput** (requests per second मा मापिएको successful request processing को rate)। राम्रोसँग छानिएको SLI ambiguity बिना measurable हुनुपर्छ, user experience सँग causally linked हुनुपर्छ, र meaningful target set गर्न काफी stable हुनुपर्छ। **SLO** (Service Level Objective) rolling time window मा SLI को target value वा range हो। Production-grade SLO यस्तो देखिन्छ: \"rolling 30-day window मा `/checkout` endpoint मा 99.9% HTTP request ले 200ms भित्र 2xx वा 3xx status code return गर्छ।\" Rolling window critical छ — यसको अर्थ SLO continuously evaluate हुन्छ, monthly reset हुँदैन। **SLA** (Service Level Agreement) बाहिरी customer वा stakeholder सँग गरिएको contractual promise हो, financial penalty वा credit सँग enforceable। SLA लाई deliberately design गरेर SLO भन्दा कमजोर बनाइन्छ: तपाईंको SLO 99.9% भए, SLA 99.5% हुन सक्छ। Gap buffer हो — यसले engineering team लाई breach detect गर्न, respond गर्न, र contractual violation हुनु अघि recover गर्न समय दिन्छ। **Error budget** SLO को operational consequence हो: `error budget = 100% - SLO`। 99.9% availability SLO को लागि, error budget 0.1% छ — जुन translate हुन्छ: 0.1% × 30 days × 24 hours × 60 minutes = **43.2 minutes of allowed downtime per month**। Error budget ले reliability लाई vague aspiration बाट shared engineering resource मा transform गर्छ। Budget healthy हुँदा (धेरैजसो unspent), team तेज गति लिन सक्छ: feature ship गर्नुहोस्, risk लिनुहोस्, rollout experiment गर्नुहोस्। Budget तेज burn हुँदा वा लगभग exhausted हुँदा, reliability काम priority लिन्छ। Multi-window, multi-burn-rate alerting — Google SRE Workbook मा describe गरिएको pattern — naive threshold alert को fundamental problem solve गर्छ। **Burn rate** observed error rate र SLO error budget rate को ratio हो: `burn_rate = observed_error_rate / slo_error_rate`। Burn rate 1.0 को अर्थ 30 दिनमा exhaust हुने rate मा error budget consume हुँदैछ। Burn rate 14.4 को अर्थ 2 घन्टामा budget exhaust हुन्छ। Burn rate 6 को अर्थ 5 दिनमा exhaustion। Burn rate 3 को अर्थ 10 दिनमा exhaustion। यी threshold ले directly alert severity मा map गर्छन्: 14.4x → immediately page (critical); 6x → Slack warning; 3x → ticket/info। Two-window structure (जस्तै 1-hour window र 5-minute window, दुवैले simultaneously burn rate threshold exceed गर्नुपर्छ) essential छ: long window ले burn sustained छ confirm गर्छ — 30-second spike होइन — र false positive prevent गर्छ; short window ले burn rate genuinely high र sustained हुँदा alert छिट्टै fire हुन्छ ensure गर्छ।",
    jp: "**SLO エンジニアリング**とは、抽象的な信頼性目標を測定可能で実行可能なエンジニアリング制約に変換する規律です。これは **SLI**（Service Level Indicator） — サービス動作のある側面の正確な定量的測定 — から始まります。3 つの標準的な SLI は：**可用性**（特定のウィンドウで成功したレスポンスを返す有効なリクエストの割合 — 通常は非 5xx HTTP ステータスコード：`successful_requests / total_requests`）、**レイテンシー**（閾値内に完了するリクエストの割合、例：「200ms 以内に完了するリクエストの何 %」）、**スループット**（リクエスト/秒で測定した成功したリクエスト処理のレート）です。適切に選ばれた SLI は曖昧さなく測定可能で、ユーザーエクスペリエンスと因果関係があり、有意義なターゲットを設定するのに十分安定している必要があります。**SLO**（Service Level Objective）はローリングタイムウィンドウで表現された SLI のターゲット値または範囲です。本番品質の SLO はこのようなものです：「`/checkout` エンドポイントへの HTTP リクエストの 99.9% が、任意のローリング 30 日間ウィンドウで 200ms 以内に 2xx または 3xx ステータスコードを返す。」ローリングウィンドウは重要です — SLO は継続的に評価され、毎月リセットされないことを意味します。**SLA**（Service Level Agreement）は外部顧客やステークホルダーに対して行われる契約上の約束であり、財務的なペナルティやクレジットで強制可能です。SLA は設計上意図的に SLO より弱くされています：SLO が 99.9% の場合、SLA は 99.5% かもしれません。ギャップはバッファです — エンジニアリングチームが契約違反になる前に検出・対応・回復する時間を与えます。**エラーバジェット**は SLO の運用上の結果です：`error budget = 100% - SLO`。99.9% 可用性 SLO では、エラーバジェットは 0.1% です — これは：0.1% × 30 日 × 24 時間 × 60 分 = **月あたり 43.2 分の許容ダウンタイム**に変換されます。エラーバジェットは信頼性を漠然とした願望から共有エンジニアリングリソースに変換します。バジェットが健全な時（大部分が未消費）、チームは速く動けます：機能を出荷し、リスクを取り、ロールアウトを実験する。バジェットが急速に消費されているか、ほぼ枯渇している時、信頼性の作業が優先されます。マルチウィンドウ・マルチバーンレートアラート — Google SRE ワークブックで説明されているパターン — は単純な閾値アラートの根本的な問題を解決します。**バーンレート**は観測されたエラーレートと SLO エラーバジェットレートの比率です：`burn_rate = observed_error_rate / slo_error_rate`。バーンレート 1.0 は 30 日で枯渇するレートでエラーバジェットを消費していることを意味します。バーンレート 14.4 は 2 時間でバジェットが枯渇することを意味します。バーンレート 6 は 5 日で枯渇。バーンレート 3 は 10 日で枯渇。これらの閾値はアラートの重大度に直接マップします：14.4x → 即座にページ（クリティカル）；6x → Slack 警告；3x → チケット/情報。2 ウィンドウ構造（例：1 時間ウィンドウと 5 分ウィンドウ、両方が同時にバーンレート閾値を超える必要がある）は不可欠です：長いウィンドウはバーンが持続していることを確認し — 30 秒のスパイクではなく — 誤報を防ぎます；短いウィンドウはバーンレートが真に高く持続的な場合にアラートが素早く発火することを保証します。",
  } as const,
  o2: {
    en: "**On-call** is not a passive availability requirement — it is an active, structured system for ensuring that production incidents are detected, owned, and resolved as quickly as possible, while preserving engineer well-being and institutional knowledge. An on-call **rotation** divides the coverage responsibility among team members: a **primary on-call** owns all incoming alerts during their shift and is expected to acknowledge within a defined SLA (typically 5–15 minutes); a **secondary on-call** backs up the primary — if the primary is unavailable or doesn't acknowledge, the alert escalates automatically. Rotation schedules should be fair: equitable distribution of weekends, holidays, and high-traffic periods. **Handoff procedures** are critical: at the end of each shift, the outgoing on-call engineer briefs the incoming engineer on any open issues, ongoing investigations, systems in a degraded state, and recent changes that may cause instability. Without a proper handoff, incidents that started in one shift spill silently into the next. **Escalation policies** define the automated path an unacknowledged alert follows: alert fires → notifies primary on-call via PagerDuty/OpsGenie → if unacknowledged in 15 minutes, escalates to secondary on-call → if still unacknowledged in 30 minutes, escalates to the engineering manager. Escalation policies are configured in your incident management platform (PagerDuty, OpsGenie, VictorOps) and should be tested quarterly. **Incident severity levels** provide a shared vocabulary for triage: **SEV1** — total service outage; all users are impacted; requires immediate all-hands response; stakeholder communication every 15 minutes. **SEV2** — significant degradation; a major feature is unavailable or severely degraded; most users are impacted. **SEV3** — partial degradation; a subset of users or non-critical features are impacted; business hours response acceptable. **SEV4** — minor issue; cosmetic or low-impact; scheduled fix is acceptable. The **incident response lifecycle** has six phases: (1) **Detect** — an alert fires, or a user report comes in. MTTD (mean time to detect) is the key metric here; good alerting minimizes it. (2) **Acknowledge** — someone takes ownership. The first action is to declare an incident channel (e.g. `#inc-2026-05-18-checkout-down`) and assign an Incident Commander. (3) **Investigate** — use your observability tools: metrics (what is the error rate, what changed?), logs (what are the error messages?), traces (which service in the call chain is failing?). (4) **Mitigate** — stop the bleeding before fixing the root cause. Common mitigations: rollback the last deploy, scale up the affected service, enable a feature flag to disable a broken feature, redirect traffic away from a failing region. (5) **Resolve** — fix the root cause, not just the symptom. Verify that the SLO metrics have recovered. (6) **Postmortem** — a written blameless analysis of what happened, conducted within 48–72 hours of resolution. **Runbooks** are the operational glue between alerting and incident response. A runbook is a documented, step-by-step procedure written for a specific alert or failure scenario. It must be actionable in seconds — someone woken at 3am should be able to follow it without prior context. A runbook linked directly from the alert annotation (`runbook_url` label) is reachable in one click; a runbook that exists only in a wiki no one can find is useless during an incident. **Blameless postmortems** are the mechanism for organizational learning. The goal is never to identify who made a mistake, but to understand the systemic conditions that made the mistake possible. Techniques: the **5 Whys** (repeatedly ask \"why\" to drill from symptom to root cause), **timeline reconstruction** (minute-by-minute record of what happened and who did what — helps identify detection gaps and cascading effects), **action items** (concrete, time-bound tasks with assigned owners — not vague commitments). A good postmortem produces 3–7 action items, not 20. Follow-up on action items is what distinguishes a learning organization from one that writes postmortems and ignores them.",
    np: "**On-call** passive availability requirement होइन — यो production incident detect, own, र जति सक्यो छिट्टो resolve भएको सुनिश्चित गर्न, engineer well-being र institutional knowledge preserve गर्दै, active, structured system हो। On-call **rotation** ले coverage responsibility team member बीच बाँड्छ: **primary on-call** ले आफ्नो shift मा सबै incoming alert own गर्छ र defined SLA (सामान्यतया 5–15 minute) भित्र acknowledge गर्न expected हुन्छ; **secondary on-call** ले primary backup गर्छ — primary unavailable वा acknowledge नगरेमा, alert automatically escalate हुन्छ। Rotation schedule fair हुनुपर्छ: weekend, holiday, र high-traffic period को equitable distribution। **Handoff procedure** critical छ: प्रत्येक shift को अन्तमा, outgoing on-call engineer ले incoming engineer लाई कुनै पनि open issue, ongoing investigation, degraded state मा system, र instability ल्याउन सक्ने recent change को बारेमा brief गर्छ। Proper handoff बिना, एउटा shift मा सुरु भएको incident अर्को shift मा silently spill हुन्छ। **Escalation policy** ले unacknowledged alert follow गर्ने automated path define गर्छ: alert fires → PagerDuty/OpsGenie मार्फत primary on-call लाई notify → 15 minute मा acknowledge नभएमा, secondary on-call मा escalate → 30 minute मा पनि acknowledge नभएमा, engineering manager मा escalate। Escalation policy लाई incident management platform (PagerDuty, OpsGenie, VictorOps) मा configure गरिन्छ र quarterly test गर्नुपर्छ। **Incident severity level** ले triage को लागि shared vocabulary provide गर्छ: **SEV1** — total service outage; सबै user impact; immediate all-hands response; 15 minute प्रत्येक stakeholder communication। **SEV2** — significant degradation; major feature unavailable वा severely degraded; धेरैजसो user impact। **SEV3** — partial degradation; user को subset वा non-critical feature impact; business hours response acceptable। **SEV4** — minor issue; cosmetic वा low-impact; scheduled fix acceptable। **Incident response lifecycle** का छ phase छन्: (१) **Detect** — alert fires, वा user report आउँछ। MTTD (mean time to detect) यहाँ key metric हो; राम्रो alerting यसलाई minimize गर्छ। (२) **Acknowledge** — कसैले ownership लिन्छ। पहिलो action incident channel declare गर्नु हो (जस्तै `#inc-2026-05-18-checkout-down`) र Incident Commander assign गर्नु। (३) **Investigate** — observability tool प्रयोग गर्नुहोस्: metric (error rate के हो, के बदलियो?), log (error message के हो?), trace (call chain मा कुन service fail भयो?)। (४) **Mitigate** — root cause fix गर्नु अघि bleeding रोक्नुहोस्। Common mitigation: last deploy rollback, affected service scale up, broken feature disable गर्न feature flag enable, failing region बाट traffic redirect। (५) **Resolve** — symptom मात्र होइन, root cause fix गर्नुहोस्। SLO metric recover भएको verify गर्नुहोस्। (६) **Postmortem** — resolution को 48–72 घन्टा भित्र conduct गरिएको के भयो को written blameless analysis। **Runbook** alerting र incident response बीचको operational glue हो। Runbook specific alert वा failure scenario को लागि लेखिएको documented, step-by-step procedure हो। यो seconds मा actionable हुनुपर्छ — 3am मा जगाइएको कोहीले prior context बिना follow गर्न सक्नुपर्छ। Alert annotation (`runbook_url` label) बाट directly link गरिएको runbook एक click मा reachable छ; कसैले पनि find गर्न नसक्ने wiki मा मात्र exist गर्ने runbook incident को समयमा useless छ। **Blameless postmortem** organizational learning को mechanism हो। Goal कहिल्यै mistake गर्ने को identify गर्नु होइन, बरु mistake possible बनाउने systemic condition बुझ्नु हो। Technique: **5 Whys** (symptom बाट root cause सम्म drill गर्न repeatedly \"किन\" सोध्नुहोस्), **timeline reconstruction** (के भयो र कसले के गर्यो को minute-by-minute record — detection gap र cascading effect identify गर्न help गर्छ), **action item** (assigned owner र due date सहित concrete, time-bound task)। राम्रो postmortem ले 20 होइन, 3–7 action item produce गर्छ।",
    jp: "**オンコール**は受動的な可用性要件ではありません — それは本番インシデントをできるだけ早く検出・所有・解決することを保証するためのアクティブで構造化されたシステムであり、エンジニアの健康と組織の知識を保護します。オンコール**ローテーション**はカバレッジ責任をチームメンバー間で分割します：**プライマリオンコール**はシフト中のすべての受信アラートを所有し、定義された SLA（通常 5〜15 分）内に応答することが期待されます；**セカンダリオンコール**はプライマリをバックアップします — プライマリが利用できないか応答しない場合、アラートは自動的にエスカレートします。ローテーションスケジュールは公平であるべきです：週末・休日・高トラフィック期間の公平な分配。**ハンドオフ手順**は重要です：各シフトの終わりに、退出するオンコールエンジニアは着任するエンジニアに未解決の問題・進行中の調査・劣化状態のシステム・不安定性を引き起こす可能性のある最近の変更について説明します。適切なハンドオフなしでは、あるシフトで始まったインシデントが次のシフトに静かに持ち越されます。**エスカレーションポリシー**は未応答のアラートが辿る自動化されたパスを定義します：アラート発火 → PagerDuty/OpsGenie 経由でプライマリオンコールに通知 → 15 分以内に応答がない場合、セカンダリオンコールにエスカレート → 30 分以内にもまだ応答がない場合、エンジニアリングマネージャーにエスカレート。エスカレーションポリシーはインシデント管理プラットフォーム（PagerDuty・OpsGenie・VictorOps）で設定され、四半期ごとにテストするべきです。**インシデント重大度レベル**はトリアージのための共有語彙を提供します：**SEV1** — 完全なサービス停止；すべてのユーザーが影響を受ける；即座の全員対応が必要；15 分ごとのステークホルダーへのコミュニケーション。**SEV2** — 重大な劣化；主要機能が利用不可または著しく劣化；ほとんどのユーザーが影響を受ける。**SEV3** — 部分的な劣化；ユーザーのサブセットまたは非重要機能が影響を受ける；営業時間内の対応が許容される。**SEV4** — 軽微な問題；表面的または低影響；予定された修正が許容される。**インシデントレスポンスライフサイクル**には 6 つのフェーズがあります：(1) **検出** — アラートが発火するか、ユーザーレポートが届く。MTTD（平均検出時間）がここでの主要メトリクスです；優れたアラートがこれを最小化します。(2) **承認** — 誰かが所有権を取る。最初のアクションはインシデントチャネルを宣言し（例：`#inc-2026-05-18-checkout-down`）、インシデントコマンダーを割り当てることです。(3) **調査** — オブザーバビリティツールを使用する：メトリクス（エラーレートは何か、何が変わったか？）・ログ（エラーメッセージは何か？）・トレース（コールチェーンのどのサービスが失敗しているか？）。(4) **軽減** — 根本原因を修正する前に出血を止める。一般的な軽減策：最後のデプロイのロールバック・影響を受けるサービスのスケールアップ・壊れた機能を無効化するためのフィーチャーフラグの有効化・障害のあるリージョンからのトラフィックのリダイレクト。(5) **解決** — 症状だけでなく根本原因を修正する。SLO メトリクスが回復したことを確認する。(6) **ポストモーテム** — 解決から 48〜72 時間以内に実施される、何が起きたかの書面によるブレームレス分析。**ランブック**はアラートとインシデントレスポンスの間の運用的な接着剤です。ランブックは特定のアラートまたは障害シナリオのために書かれた文書化されたステップバイステップの手順です。数秒で実行可能である必要があります — 午前 3 時に起こされた人が事前の文脈なしで従えるべきです。アラートアノテーション（`runbook_url` ラベル）から直接リンクされたランブックはワンクリックで到達できます；誰も見つけられない Wiki にのみ存在するランブックはインシデント中に役に立ちません。**ブレームレスポストモーテム**は組織学習のメカニズムです。目標は誰が間違いを犯したかを特定することではなく、間違いを可能にした体系的な状況を理解することです。技術：**5 つの Why**（症状から根本原因までドリルするために「なぜ」を繰り返し問う）・**タイムライン再構築**（何が起きたか、誰が何をしたかの分単位の記録 — 検出のギャップとカスケード効果を特定するのに役立つ）・**アクションアイテム**（担当者と期日が割り当てられた具体的な期限付きタスク）。良いポストモーテムは 20 ではなく 3〜7 のアクションアイテムを生み出します。",
  } as const,
};

export const DEVOPS_DAY_91_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "SLO framework — error budgets, burn rates & multi-window alerts",
        np: "SLO framework — error budget, burn rate र multi-window alert",
        jp: "SLO フレームワーク — エラーバジェット・バーンレート・マルチウィンドウアラート",
      },
      blocks: [
        { type: "diagram", id: "devops-slo-error-budget" },
        {
          type: "table",
          caption: {
            en: "SLO availability tiers — error budgets per month, week, and year with recommended use cases",
            np: "SLO availability tier — महिना, हप्ता, र वर्ष अनुसार error budget र recommended use case",
            jp: "SLO 可用性ティア — 月・週・年ごとのエラーバジェットと推奨ユースケース",
          },
          headers: [
            { en: "SLO", np: "SLO", jp: "SLO" },
            {
              en: "Monthly downtime budget",
              np: "Monthly downtime budget",
              jp: "月次ダウンタイムバジェット",
            },
            {
              en: "Weekly downtime budget",
              np: "Weekly downtime budget",
              jp: "週次ダウンタイムバジェット",
            },
            {
              en: "Yearly downtime budget",
              np: "Yearly downtime budget",
              jp: "年次ダウンタイムバジェット",
            },
            {
              en: "Suitable for",
              np: "को लागि उपयुक्त",
              jp: "適している用途",
            },
          ],
          rows: [
            [
              {
                en: "99% (\"two nines\")",
                np: "99% (\"two nines\")",
                jp: "99%（ツーナイン）",
              },
              {
                en: "7.2 hours / month",
                np: "7.2 घन्टा / महिना",
                jp: "7.2 時間 / 月",
              },
              {
                en: "1.68 hours / week",
                np: "1.68 घन्टा / हप्ता",
                jp: "1.68 時間 / 週",
              },
              {
                en: "3.65 days / year",
                np: "3.65 दिन / वर्ष",
                jp: "3.65 日 / 年",
              },
              {
                en: "Internal tools / batch processing systems",
                np: "Internal tool / batch processing system",
                jp: "社内ツール / バッチ処理システム",
              },
            ],
            [
              {
                en: "99.5%",
                np: "99.5%",
                jp: "99.5%",
              },
              {
                en: "3.6 hours / month",
                np: "3.6 घन्टा / महिना",
                jp: "3.6 時間 / 月",
              },
              {
                en: "50 minutes / week",
                np: "50 मिनेट / हप्ता",
                jp: "50 分 / 週",
              },
              {
                en: "1.83 days / year",
                np: "1.83 दिन / वर्ष",
                jp: "1.83 日 / 年",
              },
              {
                en: "Non-critical business services (dashboards, reporting)",
                np: "Non-critical business service (dashboard, reporting)",
                jp: "非重要ビジネスサービス（ダッシュボード・レポーティング）",
              },
            ],
            [
              {
                en: "99.9% (\"three nines\")",
                np: "99.9% (\"three nines\")",
                jp: "99.9%（スリーナイン）",
              },
              {
                en: "43.2 min / month",
                np: "43.2 मिनेट / महिना",
                jp: "43.2 分 / 月",
              },
              {
                en: "10.1 min / week",
                np: "10.1 मिनेट / हप्ता",
                jp: "10.1 分 / 週",
              },
              {
                en: "8.7 hours / year",
                np: "8.7 घन्टा / वर्ष",
                jp: "8.7 時間 / 年",
              },
              {
                en: "Standard SaaS services — the baseline for most web APIs",
                np: "Standard SaaS service — धेरैजसो web API को baseline",
                jp: "標準 SaaS サービス — ほとんどの Web API のベースライン",
              },
            ],
            [
              {
                en: "99.95%",
                np: "99.95%",
                jp: "99.95%",
              },
              {
                en: "21.6 min / month",
                np: "21.6 मिनेट / महिना",
                jp: "21.6 分 / 月",
              },
              {
                en: "5 min / week",
                np: "5 मिनेट / हप्ता",
                jp: "5 分 / 週",
              },
              {
                en: "4.38 hours / year",
                np: "4.38 घन्टा / वर्ष",
                jp: "4.38 時間 / 年",
              },
              {
                en: "Business-critical services (order management, user auth)",
                np: "Business-critical service (order management, user auth)",
                jp: "ビジネスクリティカルサービス（注文管理・ユーザー認証）",
              },
            ],
            [
              {
                en: "99.99% (\"four nines\")",
                np: "99.99% (\"four nines\")",
                jp: "99.99%（フォーナイン）",
              },
              {
                en: "4.32 min / month",
                np: "4.32 मिनेट / महिना",
                jp: "4.32 分 / 月",
              },
              {
                en: "1 min / week",
                np: "1 मिनेट / हप्ता",
                jp: "1 分 / 週",
              },
              {
                en: "52.6 min / year",
                np: "52.6 मिनेट / वर्ष",
                jp: "52.6 分 / 年",
              },
              {
                en: "Payment processing / authentication services",
                np: "Payment processing / authentication service",
                jp: "決済処理 / 認証サービス",
              },
            ],
            [
              {
                en: "99.999% (\"five nines\")",
                np: "99.999% (\"five nines\")",
                jp: "99.999%（ファイブナイン）",
              },
              {
                en: "25.9 sec / month",
                np: "25.9 सेकेन्ड / महिना",
                jp: "25.9 秒 / 月",
              },
              {
                en: "6 sec / week",
                np: "6 सेकेन्ड / हप्ता",
                jp: "6 秒 / 週",
              },
              {
                en: "5.26 min / year",
                np: "5.26 मिनेट / वर्ष",
                jp: "5.26 分 / 年",
              },
              {
                en: "Tier-1 infrastructure (DNS, load balancers, identity providers)",
                np: "Tier-1 infrastructure (DNS, load balancer, identity provider)",
                jp: "Tier-1 インフラ（DNS・ロードバランサー・ID プロバイダー）",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Multi-burn-rate alerts, runbook template & incident response",
        np: "Multi-burn-rate alert, runbook template र incident response",
        jp: "マルチバーンレートアラート・ランブックテンプレート・インシデントレスポンス",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Prometheus multi-window multi-burn-rate SLO alerts, runbook template, PagerDuty escalation policy & blameless postmortem template",
            np: "Prometheus multi-window multi-burn-rate SLO alert, runbook template, PagerDuty escalation policy र blameless postmortem template",
            jp: "Prometheus マルチウィンドウ・マルチバーンレート SLO アラート・ランブックテンプレート・PagerDuty エスカレーションポリシー・ブレームレスポストモーテムテンプレート",
          },
          code: `# ═══════════════════════════════════════════════════════════════════════
# PART 1: Prometheus Multi-Window Multi-Burn-Rate Alerting Rules
#         for a 99.9% availability SLO (error budget = 0.1%)
#
# Burn rate interpretation:
#   14.4x → budget exhausted in 2 hours   → CRITICAL / page immediately
#    6.0x → budget exhausted in 5 days    → WARNING  / Slack alert
#    3.0x → budget exhausted in 10 days   → INFO     / ticket
#
# Formula: burn_rate = observed_error_rate / slo_error_rate
#   For 99.9% SLO: slo_error_rate = 0.001 (0.1%)
#   At 14.4x: observed_error_rate = 14.4 × 0.001 = 0.0144 (1.44%)
# ═══════════════════════════════════════════════════════════════════════

groups:
  - name: slo-availability-99.9
    rules:

      # ── CRITICAL: 14.4x burn rate — budget exhausted in ~2 hours ──────
      # Both windows must fire simultaneously:
      #   Long window  (1h): confirms the burn is sustained, not a spike
      #   Short window (5m): ensures fast detection when burn is real
      - alert: ErrorBudgetBurnRateCritical
        expr: |
          (
            rate(http_requests_total{status_code=~"5.."}[1h])
            /
            rate(http_requests_total[1h])
          ) > (14.4 * 0.001)
          and
          (
            rate(http_requests_total{status_code=~"5.."}[5m])
            /
            rate(http_requests_total[5m])
          ) > (14.4 * 0.001)
        for: 2m
        labels:
          severity: critical
          slo: "99.9"
          burn_rate: "14.4x"
        annotations:
          summary: "SLO CRITICAL: error budget burning at 14.4x — exhausted in ~2h"
          description: >
            Service {{ $labels.job }} error rate is {{ $value | humanizePercentage }}
            (threshold 1.44%). At this rate the 30-day error budget will be
            exhausted in approximately 2 hours. Immediate action required.
          runbook_url: "https://runbooks.internal/slo/high-error-budget-burn-rate"
          dashboard_url: "https://grafana.internal/d/slo-overview"

      # ── WARNING: 6x burn rate — budget exhausted in ~5 days ───────────
      # Long window: 6h (filters noise), Short window: 30m (detects fast)
      - alert: ErrorBudgetBurnRateWarning
        expr: |
          (
            rate(http_requests_total{status_code=~"5.."}[6h])
            /
            rate(http_requests_total[6h])
          ) > (6 * 0.001)
          and
          (
            rate(http_requests_total{status_code=~"5.."}[30m])
            /
            rate(http_requests_total[30m])
          ) > (6 * 0.001)
        for: 15m
        labels:
          severity: warning
          slo: "99.9"
          burn_rate: "6x"
        annotations:
          summary: "SLO WARNING: error budget burning at 6x — exhausted in ~5 days"
          description: >
            Service {{ $labels.job }} error rate is {{ $value | humanizePercentage }}.
            At this burn rate the monthly error budget will be exhausted in ~5 days.
            Investigate and resolve within business hours.
          runbook_url: "https://runbooks.internal/slo/high-error-budget-burn-rate"

      # ── INFO: 3x burn rate — budget exhausted in ~10 days ─────────────
      # Long window: 1d, Short window: 3h
      - alert: ErrorBudgetBurnRateInfo
        expr: |
          (
            rate(http_requests_total{status_code=~"5.."}[1d])
            /
            rate(http_requests_total[1d])
          ) > (3 * 0.001)
          and
          (
            rate(http_requests_total{status_code=~"5.."}[3h])
            /
            rate(http_requests_total[3h])
          ) > (3 * 0.001)
        for: 1h
        labels:
          severity: info
          slo: "99.9"
          burn_rate: "3x"
        annotations:
          summary: "SLO INFO: error budget burning at 3x — file a reliability ticket"
          description: >
            Service {{ $labels.job }} is burning the error budget at 3x the
            sustainable rate. Budget will exhaust in ~10 days. File a ticket and
            schedule investigation.
          runbook_url: "https://runbooks.internal/slo/high-error-budget-burn-rate"

      # ── Error budget remaining (recording rule — query in Grafana) ─────
      - record: slo:error_budget_remaining:ratio_rate30d
        expr: |
          1 - (
            sum(increase(http_requests_total{status_code=~"5.."}[30d]))
            /
            sum(increase(http_requests_total[30d]))
          ) / 0.001

# ═══════════════════════════════════════════════════════════════════════
# PART 2: Runbook Template — runbooks/high-error-budget-burn-rate.md
#
# ## Alert: HighErrorBudgetBurnRate
#
# ### Summary
# This alert fires when the HTTP error rate is burning the 30-day error
# budget significantly faster than the sustainable rate. The SLO is 99.9%
# availability (error budget = 0.1% = 43.2 min/month of allowed errors).
#
# ### SLO / SLI Context
# - SLI: rate(http_requests_total{status_code=~"5.."}[w]) /
#         rate(http_requests_total[w])
# - SLO: 99.9% of requests return non-5xx over any rolling 30d window
# - Error budget: 0.1% — 43.2 min/month — 10.1 min/week
# - Burn rate 14.4x: budget exhausted in 2h → CRITICAL
# - Burn rate 6x:    budget exhausted in 5d → WARNING
# - Burn rate 3x:    budget exhausted in 10d → INFO
#
# ### Impact
# Users are receiving HTTP 5xx errors for a significant fraction of their
# requests. Impact severity depends on the affected endpoint:
#   - /checkout → direct revenue impact (SEV1 if > 10% error rate)
#   - /search   → degraded product experience (SEV2)
#   - /browse   → reduced discoverability (SEV3)
#
# ### Initial Triage — follow these steps in order:
#
# Step 1: Open the SLO Grafana dashboard
#   URL: https://grafana.internal/d/slo-overview
#   Look at: error rate trend, which endpoint is failing, when it started.
#
# Step 2: Identify the error rate and affected endpoint
#   Run in Prometheus (https://prometheus.internal:9090):
#   sum by (endpoint, status_code) (
#     rate(http_requests_total{status_code=~"5.."}[10m])
#   ) / sum by (endpoint, status_code) (
#     rate(http_requests_total[10m])
#   )
#
# Step 3: Check application logs for error patterns
#   kubectl logs -n production deploy/api-service --since=15m \
#     | grep '"level":"ERROR"' | jq '{msg:.message, err:.error, ep:.endpoint}'
#
# Step 4: Check for recent deployments (last 2 hours)
#   kubectl rollout history deploy/api-service -n production
#   # Or check Grafana deploy annotations on the error rate panel
#
# Step 5: Check upstream dependency health
#   curl -s http://api-service.production.svc/health | jq .
#   # Look for: database_status, cache_status, payment_provider_status
#
# ### Common Causes and Remediation
#
# Cause A: Bad deploy introduced a regression
#   Evidence: error rate spiked immediately after a deploy timestamp
#   Remediation:
#     kubectl rollout undo deploy/api-service -n production
#     kubectl rollout status deploy/api-service -n production
#     # Verify error rate drops within 2-3 minutes
#
# Cause B: Upstream dependency outage (database, cache, payment provider)
#   Evidence: /health endpoint shows degraded dependency
#   Remediation:
#     1. Enable circuit breaker feature flag to fail-fast instead of timing out:
#        kubectl set env deploy/api-service CIRCUIT_BREAKER_ENABLED=true -n production
#     2. If database: check pg_stat_activity for long-running queries
#        kubectl exec -it deploy/postgres -n production -- \
#          psql -c "SELECT pid, query, state, query_start FROM pg_stat_activity
#                   WHERE state != 'idle' ORDER BY query_start;"
#
# Cause C: Traffic spike exhausting connection pool or thread pool
#   Evidence: latency p99 also spiking; CPU/memory near saturation
#   Remediation:
#     kubectl scale deploy/api-service --replicas=10 -n production
#     kubectl rollout status deploy/api-service -n production
#
# ### Escalation Path
# - 0–15 min: Primary on-call investigates
# - 15–30 min: If unresolved → secondary on-call joins
# - 30–60 min: If unresolved → engineering manager + team lead join
# - 60+ min (SEV1): → VP Engineering notified; customer comms drafted
#
# ### Done Checklist
# - [ ] Error rate returned to < 0.1% (SLO threshold)
# - [ ] Alert resolved in Prometheus (state: inactive)
# - [ ] Incident channel archived with root cause summary
# - [ ] Postmortem created in Notion/Confluence (link: ___)
# - [ ] Action items filed in Linear/Jira with owners and due dates
# ═══════════════════════════════════════════════════════════════════════

# PART 3: PagerDuty Escalation Policy (YAML pseudocode)
#
# escalation_policies:
#   - name: "Engineering On-Call Policy"
#     num_loops: 2        # repeat escalation chain twice before giving up
#     escalation_rules:
#       - escalation_delay_in_minutes: 15
#         targets:
#           - type: schedule
#             id: "PRIMARY_ONCALL_SCHEDULE"   # rotates weekly
#       - escalation_delay_in_minutes: 15
#         targets:
#           - type: schedule
#             id: "SECONDARY_ONCALL_SCHEDULE" # backup rotation
#       - escalation_delay_in_minutes: 30
#         targets:
#           - type: user
#             id: "ENGINEERING_MANAGER_USER_ID"
#
# services:
#   - name: "Production API"
#     escalation_policy: "Engineering On-Call Policy"
#     integrations:
#       - type: prometheus        # Alertmanager webhook integration
#     alert_grouping_parameters:
#       type: intelligent         # PagerDuty AI groups related alerts
#
# Alertmanager → PagerDuty routing (alertmanager.yml):
#
# route:
#   group_by: [alertname, job]
#   group_wait: 30s
#   group_interval: 5m
#   repeat_interval: 4h
#   receiver: pagerduty-critical
#   routes:
#     - match:
#         severity: critical
#       receiver: pagerduty-critical
#     - match:
#         severity: warning
#       receiver: slack-warnings
#     - match:
#         severity: info
#       receiver: slack-info
#
# receivers:
#   - name: pagerduty-critical
#     pagerduty_configs:
#       - routing_key: <PAGERDUTY_INTEGRATION_KEY>
#         severity: critical
#         description: '{{ .GroupLabels.alertname }}: {{ .CommonAnnotations.summary }}'
#         details:
#           runbook: '{{ .CommonAnnotations.runbook_url }}'
#           dashboard: '{{ .CommonAnnotations.dashboard_url }}'
#
# inhibit_rules:
#   # Suppress lower-severity alerts when a critical fires for the same job
#   - source_match:
#       severity: critical
#     target_match_re:
#       severity: warning|info
#     equal: [job, endpoint]
# ═══════════════════════════════════════════════════════════════════════

# PART 4: Blameless Postmortem Template
#
# ## Postmortem: [Service] [Brief description] — [Date]
# **Status:** Resolved | Under review
# **Severity:** SEV1 / SEV2 / SEV3
# **Duration:** HH:MM (detected) → HH:MM (resolved) = X hours Y minutes
# **Incident Commander:** [Name]
# **Author:** [Name]   **Reviewers:** [Names]
#
# ---
# ### Incident Summary (2-3 sentences)
# What happened, what was the user impact, how was it resolved.
# Example: "At 14:32 UTC, the payment API began returning HTTP 503 for 23%
# of checkout requests due to a database connection pool exhaustion triggered
# by a missing database index on the orders table introduced in deploy v2.4.1.
# The incident was resolved at 16:15 UTC by rolling back the deploy and
# adding the missing index."
#
# ### Timeline (UTC)
# | Time  | Event                                                            |
# |-------|------------------------------------------------------------------|
# | 14:28 | Deploy v2.4.1 rolled out to 100% of production pods             |
# | 14:32 | ErrorBudgetBurnRateCritical alert fires (burn rate: 22x)        |
# | 14:34 | Primary on-call acknowledges — incident channel created         |
# | 14:41 | Root cause identified: connection pool exhaustion in pg logs    |
# | 14:55 | Rollback of deploy v2.4.1 initiated                             |
# | 15:03 | Error rate returns to < 0.1% — service restored                 |
# | 16:15 | Missing index added to production — full resolution             |
#
# ### Impact Analysis
# - Duration: 91 minutes of elevated error rate (23% error rate peak)
# - Users affected: ~4,200 checkout attempts failed
# - Revenue impact: estimated $42,000 in failed transactions
# - Error budget consumed: 91 min / 43.2 min SLO budget = 210% (budget blown)
# - SLA breach: No (SLA threshold 99.5% — monthly budget not exhausted)
#
# ### Root Cause
# Deploy v2.4.1 added a new query to the checkout path that performed a
# full table scan on the orders table (missing WHERE clause index). Under
# normal load, this caused each query to take 8-12 seconds instead of <5ms,
# exhausting the 20-connection PostgreSQL connection pool within 4 minutes
# of the deploy completing.
#
# ### Contributing Factors (systemic — not individual blame)
# 1. No slow query detection in staging (staging DB has 100 rows; prod has 40M)
# 2. Connection pool exhaustion has no dedicated alert — only surfaced as 503s
# 3. Deploy was not gradual (canary) — went to 100% immediately
# 4. Runbook for "DB connection pool exhaustion" did not exist
#
# ### Action Items
# | #  | Action                                         | Owner    | Due Date   |
# |----|------------------------------------------------|----------|------------|
# | 1  | Add pg_stat_activity alert for pool exhaustion | @sre     | 2026-05-25 |
# | 2  | Write runbook for DB connection pool issues    | @backend | 2026-05-22 |
# | 3  | Enable canary deployments for payment service  | @platform| 2026-06-01 |
# | 4  | Add production-scale query plan check to CI    | @backend | 2026-06-01 |
# | 5  | Add slow-query alert (> 100ms) to Prometheus   | @sre     | 2026-05-25 |
#
# ### Lessons Learned
# - Staging environments with small datasets cannot catch query-plan regressions
# - A single missing index can cascade into a complete service outage in < 5min
# - Canary deployments would have contained the blast radius to < 5% of users
# ═══════════════════════════════════════════════════════════════════════`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Define SLOs for a fictional e-commerce API with three endpoints: `/checkout` (availability SLO: 99.95%, p99 latency SLO: < 500ms), `/search` (availability SLO: 99.9%, p99 latency SLO: < 200ms), `/browse` (availability SLO: 99.5%, p99 latency SLO: < 1s). Calculate the error budgets for each endpoint and each SLO type. Write all 6 Prometheus alerting rules (2 SLOs × 3 endpoints) using the multi-window multi-burn-rate pattern from the code block above. For each alert, include an annotation `runbook_url` pointing to a placeholder runbook URL. Load the rules into Prometheus and use `promtool check rules slo-alerts.yaml` to validate. Then calculate: if the `/checkout` endpoint has been returning 0.1% errors for the past 3 days, how much of the monthly availability error budget has been consumed? Answer: 0.1% error rate on a 99.95% SLO means burn rate = 0.1% / 0.05% = 2x; 3 days × 2x burn = 6 days of budget equivalent consumed out of 30 days = 20% of monthly budget gone. Verify this by querying your Prometheus instance for the actual error budget consumed using the recording rule `slo:error_budget_remaining:ratio_rate30d` adapted for each endpoint's SLO threshold.",
              np: "तीनवटा endpoint भएको fictional e-commerce API को लागि SLO define गर्नुहोस्: `/checkout` (availability SLO: 99.95%, p99 latency SLO: < 500ms), `/search` (availability SLO: 99.9%, p99 latency SLO: < 200ms), `/browse` (availability SLO: 99.5%, p99 latency SLO: < 1s)। प्रत्येक endpoint र SLO type को लागि error budget calculate गर्नुहोस्। माथिको code block बाट multi-window multi-burn-rate pattern प्रयोग गरेर 6 वटा Prometheus alerting rule (2 SLO × 3 endpoint) लेख्नुहोस्। प्रत्येक alert को लागि placeholder runbook URL तर्फ indicate गर्ने `runbook_url` annotation include गर्नुहोस्। Prometheus मा rule load गर्नुहोस् र validate गर्न `promtool check rules slo-alerts.yaml` प्रयोग गर्नुहोस्। त्यसपछि calculate गर्नुहोस्: `/checkout` endpoint ले पछिल्लो 3 दिनदेखि 0.1% error return गर्दैछ भने, monthly availability error budget को कति consume भएको छ? उत्तर: 99.95% SLO मा 0.1% error rate को burn rate = 0.1% / 0.05% = 2x; 3 days × 2x burn = 30 days मध्ये 6 days budget equivalent consumed = 20% monthly budget gone। प्रत्येक endpoint को SLO threshold को लागि adapted recording rule `slo:error_budget_remaining:ratio_rate30d` प्रयोग गरेर Prometheus instance query गरेर actual error budget consumed verify गर्नुहोस्।",
              jp: "3 つのエンドポイントを持つ架空の E コマース API の SLO を定義する：`/checkout`（可用性 SLO：99.95%、p99 レイテンシー SLO：500ms 未満）、`/search`（可用性 SLO：99.9%、p99 レイテンシー SLO：200ms 未満）、`/browse`（可用性 SLO：99.5%、p99 レイテンシー SLO：1 秒未満）。各エンドポイントと SLO タイプのエラーバジェットを計算する。上記のコードブロックのマルチウィンドウ・マルチバーンレートパターンを使用して 6 つすべての Prometheus アラートルール（2 SLO × 3 エンドポイント）を書く。各アラートにプレースホルダーのランブック URL を指すアノテーション `runbook_url` を含める。ルールを Prometheus にロードし、`promtool check rules slo-alerts.yaml` を使用して検証する。次に計算する：`/checkout` エンドポイントが過去 3 日間 0.1% のエラーを返し続けている場合、月次可用性エラーバジェットのどれだけが消費されたか？答え：99.95% SLO での 0.1% エラーレートはバーンレート = 0.1% / 0.05% = 2x；3 日 × 2x バーン = 30 日中 6 日相当のバジェット消費 = 月次バジェットの 20% 消失。各エンドポイントの SLO 閾値に適応した記録ルール `slo:error_budget_remaining:ratio_rate30d` を使用して Prometheus インスタンスをクエリすることで実際に消費されたエラーバジェットを検証する。",
            },
            {
              en: "Write a complete runbook for the `HighErrorBudgetBurnRate` alert using the template from the code block above. The runbook should be a Markdown file (`runbooks/high-error-budget-burn-rate.md`) with: alert context (which SLO it protects, what burn rate means in plain language), a 5-step triage procedure (1. Open the Grafana SLO dashboard; 2. Query the error rate per endpoint with PromQL; 3. Check application logs for error patterns using `kubectl logs ... | jq`; 4. Identify the affected endpoint and correlate with recent deploys via Grafana annotations; 5. Check the health endpoint of the service for upstream dependency status), 3 common causes with exact remediation commands (bad deploy → `kubectl rollout undo`; upstream dependency → circuit breaker feature flag; traffic spike → `kubectl scale`), escalation path (primary on-call → if not resolved in 30 min → secondary on-call → if not resolved in 1 hour → engineering manager), and a \"Done\" checklist (alert resolved, postmortem created, action items filed in Linear/Jira). After writing the runbook, conduct a \"runbook drill\": have a colleague (or yourself, pretending to have no context) simulate receiving the alert at 3am and follow the runbook steps against a staging environment where you have intentionally injected a 5% error rate. Time how long it takes from receiving the alert to identifying the root cause. If it takes more than 10 minutes, identify which steps were unclear and rewrite them.",
              np: "माथिको code block बाट template प्रयोग गरेर `HighErrorBudgetBurnRate` alert को लागि complete runbook लेख्नुहोस्। Runbook Markdown file (`runbooks/high-error-budget-burn-rate.md`) हुनुपर्छ जसमा: alert context (यसले कुन SLO protect गर्छ, burn rate plain language मा के हो), 5-step triage procedure (१. Grafana SLO dashboard खोल्नुहोस्; २. PromQL सँग endpoint अनुसार error rate query गर्नुहोस्; ३. `kubectl logs ... | jq` प्रयोग गरेर error pattern को लागि application log check गर्नुहोस्; ४. Grafana annotation मार्फत recent deploy सँग affected endpoint identify र correlate गर्नुहोस्; ५. Upstream dependency status को लागि service को health endpoint check गर्नुहोस्), exact remediation command सहित 3 common cause (bad deploy → `kubectl rollout undo`; upstream dependency → circuit breaker feature flag; traffic spike → `kubectl scale`), escalation path (primary on-call → 30 min मा resolve नभएमा → secondary on-call → 1 hour मा resolve नभएमा → engineering manager), र \"Done\" checklist (alert resolved, postmortem created, action item Linear/Jira मा filed) छन्। Runbook लेखेपछि, \"runbook drill\" conduct गर्नुहोस्: colleague (वा context छैन pretend गर्दै आफैं) लाई 3am मा alert receive simulate गर्न र intentionally 5% error rate inject गरिएको staging environment मा runbook step follow गर्न लगाउनुहोस्। Alert receive गरेदेखि root cause identify गर्न कति समय लाग्छ time गर्नुहोस्। 10 minute भन्दा बढी लागेमा, कुन step unclear थियो identify गरेर rewrite गर्नुहोस्।",
              jp: "上記のコードブロックのテンプレートを使用して `HighErrorBudgetBurnRate` アラートの完全なランブックを書く。ランブックは Markdown ファイル（`runbooks/high-error-budget-burn-rate.md`）であるべきで：アラートコンテキスト（どの SLO を保護するか、バーンレートが平易な言語で何を意味するか）、5 ステップのトリアージ手順（1. Grafana SLO ダッシュボードを開く；2. PromQL でエンドポイントごとのエラーレートをクエリする；3. `kubectl logs ... | jq` を使用してエラーパターンのアプリケーションログを確認する；4. Grafana アノテーションを介して最近のデプロイと影響を受けるエンドポイントを特定・相関させる；5. アップストリーム依存関係のステータスのためにサービスのヘルスエンドポイントを確認する）、正確な修復コマンドを含む 3 つの一般的な原因（悪いデプロイ → `kubectl rollout undo`；アップストリーム依存関係 → サーキットブレーカーフィーチャーフラグ；トラフィックスパイク → `kubectl scale`）、エスカレーションパス（プライマリオンコール → 30 分以内に解決しない場合 → セカンダリオンコール → 1 時間以内に解決しない場合 → エンジニアリングマネージャー）、「完了」チェックリスト（アラート解決・ポストモーテム作成・Linear/Jira へのアクションアイテム提出）を含む。ランブックを書いた後、「ランブックドリル」を実施する：同僚（またはコンテキストがないふりをして自分自身）に午前 3 時にアラートを受け取るシミュレーションをさせ、意図的に 5% のエラーレートを注入したステージング環境でランブックのステップに従わせる。アラートを受け取ってから根本原因を特定するまでの時間を計測する。10 分以上かかる場合は、どのステップが不明確だったかを特定して書き直す。",
            },
            {
              en: "Conduct a \"GameDay\" (chaos engineering exercise) to validate your monitoring setup. Using your test service from previous days, simulate 3 different failure scenarios and verify your alerts, runbooks, and dashboards respond correctly. (a) Simulate high error rate: add a middleware that returns 500 for 10% of requests. Verify `ErrorBudgetBurnRateCritical` alert fires within the `for` duration (2m). Verify Grafana error rate panel turns red. Follow the runbook steps 1–5 and time how long it takes to identify the cause. Confirm the burn rate shown in Prometheus matches your expectation: 10% error rate / 0.1% budget = 100x burn rate. (b) Simulate latency spike: add a `time.sleep(1)` in your route handler for 20% of requests. Verify a latency SLO alert fires. Check Grafana p99 panel shows latency exceeding the SLO threshold. Verify that the latency spike does NOT trigger the error rate alert — this validates your alerts are SLI-specific and not conflated. (c) Simulate complete outage: stop the service process. Verify `TargetDown` alert fires (from the `up == 0` expression). Verify Alertmanager correctly routes it to the `pagerduty-critical` receiver. Verify inhibition rules suppress lower-severity alerts for the same job during the outage. After each scenario: document in a mini-postmortem — when was the issue introduced, when was the alert detected (MTTD), what was the MTTR if you had to follow the runbook from scratch. The goal is not a clean run — it is to find the gaps in your alerting, runbooks, and dashboards before a real incident does.",
              np: "Monitoring setup validate गर्न \"GameDay\" (chaos engineering exercise) conduct गर्नुहोस्। Previous day को test service प्रयोग गरेर, 3 different failure scenario simulate गर्नुहोस् र तपाईंको alert, runbook, र dashboard ले सही respond गर्छन् verify गर्नुहोस्। (क) High error rate simulate गर्नुहोस्: 10% request को लागि 500 return गर्ने middleware add गर्नुहोस्। `ErrorBudgetBurnRateCritical` alert `for` duration (2m) भित्र fire हुन्छ verify गर्नुहोस्। Grafana error rate panel red हुन्छ verify गर्नुहोस्। Runbook step 1–5 follow गर्नुहोस् र cause identify गर्न कति समय लाग्छ time गर्नुहोस्। Prometheus मा देखिएको burn rate तपाईंको expectation match गर्छ confirm गर्नुहोस्: 10% error rate / 0.1% budget = 100x burn rate। (ख) Latency spike simulate गर्नुहोस्: 20% request को लागि route handler मा `time.sleep(1)` add गर्नुहोस्। Latency SLO alert fire हुन्छ verify गर्नुहोस्। Grafana p99 panel ले SLO threshold exceed गर्ने latency देखाउँछ check गर्नुहोस्। Latency spike ले error rate alert trigger गर्दैन verify गर्नुहोस् — यसले alert SLI-specific छ र conflated छैन validate गर्छ। (ग) Complete outage simulate गर्नुहोस्: service process बन्द गर्नुहोस्। `TargetDown` alert fire हुन्छ verify गर्नुहोस् (`up == 0` expression बाट)। Alertmanager ले यसलाई सही रूपमा `pagerduty-critical` receiver मा route गर्छ verify गर्नुहोस्। Outage को समयमा inhibition rule ले same job को lower-severity alert suppress गर्छ verify गर्नुहोस्। प्रत्येक scenario पछि: mini-postmortem मा document गर्नुहोस् — issue कहिले introduce भयो, alert कहिले detect भयो (MTTD), runbook बाट scratch बाट follow गर्नुपर्ने भए MTTR के हुन्थ्यो। Goal clean run होइन — यो real incident हुनु अघि alerting, runbook, र dashboard मा gap find गर्नु हो।",
              jp: "監視セットアップを検証するために「ゲームデイ」（カオスエンジニアリング演習）を実施する。前の日のテストサービスを使用して、3 つの異なる障害シナリオをシミュレートし、アラート・ランブック・ダッシュボードが正しく対応することを確認する。(a) 高エラーレートのシミュレーション：リクエストの 10% に対して 500 を返すミドルウェアを追加する。`ErrorBudgetBurnRateCritical` アラートが `for` 時間（2m）内に発火することを確認する。Grafana のエラーレートパネルが赤くなることを確認する。ランブックのステップ 1〜5 に従い、原因を特定するのにかかる時間を計測する。Prometheus に表示されるバーンレートが期待と一致することを確認する：10% エラーレート / 0.1% バジェット = 100x バーンレート。(b) レイテンシースパイクのシミュレーション：リクエストの 20% のルートハンドラーに `time.sleep(1)` を追加する。レイテンシー SLO アラートが発火することを確認する。Grafana の p99 パネルが SLO 閾値を超えるレイテンシーを示すことを確認する。レイテンシースパイクがエラーレートアラートを引き起こさないことを確認する — これによりアラートが SLI 固有で混在していないことを検証します。(c) 完全停止のシミュレーション：サービスプロセスを停止する。`TargetDown` アラートが発火することを確認する（`up == 0` 式から）。Alertmanager が正しく `pagerduty-critical` レシーバーにルーティングすることを確認する。停止中に抑制ルールが同じジョブの低重大度アラートを抑制することを確認する。各シナリオの後：ミニポストモーテムに記録する — 問題がいつ導入されたか・アラートがいつ検出されたか（MTTD）・ランブックをゼロから従わなければならなかった場合の MTTR。目標はきれいな実行ではありません — それはリアルなインシデントがそうする前にアラート・ランブック・ダッシュボードのギャップを見つけることです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is a multi-window, multi-burn-rate alert and why is it significantly better than a simple error rate threshold alert?",
        np: "Multi-window, multi-burn-rate alert के हो र यो simple error rate threshold alert भन्दा किन significantly better छ?",
        jp: "マルチウィンドウ・マルチバーンレートアラートとは何か、そしてなぜシンプルなエラーレート閾値アラートよりも大幅に優れているのか？",
      },
      answer: {
        en: "A simple threshold alert (`rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) > 0.01`) has two fundamental and opposing failure modes. (1) **False positives**: a 30-second burst of errors — a single bad deploy canary request, a brief upstream hiccup — fires the alert even if it burns only 0.01% of the monthly error budget. You page an engineer at 3am for something that will self-heal before they finish reading the alert. This is called alert fatigue: when every alert is not actionable, engineers start ignoring them, and the one real alert that matters gets dismissed. (2) **False negatives**: a slow, steady trickle of errors at exactly 0.05% — half the SLO error rate — never crosses the 1% threshold but will silently exhaust the monthly error budget in 60 days. You will breach the SLA without ever being paged. Multi-window multi-burn-rate alerting (from Google SRE Workbook Chapter 5) solves both failure modes simultaneously. The key abstraction is **burn rate**: `burn_rate = observed_error_rate / slo_error_rate`. At 99.9% SLO, the SLO error rate is 0.001 (0.1%). A burn rate of 1.0 means you are consuming budget at exactly the rate that would exhaust it in exactly 30 days — the sustainable rate. A burn rate of 14.4 means you will exhaust the budget in `30 days / 14.4 = ~2 hours`. A burn rate of 6 means exhaustion in 5 days. A burn rate of 3 means exhaustion in 10 days. Each burn rate threshold maps to a proportional response: 14.4x → wake someone up immediately (critical/PagerDuty); 6x → alert the team on Slack (warning); 3x → create a ticket (info). The **two-window structure** is what eliminates both failure modes. Consider a 14.4x critical alert: it fires only when BOTH the 1-hour window AND the 5-minute window simultaneously show an error rate above `14.4 × 0.001 = 0.0144` (1.44%). The 1-hour window filters out transient spikes: a 2-minute burst of errors will barely move the 1-hour average — the long window stays below threshold, so no alert. The 5-minute window ensures fast detection: if the burn rate is genuinely 14.4x and sustained, the short window will also exceed the threshold within minutes, and the alert fires quickly. A simple way to remember: `budget_consumed_in_window = observed_error_rate × window_seconds / total_budget_seconds`. For the 1-hour window at 14.4x: `1.44% × 3600 / (30 × 86400 × 0.1%) = 14.4 × (3600 / 2592000) = 2% of monthly budget consumed in 1 hour` — clearly significant. For a 2-minute spike at 1.44%: `1.44% × 120 / 2592000×0.001 = 0.07% of monthly budget` — negligible, and correctly not paged. This gives you graduated, proportional alerting that is simultaneously sensitive enough to catch sustained slow burns and robust enough to not fire on transient noise.",
        np: "Simple threshold alert (`rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) > 0.01`) का दुईवटा fundamental र opposing failure mode छन्। (१) **False positive**: 30-second error burst — single bad deploy canary request, brief upstream hiccup — ले monthly error budget को 0.01% मात्र burn गरे पनि alert fire गर्छ। Self-heal हुनु अघि engineer लाई 3am मा page गर्नुहुन्छ। यसलाई alert fatigue भनिन्छ: प्रत्येक alert actionable नभएमा, engineer ले ती ignore गर्न थाल्छन्, र important real alert dismiss हुन्छ। (२) **False negative**: ठ्याक्कै 0.05% मा slow, steady trickle of error — SLO error rate को half — ले 1% threshold कहिल्यै cross गर्दैन तर 60 दिनमा silently monthly error budget exhaust गर्छ। Page नभई SLA breach हुन्छ। Multi-window multi-burn-rate alerting (Google SRE Workbook Chapter 5 बाट) दुवै failure mode simultaneously solve गर्छ। Key abstraction **burn rate** हो: `burn_rate = observed_error_rate / slo_error_rate`। 99.9% SLO मा, SLO error rate 0.001 (0.1%) हो। Burn rate 1.0 को अर्थ ठ्याक्कै 30 दिनमा exhaust हुने rate मा budget consume हुँदैछ। Burn rate 14.4 को अर्थ `30 days / 14.4 = ~2 hours` मा budget exhaust। Burn rate 6 को अर्थ 5 दिनमा exhaustion। Burn rate 3 को अर्थ 10 दिनमा exhaustion। प्रत्येक burn rate threshold ले proportional response मा map गर्छ: 14.4x → immediately page (critical/PagerDuty); 6x → Slack मा team alert (warning); 3x → ticket create (info)। **Two-window structure** ले दुवै failure mode eliminate गर्छ। 14.4x critical alert लाई consider गर्नुहोस्: यो तब मात्र fire हुन्छ जब 1-hour window र 5-minute window दुवैले simultaneously `14.4 × 0.001 = 0.0144` (1.44%) भन्दा माथि error rate देखाउँछन्। 1-hour window ले transient spike filter गर्छ: 2-minute error burst ले 1-hour average मा barely move गर्छ — long window threshold भन्दा तल रहन्छ, त्यसैले alert छैन। 5-minute window ले fast detection ensure गर्छ: burn rate genuinely 14.4x र sustained छ भने, short window पनि minutes भित्र threshold exceed गर्छ, र alert छिट्टो fire हुन्छ। Graduated, proportional alerting ले तपाईंलाई sustained slow burn catch गर्न sensitive र transient noise मा fire नगर्न robust बनाउँछ।",
        jp: "シンプルな閾値アラート（`rate(http_requests_total{status_code=~\"5..\"}[5m]) / rate(http_requests_total[5m]) > 0.01`）には 2 つの根本的かつ相反する障害モードがあります。(1) **誤報**：30 秒のエラーバースト — 単一の悪いデプロイカナリアリクエスト、短いアップストリームのヒックアップ — が月次エラーバジェットの 0.01% しか消費しなくてもアラートを発火させます。自己修復する前にエンジニアを午前 3 時に呼び出します。これはアラート疲労と呼ばれます：すべてのアラートが実行可能でない場合、エンジニアはそれらを無視し始め、重要な本物のアラートが却下されます。(2) **見逃し**：ちょうど 0.05% のゆっくりとした安定したエラーのトリクル — SLO エラーレートの半分 — は 1% の閾値を決して超えませんが、60 日で静かに月次エラーバジェットを使い果たします。呼び出されることなく SLA を違反します。マルチウィンドウ・マルチバーンレートアラート（Google SRE ワークブック第 5 章から）は両方の障害モードを同時に解決します。重要な抽象化は**バーンレート**です：`burn_rate = observed_error_rate / slo_error_rate`。99.9% SLO では、SLO エラーレートは 0.001（0.1%）です。バーンレート 1.0 はちょうど 30 日で使い果たすレートでバジェットを消費していることを意味します。バーンレート 14.4 は `30 日 / 14.4 = ~2 時間` でバジェットが枯渇することを意味します。バーンレート 6 は 5 日で枯渇。バーンレート 3 は 10 日で枯渇。各バーンレート閾値は比例した対応にマップします：14.4x → 即座に呼び出す（クリティカル/PagerDuty）；6x → Slack でチームに警告（警告）；3x → チケット作成（情報）。**2 ウィンドウ構造**は両方の障害モードを排除するものです。14.4x のクリティカルアラートを考えてみてください：1 時間ウィンドウと 5 分ウィンドウの両方が同時に `14.4 × 0.001 = 0.0144`（1.44%）を超えるエラーレートを示す場合にのみ発火します。1 時間ウィンドウは一時的なスパイクをフィルタリングします：2 分間のエラーバーストは 1 時間の平均をほとんど動かしません — 長いウィンドウは閾値以下に留まり、アラートは発火しません。5 分ウィンドウは素早い検出を保証します：バーンレートが真に 14.4x で持続している場合、短いウィンドウも数分以内に閾値を超え、アラートが素早く発火します。この段階的で比例したアラートは、持続的なスロー消費を捉えるのに十分な感度を持ち、一時的なノイズで発火しない十分な堅牢性を持ちます。",
      },
      tag: {
        en: "multi-burn-rate alerting",
        np: "multi-burn-rate alerting",
        jp: "マルチバーンレートアラート",
      },
    },
    {
      question: {
        en: "What makes a good runbook, and what is the most common mistake engineers make when writing them?",
        np: "राम्रो runbook भनेको के हो, र engineer ले runbook लेख्दा सबैभन्दा common mistake के गर्छन्?",
        jp: "良いランブックとはどのようなものか、そしてエンジニアがランブックを書く際に犯す最も一般的な間違いは何か？",
      },
      answer: {
        en: "A good runbook has one defining quality: a sleep-deprived engineer woken at 3am with no prior context can read it and take the right action within 5 minutes, without needing to ask anyone else. It is not system documentation — it is an operational procedure, closer to an airplane emergency checklist than a design document. The structure that achieves this: (1) **Alert context**: what SLO does this alert protect, what is the user impact right now, what does the current burn rate mean in concrete terms (\"budget exhausted in 2 hours\" is useful; \"elevated error rate\" is not). (2) **Diagnostic procedure**: numbered steps with exact commands — not \"check the logs\" but `kubectl logs -n production deploy/payment-api --since=15m | grep '\"level\":\"ERROR\"' | jq '{msg:.message,err:.error,ep:.endpoint}'`. The command should be copy-pasteable. (3) **Common causes with exact remediation**: not \"if there's a bad deploy, roll it back\" but `kubectl rollout undo deploy/payment-api -n production && kubectl rollout status deploy/payment-api -n production` followed by \"verify error rate drops within 3 minutes in Grafana.\" (4) **Escalation path**: not \"escalate to the team\" but specific names, Slack handles, and phone numbers for each escalation level. (5) **Resolution checklist**: what to verify before closing the incident — the exact Prometheus query to confirm the error rate is back below threshold, not just \"check that things are working.\" **The most common mistake** is writing a runbook that *describes* the system instead of *prescribing* actions. \"This service handles payment processing and connects to a PostgreSQL database via PgBouncer connection pooling. It is deployed as a Kubernetes Deployment with 5 replicas.\" That is architecture documentation — useless at 3am. Actionable equivalent: \"Step 1: Run `kubectl get pods -n production -l app=payment-api` to confirm all 5 replicas are Running. If fewer than 5 are Running, proceed to Step 2. If all 5 are Running and CrashLoopBackOff pods exist, skip to Step 4 (crash loop triage).\" **The second most common mistake** is not linking the runbook from the alert annotation. A runbook that is not one click away from the firing alert in PagerDuty or Alertmanager might as well not exist during an incident. Every alert rule should have a `runbook_url` annotation. Every runbook URL should be a stable, versioned link — not a link to a Confluence page whose title someone will rename. **The third mistake** is not maintaining runbooks. A runbook that describes a service that was renamed 6 months ago, or references a command that no longer exists, is actively dangerous — it misleads the responder and wastes precious minutes during an incident. **The fix**: treat runbook updates as part of the postmortem action items. After every incident, ask: \"Would this runbook have helped the on-call engineer resolve this faster?\" If not, update it before closing the postmortem. Additionally, run quarterly \"runbook drills\" — have on-call engineers follow runbooks in a staging environment with a simulated failure to verify they still work end-to-end. Treat a runbook that fails the drill as a production bug: fix it immediately.",
        np: "राम्रो runbook को एउटा defining quality छ: prior context बिना 3am मा जगाइएको sleep-deprived engineer ले 5 minute भित्र पढेर कसैलाई सोध्न नपरी सही action लिन सक्नुपर्छ। यो system documentation होइन — यो operational procedure हो, design document भन्दा airplane emergency checklist नजिक। यो achieve गर्ने structure: (१) **Alert context**: यो alert ले कुन SLO protect गर्छ, अहिले user impact के हो, current burn rate concrete terms मा के हो (\"2 घन्टामा budget exhaust\" useful छ; \"elevated error rate\" छैन)। (२) **Diagnostic procedure**: exact command सहित numbered step — \"log check गर्नुहोस्\" होइन `kubectl logs -n production deploy/payment-api --since=15m | grep '\"level\":\"ERROR\"' | jq '{msg:.message,err:.error,ep:.endpoint}'`। Command copy-pasteable हुनुपर्छ। (३) **Exact remediation सहित common cause**: \"bad deploy छ भने rollback गर्नुहोस्\" होइन `kubectl rollout undo deploy/payment-api -n production && kubectl rollout status deploy/payment-api -n production` र \"Grafana मा 3 minute भित्र error rate drop हुन्छ verify गर्नुहोस्।\" (४) **Escalation path**: \"team मा escalate गर्नुहोस्\" होइन प्रत्येक escalation level को लागि specific name, Slack handle, र phone number। (५) **Resolution checklist**: incident close गर्नु अघि के verify गर्ने — \"कुरा काम गर्दैछ check गर्नुहोस्\" होइन error rate threshold भन्दा फर्किएको confirm गर्न exact Prometheus query। **सबैभन्दा common mistake** action prescribe गर्नुको सट्टा system describe गर्ने runbook लेख्नु हो। \"यो service ले payment processing handle गर्छ र PgBouncer connection pooling मार्फत PostgreSQL database सँग connect हुन्छ।\" त्यो architecture documentation हो — 3am मा useless। Actionable equivalent: \"Step 1: सबै 5 replica Running छन् confirm गर्न `kubectl get pods -n production -l app=payment-api` run गर्नुहोस्। 5 भन्दा कम Running छ भने, Step 2 मा proceed गर्नुहोस्।\" **दोस्रो common mistake** alert annotation बाट runbook link नगर्नु हो। PagerDuty वा Alertmanager मा firing alert बाट एक click टाढा नभएको runbook incident को समयमा exist नगरे जत्तिकै हो। प्रत्येक alert rule मा `runbook_url` annotation हुनुपर्छ। **तेस्रो mistake** runbook maintain नगर्नु हो। 6 महिना पहिले rename भएको service describe गर्ने, वा अब exist नगर्ने command reference गर्ने runbook actively dangerous छ। **Fix**: runbook update लाई postmortem action item को part को रूपमा treat गर्नुहोस्। प्रत्येक incident पछि सोध्नुहोस्: \"यो runbook ले on-call engineer लाई faster resolve गर्न help गर्थ्यो?\" नभएमा, postmortem close गर्नु अघि update गर्नुहोस्। Quarterly \"runbook drill\" पनि run गर्नुहोस् — on-call engineer लाई staging environment मा simulated failure सँग runbook follow गराउनुहोस् end-to-end काम गर्छ verify गर्न।",
        jp: "良いランブックには 1 つの定義的な特質があります：事前の文脈なしで午前 3 時に起こされた睡眠不足のエンジニアが、誰にも聞かずに 5 分以内に読んで正しいアクションを取れるものです。それはシステムドキュメントではありません — それは運用手順であり、設計ドキュメントよりも飛行機の緊急チェックリストに近いものです。これを達成する構造：(1) **アラートコンテキスト**：このアラートはどの SLO を保護するか、今のユーザー影響は何か、現在のバーンレートは具体的な言葉で何を意味するか（「バジェットは 2 時間で枯渇する」は有用；「エラーレートが上昇している」は不十分）。(2) **診断手順**：正確なコマンド付きの番号付きステップ — 「ログを確認して」ではなく `kubectl logs -n production deploy/payment-api --since=15m | grep '\"level\":\"ERROR\"' | jq '{msg:.message,err:.error,ep:.endpoint}'`。コマンドはコピー＆ペースト可能であるべきです。(3) **正確な修復付きの一般的な原因**：「悪いデプロイがあればロールバックして」ではなく `kubectl rollout undo deploy/payment-api -n production && kubectl rollout status deploy/payment-api -n production` に続けて「Grafana で 3 分以内にエラーレートが下がることを確認する」。(4) **エスカレーションパス**：「チームにエスカレートして」ではなく各エスカレーションレベルの具体的な名前・Slack ハンドル・電話番号。(5) **解決チェックリスト**：インシデントを閉じる前に何を確認するか — 「物事が動いているか確認して」ではなくエラーレートが閾値以下に戻ったことを確認するための正確な Prometheus クエリ。**最も一般的な間違い**はアクションを*処方する*のではなくシステムを*記述する*ランブックを書くことです。「このサービスは決済処理を行い、PgBouncer 接続プーリングを介して PostgreSQL データベースに接続します。」それはアーキテクチャドキュメントです — 午前 3 時には役に立ちません。実行可能な相当品：「ステップ 1：`kubectl get pods -n production -l app=payment-api` を実行してすべての 5 つのレプリカが Running であることを確認する。5 未満が Running なら、ステップ 2 に進む。」**2 番目に一般的な間違い**はアラートアノテーションからランブックをリンクしないことです。PagerDuty または Alertmanager の発火アラートからワンクリックで到達できないランブックは、インシデント中には存在しないも同然です。すべてのアラートルールに `runbook_url` アノテーションが必要です。**3 番目の間違い**はランブックを維持しないことです。6 ヶ月前に名前が変更されたサービスを記述する、または存在しなくなったコマンドを参照するランブックは積極的に危険です。**修正方法**：ランブックの更新をポストモーテムのアクションアイテムの一部として扱う。すべてのインシデントの後に問う：「このランブックはオンコールエンジニアがより速く解決するのに役立っただろうか？」そうでなければ、ポストモーテムを閉じる前に更新する。また、四半期ごとに「ランブックドリル」を実施する — オンコールエンジニアにステージング環境でシミュレートされた障害とともにランブックに従わせ、エンドツーエンドで機能することを確認する。ドリルに失敗したランブックは本番のバグとして扱う：すぐに修正する。",
      },
      tag: {
        en: "runbook best practices",
        np: "runbook best practice",
        jp: "ランブックのベストプラクティス",
      },
    },
  ],
};
