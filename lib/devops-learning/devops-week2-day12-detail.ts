import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A firewall is the first line of defense for any server — it decides which traffic is allowed in and out before any application code runs. Routing determines where packets go. NAT is how private networks share a single public IP. Together these three concepts explain why your EC2 instance is reachable on port 443 but not 22, and why your laptop can browse the internet despite having a 192.168.x.x address.",
    np: "Firewall कुनै पनि server को पहिलो defense line हो — यसले कुनै पनि application code run हुनु अघि कुन traffic भित्र र बाहिर जान अनुमति छ निर्णय गर्छ। Routing ले packet कहाँ जान्छ निर्धारण गर्छ। NAT भनेको private network ले एउटा public IP share गर्ने तरिका हो। यी तीन अवधारणा मिलेर explain गर्छ किन तपाईंको EC2 instance port 443 मा reachable छ तर 22 मा छैन, र किन तपाईंको laptop 192.168.x.x address भएर पनि internet browse गर्न सक्छ।",
    jp: "ファイアウォールはあらゆるサーバーの最初の防衛線です。アプリケーションコードが実行される前に、どのトラフィックを許可するかを決定します。ルーティングはパケットの行き先を決めます。NAT はプライベートネットワークが単一のパブリック IP を共有する仕組みです。この 3 つの概念が合わさって、EC2 インスタンスがポート 443 では到達可能でも 22 では到達不可な理由と、ラップトップが 192.168.x.x アドレスを持ちながらインターネットを閲覧できる理由を説明します。",
  } as const,
  o2: {
    en: "Today you learn iptables (the Linux kernel's native firewall), ufw (the human-friendly wrapper), routing tables, and NAT. You will also see how cloud security groups implement stateful firewalling without touching iptables at all.",
    np: "आज तपाईंले iptables (Linux kernel को native firewall), ufw (human-friendly wrapper), routing table, र NAT सिक्नुहुनेछ। तपाईंले cloud security group ले iptables नछोइकन कसरी stateful firewalling implement गर्छ पनि देख्नुहुनेछ।",
    jp: "本日は iptables（Linux カーネルのネイティブファイアウォール）・ufw（人間に優しいラッパー）・ルーティングテーブル・NAT を学びます。クラウドのセキュリティグループが iptables にまったく触れずにステートフルなファイアウォールを実装する方法も確認します。",
  } as const,
};

