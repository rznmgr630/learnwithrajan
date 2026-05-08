import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "When you run a single Docker container on your laptop, Docker is enough. But in production you need dozens — sometimes hundreds — of containers running across multiple machines, recovering from failures, scaling up when traffic spikes, and rolling out new versions without downtime. Doing this manually is impossible. Kubernetes (K8s) is the open-source container orchestrator that solves this: you declare *what* you want (3 replicas of this image, always listening on port 80) and Kubernetes continuously reconciles the cluster state to match your declaration. If a node dies, K8s reschedules its pods elsewhere. If a pod crashes, K8s restarts it. If traffic surges, K8s adds pods. You describe intent; the control plane does the work.",
    np: "आफ्नो laptop मा single Docker container run गर्दा Docker नै पर्याप्त छ। तर production मा dozens — कहिलेकाहीँ hundreds — container हरू multiple machine मा run गर्न, failure बाट recover गर्न, traffic spike मा scale up गर्न, र downtime बिना नया version rollout गर्न आवश्यक हुन्छ। यो manually गर्नु असम्भव छ। Kubernetes (K8s) open-source container orchestrator हो जसले यो solve गर्छ: तपाईंले *के* चाहिन्छ भनी declare गर्नुहोस् (यो image को 3 replica, port 80 मा सधैँ listen) र Kubernetes ले cluster state लाई तपाईंको declaration सँग match गर्न continuously reconcile गर्छ। कुनै node die भयो भने K8s ले त्यसका pod अन्यत्र reschedule गर्छ। Pod crash भयो भने K8s ले restart गर्छ। Traffic surge भयो भने K8s ले pod थप्छ। तपाईंले intent describe गर्नुहोस्; control plane ले काम गर्छ।",
    jp: "ラップトップで単一の Docker コンテナを実行するなら Docker で十分です。しかし本番環境では何十、時に何百ものコンテナを複数のマシンで実行し、障害から回復し、トラフィックスパイク時にスケールアップし、ダウンタイムなしに新バージョンをロールアウトする必要があります。これを手動で行うのは不可能です。Kubernetes（K8s）はこれを解決するオープンソースのコンテナオーケストレーターです：欲しいもの（このイメージの 3 レプリカ、常にポート 80 でリッスン）を宣言すると、Kubernetes はクラスターの状態を宣言と一致させるよう継続的に調整します。ノードが落ちれば K8s はそのポッドを他の場所に再スケジュールします。ポッドがクラッシュすれば K8s は再起動します。トラフィックが急増すればK8s はポッドを追加します。意図を記述するだけでコントロールプレーンが作業します。",
  } as const,
  o2: {
    en: "Today you understand the Kubernetes architecture — the control plane (API server, etcd, scheduler, controller manager) and the worker nodes (kubelet, kube-proxy, container runtime). You install `minikube` or use a cloud sandbox, run `kubectl cluster-info` and `kubectl get nodes`, and deploy your first Pod with a YAML manifest. You compare the three approaches: running containers on bare metal, running them on VMs with Docker alone, and running them under Kubernetes — understanding what each layer adds and costs.",
    np: "आज तपाईंले Kubernetes architecture बुझ्नुहुनेछ — control plane (API server, etcd, scheduler, controller manager) र worker node (kubelet, kube-proxy, container runtime)। `minikube` install गर्नुहोस् वा cloud sandbox प्रयोग गर्नुहोस्, `kubectl cluster-info` र `kubectl get nodes` run गर्नुहोस्, र YAML manifest सहित आफ्नो पहिलो Pod deploy गर्नुहोस्। तीनवटा approach compare गर्नुहोस्: bare metal मा container, Docker मात्र सहित VM मा, र Kubernetes अन्तर्गत — हरेक layer ले के थप्छ र cost गर्छ बुझ्नुहोस्।",
    jp: "今日は Kubernetes のアーキテクチャ — コントロールプレーン（API サーバー・etcd・スケジューラー・コントローラーマネージャー）とワーカーノード（kubelet・kube-proxy・コンテナランタイム）を理解します。`minikube` をインストールするかクラウドサンドボックスを使い、`kubectl cluster-info` と `kubectl get nodes` を実行し、YAML マニフェストで最初の Pod をデプロイします。3 つのアプローチを比較します：ベアメタルでのコンテナ実行・Docker のみの VM 実行・Kubernetes 下での実行 — 各レイヤーが何を追加しコストとするかを理解します。",
  } as const,
};

