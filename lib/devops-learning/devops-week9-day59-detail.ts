import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "One of the foundational principles of Kubernetes is separating configuration and secrets from application code. **ConfigMaps** store non-sensitive key-value pairs — environment variables, configuration files, command-line arguments — that your pods consume at runtime. **Secrets** store base64-encoded sensitive data like passwords, API tokens, and TLS certificates. Both are first-class Kubernetes resources that can be mounted as files or injected as environment variables, and both are versioned and independently updatable without redeploying your application image. The difference: Secrets are not truly encrypted by default (just base64), but Kubernetes RBAC can restrict who can read them, and you can enable etcd encryption at rest for production clusters.",
    np: "Kubernetes को foundational principle मध्ये एउटा हो application code बाट configuration र secret अलग गर्नु। **ConfigMap** ले non-sensitive key-value pair — environment variable, configuration file, command-line argument — store गर्छ जुन तपाईंका pod ले runtime मा consume गर्छ। **Secret** ले password, API token, र TLS certificate जस्ता base64-encoded sensitive data store गर्छ। दुवै first-class Kubernetes resource हुन् जुन file को रूपमा mount वा environment variable को रूपमा inject गर्न सकिन्छ, र दुवै versioned र application image redeploy नगरी independently update गर्न सकिन्छ। फरक: Secret ले default मा truly encrypt हुँदैन (base64 मात्र), तर Kubernetes RBAC ले को ले read गर्न सक्छ restrict गर्न सक्छ, र production cluster को लागि etcd encryption at rest enable गर्न सकिन्छ।",
    jp: "Kubernetes の基本原則の 1 つは、設定とシークレットをアプリケーションコードから分離することです。**ConfigMap** は非機密のキーバリューペア — 環境変数・設定ファイル・コマンドライン引数 — を保存し、ポッドが実行時に使用します。**Secret** はパスワード・API トークン・TLS 証明書などの base64 エンコードされた機密データを保存します。どちらもファイルとしてマウントしたり環境変数として注入したりできるファーストクラスの Kubernetes リソースで、アプリケーションイメージを再デプロイせずにバージョン管理され独立して更新できます。違い：Secret はデフォルトでは真に暗号化されていません（base64 のみ）が、Kubernetes RBAC で読み取り可能なユーザーを制限でき、本番クラスターには etcd の保存時暗号化を有効にできます。",
  } as const,
  o2: {
    en: "**Persistent Volumes** solve the ephemeral storage problem: when a Pod dies, its container filesystem disappears. A **PersistentVolume (PV)** is a piece of storage provisioned in the cluster (NFS, cloud block storage, local disk). A **PersistentVolumeClaim (PVC)** is a request for storage by a Pod — it says 'I need 10Gi of ReadWriteOnce storage.' Kubernetes matches the PVC to a suitable PV and binds them. A **StorageClass** automates this: instead of pre-provisioning PVs, you define a class (e.g., `aws-ebs-gp3`) and PVCs are dynamically provisioned. Today you inject a ConfigMap as environment variables, mount a Secret as a file, and attach a PVC to a database Pod.",
    np: "**Persistent Volume** ले ephemeral storage problem solve गर्छ: Pod die भयो भने container filesystem disappear हुन्छ। **PersistentVolume (PV)** cluster मा provisioned storage को piece हो (NFS, cloud block storage, local disk)। **PersistentVolumeClaim (PVC)** Pod द्वारा storage को request हो — 'मलाई 10Gi को ReadWriteOnce storage चाहिन्छ।' Kubernetes ले PVC लाई suitable PV सँग match गरेर bind गर्छ। **StorageClass** यसलाई automate गर्छ: PV pre-provision गर्नुको सट्टा, class define गर्नुहोस् (जस्तै, `aws-ebs-gp3`) र PVC dynamically provision हुन्छ। आज तपाईंले ConfigMap environment variable को रूपमा inject गर्नुहुनेछ, Secret file को रूपमा mount गर्नुहुनेछ, र database Pod मा PVC attach गर्नुहुनेछ।",
    jp: "**Persistent Volume** はエフェメラルストレージ問題を解決します：Pod が死ぬとコンテナファイルシステムが消えます。**PersistentVolume（PV）** はクラスターにプロビジョニングされたストレージの一部（NFS・クラウドブロックストレージ・ローカルディスク）です。**PersistentVolumeClaim（PVC）** は Pod によるストレージのリクエストです — 「10Gi の ReadWriteOnce ストレージが必要」と言います。Kubernetes は PVC を適切な PV にマッチさせてバインドします。**StorageClass** はこれを自動化します：PV を事前プロビジョニングする代わりにクラス（例：`aws-ebs-gp3`）を定義すると PVC が動的にプロビジョニングされます。今日は ConfigMap を環境変数として注入し、Secret をファイルとしてマウントし、データベース Pod に PVC をアタッチします。",
  } as const,
};

