import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "An **Ansible inventory** is the source of truth for what hosts Ansible manages. A **static inventory** is a plain file — either INI or YAML format — that lists the hosts and groups Ansible should target. **Groups** let you address subsets of your infrastructure: `[webservers]`, `[dbservers]`, `[production]`, `[staging]`. A host can belong to multiple groups simultaneously. Groups can contain other groups (parent/child relationships) — in INI format you declare this with a `[groupname:children]` section. Variables can be set at the **host level** inline on the inventory line (`ansible_host`, `ansible_user`, `ansible_port`, `ansible_ssh_private_key_file`) or at the **group level** in a `[groupname:vars]` section. The special `all` group implicitly contains every host in the inventory; the `ungrouped` group contains hosts not in any explicit group. INI format is compact and readable; YAML format is more verbose but scales better for complex group hierarchies and is preferred for large inventories.",
    np: "**Ansible inventory** Ansible ले manage गर्ने host हरूको source of truth हो। **Static inventory** एउटा plain file हो — INI वा YAML format मा — जसले Ansible ले target गर्नुपर्ने host र group list गर्छ। **Group** हरूले तपाईंलाई infrastructure को subset address गर्न दिन्छ: `[webservers]`, `[dbservers]`, `[production]`, `[staging]`। एउटा host एकसाथ multiple group मा belong गर्न सक्छ। Group हरूमा अन्य group हुन सक्छन् (parent/child relationship) — INI format मा यो `[groupname:children]` section सँग declare गरिन्छ। Variable हरू **host level** मा inventory line मा inline (`ansible_host`, `ansible_user`, `ansible_port`, `ansible_ssh_private_key_file`) वा **group level** मा `[groupname:vars]` section मा set गर्न सकिन्छ। Special `all` group ले inventory मा हरेक host implicitly contain गर्छ; `ungrouped` group ले कुनै explicit group मा नभएका host contain गर्छ। INI format compact र readable छ; YAML format बढी verbose छ तर complex group hierarchy को लागि राम्रोसँग scale हुन्छ र large inventory को लागि preferred छ।",
    jp: "**Ansible インベントリ**は Ansible が管理するホストの信頼できる情報源です。**静的インベントリ**は INI または YAML 形式のプレーンファイルで — Ansible がターゲットにすべきホストとグループを一覧します。**グループ**はインフラストラクチャのサブセットをアドレス指定できます：`[webservers]`・`[dbservers]`・`[production]`・`[staging]`。ホストは複数のグループに同時に属することができます。グループは他のグループを含むことができます（親子関係）— INI 形式では `[groupname:children]` セクションで宣言します。変数はインベントリ行のインライン（`ansible_host`・`ansible_user`・`ansible_port`・`ansible_ssh_private_key_file`）で**ホストレベル**に、または `[groupname:vars]` セクションで**グループレベル**に設定できます。特別な `all` グループはインベントリ内のすべてのホストを暗黙的に含みます；`ungrouped` グループは明示的なグループに属さないホストを含みます。INI 形式はコンパクトで読みやすく；YAML 形式はより冗長ですが複雑なグループ階層に対してより適切にスケールし大規模なインベントリに推奨されます。",
  } as const,
  o2: {
    en: "**Dynamic inventory** replaces the static file with a script or plugin that queries an external source — AWS EC2, GCP, Azure, Kubernetes, VMware — and returns JSON describing the current infrastructure. This is essential in cloud environments where instances come and go: you cannot maintain a static file when auto-scaling groups spin up and tear down instances hourly. There are two mechanisms: (1) **Inventory plugins** (modern, preferred) — built into Ansible collections, they use a YAML config file. Examples: `amazon.aws.aws_ec2` queries the EC2 API and groups hosts by region, instance type, tags, and VPC. (2) **Inventory scripts** (legacy) — executable scripts that output JSON in a specific format Ansible understands. Beyond the inventory file itself, **`host_vars/`** and **`group_vars/`** directories provide a structured way to organise variables: Ansible automatically loads `group_vars/<groupname>.yml` for all hosts in that group and `host_vars/<hostname>.yml` for a specific host. This keeps variable data out of the inventory file and makes complex configurations manageable.",
    np: "**Dynamic inventory** ले static file लाई एउटा script वा plugin ले replace गर्छ जसले external source — AWS EC2, GCP, Azure, Kubernetes, VMware — query गर्छ र current infrastructure describe गर्ने JSON return गर्छ। यो cloud environment मा essential छ जहाँ instance हरू आउँछन् र जान्छन्: auto-scaling group ले hourly instance spin up र tear down गर्दा static file maintain गर्न सकिँदैन। दुईवटा mechanism छन्: (1) **Inventory plugin** (modern, preferred) — Ansible collection मा built-in, YAML config file प्रयोग गर्छन्। Example: `amazon.aws.aws_ec2` ले EC2 API query गर्छ र host लाई region, instance type, tag, र VPC अनुसार group गर्छ। (2) **Inventory script** (legacy) — Ansible ले बुझ्ने specific format मा JSON output गर्ने executable script। Inventory file नै भन्दा बाहिर, **`host_vars/`** र **`group_vars/`** directory हरूले variable organize गर्ने structured तरिका provide गर्छ: Ansible ले त्यो group मा सबै host को लागि `group_vars/<groupname>.yml` र specific host को लागि `host_vars/<hostname>.yml` automatically load गर्छ। यसले inventory file बाट variable data बाहिर राख्छ र complex configuration manageable बनाउँछ।",
    jp: "**動的インベントリ**は静的ファイルを外部ソース — AWS EC2・GCP・Azure・Kubernetes・VMware — を照会して現在のインフラストラクチャを記述する JSON を返すスクリプトまたはプラグインに置き換えます。これはインスタンスが頻繁に変わるクラウド環境で不可欠です：オートスケーリンググループが毎時インスタンスを起動・終了するとき静的ファイルは維持できません。2 つのメカニズムがあります：(1) **インベントリプラグイン**（モダン・推奨）— Ansible コレクションに組み込まれており YAML 設定ファイルを使用します。例：`amazon.aws.aws_ec2` は EC2 API を照会してホストをリージョン・インスタンスタイプ・タグ・VPC でグループ化します。(2) **インベントリスクリプト**（レガシー）— Ansible が理解する特定の形式で JSON を出力する実行可能スクリプト。インベントリファイル自体を超えて、**`host_vars/`** と **`group_vars/`** ディレクトリは変数を整理する構造化された方法を提供します：Ansible はそのグループのすべてのホストに対して `group_vars/<groupname>.yml` を、特定のホストに対して `host_vars/<hostname>.yml` を自動的に読み込みます。これにより変数データをインベントリファイルから分離して複雑な設定を管理しやすくします。",
  } as const,
};

