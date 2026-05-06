import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A Docker image is a read-only, layered archive that packages your application code with everything it needs — OS base, runtime, libraries, config, and the default command to run. Images are built from a Dockerfile, a plain-text recipe with one instruction per layer. Understanding how layers work — and how to minimize them — directly impacts image size, build cache efficiency, and security surface.",
    np: "Docker image एउटा read-only, layered archive हो जसले तपाईंको application code लाई आवश्यक सबैकुरासहित package गर्छ — OS base, runtime, library, config, र run गर्ने default command। Image ले Dockerfile बाट build हुन्छ, प्रति layer एक instruction भएको plain-text recipe। Layer कसरी काम गर्छ — र तिनीहरूलाई कसरी minimize गर्ने — बुझ्नाले image size, build cache efficiency, र security surface मा directly impact गर्छ।",
    jp: "Docker イメージは、アプリケーションコードを必要なすべてのもの（OS ベース・ランタイム・ライブラリ・設定・実行するデフォルトコマンド）と一緒にパッケージ化した読み取り専用のレイヤードアーカイブです。イメージは Dockerfile（1 つの命令で 1 レイヤーとなるプレーンテキストのレシピ）からビルドされます。レイヤーの仕組み — そしてそれをどう最小化するか — を理解することは、イメージサイズ・ビルドキャッシュの効率・セキュリティサーフェスに直接影響します。",
  } as const,
  o2: {
    en: "Today you learn every Dockerfile instruction and when to use each, how the layer cache works and how to exploit it for fast rebuilds, multi-stage builds to ship tiny production images, and the .dockerignore file to keep secrets and dev artifacts out of the image. You will build a Node.js API image from scratch, apply multi-stage to cut it from ~900 MB to ~120 MB, and push it to Docker Hub.",
    np: "आज तपाईंले प्रत्येक Dockerfile instruction र कहिले प्रयोग गर्ने सिक्नुहुनेछ, layer cache कसरी काम गर्छ र fast rebuild को लागि कसरी exploit गर्ने, production मा tiny image ship गर्न multi-stage build, र image बाट secret र dev artifact बाहिर राख्न .dockerignore file। तपाईंले scratch बाट Node.js API image build गर्नुहुनेछ, multi-stage apply गरेर ~900 MB बाट ~120 MB मा घटाउनुहुनेछ, र Docker Hub मा push गर्नुहुनेछ।",
    jp: "今日はすべての Dockerfile 命令とそれぞれをいつ使うか・レイヤーキャッシュの仕組みと高速なリビルドのための活用方法・小さなプロダクションイメージを出荷するためのマルチステージビルド・シークレットと開発成果物をイメージから除外するための .dockerignore ファイルを学びます。Node.js API イメージをゼロからビルドし、マルチステージを適用して約 900 MB から約 120 MB に削減し、Docker Hub にプッシュします。",
  } as const,
};