export const DEVOPS_DAY_59_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "ConfigMaps, Secrets & persistent storage — patterns comparison",
        np: "ConfigMap, Secret र persistent storage — pattern comparison",
        jp: "ConfigMap・Secret・永続ストレージ — パターン比較",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-config" },
        {
          type: "table",
          caption: {
            en: "Config & storage resources — purpose, consumption, and production guidelines",
            np: "Config र storage resource — purpose, consumption, र production guideline",
            jp: "設定とストレージリソース — 目的・使用方法・本番ガイドライン",
          },
          headers: [
            { en: "Resource", np: "Resource", jp: "リソース" },
            { en: "Stores", np: "Store गर्छ", jp: "保存するもの" },
            { en: "How pods consume it", np: "Pod ले कसरी consume गर्छ", jp: "Pod の利用方法" },
            { en: "Production note", np: "Production note", jp: "本番の注意事項" },
          ],
          rows: [
            [
              { en: "ConfigMap", np: "ConfigMap", jp: "ConfigMap" },
              { en: "Non-sensitive config: DB host, log level, feature flags", np: "Non-sensitive config: DB host, log level, feature flag", jp: "非機密設定：DB ホスト・ログレベル・機能フラグ" },
              { en: "Env vars (`envFrom`), single key (`env.valueFrom`), or mounted as files", np: "Env var (`envFrom`), single key (`env.valueFrom`), वा file को रूपमा mount", jp: "環境変数（`envFrom`）・単一キー（`env.valueFrom`）・ファイルとしてマウント" },
              { en: "Limit to 1MiB. Changes don't auto-reload env vars — must restart Pod", np: "1MiB सीमित। Change ले env var auto-reload गर्दैन — Pod restart गर्नुपर्छ", jp: "1MiB に制限。変更は env var を自動リロードしない — Pod を再起動する必要あり" },
            ],
            [
              { en: "Secret", np: "Secret", jp: "Secret" },
              { en: "Sensitive data: passwords, API keys, TLS certs (base64 in etcd)", np: "Sensitive data: password, API key, TLS cert (etcd मा base64)", jp: "機密データ：パスワード・API キー・TLS 証明書（etcd に base64）" },
              { en: "Same as ConfigMap — `envFrom`, `env.valueFrom`, or volume mount as file", np: "ConfigMap जस्तै — `envFrom`, `env.valueFrom`, वा volume mount as file", jp: "ConfigMap と同じ — `envFrom`・`env.valueFrom`・ファイルとしてボリュームマウント" },
              { en: "Enable etcd encryption at rest. Prefer volume mount over env var (env vars leak in logs)", np: "Etcd encryption at rest enable गर्नुहोस्। Env var भन्दा volume mount prefer (env var log मा leak हुन्छ)", jp: "etcd の保存時暗号化を有効に。env var よりボリュームマウントを優先（env var はログに漏れる）" },
            ],
            [
              { en: "PersistentVolume (PV)", np: "PersistentVolume (PV)", jp: "PersistentVolume (PV)" },
              { en: "Cluster-level storage resource: NFS share, EBS volume, GCE disk", np: "Cluster-level storage resource: NFS share, EBS volume, GCE disk", jp: "クラスターレベルのストレージリソース：NFS 共有・EBS ボリューム・GCE ディスク" },
              { en: "Claimed by PVC — not used directly in pod spec", np: "PVC ले claim गर्छ — pod spec मा directly use गर्दैन", jp: "PVC によってクレームされる — Pod スペックで直接使用しない" },
              { en: "Reclaim policy: Retain (safe), Delete (auto-cleanup), Recycle (deprecated)", np: "Reclaim policy: Retain (safe), Delete (auto-cleanup), Recycle (deprecated)", jp: "回収ポリシー：Retain（安全）・Delete（自動クリーンアップ）・Recycle（非推奨）" },
            ],
            [
              { en: "PersistentVolumeClaim (PVC)", np: "PersistentVolumeClaim (PVC)", jp: "PersistentVolumeClaim (PVC)" },
              { en: "Pod's request for storage: size + access mode (RWO, ROX, RWX)", np: "Pod को storage request: size + access mode (RWO, ROX, RWX)", jp: "Pod のストレージリクエスト：サイズ + アクセスモード（RWO・ROX・RWX）" },
              { en: "`spec.volumes[].persistentVolumeClaim.claimName` + `spec.containers[].volumeMounts`", np: "`spec.volumes[].persistentVolumeClaim.claimName` + `spec.containers[].volumeMounts`", jp: "`spec.volumes[].persistentVolumeClaim.claimName` + `spec.containers[].volumeMounts`" },
              { en: "Status: Pending (no matching PV), Bound (ready), Released, Failed", np: "Status: Pending (matching PV छैन), Bound (ready), Released, Failed", jp: "ステータス：Pending（マッチする PV なし）・Bound（準備完了）・Released・Failed" },
            ],
            [
              { en: "StorageClass", np: "StorageClass", jp: "StorageClass" },
              { en: "Template for dynamic PV provisioning — provider, disk type, IOPS", np: "Dynamic PV provisioning को template — provider, disk type, IOPS", jp: "動的 PV プロビジョニングのテンプレート — プロバイダー・ディスクタイプ・IOPS" },
              { en: "Referenced by PVC's `storageClassName` field — PV auto-provisioned", np: "PVC को `storageClassName` field ले reference — PV auto-provision", jp: "PVC の `storageClassName` フィールドで参照 — PV が自動プロビジョニング" },
              { en: "Default StorageClass used when PVC omits `storageClassName`", np: "PVC ले `storageClassName` omit गर्दा default StorageClass प्रयोग", jp: "PVC が `storageClassName` を省略したときにデフォルト StorageClass が使用される" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "ConfigMap, Secret & PVC YAML — hands-on patterns",
        np: "ConfigMap, Secret र PVC YAML — hands-on pattern",
        jp: "ConfigMap・Secret・PVC YAML — ハンズオンパターン",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "ConfigMap + Secret injection, and PVC-backed database Pod",
            np: "ConfigMap + Secret injection, र PVC-backed database Pod",
            jp: "ConfigMap + Secret の注入と PVC バックの DB Pod",
          },
          code: `# ── ConfigMap ────────────────────────────────────────────────────
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  DB_HOST: "postgres-svc"
  DB_PORT: "5432"
  LOG_LEVEL: "info"
  app.properties: |             # mount as a file
    max.connections=100
    cache.ttl=300

---
# ── Secret (values must be base64 encoded) ───────────────────────
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  DB_PASSWORD: cGFzc3dvcmQxMjM=    # echo -n 'password123' | base64
  API_KEY: c3VwZXJzZWNyZXQ=        # echo -n 'supersecret' | base64

# Or use stringData (Kubernetes base64-encodes it for you):
# stringData:
#   DB_PASSWORD: "password123"

---
# ── Pod consuming ConfigMap + Secret ─────────────────────────────
apiVersion: v1
kind: Pod
metadata:
  name: webapp
spec:
  containers:
  - name: webapp
    image: nginx:alpine
    envFrom:
    - configMapRef:
        name: app-config         # inject ALL keys as env vars
    - secretRef:
        name: app-secrets        # inject ALL secret keys as env vars
    env:
    - name: APP_VERSION          # single key from ConfigMap
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: LOG_LEVEL
    volumeMounts:
    - name: config-vol
      mountPath: /etc/app        # mounts app.properties at /etc/app/app.properties
    - name: secret-vol
      mountPath: /etc/secrets    # mounts secret files (recommended over env for secrets)
      readOnly: true
  volumes:
  - name: config-vol
    configMap:
      name: app-config
  - name: secret-vol
    secret:
      secretName: app-secrets
      defaultMode: 0400          # read-only for owner only

---
# ── PersistentVolumeClaim ─────────────────────────────────────────
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-data
spec:
  accessModes:
  - ReadWriteOnce               # RWO: one node at a time (block storage)
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard    # minikube default; use gp3 on AWS

---
# ── StatefulSet-style Postgres Pod with PVC ───────────────────────
apiVersion: v1
kind: Pod
metadata:
  name: postgres
spec:
  containers:
  - name: postgres
    image: postgres:16-alpine
    env:
    - name: POSTGRES_DB
      value: mydb
    - name: POSTGRES_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secrets
          key: DB_PASSWORD
    volumeMounts:
    - name: pgdata
      mountPath: /var/lib/postgresql/data
  volumes:
  - name: pgdata
    persistentVolumeClaim:
      claimName: postgres-data  # binds to the PVC above


# ── kubectl commands ──────────────────────────────────────────────
kubectl apply -f configmap.yaml -f secret.yaml -f pvc.yaml -f postgres.yaml

# inspect
kubectl get configmap app-config -o yaml
kubectl get secret app-secrets -o yaml      # values are base64
kubectl get pvc postgres-data               # STATUS: Bound

# decode a secret value
kubectl get secret app-secrets -o jsonpath='{.data.DB_PASSWORD}' | base64 -d

# verify env inside pod
kubectl exec -it webapp -- env | grep -E "DB_HOST|LOG_LEVEL"
kubectl exec -it webapp -- cat /etc/app/app.properties`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create the `app-config` ConfigMap and a Pod that consumes it via `envFrom`. Run `kubectl exec -it <pod> -- env` and verify the environment variables `DB_HOST`, `DB_PORT`, and `LOG_LEVEL` are set. Then update the ConfigMap's `LOG_LEVEL` value to `debug`, reapply it, and observe that the running Pod does **not** see the change — you must delete and recreate it. This demonstrates why ConfigMap changes require a rollout.",
              np: "`app-config` ConfigMap create गर्नुहोस् र `envFrom` मार्फत consume गर्ने Pod। `kubectl exec -it <pod> -- env` run गर्नुहोस् र `DB_HOST`, `DB_PORT`, र `LOG_LEVEL` environment variable set भएको verify गर्नुहोस्। त्यसपछि ConfigMap को `LOG_LEVEL` value `debug` मा update गर्नुहोस्, reapply गर्नुहोस्, र running Pod ले change **देख्दैन** observe गर्नुहोस् — delete र recreate गर्नुपर्छ। यसले ConfigMap change ले किन rollout require गर्छ demonstrate गर्छ।",
              jp: "`app-config` ConfigMap を作成して `envFrom` でそれを使用する Pod を作成する。`kubectl exec -it <pod> -- env` を実行して環境変数 `DB_HOST`・`DB_PORT`・`LOG_LEVEL` が設定されていることを確認する。次に ConfigMap の `LOG_LEVEL` 値を `debug` に更新して再適用し、実行中の Pod が変更を**見ない**ことを観察する — 削除して再作成が必要。これが ConfigMap の変更にロールアウトが必要な理由を示します。",
            },
            {
              en: "Create the `app-secrets` Secret using `kubectl create secret generic app-secrets --from-literal=DB_PASSWORD=password123`. Verify it exists with `kubectl get secret app-secrets -o yaml` — notice the base64 encoding. Decode the value with `kubectl get secret app-secrets -o jsonpath='{.data.DB_PASSWORD}' | base64 -d`. Mount it as a file in a pod and use `cat /etc/secrets/DB_PASSWORD` to read it — compare this with the env-var approach.",
              np: "`kubectl create secret generic app-secrets --from-literal=DB_PASSWORD=password123` प्रयोग गरेर `app-secrets` Secret create गर्नुहोस्। `kubectl get secret app-secrets -o yaml` सँग exist गर्छ verify गर्नुहोस् — base64 encoding notice गर्नुहोस्। `kubectl get secret app-secrets -o jsonpath='{.data.DB_PASSWORD}' | base64 -d` सँग value decode गर्नुहोस्। Pod मा file को रूपमा mount गर्नुहोस् र `cat /etc/secrets/DB_PASSWORD` सँग read गर्नुहोस् — env-var approach सँग compare गर्नुहोस्।",
              jp: "`kubectl create secret generic app-secrets --from-literal=DB_PASSWORD=password123` を使って `app-secrets` Secret を作成する。`kubectl get secret app-secrets -o yaml` で存在を確認する — base64 エンコーディングに注目する。`kubectl get secret app-secrets -o jsonpath='{.data.DB_PASSWORD}' | base64 -d` で値をデコードする。Pod にファイルとしてマウントして `cat /etc/secrets/DB_PASSWORD` で読み取る — env var アプローチと比較する。",
            },
            {
              en: "Create the `postgres-data` PVC and the Postgres Pod that mounts it. Run `kubectl get pvc` and confirm the status is `Bound`. Write some data to the database. Delete the Postgres Pod and recreate it — verify the data persists across pod restarts because it lives in the PVC, not the container filesystem. This is the fundamental difference between ephemeral container storage and persistent volumes.",
              np: "`postgres-data` PVC र mount गर्ने Postgres Pod create गर्नुहोस्। `kubectl get pvc` run गर्नुहोस् र status `Bound` छ confirm गर्नुहोस्। Database मा केही data write गर्नुहोस्। Postgres Pod delete गर्नुहोस् र recreate गर्नुहोस् — data pod restart भरि persist भएको verify गर्नुहोस् किनभने यो container filesystem होइन, PVC मा छ। यो ephemeral container storage र persistent volume बीचको fundamental difference हो।",
              jp: "`postgres-data` PVC とそれをマウントする Postgres Pod を作成する。`kubectl get pvc` を実行してステータスが `Bound` であることを確認する。データベースにデータを書き込む。Postgres Pod を削除して再作成する — Pod が再起動してもデータが永続することを確認する。コンテナファイルシステムではなく PVC に存在するためです。これがエフェメラルコンテナストレージと永続ボリュームの根本的な違いです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I inject Secrets as environment variables or mount them as files?",
        np: "Secret environment variable को रूपमा inject गर्नुपर्छ कि file को रूपमा mount?",
        jp: "Secret を環境変数として注入すべきか、ファイルとしてマウントすべきか？",
      },
      answer: {
        en: "Prefer **volume mounts** for sensitive secrets. Environment variables are easier to use but they have three risks: (1) they appear in `kubectl describe pod` output and process listings (`/proc/<pid>/environ`) which means they can leak in logs and debugging output; (2) child processes inherit them, which can unintentionally expose secrets to subprocesses; (3) they cannot be updated without restarting the pod. Volume-mounted secrets appear as files at a path you choose, can be read-only (`mode: 0400`), and when the Secret is updated Kubernetes refreshes the mounted file automatically (within ~1 minute) without restarting the pod. For truly production-grade secret management, integrate with HashiCorp Vault, AWS Secrets Manager, or use the Kubernetes External Secrets Operator — these systems provide secret rotation, audit logs, and fine-grained access control that native Kubernetes Secrets don't.",
        np: "Sensitive secret को लागि **volume mount** prefer गर्नुहोस्। Environment variable प्रयोग गर्न सजिलो छ तर तीनवटा risk छन्: (1) `kubectl describe pod` output र process listing (`/proc/<pid>/environ`) मा appear हुन्छ जसको मतलब log र debugging output मा leak हुन सक्छ; (2) child process हरूले inherit गर्छन् जसले subprocess मा unintentionally secret expose गर्न सक्छ; (3) pod restart नगरी update गर्न सकिँदैन। Volume-mounted secret हरू तपाईंले choose गरेको path मा file को रूपमा appear हुन्छ, read-only हुन सक्छ (`mode: 0400`), र Secret update गर्दा Kubernetes ले pod restart नगरी automatically mounted file refresh गर्छ (~1 minute भित्र)। Truly production-grade secret management को लागि HashiCorp Vault, AWS Secrets Manager, वा Kubernetes External Secrets Operator सँग integrate गर्नुहोस् — यी system ले native Kubernetes Secret ले नगर्ने secret rotation, audit log, र fine-grained access control provide गर्छ।",
        jp: "機密シークレットには**ボリュームマウント**を優先します。環境変数は使いやすいですが 3 つのリスクがあります：(1) `kubectl describe pod` 出力とプロセスリスト（`/proc/<pid>/environ`）に表示され、ログやデバッグ出力に漏れる可能性がある；(2) 子プロセスに継承され、意図せずサブプロセスにシークレットを公開する可能性がある；(3) ポッドを再起動せずに更新できない。ボリュームマウントされたシークレットは選択したパスにファイルとして表示され、読み取り専用にでき（`mode: 0400`）、Secret が更新されると Kubernetes はポッドを再起動せずにマウントされたファイルを自動的に更新します（約 1 分以内）。真に本番グレードのシークレット管理には、HashiCorp Vault・AWS Secrets Manager・Kubernetes External Secrets Operator と統合します — これらのシステムはネイティブ Kubernetes Secret にはないシークレットローテーション・監査ログ・きめ細かいアクセス制御を提供します。",
      },
      tag: { en: "secrets best practice", np: "Secret Best Practice", jp: "Secret のベストプラクティス" },
    },
    {
      question: {
        en: "What is the difference between ReadWriteOnce, ReadOnlyMany, and ReadWriteMany access modes?",
        np: "ReadWriteOnce, ReadOnlyMany, र ReadWriteMany access mode बीचको फरक के हो?",
        jp: "ReadWriteOnce・ReadOnlyMany・ReadWriteMany アクセスモードの違いは何か？",
      },
      answer: {
        en: "Access modes define how many nodes can mount a volume simultaneously. **ReadWriteOnce (RWO)**: only one node can mount the volume for read-write at a time — this is the most common mode and is supported by most block storage providers (AWS EBS, Azure Disk, GCE PD). Multiple pods on the *same* node can all read/write. **ReadOnlyMany (ROX)**: many nodes can mount the volume read-only — useful for static content like configuration files or shared binary assets. **ReadWriteMany (RWX)**: many nodes can mount the volume for read-write simultaneously — only supported by shared filesystem providers like NFS, AWS EFS, Azure Files, or distributed storage like Ceph/Longhorn. Block storage (EBS, GCE PD) does NOT support RWX. If your stateful app (like a database) needs to be accessed by only one pod at a time, use RWO. If your app shards data across many pods all needing to write, you need RWX and a shared filesystem. For most databases, RWO is correct — databases handle their own concurrent access internally.",
        np: "Access mode ले एकसाथ कति node ले volume mount गर्न सक्छ define गर्छ। **ReadWriteOnce (RWO)**: एक पटकमा एउटा node मात्र read-write को लागि volume mount गर्न सक्छ — यो सबैभन्दा common mode हो र धेरैजसो block storage provider (AWS EBS, Azure Disk, GCE PD) ले support गर्छ। *Same* node को multiple pod हरूले read/write गर्न सक्छन्। **ReadOnlyMany (ROX)**: धेरै node ले volume read-only mount गर्न सक्छ — configuration file वा shared binary asset जस्ता static content को लागि उपयोगी। **ReadWriteMany (RWX)**: धेरै node ले एकसाथ read-write को लागि volume mount गर्न सक्छ — NFS, AWS EFS, Azure Files, वा Ceph/Longhorn जस्ता distributed storage जस्ता shared filesystem provider मात्र support गर्छ। Block storage (EBS, GCE PD) ले RWX support **गर्दैन**। Stateful app (database जस्तै) लाई एक पटकमा एउटा pod मात्र access गर्नुपर्छ भने RWO प्रयोग गर्नुहोस्। App ले सबैले write गर्न आवश्यक पर्ने many pod मा data shard गर्छ भने RWX र shared filesystem चाहिन्छ। धेरैजसो database को लागि RWO correct हो — database ले आफ्नो concurrent access internally handle गर्छ।",
        jp: "アクセスモードはノードが同時にボリュームをマウントできる数を定義します。**ReadWriteOnce（RWO）**：一度に 1 つのノードだけが読み書きのためにボリュームをマウントできます — これが最も一般的なモードで、ほとんどのブロックストレージプロバイダー（AWS EBS・Azure Disk・GCE PD）がサポートします。*同じ*ノード上の複数の Pod はすべて読み書きできます。**ReadOnlyMany（ROX）**：多くのノードが読み取り専用でボリュームをマウントできます — 設定ファイルや共有バイナリアセットなどの静的コンテンツに便利です。**ReadWriteMany（RWX）**：多くのノードが同時に読み書きのためにボリュームをマウントできます — NFS・AWS EFS・Azure Files・Ceph/Longhorn などの分散ストレージなどの共有ファイルシステムプロバイダーのみがサポートします。ブロックストレージ（EBS・GCE PD）は RWX を**サポートしません**。ステートフルアプリ（データベースなど）が一度に 1 つの Pod からのみアクセスされる必要がある場合は RWO を使用します。アプリがすべてが書き込む必要のある多くの Pod にデータをシャードする場合は RWX と共有ファイルシステムが必要です。ほとんどのデータベースには RWO が正しい — データベースは内部で同時アクセスを処理します。",
      },
      tag: { en: "access modes", np: "Access Mode", jp: "アクセスモード" },
    },
  ],
};
