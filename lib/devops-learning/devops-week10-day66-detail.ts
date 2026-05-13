import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Nginx** runs a **master process** that reads config and manages **worker processes** (typically one per CPU core, set with `worker_processes auto`). All actual request handling happens in the workers using an **event-driven, non-blocking** model — a single worker can handle thousands of simultaneous connections without spawning threads. The config file hierarchy flows from **main** context (global settings like `user`, `worker_processes`) → **events** context (`worker_connections`) → **http** context (compression, logging, MIME types) → **server** context (a virtual host) → **location** context (URL-level rules). **Virtual hosting** lets you serve multiple domains from one Nginx process by placing multiple `server` blocks in the `http` context. Nginx picks the right block by matching the `Host` header against each block's `server_name`. Static files are served by setting `root /var/www/html` (appends URI to the root path) or `alias /data/files/` (replaces the location prefix). The `index` directive names the default file to serve for directory requests.",
    np: "**Nginx** ले **master process** run गर्छ जसले config read गर्छ र **worker process** (सामान्यतया CPU core प्रति एउटा, `worker_processes auto` सँग set) manage गर्छ। सबै actual request handling **event-driven, non-blocking** model प्रयोग गरेर worker मा हुन्छ — एउटा worker ले thread spawn नगरी हजारौं simultaneous connection handle गर्न सक्छ। Config file hierarchy **main** context (global setting जस्तै `user`, `worker_processes`) → **events** context (`worker_connections`) → **http** context (compression, logging, MIME type) → **server** context (virtual host) → **location** context (URL-level rule) को क्रममा जान्छ। **Virtual hosting** ले `http` context मा multiple `server` block राखेर एउटै Nginx process बाट multiple domain serve गर्न दिन्छ। Nginx ले प्रत्येक block को `server_name` विरुद्ध `Host` header match गरेर सही block छनोट गर्छ। Static file `root /var/www/html` (URI लाई root path मा append) वा `alias /data/files/` (location prefix replace) set गरेर serve हुन्छ। `index` directive ले directory request को लागि serve गर्ने default file नाम दिन्छ।",
    jp: "**Nginx** は設定を読み取り **ワーカープロセス**（通常 CPU コアごとに 1 つ、`worker_processes auto` で設定）を管理する **マスタープロセス**を実行します。すべての実際のリクエスト処理は**イベント駆動・ノンブロッキング**モデルを使用してワーカーで行われます — 単一のワーカーがスレッドを生成せずに何千もの同時接続を処理できます。設定ファイルの階層は **main** コンテキスト（`user`・`worker_processes` などのグローバル設定）→ **events** コンテキスト（`worker_connections`）→ **http** コンテキスト（圧縮・ログ・MIME タイプ）→ **server** コンテキスト（バーチャルホスト）→ **location** コンテキスト（URL レベルのルール）と流れます。**バーチャルホスティング**は `http` コンテキストに複数の `server` ブロックを置くことで 1 つの Nginx プロセスから複数のドメインを提供できます。Nginx は各ブロックの `server_name` に対して `Host` ヘッダーを照合して適切なブロックを選択します。静的ファイルは `root /var/www/html`（URI をルートパスに追加）または `alias /data/files/`（ロケーションプレフィックスを置換）を設定して提供されます。`index` ディレクティブはディレクトリリクエストのデフォルトファイル名を指定します。",
  } as const,
  o2: {
    en: "Nginx acts as both a **web server** (serving files directly) and a **reverse proxy** (`proxy_pass`) in the same process — you can mix static serving and proxying within a single `server` block. **`location` block matching** follows a strict priority order: (1) **exact match** `location = /path` — highest priority, stops search immediately; (2) **preferential prefix** `location ^~ /prefix` — matches prefix and stops regex search; (3) **case-sensitive regex** `location ~ \\.php$` and **case-insensitive regex** `location ~* \\.(jpg|png)$` — evaluated in order, first match wins (tied priority); (4) **longest prefix** `location /prefix` — fallback, lowest priority. The `try_files` directive is essential for **SPA routing**: `try_files $uri $uri/ /index.html` tells Nginx to check if the URI exists as a file, then as a directory, and if neither exists, fall back to `index.html` — so React/Vue/Angular routes like `/dashboard` are handled client-side. Performance directives: `worker_processes auto` (match CPU count), `worker_connections 1024` (max simultaneous connections per worker), `keepalive_timeout 65` (reuse TCP connections), `gzip on` with `gzip_types` (compress responses), and `open_file_cache max=1000` (cache file descriptors to avoid repeated `open()` syscalls).",
    np: "Nginx ले एउटै process मा **web server** (file directly serve) र **reverse proxy** (`proxy_pass`) दुवैको भूमिका निभाउँछ — एउटै `server` block भित्र static serving र proxying mix गर्न सकिन्छ। **`location` block matching** ले strict priority order follow गर्छ: (1) **exact match** `location = /path` — highest priority, immediately search stop; (2) **preferential prefix** `location ^~ /prefix` — prefix match गर्छ र regex search stop; (3) **case-sensitive regex** `location ~ \\.php$` र **case-insensitive regex** `location ~* \\.(jpg|png)$` — order मा evaluate, first match wins (tied priority); (4) **longest prefix** `location /prefix` — fallback, lowest priority। `try_files` directive **SPA routing** को लागि essential छ: `try_files $uri $uri/ /index.html` ले Nginx लाई URI file को रूपमा छ कि check गर्न, त्यसपछि directory को रूपमा, र दुवै छैन भने `index.html` मा fall back गर्न भन्छ — त्यसैले `/dashboard` जस्ता React/Vue/Angular route client-side handle हुन्छ। Performance directive: `worker_processes auto` (CPU count match), `worker_connections 1024` (worker per max simultaneous connection), `keepalive_timeout 65` (TCP connection reuse), `gzip on` with `gzip_types` (response compress), र `open_file_cache max=1000` (repeated `open()` syscall avoid गर्न file descriptor cache)।",
    jp: "Nginx は同一プロセス内で**ウェブサーバー**（ファイルを直接提供）と**リバースプロキシ**（`proxy_pass`）の両方として機能します — 単一の `server` ブロック内で静的提供とプロキシングを混在できます。**`location` ブロックマッチング**は厳格な優先順位に従います：(1) **完全一致** `location = /path` — 最高優先度・すぐに検索を停止；(2) **優先プレフィックス** `location ^~ /prefix` — プレフィックスに一致してリGEX 検索を停止；(3) **大文字小文字区別 regex** `location ~ \\.php$` と**大文字小文字無視 regex** `location ~* \\.(jpg|png)$` — 順番に評価・最初の一致が勝つ（同点優先度）；(4) **最長プレフィックス** `location /prefix` — フォールバック・最低優先度。`try_files` ディレクティブは **SPA ルーティング**に不可欠です：`try_files $uri $uri/ /index.html` は URI がファイルとして存在するか確認し、次にディレクトリとして確認し、どちらも存在しない場合 `index.html` にフォールバックするよう Nginx に指示します — これにより `/dashboard` のような React/Vue/Angular ルートがクライアントサイドで処理されます。パフォーマンスディレクティブ：`worker_processes auto`（CPU 数に一致）・`worker_connections 1024`（ワーカーあたりの最大同時接続）・`keepalive_timeout 65`（TCP 接続を再利用）・`gzip on` と `gzip_types`（レスポンスを圧縮）・`open_file_cache max=1000`（繰り返しの `open()` システムコールを避けるためにファイルディスクリプタをキャッシュ）。",
  } as const,
};

