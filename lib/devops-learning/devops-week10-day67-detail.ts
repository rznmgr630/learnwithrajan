import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Load balancing** is the practice of distributing incoming traffic across multiple backend instances so no single server becomes a bottleneck. It directly improves **availability** (if one server dies, others absorb its traffic), **scalability** (add more servers to handle more load), and **throughput** (parallel processing across many instances). The first architectural decision is which OSI layer to balance at. **L4 (transport layer)** load balancing routes based on IP address and TCP/UDP port — the load balancer never inspects the payload. It's extremely fast and works for any protocol (HTTP, MySQL, Redis, custom TCP), but it cannot make routing decisions based on request content. **L7 (application layer)** load balancing inspects the full HTTP request — URL path, `Host` header, cookies, query parameters — and can route `/api/` to one backend pool and `/static/` to another, or send a user to the same server based on a session cookie. L7 is more powerful but adds a small latency penalty because the load balancer must parse the request. HAProxy excels at both: it handles millions of connections per second in L4 mode and provides a rich L7 ACL system for content-based routing. Choosing the right layer is the first decision when selecting a load balancer.",
    np: "**Load balancing** भनेको incoming traffic multiple backend instance मा distribute गर्ने practice हो ताकि कुनै एक server bottleneck नबनोस्। यसले सिधै **availability** (एउटा server मर्यो भने अरूले traffic absorb गर्छन्), **scalability** (बढी load handle गर्न थप server add), र **throughput** (धेरै instance मा parallel processing) improve गर्छ। पहिलो architectural decision कुन OSI layer मा balance गर्ने भन्ने हो। **L4 (transport layer)** load balancing ले IP address र TCP/UDP port को आधारमा route गर्छ — load balancer ले payload कहिल्यै inspect गर्दैन। यो अत्यन्त fast छ र कुनै पनि protocol (HTTP, MySQL, Redis, custom TCP) को लागि काम गर्छ, तर request content को आधारमा routing decision गर्न सक्दैन। **L7 (application layer)** load balancing ले full HTTP request inspect गर्छ — URL path, `Host` header, cookie, query parameter — र `/api/` एउटा backend pool मा र `/static/` अर्कोमा route गर्न सक्छ, वा session cookie को आधारमा user लाई same server मा पठाउन सक्छ। L7 बढी powerful छ तर load balancer ले request parse गर्नुपर्ने भएकाले सानो latency penalty थप्छ। HAProxy दुवैमा excel गर्छ: L4 mode मा per second millions of connection handle गर्छ र content-based routing को लागि rich L7 ACL system provide गर्छ। सही layer छनोट गर्नु load balancer select गर्दाको पहिलो decision हो।",
    jp: "**ロードバランシング**とは、単一のサーバーがボトルネックにならないよう、受信トラフィックを複数のバックエンドインスタンスに分散させる手法です。**可用性**（1 台のサーバーが落ちても他のサーバーがトラフィックを吸収）、**スケーラビリティ**（負荷増加に対応するためにサーバーを追加）、**スループット**（多数のインスタンスでの並列処理）を直接改善します。最初のアーキテクチャ上の決断は、どの OSI レイヤーでバランシングするかです。**L4（トランスポート層）**ロードバランシングは IP アドレスと TCP/UDP ポートに基づいてルーティングします — ロードバランサーはペイロードを一切検査しません。非常に高速で、あらゆるプロトコル（HTTP・MySQL・Redis・カスタム TCP）に対応しますが、リクエストの内容に基づいたルーティング決定はできません。**L7（アプリケーション層）**ロードバランシングは完全な HTTP リクエスト — URL パス・`Host` ヘッダー・Cookie・クエリパラメータ — を検査し、`/api/` を 1 つのバックエンドプールに、`/static/` を別のプールにルーティングしたり、セッション Cookie に基づいてユーザーを同じサーバーに送ることができます。L7 はより強力ですが、ロードバランサーがリクエストを解析する必要があるため、わずかなレイテンシーのペナルティが加わります。HAProxy は両方に優れています：L4 モードで毎秒数百万接続を処理し、コンテンツベースのルーティングのためのリッチな L7 ACL システムを提供します。適切なレイヤーを選択することが、ロードバランサーを選ぶ際の最初の決断です。",
  } as const,
  o2: {
    en: "**HAProxy** (High Availability Proxy) is battle-tested at massive scale — GitHub, Twitter, Reddit, and Stack Overflow have all relied on it in production. Its key strengths are sub-millisecond failover detection, zero-connection-drop graceful reloads (`haproxy -sf`), a built-in real-time stats dashboard, and fine-grained health checks that can verify Redis PING responses, MySQL queries, or arbitrary TCP payloads. Understanding its config structure is essential: the **`global`** section configures process-level settings (log socket, max connections, user/group, CPU affinity). The **`defaults`** section defines shared settings inherited by all frontends and backends (mode, timeouts, logging options). A **`frontend`** listens for incoming connections on a bind address and port, applies ACL rules, and dispatches to a backend. A **`backend`** is a pool of upstream servers with a balancing algorithm, health check options, and per-server settings like weight and maxconn. The **`listen`** block is shorthand that combines a frontend and a single backend into one stanza — convenient for simple use cases. Today you configure HAProxy with multiple balancing algorithms, ACL-based routing, active health checks, and the stats page.",
    np: "**HAProxy** (High Availability Proxy) massive scale मा battle-tested छ — GitHub, Twitter, Reddit, र Stack Overflow सबैले production मा यसमा rely गरेका छन्। यसका मुख्य strengths हुन् sub-millisecond failover detection, zero-connection-drop graceful reload (`haproxy -sf`), built-in real-time stats dashboard, र fine-grained health check जसले Redis PING response, MySQL query, वा arbitrary TCP payload verify गर्न सक्छ। यसको config structure बुझ्नु essential छ: **`global`** section ले process-level setting configure गर्छ (log socket, max connection, user/group, CPU affinity)। **`defaults`** section ले सबै frontend र backend ले inherit गर्ने shared setting define गर्छ (mode, timeout, logging option)। **`frontend`** ले bind address र port मा incoming connection listen गर्छ, ACL rule apply गर्छ, र backend मा dispatch गर्छ। **`backend`** balancing algorithm, health check option, र weight र maxconn जस्ता per-server setting सहित upstream server को pool हो। **`listen`** block frontend र single backend लाई एउटा stanza मा combine गर्ने shorthand हो — simple use case को लागि convenient। आज तपाईंले multiple balancing algorithm, ACL-based routing, active health check, र stats page सहित HAProxy configure गर्नुहुनेछ।",
    jp: "**HAProxy**（High Availability Proxy）は大規模での実績があります — GitHub・Twitter・Reddit・Stack Overflow がすべて本番環境で依存してきました。主な強みはサブミリ秒のフェイルオーバー検出・ゼロ接続ドロップのグレースフルリロード（`haproxy -sf`）・組み込みのリアルタイム統計ダッシュボード・Redis PING レスポンス・MySQL クエリ・任意の TCP ペイロードを検証できる細粒度のヘルスチェックです。設定構造を理解することが不可欠です：**`global`** セクションはプロセスレベルの設定（ログソケット・最大接続数・ユーザー/グループ・CPU アフィニティ）を設定します。**`defaults`** セクションはすべてのフロントエンドとバックエンドが継承する共有設定（モード・タイムアウト・ログオプション）を定義します。**`frontend`** はバインドアドレスとポートで受信接続をリッスンし、ACL ルールを適用してバックエンドにディスパッチします。**`backend`** はバランシングアルゴリズム・ヘルスチェックオプション・weight や maxconn などのサーバーごとの設定を持つアップストリームサーバーのプールです。**`listen`** ブロックはフロントエンドと単一のバックエンドを 1 つのスタンザに組み合わせるショートハンドです — シンプルなユースケースに便利。今日は複数のバランシングアルゴリズム・ACL ベースのルーティング・アクティブヘルスチェック・統計ページで HAProxy を設定します。",
  } as const,
};

