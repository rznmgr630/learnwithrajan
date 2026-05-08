import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A bare Pod is the smallest deployable unit in Kubernetes, but you almost never create bare Pods in production. If a bare Pod's node dies, the Pod is gone forever — nobody reschedules it. That's why Kubernetes gives you higher-level abstractions: a **Deployment** wraps a **ReplicaSet**, which ensures a declared number of identical Pod replicas are always running. If a Pod crashes or its node fails, the ReplicaSet controller immediately creates a replacement. A Deployment also adds rolling update logic — so you can change the container image and Kubernetes will incrementally replace old Pods with new ones, with automatic rollback if health checks fail.",
    np: "Bare Pod Kubernetes मा सबैभन्दा सानो deployable unit हो, तर production मा तपाईंले कहिल्यै bare Pod create गर्नुहुन्न। Bare Pod को node die भयो भने Pod सधैँका लागि gone हुन्छ — कसैले reschedule गर्दैन। यसैले Kubernetes ले higher-level abstraction दिन्छ: **Deployment** ले **ReplicaSet** wrap गर्छ, जसले declared number को identical Pod replica सधैँ running छन् ensure गर्छ। Pod crash भयो वा node fail भयो भने ReplicaSet controller ले immediately replacement create गर्छ। Deployment ले rolling update logic पनि थप्छ — त्यसैले container image change गर्न सकिन्छ र Kubernetes ले gradually old Pod लाई new सँग replace गर्छ, health check fail भयो भने automatic rollback सहित।",
    jp: "裸の Pod は Kubernetes の最小デプロイ可能単位ですが、本番環境ではほとんど裸の Pod を作成しません。裸の Pod のノードが落ちると、その Pod は永遠に消えます — 誰も再スケジュールしません。だから Kubernetes はより高レベルの抽象化を提供します：**Deployment** は **ReplicaSet** をラップし、宣言された数の同一 Pod レプリカが常に実行されていることを保証します。Pod がクラッシュしたりノードが障害を起こすと、ReplicaSet コントローラーはすぐに代替を作成します。Deployment はローリングアップデートロジックも追加します — コンテナイメージを変更すると Kubernetes は古い Pod を新しいものに段階的に置き換え、ヘルスチェックが失敗した場合は自動ロールバックします。",
  } as const,
  o2: {
    en: "A **Service** solves the Pod IP problem: Pods are ephemeral and each gets a new IP when recreated. A Service is a stable virtual IP (ClusterIP) with a DNS name that load-balances traffic across all matching Pods using label selectors. Today you create a Deployment with 3 replicas, expose it with a Service, scale it up and down, trigger a rolling update, and observe how Kubernetes routes traffic to the healthy Pods throughout. You also learn the four Service types — ClusterIP, NodePort, LoadBalancer, and ExternalName — and when to use each.",
    np: "**Service** ले Pod IP problem solve गर्छ: Pod ephemeral हुन्छ र recreate हुँदा नया IP पाउँछ। Service एउटा stable virtual IP (ClusterIP) हो DNS name सहित जसले label selector प्रयोग गरेर matching Pod हरूमा traffic load-balance गर्छ। आज तपाईंले 3 replica सहित Deployment create गर्नुहुनेछ, Service सँग expose गर्नुहुनेछ, scale up र down गर्नुहुनेछ, rolling update trigger गर्नुहुनेछ, र Kubernetes ले throughout healthy Pod हरूमा traffic route गर्छ observe गर्नुहुनेछ। साथै चारवटा Service type — ClusterIP, NodePort, LoadBalancer, र ExternalName — र कहिले कुन प्रयोग गर्ने सिक्नुहुनेछ।",
    jp: "**Service** は Pod IP の問題を解決します：Pod はエフェメラルで再作成されるたびに新しい IP を取得します。Service はラベルセレクターを使用してマッチするすべての Pod にトラフィックを負荷分散する DNS 名を持つ安定した仮想 IP（ClusterIP）です。今日は 3 つのレプリカを持つ Deployment を作成し、Service で公開し、スケールアップ・ダウンし、ローリングアップデートをトリガーし、Kubernetes が全体を通じて正常な Pod にトラフィックをルーティングする様子を観察します。また 4 種類の Service タイプ — ClusterIP・NodePort・LoadBalancer・ExternalName — といつそれぞれを使うかを学びます。",
  } as const,
};

