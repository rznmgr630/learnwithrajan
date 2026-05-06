import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A container is a lightweight, portable, isolated process that packages an application with everything it needs to run — code, runtime, libraries, and config. Unlike VMs, containers share the host OS kernel, so they start in milliseconds and use far less memory. Docker is the most popular toolchain for building and running containers. Understanding the problem Docker solves — 'it works on my machine' — is the foundation for everything in Week 7.",
    np: "Container एउटा lightweight, portable, isolated process हो जसले application लाई run गर्न आवश्यक सबैकुराको साथ package गर्छ — code, runtime, library, र config। VM भन्दा फरक, container ले host OS kernel share गर्छ, त्यसैले millisecond मा start हुन्छ र धेरै कम memory प्रयोग गर्छ। Docker container build र run गर्नको लागि सबैभन्दा popular toolchain हो। Docker ले solve गर्ने problem बुझ्नु — 'मेरो machine मा काम गर्छ' — Week 7 को सबैकुराको foundation हो।",
    jp: "コンテナは、アプリケーションを実行するために必要なすべてのもの（コード・ランタイム・ライブラリ・設定）をパッケージ化した軽量でポータブルな分離されたプロセスです。VM と異なり、コンテナはホスト OS カーネルを共有するため、ミリ秒で起動し、はるかに少ないメモリを使用します。Docker はコンテナのビルドと実行のための最も人気のあるツールチェーンです。Docker が解決する問題（「自分のマシンでは動く」）を理解することが Week 7 のすべての基盤です。",
  } as const,
  o2: {
    en: "Today you learn the conceptual model behind containers: the Linux primitives that make them work (namespaces, cgroups, union filesystems), how Docker's client-server architecture works, and the key differences between a container and a VM. You will install Docker, run your first containers, and understand the image-container relationship.",
    np: "आज तपाईंले container पछाडिको conceptual model सिक्नुहुनेछ: तिनीहरूलाई काम गराउने Linux primitive (namespace, cgroup, union filesystem), Docker को client-server architecture कसरी काम गर्छ, र container र VM बीचको मुख्य फरक। तपाईंले Docker install गर्नुहुनेछ, आफ्नो पहिलो container run गर्नुहुनेछ, र image-container relationship बुझ्नुहुनेछ।",
    jp: "今日はコンテナの背後にある概念モデルを学びます：コンテナを機能させる Linux プリミティブ（名前空間・cgroup・ユニオンファイルシステム）・Docker のクライアントサーバーアーキテクチャの仕組み・コンテナと VM の主な違い。Docker をインストールし、最初のコンテナを実行し、イメージとコンテナの関係を理解します。",
  } as const,
};

