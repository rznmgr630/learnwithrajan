import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Linux is a multi-user operating system — multiple people and services run on the same machine simultaneously, and the kernel must enforce boundaries between them. The permission system is the core of that enforcement: every file has an owner, a group, and a set of read/write/execute bits for three audiences.",
    np: "Linux एक multi-user operating system हो — धेरै मान्छे र service एउटै machine मा एकसाथ चल्छन्, र kernel ले तिनीहरू बीच boundary enforce गर्नुपर्छ। Permission system त्यो enforcement को मूल हो: हरेक file मा एउटा owner, एउटा group, र तीन audience का लागि read/write/execute bit सेट हुन्छ।",
    jp: "Linux はマルチユーザー OS です。複数のユーザーとサービスが同じマシン上で同時に動作し、カーネルはそれらの間の境界を強制します。パーミッションシステムがその強制の核心です。すべてのファイルには所有者・グループ、そして 3 つの対象に対する read/write/execute ビットのセットがあります。",
  } as const,
  o2: {
    en: "Today you learn to read `ls -l` output, change permissions with `chmod`, transfer ownership with `chown`, and understand why running everything as root is the fastest way to break a production server.",
    np: "आज तपाईंले `ls -l` output पढ्न, `chmod` ले permission बदल्न, `chown` ले ownership transfer गर्न, र root को रूपमा सबै कुरा run गर्नु production server break गर्ने सबभन्दा छिटो तरिका किन हो भनेर बुझ्न सिक्नुहुनेछ।",
    jp: "本日は `ls -l` の出力を読む方法・`chmod` でパーミッションを変更する方法・`chown` で所有権を移す方法を学び、すべてを root として実行するとなぜ本番サーバーを壊す最短経路になるのかを理解します。",
  } as const,
};

