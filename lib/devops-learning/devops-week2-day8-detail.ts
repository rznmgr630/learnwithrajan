import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Networking is the foundation of every distributed system, cloud architecture, and microservices deployment. Before you can debug a failed HTTP request, configure a firewall rule, or understand why two containers can't talk to each other, you need a mental model of how data actually travels across a network.",
    np: "Networking हरेक distributed system, cloud architecture, र microservices deployment को आधार हो। Failed HTTP request debug गर्न, firewall rule configure गर्न, वा दुई container किन एकआपसमा कुरा गर्न सक्दैनन् बुझ्नु अघि, data network भर कसरी travel गर्छ भन्ने mental model चाहिन्छ।",
    jp: "ネットワーキングはすべての分散システム・クラウドアーキテクチャ・マイクロサービスデプロイの基盤です。失敗した HTTP リクエストをデバッグしたり、ファイアウォールルールを設定したり、2 つのコンテナが通信できない理由を理解するには、データがネットワークをどのように移動するかのメンタルモデルが必要です。",
  } as const,
  o2: {
    en: "Today you build that mental model with the OSI and TCP/IP layered models, understand what each layer does and which protocols live there, and learn the tools that let you observe traffic at any layer — skills you will use every time you troubleshoot a network problem.",
    np: "आज तपाईंले OSI र TCP/IP layered model सँग त्यो mental model बनाउनुहुनेछ, हरेक layer ले के गर्छ र कुन protocol त्यहाँ छ बुझ्नुहुनेछ, र कुनै पनि layer मा traffic observe गर्ने tool सिक्नुहुनेछ — network problem troubleshoot गर्दा हरेक पटक प्रयोग गर्ने skill।",
    jp: "本日は OSI と TCP/IP の階層モデルでそのメンタルモデルを構築し、各層が何をするか・どのプロトコルがそこにあるかを理解し、任意の層でトラフィックを観察できるツールを学びます。これはネットワーク問題をトラブルシューティングするたびに使うスキルです。",
  } as const,
};

