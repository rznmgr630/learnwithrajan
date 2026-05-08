import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Every container in Kubernetes should declare **resource requests** (the minimum CPU/memory the scheduler needs to find a node with enough capacity) and **resource limits** (the hard ceiling the container cannot exceed). Without requests, the scheduler places pods randomly and nodes get overloaded. Without limits, a memory-leaking pod can kill its node by consuming all available memory. Requests affect scheduling; limits affect runtime enforcement. CPU is compressible — an over-limit container is throttled but not killed. Memory is incompressible — an over-limit container is OOM-killed immediately. Setting the right values requires profiling your app under load.",
    np: "Kubernetes मा हरेक container ले **resource request** (scheduler लाई node मा पर्याप्त capacity छ भनी find गर्न चाहिने minimum CPU/memory) र **resource limit** (container ले exceed गर्न नसक्ने hard ceiling) declare गर्नुपर्छ। Request बिना, scheduler ले pod randomly place गर्छ र node overloaded हुन्छ। Limit बिना, memory-leaking pod ले available memory सबै consume गरेर आफ्नो node kill गर्न सक्छ। Request ले scheduling affect गर्छ; limit ले runtime enforcement affect गर्छ। CPU compressible हो — over-limit container throttle हुन्छ तर kill हुँदैन। Memory incompressible हो — over-limit container तुरुन्त OOM-kill हुन्छ। सही value set गर्न load अन्तर्गत app profile गर्न आवश्यक छ।",
    jp: "Kubernetes のすべてのコンテナは**リソースリクエスト**（スケジューラーが十分な容量を持つノードを見つけるために必要な最小 CPU/メモリ）と**リソース制限**（コンテナが超えられないハード上限）を宣言すべきです。リクエストがないと、スケジューラーはポッドをランダムに配置してノードが過負荷になります。制限がないと、メモリリークするポッドが利用可能なメモリをすべて消費してノードを落とす可能性があります。リクエストはスケジューリングに影響し；制限はランタイム実施に影響します。CPU は圧縮可能 — 上限超過のコンテナはスロットルされますが kill されません。メモリは圧縮不可 — 上限超過のコンテナは即座に OOM kill されます。適切な値の設定にはロード下でのアプリプロファイリングが必要です。",
  } as const,
  o2: {
    en: "**Horizontal Pod Autoscaler (HPA)** watches a metric (CPU utilisation, memory, or custom metrics via the Metrics API) and automatically scales a Deployment's replica count up when load increases and down when it drops. The HPA controller runs in the control plane and checks metrics every 15 seconds by default. It needs the **Metrics Server** to be installed to read CPU/memory from kubelets. Today you deploy the Metrics Server, set resource requests on a Deployment, create an HPA targeting 50% CPU utilisation, generate load with a stress pod, and watch Kubernetes automatically scale the deployment up then back down.",
    np: "**Horizontal Pod Autoscaler (HPA)** ले metric (CPU utilisation, memory, वा Metrics API मार्फत custom metric) watch गर्छ र load बढ्दा Deployment को replica count automatically scale up गर्छ र कम हुँदा scale down। HPA controller control plane मा run हुन्छ र default मा हर 15 second मा metric check गर्छ। Kubelet बाट CPU/memory read गर्न **Metrics Server** install हुनु आवश्यक छ। आज तपाईंले Metrics Server deploy गर्नुहुनेछ, Deployment मा resource request set गर्नुहुनेछ, 50% CPU utilisation target गर्ने HPA create गर्नुहुनेछ, stress pod सँग load generate गर्नुहुनेछ, र Kubernetes ले automatically deployment scale up र back down गर्छ watch गर्नुहुनेछ।",
    jp: "**Horizontal Pod Autoscaler（HPA）**はメトリクス（CPU 使用率・メモリ・Metrics API 経由のカスタムメトリクス）を監視し、負荷が増加すると Deployment のレプリカ数を自動的にスケールアップし、低下するとスケールダウンします。HPA コントローラーはコントロールプレーンで実行されデフォルトで 15 秒ごとにメトリクスをチェックします。kubelet から CPU/メモリを読み取るには**メトリクスサーバー**のインストールが必要です。今日はメトリクスサーバーをデプロイし、Deployment にリソースリクエストを設定し、50% CPU 使用率を対象とする HPA を作成し、ストレスポッドで負荷を生成し、Kubernetes が自動的にデプロイメントをスケールアップしてから戻る様子を観察します。",
  } as const,
};

