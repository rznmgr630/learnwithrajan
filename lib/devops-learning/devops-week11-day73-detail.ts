import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Ad-hoc commands** are one-liner Ansible commands that run a single task on managed hosts without writing a playbook. Syntax: `ansible <pattern> -m <module> -a \"<args>\" -i <inventory>`. Ad-hoc commands are for quick, one-off tasks: check if a service is running, grab a file from a server, restart a process, gather facts. They are not for complex multi-step automation — that is what playbooks are for. The most important flags: `-m` (module name to run), `-a` (module arguments as a key=value string), `-b`/`--become` (run as root via sudo), `-u` (remote user to connect as), `-k` (ask SSH password interactively), `-K` (ask become/sudo password), `--check` (dry-run mode — shows what would change without changing it), `--diff` (show file diffs when a file would be modified), `-f` (forks — number of hosts to run against in parallel, default 5), `-v/-vv/-vvv` (verbosity levels — more `v`s reveal more connection and module debug output).",
    np: "**Ad-hoc command** हरू one-liner Ansible command हुन् जसले playbook नलेखी managed host मा single task run गर्छन्। Syntax: `ansible <pattern> -m <module> -a \"<args>\" -i <inventory>`। Ad-hoc command quick, one-off task को लागि हुन्: service running छ कि छैन check गर्न, server बाट file लिन, process restart गर्न, facts gather गर्न। Complex multi-step automation को लागि यो प्रयोग हुँदैन — त्यसको लागि playbook छ। सबैभन्दा important flag: `-m` (run गर्न module name), `-a` (key=value string को रूपमा module argument), `-b`/`--become` (sudo मार्फत root को रूपमा run), `-u` (connect गर्ने remote user), `-k` (interactively SSH password माग्ने), `-K` (become/sudo password माग्ने), `--check` (dry-run mode — बिना change गरे के change हुनेथियो show गर्छ), `--diff` (file modify हुने भए file diff show), `-f` (fork — parallel मा कतिवटा host मा run गर्ने, default 5), `-v/-vv/-vvv` (verbosity level — बढी `v` ले बढी connection र module debug output reveal गर्छ)।",
    jp: "**アドホックコマンド**はプレイブックを書かずに管理ホストで単一タスクを実行する 1 行の Ansible コマンドです。構文：`ansible <pattern> -m <module> -a \"<args>\" -i <inventory>`。アドホックコマンドはクイックな一回限りのタスク向けです：サービスが動いているか確認する・サーバーからファイルを取得する・プロセスを再起動する・ファクトを収集する。複雑なマルチステップの自動化には使いません — それはプレイブックの役割です。最重要フラグ：`-m`（実行するモジュール名）、`-a`（key=value 文字列のモジュール引数）、`-b`/`--become`（sudo 経由で root として実行）、`-u`（接続するリモートユーザー）、`-k`（SSH パスワードを対話的に要求）、`-K`（become/sudo パスワードを要求）、`--check`（ドライランモード — 変更せずに何が変わるかを表示）、`--diff`（ファイルが変更される場合にファイル差分を表示）、`-f`（フォーク数 — 並列で実行するホスト数、デフォルト 5）、`-v/-vv/-vvv`（詳細レベル — `v` が多いほど接続とモジュールのデバッグ出力を多く表示）。",
  } as const,
  o2: {
    en: "Ansible's **module ecosystem** contains 5000+ modules organized into collections. The core modules every DevOps engineer needs: **package management** (`apt`, `yum`, `dnf`, `package` — cross-platform abstraction), **file operations** (`copy` to push files to remote hosts, `fetch` to pull files back, `file` to manage state, `template` to render Jinja2 templates, `lineinfile` to ensure a specific line exists, `blockinfile` to manage a block of lines), **services** (`service` for SysV/systemd, `systemd` for fine-grained systemd control), **users** (`user`, `group`), **commands** (`command` for safe single commands, `shell` when you need pipes/redirects, `script` to run a local script on remote hosts), **system facts** (`setup` — gathers 500+ facts about the target host), **network** (`uri` for HTTP calls and health checks, `get_url` for file downloads), **cloud** (hundreds of AWS/GCP/Azure modules under `amazon.aws`, `google.cloud`, `azure.azcollection`). Modules are **idempotent** — they check current state before acting, so running the same module twice produces the same result without side effects. View any module's documentation and examples without internet access: `ansible-doc <module>`.",
    np: "Ansible को **module ecosystem** मा collection मा organize गरिएका 5000+ module छन्। हरेक DevOps engineer लाई चाहिने core module: **package management** (`apt`, `yum`, `dnf`, `package` — cross-platform abstraction), **file operations** (`copy` remote host मा file push गर्न, `fetch` file फिर्ता pull गर्न, `file` state manage गर्न, `template` Jinja2 template render गर्न, `lineinfile` specific line छ भनी ensure गर्न, `blockinfile` lines को block manage गर्न), **service** (`service` SysV/systemd को लागि, `systemd` fine-grained systemd control), **user** (`user`, `group`), **command** (`command` safe single command, `shell` pipe/redirect चाहिँदा, `script` local script remote host मा run गर्न), **system fact** (`setup` — target host को बारेमा 500+ fact gather गर्छ), **network** (`uri` HTTP call र health check, `get_url` file download), **cloud** (`amazon.aws`, `google.cloud`, `azure.azcollection` अन्तर्गत hundreds of AWS/GCP/Azure module)। Module **idempotent** हुन्छन् — act गर्नुअघि current state check गर्छन्, त्यसैले same module दुईपटक run गर्दा side effect बिना same result दिन्छ। Internet access बिना कुनै पनि module को documentation र example हेर्न: `ansible-doc <module>`।",
    jp: "Ansible の**モジュールエコシステム**にはコレクションに整理された 5000 以上のモジュールがあります。すべての DevOps エンジニアに必要なコアモジュール：**パッケージ管理**（`apt`・`yum`・`dnf`・`package` — クロスプラットフォーム抽象化）、**ファイル操作**（`copy` でリモートホストにファイルをプッシュ・`fetch` でファイルを引き戻す・`file` で状態を管理・`template` で Jinja2 テンプレートをレンダリング・`lineinfile` で特定の行の存在を確保・`blockinfile` で行のブロックを管理）、**サービス**（`service` で SysV/systemd・`systemd` できめ細かい systemd 制御）、**ユーザー**（`user`・`group`）、**コマンド**（`command` で安全な単一コマンド・`shell` でパイプ/リダイレクトが必要なとき・`script` でローカルスクリプトをリモートホストで実行）、**システムファクト**（`setup` — ターゲットホストについて 500 以上のファクトを収集）、**ネットワーク**（`uri` で HTTP 呼び出しとヘルスチェック・`get_url` でファイルダウンロード）、**クラウド**（`amazon.aws`・`google.cloud`・`azure.azcollection` 配下の数百の AWS/GCP/Azure モジュール）。モジュールは**冪等**です — 実行前に現在の状態を確認するため、同じモジュールを 2 回実行しても副作用なく同じ結果が得られます。インターネットアクセスなしでモジュールのドキュメントと例を表示：`ansible-doc <module>`。",
  } as const,
};