export const DEVOPS_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The OSI model — seven layers of abstraction",
        np: "OSI model — abstraction का सात layer",
        jp: "OSI モデル — 7 つの抽象化層",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The OSI (Open Systems Interconnection) model is a conceptual framework that divides network communication into seven layers. Each layer has a specific responsibility and communicates only with the layers directly above and below it. As data travels from your application to the wire, each layer adds a header (encapsulation); on the receiving end each layer strips its header (decapsulation).",
            np: "OSI (Open Systems Interconnection) model एउटा conceptual framework हो जसले network communication लाई सात layer मा विभाजित गर्छ। हरेक layer को specific responsibility छ र यो केवल आफ्नो ठीक माथि र तलको layer सँग communicate गर्छ। Data तपाईंको application बाट wire सम्म travel गर्दा हरेक layer ले header थप्छ (encapsulation); receiving end मा हरेक layer ले आफ्नो header हटाउँछ (decapsulation)।",
            jp: "OSI（オープンシステム相互接続）モデルは、ネットワーク通信を 7 つの層に分割する概念的なフレームワークです。各層には特定の責任があり、直接上下の層とのみ通信します。データがアプリケーションから物理線まで移動する際、各層はヘッダーを追加し（カプセル化）、受信側では各層がヘッダーを取り除きます（分解カプセル化）。",
          },
        },
        {
          type: "table",
          caption: {
            en: "OSI layers — what they do and what DevOps engineers care about",
            np: "OSI layer — तिनीहरूले के गर्छन् र DevOps engineer के मा ध्यान दिन्छन्",
            jp: "OSI 層 — 何をするか、DevOps エンジニアが何を重視するか",
          },
          headers: [
            { en: "Layer", np: "Layer", jp: "層" },
            { en: "Name", np: "नाम", jp: "名前" },
            { en: "PDU", np: "PDU", jp: "PDU" },
            { en: "Key protocols / technologies", np: "मुख्य protocol / technology", jp: "主要なプロトコル / 技術" },
            { en: "DevOps relevance", np: "DevOps relevance", jp: "DevOps での重要性" },
          ],
          rows: [
            [
              { en: "7", np: "7", jp: "7" },
              { en: "Application", np: "Application", jp: "アプリケーション" },
              { en: "Data", np: "Data", jp: "データ" },
              { en: "HTTP, HTTPS, DNS, SSH, SMTP, FTP", np: "HTTP, HTTPS, DNS, SSH, SMTP, FTP", jp: "HTTP・HTTPS・DNS・SSH・SMTP・FTP" },
              { en: "Where your apps live — API calls, web traffic, database queries", np: "तपाईंको app — API call, web traffic, database query", jp: "アプリが存在する場所 — API コール・Web トラフィック・DB クエリ" },
            ],
            [
              { en: "6", np: "6", jp: "6" },
              { en: "Presentation", np: "Presentation", jp: "プレゼンテーション" },
              { en: "Data", np: "Data", jp: "データ" },
              { en: "TLS/SSL, JSON, XML, gzip, base64", np: "TLS/SSL, JSON, XML, gzip, base64", jp: "TLS/SSL・JSON・XML・gzip・base64" },
              { en: "Encryption (TLS), compression, serialization format", np: "Encryption (TLS), compression, serialization format", jp: "暗号化（TLS）・圧縮・シリアル化形式" },
            ],
            [
              { en: "5", np: "5", jp: "5" },
              { en: "Session", np: "Session", jp: "セッション" },
              { en: "Data", np: "Data", jp: "データ" },
              { en: "TLS handshake, RPC, NetBIOS", np: "TLS handshake, RPC, NetBIOS", jp: "TLS ハンドシェイク・RPC・NetBIOS" },
              { en: "Connection setup/teardown, auth sessions — mostly handled by TLS today", np: "Connection setup/teardown, auth session — आज TLS ले mostly handle गर्छ", jp: "接続の確立/切断・認証セッション — 現在は主に TLS が処理" },
            ],
            [
              { en: "4", np: "4", jp: "4" },
              { en: "Transport", np: "Transport", jp: "トランスポート" },
              { en: "Segment", np: "Segment", jp: "セグメント" },
              { en: "TCP, UDP", np: "TCP, UDP", jp: "TCP・UDP" },
              { en: "Ports, reliable delivery (TCP), fast delivery (UDP), load balancer health checks", np: "Port, reliable delivery (TCP), fast delivery (UDP), load balancer health check", jp: "ポート・信頼性のある配信（TCP）・高速配信（UDP）・LB ヘルスチェック" },
            ],
            [
              { en: "3", np: "3", jp: "3" },
              { en: "Network", np: "Network", jp: "ネットワーク" },
              { en: "Packet", np: "Packet", jp: "パケット" },
              { en: "IP (v4/v6), ICMP, routing protocols (BGP, OSPF)", np: "IP (v4/v6), ICMP, routing protocol", jp: "IP（v4/v6）・ICMP・ルーティングプロトコル（BGP・OSPF）" },
              { en: "IP addresses, routing, VPC subnets, security groups (IP-based rules)", np: "IP address, routing, VPC subnet, security group (IP-based rule)", jp: "IP アドレス・ルーティング・VPC サブネット・セキュリティグループ（IP ベースのルール）" },
            ],
            [
              { en: "2", np: "2", jp: "2" },
              { en: "Data Link", np: "Data Link", jp: "データリンク" },
              { en: "Frame", np: "Frame", jp: "フレーム" },
              { en: "Ethernet, Wi-Fi (802.11), ARP, VLANs, switches", np: "Ethernet, Wi-Fi, ARP, VLAN, switch", jp: "Ethernet・Wi-Fi（802.11）・ARP・VLAN・スイッチ" },
              { en: "MAC addresses, ARP issues, VLAN tagging in bare-metal and VM environments", np: "MAC address, ARP issue, VLAN tagging bare-metal र VM environment मा", jp: "MAC アドレス・ARP の問題・ベアメタルと VM 環境での VLAN タグ付け" },
            ],
            [
              { en: "1", np: "1", jp: "1" },
              { en: "Physical", np: "Physical", jp: "物理" },
              { en: "Bit", np: "Bit", jp: "ビット" },
              { en: "Ethernet cables, fiber, Wi-Fi signals, NICs", np: "Ethernet cable, fiber, Wi-Fi signal, NIC", jp: "Ethernet ケーブル・光ファイバー・Wi-Fi 信号・NIC" },
              { en: "Rarely your problem in cloud — but matters for on-prem, colocation, and physical server setup", np: "Cloud मा rarely तपाईंको problem — तर on-prem, colocation, physical server setup मा महत्त्वपूर्ण", jp: "クラウドでは滅多に問題にならないが、オンプレ・コロケーション・物理サーバーセットアップでは重要" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Remember the layers with the mnemonic: Please Do Not Throw Sausage Pizza Away (Physical → Data Link → Network → Transport → Session → Presentation → Application).",
              np: "Layer याद गर्नुहोस्: Please Do Not Throw Sausage Pizza Away (Physical → Data Link → Network → Transport → Session → Presentation → Application)।",
              jp: "層を覚えるためのニーモニック: Please Do Not Throw Sausage Pizza Away（Physical → Data Link → Network → Transport → Session → Presentation → Application）。",
            },
            {
              en: "DevOps engineers mostly live at layers 3–7. Layer 3 (IP routing, VPC design), layer 4 (TCP ports, load balancers, firewall rules), layer 7 (HTTP headers, API gateways, TLS certificates). Layers 1–2 are the hardware team's domain in data centers; in cloud they are abstracted away.",
              np: "DevOps engineer मुख्यतः layer 3–7 मा काम गर्छन्। Layer 3 (IP routing, VPC design), layer 4 (TCP port, load balancer, firewall rule), layer 7 (HTTP header, API gateway, TLS certificate)। Layer 1–2 data center मा hardware team को domain हो; cloud मा abstract हुन्छन्।",
              jp: "DevOps エンジニアは主に層 3〜7 で作業します。 層 3（IP ルーティング・VPC 設計）・層 4（TCP ポート・ロードバランサー・ファイアウォールルール）・層 7（HTTP ヘッダー・API ゲートウェイ・TLS 証明書）。層 1〜2 はデータセンターのハードウェアチームの領域；クラウドでは抽象化されています。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "TCP/IP — the model that runs the internet",
        np: "TCP/IP — internet चलाउने model",
        jp: "TCP/IP — インターネットを動かすモデル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The TCP/IP model (also called the Internet model) is the practical implementation of the OSI model compressed into four layers. It is what actually runs on every machine connected to the internet. The two most important protocols — TCP and IP — give the model its name.",
            np: "TCP/IP model (Internet model पनि भनिन्छ) OSI model को practical implementation हो जुन चार layer मा compress गरिएको छ। यो वास्तवमा internet सँग जोडिएको हरेक machine मा run हुन्छ। दुई सबभन्दा महत्त्वपूर्ण protocol — TCP र IP — ले model लाई नाम दिन्छन्।",
            jp: "TCP/IP モデル（インターネットモデルとも呼ばれる）は OSI モデルを 4 層に圧縮した実用的な実装です。インターネットに接続されたすべてのマシンで実際に動作しています。TCP と IP という 2 つの最も重要なプロトコルがモデルに名前を与えています。",
          },
        },
        {
          type: "table",
          caption: {
            en: "TCP/IP vs OSI layer mapping",
            np: "TCP/IP vs OSI layer mapping",
            jp: "TCP/IP と OSI 層の対応",
          },
          headers: [
            { en: "TCP/IP Layer", np: "TCP/IP Layer", jp: "TCP/IP 層" },
            { en: "OSI Equivalent", np: "OSI Equivalent", jp: "OSI 対応" },
            { en: "What it handles", np: "के handle गर्छ", jp: "何を扱うか" },
          ],
          rows: [
            [
              { en: "Application", np: "Application", jp: "アプリケーション" },
              { en: "Layers 5, 6, 7", np: "Layer 5, 6, 7", jp: "層 5・6・7" },
              { en: "HTTP, HTTPS, SSH, DNS, SMTP — the protocols your apps speak", np: "HTTP, HTTPS, SSH, DNS, SMTP — तपाईंका app बोल्ने protocol", jp: "HTTP・HTTPS・SSH・DNS・SMTP — アプリが使うプロトコル" },
            ],
            [
              { en: "Transport", np: "Transport", jp: "トランスポート" },
              { en: "Layer 4", np: "Layer 4", jp: "層 4" },
              { en: "TCP (reliable, ordered, connection-based) and UDP (fast, connectionless)", np: "TCP (reliable, ordered, connection-based) र UDP (fast, connectionless)", jp: "TCP（信頼性・順序保証・接続ベース）と UDP（高速・コネクションレス）" },
            ],
            [
              { en: "Internet", np: "Internet", jp: "インターネット" },
              { en: "Layer 3", np: "Layer 3", jp: "層 3" },
              { en: "IP addressing and routing — getting packets from source to destination across networks", np: "IP addressing र routing — network भर source बाट destination सम्म packet पुर्याउनु", jp: "IP アドレス指定とルーティング — ネットワークを越えて送信元から宛先にパケットを届ける" },
            ],
            [
              { en: "Network Access (Link)", np: "Network Access (Link)", jp: "ネットワークアクセス（リンク）" },
              { en: "Layers 1, 2", np: "Layer 1, 2", jp: "層 1・2" },
              { en: "Ethernet frames, MAC addresses, physical transmission on a local segment", np: "Ethernet frame, MAC address, local segment मा physical transmission", jp: "Ethernet フレーム・MAC アドレス・ローカルセグメントでの物理的な転送" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "TCP vs UDP is one of the most common trade-off decisions in systems design. TCP guarantees delivery, order, and error checking via a three-way handshake and acknowledgments — at the cost of latency and overhead. UDP sends packets and forgets about them — faster, but the application must handle loss. HTTP/1.1 and HTTP/2 use TCP. HTTP/3 (QUIC) and DNS use UDP.",
            np: "TCP vs UDP systems design मा सबभन्दा सामान्य trade-off निर्णयहरू मध्ये एक हो। TCP ले three-way handshake र acknowledgment मार्फत delivery, order, र error checking guarantee गर्छ — latency र overhead को cost मा। UDP ले packet पठाउँछ र बिर्सन्छ — छिटो, तर application ले loss handle गर्नुपर्छ।",
            jp: "TCP 対 UDP はシステム設計で最もよくあるトレードオフの決定の一つです。TCP は 3 ウェイハンドシェイクと確認応答によって配信・順序・エラーチェックを保証しますが、遅延とオーバーヘッドのコストがかかります。UDP はパケットを送信して忘れます — より高速ですが、アプリケーションが損失を処理する必要があります。",
          },
        },
        {
          type: "code",
          title: {
            en: "TCP three-way handshake — what happens when you open a connection",
            np: "TCP three-way handshake — connection open गर्दा के हुन्छ",
            jp: "TCP 3 ウェイハンドシェイク — 接続を開くときに何が起こるか",
          },
          code: `# The TCP handshake: SYN → SYN-ACK → ACK
# Client connects to server on port 80:

# Step 1: Client sends SYN (synchronize) — "I want to talk, my sequence # is X"
# Step 2: Server replies SYN-ACK — "OK, my sequence # is Y, I got your X"
# Step 3: Client sends ACK — "Got it, we're connected"
# → Data can now flow in both directions

# Observe a real handshake with tcpdump
sudo tcpdump -i any -n 'tcp[tcpflags] & (tcp-syn|tcp-ack) != 0' and host google.com

# Or watch connection states with ss
ss -tn                          # all TCP connections, numeric ports
ss -tnp                         # include process name/PID
ss -tn state established        # only established connections
ss -tn state time-wait          # TIME_WAIT sockets (common on busy servers)

# netstat (older alternative to ss)
netstat -tn                     # TCP connections
netstat -tlnp                   # listening TCP sockets with process info`,
        },
      ],
    },
    {
      title: {
        en: "Key protocols every DevOps engineer must know",
        np: "हरेक DevOps engineer ले जान्नुपर्ने मुख्य protocol",
        jp: "すべての DevOps エンジニアが知っておくべき主要なプロトコル",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Protocol quick reference — layer, port, and DevOps use case",
            np: "Protocol quick reference — layer, port, र DevOps use case",
            jp: "プロトコルクイックリファレンス — 層・ポート・DevOps ユースケース",
          },
          headers: [
            { en: "Protocol", np: "Protocol", jp: "プロトコル" },
            { en: "Layer", np: "Layer", jp: "層" },
            { en: "Port", np: "Port", jp: "ポート" },
            { en: "Transport", np: "Transport", jp: "トランスポート" },
            { en: "DevOps use case", np: "DevOps use case", jp: "DevOps のユースケース" },
          ],
          rows: [
            [
              { en: "HTTP", np: "HTTP", jp: "HTTP" },
              { en: "7", np: "7", jp: "7" },
              { en: "80", np: "80", jp: "80" },
              { en: "TCP", np: "TCP", jp: "TCP" },
              { en: "Web traffic, REST APIs, health checks", np: "Web traffic, REST API, health check", jp: "Web トラフィック・REST API・ヘルスチェック" },
            ],
            [
              { en: "HTTPS", np: "HTTPS", jp: "HTTPS" },
              { en: "7", np: "7", jp: "7" },
              { en: "443", np: "443", jp: "443" },
              { en: "TCP", np: "TCP", jp: "TCP" },
              { en: "Encrypted HTTP — everything in production should use this", np: "Encrypted HTTP — production मा सबथोक यही प्रयोग गर्नुपर्छ", jp: "暗号化された HTTP — 本番環境ではすべてこれを使うべき" },
            ],
            [
              { en: "SSH", np: "SSH", jp: "SSH" },
              { en: "7", np: "7", jp: "7" },
              { en: "22", np: "22", jp: "22" },
              { en: "TCP", np: "TCP", jp: "TCP" },
              { en: "Encrypted remote shell, SCP, SFTP, port forwarding", np: "Encrypted remote shell, SCP, SFTP, port forwarding", jp: "暗号化リモートシェル・SCP・SFTP・ポートフォワーディング" },
            ],
            [
              { en: "DNS", np: "DNS", jp: "DNS" },
              { en: "7", np: "7", jp: "7" },
              { en: "53", np: "53", jp: "53" },
              { en: "UDP (TCP for large responses)", np: "UDP (large response TCP)", jp: "UDP（大きな応答は TCP）" },
              { en: "Name resolution — failure here breaks everything", np: "Name resolution — यहाँ failure भए सबथोक बिग्रन्छ", jp: "名前解決 — ここの失敗はすべてを壊す" },
            ],
            [
              { en: "ICMP", np: "ICMP", jp: "ICMP" },
              { en: "3", np: "3", jp: "3" },
              { en: "N/A", np: "N/A", jp: "N/A" },
              { en: "N/A (IP-layer)", np: "N/A (IP-layer)", jp: "N/A（IP 層）" },
              { en: "ping, traceroute — network reachability testing", np: "ping, traceroute — network reachability testing", jp: "ping・traceroute — ネットワーク到達可能性テスト" },
            ],
            [
              { en: "TCP (raw)", np: "TCP (raw)", jp: "TCP（生）" },
              { en: "4", np: "4", jp: "4" },
              { en: "any", np: "any", jp: "任意" },
              { en: "TCP", np: "TCP", jp: "TCP" },
              { en: "Port scanning (nmap), firewall rule testing (telnet/nc)", np: "Port scanning (nmap), firewall rule testing (telnet/nc)", jp: "ポートスキャン（nmap）・ファイアウォールルールテスト（telnet/nc）" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Well-known ports (0–1023) are reserved for standard services and require root to bind. Registered ports (1024–49151) are used by application servers (Postgres: 5432, Redis: 6379, MySQL: 3306). Ephemeral ports (49152–65535) are assigned to client connections by the OS.",
              np: "Well-known port (0–1023) standard service का लागि reserve गरिएको र bind गर्न root चाहिन्छ। Registered port (1024–49151) application server ले प्रयोग गर्छन् (Postgres: 5432, Redis: 6379, MySQL: 3306)। Ephemeral port (49152–65535) OS ले client connection लाई assign गर्छ।",
              jp: "既知のポート（0〜1023） は標準サービス用に予約されており、バインドには root が必要です。登録済みポート（1024〜49151） はアプリケーションサーバーが使用します（Postgres: 5432・Redis: 6379・MySQL: 3306）。エフェメラルポート（49152〜65535） は OS がクライアント接続に割り当てます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Observing network traffic — tcpdump and friends",
        np: "Network traffic observe गर्नुहोस् — tcpdump र साथीहरू",
        jp: "ネットワークトラフィックの観察 — tcpdump とその仲間",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Network debugging toolkit",
            np: "Network debugging toolkit",
            jp: "ネットワークデバッグツールキット",
          },
          code: `# ping — test ICMP reachability (layer 3)
ping -c 4 google.com            # 4 packets to google.com
ping -c 4 8.8.8.8               # test by IP (bypasses DNS)

# traceroute — show the path packets take (layer 3)
traceroute google.com           # show each router hop
traceroute -n google.com        # no DNS reverse lookups (faster)
mtr google.com                  # continuous traceroute (interactive)

# curl — test HTTP/HTTPS (layer 7)
curl -v https://example.com     # verbose: shows TLS handshake, headers, body
curl -I https://example.com     # headers only
curl -o /dev/null -w "%{http_code} %{time_total}s\n" https://example.com

# netcat (nc) — raw TCP/UDP testing (layer 4)
nc -zv 10.0.0.5 80              # test if port 80 is open
nc -zv 10.0.0.5 80 443 22       # test multiple ports
nc -l 8080                      # listen on port 8080 (test server)

# nmap — port scanning (layer 4)
nmap -p 80,443,22 10.0.0.5      # scan specific ports
nmap -p 1-1000 10.0.0.5         # scan first 1000 ports

# tcpdump — capture raw packets (layers 2–7)
sudo tcpdump -i eth0                        # all traffic on eth0
sudo tcpdump -i any -n port 80              # HTTP traffic, numeric IPs
sudo tcpdump -i any -n host 10.0.0.5       # traffic to/from specific host
sudo tcpdump -i any -n 'tcp and port 443'  # HTTPS only
sudo tcpdump -i any -w /tmp/capture.pcap   # save to file (open in Wireshark)

# ss / ip — modern socket and interface inspection
ss -tnp                         # all TCP connections with process names
ip addr show                    # all interfaces and their IP addresses
ip route show                   # routing table
ip link show                    # network interfaces and MAC addresses`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Trace a real HTTP request through the stack",
        np: "Hands-on: Stack भर real HTTP request trace गर्नुहोस्",
        jp: "ハンズオン: スタックを通じた実際の HTTP リクエストをトレースする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Follow a request from your terminal to a web server",
            np: "Terminal बाट web server सम्म request follow गर्नुहोस्",
            jp: "ターミナルから Web サーバーまでリクエストを追跡する",
          },
          code: `# Goal: understand what happens when you run: curl https://example.com

# Step 1 — DNS resolution (Application layer, UDP port 53)
dig example.com A               # what IP does example.com resolve to?
dig +trace example.com          # full recursive resolution path

# Step 2 — Route to the server (Network layer)
traceroute -n $(dig +short example.com A | head -1)   # path to the IP

# Step 3 — TCP connection (Transport layer)
nc -zv $(dig +short example.com A | head -1) 443   # can I reach port 443?

# Step 4 — TLS handshake (Presentation layer)
openssl s_client -connect example.com:443 -brief   # TLS version, cert info

# Step 5 — HTTP request (Application layer)
curl -v https://example.com 2>&1 | head -50        # full verbose output

# Step 6 — Capture all of the above at the packet level
# In terminal 1 (capture)
sudo tcpdump -i any -n -w /tmp/http_trace.pcap host example.com
# In terminal 2 (trigger the request)
curl https://example.com
# Back in terminal 1: Ctrl-C to stop, then analyze
tcpdump -r /tmp/http_trace.pcap -n | head -30`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why do I need to understand OSI if I'm just deploying containers?",
        np: "म केवल container deploy गर्दैछु भने OSI किन बुझ्न जरुरी छ?",
        jp: "コンテナをデプロイするだけなら OSI を理解する必要はあるか？",
      },
      answer: {
        en: "Container networking relies on OSI concepts at every level: Docker creates virtual ethernet pairs (layer 2), assigns IP addresses to containers (layer 3), maps host ports to container ports via NAT (layer 4), and your app still speaks HTTP/HTTPS (layer 7). When two containers can't communicate, you debug by checking layer 3 routing, layer 4 port mappings, and layer 7 application errors — in that order. Without the model, you're guessing.",
        np: "Container networking ले हरेक level मा OSI concept use गर्छ: Docker ले virtual ethernet pair (layer 2) create गर्छ, container लाई IP assign गर्छ (layer 3), NAT मार्फत host port लाई container port map गर्छ (layer 4), र तपाईंको app HTTP/HTTPS (layer 7) बोल्छ। दुई container communicate गर्न नसक्दा तपाईंले layer 3 routing, layer 4 port mapping, र layer 7 application error क्रमशः check गरेर debug गर्नुहुन्छ।",
        jp: "コンテナネットワーキングはすべてのレベルで OSI の概念に依存しています：Docker は仮想 Ethernet ペア（層 2）を作成し、コンテナに IP アドレスを割り当て（層 3）、NAT を介してホストポートをコンテナポートにマッピングし（層 4）、アプリは引き続き HTTP/HTTPS を話します（層 7）。2 つのコンテナが通信できない場合、層 3 のルーティング・層 4 のポートマッピング・層 7 のアプリケーションエラーをその順番で確認してデバッグします。",
      },
      tag: { en: "networking", np: "नेटवर्किङ", jp: "ネットワーキング" },
    },
    {
      question: {
        en: "What is the difference between TCP and UDP, and when should I use each?",
        np: "TCP र UDP बीच के फरक छ र कहिले कुन प्रयोग गर्ने?",
        jp: "TCP と UDP の違いは何か、それぞれをいつ使うべきか？",
      },
      answer: {
        en: "TCP guarantees that all data arrives in order and without corruption, using sequence numbers, acknowledgments, and retransmissions — at the cost of latency. Use TCP when correctness matters: HTTP, SSH, database connections, file transfers. UDP sends data without acknowledgment or ordering — lower latency, higher throughput, possible packet loss. Use UDP when speed matters more than correctness: DNS queries, video streaming, gaming, metrics/monitoring (a dropped metric is better than delaying the next one).",
        np: "TCP ले sequence number, acknowledgment, र retransmission प्रयोग गरी सबै data order मा र corruption बिना arrive हुन्छ guarantee गर्छ — latency को cost मा। Correctness महत्त्वपूर्ण छ भने TCP: HTTP, SSH, database connection, file transfer। UDP ले acknowledgment वा ordering बिना data पठाउँछ — lower latency, higher throughput, possible packet loss। Speed more important भए UDP: DNS query, video streaming, gaming, metrics/monitoring।",
        jp: "TCP はシーケンス番号・確認応答・再送信を使って、すべてのデータが順番通りに破損なく到着することを保証しますが、遅延のコストがかかります。正確性が重要な場合は TCP を使います：HTTP・SSH・データベース接続・ファイル転送。UDP は確認応答や順序付けなしにデータを送信します — 低遅延・高スループット・パケット損失の可能性あり。速度が正確性より重要な場合は UDP を使います：DNS クエリ・動画ストリーミング・ゲーム・メトリクス/監視。",
      },
      tag: { en: "networking", np: "नेटवर्किङ", jp: "ネットワーキング" },
    },
    {
      question: {
        en: "What does 'connection refused' vs 'connection timed out' mean?",
        np: "'Connection refused' vs 'connection timed out' को अर्थ के हो?",
        jp: "「connection refused」と「connection timed out」の意味の違いは？",
      },
      answer: {
        en: "Connection refused (ECONNREFUSED): The server is reachable at the IP level, but nothing is listening on that port — the OS immediately sends back a TCP RST (reset). Cause: service is down, wrong port, service only listening on localhost. Connection timed out (ETIMEDOUT): Your SYN packet was sent but no response ever came — either a firewall silently dropped it or the host is unreachable. Cause: security group/firewall blocking the port, wrong IP, host down. The distinction tells you where to look.",
        np: "Connection refused (ECONNREFUSED): Server IP level मा reachable छ, तर त्यो port मा केही listen गरिरहेको छैन — OS ले TCP RST (reset) तुरुन्त फिर्ता पठाउँछ। Cause: service down, wrong port, service only localhost मा listen। Connection timed out (ETIMEDOUT): SYN packet पठाइयो तर कुनै response आएन — firewall ले silently drop गर्यो वा host unreachable छ। Cause: security group/firewall port blocking, wrong IP, host down।",
        jp: "Connection refused（ECONNREFUSED）: サーバーは IP レベルで到達可能ですが、そのポートで何もリッスンしていません — OS が即座に TCP RST（リセット）を送り返します。原因：サービスがダウン・間違ったポート・サービスが localhost のみでリッスン。Connection timed out（ETIMEDOUT）: SYN パケットは送られましたが応答がありませんでした — ファイアウォールがサイレントにドロップしたかホストが到達不能。原因：セキュリティグループ/ファイアウォールがポートをブロック・間違った IP・ホストがダウン。",
      },
      tag: { en: "networking", np: "नेटवर्किङ", jp: "ネットワーキング" },
      callout: {
        en: "Refused = something is there but rejecting you. Timeout = nothing responded (firewall or host down).",
        np: "Refused = केही छ तर reject गर्दैछ। Timeout = केही response भएन (firewall वा host down)।",
        jp: "Refused = 何かはいるが拒否している。Timeout = 何も応答しなかった（ファイアウォールかホストがダウン）。",
      },
    },
    {
      question: {
        en: "What is ARP and when does it cause problems?",
        np: "ARP के हो र यसले कहिले समस्या गर्छ?",
        jp: "ARP とは何か、いつ問題を引き起こすか？",
      },
      answer: {
        en: "ARP (Address Resolution Protocol) maps an IP address to a MAC address on a local network — it answers 'who has IP 192.168.1.5?' with the corresponding MAC address. Problems arise with ARP cache poisoning (an attacker responds with their own MAC, enabling man-in-the-middle attacks) and stale ARP entries after a server migration (the cache holds the old MAC). Clear the ARP cache with `ip neigh flush all` or wait for TTL expiry.",
        np: "ARP (Address Resolution Protocol) ले local network मा IP address लाई MAC address map गर्छ — यसले 'IP 192.168.1.5 को छ?' को उत्तर corresponding MAC address ले दिन्छ। Problems: ARP cache poisoning (attacker ले आफ्नो MAC ले respond गर्छ, man-in-the-middle attack सक्षम गर्दछ) र server migration पछि stale ARP entry। `ip neigh flush all` ले ARP cache clear गर्नुहोस्।",
        jp: "ARP（アドレス解決プロトコル）はローカルネットワーク上で IP アドレスを MAC アドレスにマッピングします — 「誰が IP 192.168.1.5 を持っているか？」という問いに対応する MAC アドレスで答えます。問題は ARP キャッシュポイズニング（攻撃者が自分の MAC で応答してマンインザミドル攻撃を可能にする）とサーバー移行後の古い ARP エントリで発生します。`ip neigh flush all` で ARP キャッシュをクリアします。",
      },
      tag: { en: "networking", np: "नेटवर्किङ", jp: "ネットワーキング" },
    },
  ],
};
