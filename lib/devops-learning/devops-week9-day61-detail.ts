import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "As your Kubernetes applications grow beyond a few resources, managing raw YAML files becomes painful: a single microservice can require a Deployment, Service, ConfigMap, Secret, Ingress, HPA, and PodDisruptionBudget — that's seven files. Multiply by ten services and you're maintaining 70+ files with copy-pasted boilerplate. **Helm** is the Kubernetes package manager that solves this. A **Chart** is a collection of templated YAML files for a complete application. Instead of hardcoding values, you use Go template directives like `{{ .Values.image.tag }}`. A single `values.yaml` file holds all the tunables — image tag, replica count, resource limits, ingress hostname — and Helm renders the final manifests at deploy time.",
    np: "Kubernetes application केही resource भन्दा बढी हुँदा, raw YAML file manage गर्नु painful हुन्छ: एउटा microservice लाई Deployment, Service, ConfigMap, Secret, Ingress, HPA, र PodDisruptionBudget चाहिन सक्छ — त्यो सातवटा file हो। दश service ले multiply गर्दा copy-pasted boilerplate सहित 70+ file maintain गर्नुपर्छ। **Helm** Kubernetes package manager हो जसले यो solve गर्छ। **Chart** एउटा complete application को templated YAML file को collection हो। Value hardcode गर्नुको सट्टा `{{ .Values.image.tag }}` जस्ता Go template directive प्रयोग गर्नुहोस्। एउटा `values.yaml` file ले सबै tunable — image tag, replica count, resource limit, ingress hostname — राख्छ र Helm ले deploy time मा final manifest render गर्छ।",
    jp: "Kubernetes アプリケーションがいくつかのリソースを超えて成長すると、生の YAML ファイルの管理が辛くなります：1 つのマイクロサービスに Deployment・Service・ConfigMap・Secret・Ingress・HPA・PodDisruptionBudget が必要になることがあります — 7 つのファイルです。10 サービスに掛け算すると、コピーペーストされたボイラープレートで 70 以上のファイルを管理することになります。**Helm** はこれを解決する Kubernetes パッケージマネージャーです。**Chart** は完全なアプリケーションのテンプレート化された YAML ファイルの集合です。値をハードコードする代わりに `{{ .Values.image.tag }}` のような Go テンプレートディレクティブを使います。単一の `values.yaml` ファイルがすべての調整可能な値 — イメージタグ・レプリカ数・リソース制限・Ingress ホスト名 — を保持し、Helm はデプロイ時に最終的なマニフェストをレンダリングします。",
  } as const,
  o2: {
    en: "A **Release** is a deployed instance of a chart in a cluster. You can deploy the same chart multiple times (e.g., `myapp-staging` and `myapp-prod`) with different values. Helm tracks every release and its revision history in a Kubernetes Secret, enabling `helm rollback` in one command. **Helm Hub / Artifact Hub** hosts thousands of community charts — installing Prometheus, cert-manager, or ingress-nginx is a single `helm install` away. Today you scaffold a chart with `helm create`, customise `values.yaml`, deploy it with `helm install`, upgrade it, and roll back. You also install a real-world chart (ingress-nginx or metrics-server) from a remote repository.",
    np: "**Release** cluster मा chart को deployed instance हो। तपाईंले same chart multiple pटक (जस्तै, `myapp-staging` र `myapp-prod`) different value सहित deploy गर्न सक्नुहुन्छ। Helm ले हरेक release र यसको revision history Kubernetes Secret मा track गर्छ, जसले एउटा command मा `helm rollback` enable गर्छ। **Helm Hub / Artifact Hub** ले thousands of community chart host गर्छ — Prometheus, cert-manager, वा ingress-nginx install गर्नु single `helm install` मात्र हो। आज तपाईंले `helm create` सँग chart scaffold गर्नुहुनेछ, `values.yaml` customise गर्नुहुनेछ, `helm install` सँग deploy गर्नुहुनेछ, upgrade गर्नुहुनेछ, र roll back गर्नुहुनेछ। साथै remote repository बाट real-world chart (ingress-nginx वा metrics-server) install गर्नुहुनेछ।",
    jp: "**Release** はクラスター内のチャートのデプロイされたインスタンスです。同じチャートを異なる値で複数回デプロイできます（例：`myapp-staging` と `myapp-prod`）。Helm はすべてのリリースとそのリビジョン履歴を Kubernetes Secret で追跡し、1 つのコマンドで `helm rollback` を可能にします。**Helm Hub / Artifact Hub** は何千ものコミュニティチャートをホストしています — Prometheus・cert-manager・ingress-nginx のインストールは `helm install` 1 つです。今日は `helm create` でチャートを作成し、`values.yaml` をカスタマイズし、`helm install` でデプロイし、アップグレードし、ロールバックします。またリモートリポジトリから実際のチャート（ingress-nginx または metrics-server）もインストールします。",
  } as const,
};

