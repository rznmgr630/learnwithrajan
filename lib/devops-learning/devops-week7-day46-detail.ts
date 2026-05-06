import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Container networking is what allows containers to talk to each other, to the host, and to the outside world. Docker ships with several network drivers, each solving a different problem. Today you master the four built-in network types (bridge, host, none, macvlan), why user-defined bridge networks are always preferred over the default bridge, how container DNS works, how overlay networks span multiple hosts in Docker Swarm, and how to debug network issues inside containers.",
    np: "Container networking ले container लाई एकअर्कासँग, host सँग, र बाहिरी world सँग कुरा गर्न दिन्छ। Docker मा धेरै network driver छन्, प्रत्येकले different problem solve गर्छ। आज तपाईंले चार built-in network type (bridge, host, none, macvlan), किन user-defined bridge network default bridge भन्दा हमेशा prefer गरिन्छ, container DNS कसरी काम गर्छ, Docker Swarm मा overlay network ले multiple host span गर्ने, र container भित्र network issue debug गर्ने master गर्नुहुनेछ।",
    jp: "コンテナネットワーキングにより、コンテナは相互に・ホストと・外部世界と通信できます。Docker にはいくつかのネットワークドライバーが付属しており、それぞれ異なる問題を解決します。今日は 4 つの組み込みネットワークタイプ（bridge・host・none・macvlan）・ユーザー定義ブリッジネットワークがデフォルトブリッジより常に優先される理由・コンテナ DNS の仕組み・Docker Swarm で複数のホストをまたぐオーバーレイネットワーク・コンテナ内のネットワーク問題のデバッグ方法をマスターします。",
  } as const,
  o2: {
    en: "At the end of today you will be able to design a multi-container application network, connect containers by name, isolate services in separate networks, expose only what needs to be public, and trace why a container cannot reach another.",
    np: "आजको अन्तमा तपाईं multi-container application network design गर्न, container लाई name नाल connect गर्न, separate network मा service isolate गर्न, public हुनुपर्ने मात्र expose गर्न, र container ले अर्कोमा किन reach गर्न सकेन trace गर्न सक्षम हुनुहुनेछ।",
    jp: "今日の終わりには、マルチコンテナアプリケーションネットワークを設計し・コンテナを名前で接続し・サービスを別々のネットワークに隔離し・公開が必要なものだけを公開し・コンテナが別のコンテナに到達できない理由を追跡できるようになります。",
  } as const,
};

