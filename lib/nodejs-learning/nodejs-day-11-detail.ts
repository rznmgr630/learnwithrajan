import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const NODEJS_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Authentication** is about proving who you are — usually with an email and password. **Authorization** is about what you are allowed to do once you are logged in — things like admin-only routes. Node APIs often use **JWTs** (JSON Web Tokens) after login so the server does not need to store session data for every user. The token travels with each request and the server just verifies it.",
      np: "प्रमाणीकरण पहिचान; प्राधिकरण अनुमति — JWT सामान्य।",
      jp: "**認証**と**認可**を分ける。JWT はステートレスな証明に便利。",
    },
    {
      en: "Passwords must never be stored as plain text — always hash them with **`bcrypt`** before saving, and use bcrypt's compare function when logging in. Keep your **`JWT_SECRET`** and database connection string in environment variables only, never in your code or git history.",
      np: "पासवर्ड ह्यास — गोप्य कुञ्जी env मा मात्र।",
      jp: "パスワードは平文禁止。**JWT_SECRET** は環境変数のみ。",
    },
  ],
  sections: [
    {
      title: { en: "Users, registration & hashing", np: "प्रयोगकर्ता र ह्यासिङ", jp: "ユーザーとハッシュ" },
      blocks: [
        {
          type: "youtube",
          videoId: "7Q17ubqLfaM",
          title: "Node.js JWT Authentication Tutorial",
        },
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
            en: "When a user registers, validate their input, check for duplicate emails, hash the password, and save the user. Never send the hash back in the response. When they log in, compare the password they sent against the stored hash using bcrypt's `compare` function. If it matches, issue a **JWT** that includes the user's ID (`sub`) and an expiry time (`exp`). Strip out internal fields like the password hash before sending the user object back.",
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
          type: "youtube",
          videoId: "7Q17ubqLfaM",
          title: "JWT Authentication in Node.js",
        },
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
            en: "**401** means the request does not have a valid identity — the token is missing, expired, or wrong. **403** means the user is identified but does not have permission for that action. Your auth middleware reads the `Authorization: Bearer ...` header, verifies the token using your secret, then attaches the decoded user to `req.user` and calls `next()`. Centralizing this in one middleware means every protected route is just one line.",
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
            en: "**Role-based access** lets you say which roles can access which routes — `admin` can delete, `viewer` can only read. Writing it as a small middleware factory (`requireRole('admin')`) keeps your route definitions clean and makes it easy to test that denied users get a 403. For logout with JWTs, the simplest approach is having the client delete the token. If you need to revoke tokens before they expire (like after a password change), you will need a server-side token blocklist.",
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
        en: "Storing JWTs in `localStorage` means any injected script (XSS attack) can steal them. Many teams prefer **httpOnly cookies** instead — JavaScript cannot access them, but you need CSRF protection since cookies are automatically sent with requests. The right choice depends on your frontend and your threat model, so understand the trade-off before deciding.",
        np: "XSS जोखिम — httpOnly कुकी वा शून्य विश्वास नमूना।",
        jp: "XSS 対策では **httpOnly** の検討。フロントの脅威モデルを決める。",
      },
    },
  ],
};
