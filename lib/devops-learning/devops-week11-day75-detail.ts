import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "**Ansible variables** are the mechanism that makes a single playbook work across different environments (dev, staging, production) and host types. Instead of hardcoding values, you reference `{{ variable_name }}` — the double-braces Jinja2 syntax — and Ansible substitutes the correct value at runtime. Variables can come from many sources, and Ansible applies them in strict precedence order from lowest to highest: **role defaults** (role's `defaults/main.yml`), **inventory group_vars** (`group_vars/all.yml` → parent group → child group), **inventory host_vars** (`host_vars/web1.yml`), **playbook `vars:`** block, **`vars_files:`** (external YAML files loaded in the play), **`set_fact`** (computed at runtime), **`register`** (output of a task captured as a variable), **extra-vars** (`-e` on the command line — wins over everything). Ansible variables support all YAML types: strings, integers, booleans, lists, and dictionaries. Access dict keys with dot notation (`{{ app.port }}`) or bracket notation (`{{ app['port'] }}`). **`set_fact`** lets you compute derived values at runtime — e.g., `worker_count: \"{{ ansible_processor_vcpus * 2 }}\"`  — scoped to the current host for the rest of the play. **`vars_prompt`** collects interactive input at run time (useful for passwords or environment choices). Variable scoping follows four levels: **play scope** (`vars:` in the play — visible to all tasks in that play), **task scope** (`set_fact` — available to all subsequent tasks on that host), **host scope** (`hostvars` — accessible from any host), **global scope** (`-e` extra-vars — overrides every other source regardless of where it was set).",
    np: "**Ansible variable** एउटा single playbook लाई different environment (dev, staging, production) र host type मा काम गर्न सक्ने mechanism हो। Value hardcode गर्नुको सट्टा `{{ variable_name }}` reference गर्नुहुन्छ — double-braces Jinja2 syntax — र Ansible ले runtime मा सही value substitute गर्छ। Variable धेरै source बाट आउन सक्छ, र Ansible ले ती लाई lowest देखि highest precedence मा apply गर्छ: **role defaults** (role को `defaults/main.yml`), **inventory group_vars** (`group_vars/all.yml` → parent group → child group), **inventory host_vars** (`host_vars/web1.yml`), **playbook `vars:`** block, **`vars_files:`** (play मा load गरिएको external YAML file), **`set_fact`** (runtime मा compute), **`register`** (task को output variable को रूपमा capture), **extra-vars** (command line मा `-e` — सबैमाथि जित्छ)। Ansible variable ले सबै YAML type support गर्छ: string, integer, boolean, list, र dictionary। Dict key लाई dot notation (`{{ app.port }}`) वा bracket notation (`{{ app['port'] }}`) सँग access गर्नुहोस्। **`set_fact`** ले runtime मा derived value compute गर्न दिन्छ — जस्तै, `worker_count: \"{{ ansible_processor_vcpus * 2 }}\"`  — play को बाँकी भागको लागि current host मा scoped। **`vars_prompt`** ले run time मा interactive input collect गर्छ (password वा environment choice को लागि useful)। Variable scoping चारवटा level follow गर्छ: **play scope** (play मा `vars:` — त्यो play का सबै task लाई visible), **task scope** (`set_fact` — त्यो host का सबै subsequent task लाई available), **host scope** (`hostvars` — जुनसुकै host बाट accessible), **global scope** (`-e` extra-var — जहाँ set भएको भए पनि अरू सबै source override गर्छ)।",
    jp: "**Ansible 変数**は、単一のプレイブックを異なる環境（dev・staging・production）やホストタイプで機能させる仕組みです。値をハードコードする代わりに `{{ variable_name }}` を参照します — Jinja2 の二重波括弧構文 — Ansible は実行時に正しい値を代入します。変数は多くのソースから来ることができ、Ansible は最低から最高の優先順位で適用します：**ロールデフォルト**（ロールの `defaults/main.yml`）、**インベントリの group_vars**（`group_vars/all.yml` → 親グループ → 子グループ）、**インベントリの host_vars**（`host_vars/web1.yml`）、**プレイブックの `vars:`** ブロック、**`vars_files:`**（プレイで読み込まれる外部 YAML ファイル）、**`set_fact`**（実行時に計算）、**`register`**（変数としてキャプチャされたタスクの出力）、**extra-vars**（コマンドラインの `-e` — すべてに勝つ）。Ansible 変数はすべての YAML 型をサポートします：文字列・整数・ブール値・リスト・辞書。辞書のキーはドット記法（`{{ app.port }}`）またはブラケット記法（`{{ app['port'] }}`）でアクセスします。**`set_fact`** は実行時に派生値を計算できます — 例：`worker_count: \"{{ ansible_processor_vcpus * 2 }}\"` — プレイの残りの期間その host にスコープされます。**`vars_prompt`** は実行時にインタラクティブな入力を収集します（パスワードや環境選択に便利）。変数のスコープは 4 つのレベルに従います：**プレイスコープ**（プレイ内の `vars:` — そのプレイのすべてのタスクに見える）、**タスクスコープ**（`set_fact` — そのホストのすべての後続タスクで利用可能）、**ホストスコープ**（`hostvars` — すべてのホストからアクセス可能）、**グローバルスコープ**（`-e` extra-var — どこで設定されていても他のすべてのソースを上書き）。",
  } as const,
  o2: {
    en: "**Jinja2** is the templating engine Ansible inherited from Python/Flask. It powers both **template files** (`.j2` files deployed to managed hosts with the `template` module) and **inline expressions** in playbook YAML — task names, `when:` conditions, `with_items:` loops, and module arguments all accept Jinja2. There are three Jinja2 constructs: **`{{ expression }}`** outputs a value (variable substitution), **`{% statement %}`** controls flow (if/for/set — these produce no output themselves), and **`{# comment #}`** writes a comment that is stripped from the rendered output entirely. **Filters** transform values using the pipe operator: `{{ var | upper }}` converts to uppercase, `{{ list | join(',') }}` joins a list with a separator, `{{ value | default('fallback') }}` provides a safe default when a variable may be undefined, `{{ string | regex_replace('pattern', 'replacement') }}` transforms strings, `{{ list | length }}` returns the count. **Tests** check conditions inline: `{{ var is defined }}`, `{{ var is none }}`, `{{ num is divisibleby(2) }}`. Templates are most powerful for generating config files: a single `nginx.conf.j2` template generates a correct, host-specific config for every server — `worker_processes` from `{{ ansible_processor_vcpus }}`, `server_name` from `{{ ansible_hostname }}`, listening port from `{{ nginx_port | default(80) }}`. An upstream block built with a `{% for server in app_servers %}` loop automatically includes every host in the group. The template is deployed with the `template` module, which validates Jinja2 syntax before writing the file and triggers handlers (e.g., reload nginx) only when the rendered content actually changed.",
    np: "**Jinja2** Python/Flask बाट Ansible ले inherit गरेको templating engine हो। यसले **template file** (`.j2` file जो `template` module सँग managed host मा deploy गरिन्छ) र playbook YAML मा **inline expression** दुवैलाई power गर्छ — task name, `when:` condition, `with_items:` loop, र module argument हरूले सबैले Jinja2 accept गर्छन्। तीनवटा Jinja2 construct छन्: **`{{ expression }}`** ले value output गर्छ (variable substitution), **`{% statement %}`** ले flow control गर्छ (if/for/set — यिनीहरूले आफैले output produce गर्दैनन्), र **`{# comment #}`** ले comment लेख्छ जो rendered output बाट completely strip हुन्छ। **Filter** ले pipe operator प्रयोग गरेर value transform गर्छ: `{{ var | upper }}` ले uppercase convert गर्छ, `{{ list | join(',') }}` ले separator सहित list join गर्छ, `{{ value | default('fallback') }}` ले variable undefined हुन सक्दा safe default provide गर्छ, `{{ string | regex_replace('pattern', 'replacement') }}` ले string transform गर्छ, `{{ list | length }}` ले count return गर्छ। **Test** ले inline condition check गर्छ: `{{ var is defined }}`, `{{ var is none }}`, `{{ num is divisibleby(2) }}`। Template ले config file generate गर्न सबैभन्दा powerful छ: एउटा `nginx.conf.j2` template ले हरेक server को लागि correct, host-specific config generate गर्छ — `worker_processes` लाई `{{ ansible_processor_vcpus }}` बाट, `server_name` लाई `{{ ansible_hostname }}` बाट, listening port लाई `{{ nginx_port | default(80) }}` बाट। `{% for server in app_servers %}` loop सँग build भएको upstream block ले automatically group का हरेक host include गर्छ। Template `template` module सँग deploy हुन्छ, जसले file लेख्नुअघि Jinja2 syntax validate गर्छ र rendered content actually change भएको बेला मात्र handler (जस्तै nginx reload) trigger गर्छ।",
    jp: "**Jinja2** は Python/Flask から Ansible が継承したテンプレートエンジンです。**テンプレートファイル**（`template` モジュールで管理対象ホストにデプロイされる `.j2` ファイル）とプレイブック YAML の**インライン式**の両方を動かします — タスク名・`when:` 条件・`with_items:` ループ・モジュール引数はすべて Jinja2 を受け付けます。3 つの Jinja2 構文があります：**`{{ expression }}`** は値を出力します（変数置換）、**`{% statement %}`** はフローを制御します（if/for/set — これ自体は出力を生成しません）、**`{# comment #}`** はレンダリング出力から完全に除去されるコメントを書きます。**フィルター**はパイプ演算子を使って値を変換します：`{{ var | upper }}` は大文字に変換、`{{ list | join(',') }}` はセパレーターでリストを結合、`{{ value | default('fallback') }}` は変数が未定義の場合に安全なデフォルトを提供、`{{ string | regex_replace('pattern', 'replacement') }}` は文字列を変換、`{{ list | length }}` はカウントを返します。**テスト**はインラインで条件をチェックします：`{{ var is defined }}`・`{{ var is none }}`・`{{ num is divisibleby(2) }}`。テンプレートは設定ファイルの生成に最も強力です：単一の `nginx.conf.j2` テンプレートがすべてのサーバーに対して正確なホスト固有の設定を生成します — `worker_processes` は `{{ ansible_processor_vcpus }}` から、`server_name` は `{{ ansible_hostname }}` から、リスニングポートは `{{ nginx_port | default(80) }}` から。`{% for server in app_servers %}` ループで構築されたアップストリームブロックはグループのすべてのホストを自動的に含めます。テンプレートは `template` モジュールでデプロイされ、ファイルを書く前に Jinja2 構文を検証し、レンダリングされたコンテンツが実際に変更された場合にのみハンドラー（例：nginx のリロード）をトリガーします。",
  } as const,
};

