import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A Docker image that works locally is only safe to ship if you have validated where it came from, what CVEs it carries, and whether it was tampered in transit. Today covers the full image supply chain: choosing and running a private registry (Docker Hub, ECR, GHCR, Harbor), semantic image tagging strategies, automated vulnerability scanning with Trivy, multi-architecture builds with `docker buildx`, and a consolidated set of Dockerfile and image hygiene best practices that you can apply to every image you build from today onward.",
    np: "Locally काम गर्ने Docker image तब मात्र ship गर्न safe छ जब तपाईंले कहाँबाट आयो, कुन CVE carry गर्छ, र transit मा tamper भयो कि भएन validate गर्नुभएको छ। आज full image supply chain cover गर्छ: private registry choose र run गर्ने (Docker Hub, ECR, GHCR, Harbor), semantic image tagging strategy, Trivy नाल automated vulnerability scanning, `docker buildx` नाल multi-architecture build, र Dockerfile र image hygiene best practice को consolidated set जुन तपाईंले आजदेखि हरेक image मा apply गर्न सक्नुहुन्छ।",
    jp: "ローカルで動作する Docker イメージは、どこから来たか・どの CVE を持っているか・転送中に改ざんされていないかを検証した場合にのみ安全に出荷できます。今日はイメージのサプライチェーン全体をカバーします：プライベートレジストリの選択と実行（Docker Hub・ECR・GHCR・Harbor）・セマンティックイメージタグ戦略・Trivy による自動脆弱性スキャン・`docker buildx` によるマルチアーキテクチャビルド・今日から作成するすべてのイメージに適用できる Dockerfile とイメージ衛生のベストプラクティスの総合セット。",
  } as const,
  o2: {
    en: "By the end of today you will be able to push a signed image to ECR or GHCR, scan it for CVEs in CI, block builds on critical findings, and apply a 12-point Dockerfile hardening checklist that cuts image size and attack surface simultaneously.",
    np: "आजको अन्तसम्म तपाईं signed image लाई ECR वा GHCR मा push गर्न, CI मा CVE को लागि scan गर्न, critical finding मा build block गर्न, र एकैसाथ image size र attack surface दुवै cut गर्ने 12-point Dockerfile hardening checklist apply गर्न सक्षम हुनुहुनेछ।",
    jp: "今日の終わりには、署名されたイメージを ECR または GHCR にプッシュし、CI で CVE をスキャンし、重大な発見でビルドをブロックし、イメージサイズと攻撃対象領域を同時に削減する 12 ポイントの Dockerfile ハードニングチェックリストを適用できるようになります。",
  } as const,
};

