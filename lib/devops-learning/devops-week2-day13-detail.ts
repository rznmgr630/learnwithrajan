import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Network troubleshooting is a systematic skill, not guesswork. Every network problem reduces to a small set of questions: can I reach the host? Can I reach the port? Is DNS resolving correctly? Is the application speaking the right protocol? This day gives you a repeatable diagnostic process and a command for each step.",
    np: "Network troubleshooting एउटा systematic skill हो, अनुमान होइन। हरेक network problem केही प्रश्नमा सिमित हुन्छ: म host reach गर्न सक्छु? Port reach गर्न सक्छु? DNS सही resolve गर्दैछ? Application सही protocol बोल्दैछ? यो दिनले तपाईंलाई repeatable diagnostic process र हरेक step का लागि command दिन्छ।",
    jp: "ネットワークのトラブルシューティングは体系的なスキルであり、当てずっぽうではありません。すべてのネットワーク問題は小さな質問の集合に還元されます：ホストに到達できるか？ポートに到達できるか？DNS は正しく解決されているか？アプリケーションは正しいプロトコルを話しているか？この日は繰り返し使える診断プロセスと各ステップのコマンドを提供します。",
  } as const,
  o2: {
    en: "The approach: work from Layer 2 up. Is there connectivity at all (ping)? Is the port open (nc)? What is actually listening (ss)? What path does traffic take (traceroute)? What does DNS say (dig)? What do the raw packets look like (tcpdump)? Each layer narrows the problem.",
    np: "दृष्टिकोण: Layer 2 बाट माथि काम गर्नुहोस्। के connectivity छ (ping)? Port खुला छ (nc)? वास्तवमा के listen गर्दैछ (ss)? Traffic कुन path लिन्छ (traceroute)? DNS के भन्छ (dig)? Raw packet कस्तो देखिन्छ (tcpdump)? प्रत्येक layer ले समस्या सीमित गर्छ।",
    jp: "アプローチ：レイヤー 2 から上に向かって作業します。接続性はあるか（ping）？ポートは開いているか（nc）？実際に何がリッスンしているか（ss）？トラフィックはどのルートを通るか（traceroute）？DNS は何と言っているか（dig）？生のパケットはどう見えるか（tcpdump）？各レイヤーが問題を絞り込みます。",
  } as const,
};

