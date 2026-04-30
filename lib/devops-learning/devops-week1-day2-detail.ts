import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "On Linux, everything is a file — devices, sockets, processes, and directories all appear as nodes in one unified tree rooted at `/`. The Filesystem Hierarchy Standard (FHS) defines what goes where so that every distro and tool can assume the same layout.",
    np: "Linux मा, सबै कुरा फाइल हो — device, socket, process, र directory सबै `/` मा root भएको एउटै unified tree मा node को रूपमा देखिन्छन्। Filesystem Hierarchy Standard (FHS) ले के कहाँ जान्छ भनेर परिभाषित गर्छ ताकि हरेक distro र tool एउटै layout मान्न सक्छ।",
    jp: "Linux ではすべてがファイルです。デバイス・ソケット・プロセス・ディレクトリもすべて `/` をルートとする一本のツリーのノードとして現れます。FHS（Filesystem Hierarchy Standard）がどこに何を置くかを定義し、あらゆる distro とツールが同じレイアウトを前提にできます。",
  } as const,
  o2: {
    en: "Today you learn the purpose of every top-level directory and the navigation commands you will type hundreds of times per week as a DevOps engineer.",
    np: "आज तपाईंले हरेक top-level directory को उद्देश्य र navigation command सिक्नुहुनेछ जुन DevOps engineer को रूपमा प्रति हप्ता सयौं पटक टाइप गर्नुहुनेछ।",
    jp: "本日はすべてのトップレベルディレクトリの目的と、DevOps エンジニアとして毎週何百回も打つナビゲーションコマンドを学びます。",
  } as const,
};

