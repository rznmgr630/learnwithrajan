import type { RoadmapDayDetail } from "./challenge-data";

export const DAY_2_DETAIL = {
  overview: [
    "Welcome to Day 2. The core idea: `Node.js` runs your JavaScript on a single thread with `V8`, while `libuv` (and the OS) do the waiting for sockets, files, and timers. Many concurrent connections do not mean one OS thread per connection: they are mostly waiting, multiplexed on one (or a few) threads running JS.",
    "By the end you should predict `console.log` / `setTimeout` / `Promise` / `process.nextTick` order, explain CPU-bound vs I/O-bound work, and contrast Node’s event loop with Go `goroutine`s in a short answer.",
  ],
  sections: [
    {
      title: "The big picture: one thread, many waiting connections",
      blocks: [
        { type: "diagram", id: "node-one-thread-io" },
        {
          type: "paragraph",
          text: "Most backend work is waiting: DB, disk, network, DNS. The JS thread runs your code when a callback is ready. While work waits, `libuv` and the OS keep file descriptors; when data is ready, a callback is queued. That is how one thread can handle many in-flight I/O operations.",
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            "Concurrency is cooperative scheduling of callbacks, not CPU parallelism on the main thread (use `worker_threads` / more processes for that).",
            "V8 is fast; the main risk is blocking the loop with long sync or CPU-heavy work (below).",
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
          text: "One turn of the loop runs timers, pending, poll, `setImmediate` (check), and close handles — use the official Node “event loop” docs as the source of truth. These figures are a mental model.",
        },
        { type: "diagram", id: "node-execution-priority" },
      ],
    },
    {
      title: "Execution order (the interview gotcha)",
      blocks: [
        {
          type: "paragraph",
          text: "In one go: synchronous call stack first. Then all `process.nextTick` jobs, then all `Promise` microtasks, then macrotasks like `setTimeout(…, 0)` and I/O. Wrong order in an interview = red flag.",
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
          text: "Recursive `process.nextTick` can starve the loop: if you enqueue `nextTick` forever, timers and I/O never get a turn. Never do that in production.",
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
          text: "HTTP is TCP plus a text protocol. `net.createServer` makes “one `socket` per accept” easy to see — the same building block under HTTP/2 later.",
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
          text: "Each `socket` is a duplex stream. `libuv` registers the fd; when bytes arrive, your callback is scheduled. That is not “one thread blocked per client” like a classic thread-per-request server.",
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
            ["I/O-bound", "await `db.query`", "Other work runs while the pool waits. Good by default."],
            ["CPU-bound", "huge `JSON.parse`, big crypto, encoding", "Blocks the whole process for other clients: use `Worker`, another service, or native work off-thread."],
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
          text: "If mean loop delay stays above about 10ms in a server under load, suspect blocking I/O, heavy sync JSON, or hot logging — confirm with a profile, not guesswork.",
        },
      ],
    },
    {
      title: "Go (same day’s comparison)",
      blocks: [
        { type: "diagram", id: "go-goroutine-mn" },
        {
          type: "table",
          caption: "High-level: goroutines are cheap; scheduler maps them to a few OS threads",
          headers: ["Topic", "Node.js", "Go"],
          rows: [
            ["Model", "Event loop + async I/O", "Goroutines + M:N scheduler"],
            ["I/O", "Strong with libuv", "Blocking read looks like sync; runtime parks the goroutine"],
            ["CPU on one machine", "Bad if on main thread", "Can use several cores with parallel goroutines"],
            ["Primitives", "callbacks / `async`", "`go` keyword, channels, stdlib"],
            ["Per-task memory", "small (handles, closures)", "small stacks per goroutine (rough order: ~2KB start)"],
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
      question: "How does Node.js handle 10,000 concurrent connections with a single thread?",
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
        "4. Poll — the main I/O phase: Node pulls new I/O events from the OS and runs their callbacks. It can block in this phase when there is nothing else scheduled. This is where Node spends most of its “waiting for work” time.",
        "5. Check — runs `setImmediate()` callbacks.",
        "6. Close — runs close-related logic, e.g. `socket.on('close')`.",
        "Between every phase transition, the microtask queues are fully drained: `process.nextTick` first, then `Promise` jobs (and `queueMicrotask`).",
      ].join("\n\n"),
      callout:
        "Memory trick: Timers → Pending → Idle → Poll → Check → Close. 'The Poll phase is where Node lives.'",
    },
    {
      question: "What is the exact execution order of: sync code, nextTick, Promise, setTimeout, setImmediate?",
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
      question: "What is the difference between `setTimeout(fn, 0)` and `setImmediate(fn)`?",
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
    },
    {
      question: "What is event loop starvation and how can `process.nextTick` cause it?",
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
      question: "What is the difference between CPU-bound and I/O-bound code, and why does it matter in Node.js?",
      answer:
        "I/O-bound: your code is mostly waiting (DB, network, disk). The main thread can run other JavaScript while `libuv` and the OS wait. CPU-bound: your code is crunching (crypto, big `JSON.parse`, image encode) on the main thread: that blocks the entire process; no other clients get a turn until the work ends. In Node, that is why I/O is “free” in terms of the loop, but CPU on the main thread is dangerous and belongs in `worker_threads`, a child process, or another service.",
    },
    {
      question: "What is libuv and what role does it play in Node.js?",
      answer:
        "`libuv` is a C library Node uses for the cross-platform event loop, async I/O (wraps `epoll`, `kqueue`, `IOCP` depending on the OS), handles, timers, and a thread pool for a few things that are not always async at the libuv level (e.g. some `fs` calls, `dns` lookup) so the main thread stays non-blocking. Your JavaScript’s “one thread + callbacks” model sits on top of this.",
    },
    {
      question: "How do Go goroutines differ from Node.js's event loop for handling concurrency?",
      answer:
        "Node (default): a single main thread for JS; concurrency is async I/O and callback scheduling; CPU work on the main thread blocks everyone. Go: many goroutines (very small user-space tasks) are multiplexed (M:N) onto a few OS threads by the runtime. Blocking a goroutine on `Read` does not block the whole process: the scheduler runs other goroutines. So Go gives synchronous-style code for I/O with true parallelism for CPU on multiple cores, while Node keeps one JS call stack and works well when work is I/O shaped and you avoid blocking the loop.",
    },
    {
      question: "How would you detect and fix a blocked event loop in a production Node.js app?",
      answer:
        "Detect: `perf_hooks` `monitorEventLoopDelay` (high mean or max = lag), APMs (e.g. transaction skew), `npx clinic doctor` or `node --prof` + `node --prof-process`, logging slow route handlers, health checks with timeouts. Fix: find hot synchronous paths (huge JSON, sync `fs` in a hot path, accidental sync crypto); move CPU work to `worker_threads` or a worker service; for isolation or another runtime use `child_process` or a separate process; break long tasks; scale horizontally. Prefer measuring before “optimising” at random.",
    },
    {
      question: "What is the call stack, and what happens when it overflows?",
      answer:
        "The call stack is the LIFO list of function calls: each call pushes a frame; a `return` pops. Only one stack runs per main thread. When nested calls (usually infinite recursion) exceed the engine limit, you get `RangeError: Maximum call stack size exceeded` and the process throws — nothing after that in that stack runs until error handling. Deep synchronous chains can do the same (rare in normal app code, common in runaway bots or bugs).",
    },
  ],
  bullets: [
    "Write the 1 → 4 → 2 → 3 → 5 trace from memory without looking.",
    "Run `clinic doctor` or `node --prof` once and name one hot function from the report.",
    "Be able to explain M:N scheduling in Go vs a single main-thread `Node` in two sentences.",
  ],
} satisfies RoadmapDayDetail;
