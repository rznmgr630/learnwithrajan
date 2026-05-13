import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Without configuration management, servers drift. One admin SSHes in and installs packages manually, another tweaks a config file, a third changes a service setting — after months, no two servers are identical and nobody knows what changed when. This is called **configuration drift**. Ansible solves this with **idempotent automation**: you describe the desired state of a server in YAML, Ansible ensures reality matches that description every run. Run it once, run it a thousand times — the result is the same. There are three main approaches to configuration management: **imperative** (shell scripts — \"do this, then this\"), **declarative** (Ansible/Puppet/Chef — \"this is what the system should look like\"), and **immutable infrastructure** (Packer/container images — \"never modify running servers, replace them\"). Ansible sits firmly in the declarative camp but is less opinionated than Puppet or Chef.",
    np: "Configuration management बिना, server drift हुन्छ। एउटा admin ले SSH गरेर manually package install गर्छ, अर्कोले config file tweak गर्छ, तेस्रोले service setting change गर्छ — महिनाहरूपछि कुनै पनि दुईवटा server identical हुँदैन र कसलाई के कहिले change भयो थाहा हुँदैन। यसलाई **configuration drift** भनिन्छ। Ansible ले **idempotent automation** सँग यो solve गर्छ: तपाईंले YAML मा server को desired state describe गर्नुहुन्छ, Ansible ले हरेक run मा reality त्यो description सँग match गर्छ। एकचोटि run गर्नुहोस्, हजार चोटि run गर्नुहोस् — result उही हुन्छ। Configuration management को तीनवटा main approach छन्: **imperative** (shell script — \"यो गर, त्यसपछि यो\"), **declarative** (Ansible/Puppet/Chef — \"system यस्तो हुनुपर्छ\"), र **immutable infrastructure** (Packer/container image — \"running server कहिल्यै modify नगर, replace गर\")। Ansible declarative camp मा छ तर Puppet वा Chef भन्दा कम opinionated छ।",
    jp: "構成管理なしではサーバーがドリフトします。ある管理者が SSH でログインして手動でパッケージをインストールし、別の管理者が設定ファイルを調整し、3 人目がサービス設定を変更すると — 数ヶ月後には 2 台として同一のサーバーがなく、誰も何がいつ変更されたか分かりません。これを**コンフィギュレーションドリフト**と呼びます。Ansible は**冪等な自動化**でこれを解決します：サーバーの望ましい状態を YAML で記述し、Ansible は毎回の実行で現実がその記述と一致するよう保証します。1 回実行しても 1000 回実行しても結果は同じです。構成管理には主に 3 つのアプローチがあります：**命令型**（シェルスクリプト — 「これをして、次にこれをして」）、**宣言型**（Ansible/Puppet/Chef — 「システムはこうあるべき」）、**イミュータブルインフラ**（Packer/コンテナイメージ — 「実行中のサーバーは変更せず交換する」）。Ansible は明確に宣言型の陣営に属しますが、Puppet や Chef ほど独断的ではありません。",
  } as const,
  o2: {
    en: "What makes Ansible stand out is its **agentless** design: Ansible connects over SSH (or WinRM for Windows) — no daemon to install on managed nodes, no extra ports to open beyond SSH. Compare this to Puppet or Chef which require an agent process running on every managed node. Ansible also uses a **push model**: the control node pushes state to targets on demand (vs Puppet's pull model where agents check in periodically). **Human-readable YAML** playbooks read like documentation — new team members understand what a playbook does without deep Ansible expertise. The **ecosystem** is vast: 5000+ modules in Ansible Galaxy covering AWS, Azure, GCP, Docker, Kubernetes, databases, and network devices. Key components to know: **control node** (the machine where Ansible runs), **managed nodes** (the servers Ansible configures), **inventory** (a file listing managed nodes and groups), **playbook** (a YAML file containing a set of tasks), **module** (a unit of work — `apt`, `copy`, `service`, `template`), and **task** (a single module call with parameters).",
    np: "Ansible लाई अलग बनाउने यसको **agentless** design हो: Ansible SSH (वा Windows को लागि WinRM) मार्फत connect गर्छ — managed node मा daemon install गर्न पर्दैन, SSH बाहेक extra port open गर्न पर्दैन। यसलाई Puppet वा Chef सँग compare गर्नुहोस् जसलाई हरेक managed node मा agent process running आवश्यक छ। Ansible ले **push model** पनि प्रयोग गर्छ: control node ले demand मा target मा state push गर्छ (Puppet को pull model भन्दा फरक जहाँ agent हरू periodically check in गर्छन्)। **Human-readable YAML** playbook ले documentation जस्तै read हुन्छ — नयाँ team member ले deep Ansible expertise बिना playbook के गर्छ बुझ्न सक्छ। **Ecosystem** vast छ: AWS, Azure, GCP, Docker, Kubernetes, database, र network device cover गर्ने Ansible Galaxy मा 5000+ module। जान्न आवश्यक key component: **control node** (Ansible run हुने machine), **managed node** (Ansible ले configure गर्ने server), **inventory** (managed node र group list गर्ने file), **playbook** (task set भएको YAML file), **module** (काम को unit — `apt`, `copy`, `service`, `template`), र **task** (parameter सहित एउटा module call)।",
    jp: "Ansible を際立たせるのはその**エージェントレス**設計です：Ansible は SSH（または Windows の場合 WinRM）で接続します — 管理対象ノードにデーモンをインストールする必要がなく、SSH 以外の追加ポートを開く必要もありません。すべての管理対象ノードでエージェントプロセスを実行する必要がある Puppet や Chef と比べてみてください。Ansible は**プッシュモデル**も使用します：コントロールノードはオンデマンドでターゲットに状態をプッシュします（エージェントが定期的にチェックインする Puppet のプルモデルとは対照的）。**人間が読める YAML** のプレイブックはドキュメントのように読めます — 新しいチームメンバーは深い Ansible の専門知識なしにプレイブックが何をするか理解できます。**エコシステム**は広大です：AWS・Azure・GCP・Docker・Kubernetes・データベース・ネットワークデバイスをカバーする Ansible Galaxy の 5000 以上のモジュール。知っておくべき主要コンポーネント：**コントロールノード**（Ansible が実行するマシン）、**管理対象ノード**（Ansible が設定するサーバー）、**インベントリ**（管理対象ノードとグループを一覧にするファイル）、**プレイブック**（タスクのセットを含む YAML ファイル）、**モジュール**（作業の単位 — `apt`・`copy`・`service`・`template`）、**タスク**（パラメーター付きの単一モジュール呼び出し）。",
  } as const,
};

