import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Kubernetes networking follows four fundamental rules: (1) every Pod gets its own unique IP address; (2) pods can communicate with every other pod without NAT; (3) nodes can communicate with all pods without NAT; (4) the IP a pod sees itself as is the same IP others see it as. These rules are enforced by a **CNI plugin** (Container Network Interface) — typically Calico, Flannel, or Cilium — that provisions a flat overlay network across all nodes. This design means your application doesn't need to know which node it's running on — pods can talk to each other using their Pod IP directly. In practice though, you never hardcode Pod IPs because Pods are ephemeral. That's where **Services** come in: they provide stable virtual IPs and DNS names that front a set of pods.",
    np: "Kubernetes networking ले चारवटा fundamental rule follow गर्छ: (1) हरेक Pod ले आफ्नै unique IP address पाउँछ; (2) Pod ले NAT बिना अर्को pod सँग communicate गर्न सक्छ; (3) Node ले NAT बिना सबै pod सँग communicate गर्न सक्छ; (4) Pod ले आफू देख्ने IP अरूले देख्ने IP जस्तै छ। यी rule हरू **CNI plugin** (Container Network Interface) — सामान्यतया Calico, Flannel, वा Cilium — ले enforce गर्छ जसले सबै node मा flat overlay network provision गर्छ। यो design को मतलब तपाईंको application ले कुन node मा run भइरहेको छ जान्न आवश्यक छैन — pod हरू direct Pod IP प्रयोग गरेर एकआपसमा कुरा गर्न सक्छन्। Practice मा भने Pod IP hardcode गर्नुहुन्न किनभने Pod ephemeral हुन्छ। त्यहाँ **Service** आउँछ: तिनीहरूले pod को set front गर्ने stable virtual IP र DNS name provide गर्छ।",
    jp: "Kubernetes ネットワーキングは 4 つの基本ルールに従います：(1) すべての Pod が独自の一意の IP アドレスを取得する；(2) Pod は NAT なしにすべての Pod と通信できる；(3) ノードは NAT なしにすべての Pod と通信できる；(4) Pod が自分自身として見る IP は他のものが見る IP と同じ。これらのルールは**CNI プラグイン**（Container Network Interface）— 通常 Calico・Flannel・Cilium — によって実施され、すべてのノードにわたってフラットなオーバーレイネットワークをプロビジョニングします。この設計はアプリケーションがどのノードで実行されているかを知る必要がないことを意味します — Pod は Pod IP を直接使って互いに通信できます。ただし実際には Pod IP をハードコードしません。Pod はエフェメラルだからです。そこで**Service** の出番です：Service は Pod のセットの前に安定した仮想 IP と DNS 名を提供します。",
  } as const,
  o2: {
    en: "**Ingress** is the final piece: it routes external HTTP/HTTPS traffic into the cluster. A Service of type LoadBalancer gives you one load balancer per service (expensive in cloud environments). An Ingress Controller (typically Nginx, Traefik, or AWS ALB Ingress) runs as a pod in your cluster and handles routing rules: `/api` → `api-svc:8080`, `/app` → `frontend-svc:80`, `api.myapp.com` → `api-svc`. One Ingress Controller replaces many LoadBalancer Services. Today you deploy a two-service application, create an Ingress routing rules, and understand how traffic flows from the internet through the Ingress Controller to your Pod.",
    np: "**Ingress** last piece हो: यसले external HTTP/HTTPS traffic cluster भित्र route गर्छ। LoadBalancer type को Service ले per service एउटा load balancer दिन्छ (cloud environment मा expensive)। Ingress Controller (सामान्यतया Nginx, Traefik, वा AWS ALB Ingress) cluster मा pod को रूपमा run हुन्छ र routing rule handle गर्छ: `/api` → `api-svc:8080`, `/app` → `frontend-svc:80`, `api.myapp.com` → `api-svc`। एउटा Ingress Controller ले धेरै LoadBalancer Service replace गर्छ। आज तपाईंले two-service application deploy गर्नुहुनेछ, Ingress routing rule create गर्नुहुनेछ, र internet बाट Ingress Controller मार्फत Pod सम्म traffic कसरी flow हुन्छ बुझ्नुहुनेछ।",
    jp: "**Ingress** は最後のピースです：外部の HTTP/HTTPS トラフィックをクラスターにルーティングします。LoadBalancer タイプの Service はサービスごとに 1 つのロードバランサーを提供します（クラウド環境では高コスト）。Ingress Controller（通常 Nginx・Traefik・AWS ALB Ingress）はクラスター内の Pod として実行され、ルーティングルールを処理します：`/api` → `api-svc:8080`、`/app` → `frontend-svc:80`、`api.myapp.com` → `api-svc`。1 つの Ingress Controller が多くの LoadBalancer Service を置き換えます。今日は 2 サービスアプリケーションをデプロイし、Ingress ルーティングルールを作成し、インターネットから Ingress Controller を通って Pod までのトラフィックフローを理解します。",
  } as const,
};

