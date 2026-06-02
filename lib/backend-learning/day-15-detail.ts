import type { RoadmapDayDetail } from "../challenge-data";

export const DAY_15_DETAIL = {
  overview: [
    "Linux process management is the bedrock of every production server. Every running program is a process with a unique PID, a parent, resource limits, and a lifecycle controlled by signals. Understanding how the kernel schedules processes, how fork/exec work, and what zombie processes are is essential for debugging hangs, runaway memory, and orphaned workers.",
    "Day 15 covers the Linux process model from fork/exec to zombie reaping, the full signal table, and systemd — the init system that manages service dependencies, restarts, and logging on every major Linux distribution. You will write a real .service unit file and learn the systemctl commands needed to operate services in production.",
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
          text: "Every process is created via fork() — a clone of the parent — followed by exec() to replace the process image with a new program. The cloned child inherits the parent's file descriptors, environment, and signal handlers. PID 1 (systemd) is the ancestor of all user-space processes; it is the only process that is never forked from another user process. When a process exits, it stays in the process table as a zombie until its parent calls wait() to collect the exit status — failing to do so leaks PIDs indefinitely.",
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
          text: "Signals are asynchronous notifications sent to a process by the kernel, another process, or the user. A process can register a custom handler, ignore the signal, or let the default action apply. Two signals cannot be caught or ignored: SIGKILL (9) and SIGSTOP (19) — they are enforced directly by the kernel, bypassing the process entirely.",
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
          text: "systemd is the init system and service manager on virtually every modern Linux distribution. It replaces SysV init scripts with declarative unit files. A .service unit file has three sections: [Unit] for metadata and dependency ordering, [Service] for process configuration, and [Install] for the WantedBy target that determines when the service starts during boot. Unit files live in /etc/systemd/system/ (admin-managed) or /lib/systemd/system/ (package-managed).",
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
      answer: "SIGTERM (15) is a polite request to terminate. The process receives it and can run cleanup code — closing connections, flushing buffers, finishing in-flight requests — before calling exit(). A well-written service catches SIGTERM and shuts down gracefully within a bounded time window.\n\nSIGKILL (9) is enforced directly by the kernel. The process never receives it and cannot catch, block, or ignore it. The kernel immediately reclaims all resources. No cleanup runs. Use SIGKILL only as a last resort after SIGTERM has been sent and the grace period (TimeoutStopSec in systemd) has expired. Jumping straight to SIGKILL causes connection leaks, data corruption, and lost in-flight work.",
    },
    {
      question: "What happens to child processes when a parent dies?",
      answer: "When a parent process exits, its children become orphans. The kernel automatically re-parents them to PID 1 (systemd on modern Linux). systemd then becomes responsible for collecting their exit status when they eventually finish — preventing them from becoming zombies.\n\nThis re-parenting behaviour is why daemonisation historically involved double-forking: the intermediate parent exits immediately, making the daemon a grandchild that gets adopted by init. With systemd, this is no longer necessary — Type=forking or Type=simple handle the lifecycle correctly.",
    },
    {
      question: "How does systemd decide service restart order?",
      answer: "systemd resolves service ordering using the After= and Before= directives in [Unit]. After=postgresql.service means systemd will not start this service until postgresql.service has finished starting. This is purely ordering — it does not create a dependency. To also require the dependency to succeed, combine After= with Wants= (soft) or Requires= (hard).\n\nAt boot, systemd builds a dependency graph from all unit files and starts as many services in parallel as ordering constraints allow. The WantedBy=multi-user.target directive in [Install] hooks the service into the graph when it is enabled — systemctl enable creates a symlink from /etc/systemd/system/multi-user.target.wants/myapp.service to the unit file.",
    },
    {
      question: "What is a zombie process and how do you remove it?",
      answer: "A zombie (state Z) is a process that has finished execution but whose entry remains in the process table because its parent has not yet called wait() or waitpid() to collect its exit status. The kernel preserves the entry so the exit code is available to the parent. Zombies consume a PID and a process table slot but no CPU or memory.\n\nYou cannot kill a zombie — it is already dead. The fix is to fix the parent: send SIGCHLD to the parent process (kill -SIGCHLD <ppid>) to prompt it to call wait(). If the parent itself is buggy and never reaps children, you must kill the parent — its zombie children are then re-parented to init (systemd), which immediately reaps them. A persistent accumulation of zombies indicates a bug in the parent's signal handling.",
    },
  ],
} satisfies RoadmapDayDetail;