export const DEVOPS_DAY_71_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Configuration management approaches & Ansible architecture",
        np: "Configuration management approach र Ansible architecture",
        jp: "構成管理アプローチと Ansible アーキテクチャ",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-arch" },
        {
          type: "table",
          caption: {
            en: "Configuration management tools — Ansible vs Puppet vs Chef vs Salt",
            np: "Configuration management tool — Ansible vs Puppet vs Chef vs Salt",
            jp: "構成管理ツール比較 — Ansible vs Puppet vs Chef vs Salt",
          },
          headers: [
            { en: "Feature", np: "Feature", jp: "機能" },
            { en: "Ansible", np: "Ansible", jp: "Ansible" },
            { en: "Puppet", np: "Puppet", jp: "Puppet" },
            { en: "Chef", np: "Chef", jp: "Chef" },
            { en: "Salt", np: "Salt", jp: "Salt" },
          ],
          rows: [
            [
              { en: "Agent required", np: "Agent आवश्यक", jp: "エージェント必要" },
              { en: "No — agentless (SSH)", np: "No — agentless (SSH)", jp: "不要 — エージェントレス（SSH）" },
              { en: "Yes — puppet agent on each node", np: "Yes — हरेक node मा puppet agent", jp: "必要 — 各ノードに puppet agent" },
              { en: "Yes — chef-client on each node", np: "Yes — हरेक node मा chef-client", jp: "必要 — 各ノードに chef-client" },
              { en: "Optional — agentless mode available", np: "Optional — agentless mode available", jp: "任意 — エージェントレスモードあり" },
            ],
            [
              { en: "Model", np: "Model", jp: "モデル" },
              { en: "Push (control node → targets)", np: "Push (control node → target)", jp: "プッシュ（コントロールノード → ターゲット）" },
              { en: "Pull (agents check in every 30 min)", np: "Pull (agent हरू हर 30 min check in)", jp: "プル（エージェントが 30 分ごとにチェックイン）" },
              { en: "Pull", np: "Pull", jp: "プル" },
              { en: "Push and pull", np: "Push र pull दुवै", jp: "プッシュとプル両方" },
            ],
            [
              { en: "Language", np: "Language", jp: "言語" },
              { en: "YAML (playbooks)", np: "YAML (playbook)", jp: "YAML（プレイブック）" },
              { en: "Puppet DSL", np: "Puppet DSL", jp: "Puppet DSL" },
              { en: "Ruby (recipes)", np: "Ruby (recipe)", jp: "Ruby（レシピ）" },
              { en: "YAML/Jinja2 (states)", np: "YAML/Jinja2 (state)", jp: "YAML/Jinja2（ステート）" },
            ],
            [
              { en: "Learning curve", np: "Learning curve", jp: "学習曲線" },
              { en: "Low — YAML, minimal concepts", np: "Low — YAML, minimal concept", jp: "低い — YAML・最小限の概念" },
              { en: "High — DSL + catalog compilation", np: "High — DSL + catalog compilation", jp: "高い — DSL + カタログコンパイル" },
              { en: "High — Ruby knowledge needed", np: "High — Ruby knowledge आवश्यक", jp: "高い — Ruby の知識が必要" },
              { en: "Medium", np: "Medium", jp: "中程度" },
            ],
            [
              { en: "Best for", np: "Best for", jp: "最適な用途" },
              { en: "General automation, cloud provisioning, ad-hoc tasks", np: "General automation, cloud provisioning, ad-hoc task", jp: "一般的な自動化・クラウドプロビジョニング・アドホックタスク" },
              { en: "Large fleets, enforced compliance", np: "Large fleet, enforced compliance", jp: "大規模フリート・強制コンプライアンス" },
              { en: "Dev teams comfortable with Ruby", np: "Ruby मा comfortable dev team", jp: "Ruby に慣れた開発チーム" },
              { en: "Large scale, event-driven automation", np: "Large scale, event-driven automation", jp: "大規模・イベント駆動型自動化" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Installing Ansible & your first playbook",
        np: "Ansible install गर्ने र पहिलो playbook",
        jp: "Ansible のインストールと最初のプレイブック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Ansible installation, inventory setup & first playbook",
            np: "Ansible installation, inventory setup र पहिलो playbook",
            jp: "Ansible インストール・インベントリ設定・最初のプレイブック",
          },
          code: `# ── Install Ansible ───────────────────────────────────────────────
pip3 install ansible              # any platform (recommended)
sudo apt install ansible -y       # Ubuntu/Debian
brew install ansible              # macOS

# ── Verify installation ───────────────────────────────────────────
ansible --version
# ansible [core 2.17.x]
#   config file = /etc/ansible/ansible.cfg
#   python version = 3.x.x
#   jinja version = 3.x.x

# ── Basic inventory file (INI format): inventory.ini ─────────────
[webservers]
web1.example.com ansible_user=ubuntu ansible_port=22
web2.example.com ansible_user=ubuntu

[dbservers]
db1.example.com ansible_user=admin

[webservers:vars]
ansible_python_interpreter=/usr/bin/python3

# ── Test connectivity (ping all managed nodes) ────────────────────
ansible all -i inventory.ini -m ping
ansible webservers -i inventory.ini -m ping
# Expected output per host:
# web1.example.com | SUCCESS => { "ping": "pong" }

# ── Ad-hoc commands ───────────────────────────────────────────────
ansible all -i inventory.ini -m command -a "uptime"
ansible all -m shell -a "df -h"
ansible webservers -m shell -a "free -m"

# ── First playbook: site.yml ──────────────────────────────────────
# ---
# - name: Configure webservers
#   hosts: webservers
#   become: yes                 # escalate to sudo
#
#   tasks:
#     - name: Ensure nginx is installed
#       apt:
#         name: nginx
#         state: present        # present = installed, absent = removed
#         update_cache: yes
#
#     - name: Ensure nginx is started and enabled
#       service:
#         name: nginx
#         state: started        # started = running
#         enabled: yes          # enabled = starts on boot

# ── Run the playbook ──────────────────────────────────────────────
ansible-playbook -i inventory.ini site.yml

# Dry run — show what WOULD change, without applying
ansible-playbook -i inventory.ini site.yml --check

# Diff mode — show file content changes
ansible-playbook -i inventory.ini site.yml --diff

# ── Ansible configuration file: ansible.cfg ──────────────────────
# [defaults]
# inventory         = ./inventory.ini
# remote_user       = ubuntu
# host_key_checking = False          # skip SSH host key prompt (dev only)
# retry_files_enabled = False
#
# [privilege_escalation]
# become      = True
# become_method = sudo
# become_user   = root`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Install Ansible and test against localhost. Create an inventory file with `[local]\\nlocalhost ansible_connection=local`. Run `ansible local -m ping` — you should see `pong`. Then run `ansible local -m setup | grep -A2 '\"ansible_distribution\"'` to see what Ansible discovers about your system automatically. This is the `setup` module (facts gathering) that runs automatically at the start of every playbook. Explore other facts: `ansible_os_family`, `ansible_memtotal_mb`, `ansible_processor_cores`.",
              np: "Ansible install गर्नुहोस् र localhost मा test गर्नुहोस्। `[local]\\nlocalhost ansible_connection=local` सहित inventory file create गर्नुहोस्। `ansible local -m ping` run गर्नुहोस् — `pong` देख्नुपर्छ। त्यसपछि `ansible local -m setup | grep -A2 '\"ansible_distribution\"'` run गर्नुहोस् र Ansible ले तपाईंको system बारे automatically के discover गर्छ हेर्नुहोस्। यो `setup` module (facts gathering) हो जो हरेक playbook को सुरुमा automatically run हुन्छ। अरू fact explore गर्नुहोस्: `ansible_os_family`, `ansible_memtotal_mb`, `ansible_processor_cores`।",
              jp: "Ansible をインストールして localhost に対してテストする。`[local]\\nlocalhost ansible_connection=local` でインベントリファイルを作成する。`ansible local -m ping` を実行する — `pong` が表示されるはず。次に `ansible local -m setup | grep -A2 '\"ansible_distribution\"'` を実行して Ansible がシステムについて自動的に何を検出するか確認する。これはすべてのプレイブックの開始時に自動的に実行される `setup` モジュール（ファクト収集）です。他のファクトも探索する：`ansible_os_family`・`ansible_memtotal_mb`・`ansible_processor_cores`。",
            },
            {
              en: "Write a playbook that ensures a directory `/tmp/ansible-test/` exists (use the `file` module with `state: directory`), copies a file into it (use the `copy` module with `content:` to write inline text), and installs a package (use `apt`/`brew`/`dnf` depending on your OS). Run with `--check` first to see what would change, then without `--check` to apply. Run it a second time and observe `changed=0` — idempotency in action.",
              np: "`/tmp/ansible-test/` directory exist गर्छ ensure गर्ने playbook लेख्नुहोस् (`state: directory` सहित `file` module प्रयोग), file copy गर्ने (`content:` सहित `copy` module प्रयोग गरेर inline text लेख्न), र package install गर्ने (तपाईंको OS अनुसार `apt`/`brew`/`dnf` प्रयोग)। के change हुनेछ हेर्न पहिले `--check` सहित run गर्नुहोस्, त्यसपछि apply गर्न बिना `--check` run गर्नुहोस्। दोस्रो चोटि run गर्नुहोस् र `changed=0` observe गर्नुहोस् — idempotency in action।",
              jp: "ディレクトリ `/tmp/ansible-test/` が存在することを確認するプレイブックを書く（`state: directory` で `file` モジュールを使用）、そこにファイルをコピーする（`content:` でインラインテキストを書く `copy` モジュールを使用）、パッケージをインストールする（OS に応じて `apt`/`brew`/`dnf` を使用）。まず `--check` で実行して何が変更されるか確認し、次に `--check` なしで適用する。2 回目に実行して `changed=0` を観察する — 冪等性の実証。",
            },
            {
              en: "Deliberately introduce a failure: write a playbook task that tries to start a service that doesn't exist (`service: name=nonexistent state=started`). Run it and observe the error output, the failed task name, and `fatal: [localhost]`. Then fix the error and re-run. Understand the `--start-at-task` flag: `ansible-playbook site.yml --start-at-task \"task name\"` — useful for resuming after a partial failure without re-running tasks that already succeeded.",
              np: "Deliberately failure introduce गर्नुहोस्: exist नगर्ने service start गर्न try गर्ने playbook task लेख्नुहोस् (`service: name=nonexistent state=started`)। Run गर्नुहोस् र error output, failed task name, र `fatal: [localhost]` observe गर्नुहोस्। त्यसपछि error fix गर्नुहोस् र re-run गर्नुहोस्। `--start-at-task` flag बुझ्नुहोस्: `ansible-playbook site.yml --start-at-task \"task name\"` — partial failure पछि already succeed भएका task re-run नगरी resume गर्न useful।",
              jp: "意図的に失敗を導入する：存在しないサービスを起動しようとするプレイブックタスクを書く（`service: name=nonexistent state=started`）。実行してエラー出力・失敗したタスク名・`fatal: [localhost]` を観察する。次にエラーを修正して再実行する。`--start-at-task` フラグを理解する：`ansible-playbook site.yml --start-at-task \"task name\"` — すでに成功したタスクを再実行せずに部分的な失敗後に再開するのに便利。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is idempotency and why does Ansible rely on it?",
        np: "Idempotency के हो र Ansible ले यसमा किन rely गर्छ?",
        jp: "冪等性とは何か、なぜ Ansible はそれに依存するのか？",
      },
      answer: {
        en: "Idempotency means running an operation multiple times produces the same result as running it once. In Ansible, if a task says \"ensure nginx is installed,\" it checks: is nginx already installed? If yes, report `ok` (no change). If no, install it and report `changed`. This is fundamentally different from a shell script that runs `apt install nginx` regardless — the second run would be a no-op or an error. Why it matters: (1) **safe re-runs** — if a playbook fails halfway, fix the issue and re-run from the start without fear of breaking things that already succeeded; (2) **drift correction** — run the playbook on a schedule (via cron or AWX/Tower) to continuously enforce desired state; (3) **auditable** — `changed=0` means the system matches your playbook exactly; any changes mean something drifted. Not all Ansible modules are idempotent — the `command` and `shell` modules run every time (they can't know if a shell command's effect already exists). Use `creates:` or `when:` conditions to make shell tasks idempotent.",
        np: "Idempotency को मतलब एउटा operation multiple times run गर्दा एकचोटि run गरे जस्तै result हुन्छ। Ansible मा, कुनै task ले \"nginx installed छ ensure गर\" भन्यो भने, यसले check गर्छ: nginx already installed छ? छ भने, `ok` report गर्छ (no change)। छैन भने, install गर्छ र `changed` report गर्छ। यो `apt install nginx` blindly run गर्ने shell script भन्दा fundamentally different छ — दोस्रो run no-op वा error हुनेछ। किन important छ: (1) **safe re-run** — playbook half way fail भयो भने, issue fix गर्नुहोस् र already succeed भएका कुरा break गर्ने डर बिना सुरुबाट re-run गर्नुहोस्; (2) **drift correction** — desired state continuously enforce गर्न schedule मा playbook run गर्नुहोस् (cron वा AWX/Tower मार्फत); (3) **auditable** — `changed=0` को मतलब system ले playbook सँग exactly match गर्छ; कुनै change को मतलब केही drift भयो। सबै Ansible module idempotent छैनन् — `command` र `shell` module हरेक पटक run हुन्छन् (shell command को effect already exist गर्छ कि गर्दैन थाहा हुँदैन)। Shell task लाई idempotent बनाउन `creates:` वा `when:` condition प्रयोग गर्नुहोस्।",
        jp: "冪等性とは、ある操作を複数回実行しても 1 回実行したのと同じ結果が得られることを意味します。Ansible では、タスクが「nginx がインストールされていることを確認する」と言った場合、nginx はすでにインストールされているかチェックします。されていれば `ok` を報告（変更なし）。されていなければインストールして `changed` を報告します。これは `apt install nginx` を無条件に実行するシェルスクリプトとは根本的に異なります — 2 回目の実行は何もしないか、エラーになります。なぜ重要か：(1) **安全な再実行** — プレイブックが途中で失敗した場合、問題を修正してすでに成功したことを壊す心配なく最初から再実行できる；(2) **ドリフト修正** — cron または AWX/Tower を通じてスケジュールでプレイブックを実行し望ましい状態を継続的に強制する；(3) **監査可能** — `changed=0` はシステムがプレイブックと完全に一致することを意味し、変更があれば何かがドリフトしたことを示す。すべての Ansible モジュールが冪等というわけではありません — `command` と `shell` モジュールは毎回実行されます（シェルコマンドの効果がすでに存在するか分からないため）。`creates:` または `when:` 条件を使ってシェルタスクを冪等にしてください。",
      },
      tag: { en: "idempotency", np: "Idempotency", jp: "冪等性" },
    },
    {
      question: {
        en: "What is the difference between `command`, `shell`, and `raw` modules in Ansible?",
        np: "Ansible मा `command`, `shell`, र `raw` module बीचको फरक के हो?",
        jp: "Ansible の `command`・`shell`・`raw` モジュールの違いは何か？",
      },
      answer: {
        en: "All three run commands on remote hosts but differ in how they do it. **`command`** runs a command directly without a shell — no pipes (`|`), redirects (`>`), environment variable expansion (`$VAR`), or glob expansion (`*.txt`). Faster and safer (no shell injection risk). Use for simple commands: `ansible all -m command -a \"uptime\"`. **`shell`** runs the command through `/bin/sh` — supports pipes, redirects, variables, and globs. Use when you need shell features: `ansible all -m shell -a \"cat /etc/os-release | grep ID\"`. Security note: avoid passing user-supplied input to shell. **`raw`** sends the command over SSH without any Python module framework — works even if Python isn't installed on the target (useful for bootstrapping minimal systems or network devices). Rule of thumb: prefer dedicated modules (`apt`, `yum`, `copy`, `file`) over command/shell — they're idempotent and work cross-platform. Fall back to `shell` when no module exists for your use case. Never use `raw` unless you're bootstrapping a host with no Python.",
        np: "तीनैले remote host मा command run गर्छन् तर गर्ने तरिका फरक छ। **`command`** ले shell बिना directly command run गर्छ — pipe (`|`), redirect (`>`), environment variable expansion (`$VAR`), वा glob expansion (`*.txt`) छैन। Faster र safer (shell injection risk छैन)। Simple command को लागि प्रयोग: `ansible all -m command -a \"uptime\"`। **`shell`** ले `/bin/sh` मार्फत command run गर्छ — pipe, redirect, variable, र glob support गर्छ। Shell feature चाहिँदा प्रयोग: `ansible all -m shell -a \"cat /etc/os-release | grep ID\"`। Security note: shell मा user-supplied input pass गर्न avoid गर्नुहोस्। **`raw`** ले Python module framework बिना SSH मार्फत command send गर्छ — target मा Python install नभएता पनि काम गर्छ (minimal system वा network device bootstrap गर्न useful)। Rule of thumb: command/shell भन्दा dedicated module (`apt`, `yum`, `copy`, `file`) prefer गर्नुहोस् — ती idempotent र cross-platform हुन्छन्। Use case को लागि कुनै module नभएमा `shell` मा fall back गर्नुहोस्। Python नभएको host bootstrap गर्दा बाहेक `raw` कहिल्यै प्रयोग नगर्नुहोस्।",
        jp: "3 つとも remote ホストでコマンドを実行しますが、方法が異なります。**`command`** はシェルなしで直接コマンドを実行します — パイプ（`|`）・リダイレクト（`>`）・環境変数展開（`$VAR`）・グロブ展開（`*.txt`）はなし。より高速で安全（シェルインジェクションリスクなし）。シンプルなコマンドに使用：`ansible all -m command -a \"uptime\"`。**`shell`** は `/bin/sh` を通じてコマンドを実行します — パイプ・リダイレクト・変数・グロブをサポート。シェル機能が必要なときに使用：`ansible all -m shell -a \"cat /etc/os-release | grep ID\"`。セキュリティ注意：ユーザー入力をシェルに渡すのは避けること。**`raw`** は Python モジュールフレームワークなしで SSH 経由でコマンドを送信します — ターゲットに Python がインストールされていなくても動作します（最小システムやネットワークデバイスのブートストラップに便利）。経験則：command/shell より専用モジュール（`apt`・`yum`・`copy`・`file`）を優先する — 冪等でクロスプラットフォームで動作する。ユースケースにモジュールが存在しない場合は `shell` にフォールバック。Python のないホストをブートストラップするとき以外は `raw` は使わないこと。",
      },
      tag: { en: "command vs shell vs raw", np: "command vs shell vs raw", jp: "command vs shell vs raw" },
    },
  ],
};
