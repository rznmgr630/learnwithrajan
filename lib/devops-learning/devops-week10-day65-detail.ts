import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A **forward proxy** sits between your internal clients and the internet. Clients are configured to send all outbound traffic through it. Unlike a reverse proxy (which hides backend servers), a forward proxy hides clients — the destination server sees the proxy's IP, not the individual client. Corporate networks use forward proxies to enforce browsing policies, log all outbound traffic, and prevent data exfiltration. Squid is the classic open-source forward proxy; modern cloud-based forward proxies (Zscaler, Netskope) operate as a service. From a DevOps perspective, forward proxies are also used inside Kubernetes clusters to control egress: pods must go through the proxy to reach external APIs, making it easy to audit and restrict outbound calls.",
    np: "**Forward proxy** तपाईंका internal client र internet बीचमा बस्छ। Client हरू सबै outbound traffic यसमार्फत send गर्न configure हुन्छन्। Reverse proxy (जसले backend server hide गर्छ) भन्दा फरक, forward proxy ले client hide गर्छ — destination server ले individual client को होइन proxy को IP देख्छ। Corporate network ले browsing policy enforce गर्न, सबै outbound traffic log गर्न, र data exfiltration prevent गर्न forward proxy प्रयोग गर्छ। Squid classic open-source forward proxy हो; modern cloud-based forward proxy (Zscaler, Netskope) service को रूपमा operate गर्छ। DevOps perspective बाट, forward proxy ले Kubernetes cluster भित्र egress control गर्न पनि प्रयोग हुन्छ: pod हरूले external API reach गर्न proxy मार्फत जानुपर्छ, outbound call audit र restrict गर्न सजिलो हुन्छ।",
    jp: "**フォワードプロキシ**は内部クライアントとインターネットの間に位置します。クライアントはすべてのアウトバウンドトラフィックをそれを通じて送るように設定されます。リバースプロキシ（バックエンドサーバーを隠す）とは異なり、フォワードプロキシはクライアントを隠します — 宛先サーバーは個々のクライアントの IP ではなくプロキシの IP を見ます。企業ネットワークはブラウジングポリシーの実施・すべてのアウトバウンドトラフィックのログ・データ漏洩防止のためにフォワードプロキシを使用します。Squid は古典的なオープンソースのフォワードプロキシです；最新のクラウドベースのフォワードプロキシ（Zscaler・Netskope）はサービスとして動作します。DevOps の観点から、フォワードプロキシは Kubernetes クラスター内でエグレスを制御するためにも使用されます：Pod は外部 API に到達するためにプロキシを通過する必要があり、アウトバウンド呼び出しの監査と制限が容易になります。",
  } as const,
  o2: {
    en: "**Caching** is one of the biggest performance levers available to you. Nginx's proxy cache stores backend responses on disk or in memory — when the same URL is requested again, Nginx serves it directly without hitting the backend. A properly tuned cache can reduce backend load by 90%+ for read-heavy workloads. Understanding cache mechanics requires knowing four concepts: the **cache key** (what makes two requests 'the same' — by default, the full URL including query string), the **TTL** (how long to serve a cached response before re-fetching), **cache invalidation** (how to force Nginx to forget a cached response), and **cache headers** (`Cache-Control`, `Expires`, `ETag`, `Vary`). Today you configure Nginx proxy caching, test it with curl's verbose headers, and implement cache invalidation.",
    np: "**Caching** तपाईंसँग available सबैभन्दा ठूलो performance lever मध्ये एउटा हो। Nginx को proxy cache ले backend response disk वा memory मा store गर्छ — same URL फेरि request भयो भने Nginx ले backend hit नगरी directly serve गर्छ। Properly tuned cache ले read-heavy workload को लागि 90%+ backend load reduce गर्न सक्छ। Cache mechanics बुझ्न चारवटा concept जान्न आवश्यक छ: **cache key** (दुईवटा request 'same' के बनाउँछ — default मा query string सहित full URL), **TTL** (re-fetch गर्नुअघि cached response कति समय serve गर्ने), **cache invalidation** (Nginx लाई cached response बिर्साउन force कसरी गर्ने), र **cache header** (`Cache-Control`, `Expires`, `ETag`, `Vary`)। आज तपाईंले Nginx proxy caching configure गर्नुहुनेछ, curl को verbose header सँग test गर्नुहुनेछ, र cache invalidation implement गर्नुहुनेछ।",
    jp: "**キャッシング**は利用できる最大のパフォーマンスレバーの 1 つです。Nginx のプロキシキャッシュはバックエンドのレスポンスをディスクまたはメモリに保存します — 同じ URL が再度リクエストされると、Nginx はバックエンドにアクセスせずに直接提供します。適切にチューニングされたキャッシュは読み取りが多いワークロードでバックエンドの負荷を 90% 以上削減できます。キャッシュの仕組みを理解するには 4 つの概念を知る必要があります：**キャッシュキー**（2 つのリクエストを「同じ」とするもの — デフォルトではクエリ文字列を含む完全な URL）、**TTL**（再取得する前にキャッシュされたレスポンスを提供する期間）、**キャッシュ無効化**（Nginx にキャッシュされたレスポンスを忘れさせる方法）、**キャッシュヘッダー**（`Cache-Control`・`Expires`・`ETag`・`Vary`）。今日は Nginx プロキシキャッシングを設定し、curl の詳細ヘッダーでテストし、キャッシュ無効化を実装します。",
  } as const,
};