export const DEVOPS_DAY_75_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Variable precedence & Jinja2 expressions",
        np: "Variable precedence र Jinja2 expression",
        jp: "変数の優先順位と Jinja2 式",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-templates" },
        {
          type: "table",
          caption: {
            en: "Jinja2 filters — most useful for DevOps config templates",
            np: "Jinja2 filter — DevOps config template को लागि सबैभन्दा useful",
            jp: "Jinja2 フィルター — DevOps 設定テンプレートで最も役立つもの",
          },
          headers: [
            { en: "Filter", np: "Filter", jp: "フィルター" },
            { en: "Input → Output", np: "Input → Output", jp: "入力 → 出力" },
            { en: "Use case", np: "Use case", jp: "ユースケース" },
            { en: "Example", np: "Example", jp: "例" },
          ],
          rows: [
            [
              { en: "`default(value)`", np: "`default(value)`", jp: "`default(value)`" },
              { en: "undefined → fallback value", np: "undefined → fallback value", jp: "undefined → フォールバック値" },
              { en: "Safe defaults when var may not be set", np: "Variable set नभएको बेला safe default", jp: "変数が未設定の場合の安全なデフォルト" },
              { en: "`{{ db_port \\| default(5432) }}`", np: "`{{ db_port \\| default(5432) }}`", jp: "`{{ db_port \\| default(5432) }}`" },
            ],
            [
              { en: "`upper`", np: "`upper`", jp: "`upper`" },
              { en: "`\"nginx\"` → `\"NGINX\"`", np: "`\"nginx\"` → `\"NGINX\"`", jp: "`\"nginx\"` → `\"NGINX\"`" },
              { en: "Config file headers, env var names", np: "Config file header, env var name", jp: "設定ファイルのヘッダー・環境変数名" },
              { en: "`{{ app_name \\| upper }}`", np: "`{{ app_name \\| upper }}`", jp: "`{{ app_name \\| upper }}`" },
            ],
            [
              { en: "`lower`", np: "`lower`", jp: "`lower`" },
              { en: "`\"Ubuntu\"` → `\"ubuntu\"`", np: "`\"Ubuntu\"` → `\"ubuntu\"`", jp: "`\"Ubuntu\"` → `\"ubuntu\"`" },
              { en: "Normalize OS names for comparisons", np: "Comparison को लागि OS name normalize", jp: "比較のための OS 名の正規化" },
              { en: "`{{ ansible_distribution \\| lower }}`", np: "`{{ ansible_distribution \\| lower }}`", jp: "`{{ ansible_distribution \\| lower }}`" },
            ],
            [
              { en: "`join(sep)`", np: "`join(sep)`", jp: "`join(sep)`" },
              { en: "`[\"a\",\"b\",\"c\"]` → `\"a,b,c\"`", np: "`[\"a\",\"b\",\"c\"]` → `\"a,b,c\"`", jp: "`[\"a\",\"b\",\"c\"]` → `\"a,b,c\"`" },
              { en: "Build comma-separated lists", np: "Comma-separated list build गर्न", jp: "カンマ区切りリストの構築" },
              { en: "`{{ allowed_ips \\| join(' ') }}`", np: "`{{ allowed_ips \\| join(' ') }}`", jp: "`{{ allowed_ips \\| join(' ') }}`" },
            ],
            [
              { en: "`length`", np: "`length`", jp: "`length`" },
              { en: "`[1,2,3]` → `3`", np: "`[1,2,3]` → `3`", jp: "`[1,2,3]` → `3`" },
              { en: "Loop counts, config sizing", np: "Loop count, config sizing", jp: "ループカウント・設定のサイジング" },
              { en: "`{{ servers \\| length }}`", np: "`{{ servers \\| length }}`", jp: "`{{ servers \\| length }}`" },
            ],
            [
              { en: "`int`", np: "`int`", jp: "`int`" },
              { en: "`\"8\"` → `8`", np: "`\"8\"` → `8`", jp: "`\"8\"` → `8`" },
              { en: "Convert string vars to integers", np: "String variable लाई integer convert", jp: "文字列変数を整数に変換" },
              { en: "`{{ workers \\| int * 2 }}`", np: "`{{ workers \\| int * 2 }}`", jp: "`{{ workers \\| int * 2 }}`" },
            ],
            [
              { en: "`to_nice_yaml`", np: "`to_nice_yaml`", jp: "`to_nice_yaml`" },
              { en: "dict → formatted YAML", np: "dict → formatted YAML", jp: "dict → フォーマットされた YAML" },
              { en: "Debug output, config generation", np: "Debug output, config generation", jp: "デバッグ出力・設定生成" },
              { en: "`{{ vars \\| to_nice_yaml }}`", np: "`{{ vars \\| to_nice_yaml }}`", jp: "`{{ vars \\| to_nice_yaml }}`" },
            ],
            [
              { en: "`regex_replace(p,r)`", np: "`regex_replace(p,r)`", jp: "`regex_replace(p,r)`" },
              { en: "Transform strings", np: "String transform गर्न", jp: "文字列の変換" },
              { en: "Config value normalization", np: "Config value normalization", jp: "設定値の正規化" },
              { en: "`{{ path \\| regex_replace('^/', '') }}`", np: "`{{ path \\| regex_replace('^/', '') }}`", jp: "`{{ path \\| regex_replace('^/', '') }}`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Templates in practice — nginx, app configs & variable files",
        np: "Template practice मा — nginx, app config र variable file",
        jp: "実践のテンプレート — nginx・アプリ設定・変数ファイル",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Variable definitions, vars_files, set_fact & Jinja2 templates",
            np: "Variable definition, vars_files, set_fact र Jinja2 template",
            jp: "変数定義・vars_files・set_fact・Jinja2 テンプレート",
          },
          code: `# ── Playbook with vars block, vars_files, set_fact & vars_prompt ─
# site.yml
---
- name: Configure application servers
  hosts: webservers
  become: yes

  vars:
    app:
      name: myapp
      port: 8080
      workers: 4
    allowed_hosts:
      - web1.example.com
      - web2.example.com
      - lb1.example.com
    debug_mode: false

  vars_files:
    - vars/secrets.yml      # load external YAML file (e.g. db passwords)

  vars_prompt:
    - name: deploy_password
      prompt: "Enter deployment password"
      private: yes           # input hidden when typing

  tasks:
    - name: Compute worker thread count from CPU facts
      set_fact:
        worker_count: "{{ ansible_processor_vcpus * 2 }}"

    - name: Show all variables for this host (troubleshooting)
      debug:
        msg: "{{ hostvars[inventory_hostname] | to_nice_yaml }}"

    - name: Show just the vars dict
      debug:
        var: vars

    - name: Deploy nginx config from Jinja2 template
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: '0644'
      notify: reload nginx

    - name: Deploy app config
      template:
        src: templates/app.conf.j2
        dest: /etc/myapp/app.conf
      notify: restart myapp

    - name: Run migration (production only, debug disabled)
      command: /opt/myapp/migrate.sh
      when: env == 'production' and not (debug_mode | bool)

  handlers:
    - name: reload nginx
      service:
        name: nginx
        state: reloaded
    - name: restart myapp
      service:
        name: myapp
        state: restarted

# ── templates/nginx.conf.j2 ───────────────────────────────────────
# Jinja2 template — {{ }} outputs, {% %} controls flow, {# #} comments

{# nginx.conf — generated by Ansible, do not edit manually #}
worker_processes {{ ansible_processor_vcpus }};
pid /run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    upstream app_backend {
        {# loop over all app_servers in the group variable #}
        {% for server in app_servers %}
        server {{ server }}:{{ app.port }};
        {% endfor %}
    }

    server {
        listen {{ nginx_port | default(80) }};
        server_name {{ ansible_hostname }};

        {% if ssl_enabled | default(false) %}
        listen 443 ssl;
        ssl_certificate     /etc/ssl/certs/{{ ansible_hostname }}.crt;
        ssl_certificate_key /etc/ssl/private/{{ ansible_hostname }}.key;
        ssl_protocols       TLSv1.2 TLSv1.3;
        {% endif %}

        location / {
            proxy_pass http://app_backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}

# ── templates/app.conf.j2 ─────────────────────────────────────────
[app]
name     = {{ app.name }}
port     = {{ app.port }}
workers  = {{ worker_count }}

[security]
allowed_hosts = {% for host in allowed_hosts %}{{ host }}{% if not loop.last %},{% endif %}{% endfor %}

[database]
{% if env == 'production' %}
host = db-primary.internal
pool = 20
{% else %}
host = db-dev.internal
pool = 5
{% endif %}

# ── group_vars/all.yml ────────────────────────────────────────────
# Variables available to every host in the inventory
app_servers:
  - 10.0.0.10
  - 10.0.0.11
  - 10.0.0.12
nginx_port: 80
env: dev

# ── group_vars/webservers.yml ─────────────────────────────────────
# Overrides all.yml for hosts in [webservers]
nginx_port: 8080
ssl_enabled: false

# ── host_vars/web1.yml ────────────────────────────────────────────
# Overrides group_vars for web1 specifically
nginx_port: 9090
ssl_enabled: true

# ── Run the playbook ──────────────────────────────────────────────
ansible-playbook -i inventory.ini site.yml
ansible-playbook -i inventory.ini site.yml -e env=production
ansible-playbook -i inventory.ini site.yml -e "env=production nginx_port=443"

# ── Verify rendered template on managed host ──────────────────────
ansible all -m command -a "cat /etc/nginx/nginx.conf"`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Create a `vars/main.yml` file with nested app configuration: `app: { name: myapp, port: 8080, workers: 4 }` and a list `allowed_hosts: [web1, web2, lb1]`. Write a playbook that loads this file with `vars_files`, uses `set_fact` to compute `worker_threads: \"{{ app.workers * 2 }}\"`, and uses the `debug` module to print all three: the app dict (`{{ app | to_nice_yaml }}`), the allowed_hosts joined with commas (`{{ allowed_hosts | join(', ') }}`), and worker_threads. Confirm the output matches expected values.",
              np: "`vars/main.yml` file create गर्नुहोस् nested app configuration सहित: `app: { name: myapp, port: 8080, workers: 4 }` र list `allowed_hosts: [web1, web2, lb1]`। `vars_files` सँग यो file load गर्ने playbook लेख्नुहोस्, `set_fact` प्रयोग गरेर `worker_threads: \"{{ app.workers * 2 }}\"` compute गर्नुहोस्, र तीनैवटा print गर्न `debug` module प्रयोग गर्नुहोस्: app dict (`{{ app | to_nice_yaml }}`), comma join गरिएको allowed_hosts (`{{ allowed_hosts | join(', ') }}`), र worker_threads। Output expected value सँग match गर्छ confirm गर्नुहोस्।",
              jp: "`vars/main.yml` ファイルをネストされたアプリ設定で作成する：`app: { name: myapp, port: 8080, workers: 4 }` とリスト `allowed_hosts: [web1, web2, lb1]`。`vars_files` でこのファイルを読み込み、`set_fact` で `worker_threads: \"{{ app.workers * 2 }}\"` を計算し、`debug` モジュールで 3 つすべてを出力するプレイブックを書く：app dict（`{{ app | to_nice_yaml }}`）・カンマ結合の allowed_hosts（`{{ allowed_hosts | join(', ') }}`）・worker_threads。出力が期待値と一致することを確認する。",
            },
            {
              en: "Write an nginx.conf.j2 template that uses `{{ ansible_processor_vcpus }}` for worker_processes, loops over a `backends` list variable to build an upstream block (`{% for b in backends %}server {{ b }};{% endfor %}`), and uses `{% if ssl_enabled | default(false) %}` to conditionally include SSL directives. Deploy it with the `template` module. View the rendered file on the managed host with `ansible all -m command -a \"cat /etc/nginx/nginx.conf\"` — verify variables are substituted and the for loop generated correct upstream entries.",
              np: "`{{ ansible_processor_vcpus }}` को worker_processes को लागि, `backends` list variable मा loop गरेर upstream block build गर्ने (`{% for b in backends %}server {{ b }};{% endfor %}`), र SSL directive conditionally include गर्न `{% if ssl_enabled | default(false) %}` प्रयोग गर्ने nginx.conf.j2 template लेख्नुहोस्। `template` module सँग deploy गर्नुहोस्। `ansible all -m command -a \"cat /etc/nginx/nginx.conf\"` सँग managed host मा rendered file हेर्नुहोस् — variable substitute भएको र for loop ले correct upstream entry generate गरेको verify गर्नुहोस्।",
              jp: "`{{ ansible_processor_vcpus }}` を worker_processes に使い、`backends` リスト変数をループしてアップストリームブロックを構築し（`{% for b in backends %}server {{ b }};{% endfor %}`）、`{% if ssl_enabled | default(false) %}` で SSL ディレクティブを条件付きで含める nginx.conf.j2 テンプレートを書く。`template` モジュールでデプロイする。`ansible all -m command -a \"cat /etc/nginx/nginx.conf\"` で管理対象ホストのレンダリングされたファイルを確認する — 変数が置換されており for ループが正しいアップストリームエントリを生成したことを検証する。",
            },
            {
              en: "Demonstrate variable precedence in practice. Define `http_port: 80` in `group_vars/all.yml`, override with `http_port: 8080` in `group_vars/webservers.yml`, and override again with `http_port: 9090` in `host_vars/web1.yml`. Write a playbook that prints `{{ http_port }}` for each host. Confirm web1 gets 9090, other webservers get 8080, dbservers get 80. Then pass `-e http_port=443` on the command line and confirm that ALL hosts now get 443, regardless of inventory vars (extra-vars wins over everything).",
              np: "Variable precedence practice मा demonstrate गर्नुहोस्। `group_vars/all.yml` मा `http_port: 80` define गर्नुहोस्, `group_vars/webservers.yml` मा `http_port: 8080` सँग override गर्नुहोस्, र `host_vars/web1.yml` मा `http_port: 9090` सँग फेरि override गर्नुहोस्। हरेक host को लागि `{{ http_port }}` print गर्ने playbook लेख्नुहोस्। web1 लाई 9090, अरू webserver लाई 8080, dbserver लाई 80 मिल्छ confirm गर्नुहोस्। त्यसपछि command line मा `-e http_port=443` pass गर्नुहोस् र inventory var चाहे जे होस् सबै host लाई 443 मिल्छ confirm गर्नुहोस् (extra-var ले सबैमाथि जित्छ)।",
              jp: "変数の優先順位を実践で示す。`group_vars/all.yml` に `http_port: 80` を定義し、`group_vars/webservers.yml` で `http_port: 8080` に上書きし、`host_vars/web1.yml` で `http_port: 9090` に再度上書きする。各ホストの `{{ http_port }}` を出力するプレイブックを書く。web1 が 9090、他の webservers が 8080、dbservers が 80 を受け取ることを確認する。次にコマンドラインで `-e http_port=443` を渡して、インベントリ変数に関わらずすべてのホストが 443 を受け取ることを確認する（extra-var がすべてに勝つ）。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do you pass variables between hosts in a playbook using `hostvars`?",
        np: "`hostvars` प्रयोग गरेर playbook मा host बीच variable कसरी pass गर्ने?",
        jp: "`hostvars` を使ってプレイブックでホスト間に変数を渡す方法は？",
      },
      answer: {
        en: "`hostvars` is a special Ansible variable that contains facts and variables for ALL hosts in the inventory, accessible from any host during a play. This lets you reference another host's information in a task running on a different host. Syntax: `{{ hostvars['web1']['ansible_default_ipv4']['address'] }}` — get web1's primary IP from any other host. A common use case is configuring a load balancer with the IPs of all web servers: in an HAProxy template you write `{% for host in groups['webservers'] %}server {{ hostvars[host]['ansible_default_ipv4']['address'] }};{% endfor %}` and every web server IP is automatically included. Important caveat: `hostvars` only contains facts for hosts whose facts have been gathered in the current playbook run. If a host was not targeted in any play yet, `hostvars[host]` may be empty. Solution: add a dedicated fact-gathering play at the top of your playbook: `- hosts: all / gather_facts: true / tasks: []` — this pre-populates hostvars for all hosts before the main plays run. Another use: get the database primary's hostname when configuring application servers: `{{ hostvars[groups['dbservers'][0]]['ansible_hostname'] }}` retrieves the first dbserver's hostname without needing to hardcode it in any variable file.",
        np: "`hostvars` एउटा special Ansible variable हो जसमा inventory का सबै host को fact र variable छ, play को दौरान जुनसुकै host बाट accessible। यसले तपाईंलाई different host मा running task मा अर्को host को information reference गर्न दिन्छ। Syntax: `{{ hostvars['web1']['ansible_default_ipv4']['address'] }}` — जुनसुकै अर्को host बाट web1 को primary IP लिन। एउटा common use case load balancer लाई सबै web server को IP सँग configure गर्नु हो: HAProxy template मा `{% for host in groups['webservers'] %}server {{ hostvars[host]['ansible_default_ipv4']['address'] }};{% endfor %}` लेख्नुहोस् र हरेक web server IP automatically include हुन्छ। Important caveat: `hostvars` मा current playbook run मा fact gather भएको host मात्र हुन्छ। कुनै host अझसम्म कुनै play मा target नभएको छ भने, `hostvars[host]` empty हुन सक्छ। Solution: playbook को माथि dedicated fact-gathering play add गर्नुहोस्: `- hosts: all / gather_facts: true / tasks: []` — यसले main play run हुनुअघि सबै host को hostvars pre-populate गर्छ। अर्को use: application server configure गर्दा database primary को hostname लिन: `{{ hostvars[groups['dbservers'][0]]['ansible_hostname'] }}` ले पहिलो dbserver को hostname retrieve गर्छ बिना कुनै variable file मा hardcode गरेको।",
        jp: "`hostvars` はインベントリのすべてのホストのファクトと変数を含む特別な Ansible 変数で、プレイ中の任意のホストからアクセスできます。これにより、別のホストで実行されているタスクから別のホストの情報を参照できます。構文：`{{ hostvars['web1']['ansible_default_ipv4']['address'] }}` — 他のホストから web1 のプライマリ IP を取得。一般的なユースケースはすべての Web サーバーの IP でロードバランサーを設定することです：HAProxy テンプレートに `{% for host in groups['webservers'] %}server {{ hostvars[host]['ansible_default_ipv4']['address'] }};{% endfor %}` と書くと、すべての Web サーバーの IP が自動的に含まれます。重要な注意点：`hostvars` には現在のプレイブック実行でファクトが収集されたホストの情報のみ含まれます。ホストがまだどのプレイにもターゲットにされていなければ `hostvars[host]` は空になる場合があります。解決策：プレイブックの先頭に専用のファクト収集プレイを追加する：`- hosts: all / gather_facts: true / tasks: []` — これはメインのプレイが実行される前にすべてのホストの hostvars を事前に設定します。別の使い方：アプリケーションサーバーを設定するときにデータベースプライマリのホスト名を取得する：`{{ hostvars[groups['dbservers'][0]]['ansible_hostname'] }}` は変数ファイルにハードコードせずに最初の dbserver のホスト名を取得します。",
      },
      tag: {
        en: "hostvars cross-host",
        np: "hostvars cross-host",
        jp: "hostvars クロスホスト",
      },
    },
    {
      question: {
        en: "What is the difference between `vars`, `defaults`, `set_fact`, and `extra_vars`, and when should you use each?",
        np: "`vars`, `defaults`, `set_fact`, र `extra_vars` बीचको फरक के हो, र प्रत्येक कहिले प्रयोग गर्ने?",
        jp: "`vars`・`defaults`・`set_fact`・`extra_vars` の違いは何か、それぞれいつ使うべきか？",
      },
      answer: {
        en: "These four variable sources serve different purposes in a clean variable architecture. **`defaults`** (role defaults — covered in Day 76): the lowest precedence source. Use for sensible defaults that operators should be able to easily override — e.g., `nginx_port: 80`. The whole point of defaults is that anyone using your role can change them without editing the role itself. **`vars`** (in a playbook `vars:` block or role `vars/main.yml`): higher precedence than inventory. Use for values that are fixed for this playbook or role and should NOT be overridden by inventory vars — e.g., `nginx_pid_file: /run/nginx.pid`. If you put something in `vars:`, you are saying \"this is an implementation detail, not a tunable parameter.\" **`set_fact`**: computed at runtime from other variables or registered task output — e.g., `worker_count: \"{{ ansible_processor_vcpus * 2 }}\"`. Scoped to the current host for the rest of the play. Use for derived values that depend on facts gathered at runtime (you can't know CPU count at playbook-write time). **`extra_vars` (`-e`)**: the absolute highest precedence — overrides everything, including `vars:` blocks. Use for: environment selection at run time (`-e env=production`), CI/CD pipeline parameters injected at deploy time, and emergency overrides when you need to change a value immediately without editing files. Architecture rule of thumb: put tunable parameters in `defaults`, fixed internal values in `vars`, computed values in `set_fact`, and deployment-time parameters in `extra_vars`. This structure makes your roles flexible and reusable without sacrificing predictability.",
        np: "यी चारवटा variable source ले clean variable architecture मा different purpose serve गर्छन्। **`defaults`** (role default — Day 76 मा cover हुन्छ): सबैभन्दा कम precedence source। Operator ले easily override गर्न सक्ने sensible default को लागि प्रयोग गर्नुहोस् — जस्तै, `nginx_port: 80`। Default को पूरा उद्देश्य नै यो हो कि तपाईंको role प्रयोग गर्ने कसैले role नै edit नगरी change गर्न सक्छ। **`vars`** (playbook को `vars:` block वा role को `vars/main.yml` मा): inventory भन्दा बढी precedence। यो playbook वा role को लागि fixed र inventory var ले override गर्नु नहुने value को लागि प्रयोग गर्नुहोस् — जस्तै, `nginx_pid_file: /run/nginx.pid`। `vars:` मा केही राख्नु भनेको \"यो tunable parameter होइन, implementation detail हो\" भन्नु हो। **`set_fact`**: अरू variable वा registered task output बाट runtime मा compute — जस्तै, `worker_count: \"{{ ansible_processor_vcpus * 2 }}\"` । Play को बाँकी भागको लागि current host मा scoped। Runtime मा gather भएको fact मा depend गर्ने derived value को लागि प्रयोग गर्नुहोस् (playbook लेख्दा CPU count थाहा हुँदैन)। **`extra_vars` (`-e`)**: absolute highest precedence — `vars:` block सहित सबै override गर्छ। यसको लागि प्रयोग गर्नुहोस्: run time मा environment selection (`-e env=production`), deploy time मा inject गरिएको CI/CD pipeline parameter, र file edit नगरी तुरुन्त value change गर्नुपरेको emergency override। Architecture rule of thumb: tunable parameter लाई `defaults` मा, fixed internal value लाई `vars` मा, computed value लाई `set_fact` मा, र deployment-time parameter लाई `extra_vars` मा राख्नुहोस्। यो structure ले predictability sacrifice नगरी role लाई flexible र reusable बनाउँछ।",
        jp: "これら 4 つの変数ソースはクリーンな変数アーキテクチャで異なる目的を果たします。**`defaults`**（ロールデフォルト — Day 76 で扱う）：最低優先順位のソース。オペレーターが簡単にオーバーライドできるデフォルト値に使用します — 例：`nginx_port: 80`。デフォルトの要点は、ロールを使用する誰でもロール自体を編集せずに変更できることです。**`vars`**（プレイブックの `vars:` ブロックまたはロールの `vars/main.yml`）：インベントリより高い優先順位。このプレイブックまたはロールで固定されており、インベントリ変数でオーバーライドすべきでない値に使用します — 例：`nginx_pid_file: /run/nginx.pid`。`vars:` に何かを置くことは「これはチューニング可能なパラメーターではなく実装の詳細である」と言うことです。**`set_fact`**：他の変数や登録されたタスク出力から実行時に計算 — 例：`worker_count: \"{{ ansible_processor_vcpus * 2 }}\"`。プレイの残りの期間現在のホストにスコープされます。実行時に収集されたファクトに依存する派生値に使用します（プレイブック作成時には CPU 数を知ることができません）。**`extra_vars`（`-e`）**：絶対的に最高の優先順位 — `vars:` ブロックを含むすべてをオーバーライドします。これを使用する場合：実行時の環境選択（`-e env=production`）・デプロイ時に注入される CI/CD パイプラインパラメーター・ファイルを編集せずに値をすぐに変更する必要がある緊急オーバーライド。アーキテクチャの経験則：チューニング可能なパラメーターを `defaults` に、固定の内部値を `vars` に、計算された値を `set_fact` に、デプロイ時のパラメーターを `extra_vars` に置く。この構造により予測可能性を犠牲にせずにロールを柔軟で再利用可能にします。",
      },
      tag: {
        en: "variable architecture",
        np: "variable architecture",
        jp: "変数アーキテクチャ",
      },
    },
  ],
};
