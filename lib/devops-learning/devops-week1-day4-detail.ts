import type { RoadmapDayDetail } from "@/lib/challenge-data";

const L = {
  o1: {
    en: "Every command you run on Linux becomes a process — a running instance of a program with its own PID, memory space, and state. Understanding how the kernel schedules processes, how signals control them, and how systemd orchestrates long-running services is essential for diagnosing any production incident.",
    np: "Linux मा तपाईंले run गर्ने हरेक command एउटा process बन्छ — आफ्नै PID, memory space, र state सहितको एउटा चलिरहेको program को instance। Kernel ले process कसरी schedule गर्छ, signal ले कसरी control गर्छ, र systemd ले long-running service कसरी orchestrate गर्छ भनेर बुझ्नु production incident diagnose गर्न अत्यावश्यक छ।",
    jp: "Linux で実行するコマンドはすべてプロセスになります — 固有の PID・メモリ空間・状態を持つ、実行中のプログラムのインスタンスです。カーネルがプロセスをどのようにスケジュールし、シグナルがどのように制御し、systemd が長時間実行サービスをどのようにオーケストレートするかを理解することは、本番インシデントの診断に不可欠です。",
  } as const,
  o2: {
    en: "Today you learn to inspect live processes with `ps` and `top`, send signals with `kill`, manage services with `systemctl`, read logs with `journalctl`, and measure CPU/memory/disk consumption before a server falls over.",
    np: "आज तपाईंले `ps` र `top` ले live process निरीक्षण गर्न, `kill` ले signal पठाउन, `systemctl` ले service manage गर्न, `journalctl` ले log पढ्न, र server down हुनुअघि CPU/memory/disk consumption मापन गर्न सिक्नुहुनेछ।",
    jp: "本日は `ps` と `top` でライブプロセスを確認し、`kill` でシグナルを送り、`systemctl` でサービスを管理し、`journalctl` でログを読み、サーバーがダウンする前に CPU・メモリ・ディスク消費量を計測する方法を学びます。",
  } as const,
};

