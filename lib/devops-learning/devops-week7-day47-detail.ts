import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Containers are ephemeral by design — when a container is removed, its writable layer disappears with it. For anything that must outlive a container (database files, uploaded assets, configuration, logs), you need persistent storage. Docker offers three mechanisms: named volumes (Docker-managed, portable), bind mounts (host-path mapped directly), and tmpfs mounts (RAM-only, never touches disk). Choosing the right one for each use case is a critical production skill.",
    np: "Container design अनुसार ephemeral हुन्छ — container remove हुँदा यसको writable layer पनि सँगै जान्छ। Container को बाँचिरहनुपर्ने कुनैपनि कुराको लागि (database file, uploaded asset, configuration, log), persistent storage चाहिन्छ। Docker ले तीन mechanism offer गर्छ: named volume (Docker-managed, portable), bind mount (host-path directly mapped), र tmpfs mount (RAM-only, disk छुँदैन)। प्रत्येक use case को लागि सही छनोट गर्नु critical production skill हो।",
    jp: "コンテナは設計上エフェメラル（一時的）です — コンテナを削除すると、その書き込み可能なレイヤーも消えます。コンテナよりも長く存続する必要があるもの（データベースファイル・アップロードされたアセット・設定・ログ）には永続ストレージが必要です。Docker は 3 つのメカニズムを提供します：名前付きボリューム（Docker 管理・移植可能）・バインドマウント（ホストパスを直接マップ）・tmpfs マウント（RAM のみ・ディスクに触れない）。各ユースケースに適したものを選ぶことは重要な本番スキルです。",
  } as const,
  o2: {
    en: "Today you master the full Docker volumes API — create, inspect, list, mount, back up, restore, and prune. You will also learn how multiple containers share a volume (init-container pattern, sidecar log collectors), and how volume drivers extend Docker storage to NFS shares and cloud-managed filesystems like AWS EFS.",
    np: "आज तपाईंले full Docker volumes API master गर्नुहुनेछ — create, inspect, list, mount, back up, restore, र prune। तपाईंले multiple container ले volume share गर्ने (init-container pattern, sidecar log collector), र volume driver ले Docker storage लाई NFS share र AWS EFS जस्तो cloud-managed filesystem सम्म extend गर्ने पनि सिक्नुहुनेछ।",
    jp: "今日は Docker ボリューム API の全体をマスターします — 作成・検査・一覧・マウント・バックアップ・リストア・プルーン。また、複数のコンテナがボリュームを共有する方法（init-container パターン・サイドカーログコレクター）と、ボリュームドライバーが Docker ストレージを NFS 共有や AWS EFS などのクラウドマネージドファイルシステムに拡張する方法も学びます。",
  } as const,
};