export const DEVOPS_DAY_66_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Nginx configuration — contexts, directives & virtual hosting",
        np: "Nginx configuration — context, directive र virtual hosting",
        jp: "Nginx 設定 — コンテキスト・ディレクティブ・バーチャルホスティング",
      },
      blocks: [
        { type: "diagram", id: "devops-nginx-config" },
        {
          type: "table",
          caption: {
            en: "Nginx location block matching rules — priority & syntax",
            np: "Nginx location block matching rule — priority र syntax",
            jp: "Nginx location ブロックマッチングルール — 優先度と構文",
          },
          headers: [
            { en: "Modifier", np: "Modifier", jp: "修飾子" },
            { en: "Pattern", np: "Pattern", jp: "パターン" },
            { en: "Priority", np: "Priority", jp: "優先度" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
          ],
          rows: [
            [
              { en: "`= /exact`", np: "`= /exact`", jp: "`= /exact`" },
              { en: "Exact match", np: "Exact match", jp: "完全一致" },
              { en: "Highest", np: "सबैभन्दा उच्च", jp: "最高" },
              { en: "Landing pages, health endpoints", np: "Landing page, health endpoint", jp: "ランディングページ・ヘルスエンドポイント" },
            ],
            [
              { en: "`^~ /prefix`", np: "`^~ /prefix`", jp: "`^~ /prefix`" },
              { en: "Prefix (stops regex search)", np: "Prefix (regex search stop गर्छ)", jp: "プレフィックス（regex 検索を停止）" },
              { en: "2nd", np: "दोस्रो", jp: "2 番目" },
              { en: "Static asset directories", np: "Static asset directory", jp: "静的アセットディレクトリ" },
            ],
            [
              { en: "`~ \\.php$`", np: "`~ \\.php$`", jp: "`~ \\.php$`" },
              { en: "Case-sensitive regex", np: "Case-sensitive regex", jp: "大文字小文字区別 regex" },
              { en: "3rd", np: "तेस्रो", jp: "3 番目" },
              { en: "PHP processing", np: "PHP processing", jp: "PHP 処理" },
            ],
            [
              { en: "`~* \\.(jpg|png)$`", np: "`~* \\.(jpg|png)$`", jp: "`~* \\.(jpg|png)$`" },
              { en: "Case-insensitive regex", np: "Case-insensitive regex", jp: "大文字小文字無視 regex" },
              { en: "3rd (tied)", np: "तेस्रो (tied)", jp: "3 番目（同点）" },
              { en: "Image files", np: "Image file", jp: "画像ファイル" },
            ],
            [
              { en: "`/prefix`", np: "`/prefix`", jp: "`/prefix`" },
              { en: "Longest prefix match", np: "Longest prefix match", jp: "最長プレフィックス一致" },
              { en: "Lowest", np: "सबैभन्दा न्यून", jp: "最低" },
              { en: "General catch-all routes", np: "General catch-all route", jp: "一般的なキャッチオールルート" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Nginx as web server & performance tuning",
        np: "Nginx web server को रूपमा र performance tuning",
        jp: "Web サーバーとしての Nginx とパフォーマンスチューニング",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Nginx virtual hosting, static serving, SPA routing & performance tuning",
            np: "Nginx virtual hosting, static serving, SPA routing र performance tuning",
            jp: "Nginx バーチャルホスティング・静的ファイル提供・SPA ルーティング・パフォーマンスチューニング",
          },
          code: `# ── Install Nginx ────────────────────────────────────────────────
sudo apt install nginx -y        # Ubuntu/Debian
brew install nginx               # macOS

sudo nginx -t                    # test config syntax
sudo nginx -s reload             # graceful reload (zero downtime)
sudo systemctl enable --now nginx

# ── /etc/nginx/nginx.conf — main structure ────────────────────────
# user www-data;
# worker_processes auto;          # one worker per CPU core
#
# events {
#   worker_connections 1024;      # max simultaneous connections per worker
#   # multi_accept on;            # accept all new connections at once
# }
#
# http {
#   keepalive_timeout 65;         # reuse TCP connections for 65s
#   gzip on;
#   gzip_types text/plain text/css application/json application/javascript
#              text/xml application/xml image/svg+xml;
#   gzip_min_length 1024;         # don't compress tiny responses
#
#   open_file_cache max=1000 inactive=20s;   # cache file descriptors
#   open_file_cache_valid 30s;
#   open_file_cache_min_uses 2;
#
#   include /etc/nginx/sites-enabled/*;
# }

# ── Virtual host 1: static site ──────────────────────────────────
# /etc/nginx/sites-available/site1
server {
    listen 80;
    server_name site1.local www.site1.local;

    root  /var/www/site1;
    index index.html;

    # Serve static files; 404 if not found
    location / {
        try_files $uri $uri/ =404;
    }

    # Long-lived cache for hashed assets (JS/CSS/images)
    location ~* \.(js|css|png|jpg|gif|ico|woff2|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }

    # Gzip already enabled globally; add types per-site if needed
    gzip_types text/html application/json;
}

# ── Virtual host 2: Node.js app (reverse proxy + SPA routing) ────
# /etc/nginx/sites-available/site2
upstream node_app {
    least_conn;
    server 127.0.0.1:3000;
    server 127.0.0.1:3001 backup;
}

server {
    listen 80;
    server_name site2.local www.site2.local;

    root /var/www/site2/dist;    # built SPA files

    # SPA routing: serve index.html for all unknown paths
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API traffic goes to Node.js backend
    location /api/ {
        proxy_pass         http://node_app/;   # trailing slash strips /api prefix
        proxy_http_version 1.1;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
        proxy_set_header   Upgrade           $http_upgrade;
        proxy_set_header   Connection        "upgrade";
        proxy_connect_timeout 10s;
        proxy_read_timeout    30s;
    }

    # Named location for error pages
    error_page 404 /404.html;
    location = /404.html {
        internal;
    }

    error_page 500 502 503 504 @fallback;
    location @fallback {
        return 503 "Service temporarily unavailable\n";
    }
}

# ── URL rewrite: redirect /old-path → /new-path (301) ────────────
server {
    listen 80;
    server_name myapp.example.com;

    # Permanent redirect — preserves query string
    location = /old-path {
        return 301 /new-path$is_args$args;
    }

    # Regex rewrite: /blog/123-slug → /posts/123
    rewrite ^/blog/(\d+)-.*$ /posts/$1 permanent;

    location / {
        proxy_pass http://node_app;
    }
}

# ── Useful commands ───────────────────────────────────────────────
sudo nginx -t                              # validate config syntax
sudo nginx -s reload                       # graceful reload (no downtime)
sudo nginx -s stop                         # fast shutdown
sudo systemctl status nginx                # service status
tail -f /var/log/nginx/access.log          # live access log
tail -f /var/log/nginx/error.log           # live error log
nginx -V 2>&1 | grep "configure"           # show compile-time options`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create two virtual hosts (`server` blocks) on ports 8080 and 8081. Serve different static HTML from each — e.g., `echo '<h1>Site A</h1>' > /var/www/siteA/index.html`. Verify with `curl http://localhost:8080` and `curl http://localhost:8081` that the correct content is returned for each port. Then merge them onto port 80 using `server_name` — `site1.local` and `site2.local`. Add entries to `/etc/hosts` (`127.0.0.1 site1.local site2.local`) and confirm each hostname returns the correct content with `curl -H 'Host: site1.local' http://localhost` and `curl -H 'Host: site2.local' http://localhost`.",
              np: "Port 8080 र 8081 मा दुईवटा virtual host (`server` block) create गर्नुहोस्। हरेकबाट different static HTML serve गर्नुहोस् — जस्तै `echo '<h1>Site A</h1>' > /var/www/siteA/index.html`। `curl http://localhost:8080` र `curl http://localhost:8081` सँग verify गर्नुहोस् कि हरेक port को लागि correct content return हुन्छ। त्यसपछि `server_name` — `site1.local` र `site2.local` प्रयोग गरेर ती port 80 मा merge गर्नुहोस्। `/etc/hosts` मा entries (`127.0.0.1 site1.local site2.local`) add गर्नुहोस् र `curl -H 'Host: site1.local' http://localhost` र `curl -H 'Host: site2.local' http://localhost` सँग हरेक hostname ले correct content return गर्छ confirm गर्नुहोस्।",
              jp: "ポート 8080 と 8081 に 2 つのバーチャルホスト（`server` ブロック）を作成する。それぞれから異なる静的 HTML を提供する — 例：`echo '<h1>Site A</h1>' > /var/www/siteA/index.html`。`curl http://localhost:8080` と `curl http://localhost:8081` で各ポートの正しいコンテンツが返されることを確認する。次に `server_name` — `site1.local` と `site2.local` を使ってポート 80 にマージする。`/etc/hosts` にエントリ（`127.0.0.1 site1.local site2.local`）を追加し、`curl -H 'Host: site1.local' http://localhost` と `curl -H 'Host: site2.local' http://localhost` で各ホスト名が正しいコンテンツを返すことを確認する。",
            },
            {
              en: "Configure a `location /` block that serves an `index.html` with `try_files $uri $uri/ /index.html` (SPA routing). Simulate navigating to `/about` or `/dashboard` — Nginx should serve `index.html` for all unknown paths (not 404). Use `curl http://localhost/about` and `curl http://localhost/dashboard` to confirm both return 200 with the SPA content. Then add a separate `location /api/` block that proxies to a backend on port 3000 (`python3 -m http.server 3000`). Confirm `curl http://localhost/api/health` goes to the backend while `curl http://localhost/dashboard` still serves the SPA.",
              np: "`try_files $uri $uri/ /index.html` (SPA routing) सहित `index.html` serve गर्ने `location /` block configure गर्नुहोस्। `/about` वा `/dashboard` navigate गर्ने simulate गर्नुहोस् — Nginx ले सबै unknown path को लागि `index.html` serve गर्नुपर्छ (404 होइन)। `curl http://localhost/about` र `curl http://localhost/dashboard` प्रयोग गरेर दुवैले SPA content सँग 200 return गर्छ confirm गर्नुहोस्। त्यसपछि port 3000 मा backend (`python3 -m http.server 3000`) मा proxy गर्ने छुट्टै `location /api/` block add गर्नुहोस्। `curl http://localhost/api/health` ले backend मा जान्छ जबकि `curl http://localhost/dashboard` ले SPA serve गर्न continue गर्छ confirm गर्नुहोस्।",
              jp: "`try_files $uri $uri/ /index.html`（SPA ルーティング）で `index.html` を提供する `location /` ブロックを設定する。`/about` または `/dashboard` へのナビゲーションをシミュレートする — Nginx はすべての不明なパスに `index.html` を提供すべき（404 ではなく）。`curl http://localhost/about` と `curl http://localhost/dashboard` で両方が SPA コンテンツで 200 を返すことを確認する。次にポート 3000 のバックエンド（`python3 -m http.server 3000`）にプロキシする別の `location /api/` ブロックを追加する。`curl http://localhost/api/health` がバックエンドに行き、`curl http://localhost/dashboard` がまだ SPA を提供することを確認する。",
            },
            {
              en: "Enable gzip compression and measure the difference. Serve a large JSON file (>10 KB) as a static file at `/data.json`. Use `curl -H 'Accept-Encoding: gzip' -I http://localhost/data.json` and compare the `Content-Length` with and without `gzip on` in the config. With gzip enabled the response should be significantly smaller. Add `open_file_cache max=1000 inactive=20s` and `open_file_cache_valid 30s` to the `http` block, then run `ab -n 1000 -c 10 http://localhost/data.json` (Apache Bench) and compare requests-per-second before and after the cache directive — the cached file-descriptor lookups produce a measurable throughput improvement.",
              np: "Gzip compression enable गर्नुहोस् र फरक measure गर्नुहोस्। `/data.json` मा static file को रूपमा large JSON file (>10 KB) serve गर्नुहोस्। `curl -H 'Accept-Encoding: gzip' -I http://localhost/data.json` प्रयोग गर्नुहोस् र config मा `gzip on` सहित र बिना `Content-Length` compare गर्नुहोस्। Gzip enable भएमा response significantly smaller हुनुपर्छ। `http` block मा `open_file_cache max=1000 inactive=20s` र `open_file_cache_valid 30s` add गर्नुहोस्, त्यसपछि `ab -n 1000 -c 10 http://localhost/data.json` (Apache Bench) run गर्नुहोस् र cache directive अघि र पछि requests-per-second compare गर्नुहोस् — cached file-descriptor lookup ले measurable throughput improvement produce गर्छ।",
              jp: "gzip 圧縮を有効にして差を測定する。`/data.json` に大きな JSON ファイル（10 KB 超）を静的ファイルとして提供する。`curl -H 'Accept-Encoding: gzip' -I http://localhost/data.json` を使用して設定の `gzip on` ありとなしで `Content-Length` を比較する。gzip が有効な場合レスポンスは大幅に小さくなるはず。`http` ブロックに `open_file_cache max=1000 inactive=20s` と `open_file_cache_valid 30s` を追加し、`ab -n 1000 -c 10 http://localhost/data.json`（Apache Bench）を実行してキャッシュディレクティブの前後の requests-per-second を比較する — キャッシュされたファイルディスクリプタルックアップが測定可能なスループット改善をもたらします。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How does Nginx decide which server block handles a request?",
        np: "Nginx ले request कुन server block ले handle गर्छ कसरी decide गर्छ?",
        jp: "Nginx はどの server ブロックがリクエストを処理するかをどう決めるか？",
      },
      answer: {
        en: "Nginx uses a two-step process. First it matches the incoming connection's IP and port to find all `server` blocks that `listen` on that address. Then it matches the request's `Host` header against the `server_name` of those candidates in priority order: (1) **exact match** — `server_name example.com` matches `Host: example.com` exactly; (2) **leading wildcard** — `server_name *.example.com` matches `api.example.com`; (3) **trailing wildcard** — `server_name example.*` matches `example.org`; (4) **regex** — `server_name ~^(www\\.)?example\\.com$`; (5) **default_server** — if no `server_name` matches, Nginx falls back to the block marked `listen 80 default_server`, or the first block in the config if none is marked. If an unknown `Host` header arrives (e.g., a direct-IP request with no `Host`), it lands on the `default_server`. Best practice: always define an explicit `default_server` that returns `444` (Nginx-specific: drops the connection silently) or `403` to block direct-IP probing that bypasses your intended virtual hosts. Using `server_name _;` (underscore is an invalid hostname — it never accidentally matches a real domain) is a common idiom for a catch-all block.",
        np: "Nginx ले दुई-चरण process प्रयोग गर्छ। पहिले यसले incoming connection को IP र port match गरेर त्यो address मा `listen` गर्ने सबै `server` block find गर्छ। त्यसपछि priority order मा ती candidate को `server_name` विरुद्ध request को `Host` header match गर्छ: (1) **exact match** — `server_name example.com` ले `Host: example.com` exactly match; (2) **leading wildcard** — `server_name *.example.com` ले `api.example.com` match; (3) **trailing wildcard** — `server_name example.*` ले `example.org` match; (4) **regex** — `server_name ~^(www\\.)?example\\.com$`; (5) **default_server** — कुनै `server_name` match भएन भने, Nginx ले `listen 80 default_server` marked block मा fall back गर्छ, वा कुनै marked नभए config मा पहिलो block। Unknown `Host` header (जस्तै, `Host` बिना direct-IP request) आयो भने `default_server` मा land गर्छ। Best practice: direct-IP probing block गर्न explicit `default_server` define गर्नुहोस् जसले `444` (Nginx-specific: silently connection drop) वा `403` return गर्छ। `server_name _;` (underscore invalid hostname — कहिल्यै real domain match गर्दैन) catch-all block को लागि common idiom हो।",
        jp: "Nginx は 2 段階のプロセスを使用します。まず受信接続の IP とポートを照合してそのアドレスで `listen` しているすべての `server` ブロックを見つけます。次にそれらの候補の `server_name` に対してリクエストの `Host` ヘッダーを優先順位で照合します：(1) **完全一致** — `server_name example.com` が `Host: example.com` に完全一致；(2) **先頭ワイルドカード** — `server_name *.example.com` が `api.example.com` に一致；(3) **末尾ワイルドカード** — `server_name example.*` が `example.org` に一致；(4) **regex** — `server_name ~^(www\\.)?example\\.com$`；(5) **default_server** — どの `server_name` も一致しない場合、Nginx は `listen 80 default_server` とマークされたブロックにフォールバックし、マークがなければ設定の最初のブロック。不明な `Host` ヘッダー（例：`Host` なしの直接 IP リクエスト）が届いた場合は `default_server` に着地します。ベストプラクティス：意図したバーチャルホストをバイパスする直接 IP プロービングをブロックするため `444`（Nginx 固有：接続をサイレントにドロップ）または `403` を返す明示的な `default_server` を常に定義する。`server_name _;`（アンダースコアは無効なホスト名 — 実際のドメインに偶然一致しない）はキャッチオールブロックの一般的なイディオムです。",
      },
      tag: {
        en: "server_name matching",
        np: "server_name matching",
        jp: "server_name マッチング",
      },
    },
    {
      question: {
        en: "What is the difference between `root` and `alias` in Nginx?",
        np: "Nginx मा `root` र `alias` बीचको फरक के हो?",
        jp: "Nginx の `root` と `alias` の違いは何か？",
      },
      answer: {
        en: "`root` **appends** the full request URI to the root path. Example: `root /var/www; location /images/` — a request for `/images/photo.jpg` maps to `/var/www/images/photo.jpg`. The `/images/` part of the URI is kept. `alias` **replaces** the location prefix with the alias path. Example: `alias /data/images/; location /images/` — a request for `/images/photo.jpg` maps to `/data/images/photo.jpg` (the `/images/` prefix is stripped from the URI). The key footgun with `alias`: both the `location` path and the `alias` path must end with a trailing slash — `location /images/` + `alias /data/images/` (both with slash). Missing or mismatching trailing slashes causes subtle path concatenation bugs where Nginx looks for `/data/imagesphoto.jpg` instead of `/data/images/photo.jpg`. Rule of thumb: use `root` when the URL path maps directly to your directory structure (most common case). Use `alias` when the URL path doesn't match your filesystem layout — for example, serving `/static/` from a completely different directory like `/opt/app/public/`.",
        np: "`root` ले full request URI लाई root path मा **append** गर्छ। Example: `root /var/www; location /images/` — `/images/photo.jpg` को request `/var/www/images/photo.jpg` मा map हुन्छ। URI को `/images/` भाग राखिन्छ। `alias` ले location prefix लाई alias path सँग **replace** गर्छ। Example: `alias /data/images/; location /images/` — `/images/photo.jpg` को request `/data/images/photo.jpg` मा map हुन्छ (URI बाट `/images/` prefix strip हुन्छ)। `alias` को key footgun: `location` path र `alias` path दुवैले trailing slash सँग end हुनुपर्छ — `location /images/` + `alias /data/images/` (दुवैमा slash)। Trailing slash missing वा mismatch भएमा subtle path concatenation bug हुन्छ जहाँ Nginx ले `/data/images/photo.jpg` को सट्टा `/data/imagesphoto.jpg` खोज्छ। Rule of thumb: URL path ले directly directory structure मा map गर्छ भने (most common case) `root` प्रयोग गर्नुहोस्। URL path ले filesystem layout match गर्दैन भने `alias` प्रयोग गर्नुहोस् — जस्तै `/static/` लाई `/opt/app/public/` जस्ता completely different directory बाट serve।",
        jp: "`root` はフルリクエスト URI をルートパスに**追加**します。例：`root /var/www; location /images/` — `/images/photo.jpg` へのリクエストは `/var/www/images/photo.jpg` にマップされます。URI の `/images/` 部分は保持されます。`alias` はロケーションプレフィックスをエイリアスパスで**置換**します。例：`alias /data/images/; location /images/` — `/images/photo.jpg` へのリクエストは `/data/images/photo.jpg` にマップされます（URI から `/images/` プレフィックスが削除される）。`alias` の主な落とし穴：`location` パスと `alias` パスの両方が末尾スラッシュで終わる必要があります — `location /images/` + `alias /data/images/`（両方にスラッシュ）。末尾スラッシュが欠けているか不一致の場合、Nginx が `/data/images/photo.jpg` ではなく `/data/imagesphoto.jpg` を探すという微妙なパス連結バグが発生します。経験則：URL パスがディレクトリ構造に直接マップされる場合（最も一般的なケース）は `root` を使用する。URL パスがファイルシステムレイアウトと一致しない場合は `alias` を使用する — 例えば `/static/` を `/opt/app/public/` のような完全に異なるディレクトリから提供する場合。",
      },
      tag: {
        en: "root vs alias",
        np: "root vs alias",
        jp: "root vs alias",
      },
    },
  ],
};
