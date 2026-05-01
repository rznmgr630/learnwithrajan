import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "On every Linux server you will ever manage, the first thing you do after provisioning is install software. Package managers are the layer between you and the chaos of manually downloading, compiling, and tracking dependencies — they handle upgrades, removals, and conflict resolution automatically.",
    np: "तपाईंले manage गर्ने हरेक Linux server मा, provisioning पछि सबभन्दा पहिले software install गर्नुहुन्छ। Package manager हरू तपाईं र manually download, compile, र dependency track गर्ने chaos बीचको layer हुन् — तिनीहरूले upgrade, removal, र conflict resolution automatically handle गर्छन्।",
    jp: "管理するすべての Linux サーバーで、プロビジョニング後に最初にすることはソフトウェアのインストールです。パッケージマネージャーは、手動でダウンロード・コンパイル・依存関係を追跡するという混乱と、あなたの間の層です — アップグレード・削除・競合解決を自動的に処理します。",
  } as const,
  o2: {
    en: "Today you master APT (the Debian/Ubuntu ecosystem), understand how RPM-based systems (RHEL/CentOS/Fedora) differ, and learn the discipline of pinning versions, auditing installed packages, and building from source when no package exists.",
    np: "आज तपाईंले APT (Debian/Ubuntu ecosystem) master गर्नुहुनेछ, RPM-based system (RHEL/CentOS/Fedora) कसरी फरक छ बुझ्नुहुनेछ, र कुनै package नभएपछि version pinning, installed package audit, र source बाट build गर्ने discipline सिक्नुहुनेछ।",
    jp: "本日は APT（Debian/Ubuntu エコシステム）をマスターし、RPM ベースのシステム（RHEL/CentOS/Fedora）との違いを理解し、バージョンのピン留め・インストール済みパッケージの監査・パッケージが存在しない場合のソースからのビルドを習得します。",
  } as const,
};