export const DEVOPS_DAY_47_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Three Docker storage types — comparison & when to use each",
        np: "तीन Docker storage type — comparison र कहिले प्रयोग गर्ने",
        jp: "3 つの Docker ストレージタイプ — 比較とそれぞれの使用タイミング",
      },
      blocks: [
        { type: "diagram", id: "devops-docker-volumes" },
        {
          type: "table",
          caption: {
            en: "Named volume vs bind mount vs tmpfs — storage location, lifecycle, and best use",
            np: "Named volume vs bind mount vs tmpfs — storage location, lifecycle, र best use",
            jp: "名前付きボリューム vs バインドマウント vs tmpfs — ストレージの場所・ライフサイクル・最適な用途",
          },
          headers: [
            { en: "Type", np: "Type", jp: "タイプ" },
            { en: "Storage location", np: "Storage location", jp: "ストレージの場所" },
            { en: "Lifecycle", np: "Lifecycle", jp: "ライフサイクル" },
            { en: "Docker manages", np: "Docker manages", jp: "Docker が管理" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "Named volume", np: "Named volume", jp: "名前付きボリューム" },
              { en: "/var/lib/docker/volumes/<name>/_data", np: "/var/lib/docker/volumes/<name>/_data", jp: "/var/lib/docker/volumes/<name>/_data" },
              { en: "Survives container removal; deleted only via docker volume rm", np: "Container removal survive; docker volume rm मार्फत मात्र delete", jp: "コンテナ削除後も存続；docker volume rm でのみ削除" },
              { en: "Yes — path, permissions, drivers", np: "Yes — path, permission, driver", jp: "はい — パス・パーミッション・ドライバー" },
              { en: "Databases, stateful services in production", np: "Database, production मा stateful service", jp: "データベース・本番のステートフルサービス" },
            ],
            [
              { en: "Bind mount", np: "Bind mount", jp: "バインドマウント" },
              { en: "Any absolute host path (e.g. /home/user/app)", np: "कुनै पनि absolute host path (e.g. /home/user/app)", jp: "任意の絶対ホストパス（例：/home/user/app）" },
              { en: "Lives as long as the host directory exists; Docker does not control it", np: "Host directory exist गर्सम्म; Docker ले control गर्दैन", jp: "ホストディレクトリが存在する限り存続；Docker は制御しない" },
              { en: "No — host owns the path", np: "No — host ले path own गर्छ", jp: "いいえ — ホストがパスを所有する" },
              { en: "Development live-reload; config injection from host", np: "Development live-reload; host बाट config injection", jp: "開発のライブリロード；ホストからの設定注入" },
            ],
            [
              { en: "tmpfs mount", np: "tmpfs mount", jp: "tmpfs マウント" },
              { en: "Host RAM only — never written to disk", np: "Host RAM मात्र — disk मा कहिल्यै write हुँदैन", jp: "ホスト RAM のみ — ディスクには書き込まれない" },
              { en: "Exists only while container is running; lost on stop/restart", np: "Container run हुँदा मात्र; stop/restart मा lost", jp: "コンテナの実行中のみ存在；停止/再起動で消滅" },
              { en: "Yes — RAM allocation", np: "Yes — RAM allocation", jp: "はい — RAM 割り当て" },
              { en: "Secrets, session tokens, tmp processing — sensitive data that must never hit disk", np: "Secret, session token, tmp processing — disk मा हुनुहुँदैन sensitive data", jp: "シークレット・セッショントークン・一時処理 — ディスクに触れてはいけない機密データ" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Volume commands, backup/restore & multi-container sharing",
        np: "Volume command, backup/restore र multi-container sharing",
        jp: "ボリュームコマンド・バックアップ/リストア・マルチコンテナ共有",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Volume lifecycle, backup/restore, and shared volumes",
            np: "Volume lifecycle, backup/restore, र shared volume",
            jp: "ボリュームのライフサイクル・バックアップ/リストア・共有ボリューム",
          },
          code: `# ── Create and inspect a named volume ──
docker volume create pgdata
docker volume ls
docker volume inspect pgdata
# Shows Mountpoint: /var/lib/docker/volumes/pgdata/_data

# ── Use a named volume with PostgreSQL ──
docker run -d \\
  --name db \\
  -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret \\
  postgres:16-alpine

# Connect, create a table
docker exec -it db psql -U postgres -c "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT);"
docker exec -it db psql -U postgres -c "INSERT INTO users (name) VALUES ('alice');"

# Stop and remove the container — the volume survives
docker stop db && docker rm db

# Recreate — data is still there
docker run -d --name db -v pgdata:/var/lib/postgresql/data -e POSTGRES_PASSWORD=secret postgres:16-alpine
docker exec db psql -U postgres -c "SELECT * FROM users;"   # alice is still there!

# ── Backup a named volume ──
# Spin up a helper container that mounts the volume and tars it to stdout
docker run --rm \\
  -v pgdata:/data:ro \\
  -v "$(pwd)/backups":/backups \\
  alpine:3.19 \\
  tar czf /backups/pgdata-$(date +%Y%m%d).tar.gz -C /data .

# ── Restore a volume from backup ──
docker volume create pgdata-restore
docker run --rm \\
  -v pgdata-restore:/data \\
  -v "$(pwd)/backups":/backups:ro \\
  alpine:3.19 \\
  tar xzf /backups/pgdata-20240101.tar.gz -C /data

# ── Shared volume: init-container pattern ──
# init container writes config; app container reads it
docker volume create shared-config

docker run --rm \\
  -v shared-config:/config \\
  alpine:3.19 \\
  sh -c 'echo "DB_HOST=db" > /config/app.env && echo "LOG_LEVEL=info" >> /config/app.env'

docker run -d \\
  --name app \\
  -v shared-config:/etc/app:ro \\
  myapp:latest

# ── tmpfs mount — sensitive data never hits disk ──
docker run -d \\
  --name secure-app \\
  --tmpfs /run/secrets:rw,noexec,nosuid,size=10m \\
  myapp:latest

# ── Bind mount for development (live reload) ──
docker run -d \\
  -v "$(pwd)/src":/app/src:ro \\
  -v "$(pwd)/node_modules":/app/node_modules \\
  -p 3000:3000 \\
  myapp:dev

# ── Housekeeping ──
docker volume ls -f dangling=true    # volumes not attached to any container
docker volume prune -f               # remove all dangling volumes (careful!)`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a named volume, attach it to a PostgreSQL container, insert 10 rows, then destroy and recreate the container three times confirming data persists each time. Run `docker volume inspect` and look at the `Mountpoint` — navigate there on the host with `sudo ls` to see the raw data files.",
              np: "Named volume create गर्नुहोस्, PostgreSQL container मा attach गर्नुहोस्, 10 row insert गर्नुहोस्, त्यसपछि container destroy र recreate तीन पटक गर्नुहोस् प्रत्येक पटक data persist confirm गर्दै। `docker volume inspect` run गर्नुहोस् र `Mountpoint` हेर्नुहोस् — raw data file हेर्न `sudo ls` नाल host मा त्यहाँ navigate गर्नुहोस्।",
              jp: "名前付きボリュームを作成し、PostgreSQL コンテナにアタッチし、10 行挿入してからコンテナを 3 回破棄・再作成してデータが毎回保持されることを確認する。`docker volume inspect` を実行して `Mountpoint` を確認し、ホスト上でその場所に `sudo ls` でナビゲートして生データファイルを確認する。",
            },
            {
              en: "Use the tar-based backup recipe to back up the named volume to `./backups/`. Delete the original volume, create a new one, restore from the backup, and confirm the data is intact inside a fresh container.",
              np: "Tar-based backup recipe नाल named volume लाई `./backups/` मा back up गर्नुहोस्। Original volume delete गर्नुहोस्, नयाँ create गर्नुहोस्, backup बाट restore गर्नुहोस्, र fresh container भित्र data intact छ confirm गर्नुहोस्।",
              jp: "tar ベースのバックアップレシピを使用して名前付きボリュームを `./backups/` にバックアップする。元のボリュームを削除し、新しいものを作成し、バックアップからリストアして、フレッシュなコンテナ内でデータが無傷であることを確認する。",
            },
            {
              en: "Run a container with `--tmpfs /run/secrets:size=10m`. Exec into it and write a fake API key to `/run/secrets/api_key`. Stop the container and start a new one from the same image — confirm the file is gone. Then use `docker inspect` to show the tmpfs mount configuration.",
              np: "`--tmpfs /run/secrets:size=10m` नाल container run गर्नुहोस्। Exec गरी `/run/secrets/api_key` मा fake API key write गर्नुहोस्। Container stop गर्नुहोस् र same image बाट नयाँ start गर्नुहोस् — file gone छ confirm गर्नुहोस्। त्यसपछि tmpfs mount configuration देखाउन `docker inspect` प्रयोग गर्नुहोस्।",
              jp: "`--tmpfs /run/secrets:size=10m` でコンテナを実行する。exec して `/run/secrets/api_key` に偽の API キーを書き込む。コンテナを停止して同じイメージから新しいものを起動し、ファイルが消えていることを確認する。次に `docker inspect` を使用して tmpfs マウント設定を表示する。",
            },
            {
              en: "Practice the init-container pattern: create a volume, run an alpine container to write a config file into it, then run your app container with that volume mounted read-only. Verify inside the app container that it can read but not write to the config.",
              np: "Init-container pattern practice गर्नुहोस्: volume create गर्नुहोस्, config file write गर्न alpine container run गर्नुहोस्, त्यसपछि read-only mount गरी volume नाल app container run गर्नुहोस्। App container भित्र config read गर्न सक्छ तर write गर्न सक्दैन verify गर्नुहोस्।",
              jp: "init-container パターンを練習する：ボリュームを作成し、alpine コンテナを実行してその中に設定ファイルを書き込み、そのボリュームを読み取り専用でマウントしてアプリコンテナを実行する。アプリコンテナ内で設定を読めるが書き込めないことを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use a named volume versus a bind mount in production?",
        np: "Production मा named volume vs bind mount कहिले प्रयोग गर्ने?",
        jp: "本番環境で名前付きボリュームとバインドマウントをいつ使い分けるべきか？",
      },
      answer: {
        en: "Use named volumes in production for any stateful data (databases, message queue logs, uploaded files). Docker controls where the data lives, it works identically across Linux hosts, and volume drivers can back it to NFS or EFS. Bind mounts are for development workflows where you want live reload from host source code, or for injecting host config files (like nginx.conf) that you manage externally. Never use bind mounts for database data in production — the host path may not exist on a new node, breaking your container orchestrator.",
        np: "Production मा कुनैपनि stateful data (database, message queue log, uploaded file) को लागि named volume प्रयोग गर्नुहोस्। Docker ले data कहाँ live गर्छ control गर्छ, Linux host across identically काम गर्छ, र volume driver ले NFS वा EFS मा back गर्न सक्छ। Bind mount development workflow को लागि हो जहाँ host source code बाट live reload चाहिन्छ, वा externally manage गरिएका host config file (जस्तै nginx.conf) inject गर्न। Production मा database data को लागि कहिल्यै bind mount प्रयोग नगर्नुहोस् — नयाँ node मा host path exist नहुन सक्छ, container orchestrator break गर्छ।",
        jp: "本番環境ではステートフルなデータ（データベース・メッセージキューのログ・アップロードされたファイル）に名前付きボリュームを使用してください。Docker がデータの保存場所を制御し、Linux ホスト間で同一に動作し、ボリュームドライバーが NFS や EFS にバックアップできます。バインドマウントは、ホストのソースコードからライブリロードしたい開発ワークフロー、または外部で管理しているホスト設定ファイル（nginx.conf など）の注入に使用します。本番環境でデータベースデータにバインドマウントを使用しないでください — 新しいノードにはホストパスが存在しない可能性があり、コンテナオーケストレーターが壊れます。",
      },
      tag: { en: "storage", np: "Storage", jp: "ストレージ" },
    },
    {
      question: {
        en: "Can two containers write to the same named volume simultaneously?",
        np: "दुई container ले same named volume मा एकसाथ write गर्न सक्छन्?",
        jp: "2 つのコンテナが同じ名前付きボリュームに同時に書き込めるか？",
      },
      answer: {
        en: "Yes, Docker itself does not prevent it — both containers get a filesystem path to the same directory. However, the safety of concurrent writes depends entirely on the application. Databases (Postgres, MySQL) use their own locking and MUST be the only writer to their data directory — running two DB instances on one volume causes corruption. Log aggregators (Fluent Bit) are designed for multi-writer scenarios. For shared state between containers, prefer a proper database or message queue rather than a shared volume.",
        np: "हो, Docker आफैले यो prevent गर्दैन — दुवै container लाई same directory को filesystem path मिल्छ। तर, concurrent write को safety पूर्णतः application मा depend गर्छ। Database (Postgres, MySQL) ले आफ्नै locking प्रयोग गर्छ र data directory मा एकमात्र writer हुनुपर्छ — एउटा volume मा दुई DB instance run गर्दा corruption हुन्छ। Log aggregator (Fluent Bit) multi-writer scenario को लागि design गरिएको छ। Container बीच shared state को लागि, shared volume भन्दा proper database वा message queue prefer गर्नुहोस्।",
        jp: "はい、Docker 自体は防止しません — 両方のコンテナが同じディレクトリへのファイルシステムパスを取得します。ただし、同時書き込みの安全性はアプリケーションに完全に依存します。データベース（Postgres・MySQL）は独自のロックを使用しており、データディレクトリへの唯一のライターでなければなりません — 1 つのボリュームで 2 つの DB インスタンスを実行するとデータが破損します。ログアグリゲーター（Fluent Bit）はマルチライターシナリオ向けに設計されています。コンテナ間の共有状態には、共有ボリュームよりも適切なデータベースまたはメッセージキューを使用してください。",
      },
      tag: { en: "concurrency", np: "Concurrency", jp: "並行性" },
    },
  ],
};