export const DEVOPS_DAY_44_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Dockerfile instruction reference",
        np: "Dockerfile instruction reference",
        jp: "Dockerfile 命令リファレンス",
      },
      blocks: [
        { type: "diagram", id: "devops-dockerfile" },
        {
          type: "table",
          caption: {
            en: "Core Dockerfile instructions — purpose, common patterns, and gotchas",
            np: "Core Dockerfile instruction — purpose, common pattern, र gotcha",
            jp: "コア Dockerfile 命令 — 目的・一般的なパターン・落とし穴",
          },
          headers: [
            { en: "Instruction", np: "Instruction", jp: "命令" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Key tip", np: "Key tip", jp: "キーヒント" },
          ],
          rows: [
            [
              { en: "FROM", np: "FROM", jp: "FROM" },
              { en: "Sets the base image; every Dockerfile starts here", np: "Base image set गर्छ; प्रत्येक Dockerfile यहाँबाट सुरु", jp: "ベースイメージを設定；すべての Dockerfile はここから始まる" },
              { en: "Prefer slim/alpine variants; pin to a digest for reproducibility", np: "slim/alpine variant prefer गर्नुहोस्; reproducibility को लागि digest pin गर्नुहोस्", jp: "slim/alpine バリアントを優先；再現性のためにダイジェストをピンする" },
            ],
            [
              { en: "RUN", np: "RUN", jp: "RUN" },
              { en: "Executes a shell command and commits the result as a new layer", np: "Shell command execute गर्छ र result लाई new layer मा commit गर्छ", jp: "シェルコマンドを実行して結果を新しいレイヤーとしてコミットする" },
              { en: "Chain with && to avoid layer bloat; clean apt/yum caches in the same RUN", np: "&& नाल chain गर्नुहोस् layer bloat avoid गर्न; same RUN मा apt/yum cache clean गर्नुहोस्", jp: "&& でチェーンしてレイヤーの肥大化を避ける；同じ RUN で apt/yum キャッシュをクリーンする" },
            ],
            [
              { en: "COPY / ADD", np: "COPY / ADD", jp: "COPY / ADD" },
              { en: "COPY brings files from build context; ADD can also unpack tarballs and fetch URLs", np: "COPY ले build context बाट file ल्याउँछ; ADD ले tarball unpack र URL fetch पनि गर्न सक्छ", jp: "COPY はビルドコンテキストからファイルを持ち込む；ADD は tarball の展開と URL 取得もできる" },
              { en: "Prefer COPY — ADD's URL fetch is a surprise layer that bypasses the cache wisely", np: "COPY prefer गर्नुहोस् — ADD को URL fetch cache bypass गर्ने unexpected layer हो", jp: "COPY を優先する — ADD の URL 取得はキャッシュをバイパスする予期しないレイヤーになる" },
            ],
            [
              { en: "ENV / ARG", np: "ENV / ARG", jp: "ENV / ARG" },
              { en: "ENV sets environment variables baked into the image; ARG is build-time only and not in the final image", np: "ENV ले image मा bake गरिएका environment variable set गर्छ; ARG build-time मात्र र final image मा छैन", jp: "ENV はイメージに焼き込まれた環境変数を設定；ARG はビルド時のみで最終イメージには含まれない" },
              { en: "Never put secrets in ENV (visible via docker inspect); use secrets mounts or runtime injection", np: "ENV मा secret नराख्नुहोस् (docker inspect मार्फत visible); secrets mount वा runtime injection प्रयोग गर्नुहोस्", jp: "ENV にシークレットを入れない（docker inspect で見える）；シークレットマウントまたはランタイムインジェクションを使用する" },
            ],
            [
              { en: "WORKDIR", np: "WORKDIR", jp: "WORKDIR" },
              { en: "Sets the working directory for subsequent RUN / COPY / CMD / ENTRYPOINT", np: "Subsequent RUN / COPY / CMD / ENTRYPOINT को लागि working directory set गर्छ", jp: "以降の RUN / COPY / CMD / ENTRYPOINT の作業ディレクトリを設定する" },
              { en: "Use absolute paths; WORKDIR creates the directory if it does not exist", np: "Absolute path प्रयोग गर्नुहोस्; WORKDIR ले directory exist नभएमा create गर्छ", jp: "絶対パスを使用する；WORKDIR はディレクトリが存在しない場合は作成する" },
            ],
            [
              { en: "CMD / ENTRYPOINT", np: "CMD / ENTRYPOINT", jp: "CMD / ENTRYPOINT" },
              { en: "ENTRYPOINT is the fixed executable; CMD provides default arguments (overridable at run-time)", np: "ENTRYPOINT fixed executable हो; CMD ले default argument provide गर्छ (run-time मा override गर्न सकिन्छ)", jp: "ENTRYPOINT は固定の実行可能ファイル；CMD はデフォルト引数を提供する（実行時に上書き可能）" },
              { en: "Use exec form ([\"node\",\"server.js\"]) not shell form to avoid a shell wrapper process receiving signals", np: "Shell wrapper process ले signal receive नगर्न shell form भन्दा exec form ([\"node\",\"server.js\"]) प्रयोग गर्नुहोस्", jp: "シグナルを受け取るシェルラッパープロセスを避けるためシェル形式ではなく exec 形式（[\"node\",\"server.js\"]）を使用する" },
            ],
            [
              { en: "USER", np: "USER", jp: "USER" },
              { en: "Switches the running user for all subsequent instructions and the container process", np: "Subsequent instruction र container process को लागि running user switch गर्छ", jp: "以降のすべての命令とコンテナプロセスの実行ユーザーを切り替える" },
              { en: "Always drop root before CMD/ENTRYPOINT — running as UID 0 inside the container is a security risk", np: "CMD/ENTRYPOINT अघि root drop गर्नुहोस् — container भित्र UID 0 मा run गर्नु security risk हो", jp: "CMD/ENTRYPOINT の前に常に root を降りる — コンテナ内で UID 0 として実行することはセキュリティリスク" },
            ],
            [
              { en: "EXPOSE", np: "EXPOSE", jp: "EXPOSE" },
              { en: "Documents which ports the container listens on (does not actually publish them)", np: "Container ले कुन port सुन्छ document गर्छ (actually publish गर्दैन)", jp: "コンテナがリッスンするポートを文書化する（実際には公開しない）" },
              { en: "Use for documentation and docker-compose tooling; actual publishing is `-p` at run-time", np: "Documentation र docker-compose tooling को लागि प्रयोग गर्नुहोस्; actual publishing run-time मा `-p` हो", jp: "ドキュメントと docker-compose ツールのために使用する；実際の公開は実行時の `-p`" },
            ],
            [
              { en: "HEALTHCHECK", np: "HEALTHCHECK", jp: "HEALTHCHECK" },
              { en: "Tells Docker how to test whether the container is healthy", np: "Container healthy छ कि भनेर कसरी test गर्ने Docker लाई बताउँछ", jp: "コンテナが正常かどうかをテストする方法を Docker に伝える" },
              { en: "Critical for orchestrators (Kubernetes, ECS) — without it they assume the container is always healthy", np: "Orchestrator (Kubernetes, ECS) को लागि critical — बिना यसको तिनीहरूले container हमेशा healthy मान्छन्", jp: "オーケストレータ（Kubernetes・ECS）にとって重要 — これがないと常に正常と見なされる" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Multi-stage builds — slim production images",
        np: "Multi-stage build — slim production image",
        jp: "マルチステージビルド — スリムなプロダクションイメージ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A multi-stage Dockerfile has multiple FROM instructions. Each stage is a temporary build environment. You COPY artefacts from an earlier stage into a final minimal stage. The result: the shipped image contains only the runtime binary — not the compiler, build tools, test frameworks, or source code. A Go binary that needs a 800 MB builder image can ship in a 10 MB scratch image.",
            np: "Multi-stage Dockerfile मा multiple FROM instruction हुन्छ। प्रत्येक stage एउटा temporary build environment हो। तपाईं earlier stage बाट final minimal stage मा artefact COPY गर्नुहुन्छ। परिणाम: shipped image मा runtime binary मात्र हुन्छ — compiler, build tool, test framework, वा source code होइन। 800 MB builder image चाहिने Go binary लाई 10 MB scratch image मा ship गर्न सकिन्छ।",
            jp: "マルチステージ Dockerfile には複数の FROM 命令があります。各ステージは一時的なビルド環境です。前のステージからアーティファクトを最終的な最小限のステージに COPY します。結果：出荷されるイメージにはランタイムバイナリのみが含まれ、コンパイラ・ビルドツール・テストフレームワーク・ソースコードは含まれません。800 MB のビルダーイメージを必要とする Go バイナリを 10 MB の scratch イメージで出荷できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Multi-stage Node.js API Dockerfile + .dockerignore",
            np: "Multi-stage Node.js API Dockerfile + .dockerignore",
            jp: "マルチステージ Node.js API Dockerfile + .dockerignore",
          },
          code: `# ─── .dockerignore ───────────────────────────────────────────
node_modules
.git
.env
.env.*
dist
coverage
*.log
*.md
Dockerfile*

# ─── Dockerfile ──────────────────────────────────────────────

# ── Stage 1: install + build ──────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy manifests first — layer is cached until package.json changes
COPY package*.json ./
RUN npm ci --frozen-lockfile

# Copy source and compile TypeScript → /app/dist
COPY tsconfig.json ./
COPY src ./src
RUN npm run build

# ── Stage 2: production runtime ───────────────────────────────
FROM node:20-alpine AS runtime

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copy only the compiled output + prod deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
RUN npm ci --frozen-lockfile --omit=dev && npm cache clean --force

# Drop root before launch
USER appuser

EXPOSE 3000

# Exec form — PID 1 receives signals correctly (no shell wrapper)
ENTRYPOINT ["node"]
CMD ["dist/server.js"]

# Healthcheck — orchestrators use this to decide readiness
HEALTHCHECK --interval=30s --timeout=5s --retries=3 \\
  CMD wget -qO- http://localhost:3000/health || exit 1

# ─── Build & push ────────────────────────────────────────────
# docker build -t myuser/node-api:1.0.0 .
# docker images myuser/node-api   # compare to single-stage size

# Check image layers
# docker history myuser/node-api:1.0.0

# Run locally
# docker run -d -p 3000:3000 --name api myuser/node-api:1.0.0
# curl http://localhost:3000/health

# Push to Docker Hub
# docker login
# docker push myuser/node-api:1.0.0

# Scan for known CVEs (Trivy)
# trivy image myuser/node-api:1.0.0`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Build the single-stage version of your API image and record its size with `docker images`. Then apply the multi-stage version and compare. The difference should be 80–95% smaller.",
              np: "Single-stage version को API image build गर्नुहोस् र `docker images` नाल size record गर्नुहोस्। त्यसपछि multi-stage version apply गरेर compare गर्नुहोस्। Difference 80–95% smaller हुनुपर्छ।",
              jp: "API イメージの単一ステージバージョンをビルドして `docker images` でサイズを記録する。次にマルチステージバージョンを適用して比較する。差は 80〜95% 小さくなるはずです。",
            },
            {
              en: "Add a secret during build using BuildKit: `RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc`. Build with `docker build --secret id=npmrc,src=.npmrc .` and verify the secret is not present in the final image layers using `docker history`.",
              np: "BuildKit प्रयोग गरी build time मा secret add गर्नुहोस्: `RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc`। `docker build --secret id=npmrc,src=.npmrc .` नाल build गर्नुहोस् र `docker history` प्रयोग गरी final image layer मा secret present छैन verify गर्नुहोस्।",
              jp: "BuildKit を使用してビルド時にシークレットを追加する：`RUN --mount=type=secret,id=npmrc cat /run/secrets/npmrc`。`docker build --secret id=npmrc,src=.npmrc .` でビルドして `docker history` を使用してシークレットが最終イメージレイヤーに存在しないことを確認する。",
            },
            {
              en: "Add a HEALTHCHECK to your Dockerfile and run the container. Use `docker inspect --format='{{.State.Health.Status}}' <name>` every 10 seconds to watch it transition from `starting` to `healthy`.",
              np: "तपाईंको Dockerfile मा HEALTHCHECK add गर्नुहोस् र container run गर्नुहोस्। `starting` बाट `healthy` मा transition हेर्न हरेक 10 second मा `docker inspect --format='{{.State.Health.Status}}' <name>` प्रयोग गर्नुहोस्।",
              jp: "Dockerfile に HEALTHCHECK を追加してコンテナを実行する。`starting` から `healthy` への移行を見るために `docker inspect --format='{{.State.Health.Status}}' <name>` を 10 秒ごとに実行する。",
            },
            {
              en: "Run `docker build --no-cache .` then `docker build .` a second time (no source changes). Observe the build output — all layers should be CACHED on the second run. Then change one source file and rebuild to see only the affected layers re-run.",
              np: "`docker build --no-cache .` run गर्नुहोस् त्यसपछि `docker build .` दोस्रो पटक (कुनै source change नगरी)। Build output observe गर्नुहोस् — second run मा सबै layer CACHED हुनुपर्छ। त्यसपछि एउटा source file change गरेर rebuild गर्नुहोस् affected layer मात्र re-run हुने हेर्न।",
              jp: "`docker build --no-cache .` を実行してから `docker build .` を 2 回目（ソース変更なし）実行する。ビルド出力を観察する — 2 回目はすべてのレイヤーがキャッシュされるはず。次にソースファイルを 1 つ変更して再ビルドし、影響を受けたレイヤーのみが再実行されることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between CMD and ENTRYPOINT?",
        np: "CMD र ENTRYPOINT बीच के फरक छ?",
        jp: "CMD と ENTRYPOINT の違いは何か？",
      },
      answer: {
        en: "ENTRYPOINT defines the executable — it cannot be overridden by `docker run` arguments (only by `--entrypoint`). CMD provides default arguments to ENTRYPOINT (or the full command if ENTRYPOINT is not set). Pattern: ENTRYPOINT [\"node\"] + CMD [\"server.js\"] lets you do `docker run myimage worker.js` to override just the script. Both should use exec form (JSON array) not shell form to ensure PID 1 receives OS signals properly.",
        np: "ENTRYPOINT ले executable define गर्छ — `docker run` argument ले override गर्न सकिँदैन (`--entrypoint` मात्र)। CMD ले ENTRYPOINT लाई default argument provide गर्छ (वा ENTRYPOINT set नभएमा full command)। Pattern: ENTRYPOINT [\"node\"] + CMD [\"server.js\"] ले तपाईंलाई `docker run myimage worker.js` गरेर script मात्र override गर्न दिन्छ। OS signal properly receive गर्न दुवैले shell form भन्दा exec form (JSON array) प्रयोग गर्नुपर्छ।",
        jp: "ENTRYPOINT は実行可能ファイルを定義します — `docker run` の引数では上書きできません（`--entrypoint` のみ）。CMD は ENTRYPOINT のデフォルト引数を提供します（ENTRYPOINT が設定されていない場合は完全なコマンド）。パターン：ENTRYPOINT [\"node\"] + CMD [\"server.js\"] とすると `docker run myimage worker.js` でスクリプトだけを上書きできます。PID 1 が OS シグナルを正しく受け取るために、両方ともシェル形式ではなく exec 形式（JSON 配列）を使用してください。",
      },
      tag: { en: "Dockerfile", np: "Dockerfile", jp: "Dockerfile" },
    },
    {
      question: {
        en: "Why does changing a line early in the Dockerfile invalidate all later layers?",
        np: "Dockerfile को early line change गर्दा किन पछिका सबै layer invalidate हुन्छ?",
        jp: "Dockerfile の早い段階の行を変更するとなぜ後続のすべてのレイヤーが無効になるのか？",
      },
      answer: {
        en: "Docker builds images by executing each instruction sequentially and hashing the result. If a hash changes, all layers below it must be rebuilt because they may depend on the new state. This is why you copy dependency manifests (package.json) before source code — they change less often, keeping the expensive `npm install` layer cached while code changes only invalidate the COPY source layers.",
        np: "Docker ले प्रत्येक instruction sequentially execute गरेर result hash गरेर image build गर्छ। Hash change भयो भने तल्का सबै layer rebuild गर्नुपर्छ किनभने तिनीहरू new state मा depend गरेका हुन सक्छन्। यसैले dependency manifest (package.json) source code अगाडि copy गर्नुहुन्छ — तिनीहरू कम change हुन्छन्, महंगो `npm install` layer cached राख्छन् जबकि code change ले COPY source layer मात्र invalidate गर्छ।",
        jp: "Docker は各命令を順番に実行して結果をハッシュ化することでイメージをビルドします。ハッシュが変わると、その下のすべてのレイヤーは新しい状態に依存している可能性があるため再ビルドが必要です。これが依存関係マニフェスト（package.json）をソースコードの前にコピーする理由です — それらの変更頻度は低く、高コストな `npm install` レイヤーをキャッシュしたまま、コードの変更は COPY ソースレイヤーのみを無効化します。",
      },
      tag: { en: "layer cache", np: "Layer cache", jp: "レイヤーキャッシュ" },
    },
  ],
};
