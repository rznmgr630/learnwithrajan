import type { LessonDay } from "@/lib/learn/lesson-types";

export const DAY_64_LESSONS: LessonDay = {
  day: 64,
  title: "Mocking",
  totalMinutes: 90,
  difficulty: "Advanced",
  lessons: [
    {
      id: "day-64-lesson-1",
      title: "Test Doubles: Mock, Stub, Spy, Fake",
      durationMinutes: 22,
      explanation: `
<b>Imagine you are testing a service that sends emails.</b> Every time you run the test, it actually sends a real email to a real address. The test is slow, it depends on an external SMTP server, and if that server is down, the test fails for the wrong reason. Worse, you might spam your own inbox.

The solution is to replace the real email service with a <b>test double</b> — a stand-in object that looks and behaves like the real thing, but does nothing harmful. Test doubles are the foundation of isolated unit tests.

<b>What is a test double?</b> The term comes from filmmaking. A "stunt double" replaces an actor for dangerous scenes. A test double replaces a real dependency in a test so you can control its behavior and observe interactions without side effects.

The most common types of test doubles are: <b>Dummy, Stub, Spy, Mock, and Fake</b>. These terms are often used loosely, and their boundaries are fuzzy — but understanding the distinctions helps you choose the right tool for the job.

<b>Dummy.</b> A dummy is an object that is passed around but never actually used. It exists only to satisfy a method signature or a constructor parameter.

\`\`\`typescript
class DummyLogger {
  log() { /* does nothing */ }
}

// The service needs a logger, but this test does not trigger any logging.
const service = new MyService(new DummyLogger());
\`\`\`

Dummies are the simplest test double. If a test ever calls a method on a dummy, the test is probably doing something wrong.

<b>Stub.</b> A stub provides canned answers to calls made during a test. It does not record how it was called, and it has no expectations about behavior. It simply returns a pre-programmed value.

\`\`\`typescript
const stubRepo = {
  findById: () => ({ id: 1, name: 'Ada' }),
  save: () => undefined,
};

// The service calls findById and gets a hard-coded user back.
const user = await service.findById(1);
expect(user.name).toBe('Ada');
\`\`\`

Stubs are used when you need the code under test to receive a specific value. The test does not care <i>how</i> the stub was called — only that the code under test received the right data.

<b>Spy.</b> A spy wraps a real object and records how it was called. It can either call through to the real implementation or replace it. The key trait of a spy is that it <b>records invocations</b> for later verification.

\`\`\`typescript
const spy = jest.spyOn(emailService, 'send');
await service.register({ email: 'ada@example.com' });

expect(spy).toHaveBeenCalledWith('ada@example.com', expect.any(String));
\`\`\`

Spies are used when you want to verify that a method was called, with what arguments, and how many times. In Jest, \`jest.spyOn()\` creates a spy that by default calls through to the real method.

<b>Mock.</b> A mock is like a spy but with <b>pre-programmed expectations</b>. You define how the mock should be used before the test runs, and the mock fails the test if those expectations are not met. In practice, the distinction between spy and mock is blurry — many developers use "mock" to mean any test double.

In Jest, \`jest.fn()\` creates a mock function. You program it with \`mockReturnValue\`, \`mockResolvedValue\`, or \`mockImplementation\`, and you assert on it with \`toHaveBeenCalled\`, \`toHaveBeenCalledWith\`, etc.

\`\`\`typescript
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
  save: jest.fn().mockResolvedValue(undefined),
};

await service.findById(1);

expect(mockRepo.findById).toHaveBeenCalledWith(1);
\`\`\`

<b>Fake.</b> A fake is a test double with a <b>working implementation</b> that is simpler than the real thing and unsuitable for production. The classic example is an in-memory database.

\`\`\`typescript
class FakeUserRepository implements UserRepository {
  private users: User[] = [];

  async findById(id: number) {
    return this.users.find(u => u.id === id) ?? null;
  }

  async save(user: User) {
    this.users.push(user);
    return user;
  }

  async delete(id: number) {
    this.users = this.users.filter(u => u.id !== id);
  }
}
\`\`\`

Fakes are powerful because they let you test real interactions (like storing and retrieving data) without the overhead of a real database. They are often preferred over mocks because they exercise the code under test more realistically .

<b>Comparing the types:</b>

| Type | Has behavior? | Records calls? | Verifies expectations? |
|------|---------------|----------------|------------------------|
| Dummy | No | No | No |
| Stub | Returns canned values | No | No |
| Spy | Calls through or replaces | Yes | After the test |
| Mock | Programmed behavior | Yes | During or after |
| Fake | Working implementation | No (usually) | No |

<b>Why the terminology is fuzzy.</b> Martin Fowler's classic article "Mocks Aren't Stubs" distinguishes them, but in practice the boundaries blur. A stub that records calls becomes a spy. A spy with pre-programmed expectations becomes a mock. Many people use "mock" generically to mean any test double . What matters is not the label, but whether the test double is the right tool for the job.

<b>When to use which:</b>
- <b>Dummy:</b> when you need to satisfy a parameter but the test never uses it.
- <b>Stub:</b> when the code under test needs a specific return value to proceed.
- <b>Spy:</b> when you need to verify that a method was called, but you do not want to replace its behavior.
- <b>Mock:</b> when you need to control behavior <i>and</i> verify interactions.
- <b>Fake:</b> when you need a working implementation that is faster or simpler than the real thing.

<b>What can go wrong?</b>
- <b>Using a real dependency instead of a double.</b> The test becomes slow, flaky, and side-effect-prone.
- <b>Over-verifying with mocks.</b> If every test asserts on every mock call, the tests become brittle and break when you refactor. Verify only what matters.
- <b>Building a fake that is too complex.</b> If your fake has bugs, your tests pass or fail for the wrong reasons. Keep fakes simple.
- <b>Confusing the terminology.</b> Calling something a "mock" when it is a "stub" leads to confusion in code review. Be precise when it matters.
- <b>Using a spy when a stub would do.</b> If you do not care about the call, do not spy on it. Simpler tests are better tests.
- <b>Assuming mocks and fakes are equivalent.</b> Mocks verify interactions; fakes verify state. They catch different bugs. Use the one that fits the test's intent.

<b>How this appears in a real NestJS test.</b> A typical service test uses several types:

\`\`\`typescript
// Dummy: a logger that is never used in this test.
const logger = { log: jest.fn(), error: jest.fn() };

// Stub: a repository that returns a fixed user.
const stubRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
};

// Fake: an in-memory repository for integration-style tests.
const fakeRepo = new FakeUserRepository();

// Spy: verify that the email service was called.
const emailSpy = jest.spyOn(emailService, 'send');
\`\`\`

<b>How experienced engineers think.</b> The test double is a design decision. A mock is not "better" than a stub — they verify different things. A fake is often the most valuable because it exercises the code under test more realistically. The right choice depends on what the test is trying to prove.
      `,
      diagram: `
Test Doubles: A Continuum

  Dummy          Stub          Spy           Mock          Fake
  (passed)       (returns)     (records)     (expects)     (works)
    |              |             |             |             |
    v              v             v             v             v
  never used   canned value  call history   expectations  real logic
                                                before       simplified

  Examples in Jest:
    Dummy:  { log: () => {} }
    Stub:   jest.fn().mockReturnValue(x)
    Spy:    jest.spyOn(obj, 'method')
    Mock:   jest.fn().mockResolvedValue(x)
    Fake:   class InMemoryRepository { ... }

  When to use:
    Dummy  -> satisfy a parameter, never call it
    Stub   -> code needs a specific return value
    Spy    -> verify a method was called
    Mock   -> control behavior AND verify interactions
    Fake   -> need a working implementation (in-memory DB)

  Key insight:
    The boundaries are fuzzy.
    What matters is matching the double to the test's intent.
      `,
      codeExample: { title: "Example", code: `
// ============================================
// TEST DOUBLES: DUMMY, STUB, SPY, MOCK, FAKE
// ============================================

// ---------- 1. Dummy ----------
// A dummy is passed but never used.
const dummyLogger = {
  log: () => {},
  error: () => {},
  warn: () => {},
};

// The service needs a logger, but this test does not trigger logging.
const service = new UsersService(mockRepo, dummyLogger);

// ---------- 2. Stub ----------
// A stub returns canned answers.
const stubRepo = {
  findById: () => ({ id: 1, name: 'Ada' }),
  save: () => undefined,
};

const user = await service.findById(1);
expect(user.name).toBe('Ada');

// With Jest:
const stubRepoJest = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
  save: jest.fn().mockResolvedValue(undefined),
};

// ---------- 3. Spy ----------
// A spy wraps a real method and records calls.
const spy = jest.spyOn(emailService, 'send');
await service.register({ email: 'ada@example.com', password: 'secret' });

expect(spy).toHaveBeenCalledWith(
  'ada@example.com',
  expect.any(String),
);

// Restore the original method after the test.
spy.mockRestore();

// Spy with a mock implementation:
const spyWithImpl = jest.spyOn(emailService, 'send')
  .mockResolvedValue(undefined);

// Spy on a getter:
const getterSpy = jest.spyOn(obj, 'value', 'get')
  .mockReturnValue('mocked');

// ---------- 4. Mock (Jest-style) ----------
// A mock is a function with programmable behavior and call tracking.
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
  save: jest.fn().mockResolvedValue(undefined),
  delete: jest.fn().mockResolvedValue(undefined),
};

await service.findById(1);
expect(mockRepo.findById).toHaveBeenCalledWith(1);
expect(mockRepo.findById).toHaveBeenCalledTimes(1);

// Programmable sequences:
const mockSeq = jest.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

mockSeq(); // 'first'
mockSeq(); // 'second'
mockSeq(); // 'default'

// Async mocks:
const mockAsync = jest.fn().mockResolvedValue({ id: 1 });
const mockFail = jest.fn().mockRejectedValue(new Error('DB down'));

// ---------- 5. Fake ----------
// A fake is a working implementation that is simpler than the real thing.
class FakeUserRepository {
  private users: Map<number, User> = new Map();
  private nextId = 1;

  async findById(id: number): Promise<User | null> {
    return this.users.get(id) ?? null;
  }

  async save(user: Partial<User>): Promise<User> {
    const id = user.id ?? this.nextId++;
    const saved = { ...user, id } as User;
    this.users.set(id, saved);
    return saved;
  }

  async delete(id: number): Promise<void> {
    this.users.delete(id);
  }

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }
}

// Usage in a test:
const fakeRepo = new FakeUserRepository();
const testService = new UsersService(fakeRepo, dummyLogger);

const created = await testService.create({
  email: 'ada@example.com',
  password: 'secret',
});

expect(created.id).toBe(1);

const found = await testService.findById(1);
expect(found.email).toBe('ada@example.com');

// ---------- 6. Choosing the right double ----------
// Scenario: testing UsersService.findById
// - The repo is a dependency. We need it to return a value.
//   -> STUB (or a MOCK with mockResolvedValue)

// Scenario: testing UsersService.register
// - We need to verify that the email service was called.
//   -> SPY on emailService.send

// Scenario: testing UsersService.create
// - We need a repository that actually stores and retrieves.
//   -> FAKE (in-memory repo)

// Scenario: testing a method that takes a logger but never logs.
//   -> DUMMY logger

// ---------- 7. Full example: testing with a fake and a spy ----------
describe('UsersService with a fake repository', () => {
  let service: UsersService;
  let fakeRepo: FakeUserRepository;
  let emailSpy: jest.SpyInstance;

  beforeEach(() => {
    fakeRepo = new FakeUserRepository();
    service = new UsersService(fakeRepo, dummyLogger);
    emailSpy = jest.spyOn(emailService, 'send').mockResolvedValue(undefined);
  });

  afterEach(() => {
    emailSpy.mockRestore();
  });

  it('should create a user and send a welcome email', async () => {
    const user = await service.register({
      email: 'ada@example.com',
      password: 'secret',
    });

    // State-based assertion (fake).
    expect(user.id).toBeDefined();

    const stored = await fakeRepo.findById(user.id);
    expect(stored).not.toBeNull();
    expect(stored!.email).toBe('ada@example.com');

    // Interaction-based assertion (spy).
    expect(emailSpy).toHaveBeenCalledWith(
      'ada@example.com',
      expect.stringContaining('Welcome'),
    );
  });
});
      ` },
      keyTakeaways: [
        "A test double replaces a real dependency in a test to keep tests fast, isolated, and deterministic.",
        "Dummy: passed but never used. Stub: returns canned values. Spy: records calls. Mock: programmed behavior with expectations. Fake: working simplified implementation.",
        "The boundaries between these types are fuzzy — what matters is matching the double to the test's intent.",
        "Use stubs when the code under test needs a return value; use spies when you need to verify a call was made.",
        "Use fakes (like in-memory repositories) when you need a working implementation that exercises real interactions.",
        "Over-verifying with mocks makes tests brittle. Verify only what matters to the test's purpose.",
        "Jest provides `jest.fn()` for mocks, `jest.spyOn()` for spies, and manual mocks for module-level replacement.",
      ],
      commonMistakes: [
        "<b>Using a real dependency instead of a double.</b> The test becomes slow, flaky, and side-effect-prone. Always replace external dependencies.",
        "<b>Over-verifying with mocks.</b> If every test asserts on every mock call, tests break when you refactor. Verify only what the test is actually about.",
        "<b>Building a fake that is too complex.</b> If your fake has bugs, tests pass or fail for the wrong reasons. Keep fakes simple and focused.",
        "<b>Confusing stubs and mocks.</b> A stub returns a value; a mock verifies interactions. Using the wrong one means the test does not actually verify what you intended.",
        "<b>Using a spy when a stub would do.</b> If you do not care about the call, do not spy on it. Simpler tests are better.",
        "<b>Forgetting to restore spies.</b> A spy that replaces a method can leak into other tests. Use `mockRestore()` in `afterEach`.",
      ],
      quiz: [
        {
          question:
            "Which test double has a working implementation that is simpler than the real thing?",
          options: [
            "Dummy",
            "Stub",
            "Spy",
            "Fake",
          ],
          correctIndex: 3,
          explanation:
            "A fake has a real, working implementation that is unsuitable for production (like an in-memory database). It exercises the code under test more realistically than a stub or mock.",
        },
        {
          question:
            "What is the key trait that distinguishes a spy from a stub?",
          options: [
            "A spy returns canned values; a stub records calls.",
            "A spy records calls for later verification; a stub only returns values.",
            "A spy is faster than a stub.",
            "A spy cannot be used with Jest.",
          ],
          correctIndex: 1,
          explanation:
            "A spy wraps a real object and records how it was called (arguments, call count, etc.) for verification. A stub simply returns a pre-programmed value and does not record calls.",
        },
        {
          question:
            "When should you use a dummy?",
          options: [
            "When the code under test needs a specific return value.",
            "When you need to verify that a method was called.",
            "When you need to satisfy a method parameter that the test never actually uses.",
            "When you need a working in-memory implementation.",
          ],
          correctIndex: 2,
          explanation:
            "A dummy is passed to satisfy a parameter but is never actually used. It exists only to fill a required slot, like a logger that is never called in the test.",
        },
        {
          question:
            "Why is over-verifying with mocks considered a problem?",
          options: [
            "Because mocks are slow.",
            "Because tests become brittle and break when you refactor, even if the behavior is correct.",
            "Because mocks consume too much memory.",
            "Because Jest does not support over-verification.",
          ],
          correctIndex: 1,
          explanation:
            "Over-verifying means asserting on every mock interaction. When you refactor (e.g. reorder calls or add a new call), the tests break even though the behavior is still correct. Verify only what the test is actually about.",
        },
      ],
    },
    {
      id: "day-64-lesson-2",
      title: "jest.fn(): Mock Functions in Jest",
      durationMinutes: 22,
      explanation: `
<b>Jest provides a built-in way to create mock functions: \`jest.fn()\`.</b> This is the most fundamental mocking tool in Jest. A mock function does three things:
1. Records every call it receives (arguments, call count).
2. Lets you program its return value.
3. Lets you assert on how it was called.

\`\`\`typescript
const mockFn = jest.fn();
mockFn('hello', 'world');

expect(mockFn).toHaveBeenCalledWith('hello', 'world');
expect(mockFn).toHaveBeenCalledTimes(1);
\`\`\`

<b>Why use \`jest.fn()\`?</b> Because it lets you replace a dependency with a controllable, observable fake. You can inject it into your service, program it to return whatever the test needs, and then assert that the service called it correctly.

<b>The \`.mock\` property.</b> Every mock function has a \`.mock\` property that contains data about how it was called :

\`\`\`typescript
const mockFn = jest.fn();
mockFn('first', 1);
mockFn('second', 2);

expect(mockFn.mock.calls).toEqual([
  ['first', 1],
  ['second', 2],
]);

expect(mockFn.mock.calls[0][0]).toBe('first');
expect(mockFn.mock.calls[1][1]).toBe(2);
expect(mockFn.mock.lastCall).toEqual(['second', 2]);
\`\`\`

The \`.mock\` property also tracks \`instances\` (for constructor calls), \`contexts\` (\`this\` values), and \`results\` (return values) .

<b>Programming return values.</b> The most common use of \`jest.fn()\` is to control what the mock returns :

\`\`\`typescript
// Always returns the same value.
const mockFn = jest.fn().mockReturnValue(42);
mockFn(); // 42
mockFn(); // 42

// Returns different values on successive calls.
const mockSeq = jest.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

mockSeq(); // 'first'
mockSeq(); // 'second'
mockSeq(); // 'default'
mockSeq(); // 'default'
\`\`\`

<b>Programming async return values.</b> For async functions, use \`mockResolvedValue\` and \`mockRejectedValue\` :

\`\`\`typescript
const mockAsync = jest.fn().mockResolvedValue({ id: 1, name: 'Ada' });
const result = await mockAsync();
// { id: 1, name: 'Ada' }

const mockFail = jest.fn().mockRejectedValue(new Error('DB down'));
await expect(mockFail()).rejects.toThrow('DB down');
\`\`\`

<b>Programming custom implementations.</b> When you need the mock to execute logic, use \`mockImplementation\` :

\`\`\`typescript
const mockAdd = jest.fn().mockImplementation((a: number, b: number) => a + b);
mockAdd(2, 3); // 5

const mockFind = jest.fn().mockImplementation((id: number) => {
  if (id === 1) return { id: 1, name: 'Ada' };
  return null;
});
\`\`\`

<b>\`mockReturnValue\` vs \`mockImplementation\`.</b> Use \`mockReturnValue\` when the mock simply returns a static value. Use \`mockImplementation\` when the mock needs to execute logic, use arguments, or produce side effects .

<b>Resetting mocks.</b> Mock state persists between tests. You must reset mocks to prevent leakage :

| Method | Effect |
|--------|--------|
| \`mockClear()\` | Clears call history (\`.mock.calls\`, \`.mock.instances\`) |
| \`mockReset()\` | Clears call history <i>and</i> resets return values |
| \`mockRestore()\` | Restores original implementation (spyOn only) |

\`\`\`typescript
beforeEach(() => {
  jest.clearAllMocks(); // or resetAllMocks()
});
\`\`\`

<b>What can go wrong?</b>
- <b>Forgetting to reset mocks.</b> A mock that was called in one test still shows the call in the next test. Assertions pass or fail for the wrong reasons. Use \`clearAllMocks()\` in \`beforeEach\`.
- <b>Using \`mockReturnValue\` when the mock needs to use arguments.</b> If the test passes different arguments and expects different results, \`mockReturnValue\` always returns the same thing. Use \`mockImplementation\`.
- <b>Not programming the mock.</b> A bare \`jest.fn()\` returns \`undefined\`. If the code under test expects a value, it will fail with \`undefined\`. Always program the mock.
- <b>Over-programming the mock.</b> If you add \`mockReturnValueOnce\` for every call, the test becomes brittle. Program only what the test needs.
- <b>Forgetting \`await\` on async mocks.</b> \`mockResolvedValue\` returns a promise. If you do not \`await\` it, the test proceeds before the promise resolves.
- <b>Using \`jest.fn()\` for a method that should be spied on.</b> If you want to observe a real method without replacing it, use \`jest.spyOn()\` instead.

<b>How this appears in a real NestJS test.</b> A service test typically creates a mock repository and injects it:

\`\`\`typescript
const mockRepo = {
  findById: jest.fn().mockResolvedValue({ id: 1, name: 'Ada' }),
  save: jest.fn().mockImplementation(async (user) => ({ ...user, id: 1 })),
};

const module = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: getRepositoryToken(User), useValue: mockRepo },
  ],
}).compile();

// In a test:
mockRepo.findById.mockResolvedValueOnce(null);
const result = await service.findById(999);
expect(result).toBeNull();
\`\`\`

<b>How experienced engineers think.</b> \`jest.fn()\` is the workhorse of Jest mocking. It is simple, flexible, and covers the vast majority of unit test needs. The key discipline is resetting mocks between tests and programming them to reflect realistic behavior, not just happy paths.
      `,
      diagram: `
jest.fn() — Mock Function API

  Creation:
    const fn = jest.fn();

  Call tracking:
    fn.mock.calls         -> array of call argument arrays
    fn.mock.instances     -> array of \`this\` instances
    fn.mock.contexts      -> array of \`this\` values
    fn.mock.results       -> array of return/throw results
    fn.mock.lastCall      -> arguments of the most recent call

  Programming:
    .mockReturnValue(x)           -> always return x
    .mockReturnValueOnce(x)       -> return x once, then fall through
    .mockImplementation(fn)       -> custom logic
    .mockImplementationOnce(fn)   -> custom logic once
    .mockResolvedValue(x)         -> async: resolve with x
    .mockRejectedValue(err)       -> async: reject with err

  Assertions:
    expect(fn).toHaveBeenCalled()
    expect(fn).toHaveBeenCalledWith(...)
    expect(fn).toHaveBeenCalledTimes(n)
    expect(fn).toHaveReturnedWith(x)

  Reset:
    fn.mockClear()      -> clear calls
    fn.mockReset()      -> clear calls + return values
    jest.clearAllMocks() -> all mocks
    jest.resetAllMocks() -> all mocks, full reset
      `,
      codeExample: { title: "Example", code: `
// ============================================
// jest.fn() — MOCK FUNCTIONS IN PRACTICE
// ============================================

// ---------- 1. Basic mock function ----------
const mockFn = jest.fn();

mockFn('hello', 42);
mockFn('world', 43);

expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('hello', 42);
expect(mockFn.mock.calls[0]).toEqual(['hello', 42]);
expect(mockFn.mock.lastCall).toEqual(['world', 43]);

// ---------- 2. Return values ----------
// Static value.
const mockReturn = jest.fn().mockReturnValue(42);
expect(mockReturn()).toBe(42);
expect(mockReturn()).toBe(42);

// Sequential values.
const mockSeq = jest.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default');

expect(mockSeq()).toBe('first');
expect(mockSeq()).toBe('second');
expect(mockSeq()).toBe('default');
expect(mockSeq()).toBe('default');

// ---------- 3. Custom implementation ----------
const mockAdd = jest.fn().mockImplementation((a: number, b: number) => a + b);
expect(mockAdd(2, 3)).toBe(5);
expect(mockAdd(10, 20)).toBe(30);

// Implementation that uses arguments.
const mockFind = jest.fn().mockImplementation((id: number) => {
  if (id === 1) return { id: 1, name: 'Ada' };
  return null;
});
expect(mockFind(1)).toEqual({ id: 1, name: 'Ada' });
expect(mockFind(999)).toBeNull();

// ---------- 4. Async mocks ----------
const mockAsync = jest.fn().mockResolvedValue({ id: 1, name: 'Ada' });
const result = await mockAsync();
expect(result.name).toBe('Ada');

const mockFail = jest.fn().mockRejectedValue(new Error('DB down'));
await expect(mockFail()).rejects.toThrow('DB down');

// Async with once:
const mockAsyncSeq = jest.fn()
  .mockResolvedValueOnce('first')
  .mockResolvedValueOnce('second')
  .mockResolvedValue('default');

expect(await mockAsyncSeq()).toBe('first');
expect(await mockAsyncSeq()).toBe('second');
expect(await mockAsyncSeq()).toBe('default');

// ---------- 5. NestJS service test with jest.fn() ----------
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: {
    findById: jest.Mock;
    findOneBy: jest.Mock;
    save: jest.Mock;
  };

  beforeEach(async () => {
    mockRepo = {
      findById: jest.fn(),
      findOneBy: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a user when found', async () => {
    mockRepo.findOneBy.mockResolvedValue({ id: 1, name: 'Ada' });

    const result = await service.findById(1);

    expect(result).toEqual({ id: 1, name: 'Ada' });
    expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
  });

  it('should return null when not found', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);

    const result = await service.findById(999);

    expect(result).toBeNull();
  });

  it('should handle a database error', async () => {
    mockRepo.findOneBy.mockRejectedValue(new Error('DB connection lost'));

    await expect(service.findById(1)).rejects.toThrow('DB connection lost');
  });

  it('should save a user', async () => {
    mockRepo.save.mockImplementation(async (user) => ({ ...user, id: 1 }));

    const result = await service.create({ email: 'ada@example.com' });

    expect(result.id).toBe(1);
    expect(mockRepo.save).toHaveBeenCalledWith({
      email: 'ada@example.com',
    });
  });
});

// ---------- 6. Reset patterns ----------
// Clear call history between tests.
beforeEach(() => {
  jest.clearAllMocks();
});

// Reset call history AND return values.
beforeEach(() => {
  jest.resetAllMocks();
});

// For a single mock:
mockRepo.findOneBy.mockReset();

// ---------- 7. Common mistakes ----------
// BAD: bare jest.fn() returns undefined, breaking the service.
const badMock = jest.fn();
// await service.findById(1) -> undefined.name -> crash

// GOOD: program the mock.
const goodMock = jest.fn().mockResolvedValue({ id: 1, name: 'Ada' });

// BAD: forgetting to await async mock.
// const result = mockAsync(); // result is a Promise, not the value.

// GOOD:
const result = await mockAsync();
      ` },
      keyTakeaways: [
        "`jest.fn()` creates a mock function that records calls and lets you program return values.",
        "Use `.mockReturnValue()` for static values, `.mockResolvedValue()` for async, and `.mockImplementation()` for custom logic.",
        "Use `.mockReturnValueOnce()` and `.mockResolvedValueOnce()` for sequential behavior across calls.",
        "The `.mock` property exposes call history: `.calls`, `.instances`, `.results`, `.lastCall`.",
        "Always reset mocks between tests with `jest.clearAllMocks()` or `jest.resetAllMocks()`.",
        "A bare `jest.fn()` returns `undefined` — always program it with the value the code under test expects.",
        "Use `jest.fn()` for dependencies you need to control; use `jest.spyOn()` to observe real methods.",
      ],
      commonMistakes: [
        "<b>Forgetting to reset mocks.</b> Mock state persists between tests. Use `clearAllMocks()` in `beforeEach`.",
        "<b>Using `mockReturnValue` when the mock needs arguments.</b> If different arguments should produce different results, use `mockImplementation` instead.",
        "<b>Not programming the mock.</b> A bare `jest.fn()` returns `undefined`, which often crashes the code under test.",
        "<b>Forgetting `await` on async mocks.</b> `mockResolvedValue` returns a promise. Without `await`, the test proceeds before the value is available.",
        "<b>Over-programming with `mockReturnValueOnce`.</b> Adding once-values for every call makes tests brittle. Program only what is needed.",
        "<b>Using `jest.fn()` when `jest.spyOn()` is better.</b> If you want to observe a real method without replacing it, use `spyOn`.",
      ],
      quiz: [
        {
          question:
            "What does a bare `jest.fn()` return when called?",
          options: [
            "A random value",
            "`undefined`",
            "An empty object",
            "A promise",
          ],
          correctIndex: 1,
          explanation:
            "A bare `jest.fn()` has no programmed return value, so it returns `undefined`. You must program it with `mockReturnValue`, `mockResolvedValue`, or `mockImplementation`.",
        },
        {
          question:
            "Which method should you use to make a mock return different values on successive calls?",
          options: [
            "`mockReturnValue`",
            "`mockImplementation`",
            "`mockReturnValueOnce`",
            "`mockResolvedValue`",
          ],
          correctIndex: 2,
          explanation:
            "`mockReturnValueOnce` returns a value only for the next call. Chain multiple `mockReturnValueOnce` calls, then use `mockReturnValue` as the default for subsequent calls.",
        },
        {
          question:
            "What is the difference between `mockResolvedValue` and `mockReturnValue`?",
          options: [
            "They are aliases.",
            "`mockResolvedValue` returns a promise that resolves to the value; `mockReturnValue` returns the value directly.",
            "`mockResolvedValue` is for sync functions.",
            "`mockReturnValue` is for async functions.",
          ],
          correctIndex: 1,
          explanation:
            "`mockResolvedValue(x)` is shorthand for `mockImplementation(() => Promise.resolve(x))`. Use it for async dependencies. `mockReturnValue(x)` returns `x` directly.",
        },
        {
          question:
            "What does `jest.clearAllMocks()` do?",
          options: [
            "Deletes all mocks.",
            "Clears the call history of all mocks.",
            "Resets return values to their defaults.",
            "Restores original implementations.",
          ],
          correctIndex: 1,
          explanation:
            "`clearAllMocks()` clears `.mock.calls` and `.mock.instances` but keeps the programmed return values. Use `resetAllMocks()` to also reset implementations.",
        },
      ],
    },
    {
      id: "day-64-lesson-3",
      title: "jest.spyOn(): Spying on Methods",
      durationMinutes: 22,
      explanation: `
<b>Sometimes you do not want to replace a dependency — you just want to watch it.</b> You want to verify that a method was called, with what arguments, and how many times. But you still want the real method to run. This is where \`jest.spyOn()\` comes in.

<b>What is a spy?</b> A spy wraps an existing method and records how it was called. By default, the real implementation still runs. You can also replace the implementation if you need to .

\`\`\`typescript
const spy = jest.spyOn(emailService, 'send');
await service.register({ email: 'ada@example.com' });

expect(spy).toHaveBeenCalledWith('ada@example.com', expect.any(String));
spy.mockRestore();
\`\`\`

<b>Why use \`spyOn\` instead of \`jest.fn()\`?</b> Because you want to observe a real method on a real object without replacing the whole object. For example, if you have an \`EmailService\` instance and you want to verify that \`send\` was called, \`spyOn\` is the right tool.

<b>How \`spyOn\` works.</b> \`jest.spyOn(object, methodName)\` replaces \`object.methodName\` with a mock function that calls through to the original. The original is saved, and you can restore it with \`mockRestore()\` .

\`\`\`typescript
const video = {
  play() { return true; },
};

const spy = jest.spyOn(video, 'play');
video.play(); // real implementation runs, returns true

expect(spy).toHaveBeenCalled();
spy.mockRestore(); // restores the original method
\`\`\`

<b>Replacing the implementation.</b> You can override the real method with \`mockImplementation\`, \`mockReturnValue\`, etc. :

\`\`\`typescript
const spy = jest.spyOn(userService, 'findById')
  .mockResolvedValue({ id: 1, name: 'Ada' });

const user = await userService.findById(1); // returns the mock value
expect(user.name).toBe('Ada');
\`\`\`

<b>Spying on getters and setters.</b> Use the third argument to specify \`'get'\` or \`'set'\` :

\`\`\`typescript
const obj = {
  get value() { return 'original'; },
};

const getterSpy = jest.spyOn(obj, 'value', 'get').mockReturnValue('mocked');

expect(obj.value).toBe('mocked');
\`\`\`

<b>Spying on class methods.</b> Create an instance and spy on the method:

\`\`\`typescript
const service = new UserService();
const spy = jest.spyOn(service, 'findById').mockResolvedValue({ id: '123' });

await service.findById('123');
expect(spy).toHaveBeenCalledWith('123');
\`\`\`

<b>Spying on module methods.</b> When you import a module, you can spy on its exports:

\`\`\`typescript
import * as utils from './utils';
const spy = jest.spyOn(utils, 'formatDate').mockReturnValue('2026-01-01');
\`\`\`

<b>Restoring spies.</b> A spy replaces the original method. If you do not restore it, the spy leaks into other tests. Use \`mockRestore()\` or \`jest.restoreAllMocks()\` in \`afterEach\` .

\`\`\`typescript
afterEach(() => {
  jest.restoreAllMocks();
});
\`\`\`

<b>What can go wrong?</b>
- <b>Forgetting to restore.</b> The spy replaces the method for all subsequent tests. Use \`restoreAllMocks()\` in \`afterEach\`.
- <b>Spying on a method that does not exist.</b> \`jest.spyOn\` throws if the method is not a function. Ensure the method exists on the object.
- <b>Spying on a private method.</b> Private methods are not accessible. Use bracket notation with \`as any\` if you must, but prefer testing through the public interface.
- <b>Assuming \`spyOn\` replaces the implementation.</b> By default, it calls through. Use \`.mockImplementation()\` or \`.mockResolvedValue()\` to replace it.
- <b>Spying on the code under test.</b> If you spy on the method you are testing, you are not testing it. Spy on dependencies, not the subject.
- <b>Not using \`restoreAllMocks\`.</b> Individual \`mockRestore()\` calls are easy to forget. Use the global version in \`afterEach\`.

<b>How this appears in a real NestJS test.</b> A controller test might spy on the service to verify delegation:

\`\`\`typescript
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  it('should call service.findById', async () => {
    const spy = jest.spyOn(service, 'findById').mockResolvedValue({ id: 1 });
    await controller.findOne('1');
    expect(spy).toHaveBeenCalledWith(1);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
});
\`\`\`

<b>How experienced engineers think.</b> Spies are for observation, not replacement. If you need to control behavior, use \`mockImplementation\`. If you need to verify a call, use a spy. The two are often combined: spy on a dependency, replace its return value, and assert on the call.
      `,
      diagram: `
jest.spyOn() — Spying on Methods

  Without spyOn:
    const service = new EmailService();
    await service.send('ada@example.com');
    // How do you know it was called? You don't.

  With spyOn:
    const spy = jest.spyOn(service, 'send');
    await service.send('ada@example.com');
    // Real implementation runs, AND the call is recorded.

    expect(spy).toHaveBeenCalledWith('ada@example.com');
    spy.mockRestore(); // put the original back

  Replace implementation:
    jest.spyOn(service, 'send')
      .mockResolvedValue(undefined);
    // Real implementation is replaced.

  Spy on getter/setter:
    jest.spyOn(obj, 'prop', 'get').mockReturnValue('x');
    jest.spyOn(obj, 'prop', 'set');

  Spy on module method:
    import * as utils from './utils';
    jest.spyOn(utils, 'formatDate').mockReturnValue('2026-01-01');

  Cleanup:
    spy.mockRestore()          -> restore one spy
    jest.restoreAllMocks()     -> restore all spies (use in afterEach)
      `,
      codeExample: { title: "Example", code: `
// ============================================
// jest.spyOn() — SPYING ON METHODS
// ============================================

// ---------- 1. Basic spy (calls through) ----------
const emailService = {
  send: async (to: string, body: string) => {
    console.log(\`Sending email to \${to}\`);
    return true;
  },
};

const spy = jest.spyOn(emailService, 'send');
await emailService.send('ada@example.com', 'Hello');

expect(spy).toHaveBeenCalledTimes(1);
expect(spy).toHaveBeenCalledWith('ada@example.com', 'Hello');
spy.mockRestore();

// ---------- 2. Spy with replaced implementation ----------
const userService = {
  findById: async (id: number) => {
    throw new Error('Real method should not be called');
  },
};

const mockSpy = jest.spyOn(userService, 'findById')
  .mockResolvedValue({ id: 1, name: 'Ada' });

const user = await userService.findById(1);
expect(user.name).toBe('Ada');

// ---------- 3. Spy on a getter ----------
const obj = {
  _value: 'original',
  get value() { return this._value; },
};

const getterSpy = jest.spyOn(obj, 'value', 'get').mockReturnValue('mocked');
expect(obj.value).toBe('mocked');
getterSpy.mockRestore();

// ---------- 4. Spy on a class method ----------
class UserService {
  async findById(id: number): Promise<{ id: number; name: string }> {
    return { id, name: 'Real User' };
  }
}

const instance = new UserService();
const classSpy = jest.spyOn(instance, 'findById')
  .mockResolvedValue({ id: 1, name: 'Mocked User' });

const found = await instance.findById(1);
expect(found.name).toBe('Mocked User');
expect(classSpy).toHaveBeenCalledWith(1);

// ---------- 5. Spy on a module method ----------
import * as dateUtils from './date-utils';

const moduleSpy = jest.spyOn(dateUtils, 'formatDate')
  .mockReturnValue('2026-01-01');

expect(dateUtils.formatDate(new Date())).toBe('2026-01-01');
moduleSpy.mockRestore();

// ---------- 6. NestJS controller test with spyOn ----------
describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get(UsersController);
    service = module.get(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should delegate to service.findById', async () => {
    const spy = jest.spyOn(service, 'findById')
      .mockResolvedValue({ id: 1, name: 'Ada' });

    const result = await controller.findOne('1');

    expect(result).toEqual({ id: 1, name: 'Ada' });
    expect(spy).toHaveBeenCalledWith(1);
  });

  it('should return 404 when user not found', async () => {
    jest.spyOn(service, 'findById').mockResolvedValue(null);

    await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
  });
});

// ---------- 7. Restoring spies ----------
// Restore one:
spy.mockRestore();

// Restore all (recommended in afterEach):
afterEach(() => {
  jest.restoreAllMocks();
});

// ---------- 8. What NOT to do ----------
// BAD: spying on a non-existent method.
// jest.spyOn(obj, 'nonExistent'); // throws

// BAD: forgetting to restore.
// The spy leaks into the next test.

// BAD: spying on the method under test.
// const spy = jest.spyOn(service, 'findById');
// const result = await service.findById(1);
// // You are not testing findById, you are testing a spy of it.
      ` },
      keyTakeaways: [
        "`jest.spyOn(object, 'method')` wraps a real method and records calls without replacing the implementation by default.",
        "Use `.mockImplementation()`, `.mockResolvedValue()`, or `.mockReturnValue()` on a spy to replace the real behavior.",
        "Spy on getters and setters with the third argument: `jest.spyOn(obj, 'prop', 'get')`.",
        "Always restore spies with `mockRestore()` or `jest.restoreAllMocks()` in `afterEach` to prevent leakage.",
        "Use `spyOn` to verify that a dependency was called, not to test the method itself.",
        "Spies are for observation; use `jest.fn()` when you need full control over a dependency's behavior.",
      ],
      commonMistakes: [
        "<b>Forgetting to restore spies.</b> A spy replaces the method for all subsequent tests, causing cascading failures. Use `jest.restoreAllMocks()` in `afterEach`.",
        "<b>Spying on a method that does not exist.</b> `jest.spyOn` throws if the method is not a function. Ensure the method exists on the object.",
        "<b>Spying on a private method.</b> Private methods are not accessible. Prefer testing through the public interface. If you must, use bracket notation with `as any`.",
        "<b>Assuming `spyOn` replaces the implementation.</b> By default, it calls through to the real method. Use `.mockImplementation()` to replace it.",
        "<b>Spying on the code under test.</b> If you spy on the method you are testing, you are not testing it. Spy on dependencies.",
        "<b>Not using `restoreAllMocks` globally.</b> Individual `mockRestore()` calls are easy to forget. Use the global version in `afterEach`.",
      ],
      quiz: [
        {
          question:
            "What does `jest.spyOn(obj, 'method')` do by default?",
          options: [
            "Replaces the method with a no-op.",
            "Calls through to the real implementation while recording calls.",
            "Throws an error.",
            "Deletes the method.",
          ],
          correctIndex: 1,
          explanation:
            "By default, a spy calls through to the real method. It records the call for verification but does not replace the behavior. Use `.mockImplementation()` to replace it.",
        },
        {
          question:
            "Why must you restore spies after a test?",
          options: [
            "Because Jest requires it.",
            "Because the spy replaces the original method, and without restoration it leaks into other tests.",
            "Because spies consume memory.",
            "Because it makes tests run faster.",
          ],
          correctIndex: 1,
          explanation:
            "A spy replaces the method on the object. If not restored, subsequent tests see the spy instead of the real method. Use `mockRestore()` or `jest.restoreAllMocks()` in `afterEach`.",
        },
        {
          question:
            "How do you spy on a getter in Jest?",
          options: [
            "`jest.spyOn(obj, 'prop')`",
            "`jest.spyOn(obj, 'prop', 'get')`",
            "`jest.spyOn(obj, 'getProp')`",
            "`jest.getSpy(obj, 'prop')`",
          ],
          correctIndex: 1,
          explanation:
            "The third argument specifies the access type: 'get' for getters, 'set' for setters. `jest.spyOn(obj, 'prop', 'get')` creates a spy on the getter.",
        },
        {
          question:
            "What is the difference between `jest.fn()` and `jest.spyOn()`?",
          options: [
            "They are aliases.",
            "`jest.fn()` creates a new mock function; `jest.spyOn()` wraps an existing method on an object.",
            "`jest.spyOn()` only works on classes.",
            "`jest.fn()` only works on functions.",
          ],
          correctIndex: 1,
          explanation:
            "`jest.fn()` creates a standalone mock function. `jest.spyOn()` targets an existing method on an object, allowing you to observe or replace it while keeping the object's other methods intact.",
        },
      ],
    },
    {
      id: "day-64-lesson-4",
      title: "Module Mocking and Dependency Injection",
      durationMinutes: 24,
      explanation: `
<b>In NestJS, dependencies are injected through the module system.</b> A service depends on a repository, which depends on a database connection. When you test the service in isolation, you must replace the repository. This is where <b>module mocking</b> and NestJS's <b>testing module</b> come together.

<b>Two approaches to mocking in NestJS:</b>
1. <b>Override providers</b> in \`Test.createTestingModule()\`. This is the standard and recommended approach.
2. <b>Mock modules</b> with \`jest.mock()\`. This is used for third-party libraries or modules that are hard to override.

<b>Approach 1: Overriding providers.</b> NestJS's testing module lets you replace any provider with a mock. This is the cleanest way to mock dependencies in unit tests .

\`\`\`typescript
const module = await Test.createTestingModule({
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User), // the token for the repository
      useValue: mockRepo,                // the mock
    },
  ],
}).compile();
\`\`\`

The \`provide\` field is the dependency injection token. For TypeORM repositories, use \`getRepositoryToken(Entity)\`. For services, use the class itself.

\`\`\`typescript
{
  provide: MailService,
  useValue: { send: jest.fn() },
}
\`\`\`

<b>Approach 2: Mocking modules with \`jest.mock()\`.</b> When a dependency is imported from a module (like \`axios\` or a third-party library), you can mock the entire module. Jest replaces all exports with auto-mocks .

\`\`\`typescript
jest.mock('axios');
import axios from 'axios';

const mockedAxios = axios as jest.Mocked<typeof axios>;
mockedAxios.get.mockResolvedValue({ data: { users: [] } });
\`\`\`

<b>Manual mocks.</b> For modules that need a specific mock implementation, create a \`__mocks__\` folder adjacent to the module. Jest automatically uses the manual mock when you call \`jest.mock()\` .

\`\`\`typescript
// __mocks__/mail.service.ts
export const MailService = jest.fn().mockImplementation(() => ({
  send: jest.fn().mockResolvedValue(true),
}));
\`\`\`

\`\`\`typescript
// In the test:
jest.mock('./mail.service');
\`\`\`

<b>Partial mocking.</b> Sometimes you want to mock only some exports of a module. Use \`jest.requireActual\` to keep the rest :

\`\`\`typescript
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn().mockReturnValue('2026-01-01'),
}));
\`\`\`

<b>When to override providers vs. mock modules.</b>
- <b>Override providers:</b> for dependencies that are injected (services, repositories, configs). This is the NestJS way.
- <b>Mock modules:</b> for third-party libraries, utility functions, or modules that are imported directly (not injected).

<b>Dependency injection in tests.</b> NestJS's DI system works the same in tests as in production. The testing module resolves dependencies and injects them into the service. By overriding providers, you control what gets injected.

\`\`\`typescript
const module = await Test.createTestingModule({
  providers: [
    UsersService,
    { provide: getRepositoryToken(User), useValue: mockRepo },
    { provide: MailService, useValue: mockMailService },
    { provide: ConfigService, useValue: mockConfig },
  ],
}).compile();

const service = module.get<UsersService>(UsersService);
\`\`\`

<b>Mocking ConfigService.</b> A common pattern is to mock \`ConfigService.get()\` to return test values:

\`\`\`typescript
const mockConfig = {
  get: jest.fn((key: string) => {
    const values = { JWT_SECRET: 'test-secret', PORT: 3000 };
    return values[key];
  }),
  getOrThrow: jest.fn((key: string) => {
    const values = { JWT_SECRET: 'test-secret' };
    if (!values[key]) throw new Error(\`Missing \${key}\`);
    return values[key];
  }),
};
\`\`\`

<b>What can go wrong?</b>
- <b>Using the real module instead of overriding.</b> The test hits the real database or external API. Override the provider in the testing module.
- <b>Forgetting to provide all dependencies.</b> NestJS DI will throw "Nest can't resolve dependencies of the UsersService". Make sure every injected dependency has a provider or an override.
- <b>Mocking a module that is also injected.</b> If a service is both imported and injected, mock the provider, not the module.
- <b>Not resetting mocks between tests.</b> Mock state leaks. Use \`jest.clearAllMocks()\` in \`beforeEach\`.
- <b>Mocking internal modules that should be tested.</b> If you mock \`UsersService\` while testing \`UsersController\`, you are testing the controller in isolation. That is fine. But if you mock \`UsersService\` while testing \`UsersService\`, you are testing a mock.
- <b>Forgetting to close the testing module.</b> Use \`afterAll\` to call \`module.close()\`.

<b>How this appears in a real NestJS test.</b> A comprehensive service test overrides multiple providers:

\`\`\`typescript
describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderRepo: any;
  let mockProductRepo: any;
  let mockPaymentService: any;

  beforeEach(async () => {
    mockOrderRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };
    mockProductRepo = {
      findOneBy: jest.fn(),
      decrement: jest.fn(),
    };
    mockPaymentService = {
      charge: jest.fn().mockResolvedValue({ id: 'ch_123' }),
    };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: PaymentService, useValue: mockPaymentService },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should charge the payment provider', async () => {
    mockOrderRepo.save.mockResolvedValue({ id: 1, total: 100 });
    mockProductRepo.findOneBy.mockResolvedValue({ id: 1, stock: 10 });

    await service.createOrder({ productId: 1, quantity: 1 });

    expect(mockPaymentService.charge).toHaveBeenCalledWith({
      amount: 100,
      customerId: expect.any(Number),
    });
  });
});
\`\`\`

<b>How experienced engineers think.</b> Provider overriding is the NestJS-native way to mock. It keeps the DI graph intact, uses the same injection tokens as production, and makes tests read like the real application. Module mocking is a fallback for third-party libraries that are not injected. Choose the approach that matches how the dependency is used.
      `,
      diagram: `
Module Mocking and Dependency Injection

  NestJS DI in production:
    UsersModule
      providers: [UsersService, TypeOrmModule.forFeature([User])]
      UsersService injects Repository<User>

  NestJS DI in tests (override providers):
    Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
      ],
    })

    UsersService now receives mockRepo instead of the real repository.

  Module mocking (for imports, not injections):
    jest.mock('axios');
    import axios from 'axios';
    (axios as jest.Mocked<typeof axios>)
      .get.mockResolvedValue({ data: [] });

  Manual mock:
    __mocks__/mail.service.ts
      export const MailService = jest.fn().mockImplementation(() => ({
        send: jest.fn().mockResolvedValue(true),
      }));

  Partial mock:
    jest.mock('./utils', () => ({
      ...jest.requireActual('./utils'),
      formatDate: jest.fn().mockReturnValue('2026-01-01'),
    }));

  Rule of thumb:
    Injected dependency -> override provider
    Imported module      -> jest.mock()
      `,
      codeExample: { title: "Example", code: `
// ============================================
// MODULE MOCKING AND DEPENDENCY INJECTION
// ============================================

// ---------- 1. Override providers in NestJS testing module ----------
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let mockRepo: any;
  let mockMail: any;
  let mockConfig: any;

  beforeEach(async () => {
    mockRepo = {
      findOneBy: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    mockMail = {
      send: jest.fn().mockResolvedValue(true),
    };

    mockConfig = {
      get: jest.fn((key: string) => {
        const values = {
          JWT_SECRET: 'test-secret',
          JWT_ACCESS_TTL: '15m',
        };
        return values[key];
      }),
      getOrThrow: jest.fn((key: string) => {
        const values = { JWT_SECRET: 'test-secret' };
        if (!values[key]) throw new Error(\`Missing \${key}\`);
        return values[key];
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: mockRepo },
        { provide: MailService, useValue: mockMail },
        { provide: ConfigService, useValue: mockConfig },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a welcome email on register', async () => {
    mockRepo.findOneBy.mockResolvedValue(null);
    mockRepo.save.mockResolvedValue({ id: 1, email: 'ada@example.com' });

    await service.register({
      email: 'ada@example.com',
      password: 'secret',
    });

    expect(mockMail.send).toHaveBeenCalledWith(
      'ada@example.com',
      expect.stringContaining('Welcome'),
    );
  });
});

// ---------- 2. Mock a third-party module (axios) ----------
import axios from 'axios';
jest.mock('axios');

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ExternalApiService', () => {
  it('should fetch data from the external API', async () => {
    mockedAxios.get.mockResolvedValue({ data: { users: [] } });

    const result = await service.fetchUsers();

    expect(mockedAxios.get).toHaveBeenCalledWith('/api/users');
    expect(result).toEqual({ users: [] });
  });
});

// ---------- 3. Manual mock for a module ----------
// __mocks__/mail.service.ts
export const MailService = jest.fn().mockImplementation(() => ({
  send: jest.fn().mockResolvedValue(true),
  sendBulk: jest.fn().mockResolvedValue(true),
}));

// In the test:
jest.mock('./mail.service');
// MailService is now the manual mock.

// ---------- 4. Partial mock with requireActual ----------
jest.mock('./utils', () => ({
  ...jest.requireActual('./utils'),
  formatDate: jest.fn().mockReturnValue('2026-01-01'),
}));

import * as utils from './utils';
// utils.formatDate is mocked; other utils are real.

// ---------- 5. Mock ConfigService with getOrThrow ----------
// If the service uses ConfigService.getOrThrow, the mock must provide it.
const mockConfig = {
  get: jest.fn(),
  getOrThrow: jest.fn((key: string) => {
    const values = {
      JWT_SECRET: 'test-secret',
      DATABASE_URL: 'postgres://localhost/test',
    };
    if (!values[key]) throw new Error(\`Missing config: \${key}\`);
    return values[key];
  }),
};

// ---------- 6. Full NestJS service test with multiple mocks ----------
describe('OrdersService', () => {
  let service: OrdersService;
  let mockOrderRepo: any;
  let mockProductRepo: any;
  let mockPayment: any;

  beforeEach(async () => {
    mockOrderRepo = {
      save: jest.fn(),
      findOneBy: jest.fn(),
    };

    mockProductRepo = {
      findOneBy: jest.fn(),
      decrement: jest.fn(),
    };

    mockPayment = {
      charge: jest.fn().mockResolvedValue({ id: 'ch_123' }),
    };

    const module = await Test.createTestingModule({
      providers: [
        OrdersService,
        { provide: getRepositoryToken(Order), useValue: mockOrderRepo },
        { provide: getRepositoryToken(Product), useValue: mockProductRepo },
        { provide: PaymentService, useValue: mockPayment },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an order and charge the customer', async () => {
    mockProductRepo.findOneBy.mockResolvedValue({ id: 1, price: 100, stock: 5 });
    mockOrderRepo.save.mockResolvedValue({ id: 1, total: 100 });

    const order = await service.createOrder({ productId: 1, quantity: 1 });

    expect(order.id).toBe(1);
    expect(mockPayment.charge).toHaveBeenCalledWith({
      amount: 100,
      customerId: expect.any(Number),
    });
  });
});

// ---------- 7. Cleanup ----------
afterAll(async () => {
  await module.close();
});
      ` },
      keyTakeaways: [
        "In NestJS, the standard way to mock dependencies is to override providers in `Test.createTestingModule()`.",
        "Use `{ provide: Token, useValue: mock }` to replace any provider, including TypeORM repositories via `getRepositoryToken(Entity)`.",
        "Use `jest.mock('module')` for third-party libraries and imported modules that are not injected.",
        "Create manual mocks in `__mocks__` folders for modules that need custom mock implementations.",
        "Use `jest.requireActual` for partial mocking — keep some exports real, mock only what you need.",
        "Always mock `ConfigService.getOrThrow` if the service uses it, and provide realistic values.",
        "Reset mocks between tests and close the testing module in `afterAll`.",
      ],
      commonMistakes: [
        "<b>Using the real module instead of overriding.</b> The test hits the real database or external API. Override the provider in the testing module.",
        "<b>Forgetting to provide all dependencies.</b> NestJS DI throws 'Nest can't resolve dependencies'. Ensure every injected dependency has a provider or an override.",
        "<b>Mocking a module that is also injected.</b> If a service is both imported and injected, mock the provider, not the module.",
        "<b>Not resetting mocks between tests.</b> Mock state leaks. Use `jest.clearAllMocks()` in `beforeEach`.",
        "<b>Mocking the service under test.</b> If you mock `UsersService` while testing `UsersService`, you are testing a mock. Mock dependencies, not the subject.",
        "<b>Forgetting to close the testing module.</b> Use `afterAll` to call `module.close()` to prevent hanging processes.",
      ],
      quiz: [
        {
          question:
            "What is the standard way to mock a TypeORM repository in a NestJS unit test?",
          options: [
            "Import the real repository.",
            "Use `{ provide: getRepositoryToken(User), useValue: mockRepo }`.",
            "Call the database directly.",
            "Use `jest.mock('typeorm')`.",
          ],
          correctIndex: 1,
          explanation:
            "NestJS's testing module lets you override providers. `getRepositoryToken(Entity)` is the injection token for a TypeORM repository, and `useValue` provides the mock.",
        },
        {
          question:
            "When should you use `jest.mock('module')` instead of overriding a provider?",
          options: [
            "Always use `jest.mock`.",
            "When the dependency is imported directly (not injected), like a third-party library such as axios.",
            "When the dependency is injected.",
            "Never use `jest.mock`.",
          ],
          correctIndex: 1,
          explanation:
            "Provider overriding is for injected dependencies. `jest.mock()` is for modules that are imported directly, like `axios` or utility functions that are not part of the DI container.",
        },
        {
          question:
            "What does `jest.requireActual('./utils')` do in a partial mock?",
          options: [
            "Imports the real module, so you can spread it and override only some exports.",
            "Mocks the entire module.",
            "Deletes the module cache.",
            "Throws an error.",
          ],
          correctIndex: 0,
          explanation:
            "`jest.requireActual` imports the real (unmocked) module. In a partial mock, you spread the real exports and override only the specific functions you need to mock.",
        },
        {
          question:
            "Why must you mock `ConfigService.getOrThrow` if the service uses it?",
          options: [
            "Because it is slow.",
            "Because the real method throws if the config key is missing, and the test environment may not have all environment variables.",
            "Because Jest requires it.",
            "Because it is deprecated.",
          ],
          correctIndex: 1,
          explanation:
            "`getOrThrow` throws if the key is not found. In tests, environment variables are often missing, so the mock must provide realistic values to prevent the service from throwing.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "What is a test double?",
      options: [
        "A duplicate test.",
        "A stand-in object that replaces a real dependency in a test.",
        "A type of assertion.",
        "A Jest configuration option.",
      ],
      correctIndex: 1,
      explanation: "A test double is a pretend object used in place of a real dependency, keeping tests fast, isolated, and deterministic.",
    },
    {
      question: "Which test double has a working implementation that is simpler than the real thing?",
      options: ["Dummy", "Stub", "Spy", "Fake"],
      correctIndex: 3,
      explanation: "A fake has a real, working implementation that is unsuitable for production (like an in-memory database).",
    },
    {
      question: "What does a stub do?",
      options: [
        "Records calls.",
        "Returns canned answers to calls made during the test.",
        "Has a full implementation.",
        "Throws errors by default.",
      ],
      correctIndex: 1,
      explanation: "A stub provides pre-programmed answers. It does not record calls and has no expectations about behavior.",
    },
    {
      question: "What is the key trait of a spy?",
      options: [
        "It returns canned values.",
        "It records how it was called for later verification.",
        "It has a full implementation.",
        "It cannot be used with Jest.",
      ],
      correctIndex: 1,
      explanation: "A spy records invocations (arguments, call count, etc.) so you can verify how it was used after the test runs.",
    },
    {
      question: "What does a bare `jest.fn()` return when called?",
      options: ["A random value", "`undefined`", "An empty object", "A promise"],
      correctIndex: 1,
      explanation: "A bare mock function has no programmed return value, so it returns `undefined`.",
    },
    {
      question: "Which method makes a mock return different values on successive calls?",
      options: ["`mockReturnValue`", "`mockImplementation`", "`mockReturnValueOnce`", "`mockResolvedValue`"],
      correctIndex: 2,
      explanation: "`mockReturnValueOnce` returns a value for the next call only. Chain multiple once-values for sequential behavior.",
    },
    {
      question: "What does `jest.spyOn(obj, 'method')` do by default?",
      options: [
        "Replaces the method with a no-op.",
        "Calls through to the real implementation while recording calls.",
        "Throws an error.",
        "Deletes the method.",
      ],
      correctIndex: 1,
      explanation: "By default, a spy calls through to the real method. It records calls but does not replace behavior unless you call `.mockImplementation()`.",
    },
    {
      question: "Why must you restore spies after a test?",
      options: [
        "Because Jest requires it.",
        "Because the spy replaces the original method and leaks into other tests if not restored.",
        "Because spies consume memory.",
        "Because it makes tests faster.",
      ],
      correctIndex: 1,
      explanation: "A spy replaces the method on the object. Without restoration, subsequent tests see the spy instead of the real method.",
    },
    {
      question: "What is the standard way to mock a TypeORM repository in a NestJS unit test?",
      options: [
        "Import the real repository.",
        "Use `{ provide: getRepositoryToken(User), useValue: mockRepo }`.",
        "Call the database directly.",
        "Use `jest.mock('typeorm')`.",
      ],
      correctIndex: 1,
      explanation: "NestJS's testing module lets you override providers. `getRepositoryToken(Entity)` is the token for a TypeORM repository.",
    },
    {
      question: "When should you use `jest.mock('module')`?",
      options: [
        "Always.",
        "When the dependency is imported directly (not injected), like a third-party library.",
        "When the dependency is injected.",
        "Never.",
      ],
      correctIndex: 1,
      explanation: "`jest.mock()` is for modules that are imported directly, like `axios` or utility functions. Injected dependencies should be overridden via the testing module.",
    },
    {
      question: "What does `jest.clearAllMocks()` do?",
      options: [
        "Deletes all mocks.",
        "Clears the call history of all mocks.",
        "Resets return values.",
        "Restores original implementations.",
      ],
      correctIndex: 1,
      explanation: "`clearAllMocks()` clears `.mock.calls` and `.mock.instances` but keeps programmed return values. Use `resetAllMocks()` to also reset implementations.",
    },
    {
      question: "Why is over-verifying with mocks considered a problem?",
      options: [
        "Because mocks are slow.",
        "Because tests become brittle and break when you refactor, even if behavior is correct.",
        "Because mocks consume too much memory.",
        "Because Jest does not support it.",
      ],
      correctIndex: 1,
      explanation: "Over-verifying means asserting on every mock interaction. Refactoring (reordering calls, adding a call) breaks tests even when behavior is correct.",
    },
    {
      question: "What is the difference between `mockResolvedValue` and `mockReturnValue`?",
      options: [
        "They are aliases.",
        "`mockResolvedValue` returns a promise; `mockReturnValue` returns the value directly.",
        "`mockResolvedValue` is for sync functions.",
        "`mockReturnValue` is for async functions.",
      ],
      correctIndex: 1,
      explanation: "`mockResolvedValue(x)` is shorthand for `mockImplementation(() => Promise.resolve(x))`. Use it for async dependencies.",
    },
    {
      question: "What does a fake test double typically provide?",
      options: [
        "Canned return values.",
        "A working implementation that is simpler than the real thing.",
        "Call recording.",
        "Pre-programmed expectations.",
      ],
      correctIndex: 1,
      explanation: "A fake has a real, working implementation suitable for tests but not production, like an in-memory database.",
    },
    {
      question: "In NestJS, what is the token for a TypeORM repository of the User entity?",
      options: [
        "`UserRepository`",
        "`getRepositoryToken(User)`",
        "`User`",
        "`TypeOrmRepository`",
      ],
      correctIndex: 1,
      explanation: "`getRepositoryToken(User)` is the injection token used by NestJS to provide the repository for the User entity. Use it in the `provide` field when overriding.",
    },
  ],
  project: {
    name: "Mock the UsersModule Dependencies and Write Isolated Unit Tests",
    goal:
      "Apply every mocking concept from today — jest.fn(), jest.spyOn(), provider overriding, module mocking, and test doubles (dummy, stub, spy, mock, fake) — to write a complete, isolated unit test suite for a NestJS UsersModule.",
    brief:
      "You have a UsersModule with a UsersService that depends on a TypeORM repository, a MailService for welcome emails, and a ConfigService for settings. Write unit tests that mock all three dependencies using the correct test double for each scenario. Use jest.fn() for the repository, jest.spyOn() to verify the mail service, and override providers in the NestJS testing module. Cover happy paths, error paths, and edge cases.",
    steps: [
      "Create a new NestJS project. Add `@nestjs/typeorm`, `pg`, and `@nestjs/config`.",
      "Define a `User` entity (id, email, passwordHash, firstName, lastName). Create a `UsersService` with `findById`, `findByEmail`, `create`, and `register`. The service injects `Repository<User>`, `MailService`, and `ConfigService`.",
      "Create a `MailService` with a `send` method that returns a promise.",
      "Create a `users.service.spec.ts` file with a top-level `describe('UsersService')`.",
      "In `beforeEach`, create mock objects: `mockRepo` with `jest.fn()` for `findOneBy` and `save`; `mockMail` with `jest.fn()` for `send`; `mockConfig` with `jest.fn()` for `get` and `getOrThrow`.",
      "In `beforeEach`, create the testing module with `UsersService` and the three mocked providers using `useValue`. Get the service instance.",
      "In `afterEach`, call `jest.clearAllMocks()`.",
      "In `afterAll`, call `module.close()`.",
      "Add a nested `describe('findById')`. Write tests for: user found (mockResolvedValue), user not found (mockResolvedValue(null)), database error (mockRejectedValue).",
      "Add a nested `describe('create')`. Write tests for: successful creation (assert passwordHash is hashed), duplicate email throws ConflictException (mock findOneBy to return an existing user).",
      "Add a nested `describe('register')`. Write tests for: successful registration sends a welcome email. Use `mockMail.send` and assert it was called with the correct email and a message containing 'Welcome'. Also test that a duplicate email throws.",
      "Add a nested `describe('findByEmail')`. Write tests for: email found, email not found.",
      "Add a `describe('spyOn examples')` block that demonstrates `jest.spyOn(service, 'findById')` to verify that `register` calls `findById`. Use `.mockResolvedValue()` on the spy.",
      "Run `npm test users.service.spec.ts` and verify all tests pass.",
      "Run `npm test -- --coverage` and verify coverage for `users.service.ts` is above 90%.",
    ],
    acceptance: [
      "All tests pass with `npm test`.",
      "Every dependency (repository, mail service, config service) is mocked in the testing module.",
      "Happy path and error path are tested for each method.",
      "`jest.clearAllMocks()` is called in `beforeEach` so tests are isolated.",
      "`module.close()` is called in `afterAll`.",
      "Coverage for `users.service.ts` is above 90%.",
      "No test hits the real database, sends a real email, or reads real environment variables.",
    ],
    stretch: [
      "Add a `users.controller.spec.ts` that overrides `UsersService` with a mock and tests that the controller delegates correctly.",
      "Add a test that uses `jest.spyOn` to verify that `register` calls `mailService.send` with the correct welcome email template.",
      "Create a `FakeUserRepository` class (in-memory) and write an alternative test suite that uses it instead of mocks. Compare the two approaches in a comment.",
      "Add a test that verifies the service handles a mail service failure gracefully (mock `send` to reject).",
      "Mock the `ConfigService` using a `__mocks__` folder and a manual mock. Use it across multiple test files.",
      "Add a Jest coverage threshold in `jest.config.ts` that fails the test run if coverage drops below 90%.",
      "Write a `test/helpers/mock-repository.ts` helper that generates a typed mock repository for any entity, reducing boilerplate across test files.",
    ],
  },
};
