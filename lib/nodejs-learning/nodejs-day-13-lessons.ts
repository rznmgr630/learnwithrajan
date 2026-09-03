import type { LessonDay } from "@/lib/learn/lesson-types";

export const NODEJS_DAY_13_LESSONS: LessonDay = {
  day: 13,
  title: "Testing",
  totalMinutes: 96,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "node-test-basics",
      title: "node:test, test, describe and it",
      durationMinutes: 12,
      explanation:
        "Testing is how you prove your code behaves correctly <b>before your users discover that it does not</b>.\n\nModern Node has a built-in runner, so you can write a lot of tests without installing Jest.\n\n```text\nYour code\n   ↓\nTest\n   ↓\nAssertion\n   ↓\nPass / Fail\n```\n\n---\n\n## `node:test`\n\n<b>`node:test`</b> (Node's built-in module for defining and running tests).\n\n> A test suite is not valuable because it has thousands of tests or 100% coverage. It is valuable when it catches real regressions quickly, is trustworthy when it passes, and makes failures easy to understand.\n\nKeep that as the standard for everything below. Every feature in this day is worth using only insofar as it serves those three things.\n\n```javascript\nimport test from \"node:test\";\n```\n\nSo instead of reaching for Jest, Mocha or Jasmine:\n\n```javascript\nimport test from \"node:test\";\n\ntest(\"addition works\", () => {\n  // test\n});\n```\n\n```bash\nnode --test\n```\n\n---\n\n## Why the built-in runner\n\n```text\nNode.js\n ├── application APIs\n ├── HTTP\n ├── streams\n ├── workers\n └── test runner\n```\n\n```text\nLess dependencies\nLess configuration\nFaster setup\nNative Node support\n```\n\nDay 12's argument, applied: a test framework is typically the largest single block of dev dependencies in a backend project. Jest plus its transform chain is hundreds of packages, and it needs configuration that has to keep up with your module system.\n\nThe built-in runner has <b>no configuration at all</b>. It also runs your real ESM, so Day 2's module rules apply unchanged. No transform means nothing to misconfigure.\n\n---\n\n## `test()`\n\n```javascript\nimport test from \"node:test\";\nimport assert from \"node:assert/strict\";\n\ntest(\"2 + 2 equals 4\", () => {\n  assert.equal(2 + 2, 4);\n});\n```\n\n```text\ntest()\n  ↓\nRun this piece of code\n  ↓\nDid the assertions pass?\n```\n\nA test <b>fails when it throws</b>. That is the entire mechanism, and assertions are just functions that throw a useful message. Nothing more magical is happening.\n\n---\n\n## `describe()`\n\n<b>`describe()`</b> (groups related tests together).\n\n> Grouping is for the failure output, not for you. A named group tells whoever reads a red build which area broke, before they open a single file.\n\n```javascript\nimport {\n  describe,\n  it\n} from \"node:test\";\n\ndescribe(\"User service\", () => {\n\n  it(\"creates a user\", () => {\n    // test\n  });\n\n  it(\"finds a user\", () => {\n    // test\n  });\n\n});\n```\n\n```text\nUser service\n├── creates a user\n└── finds a user\n```\n\n---\n\n## `it()`\n\n`it()` is another way to define a test, and many people find it reads better inside a `describe`.\n\n```javascript\nit(\"adds two numbers\", () => {\n  assert.equal(2 + 3, 5);\n});\n```\n\n```text\ndescribe(\"Calculator\")\n    ↓\nit(\"adds numbers\")\nit(\"subtracts numbers\")\nit(\"divides numbers\")\n```\n\nThe naming convention worth adopting: the description should read as a <b>sentence about behaviour</b>. \"it rejects a user with no email\" tells you what broke from the failure line alone. \"it works\" does not, and you will be opening the file.\n\n---\n\n## Subtests\n\n```javascript\ntest(\"calculator\", async t => {\n\n  await t.test(\"addition\", () => {\n    assert.equal(2 + 2, 4);\n  });\n\n  await t.test(\"multiplication\", () => {\n    assert.equal(2 * 3, 6);\n  });\n\n});\n```\n\nUseful for related scenarios sharing setup.\n\nThe `await` is not optional. Without it the parent test finishes before its children run, and they are reported as cancelled rather than as passes. That is the one syntactic trap in this API.",
      diagram: `The standard for the whole day

    a test suite is valuable when it
      catches real regressions quickly
      is trustworthy when it passes
      makes failures easy to understand

    every feature below is worth using only
    insofar as it serves those three.


A test fails when it throws. That is all.

    test("name", () => {
      assert.equal(2 + 2, 5)
          └─ throws with a useful message
    })

    assertions are just functions that throw.
    nothing more magical is happening.


Why the built-in runner, in Day 12's terms

    a test framework is usually the LARGEST single
    block of dev dependencies in a backend project

    Jest + its transform chain    hundreds of packages
                                  + config that must keep
                                    up with your modules

    node:test                     zero configuration
                                  runs your real ESM
                                  no transform to
                                  misconfigure


Name tests as sentences about behaviour

    it("rejects a user with no email")
      └─ the failure line alone tells you what broke

    it("works")
      └─ you will be opening the file


The one syntactic trap

    test("calculator", async (t) => {
      await t.test("addition", ...)
      └┬─┘
       │ NOT optional
       │
       └─ without it the parent finishes before its
          children run, and they report as CANCELLED
          rather than as passes`,
      codeExample: {
        title: "The four ways to declare a test",
        code: `import test, { describe, it } from "node:test";
import assert from "node:assert/strict";

// ── test(): the plain form ──────────────────────────────────
test("2 + 2 equals 4", () => {
  assert.equal(2 + 2, 4);
});
//
// It fails by throwing. assert.equal is just a function that
// throws a well-formatted error. No magic.


// ── describe() + it(): grouped, and named as sentences ──────
describe("validateUser", () => {
  it("accepts a user with a name and an email", () => {
    assert.equal(validateUser({ name: "Rajan", email: "r@x.com" }), true);
  });

  it("rejects a user with no email", () => {
    assert.equal(validateUser({ name: "Rajan" }), false);
  });

  it("rejects a user with no name", () => {
    assert.equal(validateUser({ email: "r@x.com" }), false);
  });
});
//
// The failure output reads:
//   ✖ validateUser > rejects a user with no email
// which tells you what broke without opening the file.


// ── Subtests: note the await ────────────────────────────────
test("calculator", async (t) => {
  await t.test("addition", () => assert.equal(2 + 2, 4));
  await t.test("multiplication", () => assert.equal(2 * 3, 6));
});
//
// ✗ without await:
// test("calculator", (t) => {
//   t.test("addition", () => { ... });     ← reported as
// });                                        CANCELLED, not
//                                            as a pass


// ── Running it ──────────────────────────────────────────────
// $ node --test
//
// ▶ validateUser
//   ✔ accepts a user with a name and an email (0.9ms)
//   ✔ rejects a user with no email (0.2ms)
//   ✔ rejects a user with no name (0.1ms)
// ✔ validateUser (1.4ms)
// ▶ calculator
//   ✔ addition (0.4ms)
//   ✔ multiplication (0.1ms)
// ✔ calculator (0.6ms)
//
// ℹ tests 7
// ℹ pass 7
// ℹ fail 0

function validateUser(user) {
  return Boolean(user.name && user.email);
}`,
      },
      keyTakeaways: [
        "The standard for the whole day: a suite is valuable when it <b>catches regressions, is trustworthy, and explains failures</b>.",
        "A test <b>fails when it throws</b>. Assertions are just functions that throw a useful message.",
        "`node:test` needs <b>no configuration</b> and runs your real ESM, so Day 2's module rules apply unchanged.",
        "A test framework is usually the largest block of dev dependencies in a backend project. Day 12's argument, applied.",
        "`describe()` groups tests, and the grouping is for the <b>failure output</b>, not for you.",
        "`it()` reads better inside a `describe`. Name it as a <b>sentence about behaviour</b>.",
        "\"it rejects a user with no email\" tells you what broke from the failure line alone. \"it works\" does not.",
        "Subtests via `t.test()` handle related scenarios.",
        "<b>The `await` on a subtest is not optional.</b> Without it the children report as cancelled, not passed.",
      ],
      commonMistakes: [
        "<b>Forgetting `await` on a subtest</b> — the parent finishes first and the children are cancelled rather than run.",
        "<b>Naming tests \"works\" or \"test 1\"</b> — the failure output then tells you nothing.",
        "<b>Installing Jest for a Node-only backend by reflex</b> — the built-in runner needs no config and no transform.",
        "<b>Expecting a test to fail on a returned false</b> — it fails by throwing, which is what assertions do.",
        "<b>Importing `assert` rather than `assert/strict`</b> — the loose version compares with `==`, covered next.",
      ],
      quiz: [
        {
          question: "What actually makes a test fail?",
          options: [
            "Returning `false`",
            "Throwing. Assertions are just functions that throw a useful message",
            "A failed `expect` call registering with the runner",
            "Returning a rejected promise only",
          ],
          correctIndex: 1,
          explanation:
            "That is the whole mechanism. It means any function that throws works as an assertion, and there is nothing framework-specific happening underneath.",
        },
        {
          question: "You write `test(\"x\", (t) => { t.test(\"y\", fn); })` with no `await`. What happens to the subtest?",
          options: [
            "It runs and passes",
            "It is reported as cancelled, because the parent finished before it ran",
            "It runs after the suite completes",
            "A TypeError",
          ],
          correctIndex: 1,
          explanation:
            "The parent test resolving ends its scope. Awaiting each subtest is the one syntactic requirement in this API that is easy to miss.",
        },
        {
          question: "What is `describe()` actually for?",
          options: [
            "Sharing state between tests",
            "The failure output: a named group tells whoever reads a red build which area broke",
            "Running tests in parallel",
            "Applying mocks to a scope",
          ],
          correctIndex: 1,
          explanation:
            "Combined with behaviour-shaped `it` names, a failure line becomes readable on its own, which is one of the three things that make a suite valuable.",
        },
      ],
    },
    {
      id: "assertions",
      title: "Assertions",
      durationMinutes: 10,
      explanation:
        "```javascript\nimport assert from \"node:assert/strict\";\n```\n\n<b>Assertion</b> (a statement that checks whether something is true or matches an expected value).\n\n> Import the `/strict` version, always. The loose `node:assert` compares with `==`, so `assert.equal(1, \"1\")` passes and a test that should have caught a type bug reports green.\n\nThat is the single most important line in this lesson, and it is one character of import path.\n\n```javascript\nassert.equal(actual, expected);\n```\n\n```text\nTest\n ↓\nAssertion fails\n ↓\n❌ Test fails\n```\n\n---\n\n## The common ones\n\n### `assert.equal()`\n\n```javascript\nassert.equal(10, 10);\n```\n\nUnder `/strict` this is strict equality, so it is the one you reach for.\n\n### `assert.notEqual()`\n\n```javascript\nassert.notEqual(10, 20);\n```\n\n### `assert.strictEqual()`\n\n```javascript\nassert.strictEqual(value, expected);\n```\n\nExplicitly strict. Under `node:assert/strict` it is the same as `equal`, so you rarely need to write it.\n\n---\n\n## `assert.deepEqual()`\n\n```javascript\nassert.deepEqual(\n  { name: \"Rajan\" },\n  { name: \"Rajan\" }\n);\n```\n\nCompares structure and content rather than object identity.\n\n> This is the assertion you want for almost every object and array. `assert.equal` on two separate objects with identical contents <b>fails</b>, because they are different references.\n\nAnd the argument order matters for the message: `deepEqual(actual, expected)`. Swap them and the diff reads backwards, which is a small thing that costs real time when you are debugging.\n\n---\n\n## `assert.ok()`\n\n```javascript\nassert.ok(user);\n```\n\nChecks for truthiness. Conceptually:\n\n```javascript\nif (!user) {\n  throw new Error(\"Assertion failed\");\n}\n```\n\n> Use it sparingly. `assert.ok(x)` failing tells you only that something was falsy, while `assert.equal(x, 3)` tells you it was 2. The narrower assertion produces the better failure message.\n\nThat is a direct consequence of the day's standard: a suite that explains its failures is more valuable than one that merely detects them.\n\n---\n\n## Testing errors\n\n```javascript\nassert.throws(() => {\n  throw new Error(\"Something failed\");\n});\n```\n\nAnd checking which error:\n\n```javascript\nassert.throws(\n  () => riskyFunction(),\n  {\n    message: \"Invalid input\"\n  }\n);\n```\n\n> Error handling is part of your application's behaviour, so it is part of what you test. Day 4's typed errors exist precisely so a test can assert on the <b>type</b> rather than the message text.\n\nTwo details. `assert.throws` takes a <b>function</b>, not a called expression: `assert.throws(riskyFunction())` calls it immediately and the throw escapes your assertion. And async rejections need `assert.rejects`, which is awaited.\n\n---\n\n## Async tests\n\n```javascript\ntest(\"fetches user\", async () => {\n  const user = await getUser();\n\n  assert.equal(user.name, \"Rajan\");\n});\n```\n\nIf the promise rejects, the test fails. No `done()` callback needed.\n\n> Which means a missing `await` is a test that <b>passes without testing anything</b>. Day 3's floating-promise problem, in the one place where it is silent by design.\n\nThat is worth sitting with. `test(\"x\", async () => { doThing(); })` returns immediately, the assertion inside `doThing` never runs, and the runner reports a pass. It is the most common way a green suite is lying to you.",
      diagram: `The one-character fix that matters most

    import assert from "node:assert"          ✗ loose
    import assert from "node:assert/strict"   ✓

    loose compares with ==

      assert.equal(1, "1")     PASSES
      assert.equal(0, false)   PASSES
        └─ a test that should have caught a type
           bug reports green


equal vs deepEqual

    assert.equal({a:1}, {a:1})       ✗ FAILS
                                        different references

    assert.deepEqual({a:1}, {a:1})   ✓ structure and content

    deepEqual is what you want for almost every
    object and array.

    and the order matters for the message:
      deepEqual(actual, expected)
        └─ swap them and the diff reads backwards


Narrow assertions produce better failures

    assert.ok(count)        "expected truthy"
                              └─ tells you it was falsy

    assert.equal(count, 3)  "expected 3, got 2"
                              └─ tells you WHAT it was

    a suite that EXPLAINS failures is worth more than
    one that merely detects them. use ok() sparingly.


assert.throws takes a FUNCTION

    assert.throws(riskyFunction)      ✓
    assert.throws(() => risky(1))     ✓
    assert.throws(riskyFunction())    ✗ calls it NOW,
                                         the throw escapes
                                         your assertion

    async rejections:
      await assert.rejects(() => thing())


The way a green suite lies to you

    test("x", async () => {
      doThing()          ← no await
    })

    returns immediately
        ↓
    the assertion inside doThing never runs
        ↓
    the runner reports a PASS

    Day 3's floating promise, in the one place
    where it is silent by design.`,
      codeExample: {
        title: "The assertions worth knowing, and the two traps",
        code: `import test from "node:test";
import assert from "node:assert/strict";      // ← /strict, always

// ── Why /strict matters ─────────────────────────────────────
// with node:assert (loose):
//   assert.equal(1, "1")      PASSES
//   assert.equal(0, false)    PASSES
//
// with node:assert/strict:
test("strict catches a type mismatch", () => {
  assert.throws(() => assert.equal(1, "1"));
  assert.throws(() => assert.equal(0, false));
});


// ── equal vs deepEqual ─────────────────────────────────────
test("deepEqual for objects", () => {
  const actual = { name: "Rajan", tags: ["a", "b"] };

  // assert.equal(actual, { name: "Rajan", tags: ["a","b"] });
  //   ✗ fails: different references

  assert.deepEqual(actual, { name: "Rajan", tags: ["a", "b"] });
  //   ✓ structure and content
  //
  //   and the order is (actual, expected), so the diff in a
  //   failure reads the right way round
});


// ── Narrow assertions give better messages ──────────────────
test("prefer the narrower assertion", () => {
  const count = 3;

  assert.ok(count);              // "expected truthy" if it fails
  assert.equal(count, 3);        // "expected 3, got 2" if it fails
  //
  // The second one tells you what the value actually was,
  // which is the difference between detecting a failure and
  // explaining it.
});


// ── Testing errors, on type not message ─────────────────────
class ValidationError extends Error {
  constructor(message) { super(message); this.name = "ValidationError"; }
}

function validate(input) {
  if (!input) throw new ValidationError("input is required");
  return input;
}

test("throws the right error type", () => {
  // ✓ a function
  assert.throws(() => validate(null), ValidationError);

  // ✓ or match fields
  assert.throws(() => validate(null), { name: "ValidationError" });

  // ✗ this CALLS it, and the throw escapes the assertion
  // assert.throws(validate(null), ValidationError);
});
//
// Day 4's typed errors exist so a test can assert on the
// type rather than the message text, which gets reworded.


// ── Async: rejects, and the missing await ───────────────────
async function loadUser(id) {
  if (id !== 1) throw new ValidationError("no such user");
  return { id, name: "Rajan" };
}

test("resolves", async () => {
  assert.deepEqual(await loadUser(1), { id: 1, name: "Rajan" });
});

test("rejects", async () => {
  await assert.rejects(() => loadUser(99), ValidationError);
  //  ↑ awaited, or the assertion floats and the test passes
});


// ── The test that lies ──────────────────────────────────────
test("this passes without testing anything", async () => {
  // loadUser(99);
  //   no await. the rejection floats, the test returns
  //   immediately, and the runner reports a pass.
  //
  // Day 3's floating promise, in the one place where it is
  // silent by design. Grep your suite for an async test with
  // no await in it.
  assert.ok(true);
});`,
      },
      keyTakeaways: [
        "Import <b>`node:assert/strict`</b>, always. The loose version compares with `==`, so `equal(1, \"1\")` passes.",
        "That is a test which should have caught a type bug reporting green, for one character of import path.",
        "`assert.deepEqual` compares structure and content. It is what you want for almost every object and array.",
        "`assert.equal` on two identical-looking objects <b>fails</b>, because they are different references.",
        "Argument order is `(actual, expected)`. Swapping it makes the failure diff read backwards.",
        "<b>Prefer the narrower assertion.</b> `ok(x)` says \"falsy\", `equal(x, 3)` says \"got 2\".",
        "That follows from the day's standard: explaining a failure is worth more than detecting it.",
        "`assert.throws` takes a <b>function</b>. Passing a called expression lets the throw escape the assertion.",
        "Async rejections need `await assert.rejects(...)`.",
        "Error handling is behaviour, so test it. Day 4's typed errors let you assert on <b>type</b>, not message text.",
        "<b>A missing `await` in an async test is a test that passes without testing anything.</b>",
        "Day 3's floating promise, in the one place where it is silent by design.",
      ],
      commonMistakes: [
        "<b>Importing `node:assert` instead of `node:assert/strict`</b> — `equal(1, \"1\")` passes and hides a type bug.",
        "<b>`assert.equal` on objects</b> — it compares references, so it fails on identical contents.",
        "<b>Swapping actual and expected</b> — the diff in the failure output reads the wrong way round.",
        "<b>`assert.ok` where a specific value is known</b> — you lose the useful half of the failure message.",
        "<b>`assert.throws(fn())` instead of `assert.throws(fn)`</b> — the function runs immediately and throws past your assertion.",
        "<b>Forgetting `await` on `assert.rejects`</b> — the assertion floats and the test passes regardless.",
        "<b>An async test with no `await` in it</b> — it returns before anything is checked and reports a pass.",
        "<b>Asserting on an error's message text</b> — it gets reworded. Assert on the type, as in Day 4.",
      ],
      quiz: [
        {
          question: "Why import `node:assert/strict` rather than `node:assert`?",
          options: [
            "It is faster",
            "The loose version compares with `==`, so `assert.equal(1, \"1\")` passes and a type bug reports green",
            "It has more assertions",
            "It is required for async tests",
          ],
          correctIndex: 1,
          explanation:
            "One character of import path decides whether your assertions actually check types. It is the highest-value line in the lesson.",
        },
        {
          question: "`assert.equal({ a: 1 }, { a: 1 })`. What happens?",
          options: [
            "It passes",
            "It fails, because the two objects are different references",
            "It throws a TypeError",
            "It compares only the first key",
          ],
          correctIndex: 1,
          explanation:
            "Strict equality on objects compares identity. `assert.deepEqual` compares structure and content, which is what you want for nearly every object and array.",
        },
        {
          question: "`test(\"x\", async () => { doThing(); })` where `doThing` asserts internally and rejects. What does the runner report?",
          options: [
            "A failure",
            "A pass, because the test returned before the promise settled",
            "A timeout",
            "An unhandled rejection that fails the suite",
          ],
          correctIndex: 1,
          explanation:
            "Day 3's floating promise, and the most common way a green suite lies. The fix is an `await`, and the habit is grepping for async tests with none in them.",
        },
      ],
    },
    {
      id: "running-tests",
      title: "Running and filtering tests",
      durationMinutes: 10,
      explanation:
        "```text\ntest/\n├── user.test.js\n├── auth.test.js\n└── api.test.js\n```\n\n```bash\nnode --test\n```\n\nNode discovers test files by convention: anything named `*.test.js`, `*-test.js`, `test.js`, or any file inside a `test/` directory.\n\n> Because discovery is convention-based, a file you <b>meant</b> to be a test but named `userTests.js` is silently not run. A suite that quietly skips a file is worse than one that fails, so check the reported test count matches what you expect.\n\n---\n\n## `--test-only`\n\n```javascript\ntest(\"important test\", {\n  only: true\n}, () => {\n  // ...\n});\n```\n\n```bash\nnode --test --test-only\n```\n\n<b>`--test-only`</b> (runs only the tests marked with the `only` option).\n\n> The flag is required. Marking a test `only: true` and forgetting the flag runs the <b>whole suite</b>, and marking it and committing the flag in CI runs almost nothing. Both failures are quiet.\n\nIn practice `--test-name-pattern` is easier and leaves no trace in your code:\n\n```bash\nnode --test --test-name-pattern=\"rejects a user\"\n```\n\nIt matches against the full nested name, so a `describe` block name filters its whole group. There is a matching `--test-skip-pattern` for the inverse.\n\n---\n\n## Watch mode\n\n```bash\nnode --test --watch\n```\n\n```text\nEdit code\n   ↓\nFile changes\n   ↓\nTests automatically rerun\n```\n\nDay 1's `--watch`, applied to the runner.\n\n> Combine it with a name pattern while you work on one thing. `node --test --watch --test-name-pattern=\"payment\"` gives you a sub-second loop instead of a full-suite one, which is the difference between running tests constantly and avoiding them.\n\n---\n\n## `--test-rerun-failures`\n\n```text\n500 tests\n   ↓\n497 pass\n3 fail\n```\n\n```bash\nnode --test --test-rerun-failures=<path>\n```\n\n> This flag <b>requires a path argument</b>: a file where Node stores the rerun state. Writing `node --test --test-rerun-failures` on its own fails with `--test-rerun-failures requires an argument`, which the shorter form in most write-ups does not mention.\n\nUseful when debugging intermittent or environment-sensitive failures, because you iterate on the three that failed rather than all 500.\n\n---\n\n## Filtering by category\n\nYou will want to run subsets:\n\n```text\nunit\nintegration\nslow\ndatabase\n```\n\n> Node has <b>no test-tagging feature</b>. What it has is `--test-name-pattern` and `--test-skip-pattern`, so the practical approach is to encode the category in the test name or the directory and filter on that.\n\nWhich in practice means one of two conventions:\n\n```bash\n# by directory\nnode --test test/unit\nnode --test test/integration\n\n# or by name\nnode --test --test-name-pattern=\"\\\\[unit\\\\]\"\n```\n\nThe directory version is usually better, because it also lets your `package.json` express the split as two scripts, and CI can run the fast one on every push and the slow one less often.\n\n```text\nLarge test suite\n      ↓\nfilter\n      ↓\nrun only relevant tests\n```",
      diagram: `Discovery is convention-based, and silent

    Node runs:
      *.test.js
      *-test.js
      test.js
      anything inside test/

    a file you MEANT as a test, named userTests.js
        ↓
    silently not run
        ↓
    a suite that quietly skips a file is worse
    than one that fails

    check the reported test count matches what
    you expect.


--test-only needs the flag, and both ways fail quietly

    only: true, no flag     the WHOLE suite runs
    flag committed in CI    almost NOTHING runs

    easier, and leaves no trace in your code:

      node --test --test-name-pattern="rejects a user"

    matches the full nested name, so a describe name
    filters its whole group.
    --test-skip-pattern does the inverse.


--test-rerun-failures takes a PATH

    node --test --test-rerun-failures
      → --test-rerun-failures requires an argument

    node --test --test-rerun-failures=.test-state
      ✓

    most write-ups show the shorter form, which
    does not run.


Node has NO test tagging

    what it has: --test-name-pattern
                 --test-skip-pattern

    so encode the category in the DIRECTORY:

      node --test test/unit
      node --test test/integration

    better than name patterns, because package.json
    can express the split as two scripts, and CI can
    run the fast one on every push and the slow one
    less often.


The loop worth having

    node --test --watch --test-name-pattern="payment"
        └─ sub-second, instead of full-suite

    which is the difference between running tests
    constantly and avoiding them.`,
      codeExample: {
        title: "The commands, and the two that need arguments",
        code: `// ── Discovery: convention, not configuration ────────────────
// test/
// ├── unit/
// │   ├── user.test.js          ✓ discovered
// │   └── validate.test.js      ✓
// ├── integration/
// │   └── database.test.js      ✓
// └── helpers.js                ✗ not a test, correctly ignored
//
// src/
// └── userTests.js              ✗ SILENTLY not run
//                                  wrong name, no warning
//
// $ node --test
//   ℹ tests 24            ← check this number is what you expect


// ── Filtering by name ───────────────────────────────────────
// $ node --test --test-name-pattern="rejects"
//   ℹ tests 3
//   ℹ pass 3
//
// Matches the full nested name, so a describe name filters
// its whole group:
// $ node --test --test-name-pattern="validateUser"
//
// And the inverse:
// $ node --test --test-skip-pattern="slow"


// ── only: true needs the flag ───────────────────────────────
// test("just this one", { only: true }, () => { ... });
//
// $ node --test                    ← runs EVERYTHING.
//                                     the only is ignored.
// $ node --test --test-only        ← runs just that one
//
// Both failure modes are quiet: forget the flag and you run
// the whole suite, commit the flag and CI runs almost
// nothing.


// ── rerun-failures needs a path ─────────────────────────────
// $ node --test --test-rerun-failures
//   node: --test-rerun-failures requires an argument
//
// $ node --test --test-rerun-failures=.test-rerun-state
//   ✓ stores state there, and reruns only what failed


// ── The scripts worth having ────────────────────────────────
// {
//   "scripts": {
//     "test":            "node --test test/unit",
//     "test:integration": "node --test test/integration",
//     "test:all":        "node --test",
//     "test:watch":      "node --test --watch test/unit"
//   }
// }
//
// So CI runs "test" on every push and "test:integration"
// less often. The directory split is what makes that
// expressible, which is why it beats name-based tagging.


// ── The development loop ────────────────────────────────────
// $ node --test --watch --test-name-pattern="payment"
//
// Sub-second instead of full-suite, which is the difference
// between running tests constantly and avoiding them.
//
// Day 1's --watch, applied to the runner.


// ── Other flags worth knowing ───────────────────────────────
// --test-timeout=5000        fail a hanging test
// --test-concurrency=1       serialise, for shared resources
// --test-reporter=dot        compact output for CI
// --test-force-exit          exit even with an open handle
//                            (a symptom, not a fix)`,
      },
      keyTakeaways: [
        "Discovery is by <b>convention</b>: `*.test.js`, `*-test.js`, `test.js`, or anything in a `test/` directory.",
        "So a file named wrongly is <b>silently not run</b>. Check the reported test count matches what you expect.",
        "A suite that quietly skips a file is worse than one that fails.",
        "`--test-only` is required for `only: true` to do anything.",
        "Both mistakes are quiet: forget the flag and everything runs, commit the flag and almost nothing does.",
        "<b>`--test-name-pattern` is easier</b> and leaves no trace in your code.",
        "It matches the full nested name, so a `describe` name filters its whole group.",
        "<b>`--test-rerun-failures` requires a path argument.</b> Without one it fails outright.",
        "Most write-ups show the shorter form, which does not run.",
        "<b>Node has no test-tagging feature.</b> Encode the category in the directory and filter on that.",
        "The directory split also lets `package.json` express it as two scripts, so CI can run fast and slow separately.",
        "`node --test --watch --test-name-pattern=\"...\"` is the loop worth having: sub-second instead of full-suite.",
      ],
      commonMistakes: [
        "<b>Naming a test file outside the conventions</b> — it is never run, and nothing tells you.",
        "<b>Not checking the reported test count</b> — a silently skipped file looks like a passing suite.",
        "<b>Using `only: true` without `--test-only`</b> — the whole suite runs and the marker does nothing.",
        "<b>Committing `--test-only` in a CI script</b> — CI runs almost no tests and stays green.",
        "<b>`--test-rerun-failures` with no path</b> — the command fails immediately.",
        "<b>Expecting a tagging feature</b> — there is none. Use directories or name patterns.",
        "<b>Running the whole suite in watch mode</b> — slow enough that you stop running it.",
      ],
      quiz: [
        {
          question: "You name a test file `userTests.js` in `src/`. What happens when you run `node --test`?",
          options: [
            "It runs",
            "It is silently not run, because discovery is convention-based",
            "Node warns about the name",
            "It errors",
          ],
          correctIndex: 1,
          explanation:
            "Discovery matches `*.test.js`, `*-test.js`, `test.js` and anything in `test/`. A quietly skipped file looks exactly like a passing suite, which is why the reported count is worth reading.",
        },
        {
          question: "What does `node --test --test-rerun-failures` do?",
          options: [
            "Reruns only the failed tests",
            "Fails immediately, because the flag requires a path argument for the rerun state",
            "Reruns the whole suite",
            "Nothing, the flag is ignored",
          ],
          correctIndex: 1,
          explanation:
            "It needs a file to store state in. Most write-ups show the shorter form, which does not run at all.",
        },
        {
          question: "How do you run only your integration tests, given Node has no tagging feature?",
          options: [
            "`node --test --tag=integration`",
            "Put them in a directory and run `node --test test/integration`",
            "Mark them `only: true`",
            "Use a config file",
          ],
          correctIndex: 1,
          explanation:
            "The directory split also lets `package.json` express fast and slow as separate scripts, so CI can run one on every push and the other less often.",
        },
      ],
    },
    {
      id: "skip-todo-lifecycle",
      title: "Skip, todo and lifecycle hooks",
      durationMinutes: 12,
      explanation:
        "## Skipping tests\n\n```javascript\ntest(\"future feature\", {\n  skip: true\n}, () => {\n  // not run\n});\n```\n\nor:\n\n```javascript\ntest.skip(\"future feature\", () => {\n  // ...\n});\n```\n\n> Do not use `skip` to hide broken tests. A skipped test looks like a passing suite in every summary anyone will read, so a permanent skip is a silently deleted test that still costs you a file to maintain.\n\n```text\n❌ Test fails\n   ↓\nskip it forever\n```\n\nversus:\n\n```text\n⚠️ Temporarily skip\n   ↓\nCreate issue\n   ↓\nFix it\n   ↓\nRemove skip\n```\n\n---\n\n## TODO tests\n\n<b>TODO test</b> (a test intentionally marked as work still to be done).\n\n> The value is that it appears in the summary as a `todo` count rather than vanishing. A gap you can see is a gap someone might close; a gap in a comment is not.\n\n```javascript\ntest.todo(\"add pagination tests\");\n```\n\nNo function needed. Your suite now communicates:\n\n> We know this coverage is missing.\n\n---\n\n## Expected failures\n\n<b>Expected failure</b> (a test currently expected to fail because the behaviour is intentionally not working yet).\n\n> Useful for documenting a known gap without treating it as a regression. Do not use it to make a broken suite look green, which is the same abuse as a permanent `skip` with an extra step.\n\n```text\nUnexpected failure\n    ↓\n❌ Problem\n\nExpected failure\n    ↓\nKnown/intentional\n```\n\n---\n\n## Lifecycle hooks\n\n```text\nbefore\nafter\nbeforeEach\nafterEach\n```\n\n<b>Test lifecycle hooks</b> (functions that run before or after tests).\n\n> Reach for `beforeEach` before `before`. Shared setup created once is shared <b>state</b>, and shared state between tests is the thing the next lesson is about.\n\n---\n\n## `before()`\n\nRuns once before the tests in its scope.\n\n```javascript\nbefore(() => {\n  console.log(\"Setup\");\n});\n```\n\n```text\nCreate test resources\nInitialize configuration\nStart shared infrastructure\n```\n\nUse it for things that are <b>expensive and read-only</b>: starting a container, connecting a pool, loading a fixture file. Not for anything a test will modify.\n\n---\n\n## `after()`\n\n```javascript\nafter(() => {\n  console.log(\"Cleanup\");\n});\n```\n\n```text\nClose database\nDelete temporary files\nStop server\n```\n\nDay 4's cleanup, in a test. And the same rule applies: an open handle keeps the process alive, which is why a suite that passes but never exits is almost always a missing `after`.\n\nThat is worth naming because the symptom is confusing. `--test-force-exit` makes it go away, and it is a workaround, not a fix: it hides the leak rather than closing it.\n\n---\n\n## `beforeEach()`\n\n```javascript\nbeforeEach(() => {\n  database.reset();\n});\n```\n\n```text\nTest A → setup\nTest B → setup\nTest C → setup\n```\n\nThis is what stops tests affecting each other.\n\n---\n\n## `afterEach()`\n\n```javascript\nafterEach(() => {\n  cleanup();\n});\n```\n\n```text\nbeforeEach\n    ↓\nTest\n    ↓\nafterEach\n```\n\nOne asymmetry worth knowing: `afterEach` runs <b>even when the test fails</b>, which is what makes it safe for cleanup. Day 12's `posttest` script did not have that property, and this is the same distinction in a different place.\n\nSo prefer resetting in `beforeEach` over cleaning up in `afterEach` where you have the choice. A `beforeEach` reset works even if a previous test crashed the process mid-way and left something behind.",
      diagram: `skip is a silently deleted test

    a skipped test looks like a PASSING suite in
    every summary anyone will read

      ℹ pass 24
      ℹ skipped 3        ← who reads this line?

    so a permanent skip costs you a file to
    maintain and gives you nothing.

    temporary skip → issue → fix → remove skip


todo appears in the summary. that is the value.

    ℹ todo 2

    a gap you can SEE is a gap someone might close.
    a gap in a comment is not.


Prefer beforeEach over before

    before      runs ONCE
                  └─ what it creates is shared STATE
                     between tests, which is the next
                     lesson's whole problem

    use before for expensive and READ-ONLY:
      starting a container
      connecting a pool
      loading a fixture file

    not for anything a test will modify.


afterEach runs even when the test FAILS

    beforeEach → test → afterEach
                   │        ▲
                   └ fails ─┘   still runs

    which is what makes it safe for cleanup.

    Day 12's posttest script did NOT have that
    property. same distinction, different place.

    but prefer resetting in beforeEach where you can:
    it works even if a previous test crashed and
    left something behind.


The suite that passes and never exits

    ℹ pass 24
    (hangs)

    almost always a missing after(): an open handle
    keeps the process alive. Day 4.

    --test-force-exit makes it go away, and it is a
    WORKAROUND. it hides the leak rather than
    closing it.`,
      codeExample: {
        title: "Hooks that keep tests independent",
        code: `import test, { describe, it, before, after, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, rm, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

describe("user repository", () => {
  let dir;              // expensive, read-only: before
  let users;            // mutable state: beforeEach

  // ── before: once, for the expensive read-only thing ───────
  before(async () => {
    dir = await mkdtemp(join(tmpdir(), "day13-"));   // Day 6
  });

  // ── after: close what you opened. Day 4. ──────────────────
  after(async () => {
    await rm(dir, { recursive: true, force: true });
    // A suite that passes and never exits is almost always a
    // missing after(). An open handle keeps the process alive.
  });

  // ── beforeEach: reset the mutable state ───────────────────
  beforeEach(async () => {
    users = [{ id: 1, name: "Rajan" }];
    await writeFile(join(dir, "users.json"), JSON.stringify(users));
  });

  // ── afterEach: runs even when the test FAILS ──────────────
  afterEach(() => {
    users = null;
  });

  it("reads the seeded user", async () => {
    const data = JSON.parse(await readFile(join(dir, "users.json"), "utf8"));
    assert.deepEqual(data, [{ id: 1, name: "Rajan" }]);
  });

  it("does not see the previous test's writes", async () => {
    users.push({ id: 2, name: "Sita" });
    await writeFile(join(dir, "users.json"), JSON.stringify(users));
    assert.equal(users.length, 2);
  });

  it("is back to one user", async () => {
    const data = JSON.parse(await readFile(join(dir, "users.json"), "utf8"));
    assert.equal(data.length, 1);           // ✓ beforeEach reset it
  });
});


// ── skip: temporary only ────────────────────────────────────
test("pagination", { skip: "blocked on the API change" }, () => {
  assert.ok(false);
});
//
// ℹ pass 3
// ℹ skipped 1          ← who reads this line?
//
// A skipped test looks like a passing suite in every summary
// anyone will read. Give it a reason string, open an issue,
// and remove the skip.


// ── todo: a gap you can see ─────────────────────────────────
test.todo("add tests for concurrent writes");
//
// ℹ todo 1
//
// No function needed. It appears in the summary rather than
// vanishing into a comment nobody greps for.


// ── Why beforeEach beats before for mutable state ───────────
// ✗ before(() => { users = [{ id: 1 }] });
//
//   test A pushes to users
//   test B sees two users
//   test B passes
//   run test B alone → it fails
//
// ✓ beforeEach(() => { users = [{ id: 1 }] });
//
//   and a beforeEach reset survives a previous test crashing
//   mid-way, which an afterEach cleanup does not.`,
      },
      keyTakeaways: [
        "<b>A skipped test looks like a passing suite</b> in every summary anyone actually reads.",
        "So a permanent `skip` is a silently deleted test that still costs a file to maintain.",
        "Temporary skip, with a reason string, then an issue, then a fix, then remove it.",
        "<b>`test.todo`</b> appears in the summary as a `todo` count. A gap you can see is one someone might close.",
        "An <b>expected failure</b> documents a known gap. Abusing it is a permanent skip with an extra step.",
        "<b>Prefer `beforeEach` over `before`.</b> What `before` creates once is shared state between tests.",
        "Use `before` for the expensive and <b>read-only</b>: a container, a pool, a fixture file.",
        "`after` closes what you opened. Day 4's cleanup, in a test.",
        "<b>A suite that passes and never exits is almost always a missing `after`</b>: an open handle keeps the process alive.",
        "`--test-force-exit` hides that leak rather than closing it.",
        "<b>`afterEach` runs even when the test fails</b>, which is what makes it safe for cleanup.",
        "Day 12's `posttest` script did not have that property. Same distinction, different place.",
        "Still prefer resetting in `beforeEach`: it survives a previous test crashing mid-way.",
      ],
      commonMistakes: [
        "<b>Skipping a failing test instead of fixing it</b> — the suite goes green and the test is effectively deleted.",
        "<b>Skipping with no reason string</b> — nobody knows why, so nobody removes it.",
        "<b>Using `before` for anything a test mutates</b> — you have created shared state between tests.",
        "<b>Forgetting `after`</b> — the suite passes and then hangs on an open handle.",
        "<b>Reaching for `--test-force-exit`</b> — it hides the leak rather than closing it.",
        "<b>Cleaning up only in `afterEach`</b> — a previous crash leaves state behind. Reset in `beforeEach` too.",
        "<b>Putting a `todo` note in a comment</b> — it does not appear in the summary, so it is invisible.",
      ],
      quiz: [
        {
          question: "Why is a permanently skipped test worse than a failing one?",
          options: [
            "It runs slower",
            "A skipped test looks like a passing suite in every summary, so the coverage is gone and nobody notices",
            "It breaks the coverage report",
            "It cannot be un-skipped",
          ],
          correctIndex: 1,
          explanation:
            "The `skipped` count is a line nobody reads. You have deleted a test while keeping the file, which is the worst of both.",
        },
        {
          question: "Why prefer `beforeEach` over `before` for test data?",
          options: [
            "It is faster",
            "What `before` creates once becomes shared state between tests, which is what makes a suite fragile",
            "`before` does not support async",
            "`beforeEach` runs in parallel",
          ],
          correctIndex: 1,
          explanation:
            "Reserve `before` for the expensive and read-only. A `beforeEach` reset also survives a previous test crashing mid-way, which cleanup in `afterEach` does not.",
        },
        {
          question: "Your suite passes but the process never exits. What is the likely cause?",
          options: [
            "A test is too slow",
            "A missing `after` hook, so an open handle keeps the event loop alive",
            "Too many tests",
            "A skipped test",
          ],
          correctIndex: 1,
          explanation:
            "Day 4's rule in a test file. `--test-force-exit` makes the symptom go away and leaves the leak in place.",
        },
      ],
    },
    {
      id: "mocking",
      title: "Mocking",
      durationMinutes: 12,
      explanation:
        "<b>Mocking</b> (replacing a real dependency or behaviour with a controlled fake during a test).\n\n> Every mock is an assumption about how the real thing behaves. When the assumption is wrong, the test passes and production breaks, which is the failure mode mocks uniquely produce.\n\nKeep that in view for the whole lesson. Mocks buy speed and control, and they pay for it with fidelity.\n\nSuppose:\n\n```javascript\nawait sendEmail(user);\n```\n\nYou do not want a unit test sending real email.\n\n```text\nApplication\n   ↓\nEmail service\n```\n\nbecomes:\n\n```text\nApplication\n   ↓\nMock email service\n   ↓\n\"pretend email was sent\"\n```\n\n---\n\n## `mock.fn()`\n\n<b>`mock.fn()`</b> (creates a mock function that records how it was called).\n\n> Recording is the point. A mock function is not primarily a stand-in, it is a <b>question you can ask afterwards</b>: was this called, how often, and with what.\n\n```javascript\nimport { mock } from \"node:test\";\n\nconst fn = mock.fn();\n\nfn(\"hello\");\n\nassert.equal(fn.mock.calls.length, 1);\n```\n\n```text\nHow many times?\nWhat arguments?\nWhat returned?\n```\n\nThe arguments live at `fn.mock.calls[0].arguments`, as an array. And `mock.fn(implementation)` gives it a body, so it can return a value as well as record the call.\n\n---\n\n## `mock.method()`\n\n<b>`mock.method()`</b> (temporarily replaces an object's method with a mock).\n\n> \"Temporarily\" is doing real work in that sentence. The replacement lasts until you restore it, and a mock left in place leaks into every test that runs afterwards, in file order, which is a genuinely confusing failure to track down.\n\n```javascript\nconst service = {\n  send() {\n    return \"real\";\n  }\n};\n\nmock.method(service, \"send\", () => {\n  return \"fake\";\n});\n```\n\nSo `mock.restoreAll()` in an `afterEach` is the habit, and Node's runner also restores mocks automatically at the end of the test that created them in most cases. Do not rely on that when the object is module-level.\n\n---\n\n## Why mock\n\n```text\nCreate order\n    ↓\nCharge credit card\n    ↓\nSend email\n```\n\nA unit test for order creation should not:\n\n```text\n💳 charge real card\n📧 send real email\n```\n\nInstead:\n\n```text\nCreate order\n    ↓\nMock payment\n    ↓\nMock email\n```\n\nThen test:\n\n```text\nWas payment called?\nWas email called?\nWas order created?\n```\n\n---\n\n## Do not mock everything\n\n```text\nMock database\nMock HTTP\nMock filesystem\nMock service\nMock repository\nMock everything\n```\n\n> Then your test proves only: \"my mocks behave like my mocks\". That sentence is the whole warning, and it is not hypothetical.\n\nThe concrete version: you mock your database to return `{ rows: [...] }`, the real driver returns `{ rows, rowCount }`, and every test passes while the feature is broken. The mock encoded your belief about the driver, and your belief was wrong.\n\nSo the rule that follows: <b>mock what you own, use the real thing for what you do not</b>. Your own email service is a reasonable mock, because you know its contract. A database driver is not, which is what the integration lesson is about.\n\nAnd mocking has a design signal in it. If a unit test needs six mocks, the function under test has six dependencies, and that is usually the finding rather than the test being hard to write.",
      diagram: `Every mock is an assumption

    you mock the database:  { rows: [...] }
    the real driver returns: { rows, rowCount }
        ↓
    every test passes
        ↓
    the feature is broken

    the mock encoded your BELIEF about the driver,
    and your belief was wrong.

    that is the failure mode mocks uniquely produce:
    a green suite and a broken production.


mock.fn() is a question, not a stand-in

    const fn = mock.fn()
    fn("hello")

    fn.mock.calls.length              → 1
    fn.mock.calls[0].arguments        → ["hello"]

    the RECORDING is the point: was this called,
    how often, with what.

    mock.fn(impl) gives it a body too, so it can
    return a value as well as record.


"Temporarily" in mock.method is load-bearing

    mock.method(service, "send", fake)
         └─ lasts until you restore it

    a mock left in place leaks into every test that
    runs AFTERWARDS, in file order
        ↓
    a genuinely confusing failure to track down

    habit: mock.restoreAll() in afterEach
      (the runner also restores per-test in most
       cases; do not rely on it for module-level
       objects)


The rule that falls out

    mock what you OWN
      your email service, your notifier
        └─ you know its contract

    use the REAL THING for what you do not
      a database driver, an HTTP client
        └─ your belief about it is the risk

    which is what the integration lesson is about.


And mocking carries a design signal

    a unit test needing SIX mocks
        ↓
    the function has six dependencies
        ↓
    that is usually the finding, not "this test
    is hard to write"`,
      codeExample: {
        title: "Mocks that ask questions, and one that lies",
        code: `import test, { describe, it, mock, afterEach } from "node:test";
import assert from "node:assert/strict";

// ── mock.fn: recording is the point ─────────────────────────
test("mock.fn records how it was called", () => {
  const sendEmail = mock.fn();

  sendEmail({ to: "r@x.com" }, "Welcome");

  assert.equal(sendEmail.mock.calls.length, 1);
  assert.deepEqual(sendEmail.mock.calls[0].arguments, [
    { to: "r@x.com" },
    "Welcome",
  ]);
});

// ── mock.fn with an implementation ──────────────────────────
test("mock.fn can return a value too", () => {
  const charge = mock.fn(() => ({ id: "ch_1", status: "succeeded" }));

  const result = charge(2500);

  assert.equal(result.status, "succeeded");
  assert.deepEqual(charge.mock.calls[0].arguments, [2500]);
});


// ── The interaction test this enables ───────────────────────
async function createOrder({ payment, email }, order) {
  const charge = await payment.charge(order.total);
  await email.send(order.userEmail, "Order confirmed");
  return { ...order, chargeId: charge.id };
}

describe("createOrder", () => {
  afterEach(() => mock.restoreAll());     // ← the habit

  it("charges once and emails once", async () => {
    const payment = { charge: mock.fn(async () => ({ id: "ch_1" })) };
    const email = { send: mock.fn(async () => {}) };

    const result = await createOrder(
      { payment, email },
      { total: 2500, userEmail: "r@x.com" },
    );

    assert.equal(payment.charge.mock.calls.length, 1);
    assert.deepEqual(payment.charge.mock.calls[0].arguments, [2500]);
    assert.equal(email.send.mock.calls.length, 1);
    assert.equal(result.chargeId, "ch_1");
  });
});
//
// No real card charged, no real email. And the assertions are
// about INTERACTIONS, which is what mocks are good for.


// ── mock.method: temporary, and it leaks if you forget ──────
const service = {
  send() { return "real"; },
};

test("mock.method replaces temporarily", () => {
  mock.method(service, "send", () => "fake");

  assert.equal(service.send(), "fake");

  mock.restoreAll();
  assert.equal(service.send(), "real");
});
//
// Forget the restore and every test after this one, in file
// order, sees "fake". That is a confusing failure to find.


// ── The mock that lies ──────────────────────────────────────
// ✗ mocking a dependency you do not own
//
// const db = {
//   query: mock.fn(async () => ({ rows: [{ id: 1 }] })),
// };
//
// async function countUsers(db) {
//   const result = await db.query("SELECT * FROM users");
//   return result.rowCount;            // ← the REAL driver
// }                                       returns this
//
// The mock returns { rows } with no rowCount, so countUsers
// returns undefined. But if your assertion checks rows.length
// instead, the test passes and the feature is broken.
//
// The mock encoded your belief about the driver. Use a real
// database for that, which is the next lesson.


// ── The design signal ───────────────────────────────────────
// a unit test needing six mocks means the function has six
// dependencies. That is usually the finding.`,
      },
      keyTakeaways: [
        "<b>Every mock is an assumption</b> about how the real thing behaves.",
        "When the assumption is wrong, the test passes and production breaks. That is mocks' unique failure mode.",
        "`mock.fn()` records calls. The <b>recording is the point</b>: was this called, how often, with what.",
        "Arguments live at `fn.mock.calls[0].arguments`. `mock.fn(impl)` gives it a body too.",
        "`mock.method()` replaces a method <b>temporarily</b>, and that word is load-bearing.",
        "A mock left in place <b>leaks into every later test</b>, in file order, which is hard to track down.",
        "`mock.restoreAll()` in an `afterEach` is the habit. Do not rely on automatic restoration for module-level objects.",
        "Mock everything and your test proves only \"my mocks behave like my mocks\".",
        "The concrete version: your mock returns `{ rows }`, the real driver returns `{ rows, rowCount }`, and everything passes.",
        "So: <b>mock what you own, use the real thing for what you do not</b>.",
        "Your own email service is a fair mock. A database driver is not, which is the integration lesson.",
        "Mocking carries a <b>design signal</b>: six mocks means six dependencies, and that is usually the finding.",
      ],
      commonMistakes: [
        "<b>Mocking a database driver</b> — you encode your belief about its return shape, and a wrong belief passes silently.",
        "<b>Forgetting `mock.restoreAll()`</b> — the mock leaks into every later test in file order.",
        "<b>Asserting only that a mock was called</b> — check the arguments too, or you are testing very little.",
        "<b>Mocking everything for speed</b> — you end up testing your mocks against your mocks.",
        "<b>Treating six mocks as a testing problem</b> — it is a design finding about the function's dependencies.",
        "<b>Reading `fn.mock.calls[0]` as the arguments</b> — the arguments are on `.arguments` inside it.",
      ],
      quiz: [
        {
          question: "What is the failure mode that mocks uniquely produce?",
          options: [
            "Slow tests",
            "The test passes because your mock matched your belief about the dependency, while production breaks because the belief was wrong",
            "Flaky results",
            "Coverage gaps",
          ],
          correctIndex: 1,
          explanation:
            "Your mock returns `{ rows }` and the real driver returns `{ rows, rowCount }`. Every assertion passes and the feature is broken, which is why you use the real thing for dependencies you do not own.",
        },
        {
          question: "You forget `mock.restoreAll()` after using `mock.method`. What happens?",
          options: [
            "Nothing, mocks are per-test",
            "The mock can leak into later tests in file order, producing failures that are hard to trace",
            "A TypeError on the next call",
            "The suite refuses to run",
          ],
          correctIndex: 1,
          explanation:
            "\"Temporarily\" means until you restore it. Node restores per-test in many cases, but not reliably for module-level objects, which is why the `afterEach` habit is worth having.",
        },
        {
          question: "A unit test needs six mocks. What is the most useful conclusion?",
          options: [
            "Use a mocking library",
            "The function under test has six dependencies, and that is the finding",
            "Convert it to an integration test",
            "Split the test into six",
          ],
          correctIndex: 1,
          explanation:
            "Difficulty writing the test is information about the design. Six dependencies in one function is usually the thing worth changing.",
        },
      ],
    },
    {
      id: "timers-and-modules",
      title: "mock.timers, mock.module and coverage",
      durationMinutes: 12,
      explanation:
        "## `mock.timers`\n\nTime-dependent code is awkward to test:\n\n```javascript\nsetTimeout(() => {\n  console.log(\"done\");\n}, 5000);\n```\n\nYou do not want a test waiting five seconds.\n\n<b>`mock.timers`</b> (replaces Node's timer functions so a test can control the passage of time).\n\n> This turns a slow, flaky test into a fast, deterministic one. A test that waits on real time is slow when it passes and <b>intermittently failing</b> when the machine is busy, which is worse than slow.\n\n```text\nReal time\n   ↓\n5 seconds\n\nMocked time\n   ↓\nadvance instantly\n```\n\n---\n\n## Using it\n\n```javascript\nimport {\n  test,\n  mock\n} from \"node:test\";\n\ntest(\"timer runs\", () => {\n  mock.timers.enable();\n\n  let called = false;\n\n  setTimeout(() => {\n    called = true;\n  }, 1000);\n\n  mock.timers.tick(1000);\n\n  assert.equal(called, true);\n\n  mock.timers.reset();\n});\n```\n\nThat works as written. You can also narrow it to specific APIs with `mock.timers.enable({ apis: [\"setTimeout\"] })`, which is worth doing when a test also relies on real timers elsewhere.\n\nThe `reset()` is not optional. Leave timers mocked and every later test in the file gets a frozen clock, which is the same leak as an unrestored method mock.\n\nAnd it makes a one-hour timeout testable in a millisecond, which is the case this feature exists for.\n\n---\n\n## `mock.module()`\n\n<b>`mock.module()`</b> (replaces an imported module during testing).\n\n> Reach for this last. Module mocking fights Day 2's module system: ESM imports are resolved before your code runs, so replacing one means intercepting resolution, which is why the feature is behind `--experimental-test-module-mocks`.\n\nUseful when a module talks to:\n\n```text\nExternal API\nDatabase\nFilesystem\nThird-party service\n```\n\nBut module mocking gets complicated, especially with caching and ESM. Use it when it genuinely improves isolation.\n\nThe alternative worth trying first: <b>pass the dependency in</b> rather than importing it. `createOrder({ payment, email }, order)` needs no module mocking at all, and the previous lesson's tests worked because of that shape. Module mocking is usually a workaround for a function that reaches out to get its own dependencies.\n\n---\n\n## Code coverage\n\n<b>Code coverage</b> (a measurement of how much of your code is executed by tests).\n\n> High coverage does not mean high-quality tests. You can have 100% coverage and terrible assertions, because coverage measures which lines <b>ran</b>, not whether anything was <b>checked</b>.\n\n```bash\nnode --experimental-test-coverage\n```\n\n```text\nFile             Coverage\n--------------------------------\nuser.js          94%\nauth.js          87%\npayment.js       61%\n```\n\nThe demonstration is short: a test that calls every function and asserts nothing reports 100%. Coverage cannot tell that apart from a thorough suite.\n\n---\n\n## Coverage is a signal\n\n```text\nCoverage\n   ↓\n\"Which code isn't tested?\"\n```\n\nnot:\n\n```text\nCoverage\n   ↓\n\"Therefore my application is correct.\"\n```\n\nSo read it as a <b>map of gaps</b>, which is genuinely useful. `payment.js` at 61% is worth a look, and it is the one file in that list you would not have guessed.\n\nWhat it does badly is as a target. A team held to 90% writes tests for the easy 30% rather than the risky 10%, and Node's `--test-coverage-lines` threshold makes that measurable, which is exactly what makes it tempting to game.\n\n---\n\n## Snapshot testing\n\n<b>Snapshot testing</b> (saving an expected representation of output and comparing future results against it).\n\n> The risk is that a snapshot is an assertion nobody wrote. When it fails, the fastest fix is to update it, and updating an incorrect snapshot turns a caught regression into an accepted one.\n\n```text\nFirst run\n   ↓\nGenerate snapshot\n\nFuture run\n   ↓\nCompare output\n   ↓\nChanged?\n```\n\nUseful for large structured output where asserting every field would be tedious. But snapshots become:\n\n```text\nhuge\nhard to review\neasy to blindly update\n```\n\nThe test worth applying: <b>would you notice a wrong value in the diff?</b> A twelve-line snapshot, yes. A four-hundred-line one, no, and it is providing less than it appears to.",
      diagram: `A test on real time is worse than slow

    waits 5 seconds
        ↓
    slow when it passes
    INTERMITTENTLY FAILING when the machine is busy

    mocked time
        ↓
    fast AND deterministic

    and a one-hour timeout becomes testable in a
    millisecond, which is the case this exists for.

    reset() is not optional: leave it mocked and
    every later test in the file has a frozen clock.


mock.module fights the module system

    ESM imports are resolved BEFORE your code runs
        ↓
    replacing one means intercepting resolution
        ↓
    which is why it is behind
    --experimental-test-module-mocks

    try this FIRST:

      ✗ createOrder(order)          imports its own deps
      ✓ createOrder({ payment, email }, order)

    the previous lesson's tests needed no module
    mocking because of that shape. module mocking is
    usually a workaround for a function that reaches
    out to get its own dependencies.


Coverage measures what RAN, not what was CHECKED

    a test that calls every function and asserts
    nothing reports 100%

    coverage cannot tell that apart from a thorough
    suite.


    read it as a MAP OF GAPS

      user.js      94%
      auth.js      87%
      payment.js   61%   ← the one you would not
                            have guessed. worth a look.

    as a TARGET it fails: a team held to 90% writes
    tests for the easy 30% rather than the risky 10%,
    and --test-coverage-lines makes that measurable,
    which is what makes it tempting to game.


A snapshot is an assertion nobody wrote

    it fails
        ↓
    the fastest fix is to UPDATE it
        ↓
    updating a wrong snapshot turns a caught
    regression into an accepted one

    the test: would you NOTICE a wrong value in
    the diff?

      12 lines    yes
      400 lines   no, and it is providing less
                  than it appears to`,
      codeExample: {
        title: "Mocked time, injected dependencies, honest coverage",
        code: `import test, { mock, afterEach } from "node:test";
import assert from "node:assert/strict";

afterEach(() => {
  mock.timers.reset();
  mock.restoreAll();
});

// ── mock.timers: a one-hour timeout, in a millisecond ───────
function expiresInOneHour(callback) {
  setTimeout(callback, 60 * 60 * 1000);
}

test("expires after one hour", () => {
  mock.timers.enable();

  let expired = false;
  expiresInOneHour(() => { expired = true; });

  assert.equal(expired, false);            // not yet
  mock.timers.tick(60 * 60 * 1000);        // advance an hour
  assert.equal(expired, true);
});
//
// Without this the test either waits an hour, or uses a
// shorter timeout and tests something other than the code.


// ── Narrowing which timers are mocked ───────────────────────
test("only setTimeout is faked", () => {
  mock.timers.enable({ apis: ["setTimeout"] });

  let n = 0;
  setTimeout(() => { n = 1; }, 5000);
  mock.timers.tick(5000);
  assert.equal(n, 1);
});
//
// Useful when a test also relies on a real interval
// elsewhere. And reset() in afterEach, or every later test
// in this file gets a frozen clock.


// ── Prefer injection over mock.module ───────────────────────
// ✗ the shape that FORCES module mocking
// import { charge } from "./payment.js";
// export async function createOrder(order) {
//   return charge(order.total);          ← reaches out for it
// }
//
// ✓ the shape that does not
export async function createOrder({ payment }, order) {
  return payment.charge(order.total);     // ← handed in
}

test("no module mocking needed", async () => {
  const payment = { charge: mock.fn(async () => ({ id: "ch_1" })) };
  const result = await createOrder({ payment }, { total: 2500 });

  assert.equal(result.id, "ch_1");
  assert.deepEqual(payment.charge.mock.calls[0].arguments, [2500]);
});
//
// mock.module exists, behind --experimental-test-module-mocks,
// and it fights Day 2's resolution order. Injection is
// usually the finding rather than the workaround.


// ── Why coverage cannot judge quality ───────────────────────
function applyDiscount(total, code) {
  if (code === "HALF") return total / 2;
  if (code === "TENNER") return total - 10;
  return total;
}

// 100% line coverage, zero value:
test("touches every branch, checks nothing", () => {
  applyDiscount(100, "HALF");
  applyDiscount(100, "TENNER");
  applyDiscount(100, "NONE");
  assert.ok(true);                         // ← the whole assertion
});

// same coverage, actually a test:
test("applies each discount correctly", () => {
  assert.equal(applyDiscount(100, "HALF"), 50);
  assert.equal(applyDiscount(100, "TENNER"), 90);
  assert.equal(applyDiscount(100, "NONE"), 100);
});
//
// $ node --test --experimental-test-coverage
//   Both report 100% for applyDiscount. Coverage measures
//   which lines RAN, not whether anything was CHECKED.


// ── Read coverage as a map of gaps ──────────────────────────
// file          | line % |
// --------------|--------|
// user.js       |  94.12 |
// auth.js       |  87.50 |
// payment.js    |  61.03 |   ← worth a look, and the one
//                               you would not have guessed
//
// As a threshold (--test-coverage-lines=90) it invites
// testing the easy 30% instead of the risky 10%.`,
      },
      keyTakeaways: [
        "A test that waits on <b>real time</b> is slow when it passes and intermittently failing when the machine is busy.",
        "`mock.timers` makes it fast <b>and deterministic</b>, which is the actual win.",
        "`mock.timers.enable()` then `tick(ms)` makes a one-hour timeout testable in a millisecond.",
        "`{ apis: [\"setTimeout\"] }` narrows it when a test also needs real timers.",
        "<b>`reset()` is not optional.</b> A frozen clock leaks into every later test in the file.",
        "<b>Reach for `mock.module()` last.</b> It fights Day 2's resolution order, hence the experimental flag.",
        "Try <b>passing the dependency in</b> first. `createOrder({ payment }, order)` needs no module mocking.",
        "Module mocking is usually a workaround for a function that reaches out for its own dependencies.",
        "<b>Coverage measures which lines ran, not whether anything was checked.</b>",
        "A test calling every function and asserting nothing reports 100%.",
        "Read coverage as a <b>map of gaps</b>: the file at 61% is the one you would not have guessed.",
        "As a <b>target</b> it fails: a 90% threshold invites testing the easy 30% instead of the risky 10%.",
        "A <b>snapshot is an assertion nobody wrote</b>, and updating a wrong one accepts the regression.",
        "The test: would you notice a wrong value in the diff? Twelve lines yes, four hundred no.",
      ],
      commonMistakes: [
        "<b>Waiting on real time in a test</b> — slow when it passes, flaky when the machine is loaded.",
        "<b>Shortening a timeout so the test is fast</b> — you are now testing different code from production.",
        "<b>Forgetting `mock.timers.reset()`</b> — every later test in the file runs on a frozen clock.",
        "<b>Reaching for `mock.module` first</b> — injection usually removes the need entirely.",
        "<b>Treating coverage as a quality measure</b> — it cannot tell a thorough suite from one that asserts nothing.",
        "<b>Setting a coverage threshold as a goal</b> — it rewards testing the easy code.",
        "<b>Updating a failing snapshot to get green</b> — you have accepted the regression it caught.",
        "<b>A four-hundred-line snapshot</b> — nobody reviews the diff, so it asserts almost nothing.",
      ],
      quiz: [
        {
          question: "Beyond speed, why mock timers instead of waiting?",
          options: [
            "It uses less memory",
            "A test on real time is also intermittently failing when the machine is busy, so mocking makes it deterministic as well as fast",
            "Real timers do not work in tests",
            "It improves coverage",
          ],
          correctIndex: 1,
          explanation:
            "Flaky is worse than slow, because a suite you cannot trust when it passes fails one of the three things that make a suite valuable.",
        },
        {
          question: "What should you try before reaching for `mock.module()`?",
          options: [
            "A coverage report",
            "Passing the dependency in as an argument, so there is nothing to intercept",
            "`mock.timers`",
            "A snapshot test",
          ],
          correctIndex: 1,
          explanation:
            "ESM imports resolve before your code runs, which is why module mocking is experimental. Injection removes the need, and the difficulty was a design signal.",
        },
        {
          question: "A test calls every function in a file and asserts `ok(true)`. What does coverage report?",
          options: [
            "0%",
            "100%, because coverage measures which lines ran and not whether anything was checked",
            "It refuses to report",
            "About 50%",
          ],
          correctIndex: 1,
          explanation:
            "That is the whole limitation. Coverage is a useful map of untested code and a poor measure of test quality, which is why a threshold rewards the wrong work.",
        },
      ],
    },
    {
      id: "test-levels",
      title: "Unit, integration and end-to-end",
      durationMinutes: 12,
      explanation:
        "## Unit tests\n\n<b>Unit test</b> (tests one small piece of functionality in isolation).\n\n> Its job is <b>fast feedback</b>, not confidence that the system works. A thousand passing unit tests tell you your functions are individually correct and nothing about whether they are wired together.\n\n```javascript\nfunction add(a, b) {\n  return a + b;\n}\n```\n\n```javascript\ntest(\"add works\", () => {\n  assert.equal(add(2, 3), 5);\n});\n```\n\n```text\nSmall\nFast\nFocused\n```\n\n---\n\n## Integration tests\n\n<b>Integration test</b> (tests multiple real components working together).\n\n> This is where the mocking lesson's warning gets paid off. An integration test is the only kind that can catch a wrong assumption about a dependency you do not own.\n\n```text\nAPI\n ↓\nService\n ↓\nRepository\n ↓\nReal database\n```\n\nInstead of mocking the database, use a real one. That catches:\n\n```text\nWrong SQL\nWrong schema\nWrong transaction\nWrong serialization\nWrong database behavior\n```\n\nEvery item on that list is invisible to a mock, because a mock cannot disagree with you about SQL.\n\n---\n\n## End-to-end tests\n\n<b>End-to-end test</b> (tests the complete application flow from the client's perspective).\n\n> High confidence, high cost. An E2E failure tells you something is broken and rarely tells you where, which is the trade you are making.\n\n```text\nHTTP request\n    ↓\nRouter\n    ↓\nController\n    ↓\nService\n    ↓\nDatabase\n    ↓\nResponse\n```\n\n```text\nPOST /users\n    ↓\nCreate user\n    ↓\nGET /users/:id\n    ↓\nVerify user\n```\n\n---\n\n## The testing pyramid\n\n```text\n           E2E\n          /   \\\n         /     \\\n    Integration\n      /       \\\n     /         \\\n   Unit Tests\n```\n\n```text\nMany unit tests\nSome integration tests\nFew E2E tests\n```\n\n```text\nUnit\n↓\nfast + cheap\n\nIntegration\n↓\nslower + more realistic\n\nE2E\n↓\nslowest + most expensive\n```\n\nDo not read it as a rigid percentage rule. The right ratio depends on your application.\n\nAnd be honest about which axis actually matters: the pyramid is about <b>speed and diagnosis</b>, not correctness. A test higher up finds more real bugs and tells you less about where they are. For a backend that is mostly moving data between HTTP and a database, the useful shape is often flatter than the picture suggests, because the interesting bugs live in the integration layer.\n\n---\n\n## Testing HTTP without a real port\n\nGiven:\n\n```javascript\nconst server = createServer(handler);\n```\n\nA beginner reaches for:\n\n```text\nstart server\n   ↓\nlisten on port 3000\n   ↓\nsend HTTP request\n   ↓\ntest\n   ↓\nstop server\n```\n\nBut if your HTTP logic is separated, you can test the handler directly:\n\n```text\nRequest\n   ↓\nhandler(req, res)\n   ↓\nResponse\n```\n\n```text\nFaster\nMore isolated\nLess flaky\n```\n\nThe flakiness has a specific cause worth naming: a <b>hardcoded port</b>. Two test files, or two CI jobs on one machine, and you get `EADDRINUSE`. Day 10's `server.listen(0)` fixes it by binding a random free port, which is the change to make if you do want a real server.\n\n---\n\n## Better HTTP architecture\n\nInstead of:\n\n```text\nserver.js\n    ↓\neverything\n```\n\nseparate:\n\n```text\nserver.js\n    ↓\ncreateServer(handler)\n\nhandler.js\n    ↓\nHTTP behavior\n```\n\nThat split is the same shape as the mocking lesson's injection point. A `server.js` that only calls `listen` and a `handler.js` that holds the behaviour is testable because <b>the part with logic in it does not own the port</b>.\n\n---\n\n## Testcontainers\n\n<b>Testcontainers</b> (a tool for starting disposable real infrastructure, usually containers, during tests).\n\n> It closes the gap the mocking lesson opened: you get a real PostgreSQL without a shared test database that tests fight over.\n\n```text\nTest\n ↓\nStart PostgreSQL container\n ↓\nRun migrations\n ↓\nRun tests\n ↓\nDestroy container\n```\n\n---\n\n## Why real databases matter\n\nYour mock says `SELECT works`, while the real query has:\n\n```text\nwrong JOIN\nwrong index assumption\nwrong constraint\nwrong SQL syntax\n```\n\nYour unit test still passes.\n\n```text\n                 Test\n                  │\n                  ↓\n        ┌─────────────────┐\n        │ PostgreSQL      │\n        │ temporary       │\n        │ container       │\n        └─────────────────┘\n                  │\n                  ↓\n              real DB\n```\n\nThe practical cost, stated honestly: a container takes seconds to start, so it belongs in `before` rather than `beforeEach`, and this is the suite CI runs less often. Day 12's script split is what makes that arrangement expressible.\n\n---\n\n## When Vitest still makes sense\n\n<b>Vitest</b> (a modern JavaScript test framework with strong integration with frontend tooling).\n\n> Use Node's runner by default for a Node-only backend, unless another framework gives you a clear advantage. A shared frontend is a clear advantage; preference is not.\n\n```text\nMonorepo\n├── frontend\n│    └── Vitest\n│\n├── backend\n│    └── Node test runner\n│\n└── shared\n     └── tests\n```\n\nOr one framework across both. The consistency argument is real, and it is the same argument as Day 12's \"pick one package manager\": two runners means two configurations, two watch modes and two sets of conventions for the same job.",
      diagram: `What each level is actually FOR

    unit          FAST FEEDBACK
                  a thousand passing unit tests tell you
                  your functions are individually correct
                  and NOTHING about whether they are
                  wired together

    integration   the only kind that can catch a wrong
                  assumption about a dependency you do
                  not own
                    └─ a mock cannot disagree with you
                       about SQL

    E2E           high confidence, and it tells you
                  something is broken without telling
                  you WHERE


The pyramid is about speed and diagnosis

    not correctness.

    higher up   finds more real bugs
                tells you less about where

    so for a backend that mostly moves data between
    HTTP and a database, the useful shape is often
    FLATTER than the picture, because the interesting
    bugs live in the integration layer.


The specific cause of flaky HTTP tests

    server.listen(3000)
        ↓
    two test files, or two CI jobs on one machine
        ↓
    EADDRINUSE

    Day 10's fix: server.listen(0)
      binds a random free port


The architecture that makes it testable

    server.js     createServer(handler); listen()
    handler.js    the HTTP behaviour

    the part with LOGIC in it does not own the PORT.

    same shape as the mocking lesson's injection
    point.


Testcontainers closes the mocking gap

    a real PostgreSQL, without a shared test database
    that tests fight over

    honest cost: seconds to start
      → belongs in before(), not beforeEach()
      → this is the suite CI runs LESS OFTEN
      → Day 12's script split is what makes that
        arrangement expressible`,
      codeExample: {
        title: "The three levels, on the same feature",
        code: `import test, { describe, it, before, after, beforeEach } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { once } from "node:events";

// ══ 1. UNIT: fast feedback on one piece ════════════════════
function validateUser(user) {
  if (!user?.name) return { ok: false, field: "name" };
  if (!user?.email?.includes("@")) return { ok: false, field: "email" };
  return { ok: true };
}

describe("validateUser", () => {
  it("accepts a valid user", () => {
    assert.deepEqual(validateUser({ name: "Rajan", email: "r@x.com" }),
      { ok: true });
  });
  it("rejects a missing name", () => {
    assert.deepEqual(validateUser({ email: "r@x.com" }),
      { ok: false, field: "name" });
  });
  it("rejects a malformed email", () => {
    assert.deepEqual(validateUser({ name: "Rajan", email: "nope" }),
      { ok: false, field: "email" });
  });
});
//
// Milliseconds. And it tells you nothing about whether the
// HTTP layer calls it.


// ══ 2. HTTP: the handler, with no port at all ══════════════
function createHandler(store) {
  return async (req, res) => {
    if (req.method === "POST" && req.url === "/users") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));

      const check = validateUser(body);
      if (!check.ok) {
        res.writeHead(422, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ error: check.field }));
      }
      const user = { id: store.length + 1, ...body };
      store.push(user);
      res.writeHead(201, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(user));
    }
    res.writeHead(404).end();
  };
}
//
// server.js would be: http.createServer(createHandler(store)).listen(...)
//
// The part with LOGIC does not own the PORT, which is what
// makes it testable. Same shape as injecting a dependency.


// ══ 3. INTEGRATION: a real server, on a random port ════════
describe("POST /users", () => {
  let server;
  let base;
  let store;

  before(async () => {
    store = [];
    server = http.createServer(createHandler(store));
    server.listen(0);                     // ← Day 10. NOT 3000.
    await once(server, "listening");
    base = \`http://localhost:\${server.address().port}\`;
  });

  after(() => server.close());            // ← or the suite hangs

  beforeEach(() => { store.length = 0; });  // reset mutable state

  it("creates a user and returns 201", async () => {
    const response = await fetch(\`\${base}/users\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rajan", email: "r@x.com" }),
    });

    assert.equal(response.status, 201);
    assert.deepEqual(await response.json(), {
      id: 1, name: "Rajan", email: "r@x.com",
    });
  });

  it("returns 422 for a malformed email", async () => {
    const response = await fetch(\`\${base}/users\`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Rajan", email: "nope" }),
    });

    assert.equal(response.status, 422);
    assert.deepEqual(await response.json(), { error: "email" });
  });
});
//
// listen(0) is why this does not fail with EADDRINUSE when
// another test file, or another CI job, is also running.


// ══ And where a real database belongs ══════════════════════
// before(async () => {
//   container = await new PostgreSqlContainer().start();   // seconds
//   pool = new Pool({ connectionString: container.getConnectionUri() });
//   await runMigrations(pool);
// });
// after(async () => {
//   await pool.end();
//   await container.stop();
// });
// beforeEach(() => pool.query("TRUNCATE users"));
//
// In before(), not beforeEach(): it takes seconds. And this
// is the suite CI runs less often, which is why Day 12's
// script split matters:
//
//   "test":             "node --test test/unit"
//   "test:integration": "node --test test/integration"`,
      },
      keyTakeaways: [
        "A <b>unit test</b> gives fast feedback, not confidence that the system works.",
        "A thousand passing unit tests say your functions are individually correct and nothing about the wiring.",
        "An <b>integration test</b> is the only kind that can catch a wrong assumption about a dependency you do not own.",
        "A mock cannot disagree with you about SQL, which is why wrong joins and constraints are invisible to it.",
        "An <b>E2E test</b> gives high confidence and rarely tells you <b>where</b> the break is.",
        "The pyramid is about <b>speed and diagnosis</b>, not correctness.",
        "For a backend moving data between HTTP and a database, the useful shape is often flatter than the picture.",
        "Flaky HTTP tests usually come from a <b>hardcoded port</b>. Day 10's `listen(0)` fixes it.",
        "Split `server.js` from `handler.js` so <b>the part with logic does not own the port</b>.",
        "That is the same shape as injecting a dependency in the mocking lesson.",
        "<b>Testcontainers</b> gives a real database without a shared one that tests fight over.",
        "It costs seconds, so it belongs in `before` and in the suite CI runs less often. Day 12's script split.",
        "Use Node's runner by default. A shared frontend is a clear reason for Vitest; preference is not.",
      ],
      commonMistakes: [
        "<b>Treating unit test count as confidence</b> — they say nothing about whether the pieces are connected.",
        "<b>Mocking the database and calling it an integration test</b> — a mock cannot catch a wrong join.",
        "<b>Hardcoding a port in a test</b> — `EADDRINUSE` as soon as two files or two CI jobs run.",
        "<b>Putting HTTP logic in `server.js`</b> — you cannot test it without opening a port.",
        "<b>Starting a container in `beforeEach`</b> — seconds per test instead of seconds per suite.",
        "<b>Running integration tests on every push</b> — they belong in a separate, less frequent script.",
        "<b>Chasing the pyramid's shape as a rule</b> — the right ratio follows from where your bugs actually are.",
        "<b>Adding a second test framework by preference</b> — two configurations for one job, as in Day 12.",
      ],
      quiz: [
        {
          question: "What can an integration test catch that a unit test with mocks cannot?",
          options: [
            "Slow code",
            "A wrong assumption about a dependency you do not own, such as a wrong join or constraint",
            "Type errors",
            "Memory leaks",
          ],
          correctIndex: 1,
          explanation:
            "A mock cannot disagree with you about SQL. It returns what you told it to, which is exactly why a wrong query passes every unit test.",
        },
        {
          question: "Your HTTP tests fail with `EADDRINUSE` in CI. What is the fix?",
          options: [
            "Increase the test timeout",
            "`server.listen(0)` to bind a random free port",
            "Run tests serially",
            "Mock the server",
          ],
          correctIndex: 1,
          explanation:
            "A hardcoded port collides as soon as two test files or two CI jobs run on one machine. Day 10's random-port trick removes the whole class of flakiness.",
        },
        {
          question: "What is the testing pyramid actually about?",
          options: [
            "Correctness: higher tests are more correct",
            "Speed and diagnosis: higher tests find more real bugs and tell you less about where they are",
            "Cost only",
            "Code coverage distribution",
          ],
          correctIndex: 1,
          explanation:
            "Which is why the right shape depends on your application. A backend whose interesting bugs live in the integration layer is often flatter than the picture suggests.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What makes a test suite valuable?",
      options: [
        "Thousands of tests and high coverage",
        "It catches real regressions quickly, is trustworthy when it passes, and makes failures easy to understand",
        "100% coverage",
        "Full mocking of all dependencies",
      ],
      correctIndex: 1,
      explanation:
        "That standard is what every feature in this day should be judged against. A suite can be large, green and worthless on all three counts.",
    },
    {
      question: "Why import `node:assert/strict` rather than `node:assert`?",
      options: [
        "It is faster",
        "The loose version compares with `==`, so `assert.equal(1, \"1\")` passes and a type bug reports green",
        "It has more assertions",
        "It supports async",
      ],
      correctIndex: 1,
      explanation:
        "One character of import path decides whether your assertions check types at all.",
    },
    {
      question: "`test(\"x\", async () => { doThing(); })` where `doThing` rejects. What is reported?",
      options: [
        "A failure",
        "A pass, because the test returned before the promise settled",
        "A timeout",
        "An unhandled rejection failing the suite",
      ],
      correctIndex: 1,
      explanation:
        "Day 3's floating promise, and the most common way a green suite lies to you. Grep for async tests with no `await` in them.",
    },
    {
      question: "You name a test file `userTests.js`. What happens on `node --test`?",
      options: [
        "It runs",
        "It is silently not run, because discovery is convention-based",
        "Node warns",
        "It errors",
      ],
      correctIndex: 1,
      explanation:
        "A quietly skipped file looks identical to a passing suite, which is why the reported test count is worth reading.",
    },
    {
      question: "Why is a permanently skipped test worse than a failing one?",
      options: [
        "It slows the suite",
        "A skipped test looks like a passing suite in every summary, so the coverage is gone and nobody notices",
        "It breaks coverage",
        "It cannot be removed",
      ],
      correctIndex: 1,
      explanation:
        "You have deleted the test while keeping the file to maintain. Give a skip a reason, an issue, and a deadline.",
    },
    {
      question: "What is the failure mode mocks uniquely produce?",
      options: [
        "Slow tests",
        "The test passes because the mock matched your belief about a dependency, while production breaks because the belief was wrong",
        "Flaky results",
        "Coverage gaps",
      ],
      correctIndex: 1,
      explanation:
        "Mock what you own, use the real thing for what you do not. A mock cannot disagree with you about SQL.",
    },
    {
      question: "A test calls every function in a file and asserts `ok(true)`. What does coverage report?",
      options: ["0%", "100%", "It refuses", "About 50%"],
      correctIndex: 1,
      explanation:
        "Coverage measures which lines ran, not whether anything was checked. Useful as a map of gaps, poor as a target.",
    },
    {
      question: "Your HTTP tests fail intermittently with `EADDRINUSE`. Why?",
      options: [
        "The tests are too fast",
        "A hardcoded port, which collides as soon as two test files or CI jobs run together",
        "A missing `afterEach`",
        "The server is not closed",
      ],
      correctIndex: 1,
      explanation:
        "Day 10's `server.listen(0)` binds a random free port and removes the whole class of flakiness.",
    },
    {
      question: "Your suite passes but the process never exits. What is the likely cause?",
      options: [
        "Too many tests",
        "A missing `after` hook, so an open handle keeps the event loop alive",
        "A skipped test",
        "Mocked timers",
      ],
      correctIndex: 1,
      explanation:
        "Day 4's rule in a test file. `--test-force-exit` makes the symptom disappear and leaves the leak in place.",
    },
  ],
  project: {
    name: "day-13",
    goal: "Write three tests at three levels: a unit test, an integration test against a real database, and a test of a one-hour timeout that runs in a millisecond.",
    brief:
      "The three tests are the point, and each one teaches something the others cannot. The unit test is easy. The integration test is where you find out whether your assumptions about the database were right, which is the whole reason not to mock it. And the timer test is the one that proves mocked time is about determinism, not just speed. Two things will catch you: an async test with no await inside passes without testing anything, and a missing after hook makes the suite pass and then hang.",
    steps: [
      "Create `day-13/` with `package.json` containing `\"type\": \"module\"`, plus `src/` and `test/unit/` and `test/integration/` directories.",
      "Write `validateUser(user)` in `src/user.js` returning whether a user has a name and a valid email.",
      "Write `test/unit/user.test.js` covering a valid user, a missing name, a missing email and a malformed email. Import `node:assert/strict`.",
      "Add `\"test\": \"node --test test/unit\"` and `\"test:integration\": \"node --test test/integration\"` to your scripts.",
      "In `test/integration/database.test.js`, start a real PostgreSQL with Testcontainers in a `before` hook, run a schema migration, and close it in `after`.",
      "Reset the table in `beforeEach`, then insert a user and query it back, asserting the result.",
      "Write `expiresInOneHour(callback)` using `setTimeout` with a one-hour delay.",
      "Test it with `mock.timers.enable()` and `tick(60 * 60 * 1000)`, resetting timers in an `afterEach`.",
      "Run each suite and confirm the reported test count matches what you wrote.",
    ],
    acceptance: [
      "`npm test` runs only the unit tests and passes in well under a second.",
      "`npm run test:integration` starts a real database, runs the tests, and exits on its own without `--test-force-exit`.",
      "The integration test asserts on a value read back from the real database, not from a mock.",
      "The timer test passes in milliseconds while testing an actual one-hour delay.",
      "`mock.timers.reset()` runs in an `afterEach`, and you can say what happens to later tests without it.",
      "Every assertion uses `node:assert/strict`, and you can explain what `node:assert` would have let through.",
      "No async test in the suite is missing an `await`, and you can explain why such a test would pass.",
      "The reported test count matches the number of tests you wrote, proving no file was silently skipped.",
      "The container is started in `before`, not `beforeEach`, and you can say why.",
    ],
    stretch: [
      "Add an HTTP integration test using `server.listen(0)`, and explain what would go wrong with a hardcoded port.",
      "Split `server.js` from `handler.js` and test the handler without opening a port at all.",
      "Write a deliberately worthless test that reaches 100% coverage on a function while asserting nothing, then run `--experimental-test-coverage` to see it.",
      "Add a `mock.fn` interaction test that asserts a payment was charged exactly once with the right amount.",
      "Deliberately forget `mock.restoreAll()` and watch a later test in the same file fail, then explain the ordering.",
      "Run `node --test --test-rerun-failures` with no path, read the error, then run it correctly.",
    ],
  },
};
