import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Every resource in a cloud environment — EC2 instance, container, load balancer, database — lives on a network with an IP address. Understanding how IP addressing works, how subnets carve networks into isolated segments, and how CIDR notation expresses both, is the difference between confidently designing a VPC and guessing your way through it.",
    np: "Cloud environment मा हरेक resource — EC2 instance, container, load balancer, database — IP address सहितको network मा छ। IP addressing कसरी काम गर्छ, subnet ले network लाई isolated segment मा कसरी divide गर्छ, र CIDR notation ले दुवै कसरी express गर्छ बुझ्नु — VPC confidently design गर्नु र अनुमान लगाउनु बीचको फरक हो।",
    jp: "クラウド環境のすべてのリソース — EC2 インスタンス・コンテナ・ロードバランサー・データベース — は IP アドレスを持つネットワーク上にあります。IP アドレス指定の仕組み・サブネットがネットワークを分離されたセグメントに分割する方法・CIDR 表記が両方をどのように表現するかを理解することが、VPC を自信を持って設計することと推測することの違いです。",
  } as const,
  o2: {
    en: "Today you learn binary-to-decimal IP conversion, how subnet masks work, how to calculate the network address, broadcast address, and host range from a CIDR block, and how these concepts map directly to AWS VPCs, Kubernetes pod networks, and Docker bridge networks.",
    np: "आज तपाईंले binary-to-decimal IP conversion, subnet mask कसरी काम गर्छ, CIDR block बाट network address, broadcast address, र host range कसरी calculate गर्ने, र यी concept AWS VPC, Kubernetes pod network, र Docker bridge network मा कसरी directly map हुन्छ सिक्नुहुनेछ।",
    jp: "本日は 2 進数から 10 進数への IP 変換・サブネットマスクの仕組み・CIDR ブロックからネットワークアドレス・ブロードキャストアドレス・ホスト範囲の計算方法・そしてこれらの概念が AWS VPC・Kubernetes ポッドネットワーク・Docker ブリッジネットワークにどのように直接マッピングされるかを学びます。",
  } as const,
};

