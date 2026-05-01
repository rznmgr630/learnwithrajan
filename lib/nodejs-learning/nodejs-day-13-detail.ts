import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Testing is how you **ship confidently**. **Unit tests** run in milliseconds by mocking all I/O — they lock down pure logic. **Integration tests** spin a real Express app against a test database and verify that routes, middleware, validators, and DB queries all wire together correctly.",
      np: "Unit test — I/O mock, milliseconds; Integration test — वास्तविक DB, wiring परीक्षण।",
      jp: "**単体テスト**は I/O をモックして高速に。**結合テスト**は実際の DB でワイヤリングを確認。",
    },
    {
      en: "**Test-driven development (TDD)** writes the assertion first, watches it fail, then implements minimum code to pass. Even without strict TDD, writing tests alongside code (not six months later) keeps coverage meaningful.",
      np: "TDD — पहिले fail गर्ने test, अनि minimum code। कोडसँगै लेख्नु राम्रो।",
      jp: "**TDD** は失敗するテストから始める。コードと並行してテストを書くと品質が保たれる。",
    },
  ],
  sections: [
    {
      title: {
        en: "Jest basics — describe, it, expect",
        np: "Jest — describe, it, expect",
        jp: "Jest の基本",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Unit test for a pure function",
            np: "pure function को unit test",
            jp: "純粋関数の単体テスト",
          },
          code: `// math.js
function calculateLateFee(days, dailyRate) {
  if (days < 0) throw new Error('days cannot be negative');
  return days * dailyRate;
}
module.exports = { calculateLateFee };

// math.test.js
const { calculateLateFee } = require('./math');

describe('calculateLateFee', () => {
  it('returns 0 for 0 days', () => {
    expect(calculateLateFee(0, 1.5)).toBe(0);
  });

  it('multiplies days by daily rate', () => {
    expect(calculateLateFee(3, 2.5)).toBe(7.5);
  });

  it('throws for negative days', () => {
    expect(() => calculateLateFee(-1, 2)).toThrow('days cannot be negative');
  });

  it('handles fractional rates', () => {
    expect(calculateLateFee(7, 1.99)).toBeCloseTo(13.93);
  });
});`,
        },
        {
          type: "diagram",
          id: "nodejs-jest-unit-flow",
        },
        {
          type: "paragraph",
          text: {
            en: "The **test pyramid** favors many fast unit tests at the base, fewer integration tests in the middle, and minimal end-to-end tests at the tip. Run **`jest --watch`** during development for instant feedback. Set up scripts: `\"test\": \"jest\"` and `\"test:coverage\": \"jest --coverage\"` in `package.json`.",
            np: "pyramid — धेरै unit, कम integration, थोरै e2e। `jest --watch` development मा।",
            jp: "**テストピラミッド** — 下段を厚く。`jest --watch` で開発中に即時フィードバック。",
          },
        },
      ],
    },
    {
      title: {
        en: "Mocking modules and functions",
        np: "Modules र functions mock गर्नु",
        jp: "モジュールと関数のモック",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Mock a DB module to test service logic in isolation",
            np: "DB module mock गरेर service test",
            jp: "DB モジュールをモックしてサービスを単体テスト",
          },
          code: `// userService.js
const db = require('./db');

async function createUser(data) {
  const existing = await db.findByEmail(data.email);
  if (existing) throw new Error('Email in use');
  return db.insertUser(data);
}
module.exports = { createUser };

// userService.test.js
jest.mock('./db'); // auto-mock — all exports become jest.fn()
const db = require('./db');
const { createUser } = require('./userService');

describe('createUser', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws when email already exists', async () => {
    db.findByEmail.mockResolvedValue({ id: 1, email: 'a@b.com' });
    await expect(createUser({ email: 'a@b.com' })).rejects.toThrow('Email in use');
  });

  it('inserts and returns user when email is free', async () => {
    db.findByEmail.mockResolvedValue(null);
    db.insertUser.mockResolvedValue({ id: 2, email: 'new@b.com' });

    const result = await createUser({ email: 'new@b.com', name: 'Alice' });
    expect(db.insertUser).toHaveBeenCalledWith({ email: 'new@b.com', name: 'Alice' });
    expect(result.id).toBe(2);
  });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Mocking helps** because it isolates the unit under test from real I/O — tests run fast and deterministically. **Mocking can hide bugs**: if you mock Mongoose's `.save()` to always succeed, you will never discover that your validation schema rejects a field your code relies on. Reserve real DB calls for integration tests where discovering wiring errors is the whole point.",
            np: "mock ले isolation — तर Mongoose mock गर्दा schema bug छुटन सक्छ। integration test मा real DB।",
            jp: "モックは高速・確定的。しかし Mongoose をモックしすぎるとスキーマバグを見落とす。結合テストでは実 DB を使う。",
          },
        },
      ],
    },
    {
      title: {
        en: "Integration tests with supertest",
        np: "supertest सँग integration tests",
        jp: "supertest を使った結合テスト",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Testing an Express route end-to-end",
            np: "Express route end-to-end test",
            jp: "Express ルートの結合テスト",
          },
          code: `const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // export app without .listen()

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/myapp_test');
});