export const DEVOPS_DAY_43_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Containers vs VMs — the mental model",
        np: "Container vs VM — mental model",
        jp: "コンテナと VM の比較 — メンタルモデル",
      },
      blocks: [
        { type: "diagram", id: "devops-container-vs-vm" },
        {
          type: "table",
          caption: {
            en: "Container vs Virtual Machine — key differences in isolation, resource use, startup time, and portability",
            np: "Container vs Virtual Machine — isolation, resource use, startup time, र portability मा मुख्य फरक",
            jp: "コンテナと仮想マシンの比較 — 隔離・リソース使用・起動時間・ポータビリティの主な違い",
          },
          headers: [
            { en: "Aspect", np: "Aspect", jp: "側面" },
            { en: "Container", np: "Container", jp: "コンテナ" },
            { en: "Virtual Machine", np: "Virtual Machine", jp: "仮想マシン" },
          ],
          rows: [
            [
              { en: "OS isolation", np: "OS isolation", jp: "OS の隔離" },
              { en: "Shares host kernel — process-level isolation via namespaces", np: "Host kernel share — namespace मार्फत process-level isolation", jp: "ホストカーネルを共有 — 名前空間によるプロセスレベルの隔離" },
              { en: "Full guest OS — hypervisor-level isolation", np: "Full guest OS — hypervisor-level isolation", jp: "完全なゲスト OS — ハイパーバイザーレベルの隔離" },
            ],
            [
              { en: "Startup time", np: "Startup time", jp: "起動時間" },
              { en: "Milliseconds — no OS boot needed", np: "Millisecond — OS boot आवश्यक छैन", jp: "ミリ秒 — OS 起動不要" },
              { en: "30 seconds to minutes — boots a full OS", np: "30 second देखि minute — full OS boot", jp: "30 秒〜数分 — 完全な OS を起動" },
            ],
            [
              { en: "Disk footprint", np: "Disk footprint", jp: "ディスク使用量" },
              { en: "MBs — only app + dependencies", np: "MB — app + dependency मात्र", jp: "MB — アプリと依存関係のみ" },
              { en: "GBs — full OS image inside", np: "GB — भित्र full OS image", jp: "GB — 完全な OS イメージを含む" },
            ],
            [
              { en: "Memory overhead", np: "Memory overhead", jp: "メモリオーバーヘッド" },
              { en: "Minimal — no guest OS in memory", np: "Minimal — memory मा guest OS छैन", jp: "最小限 — メモリにゲスト OS なし" },
              { en: "High — entire guest OS resident in RAM", np: "High — RAM मा entire guest OS resident", jp: "高い — 完全なゲスト OS が RAM に常駐" },
            ],
            [
              { en: "Security isolation", np: "Security isolation", jp: "セキュリティの隔離" },
              { en: "Weaker — kernel escape bugs affect host", np: "कमजोर — kernel escape bug ले host affect गर्छ", jp: "弱い — カーネルエスケープのバグがホストに影響" },
              { en: "Stronger — guest kernel exploits stay inside VM", np: "बलियो — guest kernel exploit VM भित्रै रहन्छ", jp: "強い — ゲストカーネルの悪用は VM 内に留まる" },
            ],
            [
              { en: "Portability", np: "Portability", jp: "ポータビリティ" },
              { en: "High — image runs identically anywhere Docker runs", np: "High — Docker run हुने जहाँ पनि image identically run", jp: "高い — Docker が実行される場所ならどこでも同一のイメージが実行される" },
              { en: "Medium — VM images are large and hypervisor-dependent", np: "Medium — VM image ठूलो र hypervisor-dependent", jp: "中程度 — VM イメージは大きくハイパーバイザー依存" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Linux primitives that power containers",
        np: "Container लाई power दिने Linux primitive",
        jp: "コンテナを支える Linux プリミティブ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Containers are not magic — they are Linux processes with three kernel features applied: (1) Namespaces isolate what the process can see: PID namespace (its own process tree), network namespace (its own network stack), mount namespace (its own filesystem view), UTS (its own hostname), IPC. (2) cgroups (control groups) limit what the process can use: CPU, memory, disk I/O, network bandwidth. (3) Union filesystems (OverlayFS) stack read-only image layers on top of each other, with a thin read-write layer on top — this makes images small, fast, and shareable.",
            np: "Container magic होइन — तिनीहरू तीन kernel feature लागू गरिएका Linux process हुन्: (1) Namespace ले process ले के देख्न सक्छ isolate गर्छ: PID namespace (आफ्नै process tree), network namespace (आफ्नै network stack), mount namespace (आफ्नै filesystem view), UTS (आफ्नै hostname), IPC। (2) cgroup (control group) ले process ले के use गर्न सक्छ limit गर्छ: CPU, memory, disk I/O, network bandwidth। (3) Union filesystem (OverlayFS) ले read-only image layer माथि एकअर्काको stack गर्छ, माथि thin read-write layer सहित — यसले image लाई small, fast, र shareable बनाउँछ।",
            jp: "コンテナは魔法ではありません — 3 つのカーネル機能が適用された Linux プロセスです：(1) 名前空間はプロセスが見えるものを隔離します：PID 名前空間（独自のプロセスツリー）・ネットワーク名前空間（独自のネットワークスタック）・マウント名前空間（独自のファイルシステムビュー）・UTS（独自のホスト名）・IPC。(2) cgroup（コントロールグループ）はプロセスが使用できるものを制限します：CPU・メモリ・ディスク I/O・ネットワーク帯域幅。(3) ユニオンファイルシステム（OverlayFS）は読み取り専用のイメージレイヤーを重ね、その上に薄い読み書きレイヤーを置きます — これによりイメージは小さく・高速で・共有可能になります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Install Docker and run your first containers",
            np: "Docker install गर्नुहोस् र आफ्नो पहिलो container run गर्नुहोस्",
            jp: "Docker のインストールと最初のコンテナの実行",
          },
          code: `# ── Install Docker (Ubuntu/Debian) ──
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
    sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Allow current user to run Docker without sudo
sudo usermod -aG docker "$USER"
newgrp docker

# Verify
docker --version
docker info

# ── Run your first containers ──
# Hello world — runs, prints, exits
docker run hello-world

# Interactive Ubuntu shell — inside an isolated Ubuntu environment
docker run -it ubuntu bash
# Inside: cat /etc/os-release; ls /; exit

# Nginx web server — detached, port-forwarded
docker run -d -p 8080:80 --name my-nginx nginx
curl http://localhost:8080   # serves nginx welcome page
docker stop my-nginx
docker rm my-nginx

# ── Understand the image-container relationship ──
# An image is a read-only template. A container is a running (or stopped) instance.
docker images                        # list local images
docker pull alpine:3.19              # download image without running
docker inspect alpine:3.19           # full metadata

docker run -it --name demo alpine sh
# make a change inside: touch /tmp/myfile
exit

docker diff demo          # shows files added/changed/deleted vs the image
docker commit demo my-alpine-with-file  # snapshot the container into a new image

# List all containers (running + stopped)
docker ps -a

# Remove stopped containers and dangling images (housekeeping)
docker container prune -f
docker image prune -f`,
        },
      ],
    },
    {
      title: {
        en: "Docker architecture — daemon, client & registry",
        np: "Docker architecture — daemon, client र registry",
        jp: "Docker アーキテクチャ — デーモン・クライアント・レジストリ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The Docker CLI (`docker`) talks to the Docker daemon (`dockerd`) via a REST API (Unix socket `/var/run/docker.sock` by default). The daemon does the actual work: managing images, running containers, and handling networks and volumes. The CLI can also connect to remote daemons via TCP. Docker Hub is the default public registry — `docker pull nginx` pulls from `docker.io/library/nginx:latest`. Private registries (ECR, GHCR, self-hosted Harbor) require `docker login` first.",
            np: "Docker CLI (`docker`) ले REST API (default Unix socket `/var/run/docker.sock`) मार्फत Docker daemon (`dockerd`) सँग कुरा गर्छ। Daemon ले actual work गर्छ: image manage, container run, र network र volume handle। CLI ले TCP मार्फत remote daemon सँग पनि connect गर्न सक्छ। Docker Hub default public registry हो — `docker pull nginx` ले `docker.io/library/nginx:latest` बाट pull गर्छ। Private registry (ECR, GHCR, self-hosted Harbor) लाई पहिले `docker login` चाहिन्छ।",
            jp: "Docker CLI（`docker`）は REST API（デフォルトで Unix ソケット `/var/run/docker.sock`）経由で Docker デーモン（`dockerd`）と通信します。デーモンが実際の作業を行います：イメージの管理・コンテナの実行・ネットワークとボリュームの処理。CLI は TCP 経由でリモートデーモンにも接続できます。Docker Hub はデフォルトのパブリックレジストリです — `docker pull nginx` は `docker.io/library/nginx:latest` からプルします。プライベートレジストリ（ECR・GHCR・セルフホスト Harbor）は最初に `docker login` が必要です。",
          },
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Run `docker run -d -p 8080:80 --name my-nginx nginx` and then `curl localhost:8080`. Use `docker ps` to see the running container. Use `docker logs my-nginx` to see the access log.",
              np: "`docker run -d -p 8080:80 --name my-nginx nginx` र त्यसपछि `curl localhost:8080` run गर्नुहोस्। Running container हेर्न `docker ps` प्रयोग गर्नुहोस्। Access log हेर्न `docker logs my-nginx` प्रयोग गर्नुहोस्।",
              jp: "`docker run -d -p 8080:80 --name my-nginx nginx` を実行して `curl localhost:8080` を実行する。`docker ps` で実行中のコンテナを確認。`docker logs my-nginx` でアクセスログを確認する。",
            },
            {
              en: "Run `docker run -it alpine sh` and explore the container filesystem. Try `ps aux` (only one process!), `hostname`, `ip addr`. Then open a second terminal and run `docker exec -it <container_id> sh` to get a second shell in the same container.",
              np: "`docker run -it alpine sh` run गर्नुहोस् र container filesystem explore गर्नुहोस्। `ps aux` (एउटा process मात्र!), `hostname`, `ip addr` try गर्नुहोस्। त्यसपछि second terminal खोल्नुहोस् र same container मा second shell पाउन `docker exec -it <container_id> sh` run गर्नुहोस्।",
              jp: "`docker run -it alpine sh` を実行してコンテナのファイルシステムを探索する。`ps aux`（プロセスが 1 つだけ！）・`hostname`・`ip addr` を試してみる。次に 2 番目のターミナルを開いて `docker exec -it <container_id> sh` で同じコンテナに 2 番目のシェルを取得する。",
            },
            {
              en: "Run `docker run -d --name limited --memory=128m --cpus=0.5 nginx`. Then run `docker inspect limited | grep -A5 HostConfig` and confirm the memory and CPU limits are set. This demonstrates cgroup enforcement.",
              np: "`docker run -d --name limited --memory=128m --cpus=0.5 nginx` run गर्नुहोस्। त्यसपछि `docker inspect limited | grep -A5 HostConfig` run गर्नुहोस् र memory र CPU limit set भएको confirm गर्नुहोस्। यसले cgroup enforcement demonstrate गर्छ।",
              jp: "`docker run -d --name limited --memory=128m --cpus=0.5 nginx` を実行する。次に `docker inspect limited | grep -A5 HostConfig` を実行して、メモリと CPU 制限が設定されていることを確認する。これは cgroup の強制を示しています。",
            },
            {
              en: "Pull three different images (`nginx`, `redis`, `alpine`) and run `docker images`. Notice they all share base layer IDs. Run `docker history nginx` to see the layer stack that makes up the image.",
              np: "तीन different image (`nginx`, `redis`, `alpine`) pull गर्नुहोस् र `docker images` run गर्नुहोस्। तिनीहरू सबैले base layer ID share गर्छन् notice गर्नुहोस्। Image बनाउने layer stack हेर्न `docker history nginx` run गर्नुहोस्।",
              jp: "3 つの異なるイメージ（`nginx`・`redis`・`alpine`）をプルして `docker images` を実行する。すべてがベースレイヤー ID を共有していることに注意する。`docker history nginx` を実行してイメージを構成するレイヤースタックを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "If containers share the kernel, can one container crash the host?",
        np: "Container ले kernel share गर्छ भने, के एउटा container ले host crash गर्न सक्छ?",
        jp: "コンテナがカーネルを共有する場合、1 つのコンテナがホストをクラッシュさせることはできるか？",
      },
      answer: {
        en: "In theory yes — a kernel-level exploit that escapes the namespace/cgroup isolation could affect the host. In practice this is very rare with up-to-date kernels and Seccomp/AppArmor profiles enabled (default in Docker). A misbehaving container is more likely to exhaust CPU or memory and be killed by the OOM killer than to escape isolation. Always set `--memory` and `--cpus` limits in production to prevent resource exhaustion from affecting other containers.",
        np: "Theory मा हो — namespace/cgroup isolation escape गर्ने kernel-level exploit ले host affect गर्न सक्छ। Practice मा up-to-date kernel र Seccomp/AppArmor profile (Docker मा default) enabled भएमा यो धेरै rare छ। Misbehaving container isolation escape गर्नुभन्दा CPU वा memory exhaust गरेर OOM killer द्वारा kill हुने सम्भावना बढी छ। अन्य container लाई affect गर्ने resource exhaustion रोक्न production मा `--memory` र `--cpus` limit हमेशा set गर्नुहोस्।",
        jp: "理論上はそうです — 名前空間/cgroup の隔離をエスケープするカーネルレベルの悪用はホストに影響を与える可能性があります。実際には最新のカーネルと Seccomp/AppArmor プロファイルが有効（Docker ではデフォルト）であれば非常にまれです。不正なコンテナは隔離をエスケープするよりも CPU またはメモリを使い果たして OOM キラーに強制終了される可能性が高い。他のコンテナへのリソース枯渇の影響を防ぐために、本番環境では常に `--memory` と `--cpus` の制限を設定してください。",
      },
      tag: { en: "security", np: "Security", jp: "セキュリティ" },
    },
    {
      question: {
        en: "What is the difference between `docker stop` and `docker kill`?",
        np: "`docker stop` र `docker kill` बीच के फरक छ?",
        jp: "`docker stop` と `docker kill` の違いは何か？",
      },
      answer: {
        en: "`docker stop` sends SIGTERM first (giving the process a chance to shut down gracefully) and then SIGKILL after a timeout (default 10s). `docker kill` sends SIGKILL immediately (no graceful shutdown). Always use `docker stop` in production so your application can finish in-flight requests, flush buffers, and close database connections. Use `docker kill` only when `docker stop` is unresponsive.",
        np: "`docker stop` ले पहिले SIGTERM पठाउँछ (process लाई gracefully shut down गर्ने मौका दिन्छ) र timeout (default 10s) पछि SIGKILL। `docker kill` ले immediately SIGKILL पठाउँछ (graceful shutdown छैन)। Production मा हमेशा `docker stop` प्रयोग गर्नुहोस् ताकि application ले in-flight request finish गर्न, buffer flush गर्न, र database connection close गर्न सकोस्। `docker stop` unresponsive भएमा मात्र `docker kill` प्रयोग गर्नुहोस्।",
        jp: "`docker stop` はまず SIGTERM を送信し（プロセスにグレースフルシャットダウンの機会を与える）、タイムアウト（デフォルト 10 秒）後に SIGKILL を送信します。`docker kill` は即座に SIGKILL を送信します（グレースフルシャットダウンなし）。本番環境では常に `docker stop` を使用してアプリケーションが進行中のリクエストを完了し・バッファをフラッシュし・データベース接続を閉じられるようにしてください。`docker stop` が応答しない場合のみ `docker kill` を使用します。",
      },
      tag: { en: "containers", np: "Container", jp: "コンテナ" },
    },
  ],
};