export const DEVOPS_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "The Linux Filesystem Hierarchy Standard (FHS)",
        np: "Linux Filesystem Hierarchy Standard (FHS)",
        jp: "Linux ファイルシステム階層規格 (FHS)",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Unlike Windows which splits storage across drive letters (C:\\, D:\\), Linux mounts everything under a single root `/`. Every disk, USB drive, and network share appears as a directory somewhere under that root. The FHS specification ensures `/etc` always means config, `/var/log` always means logs, and so on — no matter which distro or cloud provider you are on.",
            np: "Windows जसले storage लाई drive letter (C:\\, D:\\) मा विभाजित गर्छ, Linux ले सबै कुरा एउटै root `/` मुनि mount गर्छ। हरेक disk, USB drive, र network share त्यो root मुनि कहीं न कहीं directory को रूपमा देखिन्छ। FHS specification ले सुनिश्चित गर्छ कि `/etc` सधैं config, `/var/log` सधैं log भनेको छ — जुन distro वा cloud provider मा भए पनि।",
            jp: "Windows がストレージをドライブレター（C:\\、D:\\）で分割するのと異なり、Linux はすべてを単一のルート `/` 以下にマウントします。ディスク・USB ドライブ・ネットワーク共有はすべてそのルート以下のどこかのディレクトリとして現れます。FHS 仕様により、どの distro やクラウドプロバイダーでも `/etc` は設定、`/var/log` はログを意味することが保証されています。",
          },
        },
        { type: "diagram", id: "devops-linux-hierarchy" },
        {
          type: "table",
          caption: {
            en: "Key top-level directories and their DevOps importance",
            np: "मुख्य top-level directory र DevOps मा तिनीहरूको महत्त्व",
            jp: "主要なトップレベルディレクトリと DevOps での重要性",
          },
          headers: [
            { en: "Path", np: "Path", jp: "パス" },
            { en: "Purpose", np: "उद्देश्य", jp: "目的" },
            { en: "DevOps relevance", np: "DevOps सान्दर्भिकता", jp: "DevOps での関連性" },
          ],
          rows: [
            [
              { en: "/etc", np: "/etc", jp: "/etc" },
              { en: "System-wide configuration files (text)", np: "System-wide configuration file (text)", jp: "システム全体の設定ファイル（テキスト）" },
              { en: "nginx.conf, sshd_config, cron jobs, hosts file all live here", np: "nginx.conf, sshd_config, cron job, hosts file सब यहाँ हुन्छन्", jp: "nginx.conf・sshd_config・cron ジョブ・hosts ファイルがここにある" },
            ],
            [
              { en: "/var/log", np: "/var/log", jp: "/var/log" },
              { en: "Rotating log files (grow over time)", np: "Rotating log file (समयसँगै बढ्छन्)", jp: "ローテーションするログファイル（時間とともに増大）" },
              { en: "First place to check during incidents: syslog, auth.log, nginx/access.log", np: "Incident मा सबभन्दा पहिले जाँच्ने ठाउँ: syslog, auth.log, nginx/access.log", jp: "インシデント時に最初に確認する場所：syslog・auth.log・nginx/access.log" },
            ],
            [
              { en: "/home", np: "/home", jp: "/home" },
              { en: "User home directories (/home/alice, /home/bob)", np: "User home directory (/home/alice, /home/bob)", jp: "ユーザーのホームディレクトリ（/home/alice・/home/bob）" },
              { en: "SSH keys (~/.ssh/), shell config (~/.bashrc), dotfiles", np: "SSH key (~/.ssh/), shell config (~/.bashrc), dotfile", jp: "SSH 鍵（~/.ssh/）・シェル設定（~/.bashrc）・dotfiles" },
            ],
            [
              { en: "/tmp", np: "/tmp", jp: "/tmp" },
              { en: "Temporary files — cleared on reboot", np: "Temporary file — reboot मा सफा हुन्छ", jp: "一時ファイル — 再起動で削除される" },
              { en: "CI pipelines use /tmp for build artifacts; never store persistent data here", np: "CI pipeline ले build artifact का लागि /tmp प्रयोग गर्छ; यहाँ कहिल्यै persistent data नराख्नुहोस्", jp: "CI パイプラインはビルド成果物に /tmp を使う。永続データを置いてはいけない" },
            ],
            [
              { en: "/proc", np: "/proc", jp: "/proc" },
              { en: "Virtual filesystem — kernel exposes live process data as files", np: "Virtual filesystem — kernel ले live process data file को रूपमा देखाउँछ", jp: "仮想ファイルシステム — カーネルがリアルタイムのプロセスデータをファイルとして公開" },
              { en: "/proc/cpuinfo, /proc/meminfo, /proc/<pid>/environ — useful for debugging", np: "/proc/cpuinfo, /proc/meminfo, /proc/<pid>/environ — debugging का लागि उपयोगी", jp: "/proc/cpuinfo・/proc/meminfo・/proc/<pid>/environ — デバッグに役立つ" },
            ],
            [
              { en: "/usr/local", np: "/usr/local", jp: "/usr/local" },
              { en: "Manually installed software (not from package manager)", np: "Manually install गरिएको software (package manager बाट होइन)", jp: "手動でインストールしたソフトウェア（パッケージマネージャー経由ではない）" },
              { en: "Custom binaries, Ansible roles, and scripts you deploy often land here", np: "Custom binary, Ansible role, र तपाईंले deploy गर्ने script प्राय: यहाँ हुन्छन्", jp: "カスタムバイナリ・Ansible ロール・デプロイするスクリプトがここに置かれることが多い" },
            ],
            [
              { en: "/sys", np: "/sys", jp: "/sys" },
              { en: "Virtual filesystem — kernel hardware and device info", np: "Virtual filesystem — kernel hardware र device जानकारी", jp: "仮想ファイルシステム — カーネルのハードウェアとデバイス情報" },
              { en: "Container runtimes and performance tuning tools read /sys/class/net, /sys/block", np: "Container runtime र performance tuning tool ले /sys/class/net, /sys/block पढ्छन्", jp: "コンテナランタイムやパフォーマンスチューニングツールが /sys/class/net・/sys/block を読む" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Navigation — the commands you type every day",
        np: "Navigation — हरेक दिन टाइप गर्ने command हरू",
        jp: "ナビゲーション — 毎日打つコマンド",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Most of your shell time as a DevOps engineer is navigating to the right directory, listing its contents, and reading files. These five commands cover 80% of that work — learn them cold.",
            np: "DevOps engineer को रूपमा तपाईंको अधिकांश shell समय सही directory मा जान, यसको content list गर्न, र file पढ्नमा जान्छ। यी पाँच command ले त्यो काम को ८०% कभर गर्छ — यिनलाई राम्ररी सिक्नुहोस्।",
            jp: "DevOps エンジニアとして、シェルを使う時間の大半は適切なディレクトリへの移動・内容の一覧表示・ファイルの読み取りです。この 5 つのコマンドでその 80% をカバーできます。しっかりマスターしましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Core navigation commands",
            np: "Core navigation command हरू",
            jp: "基本ナビゲーションコマンド",
          },
          code: `# Where am I?
pwd                    # Print Working Directory

# What is in this directory?
ls                     # simple list
ls -l                  # long format: permissions, owner, size, date
ls -lh                 # long format with human-readable sizes (KB/MB)
ls -la                 # include hidden files (dotfiles like .bashrc)
ls -lt                 # sort by modification time, newest first

# Move around
cd /etc                # go to /etc (absolute path)
cd config              # go into 'config' subdirectory (relative)
cd ..                  # go up one level
cd -                   # go back to previous directory (toggle)
cd ~                   # go to your home directory

# Read files without opening an editor
cat /etc/os-release    # dump whole file to terminal
less /var/log/syslog   # page through a large file (q to quit)
head -20 /var/log/syslog  # first 20 lines
tail -50 /var/log/syslog  # last 50 lines
tail -f /var/log/syslog   # follow in real time (Ctrl+C to stop)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Tab completion** is your best friend — type the first few letters and press Tab to complete the path. Press Tab twice to see all options.",
              np: "**Tab completion** तपाईंको सबभन्दा राम्रो साथी हो — पहिलो केही अक्षर टाइप गर्नुहोस् र path complete गर्न Tab थिच्नुहोस्। सबै विकल्प हेर्न दुई पटक Tab थिच्नुहोस्।",
              jp: "**Tab 補完**は最大の味方です。最初の数文字を打って Tab を押せばパスが補完されます。Tab を 2 回押すとすべての候補が表示されます。",
            },
            {
              en: "`tail -f` is indispensable during deployments — run it against your app log to watch errors appear in real time.",
              np: "`tail -f` deployment को दौरान अपरिहार्य छ — real time मा error देखाउन आफ्नो app log मा यो चलाउनुहोस्।",
              jp: "`tail -f` はデプロイ中に欠かせません。アプリのログに対して実行するとエラーをリアルタイムで確認できます。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "File operations — create, copy, move, delete",
        np: "File operations — create, copy, move, delete",
        jp: "ファイル操作 — 作成・コピー・移動・削除",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "File and directory management",
            np: "File र directory व्यवस्थापन",
            jp: "ファイルとディレクトリの管理",
          },
          code: `# Create
touch app.log           # create an empty file (or update timestamp)
mkdir logs              # create a directory
mkdir -p deploy/v2/app  # create nested directories in one command

# Copy
cp app.conf app.conf.bak       # copy a file
cp -r /etc/nginx /tmp/nginx-backup  # copy directory recursively

# Move / rename
mv app.conf.bak /tmp/          # move file to /tmp/
mv old-name.conf new-name.conf # rename (mv to same dir, new name)

# Delete — CAREFUL: no recycle bin on Linux servers
rm app.log                     # delete a file
rm -r /tmp/old-deploy/         # delete directory recursively
rm -i important.conf           # prompt before deleting (safer)

# Symbolic links (symlinks) — like shortcuts
ln -s /usr/local/nginx/sbin/nginx /usr/bin/nginx  # create symlink
ls -la /usr/bin/nginx          # shows: nginx -> /usr/local/...

# Disk usage
du -sh /var/log                # total size of /var/log
du -sh /var/log/*              # size of each item inside
df -h                          # free space on all mounted filesystems`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**`rm -rf` is irreversible** on Linux servers — there is no Trash folder. Before running it, use `ls` or `echo rm -rf <path>` to preview what you are targeting.",
              np: "**`rm -rf` Linux server मा अपरिवर्तनीय छ** — Trash folder छैन। यो चलाउनु अघि, `ls` वा `echo rm -rf <path>` ले के target गर्दै छौं preview गर्नुहोस्।",
              jp: "**`rm -rf` は Linux サーバーでは取り消せません** — ゴミ箱がありません。実行前に `ls` や `echo rm -rf <path>` で対象を確認してください。",
            },
            {
              en: "`mkdir -p` is safe to run repeatedly — it does nothing if the directory already exists, which makes it ideal for idempotent provisioning scripts.",
              np: "`mkdir -p` पटक-पटक चलाउन सुरक्षित छ — directory पहिले नै अवस्थित छ भने केही गर्दैन, जसले idempotent provisioning script का लागि उपयुक्त बनाउँछ।",
              jp: "`mkdir -p` は繰り返し実行しても安全です。ディレクトリがすでに存在する場合は何もしないため、冪等なプロビジョニングスクリプトに最適です。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Searching — find, grep, and locate",
        np: "Searching — find, grep, र locate",
        jp: "検索 — find・grep・locate",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "On production servers you regularly need to find a config file, locate where a binary is installed, or search for an error string inside logs. These three tools cover every search scenario you will face.",
            np: "Production server मा तपाईंलाई नियमित रूपमा config file फेला पार्न, binary कहाँ install भयो खोज्न, वा log भित्र error string खोज्न आवश्यक पर्छ। यी तीन tool ले तपाईंले सामना गर्ने हरेक search scenario कभर गर्छ।",
            jp: "本番サーバーでは設定ファイルの検索・バイナリのインストール場所の特定・ログ内のエラー文字列の検索が頻繁に必要になります。この 3 つのツールであらゆる検索シナリオに対応できます。",
          },
        },
        {
          type: "code",
          title: {
            en: "find, grep, and which",
            np: "find, grep, र which",
            jp: "find・grep・which",
          },
          code: `# find — search by name, type, size, or time
find /etc -name "*.conf"              # all .conf files under /etc
find /var/log -name "*.log" -mtime -1 # logs modified in the last 24 h
find /tmp -type f -size +10M          # files larger than 10 MB
find . -name "*.sh" -perm /111        # executable shell scripts

# grep — search inside file contents
grep "error" /var/log/syslog          # lines containing 'error'
grep -r "FAILED" /var/log/            # recursive search in directory
grep -i "timeout" app.log             # case-insensitive
grep -n "reject" /etc/nginx/nginx.conf  # show line numbers
grep -v "debug" app.log               # invert: lines NOT matching

# which / whereis — find where a binary is installed
which nginx                           # /usr/sbin/nginx
which python3                         # /usr/bin/python3
whereis nginx                         # binary + man page + source paths`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Navigate a real Linux system",
        np: "Hands-on: वास्तविक Linux system मा navigate गर्नुहोस्",
        jp: "ハンズオン: 実際の Linux システムをナビゲートする",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Exploration mission — run each command and observe the output",
            np: "Exploration mission — हरेक command चलाउनुहोस् र output निरीक्षण गर्नुहोस्",
            jp: "探索ミッション — 各コマンドを実行して出力を観察する",
          },
          code: `# 1. Find the nginx config (if nginx is installed)
find /etc -name "nginx.conf" 2>/dev/null

# 2. Find the three largest files under /var
find /var -type f -printf "%s %p\n" 2>/dev/null | sort -rn | head -5

# 3. See what's eating disk space
du -sh /var/* 2>/dev/null | sort -rh | head -10

# 4. Count lines in all log files under /var/log
find /var/log -name "*.log" -exec wc -l {} + 2>/dev/null

# 5. Search for failed logins in auth log
grep -i "failed" /var/log/auth.log 2>/dev/null | tail -20

# 6. See how many config files are in /etc
find /etc -maxdepth 1 -name "*.conf" | wc -l

# 7. Check your current directory and tree structure
pwd && ls -la`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What does 'everything is a file' actually mean?",
        np: "'सबै कुरा file हो' भनेको वास्तवमा के हो?",
        jp: "「すべてがファイル」とは実際にどういう意味か？",
      },
      answer: {
        en: "In Linux, the kernel exposes almost everything through the filesystem interface — so programs use the same `open()`, `read()`, `write()` syscalls to talk to a hard disk (`/dev/sda`), a serial port (`/dev/ttyS0`), a running process (`/proc/1234/`), or a network socket. This uniformity is why shell pipelines are so powerful: `cat`, `grep`, and `awk` can process data from a file, a device, or a network connection with identical syntax.",
        np: "Linux मा, kernel ले प्रायः सबै कुरा filesystem interface मार्फत expose गर्छ — त्यसैले program हरू hard disk (`/dev/sda`), serial port (`/dev/ttyS0`), running process (`/proc/1234/`), वा network socket सँग कुरा गर्न एउटै `open()`, `read()`, `write()` syscall प्रयोग गर्छन्।",
        jp: "Linux ではカーネルがほぼすべてをファイルシステムインターフェースで公開しています。プログラムはハードディスク（`/dev/sda`）・シリアルポート（`/dev/ttyS0`）・実行中プロセス（`/proc/1234/`）・ネットワークソケットと通信するために同じ `open()`・`read()`・`write()` のシスコールを使います。",
      },
      tag: { en: "filesystem", np: "फाइलसिस्टम", jp: "ファイルシステム" },
    },
    {
      question: {
        en: "What is /proc — is it a real directory?",
        np: "/proc के हो — के यो वास्तविक directory हो?",
        jp: "/proc とは何か — 本物のディレクトリなのか？",
      },
      answer: {
        en: "/proc is a virtual filesystem — it exists only in memory and is regenerated by the kernel every time you read from it. There are no actual files on disk. When you run `cat /proc/meminfo` the kernel generates the output on the fly. This is how tools like `top`, `free`, and `ps` get their data — they read files in /proc rather than making proprietary syscalls.",
        np: "/proc एक virtual filesystem हो — यो केवल memory मा अवस्थित छ र तपाईंले यसबाट पढ्दा kernel ले हरेक पटक regenerate गर्छ। Disk मा वास्तविक file छैनन्। जब तपाईं `cat /proc/meminfo` चलाउनुहुन्छ kernel ले on-the-fly output generate गर्छ।",
        jp: "/proc は仮想ファイルシステムです。メモリ上にのみ存在し、読み取るたびにカーネルが再生成します。ディスク上に実際のファイルはありません。`cat /proc/meminfo` を実行すると、カーネルがその場で出力を生成します。`top`・`free`・`ps` などのツールは独自のシスコールではなく /proc 内のファイルを読み取ってデータを取得しています。",
      },
      tag: { en: "filesystem", np: "फाइलसिस्टम", jp: "ファイルシステム" },
    },
    {
      question: {
        en: "Why are hidden files called 'dotfiles' and how do I see them?",
        np: "Hidden file लाई 'dotfile' किन भनिन्छ र म तिनीहरूलाई कसरी देख्न सक्छु?",
        jp: "隠しファイルが「ドットファイル」と呼ばれるのはなぜか。表示方法は？",
      },
      answer: {
        en: "Any file or directory whose name starts with a `.` (dot) is hidden from `ls` by default. This is a convention, not a security feature — any user can see them with `ls -a`. Config files like `.bashrc`, `.gitconfig`, and `.ssh/` follow this convention to keep your home directory tidy. In DevOps you often deploy dotfiles to new servers as part of provisioning.",
        np: "`.` (dot) बाट सुरु हुने जुनसुकै file वा directory पूर्वनिर्धारित रूपमा `ls` बाट hidden हुन्छ। यो एउटा convention हो, security feature होइन — जुनसुकै user ले `ls -a` ले देख्न सक्छ।",
        jp: "名前が `.`（ドット）で始まるファイルやディレクトリは、デフォルトで `ls` から隠されます。これは慣習でありセキュリティ機能ではありません。`ls -a` でだれでも見られます。`.bashrc`・`.gitconfig`・`.ssh/` のような設定ファイルがこの慣習に従い、ホームディレクトリをすっきり保ちます。DevOps ではプロビジョニングの一部として dotfile を新しいサーバーにデプロイすることがよくあります。",
      },
      tag: { en: "filesystem", np: "फाइलसिस्टम", jp: "ファイルシステム" },
    },
    {
      question: {
        en: "What is an inode?",
        np: "Inode भनेको के हो?",
        jp: "inode とは何か？",
      },
      answer: {
        en: "An inode is the kernel's internal data structure for a file — it stores the file's permissions, owner, size, timestamps, and disk block locations, but NOT the filename. The filename lives in the directory entry and points to an inode number. This is why `mv` (rename within the same filesystem) is nearly instant — it only updates the directory entry, not the data blocks. It also explains how hard links work: multiple filenames pointing to the same inode.",
        np: "Inode भनेको file को लागि kernel को internal data structure हो — यसले file को permission, owner, size, timestamp, र disk block location store गर्छ, तर filename होइन। Filename directory entry मा हुन्छ र inode number मा point गर्छ।",
        jp: "inode はファイルのためのカーネル内部データ構造です。ファイルのパーミッション・所有者・サイズ・タイムスタンプ・ディスクブロックの位置を格納しますが、ファイル名は含みません。ファイル名はディレクトリエントリに存在し、inode 番号を指します。そのため `mv`（同じファイルシステム内でのリネーム）はほぼ瞬時に完了します。データブロックではなくディレクトリエントリだけを更新するからです。ハードリンクの仕組みもこれで説明できます：複数のファイル名が同じ inode を指しています。",
      },
      tag: { en: "filesystem", np: "फाइलसिस्टम", jp: "ファイルシステム" },
      callout: {
        en: "Quick check: `ls -i` shows inode numbers. `stat filename` shows all inode metadata for a file.",
        np: "Quick check: `ls -i` ले inode number देखाउँछ। `stat filename` ले file को सबै inode metadata देखाउँछ।",
        jp: "確認コマンド: `ls -i` で inode 番号を表示。`stat filename` でファイルのすべての inode メタデータを確認できます。",
      },
    },
  ],
};
