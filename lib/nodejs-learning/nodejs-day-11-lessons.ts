import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_11_LESSONS: LessonDay = {
  day: 11,
  title: "Child processes, workers and the shell",
  totalMinutes: 88,
  difficulty: "Advanced",
  lessons: [
    {
      id: "process-vs-thread",
      title: "Process vs thread",
      durationMinutes: 8,
      explanation:
        "This is where Node starts interacting with the <b>operating system itself</b>.\n\nSo far we have stayed inside one process:\n\n```text\nNode.js process\n├── JavaScript\n├── Event loop\n├── async I/O\n└── HTTP server\n```\n\nNow: running another program, talking to another process, executing shell commands, moving CPU work off the main thread, and using more than one core.\n\nThe distinction that decides everything:\n\n```text\nI/O-heavy work\n     ↓\nasync I/O\n\nCPU-heavy work\n     ↓\nWorker Threads\n\nSeparate program/process\n     ↓\nChild Process\n```\n\n---\n\n## Process\n\n<b>Process</b> (an independent running program with its own memory space).\n\n```text\nYour application\n     ↓\nNode process\n```\n\nYou can have:\n\n```text\nProcess A\nProcess B\nProcess C\n```\n\nEach has its own memory.\n\n---\n\n## Thread\n\n<b>Thread</b> (a unit of execution inside a process).\n\nOne process can hold several:\n\n```text\nNode Process\n   │\n   ├── Main Thread\n   ├── Worker Thread\n   └── Worker Thread\n```\n\nWorker threads can run CPU-heavy JavaScript in parallel.\n\n---\n\n## What actually follows from that\n\nThe definitions are easy. The consequences are what you will reason about all day, and there are three.\n\n<b>Isolation.</b> Separate memory means a crashing process cannot corrupt yours. A crashing thread takes the whole process down with it, because they share an address space.\n\n<b>Cost.</b> A process is expensive to start, roughly tens of milliseconds, and carries its own copy of the runtime. A thread is cheaper but not free: a Node worker still spins up a fresh V8 isolate, which is a few milliseconds and a few megabytes. Neither is something to create per request.\n\n<b>Communication.</b> Threads can share memory directly. Processes cannot, so everything between them is copied through a channel. That difference is why passing a large payload to a child process costs real time and passing it to a worker need not.\n\nSo the trade is the same one it always is:\n\n```text\nProcess    more isolation, more cost, copied messages\nThread     less isolation, less cost, can share memory\n```\n\nAnd one thing Node already gave you that is neither: <b>async I/O runs on a thread pool you do not manage</b>. When you `await readFile`, libuv is using real OS threads underneath. That is why Node feels parallel for I/O without you ever creating anything, and it is why the first question today is always \"am I waiting, or am I computing?\"",
      diagram: `The two shapes

    PROCESS                       THREAD
    ┌─────────────────────┐       ┌─────────────────────┐
    │ Node process A      │       │  Node process       │
    │ ┌─────────────────┐ │       │  ┌───────────────┐  │
    │ │ its own memory  │ │       │  │ main thread   │  │
    │ └─────────────────┘ │       │  ├───────────────┤  │
    └─────────────────────┘       │  │ worker thread │  │
    ┌─────────────────────┐       │  ├───────────────┤  │
    │ Node process B      │       │  │ worker thread │  │
    │ ┌─────────────────┐ │       │  └───────────────┘  │
    │ │ separate memory │ │       │   shared address    │
    │ └─────────────────┘ │       │   space             │
    └─────────────────────┘       └─────────────────────┘


Three consequences, and they are the whole day

    ISOLATION
      process   a crash cannot touch you
      thread    a crash takes the WHOLE process down

    COST
      process   tens of ms, its own runtime copy
      thread    a few ms, a fresh V8 isolate, a few MB
                └─ cheaper, still not free.
                   neither is per-request work.

    COMMUNICATION
      process   everything is COPIED through a channel
      thread    can share memory directly
                └─ why a large payload to a child costs
                   real time, and to a worker need not


And the one you already had

    await readFile()
        ↓
    libuv uses REAL OS threads underneath

    you never created anything. that is why Node feels
    parallel for I/O.

    which is why the first question today is always:
    "am I waiting, or am I computing?"`,
      codeExample: {
        title: "Measuring the cost of each",
        code: `import { Worker } from "node:worker_threads";
import { spawn } from "node:child_process";
import os from "node:os";

console.log("cores:", os.availableParallelism());


// ── Starting a worker thread ────────────────────────────────
let t = performance.now();
const worker = new Worker("data:text/javascript,", { eval: false });
await new Promise((r) => worker.once("online", r));
console.log("worker start:", Math.round(performance.now() - t), "ms");
await worker.terminate();
//   a few milliseconds, and a few MB for a fresh V8 isolate


// ── Starting a child process ────────────────────────────────
t = performance.now();
const child = spawn(process.execPath, ["--version"]);
await new Promise((r) => child.once("exit", r));
console.log("child start:", Math.round(performance.now() - t), "ms");
//   tens of milliseconds, plus its own copy of the runtime


// ── Neither is per-request work ─────────────────────────────
// app.post("/resize", async (req, res) => {
//   const worker = new Worker("./resize.js");     ✗ per request
//   ...
// });
//
// Under load you are paying the startup cost thousands of
// times. Create a pool once and reuse it.


// ── The one you already had, and never created ──────────────
import { readFile } from "node:fs/promises";

t = performance.now();
await Promise.all([
  readFile("package.json"),
  readFile("package.json"),
  readFile("package.json"),
  readFile("package.json"),
]);
console.log("4 concurrent reads:", Math.round(performance.now() - t), "ms");
//
// libuv used real OS threads for those. You wrote no
// worker code at all.
//
// Which is why the first question is always: am I WAITING
// (Node has it covered) or am I COMPUTING (it does not)?


// ── Isolation, in one line each ─────────────────────────────
// a child process that crashes    →  your process is fine
// a worker thread that crashes    →  "error" event, and an
//                                    uncaught throw inside it
//                                    can take the process down
//
// That is the trade you are making when you pick one.`,
      },
      keyTakeaways: [
        "A <b>process</b> is an independent program with its own memory. A <b>thread</b> runs inside a process.",
        "The definitions are easy. Three consequences are what you actually reason about.",
        "<b>Isolation</b>: a crashing process cannot touch you. A crashing thread shares your address space.",
        "<b>Cost</b>: a process is tens of milliseconds and its own runtime copy. A worker is a few milliseconds and a fresh V8 isolate.",
        "Neither is cheap enough to create per request. Pool them.",
        "<b>Communication</b>: process messages are copied, threads can share memory directly.",
        "That is why a large payload to a child process costs real time, and to a worker need not.",
        "Node already gave you something that is neither: <b>async I/O uses a thread pool you do not manage</b>.",
        "`await readFile` is using real OS threads underneath, with no worker code from you.",
        "So the first question is always: <b>am I waiting, or am I computing?</b>",
      ],
      commonMistakes: [
        "<b>Creating a worker or child per request</b> — you pay the startup cost thousands of times under load.",
        "<b>Reaching for a worker because something is slow</b> — if you are waiting on I/O, Node already handles it.",
        "<b>Assuming a worker crash is contained</b> — it shares the process, so an uncaught throw inside one can take everything down.",
        "<b>Passing a huge payload to a child process</b> — it is serialised and copied, which is real time.",
        "<b>Thinking Node is single-threaded end to end</b> — your JavaScript is. The I/O underneath is not.",
      ],
      quiz: [
        {
          question: "Which question should you answer before reaching for a worker or a child process?",
          options: [
            "How many cores do I have?",
            "Am I waiting on I/O, or burning CPU?",
            "Should I use ESM or CommonJS?",
            "How large is the payload?",
          ],
          correctIndex: 1,
          explanation:
            "Node already parallelises waiting through libuv's thread pool. Workers and child processes exist for the case Node cannot help with, which is computation on the main thread.",
        },
        {
          question: "What is the practical difference in how processes and threads communicate?",
          options: [
            "There is none",
            "Process messages are copied through a channel; threads can share memory directly",
            "Processes are faster to message",
            "Threads cannot communicate",
          ],
          correctIndex: 1,
          explanation:
            "Copying is why sending a large payload to a child process costs measurable time, while a worker can be given shared memory instead and skip the copy entirely.",
        },
      ],
    },
    {
      id: "child-processes-spawn",
      title: "Child processes and spawn",
      durationMinutes: 12,
      explanation:
        "```javascript\nimport {\n  spawn,\n  exec,\n  execFile,\n  fork\n} from \"node:child_process\";\n```\n\nA <b>child process</b> (a separate OS process started by your Node application).\n\n```text\nNode application\n      │\n      │ starts\n      ↓\nOperating system\n      │\n      ↓\nChild process\n```\n\nIt has its own memory and execution environment.\n\n---\n\n## Why start one?\n\nYour application needs to run:\n\n```text\nffmpeg\npython\ngit\nopenssl\nImageMagick\nanother Node program\n```\n\nRather than reimplementing all that:\n\n```text\nNode\n ↓\nstart external program\n ↓\ncommunicate with it\n ↓\nreceive result\n```\n\n---\n\n## `spawn()`\n\n<b>`spawn()`</b> (starts a child process and gives you streams for its input and output).\n\n```javascript\nimport { spawn } from \"node:child_process\";\n\nconst child = spawn(\"node\", [\n  \"--version\"\n]);\n\nchild.stdout.on(\"data\", data => {\n  console.log(data.toString());\n});\n\nchild.stderr.on(\"data\", data => {\n  console.error(data.toString());\n});\n\nchild.on(\"close\", code => {\n  console.log(\"Exited with:\", code);\n});\n```\n\n```text\nNode\n ↓\nspawn()\n ↓\nchild process\n ↓\nstdout → stream\nstderr → stream\n```\n\nNotice what those are: <b>`stdout` and `stderr` are Readable streams, and `stdin` is Writable</b>. That is Day 8, applied here. Which means everything from that day works, including `pipeline`:\n\n```javascript\nawait pipeline(child.stdout, createWriteStream(\"out.txt\"));\n```\n\nAnd Day 4's stdout/stderr split is the same split: the child's normal output and its diagnostics arrive separately, which is exactly why you get two streams rather than one.\n\n---\n\n## Why `spawn()` suits large output\n\nStreams mean output does not have to be held in memory. Imagine a command producing:\n\n```text\n1 GB of output\n```\n\nYou process it incrementally:\n\n```text\nChild process\n     ↓\nstdout stream\n     ↓\nchunk\nchunk\nchunk\nchunk\n     ↓\nYour application\n```\n\nSame argument as Day 8, for the same reason.\n\n---\n\n## The gotcha with streams\n\nBecause they are streams, they have <b>backpressure</b>, and forgetting that causes a specific hang. If you never read `child.stdout`, the pipe buffer fills, the child blocks trying to write, and it never exits. Your `'close'` handler never fires and the whole thing sits there.\n\nSo either consume both streams, pipe them somewhere, or pass `stdio: \"ignore\"` if you genuinely do not care. Attaching a handler to `stdout` and forgetting `stderr` is the usual version of this, and it hangs only when the child happens to write a warning.\n\n---\n\n## Waiting for it properly\n\n`spawn` is event-based, which does not compose with the rest of your async code. There is a promise helper:\n\n```javascript\nimport { once } from \"node:events\";\n\nconst [code] = await once(child, \"close\");\n```\n\nAnd `'close'` versus `'exit'` matters: `'exit'` fires when the process ends, `'close'` fires when its streams have also closed. If you are collecting output, wait for `'close'` or you can miss the last chunk.\n\nOne more: an executable that does not exist gives you an `'error'` event, not a non-zero exit code. Handle both, or a typo in a command name becomes an unhandled `'error'` and a dead process.",
      diagram: `spawn gives you streams, which is Day 8 again

    child.stdin    Writable
    child.stdout   Readable    ← normal output
    child.stderr   Readable    ← diagnostics

    same split as Day 4. that is why there are two.

    so everything from Day 8 works:
      await pipeline(child.stdout, createWriteStream("out"))


Why that suits large output

    child producing 1 GB
        ↓
    stdout stream
        ↓
    chunk → chunk → chunk → chunk
        ↓
    processed incrementally, never held


The hang nobody expects

    you never read child.stdout
        ↓
    the pipe buffer fills
        ↓
    the child BLOCKS trying to write
        ↓
    it never exits
        ↓
    your "close" handler never fires
        ↓
    the whole thing just sits there

    the usual version: you handle stdout and forget
    stderr. it hangs only when the child writes a
    warning, so it works until it doesn't.

    fix: consume both, pipe both, or stdio: "ignore"


exit vs close, and the error case

    "exit"    the process ended
    "close"   its streams have closed too
              └─ collecting output? wait for THIS one,
                 or you can miss the last chunk

    "error"   the executable did not exist
              └─ NOT a non-zero exit code.
                 unhandled, it kills your process.
                 so a typo in a command name is fatal.`,
      codeExample: {
        title: "spawn, done properly",
        code: `import { spawn } from "node:child_process";
import { once } from "node:events";
import { pipeline } from "node:stream/promises";
import fs from "node:fs";

// ── The basic shape ─────────────────────────────────────────
const child = spawn(process.execPath, ["--version"]);

child.stdout.on("data", (data) => console.log("out:", data.toString().trim()));
child.stderr.on("data", (data) => console.error("err:", data.toString().trim()));

const [code] = await once(child, "close");
console.log("exited with:", code);          // 0


// ── stdout is a Readable, so Day 8 applies ──────────────────
const listing = spawn("ls", ["-la"]);
await pipeline(listing.stdout, fs.createWriteStream("listing.txt"));
console.log("piped to a file, never held in memory");


// ── A promise wrapper worth having ──────────────────────────
async function run(command, args = []) {
  const proc = spawn(command, args);

  const chunks = [];
  const errChunks = [];
  proc.stdout.on("data", (c) => chunks.push(c));
  proc.stderr.on("data", (c) => errChunks.push(c));
  //   consume BOTH, or the child can block and never exit

  const [exitCode] = await Promise.race([
    once(proc, "close"),
    once(proc, "error").then(([error]) => {
      throw error;                          // executable not found
    }),
  ]);

  if (exitCode !== 0) {
    throw new Error(
      \`\${command} exited \${exitCode}: \${Buffer.concat(errChunks)}\`,
    );
  }
  return Buffer.concat(chunks).toString();
}

console.log((await run(process.execPath, ["--version"])).trim());

try {
  await run("definitely-not-a-real-command");
} catch (error) {
  console.log("caught:", error.code ?? error.message);   // ENOENT
}
//   an "error" event, not an exit code. Unhandled, it kills
//   your process, so a typo in a command name is fatal.


// ── The hang ────────────────────────────────────────────────
// const noisy = spawn("some-chatty-command");
// noisy.on("close", () => console.log("done"));
//
// Nothing reads stdout. The pipe buffer fills, the child
// blocks writing, it never exits, "close" never fires.
//
// Fix one of three ways:
//   consume both streams
//   pipe both somewhere
//   spawn(cmd, args, { stdio: "ignore" })


// ── exit vs close ───────────────────────────────────────────
// "exit"   the process ended
// "close"  its streams closed too
//
// Collecting output? Wait for "close", or you can miss the
// final chunk.

fs.rmSync("listing.txt", { force: true });`,
      },
      keyTakeaways: [
        "A <b>child process</b> is a separate OS process with its own memory, started by your application.",
        "Use one to run something you should not reimplement: `ffmpeg`, `git`, `python`, `openssl`.",
        "`spawn()` gives you <b>streams</b>: `stdout` and `stderr` Readable, `stdin` Writable.",
        "So everything from Day 8 applies, including `pipeline`.",
        "The two output streams are Day 4's stdout/stderr split, which is why there are two.",
        "Streams mean gigabytes of output can be processed incrementally rather than buffered.",
        "<b>Not reading `stdout` hangs the child</b>: the pipe buffer fills, it blocks writing, and never exits.",
        "The usual version is handling `stdout` and forgetting `stderr`, so it hangs only when the child writes a warning.",
        "Fix it by consuming both, piping both, or passing `stdio: \"ignore\"`.",
        "`'exit'` fires when the process ends, `'close'` when its streams close. Collecting output means waiting for `'close'`.",
        "A missing executable gives an <b>`'error'` event, not an exit code</b>. Unhandled, it kills your process.",
      ],
      commonMistakes: [
        "<b>Not consuming `stdout` or `stderr`</b> — the child blocks on a full pipe buffer and never exits.",
        "<b>Handling `stdout` and forgetting `stderr`</b> — it works until the child writes a single warning.",
        "<b>Waiting for `'exit'` while collecting output</b> — the streams may not have flushed. Wait for `'close'`.",
        "<b>Not handling the `'error'` event</b> — a typo in a command name becomes an unhandled error and a dead process.",
        "<b>Buffering all of a child's output when it could be piped</b> — `spawn` gave you streams for a reason.",
        "<b>Assuming a zero exit code means success</b> — plenty of tools exit 0 and report the problem on stderr.",
      ],
      quiz: [
        {
          question: "You `spawn` a chatty command, attach only a `'close'` handler, and it never fires. Why?",
          options: [
            "The command failed silently",
            "Nothing reads `stdout`, so the pipe buffer fills, the child blocks writing, and it never exits",
            "`'close'` needs `stdio: \"pipe\"`",
            "The event name should be `'exit'`",
          ],
          correctIndex: 1,
          explanation:
            "The streams have backpressure like any other. Consume both, pipe both, or pass `stdio: \"ignore\"` if you genuinely do not want the output.",
        },
        {
          question: "You `spawn` a command that does not exist. What do you get?",
          options: [
            "A non-zero exit code",
            "An `'error'` event, which kills the process if unhandled",
            "`null` from `spawn`",
            "A thrown exception at the call site",
          ],
          correctIndex: 1,
          explanation:
            "There is no process to give you an exit code. It arrives as an `'error'` event, so a typo in a command name is fatal unless you listen for it.",
        },
        {
          question: "You are collecting a child's output. Which event should you wait for?",
          options: ["`'exit'`", "`'close'`", "`'end'`", "Either, they are the same"],
          correctIndex: 1,
          explanation:
            "`'exit'` means the process ended, `'close'` means its streams have closed too. Waiting for the wrong one can lose the final chunk.",
        },
      ],
    },
    {
      id: "exec-and-injection",
      title: "exec, execFile and command injection",
      durationMinutes: 12,
      explanation:
        "## `exec()`\n\n<b>`exec()`</b> (runs a command through a shell and buffers its output until it finishes).\n\n```javascript\nimport { exec } from \"node:child_process\";\n\nexec(\"node --version\", (error, stdout, stderr) => {\n  if (error) {\n    console.error(error);\n    return;\n  }\n\n  console.log(stdout);\n});\n```\n\nThe difference:\n\n```text\nspawn()\n ↓\nstream output\n\nexec()\n ↓\nbuffer output\n ↓\ncallback when finished\n```\n\n---\n\n## `exec()` and large output\n\nBuffering means it is wrong for huge output:\n\n```text\nChild\n ↓\n500 MB output\n ↓\nbuffer in memory\n ↓\nNode process\n```\n\n> Prefer `spawn()` for large or continuous output.\n\nThere is a hard limit worth knowing: `maxBuffer` defaults to <b>1MB</b>, and exceeding it <b>kills the child</b> and gives you `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`. So a command that normally prints a little and one day prints a lot does not slowly degrade, it fails. Raising the limit only moves the cliff.\n\n---\n\n## Command injection\n\nOne of the most important security concepts here.\n\n<b>Command injection</b> (an attack where untrusted input changes the command your application executes).\n\n```javascript\nexec(`git log ${userInput}`);\n```\n\nYou expect:\n\n```text\nuserInput = \"main\"\n```\n\nso you think the command is:\n\n```text\ngit log main\n```\n\nBut user-controlled shell syntax can change what runs. The dangerous pattern:\n\n```text\nUser input\n    ↓\nstring concatenation\n    ↓\nshell command\n    ↓\n💥\n```\n\n---\n\n## Why it works\n\nThe mechanism is worth seeing, because it explains why filtering is the wrong fix. `exec` hands your string to `/bin/sh`, and a shell treats several characters as <b>syntax rather than data</b>:\n\n```text\n;   run another command\n&&  run another command if this one succeeds\n|   pipe into another command\n$() substitute a command's output\n`   the same thing, older syntax\n&   run in the background\n>   redirect into a file\n```\n\nSo `userInput` of `main; rm -rf /tmp/x` is not a weird branch name. It is two commands, and the shell was always going to read it that way.\n\nThat is the point: <b>the shell is doing its job</b>. This is the same shape as Day 6's `path.join` resolving `..`. The function is correct and the mistake is handing it user input.\n\nWhich is why blocklisting characters loses. There are too many, quoting rules are subtle, and the fix has to be perfect every time while the attacker only needs one gap.\n\n---\n\n## Never trust shell input\n\nDangerous:\n\n```javascript\nexec(`some-command ${userInput}`);\n```\n\nespecially when it comes from:\n\n```text\nHTTP request\nquery parameter\nform input\ndatabase\nenvironment controlled by users\n```\n\n---\n\n## Why `execFile()` is safer\n\n<b>`execFile()`</b> (runs a specific executable directly, without a shell by default).\n\n```javascript\nimport { execFile } from \"node:child_process\";\n\nexecFile(\n  \"node\",\n  [\"--version\"],\n  (error, stdout) => {\n    if (error) {\n      console.error(error);\n      return;\n    }\n\n    console.log(stdout);\n  }\n);\n```\n\nArguments go separately:\n\n```text\nExecutable\n   ↓\nnode\n\nArguments\n   ↓\n[\"--version\"]\n```\n\nrather than one shell string.\n\nThis is not a better filter, it is <b>removing the shell</b>. With no shell there is no syntax to inject into, so `;` and `$()` are just characters in an argument. The whole class of attack is gone rather than defended against.\n\nSame move as Day 6's file-id lookup: do not sanitise the dangerous thing, avoid needing it.\n\nOne caveat: on Windows, `execFile` and `spawn` cannot run `.bat` or `.cmd` files without a shell, so those need `shell: true` and the problem comes back. Prefer a real executable.\n\nAnd `execFile` does not save you from the <b>argument</b> being dangerous. `execFile(\"git\", [\"log\", userInput])` cannot inject a second command, but a user-supplied argument starting with `-` can still be read as a flag. Validate against a list of allowed values when the input decides behaviour.\n\n---\n\n## The comparison\n\n```text\nAPI            Shell?          Output     Good for\n─────────────────────────────────────────────────────────────\nspawn()        No by default   Streams    Large/continuous output\nexec()         Yes             Buffered   Small shell commands\nexecFile()     No by default   Buffered   Running a specific executable\nfork()         No              IPC        Another Node.js process\n```\n\nThe question is:\n\n> <b>Do I need a shell, and do I need streaming?</b>\n\nAnd almost always, the answer to the first is no. Pipes, globs and `&&` are the only reasons to want one, and you can usually do those in Node instead.",
      diagram: `Why injection works: the shell is doing its job

    exec("git log " + userInput)
              │
              └─►  /bin/sh reads the whole string

    characters a shell treats as SYNTAX, not data:

      ;      run another command
      &&     run another if this succeeds
      |      pipe into another
      $()    substitute a command's output
      \`      the same, older syntax
      &      run in the background
      >      redirect into a file

    userInput = "main; rm -rf /tmp/x"
        └─ not a weird branch name. two commands.
           the shell was always going to read it that way.


    same shape as Day 6's path.join resolving ".."
    the function is CORRECT. handing it user input is
    the mistake.


Which is why filtering loses

    too many characters, subtle quoting rules
    your fix must be perfect every time
    the attacker needs one gap


execFile removes the shell entirely

    exec       "git log main; rm -rf /"   ──► sh ──► 2 commands
    execFile   "git", ["log", "main; rm -rf /"]
                                          ──► git ──► 1 argument
                                                       (a very odd
                                                        branch name)

    not a better filter. the whole class is GONE.

    same move as Day 6's file-id lookup: do not
    sanitise the dangerous thing, avoid needing it.


exec's other limit: maxBuffer

    default 1 MB. exceed it and the child is KILLED
    with ERR_CHILD_PROCESS_STDIO_MAXBUFFER

    a command that usually prints a little and one day
    prints a lot does not degrade. it fails.
    raising the limit only moves the cliff.


What execFile does NOT fix

    execFile("git", ["log", userInput])
      no second command possible          ✓
      but userInput = "--upload-pack=..."
      is still read as a FLAG             ✗

    validate against allowed values when the input
    decides behaviour.`,
      codeExample: {
        title: "The injection, and removing the shell",
        code: `import { exec, execFile, spawn } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);
const execFileAsync = promisify(execFile);

// ── exec: a shell, and buffered output ──────────────────────
const { stdout } = await execAsync("node --version");
console.log(stdout.trim());


// ── The injection ───────────────────────────────────────────
// const userInput = "main; echo INJECTED";
// await execAsync(\`git log --oneline -1 \${userInput}\`);
//
// The shell reads that as TWO commands. Try it with
// "; echo INJECTED" and watch the echo run.
//
// It is not a Node bug. /bin/sh treats ";" as syntax,
// which is its entire job.


// ── Watch the shell interpret, harmlessly ───────────────────
const shellSees = await execAsync('echo "one"; echo "two"');
console.log(JSON.stringify(shellSees.stdout));      // "one\\ntwo\\n"
//   one string, two commands


// ── execFile: no shell, so no syntax to inject into ─────────
const suspicious = "--version; echo INJECTED";

const direct = await execFileAsync(process.execPath, [suspicious])
  .catch((error) => ({ stdout: "", failed: error.code }));

console.log("execFile treated it as one argument:", direct.failed ?? "ran");
//   the whole string was ONE argument, not a command
//   separator. The class of attack is gone, not filtered.


// ── maxBuffer is a cliff, not a slope ───────────────────────
try {
  await execAsync("node -e \\"process.stdout.write('x'.repeat(2e6))\\"");
} catch (error) {
  console.log("maxBuffer:", error.code);
  // ERR_CHILD_PROCESS_STDIO_MAXBUFFER
}
//
// Default 1MB. Exceeding it KILLS the child. A command that
// usually prints a little and one day prints a lot fails
// outright. Raising the limit only moves the cliff.

// the streaming answer instead:
const big = spawn("node", ["-e", "process.stdout.write('x'.repeat(2e6))"]);
let bytes = 0;
for await (const chunk of big.stdout) bytes += chunk.length;
console.log("streamed", bytes, "bytes with no limit");


// ── What execFile still does not fix ────────────────────────
// execFile("git", ["log", userInput])
//   no second command possible          ✓
//   userInput = "--some-dangerous-flag" is still a FLAG  ✗
//
// When the input decides behaviour, validate it:
const ALLOWED_BRANCHES = new Set(["main", "develop", "staging"]);

function safeBranch(input) {
  if (!ALLOWED_BRANCHES.has(input)) throw new Error("unknown branch");
  return input;
}
console.log(safeBranch("main"));
// safeBranch("main; rm -rf /");        → throws


// ── The decision ────────────────────────────────────────────
// large or continuous output   →  spawn
// a specific executable        →  execFile
// genuinely need shell syntax  →  exec, with NO user input
// another Node program         →  fork`,
      },
      keyTakeaways: [
        "`exec()` runs through a <b>shell</b> and buffers all output until the command finishes.",
        "`maxBuffer` defaults to 1MB, and exceeding it <b>kills the child</b> with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`.",
        "So a command that one day prints more than usual fails outright. Raising the limit moves the cliff.",
        "<b>Command injection</b> is untrusted input changing which command runs.",
        "It works because a shell treats `;`, `&&`, `|`, `$()`, backticks, `&` and `>` as <b>syntax, not data</b>.",
        "The shell is doing its job. Same shape as Day 6's `path.join` resolving `..`.",
        "Which is why <b>filtering characters loses</b>: your fix must be perfect, the attacker needs one gap.",
        "`execFile()` runs an executable directly with separate arguments, so there is <b>no shell to inject into</b>.",
        "That removes the whole class rather than defending against it, like Day 6's file-id lookup.",
        "It does not fix a dangerous <b>argument</b>: a user value starting with `-` can still be read as a flag.",
        "Validate against a list of allowed values when the input decides behaviour.",
        "On Windows, `.bat` and `.cmd` need `shell: true`, which brings the problem back. Prefer a real executable.",
      ],
      commonMistakes: [
        "<b>Interpolating user input into an `exec` string</b> — the single most direct route to remote command execution.",
        "<b>Trying to sanitise shell metacharacters</b> — too many, too subtle. Remove the shell instead.",
        "<b>Using `exec` for output that might be large</b> — the 1MB `maxBuffer` kills the child.",
        "<b>Raising `maxBuffer` to fix that</b> — it moves the failure point. Use `spawn` and stream.",
        "<b>Assuming `execFile` makes any argument safe</b> — a value starting with `-` is still a flag.",
        "<b>Passing `shell: true` to `spawn` for convenience</b> — you have just reintroduced `exec`'s problem.",
        "<b>Using a shell for pipes and globs</b> — you can usually do both in Node without one.",
      ],
      quiz: [
        {
          question: "Why is filtering shell metacharacters the wrong fix for command injection?",
          options: [
            "It is too slow",
            "There are too many characters and the quoting rules are subtle: your filter must be perfect while an attacker needs one gap",
            "Node strips them anyway",
            "It breaks valid input",
          ],
          correctIndex: 1,
          explanation:
            "The shell is behaving correctly. Removing it with `execFile` eliminates the class of attack rather than defending against it, which is the same move as Day 6's file-id lookup.",
        },
        {
          question: "Your `exec` command usually prints a few kilobytes but one day prints 2MB. What happens?",
          options: [
            "It gets slower",
            "The child is killed with `ERR_CHILD_PROCESS_STDIO_MAXBUFFER`",
            "The output is truncated silently",
            "Nothing, `maxBuffer` grows",
          ],
          correctIndex: 1,
          explanation:
            "`maxBuffer` defaults to 1MB and it is a hard cliff. Raising it only moves the failure point, so large output belongs in `spawn` and a stream.",
        },
        {
          question: "`execFile(\"git\", [\"log\", userInput])`. What can a user still do?",
          options: [
            "Run a second command with `;`",
            "Pass a value starting with `-` that git reads as a flag",
            "Nothing, it is fully safe",
            "Pipe the output elsewhere",
          ],
          correctIndex: 1,
          explanation:
            "No shell means no command separators, but the argument still reaches the program. When user input decides behaviour, validate it against a list of allowed values.",
        },
      ],
    },
    {
      id: "fork-and-ipc",
      title: "fork, IPC, exit codes and signals",
      durationMinutes: 10,
      explanation:
        "## `fork()`\n\n<b>`fork()`</b> (starts another Node process with a built-in communication channel called IPC).\n\n<b>Inter-Process Communication</b> (communication between separate processes).\n\n```javascript\nimport { fork } from \"node:child_process\";\n\nconst child = fork(\"./worker.js\");\n```\n\n```text\nParent Node process\n       │\n       │ IPC\n       ↕\nChild Node process\n```\n\n---\n\n## IPC in practice\n\nParent:\n\n```javascript\nchild.send({\n  type: \"calculate\",\n  value: 10\n});\n```\n\nChild:\n\n```javascript\nprocess.on(\"message\", message => {\n  console.log(message);\n});\n```\n\nThe child responds:\n\n```javascript\nprocess.send({\n  result: 100\n});\n```\n\nParent:\n\n```javascript\nchild.on(\"message\", message => {\n  console.log(message.result);\n});\n```\n\n```text\nParent\n  │\n  │ send()\n  ↓\nChild\n  │\n  │ process.send()\n  ↓\nParent\n```\n\n---\n\n## Why `fork()` is different\n\nUseful when:\n\n```text\nYou have Node.js code\n        ↓\nYou want another Node.js process\n        ↓\nYou want easy IPC\n```\n\nIt is not:\n\n```javascript\nfork(\"some-python-script.py\");\n```\n\n`fork()` launches another <b>Node module</b>.\n\nTwo things worth knowing about that channel. Messages are <b>JSON-serialised</b> by default, so a `Date` arrives as a string, a `Map` arrives as `{}`, and a function does not arrive at all. Same limitation as Day 7's JSON lesson, in a new place. Passing `serialization: \"advanced\"` uses the structured clone algorithm instead, which handles those.\n\nAnd the serialisation cost is real. Sending a large object means encoding it, copying it through a pipe, and decoding it. For anything sizeable, that copy is often more expensive than the work you were offloading, which is the main reason to prefer a worker thread for data-heavy jobs.\n\nAlso: `process.send` only exists in a forked child. In a normally started process it is `undefined`, so a module that assumes it will throw when someone runs it directly.\n\n---\n\n## Exit codes\n\nEvery process exits with an <b>exit code</b> (a number indicating how it finished).\n\n```text\n0\n↓\nsuccess\n```\n\nNon-zero:\n\n```text\n1, 2, 3...\n↓\nsome kind of failure\n```\n\n```javascript\nchild.on(\"close\", code => {\n  console.log(\"Exit code:\", code);\n});\n```\n\nDay 1's exit codes, now from the other side: you are the thing reading them.\n\n---\n\n## Exit vs signal\n\nA process can also be terminated by a <b>signal</b> (an OS notification asking a process to do something).\n\n```text\nSIGTERM\nSIGINT\nSIGKILL\n```\n\nSo a child might finish with:\n\n```text\nexit code\n```\n\nor:\n\n```text\nsignal\n```\n\nInspect both when diagnosing failures.\n\nThe practical form: `'close'` gives you <b>two</b> arguments, `(code, signal)</b>, and exactly one is non-null. A killed process has `code === null`, so code alone cannot tell you what happened.\n\nThe case this matters for is the one you will actually hit. A child killed by the kernel's OOM killer reports `signal: \"SIGKILL\"` and `code: null`. Check only the code and it looks like a clean exit, and you will spend a while wondering why the work silently did not happen.\n\nAnd Day 4's signals apply to children too: `child.kill()` sends `SIGTERM` by default, so the child can shut down gracefully. `child.kill(\"SIGKILL\")` does not give it that chance.",
      diagram: `fork: another Node process, with a channel

    parent                          child
    ┌──────────────────┐            ┌──────────────────┐
    │ child.send(msg)  │ ─── IPC ─► │ process.on(      │
    │                  │            │   "message")     │
    │ child.on(        │ ◄── IPC ── │ process.send(r)  │
    │   "message")     │            │                  │
    └──────────────────┘            └──────────────────┘

    for another NODE MODULE. not a python script.


The channel copies, and it is not free

    messages are JSON-serialised by default
        ↓
    Date      → a string
    Map       → {}
    function  → gone

    same limitation as Day 7's JSON lesson.
    serialization: "advanced" uses structured clone.

    and the COST is real:
      encode → copy through a pipe → decode

    for a large payload that copy often costs more
    than the work you were offloading.
      └─ which is why data-heavy jobs want a worker
         thread instead


close gives you TWO arguments, and one is null

    child.on("close", (code, signal) => { })
                       └─┬─┘  └──┬──┘
              exactly one is non-null

    exited normally    code: 0     signal: null
    killed             code: null  signal: "SIGTERM"


The case you will actually hit

    the kernel OOM-kills your child
        ↓
    code: null, signal: "SIGKILL"
        ↓
    check only the code and it looks like a CLEAN EXIT
        ↓
    you spend a while wondering why the work
    silently did not happen


    and Day 4's signals apply here too:
      child.kill()             SIGTERM, graceful
      child.kill("SIGKILL")    no chance to clean up`,
      codeExample: {
        title: "IPC, and reading how a child really ended",
        code: `import { fork, spawn } from "node:child_process";
import { once } from "node:events";
import fs from "node:fs";

// ── A child module ──────────────────────────────────────────
fs.writeFileSync(
  "child.mjs",
  \`process.on("message", (msg) => {
     if (msg.type === "calculate") {
       let total = 0;
       for (let i = 0; i < msg.value; i += 1) total += i;
       process.send({ result: total });
     }
   });\`,
);


// ── fork and talk to it ─────────────────────────────────────
const child = fork("./child.mjs");

child.send({ type: "calculate", value: 1_000_000 });

const [reply] = await once(child, "message");
console.log("result:", reply.result);

child.kill();                          // SIGTERM by default
await once(child, "close");


// ── The channel serialises, with JSON's limits ──────────────
const child2 = fork("./child.mjs");
// child2.send({ when: new Date(), tags: new Map([["a", 1]]) });
//   arrives as { when: "2026-09-03T...", tags: {} }
//
// Day 7's JSON lesson, in a new place. For Date and Map:
//   fork("./child.mjs", [], { serialization: "advanced" })
child2.kill();


// ── close gives (code, signal), and one is null ─────────────
async function howDidItEnd(command, args) {
  const proc = spawn(command, args);
  const [code, signal] = await once(proc, "close");
  return { code, signal };
}

console.log(await howDidItEnd(process.execPath, ["--version"]));
// { code: 0, signal: null }             clean exit

console.log(await howDidItEnd(process.execPath, ["-e", "process.exit(3)"]));
// { code: 3, signal: null }             failed

const killed = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000)"]);
setTimeout(() => killed.kill("SIGKILL"), 50);
const [code, signal] = await once(killed, "close");
console.log({ code, signal });
// { code: null, signal: 'SIGKILL' }     killed
//
// Note code is NULL here. This is exactly what an OOM kill
// looks like, and checking only the code makes it look like
// a clean exit.


// ── So check both ───────────────────────────────────────────
function describe(code, signal) {
  if (signal) return \`killed by \${signal}\`;
  if (code === 0) return "success";
  return \`failed with code \${code}\`;
}

console.log(describe(0, null));            // success
console.log(describe(3, null));            // failed with code 3
console.log(describe(null, "SIGKILL"));    // killed by SIGKILL


// ── process.send does not always exist ──────────────────────
// In a normally started process:
console.log("process.send:", typeof process.send);   // "undefined"
//
// So a module that assumes it throws when someone runs it
// directly. Guard it:
//   if (process.send) process.send({ ready: true });

fs.rmSync("child.mjs", { force: true });`,
      },
      keyTakeaways: [
        "`fork()` starts another <b>Node module</b> with an IPC channel built in.",
        "Parent uses `child.send()` and `child.on(\"message\")`. Child uses `process.send()` and `process.on(\"message\")`.",
        "It is for Node code. `fork(\"script.py\")` is not what it does.",
        "Messages are <b>JSON-serialised</b> by default, so a `Date` becomes a string and a `Map` becomes `{}`.",
        "`serialization: \"advanced\"` uses structured clone instead, which handles those.",
        "The <b>copy costs real time</b>. For a large payload it often costs more than the work you offloaded.",
        "Which is the main reason data-heavy jobs belong in a worker thread instead.",
        "`process.send` is `undefined` in a normally started process, so guard it.",
        "`'close'` gives you <b>`(code, signal)`</b>, and exactly one is non-null.",
        "A killed process has `code === null`, so the code alone cannot tell you what happened.",
        "An <b>OOM-killed child</b> reports `SIGKILL` with a null code, which looks like a clean exit if you only check the code.",
        "`child.kill()` sends `SIGTERM`, so Day 4's graceful shutdown applies to children too.",
      ],
      commonMistakes: [
        "<b>Checking only the exit code</b> — a killed child has `code === null`, which reads as falsy-not-zero and hides an OOM kill.",
        "<b>Using `fork` for a non-Node program</b> — that is `spawn` or `execFile`.",
        "<b>Sending a `Date` or `Map` over IPC</b> — JSON serialisation flattens them. Use `serialization: \"advanced\"`.",
        "<b>Sending large payloads over IPC</b> — the copy can cost more than the work. Consider a worker thread.",
        "<b>Calling `process.send` unguarded</b> — it does not exist unless the module was forked.",
        "<b>`child.kill(\"SIGKILL\")` by default</b> — `SIGTERM` lets the child shut down cleanly first.",
      ],
      quiz: [
        {
          question: "A forked child is killed by the kernel's OOM killer. What does `'close'` report?",
          options: [
            "`code: 137, signal: null`",
            "`code: null, signal: \"SIGKILL\"`",
            "`code: 1, signal: \"SIGKILL\"`",
            "`'close'` does not fire",
          ],
          correctIndex: 1,
          explanation:
            "Exactly one of the two is non-null. Checking only the code makes an OOM kill look like a clean exit, which is a memorably confusing afternoon.",
        },
        {
          question: "You `child.send({ when: new Date() })` over IPC. What does the child receive?",
          options: [
            "A `Date` object",
            "An ISO string, because the channel serialises with JSON by default",
            "`undefined`",
            "An error",
          ],
          correctIndex: 1,
          explanation:
            "Day 7's JSON limitation applies to the IPC channel too. `serialization: \"advanced\"` switches to structured clone, which preserves `Date` and `Map`.",
        },
        {
          question: "Why prefer a worker thread over `fork` for a data-heavy job?",
          options: [
            "Workers are more isolated",
            "IPC copies the payload, and for large data that copy can cost more than the work you offloaded",
            "`fork` cannot run CPU work",
            "Workers have no startup cost",
          ],
          correctIndex: 1,
          explanation:
            "Encode, copy through a pipe, decode. A worker can be given shared memory instead and skip the copy entirely.",
        },
      ],
    },
    {
      id: "worker-threads",
      title: "Worker threads",
      durationMinutes: 14,
      explanation:
        "```javascript\nimport {\n  Worker\n} from \"node:worker_threads\";\n```\n\nA <b>Worker Thread</b> (a separate JavaScript thread inside the same Node process).\n\n```text\nNode Process\n      │\n      ├── Main Thread\n      │\n      └── Worker Thread\n```\n\nDesigned primarily for:\n\n> <b>CPU-bound JavaScript work.</b>\n\n---\n\n## What is CPU-bound work?\n\n<b>CPU-bound work</b> (work spending most of its time using the CPU rather than waiting for I/O).\n\n```text\nImage processing\nVideo processing\nLarge calculations\nCompression\nEncryption\nParsing huge data\nMachine learning calculations\n```\n\n```javascript\nfunction calculate() {\n  let result = 0;\n\n  for (let i = 0; i < 10_000_000_000; i++) {\n    result += i;\n  }\n\n  return result;\n}\n```\n\nThis keeps the CPU busy.\n\n---\n\n## Why CPU work hurts Node\n\n```text\nMain thread\n    ↓\nEvent loop\n    ↓\nHTTP requests\nTimers\nCallbacks\nI/O\n```\n\nRun this on the main thread:\n\n```javascript\ncalculateHugeThing();\n```\n\nand:\n\n```text\nEvent loop\n   ↓\nCPU-heavy calculation\n   ↓\n████████████████\n   ↓\nevent loop blocked\n```\n\nEverything else waits. Day 4's blocking lesson, with the cause named.\n\n---\n\n## The worker solution\n\n```text\nMain Thread\n    │\n    │ message\n    ↓\nWorker Thread\n    │\n    │ CPU calculation\n    ↓\nresult\n    │\n    ↓\nMain Thread\n```\n\n```text\nMain Thread\n ↓\nHTTP requests continue\n\nWorker\n ↓\nCPU calculation\n```\n\nActual parallel execution for JavaScript CPU work.\n\n---\n\n## What the proof actually looks like\n\nWorth being precise, because the obvious measurement is the wrong one.\n\nRun a one-second calculation with a `setInterval` ticking every 100ms. Measured:\n\n```text\non the main thread\n  elapsed 1093ms | ticks fired 0  | expected ~10\n\nin a worker\n  elapsed 1101ms | ticks fired 10 | expected ~11\n```\n\nZero ticks, not late ticks. That is the detail: a blocked event loop does not fire <b>delayed</b> timers, it fires <b>none</b>. `setInterval` does not queue up the intervals it missed, so measuring \"tick lateness\" shows you almost nothing while measuring <b>tick count against expected</b> shows you everything.\n\nAlso note the elapsed time barely changed, 1093ms against 1101ms. The worker did not make the calculation faster. It moved it off the thread that answers requests. That is the entire benefit, and expecting anything else leads to disappointment.\n\n---\n\n## A basic worker\n\n`main.js`:\n\n```javascript\nimport { Worker } from \"node:worker_threads\";\n\nconst worker = new Worker(\n  \"./worker.js\"\n);\n\nworker.on(\"message\", result => {\n  console.log(\"Result:\", result);\n});\n```\n\n`worker.js`:\n\n```javascript\nimport {\n  parentPort\n} from \"node:worker_threads\";\n\nconst result = 123 + 456;\n\nparentPort.postMessage(result);\n```\n\n```text\nmain.js\n   │\n   ↓\nWorker\n   │\n   ↓\npostMessage()\n   │\n   ↓\nmain.js\n```\n\n---\n\n## `worker.postMessage()`\n\nMain thread:\n\n```javascript\nworker.postMessage({\n  type: \"calculate\",\n  value: 100\n});\n```\n\nWorker:\n\n```javascript\nparentPort.on(\n  \"message\",\n  message => {\n    console.log(message);\n  }\n);\n```\n\nThen back:\n\n```javascript\nparentPort.postMessage({\n  result: 12345\n});\n```\n\n---\n\n## Three practical things\n\n<b>A worker starts cold.</b> Fresh V8 isolate, no shared module state, and it re-imports everything. That is a few milliseconds and a few megabytes, so one per request is wasteful. Real code uses a small pool created at startup.\n\n<b>Messages use structured clone</b>, not JSON, so `Date`, `Map` and `Set` survive. Still a copy though, which is why a large `ArrayBuffer` should be <b>transferred</b> rather than sent: pass it in the transfer list and ownership moves with no copy at all. The original becomes unusable, which is the point.\n\n<b>An uncaught throw inside a worker does not stay there.</b> It surfaces as an `'error'` event on the worker object, and unhandled that follows Day 4's rules and takes the process down. Isolation is weaker than a child process, which is the trade you accepted.",
      diagram: `The measurement everyone gets wrong

    a 1-second calculation, setInterval every 100ms

    on the main thread
      elapsed 1093ms | ticks fired  0 | expected ~10
    in a worker
      elapsed 1101ms | ticks fired 10 | expected ~11

    ZERO ticks, not late ticks.
        │
        └─ a blocked loop does not fire DELAYED timers.
           it fires NONE. setInterval does not queue up
           the intervals it missed.

    so "tick lateness" shows almost nothing.
    "tick count vs expected" shows everything.


And note what did NOT change

    1093ms  →  1101ms

    the worker did not make the calculation faster.
    it moved it off the thread that answers requests.

    that is the entire benefit. expecting more leads
    to disappointment.


A worker starts cold

    fresh V8 isolate
    no shared module state
    re-imports everything
        ↓
    a few ms, a few MB

    one per request is wasteful.
    real code pools them at startup.


Messages: clone, or TRANSFER

    postMessage(obj)
      structured clone. Date, Map, Set survive.
      still a COPY.

    postMessage(buf, [buf])
      ownership MOVES. no copy at all.
      the original becomes unusable  ← the point


Isolation is weaker than a child process

    uncaught throw in a worker
        ↓
    "error" event on the worker object
        ↓
    unhandled → Day 4's rules → process dies

    that is the trade you accepted for the lower cost.`,
      codeExample: {
        title: "The proof, measured the right way",
        code: `import { Worker } from "node:worker_threads";
import fs from "node:fs";

const N = 2_000_000_000;

function heavy(n) {
  let total = 0;
  for (let i = 0; i < n; i += 1) total += Math.sqrt(i);
  return total;
}


// ── The worker ──────────────────────────────────────────────
fs.writeFileSync(
  "worker.mjs",
  \`import { parentPort } from "node:worker_threads";
   parentPort.on("message", (n) => {
     let total = 0;
     for (let i = 0; i < n; i += 1) total += Math.sqrt(i);
     parentPort.postMessage(total);
   });\`,
);


// ── Count ticks, do not measure lateness ────────────────────
async function measure(mode) {
  let ticks = 0;
  const start = performance.now();
  const interval = setInterval(() => { ticks += 1; }, 100);

  if (mode === "main") {
    heavy(N);                          // blocks the loop
  } else {
    const worker = new Worker("./worker.mjs");
    await new Promise((resolve) => {
      worker.once("message", resolve);
      worker.postMessage(N);
    });
    await worker.terminate();
  }

  const elapsed = performance.now() - start;
  clearInterval(interval);

  console.log(
    \`\${mode.padEnd(6)} elapsed \${Math.round(elapsed)}ms |\`,
    \`ticks \${ticks} | expected ~\${Math.floor(elapsed / 100)}\`,
  );
}

await measure("main");
// main   elapsed 1093ms | ticks 0  | expected ~10
await measure("worker");
// worker elapsed 1101ms | ticks 10 | expected ~11
//
// ZERO ticks on the main thread, not late ticks. A blocked
// loop does not fire delayed timers, it fires none, because
// setInterval does not queue up what it missed.
//
// And elapsed barely moved: the worker did not make the
// calculation faster, it moved it off the request thread.


// ── Two-way messaging ───────────────────────────────────────
const worker = new Worker("./worker.mjs");

worker.on("error", (error) => {
  console.error("worker threw:", error.message);
  // unhandled, this follows Day 4's rules and kills the
  // process. Isolation is weaker than a child process.
});

worker.postMessage(1_000_000);
console.log("result:", await new Promise((r) => worker.once("message", r)));
await worker.terminate();


// ── Transfer, do not copy, a large buffer ───────────────────
const w2 = new Worker(
  "data:text/javascript," +
    encodeURIComponent(\`
      import { parentPort } from "node:worker_threads";
      parentPort.on("message", (buf) => {
        parentPort.postMessage(buf.byteLength);
      });
    \`),
);

const big = new ArrayBuffer(64 * 1024 * 1024);
w2.postMessage(big, [big]);            // ← the transfer list

console.log("worker saw:", await new Promise((r) => w2.once("message", r)));
console.log("original byteLength now:", big.byteLength);   // 0
//
// Ownership MOVED. No copy at all, and the original is
// unusable, which is exactly the point.
await w2.terminate();

fs.rmSync("worker.mjs", { force: true });`,
      },
      keyTakeaways: [
        "A <b>worker thread</b> is a separate JavaScript thread inside the same Node process.",
        "It exists for <b>CPU-bound work</b>: work using the CPU rather than waiting on I/O.",
        "CPU work on the main thread blocks the event loop, which is Day 4's lesson with the cause named.",
        "<b>The right measurement is tick count, not tick lateness.</b>",
        "A blocked loop fires <b>zero</b> timers, not late ones. `setInterval` does not queue what it missed.",
        "Measured: 0 ticks of ~10 expected on the main thread, 10 of ~11 in a worker.",
        "Elapsed time barely changed, 1093ms against 1101ms. <b>The worker does not make the work faster.</b>",
        "It moves the work off the thread that answers requests. That is the entire benefit.",
        "A worker starts cold: fresh isolate, no shared state, a few ms and a few MB. Pool them at startup.",
        "Messages use <b>structured clone</b>, so `Date`, `Map` and `Set` survive. It is still a copy.",
        "A large `ArrayBuffer` should be <b>transferred</b> via the transfer list: ownership moves, no copy.",
        "An uncaught throw in a worker surfaces as an `'error'` event, and unhandled it kills the process.",
      ],
      commonMistakes: [
        "<b>Measuring tick lateness to prove blocking</b> — a blocked loop fires no ticks at all, so lateness shows nothing.",
        "<b>Expecting a worker to make the calculation faster</b> — the elapsed time is the same. It moves the work, not shrinks it.",
        "<b>Creating a worker per request</b> — a fresh isolate every time, for a few ms and a few MB each.",
        "<b>Copying a large buffer to a worker</b> — use the transfer list and move ownership instead.",
        "<b>Not handling the worker's `'error'` event</b> — an uncaught throw inside it takes the whole process down.",
        "<b>Assuming a worker shares module state</b> — it re-imports everything and starts cold.",
        "<b>Reaching for a worker to speed up a database query</b> — that is waiting, which Node already handles.",
      ],
      quiz: [
        {
          question: "You block the main thread for one second with a `setInterval` running every 100ms. How many ticks fire?",
          options: [
            "About 10, all late",
            "Zero",
            "One, at the end",
            "About 10, on time",
          ],
          correctIndex: 1,
          explanation:
            "`setInterval` does not queue up missed intervals, so a blocked loop fires none at all. That is why tick count against expected is the right measurement and tick lateness is not.",
        },
        {
          question: "Moving a one-second calculation into a worker. What happens to the elapsed time?",
          options: [
            "It roughly halves",
            "It stays about the same, around one second",
            "It becomes instant",
            "It doubles",
          ],
          correctIndex: 1,
          explanation:
            "Measured at 1093ms versus 1101ms. The worker does not make the work faster, it moves it off the thread that answers requests. That is the whole benefit.",
        },
        {
          question: "You need to send a 64MB `ArrayBuffer` to a worker. What is the right approach?",
          options: [
            "`postMessage(buf)`, which is fine",
            "`postMessage(buf, [buf])`, so ownership transfers with no copy",
            "Convert it to base64 first",
            "Write it to a file and send the path",
          ],
          correctIndex: 1,
          explanation:
            "The transfer list moves ownership instead of cloning. The original's `byteLength` becomes 0 afterwards, which is the signal that nothing was copied.",
        },
      ],
    },
    {
      id: "workers-vs-alternatives",
      title: "Workers vs child processes vs cluster",
      durationMinutes: 12,
      explanation:
        "## Workers do not make I/O faster\n\nCritical distinction. Do not think:\n\n> \"Worker threads are for making everything faster.\"\n\nThey help when:\n\n```text\nCPU work\n```\n\nis blocking your main thread. For normal I/O:\n\n```text\nDatabase\nHTTP\nFile system\nNetwork\n```\n\nNode already has async APIs. You do not need:\n\n```text\nWorker\n ↓\nawait database query\n```\n\njust because the query takes time.\n\nDay 3's rule again: <b>waiting overlaps, running does not</b>. A worker adds a second thread for <b>running</b>. Waiting was never the problem, so a worker around an `await` adds message passing and serialisation and solves nothing.\n\n---\n\n## Worker thread vs child process\n\n### Worker thread\n\n```text\nSame process\nDifferent thread\nCan share certain memory\nLower overhead\nGreat for CPU-heavy JS\n```\n\n### Child process\n\n```text\nSeparate process\nSeparate memory\nStrong isolation\nCan run other programs\nUseful for system commands\n```\n\n```text\nCPU-heavy JavaScript\n        ↓\nWorker Thread\n```\n\nversus:\n\n```text\nRun Python / ffmpeg / shell command\n        ↓\nChild Process\n```\n\nThe short version: <b>is the work JavaScript?</b> If yes, a worker. If it is another program, a child process. And if a crash must not touch you, a child process regardless.\n\n---\n\n## Cluster\n\n```javascript\nimport cluster from \"node:cluster\";\n```\n\n<b>Cluster</b> (running multiple Node processes that can share server ports).\n\n```text\n               Load\n                ↓\n          Primary Process\n        ┌───────┼───────┐\n        ↓       ↓       ↓\n     Worker   Worker   Worker\n     Process  Process  Process\n```\n\nEach worker is a separate Node process.\n\n---\n\n## Why use it?\n\nOn a machine with:\n\n```text\n8 CPU cores\n```\n\na single Node process runs JavaScript on one main thread. Cluster creates several processes:\n\n```text\nCPU 1 → Node process\nCPU 2 → Node process\nCPU 3 → Node process\nCPU 4 → Node process\n...\n```\n\nso an HTTP service can use more cores.\n\nThe distinction from a worker: cluster is about <b>throughput across many requests</b>, a worker is about one request not blocking the others. Different problems. Cluster does not help a single slow endpoint at all, it just means fewer requests queue behind it.\n\n---\n\n## Modern deployment changes the picture\n\nYou do not always need:\n\n```text\ncluster\n```\n\nto use multiple CPUs. You can run multiple containers:\n\n```text\nDocker\n ├── Node container\n ├── Node container\n ├── Node container\n └── Node container\n```\n\n```text\nLoad Balancer\n      ↓\n┌─────┼─────┐\n↓     ↓     ↓\nApp   App   App\n```\n\nOften easier to operate.\n\n---\n\n## Cluster vs containers\n\n### Cluster\n\n```text\nOne machine\n    ↓\nmultiple Node processes\n```\n\n### Containers\n\n```text\nInfrastructure\n    ↓\nmultiple application instances\n```\n\nContainers generally give better deployment and scaling flexibility. So ask:\n\n> <b>Can my infrastructure simply run more application instances?</b>\n\nUsually yes.\n\nAnd there is a concrete argument beyond preference. Cluster puts <b>all your processes on one machine</b>, so that machine is a single point of failure and you cannot scale past it. Containers spread across machines, scale by changing a number, and get restarts and health checks from the orchestrator you already run.\n\nCluster also gives you a supervisor to write and maintain: which worker died, when to replace it, how to roll a restart. Kubernetes does all of that already.\n\nOne place cluster still earns its keep: a single machine you control, no orchestrator, and you want the other cores. A VPS running one service is a reasonable fit.\n\nAnd Day 6's warning applies here. `os.cpus().length` reports the <b>host</b> machine's cores, so a container limited to one core still sees 64 and cluster happily starts 64 processes for it. Use `os.availableParallelism()`.",
      diagram: `Three tools, three different problems

    async I/O        one request WAITING          Node already
                                                  does this

    worker thread    one request COMPUTING        so it does not
                     without blocking others      block the loop

    cluster /        MANY requests across         throughput
    containers       many cores


Worker vs child process, in one question

    "Is the work JavaScript?"
                │
        ┌───────┴───────┐
       YES             NO
        │               │
    worker thread   child process
    lower cost,     (python, ffmpeg,
    can share       git, openssl)
    memory
        │
    and if a crash must NOT touch you:
    child process regardless


Cluster does not fix a slow endpoint

    one endpoint takes 2 seconds of CPU

    cluster    still 2 seconds. you just have N threads
               to block instead of one, so fewer requests
               queue behind it.
    worker     the 2 seconds happens off the request
               thread. the endpoint is still slow.

    different problems. neither makes the work smaller.


Cluster vs containers: the concrete argument

    CLUSTER                       CONTAINERS
    ┌──────────────────────┐      ┌──────────────────────┐
    │ ONE machine          │      │ many machines        │
    │ single point of      │      │ spread out           │
    │ failure              │      │                      │
    │ cannot scale past it │      │ scale = change a     │
    │                      │      │ number               │
    │ YOU write the        │      │ restarts and health  │
    │ supervisor: who      │      │ checks come from the │
    │ died, when to        │      │ orchestrator you     │
    │ replace, how to roll │      │ already run          │
    └──────────────────────┘      └──────────────────────┘

    cluster still earns its keep on a single machine
    you control, with no orchestrator, when you want
    the other cores. a VPS running one service.


Day 6's warning, again

    container limited to 1 core, on a 64-core host

    os.cpus().length          →  64   the HOST
    os.availableParallelism() →  1    usable

    cluster sized from the first number starts 64
    processes for one core.`,
      codeExample: {
        title: "Picking the right one",
        code: `import os from "node:os";

// ── The Day 6 warning, which decides cluster sizing ─────────
console.log("os.cpus().length:        ", os.cpus().length);
console.log("availableParallelism():  ", os.availableParallelism());
//
// In a container the first is the HOST's cores. Sizing a
// cluster or a worker pool from it starts 64 processes for
// one core.


// ── Workers do not help waiting ─────────────────────────────
// ✗ pointless
// const worker = new Worker("./query.js");
// worker.postMessage({ sql: "SELECT * FROM users" });
//
// ✓ Node already parallelises this
// const [users, orders] = await Promise.all([
//   db.query("SELECT * FROM users"),
//   db.query("SELECT * FROM orders"),
// ]);
//
// Day 3: waiting overlaps, running does not. A worker adds
// a thread for RUNNING. Waiting was never the problem.


// ── Worker or child process? Is the work JavaScript? ────────
// resize an image with sharp (native, CPU-bound JS binding)
//   → worker thread
//
// resize an image with ImageMagick
//   → child process (execFile)
//
// parse a 200MB JSON file
//   → worker thread
//
// run a python model
//   → child process
//
// anything where a crash must not touch you
//   → child process, whatever the work is


// ── A worker pool, created once ─────────────────────────────
import { Worker } from "node:worker_threads";

class Pool {
  #workers = [];
  #queue = [];

  constructor(file, size = os.availableParallelism()) {
    for (let i = 0; i < size; i += 1) {
      const w = new Worker(file);
      w.on("error", (e) => console.error("worker died:", e.message));
      this.#workers.push({ worker: w, busy: false });
    }
  }

  run(payload) {
    return new Promise((resolve, reject) => {
      this.#queue.push({ payload, resolve, reject });
      this.#next();
    });
  }

  #next() {
    const slot = this.#workers.find((w) => !w.busy);
    const job = this.#queue.shift();
    if (!slot || !job) return;

    slot.busy = true;
    slot.worker.once("message", (result) => {
      slot.busy = false;
      job.resolve(result);
      this.#next();
    });
    slot.worker.postMessage(job.payload);
  }

  async close() {
    await Promise.all(this.#workers.map((w) => w.worker.terminate()));
  }
}
//
// Created at startup, sized from availableParallelism, reused
// for every request. Not one worker per request.


// ── Cluster or containers? ──────────────────────────────────
// running under Kubernetes, ECS, Cloud Run?
//   → containers. replicas is a number you change, and
//     restarts and health checks already exist.
//
// one VPS you control, no orchestrator, want the cores?
//   → cluster is a reasonable fit
//
// and note cluster does not fix a slow endpoint. it means
// fewer requests queue behind it.`,
      },
      keyTakeaways: [
        "<b>Workers do not make I/O faster.</b> Day 3's rule: waiting overlaps, running does not.",
        "A worker adds a thread for <b>running</b>. Waiting was never the problem Node had.",
        "So a worker wrapped around an `await` adds serialisation and solves nothing.",
        "Worker or child process? <b>Is the work JavaScript?</b> Yes means worker, another program means child.",
        "And if a crash must not touch you, a child process regardless of the work.",
        "<b>Cluster</b> runs several Node processes sharing a port, for throughput across many requests.",
        "A worker is about one request not blocking others. Different problem.",
        "<b>Cluster does not fix a slow endpoint.</b> It just means fewer requests queue behind it.",
        "Cluster puts every process on <b>one machine</b>, which is a single point of failure you cannot scale past.",
        "It also means writing your own supervisor, which your orchestrator already does.",
        "Containers spread across machines and scale by changing a number.",
        "Cluster still fits a single machine with no orchestrator when you want the other cores.",
        "Day 6 again: size pools from <b>`os.availableParallelism()`</b>, not `os.cpus().length`.",
      ],
      commonMistakes: [
        "<b>Wrapping a database query in a worker</b> — that is waiting, and Node already parallelises it.",
        "<b>Expecting cluster to fix a slow endpoint</b> — the work is the same size, you just block more threads.",
        "<b>Adding cluster under Kubernetes</b> — you now have two layers of process management doing the same job.",
        "<b>Sizing a cluster or pool from `os.cpus().length`</b> — in a container that is the host's core count.",
        "<b>Creating a worker per request</b> — a fresh V8 isolate every time. Pool at startup.",
        "<b>Using a worker for something that must not crash your process</b> — a worker shares it. Use a child process.",
        "<b>Assuming cluster is obsolete</b> — on a single machine with no orchestrator it is still the right answer.",
      ],
      quiz: [
        {
          question: "Why does wrapping a database query in a worker thread not help?",
          options: [
            "Workers cannot open sockets",
            "The query is waiting, not computing, and Node already parallelises waiting",
            "Workers are slower at I/O",
            "It does help",
          ],
          correctIndex: 1,
          explanation:
            "Day 3's distinction. A worker gives you a second thread for running JavaScript, and the query was never using the first one. You add message passing and gain nothing.",
        },
        {
          question: "You have one endpoint that burns two seconds of CPU. What does cluster do for it?",
          options: [
            "Makes it take one second",
            "Nothing for that endpoint. You just have more threads to block, so fewer requests queue behind it",
            "Moves the work off the request thread",
            "Splits the work across cores automatically",
          ],
          correctIndex: 1,
          explanation:
            "Cluster is throughput across requests. Moving that work off the request thread is a worker's job, and even then the endpoint is still slow.",
        },
        {
          question: "What is the concrete argument for containers over cluster?",
          options: [
            "Containers are faster",
            "Cluster confines every process to one machine and makes you write the supervisor your orchestrator already provides",
            "Cluster does not work in Docker",
            "Containers use less memory",
          ],
          correctIndex: 1,
          explanation:
            "One machine is a single point of failure you cannot scale past, and restarts, health checks and rolling updates all already exist in your orchestrator.",
        },
      ],
    },
    {
      id: "shared-memory",
      title: "SharedArrayBuffer and MessageChannel",
      durationMinutes: 10,
      explanation:
        "## `SharedArrayBuffer`\n\n<b>`SharedArrayBuffer`</b> (memory that can be shared between JavaScript contexts such as worker threads).\n\nNormally:\n\n```text\nMain Thread\n    ↓\nsend data\n    ↓\nWorker\n```\n\nData travels as messages. With shared memory:\n\n```text\nMain Thread ──────┐\n                  ↓\n            Shared Memory\n                  ↑\n                  │\nWorker Thread ────┘\n```\n\nBoth reach the same underlying memory. Powerful, and harder to reason about safely.\n\nThe reason it exists is the copy. Sending a 500MB `ArrayBuffer` costs a real copy, and transferring it moves ownership so only one side can use it. A `SharedArrayBuffer` lets <b>both</b> read and write the same bytes with no copy at all, which is the only option when several workers need the same large dataset at once.\n\nThe constraint: it holds <b>bytes</b>, not objects. You get an `ArrayBuffer` and put a typed array over it, exactly as in Day 7. There is no way to share a JavaScript object, so anything structured has to be encoded into bytes yourself.\n\n---\n\n## Shared memory creates new problems\n\nTwo threads on the same data gives you a <b>race condition</b> (when the result depends on the timing of concurrent operations).\n\n```text\nThread A reads 10\nThread B reads 10\n\nA adds 1 → 11\nB adds 1 → 11\n\nExpected → 12\nActual   → 11\n```\n\nWhich is why shared memory needs synchronisation, such as:\n\n```text\nAtomics\n```\n\nWorth appreciating how new this is. Everything up to now has been single-threaded JavaScript, where `count += 1` is <b>indivisible</b> because nothing else can run between the read and the write. Day 3's whole point was that the event loop cannot interrupt you.\n\nShared memory removes that guarantee. `count += 1` is now three steps, read, add, write, and another thread can land between them. This is the one place in Node where you genuinely have to think about concurrent memory access.\n\n`Atomics.add()` does the whole read-modify-write as one uninterruptible operation, which is what fixes the example above. `Atomics.wait` and `Atomics.notify` let a thread block until a value changes, which is how you build a real queue.\n\nAnd honestly: most applications never need this. The copy is usually fine, and the bugs here are the hardest kind to reproduce. Reach for it when you have measured that the copy is your bottleneck.\n\n---\n\n## `MessageChannel`\n\n<b>`MessageChannel`</b> (two connected message ports that can talk to each other).\n\n```text\nPort 1\n  ↕\nMessageChannel\n  ↕\nPort 2\n```\n\n```javascript\nimport {\n  MessageChannel\n} from \"node:worker_threads\";\n\nconst {\n  port1,\n  port2\n} = new MessageChannel();\n```\n\n```javascript\nport1.postMessage(\"Hello\");\n```\n\n```javascript\nport2.on(\"message\", message => {\n  console.log(message);\n});\n```\n\nWhat it is genuinely for: <b>two workers talking directly</b>. Without it, worker A messages the main thread which messages worker B, so your main thread becomes a router for traffic that has nothing to do with it. Create a channel, transfer one port to each worker, and they talk without involving you.\n\nA port is transferable, so it can be sent inside a `postMessage` transfer list.\n\nIt is also useful for a clean request/response pair: send one port along with a request and the reply comes back on that specific channel, rather than matching ids on a shared message handler.\n\nAnd remember to `close()` a port you are finished with. An open port keeps the event loop alive, which is a quiet way to stop your process exiting.",
      diagram: `Three ways to get data to a worker

    postMessage(obj)              structured clone
                                  a COPY. Date/Map survive.

    postMessage(buf, [buf])       TRANSFER
                                  ownership moves, no copy,
                                  original unusable

    SharedArrayBuffer             SHARED
                                  both sides read and write
                                  the same bytes, no copy,
                                  both stay usable
                                    └─ the only option when
                                       several workers need
                                       the same large dataset


What shared memory takes away

    single-threaded JavaScript
      count += 1  is INDIVISIBLE
        nothing can run between the read and the write.
        Day 3: the event loop cannot interrupt you.

    shared memory
      count += 1  is THREE steps
        read → add → write
              ▲
              └─ another thread can land here

    thread A reads 10        thread B reads 10
    A adds 1 → writes 11     B adds 1 → writes 11
    expected 12, actual 11

    Atomics.add() does all three as ONE uninterruptible
    operation.

    this is the ONE place in Node where you have to think
    about concurrent memory access.


    and honestly: most applications never need it.
    the copy is usually fine, and these bugs are the
    hardest kind to reproduce.


MessageChannel: so the main thread is not a router

    WITHOUT                       WITH
    worker A                      worker A
       │  message                    │
       ↓                             │ direct
    MAIN THREAD  ← routing           │
       │           traffic it        │
       ↓           does not care     ↓
    worker B       about           worker B

    create a channel, transfer one port to each worker.

    a port is transferable, so it fits in a transfer list.
    close() one you are done with, or it keeps the event
    loop alive and your process will not exit.`,
      codeExample: {
        title: "Shared memory, atomics, and a direct channel",
        code: `import { Worker, MessageChannel } from "node:worker_threads";
import fs from "node:fs";

// ── The race, demonstrated ──────────────────────────────────
fs.writeFileSync(
  "increment.mjs",
  \`import { workerData } from "node:worker_threads";
   const view = new Int32Array(workerData.shared);
   for (let i = 0; i < 100_000; i += 1) {
     if (workerData.safe) Atomics.add(view, 0, 1);
     else view[0] += 1;                    // read, add, write
   }\`,
);

async function count(safe) {
  const shared = new SharedArrayBuffer(4);
  const view = new Int32Array(shared);

  const workers = [0, 1, 2, 3].map(
    () => new Worker("./increment.mjs", { workerData: { shared, safe } }),
  );
  await Promise.all(workers.map((w) => new Promise((r) => w.once("exit", r))));

  return view[0];
}

console.log("unsafe:", await count(false), "of 400000");
// unsafe: 137492 of 400000        ← wildly wrong, and the
//                                    number differs every run
console.log("safe:  ", await count(true), "of 400000");
// safe:   400000 of 400000
//
// In single-threaded JavaScript "view[0] += 1" is
// indivisible. With shared memory it is read, add, write,
// and another thread can land in the middle.


// ── Three ways to get a buffer across ───────────────────────
const copied = new ArrayBuffer(1024);
const transferred = new ArrayBuffer(1024);
const shared = new SharedArrayBuffer(1024);

// postMessage(copied)                  a copy
// postMessage(transferred, [transferred])  ownership moves,
//                                          original unusable
// postMessage(shared)                  both sides share it,
//                                      both stay usable
console.log(copied.byteLength, transferred.byteLength, shared.byteLength);
//
// Shared holds BYTES, not objects. Put a typed array over
// it, exactly as in Day 7. There is no sharing a JS object.


// ── MessageChannel: two workers talking directly ────────────
const { port1, port2 } = new MessageChannel();

port2.on("message", (message) => console.log("port2 got:", message));
port1.postMessage("Hello");

await new Promise((r) => setTimeout(r, 10));

port1.close();
port2.close();
//   an open port keeps the event loop alive, which is a
//   quiet way to stop your process exiting

// The real use: give each worker one end, so worker A and
// worker B talk without the main thread routing traffic it
// does not care about.
//
// const { port1, port2 } = new MessageChannel();
// workerA.postMessage({ peer: port1 }, [port1]);
// workerB.postMessage({ peer: port2 }, [port2]);


// ── When to reach for any of this ───────────────────────────
// measured that the COPY is your bottleneck?   → shared
// several workers need the same large dataset? → shared
// otherwise                                    → do not
//
// These are the hardest bugs to reproduce, and the copy is
// usually fine.

fs.rmSync("increment.mjs", { force: true });`,
      },
      keyTakeaways: [
        "`SharedArrayBuffer` lets threads read and write the <b>same bytes with no copy</b>.",
        "Three options: `postMessage` copies, a transfer list moves ownership, a shared buffer shares.",
        "Shared is the only one where both sides can still use it, which is what several workers on one dataset need.",
        "It holds <b>bytes, not objects</b>. Put a typed array over it, as in Day 7.",
        "In single-threaded JavaScript, `count += 1` is <b>indivisible</b>, because nothing can interrupt you.",
        "With shared memory it is three steps, read, add, write, and another thread can land between them.",
        "That is a <b>race condition</b>, and this is the one place in Node where concurrent memory access is a real concern.",
        "`Atomics.add()` performs the whole read-modify-write as one uninterruptible operation.",
        "`Atomics.wait` and `Atomics.notify` let a thread block until a value changes.",
        "Most applications never need any of this. The copy is usually fine, and these bugs are the hardest to reproduce.",
        "`MessageChannel` gives two connected ports, so <b>two workers can talk directly</b>.",
        "Without it your main thread routes traffic it does not care about. A port is transferable.",
        "`close()` a port you are done with, or it keeps the event loop alive and the process will not exit.",
      ],
      commonMistakes: [
        "<b>`view[0] += 1` on shared memory</b> — three separate steps, so concurrent threads lose updates. Use `Atomics`.",
        "<b>Expecting to share a JavaScript object</b> — a `SharedArrayBuffer` holds bytes. Encode structure yourself.",
        "<b>Reaching for shared memory before measuring</b> — the copy is usually fine and these bugs barely reproduce.",
        "<b>Routing worker-to-worker traffic through the main thread</b> — that is what `MessageChannel` is for.",
        "<b>Forgetting to `close()` a port</b> — it keeps the event loop alive and your process never exits.",
        "<b>Assuming a transferred buffer is still usable</b> — its `byteLength` becomes 0. That is the point.",
      ],
      quiz: [
        {
          question: "Why is `view[0] += 1` unsafe on a `SharedArrayBuffer` when it was always safe before?",
          options: [
            "Shared buffers are read-only",
            "It is three steps, read, add, write, and with real threads another one can land in the middle",
            "Typed arrays cannot be incremented",
            "It needs an await",
          ],
          correctIndex: 1,
          explanation:
            "Single-threaded JavaScript made it indivisible: the event loop cannot interrupt you. Shared memory removes that guarantee, which is why `Atomics.add` exists.",
        },
        {
          question: "What does a `SharedArrayBuffer` let you do that a transfer list does not?",
          options: [
            "Send objects instead of bytes",
            "Let both sides keep using the same memory, rather than moving ownership to one",
            "Avoid using typed arrays",
            "Send data faster",
          ],
          correctIndex: 1,
          explanation:
            "A transfer moves ownership and leaves the original unusable. Sharing is the only option when several workers need the same large dataset at once.",
        },
        {
          question: "What is `MessageChannel` genuinely for?",
          options: [
            "Faster messaging to the main thread",
            "Letting two workers talk directly, so the main thread is not routing traffic it does not care about",
            "Sharing memory between threads",
            "Replacing `postMessage`",
          ],
          correctIndex: 1,
          explanation:
            "Transfer one port to each worker and they communicate without you in the middle. Remember to `close()` a port, or it keeps the event loop alive.",
        },
      ],
    },
    {
      id: "choosing",
      title: "Choosing the simplest tool",
      durationMinutes: 10,
      explanation:
        "## The three main choices\n\n```text\n                 Your problem\n                     │\n        ┌────────────┼────────────┐\n        ↓            ↓            ↓\n      I/O         CPU work    External program\n        │            │            │\n        ↓            ↓            ↓\n  Async APIs     Worker       Child Process\n                 Thread\n```\n\nand:\n\n```text\nNeed many Node server instances?\n        ↓\nMultiple processes / containers\n        ↓\nCluster or infrastructure scaling\n```\n\n---\n\n## Do not use workers for everything\n\nBad architecture:\n\n```text\nHTTP request\n    ↓\nWorker\n    ↓\nDatabase query\n    ↓\nWorker\n    ↓\nHTTP response\n```\n\nif the worker is not doing real CPU work. You have added:\n\n```text\nmessage passing\nserialization\ncomplexity\n```\n\nwithout solving anything.\n\nAnd it is usually <b>slower</b>. A worker per request costs a fresh V8 isolate, and the round trip adds serialisation in both directions. For an operation that was only ever waiting, that is pure overhead on top of code that is now harder to read and debug.\n\n---\n\n## The decision tree\n\n```text\nIs it normal async I/O?\n        │\n       Yes\n        ↓\nUse normal async APIs\n\nIs it CPU-heavy JavaScript?\n        │\n       Yes\n        ↓\nWorker Thread\n\nDo I need to run another program?\n        │\n       Yes\n        ↓\nChild Process\n\nDo I need separate process isolation?\n        │\n       Yes\n        ↓\nChild Process\n\nDo I need more application instances?\n        │\n       Yes\n        ↓\nUsually containers / orchestration\n```\n\n---\n\n## The step before the tree\n\nThe tree assumes you know which branch you are on, and that is the part people get wrong. So <b>measure first</b>.\n\nDay 4 gave you the tool: watch how late a fixed-interval timer fires. If a slow endpoint does <b>not</b> delay the heartbeat, you are waiting, and no worker will help. If it does, you are computing, and now the tree applies.\n\nThat one check separates the two branches, and it takes three lines. Guessing costs you an afternoon building a worker pool for a slow database query.\n\n---\n\n## The fourth option nobody lists\n\nWorth naming, because it is often the right answer: <b>do not do the work during the request at all</b>.\n\nA thumbnail, a report, a video transcode: accept the request, return `202` with an id, put the job on a queue, and let a separate process handle it. The user polls or gets a webhook.\n\nThat beats a worker on every axis that matters in production. The work survives a deploy, it retries on failure, you can see the backlog, and you can scale the workers independently of the web tier. A worker thread gives you none of that, and a request that takes 30 seconds is a bad experience however cleanly you offload it.\n\nSo the honest order:\n\n```text\n1. Is it just waiting?          async APIs. done.\n2. Can it happen later?         a queue.\n3. CPU-bound and must be now?   worker thread.\n4. Another program?             child process.\n5. Need more capacity?          containers.\n```\n\nMost of the time the answer is 1 or 2, and 3 through 5 are for the cases that genuinely need them.\n\n---\n\n## Day 11 in one picture\n\n```text\n                 Node.js\n                    │\n          ┌─────────┴─────────┐\n          ↓                   ↓\n      Main Thread         Other execution\n          │                   │\n          │          ┌────────┴─────────┐\n          │          ↓                  ↓\n          │       Worker             Child\n          │       Thread             Process\n          │          │                  │\n          │       CPU work       External program\n          │\n          ↓\n      Event Loop\n```\n\n> <b>Do not reach for a worker because something is slow. First work out whether you are waiting on I/O or burning CPU. Node is already very good at asynchronous I/O; worker threads are for CPU-bound JavaScript that would otherwise block the event loop.</b>",
      diagram: `Measure before you choose

    Day 4's tool, three lines:

      setInterval(heartbeat, 1000)
      measure how LATE it fires

    slow endpoint, heartbeat fine     →  you are WAITING
                                          no worker will help
    slow endpoint, heartbeat late     →  you are COMPUTING
                                          now the tree applies

    guessing costs you an afternoon building a worker
    pool for a slow database query.


The fourth option nobody lists

    a thumbnail, a report, a video transcode

    WORKER THREAD                  A QUEUE
    ┌──────────────────────┐       ┌──────────────────────┐
    │ request waits 30s    │       │ 202 + an id, instantly│
    │ lost on deploy       │       │ survives a deploy    │
    │ no retry             │       │ retries on failure   │
    │ no visibility        │       │ you can see the      │
    │                      │       │ backlog              │
    │ scales with the web  │       │ scales independently │
    │ tier                 │       │                      │
    └──────────────────────┘       └──────────────────────┘

    a 30-second request is a bad experience however
    cleanly you offload it.


The honest order

    1  just waiting?             async APIs. done.
    2  can it happen later?      a queue.
    3  CPU-bound, must be now?   worker thread.
    4  another program?          child process.
    5  need more capacity?       containers.

    most of the time the answer is 1 or 2.


Do not do this

    HTTP request → Worker → database query → Worker → response

    if the worker does no real CPU work you have added
    message passing, serialisation and complexity, and
    it is USUALLY SLOWER: a fresh V8 isolate plus a
    round trip, for an operation that was only waiting.`,
      codeExample: {
        title: "Measure first, then choose",
        code: `// ══ STEP 1: measure. Day 4's tool. ═════════════════════════
let last = performance.now();
const heartbeat = setInterval(() => {
  const now = performance.now();
  const lateness = Math.round(now - last - 500);
  last = now;
  if (lateness > 50) console.log(\`heartbeat \${lateness}ms late\`);
}, 500);
heartbeat.unref();

// now exercise the slow endpoint and watch.
//
//   heartbeat stays on time  →  you are WAITING.
//                                no worker will help.
//   heartbeat runs late      →  you are COMPUTING.
//                                now choose a tool.
//
// Three lines, and it separates the two branches. Guessing
// costs you an afternoon building a pool for a slow query.


// ══ STEP 2: pick, in this order ════════════════════════════

// ── 1. Just waiting? Async APIs, and stop. ──────────────────
// const [users, orders] = await Promise.all([
//   db.query("SELECT * FROM users"),
//   db.query("SELECT * FROM orders"),
// ]);


// ── 2. Can it happen later? A queue. ────────────────────────
// app.post("/videos", async (req, res) => {
//   const job = await queue.add("transcode", { id: req.body.id });
//   res.status(202).json({ jobId: job.id });      // instantly
// });
//
// survives a deploy, retries on failure, backlog is visible,
// and the workers scale separately from the web tier.
//
// A worker thread gives you none of that, and a 30-second
// request is a bad experience however cleanly you offload it.


// ── 3. CPU-bound and must be now? A pooled worker. ──────────
// const result = await pool.run({ image: buffer });
//   pool created at startup, sized from
//   os.availableParallelism(). Not one per request.


// ── 4. Another program? A child process. ────────────────────
// await execFileAsync("ffmpeg", ["-i", input, output]);
//   execFile, not exec, so there is no shell to inject into.


// ── 5. Need more capacity? Containers. ──────────────────────
// replicas: 4
//   restarts, health checks and rolling updates already
//   exist in the orchestrator you are running.


// ══ And the one to avoid ═══════════════════════════════════
// app.get("/users", async (req, res) => {
//   const worker = new Worker("./query-worker.js");     ✗
//   worker.postMessage({ sql: "SELECT * FROM users" });
//   worker.on("message", (rows) => res.json(rows));
// });
//
// A fresh V8 isolate per request, plus serialisation both
// ways, for an operation that was only ever waiting. Slower
// than the obvious version, and harder to debug.

clearInterval(heartbeat);
console.log("measure first, then choose");`,
      },
      keyTakeaways: [
        "The tree assumes you know which branch you are on, which is the part people get wrong.",
        "<b>Measure first.</b> Day 4's heartbeat tells you whether you are waiting or computing, in three lines.",
        "Heartbeat stays on time means waiting, so no worker will help. Late means computing.",
        "A worker around a database query adds a fresh isolate and two serialisations, and is <b>usually slower</b>.",
        "The <b>fourth option nobody lists</b>: do not do the work during the request at all.",
        "A queue beats a worker on everything that matters in production.",
        "The work survives a deploy, retries on failure, has a visible backlog, and scales separately from the web tier.",
        "A 30-second request is a bad experience however cleanly you offload it.",
        "The order: async APIs, then a queue, then a worker, then a child process, then containers.",
        "Most of the time the answer is one of the first two.",
        "Worker threads are for <b>CPU-bound JavaScript that would otherwise block the event loop</b>. Nothing else.",
      ],
      commonMistakes: [
        "<b>Choosing a tool before measuring</b> — the heartbeat check takes three lines and settles it.",
        "<b>A worker per request</b> — a fresh V8 isolate every time, plus serialisation both directions.",
        "<b>A worker for a slow query</b> — that is waiting. Slower than doing nothing at all.",
        "<b>A worker for work that could happen later</b> — a queue gives you retries, durability and visibility.",
        "<b>Making the user wait 30 seconds, cleanly offloaded</b> — return `202` and an id instead.",
        "<b>Adding cluster under an orchestrator</b> — two layers of process management doing the same job.",
        "<b>Reaching for the exotic tools first</b> — async APIs and a queue cover most of it.",
      ],
      quiz: [
        {
          question: "Before choosing between async APIs, a worker and a child process, what should you do?",
          options: [
            "Benchmark all three",
            "Measure whether the slow work delays a fixed-interval heartbeat, which tells you if you are waiting or computing",
            "Check the core count",
            "Profile the database",
          ],
          correctIndex: 1,
          explanation:
            "Day 4's tool, three lines. If a slow endpoint does not delay the heartbeat you are waiting, and no worker will help. That one check separates the branches.",
        },
        {
          question: "A user requests a video transcode that takes 30 seconds. What is usually the right answer?",
          options: [
            "A worker thread, to keep the loop responsive",
            "A queue: return 202 with an id and let a separate process do the work",
            "A child process running ffmpeg inline",
            "Cluster, for more capacity",
          ],
          correctIndex: 1,
          explanation:
            "A queue gives durability across deploys, retries, a visible backlog and independent scaling. A 30-second request is a bad experience however cleanly you offload it inside the process.",
        },
        {
          question: "Why is a worker per request usually slower than not using one?",
          options: [
            "Workers cannot access the database",
            "You pay for a fresh V8 isolate plus serialisation in both directions, for work that was only waiting",
            "Message passing blocks the event loop",
            "It is not slower",
          ],
          correctIndex: 1,
          explanation:
            "The overhead is real and the benefit is zero when the operation was never using the CPU. You also end up with code that is harder to read and debug.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What question should you answer before reaching for a worker or a child process?",
      options: [
        "How many cores do I have?",
        "Am I waiting on I/O, or burning CPU?",
        "ESM or CommonJS?",
        "How big is the payload?",
      ],
      correctIndex: 1,
      explanation:
        "Node already parallelises waiting through libuv's thread pool. Workers exist for the case it cannot help with, which is computation on the main thread.",
    },
    {
      question: "You `spawn` a chatty command and its `'close'` event never fires. Why?",
      options: [
        "The command crashed",
        "Nothing reads `stdout`, so the pipe buffer fills, the child blocks writing, and it never exits",
        "You need `stdio: \"pipe\"`",
        "You should listen for `'exit'`",
      ],
      correctIndex: 1,
      explanation:
        "Those are streams with backpressure. Consume both, pipe both, or pass `stdio: \"ignore\"`. Handling `stdout` and forgetting `stderr` is the usual version.",
    },
    {
      question: "Why is filtering shell metacharacters the wrong answer to command injection?",
      options: [
        "It is slow",
        "The shell is behaving correctly, and your filter must be perfect while an attacker needs one gap",
        "Node escapes them already",
        "It breaks valid input",
      ],
      correctIndex: 1,
      explanation:
        "`execFile` removes the shell, so the class of attack is gone rather than defended against. Same move as Day 6's file-id lookup.",
    },
    {
      question: "A child process is OOM-killed. What does `'close'` report?",
      options: [
        "`code: 137, signal: null`",
        "`code: null, signal: \"SIGKILL\"`",
        "`code: 1, signal: null`",
        "Nothing fires",
      ],
      correctIndex: 1,
      explanation:
        "Exactly one of the pair is non-null. Checking only the code makes an OOM kill look like a clean exit, and the work silently did not happen.",
    },
    {
      question: "You block the main thread for one second with a 100ms `setInterval`. How many ticks fire?",
      options: ["About 10, all late", "Zero", "One", "About 10, on time"],
      correctIndex: 1,
      explanation:
        "`setInterval` does not queue missed intervals. That is why the right proof is tick count against expected, not tick lateness.",
    },
    {
      question: "Moving a one-second calculation into a worker. What happens to the elapsed time?",
      options: ["It halves", "It stays about the same", "It becomes instant", "It doubles"],
      correctIndex: 1,
      explanation:
        "Measured at 1093ms against 1101ms. The worker moves the work off the thread that answers requests. It does not make the work smaller.",
    },
    {
      question: "Why is `view[0] += 1` unsafe on a `SharedArrayBuffer`?",
      options: [
        "Shared buffers are read-only",
        "It is read, add, write, and with real threads another one can land in the middle",
        "Typed arrays are immutable",
        "It needs an await",
      ],
      correctIndex: 1,
      explanation:
        "Single-threaded JavaScript made that indivisible, because the event loop cannot interrupt you. Shared memory removes the guarantee, which is why `Atomics` exists.",
    },
    {
      question: "What is the concrete argument for containers over cluster?",
      options: [
        "Containers are faster",
        "Cluster confines everything to one machine and makes you write the supervisor your orchestrator already provides",
        "Cluster does not work in Docker",
        "Containers use less memory",
      ],
      correctIndex: 1,
      explanation:
        "One machine is a single point of failure you cannot scale past, and restarts, health checks and rolling updates already exist in the orchestrator.",
    },
    {
      question: "A request needs 30 seconds of CPU work. What is usually the right answer?",
      options: [
        "A worker thread",
        "A queue: return 202 with an id and process it separately",
        "Cluster",
        "A child process",
      ],
      correctIndex: 1,
      explanation:
        "A queue survives deploys, retries, shows you the backlog and scales independently. A 30-second request is a bad experience however cleanly you offload it in-process.",
    },
  ],
  project: {
    name: "day-11",
    goal: "Prove, with numbers, that CPU-heavy JavaScript blocks the event loop and that a worker thread stops it doing so.",
    brief:
      "Getting a worker to run is the easy half. The valuable half is the measurement, and the obvious measurement is wrong. A blocked event loop does not fire late timers, it fires none at all, because setInterval does not queue up intervals it missed. So counting ticks against how many should have fired is the proof, and measuring tick lateness will show you almost nothing. Expect roughly 0 ticks of 10 on the main thread and 10 of 11 in a worker, with the elapsed time barely changing either way.",
    steps: [
      "Create `day-11/` with `package.json` containing `\"type\": \"module\"`, a `main.js` and a `worker.js`.",
      "Write `heavyCalculation(n)` that loops `n` times summing `Math.sqrt(i)`. Pick an `n` that takes about a second.",
      "In `main.js`, start a `setInterval` that increments a counter every 100ms, and record `performance.now()` before you begin.",
      "Run the calculation on the main thread, then clear the interval and print elapsed time, ticks fired, and how many should have fired.",
      "Now move the calculation into `worker.js`, receiving `n` on `parentPort` and posting the result back.",
      "In `main.js`, create the `Worker`, post `n`, await the reply, and take the same three measurements.",
      "Compare the two runs. The tick count is the interesting number, not the elapsed time.",
      "Add an `'error'` handler on the worker, and check what happens without one when the worker throws.",
    ],
    acceptance: [
      "The main-thread run fires close to zero ticks while roughly ten were expected.",
      "The worker run fires close to the expected number of ticks.",
      "Elapsed time is similar in both runs, and you can say why that is the expected result rather than a failure.",
      "You can explain why counting ticks is the right measurement and tick lateness is not.",
      "Both runs print elapsed time, ticks fired and ticks expected, so the comparison is in the output rather than in your head.",
      "The worker is terminated when the work is done, and the process exits on its own.",
      "An uncaught throw inside the worker is surfaced through the `'error'` event rather than killing the process silently.",
    ],
    stretch: [
      "Split the work across `os.availableParallelism()` workers and see whether total time drops roughly in proportion.",
      "Build a small worker pool created once at startup, and compare its per-job cost against creating a worker per job.",
      "Add an HTTP server and hit `/health` with curl during both runs, so you can see the blocked version time out.",
      "Pass the input as a `SharedArrayBuffer` instead of a message, and compare the transfer cost for a large array.",
      "Use `Atomics.add` from several workers writing to one shared counter, then remove the `Atomics` and watch the total come out wrong.",
    ],
  },
};
