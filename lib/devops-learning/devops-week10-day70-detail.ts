import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**High availability (HA)** means designing systems to remain operational despite component failures. The goal is not to prevent failures — hardware dies, software crashes, networks partition — but to ensure failures don't become outages. Two key metrics define your HA targets: **availability** (uptime percentage — 99.9% allows 8.76 hours of downtime per year, 99.99% allows only 52.6 minutes, 99.999% allows just 5.26 minutes) and **RTO / RPO**. **RTO (Recovery Time Objective)** is the maximum acceptable downtime after a failure — how long until service is restored. **RPO (Recovery Point Objective)** is the maximum acceptable data loss measured in time — how far back you can roll back. The core HA principle is eliminating **single points of failure (SPOF)**. Every component that can fail — server, load balancer, database, network switch, power supply — needs redundancy. Two main patterns: **active-passive** (primary handles all traffic; a standby replica takes over on failure — simpler to implement, but the standby wastes resources while idle and there is a brief failover delay) and **active-active** (all nodes handle traffic simultaneously — better resource utilization and no failover delay, but requires careful distributed state management so all nodes see consistent data).",
    np: "**High availability (HA)** को अर्थ हो component failure हुँदा पनि system operational रहने गरी design गर्नु। Goal failure prevent गर्नु होइन — hardware मर्छ, software crash हुन्छ, network partition हुन्छ — तर failures outage नबनोस् भन्ने ensure गर्नु हो। दुईवटा key metric ले तपाईंको HA target define गर्छ: **availability** (uptime percentage — 99.9% ले प्रति वर्ष 8.76 घण्टा downtime allow गर्छ, 99.99% ले मात्र 52.6 मिनेट, 99.999% ले मात्र 5.26 मिनेट) र **RTO / RPO**। **RTO (Recovery Time Objective)** failure पछिको maximum acceptable downtime हो — service restore हुन कति समय लाग्छ। **RPO (Recovery Point Objective)** time मा मापिएको maximum acceptable data loss हो — कति पछाडि roll back गर्न सकिन्छ। Core HA principle हो **single point of failure (SPOF)** eliminate गर्नु। Fail हुन सक्ने हरेक component — server, load balancer, database, network switch, power supply — लाई redundancy चाहिन्छ। दुईवटा main pattern: **active-passive** (primary ले सबै traffic handle गर्छ; failure मा standby replica ले take over गर्छ — implement गर्न simple, तर standby idle हुँदा resources waste गर्छ र brief failover delay हुन्छ) र **active-active** (सबै node ले एकसाथ traffic handle गर्छ — better resource utilization र failover delay छैन, तर सबै node ले consistent data देखोस् भनेर careful distributed state management चाहिन्छ)।",
    jp: "**高可用性（HA）**とは、コンポーネントの障害が発生してもシステムが稼働し続けるように設計することです。目標は障害を防ぐことではありません — ハードウェアは壊れ、ソフトウェアはクラッシュし、ネットワークは分断されます — しかし障害がサービス停止にならないように確保することです。2 つの主要なメトリクスが HA ターゲットを定義します：**可用性**（稼働率 — 99.9% は年間 8.76 時間のダウンタイムを許可、99.99% はわずか 52.6 分、99.999% はわずか 5.26 分）と **RTO / RPO**。**RTO（目標復旧時間）**は障害後の最大許容ダウンタイム — サービスが復旧するまでの時間。**RPO（目標復旧時点）**は時間で測定された最大許容データ損失 — どこまでロールバックできるか。コア HA の原則は**単一障害点（SPOF）**を排除することです。障害が起きうるすべてのコンポーネント — サーバー・ロードバランサー・データベース・ネットワークスイッチ・電源 — には冗長性が必要です。2 つの主なパターン：**アクティブ・パッシブ**（プライマリがすべてのトラフィックを処理；障害時にスタンバイレプリカが引き継ぐ — 実装は簡単だがスタンバイはアイドル中にリソースを浪費し短いフェイルオーバー遅延がある）と**アクティブ・アクティブ**（すべてのノードが同時にトラフィックを処理 — リソース利用率が良くフェイルオーバー遅延もないが、すべてのノードが一貫したデータを見るように慎重な分散状態管理が必要）。",
  } as const,
  o2: {
    en: "**Keepalived** and **VRRP (Virtual Router Redundancy Protocol)** are the most common Linux HA mechanism for floating IPs. Two servers share a **virtual IP (VIP)**. The primary server holds the VIP and responds to all traffic on it; if the primary fails, the backup detects this via heartbeat (VRRP advertisements sent every second) and claims the VIP within seconds. Applications connect to the VIP and are completely unaware of which physical server is currently active — failover is transparent. The **split-brain problem** is the most dangerous failure mode: if the heartbeat link itself fails (network partition between the two nodes), both servers believe they are the primary and both claim the VIP simultaneously, causing ARP conflicts, duplicate traffic, and — for databases — divergent writes that corrupt your data. Prevention strategies: **quorum** (require N/2+1 votes before taking primary role — a 3-node cluster prevents split-brain because neither side of a partition alone has majority), **fencing / STONITH (Shoot The Other Node In The Head)** (when a node suspects split-brain, it uses an out-of-band channel such as IPMI or a cloud API to forcibly power off the suspected failed node before claiming primary — ensures only one node is ever active), and **witness / tiebreaker nodes** (a lightweight third node that only votes but never takes primary role — breaks ties in 2-node clusters). For **database HA**, the pattern is primary-replica replication with automatic failover: **Patroni** (PostgreSQL) uses etcd, Consul, or ZooKeeper as a distributed config store (DCS) for leader election and auto-promotes a replica to primary when the leader disappears; **MHA / ProxySQL** serve the same role for MySQL.",
    np: "**Keepalived** र **VRRP (Virtual Router Redundancy Protocol)** floating IP को लागि सबैभन्दा common Linux HA mechanism हो। दुईवटा server ले **virtual IP (VIP)** share गर्छन्। Primary server ले VIP hold गर्छ र त्यसमा सबै traffic respond गर्छ; primary fail भयो भने backup ले heartbeat (हरेक second VRRP advertisement) मार्फत यो detect गर्छ र seconds भित्रमा VIP claim गर्छ। Application ले VIP मा connect गर्छ र कुन physical server हाल active छ भन्ने बारे सम्पूर्णतया अनजान हुन्छ — failover transparent हुन्छ। **Split-brain problem** सबैभन्दा dangerous failure mode हो: heartbeat link नै fail भयो भने (दुई node बीच network partition), दुवै server आफूलाई primary ठान्छन् र एकसाथ VIP claim गर्छन्, ARP conflict, duplicate traffic, र — database को लागि — data corrupt गर्ने divergent write हुन्छ। Prevention strategy: **quorum** (primary role लिनुअघि N/2+1 votes require गर्नु — 3-node cluster ले split-brain prevent गर्छ किनभने partition को एक पनि side ले एक्लै majority हुँदैन), **fencing / STONITH (Shoot The Other Node In The Head)** (node ले split-brain शंका गर्दा, primary claim गर्नुअघि suspected failed node लाई forcibly power off गर्न IPMI वा cloud API जस्तो out-of-band channel प्रयोग गर्छ — एउटा मात्र node सधैँ active हुन्छ ensure गर्छ), र **witness / tiebreaker node** (vote मात्र गर्ने तर primary role नलिने lightweight third node — 2-node cluster मा tie break गर्छ)। **Database HA** को लागि pattern हो automatic failover सहित primary-replica replication: **Patroni** (PostgreSQL) ले leader election को लागि etcd, Consul, वा ZooKeeper लाई distributed config store (DCS) को रूपमा प्रयोग गर्छ र leader disappear हुँदा replica लाई primary मा auto-promote गर्छ; **MHA / ProxySQL** ले MySQL को लागि same role serve गर्छ।",
    jp: "**Keepalived** と **VRRP（仮想ルーター冗長化プロトコル）**は、フローティング IP のための最も一般的な Linux HA メカニズムです。2 台のサーバーが**仮想 IP（VIP）**を共有します。プライマリサーバーが VIP を保持しそのトラフィックすべてに応答します；プライマリが障害を起こすと、バックアップはハートビート（毎秒送信される VRRP アドバタイズメント）でこれを検出し、数秒以内に VIP を引き継ぎます。アプリケーションは VIP に接続し、どの物理サーバーが現在アクティブかを完全に意識しません — フェイルオーバーは透過的です。**スプリットブレイン問題**は最も危険な障害モードです：ハートビートリンク自体が障害を起こすと（2 つのノード間のネットワーク分断）、両方のサーバーが自分がプライマリだと思い込み同時に VIP を主張し、ARP の競合・重複トラフィック・そしてデータベースでは divergent な書き込みによるデータ破損が発生します。防止策：**クォーラム**（プライマリロールを取る前に N/2+1 票を要求 — 3 ノードクラスターはスプリットブレインを防ぐ、なぜなら分断のどちら側も単独では過半数を持てないため）、**フェンシング / STONITH（Shoot The Other Node In The Head）**（ノードがスプリットブレインを疑うとき、プライマリを主張する前に IPMI やクラウド API などのアウトオブバンドチャネルを使用して疑われる障害ノードを強制的に電源オフ — 常に 1 つのノードだけがアクティブであることを保証）、および**ウィットネス / タイブレーカーノード**（投票するだけでプライマリロールを取らない軽量な第三ノード — 2 ノードクラスターでの同点を解消）。**データベース HA** のパターンは自動フェイルオーバーを伴うプライマリ・レプリカレプリケーション：**Patroni**（PostgreSQL）はリーダー選出のために etcd・Consul・ZooKeeper を分散構成ストア（DCS）として使用し、リーダーが消えるとレプリカをプライマリに自動昇格させます；**MHA / ProxySQL** は MySQL で同じ役割を果たします。",
  } as const,
};

