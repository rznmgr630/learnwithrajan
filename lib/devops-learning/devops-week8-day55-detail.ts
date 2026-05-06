import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Deploying directly to production with a single update is the fastest way to take down your service. The deployment strategy you choose determines how much traffic is exposed to the new version, how quickly you can roll back, and whether any users experience downtime during the release. There are four mainstream strategies: recreate (stop old, start new — simple but causes downtime), rolling update (replace pods one by one — zero downtime but mixed versions briefly), blue/green (run two identical environments, switch traffic instantly — zero downtime and instant rollback), and canary (gradually shift a percentage of traffic to the new version — catch bugs before they affect all users). Choosing the right strategy depends on your risk tolerance and infrastructure.",
    np: "Single update सँग directly production मा deploy गर्नु service down गर्ने सबभन्दा छिटो तरिका हो। तपाईंले choose गरेको deployment strategy ले determine गर्छ: new version मा कति traffic expose हुन्छ, कति छिटो rollback गर्न सकिन्छ, र release को बेला कुनै user लाई downtime experience हुन्छ कि हुँदैन। चार mainstream strategy छन्: recreate (old stop, new start — simple तर downtime), rolling update (pod एक-एक गरी replace — zero downtime तर briefly mixed version), blue/green (दुई identical environment run, traffic instantly switch — zero downtime र instant rollback), र canary (gradually new version मा traffic percentage shift — सबै user लाई affect गर्नु अघि bug catch)। सही strategy choose गर्नु risk tolerance र infrastructure मा depend गर्छ।",
    jp: "単一の更新で直接本番にデプロイすることはサービスをダウンさせる最も速い方法です。選択するデプロイメント戦略は、新しいバージョンにどれだけのトラフィックが公開されるか・どれだけ速くロールバックできるか・リリース中にユーザーがダウンタイムを経験するかどうかを決定します。4 つの主流の戦略があります：recreate（古いのを停止して新しいのを開始 — シンプルだがダウンタイムあり）・ローリングアップデート（ポッドを 1 つずつ置き換える — ゼロダウンタイムだが一時的に混在バージョン）・blue/green（2 つの同一環境を実行してトラフィックを瞬時に切り替え — ゼロダウンタイムと即時ロールバック）・カナリア（新しいバージョンへのトラフィックの割合を徐々にシフト — すべてのユーザーに影響する前にバグをキャッチ）。適切な戦略の選択はリスク許容度とインフラストラクチャに依存します。",
  } as const,
  o2: {
    en: "Today you implement a blue/green deployment with Nginx upstream switching, configure a Kubernetes rolling update with `maxSurge` and `maxUnavailable`, set up a canary deployment using Kubernetes replica weights, and build a Jenkins stage that verifies the canary is healthy before promoting it to 100% of production traffic.",
    np: "आज तपाईंले Nginx upstream switching सँग blue/green deployment implement गर्नुहुनेछ, `maxSurge` र `maxUnavailable` सहित Kubernetes rolling update configure गर्नुहुनेछ, Kubernetes replica weight प्रयोग गरी canary deployment setup गर्नुहुनेछ, र 100% production traffic मा promote गर्नु अघि canary healthy छ कि छैन verify गर्ने Jenkins stage build गर्नुहुनेछ।",
    jp: "今日は Nginx アップストリーム切り替えで blue/green デプロイメントを実装し・`maxSurge` と `maxUnavailable` を使って Kubernetes ローリングアップデートを設定し・Kubernetes レプリカの重みを使ってカナリアデプロイメントをセットアップし・本番トラフィックの 100% に昇格させる前にカナリアが正常かどうかを確認する Jenkins ステージを構築します。",
  } as const,
};

