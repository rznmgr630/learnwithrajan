import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_20_LESSONS: LessonDay = {
  day: 20,
  title: "Configuration and environment",
  totalMinutes: 92,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "config-outside-code",
      title: "Configuration belongs outside the code",
      durationMinutes: 10,
      explanation:
        "<b>Configuration</b> (everything your application needs to know that differs between deployments).\n\n> The words carrying the weight are <b>differs between deployments</b>, and that is a narrower category than \"settings\". Configuration is not a bag of tunable values; it is the specific set of facts that one deployment of your code knows and another does not.\n\n```text\nDatabase URL · API keys · port · JWT secret · feature flags · service URLs\n```\n\n---\n\n## The Twelve-Factor idea\n\n<b>Twelve-Factor App</b> (a set of principles for building applications that are portable and easy to operate).\n\nThe relevant one: <b>store configuration in the environment</b>.\n\n```javascript\nconst databaseUrl = \"postgres://admin:password@localhost/app\";   // ✗\nconst databaseUrl = process.env.DATABASE_URL;                     // ✓\n```\n\n> The test that decides whether something is configuration is not \"does it change?\" but <b>\"does it differ between deployments of the same code?\"</b>. A database URL differs, so it is configuration. A retry count that is the same everywhere is a constant, and moving it into the environment adds a way for production to disagree with your tests for no benefit.\n>\n> The stronger version of the rule: your build artifact should be <b>identical</b> across environments. If staging and production run different code, then testing in staging tells you about staging.\n\n---\n\n## Why not just branch on the environment\n\n```javascript\nif (environment === \"production\") {\n  // completely different code path\n}\n```\n\n> That is the shape to avoid, and the reason is that the branch is <b>only ever exercised in the environment you cannot afford to break</b>. Your tests run the development branch, staging runs the staging branch, and the production branch is first executed on real traffic. Every `if (isProduction)` is a line of code that has never run before it matters.\n>\n> Configuration removes the branch: one code path, different values.\n\n---\n\n## The exception worth naming\n\nSome behaviour genuinely differs, such as pretty-printed logs locally and JSON in production, or Swagger UI off in production from Day 16.\n\n> The way to keep those honest is to branch <b>once, at composition time</b>, rather than scattered through the application. `buildApp()` from Day 15 decides which logger transport to use; nothing downstream asks what environment it is in. That way the number of untested-in-production branches stays countable.\n\n---\n\n## Configuration and secrets are not the same\n\n```text\nConfiguration     PORT=3000 · LOG_LEVEL=info · NODE_ENV=production\nSecret            DATABASE_PASSWORD · JWT_SECRET · STRIPE_SECRET_KEY\n```\n\n> Both arrive as environment variables and they need different <b>handling</b>. A port can go in a Dockerfile, a repository, a dashboard screenshot and a support ticket. A signing secret needs a secret manager, an audit trail and a rotation plan, and Day 19's point applies: once it reaches a log or a git history, it is disclosed and rotation is the only fix.\n>\n> The practical consequence is that you should be able to say which of your variables are secrets. If the answer is \"all of them, probably\", then every one of them is being handled as carefully as the least careful place any of them appears.",
      diagram: `Configuration: differs between DEPLOYMENTS

    database URL · API keys · port
    JWT secret · feature flags · service URLs


The test that decides

    not "does it change?"
    but "DOES IT DIFFER BETWEEN DEPLOYMENTS OF
         THE SAME CODE?"

    a database URL differs      → configuration
    a retry count that is the
      same everywhere           → a CONSTANT

    moving a constant into the environment adds
    a way for production to disagree with your
    tests, for no benefit.

    the stronger rule:

      YOUR BUILD ARTIFACT SHOULD BE IDENTICAL
      ACROSS ENVIRONMENTS.

      if staging and production run different
      code, testing in staging tells you about
      staging.


⚠ Why not branch on the environment

    if (environment === "production") { ... }

    the reason is not tidiness:

      THE BRANCH IS ONLY EVER EXERCISED IN THE
      ENVIRONMENT YOU CANNOT AFFORD TO BREAK.

      your tests run the development branch
      staging runs the staging branch
      the production branch is FIRST EXECUTED ON
        REAL TRAFFIC

    every if (isProduction) is a line that has
    never run before it matters.

    configuration removes the branch:
      one code path, different values.


The exception, kept honest

    some behaviour genuinely differs:
      pretty logs locally, JSON in production
      Swagger UI off in production   (Day 16)

    branch ONCE, at COMPOSITION TIME.

      buildApp() decides the logger transport
      nothing downstream asks what environment
        it is in

    → the number of untested-in-production
      branches stays countable.


Configuration vs secrets: different HANDLING

    CONFIGURATION
      PORT=3000 · LOG_LEVEL=info
      NODE_ENV=production

      fine in a Dockerfile, a repo, a dashboard
      screenshot, a support ticket

    SECRET
      DATABASE_PASSWORD · JWT_SECRET
      STRIPE_SECRET_KEY

      needs a secret manager, an audit trail and
      a rotation plan

      Day 19: once it reaches a log or a git
      history it is DISCLOSED, and rotation is
      the only fix


    the practical consequence:

      you should be able to SAY which of your
      variables are secrets.

      if the answer is "all of them, probably",
      then every one is handled as carefully as
      the LEAST CAREFUL PLACE any of them
      appears.`,
      codeExample: {
        title: "One artifact, different values",
        code: `// ── ✗ Hard-coded ────────────────────────────────────────────
const db = new Pool({
  connectionString: "postgres://admin:hunter2@db.internal/app",
});
// Now the production password is in git history, which Day 19
// established means it is disclosed and must be rotated. And
// there is no way to point this at a test database without
// editing code.


// ── ✗ Branching on the environment ──────────────────────────
function getDatabaseUrl() {
  if (process.env.NODE_ENV === "production") {
    return "postgres://admin:hunter2@db.internal/app";
  }
  if (process.env.NODE_ENV === "staging") {
    return "postgres://admin:staging@db-staging.internal/app";
  }
  return "postgres://localhost/app_dev";
}
//
// Two problems, and the second is the interesting one.
//
// 1. The secrets are still in git.
// 2. Your test suite runs the third branch. Staging runs the
//    second. The FIRST BRANCH has never executed anywhere
//    before it executes in production.
//
// Every environment branch is code you ship untested to the
// one place that matters.


// ── ✓ One code path ─────────────────────────────────────────
const db = new Pool({ connectionString: config.databaseUrl });
//
// The same line runs in tests, in CI, in staging and in
// production. Only the value differs, and the value is
// supplied by whatever is running the process.


// ── The exception, isolated to one place ────────────────────
// src/app.js — Day 15's composition function
export function buildApp(opts = {}) {
  const app = Fastify({
    logger: config.isProduction
      ? { level: config.logLevel }                         // JSON to stdout
      : { level: config.logLevel,
          transport: { target: "pino-pretty" } },          // readable locally
    ...opts,
  });

  app.register(database);
  app.register(userRoutes);

  // Day 16: a live API console is not for a public production
  // service.
  if (!config.isProduction) {
    app.register(swagger, { transform: jsonSchemaTransform });
    app.register(swaggerUi, { routePrefix: "/docs" });
  }

  return app;
}
//
// Two environment branches in the entire application, both in
// the file whose job is composition. Every route, service and
// repository below this is environment-agnostic, so nothing
// downstream can behave differently in production than it did
// in your tests.
//
// Contrast with the version where forty files each ask
// process.env.NODE_ENV: that is forty branches, and you
// cannot list them.


// ── Configuration versus a constant ─────────────────────────
// ✓ Configuration: differs between deployments.
//     DATABASE_URL, PORT, LOG_LEVEL, ALLOWED_ORIGINS,
//     STRIPE_SECRET_KEY, REDIS_URL
//
// ✗ Not configuration, even though it is a number you might
//   want to change:
//     const MAX_RETRIES = 3;
//     const PAGE_SIZE_DEFAULT = 20;
//     const BCRYPT_COST = 12;
//
//   These are the same everywhere. Putting them in the
//   environment means production can silently run with a
//   different value from the one your tests exercised, and
//   Day 18's BCRYPT_COST is a good example: an accidental
//   env var of 4 in production is a security downgrade with
//   no code change and no diff.
//
//   If it must be tunable per environment, it is
//   configuration and it needs to be in the schema, with a
//   sensible default and bounds. The next lessons are about
//   exactly that.


// ── Which of these are secrets? ─────────────────────────────
// You should be able to answer instantly:
//
//   NODE_ENV                 no
//   PORT                     no
//   LOG_LEVEL                no
//   ALLOWED_ORIGINS          no
//   DATABASE_URL             YES (it contains a password)
//   JWT_SECRET               YES
//   STRIPE_SECRET_KEY        YES
//   SENTRY_DSN               mostly no, and treat as low-risk
//
// DATABASE_URL is the one people get wrong, because it looks
// like a URL and is a credential. Day 19's redaction lesson:
// logging it publishes the password to wherever your logs go.`,
      },
      keyTakeaways: [
        "The test for configuration is whether the value differs between deployments of the same code, not whether it changes.",
        "The stronger rule: the build artifact should be identical across environments, or testing in staging only tells you about staging.",
        "Avoid `if (isProduction)` branches, because that branch is first executed on real traffic and has never run before it mattered.",
        "Keep genuine environment differences in one place, at composition time, so the number of untested branches stays countable.",
        "Configuration and secrets both arrive as environment variables and need different handling.",
        "A port can go in a repository and a screenshot. A signing secret needs a manager, an audit trail and a rotation plan.",
        "You should be able to say which of your variables are secrets. If you cannot, all of them are handled as carelessly as the worst place any appears.",
        "`DATABASE_URL` is the one people misclassify: it looks like a URL and it contains a password.",
        "Constants like a bcrypt cost or a retry count are not configuration. Making them tunable lets production silently differ from your tests.",
      ],
      commonMistakes: [
        "Hard-coding a production connection string, which puts the password in git history and requires rotation.",
        "Branching on `NODE_ENV` to choose values, which keeps the secrets in code and ships an untested branch to production.",
        "Scattering `process.env.NODE_ENV` checks through forty files, so nobody can list the ways production differs.",
        "Moving true constants into the environment, so production can run a different bcrypt cost from your tests with no diff.",
        "Treating `DATABASE_URL` as ordinary configuration. It is a credential.",
        "Being unable to say which variables are secrets, which means none of them is being handled as one.",
      ],
      quiz: [
        {
          question: "What is the test for whether something is configuration?",
          options: [
            "Whether the value changes over time",
            "Whether it differs between deployments of the same code",
            "Whether it is a secret",
            "Whether it is a string",
          ],
          correctIndex: 1,
          explanation:
            "A retry count that is identical everywhere is a constant. Making it configurable lets production disagree with your tests for no benefit.",
        },
        {
          question: "What is the real problem with `if (process.env.NODE_ENV === \"production\")` branches?",
          options: [
            "They are slow",
            "The production branch is first executed on real traffic, so it is code you ship untested to the one place that matters",
            "`NODE_ENV` is unreliable",
            "They cannot be typed",
          ],
          correctIndex: 1,
          explanation:
            "Your tests run the development branch and staging runs the staging branch. Configuration replaces the branch with a value.",
        },
        {
          question: "Where should genuine environment differences live?",
          options: [
            "Wherever they are needed",
            "In one composition function, so nothing downstream asks what environment it is in and the untested branches stay countable",
            "In the database",
            "In a `switch` in every module",
          ],
          correctIndex: 1,
          explanation:
            "Day 15's `buildApp()` deciding the logger transport is the pattern. Forty scattered checks are forty branches you cannot list.",
        },
        {
          question: "Which of these is a secret that people commonly misclassify?",
          options: [
            "`PORT`",
            "`DATABASE_URL`, because it looks like a URL and contains a password",
            "`LOG_LEVEL`",
            "`NODE_ENV`",
          ],
          correctIndex: 1,
          explanation:
            "Day 19's redaction point: logging it publishes the database password to wherever your logs are stored.",
        },
      ],
    },
    {
      id: "loading-env-files",
      title: "Loading env files, and the rule that surprises everyone",
      durationMinutes: 11,
      explanation:
        "Node can read `.env` files itself. Three ways, and one behaviour you have to know.\n\n---\n\n## `--env-file`\n\n```bash\nnode --env-file=.env app.js\n```\n\nVerified on Node 24.14.1 with a `.env` containing `PORT=3000`:\n\n```javascript\nprocess.env.PORT      // \"3000\"\n```\n\nNo `dotenv` needed for a basic file.\n\n---\n\n## The rule nobody mentions\n\n> Verified, and it is the most important thing in this lesson:\n>\n> ```text\n> PORT=9999 node --env-file=.env app.js\n>   → process.env.PORT is \"9999\"\n> ```\n>\n> <b>An already-set variable wins.</b> The file does not override the real environment; it fills in what is missing. Verified identically for `process.loadEnvFile()`.\n>\n> That precedence is exactly right for production, where a platform's injected variables must beat a file that happened to get deployed. And it is the cause of a specific twenty-minute confusion locally: you change a value in `.env`, restart, and nothing happens, because you exported that variable in your shell an hour ago and forgot. The fix is `unset PORT`, and knowing to look.\n\n---\n\n## Missing files\n\nVerified:\n\n```text\nnode --env-file=.nope           →  node: .nope: not found   (exits)\nnode --env-file-if-exists=.nope →  \".nope not found. Continuing without it.\"\n```\n\n> Use `--env-file` when the file is required, so a missing one is a startup failure rather than a mystery. Use `--env-file-if-exists` for a local override file that may not be there, which is the usual pattern for `.env.local`.\n\n---\n\n## `process.loadEnvFile()`\n\n```javascript\nprocess.loadEnvFile();          // .env in the cwd\nprocess.loadEnvFile(\".env.test\");\n```\n\nVerified working. Useful when you cannot control the command line, such as inside a test setup file.\n\n> One caveat that follows from being a function call: it runs when the module executes, so <b>anything imported before it does not see the variables</b>. With ES modules all imports are hoisted and run first, so a module that reads `process.env` at its top level will read `undefined`. `--env-file` avoids this entirely by loading before any of your code, which is the reason to prefer the flag.\n\n---\n\n## `util.parseEnv`\n\nVerified to exist on Node 24:\n\n```javascript\nimport { parseEnv } from \"node:util\";\nparseEnv(readFileSync(\".env\", \"utf8\"));\n// { PORT: \"3000\", DATABASE_URL: \"postgres://localhost/app\", ... }\n```\n\n> The difference is that it <b>returns an object and does not touch `process.env`</b>, which makes it the right tool for a test that needs to check a file's contents, or for loading a config file without polluting global state.\n\n---\n\n## Node's parser is not dotenv's\n\nVerified behaviours worth knowing:\n\n```text\nQUOTED=\"hello world\"       →  hello world     (quotes stripped)\nEMPTY=                     →  \"\"              (not undefined)\nWITH_HASH=abc#notacomment  →  \"abc\"           ← truncated\n```\n\n> That last one will cost somebody a day. A `#` starts a comment, <b>including in the middle of a value</b>, so a password or a URL fragment containing `#` is silently truncated and you get an authentication failure with a value that looks almost right. Quote it: `PASSWORD=\"abc#def\"`.\n>\n> And `EMPTY=` giving `\"\"` rather than `undefined` matters more than it looks, because the next lesson shows what an empty string does to a schema default.",
      diagram: `Three built-in ways

    node --env-file=.env app.js
    process.loadEnvFile(".env")
    util.parseEnv(text)

    no dotenv needed for a basic file.


⚠⚠ THE RULE NOBODY MENTIONS

    verified:

      PORT=9999 node --env-file=.env app.js
        →  process.env.PORT is "9999"

    AN ALREADY-SET VARIABLE WINS.

    the file does not OVERRIDE the real
    environment. it FILLS IN what is missing.

    verified identically for
    process.loadEnvFile().

    that precedence is exactly right for
    production: a platform's injected variables
    must beat a file that happened to get
    deployed.

    and it causes one specific 20-minute
    confusion locally:

      you change a value in .env
      you restart
      NOTHING HAPPENS

      because you exported that variable in your
      shell an hour ago and forgot.

    fix: unset PORT. and knowing to look.


Missing files, verified

    --env-file=.nope
      node: .nope: not found     (exits)

    --env-file-if-exists=.nope
      ".nope not found. Continuing without it."

    → --env-file when the file is REQUIRED, so a
      missing one is a startup failure

    → --env-file-if-exists for a local override
      that may not be there  (.env.local)


⚠ loadEnvFile runs as CODE

    it runs when the module executes, so
    ANYTHING IMPORTED BEFORE IT DOES NOT SEE THE
    VARIABLES.

    with ES modules, imports are HOISTED and run
    FIRST, so a module reading process.env at its
    top level reads undefined.

    --env-file avoids this entirely: it loads
    before any of your code runs.

    → prefer the flag.


util.parseEnv: returns, does not mutate

    parseEnv(readFileSync(".env","utf8"))
      → { PORT: "3000", DATABASE_URL: "...", ... }

    verified on Node 24.

    right tool for a test that checks a file's
    contents, or loading config without polluting
    global state.


⚠ Node's parser is not dotenv's

    verified:

      QUOTED="hello world"
        →  hello world      quotes stripped

      EMPTY=
        →  ""               NOT undefined

      WITH_HASH=abc#notacomment
        →  "abc"            ← TRUNCATED

    that last one will cost somebody a day.

      # starts a comment INCLUDING MID-VALUE

      so a password or URL fragment containing #
      is silently truncated, and you get an auth
      failure with a value that looks almost
      right.

      quote it:  PASSWORD="abc#def"

    and EMPTY= giving "" rather than undefined
    matters more than it looks.
    → next lesson shows what "" does to a schema
      default.`,
      codeExample: {
        title: "The precedence rule, and the parser's edges",
        code: `// ── .env ────────────────────────────────────────────────────
// PORT=3000
// DATABASE_URL=postgres://localhost/app
// DEBUG=true
// EMPTY=
// QUOTED="hello world"
// WITH_HASH=abc#notacomment


// ── The basic case. Verified. ───────────────────────────────
// $ node --env-file=.env app.js
process.env.PORT;              // "3000"   (a string)
process.env.DATABASE_URL;      // "postgres://localhost/app"


// ── ⚠⚠ Precedence. Verified. ────────────────────────────────
// $ PORT=9999 node --env-file=.env app.js
process.env.PORT;              // "9999"
//
// The file did NOT win. Read that again if you have ever lost
// twenty minutes to "my .env change did nothing".
//
// Why this is the right behaviour:
//
//   In production your platform injects DATABASE_URL. If a
//   stale .env got baked into the image, you want the
//   platform's value, not the file's. File-loses is the safe
//   default.
//
// Why it bites locally:
//
//   $ export DATABASE_URL=postgres://localhost/experiment
//   ... an hour later ...
//   $ vim .env          # change DATABASE_URL
//   $ node --env-file=.env app.js
//   # still connecting to the experiment database
//
//   $ env | grep DATABASE_URL     ← the diagnostic
//   $ unset DATABASE_URL          ← the fix


// ── Required versus optional files. Verified. ───────────────
// $ node --env-file=.nope app.js
//   node: .nope: not found
//   (process exits)
//
// $ node --env-file-if-exists=.nope app.js
//   .nope not found. Continuing without it.
//   (process continues)

// package.json — the useful combination
// {
//   "scripts": {
//     "dev":  "node --env-file=.env --env-file-if-exists=.env.local --watch src/server.js",
//     "test": "node --env-file=.env.test --test"
//   }
// }
//
// .env         required, committed as .env.example, holds
//              shared local defaults
// .env.local   optional, git-ignored, your personal overrides
//
// Later files fill in what earlier ones did not set, and the
// real environment still beats both.


// ── process.loadEnvFile, and its ordering trap ──────────────
// ✗ This does not work the way it reads:
//
//   // server.js
//   import { config } from "./config.js";   // ← runs FIRST
//   process.loadEnvFile();                  // ← too late
//
//   // config.js
//   export const config = { port: process.env.PORT };
//   //                                      ^^^^^^^^ undefined
//
// ES module imports are hoisted and evaluated before any
// statement in the importing module, so config.js read
// process.env before loadEnvFile ran.

// ✓ Where loadEnvFile is genuinely the right tool: a test
//   setup file, where you do not control the command line.
//
//   // test/setup.js
//   process.loadEnvFile(".env.test");
//
//   $ node --import ./test/setup.js --test
//
// ✓ Or make it the first thing in the entry point, before any
//   import of your own code:
//
//   // server.js
//   process.loadEnvFile();
//   const { buildApp } = await import("./app.js");
//   //     ^^^^^^^^^^^^^^^^^^ dynamic, so it runs after
//
// Which works, and is worse than just using --env-file.


// ── util.parseEnv: read without mutating ────────────────────
import { parseEnv } from "node:util";
import { readFileSync } from "node:fs";

const parsed = parseEnv(readFileSync(".env", "utf8"));
// Verified:
// {
//   DATABASE_URL: 'postgres://localhost/app',
//   DEBUG: 'true',
//   EMPTY: '',
//   PORT: '3000',
//   QUOTED: 'hello world',
//   WITH_HASH: 'abc'
// }
//
// process.env is untouched. Two good uses:

// 1. A test that the example file lists every required key.
test(".env.example documents every required variable", () => {
  const example = Object.keys(parseEnv(readFileSync(".env.example", "utf8")));
  const required = Object.keys(envSchema.shape);
  for (const key of required) {
    assert.ok(example.includes(key), \`.env.example is missing \${key}\`);
  }
});
// Worth having. The usual failure is a new required variable
// added to the schema and not to the example, so the next
// person to clone the repository cannot start the app.

// 2. Loading a config file for one purpose without making its
//    values globally visible to every library in the process.


// ── ⚠ The parser's edges. All verified. ─────────────────────
process.env.QUOTED;      // "hello world"
//   Quotes are stripped, so use them when a value has spaces.

process.env.EMPTY;       // ""
//   An empty string, NOT undefined. The key EXISTS.
//   This matters enormously in the next lesson: a schema
//   default only applies when the key is absent.

process.env.WITH_HASH;   // "abc"
//   ⚠ Truncated at the '#'. A comment marker works mid-value.
//
//   So this is a real, awful bug:
//
//     DATABASE_URL=postgres://user:pa#word@host/db
//       →  "postgres://user:pa"
//
//   You get a connection failure whose message shows a URL
//   that looks nearly right, and nothing says "your password
//   was cut in half".
//
//   ✓ Quote anything that might contain '#':
//     DATABASE_URL="postgres://user:pa#word@host/db"


// ── When you still want dotenv ──────────────────────────────
// Node's parser is deliberately simple. dotenv and
// dotenv-expand add:
//
//   variable expansion       BASE_URL=https://\${HOST}:\${PORT}
//   multiline values         private keys, certificates
//   a documented spec for edge cases
//
// If you need those, use the library. If you need PORT and
// DATABASE_URL, --env-file is one flag and no dependency.`,
      },
      keyTakeaways: [
        "Verified: `node --env-file=.env` loads variables with no dependency, and values arrive as strings.",
        "The important rule, verified: an already-set variable wins. `PORT=9999 node --env-file=.env` gives `\"9999\"`.",
        "That precedence is correct for production, where a platform's injected value must beat a stale file, and it causes the local \"my `.env` change did nothing\" confusion.",
        "The diagnostic is `env | grep VAR` and the fix is `unset VAR`.",
        "Verified: `--env-file` exits on a missing file, `--env-file-if-exists` continues. Use the first for required files and the second for `.env.local`.",
        "`process.loadEnvFile()` works and runs as code, so ES module imports are hoisted above it and read `undefined`.",
        "That ordering trap is the reason to prefer the flag, which loads before any of your code.",
        "Verified: `util.parseEnv` returns an object without touching `process.env`, which suits a test or a one-off config read.",
        "Verified parser edges: quotes are stripped, `EMPTY=` gives `\"\"` not `undefined`, and `#` truncates a value even mid-string.",
        "So a password containing `#` is silently cut in half, producing an authentication failure with a nearly-right value.",
        "`EMPTY=` giving an empty string matters because a schema default only applies when the key is absent.",
        "Reach for `dotenv` when you need variable expansion or multiline values, not to load two variables.",
      ],
      commonMistakes: [
        "Assuming `.env` overrides the shell. It does not, and this is the classic twenty-minute local debugging session.",
        "Using `--env-file` for an optional local override, so a missing `.env.local` stops the process.",
        "Calling `process.loadEnvFile()` after importing a module that reads `process.env` at its top level.",
        "An unquoted value containing `#`, which is truncated at the marker with no warning.",
        "Treating `EMPTY=` as unset. The key exists, so schema defaults will not fire.",
        "Adding `dotenv` for a file with three plain variables, when one flag does it.",
        "Adding a required variable to the schema and not to `.env.example`, so the next clone cannot start.",
      ],
      quiz: [
        {
          question: "`PORT=9999 node --env-file=.env app.js`, where `.env` says `PORT=3000`. What is `process.env.PORT`?",
          options: [
            "`\"3000\"`, the file wins",
            "`\"9999\"`, because an already-set variable wins and the file only fills in what is missing",
            "`undefined`",
            "It throws a conflict error",
          ],
          correctIndex: 1,
          explanation:
            "Verified, and identical for `process.loadEnvFile()`. Correct for production, and the cause of \"my `.env` change did nothing\" locally.",
        },
        {
          question: "What is the difference between `--env-file` and `--env-file-if-exists`?",
          options: [
            "Only the parsing rules",
            "A missing file makes `--env-file` exit with `not found`, while `--env-file-if-exists` prints a notice and continues",
            "One overrides the environment",
            "One is synchronous",
          ],
          correctIndex: 1,
          explanation:
            "Verified both. Use the strict one for a required file and the lenient one for `.env.local`.",
        },
        {
          question: "Why can `process.loadEnvFile()` read as correct and still not work?",
          options: [
            "It is asynchronous",
            "It runs as code, and ES module imports are hoisted above it, so a module reading `process.env` at its top level reads `undefined`",
            "It only reads `.env.local`",
            "It requires a flag",
          ],
          correctIndex: 1,
          explanation:
            "Which is the reason to prefer `--env-file`: it loads before any of your code runs.",
        },
        {
          question: "What does `WITH_HASH=abc#notacomment` produce?",
          options: [
            "`\"abc#notacomment\"`",
            "`\"abc\"`, because `#` starts a comment even mid-value",
            "An error",
            "`\"notacomment\"`",
          ],
          correctIndex: 1,
          explanation:
            "Verified. A password containing `#` is silently truncated, so quote anything that might contain one.",
        },
        {
          question: "Why does `EMPTY=` producing `\"\"` rather than `undefined` matter?",
          options: [
            "It does not",
            "The key exists, so a schema `.default()` will not fire, and an empty string coerces differently from a missing value",
            "It breaks the parser",
            "It causes a crash at startup",
          ],
          correctIndex: 1,
          explanation:
            "The next lesson shows the consequence: `PORT=` with `z.coerce.number().default(3000)` gives 0, not 3000.",
        },
      ],
    },
    {
      id: "strings-and-validation",
      title: "Everything is a string, and the default that does not fire",
      durationMinutes: 12,
      explanation:
        "## Environment variables are strings\n\nVerified:\n\n```javascript\nprocess.env.PORT           // \"3000\", typeof \"string\"\nprocess.env.DEBUG          // \"true\"\nprocess.env.DEBUG === true // false\n```\n\nAnd it goes further than reading. Verified: `process.env.X = 3000` stores `\"3000\"`, because `process.env` coerces every assignment to a string.\n\n> So `if (process.env.DEBUG)` is <b>true for the string `\"false\"`</b>, which is the single most common configuration bug there is. It reads as a boolean check and it is a non-empty-string check.\n\n---\n\n## Fail fast\n\n<b>Fail fast</b> (detecting a configuration or programming problem as early as possible).\n\n```text\n✗  starts fine → 3am → first login → JWT_SECRET undefined → 💥\n✓  starts → validate → invalid → refuse to start\n```\n\n> The argument is about <b>who finds out</b>. An application that boots without `JWT_SECRET` passes its health check, gets marked healthy, receives traffic, and fails on the first user who tries to log in. An application that refuses to start fails during the deploy, where a rollback is automatic and nobody is affected.\n>\n> This is Day 16's point about `parse` versus `safeParse`, and configuration is the clearest case for a throw in the whole track.\n\n---\n\n## The schema\n\n```javascript\nconst envSchema = z.object({\n  NODE_ENV: z.enum([\"development\", \"test\", \"production\"]),\n  PORT: z.coerce.number().int().positive().max(65535).default(3000),\n  DATABASE_URL: z.string().url(),\n  JWT_SECRET: z.string().min(32),\n});\n\nexport const env = envSchema.parse(process.env);\n```\n\nVerified: missing `NODE_ENV` and `DATABASE_URL` produced <b>two</b> issues, not one, so a startup failure can list everything that is wrong at once rather than one variable per deploy attempt.\n\n---\n\n## The trap in that schema\n\n> Verified, and it is worth stopping on. `PORT` absent gives `3000` from the default, as expected. But:\n>\n> ```text\n> PORT=            (an empty value in .env)\n>   → the key exists, so .default(3000) NEVER FIRES\n>   → z.coerce.number() turns \"\" into 0, because Number(\"\") is 0\n>   → without .positive(), PORT is 0\n> ```\n>\n> Verified both halves: with `.positive()` it fails with issue code `too_small`, and without it the value is <b>0</b> and the default did not apply. Port 0 means \"pick a random free port\", so your server starts, binds somewhere unpredictable, and your health check cannot find it.\n>\n> So a coerced number always needs bounds, which is Day 16's rule arriving where it does the most damage: a commented-out line in `.env` that left `PORT=` behind.\n\n---\n\n## And do not coerce booleans\n\nVerified:\n\n```javascript\nz.coerce.boolean().parse(\"false\")   // true\nz.coerce.boolean().parse(\"0\")       // true\n```\n\n> `z.coerce.boolean` applies JavaScript truthiness, so every non-empty string is `true`. That makes it exactly wrong for the `DEBUG=true` case, and it is the natural next step after learning `z.coerce.number`, which is what makes it a trap rather than a detail.\n>\n> Use an explicit mapping instead:\n>\n> ```javascript\n> z.enum([\"true\", \"false\"]).default(\"false\").transform((v) => v === \"true\")\n> ```\n>\n> Verified: `\"false\"` gives `false`, `\"true\"` gives `true`, and anything else is a startup error rather than a silent `true`.\n\n---\n\n## Centralize it\n\nOne module, parsed once, exported as a typed object.\n\n> The reason is not tidiness. `process.env.PORT` is `string | undefined` everywhere in your application, so every use site either re-validates or quietly assumes. One `config` object is validated once, typed, and impossible to misread, and it gives you a single file that answers \"what does this application need in order to run?\".",
      diagram: `Everything is a string. Verified.

    process.env.PORT            "3000"  (string)
    process.env.DEBUG           "true"
    process.env.DEBUG === true  FALSE

    and writing too:
      process.env.X = 3000  →  "3000"
      process.env coerces EVERY assignment

    ⚠ so if (process.env.DEBUG) is TRUE FOR THE
      STRING "false".

      the single most common configuration bug
      there is.

      it READS as a boolean check.
      it IS a non-empty-string check.


Fail fast: the argument is WHO FINDS OUT

    ✗  starts fine
         → health check passes
         → marked healthy
         → receives traffic
         → 3am, first login
         → JWT_SECRET undefined
         → 💥

    ✓  starts
         → validate
         → invalid
         → REFUSE TO START
         → the deploy fails, rollback is
           automatic, nobody is affected

    Day 16's parse vs safeParse, and configuration
    is the clearest case for a throw in the whole
    track.


And it reports EVERYTHING at once

    verified: two missing variables → TWO issues

    so a startup failure lists all of them, not
    one variable per deploy attempt.


⚠⚠ The trap in the obvious schema

    PORT: z.coerce.number().default(3000)

    PORT absent
      →  3000   ✓ as expected

    PORT=           (an empty value in .env)
      →  the KEY EXISTS, so .default(3000)
         NEVER FIRES
      →  Number("") is 0
      →  PORT is 0

    verified both halves:
      with .positive()     fails, too_small
      without .positive()  value is 0, default
                           did NOT apply

    and PORT 0 means "PICK A RANDOM FREE PORT".

      your server starts
      binds somewhere unpredictable
      your health check cannot find it

    → a coerced number ALWAYS needs bounds.

    Day 16's rule, arriving where it does the
    most damage: a commented-out line that left
    PORT= behind.


⚠⚠ And do not coerce booleans

    verified:

      z.coerce.boolean().parse("false")  →  true
      z.coerce.boolean().parse("0")      →  true

    JavaScript truthiness. every non-empty string
    is true.

    exactly wrong for DEBUG=true, and it is the
    NATURAL NEXT STEP after z.coerce.number,
    which is what makes it a trap.

    ✓ explicit mapping:

      z.enum(["true","false"])
       .default("false")
       .transform(v => v === "true")

      verified: "false" → false, "true" → true,
      anything else → a STARTUP ERROR rather than
      a silent true


Centralize: one module, parsed once

    not tidiness.

    process.env.PORT is string | undefined
    EVERYWHERE, so every use site either
    re-validates or quietly assumes.

    one config object:
      validated once
      typed
      impossible to misread

    and one file that answers
      "what does this application need in order
       to run?"`,
      codeExample: {
        title: "A schema with the traps closed",
        code: `// ── src/config.js ───────────────────────────────────────────
import { z } from "zod";

// A helper for the boolean case, because z.coerce.boolean is
// wrong here and this is the shape you want every time.
const boolFromEnv = (fallback) =>
  z.enum(["true", "false"]).default(String(fallback)).transform((v) => v === "true");
// Verified: "false" -> false, "true" -> true, and any other
// value is a validation error instead of a silent true.

const envSchema = z.object({
  // An enum, so a typo like "prod" fails at startup rather
  // than quietly not matching your isProduction check.
  NODE_ENV: z.enum(["development", "test", "production"]),

  // ⚠ Note .positive() and .max(). Without them, PORT= in a
  // .env file gives 0, and 0 means "any free port".
  PORT: z.coerce.number().int().positive().max(65535).default(3000),

  HOST: z.string().default("0.0.0.0"),
  //                        ^^^^^^^ Day 15 verified Fastify
  //                        binds 127.0.0.1 by default, which
  //                        makes a container unreachable

  // .url() rather than .min(1): a truncated URL is a
  // confusing runtime failure, and Day 20's parser lesson
  // showed a '#' in a password does exactly that.
  DATABASE_URL: z.string().url(),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(50).default(10),
  //                                    ^^^^^^^^^^^^ Day 17's
  //                                    pool arithmetic, as a
  //                                    bound rather than a hope

  REDIS_URL: z.string().url().optional(),

  // Day 18: a short signing secret is brute-forceable, so the
  // length is a rule.
  JWT_SECRET: z.string().min(32),
  ACCESS_TOKEN_TTL: z.string().default("15m"),

  LOG_LEVEL: z.enum(["trace", "debug", "info", "warn", "error", "fatal"])
    .default("info"),

  // Day 19: an allowlist, not a wildcard, and not reflection.
  ALLOWED_ORIGINS: z.string()
    .default("")
    .transform((s) => s.split(",").map((o) => o.trim()).filter(Boolean)),

  ENABLE_NEW_CHECKOUT: boolFromEnv(false),
  ENABLE_SWAGGER: boolFromEnv(false),
});

// ── parse, not safeParse ────────────────────────────────────
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // A readable failure beats a stack trace, because the person
  // reading this is mid-deploy and needs the variable name.
  console.error("Invalid configuration:\\n");
  for (const issue of parsed.error.issues) {
    console.error(\`  \${issue.path.join(".")}: \${issue.message}\`);
  }
  console.error("\\nSee .env.example for the full list.\\n");
  process.exit(1);
}
// Verified: two missing variables produce two issues, so this
// prints both. Without the loop you would fix one per deploy.
//
// Output:
//   Invalid configuration:
//
//     NODE_ENV: Invalid option: expected one of "development"|"test"|"production"
//     DATABASE_URL: Invalid URL
//
//   See .env.example for the full list.

const env = parsed.data;

// ── One typed object, shaped for the application ────────────
export const config = {
  nodeEnv: env.NODE_ENV,
  isProduction: env.NODE_ENV === "production",
  isTest: env.NODE_ENV === "test",

  server: { port: env.PORT, host: env.HOST },

  database: { url: env.DATABASE_URL, poolMax: env.DB_POOL_MAX },

  redis: { url: env.REDIS_URL },

  auth: { jwtSecret: env.JWT_SECRET, accessTokenTtl: env.ACCESS_TOKEN_TTL },

  logging: { level: env.LOG_LEVEL },

  cors: { allowedOrigins: env.ALLOWED_ORIGINS },

  features: {
    newCheckout: env.ENABLE_NEW_CHECKOUT,
    swagger: env.ENABLE_SWAGGER,
  },
};

// The type comes free, from the schema, which is Day 16's
// single source of truth one more time.
export type Config = typeof config;


// ── ⚠ The traps, demonstrated ───────────────────────────────

// 1. The empty-value trap. All verified.
const s = z.object({ PORT: z.coerce.number().int().positive().default(3000) });

s.safeParse({});                    // { success: true, data: { PORT: 3000 } }
s.safeParse({ PORT: "" });          // success: false, code: "too_small"

const loose = z.object({ PORT: z.coerce.number().default(3000) });
loose.safeParse({ PORT: "" }).data; // { PORT: 0 }    ← the default did NOT fire
//
// How this happens in real life:
//
//   .env
//   # PORT=3000        ← someone commented the value
//   PORT=              ← and left this behind
//
// Your server calls listen({ port: 0 }), the OS assigns a
// random free port, the process reports "listening", and your
// health check gets connection refused on 3000. Nothing
// errored.


// 2. The boolean trap. Verified.
z.coerce.boolean().parse("false");  // true
z.coerce.boolean().parse("0");      // true
z.coerce.boolean().parse("");       // false
//
// So this is a live bug:
//
//   ENABLE_DANGEROUS_THING: z.coerce.boolean().default(false)
//
//   ENABLE_DANGEROUS_THING=false   →   true
//
// You have enabled the thing by explicitly disabling it.


// 3. The raw check, which is the same bug without Zod.
if (process.env.DEBUG) {           // ✗ true for "false"
if (process.env.DEBUG === "true")  // ✓ if you must read it raw
if (config.features.debug)         // ✓ if it went through the schema


// ── Using it ────────────────────────────────────────────────
// src/server.js
import { config } from "./config.js";
import { buildApp } from "./app.js";

const app = buildApp();

try {
  await app.listen({ port: config.server.port, host: config.server.host });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
//
// No process.env anywhere below config.js. Which is testable:

test("no module outside config reads process.env", async () => {
  const files = await glob("src/**/*.js", { ignore: ["src/config.js"] });
  for (const file of files) {
    const source = await readFile(file, "utf8");
    assert.ok(!source.includes("process.env"),
      \`\${file} reads process.env directly\`);
  }
});
// A crude test, and it holds the rule. Once one module reads
// process.env directly, the config object stops being the
// answer to "what does this app need to run?".`,
      },
      keyTakeaways: [
        "Verified: environment variables are strings both ways. `process.env.X = 3000` stores `\"3000\"`.",
        "So `if (process.env.DEBUG)` is true for the string `\"false\"`. It reads as a boolean check and is a non-empty-string check.",
        "Fail fast is about who finds out: refusing to start fails the deploy, while booting without a secret fails on the first real user.",
        "Verified: two missing variables produce two Zod issues, so a startup error can list everything wrong at once.",
        "Verified trap: `PORT=` in a file means the key exists, so `.default(3000)` never fires and `z.coerce.number()` gives 0.",
        "Port 0 means \"any free port\", so the server starts, binds unpredictably, and the health check fails with nothing logged.",
        "A coerced number always needs `.positive()` or bounds. That is Day 16's rule where it does the most damage.",
        "Verified: `z.coerce.boolean().parse(\"false\")` is `true`, and so is `\"0\"`. It is exactly wrong for the `DEBUG=true` case.",
        "Use `z.enum([\"true\",\"false\"]).transform(v => v === \"true\")` so an unexpected value is a startup error rather than a silent `true`.",
        "Print the issue list on failure rather than a stack trace, because the reader is mid-deploy and needs the variable names.",
        "Centralize into one typed `config` object, so no use site has to re-validate `string | undefined`.",
        "A test asserting no module outside `config.js` reads `process.env` keeps the config object meaningful.",
      ],
      commonMistakes: [
        "`if (process.env.DEBUG)`, which is true for `\"false\"`.",
        "Comparing an environment variable to a boolean or a number without converting it.",
        "`z.coerce.number().default(3000)` with no bounds, so `PORT=` becomes 0 and the server binds to a random port.",
        "`z.coerce.boolean()` for a flag, which turns `\"false\"` into `true` and enables the thing you disabled.",
        "Using `safeParse` and continuing, so the application boots half-configured.",
        "Reporting only the first invalid variable, so each deploy attempt reveals one more.",
        "Throwing a raw Zod error at startup, which is a wall of JSON rather than a list of variable names.",
        "Reading `process.env` from modules other than the config file, which makes the config object incomplete as documentation.",
        "`z.string().min(1)` for a URL, so a value truncated at a `#` passes validation and fails at connection time.",
      ],
      quiz: [
        {
          question: "`.env` contains `PORT=` with no value, and the schema is `z.coerce.number().default(3000)`. What is the port?",
          options: [
            "3000, from the default",
            "0, because the key exists so the default never fires and `Number(\"\")` is 0",
            "`undefined`",
            "A validation error",
          ],
          correctIndex: 1,
          explanation:
            "Verified. Port 0 means any free port, so the server starts and binds somewhere your health check cannot find.",
        },
        {
          question: "What does `z.coerce.boolean().parse(\"false\")` return?",
          options: ["`false`", "`true`", "It throws", "`undefined`"],
          correctIndex: 1,
          explanation:
            "Verified, and `\"0\"` is also `true`. Use an enum plus a transform so an unexpected value is an error rather than a silent `true`.",
        },
        {
          question: "Why is `parse` rather than `safeParse` correct for configuration?",
          options: [
            "It is faster",
            "You want the deploy to fail, where rollback is automatic, rather than a healthy-looking app that fails on the first real user",
            "`safeParse` does not work on `process.env`",
            "It produces better types",
          ],
          correctIndex: 1,
          explanation:
            "Fail fast is about who finds out. This is the clearest case for a throw in the whole track.",
        },
        {
          question: "Why print the Zod issue list rather than throwing the error?",
          options: [
            "To hide the stack",
            "Verified that two missing variables produce two issues, so a list fixes them in one pass instead of one per deploy attempt, and the reader needs variable names",
            "Zod errors are not serialisable",
            "To avoid logging secrets",
          ],
          correctIndex: 1,
          explanation:
            "The person reading it is mid-deploy. A wall of JSON is worse than four lines naming the variables.",
        },
        {
          question: "What does centralizing configuration actually buy you?",
          options: [
            "Fewer files",
            "`process.env.X` is `string | undefined` everywhere, so one validated typed object means no use site re-validates or assumes, and one file documents what the app needs to run",
            "Faster startup",
            "Automatic secret redaction",
          ],
          correctIndex: 1,
          explanation:
            "Which is why a test asserting nothing else reads `process.env` is worth having.",
        },
      ],
    },
    {
      id: "env-files-and-flags",
      title: "Example files, NODE_ENV and feature flags",
      durationMinutes: 11,
      explanation:
        "## `.env.example`\n\n```text\n.env          real values, git-ignored\n.env.example  variable names, committed\n```\n\n```env\nNODE_ENV=development\nPORT=3000\nDATABASE_URL=postgres://localhost/app\nJWT_SECRET=\n```\n\n> The value of the example file is not documentation, it is <b>that it can be checked</b>. The recurring failure is that someone adds a required variable to the schema and not to the example, so the next person to clone the repository gets a startup error naming a variable they have never heard of. Day 20's `util.parseEnv` makes that a test: parse the example, compare its keys to the schema's, fail if any are missing.\n>\n> Leave secret values <b>empty</b> in the example rather than putting a plausible fake there. A fake that looks real gets copied into a real deployment.\n\n---\n\n## `NODE_ENV`\n\n<b>`NODE_ENV`</b> (a conventional environment variable naming the current environment).\n\n```text\ndevelopment · test · production\n```\n\n> The thing to be clear about, which the draft is right to flag: <b>Node itself does nothing with it</b>. Verified in the sense that matters, there is no core behaviour keyed on it. It is a plain string that <b>libraries</b> read: React drops development warnings, Express changes error output, and `npm install --omit=dev` is a separate flag entirely.\n>\n> Two practical consequences. Validate it with an enum, because `NODE_ENV=prod` is not `\"production\"` and every `isProduction` check silently becomes false, which is how a production deployment ends up serving Swagger UI. And derive your own booleans once, in the config object, rather than comparing the string in forty places.\n\n---\n\n## Feature flags\n\n<b>Feature flag</b> (a configuration switch that enables or disables functionality without redeploying).\n\n```text\nDeploy with the flag off → test → turn it on\n```\n\n> The real value is that it <b>separates deploying from releasing</b>. Deploying becomes a low-risk operation you can do ten times a day, and releasing becomes a decision you can reverse in seconds without a rollback. That is a different thing from configuration: config tells the app how to run, and a flag decides what it does.\n\n---\n\n## Rollout\n\n<b>Rollout</b> (gradually making a feature available to more users).\n\n```text\n0% → 10% → 25% → 50% → 100%\n```\n\n> A percentage flag needs one property people miss: it must be <b>sticky per user</b>. If you roll a dice per request, a user at 50% sees the new checkout, refreshes, sees the old one, and loses their basket. Hash the user id and compare against the threshold, so the same user always lands the same way.\n>\n> An environment variable cannot do that well, and this is where a flag service earns its place: percentage rollouts, per-user targeting and changing a flag without a restart. An env var flag is fine for on and off.\n\n---\n\n## The cost\n\n```text\nFEATURE_A · B · C · D · E   →   2⁵ = 32 possible states\n```\n\n> And you test one or two of them. That is the honest cost: a flag is a permanent branch, both halves have to keep working, and every combination is a state your application can be in and your tests are not.\n>\n> So give every flag a <b>removal plan when you add it</b>: who deletes it, and after what. A flag that has been at 100% for six months is not a flag, it is dead code with a switch on it, and the old branch has quietly stopped working while nobody looked.",
      diagram: `.env.example: the value is that it is CHECKABLE

    .env          real values, git-ignored
    .env.example  variable names, committed

    the recurring failure:

      someone adds a required variable to the
      SCHEMA and not to the EXAMPLE

      → the next clone gets a startup error
        naming a variable they have never heard of

    util.parseEnv makes that a TEST:
      parse the example
      compare keys to the schema
      fail if any are missing

    ⚠ leave secret values EMPTY.
      a plausible fake gets copied into a real
      deployment.


NODE_ENV: Node itself does NOTHING with it

    development · test · production

    it is a plain string that LIBRARIES read:
      React drops dev warnings
      Express changes error output
      npm install --omit=dev is a SEPARATE flag

    two consequences:

      1. VALIDATE IT WITH AN ENUM

         NODE_ENV=prod is not "production"

         every isProduction check silently
         becomes false

         → which is how a production deployment
           ends up serving Swagger UI

      2. derive your booleans ONCE, in config,
         instead of comparing the string in forty
         places


Feature flags: deploying ≠ releasing

    deploy with the flag off → test → turn it on

    the real value:

      DEPLOYING becomes low-risk, ten times a day
      RELEASING becomes a decision reversible in
        SECONDS, with no rollback

    and note it is a different thing from config:

      config decides HOW the app runs
      a flag decides WHAT IT DOES


⚠ Rollout must be STICKY PER USER

    0% → 10% → 25% → 50% → 100%

    if you roll a dice PER REQUEST:

      a user at 50% sees the new checkout
      refreshes
      sees the old one
      loses their basket

    hash the USER ID and compare to the
    threshold, so the same user always lands the
    same way.

    an environment variable cannot do that well.

    → this is where a flag SERVICE earns its
      place: percentage rollouts, per-user
      targeting, changing a flag without a
      restart

    an env var flag is fine for ON and OFF.


⚠ The honest cost

    FEATURE_A · B · C · D · E
      →  2⁵ = 32 possible states

    and you test one or two.

    a flag is a PERMANENT BRANCH:
      both halves must keep working
      every combination is a state your app can
        be in and your tests are not

    → give every flag a REMOVAL PLAN WHEN YOU ADD
      IT: who deletes it, and after what.

    a flag at 100% for six months is not a flag.
    it is dead code with a switch on it, and the
    old branch quietly stopped working while
    nobody looked.`,
      codeExample: {
        title: "An example file you can test, and flags you can remove",
        code: `# ── .env.example — committed ────────────────────────────────
# Copy to .env and fill in the blanks.
#
#   cp .env.example .env

NODE_ENV=development
PORT=3000
HOST=127.0.0.1
LOG_LEVEL=debug

# Local database. See README for docker compose.
DATABASE_URL=postgres://postgres:postgres@localhost:5432/app_dev
DB_POOL_MAX=10

REDIS_URL=redis://localhost:6379

# ⚠ Secrets are left EMPTY on purpose. Generate with:
#   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
JWT_SECRET=

# Comma separated, no wildcards. Day 19.
ALLOWED_ORIGINS=http://localhost:5173

# Feature flags. "true" or "false", nothing else.
ENABLE_NEW_CHECKOUT=false
ENABLE_SWAGGER=true


# ── .gitignore ──────────────────────────────────────────────
# .env
# .env.local
# !.env.example
#
# That last line matters. A broad ".env*" pattern also ignores
# the example file, so the thing you meant to commit is the
# one thing that never gets committed.


// ── The test that keeps the example honest ──────────────────
import { parseEnv } from "node:util";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";
import { envSchema } from "../src/config.js";

test(".env.example lists every variable the schema requires", () => {
  const example = new Set(Object.keys(parseEnv(readFileSync(".env.example", "utf8"))));

  for (const [key, field] of Object.entries(envSchema.shape)) {
    const optional = field.safeParse(undefined).success;
    if (optional) continue;      // has a default or is .optional()
    assert.ok(example.has(key), \`.env.example is missing \${key}\`);
  }
});

test(".env.example does not contain real-looking secrets", () => {
  const example = parseEnv(readFileSync(".env.example", "utf8"));
  for (const key of ["JWT_SECRET", "STRIPE_SECRET_KEY", "DATABASE_PASSWORD"]) {
    if (key in example) {
      assert.equal(example[key], "", \`\${key} should be empty in .env.example\`);
    }
  }
});
// Two small tests. The first stops the "clone it and it will
// not start" experience. The second stops a plausible fake
// secret being copied into a real deployment, which happens
// more than you would expect.


// ── ⚠ NODE_ENV validated as an enum ─────────────────────────
// ✗ Without validation:
const isProduction = process.env.NODE_ENV === "production";
//
//   NODE_ENV=prod         ->  isProduction is false
//   NODE_ENV=Production   ->  isProduction is false
//   NODE_ENV unset        ->  isProduction is false
//
// And every consequence is silent and in the wrong direction:
//   pretty-printed logs in production
//   Swagger UI exposed
//   a short HSTS max-age
//   secure: false on your session cookie   ← Day 18
//
// One typo in a deploy config, and your session cookie is no
// longer HTTPS-only. Nothing errors.

// ✓ With the enum from the previous lesson:
//   NODE_ENV=prod  ->  the process refuses to start:
//     NODE_ENV: Invalid option: expected one of
//               "development"|"test"|"production"


// ── Flags read from config, never from process.env ──────────
// src/app.js
export function buildApp(opts = {}) {
  const app = Fastify({ logger: loggerFor(config), ...opts });

  app.register(checkoutRoutes);

  if (config.features.swagger && !config.isProduction) {
    app.register(swagger);
    app.register(swaggerUi, { routePrefix: "/docs" });
  }
  //  ^^ Two conditions, deliberately. The flag lets you turn
  //  docs off in staging; the isProduction check means a
  //  mis-set flag cannot expose a live API console. Day 19's
  //  defense in depth applied to a feature flag.

  return app;
}

// src/modules/checkout/routes.js
export default async function checkoutRoutes(app) {
  app.post("/checkout", async (request, reply) => {
    if (config.features.newCheckout) {
      return newCheckout(request, reply);
    }
    return legacyCheckout(request, reply);
  });
}


// ── ⚠ A percentage rollout must be sticky ───────────────────
// ✗ Per request:
function enabledFor() {
  return Math.random() * 100 < config.features.newCheckoutPercent;
}
//
// A user at 50% sees the new checkout, refreshes, sees the old
// one, and their basket is gone. Support gets a ticket that
// nobody can reproduce, because it depends on a coin flip.

// ✓ Sticky per user:
import { createHash } from "node:crypto";

function enabledFor(userId, feature, percent) {
  if (percent <= 0) return false;
  if (percent >= 100) return true;

  // Include the feature name, or every 10% feature enables for
  // exactly the same unlucky tenth of your users.
  const digest = createHash("sha256").update(\`\${feature}:\${userId}\`).digest();
  const bucket = digest.readUInt16BE(0) % 100;

  return bucket < percent;
}
// Same user, same feature, same answer, every time, on every
// instance, with no shared state. Raise the percentage and the
// set only grows, so nobody loses access they already had.
//
// Note the feature name in the hash. Without it, a user at
// bucket 3 is in the first 10% of every feature, so your
// "10% rollout" is always the same experimental cohort.


// ── ⚠ The removal plan, written down when you add it ────────
// src/config.js
//
// ENABLE_NEW_CHECKOUT
//   Added:    2026-09-07
//   Owner:    payments
//   Remove:   after 100% for two weeks with no rollback
//   Deletes:  legacyCheckout() and this flag
//
// Without that comment, this flag is still here in 2028 and
// nobody remembers whether legacyCheckout() still works. It
// does not, because nothing has exercised it for two years,
// which means your "instant rollback" is a branch that throws.
//
// A blunt test that keeps the promise:
test("no feature flag is older than 90 days", () => {
  for (const flag of FLAG_REGISTRY) {
    const age = (Date.now() - flag.added) / 86_400_000;
    assert.ok(age < 90,
      \`\${flag.name} is \${Math.round(age)} days old. Remove it or renew the plan.\`);
  }
});
// Annoying on purpose. A failing test is the only thing that
// reliably causes a flag to be deleted.


// ── What an env var flag cannot do ──────────────────────────
// Changing an env var needs a restart, so:
//
//   ✓ on/off per environment
//   ✓ a kill switch you are willing to redeploy for
//   ✗ percentage rollouts
//   ✗ per-user or per-account targeting
//   ✗ turning something off in thirty seconds during an
//     incident
//
// If you need those, that is when a flag service is worth
// the dependency. Starting with env vars and moving later is
// the right order, because the config object is the seam:
// config.features.newCheckout can start as an env var and
// become a service call without any route changing.`,
      },
      keyTakeaways: [
        "The value of `.env.example` is that it can be checked. Parse it with `util.parseEnv` and compare keys against the schema in a test.",
        "Leave secret values empty in the example. A plausible fake gets copied into a real deployment.",
        "Guard against a broad `.env*` gitignore pattern that also ignores the example file you meant to commit.",
        "Node itself does nothing with `NODE_ENV`. It is a plain string that libraries read, and `--omit=dev` is a separate flag.",
        "Validate `NODE_ENV` as an enum: `NODE_ENV=prod` makes every `isProduction` check silently false, which can leave a session cookie non-secure.",
        "Derive `isProduction` once in the config object rather than comparing the string in forty places.",
        "A feature flag's real value is separating deploying from releasing: deploys become routine and releases become reversible in seconds.",
        "Config decides how the app runs; a flag decides what it does. They are different things in the same file.",
        "A percentage rollout must be sticky per user. A per-request dice roll loses a user's basket on refresh.",
        "Hash the feature name with the user id, or every 10% rollout targets the same unlucky cohort.",
        "Five flags are 32 possible states and you test one or two. A flag is a permanent branch and both halves must keep working.",
        "Write the removal plan when you add the flag, and consider a test that fails on flags older than 90 days.",
        "Env var flags cannot do percentage rollouts, per-user targeting, or a thirty-second change during an incident. The config object is the seam that lets you move later.",
      ],
      commonMistakes: [
        "Adding a required variable to the schema and not to `.env.example`, so a fresh clone cannot start.",
        "Putting a realistic fake secret in the example, which someone deploys.",
        "A `.env*` gitignore pattern that also excludes `.env.example`.",
        "Not validating `NODE_ENV`, so `prod` or `Production` silently disables every production behaviour including secure cookies.",
        "Comparing `process.env.NODE_ENV` throughout the codebase instead of deriving one boolean.",
        "A per-request random rollout, which flips a user between implementations on refresh.",
        "Hashing only the user id, so every percentage rollout hits the same cohort.",
        "Gating something dangerous on a flag alone, when a second condition costs nothing.",
        "Adding a flag with no removal plan, so the old branch rots while advertised as an instant rollback.",
        "Reaching for a flag service before needing percentages, per-user targeting or live changes.",
      ],
      quiz: [
        {
          question: "What makes `.env.example` genuinely useful rather than just documentation?",
          options: [
            "It shows example values",
            "It can be checked: parse it and compare its keys to the schema in a test, so a new required variable cannot break a fresh clone",
            "It is loaded automatically",
            "It replaces `.env` in CI",
          ],
          correctIndex: 1,
          explanation:
            "And leave secret values empty, because a plausible fake gets copied into a real deployment.",
        },
        {
          question: "What does Node itself do with `NODE_ENV=production`?",
          options: [
            "Enables production optimisations",
            "Nothing. It is a plain string that libraries read, and `--omit=dev` is a separate npm flag.",
            "Disables warnings",
            "Changes the module resolver",
          ],
          correctIndex: 1,
          explanation:
            "Which is why validating it as an enum matters: `NODE_ENV=prod` makes every `isProduction` check silently false.",
        },
        {
          question: "What is the concrete risk of not validating `NODE_ENV`?",
          options: [
            "Slower startup",
            "A typo like `prod` makes every production behaviour silently not apply, including `secure: true` on the session cookie",
            "Node refuses to start",
            "Logs are duplicated",
          ],
          correctIndex: 1,
          explanation:
            "One typo in a deploy config, and your session cookie is no longer HTTPS-only, with nothing erroring.",
        },
        {
          question: "What is the point of a feature flag beyond toggling code?",
          options: [
            "Fewer deploys",
            "It separates deploying from releasing, so deploys are routine and a release is reversible in seconds without a rollback",
            "Smaller bundles",
            "Better types",
          ],
          correctIndex: 1,
          explanation:
            "Config decides how the app runs; a flag decides what it does.",
        },
        {
          question: "Why must a percentage rollout be sticky per user?",
          options: [
            "For accurate metrics only",
            "A per-request dice roll flips a user between implementations on refresh, so they lose their basket and the bug is unreproducible",
            "Random numbers are slow",
            "The percentage would drift",
          ],
          correctIndex: 1,
          explanation:
            "Hash the feature name with the user id, so the same user always lands the same way and the set only grows.",
        },
        {
          question: "What is the honest cost of five feature flags?",
          options: [
            "Five extra variables",
            "32 possible states, of which you test one or two, and each flag is a permanent branch whose old half quietly stops working",
            "Slower configuration parsing",
            "Nothing measurable",
          ],
          correctIndex: 1,
          explanation:
            "Which is why the removal plan goes in when the flag does, and why a test that fails on old flags is worth the annoyance.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "`PORT=9999 node --env-file=.env app.js`, where `.env` says `PORT=3000`. What is `process.env.PORT`?",
      options: [
        "`\"3000\"`, the file wins",
        "`\"9999\"`, because an already-set variable wins and the file only fills in what is missing",
        "`undefined`",
        "It errors on the conflict",
      ],
      correctIndex: 1,
      explanation:
        "Verified, and identical for `process.loadEnvFile()`. Right for production, and the cause of the local \"my `.env` change did nothing\" confusion.",
    },
    {
      question: "What is the difference between `--env-file` and `--env-file-if-exists`?",
      options: [
        "Different parsers",
        "A missing file makes `--env-file` exit with `not found`, while `--env-file-if-exists` prints a notice and continues",
        "One overrides the shell",
        "One is for production",
      ],
      correctIndex: 1,
      explanation:
        "Verified both. Strict for a required file, lenient for `.env.local`.",
    },
    {
      question: "What does `WITH_HASH=abc#notacomment` produce?",
      options: [
        "The whole string",
        "`\"abc\"`, because `#` starts a comment even mid-value, so a password containing `#` is silently truncated",
        "An error",
        "`\"notacomment\"`",
      ],
      correctIndex: 1,
      explanation:
        "Verified. You get a connection failure showing a nearly-right URL, and nothing says the value was cut.",
    },
    {
      question: "`.env` has `PORT=` with no value, and the schema is `z.coerce.number().default(3000)`. What is the port?",
      options: [
        "3000",
        "0, because the key exists so the default never fires and `Number(\"\")` is 0",
        "`undefined`",
        "A validation failure",
      ],
      correctIndex: 1,
      explanation:
        "Verified. Port 0 means any free port, so the server starts, binds unpredictably, and the health check fails with nothing logged.",
    },
    {
      question: "What does `z.coerce.boolean().parse(\"false\")` return?",
      options: ["`false`", "`true`", "It throws", "`null`"],
      correctIndex: 1,
      explanation:
        "Verified, and `\"0\"` is `true` too. So `ENABLE_THING=false` enables the thing. Use an enum plus a transform.",
    },
    {
      question: "Why is `if (process.env.DEBUG)` the most common configuration bug?",
      options: [
        "`DEBUG` is reserved",
        "It reads as a boolean check and is a non-empty-string check, so it is true for the string `\"false\"`",
        "`process.env` is asynchronous",
        "It only works in production",
      ],
      correctIndex: 1,
      explanation:
        "Verified that environment variables are strings both when read and when written: `process.env.X = 3000` stores `\"3000\"`.",
    },
    {
      question: "Why use `parse` rather than `safeParse` for configuration?",
      options: [
        "Better performance",
        "You want the deploy to fail, where rollback is automatic, instead of a healthy-looking app that fails on the first real user",
        "`safeParse` cannot read `process.env`",
        "For stronger types",
      ],
      correctIndex: 1,
      explanation:
        "Fail fast is about who finds out. Configuration is the clearest case for a throw in the whole track.",
    },
    {
      question: "Why print the Zod issues rather than throwing the error object?",
      options: [
        "To avoid leaking secrets",
        "Verified that two missing variables produce two issues, so a list fixes them in one pass rather than one per deploy attempt",
        "Zod errors are not serialisable",
        "To keep the exit code zero",
      ],
      correctIndex: 1,
      explanation:
        "The reader is mid-deploy and needs variable names, not a wall of JSON.",
    },
    {
      question: "What does Node itself do with `NODE_ENV=production`?",
      options: [
        "Enables optimisations",
        "Nothing. Libraries read it, and `--omit=dev` is a separate npm flag.",
        "Disables source maps",
        "Switches the module loader",
      ],
      correctIndex: 1,
      explanation:
        "So validate it as an enum: `NODE_ENV=prod` silently makes every `isProduction` check false, including the one setting `secure` on your cookie.",
    },
    {
      question: "Why is `if (isProduction)` scattered through the code a problem?",
      options: [
        "Performance",
        "The production branch is first executed on real traffic, so branch once at composition time and keep the untested branches countable",
        "It cannot be typed",
        "`NODE_ENV` is unreliable",
      ],
      correctIndex: 1,
      explanation:
        "Your tests run the development branch and staging runs the staging branch. Configuration replaces the branch with a value.",
    },
    {
      question: "Why must a percentage rollout be sticky per user?",
      options: [
        "For metrics accuracy",
        "A per-request dice roll flips a user between implementations on refresh, losing their basket and producing an unreproducible bug",
        "Random is expensive",
        "The percentage drifts",
      ],
      correctIndex: 1,
      explanation:
        "Hash the feature name with the user id, so the same user always lands the same way and raising the percentage only grows the set.",
    },
    {
      question: "What is the honest cost of five feature flags?",
      options: [
        "Five variables",
        "32 possible states, of which you test one or two, and each flag is a permanent branch whose unused half quietly stops working",
        "Slower config parsing",
        "None",
      ],
      correctIndex: 1,
      explanation:
        "So the removal plan goes in when the flag does, and the advertised instant rollback stays real.",
    },
  ],
  project: {
    name: "day-20",
    goal: "Build a validated, centralized configuration module, then break it four ways on purpose: shadow a variable from your shell, leave PORT empty, set a flag to false with coerce.boolean, and put a hash in a password.",
    brief:
      "Configuration looks like the least interesting topic in this phase and it contains four traps that each cost a real afternoon. Reproduce all four with the values in front of you, because reading that PORT= becomes 0 is not the same as watching your server bind to a random port and your health check fail with nothing in the logs. Then write the two small tests at the end, since the example-file test is the one that stops the next person cloning your repository and finding it will not start.",
    steps: [
      "Create `day-20/` with `\"type\": \"module\"` and install `fastify` and `zod`.",
      "Write a `.env` with `NODE_ENV`, `PORT`, `HOST`, `DATABASE_URL`, `JWT_SECRET`, `LOG_LEVEL` and two feature flags.",
      "Run `node --env-file=.env -e 'console.log(typeof process.env.PORT, process.env.PORT)'` and note the type.",
      "Now run `PORT=9999 node --env-file=.env -e 'console.log(process.env.PORT)'` and record which value won.",
      "Export `PORT=9999` in your shell, change `PORT` in `.env`, restart, and confirm nothing changes. Then find it with `env | grep PORT`.",
      "Run `node --env-file=.nope -e 1` and record the error, then repeat with `--env-file-if-exists`.",
      "Add `DB_PASSWORD=abc#def` unquoted to `.env`, print it, and record what you get. Then quote it and print again.",
      "Add `EMPTY=` and confirm the value is an empty string rather than `undefined`.",
      "Write `src/config.js` with a Zod schema covering every variable, using `.positive()` and `.max()` on `PORT` and an enum for `NODE_ENV` and `LOG_LEVEL`.",
      "Use `safeParse`, and on failure print each issue as `path: message` and `process.exit(1)`.",
      "Delete `JWT_SECRET` and `DATABASE_URL` from `.env`, start the app, and confirm both are reported in one run.",
      "Set `PORT=` with no value and start the app. Record the port it actually binds to and whether anything warned you.",
      "Add `.positive()` if you left it out, and confirm you now get a startup error instead.",
      "Add a flag with `z.coerce.boolean().default(false)`, set it to `false` in `.env`, and confirm the feature is enabled.",
      "Replace it with `z.enum([\"true\",\"false\"]).transform(v => v === \"true\")` and confirm `false` now means false, and that `yes` is a startup error.",
      "Export a single `config` object with nested groups, and derive `isProduction` once.",
      "Set `NODE_ENV=prod`, confirm the enum rejects it, then remove the enum and observe how many production behaviours silently switch off.",
      "Write `src/app.js` with `buildApp()` that chooses the logger transport and registers Swagger only when not production, so those are the only two environment branches.",
      "Grep for `process.env` across `src/` and confirm only `config.js` matches.",
      "Write `.env.example` with every variable and empty secret values, and add `.env` to `.gitignore` with a `!.env.example` negation.",
      "Write the test that parses `.env.example` with `util.parseEnv` and asserts every required schema key is present.",
      "Add a required variable to the schema only, run the test, and confirm it fails.",
      "Write the test asserting secret keys are empty in `.env.example`.",
      "Implement a sticky percentage rollout that hashes the feature name and user id, then confirm the same user gets the same answer a hundred times.",
      "Implement the naive per-request version, hit it ten times as one user, and count how many times the answer changed.",
      "Add a comment block to each flag recording who owns it and what removes it.",
    ],
    acceptance: [
      "You can state which value won in the `PORT=9999` versus `.env` test, and why that precedence is correct for production.",
      "You reproduced the shell-shadowing confusion and know the `env | grep` diagnostic.",
      "You have the exact error text for `--env-file` with a missing file, and the notice from `--env-file-if-exists`.",
      "You recorded what an unquoted `abc#def` becomes, and can explain why that produces a confusing authentication failure.",
      "Deleting two required variables reports both in one run, each as `path: message`.",
      "`PORT=` with no value bound to an unexpected port before you added bounds, and you noted that nothing warned you.",
      "A flag set to `false` with `z.coerce.boolean()` was enabled, and the enum version is not.",
      "`NODE_ENV=prod` is rejected by the schema, and you can name at least two behaviours that would have silently switched off.",
      "`grep -rn process.env src/` matches only `src/config.js`.",
      "`.gitignore` excludes `.env` and explicitly keeps `.env.example`.",
      "The example-file test fails when you add a required variable to the schema alone.",
      "The sticky rollout gives one user the same answer a hundred times; the naive version does not.",
      "Every flag has an owner and a removal condition written next to it.",
      "`npx tsc --noEmit` passes if you used TypeScript, and `node --test` passes.",
    ],
    stretch: [
      "Add `util.parseEnv` based loading of a `.env.local` on top of `.env` and confirm the precedence order across all three sources.",
      "Move `process.loadEnvFile()` into `server.js` above an import of `config.js` and confirm the config reads `undefined`, then explain why.",
      "Add a `--env-file=.env.test` npm script and a `node --test` run that uses a different database.",
      "Write a config schema that requires `REDIS_URL` only when `NODE_ENV` is production, using `superRefine`.",
      "Add a startup log line that prints the resolved config with secrets redacted, then verify no secret appears.",
      "Make `BCRYPT_COST` configurable with bounds of 10 to 15, then argue in a comment whether it should be configurable at all.",
      "Add a `/config` endpoint behind an admin permission that returns the non-secret config, and decide whether you would ship it.",
      "Generate `.env.example` from the Zod schema in a script, so it cannot drift.",
      "Add a flag whose value comes from the database rather than the environment, and note what you gained and what you now have to cache.",
    ],
  },
};
