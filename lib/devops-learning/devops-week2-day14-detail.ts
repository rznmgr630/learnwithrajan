import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "In a modern cloud environment your servers live in private networks with no public IP. Engineers connect over VPN. Microservices talk over encrypted tunnels. Secrets flow through secure channels. VPNs and tunneling are not optional extras — they are the infrastructure that makes remote access and private networking possible at scale.",
    np: "आधुनिक cloud environment मा तपाईंका server private network मा बाँचिरहेका हुन्छन् जसमा public IP छैन। Engineer VPN मार्फत connect हुन्छन्। Microservice encrypted tunnel मार्फत कुराकानी गर्छन्। Secret सुरक्षित channel मार्फत बग्छन्। VPN र tunneling optional extra होइनन् — यिनीहरू remote access र scale मा private networking सम्भव बनाउने infrastructure हुन्।",
    jp: "現代のクラウド環境では、サーバーはパブリック IP を持たないプライベートネットワークに存在します。エンジニアは VPN 経由で接続します。マイクロサービスは暗号化されたトンネルで通信します。シークレットはセキュアなチャネルを流れます。VPN とトンネリングはオプションの付加機能ではなく、リモートアクセスとスケールでのプライベートネットワーキングを可能にするインフラです。",
  } as const,
  o2: {
    en: "Today you understand how VPNs work, the difference between WireGuard and OpenVPN, how SSH tunnels solve the same problem for one-off connections, and how cloud-native solutions like AWS Client VPN and PrivateLink fit into a real architecture.",
    np: "आज तपाईंले VPN कसरी काम गर्छ, WireGuard र OpenVPN बीच फरक, SSH tunnel ले one-off connection का लागि उही समस्या कसरी solve गर्छ, र AWS Client VPN र PrivateLink जस्ता cloud-native solution ले real architecture मा कसरी fit हुन्छ बुझ्नुहुनेछ।",
    jp: "本日は VPN の仕組み・WireGuard と OpenVPN の違い・SSH トンネルが一時的な接続で同じ問題を解決する方法・AWS Client VPN や PrivateLink などのクラウドネイティブなソリューションが実際のアーキテクチャにどう収まるかを理解します。",
  } as const,
};