export const DEVOPS_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The diagnostic ladder — a systematic process",
        np: "Diagnostic ladder — systematic process",
        jp: "診断ラダー — 体系的なプロセス",
      },
      blocks: [
        { type: "diagram", id: "devops-network-debug-flow" },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "**Layer 3 reachability** — `ping TARGET`. If this fails: routing issue, firewall blocking ICMP, or the host is down.",
              np: "**Layer 3 reachability** — `ping TARGET`। यो fail भयो भने: routing issue, ICMP block गर्ने firewall, वा host down।",
              jp: "**レイヤー 3 到達性** — `ping TARGET`。失敗する場合：ルーティング問題・ICMP をブロックするファイアウォール・ホストがダウン。",
            },
            {
              en: "**Port reachability** — `nc -zv TARGET PORT`. If this fails but ping works: firewall blocking the port, or nothing is listening.",
              np: "**Port reachability** — `nc -zv TARGET PORT`। ping काम गर्छ तर यो fail भयो भने: port block गर्ने firewall, वा कुनै listen गर्ने छैन।",
              jp: "**ポート到達性** — `nc -zv TARGET PORT`。ping が通るのにこれが失敗する場合：ポートをブロックするファイアウォール、またはリッスンしているものがない。",
            },
            {
              en: "**What is listening** — `ss -tlnp | grep PORT`. Something must bind a port before it can accept connections.",
              np: "**के listen गर्दैछ** — `ss -tlnp | grep PORT`। Connection accept गर्नु अघि port मा केही bind हुनैपर्छ।",
              jp: "**何がリッスンしているか** — `ss -tlnp | grep PORT`。接続を受け入れる前に何かがポートにバインドしている必要があります。",
            },
            {
              en: "**DNS resolution** — `dig TARGET`. If the app uses a hostname, wrong DNS means it connects to the wrong server.",
              np: "**DNS resolution** — `dig TARGET`। App ले hostname प्रयोग गर्छ भने गलत DNS ले गलत server मा connect गराउँछ।",
              jp: "**DNS 解決** — `dig TARGET`。アプリがホスト名を使う場合、DNS が誤っていると間違ったサーバーに接続されます。",
            },
            {
              en: "**Application layer** — `curl -v`, `openssl s_client`, or protocol-specific tools. Is the app responding correctly once you get a connection?",
              np: "**Application layer** — `curl -v`, `openssl s_client`, वा protocol-specific tool। Connection मिलेपछि app सही respond गर्दैछ?",
              jp: "**アプリケーション層** — `curl -v`・`openssl s_client`・プロトコル固有ツール。接続が確立した後、アプリは正しく応答しているか？",
            },
            {
              en: "**Packet capture** — `tcpdump` as the last resort when you can see traffic but can't understand why it fails.",
              np: "**Packet capture** — traffic देख्न सक्नुभयो तर किन fail हुन्छ बुझ्न सक्नुभएन भने `tcpdump` अन्तिम उपाय।",
              jp: "**パケットキャプチャ** — トラフィックは見えるが失敗の理由がわからないときの最終手段として `tcpdump`。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "ping, traceroute, and mtr — reachability and path",
        np: "ping, traceroute, र mtr — reachability र path",
        jp: "ping・traceroute・mtr — 到達性とパス",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Using ping and traceroute effectively",
            np: "ping र traceroute प्रभावकारी रूपमा प्रयोग गर्नुहोस्",
            jp: "ping と traceroute の効果的な使い方",
          },
          code: `# ping — ICMP echo: is the host up and how fast?
ping -c 5 google.com              # 5 packets
ping -c 5 -i 0.2 192.168.1.1     # faster: 200ms interval
ping -c 100 target | tail -3      # stats at the end (packet loss %)

# Important: many cloud providers block ICMP.
# ping failing ≠ host is down — check with nc -zv HOST 80 too.

# traceroute — show every hop between you and the target
traceroute google.com
traceroute -n google.com           # skip reverse DNS (much faster)
traceroute -T -p 443 google.com    # use TCP instead of UDP (bypasses some firewalls)
traceroute -I google.com           # use ICMP (like Windows tracert)

# mtr — live traceroute + packet loss per hop (install: apt install mtr)
mtr --report google.com            # generate report after 10 packets
mtr --report-wide --no-dns google.com
mtr -n google.com                  # live, no DNS

# Interpreting results:
# * * * on a hop = that router drops traceroute probes (normal for some networks)
# High latency at hop N but normal after = congestion or rate limiting at that router
# High latency FROM hop N onwards = problem is at or after that router`,
        },
      ],
    },
    {
      title: {
        en: "dig — authoritative DNS debugging",
        np: "dig — authoritative DNS debugging",
        jp: "dig — 権威ある DNS デバッグ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Diagnosing DNS with dig",
            np: "dig सँग DNS diagnose गर्नुहोस्",
            jp: "dig で DNS を診断する",
          },
          code: `# Basic lookup
dig example.com                    # A record from default resolver
dig example.com A                  # explicit record type
dig example.com AAAA               # IPv6
dig example.com MX                 # mail servers
dig example.com NS                 # authoritative name servers
dig example.com TXT                # TXT records (SPF, DKIM, ACME challenges)
dig example.com CNAME              # canonical name

# Query a specific DNS server
dig @8.8.8.8 example.com           # Google's public DNS
dig @1.1.1.1 example.com           # Cloudflare
dig @192.168.1.1 example.com       # your local resolver

# Short output (just the answer)
dig +short example.com
dig +short example.com MX

# Trace the full delegation chain (root → TLD → authoritative)
dig +trace example.com

# Reverse lookup (IP → hostname)
dig -x 8.8.8.8
dig -x 8.8.8.8 +short

# Check if negative result is cached (look for NXDOMAIN + TTL in the AUTHORITY section)
dig nonexistent.example.com

# Useful for diagnosing:
# "Why is my app connecting to the old server after a DNS change?"
# Check the TTL in the answer section — that is how long clients will cache the old IP.
# dig +nocmd +noall +answer +ttl example.com`,
        },
      ],
    },
    {
      title: {
        en: "ss and netstat — what is actually open on this machine",
        np: "ss र netstat — यस machine मा वास्तवमा के खुला छ",
        jp: "ss と netstat — このマシンで実際に何が開いているか",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Inspecting open ports and connections",
            np: "Open port र connection निरीक्षण गर्नुहोस्",
            jp: "開いているポートと接続を確認する",
          },
          code: `# ss (modern replacement for netstat)
ss -tlnp         # TCP Listening, Numeric, show Process
ss -ulnp         # UDP Listening
ss -tlnp4        # IPv4 only
ss -tlnp6        # IPv6 only
ss -anp          # ALL sockets (connected, listening, waiting)

# Filter by port
ss -tlnp | grep ':443'
ss -tlnp | grep ':8080'

# Who is connected to my service on port 80?
ss -tnp state established '( dport = :80 or sport = :80 )'

# Count connections by state (useful for detecting overload)
ss -tan | awk 'NR>1 {print $1}' | sort | uniq -c | sort -rn

# Show socket statistics (total open sockets, memory)
ss -s

# netstat (older systems)
netstat -tlnp       # same as ss -tlnp
netstat -anp        # all connections

# lsof — list open files (includes network sockets)
sudo lsof -i :80              # who is using port 80?
sudo lsof -i TCP:8080         # TCP on 8080
sudo lsof -i -P -n | grep LISTEN   # all listening ports with PIDs`,
        },
      ],
    },
    {
      title: {
        en: "tcpdump — reading raw packets",
        np: "tcpdump — raw packet पढ्नुहोस्",
        jp: "tcpdump — 生のパケットを読む",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`tcpdump` captures packets at the network interface level — before any firewall rules or application parsing. It is your last resort for diagnosing problems that are invisible at the application layer: half-open connections, wrong sequence numbers, RST packets, or encrypted traffic being rejected mid-stream.",
            np: "`tcpdump` ले network interface level मा packet capture गर्छ — कुनै firewall rule वा application parsing अघि। यो application layer मा अदृश्य समस्या diagnose गर्ने तपाईंको अन्तिम उपाय हो: half-open connection, गलत sequence number, RST packet, वा encrypted traffic mid-stream reject भइरहेको।",
            jp: "`tcpdump` はネットワークインターフェースレベルでパケットをキャプチャします。ファイアウォールルールやアプリケーションの解析よりも前の段階です。アプリケーション層では見えない問題の診断に使う最終手段です：ハーフオープン接続・誤ったシーケンス番号・RST パケット・暗号化トラフィックが途中で拒否されるケースなど。",
          },
        },
        {
          type: "code",
          title: {
            en: "tcpdump essentials",
            np: "tcpdump essentials",
            jp: "tcpdump の基本",
          },
          code: `# Capture on a specific interface
sudo tcpdump -i eth0

# Capture on any interface
sudo tcpdump -i any

# Filter by host
sudo tcpdump -i any host 203.0.113.10

# Filter by port
sudo tcpdump -i any port 80
sudo tcpdump -i any port 443

# Filter by host AND port
sudo tcpdump -i any host 203.0.113.10 and port 80

# Show packet content in ASCII (useful for HTTP debugging)
sudo tcpdump -i any -A port 80

# Show packet content in hex
sudo tcpdump -i any -X port 80

# Save to file for analysis in Wireshark
sudo tcpdump -i any -w /tmp/capture.pcap port 443
# Then: scp server:/tmp/capture.pcap . && wireshark capture.pcap

# Don't resolve hostnames or ports (faster, less noise)
sudo tcpdump -n -i any port 8080

# Verbose — shows more details including TTL, window size
sudo tcpdump -v -i any port 80

# Capture SYN packets only (new connection attempts)
sudo tcpdump -i any 'tcp[tcpflags] & tcp-syn != 0'

# Capture RST packets (connection resets — useful for finding dropped connections)
sudo tcpdump -i any 'tcp[tcpflags] & tcp-rst != 0'`,
        },
      ],
    },
    {
      title: {
        en: "curl — HTTP-layer diagnostics",
        np: "curl — HTTP-layer diagnostic",
        jp: "curl — HTTP 層の診断",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Advanced curl for production debugging",
            np: "Production debugging का लागि advanced curl",
            jp: "本番デバッグのための高度な curl",
          },
          code: `# Verbose output (request + response headers + TLS info)
curl -v https://api.example.com/health

# Measure timing breakdown
curl -w "\nDNS: %{time_namelookup}s | TCP: %{time_connect}s | TLS: %{time_appconnect}s | TTFB: %{time_starttransfer}s | Total: %{time_total}s\n" \
  -o /dev/null -s https://example.com

# Follow redirects and show each step
curl -Lv http://example.com 2>&1 | grep -E "< HTTP|Location"

# Test with a specific DNS resolution (bypass DNS — test before cutover)
curl --resolve example.com:443:203.0.113.10 https://example.com

# Use a specific network interface
curl --interface eth1 https://example.com

# Test connection timeout behavior
curl --connect-timeout 5 --max-time 10 https://slow.example.com

# POST with JSON
curl -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"status": "ok"}' \
  https://api.example.com/webhook

# Upload a file
curl -F "file=@./config.tar.gz" https://api.example.com/upload

# Show only the HTTP status code
curl -o /dev/null -s -w "%{http_code}\n" https://example.com`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "ping works but nc says the port is closed — what is happening?",
        np: "ping काम गर्छ तर nc ले port closed भन्छ — के भइरहेको छ?",
        jp: "ping は通るが nc はポートが閉じていると言う — 何が起きているか？",
      },
      answer: {
        en: "Three likely causes: (1) **Nothing is listening** on that port — `ss -tlnp | grep PORT` on the target to confirm; (2) **Firewall is blocking** the specific port but allows ICMP — check `iptables -L -n` or the cloud security group; (3) **Binding to wrong interface** — the service listens on `127.0.0.1:8080` (loopback only), not `0.0.0.0:8080` (all interfaces). Check with `ss -tlnp` — a `127.0.0.1` address means remote connections are impossible by design.",
        np: "तीन सम्भावित कारण: (1) **त्यो port मा केही listen गर्दैछैन** — target मा `ss -tlnp | grep PORT` confirm गर्नुहोस्; (2) **Firewall ले specific port block गर्दैछ** तर ICMP allow गर्छ — `iptables -L -n` वा cloud security group जाँच्नुहोस्; (3) **गलत interface मा bind** — service `0.0.0.0:8080` (सबै interface) होइन `127.0.0.1:8080` (loopback मात्र) मा listen गर्छ।",
        jp: "3 つの可能性：(1) **そのポートで何もリッスンしていない** — ターゲットで `ss -tlnp | grep PORT` を確認；(2) **ファイアウォールが特定ポートをブロック**しているが ICMP は許可 — `iptables -L -n` またはクラウドセキュリティグループを確認；(3) **間違ったインターフェースにバインド** — サービスが `0.0.0.0:8080`（全インターフェース）ではなく `127.0.0.1:8080`（ループバックのみ）でリッスンしている。",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
    {
      question: {
        en: "How do I test network throughput between two servers?",
        np: "दुई server बीच network throughput कसरी test गर्ने?",
        jp: "2 つのサーバー間のネットワークスループットをテストするには？",
      },
      answer: {
        en: "Use `iperf3`. On the server: `iperf3 -s` (starts a listener on port 5201). On the client: `iperf3 -c SERVER_IP`. It runs a 10-second test and reports throughput, jitter, and retransmissions. Useful flags: `-P 4` (4 parallel streams), `-u` (UDP test instead of TCP), `-R` (reverse direction, server sends to client). This is essential for diagnosing slow file transfers between servers or validating network capacity before a migration.",
        np: "`iperf3` प्रयोग गर्नुहोस्। Server मा: `iperf3 -s` (port 5201 मा listener start)। Client मा: `iperf3 -c SERVER_IP`। यसले 10-second test run गर्छ र throughput, jitter, र retransmission report गर्छ। Useful flag: `-P 4` (4 parallel stream), `-u` (TCP को सट्टा UDP test), `-R` (reverse direction)।",
        jp: "`iperf3` を使います。サーバー側：`iperf3 -s`（ポート 5201 でリスナーを起動）。クライアント側：`iperf3 -c SERVER_IP`。10 秒間のテストを実行し、スループット・ジッター・再送信を報告します。便利なフラグ：`-P 4`（4 並列ストリーム）・`-u`（UDP テスト）・`-R`（逆方向、サーバーからクライアントへ）。",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
    {
      question: {
        en: "DNS is resolving to the correct IP but the connection still fails — now what?",
        np: "DNS ले सही IP मा resolve गर्दैछ तर connection अझै fail हुन्छ — अब के गर्ने?",
        jp: "DNS は正しい IP に解決されているが接続が失敗する — 次は何をすべきか？",
      },
      answer: {
        en: "Work through the stack: (1) `nc -zv IP PORT` — is the port open directly to the IP (not hostname)? This isolates DNS from connectivity. (2) `traceroute IP` — is there a routing black hole? (3) `curl -v http://IP` — is the app responding? (4) If TLS is involved, `openssl s_client -connect IP:443 -servername hostname` — certificate issues won't appear in nc. (5) `tcpdump -n port PORT` on both ends — are packets arriving? Are they being replied to? This sequence covers 95% of production connectivity problems.",
        np: "Stack मार्फत काम गर्नुहोस्: (1) `nc -zv IP PORT` — hostname होइन IP मा directly port खुला छ? यसले DNS लाई connectivity बाट isolate गर्छ। (2) `traceroute IP` — routing black hole छ? (3) `curl -v http://IP` — app respond गर्दैछ? (4) TLS involved छ भने, `openssl s_client -connect IP:443 -servername hostname`। (5) दुवै end मा `tcpdump -n port PORT` — packet आइरहेको छ? Reply गरिरहेको छ?",
        jp: "スタックを通じて作業します：(1) `nc -zv IP PORT` — ホスト名ではなく IP に直接ポートが開いているか？これにより DNS と接続性を切り離せます。(2) `traceroute IP` — ルーティングのブラックホールがあるか？(3) `curl -v http://IP` — アプリは応答しているか？(4) TLS が関係する場合、`openssl s_client -connect IP:443 -servername hostname`。(5) 両端で `tcpdump -n port PORT` — パケットは届いているか？返信されているか？",
      },
      tag: { en: "tools", np: "उपकरण", jp: "ツール" },
    },
  ],
};