export const DEVOPS_DAY_58_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Deployments, ReplicaSets & Services — core workload abstractions",
        np: "Deployment, ReplicaSet र Service — core workload abstraction",
        jp: "Deployment・ReplicaSet・Service — コアワークロード抽象化",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-workloads" },
        {
          type: "table",
          caption: {
            en: "Kubernetes workload resources and Service types",
            np: "Kubernetes workload resource र Service type",
            jp: "Kubernetes ワークロードリソースと Service タイプ",
          },
          headers: [
            { en: "Resource", np: "Resource", jp: "リソース" },
            { en: "Purpose", np: "उद्देश्य", jp: "目的" },
            { en: "Key fields", np: "मुख्य field", jp: "主要フィールド" },
            { en: "Use when", np: "कहिले प्रयोग", jp: "使う状況" },
          ],
          rows: [
            [
              { en: "Pod", np: "Pod", jp: "Pod" },
              { en: "Smallest unit — 1+ containers sharing network & storage", np: "सबैभन्दा सानो unit — network र storage share गर्ने 1+ container", jp: "最小単位 — ネットワークとストレージを共有する 1 つ以上のコンテナ" },
              { en: "`spec.containers`, `resources`", np: "`spec.containers`, `resources`", jp: "`spec.containers`・`resources`" },
              { en: "Never alone in prod — use Deployment instead", np: "Production मा कहिल्यै alone नहोस् — Deployment प्रयोग गर्नुहोस्", jp: "本番では単独使用禁止 — 代わりに Deployment を使う" },
            ],
            [
              { en: "ReplicaSet", np: "ReplicaSet", jp: "ReplicaSet" },
              { en: "Ensures N identical pod replicas are always running", np: "N identical pod replica सधैँ running ensure गर्छ", jp: "N 個の同一 Pod レプリカが常に実行されていることを保証" },
              { en: "`spec.replicas`, `selector`, `template`", np: "`spec.replicas`, `selector`, `template`", jp: "`spec.replicas`・`selector`・`template`" },
              { en: "Managed by Deployment — rarely created directly", np: "Deployment ले manage गर्छ — rarely directly create", jp: "Deployment が管理 — 直接作成はほとんどしない" },
            ],
            [
              { en: "Deployment", np: "Deployment", jp: "Deployment" },
              { en: "Manages ReplicaSets + rolling updates + rollback history", np: "ReplicaSet + rolling update + rollback history manage गर्छ", jp: "ReplicaSet + ローリングアップデート + ロールバック履歴を管理" },
              { en: "`spec.strategy`, `minReadySeconds`, `revisionHistoryLimit`", np: "`spec.strategy`, `minReadySeconds`, `revisionHistoryLimit`", jp: "`spec.strategy`・`minReadySeconds`・`revisionHistoryLimit`" },
              { en: "Stateless apps — web servers, APIs, workers", np: "Stateless app — web server, API, worker", jp: "ステートレスアプリ — Web サーバー・API・ワーカー" },
            ],
            [
              { en: "Service: ClusterIP", np: "Service: ClusterIP", jp: "Service: ClusterIP" },
              { en: "Stable internal IP + DNS name, reachable only inside cluster", np: "Stable internal IP + DNS name, cluster भित्र मात्र reachable", jp: "安定した内部 IP + DNS 名、クラスター内からのみ到達可能" },
              { en: "`spec.selector`, `spec.ports`", np: "`spec.selector`, `spec.ports`", jp: "`spec.selector`・`spec.ports`" },
              { en: "Internal service-to-service communication (default)", np: "Internal service-to-service communication (default)", jp: "内部サービス間通信（デフォルト）" },
            ],
            [
              { en: "Service: NodePort", np: "Service: NodePort", jp: "Service: NodePort" },
              { en: "Opens a port (30000–32767) on every node's IP", np: "हरेक node को IP मा port (30000–32767) खोल्छ", jp: "すべてのノードの IP にポート（30000〜32767）を開く" },
              { en: "`spec.type: NodePort`, `nodePort`", np: "`spec.type: NodePort`, `nodePort`", jp: "`spec.type: NodePort`・`nodePort`" },
              { en: "Dev/testing external access without a cloud LB", np: "Cloud LB बिना dev/testing external access", jp: "クラウド LB なしの開発/テスト外部アクセス" },
            ],
            [
              { en: "Service: LoadBalancer", np: "Service: LoadBalancer", jp: "Service: LoadBalancer" },
              { en: "Provisions a cloud load balancer (AWS NLB, GCP LB) automatically", np: "Cloud load balancer (AWS NLB, GCP LB) automatically provision गर्छ", jp: "クラウドロードバランサー（AWS NLB・GCP LB）を自動プロビジョニング" },
              { en: "`spec.type: LoadBalancer`", np: "`spec.type: LoadBalancer`", jp: "`spec.type: LoadBalancer`" },
              { en: "Production external traffic — prefer Ingress for HTTP", np: "Production external traffic — HTTP को लागि Ingress prefer", jp: "本番外部トラフィック — HTTP には Ingress を優先" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Creating, scaling & updating Deployments",
        np: "Deployment create, scale र update गर्ने",
        jp: "Deployment の作成・スケール・アップデート",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Deployment + Service YAML and kubectl lifecycle commands",
            np: "Deployment + Service YAML र kubectl lifecycle command",
            jp: "Deployment + Service YAML と kubectl ライフサイクルコマンド",
          },
          code: `# ── deployment.yaml ──────────────────────────────────────────────
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp           # must match template.metadata.labels
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1           # allow 1 extra pod during update
      maxUnavailable: 0     # never kill old pod before new is ready
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: nginx:1.25-alpine
        ports:
        - containerPort: 80
        readinessProbe:     # pod is not routed traffic until this passes
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            cpu: "50m"
            memory: "64Mi"
          limits:
            cpu: "200m"
            memory: "128Mi"

---
# ── service.yaml ─────────────────────────────────────────────────
apiVersion: v1
kind: Service
metadata:
  name: webapp-svc
spec:
  selector:
    app: webapp             # routes to all pods with label app=webapp
  ports:
  - port: 80               # service port (cluster-internal)
    targetPort: 80          # container port
  type: ClusterIP           # internal only (default)

---
# ── NodePort for local testing ────────────────────────────────────
apiVersion: v1
kind: Service
metadata:
  name: webapp-nodeport
spec:
  selector:
    app: webapp
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080         # access at <node-ip>:30080
  type: NodePort


# ── Deploy & verify ───────────────────────────────────────────────
kubectl apply -f deployment.yaml -f service.yaml
kubectl get deployments                   # READY 3/3
kubectl get pods -l app=webapp            # three pods
kubectl get replicasets                   # see the RS Deployment created

# ── Scale up / down ───────────────────────────────────────────────
kubectl scale deployment webapp --replicas=5
kubectl get pods -w                       # watch pods start up

# ── Rolling update ────────────────────────────────────────────────
kubectl set image deployment/webapp webapp=nginx:1.26-alpine
kubectl rollout status deployment/webapp  # watch the rollout
kubectl rollout history deployment/webapp # revision history

# ── Rollback ─────────────────────────────────────────────────────
kubectl set image deployment/webapp webapp=nginx:broken-image
kubectl rollout status deployment/webapp  # will stall
kubectl rollout undo deployment/webapp    # roll back to previous revision
kubectl rollout undo deployment/webapp --to-revision=1  # specific revision

# ── Verify Service routing ────────────────────────────────────────
kubectl run test --image=busybox --rm -it -- wget -O- webapp-svc  # hits service DNS
minikube service webapp-nodeport          # opens NodePort in browser`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Apply the `deployment.yaml` above with 3 replicas. Run `kubectl get pods -l app=webapp` and verify three pods are Running. Then manually delete one pod and watch Kubernetes immediately create a replacement — this is the ReplicaSet controller's reconciliation loop. Run `kubectl describe replicaset` to see the events that triggered the replacement.",
              np: "माथिको `deployment.yaml` 3 replica सहित apply गर्नुहोस्। `kubectl get pods -l app=webapp` run गर्नुहोस् र तीनवटा pod Running छन् verify गर्नुहोस्। त्यसपछि manually एउटा pod delete गर्नुहोस् र Kubernetes ले immediately replacement create गर्छ watch गर्नुहोस् — यो ReplicaSet controller को reconciliation loop हो। Replacement trigger गर्ने event हेर्न `kubectl describe replicaset` run गर्नुहोस्।",
              jp: "上の `deployment.yaml` を 3 レプリカで適用する。`kubectl get pods -l app=webapp` を実行して 3 つのポッドが実行中であることを確認する。次に手動でポッドを 1 つ削除して Kubernetes がすぐに代替を作成するのを見る — これが ReplicaSet コントローラーの調整ループです。`kubectl describe replicaset` を実行して代替をトリガーしたイベントを確認する。",
            },
            {
              en: "Perform a rolling update: change the image from `nginx:1.25-alpine` to `nginx:1.26-alpine` using `kubectl set image`. Watch the rollout with `kubectl rollout status deployment/webapp`. Observe that traffic is never interrupted — old pods are removed only after new pods pass the readiness probe. Check `kubectl rollout history` for the revision record.",
              np: "`kubectl set image` प्रयोग गरेर image `nginx:1.25-alpine` बाट `nginx:1.26-alpine` मा change गरेर rolling update गर्नुहोस्। `kubectl rollout status deployment/webapp` सँग rollout watch गर्नुहोस्। Traffic कहिल्यै interrupt नहुने observe गर्नुहोस् — new pod ले readiness probe pass गरेपछि मात्र old pod remove हुन्छ। Revision record को लागि `kubectl rollout history` check गर्नुहोस्।",
              jp: "`kubectl set image` を使ってイメージを `nginx:1.25-alpine` から `nginx:1.26-alpine` に変更してローリングアップデートを実行する。`kubectl rollout status deployment/webapp` でロールアウトを監視する。トラフィックが決して中断されないことを観察する — 新しいポッドがレディネスプローブを通過した後にのみ古いポッドが削除されます。リビジョン記録のために `kubectl rollout history` を確認する。",
            },
            {
              en: "Intentionally break a deployment by setting the image to a non-existent tag (e.g., `nginx:does-not-exist`). Watch `kubectl rollout status` hang. Check `kubectl get pods` and identify the ImagePullBackOff pod. Then rollback with `kubectl rollout undo deployment/webapp` and verify the deployment returns to healthy. This tests the production safety net of rolling updates.",
              np: "Intentionally deployment break गर्न non-existent tag (जस्तै, `nginx:does-not-exist`) मा image set गर्नुहोस्। `kubectl rollout status` hang हुने watch गर्नुहोस्। `kubectl get pods` check गर्नुहोस् र ImagePullBackOff pod identify गर्नुहोस्। त्यसपछि `kubectl rollout undo deployment/webapp` सँग rollback गर्नुहोस् र deployment healthy मा return भएको verify गर्नुहोस्। यसले rolling update को production safety net test गर्छ।",
              jp: "意図的に存在しないタグ（例：`nginx:does-not-exist`）にイメージを設定してデプロイメントを壊す。`kubectl rollout status` がハングするのを見る。`kubectl get pods` を確認して ImagePullBackOff ポッドを特定する。次に `kubectl rollout undo deployment/webapp` でロールバックしてデプロイメントが正常に戻ることを確認する。これはローリングアップデートの本番セーフティネットをテストします。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Pod, a ReplicaSet, and a Deployment?",
        np: "Pod, ReplicaSet, र Deployment बीचको फरक के हो?",
        jp: "Pod・ReplicaSet・Deployment の違いは何か？",
      },
      answer: {
        en: "Think of them as three layers of abstraction. A **Pod** is one or more containers running together on a node — it has no self-healing; if it dies, it's gone. A **ReplicaSet** watches a set of pods and ensures N replicas always exist — if a pod dies, it creates a replacement. But a ReplicaSet has no concept of updating your application; changing the image means deleting the old RS and creating a new one manually. A **Deployment** manages ReplicaSets and adds update strategy: when you change the image, it creates a new ReplicaSet with the new image and incrementally scales it up while scaling down the old one (rolling update). It also keeps a history of old ReplicaSets so you can roll back. In practice: always use Deployments for stateless apps. You will rarely create bare Pods or ReplicaSets directly.",
        np: "तिनीहरूलाई abstraction को तीन layer को रूपमा सोच्नुहोस्। **Pod** एउटा node मा एकसाथ run हुने एक वा बढी container हो — self-healing छैन; die भयो भने gone। **ReplicaSet** ले pod को set watch गर्छ र N replica सधैँ exist ensure गर्छ — pod die भयो भने replacement create गर्छ। तर ReplicaSet सँग application update को concept छैन; image change गर्नु भनेको manually old RS delete गरेर new create गर्नु। **Deployment** ले ReplicaSet manage गर्छ र update strategy थप्छ: image change गर्दा, new image सहित new ReplicaSet create गर्छ र gradually scale up गर्छ old लाई scale down गर्दै (rolling update)। यसले rollback गर्न सकिने old ReplicaSet को history पनि राख्छ। Practice मा: stateless app को लागि सधैँ Deployment प्रयोग गर्नुहोस्। Bare Pod वा ReplicaSet directly rarely create गर्नुहुनेछ।",
        jp: "3 つの抽象化レイヤーとして考えてください。**Pod** はノード上で一緒に実行される 1 つ以上のコンテナです — 自己修復なし；死んだら消えます。**ReplicaSet** はポッドのセットを監視して N レプリカが常に存在することを保証します — ポッドが死ぬと代替を作成します。しかし ReplicaSet にはアプリケーション更新の概念がありません；イメージを変更するには古い RS を削除して手動で新しいものを作成する必要があります。**Deployment** は ReplicaSet を管理して更新戦略を追加します：イメージを変更すると、新しいイメージで新しい ReplicaSet を作成し、古いものをスケールダウンしながら段階的にスケールアップします（ローリングアップデート）。また古い ReplicaSet の履歴を保持しているのでロールバックできます。実践では：ステートレスアプリには常に Deployment を使用します。裸の Pod や ReplicaSet を直接作成することはほとんどありません。",
      },
      tag: { en: "abstractions", np: "Abstraction", jp: "抽象化" },
    },
    {
      question: {
        en: "How does Kubernetes Service discovery work? How does a Pod find another Service by name?",
        np: "Kubernetes Service discovery कसरी काम गर्छ? Pod ले अर्को Service नाम अनुसार कसरी find गर्छ?",
        jp: "Kubernetes Service discovery はどう機能するか？Pod が名前で別の Service を見つけるには？",
      },
      answer: {
        en: "Kubernetes uses CoreDNS (running in kube-system) as the cluster DNS server. Every Service gets a DNS name in the pattern `<service-name>.<namespace>.svc.cluster.local`. Within the same namespace you can use the short form: just `<service-name>`. So if your backend Deployment creates a Service named `api-svc`, your frontend Pod can reach it at `http://api-svc` — no IP addresses, no hardcoded hosts. How does it work under the hood? When you create a Service, kube-proxy (running on every node) programs iptables rules (or ipvs rules) that intercept traffic to the Service's ClusterIP and forward it to one of the healthy matching Pods. CoreDNS resolves `api-svc` to the ClusterIP (10.96.x.x), iptables catches that and forwards it to a real Pod IP. This is why Pods can scale up/down without breaking connections — the Service IP is stable even though Pod IPs change.",
        np: "Kubernetes ले cluster DNS server को रूपमा CoreDNS (kube-system मा running) प्रयोग गर्छ। हरेक Service ले `<service-name>.<namespace>.svc.cluster.local` pattern मा DNS name पाउँछ। Same namespace भित्र short form प्रयोग गर्न सकिन्छ: `<service-name>` मात्र। त्यसैले backend Deployment ले `api-svc` नामको Service create गर्यो भने, frontend Pod ले `http://api-svc` मा reach गर्न सक्छ — कुनै IP address, कुनै hardcoded host छैन। Under the hood कसरी काम गर्छ? Service create गर्दा, kube-proxy (हरेक node मा running) ले Service को ClusterIP मा traffic intercept गरेर matching healthy Pod मध्ये एउटामा forward गर्ने iptables rule (वा ipvs rule) program गर्छ। CoreDNS ले `api-svc` लाई ClusterIP (10.96.x.x) मा resolve गर्छ, iptables ले catch गरेर real Pod IP मा forward गर्छ। यसैले Pod scale up/down हुँदा connection break हुँदैन — Service IP stable हुन्छ Pod IP change हुँदा पनि।",
        jp: "Kubernetes はクラスター DNS サーバーとして CoreDNS（kube-system で実行）を使用します。すべての Service は `<service-name>.<namespace>.svc.cluster.local` のパターンで DNS 名を取得します。同じ名前空間内では短縮形を使えます：`<service-name>` だけ。したがってバックエンド Deployment が `api-svc` という名前の Service を作成すると、フロントエンド Pod は `http://api-svc` でそれにアクセスできます — IP アドレスなし、ハードコードされたホストなし。内部ではどう動くか？Service を作成すると kube-proxy（すべてのノードで実行）が Service の ClusterIP へのトラフィックを傍受して一致する正常な Pod の 1 つに転送する iptables ルール（または ipvs ルール）を設定します。CoreDNS は `api-svc` を ClusterIP（10.96.x.x）に解決し、iptables がそれをキャッチして実際の Pod IP に転送します。これが Pod がスケールアップ/ダウンしても接続が切れない理由です — Pod IP が変わっても Service IP は安定しています。",
      },
      tag: { en: "service discovery", np: "Service Discovery", jp: "サービスディスカバリー" },
    },
  ],
};
