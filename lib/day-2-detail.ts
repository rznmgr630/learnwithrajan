import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_2_DETAIL = {
  overview: [
    "Node.js handles thousands of concurrent connections on a single JavaScript thread — not because it is fast, but because most server work is waiting. `V8` runs your code; `libuv` hands I/O off to the OS and wakes the thread only when data is ready.",
    "By the end of Day 2 you should: predict `nextTick` / `Promise` / `setTimeout` order from memory, explain why CPU work on the main thread is dangerous, and contrast Node’s event loop with Go goroutines in two sentences.",
  ],
  sections: [
    {
      title: "The big picture: one thread, many waiting connections",
      blocks: [
        { type: "diagram", id: "node-one-thread-io" },
        {
          type: "paragraph",
          text: "While a DB query or file read is in flight, `libuv` registers the file descriptor with the OS (`epoll` / `kqueue` / `IOCP`). The JS thread is free. When the OS signals data ready, `libuv` queues the callback and the loop picks it up. 10,000 open connections = 10,000 registered fds — not 10,000 threads.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Concurrency here is cooperative callback scheduling, not CPU parallelism — one callback runs to completion before the next starts.",
            "The danger: any synchronous CPU work (big `JSON.parse`, crypto, encoding) blocks the entire process for every client until it finishes.",
          ],
        },
      ],
    },
    {
      title: "Event loop and libuv phases (simplified)",
      blocks: [
        { type: "diagram", id: "node-event-loop-phases" },
        {
          type: "paragraph",
          text: "Each tick: Timers → Pending I/O → Idle/Prepare → Poll → Check (`setImmediate`) → Close. Between every phase transition the microtask queues drain fully (`nextTick` first, then `Promise`). The Poll phase is where Node blocks waiting for I/O when there is nothing else to do.",
        },
        { type: "diagram", id: "node-execution-priority" },
      ],
    },
    {
      title: "Execution order (the interview gotcha)",
      blocks: [
        {
          type: "paragraph",
          text: "Priority order: synchronous call stack → `process.nextTick` queue (fully drained) → `Promise` microtasks (fully drained) → macrotasks (`setTimeout`, I/O, `setImmediate`). Mixing these up in an interview is a red flag at the senior level.",
        },
        {
          type: "code",
          title: "Run in Node — output order: 1 → 4 → 2 → 3 → 5",
          code: [
            "console.log('1 — sync (first line)');",
            "",
            "setTimeout(() => console.log('5 — macrotask (timer)'), 0);",
            "",
            "Promise.resolve().then(() => console.log('3 — microtask (promise)'));",
            "",
            "process.nextTick(() => console.log('2 — microtask (nextTick)'));",
            "",
            "console.log('4 — still sync (second line)');",
          ].join("\n"),
        },
        {
          type: "paragraph",
          text: "Recursive `process.nextTick` starves the loop permanently — timers and I/O never fire. Use `setImmediate` if you need recursive scheduling; it yields to the loop between iterations.",
        },
        {
          type: "list",
          variant: "number",
          items: [
            "Try `setImmediate` vs `setTimeout(0)` in Node: ordering has edge cases; read the docs and measure.",
          ],
        },
      ],
    },
    {
      title: "Raw TCP in Node (before `http.createServer`)",
      blocks: [
        {
          type: "paragraph",
          text: "HTTP is TCP plus a text framing protocol. `net.createServer` exposes the raw socket layer — one `socket` per accepted connection, the same building block `http.createServer` wraps. Seeing it at the TCP level makes the async model concrete.",
        },
        {
          type: "code",
          title: "`net.createServer` (CommonJS)",
          code: [
            "const net = require('net');",
            "",
            "const server = net.createServer((socket) => {",
            "  console.log(`Client: ${socket.remoteAddress}:${socket.remotePort}`);",
            "",
            "  socket.on('data', (data) => {",
            "    console.log(`Received: ${data.toString().trim()}`);",
            "    socket.write(`Echo: ${data}`);",
            "  });",
            "",
            "  socket.on('end', () => console.log('Client disconnected'));",
            "  socket.on('error', (err) => console.error(err.message));",
            "});",
            "",
            "server.listen(8080, '127.0.0.1', () => {",
            "  console.log('TCP on 127.0.0.1:8080');",
            "});",
            "",
            "// Test:  nc 127.0.0.1 8080",
            "// Two terminals: both connections work without a thread per client.",
          ].join("\n"),
        },
        {
          type: "paragraph",
          text: "Each `socket` is a duplex stream; `libuv` registers its fd with the OS. The JS thread never blocks waiting for bytes — it is woken only when data arrives. Two open connections, one thread, zero blocking.",
        },
      ],
    },
    {
      title: "CPU-bound vs I/O-bound",
      blocks: [
        {
          type: "table",
          caption: "Same process, very different effect on the event loop",
          headers: ["Kind", "Example", "Node behavior"],
          rows: [
            [
              "I/O-bound",
              "await `db.query`",
              "Other work runs while the pool waits. Good by default.",
            ],
            [
              "CPU-bound",
              "huge `JSON.parse`, big crypto, encoding",
              "Blocks the whole process for other clients: use `Worker`, another service, or native work off-thread.",
            ],
          ],
        },
        {
          type: "code",
          title: "Pattern: I/O ok, CPU on main bad, `Worker` to offload",
          code: [
            "app.get('/users', async (req, res) => {",
            "  res.json(await db.query('SELECT * FROM users'));",
            "});",
            "",
            "// Bad: blocks everyone",
            "app.get('/hash', (req, res) => {",
            "  res.json(heavySyncWork(req.body));",
            "});",
            "",
            "const { Worker } = require('worker_threads');",
            "app.get('/hash-ok', (req, res) => {",
            "  const w = new Worker('./worker.js', { workerData: req.body.data });",
            "  w.on('message', (m) => res.json(m));",
            "  w.on('error', () => res.status(500).end());",
            "});",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Profiling: event loop delay",
      blocks: [
        {
          type: "code",
          title: "`perf_hooks` + `clinic` / `--prof`",
          code: [
            "const { monitorEventLoopDelay } = require('perf_hooks');",
            "const h = monitorEventLoopDelay({ resolution: 10 });",
            "h.enable();",
            "",
            "setInterval(() => {",
            "  console.log(",
            "    `Event loop — mean: ${(h.mean / 1e6).toFixed(1)}ms, max: ${(h.max / 1e6).toFixed(1)}ms`",
            "  );",
            "  h.reset();",
            "}, 1000);",
            "",
            "// node --prof app.js   then   node --prof-process isolate-*.log",
            "// npx clinic doctor -- node app.js",
          ].join("\n"),
        },
        {
          type: "paragraph",
          text: "Mean loop delay above ~10ms under load is a signal — not a diagnosis. Profile first (`clinic doctor` or `--prof`) to confirm the hot synchronous path before changing anything.",
        },
      ],
    },
    {
      title: "Go (same day’s comparison)",
      blocks: [
        { type: "diagram", id: "go-goroutine-mn" },
        {
          type: "table",
          caption:
            "High-level: goroutines are cheap; scheduler maps them to a few OS threads",
          headers: ["Topic", "Node.js", "Go"],
          rows: [
            ["Model", "Event loop + async I/O", "Goroutines + M:N scheduler"],
            [
              "I/O",
              "Strong with libuv",
              "Blocking read looks like sync; runtime parks the goroutine",
            ],
            [
              "CPU on one machine",
              "Bad if on main thread",
              "Can use several cores with parallel goroutines",
            ],
            [
              "Primitives",
              "callbacks / `async`",
              "`go` keyword, channels, stdlib",
            ],
            [
              "Per-task memory",
              "small (handles, closures)",
              "small stacks per goroutine (rough order: ~2KB start)",
            ],
          ],
        },
        {
          type: "code",
          title: "TCP server: new goroutine per `Accept`",
          code: [
            "package main",
            "",
            'import "net"',
            "",
            "func main() {",
            '	ln, _ := net.Listen("tcp", ":8080")',
            "	for {",
            "		conn, _ := ln.Accept()",
            "		go handleConn(conn)",
            "	}",
            "}",
            "",
            "func handleConn(c net.Conn) {",
            "	defer c.Close()",
            "	buf := make([]byte, 1024)",
            "	for {",
            "		n, err := c.Read(buf)",
            "		if err != nil { return }",
            '		_, _ = c.Write(append([]byte("Echo: "), buf[:n]...))',
            "	}",
            "}",
          ].join("\n"),
        },
      ],
    },
    {
      title: "Exercises (do all three)",
      blocks: [
        {
          type: "list",
          variant: "number",
          items: [
            "Echo TCP — run the `net` sample, connect twice with `nc` from two terminals, confirm interleaved echoes.",
            "Order quiz — one file with `setTimeout(0)`, `setImmediate` (in Node, not the browser), `Promise.resolve().then`, `process.nextTick`. Predict, run, then match the official note.",
            "Starve vs fix — CPU `for` loop vs `setTimeout(…, 100)`; measure late timer, then put CPU in a `Worker` and re-measure.",
          ],
        },
        {
          type: "paragraph",
          text: "`nextTick` vs `Promise` order is a very common senior Node question — be crisp before Day 3.",
        },
      ],
    },
  ],
  faq: [
    {
      question:
        "How does Node.js handle 10,000 concurrent connections with a single thread?",
      tag: "Core concurrency model",
      answer: [
        "Node.js uses a `single-threaded event loop` together with `non-blocking I/O` through `libuv`. The key insight is that most server work is waiting — not computing.",
        "When a request needs a database query or file read, Node hands the work to the OS (through `libuv`). The OS watches the file descriptor using `epoll` (Linux), `kqueue` (macOS), or `IOCP` (Windows). The one JavaScript thread is free to handle the next work right away. When the OS says data is ready, `libuv` queues the callback, and the event loop runs it.",
        "No thread is blocked on I/O wait. 10,000 open connections means 10,000 registered file descriptors in the OS — not 10,000 threads.",
      ].join("\n\n"),
      callout:
        "The thread is only 'busy' when running JavaScript. All waiting happens at the OS level.",
    },
    {
      question: "What are the 6 phases of the Node.js event loop, in order?",
      tag: "Event loop phases",
      answer: [
        "1. Timers — runs `setTimeout()` and `setInterval()` callbacks whose delay has already expired.",
        "2. Pending I/O — runs I/O callbacks deferred from the previous loop (often TCP error paths such as `ECONNREFUSED`).",
        "3. Idle / prepare — internal only; `libuv` gets ready for the poll phase.",
        '4. Poll — the main I/O phase: Node pulls new I/O events from the OS and runs their callbacks. It can block in this phase when there is nothing else scheduled. This is where Node spends most of its "waiting for work" time.',
        "5. Check — runs `setImmediate()` callbacks.",
        "6. Close — runs close-related logic, e.g. `socket.on('close')`.",
        "Between every phase transition, the microtask queues are fully drained: `process.nextTick` first, then `Promise` jobs (and `queueMicrotask`).",
      ].join("\n\n"),
      callout:
        "Memory trick: Timers → Pending → Idle → Poll → Check → Close. 'The Poll phase is where Node lives.'",
    },
    {
      question:
        "What is the exact execution order of: sync code, nextTick, Promise, setTimeout, setImmediate?",
      tag: "Execution priority",
      answer: [
        "The classic trace prints: 1 → 4 → 2 → 3 → 5. Run the snippet in Node and match the numbers to the rules below.",
        "`console.log('1 - sync');`",
        "`setTimeout(() => console.log('5 - macrotask'), 0);`",
        "`Promise.resolve().then(() => console.log('3 - promise microtask'));`",
        "`process.nextTick(() => console.log('2 - nextTick microtask'));`",
        "`console.log('4 - still sync');`",
        "1. All synchronous code runs first — the call stack is cleared.",
        "2. Then the `process.nextTick` queue is fully drained.",
        "3. Then the `Promise` microtask queue is fully drained (`queueMicrotask` lines up with this).",
        "4. Then the next event loop work runs (macrotasks: timers, I/O, `setImmediate`, and so on). In this script, the `setTimeout` runs in a later turn, so you see 5 last.",
      ].join("\n\n"),
      callout: "This is the #1 Node.js interview question. Know it cold.",
    },
    {
      question:
        "What is the difference between `setTimeout(fn, 0)` and `setImmediate(fn)`?",
      tag: "Timers vs check phase",
      answer: [
        "Outside an I/O callback, order is not fixed: either callback can run first, depending on OS timing and how busy the process is. Do not rely on order at the top level.",
        "Inside an I/O callback, `setImmediate` always runs before `setTimeout(fn, 0)` in that turn. The event loop runs the check phase (where `setImmediate` lives) right after the poll phase that delivered your I/O, before the loop circles back to timers in the next cycle — so you get a stable ordering here.",
        "`const fs = require('fs');`",
        "`fs.readFile('file', () => {`",
        "`  setTimeout(() => console.log('timer'), 0);`",
        "`  setImmediate(() => console.log('immediate'));`",
        "`  // Always prints: immediate -> timer`",
        "`});`",
        "Use `setImmediate` when you want to run something after the current I/O event but before any timers.",
      ].join("\n\n"),
      callout:
        "Outside I/O: order is non-deterministic. Inside an I/O callback: setImmediate always wins.",
    },
    {
      question:
        "What is event loop starvation and how can `process.nextTick` cause it?",
      tag: "Event loop starvation",
      answer: [
        "Starvation means the event loop never advances to the next phase — I/O callbacks, timers, and `setImmediate` never fire because the microtask queue is never empty.",
        "`process.nextTick` drains completely before the loop moves on. If a `nextTick` callback schedules another `nextTick`, and that one does the same, the loop is permanently stuck:",
        "`function starve() {`",
        "`  process.nextTick(starve); // recursion — event loop never moves`",
        "`}`",
        "`starve();`",
        "`// Your HTTP server stops responding. Forever.`",
        "Fix: use `setImmediate` for recursive scheduling — it yields to the event loop each iteration, letting I/O and timers run between calls.",
      ].join("\n\n"),
      callout:
        "Node.js has no built-in protection against `nextTick` starvation. It's your responsibility.",
    },
    {
      question:
        "What is the difference between CPU-bound and I/O-bound code, and why does it matter in Node.js?",
      tag: "CPU vs I/O",
      answer: [
        "I/O-bound code is mostly waiting: database queries, network requests, and disk reads. The Node.js main thread is free while `libuv` and the OS wait for the response — other JavaScript can run. This is the sweet spot for Node.",
        "CPU-bound code crunches on the main thread: large `JSON.parse`, crypto operations, image encoding. While that runs, no other client gets a turn — the entire process is blocked until the computation ends.",
        "The practical rule: I/O is free in terms of the event loop. CPU on the main thread is dangerous and belongs in `worker_threads`, a child process, or a separate service.",
      ].join("\n\n"),
      callout:
        "I/O suspends the callback, not the thread. CPU on the main thread blocks everyone until it finishes.",
    },
    {
      question: "What is libuv and what role does it play in Node.js?",
      tag: "libuv internals",
      answer: [
        "`libuv` is a cross-platform C library that powers the Node.js event loop and non-blocking I/O. It wraps OS-specific async interfaces: `epoll` on Linux, `kqueue` on macOS, `IOCP` on Windows.",
        "It manages the event loop phases (timers, poll, check, close), async file and network handles, and a thread pool for operations that are not natively async at the OS level — some `fs` calls and `dns.lookup` use this pool so the main thread is never blocked.",
        "Your JavaScript sees one thread with callbacks. The machinery underneath is `libuv` coordinating OS events and the thread pool.",
      ].join("\n\n"),
      callout:
        "libuv is the bridge between JavaScript’s single thread and the OS’s async I/O primitives.",
    },
    {
      question:
        "How do Go goroutines differ from Node.js’s event loop for handling concurrency?",
      tag: "Node vs Go concurrency",
      answer: [
        "Node.js uses a single main thread for JavaScript. Concurrency comes from async I/O and callback scheduling — the thread is idle while work waits in the OS. CPU work on the main thread blocks every client.",
        "Go uses goroutines: lightweight user-space tasks multiplexed (M:N) onto a few OS threads by the Go runtime scheduler. Blocking a goroutine on `Read` does not block the process — the scheduler runs other goroutines. This gives synchronous-looking code that scales across cores.",
        "The practical difference: Node is great when work is I/O-shaped and you never block the loop. Go handles both I/O and CPU-bound parallelism naturally, using multiple cores without extra process management.",
      ].join("\n\n"),
      callout:
        "Node: one JS thread, async callbacks. Go: many goroutines on a few OS threads, true parallelism.",
    },
    {
      question:
        "How would you detect and fix a blocked event loop in a production Node.js app?",
      tag: "Production debugging",
      answer: [
        "Detect with tools: `perf_hooks` `monitorEventLoopDelay` reports mean and max lag. APMs show request latency skew. `npx clinic doctor` and `node --prof` + `node --prof-process` profile CPU hot paths. Health checks with timeouts catch hangs. Slow route handler logs reveal the culprit.",
        "Fix: find hot synchronous code — large `JSON.parse`, sync `fs` calls in hot paths, sync crypto. Move CPU work to `worker_threads` or a separate worker service. Use `child_process` for isolation. Break long tasks with `setImmediate`. Scale horizontally to spread load.",
        "Rule: measure first, then fix. Profile to confirm the hot path before optimising.",
      ].join("\n\n"),
      callout:
        "Measure with `monitorEventLoopDelay` and clinic. Fix by moving CPU off the main thread.",
    },
    {
      question: "What is the call stack, and what happens when it overflows?",
      tag: "Call stack",
      answer: [
        "The call stack is a LIFO structure tracking active function calls. Each function call pushes a frame; a `return` pops it. Node.js (V8) has one call stack per main thread — only one function executes at a time.",
        "When recursive calls nest too deeply, frames accumulate until the engine limit is hit. The result is `RangeError: Maximum call stack size exceeded`. Nothing after the overflow in that stack runs until an error handler catches it.",
        "Common causes: runaway recursion, unbounded mutual recursion, or deep synchronous chains. Fix with iteration or by breaking work into microtask/macrotask chunks.",
      ].join("\n\n"),
      callout:
        "One stack, one thread. Stack overflow = `RangeError: Maximum call stack size exceeded`.",
    },
  ],
  bullets: [
    "Write the 1 → 4 → 2 → 3 → 5 trace from memory without looking.",
    "Run `clinic doctor` or `node --prof` once and name one hot function from the report.",
    "Be able to explain M:N scheduling in Go vs a single main-thread `Node` in two sentences.",
  ],
} satisfies RoadmapDayDetail;