export const DEVOPS_DAY_57_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Kubernetes architecture — components & orchestration layers",
        np: "Kubernetes architecture — component र orchestration layer",
        jp: "Kubernetes アーキテクチャ — コンポーネントとオーケストレーションレイヤー",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-cluster" },
        {
          type: "table",
          caption: {
            en: "Bare metal vs Docker vs Kubernetes — what each layer provides",
            np: "Bare metal vs Docker vs Kubernetes — हरेक layer ले के provide गर्छ",
            jp: "ベアメタル vs Docker vs Kubernetes — 各レイヤーが提供するもの",
          },
          headers: [
            { en: "Capability", np: "क्षमता", jp: "機能" },
            { en: "Bare metal + Docker", np: "Bare metal + Docker", jp: "ベアメタル + Docker" },
            { en: "Docker Compose / Swarm", np: "Docker Compose / Swarm", jp: "Docker Compose / Swarm" },
            { en: "Kubernetes", np: "Kubernetes", jp: "Kubernetes" },
          ],
          rows: [
            [
              { en: "Self-healing", np: "Self-healing", jp: "自己修復" },
              { en: "Manual restart", np: "Manual restart", jp: "手動再起動" },
              { en: "Restart policy only", np: "Restart policy only", jp: "再起動ポリシーのみ" },
              { en: "Auto-reschedules to healthy node", np: "Healthy node मा auto-reschedule", jp: "正常ノードに自動再スケジュール" },
            ],
            [
              { en: "Horizontal scaling", np: "Horizontal scaling", jp: "水平スケーリング" },
              { en: "Manual + scripting", np: "Manual + scripting", jp: "手動 + スクリプト" },
              { en: "`docker service scale`", np: "`docker service scale`", jp: "`docker service scale`" },
              { en: "`kubectl scale` or HPA (CPU-based)", np: "`kubectl scale` वा HPA (CPU-based)", jp: "`kubectl scale` または HPA（CPU ベース）" },
            ],
            [
              { en: "Rolling updates", np: "Rolling update", jp: "ローリングアップデート" },
              { en: "Manual", np: "Manual", jp: "手動" },
              { en: "Basic rolling", np: "Basic rolling", jp: "基本的なローリング" },
              { en: "maxSurge / maxUnavailable with rollback", np: "maxSurge / maxUnavailable rollback सहित", jp: "maxSurge / maxUnavailable とロールバック" },
            ],
            [
              { en: "Multi-host networking", np: "Multi-host networking", jp: "マルチホストネットワーキング" },
              { en: "Manual overlay setup", np: "Manual overlay setup", jp: "手動オーバーレイ設定" },
              { en: "Swarm overlay network", np: "Swarm overlay network", jp: "Swarm オーバーレイネットワーク" },
              { en: "CNI plugin (Calico, Flannel, Cilium)", np: "CNI plugin (Calico, Flannel, Cilium)", jp: "CNI プラグイン（Calico・Flannel・Cilium）" },
            ],
            [
              { en: "Storage orchestration", np: "Storage orchestration", jp: "ストレージオーケストレーション" },
              { en: "Host mounts only", np: "Host mount only", jp: "ホストマウントのみ" },
              { en: "Named volumes", np: "Named volume", jp: "名前付きボリューム" },
              { en: "PersistentVolume / StorageClass abstraction", np: "PersistentVolume / StorageClass abstraction", jp: "PersistentVolume / StorageClass 抽象化" },
            ],
            [
              { en: "Secret management", np: "Secret management", jp: "シークレット管理" },
              { en: "Env vars / files", np: "Env var / file", jp: "環境変数 / ファイル" },
              { en: "Docker secrets (Swarm only)", np: "Docker secret (Swarm only)", jp: "Docker シークレット（Swarm のみ）" },
              { en: "Kubernetes Secrets + RBAC + Vault integration", np: "Kubernetes Secret + RBAC + Vault integration", jp: "Kubernetes Secret + RBAC + Vault 統合" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Installing Minikube & running your first Pod",
        np: "Minikube install र पहिलो Pod run गर्ने",
        jp: "Minikube のインストールと最初の Pod の実行",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Minikube setup, kubectl basics & first Pod manifest",
            np: "Minikube setup, kubectl basics र पहिलो Pod manifest",
            jp: "Minikube のセットアップ・kubectl 基本・最初の Pod マニフェスト",
          },
          code: `# ── Install Minikube (macOS) ──────────────────────────────────────
brew install minikube
minikube start --driver=docker          # start single-node cluster inside Docker
minikube status                         # Running | Running | Running

# ── Install kubectl ───────────────────────────────────────────────
brew install kubectl
kubectl version --client                # v1.30+
kubectl cluster-info                    # shows API server URL
kubectl get nodes                       # NAME           STATUS   ROLES           AGE
                                        # minikube       Ready    control-plane   2m

# ── Explore the control plane components ─────────────────────────
kubectl get pods -n kube-system         # api-server, etcd, scheduler, controller-manager, dns
kubectl describe node minikube          # capacity, allocatable resources, conditions

# ── Your first Pod — imperative (quick test) ─────────────────────
kubectl run nginx --image=nginx:alpine --port=80
kubectl get pods                        # NAME    READY   STATUS    RESTARTS   AGE
                                        # nginx   1/1     Running   0          10s
kubectl describe pod nginx              # events, node assigned, image pull status
kubectl logs nginx                      # nginx startup logs
kubectl exec -it nginx -- sh            # shell inside the container
kubectl delete pod nginx

# ── Your first Pod — declarative (the right way) ─────────────────
# nginx-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:alpine
    ports:
    - containerPort: 80
    resources:
      requests:
        cpu: "50m"
        memory: "64Mi"
      limits:
        cpu: "100m"
        memory: "128Mi"

kubectl apply -f nginx-pod.yaml         # create or update (idempotent)
kubectl get pod nginx -o wide           # shows node, IP
kubectl port-forward pod/nginx 8080:80  # access at localhost:8080
kubectl delete -f nginx-pod.yaml

# ── Key kubectl patterns ──────────────────────────────────────────
kubectl get <resource>                  # list resources
kubectl describe <resource> <name>      # detailed state + events
kubectl apply -f <manifest.yaml>        # create/update declaratively
kubectl delete -f <manifest.yaml>       # delete resources
kubectl logs <pod-name>                 # container stdout
kubectl exec -it <pod-name> -- <cmd>    # run command inside pod
kubectl get events --sort-by=.metadata.creationTimestamp  # cluster events`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Start a Minikube cluster and run `kubectl get nodes` to verify the node is Ready. Then run `kubectl get pods -n kube-system` and identify the control plane components (api-server, etcd, scheduler, controller-manager, CoreDNS). Write down what each component does in one sentence.",
              np: "Minikube cluster start गर्नुहोस् र node Ready छ verify गर्न `kubectl get nodes` run गर्नुहोस्। त्यसपछि `kubectl get pods -n kube-system` run गर्नुहोस् र control plane component (api-server, etcd, scheduler, controller-manager, CoreDNS) identify गर्नुहोस्। हरेक component ले के गर्छ एक sentence मा लेख्नुहोस्।",
              jp: "Minikube クラスターを起動して `kubectl get nodes` を実行しノードが Ready であることを確認する。次に `kubectl get pods -n kube-system` を実行してコントロールプレーンコンポーネント（api-server・etcd・scheduler・controller-manager・CoreDNS）を特定する。各コンポーネントが何をするかを 1 文で書き留める。",
            },
            {
              en: "Create the `nginx-pod.yaml` manifest above and apply it with `kubectl apply -f nginx-pod.yaml`. Use `kubectl port-forward pod/nginx 8080:80` to access it in your browser. Then use `kubectl exec -it nginx -- sh` to get a shell inside the container and run `wget -O- localhost:80`. Delete the pod and confirm it disappears with `kubectl get pods`.",
              np: "माथिको `nginx-pod.yaml` manifest create गर्नुहोस् र `kubectl apply -f nginx-pod.yaml` सँग apply गर्नुहोस्। Browser मा access गर्न `kubectl port-forward pod/nginx 8080:80` प्रयोग गर्नुहोस्। त्यसपछि container भित्र shell पाउन `kubectl exec -it nginx -- sh` प्रयोग गर्नुहोस् र `wget -O- localhost:80` run गर्नुहोस्। Pod delete गर्नुहोस् र `kubectl get pods` सँग disappear भएको confirm गर्नुहोस्।",
              jp: "上の `nginx-pod.yaml` マニフェストを作成して `kubectl apply -f nginx-pod.yaml` で適用する。`kubectl port-forward pod/nginx 8080:80` を使ってブラウザでアクセスする。次に `kubectl exec -it nginx -- sh` でコンテナ内のシェルを取得して `wget -O- localhost:80` を実行する。ポッドを削除して `kubectl get pods` で消えたことを確認する。",
            },
            {
              en: "Delete the `nginx` pod manually and observe it does NOT restart — because a bare Pod has no supervisor. Then use `kubectl run nginx --image=nginx:alpine --restart=Always` which creates a Deployment (the supervisor). Delete the pod under that deployment and watch Kubernetes automatically create a replacement. This is the core reconciliation loop in action.",
              np: "Manually `nginx` pod delete गर्नुहोस् र यो restart हुँदैन observe गर्नुहोस् — किनभने bare Pod को supervisor छैन। त्यसपछि `kubectl run nginx --image=nginx:alpine --restart=Always` प्रयोग गर्नुहोस् जसले Deployment (supervisor) create गर्छ। त्यो deployment अन्तर्गतको pod delete गर्नुहोस् र Kubernetes ले automatically replacement create गर्छ watch गर्नुहोस्। यो core reconciliation loop in action हो।",
              jp: "手動で `nginx` ポッドを削除して再起動しないことを観察する — 裸のポッドにはスーパーバイザーがいないため。次に `kubectl run nginx --image=nginx:alpine --restart=Always` を使う — これは Deployment（スーパーバイザー）を作成する。その Deployment 下のポッドを削除して Kubernetes が自動的に代替を作成するのを見る。これがコア調整ループの動作です。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Docker and Kubernetes? When do I need Kubernetes?",
        np: "Docker र Kubernetes बीचको फरक के हो? Kubernetes कहिले चाहिन्छ?",
        jp: "Docker と Kubernetes の違いは何か？いつ Kubernetes が必要か？",
      },
      answer: {
        en: "Docker is a container runtime — it builds and runs containers on a single machine. Kubernetes is a container orchestrator — it manages containers across a cluster of machines. Docker answers 'how do I run this container?' Kubernetes answers 'how do I run 50 containers reliably across 10 machines, heal failures, route traffic, and deploy new versions safely?' You need Kubernetes when you have: (1) more than 1–2 hosts running containers, (2) a need for zero-downtime deployments, (3) automatic scaling requirements, or (4) complex networking between many services. For a single server or dev environment, Docker Compose is often sufficient and much simpler. Kubernetes adds significant operational complexity — managed services like EKS, GKE, or AKS reduce that overhead by handling the control plane for you.",
        np: "Docker container runtime हो — single machine मा container build र run गर्छ। Kubernetes container orchestrator हो — machine को cluster मा container manage गर्छ। Docker ले 'यो container कसरी run गर्ने?' को जवाफ दिन्छ। Kubernetes ले '10 machine मा 50 container reliably कसरी run गर्ने, failure heal गर्ने, traffic route गर्ने, र नया version safely deploy गर्ने?' को जवाफ दिन्छ। Kubernetes चाहिन्छ जब: (1) container run गर्ने 1–2 भन्दा बढी host, (2) zero-downtime deployment, (3) automatic scaling requirement, वा (4) धेरै service बीच complex networking। Single server वा dev environment को लागि Docker Compose प्रायः पर्याप्त र धेरै simple हुन्छ। Kubernetes ले significant operational complexity थप्छ — EKS, GKE, वा AKS जस्ता managed service ले control plane handle गरेर त्यो overhead कम गर्छ।",
        jp: "Docker はコンテナランタイムです — 単一マシンでコンテナをビルドして実行します。Kubernetes はコンテナオーケストレーターです — マシンのクラスター全体でコンテナを管理します。Docker は「このコンテナをどうやって実行するか？」に答えます。Kubernetes は「10 台のマシンで 50 のコンテナを確実に実行し、障害を修復し、トラフィックをルーティングし、新バージョンを安全にデプロイするにはどうするか？」に答えます。Kubernetes が必要なのは：(1) コンテナを実行するホストが 1〜2 台以上、(2) ゼロダウンタイムデプロイの必要性、(3) 自動スケーリングの要件、または (4) 多くのサービス間の複雑なネットワーキング。単一サーバーや開発環境では Docker Compose で十分でかつはるかにシンプルです。Kubernetes は大きな運用上の複雑さを追加します — EKS・GKE・AKS などのマネージドサービスはコントロールプレーンを代わりに処理してそのオーバーヘッドを軽減します。",
      },
      tag: { en: "docker vs k8s", np: "Docker vs K8s", jp: "Docker vs K8s" },
    },
    {
      question: {
        en: "What is etcd and why is it so important in Kubernetes?",
        np: "etcd के हो र Kubernetes मा यो किन यति महत्त्वपूर्ण छ?",
        jp: "etcd とは何か、なぜ Kubernetes でそれほど重要なのか？",
      },
      answer: {
        en: "etcd is a distributed key-value store that acts as Kubernetes' single source of truth. Every resource in the cluster — every Pod, Service, Deployment, ConfigMap, Node status, Secret — is stored as a serialized object in etcd. The API server is the only component that reads from and writes to etcd; all other components (scheduler, controller manager, kubelet) interact with the API server, never directly with etcd. This design means: if etcd goes down, the cluster cannot change state (no new deployments, no scaling). Existing running pods continue running, but the cluster becomes read-only. This is why etcd is always deployed with odd-numbered replicas (3, 5) for quorum-based consensus. In production, etcd backups are critical — losing etcd means losing the entire cluster state. Managed Kubernetes services (EKS, GKE) back up etcd automatically.",
        np: "etcd distributed key-value store हो जुन Kubernetes को single source of truth को रूपमा काम गर्छ। Cluster को हरेक resource — हरेक Pod, Service, Deployment, ConfigMap, Node status, Secret — etcd मा serialized object को रूपमा store हुन्छ। API server नै एकमात्र component हो जसले etcd बाट read र write गर्छ; अन्य सबै component (scheduler, controller manager, kubelet) ले API server सँग interact गर्छन्, etcd सँग directly होइन। यो design को मतलब: etcd down भयो भने cluster ले state change गर्न सक्दैन (new deployment, no scaling)। Existing running pod चलिरहन्छन्, तर cluster read-only हुन्छ। यही कारण etcd सधैँ quorum-based consensus को लागि odd-numbered replica (3, 5) सहित deploy हुन्छ। Production मा etcd backup critical छ — etcd हराउनु भनेको सम्पूर्ण cluster state हराउनु हो। EKS, GKE जस्ता managed Kubernetes service ले etcd automatically backup गर्छ।",
        jp: "etcd は Kubernetes の真実の唯一の情報源として機能する分散キーバリューストアです。クラスター内のすべてのリソース — すべての Pod・Service・Deployment・ConfigMap・ノードステータス・Secret — が etcd にシリアライズされたオブジェクトとして保存されます。etcd を読み書きするのは API サーバーだけです；他のすべてのコンポーネント（スケジューラー・コントローラーマネージャー・kubelet）は etcd に直接ではなく API サーバーと通信します。この設計の意味：etcd が落ちるとクラスターは状態を変更できなくなります（新デプロイやスケーリング不可）。既存の実行中ポッドは動き続けますが、クラスターは読み取り専用になります。これが etcd が常に奇数レプリカ（3、5）でクォーラムベースの合意のためにデプロイされる理由です。本番環境では etcd バックアップが重要です — etcd を失うことはクラスター全体の状態を失うことを意味します。EKS・GKE などのマネージド Kubernetes サービスは etcd を自動的にバックアップします。",
      },
      tag: { en: "etcd", np: "etcd", jp: "etcd" },
    },
  ],
};
