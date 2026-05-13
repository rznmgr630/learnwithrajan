import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**iptables** is the classic Linux firewall — a userspace interface to the kernel's **Netfilter** packet-filtering framework. Rules are organised across three main **tables**: `filter` (the default table — controls whether packets are accepted, dropped, or rejected), `nat` (Network Address Translation — DNAT to rewrite destination IPs/ports, SNAT/MASQUERADE to rewrite source IPs for outbound traffic), and `mangle` (modify packet headers — adjust TTL, set ToS/DSCP bits for QoS). Each table contains a set of **chains** — the five built-in chains map to points in the packet journey: `INPUT` (packets destined for this host), `OUTPUT` (packets originated by this host), `FORWARD` (packets being routed *through* this host between interfaces), `PREROUTING` (before the routing decision — used for DNAT), and `POSTROUTING` (after the routing decision — used for SNAT/MASQUERADE). Rules inside each chain are evaluated **top-to-bottom** and the **first match wins** — so rule order is critical. A packet that matches no rule falls through to the chain's **default policy** (ACCEPT or DROP). Setting the INPUT policy to DROP and then explicitly allowing only what you need is the safest posture.",
    np: "**iptables** classic Linux firewall हो — kernel को **Netfilter** packet-filtering framework को userspace interface। Rule हरू तीनवटा main **table** मा organised छन्: `filter` (default table — packet accept, drop, वा reject गर्ने), `nat` (Network Address Translation — destination IP/port rewrite गर्न DNAT, outbound traffic को लागि source IP rewrite गर्न SNAT/MASQUERADE), र `mangle` (packet header modify गर्ने — TTL adjust, QoS को लागि ToS/DSCP bit set)। हरेक table मा **chain** हरू हुन्छन् — पाँचवटा built-in chain packet journey का बिन्दुहरूमा map हुन्छन्: `INPUT` (यो host को लागि packets), `OUTPUT` (यो host बाट originate भएका packets), `FORWARD` (interface बीच यो host *मार्फत* route भइरहेका packets), `PREROUTING` (routing decision अघि — DNAT को लागि प्रयोग), र `POSTROUTING` (routing decision पछि — SNAT/MASQUERADE को लागि प्रयोग)। हरेक chain भित्रका rule **माथिदेखि तल** evaluate हुन्छन् र **पहिलो match जित्छ** — त्यसैले rule order critical छ। कुनै rule match नभएको packet chain को **default policy** (ACCEPT वा DROP) मा जान्छ। INPUT policy DROP set गरेर आवश्यक कुरा मात्र explicitly allow गर्नु सबैभन्दा safe approach हो।",
    jp: "**iptables** は古典的な Linux ファイアウォールで、カーネルの **Netfilter** パケットフィルタリングフレームワークへのユーザースペースインターフェースです。ルールは 3 つの主要な**テーブル**に整理されます：`filter`（デフォルトテーブル — パケットの許可・破棄・拒否を制御）、`nat`（Network Address Translation — 宛先 IP/ポートを書き換える DNAT、アウトバウンドトラフィックのソース IP を書き換える SNAT/MASQUERADE）、`mangle`（パケットヘッダーを変更 — TTL 調整・QoS のための ToS/DSCP ビット設定）。各テーブルには**チェーン**のセットがあり、5 つの組み込みチェーンはパケットジャーニーのポイントにマップされます：`INPUT`（このホスト宛てのパケット）、`OUTPUT`（このホストが発信したパケット）、`FORWARD`（インターフェース間でこのホストを*経由して*ルーティングされるパケット）、`PREROUTING`（ルーティング決定前 — DNAT に使用）、`POSTROUTING`（ルーティング決定後 — SNAT/MASQUERADE に使用）。各チェーン内のルールは**上から下に**評価され、**最初のマッチが勝ちます** — ルールの順序が重要です。どのルールにもマッチしないパケットはチェーンの**デフォルトポリシー**（ACCEPT または DROP）に従います。INPUT ポリシーを DROP に設定して必要なものだけを明示的に許可するのが最も安全な姿勢です。",
  } as const,
  o2: {
    en: "**Cloud firewalls** are the managed equivalents of iptables in AWS and other cloud providers. **AWS Security Groups** act as instance-level virtual firewalls attached to each ENI (Elastic Network Interface) — they are **stateful**, meaning if you allow inbound TCP port 80 the return traffic is automatically allowed without a separate outbound rule. **Network ACLs (NACLs)** operate at the subnet level — every packet entering or leaving a subnet is evaluated against the NACL. NACLs are **stateless**: you must explicitly allow both the inbound request *and* the outbound ephemeral ports (1024–65535) for responses, otherwise responses are silently dropped. NACLs evaluate rules in **numbered order** (lowest first) and stop at the first match — unlike Security Groups where all rules are evaluated and the most permissive wins. On the Linux side, **nftables** is the modern successor to iptables — it uses the same Netfilter kernel hooks but with a unified, cleaner syntax and better performance (no separate tables for IPv4/IPv6). **ufw** (Uncomplicated Firewall) wraps iptables with a simplified interface suited for single-server use cases — `ufw allow 22/tcp` is far less error-prone than crafting raw iptables chains.",
    np: "**Cloud firewall** हरू AWS र अन्य cloud provider मा iptables का managed equivalent हुन्। **AWS Security Group** हरू प्रत्येक ENI (Elastic Network Interface) मा attached instance-level virtual firewall को रूपमा काम गर्छन् — ती **stateful** हुन्छन्, अर्थात् inbound TCP port 80 allow गर्यो भने return traffic automatically allow हुन्छ, छुट्टै outbound rule चाहिंदैन। **Network ACL (NACL)** हरू subnet level मा operate गर्छन् — subnet छिर्ने वा बाहिर जाने हरेक packet NACL विरुद्ध evaluate हुन्छ। NACL हरू **stateless** हुन्छन्: inbound request *र* response को लागि outbound ephemeral port (1024–65535) दुवै explicitly allow गर्नुपर्छ, नत्र response silently drop हुन्छ। NACL ले **numbered order** मा (lowest first) rule evaluate गर्छ र पहिलो match मा रोकिन्छ — Security Group भन्दा फरक जहाँ सबै rule evaluate हुन्छन् र most permissive जित्छ। Linux side मा, **nftables** iptables को modern successor हो — same Netfilter kernel hook प्रयोग गर्छ तर unified, cleaner syntax र better performance सहित (IPv4/IPv6 को लागि छुट्टाछुट्टै table छैन)। **ufw** (Uncomplicated Firewall) ले iptables लाई single-server use case को लागि उपयुक्त simplified interface सँग wrap गर्छ — `ufw allow 22/tcp` raw iptables chain बनाउनुभन्दा कम error-prone छ।",
    jp: "**クラウドファイアウォール**は AWS などのクラウドプロバイダーにおける iptables の管理版です。**AWS セキュリティグループ**は各 ENI（Elastic Network Interface）に接続されたインスタンスレベルの仮想ファイアウォールとして機能します — **ステートフル**であり、インバウンド TCP ポート 80 を許可すると、別のアウトバウンドルールなしに戻りのトラフィックが自動的に許可されます。**ネットワーク ACL（NACL）**はサブネットレベルで動作します — サブネットに出入りするすべてのパケットが NACL に対して評価されます。NACL は**ステートレス**です：インバウンドリクエスト*と*レスポンス用のアウトバウンドエフェメラルポート（1024–65535）の両方を明示的に許可する必要があり、そうしないとレスポンスが無音でドロップされます。NACL はルールを**番号順**（最小から）に評価し、最初のマッチで停止します — すべてのルールが評価され最も許可的なものが勝つセキュリティグループとは異なります。Linux 側では、**nftables** が iptables の現代的な後継です — 同じ Netfilter カーネルフックを使用しますが、統一されたクリーンな構文とより良いパフォーマンスを備えています（IPv4/IPv6 用の別々のテーブルは不要）。**ufw**（Uncomplicated Firewall）は iptables を単一サーバーのユースケース向けの簡略化されたインターフェースでラップします — `ufw allow 22/tcp` は生の iptables チェーンを作成するよりはるかにエラーが少ないです。",
  } as const,
};