export const DEVOPS_DAY_70_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "HA patterns — active-passive vs active-active & availability math",
        np: "HA pattern — active-passive vs active-active र availability math",
        jp: "HA パターン — アクティブ・パッシブ vs アクティブ・アクティブ & 可用性の計算",
      },
      blocks: [
        { type: "diagram", id: "devops-ha-patterns" },
        {
          type: "table",
          caption: {
            en: "Availability tiers — uptime, downtime & what achieves each level",
            np: "Availability tier — uptime, downtime र हरेक level के ले achieve गर्छ",
            jp: "可用性ティア — 稼働時間・ダウンタイム・各レベルを実現するもの",
          },
          headers: [
            { en: "Availability", np: "Availability", jp: "可用性" },
            { en: "Annual downtime", np: "Annual downtime", jp: "年間ダウンタイム" },
            { en: "Monthly downtime", np: "Monthly downtime", jp: "月間ダウンタイム" },
            { en: "Typical architecture", np: "Typical architecture", jp: "典型的なアーキテクチャ" },
          ],
          rows: [
            [
              { en: "99% (\"two nines\")", np: "99% (\"two nines\")", jp: "99%（「ツーナイン」）" },
              { en: "87.6 hours", np: "87.6 घण्टा", jp: "87.6 時間" },
              { en: "7.3 hours", np: "7.3 घण्टा", jp: "7.3 時間" },
              { en: "Single server, no redundancy — dev/test only", np: "Single server, redundancy छैन — dev/test मात्र", jp: "シングルサーバー・冗長性なし — 開発/テスト専用" },
            ],
            [
              { en: "99.9% (\"three nines\")", np: "99.9% (\"three nines\")", jp: "99.9%（「スリーナイン」）" },
              { en: "8.76 hours", np: "8.76 घण्टा", jp: "8.76 時間" },
              { en: "43.8 minutes", np: "43.8 मिनेट", jp: "43.8 分" },
              { en: "Single server with good monitoring & fast restarts (e.g., systemd auto-restart, health checks)", np: "राम्रो monitoring र fast restart सहित single server (जस्तै, systemd auto-restart, health check)", jp: "優れたモニタリングと高速再起動を備えたシングルサーバー（例：systemd 自動再起動・ヘルスチェック）" },
            ],
            [
              { en: "99.99% (\"four nines\")", np: "99.99% (\"four nines\")", jp: "99.99%（「フォーナイン」）" },
              { en: "52.6 minutes", np: "52.6 मिनेट", jp: "52.6 分" },
              { en: "4.4 minutes", np: "4.4 मिनेट", jp: "4.4 分" },
              { en: "Active-passive with automatic failover (keepalived/VRRP), multi-AZ deployment on cloud", np: "Automatic failover सहित active-passive (keepalived/VRRP), cloud मा multi-AZ deployment", jp: "自動フェイルオーバーを備えたアクティブ・パッシブ（keepalived/VRRP）・クラウドのマルチ AZ デプロイ" },
            ],
            [
              { en: "99.999% (\"five nines\")", np: "99.999% (\"five nines\")", jp: "99.999%（「ファイブナイン」）" },
              { en: "5.26 minutes", np: "5.26 मिनेट", jp: "5.26 分" },
              { en: "26.3 seconds", np: "26.3 सेकेन्ड", jp: "26.3 秒" },
              { en: "Active-active across multiple data centers, chaos engineering practice, automated runbooks", np: "Multiple data center मा active-active, chaos engineering practice, automated runbook", jp: "複数データセンターにまたがるアクティブ・アクティブ・カオスエンジニアリングの実践・自動化された runbook" },
            ],
            [
              { en: "99.9999% (\"six nines\")", np: "99.9999% (\"six nines\")", jp: "99.9999%（「シックスナイン」）" },
              { en: "31.5 seconds", np: "31.5 सेकेन्ड", jp: "31.5 秒" },
              { en: "2.6 seconds", np: "2.6 सेकेन्ड", jp: "2.6 秒" },
              { en: "Used by financial systems and telecom — requires extreme architectural investment, auto-healing infrastructure", np: "Financial system र telecom ले प्रयोग गर्छ — extreme architectural investment, auto-healing infrastructure चाहिन्छ", jp: "金融システムと通信で使用 — 極限のアーキテクチャ投資・自己修復インフラが必要" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Keepalived, VRRP & database HA",
        np: "Keepalived, VRRP र database HA",
        jp: "Keepalived・VRRP・データベース HA",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Keepalived VRRP config, health check scripts & database HA patterns",
            np: "Keepalived VRRP config, health check script र database HA pattern",
            jp: "Keepalived VRRP 設定・ヘルスチェックスクリプト・データベース HA パターン",
          },
          code: `# ── Install keepalived ────────────────────────────────────────────
apt install keepalived -y

# ── /etc/keepalived/keepalived.conf (MASTER node) ─────────────────
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51          # must match on both nodes (0-255)
    priority 100                  # higher = preferred master
    advert_int 1                  # heartbeat interval in seconds

    authentication {
        auth_type PASS
        auth_pass s3cr3tpass       # shared secret — same on both nodes
    }

    virtual_ipaddress {
        192.168.1.100/24           # the floating VIP
    }
}

# ── /etc/keepalived/keepalived.conf (BACKUP node) ─────────────────
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51          # must match master
    priority 90                   # lower than master's 100
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass s3cr3tpass
    }

    virtual_ipaddress {
        192.168.1.100/24
    }
}

# ── Start and verify ──────────────────────────────────────────────
systemctl enable --now keepalived

# VIP should appear on master:
ip addr show eth0
# inet 192.168.1.100/24 scope global secondary eth0  ← VIP present

# ── Simulate failover ─────────────────────────────────────────────
# On master — stop keepalived:
systemctl stop keepalived

# Watch VIP migrate to backup (should move within ~3 seconds):
watch ip addr show eth0

# ── Health check script integration ──────────────────────────────
# Track Nginx health — if Nginx is down, drop priority below backup's
vrrp_script chk_nginx {
    script "/usr/bin/systemctl is-active nginx"
    interval 2          # check every 2 seconds
    weight -20          # subtract 20 from priority when check fails
                        # master priority drops to 80, below backup's 90
                        #  → backup takes over even if master is up
}

vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass s3cr3tpass
    }

    virtual_ipaddress {
        192.168.1.100/24
    }

    track_script {
        chk_nginx          # reference the script block above
    }
}

# ── PostgreSQL HA with Patroni ────────────────────────────────────
# Patroni uses etcd/Consul/ZooKeeper as a Distributed Configuration
# Store (DCS) for leader election. Each Patroni node must renew a
# lease in the DCS every TTL seconds. If the primary can't renew
# (network partition, crash), the lease expires; a replica wins the
# election and is automatically promoted to primary. HAProxy reads
# the Patroni REST API (port 8008) to route writes to the primary
# and reads to replicas — applications always connect to HAProxy.

# Check which node is primary (returns 200 on primary, 503 on replica):
curl http://db-node-1:8008/master
curl http://db-node-2:8008/replica

# ── PostgreSQL replication status ─────────────────────────────────
# On primary — see connected replicas and replication lag:
psql -U postgres -c "SELECT * FROM pg_stat_replication;"

# On replica — confirm it is in recovery (not primary):
psql -U postgres -c "SELECT pg_is_in_recovery();"
# → t  (true = this node is a replica)

# ── Continuous health check against the VIP ───────────────────────
for i in {1..20}; do
    curl -s http://192.168.1.100/health
    sleep 0.5
done
# During failover you will see a brief gap (1-3 lost requests)
# then responses resume from the backup — measure actual RTO`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Set up keepalived on two VMs (or Docker containers simulating two hosts). Configure a virtual IP that floats between them. Verify the VIP is on the master with `ip addr show`. Stop keepalived on the master (`systemctl stop keepalived`) and watch the VIP migrate to the backup within 3 seconds. Measure the failover time with a continuous ping to the VIP: `ping -i 0.2 <VIP>` — count the number of lost pings to calculate actual downtime. Restart the master and observe whether it reclaims the VIP (preempt behavior).",
              np: "दुईवटा VM (वा दुईवटा host simulate गर्ने Docker container) मा keepalived set up गर्नुहोस्। बीचमा float गर्ने virtual IP configure गर्नुहोस्। `ip addr show` सँग VIP master मा छ verify गर्नुहोस्। Master मा keepalived stop गर्नुहोस् (`systemctl stop keepalived`) र VIP 3 second भित्रमा backup मा migrate हुने watch गर्नुहोस्। VIP मा continuous ping सँग failover time measure गर्नुहोस्: `ping -i 0.2 <VIP>` — actual downtime calculate गर्न lost ping को संख्या count गर्नुहोस्। Master restart गर्नुहोस् र VIP reclaim गर्छ कि गर्दैन observe गर्नुहोस् (preempt behavior)।",
              jp: "2 台の VM（または 2 台のホストをシミュレートする Docker コンテナ）で keepalived をセットアップする。それらの間でフロートする仮想 IP を設定する。`ip addr show` で VIP がマスターにあることを確認する。マスターで keepalived を停止（`systemctl stop keepalived`）して VIP が 3 秒以内にバックアップに移行するのを観察する。VIP への連続 ping でフェイルオーバー時間を測定する：`ping -i 0.2 <VIP>` — 実際のダウンタイムを計算するために失われた ping の数を数える。マスターを再起動して VIP を再取得するかどうかを観察する（preempt の動作）。",
            },
            {
              en: "Add a health check script to keepalived that monitors Nginx. Configure `vrrp_script` to check if Nginx is running every 2 seconds with a weight of -20 (when Nginx is down, priority drops below the backup's priority, triggering failover). Stop Nginx on the master (`systemctl stop nginx`) and observe keepalived automatically fail over to the backup. This simulates application-aware failover — the VIP moves not just when the server dies but when the application fails.",
              np: "Nginx monitor गर्ने health check script keepalived मा add गर्नुहोस्। Nginx 2 second हरेकमा running छ कि छैन check गर्न -20 को weight सहित `vrrp_script` configure गर्नुहोस् (Nginx down हुँदा priority backup को भन्दा तल झर्छ, failover trigger हुन्छ)। Master मा Nginx stop गर्नुहोस् (`systemctl stop nginx`) र keepalived ले automatically backup मा fail over गर्ने observe गर्नुहोस्। यसले application-aware failover simulate गर्छ — VIP server मर्दा मात्र होइन application fail हुँदा पनि move हुन्छ।",
              jp: "Nginx を監視する keepalived のヘルスチェックスクリプトを追加する。Nginx が 2 秒ごとに実行されているかどうかを weight -20 で確認するように `vrrp_script` を設定する（Nginx がダウンすると優先度がバックアップの優先度を下回り、フェイルオーバーがトリガーされる）。マスターで Nginx を停止（`systemctl stop nginx`）して keepalived が自動的にバックアップにフェイルオーバーするのを観察する。これはアプリケーション対応のフェイルオーバーをシミュレートします — VIP はサーバーがダウンしたときだけでなくアプリケーションが失敗したときにも移動します。",
            },
            {
              en: "Calculate the HA requirements for a hypothetical production system. Given: target availability 99.99%, planned maintenance window of 2 hours/month (taken at 3am). How much unplanned downtime budget is left? (52 min - 0 = all for unplanned since planned is outside SLA if disclosed). Design the failure domains: if one server in an active-passive pair fails, what is the RTO? (keepalived failover: ~3s) What is the RPO for a stateless web app? (0 — no state to lose). What is the RPO for a PostgreSQL primary with synchronous replication? (0 — commit confirmed on replica) vs asynchronous? (potentially minutes of data loss — the replication lag at time of failure). Document your design decisions.",
              np: "Hypothetical production system को लागि HA requirement calculate गर्नुहोस्। दिइएको: target availability 99.99%, planned maintenance window 2 घण्टा/महिना (बिहान 3 बजे)। कति unplanned downtime budget बाँकी छ? (52 min - 0 = सबै unplanned को लागि किनभने planned SLA बाहिर छ disclose गरेमा)। Failure domain design गर्नुहोस्: active-passive pair मा एउटा server fail भयो भने RTO के हो? (keepalived failover: ~3s) Stateless web app को RPO के हो? (0 — गुमाउने state छैन)। Synchronous replication सहित PostgreSQL primary को RPO के हो? (0 — replica मा commit confirmed) vs asynchronous? (potentially minutes of data loss — failure को time मा replication lag)। Design decision document गर्नुहोस्।",
              jp: "仮想的な本番システムの HA 要件を計算する。前提：目標可用性 99.99%・月 2 時間の計画メンテナンス時間（午前 3 時に実施）。計画外ダウンタイムの予算はどれくらい残るか？（52 分 - 0 = 開示された場合 SLA 外なので計画分はすべて計画外に充当）。障害ドメインを設計する：アクティブ・パッシブペアの 1 台のサーバーが障害を起こした場合、RTO は？（keepalived フェイルオーバー：約 3 秒）ステートレス Web アプリの RPO は？（0 — 失うべき状態はない）。同期レプリケーションを持つ PostgreSQL プライマリの RPO は？（0 — レプリカで確認済みのコミット）vs 非同期？（潜在的に数分のデータ損失 — 障害発生時のレプリケーションラグ）。設計上の判断を記録する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the split-brain problem and how do you prevent it?",
        np: "Split-brain problem के हो र यसलाई कसरी prevent गर्ने?",
        jp: "スプリットブレイン問題とは何か、どうやって防ぐか？",
      },
      answer: {
        en: "**Split-brain** occurs when two nodes in an HA cluster lose communication with each other (network partition) but both remain up. Both nodes believe they are the primary and start serving traffic independently. For a load balancer VIP, this means both nodes claim the IP — causing ARP conflicts and packet loss. For a database, this is catastrophic — both accept writes, data diverges, and you have two inconsistent masters. Prevention strategies: (1) **Quorum / voting**: require agreement from N/2+1 nodes before taking primary role. With 3 nodes, a single network partition can't cause split-brain because neither side alone has quorum. (2) **Fencing / STONITH (Shoot The Other Node In The Head)**: when a node suspects split-brain, it uses an out-of-band channel (IPMI, cloud API) to forcibly power off or reboot the suspected failed node before claiming primary role. This ensures only one node is ever active. (3) **Witness / tiebreaker**: a third lightweight node (can be a small VM) that only votes, never takes primary role — breaks ties in 2-node clusters. (4) **Lease-based leadership**: the primary must renew a distributed lock (in etcd/ZooKeeper/Consul) every N seconds. If it can't renew (network partition), the lock expires and another node can claim primary. Patroni uses this approach.",
        np: "**Split-brain** तब हुन्छ जब HA cluster का दुईवटा node ले एकअर्कासँग communication गुमाउँछन् (network partition) तर दुवै up रहन्छन्। दुवै node आफूलाई primary ठान्छन् र independently traffic serve गर्न थाल्छन्। Load balancer VIP को लागि, यसको मतलब दुवै node ले IP claim गर्छन् — ARP conflict र packet loss। Database को लागि, यो catastrophic हो — दुवैले write accept गर्छन्, data diverge हुन्छ, र दुईवटा inconsistent master हुन्छन्। Prevention strategy: (1) **Quorum / voting**: primary role लिनुअघि N/2+1 node बाट agreement require गर्नु। 3 node सँग, single network partition ले split-brain cause गर्न सक्दैन किनभने एक पनि side ले एक्लै quorum हुँदैन। (2) **Fencing / STONITH (Shoot The Other Node In The Head)**: node ले split-brain शंका गर्दा, primary role claim गर्नुअघि suspected failed node लाई forcibly power off वा reboot गर्न out-of-band channel (IPMI, cloud API) प्रयोग गर्छ। यसले एउटा मात्र node सधैँ active हुन्छ ensure गर्छ। (3) **Witness / tiebreaker**: vote मात्र गर्ने, primary role कहिल्यै नलिने third lightweight node (small VM हुन सक्छ) — 2-node cluster मा tie break गर्छ। (4) **Lease-based leadership**: primary ले हरेक N second मा distributed lock (etcd/ZooKeeper/Consul मा) renew गर्नुपर्छ। Renew गर्न सकेन भने (network partition), lock expire हुन्छ र अर्को node ले primary claim गर्न सक्छ। Patroni ले यो approach प्रयोग गर्छ।",
        jp: "**スプリットブレイン**は、HA クラスター内の 2 つのノードがお互いとの通信を失う（ネットワーク分断）が、両方とも稼働し続けているときに発生します。両方のノードが自分がプライマリだと思い込み、独立してトラフィックを提供し始めます。ロードバランサーの VIP では、両方のノードが IP を主張し — ARP の競合とパケット損失が発生します。データベースでは、これは壊滅的です — 両方が書き込みを受け付け、データが分岐し、2 つの一貫性のないマスターができます。防止策：(1) **クォーラム / 投票**：プライマリロールを取る前に N/2+1 ノードの合意を要求する。3 ノードでは、単一のネットワーク分断はスプリットブレインを引き起こせません、なぜなら分断のどちら側も単独ではクォーラムを持てないため。(2) **フェンシング / STONITH（Shoot The Other Node In The Head）**：ノードがスプリットブレインを疑うとき、プライマリロールを主張する前にアウトオブバンドチャネル（IPMI・クラウド API）を使用して疑われる障害ノードを強制的に電源オフまたは再起動する。これにより常に 1 つのノードだけがアクティブであることが保証される。(3) **ウィットネス / タイブレーカー**：投票するだけでプライマリロールを取らない第三の軽量ノード（小さな VM でよい）— 2 ノードクラスターでの同点を解消。(4) **リースベースのリーダーシップ**：プライマリは N 秒ごとに分散ロック（etcd/ZooKeeper/Consul）を更新しなければならない。更新できなければ（ネットワーク分断）、ロックが期限切れになり別のノードがプライマリを主張できる。Patroni はこのアプローチを使用している。",
      },
      tag: {
        en: "split-brain prevention",
        np: "Split-brain prevention",
        jp: "スプリットブレイン防止",
      },
    },
    {
      question: {
        en: "What is the difference between RTO and RPO, and how do they affect architecture?",
        np: "RTO र RPO बीचको फरक के हो, र तिनीहरूले architecture लाई कसरी affect गर्छन्?",
        jp: "RTO と RPO の違いは何か、アーキテクチャにどう影響するか？",
      },
      answer: {
        en: "**RTO (Recovery Time Objective)** is the maximum acceptable time your system can be down after a failure — how long until service is restored. **RPO (Recovery Point Objective)** is the maximum acceptable amount of data loss, measured as time — how far back you can go on data. Example: RPO=1 hour means you can lose at most 1 hour of data if the database crashes. These objectives drive architectural choices: Low RTO (seconds) requires: active-passive with automatic failover (keepalived, Patroni), health checks, pre-warmed standby. Low RPO requires: synchronous replication (acknowledge write only after replica confirms receipt), frequent snapshots, point-in-time recovery. The tradeoff: synchronous replication adds latency to every write (you wait for the replica to confirm). Asynchronous replication is faster but has an RPO equal to the replication lag. The difference in practice: a financial transaction system might need RTO=30s and RPO=0 (zero data loss, synchronous replication). A logging system might accept RTO=4h and RPO=24h (restore from daily snapshot). Always define RTO and RPO before designing your HA architecture — they determine whether you need keepalived or Patroni or active-active across multiple regions.",
        np: "**RTO (Recovery Time Objective)** failure पछि तपाईंको system down हुन सक्ने maximum acceptable time हो — service restore हुन कति समय लाग्छ। **RPO (Recovery Point Objective)** time मा मापिएको maximum acceptable data loss हो — data मा कति पछाडि जान सकिन्छ। Example: RPO=1 hour को मतलब database crash भयो भने बढीमा 1 घण्टाको data गुमाउन सकिन्छ। यी objective ले architectural choice drive गर्छन्: Low RTO (second) को लागि चाहिन्छ: automatic failover सहित active-passive (keepalived, Patroni), health check, pre-warmed standby। Low RPO को लागि चाहिन्छ: synchronous replication (replica ले receipt confirm गरेपछि मात्र write acknowledge), frequent snapshot, point-in-time recovery। Tradeoff: synchronous replication ले हरेक write मा latency add गर्छ (replica को confirm को लागि wait गर्नुहोस्)। Asynchronous replication faster छ तर replication lag बराबर RPO हुन्छ। Practice मा फरक: financial transaction system लाई RTO=30s र RPO=0 (zero data loss, synchronous replication) चाहिन सक्छ। Logging system ले RTO=4h र RPO=24h (daily snapshot बाट restore) accept गर्न सक्छ। HA architecture design गर्नुअघि सधैँ RTO र RPO define गर्नुहोस् — तिनीहरूले keepalived चाहिन्छ कि Patroni कि multiple region मा active-active निर्धारण गर्छन्।",
        jp: "**RTO（目標復旧時間）**は障害後にシステムがダウンしていられる最大許容時間 — サービスが復旧するまでの時間。**RPO（目標復旧時点）**は時間で測定された最大許容データ損失量 — データをどこまで遡れるか。例：RPO=1 時間はデータベースがクラッシュしても最大 1 時間分のデータしか失えないことを意味します。これらの目標がアーキテクチャの選択を決定します：低 RTO（秒単位）には：自動フェイルオーバーを備えたアクティブ・パッシブ（keepalived・Patroni）・ヘルスチェック・事前ウォームアップされたスタンバイが必要。低 RPO には：同期レプリケーション（レプリカが受信を確認した後にのみ書き込みを確認）・頻繁なスナップショット・ポイントインタイムリカバリが必要。トレードオフ：同期レプリケーションはすべての書き込みにレイテンシを追加します（レプリカの確認を待つ）。非同期レプリケーションは高速ですがレプリケーションラグと同等の RPO になります。実際の違い：金融取引システムは RTO=30 秒と RPO=0（ゼロデータ損失・同期レプリケーション）が必要かもしれません。ロギングシステムは RTO=4 時間と RPO=24 時間（日次スナップショットから復元）を許容するかもしれません。HA アーキテクチャを設計する前に常に RTO と RPO を定義してください — keepalived が必要か Patroni が必要か複数リージョンにまたがるアクティブ・アクティブが必要かを決定します。",
      },
      tag: {
        en: "RTO vs RPO",
        np: "RTO vs RPO",
        jp: "RTO vs RPO",
      },
    },
  ],
};