export const DEVOPS_DAY_65_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Proxy caching — how it works & when to use it",
        np: "Proxy caching — कसरी काम गर्छ र कहिले प्रयोग गर्ने",
        jp: "プロキシキャッシング — 動作方法と使用時期",
      },
      blocks: [
        { type: "diagram", id: "devops-proxy-cache" },
        {
          type: "table",
          caption: {
            en: "HTTP cache headers — what each controls",
            np: "HTTP cache header — हरेकले के control गर्छ",
            jp: "HTTP キャッシュヘッダー — それぞれが制御するもの",
          },
          headers: [
            { en: "Header", np: "Header", jp: "ヘッダー" },
            { en: "Direction", np: "Direction", jp: "方向" },
            { en: "Controls", np: "Control गर्छ", jp: "制御するもの" },
            { en: "Example value", np: "Example value", jp: "値の例" },
          ],
          rows: [
            [
              { en: "Cache-Control", np: "Cache-Control", jp: "Cache-Control" },
              { en: "Response (server → client/proxy)", np: "Response (server → client/proxy)", jp: "レスポンス（サーバー → クライアント/プロキシ）" },
              { en: "Master cache directive — max-age, no-cache, no-store, private, public", np: "Master cache directive — max-age, no-cache, no-store, private, public", jp: "マスターキャッシュディレクティブ — max-age・no-cache・no-store・private・public" },
              { en: "`public, max-age=3600` — cache for 1 hour", np: "`public, max-age=3600` — 1 hour cache", jp: "`public, max-age=3600` — 1 時間キャッシュ" },
            ],
            [
              { en: "ETag", np: "ETag", jp: "ETag" },
              { en: "Response", np: "Response", jp: "レスポンス" },
              { en: "Unique fingerprint of the response — enables conditional requests", np: "Response को unique fingerprint — conditional request enable गर्छ", jp: "レスポンスの一意のフィンガープリント — 条件付きリクエストを有効にする" },
              { en: "`ETag: \"abc123\"` — client sends `If-None-Match: \"abc123\"` on next request", np: "`ETag: \"abc123\"` — client ले next request मा `If-None-Match: \"abc123\"` send", jp: "`ETag: \"abc123\"` — クライアントは次のリクエストで `If-None-Match: \"abc123\"` を送信" },
            ],
            [
              { en: "Last-Modified", np: "Last-Modified", jp: "Last-Modified" },
              { en: "Response", np: "Response", jp: "レスポンス" },
              { en: "Timestamp of last content change — enables conditional GET", np: "Last content change को timestamp — conditional GET enable", jp: "最終コンテンツ変更のタイムスタンプ — 条件付き GET を有効にする" },
              { en: "`Last-Modified: Wed, 08 May 2026 10:00:00 GMT`", np: "`Last-Modified: Wed, 08 May 2026 10:00:00 GMT`", jp: "`Last-Modified: Wed, 08 May 2026 10:00:00 GMT`" },
            ],
            [
              { en: "Vary", np: "Vary", jp: "Vary" },
              { en: "Response", np: "Response", jp: "レスポンス" },
              { en: "Cache must store separate copies for different values of this request header", np: "यो request header को different value को लागि cache ले separate copy store गर्नुपर्छ", jp: "このリクエストヘッダーの異なる値に対してキャッシュは別々のコピーを保存する必要がある" },
              { en: "`Vary: Accept-Encoding` — store gzip and non-gzip separately", np: "`Vary: Accept-Encoding` — gzip र non-gzip छुट्टाछुट्टै store", jp: "`Vary: Accept-Encoding` — gzip と非 gzip を別々に保存" },
            ],
            [
              { en: "no-cache", np: "no-cache", jp: "no-cache" },
              { en: "Cache-Control directive", np: "Cache-Control directive", jp: "Cache-Control ディレクティブ" },
              { en: "Don't serve without revalidating — always check ETag/Last-Modified with origin", np: "Revalidate नगरी serve नगर्नुहोस् — सधैँ origin सँग ETag/Last-Modified check", jp: "再検証せずに提供しない — 常にオリジンで ETag/Last-Modified を確認" },
              { en: "`Cache-Control: no-cache` — saves bandwidth (304 Not Modified vs full body)", np: "`Cache-Control: no-cache` — bandwidth save (304 Not Modified vs full body)", jp: "`Cache-Control: no-cache` — 帯域幅を節約（304 Not Modified vs 全ボディ）" },
            ],
            [
              { en: "no-store", np: "no-store", jp: "no-store" },
              { en: "Cache-Control directive", np: "Cache-Control directive", jp: "Cache-Control ディレクティブ" },
              { en: "Never cache this response — sensitive data (login pages, financial data)", np: "Response कहिल्यै cache नगर्नुहोस् — sensitive data (login page, financial data)", jp: "このレスポンスを絶対にキャッシュしない — 機密データ（ログインページ・金融データ）" },
              { en: "`Cache-Control: no-store, private`", np: "`Cache-Control: no-store, private`", jp: "`Cache-Control: no-store, private`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Nginx proxy cache configuration",
        np: "Nginx proxy cache configuration",
        jp: "Nginx プロキシキャッシュ設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Nginx proxy_cache + cache headers + cache purge + Squid forward proxy",
            np: "Nginx proxy_cache + cache header + cache purge + Squid forward proxy",
            jp: "Nginx proxy_cache + キャッシュヘッダー + キャッシュパージ + Squid フォワードプロキシ",
          },
          code: `# ── Nginx proxy cache setup ───────────────────────────────────────
# In nginx.conf http{} block — define cache zone:
# proxy_cache_path /var/cache/nginx
#   levels=1:2                    # two-level directory structure
#   keys_zone=my_cache:10m        # 10MB shared memory for keys
#   max_size=1g                   # max disk usage
#   inactive=60m                  # purge if not accessed in 60 min
#   use_temp_path=off;

# ── server block with caching enabled ────────────────────────────
server {
    listen 80;
    server_name myapp.example.com;

    location /api/ {
        proxy_pass http://backend:3000;
        proxy_cache my_cache;
        proxy_cache_valid 200 301 302   1h;   # cache 200/301/302 for 1 hour
        proxy_cache_valid 404           1m;   # cache 404 for 1 minute
        proxy_cache_valid any           10m;  # everything else for 10 minutes
        proxy_cache_use_stale error timeout updating;  # serve stale on error
        proxy_cache_lock on;            # one request fetches; others wait

        # Cache key — default is scheme+host+uri, add query string:
        proxy_cache_key "$scheme$request_method$host$request_uri";

        # Add cache status header for debugging
        add_header X-Cache-Status $upstream_cache_status;
        # Values: HIT, MISS, BYPASS, EXPIRED, STALE, UPDATING, REVALIDATED

        # Don't cache if Authorization header is present
        proxy_cache_bypass  $http_authorization;
        proxy_no_cache      $http_authorization;
    }

    # Static assets — long cache
    location ~* \.(js|css|png|jpg|gif|ico|woff2)$ {
        proxy_pass http://backend:3000;
        proxy_cache my_cache;
        proxy_cache_valid 200 7d;       # cache for 7 days
        add_header Cache-Control "public, max-age=604800, immutable";
        add_header X-Cache-Status $upstream_cache_status;
    }

    # Never cache auth/user-specific endpoints
    location /api/auth/ {
        proxy_pass http://backend:3000;
        proxy_no_cache 1;
        proxy_cache_bypass 1;
        add_header Cache-Control "no-store, private";
    }
}

# ── Test caching with curl ────────────────────────────────────────
curl -I http://myapp.example.com/api/products
# First request:  X-Cache-Status: MISS
# Second request: X-Cache-Status: HIT

# ── Check cache headers from a public site ───────────────────────
curl -I https://example.com | grep -i "cache\|etag\|expires"

# ── Cache invalidation (purge) ────────────────────────────────────
# Option 1: delete files from cache directory
find /var/cache/nginx -name "*.cache" -delete

# Option 2: Nginx commercial module: proxy_cache_purge
# PURGE /api/products HTTP/1.1

# Option 3: Versioned URLs (best practice) — no need to purge!
# /api/products?v=abc123   → cache indefinitely, change ?v= to invalidate
# /static/app.abc123.js    → hashed filename, never need to purge

# ── Conditional request flow (304 Not Modified) ───────────────────
# First request:
# → GET /api/data  → backend responds: 200 + ETag: "abc123"
# → Nginx caches response + ETag

# Subsequent request after TTL expires:
# → Nginx sends: GET /api/data  If-None-Match: "abc123"
# → Backend: content unchanged → 304 Not Modified (no body)
# → Nginx: serves cached body, updates TTL (saves bandwidth!)

# ── Squid forward proxy ───────────────────────────────────────────
sudo apt install squid -y
# /etc/squid/squid.conf
# http_port 3128
# acl localnet src 10.0.0.0/8
# http_access allow localnet
# cache_dir ufs /var/spool/squid 100 16 256    # 100MB cache
# maximum_object_size 10 MB

# Configure clients to use the proxy:
export http_proxy=http://squid-host:3128
export https_proxy=http://squid-host:3128
curl http://example.com                        # routes through Squid`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Configure Nginx proxy caching for a backend with the `proxy_cache_path` and `proxy_cache` directives. Add `add_header X-Cache-Status $upstream_cache_status`. Hit the same URL twice with `curl -I http://localhost/api/test`. The first response should show `X-Cache-Status: MISS` and the second `X-Cache-Status: HIT`. Observe the response time difference — the HIT should be significantly faster.",
              np: "`proxy_cache_path` र `proxy_cache` directive सहित backend को लागि Nginx proxy caching configure गर्नुहोस्। `add_header X-Cache-Status $upstream_cache_status` add गर्नुहोस्। `curl -I http://localhost/api/test` सँग same URL twice hit गर्नुहोस्। पहिलो response ले `X-Cache-Status: MISS` र दोस्रो ले `X-Cache-Status: HIT` show गर्नुपर्छ। Response time difference observe गर्नुहोस् — HIT significantly faster हुनुपर्छ।",
              jp: "`proxy_cache_path` と `proxy_cache` ディレクティブでバックエンドの Nginx プロキシキャッシングを設定する。`add_header X-Cache-Status $upstream_cache_status` を追加する。`curl -I http://localhost/api/test` で同じ URL を 2 回ヒットする。最初のレスポンスは `X-Cache-Status: MISS` を、2 番目は `X-Cache-Status: HIT` を表示すべき。レスポンス時間の差を観察する — HIT は大幅に速いはず。",
            },
            {
              en: "Add a `/api/auth/` location block with `proxy_no_cache 1` and `proxy_cache_bypass 1`. Confirm with `curl -I http://localhost/api/auth/login` that `X-Cache-Status: BYPASS` is always returned (never HIT). Then test the `proxy_cache_bypass $http_authorization` directive by sending a request with and without an `Authorization: Bearer token` header — the latter should always bypass the cache.",
              np: "`proxy_no_cache 1` र `proxy_cache_bypass 1` सहित `/api/auth/` location block add गर्नुहोस्। `curl -I http://localhost/api/auth/login` सँग `X-Cache-Status: BYPASS` सधैँ return हुन्छ (HIT कहिल्यै होइन) confirm गर्नुहोस्। त्यसपछि `Authorization: Bearer token` header सहित र बिना request send गरेर `proxy_cache_bypass $http_authorization` directive test गर्नुहोस् — पछिल्लोले सधैँ cache bypass गर्नुपर्छ।",
              jp: "`proxy_no_cache 1` と `proxy_cache_bypass 1` で `/api/auth/` ロケーションブロックを追加する。`curl -I http://localhost/api/auth/login` で `X-Cache-Status: BYPASS` が常に返される（HIT は絶対にない）ことを確認する。次に `Authorization: Bearer token` ヘッダーありとなしでリクエストを送信して `proxy_cache_bypass $http_authorization` ディレクティブをテストする — 後者は常にキャッシュをバイパスすべき。",
            },
            {
              en: "Simulate cache invalidation using versioned URLs. First, cache a response at `/api/products`. Then 'update' the data (change what the backend returns) and verify the old response is still served (cache HIT). Compare three invalidation strategies: (1) wait for TTL expiry, (2) delete from `/var/cache/nginx`, (3) change the URL to `/api/products?v=2`. Strategy 3 is the production best practice — it avoids cache purge race conditions and works with CDNs.",
              np: "Versioned URL प्रयोग गरेर cache invalidation simulate गर्नुहोस्। पहिले, `/api/products` मा response cache गर्नुहोस्। त्यसपछि data 'update' गर्नुहोस् (backend ले return गर्ने change गर्नुहोस्) र old response अझै serve भइरहेको verify गर्नुहोस् (cache HIT)। तीनवटा invalidation strategy compare गर्नुहोस्: (1) TTL expiry को लागि wait, (2) `/var/cache/nginx` बाट delete, (3) URL `/api/products?v=2` मा change। Strategy 3 production best practice हो — cache purge race condition avoid गर्छ र CDN सँग काम गर्छ।",
              jp: "バージョン管理された URL を使ってキャッシュ無効化をシミュレートする。まず `/api/products` でレスポンスをキャッシュする。次にデータを「更新」（バックエンドが返すものを変更）して古いレスポンスがまだ提供されていることを確認する（キャッシュ HIT）。3 つの無効化戦略を比較する：(1) TTL の期限切れを待つ、(2) `/var/cache/nginx` から削除、(3) URL を `/api/products?v=2` に変更。戦略 3 が本番のベストプラクティスです — キャッシュパージの競合状態を避け CDN でも機能します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `Cache-Control: no-cache` and `Cache-Control: no-store`?",
        np: "`Cache-Control: no-cache` र `Cache-Control: no-store` बीचको फरक के हो?",
        jp: "`Cache-Control: no-cache` と `Cache-Control: no-store` の違いは何か？",
      },
      answer: {
        en: "`Cache-Control: no-cache` is misleading — it does NOT mean 'don't cache.' It means 'you may cache this, but you must revalidate with the origin server before serving it.' The cache stores the response; on the next request it sends a conditional GET with `If-None-Match` (ETag) or `If-Modified-Since`. If the content hasn't changed, the server responds `304 Not Modified` (no body) and the cache serves its stored copy. This saves bandwidth without sacrificing freshness. `Cache-Control: no-store` means 'never cache this at all — don't write it to disk or memory.' Every request fetches a fresh copy from the backend. Use `no-store` for sensitive data: login pages, bank account details, session tokens, personalized health records. Use `no-cache` for content that changes frequently but where you still want bandwidth savings from 304 responses: user dashboards, shopping cart pages, content that's the same for all users but updates every few minutes.",
        np: "`Cache-Control: no-cache` misleading छ — यसको मतलब 'cache नगर्नुहोस्' होइन। यसको मतलब 'तपाईंले यो cache गर्न सक्नुहुन्छ, तर serve गर्नुअघि origin server सँग revalidate गर्नुपर्छ।' Cache ले response store गर्छ; next request मा `If-None-Match` (ETag) वा `If-Modified-Since` सहित conditional GET send गर्छ। Content change भएको छैन भने server ले `304 Not Modified` (no body) respond गर्छ र cache ले stored copy serve गर्छ। यसले freshness sacrifice नगरी bandwidth save गर्छ। `Cache-Control: no-store` को मतलब 'यो कहिल्यै cache नगर्नुहोस् — disk वा memory मा लेख्नु नपर्नुस्।' हरेक request ले backend बाट fresh copy fetch गर्छ। Sensitive data को लागि `no-store` प्रयोग गर्नुहोस्: login page, bank account detail, session token, personalized health record। अझै 304 response बाट bandwidth saving चाहिने तर frequently change हुने content को लागि `no-cache` प्रयोग गर्नुहोस्: user dashboard, shopping cart page, सबै user को लागि same तर केही minute मा update हुने content।",
        jp: "`Cache-Control: no-cache` は誤解を招きます — 「キャッシュするな」という意味ではありません。「キャッシュしてもよいが、提供する前にオリジンサーバーで再検証しなければならない」という意味です。キャッシュはレスポンスを保存します；次のリクエストで `If-None-Match`（ETag）または `If-Modified-Since` で条件付き GET を送信します。コンテンツが変わっていなければサーバーは `304 Not Modified`（ボディなし）で応答し、キャッシュは保存されたコピーを提供します。これは鮮度を犠牲にせずに帯域幅を節約します。`Cache-Control: no-store` は「これを一切キャッシュするな — ディスクやメモリに書き込むな」という意味です。すべてのリクエストがバックエンドから新しいコピーを取得します。機密データには `no-store` を使用します：ログインページ・銀行口座の詳細・セッショントークン・パーソナライズされた健康記録。頻繁に変わるが 304 レスポンスによる帯域幅の節約をまだ望むコンテンツには `no-cache` を使用します：ユーザーダッシュボード・ショッピングカートページ・すべてのユーザーで同じだが数分ごとに更新されるコンテンツ。",
      },
      tag: { en: "no-cache vs no-store", np: "no-cache vs no-store", jp: "no-cache vs no-store" },
    },
    {
      question: {
        en: "What is cache stampede and how do you prevent it?",
        np: "Cache stampede के हो र यसलाई कसरी prevent गर्ने?",
        jp: "キャッシュスタンピードとは何か、どうやって防ぐか？",
      },
      answer: {
        en: "A **cache stampede** (also called thundering herd) happens when a cached item expires and dozens or hundreds of simultaneous requests arrive for it before any of them has had time to regenerate the cache. All requests miss the cache and rush to the backend simultaneously, potentially overwhelming it. Three main prevention strategies: (1) **Cache locking** (`proxy_cache_lock on` in Nginx): when a cache entry expires, only the first request goes to the backend; subsequent requests wait for the lock and then serve the freshly cached response. (2) **Serve stale while revalidating** (`proxy_cache_use_stale updating`): when a cache entry expires, Nginx serves the stale (old) response to all concurrent requests while one background request refreshes the cache. Users get a slightly stale response for one cycle but the backend never gets stampeded. This is usually the best option for high-traffic sites. (3) **Early expiry jitter**: add randomness to TTLs so cached items for different keys don't all expire at the same time. For a `max-age=3600` response, randomly subtract 0–300 seconds so expirations are spread over a 5-minute window instead of one instant.",
        np: "**Cache stampede** (thundering herd पनि भनिन्छ) तब हुन्छ जब cached item expire हुन्छ र कसैले cache regenerate गर्न समय पाउनुअघि dozens वा hundreds of simultaneous request आउँछ। सबै request cache miss गर्छन् र एकसाथ backend मा rush गर्छन्, potentially overwhelm गर्छन्। तीनवटा main prevention strategy: (1) **Cache locking** (Nginx मा `proxy_cache_lock on`): cache entry expire हुँदा, पहिलो request मात्र backend मा जान्छ; subsequent request ले lock को लागि wait गर्छन् र त्यसपछि freshly cached response serve गर्छन्। (2) **Stale serve while revalidating** (`proxy_cache_use_stale updating`): cache entry expire हुँदा, Nginx ले एउटा background request ले cache refresh गर्दा सबै concurrent request मा stale (old) response serve गर्छ। User ले एउटा cycle को लागि slightly stale response पाउँछ तर backend stampede हुँदैन। High-traffic site को लागि यो सामान्यतया best option हो। (3) **Early expiry jitter**: TTL मा randomness add गर्नुहोस् ताकि different key को cached item एकसाथ expire नहोस्। `max-age=3600` response को लागि, randomly 0–300 second subtract गर्नुहोस् ताकि expiration एउटा instant को सट्टा 5-minute window मा spread होस्।",
        jp: "**キャッシュスタンピード**（サンダリングハードとも呼ばれる）は、キャッシュされたアイテムが期限切れになり、それを再生成する時間が経つ前に何十または何百もの同時リクエストが到着したときに発生します。すべてのリクエストがキャッシュを見逃してバックエンドに同時に殺到し、圧倒する可能性があります。3 つの主な防止策：(1) **キャッシュロック**（Nginx の `proxy_cache_lock on`）：キャッシュエントリが期限切れになると、最初のリクエストだけがバックエンドに行き、後続のリクエストはロックを待って新しくキャッシュされたレスポンスを提供します。(2) **再検証中にステールを提供する**（`proxy_cache_use_stale updating`）：キャッシュエントリが期限切れになると、Nginx は 1 つのバックグラウンドリクエストがキャッシュを更新する間、すべての同時リクエストにステール（古い）レスポンスを提供します。ユーザーは 1 サイクルわずかに古いレスポンスを受け取りますが、バックエンドがスタンピードされることはありません。これは通常、高トラフィックサイトに最適です。(3) **早期期限ジッター**：TTL にランダム性を追加して、異なるキーのキャッシュアイテムがすべて同時に期限切れにならないようにします。`max-age=3600` のレスポンスに対して、0〜300 秒をランダムに引いて期限切れが 1 つの瞬間ではなく 5 分のウィンドウに分散されるようにします。",
      },
      tag: { en: "cache stampede", np: "Cache Stampede", jp: "キャッシュスタンピード" },
    },
  ],
};