export const DEVOPS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "IPv4 addressing — the 32-bit address space",
        np: "IPv4 addressing — 32-bit address space",
        jp: "IPv4 アドレス指定 — 32 ビットのアドレス空間",
      },
      blocks: [
        { type: "diagram", id: "devops-subnet-cidr" },
        { type: "diagram", id: "devops-aws-vpc" },
        {
          type: "paragraph",
          text: {
            en: "An IPv4 address is a 32-bit number written as four decimal octets (0–255) separated by dots: `192.168.1.100`. Each octet represents 8 bits. The total address space is 2³² = ~4.3 billion addresses — which ran out globally in 2011. Private address ranges (RFC 1918) are recycled across every private network using NAT.",
            np: "IPv4 address एउटा 32-bit number हो जुन dot ले छुट्याइएका चार decimal octet (0–255) को रूपमा लेखिन्छ: `192.168.1.100`। हरेक octet 8 bit represent गर्छ। कुल address space 2³² = ~4.3 billion address — जुन 2011 मा globally सकियो। Private address range (RFC 1918) NAT प्रयोग गरी हरेक private network मा recycle हुन्छ।",
            jp: "IPv4 アドレスはドットで区切られた 4 つの 10 進数オクテット（0〜255）として書かれた 32 ビットの数字です：`192.168.1.100`。各オクテットは 8 ビットを表します。総アドレス空間は 2³² = 約 43 億アドレスで、2011 年にグローバルで枯渇しました。プライベートアドレス範囲（RFC 1918）は NAT を使ってすべてのプライベートネットワークで再利用されます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Private IP address ranges (RFC 1918) — safe to use inside your network",
            np: "Private IP address range (RFC 1918) — network भित्र प्रयोग गर्न safe",
            jp: "プライベート IP アドレス範囲（RFC 1918）— ネットワーク内で使用しても安全",
          },
          headers: [
            { en: "Range", np: "Range", jp: "範囲" },
            { en: "CIDR", np: "CIDR", jp: "CIDR" },
            { en: "Total hosts", np: "कुल host", jp: "総ホスト数" },
            { en: "Typical use", np: "Typical use", jp: "典型的な用途" },
          ],
          rows: [
            [
              { en: "10.0.0.0 – 10.255.255.255", np: "10.0.0.0 – 10.255.255.255", jp: "10.0.0.0 〜 10.255.255.255" },
              { en: "10.0.0.0/8", np: "10.0.0.0/8", jp: "10.0.0.0/8" },
              { en: "16,777,216", np: "16,777,216", jp: "16,777,216" },
              { en: "Large cloud VPCs, enterprise networks", np: "Large cloud VPC, enterprise network", jp: "大規模クラウド VPC・エンタープライズネットワーク" },
            ],
            [
              { en: "172.16.0.0 – 172.31.255.255", np: "172.16.0.0 – 172.31.255.255", jp: "172.16.0.0 〜 172.31.255.255" },
              { en: "172.16.0.0/12", np: "172.16.0.0/12", jp: "172.16.0.0/12" },
              { en: "1,048,576", np: "1,048,576", jp: "1,048,576" },
              { en: "Mid-size VPCs, Docker default bridge (172.17.0.0/16)", np: "Mid-size VPC, Docker default bridge (172.17.0.0/16)", jp: "中規模 VPC・Docker デフォルトブリッジ（172.17.0.0/16）" },
            ],
            [
              { en: "192.168.0.0 – 192.168.255.255", np: "192.168.0.0 – 192.168.255.255", jp: "192.168.0.0 〜 192.168.255.255" },
              { en: "192.168.0.0/16", np: "192.168.0.0/16", jp: "192.168.0.0/16" },
              { en: "65,536", np: "65,536", jp: "65,536" },
              { en: "Home/office LANs, small lab environments", np: "Home/office LAN, small lab environment", jp: "家庭/オフィス LAN・小規模ラボ環境" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Special addresses to know**: `127.0.0.1` (loopback — always 'this machine'), `0.0.0.0` (all interfaces — used in listen addresses), `255.255.255.255` (limited broadcast), `169.254.x.x` (APIPA/link-local — assigned when DHCP fails; seeing this on a cloud instance usually means the metadata service is unreachable).",
              np: "**जान्नुपर्ने special address**: `127.0.0.1` (loopback — सधैं 'यो machine'), `0.0.0.0` (सबै interface — listen address मा प्रयोग), `255.255.255.255` (limited broadcast), `169.254.x.x` (APIPA/link-local — DHCP fail भएमा assign हुन्छ; cloud instance मा देखिनु मतलब metadata service unreachable छ)।",
              jp: "**知っておくべき特別なアドレス**: `127.0.0.1`（ループバック — 常に「このマシン」）、`0.0.0.0`（すべてのインターフェース — リッスンアドレスに使用）、`255.255.255.255`（限定ブロードキャスト）、`169.254.x.x`（APIPA/リンクローカル — DHCP 失敗時に割り当てられる；クラウドインスタンスで見えるとメタデータサービスが到達不能を意味することが多い）。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Subnet masks and CIDR notation",
        np: "Subnet mask र CIDR notation",
        jp: "サブネットマスクと CIDR 表記",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A subnet mask divides an IP address into two parts: the **network portion** (identifies which network) and the **host portion** (identifies which device on that network). CIDR (Classless Inter-Domain Routing) notation expresses this as a suffix: `192.168.1.0/24` means the first 24 bits are the network, leaving 8 bits for hosts (2⁸ = 256 addresses, 254 usable — the network and broadcast addresses are reserved).",
            np: "Subnet mask ले IP address लाई दुई भागमा विभाजित गर्छ: **network portion** (कुन network पहिचान गर्छ) र **host portion** (त्यो network मा कुन device पहिचान गर्छ)। CIDR (Classless Inter-Domain Routing) notation ले यसलाई suffix को रूपमा express गर्छ: `192.168.1.0/24` को अर्थ पहिलो 24 bit network हो, host का लागि 8 bit बाँकी छ (2⁸ = 256 address, 254 usable)।",
            jp: "サブネットマスクは IP アドレスを 2 つの部分に分割します：**ネットワーク部**（どのネットワークかを識別）と**ホスト部**（そのネットワーク上のどのデバイスかを識別）。CIDR（クラスレスドメイン間ルーティング）表記はこれをサフィックスとして表現します：`192.168.1.0/24` は最初の 24 ビットがネットワークを意味し、ホストに 8 ビット残ります（2⁸ = 256 アドレス、254 が使用可能 — ネットワークとブロードキャストアドレスは予約済み）。",
          },
        },
        {
          type: "table",
          caption: {
            en: "CIDR cheat sheet — prefix length to host count",
            np: "CIDR cheat sheet — prefix length to host count",
            jp: "CIDR チートシート — プレフィックス長からホスト数",
          },
          headers: [
            { en: "CIDR Prefix", np: "CIDR Prefix", jp: "CIDR プレフィックス" },
            { en: "Subnet Mask", np: "Subnet Mask", jp: "サブネットマスク" },
            { en: "Total IPs", np: "कुल IP", jp: "総 IP 数" },
            { en: "Usable hosts", np: "Usable host", jp: "使用可能ホスト" },
            { en: "Typical use", np: "Typical use", jp: "典型的な用途" },
          ],
          rows: [
            [
              { en: "/8", np: "/8", jp: "/8" },
              { en: "255.0.0.0", np: "255.0.0.0", jp: "255.0.0.0" },
              { en: "16,777,216", np: "16,777,216", jp: "16,777,216" },
              { en: "16,777,214", np: "16,777,214", jp: "16,777,214" },
              { en: "Entire 10.x.x.x private space", np: "पूरै 10.x.x.x private space", jp: "10.x.x.x プライベート空間全体" },
            ],
            [
              { en: "/16", np: "/16", jp: "/16" },
              { en: "255.255.0.0", np: "255.255.0.0", jp: "255.255.0.0" },
              { en: "65,536", np: "65,536", jp: "65,536" },
              { en: "65,534", np: "65,534", jp: "65,534" },
              { en: "VPC CIDR block (e.g. 10.0.0.0/16)", np: "VPC CIDR block (जस्तै 10.0.0.0/16)", jp: "VPC CIDR ブロック（例：10.0.0.0/16）" },
            ],
            [
              { en: "/24", np: "/24", jp: "/24" },
              { en: "255.255.255.0", np: "255.255.255.0", jp: "255.255.255.0" },
              { en: "256", np: "256", jp: "256" },
              { en: "254", np: "254", jp: "254" },
              { en: "Common subnet — one AZ in a VPC", np: "सामान्य subnet — VPC मा एक AZ", jp: "一般的なサブネット — VPC の 1 AZ" },
            ],
            [
              { en: "/28", np: "/28", jp: "/28" },
              { en: "255.255.255.240", np: "255.255.255.240", jp: "255.255.255.240" },
              { en: "16", np: "16", jp: "16" },
              { en: "14", np: "14", jp: "14" },
              { en: "Small subnet — load balancers, bastion hosts", np: "Small subnet — load balancer, bastion host", jp: "小規模サブネット — ロードバランサー・踏み台ホスト" },
            ],
            [
              { en: "/30", np: "/30", jp: "/30" },
              { en: "255.255.255.252", np: "255.255.255.252", jp: "255.255.255.252" },
              { en: "4", np: "4", jp: "4" },
              { en: "2", np: "2", jp: "2" },
              { en: "Point-to-point links, VPN tunnels", np: "Point-to-point link, VPN tunnel", jp: "ポイントツーポイントリンク・VPN トンネル" },
            ],
            [
              { en: "/32", np: "/32", jp: "/32" },
              { en: "255.255.255.255", np: "255.255.255.255", jp: "255.255.255.255" },
              { en: "1", np: "1", jp: "1" },
              { en: "1 (the host itself)", np: "1 (host आफैं)", jp: "1（ホスト自体）" },
              { en: "Single IP host route, security group rules targeting one IP", np: "Single IP host route, एउटा IP target गर्ने security group rule", jp: "単一 IP ホストルート・1 つの IP を対象とするセキュリティグループルール" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Subnetting math — how to calculate by hand (and with tools)",
            np: "Subnetting math — हातले (र tool ले) कसरी calculate गर्ने",
            jp: "サブネット計算 — 手で（そしてツールで）計算する方法",
          },
          code: `# Example: Given 10.0.1.0/24, find:
# Network address:  10.0.1.0      (all host bits = 0)
# Broadcast:        10.0.1.255    (all host bits = 1)
# Usable range:     10.0.1.1  –  10.0.1.254
# Host count:       256 total, 254 usable (256 - 2)

# /24 mask in binary: 11111111.11111111.11111111.00000000
# The 0s = host portion = 8 bits = 2^8 = 256 addresses

# Quick formula: usable hosts = 2^(32 - prefix) - 2
# /24: 2^(32-24) - 2 = 2^8 - 2 = 254
# /28: 2^(32-28) - 2 = 2^4 - 2 = 14
# /30: 2^(32-30) - 2 = 2^2 - 2 = 2

# Use ipcalc to verify (sudo apt install ipcalc)
ipcalc 10.0.1.0/24
ipcalc 192.168.5.0/28

# Use the 'ip' command to see your current addressing
ip addr show                    # all interfaces with CIDR
ip addr show eth0               # specific interface
ip route show                   # routing table (which subnet goes where)

# Find which subnet a given IP belongs to
ipcalc 10.0.0.150/24           # which /24 block does this IP fall in?`,
        },
      ],
    },
    {
      title: {
        en: "Subnetting in practice — designing a VPC",
        np: "Subnetting in practice — VPC design गर्नुहोस्",
        jp: "実践的なサブネット設計 — VPC の設計",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In AWS (and most cloud providers), a VPC (Virtual Private Cloud) is a logically isolated network with a CIDR block you choose. You divide the VPC into subnets, each placed in an Availability Zone. Public subnets (with a route to an Internet Gateway) host load balancers and bastion hosts. Private subnets host application servers and databases — they can reach the internet via a NAT Gateway but cannot be reached from it directly.",
            np: "AWS (र अधिकांश cloud provider) मा VPC (Virtual Private Cloud) एउटा logically isolated network हो जसको CIDR block तपाईंले choose गर्नुहुन्छ। तपाईं VPC लाई subnet मा divide गर्नुहुन्छ, प्रत्येक Availability Zone मा राखिएको। Public subnet (Internet Gateway को route सहित) ले load balancer र bastion host host गर्छ। Private subnet ले application server र database host गर्छ।",
            jp: "AWS（およびほとんどのクラウドプロバイダー）では、VPC（仮想プライベートクラウド）は自分で選択した CIDR ブロックを持つ論理的に分離されたネットワークです。VPC をサブネットに分割し、各サブネットをアベイラビリティーゾーンに配置します。パブリックサブネット（インターネットゲートウェイへのルートあり）はロードバランサーと踏み台ホストをホストします。プライベートサブネットはアプリケーションサーバーとデータベースをホストします。",
          },
        },
        {
          type: "code",
          title: {
            en: "Designing a typical 3-tier VPC across 2 Availability Zones",
            np: "2 Availability Zone भर typical 3-tier VPC design गर्नुहोस्",
            jp: "2 つのアベイラビリティーゾーンにまたがる典型的な 3 層 VPC の設計",
          },
          code: `# VPC CIDR: 10.0.0.0/16 (65,534 usable IPs)
# Split into /24 subnets (254 usable each)

# Public subnets (load balancers, NAT Gateways)
10.0.1.0/24   →  AZ-1a  (public)
10.0.2.0/24   →  AZ-1b  (public)

# Application subnets (private — app servers, ECS tasks)
10.0.11.0/24  →  AZ-1a  (private)
10.0.12.0/24  →  AZ-1b  (private)

# Database subnets (private — RDS, ElastiCache)
10.0.21.0/24  →  AZ-1a  (private)
10.0.22.0/24  →  AZ-1b  (private)

# Route tables:
# Public subnets:   0.0.0.0/0 → Internet Gateway
# Private subnets:  0.0.0.0/0 → NAT Gateway (in public subnet)
# DB subnets:       no 0.0.0.0/0 route (cannot reach internet at all)

# Security group rules use CIDR blocks:
# Allow app servers to reach DB:
#   Source: 10.0.11.0/24, 10.0.12.0/24
#   Port: 5432 (Postgres)

# Verify on a Linux host
ip addr show                    # your current IP and CIDR
ip route                        # default gateway and routing
ping -c 1 10.0.1.1             # test gateway reachability
traceroute 8.8.8.8             # verify path goes through NAT for private subnets`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Do not use /8 for your VPC** if you might ever need VPC peering or connecting to on-premises. Overlapping CIDRs between peered VPCs cause routing conflicts that are painful to untangle. Plan your address space before you create the first VPC.",
              np: "**VPC का लागि /8 प्रयोग नगर्नुहोस्** यदि तपाईंलाई VPC peering वा on-premises connect गर्न परोस्। Peered VPC बीच overlapping CIDR ले routing conflict गर्छ जो untangle गर्न गाह्रो हुन्छ। पहिलो VPC create गर्नु अघि address space plan गर्नुहोस्।",
              jp: "**VPC に /8 を使用しない** — VPC ピアリングやオンプレミスへの接続が必要になる可能性がある場合。ピアリングされた VPC 間で CIDR が重複すると、解決が困難なルーティングの競合が発生します。最初の VPC を作成する前にアドレス空間を計画してください。",
            },
            {
              en: "**AWS reserves 5 IPs per subnet** (not 2 like standard subnetting). For a /24 subnet you get 251 usable IPs, not 254. Plan your subnet sizes accounting for this: a /28 gives 14 − 5 = 9 usable in AWS.",
              np: "**AWS ले प्रति subnet 5 IP reserve गर्छ** (standard subnetting जस्तै 2 होइन)। /24 subnet मा 254 होइन 251 usable IP पाउनुहुन्छ। यसलाई account गरी subnet size plan गर्नुहोस्: AWS मा /28 ले 14 − 5 = 9 usable दिन्छ।",
              jp: "**AWS はサブネットごとに 5 つの IP を予約します**（標準サブネット計算の 2 つではなく）。/24 サブネットでは 254 ではなく 251 の使用可能な IP が得られます。これを考慮してサブネットサイズを計画してください：AWS の /28 は 14 − 5 = 9 の使用可能 IP を与えます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "IPv6 — the future (already here)",
        np: "IPv6 — भविष्य (पहिले नै आइसकेको)",
        jp: "IPv6 — 未来（すでにここにある）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "IPv6 uses 128-bit addresses written as eight groups of four hexadecimal digits: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. Consecutive groups of zeros can be compressed with `::` — once per address. IPv6 has 2¹²⁸ addresses — effectively unlimited. You will encounter IPv6 in modern cloud environments, Kubernetes (pod CIDRs), and on any host with public internet access.",
            np: "IPv6 ले 128-bit address प्रयोग गर्छ जुन चार hexadecimal digit को आठ group को रूपमा लेखिन्छ: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`। Consecutive zero group लाई `::` ले compress गर्न सकिन्छ — address मा एक पटक। IPv6 मा 2¹²⁸ address छ — effectively unlimited। तपाईंले modern cloud environment, Kubernetes (pod CIDR), र public internet access सहितको host मा IPv6 भेट्नुहुनेछ।",
            jp: "IPv6 は 4 桁の 16 進数の 8 グループとして書かれた 128 ビットアドレスを使用します：`2001:0db8:85a3:0000:0000:8a2e:0370:7334`。連続するゼロのグループは `::` で圧縮できます — アドレスに 1 回。IPv6 には 2¹²⁸ アドレスがあります — 事実上無制限。最新のクラウド環境・Kubernetes（ポッド CIDR）・パブリックインターネットにアクセスできるホストで IPv6 に遭遇します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Working with IPv6",
            np: "IPv6 सँग काम गर्नुहोस्",
            jp: "IPv6 を使った作業",
          },
          code: `# Check if your host has an IPv6 address
ip -6 addr show

# Ping IPv6 (use ping6 or ping -6)
ping6 -c 4 google.com
ping -6 -c 4 google.com

# Trace IPv6 route
traceroute6 google.com

# IPv6 address shortening rules:
# Full:      2001:0db8:0000:0000:0000:0000:0000:0001
# Omit leading zeros per group: 2001:db8:0:0:0:0:0:1
# Compress consecutive all-zero groups with ::  once: 2001:db8::1

# Common IPv6 special addresses:
# ::1           →  loopback (equivalent to 127.0.0.1)
# fe80::/10     →  link-local (auto-configured, not routable)
# fc00::/7      →  unique local (equivalent of RFC1918 private)
# 2000::/3      →  global unicast (publicly routable addresses)

# Kubernetes uses IPv6 dual-stack: check pod CIDRs
# kubectl get nodes -o jsonpath='{.items[*].spec.podCIDR}'`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Subnet a /16 for a multi-tier application",
        np: "Hands-on: Multi-tier application का लागि /16 subnet गर्नुहोस्",
        jp: "ハンズオン: マルチ層アプリケーション向けに /16 をサブネット化する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Calculate and document a subnet plan with ipcalc",
            np: "ipcalc ले subnet plan calculate र document गर्नुहोस्",
            jp: "ipcalc でサブネット計画を計算して文書化する",
          },
          code: `# Install ipcalc if not present
sudo apt install ipcalc -y

# Our VPC: 10.10.0.0/16
ipcalc 10.10.0.0/16
# → 65534 hosts, network 10.10.0.0, broadcast 10.10.255.255

# Public subnets (/24 each = 254 usable, 251 in AWS)
ipcalc 10.10.1.0/24     # AZ-a public
ipcalc 10.10.2.0/24     # AZ-b public

# Private app subnets (/24)
ipcalc 10.10.11.0/24    # AZ-a private app
ipcalc 10.10.12.0/24    # AZ-b private app

# Private DB subnets (/24)
ipcalc 10.10.21.0/24    # AZ-a DB
ipcalc 10.10.22.0/24    # AZ-b DB

# Verify no overlaps — all /24 blocks are distinct, all within 10.10.0.0/16 ✓

# On your Linux machine, add a test interface with an IP
# (this simulates being inside a subnet)
sudo ip addr add 10.10.11.5/24 dev lo          # add to loopback for testing
ip addr show lo                                # verify it appears
ip route show                                  # new connected route should appear
ping -c 1 10.10.11.1                          # ping subnet gateway (won't reply, but no error = in subnet)
sudo ip addr del 10.10.11.5/24 dev lo         # clean up

# Check if two IPs are in the same subnet
# 10.10.11.5 and 10.10.11.200 both in 10.10.11.0/24?
ipcalc 10.10.11.5/24      # network: 10.10.11.0
ipcalc 10.10.11.200/24    # network: 10.10.11.0 → same subnet ✓
# 10.10.11.5 and 10.10.12.5?
ipcalc 10.10.12.5/24      # network: 10.10.12.0 → different subnet ✗`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I quickly calculate how many hosts fit in a /N subnet?",
        np: "/N subnet मा कति host fit हुन्छ छिटो कसरी calculate गर्ने?",
        jp: "/N サブネットに何ホスト入るかをすばやく計算するには？",
      },
      answer: {
        en: "The formula is 2^(32 − N) − 2. The (32 − N) gives you the number of host bits; 2 raised to that power gives total addresses; subtract 2 for the network and broadcast. Memorize the key ones: /24 = 254, /25 = 126, /26 = 62, /27 = 30, /28 = 14, /29 = 6, /30 = 2. In AWS subtract 3 more (AWS reserves 5 total, not 2).",
        np: "Formula: 2^(32 − N) − 2। (32 − N) ले host bit संख्या दिन्छ; 2 को त्यो power ले total address दिन्छ; network र broadcast का लागि 2 घटाउनुहोस्। मुख्य याद गर्नुहोस्: /24 = 254, /25 = 126, /26 = 62, /27 = 30, /28 = 14, /29 = 6, /30 = 2। AWS मा 3 थप घटाउनुहोस् (AWS ले कुल 5 reserve गर्छ, 2 होइन)।",
        jp: "公式は 2^(32 − N) − 2 です。(32 − N) がホストビット数を与え、2 のその乗がアドレス総数を与え、ネットワークとブロードキャスト用に 2 を引きます。重要なものを暗記してください：/24 = 254・/25 = 126・/26 = 62・/27 = 30・/28 = 14・/29 = 6・/30 = 2。AWS ではさらに 3 を引きます（AWS は合計 5 を予約するため）。",
      },
      tag: { en: "subnetting", np: "सब्नेटिङ", jp: "サブネット計算" },
    },
    {
      question: {
        en: "What is NAT and why does my private subnet need it to reach the internet?",
        np: "NAT के हो र मेरो private subnet लाई internet reach गर्न किन चाहिन्छ?",
        jp: "NAT とは何か、プライベートサブネットがインターネットに到達するためになぜ必要か？",
      },
      answer: {
        en: "NAT (Network Address Translation) allows many private IP addresses to share a single public IP. When your server at 10.0.11.5 makes a request to the internet, the NAT Gateway (or router) replaces the source IP with its own public IP, forwards the packet, and when the response comes back it translates the destination back to 10.0.11.5. This is why private subnet instances can initiate outbound connections but cannot accept inbound ones — no public IP means nothing can find them directly.",
        np: "NAT (Network Address Translation) ले धेरै private IP address लाई एउटा public IP share गर्न दिन्छ। तपाईंको server 10.0.11.5 ले internet मा request गर्दा, NAT Gateway (वा router) ले source IP लाई आफ्नो public IP ले replace गर्छ, packet forward गर्छ, र response आउँदा destination लाई 10.0.11.5 मा translate गर्छ। त्यसैले private subnet instance ले outbound connection initiate गर्न सक्छ तर inbound accept गर्न सक्दैन।",
        jp: "NAT（ネットワークアドレス変換）により、多くのプライベート IP アドレスが 1 つのパブリック IP を共有できます。10.0.11.5 のサーバーがインターネットにリクエストを送ると、NAT ゲートウェイ（またはルーター）がソース IP を自分のパブリック IP に置き換えてパケットを転送し、レスポンスが返ってくると宛先を 10.0.11.5 に戻します。これがプライベートサブネットのインスタンスがアウトバウンド接続を開始できるが、インバウンドを受け付けられない理由です。",
      },
      tag: { en: "subnetting", np: "सब्नेटिङ", jp: "サブネット計算" },
    },
    {
      question: {
        en: "What is the difference between a security group and a network ACL (NACL)?",
        np: "Security group र network ACL (NACL) बीच के फरक छ?",
        jp: "セキュリティグループとネットワーク ACL（NACL）の違いは？",
      },
      answer: {
        en: "Both are AWS firewall layers but operate at different levels. Security groups are stateful (if you allow inbound traffic, the response is automatically allowed) and apply to individual ENIs/instances. NACLs are stateless (you must explicitly allow both inbound and return traffic), apply at the subnet level, and evaluate rules in order by number. Use security groups for per-instance rules; use NACLs as a subnet-wide safety net (e.g., block a specific IP range across an entire subnet).",
        np: "दुवै AWS firewall layer हुन् तर फरक level मा operate गर्छन्। Security group stateful छ (inbound traffic allow गरे response automatically allow हुन्छ) र individual ENI/instance मा apply हुन्छ। NACL stateless छ (inbound र return traffic दुवै explicitly allow गर्नुपर्छ), subnet level मा apply हुन्छ, र rule लाई number अनुसार evaluate गर्छ। Per-instance rule का लागि security group; subnet-wide safety net का लागि NACL प्रयोग गर्नुहोस्।",
        jp: "どちらも AWS のファイアウォール層ですが、異なるレベルで動作します。セキュリティグループはステートフル（インバウンドトラフィックを許可すると、レスポンスは自動的に許可される）で、個々の ENI/インスタンスに適用されます。NACL はステートレス（インバウンドとリターントラフィックの両方を明示的に許可する必要がある）で、サブネットレベルに適用され、番号順にルールを評価します。",
      },
      tag: { en: "subnetting", np: "सब्नेटिङ", jp: "サブネット計算" },
    },
  ],
};
