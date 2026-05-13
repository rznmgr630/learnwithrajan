import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "A **playbook** is a YAML file that describes an ordered set of **plays**. Each play targets a group of hosts (from your inventory) and defines an ordered list of **tasks** to run on those hosts. A **task** is a single module invocation — you call a module (`apt`, `template`, `service`, `copy`, `command`) with arguments and optional metadata: `name`, `when`, `loop`, `register`, `notify`, `tags`, `become`, `ignore_errors`, `failed_when`, `changed_when`. Playbooks are the core unit of Ansible automation — they encode your infrastructure knowledge in a repeatable, reviewable, version-controllable form. The anatomy of a playbook: `---` (YAML document start marker), `- name:` (play name — describes what this play does), `hosts:` (inventory group or hostname to target — `webservers`, `all`, `db*`), `become:` (privilege escalation — `true` to run tasks as root via sudo), `vars:` (play-level variables that override inventory vars), `tasks:` (ordered list of tasks — each task maps to one module call). The `name:` field on both plays and tasks is not optional fluff — it appears in Ansible's output at runtime and serves as inline documentation. A playbook with well-written task names reads exactly like a deployment runbook: 'Install Nginx web server', 'Deploy application config', 'Ensure Nginx is started and enabled'. Anyone who has never seen the playbook before can understand what it does just by reading the task names.",
    np: "**Playbook** एउटा YAML file हो जसले **play** को ordered set describe गर्छ। प्रत्येक play ले hosts को group (inventory बाट) target गर्छ र ती hosts मा run गर्न **task** को ordered list define गर्छ। **Task** भनेको single module invocation हो — तपाईंले module (`apt`, `template`, `service`, `copy`, `command`) लाई argument र optional metadata सहित call गर्नुहुन्छ: `name`, `when`, `loop`, `register`, `notify`, `tags`, `become`, `ignore_errors`, `failed_when`, `changed_when`। Playbook Ansible automation को core unit हो — यसले तपाईंको infrastructure knowledge लाई repeatable, reviewable, version-controllable form मा encode गर्छ। Playbook को anatomy: `---` (YAML document start marker), `- name:` (play name — यो play के गर्छ describe गर्छ), `hosts:` (target गर्ने inventory group वा hostname — `webservers`, `all`, `db*`), `become:` (privilege escalation — sudo मार्फत root को रूपमा task run गर्न `true`), `vars:` (inventory var override गर्ने play-level variable), `tasks:` (task को ordered list — प्रत्येक task एउटा module call मा map हुन्छ)। Play र task दुवैमा `name:` field optional fluff होइन — यो runtime मा Ansible को output मा देखिन्छ र inline documentation को रूपमा serve गर्छ। राम्रो task name भएको playbook exactly deployment runbook जस्तै पढिन्छ: 'Install Nginx web server', 'Deploy application config', 'Ensure Nginx is started and enabled'। Playbook पहिले कहिल्यै नदेखेको जोसुकैले पनि task name पढेरै के गर्छ बुझ्न सक्छ।",
    jp: "**プレイブック**は**プレイ**の順序付きセットを記述する YAML ファイルです。各プレイはホストのグループ（インベントリから）をターゲットにし、それらのホストで実行する**タスク**の順序付きリストを定義します。**タスク**は単一のモジュール呼び出しです — モジュール（`apt`・`template`・`service`・`copy`・`command`）を引数とオプションのメタデータで呼び出します：`name`・`when`・`loop`・`register`・`notify`・`tags`・`become`・`ignore_errors`・`failed_when`・`changed_when`。プレイブックは Ansible 自動化のコアユニットです — インフラの知識を繰り返し可能・レビュー可能・バージョン管理可能な形式でエンコードします。プレイブックの構造：`---`（YAML ドキュメント開始マーカー）・`- name:`（プレイ名 — このプレイが何をするかを説明）・`hosts:`（ターゲットとなるインベントリグループまたはホスト名 — `webservers`・`all`・`db*`）・`become:`（権限昇格 — sudo 経由で root としてタスクを実行するには `true`）・`vars:`（インベントリ変数を上書きするプレイレベル変数）・`tasks:`（タスクの順序付きリスト — 各タスクは 1 つのモジュール呼び出しにマップ）。プレイとタスクの両方の `name:` フィールドはオプションの飾りではありません — 実行時の Ansible の出力に表示されてインラインドキュメントとして機能します。タスク名がよく書かれたプレイブックはデプロイメントのランブックとまったく同じように読めます：'Install Nginx web server'・'Deploy application config'・'Ensure Nginx is started and enabled'。プレイブックを初めて見る人でもタスク名を読むだけで何をするかが分かります。",
  } as const,
  o2: {
    en: "Three advanced task features cover 90% of real-world Ansible usage. **`when` conditionals**: run a task only when a condition is true — `when: ansible_os_family == \"Debian\"` runs a task only on Debian/Ubuntu hosts; `when: result.rc != 0` runs a follow-up task only when the previous command returned a non-zero exit code. You can combine conditions: `when: ansible_distribution == \"Ubuntu\" and ansible_distribution_version is version('22.04', '>=')`. **`loop`** (the modern replacement for `with_items`): repeat a task for each item in a list. Use `{{ item }}` inside the task to refer to the current list element. Install multiple packages: `loop: [nginx, curl, git]` with `name: \"{{ item }}\"` in the `apt` module. Create multiple users, add multiple firewall rules, deploy multiple config files — all with a single task definition. **`register`**: capture a task's output (stdout, stderr, return code, changed status) into a variable for use in later tasks — `register: result`, then access `result.stdout`, `result.rc`, `result.changed`. Chain tasks: run a command, register its output, then conditionally run a follow-up task based on that output. **Handlers** are tasks that run only when *notified* by another task, and only once at the end of a play regardless of how many tasks notify them. Declare them in a `handlers:` section. A task notifies a handler with `notify: handler name`. The canonical use: a `template` task deploys an nginx config file and notifies `restart nginx`. If the template content changed, the handler fires once at play end and nginx restarts. If the template was identical (idempotent run), the task shows `ok` instead of `changed` and the handler never fires — no unnecessary restarts.",
    np: "तीनवटा advanced task feature ले real-world Ansible usage को 90% cover गर्छ। **`when` conditional**: condition true भएमा मात्र task run गर्नुहोस् — `when: ansible_os_family == \"Debian\"` ले Debian/Ubuntu host मा मात्र task run गर्छ; `when: result.rc != 0` ले previous command ले non-zero exit code return गरेमा मात्र follow-up task run गर्छ। Condition combine गर्न सकिन्छ: `when: ansible_distribution == \"Ubuntu\" and ansible_distribution_version is version('22.04', '>=')`. **`loop`** (`with_items` को modern replacement): list को प्रत्येक item को लागि task repeat गर्नुहोस्। Current list element refer गर्न task भित्र `{{ item }}` प्रयोग गर्नुहोस्। Multiple package install: `apt` module मा `name: \"{{ item }}\"`  सहित `loop: [nginx, curl, git]`। Multiple user create, multiple firewall rule add, multiple config file deploy — सबै single task definition सँग। **`register`**: task को output (stdout, stderr, return code, changed status) पछि आउने task मा प्रयोगको लागि variable मा capture गर्नुहोस् — `register: result`, त्यसपछि `result.stdout`, `result.rc`, `result.changed` access गर्नुहोस्। Task chain गर्नुहोस्: command run, output register, त्यसपछि output को आधारमा conditionally follow-up task run। **Handler** ती task हुन् जो अर्को task द्वारा *notify* भएमा मात्र run हुन्छन्, र play को अन्तमा एकपटक मात्र, जति task ले notify गरे पनि। तिनीहरूलाई `handlers:` section मा declare गर्नुहोस्। Task ले `notify: handler name` सँग handler लाई notify गर्छ। Canonical use: `template` task ले nginx config file deploy गर्छ र `restart nginx` notify गर्छ। Template content change भएमा, handler ले play end मा एकपटक fire गर्छ र nginx restart हुन्छ। Template identical थियो भने (idempotent run), task ले `changed` को सट्टा `ok` show गर्छ र handler कहिल्यै fire हुँदैन — unnecessary restart छैन।",
    jp: "3 つの高度なタスク機能が実際の Ansible 使用の 90% をカバーします。**`when` 条件**：条件が真のときのみタスクを実行します — `when: ansible_os_family == \"Debian\"` は Debian/Ubuntu ホストのみでタスクを実行します；`when: result.rc != 0` は前のコマンドが非ゼロの終了コードを返したときのみフォローアップタスクを実行します。条件を組み合わせることができます：`when: ansible_distribution == \"Ubuntu\" and ansible_distribution_version is version('22.04', '>=')`. **`loop`**（`with_items` の現代的な置き換え）：リストの各アイテムに対してタスクを繰り返します。タスク内で `{{ item }}` を使用して現在のリスト要素を参照します。複数のパッケージをインストール：`apt` モジュールで `name: \"{{ item }}\"` と `loop: [nginx, curl, git]`。複数のユーザー作成・複数のファイアウォールルール追加・複数の設定ファイルのデプロイ — すべて単一のタスク定義で。**`register`**：タスクの出力（stdout・stderr・リターンコード・変更ステータス）を後のタスクで使用するために変数にキャプチャします — `register: result`、その後 `result.stdout`・`result.rc`・`result.changed` にアクセス。タスクをチェーンする：コマンドを実行し、出力を登録し、その出力に基づいて条件付きでフォローアップタスクを実行。**ハンドラー**は他のタスクに*通知された*ときのみ実行されるタスクで、何個のタスクが通知しても、プレイの最後に一度だけ実行されます。`handlers:` セクションで宣言します。タスクは `notify: ハンドラー名` でハンドラーに通知します。典型的な使用例：`template` タスクが nginx の設定ファイルをデプロイして `restart nginx` に通知します。テンプレートの内容が変わった場合、ハンドラーはプレイ終了時に一度起動して nginx が再起動します。テンプレートが同一だった場合（べき等な実行）、タスクは `changed` の代わりに `ok` を表示してハンドラーは決して起動しません — 不要な再起動はありません。",
  } as const,
};

