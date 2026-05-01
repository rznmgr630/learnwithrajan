import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "DNS (Domain Name System) is the phonebook of the internet — it translates human-readable names like `api.example.com` into the IP addresses machines actually use. Nearly every network failure in production eventually traces back to a DNS issue: wrong record, expired TTL, misconfigured zone, or a resolver that can't reach the authoritative server.",
    np: "DNS (Domain Name System) internet को phonebook हो — यसले `api.example.com` जस्ता human-readable name लाई machine ले actual प्रयोग गर्ने IP address मा translate गर्छ। Production मा लगभग हरेक network failure अन्ततः DNS issue मा trace हुन्छ: wrong record, expired TTL, misconfigured zone, वा authoritative server reach गर्न नसक्ने resolver।",
    jp: "DNS（ドメイン名システム）はインターネットの電話帳です — `api.example.com` のような人間が読めるな名前を、機械が実際に使う IP アドレスに変換します。本番環境のほぼすべてのネットワーク障害は最終的に DNS の問題にたどり着きます：誤ったレコード・期限切れの TTL・設定ミスのゾーン・権威サーバーに到達できないリゾルバー。",
  } as const,
  o2: {
    en: "Today you learn how DNS resolution works end-to-end, the record types you will configure on every project, how TTL affects deployment speed, and how to use `dig` to diagnose any DNS problem in under 30 seconds.",
    np: "आज तपाईंले DNS resolution end-to-end कसरी काम गर्छ, हरेक project मा configure गर्ने record type, TTL ले deployment speed कसरी affect गर्छ, र कुनै पनि DNS problem 30 second भित्र diagnose गर्न `dig` कसरी प्रयोग गर्ने सिक्नुहुनेछ।",
    jp: "本日は DNS 解決がエンドツーエンドでどのように機能するか・すべてのプロジェクトで設定するレコードタイプ・TTL がデプロイ速度にどのように影響するか・30 秒以内に任意の DNS 問題を診断するために `dig` をどのように使うかを学びます。",
  } as const,
};

