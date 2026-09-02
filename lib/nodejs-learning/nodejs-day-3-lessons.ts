import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_3_LESSONS: LessonDay = {
  day: 3,
  title: "The event loop and async",
  totalMinutes: 100,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "single-thread-nonblocking",
      title: "Single-threaded, non-blocking, and why async is not parallel",
      durationMinutes: 10,
      explanation:
        "This is one of the <b>most important topics in Node.js</b>. Understand the event loop properly and you understand why Node can handle thousands of connections while running your JavaScript on a single main thread.\n\nThe shape of the whole day:\n\n```text\nJavaScript\n    ↓\nCall Stack\n    ↓\nEvent Loop\n    ↓\nAsync I/O\n    ↓\nCallback / Promise continuation\n```\n\n---\n\n## Node.js is single-threaded\n\nYour JavaScript runs on one main thread:\n\n```javascript\nconsole.log(\"A\");\nconsole.log(\"B\");\nconsole.log(\"C\");\n```\n\nOne thing at a time:\n\n```text\nA\n↓\nB\n↓\nC\n```\n\nSo the obvious question:\n\n> \"If Node.js has one thread, how can it handle many requests?\"\n\nThe answer: <b>non-blocking asynchronous I/O</b>.\n\n---\n\n## What non-blocking actually means\n\n<b>Non-blocking</b> (starting an operation without making the JavaScript thread wait for it to finish).\n\nA request arrives:\n\n```text\nRequest\n   ↓\nDatabase query\n   ↓\nWAIT 500ms\n```\n\nA blocking system does this:\n\n```text\nRequest 1\n   ↓\nDatabase\n   ↓\nWAIT\n   ↓\nResponse\n\nRequest 2\n   ↓\nDatabase\n   ↓\nWAIT\n   ↓\nResponse\n```\n\nNode avoids that waiting:\n\n```text\nRequest 1\n   ↓\nStart database query\n   ↓\nContinue doing other work\n\nRequest 2\n   ↓\nStart database query\n   ↓\nContinue doing other work\n\nDatabase 1 finishes\n   ↓\nHandle result\n\nDatabase 2 finishes\n   ↓\nHandle result\n```\n\n> <b>Node.js does not wait doing nothing while I/O is happening.</b>\n\n---\n\n## Async does not mean parallel\n\nThis distinction matters enormously, and getting it wrong leads people to expect speedups that never arrive.\n\n<b>Asynchronous</b> (an operation can finish later without blocking the current JavaScript execution).\n\n<b>Parallel</b> (multiple operations literally executing at the same instant).\n\nYour JavaScript still runs sequentially:\n\n```text\nJavaScript\n     ↓\nOne piece at a time\n```\n\nBut Node hands certain operations off to the operating system:\n\n```text\nJavaScript execution\n        ↓\n   single thread\n\nI/O operations\n        ↓\ncan happen independently\n```\n\nThe practical consequence: <b>waiting overlaps, running does not</b>. Ten database queries can be in flight at once, because waiting is not work your thread does. Ten heavy calculations cannot overlap at all, because each one needs the thread.\n\nThat single sentence predicts nearly everything else today. When people say \"async made no difference\", it is almost always because the slow part was computation, not waiting.\n\n```javascript\n// Overlaps: waiting is handed off\nawait Promise.all([queryA(), queryB(), queryC()]);\n\n// Does not overlap: each needs the thread\nheavyCalculation();\nheavyCalculation();\nheavyCalculation();\n```",
      diagram: `The question, and the answer

    one thread + many requests = how?
              │
              └─►  because waiting is not work

    blocking                    non-blocking
    ─────────────────────────────────────────────────
    req 1  ██──WAIT 500ms──██   req 1  ██─ ─ ─ ─ ─██
    req 2       ██──WAIT──██    req 2  ██─ ─ ─ ─ ─██
    req 3            ██──WAIT   req 3  ██─ ─ ─ ─ ─██
                                       │
    ~1500ms total               ~500ms total
                                ██ = thread busy
                                ─  = OS waiting


Async vs parallel: what actually overlaps

    WAITING overlaps                RUNNING does not
    ┌──────────────────────┐        ┌──────────────────────┐
    │ query A  ─ ─ ─ ─ ─   │        │ calc A  ████         │
    │ query B  ─ ─ ─ ─ ─   │        │ calc B      ████     │
    │ query C  ─ ─ ─ ─ ─   │        │ calc C          ████ │
    │                      │        │                      │
    │ all in flight at     │        │ one at a time, each  │
    │ once, thread free    │        │ needs the thread     │
    └──────────────────────┘        └──────────────────────┘

    This is why "I added async and nothing got faster"
    almost always means the slow part was computation.`,
      codeExample: {
        title: "Waiting overlaps, running does not",
        code: `import { setTimeout as sleep } from "node:timers/promises";

// ── Fake I/O: waiting, handed off to the OS ─────────────────
async function fakeQuery(label, ms) {
  await sleep(ms);
  return label;
}

// Sequential: three waits, one after another
let start = performance.now();
await fakeQuery("a", 300);
await fakeQuery("b", 300);
await fakeQuery("c", 300);
console.log(\`sequential: \${Math.round(performance.now() - start)}ms\`);
// ~900ms

// Concurrent: three waits at the same time
start = performance.now();
await Promise.all([
  fakeQuery("a", 300),
  fakeQuery("b", 300),
  fakeQuery("c", 300),
]);
console.log(\`concurrent: \${Math.round(performance.now() - start)}ms\`);
// ~300ms   ← waiting overlapped


// ── Real work: no overlap available ─────────────────────────
function heavyCalculation() {
  let total = 0;
  for (let i = 0; i < 200_000_000; i += 1) total += i;
  return total;
}

start = performance.now();
await Promise.all([
  (async () => heavyCalculation())(),
  (async () => heavyCalculation())(),
  (async () => heavyCalculation())(),
]);
console.log(\`three calcs: \${Math.round(performance.now() - start)}ms\`);
//
// Same as running them one by one. Promise.all did nothing,
// because each calculation needs the single thread. Wrapping
// CPU work in async syntax does not make it concurrent.
//
// This is the difference between ASYNC and PARALLEL.`,
      },
      keyTakeaways: [
        "Your JavaScript runs on a <b>single main thread</b>, one piece at a time.",
        "<b>Non-blocking</b> means starting an operation without making the thread wait for it.",
        "Node can serve many requests on one thread because waiting is not work the thread does.",
        "<b>Asynchronous</b> means \"can finish later\". <b>Parallel</b> means \"running at the same instant\".",
        "<b>Waiting overlaps. Running does not.</b> That one sentence predicts most of this day.",
        "Ten queries can be in flight at once. Ten heavy calculations cannot.",
        "\"I added async and nothing got faster\" almost always means the slow part was computation, not waiting.",
      ],
      commonMistakes: [
        "<b>Expecting `Promise.all` to speed up CPU work</b> — it only overlaps waiting. Three calculations still run one after another.",
        "<b>Reading \"single-threaded\" as \"one user at a time\"</b> — the opposite. A thread that never waits idle serves thousands.",
        "<b>Wrapping a synchronous function in `async`</b> — that does not make it asynchronous. It still holds the thread while it runs.",
        "<b>Assuming Node uses no threads at all</b> — the runtime uses a thread pool for some I/O, but <i>your JavaScript</i> stays on one thread.",
      ],
      quiz: [
        {
          question: "You wrap three heavy `for`-loop calculations in `Promise.all`. What happens to the total time?",
          options: [
            "It drops to roughly the time of one calculation",
            "It stays roughly the same as running them one after another",
            "Node moves them onto separate threads automatically",
            "It gets faster only in production",
          ],
          correctIndex: 1,
          explanation:
            "`Promise.all` overlaps <i>waiting</i>, and there is none here. Each calculation needs the single thread, so they run one after another regardless of the async syntax around them.",
        },
        {
          question: "What is the difference between asynchronous and parallel?",
          options: [
            "They mean the same thing in Node",
            "Asynchronous means it can finish later; parallel means running at the same instant",
            "Asynchronous is faster than parallel",
            "Parallel only applies to timers",
          ],
          correctIndex: 1,
          explanation:
            "Node gives you asynchrony on one thread: operations can finish later, so waiting overlaps. It does not give you parallel JavaScript execution, so running does not overlap.",
        },
      ],
    },
    {
      id: "call-stack-and-queue",
      title: "The call stack, the callback queue and the event loop",
      durationMinutes: 10,
      explanation:
        "Three pieces, and the relationship between them is the whole mechanism.\n\n---\n\n## The call stack\n\n<b>Call stack</b> (the structure JavaScript uses to track which functions are currently executing).\n\n```javascript\nfunction one() {\n  two();\n}\n\nfunction two() {\n  console.log(\"Hello\");\n}\n\none();\n```\n\nExecution goes:\n\n```text\none()\n ↓\ntwo()\n ↓\nconsole.log()\n```\n\nThe stack:\n\n```text\n┌───────────────┐\n│ console.log() │\n├───────────────┤\n│ two()         │\n├───────────────┤\n│ one()         │\n└───────────────┘\n```\n\nEach finished function is removed:\n\n```text\nconsole.log()\n     ↓\nremoved\n\ntwo()\n     ↓\nremoved\n\none()\n     ↓\nremoved\n```\n\nOne thing worth noticing: <b>nothing asynchronous can run while the stack has anything on it</b>. That is the mechanical reason a long loop blocks everything.\n\n---\n\n## The callback queue\n\n<b>Callback queue</b> (a queue holding callbacks that are ready to run).\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 0);\n\nconsole.log(\"Hello\");\n```\n\nOutput:\n\n```text\nHello\nTimer\n```\n\nWhy? The timer callback does not jump onto the stack. Even with a `0` delay it waits its turn:\n\n```text\nsetTimeout()\n    ↓\nTimer registered\n    ↓\nCall stack continues\n\nconsole.log(\"Hello\")\n    ↓\nCall stack empty\n\nTimer callback\n    ↓\nQueue\n    ↓\nEvent loop\n    ↓\nCall stack\n```\n\nSo `setTimeout(fn, 0)` does not mean \"now\". It means \"as soon as the stack is empty and it is the timers phase's turn\".\n\n---\n\n## The event loop\n\n<b>Event loop</b> (the mechanism that decides when a queued callback may run on the JavaScript thread).\n\n```text\n             ┌──────────────┐\n             │  Call Stack  │\n             └──────┬───────┘\n                    │\n                    ↓\n              Event Loop\n                    │\n                    ↓\n             Callback Queues\n                    │\n                    ↓\n             Async Operations\n```\n\nIt is asking, over and over:\n\n> \"Is the JavaScript stack empty, and is there work ready to run?\"\n\nIf yes, it pushes that work onto the stack.\n\nThat conditional is the important part. The event loop <b>cannot interrupt you</b>. It only gets a turn when your code has finished and the stack is empty. Nothing is preempted, and nothing runs \"in the background\" as far as your JavaScript is concerned.\n\nThis is why the phrase \"blocking the event loop\" makes sense at all. You are not blocking a separate system, you are simply never giving it a turn.",
      diagram: `The three pieces

    ┌──────────────────┐
    │   CALL STACK     │  your functions, one at a time
    │  ┌────────────┐  │  nothing async runs while this
    │  │ console.log│  │  has anything on it
    │  ├────────────┤  │
    │  │ two()      │  │
    │  ├────────────┤  │
    │  │ one()      │  │
    │  └────────────┘  │
    └────────┬─────────┘
             │ empty?
             ↓
    ┌──────────────────┐
    │   EVENT LOOP     │  "stack empty AND work ready?"
    └────────┬─────────┘  it CANNOT interrupt you
             │            it only gets a turn when
             ↓            your code has finished
    ┌──────────────────┐
    │  CALLBACK QUEUES │  callbacks waiting their turn
    └────────┬─────────┘
             ↓
    ┌──────────────────┐
    │ ASYNC OPERATIONS │  the OS doing the waiting
    └──────────────────┘


Why setTimeout(fn, 0) is not "now"

    setTimeout(() => log("Timer"), 0)
    log("Hello")

    stack:  setTimeout registers ──► timer queued
            log("Hello")         ──► "Hello"
            stack empty
                    │
            event loop gets its first turn
                    ↓
            timer callback runs ──► "Timer"

    Hello
    Timer

    0 means "as soon as the stack is empty and it is
    the timers phase's turn", not "immediately".`,
      codeExample: {
        title: "The stack runs first, always",
        code: `// ── The call stack ──────────────────────────────────────────
function one() {
  two();
}

function two() {
  console.log("Hello");
}

one();
//   one()  →  two()  →  console.log()  →  unwind


// ── The queue waits for the stack to empty ──────────────────
setTimeout(() => console.log("Timer"), 0);
console.log("Hello");

// Hello
// Timer
//
// Even with a 0 delay. The callback is queued, and the event
// loop only gets a turn once the stack is empty.


// ── Proof that 0 does not mean now ──────────────────────────
setTimeout(() => console.log("timer, delay 0"), 0);

const start = Date.now();
while (Date.now() - start < 1000) {
  // holding the stack for a full second
}

console.log("sync work done");

// sync work done
// timer, delay 0        ← ~1000ms late
//
// The timer was ready after 0ms. It could not run, because
// the stack was never empty. The event loop cannot interrupt.


// ── The event loop is not a background thread ───────────────
let ticks = 0;
const interval = setInterval(() => {
  ticks += 1;
  if (ticks === 3) clearInterval(interval);
  console.log("tick", ticks);
}, 100);

// These ticks only fire in the gaps where your code is not
// running. Nothing about them is preemptive.`,
      },
      keyTakeaways: [
        "The <b>call stack</b> tracks the functions currently executing, one at a time.",
        "Nothing asynchronous can run while the stack has anything on it.",
        "A ready callback goes into a <b>queue</b>, not straight onto the stack.",
        "`setTimeout(fn, 0)` means \"as soon as the stack is empty and it is the timers phase's turn\", not \"now\".",
        "The <b>event loop</b> asks, repeatedly: is the stack empty, and is there work ready?",
        "The event loop <b>cannot interrupt your code</b>. It only gets a turn when the stack empties.",
        "That is why \"blocking the event loop\" is possible: you are never giving it a turn.",
      ],
      commonMistakes: [
        "<b>Reading `setTimeout(fn, 0)` as \"run immediately\"</b> — it runs after the current stack unwinds, which could be much later.",
        "<b>Expecting a timer to fire on time during heavy sync work</b> — it fires when the stack empties. A one-second loop delays it by a second.",
        "<b>Thinking the event loop runs on its own thread alongside your code</b> — it gets the same single thread, only when you are done with it.",
        "<b>Assuming a queued callback can preempt a running function</b> — nothing in Node interrupts JavaScript mid-function.",
      ],
      quiz: [
        {
          question: "You schedule `setTimeout(fn, 0)` and then run a synchronous loop for one second. When does `fn` run?",
          options: [
            "After 0ms, interrupting the loop",
            "After roughly one second, once the stack is empty",
            "Never, the timer is cancelled",
            "Halfway through the loop",
          ],
          correctIndex: 1,
          explanation:
            "The callback is ready after 0ms but cannot run until the stack empties. The event loop has no way to interrupt a running function, so it waits out the whole second.",
        },
        {
          question: "What question is the event loop repeatedly asking?",
          options: [
            "Which callback has waited longest?",
            "Is the call stack empty, and is there work ready to run?",
            "Which thread is free?",
            "Has any promise rejected?",
          ],
          correctIndex: 1,
          explanation:
            "It needs both conditions. Work being ready is not enough, because the stack must be empty before anything can be pushed onto it.",
        },
      ],
    },
    {
      id: "event-loop-phases",
      title: "The event loop phases, and setTimeout vs setImmediate",
      durationMinutes: 14,
      explanation:
        "The event loop is not one queue, it is a cycle through several. Knowing the names helps you reason about ordering.\n\n---\n\n## The phases\n\n```text\n1. Timers\n2. Pending callbacks\n3. Poll\n4. Check\n5. Close callbacks\n```\n\nThose are the phases of the underlying libuv loop. You will often see <b>microtasks</b> listed as a sixth, but they are not a phase. Microtasks are drained <b>between</b> callbacks and around phase transitions, which is why they beat everything else. The next lesson covers them.\n\n```text\n        ┌─────────────┐\n        │   Timers    │\n        └──────┬──────┘\n               ↓\n     Pending callbacks\n               ↓\n             Poll\n               ↓\n             Check\n               ↓\n       Close callbacks\n               │\n               └──────→ repeat\n```\n\n---\n\n## Phase 1 — Timers\n\nHandles callbacks scheduled by:\n\n```javascript\nsetTimeout()\nsetInterval()\n```\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Timer\");\n}, 100);\n```\n\n> `100` milliseconds does <b>not</b> mean the callback runs exactly 100ms later.\n\nIt means: do not run this before 100ms have elapsed. A timer is a <b>minimum</b> delay, not a schedule. Other work may already be in progress when the deadline passes.\n\n---\n\n## Phase 2 — Pending callbacks\n\nHandles certain system-level I/O callbacks deferred from a previous cycle, such as some TCP error conditions. You will not interact with this directly.\n\n---\n\n## Phase 3 — Poll\n\nThe most important phase for a server. It handles I/O callbacks:\n\n```text\nFile I/O\nNetwork I/O\nSocket activity\n```\n\n```text\nWaiting for I/O\n       ↓\nI/O completes\n       ↓\nCallback becomes ready\n       ↓\nPoll phase processes it\n```\n\nThis is also where the loop <b>blocks and waits</b> when there is nothing else to do, which is what keeps an idle Node process from spinning the CPU.\n\n---\n\n## Phase 4 — Check\n\nHandles:\n\n```javascript\nsetImmediate()\n```\n\n```javascript\nsetImmediate(() => {\n  console.log(\"Immediate\");\n});\n```\n\nThe pairing to remember:\n\n```text\nsetTimeout()\n    ↓\nTimers phase\n\nsetImmediate()\n    ↓\nCheck phase\n```\n\nDespite the name, `setImmediate` is not immediate. It means \"right after the poll phase of this cycle\".\n\n---\n\n## Phase 5 — Close callbacks\n\nHandles cleanup callbacks for closing resources:\n\n```javascript\nsocket.on(\"close\", () => {\n  console.log(\"Socket closed\");\n});\n```\n\n```text\nSocket\n   ↓\nclose\n   ↓\nclose callback\n```\n\n---\n\n## `setTimeout` vs `setImmediate`\n\nA classic interview question.\n\n```javascript\nsetTimeout(() => {\n  console.log(\"timeout\");\n}, 0);\n\nsetImmediate(() => {\n  console.log(\"immediate\");\n});\n```\n\nYou might expect a fixed answer. There is not one. At the <b>top level</b> the order is not deterministic, because it depends on how long the process took to start relative to the timer's threshold. Run it a few times and you may see it flip.\n\nInside an <b>I/O callback</b>, the order is reliable:\n\n```javascript\nimport fs from \"node:fs\";\n\nfs.readFile(\"file.txt\", () => {\n  setTimeout(() => {\n    console.log(\"timeout\");\n  }, 0);\n\n  setImmediate(() => {\n    console.log(\"immediate\");\n  });\n});\n```\n\nTypically:\n\n```text\nimmediate\ntimeout\n```\n\nBecause you are already in the poll phase, and check comes straight after it:\n\n```text\nPoll\n ↓\nCheck\n ↓\nsetImmediate()\n```\n\nwhile the timer has to wait for the next cycle's timers phase.\n\n### The rule\n\n```text\nsetTimeout()\n    ↓\nTimers phase\n\nsetImmediate()\n    ↓\nCheck phase\n```\n\nDo not memorise \"setTimeout always runs before setImmediate\". That is wrong. Learn which phase each belongs to, and where your code currently sits in the cycle.\n\nAnd in application code, do not depend on this ordering at all. If two things must happen in a specific order, express that with promises or by calling one from the other. Relying on phase ordering makes code that breaks when someone moves it into a different callback.",
      diagram: `One cycle of the loop

    ┌──────────────────────────────────────────────┐
    │                                              │
    ↓                                              │
  TIMERS            setTimeout, setInterval        │
    ↓               (minimum delay, not exact)     │
  PENDING           deferred system I/O            │
    ↓               (you never touch this)         │
  POLL              file and network I/O           │
    ↓               ← blocks here when idle        │
  CHECK             setImmediate                   │
    ↓                                              │
  CLOSE             socket.on("close")             │
    │                                              │
    └──────────────────────────────────────────────┘

    microtasks drain BETWEEN every callback above,
    which is why they are not a phase


setTimeout vs setImmediate: it depends where you are

    at the TOP LEVEL              non-deterministic
      setTimeout(fn, 0)           depends on startup timing
      setImmediate(fn)            run it twice, order may flip

    inside an I/O CALLBACK        reliable
      you are in POLL
            ↓
          CHECK  ──► setImmediate runs first
            ↓
      next cycle
            ↓
         TIMERS  ──► setTimeout runs second

    immediate
    timeout


The names both lie

    setTimeout(fn, 100)   "not before 100ms", not "at 100ms"
    setImmediate(fn)      "after this cycle's poll",
                          not "immediately"

    Do not rely on phase ordering in application code.
    If order matters, express it with promises.`,
      codeExample: {
        title: "Watching the phases decide the order",
        code: `import fs from "node:fs";

// ── Timers are a MINIMUM delay, not a schedule ──────────────
const t0 = Date.now();
setTimeout(() => {
  console.log(\`timer fired after \${Date.now() - t0}ms\`);   // often >100
}, 100);

// any sync work here pushes that number up


// ── Top level: order is NOT deterministic ───────────────────
setTimeout(() => console.log("timeout (top level)"), 0);
setImmediate(() => console.log("immediate (top level)"));
//
// Run this a few times. The order can flip, because it
// depends on how long startup took relative to the timer
// threshold. Never rely on it.


// ── Inside an I/O callback: order IS reliable ───────────────
fs.readFile(import.meta.filename, () => {
  setTimeout(() => console.log("timeout (in I/O)"), 0);
  setImmediate(() => console.log("immediate (in I/O)"));
});

// immediate (in I/O)
// timeout (in I/O)
//
// You are already in POLL. CHECK comes next in the same
// cycle, so setImmediate wins. The timer waits for the
// next cycle's TIMERS phase.


// ── Which phase each thing belongs to ───────────────────────
// setTimeout / setInterval   →  TIMERS
// fs / net / http callbacks  →  POLL
// setImmediate               →  CHECK
// socket.on("close")         →  CLOSE
// promises / nextTick        →  between everything (next lesson)


// ── What to do instead of relying on ordering ───────────────
// ✗ fragile: depends on which phase you happen to be in
// setImmediate(() => step2());
// step1();
//
// ✓ explicit: the order is in the code
// await step1();
// await step2();`,
      },
      keyTakeaways: [
        "The libuv loop has five phases: <b>timers, pending callbacks, poll, check, close callbacks</b>.",
        "Microtasks are <b>not</b> a phase. They drain between callbacks, which is why they beat everything.",
        "A timer delay is a <b>minimum</b>. `setTimeout(fn, 100)` means \"not before 100ms\".",
        "The <b>poll</b> phase handles file and network I/O, and blocks there when the process is idle.",
        "`setTimeout` belongs to timers. `setImmediate` belongs to check.",
        "`setImmediate` is not immediate. It means \"after this cycle's poll phase\".",
        "At the top level, `setTimeout(fn, 0)` versus `setImmediate` ordering is <b>not deterministic</b>.",
        "Inside an I/O callback, `setImmediate` reliably runs first, because check follows poll in the same cycle.",
        "Never rely on phase ordering in application code. If order matters, express it with promises.",
      ],
      commonMistakes: [
        "<b>Memorising \"setTimeout runs before setImmediate\"</b> — it is not true at the top level and the reverse inside I/O callbacks.",
        "<b>Expecting `setTimeout(fn, 100)` to fire at exactly 100ms</b> — it is a floor, and sync work pushes it later.",
        "<b>Reading `setImmediate` as \"now\"</b> — `process.nextTick` is much closer to \"now\". `setImmediate` waits for the check phase.",
        "<b>Using `setTimeout(fn, 0)` to \"yield\" between operations</b> — `setImmediate` expresses that intent properly and does not go through the timer machinery.",
        "<b>Building logic on phase ordering</b> — it breaks the moment the code moves into a different callback. Use promises to express order.",
        "<b>Treating `setInterval` as an exact metronome</b> — a slow callback delays the next tick, and the drift accumulates.",
      ],
      quiz: [
        {
          question: "Inside an `fs.readFile` callback you schedule both `setTimeout(fn, 0)` and `setImmediate(fn)`. Which runs first, and why?",
          options: [
            "`setTimeout`, because 0ms has already elapsed",
            "`setImmediate`, because check follows poll in the same cycle",
            "Whichever was written first",
            "The order is random",
          ],
          correctIndex: 1,
          explanation:
            "An I/O callback runs in the poll phase, and the check phase comes next in that same cycle. The timer has to wait for the next cycle's timers phase.",
        },
        {
          question: "What does `setTimeout(fn, 100)` actually guarantee?",
          options: [
            "`fn` runs exactly 100ms later",
            "`fn` runs within 100ms",
            "`fn` will not run before 100ms have elapsed",
            "`fn` runs after 100 event loop cycles",
          ],
          correctIndex: 2,
          explanation:
            "A timer delay is a minimum, not a schedule. If the stack is busy or other phases have work, the callback fires later than 100ms.",
        },
        {
          question: "Why are microtasks not counted as an event loop phase?",
          options: [
            "They run on a separate thread",
            "They are drained between callbacks and around phase transitions, not in a slot of their own",
            "They only exist in browsers",
            "They run before the process starts",
          ],
          correctIndex: 1,
          explanation:
            "The five phases are the libuv cycle. Microtasks are drained after each callback completes, which is exactly why they take priority over anything sitting in a phase queue.",
        },
      ],
    },
    {
      id: "microtasks",
      title: "Microtasks, process.nextTick and starvation",
      durationMinutes: 12,
      explanation:
        "Now the part that explains most surprising log orders.\n\n---\n\n## Microtasks\n\n<b>Microtask</b> (a small piece of async work with higher scheduling priority than normal event-loop callbacks).\n\nThe microtasks you will meet:\n\n```text\nPromise.then()\nPromise.catch()\nPromise.finally()\nqueueMicrotask()\n```\n\nAnd Node adds one with even higher priority:\n\n```text\nprocess.nextTick()\n```\n\n---\n\n## `process.nextTick()`\n\n<b>`process.nextTick()`</b> (schedules a callback to run after the current operation completes, before the event loop continues).\n\n```javascript\nconsole.log(\"A\");\n\nprocess.nextTick(() => {\n  console.log(\"B\");\n});\n\nconsole.log(\"C\");\n```\n\nOutput:\n\n```text\nA\nC\nB\n```\n\nThe synchronous code finishes first:\n\n```text\nA\nC\n```\n\nthen Node drains the `nextTick` queue.\n\n---\n\n## `queueMicrotask()`\n\n<b>`queueMicrotask()`</b> (schedules a function in the microtask queue).\n\n```javascript\nconsole.log(\"A\");\n\nqueueMicrotask(() => {\n  console.log(\"B\");\n});\n\nconsole.log(\"C\");\n```\n\n```text\nA\nC\nB\n```\n\nIt behaves like a promise microtask:\n\n```javascript\nqueueMicrotask(() => {\n  console.log(\"microtask\");\n});\n\nPromise.resolve().then(() => {\n  console.log(\"promise\");\n});\n```\n\nBoth are microtask-style work, and they share one queue in the order they were scheduled.\n\n---\n\n## Two queues, not one\n\nThe detail that resolves most ordering puzzles: `nextTick` has its <b>own queue</b>, and it is drained <b>completely</b> before the promise microtask queue is touched.\n\n```javascript\nPromise.resolve().then(() => console.log(\"promise\"));\nprocess.nextTick(() => console.log(\"nextTick\"));\n```\n\n```text\nnextTick\npromise\n```\n\nEven though the promise was scheduled first.\n\n---\n\n## Microtasks vs macrotasks\n\n<b>Macrotask</b> (a general term for event-loop tasks such as timers and I/O callbacks).\n\n<b>Microtask</b> (higher-priority async work such as promise reactions and `queueMicrotask()`).\n\n```text\nSynchronous JavaScript\n        ↓\nMicrotasks\n        ↓\nEvent-loop callbacks\n```\n\n```javascript\nconsole.log(\"A\");\n\nsetTimeout(() => {\n  console.log(\"B\");\n}, 0);\n\nPromise.resolve().then(() => {\n  console.log(\"C\");\n});\n\nconsole.log(\"D\");\n```\n\nOutput:\n\n```text\nA\nD\nC\nB\n```\n\n```text\nA\nD\n ↓\nPromise microtask\n ↓\nC\n ↓\nTimer\n ↓\nB\n```\n\nThe full priority order, worth committing to memory:\n\n```text\n1. synchronous code\n2. process.nextTick queue   (drained fully)\n3. promise microtask queue  (drained fully)\n4. the current event loop phase\n```\n\n---\n\n## Starvation\n\n<b>Starvation</b> (when one kind of work continuously prevents other work from running).\n\n```javascript\nfunction loop() {\n  process.nextTick(loop);\n}\n\nloop();\n```\n\nEach callback schedules another:\n\n```text\nnextTick\n ↓\nnextTick\n ↓\nnextTick\n ↓\nnextTick\n ↓\n...\n```\n\nBecause the `nextTick` queue is drained <b>completely</b> before moving on, and you keep adding to it, the event loop never gets to a phase. No timers, no I/O, no HTTP responses.\n\n> <b>Event-loop starvation.</b>\n\nAnd note this is worse than a plain `while (true)`. An infinite loop at least looks like an infinite loop. This one looks like ordinary async code, and it will pin your server with the CPU pegged and no obvious culprit.\n\nThe same trap exists with recursive promise chains. It does <b>not</b> exist with `setImmediate`, because a callback added during the check phase waits for the next cycle rather than being drained in this one:\n\n```javascript\nfunction loop() {\n  setImmediate(loop);   // yields between iterations, safe\n}\n```\n\nThat is the practical rule. Recursive work should use `setImmediate`, never `process.nextTick`.\n\nHonestly, in application code you rarely need `process.nextTick` at all. Reach for a promise. `nextTick` exists mainly for library authors who need to defer something until after the current operation but before anything else can observe the state.",
      diagram: `The priority order, top to bottom

    1  synchronous code            runs to completion
              ↓
    2  process.nextTick queue      drained COMPLETELY
              ↓
    3  promise microtask queue     drained COMPLETELY
              ↓
    4  the event loop phase        timers / poll / check


    console.log("A")                    A
    setTimeout(() => log("B"), 0)       D    ← sync first
    Promise.resolve().then(log("C"))    C    ← microtask
    console.log("D")                    B    ← timer last


nextTick beats promises, even when scheduled later

    Promise.resolve().then(() => log("promise"))
    process.nextTick(() => log("nextTick"))

    nextTick        ← its own queue, drained first
    promise

    Two queues, not one.


Starvation: why "drained completely" is dangerous

    function loop() {
      process.nextTick(loop)      ✗ never yields
    }

    nextTick queue: [loop]
      drain → schedules loop → [loop]
      drain → schedules loop → [loop]
      drain → ...

    the loop NEVER reaches a phase:
      no timers, no I/O, no HTTP responses

    worse than while(true), because it looks like
    ordinary async code


    function loop() {
      setImmediate(loop)          ✓ yields each cycle
    }

    added during CHECK → waits for the NEXT cycle
    poll and timers still get their turn`,
      codeExample: {
        title: "The full priority order, and the starvation trap",
        code: `// ── Sync, then microtasks, then phases ──────────────────────
console.log("1  sync");

setTimeout(() => console.log("6  timer"), 0);
setImmediate(() => console.log("5  immediate"));

Promise.resolve().then(() => console.log("4  promise"));
queueMicrotask(() => console.log("4b microtask"));
process.nextTick(() => console.log("3  nextTick"));

console.log("2  sync");

// 1  sync
// 2  sync
// 3  nextTick        ← its own queue, drained first
// 4  promise         ← microtask queue, in scheduling order
// 4b microtask
// 5  immediate       ← check phase
// 6  timer           ← timers phase


// ── nextTick wins even when scheduled last ──────────────────
Promise.resolve().then(() => console.log("promise"));
process.nextTick(() => console.log("nextTick"));
// nextTick
// promise


// ── Microtasks drain BETWEEN callbacks, not once ────────────
setTimeout(() => {
  console.log("timer 1");
  Promise.resolve().then(() => console.log("  microtask from timer 1"));
}, 0);

setTimeout(() => console.log("timer 2"), 0);

// timer 1
//   microtask from timer 1     ← before timer 2, not after
// timer 2


// ── Starvation: do NOT do this ──────────────────────────────
// function starve() {
//   process.nextTick(starve);
// }
// starve();
//
// The nextTick queue is drained completely before the loop
// moves on, and you keep refilling it. No timers, no I/O,
// no responses. CPU pegged, and it looks like normal
// async code, which makes it hard to spot.


// ── The safe version of recursive work ──────────────────────
let n = 0;
function safeLoop() {
  n += 1;
  if (n < 3) setImmediate(safeLoop);   // yields each cycle
  console.log("iteration", n);
}
safeLoop();
//
// setImmediate callbacks added during CHECK wait for the
// next cycle, so poll and timers still get their turn.`,
      },
      keyTakeaways: [
        "Priority order: <b>sync code → `nextTick` queue → promise microtasks → the event loop phase</b>.",
        "`process.nextTick` has its <b>own queue</b>, drained completely before promise microtasks.",
        "So `nextTick` runs before a `.then()` even when the promise was scheduled first.",
        "`queueMicrotask()` and promise reactions share one queue, in scheduling order.",
        "Microtasks drain <b>between</b> callbacks, so a microtask queued inside timer 1 runs before timer 2.",
        "<b>Starvation</b>: recursive `process.nextTick` refills a queue that must drain completely, so the loop never reaches a phase.",
        "That is worse than `while (true)`, because it looks like ordinary async code.",
        "Recursive work should use `setImmediate`, which yields between cycles.",
        "In application code you rarely need `nextTick` at all. Use a promise.",
      ],
      commonMistakes: [
        "<b>Recursively scheduling `process.nextTick`</b> — it starves the loop completely. Use `setImmediate` for recursive work.",
        "<b>Expecting `.then()` to run before `nextTick`</b> — the `nextTick` queue is separate and goes first, regardless of scheduling order.",
        "<b>Thinking microtasks drain only once per cycle</b> — they drain after every callback, which is why they can delay the next timer.",
        "<b>Reaching for `nextTick` in application code</b> — it is a library-author tool. A promise is almost always what you want.",
        "<b>Assuming a long promise chain is harmless</b> — a recursive chain starves the loop the same way `nextTick` does.",
        "<b>Debugging a pegged CPU by looking only for loops</b> — a recursive `nextTick` has no loop in sight.",
      ],
      quiz: [
        {
          question: "You schedule a promise `.then()` and then a `process.nextTick()`. Which callback runs first?",
          options: [
            "The `.then()`, because it was scheduled first",
            "The `nextTick`, because it has its own queue drained before microtasks",
            "They run in parallel",
            "Whichever the event loop reaches first, non-deterministically",
          ],
          correctIndex: 1,
          explanation:
            "`nextTick` is a separate queue with higher priority, drained fully before Node touches the promise microtask queue. Scheduling order between the two queues is irrelevant.",
        },
        {
          question: "Why does recursive `process.nextTick(loop)` starve the event loop, while recursive `setImmediate(loop)` does not?",
          options: [
            "`setImmediate` runs on a different thread",
            "The `nextTick` queue must drain completely, and you keep refilling it; `setImmediate` callbacks wait for the next cycle",
            "`setImmediate` has a built-in delay",
            "`nextTick` is synchronous",
          ],
          correctIndex: 1,
          explanation:
            "Draining completely means the loop cannot advance while you keep adding. A `setImmediate` scheduled during the check phase belongs to the next cycle, so poll and timers get their turn.",
        },
        {
          question: "`setTimeout` schedules timer 1 and timer 2. Timer 1's callback queues a promise microtask. When does that microtask run?",
          options: [
            "After timer 2",
            "Before timer 2",
            "At the end of the current cycle",
            "On the next event loop cycle",
          ],
          correctIndex: 1,
          explanation:
            "Microtasks drain after every callback completes, not once per cycle. So the microtask queued inside timer 1 runs before timer 2 gets its turn.",
        },
      ],
    },
    {
      id: "callbacks-to-promises",
      title: "From callbacks to promises",
      durationMinutes: 12,
      explanation:
        "How async code was written, why it got painful, and what replaced it.\n\n---\n\n## Callbacks\n\nA <b>callback</b> (a function passed to another function to be run later).\n\n```javascript\nfunction greet(name, callback) {\n  callback(`Hello ${name}`);\n}\n\ngreet(\"Rajan\", message => {\n  console.log(message);\n});\n```\n\nOlder Node APIs are built on them, with a convention worth recognising: the <b>error comes first</b>.\n\n```javascript\nfs.readFile(\"file.txt\", (error, data) => {\n  if (error) {\n    console.error(error);\n    return;\n  }\n\n  console.log(data);\n});\n```\n\nThat `error` first, then result shape is called an <b>errback</b>, and it is everywhere in older code. Note the `return` after handling the error. Forget it and execution continues with `data` as `undefined`.\n\n---\n\n## Callback hell\n\n<b>Callback hell</b> (deeply nested callbacks that make async code hard to read and maintain).\n\n```javascript\ngetUser(userId, (error, user) => {\n  getOrders(user.id, (error, orders) => {\n    getPayment(orders[0], (error, payment) => {\n      sendEmail(payment, (error, result) => {\n        console.log(result);\n      });\n    });\n  });\n});\n```\n\n```text\ncallback\n   ↓\n   callback\n      ↓\n      callback\n         ↓\n         callback\n```\n\nHard to read, debug and maintain. And look closely at the errors: there are four `error` parameters, each shadowing the last, and not one of them is handled. Getting error handling right in nested callbacks means repeating the same check at every level, which is exactly why people skipped it.\n\nPromises and `async/await` largely solve this.\n\n---\n\n## Promises\n\n<b>Promise</b> (an object representing the eventual success or failure of an async operation).\n\nThree states:\n\n```text\nPending\n   ↓\nFulfilled\n\nor\n\nPending\n   ↓\nRejected\n```\n\nOnce it settles it never changes again.\n\n```javascript\nconst promise = Promise.resolve(\"Success\");\n```\n\n---\n\n## `.then()`\n\n<b>`.then()`</b> (runs when a promise fulfills).\n\n```javascript\nfetchUser()\n  .then(user => {\n    console.log(user);\n  });\n```\n\n---\n\n## `.catch()`\n\n<b>`.catch()`</b> (handles a rejection, or an error thrown anywhere earlier in the chain).\n\n```javascript\nfetchUser()\n  .then(user => {\n    console.log(user);\n  })\n  .catch(error => {\n    console.error(error);\n  });\n```\n\nThat second part is the real gain over callbacks. <b>One</b> `.catch()` covers the whole chain, however long it is, instead of a check at every level.\n\n---\n\n## `.finally()`\n\n<b>`.finally()`</b> (runs once the promise settles, either way).\n\n```javascript\nfetchUser()\n  .then(user => {\n    console.log(user);\n  })\n  .catch(error => {\n    console.error(error);\n  })\n  .finally(() => {\n    console.log(\"Finished\");\n  });\n```\n\nUseful for cleanup:\n\n```text\nRequest\n   ↓\nSuccess / Failure\n   ↓\nCleanup\n```\n\nClosing a connection, clearing a spinner, releasing a lock. It receives no value, because it does not know or care which way things went.\n\n---\n\n## Turning a callback API into a promise\n\nMost of Node's own APIs already have promise versions:\n\n```javascript\nimport { readFile } from \"node:fs/promises\";\n\nconst data = await readFile(\"file.txt\", \"utf8\");\n```\n\nFor an old errback-style function you did not write, `promisify` converts it:\n\n```javascript\nimport { promisify } from \"node:util\";\n\nconst delay = promisify(setTimeout);\n```\n\nYou will rarely need to construct a promise by hand. When you do, the rule is: <b>reject with an `Error`</b>, never a string, or your catch block gets no stack trace.",
      diagram: `Callback hell, and what fixes it

    getUser(id, (err, user) => {
      getOrders(user.id, (err, orders) => {          ← err shadowed
        getPayment(orders[0], (err, payment) => {    ← err shadowed
          sendEmail(payment, (err, result) => {      ← err shadowed
            console.log(result)
          })
        })
      })
    })

    four error params, zero handled, growing rightward


    fetchUser()
      .then(user => getOrders(user.id))
      .then(orders => getPayment(orders[0]))
      .then(payment => sendEmail(payment))
      .catch(error => console.error(error))   ← ONE catch,
      .finally(() => cleanup())                 whole chain

    flat, and errors have one home


A promise settles exactly once

              new Promise
                   │
                pending
                   │
         ┌─────────┴─────────┐
         ↓                   ↓
     fulfilled            rejected
     .then(value)         .catch(error)
         └─────────┬─────────┘
                   ↓
              .finally()      no value, runs either way


The errback convention, in older APIs

    fs.readFile("f.txt", (error, data) => {
                          └─┬─┘  └─┬─┘
                          FIRST   second

      if (error) {
        handle(error)
        return            ← forget this and data is
      }                     undefined below
      use(data)
    })`,
      codeExample: {
        title: "The same job, three generations of syntax",
        code: `import { readFile } from "node:fs/promises";
import { promisify } from "node:util";
import fs from "node:fs";

// ═══ 1. Callbacks: the errback convention ═══════════════════
fs.readFile("file.txt", "utf8", (error, data) => {
  if (error) {
    console.error("failed:", error.message);
    return;                       // ← without this, data is undefined
  }
  console.log(data);
});


// ═══ 2. Callback hell ═══════════════════════════════════════
// getUser(userId, (error, user) => {
//   getOrders(user.id, (error, orders) => {
//     getPayment(orders[0], (error, payment) => {
//       sendEmail(payment, (error, result) => {
//         console.log(result);
//       });
//     });
//   });
// });
//
// Four error params, each shadowing the last, none handled.


// ═══ 3. Promises: flat, with one error handler ══════════════
fetchUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getPayment(orders[0]))
  .then((payment) => sendEmail(payment))
  .then((result) => console.log(result))
  .catch((error) => console.error("failed:", error.message))
  .finally(() => console.log("done either way"));
//
// One .catch() covers every step in the chain.


// ═══ Node's own promise APIs ════════════════════════════════
const data = await readFile("file.txt", "utf8");
console.log(data);
//   node:fs/promises, node:dns/promises, node:timers/promises


// ═══ Converting an old errback function ═════════════════════
function oldStyleLookup(id, callback) {
  setTimeout(() => {
    if (id > 0) callback(null, { id, name: "Rajan" });
    else callback(new Error("bad id"));
  }, 50);
}

const lookup = promisify(oldStyleLookup);
console.log(await lookup(1));           // { id: 1, name: "Rajan" }


// ═══ Constructing one by hand (rare) ════════════════════════
function fetchUser(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 1) resolve({ id: 1, name: "Rajan" });
      else reject(new Error(\`No user \${id}\`));   // ← an Error,
    }, 50);                                        //   never a string
  });
}`,
      },
      keyTakeaways: [
        "A <b>callback</b> is a function passed in to be run later.",
        "Older Node APIs use the <b>errback</b> convention: `(error, data)`, error first.",
        "Always `return` after handling an errback error, or execution continues with `undefined` data.",
        "<b>Callback hell</b> is nested callbacks growing rightward, with error handling repeated at every level.",
        "A <b>promise</b> is pending, then fulfilled or rejected. It settles exactly once.",
        "`.then()` handles success, `.catch()` handles failure, `.finally()` runs either way.",
        "<b>One `.catch()` covers the whole chain.</b> That is the real gain over callbacks.",
        "`.finally()` receives no value, because it does not know which way things went. Use it for cleanup.",
        "Node's own promise APIs live in `node:fs/promises` and friends. `util.promisify` converts old errback functions.",
        "When constructing a promise, reject with an `Error`, never a string.",
      ],
      commonMistakes: [
        "<b>Forgetting `return` after an errback error check</b> — the success path runs too, with `undefined` data.",
        "<b>Forgetting `.catch()` on a chain</b> — an unhandled rejection, which on modern Node crashes the process.",
        "<b>Putting `.catch()` before the `.then()`s</b> — it only catches what came before it. Put it last.",
        "<b>Rejecting with a string</b> — `reject(\"failed\")` gives your catch block no stack trace.",
        "<b>Expecting `.finally()` to receive the value</b> — it gets nothing, by design.",
        "<b>Nesting `.then()` inside `.then()`</b> — that recreates callback hell. Return the promise instead and chain flat.",
        "<b>Constructing a promise around an API that already returns one</b> — the \"explicit promise construction antipattern\". Just use it.",
      ],
      quiz: [
        {
          question: "What is the main advantage of a promise chain over nested callbacks?",
          options: [
            "Promises run faster",
            "One `.catch()` handles errors for the entire chain, instead of a check at every level",
            "Promises run in parallel automatically",
            "Promises do not need error handling",
          ],
          correctIndex: 1,
          explanation:
            "The nested version needs the same error check at every level, which is why it usually got skipped. A chain has one place for failures, however long it gets.",
        },
        {
          question: "In `fs.readFile(\"f.txt\", (error, data) => { if (error) console.error(error); console.log(data); })`, what is wrong?",
          options: [
            "The parameters are in the wrong order",
            "There is no `return` after handling the error, so `console.log(data)` runs with `undefined`",
            "`readFile` needs an encoding",
            "Nothing is wrong",
          ],
          correctIndex: 1,
          explanation:
            "Handling an errback error does not stop execution. Without `return`, the success path runs too and logs `undefined`.",
        },
        {
          question: "What does `.finally()` receive as its argument?",
          options: [
            "The fulfilled value",
            "The rejection reason",
            "Nothing",
            "Both, as two parameters",
          ],
          correctIndex: 2,
          explanation:
            "`.finally()` deliberately gets no value, because its job is cleanup that happens regardless of the outcome. It also passes the original result through untouched.",
        },
      ],
    },
    {
      id: "promise-combinators",
      title: "Promise.all, allSettled, race and any",
      durationMinutes: 10,
      explanation:
        "Four ways to combine promises. Choosing the wrong one is a common source of bugs, so it is worth being precise about what each guarantees.\n\n---\n\n## `Promise.all()`\n\n<b>`Promise.all()`</b> (waits for several promises, succeeding only if all succeed).\n\n```javascript\nconst results = await Promise.all([\n  fetchUser(),\n  fetchOrders(),\n  fetchProfile(),\n]);\n```\n\nThey start concurrently. If all succeed you get an array in the <b>same order you passed them</b>, not the order they finished:\n\n```text\nPromise.all()\n     ↓\n[ user, orders, profile ]\n```\n\nIf one fails:\n\n```text\nPromise.all()\n     ↓\nRejected\n```\n\nIt rejects immediately with that first error, and you lose the results that did succeed. Worth knowing: the others are <b>not cancelled</b>. They keep running, you just cannot see them.\n\n### Use it when\n\n> <b>You need every result.</b>\n\n---\n\n## `Promise.allSettled()`\n\n<b>`Promise.allSettled()`</b> (waits for all promises, whether they succeed or fail).\n\n```javascript\nconst results = await Promise.allSettled([\n  fetchUser(),\n  fetchOrders(),\n  fetchProfile(),\n]);\n```\n\n```javascript\n[\n  { status: \"fulfilled\", value: user },\n  { status: \"rejected\", reason: error },\n  { status: \"fulfilled\", value: profile },\n]\n```\n\nIt never rejects. You always get the full array and inspect each entry yourself.\n\n### Use it when\n\n> <b>One failure should not stop you seeing the other results.</b>\n\n```text\nSend notification to 10 users\n```\n\nYou want to know which succeeded and which failed, not just that something went wrong.\n\n---\n\n## `Promise.race()`\n\n<b>`Promise.race()`</b> (settles as soon as the first promise settles, fulfilled <b>or</b> rejected).\n\n```javascript\nconst result = await Promise.race([\n  fetchFromServerA(),\n  fetchFromServerB(),\n]);\n```\n\n```text\nServer A\n   ↓\nFirst\n   ↓\nPromise.race()\n```\n\n### Use it when\n\n> <b>The first result, success or failure, is what matters.</b>\n\nThe classic use is a timeout: race the real work against a timer that rejects. Note the catch: if the first to settle is a <b>rejection</b>, `race` rejects, even if another would have succeeded a moment later.\n\n---\n\n## `Promise.any()`\n\n<b>`Promise.any()`</b> (returns the first promise that fulfills, ignoring rejections).\n\n```javascript\nconst result = await Promise.any([\n  fetchFromServerA(),\n  fetchFromServerB(),\n  fetchFromServerC(),\n]);\n```\n\n```text\nA → fails\nB → fails\nC → succeeds\n```\n\n```text\nPromise.any()\n      ↓\nC result\n```\n\nDifferent from `race`: rejections are ignored rather than winning. It only rejects if <b>every</b> promise rejects, and then with an `AggregateError` holding all of them.\n\n### Use it when\n\n> <b>You want the first successful result.</b>\n\n---\n\n## The memory trick\n\n```text\nall\n→ all must succeed\n\nallSettled\n→ wait for everyone\n\nrace\n→ first result\n\nany\n→ first success\n```\n\nThe two axes that separate them: <b>how many</b> results you wait for, and <b>whether failures count</b>.\n\n```text\n              all results        first result\n           ┌─────────────────┬──────────────────┐\nfailures   │  Promise.all    │  Promise.race    │\nmatter     │  (rejects fast) │  (loss counts)   │\n           ├─────────────────┼──────────────────┤\nfailures   │ Promise.        │  Promise.any     │\ntolerated  │  allSettled     │  (first success) │\n           └─────────────────┴──────────────────┘\n```\n\nOne shared caveat: all four start <b>every</b> promise immediately. `Promise.all` on a thousand URLs fires a thousand requests at once, which will get you rate-limited or run you out of sockets. For large lists you want batching or a concurrency limit, not a bare combinator.",
      diagram: `Two questions pick the method

                  all results        first result
               ┌─────────────────┬──────────────────┐
    failures   │  Promise.all    │  Promise.race    │
    matter     │  one fails →    │  first to SETTLE │
               │  whole thing    │  wins, even a    │
               │  rejects        │  rejection       │
               ├─────────────────┼──────────────────┤
    failures   │ Promise.        │  Promise.any     │
    tolerated  │  allSettled     │  first to FULFIL │
               │  never rejects  │  wins, rejects   │
               │                 │  ignored         │
               └─────────────────┴──────────────────┘


race vs any: the difference that bites

    A ──✗ fails at 10ms
    B ──✓ succeeds at 50ms

    Promise.race([A, B])   →  REJECTS at 10ms
                              A settled first, and a
                              rejection counts as settling

    Promise.any([A, B])    →  fulfils at 50ms with B
                              A's rejection is ignored


Promise.all keeps input order, not finish order

    passed in:   [ fetchUser, fetchOrders, fetchProfile ]
    finish in:     orders,     profile,     user
    you get:     [ user,       orders,      profile ]
                   └─ always the order you passed


All four start everything at once

    Promise.all(thousandUrls.map(fetch))
        └─ one thousand requests, immediately
           rate limits, socket exhaustion

    For big lists: batch, or use a concurrency limit.`,
      codeExample: {
        title: "Choosing the right combinator",
        code: `const ok = (value, ms) =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));
const fail = (message, ms) =>
  new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms));


// ═══ all: every result, or nothing ══════════════════════════
const [user, orders, profile] = await Promise.all([
  ok("user", 300),
  ok("orders", 100),
  ok("profile", 200),
]);
console.log(user, orders, profile);   // user orders profile
//   ~300ms, and the order matches what you passed in,
//   not the order they finished

try {
  await Promise.all([ok("user", 300), fail("orders down", 50)]);
} catch (error) {
  console.log("all rejected:", error.message);   // at ~50ms
  // The successful "user" result is lost, and that request
  // is still running. all does not cancel anything.
}


// ═══ allSettled: every outcome, never rejects ═══════════════
const settled = await Promise.allSettled([
  ok("user", 100),
  fail("orders down", 50),
  ok("profile", 150),
]);

console.log(settled);
// [ { status: "fulfilled", value: "user" },
//   { status: "rejected",  reason: Error("orders down") },
//   { status: "fulfilled", value: "profile" } ]

const succeeded = settled.filter((r) => r.status === "fulfilled");
const failed = settled.filter((r) => r.status === "rejected");
console.log(\`\${succeeded.length} ok, \${failed.length} failed\`);
//   the shape you want for "notify 10 users"


// ═══ race: first to SETTLE, rejection included ══════════════
const winner = await Promise.race([ok("server A", 100), ok("server B", 300)]);
console.log(winner);                  // server A

try {
  await Promise.race([fail("A down", 10), ok("server B", 50)]);
} catch (error) {
  console.log("race rejected:", error.message);   // A down
  // B would have succeeded 40ms later. race did not wait.
}

// the classic use: a timeout
const withTimeout = (promise, ms) =>
  Promise.race([promise, fail(\`timed out after \${ms}ms\`, ms)]);
console.log(await withTimeout(ok("slow query", 50), 200));


// ═══ any: first to FULFIL, rejections ignored ═══════════════
const firstGood = await Promise.any([
  fail("A down", 10),
  fail("B down", 20),
  ok("server C", 60),
]);
console.log(firstGood);               // server C

try {
  await Promise.any([fail("A down", 10), fail("B down", 20)]);
} catch (error) {
  console.log(error.name);            // AggregateError
  console.log(error.errors.length);   // 2 — all of them
}`,
      },
      keyTakeaways: [
        "`Promise.all` needs every promise to succeed, and returns results in the <b>order you passed them</b>.",
        "`Promise.all` rejects on the first failure, losing the successful results. The others keep running, uncancelled.",
        "`Promise.allSettled` never rejects. You get `{ status, value }` or `{ status, reason }` for each.",
        "`Promise.race` settles on the first promise to <b>settle</b>, so an early rejection wins.",
        "`Promise.any` settles on the first to <b>fulfil</b>, ignoring rejections, and rejects with `AggregateError` only if all fail.",
        "Two questions pick the method: how many results do you need, and do failures matter?",
        "`race` is the classic timeout tool: race real work against a rejecting timer.",
        "All four start every promise immediately. `Promise.all` on a thousand URLs fires a thousand requests at once.",
      ],
      commonMistakes: [
        "<b>Using `Promise.all` for independent best-effort work</b> — one failure throws away every good result. Use `allSettled`.",
        "<b>Using `race` when you meant `any`</b> — the fastest failure wins a race, even when another call would have succeeded.",
        "<b>Expecting `Promise.all` to cancel the rest on failure</b> — it does not. Those requests still complete, unobserved.",
        "<b>Assuming `Promise.all` returns results in completion order</b> — it always matches input order.",
        "<b>Forgetting `allSettled` entries are wrappers</b> — you need `.value` or `.reason`, not the raw item.",
        "<b>`Promise.all` over a huge array</b> — every request starts at once, exhausting sockets and hitting rate limits. Batch instead.",
      ],
      quiz: [
        {
          question: "Promise A rejects after 10ms. Promise B fulfils after 50ms. What does `Promise.race([A, B])` do?",
          options: [
            "Fulfils with B's value after 50ms",
            "Rejects after 10ms with A's error",
            "Waits for both, then rejects",
            "Fulfils with `undefined`",
          ],
          correctIndex: 1,
          explanation:
            "`race` settles on the first promise to settle, and a rejection counts as settling. If you wanted B's value, `Promise.any` is the one that ignores rejections.",
        },
        {
          question: "You send notifications to 10 users and want to know which failed. Which combinator?",
          options: ["`Promise.all`", "`Promise.allSettled`", "`Promise.race`", "`Promise.any`"],
          correctIndex: 1,
          explanation:
            "`allSettled` never rejects and reports every outcome, so you can count successes and failures. `all` would throw on the first failure and hide the nine that worked.",
        },
        {
          question: "`Promise.all` rejects because one of three requests failed. What happens to the other two?",
          options: [
            "They are cancelled automatically",
            "They keep running, and their results are simply not observed",
            "They are retried",
            "They reject too",
          ],
          correctIndex: 1,
          explanation:
            "There is no cancellation in `Promise.all`. The other requests complete as normal, you just have no way to see their results. Cancellation needs `AbortController`.",
        },
      ],
    },
    {
      id: "async-await-concurrency",
      title: "async/await, and the sequential-await mistake",
      durationMinutes: 12,
      explanation:
        "The syntax is easy. The performance mistake it invites is the single most common async bug in Node code.\n\n---\n\n## `async/await`\n\nInstead of:\n\n```javascript\nfetchUser()\n  .then(user => {\n    console.log(user);\n  })\n  .catch(error => {\n    console.error(error);\n  });\n```\n\nyou write:\n\n```javascript\ntry {\n  const user = await fetchUser();\n\n  console.log(user);\n} catch (error) {\n  console.error(error);\n}\n```\n\nSame machinery, easier to read. `async/await` is promises with different punctuation, not a different mechanism.\n\n---\n\n## Error handling\n\n```javascript\nasync function getUser() {\n  try {\n    const user = await fetchUser();\n\n    return user;\n  } catch (error) {\n    console.error(\"Failed:\", error);\n\n    throw error;\n  }\n}\n```\n\nNotice:\n\n```javascript\nthrow error;\n```\n\nThat re-throw matters. Logging an error and then returning normally tells the caller everything went fine, and they carry on with `undefined`. Either handle it properly or pass it up. Swallowing it silently is the worst of the three.\n\nAnd only `await`ed promises land in your `try`. A promise you never awaited rejects on its own, outside the block.\n\n---\n\n## The mistake almost everyone makes\n\n```javascript\nconst user = await fetchUser();\nconst orders = await fetchOrders();\nconst profile = await fetchProfile();\n```\n\nThat is <b>sequential</b>:\n\n```text\nfetchUser\n   ↓\nwait\n   ↓\nfetchOrders\n   ↓\nwait\n   ↓\nfetchProfile\n   ↓\nwait\n```\n\nAt one second each:\n\n```text\n1s + 1s + 1s\n= approximately 3s\n```\n\nBut if they do not depend on each other, that waiting could have overlapped.\n\nThis is worth dwelling on, because the code looks completely reasonable. Nothing is wrong with it. It is just three times slower than it needs to be, and it will not show up in tests.\n\n---\n\n## Concurrent awaits\n\n```javascript\nconst userPromise = fetchUser();\nconst ordersPromise = fetchOrders();\nconst profilePromise = fetchProfile();\n\nconst [user, orders, profile] = await Promise.all([\n  userPromise,\n  ordersPromise,\n  profilePromise,\n]);\n```\n\n```text\nfetchUser    ────────┐\nfetchOrders  ────────┼──→ Promise.all()\nfetchProfile ────────┘\n```\n\n```text\n≈ 1 second\n```\n\ninstead of:\n\n```text\n≈ 3 seconds\n```\n\nThe key insight: calling an async function <b>starts</b> the work. `await` only decides when you collect the result. Separating those two moments is the whole technique.\n\nThe compact form does the same thing:\n\n```javascript\nconst [user, orders, profile] = await Promise.all([\n  fetchUser(),\n  fetchOrders(),\n  fetchProfile(),\n]);\n```\n\n---\n\n## The rule\n\nAsk:\n\n> <b>Does operation B depend on the result of operation A?</b>\n\nIf yes, sequential is correct:\n\n```javascript\nconst user = await fetchUser();\n\nconst orders = await fetchOrders(user.id);\n```\n\n```text\nUser\n ↓\nOrders\n```\n\nIf no, run them together:\n\n```javascript\nconst [users, products] = await Promise.all([\n  fetchUsers(),\n  fetchProducts(),\n]);\n```\n\n```text\nUsers    ────┐\n             ├──→ Results\nProducts ────┘\n```\n\nThe same trap hides inside loops, where it is even easier to miss:\n\n```javascript\n// Sequential: one request at a time\nfor (const id of ids) {\n  results.push(await fetchUser(id));\n}\n\n// Concurrent: all at once\nconst results = await Promise.all(ids.map(id => fetchUser(id)));\n```\n\nOne caution on that second form. If `ids` has ten entries, fine. If it has ten thousand, you have just fired ten thousand requests simultaneously. For large lists, batch them.\n\nAnd a subtle one: <b>`.forEach` does not await</b>. It ignores the promise each callback returns, so the loop finishes instantly and your work runs unsupervised. Use `for...of` for sequential, or `map` with `Promise.all` for concurrent. Never `forEach`.",
      diagram: `The mistake, in one picture

    SEQUENTIAL                     CONCURRENT
    const a = await fetchA()       const [a, b, c] =
    const b = await fetchB()         await Promise.all([
    const c = await fetchC()           fetchA(),
                                       fetchB(),
                                       fetchC(),
                                     ])

    A  ████                        A  ████
    B      ████                    B  ████
    C          ████                C  ████
       └─ 3 seconds                   └─ 1 second

    Both look reasonable. One is 3x slower,
    and tests will not tell you.


The insight that makes it click

    fetchUser()          ← starts the work NOW
    await somePromise    ← only decides WHEN you collect

    So:
      const p1 = fetchA()        both already running
      const p2 = fetchB()
      const a = await p1         collect
      const b = await p2         collect        ← also concurrent


The decision

    Does B need A's result?
            │
     ┌──────┴──────┐
    YES            NO
     │              │
    await A        Promise.all([A, B])
    await B(a.id)
     │              │
    sequential     concurrent
    is CORRECT     is faster


Loops hide the same trap

    for (const id of ids) {              one at a time
      results.push(await fetch(id))
    }

    await Promise.all(ids.map(fetch))    all at once
                                         (careful with 10,000)

    ids.forEach(async (id) => {          ✗ BROKEN
      await fetch(id)                      forEach ignores the
    })                                     promise, loop finishes
                                           instantly, work runs
                                           unsupervised`,
      codeExample: {
        title: "Sequential when it must be, concurrent when it can be",
        code: `import { setTimeout as sleep } from "node:timers/promises";

const fetchUser = async () => (await sleep(300), { id: 1, name: "Rajan" });
const fetchOrders = async () => (await sleep(300), [{ id: 11 }]);
const fetchProfile = async () => (await sleep(300), { bio: "..." });


// ═══ The mistake: sequential for no reason ══════════════════
let start = performance.now();

const u1 = await fetchUser();
const o1 = await fetchOrders();
const p1 = await fetchProfile();

console.log(\`sequential: \${Math.round(performance.now() - start)}ms\`);
// ~900ms — and nothing about this code looks wrong


// ═══ The fix ════════════════════════════════════════════════
start = performance.now();

const [u2, o2, p2] = await Promise.all([
  fetchUser(),
  fetchOrders(),
  fetchProfile(),
]);

console.log(\`concurrent: \${Math.round(performance.now() - start)}ms\`);
// ~300ms


// ═══ Why it works: calling starts, await collects ═══════════
start = performance.now();

const userPromise = fetchUser();        // already running
const ordersPromise = fetchOrders();    // already running

const user = await userPromise;         // just collecting
const orders = await ordersPromise;     // just collecting

console.log(\`also concurrent: \${Math.round(performance.now() - start)}ms\`);
// ~300ms, despite two separate awaits


// ═══ When sequential is CORRECT ═════════════════════════════
const owner = await fetchUser();
const theirOrders = await fetchOrders(owner.id);   // needs owner.id
// You cannot overlap these. The dependency is real.


// ═══ The same trap in a loop ════════════════════════════════
const ids = [1, 2, 3, 4, 5];

// sequential: one request at a time
const slow = [];
for (const id of ids) {
  slow.push(await fetchUser(id));
}

// concurrent: all at once
const fast = await Promise.all(ids.map((id) => fetchUser(id)));

// ✗ BROKEN: forEach ignores the returned promise
// ids.forEach(async (id) => {
//   await fetchUser(id);        // loop finishes instantly,
// });                            // these run unsupervised


// ═══ Re-throw, do not swallow ═══════════════════════════════
async function getUser(id) {
  try {
    return await fetchUser(id);
  } catch (error) {
    console.error("Failed:", error.message);
    throw error;              // ← without this, the caller
  }                           //   thinks it worked and gets
}                             //   undefined


// ═══ For big lists, batch ═══════════════════════════════════
async function inBatches(items, size, worker) {
  const out = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(...(await Promise.all(items.slice(i, i + size).map(worker))));
  }
  return out;
}
// Promise.all over 10,000 items fires 10,000 requests at once.`,
      },
      keyTakeaways: [
        "`async/await` is promises with different punctuation. Same machinery, easier to read.",
        "Calling an async function <b>starts</b> the work. `await` only decides when you collect the result.",
        "Three `await`s in a row run <b>sequentially</b>, even when the operations are independent.",
        "That code looks completely reasonable and is three times slower than it needs to be.",
        "The decision: <b>does B need A's result?</b> Yes means sequential, no means `Promise.all`.",
        "`for...of` with `await` is sequential. `map` with `Promise.all` is concurrent.",
        "<b>`.forEach` does not await.</b> It ignores the promise and the loop finishes instantly.",
        "Re-throw after logging, or the caller thinks it succeeded and continues with `undefined`.",
        "Only `await`ed promises land in your `try`. An un-awaited one rejects outside it.",
        "`Promise.all` over a huge array fires every request at once. Batch large lists.",
      ],
      commonMistakes: [
        "<b>Awaiting independent operations one at a time</b> — the most common async performance bug in Node. Use `Promise.all`.",
        "<b>`await` inside a `for` loop over independent items</b> — same bug, harder to spot. `map` plus `Promise.all` fixes it.",
        "<b>Using `.forEach` with an async callback</b> — the promise is discarded, the loop returns immediately, and errors vanish.",
        "<b>Logging an error and returning normally</b> — the caller reads that as success. Re-throw.",
        "<b>Expecting `try/catch` to catch an un-awaited promise</b> — it rejects outside the block, as an unhandled rejection.",
        "<b>`Promise.all` on ten thousand items</b> — sockets exhausted, rate limits hit. Batch it.",
        "<b>Making everything concurrent</b> — when B genuinely needs A's result, sequential is correct, not a bug.",
      ],
      quiz: [
        {
          question: "Three independent fetches, each taking one second, written as three `await` statements in a row. How long does it take?",
          options: ["~1 second", "~3 seconds", "~1 second, Node parallelises automatically", "It depends on the network"],
          correctIndex: 1,
          explanation:
            "Each `await` waits for its operation to finish before the next one starts, so the waits do not overlap. `Promise.all` starts all three at once and takes about one second.",
        },
        {
          question: "Why does `ids.forEach(async (id) => { await fetchUser(id); })` not work as expected?",
          options: [
            "`forEach` cannot take a function",
            "`forEach` ignores the returned promise, so the loop finishes before any fetch completes",
            "`async` is not allowed in a callback",
            "It works fine",
          ],
          correctIndex: 1,
          explanation:
            "`forEach` discards each callback's return value, so nothing waits for the promises. The loop returns immediately and the work runs unsupervised, with errors surfacing as unhandled rejections.",
        },
        {
          question: "Which pair of operations genuinely has to be sequential?",
          options: [
            "`fetchUsers()` and `fetchProducts()`",
            "`fetchUser()` then `fetchOrders(user.id)`",
            "Two independent database counts",
            "Reading two unrelated config files",
          ],
          correctIndex: 1,
          explanation:
            "The second call needs `user.id` from the first, so the dependency is real and sequential is correct. The others are independent and should run through `Promise.all`.",
        },
      ],
    },
    {
      id: "blocking-the-loop",
      title: "Blocking the event loop, and how to spot it",
      durationMinutes: 10,
      explanation:
        "One of the most important practical concepts in Node.js, and the failure mode that catches teams in production.\n\n---\n\n## What blocking means\n\n<b>Blocking the event loop</b> (keeping the main JavaScript thread busy so it cannot process anything else).\n\n```javascript\nwhile (true) {\n  // Never ends\n}\n```\n\nNode can now process none of this:\n\n```text\nHTTP requests\nTimers\nCallbacks\nI/O callbacks\n```\n\nEverything is stuck. Remember from lesson 2: the event loop only gets a turn when your stack empties. Hold the stack and it never gets one.\n\n---\n\n## CPU-heavy work\n\n```javascript\nfunction expensiveCalculation() {\n  let total = 0;\n\n  for (let i = 0; i < 10_000_000_000; i++) {\n    total += i;\n  }\n\n  return total;\n}\n```\n\nWhile it runs:\n\n```text\nJavaScript thread\n       ↓\nCPU calculation\n       ↓\nBLOCKED\n       ↓\nOther requests wait\n```\n\nThis is the version that actually happens in real systems. Nobody writes `while (true)` by accident, but plenty of people parse a large JSON payload, hash a password with too many rounds, resize an image, or sort a hundred thousand records inside a request handler.\n\nA blocked handler does not just slow down its own request. It adds its full duration to the latency of <b>every</b> request currently queued.\n\nLater you will learn about:\n\n```text\nWorker Threads\nChild Processes\nQueues\nBackground workers\n```\n\n---\n\n## Synchronous APIs block too\n\n```javascript\nimport fs from \"node:fs\";\n\nconst data = fs.readFileSync(\"large-file.txt\");\n```\n\n`readFileSync` holds the thread until the file is read. In a request path, prefer the async version:\n\n```javascript\nconst data = await fs.promises.readFile(\"large-file.txt\");\n```\n\n```text\nreadFileSync()\n     ↓\nBlocking\n\nfs.promises.readFile()\n     ↓\nAsync\n```\n\nThe `Sync` suffix is a reliable warning label. It is fine at startup, in a CLI script, or in a build step where nothing else is waiting. It is never fine in a request handler.\n\nOther offenders worth knowing: `JSON.parse` on a very large string, `crypto.pbkdf2Sync`, `child_process.execSync`, and a regular expression that backtracks catastrophically.\n\n---\n\n## How to spot it\n\nWarning signs:\n\n```text\nHigh response latency\nRequests suddenly become slow\nCPU usage is high\nTimers execute late\nOther requests stop responding\n```\n\nThe pattern that identifies it: latency rises across <b>every</b> endpoint at once, including ones that do nothing. If your health check gets slow while the database is idle, you are blocking.\n\nA simple experiment:\n\n```javascript\nsetInterval(() => {\n  console.log(\"heartbeat\");\n}, 1000);\n```\n\nThen run a huge synchronous calculation. If the heartbeat drifts:\n\n```text\n1s\n2s\n3s\n        ← huge calculation\n10s\n```\n\nyou have blocked the event loop. That is the whole diagnostic, and you can add it to any service in three lines: measure how late a fixed-interval timer actually fires. The lateness <b>is</b> your blocking, measured directly.",
      diagram: `Why blocking works at all

    from lesson 2: the event loop only gets a turn
                   when your stack empties

    normal
    ██──┐    ┌──██──┐    ┌──██        ██ your code
        └────┘      └────┘            └─ loop's turn
        loop runs timers, I/O, responses

    blocked
    ████████████████████████████       no gaps
                                       no turns
                                       nothing else runs


One slow handler, everyone pays

    request A  ████████ 2s of sorting
    request B  ░░░░░░░░████            waited 2s for A
    request C  ░░░░░░░░░░░░████        waited 2.2s

    A's 2 seconds are added to EVERY queued request.
    That is why latency rises across all endpoints,
    including the ones that do nothing.


The diagnostic: measure timer lateness

    setInterval(heartbeat, 1000)

    expected   1s   2s   3s   4s   5s
    actual     1s   2s   3s        9s
                              └──┬──┘
                            6s of blocking,
                            measured directly

    If your health check slows down while the
    database is idle, you are blocking.


The Sync suffix is a warning label

    readFileSync            ✗ in a request handler
                            ✓ at startup, in a CLI

    also blocking:
      JSON.parse on a huge string
      crypto.pbkdf2Sync
      execSync
      a catastrophically backtracking regex`,
      codeExample: {
        title: "Blocking, and measuring it",
        code: `import fs from "node:fs";
import { readFile } from "node:fs/promises";

// ── The diagnostic: how late does a fixed timer fire? ───────
let last = performance.now();
const heartbeat = setInterval(() => {
  const now = performance.now();
  const lateness = Math.round(now - last - 1000);
  last = now;
  console.log(\`heartbeat, \${lateness}ms late\`);
}, 1000);

// lateness is your blocking, measured directly


// ── Block it on purpose and watch the number jump ───────────
setTimeout(() => {
  let total = 0;
  for (let i = 0; i < 3_000_000_000; i += 1) total += i;
  console.log("calculation done", total > 0);
}, 2500);

// heartbeat, 0ms late
// heartbeat, 1ms late
// calculation done
// heartbeat, 4200ms late      ← there it is

setTimeout(() => clearInterval(heartbeat), 12_000);


// ── Sync vs async file reads ────────────────────────────────
// ✗ never in a request handler
const blocking = fs.readFileSync("package.json", "utf8");

// ✓ the async version
const nonBlocking = await readFile("package.json", "utf8");

console.log(blocking.length === nonBlocking.length);   // true
//
// Sync is fine at startup, in a CLI, in a build step.
// Never where a request is waiting.


// ── The realistic offenders ─────────────────────────────────
// app.post("/import", async (req, res) => {
//   const rows = JSON.parse(hugePayload);        // blocks
//   rows.sort((a, b) => a.score - b.score);      // blocks
//   const hash = crypto.pbkdf2Sync(pw, salt,     // blocks
//                                  600_000, 32, "sha512");
//   res.json({ ok: true });
// });
//
// Nobody writes while(true) by accident. This is what
// actually happens: parsing, sorting, hashing, resizing.


// ── What blocking looks like from outside ───────────────────
// GET /health          200   1ms      normal
// GET /health          200   2100ms   ← during the block
//
// Latency rising on an endpoint that does NOTHING is the
// clearest signal you have. The database is fine. You are
// holding the thread.`,
      },
      keyTakeaways: [
        "<b>Blocking the event loop</b> means holding the JavaScript thread so nothing else can run.",
        "It works because the event loop only gets a turn when your stack empties.",
        "Nobody writes `while (true)` by accident. Real blocking is parsing, sorting, hashing and resizing.",
        "A blocked handler adds its full duration to the latency of <b>every</b> queued request.",
        "The `Sync` suffix is a warning label: fine at startup or in a CLI, never in a request handler.",
        "Other offenders: `JSON.parse` on huge strings, `pbkdf2Sync`, `execSync`, catastrophic regex backtracking.",
        "The clearest symptom: latency rises on <b>every</b> endpoint, including ones that do nothing.",
        "The diagnostic: measure how late a fixed-interval timer actually fires. The lateness is your blocking.",
        "CPU-bound work belongs in worker threads, child processes or a background queue.",
      ],
      commonMistakes: [
        "<b>Using a `*Sync` API in a request handler</b> — it holds the thread for every other request too.",
        "<b>Hashing a password with high iteration counts synchronously</b> — `pbkdf2Sync` with 600,000 rounds blocks for hundreds of milliseconds.",
        "<b>Parsing or sorting a large payload inline</b> — this is what real blocking looks like, and it hides in ordinary-looking code.",
        "<b>Blaming the database when every endpoint slows down</b> — if the health check is slow too, it is your thread, not the query.",
        "<b>Wrapping CPU work in `async`</b> — the syntax changes nothing. It still holds the thread.",
        "<b>Assuming a fast local test proves it</b> — blocking shows up under concurrency, when requests queue behind each other.",
      ],
      quiz: [
        {
          question: "Latency rises on every endpoint at once, including a health check that only returns `{ ok: true }`. The database is idle. What is happening?",
          options: [
            "A slow database query",
            "Something is blocking the event loop",
            "Network congestion",
            "A memory leak",
          ],
          correctIndex: 1,
          explanation:
            "An endpoint that does no I/O can only be slow if it cannot get the thread. When the cheap endpoints slow down alongside the expensive ones, the thread itself is the bottleneck.",
        },
        {
          question: "What is the simplest way to measure event loop blocking?",
          options: [
            "Count the number of open sockets",
            "Measure how late a fixed-interval timer actually fires",
            "Check total memory usage",
            "Count active promises",
          ],
          correctIndex: 1,
          explanation:
            "A `setInterval` at 1000ms should fire every 1000ms. Whatever lateness you measure is time the loop could not get a turn, which is blocking measured directly.",
        },
        {
          question: "Where is `fs.readFileSync` acceptable?",
          options: [
            "Anywhere, it is simpler than the async version",
            "In a request handler, if the file is small",
            "At startup, in a CLI tool, or in a build script",
            "Never, under any circumstances",
          ],
          correctIndex: 2,
          explanation:
            "Blocking only matters when something else is waiting. At startup or in a one-off script there is nothing to starve, so the simpler synchronous call is fine.",
        },
      ],
    },
    {
      id: "timers-and-abort",
      title: "Promise-based timers and AbortController",
      durationMinutes: 10,
      explanation:
        "Two modern tools that make async code much more pleasant, and one of them fixes a real gap.\n\n---\n\n## `node:timers/promises`\n\nInstead of:\n\n```javascript\nsetTimeout(() => {\n  console.log(\"Done\");\n}, 1000);\n```\n\nyou can write:\n\n```javascript\nimport { setTimeout } from \"node:timers/promises\";\n\nawait setTimeout(1000);\n\nconsole.log(\"Done\");\n```\n\nVery convenient with `async/await`.\n\n```javascript\nimport { setTimeout } from \"node:timers/promises\";\n\nasync function main() {\n  console.log(\"Starting...\");\n\n  await setTimeout(2000);\n\n  console.log(\"2 seconds later\");\n}\n\nmain();\n```\n\n```text\nStarting\n   ↓\nwait asynchronously\n   ↓\n2 seconds\n   ↓\n2 seconds later\n```\n\nThe important part:\n\n> `await setTimeout()` does not block the entire Node.js event loop.\n\nIt suspends that one function. Everything else keeps running. Compare that with a busy-wait loop, which would hold the thread for the full two seconds.\n\nOne thing to watch: this `setTimeout` shadows the global one, and the arguments differ. The promise version is `setTimeout(delay, value, options)`. Import it under an alias like `sleep` if a file uses both.\n\nThe module also gives you `setImmediate` and `setInterval` as an async iterator, which is a clean way to write a polling loop.\n\n---\n\n## `AbortController`\n\n<b>`AbortController`</b> (an API for signalling that an async operation should be cancelled).\n\n```javascript\nconst controller = new AbortController();\n\nconst { signal } = controller;\n```\n\nPass the signal to any API that supports cancellation:\n\n```javascript\nconst response = await fetch(url, {\n  signal,\n});\n```\n\nThen:\n\n```javascript\ncontroller.abort();\n```\n\nsignals:\n\n> \"Cancel this operation if possible.\"\n\nThis fills a real gap. Promises have no cancellation of their own: once started, a promise runs to completion whether you still care or not. `AbortController` is the standard way to say you have stopped caring, and it is the missing piece behind `Promise.all` not cancelling its siblings.\n\n---\n\n## Aborting a timer\n\n```javascript\nimport { setTimeout } from \"node:timers/promises\";\n\nconst controller = new AbortController();\n\nconst timer = setTimeout(10_000, undefined, {\n  signal: controller.signal,\n});\n\ncontroller.abort();\n```\n\nThe timer is aborted instead of waiting the full ten seconds. The promise rejects with an `AbortError`, so wrap it in a `try/catch` or you get an unhandled rejection.\n\n---\n\n## Aborting a fetch\n\n```javascript\nconst controller = new AbortController();\n\nsetTimeout(() => {\n  controller.abort();\n}, 5000);\n\ntry {\n  const response = await fetch(url, {\n    signal: controller.signal,\n  });\n\n  const data = await response.json();\n\n  console.log(data);\n} catch (error) {\n  console.error(error);\n}\n```\n\nUseful for:\n\n```text\nRequest timeout\nUser cancellation\nServer shutdown\nResource cleanup\n```\n\nFor the timeout case specifically there is a shortcut, `AbortSignal.timeout(5000)`, which does the same thing in one line. And `AbortSignal.any([...])` combines several signals, which is how you express \"time out after five seconds <b>or</b> when the client disconnects\".\n\nOne detail people miss: check `signal.aborted` inside your own long-running loops. A signal cannot interrupt your code any more than the event loop can, so cancellation only takes effect where something actually looks at it.\n\n---\n\n## The complete async mental model\n\n```text\n                 Node.js\n                    │\n                    ↓\n             JavaScript Thread\n                    │\n                    ↓\n               Call Stack\n                    │\n                    ↓\n               Event Loop\n                    │\n        ┌───────────┼───────────┐\n        ↓           ↓           ↓\n     Timers       Poll        Check\n        │           │           │\n        │         I/O       setImmediate\n        │\n        └───────────┬───────────┘\n                    ↓\n               Microtasks\n                    │\n        ┌───────────┴───────────┐\n        ↓                       ↓\n    Promises               queueMicrotask\n        │\n        ↓\n   JavaScript runs\n```\n\nAnd:\n\n```text\nprocess.nextTick()\n        ↓\nVery high priority\n        ↓\nCan starve the event loop\n```\n\n---\n\n## Day 3 goal\n\nYou should be able to explain this in your own words:\n\n> <b>\"Node.js runs JavaScript primarily on a single thread, but asynchronous, non-blocking I/O allows that thread to keep processing other work instead of waiting for I/O to finish.\"</b>\n\nAnd apply this rule:\n\n```text\nIndependent async operations\n        ↓\nStart them together\n        ↓\nPromise.all()\n        ↓\nFaster overall execution\n```\n\nrather than accidentally writing:\n\n```text\nawait A\n  ↓\nawait B\n  ↓\nawait C\n  ↓\nawait D\n```\n\nwhen A, B, C and D do not depend on each other.",
      diagram: `Promise timers vs busy waiting

    await sleep(2000)              while (Date.now() - t < 2000) {}
         │                              │
    thread FREE for 2s             thread HELD for 2s
    other requests served          nothing else runs

    Same two seconds. Completely different cost.


AbortController fills a real gap

    a plain promise has NO cancellation
      fetch(url)  ── started ──►  runs to completion
                                  whether you care or not

    with a signal
      fetch(url, { signal })
              │
      controller.abort()  ──►  rejects with AbortError
                               the request is actually torn down

    This is the piece Promise.all is missing when it
    "does not cancel the others".


Three ways to build the signal

    manual         const c = new AbortController()
                   c.abort()                     user cancelled

    timeout        AbortSignal.timeout(5000)     one line

    combined       AbortSignal.any([
                     AbortSignal.timeout(5000),
                     req.signal,
                   ])
                   "5 seconds OR the client hung up"


Cancellation is cooperative

    a signal cannot interrupt your code, just as the
    event loop cannot

    for (const item of huge) {
      if (signal.aborted) break      ← you must look
      process(item)
    }

    Nothing checks it for you.`,
      codeExample: {
        title: "Promise timers, and cancelling work you no longer want",
        code: `import { setTimeout as sleep, setInterval as every } from "node:timers/promises";

// ── Promise-based timers ────────────────────────────────────
console.log("Starting...");
await sleep(2000);
console.log("2 seconds later");
//
// The thread is free for those 2 seconds. Compare with a
// busy-wait loop, which would hold it and serve nobody.
//
// Note: import it under an alias. The promise version's
// signature is setTimeout(delay, value, options), which
// differs from the global one it would otherwise shadow.


// ── setInterval as an async iterator ────────────────────────
let polls = 0;
for await (const _ of every(1000)) {
  console.log("poll", (polls += 1));
  if (polls === 3) break;
}
// a clean polling loop, no clearInterval bookkeeping


// ── Aborting a timer ────────────────────────────────────────
const controller = new AbortController();

const timer = sleep(10_000, undefined, { signal: controller.signal });
controller.abort();

try {
  await timer;
} catch (error) {
  console.log(error.name);            // AbortError
}
// Aborted, not waited out. Wrap it, or you get an
// unhandled rejection.


// ── Aborting a fetch: the manual form ───────────────────────
const c = new AbortController();
setTimeout(() => c.abort(), 5000);

try {
  const response = await fetch("https://example.com", { signal: c.signal });
  console.log(await response.text());
} catch (error) {
  if (error.name === "AbortError") console.log("timed out");
  else throw error;
}


// ── The one-line version ────────────────────────────────────
try {
  const response = await fetch("https://example.com", {
    signal: AbortSignal.timeout(5000),
  });
  console.log(response.status);
} catch (error) {
  console.log(error.name);            // TimeoutError
}


// ── Combining signals ───────────────────────────────────────
// app.get("/report", async (req, res) => {
//   const signal = AbortSignal.any([
//     AbortSignal.timeout(5000),      // give up after 5s
//     req.signal,                     // or if the client leaves
//   ]);
//   const data = await buildReport({ signal });
//   res.json(data);
// });


// ── Cancellation is cooperative ─────────────────────────────
async function processAll(items, { signal }) {
  for (const item of items) {
    if (signal.aborted) {             // ← you have to check
      throw new Error("cancelled");
    }
    await handle(item);
  }
}
// A signal cannot interrupt your loop any more than the
// event loop can. It only works where something looks.`,
      },
      keyTakeaways: [
        "`node:timers/promises` gives you `await sleep(1000)` instead of a callback.",
        "`await` on a timer suspends one function. The thread stays free, unlike a busy-wait loop.",
        "Import it under an alias. The promise `setTimeout(delay, value, options)` shadows the global one with a different signature.",
        "That module's `setInterval` is an async iterator, which makes a clean polling loop.",
        "<b>Promises have no cancellation of their own.</b> Once started, they run to completion.",
        "`AbortController` is the standard way to signal you have stopped caring.",
        "It is the missing piece behind `Promise.all` not cancelling its siblings on failure.",
        "An aborted operation rejects with `AbortError`, so always wrap it in `try/catch`.",
        "`AbortSignal.timeout(ms)` is the one-line timeout. `AbortSignal.any([...])` combines several signals.",
        "Cancellation is <b>cooperative</b>: check `signal.aborted` inside your own long loops, or nothing happens.",
      ],
      commonMistakes: [
        "<b>Importing the promise `setTimeout` without an alias</b> — it shadows the global one and the argument order differs, which produces very confusing bugs.",
        "<b>Not catching an aborted operation</b> — it rejects with `AbortError`, and an uncaught rejection crashes the process.",
        "<b>Expecting `abort()` to stop your own loop</b> — nothing checks the signal for you. Read `signal.aborted` yourself.",
        "<b>Building a manual timeout when `AbortSignal.timeout` exists</b> — one line replaces the controller and the timer.",
        "<b>Reusing one `AbortController` for a retry</b> — once aborted it stays aborted. Make a new one per attempt.",
        "<b>Treating `AbortError` as a real failure</b> — a deliberate cancellation is not a bug. Check `error.name` before logging it as one.",
        "<b>Assuming `Promise.all` cancels the rest on failure</b> — it does not. Pass a shared signal if you want that.",
      ],
      quiz: [
        {
          question: "What is the difference between `await sleep(2000)` and a `while` loop that spins for two seconds?",
          options: [
            "None, both wait two seconds",
            "`await sleep` frees the thread for other work; the loop holds it",
            "The loop is more accurate",
            "`await sleep` runs on a separate thread",
          ],
          correctIndex: 1,
          explanation:
            "`await` suspends just that function and hands the thread back, so other requests are served during those two seconds. A spin loop holds the thread and blocks everything.",
        },
        {
          question: "Why does `AbortController` exist, given that promises already have `.catch()`?",
          options: [
            "To catch errors more efficiently",
            "Because a promise cannot be cancelled once started, and a signal is how you say you have stopped caring",
            "To retry failed operations",
            "To make promises synchronous",
          ],
          correctIndex: 1,
          explanation:
            "There is no cancellation built into promises. `AbortController` is the standard mechanism for tearing down work you no longer want, which is exactly what `Promise.all` lacks when a sibling fails.",
        },
        {
          question: "You call `controller.abort()` while your own `for` loop is processing items. What happens?",
          options: [
            "The loop stops immediately",
            "Nothing, unless the loop checks `signal.aborted` itself",
            "Node throws an AbortError into the loop",
            "The loop finishes but the result is discarded",
          ],
          correctIndex: 1,
          explanation:
            "Cancellation is cooperative. A signal cannot interrupt running JavaScript any more than the event loop can, so it only takes effect where your code actually reads `signal.aborted`.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Which sentence best captures why one thread can serve thousands of connections?",
      options: [
        "Node runs each request on its own thread behind the scenes",
        "Waiting overlaps, running does not, and servers spend almost all their time waiting",
        "V8 compiles requests in parallel",
        "The event loop preempts slow handlers",
      ],
      correctIndex: 1,
      explanation:
        "Waiting on disks, databases and networks is not work the thread does, so it can be handed off and overlapped. Computation is work, so it cannot. That distinction runs through the whole day.",
    },
    {
      question: "Put these in execution order: a `setTimeout(fn, 0)`, a `process.nextTick`, a `Promise.then`, and a `console.log`.",
      options: [
        "console.log, setTimeout, nextTick, Promise.then",
        "console.log, nextTick, Promise.then, setTimeout",
        "nextTick, console.log, Promise.then, setTimeout",
        "console.log, Promise.then, nextTick, setTimeout",
      ],
      correctIndex: 1,
      explanation:
        "Synchronous code first, then the `nextTick` queue drained fully, then promise microtasks drained fully, and only then an event loop phase such as timers.",
    },
    {
      question: "Inside an `fs.readFile` callback, which runs first: `setImmediate` or `setTimeout(fn, 0)`?",
      options: [
        "`setTimeout`, because the delay has elapsed",
        "`setImmediate`, because check follows poll in the same cycle",
        "Whichever was scheduled first",
        "It is non-deterministic here too",
      ],
      correctIndex: 1,
      explanation:
        "An I/O callback runs in the poll phase, and check is next in that same cycle. At the top level, though, the order between these two is not deterministic.",
    },
    {
      question: "Why is recursive `process.nextTick(loop)` worse than `while (true)`?",
      options: [
        "It uses more memory",
        "It starves the loop just as effectively, but looks like ordinary async code",
        "It crashes the process",
        "It is not worse, they are the same",
      ],
      correctIndex: 1,
      explanation:
        "The `nextTick` queue is drained completely before the loop advances, so refilling it starves everything. Unlike an infinite loop, there is no loop visible in the code to find.",
    },
    {
      question: "Three independent one-second fetches written as three `await` statements. What is wrong, and what is the fix?",
      options: [
        "Nothing is wrong",
        "It takes three seconds instead of one; use `Promise.all`",
        "It blocks the event loop; use worker threads",
        "The awaits need to be inside a loop",
      ],
      correctIndex: 1,
      explanation:
        "Each `await` waits for its operation before starting the next, so the waits do not overlap. `Promise.all` starts all three at once. Note this is not blocking, just needlessly sequential.",
    },
    {
      question: "Promise A rejects at 10ms, promise B fulfils at 50ms. Which combinator gives you B's value?",
      options: ["`Promise.all`", "`Promise.race`", "`Promise.any`", "`Promise.allSettled`"],
      correctIndex: 2,
      explanation:
        "`any` waits for the first <i>fulfilment</i> and ignores rejections. `race` would reject at 10ms, because a rejection counts as settling.",
    },
    {
      question: "Latency rises on every endpoint, including one that just returns a constant. What does that tell you?",
      options: [
        "The database is slow",
        "Something is blocking the event loop",
        "There is a memory leak",
        "The network is saturated",
      ],
      correctIndex: 1,
      explanation:
        "An endpoint doing no I/O can only be slow if it cannot get the thread. When the cheap routes slow down alongside the expensive ones, the thread is the bottleneck.",
    },
    {
      question: "You call `controller.abort()` during your own long `for` loop. What happens?",
      options: [
        "The loop stops immediately",
        "Nothing, unless the loop checks `signal.aborted`",
        "An AbortError is thrown into the loop",
        "The event loop cancels the function",
      ],
      correctIndex: 1,
      explanation:
        "Cancellation is cooperative, for the same reason blocking is possible: nothing can interrupt running JavaScript. The signal only matters where your code reads it.",
    },
  ],
  project: {
    name: "node-day-03",
    goal: "Fetch five URLs sequentially, then concurrently, measure both, and be able to explain the gap.",
    brief:
      "The measurement is the easy part. The value is in the questions at the end, because they are the difference between knowing that `Promise.all` is faster and knowing why, which is what stops you writing the sequential version by accident in real code. Note that the gap you measure is about overlapping waiting, not about running anything in parallel.",
    steps: [
      "Create `node-day-03/` with `package.json` containing `\"type\": \"module\"`, and an `app.js`.",
      "Put five URLs in an array. Any endpoints that take a moment to respond will do.",
      "Time the sequential version: `const start = performance.now()`, a `for...of` loop with `await fetch(url)` inside, then `performance.now()` again.",
      "Print the result as `Sequential: ${end - start}ms`.",
      "Time the concurrent version: `await Promise.all(urls.map(url => fetch(url)))` between the same two measurements.",
      "Print it as `Concurrent: ${end - start}ms` and compare the two numbers.",
      "Swap `Promise.all` for `Promise.allSettled` and make one URL invalid, so you can see the difference in what survives.",
      "Add a heartbeat with `setInterval` and confirm it keeps ticking during the concurrent fetches. Then add a synchronous loop and watch it stop.",
    ],
    acceptance: [
      "Both timings print, and the concurrent run is close to the slowest single request rather than the sum of all five.",
      "You can explain why `for (const url of urls) { await fetch(url) }` is slower.",
      "You can explain why `await Promise.all(urls.map(url => fetch(url)))` is usually faster, in terms of waiting rather than parallelism.",
      "You can state the difference between `Promise.all`, `Promise.allSettled`, `Promise.race` and `Promise.any`, including what `race` does when the first promise rejects.",
      "You can explain why `function loop() { process.nextTick(loop) }` is dangerous, and what to use instead for recursive work.",
      "You can say what happens to the event loop during `while (true) {}`, and why the heartbeat stops.",
      "You can order `setTimeout`, `setImmediate`, `process.nextTick` and `queueMicrotask`, and say which phase or queue each belongs to.",
    ],
    stretch: [
      "Add a timeout to each fetch with `AbortSignal.timeout(2000)` and handle the `TimeoutError` separately from a real failure.",
      "Write a `inBatches(urls, 2)` helper so the concurrent version runs at most two requests at a time, and see where the timing lands.",
      "Measure event loop lateness properly: log how far a 1000ms `setInterval` drifts, before and during a heavy synchronous loop.",
      "Rewrite the sequential version using `.then()` chaining instead of `await`, to prove they are the same mechanism.",
    ],
  },
};
