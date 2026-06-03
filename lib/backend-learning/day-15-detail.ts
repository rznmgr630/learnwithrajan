import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_15_DETAIL = {
  overview: [
    "Every program running on a Linux server is a process. Each one has a unique ID, a parent process, and a lifecycle controlled by signals. Knowing how processes start, stop, and interact is essential for debugging hangs, runaway memory usage, and orphaned workers.",
    "Today you will learn how processes are created and destroyed, what signals are and when to use each one, and how to use systemd to manage services in production — including writing your own .service unit file and using the essential systemctl commands.",
  ],
  sections: [
    {
      title: "Watch",
      blocks: [
        { type: "youtube", videoId: "KHzD0c2Up7k", title: "Linux Processes, Services & systemd Explained for DevOps Engineers" },
      ],
    },
    {
      title: "Linux process model",
      blocks: [
        {
          type: "diagram",
          id: "devops-linux-hierarchy",
        },
        {
          type: "paragraph",
          text: "Every process starts by being cloned from its parent (fork), then replaced with a new program (exec). The child inherits file descriptors and environment variables from the parent. PID 1 (systemd) is the root of all user-space processes. When a process finishes, it stays in the process table as a zombie until the parent collects its exit code by calling wait(). If the parent never does this, zombie entries accumulate and eventually use up all available PIDs.",
        },
        {
          type: "table",
          headers: ["State", "Code", "Meaning", "Common cause"],
          rows: [
            [
              "Running",
              "R",
              "Actively executing on a CPU or in the run queue waiting for a CPU",
              "CPU-bound work, tight loops, or high concurrency",
            ],
            [
              "Interruptible sleep",
              "S",
              "Waiting for an event (I/O, timer, signal) — can be interrupted by a signal",
              "Waiting on network, disk, or a mutex; the normal idle state",
            ],
            [
              "Uninterruptible sleep",
              "D",
              "Waiting on I/O that cannot be interrupted — even SIGKILL is ignored",
              "NFS hang, disk I/O stall; alarming if persistent — indicates kernel or hardware issue",
            ],
            [
              "Zombie",
              "Z",
              "Process has exited but parent has not called wait(); entry kept in process table",
              "Parent process bug — not calling waitpid(); accumulation leaks PIDs",
            ],
            [
              "Stopped",
              "T",
              "Execution paused — waiting for SIGCONT to resume",
              "Ctrl+Z in a terminal, or a debugger attaching via SIGSTOP",
            ],
          ],
        },
        {
          type: "code",
          title: "Inspecting process tree and state",
          code: `# Show full process tree with PIDs and states
ps auxf

# Show a specific process and its children
pstree -p <pid>

# Find zombie processes (state Z)
ps aux | awk '$8 == "Z" { print $2, $11 }'

# Show PID, PPID, state, and command for all processes
ps -eo pid,ppid,stat,comm --sort=stat

# Find the parent of a zombie and inspect it
ps -o pid,ppid,stat,comm -p <zombie_pid>
# Then look at the parent: if parent is buggy, send SIGCHLD to reap zombies
kill -SIGCHLD <parent_pid>`,
        },
      ],
    },
    {
      title: "Signals",
      blocks: [
        {
          type: "paragraph",
          text: "Signals are messages the kernel or another process can send to a running process. The receiving process can handle a signal with custom code, ignore it, or let the default action happen. Two signals are special — SIGKILL (9) and SIGSTOP (19) — the process cannot intercept or ignore them. The kernel enforces them directly.",
        },
        {
          type: "table",
          headers: ["Number", "Name", "Default action", "When to use"],
          rows: [
            ["1", "SIGHUP", "Terminate (or reload if handled)", "Reload config without restarting — many daemons catch SIGHUP to re-read config files"],
            ["2", "SIGINT", "Terminate", "Ctrl+C in terminal — polite interrupt; most apps handle it for clean shutdown"],
            ["9", "SIGKILL", "Terminate immediately (uncatchable)", "Last resort — process cannot clean up; use only when SIGTERM fails after a timeout"],
            ["15", "SIGTERM", "Terminate", "Standard graceful shutdown signal — process can catch, finish in-flight work, then exit"],
            ["17", "SIGCHLD", "Ignore (but parent can catch)", "Sent to parent when a child exits or stops — parent should call waitpid() in the handler"],
            ["19", "SIGSTOP", "Pause (uncatchable)", "Pause a process unconditionally — kernel-enforced, cannot be caught or ignored"],
            ["18", "SIGCONT", "Resume", "Resume a stopped process — used after SIGSTOP or Ctrl+Z (SIGTSTP)"],
          ],
        },
        {
          type: "code",
          title: "Using kill, pkill, and killall",
          code: `# Send SIGTERM (15) to a specific PID — graceful shutdown
kill <pid>

# Send SIGKILL (9) — immediate termination
kill -9 <pid>
# or equivalently:
kill -SIGKILL <pid>

# Send SIGTERM to all processes named "node"
pkill node

# Send SIGKILL to processes matching a pattern
pkill -9 -f "worker.js"

# Send SIGHUP to reload nginx config without downtime
kill -HUP $(cat /var/run/nginx.pid)

# List all available signals
kill -l

# Check what signals a process is catching/ignoring (Linux)
# SigCgt and SigIgn are bitmasks — decode with: printf "%d\\n" 0x<hex>
cat /proc/<pid>/status | grep -E "Sig(Cgt|Ign|Blk)"`,
        },
      ],
    },
    {
      title: "systemd unit files",
      blocks: [
        {
          type: "paragraph",
          text: "systemd is the standard service manager on almost every modern Linux distribution. Instead of shell scripts, you write declarative unit files that describe how a service should run. A .service file has three sections: [Unit] for metadata and dependencies, [Service] for how to run the process, and [Install] for when it should start at boot. Unit files live in /etc/systemd/system/ (admin-managed) or /lib/systemd/system/ (package-managed).",
        },
        {
          type: "code",
          title: "Production .service file for a Node.js app",
          code: `# /etc/systemd/system/myapp.service

[Unit]
Description=My Node.js API Server
Documentation=https://github.com/myorg/myapp
# Start only after the network is fully up and PostgreSQL is running
After=network.target postgresql.service
Wants=postgresql.service

[Service]
Type=simple
# Run as a dedicated non-root user for security
User=nodeapp
Group=nodeapp
WorkingDirectory=/opt/myapp

# Inject secrets from environment files — never hardcode credentials
EnvironmentFile=/etc/myapp/env

ExecStart=/usr/bin/node /opt/myapp/dist/server.js

# Graceful shutdown: send SIGTERM, wait up to 30s, then SIGKILL
KillMode=mixed
TimeoutStopSec=30

# Restart policy: restart on crash, but not on clean exit (exit 0)
Restart=on-failure
RestartSec=5s
# Limit restart bursts to avoid log flooding on persistent failures
StartLimitIntervalSec=60s
StartLimitBurst=5

# Security hardening
NoNewPrivileges=true
PrivateTmp=true
ProtectSystem=full

# Resource limits
LimitNOFILE=65536

# Redirect stdout/stderr to journald (journalctl -u myapp -f to follow)
StandardOutput=journal
StandardError=journal
SyslogIdentifier=myapp

[Install]
# Start when the system reaches multi-user.target (default boot target)
WantedBy=multi-user.target`,
        },
        {
          type: "table",
          headers: ["Directive", "Section", "Purpose"],
          rows: [
            ["ExecStart", "[Service]", "The command to run. Must be an absolute path. Only one ExecStart per simple service."],
            ["ExecStartPre", "[Service]", "Commands to run before ExecStart — e.g., database migration, config validation."],
            ["ExecStop", "[Service]", "Custom stop command. If omitted, systemd sends KillSignal (default SIGTERM)."],
            ["Restart", "[Service]", "When to restart: no | always | on-failure | on-abnormal | on-abort. Use on-failure for production."],
            ["RestartSec", "[Service]", "Delay between restart attempts. Prevents tight restart loops hammering a broken dependency."],
            ["After", "[Unit]", "Ordering: this unit starts after the listed units. Does not create a dependency — use Wants/Requires for that."],
            ["Wants", "[Unit]", "Soft dependency: listed units are started alongside this one, but failure does not prevent this unit starting."],
            ["Requires", "[Unit]", "Hard dependency: if the listed unit fails to start, this unit will not start either."],
            ["WantedBy", "[Install]", "Reverse dependency written into the target. multi-user.target = normal multi-user boot."],
            ["EnvironmentFile", "[Service]", "Load KEY=VALUE pairs from a file. Prefix with - to ignore missing files (e.g., EnvironmentFile=-/etc/myapp/env)."],
            ["User / Group", "[Service]", "Drop privileges to this user/group before exec. Always run services as a non-root dedicated user."],
          ],
        },
      ],
    },
    {
      title: "Essential systemctl and process commands",
      blocks: [
        {
          type: "table",
          headers: ["Command", "What it does"],
          rows: [
            ["systemctl start myapp", "Start the myapp service immediately (does not affect boot behaviour)"],
            ["systemctl stop myapp", "Send KillSignal (default SIGTERM) to the service; wait TimeoutStopSec then SIGKILL"],
            ["systemctl restart myapp", "Stop then start — full restart; in-flight requests are dropped"],
            ["systemctl reload myapp", "Send reload signal (SIGHUP by default) — reloads config without restarting; only works if the service handles it"],
            ["systemctl status myapp", "Show service state, last 10 log lines, PID, memory, and CPU usage"],
            ["systemctl enable myapp", "Create symlinks in the target directory so the service starts on boot"],
            ["systemctl disable myapp", "Remove boot symlinks — service won't start on boot (does not stop it now)"],
            ["systemctl daemon-reload", "Required after editing any unit file — reloads all unit definitions into systemd"],
            ["journalctl -u myapp -f", "Follow live logs for myapp from journald (like tail -f but structured)"],
            ["journalctl -u myapp --since '1 hour ago'", "Show logs for myapp from the last hour"],
            ["ps aux", "Show all processes: user, PID, CPU%, MEM%, state, command — snapshot of the full process table"],
            ["ps aux --sort=-%mem | head -10", "Top 10 processes by memory consumption"],
            ["pgrep -l node", "List PIDs and names of all processes matching 'node'"],
            ["pgrep -a -f 'worker.js'", "Find all processes whose full command line contains 'worker.js'"],
            ["kill -15 <pid>", "Send SIGTERM to a specific PID — graceful shutdown"],
            ["kill -9 <pid>", "Send SIGKILL — immediate termination, no cleanup"],
            ["top / htop", "Interactive real-time view of CPU, memory, process states — press k to kill, r to renice"],
            ["lsof -p <pid>", "List all file descriptors held open by a process — useful for debugging file handle leaks"],
            ["strace -p <pid>", "Trace system calls made by a running process — diagnose hangs and unexpected I/O"],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: "What is the difference between SIGTERM and SIGKILL?",
      answer: "SIGTERM (15) is a polite request to stop. The process receives it and can run cleanup — closing connections, flushing data, finishing in-flight requests — before exiting. A well-written service catches SIGTERM and shuts down cleanly within a set time limit.\n\nSIGKILL (9) is enforced by the kernel, not the process. The process never receives it and gets no chance to clean up. The kernel immediately reclaims all resources. Only use SIGKILL after SIGTERM has been sent and the grace period has run out. Jumping straight to SIGKILL causes connection leaks, data corruption, and lost in-progress work.",
    },
    {
      question: "What happens to child processes when a parent dies?",
      answer: "When a parent process exits, its children become orphans. The kernel automatically reassigns them to PID 1 (systemd), which then takes responsibility for collecting their exit status — preventing them from becoming zombies.\n\nThis is why daemons historically used a double-fork: the intermediate parent exits immediately, making the daemon a grandchild that gets adopted by init. With systemd, you no longer need to do this — Type=forking or Type=simple handle the lifecycle correctly.",
    },
    {
      question: "How does systemd decide service restart order?",
      answer: "systemd uses After= and Before= in [Unit] to control startup order. After=postgresql.service means systemd will not start your service until PostgreSQL has started. This is ordering only — it does not create a hard dependency. To also require the dependency to succeed, combine After= with Wants= (soft — failure is tolerated) or Requires= (hard — failure stops your service too).\n\nAt boot, systemd builds a dependency graph from all unit files and starts as many services in parallel as the ordering constraints allow. The WantedBy=multi-user.target directive in [Install] hooks the service into the graph when enabled — systemctl enable creates a symlink from the target's wants directory to your unit file.",
    },
    {
      question: "What is a zombie process and how do you remove it?",
      answer: "A zombie (state Z) is a process that has finished but whose entry stays in the process table because the parent has not called wait() to collect its exit code. Zombies consume a PID and a process table slot but no CPU or memory.\n\nYou cannot kill a zombie — it is already dead. The fix is in the parent: send SIGCHLD to prompt it to call wait(). If the parent is buggy and never reaps its children, kill the parent — its zombies will be re-adopted by init (systemd), which reaps them immediately. A steady accumulation of zombies means there is a bug in the parent's signal handling.",
    },
  ],
} satisfies RoadmapDayDetail;
