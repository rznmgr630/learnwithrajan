import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_14_LESSONS: LessonDay = {
  day: 14,
  title: "Debugging, linting and code quality",
  totalMinutes: 102,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "debugging-and-inspector",
      title: "Debugging and the inspector",
      durationMinutes: 12,
      explanation:
        "Writing code is half of backend development. The other half is answering:\n\n> <b>\"Why is this code slow, broken, leaking memory, or difficult to maintain?\"</b>\n\n```text\nDebugger      → find incorrect behavior\nProfiler      → find performance problems\nHeap snapshot → find memory leaks\nLinter        → find code-quality problems\nType checker  → find type errors\nFormatter     → keep code consistent\n```\n\nSix tools, six different questions. The professional rule for the whole day is that <b>each answers only its own question</b>, and reaching for the wrong one is most of what makes debugging feel hard.\n\n---\n\n## Debugging\n\n<b>Debugging</b> (the process of finding and fixing the cause of incorrect behaviour in software).\n\n> The word doing the work is <b>cause</b>. A `console.log` tells you a value was wrong; debugging is finding where it became wrong, which is usually several frames from where you noticed.\n\nYour API returns:\n\n```javascript\n{ \"total\": 0 }\n```\n\nwhen you expected:\n\n```javascript\n{ \"total\": 100 }\n```\n\nSo you investigate:\n\n```text\nRequest\n   ↓\nController\n   ↓\nService\n   ↓\nDatabase\n   ↓\nCalculation\n   ↓\nResponse\n```\n\nuntil you find where the behaviour became wrong.\n\n---\n\n## `node --inspect`\n\n<b>`--inspect`</b> (starts Node with the V8 inspector protocol enabled, so a debugger can attach to the running process).\n\n> The point is that it attaches to a <b>live</b> process. A `console.log` requires you to know in advance what to print; a debugger lets you decide once you are already there and can see everything in scope.\n\n```bash\nnode --inspect server.js\n```\n\n```text\nDebugger listening...\n```\n\n```text\nNode application\n       ↓\nInspector protocol\n       ↓\nDebugger\n```\n\nTwo variants worth knowing. `--inspect-brk` pauses on the first line, which is the only way to debug something that fails during startup. And `--inspect` binds to localhost by default, which is deliberate: <b>the inspector is remote code execution</b>, so never expose that port in production.\n\n---\n\n## What the inspector can do\n\n```text\nSet breakpoints\nInspect variables\nStep through code\nEvaluate expressions\nInspect call stacks\nProfile CPU\nInspect memory\n```\n\nMuch more than scattering `console.log(value)` everywhere.\n\nThe last two are the part people miss: the same protocol that gives you breakpoints also gives you CPU profiles and heap snapshots. It is <b>one tool for three of today's six questions</b>, which is why it is worth learning properly rather than reaching for print statements.\n\n---\n\n## Chrome DevTools\n\n```bash\nnode --inspect server.js\n```\n\nThen open the Node target from Chrome DevTools and you get:\n\n```text\nSources\nConsole\nMemory\nPerformance\nProfiler\n```\n\n> <b>Node's JavaScript runs on V8, and V8 provides the debugging and profiling.</b>\n\nWhich explains why the interface looks like browser debugging: it <b>is</b> browser debugging. Day 1's point that V8 is the engine, arriving with a practical consequence.\n\nIn practice most people use their editor rather than DevTools for breakpoints, and DevTools for the Memory and Profiler tabs, because those two have no good editor equivalent.\n\n---\n\n## When not to reach for the debugger\n\nHonestly: `console.log` is fine for a quick check, and a debugger is overkill for confirming a variable's value once.\n\nThe signal to switch is <b>the second or third log</b>. If you are adding prints to narrow down where a value changed, you are hand-rolling a step debugger badly. That is the moment a breakpoint saves you time rather than costing it.",
      diagram: `Six tools, six questions

    debugger        why is the behaviour WRONG
    profiler        why is it SLOW
    heap snapshot   why does memory GROW
    linter          is this code SUSPICIOUS
    type checker    do the TYPES line up
    formatter       does it LOOK consistent

    each answers only its own question, and reaching
    for the wrong one is most of what makes debugging
    feel hard.


console.log vs a debugger

    console.log     you must know IN ADVANCE what
                    to print

    debugger        you decide once you are already
                    there, with everything in scope

    the signal to switch: the SECOND or THIRD log.
    adding prints to narrow down where a value changed
    is hand-rolling a step debugger, badly.


One protocol, three of today's questions

    node --inspect
        │
        ├── Sources      breakpoints, stepping
        ├── Profiler     CPU profiles
        └── Memory       heap snapshots

    which is why it is worth learning properly.


Two variants, and one warning

    --inspect        attach whenever
    --inspect-brk    pause on the FIRST line
                       └─ the only way to debug a
                          startup failure

    ⚠ the inspector is REMOTE CODE EXECUTION.
      it binds to localhost by design.
      never expose that port in production.


Why DevTools looks like browser debugging

    it IS browser debugging. Node runs on V8, and V8
    provides the tooling.  (Day 1)

    in practice: editor for breakpoints,
                 DevTools for Memory and Profiler
                 (no good editor equivalent)`,
      codeExample: {
        title: "Attaching to a live process",
        code: `// ── The everyday form ───────────────────────────────────────
// $ node --inspect server.js
//
// Debugger listening on ws://127.0.0.1:9229/...
// For help, see: https://nodejs.org/en/docs/inspector
//
// Now attach from your editor, or open the Node target in
// Chrome DevTools.


// ── For a startup failure ───────────────────────────────────
// $ node --inspect-brk server.js
//
// Pauses on the first line and waits for a debugger. This is
// the only way to catch something that throws before you
// could possibly attach.


// ── The security note that matters ──────────────────────────
// $ node --inspect=0.0.0.0:9229 server.js      ✗ never
//
// The inspector can evaluate arbitrary expressions in your
// process. That is remote code execution with your
// credentials. It binds to 127.0.0.1 by default for exactly
// this reason.
//
// To debug something remote, forward the port over SSH:
//   ssh -L 9229:localhost:9229 user@host


// ── The code you would step through ─────────────────────────
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const order = {
  items: [
    { name: "book", price: 40 },
    { name: "pen", price: 60 },
    { name: "mug" },                 // ← no price. undefined.
  ],
};

console.log(calculateTotal(order.items));    // NaN
//
// A single console.log tells you the answer is NaN. It does
// not tell you which item is missing a price, or that the
// third one came from a different code path.
//
// A breakpoint inside the reduce shows you \`item\` on every
// iteration, which is the actual question.


// ── When console.log is genuinely fine ──────────────────────
console.log("total:", calculateTotal(order.items));
//
// One check, one value, and you are done. The debugger is
// overkill here.
//
// The moment you add a second and third log to narrow down
// where a value changed, switch. You are reimplementing
// step-through debugging by hand.`,
      },
      keyTakeaways: [
        "Six tools, six questions: debugger, profiler, heap snapshot, linter, type checker, formatter.",
        "<b>Each answers only its own question</b>, and reaching for the wrong one is most of what makes debugging hard.",
        "Debugging is about finding the <b>cause</b>, which is usually several frames from where you noticed.",
        "`--inspect` attaches a debugger to a <b>live</b> process.",
        "`console.log` needs you to know in advance what to print. A debugger lets you decide once you are there.",
        "<b>The signal to switch is the second or third log</b>: you are hand-rolling a step debugger badly.",
        "`--inspect-brk` pauses on the first line, the only way to debug a startup failure.",
        "<b>The inspector is remote code execution.</b> It binds to localhost by design. Never expose it.",
        "The same protocol gives you breakpoints, CPU profiles <b>and</b> heap snapshots: three of today's six questions.",
        "DevTools looks like browser debugging because it is. Node runs on V8, which provides the tooling (Day 1).",
        "In practice: your editor for breakpoints, DevTools for the Memory and Profiler tabs.",
      ],
      commonMistakes: [
        "<b>Adding a fifth `console.log` instead of a breakpoint</b> — you are narrowing down by hand what stepping does for free.",
        "<b>Exposing the inspector port</b> — `--inspect=0.0.0.0` is remote code execution with your process's permissions.",
        "<b>Using `--inspect` for a startup crash</b> — you cannot attach fast enough. Use `--inspect-brk`.",
        "<b>Leaving `--inspect` in a production start command</b> — it is a debugging flag, not a monitoring one.",
        "<b>Not knowing the inspector does profiling too</b> — you end up looking for a separate tool that already exists.",
      ],
      quiz: [
        {
          question: "When should you stop using `console.log` and attach a debugger?",
          options: [
            "Immediately, `console.log` is always wrong",
            "At the second or third log added to narrow down where a value changed",
            "Only in production",
            "Only for async code",
          ],
          correctIndex: 1,
          explanation:
            "One log to check one value is fine. Once you are adding prints to bisect where something went wrong, you are reimplementing step-through debugging by hand.",
        },
        {
          question: "Why does `--inspect` bind to localhost by default?",
          options: [
            "For performance",
            "The inspector can evaluate arbitrary expressions in your process, so exposing it is remote code execution",
            "To avoid port conflicts",
            "Because V8 requires it",
          ],
          correctIndex: 1,
          explanation:
            "Anyone who can reach that port can run code with your process's permissions. Forward it over SSH rather than binding it publicly.",
        },
        {
          question: "You need to debug something that throws during startup. Which flag?",
          options: ["`--inspect`", "`--inspect-brk`", "`--trace-warnings`", "`--cpu-prof`"],
          correctIndex: 1,
          explanation:
            "`--inspect` alone starts the process immediately, so it has already crashed by the time you attach. `--inspect-brk` pauses on the first line and waits.",
        },
      ],
    },
    {
      id: "breakpoints",
      title: "Breakpoints",
      durationMinutes: 10,
      explanation:
        "<b>Breakpoint</b> (a location where the debugger pauses program execution).\n\n> Pausing is only half of it. The value is that <b>everything in scope is still alive</b>, so you can inspect any variable, walk the call stack, and evaluate expressions you had not thought of before you started.\n\n```javascript\nfunction calculateTotal(items) {\n  const total = items.reduce(\n    (sum, item) => sum + item.price,\n    0\n  );\n\n  return total;\n}\n```\n\nA breakpoint inside the reduce:\n\n```text\nProgram\n   ↓\nBreakpoint\n   ↓\n⏸ paused\n```\n\nAnd you can inspect:\n\n```text\nitems\nsum\nitem\ntotal\n```\n\n---\n\n## VS Code breakpoints\n\nClick beside a line number:\n\n```text\n🔴 breakpoint\n```\n\nStart in debug mode and you get:\n\n```text\nVariables\nWatch\nCall Stack\nScopes\nBreakpoints\n```\n\nUsually the easiest workflow for everyday Node work.\n\nThe two features worth knowing beyond a plain breakpoint. A <b>conditional breakpoint</b> pauses only when an expression is true, which is what you want inside a loop over ten thousand items: `item.price === undefined` finds the one bad row without you pressing continue ten thousand times.\n\nAnd a <b>logpoint</b> prints an expression without pausing at all. That is a `console.log` you did not have to edit the file to add, and did not have to remember to remove.\n\n---\n\n## `debugger`\n\n<b>`debugger`</b> (a statement that pauses execution at that line when a debugger is attached).\n\n> With no debugger attached it does <b>nothing</b>, which is what makes it both convenient and dangerous. A forgotten `debugger` in committed code is invisible in every normal run and freezes the process the moment someone runs with `--inspect`.\n\n```javascript\nfunction calculate() {\n  const value = 100;\n\n  debugger;\n\n  return value * 2;\n}\n```\n\n```text\ndebugger\n   ↓\n\"Pause here.\"\n```\n\nUseful when you want to inspect one particular execution path, especially one that is hard to reach by clicking a line: inside a callback that only runs for certain input, or in generated code where the line numbers move.\n\nAnd because it is a committed line rather than editor state, it survives a file being rewritten by a formatter. That is occasionally exactly what you want, and it is why a linter rule banning it (`no-debugger`) is worth having, as the linting lesson covers.\n\n---\n\n## Stepping\n\nOnce paused, the four controls:\n\n```text\nContinue     run until the next breakpoint\nStep over    run this line, stay in this function\nStep into    go into the function on this line\nStep out     finish this function, return to the caller\n```\n\nThe habit worth building: <b>step over by default, step into deliberately</b>. Stepping into everything walks you through library internals you did not want to read, which is how debugging sessions become long and unproductive.",
      diagram: `A breakpoint keeps the scope alive

    paused at a line
        ↓
    every variable in scope still exists
        ↓
    inspect anything, walk the call stack,
    evaluate expressions you had not thought of

    that is the difference from a log, which only
    shows what you decided to print beforehand.


Two features worth more than a plain breakpoint

    CONDITIONAL BREAKPOINT
      pauses only when an expression is true

      a loop over 10,000 items:
        item.price === undefined
          └─ finds the one bad row without pressing
             continue ten thousand times

    LOGPOINT
      prints an expression WITHOUT pausing

      a console.log you did not edit the file to add,
      and do not have to remember to remove


The debugger statement does NOTHING unattached

    no debugger attached   →  a no-op
    --inspect attached     →  freezes there

    which makes a forgotten one invisible in every
    normal run, and a hang the moment someone
    debugs.

    that is why no-debugger is a linter rule worth
    having.

    but it survives a formatter rewriting the file,
    and it reaches places clicking a line cannot:
      a callback that only runs for certain input
      generated code where line numbers move


Step over by default, step into deliberately

    Continue     run to the next breakpoint
    Step over    run this line, stay here
    Step into    descend into the call
    Step out     finish up, back to the caller

    stepping into everything walks you through
    library internals you did not want to read,
    which is how a session becomes long and
    unproductive.`,
      codeExample: {
        title: "Where to put the breakpoint",
        code: `// ── The bug ─────────────────────────────────────────────────
function calculateTotal(items) {
  return items.reduce((sum, item) => {
    // ← a plain breakpoint here pauses on EVERY item
    return sum + item.price;
  }, 0);
}

const manyItems = Array.from({ length: 10_000 }, (_, i) => ({
  name: \`item-\${i}\`,
  price: i === 7_412 ? undefined : 10,     // one bad row
}));

console.log(calculateTotal(manyItems));    // NaN


// ── A plain breakpoint is the wrong tool here ───────────────
// You would press continue 7,412 times to reach the problem.


// ── A conditional breakpoint is the right one ───────────────
// In VS Code: right-click the gutter → Conditional Breakpoint
//   condition:  item.price === undefined
//
// It pauses once, on item-7412, with \`item\`, \`sum\` and the
// whole call stack live. That is the actual question answered
// in one stop.


// ── A logpoint, when you do not want to pause at all ────────
// Right-click the gutter → Logpoint
//   message:  {item.name} = {item.price}
//
// Prints for every iteration without stopping, and without
// editing the file. Nothing to remember to remove.


// ── The debugger statement, and its trap ────────────────────
function handleWebhook(payload) {
  if (payload.type === "refund.failed") {
    debugger;                        // only this rare path
  }
  return process(payload);
}
//
// Useful: reaching a branch that only runs for certain input
// is awkward with a clicked breakpoint.
//
// ⚠ With no debugger attached this is a NO-OP, so it passes
//   every test and every normal run. Then someone starts the
//   process with --inspect and it freezes on a refund.
//
//   Which is why the linting lesson turns on no-debugger.


// ── The stepping habit ──────────────────────────────────────
// ✗ step INTO everything
//     you end up inside express, then inside its router,
//     then inside a promise polyfill, reading code you did
//     not want to read
//
// ✓ step OVER by default
//     step into only when you suspect THAT call
//
// And "step out" is the escape hatch when you stepped into
// something by accident.

function process(payload) {
  return { handled: payload.type };
}`,
      },
      keyTakeaways: [
        "A <b>breakpoint</b> pauses execution, and the value is that <b>everything in scope is still alive</b>.",
        "You can inspect any variable and evaluate expressions you had not thought of beforehand.",
        "That is the difference from a log, which shows only what you decided to print in advance.",
        "A <b>conditional breakpoint</b> pauses only when an expression is true.",
        "In a loop over ten thousand items, `item.price === undefined` finds the one bad row in a single stop.",
        "A <b>logpoint</b> prints without pausing: a `console.log` you never edited the file to add or remove.",
        "<b>`debugger` does nothing when no debugger is attached.</b>",
        "So a forgotten one is invisible in every normal run and freezes the process the moment someone uses `--inspect`.",
        "Which is why `no-debugger` is a linter rule worth having.",
        "It still reaches places a clicked breakpoint cannot: a rare callback branch, or generated code.",
        "<b>Step over by default, step into deliberately.</b> Stepping into everything walks you through library internals.",
      ],
      commonMistakes: [
        "<b>A plain breakpoint inside a large loop</b> — you press continue thousands of times. Use a condition.",
        "<b>Editing the file to add a `console.log` inside a loop</b> — a logpoint does it without touching the code.",
        "<b>Committing a `debugger` statement</b> — a no-op in every normal run, and a hang under `--inspect`.",
        "<b>Stepping into every call</b> — you end up reading framework internals instead of your own bug.",
        "<b>Setting a breakpoint on the line that reports the error</b> — the cause is usually several frames earlier.",
      ],
      quiz: [
        {
          question: "You need to inspect one bad row in a loop over ten thousand items. What do you use?",
          options: [
            "A plain breakpoint and press continue",
            "A conditional breakpoint with an expression that is true only for the bad row",
            "A `console.log` inside the loop",
            "`--inspect-brk`",
          ],
          correctIndex: 1,
          explanation:
            "A condition like `item.price === undefined` pauses once, on the row you care about, with the whole scope live. A plain breakpoint means pressing continue thousands of times.",
        },
        {
          question: "What does a committed `debugger` statement do in a normal production run?",
          options: [
            "Crashes the process",
            "Nothing at all, which is why a forgotten one is invisible until someone attaches a debugger",
            "Logs a warning",
            "Slows execution",
          ],
          correctIndex: 1,
          explanation:
            "It is a no-op unattached and a freeze once attached. That asymmetry is exactly why `no-debugger` is a worthwhile lint rule.",
        },
        {
          question: "What is the stepping habit worth building?",
          options: [
            "Step into everything to understand the flow",
            "Step over by default and step into deliberately, so you do not end up reading library internals",
            "Always use continue",
            "Step out first",
          ],
          correctIndex: 1,
          explanation:
            "Stepping into every call walks you through express, its router and a promise implementation before you reach your own code. That is how a session becomes long and unproductive.",
        },
      ],
    },
    {
      id: "stack-traces",
      title: "Stack traces and source maps",
      durationMinutes: 12,
      explanation:
        "<b>Stack trace</b> (the recorded chain of function calls that led to an error).\n\n> Read it as a route, not a verdict. The error type tells you <b>what</b> failed and the frames tell you <b>how execution got there</b>, and the second half is usually where the fix is.\n\n```text\nTypeError: Cannot read properties of undefined\n    at getUser (/app/src/user.js:42:18)\n    at getProfile (/app/src/profile.js:15:24)\n    at processRequest (/app/src/server.js:80:10)\n```\n\nTop down:\n\n```text\nError\n ↓\ngetUser\n ↓\ngetProfile\n ↓\nprocessRequest\n```\n\nThe first useful application frame is usually where to start.\n\nThat qualifier matters. The topmost frame is often inside `node_modules` or Node itself, and it is rarely the bug. <b>Scan down to the first path you recognise</b>, because that is the last place your own code made a decision.\n\n---\n\n## Anatomy\n\n```text\nat getUser (/app/src/user.js:42:18)\n```\n\nmeans:\n\n```text\ngetUser\n   ↓\n/app/src/user.js\n   ↓\nline 42\n   ↓\ncolumn 18\n```\n\nSo do not read only:\n\n```text\nTypeError\n```\n\nRead the whole thing. It tells you <b>what failed and how execution got there</b>.\n\nThe column is more useful than it looks. On a line like `user.profile.email`, column 18 distinguishes `user` being undefined from `user.profile` being undefined, which is two different bugs.\n\n---\n\n## `--stack-trace-limit`\n\n<b>`--stack-trace-limit`</b> (a V8 option setting how many frames a stack trace records).\n\n> <b>The default is 10.</b> So a trace that appears to end in the middle of nowhere has usually just been truncated, and the frame you needed was the eleventh.\n\n```bash\nnode --stack-trace-limit=50 server.js\n```\n\nMeasured: a 35-deep recursion reports 10 frames by default and all 35 with `=50`. The default is a performance trade-off, since capturing frames costs something on every error construction, so raise it while debugging rather than in production.\n\nAnd this is why <b>async stack traces used to be so bad</b>. Each `await` was a new call stack, so the trace stopped at the async boundary. Modern V8 stitches them together, which is one of the quieter improvements in recent Node.\n\n---\n\n## Source maps\n\n<b>Source map</b> (a mapping that connects generated JavaScript back to the original source).\n\n> Without one, a stack trace points at compiled output, so \"line 4,182 of `dist/bundle.js`\" is technically accurate and useless. The map is what turns it back into a file and line you can open.\n\n```text\nTypeScript\n   ↓\ncompiled JavaScript\n```\n\nThe runtime executes:\n\n```text\ndist/server.js\n```\n\nbut you want to see:\n\n```text\nsrc/server.ts\n```\n\nTwo practical notes, both connecting to Day 5. Node reads source maps by default now, so `\"sourceMap\": true` in `tsconfig.json` is usually all you need.\n\nAnd if you took Day 5's <b>no-build path</b>, you need none of this. Type stripping replaces annotations with whitespace, so line and column numbers are unchanged and the trace already points at your `.ts` file. That was one of the arguments for it, arriving with a concrete payoff.",
      diagram: `A stack trace is a route, not a verdict

    TypeError: Cannot read properties of undefined
        at getUser      (/app/src/user.js:42:18)
        at getProfile   (/app/src/profile.js:15:24)
        at processRequest (/app/src/server.js:80:10)

    the error type    WHAT failed
    the frames        HOW execution got there
                        └─ usually where the fix is


Scan down to the first path you recognise

    at Object.get     (node:internal/...)      ← not your bug
    at Router.handle  (/app/node_modules/...)  ← not your bug
    at getUser        (/app/src/user.js:42)    ← START HERE

    the topmost frame is often inside node_modules or
    Node itself. the first frame you recognise is the
    last place YOUR code made a decision.


The column is more useful than it looks

    user.profile.email
    │    │       │
    1    6      14

    column 6   →  user was undefined
    column 14  →  user.profile was undefined

    two different bugs.


The default stack-trace-limit is 10

    measured: a 35-deep recursion

      default              10 frames
      --stack-trace-limit=50   35 frames

    so a trace that seems to end nowhere has usually
    been TRUNCATED, and the frame you needed was the
    eleventh.

    it is a performance trade-off (capturing frames
    costs something per error), so raise it while
    debugging, not in production.

    and it is why async traces used to be so bad:
    each await was a new stack. modern V8 stitches
    them together.


Source maps, and when you need none

    no map:  "line 4,182 of dist/bundle.js"
               accurate. useless.

    with a map: src/server.ts:42

    tsconfig: "sourceMap": true
      (Node reads them by default now)

    Day 5's NO-BUILD path needs none of this:
      type stripping replaces annotations with
      WHITESPACE, so line and column are unchanged
      and the trace already points at your .ts

    one of the arguments for it, with a payoff.`,
      codeExample: {
        title: "Reading a trace, and the truncation nobody expects",
        code: `// ── The default limit is 10 frames ──────────────────────────
function deep(n) {
  if (n === 0) throw new Error("bottom");
  return deep(n - 1);
}

try {
  deep(30);
} catch (error) {
  console.log("frames:", error.stack.split("\\n").length - 1);
}
//
// $ node deep.mjs
//   frames: 10                      ← truncated
//
// $ node --stack-trace-limit=50 deep.mjs
//   frames: 35                      ← all of them
//
// A trace that appears to end in the middle of nowhere has
// usually just been cut off, and the frame you needed was
// the eleventh.


// ── Where to start reading ──────────────────────────────────
// TypeError: Cannot read properties of undefined (reading 'email')
//     at Object.get (node:internal/util/inspect:1234:5)     ← no
//     at Layer.handle (/app/node_modules/express/lib/...)   ← no
//     at getUser (/app/src/user.js:42:18)                   ← HERE
//     at getProfile (/app/src/profile.js:15:24)
//     at processRequest (/app/src/server.js:80:10)
//
// Scan down to the first path you recognise. That is the last
// place your own code made a decision.


// ── The column narrows it to one of two bugs ────────────────
const user = { profile: undefined };

try {
  console.log(user.profile.email);
} catch (error) {
  const [, , line] = error.stack.split("\\n");
  console.log("frame:", line?.trim());
}
//
// user.profile.email
// │    │       │
// col 1  col 6  col 14
//
// column 6  → \`user\` was undefined
// column 14 → \`user.profile\` was undefined
//
// Two different bugs, and the column is what tells them
// apart without opening the file.


// ── Raising the limit programmatically ──────────────────────
Error.stackTraceLimit = 50;
//
// Same effect as the flag, and it can be set conditionally:
//
// if (process.env.NODE_ENV !== "production") {
//   Error.stackTraceLimit = 50;
// }
//
// Capturing frames costs something on every error
// construction, which is why the default is 10.


// ── Source maps, and Day 5's shortcut ───────────────────────
// WITH a build step:
//   tsconfig.json  { "compilerOptions": { "sourceMap": true } }
//   → the trace says src/server.ts:42 instead of
//     dist/server.js:118
//
// WITHOUT one (Day 5's no-build path):
//   $ node src/server.ts
//   → the trace already says src/server.ts:42
//
//   Type stripping replaces annotations with whitespace, so
//   every line and column is unchanged. No map needed, which
//   was one of the arguments for that approach.`,
      },
      keyTakeaways: [
        "A stack trace is a <b>route, not a verdict</b>: the type says what failed, the frames say how you got there.",
        "<b>Scan down to the first path you recognise.</b> The topmost frame is often Node or `node_modules`.",
        "That first recognised frame is the last place your own code made a decision.",
        "Read the column too: on `user.profile.email` it distinguishes two different bugs.",
        "<b>The default `stack-trace-limit` is 10 frames.</b>",
        "Measured: a 35-deep recursion reports 10 by default and 35 with `--stack-trace-limit=50`.",
        "So a trace that seems to end nowhere has usually been truncated.",
        "It is a performance trade-off, since capturing frames costs something per error. Raise it while debugging.",
        "`Error.stackTraceLimit = 50` does the same thing, and can be set conditionally.",
        "It is also why <b>async traces used to be poor</b>: each `await` was a new stack. Modern V8 stitches them.",
        "A <b>source map</b> turns \"line 4,182 of `dist/bundle.js`\" back into a file you can open.",
        "Node reads them by default, so `\"sourceMap\": true` is usually enough.",
        "<b>Day 5's no-build path needs none of this</b>: stripping preserves line and column exactly.",
      ],
      commonMistakes: [
        "<b>Reading only the error type</b> — the frames are where the cause is.",
        "<b>Investigating the topmost frame</b> — it is often inside Node or a dependency and rarely the bug.",
        "<b>Ignoring the column number</b> — it tells you which link in a property chain was undefined.",
        "<b>Assuming a short trace means a shallow call</b> — the default cuts it off at ten frames.",
        "<b>Raising `stackTraceLimit` in production</b> — capturing frames has a cost on every error.",
        "<b>Debugging compiled output with no source map</b> — the line numbers are accurate and useless.",
        "<b>Adding source maps to a no-build TypeScript project</b> — stripping already preserves positions.",
      ],
      quiz: [
        {
          question: "A stack trace from a 35-deep recursion shows only 10 frames. Why?",
          options: [
            "V8 deduplicates repeated frames",
            "The default `stack-trace-limit` is 10, so the trace was truncated",
            "Recursion is collapsed automatically",
            "The frames were inlined",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `--stack-trace-limit=50` shows all 35. A trace that appears to end nowhere has usually just been cut off, and the frame you needed was the eleventh.",
        },
        {
          question: "Which frame should you usually start investigating?",
          options: [
            "The topmost one",
            "The first one whose file path you recognise as your own code",
            "The bottom one",
            "Whichever mentions the error type",
          ],
          correctIndex: 1,
          explanation:
            "The top is often inside Node or `node_modules`. The first frame you recognise is the last point where your own code made a decision.",
        },
        {
          question: "Why does Day 5's no-build TypeScript approach need no source maps?",
          options: [
            "Node disables stack traces for `.ts` files",
            "Type stripping replaces annotations with whitespace, so line and column numbers are unchanged",
            "TypeScript embeds positions in the annotations",
            "It does need them",
          ],
          correctIndex: 1,
          explanation:
            "The stripped file has exactly the same layout as your source, so the trace already points at the right line in your `.ts`. That was one of the arguments for the approach.",
        },
      ],
    },
    {
      id: "cpu-profiling",
      title: "CPU profiling and flame graphs",
      durationMinutes: 12,
      explanation:
        "Sometimes your application is not broken. It is just:\n\n```text\n🐌 slow\n```\n\n```text\nRequest\n ↓\nCPU-heavy function\n ↓\n5 seconds\n```\n\n<b>CPU profile</b> (a recording of where the CPU spends time during program execution).\n\n> It answers a question you cannot answer by reading code. Your intuition about which function is hot is wrong often enough that measuring is not a formality, it is the whole technique.\n\n```bash\nnode --cpu-prof server.js\n```\n\nThat writes a `.cpuprofile` file on exit, which you open in Chrome DevTools' Performance tab. There is also `--cpu-prof-dir` and `--cpu-prof-name` for controlling where it lands, which matters in a container.\n\n---\n\n## Why profiles matter\n\nSuppose your server spends:\n\n```text\n70% → calculateRecommendations()\n20% → JSON processing\n5%  → routing\n5%  → everything else\n```\n\nNow you know where to look. Without profiling you might optimise routing, which is 5%.\n\nThat is worth stating as arithmetic. Making routing <b>twice as fast</b> saves 2.5% of total time. Making the 70% function twice as fast saves 35%. The same effort, fourteen times the result, and the only way to know which is which is to measure.\n\n---\n\n## Flame graphs\n\n<b>Flame graph</b> (a visualisation showing where execution time is spent across the call stack).\n\n> Width is time, not depth. A deep, narrow tower is a long call chain doing very little; a wide, shallow block is where your time actually goes, and that is the only direction worth reading.\n\n```text\nApplication\n████████████████████████████\n      CPU work\n████████████████\n       parser\n██████\n database\n██\n```\n\nThe wider a section, the more CPU time that code consumed.\n\nTwo things to know when reading one. A <b>plateau</b>, one wide flat block near the top, means a single function is the cost and you have found it. A <b>staircase</b> of many narrow blocks means the cost is spread, and there is no single fix.\n\nAnd a CPU profile shows <b>CPU time, not wall-clock time</b>. A request that spends four seconds waiting on a database barely appears, because the CPU was idle. That is Day 3's distinction again: profiling finds <b>running</b>, and waiting needs different tooling.\n\n---\n\n## Do not guess\n\n```text\n\"This function looks slow.\"\n ↓\nrewrite it\n```\n\nversus:\n\n```text\nMeasure\n  ↓\nProfile\n  ↓\nFind bottleneck\n  ↓\nOptimize\n  ↓\nMeasure again\n```\n\n> <b>Measure before optimizing.</b>\n\nThe final step is the one people skip. An optimisation you did not measure afterwards is a change you <b>believe</b> helped, and often it moved the cost somewhere else or made no difference at all. Half of performance work is discovering that your fix did nothing.\n\nOne honest caveat about `--cpu-prof`: it profiles the whole process lifetime, which is fine for a script and awkward for a long-running server. For a server you usually want to start and stop profiling around a workload, which is what the inspector's Profiler tab is for, or `node:inspector` programmatically.",
      diagram: `The arithmetic that makes profiling non-optional

    70%  calculateRecommendations()
    20%  JSON processing
     5%  routing
     5%  everything else

    optimise routing, twice as fast     → saves 2.5%
    optimise the 70%, twice as fast     → saves 35%

    same effort. FOURTEEN TIMES the result.

    and the only way to know which is which is
    to measure.


Flame graph: width is time, not depth

    ████████████████████████████  application
    ████████████████              CPU work
    ██████                        parser
    ██                            database

    a DEEP NARROW tower    a long call chain doing
                           very little
    a WIDE SHALLOW block   where your time actually
                           goes  ← the only direction
                                   worth reading


    PLATEAU     one wide flat block near the top
                  └─ a single function is the cost.
                     you have found it.

    STAIRCASE   many narrow blocks
                  └─ the cost is spread. no single fix.


A CPU profile shows CPU time, not WALL-CLOCK time

    a request spending 4 seconds waiting on a database
    barely appears
        └─ the CPU was idle

    Day 3's distinction again:
      profiling finds RUNNING
      WAITING needs different tooling


The step everyone skips

    measure → profile → find → optimise → MEASURE AGAIN
                                            └────┬────┘
                                          this one

    an optimisation you did not measure afterwards is
    a change you BELIEVE helped.

    often it moved the cost elsewhere, or did nothing.
    half of performance work is discovering your fix
    did nothing.


--cpu-prof profiles the WHOLE process lifetime

    fine for a script
    awkward for a long-running server

    for a server: start and stop around a workload
      → the inspector's Profiler tab
      → or node:inspector programmatically`,
      codeExample: {
        title: "Profiling, and measuring the fix",
        code: `// ── A function that looks fine and is not ───────────────────
function findDuplicates(items) {
  const dupes = [];
  for (const a of items) {
    for (const b of items) {                 // O(n²)
      if (a !== b && a.id === b.id) dupes.push(a);
    }
  }
  return dupes;
}

function formatLabel(item) {
  return \`\${item.name} (\${item.id})\`;       // trivial
}


// ── Guessing, versus measuring ──────────────────────────────
const items = Array.from({ length: 3000 }, (_, i) => ({
  id: i % 2900,
  name: \`item-\${i}\`,
}));

let start = performance.now();
findDuplicates(items);
const dupeMs = performance.now() - start;

start = performance.now();
for (const item of items) formatLabel(item);
const labelMs = performance.now() - start;

console.log(\`findDuplicates: \${Math.round(dupeMs)}ms\`);
console.log(\`formatLabel:    \${Math.round(labelMs)}ms\`);
// findDuplicates: 340ms
// formatLabel:    1ms
//
// Optimising formatLabel to zero saves 1ms. Optimising
// findDuplicates saves 340. The arithmetic is the argument.


// ── A real CPU profile ──────────────────────────────────────
// $ node --cpu-prof server.js
//   ... writes CPU.20260904.001122.12345.0.001.cpuprofile
//
// $ node --cpu-prof --cpu-prof-dir=./profiles server.js
//   useful in a container, where the working directory
//   may not be writable
//
// Open the .cpuprofile in Chrome DevTools → Performance.


// ── For a long-running server, profile a window ─────────────
import inspector from "node:inspector";
import { writeFile } from "node:fs/promises";

async function profileFor(ms, work) {
  const session = new inspector.Session();
  session.connect();

  const post = (method) =>
    new Promise((resolve, reject) =>
      session.post(method, (err, result) => (err ? reject(err) : resolve(result))),
    );

  await post("Profiler.enable");
  await post("Profiler.start");

  await work();
  await new Promise((r) => setTimeout(r, ms));

  const { profile } = await post("Profiler.stop");
  session.disconnect();

  await writeFile("window.cpuprofile", JSON.stringify(profile));
  return "window.cpuprofile";
}

console.log("would write:", await profileFor(50, async () => {
  findDuplicates(items.slice(0, 500));
}));
//
// --cpu-prof covers the whole process lifetime, which buries
// a slow endpoint in hours of idle time. This profiles a
// window instead.


// ── The fix, and the step people skip ───────────────────────
function findDuplicatesFast(items) {
  const seen = new Map();
  const dupes = [];
  for (const item of items) {
    if (seen.has(item.id)) dupes.push(item);
    else seen.set(item.id, item);
  }
  return dupes;
}

start = performance.now();
findDuplicatesFast(items);
console.log(\`after:          \${Math.round(performance.now() - start)}ms\`);
// after:          1ms
//
// MEASURE AGAIN. Without this you have a change you believe
// helped. Half of performance work is finding out your fix
// did nothing, or moved the cost somewhere else.


// ── And what a CPU profile will not show you ────────────────
// async function slowEndpoint() {
//   await db.query("SELECT pg_sleep(4)");     // 4 seconds
// }
//
// Barely appears in a CPU profile: the CPU was idle the
// whole time. Day 3 again — profiling finds running, not
// waiting.`,
      },
      keyTakeaways: [
        "A <b>CPU profile</b> answers a question you cannot answer by reading code.",
        "Your intuition about which function is hot is wrong often enough that measuring is the whole technique.",
        "`node --cpu-prof` writes a `.cpuprofile` on exit, opened in Chrome DevTools' Performance tab.",
        "The arithmetic: doubling the speed of a 5% function saves 2.5%. Doubling a 70% one saves 35%.",
        "Same effort, fourteen times the result, and only measurement tells you which is which.",
        "In a <b>flame graph, width is time, not depth</b>. A deep narrow tower is a long chain doing little.",
        "A <b>plateau</b> means one function is the cost. A <b>staircase</b> means it is spread with no single fix.",
        "A CPU profile shows <b>CPU time, not wall-clock time</b>.",
        "So a request waiting four seconds on a database barely appears. Day 3's running-versus-waiting split.",
        "<b>Measure before optimizing</b>, and measure again afterwards.",
        "The second measurement is the step people skip, and half of performance work is finding your fix did nothing.",
        "`--cpu-prof` covers the whole process lifetime. For a server, profile a window with `node:inspector`.",
      ],
      commonMistakes: [
        "<b>Optimising the function that looks slow</b> — it is usually not the one the profile blames.",
        "<b>Skipping the second measurement</b> — you end up believing in a fix that did nothing.",
        "<b>Reading a flame graph by depth</b> — width is time. A tall narrow stack is cheap.",
        "<b>Expecting a CPU profile to explain a slow database query</b> — the CPU was idle. That needs other tooling.",
        "<b>`--cpu-prof` on a long-running server</b> — your slow endpoint is buried in hours of idle time.",
        "<b>Profiling in development and assuming production matches</b> — different data volumes move the bottleneck.",
      ],
      quiz: [
        {
          question: "Your profile says routing is 5% and one function is 70%. You double the speed of routing. How much total time do you save?",
          options: ["5%", "2.5%", "35%", "70%"],
          correctIndex: 1,
          explanation:
            "Halving 5% saves 2.5%. Halving the 70% function saves 35%, for the same effort. That arithmetic is why measuring first is not a formality.",
        },
        {
          question: "In a flame graph, what does width represent?",
          options: [
            "Call depth",
            "Time spent, which is why a wide shallow block matters more than a deep narrow tower",
            "Memory used",
            "Number of calls",
          ],
          correctIndex: 1,
          explanation:
            "A deep narrow stack is a long call chain doing very little. A plateau near the top means one function is the cost and you have found it.",
        },
        {
          question: "An endpoint takes four seconds waiting on a database. What does a CPU profile show?",
          options: [
            "Four seconds in the query function",
            "Almost nothing, because the CPU was idle during the wait",
            "Four seconds spread across the stack",
            "A flat plateau",
          ],
          correctIndex: 1,
          explanation:
            "A CPU profile measures CPU time. Day 3's distinction: profiling finds running, and waiting needs different tooling entirely.",
        },
      ],
    },
    {
      id: "memory-leaks",
      title: "Memory leaks and garbage collection",
      durationMinutes: 10,
      explanation:
        "<b>Memory leak</b> (memory your application keeps retaining even though it is no longer logically needed).\n\n> Note what the definition does not say: allocating a lot of memory is not a leak. A leak is memory that <b>cannot be reclaimed</b> because something still points at it, which is a completely different problem with a completely different fix.\n\n```javascript\nconst users = [];\n\nsetInterval(() => {\n  users.push({\n    createdAt: Date.now()\n  });\n}, 1000);\n```\n\nThe array keeps growing:\n\n```text\n1 object\n ↓\n100 objects\n ↓\n1,000 objects\n ↓\n100,000 objects\n ↓\n💥 memory pressure\n```\n\n---\n\n## What a leak looks like\n\nNormally:\n\n```text\nMemory\n  ↑\n  │     ╭──╮\n  │    ╭╯  ╰╮\n  │  ╭─╯    ╰─╮\n  └────────────────→ time\n```\n\nMemory rises and falls as garbage collection runs.\n\nA leak looks more like:\n\n```text\nMemory\n  ↑\n  │        ╱\n  │      ╱\n  │    ╱\n  │  ╱\n  │╱\n  └────────────────→ time\n```\n\nIt trends upward because objects stay reachable.\n\nThe distinction to internalise: <b>a sawtooth is healthy at any height</b>. Memory going up and coming back down means collection is working. Memory going up and never coming back down is the signal, and the absolute number is almost irrelevant.\n\nWhich also means a single reading tells you nothing, exactly as in Day 4. You need the shape over time.\n\n---\n\n## Garbage collection\n\n<b>Garbage collection</b> (the process of automatically reclaiming memory that JavaScript objects are no longer using).\n\n> The rule it follows is <b>reachability</b>, not usefulness. The collector cannot tell that you have finished with an object, only whether anything can still reach it, and that gap is where every leak lives.\n\n```text\nNo references\n     ↓\nGarbage collector\n     ↓\nMemory can be reclaimed\n```\n\nBut:\n\n```text\nGlobal array\n     ↓\nObject\n```\n\nand the collector cannot touch it.\n\nSo the useful question is never \"why is memory high\". It is:\n\n> <b>What still points at this?</b>\n\nAnd Day 7 adds a wrinkle: <b>Buffer memory lives outside the heap</b>. A leak of Buffers barely moves `heapUsed` and moves `rss` a great deal, so watching the wrong metric hides it entirely.\n\n---\n\n## Rising memory is not automatically a leak\n\nWorth saying plainly, because it causes a lot of wasted investigation.\n\nV8 does not collect eagerly. It collects when it decides to, so memory climbing for a while and then dropping is <b>normal</b>. A process given a large heap limit will happily use a lot of it before bothering to collect.\n\nSo before reaching for heap snapshots, run the workload longer and watch whether memory ever comes back down. A leak never does. That single observation saves most of the investigations that turn out to be nothing.",
      diagram: `A leak is not "using a lot of memory"

    allocating a lot        not a leak
    memory that CANNOT      a leak
    be reclaimed

    completely different problems, completely
    different fixes.


A sawtooth is healthy AT ANY HEIGHT

    healthy                      leaking
      ↑     ╭──╮                   ↑        ╱
      │    ╭╯  ╰╮                  │      ╱
      │  ╭─╯    ╰─╮                │    ╱
      └──────────────→ time        └──────────→ time

    up and back DOWN     collection is working
    up and never down    the signal

    the absolute number is almost irrelevant.
    and a single reading tells you nothing. (Day 4)


The collector follows REACHABILITY, not usefulness

    it cannot tell you have finished with an object.
    only whether anything can still reach it.

    that gap is where every leak lives.

    so the question is never "why is memory high"
    it is:  WHAT STILL POINTS AT THIS?


Day 7's wrinkle

    Buffer memory lives OUTSIDE the heap

    a Buffer leak
      heapUsed   barely moves
      rss        moves a great deal

    watching the wrong metric hides it entirely.


Before you reach for heap snapshots

    V8 does not collect eagerly. it collects when it
    decides to.

    memory climbing then dropping is NORMAL.
    a process with a large heap limit will happily
    use a lot of it first.

    so: run the workload LONGER and watch whether
    memory ever comes back down.

    a leak never does. that one observation saves
    most of the investigations that turn out to be
    nothing.`,
      codeExample: {
        title: "Telling a leak from ordinary allocation",
        code: `const mb = (bytes) => Math.round(bytes / 1024 / 1024);

// ── A real leak: something still points at it ───────────────
const leaked = [];

function leakyHandler() {
  leaked.push({ at: Date.now(), payload: Buffer.alloc(1024 * 512) });
}

// ── Not a leak: allocated and released ──────────────────────
function honestHandler() {
  const temp = { at: Date.now(), payload: Buffer.alloc(1024 * 512) };
  return temp.payload.length;                // nothing retains it
}


// ── The shape is the signal, not the number ─────────────────
function sample(label, handler, rounds = 5) {
  const readings = [];
  for (let r = 0; r < rounds; r += 1) {
    for (let i = 0; i < 40; i += 1) handler();
    globalThis.gc?.();                       // node --expose-gc
    const { heapUsed, rss } = process.memoryUsage();
    readings.push({ heap: mb(heapUsed), rss: mb(rss) });
  }
  console.log(label, readings.map((x) => x.rss).join(" → "), "MB rss");
}

sample("honest:", honestHandler);
// honest: 48 → 49 → 48 → 49 → 48 MB rss        flat. fine.

sample("leaky: ", leakyHandler);
// leaky:  68 → 88 → 108 → 128 → 148 MB rss     never returns.
//
// Up and back down is healthy at any height. Up and never
// down is the signal, and the absolute number barely matters.


// ── Day 7's wrinkle: watch the right metric ─────────────────
const before = process.memoryUsage();
const buffers = [];
for (let i = 0; i < 100; i += 1) buffers.push(Buffer.alloc(1024 * 1024));
const after = process.memoryUsage();

console.log("heapUsed delta:", mb(after.heapUsed - before.heapUsed), "MB");
console.log("rss delta:     ", mb(after.rss - before.rss), "MB");
// heapUsed delta: 1 MB
// rss delta:      100 MB
//
// A 100MB Buffer leak is nearly invisible in heapUsed. If
// your dashboard graphs the heap, you will not see it.


// ── The reachability rule, in one example ───────────────────
let cache = { data: Buffer.alloc(1024 * 1024) };

cache = null;
//   nothing points at that object now → collectable

const registry = new Map();
registry.set("key", { data: Buffer.alloc(1024 * 1024) });
//   the Map points at it → NOT collectable, however done
//   with it you are
//
// The collector cannot tell you have finished. It can only
// tell whether anything can still reach it. That gap is
// where every leak lives.


// ── Before investigating, rule out normal behaviour ─────────
// V8 collects when it decides to, not when you finish with
// something. Memory rising for a minute and then dropping is
// normal, especially with a large --max-old-space-size.
//
// Run the workload longer and watch for a return to baseline.
// A leak never returns. Most "leaks" are this.

console.log("registry still holds:", registry.size, "entry");`,
      },
      keyTakeaways: [
        "A <b>leak is memory that cannot be reclaimed</b>, not memory that is merely large.",
        "Those are different problems with different fixes, and conflating them wastes investigation.",
        "<b>A sawtooth is healthy at any height.</b> Up and back down means collection is working.",
        "Up and never down is the signal, and the absolute number is almost irrelevant.",
        "A single reading tells you nothing, exactly as in Day 4. You need the shape over time.",
        "Garbage collection follows <b>reachability, not usefulness</b>.",
        "The collector cannot tell you have finished with an object, only whether anything can reach it.",
        "That gap is where every leak lives, so the question is <b>\"what still points at this?\"</b>",
        "Day 7's wrinkle: <b>Buffer memory is off-heap</b>, so a Buffer leak barely moves `heapUsed`.",
        "Watch `rss` too, or a 100MB Buffer leak is invisible on a heap graph.",
        "<b>Rising memory is not automatically a leak.</b> V8 collects when it decides to.",
        "Run the workload longer and watch for a return to baseline. A leak never returns.",
      ],
      commonMistakes: [
        "<b>Calling any memory growth a leak</b> — V8 collects lazily, so a climb followed by a drop is normal.",
        "<b>Judging from a single reading</b> — you need the trend, as in Day 4.",
        "<b>Watching only `heapUsed`</b> — a Buffer leak is off-heap and nearly invisible there.",
        "<b>Asking \"why is memory high\"</b> — the useful question is what still holds a reference.",
        "<b>Assuming the collector knows you are done</b> — it only knows what is reachable.",
        "<b>Investigating before ruling out lazy collection</b> — most suspected leaks are this.",
      ],
      quiz: [
        {
          question: "Memory climbs steadily for a minute and then drops back to baseline. Is that a leak?",
          options: [
            "Yes, any climb is a leak",
            "No. V8 collects when it decides to, so a climb followed by a return to baseline is normal",
            "Only if it exceeds 50% of the heap",
            "Only in production",
          ],
          correctIndex: 1,
          explanation:
            "The sawtooth is the healthy shape at any height. A leak never comes back down, and checking for that first saves most of the investigations that turn out to be nothing.",
        },
        {
          question: "What rule does the garbage collector actually follow?",
          options: [
            "Whether an object is still useful",
            "Whether anything can still reach the object",
            "How old the object is",
            "How much memory it uses",
          ],
          correctIndex: 1,
          explanation:
            "It cannot tell that you have finished with something. The gap between \"no longer needed\" and \"no longer reachable\" is where every leak lives, which is why the useful question is what still points at it.",
        },
        {
          question: "You leak 100MB of Buffers. What happens to `heapUsed`?",
          options: [
            "It rises by about 100MB",
            "It barely moves, because Buffer memory is allocated outside the V8 heap",
            "It doubles",
            "It drops",
          ],
          correctIndex: 1,
          explanation:
            "Day 7's point with a practical consequence: a dashboard graphing only the heap will not show a Buffer leak at all. Watch `rss` as well.",
        },
      ],
    },
    {
      id: "heap-snapshots",
      title: "Heap snapshots and leak patterns",
      durationMinutes: 14,
      explanation:
        "<b>Heap snapshot</b> (a snapshot of the objects currently stored in the JavaScript heap).\n\n> One snapshot is nearly useless. The technique is <b>comparing two or three</b>, because a leak is defined by growth over time and a single snapshot has no time in it.\n\nYou capture them with Node's debugging tools, then compare:\n\n```text\nSnapshot 1\n    ↓\nrun workload\n    ↓\nSnapshot 2\n```\n\nIf objects that should have disappeared accumulate:\n\n```text\nSnapshot 1 → 10,000 objects\nSnapshot 2 → 20,000 objects\nSnapshot 3 → 30,000 objects\n```\n\nyou may have found a leak.\n\n---\n\n## Getting a snapshot without a debugger\n\nWorth knowing, because the usual instructions assume you can attach DevTools to the process, and in production you often cannot.\n\n```bash\nnode --heapsnapshot-signal=SIGUSR2 server.js\n```\n\nNow `kill -USR2 <pid>` writes a `.heapsnapshot` file to disk. Verified: a signal to a trivial process wrote a 4.6MB `Heap.20260904.003417.21428.0.001.heapsnapshot`.\n\nThat is the production-friendly path. You take one, wait, take another, copy both out of the container, and compare them locally in Chrome DevTools' Memory tab. No inspector port exposed, which the first lesson explained you should never do.\n\nThere is also `--heapsnapshot-near-heap-limit`, which captures automatically just before an out-of-memory crash. That is the one you want configured <b>before</b> the incident, because after the crash there is nothing to snapshot.\n\n---\n\n## What to look for\n\n```text\nLarge arrays\nLarge Maps/Sets\nClosures\nEvent listeners\nCaches\nGlobal objects\nBuffers\nObjects retained by unexpected references\n```\n\nThe key question is:\n\n> <b>Why is this object still reachable?</b>\n\nrather than:\n\n> \"Why is memory high?\"\n\nThe view that answers it is <b>Retainers</b>, and it is the only part of a heap snapshot that reliably finds a leak. It shows the chain of references keeping an object alive, read from the object back to a root. Sorting by size tells you what is big; retainers tell you <b>why it is still there</b>, which is the thing you can actually act on.\n\nAnd sort by <b>Comparison</b> between two snapshots rather than by total size. The biggest thing in your heap is often supposed to be big. The thing that <b>grew</b> between snapshots is the suspect.\n\n---\n\n## Common Node leak patterns\n\n### Global arrays\n\n```javascript\nconst cache = [];\n\nfunction add(item) {\n  cache.push(item);\n}\n```\n\nNothing removes entries, so `cache → ∞`.\n\n### Unbounded cache\n\n```javascript\nconst cache = new Map();\n```\n\nAdd continuously with no eviction and memory grows. A cache without an eviction policy is not a cache, it is a leak with a helpful name.\n\n### Event listeners\n\n```javascript\nemitter.on(\"data\", handler);\n```\n\nrepeatedly, without removing, retains objects longer than expected. Day 9's listener leak, seen from the memory side: `MaxListenersExceededWarning` and rising memory are <b>the same bug reported by two different systems</b>.\n\n### Timers\n\n```javascript\nsetInterval(() => {\n  useLargeObject();\n}, 1000);\n```\n\nA timer that never stops keeps its closure, and everything the closure captures, reachable forever. Day 4's `.unref()` exists partly for this.\n\n---\n\n## The pattern behind all four\n\nThey are one thing: <b>a long-lived container holding short-lived data</b>. A module-level array, a `Map` with no eviction, an emitter that outlives its listeners, an interval that outlives its purpose.\n\nWhich gives you a much faster way to find leaks than snapshots: look at everything module-level that can grow. In most codebases that is a short list, and the leak is on it.\n\nAnd it tells you what the fix looks like. Not \"free the memory\", which you cannot do in JavaScript, but <b>remove the reference</b>: bound the array, evict from the cache, `off()` the listener, `clearInterval` the timer.",
      diagram: `One snapshot is nearly useless

    a leak is defined by GROWTH OVER TIME
    a single snapshot has no time in it

    take two or three, and compare.


Getting one in production, without a debugger

    node --heapsnapshot-signal=SIGUSR2 server.js

    kill -USR2 <pid>
        ↓
    Heap.20260904.003417.21428.0.001.heapsnapshot
    (4.6 MB, verified)

    take one, wait, take another, copy both out of
    the container, compare locally in DevTools.

    no inspector port exposed  ← which lesson 1 said
                                  never to do

    and --heapsnapshot-near-heap-limit captures just
    before an OOM crash.
      configure it BEFORE the incident. afterwards
      there is nothing left to snapshot.


The only view that reliably finds a leak

    sort by SIZE        tells you what is BIG
                          └─ often supposed to be big

    sort by COMPARISON  tells you what GREW between
                          two snapshots  ← the suspect

    RETAINERS           tells you WHY it is still
                        there
                          └─ the chain of references
                             back to a root.
                             the thing you can act on.


Four patterns, one shape

    global array        cache.push(item), nothing removes
    unbounded Map       no eviction policy
    event listeners     on() without off()      (Day 9)
    timers              setInterval never cleared (Day 4)

    all of them:  a LONG-LIVED CONTAINER holding
                  SHORT-LIVED DATA


    which gives you a faster method than snapshots:

      look at everything module-level that can grow.
      in most codebases that is a short list, and the
      leak is on it.


    and it tells you the fix. not "free the memory",
    which you cannot do, but REMOVE THE REFERENCE:

      bound the array
      evict from the cache
      off() the listener
      clearInterval the timer


Day 9 and Day 14 are the same bug

    MaxListenersExceededWarning
    rising memory

    two systems reporting one problem.`,
      codeExample: {
        title: "The four patterns, and the fix for each",
        code: `import { EventEmitter } from "node:events";

const mb = (b) => Math.round(b / 1024 / 1024);

// ══ 1. A global array with no bound ════════════════════════
const auditLog = [];

function recordLeaky(event) {
  auditLog.push({ ...event, at: Date.now() });      // ✗ forever
}

function recordBounded(event) {
  auditLog.push({ ...event, at: Date.now() });
  if (auditLog.length > 1000) auditLog.shift();     // ✓ bounded
}


// ══ 2. A cache with no eviction ════════════════════════════
const badCache = new Map();

function cacheLeaky(key, value) {
  badCache.set(key, value);                          // ✗ grows
}

// ✓ an LRU-ish bound
const goodCache = new Map();
const MAX = 500;

function cacheBounded(key, value) {
  if (goodCache.size >= MAX) {
    goodCache.delete(goodCache.keys().next().value); // oldest out
  }
  goodCache.set(key, value);
}
//
// A cache without an eviction policy is not a cache. It is a
// leak with a helpful name.


// ══ 3. Listeners: Day 9's bug, from the memory side ════════
const bus = new EventEmitter();

function handleRequestLeaky(res) {
  bus.on("shutdown", () => res.end());               // ✗ per request
}

function handleRequestClean(res) {
  const onShutdown = () => res.end();
  bus.on("shutdown", onShutdown);
  return () => bus.off("shutdown", onShutdown);      // ✓ removable
}

for (let i = 0; i < 12; i += 1) handleRequestLeaky({ end() {} });
console.log("shutdown listeners:", bus.listenerCount("shutdown"));
// 12, and climbing
//
// MaxListenersExceededWarning and rising memory are the same
// bug reported by two different systems.


// ══ 4. A timer holding its closure ═════════════════════════
function startPollingLeaky() {
  const bigData = Buffer.alloc(50 * 1024 * 1024);    // 50MB
  setInterval(() => {
    void bigData.length;                             // captured
  }, 1000);
  // ✗ the interval never stops, so bigData is reachable
  //   forever, and so is everything else in this closure
}

function startPollingClean() {
  const bigData = Buffer.alloc(50 * 1024 * 1024);
  const timer = setInterval(() => void bigData.length, 1000);
  timer.unref();                                      // Day 4
  return () => clearInterval(timer);                  // ✓ stoppable
}

const stopPolling = startPollingClean();
stopPolling();
console.log("timer cleared, closure now collectable");


// ══ Taking snapshots in production ═════════════════════════
// $ node --heapsnapshot-signal=SIGUSR2 server.js
//
// $ kill -USR2 $(pgrep -f server.js)
//   → Heap.20260904.003417.21428.0.001.heapsnapshot  (4.6MB)
//
// $ # run the workload, then take another
// $ kill -USR2 $(pgrep -f server.js)
//
// Copy both out, open Chrome DevTools → Memory → Load, then
// switch the view to "Comparison". Sort by delta, not size:
// the biggest object is often supposed to be big; the one
// that GREW is the suspect.
//
// Then open Retainers on it. That chain of references back
// to a root is the only part of a snapshot that reliably
// tells you WHY something is still alive.
//
// And configure this before you need it:
//   node --heapsnapshot-near-heap-limit=2 server.js
//     → captures just before an OOM crash


// ══ The faster method ══════════════════════════════════════
// Before any of that: grep for module-level things that can
// grow.
//
//   const cache = new Map()
//   const queue = []
//   emitter.on(...)  inside a function
//   setInterval(...) with no clear
//
// In most codebases that is a short list, and the leak is
// on it.

console.log("audit entries:", auditLog.length, "| rss:", mb(process.memoryUsage().rss), "MB");`,
      },
      keyTakeaways: [
        "<b>One snapshot is nearly useless.</b> A leak is growth over time, and one snapshot has no time in it.",
        "`--heapsnapshot-signal=SIGUSR2` lets `kill -USR2` write a snapshot to disk.",
        "Verified: it produced a 4.6MB `.heapsnapshot` file. That is the production path, with no inspector port exposed.",
        "`--heapsnapshot-near-heap-limit` captures just before an OOM crash. Configure it <b>before</b> the incident.",
        "Sort by <b>Comparison</b> between snapshots, not by size. The biggest object is often supposed to be big.",
        "<b>Retainers</b> is the only view that reliably finds a leak: it shows why an object is still reachable.",
        "The question is <b>\"why is this still reachable?\"</b>, not \"why is memory high?\"",
        "Four patterns: global arrays, unbounded caches, unremoved listeners, uncleared timers.",
        "A cache with no eviction policy is <b>a leak with a helpful name</b>.",
        "Day 9's `MaxListenersExceededWarning` and rising memory are <b>the same bug from two systems</b>.",
        "All four are one shape: <b>a long-lived container holding short-lived data</b>.",
        "So the fast method is grepping for module-level things that can grow. That list is short and the leak is on it.",
        "The fix is never \"free the memory\", it is <b>remove the reference</b>: bound, evict, `off()`, `clearInterval`.",
      ],
      commonMistakes: [
        "<b>Taking one snapshot and studying it</b> — without a second there is no growth to see.",
        "<b>Sorting by total size</b> — the biggest object is usually meant to be big. Sort by what grew.",
        "<b>Skipping the Retainers view</b> — size tells you what, retainers tell you why, and only why is actionable.",
        "<b>Exposing the inspector port to take a snapshot in production</b> — use the signal flag instead.",
        "<b>Configuring `--heapsnapshot-near-heap-limit` after an OOM</b> — there is nothing left to capture.",
        "<b>A `Map` cache with no eviction</b> — that is a leak, whatever you called the variable.",
        "<b>Treating a listener leak and a memory leak as separate problems</b> — they are the same one.",
        "<b>Reaching for snapshots first</b> — grep module-level growable state, which is usually faster.",
      ],
      quiz: [
        {
          question: "How do you capture a heap snapshot from a production process without exposing the inspector?",
          options: [
            "You cannot",
            "`--heapsnapshot-signal=SIGUSR2`, then `kill -USR2 <pid>` writes a file to disk",
            "`--cpu-prof`",
            "`--trace-warnings`",
          ],
          correctIndex: 1,
          explanation:
            "Verified to write a 4.6MB `.heapsnapshot`. You take two, copy them out, and compare locally, which avoids opening a port that is effectively remote code execution.",
        },
        {
          question: "Which heap snapshot view actually finds a leak?",
          options: [
            "Sorting by shallow size",
            "Retainers, because it shows the chain of references keeping an object reachable",
            "The summary tab",
            "The allocation timeline",
          ],
          correctIndex: 1,
          explanation:
            "Size tells you what is big, and the biggest thing is often meant to be. Retainers tells you why something is still alive, which is the only part you can act on.",
        },
        {
          question: "What do global arrays, unbounded caches, unremoved listeners and uncleared timers have in common?",
          options: [
            "They all allocate Buffers",
            "They are all a long-lived container holding short-lived data",
            "They all involve async code",
            "They are all module-scoped",
          ],
          correctIndex: 1,
          explanation:
            "Which gives you a faster method than snapshots: grep for module-level things that can grow. That list is short in most codebases, and the leak is on it.",
        },
      ],
    },
    {
      id: "warnings",
      title: "Warnings and deprecations",
      durationMinutes: 8,
      explanation:
        "## `--trace-warnings`\n\n<b>`--trace-warnings`</b> (makes Node print a stack trace with every process warning).\n\n> Without it a warning tells you <b>what</b> happened and not <b>where</b>. `MaxListenersExceededWarning: 11 data listeners added` is useless on its own, because the interesting part is which line added the eleventh.\n\n```bash\nnode --trace-warnings server.js\n```\n\n```text\nWhere did this warning originate?\n```\n\nThis is the flag that turns Day 9's listener warning from a curiosity into a fix. Same for an unhandled rejection warning, or a Buffer deprecation from a dependency you did not know used it.\n\nAnd Node hints at it: warnings print with \"(Use `node --trace-warnings ...` to show where the warning was created)\". That line is easy to skim past, and it is telling you exactly what to do next.\n\n---\n\n## `--trace-deprecation`\n\n<b>Deprecation</b> (a feature that still works but is discouraged because it may be removed or replaced).\n\n> The reason to trace one is that <b>it is usually not your code</b>. A deprecation warning with no trace leaves you searching your own source for an API you never called, when it came from three levels down a dependency tree.\n\n```bash\nnode --trace-deprecation server.js\n```\n\n```text\nYour code\n   ↓\ndeprecated API\n   ↓\nwarning\n```\n\nAnd once you have the trace, the finding is usually a Day 12 one: an outdated dependency using an API Node is retiring. Which is more useful than it sounds, because it means the fix is an upgrade rather than a rewrite.\n\n---\n\n## Listening for warnings instead\n\nBoth flags print to stderr, which is fine in development and awkward in production where you want structured logs. `process.on(\"warning\")` gives you the warning as an object:\n\n```javascript\nprocess.on(\"warning\", (warning) => {\n  logger.warn({\n    name: warning.name,\n    message: warning.message,\n    stack: warning.stack,\n  });\n});\n```\n\nDay 9's emitter, and Day 4's stdout-versus-stderr point: a warning going to stderr unstructured is a warning your log aggregator cannot alert on.\n\nThe habit worth having: <b>a warning is a bug report from Node</b>. It found something suspicious in your process and told you for free. Treating the output as noise means ignoring the cheapest diagnostic you get.",
      diagram: `A warning without a trace is half a message

    MaxListenersExceededWarning: Possible EventEmitter
    memory leak detected. 11 data listeners added.

    WHAT happened   ✓
    WHERE           ✗   ← the interesting half

    node --trace-warnings
        ↓
    the line that added the eleventh listener

    which turns Day 9's warning from a curiosity
    into a fix.


Node tells you to use it, and you skim past it

    (Use \`node --trace-warnings ...\` to show where the
     warning was created)

    that line is the instruction for what to do next.


Why a deprecation needs a trace specifically

    it is usually NOT YOUR CODE

    without a trace you search your own source for an
    API you never called
        ↓
    it came from three levels down the dependency tree

    and once you have the trace the finding is a
    Day 12 one: an outdated dependency.

    which is good news. the fix is an upgrade, not
    a rewrite.


In production, listen instead of printing

    the flags print to stderr, unstructured
        ↓
    your aggregator cannot alert on it   (Day 4)

    process.on("warning", (warning) => {
      logger.warn({
        name: warning.name,
        message: warning.message,
        stack: warning.stack,
      })
    })

    Day 9's emitter, doing something useful.


The habit

    a warning is a BUG REPORT FROM NODE.

    it found something suspicious in your process and
    told you for free.

    treating the output as noise means ignoring the
    cheapest diagnostic you get.`,
      codeExample: {
        title: "Turning a warning into a location",
        code: `import { EventEmitter } from "node:events";

// ── The warning, with no idea where it came from ────────────
// $ node app.js
//
// (node:12345) MaxListenersExceededWarning: Possible
// EventEmitter memory leak detected. 11 data listeners added
// to [EventEmitter]. MaxListeners is 10. Use
// emitter.setMaxListeners() to increase limit
// (Use \`node --trace-warnings ...\` to show where the warning
//  was created)
//                └─ the instruction, easy to skim past


// ── With the flag, you get the line ─────────────────────────
// $ node --trace-warnings app.js
//
// (node:12345) MaxListenersExceededWarning: ...
//     at genericNodeError (node:internal/errors:984:15)
//     at EventEmitter.addListener (node:events:611:17)
//     at registerHandler (/app/src/bus.js:14:9)      ← HERE
//     at handleRequest (/app/src/server.js:52:5)
//
// Day 9's listener leak, located.


// ── Or capture them as objects ──────────────────────────────
process.on("warning", (warning) => {
  console.log(JSON.stringify({
    level: "warn",
    name: warning.name,
    message: warning.message.split(".")[0],
    origin: warning.stack?.split("\\n")[3]?.trim(),
  }));
});

const emitter = new EventEmitter();
for (let i = 0; i < 11; i += 1) emitter.on("data", () => {});
// {"level":"warn","name":"MaxListenersExceededWarning",
//  "message":"Possible EventEmitter memory leak detected",
//  "origin":"at EventEmitter.addListener (node:events:611:17)"}
//
// Structured, so your aggregator can alert on it. Day 4's
// point: a warning on stderr as free text is a warning
// nothing can act on.


// ── Deprecations, and why the trace matters more ────────────
// $ node --trace-deprecation app.js
//
// (node:12345) [DEP0005] DeprecationWarning: Buffer() is
// deprecated due to security and usability issues.
//     at new Buffer (node:buffer:302:9)
//     at /app/node_modules/some-old-lib/index.js:88:20  ← not you
//     at Object.<anonymous> (/app/src/upload.js:4:1)
//
// You never called Buffer(). A dependency did, three levels
// down. Without the trace you would search your own source
// for an API you never used.
//
// And the finding is a Day 12 one: an outdated dependency.
// The fix is an upgrade, not a rewrite.


// ── The warnings worth knowing on sight ─────────────────────
// MaxListenersExceededWarning   Day 9. a listener leak.
// DeprecationWarning            usually a dependency.
// ExperimentalWarning           you enabled something
//                               unstable on purpose.
// TimeoutOverflowWarning        a setTimeout delay past
//                               2^31 ms, silently clamped.
//
// Each is Node reporting a bug for free. Skimming past them
// is skipping the cheapest diagnostic you have.`,
      },
      keyTakeaways: [
        "<b>`--trace-warnings`</b> adds a stack trace to every process warning.",
        "Without it a warning says <b>what</b> and not <b>where</b>, and where is the interesting half.",
        "It turns Day 9's `MaxListenersExceededWarning` from a curiosity into a located fix.",
        "Node prints the hint itself: \"(Use `node --trace-warnings ...`)\". That line is the instruction.",
        "A <b>deprecation</b> still works but is discouraged and may be removed.",
        "The reason to trace one is that <b>it is usually not your code</b>.",
        "Without the trace you search your own source for an API you never called.",
        "The finding is usually a Day 12 one: an outdated dependency, so the fix is an upgrade.",
        "In production, `process.on(\"warning\")` gives you the warning as an object to log structurally.",
        "Day 4's point: an unstructured warning on stderr is one your aggregator cannot alert on.",
        "<b>A warning is a bug report from Node</b>, found for free. Treating it as noise is skipping your cheapest diagnostic.",
      ],
      commonMistakes: [
        "<b>Reading a warning and not the hint under it</b> — Node tells you which flag will locate it.",
        "<b>Searching your own code for a deprecated API</b> — it usually came from a dependency.",
        "<b>Suppressing warnings to clean up output</b> — you are silencing free bug reports.",
        "<b>Leaving warnings unstructured in production</b> — nothing can alert on stderr free text.",
        "<b>Raising `setMaxListeners` because a warning said to</b> — Day 12's point: the message suggests the wrong fix.",
        "<b>Treating an `ExperimentalWarning` as a problem</b> — you asked for it by enabling the feature.",
      ],
      quiz: [
        {
          question: "Why is `--trace-warnings` the flag that makes Day 9's listener warning actionable?",
          options: [
            "It suppresses duplicate warnings",
            "The warning says what happened but not where, and the trace shows the line that added the eleventh listener",
            "It raises the listener limit",
            "It converts warnings to errors",
          ],
          correctIndex: 1,
          explanation:
            "\"11 data listeners added\" is not something you can act on. The stack trace points at `registerHandler` in your own code, which is the fix.",
        },
        {
          question: "Why does a deprecation warning specifically need a trace?",
          options: [
            "Deprecations have no message",
            "It usually comes from a dependency, so without the trace you search your own code for an API you never called",
            "The warning is printed asynchronously",
            "Node hides the API name",
          ],
          correctIndex: 1,
          explanation:
            "The trace typically points three levels into `node_modules`, which makes it a Day 12 finding: an outdated dependency, fixed by an upgrade rather than a rewrite.",
        },
        {
          question: "Why prefer `process.on(\"warning\")` over `--trace-warnings` in production?",
          options: [
            "It is faster",
            "You get the warning as an object you can log structurally, instead of free text on stderr nothing can alert on",
            "It catches more warnings",
            "The flag does not work in production",
          ],
          correctIndex: 1,
          explanation:
            "Day 4's point applied: stderr free text reaches your logs and not your alerting. As an object you can emit `name`, `message` and `stack` as fields.",
        },
      ],
    },
    {
      id: "linting",
      title: "Linting, formatting and type checking",
      durationMinutes: 14,
      explanation:
        "<b>Linting</b> (automatically checking source code for potential errors, suspicious patterns and style problems).\n\n> Its real job is catching the mistakes that <b>run without failing</b>. A typo crashes, and a linter is not needed for that. An unused variable, an unreachable branch or a forgotten `await` produces working-looking code with a bug in it, which is exactly what nothing else catches.\n\n```text\nUnused variables\nUndefined variables\nBad patterns\nUnreachable code\nSuspicious expressions\nInconsistent practices\n```\n\nThe rules worth having on for a Node backend, all of which have appeared earlier in the track:\n\n```text\nno-floating-promises      Day 3's missing await\nrequire-await             an async function with no await\nno-debugger               a committed debugger statement\nno-unused-vars            dead code, and a real typo detector\nno-await-in-loop          Day 3's sequential-await mistake\n```\n\nThat first one is the highest-value rule in the list. Day 3's missing `await` and Day 13's silently-passing test are the same bug, and `no-floating-promises` is the only tool in the whole track that catches it automatically.\n\n---\n\n## Biome vs ESLint\n\n<b>Biome</b> (a fast toolchain providing JavaScript and TypeScript linting and formatting in one tool).\n\n> The interesting part is <b>in one tool</b>. It replaces a linter, a formatter and the configuration that makes them agree, which is most of the setup cost people associate with linting.\n\n<b>ESLint</b> (a highly configurable JavaScript and TypeScript linting system with a large plugin ecosystem).\n\n> Configurability is both the feature and the cost. The plugin ecosystem is why type-aware rules like `no-floating-promises` exist at all, and it is also why an ESLint setup drifts and needs maintaining.\n\n---\n\n## Which one\n\nFor a new project, Biome is attractive: simple and fast. For an existing team, ESLint may already be deeply integrated.\n\n> <b>Pick one primary linting setup.</b> Do not run ESLint plus Biome lint plus something else without a good reason.\n\nSame argument as Day 12's \"pick one package manager\": two tools means two configurations that disagree, and a rule one enables and the other does not.\n\nThe honest deciding factor: if you want <b>type-aware</b> rules, you need ESLint with `typescript-eslint`, because those rules require the type checker and Biome does not run one. `no-floating-promises` is a type-aware rule, which is what makes this a real trade rather than a preference.\n\n---\n\n## Formatting\n\n<b>Formatter</b> (a tool that automatically rewrites source-code formatting to follow consistent rules).\n\n> It is not about beautiful code. It is about <b>removing a category of conversation</b> from code review, so nobody spends a comment on quote style while the actual logic goes unexamined.\n\n```javascript\nconst user={name:\"Rajan\",age:30}\n```\n\nbecomes:\n\n```javascript\nconst user = {\n  name: \"Rajan\",\n  age: 30\n};\n```\n\n```text\ntabs vs spaces\nsingle vs double quotes\nline length\ntrailing commas\nbraces\n```\n\nAll settled by the tool.\n\nOne practical benefit beyond that: consistent formatting makes <b>diffs meaningful</b>. If everyone's editor reformats on save differently, every pull request contains whitespace noise and a reviewer cannot see the actual change.\n\nAnd if you adopt one on an existing codebase, do the initial reformat as <b>its own commit</b>, then add it to `.git-blame-ignore-revs`. Otherwise you have rewritten every line's blame history.\n\n---\n\n## Linter vs formatter\n\n```text\nFormatter\n   ↓\n\"How should this code look?\"\n\nLinter\n   ↓\n\"Is this code suspicious or against our rules?\"\n```\n\nDifferent problems. And the practical rule that follows: <b>a formatting disagreement should never be a lint error</b>. If a tool can fix it automatically it should, silently, on save. A linter should only speak up about things a human has to decide.\n\n---\n\n## `tsc --noEmit`\n\n<b>`--noEmit`</b> (type-checks a TypeScript project without generating any JavaScript output).\n\n> Day 5's point restated: Node strips types without reading them, so this is the <b>only</b> thing checking them. In a no-build project it is not a nice-to-have, it is the whole type safety story.\n\n```bash\ntsc --noEmit\n```\n\n```text\nPush code\n   ↓\ntsc --noEmit\n   ↓\ntype errors?\n```\n\nThe three checks are not interchangeable, and it is worth knowing which catches what:\n\n```text\nformatter     how it looks\nlinter        suspicious patterns\ntype checker  do the types line up\n```\n\nA linter cannot tell you a function returns the wrong shape. A type checker cannot tell you an unused variable is dead code. Run all three, and run them in that order, because a formatter changing a line the linter just complained about wastes a cycle.",
      diagram: `A linter catches what RUNS WITHOUT FAILING

    a typo           crashes. no linter needed.
    an unused var    working-looking code with a bug
    unreachable code
    a forgotten await

    that last one is the highest-value rule you can
    turn on:

      no-floating-promises

    Day 3's missing await and Day 13's silently
    passing test are the SAME BUG, and this is the
    only tool in the whole track that catches it
    automatically.


The rules worth enabling, all seen earlier

    no-floating-promises   Day 3's missing await
    require-await          async with nothing awaited
    no-debugger            Day 14's committed statement
    no-unused-vars         dead code, and a typo detector
    no-await-in-loop       Day 3's sequential awaits


Biome or ESLint: the real deciding factor

    Biome    linting + formatting in ONE tool
               └─ replaces the config that makes two
                  tools agree, which is most of the
                  setup cost

    ESLint   configurable, huge plugin ecosystem
               └─ which is why type-aware rules exist
                  at all, and why a setup drifts

    the honest decider:

      want TYPE-AWARE rules?
        → ESLint + typescript-eslint
        → because those rules need the type checker,
          and Biome does not run one

      no-floating-promises IS type-aware, which makes
      this a real trade rather than a preference.


    and pick ONE. two linters means two configs that
    disagree.  (Day 12's package-manager argument)


A formatter removes a CATEGORY OF CONVERSATION

    not "beautiful code".

    nobody spends a review comment on quote style
    while the actual logic goes unexamined.

    and consistent formatting makes DIFFS MEANINGFUL:
    if every editor reformats differently, every PR
    is whitespace noise.

    adopting one on an existing codebase:
      do the reformat as its OWN COMMIT
      add it to .git-blame-ignore-revs
        └─ or you have rewritten every line's blame


Three checks, three questions, in this order

    formatter      how it LOOKS          fix silently
    linter         is it SUSPICIOUS      a human decides
    type checker   do the TYPES line up

    a formatting disagreement should NEVER be a lint
    error. if a tool can fix it, it should, on save.

    and tsc --noEmit is the ONLY thing checking your
    types, because Node strips them without reading
    them.  (Day 5)`,
      codeExample: {
        title: "The rules that catch bugs from earlier days",
        code: `// ══ What a linter catches that nothing else does ═══════════

// ── Day 3's missing await, and Day 13's lying test ──────────
async function saveUser(user) {
  return db.insert(user);
}

async function handler() {
  saveUser({ name: "Rajan" });      // ✗ no await
  return { ok: true };              //   returns before the save
}
//
// no-floating-promises:
//   Promises must be awaited, end with a call to .catch,
//   or be explicitly marked as ignored
//
// This is the single highest-value rule in a Node project.
// Day 3's missing await and Day 13's silently-passing test
// are the same bug, and this is the only thing in the whole
// track that catches it automatically.


// ── An async function that never awaits ─────────────────────
async function getName(user) {       // ✗ require-await
  return user.name;
}
//
// Usually a leftover from a refactor, and it makes every
// caller await something that never needed it.


// ── Day 3's sequential awaits ───────────────────────────────
async function loadAllSlow(ids) {
  const out = [];
  for (const id of ids) {
    out.push(await fetchUser(id));   // ✗ no-await-in-loop
  }
  return out;
}

async function loadAllFast(ids) {
  return Promise.all(ids.map(fetchUser));   // ✓
}


// ── A committed debugger statement ──────────────────────────
function process(payload) {
  // debugger;                       // ✗ no-debugger
  return payload;
}
//
// A no-op unattached and a freeze under --inspect, which is
// why the rule exists.


// ══ Why type-aware rules need ESLint ═══════════════════════
// no-floating-promises has to know saveUser returns a
// Promise. That requires the type checker.
//
// eslint.config.js
// import tseslint from "typescript-eslint";
//
// export default tseslint.config(
//   ...tseslint.configs.recommendedTypeChecked,
//   {
//     languageOptions: {
//       parserOptions: { projectService: true },   // ← the types
//     },
//     rules: {
//       "@typescript-eslint/no-floating-promises": "error",
//       "@typescript-eslint/require-await": "error",
//       "no-debugger": "error",
//     },
//   },
// );
//
// Biome does not run a type checker, so it cannot offer this
// rule. That is the real trade, not a preference.


// ══ The three checks, in order ═════════════════════════════
// package.json
// {
//   "scripts": {
//     "format":    "biome format --write .",
//     "lint":      "eslint .",
//     "typecheck": "tsc --noEmit",
//     "check":     "npm run format && npm run lint && npm run typecheck && npm test"
//   }
// }
//
// Format first: a formatter changing a line the linter just
// complained about wastes a cycle.


// ══ And what each one cannot do ════════════════════════════
function totalPrice(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}
//
// the LINTER    sees nothing wrong
// the TYPES     catch it, if items is typed:
//                 Property 'price' does not exist on type ...
//
// const unused = totalPrice([]);
//
// the TYPES     see nothing wrong
// the LINTER    catches it: no-unused-vars
//
// Not interchangeable. Run all three.

async function fetchUser(id) { return { id }; }
const db = { async insert(x) { return x; } };`,
      },
      keyTakeaways: [
        "A linter's real job is catching mistakes that <b>run without failing</b>. A typo crashes on its own.",
        "<b>`no-floating-promises` is the highest-value rule</b> in a Node project.",
        "Day 3's missing `await` and Day 13's silently-passing test are the same bug, and this is the only automatic catch.",
        "Also worth enabling: `require-await`, `no-debugger`, `no-unused-vars`, `no-await-in-loop`.",
        "<b>Biome</b> does linting and formatting <b>in one tool</b>, removing the config that makes two agree.",
        "<b>ESLint</b> is configurable with a large plugin ecosystem, which is both the feature and the maintenance cost.",
        "The honest decider: <b>type-aware rules need ESLint</b> with `typescript-eslint`, because they need the type checker.",
        "Biome does not run one, and `no-floating-promises` is type-aware. That makes it a real trade.",
        "<b>Pick one linter.</b> Two means two configs that disagree. Day 12's package-manager argument.",
        "A formatter <b>removes a category of conversation</b> from review, and makes diffs meaningful.",
        "Adopt one as its own commit, then add it to `.git-blame-ignore-revs`.",
        "<b>A formatting disagreement should never be a lint error.</b> If a tool can fix it, it should, silently.",
        "`tsc --noEmit` is the <b>only</b> thing checking your types, because Node strips them without reading them (Day 5).",
        "Format, lint, typecheck. In that order, and none of the three replaces another.",
      ],
      commonMistakes: [
        "<b>Not enabling `no-floating-promises`</b> — you leave the most common async bug entirely uncaught.",
        "<b>Running two linters</b> — two configurations that disagree, and rules one enables and the other does not.",
        "<b>Choosing Biome then wanting type-aware rules</b> — it does not run a type checker, so it cannot offer them.",
        "<b>Making formatting a lint error</b> — if a tool can fix it automatically, it should, on save.",
        "<b>Reformatting a whole codebase in a feature commit</b> — you have rewritten every line's blame history.",
        "<b>Skipping `tsc --noEmit` because tests pass</b> — nothing else checks your types.",
        "<b>Linting before formatting</b> — the formatter then changes lines the linter just reported.",
        "<b>Treating the three checks as interchangeable</b> — a linter cannot see a wrong return shape, and types cannot see dead code.",
      ],
      quiz: [
        {
          question: "Which lint rule catches the bug that Day 3 and Day 13 both warned about?",
          options: [
            "`no-unused-vars`",
            "`no-floating-promises`, which catches a missing `await`",
            "`no-debugger`",
            "`eqeqeq`",
          ],
          correctIndex: 1,
          explanation:
            "A missing `await` is a floating promise, an unhandled rejection, and a test that passes without testing anything. This is the only tool in the track that catches it automatically.",
        },
        {
          question: "What is the honest deciding factor between Biome and ESLint?",
          options: [
            "Speed",
            "Type-aware rules need ESLint with `typescript-eslint`, because they require the type checker and Biome does not run one",
            "Configuration file format",
            "Editor support",
          ],
          correctIndex: 1,
          explanation:
            "Since `no-floating-promises` is type-aware, that makes it a real trade rather than a preference. Biome wins on setup cost, ESLint on rule depth.",
        },
        {
          question: "Why should a formatting disagreement never be a lint error?",
          options: [
            "Formatting does not matter",
            "If a tool can fix it automatically it should, silently. A linter should only report things a human must decide",
            "Linters cannot detect formatting",
            "It slows the linter down",
          ],
          correctIndex: 1,
          explanation:
            "That division is the point of having both tools. A formatter settles how code looks with no conversation; a linter raises questions that need judgement.",
        },
      ],
    },
    {
      id: "hooks-and-run",
      title: "Git hooks and node --run",
      durationMinutes: 10,
      explanation:
        "## Git hooks\n\n<b>Git hook</b> (a script Git runs automatically when certain Git actions happen).\n\n> The value is <b>timing</b>: a check that runs before the commit exists catches the mistake while you still have the context to fix it. The same check in CI finds it ten minutes later, after you have moved on.\n\n```text\ngit commit\n   ↓\nrun lint\n   ↓\nrun tests\n   ↓\nallow commit\n```\n\n<b>Husky</b> (a tool for managing Git hooks from a project).\n\n> The reason a tool exists at all is that hooks live in `.git/hooks`, which is <b>not committed</b>. So a hook you set up locally protects only you, and Husky's job is making the hook part of the repository.\n\n```text\nDeveloper\n   ↓\ngit commit\n   ↓\nHusky\n   ↓\nlint / tests\n   ↓\ncommit succeeds\n```\n\n<b>Lefthook</b> (another Git hook manager, built for fast and configurable project workflows).\n\n> You need one of these, not both. Same argument as Day 12's package managers and this day's linters: two tools managing the same hook file is a conflict waiting to happen.\n\n---\n\n## Keep hooks fast\n\nThe one rule that decides whether hooks survive in a team: <b>a slow hook gets bypassed</b>. `git commit --no-verify` exists, and a pre-commit hook running the full test suite teaches people to use it within a week.\n\nSo: format and lint <b>the staged files only</b> in `pre-commit`, and leave the full suite to `pre-push` or CI. A commit hook that takes two seconds is a habit. One that takes ninety is a workaround.\n\nAnd hooks are not a substitute for CI. They run on machines you do not control, they can be skipped, and a fresh clone with no `npm install` has no hooks at all. Treat them as fast feedback and CI as the actual gate.\n\n---\n\n## `node --run`\n\n<b>`node --run`</b> (runs a script defined in `package.json` using Node directly, without invoking npm).\n\n> It is not a drop-in replacement for `npm run`, and the difference is easy to miss: <b>it does not run `pre` and `post` hooks</b>. Verified: with `prex`, `x` and `postx` defined, `npm run x` ran all three and `node --run x` ran only `x`.\n\n```javascript\n{\n  \"scripts\": {\n    \"dev\": \"node --watch src/server.js\"\n  }\n}\n```\n\n```bash\nnode --run dev\n```\n\ninstead of:\n\n```bash\nnpm run dev\n```\n\nThat hook difference matters because of Day 12: a project relying on `prepublishOnly` to build before publishing, or `pretest` to seed a database, gets those steps <b>silently skipped</b>. No error, no warning, just a missing step.\n\nThe good news is that the other property carries over. `node --run` does put `node_modules/.bin` first on the PATH, verified, so a script calling `tsc` still resolves the local install. Day 12's point holds.\n\n---\n\n## Why it exists\n\n```text\npackage.json\n    ↓\nnpm run script\n```\n\nversus:\n\n```text\npackage.json\n    ↓\nnode --run script\n```\n\nThe motivation is avoiding npm's startup overhead: `npm run` spawns Node to run npm, which then spawns your script. `node --run` skips a process.\n\nThat saves a few hundred milliseconds, which sounds trivial and is not when a Git hook runs it on every commit, or a watch loop restarts it constantly. That is the case it is actually for, and it is exactly the case where the missing hooks are least likely to matter.",
      diagram: `Hooks are about TIMING

    before the commit exists
        └─ you still have the context to fix it

    in CI, ten minutes later
        └─ you have moved on

    same check. very different cost to act on.


Why a tool is needed at all

    hooks live in .git/hooks
        └─ NOT COMMITTED

    so a hook you set up locally protects only you.

    Husky's job is making the hook part of the
    repository. Lefthook does the same.

    pick ONE. two tools managing one hook file is a
    conflict waiting to happen.
      (Day 12's package managers. this day's linters.)


The rule that decides whether hooks survive

    A SLOW HOOK GETS BYPASSED.

    git commit --no-verify exists, and a pre-commit
    hook running the full suite teaches people to use
    it within a week.

    pre-commit    format + lint the STAGED files
                    └─ two seconds is a habit
    pre-push / CI  the full suite
                    └─ ninety seconds is a workaround


    and hooks are not a substitute for CI:
      they run on machines you do not control
      they can be skipped
      a fresh clone with no npm install has none

    fast feedback, not the gate.


node --run is NOT a drop-in for npm run

    scripts: prex, x, postx

    npm run x        PRE-HOOK  MAIN  POST-HOOK
    node --run x     MAIN                      ← verified

    which matters because of Day 12:
      prepublishOnly to build before publishing
      pretest to seed a database
        └─ SILENTLY skipped. no error, no warning.


    but the other property carries over:

    node --run DOES put node_modules/.bin first on
    PATH (verified), so a script calling tsc still
    resolves the local install.


Why it exists

    npm run   spawns node → runs npm → spawns your
              script
    node --run  skips a process

    a few hundred ms, which is trivial until a Git
    hook runs it on every commit, or a watch loop
    restarts it constantly.

    that is the case it is for. and it is exactly the
    case where the missing hooks matter least.`,
      codeExample: {
        title: "Hooks that stay fast, and the node --run difference",
        code: `// ══ The verified difference ════════════════════════════════
// package.json
// {
//   "scripts": {
//     "prex":  "echo PRE-HOOK",
//     "x":     "echo MAIN",
//     "postx": "echo POST-HOOK"
//   }
// }
//
// $ npm run x
//   PRE-HOOK
//   MAIN
//   POST-HOOK
//
// $ node --run x
//   MAIN
//
// Only the script itself. No error, no warning about the
// hooks it skipped.


// ══ Why that matters, from Day 12 ══════════════════════════
// {
//   "scripts": {
//     "build":          "tsc",
//     "prepublishOnly": "npm run build",     ← skipped
//     "pretest":        "node scripts/seed.js",  ← skipped
//     "test":           "node --test"
//   }
// }
//
// $ node --run test
//   runs the tests against an unseeded database, and tells
//   you nothing about the step it did not run
//
// Day 12's prepublishOnly hook was the one good use of a
// lifecycle hook, and this silently disables it.


// ══ But the PATH property carries over ═════════════════════
// {
//   "scripts": {
//     "which": "node -e \\"console.log(process.env.PATH.split(':')[0])\\""
//   }
// }
//
// $ node --run which
//   /app/node_modules/.bin              ← verified
//
// So a script calling tsc, eslint or biome still resolves
// the local install. Day 12's point holds.


// ══ Hooks that people will not bypass ══════════════════════
// .husky/pre-commit
//   #!/bin/sh
//   npx lint-staged
//
// package.json
// {
//   "lint-staged": {
//     "*.{js,ts}": ["biome format --write", "eslint --fix"],
//     "*.{json,md}": ["biome format --write"]
//   }
// }
//
// Staged files only. Two seconds. A habit.
//
// .husky/pre-push
//   #!/bin/sh
//   npm run typecheck && npm test
//
// The slow checks, once per push rather than per commit.


// ══ What NOT to put in pre-commit ══════════════════════════
// .husky/pre-commit
//   #!/bin/sh
//   npm run typecheck && npm test && npm run test:integration
//
// Ninety seconds on every commit. Within a week the team has
// found:
//
//   git commit --no-verify
//
// and your hook protects nobody. A slow hook is worse than
// no hook, because it trains people to skip the mechanism.


// ══ And hooks are not the gate ═════════════════════════════
// They run on machines you do not control, they can be
// skipped with one flag, and a fresh clone that has not run
// npm install has no hooks at all.
//
// .github/workflows/ci.yml
//   - run: npm ci                    ← Day 12: fails on a
//   - run: npm run typecheck            stale lockfile
//   - run: npm run lint
//   - run: npm test
//
// Hooks are fast feedback. CI is the gate.`,
      },
      keyTakeaways: [
        "A <b>Git hook</b> runs on a Git action, and its value is <b>timing</b>: you still have the context to fix it.",
        "The same check in CI finds the problem ten minutes later, after you have moved on.",
        "Hooks live in `.git/hooks`, which is <b>not committed</b>, so a local hook protects only you.",
        "<b>Husky</b> and <b>Lefthook</b> exist to make the hook part of the repository. Pick one, not both.",
        "<b>A slow hook gets bypassed.</b> `git commit --no-verify` exists and people find it within a week.",
        "So format and lint <b>staged files only</b> in `pre-commit`, and leave the full suite to `pre-push` or CI.",
        "Two seconds is a habit. Ninety is a workaround, and a bypassed hook protects nobody.",
        "Hooks are not a substitute for CI: they run on machines you do not control and can be skipped.",
        "<b>`node --run` does not run `pre` and `post` hooks.</b> Verified against `npm run`, which runs all three.",
        "So Day 12's `prepublishOnly` build or a `pretest` seed step is <b>silently skipped</b>.",
        "It does still put `node_modules/.bin` first on the PATH, verified, so local tools resolve.",
        "It exists to skip npm's process startup, which matters in a Git hook or a watch loop.",
        "And that is exactly the case where the missing lifecycle hooks matter least.",
      ],
      commonMistakes: [
        "<b>Running the full test suite in `pre-commit`</b> — the team learns `--no-verify` and the hook protects nobody.",
        "<b>Linting the whole project instead of staged files</b> — slow, and it reports problems you did not touch.",
        "<b>Installing both Husky and Lefthook</b> — two tools managing one hook file.",
        "<b>Treating hooks as the gate</b> — they are skippable and absent on a fresh clone. CI is the gate.",
        "<b>Swapping `npm run` for `node --run` project-wide</b> — every `pre` and `post` hook silently stops running.",
        "<b>Assuming `node --run` warns about skipped hooks</b> — it does not. There is no output at all.",
        "<b>Using `node --run` for a script with a `prepublishOnly`</b> — you publish a stale build with no warning.",
      ],
      quiz: [
        {
          question: "What is the difference between `npm run x` and `node --run x` when `prex` and `postx` exist?",
          options: [
            "None, they are equivalent",
            "`npm run` runs all three; `node --run` runs only `x`, with no warning about the skipped hooks",
            "`node --run` runs them in a different order",
            "`node --run` errors",
          ],
          correctIndex: 1,
          explanation:
            "Verified. It matters because Day 12's `prepublishOnly` and any `pretest` setup step get silently skipped, so you can publish a stale build or test an unseeded database.",
        },
        {
          question: "Why should a `pre-commit` hook only check staged files?",
          options: [
            "Git requires it",
            "A slow hook gets bypassed with `--no-verify`, so a two-second check survives and a ninety-second one does not",
            "Unstaged files cannot be linted",
            "It reduces disk usage",
          ],
          correctIndex: 1,
          explanation:
            "A bypassed hook protects nobody, and a slow one actively trains people to skip the mechanism. The full suite belongs in `pre-push` or CI.",
        },
        {
          question: "Why does Husky exist at all?",
          options: [
            "Git hooks are hard to write",
            "Hooks live in `.git/hooks`, which is not committed, so a local hook protects only the person who set it up",
            "Git does not support pre-commit hooks",
            "It makes hooks faster",
          ],
          correctIndex: 1,
          explanation:
            "Its whole job is making the hook part of the repository so the whole team gets it. Lefthook solves the same problem, which is why you want one and not both.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "When should you stop adding `console.log` and attach a debugger?",
      options: [
        "Immediately, logging is always wrong",
        "At the second or third log added to narrow down where a value changed",
        "Only for async code",
        "Only in production",
      ],
      correctIndex: 1,
      explanation:
        "One log to check one value is fine. Bisecting with prints is hand-rolling step-through debugging, badly.",
    },
    {
      question: "A stack trace from a 35-deep recursion shows 10 frames. Why?",
      options: [
        "V8 collapses repeated frames",
        "The default `stack-trace-limit` is 10, so it was truncated",
        "Frames were inlined",
        "The error was rethrown",
      ],
      correctIndex: 1,
      explanation:
        "Verified: `--stack-trace-limit=50` shows all 35. A trace that seems to end nowhere has usually just been cut off.",
    },
    {
      question: "Your profile shows routing at 5% and one function at 70%. You halve routing's cost. What do you save?",
      options: ["5%", "2.5%", "35%", "Nothing measurable"],
      correctIndex: 1,
      explanation:
        "Halving the 70% function saves 35% for the same effort. That arithmetic is why measuring first is the whole technique.",
    },
    {
      question: "Memory climbs for a minute then returns to baseline. Is that a leak?",
      options: [
        "Yes",
        "No. V8 collects lazily, so a climb followed by a return is the healthy sawtooth",
        "Only above 500MB",
        "Only if `rss` also rose",
      ],
      correctIndex: 1,
      explanation:
        "A leak never comes back down. Checking for a return to baseline first saves most of the investigations that turn out to be nothing.",
    },
    {
      question: "What rule does the garbage collector follow?",
      options: [
        "Whether an object is still useful",
        "Whether anything can still reach it",
        "How long since it was accessed",
        "Its size",
      ],
      correctIndex: 1,
      explanation:
        "The gap between \"no longer needed\" and \"no longer reachable\" is where every leak lives, which is why the question is what still points at it.",
    },
    {
      question: "How do you capture a heap snapshot in production without exposing the inspector?",
      options: [
        "You cannot",
        "`--heapsnapshot-signal=SIGUSR2`, then `kill -USR2 <pid>`",
        "`--cpu-prof`",
        "`--trace-warnings`",
      ],
      correctIndex: 1,
      explanation:
        "Verified to write a 4.6MB file. The inspector port is effectively remote code execution, so this is the path that does not open one.",
    },
    {
      question: "Which lint rule catches the bug Day 3 and Day 13 both warned about?",
      options: ["`no-unused-vars`", "`no-floating-promises`", "`eqeqeq`", "`no-debugger`"],
      correctIndex: 1,
      explanation:
        "A missing `await` is a floating promise, an unhandled rejection and a test that passes without testing anything. This is the only automatic catch in the track.",
    },
    {
      question: "What is the honest trade between Biome and ESLint?",
      options: [
        "Speed only",
        "Type-aware rules need ESLint with `typescript-eslint`, because they require the type checker Biome does not run",
        "Editor support",
        "Config file format",
      ],
      correctIndex: 1,
      explanation:
        "Since `no-floating-promises` is type-aware, this is a real capability difference rather than a preference.",
    },
    {
      question: "What does `node --run x` do differently from `npm run x`?",
      options: [
        "Nothing",
        "It skips `pre` and `post` hooks, silently",
        "It ignores `node_modules/.bin`",
        "It runs the script twice",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Day 12's `prepublishOnly` or a `pretest` seed step stops running with no warning. The PATH behaviour does carry over.",
    },
  ],
  project: {
    name: "day-14",
    goal: "Create a deliberate memory leak, find the retaining reference with heap snapshots, then fix it and prove the fix with a measurement.",
    brief:
      "The leak is easy to write and the point is the method. Two things will decide whether you actually learn something. First, one snapshot is nearly useless: a leak is growth over time, so you need two or three and the Comparison view. Second, sorting by size finds what is big, which is often supposed to be big. The Retainers view is what tells you why an object is still reachable, and that is the only part you can act on. Use --heapsnapshot-signal rather than opening an inspector port, since that is the technique that also works in production.",
    steps: [
      "Create `day-14/` with `package.json` containing `\"type\": \"module\"`, and a `memory-leak.js`.",
      "Write an interval that pushes `{ data: Buffer.alloc(1024 * 1024), timestamp: Date.now() }` into a module-level array every second, logging the length.",
      "Run it and watch `process.memoryUsage().rss` climb. Note that `heapUsed` barely moves, and say why.",
      "Restart it with `node --heapsnapshot-signal=SIGUSR2 memory-leak.js`.",
      "Send `kill -USR2 <pid>`, wait about twenty seconds, then send it again. You should have two `.heapsnapshot` files.",
      "Load both into Chrome DevTools' Memory tab and switch the view to Comparison.",
      "Sort by delta rather than size, find the objects that grew, and open the Retainers view on one of them.",
      "Follow the retaining chain back to the module-level array, and write down the reference path you found.",
      "Fix it by bounding the array, then re-measure `rss` over the same period and confirm it flattens.",
    ],
    acceptance: [
      "The leaking version shows `rss` climbing steadily and never returning to baseline.",
      "You can explain why `heapUsed` barely moves while `rss` climbs, in terms of Day 7.",
      "Two heap snapshots captured via `--heapsnapshot-signal`, with no inspector port exposed.",
      "The Comparison view shows the growth, and you sorted by delta rather than total size.",
      "You can state the retaining chain from a leaked object back to a root.",
      "The fixed version's `rss` flattens over the same period, measured rather than assumed.",
      "You can say why the fix is \"remove the reference\" rather than \"free the memory\".",
      "You can name which of the four leak patterns this was, and give a real example of a different one.",
    ],
    stretch: [
      "Reproduce the listener version: register a `bus.on(\"shutdown\", ...)` per simulated request and watch both `listenerCount` and `rss` rise, connecting Day 9 to today.",
      "Reproduce the timer version: capture a 50MB Buffer in a `setInterval` closure, then fix it with `clearInterval`.",
      "Add `--heapsnapshot-near-heap-limit=2` and run with a small `--max-old-space-size` to get an automatic snapshot before the OOM.",
      "Profile something slow with `--cpu-prof`, then write the same measurement with `node:inspector` so it covers a window rather than the whole process.",
      "Turn on `no-floating-promises` in a project of yours and count how many real bugs it finds.",
      "Compare `npm run` and `node --run` on a script with a `pre` hook, and confirm the hook is skipped silently.",
    ],
  },
};
