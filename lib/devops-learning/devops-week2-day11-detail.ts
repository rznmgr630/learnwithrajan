import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "HTTP is the language servers speak to each other and to browsers. Every API call, every health check, every deploy webhook is an HTTP request. As a DevOps engineer you will spend a significant part of your career reading status codes, inspecting headers, and debugging TLS certificate errors — often at 3 AM.",
    np: "HTTP servers ले एकअर्कासँग र browser सँग बोल्ने भाषा हो। हरेक API call, हरेक health check, हरेक deploy webhook एउटा HTTP request हो। DevOps engineer को रूपमा तपाईं आफ्नो career को महत्वपूर्ण समय status code पढ्न, header निरीक्षण गर्न, र TLS certificate error debug गर्न — प्रायः राति 3 बजे — खर्च गर्नुहुनेछ।",
    jp: "HTTP はサーバーがお互いやブラウザーと話すための言語です。すべての API コール・ヘルスチェック・デプロイ Webhook は HTTP リクエストです。DevOps エンジニアとして、あなたはキャリアの多くの時間をステータスコードの読み取り・ヘッダーの確認・TLS 証明書エラーのデバッグに費やします。しばしば深夜 3 時に。",
  } as const,
  o2: {
    en: "Today you build a working model of the HTTP request/response cycle, learn what HTTPS adds on top of it, understand the TLS handshake well enough to debug certificate errors with `curl -v`, and memorize the status codes that matter in production monitoring.",
    np: "आज तपाईंले HTTP request/response cycle को कार्यशील मोडेल बनाउनुहुनेछ, HTTPS ले माथि के थप्छ सिक्नुहुनेछ, `curl -v` सँग certificate error debug गर्न TLS handshake बुझ्नुहुनेछ, र production monitoring मा महत्वपूर्ण status code याद गर्नुहुनेछ।",
    jp: "本日は HTTP リクエスト/レスポンスサイクルの動作モデルを構築し、HTTPS が何を加えるかを学び、`curl -v` で証明書エラーをデバッグできるよう TLS ハンドシェイクを理解し、本番モニタリングで重要なステータスコードを覚えます。",
  } as const,
};