export const DEVOPS_DAY_60_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Kubernetes networking model — Services, Ingress & traffic flow",
        np: "Kubernetes networking model — Service, Ingress र traffic flow",
        jp: "Kubernetes ネットワーキングモデル — Service・Ingress・トラフィックフロー",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-networking" },
        {
          type: "table",
          caption: {
            en: "Service types and Ingress — traffic routing comparison",
            np: "Service type र Ingress — traffic routing comparison",
            jp: "Service タイプと Ingress — トラフィックルーティング比較",
          },
          headers: [
            { en: "Type", np: "Type", jp: "タイプ" },
            { en: "Accessible from", np: "कहाँबाट accessible", jp: "アクセス元" },
            { en: "How it works", np: "कसरी काम गर्छ", jp: "動作方法" },
            { en: "When to use", np: "कहिले प्रयोग गर्ने", jp: "使う状況" },
          ],
          rows: [
            [
              { en: "ClusterIP", np: "ClusterIP", jp: "ClusterIP" },
              { en: "Inside cluster only", np: "Cluster भित्र मात्र", jp: "クラスター内のみ" },
              { en: "Virtual IP + iptables rules; DNS resolves to stable ClusterIP", np: "Virtual IP + iptables rule; DNS ले stable ClusterIP resolve", jp: "仮想 IP + iptables ルール；DNS が安定した ClusterIP に解決" },
              { en: "Service-to-service communication (database, cache, internal API)", np: "Service-to-service communication (database, cache, internal API)", jp: "サービス間通信（データベース・キャッシュ・内部 API）" },
            ],
            [
              { en: "NodePort", np: "NodePort", jp: "NodePort" },
              { en: "External via any node's IP at port 30000–32767", np: "30000–32767 port मा node को IP मार्फत external", jp: "30000〜32767 ポートで任意のノード IP から外部" },
              { en: "kube-proxy opens the port on every node; routes to ClusterIP → pod", np: "kube-proxy ले हरेक node मा port खोल्छ; ClusterIP → pod मा route गर्छ", jp: "kube-proxy がすべてのノードにポートを開く；ClusterIP → Pod にルーティング" },
              { en: "Local testing / cloud environments without a managed LB", np: "Local testing / managed LB बिना cloud environment", jp: "ローカルテスト / マネージド LB のないクラウド環境" },
            ],
            [
              { en: "LoadBalancer", np: "LoadBalancer", jp: "LoadBalancer" },
              { en: "External via cloud-provisioned IP / DNS", np: "Cloud-provisioned IP / DNS मार्फत external", jp: "クラウドでプロビジョニングされた IP / DNS から外部" },
              { en: "Cloud controller creates AWS NLB / GCP LB; routes to NodePort → pod", np: "Cloud controller ले AWS NLB / GCP LB create गर्छ; NodePort → pod मा route", jp: "クラウドコントローラーが AWS NLB / GCP LB を作成；NodePort → Pod にルーティング" },
              { en: "TCP/UDP services needing a cloud LB (one LB per Service = expensive)", np: "Cloud LB चाहिने TCP/UDP service (per Service एउटा LB = expensive)", jp: "クラウド LB が必要な TCP/UDP サービス（Service ごとに 1 つの LB = 高コスト）" },
            ],
            [
              { en: "Ingress", np: "Ingress", jp: "Ingress" },
              { en: "External HTTP/HTTPS via single LB / NodePort shared by many services", np: "Many service शेयर गर्ने single LB / NodePort मार्फत external HTTP/HTTPS", jp: "多くのサービスが共有する単一 LB / NodePort を介した外部 HTTP/HTTPS" },
              { en: "Ingress Controller (Nginx pod) reads Ingress resources and configures routing", np: "Ingress Controller (Nginx pod) ले Ingress resource read गरेर routing configure गर्छ", jp: "Ingress Controller（Nginx Pod）が Ingress リソースを読んでルーティングを設定" },
              { en: "HTTP/HTTPS apps with path/host routing, TLS termination, auth", np: "Path/host routing, TLS termination, auth सहित HTTP/HTTPS app", jp: "パス/ホストルーティング・TLS 終端・認証を持つ HTTP/HTTPS アプリ" },
            ],
            [
              { en: "NetworkPolicy", np: "NetworkPolicy", jp: "NetworkPolicy" },
              { en: "Not for access — for restricting pod-to-pod traffic", np: "Access को लागि होइन — pod-to-pod traffic restrict गर्न", jp: "アクセスのためではなく — Pod 間トラフィック制限のため" },
              { en: "CNI plugin enforces allow/deny rules based on pod labels + namespaces", np: "CNI plugin ले pod label + namespace मा आधारित allow/deny rule enforce गर्छ", jp: "CNI プラグインが Pod ラベル + 名前空間に基づいて許可/拒否ルールを実施" },
              { en: "Zero-trust security: isolate database pods, restrict frontend→backend flows", np: "Zero-trust security: database pod isolate, frontend→backend flow restrict", jp: "ゼロトラストセキュリティ：データベース Pod の分離・frontend→backend フロー制限" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Ingress Controller setup & path-based routing",
        np: "Ingress Controller setup र path-based routing",
        jp: "Ingress Controller セットアップとパスベースルーティング",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Nginx Ingress Controller + path routing + host routing + TLS + NetworkPolicy",
            np: "Nginx Ingress Controller + path routing + host routing + TLS + NetworkPolicy",
            jp: "Nginx Ingress Controller + パスルーティング + ホストルーティング + TLS + NetworkPolicy",
          },
          code: `# ── Enable Nginx Ingress on Minikube ─────────────────────────────
minikube addons enable ingress
kubectl get pods -n ingress-nginx            # ingress-nginx-controller-xxx Running

# ── Deploy two backend services ───────────────────────────────────
kubectl create deployment api   --image=hashicorp/http-echo -- -text="API service"
kubectl create deployment frontend --image=hashicorp/http-echo -- -text="Frontend"
kubectl expose deployment api      --port=5678 --name=api-svc
kubectl expose deployment frontend --port=5678 --name=frontend-svc

# ── Ingress: path-based routing ───────────────────────────────────
# ingress-path.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /    # strip path prefix
spec:
  ingressClassName: nginx
  rules:
  - http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 5678
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 5678

kubectl apply -f ingress-path.yaml
kubectl get ingress                             # shows ADDRESS (minikube IP)
minikube ip                                     # e.g. 192.168.49.2
curl 192.168.49.2/api                           # → "API service"
curl 192.168.49.2/                              # → "Frontend"

---
# ── Ingress: host-based routing ──────────────────────────────────
# ingress-host.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: app-ingress-host
spec:
  ingressClassName: nginx
  rules:
  - host: api.myapp.local                       # add to /etc/hosts for local test
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: api-svc
            port:
              number: 5678
  - host: app.myapp.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-svc
            port:
              number: 5678
  tls:
  - hosts:
    - api.myapp.local
    - app.myapp.local
    secretName: myapp-tls                       # TLS cert stored as Secret

# echo "$(minikube ip) api.myapp.local app.myapp.local" >> /etc/hosts
# curl -k https://api.myapp.local                # -k skips cert verification

---
# ── NetworkPolicy: isolate the database ──────────────────────────
# netpol-db.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgres-ingress
spec:
  podSelector:
    matchLabels:
      app: postgres                # applies to postgres pods
  policyTypes:
  - Ingress
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: api                 # ONLY api pods can reach postgres
    ports:
    - protocol: TCP
      port: 5432

# Without this policy, any pod in the cluster can reach postgres:5432
# After applying it, curl from a test pod will be blocked

kubectl apply -f netpol-db.yaml
kubectl run test --image=busybox --rm -it -- nc -zv postgres-svc 5432  # blocked
# Run from an api pod: same command succeeds`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Enable the Ingress addon on Minikube and deploy the two echo services above. Apply the `ingress-path.yaml` and test routing with `curl $(minikube ip)/api` and `curl $(minikube ip)/`. Verify that `/api` returns 'API service' and `/` returns 'Frontend'. Check `kubectl describe ingress app-ingress` to see the routing rules and the backend health status.",
              np: "Minikube मा Ingress addon enable गर्नुहोस् र माथिका दुईवटा echo service deploy गर्नुहोस्। `ingress-path.yaml` apply गर्नुहोस् र `curl $(minikube ip)/api` र `curl $(minikube ip)/` सँग routing test गर्नुहोस्। `/api` ले 'API service' र `/` ले 'Frontend' return गर्छ verify गर्नुहोस्। Routing rule र backend health status हेर्न `kubectl describe ingress app-ingress` check गर्नुहोस्।",
              jp: "Minikube で Ingress アドオンを有効にして上の 2 つのエコーサービスをデプロイする。`ingress-path.yaml` を適用して `curl $(minikube ip)/api` と `curl $(minikube ip)/` でルーティングをテストする。`/api` が 'API service' を返し `/` が 'Frontend' を返すことを確認する。`kubectl describe ingress app-ingress` でルーティングルールとバックエンドの健全性ステータスを確認する。",
            },
            {
              en: "Set up host-based routing: add `api.myapp.local` and `app.myapp.local` to your `/etc/hosts` pointing to `$(minikube ip)`. Apply the host-based Ingress and test with `curl http://api.myapp.local` and `curl http://app.myapp.local`. Observe that the same Ingress Controller handles both hostnames — this is how one cloud load balancer handles dozens of services.",
              np: "`$(minikube ip)` point गर्ने `/etc/hosts` मा `api.myapp.local` र `app.myapp.local` add गर्नुहोस्। Host-based Ingress apply गर्नुहोस् र `curl http://api.myapp.local` र `curl http://app.myapp.local` सँग test गर्नुहोस्। Same Ingress Controller ले दुवै hostname handle गर्छ observe गर्नुहोस् — यसरी एउटा cloud load balancer ले dozens of service handle गर्छ।",
              jp: "`$(minikube ip)` を指す `api.myapp.local` と `app.myapp.local` を `/etc/hosts` に追加する。ホストベースの Ingress を適用して `curl http://api.myapp.local` と `curl http://app.myapp.local` でテストする。同じ Ingress Controller が両方のホスト名を処理することを観察する — これが 1 つのクラウドロードバランサーが数十のサービスを処理する方法です。",
            },
            {
              en: "Apply the `netpol-db.yaml` NetworkPolicy to restrict access to the `postgres` pod. Run a test pod with `kubectl run test --image=busybox --rm -it -- nc -zv postgres-svc 5432` — it should be blocked. Then run the same test from inside an `api` pod (or a pod labeled `app=api`) — it should succeed. This demonstrates zero-trust network segmentation in Kubernetes. Check `kubectl describe networkpolicy postgres-ingress` to review the policy.",
              np: "`netpol-db.yaml` NetworkPolicy apply गरेर `postgres` pod को access restrict गर्नुहोस्। `kubectl run test --image=busybox --rm -it -- nc -zv postgres-svc 5432` सँग test pod run गर्नुहोस् — block हुनुपर्छ। त्यसपछि `api` pod भित्रबाट (वा `app=api` label भएको pod) same test run गर्नुहोस् — succeed हुनुपर्छ। यसले Kubernetes मा zero-trust network segmentation demonstrate गर्छ। Policy review गर्न `kubectl describe networkpolicy postgres-ingress` check गर्नुहोस्।",
              jp: "`netpol-db.yaml` NetworkPolicy を適用して `postgres` Pod へのアクセスを制限する。`kubectl run test --image=busybox --rm -it -- nc -zv postgres-svc 5432` でテスト Pod を実行する — ブロックされるはずです。次に `api` Pod 内から（または `app=api` とラベルされた Pod から）同じテストを実行する — 成功するはずです。これが Kubernetes のゼロトラストネットワークセグメンテーションを示します。`kubectl describe networkpolicy postgres-ingress` でポリシーを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Service and an Ingress? When do I use each?",
        np: "Service र Ingress बीचको फरक के हो? कहिले कुन प्रयोग गर्ने?",
        jp: "Service と Ingress の違いは何か？それぞれをいつ使うか？",
      },
      answer: {
        en: "A **Service** is a Kubernetes networking primitive that gives a stable IP/DNS to a set of pods and load-balances connections among them. Services operate at L4 (TCP/UDP) — they can route any TCP or UDP connection. An **Ingress** is an L7 (HTTP/HTTPS) routing layer that sits in front of Services and routes based on URL path, hostname, headers, or cookies. The typical production pattern: one cloud load balancer → Ingress Controller (Nginx pod) → multiple Services → pods. With pure LoadBalancer Services, you'd pay for one cloud LB per service. With Ingress, you pay for one cloud LB and the Nginx Ingress Controller handles all HTTP routing internally. Use a Service alone when you need TCP/UDP (database, message queue, non-HTTP API). Use Ingress for HTTP/HTTPS apps that need path or host routing, SSL termination, rate limiting, or authentication middleware.",
        np: "**Service** एउटा Kubernetes networking primitive हो जसले pod को set लाई stable IP/DNS दिन्छ र तिनीहरूमाझ connection load-balance गर्छ। Service ले L4 (TCP/UDP) मा operate गर्छ — कुनै पनि TCP वा UDP connection route गर्न सक्छ। **Ingress** एउटा L7 (HTTP/HTTPS) routing layer हो जुन Service को अगाडि बस्छ र URL path, hostname, header, वा cookie मा आधारित route गर्छ। Typical production pattern: एउटा cloud load balancer → Ingress Controller (Nginx pod) → multiple Service → pod। Pure LoadBalancer Service सँग per service एउटा cloud LB को लागि pay गर्नुपर्छ। Ingress सँग एउटा cloud LB को लागि pay गर्नुहोस् र Nginx Ingress Controller ले internally सबै HTTP routing handle गर्छ। TCP/UDP (database, message queue, non-HTTP API) चाहिँदा Service मात्र प्रयोग गर्नुहोस्। Path वा host routing, SSL termination, rate limiting, वा authentication middleware चाहिने HTTP/HTTPS app को लागि Ingress प्रयोग गर्नुहोस्।",
        jp: "**Service** は Pod のセットに安定した IP/DNS を与え、それらの間で接続を負荷分散する Kubernetes ネットワーキングのプリミティブです。Service は L4（TCP/UDP）で動作します — 任意の TCP または UDP 接続をルーティングできます。**Ingress** は Service の前に座って URL パス・ホスト名・ヘッダー・クッキーに基づいてルーティングする L7（HTTP/HTTPS）ルーティングレイヤーです。典型的な本番パターン：1 つのクラウド LB → Ingress Controller（Nginx Pod）→ 複数の Service → Pod。純粋な LoadBalancer Service ではサービスごとに 1 つのクラウド LB の料金を払います。Ingress では 1 つのクラウド LB の料金を払い、Nginx Ingress Controller がすべての HTTP ルーティングを内部で処理します。TCP/UDP（データベース・メッセージキュー・非 HTTP API）が必要な場合は Service のみを使用します。パスまたはホストルーティング・SSL 終端・レート制限・認証ミドルウェアが必要な HTTP/HTTPS アプリには Ingress を使用します。",
      },
      tag: { en: "service vs ingress", np: "Service vs Ingress", jp: "Service vs Ingress" },
    },
    {
      question: {
        en: "What is a NetworkPolicy and why doesn't Kubernetes enforce any by default?",
        np: "NetworkPolicy के हो र Kubernetes ले default मा किन enforce गर्दैन?",
        jp: "NetworkPolicy とは何か、なぜ Kubernetes はデフォルトで何も実施しないのか？",
      },
      answer: {
        en: "By default, Kubernetes has **no network isolation**: every pod can talk to every other pod across all namespaces on all ports. This is by design — Kubernetes prioritizes operational simplicity for new users, and network segmentation is an application-level concern. A **NetworkPolicy** is a resource you create to express allow/deny rules for pod-to-pod traffic using label selectors and namespace selectors. Important caveats: (1) NetworkPolicies are only enforced if your CNI plugin supports them — Flannel does NOT enforce NetworkPolicies; Calico, Cilium, and Weave do. (2) NetworkPolicies are additive and allow-only — there is no explicit deny; once you create a NetworkPolicy that selects a pod, all traffic to that pod not matched by an allow rule is denied. (3) By default (no policy), all traffic is allowed. In production, adopt a zero-trust model: create a default-deny policy for each namespace, then explicitly allow only the flows you need (frontend → backend → database, but not frontend → database directly).",
        np: "Default मा, Kubernetes सँग **कुनै network isolation छैन**: हरेक pod ले सबै namespace मा सबै port मा अर्को pod सँग कुरा गर्न सक्छ। यो design अनुसार हो — Kubernetes ले new user को लागि operational simplicity prioritize गर्छ, र network segmentation application-level concern हो। **NetworkPolicy** एउटा resource हो जुन तपाईंले label selector र namespace selector प्रयोग गरेर pod-to-pod traffic को allow/deny rule express गर्न create गर्नुहुन्छ। महत्त्वपूर्ण caveat: (1) NetworkPolicy ले CNI plugin ले support गरे मात्र enforce हुन्छ — Flannel ले NetworkPolicy enforce **गर्दैन**; Calico, Cilium, र Weave ले गर्छन्। (2) NetworkPolicy additive र allow-only हुन्छ — explicit deny छैन; एकपटक pod select गर्ने NetworkPolicy create गर्दा, allow rule ले match नगरेको त्यो pod मा सबै traffic denied हुन्छ। (3) Default मा (कुनै policy छैन), सबै traffic allowed हुन्छ। Production मा, zero-trust model adopt गर्नुहोस्: हरेक namespace को लागि default-deny policy create गर्नुहोस्, त्यसपछि explicitly आवश्यक flow मात्र allow गर्नुहोस् (frontend → backend → database, तर frontend → database directly होइन)।",
        jp: "デフォルトでは Kubernetes に**ネットワーク分離がありません**：すべての Pod がすべての名前空間のすべてのポートで他のすべての Pod と通信できます。これは設計によるもの — Kubernetes は新しいユーザーの運用上のシンプルさを優先し、ネットワークセグメンテーションはアプリケーションレベルの関心事です。**NetworkPolicy** はラベルセレクターと名前空間セレクターを使って Pod 間トラフィックの許可/拒否ルールを表現するために作成するリソースです。重要な注意事項：(1) NetworkPolicy は CNI プラグインがサポートする場合のみ実施されます — Flannel は NetworkPolicy を実施**しません**；Calico・Cilium・Weave は実施します。(2) NetworkPolicy は加算的で許可のみです — 明示的な拒否はありません；Pod を選択する NetworkPolicy を作成すると、許可ルールにマッチしないその Pod へのすべてのトラフィックが拒否されます。(3) デフォルト（ポリシーなし）ではすべてのトラフィックが許可されます。本番ではゼロトラストモデルを採用します：各名前空間のデフォルト拒否ポリシーを作成し、次に必要なフローのみを明示的に許可します（frontend → backend → database、ただし frontend → database は直接不可）。",
      },
      tag: { en: "network policy", np: "Network Policy", jp: "ネットワークポリシー" },
    },
  ],
};