export const DEVOPS_DAY_55_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Deployment strategies — mechanism, risk & rollback",
        np: "Deployment strategy — mechanism, risk र rollback",
        jp: "デプロイメント戦略 — メカニズム・リスク・ロールバック",
      },
      blocks: [
        { type: "diagram", id: "devops-deploy-strategies" },
        {
          type: "table",
          caption: {
            en: "Deployment strategy comparison — downtime, rollback speed, and infrastructure cost",
            np: "Deployment strategy comparison — downtime, rollback speed, र infrastructure cost",
            jp: "デプロイメント戦略の比較 — ダウンタイム・ロールバック速度・インフラストラクチャコスト",
          },
          headers: [
            { en: "Strategy", np: "Strategy", jp: "戦略" },
            { en: "How it works", np: "कसरी काम गर्छ", jp: "仕組み" },
            { en: "Downtime", np: "Downtime", jp: "ダウンタイム" },
            { en: "Rollback speed", np: "Rollback speed", jp: "ロールバック速度" },
            { en: "Cost", np: "Cost", jp: "コスト" },
          ],
          rows: [
            [
              { en: "Recreate", np: "Recreate", jp: "Recreate" },
              { en: "Stop all v1, then start all v2 — gap between stop and start", np: "सबै v1 stop, त्यसपछि सबै v2 start — stop र start बीच gap", jp: "すべての v1 を停止してからすべての v2 を開始 — 停止と開始の間にギャップ" },
              { en: "Yes — brief outage during transition", np: "छ — transition को बेला brief outage", jp: "あり — 移行中に短いサービス停止" },
              { en: "Slow — redeploy v1 from scratch", np: "Slow — scratch बाट v1 redeploy", jp: "遅い — v1 をゼロから再デプロイ" },
              { en: "1× — one environment", np: "1× — एउटा environment", jp: "1× — 1 つの環境" },
            ],
            [
              { en: "Rolling update", np: "Rolling update", jp: "ローリングアップデート" },
              { en: "Replace replicas one at a time; old and new run side-by-side briefly", np: "एक-एक गरी replica replace; old र new briefly side-by-side run", jp: "レプリカを 1 つずつ置き換える；古いものと新しいものが短時間並行して実行" },
              { en: "None (with correct readiness probes)", np: "छैन (correct readiness probe सहित)", jp: "なし（正しい readiness probe がある場合）" },
              { en: "Medium — roll back by re-rolling to previous image", np: "Medium — previous image मा re-rolling गरी roll back", jp: "中 — 以前のイメージへの再ロールで戻す" },
              { en: "1× — gradual replacement", np: "1× — gradual replacement", jp: "1× — 段階的な置き換え" },
            ],
            [
              { en: "Blue / Green", np: "Blue / Green", jp: "Blue / Green" },
              { en: "Two identical environments (blue=live, green=new); switch LB from blue → green atomically", np: "दुई identical environment (blue=live, green=new); blue → green मा LB atomically switch", jp: "2 つの同一環境（blue=ライブ、green=新規）；ロードバランサーを blue → green に原子的に切り替え" },
              { en: "None — switch is instant", np: "छैन — switch instant", jp: "なし — 切り替えは瞬時" },
              { en: "Instant — flip LB back to blue", np: "Instant — LB blue मा फ्लिप", jp: "即時 — LB を blue に戻す" },
              { en: "2× — two full environments running", np: "2× — दुई full environment running", jp: "2× — 2 つの完全な環境が稼働" },
            ],
            [
              { en: "Canary", np: "Canary", jp: "カナリア" },
              { en: "Route 5–10% of traffic to v2; monitor errors; gradually increase to 100% on success", np: "5–10% traffic v2 मा route; error monitor; success मा gradually 100% increase", jp: "トラフィックの 5〜10% を v2 にルーティング；エラーを監視；成功時に徐々に 100% まで増加" },
              { en: "None — production traffic never drops", np: "छैन — production traffic कहिल्यै drop हुँदैन", jp: "なし — 本番トラフィックが途切れない" },
              { en: "Fast — reduce canary weight to 0%", np: "Fast — canary weight 0% मा reduce", jp: "速い — カナリアの重みを 0% に減らす" },
              { en: "1.1–1.5× — small canary fleet alongside production", np: "1.1–1.5× — production सँगसाथ small canary fleet", jp: "1.1〜1.5× — 本番と並行する小規模カナリアフリート" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Implementing blue/green, rolling & canary with Nginx and Kubernetes",
        np: "Nginx र Kubernetes सँग blue/green, rolling र canary implement गर्ने",
        jp: "Nginx と Kubernetes を使って blue/green・ローリング・カナリアを実装",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Blue/green with Nginx + Kubernetes rolling + canary replica weights + Jenkins promotion gate",
            np: "Nginx सँग blue/green + Kubernetes rolling + canary replica weight + Jenkins promotion gate",
            jp: "Nginx + Kubernetes ローリング + カナリアレプリカ重み + Jenkins 昇格ゲートによる Blue/Green",
          },
          code: `# ── Blue / Green — Nginx upstream switch ───────────────────────
# Two deployments: app-blue (v1, currently live) and app-green (v2, staging)
# Nginx routes all traffic to blue; switch to green by editing upstream block

# nginx.conf (simplified)
upstream app {
  server app-blue:3000;      # change to app-green:3000 to switch traffic
}
server {
  listen 80;
  location / { proxy_pass http://app; }
}

# Deployment script (blue → green)
#!/bin/bash
set -e
docker pull registry/myapp:v2
docker run -d --name app-green -p 3001:3000 registry/myapp:v2

# Health-check green before switching
until curl -sf http://localhost:3001/healthz; do sleep 2; done

# Switch Nginx upstream (sed or config reload)
sed -i 's/app-blue:3000/app-green:3000/' /etc/nginx/nginx.conf
nginx -s reload

echo "Green is now live. Blue is kept for instant rollback."
# To roll back: sed -i 's/app-green:3000/app-blue:3000/' /etc/nginx/nginx.conf && nginx -s reload


# ── Kubernetes — rolling update (kubectl apply) ─────────────────
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge:       1     # 1 extra pod allowed during rollout (5 total max)
      maxUnavailable: 0     # never take a pod below desired count (zero downtime)
  selector:
    matchLabels: { app: myapp }
  template:
    metadata:
      labels: { app: myapp }
    spec:
      containers:
      - name: myapp
        image: registry/myapp:v2
        readinessProbe:
          httpGet: { path: /healthz, port: 3000 }
          initialDelaySeconds: 5
          periodSeconds: 5
---
# Roll back: kubectl rollout undo deployment/myapp
# Check status: kubectl rollout status deployment/myapp


# ── Kubernetes — canary deployment (replica weighting) ──────────
# Stable deployment (90% traffic — 9 replicas)
kubectl scale deployment myapp-stable --replicas=9

# Canary deployment (10% traffic — 1 replica, same Service selector)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: myapp-canary
spec:
  replicas: 1
  selector:
    matchLabels: { app: myapp, track: canary }
  template:
    metadata:
      labels: { app: myapp, track: canary }
    spec:
      containers:
      - name: myapp
        image: registry/myapp:v2
---
# The Service selects on 'app: myapp' only — routes 1/10 requests to canary
# To promote: kubectl set image deployment/myapp-stable myapp=registry/myapp:v2
# To roll back canary: kubectl delete deployment myapp-canary


# ── Jenkins — canary promotion gate ─────────────────────────────
stage('Canary Gate (5 min soak)') {
  steps {
    script {
      def start = System.currentTimeMillis()
      def soakMs = 5 * 60 * 1000  // 5 minutes
      while (System.currentTimeMillis() - start < soakMs) {
        def errRate = sh(
          script: "curl -sf http://metrics-api/canary/error-rate",
          returnStdout: true
        ).trim().toFloat()
        if (errRate > 0.01) {  // > 1% error rate → abort
          sh 'kubectl delete deployment myapp-canary'
          error "Canary error rate \${errRate * 100}% exceeds 1% — rolling back!"
        }
        sleep 30
      }
      echo "Canary healthy — promoting to 100% production traffic"
      sh 'kubectl scale deployment myapp-stable --replicas=10'
      sh 'kubectl delete deployment myapp-canary'
    }
  }
}`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Implement a local blue/green switch: run two Docker containers (v1 and v2) on ports 3000 and 3001. Write a 10-line shell script that health-checks port 3001 and, once healthy, updates a `docker-compose.yml` service to point to v2 and reloads it. Time how long the switch takes.",
              np: "Local blue/green switch implement गर्नुहोस्: port 3000 र 3001 मा दुई Docker container (v1 र v2) run गर्नुहोस्। Port 3001 health-check गर्ने र healthy भएपछि `docker-compose.yml` service v2 point गर्न update गरी reload गर्ने 10-line shell script लेख्नुहोस्। Switch कति time लिन्छ measure गर्नुहोस्।",
              jp: "ローカルの blue/green スイッチを実装する：ポート 3000 と 3001 で 2 つの Docker コンテナ（v1 と v2）を実行する。ポート 3001 をヘルスチェックし、正常になったら `docker-compose.yml` サービスを v2 にポイントするように更新してリロードする 10 行のシェルスクリプトを書く。スイッチにかかる時間を計測する。",
            },
            {
              en: "Apply a Kubernetes Deployment with `maxSurge: 1` and `maxUnavailable: 0`. While the rollout is in progress, run `kubectl rollout status deployment/myapp` in one terminal and `kubectl get pods -w` in another. Observe pods being added before old ones are removed — confirming zero downtime.",
              np: "`maxSurge: 1` र `maxUnavailable: 0` सहित Kubernetes Deployment apply गर्नुहोस्। Rollout progress मा हुँदा, एउटा terminal मा `kubectl rollout status deployment/myapp` र अर्कोमा `kubectl get pods -w` run गर्नुहोस्। Old pod remove हुनु अघि नै new pod add भएको observe गर्नुहोस् — zero downtime confirm गर्दै।",
              jp: "`maxSurge: 1` と `maxUnavailable: 0` で Kubernetes Deployment を適用する。ロールアウトの進行中に、1 つのターミナルで `kubectl rollout status deployment/myapp` を実行し別のターミナルで `kubectl get pods -w` を実行する。古いポッドが削除される前に新しいポッドが追加されるのを観察する — ゼロダウンタイムを確認。",
            },
            {
              en: "Create a canary deployment alongside a stable deployment (1 canary replica + 4 stable replicas = 20% canary traffic). Use `curl` in a loop to hit the Service 20 times and count how many responses come from the canary version. Then scale canary to 0 and confirm all traffic returns to stable.",
              np: "Stable deployment सँगसाथ canary deployment create गर्नुहोस् (1 canary replica + 4 stable replica = 20% canary traffic)। Service 20 पटक hit गर्न loop मा `curl` प्रयोग गरी canary version बाट कति response आउँछ count गर्नुहोस्। त्यसपछि canary 0 मा scale गरी सबै traffic stable मा फर्केको confirm गर्नुहोस्।",
              jp: "安定したデプロイメントの横にカナリアデプロイメントを作成する（カナリアレプリカ 1 + 安定レプリカ 4 = カナリアトラフィック 20%）。ループで `curl` を使ってサービスを 20 回ヒットしてカナリアバージョンからのレスポンスが何件来るかを数える。次にカナリアを 0 にスケールしてすべてのトラフィックが安定版に戻ることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use canary over blue/green?",
        np: "Blue/green भन्दा canary कहिले प्रयोग गर्नुपर्छ?",
        jp: "Blue/Green よりカナリアをいつ使うべきか？",
      },
      answer: {
        en: "Use canary when you want to validate the new version on real production traffic before committing to a full cutover. Canary is better than blue/green when: (1) your change affects user behaviour and you want real-world metrics (error rate, latency, conversion) rather than synthetic health checks; (2) you cannot afford to run two full identical environments (2× infrastructure cost of blue/green); (3) you want a gradual rollout with automatic promotion criteria. Blue/green is better when: your deployment must be atomic (database schema migration where mixing old and new app versions would cause data corruption); rollback must be instant (SLA requires under 30 seconds); or you are working with stateful systems where a split-brain canary would be dangerous. Many teams combine both: blue/green for the environment switch plus canary weights in the LB for traffic shaping.",
        np: "Canary प्रयोग गर्नुहोस् जब full cutover commit गर्नु अघि real production traffic मा new version validate गर्न चाहनुहुन्छ। Canary blue/green भन्दा राम्रो हुन्छ जब: (1) तपाईंको change ले user behaviour affect गर्छ र synthetic health check भन्दा real-world metric (error rate, latency, conversion) चाहिन्छ; (2) दुई full identical environment run गर्न afford गर्न सक्नुहुन्न (blue/green को 2× infrastructure cost); (3) automatic promotion criteria सहित gradual rollout चाहिन्छ। Blue/green राम्रो हुन्छ जब: तपाईंको deployment atomic हुनुपर्छ (database schema migration जहाँ old र new app version mix गर्दा data corruption हुन्छ); rollback instant हुनुपर्छ (SLA ले 30 second भित्र require); वा stateful system सँग काम गर्दा split-brain canary dangerous हुन्थ्यो। धेरै team दुवै combine गर्छन्: environment switch को लागि blue/green plus traffic shaping को लागि LB मा canary weight।",
        jp: "完全な切り替えにコミットする前に実際の本番トラフィックで新しいバージョンを検証したいときにカナリアを使用します。カナリアが blue/green より優れている場合：(1) 変更がユーザーの行動に影響し、合成ヘルスチェックではなくリアルワールドのメトリクス（エラーレート・レイテンシー・コンバージョン）が必要な場合；(2) 2 つの完全な同一環境を実行する余裕がない場合（blue/green の 2× インフラストラクチャコスト）；(3) 自動昇格基準による段階的なロールアウトが必要な場合。Blue/green が優れている場合：デプロイメントがアトミックでなければならない場合（古いアプリと新しいアプリバージョンの混在がデータ破損を引き起こすデータベーススキーマ移行）；ロールバックが即時でなければならない場合（SLA が 30 秒未満を要求）；またはスプリットブレインのカナリアが危険であるステートフルシステムで作業している場合。多くのチームは両方を組み合わせます：環境切り替えには blue/green + トラフィックシェーピングには LB のカナリア重みを使用。",
      },
      tag: { en: "deploy strategy", np: "Deploy Strategy", jp: "デプロイ戦略" },
    },
    {
      question: {
        en: "What is a readiness probe and why is it critical for rolling updates?",
        np: "Readiness probe के हो र rolling update को लागि यो किन critical छ?",
        jp: "Readiness probe とは何か、なぜローリングアップデートにとって重要か？",
      },
      answer: {
        en: "A readiness probe is a Kubernetes check (HTTP GET, TCP socket, or exec command) that Kubernetes runs against each pod before routing live traffic to it. During a rolling update, Kubernetes only removes a pod from the Service's endpoint list when its readiness probe fails — and only adds the new pod to the endpoint list once its readiness probe succeeds. Without a readiness probe, Kubernetes assumes the pod is ready as soon as the container starts, which may be seconds before the application has fully initialised. This causes `502 Bad Gateway` errors for real traffic hitting the new pod during startup. With a correct readiness probe (`httpGet /healthz`), the rolling update is truly zero-downtime: the new pod only receives traffic after it has confirmed it is ready, and the old pod continues serving traffic until then.",
        np: "Readiness probe एउटा Kubernetes check हो (HTTP GET, TCP socket, वा exec command) जुन Kubernetes ले live traffic route गर्नु अघि हरेक pod मा run गर्छ। Rolling update को बेला, Kubernetes ले pod को readiness probe fail भएपछि मात्र Service को endpoint list बाट pod remove गर्छ — र new pod को readiness probe success भएपछि मात्र endpoint list मा add गर्छ। Readiness probe बिना, Kubernetes ले container start भएपछि immediately pod ready छ भनेर assume गर्छ, जुन application fully initialise हुनुभन्दा second अघि हुन सक्छ। यसले startup को बेला new pod लाई hit गर्ने real traffic को लागि `502 Bad Gateway` error गराउँछ। Correct readiness probe (`httpGet /healthz`) सहित, rolling update truly zero-downtime हुन्छ: new pod ले ready छु confirm गरेपछि मात्र traffic receive गर्छ, र old pod ले तब सम्म traffic serve गर्छ।",
        jp: "Readiness probe は Kubernetes チェック（HTTP GET・TCP ソケット・または exec コマンド）で、Kubernetes がライブトラフィックをルーティングする前に各ポッドに対して実行します。ローリングアップデート中、Kubernetes は readiness probe が失敗したときにのみポッドをサービスのエンドポイントリストから削除し、新しいポッドの readiness probe が成功したときにのみエンドポイントリストに追加します。Readiness probe がないと、Kubernetes はコンテナが起動するとすぐにポッドが準備完了だと想定します。これはアプリケーションが完全に初期化される数秒前かもしれません。これにより起動中に新しいポッドにヒットする実際のトラフィックに対して `502 Bad Gateway` エラーが発生します。正しい readiness probe（`httpGet /healthz`）があれば、ローリングアップデートは真にゼロダウンタイムです：新しいポッドは準備ができていることを確認した後にのみトラフィックを受け取り、古いポッドはそれまでトラフィックを提供し続けます。",
      },
      tag: { en: "kubernetes", np: "Kubernetes", jp: "Kubernetes" },
    },
  ],
};