export const DEVOPS_DAY_49_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Registry options & image tagging strategies",
        np: "Registry option र image tagging strategy",
        jp: "レジストリオプションとイメージタグ戦略",
      },
      blocks: [
        { type: "diagram", id: "devops-image-registry" },
        {
          type: "table",
          caption: {
            en: "Container registry comparison — public/private, pricing, and key features",
            np: "Container registry comparison — public/private, pricing, र key feature",
            jp: "コンテナレジストリの比較 — パブリック/プライベート・価格・主な機能",
          },
          headers: [
            { en: "Registry", np: "Registry", jp: "レジストリ" },
            { en: "Type", np: "Type", jp: "タイプ" },
            { en: "Auth", np: "Auth", jp: "認証" },
            { en: "Scanning", np: "Scanning", jp: "スキャン" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "Docker Hub", np: "Docker Hub", jp: "Docker Hub" },
              { en: "Public + private", np: "Public + private", jp: "パブリック + プライベート" },
              { en: "docker login", np: "docker login", jp: "docker login" },
              { en: "Basic (free tier)", np: "Basic (free tier)", jp: "基本（無料枠）" },
              { en: "Open-source projects, public images, learning", np: "Open-source project, public image, learning", jp: "オープンソースプロジェクト・パブリックイメージ・学習" },
            ],
            [
              { en: "Amazon ECR", np: "Amazon ECR", jp: "Amazon ECR" },
              { en: "Private (per-account)", np: "Private (per-account)", jp: "プライベート（アカウントごと）" },
              { en: "aws ecr get-login-password | docker login", np: "aws ecr get-login-password | docker login", jp: "aws ecr get-login-password | docker login" },
              { en: "ECR Enhanced (Snyk-powered)", np: "ECR Enhanced (Snyk-powered)", jp: "ECR Enhanced（Snyk 採用）" },
              { en: "AWS-native workloads (ECS, EKS, Lambda)", np: "AWS-native workload (ECS, EKS, Lambda)", jp: "AWS ネイティブワークロード（ECS・EKS・Lambda）" },
            ],
            [
              { en: "GitHub GHCR", np: "GitHub GHCR", jp: "GitHub GHCR" },
              { en: "Public + private", np: "Public + private", jp: "パブリック + プライベート" },
              { en: "GITHUB_TOKEN (automatic in Actions)", np: "GITHUB_TOKEN (Actions で automatic)", jp: "GITHUB_TOKEN（Actions では自動）" },
              { en: "Via Dependabot / third-party", np: "Dependabot / third-party 経由", jp: "Dependabot / サードパーティ経由" },
              { en: "GitHub-hosted projects, tight CI integration", np: "GitHub-hosted project, tight CI integration", jp: "GitHub ホストプロジェクト・緊密な CI 統合" },
            ],
            [
              { en: "Harbor (self-hosted)", np: "Harbor (self-hosted)", jp: "Harbor（セルフホスト）" },
              { en: "Private (on-prem / cloud VM)", np: "Private (on-prem / cloud VM)", jp: "プライベート（オンプレミス/クラウド VM）" },
              { en: "OIDC, LDAP, robot accounts", np: "OIDC, LDAP, robot account", jp: "OIDC・LDAP・ロボットアカウント" },
              { en: "Trivy built-in, policy enforcement", np: "Trivy built-in, policy enforcement", jp: "Trivy 内蔵・ポリシー強制" },
              { en: "Air-gapped environments, compliance-heavy orgs", np: "Air-gapped environment, compliance-heavy org", jp: "エアギャップ環境・コンプライアンスが重要な組織" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Image scanning, multi-arch builds & Dockerfile hardening checklist",
        np: "Image scanning, multi-arch build र Dockerfile hardening checklist",
        jp: "イメージスキャン・マルチアーキテクチャビルド・Dockerfile ハードニングチェックリスト",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "ECR push, Trivy scanning, buildx multi-arch, and tagging strategy",
            np: "ECR push, Trivy scanning, buildx multi-arch, र tagging strategy",
            jp: "ECR プッシュ・Trivy スキャン・buildx マルチアーキテクチャ・タグ戦略",
          },
          code: `# ── Tagging strategy ─────────────────────────────────────────
# BAD: :latest only — immutable? no. rollback? impossible.
# GOOD: semantic version + git SHA + environment tag
IMAGE=myuser/api
VERSION=1.4.2
SHA=$(git rev-parse --short HEAD)

docker build -t \${IMAGE}:\${VERSION} -t \${IMAGE}:\${VERSION}-\${SHA} .
# Also tag :latest only after a successful production deploy

# ── Push to Docker Hub ────────────────────────────────────────
docker login
docker push \${IMAGE}:\${VERSION}
docker push \${IMAGE}:\${VERSION}-\${SHA}

# ── Push to Amazon ECR ────────────────────────────────────────
AWS_ACCOUNT=123456789012
AWS_REGION=us-east-1
ECR_REPO=\${AWS_ACCOUNT}.dkr.ecr.\${AWS_REGION}.amazonaws.com/api

# Authenticate (token valid 12 hours)
aws ecr get-login-password --region \${AWS_REGION} | \\
  docker login --username AWS --password-stdin \${AWS_ACCOUNT}.dkr.ecr.\${AWS_REGION}.amazonaws.com

# Tag and push
docker tag \${IMAGE}:\${VERSION} \${ECR_REPO}:\${VERSION}
docker push \${ECR_REPO}:\${VERSION}

# ECR lifecycle policy: keep only last 10 images tagged 'v*'
aws ecr put-lifecycle-policy --repository-name api \\
  --lifecycle-policy '{"rules":[{"rulePriority":1,"description":"Keep 10 releases","selection":{"tagStatus":"tagged","tagPrefixList":["v"],"countType":"imageCountMoreThan","countNumber":10},"action":{"type":"expire"}}]}'

# ── Scan with Trivy (local) ────────────────────────────────────
# Install: brew install trivy  |  apt install trivy
trivy image \${IMAGE}:\${VERSION}                          # all findings
trivy image --severity HIGH,CRITICAL \${IMAGE}:\${VERSION} # only H/C
trivy image --exit-code 1 --severity CRITICAL \${IMAGE}:\${VERSION}
# Exit code 1 if any CRITICAL found → use this in CI to block the pipeline

# Generate SBOM (Software Bill of Materials)
trivy image --format cyclonedx -o sbom.json \${IMAGE}:\${VERSION}

# ── Multi-architecture builds with buildx ─────────────────────
# Create a multi-platform builder (uses QEMU under the hood)
docker buildx create --name multi --use
docker buildx inspect --bootstrap

# Build and push for amd64 (x86 servers) + arm64 (Graviton, Apple M1)
docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  --tag \${IMAGE}:\${VERSION} \\
  --push \\
  .

# Verify the manifest list covers both architectures
docker buildx imagetools inspect \${IMAGE}:\${VERSION}

# ── Push to GHCR (GitHub Container Registry) ─────────────────
echo \$GITHUB_TOKEN | docker login ghcr.io -u \$GITHUB_ACTOR --password-stdin
docker tag \${IMAGE}:\${VERSION} ghcr.io/myorg/api:\${VERSION}
docker push ghcr.io/myorg/api:\${VERSION}`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install Trivy (`brew install trivy` or `apt install trivy`). Pull three public images of your choice and scan them: `trivy image <name>`. Compare the number of HIGH/CRITICAL CVEs in a `latest` tag versus a specific pinned digest or slim/alpine variant. This demonstrates why you should pin base images.",
              np: "Trivy install गर्नुहोस् (`brew install trivy` वा `apt install trivy`)। तपाईंको choice का तीन public image pull गरी scan गर्नुहोस्: `trivy image <name>`। `latest` tag र specific pinned digest वा slim/alpine variant मा HIGH/CRITICAL CVE को संख्या compare गर्नुहोस्। यसले किन base image pin गर्नुपर्छ demonstrate गर्छ।",
              jp: "Trivy をインストールする（`brew install trivy` または `apt install trivy`）。任意のパブリックイメージを 3 つプルしてスキャンする：`trivy image <name>`。`latest` タグと特定のピン留めされたダイジェストまたは slim/alpine バリアントの HIGH/CRITICAL CVE の数を比較する。これはベースイメージをピン留めすべき理由を示しています。",
            },
            {
              en: "Build a multi-stage Node.js image and scan it. Then apply all the items from the Dockerfile best-practices below (non-root USER, pinned FROM, no secrets in ENV, .dockerignore) and rescan. Document the CVE count before and after.",
              np: "Multi-stage Node.js image build गरी scan गर्नुहोस्। त्यसपछि Dockerfile best-practice का सबै item apply गर्नुहोस् (non-root USER, pinned FROM, ENV मा secret छैन, .dockerignore) र rescan गर्नुहोस्। पहिले र पछिको CVE count document गर्नुहोस्।",
              jp: "マルチステージ Node.js イメージをビルドしてスキャンする。次に Dockerfile のベストプラクティスのすべての項目を適用して（非 root USER・ピン留めされた FROM・ENV にシークレットなし・.dockerignore）再スキャンする。適用前後の CVE 数を記録する。",
            },
            {
              en: "Set up `docker buildx` and build a multi-architecture image for `linux/amd64,linux/arm64`. Use `docker buildx imagetools inspect` to verify both platforms are present in the manifest. If you have an ARM machine (Apple M1/M2), pull the image and confirm it runs natively.",
              np: "`docker buildx` setup गर्नुहोस् र `linux/amd64,linux/arm64` को लागि multi-architecture image build गर्नुहोस्। Manifest मा दुवै platform present छ verify गर्न `docker buildx imagetools inspect` प्रयोग गर्नुहोस्। ARM machine (Apple M1/M2) छ भने image pull गर्नुहोस् र natively run हुन्छ confirm गर्नुहोस्।",
              jp: "`docker buildx` をセットアップして `linux/amd64,linux/arm64` のマルチアーキテクチャイメージをビルドする。`docker buildx imagetools inspect` を使用してマニフェストに両方のプラットフォームが存在することを確認する。ARM マシン（Apple M1/M2）がある場合は、イメージをプルしてネイティブに実行されることを確認する。",
            },
          ],
        },
        {
          type: "table",
          caption: {
            en: "Dockerfile hardening checklist — 12 rules for smaller, safer images",
            np: "Dockerfile hardening checklist — smaller, safer image को लागि 12 rule",
            jp: "Dockerfile ハードニングチェックリスト — より小さく安全なイメージのための 12 のルール",
          },
          headers: [
            { en: "#", np: "#", jp: "#" },
            { en: "Rule", np: "Rule", jp: "ルール" },
            { en: "Why it matters", np: "किन important", jp: "重要な理由" },
          ],
          rows: [
            [
              { en: "1", np: "1", jp: "1" },
              { en: "Pin the base image to a digest (`FROM node:20-alpine@sha256:…`)", np: "Base image digest pin गर्नुहोस्", jp: "ベースイメージをダイジェストにピン留めする" },
              { en: "Prevents silent upstream changes from breaking your build", np: "Silent upstream change ले build break गर्न रोक्छ", jp: "サイレントな上流の変更によるビルドの破損を防ぐ" },
            ],
            [
              { en: "2", np: "2", jp: "2" },
              { en: "Use multi-stage builds to exclude build tools from the final image", np: "Final image बाट build tool exclude गर्न multi-stage प्रयोग", jp: "マルチステージビルドを使用してビルドツールを最終イメージから除外する" },
              { en: "Slashes image size 70–90% and removes compiler CVEs", np: "Image size 70–90% slash गर्छ र compiler CVE remove", jp: "イメージサイズを 70〜90% 削減しコンパイラ CVE を除去する" },
            ],
            [
              { en: "3", np: "3", jp: "3" },
              { en: "Add a comprehensive .dockerignore (node_modules, .git, .env, tests)", np: ".dockerignore comprehensive add गर्नुहोस्", jp: "包括的な .dockerignore を追加する（node_modules・.git・.env・tests）" },
              { en: "Prevents secrets and dev artifacts entering the build context", np: "Secret र dev artifact build context मा जान रोक्छ", jp: "シークレットと開発成果物がビルドコンテキストに入るのを防ぐ" },
            ],
            [
              { en: "4", np: "4", jp: "4" },
              { en: "Run as a non-root user (USER appuser after RUN adduser)", np: "Non-root user मा run गर्नुहोस्", jp: "非 root ユーザーとして実行する（RUN adduser の後に USER appuser）" },
              { en: "Container escape bug cannot get root on the host", np: "Container escape bug ले host मा root पाउन सक्दैन", jp: "コンテナエスケープのバグがホストで root を取得できない" },
            ],
            [
              { en: "5", np: "5", jp: "5" },
              { en: "Use exec form for CMD/ENTRYPOINT ([\"node\", \"server.js\"])", np: "CMD/ENTRYPOINT को लागि exec form प्रयोग", jp: "CMD/ENTRYPOINT に exec 形式を使用する" },
              { en: "PID 1 receives OS signals (SIGTERM) correctly for graceful shutdown", np: "PID 1 ले graceful shutdown को लागि OS signal (SIGTERM) correctly receive", jp: "PID 1 がグレースフルシャットダウンのために OS シグナル（SIGTERM）を正しく受け取る" },
            ],
            [
              { en: "6", np: "6", jp: "6" },
              { en: "Chain RUN commands with && and clean caches in the same layer", np: "RUN command && नाल chain र same layer मा cache clean", jp: "RUN コマンドを && でチェーンし同じレイヤーでキャッシュをクリーンする" },
              { en: "Prevents leftover apt/yum cache from inflating image size", np: "Leftover apt/yum cache ले image size inflate गर्न रोक्छ", jp: "残留した apt/yum キャッシュによるイメージサイズの肥大化を防ぐ" },
            ],
            [
              { en: "7", np: "7", jp: "7" },
              { en: "Never put secrets in ENV or ARG (visible via docker inspect / image layers)", np: "ENV वा ARG मा secret नराख्नुहोस्", jp: "ENV または ARG にシークレットを入れない（docker inspect/イメージレイヤー経由で見える）" },
              { en: "Secrets in layers are permanent; use BuildKit secret mounts or runtime injection", np: "Layer मा secret permanent; BuildKit secret mount वा runtime injection प्रयोग", jp: "レイヤーのシークレットは永続的；BuildKit シークレットマウントまたはランタイム注入を使用する" },
            ],
            [
              { en: "8", np: "8", jp: "8" },
              { en: "Copy package manifests before source code to maximise layer cache", np: "Layer cache maximise गर्न source code अगाडि package manifest copy", jp: "レイヤーキャッシュを最大化するためにソースコードの前にパッケージマニフェストをコピーする" },
              { en: "npm install/pip install only re-runs when dependencies change", np: "npm install/pip install dependency change हुँदा मात्र re-run", jp: "npm install/pip install は依存関係が変更された場合のみ再実行される" },
            ],
            [
              { en: "9", np: "9", jp: "9" },
              { en: "Add a HEALTHCHECK for orchestrator readiness detection", np: "Orchestrator readiness detection को लागि HEALTHCHECK add", jp: "オーケストレータの準備完了検出のために HEALTHCHECK を追加する" },
              { en: "Kubernetes and ECS use this to know when the container can receive traffic", np: "Kubernetes र ECS ले container traffic receive गर्न तयार छ थाहा पाउन प्रयोग", jp: "Kubernetes と ECS はコンテナがトラフィックを受け取れる状態かを知るためにこれを使用する" },
            ],
            [
              { en: "10", np: "10", jp: "10" },
              { en: "Use a minimal base image (alpine, distroless, scratch)", np: "Minimal base image प्रयोग (alpine, distroless, scratch)", jp: "最小限のベースイメージを使用する（alpine・distroless・scratch）" },
              { en: "Fewer packages = fewer CVEs = smaller attack surface", np: "कम package = कम CVE = smaller attack surface", jp: "パッケージが少ない = CVE が少ない = 攻撃対象が小さい" },
            ],
            [
              { en: "11", np: "11", jp: "11" },
              { en: "Scan every image build in CI with Trivy (`--exit-code 1 --severity CRITICAL`)", np: "CI मा Trivy नाल हरेक image build scan", jp: "CI で Trivy を使用してすべてのイメージビルドをスキャンする" },
              { en: "Catches known CVEs before they reach production", np: "Production पुग्नुअघि known CVE catch", jp: "既知の CVE が本番に到達する前に検出する" },
            ],
            [
              { en: "12", np: "12", jp: "12" },
              { en: "Use LABEL to add metadata (maintainer, version, git-sha, build-date)", np: "Metadata add गर्न LABEL प्रयोग (maintainer, version, git-sha, build-date)", jp: "メタデータを追加するために LABEL を使用する（maintainer・version・git-sha・ビルド日時）" },
              { en: "Essential for image provenance tracking and automated clean-up policies", np: "Image provenance tracking र automated clean-up policy को लागि essential", jp: "イメージの出所追跡と自動クリーンアップポリシーに不可欠" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why is tagging images with `:latest` considered an anti-pattern in production?",
        np: "Production मा image लाई `:latest` नाल tag गर्नु anti-pattern किन मानिन्छ?",
        jp: "本番環境でイメージに `:latest` タグを付けることがアンチパターンとされる理由は？",
      },
      answer: {
        en: "`:latest` is a mutable pointer — it changes every time you push a new image without specifying a tag. This causes three problems: (1) you cannot roll back to a specific version because `:latest` no longer points to what was deployed; (2) different hosts in your cluster may pull different image versions if the push happened between their pulls; (3) no audit trail — you cannot tell from `:latest` what code or Dockerfile commit produced the running container. Always use an immutable tag (semver, git SHA, or both) for production deployments. Using `:latest` for base images in FROM is equally dangerous — pin to a specific digest for reproducible builds.",
        np: "`:latest` एउटा mutable pointer हो — tag specify नगरी नयाँ image push गर्दा हरेक पटक change हुन्छ। यसले तीन problem create गर्छ: (1) specific version मा roll back गर्न सकिँदैन किनभने `:latest` deploy भएको ठाउँमा अब point गर्दैन; (2) push दुई pull बीच भयो भने cluster मा different host ले different image version pull गर्न सक्छ; (3) कुनै audit trail छैन — `:latest` बाट running container कुन code वा Dockerfile commit ले produce गर्यो थाहा पाउन सकिँदैन। Production deployment को लागि हमेशा immutable tag (semver, git SHA, वा दुवै) प्रयोग गर्नुहोस्।",
        jp: "`:latest` は可変ポインターです — タグを指定せずに新しいイメージをプッシュするたびに変わります。これにより 3 つの問題が発生します：(1) `:latest` がデプロイされたものを指さなくなるため、特定のバージョンにロールバックできない；(2) プッシュがプルの間に行われた場合、クラスター内の異なるホストが異なるイメージバージョンをプルする可能性がある；(3) 監査証跡なし — `:latest` からは実行中のコンテナがどのコードや Dockerfile コミットから生成されたかわからない。本番デプロイには常に不変のタグ（semver・git SHA・またはその両方）を使用してください。",
      },
      tag: { en: "tagging", np: "Tagging", jp: "タグ付け" },
    },
    {
      question: {
        en: "What is the difference between image scanning and runtime security?",
        np: "Image scanning र runtime security बीच के फरक छ?",
        jp: "イメージスキャンとランタイムセキュリティの違いは何か？",
      },
      answer: {
        en: "Image scanning (Trivy, Snyk, ECR Enhanced) is static analysis — it checks the packages and binaries in the image against known CVE databases before the container runs. Runtime security (Falco, AWS GuardDuty for ECS) monitors what the running container actually does — system calls it makes, files it opens, network connections it establishes. You need both: scanning stops known-bad packages from entering production; runtime security catches zero-days, misconfigurations, and attackers who have already compromised a container.",
        np: "Image scanning (Trivy, Snyk, ECR Enhanced) static analysis हो — container run हुनुअघि known CVE database विरुद्ध image मा package र binary check गर्छ। Runtime security (Falco, AWS GuardDuty for ECS) ले running container ले actually के गर्छ monitor गर्छ — system call, file open, network connection। दुवै चाहिन्छ: scanning ले known-bad package लाई production मा enter गर्नबाट रोक्छ; runtime security ले zero-day, misconfiguration, र पहिल्यै container compromise गरिसकेका attacker catch गर्छ।",
        jp: "イメージスキャン（Trivy・Snyk・ECR Enhanced）は静的解析です — コンテナが実行される前にイメージ内のパッケージとバイナリを既知の CVE データベースと照合します。ランタイムセキュリティ（Falco・AWS GuardDuty for ECS）は実行中のコンテナが実際に何をするかを監視します — 発行するシステムコール・開くファイル・確立するネットワーク接続。両方が必要です：スキャンは既知の不良パッケージが本番に入るのを防ぎ；ランタイムセキュリティはゼロデイ・設定ミス・すでにコンテナを侵害した攻撃者を検出します。",
      },
      tag: { en: "security", np: "Security", jp: "セキュリティ" },
    },
  ],
};
