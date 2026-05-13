import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**TLS (Transport Layer Security)** secures every HTTPS connection through a handshake: the client sends a *Client Hello* (supported TLS versions, cipher suites, a random nonce); the server replies with a *Server Hello* (chosen cipher, its own nonce) and its **certificate** — a public key bundled with identity information (domain name, organisation, validity dates) and signed by a trusted **Certificate Authority (CA)**. The client verifies the certificate against its built-in CA trust store. Both sides then perform a **key exchange** — modern TLS 1.3 uses **ECDHE** (Elliptic-Curve Diffie-Hellman Ephemeral), which provides **forward secrecy**: even if the server's private key is later compromised, past sessions cannot be decrypted because each session used a fresh ephemeral key pair. From the shared secret both sides derive symmetric **session keys** and all subsequent data is encrypted. Certificates come in three validation levels: **DV (Domain Validated)** — the CA only verifies domain ownership via an automated challenge (DNS or HTTP), no human review, issued in seconds; this is what Let's Encrypt issues. **OV (Organization Validated)** — the CA manually verifies the organisation's legal identity in addition to domain control; the org name appears in the certificate. **EV (Extended Validation)** — rigorous legal entity verification including business registration documents; historically showed a green address-bar badge in browsers, now deprecated visually but still used by banks and financial institutions for the assurance it provides to automated scanners.",
    np: "**TLS (Transport Layer Security)** ले हरेक HTTPS connection लाई handshake मार्फत secure गर्छ: client ले *Client Hello* (supported TLS version, cipher suite, random nonce) पठाउँछ; server ले *Server Hello* (chosen cipher, आफ्नो nonce) र आफ्नो **certificate** — public key सँग identity information (domain name, organisation, validity date) बाँधिएको र trusted **Certificate Authority (CA)** ले sign गरेको — reply गर्छ। Client ले आफ्नो built-in CA trust store विरुद्ध certificate verify गर्छ। दुवै side ले **key exchange** perform गर्छन् — modern TLS 1.3 ले **ECDHE** (Elliptic-Curve Diffie-Hellman Ephemeral) प्रयोग गर्छ, जसले **forward secrecy** प्रदान गर्छ: server को private key पछि compromise भए पनि, past session decrypt गर्न सकिँदैन किनभने प्रत्येक session ले fresh ephemeral key pair प्रयोग गर्‍यो। Shared secret बाट दुवै side ले symmetric **session key** derive गर्छन् र सबै subsequent data encrypt हुन्छ। Certificate तीन validation level मा आउँछन्: **DV (Domain Validated)** — CA ले automated challenge (DNS वा HTTP) मार्फत domain ownership मात्र verify गर्छ, कुनै human review छैन, seconds मा issue हुन्छ; यही Let's Encrypt issue गर्छ। **OV (Organization Validated)** — CA ले domain control को अतिरिक्त organisation को legal identity manually verify गर्छ; org name certificate मा देखिन्छ। **EV (Extended Validation)** — business registration document सहित rigorous legal entity verification; historically browser मा green address-bar badge देखाउँथ्यो, अहिले visually deprecated छ तर automated scanner लाई assurance को लागि bank र financial institution ले अझै प्रयोग गर्छन्।",
    jp: "**TLS（Transport Layer Security）**はハンドシェイクを通じてすべての HTTPS 接続を保護します：クライアントは *Client Hello*（サポートされる TLS バージョン・暗号スイート・ランダムなノンス）を送信し；サーバーは *Server Hello*（選択された暗号・自身のノンス）と**証明書** — 識別情報（ドメイン名・組織・有効期間）と結び付けられた公開鍵で信頼できる**認証局（CA）**が署名したもの — を返します。クライアントは組み込みの CA トラストストアに対して証明書を検証します。両側は**鍵交換**を実行します — 最新の TLS 1.3 は **ECDHE**（楕円曲線ディフィー・ヘルマン一時鍵）を使用し、**前方秘匿性**を提供します：サーバーの秘密鍵が後に漏洩しても、各セッションが新しい一時鍵ペアを使用したため過去のセッションは復号できません。共有シークレットから両側は対称**セッションキー**を導出し、以降のすべてのデータが暗号化されます。証明書には 3 つの検証レベルがあります：**DV（ドメイン認証）** — CA は自動チャレンジ（DNS または HTTP）でドメイン所有権のみを検証し、人間によるレビューなし、数秒で発行；これが Let's Encrypt が発行するもの。**OV（組織認証）** — CA はドメイン制御に加えて組織の法的 ID を手動で検証し；組織名が証明書に表示されます。**EV（拡張認証）** — 事業登録書類を含む厳格な法人検証；歴史的にはブラウザで緑のアドレスバッジを表示していましたが、現在は視覚的に廃止されつつありますが、自動スキャナーへの保証のため銀行や金融機関が今も使用しています。",
  } as const,
  o2: {
    en: "**SSL termination** refers to where in your architecture TLS is decrypted. The three main approaches are: **(1) Terminate at the load balancer or reverse proxy** — the most common production pattern. The load balancer (AWS ALB, Nginx, HAProxy) holds the certificate, handles the TLS handshake, and forwards plain HTTP to backends over the internal network. Advantages: centralized certificate management (one cert to renew, one place to rotate), backends are simpler (no TLS code), CPU overhead of TLS offloaded from app servers, easy to swap certs without touching each backend. Caveat: internal traffic is unencrypted — acceptable if you trust your private network, but some compliance frameworks (PCI-DSS, HIPAA) may require encryption in transit even internally. **(2) Terminate at the application server** — the TLS certificate lives on each backend instance, which handles its own handshake. No plaintext on the internal network. Harder to operate at scale: you must deploy and rotate certs on every instance, and each server pays the TLS CPU cost. **(3) End-to-end TLS / SSL passthrough** — the proxy forwards encrypted bytes unchanged; the backend server decrypts TLS. Maximum security: no component in the middle can read request bodies, the proxy cannot inject headers or perform WAF inspection (because it cannot see inside the encrypted stream). Hardest to operate. **Let's Encrypt** issues free DV certificates automatically via the **ACME protocol**. The ACME client (most commonly **certbot**) proves domain ownership via an **HTTP-01 challenge** (the CA checks a token at `http://yourdomain/.well-known/acme-challenge/`) or a **DNS-01 challenge** (the CA checks a TXT record — required for wildcard certs). Certificates are valid for **90 days** — deliberately short to encourage automation and limit exposure from compromised certificates. Certbot sets up a systemd timer or cron job to renew automatically when a cert is within 30 days of expiry.",
    np: "**SSL termination** भनेको तपाईंको architecture मा TLS कहाँ decrypt हुन्छ। तीनवटा main approach छन्: **(1) Load balancer वा reverse proxy मा terminate** — सबैभन्दा common production pattern। Load balancer (AWS ALB, Nginx, HAProxy) ले certificate hold गर्छ, TLS handshake handle गर्छ, र internal network मार्फत backend मा plain HTTP forward गर्छ। Advantages: centralized certificate management (renew गर्न एउटा cert, rotate गर्न एउटा ठाउँ), backend simple हुन्छ (TLS code छैन), app server बाट TLS को CPU overhead offload हुन्छ, प्रत्येक backend touch नगरी cert swap गर्न सजिलो। Caveat: internal traffic unencrypted हुन्छ — private network trust गर्नुभएमा acceptable, तर केही compliance framework (PCI-DSS, HIPAA) ले internally पनि in-transit encryption चाहन सक्छ। **(2) Application server मा terminate** — TLS certificate प्रत्येक backend instance मा राखिन्छ, जसले आफ्नै handshake handle गर्छ। Internal network मा plaintext छैन। Scale मा operate गर्न गाह्रो: प्रत्येक instance मा cert deploy र rotate गर्नुपर्छ, र प्रत्येक server ले TLS CPU cost तिर्छ। **(3) End-to-end TLS / SSL passthrough** — proxy ले encrypted byte unchanged forward गर्छ; backend server ले TLS decrypt गर्छ। Maximum security: बीचको कुनै component ले request body पढ्न सक्दैन, proxy ले header inject गर्न वा WAF inspection perform गर्न सक्दैन (किनभने encrypted stream भित्र देख्न सक्दैन)। Operate गर्न सबैभन्दा गाह्रो। **Let's Encrypt** ले **ACME protocol** मार्फत automatically free DV certificate issue गर्छ। ACME client (सबैभन्दा commonly **certbot**) ले **HTTP-01 challenge** (CA ले `http://yourdomain/.well-known/acme-challenge/` मा token check गर्छ) वा **DNS-01 challenge** (CA ले TXT record check गर्छ — wildcard cert को लागि required) मार्फत domain ownership prove गर्छ। Certificate **90 दिन** को लागि valid हुन्छ — automation encourage गर्न र compromised certificate बाट exposure limit गर्न deliberately short। Certbot ले cert expiry भन्दा 30 दिन भित्र automatically renew गर्न systemd timer वा cron job setup गर्छ।",
    jp: "**SSL 終端**とはアーキテクチャのどこで TLS が復号されるかを指します。3 つの主なアプローチがあります：**(1) ロードバランサーまたはリバースプロキシで終端** — 最も一般的な本番パターン。ロードバランサー（AWS ALB・Nginx・HAProxy）が証明書を保持し、TLS ハンドシェイクを処理し、内部ネットワーク経由でバックエンドにプレーン HTTP を転送します。利点：集中的な証明書管理（更新する証明書は 1 つ、ローテーションする場所は 1 つ）、バックエンドがシンプル（TLS コード不要）、アプリサーバーから TLS の CPU オーバーヘッドをオフロード、各バックエンドに触れずに証明書を交換しやすい。注意点：内部トラフィックが暗号化されていない — プライベートネットワークを信頼する場合は許容できますが、一部のコンプライアンスフレームワーク（PCI-DSS・HIPAA）は内部でも転送中の暗号化を要求する場合があります。**(2) アプリケーションサーバーで終端** — TLS 証明書は各バックエンドインスタンスに置かれ、独自のハンドシェイクを処理します。内部ネットワークに平文はありません。大規模での運用は困難：すべてのインスタンスに証明書をデプロイしてローテーションする必要があり、各サーバーが TLS の CPU コストを負担します。**(3) エンドツーエンド TLS / SSL パススルー** — プロキシは暗号化されたバイトをそのまま転送し、バックエンドサーバーが TLS を復号します。最大のセキュリティ：中間のコンポーネントはリクエストボディを読めず、プロキシはヘッダーを注入したり WAF インスペクションを実行できません（暗号化されたストリームの内部が見えないため）。最も運用が困難。**Let's Encrypt** は **ACME プロトコル**を通じて無料の DV 証明書を自動的に発行します。ACME クライアント（最もよく使われる **certbot**）は **HTTP-01 チャレンジ**（CA が `http://yourdomain/.well-known/acme-challenge/` のトークンを確認）または **DNS-01 チャレンジ**（CA が TXT レコードを確認 — ワイルドカード証明書に必要）でドメイン所有権を証明します。証明書は **90 日間**有効 — 自動化を促進し、侵害された証明書による露出を制限するために意図的に短くしています。Certbot は証明書の有効期限の 30 日以内に自動更新する systemd タイマーまたは cron ジョブを設定します。",
  } as const,
};

