import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Authentication** answers “who are you?”—usually email/password or OAuth—while **authorization** answers “what may you do?”—roles or permissions on resources. Node APIs commonly issue **JWTs** after login so subsequent requests carry proof **without** server-side sessions stored for every user (trade-offs exist—refresh tokens matter).",
      np: "प्रमाणीकरण पहिचान; प्राधिकरण अनुमति — JWT सामान्य।",
      jp: "**認証**と**認可**を分ける。JWT はステートレスな証明に便利。",
    },
    {
      en: "**Never store plaintext passwords**—hash with **`bcrypt`** (or Argon2) and compare with timing-safe APIs. Put **`JWT_SECRET`** and DB URIs only in environment variables—never in Git.",
      np: "पासवर्ड ह्यास — गोप्य कुञ्जी env मा मात्र।",
      jp: "パスワードは平文禁止。**JWT_SECRET** は環境変数のみ。",
    },
  ],
  sections: [
    {
      title: { en: "Users, registration & hashing", np: "प्रयोगकर्ता र ह्यासिङ", jp: "ユーザーとハッシュ" },
      blocks: [
        {
          type: "code",
          title: { en: "Hash then store — never plaintext", np: "ह्यास गर्नु", jp: "ハッシュして保存" },
          code: `const bcrypt = require('bcrypt');

async function registerUser({ email, password }) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await User.create({ email, password: hash });
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Registration endpoint validates input, checks duplicates, **hashes** password, persists user without echoing hash back to clients. Login compares supplied password to stored hash—if match, issue **JWT** with **`sub`** (user id) and **`exp`** (expiry). Libraries like **`lodash`** help trim/pick fields—avoid leaking internal keys in responses.",
            np: "दर्ता — दोहोरो जाँच, ह्यास, जवाफमा गोप्य नदेखाउनु।",
            jp: "登録は検証・重複チェック・ハッシュ保存。レスでハッシュを返さない。",
          },
        },
      ],
    },
    {
      title: { en: "JWT flow & protecting routes", np: "JWT र सुरक्षित रूट", jp: "JWT とルート保護" },
      blocks: [
        {
          type: "code",
          title: { en: "Issue on login, verify in middleware", np: "जारी र जाँच", jp: "発行と検証" },
          code: `const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).send('Missing token');
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).send('Invalid token');
  }
}`,
        },
        {
          type: "diagram",
          id: "jwt-flow",
        },
        {
          type: "diagram",
          id: "status-401-403",
        },
        {
          type: "paragraph",
          text: {
            en: "**401 Unauthorized** — missing/invalid/expired token (**identity** problem). **403 Forbidden** — token is valid but user **lacks permission** for this resource. Middleware reads **`Authorization: Bearer …`**, verifies signature with **`JWT_SECRET`**, attaches **`req.user`**, and calls **`next()`**—centralize so every protected route stays one line.",
            np: "401 पहिचान; 403 अनुमति — मिडलवेयरले JWT जाँच।",
            jp: "**401 vs 403** を図の通り区別。ミドルウェアで検証を一元化。",
          },
        },
      ],
    },
    {
      title: { en: "Roles & authorization middleware", np: "भूमिका र प्राधिकरण", jp: "ロールと認可" },
      blocks: [
        {
          type: "code",
          title: { en: "Factory that checks req.user.role", np: "भूमिका जाँच", jp: "ロールチェック" },
          code: `function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).end();
    if (!roles.includes(req.user.role)) return res.status(403).end();
    next();
  };
}

app.delete('/api/movies/:id', authMiddleware, requireRole('admin'), handler);`,
        },
        {
          type: "diagram",
          id: "rbac-model",
        },
        {
          type: "paragraph",
          text: {
            en: "**Role-based access** maps users → roles → permissions on routes (`admin` may delete, `viewer` cannot). Implement as **small middleware factories** (`requireRole('admin')`) so tests can exercise denial paths. **Logout** for JWT APIs often means **client discards tokens** plus server-side blocklists if tokens must be revoked early.",
            np: "भूमिका मिडलवेयर — JWT लगआउट प्रायः क्लाइन्टले टोकन हटाउँछ।",
            jp: "**RBAC** をミドルウェア化。JWT のログアウトはクライアント破棄が基本。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Should JWTs live in localStorage?",
        np: "JWT localStorage मा?",
        jp: "JWT は localStorage？",
      },
      answer: {
        en: "**localStorage** is vulnerable to XSS stealing tokens—many teams prefer **httpOnly cookies** for refresh/access tokens paired with CSRF protections for cookie-based flows. Understand the threat model of your frontend.",
        np: "XSS जोखिम — httpOnly कुकी वा शून्य विश्वास नमूना।",
        jp: "XSS 対策では **httpOnly** の検討。フロントの脅威モデルを決める。",
      },
    },
  ],
};
