import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Running containers one by one with `docker run` stops being practical the moment you need more than two services together. Docker Compose solves this by letting you describe your entire application — services, networks, volumes, environment variables, health checks, and dependencies — in a single YAML file, then spin it all up with one command. Docker Compose is the de-facto standard for local development environments and small-to-medium production deployments.",
    np: "एक-एक गरेर `docker run` नाल container run गर्नु दुईभन्दा बढी service एकसाथ चाहिने बित्तिकै practical रहँदैन। Docker Compose ले यो solve गर्छ — तपाईंको पूरा application लाई single YAML file मा describe गर्न दिन्छ — service, network, volume, environment variable, health check, र dependency — त्यसपछि एक command नाल सबै spin up गर्न। Docker Compose local development environment र small-to-medium production deployment को लागि de-facto standard हो।",
    jp: "`docker run` でコンテナを 1 つずつ実行することは、2 つ以上のサービスが必要になった途端に現実的ではなくなります。Docker Compose はこれを解決します — アプリケーション全体（サービス・ネットワーク・ボリューム・環境変数・ヘルスチェック・依存関係）を単一の YAML ファイルで記述し、1 つのコマンドですべてを起動できます。Docker Compose はローカル開発環境と中小規模の本番デプロイの事実上の標準です。",
  } as const,
  o2: {
    en: "Today you master the Compose file format (v2 long syntax), every top-level key, and the most important service options. You will build a realistic four-service stack (nginx reverse proxy + Node.js API + PostgreSQL + Redis) with health-check gates, named networks, volume persistence, environment override files, and a `make` shortcut workflow.",
    np: "आज तपाईंले Compose file format (v2 long syntax), प्रत्येक top-level key, र सबैभन्दा important service option master गर्नुहुनेछ। तपाईंले health-check gate, named network, volume persistence, environment override file, र `make` shortcut workflow नाल realistic four-service stack (nginx reverse proxy + Node.js API + PostgreSQL + Redis) build गर्नुहुनेछ।",
    jp: "今日は Compose ファイル形式（v2 ロング構文）・すべてのトップレベルキー・最も重要なサービスオプションをマスターします。ヘルスチェックゲート・名前付きネットワーク・ボリューム永続化・環境オーバーライドファイル・`make` ショートカットワークフローを備えたリアルな 4 サービススタック（nginx リバースプロキシ + Node.js API + PostgreSQL + Redis）を構築します。",
  } as const,
};