export const DEVOPS_DAY_67_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Load balancing algorithms — when to use each",
        np: "Load balancing algorithm — कहिले कुन प्रयोग गर्ने",
        jp: "ロードバランシングアルゴリズム — それぞれの使い時",
      },
      blocks: [
        { type: "diagram", id: "devops-load-balancing" },
        {
          type: "table",
          caption: {
            en: "Load balancing algorithms — behavior, use case & tradeoffs",
            np: "Load balancing algorithm — behavior, use case र tradeoff",
            jp: "ロードバランシングアルゴリズム — 動作・ユースケース・トレードオフ",
          },
          headers: [
            { en: "Algorithm", np: "Algorithm", jp: "アルゴリズム" },
            { en: "How it works", np: "कसरी काम गर्छ", jp: "動作方法" },
            { en: "Best for", np: "कसको लागि उत्तम", jp: "最適な用途" },
            { en: "Limitation", np: "सीमा", jp: "制限" },
          ],
          rows: [
            [
              { en: "Round Robin", np: "Round Robin", jp: "ラウンドロビン" },
              { en: "Each request goes to next server in order", np: "हरेक request क्रमैसँग अर्को server मा जान्छ", jp: "各リクエストが順番に次のサーバーへ" },
              { en: "Homogeneous servers with similar request times", np: "Similar request time भएका homogeneous server", jp: "リクエスト時間が似ている均質なサーバー" },
              { en: "Ignores server load — fast requests finish but slow ones pile up", np: "Server load ignore गर्छ — fast request सकिन्छ तर slow request थुप्रिन्छ", jp: "サーバー負荷を無視する — 速いリクエストは完了するが遅いものが溜まる" },
            ],
            [
              { en: "Least Connections", np: "Least Connections", jp: "最小接続数" },
              { en: "Routes to server with fewest active connections", np: "सबैभन्दा कम active connection भएको server मा route गर्छ", jp: "アクティブ接続数が最も少ないサーバーにルーティング" },
              { en: "Mixed workloads, varying request durations", np: "Mixed workload, varying request duration", jp: "混合ワークロード・さまざまなリクエスト時間" },
              { en: "Requires connection tracking overhead", np: "Connection tracking overhead आवश्यक छ", jp: "接続追跡のオーバーヘッドが必要" },
            ],
            [
              { en: "IP Hash", np: "IP Hash", jp: "IP ハッシュ" },
              { en: "Hash of client IP determines server", np: "Client IP को hash ले server determine गर्छ", jp: "クライアント IP のハッシュがサーバーを決定" },
              { en: "Session affinity without cookies (sticky sessions)", np: "Cookie बिना session affinity (sticky session)", jp: "Cookie なしのセッションアフィニティ（スティッキーセッション）" },
              { en: "Uneven distribution if many clients share an IP (NAT/corporate proxy)", np: "धेरै client ले IP share गर्दा (NAT/corporate proxy) uneven distribution", jp: "多くのクライアントが IP を共有する場合（NAT/企業プロキシ）に分散が偏る" },
            ],
            [
              { en: "Weighted Round Robin", np: "Weighted Round Robin", jp: "重み付きラウンドロビン" },
              { en: "Each server gets proportional share based on weight", np: "हरेक server ले weight को आधारमा proportional share पाउँछ", jp: "各サーバーが重みに基づいた比例配分を受ける" },
              { en: "Heterogeneous servers (different CPU/RAM)", np: "Heterogeneous server (फरक CPU/RAM)", jp: "異種サーバー（異なる CPU/RAM）" },
              { en: "Static weights don't adapt to real-time load", np: "Static weight ले real-time load मा adapt गर्दैन", jp: "静的な重みはリアルタイムの負荷に適応しない" },
            ],
            [
              { en: "Random", np: "Random", jp: "ランダム" },
              { en: "Randomly selects a server", np: "Randomly server select गर्छ", jp: "ランダムにサーバーを選択" },
              { en: "Simple, avoids synchronization overhead", np: "Simple, synchronization overhead avoid गर्छ", jp: "シンプルで同期オーバーヘッドを回避" },
              { en: "Less predictable distribution", np: "कम predictable distribution", jp: "予測しにくい分散" },
            ],
            [
              { en: "Least Time (HAProxy)", np: "Least Time (HAProxy)", jp: "最小時間（HAProxy）" },
              { en: "Routes to server with lowest response time + fewest connections", np: "सबैभन्दा कम response time + fewest connection भएको server मा route गर्छ", jp: "レスポンス時間が最も低く接続数が最も少ないサーバーにルーティング" },
              { en: "Latency-sensitive APIs", np: "Latency-sensitive API", jp: "レイテンシーに敏感な API" },
              { en: "Requires HAProxy Enterprise or equivalent", np: "HAProxy Enterprise वा equivalent आवश्यक छ", jp: "HAProxy Enterprise または同等品が必要" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "HAProxy configuration — frontends, backends & health checks",
        np: "HAProxy configuration — frontend, backend र health check",
        jp: "HAProxy 設定 — フロントエンド・バックエンド・ヘルスチェック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "HAProxy config — L7 HTTP load balancing, health checks, ACLs & stats dashboard",
            np: "HAProxy config — L7 HTTP load balancing, health check, ACL र stats dashboard",
            jp: "HAProxy 設定 — L7 HTTP ロードバランシング・ヘルスチェック・ACL・統計ダッシュボード",
          },
          code: `# ── Install HAProxy ───────────────────────────────────────────────
sudo apt install haproxy -y
haproxy -v                              # check version
haproxy -c -f /etc/haproxy/haproxy.cfg  # validate config syntax

# ── /etc/haproxy/haproxy.cfg ─────────────────────────────────────

# global — process-level settings
global
    log /dev/log local0               # send logs to syslog
    log /dev/log local1 notice
    chroot /var/lib/haproxy           # security: chroot jail
    stats socket /run/haproxy/admin.sock mode 660 level admin expose-fd listeners
    maxconn 50000                     # max simultaneous connections
    user  haproxy
    group haproxy
    daemon                            # run as background daemon

# defaults — shared across all frontends and backends
defaults
    mode    http                      # L7 HTTP mode (use 'tcp' for L4)
    log     global
    option  httplog                   # detailed HTTP logging
    option  dontlognull               # skip logging of health check probes
    option  forwardfor                # add X-Forwarded-For header
    option  http-server-close         # enable keep-alive on client side
    timeout connect  5s               # time to establish connection to backend
    timeout client   30s              # max inactivity time on client side
    timeout server   30s              # max inactivity time on server side
    errorfile 400 /etc/haproxy/errors/400.http
    errorfile 503 /etc/haproxy/errors/503.http

# frontend — listens for incoming connections
frontend http_in
    bind *:80                         # listen on all interfaces, port 80

    # ACL-based routing: inspect URL path
    acl is_api  path_beg /api/        # true if URL starts with /api/
    acl is_web  path_beg /            # catch-all for everything else

    use_backend  api_backend  if is_api
    default_backend web_backend       # fallback for all other requests

# backend — web application servers (round robin)
backend web_backend
    balance roundrobin                # distribute evenly in order

    # Active health check: HAProxy polls /health every 2 seconds
    option httpchk GET /health
    http-check expect status 200

    server web1 10.0.0.1:8001 check weight 1 maxconn 200
    server web2 10.0.0.2:8002 check weight 1 maxconn 200
    # 'check' enables health checking; remove to disable for a server

# backend — API servers (least connections)
backend api_backend
    balance leastconn                 # route to server with fewest active connections

    option httpchk GET /health
    http-check expect status 200

    server api1 10.0.0.3:9001 check weight 2 maxconn 100
    server api2 10.0.0.4:9002 check weight 1 maxconn 100
    # api1 has weight 2 → gets 2× more traffic than api2

# listen — shorthand combining frontend + backend (for simple cases)
listen haproxy_stats
    bind *:8404
    stats enable
    stats uri /haproxy-stats          # access at http://<host>:8404/haproxy-stats
    stats refresh 10s                 # auto-refresh every 10 seconds
    stats auth admin:password         # basic auth (change in production!)
    stats show-legends
    stats show-node

# ── Graceful reload (zero dropped connections) ────────────────────
# HAProxy passes new config to a new process; old process drains connections
sudo haproxy -f /etc/haproxy/haproxy.cfg -sf $(cat /run/haproxy.pid)

# Or via systemd:
sudo systemctl reload haproxy

# ── Log analysis ──────────────────────────────────────────────────
tail -f /var/log/haproxy.log
# HAProxy log format: client_ip:port frontend backend/server
#   Tt/Tc/Tr/Ta — time to first byte / connect / response / total (ms)
#   HTTP status, bytes, termination state (-- = normal, CD = client disconnect)

# Filter by backend:
grep 'api_backend' /var/log/haproxy.log | tail -20

# Count requests per server:
awk '{print $14}' /var/log/haproxy.log | sort | uniq -c | sort -rn`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install HAProxy and configure a basic round-robin backend with two servers. Start two Python HTTP servers: `python3 -m http.server 8001` and `python3 -m http.server 8002` (in separate terminals). Configure HAProxy with a frontend on port 80 and a `web_backend` using `balance roundrobin` pointing to both ports. Add `option httpchk GET /` health checks to each `server` line. Send 20 requests with `for i in {1..20}; do curl -s http://localhost | head -1; done` and observe the round-robin distribution in the responses. Then stop one of the Python servers and verify HAProxy automatically stops routing to it by checking the stats dashboard at `http://localhost:8404/haproxy-stats` — the stopped server should show as `DOWN`.",
              np: "HAProxy install गर्नुहोस् र दुईवटा server सहित basic round-robin backend configure गर्नुहोस्। दुईवटा Python HTTP server start गर्नुहोस्: `python3 -m http.server 8001` र `python3 -m http.server 8002` (छुट्टाछुट्टै terminal मा)। Port 80 मा frontend र `balance roundrobin` प्रयोग गरेर दुवै port point गर्ने `web_backend` सहित HAProxy configure गर्नुहोस्। हरेक `server` line मा `option httpchk GET /` health check add गर्नुहोस्। `for i in {1..20}; do curl -s http://localhost | head -1; done` सँग 20 request send गरेर response मा round-robin distribution observe गर्नुहोस्। त्यसपछि एउटा Python server stop गर्नुहोस् र `http://localhost:8404/haproxy-stats` मा stats dashboard check गरेर HAProxy ले automatically यसमा route गर्न बन्द गर्छ verify गर्नुहोस् — stopped server ले `DOWN` show गर्नुपर्छ।",
              jp: "HAProxy をインストールして 2 台のサーバーで基本的なラウンドロビンバックエンドを設定する。2 つの Python HTTP サーバーを起動する：`python3 -m http.server 8001` と `python3 -m http.server 8002`（別々のターミナルで）。ポート 80 のフロントエンドと両ポートを指す `balance roundrobin` を使った `web_backend` で HAProxy を設定する。各 `server` 行に `option httpchk GET /` ヘルスチェックを追加する。`for i in {1..20}; do curl -s http://localhost | head -1; done` で 20 リクエストを送信してレスポンスでラウンドロビン分散を観察する。次に Python サーバーの 1 つを停止して、`http://localhost:8404/haproxy-stats` の統計ダッシュボードを確認することで HAProxy が自動的にそこへのルーティングを停止することを確認する — 停止したサーバーは `DOWN` と表示されるはず。",
            },
            {
              en: "Configure ACL-based routing: requests with `path_beg /api/` go to an `api_backend`, all other requests go to `web_backend`. Start two separate Python servers to simulate the split (ports 9001 for api_backend and 8001 for web_backend). In the Python server on 9001, serve a simple response that identifies itself as the API server. Verify with `curl http://localhost/api/health` (should reach api_backend) and `curl http://localhost/` (should reach web_backend). Check the stats dashboard to see connection counts per backend and confirm traffic is being split correctly between the two pools.",
              np: "ACL-based routing configure गर्नुहोस्: `path_beg /api/` भएका request `api_backend` मा जान्छन्, अरू सबै request `web_backend` मा जान्छन्। Split simulate गर्न दुईवटा छुट्टाछुट्टै Python server start गर्नुहोस् (api_backend को लागि port 9001 र web_backend को लागि 8001)। 9001 मा Python server ले आफूलाई API server को रूपमा identify गर्ने simple response serve गर्नुपर्छ। `curl http://localhost/api/health` (api_backend reach हुनुपर्छ) र `curl http://localhost/` (web_backend reach हुनुपर्छ) सँग verify गर्नुहोस्। Stats dashboard check गरेर per backend connection count हेर्नुहोस् र traffic दुवै pool बीचमा correctly split भइरहेको confirm गर्नुहोस्।",
              jp: "ACL ベースのルーティングを設定する：`path_beg /api/` のリクエストは `api_backend` へ、他のすべてのリクエストは `web_backend` へ。分割をシミュレートするために 2 つの別々の Python サーバーを起動する（api_backend 用にポート 9001、web_backend 用に 8001）。9001 の Python サーバーは自分自身を API サーバーとして識別するシンプルなレスポンスを提供する。`curl http://localhost/api/health`（api_backend に届くはず）と `curl http://localhost/`（web_backend に届くはず）で確認する。統計ダッシュボードでバックエンドごとの接続数を確認してトラフィックが 2 つのプール間で正しく分割されていることを確認する。",
            },
            {
              en: "Compare load balancing algorithms by simulating uneven response times. Start three backend servers — one responds instantly (port 8001), one with a 100ms delay (`time.sleep(0.1)` in a custom Python HTTP server), one with a 500ms delay. Configure HAProxy with `balance roundrobin` and send 30 concurrent requests with `ab -n 30 -c 10 http://localhost/`. Note the total time reported by `ab`. Then switch to `balance leastconn` in the backend stanza, run `sudo systemctl reload haproxy`, and repeat the same `ab` command. Observe the difference in total throughput — `leastconn` should finish faster because HAProxy stops sending new requests to the 500ms server while it still has active connections, routing more traffic to the fast server.",
              np: "Uneven response time simulate गरेर load balancing algorithm compare गर्नुहोस्। तीनवटा backend server start गर्नुहोस् — एउटा instantly respond गर्छ (port 8001), एउटा 100ms delay सहित (custom Python HTTP server मा `time.sleep(0.1)`), एउटा 500ms delay सहित। `balance roundrobin` सहित HAProxy configure गरेर `ab -n 30 -c 10 http://localhost/` सँग 30 concurrent request send गर्नुहोस्। `ab` ले report गरेको total time note गर्नुहोस्। त्यसपछि backend stanza मा `balance leastconn` मा switch गर्नुहोस्, `sudo systemctl reload haproxy` run गर्नुहोस्, र same `ab` command repeat गर्नुहोस्। Total throughput मा फरक observe गर्नुहोस् — `leastconn` ले छिटो finish गर्नुपर्छ किनभने HAProxy ले 500ms server मा अझै active connection छँदा नयाँ request पठाउन बन्द गर्छ, fast server मा बढी traffic route गर्छ।",
              jp: "不均一なレスポンス時間をシミュレートしてロードバランシングアルゴリズムを比較する。3 つのバックエンドサーバーを起動する — 1 つは即座に応答（ポート 8001）、1 つは 100ms の遅延（カスタム Python HTTP サーバーで `time.sleep(0.1)`）、1 つは 500ms の遅延。`balance roundrobin` で HAProxy を設定して `ab -n 30 -c 10 http://localhost/` で 30 並行リクエストを送信する。`ab` が報告する合計時間を記録する。次にバックエンドスタンザで `balance leastconn` に切り替え、`sudo systemctl reload haproxy` を実行して同じ `ab` コマンドを繰り返す。合計スループットの違いを観察する — `leastconn` はアクティブな接続がまだある間は 500ms サーバーへの新しいリクエストの送信を停止して高速サーバーにより多くのトラフィックをルーティングするため、より速く終了するはずです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should you use HAProxy instead of Nginx for load balancing?",
        np: "Load balancing को लागि Nginx को सट्टा HAProxy कहिले प्रयोग गर्नुपर्छ?",
        jp: "ロードバランシングに Nginx の代わりに HAProxy をいつ使うべきか？",
      },
      answer: {
        en: "Use **HAProxy** when: (1) you need pure **L4 TCP load balancing** for non-HTTP protocols — database connections (PostgreSQL, MySQL), Redis, or raw TCP streams. Nginx's `stream` module exists but HAProxy's TCP mode is more mature and configurable; (2) you need **fine-grained active health checks** — HAProxy can check Redis PING responses, MySQL queries, custom TCP payloads, or HTTP response bodies, not just TCP connectivity; (3) you need **sub-millisecond failover** and zero-dropped-connection reloads — HAProxy's `haproxy -sf` graceful reload passes listening sockets to the new process so in-flight requests finish on the old process; (4) you want the **built-in stats dashboard** for real-time per-server visibility without deploying Prometheus + Grafana. Use **Nginx** when you need: serving static files alongside proxying, HTTP response caching (`proxy_cache`), SSL termination combined with load balancing in a single config, or when you're already running Nginx and the load balancing requirements are straightforward. In **Kubernetes**, both are often replaced by cloud-native load balancers (AWS ALB, GCP Load Balancer) or ingress controllers (ingress-nginx, HAProxy Ingress), but HAProxy and Nginx remain widely used for on-prem and bare-metal deployments where managed cloud LBs aren't available.",
        np: "**HAProxy** प्रयोग गर्नुहोस् जब: (1) तपाईंलाई non-HTTP protocol को लागि pure **L4 TCP load balancing** चाहिन्छ — database connection (PostgreSQL, MySQL), Redis, वा raw TCP stream। Nginx को `stream` module छ तर HAProxy को TCP mode बढी mature र configurable छ; (2) तपाईंलाई **fine-grained active health check** चाहिन्छ — HAProxy ले TCP connectivity मात्र होइन, Redis PING response, MySQL query, custom TCP payload, वा HTTP response body check गर्न सक्छ; (3) तपाईंलाई **sub-millisecond failover** र zero-dropped-connection reload चाहिन्छ — HAProxy को `haproxy -sf` graceful reload ले listening socket नयाँ process मा pass गर्छ ताकि in-flight request पुरानो process मा finish होस्; (4) Prometheus + Grafana deploy नगरी real-time per-server visibility को लागि **built-in stats dashboard** चाहिन्छ। **Nginx** प्रयोग गर्नुहोस् जब तपाईंलाई चाहिन्छ: proxying सँगसँगै static file serve, HTTP response caching (`proxy_cache`), एउटै config मा SSL termination र load balancing, वा Nginx पहिले नै चलाउँदै हुनुहुन्छ र load balancing requirement straightforward छ। **Kubernetes** मा, दुवैलाई प्राय: cloud-native load balancer (AWS ALB, GCP Load Balancer) वा ingress controller (ingress-nginx, HAProxy Ingress) ले replace गर्छ, तर managed cloud LB available नभएको on-prem र bare-metal deployment मा HAProxy र Nginx अझै widely used छन्।",
        jp: "**HAProxy** を使うべき場面：(1) 非 HTTP プロトコルの純粋な **L4 TCP ロードバランシング** が必要な場合 — データベース接続（PostgreSQL・MySQL）・Redis・生の TCP ストリーム。Nginx の `stream` モジュールは存在しますが HAProxy の TCP モードはより成熟していて設定可能；(2) **細粒度のアクティブヘルスチェック**が必要な場合 — HAProxy は TCP 接続性だけでなく Redis PING レスポンス・MySQL クエリ・カスタム TCP ペイロード・HTTP レスポンスボディをチェックできる；(3) **サブミリ秒のフェイルオーバー**とゼロ接続ドロップリロードが必要な場合 — HAProxy の `haproxy -sf` グレースフルリロードはリスニングソケットを新しいプロセスに渡し、処理中のリクエストが古いプロセスで完了する；(4) Prometheus + Grafana をデプロイせずにリアルタイムのサーバーごとの可視性のための**組み込み統計ダッシュボード**が必要な場合。**Nginx** を使うべき場面：プロキシと並行して静的ファイルを提供する、HTTP レスポンスキャッシング（`proxy_cache`）、単一の設定で SSL 終端とロードバランシングを組み合わせる、またはすでに Nginx を実行していてロードバランシング要件が単純な場合。**Kubernetes** では、両方ともクラウドネイティブロードバランサー（AWS ALB・GCP Load Balancer）またはイングレスコントローラー（ingress-nginx・HAProxy Ingress）に置き換えられることが多いですが、マネージドクラウド LB が利用できないオンプレミスおよびベアメタルデプロイメントでは HAProxy と Nginx が広く使われ続けています。",
      },
      tag: {
        en: "HAProxy vs Nginx",
        np: "HAProxy vs Nginx",
        jp: "HAProxy vs Nginx",
      },
    },
    {
      question: {
        en: "What is a sticky session and when is it harmful?",
        np: "Sticky session के हो र यो कहिले harmful हुन्छ?",
        jp: "スティッキーセッションとは何か、いつ有害になるか？",
      },
      answer: {
        en: "A **sticky session** (also called session affinity) ensures a client always routes to the same backend server for the duration of their session — the load balancer remembers the binding and sends every subsequent request from that client to the same server. HAProxy implements this via `balance source` (IP hash) or `cookie SERVERID insert` (cookie-based affinity). Cookie-based is preferred because IP hash breaks when clients sit behind a corporate NAT — many users share one IP, so all of them get pinned to the same server. When are sticky sessions **harmful**? (1) **Uneven load distribution** — if one user generates heavy traffic (a batch job, a large file upload, a long-running API call), that server gets overloaded while others are idle; the load balancer can't rebalance because the session is stuck. (2) **Failure amplification** — when the sticky server goes down, all its sessions fail simultaneously rather than gracefully redistributing to healthy servers; users experience a sudden error storm instead of a seamless failover. (3) **Scaling complexity** — when you add a new server to the pool, it can't immediately absorb traffic because existing sessions are still pinned to old servers; you don't benefit from the new capacity until users' sessions naturally expire. The modern alternative is **stateless architecture**: store session data in a shared external cache (Redis, Memcached, DynamoDB) so any backend instance can serve any user's request without needing to know which server they talked to before. This makes your application fully horizontally scalable and eliminates all three sticky session problems at once.",
        np: "**Sticky session** (session affinity पनि भनिन्छ) ले client लाई session को duration मा सधैँ same backend server मा route गर्न ensure गर्छ — load balancer ले binding remember गर्छ र त्यस client का सबै subsequent request same server मा पठाउँछ। HAProxy ले यो `balance source` (IP hash) वा `cookie SERVERID insert` (cookie-based affinity) मार्फत implement गर्छ। Cookie-based preferred हो किनभने IP hash ले corporate NAT पछाडि बसेका client मा break गर्छ — धेरै user ले एउटै IP share गर्छन्, त्यसैले सबैलाई same server मा pin गरिन्छ। Sticky session **harmful** कहिले हुन्छ? (1) **Uneven load distribution** — एउटा user ले heavy traffic generate गर्यो (batch job, large file upload, long-running API call) भने त्यो server overload हुन्छ जबकि अरू idle हुन्छन्; session stuck भएकाले load balancer ले rebalance गर्न सक्दैन। (2) **Failure amplification** — sticky server down हुँदा, healthy server मा gracefully redistribute हुनुको सट्टा सबै session एकसाथ fail हुन्छन्; user ले seamless failover को सट्टा sudden error storm experience गर्छन्। (3) **Scaling complexity** — pool मा नयाँ server add गर्दा, existing session अझै पुरानो server मा pinned भएकाले यसले immediately traffic absorb गर्न सक्दैन; user को session naturally expire नभएसम्म नयाँ capacity बाट benefit पाउँदैनौं। Modern alternative **stateless architecture** हो: session data shared external cache (Redis, Memcached, DynamoDB) मा store गर्नुहोस् ताकि कुनै पनि backend instance ले कुनै पनि user को request serve गर्न सकोस् — अघि कुन server सँग कुरा गरे जान्न पर्दैन। यसले तपाईंको application लाई fully horizontally scalable बनाउँछ र तीनवटै sticky session problem एकैपटक eliminate गर्छ।",
        jp: "**スティッキーセッション**（セッションアフィニティとも呼ばれる）は、クライアントがセッション期間中常に同じバックエンドサーバーにルーティングされることを保証します — ロードバランサーはバインディングを記憶してそのクライアントからの後続のすべてのリクエストを同じサーバーに送ります。HAProxy はこれを `balance source`（IP ハッシュ）または `cookie SERVERID insert`（Cookie ベースのアフィニティ）で実装します。Cookie ベースが好まれます。なぜなら IP ハッシュは企業の NAT の背後にいるクライアントで壊れるからです — 多くのユーザーが 1 つの IP を共有するため、全員が同じサーバーに固定されます。スティッキーセッションが**有害**になる場合は？(1) **不均一な負荷分散** — 1 人のユーザーが大量のトラフィックを生成した場合（バッチジョブ・大きなファイルアップロード・長時間実行の API 呼び出し）、セッションが固定されているためロードバランサーが再分散できず、そのサーバーが過負荷になり他はアイドル状態になる；(2) **障害の増幅** — スティッキーサーバーが落ちると、健全なサーバーへの優雅な再分散の代わりにすべてのセッションが同時に失敗します；ユーザーはシームレスなフェイルオーバーの代わりに突然のエラーの嵐を経験します；(3) **スケーリングの複雑さ** — プールに新しいサーバーを追加しても既存のセッションがまだ古いサーバーに固定されているため即座にトラフィックを吸収できない；ユーザーのセッションが自然に期限切れになるまで新しい容量の恩恵を受けられない。現代的な代替手段は**ステートレスアーキテクチャ**です：セッションデータを共有外部キャッシュ（Redis・Memcached・DynamoDB）に保存して、どのバックエンドインスタンスも以前どのサーバーと話したかを知らなくてもどのユーザーのリクエストも処理できるようにします。これによりアプリケーションは完全に水平スケーラブルになり、3 つのスティッキーセッション問題をすべて一度に解消します。",
      },
      tag: {
        en: "sticky sessions",
        np: "Sticky Session",
        jp: "スティッキーセッション",
      },
    },
  ],
};
