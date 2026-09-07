import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_28_LESSONS: LessonDay = {
  day: 28,
  title: "Deployment & CI/CD",
  totalMinutes: 96,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "where-it-runs",
      title: "Where it runs, and who keeps it alive",
      durationMinutes: 11,
      explanation:
        "## Deployment\n\n<b>Deployment</b> (putting your application somewhere users can reach it).\n\n> The useful way to think about the options is not \"which is best\" but <b>how much of the operating system you want to own</b>. Every choice below is a point on that line, and the cost you pay is either money or your attention.\n\n---\n\n## The line, from most yours to least\n\n```text\nVPS          you own Linux, Node, the proxy, TLS, deploys, patching\nECS / K8s    you own the container and the config, they own the host\nRailway      you own the repo, they own nearly everything else\nLambda       you own a function, they own the process lifecycle\n```\n\n<b>VPS</b> (a virtual machine you manage yourself). <b>Kubernetes</b> (a system for scheduling containers across machines).\n\n> The advice worth giving about Kubernetes is narrower than \"don't start with it\". It solves a specific problem: many services, many teams, needing self-service deploys and a common set of primitives. If you have one service and one person, it is a large amount of machinery pointed at nothing.\n\n---\n\n## Serverless and cold starts\n\n<b>Serverless</b> (running code without managing a process that stays up). <b>Cold start</b> (the delay while a new instance initialises before handling its first request).\n\nMeasured locally, which is the floor a platform builds on:\n\n```text\nnode trivial.mjs                     20 - 30 ms\nimport fastify + await app.ready()   45 - 76 ms\n```\n\n> So before your code touches a request, a Fastify application spends roughly 50ms building itself, and that is on a warm filesystem with no container to start and no network to attach. On a real platform the cold start is that plus the sandbox.\n>\n> The thing that decides whether serverless suits you is not the number itself, it is <b>whether it happens on a user's request</b>. It also interacts badly with things from earlier days: a connection pool per instance means Day 17's pool arithmetic multiplies by your concurrency, and Day 24's in-process jobs have nowhere to live.\n\n---\n\n## Keeping a process alive\n\n<b>PM2</b> (a Node process manager). <b>systemd</b> (Linux's service manager).\n\n> Pick one, and prefer the one you already have. `systemd` is on the machine, starts on boot, handles logs, and restarts on failure. PM2 adds a process you also have to keep alive.\n>\n> And the point Day 27 measured: <b>inside a container you need neither</b>. The orchestrator restarts the container, and putting PM2 in front of node reintroduces exactly the PID 1 problem where the graceful shutdown handler never ran.",
      diagram: `The real question is not "which platform"

    it is HOW MUCH OF THE OPERATING SYSTEM DO YOU
    WANT TO OWN.

    the cost is either money or your attention.

    most yours ───────────────────► least yours

    VPS         Linux, Node, proxy, TLS, deploys,
                patching
    ECS / K8s   the container and config; they own
                the host
    Railway     the repo; they own nearly all of it
    Lambda      a function; they own the process
                lifecycle


On Kubernetes, narrower than "don't"

    it solves a SPECIFIC problem:

      many services
      many teams
      self-service deploys
      a common set of primitives

    → one service and one person = a large amount
      of machinery pointed at nothing


⚠ Cold starts. Measured locally.

    node trivial.mjs                20 - 30 ms
    import fastify + app.ready()    45 - 76 ms

    so BEFORE your code touches a request, a
    Fastify app spends ~50ms building itself.

    and that is on a warm filesystem, with no
    container to start and no network to attach.

    on a real platform: that PLUS the sandbox.

    ⚠ what decides whether serverless suits you is
      not the number.

      it is WHETHER IT HAPPENS ON A USER'S
      REQUEST.

    and it interacts badly with earlier days:

      a pool per instance → Day 17's pool
        arithmetic multiplies by your concurrency
      Day 24's in-process jobs → nowhere to live


Keeping a process alive

    PM2       a Node process manager
    systemd   Linux's service manager

    ✓ prefer the one you ALREADY HAVE.

      systemd is on the machine, starts on boot,
      handles logs, restarts on failure.

      PM2 adds a process you also have to keep
      alive.

    ⚠⚠ and inside a container you need NEITHER.

      the orchestrator restarts the container.

      putting PM2 in front of node reintroduces
      exactly the Day 27 PID 1 problem, where the
      graceful shutdown handler NEVER RAN.`,
      codeExample: {
        title: "The cold start measurement, and a service unit",
        code: `// ── The cold start floor, measured ──────────────────────────
// $ cat trivial.mjs
//   console.log("x")
// $ time node trivial.mjs
//   real 0.03 / 0.02 / 0.02        ← 20-30ms just to start node
//
// $ cat fast.mjs
const t = performance.now();
const { default: Fastify } = await import("fastify");
const app = Fastify();
await app.ready();
console.log("fastify ready:", Math.round(performance.now() - t) + "ms");
//
// VERIFIED, three runs:
//   fastify ready: 55ms
//   fastify ready: 54ms
//   fastify ready: 76ms
//
// That is the floor. No container, no network, a warm page
// cache, and 42 packages in node_modules.
//
// ⚠ So when a platform advertises a 200ms cold start, 50-80ms
// of it is your application constructing itself, and the rest
// is theirs. Both halves land on one unlucky user's request.
//
// Measure YOUR number before deciding, because it scales with
// what you import at module scope:
//
//   $ node -e "const t=Date.now();await import('./src/app.js');console.log(Date.now()-t)"
//
// This is also where Day 29's barrel-file finding bites: an
// index that re-exports everything loads everything.


// ── ⚠ What serverless does to earlier days' decisions ───────
// Day 17's pool arithmetic, revisited:
const pool = new Pool({ max: 10 });
//
//   one long-lived server      10 connections
//   100 concurrent lambdas     ⚠ 1000 connections
//
// Postgres' default max_connections is 100. So the same code
// that was correct on a server exhausts the database on a
// platform that scales by process count. You need a pooler
// (pgbouncer, or your provider's) in front, or max: 1.
//
// Day 24's jobs, revisited: a function that exits after the
// response has nowhere to run a queue worker or a cron. Those
// become separate always-on services or platform primitives,
// which means serverless does not remove the need for a
// server, it splits your system in two.
//
// ✗ And the pattern that quietly breaks: work after the
//   response.
app.post("/orders", async (request, reply) => {
  const order = await createOrder(request.body);
  reply.send(order);
  sendConfirmationEmail(order);       // ⚠ never awaited
  return;
});
//   On a server this usually finishes. On a platform that
//   freezes the instance once the response is sent, it may
//   not run at all, and it will not fail loudly. Day 24's
//   queue is the answer either way.


// ── systemd, which is already on the machine ────────────────
// /etc/systemd/system/api.service
//
//   [Unit]
//   Description=API
//   After=network-online.target
//
//   [Service]
//   Type=simple
//   User=app
//   WorkingDirectory=/srv/api
//   ExecStart=/usr/bin/node /srv/api/dist/server.js
//   #          ^^^^^^^^^^^^^^^^ node DIRECTLY, for the same
//   #          reason as Day 27's CMD: whatever you put in
//   #          front absorbs the signal.
//
//   Restart=always
//   RestartSec=2
//   #  ⚠ without RestartSec, a crash loop restarts as fast as
//   #  the machine allows and buries the cause in the journal.
//
//   KillSignal=SIGTERM
//   TimeoutStopSec=30
//   #  ⚠ must be LONGER than your Day 22 drain, or systemd
//   #  SIGKILLs you mid-request on every restart.
//
//   Environment=NODE_ENV=production
//   EnvironmentFile=/etc/api.env
//   #  ⚠ chmod 600, owned by root. Day 27's point: a secret
//   #  in a file readable only by who needs it.
//
//   NoNewPrivileges=true
//   ProtectSystem=strict
//   ReadWritePaths=/srv/api/tmp
//   PrivateTmp=true
//
//   [Install]
//   WantedBy=multi-user.target
//
// $ systemctl enable --now api
// $ journalctl -u api -f
//
// Day 21's structured logs go to stdout and systemd captures
// them, so you do not need a logging library that writes
// files.


// ── ⚠⚠ PM2 inside a container reintroduces Day 27's bug ─────
// ✗ CMD ["pm2-runtime", "server.js"]
//
// Now pm2 is PID 1. Day 27 measured what happens when
// something sits in front of node: with CMD ["npm","start"]
// the graceful shutdown message never printed and every
// in-flight request was dropped.
//
// pm2-runtime does forward signals, unlike npm, so it is not
// automatically broken. But you now have two process managers
// arguing about restarts: pm2 restarts the worker while the
// orchestrator thinks the container is healthy, so a wedged
// application is invisible to your liveness probe, which is
// the same objection as Day 26's cluster discussion.
//
// ✓ CMD ["node", "dist/server.js"]
//   One process. The orchestrator restarts it. Verify it:
//
//   $ docker exec api ps -o pid,comm
//       PID COMMAND
//         1 node`,
      },
      keyTakeaways: [
        "The useful question is how much of the operating system you want to own, not which platform is best.",
        "Kubernetes solves many services, many teams and self-service deploys. One service and one person is machinery pointed at nothing.",
        "Measured: bare node startup is 20-30ms, and importing Fastify plus `await app.ready()` is 45-76ms.",
        "So roughly 50ms of any cold start is your application constructing itself, before the platform's sandbox is counted.",
        "What decides whether serverless fits is not the number but whether that delay lands on a user's request.",
        "Serverless multiplies Day 17's pool: `max: 10` across 100 instances is 1000 connections against a default `max_connections` of 100.",
        "Day 24's queue workers and cron have nowhere to live in a function, so serverless splits your system rather than removing the server.",
        "Work fired after `reply.send` may never run on a platform that freezes the instance, and it fails silently.",
        "Prefer `systemd` over PM2 on a VPS: it is already installed, starts on boot, captures logs and restarts on failure.",
        "In a systemd unit, `ExecStart` must call node directly, for the same signal reason as Day 27's `CMD`.",
        "`TimeoutStopSec` must exceed your Day 22 drain, or systemd SIGKILLs you mid-request on every restart.",
        "Set `RestartSec`, or a crash loop restarts as fast as the machine allows and buries the cause.",
        "Inside a container you need no process manager at all, and adding one gives you two managers arguing about restarts.",
        "Two managers also hide a wedged application from the liveness probe, which is Day 26's objection to cluster.",
      ],
      commonMistakes: [
        "Choosing Kubernetes for one service, which is a large operational surface with no problem to solve.",
        "Adopting serverless without measuring your own module-load time, which was 45-76ms for a bare Fastify app.",
        "Keeping a per-instance connection pool on a platform that scales by process count, which exhausts the database.",
        "Assuming queue workers and cron survive in a function runtime.",
        "Firing work after `reply.send` and assuming it completes.",
        "Running PM2 inside a container, which duplicates the orchestrator and hides failures from the liveness probe.",
        "`ExecStart` pointing at `npm start`, which is Day 27's measured signal bug on a VPS instead of in Docker.",
        "`TimeoutStopSec` shorter than the drain, so every restart is a SIGKILL mid-request.",
        "No `RestartSec`, so a crash loop spins and floods the journal.",
        "Writing log files from the application when systemd or the container runtime already captures stdout.",
      ],
      quiz: [
        {
          question: "What was measured for a bare Fastify application's startup?",
          options: [
            "Under 5ms",
            "45-76ms for the import plus `await app.ready()`, on top of 20-30ms to start node at all",
            "About 500ms",
            "It could not be measured",
          ],
          correctIndex: 1,
          explanation:
            "That is the floor with no container and a warm cache, so a platform's cold start is that plus its sandbox.",
        },
        {
          question: "Why does serverless break Day 17's connection pool sizing?",
          options: [
            "Pools are unsupported",
            "It scales by process count, so `max: 10` across 100 instances requests 1000 connections against a default limit of 100",
            "Connections cannot be reused",
            "It does not, the pool is shared",
          ],
          correctIndex: 1,
          explanation:
            "You need a pooler in front, or `max: 1`. The same code that was correct on a server exhausts the database.",
        },
        {
          question: "Why is `systemd` usually the better choice over PM2 on a VPS?",
          options: [
            "It is faster",
            "It is already installed, starts on boot, captures logs and restarts on failure, whereas PM2 is another process you must keep alive",
            "PM2 cannot restart Node",
            "systemd handles TLS",
          ],
          correctIndex: 1,
          explanation:
            "And in a container you need neither, because the orchestrator already restarts the container.",
        },
        {
          question: "What goes wrong with a process manager inside a container?",
          options: [
            "Nothing",
            "You get two managers arguing about restarts, and a wedged application stays invisible to the liveness probe because the container is still up",
            "It cannot start",
            "Logs are lost",
          ],
          correctIndex: 1,
          explanation:
            "The same objection Day 26 raised about cluster, plus Day 27's measured risk of something sitting in front of node.",
        },
        {
          question: "Why must `TimeoutStopSec` exceed your drain time?",
          options: [
            "For faster restarts",
            "Otherwise systemd SIGKILLs the process mid-request on every restart, so the graceful shutdown starts and never finishes",
            "It controls startup",
            "It is only a warning",
          ],
          correctIndex: 1,
          explanation:
            "The same grace-period arithmetic as Day 27's Kubernetes default of 30 seconds.",
        },
      ],
    },
    {
      id: "ci-pipeline",
      title: "CI, and making it fast enough to keep",
      durationMinutes: 11,
      explanation:
        "## CI\n\n<b>CI (continuous integration)</b> (running checks automatically on every push).\n\n<b>CD (continuous delivery or deployment)</b> (automatically shipping what passed).\n\n> The value of CI is not that it runs your tests, it is that it runs them <b>somewhere that is not your machine</b>. It catches the missing lockfile entry, the file you never committed, the dependency you installed globally, and the test that only passes in your timezone.\n\n---\n\n## The pipeline\n\n```text\npush → npm ci → lint → tsc --noEmit → test → build → deploy\n```\n\n> Order these by <b>how fast they fail</b>. Lint and typecheck take seconds and catch a lot, so they go before a test suite that takes minutes. A pipeline where the cheapest check runs last wastes the most time on the most common failure.\n\n---\n\n## Why `npm ci` and not `npm install`\n\n> Day 12's point in a CI setting: `npm ci` installs exactly the lockfile and <b>fails</b> if `package.json` and the lockfile disagree. `npm install` will quietly resolve something new and update the lockfile, which means your CI can pass against dependencies your teammate never had.\n\n---\n\n## Caching, measured\n\nOn a small 42-package tree:\n\n```text\nnpm ci, cold cache                 2.01 s\nnpm ci, warm cache                 1.15 s\nnpm ci, warm + --prefer-offline    0.92 s\n```\n\n> A 2.2x saving, and the honest note is that this is a <b>tiny</b> tree. The win scales with dependency count, so measure your own rather than assuming either a big or a small effect. What the numbers do show is that the saving comes from not going to the network, which is why `--prefer-offline` helps on top of the cache.\n\n---\n\n## And a smaller one worth knowing\n\n```text\nnpm run noop     100 ms\nnode --run noop   30 ms\n```\n\n> `node --run` skips npm's own startup. Three times faster on nothing, which is invisible once and adds up across a pipeline that invokes scripts a dozen times. It does not read `.npmrc` or run pre/post scripts, which is usually what you want in CI and occasionally not.\n\n---\n\n## Matrix testing\n\n<b>Matrix testing</b> (running the same checks against several environments).\n\n> Worth doing when you <b>publish a library</b>, because you do not control your users' Node version. Less useful for an application, where you control production exactly and a matrix mostly multiplies your CI minutes and your flaky-test surface.\n>\n> The version that pays for an application is a matrix over what actually varies: your database version, or a migration applied and not applied.",
      diagram: `What CI is actually for

    not that it runs your tests.

    that it runs them SOMEWHERE THAT IS NOT YOUR
    MACHINE.

    it catches:
      the missing lockfile entry
      the file you never committed
      the dependency you installed globally
      the test that only passes in your timezone


⚠ Order the pipeline by HOW FAST IT FAILS

    push
      ↓  npm ci
      ↓  lint          seconds
      ↓  tsc --noEmit  seconds
      ↓  test          minutes
      ↓  build
      ↓  deploy

    lint and typecheck take seconds and catch a
    lot, so they go BEFORE a test suite that takes
    minutes.

    → a pipeline where the cheapest check runs
      LAST wastes the most time on the most common
      failure


npm ci, not npm install

    npm ci     installs EXACTLY the lockfile, and
               FAILS if package.json and the
               lockfile disagree
    npm install  quietly resolves something new
               and updates the lockfile

    → npm install in CI means your pipeline can
      pass against dependencies your teammate
      never had


Caching. Measured, 42-package tree.

    npm ci, cold cache              2.01 s
    npm ci, warm cache              1.15 s
    npm ci, warm + prefer-offline   0.92 s

    a 2.2x saving.

    ⚠ and the honest note: this is a TINY tree.

      the win scales with dependency count, so
      measure your own rather than assuming a big
      or a small effect.

    what the numbers DO show: the saving is from
    NOT GOING TO THE NETWORK, which is why
    --prefer-offline helps on top of the cache.


A smaller one worth knowing

    npm run noop      100 ms
    node --run noop    30 ms

    node --run skips npm's own startup.

    3x faster on nothing. invisible once, adds up
    across a pipeline invoking scripts a dozen
    times.

    ⚠ it does not read .npmrc or run pre/post
      scripts. usually what you want in CI, and
      occasionally not.


Matrix testing

    ✓ worth it when you PUBLISH A LIBRARY.

      you do not control your users' Node version.

    ⚠ less useful for an APPLICATION.

      you control production exactly, and a matrix
      mostly multiplies your CI minutes and your
      flaky-test surface.

    → the version that pays for an app is a matrix
      over what actually VARIES:

        your database version
        a migration applied vs not applied`,
      codeExample: {
        title: "A pipeline, ordered by how fast it fails",
        code: `// ── .github/workflows/ci.yml ────────────────────────────────
//
//   name: ci
//   on:
//     push: { branches: [main] }
//     pull_request:
//
//   concurrency:
//     group: ci-\${{ github.ref }}
//     cancel-in-progress: true
//     #  ⚠ without this, pushing three times queues three
//     #  full runs and you wait for two you no longer care
//     #  about.
//
//   jobs:
//     check:
//       runs-on: ubuntu-latest
//       steps:
//         - uses: actions/checkout@v4
//
//         - uses: actions/setup-node@v4
//           with:
//             node-version-file: .nvmrc     ← ⚠ ONE source of truth
//             cache: npm
//             #     ^^^^ caches ~/.npm keyed on the lockfile
//
//         - run: npm ci --prefer-offline
//
//         # Cheapest first. Both of these take seconds.
//         - run: npm run lint
//         - run: npx tsc --noEmit
//
//         # Then the slow one.
//         - run: npm test
//
//         - run: npm run build
//
// The step order is the whole point. A type error found in 8
// seconds instead of after a 6-minute test suite is the
// difference between fixing it now and context-switching away.


// ── The cache measurement ───────────────────────────────────
// $ npm cache clean --force && rm -rf node_modules
// $ time npm ci
//   real 2.01           ← cold cache
//
// $ rm -rf node_modules && time npm ci
//   real 1.15           ← warm cache
//
// $ rm -rf node_modules && time npm ci --prefer-offline
//   real 0.92           ← warm cache, skip the registry
//
// VERIFIED, 42 packages, 18MB of node_modules.
//
// ⚠ Two honest caveats. This tree is small, so 1.1 seconds
// saved is nothing on its own; the point is the SHAPE, which
// is that most of npm ci is network. And a CI runner's cache
// restore is itself not free, so on a very small tree the
// cache can cost more than it saves. Measure it: run the
// pipeline once with cache and once without.


// ── ⚠ npm ci vs npm install, the failure that matters ───────
// Add a dependency to package.json and forget to commit the
// lockfile:
//
//   $ npm ci
//     npm error \`npm ci\` can only install packages when your
//     package.json and package-lock.json are in sync.
//     Missing: zod@3.24.1 from lock file
//   → exit 1, and that is CORRECT
//
//   $ npm install
//     added 1 package
//   → exit 0, lockfile rewritten inside the runner and thrown
//     away. Your CI passed against a resolution nobody else
//     has, and the next person gets a different one.
//
// This is the single most common reason "it works in CI" and
// "it works locally" disagree.


// ── node --run, measured ────────────────────────────────────
// $ cat package.json
//   { "scripts": { "noop": "node -e \\"0\\"" } }
//
// $ time npm run noop     → real 0.20 / 0.10 / 0.10
// $ time node --run noop  → real 0.04 / 0.03 / 0.03
//
// VERIFIED. ~3x, on a script that does nothing, so the
// difference is npm's own startup.
//
// ⚠ node --run deliberately does NOT:
//   - run pre/post scripts
//   - read .npmrc
//   - put node_modules/.bin on PATH the same way in every
//     case, so a bare "eslint ." may not resolve
//
// So it is a good fit for a CI step that calls one tool, and
// a bad fit for a script chain that relies on prepublish
// hooks.


// ── Matrix: when it earns its cost ──────────────────────────
// ✓ Publishing a library. You do not control the consumer:
//
//   strategy:
//     matrix:
//       node: [20, 22, 24]
//
// ✗ An application, where production is exactly one version:
//
//   strategy:
//     matrix:
//       node: [22, 24, 25]
//
//   Three times the minutes, three times the flake surface,
//   to test two versions you will never deploy. If you are
//   planning an upgrade, add the target version as a
//   SEPARATE non-blocking job instead:
//
//     upgrade-check:
//       continue-on-error: true
//       ...
//
// ✓ The matrix that does pay for an application:
//
//   strategy:
//     matrix:
//       postgres: ["16", "17"]
//
//   Because Day 17's query plans and Day 28's migrations are
//   where version differences actually bite you.


// ── Make CI check the things that are easy to forget ────────
// A test that catches drift no human reviews for:
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

test("node version is pinned in one place", () => {
  const nvmrc = readFileSync(".nvmrc", "utf8").trim();
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const engines = pkg.engines?.node ?? "";
  assert.ok(
    engines.includes(nvmrc.split(".")[0]),
    \`.nvmrc says \${nvmrc} but engines.node says \${engines}\`,
  );
});

test("every route has a body limit", async () => {
  // Day 26's finding: a 41MB parse blocked the loop for 173ms
  // with zero ticks. This is cheaper than remembering.
  const app = await buildApp();
  assert.ok(app.initialConfig.bodyLimit <= 1024 * 1024);
});

test("the Dockerfile runs as a non-root user", () => {
  const df = readFileSync("Dockerfile", "utf8");
  assert.match(df, /^USER \\w+/m, "no USER line");
  assert.match(df, /^CMD \\[/m, "CMD must be exec form, not shell form");
  // Day 27 measured both: root by default, and the shell form
  // putting sh at PID 1.
});`,
      },
      keyTakeaways: [
        "CI's value is running your checks somewhere that is not your machine, which catches the uncommitted file and the globally installed dependency.",
        "Order the pipeline by how fast each step fails: lint and typecheck take seconds, so they go before a test suite that takes minutes.",
        "`npm ci` fails when `package.json` and the lockfile disagree. `npm install` quietly resolves something new and passes.",
        "That is the most common reason \"works in CI\" and \"works locally\" disagree.",
        "Measured on 42 packages: `npm ci` was 2.01s cold, 1.15s with a warm cache, and 0.92s with `--prefer-offline`.",
        "The saving comes from not touching the network, which is why `--prefer-offline` helps on top of the cache.",
        "That tree is small, so measure your own: on a very small tree the runner's cache restore can cost more than it saves.",
        "Measured: `node --run` was about 3x faster than `npm run` on a no-op script, 30ms against 100ms.",
        "`node --run` skips pre/post scripts and `.npmrc`, which suits a CI step calling one tool and not a hook-dependent chain.",
        "Use `concurrency` with `cancel-in-progress`, or three pushes queue three full runs.",
        "Point `setup-node` at `.nvmrc` so the version lives in one place.",
        "A Node matrix earns its cost for a published library and mostly wastes minutes for an application.",
        "The matrix that pays for an application is over what actually varies, like the database version.",
        "Let CI assert the things nobody reviews: a pinned version, a body limit, a `USER` line and an exec-form `CMD`.",
      ],
      commonMistakes: [
        "Running the test suite before lint and typecheck, so the most common failure costs the most time.",
        "`npm install` in CI, which can pass against a dependency resolution nobody else has.",
        "Assuming dependency caching is a large win without measuring, when the runner's cache restore is not free either.",
        "No `concurrency` group, so rapid pushes queue runs you no longer care about.",
        "Duplicating the Node version across `.nvmrc`, `engines` and the workflow, so they drift.",
        "A Node version matrix on an application, tripling minutes and flake surface for versions you will never deploy.",
        "Making an upgrade-target matrix leg blocking, so an unrelated future incompatibility stops today's deploy.",
        "Using `node --run` for a script that depends on pre/post hooks or `.npmrc`.",
        "Relying on code review to catch a missing body limit or a root-running Dockerfile, when a test can assert both.",
        "A pipeline with no build step, so a compile error only surfaces during deployment.",
      ],
      quiz: [
        {
          question: "Why does step order matter in a CI pipeline?",
          options: [
            "It does not",
            "Lint and typecheck take seconds and catch a lot, so running them before a minutes-long test suite means the most common failure costs the least time",
            "Steps must run alphabetically",
            "It affects caching",
          ],
          correctIndex: 1,
          explanation:
            "A type error found in 8 seconds rather than after a 6-minute suite is the difference between fixing it now and context-switching away.",
        },
        {
          question: "What happens when you add a dependency and forget to commit the lockfile?",
          options: [
            "Both `npm ci` and `npm install` fail",
            "`npm ci` fails with an out-of-sync error, which is correct, while `npm install` succeeds against a resolution nobody else has",
            "Both succeed",
            "`npm ci` updates the lockfile",
          ],
          correctIndex: 1,
          explanation:
            "That is the most common source of \"works in CI, not locally\" disagreements.",
        },
        {
          question: "What did caching do to `npm ci` on a 42-package tree?",
          options: [
            "No difference",
            "2.01s cold, 1.15s warm, 0.92s with `--prefer-offline`, so the saving is in avoiding the network",
            "It got slower",
            "A 10x speedup",
          ],
          correctIndex: 1,
          explanation:
            "That is a small tree, and a runner's cache restore is not free either, so measure your own pipeline both ways.",
        },
        {
          question: "When does a Node version matrix earn its cost?",
          options: [
            "Always",
            "When you publish a library, since you do not control the consumer's version. For an application it mostly multiplies minutes and flake.",
            "Never",
            "Only for TypeScript projects",
          ],
          correctIndex: 1,
          explanation:
            "For an application, matrix over what actually varies, like the database version, and make an upgrade check non-blocking.",
        },
        {
          question: "What is the tradeoff with `node --run`?",
          options: [
            "It is slower",
            "About 3x faster than `npm run`, but it skips pre/post scripts and `.npmrc`, which suits a single-tool CI step and not a hook-dependent chain",
            "It cannot run scripts",
            "It requires a lockfile",
          ],
          correctIndex: 1,
          explanation:
            "Measured at 30ms against 100ms on a no-op, so the difference is npm's own startup.",
        },
      ],
    },
    {
      id: "zero-downtime",
      title: "Deploying without dropping requests",
      durationMinutes: 12,
      explanation:
        "## Zero-downtime deployment\n\n<b>Zero-downtime deployment</b> (replacing the running version without users noticing).\n\n<b>Rolling restart</b> (replacing instances one at a time rather than all at once).\n\n> Day 27 built every piece of this: readiness so traffic stops arriving, `SIGTERM` reaching PID 1, a drain that finishes inside the grace period. Rolling restart is just those pieces applied to more than one instance, and it fails for the same reasons.\n\n---\n\n## The one-host version, measured\n\n<b>`reusePort`</b> (letting several processes listen on the same port, with the kernel distributing connections).\n\nVerified in a `node:24-slim` container:\n\n```text\nA listening, pid 10\nB listening, pid 19\n\n20 requests, both up   → { \"B\": 10, \"A\": 10 }\nSIGTERM A              → A drained\n20 requests, A gone    → { \"B\": 20 }     0 failures\n```\n\n> Two processes on one port, the kernel splitting connections evenly, and one of them removed mid-flight with nothing dropped. That is a complete zero-downtime deploy on a single host with no load balancer.\n\n---\n\n## And it does not work on a Mac\n\nSame code on macOS:\n\n```text\nA listen error: ENOTSUP\nB listen error: ENOTSUP\n```\n\n> `reusePort` is `SO_REUSEPORT` with Linux's load-balancing behaviour, and Node returns `ENOTSUP` on darwin rather than silently doing something different. Worth stating plainly because you cannot test this locally on a Mac, and without it the second process gets `EADDRINUSE`.\n\n---\n\n## The sequence, in order\n\n```text\n1  start the new version\n2  wait for its readiness check to pass\n3  send it traffic\n4  mark the old one not-ready\n5  SIGTERM the old one\n6  it drains and exits\n```\n\n> Step 2 is the one that gets skipped. Starting the new version and immediately routing to it means the first requests hit a process that has not connected to its database yet, so a \"zero-downtime\" deploy returns 500s for two seconds instead of refusing connections for two seconds.\n\n---\n\n## Rollback\n\n<b>Rollback</b> (returning to a version that worked).\n\n> The requirement is that it is <b>one command and does not involve a build</b>. If rolling back means reverting a commit and waiting for CI, your recovery time is your pipeline duration, during which the incident continues.\n>\n> Day 27's rule is what makes this possible: deploy the commit SHA. Redeploying `latest` is not a rollback, because `latest` is the broken one.",
      diagram: `Rolling restart is Day 27's pieces, x N

    readiness so traffic stops arriving
    SIGTERM reaching PID 1
    a drain that finishes inside the grace period

    → applied to more than one instance, and it
      fails for the SAME reasons


⚠⚠ The one-host version. VERIFIED on Linux.

    reusePort: several processes on ONE port, the
    kernel distributing connections.

    A listening, pid 10
    B listening, pid 19

    20 requests, both up  → { "B": 10, "A": 10 }
    SIGTERM A             → A drained
    20 requests, A gone   → { "B": 20 }
                            0 FAILURES

    two processes on one port, split evenly, one
    removed MID-FLIGHT with nothing dropped.

    → a complete zero-downtime deploy on a single
      host, with NO LOAD BALANCER


⚠ And it does not work on a Mac

    same code on macOS:

      A listen error: ENOTSUP
      B listen error: ENOTSUP

    reusePort is SO_REUSEPORT with Linux's
    load-balancing behaviour, and Node returns
    ENOTSUP on darwin rather than silently doing
    something different.

    → you CANNOT test this locally on a Mac

    → and without it, the second process gets
      EADDRINUSE


The sequence, in order

    1  start the new version
    2  WAIT FOR ITS READINESS CHECK TO PASS
    3  send it traffic
    4  mark the old one not-ready
    5  SIGTERM the old one
    6  it drains and exits

⚠ step 2 is the one that gets skipped.

    starting the new version and immediately
    routing to it means the first requests hit a
    process that has not connected to its database
    yet.

    → a "zero-downtime" deploy that returns 500s
      for two seconds instead of refusing
      connections for two seconds


Rollback

    the requirement: ONE COMMAND, NO BUILD.

    if rolling back means reverting a commit and
    waiting for CI, your recovery time IS your
    pipeline duration, and the incident continues
    throughout.

    → Day 27's rule is what makes it possible:
      DEPLOY THE COMMIT SHA.

      redeploying latest is not a rollback,
      because latest is the broken one.`,
      codeExample: {
        title: "reusePort, measured, and a deploy script",
        code: `// ── ✓ Two processes, one port, verified on Linux ────────────
import http from "node:http";

const tag = process.argv[2];
const server = http.createServer((req, res) => res.end(tag + "\\n"));

server.on("error", (e) => {
  console.log(tag, "listen error:", e.code);
  process.exit(1);
});

server.listen({ port: 3399, reusePort: true }, () =>
  console.log(tag, "listening, pid", process.pid),
);

process.on("SIGTERM", () =>
  server.close(() => {
    console.log(tag, "drained");
    process.exit(0);
  }),
);

// VERIFIED inside node:24-slim:
//
//   A listening, pid 10
//   B listening, pid 19
//   --- 20 requests, both up ---
//   {"B":10,"A":10}                 ← the kernel split them
//   --- SIGTERM A ---
//   A drained
//   --- 20 requests, A gone ---
//   {"B":20}                        ← 0 failures
//   B drained
//
// So the deploy is: start the new version with reusePort,
// wait until it is ready, SIGTERM the old one. No proxy
// reconfiguration, no load balancer, no dropped connection.


// ── ⚠ And what it does on macOS ─────────────────────────────
// Same file, same Node 24.14.1, run on darwin:
//
//   A listen error: ENOTSUP
//   B listen error: ENOTSUP
//
// And with reusePort removed:
//
//   A listening
//   B listen error: EADDRINUSE
//
// VERIFIED both ways. This is a Linux kernel feature, so the
// technique is untestable on a Mac laptop. Test it in a
// container, which is what the measurement above is.


// ── The deploy script the measurement implies ───────────────
// deploy.sh
//
//   set -euo pipefail
//   SHA=$1
//
//   # 1. Start the new version alongside the old one.
//   systemctl start api@\${SHA}
//
//   # 2. ⚠ WAIT FOR READINESS. This is the step people skip.
//   for i in $(seq 1 30); do
//     if curl -sf http://127.0.0.1:3399/health/ready >/dev/null; then
//       echo "new version ready after \${i}s"; break
//     fi
//     if [ "$i" = 30 ]; then
//       echo "new version never became ready, aborting"
//       systemctl stop api@\${SHA}      ← ⚠ and CLEAN UP
//       exit 1
//     fi
//     sleep 1
//   done
//
//   # 3. Old version drains and exits.
//   systemctl stop api@\${OLD_SHA}
//
//   echo \${SHA} > /srv/api/CURRENT
//   #             ^^^^^^^^^^^^^^^^ so rollback knows what to
//   #             go back to without asking a human
//
// The abort path matters as much as the happy path. Without
// it, a new version that fails to start leaves you with two
// versions serving traffic, one of them broken, and the
// kernel splitting requests evenly between them.


// ── ⚠ Readiness must actually mean ready ────────────────────
// ✗ Day 27's warning, in the deploy context:
app.get("/health/ready", async () => ({ ready: true }));
//   This passes before the pool has connected, so the deploy
//   script routes traffic to a process whose first 50
//   requests will throw.

// ✓ Ready means every dependency you cannot serve without:
let ready = false;

app.addHook("onReady", async () => {
  await app.db.query("SELECT 1");
  await app.redis.ping();
  await warmCriticalCaches();
  ready = true;
  app.log.info("ready to serve");
});

app.get("/health/ready", async (request, reply) => {
  reply.code(ready ? 200 : 503);
  return { ready };
});

// And the liveness one stays cheap, for Day 27's reason:
app.get("/health/live", async () => ({ status: "ok" }));


// ── Draining, with the delay Day 27 measured the need for ───
let shuttingDown = false;

process.on("SIGTERM", async () => {
  if (shuttingDown) return;
  shuttingDown = true;
  ready = false;                    // fail readiness FIRST
  app.log.info("SIGTERM, draining");

  // ⚠ Wait before closing. The load balancer needs a moment
  // to notice the readiness change, and requests already in
  // flight would otherwise be refused.
  await new Promise((r) => setTimeout(r, 5_000));

  await app.close();                // finishes in-flight work
  await app.db.end();
  app.log.info("drained cleanly");
  process.exit(0);
});

setTimeout(() => {
  app.log.error("drain exceeded 25s, exiting anyway");
  process.exit(1);
}, 25_000).unref();
// ⚠ 5s wait + up to 25s drain = 30s, which must fit inside
// the grace period. Day 27's arithmetic: Kubernetes defaults
// to 30, so this is exactly at the limit and a longer request
// would be SIGKILLed.


// ── Rollback, which must not involve a build ────────────────
// ✓ rollback.sh
//
//   PREV=$(cat /srv/api/PREVIOUS)
//   ./deploy.sh $PREV
//
// One command, and it reuses the same readiness-gated path, so
// a rollback cannot itself deploy a broken version blindly.
//
// ✗ The version that is not a rollback:
//
//   git revert HEAD && git push
//   → CI runs, builds, tests, deploys. Your recovery time is
//     your pipeline duration, and the incident continues
//     throughout it.
//
// ⚠ And the one that looks like a rollback but is not:
//
//   docker pull registry/app:latest && restart
//   → latest IS the broken version. Day 27's point: tag the
//     SHA, because latest is a pointer, not a version.
//
// The test of your rollback is not whether the script exists,
// it is whether you have run it in the last month. A rollback
// path that has never been exercised is a plan, not a
// capability.`,
      },
      keyTakeaways: [
        "Rolling restart is Day 27's readiness, SIGTERM and drain applied to several instances, and it fails for the same reasons.",
        "Verified on Linux: two processes with `reusePort: true` shared port 3399 and the kernel split 20 requests exactly 10/10.",
        "Verified: after SIGTERM to one, all 20 subsequent requests went to the other with zero failures.",
        "So `reusePort` is a complete zero-downtime deploy on a single host with no load balancer.",
        "Verified: the same code on macOS gives `ENOTSUP`, so this technique is untestable on a Mac and must be tried in a container.",
        "Without `reusePort` the second process gets `EADDRINUSE`.",
        "The deploy sequence is start, wait for readiness, route traffic, mark the old one not-ready, SIGTERM, drain.",
        "Waiting for readiness is the step that gets skipped, turning refused connections into 500s from a process with no database yet.",
        "A readiness check that returns true unconditionally defeats the whole sequence.",
        "Fail readiness before closing the server, then wait a few seconds so the load balancer notices.",
        "The wait plus the drain must fit the grace period: 5s plus 25s is exactly Kubernetes' 30s default.",
        "The deploy script needs an abort path, or a new version that never becomes ready leaves two versions serving, one broken.",
        "Rollback must be one command with no build, or your recovery time is your pipeline duration.",
        "Record the current SHA on deploy so rollback does not have to ask a human what was working.",
        "A rollback path you have not exercised in a month is a plan, not a capability.",
      ],
      commonMistakes: [
        "Routing traffic to the new version before its readiness check passes, so the deploy returns 500s instead of refusing connections.",
        "A readiness endpoint that always returns 200, which makes the gate meaningless.",
        "Closing the server the instant SIGTERM arrives, refusing requests already in flight.",
        "A drain plus pre-drain wait that exceeds the grace period, so every deploy ends in SIGKILL.",
        "Expecting `reusePort` to work on macOS, where it returns `ENOTSUP`.",
        "Starting a second process without `reusePort` and being surprised by `EADDRINUSE`.",
        "No abort path in the deploy script, leaving two versions serving traffic when the new one fails to start.",
        "Rolling back by reverting a commit and waiting for CI while the incident continues.",
        "Redeploying `latest` as a rollback, when `latest` is the broken build.",
        "Never exercising the rollback path, so its first use is during an incident.",
      ],
      quiz: [
        {
          question: "What did two processes with `reusePort: true` do on Linux?",
          options: [
            "The second failed with EADDRINUSE",
            "Both listened on port 3399, the kernel split 20 requests 10/10, and after SIGTERM to one all 20 went to the other with zero failures",
            "They alternated by second",
            "Requests were duplicated",
          ],
          correctIndex: 1,
          explanation:
            "That is a full zero-downtime deploy on a single host with no load balancer in front.",
        },
        {
          question: "What happens with `reusePort: true` on macOS?",
          options: [
            "It works the same",
            "`ENOTSUP`, because it is a Linux kernel feature, so the technique cannot be tested on a Mac laptop",
            "It silently ignores the option",
            "EADDRINUSE",
          ],
          correctIndex: 1,
          explanation:
            "Node reports it rather than doing something different. Without the option the second process gets `EADDRINUSE`.",
        },
        {
          question: "Which step of the deploy sequence is most often skipped?",
          options: [
            "Sending SIGTERM",
            "Waiting for the new version's readiness check, so traffic hits a process that has not connected to its database yet",
            "Marking the old one not-ready",
            "Draining",
          ],
          correctIndex: 1,
          explanation:
            "That turns a two-second connection refusal into two seconds of 500s, which is worse, not better.",
        },
        {
          question: "Why wait a few seconds after failing readiness before closing the server?",
          options: [
            "To flush logs",
            "The load balancer needs a moment to notice, so requests already in flight would otherwise be refused",
            "To finish migrations",
            "It is not needed",
          ],
          correctIndex: 1,
          explanation:
            "And that wait plus the drain must still fit the grace period: 5s plus 25s is exactly Kubernetes' 30s default.",
        },
        {
          question: "What makes a rollback usable during an incident?",
          options: [
            "A documented process",
            "One command, no build, deploying a recorded SHA. Reverting a commit makes your recovery time equal to your pipeline duration.",
            "A revert commit",
            "Redeploying `latest`",
          ],
          correctIndex: 1,
          explanation:
            "`latest` is a pointer, so redeploying it redeploys the broken version. And a rollback path never exercised is a plan, not a capability.",
        },
      ],
    },
    {
      id: "migrations",
      title: "Database migrations during a deploy",
      durationMinutes: 12,
      explanation:
        "## The problem\n\nDuring a rolling deploy, <b>both versions run at once</b>. So every migration has to be compatible with the old code as well as the new, at least for a few minutes.\n\n<b>Expand-and-contract</b> (changing a schema in compatible stages instead of one breaking step).\n\n```text\n1  expand    add the new thing, nullable, no code uses it\n2  deploy    new code writes both old and new\n3  backfill  fill the new column for existing rows\n4  switch    new code reads the new column\n5  contract  remove the old thing, a deploy later\n```\n\n> Five deploys where you wanted one. The reason to accept that is step 1 and step 5 are each individually safe, whereas a rename is not.\n\n---\n\n## The measurements\n\nPostgreSQL 17.11, a table with <b>2,000,000 rows</b>:\n\n```text\nADD COLUMN phone text                        0.84 ms\nADD COLUMN tier text NOT NULL DEFAULT 'free' 0.69 ms\nADD COLUMN country text NOT NULL             ERROR: contains null values\nUPDATE users SET phone = '000'               6,976 ms\nALTER COLUMN phone SET NOT NULL              1,324 ms\nRENAME COLUMN name TO full_name              0.46 ms\n```\n\n> Read the second line carefully, because it corrects common advice. <b>`ADD COLUMN ... NOT NULL DEFAULT` did not rewrite the table.</b> It took 0.69ms on two million rows, because PostgreSQL 11 and later store the default in the catalogue instead of writing every row. So the widespread warning to avoid it is out of date on any supported Postgres.\n>\n> And read the last line as the actual danger. A rename takes <b>0.46ms</b> and breaks every running copy of the old code the instant it commits. The dangerous migrations are not the slow ones, they are the fast ones that change a contract.\n\n---\n\n## What is genuinely slow\n\n> The backfill: <b>6.9 seconds</b> for a single `UPDATE` over two million rows, which is one long transaction holding row locks and generating a large amount of WAL. Do it in batches.\n>\n> And `SET NOT NULL` at <b>1.3 seconds</b>, which scans the table under an exclusive lock.\n\n---\n\n## A claim I could not reproduce\n\n> The widely repeated warning is that a queued `ALTER TABLE` blocks all subsequent reads on that table. I set it up deliberately: a transaction holding `AccessShareLock`, an `ALTER TABLE` waiting with `AccessExclusiveLock` and `granted = false`, then traffic.\n>\n> Ten `SELECT`s and five `UPDATE`s all completed in <b>0ms</b> while the DDL was queued.\n>\n> So on PostgreSQL 17.11 in that configuration it did not happen, and I am not going to repeat it as though I had seen it. What I <b>did</b> observe is the real deploy hazard: the migration itself waits indefinitely, so one forgotten `idle in transaction` connection stalls your deploy with no error.\n\n---\n\n## Which is why `lock_timeout` exists\n\n```text\nSET lock_timeout = '5s';\nALTER TABLE users ALTER COLUMN phone SET NOT NULL;\n→ ERROR: canceling statement due to lock timeout\n```\n\n> Verified. It turns \"the deploy hangs forever\" into \"the deploy fails in five seconds and you retry\", which is the outcome you want at 2am.",
      diagram: `The problem

    during a rolling deploy BOTH VERSIONS RUN AT
    ONCE.

    → every migration must be compatible with the
      OLD code too, at least for a few minutes


Expand-and-contract

    1  expand     add the new thing, nullable,
                  nothing uses it
    2  deploy     new code writes BOTH
    3  backfill   fill existing rows
    4  switch     new code READS the new column
    5  contract   remove the old thing, a deploy
                  later

    five deploys where you wanted one.

    the reason to accept it: steps 1 and 5 are each
    individually SAFE. a rename is not.


⚠⚠ MEASURED. PostgreSQL 17.11, 2,000,000 rows.

  ADD COLUMN phone text                  0.84 ms
  ADD COLUMN tier NOT NULL DEFAULT 'free'
                                         0.69 ms
  ADD COLUMN country text NOT NULL
                    ERROR: contains null values
  UPDATE users SET phone = '000'        6,976 ms
  ALTER COLUMN phone SET NOT NULL       1,324 ms
  RENAME COLUMN name TO full_name        0.46 ms


⚠ Line 2 CORRECTS common advice

    ADD COLUMN ... NOT NULL DEFAULT DID NOT
    REWRITE THE TABLE.

      0.69ms on two million rows.

      PostgreSQL 11+ stores the default in the
      CATALOGUE instead of writing every row.

    → the widespread warning to avoid it is OUT OF
      DATE on any supported Postgres


⚠⚠ And line 6 is the actual danger

    a RENAME takes 0.46ms and breaks every running
    copy of the old code THE INSTANT IT COMMITS.

    → the dangerous migrations are not the SLOW
      ones.

      they are the FAST ones that change a
      CONTRACT.


What is genuinely slow

    the BACKFILL      6,976 ms
      one long transaction, row locks, a large
      amount of WAL
      → do it in BATCHES

    SET NOT NULL      1,324 ms
      scans the table under an exclusive lock


⚠ A claim I could NOT reproduce

    the repeated warning: a queued ALTER TABLE
    blocks all subsequent READS on that table.

    set up deliberately:

      a txn holding AccessShareLock
      an ALTER waiting, AccessExclusiveLock,
        granted = false
      then traffic

    10 SELECTs and 5 UPDATEs → ALL 0ms

    → on PG 17.11 in that configuration IT DID NOT
      HAPPEN, and I will not repeat it as though I
      had seen it.

    what I DID observe is the real hazard:

      THE MIGRATION ITSELF WAITS INDEFINITELY.

      one forgotten "idle in transaction"
      connection stalls your deploy with no error.


Which is why lock_timeout exists

    SET lock_timeout = '5s';
    ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
    → ERROR: canceling statement due to lock
      timeout                        ← VERIFIED

    it turns "the deploy hangs forever" into "the
    deploy fails in five seconds and you retry".

    that is the outcome you want at 2am.`,
      codeExample: {
        title: "The migration measurements, and the safe sequence",
        code: `// ── The numbers, on 2,000,000 rows, PostgreSQL 17.11 ────────
//
//   ALTER TABLE users ADD COLUMN phone text;
//     Time: 0.844 ms
//
//   ALTER TABLE users ADD COLUMN tier text NOT NULL DEFAULT 'free';
//     Time: 0.692 ms                       ← ⚠ NOT a rewrite
//
//   ALTER TABLE users ADD COLUMN country text NOT NULL;
//     ERROR: column "country" of relation "users" contains null values
//     Time: 0.556 ms                       ← fails fast, safely
//
//   UPDATE users SET phone = '000';
//     Time: 6975.614 ms                    ← the slow one
//
//   ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
//     Time: 1323.809 ms                    ← scans, exclusive lock
//
//   ALTER TABLE users RENAME COLUMN name TO full_name;
//     Time: 0.462 ms                       ← ⚠⚠ THE DANGEROUS ONE
//
// The last two lines together are the lesson. The 1.3-second
// one is the one people fear. The 0.46ms one is the one that
// takes production down, because speed is not safety: it
// changes a contract that other running processes depend on.


// ── ⚠ Correcting the advice about NOT NULL DEFAULT ──────────
// You will read that adding a NOT NULL column with a default
// rewrites the whole table. That was true before PostgreSQL
// 11. Measured on 17.11 it was 0.69ms on two million rows,
// because the default is stored in the catalogue and applied
// on read.
//
// ✓ So this is safe on any supported Postgres:
//   ALTER TABLE users ADD COLUMN tier text NOT NULL DEFAULT 'free';
//
// ⚠ But note what it does to the OLD code, which is still
// running: an INSERT from the old version omits "tier" and
// gets 'free'. That is fine here and would not be if the
// column had no sensible default, which is the real reason to
// prefer nullable-then-backfill for anything meaningful.


// ── ✗ The migration that breaks a rolling deploy ────────────
//   ALTER TABLE users RENAME COLUMN name TO full_name;
//
// 0.46ms, and at millisecond 0.47 every instance still
// running the old code starts throwing:
//
//   error: column "name" does not exist
//
// During a rolling deploy that is guaranteed, not unlucky,
// because both versions run at once by design.


// ── ✓ Expand and contract, as five separate deploys ─────────
// Deploy 1: expand. Nothing reads it.
//   ALTER TABLE users ADD COLUMN full_name text;   -- 0.84ms

// Deploy 2: write both. Old code reads "name" and still works.
async function updateUser(db, id, name) {
  await db
    .update(users)
    .set({ name, fullName: name })     // ⚠ BOTH columns
    .where(eq(users.id, id));
}

// Deploy 3: backfill, in batches, NOT one UPDATE.
// The single-statement version measured 6,976ms.
async function backfill(db) {
  let moved = 0;
  for (;;) {
    const { rowCount } = await db.execute(sql\`
      WITH batch AS (
        SELECT id FROM users
        WHERE full_name IS NULL
        ORDER BY id
        LIMIT 5000
        FOR UPDATE SKIP LOCKED
      )
      UPDATE users u SET full_name = u.name
      FROM batch WHERE u.id = batch.id
    \`);
    if (rowCount === 0) break;
    moved += rowCount;
    log().info({ moved }, "backfilling");
    await new Promise((r) => setTimeout(r, 100));
    //                                   ^^^ ⚠ let replicas
    //                                   catch up and let
    //                                   normal traffic through
  }
}
// Batches keep each transaction short, keep WAL generation
// steady rather than spiky, and let you stop halfway without
// rolling back six seconds of work.
// FOR UPDATE SKIP LOCKED is Day 24's pattern, so a row your
// application is editing is skipped rather than contended.

// Deploy 4: switch reads to the new column, keep writing both.
// Deploy 5: contract, a day later, once nothing rolls back.
//   ALTER TABLE users DROP COLUMN name;


// ── ⚠⚠ The claim I could not reproduce ──────────────────────
// Setup, deliberately:
//
//   Session A:  BEGIN; SELECT count(*) FROM users; pg_sleep(12);
//   Session B:  ALTER TABLE users ADD COLUMN zr text;
//
//   SELECT pid, mode, granted FROM pg_locks
//     JOIN pg_stat_activity USING (pid)
//     WHERE relation = 'users'::regclass;
//
//     pid |        mode         | granted
//   ------+---------------------+---------
//     184 | AccessShareLock     | t         ← A holds it
//     192 | AccessExclusiveLock | f         ← B is QUEUED
//
// So the DDL is definitely waiting. Then, with it queued:
//
//   10 SELECTs:  0 0 0 0 0 0 0 0 0 0   (ms)
//   5 UPDATEs:   0 0 0 0 0             (ms)
//
// Every one completed immediately. The widely repeated
// warning that a queued DDL request freezes all later traffic
// on the table did NOT happen here.
//
// I am reporting that rather than repeating the folklore. It
// may depend on version or on the exact lock modes involved,
// so treat it as unverified rather than as false.
//
// ✓ What I DID observe, and what actually matters:
//   The ALTER waited the full 12 seconds. In production that
//   is indefinite. A single connection left "idle in
//   transaction" by a crashed script stalls your deploy with
//   no error message and no timeout.
//
//   $ SELECT pid, state, now() - state_change AS age, query
//       FROM pg_stat_activity
//       WHERE state = 'idle in transaction'
//       ORDER BY age DESC;
//
//   Run that when a migration hangs. It is almost always the
//   answer.


// ── ✓ lock_timeout, verified ────────────────────────────────
//   SET lock_timeout = '5s';
//   ALTER TABLE users ALTER COLUMN phone SET NOT NULL;
//
//   ERROR: canceling statement due to lock timeout   ← VERIFIED
//
// Put it in the migration runner, not in a comment:
export async function up(db) {
  await db.execute(sql\`SET lock_timeout = '5s'\`);
  await db.execute(sql\`SET statement_timeout = '30s'\`);
  await db.execute(sql\`ALTER TABLE users ADD COLUMN full_name text\`);
}
// Now a blocked migration fails in five seconds and the
// deploy reports it, instead of hanging while somebody
// wonders whether to press Ctrl-C on a production DDL.


// ── Where migrations run in the pipeline ────────────────────
// ✓ A separate step, before the new version starts, and it
//   must be safe for the OLD code:
//
//   deploy:
//     - run: npm run migrate      ← expand-only migrations
//     - run: ./deploy.sh $SHA     ← then the new version
//
// ✗ On application startup:
//     Every instance races to migrate. Most migration tools
//     take an advisory lock so it is not corruption, but N-1
//     instances now block on startup and fail their readiness
//     check, so your deploy times out.
//
// ✗ Manually, by hand, after the deploy:
//     The new code is already running against the old schema.
//
// ⚠ And keep the destructive step out of the automated path
//   entirely. "expand" runs in CI; DROP COLUMN is a deliberate
//   action a person takes on a quiet afternoon, because it is
//   the one that cannot be rolled back by redeploying.`,
      },
      keyTakeaways: [
        "During a rolling deploy both versions run at once, so every migration must be compatible with the old code too.",
        "Expand-and-contract is five deploys instead of one, and the reason to accept that is each step is individually safe.",
        "Measured on 2,000,000 rows: `ADD COLUMN` nullable took 0.84ms and a rename took 0.46ms.",
        "`ADD COLUMN ... NOT NULL DEFAULT` took 0.69ms and did not rewrite the table, which corrects advice written before PostgreSQL 11.",
        "`ADD COLUMN ... NOT NULL` with no default fails immediately with \"contains null values\" rather than locking anything.",
        "The dangerous migrations are the fast ones that change a contract: a 0.46ms rename breaks every old instance the instant it commits.",
        "The genuinely slow ones are a single-statement backfill at 6,976ms and `SET NOT NULL` at 1,324ms.",
        "Backfill in batches with `FOR UPDATE SKIP LOCKED` and a pause, so transactions stay short and WAL generation stays steady.",
        "The claim that a queued `ALTER TABLE` blocks later reads did not reproduce: with the DDL confirmed queued, ten SELECTs and five UPDATEs all took 0ms.",
        "What did happen is the real hazard: the migration waits indefinitely behind an open transaction, with no error.",
        "One connection left `idle in transaction` stalls a deploy, and `pg_stat_activity` is where you find it.",
        "Verified: `SET lock_timeout = '5s'` turns an indefinite hang into `canceling statement due to lock timeout`.",
        "Run migrations as a pipeline step before the new version starts, not on application startup where every instance races and fails readiness.",
        "Keep `DROP COLUMN` out of the automated path, because it is the step redeploying cannot undo.",
      ],
      commonMistakes: [
        "A rename or a drop during a rolling deploy, which breaks the old version that is still serving by design.",
        "Avoiding `ADD COLUMN ... NOT NULL DEFAULT` on the belief it rewrites the table, which measured 0.69ms on two million rows.",
        "Backfilling two million rows in one `UPDATE`, measured at 6,976ms in a single long transaction.",
        "No pause between batches, so replicas fall behind and normal traffic contends.",
        "No `lock_timeout`, so a blocked migration hangs the deploy with no error.",
        "Not checking `pg_stat_activity` for `idle in transaction` when a migration hangs, which is usually the cause.",
        "Repeating the claim that queued DDL freezes reads without having observed it.",
        "Running migrations on application startup, where instances race and fail their readiness checks.",
        "Running migrations by hand after the deploy, so new code meets the old schema.",
        "Automating `DROP COLUMN`, the one step a redeploy cannot roll back.",
        "Combining expand and contract in one migration, which removes the ability to roll the code back.",
      ],
      quiz: [
        {
          question: "Which of these measured migrations is the dangerous one, and why?",
          options: [
            "`SET NOT NULL` at 1,324ms, because it locks",
            "`RENAME COLUMN` at 0.46ms, because during a rolling deploy it breaks every instance still running the old code the instant it commits",
            "The 6,976ms backfill",
            "`ADD COLUMN` nullable",
          ],
          correctIndex: 1,
          explanation:
            "Speed is not safety. The dangerous migrations are the fast ones that change a contract other running processes depend on.",
        },
        {
          question: "What did `ADD COLUMN tier text NOT NULL DEFAULT 'free'` cost on two million rows?",
          options: [
            "A full table rewrite of several seconds",
            "0.69ms, because PostgreSQL 11 and later store the default in the catalogue, so the common warning against it is out of date",
            "It errored",
            "About 1.3 seconds",
          ],
          correctIndex: 1,
          explanation:
            "The version with no default failed immediately instead, with \"contains null values\".",
        },
        {
          question: "What happened when a queued `ALTER TABLE` was tested against live traffic?",
          options: [
            "All reads blocked until it completed",
            "Ten SELECTs and five UPDATEs all completed in 0ms, so the claim that queued DDL freezes reads did not reproduce",
            "The reads errored",
            "The ALTER was cancelled",
          ],
          correctIndex: 1,
          explanation:
            "The DDL was confirmed queued with `granted = false`. The real hazard observed was the migration itself waiting indefinitely.",
        },
        {
          question: "What does `SET lock_timeout = '5s'` buy a migration?",
          options: [
            "A faster migration",
            "It converts an indefinite hang behind an open transaction into a clear failure in five seconds that the deploy can report and retry",
            "It prevents locking",
            "It batches the work",
          ],
          correctIndex: 1,
          explanation:
            "Verified: `canceling statement due to lock timeout`. That is the outcome you want at 2am.",
        },
        {
          question: "Why should migrations not run on application startup?",
          options: [
            "They are too slow",
            "Every instance races for the migration lock, so the losers block on startup and fail their readiness checks, timing out the deploy",
            "They need more privileges",
            "It corrupts the database",
          ],
          correctIndex: 1,
          explanation:
            "Most tools take an advisory lock so it is not corruption, but it does break the deploy. Run migrations as a step before the new version starts.",
        },
        {
          question: "Why keep `DROP COLUMN` out of the automated pipeline?",
          options: [
            "It is slow",
            "It is the step a redeploy cannot undo, so it should be a deliberate action taken once nothing needs to roll back",
            "It requires downtime",
            "Migration tools do not support it",
          ],
          correctIndex: 1,
          explanation:
            "Expand is safe and automatable. Contract removes the thing an old version would need if you rolled back.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What was measured for a bare Fastify application's startup?",
      options: [
        "Under 5ms",
        "45-76ms for the import plus `await app.ready()`, on top of 20-30ms to start node at all",
        "About 500ms",
        "It could not be measured",
      ],
      correctIndex: 1,
      explanation:
        "That is the floor with no container and a warm cache, so a platform's cold start is that plus its sandbox.",
    },
    {
      question: "Why does serverless break Day 17's pool sizing?",
      options: [
        "Pools are unsupported",
        "It scales by process count, so `max: 10` across 100 instances asks for 1000 connections against a default limit of 100",
        "Connections cannot be reused",
        "It does not",
      ],
      correctIndex: 1,
      explanation:
        "You need a pooler in front, or `max: 1`. Code that was correct on a server exhausts the database.",
    },
    {
      question: "What goes wrong running PM2 inside a container?",
      options: [
        "Nothing",
        "Two managers argue about restarts, and a wedged app stays invisible to the liveness probe because the container is still up",
        "It cannot start",
        "Logs are lost",
      ],
      correctIndex: 1,
      explanation:
        "The same objection Day 26 raised about cluster, plus Day 27's risk of anything sitting in front of node.",
    },
    {
      question: "Why order CI steps by how fast they fail?",
      options: [
        "It does not matter",
        "Lint and typecheck take seconds, so running them before a minutes-long suite makes the most common failure cost the least time",
        "Alphabetical is required",
        "For caching",
      ],
      correctIndex: 1,
      explanation:
        "A type error found in 8 seconds rather than after 6 minutes is the difference between fixing it now and moving on.",
    },
    {
      question: "You add a dependency and forget the lockfile. What do `npm ci` and `npm install` do?",
      options: [
        "Both fail",
        "`npm ci` fails as out-of-sync, correctly, while `npm install` succeeds against a resolution nobody else has",
        "Both succeed",
        "`npm ci` fixes the lockfile",
      ],
      correctIndex: 1,
      explanation:
        "The most common source of \"works in CI, not locally\".",
    },
    {
      question: "What did caching do to `npm ci` on a 42-package tree?",
      options: [
        "Nothing",
        "2.01s cold, 1.15s warm, 0.92s with `--prefer-offline`, so the saving is avoiding the network",
        "It got slower",
        "10x faster",
      ],
      correctIndex: 1,
      explanation:
        "A small tree, and cache restore is not free either, so measure your own pipeline both ways.",
    },
    {
      question: "When does a Node version matrix earn its cost?",
      options: [
        "Always",
        "For a published library, since you do not control the consumer's version. For an application it mostly multiplies minutes and flake.",
        "Never",
        "Only with TypeScript",
      ],
      correctIndex: 1,
      explanation:
        "For an application, matrix over what varies, like the database version, and keep an upgrade check non-blocking.",
    },
    {
      question: "What did two processes with `reusePort: true` do on Linux?",
      options: [
        "The second failed",
        "Both listened on one port, the kernel split 20 requests 10/10, and after SIGTERM to one all 20 went to the other with zero failures",
        "They alternated by second",
        "Requests duplicated",
      ],
      correctIndex: 1,
      explanation:
        "A complete zero-downtime deploy on a single host with no load balancer.",
    },
    {
      question: "What does `reusePort: true` do on macOS?",
      options: [
        "Works the same",
        "`ENOTSUP`, because it is a Linux kernel feature, so the technique cannot be tested on a Mac",
        "Silently ignored",
        "EADDRINUSE",
      ],
      correctIndex: 1,
      explanation:
        "Without the option the second process gets `EADDRINUSE` instead.",
    },
    {
      question: "Which deploy step is most often skipped?",
      options: [
        "Sending SIGTERM",
        "Waiting for the new version's readiness check, so traffic hits a process with no database connection yet",
        "Marking the old one not-ready",
        "Draining",
      ],
      correctIndex: 1,
      explanation:
        "That turns a two-second connection refusal into two seconds of 500s, which is worse.",
    },
    {
      question: "What makes a rollback usable during an incident?",
      options: [
        "Documentation",
        "One command, no build, deploying a recorded SHA. A revert commit makes recovery time equal to pipeline duration.",
        "A revert commit",
        "Redeploying `latest`",
      ],
      correctIndex: 1,
      explanation:
        "`latest` is a pointer, so redeploying it redeploys the broken build. And an unexercised rollback is a plan, not a capability.",
    },
    {
      question: "Which measured migration is the dangerous one?",
      options: [
        "`SET NOT NULL` at 1,324ms",
        "`RENAME COLUMN` at 0.46ms, because it breaks every instance still running the old code the instant it commits",
        "The 6,976ms backfill",
        "`ADD COLUMN` nullable",
      ],
      correctIndex: 1,
      explanation:
        "Speed is not safety. The dangerous ones are fast and change a contract other processes depend on.",
    },
    {
      question: "What did `ADD COLUMN tier NOT NULL DEFAULT 'free'` cost on two million rows?",
      options: [
        "A multi-second rewrite",
        "0.69ms, because PostgreSQL 11+ store the default in the catalogue, so the usual warning is out of date",
        "It errored",
        "1.3 seconds",
      ],
      correctIndex: 1,
      explanation:
        "The version with no default failed instantly instead, with \"contains null values\".",
    },
    {
      question: "What happened when a queued `ALTER TABLE` was tested against live traffic?",
      options: [
        "All reads blocked",
        "Ten SELECTs and five UPDATEs all took 0ms, so the claim that queued DDL freezes reads did not reproduce",
        "The reads errored",
        "The ALTER was cancelled",
      ],
      correctIndex: 1,
      explanation:
        "The DDL was confirmed queued with `granted = false`. The observed hazard was the migration waiting indefinitely.",
    },
    {
      question: "What does `SET lock_timeout = '5s'` buy a migration?",
      options: [
        "Speed",
        "It turns an indefinite hang behind an open transaction into a clear five-second failure the deploy can report",
        "It prevents locking",
        "It batches work",
      ],
      correctIndex: 1,
      explanation:
        "Verified: `canceling statement due to lock timeout`.",
    },
    {
      question: "How should a two-million-row backfill be done?",
      options: [
        "One `UPDATE`",
        "In batches with `FOR UPDATE SKIP LOCKED` and a pause, since the single statement measured 6,976ms in one long transaction",
        "On application startup",
        "By hand in psql",
      ],
      correctIndex: 1,
      explanation:
        "Batches keep transactions short, WAL steady, and let you stop halfway without losing the work.",
    },
    {
      question: "Why not run migrations on application startup?",
      options: [
        "Too slow",
        "Instances race for the lock, so the losers block on startup and fail readiness, timing out the deploy",
        "Privileges",
        "It corrupts data",
      ],
      correctIndex: 1,
      explanation:
        "An advisory lock prevents corruption but not the broken deploy. Migrate as a step before the new version starts.",
    },
    {
      question: "Why keep `DROP COLUMN` out of the automated pipeline?",
      options: [
        "It is slow",
        "It is the step a redeploy cannot undo, so it belongs after nothing needs to roll back",
        "Downtime",
        "Tools do not support it",
      ],
      correctIndex: 1,
      explanation:
        "Expand is safe and automatable. Contract removes what a rolled-back version would need.",
    },
    {
      question: "Why must every migration be compatible with the old code?",
      options: [
        "For rollbacks only",
        "During a rolling deploy both versions run at once by design, so incompatibility is guaranteed rather than unlucky",
        "Because of caching",
        "It need not be",
      ],
      correctIndex: 1,
      explanation:
        "That is the whole reason expand-and-contract is worth five deploys instead of one.",
    },
    {
      question: "What was the tradeoff with `node --run`?",
      options: [
        "Slower",
        "About 3x faster than `npm run`, but it skips pre/post scripts and `.npmrc`",
        "It cannot run scripts",
        "It needs a lockfile",
      ],
      correctIndex: 1,
      explanation:
        "Measured at 30ms against 100ms on a no-op, so the difference is npm's own startup.",
    },
  ],
  project: {
    name: "day-28",
    goal: "Build a pipeline where pushing to main deploys with no dropped requests, run a real expand-and-contract migration against two million rows, and prove the rollback works by using it.",
    brief:
      "The two things that will actually teach you something here are the migration timings and the rollback. Seed two million rows before you start, because a migration on a thousand rows tells you nothing. And do the rename the wrong way first, during a rolling deploy, so you see the old version throwing while the new one works. That failure is the reason expand-and-contract is worth five deploys.",
    steps: [
      "Take the Day 27 containerised application and add `.nvmrc` plus an `engines.node` range.",
      "Verify `engines` does nothing on its own: set it to `>=99.0.0`, run `npm install`, and record the exit code.",
      "Add `engine-strict=true` to `.npmrc`, repeat, and record the exit code.",
      "Write a GitHub Actions workflow with a concurrency group, `setup-node` reading `.nvmrc`, and `npm ci --prefer-offline`.",
      "Order the steps lint, typecheck, test, build, and record the time to first failure when you deliberately introduce a type error.",
      "Reorder so tests run first, repeat the same broken commit, and record the difference.",
      "Time `npm ci` with a cold cache, a warm cache, and `--prefer-offline`. Record all three.",
      "Time `npm run` against `node --run` for one of your scripts, three runs each.",
      "Add a CI test that fails if `.nvmrc` and `engines.node` disagree.",
      "Add a CI test that fails if the Dockerfile lacks a `USER` line or uses the shell form of `CMD`.",
      "Deliberately add a dependency without committing the lockfile and record what `npm ci` does versus `npm install`.",
      "Write a `systemd` unit that runs node directly, with `Restart`, `RestartSec` and a `TimeoutStopSec` longer than your drain.",
      "Set `TimeoutStopSec` shorter than your drain, restart under load, and record what happens to in-flight requests.",
      "Inside a Linux container, run two instances of your app with `reusePort: true` and record how 20 requests are distributed.",
      "Try the same on your host machine and record the error.",
      "SIGTERM one instance mid-load and record how many requests failed.",
      "Write a deploy script that starts the new version, polls readiness, then stops the old one.",
      "Make readiness return 200 unconditionally, deploy under load, and record the error rate.",
      "Fix readiness to check the database and cache, repeat, and record the error rate again.",
      "Add an abort path to the deploy script, make the new version fail to start, and confirm you end with one healthy version rather than two.",
      "Seed a `users` table with two million rows.",
      "Time `ADD COLUMN` nullable, `ADD COLUMN NOT NULL DEFAULT`, and `ADD COLUMN NOT NULL` with no default. Record all three.",
      "Time a single-statement backfill of all two million rows.",
      "Rewrite it as batches with `FOR UPDATE SKIP LOCKED` and a pause, and record the total time and the longest single transaction.",
      "Time `SET NOT NULL` and `RENAME COLUMN`.",
      "Now do the unsafe thing: run a rolling deploy of new code while renaming a column the old code reads, and capture the old version's errors.",
      "Redo the same change as expand, deploy, backfill, switch, contract, and confirm no errors at any stage.",
      "Open a transaction and leave it idle, then run a migration without `lock_timeout` and record how long it waits.",
      "Add `SET lock_timeout = '5s'` and record the error you get instead.",
      "Find the blocking session in `pg_stat_activity` and write down the query you used.",
      "Move migrations into the application's startup path, deploy three instances, and record what happens to their readiness checks.",
      "Move them back to a pipeline step before the deploy.",
      "Deploy a deliberately broken version, then roll back using only your rollback script, and record the total time from bad deploy to recovery.",
      "Write the report: the pipeline timings, the migration table, the rolling-deploy error counts with and without readiness, and your measured recovery time.",
    ],
    acceptance: [
      "You have exit codes for `engines` with and without `engine-strict`.",
      "You have time-to-first-failure for both CI step orderings on the same broken commit.",
      "You have three `npm ci` timings and two `node --run` versus `npm run` timings.",
      "CI fails when `.nvmrc` and `engines` disagree, and when the Dockerfile has no `USER` line.",
      "You recorded what `npm ci` and `npm install` each do with an out-of-sync lockfile.",
      "You have the in-flight request outcome for `TimeoutStopSec` shorter than the drain.",
      "You have the `reusePort` request distribution from a Linux container and the error from your host.",
      "You have a failed-request count from SIGTERMing one instance mid-load, and it is zero.",
      "You have error rates for the deploy with a fake readiness check and with a real one.",
      "The deploy script's abort path leaves exactly one healthy version running.",
      "You have timings on two million rows for all five migration operations.",
      "You have the single-statement backfill time and the batched total, plus the longest single transaction in the batched version.",
      "You captured the old version's errors from the unsafe rename during a rolling deploy.",
      "The expand-and-contract version of the same change produced no errors at any stage.",
      "You have the wait time for a migration blocked with no `lock_timeout`, and the error with one.",
      "You have the `pg_stat_activity` query that found the blocking session.",
      "You recorded what startup migrations did to three instances' readiness checks.",
      "You have a measured recovery time from a bad deploy using only the rollback script.",
      "`npx tsc --noEmit` passes and the full pipeline is green on a real push.",
    ],
    stretch: [
      "Run the load generator throughout an entire rolling deploy and prove zero non-2xx responses across the whole window.",
      "Add a canary step that sends 5% of traffic to the new version and rolls back automatically on an error-rate threshold.",
      "Measure your cold start on a real serverless platform and compare it with your local 45-76ms floor.",
      "Set up a connection pooler and show that 100 concurrent function instances no longer exhaust `max_connections`.",
      "Test the queued-DDL claim on PostgreSQL 15 and 16 and see whether reads block on either.",
      "Add a migration linter to CI that rejects a rename or a drop in the same commit as application code.",
      "Build a blue-green deploy with two `reusePort` groups and compare the switch time with rolling.",
      "Add a database version matrix to CI and find a query whose plan differs between two versions.",
      "Instrument the deploy with Day 21's tracing so a deploy appears as a span alongside the request latency it affects.",
      "Write a chaos test that SIGKILLs an instance mid-request and measure what the client sees, then compare with SIGTERM.",
    ],
  },
};