export const DEVOPS_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "How firewalls work — stateless vs stateful",
        np: "Firewall कसरी काम गर्छ — stateless बनाम stateful",
        jp: "ファイアウォールの仕組み — ステートレスとステートフル",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **stateless** firewall evaluates each packet in isolation against a ruleset — it has no memory of previous packets. You must write rules in both directions (inbound and outbound) even for the same connection. A **stateful** firewall (iptables with `conntrack`, AWS security groups) tracks connection state and automatically allows return traffic for established connections. Stateful is almost always what you want.",
            np: "**Stateless** firewall ले प्रत्येक packet लाई ruleset विरुद्ध अलग-अलग evaluate गर्छ — यसलाई previous packet को memory छैन। एउटै connection का लागि पनि दुवै direction (inbound र outbound) मा rule लेख्नुपर्छ। **Stateful** firewall (iptables with `conntrack`, AWS security group) ले connection state track गर्छ र established connection का लागि automatically return traffic allow गर्छ।",
            jp: "**ステートレス**ファイアウォールは各パケットをルールセットに対して独立して評価します。以前のパケットの記憶がないため、同じ接続でも両方向（受信と送信）にルールを書く必要があります。**ステートフル**ファイアウォール（`conntrack` 付きの iptables・AWS セキュリティグループ）は接続状態を追跡し、確立済み接続のリターントラフィックを自動的に許可します。ほぼ常にステートフルが望ましいです。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Firewall tools comparison",
            np: "Firewall tool तुलना",
            jp: "ファイアウォールツールの比較",
          },
          headers: [
            { en: "Tool", np: "Tool", jp: "ツール" },
            { en: "Layer", np: "तह", jp: "レイヤー" },
            { en: "Stateful?", np: "Stateful?", jp: "ステートフル？" },
            { en: "Best used for", np: "सबभन्दा राम्रो प्रयोग", jp: "主な用途" },
          ],
          rows: [
            [
              { en: "iptables", np: "iptables", jp: "iptables" },
              { en: "Kernel (Netfilter)", np: "Kernel (Netfilter)", jp: "カーネル（Netfilter）" },
              { en: "Yes (with conntrack)", np: "हो (conntrack सहित)", jp: "はい（conntrack 使用時）" },
              { en: "Fine-grained Linux server rules", np: "Fine-grained Linux server नियम", jp: "Linux サーバーの細かいルール" },
            ],
            [
              { en: "ufw", np: "ufw", jp: "ufw" },
              { en: "iptables wrapper", np: "iptables wrapper", jp: "iptables ラッパー" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "Simple server hardening (Ubuntu/Debian)", np: "सरल server hardening (Ubuntu/Debian)", jp: "シンプルなサーバー強化（Ubuntu/Debian）" },
            ],
            [
              { en: "nftables", np: "nftables", jp: "nftables" },
              { en: "Kernel (replaces iptables)", np: "Kernel (iptables replace)", jp: "カーネル（iptables の後継）" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "Modern Linux (RHEL 8+, Debian 10+)", np: "Modern Linux (RHEL 8+, Debian 10+)", jp: "最新 Linux（RHEL 8+・Debian 10+）" },
            ],
            [
              { en: "AWS Security Groups", np: "AWS Security Group", jp: "AWS セキュリティグループ" },
              { en: "Hypervisor (outside OS)", np: "Hypervisor (OS बाहिर)", jp: "ハイパーバイザー（OS 外）" },
              { en: "Yes", np: "हो", jp: "はい" },
              { en: "EC2/VPC — simplest cloud firewalling", np: "EC2/VPC — सरल cloud firewalling", jp: "EC2/VPC — 最もシンプルなクラウドファイアウォール" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "ufw — the practical firewall for most servers",
        np: "ufw — अधिकांश server का लागि व्यावहारिक firewall",
        jp: "ufw — ほとんどのサーバーに実用的なファイアウォール",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Hardening a fresh Ubuntu server with ufw",
            np: "ufw सँग नयाँ Ubuntu server harden गर्नुहोस्",
            jp: "ufw で新しい Ubuntu サーバーを強化する",
          },
          code: `# Check status
sudo ufw status verbose

# Default policy — deny everything in, allow everything out
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH BEFORE enabling — or you'll lock yourself out
sudo ufw allow 22/tcp

# Allow web traffic
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow from a specific IP only (e.g. your monitoring server)
sudo ufw allow from 203.0.113.5 to any port 9100 comment "Prometheus node exporter"

# Allow from a subnet
sudo ufw allow from 10.0.0.0/8 to any port 5432 comment "Postgres from internal network"

# Rate-limit SSH to prevent brute-force (blocks IPs after 6 attempts in 30s)
sudo ufw limit ssh

# Enable the firewall
sudo ufw enable

# Delete a rule
sudo ufw status numbered
sudo ufw delete 3          # delete rule number 3

# Reset everything
sudo ufw reset

# Allow a named service (ufw reads /etc/services)
sudo ufw allow 'Nginx Full'   # allows both 80 and 443`,
        },
      ],
    },
    {
      title: {
        en: "iptables — understanding the rule chain",
        np: "iptables — rule chain बुझ्नुहोस्",
        jp: "iptables — ルールチェーンを理解する",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "iptables organises rules into **tables** (filter, nat, mangle) and **chains** (INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING). Most server hardening uses the `filter` table: INPUT (traffic coming in to the server), OUTPUT (traffic leaving the server), FORWARD (traffic passing through, if the server is a router). Rules are evaluated top-to-bottom; the first match wins.",
            np: "iptables ले rule लाई **table** (filter, nat, mangle) र **chain** (INPUT, OUTPUT, FORWARD, PREROUTING, POSTROUTING) मा organize गर्छ। अधिकांश server hardening ले `filter` table प्रयोग गर्छ: INPUT (server मा आउने traffic), OUTPUT (server बाट जाने traffic), FORWARD (server मार्फत pass हुने traffic)। Rule माथिबाट तलसम्म evaluate हुन्छ; पहिलो match जित्छ।",
            jp: "iptables はルールを**テーブル**（filter・nat・mangle）と**チェーン**（INPUT・OUTPUT・FORWARD・PREROUTING・POSTROUTING）に整理します。ほとんどのサーバー強化では `filter` テーブルを使います。INPUT（サーバーへの受信トラフィック）・OUTPUT（サーバーからの送信トラフィック）・FORWARD（サーバーを通過するトラフィック）。ルールは上から下に評価され、最初に一致したものが適用されます。",
          },
        },
        {
          type: "code",
          title: {
            en: "iptables essentials",
            np: "iptables essentials",
            jp: "iptables の基本",
          },
          code: `# View current rules
sudo iptables -L -v -n          # filter table (default)
sudo iptables -L -v -n --line-numbers   # with line numbers for deletion

# Allow established connections (stateful — add this early in INPUT)
sudo iptables -A INPUT -m conntrack --ctstate ESTABLISHED,RELATED -j ACCEPT

# Allow loopback (local communication)
sudo iptables -A INPUT -i lo -j ACCEPT

# Allow SSH
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# Allow HTTP/HTTPS
sudo iptables -A INPUT -p tcp -m multiport --dports 80,443 -j ACCEPT

# Drop everything else (put this LAST)
sudo iptables -P INPUT DROP
sudo iptables -P FORWARD DROP

# Delete a specific rule by line number
sudo iptables -D INPUT 5

# Save rules so they survive reboot (Debian/Ubuntu)
sudo apt install iptables-persistent
sudo netfilter-persistent save

# Save rules (RHEL/CentOS)
sudo service iptables save

# Flush all rules (use with caution — drops all existing rules)
sudo iptables -F

# View NAT table
sudo iptables -t nat -L -v -n`,
        },
      ],
    },
    {
      title: {
        en: "Routing — how packets find their destination",
        np: "Routing — packet ले आफ्नो destination कसरी खोज्छ",
        jp: "ルーティング — パケットが宛先を見つける方法",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reading and manipulating routing tables",
            np: "Routing table पढ्नुहोस् र manipulate गर्नुहोस्",
            jp: "ルーティングテーブルの読み取りと操作",
          },
          code: `# View the routing table
ip route
# Example output:
# default via 10.0.0.1 dev eth0 proto dhcp
# 10.0.0.0/24 dev eth0 proto kernel scope link src 10.0.0.5
# 172.17.0.0/16 dev docker0 proto kernel scope link src 172.17.0.1

# Which interface will a packet use to reach an IP?
ip route get 8.8.8.8

# Add a static route (traffic to 192.168.50.0/24 goes via 10.0.0.200)
sudo ip route add 192.168.50.0/24 via 10.0.0.200

# Add a persistent static route (Debian/Ubuntu — /etc/netplan/*.yaml)
# Add a default gateway
sudo ip route add default via 10.0.0.1

# Enable IP forwarding (makes Linux act as a router)
sudo sysctl -w net.ipv4.ip_forward=1
# Make permanent:
echo "net.ipv4.ip_forward=1" | sudo tee /etc/sysctl.d/99-ip-forward.conf
sudo sysctl -p /etc/sysctl.d/99-ip-forward.conf

# Show ARP table (MAC-to-IP mappings on local network)
ip neigh`,
        },
      ],
    },
    {
      title: {
        en: "NAT — how private IPs share a public address",
        np: "NAT — private IP ले कसरी public address share गर्छ",
        jp: "NAT — プライベート IP がパブリックアドレスを共有する仕組み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "NAT (Network Address Translation) rewrites IP addresses in packet headers as they pass through a router. The most common form is **SNAT/masquerade** (source NAT): your router replaces the private source IP (192.168.x.x) with its own public IP before forwarding packets to the internet, and tracks which internal host each connection belongs to so it can forward the reply back correctly. This is how every home router and AWS VPC NAT gateway works.",
            np: "NAT (Network Address Translation) ले packet header मा IP address लाई router मार्फत pass हुँदा rewrite गर्छ। सबभन्दा सामान्य form **SNAT/masquerade** (source NAT) हो: तपाईंको router ले internet मा packet forward गर्नु अघि private source IP (192.168.x.x) लाई आफ्नो public IP ले replace गर्छ, र reply सही ठाउँमा फर्काउन कुन internal host प्रत्येक connection को हो track गर्छ। यसरी हरेक home router र AWS VPC NAT gateway काम गर्छ।",
            jp: "NAT（ネットワークアドレス変換）はパケットがルーターを通過する際にヘッダーの IP アドレスを書き換えます。最も一般的な形は **SNAT/マスカレード**（送信元 NAT）です。ルーターがインターネットにパケットを転送する前にプライベート送信元 IP（192.168.x.x）を自身のパブリック IP に置き換え、どの内部ホストが各接続のものかを追跡して返信を正しく転送します。これがすべての家庭用ルーターと AWS VPC NAT ゲートウェイの仕組みです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Setting up NAT with iptables (Linux as a router)",
            np: "iptables सँग NAT setup गर्नुहोस् (Linux router को रूपमा)",
            jp: "iptables で NAT をセットアップする（Linux をルーターとして使う）",
          },
          code: `# Scenario: eth0 = public interface, eth1 = private LAN interface
# Enable forwarding (required for routing)
sudo sysctl -w net.ipv4.ip_forward=1

# Masquerade: rewrite source IP of outbound packets to the public IP
sudo iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Allow forwarded traffic (LAN → internet)
sudo iptables -A FORWARD -i eth1 -o eth0 -j ACCEPT
sudo iptables -A FORWARD -i eth0 -o eth1 -m conntrack \
  --ctstate ESTABLISHED,RELATED -j ACCEPT

# Port forwarding (DNAT): forward external port 8080 to internal host:80
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 8080 \
  -j DNAT --to-destination 192.168.1.10:80

# View NAT rules
sudo iptables -t nat -L -v -n

# On AWS: NAT Gateways do this automatically for private subnets.
# Your private subnet instances route default traffic to the NAT GW:
# Route: 0.0.0.0/0 → nat-0abc123456789`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**SNAT vs MASQUERADE**: both do source NAT. MASQUERADE dynamically uses the outgoing interface's current IP (good for DHCP/cloud). SNAT requires you to specify the IP explicitly — slightly faster since it skips the IP lookup.",
              np: "**SNAT बनाम MASQUERADE**: दुवैले source NAT गर्छ। MASQUERADE ले outgoing interface को current IP dynamically प्रयोग गर्छ (DHCP/cloud का लागि राम्रो)। SNAT ले IP explicitly specify गर्न आवश्यक पर्छ — IP lookup skip गर्ने हुनाले केही छिटो।",
              jp: "**SNAT と MASQUERADE**：どちらも送信元 NAT を行います。MASQUERADE は送信インターフェースの現在の IP を動的に使います（DHCP/クラウドに適する）。SNAT は IP を明示的に指定する必要があります。IP ルックアップをスキップするため若干高速です。",
            },
            {
              en: "**AWS Security Groups vs NACLs**: Security Groups are stateful (return traffic is automatic) and attached to instances. NACLs (Network ACLs) are stateless and attached to subnets — you need explicit inbound AND outbound rules. For most use cases, Security Groups are sufficient.",
              np: "**AWS Security Group बनाम NACL**: Security Group stateful (return traffic automatic) र instance मा attached छ। NACL (Network ACL) stateless र subnet मा attached छ — explicit inbound र outbound rule दुवै चाहिन्छ। अधिकांश use case का लागि Security Group पर्याप्त छ।",
              jp: "**AWS セキュリティグループと NACL**：セキュリティグループはステートフル（リターントラフィックは自動）でインスタンスに付きます。NACL（ネットワーク ACL）はステートレスでサブネットに付き、インバウンドとアウトバウンドの両方のルールが必要です。ほとんどの用途ではセキュリティグループで十分です。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "I locked myself out of SSH after changing firewall rules. How do I recover?",
        np: "Firewall rule बदलेपछि SSH बाट आफैलाई lock गरें। कसरी recover गर्ने?",
        jp: "ファイアウォールルールを変更した後 SSH から締め出された。どうやって復旧するか？",
      },
      answer: {
        en: "If on a cloud VM (AWS/GCP/Azure): use the web console's browser-based serial console or 'Connect' feature to get a shell without SSH, then fix your firewall rules. On AWS, you can also attach the root volume to another instance. Prevention: always run `ufw allow ssh` before `ufw enable`, and keep a tmux/screen session open while testing iptables changes — the session survives even if new connections are blocked. A safe pattern: use `iptables-restore` with a timeout: set a cron to flush rules in 5 minutes before applying them, then cancel the cron if everything works.",
        np: "Cloud VM (AWS/GCP/Azure) मा छ भने: web console को browser-based serial console वा 'Connect' feature प्रयोग गरेर SSH बिना shell पाउनुहोस्, त्यसपछि firewall rule fix गर्नुहोस्। AWS मा root volume अर्को instance मा attach गर्न पनि सकिन्छ। Prevention: `ufw enable` अघि सधैं `ufw allow ssh` run गर्नुहोस्, र iptables change test गर्दा tmux/screen session खुला राख्नुहोस्।",
        jp: "クラウド VM（AWS/GCP/Azure）なら：Web コンソールのブラウザーベースのシリアルコンソールか「接続」機能を使って SSH なしでシェルを取得し、ファイアウォールルールを修正します。AWS では root ボリュームを別のインスタンスにアタッチすることもできます。予防策：`ufw enable` の前に必ず `ufw allow ssh` を実行し、iptables の変更テスト中は tmux/screen セッションを開いたままにしましょう。",
      },
      tag: { en: "firewall", np: "फायरवाल", jp: "ファイアウォール" },
    },
    {
      question: {
        en: "What ports should I always block on a public-facing server?",
        np: "Public-facing server मा सधैं कुन port block गर्नुपर्छ?",
        jp: "パブリックに公開されているサーバーで常にブロックすべきポートは？",
      },
      answer: {
        en: "The default-deny approach is safer: block everything and only open what you need. At minimum block: 23 (Telnet — plaintext), 3306 (MySQL — never expose to internet), 5432 (PostgreSQL — same), 6379 (Redis — no auth by default), 27017 (MongoDB), 2375 (Docker daemon — critical: if open, an attacker owns your host). Move SSH to a non-standard port (e.g. 2222) to reduce automated scanning noise. Use `fail2ban` to automatically block IPs that fail SSH auth repeatedly.",
        np: "Default-deny approach सुरक्षित छ: सबै block गर्नुहोस् र केवल चाहिने खोल्नुहोस्। कम से कम block गर्नुहोस्: 23 (Telnet — plaintext), 3306 (MySQL — internet मा कहिल्यै expose नगर्नुहोस्), 5432 (PostgreSQL — उस्तै), 6379 (Redis — पूर्वनिर्धारित रूपमा auth छैन), 27017 (MongoDB), 2375 (Docker daemon — critical: खुला भएमा attacker ले तपाईंको host own गर्छ)।",
        jp: "デフォルト拒否アプローチの方が安全です：すべてブロックして必要なものだけ開けます。最低限ブロックすべき：23（Telnet — 平文）・3306（MySQL — インターネットに公開しない）・5432（PostgreSQL — 同様）・6379（Redis — デフォルトで認証なし）・27017（MongoDB）・2375（Docker デーモン — 重大：開いていると攻撃者にホストを乗っ取られる）。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
    },
  ],
};