export const DEVOPS_DAY_73_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Core modules — package, file, service & system management",
        np: "Core module — package, file, service र system management",
        jp: "コアモジュール — パッケージ・ファイル・サービス・システム管理",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-adhoc" },
        {
          type: "table",
          caption: {
            en: "Essential Ansible modules — what each does & key parameters",
            np: "Essential Ansible module — हरेकले के गर्छ र key parameter",
            jp: "必須 Ansible モジュール — それぞれの機能とキーパラメーター",
          },
          headers: [
            { en: "Module", np: "Module", jp: "モジュール" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Key parameters", np: "Key parameter", jp: "キーパラメーター" },
            { en: "Idempotent", np: "Idempotent", jp: "冪等性" },
          ],
          rows: [
            [
              { en: "`apt`", np: "`apt`", jp: "`apt`" },
              { en: "Install/remove/update packages (Debian/Ubuntu)", np: "Package install/remove/update (Debian/Ubuntu)", jp: "パッケージのインストール/削除/更新（Debian/Ubuntu）" },
              { en: "`name`, `state` (present/absent/latest), `update_cache`", np: "`name`, `state` (present/absent/latest), `update_cache`", jp: "`name`・`state`（present/absent/latest）・`update_cache`" },
              { en: "Yes — checks if already installed", np: "Yes — already installed छ कि check", jp: "あり — インストール済みか確認" },
            ],
            [
              { en: "`copy`", np: "`copy`", jp: "`copy`" },
              { en: "Copy files to remote hosts", np: "Remote host मा file copy", jp: "リモートホストにファイルをコピー" },
              { en: "`src`, `dest`, `owner`, `group`, `mode`, `content` (inline text)", np: "`src`, `dest`, `owner`, `group`, `mode`, `content` (inline text)", jp: "`src`・`dest`・`owner`・`group`・`mode`・`content`（インラインテキスト）" },
              { en: "Yes — checks checksum", np: "Yes — checksum check", jp: "あり — チェックサムを確認" },
            ],
            [
              { en: "`template`", np: "`template`", jp: "`template`" },
              { en: "Render Jinja2 template and copy to remote", np: "Jinja2 template render गरेर remote मा copy", jp: "Jinja2 テンプレートをレンダリングしてリモートにコピー" },
              { en: "`src` (.j2 file), `dest`, `owner`, `mode`", np: "`src` (.j2 file), `dest`, `owner`, `mode`", jp: "`src`（.j2 ファイル）・`dest`・`owner`・`mode`" },
              { en: "Yes — checks rendered content", np: "Yes — rendered content check", jp: "あり — レンダリングされたコンテンツを確認" },
            ],
            [
              { en: "`file`", np: "`file`", jp: "`file`" },
              { en: "Manage file/directory state", np: "File/directory state manage", jp: "ファイル/ディレクトリの状態を管理" },
              { en: "`path`, `state` (file/directory/link/absent), `owner`, `mode`", np: "`path`, `state` (file/directory/link/absent), `owner`, `mode`", jp: "`path`・`state`（file/directory/link/absent）・`owner`・`mode`" },
              { en: "Yes", np: "Yes", jp: "あり" },
            ],
            [
              { en: "`service`", np: "`service`", jp: "`service`" },
              { en: "Control system services", np: "System service control", jp: "システムサービスを制御" },
              { en: "`name`, `state` (started/stopped/restarted/reloaded), `enabled`", np: "`name`, `state` (started/stopped/restarted/reloaded), `enabled`", jp: "`name`・`state`（started/stopped/restarted/reloaded）・`enabled`" },
              { en: "Yes", np: "Yes", jp: "あり" },
            ],
            [
              { en: "`lineinfile`", np: "`lineinfile`", jp: "`lineinfile`" },
              { en: "Ensure a line is present/absent in a file", np: "File मा line present/absent छ ensure", jp: "ファイル内の行の存在/不在を確保" },
              { en: "`path`, `line`, `regexp`, `state`, `insertafter`", np: "`path`, `line`, `regexp`, `state`, `insertafter`", jp: "`path`・`line`・`regexp`・`state`・`insertafter`" },
              { en: "Yes — uses regexp to avoid duplicates", np: "Yes — duplicate avoid गर्न regexp प्रयोग", jp: "あり — 重複を避けるために regexp を使用" },
            ],
            [
              { en: "`user`", np: "`user`", jp: "`user`" },
              { en: "Manage user accounts", np: "User account manage", jp: "ユーザーアカウントを管理" },
              { en: "`name`, `state`, `uid`, `groups`, `shell`, `home`, `password`", np: "`name`, `state`, `uid`, `groups`, `shell`, `home`, `password`", jp: "`name`・`state`・`uid`・`groups`・`shell`・`home`・`password`" },
              { en: "Yes", np: "Yes", jp: "あり" },
            ],
            [
              { en: "`uri`", np: "`uri`", jp: "`uri`" },
              { en: "Make HTTP requests (health checks, webhooks)", np: "HTTP request गर्ने (health check, webhook)", jp: "HTTP リクエストを行う（ヘルスチェック・Webhook）" },
              { en: "`url`, `method`, `body`, `headers`, `status_code`", np: "`url`, `method`, `body`, `headers`, `status_code`", jp: "`url`・`method`・`body`・`headers`・`status_code`" },
              { en: "Yes (with `creates`)", np: "Yes (`creates` सहित)", jp: "あり（`creates` を使用時）" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Ad-hoc commands — real-world patterns",
        np: "Ad-hoc command — real-world pattern",
        jp: "アドホックコマンド — 実践的なパターン",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Ad-hoc commands — facts, packages, files, services & troubleshooting",
            np: "Ad-hoc command — fact, package, file, service र troubleshooting",
            jp: "アドホックコマンド — ファクト・パッケージ・ファイル・サービス・トラブルシューティング",
          },
          code: `# ── Basic syntax and help ─────────────────────────────────────────
ansible --help                                   # list all flags
ansible-doc apt                                  # view apt module docs & examples
ansible-doc -l | grep aws                        # list all AWS-related modules

# ── Facts gathering ───────────────────────────────────────────────
ansible all -m setup                             # gather ALL facts from all hosts
ansible all -m setup -a "filter=ansible_distribution*"   # filter by OS info
ansible all -m setup -a "filter=ansible_memtotal_mb"     # RAM in MB only

# ── Package management ────────────────────────────────────────────
ansible webservers -m apt -a "name=nginx state=present update_cache=yes" -b
ansible webservers -m apt -a "name=nginx state=latest" -b    # upgrade to latest
ansible webservers -m apt -a "name=nginx state=absent" -b    # remove package

# ── File operations ───────────────────────────────────────────────
# Copy inline content to a remote file
ansible all -m copy -a "content='Hello World' dest=/tmp/hello.txt mode=0644"

# Fetch a remote file back to the control node (preserves host directory structure)
ansible all -m fetch -a "src=/var/log/nginx/error.log dest=./logs/ flat=no"

# Create a directory with correct ownership
ansible all -m file -a "path=/opt/app state=directory owner=deploy mode=0755" -b

# ── Service management ────────────────────────────────────────────
ansible webservers -m service -a "name=nginx state=started enabled=yes" -b
ansible webservers -m service -a "name=nginx state=restarted" -b

# ── User management ───────────────────────────────────────────────
ansible all -m user -a "name=deploy shell=/bin/bash groups=sudo" -b

# ── System info ───────────────────────────────────────────────────
ansible all -m command -a "uptime"                          # safe: no shell
ansible all -m shell -a "df -h | grep -v tmpfs"            # needs shell for pipe
ansible all -m setup -a "filter=ansible_mounts"            # disk mount info

# ── Run a local script on remote hosts ───────────────────────────
ansible all -m script -a "/local/script.sh"

# ── Reboot hosts and wait for them to come back ──────────────────
ansible all -m reboot -a "reboot_timeout=300" -b

# ── Parallel execution with forks ────────────────────────────────
ansible all -f 20 -m ping                      # ping 20 hosts simultaneously`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Use ad-hoc commands to gather intelligence about your managed hosts. Run `ansible all -m setup -a \"filter=ansible_os_family\"` to get OS family. Then `ansible all -m setup -a \"filter=ansible_processor_vcpus\"` for CPU count, and `ansible all -m setup -a \"filter=ansible_memtotal_mb\"` for RAM. Finally, run `ansible all -m setup` (without filter) and pipe the output to a file: `ansible all -m setup > facts.json`. Open it and find the `ansible_default_ipv4` and `ansible_interfaces` keys — these are the facts you will use in templates later.",
              np: "Managed host को बारेमा intelligence gather गर्न ad-hoc command प्रयोग गर्नुहोस्। OS family पाउन `ansible all -m setup -a \"filter=ansible_os_family\"` run गर्नुहोस्। त्यसपछि CPU count को लागि `ansible all -m setup -a \"filter=ansible_processor_vcpus\"`, र RAM को लागि `ansible all -m setup -a \"filter=ansible_memtotal_mb\"`। अन्तमा, `ansible all -m setup` (filter बिना) run गर्नुहोस् र output file मा pipe गर्नुहोस्: `ansible all -m setup > facts.json`। खोल्नुहोस् र `ansible_default_ipv4` र `ansible_interfaces` key फेला पार्नुहोस् — यी fact हरू तपाईंले पछि template मा प्रयोग गर्नुहुनेछ।",
              jp: "アドホックコマンドを使って管理ホストについての情報を収集する。OS ファミリーを取得するために `ansible all -m setup -a \"filter=ansible_os_family\"` を実行する。次に CPU 数のために `ansible all -m setup -a \"filter=ansible_processor_vcpus\"`、RAM のために `ansible all -m setup -a \"filter=ansible_memtotal_mb\"` を実行する。最後に `ansible all -m setup`（フィルターなし）を実行してファイルにパイプする：`ansible all -m setup > facts.json`。ファイルを開いて `ansible_default_ipv4` と `ansible_interfaces` キーを見つける — これらが後でテンプレートで使用するファクトです。",
            },
            {
              en: "Perform a mini \"audit\" of a server using ad-hoc commands: (a) check if nginx is installed: `ansible webservers -m command -a \"which nginx\"`, (b) check if port 80 is listening: `ansible webservers -m shell -a \"ss -tlnp | grep :80\"`, (c) copy a config file to the server: `ansible webservers -m copy -a \"src=nginx.conf dest=/tmp/nginx.conf\"`, (d) check disk usage: `ansible webservers -m shell -a \"df -h /\"`. Add `-v` to any command that fails to get more verbose output and understand the error.",
              np: "Ad-hoc command प्रयोग गरेर server को mini \"audit\" perform गर्नुहोस्: (a) nginx installed छ कि check: `ansible webservers -m command -a \"which nginx\"`, (b) port 80 listening छ कि check: `ansible webservers -m shell -a \"ss -tlnp | grep :80\"`, (c) server मा config file copy: `ansible webservers -m copy -a \"src=nginx.conf dest=/tmp/nginx.conf\"`, (d) disk usage check: `ansible webservers -m shell -a \"df -h /\"`। Fail हुने कुनै command मा `-v` add गर्नुहोस् थप verbose output पाउन र error बुझ्न।",
              jp: "アドホックコマンドを使ってサーバーのミニ「監査」を実施する：(a) nginx がインストールされているか確認：`ansible webservers -m command -a \"which nginx\"`、(b) ポート 80 がリッスンしているか確認：`ansible webservers -m shell -a \"ss -tlnp | grep :80\"`、(c) サーバーに設定ファイルをコピー：`ansible webservers -m copy -a \"src=nginx.conf dest=/tmp/nginx.conf\"`、(d) ディスク使用量を確認：`ansible webservers -m shell -a \"df -h /\"`。失敗したコマンドには `-v` を追加してより詳細な出力を取得してエラーを理解する。",
            },
            {
              en: "Use `lineinfile` to idempotently manage a config file. First, check if `/etc/ssh/sshd_config` contains `PermitRootLogin no`. Use: `ansible all -m lineinfile -a \"path=/etc/ssh/sshd_config regexp='^PermitRootLogin' line='PermitRootLogin no' state=present\" -b`. Run it twice — the second run should show \"ok\" (not \"changed\"). Then change the line to `PermitRootLogin yes` and run again — it should show \"changed\". This demonstrates idempotent in-file editing vs using `sed` which would add a duplicate line.",
              np: "Config file idempotently manage गर्न `lineinfile` प्रयोग गर्नुहोस्। पहिले, `/etc/ssh/sshd_config` मा `PermitRootLogin no` छ कि check गर्नुहोस्। प्रयोग गर्नुहोस्: `ansible all -m lineinfile -a \"path=/etc/ssh/sshd_config regexp='^PermitRootLogin' line='PermitRootLogin no' state=present\" -b`। दुईपटक run गर्नुहोस् — दोस्रो run ले \"changed\" होइन \"ok\" show गर्नुपर्छ। त्यसपछि line लाई `PermitRootLogin yes` मा change गर्नुहोस् र फेरि run गर्नुहोस् — यसले \"changed\" show गर्नुपर्छ। यसले duplicate line add गर्ने `sed` को तुलनामा idempotent in-file editing demonstrate गर्छ।",
              jp: "`lineinfile` を使って設定ファイルを冪等に管理する。まず `/etc/ssh/sshd_config` に `PermitRootLogin no` が含まれているか確認する。使用方法：`ansible all -m lineinfile -a \"path=/etc/ssh/sshd_config regexp='^PermitRootLogin' line='PermitRootLogin no' state=present\" -b`。2 回実行する — 2 回目の実行は「changed」ではなく「ok」を表示すべき。次に行を `PermitRootLogin yes` に変更して再実行する — 「changed」と表示されるはず。これは重複行を追加してしまう `sed` と比較した冪等なファイル内編集を実証します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What are Ansible facts and how do you use custom facts?",
        np: "Ansible fact के हुन् र custom fact कसरी प्रयोग गर्ने?",
        jp: "Ansible ファクトとは何か、カスタムファクトはどう使うか？",
      },
      answer: {
        en: "**Ansible facts** are system properties automatically gathered by the `setup` module at the start of every playbook. They include: `ansible_os_family`, `ansible_distribution`, `ansible_distribution_version`, `ansible_hostname`, `ansible_default_ipv4.address`, `ansible_memtotal_mb`, `ansible_processor_vcpus`, `ansible_mounts`. You use them in playbooks as variables: `{{ ansible_hostname }}`, `{{ ansible_os_family }}`. Common use: conditional tasks based on OS — `when: ansible_os_family == \"Debian\"`. **Custom facts** let you add your own data to the facts system. Place executable scripts or `.fact` files (INI/JSON) in `/etc/ansible/facts.d/` on managed nodes. They are accessible as `ansible_local.<filename>.<key>`. Example: `/etc/ansible/facts.d/app.fact` with `[app]\\nversion=2.4.1\\nenv=production` → accessible as `{{ ansible_local.app.app.version }}`. **Disabling fact gathering** when you do not need it (`gather_facts: false` in playbook) speeds up playbook execution significantly — on large inventories, fact gathering alone can take 30+ seconds.",
        np: "**Ansible fact** हरू system property हुन् जुन हरेक playbook को शुरुमा `setup` module द्वारा automatically gather हुन्छ। यसमा छन्: `ansible_os_family`, `ansible_distribution`, `ansible_distribution_version`, `ansible_hostname`, `ansible_default_ipv4.address`, `ansible_memtotal_mb`, `ansible_processor_vcpus`, `ansible_mounts`। Playbook मा variable को रूपमा प्रयोग गर्नुहोस्: `{{ ansible_hostname }}`, `{{ ansible_os_family }}`। Common use: OS मा आधारित conditional task — `when: ansible_os_family == \"Debian\"`। **Custom fact** ले fact system मा आफ्नै data add गर्न दिन्छ। Managed node मा `/etc/ansible/facts.d/` मा executable script वा `.fact` file (INI/JSON) राख्नुहोस्। `ansible_local.<filename>.<key>` को रूपमा accessible हुन्छ। Example: `/etc/ansible/facts.d/app.fact` मा `[app]\\nversion=2.4.1\\nenv=production` → `{{ ansible_local.app.app.version }}` को रूपमा accessible। **Fact gathering disable गर्दा** जहाँ चाहिँदैन (`gather_facts: false` playbook मा) playbook execution significantly speed up गर्छ — large inventory मा, fact gathering मात्रैले 30+ second लाग्न सक्छ।",
        jp: "**Ansible ファクト**はすべてのプレイブックの開始時に `setup` モジュールが自動的に収集するシステムプロパティです。含まれるもの：`ansible_os_family`・`ansible_distribution`・`ansible_distribution_version`・`ansible_hostname`・`ansible_default_ipv4.address`・`ansible_memtotal_mb`・`ansible_processor_vcpus`・`ansible_mounts`。プレイブックで変数として使用します：`{{ ansible_hostname }}`・`{{ ansible_os_family }}`。一般的な使用：OS に基づく条件付きタスク — `when: ansible_os_family == \"Debian\"`。**カスタムファクト**で独自のデータをファクトシステムに追加できます。管理ノードの `/etc/ansible/facts.d/` に実行可能スクリプトや `.fact` ファイル（INI/JSON）を置きます。`ansible_local.<filename>.<key>` としてアクセス可能。例：`/etc/ansible/facts.d/app.fact` に `[app]\\nversion=2.4.1\\nenv=production` → `{{ ansible_local.app.app.version }}` としてアクセス可能。**ファクト収集を無効にする**（プレイブックで `gather_facts: false`）とプレイブックの実行が大幅に速くなります — 大きなインベントリではファクト収集だけで 30 秒以上かかることがあります。",
      },
      tag: {
        en: "Ansible facts",
        np: "Ansible Fact",
        jp: "Ansible ファクト",
      },
    },
    {
      question: {
        en: "How do you handle sensitive data in ad-hoc commands without exposing passwords in shell history?",
        np: "Shell history मा password expose नगरी ad-hoc command मा sensitive data कसरी handle गर्ने?",
        jp: "シェル履歴にパスワードを公開せずにアドホックコマンドで機密データを扱うには？",
      },
      answer: {
        en: "Shell history is a real security concern — `ansible all -m user -a \"name=deploy password=mysecret\"` stores the password in `~/.bash_history` and `ps aux` output. Four approaches: (1) **Use `--extra-vars` with a vars file**: store sensitive values in a YAML file (encrypted with Ansible Vault) and pass `-e @secrets.yml`. (2) **Use `ansible-vault encrypt_string`**: encrypt individual values and paste the encrypted string into your inventory or vars file — Ansible decrypts at runtime. (3) **Environment variables**: some modules read from env vars — export the value in your shell session (it will not be in command history if you use `read -s VAR` to set it). (4) **`no_log: true` in playbooks**: add `no_log: true` to any task that handles passwords — Ansible will not print the task's args in output or logs, even in verbose mode. For ad-hoc commands, there is no equivalent of `no_log` — switch to a playbook for any task involving credentials.",
        np: "Shell history एउटा real security concern हो — `ansible all -m user -a \"name=deploy password=mysecret\"` ले password `~/.bash_history` र `ps aux` output मा store गर्छ। चारवटा approach: (1) **Vars file सहित `--extra-vars` प्रयोग**: sensitive value YAML file मा store गर्नुहोस् (Ansible Vault सँग encrypt) र `-e @secrets.yml` pass गर्नुहोस्। (2) **`ansible-vault encrypt_string` प्रयोग**: individual value encrypt गर्नुहोस् र encrypted string inventory वा vars file मा paste गर्नुहोस् — Ansible runtime मा decrypt गर्छ। (3) **Environment variable**: केही module ले env var बाट read गर्छ — shell session मा value export गर्नुहोस् (set गर्न `read -s VAR` प्रयोग गर्नुभयो भने command history मा हुँदैन)। (4) **Playbook मा `no_log: true`**: password handle गर्ने कुनै पनि task मा `no_log: true` add गर्नुहोस् — verbose mode मा पनि Ansible ले output वा log मा task को arg print गर्दैन। Ad-hoc command मा `no_log` को equivalent छैन — credential involve हुने कुनै पनि task को लागि playbook मा switch गर्नुहोस्।",
        jp: "シェル履歴は本当のセキュリティ上の懸念です — `ansible all -m user -a \"name=deploy password=mysecret\"` はパスワードを `~/.bash_history` と `ps aux` の出力に保存します。4 つのアプローチ：(1) **vars ファイルで `--extra-vars` を使用**：機密値を YAML ファイルに保存（Ansible Vault で暗号化）して `-e @secrets.yml` を渡す。(2) **`ansible-vault encrypt_string` を使用**：個々の値を暗号化してインベントリや vars ファイルに暗号化文字列を貼り付ける — Ansible が実行時に復号化。(3) **環境変数**：一部のモジュールは環境変数から読み取る — シェルセッションで値をエクスポートする（`read -s VAR` で設定するとコマンド履歴に残らない）。(4) **プレイブックで `no_log: true`**：パスワードを扱うタスクに `no_log: true` を追加する — Ansible は詳細モードでも出力やログにタスクの引数を表示しない。アドホックコマンドには `no_log` の相当物がありません — 認証情報を含むタスクにはプレイブックに切り替える。",
      },
      tag: {
        en: "sensitive data in ansible",
        np: "Ansible मा Sensitive Data",
        jp: "Ansible の機密データ",
      },
    },
  ],
};
