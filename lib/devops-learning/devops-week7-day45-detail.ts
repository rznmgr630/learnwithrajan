import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Running containers is about much more than `docker run`. Every container has a lifecycle — from being created to running, paused, stopped, and ultimately removed — and Docker gives you fine-grained control at each stage. Today you master the most important `docker run` flags, resource constraints, persistent storage with volumes and bind mounts, environment injection, health checks, and the day-to-day operational commands that keep containers observable and maintainable.",
    np: "Container run गर्नु `docker run` भन्दा धेरै बढी हो। प्रत्येक container को lifecycle हुन्छ — create हुनेदेखि running, paused, stopped, र अन्ततः removed हुनेसम्म — र Docker ले प्रत्येक stage मा fine-grained control दिन्छ। आज तपाईंले सबैभन्दा important `docker run` flag, resource constraint, volume र bind mount नाल persistent storage, environment injection, health check, र container observable र maintainable राख्ने day-to-day operational command master गर्नुहुनेछ।",
    jp: "コンテナの実行は `docker run` 以上のことを意味します。すべてのコンテナにはライフサイクルがあります — 作成から実行・一時停止・停止・最終的な削除まで — Docker は各段階で細かい制御を提供します。今日は最も重要な `docker run` フラグ・リソース制約・ボリュームとバインドマウントによる永続ストレージ・環境注入・ヘルスチェック・コンテナを観察可能で保守しやすく保つ日常的な操作コマンドをマスターします。",
  } as const,
  o2: {
    en: "By the end of today you will be comfortable managing a fleet of containers: starting, stopping, inspecting, exec-ing into, reading logs, watching stats, and cleaning up — skills that transfer directly to production on-call.",
    np: "आजको अन्तसम्म तपाईं container fleet manage गर्न comfortable हुनुहुनेछ: start, stop, inspect, exec, log read, stat watch, र cleanup — skill जुन directly production on-call मा transfer हुन्छ।",
    jp: "今日の終わりには、コンテナのフリートを管理することに慣れ親しむでしょう：起動・停止・検査・exec・ログの読み取り・統計の監視・クリーンアップ — これらのスキルは本番のオンコールに直接活かせます。",
  } as const,
};

