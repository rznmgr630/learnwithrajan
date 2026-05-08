import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A **reverse proxy** sits between the internet and your backend servers. Clients connect to the reverse proxy — they never see your backend IPs. The proxy forwards requests to one or more backends and returns the response to the client. This one indirection layer unlocks a remarkable range of capabilities: **load balancing** (distribute requests across multiple backend instances), **TLS termination** (handle HTTPS at the proxy so backends speak plain HTTP), **caching** (serve repeated requests from memory without hitting the backend), **compression** (gzip responses), **rate limiting** (throttle abusive clients), and **request routing** (route `/api` to a Node.js backend and `/static` to an S3 bucket). Nginx, HAProxy, Traefik, and Envoy are the most common reverse proxies.",
    np: "**Reverse proxy** internet र backend server बीचमा बस्छ। Client ले reverse proxy मा connect गर्छ — तिनीहरूले backend IP कहिल्यै देख्दैनन्। Proxy ले request एक वा बढी backend मा forward गर्छ र client लाई response return गर्छ। यो एउटा indirection layer ले remarkable capabilities unlock गर्छ: **load balancing** (multiple backend instance मा request distribute), **TLS termination** (proxy मा HTTPS handle गर्ने ताकि backend ले plain HTTP बोल्न सकोस्), **caching** (backend hit नगरी memory बाट repeated request serve), **compression** (gzip response), **rate limiting** (abusive client throttle), र **request routing** (`/api` Node.js backend मा र `/static` S3 bucket मा route)। Nginx, HAProxy, Traefik, र Envoy सबैभन्दा common reverse proxy हुन्।",
    jp: "**リバースプロキシ**はインターネットとバックエンドサーバーの間に位置します。クライアントはリバースプロキシに接続します — バックエンドの IP を見ることはありません。プロキシはリクエストを 1 つ以上のバックエンドに転送してクライアントにレスポンスを返します。この 1 つの間接レイヤーが注目すべき機能を解放します：**ロードバランシング**（複数のバックエンドインスタンスにリクエストを分散）、**TLS 終端**（プロキシで HTTPS を処理してバックエンドはプレーン HTTP で通信）、**キャッシング**（バックエンドにアクセスせずにメモリから繰り返しリクエストを提供）、**圧縮**（gzip レスポンス）、**レート制限**（乱用クライアントをスロットル）、**リクエストルーティング**（`/api` を Node.js バックエンドに、`/static` を S3 バケットにルーティング）。Nginx・HAProxy・Traefik・Envoy が最も一般的なリバースプロキシです。",
  } as const,
  o2: {
    en: "**Nginx** is the most widely deployed reverse proxy and web server. Its event-driven, non-blocking architecture handles tens of thousands of simultaneous connections with minimal memory. An Nginx config is made of **contexts**: `http` (global HTTP settings), `server` (a virtual host — one per domain/port), and `location` (URL path matching rules). Today you configure Nginx as a reverse proxy in front of a Node.js backend, enable TLS termination, add upstream health checking, and set rate limiting headers. You also compare Nginx with **HAProxy**, which excels at pure TCP/HTTP load balancing at massive scale.",
    np: "**Nginx** सबैभन्दा widely deployed reverse proxy र web server हो। यसको event-driven, non-blocking architecture ले minimal memory सँग tens of thousands of simultaneous connection handle गर्छ। Nginx config **context** बाट बनेको छ: `http` (global HTTP setting), `server` (virtual host — per domain/port एउटा), र `location` (URL path matching rule)। आज तपाईंले Node.js backend को अगाडि reverse proxy को रूपमा Nginx configure गर्नुहुनेछ, TLS termination enable गर्नुहुनेछ, upstream health checking थप्नुहुनेछ, र rate limiting header set गर्नुहुनेछ। साथै massive scale मा pure TCP/HTTP load balancing मा excel गर्ने **HAProxy** सँग Nginx compare गर्नुहुनेछ।",
    jp: "**Nginx** は最も広く展開されているリバースプロキシおよび Web サーバーです。そのイベント駆動の非ブロッキングアーキテクチャは最小限のメモリで数万の同時接続を処理します。Nginx の設定は**コンテキスト**で構成されています：`http`（グローバル HTTP 設定）・`server`（バーチャルホスト — ドメイン/ポートごとに 1 つ）・`location`（URL パスマッチングルール）。今日は Node.js バックエンドの前にリバースプロキシとして Nginx を設定し、TLS 終端を有効にし、アップストリームのヘルスチェックを追加し、レート制限ヘッダーを設定します。また大規模な純粋な TCP/HTTP ロードバランシングで優れた **HAProxy** と Nginx を比較します。",
  } as const,
};

