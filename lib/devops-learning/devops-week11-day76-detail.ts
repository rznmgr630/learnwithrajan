import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Ansible roles** are the fundamental unit of reusability and organisation in Ansible. Without roles, every project eventually ends up with monolithic playbooks — hundreds of tasks crammed into a single file, growing more fragile and unmaintainable with every new requirement. A role solves this by enforcing a **standardised directory structure** that Ansible understands natively. The structure is: `tasks/main.yml` (the entry point — automatically loaded when the role is applied), `handlers/main.yml` (handlers scoped to this role), `templates/` (Jinja2 `.j2` template files), `files/` (static files to copy verbatim), `vars/main.yml` (internal variables with high precedence), `defaults/main.yml` (overridable defaults with the lowest precedence of any variable source), and `meta/main.yml` (role metadata and dependency declarations). The `defaults/main.yml` file is the key to making a role reusable: any value placed there can be overridden by inventory vars, playbook vars, or extra-vars — it is the role author's way of saying \"here is a sensible default, but you are expected to tune it\". The `vars/main.yml` file is the opposite: values here are internal implementation details that should not normally be changed by the caller — they have higher precedence than inventory. The `meta/main.yml` file declares **role dependencies** — other roles that must run before this one. Ansible reads the `meta/main.yml` of every role in the play, resolves the dependency graph, and automatically runs dependent roles in the correct order before the dependent role itself executes.",
    np: "**Ansible role** Ansible मा reusability र organisation को fundamental unit हो। Role बिना, हरेक project अन्ततः monolithic playbook सँग समाप्त हुन्छ — एउटा single file मा सयौं task थुपारिएको, हरेक नयाँ requirement सँग झन् fragile र unmaintainable हुँदै। Role ले यो Ansible ले natively बुझ्ने **standardised directory structure** enforce गरेर solve गर्छ। Structure यस्तो छ: `tasks/main.yml` (entry point — role apply हुँदा automatically load हुन्छ), `handlers/main.yml` (यो role मा scoped handler), `templates/` (Jinja2 `.j2` template file), `files/` (verbatim copy गरिने static file), `vars/main.yml` (high precedence सहित internal variable), `defaults/main.yml` (कुनै पनि variable source को सबैभन्दा कम precedence सहित overridable default), र `meta/main.yml` (role metadata र dependency declaration)। `defaults/main.yml` file ले role लाई reusable बनाउने key हो: त्यहाँ राखिएको जुनसुकै value inventory var, playbook var, वा extra-var ले override गर्न सक्छ — यो role author को तरिका हो \"यहाँ sensible default छ, तर तपाईंले tune गर्ने अपेक्षा गरिन्छ\" भन्नको। `vars/main.yml` file यसको विपरीत हो: यहाँ value internal implementation detail हो जुन caller ले सामान्यतया change गर्नु हुँदैन — यसको inventory भन्दा बढी precedence छ। `meta/main.yml` file ले **role dependency** declare गर्छ — अर्का role जुन यो role अघि run हुनुपर्छ। Ansible ले play का हरेक role को `meta/main.yml` पढ्छ, dependency graph resolve गर्छ, र dependent role आफैं execute हुनुअघि correct order मा dependent role automatically run गर्छ।",
    jp: "**Ansible ロール**は Ansible における再利用性と整理の基本単位です。ロールがなければ、すべてのプロジェクトは最終的にモノリシックなプレイブックになります — 単一ファイルに何百ものタスクが詰め込まれ、新しい要件のたびにより脆く保守しにくくなります。ロールはこれを、Ansible がネイティブで理解する**標準化されたディレクトリ構造**を強制することで解決します。構造は：`tasks/main.yml`（エントリポイント — ロールが適用されると自動的に読み込まれる）、`handlers/main.yml`（このロールにスコープされたハンドラー）、`templates/`（Jinja2 `.j2` テンプレートファイル）、`files/`（そのままコピーされる静的ファイル）、`vars/main.yml`（高い優先順位を持つ内部変数）、`defaults/main.yml`（任意の変数ソースの中で最低の優先順位を持つ上書き可能なデフォルト）、`meta/main.yml`（ロールのメタデータと依存関係の宣言）。`defaults/main.yml` ファイルはロールを再利用可能にする鍵です：そこに置かれた値はインベントリ変数・プレイブック変数・extra-vars で上書きできます — これはロール作者の「ここに適切なデフォルトがあるが、チューニングすることが期待される」という表現方法です。`vars/main.yml` ファイルはその逆です：ここの値は通常呼び出し元が変更すべきでない内部実装の詳細 — インベントリより高い優先順位を持ちます。`meta/main.yml` ファイルは**ロールの依存関係**を宣言します — このロールより先に実行される必要がある他のロール。Ansible はプレイのすべてのロールの `meta/main.yml` を読み込み、依存関係グラフを解決し、依存ロール自体が実行される前に正しい順序で依存ロールを自動的に実行します。",
  } as const,
  o2: {
    en: "**Ansible Galaxy** is the community hub for sharing and downloading Ansible roles and collections, hosted at galaxy.ansible.com. It is to Ansible what npm is to Node.js or pip is to Python. The CLI command `ansible-galaxy install geerlingguy.nginx` downloads the nginx role authored by Jeff Geerling (one of the most prolific and well-tested role authors in the Ansible ecosystem) into `~/.ansible/roles/` by default, or into the project-local `roles/` directory when configured. In production you never install roles interactively — instead you pin exact versions in a `requirements.yml` file and run `ansible-galaxy install -r requirements.yml`. This makes your role dependencies explicit, versioned, and reproducible: every developer and every CI pipeline installs the exact same versions. The `requirements.yml` supports both Galaxy roles (identified by `namespace.rolename`) and Git repository sources (using `src: https://github.com/...` with a `version:` tag). To create a new role with the correct scaffolding, run `ansible-galaxy init my_role` — this generates all seven subdirectories with placeholder `main.yml` files and a skeleton `README.md`. Role naming follows the convention `namespace.rolename` (e.g., `geerlingguy.nginx`). The **Collection** model is the modern successor to standalone roles: a collection bundles related roles, modules, plugins, and documentation into a single versioned, installable unit. Install a collection with `ansible-galaxy collection install community.general` — this gives you hundreds of additional modules and roles maintained by the Ansible community. Collections use the namespace format `namespace.collection` and are stored in `~/.ansible/collections/`. In `requirements.yml` you can mix both roles and collections, making it the single source of truth for all your external Ansible dependencies.",
    np: "**Ansible Galaxy** galaxy.ansible.com मा hosted Ansible role र collection share र download गर्ने community hub हो। यो Ansible को लागि त्यही हो जुन npm Node.js को लागि वा pip Python को लागि हो। CLI command `ansible-galaxy install geerlingguy.nginx` ले Jeff Geerling (Ansible ecosystem मा सबैभन्दा धेरै role author मध्ये एक, राम्रोसँग tested) ले बनाएको nginx role लाई default मा `~/.ansible/roles/` मा, वा configure गरिएमा project-local `roles/` directory मा download गर्छ। Production मा तपाईंले कहिल्यै interactively role install गर्नुहुन्न — बरु `requirements.yml` file मा exact version pin गर्नुहोस् र `ansible-galaxy install -r requirements.yml` run गर्नुहोस्। यसले तपाईंको role dependency explicit, versioned, र reproducible बनाउँछ: हरेक developer र हरेक CI pipeline ले exactly same version install गर्छ। `requirements.yml` ले Galaxy role (namespace.rolename ले identify) र Git repository source (version: tag सहित `src: https://github.com/...` प्रयोग गरेर) दुवैलाई support गर्छ। Correct scaffolding सहित नयाँ role create गर्न `ansible-galaxy init my_role` run गर्नुहोस् — यसले placeholder `main.yml` file र skeleton `README.md` सहित सातवटा subdirectory generate गर्छ। Role naming `namespace.rolename` (जस्तै, `geerlingguy.nginx`) convention follow गर्छ। **Collection** model standalone role को modern successor हो: एउटा collection ले related role, module, plugin, र documentation लाई एउटा versioned, installable unit मा bundle गर्छ। `ansible-galaxy collection install community.general` सँग collection install गर्नुहोस् — यसले Ansible community ले maintain गरेको सयौं additional module र role दिन्छ। Collection ले `namespace.collection` format प्रयोग गर्छ र `~/.ansible/collections/` मा store हुन्छ। `requirements.yml` मा तपाईंले role र collection दुवै mix गर्न सक्नुहुन्छ, यसलाई तपाईंको सबै external Ansible dependency को single source of truth बनाउँदै।",
    jp: "**Ansible Galaxy** は galaxy.ansible.com でホストされている Ansible ロールとコレクションを共有・ダウンロードするためのコミュニティハブです。Ansible にとっての npm（Node.js）や pip（Python）に相当します。CLI コマンド `ansible-galaxy install geerlingguy.nginx` は Jeff Geerling（Ansible エコシステムで最も多作でよくテストされたロール作者の一人）が作成した nginx ロールを、デフォルトで `~/.ansible/roles/` に、または設定されていればプロジェクトローカルの `roles/` ディレクトリにダウンロードします。本番環境ではロールをインタラクティブにインストールせず、`requirements.yml` ファイルに正確なバージョンを固定して `ansible-galaxy install -r requirements.yml` を実行します。これによりロールの依存関係が明示的・バージョン管理・再現可能になります：すべての開発者とすべての CI パイプラインがまったく同じバージョンをインストールします。`requirements.yml` は Galaxy ロール（`namespace.rolename` で識別）と Git リポジトリソース（`version:` タグ付きの `src: https://github.com/...` 使用）の両方をサポートします。正しいスキャフォールディングで新しいロールを作成するには `ansible-galaxy init my_role` を実行します — これはプレースホルダーの `main.yml` ファイルとスケルトンの `README.md` を持つ 7 つのサブディレクトリすべてを生成します。ロールの命名は `namespace.rolename`（例：`geerlingguy.nginx`）の規則に従います。**コレクション**モデルはスタンドアロンロールの現代的な後継です：コレクションは関連するロール・モジュール・プラグイン・ドキュメントを単一のバージョン管理されたインストール可能なユニットにバンドルします。`ansible-galaxy collection install community.general` でコレクションをインストールすると、Ansible コミュニティがメンテナンスする何百もの追加モジュールとロールが利用できます。コレクションは `namespace.collection` フォーマットを使用し `~/.ansible/collections/` に保存されます。`requirements.yml` ではロールとコレクションを混在させることができ、すべての外部 Ansible 依存関係の唯一の信頼できる情報源となります。",
  } as const,
};

