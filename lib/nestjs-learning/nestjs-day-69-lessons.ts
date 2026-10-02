import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_69_LESSONS: LessonDay = {
  day: 69,
  title: "Advanced Testing",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-69-lesson-1",
      title: "Coverage",
      durationMinutes: 18,
      explanation: `
<b>Imagine you have written a test suite for your NestJS application.</b> All tests pass. You feel confident. Then a bug slips into production that you never caught. How is that possible? Because passing tests do not mean your tests actually exercised the code that broke. Coverage tells you which parts of your code were executed during tests — and more importantly, which parts were not.

<b>What is test coverage?</b> Coverage is a measurement of how much of your source code is executed when your test suite runs. It is reported as a percentage for four metrics:

- <b>% Stmts (Statements):</b> The percentage of individual executable statements that were run.
- <b>% Branch:</b> The percentage of logic branches (if/else, switch cases, ternaries) that were fully explored. This is the most important metric for complex logic [citation:1].
- <b>% Funcs (Functions):</b> The percentage of defined functions or methods that were called.
- <b>% Lines:</b> The percentage of lines of code that were executed.

<b>Why does coverage exist?</b> Because it exposes "dark zones" — untested branches, functions, or lines where bugs can hide. If a line of code was never executed during tests, you have zero confidence that it works. Coverage is a map of where your tests have been and where they have not [citation:1].

<b>How to generate coverage in Jest.</b> Running coverage is simple:

\`\`\`bash
npm test -- --coverage
\`\`\`

Jest uses Istanbul (nyc) under the hood to instrument your code and track which lines, branches, and functions execute during tests. The output is a \`coverage/\` folder with an HTML report you can open in your browser [citation:1].

<b>Configuring coverage in Jest.</b> You can configure coverage behavior in \`jest.config.js\`:

\`\`\`typescript
module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.test.ts',
    '!src/**/*.spec.ts',
    '!src/main.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
  },
};
\`\`\`

<b>The \`collectCoverageFrom\` array</b> tells Jest which files to include in the coverage report. Excluding test files, entry points, modules, and DTOs focuses coverage on the business logic that actually matters [citation:1].

<b>Coverage thresholds: quality gates for CI.</b> The \`coverageThreshold\` configuration enforces minimum coverage percentages. If coverage drops below the threshold, Jest exits with a non-zero code, failing the test run. This is how you prevent coverage regression in CI [citation:7][citation:12].

\`\`\`typescript
coverageThreshold: {
  global: {
    branches: 80,
    functions: 85,
    lines: 85,
    statements: 85,
  },
  './src/modules/orders/': {
    branches: 90,
    functions: 90,
    lines: 90,
  },
}
\`\`\`

Notice the per-directory threshold. Critical modules (like orders or payments) can have stricter thresholds than the global default [citation:7].

<b>Reading the HTML report.</b> Open \`coverage/lcov-report/index.html\` in your browser. You will see a color-coded breakdown [citation:1]:

- <b>Green:</b> Fully covered.
- <b>Yellow:</b> Partially covered (e.g. an \`if\` branch was tested but the \`else\` was not).
- <b>Red:</b> Not covered at all.

Click on any file to see line-by-line coverage. Uncovered lines are highlighted in red, showing exactly where tests are missing.

<b>Ignoring specific lines.</b> Some lines are impossible or unnecessary to test (defensive \`else\` blocks, environment checks). Use Istanbul ignore comments:

\`\`\`typescript
/* istanbul ignore next */
if (process.env.NODE_ENV === 'production') {
  // This block is excluded from coverage.
}
\`\`\`

<b>The critical caveat: coverage ≠ quality.</b> A project with 100% coverage can still have bugs. Coverage only tells you that code was <i>executed</i>, not that it was <i>verified</i>. A test that calls a function but never asserts on its output gives you 100% coverage with zero confidence. This is why mutation testing exists (lesson 2) — it verifies that your tests actually catch bugs [citation:1].

<b>What can go wrong?</b>
- <b>Chasing 100% coverage.</b> A project with 80-90% coverage is usually healthier than one with 100% that uses meaningless tests just to hit the number [citation:1].
- <b>Ignoring branch coverage.</b> Branch coverage is where bugs hide. An \`if\` without an \`else\` test means half the logic is unverified [citation:1].
- <b>Covering boilerplate.</b> Auto-generated code, type definitions, and third-party libraries should be excluded from coverage. Focus on business logic [citation:1].
- <b>No CI enforcement.</b> Without a coverage threshold in CI, coverage silently drops over time. Add a quality gate [citation:7].
- <b>Trusting coverage alone.</b> A test that executes code without asserting on behavior is worthless. Use mutation testing to verify test quality.

<b>How this appears in a real project.</b> A mature NestJS project has:
- \`jest.config.js\` with \`collectCoverageFrom\` excluding boilerplate.
- \`coverageThreshold\` set at 80% global with stricter thresholds for critical modules.
- CI that fails if coverage drops below threshold.
- A coverage badge in the README generated by Codecov or Coveralls [citation:7].
- A policy of 80-90% coverage for business logic, not 100% everywhere.

<b>How experienced engineers think.</b> Coverage is a diagnostic tool, not a goal. Use it to find untested code, prioritize where to write tests, and prevent regression. But never confuse coverage with quality — a test that does not assert is worse than no test because it gives false confidence.
      `,
      diagram: `
Jest Coverage Workflow

  Source code (src/**/*.ts)
        |
        |  Istanbul instruments the code
        v
  Test suite runs
        |
        |  Each line/branch/function is tracked
        v
  coverage/ folder generated
        |
        +-- lcov-report/index.html   <- Human-readable report
        +-- coverage-final.json      <- Machine-readable data
        +-- lcov.info                <- For CI tools (Codecov)

  Coverage metrics:
    Statements:  85%
    Branches:    80%   <- Most important
    Functions:   90%
    Lines:       85%

  Thresholds (jest.config.js):
    coverageThreshold: {
      global: {
        branches: 80,
        functions: 85,
        lines: 85,
        statements: 85,
      },
    }

  CI quality gate:
    npm test -- --coverage
      |
      +-- Coverage >= threshold -> exit 0 (pass)
      |
      +-- Coverage < threshold  -> exit 1 (fail)

  Caveat:
    Coverage != Quality.
    100% coverage can still have bugs.
    Use mutation testing to verify test quality.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// COVERAGE IN JEST
// ============================================

// ---------- 1. package.json scripts ----------
// {
//   "scripts": {
//     "test": "jest",
//     "test:cov": "jest --coverage",
//     "test:cov:watch": "jest --coverage --watch"
//   }
// }

// ---------- 2. jest.config.ts ----------
import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\\\.spec\\\\.ts$',
  transform: { '^.+\\\\.(t|j)s$': 'ts-jest' },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/*.spec.ts',
    '!**/*.module.ts',
    '!**/main.ts',
    '!**/dto/**',
    '!**/entities/**',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 85,
      statements: 85,
    },
    // Stricter thresholds for critical modules.
    './modules/orders/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;

// ---------- 3. Running coverage ----------
// npm test -- --coverage
//
// Output example:
// ---------------------------|---------|----------|---------|---------|-------------------
// File                       | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
// ---------------------------|---------|----------|---------|---------|-------------------
// All files                  |   85.71 |    80.00 |   90.00 |   85.71 |
//  users.service.ts          |   92.31 |    85.71 |  100.00 |   92.31 | 45-48
//  orders.service.ts         |   78.57 |    75.00 |   80.00 |   78.57 | 23,56-60
// ---------------------------|---------|----------|---------|---------|-------------------

// ---------- 4. Ignoring specific lines ----------
// Sometimes a line is defensive and impossible to test.
export class ConfigService {
  getDatabaseUrl(): string {
    /* istanbul ignore next */
    if (process.env.NODE_ENV === 'test') {
      return 'postgres://localhost/test';
    }
    return process.env.DATABASE_URL!;
  }
}

// Ignore a branch:
/* istanbul ignore else */
if (condition) {
  doSomething();
}

// Ignore a function:
/* istanbul ignore next */
function neverCalledInTests() {}

// ---------- 5. CI integration (GitHub Actions) ----------
// .github/workflows/test.yml
//
// name: Test
// on: [push, pull_request]
// jobs:
//   test:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with: { node-version: 20 }
//       - run: npm ci
//       - run: npm test -- --coverage
//       - name: Upload coverage to Codecov
//         uses: codecov/codecov-action@v4
//         with:
//           token: \${{ secrets.CODECOV_TOKEN }}
//           files: ./coverage/lcov.info

// ---------- 6. Per-file coverage thresholds ----------
// You can enforce different thresholds for different parts of the codebase.
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
  './src/modules/auth/': {
    branches: 95,
    functions: 95,
    lines: 95,
    statements: 95,
  },
  './src/modules/payments/': {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}

// ---------- 7. What NOT to do ----------
// BAD: writing meaningless tests to hit 100%.
// it('covers line 45', () => {
//   service.someMethod(); // No assertion!
// });

// GOOD: test behavior with assertions.
it('should throw NotFoundException when user does not exist', async () => {
  await expect(service.findById(999)).rejects.toThrow(NotFoundException);
});
      ` },
      keyTakeaways: [
        "Coverage measures how much of your code is executed during tests — it exposes untested \"dark zones\".",
        "Jest uses Istanbul to generate coverage. Run with `npm test -- --coverage`.",
        "The four metrics are statements, branches, functions, and lines. Branch coverage is the most important for logic.",
        "Use `coverageThreshold` in `jest.config.js` to enforce minimum coverage and fail CI on regression.",
        "Exclude boilerplate (test files, modules, DTOs, entities) from `collectCoverageFrom` to focus on business logic.",
        "Coverage ≠ quality. 100% coverage with weak tests is worse than 80% with meaningful assertions.",
        "Use `/* istanbul ignore */` comments sparingly for defensive code that cannot be tested.",
      ],
      commonMistakes: [
        "<b>Chasing 100% coverage.</b> A project with 80-90% coverage is usually healthier than one with 100% using meaningless tests [citation:1].",
        "<b>Ignoring branch coverage.</b> Branch coverage is where bugs hide. An `if` without an `else` test means half the logic is unverified [citation:1].",
        "<b>Covering boilerplate.</b> Auto-generated code, type definitions, and modules should be excluded. Focus on business logic [citation:1].",
        "<b>No CI enforcement.</b> Without a coverage threshold, coverage drops silently over time. Add a quality gate in CI [citation:7].",
        "<b>Trusting coverage alone.</b> Coverage tells you code was executed, not that it was verified. Use mutation testing to check test quality.",
        "<b>Not reading the HTML report.</b> The terminal summary is useful, but the HTML report shows exactly which lines are uncovered.",
      ],
      quiz: [
        {
          question:
            "Which coverage metric is considered the most important for catching logic bugs?",
          options: [
            "% Statements",
            "% Branch",
            "% Functions",
            "% Lines",
          ],
          correctIndex: 1,
          explanation:
            "Branch coverage tracks whether both sides of `if/else`, `switch` cases, and ternaries were tested. Bugs most frequently hide in untested branches [citation:1].",
        },
        {
          question:
            "What does it mean when a coverage report shows a line highlighted in yellow?",
          options: [
            "The line has a syntax error.",
            "The line was partially covered — for example, one branch of an `if` was tested but the other was not.",
            "The line was executed but not asserted on.",
            "The line is excluded from coverage.",
          ],
          correctIndex: 1,
          explanation:
            "Yellow indicates partial coverage. This often means a branch was only partially explored — a common source of hidden bugs [citation:1].",
        },
        {
          question:
            "How do you enforce a minimum coverage threshold in Jest?",
          options: [
            "By adding a comment at the top of each test file.",
            "By configuring `coverageThreshold` in `jest.config.js`.",
            "By running `npm test -- --coverage`.",
            "By installing a third-party plugin.",
          ],
          correctIndex: 1,
          explanation:
            "The `coverageThreshold` configuration in `jest.config.js` enforces minimum coverage percentages. Jest exits with a non-zero code if coverage drops below the threshold, failing CI [citation:7][citation:12].",
        },
        {
          question:
            "Why is 100% coverage not the same as a high-quality test suite?",
          options: [
            "Because coverage tools are unreliable.",
            "Because a test can execute code without asserting on its behavior, giving 100% coverage with zero confidence.",
            "Because 100% coverage is impossible to achieve.",
            "Because coverage only measures lines, not branches.",
          ],
          correctIndex: 1,
          explanation:
            "Coverage measures execution, not verification. A test that calls a function but never asserts on its output achieves 100% coverage while providing no confidence. Mutation testing (lesson 2) verifies test quality [citation:1].",
        },
      ],
    },
    {
      id: "day-69-lesson-2",
      title: "Mutation Testing",
      durationMinutes: 22,
      explanation: `
<b>You have 85% coverage. Your tests pass. But are your tests actually good?</b> Coverage tells you that code was executed. It does not tell you that your tests would catch a bug if one were introduced. A test that calls a function but never asserts on its output gives you coverage with zero confidence.

This is the gap that <b>mutation testing</b> fills. It answers the question: "If I introduce a bug into my code, will my tests catch it?"

<b>How mutation testing works.</b> The tool makes a small, deliberate change to your source code — a "mutation." For example:
- Changing \`>\` to \`>=\`
- Changing \`+\` to \`-\`
- Changing \`&&\` to \`||\`
- Removing a function call
- Replacing a return value with \`null\`

Then it runs your test suite against the mutated code. If the tests fail, the mutant is <b>killed</b> (good — your tests caught the bug). If the tests pass, the mutant <b>survived</b> (bad — your tests did not detect the bug) [citation:18].

<b>The mutation score</b> is the percentage of mutants killed:

\`\`\`
mutation score = killed mutants / total mutants × 100
\`\`\`

A high mutation score means your tests are sensitive to changes in behavior. A low score means your tests are weak — they pass even when the code is broken [citation:18].

<b>Why mutation testing exists.</b> Because coverage alone is a misleading metric. A test suite with 95% coverage can have a 40% mutation score if the tests do not assert on the right things. Mutation testing verifies that your tests actually verify your code [citation:1].

<b>Stryker: the mutation testing tool for JavaScript/TypeScript.</b> Stryker is the de facto standard for mutation testing in the JS/TS ecosystem. Install it:

\`\`\`bash
npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner @stryker-mutator/typescript-checker
\`\`\`

Initialize the configuration:

\`\`\`bash
npx stryker init
\`\`\`

This creates a \`stryker.config.json\` file. A minimal configuration for a NestJS project:

\`\`\`json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "checkers": ["typescript"],
  "tsconfigFile": "tsconfig.json",
  "mutate": ["src/**/*.ts", "!src/**/*.spec.ts", "!src/**/*.module.ts", "!src/main.ts"],
  "thresholds": {
    "high": 80,
    "low": 60,
    "break": 50
  }
}
\`\`\`

<b>The \`coverageAnalysis: "perTest"\` option</b> is critical for performance. It tells Stryker to run only the tests that cover a specific mutant, rather than the entire test suite for every mutation. This can reduce the run time by 90% or more [citation:2][citation:18].

<b>The \`checkers: ["typescript"]\` option</b> tells Stryker to skip mutants that cause TypeScript compilation errors. A mutant that does not compile is not a valid test of your test suite, so Stryker ignores it [citation:18].

<b>Running mutation testing.</b>

\`\`\`bash
npx stryker run
\`\`\`

Stryker generates an HTML report at \`reports/mutation/html/index.html\`. The report shows each mutant color-coded [citation:18]:

- <b>Killed (green):</b> A test failed when the mutant was injected. Your tests caught the bug.
- <b>Survived (red):</b> All tests passed with the mutant in place. Your tests missed the bug. This requires action.
- <b>No Coverage (orange):</b> No test runs the mutated line. Add a test.
- <b>Timeout (yellow):</b> The mutant caused an infinite loop or very slow path.
- <b>Ignored / Equivalent (grey):</b> Suppressed or functionally equivalent to the original.

<b>Reading a surviving mutant.</b> The most valuable output is the list of surviving mutants. For each one, you see:
- The file and line number.
- The original code and the mutated code.
- The tests that ran (and passed).

For example, if the mutation changed \`>\` to \`>=\` and the mutant survived, it means your tests do not check the boundary condition. Add a test that covers the exact boundary.

<b>Incremental mode.</b> Mutation testing is slow — Stryker runs your test suite once per mutant. For a large project with hundreds of mutants, the first run can take hours. Use incremental mode to only test mutants in changed files:

\`\`\`bash
npx stryker run --incremental
\`\`\`

Stryker stores state in \`.stryker-tmp/incremental.json\`. On subsequent runs, it skips mutants in unchanged files and mutants already killed. Commit this file to share the cache across CI runs [citation:18].

<b>Suppressing equivalent mutants.</b> Some mutants are functionally equivalent to the original (e.g. changing a version string). Use Stryker disable comments to suppress them:

\`\`\`typescript
// Stryker disable next-line all: version string, not logic
const VERSION = "1.2.3";
\`\`\`

<b>What can go wrong?</b>
- <b>Running mutation testing on the entire codebase on every commit.</b> It is slow. Use incremental mode or run it nightly [citation:18].
- <b>No coverage analysis.</b> Without \`coverageAnalysis: "perTest"\`, Stryker runs the full test suite for every mutant, which is 10-100x slower [citation:2].
- <b>Chasing 100% mutation score.</b> Some mutants are equivalent and cannot be killed. Aim for 80-90% on business logic [citation:18].
- <b>Ignoring surviving mutants.</b> The surviving mutants are the most valuable output. Each one represents a gap in your test suite.
- <b>Not using TypeScript checker.</b> Without it, Stryker wastes time on mutants that do not compile [citation:18].
- <b>Running on boilerplate.</b> Exclude modules, DTOs, and entities from \`mutate\`. Focus on business logic.

<b>How this appears in a real project.</b> A NestJS project runs mutation testing:
- Nightly on the full codebase.
- Incremental on PRs (only changed files).
- With \`coverageAnalysis: "perTest"\` for speed.
- With a mutation score threshold of 70% that fails CI if it drops.
- With an HTML report published as a CI artifact for review.

<b>How experienced engineers think.</b> Coverage tells you what your tests touched. Mutation testing tells you what your tests actually verified. If you only have time for one quality metric, mutation score is more meaningful than coverage. It catches the "tests that do not test" problem that coverage hides [citation:18].
      `,
      diagram: `
Mutation Testing Workflow

  Source code (src/orders.service.ts)
        |
        |  Stryker creates mutants:
        |    >  -> >=
        |    +  -> -
        |    && -> ||
        |    return x -> return null
        v
  For each mutant:
        |
        |  Run the tests that cover that line
        |  (coverageAnalysis: "perTest")
        v
  +-------------------+
  |  Tests fail?      |
  +-------------------+
        |
        +-- YES --> MUTANT KILLED (good)
        |
        +-- NO  --> MUTANT SURVIVED (bad)

  Mutation score:
    killed / total * 100

  Report (reports/mutation/html/index.html):
    Killed (green)     -> tests caught the bug
    Survived (red)     -> tests missed the bug -> fix test
    No Coverage (orange) -> no test runs this line
    Timeout (yellow)   -> mutant caused infinite loop
    Ignored (grey)     -> suppressed or equivalent

  Example surviving mutant:
    Original:  if (order.total > 100) { discount = 0.1; }
    Mutant:    if (order.total >= 100) { discount = 0.1; }
    Survived -> your tests do not check the boundary at 100.
    Fix: add a test for order.total === 100.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// MUTATION TESTING WITH STRYKER
// ============================================

// ---------- 1. Install ----------
// npm install --save-dev @stryker-mutator/core @stryker-mutator/jest-runner @stryker-mutator/typescript-checker

// ---------- 2. Initialize ----------
// npx stryker init
// Choose "jest" as the test runner and "typescript" as the checker.

// ---------- 3. stryker.config.json ----------
// {
//   "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
//   "packageManager": "npm",
//   "reporters": ["html", "clear-text", "progress"],
//   "testRunner": "jest",
//   "coverageAnalysis": "perTest",
//   "checkers": ["typescript"],
//   "tsconfigFile": "tsconfig.json",
//   "mutate": [
//     "src/**/*.ts",
//     "!src/**/*.spec.ts",
//     "!src/**/*.module.ts",
//     "!src/main.ts",
//     "!src/**/dto/**",
//     "!src/**/entities/**"
//   ],
//   "thresholds": {
//     "high": 80,
//     "low": 60,
//     "break": 50
//   },
//   "timeoutMS": 10000
// }

// ---------- 4. Running mutation tests ----------
// Full run (slow):
// npx stryker run

// Incremental (only changed files):
// npx stryker run --incremental

// Scope to a single file:
// npx stryker run --mutate "src/modules/orders/orders.service.ts"

// ---------- 5. Example: a service with a survivable mutant ----------
export class OrderService {
  calculateDiscount(total: number): number {
    if (total > 100) {
      return total * 0.1;
    }
    return 0;
  }
}

// Stryker mutant: total > 100  ->  total >= 100
// If the mutant survives, it means no test checks the boundary at exactly 100.

// A test that kills this mutant:
describe('OrderService.calculateDiscount', () => {
  it('should return 0 for a total of exactly 100', () => {
    expect(service.calculateDiscount(100)).toBe(0);
  });

  it('should return 10% for a total above 100', () => {
    expect(service.calculateDiscount(101)).toBeCloseTo(10.1);
  });
});

// With the boundary test, the mutant is killed.

// ---------- 6. Suppressing equivalent mutants ----------
export class UserService {
  // Stryker disable next-line StringLiteral: version string, not logic
  private readonly VERSION = '1.2.3';

  // Stryker disable all: this method is deprecated
  legacyMethod() {
    return 'legacy';
  }
  // Stryker restore all

  getVersion(): string {
    return this.VERSION;
  }
}

// ---------- 7. CI integration (GitHub Actions) ----------
// .github/workflows/mutation.yml
//
// name: Mutation Testing
// on:
//   schedule:
//     - cron: '0 2 * * *'  # Nightly at 2 AM
//   workflow_dispatch:
// jobs:
//   mutation:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - uses: actions/setup-node@v4
//         with: { node-version: 20 }
//       - run: npm ci
//       - run: npx stryker run
//       - uses: actions/upload-artifact@v4
//         with:
//           name: mutation-report
//           path: reports/mutation/

// ---------- 8. Reading the report ----------
// Open reports/mutation/html/index.html
//
// Example output:
// All files                  | 82.35 | 71.43 | 85.00 | 82.35 |
//  orders.service.ts         | 90.00 | 80.00 | 100.00 | 90.00 |
//  users.service.ts          | 75.00 | 62.50 | 70.00 | 75.00 |
//
// Surviving mutants in users.service.ts:
//   Line 45: original ">" mutated to ">="  (survived)
//   Line 67: original "&&" mutated to "||" (survived)

// ---------- 9. package.json scripts ----------
// {
//   "scripts": {
//     "test:mutation": "stryker run",
//     "test:mutation:incremental": "stryker run --incremental"
//   }
// }

// ---------- 10. What NOT to do ----------
// BAD: running full mutation testing on every commit.
// It is slow (minutes to hours). Run incrementally or nightly.

// BAD: ignoring surviving mutants.
// Each survivor is a test gap. Fix them or suppress with justification.

// BAD: chasing 100% mutation score.
// Some mutants are equivalent. Aim for 80-90% on business logic.
      ` },
      keyTakeaways: [
        "Mutation testing verifies that your tests actually catch bugs by introducing small changes to the source code and checking if tests fail.",
        "The mutation score (killed / total) measures test quality — higher is better, but 100% is not the goal.",
        "Stryker is the standard tool for JS/TS mutation testing. Configure with `coverageAnalysis: \"perTest\"` for speed.",
        "Surviving mutants reveal gaps in your test suite — each one represents a bug your tests would miss.",
        "Use `--incremental` to only test changed files, making mutation testing practical for CI.",
        "Exclude boilerplate (modules, DTOs, entities) from mutation to focus on business logic.",
        "Run mutation testing nightly on the full codebase and incrementally on PRs.",
      ],
      commonMistakes: [
        "<b>No coverage analysis.</b> Without `coverageAnalysis: \"perTest\"`, Stryker runs the full test suite for every mutant, which is 10-100x slower [citation:2].",
        "<b>Running on every commit.</b> Full mutation testing is slow. Use incremental mode or run it nightly [citation:18].",
        "<b>Ignoring surviving mutants.</b> Each survivor is a gap in your test suite. Fix them by adding assertions.",
        "<b>Chasing 100% mutation score.</b> Some mutants are equivalent and cannot be killed. Aim for 80-90% on business logic [citation:18].",
        "<b>Not using TypeScript checker.</b> Without it, Stryker wastes time on mutants that do not compile [citation:18].",
        "<b>Mutating boilerplate.</b> Exclude modules, DTOs, and entities from `mutate`. Focus on services and business logic.",
      ],
      quiz: [
        {
          question:
            "What does a 'surviving mutant' mean in mutation testing?",
          options: [
            "The mutant caused a TypeScript compilation error.",
            "All tests passed even with the mutated code, meaning your tests did not detect the bug.",
            "The mutant was killed by a test failure.",
            "The mutant was suppressed.",
          ],
          correctIndex: 1,
          explanation:
            "A surviving mutant means your tests passed despite the introduced bug. This reveals a gap in your test suite — the tests do not verify that behavior [citation:18].",
        },
        {
          question:
            "Why is mutation testing considered more meaningful than coverage alone?",
          options: [
            "Because it runs faster.",
            "Because coverage only measures execution, while mutation testing verifies that tests actually detect bugs.",
            "Because mutation testing is required by CI.",
            "Because coverage is deprecated.",
          ],
          correctIndex: 1,
          explanation:
            "Coverage tells you code was executed. Mutation testing tells you tests would catch a bug if one were introduced. A test that calls a function but never asserts gives coverage without confidence [citation:18].",
        },
        {
          question:
            "What does `coverageAnalysis: \"perTest\"` do in Stryker?",
          options: [
            "It measures coverage of the test files.",
            "It runs only the tests that cover a specific mutant, dramatically reducing run time.",
            "It generates a coverage report.",
            "It enables incremental mode.",
          ],
          correctIndex: 1,
          explanation:
            "`perTest` coverage analysis maps each mutant to the tests that cover its line. Stryker then runs only those tests, reducing the run time by 90% or more [citation:2][citation:18].",
        },
        {
          question:
            "You run mutation testing and see a surviving mutant that changed `total > 100` to `total >= 100`. What should you do?",
          options: [
            "Suppress the mutant with a Stryker disable comment.",
            "Ignore it — it is an equivalent mutant.",
            "Add a test that checks the boundary at exactly `total === 100`.",
            "Delete the mutant from the report.",
          ],
          correctIndex: 2,
          explanation:
            "The mutant survived because no test checks the exact boundary value of 100. Add a test for `total = 100` to kill the mutant and close the gap in your test suite.",
        },
      ],
    },
    {
      id: "day-69-lesson-3",
      title: "Parallel Testing and CI Optimization",
      durationMinutes: 22,
      explanation: `
<b>Your test suite started small.</b> Twenty tests, two seconds. Then it grew. A hundred tests, ten seconds. Then a thousand tests, five minutes. Now it is ten minutes, and your team is waiting fifteen minutes for CI to finish on every pull request. Developers stop running tests locally because they are too slow. Bugs slip through.

<b>Parallel testing</b> is the solution. Instead of running tests one after another on a single machine, you split them across multiple workers or CI nodes and run them simultaneously. A ten-minute test suite becomes two minutes across five workers [citation:4][citation:9].

<b>Why tests are parallelizable.</b> In a well-written test suite, each test is isolated — it does not depend on the state left by other tests. That isolation is exactly what makes parallelization possible. If test A and test B do not share state, they can run at the same time without interfering [citation:4].

<b>Parallelism within a single machine: Jest workers.</b> Jest has built-in support for parallel test execution. By default, it runs tests in parallel across worker processes:

\`\`\`bash
jest --maxWorkers=4
\`\`\`

Or in \`jest.config.js\`:

\`\`\`typescript
module.exports = {
  maxWorkers: '50%', // Use half the available CPU cores
};
\`\`\`

Each worker runs a subset of test files. Jest distributes files across workers, and each worker runs its assigned files sequentially. This is the simplest form of parallelization and requires no CI changes [citation:4].

<b>Parallelism across machines: test sharding.</b> When a single machine is not enough, you split tests across multiple CI nodes. This is called <b>sharding</b>. There are two approaches:

<b>1. Static sharding.</b> Split the test files into N groups at the start. Each CI node runs its assigned group. Simple but can be unbalanced — one node might get all the slow tests.

\`\`\`bash
# Node 1 of 3
jest --shard=1/3

# Node 2 of 3
jest --shard=2/3

# Node 3 of 3
jest --shard=3/3
\`\`\`

<b>2. Dynamic sharding.</b> Test files are pushed to a shared queue (like Redis). Each CI node pulls the next batch of files, runs them, and repeats until the queue is empty. This balances load automatically — fast nodes do more work, slow nodes do less [citation:3].

Tools like <b>specbandit</b> implement this pattern. A single CI job pushes all test file paths to a Redis list. Multiple worker jobs atomically steal batches and run them:

\`\`\`bash
# Push phase (one job)
specbandit push --key pr-123 --pattern 'test/**/*.test.ts'

# Work phase (multiple jobs)
specbandit work --key pr-123 --command "npx jest" --batch-size 10
\`\`\`

Each worker loops: pop a batch from Redis, run Jest on those files, repeat until the queue is empty. \`LPOP\` with a count argument is atomic, so multiple workers never receive the same file [citation:3].

<b>3. Intelligent sharding.</b> Tools like <b>Knapsack Pro</b> and <b>Datadog Test Parallelization</b> track test execution times and distribute files based on historical data. This ensures each CI node gets roughly the same amount of work, minimizing the slowest-node bottleneck [citation:4][citation:9].

Datadog's approach:
1. Run \`ddtest plan\` once to create a plan file.
2. Share the plan with each CI job.
3. Run \`ddtest run --ci-node <N>\` on each job. Only the assigned files run [citation:4].

<b>CI optimization strategies beyond parallelism.</b>

<b>1. Test Impact Analysis (TIA).</b> Skip tests that are not affected by a code change. If you change \`users.service.ts\`, you do not need to run the entire payment test suite. Tools like Datadog TIA and Jest's \`--changedSince\` flag implement this [citation:4].

\`\`\`bash
# Only run tests related to files changed since main.
jest --changedSince=main
\`\`\`

<b>2. Caching dependencies.</b> Use CI caching for \`node_modules\` and build artifacts. GitHub Actions cache, for example, can restore \`node_modules\` from a previous run:

\`\`\`yaml
- uses: actions/cache@v4
  with:
    path: node_modules
    key: \${{ hashFiles('package-lock.json') }}
\`\`\`

<b>3. Fail fast.</b> Use \`--bail\` to stop on the first test failure. There is no point running the remaining tests if the build is already broken.

\`\`\`bash
jest --bail
\`\`\`

<b>4. Selective test runs.</b> Run unit tests on every commit, integration tests on every PR, and E2E tests nightly or before release. Not every commit needs the full suite.

<b>5. Optimize test startup.</b> Each Jest worker has startup overhead. Reduce it by:
- Using \`ts-jest\` with \`isolatedModules: true\` for faster TypeScript compilation.
- Avoiding heavy setup in \`beforeAll\` that runs on every worker.
- Sharing expensive resources (like database containers) across test files with \`globalSetup\` [citation:3].

<b>What can go wrong?</b>
- <b>Tests are not isolated.</b> If tests share state (files, database rows, global variables), parallelization causes flaky failures. Fix isolation first.
- <b>Static sharding is unbalanced.</b> One node gets all the slow tests and becomes the bottleneck. Use dynamic sharding for better balance [citation:3].
- <b>Too many workers.</b> Each Jest worker is a Node process with memory overhead. Running 16 workers on a machine with 4 cores causes thrashing. Use \`maxWorkers: '50%'\` [citation:4].
- <b>Shared database conflicts.</b> If multiple test files run against the same database, they interfere. Use per-worker databases or transactions.
- <b>Ignoring the slowest test.</b> One 30-second test in an otherwise 2-second suite dominates the total time. Profile and fix slow tests before adding more parallelism.
- <b>No caching in CI.</b> Reinstalling \`node_modules\` on every run wastes minutes. Cache it.

<b>How this appears in a real project.</b> A NestJS project with 800 test files uses:
- Jest with \`maxWorkers: '50%'\` for local development.
- Dynamic sharding across 5 CI nodes using specbandit and Redis.
- \`--changedSince=main\` to skip unaffected tests on PRs.
- \`node_modules\` caching in GitHub Actions.
- A nightly full run for complete coverage.

The test suite that once took 12 minutes now finishes in under 3 minutes on every PR [citation:3][citation:4].

<b>How experienced engineers think.</b> Test speed is a developer experience issue. Slow tests mean developers stop running them, which means bugs slip through. Parallelization is not just a CI optimization — it is a way to keep tests useful. But parallelism only works if tests are isolated. Fix isolation first, then parallelize.
      `,
      diagram: `
Parallel Testing Strategies

  Local (single machine):
    Jest --maxWorkers=4
      |
      +-- Worker 1: file-a.test.ts, file-d.test.ts
      +-- Worker 2: file-b.test.ts, file-e.test.ts
      +-- Worker 3: file-c.test.ts, file-f.test.ts
      +-- Worker 4: file-g.test.ts, file-h.test.ts

  CI (static sharding):
    Job 1 (shard 1/3): test-a, test-d, test-g
    Job 2 (shard 2/3): test-b, test-e, test-h
    Job 3 (shard 3/3): test-c, test-f, test-i
    (Unbalanced — one job may get all slow tests)

  CI (dynamic sharding with Redis):
    Push phase (1 job):
      RPUSH test-queue test-a test-b ... test-z

    Work phase (N jobs):
      Job 1: LPOP 5 -> run -> LPOP 5 -> run ...
      Job 2: LPOP 5 -> run -> LPOP 5 -> run ...
      Job 3: LPOP 5 -> run -> ...
    (Balanced automatically)

  CI optimization techniques:
    - Test Impact Analysis: skip unaffected tests
    - Caching: restore node_modules
    - Fail fast: --bail
    - Selective runs: unit on commit, e2e nightly
    - Faster startup: isolatedModules, shared containers
      `,
      codeExample: { title: "Example", code: `
// ============================================
// PARALLEL TESTING AND CI OPTIMIZATION
// ============================================

// ---------- 1. Jest parallel workers ----------
// package.json
// {
//   "scripts": {
//     "test": "jest --maxWorkers=50%",
//     "test:ci": "jest --maxWorkers=2 --ci"
//   }
// }

// jest.config.ts
export default {
  maxWorkers: '50%', // Use half the available cores
  // ...
};

// ---------- 2. Static sharding with Jest ----------
// On CI node 1 of 3:
// npx jest --shard=1/3
//
// On CI node 2 of 3:
// npx jest --shard=2/3
//
// On CI node 3 of 3:
// npx jest --shard=3/3

// GitHub Actions matrix example:
// jobs:
//   test:
//     strategy:
//       matrix:
//         shard: [1, 2, 3]
//     steps:
//       - run: npx jest --shard=\${{ matrix.shard }}/3

// ---------- 3. Dynamic sharding with specbandit ----------
// Push phase (one job):
// npx specbandit push --key pr-123 --pattern 'test/**/*.test.ts'

// Work phase (N jobs):
// npx specbandit work --key pr-123 --command "npx jest" --batch-size 10

// GitHub Actions example:
// jobs:
//   push-tests:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - run: npm ci
//       - run: npx specbandit push --key "pr-\${{ github.event.number }}" --pattern 'test/**/*.test.ts'
//         env:
//           SPECBANDIT_REDIS_URL: \${{ secrets.REDIS_URL }}
//
//   run-tests:
//     needs: push-tests
//     strategy:
//       matrix:
//         runner: [1, 2, 3, 4]
//     steps:
//       - uses: actions/checkout@v4
//       - run: npm ci
//       - run: npx specbandit work --key "pr-\${{ github.event.number }}" --command "npx jest" --batch-size 5
//         env:
//           SPECBANDIT_REDIS_URL: \${{ secrets.REDIS_URL }}

// ---------- 4. Test Impact Analysis ----------
// Only run tests affected by changed files.
// jest --changedSince=main

// ---------- 5. CI caching (GitHub Actions) ----------
// - uses: actions/cache@v4
//   with:
//     path: node_modules
//     key: \${{ runner.os }}-node-\${{ hashFiles('package-lock.json') }}
//     restore-keys: |
//       \${{ runner.os }}-node-

// ---------- 6. Fail fast ----------
// jest --bail

// ---------- 7. Faster TypeScript compilation ----------
// jest.config.ts
export default {
  transform: {
    '^.+\\\\.(t|j)s$': ['ts-jest', { isolatedModules: true }],
  },
};

// ---------- 8. Shared containers across test files (globalSetup) ----------
// jest.globalSetup.ts
import { PostgreSqlContainer } from '@testcontainers/postgresql';

export default async function globalSetup() {
  const container = await new PostgreSqlContainer('postgres:16-alpine').start();
  process.env.TEST_DATABASE_URL = container.getConnectionUri();
  (global as any).__POSTGRES_CONTAINER__ = container;
}

// jest.globalTeardown.ts
export default async function globalTeardown() {
  const container = (global as any).__POSTGRES_CONTAINER__;
  await container?.stop();
}

// jest.config.ts
export default {
  globalSetup: './jest.globalSetup.ts',
  globalTeardown: './jest.globalTeardown.ts',
};

// ---------- 9. Per-worker database isolation ----------
// When running tests in parallel against a shared database,
// each worker needs its own database or schema.
// Use JEST_WORKER_ID to create a per-worker database.

// test/setup-each.ts
import { DataSource } from 'typeorm';

const workerId = process.env.JEST_WORKER_ID;
const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.TEST_DATABASE_URL,
  schema: \`test_worker_\${workerId}\`, // Each worker uses its own schema
});

// ---------- 10. CI pipeline summary ----------
// On every commit:
//   - npm test --changedSince=main --maxWorkers=2 --bail
//
// On every PR:
//   - npm test --changedSince=main --shard=\${{ matrix.shard }}/4
//
// Nightly:
//   - npm test --coverage
//   - npm run test:mutation
      ` },
      keyTakeaways: [
        "Parallel testing splits tests across workers or CI nodes, reducing total run time.",
        "Jest supports parallel workers locally with `maxWorkers`, and sharding across CI nodes with `--shard`.",
        "Dynamic sharding (specbandit, Knapsack Pro, Datadog) balances load automatically by assigning files from a shared queue.",
        "Test Impact Analysis skips tests unaffected by code changes, further reducing CI time.",
        "Cache `node_modules` in CI to avoid reinstalling dependencies on every run.",
        "Use `--bail` to fail fast and stop on the first test failure.",
        "Parallelization only works if tests are isolated — fix state leakage before scaling workers.",
      ],
      commonMistakes: [
        "<b>Tests are not isolated.</b> Shared state (database rows, files, globals) causes flaky failures when tests run in parallel. Fix isolation first [citation:4].",
        "<b>Static sharding is unbalanced.</b> One node gets all the slow tests and becomes the bottleneck. Use dynamic sharding for better balance [citation:3].",
        "<b>Too many workers.</b> Each Jest worker is a Node process. Running 16 workers on 4 cores causes thrashing. Use `maxWorkers: '50%'` [citation:4].",
        "<b>Shared database conflicts.</b> Multiple test files running against the same database interfere. Use per-worker schemas or transactions.",
        "<b>No caching in CI.</b> Reinstalling `node_modules` wastes minutes. Cache it.",
        "<b>Ignoring the slowest test.</b> One 30-second test dominates the total time. Profile and fix slow tests.",
      ],
      quiz: [
        {
          question:
            "What is the difference between static and dynamic sharding?",
          options: [
            "Static sharding uses Redis; dynamic sharding does not.",
            "Static sharding splits tests into fixed groups; dynamic sharding assigns tests from a shared queue, balancing load automatically.",
            "Static sharding is faster than dynamic sharding.",
            "Dynamic sharding requires more CI nodes.",
          ],
          correctIndex: 1,
          explanation:
            "Static sharding pre-assigns test files to nodes, which can be unbalanced. Dynamic sharding uses a shared queue (like Redis) where workers pull the next batch, automatically balancing load [citation:3].",
        },
        {
          question:
            "Why must tests be isolated before enabling parallel execution?",
          options: [
            "Because Jest requires isolation.",
            "Because tests that share state can interfere with each other when run simultaneously, causing flaky failures.",
            "Because parallel tests cannot use databases.",
            "Because isolation is only needed for E2E tests.",
          ],
          correctIndex: 1,
          explanation:
            "Parallel tests run at the same time. If they share state (files, database rows, globals), they interfere. Isolation ensures each test runs independently [citation:4].",
        },
        {
          question:
            "What does `jest --changedSince=main` do?",
          options: [
            "Runs only tests that were changed.",
            "Runs only tests affected by files changed since the `main` branch, skipping unrelated tests.",
            "Runs tests in the `main` directory.",
            "Runs tests only on the main branch.",
          ],
          correctIndex: 1,
          explanation:
            "`--changedSince` uses git to detect which files changed since a branch, then runs only the tests that import or depend on those files. This is Test Impact Analysis [citation:4].",
        },
        {
          question:
            "What is the main benefit of caching `node_modules` in CI?",
          options: [
            "It reduces the repository size.",
            "It avoids reinstalling dependencies on every run, saving minutes of CI time.",
            "It makes tests run faster.",
            "It prevents dependency conflicts.",
          ],
          correctIndex: 1,
          explanation:
            "Installing `node_modules` from scratch on every CI run takes minutes. Caching it restores the dependencies from a previous run, reducing setup time.",
        },
      ],
    },
    {
      id: "day-69-lesson-4",
      title: "Load Testing",
      durationMinutes: 28,
      explanation: `
<b>Your API works.</b> You have tested it with unit tests, integration tests, and end-to-end tests. But you have no idea how it behaves under load. Can it handle 100 concurrent users? 1,000? What happens when traffic spikes? Where does it break? You will find out in production — the worst possible time — unless you load test first.

<b>Load testing</b> simulates concurrent users hitting your API and measures how it performs. It answers questions that no other test can:
- How many requests per second can the API handle?
- What is the p95 and p99 latency under load?
- At what point does it break (stress test)?
- Does it recover after a spike?
- Are there memory leaks under sustained load (soak test)? [citation:16]

<b>Types of performance tests.</b>
- <b>Load test:</b> Normal expected load. Verify the system works.
- <b>Stress test:</b> Beyond normal load. Find the breaking point.
- <b>Spike test:</b> Sudden traffic surge. Simulate a viral event.
- <b>Soak test:</b> Sustained load over hours. Find memory leaks [citation:16].

<b>Choosing a load testing tool.</b> Three tools dominate the Node.js ecosystem:

| Tool | Best For | Script Format | Thresholds | Ramping |
|------|----------|---------------|------------|---------|
| autocannon | Quick benchmarking | JS / CLI | No | No |
| k6 | CI/CD load testing | JavaScript | Yes | Yes |
| artillery | Scenario-based flows | YAML + JS | Yes | Yes |

<b>autocannon</b> is for quick benchmarks during development. It is fast, simple, and has no ramping or threshold support. Use it to compare two implementations or check the throughput of a single endpoint [citation:6].

\`\`\`bash
npx autocannon -c 100 -d 30 http://localhost:3000/api/users
\`\`\`

<b>k6</b> is the best choice for most teams. It uses JavaScript for test scripts, has excellent output, and integrates with CI/CD. It supports ramping, thresholds, custom metrics, and multi-step scenarios [citation:6][citation:16].

\`\`\`javascript
// load-test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { durationMinutes: '30s', target: 20 },   // ramp up to 20 users
    { durationMinutes: '1m', target: 100 },   // ramp up to 100 users
    { durationMinutes: '2m', target: 100 },   // stay at 100 users
    { durationMinutes: '30s', target: 0 },    // ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% of requests under 500ms
    http_req_failed: ['rate<0.01'],    // less than 1% errors
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/users');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  sleep(1);
}
\`\`\`

Run it:

\`\`\`bash
k6 run load-test.js
\`\`\`

The thresholds are critical for CI. If p95 exceeds 500ms or the error rate exceeds 1%, k6 exits with a non-zero code, failing the pipeline [citation:6][citation:11].

<b>artillery</b> sits between autocannon and k6. Its strength is YAML-based test definitions and multi-step user flows (browse, search, add to cart, checkout). It also supports WebSocket and gRPC [citation:6][citation:11].

\`\`\`yaml
# load-test.yml
config:
  target: "http://localhost:3000"
  phases:
    - durationMinutes: 60
      arrivalRate: 10
    - durationMinutes: 120
      arrivalRate: 50
scenarios:
  - name: "Browse and search"
    flow:
      - get:
          url: "/api/products"
      - think: 2
      - get:
          url: "/api/products/1"
\`\`\`

Run it:

\`\`\`bash
artillery run load-test.yml
\`\`\`

<b>Establishing a baseline.</b> Before you can detect a regression, you need a baseline. Run your load test in a controlled environment and record:
- p50, p95, p99 latency.
- Requests per second.
- Error rate.

Store the baseline in version control. When you change the code, run the same test and compare. A regression is immediately visible [citation:6].

<b>Warm-up matters.</b> Node.js uses V8's JIT compiler, which optimizes hot code paths after several thousand executions. Measurements taken in the first few seconds of a load test show higher latencies than steady-state. Run the test for at least 30 seconds and discard the first few seconds, or use k6's staged ramping to reach steady state before measuring [citation:6].

<b>Database bottlenecks.</b> Most API load tests reveal database bottlenecks, not application server limits. A Node.js API serving cached responses can handle tens of thousands of requests per second. The same API making a database query per request typically caps at a few hundred per second, limited by the database connection pool [citation:6].

When you see high latency and low throughput simultaneously, check the database connection pool. If all connections are in use and requests are queuing, you have found your bottleneck.

<b>CI integration.</b> Full load tests taking 10+ minutes at high concurrency are impractical for every commit. Reserve them for release gates or nightly jobs. For per-PR validation, run abbreviated tests: 30 seconds at moderate load [citation:6].

\`\`\`yaml
# .github/workflows/load-test.yml
name: Load Test
on:
  schedule:
    - cron: '0 3 * * *'  # Nightly
  workflow_dispatch:
jobs:
  load:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run k6 load test
        run: |
          docker run --rm -i grafana/k6 run - <tests/load/api.js
\`\`\`

<b>What can go wrong?</b>
- <b>No baseline.</b> Without a baseline, you cannot detect regressions. Record and version your baselines.
- <b>Testing in an unrealistic environment.</b> A laptop is not a production server. Test against a staging environment that mirrors production.
- <b>Ignoring warm-up.</b> JIT compilation means early measurements are misleading. Run for at least 30 seconds [citation:6].
- <b>Only testing the happy path.</b> Test authenticated endpoints, write-heavy endpoints, and error paths.
- <b>Not checking database metrics.</b> The bottleneck is usually the database. Check connection pool usage and slow queries [citation:6].
- <b>Running full load tests on every commit.</b> Too slow. Reserve for nightly or release gates [citation:6].
- <b>Ignoring thresholds.</b> A load test without thresholds is just a benchmark. Use k6 or artillery thresholds to fail CI on regressions [citation:11].

<b>How this appears in a real project.</b> A NestJS e-commerce API has:
- A k6 load test for the product listing endpoint (read-heavy, cached).
- A k6 load test for the checkout flow (write-heavy, database-intensive).
- A nightly load test that runs against staging and reports p95/p99 latency.
- A baseline stored in the repo. A regression of more than 10% triggers an alert.
- Database connection pool monitoring to catch the most common bottleneck [citation:6].

<b>How experienced engineers think.</b> Load testing is not a one-time activity. It is a continuous practice. Every major change should be validated against a baseline. The goal is not to find the breaking point once — it is to know, at any time, how the system behaves under load and to catch regressions before users do.
      `,
      diagram: `
Load Testing Workflow

  1. Choose tool:
     - autocannon: quick benchmark
     - k6: CI/CD load testing
     - artillery: scenario-based flows

  2. Write test script:
     - Define stages (ramp up, hold, ramp down)
     - Define thresholds (p95 < 500ms, error rate < 1%)
     - Define checks (status 200, response time)

  3. Run against staging:
     k6 run load-test.js
        |
        v
     Results:
       http_req_duration: avg=12ms p(95)=45ms p(99)=89ms
       http_reqs: 9649 (53.6/s)
       http_req_failed: 0.00%

  4. Compare to baseline:
     - Store baseline in version control
     - Regression > 10% -> investigate

  5. CI integration:
     - Per-PR: abbreviated test (30s)
     - Nightly: full load test
     - Release gate: stress test

  Common bottleneck:
     Database connection pool
     - pg_stat_activity shows active connections
     - Size pool to max_connections - headroom
      `,
      codeExample: { title: "Example", code: `
// ============================================
// LOAD TESTING WITH K6 AND AUTOCANNON
// ============================================

// ---------- 1. Install k6 ----------
// brew install k6          # macOS
// sudo apt install k6      # Ubuntu
// docker pull grafana/k6   # Docker

// ---------- 2. Basic k6 load test ----------
// tests/load/api.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { durationMinutes: '30s', target: 20 },
    { durationMinutes: '1m', target: 100 },
    { durationMinutes: '2m', target: 100 },
    { durationMinutes: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(99)<1000'],
    http_req_failed: ['rate<0.01'],
    http_reqs: ['rate>100'],
  },
};

export default function () {
  const res = http.get('http://localhost:3000/api/products');

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
    'has products': (r) => JSON.parse(r.body).length > 0,
  });

  sleep(1);
}

// ---------- 3. k6 with authentication ----------
import http from 'k6/http';
import { check } from 'k6';

const BASE_URL = 'http://localhost:3000';

export function setup() {
  const loginRes = http.post(\`\${BASE_URL}/api/auth/login\`, JSON.stringify({
    email: 'test@example.com',
    password: 'password123',
  }), { headers: { 'Content-Type': 'application/json' } });

  check(loginRes, { 'login successful': (r) => r.status === 200 });
  return { token: loginRes.json('accessToken') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': \`Bearer \${data.token}\`,
  };

  const res = http.get(\`\${BASE_URL}/api/users/me\`, { headers });
  check(res, { 'status is 200': (r) => r.status === 200 });

  sleep(1);
}

// ---------- 4. k6 custom metrics ----------
import { Counter, Trend, Rate } from 'k6/metrics';

const orderErrors = new Counter('order_errors');
const orderDuration = new Trend('order_duration_ms');
const successRate = new Rate('order_success_rate');

export default function () {
  const res = http.post(\`\${BASE_URL}/api/orders\`, JSON.stringify({
    productId: 1,
    quantity: 2,
  }), { headers: { 'Content-Type': 'application/json' } });

  orderDuration.add(res.timings.duration);
  successRate.add(res.status === 201);

  if (res.status !== 201) {
    orderErrors.add(1);
  }
}

// ---------- 5. Run k6 ----------
// k6 run tests/load/api.js
// k6 run --out json=results.json tests/load/api.js
// k6 run --out dashboard=open tests/load/api.js  # Open web dashboard

// ---------- 6. autocannon quick benchmark ----------
// npx autocannon -c 100 -d 30 http://localhost:3000/api/products
//
// -c: concurrent connections
// -d: duration in seconds
//
// Output:
// ┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬───────┐
// │ Stat    │ 2.5% │ 50%  │ 97.5% │ 99%   │ Avg     │ Stdev   │ Max   │
// ├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼───────┤
// │ Latency │ 5 ms │ 12ms │ 45 ms │ 89 ms │ 15.2 ms │ 12.3 ms │ 234ms │
// └─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴───────┘
// ┌─────────┬─────────┬─────────┬─────────┬─────────┬──────────┬─────────┐
// │ Stat    │ 1%      │ 2.5%    │ 50%     │ 97.5%   │ Avg      │ Stdev   │
// ├─────────┼─────────┼─────────┼─────────┼─────────┼──────────┼─────────┤
// │ Req/Sec │ 1200    │ 1350    │ 1500    │ 1800    │ 1520.5   │ 123.4   │
// └─────────┴─────────┴─────────┴─────────┴─────────┴──────────┴─────────┘

// ---------- 7. CI integration ----------
// .github/workflows/load-test.yml
// name: Load Test
// on:
//   schedule:
//     - cron: '0 3 * * *'
//   workflow_dispatch:
// jobs:
//   load:
//     runs-on: ubuntu-latest
//     steps:
//       - uses: actions/checkout@v4
//       - name: Run k6 load test
//         run: |
//           docker run --rm -i grafana/k6 run - <tests/load/api.js
//       - uses: actions/upload-artifact@v4
//         if: always()
//         with:
//           name: load-test-results
//           path: results.json

// ---------- 8. Baseline comparison ----------
// Store a baseline in the repo:
// tests/load/baseline.json
// {
//   "p50": 12,
//   "p95": 45,
//   "p99": 89,
//   "rps": 1520,
//   "errorRate": 0.0
// }
//
// After a load test, compare:
// - p95 regression > 10% -> investigate
// - error rate > 0.1% -> investigate

// ---------- 9. Database bottleneck detection ----------
// When latency is high and throughput is low:
// SELECT count(*) FROM pg_stat_activity WHERE state = 'active';
// SELECT * FROM pg_stat_activity WHERE wait_event_type = 'Lock';
//
// If all connections are active and requests are queuing,
// the database connection pool is the bottleneck.
// Size the pool to match max_connections - headroom.

// ---------- 10. What NOT to do ----------
// BAD: running full load tests on every commit.
// It is slow (10+ minutes). Reserve for nightly.

// BAD: testing on a laptop.
// Test against staging that mirrors production.

// BAD: ignoring warm-up.
// Run for at least 30s to let V8 JIT optimize.

// BAD: no thresholds.
// A load test without thresholds is just a benchmark.
      ` },
      keyTakeaways: [
        "Load testing simulates concurrent users and measures throughput, latency, and error rate under load.",
        "Use k6 for CI/CD load testing with thresholds, ramping, and JavaScript scripts.",
        "Use autocannon for quick benchmarks during development — it is fast and simple.",
        "Use artillery for scenario-based user flows (browse, search, checkout) with YAML configs.",
        "Establish a baseline and store it in version control. Regressions become immediately visible.",
        "Warm-up matters — run for at least 30 seconds to let V8 JIT optimize before measuring.",
        "Most API bottlenecks are in the database. Check connection pool usage when latency is high and throughput is low.",
        "Run abbreviated load tests on PRs and full tests nightly. Do not run full tests on every commit.",
      ],
      commonMistakes: [
        "<b>No baseline.</b> Without a baseline, you cannot detect regressions. Record and version your baselines [citation:6].",
        "<b>Testing in an unrealistic environment.</b> A laptop is not a production server. Test against staging that mirrors production.",
        "<b>Ignoring warm-up.</b> JIT compilation means early measurements are misleading. Run for at least 30 seconds [citation:6].",
        "<b>Only testing the happy path.</b> Test authenticated endpoints, write-heavy endpoints, and error paths.",
        "<b>Not checking database metrics.</b> The bottleneck is usually the database. Check connection pool usage and slow queries [citation:6].",
        "<b>Running full load tests on every commit.</b> Too slow. Reserve for nightly or release gates [citation:6].",
        "<b>Ignoring thresholds.</b> A load test without thresholds is just a benchmark. Use k6 thresholds to fail CI on regressions [citation:11].",
      ],
      quiz: [
        {
          question:
            "Which load testing tool is best suited for CI/CD integration with pass/fail thresholds?",
          options: [
            "autocannon",
            "k6",
            "artillery",
            "curl",
          ],
          correctIndex: 1,
          explanation:
            "k6 supports thresholds that fail CI when performance degrades. It also supports ramping stages, custom metrics, and multi-step scenarios, making it ideal for CI/CD [citation:6][citation:11].",
        },
        {
          question:
            "Why is warm-up important in load testing?",
          options: [
            "Because the server needs to warm up physically.",
            "Because V8's JIT compiler optimizes hot code paths after several thousand executions, so early measurements are misleading.",
            "Because the database needs to warm up.",
            "Because k6 requires a warm-up phase.",
          ],
          correctIndex: 1,
          explanation:
            "Node.js uses V8's JIT compiler, which optimizes frequently executed code. Early measurements are slower than steady-state. Run for at least 30 seconds and discard the first few seconds [citation:6].",
        },
        {
          question:
            "Your load test shows high latency and low throughput. What is the most likely bottleneck?",
          options: [
            "The application server CPU.",
            "The network.",
            "The database connection pool.",
            "The load testing tool.",
          ],
          correctIndex: 2,
          explanation:
            "High latency with low throughput usually indicates the database connection pool is saturated. When all connections are in use, requests queue. Check `pg_stat_activity` and connection pool metrics [citation:6].",
        },
        {
          question:
            "How often should full load tests run in CI?",
          options: [
            "On every commit.",
            "Nightly or on release gates, not on every commit.",
            "Once a year.",
            "Never.",
          ],
          correctIndex: 1,
          explanation:
            "Full load tests take 10+ minutes and are impractical for every commit. Run abbreviated tests on PRs and full tests nightly or before releases [citation:6].",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question:
        "What does test coverage measure?",
      options: [
        "The number of tests written.",
        "The percentage of source code executed during tests.",
        "The quality of assertions.",
        "The speed of the test suite.",
      ],
      correctIndex: 1,
      explanation:
        "Coverage measures how much of your source code is executed during tests. It exposes untested \"dark zones\" [citation:1].",
    },
    {
      question:
        "Which coverage metric is most important for catching logic bugs?",
      options: [
        "% Statements",
        "% Branch",
        "% Functions",
        "% Lines",
      ],
      correctIndex: 1,
      explanation:
        "Branch coverage tracks whether both sides of conditional logic were tested. Bugs most frequently hide in untested branches [citation:1].",
    },
    {
      question:
        "What is the relationship between coverage and test quality?",
      options: [
        "High coverage always means high quality.",
        "Coverage measures execution, not verification. A test can execute code without asserting on behavior.",
        "Coverage is irrelevant to quality.",
        "Coverage is only for legacy code.",
      ],
      correctIndex: 1,
      explanation:
        "Coverage tells you code was executed, not that it was verified. A test that calls a function but never asserts gives coverage with zero confidence [citation:1].",
    },
    {
      question:
        "What does mutation testing verify?",
      options: [
        "That the code compiles.",
        "That the tests actually catch bugs when the code is changed.",
        "That the coverage is 100%.",
        "That the tests run fast.",
      ],
      correctIndex: 1,
      explanation:
        "Mutation testing introduces small changes to the source code and checks if tests fail. If tests pass with a mutant, they missed the bug [citation:18].",
    },
    {
      question:
        "What does a 'surviving mutant' indicate?",
      options: [
        "A test passed with the mutated code, meaning the test suite missed the bug.",
        "A test failed with the mutated code.",
        "The mutation was suppressed.",
        "The code did not compile.",
      ],
      correctIndex: 0,
      explanation:
        "A surviving mutant means tests passed despite the introduced bug. This reveals a gap in your test suite [citation:18].",
    },
    {
      question:
        "What is the purpose of `coverageAnalysis: \"perTest\"` in Stryker?",
      options: [
        "It measures test coverage.",
        "It runs only the tests that cover a specific mutant, reducing run time.",
        "It generates an HTML report.",
        "It enables incremental mode.",
      ],
      correctIndex: 1,
      explanation:
        "`perTest` coverage analysis maps each mutant to the tests that cover its line, so Stryker runs only those tests. This reduces run time by 90% or more [citation:2][citation:18].",
    },
    {
      question:
        "What is dynamic sharding in parallel testing?",
      options: [
        "Splitting tests into fixed groups at the start.",
        "Using a shared queue where workers pull the next batch of tests, balancing load automatically.",
        "Running tests in random order.",
        "Skipping slow tests.",
      ],
      correctIndex: 1,
      explanation:
        "Dynamic sharding uses a shared queue (like Redis) where workers atomically steal batches. Fast workers do more, slow workers do less, balancing the load [citation:3].",
    },
    {
      question:
        "Why must tests be isolated before enabling parallel execution?",
      options: [
        "Because Jest requires isolation.",
        "Because tests that share state can interfere with each other when run simultaneously.",
        "Because parallel tests cannot use databases.",
        "Because isolation is only needed for E2E tests.",
      ],
      correctIndex: 1,
      explanation:
        "Parallel tests run at the same time. Shared state (files, database rows, globals) causes interference and flaky failures [citation:4].",
    },
    {
      question:
        "What does `jest --changedSince=main` do?",
      options: [
        "Runs only tests that were changed.",
        "Runs only tests affected by files changed since the `main` branch.",
        "Runs tests in the `main` directory.",
        "Runs tests only on the main branch.",
      ],
      correctIndex: 1,
      explanation:
        "`--changedSince` uses git to detect which files changed, then runs only the tests that depend on those files. This is Test Impact Analysis [citation:4].",
    },
    {
      question:
        "Which load testing tool is best for quick benchmarks during development?",
      options: [
        "k6",
        "autocannon",
        "artillery",
        "JMeter",
      ],
      correctIndex: 1,
      explanation:
        "autocannon is fast and simple, ideal for quick benchmarks and comparing implementations. It lacks ramping and thresholds [citation:6].",
    },
    {
      question:
        "Why is warm-up important in load testing?",
      options: [
        "Because the server needs to warm up physically.",
        "Because V8's JIT compiler optimizes hot code paths, so early measurements are misleading.",
        "Because the database needs to warm up.",
        "Because k6 requires a warm-up phase.",
      ],
      correctIndex: 1,
      explanation:
        "V8's JIT compiler optimizes frequently executed code after several thousand executions. Run for at least 30 seconds and discard early measurements [citation:6].",
    },
    {
      question:
        "Your load test shows high latency and low throughput. What is the most likely bottleneck?",
      options: [
        "The application server CPU.",
        "The network.",
        "The database connection pool.",
        "The load testing tool.",
      ],
      correctIndex: 2,
      explanation:
        "High latency with low throughput usually indicates the database connection pool is saturated. Check `pg_stat_activity` and connection pool metrics [citation:6].",
    },
    {
      question:
        "What is the purpose of a mutation score threshold in CI?",
      options: [
        "To measure code coverage.",
        "To fail the pipeline if the mutation score drops below a minimum, preventing test quality regression.",
        "To run tests faster.",
        "To skip flaky tests.",
      ],
      correctIndex: 1,
      explanation:
        "A mutation score threshold enforces a minimum test quality level. If the mutation score drops, the pipeline fails, alerting the team to weak tests [citation:18].",
    },
    {
      question:
        "Which of these is NOT a type of performance test?",
      options: [
        "Load test",
        "Stress test",
        "Soak test",
        "Unit test",
      ],
      correctIndex: 3,
      explanation:
        "Unit tests verify individual components. Performance tests (load, stress, spike, soak) measure system behavior under various load conditions [citation:16].",
    },
    {
      question:
        "What does `--bail` do in Jest?",
      options: [
        "Runs tests in parallel.",
        "Stops the test run on the first failure.",
        "Skips failing tests.",
        "Generates a coverage report.",
      ],
      correctIndex: 1,
      explanation:
        "`--bail` stops the test run immediately on the first failure. This is useful in CI to fail fast and avoid waiting for the full suite [citation:6].",
    },
  ],
  project: {
    name: "Optimize a NestJS Test Suite with Coverage Gates, Mutation Testing, Parallel Execution, and Load Testing",
    goal:
      "Take an existing NestJS project with a slow, low-quality test suite and transform it into a fast, high-confidence CI pipeline using coverage thresholds, Stryker mutation testing, dynamic sharding, and k6 load testing.",
    brief:
      "You have a NestJS e-commerce API with 500 test files that takes 15 minutes to run in CI. Coverage is at 45%, and you suspect many tests do not actually verify behavior. Your job is to add quality gates, parallelize execution, and establish performance baselines. This is the kind of optimization that turns a frustrating CI pipeline into a productive one.",
    steps: [
      "Create or clone a NestJS project with a substantial test suite (at least 50 test files). Add `@stryker-mutator/core`, `@stryker-mutator/jest-runner`, `@stryker-mutator/typescript-checker`, and `testcontainers`.",
      "Configure Jest coverage in `jest.config.ts` with `collectCoverageFrom` excluding test files, modules, DTOs, and entities. Set `coverageThreshold` at 80% global with stricter thresholds for `src/modules/orders/`.",
      "Run `npm test -- --coverage` and record the current coverage. Identify the files with the lowest branch coverage.",
      "Add tests to improve branch coverage for the top 3 lowest-covered files. Verify the coverage threshold passes.",
      "Configure Stryker with `stryker.config.json`. Set `coverageAnalysis: \"perTest\"`, `checkers: [\"typescript\"]`, and `mutate` excluding boilerplate. Set thresholds: `high: 80, low: 60, break: 50`.",
      "Run `npx stryker run` on a single module (e.g. `src/modules/orders/`) and examine the surviving mutants. Add tests to kill at least 5 surviving mutants.",
      "Add a CI job that runs Stryker incrementally (`npx stryker run --incremental`) on changed files only.",
      "Configure Jest for parallel execution. Locally, set `maxWorkers: '50%'`. In CI, use static sharding with `--shard=N/5` in a GitHub Actions matrix.",
      "Add `node_modules` caching to the CI workflow to avoid reinstalling dependencies.",
      "Add a `--changedSince=main` step to run only affected tests on PRs.",
      "Write a k6 load test for the product listing endpoint (`GET /api/products`). Define stages (ramp up to 100 users over 1 minute, hold for 2 minutes, ramp down). Set thresholds: `http_req_duration: ['p(95)<500']`, `http_req_failed: ['rate<0.01']`.",
      "Run the k6 test against a staging environment. Record the baseline (p50, p95, p99, RPS, error rate) in `tests/load/baseline.json`.",
      "Add a nightly CI job that runs the k6 load test and compares results to the baseline. Fail if p95 regresses by more than 10%.",
      "Update the README with the new test commands: `npm test` (parallel), `npm test:mutation` (Stryker), `k6 run tests/load/api.js` (load test).",
    ],
    acceptance: [
      "Coverage threshold of 80% passes with `npm test -- --coverage`.",
      "Stryker mutation score is above 60% on the modules tested.",
      "CI test suite runs in under 5 minutes using sharding.",
      "PRs run only affected tests with `--changedSince=main`.",
      "k6 load test passes thresholds on staging (p95 < 500ms, error rate < 1%).",
      "Baseline is stored in version control and nightly comparisons detect regressions.",
      "`node_modules` is cached in CI, reducing setup time.",
    ],
    stretch: [
      "Add dynamic sharding with specbandit and Redis. Compare the balance and total time against static sharding.",
      "Add per-worker database schemas for parallel integration tests to avoid conflicts.",
      "Add a k6 stress test that ramps up to 1000 users to find the breaking point. Record the point where p95 exceeds 1 second.",
      "Add a k6 soak test that runs for 2 hours to detect memory leaks.",
      "Add Datadog Test Parallelization or Knapsack Pro for intelligent sharding based on historical test durations.",
      "Add a coverage badge to the README using Codecov or Coveralls.",
      "Add a Stryker HTML report artifact to CI and post a comment on PRs with the mutation score.",
    ],
  },
};
