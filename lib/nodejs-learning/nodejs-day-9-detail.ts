import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_9_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Validation** is the gate between messy HTTP JSON and trustworthy database documents. Mongoose validators run **before writes** and enforce DB-level invariants (required fields, enums, min/max). Middleware validators like **Joi** or **zod** run at the **route level**, giving you nicer HTTP 400 errors before expensive business logic even starts.",
      np: "Mongoose — DB write अघि; Joi — route मा। दुवै तह मिलाएर राम्रो।",
      jp: "Mongoose は DB 書き込み前、Joi はルートレベルで検証。二段で守る。",
    },
    {
      en: "Think of validation as two separate rings of defense: the **route ring** catches bad client payloads early and returns friendly 400 errors; the **schema ring** is the last line — it prevents garbage reaching your MongoDB collections even if a bug bypasses your route middleware.",
      np: "रूट — पहिलो रिंग (400); Schema — अन्तिम रिंग (DB protection)।",
      jp: "**ルート検証**は早期の 400 返却。**スキーマ検証**は DB へのゴミを防ぐ最後の砦。",
    },
  ],
  sections: [
    {
      title: {
        en: "Mongoose schema validators",
        np: "Mongoose schema validators",
        jp: "Mongoose スキーマバリデータ",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Schema with built-in and custom validators",
            np: "बिल्ट-इन र कस्टम validators",
            jp: "組み込み + カスタムバリデータ",
          },
          code: `const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [100, 'Name must be at most 100 characters'],
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
    lowercase: true,
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin', 'moderator'],
      message: '{VALUE} is not a valid role',
    },
    default: 'user',
  },
  age: {
    type: Number,
    min: [0, 'Age cannot be negative'],
    max: [150, 'Age seems unrealistic'],
  },
  website: {
    type: String,
    validate: {
      validator: (v) => !v || v.startsWith('https://'),
      message: 'Website must use HTTPS',
    },
  },
});

const User = mongoose.model('User', userSchema);`,
        },
        {
          type: "diagram",
          id: "nodejs-mongoose-schema",
        },
        {
          type: "table",
          caption: {
            en: "Common Mongoose validators",
            np: "सामान्य validators",
            jp: "よく使うバリデータ",
          },
          headers: [
            { en: "Validator", np: "Validator", jp: "バリデータ" },
            { en: "Usage", np: "प्रयोग", jp: "使い方" },
            { en: "Error message", np: "त्रुटि सन्देश", jp: "エラーメッセージ" },
          ],
          rows: [
            [
              { en: "`required`", np: "required", jp: "`required`" },
              { en: "`required: [true, 'msg']`", np: "अनिवार्य", jp: "必須フィールド" },
              { en: "Path `name` is required", np: "field अनिवार्य", jp: "フィールドが必要" },
            ],
            [
              { en: "`min` / `max`", np: "min/max", jp: "`min` / `max`" },
              { en: "Numbers and dates", np: "संख्या र मिति", jp: "数値・日付に適用" },
              { en: "Path `age` (5) is less than minimum", np: "न्यूनतम भन्दा कम", jp: "最小値より小さい" },
            ],
            [
              { en: "`minlength` / `maxlength`", np: "लम्बाइ", jp: "`minlength` / `maxlength`" },
              { en: "String length bounds", np: "string लम्बाइ", jp: "文字列の長さ" },
              { en: "Path `name` is shorter than minimum", np: "छोटो", jp: "最小文字数より短い" },
            ],
            [
              { en: "`enum`", np: "enum", jp: "`enum`" },
              { en: "Allowed string values", np: "अनुमत मानहरू", jp: "許可された値のリスト" },
              { en: "`xyz` is not a valid role", np: "अमान्य मान", jp: "無効な値" },
            ],
            [
              { en: "`match`", np: "match (regex)", jp: "`match`" },
              { en: "Regex test on string", np: "regex परीक्षण", jp: "正規表現テスト" },
              { en: "Invalid email format", np: "अमान्य ढाँचा", jp: "フォーマット不正" },
            ],
            [
              { en: "`validate`", np: "custom", jp: "`validate`" },
              { en: "Custom `validator(value)` function", np: "कस्टम function", jp: "カスタム関数" },
              { en: "Website must use HTTPS", np: "HTTPS चाहिन्छ", jp: "カスタムメッセージ" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Joi validation in Express routes",
        np: "Express routes मा Joi validation",
        jp: "Express ルートでの Joi 検証",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Reusable validation middleware with Joi",
            np: "Joi validation middleware",
            jp: "Joi を使った検証ミドルウェア",
          },
          code: `const Joi = require('joi');

// Define the schema
const createUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  role: Joi.string().valid('user', 'admin').default('user'),
  age: Joi.number().integer().min(0).max(150),
});

// Reusable middleware factory
function validate(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,    // collect ALL errors, not just first
      stripUnknown: true,   // remove fields not in schema
    });
    if (error) {
      return res.status(400).json({
        status: 400,
        error: 'Validation failed',
        details: error.details.map((d) => ({
          field: d.path.join('.'),
          message: d.message,
        })),
      });
    }
    req.body = value; // use the cleaned/coerced value
    next();
  };
}

// Use in routes
const express = require('express');
const router = express.Router();

router.post('/users', validate(createUserSchema), async (req, res) => {
  // req.body is now validated and stripped of unknown fields
  const user = await User.create(req.body);
  res.status(201).json(user);
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "Place validation middleware **between the route declaration and the handler** — the handler only runs when the body is clean. Setting `abortEarly: false` collects all validation errors in one pass so the client can fix everything at once. Setting `stripUnknown: true` removes extra fields the client sent.",
            np: "validation middleware route र handler बीच — `abortEarly: false` ले सबै त्रुटि एकैपटक।",
            jp: "バリデーションはルートとハンドラの間に挟む。`abortEarly: false` で全エラーをまとめて返す。",
          },
        },
      ],
    },
    {
      title: {
        en: "Sanitization — strip unknown fields",
        np: "Sanitization — अज्ञात fields हटाउनु",
        jp: "サニタイズ — 余分なフィールドを除去",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Strip unknown fields to prevent mass-assignment",
            np: "mass-assignment रोक्न unknown fields हटाउनु",
            jp: "マスアサインメント防止のためのフィールド除去",
          },
          code: `// Without stripUnknown, a malicious client could send:
// { name: 'Alice', email: 'a@b.com', role: 'admin', isVerified: true }
// and pollute your DB with isVerified = true

const { error, value } = schema.validate(req.body, {
  stripUnknown: true,
  // value now only contains fields defined in the Joi schema
});

// With Mongoose you can also enable strict mode (default true):
// strict: true means fields not in schema are silently dropped on save
const userSchema = new mongoose.Schema({ name: String }, { strict: true });`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "**Mass-assignment bug** — a client sends `{ role: 'admin' }` and your code does `User.create(req.body)` without filtering. Whitelist inputs explicitly or use `stripUnknown`.",
              np: "mass-assignment — `role: 'admin'` पठाएर privilege escalate गर्न सकिन्छ।",
              jp: "**マスアサインメント** — 不正なフィールドで権限昇格が起きる。ホワイトリスト化が必要。",
            },
            {
              en: "**Keep DB clean** — unknown fields create inconsistent documents that break future schema migrations and analytics queries.",
              np: "DB सफा राख्नुहोस् — अज्ञात fields ले schema migration कठिन बन्छ।",
              jp: "**DB をきれいに保つ** — 未知フィールドはスキーママイグレーションを壊す。",
            },
          ],
        },
      ],
    },
    {
      title: {
        en: "Validation error responses",
        np: "Validation error responses",
        jp: "バリデーションエラーレスポンス",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "Structured error response format",
            np: "संरचित त्रुटि response",
            jp: "構造化エラーレスポンス",
          },
          code: `// Consistent error shape — clients can rely on this contract
{
  "status": 400,
  "error": "Validation failed",
  "details": [
    { "field": "email",  "message": "\"email\" must be a valid email" },
    { "field": "name",   "message": "\"name\" is not allowed to be empty" }
  ]
}

// Express error handler for Mongoose ValidationError
app.use((err, req, res, next) => {
  if (err.name === 'ValidationError') {
    const details = Object.entries(err.errors).map(([field, e]) => ({
      field,
      message: e.message,
    }));
    return res.status(400).json({ status: 400, error: 'Validation failed', details });
  }
  if (err.code === 11000) {
    return res.status(409).json({ status: 409, error: 'Duplicate key', field: Object.keys(err.keyPattern)[0] });
  }
  res.status(500).json({ status: 500, error: 'Internal server error' });
});`,
        },
        {
          type: "table",
          caption: {
            en: "HTTP status codes for validation scenarios",
            np: "validation status codes",
            jp: "検証エラーの HTTP ステータス",
          },
          headers: [
            { en: "Status", np: "Status", jp: "ステータス" },
            { en: "When to use", np: "कहिले", jp: "使いどき" },
            { en: "Example", np: "उदाहरण", jp: "例" },
          ],
          rows: [
            [
              { en: "**400 Bad Request**", np: "400", jp: "**400**" },
              { en: "Malformed JSON, missing required fields, type mismatch", np: "अमान्य body", jp: "フォーマット不正・必須欠如" },
              { en: "`name` is required", np: "name अनिवार्य", jp: "name は必須" },
            ],
            [
              { en: "**422 Unprocessable Entity**", np: "422", jp: "**422**" },
              { en: "Well-formed body but semantically invalid business rule", np: "व्यावसायिक नियम उल्लङ्घन", jp: "形式は正しいが業務ルール違反" },
              { en: "Start date must be before end date", np: "मिति नियम", jp: "開始日が終了日より後" },
            ],
            [
              { en: "**409 Conflict**", np: "409", jp: "**409**" },
              { en: "Duplicate unique field (e.g. email already registered)", np: "डुप्लिकेट key", jp: "一意フィールドの重複" },
              { en: "Email already in use", np: "email पहिल्यै छ", jp: "メールが既に存在" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should I validate in the schema or the route?",
        np: "schema मा वा route मा validate गर्ने?",
        jp: "スキーマとルートどちらで検証すべきか？",
      },
      answer: {
        en: "**Both** — they serve different purposes. Route middleware (Joi/zod) catches bad payloads at the HTTP boundary and returns friendly 400 errors before any business logic runs. Mongoose schema validators are the last line of defense: they run at the DB layer, catching bugs in your own code (e.g., a missing field in a service function that bypasses route validation). Together they give you defense-in-depth.",
        np: "दुवै — route middleware ले HTTP boundary मा 400 दिन्छ; Mongoose ले DB अघि अन्तिम जाँच।",
        jp: "**両方**。ルート検証は HTTP 境界で 400 を返す。Mongoose 検証はコードバグへの最後の砦。",
      },
    },
  ],
};
