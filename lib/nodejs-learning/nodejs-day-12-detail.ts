import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Production APIs fail—networks timeout, disks fill, programmers forget null checks. **Structured error handling** turns chaos into **predictable HTTP responses** and **searchable logs** while refactoring giant `try/catch` blocks into reusable middleware.",
      np: "संरचित त्रुटि — HTTP र लग उही भाषा।",
      jp: "**構造化エラー**で HTTP とログを揃える。",
    },
    {
      en: "Separate **operational errors** (bad input, conflict) from **programmer errors** (bugs)—clients deserve helpful messages for the first; the second should **never leak stack traces** publicly.",
      np: "सञ्चालन त्रुटि बनाम बग — स्ट्याक उत्पादनमा नदेखाउनु।",
      jp: "**運用エラー**と**バグ**を分ける。本番ではスタックを見せない。",
    },
  ],
  sections: [
    {
      title: {
        en: "Promises, Express error middleware & async helpers",
        np: "प्रतिज्ञा र त्रुटि मिडलवेयर",
        jp: "Promise とエラーミドルウェア",
      },
      blocks: [
        {
          type: "code",
          title: { en: "Central Express error handler", np: "केन्द्रीय त्रुटि", jp: "集約エラーハンドラ" },
          code: `// Register AFTER all routes:
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.statusCode ?? 500;
  res.status(status).json({ message: err.message ?? 'Server error' });
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "Unhandled promise rejections inside route handlers used to crash processes—today **always `await` inside `try/catch`** or attach **`.catch`**. Packages like **`express-async-errors`** patch Express so rejected promises reach **`next(err)`** automatically—pair with a **central error middleware** at the bottom of your stack.",
            np: "async रूटमा try/catch वा express-async-errors — अन्तमा त्रुटि मिडलवेयर।",
            jp: "**async** ルートは **`try/catch`** か **`express-async-errors`** で `next(err)` へ。",
          },
        },
        {
          type: "diagram",
          id: "error-classification",
        },
      ],
    },
    {
      title: {
        en: "Logging, persistence & extracting modules",
        np: "लग र मोड्युल निकाल्नु",
        jp: "ログとモジュール分割",
      },
      blocks: [
        {
          type: "code",
          title: { en: "One JSON line per request (easy to grep)", np: "संरचित लग", jp: "構造化ログ" },
          code: `const crypto = require('crypto');

function requestLogger(req, res, next) {
  req.correlationId = crypto.randomUUID();
  console.log(JSON.stringify({
    at: new Date().toISOString(),
    correlationId: req.correlationId,
    method: req.method,
    url: req.url,
  }));
  next();
}`,
        },
        {
          type: "diagram",
          id: "log-correlation",
        },
        {
          type: "paragraph",
          text: {
            en: "**Structured logs** (JSON lines) let you filter by **`correlationId`** across services—generate one per HTTP request and pass it through async calls. Optional **Mongo logging** stores severe errors for dashboards—never log secrets or full credit-card numbers.",
            np: "कोरिलेसन आईडी — संवेदनशील डाटा लग नगर्नु।",
            jp: "**相関 ID** でログを繋ぐ。秘密はログに出さない。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "**Refactors**—extract **routes**, **db access**, **logging**, **config**, and **validators** into folders so each file fits on one screen. Uncaught exceptions and unhandled rejections should still reach **process** handlers that log fatally before exiting (many hosts restart automatically).",
            np: "रूट, DB, लग, विन्यास अलग फाइल — अनह्यान्ड प्रक्रिया ह्यान्डलर।",
            jp: "**分割**で責務を分離。未処理例外はプロセスハンドラへ。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What belongs in the global Express error handler?",
        np: "ग्लोबल त्रुटि ह्यान्डलरमा के?",
        jp: "グローバルエラーハンドラに何を書く？",
      },
      answer: {
        en: "Map known error classes to **status codes**, log **stack + correlation id** server-side, send **safe messages** to clients. Unknown errors become generic **500** text while ops teams see details in logs.",
        np: "ज्ञात त्रुटिलाई कोड — ग्राहकलाई सुरक्षित सन्देश।",
        jp: "既知エラーはコード付き。未知は 500 とログに詳細。",
      },
    },
  ],
};