export const DEVOPS_DAY_62_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Resource requests, limits & the HPA control loop",
        np: "Resource request, limit र HPA control loop",
        jp: "リソースリクエスト・制限・HPA 制御ループ",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-hpa" },
        {
          type: "table",
          caption: {
            en: "Resource management concepts — requests, limits & autoscaling",
            np: "Resource management concept — request, limit र autoscaling",
            jp: "リソース管理の概念 — リクエスト・制限・自動スケーリング",
          },
          headers: [
            { en: "Concept", np: "Concept", jp: "概念" },
            { en: "What it controls", np: "के control गर्छ", jp: "何を制御するか" },
            { en: "Effect of missing it", np: "नभएको effect", jp: "欠如した場合の影響" },
            { en: "Recommended practice", np: "अनुशंसित अभ्यास", jp: "推奨プラクティス" },
          ],
          rows: [
            [
              { en: "CPU request", np: "CPU request", jp: "CPU リクエスト" },
              { en: "Minimum CPU guaranteed by scheduler when placing pod", np: "Pod place गर्दा scheduler ले guarantee गरेको minimum CPU", jp: "ポッド配置時にスケジューラーが保証する最小 CPU" },
              { en: "Scheduler can't optimise node packing — overloaded or under-used nodes", np: "Scheduler ले node packing optimise गर्न सक्दैन — overloaded वा under-used node", jp: "スケジューラーがノードパッキングを最適化できない — 過負荷または未使用のノード" },
              { en: "Set to average usage (p50) under normal load", np: "Normal load अन्तर्गत average usage (p50) मा set गर्नुहोस्", jp: "通常負荷下での平均使用量（p50）に設定" },
            ],
            [
              { en: "CPU limit", np: "CPU limit", jp: "CPU 制限" },
              { en: "Hard cap — container is throttled if it exceeds this", np: "Hard cap — exceed गर्यो भने container throttle हुन्छ", jp: "ハード上限 — 超過するとコンテナがスロットルされる" },
              { en: "CPU-hungry pods starve neighbours on same node", np: "CPU-hungry pod ले same node मा छिमेकी starve गर्छ", jp: "CPU を多く消費するポッドが同じノードの隣接者を飢えさせる" },
              { en: "Set to 2–4× request; avoid too low (causes artificial throttling)", np: "Request को 2–4× मा set; too low avoid (artificial throttling)", jp: "リクエストの 2〜4 倍に設定；低すぎると人工的なスロットリングが発生" },
            ],
            [
              { en: "Memory request", np: "Memory request", jp: "メモリリクエスト" },
              { en: "Guaranteed memory reserved on the node", np: "Node मा reserved guaranteed memory", jp: "ノードで予約された保証メモリ" },
              { en: "Nodes overcommit memory; pod can be evicted under memory pressure", np: "Node ले memory overcommit गर्छ; memory pressure मा pod evict हुन सक्छ", jp: "ノードがメモリをオーバーコミット；メモリ圧迫時にポッドが退避される可能性" },
              { en: "Set equal to limit for stateful apps to avoid eviction", np: "Eviction avoid गर्न stateful app को लागि limit सँग equal set", jp: "退避を避けるためステートフルアプリはリミットと等しく設定" },
            ],
            [
              { en: "Memory limit", np: "Memory limit", jp: "メモリ制限" },
              { en: "Hard cap — container OOM-killed if it exceeds this", np: "Hard cap — exceed गर्यो भने container OOM-kill हुन्छ", jp: "ハード上限 — 超過するとコンテナが OOM kill される" },
              { en: "Memory leak kills node — evicts all pods on the node", np: "Memory leak ले node kill गर्छ — node मा सबै pod evict", jp: "メモリリークがノードを落とす — ノード上のすべてのポッドが退避" },
              { en: "Set to peak usage + 20% headroom; profile under load first", np: "Peak usage + 20% headroom; load अन्तर्गत पहिले profile गर्नुहोस्", jp: "ピーク使用量 + 20% のヘッドルーム；まず負荷下でプロファイリング" },
            ],
            [
              { en: "HPA", np: "HPA", jp: "HPA" },
              { en: "Scales replica count based on CPU/memory/custom metrics", np: "CPU/memory/custom metric मा आधारित replica count scale गर्छ", jp: "CPU/メモリ/カスタムメトリクスに基づいてレプリカ数をスケール" },
              { en: "Manual scaling only — capacity planning is all-or-nothing", np: "Manual scaling मात्र — capacity planning all-or-nothing", jp: "手動スケーリングのみ — キャパシティプランニングが全か無か" },
              { en: "Requires CPU requests set on pods; use `stabilizationWindowSeconds` to prevent flapping", np: "Pod मा CPU request set हुनुपर्छ; flapping prevent गर्न `stabilizationWindowSeconds` प्रयोग", jp: "ポッドに CPU リクエストが設定されている必要；フラッピングを防ぐために `stabilizationWindowSeconds` を使用" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Setting resource limits and creating an HPA",
        np: "Resource limit set गर्ने र HPA create गर्ने",
        jp: "リソース制限の設定と HPA の作成",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Resource requests/limits in a Deployment + HPA YAML + load test",
            np: "Deployment मा resource request/limit + HPA YAML + load test",
            jp: "Deployment のリソースリクエスト/制限 + HPA YAML + 負荷テスト",
          },
          code: `# ── Install Metrics Server (required for HPA CPU metrics) ─────────
# On Minikube:
minikube addons enable metrics-server
# or via Helm:
helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm install metrics-server metrics-server/metrics-server \
  --set args[0]=--kubelet-insecure-tls -n kube-system

kubectl top nodes                           # CPU/memory per node
kubectl top pods                            # CPU/memory per pod

# ── Deployment with resource requests & limits ───────────────────
# php-apache.yaml (CPU-intensive app for demo)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: php-apache
spec:
  replicas: 1
  selector:
    matchLabels:
      app: php-apache
  template:
    metadata:
      labels:
        app: php-apache
    spec:
      containers:
      - name: php-apache
        image: registry.k8s.io/hpa-example
        ports:
        - containerPort: 80
        resources:
          requests:
            cpu: "100m"          # HPA uses this as baseline for % calculation
            memory: "64Mi"
          limits:
            cpu: "500m"
            memory: "128Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: php-apache
spec:
  selector:
    app: php-apache
  ports:
  - port: 80

# ── HPA — declarative YAML (preferred) ──────────────────────────
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: php-apache-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: php-apache
  minReplicas: 1
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50    # scale when avg CPU > 50% of request
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 60   # wait 60s before scaling down

# ── Or create imperatively ────────────────────────────────────────
kubectl autoscale deployment php-apache \
  --cpu-percent=50 --min=1 --max=10

# ── Watch HPA status ──────────────────────────────────────────────
kubectl get hpa -w                          # TARGETS: 0%/50%
kubectl describe hpa php-apache-hpa         # events show scaling decisions

# ── Generate load to trigger scale-up ────────────────────────────
# Run in a separate terminal:
kubectl run load-generator \
  --image=busybox:1.28 \
  --rm -it \
  -- /bin/sh -c "while true; do wget -q -O- http://php-apache; done"

# Watch in another terminal:
kubectl get hpa -w
# TARGETS    MINPODS   MAXPODS   REPLICAS
# 248%/50%   1         10        1    → scaling up…
# 248%/50%   1         10        5
# 62%/50%    1         10        5

# Stop the load generator (Ctrl+C) — HPA scales back down after stabilizationWindow

# ── ResourceQuota — limit total resources in a namespace ──────────
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: development
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Enable metrics-server on Minikube and wait until `kubectl top nodes` returns CPU and memory data (may take 1–2 minutes). Deploy the `php-apache` deployment above — notice it has `requests.cpu: 100m`. Run `kubectl top pods` and record the baseline CPU usage. This baseline is what HPA uses to calculate percentage utilisation.",
              np: "Minikube मा metrics-server enable गर्नुहोस् र `kubectl top nodes` ले CPU र memory data return गर्न नपुर्दासम्म wait गर्नुहोस् (1–2 minute लाग्न सक्छ)। माथिको `php-apache` deployment deploy गर्नुहोस् — यसमा `requests.cpu: 100m` छ notice गर्नुहोस्। `kubectl top pods` run गर्नुहोस् र baseline CPU usage record गर्नुहोस्। यो baseline नै HPA ले percentage utilisation calculate गर्न प्रयोग गर्छ।",
              jp: "Minikube でメトリクスサーバーを有効にして `kubectl top nodes` が CPU とメモリデータを返すまで待つ（1〜2 分かかる場合あり）。上の `php-apache` デプロイメントをデプロイする — `requests.cpu: 100m` があることに注目する。`kubectl top pods` を実行してベースライン CPU 使用量を記録する。これが HPA がパーセンテージ使用率を計算するために使うベースラインです。",
            },
            {
              en: "Create the HPA targeting 50% CPU. Verify it shows `TARGETS: <current>%/50%` with `kubectl get hpa`. Then run the load generator in a separate terminal. Watch `kubectl get hpa -w` and observe the replica count increase. Note how long it takes to scale up (fast — HPA acts within 15–30s) vs scale down (slow — `stabilizationWindowSeconds` prevents flapping). Stop the load and watch it scale back down.",
              np: "50% CPU target गर्ने HPA create गर्नुहोस्। `kubectl get hpa` सँग `TARGETS: <current>%/50%` show गर्छ verify गर्नुहोस्। त्यसपछि छुट्टै terminal मा load generator run गर्नुहोस्। `kubectl get hpa -w` watch गर्नुहोस् र replica count बढ्ने observe गर्नुहोस्। Scale up गर्न कति समय लाग्छ (fast — HPA 15–30s भित्र act) vs scale down (slow — `stabilizationWindowSeconds` ले flapping prevent गर्छ) note गर्नुहोस्। Load रोक्नुहोस् र scale back down हुने watch गर्नुहोस्।",
              jp: "50% CPU を対象とする HPA を作成する。`kubectl get hpa` で `TARGETS: <current>%/50%` が表示されることを確認する。次に別のターミナルで負荷ジェネレーターを実行する。`kubectl get hpa -w` を監視してレプリカ数が増加するのを観察する。スケールアップにかかる時間（高速 — HPA は 15〜30 秒以内に動作）対スケールダウン（低速 — `stabilizationWindowSeconds` がフラッピングを防ぐ）を記録する。負荷を停止してスケールダウンするのを見る。",
            },
            {
              en: "Intentionally set a memory limit too low (e.g., `memory: 5Mi`) on a pod running a real workload. Observe it gets OOM-killed with `kubectl describe pod` showing `OOMKilled` in the Last State. Then compare this to CPU throttling: set `cpu: 1m` and observe the pod stays running but is slow (throttled). Use `kubectl top pod` to see actual usage. This teaches the critical difference between compressible (CPU) and incompressible (memory) resource limits.",
              np: "Real workload run गर्ने pod मा intentionally too low memory limit (जस्तै, `memory: 5Mi`) set गर्नुहोस्। `kubectl describe pod` सँग Last State मा `OOMKilled` show गर्दै OOM-kill भएको observe गर्नुहोस्। त्यसपछि CPU throttling सँग compare गर्नुहोस्: `cpu: 1m` set गर्नुहोस् र pod running रहन्छ तर slow (throttled) observe गर्नुहोस्। Actual usage हेर्न `kubectl top pod` प्रयोग गर्नुहोस्। यसले compressible (CPU) र incompressible (memory) resource limit बीचको critical difference सिकाउँछ।",
              jp: "実際のワークロードを実行するポッドに意図的に低すぎるメモリ制限（例：`memory: 5Mi`）を設定する。`kubectl describe pod` で Last State に `OOMKilled` が表示されて OOM kill されることを観察する。次に CPU スロットリングと比較する：`cpu: 1m` を設定してポッドが実行したまま遅い（スロットルされた）ことを観察する。`kubectl top pod` を使って実際の使用量を確認する。これが圧縮可能（CPU）と圧縮不可（メモリ）のリソース制限の重要な違いを教えます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between CPU requests and CPU limits in Kubernetes?",
        np: "Kubernetes मा CPU request र CPU limit बीचको फरक के हो?",
        jp: "Kubernetes の CPU リクエストと CPU 制限の違いは何か？",
      },
      answer: {
        en: "**CPU request** is a scheduling hint: it tells the scheduler 'this container needs at least Xm CPU to run well.' The scheduler only places the pod on a node that has at least that much unallocated CPU. Requests affect node selection, not runtime. **CPU limit** is a runtime enforcement: the Linux kernel's CFS bandwidth controller throttles the container if it tries to use more CPU than the limit in a 100ms scheduling period. The container keeps running but gets less CPU time. There is an ongoing debate in the Kubernetes community about whether to set CPU limits at all — if limits are too low they cause artificial throttling even when the node has spare CPU, hurting latency without reason. A popular pattern in production: always set CPU requests (for correct scheduling), but omit CPU limits or set them very high (to avoid artificial throttling), relying on ResourceQuota at the namespace level to cap total cluster usage.",
        np: "**CPU request** scheduling hint हो: scheduler लाई 'यो container राम्ररी run गर्न कम्तीमा Xm CPU चाहिन्छ' बताउँछ। Scheduler ले pod त्यति unallocated CPU नभएको node मा place गर्दैन। Request ले node selection affect गर्छ, runtime होइन। **CPU limit** runtime enforcement हो: Linux kernel को CFS bandwidth controller ले container लाई 100ms scheduling period मा limit भन्दा बढी CPU use गर्ने प्रयास गर्यो भने throttle गर्छ। Container running रहन्छ तर कम CPU time पाउँछ। Kubernetes community मा CPU limit set गर्ने कि नगर्ने भन्ने ongoing debate छ — limit too low भयो भने node मा spare CPU भए पनि artificial throttling cause गर्छ, reason बिना latency hurt गर्छ। Production मा popular pattern: सधैँ CPU request set गर्नुहोस् (correct scheduling को लागि), तर CPU limit omit गर्नुहोस् वा very high set गर्नुहोस् (artificial throttling avoid गर्न), total cluster usage cap गर्न namespace level मा ResourceQuota मा rely गर्नुहोस्।",
        jp: "**CPU リクエスト**はスケジューリングのヒントです：スケジューラーに「このコンテナがうまく動作するために少なくとも Xm CPU が必要」と伝えます。スケジューラーはその量の未割り当て CPU が少なくともあるノードにのみポッドを配置します。リクエストはノード選択に影響し、ランタイムには影響しません。**CPU 制限**はランタイムの実施です：Linux カーネルの CFS 帯域幅コントローラーが 100ms のスケジューリング期間に制限を超えて CPU を使おうとするとコンテナをスロットルします。コンテナは実行し続けますが CPU 時間が少なくなります。Kubernetes コミュニティでは CPU 制限を設定すべきかどうかについて継続的な議論があります — 制限が低すぎると、ノードに空き CPU がある場合でも人工的なスロットリングを引き起こし、理由なくレイテンシーを悪化させます。本番での人気のパターン：常に CPU リクエストを設定する（正しいスケジューリングのため）が、CPU 制限は省略するか非常に高く設定する（人工的なスロットリングを避けるため）、名前空間レベルの ResourceQuota でクラスター全体の使用量を制限する。",
      },
      tag: { en: "requests vs limits", np: "Request vs Limit", jp: "リクエスト vs 制限" },
    },
    {
      question: {
        en: "What is the difference between HPA and VPA (Vertical Pod Autoscaler)?",
        np: "HPA र VPA (Vertical Pod Autoscaler) बीचको फरक के हो?",
        jp: "HPA と VPA（垂直 Pod オートスケーラー）の違いは何か？",
      },
      answer: {
        en: "**HPA (Horizontal Pod Autoscaler)** scales out — it adds or removes pod replicas to handle changing load. It's the most common autoscaling approach in Kubernetes and works well for stateless workloads. When CPU hits 80%, HPA adds a pod; when it drops, HPA removes one. **VPA (Vertical Pod Autoscaler)** scales up — it adjusts the CPU and memory requests/limits of existing pods based on historical usage. Instead of adding pods, it makes each pod bigger (or smaller). VPA is great for workloads that can't be horizontally scaled (singletons, batch jobs) or for right-sizing requests based on real usage data. The major caveat with VPA: to change resource requests, it must evict and restart the pod — there is no in-place resizing in most Kubernetes versions (though in-place pod resizing is being added in K8s 1.27+). In practice: use HPA for stateless apps, VPA in 'Off' recommendation mode to get right-sizing suggestions without disruption, and StatefulSets with manual tuning for databases.",
        np: "**HPA (Horizontal Pod Autoscaler)** scale out गर्छ — changing load handle गर्न pod replica add वा remove गर्छ। यो Kubernetes मा सबैभन्दा common autoscaling approach हो र stateless workload को लागि राम्रो काम गर्छ। CPU 80% पुग्यो भने HPA ले pod add गर्छ; कम भयो भने remove। **VPA (Vertical Pod Autoscaler)** scale up गर्छ — historical usage मा आधारित existing pod को CPU र memory request/limit adjust गर्छ। Pod थप्नुको सट्टा हरेक pod लाई ठूलो (वा सानो) बनाउँछ। VPA ले horizontally scale गर्न नसकिने workload (singleton, batch job) वा real usage data मा आधारित request right-size गर्नको लागि राम्रो हो। VPA को major caveat: resource request change गर्न pod evict र restart गर्नुपर्छ — धेरैजसो Kubernetes version मा in-place resizing छैन (यद्यपि K8s 1.27+ मा in-place pod resizing थपिँदैछ)। Practice मा: stateless app को लागि HPA, disruption बिना right-sizing suggestion पाउन 'Off' recommendation mode मा VPA, र database को लागि manual tuning सहित StatefulSet प्रयोग गर्नुहोस्।",
        jp: "**HPA（水平 Pod オートスケーラー）**はスケールアウトします — 変化する負荷を処理するために Pod レプリカを追加または削除します。これは Kubernetes で最も一般的な自動スケーリングアプローチで、ステートレスなワークロードに適しています。CPU が 80% に達すると HPA はポッドを追加し；低下すると削除します。**VPA（垂直 Pod オートスケーラー）**はスケールアップします — 履歴使用量に基づいて既存ポッドの CPU とメモリのリクエスト/制限を調整します。ポッドを追加する代わりに各ポッドを大きく（または小さく）します。VPA は水平スケールできないワークロード（シングルトン・バッチジョブ）や実際の使用データに基づいてリクエストを適正サイズにするのに適しています。VPA の主な注意事項：リソースリクエストを変更するにはポッドを退避して再起動する必要があります — ほとんどの Kubernetes バージョンではインプレースリサイズができません（ただし K8s 1.27+ でインプレース Pod リサイズが追加されています）。実践では：ステートレスアプリには HPA、中断なしに適正サイズの提案を得るには「Off」推奨モードの VPA、データベースには手動チューニングの StatefulSet を使用します。",
      },
      tag: { en: "HPA vs VPA", np: "HPA vs VPA", jp: "HPA vs VPA" },
    },
  ],
};
