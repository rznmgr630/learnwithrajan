import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_62_LESSONS: LessonDay = {
  day: 62,
  title: "Jest",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-62-lesson-1",
      title: "Test Suites and Structure",
      durationMinutes: 20,
      explanation: `
<b>Imagine you have just finished writing a new feature in your NestJS application.</b> The service works, the controller returns the right response, and the database query is correct. You push it to production. Two days later, someone on your team changes a small utility function that your service depends on. The change looks harmless. But it breaks your feature silently — the tests you never wrote would have caught it instantly.

This is why testing exists. And in the NestJS ecosystem, <b>Jest</b> is the default testing framework. It comes pre-configured with every NestJS project, and understanding it deeply is essential for building production-grade applications.

<b>What is Jest?</b> Jest is a JavaScript testing framework developed by Meta (Facebook). It provides everything you need to write and run tests: a test runner, an assertion library, mocking utilities, and coverage reporting. It is fast, has excellent error messages, and requires zero configuration to get started.

<b>What is a test suite?</b> A test suite is a collection of tests grouped together. In Jest, the \`describe\` function creates a suite. Think of it as a folder that contains related tests. For example, if you have a \`UsersService\` class, you might have one suite for all tests related to \`UsersService\`.

\`\`\`typescript
describe('UsersService', () => {
  // All tests for UsersService go here
});
\`\`\`

<b>Why use \`describe\`?</b> Because organized tests are easier to understand, navigate, and maintain. Without \`describe\`, all your tests sit at the top level of a file in a flat list. With \`describe\`, you create a hierarchy that mirrors your code structure.

<b>What is a test case?</b> A test case is a single, focused test. In Jest, you create one with either \`test\` or \`it\`. They are aliases — the exact same function with different names [citation:1][citation:7].

\`\`\`typescript
test('should return the user when a valid id is provided', () => {
  // test code
});

it('should throw NotFoundException when user does not exist', () => {
  // test code
});
\`\`\`

<b>When to use \`test\` vs \`it\`?</b> There is no functional difference. The convention varies by team. Some prefer \`it\` because it reads like a sentence: "it should return the user." Others prefer \`test\` because it is explicit. Pick one and be consistent [citation:7].

<b>How \`describe\` and \`it\` work together.</b> The pattern is simple: \`describe\` groups, \`it\` tests.

\`\`\`typescript
describe('UsersService', () => {
  describe('findById', () => {
    it('should return the user when found', async () => {
      // ...
    });

    it('should return null when not found', async () => {
      // ...
    });
  });

  describe('create', () => {
    it('should hash the password before saving', async () => {
      // ...
    });

    it('should throw ConflictException on duplicate email', async () => {
      // ...
    });
  });
});
\`\`\`

This structure creates a readable hierarchy: \`UsersService\` → \`findById\` → specific test cases. When a test fails, the output tells you exactly where to look.

<b>Nesting describes.</b> You can nest \`describe\` blocks as deeply as you need. This is useful for complex components with many methods or edge cases.

\`\`\`typescript
describe('OrdersService', () => {
  describe('createOrder', () => {
    describe('when the customer has sufficient balance', () => {
      it('should create the order', () => {});
      it('should decrement the balance', () => {});
    });

    describe('when the customer has insufficient balance', () => {
      it('should throw BadRequestException', () => {});
      it('should not create the order', () => {});
    });
  });
});
\`\`\`

<b>Why nesting matters.</b> Because tests describe behavior in context. "When the customer has sufficient balance, it should create the order" is a sentence that reads naturally. Nested describes let you express those contexts without repeating them in every test name [citation:7].

<b>What can go wrong with test structure?</b>
- <b>Flat test files.</b> All tests at the top level with no \`describe\` blocks. As the file grows, it becomes impossible to find specific tests.
- <b>Too much nesting.</b> Ten levels of \`describe\` is just as bad as no nesting. Three or four levels is usually the maximum.
- <b>Vague test names.</b> "should work" or "should be correct" tells you nothing. "should throw NotFoundException when the user does not exist" is specific and useful.
- <b>Multiple assertions in one test.</b> A test with five unrelated assertions is hard to debug when it fails. One behavior per test is the goal.
- <b>Mixing test and non-test code.</b> Setup code belongs in \`beforeEach\` or helper functions, not scattered between tests.

<b>How this appears in a real NestJS project.</b> A typical test file for a service looks like this:

\`\`\`
src/users/users.service.spec.ts
\`\`\`

It contains one top-level \`describe('UsersService')\`, nested \`describe\` blocks for each method (\`findById\`, \`findAll\`, \`create\`, \`update\`, \`remove\`), and individual \`it\` tests for each behavior and edge case. This structure scales from five tests to five hundred without becoming unmanageable.

<b>How experienced engineers think.</b> Test structure is not decoration — it is the interface through which you and your team interact with tests. A well-structured test file reads like documentation. A poorly structured one is a wall of code that nobody wants to touch.
      `,
      diagram: `
Jest Test Suite Structure

  users.service.spec.ts
  |
  +-- describe('UsersService')                <- Top-level suite
        |
        +-- describe('findById')               <- Nested suite (method)
        |     |
        |     +-- it('returns user when found')
        |     +-- it('returns null when not found')
        |
        +-- describe('create')                 <- Nested suite (method)
        |     |
        |     +-- it('hashes password')
        |     +-- it('throws ConflictException on duplicate')
        |
        +-- describe('update')                 <- Nested suite (method)
              |
              +-- it('updates fields')
              +-- it('throws NotFoundException on missing user')

Reading the output:
  UsersService
    findById
      ✓ returns user when found
      ✓ returns null when not found
    create
      ✓ hashes password
      ✓ throws ConflictException on duplicate

If a test fails, the hierarchy tells you exactly where.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// JEST TEST SUITES — STRUCTURE AND ORGANIZATION
// ============================================

// ---------- 1. Basic structure ----------
// users.service.spec.ts
describe('UsersService', () => {
  it('should be defined', () => {
    expect(true).toBe(true);
  });
});

// ---------- 2. Grouping by method ----------
describe('UsersService', () => {
  describe('findById', () => {
    it('should return the user when found', async () => {
      // test code
    });

    it('should return null when the user does not exist', async () => {
      // test code
    });

    it('should throw when the id is negative', async () => {
      // test code
    });
  });

  describe('create', () => {
    it('should hash the password before saving', async () => {
      // test code
    });

    it('should throw ConflictException when email is already registered', async () => {
      // test code
    });
  });
});

// ---------- 3. Nesting for context ----------
describe('OrdersService', () => {
  describe('createOrder', () => {
    describe('when the customer has sufficient balance', () => {
      it('should create the order', () => {});
      it('should decrement the balance', () => {});
      it('should emit an OrderCreated event', () => {});
    });

    describe('when the customer has insufficient balance', () => {
      it('should throw BadRequestException', () => {});
      it('should not create the order', () => {});
      it('should not decrement the balance', () => {});
    });

    describe('when the payment provider is unavailable', () => {
      it('should throw ServiceUnavailableException', () => {});
      it('should roll back the inventory reservation', () => {});
    });
  });
});

// ---------- 4. A realistic NestJS service test (placeholder) ----------
// This is the shape you will fill in with real tests.
describe('UsersService', () => {
  let service: UsersService;

  // Setup goes in beforeEach (covered in lesson 4).
  beforeEach(async () => {
    // service = await createTestingModule();
  });

  describe('findById', () => {
    it('should return a user when a valid id is provided', async () => {
      // Arrange: mock the repository to return a user.
      // Act: call service.findById(1).
      // Assert: expect(result).toEqual(mockUser).
    });

    it('should return null when the id does not exist', async () => {
      // Arrange: mock the repository to return null.
      // Act: call service.findById(999).
      // Assert: expect(result).toBeNull().
    });
  });
});

// ---------- 5. Common mistakes to avoid ----------
// BAD: vague test names
it('works', () => {});

// GOOD: specific test names
it('should throw NotFoundException when the user does not exist', () => {});

// BAD: multiple unrelated assertions
it('should work', () => {
  expect(1 + 1).toBe(2);
  expect('a').toBe('a');
  expect(true).toBeTruthy();
});

// GOOD: one behavior per test
it('should return two when adding one and one', () => {
  expect(1 + 1).toBe(2);
});
      ` },
      keyTakeaways: [
        "Jest is the default testing framework in NestJS, providing the test runner, assertions, mocking, and coverage.",
        "`describe` groups related tests into a suite; it does not run tests, it organizes them.",
        "`test` and `it` are aliases — use either, but be consistent across your codebase.",
        "Nested `describe` blocks express context: \"when X, it should do Y.\"",
        "One behavior per test keeps failures easy to diagnose.",
        "Specific test names (\"should throw NotFoundException when...\") are far more useful than vague ones.",
      ],
      commonMistakes: [
        "<b>Flat test files with no `describe`.</b> As the file grows, tests become impossible to find. Group by class, method, or scenario.",
        "<b>Too many nested `describe` blocks.</b> Ten levels of nesting is as bad as none. Aim for three or four levels maximum.",
        "<b>Vague test names.</b> 'should work' or 'should be correct' tells you nothing. Describe the exact behavior and condition.",
        "<b>Multiple unrelated assertions in one test.</b> When the test fails, you do not know which assertion caused it. One behavior per test.",
        "<b>Confusing `test` and `it` in the same file.</b> Both work, but mixing them is inconsistent. Pick one convention per project.",
      ],
      quiz: [
        {
          question: "What is the difference between `test` and `it` in Jest?",
          options: [
            "`test` is for unit tests, `it` is for integration tests.",
            "They are aliases — exactly the same function with different names.",
            "`test` runs before `it` in the same file.",
            "`it` does not support async functions.",
          ],
          correctIndex: 1,
          explanation: "The Jest documentation confirms that `test` and `it` are the same function. Use whichever reads better in your test names, but be consistent.",
        },
        {
          question: "What is the purpose of the `describe` block?",
          options: [
            "To run tests in parallel.",
            "To group related tests into a suite for organization and readable output.",
            "To assert values.",
            "To set up mock data.",
          ],
          correctIndex: 1,
          explanation: "`describe` creates a block that groups related tests. It does not run tests or make assertions — it organizes them so the output is a readable hierarchy.",
        },
        {
          question: "How many levels of nested `describe` blocks is generally recommended?",
          options: [
            "Zero — flat is best.",
            "Two to four levels maximum.",
            "As many as needed, typically ten or more.",
            "Exactly one.",
          ],
          correctIndex: 1,
          explanation: "Two to four levels of nesting (class → method → context) is usually sufficient and readable. Deeper nesting becomes confusing and hard to navigate.",
        },
        {
          question: "Which test name is the most useful?",
          options: [
            "should work",
            "test the user thing",
            "should throw NotFoundException when the user does not exist",
            "user test 1",
          ],
          correctIndex: 2,
          explanation: "The name should describe the exact behavior and condition. 'should throw NotFoundException when the user does not exist' tells you what is tested and under what conditions.",
        },
      ],
    },
    {
      id: "day-62-lesson-2",
      title: "Assertions and Matchers",
      durationMinutes: 22,
      explanation: `
<b>Writing a test without assertions is like running a program and never checking the output.</b> Assertions are the checks that verify your code behaves as expected. In Jest, assertions use the \`expect\` function and a family of <b>matchers</b> that test values in different ways.

<b>The core pattern is simple:</b>

\`\`\`typescript
expect(actualValue).matcher(expectedValue);
\`\`\`

\`expect\` wraps the value you are checking. The matcher is the method that defines what "correct" means. If the matcher fails, Jest reports exactly what it expected and what it got [citation:2].

<b>Why do matchers exist?</b> Because different types of values require different comparisons. A number is not compared the same way as an object, and an object is not compared the same way as a string. Matchers give you the right tool for each type.

<b>The most important matcher: \`toBe\`.</b> This checks exact equality using \`Object.is\`. Use it for primitives: numbers, strings, booleans, null, undefined [citation:2].

\`\`\`typescript
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');
expect(true).toBe(true);
expect(null).toBeNull();
\`\`\`

<b>For objects and arrays: \`toEqual\`.</b> \`toBe\` checks identity (same reference), which fails for objects. \`toEqual\` recursively checks every field of an object or array [citation:2].

\`\`\`typescript
const user = { id: 1, name: 'Ada' };
expect(user).toEqual({ id: 1, name: 'Ada' }); // passes
expect(user).toBe({ id: 1, name: 'Ada' });    // FAILS (different reference)
\`\`\`

<b>\`toEqual\` vs \`toStrictEqual\`.</b> \`toEqual\` ignores \`undefined\` properties, array sparseness, and object type mismatches. \`toStrictEqual\` checks all of these. When precision matters, use \`toStrictEqual\` [citation:4].

\`\`\`typescript
expect({ a: 1, b: undefined }).toEqual({ a: 1 });         // passes
expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 });   // FAILS
\`\`\`

<b>Truthiness matchers.</b> Sometimes you do not need exact equality — you just need to know if a value is truthy or falsy [citation:2].

\`\`\`typescript
expect(value).toBeNull();       // only null
expect(value).toBeUndefined();  // only undefined
expect(value).toBeDefined();    // anything except undefined
expect(value).toBeTruthy();     // anything an if treats as true
expect(value).toBeFalsy();      // anything an if treats as false
\`\`\`

<b>Number matchers.</b> For comparisons [citation:2]:

\`\`\`typescript
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThan(10);
expect(5).toBeLessThanOrEqual(5);
expect(0.1 + 0.2).toBeCloseTo(0.3); // for floating point
\`\`\`

<b>String matchers.</b> \`toMatch\` checks against a regular expression or substring [citation:2]:

\`\`\`typescript
expect('team').not.toMatch(/I/);
expect('Christoph').toMatch(/stop/);
expect('hello world').toMatch('world');
\`\`\`

<b>Array matchers.</b> \`toContain\` checks if an array or iterable contains a specific item [citation:2]:

\`\`\`typescript
const list = ['milk', 'eggs', 'bread'];
expect(list).toContain('milk');
expect(new Set(list)).toContain('eggs');
\`\`\`

<b>Exception matchers.</b> \`toThrow\` checks that a function throws. The function must be wrapped [citation:2][citation:4]:

\`\`\`typescript
expect(() => {
  throw new Error('something went wrong');
}).toThrow();

expect(() => {
  throw new Error('something went wrong');
}).toThrow('something went wrong');
\`\`\`

<b>The \`not\` modifier.</b> Add \`.not\` before any matcher to invert it [citation:2]:

\`\`\`typescript
expect(2 + 2).not.toBe(5);
expect('team').not.toMatch(/I/);
\`\`\`

<b>Asymmetric matchers.</b> When you only care about part of a value, use \`expect.objectContaining\` or \`expect.arrayContaining\`:

\`\`\`typescript
expect(user).toEqual(expect.objectContaining({
  name: 'Ada',
  // id and other fields are ignored
}));

expect(list).toEqual(expect.arrayContaining(['milk']));
\`\`\`

<b>What can go wrong with matchers?</b>
- <b>Using \`toBe\` for objects.</b> It checks reference identity, which almost always fails. Use \`toEqual\` or \`toStrictEqual\`.
- <b>Using \`toEqual\` for floating point.</b> Rounding errors cause failures. Use \`toBeCloseTo\`.
- <b>Forgetting to wrap thrown functions.</b> \`expect(drinkFlavor('octopus')).toThrow()\` will throw before \`expect\` can catch it. Wrap in an arrow function.
- <b>Using \`toBeTruthy\` for exact values.</b> \`0\` and \`''\` are falsy, but you might want to check for exact values. Use the most precise matcher for the job.
- <b>Ignoring \`undefined\` fields.</b> \`toEqual\` ignores them. If you need to check them, use \`toStrictEqual\`.

<b>How this appears in a real NestJS test.</b> A service test uses multiple matchers:

\`\`\`typescript
const result = await service.findById(1);
expect(result).toEqual({ id: 1, name: 'Ada', email: 'ada@example.com' });
expect(result.name).toBe('Ada');
expect(result).toHaveProperty('email');

await expect(service.findById(999)).rejects.toThrow(NotFoundException);
\`\`\`

<b>How experienced engineers think.</b> The matcher is a form of documentation. \`toBe(4)\` says "this must be exactly 4." \`toBeCloseTo(0.3)\` says "this is a floating point number that should be close to 0.3." Choosing the right matcher makes the test's intent clear and the failure messages useful.
      `,
      diagram: `
Jest Matchers Cheat Sheet

  expect(value).matcher(expected)

  EQUALITY
    .toBe(x)              exact equality (Object.is) — primitives
    .toEqual(x)           deep equality — objects and arrays
    .toStrictEqual(x)     deep equality with undefined/type checks

  TRUTHINESS
    .toBeNull()
    .toBeUndefined()
    .toBeDefined()
    .toBeTruthy()
    .toBeFalsy()

  NUMBERS
    .toBeGreaterThan(n)
    .toBeGreaterThanOrEqual(n)
    .toBeLessThan(n)
    .toBeLessThanOrEqual(n)
    .toBeCloseTo(n)       floating point

  STRINGS
    .toMatch(/regex/)
    .toMatch('substring')

  ARRAYS / ITERABLES
    .toContain(item)

  EXCEPTIONS
    .toThrow()                     any error
    .toThrow('message')            error message
    .toThrow(ErrorClass)           error class

  MODIFIERS
    .not.matcher(...)              inverted

  ASYMMETRIC
    expect.objectContaining({ ... })
    expect.arrayContaining([ ... ])
      `,
      codeExample: { title: "Example", code: `
// ============================================
// JEST MATCHERS — PRACTICAL EXAMPLES
// ============================================

// ---------- 1. Equality ----------
// Primitives: use toBe
expect(2 + 2).toBe(4);
expect('hello').toBe('hello');
expect(true).toBe(true);

// Objects and arrays: use toEqual
const user = { id: 1, name: 'Ada' };
expect(user).toEqual({ id: 1, name: 'Ada' });

const list = [1, 2, 3];
expect(list).toEqual([1, 2, 3]);

// Strict equality: use toStrictEqual
expect({ a: 1, b: undefined }).toEqual({ a: 1 });        // passes
expect({ a: 1, b: undefined }).toStrictEqual({ a: 1 });  // FAILS

// ---------- 2. Truthiness ----------
const n = null;
expect(n).toBeNull();
expect(n).toBeDefined();
expect(n).not.toBeUndefined();
expect(n).not.toBeTruthy();
expect(n).toBeFalsy();

const z = 0;
expect(z).not.toBeNull();
expect(z).toBeDefined();
expect(z).not.toBeTruthy();
expect(z).toBeFalsy();

// ---------- 3. Numbers ----------
expect(5).toBeGreaterThan(3);
expect(5).toBeGreaterThanOrEqual(5);
expect(5).toBeLessThan(10);
expect(5).toBeLessThanOrEqual(5);

// Floating point: use toBeCloseTo, not toEqual
expect(0.1 + 0.2).toBeCloseTo(0.3); // passes
// expect(0.1 + 0.2).toBe(0.3);      // FAILS due to rounding

// ---------- 4. Strings ----------
expect('team').not.toMatch(/I/);
expect('Christoph').toMatch(/stop/);
expect('hello world').toMatch('world');

// ---------- 5. Arrays ----------
const shoppingList = ['diapers', 'kleenex', 'milk'];
expect(shoppingList).toContain('milk');
expect(new Set(shoppingList)).toContain('kleenex');

// ---------- 6. Exceptions ----------
// The function MUST be wrapped in an arrow function.
expect(() => {
  throw new Error('something went wrong');
}).toThrow();

expect(() => {
  throw new Error('something went wrong');
}).toThrow('something went wrong');

// With a custom error class:
class NotFoundError extends Error {}
expect(() => {
  throw new NotFoundError('user not found');
}).toThrow(NotFoundError);

// ---------- 7. Inverting with .not ----------
expect(2 + 2).not.toBe(5);
expect('team').not.toMatch(/I/);
expect([]).not.toContain('anything');

// ---------- 8. Asymmetric matchers ----------
// Only check part of an object.
expect(user).toEqual(
  expect.objectContaining({
    name: 'Ada',
    // id and other fields are not checked
  }),
);

// Only check that an array contains certain items.
expect([1, 2, 3, 4, 5]).toEqual(
  expect.arrayContaining([2, 4]),
);

// ---------- 9. NestJS-specific: async exceptions ----------
// When testing async functions that throw, use rejects.
await expect(service.findById(999)).rejects.toThrow(NotFoundException);
await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);

// When testing async functions that resolve, use resolves.
await expect(service.findById(1)).resolves.toEqual({
  id: 1,
  name: 'Ada',
});

// ---------- 10. A full service test with matchers ----------
describe('UsersService.findById', () => {
  it('should return the user when found', async () => {
    // Assume mockRepo is set up to return a user.
    const result = await service.findById(1);

    expect(result).toBeDefined();
    expect(result.id).toBe(1);
    expect(result).toEqual(
      expect.objectContaining({
        id: 1,
        email: 'ada@example.com',
      }),
    );
  });

  it('should throw NotFoundException when not found', async () => {
    await expect(service.findById(999)).rejects.toThrow(NotFoundException);
  });
});
      ` },
      keyTakeaways: [
        "Use `toBe` for primitives and `toEqual`/`toStrictEqual` for objects and arrays.",
        "Use `toStrictEqual` when `undefined` properties, array sparseness, or object types matter.",
        "Use truthiness matchers (`toBeNull`, `toBeUndefined`, `toBeTruthy`, `toBeFalsy`) when exact values are not the point.",
        "Use `toBeCloseTo` for floating point comparisons — `toBe` and `toEqual` fail due to rounding errors.",
        "Use `toMatch` for strings, `toContain` for arrays, and `toThrow` for exceptions.",
        "Add `.not` to invert any matcher, and use asymmetric matchers like `objectContaining` for partial checks.",
        "For async exceptions, use `await expect(...).rejects.toThrow()`; for async resolutions, use `.resolves`.",
      ],
      commonMistakes: [
        "<b>Using `toBe` for objects.</b> `toBe` checks reference identity, so two identical objects fail. Use `toEqual` or `toStrictEqual` instead.",
        "<b>Using `toEqual` for floating point.</b> `0.1 + 0.2` is not exactly `0.3`. Use `toBeCloseTo`.",
        "<b>Forgetting to wrap thrown functions.</b> `expect(drinkFlavor('octopus')).toThrow()` throws before `expect` can catch it. Always wrap in `() => { ... }`.",
        "<b>Using `toBeTruthy` when you need exact values.</b> `0` and `''` are falsy but may be valid values. Use `toBe(0)` or `toBe('')` if that is what you mean.",
        "<b>Ignoring `undefined` with `toEqual`.</b> `toEqual` ignores `undefined` properties. If you need to assert they exist, use `toStrictEqual`.",
        "<b>Forgetting `await` on async assertions.</b> `expect(service.findById(999)).rejects.toThrow()` does not work without `await`. The test passes even if the assertion fails.",
      ],
      quiz: [
        {
          question: "Which matcher should you use to check that an object has a specific shape?",
          options: [
            "`toBe`",
            "`toEqual` or `toStrictEqual`",
            "`toContain`",
            "`toMatch`",
          ],
          correctIndex: 1,
          explanation: "`toBe` checks reference identity and fails for objects. `toEqual` (or `toStrictEqual` for stricter checking) recursively compares every field of an object or array.",
        },
        {
          question: "Why does `expect(0.1 + 0.2).toBe(0.3)` fail?",
          options: [
            "Because `toBe` does not support floating point.",
            "Because floating point arithmetic has rounding errors, so the result is not exactly 0.3.",
            "Because JavaScript does not support decimal numbers.",
            "Because you need to use `toEqual` instead.",
          ],
          correctIndex: 1,
          explanation: "Floating point numbers are stored as approximations. `0.1 + 0.2` is slightly more than `0.3`. Use `toBeCloseTo(0.3)` to allow for a small margin of error.",
        },
        {
          question: "What is the correct way to test that a function throws an error?",
          options: [
            "`expect(myFunction()).toThrow()`",
            "`expect(myFunction).toThrow()`",
            "`expect(() => myFunction()).toThrow()`",
            "`expect(myFunction).rejects.toThrow()`",
          ],
          correctIndex: 2,
          explanation: "You must wrap the function call in an arrow function. Without the wrapper, the function is called immediately and the error is thrown before `expect` can catch it.",
        },
        {
          question: "What does `toStrictEqual` check that `toEqual` does not?",
          options: [
            "Floating point precision.",
            "`undefined` properties, array sparseness, and object types.",
            "String case sensitivity.",
            "Number ranges.",
          ],
          correctIndex: 1,
          explanation: "`toEqual` ignores `undefined` properties and type mismatches. `toStrictEqual` checks all of these, making it the stricter and more precise matcher.",
        },
      ],
    },
    {
      id: "day-62-lesson-3",
      title: "Mocking and Test Isolation",
      durationMinutes: 24,
      explanation: `
<b>A unit test should test one thing in isolation.</b> If you are testing a \`UsersService\`, you do not want it to actually connect to a database, send emails, or call external APIs. You want to test the service's logic, with all its dependencies replaced by controlled fakes. This is what <b>mocking</b> is for.

<b>Why mock?</b> Because real dependencies are slow, unreliable, and non-deterministic. A database might be down. An external API might rate-limit you. An email service might actually send a real email. Tests must be fast, repeatable, and isolated [citation:11].

<b>What is a mock?</b> A mock is a replacement for a real dependency. It has the same interface (same method names, same signatures), but instead of doing real work, it returns whatever you tell it to return. Jest provides several ways to create mocks.

<b>1. \`jest.fn()\` — mock functions.</b> The simplest mock is a function that records how it was called and returns a configurable value.

\`\`\`typescript
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Configure a return value.
const mockGetUser = jest.fn().mockResolvedValue({ id: 1, name: 'Ada' });
const user = await mockGetUser(1);
expect(user.name).toBe('Ada');
\`\`\`

<b>2. Manual mocks.</b> A manual mock is a module that replaces another module. You create a \`__mocks__\` folder adjacent to the module and write a mock implementation [citation:11].

\`\`\`typescript
// src/users/__mocks__/users.service.ts
export const UsersService = jest.fn().mockImplementation(() => ({
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
}));
\`\`\`

Then in your test, call \`jest.mock('./users.service')\`.

<b>3. Auto-mocking with \`jest.mock\`.</b> Jest can automatically replace a module with an auto-mock that has the same shape but all methods return \`undefined\`.

\`\`\`typescript
jest.mock('./users.service');
// UsersService is now an auto-mock.
\`\`\`

<b>4. Spying with \`jest.spyOn\`.</b> A spy wraps a real method and records calls without changing its implementation (by default). Use it when you want to observe a method but still call the real implementation.

\`\`\`typescript
const spy = jest.spyOn(usersService, 'findById');
await usersService.findById(1);
expect(spy).toHaveBeenCalledWith(1);
\`\`\`

To replace the implementation: \`spy.mockResolvedValue(...)\`.

<b>Mocking in NestJS tests.</b> NestJS provides \`Test.createTestingModule()\` which lets you override providers. This is the standard way to mock dependencies in NestJS unit tests.

\`\`\`typescript
const module = await Test.createTestingModule({
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User),
      useValue: mockRepository,
    },
  ],
}).compile();
\`\`\`

The \`mockRepository\` is a plain object with the methods the service uses, each as a \`jest.fn()\`.

\`\`\`typescript
const mockRepository = {
  findOneBy: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
  delete: jest.fn(),
};
\`\`\`

<b>Why override providers instead of mocking the whole module?</b> Because you want the service to be a real instance with mocked dependencies. This tests the service's actual logic, not a mock of it.

<b>What can go wrong with mocking?</b>
- <b>Over-mocking.</b> Mocking everything means you test nothing. Mock only the dependencies that are slow, unreliable, or external.
- <b>Mocking the thing under test.</b> If you mock \`UsersService\`, you are not testing it. You are testing a mock.
- <b>Forgetting to reset mocks.</b> A mock that returns a value in one test will return the same value in the next unless you reset it. Use \`beforeEach\` to clear mocks.
- <b>Mocking too much of the internal implementation.</b> If you mock private methods or internal state, the test breaks when you refactor. Mock only the public interface.
- <b>Not testing error paths.</b> A mock that always succeeds does not test what happens when the dependency fails. Configure mocks to throw errors and test the service's error handling.
- <b>Assuming mocks behave like the real thing.</b> A mock is a simplified version. It might not catch bugs that the real dependency would. For critical integration points, consider integration tests with real dependencies.

<b>How this appears in a real NestJS test.</b> A typical service test:

\`\`\`typescript
describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: {
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    mockRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should return a user', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Ada' });
    const user = await service.findById(1);
    expect(user.name).toBe('Ada');
  });

  it('should handle a database error', async () => {
    mockRepo.findOneBy.mockRejectedValue(new Error('DB down'));
    await expect(service.findById(1)).rejects.toThrow('DB down');
  });
});
\`\`\`

<b>How experienced engineers think.</b> Mocking is a tool for isolation. The question is not "can I mock this?" but "should I?" Mock external services, slow I/O, and non-deterministic dependencies. Do not mock the code you are testing or the pure logic that could run instantly.
      `,
      diagram: `
Mocking in NestJS Unit Tests

  Without mocks:
    UsersService -> RealRepository -> RealDatabase
    (slow, requires DB, non-deterministic)

  With mocks:
    UsersService -> MockRepository (jest.fn())
    (fast, isolated, deterministic)

  Test.createTestingModule({
    providers: [
      UsersService,
      { provide: getRepositoryToken(User), useValue: mockRepo },
    ],
  })

  Mock types:
    jest.fn()                  -> a mock function
    jest.mock('./module')      -> auto-mock a module
    jest.spyOn(obj, 'method')  -> spy on a method
    __mocks__/module.ts        -> manual mock

  Mock configuration:
    mockFn.mockReturnValue(x)          -> sync return
    mockFn.mockResolvedValue(x)        -> async return
    mockFn.mockRejectedValue(err)      -> async throw
    mockFn.mockImplementation(fn)      -> custom logic

  Assertions on mocks:
    expect(mockFn).toHaveBeenCalled()
    expect(mockFn).toHaveBeenCalledWith(...)
    expect(mockFn).toHaveBeenCalledTimes(n)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// MOCKING IN NESTJS JEST TESTS
// ============================================

// ---------- 1. Mock function (jest.fn) ----------
const mockFn = jest.fn();
mockFn('hello');
expect(mockFn).toHaveBeenCalledWith('hello');
expect(mockFn).toHaveBeenCalledTimes(1);

// Configure return values.
const mockGetUser = jest.fn().mockResolvedValue({ id: 1, name: 'Ada' });
const user = await mockGetUser(1);
expect(user.name).toBe('Ada');

// Mock a rejection.
const mockFail = jest.fn().mockRejectedValue(new Error('DB down'));
await expect(mockFail()).rejects.toThrow('DB down');

// ---------- 2. NestJS service test with mocked repository ----------
// users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: {
    findOneBy: jest.Mock;
    save: jest.Mock;
    create: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(async () => {
    // Create a fresh mock repository for each test.
    mockRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  describe('findById', () => {
    it('should return the user when found', async () => {
      const mockUser = { id: 1, name: 'Ada', email: 'ada@example.com' };
      mockRepo.findOneBy.mockResolvedValue(mockUser);

      const result = await service.findById(1);

      expect(result).toEqual(mockUser);
      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null when the user does not exist', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      const result = await service.findById(999);

      expect(result).toBeNull();
    });

    it('should throw if the database fails', async () => {
      mockRepo.findOneBy.mockRejectedValue(new Error('DB connection lost'));

      await expect(service.findById(1)).rejects.toThrow('DB connection lost');
    });
  });

  describe('create', () => {
    it('should hash the password before saving', async () => {
      mockRepo.create.mockImplementation((dto) => ({ ...dto, id: 1 }));
      mockRepo.save.mockImplementation(async (entity) => entity);

      const result = await service.create({
        email: 'ada@example.com',
        password: 'plaintext',
      });

      // The password should not be stored in plain text.
      expect(result.passwordHash).toBeDefined();
      expect(result.passwordHash).not.toBe('plaintext');
    });
  });
});

// ---------- 3. Mocking with spyOn ----------
describe('UsersService with spies', () => {
  it('should call findById with the correct id', async () => {
    const spy = jest.spyOn(service, 'findById');
    spy.mockResolvedValue({ id: 1, name: 'Ada' });

    await service.findById(1);

    expect(spy).toHaveBeenCalledWith(1);
  });
});

// ---------- 4. Manual mock for an external service ----------
// __mocks__/mail.service.ts
export const MailService = jest.fn().mockImplementation(() => ({
  send: jest.fn().mockResolvedValue(true),
}));

// In the test:
jest.mock('./mail.service');

// ---------- 5. Overriding a module-level provider ----------
// When a service depends on an external service (e.g. MailService),
// override it at the module level.
const mockMailService = {
  send: jest.fn().mockResolvedValue(true),
};

const module = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: MailService, useValue: mockMailService },
    { provide: getRepositoryToken(User), useValue: mockRepo },
  ],
}).compile();

// ---------- 6. Resetting mocks between tests ----------
beforeEach(() => {
  jest.clearAllMocks(); // clears call history
  // or
  jest.resetAllMocks(); // clears calls AND implementations
});

// Or reset a specific mock:
beforeEach(() => {
  mockRepo.findOneBy.mockReset();
});
      ` },
      keyTakeaways: [
        "Mocking replaces slow, unreliable, or external dependencies with controlled fakes so tests are fast and deterministic.",
        "Use `jest.fn()` for mock functions, `jest.mock()` for module mocks, and `jest.spyOn()` to observe real methods.",
        "In NestJS, override providers with `Test.createTestingModule()` and `useValue` to inject mocks.",
        "Configure mocks with `mockResolvedValue`, `mockRejectedValue`, and `mockImplementation`.",
        "Use `jest.clearAllMocks()` in `beforeEach` to prevent state leaking between tests.",
        "Mock the dependencies, not the code under test. If you mock the service, you are testing a mock.",
        "Always test error paths by configuring mocks to throw.",
      ],
      commonMistakes: [
        "<b>Over-mocking.</b> Mocking everything means you are testing a mock, not the code. Mock only external, slow, or non-deterministic dependencies.",
        "<b>Mocking the thing under test.</b> If you mock `UsersService`, you are not testing `UsersService`. Use the real instance and mock its dependencies.",
        "<b>Forgetting to reset mocks.</b> Mock state persists between tests. A mock that returns a value in one test will return it in the next. Use `clearAllMocks()` in `beforeEach`.",
        "<b>Assuming mocks behave like the real thing.</b> A mock is a simplified version. It will not catch bugs that the real dependency would. For critical integration points, write integration tests with real dependencies.",
        "<b>Not testing error paths.</b> A mock that always succeeds does not test what happens when the dependency fails. Configure mocks to throw errors and test the service's error handling.",
        "<b>Mocking private methods or internal state.</b> This makes tests brittle and breaks them when you refactor. Mock only the public interface.",
      ],
      quiz: [
        {
          question: "Why do we mock dependencies in unit tests?",
          options: [
            "To make tests slower.",
            "To isolate the code under test and avoid slow, unreliable, or external dependencies.",
            "Because Jest requires it.",
            "To test the dependencies themselves.",
          ],
          correctIndex: 1,
          explanation: "Mocking isolates the unit being tested from its dependencies. This makes tests fast, deterministic, and focused on the logic of the code under test.",
        },
        {
          question: "In NestJS, what is the correct way to provide a mock repository to a service in a unit test?",
          options: [
            "Import the real repository.",
            "Use `Test.createTestingModule()` with `{ provide: getRepositoryToken(Entity), useValue: mockRepo }`.",
            "Call the database directly.",
            "Use `jest.mock('typeorm')`.",
          ],
          correctIndex: 1,
          explanation: "NestJS's testing module lets you override providers. `getRepositoryToken(Entity)` is the token for a TypeORM repository, and `useValue` provides the mock.",
        },
        {
          question: "What does `jest.clearAllMocks()` do?",
          options: [
            "Deletes all mocks.",
            "Resets the call history of all mocks, so assertions like `toHaveBeenCalledTimes` start fresh.",
            "Restores the original implementations.",
            "Disables mocking for the current test file.",
          ],
          correctIndex: 1,
          explanation: "`clearAllMocks()` resets the call history (calls, instances, results) but keeps the mock implementations. Use it in `beforeEach` to prevent state from leaking between tests.",
        },
        {
          question: "What is the difference between `jest.mock()` and `jest.spyOn()`?",
          options: [
            "They are the same.",
            "`jest.mock()` replaces a whole module; `jest.spyOn()` wraps a specific method, allowing you to observe or override it.",
            "`jest.spyOn()` only works on classes.",
            "`jest.mock()` only works on functions.",
          ],
          correctIndex: 1,
          explanation: "`jest.mock()` replaces an entire module with a mock. `jest.spyOn()` targets a specific method on an object, letting you observe calls and optionally override the implementation.",
        },
      ],
    },
    {
      id: "day-62-lesson-4",
      title: "Setup and Teardown",
      durationMinutes: 24,
      explanation: `
<b>Every test needs a clean starting point.</b> If test A creates a user and test B expects no users to exist, the order of tests matters — and that is a bug. Tests must be isolated and repeatable. This is where <b>setup and teardown</b> hooks come in.

<b>What are setup and teardown hooks?</b> They are functions that Jest runs at specific points in the test lifecycle. Setup runs before tests to prepare the environment. Teardown runs after tests to clean up [citation:3].

<b>The four hooks:</b>

- <b>\`beforeAll\`:</b> runs once, before any test in the file (or describe block).
- <b>\`afterAll\`:</b> runs once, after all tests in the file (or describe block).
- <b>\`beforeEach\`:</b> runs before every test.
- <b>\`afterEach\`:</b> runs after every test.

<b>When to use \`beforeAll\` vs \`beforeEach\`.</b> Use \`beforeAll\` for expensive setup that can be reused across tests: creating a testing module, connecting to a database, starting a server. Use \`beforeEach\` for setup that must be fresh for each test: resetting mocks, seeding test data, clearing a cache [citation:3].

\`\`\`typescript
describe('UsersService', () => {
  let module: TestingModule;
  let service: UsersService;

  // Expensive setup: run once.
  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [UsersService, { provide: getRepositoryToken(User), useValue: mockRepo }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Cheap setup: run before every test.
  beforeEach(() => {
    mockRepo.findOneBy.mockReset();
  });

  afterAll(async () => {
    await module.close();
  });
});
\`\`\`

<b>Why the distinction matters.</b> If you put expensive setup in \`beforeEach\`, every test pays the cost. If you put mutable state in \`beforeAll\`, tests may interfere with each other. The rule: expensive and immutable setup goes in \`beforeAll\`; cheap and mutable setup goes in \`beforeEach\`.

<b>Asynchronous setup.</b> Setup functions can be async. Jest waits for the promise to resolve before running tests [citation:3].

\`\`\`typescript
beforeAll(async () => {
  await dataSource.initialize();
  await dataSource.runMigrations();
});

afterAll(async () => {
  await dataSource.destroy();
});
\`\`\`

<b>Scoping.</b> Top-level hooks apply to all tests in the file. Hooks inside a \`describe\` block apply only to tests in that block. This lets you have different setup for different groups of tests [citation:3].

\`\`\`typescript
beforeEach(() => {
  // Applies to all tests in this file.
  initializeCityDatabase();
});

describe('matching cities to foods', () => {
  beforeEach(() => {
    // Applies only to tests in this describe block.
    // Runs AFTER the top-level beforeEach.
    initializeFoodDatabase();
  });

  it('Vienna <3 veal', () => {});
  it('San Juan <3 plantains', () => {});
});
\`\`\`

<b>Execution order.</b> The order matters and is often confusing. Here is the sequence [citation:3]:

1. \`beforeAll\` (outer)
2. For each test:
   - \`beforeEach\` (outer)
   - \`beforeEach\` (inner, if inside describe)
   - The test
   - \`afterEach\` (inner)
   - \`afterEach\` (outer)
3. \`afterAll\` (outer)

<b>Teardown for cleanup.</b> \`afterEach\` is where you clean up: reset mocks, clear test data, restore spies. \`afterAll\` is where you close connections: disconnect from the database, close the testing module, stop the server [citation:12].

\`\`\`typescript
afterEach(async () => {
  await dataSource.query('TRUNCATE users CASCADE');
  jest.clearAllMocks();
});

afterAll(async () => {
  await dataSource.destroy();
  await app.close();
});
\`\`\`

<b>Global setup.</b> Jest also supports a \`globalSetup\` and \`globalTeardown\` in the config, which run once per test run (not per file). Use this for expensive resources shared across files, like starting a database container [citation:5].

\`\`\`typescript
// jest.config.ts
export default {
  globalSetup: './test/global-setup.ts',
  globalTeardown: './test/global-teardown.ts',
};
\`\`\`

<b>What can go wrong?</b>
- <b>No teardown.</b> The database connection stays open, the test process hangs, or the next test run fails because of leftover state.
- <b>Expensive setup in \`beforeEach\`.</b> Every test pays the cost. Move it to \`beforeAll\`.
- <b>Mutable state in \`beforeAll\`.</b> Test A modifies a shared object, test B sees the change. Use \`beforeEach\` for anything that mutates.
- <b>Forgetting to await async setup.</b> Jest runs tests before setup completes. Always \`await\` or return the promise.
- <b>Order-dependent tests.</b> Tests pass when run in one order, fail in another. This is almost always a setup/teardown bug.
- <b>Not cleaning up mocks.</b> A mock's call history leaks into the next test. Use \`jest.clearAllMocks()\` in \`afterEach\` or \`beforeEach\`.
- <b>Closing the testing module in \`afterEach\`.</b> The module should be closed once in \`afterAll\`, not after every test. Closing it early causes "module has been closed" errors.

<b>How this appears in a real NestJS E2E test.</b> An end-to-end test uses the full lifecycle [citation:12]:

\`\`\`typescript
describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get<DataSource>(DataSource);
    await dataSource.runMigrations();
  });

  afterEach(async () => {
    // Clean data between tests, but keep the schema.
    await dataSource.query('TRUNCATE users, projects, tasks CASCADE');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register creates a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'ada@example.com', password: 'secret123' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /auth/login fails with wrong password', async () => {
    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ada@example.com', password: 'wrong' })
      .expect(401);
  });
});
\`\`\`

<b>How experienced engineers think.</b> Setup and teardown are not boilerplate — they are the foundation of reliable tests. A test that passes in isolation but fails in the suite is a test that will cause bugs in production. Isolate state, clean up thoroughly, and use the right hook for the job.
      `,
      diagram: `
Jest Lifecycle: Setup and Teardown

  beforeAll (outer)
      |
      +-- beforeEach (outer)
      |     |
      |     +-- beforeEach (inner, if in describe)
      |     |     |
      |     |     +-- TEST
      |     |     |
      |     |     +-- afterEach (inner)
      |     |
      |     +-- afterEach (outer)
      |
      +-- beforeEach (outer)
      |     |
      |     +-- TEST
      |     |
      |     +-- afterEach (outer)
      |
      +-- afterAll (outer)

  Order of execution:
    1. beforeAll (once, outer)
    2. For each test:
       a. beforeEach (outer)
       b. beforeEach (inner, if any)
       c. test
       d. afterEach (inner, if any)
       e. afterEach (outer)
    3. afterAll (once, outer)

  When to use which:
    beforeAll   -> expensive setup, once per file
    beforeEach  -> fresh state per test, mocks reset
    afterEach   -> clean up after each test (truncate DB)
    afterAll    -> close connections, destroy module
      `,
      codeExample: { title: "Example", code: `
// ============================================
// SETUP AND TEARDOWN IN NESTJS JEST TESTS
// ============================================

// ---------- 1. Full service unit test lifecycle ----------
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let module: TestingModule;
  let mockRepo: {
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  // Expensive setup: run once.
  beforeAll(async () => {
    mockRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    module = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  // Cheap setup: run before every test to reset mocks.
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Clean up after all tests.
  afterAll(async () => {
    await module.close();
  });

  it('should return a user', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Ada' });
    const result = await service.findById(1);
    expect(result.name).toBe('Ada');
  });
});

// ---------- 2. Nested describes with scoped setup ----------
describe('OrdersService', () => {
  let service: OrdersService;

  beforeEach(() => {
    // Applies to ALL tests in this file.
    jest.clearAllMocks();
  });

  describe('when the customer has a balance', () => {
    beforeEach(() => {
      // Applies ONLY to tests in this describe block.
      // Runs AFTER the outer beforeEach.
      mockBalanceRepo.findOneBy.mockResolvedValue({ balance: 100 });
    });

    it('should create the order', async () => {
      // ...
    });
  });

  describe('when the customer has no balance', () => {
    beforeEach(() => {
      mockBalanceRepo.findOneBy.mockResolvedValue({ balance: 0 });
    });

    it('should throw BadRequestException', async () => {
      // ...
    });
  });
});

// ---------- 3. E2E test lifecycle with a real database ----------
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  // One-time setup: boot the app and run migrations.
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    dataSource = module.get<DataSource>(DataSource);
    await dataSource.runMigrations();
  });

  // Reset data between tests, keep the schema.
  afterEach(async () => {
    await dataSource.query('TRUNCATE users, projects, tasks CASCADE');
  });

  // One-time teardown: close the app.
  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register creates a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'ada@example.com', password: 'secret123' })
      .expect(201);

    expect(res.body).toHaveProperty('accessToken');
  });

  it('POST /auth/login returns 401 for wrong password', async () => {
    // Seed a user first.
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'ada@example.com', password: 'secret123' });

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'ada@example.com', password: 'wrong' })
      .expect(401);
  });
});

// ---------- 4. Global setup for shared resources ----------
// jest.config.ts
export default {
  globalSetup: './test/global-setup.ts',
  globalTeardown: './test/global-teardown.ts',
  testEnvironment: 'node',
};

// test/global-setup.ts
import { execSync } from 'child_process';

export default async function globalSetup() {
  // Start a Docker container for the test database.
  execSync('docker compose -f docker-compose.test.yml up -d');
  // Wait for the database to be ready.
  await new Promise((r) => setTimeout(r, 5000));
}

// test/global-teardown.ts
import { execSync } from 'child_process';

export default async function globalTeardown() {
  execSync('docker compose -f docker-compose.test.yml down');
}

// ---------- 5. Common patterns ----------
// Reset all mocks before each test.
beforeEach(() => {
  jest.clearAllMocks(); // clears call history
});

// Or reset implementations too.
beforeEach(() => {
  jest.resetAllMocks(); // clears calls AND implementations
});

// Or restore spies to original implementations.
afterEach(() => {
  jest.restoreAllMocks(); // restores spied-on methods
});

// ---------- 6. What NOT to do ----------
// BAD: closing the module in afterEach.
afterEach(async () => {
  await module.close(); // This breaks every test after the first!
});

// GOOD: close the module once in afterAll.
afterAll(async () => {
  await module.close();
});

// BAD: mutable state in beforeAll.
beforeAll(() => {
  sharedArray = [];
});
it('test A', () => {
  sharedArray.push(1); // This leaks to test B!
});

// GOOD: fresh state in beforeEach.
beforeEach(() => {
  sharedArray = [];
});
      ` },
      keyTakeaways: [
        "`beforeAll` and `afterAll` run once per file (or describe block) — use them for expensive setup and teardown.",
        "`beforeEach` and `afterEach` run around every test — use them for fresh state and cleanup.",
        "Hooks inside a `describe` block apply only to that block and run after outer hooks of the same type.",
        "Always `await` async setup so Jest waits for completion before running tests.",
        "Use `afterEach` to reset mocks and clean test data; use `afterAll` to close the testing module and disconnect.",
        "Global `setup`/`teardown` in the Jest config run once per test run, for shared expensive resources.",
        "Tests must be isolated — setup and teardown are what make isolation possible.",
      ],
      commonMistakes: [
        "<b>No teardown.</b> The database connection stays open, the test process hangs, or leftover data breaks the next run. Always clean up.",
        "<b>Expensive setup in `beforeEach`.</b> Every test pays the cost. Move immutable setup to `beforeAll`.",
        "<b>Mutable state in `beforeAll`.</b> Test A modifies a shared object, test B sees the change. Use `beforeEach` for anything that mutates.",
        "<b>Forgetting to await async setup.</b> Jest runs tests before setup completes, causing flaky or failing tests. Always `await` or return the promise.",
        "<b>Order-dependent tests.</b> Tests pass in one order but fail in another. This is almost always a setup/teardown bug. Isolate state.",
        "<b>Closing the module in `afterEach`.</b> The module should be closed once in `afterAll`. Closing it after every test causes 'module has been closed' errors.",
        "<b>Not cleaning up mocks.</b> Mock call history leaks into the next test. Use `jest.clearAllMocks()` in `beforeEach` or `afterEach`.",
      ],
      quiz: [
        {
          question: "What is the difference between `beforeAll` and `beforeEach`?",
          options: [
            "They are aliases.",
            "`beforeAll` runs once per file/describe; `beforeEach` runs before every test.",
            "`beforeAll` runs before every test; `beforeEach` runs once.",
            "`beforeAll` is for async setup; `beforeEach` is for sync.",
          ],
          correctIndex: 1,
          explanation: "`beforeAll` is a one-time setup hook (per file or describe block). `beforeEach` runs before every single test. Use `beforeAll` for expensive setup, `beforeEach` for fresh state.",
        },
        {
          question: "In which order do the hooks execute?",
          options: [
            "beforeAll, test, beforeEach, afterEach, afterAll",
            "beforeAll, beforeEach (outer), beforeEach (inner), test, afterEach (inner), afterEach (outer), afterAll",
            "beforeEach, beforeAll, test, afterAll, afterEach",
            "beforeAll, test, afterAll",
          ],
          correctIndex: 1,
          explanation: "The order is: beforeAll (once), then for each test: beforeEach (outer), beforeEach (inner), test, afterEach (inner), afterEach (outer), and finally afterAll (once).",
        },
        {
          question: "Where should you close the NestJS testing module?",
          options: [
            "In `afterEach`.",
            "In `afterAll`.",
            "In `beforeEach`.",
            "Never — it closes automatically.",
          ],
          correctIndex: 1,
          explanation: "The testing module should be closed once in `afterAll`. Closing it in `afterEach` causes every test after the first to fail with 'module has been closed' errors.",
        },
        {
          question: "Why is it important to reset mocks between tests?",
          options: [
            "Because Jest requires it.",
            "Because mock call history and return values persist between tests, causing assertions to fail or pass for the wrong reasons.",
            "Because mocks consume memory.",
            "Because it makes tests run faster.",
          ],
          correctIndex: 1,
          explanation: "A mock's call history and configured return values persist across tests unless reset. This leaks state, causing flaky tests and false positives. Use `jest.clearAllMocks()` in `beforeEach`.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is the difference between `test` and `it` in Jest?",
      options: [
        "`test` is for unit tests, `it` is for integration tests.",
        "They are aliases — exactly the same function with different names.",
        "`test` runs before `it` in the same file.",
        "`it` does not support async functions.",
      ],
      correctIndex: 1,
      explanation: "The Jest documentation confirms that `test` and `it` are the same function. Use whichever reads better, but be consistent.",
    },
    {
      question: "What is the purpose of the `describe` block?",
      options: [
        "To run tests in parallel.",
        "To group related tests into a suite for organization and readable output.",
        "To assert values.",
        "To set up mock data.",
      ],
      correctIndex: 1,
      explanation: "`describe` creates a block that groups related tests. It organizes the output into a readable hierarchy.",
    },
    {
      question: "Which matcher should you use to check that an object has a specific shape?",
      options: [
        "`toBe`",
        "`toEqual` or `toStrictEqual`",
        "`toContain`",
        "`toMatch`",
      ],
      correctIndex: 1,
      explanation: "`toBe` checks reference identity and fails for objects. `toEqual` (or `toStrictEqual` for stricter checking) recursively compares every field.",
    },
    {
      question: "Why does `expect(0.1 + 0.2).toBe(0.3)` fail?",
      options: [
        "Because `toBe` does not support floating point.",
        "Because floating point arithmetic has rounding errors, so the result is not exactly 0.3.",
        "Because JavaScript does not support decimal numbers.",
        "Because you need to use `toEqual` instead.",
      ],
      correctIndex: 1,
      explanation: "Floating point numbers are approximations. Use `toBeCloseTo(0.3)` to allow for a small margin of error.",
    },
    {
      question: "What is the correct way to test that a function throws an error?",
      options: [
        "`expect(myFunction()).toThrow()`",
        "`expect(myFunction).toThrow()`",
        "`expect(() => myFunction()).toThrow()`",
        "`expect(myFunction).rejects.toThrow()`",
      ],
      correctIndex: 2,
      explanation: "You must wrap the function call in an arrow function. Without the wrapper, the error is thrown before `expect` can catch it.",
    },
    {
      question: "Why do we mock dependencies in unit tests?",
      options: [
        "To make tests slower.",
        "To isolate the code under test and avoid slow, unreliable, or external dependencies.",
        "Because Jest requires it.",
        "To test the dependencies themselves.",
      ],
      correctIndex: 1,
      explanation: "Mocking isolates the unit being tested from its dependencies. This makes tests fast, deterministic, and focused on the logic of the code under test.",
    },
    {
      question: "In NestJS, what is the correct way to provide a mock repository to a service in a unit test?",
      options: [
        "Import the real repository.",
        "Use `Test.createTestingModule()` with `{ provide: getRepositoryToken(Entity), useValue: mockRepo }`.",
        "Call the database directly.",
        "Use `jest.mock('typeorm')`.",
      ],
      correctIndex: 1,
      explanation: "NestJS's testing module lets you override providers. `getRepositoryToken(Entity)` is the token for a TypeORM repository, and `useValue` provides the mock.",
    },
    {
      question: "What does `jest.clearAllMocks()` do?",
      options: [
        "Deletes all mocks.",
        "Resets the call history of all mocks, so assertions like `toHaveBeenCalledTimes` start fresh.",
        "Restores the original implementations.",
        "Disables mocking for the current test file.",
      ],
      correctIndex: 1,
      explanation: "`clearAllMocks()` resets the call history (calls, instances, results) but keeps the mock implementations.",
    },
    {
      question: "What is the difference between `jest.mock()` and `jest.spyOn()`?",
      options: [
        "They are the same.",
        "`jest.mock()` replaces a whole module; `jest.spyOn()` wraps a specific method, allowing you to observe or override it.",
        "`jest.spyOn()` only works on classes.",
        "`jest.mock()` only works on functions.",
      ],
      correctIndex: 1,
      explanation: "`jest.mock()` replaces an entire module with a mock. `jest.spyOn()` targets a specific method on an object.",
    },
    {
      question: "What is the difference between `beforeAll` and `beforeEach`?",
      options: [
        "They are aliases.",
        "`beforeAll` runs once per file/describe; `beforeEach` runs before every test.",
        "`beforeAll` runs before every test; `beforeEach` runs once.",
        "`beforeAll` is for async setup; `beforeEach` is for sync.",
      ],
      correctIndex: 1,
      explanation: "`beforeAll` is a one-time setup hook (per file or describe block). `beforeEach` runs before every single test.",
    },
    {
      question: "In which order do the hooks execute?",
      options: [
        "beforeAll, test, beforeEach, afterEach, afterAll",
        "beforeAll, beforeEach (outer), beforeEach (inner), test, afterEach (inner), afterEach (outer), afterAll",
        "beforeEach, beforeAll, test, afterAll, afterEach",
        "beforeAll, test, afterAll",
      ],
      correctIndex: 1,
      explanation: "The order is: beforeAll (once), then for each test: beforeEach (outer), beforeEach (inner), test, afterEach (inner), afterEach (outer), and finally afterAll (once).",
    },
    {
      question: "Where should you close the NestJS testing module?",
      options: [
        "In `afterEach`.",
        "In `afterAll`.",
        "In `beforeEach`.",
        "Never — it closes automatically.",
      ],
      correctIndex: 1,
      explanation: "The testing module should be closed once in `afterAll`. Closing it in `afterEach` causes every test after the first to fail.",
    },
    {
      question: "Why is it important to reset mocks between tests?",
      options: [
        "Because Jest requires it.",
        "Because mock call history and return values persist between tests, causing assertions to fail or pass for the wrong reasons.",
        "Because mocks consume memory.",
        "Because it makes tests run faster.",
      ],
      correctIndex: 1,
      explanation: "A mock's call history and configured return values persist across tests unless reset. This leaks state, causing flaky tests.",
    },
    {
      question: "What is a test suite in Jest?",
      options: [
        "A single test case.",
        "A group of related tests created with `describe`.",
        "A mock function.",
        "A setup hook.",
      ],
      correctIndex: 1,
      explanation: "A test suite is a collection of related tests grouped by `describe`. It organizes tests into a readable hierarchy.",
    },
  ],
  project: {
    name: "Write a Comprehensive Jest Test Suite for the UsersModule",
    goal:
      "Apply every concept from today — test suites, matchers, mocking, setup and teardown — to write a complete unit test suite for a NestJS UsersModule with a UsersService, UsersController, and TypeORM repository.",
    brief:
      "You have a UsersModule with a service that depends on a TypeORM repository. Your job is to write a full Jest test suite that covers all public methods, all error paths, and all edge cases. The tests must be isolated, fast, and repeatable. This is the kind of test suite that ships to production.",
    steps: [
      "Create a new NestJS project with `nest new users-testing`. Add `@nestjs/typeorm`, `pg`, and `@nestjs/testing` (comes with NestJS).",
      "Define a `User` entity with `id`, `email`, `passwordHash`, `firstName`, `lastName`, and `createdAt`. Add a `UsersService` with methods: `findById`, `findByEmail`, `create`, `update`, `remove`, and `findAll`.",
      "Create a `users.service.spec.ts` file. Add a top-level `describe('UsersService')`.",
      "In `beforeAll`, create a mock repository with `jest.fn()` for each method the service uses (`findOneBy`, `find`, `save`, `create`, `delete`, `update`).",
      "In `beforeAll`, create a `TestingModule` that provides `UsersService` and the mock repository via `getRepositoryToken(User)`.",
      "In `beforeAll`, get the service instance from the module.",
      "In `beforeEach`, call `jest.clearAllMocks()` to reset mock state.",
      "In `afterAll`, call `module.close()`.",
      "Add a nested `describe('findById')`. Write tests for: user found, user not found, database error. Use `mockResolvedValue` and `mockRejectedValue`.",
      "Add a nested `describe('findByEmail')`. Write tests for: email found, email not found, case-insensitivity (if implemented).",
      "Add a nested `describe('create')`. Write tests for: successful creation (assert passwordHash is hashed, not plaintext), duplicate email throws ConflictException.",
      "Add a nested `describe('update')`. Write tests for: successful update, user not found, database error.",
      "Add a nested `describe('remove')`. Write tests for: successful removal, user not found.",
      "Add a nested `describe('findAll')`. Write tests for: returns array of users, returns empty array when none exist.",
      "Verify the test suite runs with `npm test users.service.spec.ts` and all tests pass.",
      "Run `npm test -- --coverage` and verify the service coverage is above 90%.",
    ],
    acceptance: [
      "`npm test` runs all tests and they pass.",
      "The test file has a clear hierarchy: `UsersService` → method → test case.",
      "Every public method of `UsersService` has at least one happy-path test and one error-path test.",
      "Mocks are reset in `beforeEach` so tests are isolated.",
      "`afterAll` closes the testing module.",
      "`npm test -- --coverage` shows >90% statement coverage for `users.service.ts`.",
      "No test depends on the order of other tests (verified by running with `--runInBand` and `--randomize`).",
    ],
    stretch: [
      "Add a `users.controller.spec.ts` that tests the controller with a mocked `UsersService`. Verify that the controller delegates to the service and returns the correct response.",
      "Add E2E tests in `test/users.e2e-spec.ts` using `supertest` and a real SQLite in-memory database. Use `beforeAll` to boot the app, `afterEach` to truncate tables, and `afterAll` to close the app.",
      "Add a `jest.config.ts` with `globalSetup` and `globalTeardown` that starts and stops a Docker PostgreSQL container for E2E tests.",
      "Add a custom matcher for common assertions, e.g. `expect(user).toBeValidUser()` that checks for required fields.",
      "Add a `test/helpers/` folder with a `createTestingModule()` helper that reduces boilerplate across test files.",
      "Add coverage thresholds in `jest.config.ts` so the test run fails if coverage drops below 90%.",
      "Add a `test:watch` npm script for fast iteration during development.",
    ],
  },
};