export const DEVOPS_DAY_46_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Docker network drivers — choosing the right one",
        np: "Docker network driver — सही छनोट गर्ने",
        jp: "Docker ネットワークドライバー — 正しい選択",
      },
      blocks: [
        { type: "diagram", id: "devops-docker-networking" },
        {
          type: "table",
          caption: {
            en: "Docker network driver comparison — isolation, use case, and DNS support",
            np: "Docker network driver comparison — isolation, use case, र DNS support",
            jp: "Docker ネットワークドライバーの比較 — 隔離・ユースケース・DNS サポート",
          },
          headers: [
            { en: "Driver", np: "Driver", jp: "ドライバー" },
            { en: "Isolation", np: "Isolation", jp: "隔離" },
            { en: "Container-to-container DNS", np: "Container-to-container DNS", jp: "コンテナ間 DNS" },
            { en: "Best for", np: "Best for", jp: "最適な用途" },
          ],
          rows: [
            [
              { en: "bridge (default)", np: "bridge (default)", jp: "bridge（デフォルト）" },
              { en: "Containers on default bridge are isolated from host network stack but share the docker0 bridge", np: "Default bridge ले container लाई host network stack बाट isolate गर्छ तर docker0 bridge share", jp: "デフォルトブリッジはコンテナをホストネットワークスタックから隔離するが docker0 ブリッジを共有" },
              { en: "No — only reachable by IP; --link deprecated", np: "No — IP नाल मात्र reachable; --link deprecated", jp: "いいえ — IP でのみ到達可能；--link は非推奨" },
              { en: "Legacy; avoid — use user-defined bridge instead", np: "Legacy; avoid — user-defined bridge प्रयोग गर्नुहोस्", jp: "レガシー；避ける — 代わりにユーザー定義ブリッジを使用" },
            ],
            [
              { en: "bridge (user-defined)", np: "bridge (user-defined)", jp: "bridge（ユーザー定義）" },
              { en: "Containers only reachable by others on the same named network", np: "Containers same named network मा अरूले मात्र reachable", jp: "コンテナは同じ名前付きネットワーク上の他のコンテナからのみ到達可能" },
              { en: "Yes — containers reach each other by container name", np: "Yes — container name नाल reach", jp: "はい — コンテナ名でお互いに到達可能" },
              { en: "Default choice for all multi-container apps on a single host", np: "Single host मा सबै multi-container app को लागि default choice", jp: "単一ホスト上のすべてのマルチコンテナアプリのデフォルト選択" },
            ],
            [
              { en: "host", np: "host", jp: "host" },
              { en: "Container shares the host's network namespace — no NAT, no port mapping", np: "Container ले host को network namespace share गर्छ — no NAT, no port mapping", jp: "コンテナがホストのネットワーク名前空間を共有 — NAT なし・ポートマッピングなし" },
              { en: "N/A — container is on the host network directly", np: "N/A — container directly host network मा", jp: "N/A — コンテナは直接ホストネットワーク上" },
              { en: "High-throughput services (metrics exporters, proxies) where NAT overhead matters", np: "NAT overhead matter गर्ने high-throughput service (metrics exporter, proxy)", jp: "NAT オーバーヘッドが重要な高スループットサービス（メトリクスエクスポーター・プロキシ）" },
            ],
            [
              { en: "none", np: "none", jp: "none" },
              { en: "Container has its own network namespace but no interfaces (except loopback)", np: "Container को आफ्नै network namespace छ तर interface छैन (loopback बाहेक)", jp: "コンテナは独自のネットワーク名前空間を持つがインターフェースなし（ループバック除く）" },
              { en: "N/A — completely isolated", np: "N/A — completely isolated", jp: "N/A — 完全に隔離" },
              { en: "Offline batch jobs, cryptographic operations, sandboxing untrusted code", np: "Offline batch job, cryptographic operation, untrusted code sandboxing", jp: "オフラインバッチジョブ・暗号化操作・信頼できないコードのサンドボックス化" },
            ],
            [
              { en: "overlay", np: "overlay", jp: "overlay" },
              { en: "Encrypted VXLAN tunnel spans multiple Docker daemons — containers on different hosts can communicate", np: "Encrypted VXLAN tunnel ले multiple Docker daemon span गर्छ — different host मा container communicate गर्न सक्छ", jp: "暗号化された VXLAN トンネルが複数の Docker デーモンにまたがる — 異なるホスト上のコンテナが通信可能" },
              { en: "Yes — by service name (Docker Swarm)", np: "Yes — service name नाल (Docker Swarm)", jp: "はい — サービス名（Docker Swarm）" },
              { en: "Docker Swarm multi-host clusters; precursor concept to Kubernetes networking", np: "Docker Swarm multi-host cluster; Kubernetes networking को precursor concept", jp: "Docker Swarm マルチホストクラスター；Kubernetes ネットワーキングの前身概念" },
            ],
            [
              { en: "macvlan", np: "macvlan", jp: "macvlan" },
              { en: "Each container gets its own MAC address and IP on the physical network — appears as a physical host", np: "प्रत्येक container ले physical network मा आफ्नै MAC address र IP पाउँछ — physical host जस्तो देखिन्छ", jp: "各コンテナが物理ネットワーク上で独自の MAC アドレスと IP を取得 — 物理ホストとして表示" },
              { en: "Yes — by IP (no embedded DNS)", np: "Yes — IP नाल (embedded DNS छैन)", jp: "はい — IP（組み込み DNS なし）" },
              { en: "Legacy integrations where apps must appear on the LAN with a real IP", np: "App ले real IP नाल LAN मा appear गर्नुपर्ने legacy integration", jp: "アプリが実際の IP で LAN 上に表示される必要があるレガシー統合" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "User-defined bridge networks & container DNS",
        np: "User-defined bridge network र container DNS",
        jp: "ユーザー定義ブリッジネットワークとコンテナ DNS",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Multi-container networking — web + API + database on isolated networks",
            np: "Multi-container networking — isolated network मा web + API + database",
            jp: "マルチコンテナネットワーキング — 隔離されたネットワーク上の web + API + database",
          },
          code: `# ── Create isolated networks ──────────────────────────────────
# frontend-net: web can talk to api, but NOT directly to db
# backend-net:  api and db talk to each other
docker network create frontend-net
docker network create backend-net

# ── Start database (only on backend-net) ──
docker run -d \\
  --name db \\
  --network backend-net \\
  -e POSTGRES_PASSWORD=secret \\
  postgres:16-alpine

# ── Start API (connected to BOTH networks) ──
docker run -d \\
  --name api \\
  --network backend-net \\       # can reach db by name "db"
  -e DB_HOST=db \\
  myapi:latest

# Connect api to the frontend network as well
docker network connect frontend-net api

# ── Start web (only on frontend-net) ──
docker run -d \\
  --name web \\
  --network frontend-net \\      # can reach api by name "api"
  -p 80:80 \\
  -e API_URL=http://api:3000 \\
  mynginx:latest

# ── Verify DNS resolution ──
# From web container, api resolves but db does NOT
docker exec web ping -c1 api       # works
docker exec web ping -c1 db        # fails — different network

# From api container, both resolve
docker exec api ping -c1 db        # works
docker exec api ping -c1 web       # works (via frontend-net)

# ── Inspect networks ──
docker network ls
docker network inspect frontend-net
docker network inspect backend-net

# ── Overlay network (Swarm mode) ──
# Initialize Swarm
docker swarm init

# Create an overlay network
docker network create --driver overlay --attachable myoverlay

# Run a service on the overlay network
docker service create \\
  --name cache \\
  --network myoverlay \\
  --replicas 2 \\
  redis:7-alpine

# Check service tasks and their IPs
docker service ps cache
docker network inspect myoverlay

# ── Debug: enter a network debug container ──
# nicolaka/netshoot has dig, curl, tcpdump, traceroute, nmap, etc.
docker run --rm -it \\
  --network frontend-net \\
  nicolaka/netshoot \\
  dig api            # DNS lookup by name inside the network

# View iptables NAT rules Docker creates
sudo iptables -t nat -L -n --line-numbers | grep DOCKER`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create two user-defined networks (`net-a` and `net-b`). Run three containers: `c1` and `c2` on `net-a`, `c3` on `net-b`. Verify that `c1` can ping `c2` by name, but cannot ping `c3`. Then connect `c2` to `net-b` and verify it can now reach both `c1` and `c3`.",
              np: "दुई user-defined network (`net-a` र `net-b`) create गर्नुहोस्। तीन container run गर्नुहोस्: `net-a` मा `c1` र `c2`, `net-b` मा `c3`। `c1` ले name नाल `c2` ping गर्न सक्छ तर `c3` ping गर्न सक्दैन verify गर्नुहोस्। त्यसपछि `c2` लाई `net-b` मा connect गर्नुहोस् र अब `c1` र `c3` दुवैमा reach गर्न सक्छ verify गर्नुहोस्।",
              jp: "2 つのユーザー定義ネットワーク（`net-a` と `net-b`）を作成する。3 つのコンテナを実行する：`net-a` に `c1` と `c2`、`net-b` に `c3`。`c1` が名前で `c2` に ping できるが `c3` には ping できないことを確認する。次に `c2` を `net-b` に接続し、`c1` と `c3` の両方に到達できることを確認する。",
            },
            {
              en: "Run an nginx container with `--network host`. Try accessing it on `http://localhost:80` without any `-p` flag. Run `ss -tlnp | grep nginx` on the host to see it listening directly on the host interface — no NAT involved.",
              np: "`--network host` नाल nginx container run गर्नुहोस्। कुनै `-p` flag बिना `http://localhost:80` मा access try गर्नुहोस्। Host मा `ss -tlnp | grep nginx` run गर्नुहोस् directly host interface मा listen गरेको हेर्न — NAT involve छैन।",
              jp: "`--network host` で nginx コンテナを実行する。`-p` フラグなしで `http://localhost:80` にアクセスを試みる。ホストで `ss -tlnp | grep nginx` を実行してホストインターフェースで直接リッスンしていることを確認する — NAT は関係ない。",
            },
            {
              en: "Use `nicolaka/netshoot` to debug a network path. Run it on the same network as a running container and use `dig <container-name>` to see Docker's embedded DNS resolve the name, then `curl` the service to confirm full connectivity.",
              np: "`nicolaka/netshoot` नाल network path debug गर्नुहोस्। Running container नाल same network मा run गर्नुहोस् र Docker को embedded DNS ले name resolve गरेको हेर्न `dig <container-name>` प्रयोग गर्नुहोस्, त्यसपछि full connectivity confirm गर्न service `curl` गर्नुहोस्।",
              jp: "`nicolaka/netshoot` を使用してネットワークパスをデバッグする。実行中のコンテナと同じネットワークで実行し、`dig <container-name>` を使用して Docker の組み込み DNS が名前を解決することを確認し、`curl` でサービスへの完全な接続を確認する。",
            },
            {
              en: "Initialize Docker Swarm on a single node and create an attachable overlay network. Run two containers on the overlay network and verify they can communicate. Use `docker network inspect` to see the overlay's VXLAN configuration.",
              np: "Single node मा Docker Swarm initialize गर्नुहोस् र attachable overlay network create गर्नुहोस्। Overlay network मा दुई container run गर्नुहोस् र communicate गर्न सक्छन् verify गर्नुहोस्। Overlay को VXLAN configuration हेर्न `docker network inspect` प्रयोग गर्नुहोस्।",
              jp: "単一ノードで Docker Swarm を初期化してアタッチ可能なオーバーレイネットワークを作成する。オーバーレイネットワークで 2 つのコンテナを実行して通信できることを確認する。`docker network inspect` を使用してオーバーレイの VXLAN 設定を確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why should I always use user-defined bridge networks instead of the default bridge?",
        np: "किन default bridge भन्दा user-defined bridge network हमेशा प्रयोग गर्नुपर्छ?",
        jp: "デフォルトブリッジの代わりに常にユーザー定義ブリッジネットワークを使用すべきなのはなぜか？",
      },
      answer: {
        en: "Three reasons: (1) DNS — on the default bridge, containers can only reach each other by IP, not by name. On user-defined bridges, Docker's embedded DNS resolves container names automatically — `http://api:3000` just works. (2) Isolation — containers on the default bridge can reach ALL other containers on that bridge. User-defined bridges give you scoped isolation: only containers you explicitly connect share a network. (3) --link is deprecated, fragile, and does not support overlay. User-defined bridges are the current best practice and are what Docker Compose uses automatically.",
        np: "तीन कारण: (1) DNS — default bridge मा, container ले एकअर्कालाई IP नाल मात्र reach गर्न सक्छ, name नाल होइन। User-defined bridge मा, Docker को embedded DNS ले container name automatically resolve गर्छ — `http://api:3000` just works। (2) Isolation — default bridge मा container ले त्यो bridge मा सबै container reach गर्न सक्छ। User-defined bridge ले scoped isolation दिन्छ: explicitly connect गरेका container मात्र network share गर्छ। (3) --link deprecated, fragile, र overlay support गर्दैन। User-defined bridge current best practice हो र Docker Compose ले automatically प्रयोग गर्छ।",
        jp: "3 つの理由：(1) DNS — デフォルトブリッジでは、コンテナは名前ではなく IP でのみ相互に到達できます。ユーザー定義ブリッジでは、Docker の組み込み DNS がコンテナ名を自動的に解決します — `http://api:3000` がそのまま機能します。(2) 隔離 — デフォルトブリッジのコンテナはそのブリッジ上のすべてのコンテナに到達できます。ユーザー定義ブリッジはスコープを限定した隔離を提供します：明示的に接続したコンテナのみがネットワークを共有します。(3) --link は非推奨で不安定でオーバーレイをサポートしません。ユーザー定義ブリッジは現在のベストプラクティスで、Docker Compose が自動的に使用します。",
      },
      tag: { en: "networking", np: "Networking", jp: "ネットワーキング" },
    },
    {
      question: {
        en: "How does Docker's embedded DNS work?",
        np: "Docker को embedded DNS कसरी काम गर्छ?",
        jp: "Docker の組み込み DNS はどのように機能するか？",
      },
      answer: {
        en: "Every container on a user-defined network gets `/etc/resolv.conf` pointing to `127.0.0.11` (Docker's internal DNS server). When a container does `curl http://api`, it resolves `api` against Docker's DNS, which looks up the container named `api` on the shared network and returns its current IP. This means you never need to hardcode IPs — you use service names. When you scale (multiple replicas of `api`), Docker's DNS does round-robin load balancing across all healthy instances automatically.",
        np: "User-defined network मा प्रत्येक container ले `/etc/resolv.conf` पाउँछ जुन `127.0.0.11` (Docker को internal DNS server) point गर्छ। Container ले `curl http://api` गर्दा, Docker को DNS विरुद्ध `api` resolve गर्छ, जसले shared network मा `api` नामको container lookup गर्छ र current IP return गर्छ। यसको मतलब तपाईंले कहिलेपनि IP hardcode गर्नुपर्दैन — service name प्रयोग गर्नुहुन्छ। Scale गर्दा (`api` को multiple replica), Docker को DNS ले automatically सबै healthy instance across round-robin load balancing गर्छ।",
        jp: "ユーザー定義ネットワーク上のすべてのコンテナは `127.0.0.11`（Docker の内部 DNS サーバー）を指す `/etc/resolv.conf` を取得します。コンテナが `curl http://api` を実行すると、Docker の DNS に対して `api` を解決し、共有ネットワーク上の `api` という名前のコンテナを検索して現在の IP を返します。これはIP をハードコードする必要がないことを意味します — サービス名を使用します。スケーリング時（`api` の複数レプリカ）、Docker の DNS は自動的にすべての正常なインスタンスにラウンドロビンロードバランシングを行います。",
      },
      tag: { en: "DNS", np: "DNS", jp: "DNS" },
    },
  ],
};
