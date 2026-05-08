import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "By default a Kubernetes cluster is one flat space where any pod in any namespace can talk to any other pod, and any user with kubeconfig access can do anything. That's fine for a toy cluster but catastrophic for production. **Namespaces** provide soft multi-tenancy: logical partitions for organising resources, applying quotas, and scoping RBAC policies. You can have `development`, `staging`, and `production` namespaces on the same cluster, with different teams having access to different namespaces. Namespaces don't provide network isolation by default (that's NetworkPolicy's job) but they do scope names, quotas, and RBAC.",
    np: "Default मा Kubernetes cluster एउटा flat space हो जहाँ कुनै पनि namespace मा कुनै पनि pod ले अर्को pod सँग कुरा गर्न सक्छ, र kubeconfig access भएको कुनै पनि user ले जे पनि गर्न सक्छ। Toy cluster को लागि ठीक छ तर production को लागि catastrophic हो। **Namespace** ले soft multi-tenancy provide गर्छ: resource organize गर्न, quota apply गर्न, र RBAC policy scope गर्नका लागि logical partition। तपाईंले same cluster मा `development`, `staging`, र `production` namespace राख्न सक्नुहुन्छ, different team ले different namespace मा access पाउँछ। Namespace ले default मा network isolation provide गर्दैन (त्यो NetworkPolicy को काम हो) तर name, quota, र RBAC scope गर्छ।",
    jp: "デフォルトでは Kubernetes クラスターは、任意の名前空間の任意の Pod が他の Pod と通信でき、kubeconfig アクセスを持つ任意のユーザーが何でもできるフラットな空間です。おもちゃのクラスターには問題ありませんが、本番環境には致命的です。**名前空間**はソフトマルチテナンシーを提供します：リソースの整理・クォータの適用・RBAC ポリシーのスコープのための論理パーティション。同じクラスターに `development`・`staging`・`production` の名前空間を持ち、異なるチームが異なる名前空間にアクセスできます。名前空間はデフォルトではネットワーク分離を提供しません（それは NetworkPolicy の仕事）が、名前・クォータ・RBAC のスコープを設定します。",
  } as const,
  o2: {
    en: "**RBAC (Role-Based Access Control)** is Kubernetes' permission system. A **Role** defines what actions (verbs: get, list, create, delete, patch) are allowed on which resources (pods, deployments, secrets) within a namespace. A **ClusterRole** is the same but cluster-scoped (or for non-namespaced resources like nodes). A **RoleBinding** grants a Role to a **Subject** (a User, a Group, or a ServiceAccount) in a namespace. **ServiceAccounts** are the identity Pods use when calling the Kubernetes API — your application code can use a ServiceAccount token to call `kubectl` from inside a pod. Today you create namespaces, Roles, RoleBindings, and a ServiceAccount, understanding how the RBAC chain controls who can do what in your cluster.",
    np: "**RBAC (Role-Based Access Control)** Kubernetes को permission system हो। **Role** ले namespace भित्र कुन resource (pod, deployment, secret) मा कुन action (verb: get, list, create, delete, patch) allowed छ define गर्छ। **ClusterRole** उस्तै हो तर cluster-scoped (वा node जस्ता non-namespaced resource को लागि)। **RoleBinding** ले namespace मा **Subject** (User, Group, वा ServiceAccount) लाई Role grant गर्छ। **ServiceAccount** Pod ले Kubernetes API call गर्दा use गर्ने identity हो — तपाईंको application code ले pod भित्रबाट `kubectl` call गर्न ServiceAccount token प्रयोग गर्न सक्छ। आज तपाईंले namespace, Role, RoleBinding, र ServiceAccount create गर्नुहुनेछ, RBAC chain ले cluster मा को ले के गर्न सक्छ control गर्छ बुझ्नुहुनेछ।",
    jp: "**RBAC（ロールベースアクセス制御）**は Kubernetes の権限システムです。**Role** は名前空間内でどのリソース（Pod・Deployment・Secret）に対してどのアクション（動詞：get・list・create・delete・patch）が許可されるかを定義します。**ClusterRole** は同じですがクラスタースコープです（またはノードのような非名前空間リソース用）。**RoleBinding** は名前空間内の**サブジェクト**（ユーザー・グループ・ServiceAccount）に Role を付与します。**ServiceAccount** は Pod が Kubernetes API を呼び出すときに使用する ID です — アプリケーションコードは Pod 内から `kubectl` を呼び出すために ServiceAccount トークンを使用できます。今日は名前空間・Role・RoleBinding・ServiceAccount を作成し、RBAC チェーンがクラスター内で誰が何をできるかを制御する方法を理解します。",
  } as const,
};

