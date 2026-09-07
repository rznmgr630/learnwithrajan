import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_30_LESSONS: LessonDay = {
  day: 30,
  title: "Node upgrades & what changed",
  totalMinutes: 100,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "versions-and-what-is-actually-there",
      title: "Versions, and checking what is actually in your runtime",
      durationMinutes: 12,
      explanation:
        "## Where this lesson is measured from\n\n```bash\n$ node -v\nv24.14.1\n\n$ node -p \"process.release.lts\"\nKrypton\n\n$ node -p \"process.versions.v8\"\n13.6.233.17-node.44\n```\n\n> Everything below is checked against that runtime. Anything specific to a release I do not have installed is <b>unverified</b>, and I will say so rather than describe it as though I had run it. That is the actual skill this lesson is about.\n\n---\n\n## The release cycle\n\n<b>LTS (long term support)</b> (a release line that receives fixes for an extended period).\n\n```text\nCurrent  →  Active LTS  →  Maintenance LTS  →  end of life\n```\n\n> Even-numbered releases become LTS; odd-numbered ones never do. So Node 25 is not a smaller upgrade than Node 26, it is a line that will be <b>end of life sooner</b>. That is the practical reason to run LTS in production, and it is a stronger reason than stability.\n\n---\n\n## The claim to distrust most\n\n> \"Node 26 adds X\" is a claim about a runtime, and the only place to check it is a runtime. Blog posts describe proposals as though they had shipped, and the gap between \"in V8\" and \"on by default in Node\" is where a lot of wasted time lives.\n\nMeasured on Node 24.14.1:\n\n```text\ntypeof Temporal                       undefined\ntypeof Map.prototype.getOrInsert      undefined\ntypeof Map.prototype.getOrInsertComputed  undefined\ntypeof WeakMap.prototype.getOrInsert  undefined\ntypeof Iterator.concat                undefined\n\ntypeof Object.groupBy                 function\ntypeof Map.groupBy                    function\ntypeof Iterator.prototype.map         function\ntypeof globalThis.WebSocket           function\n```\n\n> Five of those are things you will read about as available. On the current LTS they do not exist. Two lines of `node -p` settle it, and that habit is worth more than memorising any feature list.\n\n---\n\n## Behind a flag is not shipped\n\n```bash\n$ node -p \"typeof Temporal\"\nundefined\n$ node --harmony-temporal -p \"typeof Temporal\"\nobject\n```\n\n> So Temporal is <b>in</b> the V8 that ships with Node 24, and it is off. A flagged feature can change shape or be removed, so it belongs in an experiment, not in a service you have to operate.\n\n---\n\n## Pinning, and the trap in the usual advice\n\nThe standard suggestion is an `engines` field. Measured:\n\n```text\nengines.node = \">=99.0.0\", npm install    → npm warn EBADENGINE, exit 0\nsame, with engine-strict=true in .npmrc   → npm error EBADENGINE, exit 1\n```\n\n> `engines` on its own is a <b>warning nobody reads</b>. It does not stop an install and it does not fail a build. If you want it enforced you need `engine-strict=true`, and even then it only checks the machine running `npm install`.\n>\n> The version that actually holds is `.nvmrc` for people, the same file read by CI, and the base image tag in your Dockerfile. Three places, and Day 28's test asserting they agree.",
      diagram: `Where this lesson is measured from

    $ node -v                    v24.14.1
    $ node -p process.release.lts  Krypton
    $ node -p process.versions.v8
                        13.6.233.17-node.44

    everything below is checked against THAT
    runtime.

    ⚠ anything specific to a release I do not have
      installed is UNVERIFIED, and I will say so
      rather than describe it as though I had run
      it.

      that is the actual skill this lesson is
      about.


The release cycle

    Current → Active LTS → Maintenance LTS → EOL

    ⚠ EVEN-numbered releases become LTS.
      ODD-numbered ones NEVER do.

    → Node 25 is not a smaller upgrade than 26.

      it is a line that will be END OF LIFE
      SOONER.

    that is a stronger reason to run LTS in
    production than "stability".


⚠⚠ The claim to distrust most

    "Node 26 adds X" is a claim about a RUNTIME,
    and the only place to check it is a RUNTIME.

    blog posts describe PROPOSALS as though they
    had SHIPPED, and the gap between "in V8" and
    "on by default in Node" is where a lot of
    wasted time lives.

    MEASURED on Node 24.14.1:

      typeof Temporal                  undefined
      Map.prototype.getOrInsert        undefined
      Map.prototype.getOrInsertComputed
                                       undefined
      WeakMap.prototype.getOrInsert    undefined
      Iterator.concat                  undefined

      Object.groupBy                    function
      Map.groupBy                       function
      Iterator.prototype.map            function
      globalThis.WebSocket              function

    five of those are things you will read about
    as AVAILABLE. on the current LTS they DO NOT
    EXIST.

    → two lines of node -p settle it, and that
      habit is worth more than memorising any
      feature list


Behind a flag is not shipped

    $ node -p "typeof Temporal"
      undefined
    $ node --harmony-temporal -p "typeof Temporal"
      object

    so Temporal IS in the V8 that ships with Node
    24, and it is OFF.

    ⚠ a flagged feature can change shape or be
      removed.

      → an experiment, not a service you have to
        operate


⚠⚠ Pinning, and the trap in the usual advice

    the standard suggestion is an engines field.
    MEASURED:

      engines.node = ">=99.0.0"
      npm install
        → npm warn EBADENGINE, EXIT 0

      same, with engine-strict=true in .npmrc
        → npm error EBADENGINE, EXIT 1

    engines on its own is A WARNING NOBODY READS.

      it does not stop an install
      it does not fail a build
      and even strict only checks the machine
        running npm install

    ✓ what actually holds:

      .nvmrc              for people
      the same file       read by CI
      the base image tag  in your Dockerfile

      three places, plus Day 28's test asserting
      they agree`,
      codeExample: {
        title: "Checking your runtime instead of reading about it",
        code: `// ── The five-second check that settles any feature claim ────
// $ node -p "typeof Temporal"
//   undefined
//
// $ node -p "typeof Map.prototype.getOrInsert"
//   undefined
//
// $ node -p "typeof Iterator.concat"
//   undefined
//
// $ node -p "typeof Object.groupBy"
//   function
//
// VERIFIED on v24.14.1. Do this before you plan work around
// a feature, not after you have written code against it.


// ── A script that reports what you actually have ────────────
// scripts/runtime-report.mjs
const checks = {
  "Temporal": () => typeof globalThis.Temporal,
  "Map.getOrInsert": () => typeof Map.prototype.getOrInsert,
  "Map.getOrInsertComputed": () => typeof Map.prototype.getOrInsertComputed,
  "WeakMap.getOrInsert": () => typeof WeakMap.prototype.getOrInsert,
  "Iterator.concat": () => typeof Iterator.concat,
  "Iterator.prototype.map": () => typeof Iterator.prototype.map,
  "Object.groupBy": () => typeof Object.groupBy,
  "Map.groupBy": () => typeof Map.groupBy,
  "WebSocket": () => typeof globalThis.WebSocket,
  "EventSource": () => typeof globalThis.EventSource,
  "localStorage": () => typeof globalThis.localStorage,
  "node:sqlite": () => { try { return typeof require("node:sqlite").DatabaseSync; } catch { return "unavailable"; } },
};

console.log("node", process.version, "| v8", process.versions.v8, "| lts", process.release.lts ?? "no");
for (const [name, fn] of Object.entries(checks)) {
  console.log((fn() === "undefined" ? "  ✗ " : "  ✓ ") + name.padEnd(26) + fn());
}

// VERIFIED output on v24.14.1:
//
//   node v24.14.1 | v8 13.6.233.17-node.44 | lts Krypton
//     ✗ Temporal                  undefined
//     ✗ Map.getOrInsert           undefined
//     ✗ Map.getOrInsertComputed   undefined
//     ✗ WeakMap.getOrInsert       undefined
//     ✗ Iterator.concat           undefined
//     ✓ Iterator.prototype.map    function
//     ✓ Object.groupBy            function
//     ✓ Map.groupBy               function
//     ✓ WebSocket                 function
//     ✗ EventSource               undefined
//     ✗ localStorage              undefined
//     ✓ node:sqlite               function
//
// ⚠ Note WebSocket is there and EventSource is not, which
// matters for Day 25: the client side of SSE needs
// --experimental-eventsource, while WebSocket does not.
//
// $ node --experimental-eventsource -p "typeof EventSource"
//   function                                   ← VERIFIED


// ── ⚠ Flagged is not shipped ────────────────────────────────
// $ node -p "typeof Temporal"
//   undefined
// $ node --harmony-temporal -p "typeof Temporal"
//   object                                     ← VERIFIED
//
// So the code is compiled into the V8 in your Node, and it is
// off. Three consequences worth knowing.
//
// A flagged API can change between releases without a
// deprecation cycle, because it never shipped.
// Your production start command grows a flag, which means
// every entry point needs it: your server, your migration
// script, your test runner, your one-off REPL debugging at
// 2am.
// And a library that feature-detects will take the fallback
// path anyway, so you get the flag's risk without its
// benefit.
//
// ✓ Fine:  a spike, a script, a benchmark
// ✗ Not:   a service other people depend on


// ── ⚠⚠ engines does nothing, measured ───────────────────────
// $ cat package.json
//   { "engines": { "node": ">=99.0.0" } }
//
// $ npm install
//   npm warn EBADENGINE Unsupported engine {
//   npm warn EBADENGINE   package: 'eng@1.0.0',
//   npm warn EBADENGINE   required: { node: '>=99.0.0' },
//   npm warn EBADENGINE   current: { node: 'v24.14.1', npm: '11.11.0' }
//   → exit 0                              ⚠ IT INSTALLED
//
// $ echo "engine-strict=true" > .npmrc
// $ npm install
//   npm error code EBADENGINE
//   npm error engine Not compatible with your version of node/npm
//   → exit 1                              ✓ now it fails
//
// VERIFIED both ways. So the advice to "add an engines field"
// produces a line of documentation, not a constraint, unless
// you also add engine-strict.
//
// ⚠ And even strict only checks whoever runs npm install. It
// does not stop someone running the server on a different
// version, which is the case you were worried about.


// ── ✓ Pinning that actually holds ───────────────────────────
// .nvmrc
//   24.14.1
//
// package.json
//   { "engines": { "node": ">=24 <25" } }
//
// .npmrc
//   engine-strict=true
//
// Dockerfile
//   FROM node:24-slim          ← Day 27's measured 351MB base
//
// .github/workflows/ci.yml
//   - uses: actions/setup-node@v4
//     with:
//       node-version-file: .nvmrc     ← ONE source of truth
//
// And Day 28's test, so the four cannot drift:
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("node version is pinned consistently", () => {
  const nvmrc = readFileSync(".nvmrc", "utf8").trim();
  const major = nvmrc.split(".")[0];
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const dockerfile = readFileSync("Dockerfile", "utf8");

  assert.match(pkg.engines.node, new RegExp(major), \`engines does not mention \${major}\`);
  assert.match(dockerfile, new RegExp(\`FROM node:\${major}\`), \`Dockerfile base is not node:\${major}\`);
});

test("a runtime check fails fast on the wrong major", () => {
  // Day 20's principle: fail at startup, loudly. This is the
  // only check that catches someone running the server on the
  // wrong version, because engines only checks installs.
  const wanted = Number(readFileSync(".nvmrc", "utf8").trim().split(".")[0]);
  const actual = Number(process.versions.node.split(".")[0]);
  assert.equal(actual, wanted);
});

// And in the application itself, one line at startup:
const wantedMajor = 24;
if (Number(process.versions.node.split(".")[0]) !== wantedMajor) {
  console.error(\`this application requires Node \${wantedMajor}, got \${process.version}\`);
  process.exit(1);
}
// ⚠ Better than engines, because it runs where it matters: in
// the process that is about to serve traffic.`,
      },
      keyTakeaways: [
        "Everything in this day is measured on Node 24.14.1, LTS \"Krypton\", V8 13.6.233.17. Anything from a release I do not have is unverified and labelled so.",
        "Even-numbered Node releases become LTS and odd-numbered ones never do, so an odd release reaches end of life sooner.",
        "That is a stronger reason to run LTS in production than stability is.",
        "Measured undefined on Node 24: `Temporal`, `Map.prototype.getOrInsert`, `getOrInsertComputed`, `WeakMap.prototype.getOrInsert`, `Iterator.concat`.",
        "Measured available: `Object.groupBy`, `Map.groupBy`, the iterator helpers, and `WebSocket` as a global.",
        "`EventSource` is not a global by default, which matters for Day 25's SSE client, and `--experimental-eventsource` provides it.",
        "So two lines of `node -p` settle any feature claim, and that habit beats memorising a feature list.",
        "`typeof Temporal` is undefined by default and an object under `--harmony-temporal`, so it is in V8 and switched off.",
        "A flagged feature can change without a deprecation cycle, and the flag has to reach every entry point including your test runner and your REPL.",
        "Measured: `engines.node` set to `>=99.0.0` produced a warning and `npm install` exited 0.",
        "With `engine-strict=true` in `.npmrc` the same install exited 1.",
        "So an `engines` field alone is documentation, not a constraint.",
        "Even strict only checks the machine running `npm install`, not whoever starts the server.",
        "Pin in `.nvmrc`, have CI read that same file, tag the Docker base image to match, and assert all of it in a test.",
        "Add a one-line major-version check at startup, which is the only check that runs in the process about to serve traffic.",
      ],
      commonMistakes: [
        "Planning work around a feature you read about instead of running `node -p \"typeof X\"` first.",
        "Assuming `Temporal` is available because articles describe it, when it is undefined without a flag.",
        "Assuming `Map.getOrInsert` or `Iterator.concat` exist on the current LTS. Both measured undefined.",
        "Treating a flagged feature as shipped, when it can change shape without a deprecation cycle.",
        "Forgetting the flag on a secondary entry point, so migrations or tests fail where the server works.",
        "Running an odd-numbered release in production, which reaches end of life sooner rather than later.",
        "Adding an `engines` field and believing it enforces anything. It exits 0 with a warning.",
        "Using `engine-strict` and thinking it covers runtime, when it only checks installs.",
        "Letting `.nvmrc`, `engines` and the Dockerfile base tag drift apart with nothing asserting they agree.",
        "No startup version check, so the wrong runtime is discovered by a syntax error in production.",
      ],
      quiz: [
        {
          question: "What did `typeof Temporal` return on Node 24.14.1?",
          options: [
            "\"object\"",
            "`undefined` by default, and `object` under `--harmony-temporal`, so it is in V8 and switched off",
            "It threw",
            "\"function\"",
          ],
          correctIndex: 1,
          explanation:
            "Behind a flag is not shipped: a flagged API can change without a deprecation cycle and the flag must reach every entry point.",
        },
        {
          question: "Which of these were measured as undefined on the current LTS?",
          options: [
            "`Object.groupBy` and `Map.groupBy`",
            "`Temporal`, `Map.prototype.getOrInsert`, `getOrInsertComputed`, `WeakMap.prototype.getOrInsert` and `Iterator.concat`",
            "The iterator helpers",
            "`WebSocket`",
          ],
          correctIndex: 1,
          explanation:
            "`Object.groupBy`, `Map.groupBy`, the iterator helpers and `WebSocket` were all present. Two lines of `node -p` settle it.",
        },
        {
          question: "What does an `engines` field actually do?",
          options: [
            "Blocks the install",
            "Prints a warning and exits 0. Only `engine-strict=true` makes it fail, and even then it only checks the machine running `npm install`.",
            "Prevents starting the app",
            "Nothing at all",
          ],
          correctIndex: 1,
          explanation:
            "Measured both ways with `>=99.0.0`. The check that catches a wrong runtime is one line at startup.",
        },
        {
          question: "Why prefer an even-numbered Node release in production?",
          options: [
            "They are faster",
            "Only even-numbered lines become LTS, so an odd-numbered release reaches end of life sooner",
            "They have more features",
            "Odd releases are unstable",
          ],
          correctIndex: 1,
          explanation:
            "So Node 25 is not a smaller upgrade than 26, it is a shorter-lived line.",
        },
        {
          question: "Why is `EventSource` worth checking specifically?",
          options: [
            "It is deprecated",
            "It is not a global by default, unlike `WebSocket`, so Day 25's SSE client needs `--experimental-eventsource`",
            "It replaced WebSocket",
            "It only works in browsers",
          ],
          correctIndex: 1,
          explanation:
            "A good example of why a per-feature check beats a general assumption about \"web APIs in Node\".",
        },
      ],
    },
    {
      id: "temporal-and-dates",
      title: "Temporal, and what Date gets wrong",
      durationMinutes: 13,
      explanation:
        "## Temporal\n\n<b>Temporal</b> (a date and time API designed to replace `Date`).\n\n> Available on Node 24 only under `--harmony-temporal`, as measured last lesson. So treat everything here as <b>learn it now, ship it when it lands</b>. The reason to learn it before you can use it is that its <b>concepts</b> are how you should already be thinking about dates, and most date bugs come from not having those distinctions.\n\n---\n\n## The four types, and why four\n\n<b>`Temporal.PlainDate`</b> (a calendar date with no time and no zone). Verified:\n\n```text\nTemporal.PlainDate.from(\"2026-09-07\")   → 2026-09-07\n\"hour\" in that object                    → false\n```\n\n> A birthday is not a moment. Somebody born on 7 September was born on 7 September everywhere, and storing that as a timestamp is how it becomes the 6th for users in one timezone.\n\n<b>`Temporal.Instant`</b> (an exact point on the global timeline). For \"when did this happen\".\n\n<b>`Temporal.ZonedDateTime`</b> (a time in a specific zone). Verified:\n\n```text\n2026-09-07T09:00[Asia/Tokyo]\n  epochMilliseconds  1788739200000\n  in America/New_York  2026-09-06T20:00:00-04:00\n```\n\n> Same instant, and it is <b>the previous day</b> in New York. That is why \"the 9am report\" is a zoned time and not a timestamp.\n\n<b>`Temporal.Duration`</b> (an amount of time). `PT3H`, `.total(\"minutes\")` → 180.\n\n---\n\n## Why +1 day is not +24 hours\n\nVerified with `America/New_York`:\n\n```text\nspring forward, starting 2026-03-07T12:00\n  + 1 day     2026-03-08T12:00:00-04:00\n  + 24 hours  2026-03-08T13:00:00-04:00\n  the day was 23 hours long\n\nfall back, starting 2026-10-31T12:00\n  + 1 day     2026-11-01T12:00:00-05:00\n  + 24 hours  2026-11-01T11:00:00-05:00\n  the day was 25 hours long\n```\n\n> A day is not a fixed length. Twice a year it is 23 or 25 hours, and a subscription renewal that adds 24 hours drifts by an hour each time and eventually crosses midnight into the wrong day.\n>\n> Temporal makes you say which one you meant. `Date` lets you write `+ 86400000` and find out in March.\n\n---\n\n## The `Date` bugs, all verified\n\n```text\nnew Date(\"2026-09-07\")        → 2026-09-07T00:00:00.000Z   UTC\nnew Date(\"2026-09-07T00:00\")  → 2026-09-07T04:00:00.000Z   LOCAL\n```\n\n> Two nearly identical strings, four hours apart. The date-only form is parsed as UTC and the date-time form as local, which is in the specification and surprises everybody.\n\n```text\nnew Date(2026, 9, 7)          → Wed Oct 07 2026    months are 0-indexed\nJan 31, then setMonth(+1)     → 2026-03-03         overflowed through Feb\n```\n\n> And `Date` is <b>mutable</b>. Verified: passing one to a function that calls `setDate` changes the caller's value. Every Temporal type is immutable, which removes that entire category of bug.",
      diagram: `Temporal

    available on Node 24 only under
    --harmony-temporal.

    → LEARN IT NOW, SHIP IT WHEN IT LANDS.

    the reason to learn it before you can use it:
    its CONCEPTS are how you should already be
    thinking, and most date bugs come from not
    having those distinctions.


The four types, and why four. VERIFIED.

    PlainDate      a calendar date, no time, no
                   zone

      Temporal.PlainDate.from("2026-09-07")
        → 2026-09-07
      "hour" in it   → false

      ⚠ A BIRTHDAY IS NOT A MOMENT.

        born on 7 September = 7 September
        EVERYWHERE.

        storing it as a timestamp is how it
        becomes the 6th for some users.

    Instant        an exact point on the global
                   timeline
                   → "when did this happen"

    ZonedDateTime  a time in a specific zone

      2026-09-07T09:00[Asia/Tokyo]
        epochMs            1788739200000
        in America/New_York
          2026-09-06T20:00:00-04:00

      ⚠ same instant, and it is THE PREVIOUS DAY
        in New York.

        → "the 9am report" is a ZONED TIME, not a
          timestamp

    Duration       an amount of time
                   PT3H, .total("minutes") = 180


⚠⚠ Why +1 day is not +24 hours. VERIFIED.

    America/New_York, spring forward:

      start       2026-03-07T12:00:00-05:00
      + 1 day     2026-03-08T12:00:00-04:00
      + 24 hours  2026-03-08T13:00:00-04:00

      THE DAY WAS 23 HOURS LONG

    fall back:

      start       2026-10-31T12:00:00-04:00
      + 1 day     2026-11-01T12:00:00-05:00
      + 24 hours  2026-11-01T11:00:00-05:00

      THE DAY WAS 25 HOURS LONG

    → a day is NOT a fixed length.

      twice a year it is 23 or 25 hours.

      a renewal that adds 24 hours drifts an hour
      each time and eventually crosses midnight
      into the WRONG DAY.

    Temporal makes you SAY WHICH ONE YOU MEANT.
    Date lets you write + 86400000 and find out in
    March.


⚠⚠ The Date bugs. All verified.

  new Date("2026-09-07")
    → 2026-09-07T00:00:00.000Z      UTC
  new Date("2026-09-07T00:00")
    → 2026-09-07T04:00:00.000Z      LOCAL

    two nearly identical strings, FOUR HOURS
    APART.

    the date-only form is parsed as UTC and the
    date-time form as LOCAL. in the spec, and it
    surprises everybody.

  new Date(2026, 9, 7)  → Wed Oct 07 2026
                          months are 0-INDEXED

  Jan 31, setMonth(+1)  → 2026-03-03
                          overflowed through Feb

  and Date is MUTABLE:
    passing one to a function that calls setDate
    CHANGES THE CALLER'S VALUE.

    → every Temporal type is immutable, which
      removes that whole category of bug`,
      codeExample: {
        title: "The DST measurement, and the Date traps",
        code: `// ── ⚠⚠ +1 day is not +24 hours. VERIFIED. ──────────────────
// $ node --harmony-temporal
const start = Temporal.ZonedDateTime.from("2026-03-07T12:00[America/New_York]");

console.log(start.toString());
console.log(start.add({ days: 1 }).toString());
console.log(start.add({ hours: 24 }).toString());
console.log(start.until(start.add({ days: 1 })).total("hours"));

// VERIFIED, spring forward:
//   2026-03-07T12:00:00-05:00[America/New_York]
//   2026-03-08T12:00:00-04:00[America/New_York]   ← +1 day
//   2026-03-08T13:00:00-04:00[America/New_York]   ← +24 hours
//   23                                            ← the day's length
//
// VERIFIED, fall back (2026-10-31):
//   2026-10-31T12:00:00-04:00[America/New_York]
//   2026-11-01T12:00:00-05:00[America/New_York]   ← +1 day
//   2026-11-01T11:00:00-05:00[America/New_York]   ← +24 hours
//   25
//
// Two hours of difference across the year, in opposite
// directions. So:
//
// ✗ nextRenewal = new Date(now.getTime() + 30 * 86400000)
//   Adds exactly 30 * 24 hours. A monthly subscription drifts,
//   and a renewal set for 00:30 local eventually lands at
//   23:30 the previous day, which is the wrong billing period.
//
// ✓ nextRenewal = start.add({ months: 1 })
//   Same local time, next month, with the calendar handling
//   short months and DST.


// ── The four types, and which question each answers ─────────
// "what day is their birthday?"           PlainDate
// "when exactly did this order happen?"   Instant
// "when does the 9am report run?"         ZonedDateTime
// "how long is the trial?"                Duration

// ⚠ PlainDate has no time, on purpose. VERIFIED:
const birthday = Temporal.PlainDate.from("2026-09-07");
console.log(birthday.toString());   // 2026-09-07
console.log("hour" in birthday);    // false
//
// Which is the point. Store a birthday as a timestamp and a
// user in Tokyo sees the 6th or the 8th depending on how you
// formatted it. There is no correct timezone for a birthday,
// so the type refuses to have one.

// ⚠ ZonedDateTime, and why "9am" is not a timestamp. VERIFIED:
const tokyo = Temporal.ZonedDateTime.from("2026-09-07T09:00[Asia/Tokyo]");
console.log(tokyo.epochMilliseconds);                       // 1788739200000
console.log(tokyo.withTimeZone("America/New_York").toString());
//   2026-09-06T20:00:00-04:00[America/New_York]
//
// The SAME INSTANT is the previous day in New York. So a
// "daily 9am report" stored as an instant runs at the wrong
// local time for half the year, and a report scheduled for
// "9am for every customer" is not one instant at all.


// ── ⚠⚠ The Date parsing trap. VERIFIED under TZ=America/New_York ─
console.log(new Date("2026-09-07").toISOString());
//   2026-09-07T00:00:00.000Z        ← parsed as UTC
console.log(new Date("2026-09-07T00:00").toISOString());
//   2026-09-07T04:00:00.000Z        ← parsed as LOCAL
//
// Four hours apart, from two strings that look the same. The
// date-only form is UTC and the date-time form is local, per
// the specification.
//
// Where this bites: a date picker sends "2026-09-07", your
// server parses it, and every date is off by one for users
// west of UTC. It is the most common date bug in web
// applications and it is invisible in a UTC-configured CI.

// ✓ Test in a non-UTC timezone, deliberately:
//   $ TZ=America/New_York node --test
//   $ TZ=Asia/Kolkata node --test        (a :30 offset)
//   $ TZ=Pacific/Chatham node --test     (a :45 offset)
//
// A suite that only ever runs in UTC cannot catch any of this.


// ── The other verified Date surprises ───────────────────────
console.log(new Date(2026, 9, 7).toDateString());
//   Wed Oct 07 2026            ⚠ month 9 is OCTOBER
//
const m = new Date("2026-01-31");
m.setMonth(m.getMonth() + 1);
console.log(m.toISOString().slice(0, 10));
//   2026-03-03                 ⚠ Jan 31 + 1 month, via Feb 31
//
// Temporal's equivalent asks you to choose:
Temporal.PlainDate.from("2026-01-31").add({ months: 1 });
//   → 2026-02-28   (constrain, the default)
Temporal.PlainDate.from("2026-01-31").add({ months: 1 }, { overflow: "reject" });
//   → throws, which is right if silently moving the date is a
//     billing error


// ── ⚠ Date is mutable, verified ─────────────────────────────
const original = new Date("2026-09-07T00:00:00Z");
const alias = original;
alias.setDate(1);
console.log(original.toISOString().slice(0, 10));
//   2026-09-02                 ⚠ the ORIGINAL changed
//
// So this function has a bug that its signature hides:
function startOfMonth(d) {
  d.setDate(1);                // ⚠ mutates the caller's Date
  return d;
}
// ✓ The defensive version everyone has to remember:
function startOfMonthSafe(d) {
  const copy = new Date(d);
  copy.setDate(1);
  return copy;
}
// ✓ Every Temporal type is immutable, so add(), with() and
//   subtract() all return new values and this category
//   disappears rather than being defended against.


// ── Until it ships: what to do now ──────────────────────────
// The concepts apply to the code you have today.
//
// ✓ Store the right THING, which is a schema decision:
//     an instant            timestamptz
//     a calendar date        date          ← not timestamp
//     a zoned time           timestamptz + a tz column
//     a duration             an interval, or seconds as an integer
//
// ⚠ That "calendar date as timestamp" row is the one to fix
//   first. It is the same off-by-one as the parsing trap, and
//   it is baked into your data rather than your code.
//
// ✓ Never compute with 86400000. Use a library that does
//   calendar arithmetic, or ask the database:
//     SELECT renews_at + interval '1 month' FROM subscriptions
//
// ✓ Keep the boundary explicit, which is Day 19's job:
const Body = z.object({
  birthday: z.string().regex(/^\\d{4}-\\d{2}-\\d{2}$/),   // a DATE
  scheduledAt: z.string().datetime({ offset: true }),  // an INSTANT
  timeZone: z.string(),                                 // for a zoned time
});
// Two different types in the request, validated differently,
// stored differently. That distinction is the whole lesson,
// and you can apply it today with no flag.`,
      },
      keyTakeaways: [
        "Temporal is available on Node 24 only under `--harmony-temporal`, so learn it now and ship it when it lands.",
        "The reason to learn it early is that its concepts are how you should already think about dates, and most date bugs come from lacking those distinctions.",
        "`PlainDate` has no hour, verified. A birthday is not a moment, and storing one as a timestamp makes it the wrong day for some users.",
        "Verified: 09:00 in Asia/Tokyo is 20:00 the previous day in America/New_York, which is why \"the 9am report\" is a zoned time.",
        "Verified across spring forward: +1 day gave 12:00 and +24 hours gave 13:00, because that day was 23 hours long.",
        "Verified across fall back: +1 day gave 12:00 and +24 hours gave 11:00, because that day was 25 hours long.",
        "So a renewal that adds 24 hours drifts and eventually crosses midnight into the wrong billing period.",
        "Verified: `new Date(\"2026-09-07\")` parses as UTC and `new Date(\"2026-09-07T00:00\")` parses as local, four hours apart.",
        "That is the most common date bug in web applications and it is invisible in a UTC-configured CI.",
        "So run part of your suite under `TZ=America/New_York`, and a `:30` or `:45` offset zone too.",
        "Verified: `new Date(2026, 9, 7)` is October, and January 31 plus one month via `setMonth` gives March 3.",
        "Temporal makes you choose: `constrain` gives February 28, and `overflow: \"reject\"` throws, which is right for billing.",
        "Verified: `Date` is mutable, so passing one to a function that calls `setDate` changes the caller's value.",
        "Every Temporal type is immutable, so that category of bug disappears instead of being defended against.",
        "You can apply all of this today: store a calendar date as `date` and not `timestamp`, never compute with 86400000, and validate dates and instants differently at the boundary.",
      ],
      commonMistakes: [
        "Shipping `Temporal` behind `--harmony-temporal` in a service, where a flagged API can change without a deprecation cycle.",
        "Storing a birthday or a due date as a timestamp, which makes it the wrong day for users in some zones.",
        "Storing a recurring local time as an instant, so it runs an hour off for half the year.",
        "Adding 86400000 for \"a day\", which is wrong twice a year by an hour in each direction.",
        "Adding 30 days for \"a month\", which drifts every cycle.",
        "Mixing `new Date(\"2026-09-07\")` and `new Date(\"2026-09-07T00:00\")`, which differ by the local offset.",
        "Running the whole test suite in UTC, where every timezone bug passes.",
        "Forgetting months are zero-indexed in the `Date` constructor.",
        "Using `setMonth` on January 31 and getting March, with no error.",
        "Passing a `Date` to a function that mutates it, and finding the caller's value changed.",
        "Treating \"9am for every customer\" as a single instant, when it is one zoned time per customer.",
      ],
      quiz: [
        {
          question: "Starting at 2026-03-07T12:00 in America/New_York, what did +1 day and +24 hours give?",
          options: [
            "Both 12:00 the next day",
            "12:00 and 13:00 respectively, because that day was 23 hours long across spring forward",
            "Both 13:00",
            "11:00 and 12:00",
          ],
          correctIndex: 1,
          explanation:
            "Across fall back the same comparison gave 12:00 and 11:00, because that day was 25 hours long.",
        },
        {
          question: "What is the difference between `new Date(\"2026-09-07\")` and `new Date(\"2026-09-07T00:00\")`?",
          options: [
            "None",
            "The first parses as UTC and the second as local, so under America/New_York they were four hours apart",
            "The second is invalid",
            "The first is invalid",
          ],
          correctIndex: 1,
          explanation:
            "It is the most common date bug in web applications, and a UTC-only test suite cannot catch it.",
        },
        {
          question: "Why does `Temporal.PlainDate` have no hour?",
          options: [
            "It is unfinished",
            "A calendar date is not a moment. A birthday is the same date everywhere, so there is no correct timezone for it.",
            "For performance",
            "It does have one",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `\"hour\" in birthday` is false. Store it as a `date` column, not a `timestamp`.",
        },
        {
          question: "What did `new Date(\"2026-01-31\")` then `setMonth(getMonth() + 1)` produce?",
          options: [
            "February 28",
            "March 3, because it overflowed through a non-existent February 31, with no error",
            "An error",
            "February 31",
          ],
          correctIndex: 1,
          explanation:
            "Temporal makes you choose: `constrain` gives February 28, and `overflow: \"reject\"` throws, which is right for billing.",
        },
        {
          question: "What did passing a `Date` to a function calling `setDate` do to the caller's value?",
          options: [
            "Nothing, Date is immutable",
            "It changed it, because `Date` is mutable. Every Temporal type is immutable, so the whole category disappears.",
            "It threw",
            "It returned a copy",
          ],
          correctIndex: 1,
          explanation:
            "Verified. That is why every `Date` helper has to remember to copy first.",
        },
        {
          question: "What can you apply today without any flag?",
          options: [
            "Nothing until Temporal ships",
            "Store a calendar date as `date` not `timestamp`, never compute with 86400000, and validate dates and instants differently at the boundary",
            "Only the immutability",
            "Only the DST handling",
          ],
          correctIndex: 1,
          explanation:
            "The concepts are the lesson. The API is how you will express them later.",
        },
      ],
    },
    {
      id: "deprecations-and-typescript",
      title: "Deprecations, removals, and Node's TypeScript",
      durationMinutes: 12,
      explanation:
        "## Deprecation\n\n<b>Deprecation</b> (an API that still works and is on its way out). <b>Removal</b> (it is gone).\n\n> The gap between those two is where upgrades go wrong, and the way to see it is to check rather than assume.\n\n---\n\n## Two claims I could not confirm\n\nMeasured on Node 24.14.1:\n\n```text\nrequire(\"_stream_readable\")   loaded: function    no warning\nrequire(\"_stream_writable\")   loaded              no warning\nrequire(\"node:_stream_readable\")   fails\n\nres.writeHeader   typeof: function\nres.writeHeader(200, {...})  → status 200, header set\n  with --pending-deprecation → no warning at all\n```\n\n> The draft this day is based on described both as removed. On the current LTS the legacy stream modules still load, and `res.writeHeader` still works and does not even warn.\n>\n> The advice is still right, and the reason is different from \"it is removed\": these are undocumented or legacy surfaces with no deprecation warning, which means <b>you will get no notice before they go</b>. Use `node:stream` and `writeHead` because the supported API is the one that gets a deprecation cycle.\n\n---\n\n## What actually does warn\n\n```text\nnew Buffer(4)      DEP0005  Buffer() is deprecated ...\nurl.parse(\"...\")   DEP0169  behavior is not standardized and\n                            prone to errors that have security\n                            implications ... CVEs are not issued\n```\n\n> Read that second one twice. `url.parse` is not merely deprecated, the deprecation text says <b>security issues in it will not get CVEs</b>. Use `new URL()`.\n>\n> And run `node --pending-deprecation` in CI occasionally: it surfaces deprecations that are silent by default.\n\n---\n\n## Node's TypeScript, and its exact boundary\n\n<b>Type stripping</b> (removing type syntax without transforming anything).\n\n`process.features.typescript` is `\"strip\"` on Node 24. Verified, strip-only mode <b>fails</b> on:\n\n```text\nenum Role { Admin }        ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX\nnamespace N { }            ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX\nconstructor(private db)    ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX\n```\n\n> All three work under `--experimental-transform-types`. So the boundary is not \"TypeScript works\", it is <b>syntax that erases works, syntax that generates code does not</b>.\n\n---\n\n## And the part that matters most\n\n```text\nconst n: number = \"this is a string\";\n$ node bad.ts\nnode ran it anyway: this is a string\n```\n\n> <b>Node does not typecheck.</b> It deletes the types and runs. So `node file.ts` is a convenience, not a build step, and `npx tsc --noEmit` is still the thing that catches errors.\n>\n> Which is why \"Node runs TypeScript now, I do not need tooling\" is the wrong conclusion. It removed the <b>run</b> step, not the <b>check</b> step.\n\n---\n\n## One more correction\n\n> The draft lists `module.register()` as an example of deprecation. It is not: `module.register`, `module.enableCompileCache` and `module.stripTypeScriptTypes` are all present functions on Node 24, and `register` is the <b>current</b> loader-hooks API that replaced the older one.",
      diagram: `Deprecation vs removal

    DEPRECATED  still works, on its way out
    REMOVED     gone

    the gap between them is where upgrades go
    wrong, and the way to see it is to CHECK
    rather than assume.


⚠⚠ Two claims I could NOT confirm

    MEASURED on Node 24.14.1:

      require("_stream_readable")
        loaded: function      NO WARNING
      require("_stream_writable")
        loaded                NO WARNING
      require("node:_stream_readable")
        fails

      res.writeHeader          typeof: function
      res.writeHeader(200,{}) → status 200, header
                                set
        with --pending-deprecation
                              → NO WARNING AT ALL

    the draft described both as REMOVED.

    on the current LTS the legacy stream modules
    still load, and writeHeader still works and
    does not even warn.

    ✓ the advice is still right, for a DIFFERENT
      reason:

      these are undocumented / legacy surfaces
      with NO deprecation warning.

      → YOU WILL GET NO NOTICE BEFORE THEY GO.

      use node:stream and writeHead, because THE
      SUPPORTED API IS THE ONE THAT GETS A
      DEPRECATION CYCLE.


What actually DOES warn

  new Buffer(4)     DEP0005  Buffer() is deprecated
  url.parse("...")  DEP0169  behavior is not
                    standardized and prone to
                    errors that have SECURITY
                    IMPLICATIONS ...
                    CVEs ARE NOT ISSUED

  ⚠ read the second twice.

    url.parse is not merely deprecated. the text
    says SECURITY ISSUES IN IT WILL NOT GET CVEs.

    → use new URL()

  ✓ run node --pending-deprecation in CI
    occasionally: it surfaces deprecations that
    are SILENT by default


Node's TypeScript, and its exact boundary

    process.features.typescript = "strip"

    VERIFIED, strip-only mode FAILS on:

      enum Role { Admin }
      namespace N { }
      constructor(private db)

        all three: ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX

    all three WORK under
    --experimental-transform-types.

    → the boundary is not "TypeScript works".

      it is SYNTAX THAT ERASES works.
         SYNTAX THAT GENERATES CODE does not.


⚠⚠ And the part that matters most

    const n: number = "this is a string";

    $ node bad.ts
      node ran it anyway: this is a string

    NODE DOES NOT TYPECHECK.

    it deletes the types and runs.

    → node file.ts is a CONVENIENCE, not a build
      step

    → npx tsc --noEmit is still what catches
      errors

    so "Node runs TypeScript now, I don't need
    tooling" is the wrong conclusion.

    it removed the RUN step, not the CHECK step.


One more correction

    the draft lists module.register() as an
    example of DEPRECATION.

    it is not:

      module.register            function
      module.enableCompileCache  function
      module.stripTypeScriptTypes function

    and register is the CURRENT loader-hooks API
    that replaced the older one.`,
      codeExample: {
        title: "Checking deprecations, and where Node's TypeScript stops",
        code: `// ── ⚠⚠ The two "removed" APIs, measured ─────────────────────
// $ node -e "const m = require('_stream_readable'); console.log('loaded:', typeof m)"
//   loaded: function                          ← still there
//
// $ node -e "require('_stream_writable'); console.log('loaded')"
//   loaded                                    ← still there
//
// $ node --pending-deprecation -e "require('_stream_readable')"
//   (no output)                               ← NO WARNING
//
// $ node -e "require('node:_stream_readable')"
//   (fails)                                   ← the node: prefix
//                                                does not work
//
// And writeHeader:
// $ node -e "... r.writeHeader(200, {'x':'1'}); ..."
//   status 200 hdr x= 1                       ← works fine
// $ node --pending-deprecation -e "... r.writeHeader(200) ..."
//   (no deprecation output)                   ← no warning
//
// So on Node 24 LTS neither is removed and neither warns.
//
// ⚠ That is WORSE than being deprecated, not better. A
// deprecated API gives you a warning you can grep for in CI.
// These give you nothing, so the day they are removed is the
// day you find out.
//
// ✓ import { Readable, Writable } from "node:stream";
// ✓ res.writeHead(200, { "content-type": "application/json" });


// ── What genuinely warns, and one that matters ───────────────
// $ node -e "new Buffer(4)"
//   (node:47918) [DEP0005] DeprecationWarning: Buffer() is
//   deprecated due to security and usability issues. Please
//   use Buffer.alloc(), Buffer.allocUnsafe(), or
//   Buffer.from() instead.
//
// $ node --pending-deprecation -e "require('node:url').parse('http://a.com/b')"
//   (node:51072) [DEP0169] DeprecationWarning: \`url.parse()\`
//   behavior is not standardized and prone to errors that
//   have security implications. Use the WHATWG URL API
//   instead. CVEs are not issued for \`url.parse()\`
//   vulnerabilities.
//
// ⚠⚠ "CVEs are not issued." That is Node telling you a
// parsing difference in url.parse is not going to be treated
// as a security bug, so if your auth or your redirect
// allowlist depends on it, you are on your own.
//
// ✗ const { hostname } = url.parse(redirectTarget);
//   if (hostname === "example.com") redirect(redirectTarget);
//
// ✓ const target = new URL(redirectTarget);
//   if (target.hostname === "example.com" && target.protocol === "https:") ...
//   Day 18's rule: an allowlist, checked on a parsed value
//   from the standardised parser.


// ── ✓ Make deprecations visible in CI ───────────────────────
// package.json
//   {
//     "scripts": {
//       "test": "node --test",
//       "test:deprecations": "node --pending-deprecation --throw-deprecation --test"
//     }
//   }
//
// --pending-deprecation surfaces the quiet ones.
// --throw-deprecation turns each into an exception with a
// stack, so you find the call site instead of a message with
// no location.
//
// ⚠ Run it as a separate, non-blocking job. Making it
// blocking means a dependency's deprecated call breaks your
// deploy, which is somebody else's code and not today's
// problem.
//
// Or catch them without failing:
process.on("warning", (warning) => {
  if (warning.name === "DeprecationWarning") {
    log().warn({ code: warning.code, msg: warning.message, stack: warning.stack }, "deprecation");
  }
});
// Day 21's structured logs, so the deprecations show up in
// the same place as everything else and you can count them
// over time.


// ── ⚠⚠ Where Node's TypeScript stops. Measured. ─────────────
// $ node -p "process.features.typescript"
//   strip
//
// ✓ Works, because types simply erase:
//   type User = { id: number; name: string };
//   const u: User = { id: 1, name: "a" };
//   $ node strip.ts
//     type stripping works: a
//
// ✗ Fails, because these GENERATE runtime code:
//
//   enum Role { Admin, User }
//   $ node enum.ts
//     SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:
//     TypeScript enum is not supported in strip-only mode
//
//   class Svc { constructor(private db: string) {} }
//   $ node param.ts
//     SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:
//     TypeScript parameter property is not supported in
//     strip-only mode
//
//   namespace N { export const x = 1; }
//   $ node ns.ts
//     SyntaxError [ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX]:
//     TypeScript namespace declaration is not supported in
//     strip-only mode
//
// All three work with the transform flag. VERIFIED:
//   $ node --experimental-transform-types enum.ts   → 0
//   $ node --experimental-transform-types param.ts  → pg
//   $ node --experimental-transform-types ns.ts     → 1
//
// ⚠ So the rule is precise: syntax that ERASES works, syntax
// that GENERATES CODE needs the transform. And that is a
// useful constraint rather than a limitation, because
// erasable-only TypeScript is portable to every runner.
//
// ✓ Adopt it deliberately in tsconfig, so your editor tells
//   you at write time instead of Node telling you at run time:
//   {
//     "compilerOptions": {
//       "erasableSyntaxOnly": true,
//       "verbatimModuleSyntax": true,
//       "module": "nodenext",
//       "noEmit": true
//     }
//   }
//
// ✓ And write the replacements, which are better anyway:
//   ✗ enum Role { Admin = "admin", User = "user" }
//   ✓ const Role = { Admin: "admin", User: "user" } as const;
//     type Role = typeof Role[keyof typeof Role];
//
//   ✗ constructor(private db: Db) {}
//   ✓ constructor(db: Db) { this.db = db; }
//     ...which is also Day 29's explicit dependency.


// ── ⚠⚠ Node does not typecheck. Measured. ───────────────────
// $ cat bad.ts
//   const n: number = "this is a string";
//   console.log("node ran it anyway:", n);
//
// $ node bad.ts
//   node ran it anyway: this is a string       ← VERIFIED
//
// No error. No warning. It stripped the annotation and ran.
//
// So the conclusion to NOT draw is "Node runs TypeScript, so
// I can drop tsc". Node removed the RUN step. The CHECK step
// is still yours:
//
//   "scripts": {
//     "typecheck": "tsc --noEmit",     ← this is the real one
//     "dev": "node --watch src/server.ts",
//     "start": "node src/server.ts"
//   }
//
// And in CI, before the tests, per Day 28's ordering.


// ── The module APIs, which are current and not deprecated ───
// $ node -e "const m=require('node:module'); console.log(typeof m.register, typeof m.enableCompileCache, typeof m.stripTypeScriptTypes)"
//   function function function                ← all present
//
// module.register() is the CURRENT loader-hooks API. It
// replaced the older require.extensions and the earlier
// --loader flag, so it is the destination of a deprecation,
// not an example of one.
//
// Useful ones from that module:
import { enableCompileCache, stripTypeScriptTypes } from "node:module";

enableCompileCache();
// Caches V8 compilation between runs. I measured this and did
// NOT get a clear improvement on a small app (about 50ms
// either way), so measure yours rather than taking it on
// faith. It is documented as helping larger applications.

const js = stripTypeScriptTypes("const x: number = 1;");
// The same stripping Node does internally, exposed, which is
// handy for a tool that needs to load .ts without a compiler.`,
      },
      keyTakeaways: [
        "Verified: `_stream_readable` and `_stream_writable` still load on Node 24 LTS and emit no warning, even with `--pending-deprecation`.",
        "Verified: `res.writeHeader` still works, sets the header, and emits no deprecation warning.",
        "So the draft's claim that both were removed does not hold on the current LTS.",
        "The advice is still right for a different reason: these surfaces have no deprecation warning, so you get no notice before they go.",
        "Use `node:stream` and `writeHead` because the supported API is the one that gets a deprecation cycle.",
        "`new Buffer()` does warn, with DEP0005.",
        "`url.parse` warns with DEP0169, and the text says CVEs are not issued for its vulnerabilities, so use `new URL()`.",
        "That matters most where a redirect allowlist or auth check parses a URL.",
        "Run `node --pending-deprecation --throw-deprecation` as a separate non-blocking CI job to find silent deprecations with a stack.",
        "Or listen for `process.on(\"warning\")` and log deprecations through Day 21's structured logger.",
        "`process.features.typescript` is `\"strip\"`, and strip-only mode fails on `enum`, `namespace` and parameter properties with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`.",
        "All three work under `--experimental-transform-types`, so the boundary is syntax that erases versus syntax that generates code.",
        "Set `erasableSyntaxOnly` in tsconfig so your editor catches it at write time rather than Node at run time.",
        "Verified: `const n: number = \"a string\"` runs fine under `node bad.ts`. Node does not typecheck.",
        "So `node file.ts` removed the run step, not the check step, and `tsc --noEmit` is still required.",
        "`module.register`, `enableCompileCache` and `stripTypeScriptTypes` are all current functions, and `register` is the replacement API rather than a deprecated one.",
      ],
      commonMistakes: [
        "Assuming an API is removed because a changelog summary said so, rather than checking your runtime.",
        "Treating \"no deprecation warning\" as safe, when an undocumented surface gives no notice at all.",
        "Using `url.parse` in a redirect or auth check, where the deprecation text says CVEs are not issued.",
        "Keeping `new Buffer()`, which warns with DEP0005 for security and usability reasons.",
        "Never running `--pending-deprecation`, so the quiet deprecations stay invisible until removal.",
        "Making the deprecation job blocking, so a dependency's deprecated call stops your deploy.",
        "Using `enum`, `namespace` or parameter properties and being surprised that `node file.ts` fails.",
        "Adding `--experimental-transform-types` to work around that, rather than writing erasable syntax.",
        "Not setting `erasableSyntaxOnly`, so the failure appears at run time instead of in the editor.",
        "Concluding that Node running `.ts` means `tsc --noEmit` is unnecessary. Node does not typecheck at all.",
        "Believing `module.register()` is deprecated, when it is the current loader-hooks API.",
        "Enabling the compile cache and assuming a speedup without measuring, which did not clearly show one here.",
      ],
      quiz: [
        {
          question: "What happened when `require(\"_stream_readable\")` was tested on Node 24 LTS?",
          options: [
            "It threw a module-not-found error",
            "It loaded successfully with no deprecation warning, even under `--pending-deprecation`",
            "It printed a removal notice",
            "It required the `node:` prefix",
          ],
          correctIndex: 1,
          explanation:
            "Not removed. And no warning is worse than a deprecation, because you get no notice before it goes.",
        },
        {
          question: "Why is DEP0169 on `url.parse` worth more than a normal deprecation?",
          options: [
            "It is louder",
            "The text says CVEs are not issued for its vulnerabilities, so a parsing difference in your auth or redirect check is your problem",
            "It will be removed sooner",
            "It affects performance",
          ],
          correctIndex: 1,
          explanation:
            "Use `new URL()` and check hostname and protocol against an allowlist, per Day 18.",
        },
        {
          question: "Which TypeScript syntax fails under Node's strip-only mode?",
          options: [
            "Type annotations and interfaces",
            "`enum`, `namespace` and constructor parameter properties, all with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`",
            "Generics",
            "All TypeScript",
          ],
          correctIndex: 1,
          explanation:
            "Those generate runtime code rather than erasing. They work under `--experimental-transform-types`.",
        },
        {
          question: "What did `node bad.ts` do with `const n: number = \"this is a string\"`?",
          options: [
            "Refused to run",
            "Printed the string, because Node strips types and does not typecheck at all",
            "Warned then ran",
            "Coerced it to a number",
          ],
          correctIndex: 1,
          explanation:
            "Node removed the run step, not the check step. `tsc --noEmit` is still what finds type errors.",
        },
        {
          question: "What is the status of `module.register()`?",
          options: [
            "Deprecated",
            "A current function and the loader-hooks API that replaced the older approach, so it is the destination of a deprecation rather than an example",
            "Removed",
            "Experimental only",
          ],
          correctIndex: 1,
          explanation:
            "`module.enableCompileCache` and `module.stripTypeScriptTypes` are present too.",
        },
        {
          question: "How should you find silent deprecations?",
          options: [
            "Read the changelog",
            "Run `node --pending-deprecation --throw-deprecation` as a separate non-blocking CI job, which gives a stack pointing at the call site",
            "Grep for API names",
            "Wait for them to break",
          ],
          correctIndex: 1,
          explanation:
            "Non-blocking, because a dependency's deprecated call is somebody else's code and should not stop your deploy.",
        },
      ],
    },
    {
      id: "web-apis-and-upgrading",
      title: "Web APIs in Node, and upgrading on purpose",
      durationMinutes: 12,
      explanation:
        "## Web APIs in Node are not browser APIs\n\n<b>Undici</b> (the HTTP client that powers Node's `fetch`).\n\n> So `fetch`, `Request`, `Response`, `Headers` and `WebSocket` are all globals, and you do not need `axios` or `node-fetch` for ordinary requests. `EventSource` is <b>not</b> a global, which matters for Day 25.\n\n---\n\n## localStorage, and why it is the clearest example\n\n```text\nnode -p \"typeof localStorage\"                    undefined\nnode --experimental-webstorage -e \"localStorage.setItem(...)\"\n  TypeError [ERR_INVALID_ARG_VALUE]: The argument\n  '--localstorage-file' is an invalid localStorage location.\n  Received ''\n```\n\n> It needs a second flag naming a file, because there is no browser profile to put it in. With one, it works and <b>persists across processes</b> in a 20KB SQLite file. `sessionStorage` does not persist, verified: a value set in one process read back as `null` in the next.\n\n---\n\n## And the measurement that settles it\n\n```text\n2000 localStorage.setItem   50 ms\nevent loop ticks during     0        (baseline ~43 per 50ms)\n```\n\n> `localStorage` is a <b>synchronous file-backed API</b>. Day 26's measurement pattern again: zero ticks means nothing else in the process ran, so on a request path it blocks every other request.\n>\n> The general lesson is bigger than one API. A browser API in Node has the same <b>name</b> and different <b>constraints</b>, because in a browser it is per-user and per-tab, and in a server it is one shared file across every request from every user.\n\n---\n\n## Ed25519\n\n<b>Ed25519</b> (a modern signature algorithm). Verified against RSA-2048:\n\n```text\n1000 signatures    ed25519    16 ms\n                   rsa-2048  324 ms      20x\nsignature size     ed25519    64 bytes\npublic key (DER)   ed25519    44 bytes\n                   rsa-2048  294 bytes\n```\n\n> 20x faster and much smaller keys, which matters when Day 18's JWT is signed on every login and verified on every request. `crypto.subtle` supports it too.\n\n---\n\n## The upgrade, as a procedure\n\n```text\n1  read the changelog for REMOVALS, not features\n2  install the new version alongside the old\n3  tsc --noEmit, lint, unit tests\n4  --pending-deprecation --throw-deprecation\n5  integration tests, against a real database\n6  staging, for a few days under real traffic\n7  one production instance\n8  the rest\n```\n\n> Step 1 is the one to do differently from instinct: read the changelog for what was <b>taken away</b>. Features are opt-in and cannot break you. And step 6 is where the problems you did not think of appear, because they need traffic.\n\n---\n\n## Where the thirty days got to\n\n> Day 0 was `node file.js`. The last three days were a pipeline, a boundary and a version policy, and none of that is about Node's API surface.\n>\n> Which is the actual arc: <b>knowing APIs is the beginning, understanding the runtime's behaviour is the middle, and operating a system built on it is the job.</b>",
      diagram: `Web APIs in Node are not browser APIs

    UNDICI powers Node's fetch.

    ✓ globals: fetch, Request, Response, Headers,
      WebSocket

      → no axios, no node-fetch for ordinary
        requests

    ⚠ EventSource is NOT a global. matters for
      Day 25.


⚠⚠ localStorage: the clearest example

    node -p "typeof localStorage"
      undefined

    node --experimental-webstorage
      -e "localStorage.setItem(...)"

      TypeError [ERR_INVALID_ARG_VALUE]: The
      argument '--localstorage-file' is an invalid
      localStorage location. Received ''

    it needs a SECOND flag naming a file, because
    there is no browser profile to put it in.

    with one: it works, and PERSISTS ACROSS
    PROCESSES in a 20KB SQLite file.

    sessionStorage does NOT persist. verified:
      set in one process → null in the next.


⚠⚠ And the measurement that settles it

    2000 localStorage.setItem      50 ms
    event loop ticks during         0
      (baseline ~43 per 50ms)

    localStorage is a SYNCHRONOUS FILE-BACKED API.

    Day 26's pattern again: ZERO TICKS means
    nothing else in the process ran.

    → on a request path it blocks EVERY OTHER
      REQUEST

    ⚠ the general lesson is bigger than one API:

      a browser API in Node has the same NAME and
      different CONSTRAINTS.

      in a browser: per-user, per-tab.
      in a server:  ONE SHARED FILE across every
                    request from every user.


Ed25519. Verified against RSA-2048.

    1000 signatures   ed25519     16 ms
                      rsa-2048   324 ms    20x

    signature size    ed25519     64 bytes
    public key (DER)  ed25519     44 bytes
                      rsa-2048   294 bytes

    → matters when Day 18's JWT is signed on every
      login and verified on every request

    crypto.subtle supports it too.


The upgrade, as a procedure

    1  read the changelog for REMOVALS, not
       features
    2  install the new version ALONGSIDE the old
    3  tsc --noEmit, lint, unit tests
    4  --pending-deprecation --throw-deprecation
    5  integration tests, real database
    6  STAGING, for a few days under real traffic
    7  ONE production instance
    8  the rest

    ⚠ step 1 is the one to do differently from
      instinct:

      read for what was TAKEN AWAY.

      features are opt-in and cannot break you.

    ⚠ step 6 is where the problems you did not
      think of appear, because they need TRAFFIC.


Where the thirty days got to

    Day 0 was node file.js.

    the last three days were a PIPELINE, a
    BOUNDARY and a VERSION POLICY, and none of
    that is about Node's API surface.

    which is the actual arc:

      knowing APIs        is the BEGINNING
      understanding the
        runtime's behaviour is the MIDDLE
      operating a system
        built on it       is the JOB`,
      codeExample: {
        title: "The webstorage measurement, ed25519, and an upgrade run",
        code: `// ── fetch and friends, no dependency needed ─────────────────
// $ node -p "typeof fetch + ' ' + typeof Request + ' ' + typeof WebSocket + ' ' + typeof EventSource"
//   function function function undefined
//                              ^^^^^^^^^ ⚠ EventSource
//
// $ node --experimental-eventsource -p "typeof EventSource"
//   function
//
// Which is a Day 25 detail: the WebSocket client is built in
// and the SSE client is not, so an SSE consumer written in
// Node needs the flag or a package, while a browser consumer
// needs neither.
const res = await fetch("https://api.example.com/rates", {
  signal: AbortSignal.timeout(5_000),
  //      ^^^^^^^^^^^^^^^^^^^^^^^^^ Day 22: fetch has NO
  //      default timeout, so without this it can hang until
  //      the socket dies
});


// ── ⚠⚠ localStorage, and why the name misleads ──────────────
// $ node -p "typeof localStorage"
//   undefined
//
// $ node --experimental-webstorage -e "localStorage.setItem('a','1')"
//   TypeError [ERR_INVALID_ARG_VALUE]: The argument
//   '--localstorage-file' is an invalid localStorage
//   location. Received ''
//     code: 'ERR_INVALID_ARG_VALUE'
//
// It needs to be told WHERE, because a server has no browser
// profile. With a file:
//
// $ node --experimental-webstorage --localstorage-file=/tmp/ls.db \\
//     -e "localStorage.setItem('a','1'); console.log(localStorage.getItem('a'))"
//   1
// $ node --experimental-webstorage --localstorage-file=/tmp/ls.db \\
//     -e "console.log('new process reads:', localStorage.getItem('a'))"
//   new process reads: 1                      ← PERSISTS
// $ ls -la /tmp/ls.db
//   -rw-r--r--  20480 bytes                   ← a SQLite file
//
// And sessionStorage does not:
// $ node ... -e "sessionStorage.setItem('s','1')"       → 1
// $ node ... -e "console.log(sessionStorage.getItem('s'))" → null

// ── ⚠⚠ And the reason not to use it on a server ─────────────
let ticks = 0;
const timer = setInterval(() => ticks++, 1);
await new Promise((r) => setTimeout(r, 50));
const baseline = ticks;
ticks = 0;

const start = performance.now();
for (let i = 0; i < 2000; i++) localStorage.setItem("k" + i, "x".repeat(200));
const ms = performance.now() - start;
clearInterval(timer);

console.log(\`2000 setItem: \${ms.toFixed(0)}ms, ticks: \${ticks} (baseline ~\${baseline})\`);
//
// VERIFIED:
//   2000 localStorage.setItem: 50ms, event loop ticks during: 0
//   (baseline ~43 per 50ms)
//
// Zero ticks. Day 26's signature for a blocked event loop: no
// other request ran, no timer fired, no health check answered.
//
// ✗ So this, on a request path, is a blocking disk write that
//   every concurrent request waits behind:
app.post("/preferences", async (request) => {
  localStorage.setItem("prefs:" + request.user.id, JSON.stringify(request.body));
  return { ok: true };
});
//   And worse: it is ONE FILE shared by every user, with no
//   per-user isolation, no expiry, no eviction, and it grows
//   forever. Day 23's unbounded-Map problem, on disk.
//
// ✓ Redis, which is Day 23's answer and is async, shared
//   across instances, and has an eviction policy.
//
// ⚠ The general rule: a web API in Node has the same NAME and
// different CONSTRAINTS. In a browser localStorage is
// per-origin, per-user and per-device, and roughly none of
// those hold on a server.


// ── Ed25519, measured against RSA ───────────────────────────
import crypto from "node:crypto";

const { publicKey, privateKey } = crypto.generateKeyPairSync("ed25519");
const message = Buffer.from("deploy a1b2c3d");

const signature = crypto.sign(null, message, privateKey);
//                            ^^^^ no digest name: Ed25519
//                            hashes internally
console.log(signature.length, crypto.verify(null, message, publicKey, signature));
//   64 true
console.log(crypto.verify(null, Buffer.from("deploy deadbee"), publicKey, signature));
//   false

// VERIFIED, 1000 signatures each:
//   ed25519     16ms
//   rsa-2048   324ms          → 20x
//
// VERIFIED, DER public key size:
//   ed25519     44 bytes
//   rsa-2048   294 bytes
//
// Why it matters concretely: Day 18's JWT is signed once per
// login and verified on EVERY request. At 20x, verification
// stops being something you think about. And a 44-byte public
// key fits comfortably in a JWKS response or an environment
// variable, which a 294-byte RSA key does not do as neatly.
//
// Available through webcrypto too:
const key = await crypto.subtle.generateKey({ name: "Ed25519" }, true, ["sign", "verify"]);
console.log(key.privateKey.algorithm.name);   // Ed25519   ← VERIFIED


// ── The upgrade, run as a procedure ─────────────────────────
// 1. Read the changelog for REMOVALS.
//
//    ✗ Reading it for features tells you what you could
//      adopt, which is optional and cannot break you.
//    ✓ Reading it for removals and behaviour changes tells
//      you what will break, which is the only urgent part.
//
//    grep the notes for: removed, no longer, breaking,
//    default changed.
//
// 2. Install alongside, do not replace.
//    $ nvm install 26 && nvm use 26
//    $ node -v
//
// 3. The cheap checks, per Day 28's ordering.
//    $ npx tsc --noEmit && npm run lint && npm test
//
// 4. ⚠ The deprecation pass, which is the step people skip.
//    $ node --pending-deprecation --throw-deprecation --test
//    Each one becomes an exception with a stack, so you get
//    the call site rather than a message.
//
// 5. Integration tests against a real database and a real
//    Redis, because Day 27's alpine lesson applies here too:
//    a native module rebuilt against a new ABI is where
//    upgrades actually fail.
//    $ npm rebuild && npm run test:integration
//
// 6. ⚠ Staging, for DAYS, under real traffic shape.
//    This is where the ones you could not predict appear:
//    a GC change moving your Day 26 p99, a DNS resolution
//    difference, a TLS default that breaks one provider.
//    Watch Day 21's metrics, not just whether it boots.
//
// 7. ONE production instance, with Day 26's percentiles
//    compared against the others. Same traffic, two versions,
//    one difference.
//
// 8. The rest, via Day 28's rolling deploy.
//
// ⚠ And keep the old version installed. A rollback that
// requires reinstalling a runtime is not a rollback.


// ── A check that outlives your memory ───────────────────────
import { test } from "node:test";
import assert from "node:assert/strict";

test("the runtime has what this application assumes", () => {
  const major = Number(process.versions.node.split(".")[0]);
  assert.ok(major >= 24, \`needs Node 24+, got \${process.version}\`);

  // Assert the features you actually use, so an upgrade that
  // removes one fails here rather than in production.
  assert.equal(typeof Object.groupBy, "function");
  assert.equal(typeof globalThis.WebSocket, "function");
  assert.equal(typeof crypto.subtle, "object");
  assert.equal(process.features.typescript, "strip");

  // And assert the ones you have deliberately NOT adopted, so
  // the day they land you get a nudge rather than never
  // noticing.
  assert.equal(typeof globalThis.Temporal, "undefined",
    "Temporal has landed: revisit the date handling");
});
// The last assertion is the useful trick. A failing test that
// says "the thing you were waiting for is here" is better
// than a calendar reminder you will ignore.`,
      },
      keyTakeaways: [
        "`fetch`, `Request`, `Response`, `Headers` and `WebSocket` are globals via undici, so ordinary HTTP needs no dependency.",
        "`EventSource` is not a global, so a Node SSE client from Day 25 needs `--experimental-eventsource` or a package.",
        "`fetch` has no default timeout, so pair it with `AbortSignal.timeout` per Day 22.",
        "Verified: `localStorage` is undefined by default, and with `--experimental-webstorage` alone it throws `ERR_INVALID_ARG_VALUE` for a missing `--localstorage-file`.",
        "With a file it works and persists across processes in a 20KB SQLite file, while `sessionStorage` returned `null` in a new process.",
        "Verified: 2000 `localStorage.setItem` calls took 50ms with zero event loop ticks against a baseline of about 43.",
        "So it is a synchronous file-backed API, and on a request path every concurrent request waits behind it.",
        "It is also one shared file with no per-user isolation, no expiry and no eviction, which is Day 23's unbounded growth on disk.",
        "The general rule: a web API in Node has the same name and different constraints, because per-user and per-tab do not exist on a server.",
        "Verified: 1000 Ed25519 signatures took 16ms against 324ms for RSA-2048, a 20x difference.",
        "Verified: an Ed25519 signature is 64 bytes and its DER public key 44 bytes, against 294 for RSA-2048.",
        "That matters because Day 18's JWT is verified on every request, and a 44-byte key fits neatly in config or a JWKS response.",
        "Read a changelog for removals and behaviour changes, not features. Features are opt-in and cannot break you.",
        "Run `--pending-deprecation --throw-deprecation` as an explicit upgrade step, which gives you call sites rather than messages.",
        "Test against a real database, because a native module rebuilt against a new ABI is where upgrades actually fail.",
        "Staging for days under real traffic is where unpredictable problems appear, like a GC change moving your p99.",
        "Keep the old version installed, because a rollback needing a runtime reinstall is not a rollback.",
        "Assert the features you rely on in a test, and assert the ones you have not adopted so their arrival nudges you.",
      ],
      commonMistakes: [
        "Adding `axios` or `node-fetch` for ordinary requests when `fetch` is a global.",
        "Assuming `EventSource` exists because `WebSocket` does.",
        "Calling `fetch` with no `AbortSignal.timeout`, so a hung provider holds the request open.",
        "Using `localStorage` on a server, which is synchronous and measured at zero event loop ticks for 50ms.",
        "Treating `localStorage` as per-user, when it is one shared file with no isolation, expiry or eviction.",
        "Expecting `sessionStorage` to persist between processes, when it returned `null`.",
        "Signing JWTs with RSA when Ed25519 measured 20x faster with far smaller keys.",
        "Reading a changelog for new features rather than removals and default changes.",
        "Skipping the deprecation pass, which is the step that finds call sites before they break.",
        "Upgrading without running integration tests, so a native module ABI mismatch surfaces in production.",
        "Going straight from local tests to production with no staging period under real traffic.",
        "Uninstalling the old Node version, so a rollback needs a runtime install first.",
        "Relying on memory to notice when an awaited feature ships, rather than an assertion that fails when it does.",
      ],
      quiz: [
        {
          question: "What did 2000 `localStorage.setItem` calls measure?",
          options: [
            "50ms, running asynchronously",
            "50ms with zero event loop ticks against a baseline of about 43, so it is a synchronous file-backed API that blocks everything",
            "Under 1ms",
            "It failed",
          ],
          correctIndex: 1,
          explanation:
            "Day 26's signature for a blocked loop. It is also one shared file with no isolation, expiry or eviction.",
        },
        {
          question: "What happens with `--experimental-webstorage` and no `--localstorage-file`?",
          options: [
            "It uses a temporary file",
            "It throws `ERR_INVALID_ARG_VALUE`, because a server has no browser profile to store it in",
            "It works in memory",
            "It works normally",
          ],
          correctIndex: 1,
          explanation:
            "With a file it persists across processes in a SQLite file, while `sessionStorage` returned `null` in a new process.",
        },
        {
          question: "How did Ed25519 compare with RSA-2048?",
          options: [
            "Slower but smaller",
            "1000 signatures in 16ms against 324ms, a 20x difference, with a 44-byte public key against 294 bytes",
            "About the same",
            "Faster but with larger keys",
          ],
          correctIndex: 1,
          explanation:
            "That matters because Day 18's JWT is verified on every request, and a 44-byte key fits neatly in config.",
        },
        {
          question: "How should you read a changelog before upgrading?",
          options: [
            "For new features to adopt",
            "For removals and behaviour changes, since features are opt-in and cannot break you",
            "Skip it and run the tests",
            "Only the version number",
          ],
          correctIndex: 1,
          explanation:
            "Grep for removed, no longer, breaking, and default changed. That is the only urgent part.",
        },
        {
          question: "Why is staging for days part of the upgrade procedure?",
          options: [
            "Policy",
            "It is where the problems you could not predict appear, like a GC change moving your p99, because they need real traffic",
            "To warm caches",
            "To let CI catch up",
          ],
          correctIndex: 1,
          explanation:
            "Then one production instance, with Day 26's percentiles compared against the others.",
        },
        {
          question: "What is the point of asserting `typeof Temporal === \"undefined\"` in a test?",
          options: [
            "To prevent its use",
            "So the test fails when it lands, giving you a nudge to revisit your date handling rather than never noticing",
            "To document the version",
            "It has no purpose",
          ],
          correctIndex: 1,
          explanation:
            "A failing test saying the thing you were waiting for has arrived beats a calendar reminder you will ignore.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What did `typeof Temporal` return on Node 24.14.1?",
      options: [
        "\"object\"",
        "`undefined` by default and `object` under `--harmony-temporal`, so it is in V8 and switched off",
        "It threw",
        "\"function\"",
      ],
      correctIndex: 1,
      explanation:
        "Behind a flag is not shipped: a flagged API can change without a deprecation cycle and the flag must reach every entry point.",
    },
    {
      question: "Which of these were measured as undefined on the current LTS?",
      options: [
        "`Object.groupBy` and `Map.groupBy`",
        "`Temporal`, `Map.prototype.getOrInsert`, `getOrInsertComputed`, `WeakMap.prototype.getOrInsert` and `Iterator.concat`",
        "The iterator helpers",
        "`WebSocket`",
      ],
      correctIndex: 1,
      explanation:
        "`Object.groupBy`, `Map.groupBy`, the iterator helpers and `WebSocket` were all present.",
    },
    {
      question: "What does an `engines` field actually do?",
      options: [
        "Blocks the install",
        "Prints a warning and exits 0. Only `engine-strict=true` makes it fail, and even then it only checks the machine running `npm install`.",
        "Prevents the app starting",
        "Nothing at all",
      ],
      correctIndex: 1,
      explanation:
        "Measured with `>=99.0.0` both ways. The check that catches a wrong runtime is one line at startup.",
    },
    {
      question: "Why prefer an even-numbered Node release in production?",
      options: [
        "They are faster",
        "Only even-numbered lines become LTS, so an odd-numbered release reaches end of life sooner",
        "More features",
        "Odd releases are unstable",
      ],
      correctIndex: 1,
      explanation:
        "So Node 25 is not a smaller upgrade than 26, it is a shorter-lived line.",
    },
    {
      question: "Starting at 2026-03-07T12:00 in America/New_York, what did +1 day and +24 hours give?",
      options: [
        "Both 12:00",
        "12:00 and 13:00, because that day was 23 hours long across spring forward",
        "Both 13:00",
        "11:00 and 12:00",
      ],
      correctIndex: 1,
      explanation:
        "Across fall back the same comparison gave 12:00 and 11:00, because that day was 25 hours long.",
    },
    {
      question: "What is the difference between `new Date(\"2026-09-07\")` and `new Date(\"2026-09-07T00:00\")`?",
      options: [
        "None",
        "The first parses as UTC and the second as local, so under America/New_York they were four hours apart",
        "The second is invalid",
        "The first is invalid",
      ],
      correctIndex: 1,
      explanation:
        "The most common date bug in web applications, and a UTC-only test suite cannot catch it.",
    },
    {
      question: "Why does `Temporal.PlainDate` have no hour?",
      options: [
        "It is unfinished",
        "A calendar date is not a moment. A birthday is the same date everywhere, so there is no correct timezone for it.",
        "Performance",
        "It does have one",
      ],
      correctIndex: 1,
      explanation:
        "Verified: `\"hour\" in birthday` is false. Store it as a `date` column, not a `timestamp`.",
    },
    {
      question: "What did January 31 plus one month via `setMonth` produce?",
      options: [
        "February 28",
        "March 3, having overflowed through a non-existent February 31, with no error",
        "An error",
        "February 31",
      ],
      correctIndex: 1,
      explanation:
        "Temporal makes you choose: `constrain` gives February 28, and `overflow: \"reject\"` throws.",
    },
    {
      question: "What happened when a `Date` was passed to a function calling `setDate`?",
      options: [
        "Nothing, Date is immutable",
        "The caller's value changed, because `Date` is mutable. Every Temporal type is immutable.",
        "It threw",
        "A copy was returned",
      ],
      correctIndex: 1,
      explanation:
        "Verified. That is why every `Date` helper has to remember to copy first.",
    },
    {
      question: "What happened when `require(\"_stream_readable\")` was tested on Node 24 LTS?",
      options: [
        "It threw module-not-found",
        "It loaded with no deprecation warning, even under `--pending-deprecation`",
        "It printed a removal notice",
        "It needed the `node:` prefix",
      ],
      correctIndex: 1,
      explanation:
        "Not removed. And no warning is worse than a deprecation, because you get no notice before it goes.",
    },
    {
      question: "Why is DEP0169 on `url.parse` worth more than a normal deprecation?",
      options: [
        "It is louder",
        "The text says CVEs are not issued for its vulnerabilities, so a parsing difference in your auth or redirect check is your problem",
        "It will be removed sooner",
        "Performance",
      ],
      correctIndex: 1,
      explanation:
        "Use `new URL()` and check hostname and protocol against an allowlist.",
    },
    {
      question: "Which TypeScript syntax fails under Node's strip-only mode?",
      options: [
        "Type annotations and interfaces",
        "`enum`, `namespace` and constructor parameter properties, with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`",
        "Generics",
        "All TypeScript",
      ],
      correctIndex: 1,
      explanation:
        "Those generate runtime code rather than erasing. They work under `--experimental-transform-types`.",
    },
    {
      question: "What did `node bad.ts` do with `const n: number = \"this is a string\"`?",
      options: [
        "Refused to run",
        "Printed the string, because Node strips types and does not typecheck at all",
        "Warned then ran",
        "Coerced it",
      ],
      correctIndex: 1,
      explanation:
        "Node removed the run step, not the check step. `tsc --noEmit` is still what finds type errors.",
    },
    {
      question: "What is the status of `module.register()`?",
      options: [
        "Deprecated",
        "A current function, and the loader-hooks API that replaced the older approach",
        "Removed",
        "Experimental only",
      ],
      correctIndex: 1,
      explanation:
        "It is the destination of a deprecation rather than an example of one.",
    },
    {
      question: "What did 2000 `localStorage.setItem` calls measure?",
      options: [
        "50ms, asynchronously",
        "50ms with zero event loop ticks against a baseline of about 43, so it blocks everything else in the process",
        "Under 1ms",
        "It failed",
      ],
      correctIndex: 1,
      explanation:
        "It is also one shared file with no per-user isolation, expiry or eviction, which is Day 23's problem on disk.",
    },
    {
      question: "What happens with `--experimental-webstorage` and no `--localstorage-file`?",
      options: [
        "A temporary file is used",
        "It throws `ERR_INVALID_ARG_VALUE`, because a server has no browser profile to store it in",
        "It works in memory",
        "It works normally",
      ],
      correctIndex: 1,
      explanation:
        "With a file it persists across processes, while `sessionStorage` returned `null` in a new process.",
    },
    {
      question: "How did Ed25519 compare with RSA-2048?",
      options: [
        "Slower but smaller",
        "1000 signatures in 16ms against 324ms, with a 44-byte public key against 294 bytes",
        "About the same",
        "Faster but larger keys",
      ],
      correctIndex: 1,
      explanation:
        "Day 18's JWT is verified on every request, so a 20x verification difference stops being something you think about.",
    },
    {
      question: "How should you read a changelog before upgrading?",
      options: [
        "For features to adopt",
        "For removals and behaviour changes, since features are opt-in and cannot break you",
        "Skip it",
        "Only the version",
      ],
      correctIndex: 1,
      explanation:
        "Grep for removed, no longer, breaking, and default changed.",
    },
    {
      question: "Why is `EventSource` worth checking specifically?",
      options: [
        "It is deprecated",
        "It is not a global by default, unlike `WebSocket`, so Day 25's SSE client needs `--experimental-eventsource`",
        "It replaced WebSocket",
        "Browsers only",
      ],
      correctIndex: 1,
      explanation:
        "A good example of why a per-feature check beats a general assumption about web APIs in Node.",
    },
    {
      question: "What is the arc of these thirty days?",
      options: [
        "Learning every Node API",
        "Knowing APIs is the beginning, understanding the runtime's behaviour is the middle, and operating a system built on it is the job",
        "Learning a framework",
        "Reaching production quickly",
      ],
      correctIndex: 1,
      explanation:
        "The last three days were a pipeline, a boundary and a version policy, and none of that is about Node's API surface.",
    },
  ],
  project: {
    name: "day-30",
    goal: "Audit your runtime instead of trusting articles, then upgrade one dependency of your stack on purpose, with the removals read and the deprecations found before anything breaks.",
    brief:
      "This one is deliberately unglamorous. The output is a table of what your Node actually has, a list of the date bugs in your own code, and an upgrade you performed as a procedure rather than a guess. The most useful step is the deprecation pass, because it finds call sites in your code you had no reason to suspect.",
    steps: [
      "Run `node -v`, `process.release.lts` and `process.versions.v8` and write all three at the top of your report.",
      "Write a runtime-report script that checks `Temporal`, `Map.prototype.getOrInsert`, `getOrInsertComputed`, `WeakMap.prototype.getOrInsert`, `Iterator.concat`, `Object.groupBy`, `Map.groupBy`, `WebSocket`, `EventSource`, `localStorage` and `node:sqlite`. Record every result.",
      "For each one that is undefined, find an article claiming it is available and note the gap.",
      "Run `node --harmony-temporal -p \"typeof Temporal\"` and record the difference.",
      "Under that flag, compute `+1 day` and `+24 hours` from a noon time in `America/New_York` across both DST transitions, and record the four results and the two day lengths.",
      "Do the same arithmetic with `Date` and `+ 86400000` and record where they disagree.",
      "Print `new Date(\"2026-09-07\").toISOString()` and `new Date(\"2026-09-07T00:00\").toISOString()` under `TZ=America/New_York` and record both.",
      "Grep your own codebase for `86400000`, `setDate`, `setMonth` and `new Date(` with a date-only string. List every finding.",
      "For each finding, say whether it wants a calendar date, an instant, a zoned time or a duration.",
      "Check your database schema for any calendar date stored as a timestamp, and list them.",
      "Add a test that fails if a birthday-style column is a timestamp type.",
      "Run part of your test suite under `TZ=America/New_York` and again under `TZ=Asia/Kolkata`, and record any failure.",
      "Test whether `require(\"_stream_readable\")` and `res.writeHeader` work on your runtime, and whether either warns under `--pending-deprecation`.",
      "Run your full suite with `--pending-deprecation --throw-deprecation` and list every deprecation with its call site.",
      "Separate that list into your code and your dependencies.",
      "Fix all of the ones in your code, including any `url.parse` in a redirect or auth path.",
      "Add `--pending-deprecation --throw-deprecation` as a separate non-blocking CI job.",
      "Add `process.on(\"warning\")` logging through your structured logger and confirm a deprecation appears in your logs.",
      "Write a `.ts` file using an `enum`, a `namespace` and a constructor parameter property, run each with `node`, and record the exact errors.",
      "Run all three with `--experimental-transform-types` and record that they work.",
      "Write a `.ts` file with a deliberate type error, run it with `node`, and record that it executed.",
      "Add `erasableSyntaxOnly` to your tsconfig and fix whatever it reports.",
      "Replace any `enum` with a `const` object plus a derived type, and any parameter property with an explicit assignment.",
      "Confirm `npx tsc --noEmit` is in your CI before the tests.",
      "Generate an Ed25519 key pair, sign and verify, and confirm a tampered message fails.",
      "Benchmark 1000 Ed25519 signatures against 1000 RSA-2048 signatures and record both times and both public key sizes.",
      "If your JWTs use RSA or HMAC, write down what switching would change for signing and for per-request verification.",
      "Run `localStorage` with `--experimental-webstorage` and no file, and record the error.",
      "Add a file, write a value, read it in a second process, and record whether it persisted. Do the same with `sessionStorage`.",
      "Measure 2000 `localStorage.setItem` calls with an interval counting event loop ticks alongside, and record the time and the tick count.",
      "Pick one thing to upgrade: your Node minor, Postgres, Redis, or your main framework. Read its changelog for removals and behaviour changes only, and list what applies to you.",
      "Install it alongside the old version, then run typecheck, lint, unit tests, the deprecation pass, and integration tests against a real database.",
      "Run `npm rebuild` and confirm every native module still loads.",
      "Deploy it to staging and leave it under traffic, watching your percentiles rather than just whether it boots.",
      "Roll it out to one instance and compare that instance's p50 and p99 against the others.",
      "Write a test that asserts every runtime feature your application relies on, plus one asserting `Temporal` is still undefined so you are told when it lands.",
      "Write the report: the runtime table, the DST results, your date-bug list, the deprecation call sites you fixed, the TypeScript boundary errors, the Ed25519 numbers, the localStorage measurement, and the upgrade outcome with before-and-after percentiles.",
    ],
    acceptance: [
      "The report opens with your Node version, LTS codename and V8 version.",
      "You have a result for every feature in the runtime-report list, and can name at least one article that was wrong about your runtime.",
      "You have the four DST results and both day lengths, and the `Date` comparison showing where it disagrees.",
      "You have both `new Date` parsing results under a non-UTC timezone.",
      "Every `86400000`, `setDate`, `setMonth` and date-only `new Date(` in your code is listed and classified as a date, an instant, a zoned time or a duration.",
      "Any calendar date stored as a timestamp is listed, and a test fails if one is added.",
      "Part of your suite runs under two non-UTC timezones and you recorded any failures.",
      "You know whether `_stream_readable` and `res.writeHeader` work and warn on your runtime.",
      "You have a full deprecation list with call sites, split into your code and dependencies, and yours are fixed.",
      "No `url.parse` remains in a redirect or auth path.",
      "A non-blocking deprecation job exists in CI and deprecations appear in your structured logs.",
      "You have the exact `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX` errors for enum, namespace and parameter properties, and confirmation the transform flag handles them.",
      "You recorded that a type error ran successfully under `node`, and `tsc --noEmit` runs in CI before the tests.",
      "`erasableSyntaxOnly` is on and the codebase passes.",
      "You have Ed25519 and RSA timings and public key sizes, and a written position on your JWT algorithm.",
      "You have the localStorage error without a file, the persistence results for both storages, and the setItem timing with its tick count.",
      "The upgrade has a removals list, all six check steps run, a staging period, and one-instance percentiles compared against the rest.",
      "A test asserts the features you depend on, and one fails when `Temporal` lands.",
      "`npx tsc --noEmit` passes and the whole suite passes.",
    ],
    stretch: [
      "Install an odd-numbered Node release, run your suite, and record what differs from LTS.",
      "Port one module's date handling to Temporal behind the flag and keep both implementations under the same tests.",
      "Write a property test that compares your date arithmetic against the database's `interval` results across a year of dates including both DST transitions.",
      "Run your suite under `Pacific/Chatham` for a 45-minute offset and see what breaks.",
      "Switch your JWTs to Ed25519 and measure the change in per-request verification cost under load.",
      "Measure `enableCompileCache` on your real application startup, three runs each way, and say whether it helped.",
      "Write a script that diffs the runtime-report output between two Node versions and prints only the changes.",
      "Add a scheduled CI job that runs your suite against the newest Node release weekly, non-blocking, so an incompatibility shows up months early.",
      "Find one dependency using a deprecated API, open an issue or a pull request, and note what the maintainer said.",
      "Write the upgrade procedure up as a runbook a colleague could follow without you.",
    ],
  },
};