export const DEVOPS_DAY_64_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Reverse proxy architecture — Nginx vs HAProxy vs Traefik",
        np: "Reverse proxy architecture — Nginx vs HAProxy vs Traefik",
        jp: "リバースプロキシアーキテクチャ — Nginx vs HAProxy vs Traefik",
      },
      blocks: [
        { type: "diagram", id: "devops-nginx-proxy" },
        {
          type: "table",
          caption: {
            en: "Reverse proxy feature comparison — Nginx, HAProxy & Traefik",
            np: "Reverse proxy feature comparison — Nginx, HAProxy र Traefik",
            jp: "リバースプロキシ機能比較 — Nginx・HAProxy・Traefik",
          },
          headers: [
            { en: "Feature", np: "Feature", jp: "機能" },
            { en: "Nginx", np: "Nginx", jp: "Nginx" },
            { en: "HAProxy", np: "HAProxy", jp: "HAProxy" },
            { en: "Traefik", np: "Traefik", jp: "Traefik" },
          ],
          rows: [
            [
              { en: "Primary strength", np: "Primary strength", jp: "主な強み" },
              { en: "Web server + reverse proxy + static files", np: "Web server + reverse proxy + static file", jp: "Web サーバー + リバースプロキシ + 静的ファイル" },
              { en: "Pure TCP/HTTP load balancer — extreme throughput", np: "Pure TCP/HTTP load balancer — extreme throughput", jp: "純粋な TCP/HTTP ロードバランサー — 極限のスループット" },
              { en: "Auto-discovers services in Docker/K8s — zero config", np: "Docker/K8s で service auto-discover — zero config", jp: "Docker/K8s でサービスを自動検出 — 設定不要" },
            ],
            [
              { en: "Config reload", np: "Config reload", jp: "設定リロード" },
              { en: "`nginx -s reload` — graceful, zero downtime", np: "`nginx -s reload` — graceful, zero downtime", jp: "`nginx -s reload` — グレースフル・ゼロダウンタイム" },
              { en: "`haproxy -sf` — graceful reload, drops no connections", np: "`haproxy -sf` — graceful reload, connection drop なし", jp: "`haproxy -sf` — グレースフルリロード・接続ドロップなし" },
              { en: "Automatic on config change (watches Docker/K8s API)", np: "Config change で automatic (Docker/K8s API watch)", jp: "設定変更時に自動（Docker/K8s API を監視）" },
            ],
            [
              { en: "TLS termination", np: "TLS termination", jp: "TLS 終端" },
              { en: "Yes — `ssl_certificate` + Let's Encrypt via certbot", np: "Yes — `ssl_certificate` + certbot via Let's Encrypt", jp: "あり — `ssl_certificate` + certbot 経由の Let's Encrypt" },
              { en: "Yes — excellent TLS offloading at scale", np: "Yes — scale मा excellent TLS offloading", jp: "あり — 大規模での優れた TLS オフローディング" },
              { en: "Yes — built-in automatic Let's Encrypt", np: "Yes — built-in automatic Let's Encrypt", jp: "あり — 組み込みの自動 Let's Encrypt" },
            ],
            [
              { en: "Health checks", np: "Health check", jp: "ヘルスチェック" },
              { en: "Passive (detects failed requests) + active with `nginx_upstream_check`", np: "Passive (failed request detect) + `nginx_upstream_check` सँग active", jp: "パッシブ（失敗したリクエストを検出）+ `nginx_upstream_check` でアクティブ" },
              { en: "Active L4/L7 health checks — built-in, fine-grained", np: "Active L4/L7 health check — built-in, fine-grained", jp: "アクティブな L4/L7 ヘルスチェック — 組み込み・きめ細かい" },
              { en: "HTTP health checks via middleware", np: "Middleware मार्फत HTTP health check", jp: "ミドルウェア経由の HTTP ヘルスチェック" },
            ],
            [
              { en: "Use case fit", np: "Use case fit", jp: "ユースケースの適合" },
              { en: "Web apps, API gateways, serving static assets, general reverse proxy", np: "Web app, API gateway, static asset serve, general reverse proxy", jp: "Web アプリ・API ゲートウェイ・静的アセット提供・一般的なリバースプロキシ" },
              { en: "Database proxying, high-throughput TCP LB, mission-critical LB", np: "Database proxying, high-throughput TCP LB, mission-critical LB", jp: "データベースプロキシ・高スループット TCP LB・ミッションクリティカルな LB" },
              { en: "Microservices in Docker/Kubernetes — auto-routing as containers spin up", np: "Docker/Kubernetes microservice — container spin up सँगै auto-routing", jp: "Docker/Kubernetes のマイクロサービス — コンテナ起動時の自動ルーティング" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Nginx reverse proxy configuration",
        np: "Nginx reverse proxy configuration",
        jp: "Nginx リバースプロキシ設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Nginx config — reverse proxy, load balancing, TLS & rate limiting",
            np: "Nginx config — reverse proxy, load balancing, TLS र rate limiting",
            jp: "Nginx 設定 — リバースプロキシ・ロードバランシング・TLS・レート制限",
          },
          code: `# ── Install Nginx ────────────────────────────────────────────────
sudo apt install nginx -y        # Ubuntu/Debian
brew install nginx               # macOS

sudo nginx -t                    # test config syntax
sudo nginx -s reload             # graceful reload (zero downtime)

# ── /etc/nginx/nginx.conf structure ──────────────────────────────
# events { worker_connections 1024; }
# http {
#   upstream backend { ... }     # define backend pool
#   server { ... }               # virtual host
# }

# ── Basic reverse proxy: forward all traffic to a backend ─────────
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    server_name myapp.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;   # backend on port 3000
        proxy_http_version 1.1;

        # Required headers for WebSocket & keep-alive
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";

        # Timeouts
        proxy_connect_timeout  10s;
        proxy_send_timeout     30s;
        proxy_read_timeout     30s;
    }
}

# ── Load balancing across multiple backends ───────────────────────
upstream api_backends {
    least_conn;                              # route to least-busy backend
    # round_robin is default — just list servers without a directive
    # ip_hash;                              # sticky sessions by client IP

    server 10.0.0.1:3000 weight=3;          # gets 3× more traffic
    server 10.0.0.2:3000;
    server 10.0.0.3:3000 backup;            # only used when others are down
    server 10.0.0.4:3000 max_fails=3 fail_timeout=30s;  # passive health check
}

server {
    listen 80;
    server_name api.example.com;

    location /api/ {
        proxy_pass http://api_backends/;    # trailing slash strips /api prefix
    }

    location /health {
        access_log off;
        return 200 "OK\n";
    }
}

# ── TLS termination + HTTP → HTTPS redirect ───────────────────────
server {
    listen 80;
    server_name myapp.example.com;
    return 301 https://$host$request_uri;    # redirect HTTP to HTTPS
}

server {
    listen 443 ssl;
    server_name myapp.example.com;

    ssl_certificate     /etc/letsencrypt/live/myapp.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/myapp.example.com/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;    # disable older TLS versions
    ssl_ciphers         HIGH:!aNULL:!MD5;

    # HSTS — tell browsers to always use HTTPS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    location / {
        proxy_pass http://api_backends;
    }
}

# ── Rate limiting ─────────────────────────────────────────────────
# Define a rate limit zone (in http{} block):
# limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;

server {
    location /api/ {
        limit_req zone=api_limit burst=20 nodelay;
        limit_req_status 429;
        proxy_pass http://api_backends;
    }
}

# ── Useful commands ───────────────────────────────────────────────
sudo nginx -t                              # validate config
sudo nginx -s reload                       # reload (zero downtime)
sudo systemctl status nginx               # service status
tail -f /var/log/nginx/access.log         # live access log
tail -f /var/log/nginx/error.log          # live error log`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Start a simple Node.js or Python HTTP server on port 3000 (`python3 -m http.server 3000`). Configure Nginx as a reverse proxy that forwards all requests to port 3000. Test with `curl http://localhost` — you should get the response from the backend, not Nginx's default page. Check `/var/log/nginx/access.log` and notice the `X-Forwarded-For` header being passed through.",
              np: "Port 3000 मा simple Node.js वा Python HTTP server start गर्नुहोस् (`python3 -m http.server 3000`)। सबै request port 3000 मा forward गर्ने reverse proxy को रूपमा Nginx configure गर्नुहोस्। `curl http://localhost` सँग test गर्नुहोस् — Nginx को default page होइन, backend बाट response पाउनुपर्छ। `/var/log/nginx/access.log` check गर्नुहोस् र `X-Forwarded-For` header pass through भएको notice गर्नुहोस्।",
              jp: "ポート 3000 でシンプルな Node.js または Python HTTP サーバーを起動する（`python3 -m http.server 3000`）。すべてのリクエストをポート 3000 に転送するリバースプロキシとして Nginx を設定する。`curl http://localhost` でテストする — Nginx のデフォルトページではなくバックエンドからのレスポンスが得られるはず。`/var/log/nginx/access.log` を確認して `X-Forwarded-For` ヘッダーが渡されていることに注目する。",
            },
            {
              en: "Configure an `upstream` block with at least two backend processes (start `python3 -m http.server 3000` and `python3 -m http.server 3001`). Use `least_conn` load balancing. Send 10 requests with `for i in {1..10}; do curl http://localhost; done` and check the access log to observe requests being distributed. Then stop one backend and verify Nginx continues serving from the remaining one (passive health check via `max_fails`).",
              np: "कम्तीमा दुईवटा backend process सहित `upstream` block configure गर्नुहोस् (`python3 -m http.server 3000` र `python3 -m http.server 3001` start गर्नुहोस्)। `least_conn` load balancing प्रयोग गर्नुहोस्। `for i in {1..10}; do curl http://localhost; done` सँग 10 request send गर्नुहोस् र access log check गरेर request distribute भएको observe गर्नुहोस्। त्यसपछि एउटा backend stop गर्नुहोस् र Nginx ले remaining बाट serve गर्न continue गर्छ verify गर्नुहोस् (`max_fails` मार्फत passive health check)।",
              jp: "少なくとも 2 つのバックエンドプロセスで `upstream` ブロックを設定する（`python3 -m http.server 3000` と `python3 -m http.server 3001` を起動）。`least_conn` ロードバランシングを使用する。`for i in {1..10}; do curl http://localhost; done` で 10 リクエストを送信してアクセスログを確認してリクエストが分散されていることを観察する。次に 1 つのバックエンドを停止して Nginx が残りからのサービスを続けることを確認する（`max_fails` 経由のパッシブヘルスチェック）。",
            },
            {
              en: "Add a `limit_req_zone` directive and `limit_req` in a location block. Use `ab -n 50 -c 10 http://localhost/` (Apache Bench) or `for i in {1..50}; do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost; done` to send rapid requests. Observe some responses returning HTTP 429. Check `/var/log/nginx/error.log` for the rate limiting messages. This simulates protecting an API from abuse.",
              np: "`limit_req_zone` directive र location block मा `limit_req` add गर्नुहोस्। Rapid request send गर्न `ab -n 50 -c 10 http://localhost/` (Apache Bench) वा `for i in {1..50}; do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost; done` प्रयोग गर्नुहोस्। केही response HTTP 429 return गर्ने observe गर्नुहोस्। Rate limiting message को लागि `/var/log/nginx/error.log` check गर्नुहोस्। यसले API लाई abuse बाट protect गर्ने simulate गर्छ।",
              jp: "`limit_req_zone` ディレクティブと location ブロックに `limit_req` を追加する。`ab -n 50 -c 10 http://localhost/`（Apache Bench）または `for i in {1..50}; do curl -s -o /dev/null -w \"%{http_code}\\n\" http://localhost; done` で高速なリクエストを送信する。いくつかのレスポンスが HTTP 429 を返すことを観察する。`/var/log/nginx/error.log` でレート制限メッセージを確認する。これは API を乱用から保護するシミュレーションです。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a forward proxy and a reverse proxy?",
        np: "Forward proxy र reverse proxy बीचको फरक के हो?",
        jp: "フォワードプロキシとリバースプロキシの違いは何か？",
      },
      answer: {
        en: "The key difference is which side the proxy represents. A **forward proxy** acts on behalf of the **client** — the client sends its request to the proxy, and the proxy makes the request to the internet on the client's behalf. The server sees the proxy's IP, not the client's. Use cases: corporate web filtering (employees' traffic routes through a proxy that blocks certain sites), anonymous browsing (like Tor or a VPN), and caching for branch offices (the proxy caches internet content for the local network). A **reverse proxy** acts on behalf of the **server** — clients connect to the proxy thinking it's the server, and the proxy routes requests to the actual backend. The client sees the proxy's IP. Use cases: load balancing, TLS termination, caching, API gateways. The naming feels backwards: from the client's perspective, a forward proxy is explicit (you configure your browser to use it) while a reverse proxy is invisible (you never know you're talking to a proxy).",
        np: "मुख्य फरक proxy ले कुन side represent गर्छ हो। **Forward proxy** **client** को तर्फबाट काम गर्छ — client ले proxy मा request send गर्छ, र proxy ले client को behalf मा internet मा request गर्छ। Server ले proxy को IP देख्छ, client को होइन। Use case: corporate web filtering (employee को traffic certain site block गर्ने proxy मार्फत route), anonymous browsing (Tor वा VPN जस्तै), र branch office को लागि caching (proxy ले local network को लागि internet content cache गर्छ)। **Reverse proxy** **server** को तर्फबाट काम गर्छ — client ले proxy मा connect गर्छ सोच्दै यो server हो, र proxy ले actual backend मा request route गर्छ। Client ले proxy को IP देख्छ। Use case: load balancing, TLS termination, caching, API gateway। Naming उल्टो लाग्छ: client को perspective बाट, forward proxy explicit हो (browser configure गर्नुहोस्) जबकि reverse proxy invisible हो (proxy सँग कुरा गर्दै छु थाहा हुँदैन)।",
        jp: "重要な違いはプロキシがどちら側を代表するかです。**フォワードプロキシ**は**クライアント**の代わりに機能します — クライアントはリクエストをプロキシに送り、プロキシはクライアントの代わりにインターネットにリクエストします。サーバーはクライアントの IP ではなくプロキシの IP を見ます。ユースケース：企業の Web フィルタリング（従業員のトラフィックが特定のサイトをブロックするプロキシを通じてルーティング）・匿名ブラウジング（Tor や VPN のような）・支社のキャッシング（プロキシがローカルネットワーク用のインターネットコンテンツをキャッシュ）。**リバースプロキシ**は**サーバー**の代わりに機能します — クライアントはサーバーだと思ってプロキシに接続し、プロキシはリクエストを実際のバックエンドにルーティングします。クライアントはプロキシの IP を見ます。ユースケース：ロードバランシング・TLS 終端・キャッシング・API ゲートウェイ。名前は逆に感じます：クライアントの視点から、フォワードプロキシは明示的（ブラウザを設定）でリバースプロキシは不可視です（プロキシと話していることを知らない）。",
      },
      tag: { en: "forward vs reverse", np: "Forward vs Reverse", jp: "フォワード vs リバース" },
    },
    {
      question: {
        en: "What headers should a reverse proxy always set, and why?",
        np: "Reverse proxy ले सधैँ कुन header set गर्नुपर्छ, र किन?",
        jp: "リバースプロキシが常に設定すべきヘッダーは何か、なぜか？",
      },
      answer: {
        en: "Four headers are essential for a reverse proxy to set correctly: (1) **`X-Real-IP`** (`proxy_set_header X-Real-IP $remote_addr`): passes the client's real IP to the backend. Without it, your backend sees the proxy's IP for every request — you can't log real client IPs, implement IP-based rate limiting, or geo-block. (2) **`X-Forwarded-For`** (`$proxy_add_x_forwarded_for`): a comma-separated list of IPs when multiple proxies are chained. The backend reads the leftmost IP as the original client. (3) **`X-Forwarded-Proto`** (`$scheme`): tells the backend whether the original request was HTTP or HTTPS. Without it, your app generates HTTP links in redirect responses even when the client connected via HTTPS — causing mixed-content warnings. (4) **`Host`** (`$host`): preserves the original Host header. Without it, the backend sees the upstream name (e.g., `127.0.0.1:3000`) instead of the public hostname, breaking virtual hosting and cookie domain validation.",
        np: "Reverse proxy ले correctly set गर्न चारवटा header essential छन्: (1) **`X-Real-IP`** (`proxy_set_header X-Real-IP $remote_addr`): client को real IP backend मा pass गर्छ। Without it, backend ले हरेक request को लागि proxy को IP देख्छ — real client IP log गर्न, IP-based rate limiting implement गर्न, वा geo-block गर्न सकिँदैन। (2) **`X-Forwarded-For`** (`$proxy_add_x_forwarded_for`): multiple proxy chain हुँदा comma-separated IP list। Backend ले leftmost IP लाई original client को रूपमा read गर्छ। (3) **`X-Forwarded-Proto`** (`$scheme`): original request HTTP थियो कि HTTPS backend लाई बताउँछ। Without it, client ले HTTPS मार्फत connect गरे पनि app ले redirect response मा HTTP link generate गर्छ — mixed-content warning। (4) **`Host`** (`$host`): original Host header preserve गर्छ। Without it, backend ले public hostname को सट्टा upstream name (जस्तै, `127.0.0.1:3000`) देख्छ, virtual hosting र cookie domain validation break गर्छ।",
        jp: "リバースプロキシが正しく設定すべき 4 つのヘッダーが不可欠です：(1) **`X-Real-IP`**（`proxy_set_header X-Real-IP $remote_addr`）：クライアントの実際の IP をバックエンドに渡します。これがないとバックエンドはすべてのリクエストでプロキシの IP を見ます — 実際のクライアント IP をログに記録したり、IP ベースのレート制限を実装したり、ジオブロックしたりできません。(2) **`X-Forwarded-For`**（`$proxy_add_x_forwarded_for`）：複数のプロキシがチェーンされている場合のカンマ区切りの IP リスト。バックエンドは最左端の IP を元のクライアントとして読み取ります。(3) **`X-Forwarded-Proto`**（`$scheme`）：元のリクエストが HTTP か HTTPS かをバックエンドに伝えます。これがないとクライアントが HTTPS で接続しても、アプリがリダイレクトレスポンスで HTTP リンクを生成し — 混合コンテンツの警告が発生します。(4) **`Host`**（`$host`）：元の Host ヘッダーを保持します。これがないとバックエンドはパブリックホスト名の代わりにアップストリーム名（例：`127.0.0.1:3000`）を見て、バーチャルホスティングと Cookie ドメイン検証が壊れます。",
      },
      tag: { en: "proxy headers", np: "Proxy Header", jp: "プロキシヘッダー" },
    },
  ],
};