export const DEVOPS_DAY_10_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "How DNS resolution works — the full journey",
        np: "DNS resolution कसरी काम गर्छ — पूरा यात्रा",
        jp: "DNS 解決の仕組み — 完全な旅",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When your application calls `getaddrinfo('api.example.com')`, the OS first checks `/etc/hosts`, then queries the configured resolver (usually `127.0.0.53` — a local stub that forwards to your upstream resolver). If the answer isn't cached, a full recursive lookup begins: the resolver asks a root nameserver, which refers it to the `.com` TLD server, which refers it to `example.com`'s authoritative nameserver, which finally answers with the IP.",
            np: "तपाईंको application ले `getaddrinfo('api.example.com')` call गर्दा, OS ले पहिले `/etc/hosts` check गर्छ, त्यसपछि configured resolver (सामान्यतया `127.0.0.53` — एउटा local stub जसले upstream resolver मा forward गर्छ) query गर्छ। Answer cached छैन भने, पूरा recursive lookup सुरु हुन्छ: resolver ले root nameserver सोध्छ, जसले `.com` TLD server refer गर्छ, जसले `example.com` को authoritative nameserver refer गर्छ, जसले अन्ततः IP सँग answer दिन्छ।",
            jp: "アプリケーションが `getaddrinfo('api.example.com')` を呼び出すと、OS はまず `/etc/hosts` を確認し、次に設定されたリゾルバー（通常は `127.0.0.53` — アップストリームリゾルバーに転送するローカルスタブ）にクエリを送ります。回答がキャッシュされていない場合、完全な再帰的ルックアップが始まります：リゾルバーがルートネームサーバーに問い合わせ、`.com` TLD サーバーに参照し、`example.com` の権威ネームサーバーに参照し、最終的に IP アドレスで回答が返ります。",
          },
        },
        {
          type: "diagram",
          id: "devops-dns-resolution",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Resolution order on Linux**: `/etc/hosts` → stub resolver (`systemd-resolved` or `dnsmasq`) → recursive resolver (your ISP, 8.8.8.8, or your VPC's DNS) → authoritative nameserver. The `nsswitch.conf` file controls which sources are consulted and in what order.",
              np: "**Linux मा Resolution order**: `/etc/hosts` → stub resolver (`systemd-resolved` वा `dnsmasq`) → recursive resolver (तपाईंको ISP, 8.8.8.8, वा VPC को DNS) → authoritative nameserver। `nsswitch.conf` file ले कुन source consult गर्ने र कुन order मा control गर्छ।",
              jp: "**Linux での解決順序**: `/etc/hosts` → スタブリゾルバー（`systemd-resolved` または `dnsmasq`）→ 再帰的リゾルバー（ISP・8.8.8.8・または VPC の DNS）→ 権威ネームサーバー。`nsswitch.conf` ファイルがどのソースをどの順番で参照するかを制御します。",
            },
            {
              en: "**The 13 root nameservers** (a.root-servers.net through m.root-servers.net) are the starting point of every DNS query that isn't cached. In practice, each is an anycast cluster of hundreds of machines worldwide — the resolvers hit the geographically nearest one.",
              np: "**13 root nameserver** (a.root-servers.net बाट m.root-servers.net सम्म) cached नभएको हरेक DNS query को starting point हो। व्यवहारमा, प्रत्येक worldwide hundreds of machine को anycast cluster हो — resolver ले geographically nearest एउटा hit गर्छ।",
              jp: "**13 のルートネームサーバー**（a.root-servers.net から m.root-servers.net まで）は、キャッシュされていないすべての DNS クエリの出発点です。実際には、それぞれが世界中の数百台のマシンの anycast クラスターで、リゾルバーは地理的に最も近いものにアクセスします。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "DNS record types — what to configure and why",
        np: "DNS record type — के configure गर्ने र किन",
        jp: "DNS レコードタイプ — 何を設定するか、なぜか",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Essential DNS record types for DevOps engineers",
            np: "DevOps engineer का लागि आवश्यक DNS record type",
            jp: "DevOps エンジニアのための必須 DNS レコードタイプ",
          },
          headers: [
            { en: "Record", np: "Record", jp: "レコード" },
            { en: "Full name", np: "पूरा नाम", jp: "正式名称" },
            { en: "Maps", np: "Map गर्छ", jp: "マッピング" },
            { en: "DevOps use case", np: "DevOps use case", jp: "DevOps のユースケース" },
          ],
          rows: [
            [
              { en: "A", np: "A", jp: "A" },
              { en: "Address", np: "Address", jp: "アドレス" },
              { en: "hostname → IPv4", np: "hostname → IPv4", jp: "ホスト名 → IPv4" },
              { en: "Point `api.example.com` to your server's IP; create multiple A records for round-robin DNS load balancing", np: "`api.example.com` लाई server IP मा point गर्नुहोस्; round-robin DNS load balancing का लागि multiple A record", jp: "`api.example.com` をサーバーの IP に向ける；ラウンドロビン DNS 負荷分散のために複数の A レコードを作成" },
            ],
            [
              { en: "AAAA", np: "AAAA", jp: "AAAA" },
              { en: "IPv6 Address", np: "IPv6 Address", jp: "IPv6 アドレス" },
              { en: "hostname → IPv6", np: "hostname → IPv6", jp: "ホスト名 → IPv6" },
              { en: "IPv6 equivalent of A record — add alongside A for dual-stack support", np: "A record को IPv6 equivalent — dual-stack support का लागि A सँगै थप्नुहोस्", jp: "A レコードの IPv6 版 — デュアルスタックサポートのために A と一緒に追加" },
            ],
            [
              { en: "CNAME", np: "CNAME", jp: "CNAME" },
              { en: "Canonical Name", np: "Canonical Name", jp: "正規名" },
              { en: "alias → real hostname", np: "alias → real hostname", jp: "エイリアス → 実際のホスト名" },
              { en: "`www.example.com` → `example.com`; CDN or cloud LB domains (never use at zone apex)", np: "`www.example.com` → `example.com`; CDN वा cloud LB domain (zone apex मा कहिल्यै प्रयोग नगर्नुहोस्)", jp: "`www.example.com` → `example.com`；CDN や クラウド LB のドメイン（ゾーン頂点では使用不可）" },
            ],
            [
              { en: "MX", np: "MX", jp: "MX" },
              { en: "Mail Exchange", np: "Mail Exchange", jp: "メール交換" },
              { en: "domain → mail server(s)", np: "domain → mail server", jp: "ドメイン → メールサーバー" },
              { en: "Route email for `@example.com` to your mail server; priority value determines ordering", np: "`@example.com` email mail server मा route गर्नुहोस्; priority value ले ordering निर्धारण गर्छ", jp: "`@example.com` のメールをメールサーバーにルーティング；優先度の値が順序を決める" },
            ],
            [
              { en: "TXT", np: "TXT", jp: "TXT" },
              { en: "Text", np: "Text", jp: "テキスト" },
              { en: "domain → arbitrary text", np: "domain → arbitrary text", jp: "ドメイン → 任意のテキスト" },
              { en: "Domain verification (Google, GitHub), SPF/DKIM/DMARC email authentication, ACME challenge for TLS certs", np: "Domain verification, SPF/DKIM/DMARC email authentication, TLS cert का लागि ACME challenge", jp: "ドメイン検証（Google・GitHub）・SPF/DKIM/DMARC メール認証・TLS 証明書の ACME チャレンジ" },
            ],
            [
              { en: "NS", np: "NS", jp: "NS" },
              { en: "Nameserver", np: "Nameserver", jp: "ネームサーバー" },
              { en: "zone → authoritative nameservers", np: "zone → authoritative nameserver", jp: "ゾーン → 権威ネームサーバー" },
              { en: "Delegate `example.com` to Route 53 or Cloudflare — set at your registrar", np: "`example.com` Route 53 वा Cloudflare मा delegate गर्नुहोस् — registrar मा set गर्नुहोस्", jp: "`example.com` を Route 53 または Cloudflare に委任する — レジストラーで設定" },
            ],
            [
              { en: "SOA", np: "SOA", jp: "SOA" },
              { en: "Start of Authority", np: "Start of Authority", jp: "権威の開始" },
              { en: "zone metadata", np: "zone metadata", jp: "ゾーンメタデータ" },
              { en: "Primary nameserver, admin email, zone serial, refresh/retry/expire timers — auto-managed by most DNS providers", np: "Primary nameserver, admin email, zone serial, refresh/retry/expire timer — अधिकांश DNS provider ले auto-managed", jp: "プライマリネームサーバー・管理者メール・ゾーンシリアル・更新/再試行/期限タイマー — ほとんどの DNS プロバイダーが自動管理" },
            ],
            [
              { en: "PTR", np: "PTR", jp: "PTR" },
              { en: "Pointer", np: "Pointer", jp: "ポインター" },
              { en: "IP → hostname (reverse DNS)", np: "IP → hostname (reverse DNS)", jp: "IP → ホスト名（逆引き DNS）" },
              { en: "Reverse DNS lookup — required for email deliverability, shows in traceroute output", np: "Reverse DNS lookup — email deliverability का लागि आवश्यक, traceroute output मा देखिन्छ", jp: "逆引き DNS ルックアップ — メール到達性に必要、traceroute 出力に表示される" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**CNAME at zone apex** (the root domain `example.com`, not `www.example.com`) is forbidden by the DNS standard because the apex must have an SOA and NS record. Cloud providers work around this with proprietary 'ALIAS' or 'ANAME' records (AWS Route 53 Alias, Cloudflare CNAME flattening) that resolve the CNAME target at query time and return an A record.",
              np: "**Zone apex मा CNAME** (root domain `example.com`, `www.example.com` होइन) DNS standard ले forbid गर्छ किनकि apex मा SOA र NS record हुनुपर्छ। Cloud provider ले proprietary 'ALIAS' वा 'ANAME' record (AWS Route 53 Alias, Cloudflare CNAME flattening) ले यो workaround गर्छन्।",
              jp: "**ゾーン頂点での CNAME**（`www.example.com` ではなくルートドメイン `example.com`）は、頂点には SOA と NS レコードが必要なため、DNS 標準で禁止されています。クラウドプロバイダーはクエリ時に CNAME ターゲットを解決して A レコードを返す独自の 'ALIAS' または 'ANAME' レコード（AWS Route 53 Alias・Cloudflare CNAME フラット化）でこれを回避します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "TTL — the hidden deployment variable",
        np: "TTL — लुकेको deployment variable",
        jp: "TTL — 隠れたデプロイ変数",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "TTL (Time To Live) is the number of seconds resolvers are allowed to cache a DNS record before re-querying the authoritative server. A TTL of 3600 means that after you change an A record, it can take up to one hour for all clients worldwide to see the new IP — because they will continue serving the cached answer until it expires.",
            np: "TTL (Time To Live) seconds को संख्या हो जति resolver ले authoritative server पुनः query गर्नु अघि DNS record cache गर्न allowed छ। 3600 TTL को अर्थ A record change गरेपछि, worldwide सबै client लाई नयाँ IP देख्न एक घण्टा लाग्न सक्छ — किनकि cached answer expire नभएसम्म serve गरिरहन्छ।",
            jp: "TTL（生存時間）は、リゾルバーが権威サーバーに再クエリする前に DNS レコードをキャッシュできる秒数です。TTL 3600 は、A レコードを変更した後、世界中のすべてのクライアントが新しい IP を見るまでに最大 1 時間かかる可能性があることを意味します — キャッシュされた回答はそれが期限切れになるまで提供され続けるからです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "TTL strategy for different scenarios",
            np: "फरक scenario का लागि TTL strategy",
            jp: "異なるシナリオに対する TTL 戦略",
          },
          headers: [
            { en: "Scenario", np: "Scenario", jp: "シナリオ" },
            { en: "Recommended TTL", np: "Recommended TTL", jp: "推奨 TTL" },
            { en: "Why", np: "किन", jp: "理由" },
          ],
          rows: [
            [
              { en: "Stable production service", np: "Stable production service", jp: "安定した本番サービス" },
              { en: "300–3600s (5–60 min)", np: "300–3600s (5–60 मिनेट)", jp: "300〜3600 秒（5〜60 分）" },
              { en: "Reduces resolver load, faster responses from cache", np: "Resolver load कम गर्छ, cache बाट छिटो response", jp: "リゾルバーの負荷を軽減し、キャッシュからの応答を高速化" },
            ],
            [
              { en: "Before a planned migration or failover", np: "Planned migration वा failover अघि", jp: "計画的な移行またはフェイルオーバーの前" },
              { en: "60–300s (1–5 min)", np: "60–300s (1–5 मिनेट)", jp: "60〜300 秒（1〜5 分）" },
              { en: "Lower TTL at least 24h before the change so old caches expire before you cut over", np: "Cutover गर्नु 24h अघि नै TTL कम गर्नुहोस् ताकि पुरानो cache expire होस्", jp: "切り替えの少なくとも 24 時間前に TTL を下げて、切り替え前に古いキャッシュを期限切れにする" },
            ],
            [
              { en: "Active failover / disaster recovery", np: "Active failover / disaster recovery", jp: "アクティブフェイルオーバー / 災害復旧" },
              { en: "30–60s", np: "30–60s", jp: "30〜60 秒" },
              { en: "Fast propagation when switching between regions or IPs under incident", np: "Incident को समयमा region वा IP बीच switch गर्दा छिटो propagation", jp: "インシデント中のリージョンや IP 間の切り替え時に高速に伝播" },
            ],
            [
              { en: "Internal/private DNS (VPC, k8s cluster)", np: "Internal/private DNS (VPC, k8s cluster)", jp: "内部/プライベート DNS（VPC・k8s クラスター）" },
              { en: "5–30s", np: "5–30s", jp: "5〜30 秒" },
              { en: "Fast service discovery when pod/container IPs change frequently", np: "Pod/container IP बारम्बार बदलिँदा fast service discovery", jp: "ポッド/コンテナの IP が頻繁に変わる場合の高速サービスディスカバリー" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**The TTL trap**: If you have TTL=86400 (24h) and need to do an emergency IP swap, even after you change the record your users are stuck with the old IP for up to 24 hours. The fix: always pre-lower TTL to 60s at least 24h before any planned change. Make this part of your runbook.",
              np: "**TTL trap**: यदि TTL=86400 (24h) छ र emergency IP swap गर्नुपर्छ भने, record बदले पनि users 24 घण्टासम्म पुरानो IP मा stuck हुन्छन्। Fix: planned change भन्दा कम्तिमा 24h अघि TTL 60s मा pre-lower गर्नुहोस्। यो runbook को part बनाउनुहोस्।",
              jp: "**TTL の罠**: TTL=86400（24 時間）で緊急の IP スワップが必要な場合、レコードを変更した後でもユーザーは最大 24 時間古い IP に縛られます。修正方法：計画的な変更の少なくとも 24 時間前に TTL を 60 秒に事前に下げてください。これをランブックの一部にしてください。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "dig — the DNS engineer's most important tool",
        np: "dig — DNS engineer को सबभन्दा महत्त्वपूर्ण tool",
        jp: "dig — DNS エンジニアの最も重要なツール",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Essential dig commands for DNS troubleshooting",
            np: "DNS troubleshooting का लागि आवश्यक dig command",
            jp: "DNS トラブルシューティングのための必須 dig コマンド",
          },
          code: `# Basic lookup — A record (IPv4)
dig example.com                     # full output with all sections
dig example.com A                   # explicit record type
dig +short example.com A            # just the IP(s), no noise

# Other record types
dig example.com AAAA                # IPv6
dig example.com MX                  # mail servers (shows priority)
dig example.com TXT                 # SPF, DKIM, verification records
dig example.com NS                  # authoritative nameservers
dig example.com SOA                 # zone serial and timers
dig -x 93.184.216.34                # reverse lookup (PTR): IP → hostname

# Query a specific resolver (bypass your system's resolver)
dig @8.8.8.8 example.com           # ask Google's resolver
dig @1.1.1.1 example.com           # ask Cloudflare's resolver
dig @ns1.example.com example.com   # ask the authoritative server directly

# Trace the full resolution chain from root
dig +trace example.com             # shows root → TLD → auth → answer

# Check TTL of a cached record (from your default resolver)
dig example.com | grep -A2 "ANSWER"
# The number in the ANSWER section is the remaining TTL

# Check DNSSEC validation
dig +dnssec example.com

# Useful flags
dig +noall +answer example.com     # answer section only (cleaner than +short for multi-record)
dig +short example.com MX          # prioritized list of mail servers
dig +tcp example.com               # force TCP (test for TCP-53 firewall blocks)

# Batch query multiple names
for domain in api.example.com www.example.com cdn.example.com; do
  echo "$domain: $(dig +short $domain A)"
done`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`nslookup` is deprecated** — use `dig` instead. `nslookup` gives less information, has different behavior across platforms, and doesn't show TTLs. `host` is a simpler alternative for quick lookups: `host example.com`.",
              np: "**`nslookup` deprecated छ** — बरु `dig` प्रयोग गर्नुहोस्। `nslookup` ले कम information दिन्छ, platform भर फरक behavior छ, र TTL देखाउँदैन। Quick lookup का लागि `host` simpler alternative हो: `host example.com`।",
              jp: "**`nslookup` は非推奨** — 代わりに `dig` を使ってください。`nslookup` は情報が少なく、プラットフォーム間で動作が異なり、TTL を表示しません。簡単なルックアップには `host` がよりシンプルな代替手段です：`host example.com`。",
            },
            {
              en: "**Reading `dig` output**: the `ANSWER SECTION` has your record. The number before the record type is the remaining TTL in seconds (`86400` = 24h, `300` = 5min). The `AUTHORITY SECTION` shows which nameservers are authoritative. `ADDITIONAL SECTION` shows glue records (IPs of nameservers).",
              np: "**`dig` output पढ्नुहोस्**: `ANSWER SECTION` मा तपाईंको record छ। Record type अघिको number remaining TTL seconds मा हो (`86400` = 24h, `300` = 5min)। `AUTHORITY SECTION` ले कुन nameserver authoritative छ देखाउँछ। `ADDITIONAL SECTION` ले glue record देखाउँछ।",
              jp: "**`dig` 出力の読み方**: `ANSWER SECTION` にレコードがあります。レコードタイプの前の数字は残りの TTL（秒）です（`86400` = 24 時間、`300` = 5 分）。`AUTHORITY SECTION` はどのネームサーバーが権威かを示します。`ADDITIONAL SECTION` はグルーレコード（ネームサーバーの IP）を示します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "DNS in production — resolv.conf, VPC DNS, and service discovery",
        np: "Production मा DNS — resolv.conf, VPC DNS, र service discovery",
        jp: "本番環境の DNS — resolv.conf・VPC DNS・サービスディスカバリー",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "DNS configuration files and service discovery patterns",
            np: "DNS configuration file र service discovery pattern",
            jp: "DNS 設定ファイルとサービスディスカバリーパターン",
          },
          code: `# /etc/resolv.conf — which DNS server to use
cat /etc/resolv.conf
# nameserver 127.0.0.53          ← systemd-resolved stub
# search us-east-1.compute.internal  ← search domains (AWS adds this)
# options ndots:5               ← treat names with <5 dots as relative

# /etc/hosts — override any DNS for specific names (evaluated first)
cat /etc/hosts
# 127.0.0.1 localhost
# ::1       localhost
# 10.0.1.50 db.internal         ← manual override (useful for testing)

# On Ubuntu: check which resolver is active
resolvectl status               # shows DNS servers per interface
resolvectl query example.com   # query via systemd-resolved
systemd-resolve --statistics   # cache hit rate and stats

# AWS VPC DNS (169.254.169.253 or the +2 address of your VPC CIDR)
# Every EC2 instance gets a search domain for its region:
# .us-east-1.compute.internal
# So: 'db-server' resolves → db-server.us-east-1.compute.internal
dig db-server                   # works inside VPC without FQDN

# Kubernetes internal DNS (CoreDNS)
# Service DNS: <service>.<namespace>.svc.cluster.local
# Pod DNS:     <pod-ip-dashed>.<namespace>.pod.cluster.local
# From inside a pod:
dig kubernetes.default.svc.cluster.local     # the API server
dig my-db.production.svc.cluster.local       # a service in 'production' ns

# Check DNS resolution from inside a container
docker run --rm alpine nslookup google.com    # what DNS does the container use?
kubectl exec -it mypod -- nslookup my-service # DNS inside a k8s pod

# Flush DNS cache (Ubuntu with systemd-resolved)
sudo resolvectl flush-caches
resolvectl statistics | grep "Cache Misses"   # verify flush worked`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Diagnose a DNS problem in 30 seconds",
        np: "Hands-on: 30 second मा DNS problem diagnose गर्नुहोस्",
        jp: "ハンズオン: 30 秒で DNS 問題を診断する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "DNS troubleshooting decision tree",
            np: "DNS troubleshooting decision tree",
            jp: "DNS トラブルシューティングの意思決定ツリー",
          },
          code: `# Symptom: "I can't reach api.example.com"
# Run this sequence to isolate DNS vs network vs app issues:

# Step 1 — Is it DNS or the network?
ping -c 1 api.example.com          # does it resolve AND respond?
ping -c 1 $(dig +short api.example.com A | head -1)  # ping by IP directly
# Resolves but IP ping fails? → network/firewall problem, not DNS
# Neither works? → DNS problem, check step 2

# Step 2 — Does the name resolve at all?
dig +short api.example.com A
# Empty output = NXDOMAIN (name doesn't exist) or servfail
dig api.example.com A              # full output — check status: NXDOMAIN / SERVFAIL / NOERROR

# Step 3 — Check what your resolver returns vs the authoritative server
dig @8.8.8.8 api.example.com A     # what does Google's resolver say?
dig @$(dig +short example.com NS | head -1) api.example.com A  # ask authoritative directly
# Different answers? → Propagation in progress, or cached stale record (check TTL)

# Step 4 — Trace the full chain
dig +trace api.example.com A       # watch where it breaks

# Step 5 — Is there a local override hiding things?
cat /etc/hosts | grep api.example.com   # is it overridden locally?
resolvectl query api.example.com        # what does the local resolver say?

# Step 6 — Is your resolver reachable?
dig @127.0.0.53 google.com         # can reach local stub?
dig @8.8.8.8 google.com            # can reach external resolver?
nc -zuv 8.8.8.8 53                 # UDP port 53 open?
nc -zv 8.8.8.8 53                  # TCP port 53 open? (some firewalls block this)`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a CNAME and an A record, and when should I use each?",
        np: "CNAME र A record बीच के फरक छ र कहिले कुन प्रयोग गर्ने?",
        jp: "CNAME と A レコードの違いは何か、それぞれをいつ使うべきか？",
      },
      answer: {
        en: "An A record directly maps a name to an IP address. A CNAME maps a name to another name — the resolver follows the chain until it finds an A record. Use A records when you know the IP (server with a static IP). Use CNAME for service aliases where the underlying IP can change (pointing `www.example.com` to a load balancer domain or CDN endpoint). Never use CNAME for the zone apex (`example.com`) — use an ALIAS/ANAME instead.",
        np: "A record ले directly name लाई IP address मा map गर्छ। CNAME ले name लाई अर्को name मा map गर्छ — resolver ले A record नभेटेसम्म chain follow गर्छ। IP थाहा छ भने A record (static IP सहितको server)। Underlying IP बदलिन सक्छ भने service alias का लागि CNAME (`www.example.com` लाई load balancer domain वा CDN endpoint मा point गर्न)। Zone apex (`example.com`) का लागि CNAME कहिल्यै प्रयोग नगर्नुहोस् — ALIAS/ANAME प्रयोग गर्नुहोस्।",
        jp: "A レコードは名前を直接 IP アドレスにマッピングします。CNAME は名前を別の名前にマッピングします — リゾルバーは A レコードが見つかるまでチェーンをたどります。IP がわかっているときは A レコードを使います（静的 IP のサーバー）。基礎となる IP が変わる可能性があるサービスエイリアスには CNAME を使います（`www.example.com` をロードバランサードメインや CDN エンドポイントに向ける場合）。ゾーン頂点（`example.com`）には絶対に CNAME を使わないでください — 代わりに ALIAS/ANAME を使います。",
      },
      tag: { en: "dns", np: "DNS", jp: "DNS" },
    },
    {
      question: {
        en: "What does NXDOMAIN mean and how do I fix it?",
        np: "NXDOMAIN को अर्थ के हो र कसरी fix गर्ने?",
        jp: "NXDOMAIN とはどういう意味か、どうすれば修正できるか？",
      },
      answer: {
        en: "NXDOMAIN (Non-Existent Domain) means the authoritative nameserver for that zone says the name does not exist. Common causes: typo in the hostname (check the record name vs what you queried), the DNS record was deleted, or you're querying the wrong zone (e.g., looking up `myapp.example.com` but the A record is under `myapp.example.co`). Run `dig +trace example.com` to see exactly which nameserver returned NXDOMAIN.",
        np: "NXDOMAIN (Non-Existent Domain) को अर्थ त्यो zone को authoritative nameserver ले name exist गर्दैन भन्छ। सामान्य कारण: hostname मा typo (record name vs query गरेको compare गर्नुहोस्), DNS record delete भयो, वा wrong zone query गर्दैहुनुहुन्छ। `dig +trace example.com` run गरी कुन nameserver ले NXDOMAIN return गर्यो हेर्नुहोस्।",
        jp: "NXDOMAIN（存在しないドメイン）は、そのゾーンの権威ネームサーバーがその名前は存在しないと言っていることを意味します。よくある原因：ホスト名のタイポ（レコード名とクエリしたものを比較）・DNS レコードが削除された・間違ったゾーンをクエリしている（例：`myapp.example.com` を調べているが A レコードは `myapp.example.co` にある）。`dig +trace example.com` を実行して、どのネームサーバーが NXDOMAIN を返したかを確認してください。",
      },
      tag: { en: "dns", np: "DNS", jp: "DNS" },
      callout: {
        en: "Quick check: `dig +short api.example.com A` — empty output = NXDOMAIN, check the record exists and the name is spelled correctly.",
        np: "Quick check: `dig +short api.example.com A` — empty output = NXDOMAIN, record exist छ र name सही spell भएको check गर्नुहोस्।",
        jp: "クイック確認：`dig +short api.example.com A` — 空の出力 = NXDOMAIN、レコードが存在し名前のスペルが正しいことを確認してください。",
      },
    },
    {
      question: {
        en: "What is DNSSEC and do I need it?",
        np: "DNSSEC के हो र मलाई चाहिन्छ?",
        jp: "DNSSEC とは何か、必要か？",
      },
      answer: {
        en: "DNSSEC (DNS Security Extensions) adds cryptographic signatures to DNS responses, allowing resolvers to verify that the answer they received actually came from the authoritative nameserver and wasn't tampered with in transit. Without DNSSEC, an attacker who can intercept DNS traffic (DNS cache poisoning, BGP hijacking) can redirect your users to a fake server. Most major DNS providers (Route 53, Cloudflare) offer DNSSEC with one-click setup. Enable it for any domain handling sensitive data or authentication.",
        np: "DNSSEC (DNS Security Extensions) ले DNS response मा cryptographic signature थप्छ, resolver ले verify गर्न सक्छ कि received answer वास्तवमा authoritative nameserver बाट आयो र transit मा tamper भएन। DNSSEC बिना, DNS traffic intercept गर्न सक्ने attacker (DNS cache poisoning, BGP hijacking) ले user लाई fake server मा redirect गर्न सक्छ। Enable गर्नुहोस् sensitive data वा authentication handle गर्ने domain का लागि।",
        jp: "DNSSEC（DNS セキュリティ拡張）は DNS 応答に暗号署名を追加し、受け取った回答が実際に権威ネームサーバーから来たものであり、転送中に改ざんされていないことをリゾルバーが検証できるようにします。DNSSEC なしでは、DNS トラフィックを傍受できる攻撃者（DNS キャッシュポイズニング・BGP ハイジャッキング）がユーザーを偽のサーバーにリダイレクトできます。機密データや認証を扱うドメインには有効にしてください。",
      },
      tag: { en: "dns", np: "DNS", jp: "DNS" },
    },
    {
      question: {
        en: "My DNS change is live on the authoritative server but users still see the old IP — why?",
        np: "Authoritative server मा DNS change live छ तर user अझैं पुरानो IP देख्छन् — किन?",
        jp: "DNS の変更は権威サーバーで有効なのに、ユーザーにはまだ古い IP が見える — なぜか？",
      },
      answer: {
        en: "Because the old TTL is still being honored by caching resolvers. If the previous TTL was 3600 seconds, every resolver that cached it can keep serving the old answer for up to one hour. You cannot force resolvers to flush their caches. The only fix going forward is to set low TTLs (60–300s) well before any planned change. After a change, verify propagation with `dig @8.8.8.8` (Google) and `dig @1.1.1.1` (Cloudflare) — if both show the new IP, most of the internet has updated.",
        np: "किनकि caching resolver ले पुरानो TTL अझैं honor गरिरहेको छ। Previous TTL 3600 seconds थियो भने, cache गरेको हरेक resolver ले एक घण्टासम्म पुरानो answer serve गर्न सक्छ। Resolver लाई cache flush गर्न force गर्न सकिँदैन। Planned change भन्दा धेरै अघि low TTL (60–300s) set गर्नुहोस्। Change पछि `dig @8.8.8.8` र `dig @1.1.1.1` ले propagation verify गर्नुहोस्।",
        jp: "古い TTL がキャッシュリゾルバーによってまだ守られているためです。以前の TTL が 3600 秒だった場合、それをキャッシュしたすべてのリゾルバーは最大 1 時間古い回答を提供し続けることができます。リゾルバーにキャッシュをフラッシュさせることはできません。唯一の対策は、計画的な変更の前に低い TTL（60〜300 秒）を設定することです。変更後は `dig @8.8.8.8`（Google）と `dig @1.1.1.1`（Cloudflare）で伝播を確認してください。",
      },
      tag: { en: "dns", np: "DNS", jp: "DNS" },
    },
  ],
};
