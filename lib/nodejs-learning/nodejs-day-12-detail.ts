import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Production APIs will fail — networks time out, disks fill up, and code has bugs. **Structured error handling** means that when something goes wrong, your API sends a clear, predictable response and your logs make it easy to figure out what happened. Good error handling is not about hiding problems — it is about surfacing them in a controlled way.",
      np: "संरचित त्रुटि — HTTP र लग उही भाषा।",
      jp: "**構造化エラー**で HTTP とログを揃える。",
    },
    {
      en: "There are two kinds of errors: **operational errors** (like invalid input or a duplicate email) that you expect and handle, and **programmer errors** (like a null pointer or an unhandled edge case) that are bugs. Users should see friendly messages for the first kind. The second kind should get logged with full details on the server, but users should never see a stack trace.",
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
          type: "youtube",
          videoId: "L72fhGm1tfE",
          title: "Error Handling in Express.js",
        },
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
            en: "If a Promise rejects inside a route handler and you do not catch it, the process can crash. Always wrap async route handlers with `try/catch`, or use the **`express-async-errors`** package which patches Express so any uncaught rejection automatically calls `next(err)`. Either way, register a **central error middleware** at the bottom of your app to catch everything and send back a consistent response.",
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
          type: "youtube",
          videoId: "fBNz5xF-Kx4",
          title: "Structured Logging in Node.js",
        },
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
            en: "**Structured logs** (one JSON object per line) are much easier to search and filter than plain text. Attach a unique **correlation ID** to each request and include it in every log line, so you can trace exactly what happened across multiple services or log entries. Never log sensitive data like passwords, credit card numbers, or API keys.",
            np: "कोरिलेसन आईडी — संवेदनशील डाटा लग नगर्नु।",
            jp: "**相関 ID** でログを繋ぐ。秘密はログに出さない。",
          },
        },
        {
          type: "paragraph",
          text: {
            en: "As your app grows, keep each file focused on one thing — routes, database access, logging, config, and validation all in their own folders. Set up **`process.on('uncaughtException')`** and **`process.on('unhandledRejection')`** handlers that log the error before the process exits. Most hosting platforms will automatically restart the process, but you want the error in your logs before that happens.",
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
        en: "For errors you know about (like validation failures or duplicate keys), map them to the right HTTP status code and return a helpful message. For everything else, return a generic 500 and log the full error with the correlation ID on the server. Never send internal error details or stack traces to the client.",
        np: "ज्ञात त्रुटिलाई कोड — ग्राहकलाई सुरक्षित सन्देश।",
        jp: "既知エラーはコード付き。未知は 500 とログに詳細。",
      },
    },
  ],
};