export const DEVOPS_DAY_48_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Compose file structure — every top-level key",
        np: "Compose file structure — प्रत्येक top-level key",
        jp: "Compose ファイル構造 — すべてのトップレベルキー",
      },
      blocks: [
        { type: "diagram", id: "devops-docker-compose" },
        {
          type: "table",
          caption: {
            en: "Docker Compose file top-level sections and their purpose",
            np: "Docker Compose file top-level section र तिनीहरूको purpose",
            jp: "Docker Compose ファイルのトップレベルセクションとその目的",
          },
          headers: [
            { en: "Section", np: "Section", jp: "セクション" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Key options", np: "Key option", jp: "主なオプション" },
          ],
          rows: [
            [
              { en: "services", np: "services", jp: "services" },
              { en: "Defines each container — the heart of the Compose file", np: "प्रत्येक container define गर्छ — Compose file को heart", jp: "各コンテナを定義する — Compose ファイルの中心" },
              { en: "image, build, ports, volumes, env_file, depends_on, healthcheck, restart, deploy", np: "image, build, ports, volumes, env_file, depends_on, healthcheck, restart, deploy", jp: "image・build・ports・volumes・env_file・depends_on・healthcheck・restart・deploy" },
            ],
            [
              { en: "networks", np: "networks", jp: "networks" },
              { en: "Named networks shared between services; default driver is bridge", np: "Service बीच shared named network; default driver bridge", jp: "サービス間で共有される名前付きネットワーク；デフォルトドライバーは bridge" },
              { en: "driver (bridge/overlay), external, ipam (custom CIDR)", np: "driver (bridge/overlay), external, ipam (custom CIDR)", jp: "driver（bridge/overlay）・external・ipam（カスタム CIDR）" },
            ],
            [
              { en: "volumes", np: "volumes", jp: "volumes" },
              { en: "Named volumes for persistent data; referenced in services.volumes", np: "Persistent data को लागि named volume; services.volumes मा referenced", jp: "永続データのための名前付きボリューム；services.volumes で参照" },
              { en: "driver (local/nfs/ebs), driver_opts, external", np: "driver (local/nfs/ebs), driver_opts, external", jp: "driver（local/nfs/ebs）・driver_opts・external" },
            ],
            [
              { en: "secrets", np: "secrets", jp: "secrets" },
              { en: "Mounts files into /run/secrets/<name> inside containers — safer than env vars", np: "Container भित्र /run/secrets/<name> मा file mount — env var भन्दा safer", jp: "コンテナ内の /run/secrets/<name> にファイルをマウント — 環境変数より安全" },
              { en: "file (local source), external (Swarm secret)", np: "file (local source), external (Swarm secret)", jp: "file（ローカルソース）・external（Swarm シークレット）" },
            ],
            [
              { en: "configs", np: "configs", jp: "configs" },
              { en: "Non-sensitive config files mounted read-only into containers", np: "Non-sensitive config file read-only container मा mount", jp: "機密でない設定ファイルをコンテナ内に読み取り専用でマウント" },
              { en: "file, external, template_driver", np: "file, external, template_driver", jp: "file・external・template_driver" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Four-service production-style stack & essential Compose commands",
        np: "Four-service production-style stack र essential Compose command",
        jp: "4 サービスの本番スタイルスタックと重要な Compose コマンド",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "docker-compose.yml — nginx + Node.js API + PostgreSQL + Redis",
            np: "docker-compose.yml — nginx + Node.js API + PostgreSQL + Redis",
            jp: "docker-compose.yml — nginx + Node.js API + PostgreSQL + Redis",
          },
          code: `# docker-compose.yml
services:

  # ── Reverse proxy ────────────────────────────────────────────
  proxy:
    image: nginx:1.27-alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf:ro
    networks:
      - frontend
    depends_on:
      api:
        condition: service_healthy
    restart: unless-stopped

  # ── Node.js API ───────────────────────────────────────────────
  api:
    build:
      context: .
      target: runtime          # multi-stage build target
    env_file:
      - .env                   # base env
      - .env.local             # local overrides (gitignored)
    environment:
      - NODE_ENV=production
    networks:
      - frontend
      - backend
    depends_on:
      db:
        condition: service_healthy
      cache:
        condition: service_started
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s
    restart: unless-stopped

  # ── PostgreSQL ────────────────────────────────────────────────
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: appdb
      POSTGRES_USER: appuser
      POSTGRES_PASSWORD_FILE: /run/secrets/db_password
    secrets:
      - db_password
    volumes:
      - pgdata:/var/lib/postgresql/data
      - ./db/init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    networks:
      - backend
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U appuser -d appdb"]
      interval: 10s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  # ── Redis cache ───────────────────────────────────────────────
  cache:
    image: redis:7-alpine
    command: redis-server --save 60 1 --loglevel warning
    volumes:
      - redisdata:/data
    networks:
      - backend
    restart: unless-stopped

networks:
  frontend:
  backend:

volumes:
  pgdata:
  redisdata:

secrets:
  db_password:
    file: ./secrets/db_password.txt   # NOT committed to git

# ─── docker-compose.override.yml (dev overrides) ──────────────
# Automatically merged by Compose — add to .gitignore
#
# services:
#   api:
#     build:
#       target: builder         # dev stage with hot-reload
#     volumes:
#       - ./src:/app/src        # live-reload
#     environment:
#       - NODE_ENV=development

# ─── Essential commands ───────────────────────────────────────
# Start everything (build if needed)
docker compose up -d --build

# Tail logs of a specific service
docker compose logs -f api

# Run a one-off command in a service container
docker compose exec db psql -U appuser -d appdb

# Scale a stateless service horizontally
docker compose up -d --scale api=3

# Show running services and their ports
docker compose ps

# Restart a single service (no rebuild)
docker compose restart api

# Rebuild and replace just the api service
docker compose up -d --build --no-deps api

# Stop and remove containers, networks (keep volumes!)
docker compose down

# Stop and also remove named volumes (destructive!)
docker compose down -v`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Build the four-service stack from the example above. Run `docker compose ps` to verify all services are healthy. Use `docker compose logs -f api` to tail the API logs, then hit `http://localhost/health` via curl to confirm nginx is proxying to the API.",
              np: "माथिको example बाट four-service stack build गर्नुहोस्। `docker compose ps` run गर्नुहोस् सबै service healthy छ verify गर्न। API log tail गर्न `docker compose logs -f api` प्रयोग गर्नुहोस्, त्यसपछि nginx ले API मा proxy गरिरहेको confirm गर्न curl नाल `http://localhost/health` hit गर्नुहोस्।",
              jp: "上の例から 4 サービスのスタックをビルドする。`docker compose ps` を実行してすべてのサービスが正常であることを確認する。`docker compose logs -f api` で API ログをテールし、次に curl で `http://localhost/health` にアクセスして nginx が API にプロキシしていることを確認する。",
            },
            {
              en: "Stop the database container with `docker compose stop db`. Watch the API's health check fail and the container restart. Then bring db back up with `docker compose start db` and watch the health check recover. This demonstrates `depends_on: condition: service_healthy` in action.",
              np: "`docker compose stop db` नाल database container stop गर्नुहोस्। API को health check fail भएर container restart हुन हेर्नुहोस्। त्यसपछि `docker compose start db` नाल db फिर्ता ल्याउनुहोस् र health check recover हुन हेर्नुहोस्। यसले `depends_on: condition: service_healthy` को action demonstrate गर्छ।",
              jp: "`docker compose stop db` でデータベースコンテナを停止する。API のヘルスチェックが失敗してコンテナが再起動するのを観察する。次に `docker compose start db` で db を起動してヘルスチェックが回復するのを確認する。これは `depends_on: condition: service_healthy` の動作を示しています。",
            },
            {
              en: "Create a `docker-compose.override.yml` with a volume bind mount for the API source code and `NODE_ENV=development`. Run `docker compose up -d` and confirm the override is merged — editing a source file should hot-reload the running API.",
              np: "API source code volume bind mount र `NODE_ENV=development` नाल `docker-compose.override.yml` create गर्नुहोस्। `docker compose up -d` run गर्नुहोस् र override merged छ confirm गर्नुहोस् — source file edit गर्नाले running API hot-reload हुनुपर्छ।",
              jp: "API ソースコードのボリュームバインドマウントと `NODE_ENV=development` を含む `docker-compose.override.yml` を作成する。`docker compose up -d` を実行してオーバーライドがマージされていることを確認する — ソースファイルを編集すると実行中の API がホットリロードされるはずです。",
            },
            {
              en: "Run `docker compose down -v` to destroy everything including volumes. Then `docker compose up -d` to recreate. Confirm the database is empty — this is the difference between `down` (keeps volumes) and `down -v` (destroys data). Document when you would use each in a production context.",
              np: "`docker compose down -v` run गरी volume सहित सबैकुरा destroy गर्नुहोस्। त्यसपछि recreate गर्न `docker compose up -d`। Database empty छ confirm गर्नुहोस् — `down` (volume राख्छ) र `down -v` (data destroy) बीचको फरक यही हो। Production context मा प्रत्येक कहिले प्रयोग गर्ने document गर्नुहोस्।",
              jp: "`docker compose down -v` を実行してボリュームを含むすべてを破棄する。次に `docker compose up -d` で再作成する。データベースが空であることを確認する — `down`（ボリュームを保持）と `down -v`（データを破棄）の違いがこれです。本番環境のコンテキストでそれぞれをいつ使用するかを文書化する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `depends_on` and a healthcheck condition?",
        np: "`depends_on` र healthcheck condition बीच के फरक छ?",
        jp: "`depends_on` とヘルスチェック条件の違いは何か？",
      },
      answer: {
        en: "`depends_on` without a condition only waits for the container to be started (the process is running). It does NOT wait for the service to be ready. A PostgreSQL container starts in milliseconds but takes several more seconds to accept connections — without a healthcheck condition, your API may crash-loop trying to connect before Postgres is ready. With `condition: service_healthy`, Compose waits until the healthcheck passes before starting the dependent service. Always add healthchecks to database and queue services in any Compose file used in CI or staging.",
        np: "`depends_on` condition बिना container start हुन मात्र कुर्छ (process running छ)। Service ready छ भनेर कुर्दैन। PostgreSQL container millisecond मा start हुन्छ तर connection accept गर्न केही second बढी लाग्छ — healthcheck condition बिना, API ले Postgres ready हुनुअघि connect गर्ने try गरेर crash-loop हुन सक्छ। `condition: service_healthy` नाल, Compose ले dependent service start गर्नुअघि healthcheck pass नभएसम्म कुर्छ। CI वा staging मा प्रयोग हुने Compose file मा database र queue service मा healthcheck हमेशा add गर्नुहोस्।",
        jp: "条件なしの `depends_on` はコンテナが起動されるまで（プロセスが実行中）しか待ちません。サービスが準備完了するまでは待ちません。PostgreSQL コンテナはミリ秒で起動しますが、接続を受け入れるまでさらに数秒かかります — ヘルスチェック条件なしでは、API が Postgres の準備完了前に接続しようとしてクラッシュループする可能性があります。`condition: service_healthy` を使用すると、Compose は依存サービスを起動する前にヘルスチェックが合格するまで待機します。CI やステージングで使用する Compose ファイルのデータベースとキューサービスには常にヘルスチェックを追加してください。",
      },
      tag: { en: "depends_on", np: "depends_on", jp: "depends_on" },
    },
    {
      question: {
        en: "Is Docker Compose suitable for production?",
        np: "Docker Compose production को लागि उपयुक्त छ?",
        jp: "Docker Compose は本番環境に適しているか？",
      },
      answer: {
        en: "Yes, for single-host deployments Compose works well in production — small SaaS apps, internal tools, and hobby projects often run this way. It handles restart policies, named volumes, secrets, and health checks properly. Where it falls short versus Kubernetes/ECS: no automatic horizontal scaling across multiple hosts, no automatic bin-packing of containers onto nodes, no rolling update strategy out of the box, and limited observability integrations. For anything that needs multi-host HA or auto-scaling, move to Kubernetes (Week 9) or a managed orchestrator.",
        np: "हो, single-host deployment को लागि Compose production मा राम्रो काम गर्छ — small SaaS app, internal tool, र hobby project प्रायः यसरी run हुन्छ। Restart policy, named volume, secret, र health check properly handle गर्छ। Kubernetes/ECS भन्दा कम भएको ठाउँ: multiple host across automatic horizontal scaling छैन, node मा container को automatic bin-packing छैन, out of the box rolling update strategy छैन, र limited observability integration। Multi-host HA वा auto-scaling चाहिने कुनैपनि कुराको लागि Kubernetes (Week 9) वा managed orchestrator मा सर्नुहोस्।",
        jp: "はい、単一ホストのデプロイには Compose は本番環境でうまく機能します — 小さな SaaS アプリ・社内ツール・趣味のプロジェクトはよくこの方法で実行されます。再起動ポリシー・名前付きボリューム・シークレット・ヘルスチェックを適切に処理します。Kubernetes/ECS と比べて劣る点：複数のホストにまたがる自動水平スケーリングなし・ノードへのコンテナの自動ビンパッキングなし・すぐに使えるローリングアップデート戦略なし・限られた可観測性統合。マルチホスト HA や自動スケーリングが必要な場合は Kubernetes（Week 9）またはマネージドオーケストレーターに移行してください。",
      },
      tag: { en: "production", np: "Production", jp: "本番環境" },
    },
  ],
};