export const DEVOPS_DAY_74_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Playbook anatomy — plays, tasks, conditions & loops",
        np: "Playbook anatomy — play, task, condition र loop",
        jp: "プレイブックの構造 — プレイ・タスク・条件・ループ",
      },
      blocks: [
        { type: "diagram", id: "devops-ansible-playbook" },
        {
          type: "table",
          caption: {
            en: "Task execution control — when, loop, register & failed_when",
            np: "Task execution control — when, loop, register र failed_when",
            jp: "タスク実行制御 — when・loop・register・failed_when",
          },
          headers: [
            { en: "Directive", np: "Directive", jp: "ディレクティブ" },
            { en: "Purpose", np: "Purpose", jp: "目的" },
            { en: "Example", np: "Example", jp: "例" },
            { en: "Common pattern", np: "Common pattern", jp: "一般的なパターン" },
          ],
          rows: [
            [
              { en: "`name`", np: "`name`", jp: "`name`" },
              { en: "Human-readable task description", np: "Human-readable task description", jp: "人間が読めるタスクの説明" },
              { en: "`name: Install Nginx web server`", np: "`name: Install Nginx web server`", jp: "`name: Install Nginx web server`" },
              { en: "Always set — appears in output & is used by `--start-at-task`", np: "सधैँ set गर्नुहोस् — output मा देखिन्छ र `--start-at-task` ले प्रयोग गर्छ", jp: "常に設定する — 出力に表示され `--start-at-task` で使用される" },
            ],
            [
              { en: "`when`", np: "`when`", jp: "`when`" },
              { en: "Conditional execution", np: "Conditional execution", jp: "条件付き実行" },
              { en: "`when: ansible_os_family == \"Debian\"`", np: "`when: ansible_os_family == \"Debian\"`", jp: "`when: ansible_os_family == \"Debian\"`" },
              { en: "OS-conditional tasks; check registered output (`result.rc == 0`)", np: "OS-conditional task; registered output check (`result.rc == 0`)", jp: "OS 条件付きタスク；登録済み出力の確認（`result.rc == 0`）" },
            ],
            [
              { en: "`loop`", np: "`loop`", jp: "`loop`" },
              { en: "Repeat task for each list item", np: "प्रत्येक list item को लागि task repeat गर्नुहोस्", jp: "リストの各アイテムに対してタスクを繰り返す" },
              { en: "`loop: [nginx, curl, git]` with `{{ item }}` in args", np: "`loop: [nginx, curl, git]` args मा `{{ item }}` सहित", jp: "`loop: [nginx, curl, git]` と引数内の `{{ item }}`" },
              { en: "Install multiple packages, create multiple users/dirs", np: "Multiple package install, multiple user/dir create", jp: "複数パッケージのインストール・複数ユーザー/ディレクトリの作成" },
            ],
            [
              { en: "`register`", np: "`register`", jp: "`register`" },
              { en: "Save task output to a variable", np: "Task output variable मा save गर्नुहोस्", jp: "タスク出力を変数に保存する" },
              { en: "`register: nginx_status` then `when: nginx_status.rc != 0`", np: "`register: nginx_status` त्यसपछि `when: nginx_status.rc != 0`", jp: "`register: nginx_status` その後 `when: nginx_status.rc != 0`" },
              { en: "Check command output, conditionally run follow-up tasks", np: "Command output check, conditionally follow-up task run", jp: "コマンド出力の確認・条件付きフォローアップタスクの実行" },
            ],
            [
              { en: "`notify`", np: "`notify`", jp: "`notify`" },
              { en: "Trigger a handler on change", np: "Change मा handler trigger गर्नुहोस्", jp: "変更時にハンドラーをトリガーする" },
              { en: "`notify: restart nginx`", np: "`notify: restart nginx`", jp: "`notify: restart nginx`" },
              { en: "Config file changes that need a service restart", np: "Service restart आवश्यक पर्ने config file change", jp: "サービス再起動が必要な設定ファイルの変更" },
            ],
            [
              { en: "`ignore_errors`", np: "`ignore_errors`", jp: "`ignore_errors`" },
              { en: "Continue playbook on failure", np: "Failure मा playbook continue गर्नुहोस्", jp: "失敗時にプレイブックを続行する" },
              { en: "`ignore_errors: true`", np: "`ignore_errors: true`", jp: "`ignore_errors: true`" },
              { en: "Optional checks that shouldn't fail the play", np: "Play fail हुनु नहुने optional check", jp: "プレイを失敗させるべきでないオプションのチェック" },
            ],
            [
              { en: "`failed_when`", np: "`failed_when`", jp: "`failed_when`" },
              { en: "Custom failure condition", np: "Custom failure condition", jp: "カスタム失敗条件" },
              { en: "`failed_when: \"'ERROR' in result.stdout\"`", np: "`failed_when: \"'ERROR' in result.stdout\"`", jp: "`failed_when: \"'ERROR' in result.stdout\"`" },
              { en: "Commands that return 0 even on failure; make shell tasks smarter", np: "Failure मा पनि 0 return गर्ने command; shell task लाई smarter बनाउनुहोस्", jp: "失敗でも 0 を返すコマンド；シェルタスクをよりスマートにする" },
            ],
            [
              { en: "`changed_when`", np: "`changed_when`", jp: "`changed_when`" },
              { en: "Override \"changed\" detection", np: "\"changed\" detection override गर्नुहोस्", jp: "\"changed\" 検出を上書きする" },
              { en: "`changed_when: false`", np: "`changed_when: false`", jp: "`changed_when: false`" },
              { en: "Reporting-only tasks; commands with no side effects", np: "Reporting-only task; side effect नभएका command", jp: "報告専用タスク；副作用のないコマンド" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Handlers, tags & multi-play playbooks",
        np: "Handler, tag र multi-play playbook",
        jp: "ハンドラー・タグ・マルチプレイプレイブック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Full playbook — tasks, handlers, conditions, loops, register & tags",
            np: "Full playbook — task, handler, condition, loop, register र tag",
            jp: "フルプレイブック — タスク・ハンドラー・条件・ループ・register・タグ",
          },
          code: `# ── site.yml — full two-play deployment playbook ────────────────
---
# ── Play 1: configure web servers ────────────────────────────────
- name: Configure and deploy Nginx web servers
  hosts: webservers
  become: true
  vars:
    nginx_packages:
      - nginx
      - curl
      - git
    app_dirs:
      - /opt/app
      - /opt/app/logs
      - /opt/app/tmp
    nginx_worker_processes: auto

  pre_tasks:
    - name: Update apt cache before installing packages
      apt:
        update_cache: true
        cache_valid_time: 3600
      tags: [nginx, packages]

  tasks:
    # ── loop: install multiple packages in one task ───────────────
    - name: Install Nginx and supporting packages
      apt:
        name: "{{ item }}"
        state: present
      loop: "{{ nginx_packages }}"
      tags: [nginx, packages]

    # ── when: conditional task for Ubuntu vs Debian ───────────────
    - name: Enable Nginx UFW profile (Ubuntu only)
      community.general.ufw:
        rule: allow
        name: "Nginx Full"
      when: ansible_distribution == "Ubuntu"
      tags: [nginx, config]

    # ── loop: create multiple directories ─────────────────────────
    - name: Create application directories
      file:
        path: "{{ item }}"
        state: directory
        owner: www-data
        group: www-data
        mode: "0755"
      loop: "{{ app_dirs }}"
      tags: [config]

    # ── template + notify handler ─────────────────────────────────
    - name: Deploy Nginx main configuration
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/nginx.conf
        owner: root
        group: root
        mode: "0644"
        validate: "nginx -t -c %s"
      notify: reload nginx          # fires only when template changed
      tags: [nginx, config]

    - name: Deploy virtual host configuration
      template:
        src: templates/vhost.conf.j2
        dest: /etc/nginx/sites-available/myapp
        mode: "0644"
      notify: reload nginx
      tags: [nginx, config]

    - name: Enable virtual host
      file:
        src: /etc/nginx/sites-available/myapp
        dest: /etc/nginx/sites-enabled/myapp
        state: link
      notify: reload nginx
      tags: [nginx, config]

    # ── register + follow-up task with when ───────────────────────
    - name: Check if application binary exists
      command: ls /opt/app/bin/server
      register: app_binary_check
      ignore_errors: true
      changed_when: false          # ls has no side effects
      tags: [config]

    - name: Deploy application binary (first run only)
      copy:
        src: files/server
        dest: /opt/app/bin/server
        mode: "0755"
      when: app_binary_check.rc != 0
      tags: [config]

    # ── ensure service is running ─────────────────────────────────
    - name: Ensure Nginx is started and enabled
      service:
        name: nginx
        state: started
        enabled: true
      tags: [service]

  # ── handlers: run once at end of play when notified ──────────────
  handlers:
    - name: reload nginx
      service:
        name: nginx
        state: reloaded

    - name: restart nginx
      service:
        name: nginx
        state: restarted

  post_tasks:
    - name: Verify Nginx is serving requests
      uri:
        url: http://localhost/health
        status_code: 200
      tags: [service]

# ── Play 2: configure database servers ───────────────────────────
- name: Configure PostgreSQL database servers
  hosts: dbservers
  become: true

  tasks:
    - name: Install PostgreSQL
      apt:
        name: postgresql
        state: present
        update_cache: true

    - name: Ensure PostgreSQL is started and enabled
      service:
        name: postgresql
        state: started
        enabled: true

# ── Tags: run/skip specific parts of the playbook ────────────────
# Run only nginx install tasks:
#   ansible-playbook site.yml --tags nginx
#
# Run only config tasks:
#   ansible-playbook site.yml --tags config
#
# Skip install tasks (useful for config-only runs):
#   ansible-playbook site.yml --skip-tags packages
#
# List all tasks and their tags (dry-run):
#   ansible-playbook site.yml --list-tasks
#
# List all available tags:
#   ansible-playbook site.yml --list-tags

# ── Useful run flags ──────────────────────────────────────────────
# --check              dry-run: show what would change, make no changes
# --diff               show file diffs for template/copy tasks
# --step               interactive: prompt before each task (y/n/c)
# --start-at-task "Deploy Nginx main configuration"
#                      skip all tasks before the named task
# --limit webservers   run only against the webservers group
# --limit web1.example.com  run against a single host
# --list-tasks         print all task names without running
# --list-tags          print all tags without running
#
# Combine flags for safe production deploys:
#   ansible-playbook site.yml --check --diff --limit web1.example.com`,
        },
        {
          type: "list",
          variant: "number",
          items: [
            {
              en: "Write a playbook that installs and configures a web server. Use `loop` to install multiple packages (`nginx`, `curl`, `git`). Use a `template` task to deploy an `index.html.j2` template with `{{ ansible_hostname }}` and `{{ ansible_default_ipv4.address }}` embedded. Add a handler that restarts nginx when the template changes. Run the playbook, then change the template content and run again — observe that only the template task shows \"changed\" and the handler fires. Run a third time with no changes — confirm \"changed=0\" and the handler does NOT fire.",
              np: "Web server install र configure गर्ने playbook लेख्नुहोस्। Multiple package (`nginx`, `curl`, `git`) install गर्न `loop` प्रयोग गर्नुहोस्। `{{ ansible_hostname }}` र `{{ ansible_default_ipv4.address }}` embedded भएको `index.html.j2` template deploy गर्न `template` task प्रयोग गर्नुहोस्। Template change भएमा nginx restart गर्ने handler add गर्नुहोस्। Playbook run गर्नुहोस्, त्यसपछि template content change गरेर फेरि run गर्नुहोस् — template task मात्र \"changed\" show गर्छ र handler fire हुन्छ observe गर्नुहोस्। Change नगरी तेस्रो पटक run गर्नुहोस् — \"changed=0\" confirm गर्नुहोस् र handler fire हुँदैन।",
              jp: "Web サーバーをインストールして設定するプレイブックを書く。`loop` を使って複数のパッケージ（`nginx`・`curl`・`git`）をインストールする。`{{ ansible_hostname }}` と `{{ ansible_default_ipv4.address }}` を埋め込んだ `index.html.j2` テンプレートをデプロイする `template` タスクを使用する。テンプレートが変わったときに nginx を再起動するハンドラーを追加する。プレイブックを実行し、テンプレートの内容を変更して再実行する — template タスクのみが \"changed\" を表示してハンドラーが起動することを観察する。変更なしで 3 回目を実行する — \"changed=0\" を確認してハンドラーが起動しないことを確認する。",
            },
            {
              en: "Use `register` and `when` together. Write a task that checks if a file exists: `command: ls /opt/app/config.yml` with `register: config_check` and `ignore_errors: true`. Write a follow-up task that creates the file only if it doesn't exist: `when: config_check.rc != 0`. Run the playbook twice — first time both tasks should run (file created); second time only the check task runs and the create task is skipped (file already exists). This pattern is useful for one-time initialization tasks.",
              np: "`register` र `when` सँगै प्रयोग गर्नुहोस्। File exist छ कि check गर्ने task लेख्नुहोस्: `register: config_check` र `ignore_errors: true` सहित `command: ls /opt/app/config.yml`। File exist नभएमा मात्र file create गर्ने follow-up task लेख्नुहोस्: `when: config_check.rc != 0`। Playbook दुई पटक run गर्नुहोस् — पहिलो पटक दुवै task run हुनुपर्छ (file created); दोस्रो पटक check task मात्र run हुन्छ र create task skip हुन्छ (file already exists)। यो pattern one-time initialization task को लागि उपयोगी छ।",
              jp: "`register` と `when` を一緒に使う。ファイルが存在するかチェックするタスクを書く：`register: config_check` と `ignore_errors: true` を持つ `command: ls /opt/app/config.yml`。ファイルが存在しない場合のみファイルを作成するフォローアップタスクを書く：`when: config_check.rc != 0`。プレイブックを 2 回実行する — 最初は両方のタスクが実行される（ファイル作成）；2 回目はチェックタスクのみが実行されて作成タスクはスキップされる（ファイルが既に存在）。このパターンは一回限りの初期化タスクに役立ちます。",
            },
            {
              en: "Add tags to your playbook. Tag the nginx installation tasks with `nginx`, config tasks with `config`, and service management with `service`. Run `ansible-playbook site.yml --list-tasks` to see all tasks and their tags. Then run only the config tasks: `ansible-playbook site.yml --tags config`. Run everything except the install tasks: `ansible-playbook site.yml --skip-tags nginx`. Use `--step` to step through tasks interactively and decide to run or skip each one.",
              np: "Playbook मा tag add गर्नुहोस्। Nginx installation task लाई `nginx`, config task लाई `config`, र service management लाई `service` tag गर्नुहोस्। सबै task र तिनका tag हेर्न `ansible-playbook site.yml --list-tasks` run गर्नुहोस्। त्यसपछि config task मात्र run गर्नुहोस्: `ansible-playbook site.yml --tags config`। Install task बाहेक सबै run गर्नुहोस्: `ansible-playbook site.yml --skip-tags nginx`। `--step` प्रयोग गरेर task हरू interactively step through गर्नुहोस् र प्रत्येक run वा skip गर्ने decide गर्नुहोस्।",
              jp: "プレイブックにタグを追加する。nginx インストールタスクに `nginx`・設定タスクに `config`・サービス管理に `service` をタグ付けする。`ansible-playbook site.yml --list-tasks` を実行してすべてのタスクとそのタグを表示する。次に設定タスクのみを実行する：`ansible-playbook site.yml --tags config`。インストールタスク以外をすべて実行する：`ansible-playbook site.yml --skip-tags nginx`。`--step` を使ってタスクをインタラクティブにステップスルーして各タスクを実行するかスキップするかを決定する。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why do handlers only run once even when notified multiple times, and when does this cause problems?",
        np: "Handler multiple times notify भए पनि एकपटक मात्र किन run हुन्छ, र यसले कहिले problem गर्छ?",
        jp: "ハンドラーは複数回通知されても一度しか実行されないのはなぜか、これがいつ問題を引き起こすか？",
      },
      answer: {
        en: "Handlers are designed to run **once per play** at the end, regardless of how many tasks notify them. This is intentional: if 10 config file tasks all notify \"restart nginx,\" Ansible should restart nginx once — not 10 times. This deduplication is done by handler name. This behavior causes a problem when: a task in the middle of a play makes a change, notifies a handler, then a **later task fails** — the handler never runs because the play aborted. Your config was updated but the service wasn't restarted. Solutions: (1) use `--force-handlers` flag: `ansible-playbook site.yml --force-handlers` — handlers run even if the play fails; (2) use `meta: flush_handlers` in the task list to run all pending handlers immediately at that point in the play; (3) restructure to put critical changes and their handlers in a separate play so a later play's failure doesn't affect them. For deployment playbooks, `meta: flush_handlers` after config changes before smoke tests is a common pattern.",
        np: "Handler ले play को end मा **एकपटक** run गर्न design गरिएको छ, जति task ले notify गरे पनि। यो intentional हो: 10 config file task सबैले \"restart nginx\" notify गर्छन् भने Ansible ले nginx एकपटक restart गर्नुपर्छ — 10 पटक होइन। यो deduplication handler name द्वारा गरिन्छ। यो behavior problem गर्छ जब: play को बीचमा task ले change गर्छ, handler notify गर्छ, त्यसपछि **पछिको task fail हुन्छ** — play abort भएकोले handler कहिल्यै run हुँदैन। Config update भयो तर service restart भएन। Solution: (1) `--force-handlers` flag प्रयोग गर्नुहोस्: `ansible-playbook site.yml --force-handlers` — play fail भए पनि handler run हुन्छ; (2) play को त्यो बिन्दुमा pending handler immediately run गर्न task list मा `meta: flush_handlers` प्रयोग गर्नुहोस्; (3) critical change र तिनका handler छुट्टै play मा राख्न restructure गर्नुहोस् ताकि पछिको play को failure ले असर नगरोस्। Deployment playbook को लागि, smoke test अघि config change पछि `meta: flush_handlers` common pattern हो।",
        jp: "ハンドラーは何個のタスクが通知しても、プレイの最後に**一度**だけ実行されるように設計されています。これは意図的なものです：10 の設定ファイルタスクがすべて \"restart nginx\" を通知する場合、Ansible は nginx を一度再起動すべきです — 10 回ではありません。この重複排除はハンドラー名によって行われます。この動作が問題を引き起こすのは：プレイの途中のタスクが変更を行い、ハンドラーを通知し、その後**後のタスクが失敗した**場合 — プレイが中断されたためハンドラーは実行されません。設定は更新されたがサービスは再起動されませんでした。解決策：(1) `--force-handlers` フラグを使用：`ansible-playbook site.yml --force-handlers` — プレイが失敗してもハンドラーが実行される；(2) タスクリストの `meta: flush_handlers` を使用してプレイのその時点で保留中のすべてのハンドラーを即座に実行する；(3) 重要な変更とそのハンドラーを別のプレイに置いて後のプレイの失敗が影響しないように再構成する。デプロイメントプレイブックでは、スモークテスト前の設定変更後の `meta: flush_handlers` が一般的なパターンです。",
      },
      tag: {
        en: "handler execution order",
        np: "Handler execution order",
        jp: "ハンドラー実行順序",
      },
    },
    {
      question: {
        en: "What is the difference between `include_tasks` and `import_tasks`?",
        np: "`include_tasks` र `import_tasks` बीचको फरक के हो?",
        jp: "`include_tasks` と `import_tasks` の違いは何か？",
      },
      answer: {
        en: "Both let you split a large playbook into multiple files, but they differ in WHEN the inclusion happens. **`import_tasks`** (static): Ansible processes the import at parse time before the playbook runs. All tasks from the imported file are effectively copy-pasted into the parent playbook. Pro: `--list-tasks` shows imported tasks; tags on `import_tasks` apply to all imported tasks. Con: you can't use variables in the filename (`import_tasks: \"{{ env }}_tasks.yml\"` won't work — the variable isn't resolved yet). **`include_tasks`** (dynamic): Ansible processes the include at runtime when that point in the playbook is reached. Pro: you can use variables in the filename — `include_tasks: \"{{ ansible_os_family }}_tasks.yml\"` works perfectly for OS-specific task files. Con: `--list-tasks` doesn't show included tasks (they're not known until runtime); tags on `include_tasks` only apply to the include directive itself, not the tasks inside. Rule of thumb: use `import_tasks` when the file is always included unconditionally; use `include_tasks` when the file to include depends on a variable or condition.",
        np: "दुवैले ठूलो playbook लाई multiple file मा split गर्न दिन्छन्, तर inclusion कहिले हुन्छ भन्नेमा फरक छन्। **`import_tasks`** (static): Ansible ले playbook run हुनुअघि parse time मा import process गर्छ। Imported file का सबै task parent playbook मा effectively copy-paste हुन्छन्। Pro: `--list-tasks` ले imported task देखाउँछ; `import_tasks` मा tag ले सबै imported task मा apply हुन्छ। Con: filename मा variable प्रयोग गर्न सकिँदैन (`import_tasks: \"{{ env }}_tasks.yml\"` काम गर्दैन — variable अझै resolve भएको छैन)। **`include_tasks`** (dynamic): Ansible ले playbook को त्यो बिन्दुमा पुग्दा runtime मा include process गर्छ। Pro: filename मा variable प्रयोग गर्न सकिन्छ — `include_tasks: \"{{ ansible_os_family }}_tasks.yml\"` OS-specific task file को लागि perfectly काम गर्छ। Con: `--list-tasks` ले included task देखाउँदैन (runtime सम्म थाहा हुँदैन); `include_tasks` मा tag ले include directive मा मात्र apply हुन्छ, भित्रका task मा होइन। Rule of thumb: file सधैँ unconditionally included हुन्छ भने `import_tasks` प्रयोग गर्नुहोस्; include गर्ने file variable वा condition मा depend गर्छ भने `include_tasks` प्रयोग गर्नुहोस्।",
        jp: "両方とも大きなプレイブックを複数のファイルに分割できますが、インクルードが発生する「時期」が異なります。**`import_tasks`**（静的）：Ansible はプレイブックが実行される前のパース時にインポートを処理します。インポートされたファイルのすべてのタスクは実質的に親プレイブックにコピー&ペーストされます。利点：`--list-tasks` がインポートされたタスクを表示する；`import_tasks` のタグはすべてのインポートされたタスクに適用される。欠点：ファイル名に変数を使えない（`import_tasks: \"{{ env }}_tasks.yml\"` は動作しない — 変数がまだ解決されていない）。**`include_tasks`**（動的）：Ansible はプレイブックのその時点に達したときの実行時にインクルードを処理します。利点：ファイル名に変数を使える — `include_tasks: \"{{ ansible_os_family }}_tasks.yml\"` は OS 固有のタスクファイルに完璧に機能する。欠点：`--list-tasks` はインクルードされたタスクを表示しない（実行時まで不明）；`include_tasks` のタグはインクルードディレクティブ自体にのみ適用され、内部のタスクには適用されない。経験則：ファイルが常に無条件にインクルードされる場合は `import_tasks` を使用する；インクルードするファイルが変数または条件に依存する場合は `include_tasks` を使用する。",
      },
      tag: {
        en: "include vs import tasks",
        np: "include vs import tasks",
        jp: "include vs import タスク",
      },
    },
  ],
};