export const DEVOPS_DAY_76_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Role directory structure & Galaxy",
        np: "Role directory structure र Galaxy",
        jp: "ロールのディレクトリ構造と Galaxy",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-roles" },
        {
          type: "table",
          caption: {
            en: "Ansible role directory structure — purpose of each subdirectory",
            np: "Ansible role directory structure — हरेक subdirectory को purpose",
            jp: "Ansible ロールのディレクトリ構造 — 各サブディレクトリの目的",
          },
          headers: [
            { en: "Directory", np: "Directory", jp: "ディレクトリ" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Auto-loaded?", np: "Auto-load हुन्छ?", jp: "自動読み込み？" },
            { en: "Typical file", np: "Typical file", jp: "典型的なファイル" },
          ],
          rows: [
            [
              { en: "`tasks/`", np: "`tasks/`", jp: "`tasks/`" },
              { en: "The role's main task list — entry point for all role logic", np: "Role को main task list — सबै role logic को entry point", jp: "ロールのメインタスクリスト — すべてのロールロジックのエントリポイント" },
              { en: "Yes — `tasks/main.yml` runs automatically", np: "हो — `tasks/main.yml` automatically run हुन्छ", jp: "はい — `tasks/main.yml` が自動実行される" },
              { en: "`tasks/main.yml`", np: "`tasks/main.yml`", jp: "`tasks/main.yml`" },
            ],
            [
              { en: "`handlers/`", np: "`handlers/`", jp: "`handlers/`" },
              { en: "Handlers scoped to this role — triggered by `notify:` in role tasks", np: "यो role मा scoped handler — role task मा `notify:` ले trigger", jp: "このロールにスコープされたハンドラー — ロールタスクの `notify:` でトリガー" },
              { en: "Yes — `handlers/main.yml` merged at play level", np: "हो — `handlers/main.yml` play level मा merge हुन्छ", jp: "はい — `handlers/main.yml` がプレイレベルでマージされる" },
              { en: "`handlers/main.yml`", np: "`handlers/main.yml`", jp: "`handlers/main.yml`" },
            ],
            [
              { en: "`templates/`", np: "`templates/`", jp: "`templates/`" },
              { en: "Jinja2 template files deployed with the `template` module", np: "`template` module सँग deploy गरिने Jinja2 template file", jp: "`template` モジュールでデプロイされる Jinja2 テンプレートファイル" },
              { en: "No — referenced explicitly in tasks", np: "होइन — task मा explicitly reference गरिन्छ", jp: "いいえ — タスクで明示的に参照される" },
              { en: "`templates/nginx.conf.j2`", np: "`templates/nginx.conf.j2`", jp: "`templates/nginx.conf.j2`" },
            ],
            [
              { en: "`files/`", np: "`files/`", jp: "`files/`" },
              { en: "Static files copied verbatim to managed hosts with the `copy` module", np: "`copy` module सँग managed host मा verbatim copy गरिने static file", jp: "`copy` モジュールで管理対象ホストにそのままコピーされる静的ファイル" },
              { en: "No — referenced by filename in `copy` tasks", np: "होइन — `copy` task मा filename ले reference", jp: "いいえ — `copy` タスクでファイル名により参照される" },
              { en: "`files/my_script.sh`", np: "`files/my_script.sh`", jp: "`files/my_script.sh`" },
            ],
            [
              { en: "`vars/`", np: "`vars/`", jp: "`vars/`" },
              { en: "Internal role variables with HIGH precedence — not meant for operator override", np: "HIGH precedence सहित internal role variable — operator override को लागि नभएको", jp: "高い優先順位を持つ内部ロール変数 — オペレーターによる上書きを意図しない" },
              { en: "Yes — `vars/main.yml` loaded automatically", np: "हो — `vars/main.yml` automatically load हुन्छ", jp: "はい — `vars/main.yml` が自動的に読み込まれる" },
              { en: "`vars/main.yml`", np: "`vars/main.yml`", jp: "`vars/main.yml`" },
            ],
            [
              { en: "`defaults/`", np: "`defaults/`", jp: "`defaults/`" },
              { en: "Role defaults with LOWEST precedence — designed to be overridden by users of the role", np: "LOWEST precedence सहित role default — role user ले override गर्न design गरिएको", jp: "最低優先順位を持つロールデフォルト — ロール利用者による上書きを想定して設計" },
              { en: "Yes — `defaults/main.yml` loaded automatically", np: "हो — `defaults/main.yml` automatically load हुन्छ", jp: "はい — `defaults/main.yml` が自動的に読み込まれる" },
              { en: "`defaults/main.yml`", np: "`defaults/main.yml`", jp: "`defaults/main.yml`" },
            ],
            [
              { en: "`meta/`", np: "`meta/`", jp: "`meta/`" },
              { en: "Role metadata: Galaxy info, author, license, and role dependency declarations", np: "Role metadata: Galaxy info, author, license, र role dependency declaration", jp: "ロールのメタデータ：Galaxy 情報・作者・ライセンス・ロール依存関係の宣言" },
              { en: "Yes — `meta/main.yml` read to resolve dependencies", np: "हो — dependency resolve गर्न `meta/main.yml` पढिन्छ", jp: "はい — 依存関係を解決するために `meta/main.yml` が読み込まれる" },
              { en: "`meta/main.yml`", np: "`meta/main.yml`", jp: "`meta/main.yml`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Using, creating & sharing roles",
        np: "Role use, create र share गर्दै",
        jp: "ロールの使用・作成・共有",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "ansible-galaxy init, role structure, using roles in playbooks, requirements.yml & meta dependencies",
            np: "ansible-galaxy init, role structure, playbook मा role प्रयोग, requirements.yml र meta dependency",
            jp: "ansible-galaxy init・ロール構造・プレイブックでのロール使用・requirements.yml・meta 依存関係",
          },
          code: `# ── 1. Scaffold a new role with galaxy init ───────────────────────
ansible-galaxy init roles/my_webserver
# Creates the full directory tree:
#   roles/my_webserver/
#   ├── tasks/main.yml
#   ├── handlers/main.yml
#   ├── templates/
#   ├── files/
#   ├── vars/main.yml
#   ├── defaults/main.yml
#   └── meta/main.yml

# ── 2. defaults/main.yml — lowest precedence, user-overridable ────
# roles/my_webserver/defaults/main.yml
---
nginx_port: 80
nginx_worker_processes: auto
nginx_keepalive_timeout: 65
nginx_document_root: /var/www/html

# ── 3. vars/main.yml — higher precedence, internal constants ──────
# roles/my_webserver/vars/main.yml
---
nginx_pid_file: /run/nginx.pid
nginx_log_dir: /var/log/nginx
nginx_conf_dir: /etc/nginx/conf.d

# ── 4. tasks/main.yml — the role entry point ──────────────────────
# roles/my_webserver/tasks/main.yml
---
- name: Install nginx
  package:
    name: nginx
    state: present

- name: Deploy nginx configuration
  template:
    src: nginx.conf.j2
    dest: /etc/nginx/nginx.conf
    owner: root
    group: root
    mode: '0644'
  notify: reload nginx           # triggers handler on change

- name: Ensure nginx is started and enabled
  service:
    name: nginx
    state: started
    enabled: yes

# ── 5. handlers/main.yml — role-scoped handlers ───────────────────
# roles/my_webserver/handlers/main.yml
---
- name: reload nginx
  service:
    name: nginx
    state: reloaded

# ── 6. meta/main.yml — role metadata and dependencies ─────────────
# roles/my_webserver/meta/main.yml
---
galaxy_info:
  author: yourname
  description: Install and configure nginx
  license: MIT
  min_ansible_version: "2.12"
  platforms:
    - name: Ubuntu
      versions: ["20.04", "22.04"]

dependencies:
  - role: geerlingguy.firewall    # this role runs BEFORE my_webserver
    vars:
      firewall_allowed_tcp_ports: ["80", "443"]

# ── 7. Classic roles: key in a playbook ───────────────────────────
# site.yml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - role: my_webserver           # uses defaults
    - role: my_webserver           # override a default variable
      vars:
        nginx_port: 8080

# ── 8. include_role task — dynamic, conditional role inclusion ─────
- name: Optionally add monitoring role
  include_role:
    name: my_monitoring
  when: enable_monitoring | default(false)

# ── 9. requirements.yml — pin exact versions for reproducibility ──
# requirements.yml
---
roles:
  - name: geerlingguy.nginx
    version: "3.2.0"
  - name: geerlingguy.firewall
    version: "2.1.0"
  - src: https://github.com/myorg/custom_role.git
    scm: git
    version: v1.0.0
    name: myorg.custom_role

collections:
  - name: community.general
    version: ">=7.0.0"
  - name: ansible.posix
    version: "1.5.4"

# ── 10. Install all requirements ──────────────────────────────────
ansible-galaxy install -r requirements.yml            # roles
ansible-galaxy collection install -r requirements.yml # collections
ansible-galaxy install -r requirements.yml --force    # force re-download

# ── 11. List installed roles & collections ────────────────────────
ansible-galaxy list                              # show installed roles
ansible-galaxy collection list                   # show installed collections`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Run `ansible-galaxy init roles/nginx_role` to scaffold a new role. Fill in `defaults/main.yml` with `nginx_port: 80` and `nginx_worker_processes: auto`. Fill in `vars/main.yml` with `nginx_log_dir: /var/log/nginx`. Add a task in `tasks/main.yml` to install nginx and deploy a `templates/nginx.conf.j2` template that uses both `{{ nginx_port }}` and `{{ nginx_worker_processes }}`. Write a playbook that uses the role twice: once with the defaults, and once with `nginx_port: 8080` overriding the default. Run the playbook against localhost (or a Vagrant VM) and confirm nginx is running on the correct port. Check `/etc/nginx/nginx.conf` to verify the template rendered with the overridden value.",
              np: "`ansible-galaxy init roles/nginx_role` run गरेर नयाँ role scaffold गर्नुहोस्। `defaults/main.yml` लाई `nginx_port: 80` र `nginx_worker_processes: auto` सँग fill गर्नुहोस्। `vars/main.yml` लाई `nginx_log_dir: /var/log/nginx` सँग fill गर्नुहोस्। `tasks/main.yml` मा nginx install गर्न र `{{ nginx_port }}` र `{{ nginx_worker_processes }}` दुवै प्रयोग गर्ने `templates/nginx.conf.j2` template deploy गर्न task add गर्नुहोस्। Role दुईपटक प्रयोग गर्ने playbook लेख्नुहोस्: एकपटक default सँग, र एकपटक default override गरेर `nginx_port: 8080` सँग। Localhost (वा Vagrant VM) मा playbook run गर्नुहोस् र nginx correct port मा running छ confirm गर्नुहोस्। Template overridden value सँग render भएको verify गर्न `/etc/nginx/nginx.conf` check गर्नुहोस्।",
              jp: "`ansible-galaxy init roles/nginx_role` を実行して新しいロールをスキャフォールディングする。`defaults/main.yml` に `nginx_port: 80` と `nginx_worker_processes: auto` を記入する。`vars/main.yml` に `nginx_log_dir: /var/log/nginx` を記入する。`tasks/main.yml` に nginx をインストールするタスクと、`{{ nginx_port }}` と `{{ nginx_worker_processes }}` の両方を使用する `templates/nginx.conf.j2` テンプレートをデプロイするタスクを追加する。ロールを 2 回使用するプレイブックを書く：一度はデフォルトで、一度は `nginx_port: 8080` でデフォルトを上書きして。localhost（または Vagrant VM）に対してプレイブックを実行し、nginx が正しいポートで実行されていることを確認する。`/etc/nginx/nginx.conf` を確認してテンプレートが上書きされた値でレンダリングされたことを検証する。",
            },
            {
              en: "Create a `requirements.yml` that pins `geerlingguy.nginx` at version `3.2.0` and the `community.general` collection at `>=7.0.0`. Run `ansible-galaxy install -r requirements.yml` and verify the role appears in `~/.ansible/roles/` with `ansible-galaxy list`. Then write a playbook that uses the installed `geerlingguy.nginx` role. Override at least two of its default variables (inspect its `defaults/main.yml` on GitHub or in `~/.ansible/roles/geerlingguy.nginx/defaults/main.yml`). Run the playbook and confirm nginx is configured according to your overrides — the goal is to experience the \"install from requirements, use with custom vars\" workflow that every production team uses.",
              np: "`geerlingguy.nginx` लाई version `3.2.0` मा र `community.general` collection लाई `>=7.0.0` मा pin गर्ने `requirements.yml` create गर्नुहोस्। `ansible-galaxy install -r requirements.yml` run गर्नुहोस् र `ansible-galaxy list` सँग role `~/.ansible/roles/` मा देखिन्छ verify गर्नुहोस्। त्यसपछि install गरिएको `geerlingguy.nginx` role प्रयोग गर्ने playbook लेख्नुहोस्। यसको कम्तिमा दुईवटा default variable override गर्नुहोस् (GitHub मा वा `~/.ansible/roles/geerlingguy.nginx/defaults/main.yml` मा यसको `defaults/main.yml` inspect गर्नुहोस्)। Playbook run गर्नुहोस् र nginx तपाईंको override अनुसार configure भएको confirm गर्नुहोस् — लक्ष्य \"requirements बाट install गर्नुहोस्, custom var सँग प्रयोग गर्नुहोस्\" workflow अनुभव गर्नु हो जुन हरेक production team प्रयोग गर्छ।",
              jp: "`geerlingguy.nginx` をバージョン `3.2.0` で、`community.general` コレクションを `>=7.0.0` で固定する `requirements.yml` を作成する。`ansible-galaxy install -r requirements.yml` を実行し、`ansible-galaxy list` でロールが `~/.ansible/roles/` に表示されることを確認する。次にインストールされた `geerlingguy.nginx` ロールを使用するプレイブックを書く。デフォルト変数を少なくとも 2 つ上書きする（GitHub または `~/.ansible/roles/geerlingguy.nginx/defaults/main.yml` でその `defaults/main.yml` を確認）。プレイブックを実行し、nginx が上書き内容に従って設定されていることを確認する — 目標は、すべての本番チームが使用する「requirements からインストールし、カスタム変数で使用する」ワークフローを体験することです。",
            },
            {
              en: "Add a role dependency to `meta/main.yml`. Create two roles: `base_packages` (installs common packages like `curl`, `vim`, `git` using a `packages` list variable) and `app_server` (installs your application). In `app_server/meta/main.yml`, declare `base_packages` as a dependency. Write a playbook that only applies `app_server`. Run it and observe in the Ansible output that `base_packages` tasks execute first (Ansible resolved the dependency automatically), then `app_server` tasks execute. Confirm by checking that both the common packages and the app are installed on the target host. This demonstrates the dependency graph resolution that `meta/main.yml` enables.",
              np: "`meta/main.yml` मा role dependency add गर्नुहोस्। दुईवटा role create गर्नुहोस्: `base_packages` (`packages` list variable प्रयोग गरेर `curl`, `vim`, `git` जस्ता common package install गर्छ) र `app_server` (तपाईंको application install गर्छ)। `app_server/meta/main.yml` मा `base_packages` लाई dependency declare गर्नुहोस्। केवल `app_server` apply गर्ने playbook लेख्नुहोस्। यसलाई run गर्नुहोस् र Ansible output मा observe गर्नुहोस् कि `base_packages` task पहिले execute हुन्छ (Ansible ले dependency automatically resolve गर्यो), त्यसपछि `app_server` task execute हुन्छ। Target host मा common package र app दुवै install भएको check गरेर confirm गर्नुहोस्। यसले `meta/main.yml` enable गर्ने dependency graph resolution demonstrate गर्छ।",
              jp: "`meta/main.yml` にロールの依存関係を追加する。2 つのロールを作成する：`base_packages`（`packages` リスト変数を使用して `curl`・`vim`・`git` などの共通パッケージをインストール）と `app_server`（アプリケーションをインストール）。`app_server/meta/main.yml` に `base_packages` を依存関係として宣言する。`app_server` だけを適用するプレイブックを書く。実行して Ansible の出力で `base_packages` のタスクが最初に実行される（Ansible が依存関係を自動解決した）のを観察し、その後 `app_server` のタスクが実行されることを確認する。ターゲットホストに共通パッケージとアプリの両方がインストールされていることを確認する。これは `meta/main.yml` が可能にする依存関係グラフの解決を示します。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How does role variable precedence work — `defaults` vs `vars` in a role?",
        np: "Role variable precedence कसरी काम गर्छ — role मा `defaults` vs `vars`?",
        jp: "ロール変数の優先順位はどう機能するか — ロールの `defaults` vs `vars`？",
      },
      answer: {
        en: "This is one of the most important distinctions in Ansible role design, and getting it wrong leads to roles that are either impossible to configure or unexpectedly overridable. **`defaults/main.yml`** has the absolute lowest precedence of any variable source in Ansible — lower than inventory host_vars, lower than group_vars, lower than playbook `vars:` blocks. This means that ANY variable defined anywhere else will override a role default. This is intentional: role defaults are the author's suggested configuration, but they are designed to be replaced. You put something in `defaults/` when you want users of your role to be able to configure it by simply setting the variable in their inventory or playbook without needing to modify the role itself. Examples of what belongs in `defaults/`: `nginx_port: 80`, `nginx_worker_processes: auto`, `enable_ssl: false`, `app_deploy_user: www-data`. **`vars/main.yml`** sits much higher in the precedence order — above inventory host_vars and group_vars, meaning that inventory variables CANNOT override vars. This makes `vars/` appropriate for internal implementation details of the role that should not be changed by the caller. Examples: `nginx_pid_file: /run/nginx.pid`, `nginx_binary: /usr/sbin/nginx`, internal path constants. The practical rule: if you want the user of your role to be able to configure something, put it in `defaults/`. If it is an implementation constant that should be stable regardless of who uses the role, put it in `vars/`. A common mistake is putting configurable parameters in `vars/` — this breaks every operator who tries to override them from the playbook or inventory. Another subtle point: if you need to expose BOTH a tunable parameter AND ensure the internal constant doesn't conflict, name them differently: `nginx_port` in defaults for the tunable value, `_nginx_listen_address` (leading underscore by convention) in vars for the internal computed combination.",
        np: "यो Ansible role design मा सबैभन्दा महत्त्वपूर्ण distinction मध्ये एक हो, र यसलाई गलत गर्दा configure गर्न असम्भव वा अप्रत्याशित रूपमा overridable role बन्छ। **`defaults/main.yml`** को Ansible का कुनै पनि variable source भन्दा absolute lowest precedence छ — inventory host_vars भन्दा कम, group_vars भन्दा कम, playbook `vars:` block भन्दा कम। यसको मतलब अरू जहाँ पनि define गरिएको जुनसुकै variable ले role default override गर्नेछ। यो intentional हो: role default भनेको author को suggested configuration हो, तर यो replace हुन design गरिएको छ। Role को user लाई role नै modify नगरी आफ्नो inventory वा playbook मा variable set गरेर configure गर्न सक्ने बनाउन चाहँदा `defaults/` मा राख्नुहोस्। `defaults/` मा के राख्ने उदाहरण: `nginx_port: 80`, `nginx_worker_processes: auto`, `enable_ssl: false`, `app_deploy_user: www-data`। **`vars/main.yml`** precedence order मा धेरै माथि बस्छ — inventory host_vars र group_vars भन्दा माथि, यसको मतलब inventory variable ले vars override गर्न सक्दैन। यसले `vars/` लाई caller ले change गर्नु नहुने role को internal implementation detail को लागि उपयुक्त बनाउँछ। उदाहरण: `nginx_pid_file: /run/nginx.pid`, `nginx_binary: /usr/sbin/nginx`, internal path constant। Practical rule: role को user ले केही configure गर्न सक्ने बनाउन चाहनुभएको छ भने `defaults/` मा राख्नुहोस्। Role को user जो भए पनि stable रहनुपर्ने implementation constant छ भने `vars/` मा राख्नुहोस्। Common mistake: configurable parameter लाई `vars/` मा राख्नु — यसले playbook वा inventory बाट override गर्न खोज्ने हरेक operator लाई break गर्छ। अर्को subtle point: tunable parameter र internal constant दुवै expose गर्न चाहनुभएको छ र conflict नहोस् भन्न, तिनलाई फरक नाम दिनुहोस्: tunable value को लागि defaults मा `nginx_port`, internal computed combination को लागि vars मा `_nginx_listen_address` (convention अनुसार leading underscore)।",
        jp: "これは Ansible ロール設計で最も重要な区別の一つで、間違えると設定不可能なロールや予期せず上書き可能なロールになります。**`defaults/main.yml`** は Ansible の変数ソースの中で絶対的に最低の優先順位を持ちます — インベントリの host_vars より低く、group_vars より低く、プレイブックの `vars:` ブロックより低い。これは他のどこかで定義された任意の変数がロールのデフォルトを上書きすることを意味します。これは意図的です：ロールのデフォルトは作者の推奨設定ですが、置き換えられることを想定して設計されています。ロールのユーザーがロール自体を変更せずにインベントリやプレイブックで変数を設定するだけで設定できるようにしたい場合は `defaults/` に置きます。`defaults/` に属するものの例：`nginx_port: 80`・`nginx_worker_processes: auto`・`enable_ssl: false`・`app_deploy_user: www-data`。**`vars/main.yml`** は優先順位の順序でずっと高い位置にあります — インベントリの host_vars や group_vars より上で、インベントリ変数が vars を上書きできないことを意味します。これにより `vars/` は呼び出し元が変更すべきでないロールの内部実装の詳細に適しています。例：`nginx_pid_file: /run/nginx.pid`・`nginx_binary: /usr/sbin/nginx`・内部パス定数。実践的なルール：ロールのユーザーが何かを設定できるようにしたい場合は `defaults/` に置く。ロールの使用者に関わらず安定すべき実装定数は `vars/` に置く。よくある間違い：設定可能なパラメーターを `vars/` に置くこと — これはプレイブックやインベントリから上書きしようとするすべてのオペレーターを壊します。別の微妙なポイント：チューニング可能なパラメーターと内部定数の両方を公開し、競合しないようにするには、異なる名前を付ける：チューニング可能な値には defaults に `nginx_port`、内部計算の組み合わせには vars に `_nginx_listen_address`（慣習として先頭にアンダースコア）。",
      },
      tag: {
        en: "role variable precedence",
        np: "role variable precedence",
        jp: "ロール変数の優先順位",
      },
    },
    {
      question: {
        en: "What is the difference between a role and a collection in Ansible Galaxy?",
        np: "Ansible Galaxy मा role र collection बीचको फरक के हो?",
        jp: "Ansible Galaxy におけるロールとコレクションの違いは何か？",
      },
      answer: {
        en: "Roles and collections both promote reusability, but they operate at different levels of abstraction and serve different purposes. A **role** is the original Ansible reusability unit — it encapsulates tasks, handlers, templates, files, and variables for ONE specific concern (e.g., \"install and configure nginx\", \"manage users\", \"deploy my application\"). Roles have the fixed `tasks/handlers/templates/files/vars/defaults/meta` directory structure. They are shared via Ansible Galaxy as standalone packages, identified by `namespace.rolename`. Roles can only be used from playbooks — they cannot add new Ansible modules or plugins, they can only use the ones already present in your Ansible installation. A **collection** is the modern packaging format introduced in Ansible 2.8 and significantly improved in 2.9+. A collection is a broader container that can bundle together: multiple roles, custom modules (Python `.py` files that extend Ansible), custom plugins (connection plugins, lookup plugins, filter plugins), and documentation — all in a single installable unit. Collections use the format `namespace.collection` (e.g., `community.general`, `ansible.posix`, `amazon.aws`). They are installed to `~/.ansible/collections/` and their modules are referenced using the Fully Qualified Collection Name (FQCN): `community.general.homebrew`, `ansible.posix.sysctl`, `amazon.aws.ec2_instance`. The practical difference: if you want to reuse a set of tasks that configure something, write a role. If you want to distribute custom modules or plugins alongside roles (like `amazon.aws` ships the `ec2_instance` module), use a collection. For most teams writing internal automation, roles are sufficient. Collections are the format used by the Ansible community and vendors to ship integration code for platforms (AWS, Azure, GCP, VMware, network devices). In your `requirements.yml` you can and should list both — roles for task reuse, collections for module/plugin availability.",
        np: "Role र collection दुवैले reusability promote गर्छन्, तर यिनीहरू abstraction को different level मा operate गर्छन् र different purpose serve गर्छन्। **Role** भनेको original Ansible reusability unit हो — यसले ONE specific concern को लागि task, handler, template, file, र variable encapsulate गर्छ (जस्तै, \"nginx install र configure गर्नुहोस्\", \"user manage गर्नुहोस्\", \"application deploy गर्नुहोस्\")। Role हरूको fixed `tasks/handlers/templates/files/vars/defaults/meta` directory structure छ। यिनीहरू `namespace.rolename` ले identify गरिएको standalone package को रूपमा Ansible Galaxy मार्फत share गरिन्छ। Role लाई playbook बाट मात्र प्रयोग गर्न सकिन्छ — यिनीहरूले नयाँ Ansible module वा plugin add गर्न सक्दैनन्, यिनीहरूले Ansible installation मा already present भएका मात्र प्रयोग गर्न सक्छन्। **Collection** भनेको Ansible 2.8 मा introduce गरिएको र 2.9+ मा significantly improve गरिएको modern packaging format हो। Collection एउटा broader container हो जसले bundle गर्न सक्छ: multiple role, custom module (Ansible extend गर्ने Python `.py` file), custom plugin (connection plugin, lookup plugin, filter plugin), र documentation — एउटा single installable unit मा। Collection ले `namespace.collection` format प्रयोग गर्छ (जस्तै, `community.general`, `ansible.posix`, `amazon.aws`)। यिनीहरू `~/.ansible/collections/` मा install हुन्छन् र यिनीहरूका module लाई Fully Qualified Collection Name (FQCN) प्रयोग गरेर reference गरिन्छ: `community.general.homebrew`, `ansible.posix.sysctl`, `amazon.aws.ec2_instance`। Practical difference: केही configure गर्ने task set reuse गर्न चाहनुभएको छ भने role लेख्नुहोस्। Role सँगै custom module वा plugin distribute गर्न चाहनुभएको छ भने (जस्तै `amazon.aws` ले `ec2_instance` module ship गर्छ), collection प्रयोग गर्नुहोस्। Internal automation लेख्ने धेरै team को लागि role पर्याप्त छ। Collection भनेको Ansible community र vendor हरूले platform (AWS, Azure, GCP, VMware, network device) को लागि integration code ship गर्न प्रयोग गर्ने format हो। तपाईंको `requirements.yml` मा दुवै list गर्नुहोस् र गर्नुपर्छ — task reuse को लागि role, module/plugin availability को लागि collection।",
        jp: "ロールとコレクションはどちらも再利用性を促進しますが、異なる抽象化レベルで動作し、異なる目的を果たします。**ロール**はオリジナルの Ansible 再利用ユニットです — 1 つの特定の関心事（例：「nginx をインストールして設定する」「ユーザーを管理する」「アプリケーションをデプロイする」）のためにタスク・ハンドラー・テンプレート・ファイル・変数をカプセル化します。ロールには固定の `tasks/handlers/templates/files/vars/defaults/meta` ディレクトリ構造があります。`namespace.rolename` で識別されるスタンドアロンパッケージとして Ansible Galaxy 経由で共有されます。ロールはプレイブックからのみ使用でき、新しい Ansible モジュールやプラグインを追加できず、Ansible インストールに既存のものしか使用できません。**コレクション**は Ansible 2.8 で導入され 2.9 以降で大幅に改善された現代的なパッケージ形式です。コレクションはより広いコンテナで、複数のロール・カスタムモジュール（Ansible を拡張する Python `.py` ファイル）・カスタムプラグイン（接続プラグイン・ルックアッププラグイン・フィルタープラグイン）・ドキュメントをすべて単一のインストール可能なユニットにバンドルできます。コレクションは `namespace.collection` フォーマットを使用します（例：`community.general`・`ansible.posix`・`amazon.aws`）。`~/.ansible/collections/` にインストールされ、そのモジュールは完全修飾コレクション名（FQCN）で参照されます：`community.general.homebrew`・`ansible.posix.sysctl`・`amazon.aws.ec2_instance`。実践的な違い：何かを設定するタスクセットを再利用したい場合はロールを書く。ロールと一緒にカスタムモジュールやプラグインを配布したい場合（`amazon.aws` が `ec2_instance` モジュールを含むように）はコレクションを使う。内部自動化を書くほとんどのチームにとってロールで十分です。コレクションはプラットフォーム（AWS・Azure・GCP・VMware・ネットワーク機器）の統合コードを配布するために Ansible コミュニティとベンダーが使用するフォーマットです。`requirements.yml` にはロールとコレクションの両方をリストすべきです — タスクの再利用にはロール、モジュール/プラグインの利用可能性にはコレクション。",
      },
      tag: {
        en: "role vs collection",
        np: "role vs collection",
        jp: "ロール vs コレクション",
      },
    },
  ],
};