afterAll(async () => {
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

beforeEach(async () => {
  await mongoose.connection.db.dropDatabase(); // clean slate per test
});

describe('POST /api/users', () => {
  it('creates a user and returns 201', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice', email: 'alice@example.com' })
      .expect(201);

    expect(res.body.email).toBe('alice@example.com');
    expect(res.body._id).toBeDefined();
  });

  it('returns 400 for missing email', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Bob' })
      .expect(400);

    expect(res.body.error).toBe('Validation failed');
  });

  it('returns 409 for duplicate email', async () => {
    await request(app).post('/api/users').send({ name: 'Alice', email: 'a@b.com' });
    const res = await request(app)
      .post('/api/users')
      .send({ name: 'Alice2', email: 'a@b.com' })
      .expect(409);
    expect(res.body.error).toMatch(/duplicate/i);
  });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "**`supertest`** fires real HTTP requests against your Express app without binding a network port — fast and reliable. Always use a **separate test database URI** (e.g. `myapp_test`) — never point tests at production data. Seed fixtures in `beforeAll` or `beforeEach`, then drop the database in `afterAll` to leave a clean state.",
            np: "supertest — port bind नगरी real HTTP। test DB अलग URI — production मा कहिल्यै होइन।",
            jp: "**supertest** はポートなしで実 HTTP を発火。**テスト用 DB** を別 URI に。本番データは絶対に使わない。",
          },
        },
      ],
    },
    {
      title: {
        en: "Coverage and what it actually measures",
        np: "Coverage — के मापन गर्छ?",
        jp: "カバレッジが実際に測るもの",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reading jest --coverage output",
            np: "coverage output पढ्नु",
            jp: "jest --coverage の出力を読む",
          },
          code: `# Run: npx jest --coverage

# Output table:
# File          | % Stmts | % Branch | % Funcs | % Lines
# userService.js|    91.3 |     75.0 |   100.0 |    91.3

# 75% Branch means 1 of 4 if/else branches was never executed.
# Find it: jest --coverage --verbose --collectCoverageFrom='src/**/*.js'

# CI badge target: 80% minimum on all four columns.
# But 80% can still miss critical paths — cover your auth and billing logic first.`,
        },
        {
          type: "table",
          caption: {
            en: "Coverage types — what they count and what they miss",
            np: "coverage प्रकार",
            jp: "カバレッジの種類",
          },
          headers: [
            { en: "Coverage type", np: "प्रकार", jp: "種類" },
            { en: "What it counts", np: "के गन्छ", jp: "カウント対象" },
            { en: "Blind spot", np: "अन्धा ठाउँ", jp: "見落とし" },
          ],
          rows: [
            [
              { en: "**Statement**", np: "Statement", jp: "**ステートメント**" },
              { en: "Every executable statement reached", np: "हरेक statement", jp: "実行された文" },
              { en: "Doesn't check boolean branches", np: "branch जाँच गर्दैन", jp: "分岐を区別しない" },
            ],
            [
              { en: "**Branch**", np: "Branch", jp: "**ブランチ**" },
              { en: "Both sides of if/else, ternary, &&, ||", np: "if/else दुवै side", jp: "if/else 両側・三項演算子" },
              { en: "Misses logic errors inside a taken branch", np: "branch भित्रको logic", jp: "分岐内のロジックは見ない" },
            ],
            [
              { en: "**Function**", np: "Function", jp: "**関数**" },
              { en: "Every function called at least once", np: "हरेक function एकपटक", jp: "各関数が最低1回呼ばれた" },
              { en: "Misses edge-case inputs inside the function", np: "edge case input", jp: "関数内のエッジケース" },
            ],
            [
              { en: "**Line**", np: "Line", jp: "**行**" },
              { en: "Every source line executed", np: "हरेक line", jp: "各行が実行された" },
              { en: "Multi-statement lines mislead the metric", np: "एक line मा धेरै statement", jp: "複文行でメトリクスが歪む" },
            ],
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**80% coverage is a floor, not a ceiling.** 100% coverage can still miss logic errors — a test that calls every line but only asserts `expect(true).toBe(true)` is worthless. Focus meaningful tests on **auth flows, pricing calculations, and error paths** rather than chasing a number. Delete tests that only exist to inflate coverage.",
            np: "80% coverage न्यूनतम — 100% भएर पनि logic error हुन सक्छ। auth र pricing मा ध्यान दिनुहोस्।",
            jp: "**80% はフロア**。100% でもロジックエラーを見逃す。認証・課金・エラーパスに意味のあるテストを集中。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between unit and integration tests?",
        np: "Unit र integration test मा फरक के?",
        jp: "単体テストと結合テストの違いは？",
      },
      answer: {
        en: "**Unit tests** isolate a single function or module by mocking all external dependencies (DB, network, file system). They run in milliseconds. **Integration tests** wire real components together — a real DB, real Express middleware, real routes — and verify the system behaves correctly end-to-end. They are slower but catch wiring bugs that unit tests cannot.",
        np: "Unit — mock सँग isolated, fast; Integration — real DB, real Express, slow तर wiring bugs देखाउँछ।",
        jp: "**単体**はモックで隔離して高速。**結合**は実コンポーネントを繋いで遅いがワイヤリングバグを発見。",
      },
    },
    {
      question: {
        en: "Should I write tests before or after the code?",
        np: "test पहिले वा code पछि लेख्ने?",
        jp: "テストはコードの前か後か？",
      },
      answer: {
        en: "**TDD (test first)** forces you to think about the interface before implementation — great for business logic with clear rules (pricing, validation). **Test-after** is more practical when you are exploring an API design or building UI. The pragmatic rule: always write tests before you mark a PR ready — never ship untested code to production.",
        np: "TDD ले interface पहिले सोच्न बाध्य गर्छ — business logic मा राम्रो। PR ready गर्न अघि test लेख्नुहोस्।",
        jp: "**TDD** はインターフェースを先に考えさせる。探索的開発にはテスト後が現実的。PR 前には必ずテストを書く。",
      },
    },
  ],
};
