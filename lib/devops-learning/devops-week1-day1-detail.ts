import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Linux is the foundation of modern DevOps. Over 96 % of cloud servers, every major container runtime, and most CI/CD agents run on Linux. Before you automate anything, you need to understand the system you are automating.",
    np: "Linux आधुनिक DevOps को आधार हो। ९६% भन्दा बढी cloud server, हरेक प्रमुख container runtime, र अधिकांश CI/CD agent Linux मा चल्छन्। कुनै पनि कुरा स्वचालित गर्नु अघि तपाईंले जुन प्रणाली स्वचालित गर्दै हुनुहुन्छ त्यो बुझ्नु जरुरी छ।",
    jp: "Linux は現代 DevOps の土台です。クラウドサーバーの 96%以上、主要なコンテナランタイムのすべて、そして多くの CI/CD エージェントが Linux 上で動いています。何かを自動化する前に、自動化する対象のシステムを理解しなければなりません。",
  } as const,
  o2: {
    en: "Today you will build a mental model of the OS stack — from hardware up to your terminal — and learn the difference between the kernel (the OS core) and the shell (the text interface to it). Days 2–7 build on this foundation.",
    np: "आज तपाईंले OS stack को मानसिक मोडेल बनाउनु हुनेछ — hardware देखि terminal सम्म — र kernel (OS core) र shell (यसको text interface) बीचको भिन्नता सिक्नु हुनेछ। दिन २–७ यसी आधारमा निर्माण हुनेछन्।",
    jp: "本日は OS スタックのメンタルモデルを構築します。ハードウェアからターミナルまでの各層を理解し、カーネル（OS コア）とシェル（テキストインターフェース）の違いを学びます。2〜7 日目はこの基礎の上に積み上げられます。",
  } as const,
};