export const DEVOPS_DAY_14_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "How VPNs work — tunneling and encryption",
        np: "VPN कसरी काम गर्छ — tunneling र encryption",
        jp: "VPN の仕組み — トンネリングと暗号化",
      },
      blocks: [
        { type: "diagram", id: "devops-vpn-tunnel" },
        {
          type: "paragraph",
          text: {
            en: "A VPN creates a virtual encrypted network link between two points across an untrusted network (the internet). Your device gets a virtual IP address in the remote network's range. All traffic to that range is encapsulated inside encrypted packets and sent through the VPN tunnel. From the remote network's perspective, you appear to be a local machine. This is why a developer can `psql -h 10.0.1.5` directly to a private RDS instance once connected to a VPN.",
            np: "VPN ले untrusted network (internet) पार एक encrypted virtual network link बनाउँछ। तपाईंको device लाई remote network को range मा virtual IP address मिल्छ। त्यो range मा जाने सबै traffic encrypted packet भित्र encapsulate गरी VPN tunnel मार्फत पठाइन्छ। Remote network को दृष्टिकोणबाट, तपाईं local machine जस्तो देखिनुहुन्छ।",
            jp: "VPN は信頼されていないネットワーク（インターネット）を越えて 2 点間に仮想的な暗号化ネットワークリンクを作ります。デバイスはリモートネットワークの範囲内の仮想 IP アドレスを取得します。その範囲へのすべてのトラフィックは暗号化パケット内にカプセル化されて VPN トンネルを通じて送られます。リモートネットワークからは、あなたはローカルマシンとして見えます。",
          },
        },
        {
          type: "table",
          caption: {
            en: "VPN types and when to use each",
            np: "VPN प्रकार र कहिले कुन प्रयोग गर्ने",
            jp: "VPN の種類とそれぞれの使いどころ",
          },
          headers: [
            { en: "Type", np: "प्रकार", jp: "種類" },
            { en: "Protocol", np: "Protocol", jp: "プロトコル" },
            { en: "Best for", np: "सबभन्दा राम्रो प्रयोग", jp: "最適な用途" },
            { en: "Complexity", np: "जटिलता", jp: "複雑さ" },
          ],
          rows: [
            [
              { en: "WireGuard", np: "WireGuard", jp: "WireGuard" },
              { en: "UDP (custom)", np: "UDP (custom)", jp: "UDP（独自）" },
              { en: "Modern server-to-server, developer access", np: "Modern server-to-server, developer access", jp: "最新のサーバー間・開発者アクセス" },
              { en: "Low — ~100 lines of kernel code", np: "कम — ~100 lines kernel code", jp: "低 — カーネルコード約 100 行" },
            ],
            [
              { en: "OpenVPN", np: "OpenVPN", jp: "OpenVPN" },
              { en: "UDP or TCP / TLS", np: "UDP वा TCP / TLS", jp: "UDP または TCP / TLS" },
              { en: "Legacy infra, enterprise, certificate-based auth", np: "Legacy infra, enterprise, certificate-based auth", jp: "レガシーインフラ・エンタープライズ・証明書認証" },
              { en: "Medium — complex config", np: "मध्यम — जटिल config", jp: "中 — 複雑な設定" },
            ],
            [
              { en: "IPsec/IKEv2", np: "IPsec/IKEv2", jp: "IPsec/IKEv2" },
              { en: "UDP 500/4500", np: "UDP 500/4500", jp: "UDP 500/4500" },
              { en: "Site-to-site (office ↔ cloud), mobile clients", np: "Site-to-site (office ↔ cloud), mobile client", jp: "サイト間（オフィス ↔ クラウド）・モバイルクライアント" },
              { en: "High — kernel-level, many options", np: "उच्च — kernel-level, धेरै option", jp: "高 — カーネルレベル・多数のオプション" },
            ],
            [
              { en: "SSH Tunnel", np: "SSH Tunnel", jp: "SSH トンネル" },
              { en: "TCP (SSH)", np: "TCP (SSH)", jp: "TCP（SSH）" },
              { en: "One-off access to a single service, no VPN setup", np: "Single service को one-off access, VPN setup छैन", jp: "単一サービスへの一時的アクセス、VPN 設定不要" },
              { en: "None — just SSH", np: "छैन — केवल SSH", jp: "なし — SSH だけ" },
            ],
            [
              { en: "AWS Client VPN", np: "AWS Client VPN", jp: "AWS Client VPN" },
              { en: "OpenVPN (managed)", np: "OpenVPN (managed)", jp: "OpenVPN（マネージド）" },
              { en: "Developer access to private VPCs", np: "Private VPC मा developer access", jp: "プライベート VPC への開発者アクセス" },
              { en: "Low (AWS manages the server)", np: "कम (AWS ले server manage)", jp: "低（AWS がサーバーを管理）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "WireGuard — the modern VPN",
        np: "WireGuard — modern VPN",
        jp: "WireGuard — 最新の VPN",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "WireGuard is built into the Linux kernel since version 5.6 and available as a module on older kernels. It uses modern cryptography (ChaCha20, Poly1305, Curve25519) and has a dramatically simpler configuration model than OpenVPN: each peer has a keypair, and you list which peers can send traffic. There is no CA, no certificate rotation, no complex PKI.",
            np: "WireGuard Linux kernel version 5.6 देखि built-in छ र पुराना kernel मा module को रूपमा उपलब्ध छ। यसले modern cryptography (ChaCha20, Poly1305, Curve25519) प्रयोग गर्छ र OpenVPN भन्दा धेरै सरल configuration model छ: प्रत्येक peer मा keypair छ, र तपाईंले कुन peer ले traffic पठाउन सक्छ list गर्नुहुन्छ। कुनै CA, certificate rotation, वा complex PKI छैन।",
            jp: "WireGuard は Linux カーネルバージョン 5.6 以降に組み込まれ、古いカーネルではモジュールとして利用できます。最新の暗号化（ChaCha20・Poly1305・Curve25519）を使用し、OpenVPN より大幅にシンプルな設定モデルを持ちます。各ピアはキーペアを持ち、トラフィックを送れるピアをリストアップするだけです。CA・証明書のローテーション・複雑な PKI は不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "WireGuard server and client setup",
            np: "WireGuard server र client setup",
            jp: "WireGuard サーバーとクライアントのセットアップ",
          },
          code: `# Install
sudo apt install wireguard

# Generate server keypair
wg genkey | sudo tee /etc/wireguard/server_private.key | \
  wg pubkey | sudo tee /etc/wireguard/server_public.key
sudo chmod 600 /etc/wireguard/server_private.key

# Generate client keypair (do this on each client machine)
wg genkey | tee client_private.key | wg pubkey > client_public.key

# Server config: /etc/wireguard/wg0.conf
# -----------------------------------------------
[Interface]
Address    = 10.8.0.1/24          # VPN IP for this server
PrivateKey = <server_private.key contents>
ListenPort = 51820

# Add a firewall rule for NAT (so VPN clients can reach the internet)
PostUp   = iptables -A FORWARD -i wg0 -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i wg0 -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE

[Peer]
# Developer Alice
PublicKey  = <alice's client_public.key>
AllowedIPs = 10.8.0.2/32          # only this VPN IP routes to her
# -----------------------------------------------

# Start WireGuard
sudo systemctl enable --now wg-quick@wg0
sudo wg show                        # check status

# Client config: /etc/wireguard/wg0.conf on Alice's machine
# -----------------------------------------------
[Interface]
Address    = 10.8.0.2/24
PrivateKey = <alice's client_private.key>
DNS        = 1.1.1.1

[Peer]
PublicKey  = <server_public.key>
Endpoint   = SERVER_PUBLIC_IP:51820
AllowedIPs = 10.0.0.0/8            # route all private traffic through VPN
PersistentKeepalive = 25           # keep connection alive through NAT
# -----------------------------------------------

# Connect
sudo wg-quick up wg0
sudo wg show          # should show handshake timestamp if working`,
        },
      ],
    },
    {
      title: {
        en: "SSH tunnels — instant secure access without a VPN",
        np: "SSH tunnel — VPN बिना तत्काल secure access",
        jp: "SSH トンネル — VPN なしで即座にセキュアアクセス",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Local, remote, and dynamic port forwarding",
            np: "Local, remote, र dynamic port forwarding",
            jp: "ローカル・リモート・ダイナミックポートフォワーディング",
          },
          code: `# LOCAL PORT FORWARDING — access a remote service locally
# Pattern: ssh -L LOCAL_PORT:TARGET_HOST:TARGET_PORT JUMP_HOST
# All connections to localhost:LOCAL_PORT go through JUMP_HOST → TARGET_HOST:TARGET_PORT

# Access a private PostgreSQL DB (not directly reachable)
ssh -L 5432:db.internal:5432 bastion.example.com
# Now: psql -h localhost -U app mydb

# Access an internal web dashboard
ssh -L 8080:monitoring.internal:80 bastion.example.com
# Now: open http://localhost:8080 in your browser

# Access multiple services at once
ssh -L 5432:db.internal:5432 \
    -L 6379:redis.internal:6379 \
    -L 8080:app.internal:80 \
    bastion.example.com

# Keep tunnel open as background process (no shell)
ssh -fNL 5432:db.internal:5432 bastion.example.com
# -f = background  -N = no command  -L = local forward

# Kill a background tunnel
pkill -f "ssh -fNL 5432"

# REMOTE PORT FORWARDING — expose a local service on a remote server
# Pattern: ssh -R REMOTE_PORT:LOCAL_HOST:LOCAL_PORT REMOTE_SERVER
# Connections to REMOTE_SERVER:REMOTE_PORT are forwarded to your LOCAL machine

# Expose your local dev server to a staging environment for webhook testing
ssh -R 8080:localhost:3000 staging.example.com
# On staging: curl http://localhost:8080 → your local port 3000

# DYNAMIC PORT FORWARDING — SOCKS5 proxy
# Pattern: ssh -D LOCAL_PORT JUMP_HOST
# Configure apps to use SOCKS5 at localhost:LOCAL_PORT

ssh -D 1080 bastion.example.com
# Configure browser proxy: SOCKS5 localhost:1080
# Now all browser traffic exits through the bastion`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "SSH tunnels are ideal for **one-off access**: connecting a GUI database client to production for a 30-minute debugging session. For permanent developer access, use a proper VPN — SSH tunnels require a running SSH process and break if the connection drops.",
              np: "SSH tunnel **one-off access** का लागि आदर्श छ: 30-minute debugging session का लागि production मा GUI database client connect गर्न। Permanent developer access का लागि proper VPN प्रयोग गर्नुहोस् — SSH tunnel ले running SSH process आवश्यक पर्छ र connection drop भएमा break हुन्छ।",
              jp: "SSH トンネルは**一時的なアクセス**に最適です：30 分のデバッグセッションのために GUI データベースクライアントを本番環境に接続する場合など。恒久的な開発者アクセスには適切な VPN を使いましょう。SSH トンネルは SSH プロセスが実行中である必要があり、接続が切れると壊れます。",
            },
            {
              en: "Add tunnel definitions to `~/.ssh/config` with `LocalForward` so you don't have to remember the ports: `LocalForward 5432 db.internal:5432` under your bastion Host block.",
              np: "`~/.ssh/config` मा `LocalForward` सहित tunnel definition थप्नुहोस् ताकि port याद गर्नुपर्दैन: तपाईंको bastion Host block अन्तर्गत `LocalForward 5432 db.internal:5432`।",
              jp: "`~/.ssh/config` に `LocalForward` でトンネル定義を追加して、ポートを覚えなくて済むようにしましょう。bastion の Host ブロックの下に `LocalForward 5432 db.internal:5432` を追加します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Cloud VPN patterns — AWS Client VPN and PrivateLink",
        np: "Cloud VPN pattern — AWS Client VPN र PrivateLink",
        jp: "クラウド VPN パターン — AWS Client VPN と PrivateLink",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Running your own VPN server works but adds operational burden (patching, certificates, scaling). Cloud providers offer managed alternatives. Understanding the difference between them prevents over-engineering.",
            np: "आफ्नै VPN server run गर्नु काम गर्छ तर operational burden थप्छ (patching, certificate, scaling)। Cloud provider ले managed alternative offer गर्छ। तिनीहरू बीचको फरक बुझ्नाले over-engineering रोक्छ।",
            jp: "自前の VPN サーバーを運用するのは可能ですが、運用負荷が増えます（パッチ適用・証明書・スケーリング）。クラウドプロバイダーはマネージドな代替手段を提供しています。それらの違いを理解することで過剰な設計を防げます。",
          },
        },
        {
          type: "code",
          title: {
            en: "AWS networking options for private access",
            np: "Private access का लागि AWS networking option",
            jp: "プライベートアクセスのための AWS ネットワークオプション",
          },
          code: `# Option 1: Bastion host (simplest, good for small teams)
# - Launch one EC2 in a public subnet
# - All private resources only allow SG from the bastion
# - Developers SSH to bastion, then to internal hosts
# Cost: ~$5/month for a t3.nano

# Option 2: AWS Client VPN (managed OpenVPN, developers connect from laptops)
# - Mutual TLS authentication (you issue certs to each developer)
# - Splits tunneling: only VPC traffic goes through VPN
# - ~$0.10/hour per active connection
aws ec2 create-client-vpn-endpoint \
  --client-cidr-block "10.100.0.0/22" \
  --server-certificate-arn arn:aws:acm:region:id:certificate/xxx \
  --authentication-options file://auth-options.json \
  --connection-log-options file://log-options.json

# Option 3: AWS Site-to-Site VPN (office network ↔ VPC)
# - IPsec tunnel between your on-prem router and an AWS VGW
# - All traffic flows encrypted; office and VPC are one network
# - ~$36/month per VPN connection

# Option 4: AWS PrivateLink (service-to-service, no VPN needed)
# - Expose a service in VPC A to VPC B without peering or internet
# - Provider creates an Endpoint Service; consumers create Interface Endpoints
# - Traffic never leaves the AWS backbone
# - Ideal for multi-tenant SaaS or sharing services across accounts

# Option 5: VPC Peering (two VPCs, same or different accounts)
# - Direct routing between VPCs (no encryption needed — already private)
# - Non-transitive: if A peers B and B peers C, A cannot reach C
# - Free within same region; data transfer charges cross-region

# Quick guide:
# Developers from laptops → Client VPN or bastion
# Office → AWS            → Site-to-Site VPN
# VPC A → VPC B (same org) → VPC Peering
# Service exposed to partners → PrivateLink`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Set up a WireGuard VPN on a cloud VM",
        np: "Hands-on: Cloud VM मा WireGuard VPN setup गर्नुहोस्",
        jp: "ハンズオン: クラウド VM で WireGuard VPN をセットアップする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "End-to-end WireGuard setup script",
            np: "End-to-end WireGuard setup script",
            jp: "エンドツーエンドの WireGuard セットアップスクリプト",
          },
          code: `#!/bin/bash
# Run on your Ubuntu 22.04 VPN server
set -euo pipefail

SERVER_IP="$(curl -sf https://ifconfig.me)"  # public IP of this server
VPN_SUBNET="10.8.0.0/24"
VPN_SERVER_IP="10.8.0.1"
WG_INTERFACE="wg0"
WG_PORT="51820"
SERVER_PRIVATE_KEY_FILE="/etc/wireguard/server_private.key"

echo "Installing WireGuard..."
apt-get update -qq && apt-get install -y wireguard

echo "Generating server keys..."
wg genkey | tee "$SERVER_PRIVATE_KEY_FILE" | wg pubkey > /etc/wireguard/server_public.key
chmod 600 "$SERVER_PRIVATE_KEY_FILE"

SERVER_PRIVKEY=$(cat "$SERVER_PRIVATE_KEY_FILE")
SERVER_PUBKEY=$(cat /etc/wireguard/server_public.key)

echo "Writing server config..."
cat > /etc/wireguard/\${WG_INTERFACE}.conf <<EOF
[Interface]
Address    = \${VPN_SERVER_IP}/24
PrivateKey = \${SERVER_PRIVKEY}
ListenPort = \${WG_PORT}

PostUp   = iptables -A FORWARD -i \${WG_INTERFACE} -j ACCEPT; iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE
PostDown = iptables -D FORWARD -i \${WG_INTERFACE} -j ACCEPT; iptables -t nat -D POSTROUTING -o eth0 -j MASQUERADE
EOF

echo "Enabling IP forwarding..."
sysctl -w net.ipv4.ip_forward=1
echo "net.ipv4.ip_forward=1" > /etc/sysctl.d/99-wg.conf

echo "Starting WireGuard..."
systemctl enable --now wg-quick@\${WG_INTERFACE}

echo ""
echo "=== Server ready ==="
echo "Public key (add to client config): \$SERVER_PUBKEY"
echo "Endpoint: \${SERVER_IP}:\${WG_PORT}"
echo ""
echo "To add a client: run wg-add-client.sh <name> <10.8.0.X>"`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "WireGuard vs OpenVPN — which should I choose?",
        np: "WireGuard बनाम OpenVPN — कुन रोज्ने?",
        jp: "WireGuard と OpenVPN — どちらを選ぶべきか？",
      },
      answer: {
        en: "Choose **WireGuard** for new infrastructure. It is faster (built into the kernel), simpler (a few lines of config vs hundreds), and uses modern cryptography. It reconnects instantly when network changes (great for roaming laptops). Its only limitation: no dynamic routing protocols, and it uses a fixed key model — certificate revocation requires removing a peer from the config. Choose **OpenVPN** when you need: (1) integration with an existing certificate authority (PKI), (2) TCP mode to get through firewalls that block UDP, (3) compliance requirements that mandate specific cipher suites, or (4) a team already trained on it.",
        np: "नयाँ infrastructure का लागि **WireGuard** रोज्नुहोस्। यो छिटो (kernel मा built-in), सरल (config का केही line बनाम सयौं), र modern cryptography प्रयोग गर्छ। Network बदल्दा तुरुन्त reconnect हुन्छ। यसको limitation: dynamic routing protocol छैन, र fixed key model छ। **OpenVPN** रोज्नुहोस् जब: (1) existing CA (PKI) सँग integration चाहिन्छ, (2) UDP block गर्ने firewall pass गर्न TCP mode चाहिन्छ, (3) specific cipher suite mandate गर्ने compliance requirement छ, वा (4) team पहिले नै यसमा trained छ।",
        jp: "新しいインフラには **WireGuard** を選びましょう。高速（カーネル組み込み）・シンプル（数行の設定 vs 数百行）・最新の暗号化を使用します。ネットワーク変更時に即座に再接続します（ローミングノートPCに最適）。制限：動的ルーティングプロトコルなし、固定キーモデル（証明書失効には設定からピアを削除が必要）。**OpenVPN** を選ぶのは：(1) 既存の認証局（PKI）との統合が必要、(2) UDP をブロックするファイアウォールを通るために TCP モードが必要、(3) 特定の暗号スイートを義務付けるコンプライアンス要件がある、(4) チームがすでに使い慣れている、のいずれかの場合。",
      },
      tag: { en: "vpn", np: "VPN", jp: "VPN" },
    },
    {
      question: {
        en: "My VPN connects but I can't reach internal servers — what is wrong?",
        np: "VPN connect हुन्छ तर internal server reach गर्न सक्दिनँ — के गलत छ?",
        jp: "VPN は接続されるが内部サーバーに到達できない — 何が間違っているか？",
      },
      answer: {
        en: "Work through this checklist: (1) **Routing** — `ip route` on the VPN client. Does a route for the internal subnet (e.g., `10.0.0.0/8`) exist pointing to the VPN interface? If not, `AllowedIPs` on the client peer config is wrong. (2) **IP forwarding** — `sysctl net.ipv4.ip_forward` on the VPN server must be `1`. (3) **NAT/masquerade** — the PostUp iptables masquerade rule must be present on the server. (4) **Target server firewall** — the internal server's firewall must allow traffic from the VPN subnet (e.g., `10.8.0.0/24`). (5) **DNS** — if you can reach by IP but not by hostname, the DNS configuration in the VPN client config is missing or wrong.",
        np: "यो checklist मार्फत काम गर्नुहोस्: (1) **Routing** — VPN client मा `ip route`। Internal subnet (जस्तै `10.0.0.0/8`) का लागि VPN interface तर्फ route छ? छैन भने client peer config मा `AllowedIPs` गलत छ। (2) **IP forwarding** — VPN server मा `sysctl net.ipv4.ip_forward` `1` हुनुपर्छ। (3) **NAT/masquerade** — server मा PostUp iptables masquerade rule present हुनुपर्छ। (4) **Target server firewall** — internal server को firewall ले VPN subnet बाट traffic allow गर्नुपर्छ। (5) **DNS** — IP ले reach गर्न सकिन्छ तर hostname ले सकिँदैन भने client config मा DNS configuration गलत छ।",
        jp: "このチェックリストで作業します：(1) **ルーティング** — VPN クライアントで `ip route`。内部サブネット（例：`10.0.0.0/8`）への VPN インターフェース向けルートがあるか？なければクライアントのピア設定の `AllowedIPs` が間違い。(2) **IP フォワーディング** — VPN サーバーの `sysctl net.ipv4.ip_forward` が `1` であること。(3) **NAT/マスカレード** — サーバーに PostUp の iptables マスカレードルールがあること。(4) **ターゲットサーバーのファイアウォール** — 内部サーバーのファイアウォールが VPN サブネットからのトラフィックを許可していること。(5) **DNS** — IP では到達できるがホスト名では届かない場合、クライアント設定の DNS が間違いか欠落。",
      },
      tag: { en: "vpn", np: "VPN", jp: "VPN" },
    },
    {
      question: {
        en: "What is split tunneling and when should I use it?",
        np: "Split tunneling के हो र कहिले प्रयोग गर्ने?",
        jp: "スプリットトンネリングとは何か、いつ使うべきか？",
      },
      answer: {
        en: "Full tunnel: ALL traffic (including your browser and Netflix) goes through the VPN. Split tunnel: only traffic destined for specific subnets (your private cloud network) goes through the VPN; everything else uses your normal internet connection. In WireGuard, this is controlled by `AllowedIPs` on the client: `0.0.0.0/0` = full tunnel; `10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16` = split tunnel (private RFC 1918 ranges only). Use split tunneling for developer VPNs — it reduces VPN server load, improves internet performance for users, and reduces how much traffic the VPN server operator can see.",
        np: "Full tunnel: सबै traffic (तपाईंको browser र Netflix सहित) VPN मार्फत जान्छ। Split tunnel: केवल specific subnet (तपाईंको private cloud network) का लागि traffic VPN मार्फत जान्छ; बाँकी सबैले सामान्य internet connection प्रयोग गर्छ। WireGuard मा, यो client मा `AllowedIPs` द्वारा नियन्त्रित हुन्छ: `0.0.0.0/0` = full tunnel; `10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16` = split tunnel। Developer VPN का लागि split tunneling प्रयोग गर्नुहोस्।",
        jp: "フルトンネル：すべてのトラフィック（ブラウザや Netflix を含む）が VPN を経由します。スプリットトンネル：特定のサブネット（プライベートクラウドネットワーク）向けのトラフィックだけが VPN を経由し、他はすべて通常のインターネット接続を使います。WireGuard では、クライアントの `AllowedIPs` で制御します：`0.0.0.0/0` = フルトンネル；`10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16` = スプリットトンネル。開発者 VPN にはスプリットトンネリングを使いましょう。",
      },
      tag: { en: "vpn", np: "VPN", jp: "VPN" },
    },
  ],
};
