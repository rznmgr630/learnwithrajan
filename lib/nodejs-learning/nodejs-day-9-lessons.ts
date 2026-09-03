import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_9_LESSONS: LessonDay = {
  day: 9,
  title: "Events and the EventEmitter",
  totalMinutes: 90,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "observer-pattern",
      title: "The observer pattern, and where Node uses it",
      durationMinutes: 8,
      explanation:
        "<b>Events are one of the fundamental patterns behind Node.</b>\n\nYou have already met them:\n\n```javascript\nstream.on(\"data\", ...)\nstream.on(\"error\", ...)\nstream.on(\"end\", ...)\n```\n\nStreams use events. HTTP servers use events. Sockets use events. Understanding `EventEmitter` is understanding how Node itself is put together.\n\n```text\nSomething happens\n      ↓\nEvent is emitted\n      ↓\nListeners are notified\n      ↓\nThey run their callbacks\n```\n\n---\n\n## The observer pattern\n\n<b>Observer pattern</b> (a design pattern where one object announces that something happened and others listen for the announcement).\n\nA YouTube channel:\n\n```text\nChannel\n  ↓\nNew video uploaded\n  ↓\nNotify subscribers\n  ↓\nSubscriber A\nSubscriber B\nSubscriber C\n```\n\nThe channel does not need to know what each subscriber will do. It says:\n\n```text\n\"new video\"\n```\n\nand they decide how to react.\n\nThe part that makes it useful: the <b>direction of the dependency</b>. The channel does not import its subscribers. Subscribers reach out to the channel. So you can add a fifth subscriber without touching the channel at all, which is the whole reason the pattern exists.\n\n---\n\n## Where Node uses events\n\n```text\nHTTP server\n    ↓\nrequest event\n\nStream\n    ↓\ndata event\nerror event\nend event\n\nSocket\n    ↓\nconnect\ndata\nclose\nerror\n\nProcess\n    ↓\nexit\nSIGTERM\nSIGINT\n```\n\nSo this, from Day 8:\n\n```javascript\nstream.on(\"data\", chunk => {\n  console.log(chunk);\n});\n```\n\nis an event listener.\n\n---\n\n## Why Node was built this way\n\nWorth connecting to Day 3. Node's whole model is: start something, do not wait, get told when it finishes. \"Get told when it finishes\" is an event.\n\nSo events are not a library bolted on top. They are <b>how a non-blocking runtime has to be shaped</b>. A blocking API returns a value. A non-blocking one has to notify you, and a named event with listeners is the general form of that.\n\nWhich is why `process.on(\"SIGTERM\")` from Day 4, `stream.on(\"data\")` from Day 8 and `worker.on(\"message\")` from Day 11 are all the same mechanism. Learn it once and a large part of Node's surface stops looking like separate APIs.",
      diagram: `The dependency points inward, and that is the point

    WITHOUT events                  WITH events
    ┌──────────────────┐            ┌──────────────────┐
    │ Channel          │            │ Channel          │
    │  imports Logger  │            │  emits "upload"  │
    │  imports Emailer │            │                  │
    │  imports Metrics │            │  knows about     │
    │                  │            │  NOBODY          │
    │  add a fifth?    │            └────────┬─────────┘
    │  edit Channel    │                     │
    └──────────────────┘            ┌────────┼────────┐
                                    ↓        ↓        ↓
                                 Logger  Emailer  Metrics
                                    │
                            add a fifth: touch nothing


Events are how a non-blocking runtime has to be shaped

    blocking API        returns a value
                          const x = f()

    non-blocking API    has to NOTIFY you
                          f().on("done", ...)
                              └─ a named event with
                                 listeners is the
                                 general form of that

    which is why these are all the same mechanism:

      process.on("SIGTERM")      Day 4
      stream.on("data")          Day 8
      worker.on("message")       Day 11
      server.on("request")       Day 10
      socket.on("connect")

    learn it once and a large part of Node stops
    looking like separate APIs`,
      codeExample: {
        title: "The same pattern, everywhere you have already been",
        code: `import { EventEmitter } from "node:events";
import fs from "node:fs";
import http from "node:http";

// ── You have been using this since Day 8 ────────────────────
const stream = fs.createReadStream("package.json");
stream.on("data", (chunk) => console.log("data:", chunk.length, "bytes"));
stream.on("end", () => console.log("end"));
stream.on("error", (error) => console.error("error:", error.code));
//
// A Readable IS an EventEmitter:
console.log(stream instanceof EventEmitter);        // true


// ── And since Day 4 ────────────────────────────────────────
process.on("SIGTERM", () => console.log("graceful shutdown"));
process.on("exit", (code) => console.log("exiting", code));
//
// process is an EventEmitter too:
console.log(process instanceof EventEmitter);       // true


// ── And an HTTP server, which is Day 10 ────────────────────
const server = http.createServer();
server.on("request", (req, res) => res.end("ok"));
console.log(server instanceof EventEmitter);        // true
//
// http.createServer(handler) is just a shortcut for
// attaching a "request" listener.


// ── The dependency direction, in code ───────────────────────
class Channel extends EventEmitter {
  upload(title) {
    // knows nothing about who cares
    this.emit("upload", { title });
  }
}

const channel = new Channel();

// each subscriber reaches out to the channel
channel.on("upload", ({ title }) => console.log("email:", title));
channel.on("upload", ({ title }) => console.log("log:", title));
channel.on("upload", ({ title }) => console.log("metrics:", title));

channel.upload("Day 9");
// email: Day 9
// log: Day 9
// metrics: Day 9
//
// Adding a fourth subscriber does not touch Channel at all.
// That inversion is the whole reason for the pattern.

stream.destroy();
server.close();`,
      },
      keyTakeaways: [
        "The <b>observer pattern</b>: one object announces something happened, others listen.",
        "The useful part is the <b>direction of the dependency</b>: the announcer knows nothing about its listeners.",
        "So you can add a listener without touching the thing that emits.",
        "Node uses events everywhere: streams, HTTP servers, sockets, the process itself.",
        "You have been using them since Day 8's `stream.on(\"data\")` and Day 4's `process.on(\"SIGTERM\")`.",
        "Events are not a library bolted on. They are <b>how a non-blocking runtime has to be shaped</b>.",
        "A blocking call returns a value. A non-blocking one has to notify you, and a named event is the general form.",
        "Streams, `process`, sockets, servers and workers are all `EventEmitter`s. One mechanism, not many APIs.",
      ],
      commonMistakes: [
        "<b>Treating `EventEmitter` as an advanced topic you can skip</b> — it is the shape of most of Node's surface.",
        "<b>Making the emitter import its listeners</b> — that throws away the only benefit the pattern has.",
        "<b>Not realising `http.createServer(handler)` is a `'request'` listener</b> — the server is an emitter like everything else.",
      ],
      quiz: [
        {
          question: "What is the actual benefit of the observer pattern?",
          options: [
            "It is faster than calling functions",
            "The dependency points inward: the emitter knows nothing about its listeners, so you can add one without touching it",
            "It makes code asynchronous",
            "It reduces memory use",
          ],
          correctIndex: 1,
          explanation:
            "Listeners reach out to the emitter, not the other way round. That inversion is why you can add a fifth subscriber without editing the channel.",
        },
        {
          question: "Why is Node built so heavily around events?",
          options: [
            "It was a stylistic choice",
            "A non-blocking API cannot return a value, so it has to notify you, and a named event with listeners is the general form of that",
            "Events are required by ES modules",
            "To support browsers",
          ],
          correctIndex: 1,
          explanation:
            "That is why `stream.on(\"data\")`, `process.on(\"SIGTERM\")` and `worker.on(\"message\")` are all the same mechanism rather than separate APIs.",
        },
      ],
    },
    {
      id: "emitter-basics",
      title: "on, once, off, emit and arguments",
      durationMinutes: 14,
      explanation:
        "<b>`EventEmitter`</b> (a Node class letting objects emit named events and others listen for them).\n\n```javascript\nimport { EventEmitter } from \"node:events\";\n\nconst emitter = new EventEmitter();\n```\n\n---\n\n## `on()`\n\n<b>`on()`</b> (registers a listener that runs every time an event is emitted).\n\n```javascript\nemitter.on(\"hello\", () => {\n  console.log(\"Hello event happened\");\n});\n```\n\n```javascript\nemitter.emit(\"hello\");\nemitter.emit(\"hello\");\nemitter.emit(\"hello\");\n```\n\nprints three times.\n\n```text\non()\n ↓\nlisten repeatedly\n```\n\n---\n\n## `once()`\n\n<b>`once()`</b> (runs only the first time).\n\n```javascript\nemitter.once(\"connected\", () => {\n  console.log(\"Connected!\");\n});\n```\n\n```javascript\nemitter.emit(\"connected\");\nemitter.emit(\"connected\");\nemitter.emit(\"connected\");\n```\n\nprints once.\n\n```text\non()\n ↓\nevery time\n\nonce()\n ↓\nfirst time only\n```\n\nUse `once` for things that genuinely happen once: a connection opening, a server becoming ready, a job finishing. Using `on` for those is a slow leak, because the listener stays registered forever.\n\n---\n\n## `off()`\n\n<b>`off()`</b> (removes a listener).\n\n```javascript\nfunction handleMessage(message) {\n  console.log(message);\n}\n\nemitter.on(\"message\", handleMessage);\n\nemitter.off(\"message\", handleMessage);\n```\n\nNow `emitter.emit(\"message\", \"Hello\")` does nothing.\n\n---\n\n## You need the same function\n\nThis does not work:\n\n```javascript\nemitter.on(\"message\", () => {\n  console.log(\"Hello\");\n});\n\nemitter.off(\"message\", () => {\n  console.log(\"Hello\");\n});\n```\n\nThey are two different function objects. Instead:\n\n```javascript\nconst listener = () => {\n  console.log(\"Hello\");\n};\n\nemitter.on(\"message\", listener);\n\nemitter.off(\"message\", listener);\n```\n\n```text\non()\n ↓\nfunction A\n\noff()\n ↓\nmust provide function A\n```\n\nAnd here is the part that makes it dangerous: <b>`off()` with the wrong function fails silently</b>. No error, no return value to check. The listener count simply stays where it was, and you find out later when something fires twice.\n\nA `.bind(this)` inside `on()` has the same problem, because `bind` returns a new function every call. Store the bound version if you intend to remove it.\n\n---\n\n## Passing arguments\n\n```javascript\nemitter.on(\"userCreated\", user => {\n  console.log(\"User:\", user);\n});\n\nemitter.emit(\n  \"userCreated\",\n  {\n    id: 1,\n    name: \"Rajan\"\n  }\n);\n```\n\nMultiple arguments work too:\n\n```javascript\nemitter.on(\"progress\", (completed, total) => {\n  console.log(completed, total);\n});\n\nemitter.emit(\"progress\", 50, 100);\n```\n\nOne thing to know: arguments are passed <b>by reference</b>, not copied. Unlike Day 11's worker messages or IPC, nothing is serialised. So two listeners receive the same object, and if the first one mutates it the second sees the change. Usually convenient, occasionally a very confusing bug.\n\nA useful habit: emit one object rather than several positional arguments. `emit(\"progress\", { completed, total })` can gain a field later without breaking every listener, which positional arguments cannot.\n\n---\n\n## Event names\n\n```javascript\nemitter.on(\"user.created\", listener);\nemitter.on(\"job.completed\", listener);\nemitter.on(\"payment.failed\", listener);\n```\n\nName things that <b>happened</b>. Good:\n\n```text\nuser.created\norder.completed\npayment.failed\n```\n\nLess useful:\n\n```text\ncreateUser\ndoPayment\nprocessOrder\n```\n\nEvents are facts:\n\n> <b>\"Something happened.\"</b>\n\nThat naming rule is doing real work, not just being tidy. An imperative name like `createUser` implies the emitter is asking someone to do something, which means it cares whether anyone is listening. A past-tense name says it is announcing, and does not.\n\nOne last detail: <b>`emit()` returns a boolean</b>, `true` if there were listeners. That is the only feedback you get, and it is how you notice a typo in an event name, which is otherwise completely silent.",
      diagram: `on, once, off

    on(name, fn)      every time
    once(name, fn)    first time only, then removed
    off(name, fn)     remove it
    emit(name, ...)   run the listeners now

    use once() for things that happen once: connected,
    ready, finished. using on() for those is a slow leak.


off() fails SILENTLY with the wrong function

    emitter.on("msg",  () => log("hi"))
    emitter.off("msg", () => log("hi"))
                        └─ a DIFFERENT function object

    no error. no return value to check.
    listenerCount stays 1.

    you find out later, when something fires twice.

    same trap:
      emitter.on("msg", this.handle.bind(this))
      emitter.off("msg", this.handle.bind(this))
                          └─ bind() returns a NEW function
                             every call. store it.


Arguments are passed BY REFERENCE

    emit("user.created", user)
         │
         ├─► listener A     same object
         └─► listener B     same object
                              │
                    A mutates it → B sees the change

    unlike worker messages (Day 11) nothing is
    serialised. usually convenient, occasionally a
    very confusing bug.

    and prefer one object over positional args:
      emit("progress", { completed, total })
        └─ can gain a field later without breaking
           every listener


Name events as FACTS, not commands

    user.created      ✓  announcing
    order.completed   ✓
    payment.failed    ✓

    createUser        ✗  reads as a request, which
    doPayment         ✗  implies the emitter cares
    processOrder      ✗  whether anyone is listening


emit() returns a boolean

    emit("hello")   → true    someone was listening
    emit("helo")    → false   nobody was

    the ONLY feedback you get. it is how you catch a
    typo in an event name, which is otherwise silent.`,
      codeExample: {
        title: "The four methods, and the silent failure",
        code: `import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

// ── on: every time ──────────────────────────────────────────
emitter.on("hello", () => console.log("  hello listener"));
emitter.emit("hello");
emitter.emit("hello");
// runs twice


// ── once: first time only ───────────────────────────────────
emitter.once("connected", () => console.log("  connected!"));
emitter.emit("connected");
emitter.emit("connected");
emitter.emit("connected");
// runs once. and it removed itself:
console.log("connected listeners left:", emitter.listenerCount("connected"));
// 0


// ── emit returns whether anyone was listening ───────────────
console.log("emit hello:", emitter.emit("hello"));      // true
console.log("emit helo: ", emitter.emit("helo"));       // false
//
// The only feedback you get. This is how you catch a typo
// in an event name, which is otherwise completely silent.


// ── off needs the SAME function, and fails silently ─────────
const listener = (message) => console.log("  msg:", message);
emitter.on("message", listener);
console.log("count:", emitter.listenerCount("message"));        // 1

emitter.off("message", (message) => console.log("  msg:", message));
console.log("after wrong fn:", emitter.listenerCount("message")); // 1
//   still 1. No error. No warning. Nothing.

emitter.off("message", listener);
console.log("after right fn:", emitter.listenerCount("message")); // 0


// ── The bind() version of the same trap ─────────────────────
class Service {
  handle(msg) { console.log("  handled:", msg); }
}
const service = new Service();

// ✗ two different functions
// emitter.on("job", service.handle.bind(service));
// emitter.off("job", service.handle.bind(service));

// ✓ store the bound one
const bound = service.handle.bind(service);
emitter.on("job", bound);
emitter.off("job", bound);
console.log("bound removed:", emitter.listenerCount("job"));    // 0


// ── Arguments are by reference, not copied ──────────────────
const shared = new EventEmitter();

shared.on("user.created", (user) => {
  console.log("  A sees:", user.name);
  user.name = "MUTATED";                 // same object
});
shared.on("user.created", (user) => {
  console.log("  B sees:", user.name);   // MUTATED
});

shared.emit("user.created", { id: 1, name: "Rajan" });
// A sees: Rajan
// B sees: MUTATED
//
// Nothing is serialised, unlike Day 11's worker messages.


// ── Prefer one object over positional arguments ─────────────
shared.on("progress", ({ completed, total }) => {
  console.log(\`  \${completed}/\${total}\`);
});
shared.emit("progress", { completed: 50, total: 100 });
//
// Adding a "stage" field later breaks nothing. With
// emit("progress", 50, 100) every listener signature has
// to change.`,
      },
      keyTakeaways: [
        "`on()` listens every time, `once()` only the first, `off()` removes, `emit()` runs the listeners.",
        "`once()` removes itself, so use it for connected, ready and finished. `on()` for those is a slow leak.",
        "`off()` needs the <b>same function object</b>. A fresh arrow function does nothing.",
        "<b>And it fails silently</b>: no error, no return value. The count just stays where it was.",
        "`.bind(this)` returns a new function each call, so store the bound version if you plan to remove it.",
        "Arguments are passed <b>by reference</b>, not serialised. Two listeners share the same object.",
        "So one listener mutating an argument changes what the next one sees.",
        "Prefer emitting <b>one object</b> over positional arguments, so you can add a field later.",
        "Name events as facts that happened: `user.created`, not `createUser`.",
        "An imperative name implies the emitter cares whether anyone listens, which defeats the pattern.",
        "<b>`emit()` returns a boolean</b> saying whether anyone was listening. It is how you catch a name typo.",
      ],
      commonMistakes: [
        "<b>Calling `off()` with a new inline function</b> — nothing is removed and nothing tells you.",
        "<b>`off(name, fn.bind(this))`</b> — `bind` creates a new function, so it never matches the registered one.",
        "<b>Using `on()` for a one-time event</b> — the listener stays registered forever.",
        "<b>Mutating an event argument</b> — the next listener sees your change, since nothing is copied.",
        "<b>Emitting positional arguments</b> — adding a value later breaks every listener signature.",
        "<b>Naming events imperatively</b> — `createUser` reads as a request, not an announcement.",
        "<b>Ignoring `emit()`'s return value</b> — it is the only way to notice a misspelled event name.",
      ],
      quiz: [
        {
          question: "You call `off(\"message\", () => log(\"hi\"))` after registering `on(\"message\", () => log(\"hi\"))`. What happens?",
          options: [
            "The listener is removed",
            "Nothing is removed, and there is no error or warning",
            "A TypeError is thrown",
            "All `message` listeners are removed",
          ],
          correctIndex: 1,
          explanation:
            "Two identical-looking arrow functions are different objects, so nothing matches. The silence is what makes it dangerous: you notice later when something fires twice.",
        },
        {
          question: "Two listeners are registered for the same event and the first mutates its argument. What does the second receive?",
          options: [
            "The original value, since arguments are copied",
            "The mutated value, since arguments are passed by reference",
            "`undefined`",
            "An error",
          ],
          correctIndex: 1,
          explanation:
            "Nothing is serialised, unlike a worker message or IPC. Both listeners hold the same object, which is usually convenient and occasionally a very confusing bug.",
        },
        {
          question: "What does `emitter.emit(\"helo\")` return when you meant `\"hello\"`?",
          options: ["`true`", "`false`", "`undefined`", "It throws"],
          correctIndex: 1,
          explanation:
            "`false` means nobody was listening. That boolean is the only feedback you get, and it is the one way to catch a misspelled event name.",
        },
      ],
    },
    {
      id: "error-event",
      title: "The special error event",
      durationMinutes: 10,
      explanation:
        "This one matters more than the rest.\n\nNode treats:\n\n```text\nerror\n```\n\nspecially.\n\n```javascript\nemitter.emit(\n  \"error\",\n  new Error(\"Something went wrong\")\n);\n```\n\nWith nobody listening for `error`, Node throws it and terminates the process.\n\nSo if your emitter can emit errors, register:\n\n```javascript\nemitter.on(\"error\", error => {\n  console.error(error);\n});\n```\n\n---\n\n## Why is `error` special?\n\nMost unknown events are harmless:\n\n```javascript\nemitter.emit(\"hello\");\n```\n\nNo listener means nothing happens.\n\nBut:\n\n```javascript\nemitter.emit(\"error\", error);\n```\n\nwith no listener is an unhandled error condition.\n\n```text\nnormal event\n ↓\nno listener\n ↓\nokay\n\nerror event\n ↓\nno listener\n ↓\n💥 process may crash\n```\n\nDeliberate. It stops errors disappearing silently.\n\n---\n\n## What it actually looks like\n\nWorth seeing, because the output surprises people. The error is thrown <b>from the `emit()` call</b>:\n\n```text\ne.emit(\"error\", new Error(\"boom\"));\n                ^\n\nError: boom\n    at file:///.../t3.js:3:17\n```\n\nSo the stack points at the emit, not at your handler. And it is a genuine uncaught exception, which means Day 4's rules apply: it goes through `uncaughtException` and takes the process down.\n\nThe consequence worth internalising: <b>this is not a warning you can ignore</b>. An emitter that can fail and has no error listener is a crash waiting for the right input. That is exactly the shape of Day 8's `pipe()` problem, and the reason `pipeline()` exists.\n\n---\n\n## Do not forget error listeners\n\nIf you build an event-based component:\n\n```javascript\nclass JobRunner extends EventEmitter {\n  // ...\n}\n```\n\nand it emits:\n\n```javascript\nthis.emit(\"error\", error);\n```\n\nthe consumer must handle it:\n\n```javascript\nrunner.on(\"error\", error => {\n  console.error(\"Job failed:\", error);\n});\n```\n\n---\n\n## The design problem this creates\n\nThere is a real tension here, and knowing it will save you an argument.\n\nEmitting `error` puts the burden on <b>every consumer</b> to remember a listener, and forgetting means a crash rather than a handled failure. For a library that is a rough deal: your users get a process death for a mistake that produces no warning until it happens.\n\nSo for anything with a natural completion, prefer a promise. `await runner.run()` gives the caller `try/catch`, which they cannot forget in the same silent way. Reserve the `error` event for things that genuinely have no single call to reject: a long-lived connection, a stream, a watcher.\n\nAnd if you do emit `error`, one practical habit: attach a default listener inside your own class so a forgetful consumer gets a logged failure instead of a dead process. Then document that they should replace it.\n\nOne more asymmetry worth knowing: <b>`once(\"error\")` is not enough</b> if the emitter can fail more than once. The second error has no listener and crashes.",
      diagram: `Two kinds of event, two behaviours

    emit("hello")   no listener  →  nothing happens. fine.
    emit("error")   no listener  →  THROWN. process dies.

    deliberate: it stops errors disappearing silently.


What you actually see

    e.emit("error", new Error("boom"))
                    ^

    Error: boom
        at file:///.../t3.js:3:17

    the stack points at the EMIT, not your handler.

    and it is a real uncaught exception, so Day 4
    applies: uncaughtException, then the process dies.

    this is not a warning you can ignore. an emitter
    that can fail with no error listener is a crash
    waiting for the right input.
      └─ exactly Day 8's pipe() problem, and why
         pipeline() exists


The design tension, which is real

    emitting "error" puts the burden on EVERY consumer

    they forget a listener  →  process death
    with no warning until it happens

    for a library that is a rough deal.


    so: anything with a natural completion → a promise

      await runner.run()
        └─ try/catch, which cannot be forgotten
           in the same silent way

    reserve the error event for things with no single
    call to reject:
      a long-lived connection
      a stream
      a file watcher


    and if you do emit it, attach a default listener
    in your own class, so a forgetful consumer gets a
    log instead of a dead process. document that they
    should replace it.


once("error") is not enough

    if the emitter can fail twice, the second error
    has no listener. use on().`,
      codeExample: {
        title: "The crash, and how to design around it",
        code: `import { EventEmitter } from "node:events";

// ── With no listener, this kills the process ────────────────
// const bare = new EventEmitter();
// bare.emit("error", new Error("boom"));
//
// t3.js:3
// bare.emit("error", new Error("boom"));
//                    ^
// Error: boom
//     at file:///.../t3.js:3:17
//
// The stack points at the emit. It is a genuine uncaught
// exception, so Day 4's rules apply and the process dies.


// ── A normal event with no listener is fine ─────────────────
const emitter = new EventEmitter();
console.log("no listener, normal event:", emitter.emit("hello"));   // false
//   returns false, nothing else happens


// ── With a listener, it is just an event ────────────────────
emitter.on("error", (error) => console.error("handled:", error.message));
emitter.emit("error", new Error("boom"));           // handled: boom
emitter.emit("error", new Error("again"));          // handled: again


// ── once("error") is not enough for a repeat failure ────────
const flaky = new EventEmitter();
flaky.once("error", (e) => console.error("first:", e.message));
flaky.emit("error", new Error("one"));              // first: one
// flaky.emit("error", new Error("two"));           // ✗ CRASH
//   the once listener already removed itself


// ── A component that emits errors, defensively ──────────────
class JobRunner extends EventEmitter {
  constructor() {
    super();
    // a default so a forgetful consumer gets a log, not a
    // dead process. document that they should replace it.
    this.on("error", (error) => {
      if (this.listenerCount("error") === 1) {
        console.error("[JobRunner] unhandled:", error.message);
      }
    });
  }

  run() {
    this.emit("start");
    this.emit("error", new Error("step 3 failed"));
  }
}

const runner = new JobRunner();
runner.run();                    // logged, process survives


// ── But prefer a promise when there IS a completion ─────────
class BetterRunner extends EventEmitter {
  async run() {
    this.emit("start");                    // progress: an event
    throw new Error("step 3 failed");      // failure: a rejection
  }
}

const better = new BetterRunner();
better.on("start", () => console.log("started"));

try {
  await better.run();
} catch (error) {
  console.error("caught:", error.message);
}
//
// The caller cannot silently forget a try/catch the way they
// can forget an error listener. Reserve the error event for
// things with no single call to reject: a connection, a
// stream, a watcher.`,
      },
      keyTakeaways: [
        "`emit(\"error\")` with <b>no listener throws and terminates the process</b>.",
        "Every other event with no listener does nothing and returns `false`.",
        "That asymmetry is deliberate: it stops errors disappearing silently.",
        "The thrown error's stack points at the <b>`emit()` call</b>, not your handler.",
        "It is a genuine uncaught exception, so Day 4's rules apply.",
        "An emitter that can fail with no error listener is a crash waiting for the right input.",
        "Same shape as Day 8's `pipe()` problem, and the reason `pipeline()` exists.",
        "The design tension: emitting `error` puts the burden on <b>every consumer</b>, and forgetting means a crash.",
        "So prefer a <b>promise</b> for anything with a natural completion. `try/catch` cannot be forgotten as silently.",
        "Reserve the `error` event for things with no single call to reject: connections, streams, watchers.",
        "If you do emit it, attach a default listener in your own class so a forgetful consumer gets a log.",
        "<b>`once(\"error\")` is not enough</b> if the emitter can fail twice. The second error crashes.",
      ],
      commonMistakes: [
        "<b>Emitting `error` without documenting that a listener is required</b> — your users get a process death, not a warning.",
        "<b>Using `once(\"error\")` on something that can fail repeatedly</b> — the second failure crashes.",
        "<b>Reaching for events when the operation has a natural completion</b> — a promise gives the caller `try/catch` instead.",
        "<b>Assuming an unhandled `error` event is only a warning</b> — it is an uncaught exception.",
        "<b>Attaching the error listener after the emitter can already fail</b> — an early failure crashes before you get there.",
        "<b>Naming a non-fatal event `error`</b> — Node's special handling applies to the name. Use `warning` or similar.",
      ],
      quiz: [
        {
          question: "What happens when you `emit(\"error\", err)` with no `error` listener attached?",
          options: [
            "It returns `false` like any other unlistened event",
            "The error is thrown from the `emit()` call and the process terminates",
            "Node logs a warning",
            "The error is queued until a listener attaches",
          ],
          correctIndex: 1,
          explanation:
            "It becomes a genuine uncaught exception, with a stack pointing at the emit. That is deliberate, so errors cannot vanish silently.",
        },
        {
          question: "Why prefer a rejected promise over an `error` event for an operation with a natural completion?",
          options: [
            "Promises are faster",
            "The caller cannot silently forget a `try/catch` the way they can forget an error listener, where the penalty is a dead process",
            "Events cannot carry an Error object",
            "Promises are more modern",
          ],
          correctIndex: 1,
          explanation:
            "Emitting `error` shifts the burden to every consumer, and there is no warning until the crash. Reserve it for long-lived things with no single call to reject.",
        },
        {
          question: "Why is `once(\"error\", handler)` risky?",
          options: [
            "`once` does not work for `error`",
            "It removes itself after the first error, so a second failure has no listener and crashes",
            "It runs the handler twice",
            "It only catches synchronous errors",
          ],
          correctIndex: 1,
          explanation:
            "Anything that can fail more than once needs `on`. The second emit finds no listener and behaves exactly like having had none at all.",
        },
      ],
    },
    {
      id: "listener-leaks",
      title: "The max listeners warning",
      durationMinutes: 8,
      explanation:
        "Node warns you when an emitter accumulates listeners.\n\n```javascript\nfor (let i = 0; i < 100; i++) {\n  emitter.on(\"data\", listener);\n}\n```\n\nThe threshold is <b>10</b> per event name, and the eleventh gives you:\n\n```text\nMaxListenersExceededWarning: Possible EventEmitter memory leak\ndetected. 11 data listeners added to [EventEmitter].\nMaxListeners is 10. Use emitter.setMaxListeners() to increase limit\n```\n\nUsually it means:\n\n> <b>You probably have a listener leak.</b>\n\n```javascript\nfunction handleRequest() {\n  emitter.on(\"data\", listener);\n}\n```\n\nRun that thousands of times without removing anything:\n\n```text\nrequest 1 → +1 listener\nrequest 2 → +1 listener\nrequest 3 → +1 listener\n...\nrequest 1000\n       ↓\ntons of listeners\n       ↓\nmemory leak / duplicate work\n```\n\n---\n\n## Do not just raise the limit\n\nYou can change it, but do not immediately write:\n\n```javascript\nemitter.setMaxListeners(1000);\n```\n\njust to silence the warning. Ask:\n\n```text\nWhy are there so many listeners?\n```\n\nVery often the warning is telling you:\n\n```text\nSomething isn't being cleaned up.\n```\n\n---\n\n## Why the message is easy to misread\n\nNotice what the warning itself suggests: `Use emitter.setMaxListeners() to increase limit`. That advice is in the message, so raising the limit feels like the intended fix. It usually is not.\n\nAnd the two symptoms are worth separating. The <b>memory</b> is rarely the real problem, since a few hundred closures is nothing. The problem is <b>duplicate work</b>: a hundred registered handlers means one event runs your handler a hundred times. That shows up as duplicate emails, duplicate database writes, or a response written twice.\n\nSo the warning is not really about memory despite its name. It is Node noticing that you probably attach in a loop and never detach.\n\n---\n\n## The shape of the leak\n\nAlmost always the same: <b>a long-lived emitter and a short-lived listener</b>.\n\n```javascript\napp.get(\"/thing\", (req, res) => {\n  process.on(\"SIGTERM\", () => res.end());   // leaks per request\n});\n```\n\n`process` lives forever, the response does not. Every request adds a listener that can never be useful again.\n\nThe fix is to make the lifetimes match. Remove it when the short-lived thing ends, use `once` if it genuinely fires once, or attach at startup rather than per request.\n\nOne case that is <b>not</b> a leak: an emitter with genuinely many subscribers by design, such as a config object watched by twenty modules created once at startup. There, raising the limit is correct. The distinction is whether the number <b>grows over time</b>.\n\nWhich gives you the diagnostic: log `emitter.listenerCount(name)` periodically. Flat is fine at any number. Climbing is a leak whatever the number is.",
      diagram: `The warning, and what it really means

    11th listener on one event name:

    MaxListenersExceededWarning: Possible EventEmitter
    memory leak detected. 11 data listeners added to
    [EventEmitter]. MaxListeners is 10. Use
    emitter.setMaxListeners() to increase limit
                    │
                    └─ the message SUGGESTS the wrong fix.
                       raising the limit feels intended.
                       it usually is not.


It is not really about memory

    memory          a few hundred closures is nothing
    duplicate work  ← the actual problem

    100 registered handlers
        ↓
    one event runs your handler 100 times
        ↓
    duplicate emails
    duplicate database writes
    a response written twice


The shape of every leak: mismatched lifetimes

    LONG-LIVED emitter  +  SHORT-LIVED listener

    app.get("/thing", (req, res) => {
      process.on("SIGTERM", () => res.end())
      └─ process lives forever
                          └─ this response does not
    })

    every request adds a listener that can never
    be useful again


    the fix: make the lifetimes match
      remove it when the short-lived thing ends
      use once() if it fires once
      attach at startup, not per request


What is NOT a leak

    a config object watched by 20 modules, all
    created once at startup
      └─ raising the limit is correct here

    the distinction is whether the number GROWS


The diagnostic

    log emitter.listenerCount(name) periodically

    flat at 40      fine
    climbing at 12  a leak

    the number does not matter. the slope does.`,
      codeExample: {
        title: "Spotting a leak, and the case that is not one",
        code: `import { EventEmitter } from "node:events";

// ── The warning, at the 11th listener ───────────────────────
process.on("warning", (w) =>
  console.log("WARNING:", w.name, "|", w.message.split(".")[0]),
);

const emitter = new EventEmitter();
for (let i = 0; i < 11; i += 1) emitter.on("data", () => {});
// WARNING: MaxListenersExceededWarning | Possible EventEmitter
//          memory leak detected


// ── Why it matters: duplicate work, not memory ──────────────
const dupes = new EventEmitter();
let sent = 0;

function handleRequest() {
  dupes.on("user.created", () => { sent += 1; });   // ✗ never removed
}

handleRequest();
handleRequest();
handleRequest();

dupes.emit("user.created", { id: 1 });
console.log("emails sent for ONE event:", sent);     // 3
//
// A few hundred closures is nothing for memory. Three
// welcome emails for one signup is the actual bug.


// ── The shape: long-lived emitter, short-lived listener ─────
// app.get("/thing", (req, res) => {
//   process.on("SIGTERM", () => res.end());     ✗ leaks per request
// });
//
// process lives forever. The response does not.


// ── Fix 1: remove it when the short thing ends ──────────────
const server = new EventEmitter();

function handleRequestProperly(res) {
  const onShutdown = () => res.end();
  server.on("shutdown", onShutdown);

  // when the response finishes, detach
  res.done = () => server.off("shutdown", onShutdown);
}

const fakeRes = { end() {} };
handleRequestProperly(fakeRes);
console.log("during request:", server.listenerCount("shutdown"));   // 1
fakeRes.done();
console.log("after request: ", server.listenerCount("shutdown"));   // 0


// ── Fix 2: once, when it genuinely fires once ───────────────
const conn = new EventEmitter();
conn.once("connected", () => console.log("ready"));
conn.emit("connected");
console.log("self-removed:", conn.listenerCount("connected"));      // 0


// ── The case that is NOT a leak ─────────────────────────────
const config = new EventEmitter();
config.setMaxListeners(30);          // ✓ correct here

for (let i = 0; i < 20; i += 1) {
  config.on("changed", () => {});    // 20 modules, once at startup
}
console.log("config listeners:", config.listenerCount("changed"));  // 20
//
// Fixed at 20 forever. Raising the limit is right.


// ── The diagnostic: slope, not number ───────────────────────
const watched = new EventEmitter();
const samples = [];
for (let request = 1; request <= 3; request += 1) {
  watched.on("tick", () => {});              // simulate the leak
  samples.push(watched.listenerCount("tick"));
}
console.log("listener count over time:", samples);   // [ 1, 2, 3 ]
//
// Flat at 40 is fine. Climbing at 12 is a leak.
// The number does not matter. The slope does.`,
      },
      keyTakeaways: [
        "The default threshold is <b>10 listeners per event name</b>, and the eleventh triggers a warning.",
        "The warning text suggests `setMaxListeners()`, which is usually the <b>wrong fix</b>.",
        "Despite the name, memory is rarely the real problem. A few hundred closures is nothing.",
        "<b>Duplicate work is the problem</b>: a hundred handlers means one event runs your handler a hundred times.",
        "That shows up as duplicate emails, duplicate writes, or a response written twice.",
        "Every leak has the same shape: a <b>long-lived emitter and a short-lived listener</b>.",
        "`process.on(...)` inside a request handler is the classic version.",
        "Fix it by matching lifetimes: remove on completion, use `once`, or attach at startup.",
        "Not every case is a leak. Twenty modules watching one config object at startup is fine, and raising the limit is correct.",
        "The distinction is whether the number <b>grows over time</b>.",
        "So the diagnostic is the <b>slope</b>, not the number. Log `listenerCount` periodically.",
      ],
      commonMistakes: [
        "<b>Calling `setMaxListeners(1000)` to silence the warning</b> — the message suggests it, and it hides a real bug.",
        "<b>Registering a listener inside a request handler</b> — the emitter outlives the request, so it accumulates.",
        "<b>Assuming the warning is about memory</b> — duplicate handler execution is what actually breaks things.",
        "<b>Treating any large listener count as a leak</b> — a fixed twenty at startup is fine. Watch for growth.",
        "<b>Using `on()` where `once()` fits</b> — a self-removing listener cannot leak.",
        "<b>Ignoring the warning because nothing looks broken</b> — the duplicate work may be silent until it is not.",
      ],
      quiz: [
        {
          question: "Why is the `MaxListenersExceededWarning` message itself misleading?",
          options: [
            "It reports the wrong count",
            "It suggests `setMaxListeners()` to raise the limit, which usually hides a real leak instead of fixing it",
            "It fires too late",
            "It only appears in development",
          ],
          correctIndex: 1,
          explanation:
            "The advice is right there in the text, so raising the limit feels like the intended fix. Almost always it means something is attaching and never detaching.",
        },
        {
          question: "What actually breaks when listeners accumulate?",
          options: [
            "Memory runs out",
            "One event runs your handler many times, producing duplicate emails, writes or responses",
            "The event loop blocks",
            "The emitter stops firing",
          ],
          correctIndex: 1,
          explanation:
            "A few hundred closures cost nothing. Three welcome emails for one signup is the bug, which is why the warning matters despite its name.",
        },
        {
          question: "How do you tell a leak from a legitimately busy emitter?",
          options: [
            "By the total number of listeners",
            "By whether the count grows over time: flat at 40 is fine, climbing at 12 is a leak",
            "By the event name",
            "By whether the warning fires",
          ],
          correctIndex: 1,
          explanation:
            "Twenty modules watching a config object at startup is fixed forever and perfectly fine. The slope is the signal, not the number.",
        },
      ],
    },
    {
      id: "promise-helpers",
      title: "events.once and events.on",
      durationMinutes: 12,
      explanation:
        "Two module-level helpers that bridge events into async code.\n\n---\n\n## `events.once()`\n\n```javascript\nimport { once } from \"node:events\";\n```\n\nYou can await an event:\n\n```javascript\nconst emitter = new EventEmitter();\n\nsetTimeout(() => {\n  emitter.emit(\"ready\");\n}, 1000);\n\nawait once(emitter, \"ready\");\n\nconsole.log(\"Ready!\");\n```\n\n```text\nwait\n ↓\nevent happens\n ↓\nPromise resolves\n ↓\ncontinue\n```\n\n---\n\n## `once()` vs `events.once()`\n\nDo not confuse:\n\n```javascript\nemitter.once(\"ready\", listener);\n```\n\nwith:\n\n```javascript\nawait once(emitter, \"ready\");\n```\n\nThe first:\n\n```text\nEventEmitter method\n ↓\nregister one listener\n```\n\nThe second:\n\n```text\nevents.once()\n ↓\nreturns a Promise\n ↓\nawait event\n```\n\nTwo things it does for you that a hand-rolled promise would not. It resolves with an <b>array</b> of the emit arguments, since an event can carry several. And it <b>also rejects on `'error'`</b>, so `await once(server, \"listening\")` fails properly if the port is taken instead of hanging forever.\n\nThat second point is the reason to use it. The obvious hand-written version waits only for success and hangs on failure.\n\nYou have already seen it used in Day 11: `const [code] = await once(child, \"close\")`.\n\n---\n\n## `events.on()`\n\n```javascript\nimport { on } from \"node:events\";\n```\n\n<b>`events.on()`</b> (turns emitter events into an async iterable you can consume with `for await...of`).\n\n```javascript\nconst emitter = new EventEmitter();\n\n(async () => {\n  for await (const args of on(emitter, \"progress\")) {\n    console.log(args);\n  }\n})();\n```\n\n```javascript\nemitter.emit(\"progress\", 10);\nemitter.emit(\"progress\", 20);\nemitter.emit(\"progress\", 30);\n```\n\n---\n\n## Why an array?\n\n```javascript\nemitter.emit(\n  \"progress\",\n  50,\n  100\n);\n```\n\ngives you:\n\n```text\n[50, 100]\n```\n\nBecause an event can have multiple arguments.\n\n```text\nemit(event, a, b, c)\n          ↓\nevents.on()\n          ↓\n[a, b, c]\n```\n\nSo destructure at the top of the loop: `for await (const [completed, total] of ...)`. Or emit a single object, as the earlier lesson suggested, and it is `[{ completed, total }]`, which is one layer to unwrap either way.\n\n---\n\n## Stopping it\n\nA `for await` loop can run forever, so you need a way out. An `AbortSignal`:\n\n```javascript\nconst controller = new AbortController();\n\nconst signal = controller.signal;\n```\n\n```javascript\nfor await (\n  const args of on(\n    emitter,\n    \"progress\",\n    { signal }\n  )\n) {\n  console.log(args);\n}\n```\n\n```javascript\ncontroller.abort();\n```\n\nOne detail the docs understate: aborting does not end the loop cleanly, it <b>throws an `AbortError`</b>. So wrap it:\n\n```javascript\ntry {\n  for await (const args of on(emitter, \"progress\", { signal })) {\n    console.log(args);\n  }\n} catch (error) {\n  if (error.name !== \"AbortError\") throw error;\n}\n```\n\nWithout that, a deliberate cancellation surfaces as an unhandled rejection. Same shape as Day 3's point that an `AbortError` is not a real failure and should be checked for by name.\n\nA `break` also ends the loop, and is simpler when the exit condition is something you can see from inside.\n\n---\n\n## The buffering catch\n\nOne thing to know before using this on a busy emitter. `events.on` <b>queues events you have not consumed yet</b>, with no limit by default.\n\nSo if the emitter produces faster than the loop processes, that queue grows. This is Day 8's backpressure problem in a new place, and unlike a stream there is no watermark stopping the producer, because `emit()` is synchronous and cannot be slowed down.\n\nWhich is the honest limitation: `events.on` is right for a manageable rate of discrete events, and a stream is right for a firehose.",
      diagram: `Two different things with the same name

    emitter.once("ready", fn)        a method. registers
                                     one listener.

    await once(emitter, "ready")     a module function.
                                     returns a promise.


events.once does two things you would forget

    1  resolves with an ARRAY of the emit arguments
         const [code, signal] = await once(child, "close")

    2  ALSO rejects on "error"
         await once(server, "listening")
           └─ port taken? it REJECTS.
              a hand-rolled version waits only for
              success and HANGS.

    that second point is the reason to use it.


events.on gives arrays, for the same reason

    emit("progress", 50, 100)
              ↓
    for await (const args of on(e, "progress"))
              ↓
    args = [50, 100]

    destructure at the top:
      for await (const [completed, total] of ...)


Aborting THROWS, it does not end cleanly

    controller.abort()
        ↓
    the loop throws AbortError

    try {
      for await (const a of on(e, "p", { signal })) { }
    } catch (error) {
      if (error.name !== "AbortError") throw error
    }

    without that, a deliberate cancellation becomes
    an unhandled rejection.
      └─ Day 3: an AbortError is not a real failure


The buffering catch

    events.on QUEUES unconsumed events, unlimited
    by default

    emitter faster than the loop
        ↓
    the queue grows

    Day 8's backpressure, in a new place. and unlike
    a stream there is no watermark, because emit() is
    synchronous and cannot be slowed down.

    so: events.on for a manageable rate of discrete
    events. a stream for a firehose.`,
      codeExample: {
        title: "Awaiting one event, and iterating many",
        code: `import { EventEmitter, once, on } from "node:events";

// ── events.once: await a single event ───────────────────────
const emitter = new EventEmitter();
setTimeout(() => emitter.emit("ready", "v1", 3000), 20);

const [version, port] = await once(emitter, "ready");
console.log("ready:", version, port);          // ready: v1 3000
//   resolves with an ARRAY of the emit arguments


// ── And it rejects on "error", which is the point ───────────
const failing = new EventEmitter();
setTimeout(() => failing.emit("error", new Error("port in use")), 20);

try {
  await once(failing, "listening");
} catch (error) {
  console.log("rejected:", error.message);     // port in use
}
//
// A hand-rolled promise waiting only for "listening" would
// hang here forever. This is why you use the helper.
//
// You saw it in Day 11:
//   const [code, signal] = await once(child, "close");


// ── events.on: iterate many events ──────────────────────────
const progress = new EventEmitter();
const controller = new AbortController();

setTimeout(() => {
  progress.emit("progress", 1, 3);
  progress.emit("progress", 2, 3);
  progress.emit("progress", 3, 3);
  controller.abort();
}, 20);

try {
  for await (const [completed, total] of on(progress, "progress", {
    signal: controller.signal,
  })) {
    console.log(\`  \${completed}/\${total}\`);
  }
} catch (error) {
  if (error.name !== "AbortError") throw error;
  console.log("iteration cancelled");
}
//   1/3
//   2/3
//   3/3
//   iteration cancelled
//
// Aborting THROWS rather than ending cleanly. Without the
// catch, a deliberate cancellation is an unhandled rejection.


// ── break works too, and is simpler when you can see why ────
const counter = new EventEmitter();
setInterval(() => counter.emit("tick"), 5).unref();

let ticks = 0;
for await (const _ of on(counter, "tick")) {
  if (++ticks === 3) break;
}
console.log("stopped after", ticks, "ticks");


// ── The buffering catch ─────────────────────────────────────
const firehose = new EventEmitter();

const iterator = on(firehose, "data");
for (let i = 0; i < 1000; i += 1) firehose.emit("data", i);
//   1000 events emitted, none consumed yet.
//
// events.on queues them, with no limit by default. Day 8's
// backpressure in a new place, and there is no watermark to
// slow the producer because emit() is synchronous.
//
// So: events.on for a manageable rate of discrete events.
// A stream for a firehose.

const first = await iterator.next();
console.log("first queued value:", first.value);      // [ 0 ]
await iterator.return();`,
      },
      keyTakeaways: [
        "`emitter.once(name, fn)` is a method that registers a listener. `once(emitter, name)` returns a promise.",
        "`events.once` resolves with an <b>array</b> of the emit arguments, so destructure it.",
        "<b>It also rejects on `'error'`</b>, which is the real reason to use it.",
        "A hand-rolled promise waiting only for success hangs when the operation fails.",
        "You already used it in Day 11: `const [code] = await once(child, \"close\")`.",
        "`events.on(emitter, name)` turns events into an async iterable for `for await`.",
        "It yields arrays too, since an event can carry several arguments.",
        "<b>Aborting throws an `AbortError`</b> rather than ending the loop cleanly. Catch and check the name.",
        "Without that catch, a deliberate cancellation becomes an unhandled rejection.",
        "`break` also ends the loop, and reads better when the exit condition is visible inside it.",
        "`events.on` <b>queues unconsumed events with no limit</b>. Day 8's backpressure, in a new place.",
        "There is no watermark to slow the producer, because `emit()` is synchronous. Use a stream for a firehose.",
      ],
      commonMistakes: [
        "<b>Confusing `emitter.once()` with `events.once()`</b> — one registers a listener, the other returns a promise.",
        "<b>Hand-rolling a promise around a single event</b> — you forget the `'error'` case and it hangs on failure.",
        "<b>Not destructuring the resolved value</b> — it is an array, even for one argument.",
        "<b>Not catching the `AbortError` from `events.on`</b> — cancellation becomes an unhandled rejection.",
        "<b>Treating the `AbortError` as a real failure</b> — check `error.name` first, as in Day 3.",
        "<b>Using `events.on` on a high-rate emitter</b> — unconsumed events queue without limit.",
        "<b>Expecting backpressure from `events.on`</b> — `emit()` is synchronous and cannot be slowed.",
      ],
      quiz: [
        {
          question: "Why use `await once(server, \"listening\")` instead of hand-rolling a promise around that event?",
          options: [
            "It is shorter",
            "It also rejects on the `'error'` event, so a failure like a taken port fails instead of hanging",
            "It is faster",
            "It supports multiple events",
          ],
          correctIndex: 1,
          explanation:
            "The obvious hand-written version waits only for success. `events.once` wires up the error path too, which is exactly the case you would forget.",
        },
        {
          question: "You call `controller.abort()` while iterating with `events.on`. What happens to the loop?",
          options: [
            "It ends cleanly",
            "It throws an `AbortError`, which becomes an unhandled rejection if uncaught",
            "It pauses until resumed",
            "It returns `undefined` and continues",
          ],
          correctIndex: 1,
          explanation:
            "Cancellation surfaces as a rejection. Wrap the loop and re-throw anything whose `name` is not `AbortError`, as in Day 3.",
        },
        {
          question: "What is the limitation of `events.on` on a high-rate emitter?",
          options: [
            "It drops events",
            "It queues unconsumed events without limit, and there is no way to slow the producer because `emit()` is synchronous",
            "It only yields the first event",
            "It blocks the event loop",
          ],
          correctIndex: 1,
          explanation:
            "Day 8's backpressure problem with no watermark to solve it. That is why it suits a manageable rate of discrete events and a stream suits a firehose.",
        },
      ],
    },
    {
      id: "abort-and-eventtarget",
      title: "AbortSignal and EventTarget",
      durationMinutes: 10,
      explanation:
        "## AbortSignal with listeners\n\nNode supports `AbortSignal` across many APIs, and you will see this written:\n\n```javascript\nconst controller = new AbortController();\n\nemitter.on(\n  \"message\",\n  listener,\n  { signal: controller.signal }\n);\n```\n\nwith the expectation that `controller.abort()` removes the listener.\n\n<b>It does not.</b> `EventEmitter.prototype.on` takes two arguments, and a third is silently ignored:\n\n```javascript\nconst e = new EventEmitter();\nconst c = new AbortController();\n\nlet fired = 0;\ne.on(\"x\", () => { fired++; }, { signal: c.signal });\n\ne.emit(\"x\");\nc.abort();\ne.emit(\"x\");\n\nconsole.log(fired);   // 2\n```\n\nStill 2. The listener count stays at 1 after abort. No error, no warning, and the cleanup you thought you had is not there. Which makes it a nastier version of the `off()` problem from earlier: you wrote something reasonable-looking that quietly does nothing.\n\n---\n\n## Where signals genuinely work\n\nThree places:\n\n<b>`events.once`</b> rejects with an `AbortError`:\n\n```javascript\nawait once(emitter, \"ready\", { signal });\n```\n\n<b>`events.on`</b> ends the iteration, as the last lesson covered.\n\n<b>`EventTarget.addEventListener`</b> genuinely removes the listener:\n\n```javascript\ntarget.addEventListener(\"x\", listener, { signal });\n```\n\nThat one works because `addEventListener` has always taken an options object. So the pattern is real, it just belongs to the Web-style API and not to `EventEmitter`.\n\nFor an `EventEmitter`, use `events.addAbortListener` or simply call `off()` yourself:\n\n```javascript\nsignal.addEventListener(\"abort\", () => {\n  emitter.off(\"message\", listener);\n}, { once: true });\n```\n\n```text\nRequest starts\n    ↓\nregister listeners\n    ↓\nrequest finishes/cancels\n    ↓\nabort()\n    ↓\nlisteners cleaned up\n```\n\nThat shape is still exactly what you want for the leak from the last lesson. You just have to wire the removal yourself.\n\n---\n\n## `EventTarget`\n\nNode also supports the Web-style API:\n\n```text\nEventTarget\nEvent\naddEventListener()\nremoveEventListener()\ndispatchEvent()\n```\n\n```javascript\nconst target = new EventTarget();\n\ntarget.addEventListener(\n  \"message\",\n  event => {\n    console.log(\"Message received\");\n  }\n);\n\ntarget.dispatchEvent(\n  new Event(\"message\")\n);\n```\n\n---\n\n## EventEmitter vs EventTarget\n\n### EventEmitter\n\n```javascript\nemitter.on(\"message\", listener);\nemitter.emit(\"message\", data);\n```\n\nNode-style.\n\n### EventTarget\n\n```javascript\ntarget.addEventListener(\"message\", listener);\n\ntarget.dispatchEvent(\n  new Event(\"message\")\n);\n```\n\nWeb-style.\n\nSame mental model:\n\n```text\nSomething happens\n      ↓\nEvent\n      ↓\nListeners react\n```\n\nDifferent APIs.\n\n---\n\n## Which to use\n\nThree practical differences beyond syntax.\n\n<b>Arguments.</b> `emit(name, a, b, c)` passes several values. `dispatchEvent` passes one `Event` object, so extra data goes in a `CustomEvent`'s `detail`. The emitter version is more convenient in Node.\n\n<b>The error event.</b> `EventTarget` has no special `error` handling, so dispatching one with no listener does nothing rather than crashing. Safer, and it also means errors can vanish silently, which is the trade Node made in the other direction.\n\n<b>Options.</b> `addEventListener` supports `{ once, signal, passive }`, which is why the signal pattern works there and not on `on()`.\n\nThe rule: <b>`EventEmitter` for Node code, `EventTarget` when you need Web compatibility</b>. `AbortSignal` itself is an `EventTarget`, which is why `signal.addEventListener(\"abort\", ...)` is the shape you use above.",
      diagram: `The pattern that does NOT work on an EventEmitter

    emitter.on("x", listener, { signal })
                               └─ SILENTLY IGNORED

    on() takes two arguments. a third does nothing.

    let fired = 0
    e.on("x", () => fired++, { signal: c.signal })
    e.emit("x")      fired = 1
    c.abort()
    e.emit("x")      fired = 2      ← still firing

    listenerCount after abort: 1

    no error, no warning. a nastier version of the
    off() problem: reasonable-looking code that
    quietly does nothing.


Where signals DO work

    events.once(e, "ready", { signal })
      → rejects with AbortError                   ✓

    events.on(e, "progress", { signal })
      → ends the iteration                        ✓

    target.addEventListener("x", fn, { signal })
      → genuinely removes the listener            ✓
        because addEventListener has always
        taken an options object


    for an EventEmitter, wire it yourself:

      signal.addEventListener("abort", () => {
        emitter.off("message", listener)
      }, { once: true })

    (AbortSignal is itself an EventTarget, which is
     why this shape works)


EventEmitter vs EventTarget: three real differences

                    EventEmitter      EventTarget
    arguments       emit(n, a, b, c)  one Event object
                    several values    extra data in
                                      CustomEvent.detail

    error event     SPECIAL. no       nothing special.
                    listener = crash  no listener = fine
                                        └─ safer, and
                                           errors can
                                           vanish

    options         none on on()      { once, signal,
                                        passive }
                                        └─ why the signal
                                           pattern works
                                           here


    rule: EventEmitter for Node, EventTarget for
          Web compatibility`,
      codeExample: {
        title: "The signal pattern, where it works and where it does not",
        code: `import { EventEmitter, once, on } from "node:events";

// ══ It does NOT work on emitter.on ═════════════════════════
const emitter = new EventEmitter();
const c1 = new AbortController();

let fired = 0;
emitter.on("x", () => { fired += 1; }, { signal: c1.signal });

emitter.emit("x");
c1.abort();
await new Promise((r) => setTimeout(r, 10));
emitter.emit("x");

console.log("fired:", fired);                          // 2
console.log("still registered:", emitter.listenerCount("x"));   // 1
//
// The third argument is silently ignored. No error, no
// warning, and the cleanup you thought you had is absent.


// ══ It DOES work on EventTarget ════════════════════════════
const target = new EventTarget();
const c2 = new AbortController();

let dispatched = 0;
target.addEventListener("x", () => { dispatched += 1; }, {
  signal: c2.signal,
});

target.dispatchEvent(new Event("x"));
c2.abort();
target.dispatchEvent(new Event("x"));

console.log("dispatched:", dispatched);                // 1
//   the listener really was removed


// ══ And on the events helpers ══════════════════════════════
const c3 = new AbortController();
const pending = once(emitter, "never", { signal: c3.signal })
  .catch((error) => error.name);
c3.abort();
console.log("once with signal:", await pending);        // AbortError


// ══ For an EventEmitter, wire it yourself ══════════════════
function subscribeForRequest(emitter, signal) {
  const listener = (msg) => console.log("  got:", msg);
  emitter.on("message", listener);

  // AbortSignal is itself an EventTarget, so this works
  signal.addEventListener("abort", () => {
    emitter.off("message", listener);
  }, { once: true });
}

const bus = new EventEmitter();
const request = new AbortController();

subscribeForRequest(bus, request.signal);
console.log("during request:", bus.listenerCount("message"));   // 1

bus.emit("message", "hello");
request.abort();
console.log("after abort:  ", bus.listenerCount("message"));    // 0
//   which is the leak fix from the previous lesson


// ══ CustomEvent carries data on EventTarget ════════════════
const web = new EventTarget();
web.addEventListener("user.created", (event) => {
  console.log("  detail:", event.detail);
});
web.dispatchEvent(new CustomEvent("user.created", {
  detail: { id: 1, name: "Rajan" },
}));
//   one Event object, extra data in .detail.
//   emit(name, a, b, c) is more convenient in Node.


// ══ And no special error handling ══════════════════════════
const safe = new EventTarget();
safe.dispatchEvent(new Event("error"));
console.log("EventTarget error with no listener: fine");
//   an EventEmitter would have crashed here. Safer, and it
//   also means errors can vanish silently. That is the trade
//   Node made in the other direction.`,
      },
      keyTakeaways: [
        "<b>`emitter.on(name, fn, { signal })` does not work.</b> `on()` takes two arguments and ignores a third.",
        "The listener still fires after `abort()`, with no error or warning.",
        "A nastier version of the `off()` problem: reasonable-looking code that quietly does nothing.",
        "Signals <b>do</b> work on `events.once` (rejects), `events.on` (ends iteration) and `addEventListener` (removes).",
        "`addEventListener` supports it because it has always taken an options object.",
        "For an `EventEmitter`, wire removal yourself: `signal.addEventListener(\"abort\", () => emitter.off(...))`.",
        "`AbortSignal` is itself an `EventTarget`, which is why that shape works.",
        "`EventTarget` is the Web-style API: `addEventListener`, `removeEventListener`, `dispatchEvent`.",
        "`emit(name, a, b, c)` passes several values. `dispatchEvent` passes one `Event`, with data in `CustomEvent.detail`.",
        "`EventTarget` has <b>no special `error` handling</b>, so an unlistened error does nothing rather than crashing.",
        "Safer, and it also means errors can vanish. That is the trade Node made in the other direction.",
        "Rule: `EventEmitter` for Node code, `EventTarget` for Web compatibility.",
      ],
      commonMistakes: [
        "<b>Passing `{ signal }` to `emitter.on()`</b> — silently ignored, and you believe you have cleanup you do not have.",
        "<b>Assuming every Node API that mentions AbortSignal supports it</b> — check, because failure here is silent.",
        "<b>Expecting `dispatchEvent` to take extra arguments</b> — use a `CustomEvent` and its `detail`.",
        "<b>Assuming `EventTarget` crashes on an unhandled error event</b> — it does not, which cuts both ways.",
        "<b>Using `EventTarget` for ordinary Node code</b> — `EventEmitter` is more convenient and what the ecosystem expects.",
        "<b>Forgetting `{ once: true }` on the abort listener</b> — a small leak in your leak fix.",
      ],
      quiz: [
        {
          question: "You write `emitter.on(\"x\", fn, { signal })` and call `abort()`. What happens to the listener?",
          options: [
            "It is removed",
            "Nothing. `on()` ignores the third argument, so the listener still fires",
            "A TypeError is thrown",
            "It is removed on the next tick",
          ],
          correctIndex: 1,
          explanation:
            "`EventEmitter.prototype.on` takes two arguments. The options object is silently ignored, so you believe you have cleanup that is not there.",
        },
        {
          question: "Which API genuinely honours `{ signal }` for listener removal?",
          options: [
            "`emitter.on`",
            "`EventTarget.addEventListener`",
            "`emitter.once`",
            "`emitter.addListener`",
          ],
          correctIndex: 1,
          explanation:
            "`addEventListener` has always accepted an options object, so `{ once, signal, passive }` all work there. For an emitter, wire the `off()` call yourself.",
        },
        {
          question: "What happens when you dispatch an `error` event on an `EventTarget` with no listener?",
          options: [
            "The process crashes, as with EventEmitter",
            "Nothing happens, because EventTarget has no special error handling",
            "A warning is logged",
            "It throws a TypeError",
          ],
          correctIndex: 1,
          explanation:
            "Safer in one sense, and it also means an error can vanish silently. Node's emitter made the opposite trade deliberately.",
        },
      ],
    },
    {
      id: "extending-and-coupling",
      title: "Extending EventEmitter, and loose coupling",
      durationMinutes: 10,
      explanation:
        "## Your own event-based classes\n\n```javascript\nimport { EventEmitter } from \"node:events\";\n\nclass JobRunner extends EventEmitter {\n  start() {\n    this.emit(\"start\");\n\n    // do work...\n  }\n}\n```\n\n```javascript\nconst runner = new JobRunner();\n\nrunner.on(\"start\", () => {\n  console.log(\"Job started\");\n});\n\nrunner.start();\n```\n\nThat is Day 2's `extends` doing real work.\n\nOne ordering trap: a listener registered <b>after</b> a synchronous emit never runs. If `start()` emits immediately, a consumer who calls `runner.start()` before attaching listeners sees nothing. Either emit on a later tick, or make the constructor not do work.\n\n---\n\n## A progress event\n\nSuppose the job has 100 steps:\n\n```javascript\nthis.emit(\"progress\", {\n  completed: 50,\n  total: 100\n});\n```\n\nConsumer:\n\n```javascript\nrunner.on(\"progress\", ({ completed, total }) => {\n  console.log(\n    `${completed}/${total}`\n  );\n});\n```\n\nThis separates:\n\n```text\nJob logic\n```\n\nfrom:\n\n```text\nProgress UI/logging\n```\n\nAnd it is the case where events genuinely beat the alternatives. A promise can only tell you one thing, at the end. A callback parameter (`run({ onProgress })`) works but takes exactly one consumer. An event takes any number, and the job code does not change when you add a second.\n\n---\n\n## Loose coupling\n\nWithout events:\n\n```text\nJobRunner\n   ↓\nknows about\n   ↓\nLogger\nProgress UI\nDatabase\nNotifications\n```\n\nTightly coupled. With events:\n\n```text\nJobRunner\n   ↓\n\"job.completed\"\n   ↓\nListeners\n ┌──────┬──────┬──────┐\n ↓      ↓      ↓\nLogger  DB    Notification\n```\n\nThe runner does not need to know who is listening.\n\n---\n\n## What loose coupling actually costs\n\nWorth being honest, because \"loose coupling\" is usually presented as free.\n\nYou lose <b>the ability to find the callers</b>. With a direct call, jumping to the definition tells you everything that runs. With an event, you search for the string `\"job.completed\"` and hope nobody built the name dynamically.\n\nYou lose <b>return values</b>. Listeners cannot tell the emitter anything. `emit()` returns a boolean about whether anyone listened, and nothing about what they did.\n\nYou lose <b>error propagation</b>. A listener that throws during a synchronous `emit()` propagates out of the `emit()` call, so a failing logger can break the job that emitted the event. That surprises people, and it is the reverse of the isolation events seem to promise.\n\nAnd you lose <b>ordering guarantees you can reason about</b>. Listeners run in registration order, which means behaviour depends on import order somewhere else in the program.\n\nNone of that argues against events. It argues for using them where the trade pays: <b>an announcement with an unknown number of interested parties</b>. Which is exactly the progress case, and exactly not a four-step sequence, as the next lesson covers.",
      diagram: `Progress is where events genuinely win

    a promise            can tell you ONE thing, at the end
                           await run()   →   the result

    a callback param     exactly ONE consumer
                           run({ onProgress })

    an event             ANY number of consumers, and the
                         job code does not change when
                         you add another
                           this.emit("progress", {...})


What loose coupling actually costs

    you lose FINDING THE CALLERS
      direct call    jump to definition, see everything
      event          grep for "job.completed" and hope
                     nobody built the name dynamically

    you lose RETURN VALUES
      listeners cannot tell the emitter anything.
      emit() returns a boolean about whether anyone
      listened, not what they did.

    you lose ERROR ISOLATION       ← the surprising one
      a listener that throws during a synchronous emit()
      propagates OUT of the emit() call
        ↓
      a failing logger can break the job that emitted
      the event
        ↓
      the reverse of what events seem to promise

    you lose REASONABLE ORDERING
      listeners run in registration order, so behaviour
      depends on import order elsewhere in the program


The ordering trap when you extend

    class Runner extends EventEmitter {
      start() { this.emit("start") }     synchronous
    }

    runner.start()                  ✗ emitted already
    runner.on("start", fn)            fn never runs

    either emit on a later tick, or do not do work
    in the constructor`,
      codeExample: {
        title: "A job runner, and what the decoupling costs",
        code: `import { EventEmitter } from "node:events";

// ── Extending, with progress ────────────────────────────────
class JobRunner extends EventEmitter {
  async run(steps) {
    this.emit("start", { total: steps });

    for (let completed = 1; completed <= steps; completed += 1) {
      await new Promise((r) => setTimeout(r, 1));
      this.emit("progress", { completed, total: steps });
    }

    this.emit("done", { total: steps });
  }
}

const runner = new JobRunner();

// any number of independent consumers
runner.on("start", ({ total }) => console.log("start:", total));
runner.on("progress", ({ completed, total }) =>
  console.log(\`  \${completed}/\${total}\`),
);
runner.on("done", () => console.log("done"));

// a second progress consumer, and the job code is untouched
let peak = 0;
runner.on("progress", ({ completed }) => { peak = completed; });

await runner.run(3);
console.log("peak seen by the second consumer:", peak);


// ── The ordering trap ───────────────────────────────────────
class EagerRunner extends EventEmitter {
  constructor() {
    super();
    this.emit("ready");            // ✗ synchronous, in the ctor
  }
}

const eager = new EagerRunner();
eager.on("ready", () => console.log("never runs"));
console.log("nothing printed above: the emit already happened");


// ── What you lose 1: return values ──────────────────────────
const bus = new EventEmitter();
bus.on("validate", (user) => user.name.length > 0);   // returned, ignored

console.log("emit returns:", bus.emit("validate", { name: "Rajan" }));
// true — meaning "someone listened", not "validation passed"
//
// Listeners cannot tell the emitter anything.


// ── What you lose 2: error isolation, surprisingly ──────────
const fragile = new EventEmitter();

fragile.on("job.completed", () => {
  throw new Error("logger blew up");
});
fragile.on("job.completed", () => {
  console.log("this second listener never runs");
});

try {
  fragile.emit("job.completed");
} catch (error) {
  console.log("the emit() threw:", error.message);
}
//
// A synchronous listener throwing propagates OUT of emit(),
// so a failing logger breaks the job that emitted the event,
// and stops later listeners. The reverse of what events seem
// to promise.


// ── What you lose 3: reasonable ordering ────────────────────
const ordered = new EventEmitter();
ordered.on("x", () => console.log("  registered first"));
ordered.on("x", () => console.log("  registered second"));
ordered.emit("x");
//
// Registration order, which depends on import order somewhere
// else in your program.


// ── None of that argues against events ──────────────────────
// It argues for using them where the trade pays: an
// announcement with an unknown number of interested parties.
//
// Progress:  yes.
// A four-step sequence:  no. Next lesson.`,
      },
      keyTakeaways: [
        "`class JobRunner extends EventEmitter` gives your own class `on`, `once`, `off` and `emit`.",
        "A listener registered <b>after</b> a synchronous emit never runs. Do not emit in a constructor.",
        "Progress is the case where events genuinely win: a promise reports one thing at the end.",
        "A callback parameter takes exactly one consumer. An event takes any number, with no change to the job code.",
        "Loose coupling is not free, and four things are worth knowing.",
        "You lose <b>finding the callers</b>: grep for a string instead of jumping to a definition.",
        "You lose <b>return values</b>: `emit()` says whether anyone listened, not what they did.",
        "You lose <b>error isolation</b>: a listener throwing during a synchronous `emit()` propagates out of it.",
        "So a failing logger can break the job that emitted the event, and stop later listeners.",
        "You lose <b>reasonable ordering</b>: listeners run in registration order, which depends on import order.",
        "None of that argues against events. It argues for using them for announcements with unknown consumers.",
      ],
      commonMistakes: [
        "<b>Emitting synchronously in a constructor</b> — no consumer can have attached a listener yet.",
        "<b>Expecting a listener's return value to reach the emitter</b> — it is discarded.",
        "<b>Assuming a throwing listener is isolated</b> — it propagates out of `emit()` and stops the rest.",
        "<b>Relying on listener order</b> — it is registration order, so it depends on import order elsewhere.",
        "<b>Using an event where a single callback parameter would do</b> — one consumer does not need the indirection.",
        "<b>Presenting loose coupling as free</b> — you trade traceability, return values and error isolation for it.",
      ],
      quiz: [
        {
          question: "A listener throws during a synchronous `emit()`. What happens?",
          options: [
            "The error is swallowed and other listeners continue",
            "It propagates out of the `emit()` call and later listeners do not run",
            "It becomes an `error` event",
            "It is logged as a warning",
          ],
          correctIndex: 1,
          explanation:
            "That is the reverse of what events seem to promise. A failing logger can break the job that emitted the event, which is worth knowing before you rely on decoupling for isolation.",
        },
        {
          question: "Why is progress reporting a genuinely good fit for events?",
          options: [
            "Events are faster than callbacks",
            "A promise can only report once at the end, and a callback parameter takes one consumer, while an event takes any number with no change to the job code",
            "Progress must be asynchronous",
            "Callbacks cannot carry objects",
          ],
          correctIndex: 1,
          explanation:
            "That is the shape events are for: an announcement where the number of interested parties is unknown and may grow.",
        },
        {
          question: "Your class emits `\"ready\"` in its constructor. What does a consumer see?",
          options: [
            "The event, since listeners are queued",
            "Nothing, because the emit happened before any listener could be attached",
            "A warning",
            "The event on the next tick",
          ],
          correctIndex: 1,
          explanation:
            "`emit` is synchronous and runs whatever is registered right then, which is nothing. Emit on a later tick, or do not do work in the constructor.",
        },
      ],
    },
    {
      id: "when-not-to",
      title: "When not to use events",
      durationMinutes: 10,
      explanation:
        "An important piece of professional judgement.\n\nEvents are good when:\n\n```text\nSomething happened\nand\nmultiple independent things may care.\n```\n\nFor example:\n\n```text\nuser.created\n```\n\nmaybe:\n\n```text\nSend welcome email\nCreate audit log\nUpdate analytics\n```\n\n---\n\n## Do not use events for everything\n\nSuppose you need:\n\n```text\ngetUser()\n   ↓\nvalidateUser()\n   ↓\nchargeCard()\n   ↓\ncreateOrder()\n```\n\nDo not turn that into:\n\n```text\nuser.loaded\n ↓\nuser.validated\n ↓\ncard.charged\n ↓\norder.created\n```\n\nif the operations must happen in a strict, understandable sequence. A plain chain is clearer:\n\n```javascript\nconst user = await getUser();\nawait validateUser(user);\nawait chargeCard(user);\nawait createOrder(user);\n```\n\nAnd notice what the event version specifically loses on <b>this</b> example. If `chargeCard` fails, the promise version stops and you handle it. The event version has already returned from the `user.validated` listener, so there is nothing to stop and nobody to tell. Error handling in a sequence is the thing events are worst at.\n\n---\n\n## Event vs function call\n\n### Use a function when:\n\n```text\nI need this specific operation\nand\nI need its result.\n```\n\n```javascript\nconst user = await getUser();\n```\n\n### Use an event when:\n\n```text\nSomething happened\nand\nzero, one, or many listeners may care.\n```\n\n```javascript\nemitter.emit(\"user.created\", user);\n```\n\nThe word doing the work is <b>zero</b>. If it would be a bug for nobody to be listening, it is not an event, it is a function call you have made hard to find.\n\n---\n\n## Event spaghetti\n\n```text\norder.created\n     ↓\nlistener A\n     ↓\nevent B\n     ↓\nlistener C\n     ↓\nevent D\n     ↓\nlistener F\n```\n\nNow someone asks:\n\n> \"Why was this email sent?\"\n\nYou trace a chain of events across many files.\n\n<b>Event spaghetti</b> (a system where too many loosely connected events make the flow hard to follow).\n\n> Events are powerful. Do not use them because they look advanced.\n\nThe specific thing that turns useful events into spaghetti is <b>listeners that emit</b>. One event with three independent listeners is easy: you read the emit site and the three handlers. A listener that emits another event has created a chain nobody can see from either end.\n\nSo a rule worth holding: <b>listeners should do work, not announce more work</b>. Keep the graph one level deep and events stay readable.\n\n---\n\n## The question that settles it\n\nWhen you are unsure, ask:\n\n> Do I care whether anyone is listening?\n\nCare, and it is a function call. Do not care, and it is an event. That single question resolves most of these decisions, and it also explains the naming rule from earlier: a past-tense name describes something you are announcing regardless, and an imperative one describes something you want done.",
      diagram: `The question that settles it

    "Do I care whether anyone is listening?"
                    │
        ┌───────────┴───────────┐
       YES                     NO
        │                       │
    a FUNCTION CALL         an EVENT
        │                       │
    I need this to happen   this happened,
    and I need the result   whoever cares can react

    if it would be a BUG for nobody to be listening,
    it is not an event. it is a function call you
    have made hard to find.


Why a sequence should not be events

    await getUser()
    await validateUser(user)
    await chargeCard(user)        ← this fails
    await createOrder(user)         nothing after runs.
                                    you handle it.

    user.loaded → user.validated → card.charged → ...
                                        │ fails
                                        └─ the listener
                                           already returned.
                                           nothing to stop,
                                           nobody to tell.

    error handling in a sequence is what events are
    worst at.


What turns useful events into spaghetti

    ONE LEVEL: readable
      order.created
          ├─► send email
          ├─► write audit log
          └─► update analytics
      read the emit site and three handlers. done.

    LISTENERS THAT EMIT: unreadable
      order.created
          └─► listener A
                  └─ emits order.priced
                          └─► listener C
                                  └─ emits invoice.ready
                                          └─► listener F
                                                  └─ sends
                                                     an email

      "why was this email sent?"
        └─ trace four files and hope the names
           are not built dynamically


    rule: listeners should DO WORK, not announce
          more work. keep the graph one level deep.`,
      codeExample: {
        title: "The same flow, both ways",
        code: `import { EventEmitter } from "node:events";

const getUser = async (id) => ({ id, name: "Rajan", card: "ok" });
const validateUser = async (u) => { if (!u.name) throw new Error("no name"); };
const chargeCard = async (u) => { throw new Error("card declined"); };
const createOrder = async (u) => ({ orderId: 99 });

// ══ A sequence: a promise chain ════════════════════════════
try {
  const user = await getUser(1);
  await validateUser(user);
  await chargeCard(user);            // fails here
  await createOrder(user);
  console.log("order created");
} catch (error) {
  console.log("handled:", error.message);      // card declined
}
//
// The failure stops the sequence and you handle it in one
// place. Four lines, and the flow is the code.


// ══ The same thing as events: worse ════════════════════════
const bus = new EventEmitter();

bus.on("user.loaded", async (user) => {
  await validateUser(user);
  bus.emit("user.validated", user);            // a listener emitting
});

bus.on("user.validated", async (user) => {
  try {
    await chargeCard(user);
    bus.emit("card.charged", user);
  } catch (error) {
    // and now what? the sequence has no caller to tell.
    console.log("charge failed, and nothing upstream knows");
  }
});

bus.on("card.charged", async (user) => {
  bus.emit("order.created", await createOrder(user));
});

bus.emit("user.loaded", await getUser(1));
await new Promise((r) => setTimeout(r, 20));
//
// Error handling in a sequence is what events are worst at.
// The listener already returned. Nothing to stop, nobody
// to tell.


// ══ Where events ARE right: one announcement, N listeners ══
const events = new EventEmitter();

events.on("user.created", (u) => console.log("  email to", u.name));
events.on("user.created", (u) => console.log("  audit log for", u.id));
events.on("user.created", (u) => console.log("  analytics for", u.id));

async function signUp(name) {
  const user = { id: 2, name };                // the sequence: functions
  // await db.insert(user);
  events.emit("user.created", user);           // the announcement: an event
  return user;
}

await signUp("Sita");
//   email to Sita
//   audit log for 2
//   analytics for 2
//
// It would not be a bug for nobody to listen. That is the
// test.


// ══ The rule that keeps it readable ════════════════════════
// ✓ listeners DO WORK
//   order.created  →  send email
//                  →  write audit log
//                  →  update analytics
//
// ✗ listeners ANNOUNCE MORE WORK
//   order.created  →  listener A emits order.priced
//                                →  listener C emits
//                                   invoice.ready  →  ...
//
// One level deep stays readable. Two levels is spaghetti.`,
      },
      keyTakeaways: [
        "Events fit when something happened and <b>multiple independent things may care</b>.",
        "A strict sequence should be a promise chain, not a series of events.",
        "The specific loss is <b>error handling</b>: a failing step in an event chain has no caller to tell.",
        "Use a <b>function</b> when you need this operation and its result.",
        "Use an <b>event</b> when zero, one or many listeners may care.",
        "The word doing the work is <b>zero</b>. If nobody listening would be a bug, it is a function call.",
        "<b>Event spaghetti</b> is a flow you cannot follow because it is spread across loosely linked handlers.",
        "The specific cause is <b>listeners that emit</b>. One level deep is readable, two is not.",
        "So: listeners should do work, not announce more work.",
        "The question that settles it: <b>do I care whether anyone is listening?</b>",
        "Care means a function call. Do not care means an event. It also explains the past-tense naming rule.",
      ],
      commonMistakes: [
        "<b>Turning a sequence into a chain of events</b> — you lose the single place to handle a failure.",
        "<b>Emitting from inside a listener</b> — that is what makes an event graph impossible to trace.",
        "<b>Using an event when nobody listening would be a bug</b> — that is a function call you have hidden.",
        "<b>Reaching for events because they look advanced</b> — the indirection has a real cost.",
        "<b>Relying on an event's listeners to complete before continuing</b> — `emit()` tells you nothing about that.",
        "<b>Naming an event imperatively</b> — it is a sign you wanted a function call.",
      ],
      quiz: [
        {
          question: "What single question best decides between an event and a function call?",
          options: [
            "Is the operation asynchronous?",
            "Do I care whether anyone is listening?",
            "How many files are involved?",
            "Does it return a value?",
          ],
          correctIndex: 1,
          explanation:
            "If it would be a bug for nobody to be listening, it is a function call you have made hard to find. If you genuinely do not care, it is an announcement.",
        },
        {
          question: "What does an event chain specifically lose compared to a promise chain, in a four-step sequence?",
          options: [
            "Speed",
            "Error handling: a failing step has no caller to stop or inform",
            "The ability to pass objects",
            "Type safety",
          ],
          correctIndex: 1,
          explanation:
            "The listener has already returned by the time the next step fails, so there is nothing upstream to catch it. A promise chain stops and hands you the failure in one place.",
        },
        {
          question: "What turns a useful set of events into event spaghetti?",
          options: [
            "Too many listeners on one event",
            "Listeners that emit further events, creating a chain nobody can see from either end",
            "Using string event names",
            "Emitting objects instead of arguments",
          ],
          correctIndex: 1,
          explanation:
            "One event with three independent handlers is easy to read. A handler that emits another event is what makes \"why was this email sent?\" a four-file investigation.",
        },
      ],
    },
    {
      id: "synchronous",
      title: "EventEmitter is synchronous",
      durationMinutes: 8,
      explanation:
        "A subtle but important point.\n\nWhen you call:\n\n```javascript\nemitter.emit(\"hello\");\n```\n\nlisteners are called <b>synchronously</b>.\n\n```javascript\nemitter.on(\"hello\", () => {\n  console.log(\"Listener\");\n});\n\nconsole.log(\"Before\");\n\nemitter.emit(\"hello\");\n\nconsole.log(\"After\");\n```\n\n```text\nBefore\nListener\nAfter\n```\n\nThe listener runs <b>during</b> `emit()`.\n\nThat is worth pausing on, because the name suggests otherwise. \"Emitting an event\" sounds like posting a message. It is not. `emit()` is a `for` loop over the listener array, calling each one. Nothing is queued and nothing is deferred.\n\nWhich explains three things you already met. A throwing listener propagates out of `emit()`, because you are inside the call. An `error` event with no listener throws from the emit site. And a listener registered after a synchronous emit never runs.\n\n---\n\n## Do not block inside listeners\n\nBecause they run synchronously:\n\n```javascript\nemitter.on(\"data\", () => {\n  expensiveCPUWork();\n});\n```\n\nIf the work takes a long time:\n\n```text\nemit()\n ↓\nlistener\n ↓\nCPU-heavy work\n ↓\nevent loop blocked\n```\n\nYour process cannot handle other work during it.\n\nEvents do not make CPU-heavy work asynchronous. Day 11's rule applies unchanged: that work belongs in a worker thread or a queue.\n\n---\n\n## And async listeners are not awaited\n\nThe other half, and the one that causes real bugs:\n\n```javascript\nemitter.on(\"user.created\", async (user) => {\n  await sendWelcomeEmail(user);\n});\n\nemitter.emit(\"user.created\", user);\nconsole.log(\"done\");    // prints before the email is sent\n```\n\n`emit()` calls the function and discards the returned promise. So:\n\n<b>You cannot know when listeners finished.</b> `emit()` returns a boolean immediately.\n\n<b>A rejection is unhandled.</b> If `sendWelcomeEmail` throws, nothing catches it, and Day 4's rules mean the process dies. This is the most common event-related crash in real code.\n\nSo an async listener needs its own error handling:\n\n```javascript\nemitter.on(\"user.created\", async (user) => {\n  try {\n    await sendWelcomeEmail(user);\n  } catch (error) {\n    logger.error(error);\n  }\n});\n```\n\nSame shape as Day 3's `.forEach` with an async callback: the caller does not await you, so the promise floats.\n\nAnd if you genuinely need to wait for listeners, an emitter is the wrong tool. Collect promises and `await Promise.all`, or call the functions directly. That is the earlier lesson's point arriving from a different direction: needing to know the outcome means you wanted a function call.",
      diagram: `emit() is a for loop, not a message queue

    emitter.emit("hello")
        │
        └─► for (const fn of listeners) fn(...args)
                    │
                    └─ synchronous. nothing queued.
                       nothing deferred.

    Before
    Listener      ← runs DURING emit()
    After


    which explains three things you already met

    a throwing listener propagates out of emit()
      └─ because you are inside the call

    emit("error") with no listener throws from the
    emit site

    a listener registered after a synchronous emit
    never runs


Async listeners are NOT awaited

    emitter.on("user.created", async (user) => {
      await sendWelcomeEmail(user)
    })

    emitter.emit("user.created", user)
    console.log("done")        ← prints FIRST

    emit() calls the function and DISCARDS the promise.

    two consequences:

    1  you cannot know when listeners finished
         emit() returns a boolean, immediately

    2  a rejection is UNHANDLED
         nothing catches it → Day 4 → the process dies
         └─ the most common event-related crash in
            real code

    same shape as Day 3's .forEach with an async
    callback: the caller does not await you, so the
    promise floats.


    so every async listener needs its own try/catch.

    and if you need to WAIT for listeners, an emitter
    is the wrong tool. collect promises and
    Promise.all, or just call the functions.
      └─ needing the outcome means you wanted a
         function call`,
      codeExample: {
        title: "Synchronous emit, and the floating promise",
        code: `import { EventEmitter } from "node:events";

const emitter = new EventEmitter();

// ── emit is synchronous ─────────────────────────────────────
emitter.on("hello", () => console.log("  Listener"));

console.log("Before");
emitter.emit("hello");
console.log("After");
// Before
//   Listener
// After
//
// emit() is a for loop over the listener array. Nothing is
// queued, nothing deferred.


// ── Which is why CPU work in a listener blocks ──────────────
emitter.on("heavy", () => {
  let total = 0;
  for (let i = 0; i < 50_000_000; i += 1) total += i;
  console.log("  heavy done");
});

const start = performance.now();
emitter.emit("heavy");
console.log(\`emit() took \${Math.round(performance.now() - start)}ms\`);
//
// The emit call itself took that long. Day 11's rule is
// unchanged: CPU work belongs in a worker or a queue.


// ── Async listeners are NOT awaited ─────────────────────────
const sendWelcomeEmail = async (user) => {
  await new Promise((r) => setTimeout(r, 20));
  console.log("  email sent to", user.name);
};

emitter.on("user.created", async (user) => {
  await sendWelcomeEmail(user);
});

emitter.emit("user.created", { name: "Rajan" });
console.log("emit returned, email NOT sent yet");
// emit returned, email NOT sent yet
//   email sent to Rajan          ← 20ms later


// ── And a rejection is unhandled ────────────────────────────
const failing = new EventEmitter();

failing.on("job", async () => {
  throw new Error("listener failed");        // ✗ nothing catches this
});

// failing.emit("job");
//   → unhandled rejection → Day 4's rules → process dies
//
// The most common event-related crash in real code.


// ── So every async listener needs its own catch ─────────────
const safe = new EventEmitter();

safe.on("job", async () => {
  try {
    throw new Error("listener failed");
  } catch (error) {
    console.log("  handled inside the listener:", error.message);
  }
});

safe.emit("job");
console.log("process survives");
//
// Same shape as Day 3's .forEach with an async callback: the
// caller does not await you, so the promise floats.


// ── If you need to WAIT, do not use an emitter ──────────────
const handlers = [
  async (user) => { await sendWelcomeEmail(user); },
  async (user) => { console.log("  audit for", user.name); },
];

await Promise.all(handlers.map((h) => h({ name: "Sita" })));
console.log("all handlers finished, and I know it");
//
// Needing the outcome means you wanted function calls.`,
      },
      keyTakeaways: [
        "`emit()` is <b>synchronous</b>: a `for` loop over the listener array, calling each one.",
        "Nothing is queued and nothing is deferred, despite what \"emitting an event\" suggests.",
        "That explains a throwing listener propagating out of `emit()`, and an unlistened `error` throwing there too.",
        "It also explains why a listener registered after a synchronous emit never runs.",
        "CPU-heavy work in a listener <b>blocks the event loop</b>. Events do not make it asynchronous.",
        "Day 11's rule is unchanged: that work belongs in a worker thread or a queue.",
        "<b>Async listeners are not awaited.</b> `emit()` calls the function and discards the promise.",
        "So you cannot know when listeners finished. `emit()` returns a boolean immediately.",
        "And a rejection is <b>unhandled</b>, which under Day 4's rules kills the process.",
        "That is the most common event-related crash in real code, so every async listener needs its own `try/catch`.",
        "Same shape as Day 3's `.forEach` with an async callback: the caller does not await you.",
        "If you need to wait for listeners, use `Promise.all` over functions instead. Needing the outcome means you wanted a function call.",
      ],
      commonMistakes: [
        "<b>Assuming `emit()` schedules listeners for later</b> — they run inside the call, before it returns.",
        "<b>An `async` listener with no `try/catch`</b> — the rejection is unhandled and the process dies.",
        "<b>Expecting to know when listeners finished</b> — `emit()` returns a boolean immediately.",
        "<b>CPU-heavy work in a listener</b> — it blocks the loop exactly as it would anywhere else.",
        "<b>Awaiting `emit()`</b> — it does not return a promise.",
        "<b>Using an emitter when you need every handler to complete</b> — collect promises and `Promise.all` instead.",
      ],
      quiz: [
        {
          question: "What does `emit()` actually do?",
          options: [
            "Queues the listeners to run on the next tick",
            "Loops over the listener array and calls each one synchronously",
            "Returns a promise that resolves when listeners finish",
            "Schedules a microtask per listener",
          ],
          correctIndex: 1,
          explanation:
            "It is a plain loop. That single fact explains why a throwing listener propagates out of `emit()`, why an unlistened `error` throws there, and why a late listener never runs.",
        },
        {
          question: "An `async` listener throws and has no internal `try/catch`. What happens?",
          options: [
            "The error becomes an `error` event",
            "It is an unhandled rejection, which under Day 4's rules terminates the process",
            "`emit()` throws",
            "The error is logged and ignored",
          ],
          correctIndex: 1,
          explanation:
            "`emit()` discards the returned promise, so nothing catches the rejection. It is the most common event-related crash in real code.",
        },
        {
          question: "You need every handler for an event to finish before continuing. What should you do?",
          options: [
            "`await emitter.emit(name, data)`",
            "Collect the handlers as functions and `await Promise.all(...)` instead",
            "Use `emitter.once` instead of `on`",
            "Set `emitter.setMaxListeners(0)`",
          ],
          correctIndex: 1,
          explanation:
            "`emit()` does not return a promise and cannot tell you when listeners finished. Needing the outcome means you wanted function calls, not an announcement.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why is Node built so heavily around events?",
      options: [
        "A stylistic preference",
        "A non-blocking API cannot return a value, so it has to notify you, and a named event with listeners is the general form",
        "Events are required by ES modules",
        "For browser compatibility",
      ],
      correctIndex: 1,
      explanation:
        "Which is why `stream.on(\"data\")`, `process.on(\"SIGTERM\")` and `worker.on(\"message\")` are one mechanism rather than three APIs.",
    },
    {
      question: "You call `off(\"msg\", () => log(\"hi\"))` after `on(\"msg\", () => log(\"hi\"))`. What happens?",
      options: [
        "The listener is removed",
        "Nothing is removed, with no error or warning",
        "A TypeError",
        "All listeners for that event are removed",
      ],
      correctIndex: 1,
      explanation:
        "Two identical-looking arrows are different objects. The silence is the danger: you notice later when something fires twice.",
    },
    {
      question: "`emit(\"error\", err)` with no `error` listener does what?",
      options: [
        "Returns `false` like any other unlistened event",
        "Throws from the `emit()` call and terminates the process",
        "Logs a warning",
        "Queues the error",
      ],
      correctIndex: 1,
      explanation:
        "A genuine uncaught exception, with a stack pointing at the emit. Deliberate, so errors cannot vanish silently.",
    },
    {
      question: "What actually breaks when listeners accumulate past the warning threshold?",
      options: [
        "Memory runs out",
        "One event runs your handler many times, giving duplicate emails, writes or responses",
        "The emitter stops firing",
        "The event loop blocks",
      ],
      correctIndex: 1,
      explanation:
        "A few hundred closures cost nothing. Despite the warning's name, duplicate handler execution is the bug.",
    },
    {
      question: "Why use `await once(server, \"listening\")` rather than a hand-rolled promise?",
      options: [
        "It is shorter",
        "It also rejects on `'error'`, so a taken port fails instead of hanging forever",
        "It is faster",
        "It supports several events at once",
      ],
      correctIndex: 1,
      explanation:
        "The hand-written version waits only for success. Wiring up the error path is exactly what you would forget.",
    },
    {
      question: "`emitter.on(\"x\", fn, { signal })` then `abort()`. Is the listener removed?",
      options: [
        "Yes",
        "No. `on()` takes two arguments and silently ignores a third",
        "Yes, on the next tick",
        "It throws a TypeError",
      ],
      correctIndex: 1,
      explanation:
        "The signal pattern works on `addEventListener`, `events.once` and `events.on`, but not on `emitter.on`. For an emitter, wire the `off()` call yourself.",
    },
    {
      question: "A synchronous listener throws during `emit()`. What happens to the other listeners?",
      options: [
        "They still run",
        "They do not run, and the error propagates out of the `emit()` call",
        "They run on the next tick",
        "The error becomes an `error` event",
      ],
      correctIndex: 1,
      explanation:
        "You are inside the emit call, so a failing logger can break the job that emitted the event. The reverse of what decoupling seems to promise.",
    },
    {
      question: "What single question decides between an event and a function call?",
      options: [
        "Is it asynchronous?",
        "Do I care whether anyone is listening?",
        "How many listeners are there?",
        "Does it return a value?",
      ],
      correctIndex: 1,
      explanation:
        "If nobody listening would be a bug, it is a function call you have made hard to find. Not caring is what makes something an announcement.",
    },
    {
      question: "An `async` listener rejects with no internal `try/catch`. What is the result?",
      options: [
        "`emit()` throws",
        "An unhandled rejection, which terminates the process",
        "The error is logged",
        "It becomes an `error` event",
      ],
      correctIndex: 1,
      explanation:
        "`emit()` discards the promise it gets back, so nothing catches the rejection. It is the most common event-related crash in real code.",
    },
  ],
  project: {
    name: "day-09",
    goal: "Build a JobRunner that emits start, progress, done and error, then consume it with events.on and cancel it with an AbortController.",
    brief:
      "The runner is straightforward. The interesting parts are the two things the API does not make obvious. Aborting an events.on loop throws an AbortError rather than ending cleanly, so an uncaught cancellation becomes an unhandled rejection. And an async listener is never awaited, so any listener that can reject needs its own try/catch or the process dies. Get those two right and you have understood the lesson.",
    steps: [
      "Create `day-09/` with `package.json` containing `\"type\": \"module\"`, and an `index.js`.",
      "Write `class JobRunner extends EventEmitter` with a `run(steps)` method.",
      "Emit `start` with the total, `progress` with `{ completed, total }` for each of 10 steps, and `done` when finished.",
      "Emit `error` on failure, and make sure a consumer without an error listener is not the first thing that crashes.",
      "Consume `progress` with `for await (const [payload] of on(runner, \"progress\"))` and print `Progress: 1/10`.",
      "Create an `AbortController`, pass its signal to `on(...)`, and abort after three steps.",
      "Wrap the loop in `try/catch` and re-throw anything whose `name` is not `AbortError`.",
      "Add an async listener that awaits something, and confirm `emit()` returns before it finishes.",
    ],
    acceptance: [
      "Running it prints `Job started`, ten `Progress: n/10` lines, then `Job completed`.",
      "The `progress` events are consumed through `events.on` and `for await`, not a plain `on()` listener.",
      "Aborting after three steps stops the iteration and prints something like `Job stopped`, with no unhandled rejection.",
      "The catch around the loop distinguishes `AbortError` from a real failure and re-throws the latter.",
      "You can explain why the payload arrives as an array from `events.on`.",
      "A deliberate failure emits `error` and is handled, rather than terminating the process.",
      "An async listener demonstrably finishes after `emit()` has already returned, and you can say why.",
      "Every async listener has its own `try/catch`, and you can explain what happens without one.",
    ],
    stretch: [
      "Consume `start`, `progress`, `done` and `error` from one async function, and see how awkward four separate `for await` loops become.",
      "Replace the four events with one `event` name carrying a `type` field, and compare which version you would rather maintain.",
      "Add a second `progress` consumer and confirm the runner code does not change at all.",
      "Emit progress faster than the loop consumes it, then log the queue growth to see `events.on` buffering with no backpressure.",
      "Convert the runner to return a promise from `run()` while still emitting progress, and decide which parts deserve to be events.",
    ],
  },
};