export const DEVOPS_DAY_1_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Why Linux dominates DevOps",
        np: "Linux DevOps मा किन प्रभुत्व जमाउँछ",
        jp: "Linux が DevOps を支配する理由",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Windows and macOS are excellent desktop operating systems, but they were not designed for always-on, remote-managed, resource-efficient server workloads. Linux was. It ships without a GUI by default, exposes every system detail through text files and commands, and lets you script anything — which is exactly what DevOps needs.",
            np: "Windows र macOS उत्कृष्ट desktop operating system हुन्, तर तिनीहरू सधैं-चालु, remote-managed, resource-efficient server workload का लागि डिजाइन गरिएको थिएन। Linux थियो। यो पूर्वनिर्धारित रूपमा GUI बिना पठाइन्छ, text file र command मार्फत हरेक system विवरण देखाउँछ, र तपाईंलाई जे पनि script गर्न दिन्छ — जुन ठ्याक्कै DevOps लाई चाहिन्छ।",
            jp: "Windows と macOS は優れたデスクトップ OS ですが、常時稼動・リモート管理・リソース効率のよいサーバーワークロード向けに設計されていません。Linux はそのために作られました。デフォルトで GUI なし、テキストファイルとコマンドですべてのシステム詳細を公開し、何でもスクリプト化できます。DevOps が必要とするものがそろっています。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Open source** — you can read, modify, and redistribute every line of the OS. No black boxes.",
              np: "**Open source** — OS को हरेक लाइन पढ्न, परिमार्जन गर्न र पुनः वितरण गर्न सकिन्छ। कुनै black box छैन।",
              jp: "**オープンソース** — OS のすべてのコードを読み、変更し、再配布できます。ブラックボックスはありません。",
            },
            {
              en: "**Scriptable by design** — every configuration lives in plain-text files; automation is first-class.",
              np: "**डिजाइनबाट Scriptable** — हरेक configuration plain-text file मा हुन्छ; automation प्रथम श्रेणी हो।",
              jp: "**設計からスクリプト化可能** — すべての設定はテキストファイルに存在し、自動化が一級市民です。",
            },
            {
              en: "**Lightweight and fast** — a headless Linux VM can boot in under two seconds and use less than 100 MB of RAM.",
              np: "**हल्का र छिटो** — headless Linux VM दुई सेकेन्ड भित्र बुट हुन सक्छ र 100 MB भन्दा कम RAM प्रयोग गर्छ।",
              jp: "**軽量で高速** — ヘッドレス Linux VM は 2 秒以内に起動し、RAM 消費が 100 MB 未満です。",
            },
            {
              en: "**Uniform tooling** — the same `bash`, `grep`, `curl`, and `systemctl` commands work on every major cloud provider and distro.",
              np: "**एकसमान tooling** — एउटै `bash`, `grep`, `curl`, र `systemctl` command हरेक प्रमुख cloud provider र distro मा काम गर्छ।",
              jp: "**統一されたツール群** — `bash`・`grep`・`curl`・`systemctl` など同じコマンドが主要なクラウドプロバイダーとディストリビューションすべてで動きます。",
            },
            {
              en: "**Container ecosystem** — Docker, Kubernetes, and containerd are Linux-native technologies; running them on Windows/macOS still uses a Linux VM under the hood.",
              np: "**Container ecosystem** — Docker, Kubernetes, र containerd Linux-native प्रविधिहरू हुन्; Windows/macOS मा चलाउँदा पनि भित्रमा Linux VM प्रयोग गर्छ।",
              jp: "**コンテナエコシステム** — Docker・Kubernetes・containerd は Linux ネイティブです。Windows/macOS で実行しても内部では Linux VM が動いています。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "The OS stack — from hardware to your terminal",
        np: "OS stack — hardware देखि terminal सम्म",
        jp: "OS スタック — ハードウェアからターミナルへ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Think of the OS as a layered stack. Each layer hides complexity from the layer above it. You work at the top (shell); the kernel works at the bottom (hardware). Understanding where each layer sits helps you diagnose problems — a crashed process is a user-space issue, a kernel panic is hardware or driver-level.",
            np: "OS लाई तहबद्ध stack को रूपमा सोच्नुहोस्। प्रत्येक तहले माथिको तहबाट जटिलता लुकाउँछ। तपाईं माथि (shell) मा काम गर्नुहुन्छ; kernel तल (hardware) मा काम गर्छ। प्रत्येक तह कहाँ बस्छ भन्ने बुझ्नाले समस्या निदान गर्न मद्दत गर्छ।",
            jp: "OS は階層化されたスタックです。各層は上の層から複雑さを隠します。あなたは上（シェル）で作業し、カーネルは下（ハードウェア）で動きます。各層の位置を理解することで問題の診断が楽になります。クラッシュしたプロセスはユーザー空間の問題、カーネルパニックはハードウェアやドライバーの問題です。",
          },
        },
        { type: "diagram", id: "devops-linux-os-stack" },
        {
          type: "table",
          caption: {
            en: "The Linux OS stack — bottom to top",
            np: "Linux OS stack — तल देखि माथि",
            jp: "Linux OS スタック（下から上へ）",
          },
          headers: [
            { en: "Layer", np: "तह", jp: "層" },
            { en: "Who lives here", np: "यहाँ के हुन्छ", jp: "ここに何があるか" },
            { en: "Examples", np: "उदाहरण", jp: "例" },
          ],
          rows: [
            [
              { en: "Hardware", np: "Hardware", jp: "ハードウェア" },
              { en: "Physical CPU, RAM, disk, NIC", np: "Physical CPU, RAM, disk, NIC", jp: "物理 CPU・RAM・ディスク・NIC" },
              { en: "Intel/AMD x86, SSD, Ethernet card", np: "Intel/AMD x86, SSD, Ethernet card", jp: "Intel/AMD x86, SSD, イーサネット" },
            ],
            [
              { en: "Kernel", np: "Kernel", jp: "カーネル" },
              { en: "OS core — manages hardware, memory, and processes", np: "OS core — hardware, memory, प्रक्रिया व्यवस्थापन", jp: "OS コア — ハードウェア・メモリ・プロセスを管理" },
              { en: "Linux kernel (vmlinuz), device drivers, scheduler", np: "Linux kernel (vmlinuz), device drivers, scheduler", jp: "Linux カーネル (vmlinuz)、デバイスドライバー、スケジューラー" },
            ],
            [
              { en: "System calls (syscalls)", np: "System calls (syscalls)", jp: "システムコール (syscalls)" },
              { en: "The only doorway from user programs into the kernel", np: "User program बाट kernel सम्म पुग्ने एक मात्र द्वार", jp: "ユーザープログラムからカーネルへの唯一の入口" },
              { en: "open(), read(), write(), fork(), exec()", np: "open(), read(), write(), fork(), exec()", jp: "open()、read()、write()、fork()、exec()" },
            ],
            [
              { en: "Standard library (glibc)", np: "Standard library (glibc)", jp: "標準ライブラリ (glibc)" },
              { en: "Wrappers that make syscalls easier for programs to use", np: "Program का लागि syscall सजिलो बनाउने wrapper", jp: "プログラムがシスコールを使いやすくするラッパー" },
              { en: "printf, malloc, fopen, pthread", np: "printf, malloc, fopen, pthread", jp: "printf, malloc, fopen, pthread" },
            ],
            [
              { en: "Shell / user space", np: "Shell / user space", jp: "シェル / ユーザー空間" },
              { en: "Programs and the text interface you type commands into", np: "Program हरू र तपाईंले command टाइप गर्ने text interface", jp: "プログラムとコマンドを入力するテキストインターフェース" },
              { en: "bash, zsh, systemd, cron, your scripts", np: "bash, zsh, systemd, cron, तपाईंका scripts", jp: "bash、zsh、systemd、cron、自作スクリプト" },
            ],
            [
              { en: "Applications", np: "Applications", jp: "アプリケーション" },
              { en: "Everything the user or system runs on top of the shell/libraries", np: "Shell/library माथि user वा system ले चलाउने सबै कुरा", jp: "シェルやライブラリの上で動くすべてのソフトウェア" },
              { en: "nginx, docker, python, mysql, your app", np: "nginx, docker, python, mysql, तपाईंको app", jp: "nginx, docker, python, mysql, あなたのアプリ" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Inspect your kernel and OS info",
            np: "तपाईंको kernel र OS जानकारी निरीक्षण गर्नुहोस्",
            jp: "カーネルと OS 情報を確認する",
          },
          code: `# Print the kernel name, version, and architecture
uname -a

# Show the OS release (distro name and version)
cat /etc/os-release

# Show kernel version only
uname -r

# Show machine hardware architecture (x86_64, arm64, etc.)
uname -m`,
        },
      ],
    },
    {
      title: {
        en: "Kernel vs. shell — the key distinction",
        np: "Kernel बनाम shell — मुख्य भिन्नता",
        jp: "カーネル vs シェル — 核心の違い",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Beginners often conflate the kernel and the shell. They are entirely different things that happen to ship together in a Linux distribution. The kernel is invisible — you never interact with it directly. The shell is your command interpreter — the program that reads what you type and translates it into system calls.",
            np: "नवशिक्षार्थीहरूले प्रायः kernel र shell लाई एउटै ठान्छन्। तिनीहरू पूर्णतः फरक कुराहरू हुन् जुन Linux distribution मा सँगै पठाइन्छ। Kernel अदृश्य छ — तपाईंले यससँग सिधै अन्तर्क्रिया गर्नुहुन्न। Shell तपाईंको command interpreter हो — तपाईंले टाइप गरेको पढ्ने र system call मा अनुवाद गर्ने program।",
            jp: "初心者はカーネルとシェルを混同しがちです。どちらも Linux ディストリビューションに含まれていますが、まったく別のものです。カーネルは見えません — 直接操作することはありません。シェルはコマンドインタープリターです — あなたが入力したコマンドを読み取り、システムコールに変換するプログラムです。",
          },
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Kernel responsibilities** — scheduling CPU time, managing RAM, handling I/O interrupts, enforcing permissions, loading device drivers.",
              np: "**Kernel जिम्मेवारी** — CPU समय तालिका, RAM व्यवस्थापन, I/O interrupt ह्यान्डलिङ, अनुमति लागू गर्न, device driver लोड गर्न।",
              jp: "**カーネルの責務** — CPU タイムスケジューリング、RAM 管理、I/O 割り込み処理、パーミッション強制、デバイスドライバーのロード。",
            },
            {
              en: "**Shell responsibilities** — parsing your commands, expanding globs and variables, forking child processes, piping output between programs.",
              np: "**Shell जिम्मेवारी** — तपाईंका command parse गर्न, glob र variable विस्तार गर्न, child process fork गर्न, program बीच output pipe गर्न।",
              jp: "**シェルの責務** — コマンドの解析、グロブと変数の展開、子プロセスのフォーク、プログラム間のパイプ処理。",
            },
            {
              en: "**Key rule** — if a command fails with 'permission denied', that error comes from the kernel (it enforces access). If it fails with 'command not found', that comes from the shell (it cannot locate the binary).",
              np: "**मुख्य नियम** — यदि command 'permission denied' मा असफल हुन्छ भने त्यो error kernel बाट आउँछ (यसले access लागू गर्छ)। यदि 'command not found' मा असफल हुन्छ भने त्यो shell बाट आउँछ (यसले binary खोज्न सक्दैन)।",
              jp: "**重要なルール** — 「permission denied」エラーはカーネルからです（アクセス制御を行う）。「command not found」はシェルからです（バイナリが見つからない）。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Popular shells in DevOps",
        np: "DevOps मा लोकप्रिय shell हरू",
        jp: "DevOps でよく使うシェル",
      },
      blocks: [
        {
          type: "table",
          caption: {
            en: "Common Linux shells and their DevOps relevance",
            np: "सामान्य Linux shell र DevOps मा तिनीहरूको महत्त्व",
            jp: "一般的な Linux シェルと DevOps での重要性",
          },
          headers: [
            { en: "Shell", np: "Shell", jp: "シェル" },
            { en: "Default on", np: "पूर्वनिर्धारित", jp: "デフォルト環境" },
            { en: "DevOps use", np: "DevOps प्रयोग", jp: "DevOps での用途" },
          ],
          rows: [
            [
              { en: "bash", np: "bash", jp: "bash" },
              { en: "Most Linux distros, AWS EC2, Docker images", np: "अधिकांश Linux distro, AWS EC2, Docker image", jp: "大半の Linux ディストリビューション・AWS EC2・Docker イメージ" },
              { en: "CI/CD scripts, provisioning, cron jobs — the safe default", np: "CI/CD script, provisioning, cron job — सुरक्षित पूर्वनिर्धारित", jp: "CI/CD スクリプト・プロビジョニング・cron ジョブ — 安全なデフォルト" },
            ],
            [
              { en: "sh (POSIX sh)", np: "sh (POSIX sh)", jp: "sh (POSIX sh)" },
              { en: "Alpine Linux, minimal containers", np: "Alpine Linux, न्यूनतम container", jp: "Alpine Linux・最小限のコンテナ" },
              { en: "Portable scripts that must run on any Unix-like system", np: "कुनै पनि Unix-like system मा चल्नुपर्ने portable script", jp: "あらゆる Unix 系システムで動くポータブルスクリプト" },
            ],
            [
              { en: "zsh", np: "zsh", jp: "zsh" },
              { en: "macOS (default since Catalina), developer laptops", np: "macOS (Catalina पछि default), developer laptop", jp: "macOS（Catalina 以降のデフォルト）・開発者のラップトップ" },
              { en: "Local development; same scripts work as bash but better autocomplete", np: "स्थानीय विकास; bash जस्तै script काम गर्छ तर राम्रो autocomplete", jp: "ローカル開発。スクリプトは bash と互換だが補完機能が優れている" },
            ],
            [
              { en: "dash", np: "dash", jp: "dash" },
              { en: "Ubuntu /bin/sh symlink", np: "Ubuntu /bin/sh symlink", jp: "Ubuntu の /bin/sh シンボリックリンク" },
              { en: "Fast POSIX-compatible script runner; used by Ubuntu's init scripts", np: "छिटो POSIX-compatible script runner; Ubuntu का init script मा प्रयोग गरिन्छ", jp: "高速な POSIX 互換スクリプトランナー。Ubuntu の init スクリプトに使用" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Identify and explore your shell",
            np: "तपाईंको shell पहिचान र अन्वेषण गर्नुहोस्",
            jp: "使用中のシェルを確認・調べる",
          },
          code: `# Which shell am I using right now?
echo $SHELL

# What version is it?
bash --version       # if using bash
zsh --version        # if using zsh

# List all shells available on this system
cat /etc/shells

# Temporarily switch to bash (exit to return)
bash

# See which shell owns the current session (PID $$)
ps -p $$`,
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Your first Linux session",
        np: "Hands-on: तपाईंको पहिलो Linux session",
        jp: "ハンズオン: 最初の Linux セッション",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Run these commands one by one in a terminal. Do not just copy-paste — read what each one does, then type it. The goal is muscle memory and reading output, not speed.",
            np: "यी command हरू terminal मा एक-एक गरेर चलाउनुहोस्। केवल copy-paste नगर्नुहोस् — प्रत्येकले के गर्छ पढ्नुहोस्, त्यसपछि टाइप गर्नुहोस्। लक्ष्य muscle memory र output पढ्न हो, गति होइन।",
            jp: "ターミナルでこれらのコマンドを一つずつ実行してください。コピペするだけでなく、何をするコマンドかを読んでからタイプしてください。目的はスピードではなく、筋肉記憶と出力の読み方を身に付けることです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Orientation commands — run these in order",
            np: "Orientation command — यसै क्रममा चलाउनुहोस्",
            jp: "方向確認コマンド — この順番で実行",
          },
          code: `# 1. Who am I logged in as?
whoami

# 2. What machine am I on and what OS is running?
uname -a

# 3. Where am I in the filesystem right now?
pwd

# 4. What files are in this directory?
ls -lh

# 5. What shell is interpreting my commands?
echo $SHELL

# 6. What kernel version is running?
uname -r

# 7. How long has the machine been running? How many users?
uptime

# 8. How much disk space is used?
df -h

# 9. How much RAM is free?
free -h

# 10. Open the manual for any command (press q to quit)
man ls`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "If you do not have a Linux machine, use **WSL 2** on Windows, **UTM** on Apple Silicon Mac, or a free **AWS EC2 t2.micro** (free tier for 12 months).",
              np: "यदि तपाईंसँग Linux machine छैन भने Windows मा **WSL 2**, Apple Silicon Mac मा **UTM**, वा निःशुल्क **AWS EC2 t2.micro** (१२ महिना free tier) प्रयोग गर्नुहोस्।",
              jp: "Linux マシンがない場合は、Windows では **WSL 2**、Apple Silicon Mac では **UTM**、または無料の **AWS EC2 t2.micro**（12 ヶ月 free tier）を使いましょう。",
            },
            {
              en: "`man <command>` is the built-in manual — always check it before Googling. Press `/` to search inside, `q` to quit.",
              np: "`man <command>` built-in manual हो — Google गर्नु अघि सधैं यो जाँच्नुहोस्। भित्र खोज्न `/` थिच्नुहोस्, बाहिर निस्कन `q`।",
              jp: "`man <command>` は組み込みマニュアルです。Google より先に確認してください。`/` で検索、`q` で終了できます。",
            },
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is a Linux 'distribution' — is it different from Linux itself?",
        np: "Linux 'distribution' भनेको के हो — के यो Linux नै हो?",
        jp: "Linux「ディストリビューション」とは何か。Linux そのものと違うのか？",
      },
      answer: {
        en: "Linux is just the kernel — the core OS code written by Linus Torvalds. A distribution (distro) bundles the kernel with a package manager, init system, default shell, and user-facing tools to make a complete operating system. Ubuntu, Debian, CentOS, Alpine, and Amazon Linux 2 are all Linux distros — they all run the same kernel underneath but differ in tooling and defaults.",
        np: "Linux केवल kernel हो — Linus Torvalds ले लेखेको core OS code। Distribution (distro) ले kernel लाई package manager, init system, default shell, र user-facing tool सँग bundle गर्छ पूर्ण operating system बनाउन। Ubuntu, Debian, CentOS, Alpine, र Amazon Linux 2 सबै Linux distro हुन् — तिनीहरू सबैले एउटै kernel चलाउँछन् तर tooling र default मा फरक छन्।",
        jp: "Linux はカーネルだけです。Linus Torvalds が書いたコアの OS コードです。ディストリビューション（distro）はカーネルにパッケージマネージャー・init システム・デフォルトシェル・ユーザー向けツールをまとめて完全な OS にしたものです。Ubuntu・Debian・CentOS・Alpine・Amazon Linux 2 はすべて Linux ディストリビューションです。同じカーネルで動きますが、ツールやデフォルト設定が異なります。",
      },
      tag: { en: "linux", np: "Linux", jp: "Linux" },
    },
    {
      question: {
        en: "Why not just use macOS for DevOps? It also has a terminal.",
        np: "DevOps का लागि macOS किन नप्रयोग गर्ने? यसमा पनि terminal छ।",
        jp: "macOS でも DevOps できるのでは？ターミナルがあるじゃないか。",
      },
      answer: {
        en: "macOS is BSD-based, not Linux. Many commands look similar but behave differently (`sed`, `grep`, `date`), package paths differ (`/opt/homebrew` vs `/usr/bin`), and macOS-only tools like Homebrew are not available on servers. More critically, Docker on macOS runs inside a hidden Linux VM — you are already using Linux, just indirectly. For production-fidelity local testing, WSL 2 or a Linux VM matches your server environment exactly.",
        np: "macOS BSD-based छ, Linux होइन। धेरै command उस्तै देखिन्छन् तर फरक व्यवहार गर्छन् (`sed`, `grep`, `date`), package path फरक छन्, र Homebrew जस्ता macOS-only tool server मा उपलब्ध छैनन्। थप महत्त्वपूर्ण रूपमा, macOS मा Docker hidden Linux VM भित्र चल्छ — तपाईं पहिले नै Linux प्रयोग गर्दै हुनुहुन्छ, केवल अप्रत्यक्ष रूपमा। Production-fidelity local testing का लागि WSL 2 वा Linux VM ले तपाईंको server environment सँग ठ्याक्कै मेल खान्छ।",
        jp: "macOS は BSD ベースで、Linux ではありません。多くのコマンドは似ていますが動作が異なります（`sed`・`grep`・`date`）。パスも違い、Homebrew のような macOS 専用ツールはサーバーにありません。さらに重要なのは、macOS 上の Docker は隠れた Linux VM の中で動いているということです — すでに間接的に Linux を使っています。本番環境に忠実なローカルテストには WSL 2 か Linux VM を使うとサーバー環境と完全に一致します。",
      },
      tag: { en: "fundamentals", np: "आधारभूत", jp: "基礎" },
    },
    {
      question: {
        en: "What shell should I learn first — bash or zsh?",
        np: "पहिले कुन shell सिक्ने — bash कि zsh?",
        jp: "最初に覚えるべきシェルは bash と zsh のどちら？",
      },
      answer: {
        en: "Learn bash first. It is the default on virtually every Linux server, container base image, and CI runner you will ever use. Zsh is excellent for your local machine (macOS default since 2019), and 95% of bash scripts run unmodified in zsh — so learning bash first costs you nothing. Once you are comfortable, zsh's autocomplete and plugins make your laptop terminal much more productive.",
        np: "पहिले bash सिक्नुहोस्। यो प्रायः हरेक Linux server, container base image, र CI runner मा default हो। Zsh तपाईंको local machine का लागि उत्कृष्ट छ (2019 देखि macOS default), र 95% bash script zsh मा बिना परिमार्जन चल्छ — त्यसैले bash पहिले सिक्दा केही गुमाउनु पर्दैन। एकपटक comfortable भएपछि, zsh को autocomplete र plugin ले तपाईंको laptop terminal धेरै productive बनाउँछ।",
        jp: "まず bash を学びましょう。Linux サーバー・コンテナベースイメージ・CI ランナーのほぼすべてがデフォルトで bash を使います。zsh はローカルマシン向けに優れています（2019 年以降 macOS のデフォルト）。bash スクリプトの 95% は修正なしで zsh でも動くため、bash から始めても損はありません。慣れてきたら、zsh の補完機能とプラグインでラップトップの作業効率が大幅に上がります。",
      },
      tag: { en: "linux", np: "Linux", jp: "Linux" },
    },
    {
      question: {
        en: "What is a kernel panic, and should I worry about it?",
        np: "Kernel panic भनेको के हो, र के मलाई चिन्ता गर्नुपर्छ?",
        jp: "カーネルパニックとは何か。心配すべきか？",
      },
      answer: {
        en: "A kernel panic is the Linux equivalent of a Windows 'Blue Screen of Death' — the kernel detected an unrecoverable error and halted to prevent data corruption. Common causes are a buggy device driver, bad RAM, or filesystem corruption. As a DevOps engineer you will rarely see them on well-maintained cloud VMs, but when you do, check `dmesg` and `/var/log/kern.log` for the last messages before the crash.",
        np: "Kernel panic भनेको Windows को 'Blue Screen of Death' सरह हो — kernel ले data corruption रोक्न unrecoverable error पत्ता लगाएर रोकियो। सामान्य कारण: buggy device driver, खराब RAM, वा filesystem corruption। DevOps engineer को रूपमा राम्रोसँग व्यवस्थापित cloud VM मा यो बिरलै देखिन्छ, तर देखिएमा crash अघिका अन्तिम message को लागि `dmesg` र `/var/log/kern.log` जाँच्नुहोस्।",
        jp: "カーネルパニックは Windows の「ブルースクリーン（BSOD）」に相当します。カーネルが回復不可能なエラーを検出し、データ破損を防ぐために停止した状態です。よくある原因はバグのあるデバイスドライバー・不良 RAM・ファイルシステムの破損です。DevOps エンジニアとして適切に管理されたクラウド VM でこれを見ることは稀ですが、発生した場合はクラッシュ前の最後のメッセージを `dmesg` と `/var/log/kern.log` で確認してください。",
      },
      tag: { en: "linux", np: "Linux", jp: "Linux" },
      callout: {
        en: "Quick check: `dmesg | tail -50` shows the last 50 kernel log lines — run it right after an unexpected reboot.",
        np: "Quick check: `dmesg | tail -50` ले अन्तिम ५० kernel log लाइन देखाउँछ — अप्रत्याशित reboot पछि तुरुन्त चलाउनुहोस्।",
        jp: "確認コマンド: `dmesg | tail -50` で最後の 50 行のカーネルログを表示できます。予期しない再起動の直後に実行してください。",
      },
    },
  ],
};