export const DEVOPS_DAY_4_DETAIL: RoadmapDayDetail = {
  overview: [L.o1, L.o2],
  sections: [
    {
      title: {
        en: "Processes — what is running and why",
        np: "Process — के र किन चलिरहेको छ",
        jp: "プロセス — 何が動いていて、なぜか",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Every process has a PID (process ID), a PPID (parent process ID), an owner (UID), a state (running, sleeping, zombie, stopped), and an exit code. The `init` process (PID 1, now systemd on most distros) is the ancestor of every other process — it adopts orphaned processes when their parent dies.",
            np: "हरेक process मा PID (process ID), PPID (parent process ID), owner (UID), state (running, sleeping, zombie, stopped), र exit code हुन्छ। `init` process (PID 1, अहिले अधिकांश distro मा systemd) हरेक अन्य process को ancestor हो — यसले आफ्नो parent मर्दा orphaned process adopt गर्छ।",
            jp: "すべてのプロセスは PID（プロセス ID）・PPID（親プロセス ID）・所有者（UID）・状態（実行中・スリープ・ゾンビ・停止）・終了コードを持ちます。`init` プロセス（PID 1、現在のほとんどのディストリビューションでは systemd）はすべてのプロセスの祖先で、親が死んだときに孤立したプロセスを引き取ります。",
          },
        },
        {
          type: "code",
          title: {
            en: "Viewing and inspecting processes",
            np: "Process हेर्न र निरीक्षण गर्नुहोस्",
            jp: "プロセスの表示と確認",
          },
          code: `# Snapshot of all running processes
ps aux                      # BSD-style: all users, all processes, with CPU/mem
ps -ef                      # POSIX-style: full format with PPID

# Find a specific process
ps aux | grep nginx
pgrep nginx                 # returns PID(s) only
pgrep -la nginx             # PID + command name

# Process tree (who spawned what)
pstree -p                   # with PIDs
pstree -p 1234              # subtree rooted at PID 1234

# Live view — interactive (press q to quit, k to kill, r to renice)
top
htop                        # friendlier (may need: sudo apt install htop)

# Detailed info about a specific PID
cat /proc/1234/status       # kernel-level: state, memory, threads
ls -la /proc/1234/fd        # open file descriptors`,
        },
        {
          type: "table",
          caption: {
            en: "Key process states in ps output",
            np: "ps output मा मुख्य process state",
            jp: "ps 出力の主なプロセス状態",
          },
          headers: [
            { en: "State", np: "State", jp: "状態" },
            { en: "Code", np: "Code", jp: "コード" },
            { en: "Meaning", np: "अर्थ", jp: "意味" },
          ],
          rows: [
            [
              { en: "Running / Runnable", np: "Running / Runnable", jp: "実行中 / 実行可能" },
              { en: "R", np: "R", jp: "R" },
              { en: "On the CPU or waiting in the run queue", np: "CPU मा वा run queue मा प्रतीक्षारत", jp: "CPU 上またはランキューで待機中" },
            ],
            [
              { en: "Interruptible sleep", np: "Interruptible sleep", jp: "割り込み可能スリープ" },
              { en: "S", np: "S", jp: "S" },
              { en: "Waiting for I/O, timer, or signal — most processes live here", np: "I/O, timer, वा signal को प्रतीक्षा — अधिकांश process यहाँ हुन्छ", jp: "I/O・タイマー・シグナルを待機 — ほとんどのプロセスはここにいる" },
            ],
            [
              { en: "Uninterruptible sleep", np: "Uninterruptible sleep", jp: "割り込み不可スリープ" },
              { en: "D", np: "D", jp: "D" },
              { en: "Waiting on kernel I/O (disk/NFS) — cannot be killed; high D = I/O problem", np: "Kernel I/O को प्रतीक्षा — kill गर्न सकिँदैन; high D = I/O problem", jp: "カーネル I/O 待ち — kill できない; D が高い = I/O 問題" },
            ],
            [
              { en: "Zombie", np: "Zombie", jp: "ゾンビ" },
              { en: "Z", np: "Z", jp: "Z" },
              { en: "Exited but parent hasn't called wait() yet — takes no resources beyond a PID slot", np: "Exit भयो तर parent ले wait() call गरेको छैन — PID slot बाहेक resource छैन", jp: "終了済みだが親がまだ wait() を呼んでいない — PID スロット以外のリソースは消費しない" },
            ],
            [
              { en: "Stopped", np: "Stopped", jp: "停止" },
              { en: "T", np: "T", jp: "T" },
              { en: "Suspended by SIGSTOP or Ctrl-Z", np: "SIGSTOP वा Ctrl-Z ले suspend गरिएको", jp: "SIGSTOP または Ctrl-Z で一時停止" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Signals — talking to processes",
        np: "Signal — process सँग कुरा गर्नुहोस्",
        jp: "シグナル — プロセスとの通信",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Signals are asynchronous notifications sent to a process by the kernel or another process. The process can catch and handle most signals, ignore them, or let the default action run. Two signals cannot be caught or ignored: SIGKILL (9) forcibly terminates the process immediately, and SIGSTOP (19) forcibly pauses it.",
            np: "Signal kernel वा अर्को process द्वारा process मा पठाइएका asynchronous notification हुन्। Process ले अधिकांश signal catch र handle गर्न, ignore गर्न, वा default action चल्न दिन सक्छ। दुई signal catch वा ignore गर्न सकिँदैन: SIGKILL (9) ले process तुरुन्त forcibly terminate गर्छ, र SIGSTOP (19) ले forcibly pause गर्छ।",
            jp: "シグナルはカーネルまたは別のプロセスによってプロセスに送られる非同期通知です。プロセスはほとんどのシグナルをキャッチして処理したり、無視したり、デフォルトの動作を実行させたりできます。キャッチも無視もできない 2 つのシグナルがあります: SIGKILL（9）はプロセスを即座に強制終了し、SIGSTOP（19）は強制的に一時停止します。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Signals you will use every day",
            np: "तपाईंले प्रतिदिन प्रयोग गर्ने signal",
            jp: "毎日使うシグナル",
          },
          headers: [
            { en: "Signal", np: "Signal", jp: "シグナル" },
            { en: "Number", np: "Number", jp: "番号" },
            { en: "Default action", np: "Default action", jp: "デフォルト動作" },
            { en: "DevOps use case", np: "DevOps use case", jp: "DevOps のユースケース" },
          ],
          rows: [
            [
              { en: "SIGHUP", np: "SIGHUP", jp: "SIGHUP" },
              { en: "1", np: "1", jp: "1" },
              { en: "Terminate (or reload if caught)", np: "Terminate (catch भए reload)", jp: "終了（キャッチすれば再読み込み）" },
              { en: "Reload nginx/apache config without restart (`kill -HUP <pid>`)", np: "Restart बिना nginx/apache config reload गर्नुहोस्", jp: "再起動なしで nginx/apache 設定を再読み込み" },
            ],
            [
              { en: "SIGINT", np: "SIGINT", jp: "SIGINT" },
              { en: "2", np: "2", jp: "2" },
              { en: "Terminate gracefully", np: "Gracefully terminate", jp: "正常終了" },
              { en: "Ctrl-C in the terminal — the process can clean up before exiting", np: "Terminal मा Ctrl-C — process exit अघि cleanup गर्न सक्छ", jp: "ターミナルの Ctrl-C — プロセスは終了前にクリーンアップできる" },
            ],
            [
              { en: "SIGTERM", np: "SIGTERM", jp: "SIGTERM" },
              { en: "15", np: "15", jp: "15" },
              { en: "Terminate gracefully", np: "Gracefully terminate", jp: "正常終了" },
              { en: "Default signal from `kill` — always try this before SIGKILL", np: "`kill` को default signal — SIGKILL अघि सधैं यो try गर्नुहोस्", jp: "`kill` のデフォルトシグナル — SIGKILL の前に必ずこれを試す" },
            ],
            [
              { en: "SIGKILL", np: "SIGKILL", jp: "SIGKILL" },
              { en: "9", np: "9", jp: "9" },
              { en: "Immediate forced termination (uncatchable)", np: "तत्काल forced termination (catch गर्न नसकिने)", jp: "即座の強制終了（キャッチ不可）" },
              { en: "Last resort for frozen or misbehaving processes — data loss risk", np: "Frozen वा misbehaving process को अन्तिम उपाय — data loss risk", jp: "フリーズした/誤動作するプロセスの最終手段 — データ損失のリスク" },
            ],
            [
              { en: "SIGSTOP / SIGCONT", np: "SIGSTOP / SIGCONT", jp: "SIGSTOP / SIGCONT" },
              { en: "19 / 18", np: "19 / 18", jp: "19 / 18" },
              { en: "Pause / Resume (uncatchable)", np: "Pause / Resume (catch गर्न नसकिने)", jp: "一時停止 / 再開（キャッチ不可）" },
              { en: "Pause a runaway process for inspection without killing it", np: "Kill नगरी inspection का लागि runaway process pause गर्नुहोस्", jp: "kill せずに暴走プロセスを調査のために一時停止する" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Sending signals and managing jobs",
            np: "Signal पठाउनुहोस् र job manage गर्नुहोस्",
            jp: "シグナルの送信とジョブ管理",
          },
          code: `# kill sends a signal to a PID (default: SIGTERM)
kill 1234                   # SIGTERM (graceful stop)
kill -9 1234                # SIGKILL (force stop)
kill -HUP 1234              # SIGHUP  (reload config)
kill -TERM $(pgrep nginx)   # SIGTERM to all nginx processes

# killall / pkill — target by name
killall nginx               # SIGTERM to all processes named 'nginx'
pkill -9 -f "python worker" # SIGKILL any process with 'python worker' in its cmdline

# Job control (in an interactive shell)
sleep 300 &                 # start in background, get a job number [1]
jobs                        # list background jobs
fg %1                       # bring job 1 to foreground
Ctrl-Z                      # suspend the foreground job → moves it to background (stopped)
bg %1                       # resume the stopped job in the background

# Process priority (nice value: -20 highest → +19 lowest)
nice -n 10 python train.py  # start with lower priority
renice -n 5 -p 1234         # change priority of running process`,
        },
      ],
    },
    {
      title: {
        en: "systemd — managing services",
        np: "systemd — service manage गर्नुहोस्",
        jp: "systemd — サービス管理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "systemd is PID 1 on virtually every modern Linux server. It starts and supervises services (called units), handles dependencies between them, and collects their logs into the journal. For a DevOps engineer, `systemctl` and `journalctl` are the two most important commands to master.",
            np: "systemd लगभग हरेक आधुनिक Linux server मा PID 1 हो। यसले service (unit भनिन्छ) start र supervise गर्छ, तिनीहरू बीचको dependency handle गर्छ, र journal मा log collect गर्छ। DevOps engineer का लागि, `systemctl` र `journalctl` master गर्नु सबभन्दा महत्त्वपूर्ण दुई command हुन्।",
            jp: "systemd は事実上すべての現代の Linux サーバーで PID 1 です。サービス（ユニットと呼ばれる）を起動・監視し、それらの依存関係を処理し、ログをジャーナルに収集します。DevOps エンジニアにとって、`systemctl` と `journalctl` はマスターすべき最も重要な 2 つのコマンドです。",
          },
        },
        {
          type: "code",
          title: {
            en: "systemctl — the systemd control command",
            np: "systemctl — systemd control command",
            jp: "systemctl — systemd 制御コマンド",
          },
          code: `# Service lifecycle
sudo systemctl start nginx      # start now
sudo systemctl stop nginx       # stop now
sudo systemctl restart nginx    # stop + start (brief downtime)
sudo systemctl reload nginx     # reload config, no downtime (if supported)
sudo systemctl status nginx     # show state, last log lines, PID

# Enable / disable at boot
sudo systemctl enable nginx     # create symlink → auto-start on boot
sudo systemctl disable nginx    # remove symlink → don't auto-start
sudo systemctl enable --now nginx  # enable AND start immediately

# Inspect units
systemctl list-units --type=service --state=running   # all running services
systemctl list-unit-files --type=service              # all installed services + enabled state
systemctl cat nginx                                   # show unit file contents
systemctl show nginx --property=MainPID,ExecStart     # query specific properties

# Failed services
systemctl --failed                    # list failed units
sudo systemctl reset-failed nginx     # clear the failed state after fixing`,
        },
        {
          type: "code",
          title: {
            en: "journalctl — reading systemd logs",
            np: "journalctl — systemd log पढ्नुहोस्",
            jp: "journalctl — systemd ログを読む",
          },
          code: `# Basic log reading
journalctl -u nginx                    # all logs for nginx unit
journalctl -u nginx -n 50             # last 50 lines
journalctl -u nginx -f                # follow (like tail -f)
journalctl -u nginx --since "1 hour ago"
journalctl -u nginx --since "2024-01-15 08:00" --until "2024-01-15 09:00"

# Filter by priority (emerg alert crit err warning notice info debug)
journalctl -u nginx -p err            # errors and above
journalctl -p crit..err               # range of priorities

# System-wide
journalctl -b                         # this boot
journalctl -b -1                      # previous boot (useful after crash)
journalctl --disk-usage               # how much space the journal uses
sudo journalctl --vacuum-size=500M    # trim journal to 500 MB`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Writing your own unit file — create `/etc/systemd/system/myapp.service`, run `sudo systemctl daemon-reload`, then `systemctl enable --now myapp`. This is how any long-running process becomes a managed service with auto-restart.",
              np: "आफ्नै unit file लेख्नुहोस् — `/etc/systemd/system/myapp.service` create गर्नुहोस्, `sudo systemctl daemon-reload` run गर्नुहोस्, त्यसपछि `systemctl enable --now myapp`। यसरी कुनै पनि long-running process auto-restart सहितको managed service बन्छ।",
              jp: "独自のユニットファイルを書く — `/etc/systemd/system/myapp.service` を作成し、`sudo systemctl daemon-reload` を実行してから `systemctl enable --now myapp` を実行します。これにより、あらゆる長時間実行プロセスが自動再起動付きの管理対象サービスになります。",
            },
            {
              en: "`Restart=on-failure` and `RestartSec=5s` in the `[Service]` section make systemd automatically restart your service if it crashes — the equivalent of a process supervisor without extra tooling.",
              np: "`[Service]` section मा `Restart=on-failure` र `RestartSec=5s` ले systemd लाई crash हुँदा service automatically restart गराउँछ — extra tooling बिना process supervisor को बराबर।",
              jp: "`[Service]` セクションの `Restart=on-failure` と `RestartSec=5s` により、クラッシュ時に systemd がサービスを自動的に再起動します — 追加ツールなしのプロセススーパーバイザーに相当します。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "System resources — CPU, memory, and disk",
        np: "System resource — CPU, memory, र disk",
        jp: "システムリソース — CPU・メモリ・ディスク",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Before a server runs out of CPU, RAM, or disk, it will show warning signs. Knowing how to read these metrics in real time — and which tools to use — is the difference between preventing an outage and reacting to one.",
            np: "Server को CPU, RAM, वा disk सकिनुअघि warning sign देखा पर्छ। यी metric real time मा कसरी पढ्ने — र कुन tool प्रयोग गर्ने — थाहा हुनु outage रोक्नु र प्रतिक्रिया गर्नुको बीचको फरक हो।",
            jp: "サーバーの CPU・RAM・ディスクが枯渇する前に、警告の兆候が現れます。これらのメトリクスをリアルタイムで読む方法とどのツールを使うかを知ることが、障害を防ぐことと障害に対応することの違いです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Resource monitoring commands",
            np: "Resource monitoring command",
            jp: "リソース監視コマンド",
          },
          code: `# CPU and load average
uptime                      # load averages: 1m 5m 15m — rule: > num_cpus = overloaded
nproc                       # number of logical CPUs
vmstat 2 5                  # CPU/memory/io stats every 2s, 5 times
mpstat -P ALL 1             # per-CPU breakdown (needs: sudo apt install sysstat)

# Memory
free -h                     # total, used, free, shared, buff/cache, available
                            # 'available' is what new processes can actually use
cat /proc/meminfo           # detailed kernel memory breakdown

# Disk space and usage
df -h                       # disk free — all mounted filesystems
df -h /var/log              # just that filesystem
du -sh /var/log/*           # disk usage per subdirectory (sorted)
du -sh * | sort -rh | head -10  # top 10 largest items in current dir
ncdu /var/log               # interactive ncurses du (apt install ncdu)

# I/O — is the disk a bottleneck?
iostat -xz 1                # extended disk stats every 1s (sysstat package)
iotop                       # who is doing the most I/O right now (like top for disk)
lsof +D /var/log            # which processes have files open in /var/log

# Open file descriptors (important for servers under high connection load)
ulimit -n                   # current per-process fd limit
cat /proc/sys/fs/file-max   # system-wide fd limit
lsof | wc -l                # total open fds (rough count)`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "Load average rule of thumb: a load average above the number of CPUs means the system is overloaded. `nproc` shows CPU count; `uptime` shows load. `4.0` on a 4-core machine = 100% utilized; `8.0` on a 4-core machine = 200% — processes are queuing.",
              np: "Load average rule of thumb: CPU संख्या भन्दा माथि load average भनेको system overloaded छ। `nproc` ले CPU count, `uptime` ले load देखाउँछ। 4-core machine मा `4.0` = 100% utilized; 4-core machine मा `8.0` = 200% — process queuing मा छन्।",
              jp: "負荷平均の目安: 負荷平均が CPU 数を超えるとシステムが過負荷です。`nproc` で CPU 数、`uptime` で負荷を確認します。4 コアマシンの `4.0` = 100% 使用中、4 コアマシンの `8.0` = 200% — プロセスがキューで待機中です。",
            },
            {
              en: "'available' vs 'free' memory — Linux uses spare RAM as disk cache. `free` shows this as 'buff/cache'. The column you care about is 'available' — it includes reclaimable cache. A server with nearly zero 'free' but large 'available' is fine.",
              np: "'available' vs 'free' memory — Linux ले spare RAM disk cache को रूपमा प्रयोग गर्छ। `free` ले यो 'buff/cache' को रूपमा देखाउँछ। तपाईंले ध्यान दिने column 'available' हो — यसमा reclaimable cache समावेश छ।",
              jp: "「available」対「free」メモリ — Linux は空き RAM をディスクキャッシュとして使います。`free` はこれを 'buff/cache' として表示します。注目すべき列は 'available' で、回収可能なキャッシュを含みます。'free' がほぼゼロでも 'available' が大きければ問題ありません。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Hands-on: Diagnose a resource-hungry process",
        np: "Hands-on: Resource-hungry process diagnose गर्नुहोस्",
        jp: "ハンズオン: リソースを食いつぶすプロセスを診断する",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Simulate and investigate a CPU hog",
            np: "CPU hog simulate र investigate गर्नुहोस्",
            jp: "CPU を食いつぶすプロセスをシミュレートして調査する",
          },
          code: `# 1. Spawn a CPU hog in the background
yes > /dev/null &           # burns 100% of one CPU core
HOG_PID=$!
echo "Hog PID: $HOG_PID"

# 2. Observe it at the top of the process list
ps aux --sort=-%cpu | head -5
top -b -n 1 | head -20      # non-interactive snapshot

# 3. See which user and command is responsible
ps -p $HOG_PID -o pid,user,%cpu,%mem,cmd

# 4. Lower its priority so it doesn't crowd out real work
renice -n 19 -p $HOG_PID

# 5. Verify the renice took effect
ps -p $HOG_PID -o pid,ni,%cpu

# 6. Stop it gracefully, then verify it's gone
kill $HOG_PID
sleep 1
ps -p $HOG_PID 2>/dev/null || echo "Process is gone"

# Bonus: write a minimal systemd service unit
cat > /tmp/myapp.service << 'EOF'
[Unit]
Description=My Demo App
After=network.target

[Service]
Type=simple
User=nobody
ExecStart=/usr/bin/sleep infinity
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
EOF
sudo cp /tmp/myapp.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl start myapp
systemctl status myapp
sudo systemctl stop myapp`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is a zombie process and should I worry about it?",
        np: "Zombie process के हो र मैले चिन्ता गर्नुपर्छ?",
        jp: "ゾンビプロセスとは何か、心配すべきか？",
      },
      answer: {
        en: "A zombie is a process that has exited but whose parent hasn't called `wait()` to collect its exit status. It holds no memory or CPU — only a PID slot. A few zombies are harmless. Thousands of zombies fill the PID table and can prevent new processes from starting. The fix is not killing the zombie (you can't — it's already dead), but fixing or restarting its parent so it calls `wait()`.",
        np: "Zombie एउटा process हो जो exit भइसकेको छ तर जसको parent ले exit status collect गर्न `wait()` call गरेको छैन। यसले memory वा CPU लिँदैन — केवल PID slot। केही zombie harmless छन्। हजारौं zombie ले PID table भर्छन् र नयाँ process start हुन रोक्न सक्छन्। Fix zombie kill गर्नु होइन (सकिँदैन — पहिले नै मरिसकेको छ), तर parent fix वा restart गर्नु हो।",
        jp: "ゾンビとは終了したが、親が終了ステータスを収集するために `wait()` を呼んでいないプロセスです。メモリや CPU は消費しません — PID スロットのみ。少数のゾンビは無害です。数千のゾンビは PID テーブルを埋め、新しいプロセスの起動を妨げる可能性があります。修正方法はゾンビを kill することではなく（できません — すでに死んでいます）、親を修正または再起動して `wait()` を呼ばせることです。",
      },
      tag: { en: "processes", np: "प्रक्रियाहरू", jp: "プロセス" },
    },
    {
      question: {
        en: "Why should I use SIGTERM before SIGKILL?",
        np: "SIGKILL अघि SIGTERM किन प्रयोग गर्नुपर्छ?",
        jp: "SIGKILL の前に SIGTERM を使うべき理由は？",
      },
      answer: {
        en: "SIGTERM gives the process a chance to shut down cleanly: flush database writes, close network connections, release locks, write a final log entry, finish serving in-flight requests. SIGKILL bypasses all of this — the kernel stops the process instantly, which can corrupt databases, leave incomplete files, and cause clients to get connection-reset errors. Always `kill <pid>` (SIGTERM) first, wait 5–10 seconds, then `kill -9 <pid>` only if it's still running.",
        np: "SIGTERM ले process लाई clean shutdown गर्ने मौका दिन्छ: database write flush गर्न, network connection बन्द गर्न, lock release गर्न, final log entry लेख्न, in-flight request serve सक्छ। SIGKILL ले यो सब bypass गर्छ — kernel ले process तुरुन्त रोक्छ, जसले database corrupt गर्न, incomplete file छोड्न, र client लाई connection-reset error दिन सक्छ।",
        jp: "SIGTERM はプロセスにクリーンシャットダウンの機会を与えます：データベース書き込みのフラッシュ、ネットワーク接続のクローズ、ロックの解放、最終ログエントリの書き込み、処理中のリクエストの完了。SIGKILL はこれらすべてをバイパスします — カーネルがプロセスを即座に停止し、データベースを破損させたり、不完全なファイルを残したり、クライアントに接続リセットエラーを発生させたりする可能性があります。",
      },
      tag: { en: "processes", np: "प्रक्रियाहरू", jp: "プロセス" },
    },
    {
      question: {
        en: "What is the difference between `systemctl restart` and `systemctl reload`?",
        np: "`systemctl restart` र `systemctl reload` बीच के फरक छ?",
        jp: "`systemctl restart` と `systemctl reload` の違いは？",
      },
      answer: {
        en: "`restart` stops the service (SIGTERM → wait → SIGKILL) and starts a fresh process. There is a brief window where the service is unavailable. `reload` sends SIGHUP (or a service-specific reload signal) to the existing process, which re-reads its config file without stopping. `reload` has zero downtime but only works if the service supports it (nginx and apache do; most simpler daemons do not). Check the unit file's `ExecReload=` to see what reload does.",
        np: "`restart` ले service stop गर्छ (SIGTERM → wait → SIGKILL) र fresh process start गर्छ। Service unavailable हुने brief window हुन्छ। `reload` ले existing process लाई SIGHUP (वा service-specific reload signal) पठाउँछ, जसले stop नगरी config file re-read गर्छ। `reload` को zero downtime छ तर service ले support गरे मात्र काम गर्छ (nginx र apache गर्छन्; अधिकांश simple daemon गर्दैनन्)।",
        jp: "`restart` はサービスを停止（SIGTERM → 待機 → SIGKILL）して新しいプロセスを起動します。サービスが利用できない短い時間があります。`reload` は既存のプロセスに SIGHUP（またはサービス固有の再読み込みシグナル）を送り、停止せずに設定ファイルを再読み込みします。`reload` はダウンタイムがゼロですが、サービスがサポートしている場合にのみ機能します（nginx と Apache はサポートしていますが、ほとんどのシンプルなデーモンはサポートしていません）。",
      },
      tag: { en: "systemd", np: "systemd", jp: "systemd" },
    },
    {
      question: {
        en: "What does a high load average actually mean?",
        np: "High load average को वास्तविक अर्थ के हो?",
        jp: "高い負荷平均は実際に何を意味するか？",
      },
      answer: {
        en: "Load average counts the number of processes that are either running on a CPU or waiting to run (in the run queue) at any moment, averaged over 1, 5, and 15 minutes. A load of 1.0 on a single-core system means 100% utilized; 2.0 means 100% utilized with one process always waiting. On a 4-core system, 4.0 is 100% utilization. High 1-minute load with low 15-minute load means a sudden spike; high 15-minute load means a sustained problem.",
        np: "Load average ले एक moment मा CPU मा running वा run गर्न प्रतीक्षारत (run queue मा) process को संख्या count गर्छ, 1, 5, र 15 minute मा average। Single-core system मा 1.0 load = 100% utilized; 2.0 = 100% utilized र एउटा process सधैं प्रतीक्षारत। 4-core system मा 4.0 = 100% utilization।",
        jp: "負荷平均は、いかなる瞬間においても CPU で実行中またはランキューで待機しているプロセスの数を 1・5・15 分間で平均したものです。シングルコアシステムの負荷 1.0 は 100% 使用中、2.0 は 100% 使用中でさらに 1 プロセスが常に待機中を意味します。4 コアシステムでは 4.0 が 100% 使用率です。1 分間の負荷が高く 15 分間の負荷が低い場合は突然のスパイク、15 分間の負荷が高い場合は持続的な問題を意味します。",
      },
      tag: { en: "resources", np: "स्रोत", jp: "リソース" },
    },
  ],
};