export const DEVOPS_DAY_45_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Container lifecycle & state transitions",
        np: "Container lifecycle र state transition",
        jp: "コンテナのライフサイクルと状態遷移",
      },
      blocks: [
        { type: "diagram", id: "devops-container-lifecycle" },
        {
          type: "table",
          caption: {
            en: "Container states and the commands that trigger each transition",
            np: "Container state र प्रत्येक transition trigger गर्ने command",
            jp: "コンテナの状態と各遷移をトリガーするコマンド",
          },
          headers: [
            { en: "State", np: "State", jp: "状態" },
            { en: "Description", np: "Description", jp: "説明" },
            { en: "Commands to reach / leave", np: "Reach / leave गर्ने command", jp: "到達/離れるためのコマンド" },
          ],
          rows: [
            [
              { en: "created", np: "created", jp: "created" },
              { en: "Container is created but the process has not started yet", np: "Container create भयो तर process start भएको छैन", jp: "コンテナは作成されたがプロセスはまだ起動していない" },
              { en: "`docker create` → created; `docker start` → running", np: "`docker create` → created; `docker start` → running", jp: "`docker create` → created；`docker start` → running" },
            ],
            [
              { en: "running", np: "running", jp: "running" },
              { en: "PID 1 inside the container is executing; `docker ps` shows it without `-a`", np: "Container भित्र PID 1 execute गरिरहेको छ; `docker ps` ले `-a` बिना देखाउँछ", jp: "コンテナ内の PID 1 が実行中；`docker ps` は `-a` なしで表示する" },
              { en: "`docker run` / `docker start`; exit via `docker stop` / `docker kill`", np: "`docker run` / `docker start`; `docker stop` / `docker kill` मार्फत exit", jp: "`docker run` / `docker start`；`docker stop` / `docker kill` で終了" },
            ],
            [
              { en: "paused", np: "paused", jp: "paused" },
              { en: "Process is frozen via cgroup freezer (CPU suspended, memory intact)", np: "Process cgroup freezer मार्फत freeze भएको छ (CPU suspended, memory intact)", jp: "プロセスは cgroup フリーザーで凍結（CPU 停止・メモリは保持）" },
              { en: "`docker pause` → paused; `docker unpause` → running", np: "`docker pause` → paused; `docker unpause` → running", jp: "`docker pause` → paused；`docker unpause` → running" },
            ],
            [
              { en: "stopped (exited)", np: "stopped (exited)", jp: "stopped (exited)" },
              { en: "PID 1 has exited; filesystem persists; container can be restarted", np: "PID 1 exit भयो; filesystem persist; container restart गर्न सकिन्छ", jp: "PID 1 が終了；ファイルシステムは保持；コンテナは再起動可能" },
              { en: "`docker stop` (SIGTERM+SIGKILL); restart via `docker start`", np: "`docker stop` (SIGTERM+SIGKILL); `docker start` मार्फत restart", jp: "`docker stop`（SIGTERM+SIGKILL）；`docker start` で再起動" },
            ],
            [
              { en: "removed", np: "removed", jp: "removed" },
              { en: "Container and its writable layer are deleted; cannot be recovered", np: "Container र यसको writable layer delete भयो; recover गर्न सकिँदैन", jp: "コンテナとその書き込み可能なレイヤーが削除；復元不可" },
              { en: "`docker rm` (must be stopped first) or `docker run --rm` (auto-remove on exit)", np: "`docker rm` (पहिले stop गर्नुपर्छ) वा `docker run --rm` (exit मा auto-remove)", jp: "`docker rm`（先に停止が必要）または `docker run --rm`（終了時に自動削除）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Essential docker run flags & operational commands",
        np: "Essential docker run flag र operational command",
        jp: "重要な docker run フラグと操作コマンド",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "docker run flags, volumes, env, logs, stats and exec",
            np: "docker run flag, volume, env, log, stat र exec",
            jp: "docker run フラグ・ボリューム・env・ログ・統計・exec",
          },
          code: `# ── Detached mode with port mapping and name ──
docker run -d -p 8080:80 --name web nginx

# ── Resource limits (cgroup enforcement) ──
docker run -d \\
  --memory=256m \\          # hard memory limit
  --memory-swap=256m \\     # disable swap (swap = memory setting prevents OOM swap thrash)
  --cpus=1.5 \\             # 1.5 CPU cores
  --name app \\
  myimage:latest

# ── Environment injection ──
docker run -d \\
  -e NODE_ENV=production \\
  -e DB_HOST=db.internal \\
  --env-file .env.prod \\   # load from file (keep out of git)
  myimage:latest

# ── Named volumes (managed by Docker, survive container removal) ──
docker volume create pgdata
docker run -d \\
  -v pgdata:/var/lib/postgresql/data \\
  -e POSTGRES_PASSWORD=secret \\
  --name db postgres:16-alpine

docker volume ls
docker volume inspect pgdata   # shows Mountpoint on host

# ── Bind mounts (host path → container path, good for dev) ──
docker run -d \\
  -v "$(pwd)/src:/app/src:ro" \\   # :ro = read-only inside container
  -p 3000:3000 \\
  --name dev-api myimage:dev

# ── tmpfs mount (ephemeral RAM disk — never touches disk, good for secrets) ──
docker run -d --tmpfs /app/tmp:rw,noexec,size=64m myimage:latest

# ── Restart policies ──
# no (default): never restart
# on-failure[:n]: restart on non-zero exit, up to n times
# always: restart always (even after daemon restart)
# unless-stopped: like always but respects manual stop
docker run -d --restart=unless-stopped --name web nginx

# ── Inspect, logs, exec, stats ──
docker inspect web                          # full JSON metadata
docker inspect --format='{{.NetworkSettings.IPAddress}}' web

docker logs web                             # tail all logs
docker logs -f web                          # follow (like tail -f)
docker logs --since=10m web                 # last 10 minutes

docker exec -it web bash                    # interactive shell
docker exec web nginx -t                    # non-interactive command

docker stats                                # live CPU/mem/net/disk for all containers
docker stats web --no-stream                # one-shot snapshot

# ── Cleanup ──
docker stop web db dev-api
docker rm web db dev-api                    # remove stopped containers
docker container prune -f                   # remove all stopped containers
docker volume prune -f                      # remove all unused volumes
docker system prune -af                     # nuclear option: images+containers+volumes`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Start a PostgreSQL container with a named volume. Stop it, remove it, then recreate it pointing to the same named volume. Connect with `psql` and confirm the data you created in the first run is still there.",
              np: "Named volume नाल PostgreSQL container start गर्नुहोस्। Stop गर्नुहोस्, remove गर्नुहोस्, त्यसपछि same named volume point गरेर recreate गर्नुहोस्। `psql` नाल connect गर्नुहोस् र first run मा create गरेको data अझै छ confirm गर्नुहोस्।",
              jp: "名前付きボリュームで PostgreSQL コンテナを起動する。停止して削除し、同じ名前付きボリュームを指定して再作成する。`psql` で接続して最初の実行で作成したデータがまだあることを確認する。",
            },
            {
              en: "Run a container with `--memory=64m`. Use `docker stats` to watch memory consumption. Run `stress --vm 1 --vm-bytes 100M` inside the container using `docker exec` and observe the OOM kill in `docker events`.",
              np: "`--memory=64m` नाल container run गर्नुहोस्। Memory consumption watch गर्न `docker stats` प्रयोग गर्नुहोस्। `docker exec` प्रयोग गरी container भित्र `stress --vm 1 --vm-bytes 100M` run गर्नुहोस् र `docker events` मा OOM kill observe गर्नुहोस्।",
              jp: "`--memory=64m` でコンテナを実行する。`docker stats` でメモリ消費を監視する。`docker exec` を使用してコンテナ内で `stress --vm 1 --vm-bytes 100M` を実行し、`docker events` で OOM キルを観察する。",
            },
            {
              en: "Use `docker run --env-file .env myimage` to inject environment variables. Inside the container, verify they are set with `env | grep MY_VAR`. Then use `docker inspect` to see that env vars are visible in the container metadata — reinforcing why secrets should not live in env vars.",
              np: "`docker run --env-file .env myimage` प्रयोग गरी environment variable inject गर्नुहोस्। Container भित्र, `env | grep MY_VAR` नाल set भएको verify गर्नुहोस्। त्यसपछि `docker inspect` प्रयोग गरी container metadata मा env var visible छ हेर्नुहोस् — किन secret env var मा राख्नुहुँदैन reinforcing गर्नुहोस्।",
              jp: "`docker run --env-file .env myimage` を使用して環境変数を注入する。コンテナ内で `env | grep MY_VAR` で設定されていることを確認する。次に `docker inspect` を使用してコンテナのメタデータで env 変数が見えることを確認する — シークレットを env 変数に入れるべきでない理由を強化する。",
            },
            {
              en: "Run three containers with `--restart=unless-stopped`. Manually stop Docker daemon with `sudo systemctl stop docker`. Start it again and confirm all three containers came back up automatically. Stop one explicitly with `docker stop` and restart the daemon — confirm it does NOT restart.",
              np: "`--restart=unless-stopped` नाल तीन container run गर्नुहोस्। `sudo systemctl stop docker` नाल Docker daemon manually stop गर्नुहोस्। फेरि start गर्नुहोस् र तीनै container automatically आए confirm गर्नुहोस्। एउटालाई `docker stop` नाल explicitly stop गर्नुहोस् र daemon restart गर्नुहोस् — यो restart नभएको confirm गर्नुहोस्।",
              jp: "`--restart=unless-stopped` で 3 つのコンテナを実行する。`sudo systemctl stop docker` で Docker デーモンを手動で停止する。再起動して 3 つのコンテナがすべて自動的に起動したことを確認する。1 つを `docker stop` で明示的に停止してデーモンを再起動し、それが再起動しないことを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a named volume and a bind mount?",
        np: "Named volume र bind mount बीच के फरक छ?",
        jp: "名前付きボリュームとバインドマウントの違いは何か？",
      },
      answer: {
        en: "A named volume (`-v pgdata:/var/lib/pgsql/data`) is managed entirely by Docker. Docker decides where on the host to store it (usually /var/lib/docker/volumes/). It survives container removal, is portable across hosts via `docker volume`, and is the right choice for databases and stateful services in production. A bind mount (`-v /host/path:/container/path`) maps an exact host directory into the container. This is great for development (live reload) but couples the container to a specific host path, making it less portable.",
        np: "Named volume (`-v pgdata:/var/lib/pgsql/data`) Docker द्वारा completely manage हुन्छ। Docker ले host मा कहाँ store गर्ने decide गर्छ (सामान्यतया /var/lib/docker/volumes/)। Container removal survive, `docker volume` मार्फत host across portable, र production मा database र stateful service को लागि सही choice। Bind mount (`-v /host/path:/container/path`) ले exact host directory लाई container मा map गर्छ। Development (live reload) को लागि राम्रो तर container लाई specific host path मा couple गर्छ, कम portable बनाउँछ।",
        jp: "名前付きボリューム（`-v pgdata:/var/lib/pgsql/data`）は Docker によって完全に管理されます。Docker はホスト上のどこに保存するかを決定します（通常は /var/lib/docker/volumes/）。コンテナの削除後も存在し続け・`docker volume` でホスト間で移植可能で・本番環境のデータベースやステートフルサービスに適した選択です。バインドマウント（`-v /host/path:/container/path`）は正確なホストディレクトリをコンテナにマップします。開発（ライブリロード）には最適ですが、コンテナを特定のホストパスに結合させるため移植性が低くなります。",
      },
      tag: { en: "storage", np: "Storage", jp: "ストレージ" },
    },
    {
      question: {
        en: "How do I see why a container exited unexpectedly?",
        np: "Container unexpectedly exit भएको किन हो कसरी हेर्ने?",
        jp: "コンテナが予期せず終了した理由を確認するにはどうすればよいか？",
      },
      answer: {
        en: "First run `docker ps -a` to see the exit code. Code 137 means OOM kill (increase `--memory`). Code 1 or 2 is usually an application error. Then run `docker logs <container>` to read the last output before exit. If the container starts and immediately exits, `docker run --rm -it myimage sh` lets you explore interactively. `docker inspect <container>` shows `State.OOMKilled`, `State.Error`, and `State.ExitCode` in structured JSON.",
        np: "पहिले exit code हेर्न `docker ps -a` run गर्नुहोस्। Code 137 मतलब OOM kill (`--memory` बढाउनुहोस्)। Code 1 वा 2 सामान्यतया application error हो। त्यसपछि exit अघि last output पढ्न `docker logs <container>` run गर्नुहोस्। Container start भएर immediately exit भयो भने `docker run --rm -it myimage sh` ले interactively explore गर्न दिन्छ। `docker inspect <container>` ले structured JSON मा `State.OOMKilled`, `State.Error`, र `State.ExitCode` देखाउँछ।",
        jp: "まず `docker ps -a` を実行して終了コードを確認します。コード 137 は OOM キルを意味します（`--memory` を増やす）。コード 1 または 2 は通常アプリケーションエラーです。次に `docker logs <container>` で終了前の最後の出力を読みます。コンテナが起動してすぐに終了する場合は、`docker run --rm -it myimage sh` でインタラクティブに探索できます。`docker inspect <container>` は構造化 JSON で `State.OOMKilled`・`State.Error`・`State.ExitCode` を表示します。",
      },
      tag: { en: "debugging", np: "Debugging", jp: "デバッグ" },
    },
  ],
};