export const DEVOPS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "HTTP request/response model",
        np: "HTTP request/response model",
        jp: "HTTP リクエスト/レスポンスモデル",
      },
      blocks: [
        { type: "diagram", id: "devops-nginx-proxy" },
        {
          type: "paragraph",
          text: {
            en: "HTTP is a text-based, stateless, request-response protocol running over TCP. The client sends a request (method + path + headers + optional body); the server replies with a response (status line + headers + body). Every HTTP interaction follows this exact pattern — from a browser loading a page to a Kubernetes liveness probe checking `/health`.",
            np: "HTTP एक text-based, stateless, request-response protocol हो जुन TCP मा चल्छ। Client ले request (method + path + header + optional body) पठाउँछ; server ले response (status line + header + body) ले जवाफ दिन्छ। हरेक HTTP interaction यही exact pattern अनुसार हुन्छ — browser ले page load गर्नेदेखि Kubernetes liveness probe ले `/health` check गर्नेसम्म।",
            jp: "HTTP はテキストベースのステートレスなリクエスト-レスポンスプロトコルで、TCP 上で動きます。クライアントがリクエスト（メソッド + パス + ヘッダー + オプションのボディ）を送り、サーバーがレスポンス（ステータス行 + ヘッダー + ボディ）で返します。ブラウザのページ読み込みから Kubernetes の liveness probe の `/health` チェックまで、すべての HTTP インタラクションがこのパターンに従います。",
          },
        },
        {
          type: "code",
          title: {
            en: "A raw HTTP request and response",
            np: "Raw HTTP request र response",
            jp: "生の HTTP リクエストとレスポンス",
          },
          code: `# What your browser sends (simplified):
GET /api/users HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbGci...
User-Agent: Mozilla/5.0

# What the server sends back:
HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 248
Cache-Control: no-cache

{"users": [...]}

# See the real exchange with curl:
curl -v https://httpbin.org/get 2>&1 | head -40
# Lines starting with > are sent by curl (request)
# Lines starting with < are received (response)

# Common HTTP methods and their semantics:
# GET     — retrieve a resource (idempotent, safe, no body)
# POST    — create a resource or trigger an action
# PUT     — replace a resource entirely (idempotent)
# PATCH   — partially update a resource
# DELETE  — remove a resource (idempotent)
# HEAD    — like GET but returns only headers (useful for health checks)
# OPTIONS — what methods does this endpoint support?`,
        },
        {
          type: "table",
          caption: {
            en: "HTTP status codes that matter in DevOps",
            np: "DevOps मा महत्वपूर्ण HTTP status code",
            jp: "DevOps で重要な HTTP ステータスコード",
          },
          headers: [
            { en: "Code", np: "Code", jp: "コード" },
            { en: "Name", np: "नाम", jp: "名前" },
            { en: "What it means in production", np: "Production मा अर्थ", jp: "本番での意味" },
          ],
          rows: [
            [
              { en: "200", np: "200", jp: "200" },
              { en: "OK", np: "OK", jp: "OK" },
              { en: "Success — health checks must return this", np: "सफलता — health check ले यो return गर्नुपर्छ", jp: "成功 — ヘルスチェックはこれを返すべき" },
            ],
            [
              { en: "201", np: "201", jp: "201" },
              { en: "Created", np: "सिर्जना गरियो", jp: "作成済み" },
              { en: "POST succeeded and a resource was created", np: "POST सफल भयो र resource सिर्जना भयो", jp: "POST 成功、リソースが作成された" },
            ],
            [
              { en: "301/302", np: "301/302", jp: "301/302" },
              { en: "Redirect", np: "Redirect", jp: "リダイレクト" },
              { en: "Permanent/temporary redirect — watch for redirect loops in nginx config", np: "स्थायी/अस्थायी redirect — nginx config मा redirect loop हेर्नुहोस्", jp: "永続/一時リダイレクト — nginx 設定のリダイレクトループに注意" },
            ],
            [
              { en: "400", np: "400", jp: "400" },
              { en: "Bad Request", np: "खराब अनुरोध", jp: "不正リクエスト" },
              { en: "Client sent malformed data — usually an API contract issue", np: "Client ले malformed data पठायो — सामान्यतया API contract issue", jp: "クライアントが不正データを送信 — API コントラクトの問題が多い" },
            ],
            [
              { en: "401", np: "401", jp: "401" },
              { en: "Unauthorized", np: "अनाधिकृत", jp: "未認証" },
              { en: "Missing or invalid credentials", np: "Missing वा invalid credential", jp: "認証情報が欠落または無効" },
            ],
            [
              { en: "403", np: "403", jp: "403" },
              { en: "Forbidden", np: "निषेधित", jp: "アクセス拒否" },
              { en: "Credentials valid but insufficient permissions (IAM, RBAC)", np: "Credential valid तर permission अपर्याप्त (IAM, RBAC)", jp: "認証は通っているが権限が不足（IAM・RBAC）" },
            ],
            [
              { en: "404", np: "404", jp: "404" },
              { en: "Not Found", np: "फेला परेन", jp: "見つからない" },
              { en: "Wrong path — check your nginx location blocks or API routes", np: "गलत path — nginx location block वा API route जाँच्नुहोस्", jp: "パスが間違い — nginx の location ブロックや API ルートを確認" },
            ],
            [
              { en: "429", np: "429", jp: "429" },
              { en: "Too Many Requests", np: "धेरै अनुरोध", jp: "リクエスト過多" },
              { en: "Rate limited — back off and retry with exponential delay", np: "Rate limited — exponential delay सहित back off र retry गर्नुहोस्", jp: "レート制限 — バックオフして指数遅延でリトライ" },
            ],
            [
              { en: "500", np: "500", jp: "500" },
              { en: "Internal Server Error", np: "आन्तरिक Server त्रुटि", jp: "サーバー内部エラー" },
              { en: "App crashed or threw an unhandled exception — check app logs", np: "App crash भयो वा unhandled exception — app log जाँच्नुहोस्", jp: "アプリがクラッシュまたは未処理の例外 — アプリログを確認" },
            ],
            [
              { en: "502", np: "502", jp: "502" },
              { en: "Bad Gateway", np: "खराब गेटवे", jp: "バッドゲートウェイ" },
              { en: "Your reverse proxy (nginx) cannot reach the upstream app", np: "Reverse proxy (nginx) ले upstream app reach गर्न सकेन", jp: "リバースプロキシ（nginx）がアップストリームアプリに到達できない" },
            ],
            [
              { en: "503", np: "503", jp: "503" },
              { en: "Service Unavailable", np: "सेवा अनुपलब्ध", jp: "サービス利用不可" },
              { en: "App is overloaded or down — the status code of an outage", np: "App overloaded वा down — outage को status code", jp: "アプリが過負荷またはダウン — 障害のステータスコード" },
            ],
            [
              { en: "504", np: "504", jp: "504" },
              { en: "Gateway Timeout", np: "गेटवे टाइमआउट", jp: "ゲートウェイタイムアウト" },
              { en: "Upstream app responded too slowly — check proxy_read_timeout in nginx", np: "Upstream app ले धेरै ढिलो respond गर्यो — nginx मा proxy_read_timeout जाँच्नुहोस्", jp: "アップストリームアプリの応答が遅すぎる — nginx の proxy_read_timeout を確認" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "HTTPS and TLS — what changes when you add encryption",
        np: "HTTPS र TLS — encryption थप्दा के बदलिन्छ",
        jp: "HTTPS と TLS — 暗号化を加えると何が変わるか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "HTTPS is HTTP layered on top of TLS (Transport Layer Security). TLS adds three things: encryption (nobody can read the traffic in transit), integrity (nobody can modify it), and authentication (the server proves it owns the domain via a certificate). HTTP sends everything in plain text — anyone on the network between you and the server can read passwords, session tokens, and API keys.",
            np: "HTTPS भनेको TLS (Transport Layer Security) माथि layered HTTP हो। TLS तीन कुरा थप्छ: encryption (transit मा traffic कसैले पढ्न सक्दैन), integrity (कसैले modify गर्न सक्दैन), र authentication (server ले certificate मार्फत domain ownership प्रमाणित गर्छ)। HTTP ले सबै plain text मा पठाउँछ — तपाईं र server बीच network मा जो कोहीले password, session token, र API key पढ्न सक्छ।",
            jp: "HTTPS は TLS（Transport Layer Security）の上に重ねられた HTTP です。TLS は 3 つのものを追加します。暗号化（転送中のトラフィックは誰も読めない）・完全性（誰も変更できない）・認証（サーバーが証明書でドメインの所有を証明する）。HTTP はすべてを平文で送るため、あなたとサーバーの間にいる誰もがパスワード・セッショントークン・API キーを読めます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inspecting TLS with curl and openssl",
            np: "curl र openssl सँग TLS निरीक्षण गर्नुहोस्",
            jp: "curl と openssl で TLS を確認する",
          },
          code: `# See the full TLS handshake (look for 'SSL connection using' and certificate CN)
curl -v https://example.com 2>&1 | grep -E "SSL|certificate|subject|expire"

# Inspect a certificate's expiry and details
echo | openssl s_client -connect example.com:443 -servername example.com 2>/dev/null \
  | openssl x509 -noout -dates -subject -issuer

# Check how many days until a certificate expires
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -enddate \
  | sed 's/notAfter=//'

# Test if a server supports TLS 1.2 / 1.3
curl --tlsv1.2 https://example.com   # force TLS 1.2
curl --tlsv1.3 https://example.com   # force TLS 1.3

# Bypass certificate validation (ONLY for testing self-signed certs — never in prod)
curl -k https://self-signed.local

# Test a specific cipher suite
openssl s_client -connect example.com:443 -cipher ECDHE-RSA-AES256-GCM-SHA384

# Check which certificate a hostname resolves to (useful for multi-domain certs)
echo | openssl s_client -connect example.com:443 2>/dev/null \
  | openssl x509 -noout -text | grep -A1 "Subject Alternative Name"`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Certificate chain: your cert is signed by an intermediate CA, which is signed by a root CA. Browsers trust a list of root CAs. If your server only sends the leaf cert (not the intermediates), some clients will fail with a chain error — always include the full chain.",
              np: "Certificate chain: तपाईंको cert intermediate CA द्वारा sign गरिएको छ, जुन root CA द्वारा sign गरिएको छ। Browser ले root CA को list trust गर्छ। यदि तपाईंको server केवल leaf cert (intermediate होइन) पठाउँछ भने केही client chain error सँग fail हुन्छ — सधैं full chain include गर्नुहोस्।",
              jp: "証明書チェーン: あなたの証明書は中間 CA によって署名され、中間 CA はルート CA によって署名されています。ブラウザーはルート CA のリストを信頼しています。サーバーがリーフ証明書のみ（中間証明書なし）を送ると、一部のクライアントがチェーンエラーで失敗します。常に完全なチェーンを含めましょう。",
            },
            {
              en: "Let's Encrypt + certbot is the standard free CA for public services. `certbot --nginx -d example.com` installs and auto-renews a cert. Set a cron or systemd timer to renew before expiry.",
              np: "Let's Encrypt + certbot public service का लागि standard free CA हो। `certbot --nginx -d example.com` ले cert install र auto-renew गर्छ। Expiry अघि renew गर्न cron वा systemd timer set गर्नुहोस्।",
              jp: "Let's Encrypt + certbot は公開サービスの標準的な無料 CA です。`certbot --nginx -d example.com` で証明書をインストールし自動更新します。有効期限前に更新するための cron または systemd タイマーを設定しましょう。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Important HTTP headers for DevOps",
        np: "DevOps का लागि महत्वपूर्ण HTTP header",
        jp: "DevOps のための重要な HTTP ヘッダー",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Headers you will encounter in production",
            np: "Production मा सामना हुने header",
            jp: "本番環境でよく遭遇するヘッダー",
          },
          code: `# Inspect response headers
curl -I https://example.com

# Key headers and what they mean:

# Content-Type — what format is the body?
Content-Type: application/json; charset=utf-8
Content-Type: text/html; charset=utf-8
Content-Type: multipart/form-data; boundary=---boundary

# Cache-Control — how should this response be cached?
Cache-Control: no-cache        # always revalidate
Cache-Control: max-age=3600    # cache for 1 hour
Cache-Control: no-store        # never cache (secrets, auth pages)

# Authorization — how clients authenticate
Authorization: Bearer <jwt-token>
Authorization: Basic <base64(user:pass)>

# X-Forwarded-For — real client IP when behind a load balancer/proxy
X-Forwarded-For: 203.0.113.10, 10.0.0.1
# Your app sees the proxy's IP without this header — important for rate limiting

# CORS headers — control which origins can call your API
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Methods: GET, POST, DELETE

# Security headers — add these to every response
Strict-Transport-Security: max-age=31536000; includeSubDomains  # force HTTPS
X-Content-Type-Options: nosniff
X-Frame-Options: DENY

# Set these with curl for API testing
curl -H "Authorization: Bearer TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"test"}' \
     https://api.example.com/resources`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Debug a real HTTPS endpoint",
        np: "Hands-on: वास्तविक HTTPS endpoint debug गर्नुहोस्",
        jp: "ハンズオン: 本物の HTTPS エンドポイントをデバッグする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Diagnosing common HTTPS issues",
            np: "सामान्य HTTPS issue निदान गर्नुहोस्",
            jp: "よくある HTTPS 問題の診断",
          },
          code: `# 1. Is the port open at all?
nc -zv example.com 443

# 2. Does TLS complete? (look for 'Verify return code: 0')
openssl s_client -connect example.com:443 -servername example.com

# 3. When does the cert expire?
echo | openssl s_client -connect example.com:443 2>/dev/null \\
  | openssl x509 -noout -enddate

# 4. Check for certificate chain issues
curl -v https://example.com 2>&1 | grep -i "verify\\|error\\|cert"

# 5. Full timing breakdown (TTFB, TLS, DNS)
curl -w "\\n
DNS:      %{time_namelookup}s
TCP conn: %{time_connect}s
TLS done: %{time_appconnect}s
TTFB:     %{time_starttransfer}s
Total:    %{time_total}s\\n" \\
  -o /dev/null -s https://example.com

# 6. Test HTTP → HTTPS redirect
curl -Lv http://example.com 2>&1 | grep -E "Location|HTTP/"

# 7. Automate certificate expiry monitoring in a script
check_cert_expiry() {
  local HOST="$1"
  local DAYS_WARN="\${2:-30}"
  local EXPIRY
  EXPIRY=$(echo | openssl s_client -connect "\${HOST}:443" 2>/dev/null \\
    | openssl x509 -noout -enddate | cut -d= -f2)
  local EXPIRY_EPOCH
  EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %T %Y %Z" "$EXPIRY" +%s)
  local NOW_EPOCH
  NOW_EPOCH=$(date +%s)
  local DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
  if [[ $DAYS_LEFT -lt $DAYS_WARN ]]; then
    echo "WARNING: $HOST cert expires in $DAYS_LEFT days!"
    return 1
  fi
  echo "OK: $HOST cert valid for $DAYS_LEFT more days"
}

check_cert_expiry example.com 30`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between HTTP/1.1, HTTP/2, and HTTP/3?",
        np: "HTTP/1.1, HTTP/2, र HTTP/3 बीच के फरक छ?",
        jp: "HTTP/1.1・HTTP/2・HTTP/3 の違いは？",
      },
      answer: {
        en: "HTTP/1.1 opens one TCP connection per request (or reuses with keep-alive but serially). HTTP/2 multiplexes many requests over one TCP connection, uses header compression (HPACK), and enables server push — dramatically reducing latency for pages with many assets. HTTP/3 replaces TCP with QUIC (UDP-based), eliminating TCP's head-of-line blocking. For DevOps: enable HTTP/2 in nginx with `listen 443 ssl http2;`. Most modern load balancers and CDNs handle HTTP/3 automatically.",
        np: "HTTP/1.1 ले प्रति request एउटा TCP connection खोल्छ (वा keep-alive सँग serially reuse गर्छ)। HTTP/2 ले एउटा TCP connection मा धेरै request multiplex गर्छ, header compression (HPACK) प्रयोग गर्छ, र server push enable गर्छ। HTTP/3 ले TCP लाई QUIC (UDP-based) सँग replace गर्छ। DevOps का लागि: nginx मा `listen 443 ssl http2;` सँग HTTP/2 enable गर्नुहोस्।",
        jp: "HTTP/1.1 はリクエストごとに 1 つの TCP 接続を開きます（keep-alive で再利用するが直列）。HTTP/2 は 1 つの TCP 接続上で多数のリクエストを多重化し、ヘッダー圧縮（HPACK）を使用し、サーバープッシュを可能にします。HTTP/3 は TCP を QUIC（UDP ベース）に置き換えます。DevOps 向け：nginx で `listen 443 ssl http2;` として HTTP/2 を有効化します。",
      },
      tag: { en: "http", np: "HTTP", jp: "HTTP" },
    },
    {
      question: {
        en: "What is SNI and why does it matter for hosting multiple HTTPS sites?",
        np: "SNI के हो र धेरै HTTPS site host गर्दा यो किन महत्वपूर्ण छ?",
        jp: "SNI とは何か、複数の HTTPS サイトをホスティングするときになぜ重要か？",
      },
      answer: {
        en: "Server Name Indication (SNI) is a TLS extension where the client tells the server which hostname it is connecting to during the TLS handshake — before the server sends its certificate. Without SNI, a server can only have one TLS certificate per IP address (because the cert is sent before the server knows which virtual host you want). SNI allows nginx, Apache, and load balancers to serve different certs for different domains on the same IP. All modern clients support it; the only exception is very old clients (IE on Windows XP).",
        np: "Server Name Indication (SNI) एउटा TLS extension हो जहाँ client ले server certificate पठाउनु अघि — TLS handshake को क्रममा — server लाई कुन hostname मा connect गर्दैछ भनेर बताउँछ। SNI बिना, server ले प्रति IP address केवल एउटा TLS certificate राख्न सक्छ। SNI ले nginx, Apache, र load balancer लाई एउटै IP मा फरक domain का लागि फरक cert serve गर्न दिन्छ।",
        jp: "Server Name Indication（SNI）は TLS 拡張で、クライアントが TLS ハンドシェイク中（サーバーが証明書を送る前）に接続先のホスト名をサーバーに伝えます。SNI がないと、サーバーは IP アドレスごとに 1 つの TLS 証明書しか持てません。SNI により、nginx・Apache・ロードバランサーが同じ IP で異なるドメインに異なる証明書を提供できます。",
      },
      tag: { en: "ssl", np: "SSL", jp: "SSL" },
    },
    {
      question: {
        en: "My app returns 502 — where do I look first?",
        np: "App ले 502 return गर्छ — पहिले कहाँ हेर्ने?",
        jp: "アプリが 502 を返す — まずどこを見るべきか？",
      },
      answer: {
        en: "502 Bad Gateway means your reverse proxy (nginx/HAProxy) received an invalid or no response from the upstream app. Check in order: (1) is the upstream process actually running — `ps aux | grep app` or `systemctl status app`; (2) is it listening on the expected port — `ss -tlnp | grep 8080`; (3) nginx error log — `tail /var/log/nginx/error.log`; (4) does the proxy_pass address match where the app actually listens. 502 almost always means the app is down or refusing connections, not a network issue.",
        np: "502 Bad Gateway को अर्थ तपाईंको reverse proxy (nginx/HAProxy) ले upstream app बाट invalid वा कुनै response पाएन। क्रमशः जाँच्नुहोस्: (1) upstream process साँच्चै run भइरहेको छ — `ps aux | grep app` वा `systemctl status app`; (2) expected port मा listen गर्दैछ — `ss -tlnp | grep 8080`; (3) nginx error log — `tail /var/log/nginx/error.log`; (4) proxy_pass address app ले actually listen गर्ने ठाउँसँग match गर्छ।",
        jp: "502 Bad Gateway はリバースプロキシ（nginx/HAProxy）がアップストリームアプリから無効または応答なしを受け取ったことを意味します。順番に確認：(1) アップストリームプロセスが実際に動いているか — `ps aux | grep app` または `systemctl status app`；(2) 期待されるポートでリッスンしているか — `ss -tlnp | grep 8080`；(3) nginx エラーログ — `tail /var/log/nginx/error.log`；(4) proxy_pass アドレスがアプリの実際のリッスン先と一致するか。",
      },
      tag: { en: "http", np: "HTTP", jp: "HTTP" },
    },
  ],
};
