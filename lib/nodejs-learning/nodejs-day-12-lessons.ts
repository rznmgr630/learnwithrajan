import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_12_LESSONS: LessonDay = {
  day: 12,
  title: "npm, packages and dependency hygiene",
  totalMinutes: 98,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "package-json",
      title: "npm and package.json",
      durationMinutes: 10,
      explanation:
        "Node gives you the runtime. <b>npm gives you the ecosystem.</b>\n\nA professional Node developer should not only know how to install packages, but what gets installed, why, how versions are selected, and how to keep dependencies safe.\n\n```text\nYour project\n    │\n    ├── package.json\n    │      ↓\n    │   What we want\n    │\n    ├── package-lock.json\n    │      ↓\n    │   Exactly what was resolved\n    │\n    └── node_modules/\n           ↓\n        What is installed\n```\n\nThose three layers are the whole day. Most confusion about npm comes from mixing them up.\n\n---\n\n## What is npm?\n\n<b>npm</b> (Node Package Manager, the package manager and registry commonly used with Node).\n\n```text\nInstall packages\nRemove packages\nUpdate packages\nRun scripts\nPublish packages\nManage versions\nAudit dependencies\n```\n\n```bash\nnpm install express\n```\n\nsays:\n\n```text\nFind express\n    ↓\nResolve its dependencies\n    ↓\nInstall everything\n    ↓\nUpdate package.json\n    ↓\nUpdate package-lock.json\n```\n\nWorth noticing that npm is <b>two things</b>: a CLI and a registry. They ship together, so it is easy to treat them as one, but the registry is a public service anyone can publish to. That fact is the whole basis of the security lesson later.\n\n---\n\n## `package.json`\n\n```javascript\n{\n  \"name\": \"my-api\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"scripts\": {\n    \"dev\": \"node --watch src/server.js\",\n    \"start\": \"node src/server.js\"\n  },\n  \"dependencies\": {\n    \"some-package\": \"^2.0.0\"\n  },\n  \"devDependencies\": {\n    \"some-tool\": \"^1.0.0\"\n  },\n  \"engines\": {\n    \"node\": \">=24\"\n  }\n}\n```\n\n```text\npackage.json\n     ↓\nProject metadata\n+\nDependency declaration\n+\nScripts\n+\nRuntime configuration\n```\n\n---\n\n## The fields\n\n<b>`name`</b> (the package or project name). For an application it is just an identifier. For a published package it is the public name, which cannot be changed later.\n\n<b>`version`</b> follows <b>SemVer</b>, covered properly in a moment.\n\n<b>`description`</b> (a short explanation of what it does). Mostly matters when publishing.\n\n<b>`license`</b> (the legal terms for reuse): `MIT`, `Apache-2.0`, `GPL-3.0`, `ISC`. Worth setting even on a private project, because omitting it means \"all rights reserved\" by default, and some tooling flags an unlicensed dependency.\n\n<b>`type`</b> tells Node how to read `.js` files:\n\n```javascript\n{\n  \"type\": \"module\"\n}\n```\n\nDay 2's decision, and the field with the most reach in the whole file. With it, `.js` is ESM. Without it, CommonJS. `.mjs` and `.cjs` override either way.\n\n---\n\n## Two fields for an application\n\nOne small thing that saves confusion. For an application you never publish, `\"private\": true` stops an accidental `npm publish` from putting your code on the public registry. It costs one line and it has saved people real embarrassment.\n\nAnd `\"version\"` is meaningless for an application. Nobody depends on it, so leaving it at `1.0.0` forever is fine. It matters only for a published package, which is what the last lessons are about.",
      diagram: `Three layers, and most confusion is mixing them up

    package.json          WHAT WE WANT
      "express": "^5.0.0"   a range, a wish
           ↓
    package-lock.json     WHAT WAS RESOLVED
      express 5.0.2         one exact version, plus
      + 40 transitive       every dependency of it
           ↓
    node_modules/         WHAT IS INSTALLED
      the actual files      built from the lockfile


npm is two things

    the CLI          install, run, publish, audit
    the REGISTRY     a public service ANYONE can
                     publish to
                       └─ which is the entire basis of
                          the security lesson later


The fields that matter, and why

    name         cannot be changed once published
    version      meaningless for an APPLICATION.
                 nobody depends on it. leave it alone.
    license      omitting it means "all rights reserved"
                 by default, and tooling flags it
    type         Day 2's decision. the field with the
                 most reach in the whole file.
                   "module"  →  .js is ESM
                   absent    →  .js is CommonJS
                   .mjs/.cjs override either way

    private: true
      one line that stops an accidental npm publish
      from putting your application on the public
      registry`,
      codeExample: {
        title: "A package.json for an application",
        code: `// package.json
// {
//   "name": "my-api",
//   "private": true,              ← cannot be published by accident
//   "version": "1.0.0",           ← meaningless here, leave it
//   "description": "REST API for managing users",
//   "license": "MIT",
//   "type": "module",             ← Day 2: .js files are ESM
//
//   "scripts": {
//     "dev":       "node --watch --env-file=.env src/server.js",
//     "start":     "node src/server.js",
//     "test":      "node --test",
//     "typecheck": "tsc --noEmit"
//   },
//
//   "dependencies": {
//     "express": "^5.0.0"
//   },
//   "devDependencies": {
//     "typescript": "^5.0.0",
//     "@types/node": "^24.0.0"
//   },
//
//   "engines": { "node": ">=24" }
// }


// ── What "npm install express" actually did ─────────────────
//
// 1. asked the registry for express and its dependency tree
// 2. resolved every version in that tree
// 3. wrote the files into node_modules/
// 4. added "express": "^5.0.0" to package.json      (the WISH)
// 5. recorded every resolved version in the lockfile (the FACT)
//
// Four and five are different, which is the point of the
// next few lessons.


// ── Inspecting the three layers ─────────────────────────────
// $ cat package.json | grep -A3 dependencies
//   "express": "^5.0.0"                    ← a range
//
// $ npm ls express
//   my-api@1.0.0
//   └── express@5.0.2                      ← what was chosen
//
// $ npm ls --all | wc -l
//   67                                     ← what is installed
//
// One direct dependency, 67 packages on disk. That gap is
// the security lesson later.


// ── The two fields people skip ──────────────────────────────
// "private": true
//   For an application. One line, and npm publish refuses.
//
// "license": "MIT"
//   Omit it and the default is "all rights reserved", which
//   some dependency scanners flag on your own package.`,
      },
      keyTakeaways: [
        "Three layers: `package.json` is what you <b>want</b>, the lockfile is what was <b>resolved</b>, `node_modules` is what is <b>installed</b>.",
        "Most npm confusion is mixing those three up.",
        "npm is both a <b>CLI and a public registry</b> anyone can publish to.",
        "That second fact is the entire basis of the supply-chain lesson.",
        "`name` cannot be changed once published.",
        "`version` is meaningless for an application. Nobody depends on it.",
        "`license` matters even privately: omitting it means \"all rights reserved\" by default.",
        "`type: \"module\"` is Day 2's decision and the field with the most reach in the file.",
        "<b>`\"private\": true`</b> on an application stops an accidental `npm publish`.",
        "One direct dependency can mean dozens of packages on disk. That gap matters later.",
      ],
      commonMistakes: [
        "<b>Treating `package.json` and the lockfile as the same thing</b> — one is a range, the other is a resolved fact.",
        "<b>Omitting `\"private\": true` on an application</b> — one mistyped command publishes your code.",
        "<b>Bumping an application's `version` by hand</b> — nothing consumes it.",
        "<b>Leaving out `license`</b> — the default is all rights reserved, and scanners flag it.",
        "<b>Forgetting `type: \"module\"`</b> — your `import` statements fail, as in Day 2.",
      ],
      quiz: [
        {
          question: "What is the difference between `package.json` and `package-lock.json`?",
          options: [
            "They are the same, one is generated",
            "`package.json` declares ranges you want, the lockfile records the exact versions that were resolved",
            "The lockfile lists only direct dependencies",
            "`package.json` is for production, the lockfile for development",
          ],
          correctIndex: 1,
          explanation:
            "One is a wish, the other is a fact. Keeping those distinct, along with `node_modules` as what is actually on disk, resolves most confusion about npm.",
        },
        {
          question: "Why add `\"private\": true` to an application's `package.json`?",
          options: [
            "It hides the source from `npm ls`",
            "`npm publish` refuses, so you cannot accidentally put your application on the public registry",
            "It encrypts the lockfile",
            "It is required for workspaces",
          ],
          correctIndex: 1,
          explanation:
            "One line, and the mistake becomes impossible. Anyone can publish to the npm registry, including you by accident.",
        },
      ],
    },
    {
      id: "scripts",
      title: "npm scripts",
      durationMinutes: 8,
      explanation:
        "```javascript\n{\n  \"scripts\": {\n    \"dev\": \"node --watch src/server.js\",\n    \"start\": \"node src/server.js\",\n    \"test\": \"node --test\"\n  }\n}\n```\n\n```bash\nnpm run dev\nnpm test\nnpm start\n```\n\n<b>npm scripts</b> (named commands stored in `package.json`).\n\nThey give your team a consistent way to run project commands.\n\nThat is the real value, and it is worth being explicit about. A script is <b>documentation that runs</b>. \"How do I start this locally?\" has one answer, in the repository, that cannot drift out of date because everyone uses it. Day 1's `node --watch --env-file=.env` is a good example: nobody should have to remember those flags.\n\n---\n\n## Two things scripts do for you\n\n<b>They put `node_modules/.bin` on the PATH.</b> So a script can say `tsc --noEmit` and it resolves to the local TypeScript, not a global one. Run `tsc` in your shell and you get whatever is installed globally, or nothing. That is why `npm run typecheck` works when `tsc` does not.\n\n<b>`start` and `test` are special.</b> They run without `run`: `npm test`, `npm start`. Everything else needs `npm run <name>`.\n\n---\n\n## Script hooks\n\n```javascript\n{\n  \"scripts\": {\n    \"pretest\": \"node scripts/setup.js\",\n    \"test\": \"node --test\",\n    \"posttest\": \"node scripts/cleanup.js\"\n  }\n}\n```\n\n```bash\nnpm test\n```\n\ngives:\n\n```text\npretest\n   ↓\ntest\n   ↓\nposttest\n```\n\nUseful, but do not build a maze. Keep important workflows obvious.\n\nOne genuinely good use: <b>`prepublishOnly`</b> to build before publishing, so you cannot ship a stale `dist`. Day 5's build step, enforced.\n\nAnd one trap: `posttest` <b>does not run if `test` fails</b>, so it is the wrong place for cleanup you actually need. Use a `finally` inside the script itself.\n\n---\n\n## Arguments\n\n```javascript\n{\n  \"scripts\": {\n    \"start\": \"node src/server.js\"\n  }\n}\n```\n\n```bash\nnpm run start -- --port 4000\n```\n\n```text\nnpm arguments\n     │\n     ↓\nstop here\n     │\n     ↓\narguments for your script\n```\n\nWithout the `--`, npm consumes the flags itself. `npm run start --port 4000` passes nothing to your script and npm silently ignores an option it does not know, which is a confusing five minutes.\n\nDay 1's `process.argv` is what receives them on the other side.",
      diagram: `A script is documentation that runs

    "how do I start this locally?"
        │
        └─► one answer, in the repository, that
            cannot drift out of date

    "dev": "node --watch --env-file=.env src/server.js"
             └─ nobody should have to remember these


Two things scripts do that your shell does not

    node_modules/.bin IS ON THE PATH
      script:  "tsc --noEmit"     → the LOCAL typescript
      shell:   tsc --noEmit       → a global one, or nothing

      which is why npm run typecheck works when tsc
      does not


    start AND test ARE SPECIAL
      npm test        ✓  no "run" needed
      npm start       ✓
      npm dev         ✗  needs npm run dev


Hooks: one good use, one trap

    prepublishOnly    ✓ build before publishing, so you
                        cannot ship a stale dist.
                        Day 5's build step, enforced.

    posttest          ✗ does NOT run if test FAILS
                        so it is the wrong place for
                        cleanup you actually need.
                        use a finally inside the script.


The -- that everyone forgets

    npm run start -- --port 4000
                  └┬┘
                   │ everything after goes to YOUR script
                   │
    npm run start --port 4000
                  └─ npm eats it, and silently ignores
                     an option it does not know.
                     your script receives nothing.

    Day 1's process.argv is what catches them.`,
      codeExample: {
        title: "Scripts worth having",
        code: `// package.json
// {
//   "scripts": {
//     // ── the everyday ones ──────────────────────────────
//     "dev":       "node --watch --env-file=.env src/server.js",
//     "start":     "node src/server.js",
//     "test":      "node --test",
//     "typecheck": "tsc --noEmit",
//     "lint":      "eslint .",
//
//     // ── one composite, so CI has a single entry ────────
//     "check": "npm run typecheck && npm run lint && npm test",
//
//     // ── the good hook: cannot ship a stale build ───────
//     "build":          "tsc",
//     "prepublishOnly": "npm run build"
//   }
// }


// ── Why the local bin path matters ──────────────────────────
// $ tsc --noEmit
//   zsh: command not found: tsc          ← not installed globally
//
// $ npm run typecheck
//   (works)                              ← node_modules/.bin is
//                                           on the PATH
//
// So a script never needs a global install, and everyone on
// the team runs the same version of the tool.


// ── start and test skip the "run" ───────────────────────────
// npm start        ✓
// npm test         ✓
// npm run dev      ✓
// npm dev          ✗  Unknown command: "dev"


// ── The -- separator ────────────────────────────────────────
// npm run start -- --port 4000
//   → node src/server.js --port 4000
//   → process.argv includes "--port" and "4000"
//
// npm run start --port 4000
//   → node src/server.js
//   → npm consumed --port itself and ignored it.
//     Your script gets nothing, with no warning.


// ── The posttest trap ───────────────────────────────────────
// "pretest":  "node scripts/seed.js",
// "test":     "node --test",
// "posttest": "node scripts/cleanup.js"
//
// tests pass  →  pretest, test, posttest
// tests FAIL  →  pretest, test.  posttest never runs.
//
// So the database you seeded is still there. Cleanup that
// must happen belongs inside the test setup, in a finally.


// ── Reading the arguments, from Day 1 ───────────────────────
const args = process.argv.slice(2);
const portFlag = args.indexOf("--port");
const port = portFlag !== -1 ? Number(args[portFlag + 1]) : 3000;

console.log("args:", args);
console.log("port:", port);`,
      },
      keyTakeaways: [
        "A script is <b>documentation that runs</b>: one answer to \"how do I start this\" that cannot drift.",
        "Scripts put <b>`node_modules/.bin` on the PATH</b>, so `tsc` resolves to the local install.",
        "That is why `npm run typecheck` works when `tsc` in your shell does not.",
        "<b>`start` and `test` are special</b> and skip the `run`. Everything else needs `npm run <name>`.",
        "Hooks give you `pre` and `post` around any script.",
        "<b>`prepublishOnly`</b> is the genuinely good one: it stops you shipping a stale build.",
        "<b>`posttest` does not run when `test` fails</b>, so it is the wrong place for necessary cleanup.",
        "`npm run start -- --port 4000` passes the flags on. Without the `--`, npm eats them.",
        "And npm silently ignores an option it does not recognise, so nothing tells you.",
        "Day 1's `process.argv` is what receives them.",
      ],
      commonMistakes: [
        "<b>Forgetting the `--` before script arguments</b> — npm consumes them and says nothing.",
        "<b>Putting necessary cleanup in `posttest`</b> — it is skipped when the tests fail, which is exactly when you need it.",
        "<b>Installing a tool globally to run it</b> — a script already has `node_modules/.bin` on the PATH.",
        "<b>Building a deep chain of `pre` and `post` hooks</b> — the workflow becomes impossible to follow.",
        "<b>Documenting commands in the README instead of scripts</b> — prose drifts, scripts do not.",
        "<b>`npm dev` instead of `npm run dev`</b> — only `start` and `test` skip the `run`.",
      ],
      quiz: [
        {
          question: "Why does `npm run typecheck` work when running `tsc` directly says \"command not found\"?",
          options: [
            "npm installs it on demand",
            "npm scripts put `node_modules/.bin` on the PATH, so the local install resolves",
            "npm has a built-in TypeScript compiler",
            "The script uses a different name",
          ],
          correctIndex: 1,
          explanation:
            "That is why a project never needs a global install for its own tooling, and why everyone on the team runs the same version.",
        },
        {
          question: "Your tests fail. Does `posttest` run?",
          options: [
            "Yes, always",
            "No. It only runs when `test` succeeds",
            "Only with `--force`",
            "Yes, but after a delay",
          ],
          correctIndex: 1,
          explanation:
            "Which makes it the wrong place for cleanup you actually need, because a failing test is exactly when the leftover state matters. Put it in a `finally` inside the script.",
        },
        {
          question: "What does `npm run start --port 4000` pass to your script?",
          options: [
            "`--port 4000`",
            "Nothing. npm consumes the flag itself and ignores it silently",
            "An error",
            "Only `4000`",
          ],
          correctIndex: 1,
          explanation:
            "You need `npm run start -- --port 4000`. Without the separator npm treats it as its own option, does not recognise it, and says nothing.",
        },
      ],
    },
    {
      id: "dependency-types",
      title: "The four dependency types",
      durationMinutes: 10,
      explanation:
        "## `dependencies`\n\n```javascript\n{\n  \"dependencies\": {\n    \"express\": \"^5.0.0\"\n  }\n}\n```\n\n<b>`dependencies`</b> (packages the application needs when it runs in production).\n\n```text\nYour API\n  ↓\nExpress\n  ↓\nApplication runs\n```\n\n> Needed at runtime? Put it in `dependencies`.\n\n---\n\n## `devDependencies`\n\n```javascript\n{\n  \"devDependencies\": {\n    \"typescript\": \"^5.0.0\"\n  }\n}\n```\n\n<b>`devDependencies`</b> (needed during development, testing, linting or building, but not by the running application).\n\n```text\nTypeScript\nESLint\nPrettier\nTest runners\nBuild tools\n```\n\n```text\nNeeded to RUN application?\n    ↓\ndependencies\n\nNeeded to DEVELOP application?\n    ↓\ndevDependencies\n```\n\n---\n\n## Why the split is not cosmetic\n\nIt looks like bookkeeping until you deploy. `npm ci --omit=dev` installs only `dependencies`, which is what a production image should do. The effect is real: skipping TypeScript, ESLint, Prettier and a test runner often halves the install and cuts a lot off the image size.\n\nAnd it is a <b>security</b> boundary, not just a size one. A vulnerability in a dev dependency is not in your running container at all, which is why `npm audit` reports on them separately. Getting the split wrong means either shipping tools you do not need, or a production crash from a missing module that worked fine locally.\n\nThat second failure is the one to watch for. A package in `devDependencies` that the application actually imports works perfectly in development and fails on the first production start with `ERR_MODULE_NOT_FOUND`.\n\nThe test worth applying: <b>does the deployed process import it?</b> Not \"is it a tool\", not \"did I use it while developing\". A build tool that runs before deploy is a dev dependency even if the build is essential.\n\n---\n\n## `peerDependencies`\n\n```javascript\n{\n  \"peerDependencies\": {\n    \"react\": \"^19.0.0\"\n  }\n}\n```\n\n<b>`peerDependencies`</b> (packages your package expects the consuming application to provide).\n\nImportant for libraries.\n\n```text\nMy React library\n      ↓\nexpects React\n      ↓\nApplication provides React\n```\n\nYou do not want every library bundling its own React.\n\nThe reason is sharper than \"avoid duplication\": two copies of React in one app is a <b>bug</b>, not just waste. Hooks break, context does not match. Same for anything holding shared state, which is why plugins for ESLint, Prettier and test frameworks all use peer dependencies.\n\nSo the rule: if your package and its consumer must use the <b>same instance</b> of something, it is a peer dependency.\n\nOne practical note: modern npm installs peer dependencies automatically, so a missing one is a warning rather than a hard failure. Do not rely on the consumer noticing.\n\n---\n\n## `optionalDependencies`\n\n```javascript\n{\n  \"optionalDependencies\": {\n    \"some-platform-package\": \"^1.0.0\"\n  }\n}\n```\n\n<b>`optionalDependencies`</b> (dependencies your package can use if available but works without).\n\nUseful when functionality depends on:\n\n```text\nOperating system\nCPU architecture\nOptional feature\n```\n\nYour application must handle it being unavailable.\n\nThe usual real case is <b>platform-specific binaries</b>. A package publishes one per platform and marks them all optional, so installing on macOS silently skips the Linux one. The install <b>does not fail</b> when an optional dependency cannot be installed, which is the whole point and also the danger: a genuine failure looks like a successful install until something is missing at runtime.\n\n---\n\n## The four\n\n```text\ndependencies\n    ↓\nRequired at runtime\n\ndevDependencies\n    ↓\nRequired during development\n\npeerDependencies\n    ↓\nConsumer must provide\n\noptionalDependencies\n    ↓\nNice/possible to have\n```",
      diagram: `The test that decides it

    "Does the DEPLOYED PROCESS import this?"
                    │
        ┌───────────┴───────────┐
       YES                     NO
        │                       │
    dependencies          devDependencies

    not "is it a tool". not "did I use it while
    developing". a build tool that runs before deploy
    is a dev dependency even if the build is essential.


Why the split is not cosmetic

    npm ci --omit=dev
        └─ installs dependencies only

    skipping typescript, eslint, prettier and a test
    runner often HALVES the install and cuts real
    size off the image

    and it is a SECURITY boundary too:
      a vulnerability in a dev dependency is not in
      your running container at all
        └─ which is why npm audit reports them
           separately


The failure to watch for

    a package in devDependencies that the app IMPORTS

    development   works perfectly
    production    ERR_MODULE_NOT_FOUND on first start

    worked locally. dead on deploy.


peerDependencies: two copies is a BUG, not waste

    library bundles its own React
        ↓
    two React instances in one app
        ↓
    hooks break. context does not match.

    same for anything holding shared state, which is
    why plugins for eslint, prettier and test
    frameworks all use peer deps

    rule: must you and your consumer use the SAME
          INSTANCE? then it is a peer dependency.

    note: modern npm installs peers automatically, so
          a missing one is a WARNING. do not rely on
          the consumer noticing.


optionalDependencies: failure looks like success

    the usual case: platform-specific binaries
      one package per platform, all optional
        └─ installing on macOS silently skips the
           Linux one

    the install DOES NOT FAIL when an optional dep
    cannot be installed
      └─ the whole point, and the danger. a genuine
         failure looks like a clean install until
         something is missing at runtime.`,
      codeExample: {
        title: "Getting the split right",
        code: `// ── The four, in one file ───────────────────────────────────
// {
//   "dependencies": {
//     "express": "^5.0.0",          the process imports it
//     "pg": "^8.0.0"
//   },
//   "devDependencies": {
//     "typescript": "^5.0.0",       runs BEFORE deploy
//     "eslint": "^9.0.0",
//     "@types/node": "^24.0.0"      types vanish at runtime
//   },
//   "peerDependencies": {
//     "react": "^19.0.0"            the CONSUMER provides it
//   },
//   "optionalDependencies": {
//     "fsevents": "^2.0.0"          macOS only, skip elsewhere
//   }
// }


// ── The production install ──────────────────────────────────
// $ npm ci                 all of it, for development
// $ npm ci --omit=dev      dependencies only, for the image
//
// Dropping typescript, eslint, prettier and a test runner
// often halves the install. And a CVE in one of them is not
// in your running container at all.


// ── The failure this prevents ───────────────────────────────
// npm install --save-dev dotenv        ✗ wrong place
//
// src/server.js
//   import "dotenv/config";            the app imports it
//
// $ npm run dev            ✓ works, dev deps are installed
// $ npm ci --omit=dev && node src/server.js
//   Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'dotenv'
//
// Worked locally, dead on the first production start.


// ── The test, applied ───────────────────────────────────────
const decide = (pkg, importedAtRuntime) =>
  importedAtRuntime ? "dependencies" : "devDependencies";

for (const [pkg, imported] of [
  ["express", true],
  ["pg", true],
  ["typescript", false],      // runs before deploy
  ["@types/node", false],     // types are erased (Day 5)
  ["eslint", false],
  ["dotenv", true],           // if the app imports it
]) {
  console.log(pkg.padEnd(14), "→", decide(pkg, imported));
}


// ── Why peers are a correctness issue ───────────────────────
// my-react-lib/package.json
//   "dependencies":     { "react": "^19.0.0" }    ✗
//   "peerDependencies": { "react": "^19.0.0" }    ✓
//
// With the first, npm may install a SECOND copy of React
// inside your package's own node_modules. Two React
// instances in one app is not waste, it is broken hooks
// and mismatched context.
//
// Same reason eslint plugins, prettier plugins and test
// framework adapters all use peer dependencies: you and
// the consumer must share one instance.


// ── Optional means a failed install looks fine ──────────────
// "optionalDependencies": { "fsevents": "^2.0.0" }
//
// $ npm ci          on Linux
//   fsevents is skipped. Exit code 0. No warning worth
//   noticing.
//
// Which is correct here, and also means a genuine network
// or build failure on an optional dependency is invisible
// until something needs it at runtime. Handle its absence:
//
// let watcher;
// try {
//   watcher = await import("fsevents");
// } catch {
//   watcher = null;                    // fall back to polling
// }`,
      },
      keyTakeaways: [
        "The test is: <b>does the deployed process import it?</b> Yes means `dependencies`.",
        "Not \"is it a tool\". A build tool that runs before deploy is a dev dependency even if the build is essential.",
        "`npm ci --omit=dev` installs only `dependencies`, which often halves a production install.",
        "It is also a <b>security boundary</b>: a CVE in a dev dependency is not in your running container.",
        "Which is why `npm audit` reports dev and production vulnerabilities separately.",
        "The failure to watch for: a package in `devDependencies` that the app imports.",
        "It works perfectly in development and dies on the first production start with `ERR_MODULE_NOT_FOUND`.",
        "<b>`peerDependencies`</b> is for when you and your consumer must share <b>one instance</b> of something.",
        "Two copies of React in one app is a <b>bug</b>, not waste: hooks break and context does not match.",
        "Modern npm installs peers automatically, so a mismatch is a warning. Do not rely on it being noticed.",
        "<b>`optionalDependencies`</b> do not fail the install when they cannot be installed.",
        "That is the point, and the danger: a real failure looks like a clean install until runtime.",
      ],
      commonMistakes: [
        "<b>A package the app imports sitting in `devDependencies`</b> — works locally, `ERR_MODULE_NOT_FOUND` in production.",
        "<b>Everything in `dependencies` \"to be safe\"</b> — you ship your linter and test runner into the image.",
        "<b>A library putting React in `dependencies`</b> — two instances in one app, and broken hooks.",
        "<b>Assuming a missing peer dependency fails loudly</b> — modern npm installs it and warns.",
        "<b>Not handling an absent `optionalDependency`</b> — the install succeeded, so nothing warned you.",
        "<b>Putting `@types/*` in `dependencies`</b> — types are erased before runtime, as in Day 5.",
      ],
      quiz: [
        {
          question: "Which question decides between `dependencies` and `devDependencies`?",
          options: [
            "Is it a build tool?",
            "Does the deployed process import it?",
            "Did I use it during development?",
            "Is it large?",
          ],
          correctIndex: 1,
          explanation:
            "A build tool that runs before deploy is a dev dependency even if the build is essential. What matters is whether the running process needs the module.",
        },
        {
          question: "Your app imports a package that sits in `devDependencies`. When do you find out?",
          options: [
            "Immediately, npm warns",
            "On the first production start, with `ERR_MODULE_NOT_FOUND`",
            "At build time",
            "Never, it works either way",
          ],
          correctIndex: 1,
          explanation:
            "Development installs everything, so it works locally. A production install with `--omit=dev` drops it, and the failure is immediate and total.",
        },
        {
          question: "Why does a React component library put React in `peerDependencies`?",
          options: [
            "To reduce install size",
            "Because two React instances in one app is a bug: hooks break and context does not match",
            "Because npm requires it",
            "To avoid version conflicts in the lockfile",
          ],
          correctIndex: 1,
          explanation:
            "It is a correctness issue rather than a size one. The rule generalises: if you and your consumer must share one instance, it is a peer dependency.",
        },
      ],
    },
    {
      id: "semver",
      title: "Semantic versioning, caret and tilde",
      durationMinutes: 12,
      explanation:
        "<b>Semantic Versioning</b> (a convention using `MAJOR.MINOR.PATCH`).\n\n```text\n2.4.7\n│ │ │\n│ │ └── PATCH\n│ └──── MINOR\n└────── MAJOR\n```\n\n```text\nMAJOR\n→ breaking changes\n\nMINOR\n→ backwards-compatible features\n\nPATCH\n→ backwards-compatible fixes\n```\n\nWorth being clear that SemVer is a <b>promise, not a mechanism</b>. Nothing stops a maintainer shipping a breaking change in a patch release, and it happens. So `^` is trust, not safety, which is what the lockfile lesson is about.\n\n---\n\n## Exact\n\n```javascript\n{\n  \"express\": \"5.0.2\"\n}\n```\n\nExactly `5.0.2`. No range.\n\n---\n\n## `^` caret\n\n```javascript\n{\n  \"express\": \"^5.0.2\"\n}\n```\n\nResolves to the range:\n\n```text\n>=5.0.2 <6.0.0\n```\n\nSo minor and patch updates can be selected, but not `6.x`.\n\n---\n\n## `~` tilde\n\n```javascript\n{\n  \"express\": \"~5.0.2\"\n}\n```\n\nResolves to:\n\n```text\n>=5.0.2 <5.1.0\n```\n\nSo `5.0.3` and `5.0.9` match, `5.1.0` does not.\n\n---\n\n## The memory trick\n\n```text\n\"5.0.2\"\n   ↓\nexactly 5.0.2\n\n\"~5.0.2\"\n   ↓\npatch updates\n\n\"^5.0.2\"\n   ↓\nminor + patch updates\n```\n\n---\n\n## And now the part that surprises everyone\n\nThat model holds for `1.0.0` and above. Below `1.0.0` it changes, and not in the direction you would guess. Here are the actual resolved ranges:\n\n```text\n^5.0.2   →  >=5.0.2 <6.0.0\n~5.0.2   →  >=5.0.2 <5.1.0\n\n^0.5.2   →  >=0.5.2 <0.6.0\n~0.5.2   →  >=0.5.2 <0.6.0     ← identical\n\n^0.0.3   →  >=0.0.3 <0.0.4     ← exact patch\n~0.0.3   →  >=0.0.3 <0.1.0     ← wider!\n```\n\nTwo things there.\n\nFor <b>`0.x.y`</b>, caret behaves exactly like tilde. Both stop at the next minor, because SemVer treats a `0.x` minor bump as potentially breaking. So `^0.5.2` will not take `0.6.0`.\n\nFor <b>`0.0.x`</b>, <b>caret is tighter than tilde</b>. `^0.0.3` allows nothing but `0.0.3`, while `~0.0.3` allows any `0.0.x`. That is the one case where the usual \"caret is looser\" rule reverses, and it catches people who assume the mental model scales down.\n\nThe practical takeaway: on a pre-1.0 dependency, <b>read the resolved range rather than assuming</b>. `npm ls` tells you what you actually got.\n\n---\n\n## What npm writes by default\n\n`npm install express` writes `^5.0.2`, not `5.0.2`. So the default is \"accept future minor releases\", and you opted into that without choosing it.\n\nThat is usually right, and the reason it is safe in practice is the lockfile: `^` describes what you would <b>accept</b>, and the lockfile pins what you <b>got</b>. Without a lockfile, `^` means two machines can resolve differently, which is the next lesson.\n\nIf you want exact versions, `npm install --save-exact` or `save-exact=true` in `.npmrc`. Worth considering for a deployed application, where you would rather update deliberately than discover a change during an unrelated install.",
      diagram: `The model everyone learns

    "5.0.2"    exactly that
    "~5.0.2"   >=5.0.2 <5.1.0     patch only
    "^5.0.2"   >=5.0.2 <6.0.0     minor + patch

    caret is looser than tilde.


Below 1.0.0 it changes, and reverses

    ^0.5.2   →  >=0.5.2 <0.6.0
    ~0.5.2   →  >=0.5.2 <0.6.0        IDENTICAL
                                        └─ SemVer treats a
                                           0.x minor bump as
                                           possibly breaking

    ^0.0.3   →  >=0.0.3 <0.0.4        exact patch
    ~0.0.3   →  >=0.0.3 <0.1.0        WIDER
                                        └─ caret is TIGHTER
                                           than tilde here.
                                           the usual rule
                                           reverses.

    so on a pre-1.0 dependency, read the resolved
    range rather than assuming. npm ls tells you.


SemVer is a PROMISE, not a mechanism

    nothing stops a maintainer shipping a breaking
    change in a patch release. it happens.

    so ^ is TRUST, not safety.
      └─ which is what the lockfile is for


What npm writes when you are not looking

    npm install express
        └─ writes "^5.0.2", not "5.0.2"

    the default is "accept future minor releases",
    and you opted in without choosing it.

    safe in practice ONLY because of the lockfile:
      ^        what you would ACCEPT
      lockfile what you GOT

    want exact?
      npm install --save-exact
      or save-exact=true in .npmrc

    worth it for a deployed app, where you would
    rather update deliberately than discover a
    change during an unrelated install.`,
      codeExample: {
        title: "The ranges, resolved",
        code: `// These are the real resolved ranges, from npm's own semver.

import semver from "semver";

for (const range of ["5.0.2", "~5.0.2", "^5.0.2", "^1.0.0"]) {
  console.log(range.padEnd(9), "→", semver.validRange(range));
}
// 5.0.2     → 5.0.2
// ~5.0.2    → >=5.0.2 <5.1.0
// ^5.0.2    → >=5.0.2 <6.0.0
// ^1.0.0    → >=1.0.0 <2.0.0
//
// caret is looser than tilde. so far so expected.


// ── Below 1.0.0, the rule changes ───────────────────────────
for (const range of ["^0.5.2", "~0.5.2", "^0.0.3", "~0.0.3"]) {
  console.log(range.padEnd(9), "→", semver.validRange(range));
}
// ^0.5.2    → >=0.5.2 <0.6.0      identical to tilde
// ~0.5.2    → >=0.5.2 <0.6.0
// ^0.0.3    → >=0.0.3 <0.0.4      exact patch
// ~0.0.3    → >=0.0.3 <0.1.0      WIDER than caret


// ── The reversal, checked ───────────────────────────────────
console.log(semver.satisfies("0.6.0", "^0.5.2"));   // false
console.log(semver.satisfies("0.5.9", "^0.5.2"));   // true
console.log(semver.satisfies("0.0.4", "^0.0.3"));   // false  ← !
console.log(semver.satisfies("0.0.4", "~0.0.3"));   // true
//
// For 0.0.x, caret is TIGHTER than tilde. The usual "caret
// is looser" rule reverses, which catches anyone who assumes
// the mental model scales below 1.0.


// ── SemVer is a promise, not a guarantee ────────────────────
// "^5.0.2" says: I trust this maintainer not to break me in
//                a minor or patch release.
//
// Nothing enforces that. A breaking change in a patch
// happens, and when it does, the lockfile is what saved you
// from finding out during an unrelated install.


// ── What npm writes by default ──────────────────────────────
// $ npm install express
//   "express": "^5.0.2"           ← caret, not exact
//
// You accepted future minor releases without choosing to.
//
// $ npm install --save-exact express
//   "express": "5.0.2"
//
// or, in .npmrc:
//   save-exact=true
//
// Worth it for a deployed application: you would rather
// update deliberately than discover a change while
// installing something unrelated.


// ── And check what you actually got ─────────────────────────
// $ npm ls express
//   my-api@1.0.0
//   └── express@5.0.2
//
// Especially on a pre-1.0 dependency, where the range is
// not what the mental model predicts.`,
      },
      keyTakeaways: [
        "SemVer is `MAJOR.MINOR.PATCH`: breaking, features, fixes.",
        "It is a <b>promise, not a mechanism</b>. Nothing stops a breaking change in a patch release.",
        "So `^` is trust, not safety. The lockfile is the safety.",
        "`^5.0.2` resolves to `>=5.0.2 <6.0.0`. `~5.0.2` resolves to `>=5.0.2 <5.1.0`.",
        "For <b>`0.x.y`, caret behaves exactly like tilde</b>: `^0.5.2` is `>=0.5.2 <0.6.0`.",
        "Because SemVer treats a `0.x` minor bump as potentially breaking.",
        "For <b>`0.0.x`, caret is tighter than tilde</b>: `^0.0.3` is only `0.0.3`, while `~0.0.3` allows any `0.0.x`.",
        "That is the one case where the usual \"caret is looser\" rule reverses.",
        "On a pre-1.0 dependency, read the resolved range rather than assuming. `npm ls` tells you.",
        "<b>`npm install` writes `^` by default</b>, so you accepted future minor releases without choosing.",
        "That is only safe because of the lockfile. `^` is what you would accept, the lockfile is what you got.",
        "`npm install --save-exact` or `save-exact=true` in `.npmrc` if you would rather update deliberately.",
      ],
      commonMistakes: [
        "<b>Assuming `^0.5.2` allows `0.6.0`</b> — it does not. Below 1.0, caret stops at the next minor.",
        "<b>Assuming caret is always looser than tilde</b> — for `0.0.x` it is tighter.",
        "<b>Treating SemVer as enforced</b> — it is a convention, and maintainers break it.",
        "<b>Not realising `npm install` writes a caret</b> — you opted into minor updates by default.",
        "<b>Using `^` on a pre-1.0 dependency and expecting the usual behaviour</b> — check the resolved range.",
        "<b>Relying on ranges instead of the lockfile for reproducibility</b> — a range is a wish, not a fact.",
      ],
      quiz: [
        {
          question: "What range does `^0.5.2` resolve to?",
          options: [
            "`>=0.5.2 <1.0.0`",
            "`>=0.5.2 <0.6.0`, which is identical to `~0.5.2`",
            "`>=0.5.2 <0.5.3`",
            "Exactly `0.5.2`",
          ],
          correctIndex: 1,
          explanation:
            "Below 1.0.0, SemVer treats a minor bump as potentially breaking, so caret stops at the next minor and behaves exactly like tilde.",
        },
        {
          question: "Which is wider, `^0.0.3` or `~0.0.3`?",
          options: [
            "`^0.0.3`, as caret is always looser",
            "`~0.0.3`, which allows any `0.0.x`, while `^0.0.3` allows only `0.0.3`",
            "They are identical",
            "Neither, both are exact",
          ],
          correctIndex: 1,
          explanation:
            "This is the one case where the rule reverses. `^0.0.3` resolves to `>=0.0.3 <0.0.4` and `~0.0.3` to `>=0.0.3 <0.1.0`.",
        },
        {
          question: "Why is the default caret from `npm install` safe in practice?",
          options: [
            "Maintainers never break SemVer",
            "The lockfile pins what you actually got, so the range only matters when resolving fresh",
            "npm verifies compatibility",
            "It is not safe",
          ],
          correctIndex: 1,
          explanation:
            "The range says what you would accept and the lockfile records what you got. Without a lockfile, two machines can resolve differently from the same `^`.",
        },
      ],
    },
    {
      id: "lockfile",
      title: "The lockfile, npm install vs npm ci",
      durationMinutes: 12,
      explanation:
        "## `package-lock.json`\n\n<b>`package-lock.json`</b> (a lockfile recording the resolved dependency tree and versions).\n\n`package.json` might say:\n\n```javascript\n{\n  \"dependencies\": {\n    \"foo\": \"^2.0.0\"\n  }\n}\n```\n\nThe lockfile records:\n\n```text\nfoo → 2.4.1\nbar → 1.8.3\nbaz → 3.2.0\n```\n\nNote it records `bar` and `baz` too, which you never asked for. The lockfile covers the <b>whole tree</b>, not just your direct dependencies, and that is most of its value: a transitive dependency four levels down is pinned as firmly as `express`.\n\nIt also stores an <b>integrity hash</b> per package, so a tampered tarball fails the install rather than being used. That is a real security property, and the reason a lockfile diff is worth reading.\n\n---\n\n## Why commit it\n\n```text\nDeveloper A\n    ↓\nnpm install\n    ↓\nfoo 2.4.1\n```\n\nLater:\n\n```text\nDeveloper B\n    ↓\nnpm install\n    ↓\nfoo 2.5.0\n```\n\nDifferent trees, from the same `package.json`.\n\n> <b>For applications, commit `package-lock.json` to Git.</b>\n\nThe worst version of this is not two developers disagreeing. It is a bug that reproduces on one machine and not another, where the code is identical and the dependency tree is not. That is genuinely hard to find if you do not suspect it.\n\nFor a <b>published library</b> the advice reverses: your lockfile is not used by consumers, since they resolve against their own tree. Commit it for your own CI, but do not expect it to protect anyone downstream.\n\n---\n\n## `npm install` vs `npm ci`\n\n### `npm install`\n\nFor development. It can:\n\n```text\nResolve dependencies\nUpdate package-lock.json\nInstall packages\n```\n\n### `npm ci`\n\n<b>`npm ci`</b> (clean install designed for automated environments, using the lockfile exactly).\n\nIt expects:\n\n```text\npackage.json\n+\npackage-lock.json\n```\n\n---\n\n## The difference that actually matters\n\nThe usual explanation is \"reproducibility\", which undersells it. The real difference is that <b>`npm ci` fails rather than improvising</b>.\n\nWith no lockfile:\n\n```text\nnpm error code EUSAGE\nnpm error The `npm ci` command can only install with an existing\nnpm error package-lock.json or npm-shrinkwrap.json\n```\n\nWith a lockfile that does not match `package.json`:\n\n```text\nnpm error code EUSAGE\nnpm error `npm ci` can only install packages when your package.json and\nnpm error package-lock.json are in sync. Please update your lock file with\nnpm error `npm install` before continuing.\nnpm error Missing: left-pad@1.3.0 from lock file\n```\n\n`npm install` in the same situation would quietly resolve something and update the lockfile, so CI would install a tree nobody reviewed and pass.\n\nThat is the argument: `npm ci` turns \"someone edited `package.json` and forgot to commit the lockfile\" into a red build instead of a silent difference between CI and everyone's laptop.\n\nTwo other properties: it <b>deletes `node_modules` first</b>, so no stale state survives, and it <b>never writes</b> to `package.json` or the lockfile.\n\n---\n\n## In CI\n\n```bash\nnpm ci\n```\n\nnot:\n\n```bash\nnpm install\n```\n\n```text\nGit push\n   ↓\nCI\n   ↓\nnpm ci\n   ↓\nnpm test\n   ↓\nnpm run build\n   ↓\ndeploy\n```\n\nAnd in your Dockerfile, `npm ci --omit=dev` for the production stage.\n\n---\n\n## `npm prune`\n\n<b>`npm prune`</b> (removes packages from `node_modules` that the current configuration does not require).\n\nUseful for cleaning an installation that has drifted. `npm prune --omit=dev` after a build is one way to shrink an image, though `npm ci --omit=dev` in a separate stage is usually cleaner.\n\nHonestly: if `node_modules` is confusing you, deleting it and running `npm ci` is faster than reasoning about it. It is a build artifact, not state.",
      diagram: `The lockfile pins the WHOLE tree

    package.json          "foo": "^2.0.0"
                              one direct dependency

    package-lock.json     foo  2.4.1
                          bar  1.8.3    ← never asked for
                          baz  3.2.0    ← never asked for
                          ...40 more

    a transitive dependency four levels down is
    pinned as firmly as express.

    plus an INTEGRITY HASH per package
      └─ a tampered tarball fails the install
         rather than being used


npm ci FAILS instead of improvising

    no lockfile
      npm error code EUSAGE
      The \`npm ci\` command can only install with an
      existing package-lock.json

    lockfile out of sync with package.json
      npm error code EUSAGE
      \`npm ci\` can only install packages when your
      package.json and package-lock.json are in sync
      Missing: left-pad@1.3.0 from lock file

    npm install in the same spot would QUIETLY resolve
    something, update the lockfile, and pass.
        ↓
    CI installs a tree nobody reviewed


    which is the real argument: it turns "someone
    forgot to commit the lockfile" into a RED BUILD
    instead of a silent difference between CI and
    everyone's laptop.

    and it deletes node_modules first, and never
    writes to package.json or the lockfile.


The worst version of a missing lockfile

    not two developers disagreeing.

    a bug that reproduces on ONE machine, where the
    code is identical and the dependency tree is not.
      └─ genuinely hard to find if you do not
         suspect it


For a published LIBRARY the advice reverses

    consumers resolve against their OWN tree.
    your lockfile protects your CI and nobody
    downstream.`,
      codeExample: {
        title: "Why CI uses ci",
        code: `// ── The lockfile records more than you asked for ────────────
// package.json
//   "dependencies": { "express": "^5.0.0" }        ← 1 package
//
// $ npm ls --all | wc -l
//   67                                              ← on disk
//
// The lockfile pins all 67, each with an integrity hash:
//
//   "node_modules/express": {
//     "version": "5.0.2",
//     "resolved": "https://registry.npmjs.org/express/-/...",
//     "integrity": "sha512-...",
//     "dependencies": { ... }
//   }
//
// A tampered tarball fails that hash rather than installing.


// ── npm ci with no lockfile ─────────────────────────────────
// $ rm package-lock.json && npm ci
//
// npm error code EUSAGE
// npm error The \`npm ci\` command can only install with an
// npm error existing package-lock.json or npm-shrinkwrap.json
// npm error with lockfileVersion >= 1.


// ── npm ci with an out-of-sync lockfile ─────────────────────
// package.json gained a dependency, the lockfile did not:
//
// $ npm ci
//
// npm error code EUSAGE
// npm error \`npm ci\` can only install packages when your
// npm error package.json and package-lock.json are in sync.
// npm error Please update your lock file with \`npm install\`
// npm error before continuing.
// npm error
// npm error Missing: left-pad@1.3.0 from lock file
//
// npm install here would have resolved it silently and
// rewritten the lockfile. CI would install a tree nobody
// reviewed, and pass.


// ── So the pipeline ─────────────────────────────────────────
// .github/workflows/ci.yml
//   - run: npm ci                  ← fails on a stale lockfile
//   - run: npm run typecheck
//   - run: npm test
//   - run: npm run build


// ── And the Dockerfile ──────────────────────────────────────
// FROM node:24-slim AS build
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci                       ← dev deps, for the build
// COPY . .
// RUN npm run build
//
// FROM node:24-slim
// WORKDIR /app
// COPY package*.json ./
// RUN npm ci --omit=dev            ← runtime deps only
// COPY --from=build /app/dist ./dist
// CMD ["node", "dist/server.js"]
//
// Copying package*.json before the source is deliberate: the
// install layer is cached until your dependencies change.


// ── node_modules is a build artifact, not state ─────────────
// If it is confusing you:
//   rm -rf node_modules && npm ci
//
// Faster than reasoning about it. npm prune exists, but a
// clean install is usually the better answer.


// ── For a published library, this reverses ──────────────────
// Your consumers resolve against their own tree, so your
// lockfile protects your CI and nobody downstream. Commit
// it, but do not expect it to pin anything for users.`,
      },
      keyTakeaways: [
        "The lockfile pins the <b>whole tree</b>, including transitive dependencies you never asked for.",
        "It stores an <b>integrity hash</b> per package, so a tampered tarball fails the install.",
        "Commit it for an application. Two developers can otherwise resolve different trees from the same ranges.",
        "The worst version of that is a bug reproducing on one machine, with identical code and a different tree.",
        "For a <b>published library</b> it reverses: consumers resolve their own tree, so yours protects only your CI.",
        "`npm install` resolves, installs, and may <b>update</b> the lockfile.",
        "<b>`npm ci` fails rather than improvising.</b> That is the real difference, not \"reproducibility\".",
        "No lockfile, or one out of sync with `package.json`, gives `EUSAGE` and a red build.",
        "`npm install` in the same situation quietly resolves something and rewrites the lockfile.",
        "So `npm ci` turns a forgotten lockfile commit into a failed build instead of a silent difference.",
        "It also deletes `node_modules` first and never writes to `package.json` or the lockfile.",
        "Use `npm ci` in CI, and `npm ci --omit=dev` in the production stage of a Dockerfile.",
        "`node_modules` is a build artifact. `rm -rf node_modules && npm ci` beats reasoning about it.",
      ],
      commonMistakes: [
        "<b>Using `npm install` in CI</b> — it silently resolves and rewrites, so CI can test a tree nobody reviewed.",
        "<b>Not committing the lockfile</b> — the resulting bugs reproduce on one machine and not another.",
        "<b>Adding the lockfile to `.gitignore`</b> — that is for `node_modules`, not the lockfile.",
        "<b>Resolving a lockfile merge conflict by hand</b> — delete it and run `npm install`, then review the diff.",
        "<b>Copying the whole source before `npm ci` in a Dockerfile</b> — you lose the install layer cache.",
        "<b>Expecting a library's lockfile to pin anything for consumers</b> — they resolve their own tree.",
        "<b>Treating `node_modules` as state to repair</b> — it is an artifact. Reinstall it.",
      ],
      quiz: [
        {
          question: "What does `npm ci` do when `package.json` and the lockfile are out of sync?",
          options: [
            "Resolves the difference and updates the lockfile",
            "Fails with `EUSAGE` and tells you to run `npm install` first",
            "Installs only what the lockfile has",
            "Warns and continues",
          ],
          correctIndex: 1,
          explanation:
            "That failure is the point. `npm install` would resolve it quietly and rewrite the lockfile, so CI would install a tree nobody reviewed and pass.",
        },
        {
          question: "Beyond versions, what else does the lockfile record that matters?",
          options: [
            "Download counts",
            "An integrity hash per package, so a tampered tarball fails the install",
            "The publish date",
            "Licence text",
          ],
          correctIndex: 1,
          explanation:
            "That is a real security property, and part of why a lockfile diff is worth reading when a dependency changes unexpectedly.",
        },
        {
          question: "Does a published library's lockfile pin versions for its consumers?",
          options: [
            "Yes, that is its purpose",
            "No. Consumers resolve against their own tree, so it protects only your CI",
            "Only for direct dependencies",
            "Only if they use `npm ci`",
          ],
          correctIndex: 1,
          explanation:
            "Which is why the commit-the-lockfile advice is about applications. Commit it for your own builds, but it does nothing downstream.",
        },
      ],
    },
    {
      id: "workspaces",
      title: "Workspaces, monorepos and package managers",
      durationMinutes: 10,
      explanation:
        "## Workspaces\n\n<b>npm workspaces</b> (a way to manage multiple related packages from one repository).\n\n```text\nmy-company/\n├── package.json\n├── apps/\n│   ├── api/\n│   └── web/\n└── packages/\n    ├── database/\n    └── shared/\n```\n\nMultiple projects, one repository. That is a <b>monorepo</b>.\n\n<b>Monorepo</b> (a repository containing multiple related applications or packages).\n\n```text\nCompany repository\n       │\n       ├── frontend\n       ├── backend\n       ├── shared-types\n       └── config\n```\n\n---\n\n## What workspaces actually give you\n\nTwo concrete things, worth naming because the concept sounds vaguer than it is.\n\n<b>One `node_modules` and one lockfile at the root.</b> Dependencies are hoisted, so a package used by three workspaces is installed once, and the whole repository resolves one consistent tree.\n\n<b>Local packages link instead of installing.</b> If `apps/api` depends on `packages/shared`, npm symlinks it rather than fetching from the registry. So an edit in `shared` is visible in `api` immediately, with no publish and no build step in between.\n\nThat second point is the reason monorepos exist. The alternative is publishing a package to change a type, which nobody does more than twice before looking for a better way.\n\nAnd it is why a shared types package works so well with Day 5: change a type in one place and every workspace type-checks against it.\n\n---\n\n## npm vs pnpm vs Yarn\n\n```text\nnpm\npnpm\nYarn\n```\n\nAll solve the same problem:\n\n```text\npackage.json\n      ↓\ndependency resolution\n      ↓\nnode_modules\n```\n\nTheir installation and storage strategies differ.\n\n---\n\n## Why pnpm is popular\n\n<b>pnpm</b> (a package manager using a content-addressable store and linking packages into projects).\n\n```text\nGlobal/content store\n       │\n   ┌───┼───┐\n   ↓   ↓   ↓\n App1 App2 App3\n```\n\n```text\nLess disk usage\nFaster installs\nStrong dependency isolation\n```\n\nThe third one is the interesting one, and it is not just a performance claim. npm <b>hoists</b> dependencies to the top of `node_modules`, which means you can `import` a package you never declared and it works. Then it stops working when the package that pulled it in changes a version.\n\npnpm links only what each package declared, so an undeclared import fails immediately. That is a correctness property, and it is why pnpm often surfaces missing dependencies the first time you switch to it.\n\n---\n\n## Do not worship the tool\n\nYou may hear \"pnpm is winning\". The lesson is not that everyone must use pnpm. It is:\n\n> <b>Pick one package manager and standardise it.</b>\n\nDo not have:\n\n```text\nDeveloper A → npm\nDeveloper B → pnpm\nDeveloper C → yarn\n```\n\nThe reason is concrete: each writes a <b>different lockfile</b>. Three package managers means three lockfiles, or one that is constantly stale, and the reproducibility the last lesson was about disappears entirely.\n\nDeclare it:\n\n```javascript\n{\n  \"packageManager\": \"pnpm@9.0.0\"\n}\n```\n\nThat field is not decoration. Corepack reads it and uses the right tool and version, so a new developer cannot use the wrong one by accident.",
      diagram: `What workspaces actually give you

    ONE node_modules AND LOCKFILE AT THE ROOT
      a package used by three workspaces is
      installed once, and the whole repo resolves
      one consistent tree

    LOCAL PACKAGES LINK, NOT INSTALL
      apps/api depends on packages/shared
          ↓
      npm SYMLINKS it
          ↓
      an edit in shared is visible in api
      immediately. no publish. no build step.

      └─ this is the reason monorepos exist.
         the alternative is publishing a package
         to change a type, which nobody does more
         than twice.


pnpm's real advantage is correctness, not speed

    npm HOISTS to the top of node_modules
        ↓
    you can import a package you never declared
        ↓
    it works
        ↓
    then it STOPS working when whatever pulled it
    in changes a version

    pnpm links only what each package DECLARED
        ↓
    an undeclared import fails immediately

    which is why switching to pnpm often surfaces
    missing dependencies you did not know you had.


Why standardising matters concretely

    each package manager writes a DIFFERENT lockfile

    npm    package-lock.json
    pnpm   pnpm-lock.yaml
    yarn   yarn.lock

    three developers, three tools
        ↓
    three lockfiles, or one permanently stale
        ↓
    the reproducibility from the last lesson
    is gone entirely


    declare it, and make it enforceable:

      "packageManager": "pnpm@9.0.0"

    corepack reads that and uses the right tool AND
    version, so a new developer cannot pick wrong
    by accident.`,
      codeExample: {
        title: "A workspace setup",
        code: `// ── Root package.json ───────────────────────────────────────
// {
//   "name": "my-company",
//   "private": true,                    ← required for a root
//   "workspaces": ["apps/*", "packages/*"],
//   "packageManager": "npm@11.0.0",
//   "scripts": {
//     "test": "npm test --workspaces --if-present",
//     "dev:api": "npm run dev --workspace=apps/api"
//   }
// }
//
// my-company/
// ├── package.json          ← the only lockfile lives here
// ├── package-lock.json
// ├── node_modules/         ← one install for everything
// ├── apps/
// │   ├── api/package.json
// │   └── web/package.json
// └── packages/
//     ├── shared/package.json
//     └── database/package.json


// ── A workspace depending on a local package ────────────────
// apps/api/package.json
// {
//   "name": "@my-company/api",
//   "dependencies": {
//     "@my-company/shared": "*",        ← the local one
//     "express": "^5.0.0"
//   }
// }
//
// $ npm install
//   node_modules/@my-company/shared -> ../../packages/shared
//                                       ↑ a SYMLINK
//
// So editing packages/shared is visible in apps/api
// immediately. No publish, no build step between them.
//
// Which is exactly why a shared types package works so well
// with Day 5: change a type once and every workspace
// type-checks against it.


// ── Running commands across workspaces ──────────────────────
// npm install                              install everything
// npm test --workspaces --if-present       test all of them
// npm run dev --workspace=apps/api         just one
// npm install zod --workspace=apps/api     add to one


// ── The hoisting problem pnpm solves ────────────────────────
// npm flattens node_modules, so:
//
// apps/api/src/server.js
//   import { z } from "zod";        ← never declared in
//                                     apps/api/package.json
//
// It works, because something else pulled zod up to the root.
// Then it breaks when that package drops zod, and the error
// points at your file rather than the real cause.
//
// pnpm links only declared dependencies, so that import
// fails on day one. A correctness property, not a speed one.


// ── Pick one tool, and make it enforceable ──────────────────
// { "packageManager": "pnpm@9.0.0" }
//
// Corepack uses that exact tool and version, so a new
// developer running "npm install" in a pnpm repo does not
// quietly create a second lockfile.
//
// Three package managers means three lockfiles, or one
// that is permanently stale, and the reproducibility from
// the last lesson is gone.`,
      },
      keyTakeaways: [
        "<b>Workspaces</b> manage several packages from one repository. That repository is a <b>monorepo</b>.",
        "They give you <b>one `node_modules` and one lockfile at the root</b>, so the whole repo resolves one tree.",
        "And <b>local packages link rather than install</b>: npm symlinks `packages/shared` into `apps/api`.",
        "So an edit in a shared package is visible immediately, with no publish and no build step.",
        "That is the reason monorepos exist. The alternative is publishing a package to change a type.",
        "It pairs well with Day 5: change a shared type once and every workspace type-checks against it.",
        "npm, pnpm and Yarn solve the same problem with different storage strategies.",
        "pnpm's real advantage is <b>correctness</b>: npm hoists, so you can import an undeclared package and it works.",
        "Until it stops working when whatever pulled it in changes. pnpm fails immediately instead.",
        "The lesson is not \"use pnpm\". It is <b>pick one and standardise</b>.",
        "Because each writes a different lockfile, so three tools means three lockfiles or one permanently stale.",
        "`\"packageManager\": \"pnpm@9.0.0\"` is enforceable: Corepack uses that exact tool and version.",
      ],
      commonMistakes: [
        "<b>Different developers using different package managers</b> — you end up with competing or stale lockfiles.",
        "<b>Omitting `\"private\": true` on a workspace root</b> — npm requires it, and it prevents publishing the wrapper.",
        "<b>Importing a package you did not declare</b> — hoisting makes it work until it suddenly does not.",
        "<b>A lockfile inside a workspace package</b> — the root holds the only one.",
        "<b>Adopting pnpm for speed alone</b> — the isolation is the more valuable part.",
        "<b>Skipping `packageManager`</b> — nothing stops a new developer using the wrong tool.",
      ],
      quiz: [
        {
          question: "What is the main practical benefit of workspaces?",
          options: [
            "Faster installs",
            "Local packages are symlinked, so an edit in a shared package is visible immediately with no publish step",
            "Smaller repositories",
            "Automatic versioning",
          ],
          correctIndex: 1,
          explanation:
            "The alternative is publishing a package every time you change a shared type, which is the friction monorepos exist to remove.",
        },
        {
          question: "What is pnpm's most valuable difference from npm?",
          options: [
            "Faster installs",
            "It links only declared dependencies, so importing an undeclared package fails immediately instead of working by accident",
            "A smaller lockfile",
            "Better error messages",
          ],
          correctIndex: 1,
          explanation:
            "npm hoists to the top of `node_modules`, so an undeclared import works until whatever pulled the package in changes. That is a correctness property, not a speed one.",
        },
        {
          question: "Why does mixing package managers on one project matter?",
          options: [
            "It slows installs down",
            "Each writes a different lockfile, so you get competing lockfiles or one permanently stale, losing reproducibility",
            "The tools cannot read each other's `package.json`",
            "It breaks workspaces",
          ],
          correctIndex: 1,
          explanation:
            "The lockfile is what makes installs reproducible, so competing ones defeat the point. `\"packageManager\"` plus Corepack makes the choice enforceable.",
        },
      ],
    },
    {
      id: "supply-chain",
      title: "npx and supply-chain security",
      durationMinutes: 14,
      explanation:
        "## `npx`\n\n<b>`npx`</b> (runs an npm package without installing it globally).\n\n```bash\nnpx some-tool\n```\n\nInstead of:\n\n```bash\nnpm install -g some-tool\nsome-tool\n```\n\n---\n\n## Be careful with it\n\nDo not blindly run:\n\n```bash\nnpx random-package\n```\n\nYou are executing code from an npm package. Before running one:\n\n```text\nCheck package name\nCheck publisher\nCheck downloads/history\nCheck repository\nCheck what it executes\n```\n\nThe part that makes `npx` riskier than `npm install` is that it <b>downloads and executes in one step</b>, with no lockfile and no review. `npm install` at least leaves a diff you could have read.\n\nAnd `npx` runs a <b>local</b> package if one exists, otherwise fetches from the registry. So a typo in the name silently becomes a registry fetch of whatever that name resolves to.\n\n---\n\n## Supply-chain security\n\n<b>Supply-chain security</b> (protecting your application from malicious or compromised third-party dependencies).\n\n```text\nYour code\n   ↓\nPackage A\n   ↓\nPackage B\n   ↓\nPackage C\n   ↓\nPackage D\n```\n\nYou installed only:\n\n```text\nPackage A\n```\n\nbut you are trusting the whole tree.\n\nThe numbers make this concrete. One `express` dependency is around 67 packages on disk, from dozens of maintainers you have never evaluated. Any one of them can publish a new version, and your `^` range accepts it.\n\nWhich is where the lockfile stops being bookkeeping and becomes a security control. It pins every one of those 67, with an integrity hash. A compromised package cannot enter your tree without the lockfile changing, and a lockfile change is a reviewable diff.\n\n---\n\n## `npm audit`\n\n```bash\nnpm audit\n```\n\nChecks your tree against npm's vulnerability data.\n\n```bash\nnpm audit fix\n```\n\nattempts compatible fixes. But:\n\n> Do not blindly run automated upgrades and assume everything is safe.\n\nTwo things worth knowing about the output.\n\n<b>Severity is not impact.</b> A critical vulnerability in a dev-only build tool is not in your running container. `npm audit --omit=dev` shows what actually ships, and the difference is often most of the report.\n\n<b>Many advisories do not apply to you.</b> A ReDoS in a function you never call is a real vulnerability and not a real risk. Treating every advisory as urgent trains a team to ignore the whole report, which is worse than triaging honestly.\n\nAnd `npm audit fix --force` will install <b>major</b> version bumps, meaning breaking changes. That flag is not a security tool, it is a refactor.\n\n---\n\n## Review your lockfile\n\nA lockfile is not a boring generated file. It tells you:\n\n```text\nWhat version?\nWhere did it come from?\nWhat integrity information exists?\nWhat dependencies were resolved?\n```\n\nWhen a dependency changes, the lockfile helps you investigate.\n\nThe practical habit: in a pull request that only touches application code, a <b>large lockfile diff is a question worth asking</b>. Someone ran `npm install` and picked up updates nobody asked for.\n\n---\n\n## `--ignore-scripts`\n\nPackages can define:\n\n```javascript\n{\n  \"scripts\": {\n    \"postinstall\": \"node setup.js\"\n  }\n}\n```\n\nwhich executes during installation.\n\n```bash\nnpm install --ignore-scripts\n```\n\n<b>`--ignore-scripts`</b> (tells npm not to run package lifecycle scripts during installation).\n\nThis reduces risk. But:\n\n> Some legitimate packages need install scripts to work.\n\nSo it is not a universal flag. Packages with native code compile in `postinstall`, and they will simply be broken.\n\nThe realistic position: `ignore-scripts=true` in `.npmrc` is a genuinely good default for <b>CI</b>, where you control which packages need it and can allow them explicitly. On a developer machine it produces confusing breakage.\n\n---\n\n## Typosquatting\n\n<b>Typosquatting</b> (a malicious package with a name similar to a popular one).\n\nReal:\n\n```text\nawesome-utils\n```\n\nAttacker:\n\n```text\nawesome-util\n```\n\n```bash\nnpm install awesome-util\n```\n\nBefore installing:\n\n```text\nCheck exact spelling\nCheck npm package\nCheck GitHub repository\nCheck publisher\nCheck download history\nCheck recent changes\nCheck dependencies\n```\n\nEspecially with packages copied from blog posts.\n\nThe highest-value check is <b>weekly downloads against the package's age</b>. A package claiming to be a popular utility with 40 downloads and a version published last week is the whole tell.\n\n---\n\n## Postinstall scripts\n\n```javascript\n{\n  \"scripts\": {\n    \"postinstall\": \"node malicious.js\"\n  }\n}\n```\n\nThat code may execute on install. Which is why dependencies are part of your security boundary.\n\n```text\nnpm install\n    ↓\nYou are executing third-party software\n```\n\nAnd it runs with <b>your</b> permissions: your shell, your environment variables, your cloud credentials, your SSH keys. On a CI runner it has your deploy tokens. That is the actual threat model, and it is why \"just a dev dependency\" is not the reassurance it sounds like.",
      diagram: `The tree you are trusting

    you installed         express
    you got               67 packages
    from                  dozens of maintainers you
                          have never evaluated

    any one of them can publish a new version, and
    your ^ range accepts it.


    which is where the lockfile stops being
    bookkeeping and becomes a SECURITY CONTROL

      it pins all 67, with an integrity hash
          ↓
      a compromised package cannot enter your tree
      without the lockfile changing
          ↓
      and a lockfile change is a REVIEWABLE DIFF

    habit: a large lockfile diff in a PR that only
           touches app code is a question worth asking


npm audit: severity is not impact

    npm audit              everything
    npm audit --omit=dev   what actually SHIPS
                             └─ often most of the
                                report disappears

    a critical CVE in a build tool is not in your
    running container.

    a ReDoS in a function you never call is a real
    vulnerability and not a real risk.

    treating every advisory as urgent trains a team
    to ignore the whole report, which is worse than
    triaging honestly.


    npm audit fix --force
      installs MAJOR bumps = breaking changes.
      that is not a security tool, it is a refactor.


What a postinstall script actually gets

    npm install
        ↓
    third-party code runs with YOUR permissions

      your shell
      your environment variables
      your cloud credentials
      your SSH keys
      on CI: your deploy tokens

    which is why "just a dev dependency" is not the
    reassurance it sounds like.

    ignore-scripts=true in .npmrc
      ✓ a good default for CI, where you control
        which packages need it
      ✗ confusing breakage on a dev machine
        (native modules compile in postinstall)


npx is riskier than npm install

    downloads AND executes in one step
      no lockfile. no diff to review.

    and it runs a LOCAL package if one exists,
    otherwise fetches from the registry
      └─ so a typo silently becomes a registry
         fetch of whatever that name resolves to


The one typosquatting check worth doing

    weekly downloads vs the package's age

    "a popular utility" with 40 downloads and a
    version published last week is the whole tell.`,
      codeExample: {
        title: "Auditing honestly",
        code: `// ── The tree you are actually trusting ──────────────────────
// $ npm ls --all | wc -l
//   67
//
// $ npm ls --all --parseable | sed 's|.*/||' | sort -u | wc -l
//   64 distinct packages, from dozens of maintainers
//
// You installed one.


// ── Audit, then audit what ships ────────────────────────────
// $ npm audit
//   14 vulnerabilities (9 moderate, 5 high)
//
// $ npm audit --omit=dev
//   1 moderate severity vulnerability
//
// Thirteen of those were in build tooling that is not in the
// running container. Severity is not impact, and reporting
// all 14 as urgent trains people to ignore the report.


// ── The flag that is not a security tool ────────────────────
// $ npm audit fix              compatible fixes only
// $ npm audit fix --force      MAJOR bumps, breaking changes
//
// The second is a refactor with a security-sounding name.
// Run it on a branch, then run your tests.


// ── Reviewing a lockfile diff ───────────────────────────────
// A PR that only touches src/ but has 400 changed lines in
// package-lock.json is worth a question. Someone ran
// npm install and picked up updates nobody asked for.
//
// $ git diff package-lock.json | grep '"version"' | head
//   -      "version": "5.0.2",
//   +      "version": "5.1.0",
//
// $ git diff package-lock.json | grep -c '^+.*"resolved"'
//   how many packages were added


// ── Before installing anything unfamiliar ───────────────────
// $ npm view some-package
//   name, version, published date, maintainers, repository
//
// $ npm view some-package time.modified
// $ npm view some-package maintainers
// $ npm view some-package dependencies
//
// The highest-value single check:
//   weekly downloads vs the package's age
//
// "a popular utility" with 40 downloads and a version
// published last week is the tell.


// ── ignore-scripts, where it belongs ────────────────────────
// .npmrc (in CI, or a CI-only config)
//   ignore-scripts=true
//
// Good for CI: you control which packages genuinely need a
// postinstall and can allow those explicitly.
//
// Confusing on a dev machine: anything with native code
// compiles in postinstall and will simply be broken.


// ── What a postinstall script gets ──────────────────────────
// {
//   "scripts": { "postinstall": "node collect.js" }
// }
//
// That code runs with YOUR permissions:
//   process.env               your secrets
//   ~/.aws/credentials        your cloud access
//   ~/.ssh/id_ed25519         your keys
//   on CI: the deploy token
//
// Which is why "it is only a dev dependency" is not the
// reassurance it sounds like. It ran on your laptop.


// ── npx: one step, no review ────────────────────────────────
// $ npx some-tool
//   downloads AND executes. No lockfile, no diff.
//
// And it prefers a local install, so a typo becomes a
// registry fetch of whatever that name resolves to.
//
// $ npx --no some-tool       ← fail instead of fetching`,
      },
      keyTakeaways: [
        "`npx` runs a package without a global install, and <b>downloads and executes in one step</b>.",
        "No lockfile and no diff to review, which makes it riskier than `npm install`.",
        "It prefers a local package, so a typo silently becomes a registry fetch.",
        "One `express` install is around 67 packages from dozens of maintainers you never evaluated.",
        "The <b>lockfile is a security control</b>: it pins all of them with integrity hashes.",
        "So a compromised package cannot enter your tree without a reviewable lockfile diff.",
        "A large lockfile diff in a PR that only touches app code is a question worth asking.",
        "<b>Severity is not impact.</b> `npm audit --omit=dev` shows what actually ships, and often most of the report disappears.",
        "Treating every advisory as urgent trains a team to ignore the whole report.",
        "`npm audit fix --force` installs <b>major bumps</b>. It is a refactor, not a security tool.",
        "`ignore-scripts=true` is a good default <b>for CI</b>, and confusing on a dev machine where native modules need it.",
        "For typosquatting, the highest-value check is <b>weekly downloads against the package's age</b>.",
        "A postinstall script runs with <b>your</b> permissions: env vars, cloud credentials, SSH keys, CI deploy tokens.",
        "Which is why \"only a dev dependency\" is not the reassurance it sounds like.",
      ],
      commonMistakes: [
        "<b>Running `npx` on an unfamiliar package</b> — you download and execute in one step, with nothing to review.",
        "<b>Treating every audit finding as urgent</b> — check `--omit=dev` first, or people learn to ignore the report.",
        "<b>Running `npm audit fix --force` to clear the output</b> — it installs breaking major versions.",
        "<b>Approving a PR with a large unexplained lockfile diff</b> — that is where a compromised package enters.",
        "<b>Setting `ignore-scripts` globally on a dev machine</b> — native modules break in confusing ways.",
        "<b>Assuming a dev dependency is harmless</b> — its install script ran with your credentials.",
        "<b>Installing a package name from a blog post without checking it</b> — the downloads-versus-age check takes ten seconds.",
      ],
      quiz: [
        {
          question: "Why is the lockfile a security control and not just bookkeeping?",
          options: [
            "It encrypts package contents",
            "It pins every transitive package with an integrity hash, so a compromised one cannot enter without a reviewable diff",
            "It blocks unknown publishers",
            "It runs `npm audit` automatically",
          ],
          correctIndex: 1,
          explanation:
            "You installed one package and got 67. The lockfile is what turns a change anywhere in that tree into something a human can see in a pull request.",
        },
        {
          question: "Your audit reports 14 vulnerabilities. What is the first thing to check?",
          options: [
            "Run `npm audit fix --force`",
            "`npm audit --omit=dev`, since a CVE in a build tool is not in your running container",
            "The total dependency count",
            "Whether the packages are popular",
          ],
          correctIndex: 1,
          explanation:
            "Severity is not impact. Often most of the report is dev tooling, and treating all 14 as urgent is how a team learns to ignore the whole thing.",
        },
        {
          question: "What does a package's `postinstall` script have access to?",
          options: [
            "Only its own directory",
            "Everything your user does: environment variables, cloud credentials, SSH keys, and CI deploy tokens",
            "A sandboxed environment",
            "Nothing, npm blocks it by default",
          ],
          correctIndex: 1,
          explanation:
            "It runs with your permissions. That is why \"only a dev dependency\" is not reassuring: the script already ran on your laptop or your CI runner.",
        },
      ],
    },
    {
      id: "publishing",
      title: "Publishing a package",
      durationMinutes: 12,
      explanation:
        "If you create a reusable library:\n\n```text\nmy-package/\n├── package.json\n├── README.md\n├── LICENSE\n└── dist/\n```\n\nYou decide:\n\n```text\nWhat files are published?\nWhat is the entry point?\nWhat exports are public?\nDoes it provide a CLI?\nDoes it support ESM?\nDoes it support CommonJS?\n```\n\n---\n\n## `files`\n\n```javascript\n{\n  \"files\": [\n    \"dist\"\n  ]\n}\n```\n\nPublishes the built files rather than your whole repository.\n\nWorth knowing what happens without it: npm publishes <b>everything not in `.gitignore`</b>, which typically means your source, your tests, your config and your CI files. That is a larger download for every consumer, and occasionally an accidental disclosure.\n\nA few files are always included regardless: `package.json`, `README`, `LICENSE`. And `npm pack --dry-run` shows you exactly what would ship, which is the check to run before your first publish.\n\n---\n\n## `exports`\n\n<b>`exports`</b> (defines which modules consumers may import).\n\n```javascript\n{\n  \"exports\": {\n    \".\": \"./dist/index.js\"\n  }\n}\n```\n\nConsumers can use:\n\n```javascript\nimport something from \"my-package\";\n```\n\nbut internal files are not public API.\n\n---\n\n## Why `exports` matters\n\nWithout a defined public API, users write:\n\n```javascript\nimport thing from \"my-package/internal/database.js\";\n```\n\nThen you change `internal/database.js` and they break.\n\n```text\nPublic API\n   ↓\nindex.js\n\nInternal implementation\n   ↓\nnot public\n```\n\nDay 2 covered this from the consumer's side: `exports` is <b>enforced</b>, so an unlisted path gives `ERR_PACKAGE_PATH_NOT_EXPORTED`. From the author's side that enforcement is the whole value, because it means you can refactor internals without a major version bump.\n\nOne caution when adding it to an existing package: any path you leave out becomes an <b>instant breaking change</b> for whoever was importing it. List what people already use, then deprecate deliberately.\n\n---\n\n## `bin`\n\n<b>`bin`</b> (exposes a command-line executable).\n\n```javascript\n{\n  \"bin\": {\n    \"my-tool\": \"./bin/cli.js\"\n  }\n}\n```\n\nUsers can then run:\n\n```bash\nmy-tool\n```\n\nTwo requirements that are easy to miss. The file needs a <b>shebang</b>, `#!/usr/bin/env node`, or the shell will not know how to run it. And it must be listed in `files`, or it is not published at all.\n\n---\n\n## Dual ESM/CJS\n\n```text\nESM\n ↓\ndist/index.js\n\nCommonJS\n ↓\ndist/index.cjs\n```\n\n```javascript\n{\n  \"exports\": {\n    \".\": {\n      \"import\": \"./dist/index.js\",\n      \"require\": \"./dist/index.cjs\"\n    }\n  }\n}\n```\n\nUseful for consumers on both module systems.\n\nAlso useful is a `types` condition pointing at your `.d.ts`, so TypeScript resolves declarations through the same field. It must come <b>first</b> in the object, because conditions are matched in order.\n\nAn honest caveat: dual publishing has a real cost, the <b>dual package hazard</b>. A consumer can end up loading both builds, so your module-level state exists twice and an `instanceof` check across the boundary fails. If your package holds no state, it does not matter. If it does, ESM-only is often the better call now that Node's `require(esm)` works for most cases, as Day 2 covered.\n\n---\n\n## `engines`\n\n```javascript\n{\n  \"engines\": {\n    \"node\": \">=24\"\n  }\n}\n```\n\n> This package expects Node 24 or newer.\n\nBy default this is only a <b>warning</b>, not a refusal. `engine-strict=true` in `.npmrc` makes it fail, which is worth setting on an application where the wrong Node version would break the build anyway.\n\n---\n\n## Enforcing the version\n\nDo not rely on developers remembering \"use Node 24\". Use a version manager and pin it:\n\n```text\n.nvmrc\n```\n\ncontaining:\n\n```text\n24\n```\n\n```text\nNode version\n   ↓\nexplicit\n   ↓\nreproducible\n```\n\nDay 1's lesson. The two fields do different jobs: `.nvmrc` tells a <b>developer's tooling</b> which version to use, `engines` tells a <b>consumer</b> what you support. A published package wants both.",
      diagram: `Without "files", npm publishes almost everything

    no files field
        ↓
    everything not in .gitignore
        ↓
    your source, tests, config, CI files
        ↓
    a larger download for every consumer, and
    occasionally an accidental disclosure

    always included regardless:
      package.json, README, LICENSE

    check before your first publish:
      npm pack --dry-run


exports, from the author's side

    Day 2 showed the consumer's side: an unlisted
    path gives ERR_PACKAGE_PATH_NOT_EXPORTED

    from here, that ENFORCEMENT is the whole value:
      you can refactor internals without a major
      version bump

    caution when ADDING it to an existing package:
      any path you leave out is an instant breaking
      change for whoever imported it.
      list what people already use, then deprecate
      deliberately.


bin: two things that are easy to miss

    "bin": { "my-tool": "./bin/cli.js" }

    1  the file needs a SHEBANG
         #!/usr/bin/env node
       or the shell cannot run it

    2  it must be listed in "files"
       or it is not published at all


Dual ESM/CJS has a real cost

    "exports": {
      ".": {
        "types":   "./dist/index.d.ts",   ← FIRST.
        "import":  "./dist/index.js",        conditions
        "require": "./dist/index.cjs"        match in order
      }
    }

    the DUAL PACKAGE HAZARD
      a consumer can load BOTH builds
          ↓
      your module-level state exists TWICE
      instanceof across the boundary FAILS

    no state in your package?   it does not matter
    state in your package?      ESM-only is often
                                better now that
                                require(esm) works
                                (Day 2)


engines is a warning, not a refusal

    "engines": { "node": ">=24" }
        └─ npm WARNS by default

    engine-strict=true in .npmrc
        └─ makes it fail


Two fields, two jobs

    .nvmrc     tells a DEVELOPER'S TOOLING which
               version to use            (Day 1)
    engines    tells a CONSUMER what you support

    a published package wants both.`,
      codeExample: {
        title: "A publishable package.json",
        code: `// my-package/package.json
// {
//   "name": "@rajan/my-package",
//   "version": "1.0.0",
//   "description": "Does one thing well",
//   "license": "MIT",
//   "type": "module",
//
//   // ── what ships ────────────────────────────────────────
//   "files": ["dist", "bin"],
//
//   // ── the public API, enforced ──────────────────────────
//   "exports": {
//     ".": {
//       "types":   "./dist/index.d.ts",     ← FIRST: order matters
//       "import":  "./dist/index.js",
//       "require": "./dist/index.cjs"
//     },
//     "./database": {
//       "types":  "./dist/database.d.ts",
//       "import": "./dist/database.js"
//     }
//   },
//
//   // ── a CLI ─────────────────────────────────────────────
//   "bin": { "my-tool": "./bin/cli.js" },
//
//   // ── what you support ──────────────────────────────────
//   "engines": { "node": ">=24" },
//
//   "scripts": {
//     "build": "tsc",
//     "prepublishOnly": "npm run build"    ← cannot ship stale
//   }
// }


// ── bin/cli.js needs the shebang ────────────────────────────
// #!/usr/bin/env node
// import { run } from "../dist/index.js";
// run(process.argv.slice(2));
//
// Without it the shell does not know what to run the file
// with. And it must be in "files" or it never ships.


// ── Check what would actually be published ──────────────────
// $ npm pack --dry-run
//
// npm notice === Tarball Contents ===
// npm notice 1.1kB package.json
// npm notice 2.4kB README.md
// npm notice 1.1kB LICENSE
// npm notice 8.2kB dist/index.js
// npm notice 1.9kB dist/index.d.ts
// npm notice  412B bin/cli.js
// npm notice === Tarball Details ===
// npm notice total files: 6
//
// Without "files", that list would include src/, tests/,
// tsconfig.json, .github/ and anything else not gitignored.
// Run this before your first publish.


// ── What exports buys the author ────────────────────────────
// A consumer trying to reach inside:
//   import x from "@rajan/my-package/dist/internal.js";
//   → ERR_PACKAGE_PATH_NOT_EXPORTED
//
// Which means you can rename, move or delete internal.js
// without a major version bump. That enforcement is the
// point, and Day 2 showed the same thing from the consumer's
// side.
//
// ⚠ Adding exports to an EXISTING package: anything you
//   leave out breaks whoever was importing it. List what
//   people already use first.


// ── The dual package hazard, concretely ─────────────────────
// dist/index.js   (ESM)   export const cache = new Map();
// dist/index.cjs  (CJS)   exports.cache = new Map();
//
// An app with both an ESM and a CJS consumer of your package
// now has TWO caches. And:
//
//   esmInstance instanceof CjsClass    → false
//
// No state in your package? Harmless. State in it? ESM-only
// is often the better call now that require(esm) works for
// most cases.


// ── engines warns, it does not refuse ───────────────────────
// "engines": { "node": ">=24" }
//
// On Node 20: npm WARNS and installs anyway.
//
// .npmrc
//   engine-strict=true      ← now it fails
//
// Worth setting on an application, where the wrong Node
// would break the build regardless.`,
      },
      keyTakeaways: [
        "Without <b>`files`</b>, npm publishes everything not in `.gitignore`: source, tests, config, CI.",
        "`package.json`, `README` and `LICENSE` always ship regardless.",
        "<b>`npm pack --dry-run`</b> shows exactly what would be published. Run it before your first publish.",
        "<b>`exports`</b> defines the public API, and Day 2 showed it is <b>enforced</b> for consumers.",
        "From the author's side that enforcement is the value: you can refactor internals without a major bump.",
        "Adding `exports` to an existing package makes any omitted path an <b>instant breaking change</b>.",
        "<b>`bin`</b> exposes a CLI. The file needs a `#!/usr/bin/env node` shebang and must be in `files`.",
        "Dual ESM/CJS uses conditional exports, with <b>`types` first</b> because conditions match in order.",
        "The <b>dual package hazard</b> is real: a consumer can load both builds, duplicating module state.",
        "So `instanceof` across the boundary fails. If your package holds state, ESM-only is often better.",
        "<b>`engines` is a warning, not a refusal.</b> `engine-strict=true` in `.npmrc` makes it fail.",
        "`.nvmrc` tells a developer's tooling which Node to use. `engines` tells a consumer what you support.",
      ],
      commonMistakes: [
        "<b>Publishing without `files`</b> — your source, tests and config all ship to every consumer.",
        "<b>Skipping `npm pack --dry-run`</b> — you find out what shipped after it shipped.",
        "<b>Adding `exports` without listing existing entry points</b> — every omission is a breaking change.",
        "<b>A `bin` file with no shebang</b> — the shell has no idea how to run it.",
        "<b>A `bin` file missing from `files`</b> — the command is declared and not published.",
        "<b>Putting `types` last in a conditional export</b> — conditions match in order, so it may never be reached.",
        "<b>Dual publishing a stateful package</b> — two copies of your module state, and failing `instanceof`.",
        "<b>Assuming `engines` blocks the wrong Node</b> — it warns unless `engine-strict` is set.",
      ],
      quiz: [
        {
          question: "What gets published if you omit the `files` field?",
          options: [
            "Only `dist`",
            "Everything not in `.gitignore`: source, tests, config and CI files",
            "Only `package.json`",
            "Nothing, publish fails",
          ],
          correctIndex: 1,
          explanation:
            "A larger download for every consumer and occasionally an accidental disclosure. `npm pack --dry-run` shows you the exact list before you publish.",
        },
        {
          question: "What does `exports` give the package author?",
          options: [
            "Faster imports",
            "The ability to refactor internal files without a major version bump, because unlisted paths are unreachable",
            "Automatic TypeScript types",
            "Smaller bundle size",
          ],
          correctIndex: 1,
          explanation:
            "Day 2 showed the enforcement from the consumer's side. From here, that enforcement is exactly what stops users depending on internals you want to change.",
        },
        {
          question: "What is the dual package hazard?",
          options: [
            "Publishing two versions at once",
            "A consumer loading both your ESM and CJS builds, so module state exists twice and `instanceof` fails across them",
            "A conflict between two lockfiles",
            "Types not resolving",
          ],
          correctIndex: 1,
          explanation:
            "Harmless for a stateless package, and a real bug for a stateful one. It is why ESM-only is often the better call now that `require(esm)` works for most cases.",
        },
      ],
    },
    {
      id: "hygiene",
      title: "Dependency hygiene",
      durationMinutes: 10,
      explanation:
        "A professional project should not look like:\n\n```text\npackage.json\n   ↓\n200 packages\n   ↓\n\"We don't know why we need half of these.\"\n```\n\nEvery dependency has a cost:\n\n```text\nSecurity risk\nMaintenance\nUpdates\nInstall time\nDisk space\nBreaking changes\nLicensing considerations\n```\n\n> <b>Do I actually need this dependency?</b>\n\nThe cost that is easiest to underrate is <b>maintenance</b>. A dependency is not a one-time decision, it is a subscription: you now track its releases, its advisories, and its own dependencies. Ten packages is fine. Two hundred is a part-time job somebody is not doing.\n\nAnd an abandoned dependency is worse than a missing feature. A package with no release in three years and an open advisory leaves you choosing between forking it and rewriting the thing you avoided writing.\n\n---\n\n## Node already provides a lot\n\nModern Node includes APIs that used to need packages:\n\n```text\nfetch()\nURL\nURLSearchParams\nWeb Streams\nAbortController\nnode:test\nnode:crypto\nnode:fs\nnode:path\nnode:events\n```\n\nSo before `npm install something`, ask:\n\n```text\nDoes Node already provide this?\n```\n\nThe list of packages this genuinely replaces is longer than people expect:\n\n```text\nnode-fetch, axios (for simple calls)   →  fetch()\nuuid (for v4 only)                     →  crypto.randomUUID()\ndotenv                                 →  node --env-file\nnodemon                                →  node --watch\nmocha, jest (for simple suites)        →  node:test\nrimraf                                 →  fs.rm({ recursive })\nglob                                   →  fs.glob\nqs (for simple cases)                  →  URLSearchParams\n```\n\nDays 1, 5, 6 and 10 covered most of those, which is the point: knowing the standard library <b>is</b> dependency hygiene.\n\n---\n\n## But be honest about the trade\n\nThe rule is not \"never install anything\". Some of those replacements are partial.\n\n`fetch` does not give you interceptors or automatic retries, so if you write all of that by hand, axios was not the enemy. `node:test` is fine for a straightforward suite and lacks the ecosystem of matchers and mocks a large one uses. `node --env-file` does not do variable expansion or multiple files.\n\nSo the real question is not \"can Node do this\" but <b>\"do I need the part Node cannot do\"</b>. A dependency that earns its place is fine. One that saves you four lines is not.\n\n---\n\n## Auditing a real project\n\n```bash\nnpm ls\n```\n\nshows the dependency tree.\n\n```bash\nnpm audit\n```\n\nLook at:\n\n```text\nDirect dependencies\nTransitive dependencies\nVulnerabilities\nOutdated packages\n```\n\nTwo more commands worth knowing. `npm ls --depth=0` lists just your direct dependencies, which is the list you should be able to justify. And `npm outdated` shows what has moved, with the wanted-versus-latest distinction telling you which updates your ranges already allow.\n\n---\n\n## Removing packages\n\nFind three that Node can replace:\n\n```text\nnode-fetch\n    ↓\nfetch()\n\nsome URL utility\n    ↓\nURL / URLSearchParams\n\nsome simple UUID/utility package\n    ↓\npossibly crypto.randomUUID()\n```\n\n<b>Do not remove packages blindly.</b> First verify:\n\n```text\nWhat does the package actually provide?\nDoes Node's API fully cover our use case?\nWill removing it break anything?\nDoes the project support the required Node version?\n```\n\nThen:\n\n```bash\nnpm uninstall package-name\n```\n\nand run your tests, build and lint.\n\nThat last check is where the `uuid` example bites, because `crypto.randomUUID()` produces v4 only. A project using v1 or v5 has a different requirement, and the swap silently changes behaviour rather than failing.\n\n---\n\n## The professional rule\n\n> <b>Every dependency is code you are choosing to trust. Before adding a package, check whether Node already provides the functionality. When you do add one, understand why it is there, lock the dependency tree, keep it updated, and remove dependencies that no longer provide enough value.</b>",
      diagram: `A dependency is a subscription, not a purchase

    you now track
      its releases
      its advisories
      its own dependencies
      its maintainer's activity

    ten packages   fine
    two hundred    a part-time job somebody is not doing


    and an ABANDONED dependency is worse than a
    missing feature

      no release in three years + an open advisory
          ↓
      fork it, or rewrite the thing you avoided writing


What Node genuinely replaces now

    node-fetch, axios (simple)  →  fetch()          Day 10
    uuid (v4 only)              →  crypto.randomUUID()
    dotenv                      →  node --env-file  Day 1
    nodemon                     →  node --watch     Day 1
    mocha/jest (simple)         →  node:test
    rimraf                      →  fs.rm recursive  Day 6
    glob                        →  fs.glob          Day 6
    qs (simple)                 →  URLSearchParams  Day 10

    which is the point: knowing the standard library
    IS dependency hygiene.


But be honest: some replacements are PARTIAL

    fetch            no interceptors, no retries
                     write all three by hand and axios
                     was not the enemy
    node:test        fine for a simple suite. lacks the
                     matcher and mock ecosystem
    node --env-file  no variable expansion, no multiple
                     files

    so the question is not "can Node do this"
    it is "do I need the part Node CANNOT do"

    a dependency that earns its place is fine.
    one that saves you four lines is not.


The commands for an honest audit

    npm ls --depth=0    your DIRECT dependencies
                          └─ the list you should be
                             able to justify
    npm ls --all        the whole tree
    npm audit --omit=dev  what actually ships
    npm outdated        wanted vs latest
                          └─ wanted = what your ranges
                             already allow


The swap that bites quietly

    uuid  →  crypto.randomUUID()

    randomUUID is v4 ONLY.

    a project using v1 or v5 has a different
    requirement, and the swap changes behaviour
    rather than failing.`,
      codeExample: {
        title: "Auditing and trimming a real project",
        code: `// ── The list you should be able to justify ──────────────────
// $ npm ls --depth=0
//   my-api@1.0.0
//   ├── express@5.0.2
//   ├── node-fetch@3.3.2        ← Node has fetch (Day 10)
//   ├── uuid@9.0.1              ← maybe crypto.randomUUID()
//   ├── dotenv@16.4.5           ← node --env-file (Day 1)
//   ├── rimraf@5.0.5            ← fs.rm recursive (Day 6)
//   └── nodemon@3.1.0           ← node --watch (Day 1)
//
// $ npm ls --all | wc -l
//   214                          ← what those six pulled in


// ── What has moved ──────────────────────────────────────────
// $ npm outdated
//   Package      Current  Wanted  Latest
//   express      5.0.2    5.0.9   5.1.0
//                         └────┘   └────┘
//                    your range    a minor bump you
//                    already       have not accepted
//                    allows this


// ── The replacements, verified before removing ──────────────

// 1. node-fetch → fetch()          Day 10
const response = await fetch("https://example.com", {
  signal: AbortSignal.timeout(5000),
});
console.log(response.status);
// ✓ covers ordinary calls. ✗ no interceptors, no retries.
//   if you need those, you are rebuilding axios by hand.

// 2. dotenv → node --env-file      Day 1
// $ node --env-file=.env src/server.js
console.log("PORT from env:", process.env.PORT ?? "(unset)");
// ✗ no variable expansion, no multiple files

// 3. nodemon → node --watch        Day 1
// $ node --watch src/server.js

// 4. rimraf → fs.rm                Day 6
import { rm } from "node:fs/promises";
// await rm("dist", { recursive: true, force: true });

// 5. glob → fs.glob                Day 6
import fs from "node:fs/promises";
const files = await Array.fromAsync(fs.glob("lib/**/*.ts"));
console.log("globbed:", files.length, "files");

// 6. uuid → crypto.randomUUID()    ⚠ CHECK THIS ONE
import { randomUUID } from "node:crypto";
console.log(randomUUID());
// ⚠ randomUUID is v4 ONLY.
//   A project using uuid.v1() or uuid.v5() has a different
//   requirement, and this swap changes behaviour rather
//   than failing. Grep for which version is actually used:
//
//   $ grep -rn "uuid" src/ | grep -v "^Binary"


// ── The removal procedure ───────────────────────────────────
// 1. grep for every use of the package
// 2. check Node's API covers ALL of them, not just the
//    first one you looked at
// 3. check the project's minimum Node version supports it
// 4. npm uninstall <package>
// 5. npm run typecheck && npm test && npm run lint
//
// Step 2 is where uuid catches people.


// ── The question that decides it ────────────────────────────
// not:  "can Node do this?"
// but:  "do I need the part Node cannot do?"
//
// a dependency that earns its place is fine.
// one that saves you four lines is a subscription you
// are paying for nothing.`,
      },
      keyTakeaways: [
        "Every dependency costs security surface, maintenance, install time and breaking changes.",
        "The underrated cost is <b>maintenance</b>: a dependency is a subscription, not a purchase.",
        "Ten packages is fine. Two hundred is a part-time job nobody is doing.",
        "An <b>abandoned dependency</b> is worse than a missing feature: fork it, or rewrite what you avoided.",
        "Modern Node replaces `node-fetch`, `dotenv`, `nodemon`, `rimraf`, `glob`, `qs` and more.",
        "Days 1, 5, 6 and 10 covered most of them. Knowing the standard library <b>is</b> dependency hygiene.",
        "But be honest: some replacements are <b>partial</b>. `fetch` has no interceptors or retries.",
        "So the question is not \"can Node do this\" but <b>\"do I need the part Node cannot do\"</b>.",
        "`npm ls --depth=0` lists your direct dependencies. That is the list you should be able to justify.",
        "`npm outdated` shows wanted versus latest: wanted is what your ranges already allow.",
        "Never remove blindly. Grep every use, and check Node covers all of them, not just the first.",
        "<b>`crypto.randomUUID()` is v4 only</b>, so replacing `uuid` silently changes behaviour if v1 or v5 was used.",
      ],
      commonMistakes: [
        "<b>Adding a package that saves four lines</b> — you have taken on a subscription for nothing.",
        "<b>Treating an install as a one-time decision</b> — you now track its releases and advisories.",
        "<b>Keeping an abandoned dependency</b> — the longer you wait, the worse the fork-or-rewrite choice gets.",
        "<b>Replacing `uuid` with `randomUUID` without checking the version used</b> — it is v4 only, and the swap is silent.",
        "<b>Removing a package after checking one use site</b> — grep for all of them first.",
        "<b>Rebuilding axios out of `fetch` wrappers</b> — at that point the dependency was earning its place.",
        "<b>Not running the build and lint after an uninstall</b> — the failure may not be in your tests.",
      ],
      quiz: [
        {
          question: "What is the most underrated cost of a dependency?",
          options: [
            "Disk space",
            "Maintenance: you now track its releases, advisories and own dependencies, indefinitely",
            "Install time",
            "Bundle size",
          ],
          correctIndex: 1,
          explanation:
            "It is a subscription, not a purchase. Ten packages is manageable. Two hundred is ongoing work somebody has to do, and usually is not doing.",
        },
        {
          question: "You want to replace `uuid` with `crypto.randomUUID()`. What must you check first?",
          options: [
            "The install size",
            "Which UUID version the code actually uses, since `randomUUID` produces v4 only",
            "Whether it is a dev dependency",
            "The package's licence",
          ],
          correctIndex: 1,
          explanation:
            "A project using v1 or v5 has a different requirement, and the swap changes behaviour rather than failing. That silence is what makes it worth grepping first.",
        },
        {
          question: "What is the better version of \"can Node do this?\"",
          options: [
            "Is the package popular?",
            "Do I need the part Node cannot do?",
            "How many dependencies does it have?",
            "Is it TypeScript-first?",
          ],
          correctIndex: 1,
          explanation:
            "Some replacements are partial. `fetch` has no interceptors or retries, and if you write all of that yourself the dependency was earning its place.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between `package.json` and the lockfile?",
      options: [
        "They are the same, one is generated",
        "One declares ranges you want, the other records the exact versions resolved across the whole tree",
        "The lockfile lists only direct dependencies",
        "One is for production",
      ],
      correctIndex: 1,
      explanation:
        "A wish versus a fact, with `node_modules` as what is actually on disk. Keeping the three distinct resolves most confusion about npm.",
    },
    {
      question: "Which question decides between `dependencies` and `devDependencies`?",
      options: [
        "Is it a build tool?",
        "Does the deployed process import it?",
        "Is it large?",
        "Did I use it while developing?",
      ],
      correctIndex: 1,
      explanation:
        "A build tool that runs before deploy is a dev dependency even if the build is essential. Getting it wrong gives you `ERR_MODULE_NOT_FOUND` on the first production start.",
    },
    {
      question: "What range does `^0.5.2` resolve to?",
      options: [
        "`>=0.5.2 <1.0.0`",
        "`>=0.5.2 <0.6.0`, identical to `~0.5.2`",
        "Exactly `0.5.2`",
        "`>=0.5.2 <0.5.3`",
      ],
      correctIndex: 1,
      explanation:
        "Below 1.0.0, SemVer treats a minor bump as potentially breaking, so caret stops at the next minor. And for `0.0.x`, caret is actually tighter than tilde.",
    },
    {
      question: "Why use `npm ci` in CI rather than `npm install`?",
      options: [
        "It is faster",
        "It fails when the lockfile is missing or out of sync, instead of quietly resolving a tree nobody reviewed",
        "It skips dev dependencies",
        "It runs audits",
      ],
      correctIndex: 1,
      explanation:
        "That failure is the point. `npm install` would rewrite the lockfile and pass, so CI would test something different from what anyone approved.",
    },
    {
      question: "Why is the lockfile a security control?",
      options: [
        "It encrypts packages",
        "It pins every transitive package with an integrity hash, so a change anywhere is a reviewable diff",
        "It blocks unknown publishers",
        "It runs audits automatically",
      ],
      correctIndex: 1,
      explanation:
        "You installed one package and got dozens. The lockfile turns any change in that tree into something a human can see in a pull request.",
    },
    {
      question: "Your audit shows 14 vulnerabilities. What do you check first?",
      options: [
        "Run `npm audit fix --force`",
        "`npm audit --omit=dev`, since a CVE in build tooling is not in the running container",
        "The total package count",
        "Package popularity",
      ],
      correctIndex: 1,
      explanation:
        "Severity is not impact. Treating every advisory as urgent is how a team learns to ignore the entire report.",
    },
    {
      question: "What does a package's `postinstall` script have access to?",
      options: [
        "Only its own directory",
        "Everything your user has: environment variables, cloud credentials, SSH keys, CI deploy tokens",
        "A sandbox",
        "Nothing by default",
      ],
      correctIndex: 1,
      explanation:
        "Which is why \"only a dev dependency\" is not reassuring. The script already ran with your permissions.",
    },
    {
      question: "What gets published if you omit `files`?",
      options: [
        "Only `dist`",
        "Everything not in `.gitignore`: source, tests, config, CI",
        "Only `package.json`",
        "The publish fails",
      ],
      correctIndex: 1,
      explanation:
        "A bigger download for every consumer, and occasionally an accidental disclosure. `npm pack --dry-run` shows the exact list first.",
    },
    {
      question: "What is the better question than \"can Node replace this package?\"",
      options: [
        "Is the package maintained?",
        "Do I need the part Node cannot do?",
        "How many downloads does it have?",
        "Is it written in TypeScript?",
      ],
      correctIndex: 1,
      explanation:
        "Some replacements are partial. `fetch` has no interceptors or retries, and rebuilding those by hand means the dependency was earning its place.",
    },
  ],
  project: {
    name: "day-12",
    goal: "Audit a real project's dependencies, then remove three that modern Node can replace, verifying each swap rather than assuming it.",
    brief:
      "This one uses a project you already have. The auditing is mechanical; the judgement is the exercise. Two things will catch you if you rush. `crypto.randomUUID()` is v4 only, so replacing `uuid` changes behaviour silently if the code used v1 or v5. And some replacements are partial: if you end up writing retry and interceptor wrappers around `fetch`, axios was earning its place and you should keep it.",
    steps: [
      "Pick an existing Node project of yours with a handful of dependencies.",
      "Run `npm ls --depth=0` and write down every direct dependency, with one sentence on why it is there.",
      "Run `npm ls --all | wc -l` and compare that number to your direct count.",
      "Run `npm audit`, then `npm audit --omit=dev`, and note how much of the report is dev-only.",
      "Run `npm outdated` and identify which updates your ranges already allow, from the wanted column.",
      "Pick three dependencies you believe modern Node replaces. `grep` for every use of each one.",
      "For each, confirm Node's API covers all of those uses, not just the first, and that your minimum Node version supports it.",
      "Remove them one at a time with `npm uninstall`, running your typecheck, tests and lint after each.",
      "Note which of the three you could not remove cleanly, and why.",
    ],
    acceptance: [
      "A written list of direct dependencies, each with a one-line justification.",
      "The direct count and the total installed count, with the gap noted.",
      "The audit output before and after `--omit=dev`, with the difference explained.",
      "Three packages removed, with typecheck, tests and lint passing after each removal.",
      "For each removal, evidence you checked every use site rather than one.",
      "If `uuid` was one of them, a note on which version the code used and why `randomUUID` was or was not sufficient.",
      "At least one dependency you decided to keep, with the reason it earns its place.",
      "The lockfile is committed, and you can explain why `npm ci` in CI would fail if it were not.",
    ],
    stretch: [
      "Add `npm ci` and `npm audit --omit=dev` to a CI workflow, and confirm a stale lockfile turns the build red.",
      "Deliberately edit `package.json` without updating the lockfile, run `npm ci`, and read the exact error.",
      "Set `save-exact=true` in `.npmrc`, install something, and compare what lands in `package.json`.",
      "Check `semver.validRange` for `^0.5.2` and `^0.0.3` against your own guesses before running it.",
      "Add a `check` script that runs typecheck, lint and tests, so CI has one entry point.",
      "For a library you own, run `npm pack --dry-run` and see whether `files` is doing what you assumed.",
    ],
  },
};