export const DEVOPS_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "How package management works",
        np: "Package management कसरी काम गर्छ",
        jp: "パッケージ管理の仕組み",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A package manager coordinates three things: a remote repository of packages (a curated collection of software built for your distro), a local database of what is installed (so it knows what to upgrade or remove), and a dependency resolver (so installing nginx also pulls in its required libraries). The repository metadata is cached locally; you must refresh it before installing to get current package lists.",
            np: "Package manager तीन कुरा coordinate गर्छ: remote repository of package (तपाईंको distro का लागि build गरिएको software को curated collection), local database of what is installed (upgrade वा remove गर्न के थाहा), र dependency resolver (nginx install गर्दा त्यसका required library पनि pull हुन्छन्)। Repository metadata locally cache हुन्छ; current package list पाउन install अघि refresh गर्नुपर्छ।",
            jp: "パッケージマネージャーは 3 つのことを調整します：リモートパッケージリポジトリ（ディストリビューション用にビルドされたソフトウェアのキュレーションされたコレクション）・インストール済みのローカルデータベース（アップグレードまたは削除するものを知るため）・依存関係リゾルバ（nginx をインストールすると必要なライブラリも取得される）。リポジトリのメタデータはローカルにキャッシュされます。最新のパッケージリストを取得するにはインストール前に更新する必要があります。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Package manager comparison: Debian vs RPM ecosystems",
            np: "Package manager तुलना: Debian vs RPM ecosystem",
            jp: "パッケージマネージャー比較: Debian と RPM エコシステム",
          },
          headers: [
            { en: "Task", np: "Task", jp: "タスク" },
            { en: "APT (Debian/Ubuntu)", np: "APT (Debian/Ubuntu)", jp: "APT（Debian/Ubuntu）" },
            { en: "DNF/YUM (RHEL/Fedora)", np: "DNF/YUM (RHEL/Fedora)", jp: "DNF/YUM（RHEL/Fedora）" },
          ],
          rows: [
            [
              { en: "Update package index", np: "Package index update गर्नुहोस्", jp: "パッケージインデックスの更新" },
              { en: "`apt update`", np: "`apt update`", jp: "`apt update`" },
              { en: "`dnf check-update`", np: "`dnf check-update`", jp: "`dnf check-update`" },
            ],
            [
              { en: "Install a package", np: "Package install गर्नुहोस्", jp: "パッケージのインストール" },
              { en: "`apt install nginx`", np: "`apt install nginx`", jp: "`apt install nginx`" },
              { en: "`dnf install nginx`", np: "`dnf install nginx`", jp: "`dnf install nginx`" },
            ],
            [
              { en: "Remove a package", np: "Package remove गर्नुहोस्", jp: "パッケージの削除" },
              { en: "`apt remove nginx`", np: "`apt remove nginx`", jp: "`apt remove nginx`" },
              { en: "`dnf remove nginx`", np: "`dnf remove nginx`", jp: "`dnf remove nginx`" },
            ],
            [
              { en: "Upgrade all packages", np: "सबै package upgrade गर्नुहोस्", jp: "全パッケージのアップグレード" },
              { en: "`apt upgrade`", np: "`apt upgrade`", jp: "`apt upgrade`" },
              { en: "`dnf upgrade`", np: "`dnf upgrade`", jp: "`dnf upgrade`" },
            ],
            [
              { en: "Search for a package", np: "Package खोज्नुहोस्", jp: "パッケージの検索" },
              { en: "`apt search nginx`", np: "`apt search nginx`", jp: "`apt search nginx`" },
              { en: "`dnf search nginx`", np: "`dnf search nginx`", jp: "`dnf search nginx`" },
            ],
            [
              { en: "Show package info", np: "Package info हेर्नुहोस्", jp: "パッケージ情報の表示" },
              { en: "`apt show nginx`", np: "`apt show nginx`", jp: "`apt show nginx`" },
              { en: "`dnf info nginx`", np: "`dnf info nginx`", jp: "`dnf info nginx`" },
            ],
            [
              { en: "List installed packages", np: "Installed package list गर्नुहोस्", jp: "インストール済みパッケージの一覧" },
              { en: "`dpkg -l`", np: "`dpkg -l`", jp: "`dpkg -l`" },
              { en: "`rpm -qa`", np: "`rpm -qa`", jp: "`rpm -qa`" },
            ],
            [
              { en: "Which package owns a file?", np: "कुन package को file हो?", jp: "どのパッケージがそのファイルを持つか？" },
              { en: "`dpkg -S /usr/bin/nginx`", np: "`dpkg -S /usr/bin/nginx`", jp: "`dpkg -S /usr/bin/nginx`" },
              { en: "`rpm -qf /usr/bin/nginx`", np: "`rpm -qf /usr/bin/nginx`", jp: "`rpm -qf /usr/bin/nginx`" },
            ],
            [
              { en: "Package file format", np: "Package file format", jp: "パッケージファイル形式" },
              { en: "`.deb`", np: "`.deb`", jp: "`.deb`" },
              { en: "`.rpm`", np: "`.rpm`", jp: "`.rpm`" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "APT in depth — the Debian/Ubuntu workhorse",
        np: "APT गहिरो — Debian/Ubuntu workhorse",
        jp: "APT の詳細 — Debian/Ubuntu の主力ツール",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Essential APT workflows",
            np: "APT को आवश्यक workflow",
            jp: "APT の主要なワークフロー",
          },
          code: `# Always update index before installing
sudo apt update

# Install packages
sudo apt install nginx git curl build-essential -y   # -y skips confirmation
sudo apt install nginx=1.24.0-1~focal               # install a specific version

# Remove packages
sudo apt remove nginx          # remove but keep config files
sudo apt purge nginx           # remove + delete config files
sudo apt autoremove            # clean up orphaned dependencies

# Upgrade
sudo apt upgrade               # upgrade installed packages, never remove
sudo apt full-upgrade          # upgrade + remove packages if needed (use with care)
sudo apt-get dist-upgrade      # older syntax, same as full-upgrade

# Search and inspect
apt search "web server"        # full-text search in package descriptions
apt list --installed           # all installed packages
apt list --installed | grep nginx
apt show nginx                 # version, dependencies, description
apt-cache policy nginx         # installed vs candidate version + repository priority

# Simulate before committing
apt install -s nginx           # dry run (simulate, no real changes)

# Download without installing (useful in CI to cache packages)
apt-get download nginx         # saves .deb to current directory
apt-get source nginx           # download the source package`,
        },
        {
          type: "code",
          title: {
            en: "Adding third-party repositories (PPA / signed repos)",
            np: "Third-party repository थप्नुहोस् (PPA / signed repo)",
            jp: "サードパーティリポジトリの追加（PPA / 署名付きリポジトリ）",
          },
          code: `# Modern way (Ubuntu 22.04+): use signed-by with keyring
curl -fsSL https://nginx.org/keys/nginx_signing.key | \
  sudo gpg --dearmor -o /usr/share/keyrings/nginx-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/nginx-archive-keyring.gpg] \
  https://nginx.org/packages/ubuntu $(lsb_release -cs) nginx" | \
  sudo tee /etc/apt/sources.list.d/nginx.list

sudo apt update
sudo apt install nginx

# Ubuntu PPA (Personal Package Archive) shortcut
sudo add-apt-repository ppa:deadsnakes/python   # adds signing key + repo
sudo apt update
sudo apt install python3.12

# List configured repositories
cat /etc/apt/sources.list
ls /etc/apt/sources.list.d/

# Remove a repository
sudo add-apt-repository --remove ppa:deadsnakes/python
sudo rm /etc/apt/sources.list.d/nginx.list`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "`apt update` vs `apt upgrade` — these are two separate commands. `update` refreshes the package index (no software is installed or changed). `upgrade` actually downloads and installs newer versions. Always run `update` first.",
              np: "`apt update` vs `apt upgrade` — यी दुई अलग command हुन्। `update` ले package index refresh गर्छ (कुनै software install वा change हुँदैन)। `upgrade` ले वास्तवमा newer version download र install गर्छ। सधैं पहिले `update` run गर्नुहोस्।",
              jp: "`apt update` 対 `apt upgrade` — これらは 2 つの別々のコマンドです。`update` はパッケージインデックスを更新します（ソフトウェアはインストールも変更もされません）。`upgrade` は実際に新しいバージョンをダウンロードしてインストールします。常に最初に `update` を実行してください。",
            },
            {
              en: "`dpkg` is the low-level tool — `apt` is a friendlier front-end to `dpkg`. Use `dpkg -i package.deb` to install a manually downloaded `.deb` file. Use `dpkg -l | grep nginx` to verify installation state (`ii` = installed, `rc` = removed but config remains).",
              np: "`dpkg` low-level tool हो — `apt` `dpkg` को friendlier front-end हो। Manually download गरेको `.deb` file install गर्न `dpkg -i package.deb` प्रयोग गर्नुहोस्। Installation state verify गर्न `dpkg -l | grep nginx` (`ii` = installed, `rc` = removed but config remains) प्रयोग गर्नुहोस्।",
              jp: "`dpkg` は低レベルのツール — `apt` は `dpkg` のより使いやすいフロントエンドです。手動でダウンロードした `.deb` ファイルをインストールするには `dpkg -i package.deb` を使います。インストール状態を確認するには `dpkg -l | grep nginx`（`ii` = インストール済み、`rc` = 削除済みだが設定は残る）を使います。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Version pinning and security updates",
        np: "Version pinning र security update",
        jp: "バージョンのピン留めとセキュリティアップデート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "In production, blindly running `apt upgrade` can break your application if a dependency changes its API. Version pinning lets you lock a package to a specific version or prevent it from being upgraded. At the same time, security patches must be applied promptly — the solution is to pin application dependencies but allow security updates through.",
            np: "Production मा, blindly `apt upgrade` run गर्दा dependency को API बदलिए application break हुन सक्छ। Version pinning ले package लाई specific version मा lock गर्न वा upgrade हुनबाट रोक्न दिन्छ। तर security patch तुरुन्त apply गर्नुपर्छ — solution application dependency pin गर्नु तर security update allow गर्नु हो।",
            jp: "本番環境では、`apt upgrade` を闇雲に実行すると、依存関係の API が変更された場合にアプリケーションが壊れる可能性があります。バージョンのピン留めにより、パッケージを特定のバージョンにロックしたり、アップグレードを防いだりできます。一方、セキュリティパッチは速やかに適用する必要があります。解決策はアプリケーション依存関係をピン留めしつつ、セキュリティアップデートを通すことです。",
          },
        },
        {
          type: "code",
          title: {
            en: "APT pinning and unattended security upgrades",
            np: "APT pinning र unattended security upgrade",
            jp: "APT のピン留めと無人セキュリティアップグレード",
          },
          code: `# Pin a package to its current version (prevent upgrades)
sudo apt-mark hold nginx
apt-mark showhold               # list all held packages
sudo apt-mark unhold nginx      # remove the hold

# Install a specific version
sudo apt install nginx=1.24.0-1~focal

# /etc/apt/preferences.d/nginx-pin (file-based pinning)
# Package: nginx
# Pin: version 1.24.*
# Pin-Priority: 1001          # > 1000 = override even downgrade

# Unattended security updates (Ubuntu)
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
# Config file: /etc/apt/apt.conf.d/50unattended-upgrades
# By default applies only security updates, not all upgrades

# Check what would be auto-upgraded
sudo unattended-upgrade --dry-run --debug 2>&1 | grep "Packages that will be upgraded"

# Apply security updates immediately (manual trigger)
sudo unattended-upgrade -v`,
        },
      ],
    },
    {
      title: {
        en: "Installing software without a package manager",
        np: "Package manager बिना software install गर्नुहोस्",
        jp: "パッケージマネージャーなしでソフトウェアをインストールする",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Some software isn't in any repo: vendor-provided tarballs, language-specific tools (pip, npm, cargo), or bleeding-edge versions you need to compile yourself. Each approach has different upgrade and security implications — know when to use each.",
            np: "केही software कुनै पनि repo मा हुँदैन: vendor-provided tarball, language-specific tool (pip, npm, cargo), वा bleeding-edge version जुन आफैंले compile गर्नुपर्छ। प्रत्येक approach को फरक upgrade र security implication छन् — कुन कहिले प्रयोग गर्ने थाहा होस्।",
            jp: "一部のソフトウェアはどのリポジトリにもありません：ベンダー提供のtarball・言語固有のツール（pip・npm・cargo）・自分でコンパイルする必要がある最新バージョンです。各アプローチにはアップグレードとセキュリティの観点から異なる影響があります — それぞれをいつ使うかを知っておきましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Common non-APT installation patterns",
            np: "सामान्य non-APT installation pattern",
            jp: "一般的な APT 以外のインストールパターン",
          },
          code: `# 1. Pre-built binary / tarball (e.g., Terraform, kubectl)
curl -LO https://example.com/tool-v1.2.3-linux-amd64.tar.gz
# Always verify the checksum first
sha256sum tool-v1.2.3-linux-amd64.tar.gz
# (compare against the published checksum from the vendor)
tar -xzf tool-v1.2.3-linux-amd64.tar.gz
sudo mv tool /usr/local/bin/
sudo chmod +x /usr/local/bin/tool
tool --version

# 2. Snap packages (Ubuntu — sandboxed, auto-updating)
sudo snap install code --classic   # install VS Code
snap list                          # list installed snaps
snap info code                     # version and channel info
sudo snap refresh                  # update all snaps
sudo snap remove code              # uninstall

# 3. Build from source (the nuclear option)
sudo apt install build-essential   # gcc, make, etc.
wget https://example.com/app-1.0.tar.gz
tar -xzf app-1.0.tar.gz && cd app-1.0
./configure --prefix=/usr/local    # check for dependencies
make -j$(nproc)                    # compile using all CPU cores
sudo make install                  # copy to /usr/local/
# Uninstall: sudo make uninstall (if supported) or track with checkinstall

# 4. Language package managers (install to user home, avoid sudo)
pip3 install --user ansible        # Python
npm install -g nodemon             # Node.js
cargo install ripgrep              # Rust`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Install binaries to `/usr/local/bin/`, not `/usr/bin/`. The convention: `/usr/bin/` is for distro-managed packages; `/usr/local/bin/` is for system-wide software you installed manually. This prevents conflicts with future `apt` updates.",
              np: "Binary `/usr/bin/` मा होइन, `/usr/local/bin/` मा install गर्नुहोस्। Convention: `/usr/bin/` distro-managed package का लागि; `/usr/local/bin/` manually install गरेको system-wide software का लागि। यसले future `apt` update सँग conflict रोक्छ।",
              jp: "バイナリは `/usr/bin/` ではなく `/usr/local/bin/` にインストールしてください。 慣例：`/usr/bin/` はディストリビューション管理のパッケージ用；`/usr/local/bin/` は手動でインストールしたシステム全体のソフトウェア用です。これにより将来の `apt` アップデートとの競合を防ぎます。",
            },
            {
              en: "Always verify checksums before installing any binary downloaded from the internet. An attacker who compromises a download server can swap in a backdoored binary. Every reputable vendor publishes SHA256 checksums alongside their releases.",
              np: "Internet बाट download गरेको कुनै पनि binary install गर्नुअघि सधैं checksum verify गर्नुहोस्। Download server compromise गर्ने attacker ले backdoored binary swap गर्न सक्छ। हरेक reputable vendor ले आफ्नो release सँगै SHA256 checksum publish गर्छ।",
              jp: "インターネットからダウンロードしたバイナリをインストールする前に必ずチェックサムを検証してください。 ダウンロードサーバーを侵害した攻撃者がバックドア入りのバイナリを差し替える可能性があります。すべての信頼できるベンダーはリリースと一緒に SHA256 チェックサムを公開しています。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Audit and harden a fresh server",
        np: "Hands-on: Fresh server audit र harden गर्नुहोस्",
        jp: "ハンズオン: 新しいサーバーの監査と堅牢化",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Post-provisioning package hygiene checklist",
            np: "Post-provisioning package hygiene checklist",
            jp: "プロビジョニング後のパッケージ衛生チェックリスト",
          },
          code: `# 1. Refresh package index and see what needs upgrading
sudo apt update
apt list --upgradable

# 2. Apply all security patches
sudo apt upgrade -y

# 3. Audit what is installed — find packages you don't recognize
dpkg -l | less                           # all packages
dpkg -l | grep -v "^ii" | grep -v "^|" # non-fully-installed (errors)

# 4. Find packages with no dependencies (orphans / leftovers)
sudo apt autoremove --dry-run            # what would be removed
sudo apt autoremove -y                   # actually remove them

# 5. Find large packages that might not belong
dpkg-query -W --showformat='\${Installed-Size}\\t\${Package}\\n' | \
  sort -rn | head -20

# 6. Check if a reboot is required after kernel/glibc upgrades
ls /var/run/reboot-required 2>/dev/null && echo "REBOOT REQUIRED" || echo "No reboot needed"

# 7. Enable automatic security updates
sudo apt install unattended-upgrades -y
sudo systemctl enable --now unattended-upgrades

# 8. Lock versions of critical production packages
sudo apt-mark hold nginx postgresql-15

# 9. Generate a package manifest (useful for change tracking)
dpkg -l > /tmp/packages-$(date +%Y%m%d).txt
diff /tmp/packages-before.txt /tmp/packages-$(date +%Y%m%d).txt`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `apt` and `apt-get`?",
        np: "`apt` र `apt-get` बीच के फरक छ?",
        jp: "`apt` と `apt-get` の違いは何か？",
      },
      answer: {
        en: "`apt-get` is the older, lower-level command designed for scripting — its output format is stable and machine-parseable. `apt` is a newer, friendlier front-end designed for interactive use — it adds a progress bar, colors, and better default behavior (e.g., suggests `autoremove` after package changes). In scripts and Dockerfiles, use `apt-get` for stability. In your terminal, use `apt` for convenience.",
        np: "`apt-get` पुरानो, lower-level command हो scripting का लागि design गरिएको — यसको output format stable र machine-parseable छ। `apt` नयाँ, friendlier front-end हो interactive use का लागि — यसले progress bar, color, र better default behavior थप्छ। Script र Dockerfile मा stability का लागि `apt-get` प्रयोग गर्नुहोस्। Terminal मा convenience का लागि `apt` प्रयोग गर्नुहोस्।",
        jp: "`apt-get` はスクリプト用に設計された古い低レベルのコマンドです — その出力形式は安定していてマシンで解析可能です。`apt` は対話型使用のために設計された新しい使いやすいフロントエンドです — プログレスバー・色・より良いデフォルト動作（例：パッケージ変更後に `autoremove` を提案）を追加します。スクリプトと Dockerfile では安定性のために `apt-get` を使います。ターミナルでは便利さのために `apt` を使います。",
      },
      tag: { en: "packages", np: "प्याकेज", jp: "パッケージ" },
    },
    {
      question: {
        en: "How do I install a specific version of a package?",
        np: "Package को specific version कसरी install गर्ने?",
        jp: "パッケージの特定バージョンをインストールする方法は？",
      },
      answer: {
        en: "Use `apt install package=version`: `sudo apt install nginx=1.24.0-1~focal`. First run `apt-cache policy nginx` to see all available versions and which repository they come from. If the version you need is not in your configured repos, you may need to add the vendor's repo, download the `.deb` directly, or use a different installation method.",
        np: "`apt install package=version` प्रयोग गर्नुहोस्: `sudo apt install nginx=1.24.0-1~focal`। पहिले `apt-cache policy nginx` run गर्नुहोस् सबै available version र ती कुन repository बाट आउँछन् हेर्न। यदि चाहिएको version तपाईंको configured repo मा छैन भने vendor को repo थप्न, `.deb` directly download गर्न, वा फरक installation method प्रयोग गर्न सकिन्छ।",
        jp: "`apt install package=version` を使います：`sudo apt install nginx=1.24.0-1~focal`。まず `apt-cache policy nginx` を実行して利用可能なすべてのバージョンとそれがどのリポジトリから来るかを確認します。必要なバージョンが設定されたリポジトリにない場合は、ベンダーのリポジトリを追加したり、`.deb` を直接ダウンロードしたり、別のインストール方法を使用する必要があるかもしれません。",
      },
      tag: { en: "packages", np: "प्याकेज", jp: "パッケージ" },
      callout: {
        en: "Quick check: `apt-cache policy nginx` — shows installed version, candidate version, and which repos are available",
        np: "Quick check: `apt-cache policy nginx` — installed version, candidate version, र available repo देखाउँछ",
        jp: "クイック確認: `apt-cache policy nginx` — インストール済みバージョン・候補バージョン・利用可能なリポジトリを表示",
      },
    },
    {
      question: {
        en: "Should I use `sudo pip install` to install Python tools system-wide?",
        np: "Python tool system-wide install गर्न `sudo pip install` प्रयोग गर्नुपर्छ?",
        jp: "Python ツールをシステム全体にインストールするために `sudo pip install` を使うべきか？",
      },
      answer: {
        en: "No — and modern pip will refuse it. `sudo pip install` modifies the system Python, which is owned and maintained by apt. If pip and apt both manage the same library, they will conflict, producing impossible-to-debug version mismatches. Instead: use `pip install --user` for personal tools, use virtual environments (`python3 -m venv`) for project dependencies, or install Python tools through apt (`sudo apt install ansible`) if available. For system-wide tools, use pipx.",
        np: "नहोस् — र modern pip ले अस्वीकार गर्छ। `sudo pip install` ले apt द्वारा owned र maintained system Python modify गर्छ। यदि pip र apt दुवैले same library manage गरे भने conflict हुन्छ। बरु: personal tool का लागि `pip install --user`, project dependency का लागि virtual environment (`python3 -m venv`), वा available भए apt (`sudo apt install ansible`) मार्फत install गर्नुहोस्। System-wide tool का लागि pipx प्रयोग गर्नुहोस्।",
        jp: "いいえ — そして最近の pip はそれを拒否します。`sudo pip install` は apt が所有・管理するシステム Python を変更します。pip と apt が同じライブラリを管理すると、デバッグが不可能なバージョンの不一致が生じます。代わりに：個人用ツールは `pip install --user`、プロジェクトの依存関係は仮想環境（`python3 -m venv`）、利用可能なら apt（`sudo apt install ansible`）でインストールしてください。システム全体のツールには pipx を使います。",
      },
      tag: { en: "packages", np: "प्याकेज", jp: "パッケージ" },
    },
    {
      question: {
        en: "What happens if I run `apt upgrade` on a production server?",
        np: "Production server मा `apt upgrade` run गरे के हुन्छ?",
        jp: "本番サーバーで `apt upgrade` を実行するとどうなるか？",
      },
      answer: {
        en: "`apt upgrade` installs the latest version of every installed package. On a production server this can: restart services (nginx, postgres) causing brief downtime, change a library's behavior in a way your app doesn't expect, or require a kernel reboot. Best practice: test upgrades in staging first, use `apt upgrade --dry-run` to preview, schedule maintenance windows, and consider using `apt-get install package=version` to upgrade only specific packages after validating them.",
        np: "`apt upgrade` ले हरेक installed package को latest version install गर्छ। Production server मा यसले: service (nginx, postgres) restart गरी brief downtime ल्याउन, app ले expect नगरेको तरिकाले library को behavior बदल्न, वा kernel reboot चाहिन सक्छ। Best practice: पहिले staging मा upgrade test गर्नुहोस्, preview का लागि `apt upgrade --dry-run` प्रयोग गर्नुहोस्, maintenance window schedule गर्नुहोस्।",
        jp: "`apt upgrade` はインストール済みのすべてのパッケージの最新バージョンをインストールします。本番サーバーでこれを行うと：サービス（nginx・postgres）が再起動して短いダウンタイムが発生したり、アプリが期待しない方法でライブラリの動作が変わったり、カーネルの再起動が必要になったりする可能性があります。ベストプラクティス：まずステージングでアップグレードをテストし、`apt upgrade --dry-run` でプレビューし、メンテナンスウィンドウをスケジュールします。",
      },
      tag: { en: "packages", np: "प्याकेज", jp: "パッケージ" },
    },
  ],
};
