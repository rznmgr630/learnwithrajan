import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_1_LESSONS: LessonDay = {
  day: 1,
  title: "Install, run and understand the shape of a Node.js project",
  totalMinutes: 72,
  difficulty: "Beginner",
  lessons: [
    {
      id: "what-is-node",
      title: "What Node.js is, and what is inside it",
      durationMinutes: 10,
      explanation:
        "Node.js is JavaScript running <b>outside the browser</b>.\n\nWith it you can build:\n\n• REST APIs\n• Backend applications\n• CLI tools\n• Background workers\n• Real-time applications\n• Microservices\n• Web servers\n\nBefore writing anything large, it helps to know what Node.js actually is, how to install it properly, and how a project runs.\n\n---\n\n## What is Node.js?\n\n<b>Node.js</b> (a JavaScript runtime that executes JavaScript outside a browser).\n\nNormally your JavaScript reaches a browser:\n\n```text\nJavaScript\n    ↓\nBrowser\n    ↓\nChrome / Firefox / Safari\n```\n\nWith Node.js it reaches the machine instead:\n\n```text\nJavaScript\n    ↓\nNode.js\n    ↓\nOperating System\n```\n\nSo this:\n\n```javascript\nconsole.log(\"Hello from Node.js\");\n```\n\nruns straight from your terminal:\n\n```bash\nnode app.js\n```\n\nNotice what Node.js is <b>not</b>: it is not a language, and it is not a framework. It is a program that runs the JavaScript you already know. Express is the framework, and it comes later in this track.\n\n---\n\n## What is inside Node.js?\n\nThree pieces, and it is worth being able to name them:\n\n```text\n                 Node.js\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n       V8       C++ Layer   Standard Library\n        │           │           │\n   Executes JS   OS-level    fs, http,\n                  work       path, etc.\n```\n\n---\n\n## V8\n\n<b>V8</b> (Google's JavaScript engine, the part that executes your JavaScript).\n\nIt was built for Chrome, and Node.js embeds the same engine. So this line is handled by exactly the same code that runs it in your browser:\n\n```javascript\nconst result = 10 + 20;\n\nconsole.log(result);\n```\n\nWhat V8 does with it:\n\n```text\nJavaScript code\n      ↓\n     V8\n      ↓\nMachine instructions\n      ↓\n     CPU\n```\n\nIn one line: <b>V8 executes JavaScript</b>. It knows nothing about files, sockets or processes.\n\n---\n\n## The C++ layer\n\nNode.js is not written entirely in JavaScript. A large part of it is C and C++, because that is what talks efficiently to the operating system.\n\n```text\nJavaScript\n    ↓\nNode.js APIs\n    ↓\nC / C++ layer\n    ↓\nOperating System\n```\n\nYou never write any of it. When you call:\n\n```javascript\nconst fs = require(\"fs\");\n\nfs.readFile(\"hello.txt\", callback);\n```\n\nyour JavaScript asks Node.js to read a file, and Node.js drops into that lower layer to ask the operating system. This is the part V8 cannot do on its own, and it is exactly why Node.js exists as more than just an engine.\n\n---\n\n## The standard library\n\n<b>Standard library</b> (functionality built into Node.js, with nothing to install).\n\n```javascript\nconst fs = require(\"fs\");\n```\n\nThe built-in modules you will meet:\n\n```text\nfs       → File system\nhttp     → HTTP servers\nhttps    → HTTPS\npath     → File paths\nos       → Operating system information\ncrypto   → Cryptography\nevents   → Event handling\nstream   → Data streams\nurl      → URL handling\nutil     → Utility functions\n```\n\nNone of these need `npm install`. They ship with Node.js.\n\nOne thing to expect: you will see built-in modules loaded two different ways.\n\n```javascript\nconst fs = require(\"fs\");              // CommonJS\nimport fs from \"node:fs\";              // ES modules\n```\n\nBoth work. The `node:` prefix makes it unmistakable that you mean the built-in module and not a package someone published with the same name. Day 2 covers which style to use and why.",
      diagram: `Browser JavaScript vs Node.js JavaScript

    JavaScript              JavaScript
        ↓                       ↓
     Browser                 Node.js
        ↓                       ↓
      DOM                Operating System
    window                 files, sockets,
    document               processes, env

    Same language. Different surroundings.


The three pieces of Node.js

                     Node.js
                        │
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
        V8         C / C++ layer  Standard library
         │              │              │
    executes JS    talks to the    fs, http, path,
    (from Chrome)  OS for you      os, crypto, util
         │              │
         └──── knows nothing about files ────┘
                        │
              this layer is why Node
              is more than just V8


What actually happens on fs.readFile

    your code ── fs.readFile("hello.txt", cb)
        ↓
    Node.js API  (JavaScript)
        ↓
    C / C++ layer
        ↓
    Operating System reads the disk
        ↓
    cb(err, data)   ← your callback runs`,
      codeExample: {
        title: "Your first Node.js program, and the built-ins",
        code: `// app.js  — run it with:  node app.js

console.log("Hello from Node.js");

// ── V8 handles plain JavaScript, exactly as in a browser ─────
const result = 10 + 20;
console.log(result);                  // 30

// ── But the surroundings are different ──────────────────────
console.log(typeof window);           // "undefined"  no DOM here
console.log(typeof document);         // "undefined"
console.log(process.version);         // "v24.x.x"    a Node global

// ── The standard library: no npm install needed ─────────────
const os = require("os");
const path = require("path");

console.log(os.platform());           // "darwin" | "linux" | "win32"
console.log(os.cpus().length);        // how many cores you have
console.log(path.join("src", "server.js"));   // "src/server.js"

// ── Asking the OS to read a file ────────────────────────────
const fs = require("fs");

fs.readFile("hello.txt", "utf8", (error, data) => {
  if (error) {
    console.error("Could not read the file:", error.message);
    return;
  }
  console.log(data);
});

// ── Two ways to load a built-in module ──────────────────────
// const fs = require("fs");          // CommonJS
// import fs from "node:fs";          // ES modules, explicit built-in
//
// Both work. Day 2 covers which to choose.`,
      },
      keyTakeaways: [
        "Node.js is a <b>runtime</b>, not a language and not a framework.",
        "It is the same JavaScript you know, with the operating system in place of the DOM.",
        "<b>V8</b> executes your JavaScript. It knows nothing about files, sockets or processes.",
        "The <b>C/C++ layer</b> is what talks to the operating system on your behalf.",
        "The <b>standard library</b> (`fs`, `http`, `path`, `os`, `util`, ...) ships with Node. No install needed.",
        "There is no `window` or `document` in Node. You get `process`, `require` and the built-in modules instead.",
        "`node:fs` and `fs` are the same module. The prefix just makes the built-in explicit.",
      ],
      commonMistakes: [
        "<b>Calling Node.js a framework</b> — it is a runtime. Express is the framework, and it arrives later in this track.",
        "<b>Expecting `window`, `document` or `alert`</b> — those are browser features. Node has `process`, `console` and the built-ins.",
        "<b>Running `npm install fs`</b> — `fs` is built in. There are lookalike packages on npm, which is one reason `node:fs` is clearer.",
        "<b>Thinking V8 reads files</b> — V8 only runs JavaScript. Every file, socket and timer goes through Node's own layer underneath.",
      ],
      quiz: [
        {
          question: "Which part of Node.js actually executes your JavaScript?",
          options: ["libuv", "V8", "The standard library", "The C++ layer"],
          correctIndex: 1,
          explanation:
            "V8, the same engine Chrome uses, compiles and runs your JavaScript. The C/C++ layer and the standard library exist to give that JavaScript access to files, networking and the process itself.",
        },
        {
          question: "Why does Node.js need a C/C++ layer at all?",
          options: [
            "To make JavaScript run faster",
            "Because V8 cannot talk to the operating system on its own",
            "To compile your JavaScript ahead of time",
            "So you can write parts of your app in C++",
          ],
          correctIndex: 1,
          explanation:
            "V8 only evaluates JavaScript. Reading a file or opening a socket means asking the operating system, and that is what the lower layer does for you.",
        },
        {
          question: "What does `console.log(typeof window)` print in Node.js?",
          options: ["`\"object\"`", "`\"undefined\"`", "It throws a ReferenceError", "`\"global\"`"],
          correctIndex: 1,
          explanation:
            "`window` is a browser thing. `typeof` on an undeclared name is safe and returns the string `\"undefined\"` rather than throwing.",
        },
      ],
    },
    {
      id: "why-node-exists",
      title: "One thread, non-blocking I/O and the event loop",
      durationMinutes: 12,
      explanation:
        "This is the idea Node.js was built around, and the reason it became popular. Everything else on Day 1 is setup. This part is the concept.\n\n---\n\n## A single thread\n\nYour JavaScript runs on <b>one main thread</b>. A <b>thread</b> (a single path of execution the CPU follows) does one thing at a time.\n\n```text\nNode.js\n   │\n   ↓\nMain JavaScript Thread\n   │\n   ├── Request 1\n   ├── Request 2\n   ├── Request 3\n   └── Request 4\n```\n\nThis does <b>not</b> mean Node.js serves one user at a time. That is the single most common misconception about it.\n\nOne thread is fine, because Node.js never sits there doing nothing while it waits.\n\n---\n\n## What is I/O?\n\n<b>I/O (input/output)</b> means talking to something outside the CPU.\n\n```text\nReading a file\nWriting a file\nDatabase query\nHTTP request\nNetwork communication\nRedis request\nCalling another API\n```\n\nAll of it is slow compared to running code:\n\n```javascript\nconst data = await database.query(\"SELECT * FROM users\");\n```\n\nThat might take:\n\n```text\n50ms\n100ms\n500ms\n2 seconds\n```\n\nIn CPU terms those numbers are enormous. A modern processor gets through millions of operations in a single millisecond. So the interesting question is what happens during the wait.\n\n---\n\n## Blocking\n\n```text\nStart\n  ↓\nDatabase query\n  ↓\nWAIT 500ms\n  ↓\nContinue\n```\n\nFor 500ms nothing else happens. One user's slow query freezes everybody.\n\n---\n\n## Non-blocking\n\nNode.js is built around asynchronous, non-blocking I/O:\n\n```text\nRequest\n   ↓\nStart database query\n   ↓\nDo other work\n   ↓\nDo other work\n   ↓\nDatabase finishes\n   ↓\nHandle result\n```\n\nThe query is handed off. The thread goes back to whatever else is waiting to run, and picks the result up when it arrives.\n\n---\n\n## The event loop\n\n<b>Event loop</b> (the mechanism that lets Node.js handle asynchronous work without blocking the main thread).\n\nYou will go much deeper into it later. For now, hold this shape:\n\n```text\nJavaScript\n    ↓\nMain Thread\n    ↓\nStart I/O operation\n    ↓\nDon't wait doing nothing\n    ↓\nContinue other work\n    ↓\nI/O finishes\n    ↓\nHandle result\n```\n\nThis is what makes Node.js a good fit for I/O-heavy work:\n\n• APIs\n• Web servers\n• Real-time applications\n• Chat applications\n• Network services\n\nAnd it tells you where Node.js is a poor fit. If the slow part is <b>your own computation</b> rather than waiting, there is nothing to hand off. A long synchronous loop holds the one thread and every other request queues behind it. That is what people mean by \"blocking the event loop\", and it is the one way to make a Node server feel frozen.\n\n```javascript\n// Fine: waiting is handed off, the thread stays free\nawait database.query(\"SELECT * FROM users\");\n\n// Not fine: the thread is busy, nothing else can run\nfor (let i = 0; i < 5_000_000_000; i += 1) {\n  total += i;\n}\n```\n\nThe fix for heavy computation is worker threads or a separate process, not async syntax. Async helps with <b>waiting</b>, not with <b>work</b>.",
      diagram: `Blocking: one slow query, everyone waits

    thread  ██ read ─────── WAIT 500ms ─────── ██ respond
                            │
    request B                └─ stuck in the queue this whole time
    request C                └─ stuck too


Non-blocking: the wait is handed off

    thread  ██ start query ── ██ start query ── ██ ── ██
              (request A)      (request B)     A     B
                    │                │       done  done
                    └────────┬───────┘
                             ↓
                   the OS does the waiting

    One thread, never idle, both requests served.


Where the time actually goes

    running your JavaScript      microseconds
    reading a file               milliseconds
    database query               10 - 500 ms
    calling another API          50 ms - 2 s

    Almost all of it is waiting. That is what Node
    optimises for.


The one way to freeze a Node server

    await db.query()          thread free    ✓ other work runs
    for (huge loop)           thread busy    ✗ everything queues

    async fixes WAITING, not WORK.
    Heavy computation needs worker threads.`,
      codeExample: {
        title: "Blocking and non-blocking, side by side",
        code: `const fs = require("fs");

// ── Non-blocking: hand the wait off, keep going ──────────────
console.log("1  start");

fs.readFile("hello.txt", "utf8", (error, data) => {
  console.log("3  file arrived");        // runs last, when ready
});

console.log("2  did other work");        // runs immediately

// Output order:  1  →  2  →  3
// The thread never sat waiting for the disk.


// ── Blocking: the sync version stops everything ──────────────
// const data = fs.readFileSync("hello.txt", "utf8");
// console.log(data);
// Nothing else in the whole process runs until the disk answers.
// Fine in a one-off script. Never in a server request handler.


// ── What "blocking the event loop" looks like ────────────────
function slowSum() {
  let total = 0;
  for (let i = 0; i < 5_000_000_000; i += 1) total += i;   // seconds of CPU
  return total;
}
// Call this inside a request handler and every other request
// waits for it. No amount of async/await helps: the thread is
// busy, not waiting. Heavy computation belongs in a worker.


// ── Proving one thread serves many waits ─────────────────────
async function fakeQuery(label, ms) {
  await new Promise((resolve) => setTimeout(resolve, ms));
  console.log(\`\${label} finished after \${ms}ms\`);
}

// started together, not one after another
await Promise.all([
  fakeQuery("query A", 300),
  fakeQuery("query B", 100),
  fakeQuery("query C", 200),
]);

// B (100ms) → C (200ms) → A (300ms)
// Total elapsed: ~300ms, not 600ms.`,
      },
      keyTakeaways: [
        "Your JavaScript runs on <b>one main thread</b>. That does not mean one user at a time.",
        "<b>I/O</b> is anything outside the CPU: files, databases, networks, other APIs.",
        "I/O is slow in CPU terms, so nearly all of a server's time is spent waiting.",
        "Node hands the waiting off and keeps the thread free. That is non-blocking I/O.",
        "The <b>event loop</b> is what brings finished results back to your code.",
        "This makes Node a good fit for I/O-heavy work: APIs, web servers, real-time apps.",
        "A long synchronous loop holds the one thread and queues every other request. Async fixes waiting, not work.",
      ],
      commonMistakes: [
        "<b>\"Single threaded means one user at a time\"</b> — the opposite. One thread that never waits idle serves thousands of connections.",
        "<b>Using the `*Sync` version of a file API in a server</b> — `readFileSync` stops the whole process. It belongs in scripts and startup code, not request handlers.",
        "<b>Expecting `async` to speed up heavy computation</b> — it only helps when there is a wait to hand off. CPU work needs worker threads.",
        "<b>Awaiting independent calls one at a time in a loop</b> — that serialises them. `Promise.all` starts them together.",
        "<b>Assuming Node is the wrong choice because it is single threaded</b> — the thread count only becomes the limit when your work is CPU-bound.",
      ],
      quiz: [
        {
          question: "A request is waiting on a 500ms database query. What is the Node process doing during those 500ms?",
          options: [
            "Sitting idle until the query returns",
            "Spawning a thread for the next request",
            "Running other requests, timers and callbacks",
            "Queueing every other request until this one is done",
          ],
          correctIndex: 2,
          explanation:
            "The wait is handed off, so the thread goes straight back to other work. The result is picked up through the event loop when it arrives.",
        },
        {
          question: "Which of these genuinely makes a Node server feel frozen?",
          options: [
            "Awaiting a slow database query",
            "Reading a file with `fs.readFile`",
            "A five-second synchronous `for` loop in a request handler",
            "Handling a thousand connections at once",
          ],
          correctIndex: 2,
          explanation:
            "A synchronous loop keeps the one thread busy, so nothing else can run. Waiting is handed off, but CPU work is not. That needs a worker thread or a separate process.",
        },
        {
          question: "Why is Node.js described as a good fit for I/O-heavy applications?",
          options: [
            "Because JavaScript is faster than other languages",
            "Because it uses one thread per connection",
            "Because almost all the time is spent waiting, and it does not block while it waits",
            "Because V8 compiles code ahead of time",
          ],
          correctIndex: 2,
          explanation:
            "APIs and web servers spend most of their time waiting on disks, databases and networks. Node hands those waits off instead of holding a thread for each one.",
        },
      ],
    },
    {
      id: "install-and-pin",
      title: "Installing Node.js and pinning a version",
      durationMinutes: 10,
      explanation:
        "How you install Node.js matters more than it sounds, because real projects do not all want the same version.\n\n---\n\n## Use a version manager\n\nFor development, do not install Node.js through your operating system's package manager. Use a <b>Node version manager</b> instead.\n\nThe two worth knowing:\n\n```text\nfnm\nnvm\n```\n\n<b>fnm (Fast Node Manager)</b> installs and switches between Node.js versions. It is written in Rust and starts quickly.\n\n<b>nvm (Node Version Manager)</b> does the same job and has been the standard for years.\n\nEither is fine. The shape is what matters:\n\n```text\nYour computer\n    ↓\nNode version manager\n    ↓\nNode.js versions\n```\n\n```text\nNode 22\nNode 24\nNode 25\n```\n\nAnd you switch between them per project.\n\n---\n\n## Why not the system package manager?\n\nYou will see instructions like:\n\n```bash\nbrew install node\n```\n\nor:\n\n```bash\napt install nodejs\n```\n\nThose install one Node into the whole system. That is fine until you have two projects:\n\n```text\nProject A\nNode 22\n\nProject B\nNode 24\n```\n\nWith a version manager you switch. With a system install you upgrade and hope nothing else broke. There is a second reason: a global install often needs `sudo` for global packages, and a version manager keeps everything in your home directory instead.\n\n---\n\n## Pin the version\n\nA project should say which Node version it expects. Otherwise you end up here:\n\n```text\nDeveloper A → Node 22\nDeveloper B → Node 24\nCI          → Node 23\nProduction  → Node 24\n```\n\nThat is how you get a bug that only reproduces on one machine.\n\nThe common approach:\n\n```text\n.nvmrc\n```\n\n---\n\n## `.nvmrc`\n\n<b>`.nvmrc`</b> (a file that tells your version manager which Node version this project uses).\n\nThe whole file is one line:\n\n```text\n24\n```\n\nIn a project:\n\n```text\nmy-api/\n├── .nvmrc\n├── package.json\n├── src/\n│   └── server.js\n└── README.md\n```\n\nThen, in that folder:\n\n```bash\nnvm use\n```\n\nand you are on Node 24. `fnm` reads the same file with `fnm use`, and can switch automatically as you `cd` between projects.\n\nCommit `.nvmrc`. It is for everyone on the project, not just you.\n\n---\n\n## Which version should you use?\n\nTwo release lines get mentioned constantly.\n\n### Active LTS\n\n<b>LTS (long-term support)</b> means a version maintained for stability, with a long support window.\n\n```text\nUse Active LTS\n```\n\nThat is the safe default for anything real.\n\n### Current\n\n<b>Current</b> is the newest line, with the latest features and a much shorter support window.\n\nUseful when you are:\n\n• Experimenting\n• Testing new Node features\n• Learning new APIs\n• Trying upcoming functionality\n\nThe rule:\n\n```text\nProduction   → Active LTS\nExperimenting → Current\n```\n\nOne more detail worth knowing: <b>even-numbered</b> Node versions become LTS, odd-numbered ones never do. So 22 and 24 get long support, 23 and 25 do not.\n\nAnd do not copy a version number out of an old tutorial. Check what is currently supported, then pin that.",
      diagram: `Why a version manager, not a system install

    system install                version manager
    ┌──────────────┐              ┌──────────────┐
    │  one Node    │              │  Node 22     │
    │  for the     │              │  Node 24  ←  │ project A
    │  whole       │              │  Node 25     │
    │  machine     │              └──────────────┘
    └──────────────┘                     ↑
    upgrade and hope              switch per project
    nothing broke                 with one command


.nvmrc keeps everyone on the same version

    my-api/
    ├── .nvmrc          ← "24", committed to git
    ├── package.json
    └── src/server.js

    developer A  ── nvm use ──►  Node 24
    developer B  ── nvm use ──►  Node 24
    CI           ── nvm use ──►  Node 24
    production   ── nvm use ──►  Node 24

    No more "works on my machine".


Release lines

    22  ──────────────────────────────►  LTS   even, long support
    23  ────────►                        no    odd, short life
    24  ──────────────────────────────►  LTS   even, long support
    25  ────────►                        no    odd, short life

    Production    → Active LTS
    Experimenting → Current`,
      codeExample: {
        title: "Installing, switching and pinning",
        code: `# ── Check what you have (if anything) ───────────────────────
node -v                     # v24.4.0
npm -v                      # 11.x.x
which node                  # where it came from


# ── Option 1: fnm (fast, Rust) ──────────────────────────────
# brew install fnm          # macOS
fnm install --lts           # install the current Active LTS
fnm use --lts
fnm list                    # what is installed


# ── Option 2: nvm (the long-standing standard) ──────────────
nvm install --lts           # install Active LTS
nvm install 24              # or a specific major
nvm use 24
nvm ls                      # what is installed
nvm alias default 24        # what new terminals start with


# ── Pin the version for the project ─────────────────────────
cd my-api
echo "24" > .nvmrc
git add .nvmrc              # commit it, it is for the whole team

nvm use                     # reads .nvmrc → Node 24
# fnm use                   # reads the same file


# ── Also worth declaring in package.json ────────────────────
# {
#   "name": "my-api",
#   "engines": {
#     "node": ">=24"
#   }
# }
# npm warns (or with engine-strict, refuses) on the wrong version.


# ── What NOT to do for development ──────────────────────────
# brew install node         # one Node for the whole machine
# apt install nodejs        # often an old version, needs sudo`,
      },
      keyTakeaways: [
        "Install Node through a version manager (`fnm` or `nvm`), not your system package manager.",
        "Different projects need different Node versions. A version manager lets you switch per project.",
        "`.nvmrc` holds one line, the major version, and belongs in git.",
        "`nvm use` or `fnm use` inside the project reads `.nvmrc` and switches you to the right version.",
        "<b>Active LTS</b> for anything real. <b>Current</b> for experiments.",
        "Even-numbered Node majors become LTS. Odd-numbered ones never do.",
        "`engines` in `package.json` states the requirement too, and npm will warn on a mismatch.",
        "Never copy a Node version out of an old tutorial. Check what is supported now.",
      ],
      commonMistakes: [
        "<b>Installing Node with `brew` or `apt` for development</b> — you get one version for the whole machine and no clean way to switch.",
        "<b>Using `sudo npm install -g`</b> — a sign Node is installed in the wrong place. A version manager keeps everything in your home directory.",
        "<b>Not committing `.nvmrc`</b> — pinning only helps if everyone and CI read the same file.",
        "<b>Running an odd-numbered version in production</b> — 23 and 25 never become LTS and lose support quickly.",
        "<b>Copying `nvm install 16` from a 2021 tutorial</b> — that version is long past end of life, security fixes included.",
        "<b>Assuming `nvm use` is permanent</b> — it applies to the current shell. `nvm alias default` sets what new terminals get.",
      ],
      quiz: [
        {
          question: "What does `.nvmrc` contain, and who is it for?",
          options: [
            "Your npm credentials, kept out of git",
            "The Node version the project expects, committed for everyone",
            "A list of dependencies to install",
            "Environment variables for local development",
          ],
          correctIndex: 1,
          explanation:
            "It is one line naming the Node version, and it belongs in git. Then every developer and CI runs `nvm use` and lands on the same version.",
        },
        {
          question: "Which Node version line should a production application be on?",
          options: ["The newest Current release", "Active LTS", "Whatever the tutorial used", "An odd-numbered major"],
          correctIndex: 1,
          explanation:
            "Active LTS is maintained for stability with a long support window. Current gets the newest features but loses support quickly, and odd-numbered majors never become LTS at all.",
        },
        {
          question: "Why avoid `brew install node` or `apt install nodejs` for development work?",
          options: [
            "Those versions are missing the standard library",
            "They install one Node for the whole machine, so you cannot switch per project",
            "They cannot run ES modules",
            "npm does not come with them",
          ],
          correctIndex: 1,
          explanation:
            "A system install gives you a single global version. Once two projects need different majors you are upgrading the whole machine and hoping. A version manager switches per project instead.",
        },
      ],
    },
    {
      id: "running-code",
      title: "Running JavaScript — files, REPL, --eval, --watch, --env-file",
      durationMinutes: 12,
      explanation:
        "Five ways to run JavaScript with Node. You will use all of them, and two of them replace tools that tutorials still tell you to install.\n\n---\n\n## Running a file\n\nCreate `app.js`:\n\n```javascript\nconsole.log(\"Hello Node.js!\");\n```\n\nRun it:\n\n```bash\nnode app.js\n```\n\n```text\nHello Node.js!\n```\n\nThat is the whole thing. No build step, no config file, no compiler.\n\n---\n\n## The REPL\n\n<b>REPL (read-eval-print loop)</b> is an interactive prompt where you type JavaScript and see the result straight away.\n\n```bash\nnode\n```\n\n```text\n>\n```\n\nThen:\n\n```javascript\n> 10 + 20\n30\n```\n\n```javascript\n> const name = \"Rajan\"\n> name\n'Rajan'\n```\n\nGood for checking what a method actually returns without opening a file. Exit with `.exit`, or `Ctrl` + `C` twice.\n\nOne quirk worth knowing: the REPL prints the value of every expression, so `console.log(\"hi\")` shows `hi` and then `undefined`, because that is what `console.log` returns.\n\n---\n\n## `node --eval`\n\nRun JavaScript straight from the terminal, no file needed:\n\n```bash\nnode --eval \"console.log(10 + 20)\"\n```\n\n```text\n30\n```\n\nShort form:\n\n```bash\nnode -e \"console.log('Hello')\"\n```\n\nUse single quotes inside, since the shell already took the double quotes. Handy in scripts and CI, where you want one line of JavaScript without a file to maintain.\n\n---\n\n## `node --watch`\n\nTutorials often tell you to install `nodemon` to restart on save. Modern Node has this built in:\n\n```bash\nnode --watch app.js\n```\n\n```text\napp.js changes\n      ↓\nNode detects change\n      ↓\nNode restarts\n```\n\nSo for basic development you do not need:\n\n```bash\nnpm install nodemon\n```\n\nIt follows whatever your file imports, so editing `src/routes.js` restarts a server started as `src/server.js`:\n\n```bash\nnode --watch src/server.js\n```\n\n---\n\n## `node --env-file`\n\nNode can read a `.env` file itself. You do not need the `dotenv` package just to load one.\n\nCreate `.env`:\n\n```text\nAPP_NAME=My Node App\nPORT=3000\n```\n\nRun:\n\n```bash\nnode --env-file=.env app.js\n```\n\nAnd read them:\n\n```javascript\nconsole.log(process.env.APP_NAME);\nconsole.log(process.env.PORT);\n```\n\n```text\nMy Node App\n3000\n```\n\nTwo things to remember. `.env` goes in `.gitignore`, always, because that is where secrets end up. And `--env-file` is a flag for <b>Node</b>, so it goes before your script name, not after.\n\n```bash\nnode --env-file=.env app.js       # correct\nnode app.js --env-file=.env       # wrong: Node ignores it,\n                                  # your script gets it as an argument\n```\n\nBoth of these flags need a reasonably recent Node. `--env-file` arrived in 20.6, `--watch` in 18.11. Another reason to be on a current LTS rather than whatever an old tutorial installed.",
      diagram: `Five ways to run JavaScript

    node app.js                  a file, top to bottom
    node                         REPL, interactive prompt
    node -e "..."                one line, no file
    node --watch app.js          restart on save
    node --env-file=.env app.js  load .env first


Flag order matters

    node --env-file=.env app.js Rajan
         └──────┬───────┘ └─┬─┘ └─┬─┘
          Node's flags    script  your
          (before the     name    args
           script name)

    node app.js --env-file=.env
                └────────┬──────┘
                 too late: Node already started,
                 this is just an argument to your script


--watch replaces nodemon

    edit src/routes.js
          ↓
    Node notices (it tracks what your entry file imports)
          ↓
    restart src/server.js
          ↓
    .env reloaded too

    No npm install nodemon. No npm install dotenv.`,
      codeExample: {
        title: "The five commands, and the flags that matter",
        code: `# ── 1. Run a file ───────────────────────────────────────────
# app.js:  console.log("Hello Node.js!");
node app.js
# → Hello Node.js!


# ── 2. The REPL: try things without a file ──────────────────
node
# > 10 + 20
# 30
# > const name = "Rajan"
# undefined            ← a declaration evaluates to undefined
# > name
# 'Rajan'
# > [1, 2, 3].map(n => n * 2)
# [ 2, 4, 6 ]
# > .exit               ← or Ctrl+C twice


# ── 3. --eval: one line, no file ────────────────────────────
node --eval "console.log(10 + 20)"
# → 30

node -e "console.log('Hello')"
# single quotes inside, the shell took the doubles

node -e "console.log(process.version)"
# handy in CI: check the version without a script


# ── 4. --watch: restart on save (no nodemon) ────────────────
node --watch app.js
node --watch src/server.js
# edits to anything server.js imports trigger a restart


# ── 5. --env-file: load .env (no dotenv) ────────────────────
# .env:
#   APP_NAME=My Node App
#   PORT=3000

node --env-file=.env app.js
# inside app.js:
#   console.log(process.env.APP_NAME);   // My Node App
#   console.log(process.env.PORT);       // 3000   (a string!)


# ── Flags go BEFORE the script name ─────────────────────────
node --env-file=.env --watch app.js Rajan     # correct
# node app.js --env-file=.env                 # wrong: ignored by Node


# ── And .env never goes in git ──────────────────────────────
echo ".env" >> .gitignore`,
      },
      keyTakeaways: [
        "`node app.js` runs a file top to bottom. No build step, no config.",
        "`node` alone opens the <b>REPL</b>, which prints the value of every expression you type.",
        "`node -e \"...\"` runs one line without a file. Useful in scripts and CI.",
        "`node --watch app.js` restarts on save, so basic development needs no `nodemon`.",
        "`node --env-file=.env app.js` loads environment variables, so it needs no `dotenv`.",
        "Node's flags go <b>before</b> the script name. After it, they are just arguments to your program.",
        "`.env` belongs in `.gitignore`. That is where secrets live.",
        "`--env-file` needs Node 20.6+, `--watch` needs 18.11+. One more reason to be on a current LTS.",
      ],
      commonMistakes: [
        "<b>Putting `--env-file` after the script name</b> — Node ignores it and your program receives it as an argument. Nothing loads, and there is no error.",
        "<b>Installing `nodemon` and `dotenv` out of habit</b> — modern Node covers both for a basic setup. Reach for the packages when you need what they add.",
        "<b>Committing `.env`</b> — the single most common way to leak a database URL or API key.",
        "<b>Expecting `process.env.PORT` to be a number</b> — every environment variable is a string. `\"3000\"`, not `3000`.",
        "<b>Quoting `-e` code with the same quotes twice</b> — the shell eats the outer pair. Use double outside, single inside.",
        "<b>Being surprised the REPL prints `undefined`</b> — it shows the value of each expression, and `const x = 1` evaluates to `undefined`.",
      ],
      quiz: [
        {
          question: "What happens if you run `node app.js --env-file=.env`?",
          options: [
            "The `.env` file loads normally",
            "Node throws an \"unknown flag\" error",
            "Node ignores the flag and your script receives it as an argument",
            "The variables load, but only after the script finishes",
          ],
          correctIndex: 2,
          explanation:
            "`--env-file` is a flag for Node itself, so it has to come before the script name. Placed after, it silently becomes an entry in `process.argv` and nothing loads. No error, which is what makes it easy to miss.",
        },
        {
          question: "`PORT=3000` is in your `.env`. What is `typeof process.env.PORT`?",
          options: ["`\"number\"`", "`\"string\"`", "`\"undefined\"`", "It depends on the Node version"],
          correctIndex: 1,
          explanation:
            "Environment variables are always strings. You get `\"3000\"`, so wrap it in `Number(...)` before doing arithmetic or comparing it to a number.",
        },
        {
          question: "Which two npm packages does modern Node make unnecessary for a basic development setup?",
          options: [
            "`express` and `cors`",
            "`nodemon` and `dotenv`",
            "`jest` and `supertest`",
            "`ts-node` and `typescript`",
          ],
          correctIndex: 1,
          explanation:
            "`--watch` covers restart-on-save and `--env-file` covers loading a `.env`. Both packages still do more than the flags, but you do not need them just to get started.",
        },
      ],
    },
    {
      id: "process-object",
      title: "The process object — env, argv, exit and exit codes",
      durationMinutes: 10,
      explanation:
        "`process` is a global object describing the running Node.js program. Four parts of it matter on Day 1.\n\n---\n\n## `process.env`\n\n<b>`process.env`</b> (an object holding the environment variables available to this process).\n\n```javascript\nconsole.log(process.env.NODE_ENV);\n```\n\nYou can set one just for a single run:\n\n```bash\nNODE_ENV=production node app.js\n```\n\nand then:\n\n```javascript\nconsole.log(process.env.NODE_ENV);\n```\n\nprints:\n\n```text\nproduction\n```\n\nThis is where configuration lives:\n\n```text\nDatabase URLs\nAPI keys\nEnvironment names\nPort numbers\nApplication configuration\n```\n\nThe reason is simple. The same code has to run on your laptop, in CI and in production, with different values each time. Anything that changes between those places belongs in the environment, not in the source.\n\nRemember every value is a <b>string</b>:\n\n```javascript\nconst port = Number(process.env.PORT) || 3000;\n```\n\n---\n\n## `process.argv`\n\n<b>`process.argv`</b> (an array of the command-line arguments passed to your program).\n\n```javascript\nconsole.log(process.argv);\n```\n\n```bash\nnode app.js Rajan\n```\n\nWhat you get:\n\n```text\nprocess.argv\n     ↓\n[\n  node path,\n  script path,\n  \"Rajan\"\n]\n```\n\nThe first two slots are always the Node executable and your script. <b>Your arguments start at index 2.</b>\n\n```javascript\nconst name = process.argv[2];\n\nconsole.log(name);\n```\n\n```bash\nnode app.js Rajan\n```\n\n```text\nRajan\n```\n\nA cleaner way to take everything the user passed:\n\n```javascript\nconst [name, city] = process.argv.slice(2);\n```\n\nThis is the front door of every CLI tool you will build.\n\n---\n\n## `process.exit()`\n\n<b>`process.exit()`</b> (ends the process immediately, with a given exit code).\n\n```javascript\nconsole.log(\"Starting...\");\n\nprocess.exit(0);\n\nconsole.log(\"This will not run\");\n```\n\n\"Immediately\" is the important word. Pending writes and unfinished callbacks are abandoned. In a server you normally want to close connections and let the process end naturally. `process.exit()` is for scripts and CLI tools, where stopping right now is the point.\n\n---\n\n## Exit codes\n\n<b>Exit code</b> (a number telling the operating system whether the program succeeded).\n\n```text\n0        → Success\nNon-zero → Something went wrong\n```\n\nSo:\n\n```javascript\nprocess.exit(0);   // completed successfully\nprocess.exit(1);   // failed\n```\n\nThis looks like a detail until something else is reading it:\n\n• Docker restarts a container based on it\n• CI/CD marks a build red or green by it\n• Kubernetes decides whether a pod is healthy\n• A shell script's `&&` only continues on `0`\n• A process manager decides whether to restart your app\n\nGetting it wrong has a specific failure mode: a script that prints \"error\" and exits `0` looks like a success to everything around it, and a broken deploy sails straight through CI.\n\nAn uncaught exception exits with `1` on its own, so the common mistake is not forgetting to fail, but accidentally swallowing an error and exiting `0` anyway.",
      diagram: `process.argv is always shifted by two

    node app.js Rajan Kathmandu

    process.argv
    ┌───┬──────────────────────┬──────────┬──────────────┐
    │ 0 │ /path/to/node        │  ← the executable       │
    │ 1 │ /path/to/app.js      │  ← your script          │
    │ 2 │ "Rajan"              │  ← your first argument  │
    │ 3 │ "Kathmandu"          │                         │
    └───┴──────────────────────┴──────────┴──────────────┘

    process.argv.slice(2)  →  ["Rajan", "Kathmandu"]


Configuration comes from outside the code

    same source code
          │
    ┌─────┼─────────────┬──────────────┐
    ↓     ↓             ↓              ↓
  laptop  CI        staging       production
  PORT=3000  PORT=3000   PORT=8080    PORT=8080
  DB=local   DB=test     DB=staging   DB=prod

    Anything that differs belongs in process.env.


Exit codes: who is listening

    process.exit(0)   ──►  success
    process.exit(1)   ──►  failure

         │
         ├── CI/CD          green or red build
         ├── Docker         restart the container?
         ├── Kubernetes     is this pod healthy?
         ├── shell &&       continue or stop
         └── pm2 / systemd  restart the app?

    Printing "error" but exiting 0 = a broken deploy
    that passes CI.`,
      codeExample: {
        title: "A tiny CLI, using all four",
        code: `// greet.js
//   node --env-file=.env greet.js Rajan

// ── process.argv: what the user typed ───────────────────────
console.log(process.argv);
// [ "/path/to/node", "/path/to/greet.js", "Rajan" ]
//   0                1                    2  ← yours start here

const [name, city] = process.argv.slice(2);

// ── process.env: configuration from outside ─────────────────
const greeting = process.env.GREETING ?? "Hello";
const port = Number(process.env.PORT) || 3000;   // env values are strings

console.log(typeof process.env.PORT);            // "string"
console.log(typeof port);                        // "number"

// ── process.exit: stop now, with a verdict ──────────────────
if (!name) {
  console.error("Please provide a name.");
  process.exit(1);                    // non-zero: this run failed
}

console.log(\`\${greeting}, \${name}!\`);
if (city) console.log(\`Greetings from \${city}\`);

// falling off the end exits 0 on its own — no need to say so


// ── Setting an env var for one run ──────────────────────────
// NODE_ENV=production node greet.js Rajan
// → process.env.NODE_ENV === "production"


// ── Why the code matters: the shell is listening ────────────
// node greet.js Rajan && echo "worked"
//   → Hello, Rajan!
//   → worked
//
// node greet.js && echo "worked"
//   → Please provide a name.
//   → (nothing: exit 1 stopped the &&)


// ── The mistake to avoid ────────────────────────────────────
// try {
//   await deploy();
// } catch (error) {
//   console.error(error.message);     // logs the failure...
// }                                   // ...then exits 0 anyway.
// CI sees a green build. Always re-throw or process.exit(1).`,
      },
      keyTakeaways: [
        "`process` is a global object describing the running program. No import needed.",
        "`process.env` holds environment variables, and every value is a <b>string</b>.",
        "Anything that differs between laptop, CI and production belongs in the environment, not the source.",
        "`process.argv[0]` is Node and `[1]` is your script. <b>Your arguments start at index 2.</b>",
        "`process.argv.slice(2)` is the clean way to read what the user passed.",
        "`process.exit()` ends the process immediately, abandoning pending work. Use it in scripts, not servers.",
        "Exit code `0` means success, anything else means failure.",
        "CI, Docker, Kubernetes, process managers and shell `&&` all read that code.",
        "Logging an error and still exiting `0` is how a broken deploy passes CI.",
      ],
      commonMistakes: [
        "<b>Reading `process.argv[0]` for the first argument</b> — that is the Node executable. Yours start at index 2.",
        "<b>Treating an env var as a number</b> — `process.env.PORT + 1` gives `\"30001\"`, not `3001`. Wrap it in `Number(...)`.",
        "<b>Using `||` for an env default</b> — `process.env.RETRIES || 3` throws away a deliberate `0`. `??` respects it.",
        "<b>Calling `process.exit()` in a server</b> — it kills in-flight requests and pending writes. Close things down and let the process end.",
        "<b>Catching an error, logging it, and exiting `0`</b> — everything downstream reads that as success.",
        "<b>Hardcoding config that differs by environment</b> — a database URL in the source has to be edited to deploy, which is how the wrong one reaches production.",
      ],
      quiz: [
        {
          question: "You run `node app.js Rajan`. Where is `\"Rajan\"` in `process.argv`?",
          options: ["Index 0", "Index 1", "Index 2", "It is not in `argv`, it is in `process.env`"],
          correctIndex: 2,
          explanation:
            "Index 0 is the Node executable and index 1 is your script path, so user arguments always start at 2. `process.argv.slice(2)` skips the first two for you.",
        },
        {
          question: "A deploy script catches an error, logs it with `console.error`, and then finishes normally. What does CI see?",
          options: [
            "A failed build, because something was logged to stderr",
            "A passing build, because the exit code was 0",
            "A failed build, because the exception was caught",
            "Nothing, the build hangs",
          ],
          correctIndex: 1,
          explanation:
            "CI reads the exit code, not your logs. Catching the error and finishing normally exits `0`, so a broken deploy passes. Re-throw, or call `process.exit(1)`.",
        },
        {
          question: "`PORT=3000` is set in the environment. What does `process.env.PORT + 1` produce?",
          options: ["`3001`", "`\"30001\"`", "`NaN`", "A TypeError"],
          correctIndex: 1,
          explanation:
            "Environment values are strings, so `+` concatenates instead of adding. `Number(process.env.PORT) + 1` gives you `3001`.",
        },
      ],
    },
    {
      id: "terminal-output",
      title: "Terminal output — stdout, stderr and styleText",
      durationMinutes: 8,
      explanation:
        "Your program's output is not one stream, it is two. That distinction matters as soon as the program runs anywhere other than your own terminal.\n\n---\n\n## `console.log()` vs `console.error()`\n\nThese are not the same thing, even though both appear in your terminal.\n\n### `console.log()`\n\nNormal output:\n\n```javascript\nconsole.log(\"Server started\");\n```\n\nThis goes to <b>stdout</b>.\n\n### `console.error()`\n\nErrors and diagnostics:\n\n```javascript\nconsole.error(\"Database connection failed\");\n```\n\nThis goes to <b>stderr</b>.\n\n```text\nstdout\n   ↓\nNormal program output\n\nstderr\n   ↓\nErrors / diagnostic output\n```\n\nOn your laptop both land in the same window, so the difference looks academic. It stops being academic when something else is reading your output:\n\n• Docker and Kubernetes collect them separately\n• Log aggregators route stderr to alerts and stdout to storage\n• CI highlights stderr in the build log\n• The shell can redirect one and not the other\n\n```bash\nnode app.js > output.log 2> errors.log\n```\n\nThat is the whole payoff: `>` captures stdout, `2>` captures stderr. If every message went through `console.log`, your errors would be buried in the middle of ordinary output, unfindable and un-alertable.\n\nThe rule is short: <b>anything that represents a problem goes to `console.error`</b>. Everything else uses `console.log`.\n\n---\n\n## `util.styleText()`\n\n<b>`util.styleText()`</b> (a built-in utility that applies terminal styles such as colours).\n\n```javascript\nimport { styleText } from \"node:util\";\n\nconsole.log(\n  styleText(\"green\", \"Server started successfully\"),\n);\n```\n\nStyles you can use:\n\n```text\nred\ngreen\nyellow\nblue\nbold\nunderline\n```\n\n```javascript\nimport { styleText } from \"node:util\";\n\nconsole.log(styleText(\"green\", \"SUCCESS\"));\nconsole.log(styleText(\"yellow\", \"WARNING\"));\nconsole.log(styleText(\"red\", \"ERROR\"));\n```\n\nYou can combine styles by passing an array:\n\n```javascript\nconsole.log(styleText([\"red\", \"bold\"], \"FATAL\"));\n```\n\nThis is built in, so it replaces reaching for `chalk` on small projects. Useful for:\n\n• CLI applications\n• Development tools\n• Scripts\n• Build tools\n• Terminal dashboards\n\nOne thing it does for you: `styleText` checks whether the output is actually a terminal. When your output is piped to a file or collected by a log system, it skips the colour codes rather than filling your logs with `\\u001b[32m` noise. That is the difference between this and pasting escape codes yourself.\n\nColour is for humans reading a terminal. Do not use it to carry meaning your program depends on, and never rely on it in production logs, where it is stripped anyway.",
      diagram: `Two streams, not one

    your program
         │
         ├── console.log   ──►  stdout  ──►  normal output
         │                                   results, progress
         │
         └── console.error ──►  stderr  ──►  problems
                                             errors, warnings

    Same window on your laptop.
    Separate everywhere else.


Why it matters: they can be split

    node app.js > output.log 2> errors.log
                 └───┬────┘  └────┬─────┘
                   stdout       stderr

    Docker            collects them separately
    log aggregators   stderr → alerts, stdout → storage
    CI                highlights stderr in the build log

    All console.log = errors buried, nothing alertable.


styleText knows where it is writing

    to a terminal        →  styleText("green", "OK")  →  green OK
    piped to a file      →  styleText("green", "OK")  →  OK

    It strips the codes when the output is not a TTY,
    so your log files stay clean.`,
      codeExample: {
        title: "Output that survives leaving your laptop",
        code: `import { styleText } from "node:util";

// ── The two streams ─────────────────────────────────────────
console.log("Server started on port 3000");        // stdout: normal
console.error("Database connection failed");       // stderr: a problem

// console.warn also goes to stderr
console.warn("Deprecated config key: DB_HOST");

// Split them at the shell:
//   node app.js > output.log 2> errors.log
//   node app.js 2>&1 | tee combined.log


// ── styleText: built in, no chalk needed ────────────────────
console.log(styleText("green", "SUCCESS"));
console.log(styleText("yellow", "WARNING"));
console.log(styleText("red", "ERROR"));

// combine styles with an array
console.log(styleText(["red", "bold"], "FATAL"));
console.log(styleText(["blue", "underline"], "https://example.com"));


// ── Colour AND the right stream ─────────────────────────────
function ok(message) {
  console.log(styleText("green", \`✓ \${message}\`));
}

function fail(message) {
  console.error(styleText(["red", "bold"], \`✗ \${message}\`));
}

ok("Config loaded");
fail("Could not reach the database");

// Colour is for the human. The stream is for the machine.
// styleText drops the codes when output is piped, so the
// log file gets "✗ Could not reach the database", not escape noise.


// ── What not to do ──────────────────────────────────────────
// console.log("ERROR: database is down");
//   → goes to stdout, so no alert fires and it is buried
//     in the middle of ordinary output`,
      },
      keyTakeaways: [
        "`console.log` writes to <b>stdout</b>, `console.error` writes to <b>stderr</b>. `console.warn` also goes to stderr.",
        "Both look the same in your terminal. Everything else treats them as two separate streams.",
        "`node app.js > output.log 2> errors.log` is the payoff: they can be captured separately.",
        "Docker, Kubernetes, CI and log aggregators route stderr differently. Alerts usually come from it.",
        "Anything representing a problem goes to `console.error`. Everything else to `console.log`.",
        "`util.styleText(style, text)` colours terminal output, built in, no `chalk` needed.",
        "Pass an array to combine styles: `styleText([\"red\", \"bold\"], \"FATAL\")`.",
        "`styleText` strips the codes when output is not a terminal, so piped logs stay clean.",
      ],
      commonMistakes: [
        "<b>Using `console.log` for errors</b> — they land in stdout, so no alert fires and they are buried in ordinary output.",
        "<b>Assuming the two streams are ordered relative to each other</b> — when redirected separately, interleaving is not guaranteed.",
        "<b>Using colour to carry meaning</b> — it is stripped in logs and invisible to anyone piping your output. Say \"ERROR\" in the text too.",
        "<b>Installing `chalk` for a small script</b> — `styleText` is built in and handles the non-terminal case for you.",
        "<b>Hand-writing ANSI escape codes</b> — they end up in log files as `\\u001b[32m` noise. `styleText` checks first.",
        "<b>Logging inside a tight loop</b> — console writes are synchronous to a terminal and will slow the whole thing down.",
      ],
      quiz: [
        {
          question: "Your app logs every message with `console.log`, including failures. What breaks once it runs in production?",
          options: [
            "Nothing, the messages all still appear",
            "Errors land in stdout, so alerting on stderr never fires",
            "The logs are colourless",
            "Node refuses to start without stderr",
          ],
          correctIndex: 1,
          explanation:
            "Log systems separate the two streams and usually alert on stderr. Sending errors through stdout buries them in ordinary output and nothing raises a flag.",
        },
        {
          question: "What does `styleText` do when its output is piped to a file rather than a terminal?",
          options: [
            "Writes the ANSI escape codes anyway",
            "Throws an error",
            "Skips the styling and writes plain text",
            "Strips the text and keeps the codes",
          ],
          correctIndex: 2,
          explanation:
            "It checks whether the destination is a terminal first, so piped output stays clean instead of filling up with escape sequences. That is the main advantage over writing the codes yourself.",
        },
      ],
    },
    {
      id: "putting-it-together",
      title: "Putting it together — a real Day 1 project",
      durationMinutes: 10,
      explanation:
        "Everything from today, in one small program.\n\n```text\nhello-node/\n├── .env\n├── .nvmrc\n└── app.js\n```\n\n---\n\n## `.nvmrc`\n\n```text\n24\n```\n\n---\n\n## `.env`\n\n```text\nGREETING=Hello\n```\n\n---\n\n## `app.js`\n\n```javascript\nimport { styleText } from \"node:util\";\n\nconst name = process.argv[2];\nconst greeting = process.env.GREETING;\n\nif (!name) {\n  console.error(\n    styleText(\"red\", \"Please provide a name.\"),\n  );\n\n  process.exit(1);\n}\n\nconsole.log(\n  styleText(\n    \"green\",\n    `${greeting}, ${name}!`,\n  ),\n);\n```\n\nRun it:\n\n```bash\nnode --env-file=.env app.js Rajan\n```\n\n```text\nHello, Rajan!\n```\n\nin green.\n\nCount what is in those fifteen lines: a pinned Node version, environment configuration, a command-line argument, an error path on stderr, a non-zero exit code, and styled output. That is the whole of Day 1, and it is the skeleton of every CLI tool you will write.\n\nOne note: `app.js` uses `import`, which needs `\"type\": \"module\"` in `package.json` or a `.mjs` extension. Day 2 covers why, and what the alternative looks like.\n\n---\n\n## The development command\n\nCombine the two flags while you work:\n\n```bash\nnode --watch --env-file=.env app.js Rajan\n```\n\n```text\nChange app.js\n     ↓\nNode detects change\n     ↓\nNode restarts\n     ↓\n.env is loaded\n```\n\nNo `nodemon`, no `dotenv`, no configuration file. Worth putting in `package.json` so nobody has to remember it:\n\n```javascript\n{\n  \"scripts\": {\n    \"dev\": \"node --watch --env-file=.env app.js\",\n    \"start\": \"node app.js\"\n  }\n}\n```\n\nThen it is just `npm run dev`.\n\n---\n\n## What you should remember\n\nDo not try to memorise Day 1. Hold the mental model.\n\n```text\n                    Node.js\n                       │\n        ┌──────────────┼──────────────┐\n        ↓              ↓              ↓\n       V8          C++ / OS      Standard Library\n        │                             │\n   JavaScript                  fs, http, util...\n        │\n        ↓\n    Event Loop\n        │\n        ↓\n Non-blocking I/O\n```\n\nFor running things:\n\n```text\nnode app.js\n     │\n     ├── process.argv\n     ├── process.env\n     ├── process.exit()\n     ├── console.log()\n     └── console.error()\n```\n\nAnd for development:\n\n```text\n.nvmrc\n  ↓\nNode version\n\n--watch\n  ↓\nAutomatic restart\n\n--env-file\n  ↓\nEnvironment variables\n```\n\nIf you can explain why Node.js is single threaded and still handles thousands of connections, you have the part that matters. The flags you will remember by using them.",
      diagram: `The whole of Day 1, in one project

    hello-node/
    ├── .nvmrc      "24"              ← pinned version
    ├── .env        GREETING=Hello    ← config, gitignored
    └── app.js                        ← the program

    node --watch --env-file=.env app.js Rajan
         └──┬──┘ └──────┬───────┘ └──┬──┘ └─┬─┘
        restart      loads .env    script   argv[2]
        on save


    app.js, line by line

    import { styleText } from "node:util"   ← standard library
    const name = process.argv[2]            ← CLI input
    const greeting = process.env.GREETING   ← config input

    if (!name) {
      console.error(...)                    ← stderr, not stdout
      process.exit(1)                       ← non-zero: failed
    }

    console.log(styleText("green", ...))    ← stdout, styled


The mental model to keep

                     Node.js
                        │
         ┌──────────────┼──────────────┐
         ↓              ↓              ↓
        V8         C++ / OS      Standard library
         │                             │
    JavaScript                  fs, http, util...
         │
         ↓
     Event loop
         │
         ↓
   Non-blocking I/O

    If you can explain why one thread serves thousands
    of connections, you have the part that matters.`,
      codeExample: {
        title: "hello-node, complete",
        code: `// ── .nvmrc ──────────────────────────────────────────────────
// 24

// ── .env  (add .env to .gitignore) ──────────────────────────
// GREETING=Hello
// NODE_ENV=development

// ── package.json ────────────────────────────────────────────
// {
//   "name": "hello-node",
//   "type": "module",                     // so import works
//   "scripts": {
//     "dev": "node --watch --env-file=.env app.js",
//     "start": "node app.js"
//   },
//   "engines": { "node": ">=24" }
// }

// ── app.js ──────────────────────────────────────────────────
import { styleText } from "node:util";

const name = process.argv[2];
const greeting = process.env.GREETING ?? "Hello";
const environment = process.env.NODE_ENV ?? "development";

if (!name) {
  console.error(styleText("red", "Please provide a name."));
  console.error(styleText("yellow", "Usage: node app.js <name>"));
  process.exit(1);                        // non-zero: this run failed
}

console.log(styleText("green", \`\${greeting}, \${name}!\`));
console.log(styleText(["blue", "bold"], \`Environment: \${environment}\`));

// falling off the end exits 0


// ── Running it ──────────────────────────────────────────────
// node --env-file=.env app.js Rajan
//   → Hello, Rajan!            (green)
//   → Environment: development (blue, bold)
//
// node --env-file=.env app.js
//   → Please provide a name.   (red, on stderr)
//   → Usage: node app.js <name>
//   → exit code 1
//
// While developing:
//   npm run dev`,
      },
      keyTakeaways: [
        "Fifteen lines can use a pinned version, env config, a CLI argument, stderr, an exit code and styled output.",
        "`node --watch --env-file=.env app.js` is the development command. No `nodemon`, no `dotenv`, no config file.",
        "Put it in `package.json` as a `dev` script so nobody has to remember the flags.",
        "`import` needs `\"type\": \"module\"` in `package.json`, or a `.mjs` file. Day 2 explains why.",
        "The mental model: V8 runs the JavaScript, the C++ layer reaches the OS, the standard library is built in, and the event loop keeps the one thread free.",
        "If you can explain why one thread serves thousands of connections, you have the part that matters. The flags come with practice.",
      ],
      commonMistakes: [
        "<b>Using `import` without `\"type\": \"module\"`</b> — you get `Cannot use import statement outside a module`. Add the field or rename to `.mjs`.",
        "<b>Forgetting `.env` in `.gitignore`</b> — do it before the first commit, not after the key leaks.",
        "<b>Exiting `0` on the error path</b> — the whole point of `process.exit(1)` is that the shell and CI can tell it failed.",
        "<b>Leaving the flags undocumented</b> — without a `dev` script, the next person runs `node app.js` and wonders why config is missing.",
        "<b>Trying to memorise every flag from Day 1</b> — hold the mental model. The flags stick through use.",
      ],
      quiz: [
        {
          question: "`app.js` starts with `import { styleText } from \"node:util\"` and you run `node app.js`. It fails with \"Cannot use import statement outside a module\". Why?",
          options: [
            "`styleText` does not exist in this Node version",
            "`package.json` is missing `\"type\": \"module\"`",
            "`import` only works with `--watch`",
            "`node:util` needs installing first",
          ],
          correctIndex: 1,
          explanation:
            "Node treats `.js` as CommonJS unless `package.json` says `\"type\": \"module\"`. Add that field, or name the file `.mjs`. Day 2 covers the two module systems properly.",
        },
        {
          question: "Which single command gives you restart-on-save and `.env` loading, with nothing installed?",
          options: [
            "`nodemon --env-file=.env app.js`",
            "`node --watch --env-file=.env app.js`",
            "`node app.js --watch --env-file=.env`",
            "`npx dotenv node --watch app.js`",
          ],
          correctIndex: 1,
          explanation:
            "Both flags are built into Node, and both must come before the script name. Placed after, they are just arguments to your program and nothing happens.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which component of Node.js executes your JavaScript, and which one reads a file?",
      options: [
        "V8 does both",
        "V8 executes JavaScript, the C/C++ layer reads the file",
        "The standard library does both",
        "The event loop executes JavaScript, V8 reads the file",
      ],
      correctIndex: 1,
      explanation:
        "V8 only evaluates JavaScript. Anything touching the operating system, files included, goes through Node's own C/C++ layer underneath the `fs` API.",
    },
    {
      question: "Node.js is single threaded. Why can it still serve thousands of connections?",
      options: [
        "It creates a thread per connection behind the scenes",
        "JavaScript runs faster than other languages",
        "It hands off waiting instead of blocking, so the thread is never idle",
        "V8 splits the work across CPU cores",
      ],
      correctIndex: 2,
      explanation:
        "Nearly all of a server's time is spent waiting on disks, databases and networks. Node hands those waits to the OS and keeps the thread busy with other work, picking results up through the event loop.",
    },
    {
      question: "Which command correctly loads a `.env` file and restarts on save?",
      options: [
        "`node app.js --watch --env-file=.env`",
        "`node --watch --env-file=.env app.js`",
        "`node --watch app.js --env-file=.env`",
        "`nodemon --env-file=.env app.js`",
      ],
      correctIndex: 1,
      explanation:
        "Node's own flags must come before the script name. Anything after it is passed to your program as an argument, so the flag is silently ignored and nothing loads.",
    },
    {
      question: "`node app.js Rajan`. Which expression gives you `\"Rajan\"`?",
      options: ["`process.argv[0]`", "`process.argv[1]`", "`process.argv[2]`", "`process.env.argv`"],
      correctIndex: 2,
      explanation:
        "Index 0 is the Node executable, index 1 is the script path, so user arguments start at 2. `process.argv.slice(2)` gives you just yours.",
    },
    {
      question: "A script prints a failure with `console.error` and then finishes normally. What does CI conclude?",
      options: [
        "The build failed, because stderr was written to",
        "The build passed, because the exit code was 0",
        "The build failed, because an error object existed",
        "CI ignores the script entirely",
      ],
      correctIndex: 1,
      explanation:
        "CI reads the exit code, not the logs. Finishing normally exits `0`, so the failure passes as a success. Call `process.exit(1)` or let the error throw.",
    },
    {
      question: "Why pin a Node version with `.nvmrc` and commit it?",
      options: [
        "It makes Node start faster",
        "npm needs it to resolve dependencies",
        "So every developer, CI and production run the same major version",
        "It replaces `package.json`",
      ],
      correctIndex: 2,
      explanation:
        "Without a pin you get one version on your laptop, another in CI and a third in production, which is how a bug ends up reproducing on exactly one machine.",
    },
  ],
  project: {
    name: "node-day-01",
    goal: "Build a small CLI greeter that reads its input from the command line and its configuration from the environment.",
    brief:
      "Build this yourself, without copying the finished solution above. It is deliberately small, because the point is not the program. The point is that you have pinned a Node version, loaded configuration from outside your code, read a command-line argument, written to the right output stream, and exited with a code something else could act on. Every CLI tool and every server you write from here starts with those same pieces.",
    steps: [
      "Create the folder `node-day-01/` with three files: `.nvmrc`, `.env` and `app.js`.",
      "Put your Node major version in `.nvmrc`, then run `nvm use` (or `fnm use`) in that folder to confirm it switches.",
      "Put `GREETING=...` in `.env`, and add `.env` to `.gitignore` before you commit anything.",
      "In `app.js`, read the name from `process.argv` and the greeting from `process.env`.",
      "Print the successful greeting in colour using `styleText` from `node:util`.",
      "If no name was given, print an error with `console.error` and exit with a non-zero code.",
      "Run it with `node --env-file=.env app.js Rajan` and confirm you get a coloured greeting.",
      "Run it again with `node --watch --env-file=.env app.js Rajan`, edit the file, and watch it restart.",
    ],
    acceptance: [
      "`node --env-file=.env app.js Rajan` prints a coloured greeting using the value from `.env`.",
      "`node --env-file=.env app.js` prints an error and nothing else.",
      "The error goes to stderr, so `node --env-file=.env app.js 2> errors.log` captures it in the file and shows nothing in the terminal.",
      "The failure path exits non-zero: `node --env-file=.env app.js && echo worked` does not print `worked`.",
      "The success path exits zero: `node --env-file=.env app.js Rajan && echo worked` does print `worked`.",
      "`nvm use` inside the folder switches to the version in `.nvmrc`.",
      "`node --watch` restarts the program when you save `app.js`.",
      "Nothing was installed. No `nodemon`, no `dotenv`, no `chalk`.",
    ],
    stretch: [
      "Add `NODE_ENV=development` to `.env` and print `Environment: development` in a different style.",
      "Accept a second argument (a city, say) and include it only when it was given.",
      "Add a `dev` script to `package.json` so `npm run dev` runs the full watch command.",
      "Print a usage line on the error path, so someone who gets it wrong knows what to type.",
    ],
  },
};