export const DEVOPS_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Users and groups — who is on this system?",
        np: "User र group — यस system मा को छ?",
        jp: "ユーザーとグループ — このシステムには誰がいるか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every process and file on Linux is owned by a user (identified by a numeric UID) and belongs to a group (GID). The kernel checks UIDs and GIDs when deciding whether a process is allowed to read, write, or execute a file. User names like 'alice' are just human-readable aliases stored in `/etc/passwd`; the kernel only knows UIDs.",
            np: "Linux मा हरेक process र file एउटा user (numeric UID द्वारा पहिचान) को स्वामित्वमा छ र एउटा group (GID) मा belong गर्छ। Kernel ले process लाई file read, write, वा execute गर्न अनुमति छ कि छैन निर्णय गर्दा UID र GID जाँच गर्छ। 'alice' जस्ता user name केवल `/etc/passwd` मा store गरिएका human-readable alias हुन्; kernel ले केवल UID जान्छ।",
            jp: "Linux 上のすべてのプロセスとファイルは、ユーザー（数値の UID で識別）が所有し、グループ（GID）に属しています。カーネルはプロセスがファイルを読み・書き・実行できるかを決める際に UID と GID を確認します。'alice' のようなユーザー名は `/etc/passwd` に保存された人間に読みやすいエイリアスに過ぎません。カーネルが知っているのは UID だけです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inspecting users and groups",
            np: "User र group निरीक्षण गर्नुहोस्",
            jp: "ユーザーとグループを確認する",
          },
          code: `# Who am I? (current user and groups)
whoami                         # username only
id                             # uid=1000(alice) gid=1000(alice) groups=...
groups                         # list all groups current user belongs to

# User database files
cat /etc/passwd                # username:x:UID:GID:comment:home:shell
cat /etc/group                 # groupname:x:GID:member1,member2

# See who is currently logged in
who
w                              # more detail: what they are running

# User management (requires root / sudo)
sudo useradd -m -s /bin/bash deploy   # create user 'deploy' with home dir
sudo passwd deploy                    # set their password
sudo usermod -aG docker deploy        # add 'deploy' to 'docker' group
sudo userdel -r deploy                # delete user and home dir

# Switch to another user
su - deploy                    # open a login shell as 'deploy'
sudo -u deploy whoami          # run one command as 'deploy'`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`/etc/shadow`** stores the hashed passwords — only readable by root. If you can read `/etc/shadow`, the system is misconfigured.",
              np: "**`/etc/shadow`** hashed password store गर्छ — केवल root ले पढ्न सक्छ। यदि तपाईं `/etc/shadow` पढ्न सक्नुहुन्छ भने system misconfigured छ।",
              jp: "**`/etc/shadow`** はハッシュ化されたパスワードを格納します — root のみ読み取り可能です。これを読めるなら、システムの設定が誤っています。",
            },
            {
              en: "Service accounts (nginx, mysql, docker) have UIDs but no login shell (`/sbin/nologin`). This is intentional — services should not be interactive users.",
              np: "Service account (nginx, mysql, docker) मा UID छ तर login shell छैन (`/sbin/nologin`)। यो जानाजानी हो — service हरू interactive user हुनु हुँदैन।",
              jp: "サービスアカウント（nginx・mysql・docker）は UID を持ちますがログインシェルがありません（`/sbin/nologin`）。これは意図的なものです — サービスは対話型ユーザーであるべきではありません。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Reading permission bits — decoding ls -l",
        np: "Permission bit पढ्नुहोस् — ls -l decode गर्नुहोस्",
        jp: "パーミッションビットを読む — ls -l のデコード",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every `ls -l` line starts with 10 characters that encode the file type and three sets of permissions. Misreading these is one of the most common causes of 'Permission denied' errors on production servers.",
            np: "हरेक `ls -l` लाइन file type र तीन permission set encode गर्ने १० character बाट सुरु हुन्छ। यिनलाई गलत पढ्नु production server मा 'Permission denied' error को सबभन्दा सामान्य कारणहरू मध्ये एक हो।",
            jp: "すべての `ls -l` の行は、ファイルタイプと 3 セットのパーミッションをエンコードした 10 文字から始まります。これを誤読することが、本番サーバーで「Permission denied」エラーが起きる最もよくある原因の一つです。",
          },
        },
        { type: "diagram", id: "devops-linux-permissions" },
        {
          type: "table",
          caption: {
            en: "Permission bit values — symbolic and octal",
            np: "Permission bit मान — symbolic र octal",
            jp: "パーミッションビット値 — シンボルと 8 進数",
          },
          headers: [
            { en: "Bit", np: "Bit", jp: "ビット" },
            { en: "Symbol", np: "Symbol", jp: "記号" },
            { en: "Octal", np: "Octal", jp: "8 進数" },
            { en: "Meaning on file", np: "File मा अर्थ", jp: "ファイルへの意味" },
            { en: "Meaning on directory", np: "Directory मा अर्थ", jp: "ディレクトリへの意味" },
          ],
          rows: [
            [
              { en: "Read", np: "Read", jp: "読み取り" },
              { en: "r", np: "r", jp: "r" },
              { en: "4", np: "4", jp: "4" },
              { en: "Can view file contents (cat, less)", np: "File content हेर्न सकिन्छ", jp: "ファイル内容を表示できる（cat・less）" },
              { en: "Can list directory contents (ls)", np: "Directory content list गर्न सकिन्छ", jp: "ディレクトリ内容を一覧表示できる（ls）" },
            ],
            [
              { en: "Write", np: "Write", jp: "書き込み" },
              { en: "w", np: "w", jp: "w" },
              { en: "2", np: "2", jp: "2" },
              { en: "Can modify or delete the file", np: "File modify वा delete गर्न सकिन्छ", jp: "ファイルの変更・削除ができる" },
              { en: "Can create, rename, or delete files inside", np: "भित्र file create, rename, वा delete गर्न सकिन्छ", jp: "内部でファイルの作成・リネーム・削除ができる" },
            ],
            [
              { en: "Execute", np: "Execute", jp: "実行" },
              { en: "x", np: "x", jp: "x" },
              { en: "1", np: "1", jp: "1" },
              { en: "Can run the file as a program", np: "File लाई program को रूपमा run गर्न सकिन्छ", jp: "ファイルをプログラムとして実行できる" },
              { en: "Can cd into it and access its contents", np: "यसमा cd गर्न र content access गर्न सकिन्छ", jp: "cd でその中に入り、内容にアクセスできる" },
            ],
          ],
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Common permission patterns**: `644` (rw-r--r--) for config files · `755` (rwxr-xr-x) for binaries and public dirs · `600` (rw-------) for SSH keys and secrets · `700` (rwx------) for private scripts",
              np: "**सामान्य permission pattern**: `644` (rw-r--r--) config file का लागि · `755` (rwxr-xr-x) binary र public dir का लागि · `600` (rw-------) SSH key र secret का लागि · `700` (rwx------) private script का लागि",
              jp: "**よくあるパーミッションパターン**: 設定ファイルに `644`（rw-r--r--）· バイナリとパブリックディレクトリに `755`（rwxr-xr-x）· SSH 鍵とシークレットに `600`（rw-------）· プライベートスクリプトに `700`（rwx------）",
            },
            {
              en: "**Execute bit on a directory** — this is the 'search' permission. Without `x` on a directory you cannot `cd` into it even if you have `r`. That is why `/home/alice` is typically `700` or `750`.",
              np: "**Directory मा execute bit** — यो 'search' permission हो। Directory मा `x` बिना तपाईं `r` भए पनि `cd` गर्न सक्नुहुन्न। त्यसैले `/home/alice` सामान्यतया `700` वा `750` हुन्छ।",
              jp: "**ディレクトリの実行ビット** — これは「検索」パーミッションです。ディレクトリに `x` がないと、`r` があっても `cd` できません。だから `/home/alice` は通常 `700` か `750` です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "chmod and chown — changing permissions and ownership",
        np: "chmod र chown — permission र ownership बदल्नुहोस्",
        jp: "chmod と chown — パーミッションと所有権の変更",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "chmod (change mode) and chown (change owner)",
            np: "chmod (change mode) र chown (change owner)",
            jp: "chmod（モード変更）と chown（所有者変更）",
          },
          code: `# chmod — octal notation (most precise, preferred in scripts)
chmod 644 config.yml       # rw-r--r-- (owner: rw, group/other: r)
chmod 755 deploy.sh        # rwxr-xr-x (owner: rwx, group/other: rx)
chmod 600 ~/.ssh/id_rsa    # rw------- (SSH private key must be this)
chmod 700 /home/deploy     # rwx------ (only owner can enter)

# chmod — symbolic notation (easier to understand in one-off commands)
chmod u+x deploy.sh        # add execute for owner (user)
chmod g-w config.yml       # remove write for group
chmod o-r secrets.conf     # remove read for other (world)
chmod a+r public.html      # add read for all (a = all = ugo)

# chmod recursive (apply to directory and all contents)
chmod -R 755 /var/www/html    # make web root world-readable
chmod -R 600 /etc/ssl/private # lock down TLS private keys

# chown — change owner and/or group
chown alice config.yml         # change owner to alice
chown alice:devs config.yml    # change owner AND group
chown :devs config.yml         # change only the group
chown -R nginx:nginx /var/www  # recursive: make nginx own the web root

# Check effective permissions
ls -la deploy.sh
stat deploy.sh                 # all metadata including permissions in octal`,
        },
      ],
    },
    {
      title: {
        en: "sudo — controlled privilege escalation",
        np: "sudo — controlled privilege escalation",
        jp: "sudo — 制御された特権昇格",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`sudo` lets a non-root user run a specific command with root (or another user's) privileges. It logs every invocation to `/var/log/auth.log`, enforces a password prompt, and can be configured to allow only specific commands — making it far safer than sharing the root password or SSHing in as root.",
            np: "`sudo` ले non-root user लाई root (वा अर्को user को) privilege सँग specific command run गर्न दिन्छ। यसले `/var/log/auth.log` मा हरेक invocation log गर्छ, password prompt enforce गर्छ, र केवल specific command अनुमति दिन configure गर्न सकिन्छ — जसले root password share गर्नु वा root को रूपमा SSH गर्नु भन्दा धेरै सुरक्षित बनाउँछ।",
            jp: "`sudo` は非 root ユーザーが root（または別のユーザー）の権限で特定のコマンドを実行できるようにします。すべての実行を `/var/log/auth.log` に記録し、パスワードの入力を求め、特定のコマンドだけを許可するよう設定できます。root パスワードを共有したり root で SSH したりするよりはるかに安全です。",
          },
        },
        {
          type: "code",
          title: {
            en: "sudo usage and sudoers configuration",
            np: "sudo प्रयोग र sudoers configuration",
            jp: "sudo の使い方と sudoers の設定",
          },
          code: `# Run a single command as root
sudo systemctl restart nginx
sudo apt update && sudo apt upgrade

# Open an interactive root shell (use sparingly)
sudo -i              # root login shell
sudo su -            # equivalent

# Check what sudo commands you are allowed to run
sudo -l

# Edit sudoers safely — ALWAYS use visudo, never edit directly
sudo visudo

# Example sudoers entries:
# alice ALL=(ALL:ALL) ALL           → alice can run anything as root
# deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart nginx
#   → 'deploy' can restart nginx without a password (useful for CI/CD)
# %devs ALL=(ALL) /usr/bin/apt      → group 'devs' can run apt

# View sudo audit trail
sudo cat /var/log/auth.log | grep sudo | tail -20`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Never run your app as root** — if your app has a vulnerability, an attacker who exploits it gets root on your whole server. Use a dedicated service account (uid 1000+) with only the permissions the app actually needs.",
              np: "**आफ्नो app कहिल्यै root को रूपमा run नगर्नुहोस्** — यदि तपाईंको app मा vulnerability छ भने यसलाई exploit गर्ने attacker ले तपाईंको पूरै server मा root पाउँछ। App लाई वास्तवमा चाहिने permission मात्र सहित dedicated service account (uid 1000+) प्रयोग गर्नुहोस्।",
              jp: "**アプリを root として実行しないでください** — アプリに脆弱性があれば、それを悪用した攻撃者がサーバー全体の root を取得します。アプリが実際に必要なパーミッションだけを持つ専用サービスアカウント（uid 1000+）を使いましょう。",
            },
            {
              en: "`NOPASSWD` in sudoers is acceptable for CI/CD automation (e.g., a deploy script that needs to restart nginx) but should be scoped to a single command, not `ALL`.",
              np: "Sudoers मा `NOPASSWD` CI/CD automation (जस्तै nginx restart गर्न आवश्यक deploy script) का लागि स्वीकार्य छ तर एउटा command मा scope हुनुपर्छ, `ALL` होइन।",
              jp: "sudoers の `NOPASSWD` は CI/CD 自動化（例：nginx を再起動する必要があるデプロイスクリプト）には許容されますが、`ALL` ではなく単一コマンドにスコープを限定すべきです。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Inspect and fix permissions on a web server layout",
        np: "Hands-on: Web server layout मा permission निरीक्षण र fix गर्नुहोस्",
        jp: "ハンズオン: Web サーバーレイアウトのパーミッションを確認・修正する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Simulate a typical nginx permission setup",
            np: "Typical nginx permission setup simulate गर्नुहोस्",
            jp: "典型的な nginx パーミッション設定をシミュレートする",
          },
          code: `# 1. Create a mock web root structure
sudo mkdir -p /var/www/myapp/{public,config,logs}
sudo touch /var/www/myapp/config/app.conf
sudo touch /var/www/myapp/public/index.html

# 2. Create a service user (nginx-style)
sudo useradd -r -s /sbin/nologin webapp

# 3. Set correct ownership (webapp owns the app files)
sudo chown -R webapp:webapp /var/www/myapp

# 4. Set correct permissions
sudo chmod 755 /var/www/myapp/public      # world-readable (web server needs this)
sudo chmod 750 /var/www/myapp/config      # owner+group only (protect config)
sudo chmod 700 /var/www/myapp/logs        # owner only (protect logs)
sudo chmod 644 /var/www/myapp/public/index.html
sudo chmod 640 /var/www/myapp/config/app.conf  # owner rw, group r, other none

# 5. Verify the layout
ls -laR /var/www/myapp

# 6. Check what your user can and cannot access
cat /var/www/myapp/config/app.conf          # should work (644 or 640 + group)
sudo -u webapp cat /var/www/myapp/config/app.conf  # should work
sudo -u nobody cat /var/www/myapp/config/app.conf  # should FAIL (640, no other)`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between root and sudo?",
        np: "Root र sudo बीच के फरक छ?",
        jp: "root と sudo の違いは何か？",
      },
      answer: {
        en: "Root (UID 0) is the superuser account — it bypasses all permission checks. `sudo` is a program that temporarily grants a regular user root-level permissions for one command, with logging and access controls. Best practice on modern servers: disable direct root SSH login (`PermitRootLogin no` in sshd_config), allow only sudo for privileged tasks.",
        np: "Root (UID 0) superuser account हो — यसले सबै permission check bypass गर्छ। `sudo` एउटा program हो जसले regular user लाई logging र access control सहित एउटा command का लागि root-level permission अस्थायी रूपमा दिन्छ। Modern server मा best practice: direct root SSH login disable गर्नुहोस् (sshd_config मा `PermitRootLogin no`), privileged task का लागि केवल sudo अनुमति दिनुहोस्।",
        jp: "root（UID 0）はスーパーユーザーアカウントで、すべてのパーミッションチェックをバイパスします。`sudo` は通常ユーザーに 1 つのコマンドのために root レベルの権限を一時的に付与するプログラムで、ログと アクセス制御が伴います。現代のサーバーのベストプラクティス：直接の root SSH ログインを無効化（sshd_config の `PermitRootLogin no`）し、特権タスクには sudo のみを許可します。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
    },
    {
      question: {
        en: "Why does SSH refuse to use my private key with 'permissions too open'?",
        np: "SSH ले 'permissions too open' सहित मेरो private key प्रयोग गर्न किन अस्वीकार गर्छ?",
        jp: "SSH が「permissions too open」と言って秘密鍵を使ってくれないのはなぜか？",
      },
      answer: {
        en: "SSH intentionally refuses private keys that are readable by anyone other than the owner — this protects you from accidentally sharing credentials. The fix is always the same: `chmod 600 ~/.ssh/id_rsa`. The public key (`id_rsa.pub`) and `known_hosts` can be `644`. The `~/.ssh/` directory itself should be `700`.",
        np: "SSH ले जानाजानी owner बाहेक अरू कसैले पढ्न सक्ने private key अस्वीकार गर्छ — यसले तपाईंलाई credential गलत share गर्नबाट बचाउँछ। Fix सधैं एउटै हो: `chmod 600 ~/.ssh/id_rsa`। Public key (`id_rsa.pub`) र `known_hosts` `644` हुन सक्छ। `~/.ssh/` directory आफैं `700` हुनुपर्छ।",
        jp: "SSH は意図的に、所有者以外が読み取れる秘密鍵を拒否します — 誤って認証情報を共有することから保護するためです。修正は常に同じです：`chmod 600 ~/.ssh/id_rsa`。公開鍵（`id_rsa.pub`）と `known_hosts` は `644` で構いません。`~/.ssh/` ディレクトリ自体は `700` であるべきです。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
      callout: {
        en: "Quick fix: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_rsa && chmod 644 ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys`",
        np: "Quick fix: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_rsa && chmod 644 ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys`",
        jp: "クイック修正: `chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_rsa && chmod 644 ~/.ssh/id_rsa.pub ~/.ssh/authorized_keys`",
      },
    },
    {
      question: {
        en: "What are setuid, setgid, and the sticky bit?",
        np: "Setuid, setgid, र sticky bit के हुन्?",
        jp: "setuid・setgid・スティッキービットとは何か？",
      },
      answer: {
        en: "These are special permission bits beyond rwx: **setuid** (chmod u+s) on an executable makes it run as the file's owner regardless of who launches it — `passwd` uses this to let any user update `/etc/shadow`. **setgid** on a directory makes new files inside inherit the directory's group — useful for shared project folders. **Sticky bit** (chmod +t) on a directory means only the file's owner can delete it — `/tmp` uses this so users cannot delete each other's temp files.",
        np: "यी rwx भन्दा बाहिर special permission bit हुन्: **setuid** (chmod u+s) executable मा यसलाई कसले launch गर्छ त्यसको बेवास्ता गरी file को owner को रूपमा run गराउँछ — `passwd` ले यसलाई जुनसुकै user लाई `/etc/shadow` update गर्न दिन प्रयोग गर्छ। **setgid** directory मा नयाँ file भित्र directory को group inherit गराउँछ। **Sticky bit** (chmod +t) directory मा केवल file को owner ले यसलाई delete गर्न सक्छ — `/tmp` ले यो प्रयोग गर्छ।",
        jp: "これらは rwx を超えた特別なパーミッションビットです。**setuid**（chmod u+s）を実行ファイルに設定すると、誰が起動しても そのファイルの所有者として実行されます。`passwd` がこれを使い、誰でも `/etc/shadow` を更新できるようにしています。**setgid** をディレクトリに設定すると、中に新しいファイルが作られるとディレクトリのグループを継承します。**スティッキービット**（chmod +t）をディレクトリに設定すると、ファイルの所有者だけがそれを削除できます。`/tmp` はこれにより、ユーザーが互いの一時ファイルを削除できないようにしています。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
    },
    {
      question: {
        en: "What is umask?",
        np: "Umask के हो?",
        jp: "umask とは何か？",
      },
      answer: {
        en: "umask is a bitmask that the kernel subtracts from the maximum permissions when a new file or directory is created. The default umask on most Linux distros is `022`, which means: new files get `644` (666 − 022) and new directories get `755` (777 − 022). In high-security environments you may set `027` (files: 640, dirs: 750) to prevent world-readable defaults. Check and set it with the `umask` command.",
        np: "umask एउटा bitmask हो जुन kernel ले नयाँ file वा directory create हुँदा maximum permission बाट घटाउँछ। अधिकांश Linux distro मा default umask `022` हो, जसको अर्थ: नयाँ file ले `644` (666 − 022) र नयाँ directory ले `755` (777 − 022) पाउँछ। High-security environment मा world-readable default रोक्न `027` (file: 640, dir: 750) set गर्न सकिन्छ।",
        jp: "umask はカーネルが新しいファイルやディレクトリを作成する際に最大パーミッションから差し引くビットマスクです。ほとんどの Linux ディストリビューションのデフォルト umask は `022` で、新しいファイルは `644`（666 − 022）、新しいディレクトリは `755`（777 − 022）になります。高セキュリティ環境では world-readable なデフォルトを防ぐために `027`（ファイル: 640, ディレクトリ: 750）を設定することがあります。`umask` コマンドで確認・設定できます。",
      },
      tag: { en: "security", np: "सुरक्षा", jp: "セキュリティ" },
    },
  ],
};