export const DEVOPS_DAY_72_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Inventory formats — INI, YAML & group hierarchies",
        np: "Inventory format — INI, YAML र group hierarchy",
        jp: "インベントリ形式 — INI・YAML・グループ階層",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-inventory" },
        {
          type: "table",
          caption: {
            en: "Inventory variable precedence — lowest to highest",
            np: "Inventory variable precedence — सबैभन्दा कम देखि सबैभन्दा बढी",
            jp: "インベントリ変数の優先順位 — 最低から最高",
          },
          headers: [
            { en: "Precedence", np: "Precedence", jp: "優先順位" },
            { en: "Variable source", np: "Variable source", jp: "変数ソース" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "1 (lowest)", np: "1 (सबैभन्दा कम)", jp: "1（最低）" },
              { en: "`all` group vars", np: "`all` group vars", jp: "`all` グループ変数" },
              { en: "`group_vars/all.yml` — applies to every host", np: "`group_vars/all.yml` — हरेक host मा apply हुन्छ", jp: "`group_vars/all.yml` — すべてのホストに適用" },
            ],
            [
              { en: "2", np: "2", jp: "2" },
              { en: "Parent group vars", np: "Parent group vars", jp: "親グループ変数" },
              { en: "`group_vars/production.yml` — applies to all production hosts", np: "`group_vars/production.yml` — सबै production host मा apply हुन्छ", jp: "`group_vars/production.yml` — すべての production ホストに適用" },
            ],
            [
              { en: "3", np: "3", jp: "3" },
              { en: "Child group vars", np: "Child group vars", jp: "子グループ変数" },
              { en: "`group_vars/webservers.yml` — applies to webserver group", np: "`group_vars/webservers.yml` — webserver group मा apply हुन्छ", jp: "`group_vars/webservers.yml` — webserver グループに適用" },
            ],
            [
              { en: "4", np: "4", jp: "4" },
              { en: "Host vars file", np: "Host vars file", jp: "ホスト変数ファイル" },
              { en: "`host_vars/web1.example.com.yml` — specific to one host", np: "`host_vars/web1.example.com.yml` — एउटा host को लागि specific", jp: "`host_vars/web1.example.com.yml` — 特定の 1 ホスト専用" },
            ],
            [
              { en: "5 (highest)", np: "5 (सबैभन्दा बढी)", jp: "5（最高）" },
              { en: "Inventory host line vars", np: "Inventory host line vars", jp: "インベントリホスト行変数" },
              { en: "`web1 ansible_user=deploy http_port=8080` — overrides everything", np: "`web1 ansible_user=deploy http_port=8080` — सबैकुरा override गर्छ", jp: "`web1 ansible_user=deploy http_port=8080` — すべてをオーバーライド" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Static inventory, group_vars & dynamic AWS EC2 inventory",
        np: "Static inventory, group_vars र dynamic AWS EC2 inventory",
        jp: "静的インベントリ・group_vars・動的 AWS EC2 インベントリ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Static inventory (INI + YAML), group_vars, host_vars & dynamic EC2 inventory",
            np: "Static inventory (INI + YAML), group_vars, host_vars र dynamic EC2 inventory",
            jp: "静的インベントリ（INI + YAML）・group_vars・host_vars・動的 EC2 インベントリ",
          },
          code: `# ── Static inventory — INI format (inventory.ini) ────────────────
[webservers]
web1.example.com  ansible_host=10.0.0.1  ansible_user=ubuntu  ansible_ssh_private_key_file=~/.ssh/web.pem
web2.example.com  ansible_host=10.0.0.2  ansible_user=ubuntu  ansible_ssh_private_key_file=~/.ssh/web.pem

[dbservers]
db1.example.com   ansible_host=10.0.1.1  ansible_user=ubuntu  ansible_port=22

# Parent group containing both webservers and dbservers
[production:children]
webservers
dbservers

[production:vars]
env=production
monitoring_enabled=true

# ── Same inventory — YAML format (inventory.yml) ─────────────────
# YAML is more explicit and scales better for deep hierarchies
all:
  children:
    webservers:
      hosts:
        web1.example.com:
          ansible_host: 10.0.0.1
          ansible_user: ubuntu
          ansible_ssh_private_key_file: ~/.ssh/web.pem
        web2.example.com:
          ansible_host: 10.0.0.2
          ansible_user: ubuntu
          ansible_ssh_private_key_file: ~/.ssh/web.pem
    dbservers:
      hosts:
        db1.example.com:
          ansible_host: 10.0.1.1
          ansible_user: ubuntu
          ansible_port: 22
    production:
      children:
        webservers:
        dbservers:
      vars:
        env: production
        monitoring_enabled: true

# ── group_vars / host_vars directory layout ───────────────────────
# Ansible automatically loads these — no extra config needed
#
# inventory.ini  (or inventory.yml)
# group_vars/
#   all.yml              ← applies to every host in every group
#   webservers.yml       ← applies to all hosts in [webservers]
#   dbservers.yml        ← applies to all hosts in [dbservers]
#   production.yml       ← applies to all hosts in [production]
# host_vars/
#   web1.example.com.yml ← applies only to web1.example.com
#   db1.example.com.yml  ← applies only to db1.example.com

# ── group_vars/all.yml ────────────────────────────────────────────
---
ansible_user: ubuntu
ansible_python_interpreter: /usr/bin/python3

# ── group_vars/webservers.yml ──────────────────────────────────────
---
nginx_port: 80
nginx_worker_processes: auto

# ── host_vars/web1.example.com.yml ────────────────────────────────
---
nginx_port: 8080          # overrides group_vars/webservers.yml for this host only

# ── List & test inventory ─────────────────────────────────────────
# Show all hosts and their merged variables as JSON
ansible-inventory -i inventory.ini --list

# Show group hierarchy as a tree
ansible-inventory -i inventory.ini --graph

# Show merged variables for a specific host
ansible-inventory -i inventory.ini --host web1.example.com

# ── Dynamic inventory config — AWS EC2 (aws_ec2.yml) ─────────────
# Requires: pip install boto3  &&  ansible-galaxy collection install amazon.aws
---
plugin: amazon.aws.aws_ec2
regions:
  - us-east-1
  - us-west-2

# Only include instances with this tag
filters:
  tag:Environment: production
  instance-state-name: running

# Group hosts by instance_type and by the value of the Role tag
keyed_groups:
  - key: instance_type
    prefix: type
  - key: tags.Role
    prefix: role

# Map EC2 attributes to Ansible connection variables
compose:
  ansible_host: public_ip_address
  ansible_user: "'ubuntu'"

# Cache results to avoid hitting the API on every run (disable during testing)
cache: true
cache_plugin: jsonfile
cache_connection: /tmp/aws_inventory_cache
cache_timeout: 300   # seconds — set to 0 to disable

# ── Use dynamic inventory ─────────────────────────────────────────
ansible-inventory -i aws_ec2.yml --list      # see what the plugin returns
ansible-inventory -i aws_ec2.yml --graph     # human-readable tree
ansible-playbook -i aws_ec2.yml site.yml     # run playbook against EC2 hosts

# ── Combine static + dynamic sources (inventory directory) ───────
# ansible.cfg
# [defaults]
# inventory = inventory/       ← point at a directory, not a single file
#
# inventory/
#   static_hosts.ini           ← static hosts (bastion, internal servers)
#   aws_ec2.yml                ← dynamic EC2 hosts
#   group_vars/
#     all.yml
#   host_vars/
#
# Ansible merges all sources — hosts from both files appear in one inventory
ansible-inventory -i inventory/ --graph      # shows combined hierarchy`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a static inventory (`inventory.ini`) with at least 3 hosts in 2 groups: `[webservers]` containing `web1` and `web2` as localhost with different `ansible_port` values (e.g. 2221 and 2222), and `[dbservers]` containing `db1`. Create a `[production:children]` group containing both. Then create `group_vars/webservers.yml` with `http_port: 80` and `group_vars/dbservers.yml` with `db_port: 5432`. Run `ansible-inventory -i inventory.ini --graph` to visualise the hierarchy and `ansible-inventory -i inventory.ini --list` to observe how variables from `group_vars/` are merged into each host's variable set.",
              np: "कम्तीमा 3 host सहित 2 group मा static inventory (`inventory.ini`) create गर्नुहोस्: `[webservers]` मा `web1` र `web2` different `ansible_port` value (जस्तै 2221 र 2222) सहित localhost को रूपमा, र `[dbservers]` मा `db1`। दुवै contain गर्ने `[production:children]` group create गर्नुहोस्। त्यसपछि `http_port: 80` सहित `group_vars/webservers.yml` र `db_port: 5432` सहित `group_vars/dbservers.yml` create गर्नुहोस्। Hierarchy visualise गर्न `ansible-inventory -i inventory.ini --graph` र `group_vars/` बाट variable हरेक host को variable set मा कसरी merge हुन्छ observe गर्न `ansible-inventory -i inventory.ini --list` run गर्नुहोस्।",
              jp: "少なくとも 3 つのホストを 2 つのグループに持つ静的インベントリ（`inventory.ini`）を作成する：`[webservers]` に異なる `ansible_port` 値（例：2221 と 2222）で localhost として `web1` と `web2`、`[dbservers]` に `db1`。両方を含む `[production:children]` グループを作成する。次に `http_port: 80` で `group_vars/webservers.yml` と `db_port: 5432` で `group_vars/dbservers.yml` を作成する。`ansible-inventory -i inventory.ini --graph` で階層を視覚化し、`ansible-inventory -i inventory.ini --list` で `group_vars/` からの変数が各ホストの変数セットにどのようにマージされるかを観察する。",
            },
            {
              en: "Use host patterns to target subsets of the inventory from exercise 1. Run the following commands and check which hosts match each pattern using `ansible --list-hosts -i inventory.ini <pattern>` before executing any real task: `webservers` (single group), `webservers:dbservers` (union — all hosts in either group), `webservers:&production` (intersection — webservers that are also in production), `all:!dbservers` (exclude group — all hosts except dbservers), `web*` (wildcard — hosts whose name starts with web). Observe that `webservers:&production` returns the same hosts as `webservers` because all webservers are already in production — this pattern matters when groups only partially overlap.",
              np: "Exercise 1 बाट inventory को subset target गर्न host pattern प्रयोग गर्नुहोस्। कुनै real task execute गर्नुअघि `ansible --list-hosts -i inventory.ini <pattern>` प्रयोग गरेर हरेक pattern सँग कुन host match गर्छ check गर्नुहोस्: `webservers` (single group), `webservers:dbservers` (union — कुनै पनि group मा सबै host), `webservers:&production` (intersection — production मा पनि भएका webserver), `all:!dbservers` (exclude group — dbserver बाहेक सबै host), `web*` (wildcard — web बाट सुरु हुने नाम भएका host)। `webservers:&production` ले `webservers` जस्तै host return गर्छ observe गर्नुहोस् किनभने सबै webserver पहिले नै production मा छन् — यो pattern तब matter गर्छ जब group हरू partially मात्र overlap गर्छन्।",
              jp: "演習 1 のインベントリのサブセットをターゲットにするためにホストパターンを使用する。実際のタスクを実行する前に `ansible --list-hosts -i inventory.ini <pattern>` で各パターンにマッチするホストを確認する：`webservers`（単一グループ）、`webservers:dbservers`（和集合 — いずれかのグループのすべてのホスト）、`webservers:&production`（積集合 — production にも属する webservers）、`all:!dbservers`（グループ除外 — dbservers 以外のすべてのホスト）、`web*`（ワイルドカード — web で始まる名前のホスト）。すべての webservers がすでに production にあるため `webservers:&production` は `webservers` と同じホストを返すことを観察する — このパターンはグループが部分的にのみ重複する場合に重要です。",
            },
            {
              en: "Create a `host_vars/` directory with a file for one specific host (e.g. `host_vars/web1.yml`) that overrides a variable set in `group_vars/webservers.yml` — for example set `http_port: 9090` to override the group's `http_port: 80`. Verify with `ansible-inventory -i inventory.ini --list` that the host-level variable takes precedence over the group variable for `web1` but not `web2`. Then confirm the full precedence chain with: `ansible web1 -i inventory.ini -m debug -a \"msg={{ http_port }}\"` (should print 9090) and `ansible web2 -i inventory.ini -m debug -a \"msg={{ http_port }}\"` (should print 80). This proves the order: `all` group vars < parent group vars < child group vars < host_vars file < inventory host line vars.",
              np: "`host_vars/` directory create गर्नुहोस् र एउटा specific host को लागि file बनाउनुहोस् (जस्तै `host_vars/web1.yml`) जसले `group_vars/webservers.yml` मा set variable override गर्छ — उदाहरणको लागि group को `http_port: 80` override गर्न `http_port: 9090` set गर्नुहोस्। `ansible-inventory -i inventory.ini --list` सँग verify गर्नुहोस् कि host-level variable ले `web1` को लागि group variable override गर्छ तर `web2` को लागि होइन। त्यसपछि full precedence chain confirm गर्नुहोस्: `ansible web1 -i inventory.ini -m debug -a \"msg={{ http_port }}\"` (9090 print हुनुपर्छ) र `ansible web2 -i inventory.ini -m debug -a \"msg={{ http_port }}\"` (80 print हुनुपर्छ)। यसले order prove गर्छ: `all` group vars < parent group vars < child group vars < host_vars file < inventory host line vars।",
              jp: "`host_vars/` ディレクトリを作成し特定のホストのファイル（例：`host_vars/web1.yml`）を作成して `group_vars/webservers.yml` に設定された変数をオーバーライドする — 例えばグループの `http_port: 80` をオーバーライドするために `http_port: 9090` を設定する。`ansible-inventory -i inventory.ini --list` でホストレベルの変数が `web1` のグループ変数より優先されるが `web2` では優先されないことを確認する。次に完全な優先順位チェーンを確認する：`ansible web1 -i inventory.ini -m debug -a \"msg={{ http_port }}\"`（9090 が表示されるはず）と `ansible web2 -i inventory.ini -m debug -a \"msg={{ http_port }}\"`（80 が表示されるはず）。これにより順序が証明されます：`all` グループ変数 < 親グループ変数 < 子グループ変数 < host_vars ファイル < インベントリホスト行変数。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is `ansible_connection: local` and when do you use it?",
        np: "`ansible_connection: local` के हो र कहिले प्रयोग गर्ने?",
        jp: "`ansible_connection: local` とは何か、いつ使うか？",
      },
      answer: {
        en: "By default, Ansible connects to managed hosts over SSH. `ansible_connection: local` tells Ansible to run tasks on the control node itself without SSH — the 'managed node' is the same machine running Ansible. There are three main use cases: (1) **Testing and development** — run playbooks against localhost without needing SSH configured; great for writing and validating playbooks before deploying to real servers. (2) **Local setup playbooks** — provision your own laptop or workstation with Ansible; `ansible-pull` (a tool that lets nodes pull and apply their own configuration from a Git repository) relies on `local` connection because each node runs Ansible against itself. (3) **Delegate specific tasks to the control node** — in a multi-host play you can use `delegate_to: localhost` to run a particular task locally (e.g. trigger a webhook, update a DNS record, or write a file to the Ansible controller). How to set it: in the inventory file write `localhost ansible_connection=local`, or in a playbook use `hosts: localhost` — Ansible is smart enough to detect this is the control node and default to local connection. Important nuance: `localhost` in Ansible inventory is not simply the system loopback interface — it is a special host name that Ansible resolves to the control node and applies local execution semantics.",
        np: "Default मा, Ansible ले SSH मार्फत managed host हरूमा connect गर्छ। `ansible_connection: local` ले Ansible लाई SSH बिना control node नै मा task run गर्न बताउँछ — 'managed node' Ansible run गर्ने machine नै हो। तीनवटा main use case छन्: (1) **Testing र development** — SSH configure नगरी localhost विरुद्ध playbook run गर्नुहोस्; real server मा deploy गर्नुअघि playbook लेख्न र validate गर्न राम्रो। (2) **Local setup playbook** — Ansible सँग आफ्नै laptop वा workstation provision गर्नुहोस्; `ansible-pull` (node हरूलाई Git repository बाट आफ्नै configuration pull र apply गर्न दिने tool) ले `local` connection मा rely गर्छ किनभने हरेक node ले आफैँविरुद्ध Ansible run गर्छ। (3) **Control node मा specific task delegate गर्ने** — multi-host play मा `delegate_to: localhost` प्रयोग गरेर particular task locally run गर्न सकिन्छ (जस्तै webhook trigger, DNS record update, वा Ansible controller मा file write)। Setting गर्ने तरिका: inventory file मा `localhost ansible_connection=local` लेख्नुहोस्, वा playbook मा `hosts: localhost` प्रयोग गर्नुहोस् — Ansible ले यो control node हो detect गर्छ र local connection default गर्छ। महत्वपूर्ण nuance: Ansible inventory मा `localhost` simply system loopback interface होइन — यो एउटा special host name हो जुन Ansible ले control node मा resolve गर्छ र local execution semantics apply गर्छ।",
        jp: "デフォルトでは Ansible は SSH 経由で管理ホストに接続します。`ansible_connection: local` は Ansible に SSH なしでコントロールノード自体でタスクを実行するよう指示します — 「管理ノード」は Ansible を実行しているマシン自体です。主な 3 つのユースケースがあります：(1) **テストと開発** — SSH を設定せずに localhost に対してプレイブックを実行する；実際のサーバーにデプロイする前にプレイブックを書いて検証するのに最適。(2) **ローカルセットアップのプレイブック** — Ansible で自分のラップトップやワークステーションをプロビジョニングする；`ansible-pull`（ノードが Git リポジトリから自分の設定を pull して適用できるツール）は各ノードが自分自身に対して Ansible を実行するため `local` 接続に依存します。(3) **特定のタスクをコントロールノードに委任する** — マルチホストのプレイで `delegate_to: localhost` を使って特定のタスクをローカルで実行できます（例：webhook をトリガーする・DNS レコードを更新する・Ansible コントローラーにファイルを書き込む）。設定方法：インベントリファイルに `localhost ansible_connection=local` と記述するか、プレイブックで `hosts: localhost` を使います — Ansible はこれがコントロールノードであることを検出してローカル接続をデフォルトにします。重要なニュアンス：Ansible インベントリの `localhost` は単純にシステムのループバックインターフェースではありません — Ansible がコントロールノードに解決してローカル実行のセマンティクスを適用する特別なホスト名です。",
      },
      tag: {
        en: "ansible_connection local",
        np: "ansible_connection local",
        jp: "ansible_connection local",
      },
    },
    {
      question: {
        en: "How do dynamic inventories work under the hood, and how do you debug them?",
        np: "Dynamic inventory भित्रबाट कसरी काम गर्छ, र कसरी debug गर्ने?",
        jp: "動的インベントリは内部でどのように機能するか、どうやってデバッグするか？",
      },
      answer: {
        en: "A dynamic inventory plugin queries an external API (e.g. the AWS EC2 API) and returns JSON in a specific structure Ansible understands: `{ \"_meta\": { \"hostvars\": { \"host1\": { \"var\": \"value\" } } }, \"groupname\": { \"hosts\": [\"host1\", \"host2\"], \"vars\": { \"group_var\": \"value\" } } }`. The `_meta.hostvars` key contains per-host variables; each top-level key besides `_meta` is a group name. You can test what any inventory source returns with `ansible-inventory -i <source> --list` (JSON output) or `--graph` (human-readable tree). Debugging steps when a dynamic inventory is not working: (1) run `ansible-inventory -i aws_ec2.yml --list` directly and look for Python import errors or AWS credential errors in the output; (2) verify AWS credentials with `aws sts get-caller-identity` — the inventory plugin uses the same credential chain as the AWS CLI; (3) add `verbose: true` to the inventory plugin YAML config for extra diagnostic output; (4) use the `constructed` inventory plugin alongside your dynamic inventory to add custom groups based on host variables without modifying the plugin config. A common footgun: dynamic inventory **caches** results by default. If you just launched new instances and they do not appear, check the `cache_timeout` setting in your inventory plugin config — set `cache_timeout: 0` or `cache: false` during testing and re-enable caching once things work. Also check whether stale cache files exist in the `cache_connection` directory.",
        np: "Dynamic inventory plugin ले external API (जस्तै AWS EC2 API) query गर्छ र Ansible ले बुझ्ने specific structure मा JSON return गर्छ: `{ \"_meta\": { \"hostvars\": { \"host1\": { \"var\": \"value\" } } }, \"groupname\": { \"hosts\": [\"host1\", \"host2\"], \"vars\": { \"group_var\": \"value\" } } }`। `_meta.hostvars` key मा per-host variable छ; `_meta` बाहेक हरेक top-level key group name हो। `ansible-inventory -i <source> --list` (JSON output) वा `--graph` (human-readable tree) सँग कुनै पनि inventory source ले के return गर्छ test गर्न सकिन्छ। Dynamic inventory काम नगर्दा debugging step: (1) `ansible-inventory -i aws_ec2.yml --list` directly run गर्नुहोस् र output मा Python import error वा AWS credential error खोज्नुहोस्; (2) `aws sts get-caller-identity` सँग AWS credential verify गर्नुहोस् — inventory plugin ले AWS CLI जस्तै credential chain प्रयोग गर्छ; (3) extra diagnostic output को लागि inventory plugin YAML config मा `verbose: true` add गर्नुहोस्; (4) plugin config modify नगरी host variable को आधारमा custom group add गर्न dynamic inventory सँगसँगै `constructed` inventory plugin प्रयोग गर्नुहोस्। Common footgun: dynamic inventory ले default मा result **cache** गर्छ। तपाईंले भर्खर नयाँ instance launch गर्नुभयो तर देखिँदैन भने, inventory plugin config मा `cache_timeout` setting check गर्नुहोस् — testing को क्रममा `cache_timeout: 0` वा `cache: false` set गर्नुहोस् र काम भएपछि caching re-enable गर्नुहोस्। `cache_connection` directory मा stale cache file छ कि नाइँ पनि check गर्नुहोस्।",
        jp: "動的インベントリプラグインは外部 API（例：AWS EC2 API）を照会して Ansible が理解する特定の構造で JSON を返します：`{ \"_meta\": { \"hostvars\": { \"host1\": { \"var\": \"value\" } } }, \"groupname\": { \"hosts\": [\"host1\", \"host2\"], \"vars\": { \"group_var\": \"value\" } } }`。`_meta.hostvars` キーにはホストごとの変数が含まれ；`_meta` 以外の各トップレベルキーはグループ名です。`ansible-inventory -i <source> --list`（JSON 出力）または `--graph`（人間が読みやすいツリー）で任意のインベントリソースが何を返すかテストできます。動的インベントリが機能しない場合のデバッグ手順：(1) `ansible-inventory -i aws_ec2.yml --list` を直接実行して出力内の Python インポートエラーや AWS 認証情報エラーを探す；(2) `aws sts get-caller-identity` で AWS 認証情報を確認する — インベントリプラグインは AWS CLI と同じ認証情報チェーンを使用します；(3) 追加の診断出力のためにインベントリプラグインの YAML 設定に `verbose: true` を追加する；(4) プラグイン設定を変更せずにホスト変数に基づいてカスタムグループを追加するために動的インベントリと共に `constructed` インベントリプラグインを使用する。よくある落とし穴：動的インベントリはデフォルトで結果を**キャッシュ**します。新しいインスタンスを起動したばかりで表示されない場合は、インベントリプラグイン設定の `cache_timeout` を確認してください — テスト中は `cache_timeout: 0` または `cache: false` に設定して機能したらキャッシュを再有効化します。`cache_connection` ディレクトリに古いキャッシュファイルが存在しないかも確認してください。",
      },
      tag: {
        en: "dynamic inventory debugging",
        np: "dynamic inventory debugging",
        jp: "動的インベントリのデバッグ",
      },
    },
  ],
};