export const DEVOPS_DAY_63_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Namespaces & RBAC — access control model",
        np: "Namespace र RBAC — access control model",
        jp: "名前空間と RBAC — アクセス制御モデル",
      },
      blocks: [
        { type: "diagram", id: "devops-k8s-rbac" },
        {
          type: "table",
          caption: {
            en: "RBAC resources — roles, bindings & subjects",
            np: "RBAC resource — role, binding र subject",
            jp: "RBAC リソース — ロール・バインディング・サブジェクト",
          },
          headers: [
            { en: "Resource", np: "Resource", jp: "リソース" },
            { en: "Scope", np: "Scope", jp: "スコープ" },
            { en: "Defines", np: "Define गर्छ", jp: "定義するもの" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "Role", np: "Role", jp: "Role" },
              { en: "Namespace", np: "Namespace", jp: "名前空間" },
              { en: "Allowed verbs on resource types within one namespace", np: "एउटा namespace भित्र resource type मा allowed verb", jp: "1 つの名前空間内のリソースタイプに対する許可された動詞" },
              { en: "Allow `get`, `list` on `pods` in `staging` namespace", np: "`staging` namespace मा `pods` मा `get`, `list` allow", jp: "`staging` 名前空間の `pods` に対して `get`・`list` を許可" },
            ],
            [
              { en: "ClusterRole", np: "ClusterRole", jp: "ClusterRole" },
              { en: "Cluster-wide", np: "Cluster-wide", jp: "クラスター全体" },
              { en: "Allowed verbs on resources in all namespaces, or non-namespaced resources", np: "सबै namespace मा वा non-namespaced resource मा allowed verb", jp: "すべての名前空間またはクラスタースコープリソースに対する許可された動詞" },
              { en: "Allow `get` on `nodes` (nodes are not namespaced)", np: "`nodes` मा `get` allow (node namespaced छैन)", jp: "`nodes` に対して `get` を許可（nodes は名前空間なし）" },
            ],
            [
              { en: "RoleBinding", np: "RoleBinding", jp: "RoleBinding" },
              { en: "Namespace", np: "Namespace", jp: "名前空間" },
              { en: "Grants a Role (or ClusterRole) to a Subject in one namespace", np: "एउटा namespace मा Subject लाई Role (वा ClusterRole) grant गर्छ", jp: "1 つの名前空間のサブジェクトに Role（または ClusterRole）を付与" },
              { en: "Grant `pod-reader` Role to user `alice` in `staging`", np: "`staging` मा user `alice` लाई `pod-reader` Role grant", jp: "`staging` のユーザー `alice` に `pod-reader` Role を付与" },
            ],
            [
              { en: "ClusterRoleBinding", np: "ClusterRoleBinding", jp: "ClusterRoleBinding" },
              { en: "Cluster-wide", np: "Cluster-wide", jp: "クラスター全体" },
              { en: "Grants a ClusterRole to a Subject in all namespaces", np: "সবै namespace मा Subject लाई ClusterRole grant गर्छ", jp: "すべての名前空間でサブジェクトに ClusterRole を付与" },
              { en: "Grant `cluster-admin` to `ops-team` group", np: "`ops-team` group लाई `cluster-admin` grant", jp: "`ops-team` グループに `cluster-admin` を付与" },
            ],
            [
              { en: "ServiceAccount", np: "ServiceAccount", jp: "ServiceAccount" },
              { en: "Namespace", np: "Namespace", jp: "名前空間" },
              { en: "Identity for pods to call the Kubernetes API", np: "Pod ले Kubernetes API call गर्ने identity", jp: "Pod が Kubernetes API を呼び出すための ID" },
              { en: "CI/CD pod uses SA token to `kubectl apply` deployments", np: "CI/CD pod ले SA token प्रयोग गरेर deployment `kubectl apply` गर्छ", jp: "CI/CD ポッドが SA トークンを使って Deployment を `kubectl apply`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Namespaces, RBAC YAML & production hardening",
        np: "Namespace, RBAC YAML र production hardening",
        jp: "名前空間・RBAC YAML・本番ハードニング",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Namespace + Role + RoleBinding + ServiceAccount YAML",
            np: "Namespace + Role + RoleBinding + ServiceAccount YAML",
            jp: "名前空間 + Role + RoleBinding + ServiceAccount YAML",
          },
          code: `# ── Namespaces ────────────────────────────────────────────────────
kubectl create namespace staging
kubectl create namespace production
kubectl get namespaces

# Deploy to a specific namespace
kubectl apply -f deployment.yaml -n staging
kubectl get pods -n staging
kubectl get pods --all-namespaces            # -A shorthand

# ── Role — namespace-scoped permissions ──────────────────────────
# pod-reader-role.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: staging
rules:
- apiGroups: [""]                # "" = core API group (pods, services, configmaps)
  resources: ["pods", "pods/log"]
  verbs: ["get", "list", "watch"]
- apiGroups: ["apps"]
  resources: ["deployments", "replicasets"]
  verbs: ["get", "list"]

---
# ── RoleBinding — grant Role to a user ───────────────────────────
# pod-reader-binding.yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods
  namespace: staging
subjects:
- kind: User
  name: alice                    # matches the username in kubeconfig / OIDC token
  apiGroup: rbac.authorization.k8s.io
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io

---
# ── ServiceAccount for a CI/CD pod ───────────────────────────────
# deploy-sa.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deployer
  namespace: staging
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer-role
  namespace: staging
rules:
- apiGroups: ["apps"]
  resources: ["deployments"]
  verbs: ["get", "list", "update", "patch"]
- apiGroups: [""]
  resources: ["services", "configmaps"]
  verbs: ["get", "list", "create", "update", "patch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployer-binding
  namespace: staging
subjects:
- kind: ServiceAccount
  name: deployer
  namespace: staging
roleRef:
  kind: Role
  name: deployer-role
  apiGroup: rbac.authorization.k8s.io

# Use SA in a pod:
# spec:
#   serviceAccountName: deployer
#   containers: ...

# ── Test permissions without being alice ─────────────────────────
kubectl auth can-i get pods --namespace=staging --as=alice       # yes
kubectl auth can-i delete pods --namespace=staging --as=alice    # no
kubectl auth can-i get pods --namespace=production --as=alice    # no (wrong ns)

# ── ResourceQuota per namespace ───────────────────────────────────
apiVersion: v1
kind: ResourceQuota
metadata:
  name: staging-quota
  namespace: staging
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
    services: "10"

# ── LimitRange — default limits for pods that don't specify ───────
apiVersion: v1
kind: LimitRange
metadata:
  name: staging-limits
  namespace: staging
spec:
  limits:
  - default:
      cpu: 200m
      memory: 256Mi
    defaultRequest:
      cpu: 50m
      memory: 64Mi
    type: Container`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create `staging` and `production` namespaces. Deploy an nginx Pod in each namespace. Verify they are isolated by name: `kubectl get pods -n staging` and `kubectl get pods -n production` show separate pod lists. Then verify that a service named `webapp-svc` in `staging` is reachable from another pod in `staging` as `webapp-svc` but from `production` requires the full FQDN `webapp-svc.staging.svc.cluster.local`.",
              np: "`staging` र `production` namespace create गर्नुहोस्। हरेक namespace मा nginx Pod deploy गर्नुहोस्। तिनीहरू name बाट isolated छन् verify गर्नुहोस्: `kubectl get pods -n staging` र `kubectl get pods -n production` ले छुट्टा pod list show गर्छ। त्यसपछि `staging` मा `webapp-svc` नामको service `staging` मा अर्को pod बाट `webapp-svc` को रूपमा reachable छ तर `production` बाट full FQDN `webapp-svc.staging.svc.cluster.local` चाहिन्छ verify गर्नुहोस्।",
              jp: "`staging` と `production` 名前空間を作成する。各名前空間に nginx Pod をデプロイする。名前で分離されていることを確認する：`kubectl get pods -n staging` と `kubectl get pods -n production` が別々の Pod リストを表示する。次に `staging` の `webapp-svc` という名前のサービスが `staging` の別の Pod から `webapp-svc` としてアクセス可能だが、`production` からはフル FQDN `webapp-svc.staging.svc.cluster.local` が必要であることを確認する。",
            },
            {
              en: "Apply the `pod-reader` Role and RoleBinding for user `alice` in `staging`. Use `kubectl auth can-i` to verify the permissions: `kubectl auth can-i get pods -n staging --as=alice` should return `yes`, `kubectl auth can-i delete pods -n staging --as=alice` should return `no`, and `kubectl auth can-i get pods -n production --as=alice` should return `no`. This tests the RBAC policy without needing a real alice user.",
              np: "`staging` मा user `alice` को लागि `pod-reader` Role र RoleBinding apply गर्नुहोस्। Permission verify गर्न `kubectl auth can-i` प्रयोग गर्नुहोस्: `kubectl auth can-i get pods -n staging --as=alice` ले `yes` return गर्नुपर्छ, `kubectl auth can-i delete pods -n staging --as=alice` ले `no` return गर्नुपर्छ, र `kubectl auth can-i get pods -n production --as=alice` ले `no` return गर्नुपर्छ। यसले real alice user बिना RBAC policy test गर्छ।",
              jp: "`staging` のユーザー `alice` に `pod-reader` Role と RoleBinding を適用する。`kubectl auth can-i` を使って権限を確認する：`kubectl auth can-i get pods -n staging --as=alice` は `yes` を返すべき、`kubectl auth can-i delete pods -n staging --as=alice` は `no` を返すべき、`kubectl auth can-i get pods -n production --as=alice` は `no` を返すべき。これは実際の alice ユーザーなしで RBAC ポリシーをテストします。",
            },
            {
              en: "Create the `deployer` ServiceAccount and its Role/RoleBinding. Deploy a pod with `serviceAccountName: deployer` and exec into it. Inside the pod, run `curl -s --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\" https://kubernetes.default.svc/apis/apps/v1/namespaces/staging/deployments` — this is how in-cluster apps call the Kubernetes API using their ServiceAccount token.",
              np: "`deployer` ServiceAccount र यसको Role/RoleBinding create गर्नुहोस्। `serviceAccountName: deployer` सहित pod deploy गर्नुहोस् र exec गर्नुहोस्। Pod भित्र, `curl -s --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\" https://kubernetes.default.svc/apis/apps/v1/namespaces/staging/deployments` run गर्नुहोस् — यसरी in-cluster app ले ServiceAccount token प्रयोग गरेर Kubernetes API call गर्छ।",
              jp: "`deployer` ServiceAccount とその Role/RoleBinding を作成する。`serviceAccountName: deployer` でポッドをデプロイして exec する。ポッド内で `curl -s --cacert /var/run/secrets/kubernetes.io/serviceaccount/ca.crt -H \"Authorization: Bearer $(cat /var/run/secrets/kubernetes.io/serviceaccount/token)\" https://kubernetes.default.svc/apis/apps/v1/namespaces/staging/deployments` を実行する — これがクラスター内アプリが ServiceAccount トークンを使って Kubernetes API を呼び出す方法です。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Role and a ClusterRole? When do I need each?",
        np: "Role र ClusterRole बीचको फरक के हो? कहिले कुन चाहिन्छ?",
        jp: "Role と ClusterRole の違いは何か？それぞれいつ必要か？",
      },
      answer: {
        en: "A **Role** is namespace-scoped: it grants permissions to resources within one specific namespace. A RoleBinding applies it to a subject in that namespace. A **ClusterRole** is cluster-scoped: it either grants permissions across all namespaces (e.g., `get pods` in every namespace) or grants access to non-namespaced resources (nodes, persistentvolumes, namespaces themselves). Use a Role + RoleBinding when you want a user or ServiceAccount to have permission only in a specific namespace (e.g., a developer can deploy in `staging` but not `production`). Use a ClusterRole + ClusterRoleBinding when you need cluster-wide access (e.g., a monitoring agent that reads pod metrics from all namespaces). Importantly, you can use a ClusterRole with a RoleBinding (not ClusterRoleBinding) — this grants the ClusterRole's permissions but only within the specific namespace of the RoleBinding. This is a useful pattern: define permissions once as a ClusterRole, then grant them selectively per namespace via RoleBindings.",
        np: "**Role** namespace-scoped हो: एउटा specific namespace भित्र resource मा permission grant गर्छ। RoleBinding ले त्यो namespace मा subject मा apply गर्छ। **ClusterRole** cluster-scoped हो: सबै namespace मा permission grant गर्छ (जस्तै, हरेक namespace मा `get pods`) वा non-namespaced resource (node, persistentvolume, namespace itself) मा access grant गर्छ। User वा ServiceAccount लाई specific namespace मा मात्र permission चाहिँदा Role + RoleBinding प्रयोग गर्नुहोस् (जस्तै, developer ले `staging` मा deploy गर्न सक्छ तर `production` मा होइन)। Cluster-wide access चाहिँदा ClusterRole + ClusterRoleBinding प्रयोग गर्नुहोस् (जस्तै, सबै namespace बाट pod metric read गर्ने monitoring agent)। महत्त्वपूर्ण: ClusterRole लाई ClusterRoleBinding होइन, RoleBinding सँग प्रयोग गर्न सकिन्छ — यसले ClusterRole को permission grant गर्छ तर RoleBinding को specific namespace भित्र मात्र। यो उपयोगी pattern हो: permission एकपटक ClusterRole को रूपमा define गर्नुहोस्, त्यसपछि RoleBinding मार्फत per namespace selectively grant गर्नुहोस्।",
        jp: "**Role** は名前空間スコープです：1 つの特定の名前空間内のリソースに権限を付与します。RoleBinding はその名前空間のサブジェクトに適用します。**ClusterRole** はクラスタースコープです：すべての名前空間にわたって権限を付与（例：すべての名前空間で `get pods`）するか、名前空間なしのリソース（ノード・persistentvolume・名前空間自体）へのアクセスを付与します。ユーザーまたは ServiceAccount が特定の名前空間のみで権限を持つようにしたい場合は Role + RoleBinding を使用します（例：開発者は `staging` にデプロイできるが `production` はできない）。クラスター全体のアクセスが必要な場合は ClusterRole + ClusterRoleBinding を使用します（例：すべての名前空間から Pod メトリクスを読み取る監視エージェント）。重要：ClusterRole を ClusterRoleBinding ではなく RoleBinding と組み合わせて使用できます — これは ClusterRole の権限を付与しますが、RoleBinding の特定の名前空間内のみです。これは便利なパターンです：権限を一度 ClusterRole として定義し、RoleBinding で名前空間ごとに選択的に付与します。",
      },
      tag: { en: "Role vs ClusterRole", np: "Role vs ClusterRole", jp: "Role vs ClusterRole" },
    },
    {
      question: {
        en: "What are the key hardening steps for a production Kubernetes cluster?",
        np: "Production Kubernetes cluster को key hardening step के हुन्?",
        jp: "本番 Kubernetes クラスターの主要なハードニングステップは何か？",
      },
      answer: {
        en: "Production Kubernetes hardening has several layers: (1) **RBAC**: Enable RBAC (default in K8s 1.6+), apply least-privilege roles, avoid `cluster-admin` for application service accounts, use `kubectl auth can-i` to audit permissions. (2) **Network policies**: Apply default-deny policies per namespace, explicitly allow only needed flows. (3) **Pod Security**: Use Pod Security Admission (PSA) to enforce `restricted` or `baseline` policy per namespace — this blocks privileged containers, hostPath mounts, and running as root. (4) **Secrets**: Enable etcd encryption at rest, consider External Secrets Operator for Vault/AWS Secrets Manager integration. (5) **Image security**: Use image scanning (Trivy, Snyk), enforce image signing (cosign), pull from private registries. (6) **Audit logging**: Enable Kubernetes audit logs to track all API calls — who did what and when. (7) **Namespace isolation**: Use namespaces + ResourceQuotas to prevent noisy neighbours. (8) **Regular updates**: Keep Kubernetes version within 3 minor versions of latest to receive security patches.",
        np: "Production Kubernetes hardening मा धेरै layer छन्: (1) **RBAC**: RBAC enable गर्नुहोस् (K8s 1.6+ मा default), least-privilege role apply, application service account को लागि `cluster-admin` avoid, permission audit गर्न `kubectl auth can-i` प्रयोग। (2) **Network policy**: Per namespace default-deny policy apply, केवल needed flow explicitly allow। (3) **Pod Security**: Namespace per `restricted` वा `baseline` policy enforce गर्न Pod Security Admission (PSA) प्रयोग — यसले privileged container, hostPath mount, र root को रूपमा run block गर्छ। (4) **Secret**: Etcd encryption at rest enable, Vault/AWS Secrets Manager integration को लागि External Secrets Operator consider। (5) **Image security**: Image scanning (Trivy, Snyk) प्रयोग, image signing (cosign) enforce, private registry बाट pull। (6) **Audit logging**: सबै API call track गर्न Kubernetes audit log enable — को ले के कहिले गर्यो। (7) **Namespace isolation**: Noisy neighbour prevent गर्न namespace + ResourceQuota प्रयोग। (8) **Regular update**: Security patch पाउन Kubernetes version latest को 3 minor version भित्र राख्नुहोस्।",
        jp: "本番 Kubernetes ハードニングにはいくつかのレイヤーがあります：(1) **RBAC**：RBAC を有効化（K8s 1.6+ でデフォルト）、最小権限ロールを適用、アプリケーション ServiceAccount に `cluster-admin` を避け、`kubectl auth can-i` で権限を監査。(2) **ネットワークポリシー**：名前空間ごとにデフォルト拒否ポリシーを適用、必要なフローのみを明示的に許可。(3) **Pod セキュリティ**：名前空間ごとに `restricted` または `baseline` ポリシーを実施する Pod Security Admission（PSA）を使用 — 特権コンテナ・hostPath マウント・root での実行をブロック。(4) **シークレット**：etcd の保存時暗号化を有効化、Vault/AWS Secrets Manager 統合のために External Secrets Operator を検討。(5) **イメージセキュリティ**：イメージスキャン（Trivy・Snyk）を使用、イメージ署名（cosign）を実施、プライベートレジストリからプル。(6) **監査ロギング**：すべての API 呼び出しを追跡するために Kubernetes 監査ログを有効化 — 誰が何をいつ行ったか。(7) **名前空間分離**：ノイジーネイバーを防ぐために名前空間 + ResourceQuota を使用。(8) **定期的な更新**：セキュリティパッチを受け取るために Kubernetes バージョンを最新の 3 マイナーバージョン以内に保つ。",
      },
      tag: { en: "production hardening", np: "Production Hardening", jp: "本番ハードニング" },
    },
  ],
};