export const DEVOPS_DAY_61_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Helm architecture — charts, releases & the template engine",
        np: "Helm architecture — chart, release र template engine",
        jp: "Helm アーキテクチャ — チャート・リリース・テンプレートエンジン",
      },
      blocks: [
        { type: "diagram", id: "devops-helm-workflow" },
        {
          type: "table",
          caption: {
            en: "Raw kubectl manifests vs Helm — what each layer adds",
            np: "Raw kubectl manifest vs Helm — हरेक layer ले के थप्छ",
            jp: "生の kubectl マニフェスト vs Helm — 各レイヤーが追加するもの",
          },
          headers: [
            { en: "Concern", np: "चिन्ता", jp: "懸念事項" },
            { en: "Raw YAML + kubectl", np: "Raw YAML + kubectl", jp: "生の YAML + kubectl" },
            { en: "Helm", np: "Helm", jp: "Helm" },
          ],
          rows: [
            [
              { en: "Parameterisation", np: "Parameterisation", jp: "パラメータ化" },
              { en: "Hardcoded values — copy-paste per environment", np: "Hardcoded value — environment प्रति copy-paste", jp: "ハードコードされた値 — 環境ごとにコピーペースト" },
              { en: "`values.yaml` overrides — `helm install -f prod-values.yaml`", np: "`values.yaml` override — `helm install -f prod-values.yaml`", jp: "`values.yaml` オーバーライド — `helm install -f prod-values.yaml`" },
            ],
            [
              { en: "Packaging", np: "Packaging", jp: "パッケージング" },
              { en: "Loose YAML files in a directory", np: "Directory मा loose YAML file", jp: "ディレクトリの散在する YAML ファイル" },
              { en: "`.tgz` chart archive — versioned, shareable, published to a repo", np: "`.tgz` chart archive — versioned, shareable, repo मा published", jp: "`.tgz` チャートアーカイブ — バージョン管理・共有可能・リポジトリに公開" },
            ],
            [
              { en: "Release tracking", np: "Release tracking", jp: "リリース追跡" },
              { en: "No history — you must track what's deployed externally", np: "No history — deployed छ externally track गर्नुपर्छ", jp: "履歴なし — 外部でデプロイ状態を追跡する必要あり" },
              { en: "Full revision history in cluster Secrets — `helm history <release>`", np: "Cluster Secret मा full revision history — `helm history <release>`", jp: "クラスター Secret の完全なリビジョン履歴 — `helm history <release>`" },
            ],
            [
              { en: "Rollback", np: "Rollback", jp: "ロールバック" },
              { en: "Manual — find old manifests, re-apply", np: "Manual — old manifest खोज्नुहोस्, re-apply", jp: "手動 — 古いマニフェストを探して再適用" },
              { en: "`helm rollback <release> <revision>` — instant", np: "`helm rollback <release> <revision>` — instant", jp: "`helm rollback <release> <revision>` — 即時" },
            ],
            [
              { en: "Reuse", np: "Reuse", jp: "再利用" },
              { en: "Copy directory per app — drift over time", np: "App प्रति directory copy — time सँगै drift", jp: "アプリごとにディレクトリをコピー — 時間とともにドリフト" },
              { en: "Public charts from Artifact Hub — one command install", np: "Artifact Hub बाट public chart — one command install", jp: "Artifact Hub の公開チャート — ワンコマンドインストール" },
            ],
            [
              { en: "Conditional resources", np: "Conditional resource", jp: "条件付きリソース" },
              { en: "Manual — maintain separate files per environment", np: "Manual — environment प्रति separate file maintain", jp: "手動 — 環境ごとに別々のファイルを管理" },
              { en: "`{{ if .Values.ingress.enabled }}` — include/exclude entire resources", np: "`{{ if .Values.ingress.enabled }}` — entire resource include/exclude", jp: "`{{ if .Values.ingress.enabled }}` — リソース全体を含める/除外する" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Creating, installing & upgrading a Helm chart",
        np: "Helm chart create, install र upgrade गर्ने",
        jp: "Helm チャートの作成・インストール・アップグレード",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "helm create, values.yaml, templates & lifecycle commands",
            np: "helm create, values.yaml, template र lifecycle command",
            jp: "helm create・values.yaml・テンプレートと lifecycle コマンド",
          },
          code: `# ── Install Helm ──────────────────────────────────────────────────
brew install helm
helm version                          # v3.x.x

# ── Scaffold a new chart ──────────────────────────────────────────
helm create webapp
# webapp/
# ├── Chart.yaml          # chart metadata (name, version, appVersion)
# ├── values.yaml         # default configurable values
# ├── charts/             # sub-chart dependencies
# └── templates/
#     ├── deployment.yaml
#     ├── service.yaml
#     ├── ingress.yaml
#     ├── hpa.yaml
#     ├── serviceaccount.yaml
#     ├── _helpers.tpl    # reusable template snippets
#     └── NOTES.txt       # printed after install

# ── values.yaml (defaults) ────────────────────────────────────────
# replicaCount: 1
# image:
#   repository: nginx
#   tag: "1.25-alpine"
#   pullPolicy: IfNotPresent
# service:
#   type: ClusterIP
#   port: 80
# ingress:
#   enabled: false
#   host: myapp.example.com
# resources:
#   limits:
#     cpu: 200m
#     memory: 128Mi
#   requests:
#     cpu: 50m
#     memory: 64Mi

# ── templates/deployment.yaml (excerpt) ──────────────────────────
# apiVersion: apps/v1
# kind: Deployment
# metadata:
#   name: {{ include "webapp.fullname" . }}
#   labels: {{- include "webapp.labels" . | nindent 4 }}
# spec:
#   replicas: {{ .Values.replicaCount }}
#   template:
#     spec:
#       containers:
#       - name: {{ .Chart.Name }}
#         image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
#         ports:
#         - containerPort: 80
#         resources: {{- toYaml .Values.resources | nindent 12 }}

# ── Dry-run to see rendered YAML ──────────────────────────────────
helm template webapp ./webapp                   # render locally, no install
helm install webapp ./webapp --dry-run          # render + validate against cluster

# ── Install ───────────────────────────────────────────────────────
helm install webapp ./webapp                    # release name: webapp
helm install webapp ./webapp \
  --set image.tag=1.26-alpine \
  --set replicaCount=3                          # override individual values

# environment-specific values file
helm install webapp ./webapp -f prod-values.yaml

# ── Inspect a release ─────────────────────────────────────────────
helm list                                       # all releases
helm status webapp                              # current state
helm get values webapp                          # values used
helm get manifest webapp                        # rendered manifests

# ── Upgrade ──────────────────────────────────────────────────────
helm upgrade webapp ./webapp --set image.tag=1.27-alpine
helm upgrade webapp ./webapp -f prod-values.yaml --install  # upgrade or install

# ── Rollback ─────────────────────────────────────────────────────
helm history webapp                             # REVISION  STATUS    CHART
helm rollback webapp 1                          # roll back to revision 1

# ── Uninstall ────────────────────────────────────────────────────
helm uninstall webapp

# ── Install from Artifact Hub (real-world chart) ─────────────────
helm repo add ingress-nginx https://kubernetes.github.io/ingress-nginx
helm repo update
helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-nginx --create-namespace

helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/
helm install metrics-server metrics-server/metrics-server \
  --set args[0]=--kubelet-insecure-tls          # needed for minikube`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Run `helm create webapp` and explore the scaffolded directory. Open `templates/deployment.yaml` and identify where `{{ .Values.replicaCount }}` and `{{ .Values.image.tag }}` are used. Run `helm template webapp ./webapp` to see the rendered YAML with default values. Then run it again with `--set replicaCount=3` and confirm the Deployment's `spec.replicas` changes to 3.",
              np: "`helm create webapp` run गर्नुहोस् र scaffolded directory explore गर्नुहोस्। `templates/deployment.yaml` खोल्नुहोस् र `{{ .Values.replicaCount }}` र `{{ .Values.image.tag }}` कहाँ use भएको identify गर्नुहोस्। Default value सहित rendered YAML हेर्न `helm template webapp ./webapp` run गर्नुहोस्। त्यसपछि `--set replicaCount=3` सहित फेरि run गर्नुहोस् र Deployment को `spec.replicas` 3 मा change भएको confirm गर्नुहोस्।",
              jp: "`helm create webapp` を実行してスキャフォルドされたディレクトリを探索する。`templates/deployment.yaml` を開いて `{{ .Values.replicaCount }}` と `{{ .Values.image.tag }}` が使われている場所を特定する。`helm template webapp ./webapp` を実行してデフォルト値でレンダリングされた YAML を確認する。次に `--set replicaCount=3` で再実行して Deployment の `spec.replicas` が 3 に変わることを確認する。",
            },
            {
              en: "Install the chart with `helm install webapp ./webapp` and verify with `helm list` and `kubectl get pods`. Then upgrade it with `helm upgrade webapp ./webapp --set image.tag=1.26-alpine`. Run `helm history webapp` to see the two revisions. Roll back with `helm rollback webapp 1` and confirm the pod is running the original image tag. This is the complete Helm release lifecycle.",
              np: "`helm install webapp ./webapp` सँग chart install गर्नुहोस् र `helm list` र `kubectl get pods` सँग verify गर्नुहोस्। त्यसपछि `helm upgrade webapp ./webapp --set image.tag=1.26-alpine` सँग upgrade गर्नुहोस्। `helm history webapp` run गर्नुहोस् र दुईवटा revision हेर्नुहोस्। `helm rollback webapp 1` सँग roll back गर्नुहोस् र pod original image tag run भइरहेको confirm गर्नुहोस्। यो complete Helm release lifecycle हो।",
              jp: "`helm install webapp ./webapp` でチャートをインストールして `helm list` と `kubectl get pods` で確認する。次に `helm upgrade webapp ./webapp --set image.tag=1.26-alpine` でアップグレードする。`helm history webapp` を実行して 2 つのリビジョンを確認する。`helm rollback webapp 1` でロールバックしてポッドが元のイメージタグで実行されていることを確認する。これが完全な Helm リリースライフサイクルです。",
            },
            {
              en: "Add the ingress-nginx Helm repository and install it into a dedicated namespace. Verify the Ingress Controller pod is Running in `ingress-nginx` namespace. Then migrate the path-based routing Ingress from Day 60 — instead of `kubectl apply -f ingress.yaml`, package the Ingress into your webapp chart's `templates/ingress.yaml` with `{{ if .Values.ingress.enabled }}` guard and `host: {{ .Values.ingress.host }}` template. Enable it with `helm upgrade webapp ./webapp --set ingress.enabled=true --set ingress.host=myapp.local`.",
              np: "ingress-nginx Helm repository add गर्नुहोस् र dedicated namespace मा install गर्नुहोस्। `ingress-nginx` namespace मा Ingress Controller pod Running छ verify गर्नुहोस्। त्यसपछि Day 60 बाट path-based routing Ingress migrate गर्नुहोस् — `kubectl apply -f ingress.yaml` को सट्टा `{{ if .Values.ingress.enabled }}` guard र `host: {{ .Values.ingress.host }}` template सहित webapp chart को `templates/ingress.yaml` मा Ingress package गर्नुहोस्। `helm upgrade webapp ./webapp --set ingress.enabled=true --set ingress.host=myapp.local` सँग enable गर्नुहोस्।",
              jp: "ingress-nginx Helm リポジトリを追加して専用の名前空間にインストールする。`ingress-nginx` 名前空間で Ingress Controller ポッドが Running であることを確認する。次に Day 60 のパスベースルーティング Ingress を移行する — `kubectl apply -f ingress.yaml` の代わりに `{{ if .Values.ingress.enabled }}` ガードと `host: {{ .Values.ingress.host }}` テンプレートで webapp チャートの `templates/ingress.yaml` に Ingress をパッケージ化する。`helm upgrade webapp ./webapp --set ingress.enabled=true --set ingress.host=myapp.local` で有効にする。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Helm Chart, a Release, and a Revision?",
        np: "Helm Chart, Release, र Revision बीचको फरक के हो?",
        jp: "Helm Chart・Release・Revision の違いは何か？",
      },
      answer: {
        en: "A **Chart** is the package — a directory (or `.tgz` archive) of templated YAML files and a `Chart.yaml` with metadata. It's the blueprint. A **Release** is a named running instance of a chart in a cluster. You can install the same chart multiple times with different names and different values: `helm install myapp-staging ./webapp -f staging.yaml` and `helm install myapp-prod ./webapp -f prod.yaml` — these are two separate Releases. A **Revision** is a numbered snapshot of a Release: every `helm upgrade` creates a new revision. Revision 1 is the initial install, revision 2 is after the first upgrade, etc. Helm stores revision state as base64-encoded Secrets in Kubernetes (`helm.sh/release.v1` type). `helm rollback myapp-prod 2` reapplies the manifests from revision 2. This revision history is what makes Helm's rollback reliable — it replays the exact manifests from a previous state, not just the image tag.",
        np: "**Chart** package हो — templated YAML file र metadata सहित `Chart.yaml` को directory (वा `.tgz` archive)। यो blueprint हो। **Release** cluster मा chart को named running instance हो। तपाईंले same chart different name र different value सहित multiple time install गर्न सक्नुहुन्छ: `helm install myapp-staging ./webapp -f staging.yaml` र `helm install myapp-prod ./webapp -f prod.yaml` — यी दुईवटा अलग Release हुन्। **Revision** Release को numbered snapshot हो: हरेक `helm upgrade` ले new revision create गर्छ। Revision 1 initial install हो, revision 2 first upgrade पछि, आदि। Helm ले revision state Kubernetes मा base64-encoded Secret को रूपमा store गर्छ (`helm.sh/release.v1` type)। `helm rollback myapp-prod 2` ले revision 2 बाट manifest reapply गर्छ। यो revision history नै Helm को rollback reliable बनाउँछ — यसले image tag मात्र होइन, previous state बाट exact manifest replay गर्छ।",
        jp: "**Chart** はパッケージです — テンプレート化された YAML ファイルとメタデータを持つ `Chart.yaml` のディレクトリ（または `.tgz` アーカイブ）。これが設計図です。**Release** はクラスター内のチャートの名前付き実行インスタンスです。同じチャートを異なる名前と異なる値で複数回インストールできます：`helm install myapp-staging ./webapp -f staging.yaml` と `helm install myapp-prod ./webapp -f prod.yaml` — これらは 2 つの別々の Release です。**Revision** は Release の番号付きスナップショットです：すべての `helm upgrade` が新しいリビジョンを作成します。リビジョン 1 は初回インストール、リビジョン 2 は最初のアップグレード後、などです。Helm はリビジョン状態を Kubernetes に base64 エンコードされた Secret として保存します（`helm.sh/release.v1` タイプ）。`helm rollback myapp-prod 2` はリビジョン 2 のマニフェストを再適用します。このリビジョン履歴が Helm のロールバックを信頼できるものにしています — イメージタグだけでなく、以前の状態から正確なマニフェストを再実行します。",
      },
      tag: { en: "chart vs release", np: "Chart vs Release", jp: "Chart vs Release" },
    },
    {
      question: {
        en: "When should I write my own Helm chart vs using a community chart from Artifact Hub?",
        np: "आफ्नै Helm chart लेख्ने कि Artifact Hub बाट community chart प्रयोग गर्ने?",
        jp: "独自の Helm チャートを書くべきか、Artifact Hub のコミュニティチャートを使うべきか？",
      },
      answer: {
        en: "Use **community charts** for infrastructure components: ingress-nginx, cert-manager, Prometheus, Grafana, PostgreSQL, Redis, Kafka. These are battle-tested, actively maintained, and expose hundreds of values for customization. Installing Prometheus from the community `kube-prometheus-stack` chart takes 5 minutes and gives you dashboards, alerting rules, and service monitors out of the box. Write **your own chart** for your application code — the apps your team builds. Community charts exist for every piece of infrastructure but not for your specific microservices. Start with `helm create` to scaffold, then delete the parts you don't need (e.g., remove the HPA template if you're managing scaling separately). A good rule of thumb: if the software has a Helm chart on Artifact Hub with >1M downloads, use that chart and customise with values. If you're packaging your own app, write the chart.",
        np: "Infrastructure component को लागि **community chart** प्रयोग गर्नुहोस्: ingress-nginx, cert-manager, Prometheus, Grafana, PostgreSQL, Redis, Kafka। यी battle-tested, actively maintained, र customization को लागि hundreds of value expose गर्छन्। Community `kube-prometheus-stack` chart बाट Prometheus install गर्न 5 minute लाग्छ र out of the box dashboard, alerting rule, र service monitor दिन्छ। तपाईंको application code को लागि **आफ्नै chart** लेख्नुहोस् — तपाईंको team ले build गर्ने app। Community chart ले हरेक infrastructure piece को लागि exist गर्छ तर तपाईंको specific microservice को लागि होइन। Scaffold गर्न `helm create` बाट start गर्नुहोस्, त्यसपछि आवश्यक नभएका part delete गर्नुहोस् (जस्तै, scaling छुट्टै manage गर्दै हुनुहुन्छ भने HPA template remove गर्नुहोस्)। Good rule of thumb: software को Artifact Hub मा >1M download सहित Helm chart छ भने त्यो chart प्रयोग गरेर value सँग customise गर्नुहोस्। आफ्नै app package गर्दै हुनुहुन्छ भने chart लेख्नुहोस्।",
        jp: "インフラコンポーネントには**コミュニティチャート**を使用します：ingress-nginx・cert-manager・Prometheus・Grafana・PostgreSQL・Redis・Kafka。これらは実証済みで積極的にメンテナンスされており、カスタマイズのための何百もの値を公開しています。コミュニティの `kube-prometheus-stack` チャートから Prometheus をインストールするのに 5 分かかり、ダッシュボード・アラートルール・サービスモニターをすぐに提供します。チームが構築するアプリ — アプリケーションコードには**独自チャート**を書きます。コミュニティチャートはすべてのインフラ部品に存在しますが、特定のマイクロサービスにはありません。`helm create` でスキャフォルドを開始し、不要な部分を削除します（例：スケーリングを別で管理する場合は HPA テンプレートを削除）。良い経験則：ソフトウェアが Artifact Hub に 100 万以上のダウンロードの Helm チャートがあれば、そのチャートを使って値でカスタマイズします。自分のアプリをパッケージ化するならチャートを書きます。",
      },
      tag: { en: "own vs community", np: "Own vs Community", jp: "独自 vs コミュニティ" },
    },
  ],
};