export const DEVOPS_DAY_69_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "TLS certificate types & termination architectures",
        np: "TLS certificate types र termination architecture",
        jp: "TLS 証明書の種類と終端アーキテクチャ",
      },
      blocks: [
        { type: "diagram", id: "devops-ssl-termination" },
        {
          type: "table",
          caption: {
            en: "TLS termination locations — tradeoffs & use cases",
            np: "TLS termination location — tradeoff र use case",
            jp: "TLS 終端の場所 — トレードオフとユースケース",
          },
          headers: [
            { en: "Termination point", np: "Termination point", jp: "終端ポイント" },
            { en: "How it works", np: "कसरी काम गर्छ", jp: "動作方法" },
            { en: "Advantages", np: "Advantages", jp: "利点" },
            { en: "Disadvantages", np: "Disadvantages", jp: "欠点" },
          ],
          rows: [
            [
              { en: "Load balancer (AWS ALB, Nginx, HAProxy)", np: "Load balancer (AWS ALB, Nginx, HAProxy)", jp: "ロードバランサー（AWS ALB・Nginx・HAProxy）" },
              { en: "LB decrypts TLS; backend receives plain HTTP on internal network", np: "LB ले TLS decrypt गर्छ; backend ले internal network मा plain HTTP receive गर्छ", jp: "LB が TLS を復号；バックエンドは内部ネットワーク上でプレーン HTTP を受信" },
              { en: "Centralized cert management, one cert for all backends, offloads CPU from app servers, easy cert rotation", np: "Centralized cert management, सबै backend को लागि एउटा cert, app server बाट CPU offload, cert rotation सजिलो", jp: "集中的な証明書管理・すべてのバックエンドに 1 つの証明書・アプリサーバーから CPU オフロード・証明書ローテーションが容易" },
              { en: "Internal traffic is unencrypted — trust your internal network; compliance requirements may mandate end-to-end encryption", np: "Internal traffic unencrypted — internal network trust गर्नुपर्छ; compliance requirement ले end-to-end encryption mandate गर्न सक्छ", jp: "内部トラフィックが暗号化されていない — 内部ネットワークを信頼する必要あり；コンプライアンス要件がエンドツーエンド暗号化を義務付ける場合がある" },
            ],
            [
              { en: "Application server (each instance)", np: "Application server (प्रत्येक instance)", jp: "アプリケーションサーバー（各インスタンス）" },
              { en: "Each backend handles its own TLS", np: "प्रत्येक backend ले आफ्नै TLS handle गर्छ", jp: "各バックエンドが独自の TLS を処理" },
              { en: "No unencrypted internal traffic, strong isolation", np: "Unencrypted internal traffic छैन, strong isolation", jp: "暗号化されていない内部トラフィックなし・強力な分離" },
              { en: "Cert must be deployed to every instance, harder rotation, each server pays TLS CPU overhead", np: "प्रत्येक instance मा cert deploy गर्नुपर्छ, rotation गाह्रो, प्रत्येक server ले TLS CPU overhead तिर्छ", jp: "すべてのインスタンスに証明書をデプロイする必要あり・ローテーションが困難・各サーバーが TLS の CPU オーバーヘッドを負担" },
            ],
            [
              { en: "SSL passthrough", np: "SSL passthrough", jp: "SSL パススルー" },
              { en: "Proxy forwards encrypted bytes, backend decrypts", np: "Proxy ले encrypted byte forward गर्छ, backend ले decrypt गर्छ", jp: "プロキシが暗号化されたバイトを転送・バックエンドが復号" },
              { en: "No decryption at proxy — backend IP hidden from network snooping, true end-to-end", np: "Proxy मा decryption छैन — network snooping बाट backend IP hidden, true end-to-end", jp: "プロキシでの復号なし — ネットワーク盗聴からバックエンド IP が隠蔽・真のエンドツーエンド" },
              { en: "Proxy can't read HTTP headers (no routing, no caching, no WAF inspection possible)", np: "Proxy ले HTTP header पढ्न सक्दैन (routing, caching, WAF inspection possible छैन)", jp: "プロキシが HTTP ヘッダーを読めない（ルーティング・キャッシング・WAF インスペクション不可）" },
            ],
            [
              { en: "Mutual TLS (mTLS)", np: "Mutual TLS (mTLS)", jp: "相互 TLS（mTLS）" },
              { en: "Both server and client present certificates", np: "Server र client दुवैले certificate present गर्छन्", jp: "サーバーとクライアントの両方が証明書を提示" },
              { en: "Service-to-service authentication — client must prove identity", np: "Service-to-service authentication — client ले identity prove गर्नुपर्छ", jp: "サービス間認証 — クライアントが身元を証明しなければならない" },
              { en: "Requires PKI infrastructure, certificate rotation for both sides, significant ops overhead", np: "PKI infrastructure चाहिन्छ, दुवै side को certificate rotation, significant ops overhead", jp: "PKI インフラが必要・両側の証明書ローテーション・大幅な運用オーバーヘッド" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Let's Encrypt, certbot & Nginx SSL configuration",
        np: "Let's Encrypt, certbot र Nginx SSL configuration",
        jp: "Let's Encrypt・certbot と Nginx SSL 設定",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Let's Encrypt + certbot automation, Nginx SSL config & certificate inspection",
            np: "Let's Encrypt + certbot automation, Nginx SSL config र certificate inspection",
            jp: "Let's Encrypt + certbot 自動化・Nginx SSL 設定・証明書の検査",
          },
          code: `# ── Install certbot ───────────────────────────────────────────────
sudo apt install certbot python3-certbot-nginx -y

# ── Issue certificate with Nginx plugin (HTTP-01 challenge) ───────
sudo certbot --nginx -d example.com -d www.example.com
# certbot edits your nginx config automatically, sets up redirect,
# and installs the certificate + renewal timer

# ── Issue wildcard cert with DNS challenge (requires DNS access) ──
sudo certbot certonly --manual --preferred-challenges dns \\
  -d "*.example.com"
# certbot asks you to add a DNS TXT record:
# _acme-challenge.example.com  TXT  "<token>"
# Once the record propagates, the CA validates and issues the cert

# ── Auto-renewal ──────────────────────────────────────────────────
sudo certbot renew --dry-run           # simulate renewal (safe)
sudo systemctl status certbot.timer    # check systemd renewal timer
# Cron alternative (if not using systemd):
# crontab -e
# 0 0,12 * * * certbot renew --quiet   # run twice daily

# ── Certificate file locations ────────────────────────────────────
# /etc/letsencrypt/live/example.com/
#   fullchain.pem  — your cert + intermediate chain (use this in Nginx)
#   privkey.pem    — your private key (keep secret!)
#   chain.pem      — intermediate CA cert only
#   cert.pem       — your domain cert only (without chain)

# ── Nginx HTTPS server block ──────────────────────────────────────
server {
    listen 80;
    server_name example.com www.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name example.com www.example.com;

    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Only allow TLS 1.2 and 1.3 — drop older insecure versions
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers   ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:!aNULL:!MD5:!RC4;
    ssl_prefer_server_ciphers on;

    # Session resumption — reduces handshake cost for repeat visitors
    ssl_session_cache   shared:SSL:10m;
    ssl_session_timeout 1d;

    # OCSP stapling — pre-fetch revocation status, eliminate CA round-trip
    ssl_stapling on;
    ssl_stapling_verify on;
    ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem;
    resolver 8.8.8.8 1.1.1.1 valid=300s;
    resolver_timeout 5s;

    # HSTS — tell browsers to use HTTPS for 2 years, include subdomains
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# ── Inspect a live certificate ────────────────────────────────────
openssl s_client -connect example.com:443 </dev/null | \\
  openssl x509 -noout -dates -subject -issuer
# Output:
# notBefore=Jan  1 00:00:00 2026 GMT
# notAfter=Apr  1 00:00:00 2026 GMT       ← 90-day Let's Encrypt cert
# subject=CN=example.com
# issuer=C=US, O=Let's Encrypt, CN=R10

# ── Check certificate expiry only ────────────────────────────────
echo | openssl s_client -connect example.com:443 2>/dev/null | \\
  openssl x509 -noout -enddate

# ── Generate self-signed certificate for local development ────────
openssl req -x509 -newkey rsa:4096 \\
  -keyout key.pem -out cert.pem \\
  -days 365 -nodes \\
  -subj "/CN=localhost"
# -nodes = no passphrase (needed for unattended server startup)
# Use in Nginx: ssl_certificate cert.pem; ssl_certificate_key key.pem;

# ── Test SSL configuration quality ───────────────────────────────
# Visit https://ssllabs.com/ssltest/ in a browser and enter your domain.
# Grading: A+ (HSTS preload + strong ciphers), A, B, C, F
# Checks: supported protocols, cipher strength, certificate chain,
#         HSTS, OCSP stapling, forward secrecy, vulnerability scans
#         (POODLE, BEAST, Heartbleed, ROBOT, etc.)`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Generate a self-signed certificate for `localhost` using openssl. Configure Nginx to serve HTTPS on port 443 with this certificate. Visit `https://localhost` — the browser will warn about the self-signed cert (expected). Use `curl -k https://localhost` to bypass the warning and test the connection. Then inspect the certificate with `openssl s_client -connect localhost:443 </dev/null | openssl x509 -noout -text | grep -A5 \"Validity\"` to see the validity dates, subject, and signature algorithm.",
              np: "`openssl` प्रयोग गरेर `localhost` को लागि self-signed certificate generate गर्नुहोस्। यो certificate सहित port 443 मा HTTPS serve गर्न Nginx configure गर्नुहोस्। `https://localhost` visit गर्नुहोस् — browser ले self-signed cert को बारेमा warn गर्नेछ (expected)। Warning bypass गरेर connection test गर्न `curl -k https://localhost` प्रयोग गर्नुहोस्। त्यसपछि validity date, subject, र signature algorithm हेर्न `openssl s_client -connect localhost:443 </dev/null | openssl x509 -noout -text | grep -A5 \"Validity\"` सँग certificate inspect गर्नुहोस्।",
              jp: "openssl を使って `localhost` の自己署名証明書を生成する。この証明書でポート 443 で HTTPS を提供するように Nginx を設定する。`https://localhost` を訪問する — ブラウザは自己署名証明書について警告します（想定内）。`curl -k https://localhost` で警告をバイパスして接続をテストする。次に `openssl s_client -connect localhost:443 </dev/null | openssl x509 -noout -text | grep -A5 \"Validity\"` で証明書を検査して有効期間・サブジェクト・署名アルゴリズムを確認する。",
            },
            {
              en: "If you have a domain, use certbot with the `--standalone` flag to obtain a Let's Encrypt certificate (`certbot certonly --standalone -d yourdomain.com`). Observe the HTTP-01 challenge process in the logs. Configure Nginx to use the issued certificate. Then simulate renewal with `certbot renew --dry-run` and verify it succeeds. Check the renewal timer: `systemctl list-timers | grep certbot`. Understand why Let's Encrypt certificates are only valid for 90 days (encourages automation, limits exposure from compromised certs).",
              np: "Domain भएमा, Let's Encrypt certificate प्राप्त गर्न `--standalone` flag सहित certbot प्रयोग गर्नुहोस् (`certbot certonly --standalone -d yourdomain.com`)। Log मा HTTP-01 challenge process observe गर्नुहोस्। Issued certificate प्रयोग गर्न Nginx configure गर्नुहोस्। त्यसपछि `certbot renew --dry-run` सँग renewal simulate गर्नुहोस् र successful भएको verify गर्नुहोस्। Renewal timer check गर्नुहोस्: `systemctl list-timers | grep certbot`। Let's Encrypt certificate किन 90 दिन मात्र valid हुन्छ बुझ्नुहोस् (automation encourage, compromised cert बाट exposure limit)।",
              jp: "ドメインがあれば、`--standalone` フラグで certbot を使って Let's Encrypt 証明書を取得する（`certbot certonly --standalone -d yourdomain.com`）。ログで HTTP-01 チャレンジプロセスを観察する。発行された証明書を使うように Nginx を設定する。次に `certbot renew --dry-run` で更新をシミュレートして成功を確認する。更新タイマーを確認する：`systemctl list-timers | grep certbot`。Let's Encrypt 証明書が 90 日しか有効でない理由を理解する（自動化を促進・侵害された証明書による露出を制限）。",
            },
            {
              en: "Test TLS configuration quality. Configure Nginx with `ssl_protocols TLSv1.2 TLSv1.3` only (disable TLSv1.0 and TLSv1.1). Attempt to connect with an old TLS version: `openssl s_client -connect localhost:443 -tls1_1` — it should fail with a protocol error. Then enable OCSP stapling in Nginx (`ssl_stapling on; ssl_stapling_verify on; resolver 8.8.8.8`). Verify stapling is working: `openssl s_client -connect localhost:443 -status </dev/null | grep -A5 \"OCSP Response\"`. Add the HSTS header and verify it appears in `curl -I https://localhost`.",
              np: "TLS configuration quality test गर्नुहोस्। `ssl_protocols TLSv1.2 TLSv1.3` मात्र सहित Nginx configure गर्नुहोस् (TLSv1.0 र TLSv1.1 disable गर्नुहोस्)। Old TLS version सँग connect गर्ने प्रयास गर्नुहोस्: `openssl s_client -connect localhost:443 -tls1_1` — यो protocol error सहित fail हुनुपर्छ। त्यसपछि Nginx मा OCSP stapling enable गर्नुहोस् (`ssl_stapling on; ssl_stapling_verify on; resolver 8.8.8.8`)। Stapling काम गरिरहेको verify गर्नुहोस्: `openssl s_client -connect localhost:443 -status </dev/null | grep -A5 \"OCSP Response\"`। HSTS header add गर्नुहोस् र `curl -I https://localhost` मा देखिन्छ verify गर्नुहोस्।",
              jp: "TLS 設定の品質をテストする。`ssl_protocols TLSv1.2 TLSv1.3` のみで Nginx を設定する（TLSv1.0 と TLSv1.1 を無効化）。古い TLS バージョンで接続を試みる：`openssl s_client -connect localhost:443 -tls1_1` — プロトコルエラーで失敗すべき。次に Nginx で OCSP スタープリングを有効化する（`ssl_stapling on; ssl_stapling_verify on; resolver 8.8.8.8`）。スタープリングが機能していることを確認する：`openssl s_client -connect localhost:443 -status </dev/null | grep -A5 \"OCSP Response\"`。HSTS ヘッダーを追加して `curl -I https://localhost` に表示されることを確認する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is OCSP stapling and why should you enable it?",
        np: "OCSP stapling के हो र किन enable गर्नुपर्छ?",
        jp: "OCSP スタープリングとは何か、なぜ有効にすべきか？",
      },
      answer: {
        en: "**OCSP (Online Certificate Status Protocol)** is how browsers verify that a certificate hasn't been revoked before it expires. Normally, when a user visits your site, their browser separately contacts the CA's OCSP server to check revocation status — this adds latency (100–300ms) and leaks which sites users visit to the CA. **OCSP stapling** solves this: your server pre-fetches the OCSP response from the CA, cryptographically signs it, and includes ('staples') it in the TLS handshake. The browser gets proof of non-revocation directly from your server, with no additional network request. Benefits: eliminates the OCSP round-trip latency, improves privacy (CA doesn't see individual user connections), works even if the CA's OCSP server is temporarily down. Enable in Nginx: `ssl_stapling on; ssl_stapling_verify on; ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem; resolver 8.8.8.8 1.1.1.1 valid=300s;`. The `resolver` directive is required — Nginx needs a DNS resolver to reach the CA's OCSP server.",
        np: "**OCSP (Online Certificate Status Protocol)** ले browser ले certificate expire हुनुअघि revoke भएको छैन verify गर्ने तरिका हो। सामान्यतया, user ले तपाईंको site visit गर्दा, browser ले revocation status check गर्न CA को OCSP server छुट्टै contact गर्छ — यसले latency (100–300ms) थप्छ र user ले कुन site visit गर्छ CA लाई leak गर्छ। **OCSP stapling** ले यो solve गर्छ: तपाईंको server ले CA बाट OCSP response pre-fetch गर्छ, cryptographically sign गर्छ, र TLS handshake मा include ('staple') गर्छ। Browser ले थप network request बिना directly तपाईंको server बाट non-revocation को proof पाउँछ। Benefits: OCSP round-trip latency eliminate, privacy improve (CA ले individual user connection देख्दैन), CA को OCSP server temporarily down भए पनि काम गर्छ। Nginx मा enable: `ssl_stapling on; ssl_stapling_verify on; ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem; resolver 8.8.8.8 1.1.1.1 valid=300s;`। `resolver` directive required छ — CA को OCSP server reach गर्न Nginx लाई DNS resolver चाहिन्छ।",
        jp: "**OCSP（Online Certificate Status Protocol）**はブラウザが証明書が期限切れになる前に失効していないことを確認する方法です。通常、ユーザーがサイトを訪問すると、ブラウザは別途 CA の OCSP サーバーに接触して失効状態を確認します — これにより遅延（100〜300ms）が増加し、ユーザーがどのサイトを訪問するかが CA に漏洩します。**OCSP スタープリング**はこれを解決します：サーバーが CA から OCSP レスポンスを事前に取得し、暗号的に署名して TLS ハンドシェイクに含めます（「ステープル」）。ブラウザは追加のネットワークリクエストなしにサーバーから直接非失効の証明を受け取ります。利点：OCSP ラウンドトリップの遅延を排除・プライバシーを改善（CA が個々のユーザー接続を見ない）・CA の OCSP サーバーが一時的にダウンしていても機能します。Nginx での有効化：`ssl_stapling on; ssl_stapling_verify on; ssl_trusted_certificate /etc/letsencrypt/live/example.com/chain.pem; resolver 8.8.8.8 1.1.1.1 valid=300s;`。`resolver` ディレクティブは必須 — Nginx が CA の OCSP サーバーに到達するために DNS リゾルバーが必要です。",
      },
      tag: {
        en: "OCSP stapling",
        np: "OCSP Stapling",
        jp: "OCSP スタープリング",
      },
    },
    {
      question: {
        en: "What is the difference between a certificate, a certificate chain, and a CA bundle?",
        np: "Certificate, certificate chain, र CA bundle बीचको फरक के हो?",
        jp: "証明書・証明書チェーン・CA バンドルの違いは何か？",
      },
      answer: {
        en: "A **certificate** (`cert.pem`) is your domain's public key signed by an intermediate CA. It proves your server is who it claims to be. A **certificate chain** (`fullchain.pem`) is your domain certificate PLUS the intermediate CA certificates concatenated together. Browsers trust root CAs (built into the OS/browser). Intermediate CAs are trusted because they're signed by root CAs. Your server cert is trusted because it's signed by the intermediate CA. The chain provides the complete trust path. **Always use fullchain.pem** in production — sending just `cert.pem` causes 'incomplete certificate chain' errors on some clients (mobile browsers, curl, Java) that don't cache intermediates. The **CA bundle** (also called trust store) is the collection of trusted root CA certificates built into your OS, browser, or language runtime. `curl` uses the system CA bundle. When you generate a self-signed cert, it's not in any CA bundle, which is why browsers show a warning. In internal PKI (HashiCorp Vault, step-ca), you add your internal root CA to the trust store of all your services.",
        np: "**Certificate** (`cert.pem`) तपाईंको domain को public key हो जुन intermediate CA ले sign गरेको छ। यसले तपाईंको server claim गरेको person हो prove गर्छ। **Certificate chain** (`fullchain.pem`) तपाईंको domain certificate PLUS intermediate CA certificate concatenate गरिएको हो। Browser ले root CA trust गर्छ (OS/browser मा built-in)। Intermediate CA लाई trust गरिन्छ किनभने root CA ले sign गरेको छ। तपाईंको server cert लाई trust गरिन्छ किनभने intermediate CA ले sign गरेको छ। Chain ले complete trust path provide गर्छ। Production मा **सधैँ fullchain.pem प्रयोग गर्नुहोस्** — केवल `cert.pem` पठाउँदा intermediate cache नगर्ने केही client (mobile browser, curl, Java) मा 'incomplete certificate chain' error आउँछ। **CA bundle** (trust store पनि भनिन्छ) OS, browser, वा language runtime मा built-in trusted root CA certificate को collection हो। `curl` ले system CA bundle प्रयोग गर्छ। Self-signed cert generate गर्दा यो कुनै CA bundle मा हुँदैन, त्यसैले browser ले warning देखाउँछ। Internal PKI (HashiCorp Vault, step-ca) मा, तपाईंले आफ्नो internal root CA सबै service को trust store मा add गर्नुहोस्।",
        jp: "**証明書**（`cert.pem`）は中間 CA が署名したドメインの公開鍵です。サーバーが主張する通りの者であることを証明します。**証明書チェーン**（`fullchain.pem`）はドメイン証明書に中間 CA 証明書を連結したものです。ブラウザはルート CA を信頼します（OS/ブラウザに組み込み）。中間 CA はルート CA が署名しているため信頼されます。サーバー証明書は中間 CA が署名しているため信頼されます。チェーンは完全な信頼パスを提供します。本番では**常に fullchain.pem を使用** — `cert.pem` だけを送ると中間証明書をキャッシュしない一部のクライアント（モバイルブラウザ・curl・Java）で「不完全な証明書チェーン」エラーが発生します。**CA バンドル**（トラストストアとも呼ばれる）は OS・ブラウザ・言語ランタイムに組み込まれた信頼できるルート CA 証明書のコレクションです。`curl` はシステムの CA バンドルを使用します。自己署名証明書を生成すると CA バンドルに含まれていないため、ブラウザが警告を表示します。内部 PKI（HashiCorp Vault・step-ca）では、すべてのサービスのトラストストアに内部ルート CA を追加します。",
      },
      tag: {
        en: "cert chain vs CA bundle",
        np: "Cert Chain vs CA Bundle",
        jp: "証明書チェーン vs CA バンドル",
      },
    },
  ],
};
