import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Automated tests** turn fear into feedback: **unit tests** lock down pure functions and mocks; **integration tests** spin a real HTTP server against a **test database** so routes, auth, and validation behave like production—only slower and disposable.",
      np: "एकाइ र एकीकृत परीक्षण — जेस्ट र टेस्ट DB।",
      jp: "**単体**と**結合**テストで安心してリファクタできる。",
    },
    {
      en: "**Test-driven development** writes the assertion first, watches it fail, implements the minimum code, then refactors—rental return exercises in this curriculum mirror pricing rules that break easily if tested only by clicking.",
      np: "TDD — पहिले असफल परीक्षण, अनि न्यून कोड।",
      jp: "**TDD** は失敗するテストから始める習慣。",
    },
  ],
  sections: [
    {
      title: {
        en: "Unit testing mindset & Jest basics",
        np: "एकाइ परीक्षण र Jest",
        jp: "単体テストと Jest",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Minimal Jest unit test", np: "Jest एकाइ", jp: "Jest の単体テスト" },
          code: `const { sum } = require('../math');

describe('sum', () => {
  it('adds numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "The **test pyramid** favors many fast unit tests, fewer integration tests, minimal end-to-end—Node APIs usually lean integration-heavy because HTTP matters. **Jest** gives **`describe`/`it`**, matchers **`toEqual`**, **`jest.fn()`** mocks, and **`--watch`** loops during development.",
            np: "पिरामिड — धेरै छिटो एकाइ; HTTP का लागि एकीकृत पनि।",
            jp: "**ピラミッド** — 下段を厚く。Jest は `--watch` が便利。",
          },
        },
        {
          type: "diagram",
          id: "devops-cicd-pipeline",
        },
        {
          type: "paragraph",
          text: {
            en: "Hook the same **`npm test`** command into CI (diagram)—green main branch means merged code ran tests in a clean environment. **Coverage** highlights untested branches—aim for meaningful asserts on auth and pricing paths, not 100% trivia.",
            np: "CI मा `npm test` — कभरेज लक्षणिक खण्डमा।",
            jp: "CI で **`npm test`**。**カバレッジ**は意味のある経路から。",
          },
        },
      ],
    },
    {
      title: {
        en: "Integration tests — database & HTTP together",
        np: "एकीकृत परीक्षण",
        jp: "結合テスト",
      },
      blocks: [
        {
          type: "code",
          title: { en: "supertest hits your real Express app", np: "supertest", jp: "supertest の例" },
          code: `const request = require('supertest');
const app = require('../app');

describe('GET /api/genres', () => {
  it('returns 200', async () => {
    const res = await request(app).get('/api/genres').expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "Spin up **`supertest`** (or similar) against **`app`** without binding a real port when possible. Seed **fixtures** into a dedicated **`mongodb://localhost:27017/myapp_test`** URI—never point tests at production data. Validate **401/403** paths and malformed IDs (`400`) alongside happy flows.",
            np: "टेस्ट DB अलग URI — उत्पादन डाटा प्रयोग नगर्नु।",
            jp: "**テスト用 DB** を別 URI に。本番データは禁止。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How much mocking is enough?",
        np: "मकिङ कति?",
        jp: "モックはどこまで？",
      },
      answer: {
        en: "Mock **external systems you do not control** (payment gateways, email SaaS). Prefer **real in-memory or Dockerized databases** for integration tests—mocking Mongoose entirely hides query bugs.",
        np: "बाह्य सेवा मक — DB प्रायः वास्तविक टेस्ट।",
        jp: "外部だけモック。**DB は実際に近い方が query のバグが見える**。",
      },
    },
  ],
};