export const DEVOPS_DAY_68_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "iptables — tables, chains & rule anatomy",
        np: "iptables — table, chain र rule anatomy",
        jp: "iptables — テーブル・チェーン・ルールの構造",
      },
      blocks: [
        { type: "diagram", id: "devops-iptables" },
        {
          type: "table",
          caption: {
            en: "Cloud firewall comparison — AWS Security Groups vs NACLs",
            np: "Cloud firewall comparison — AWS Security Group vs NACL",
            jp: "クラウドファイアウォール比較 — AWS セキュリティグループ vs NACL",
          },
          headers: [
            { en: "Feature", np: "Feature", jp: "機能" },
            { en: "Security Group", np: "Security Group", jp: "セキュリティグループ" },
            { en: "NACL", np: "NACL", jp: "NACL" },
            { en: "Impact", np: "Impact", jp: "影響" },
          ],
          rows: [
            [
              { en: "State", np: "State", jp: "状態" },
              { en: "Stateful (tracks connections)", np: "Stateful (connection track गर्छ)", jp: "ステートフル（接続を追跡）" },
              { en: "Stateless (each packet evaluated independently)", np: "Stateless (हरेक packet independently evaluate हुन्छ)", jp: "ステートレス（各パケットを独立して評価）" },
              { en: "SG: only need inbound rule for HTTP, response allowed automatically; NACL: must allow both inbound port 80 AND outbound ephemeral ports 1024-65535", np: "SG: HTTP को लागि inbound rule मात्र चाहिन्छ, response automatically allowed; NACL: inbound port 80 र outbound ephemeral port 1024-65535 दुवै allow गर्नुपर्छ", jp: "SG: HTTP のインバウンドルールのみ必要、レスポンスは自動許可；NACL: インバウンドポート 80 とアウトバウンドエフェメラルポート 1024-65535 の両方を許可する必要がある" },
            ],
            [
              { en: "Level", np: "Level", jp: "レベル" },
              { en: "Instance (ENI) level", np: "Instance (ENI) level", jp: "インスタンス（ENI）レベル" },
              { en: "Subnet level", np: "Subnet level", jp: "サブネットレベル" },
              { en: "SG applies per instance; NACL applies to all instances in subnet", np: "SG प्रति instance apply हुन्छ; NACL subnet का सबै instance मा apply हुन्छ", jp: "SG はインスタンスごとに適用；NACL はサブネット内のすべてのインスタンスに適用" },
            ],
            [
              { en: "Default behavior", np: "Default behavior", jp: "デフォルト動作" },
              { en: "Deny all inbound, allow all outbound", np: "सबै inbound deny, सबै outbound allow", jp: "すべてのインバウンドを拒否、すべてのアウトバウンドを許可" },
              { en: "Allow all inbound and outbound", np: "सबै inbound र outbound allow", jp: "すべてのインバウンドとアウトバウンドを許可" },
              { en: "SG: must explicitly open ports; NACL: open by default", np: "SG: port explicitly open गर्नुपर्छ; NACL: default मा open", jp: "SG: ポートを明示的に開く必要がある；NACL: デフォルトで開いている" },
            ],
            [
              { en: "Rule evaluation", np: "Rule evaluation", jp: "ルール評価" },
              { en: "All rules evaluated, most permissive wins", np: "सबै rule evaluate हुन्छन्, most permissive जित्छ", jp: "すべてのルールを評価、最も許可的なものが勝つ" },
              { en: "Rules evaluated in order (numbered), first match wins", np: "Rule क्रममा (numbered) evaluate हुन्छन्, पहिलो match जित्छ", jp: "ルールは順番（番号順）に評価され、最初のマッチが勝つ" },
              { en: "NACL: rule order matters — put DENY rules before ALLOW with lower numbers", np: "NACL: rule order matter गर्छ — DENY rule लाई ALLOW भन्दा lower number मा राख्नुहोस्", jp: "NACL: ルールの順序が重要 — DENY ルールは小さい番号で ALLOW より前に置く" },
            ],
            [
              { en: "Use case", np: "Use case", jp: "ユースケース" },
              { en: "Primary security layer for instances", np: "Instance को लागि primary security layer", jp: "インスタンスのプライマリセキュリティ層" },
              { en: "Defense in depth — subnet-level blocking of known bad IPs/ranges", np: "Defense in depth — known bad IP/range को subnet-level blocking", jp: "多層防御 — 既知の悪意ある IP/範囲のサブネットレベルブロック" },
              { en: "Use both together: SG for per-service rules, NACL for IP-based blocking", np: "दुवै सँगै प्रयोग गर्नुहोस्: per-service rule को लागि SG, IP-based blocking को लागि NACL", jp: "両方を合わせて使用：サービスごとのルールに SG、IP ベースのブロックに NACL" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "iptables rules — common patterns & UFW",
        np: "iptables rules — common pattern र UFW",
        jp: "iptables ルール — 一般的なパターンと UFW",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "iptables rule management, NAT, cloud firewall patterns & UFW",
            np: "iptables rule management, NAT, cloud firewall pattern र UFW",
            jp: "iptables ルール管理・NAT・クラウドファイアウォールパターン・UFW",
          },
          code: `# ── View current rules ───────────────────────────────────────────
iptables -L -v -n --line-numbers          # filter table (default)
iptables -t nat -L -v -n                  # nat table

# ── Common INPUT chain rules ─────────────────────────────────────
# 1. Set default policy to DROP (deny everything not explicitly allowed)
iptables -P INPUT DROP
iptables -P FORWARD DROP
iptables -P OUTPUT ACCEPT

# 2. Allow loopback (localhost traffic — required for many services)
iptables -A INPUT -i lo -j ACCEPT

# 3. Allow established/related connections (stateful — responses allowed back)
iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# 4. Allow SSH (port 22) — do this BEFORE setting DROP policy!
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# 5. Allow HTTP and HTTPS
iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -A INPUT -p tcp --dport 443 -j ACCEPT

# At this point, the default DROP policy blocks everything else.

# ── Block a specific IP ──────────────────────────────────────────
# -I inserts at the TOP of the chain (evaluated before ACCEPT rules)
iptables -I INPUT -s 1.2.3.4 -j DROP

# ── Rate-limit SSH (anti-brute-force with 'recent' module) ────────
# Mark new SSH connection attempts with the IP in the 'recent' list
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
# Drop if the same IP has made 4+ attempts in 60 seconds
iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP

# ── NAT — port forwarding (PREROUTING DNAT) ──────────────────────
# Redirect incoming port 80 to backend on 10.0.0.5:8080
iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 10.0.0.5:8080

# Masquerade outbound traffic (SNAT for dynamic IPs — e.g. internet sharing)
iptables -t nat -A POSTROUTING -j MASQUERADE

# Enable IP forwarding in the kernel (required for routing/NAT)
echo 1 > /proc/sys/net/ipv4/ip_forward

# ── Persist rules across reboots ─────────────────────────────────
iptables-save > /etc/iptables/rules.v4        # save current rules
iptables-restore < /etc/iptables/rules.v4     # restore on boot
# On Debian/Ubuntu: install iptables-persistent to auto-restore on boot

# ── UFW (Uncomplicated Firewall) — simplified iptables frontend ──
ufw enable                                    # enable firewall (keeps existing SSH sessions)
ufw allow 22/tcp                              # allow SSH
ufw allow from 10.0.0.0/8                     # allow entire private subnet
ufw deny 23                                   # deny Telnet
ufw status verbose                            # show all rules with status
ufw delete allow 80                           # remove a rule

# ── nftables — modern replacement for iptables ───────────────────
# Same Netfilter kernel hooks, unified IPv4/IPv6, cleaner syntax
nft add table inet filter
nft add chain inet filter input \\
  { type filter hook input priority 0 \\; policy drop \\; }
nft add rule inet filter input iifname "lo" accept
nft add rule inet filter input ct state established,related accept
nft add rule inet filter input tcp dport 22 accept
nft add rule inet filter input tcp dport { 80, 443 } accept
nft list ruleset                              # view all nftables rules`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Start with `iptables -L` on a fresh system. Set the INPUT policy to DROP (`iptables -P INPUT DROP`). Add rules to allow: loopback traffic (`-i lo`), established/related connections (`-m state --state ESTABLISHED,RELATED`), SSH port 22. Verify you can still SSH in. Then add rules to allow HTTP (80) and HTTPS (443). Confirm a Python server on port 80 is reachable (`python3 -m http.server 80`). Try connecting to port 8080 — it should be blocked. List rules with line numbers (`iptables -L --line-numbers`) and delete a specific rule by number (`iptables -D INPUT <number>`).",
              np: "Fresh system मा `iptables -L` बाट सुरु गर्नुहोस्। INPUT policy DROP मा set गर्नुहोस् (`iptables -P INPUT DROP`)। Allow गर्न rule add गर्नुहोस्: loopback traffic (`-i lo`), established/related connection (`-m state --state ESTABLISHED,RELATED`), SSH port 22। तपाईं अझै SSH in गर्न सक्नुहुन्छ verify गर्नुहोस्। त्यसपछि HTTP (80) र HTTPS (443) allow गर्न rule add गर्नुहोस्। Port 80 मा Python server reachable छ confirm गर्नुहोस् (`python3 -m http.server 80`)। Port 8080 मा connect गर्ने प्रयास गर्नुहोस् — blocked हुनुपर्छ। Line number सहित rule list गर्नुहोस् (`iptables -L --line-numbers`) र number by specific rule delete गर्नुहोस् (`iptables -D INPUT <number>`)।",
              jp: "新しいシステムで `iptables -L` から始める。INPUT ポリシーを DROP に設定する（`iptables -P INPUT DROP`）。許可するルールを追加する：ループバックトラフィック（`-i lo`）・確立済み/関連接続（`-m state --state ESTABLISHED,RELATED`）・SSH ポート 22。まだ SSH できることを確認する。次に HTTP (80) と HTTPS (443) を許可するルールを追加する。ポート 80 の Python サーバーが到達可能であることを確認する（`python3 -m http.server 80`）。ポート 8080 への接続を試みる — ブロックされるはず。行番号付きでルールを一覧表示し（`iptables -L --line-numbers`）、番号でルールを削除する（`iptables -D INPUT <number>`）。",
            },
            {
              en: "Implement SSH brute-force protection using the `recent` module. Use the rate-limit iptables commands to block IPs that attempt more than 3 SSH connections in 60 seconds. Simulate brute-force with `for i in {1..5}; do ssh -o ConnectTimeout=2 nonexistent@localhost; done`. After the 4th attempt, new connections should be dropped. Check `iptables -L INPUT -v -n` to see the hit counter increment. Reset with `iptables -D` and observe connections work again.",
              np: "`recent` module प्रयोग गरेर SSH brute-force protection implement गर्नुहोस्। 60 second मा 3 भन्दा बढी SSH connection attempt गर्ने IP block गर्न rate-limit iptables command प्रयोग गर्नुहोस्। `for i in {1..5}; do ssh -o ConnectTimeout=2 nonexistent@localhost; done` सँग brute-force simulate गर्नुहोस्। 4th attempt पछि new connection drop हुनुपर्छ। Hit counter increment देख्न `iptables -L INPUT -v -n` check गर्नुहोस्। `iptables -D` सँग reset गर्नुहोस् र connection फेरि काम गर्ने observe गर्नुहोस्।",
              jp: "`recent` モジュールを使って SSH ブルートフォース防御を実装する。60 秒間に 3 回以上 SSH 接続を試みる IP をブロックするレートリミット iptables コマンドを使用する。`for i in {1..5}; do ssh -o ConnectTimeout=2 nonexistent@localhost; done` でブルートフォースをシミュレートする。4 回目の試行後、新しい接続はドロップされるはず。`iptables -L INPUT -v -n` でヒットカウンターが増加するのを確認する。`iptables -D` でリセットして接続が再び機能することを確認する。",
            },
            {
              en: "Set up port forwarding using iptables NAT. Start a Python server on port 8080 (`python3 -m http.server 8080`). Use PREROUTING DNAT to forward port 80 to 8080 (`iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 127.0.0.1:8080`). Also enable IP forwarding (`echo 1 > /proc/sys/net/ipv4/ip_forward`). Test with `curl http://localhost:80` — it should return the same content as port 8080. This simulates how production servers redirect traffic from privileged ports to unprivileged application ports.",
              np: "iptables NAT प्रयोग गरेर port forwarding set up गर्नुहोस्। Port 8080 मा Python server start गर्नुहोस् (`python3 -m http.server 8080`)। Port 80 लाई 8080 मा forward गर्न PREROUTING DNAT प्रयोग गर्नुहोस् (`iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 127.0.0.1:8080`)। IP forwarding पनि enable गर्नुहोस् (`echo 1 > /proc/sys/net/ipv4/ip_forward`)। `curl http://localhost:80` सँग test गर्नुहोस् — port 8080 जस्तै content return गर्नुपर्छ। यसले production server ले privileged port बाट unprivileged application port मा traffic redirect कसरी गर्छ simulate गर्छ।",
              jp: "iptables NAT を使ってポートフォワーディングを設定する。ポート 8080 で Python サーバーを起動する（`python3 -m http.server 8080`）。PREROUTING DNAT を使ってポート 80 を 8080 に転送する（`iptables -t nat -A PREROUTING -p tcp --dport 80 -j DNAT --to-destination 127.0.0.1:8080`）。IP フォワーディングも有効にする（`echo 1 > /proc/sys/net/ipv4/ip_forward`）。`curl http://localhost:80` でテストする — ポート 8080 と同じコンテンツが返るはず。これは本番サーバーが特権ポートから非特権アプリケーションポートにトラフィックをリダイレクトする方法をシミュレートします。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between stateful and stateless firewalls?",
        np: "Stateful र stateless firewall बीचको फरक के हो?",
        jp: "ステートフルとステートレスファイアウォールの違いは何か？",
      },
      answer: {
        en: "A **stateful firewall** tracks the state of network connections. When you allow an inbound connection, the firewall automatically tracks the response traffic and allows it back without requiring an explicit rule. TCP connections go through states: SYN, SYN-ACK, ESTABLISHED, FIN-WAIT, CLOSED. iptables with `-m state --state ESTABLISHED,RELATED` is stateful — you write one inbound rule, and responses flow automatically. AWS Security Groups are stateful. A **stateless firewall** evaluates every single packet in isolation with no memory of prior packets. If you allow inbound TCP port 80, you must also explicitly allow outbound TCP ports 1024-65535 (ephemeral ports) or responses are blocked. NACLs are stateless — this is a common source of bugs where inbound rules work but responses are silently dropped. The tradeoff: stateful firewalls are easier to configure correctly but require more memory (connection tracking table). Stateless firewalls are simpler and faster but need careful bidirectional rules. For most DevOps work: use stateful (Security Groups, iptables with state tracking). Use stateless (NACLs) only for subnet-level IP blocking as a defense-in-depth layer.",
        np: "**Stateful firewall** ले network connection को state track गर्छ। Inbound connection allow गर्दा, firewall ले response traffic automatically track गर्छ र explicit rule बिना नै allow गर्छ। TCP connection हरू state बाट जान्छन्: SYN, SYN-ACK, ESTABLISHED, FIN-WAIT, CLOSED। `-m state --state ESTABLISHED,RELATED` सहित iptables stateful हो — एउटा inbound rule लेख्नुहोस्, response automatically flow हुन्छ। AWS Security Group stateful हो। **Stateless firewall** ले prior packet को कुनै memory बिना हरेक packet individually evaluate गर्छ। Inbound TCP port 80 allow गर्यो भने, response block नहोस् भनेर outbound TCP port 1024-65535 (ephemeral port) पनि explicitly allow गर्नुपर्छ। NACL stateless हो — यो bug को common source हो जहाँ inbound rule काम गर्छ तर response silently drop हुन्छ। Tradeoff: stateful firewall configure गर्न सजिलो तर बढी memory चाहिन्छ (connection tracking table)। Stateless firewall सरल र तेज छ तर careful bidirectional rule चाहिन्छ। धेरैजसो DevOps काममा: stateful (Security Group, state tracking सहित iptables) प्रयोग गर्नुहोस्। Stateless (NACL) defense-in-depth layer को रूपमा subnet-level IP blocking को लागि मात्र प्रयोग गर्नुहोस्।",
        jp: "**ステートフルファイアウォール**はネットワーク接続の状態を追跡します。インバウンド接続を許可すると、ファイアウォールは自動的にレスポンストラフィックを追跡し、明示的なルールなしに許可します。TCP 接続は状態を経由します：SYN・SYN-ACK・ESTABLISHED・FIN-WAIT・CLOSED。`-m state --state ESTABLISHED,RELATED` での iptables はステートフルです — 1 つのインバウンドルールを書くだけでレスポンスは自動的に流れます。AWS セキュリティグループはステートフルです。**ステートレスファイアウォール**は以前のパケットの記憶なしに各パケットを独立して評価します。インバウンド TCP ポート 80 を許可した場合、レスポンスがブロックされないようにアウトバウンド TCP ポート 1024-65535（エフェメラルポート）も明示的に許可する必要があります。NACL はステートレスです — これはインバウンドルールが機能してもレスポンスが無音でドロップされるバグの一般的な原因です。トレードオフ：ステートフルファイアウォールは正しく設定しやすいがより多くのメモリが必要（接続追跡テーブル）。ステートレスファイアウォールはシンプルで高速だが慎重な双方向ルールが必要。ほとんどの DevOps 作業では：ステートフル（セキュリティグループ・状態追跡付き iptables）を使用する。ステートレス（NACL）は多層防御層としてサブネットレベルの IP ブロックにのみ使用する。",
      },
      tag: {
        en: "stateful vs stateless",
        np: "stateful vs stateless",
        jp: "ステートフル vs ステートレス",
      },
    },
    {
      question: {
        en: "How do you safely change firewall rules on a remote server without locking yourself out?",
        np: "Remote server मा आफूलाई lock out नगरी firewall rule कसरी safely change गर्ने?",
        jp: "リモートサーバーでロックアウトせずにファイアウォールルールを安全に変更する方法は？",
      },
      answer: {
        en: "Changing iptables rules on a remote server is dangerous — a wrong rule can permanently lock you out of SSH. Four safety practices: (1) **Timed rollback**: use `at` to schedule a rule flush as a safety net: `echo \"iptables -F\" | at now + 5 minutes`. Apply your rule changes, verify they work, then cancel the scheduled flush with `atrm`. If you lock yourself out, the flush executes automatically. (2) **Test rules first**: add a rule temporarily without making it persistent (don't run `iptables-save`). If you lose connectivity, rebooting restores the saved rules. (3) **Console access**: cloud providers have console access (AWS EC2 Systems Manager Session Manager, GCP Serial Console) that bypasses SSH entirely — keep this as a backup. (4) **UFW safety order**: always run `ufw allow 22/tcp` BEFORE `ufw enable`. UFW won't block the existing SSH session but will block new connections — so set the SSH allow rule first.",
        np: "Remote server मा iptables rule change गर्नु dangerous छ — गलत rule ले SSH बाट permanently lock out गर्न सक्छ। चारवटा safety practice: (1) **Timed rollback**: safety net को रूपमा `at` प्रयोग गरेर rule flush schedule गर्नुहोस्: `echo \"iptables -F\" | at now + 5 minutes`। Rule change apply गर्नुहोस्, काम गर्छ verify गर्नुहोस्, त्यसपछि `atrm` सँग scheduled flush cancel गर्नुहोस्। Lock out भयो भने flush automatically execute हुन्छ। (2) **पहिले rule test गर्नुहोस्**: persistent नबनाई temporarily rule add गर्नुहोस् (`iptables-save` नचलाउनुहोस्)। Connectivity गुमायो भने, reboot ले saved rule restore गर्छ। (3) **Console access**: cloud provider हरूसँग console access छ (AWS EC2 Systems Manager Session Manager, GCP Serial Console) जसले SSH completely bypass गर्छ — यसलाई backup को रूपमा राख्नुहोस्। (4) **UFW safety order**: `ufw enable` अघि सधैँ `ufw allow 22/tcp` run गर्नुहोस्। UFW ले existing SSH session block गर्दैन तर new connection block गर्छ — त्यसैले SSH allow rule पहिले set गर्नुहोस्।",
        jp: "リモートサーバーで iptables ルールを変更するのは危険です — 間違ったルールで SSH から永久にロックアウトされる可能性があります。4 つの安全対策：(1) **タイムドロールバック**：`at` を使ってルールのフラッシュを安全策としてスケジュールする：`echo \"iptables -F\" | at now + 5 minutes`。ルール変更を適用し、動作確認後、`atrm` でスケジュールされたフラッシュをキャンセルする。ロックアウトされた場合、フラッシュが自動的に実行される。(2) **ルールを最初にテスト**：永続化せずに一時的にルールを追加する（`iptables-save` は実行しない）。接続を失った場合、再起動で保存されたルールが復元される。(3) **コンソールアクセス**：クラウドプロバイダーは SSH を完全にバイパスするコンソールアクセス（AWS EC2 Systems Manager Session Manager・GCP Serial Console）を提供しています — これをバックアップとして保持する。(4) **UFW の安全な順序**：`ufw enable` の前に必ず `ufw allow 22/tcp` を実行する。UFW は既存の SSH セッションをブロックしないが新しい接続はブロックします — まず SSH 許可ルールを設定する。",
      },
      tag: {
        en: "safe firewall changes",
        np: "safe firewall changes",
        jp: "安全なファイアウォール変更",
      },
    },
  ],
};
