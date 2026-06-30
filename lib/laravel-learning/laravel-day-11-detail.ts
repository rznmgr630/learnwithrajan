import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Every real app needs to answer one question: <b>who is this person, and are they allowed to be here?</b> That's authentication. Laravel gives you three ways to handle it:\n\n• <b>Session-based auth</b> — for web browsers. Log in once, get a cookie, stay logged in across pages.\n• <b>Token-based auth via Sanctum</b> — for APIs and mobile apps. Log in once, get a token, send it with every API request.\n• <b>Breeze</b> — a starter kit that writes all the login/register screens for you so you don't start from scratch.",
      np: "Laravel मा session auth (web) र token auth (API)। Breeze ले सबै screen scaffold गर्छ।",
      jp: "Web はセッション認証、API は Sanctum のトークン認証。Breeze でログイン・登録・パスワードリセット・メール確認を一括生成。",
    },
  ],
  sections: [
    {
      title: {
        en: "Auth guards & session-based login",
        np: "Auth guard र session login",
        jp: "Auth ガードとセッションログイン",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-auth-guard",
        },
        {
          type: "paragraph",
          text: {
            en: "Think of a <b>guard</b> as a checkpoint — it decides how to identify who is making a request.\n\nLaravel ships with two default guards:\n• <b>`web` guard</b> — reads the session cookie. Used for browser-based web pages.\n• <b>`api` guard</b> — reads a token. Used for API requests.\n\nGuards are configured in `config/auth.php`. By default `Auth::check()` and `Auth::user()` use the `web` guard. To check a different guard, call `Auth::guard('api')->check()` — each guard is completely independent.",
            np: "`web` guard session, `api` guard token। `config/auth.php` मा config।",
            jp: "デフォルトは `web`（セッション）と `api`（トークン）。`config/auth.php` でガードを設定。",
          },
        },
        {
          type: "code",
          title: { en: "Auth facade core methods", np: "Auth facade", jp: "Auth ファサード" },
          code: `use Illuminate\\Support\\Facades\\Auth;

// Check if a user is logged in
if (Auth::check()) {
    $user = Auth::user();   // returns Authenticatable|null
    $id   = Auth::id();     // returns int|null
}

// Attempt login (returns bool)
$credentials = ['email' => $email, 'password' => $password];
if (Auth::attempt($credentials, $remember)) {
    $request->session()->regenerate();   // prevent session fixation
    return redirect()->intended('/dashboard');
}

// Manual login (e.g., after registration)
Auth::login($user);
Auth::loginUsingId(1);

// Logout
Auth::logout();
$request->session()->invalidate();
$request->session()->regenerateToken();`,
        },
        {
          type: "paragraph",
          text: {
            en: "To lock down a route so only logged-in users can access it, attach the `auth` middleware. Any visitor who isn't logged in gets redirected to the login page automatically.\n\n• `auth` — must be logged in\n• `verified` — must be logged in <b>and</b> have confirmed their email address\n  ↳ Checks that `email_verified_at` is not null on the user record",
            np: "`auth` middleware route सुरक्षित गर्छ।",
            jp: "`auth` ミドルウェアでルートを保護。`verified` でメール確認済みかを確認。",
          },
        },
        {
          type: "code",
          title: { en: "Protecting routes with middleware", np: "Middleware", jp: "ルート保護" },
          code: `// routes/web.php
Route::middleware('auth')->group(function () {
    Route::get('/dashboard', DashboardController::class);
    Route::resource('posts', PostController::class);
});

// Email-verified gate
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/billing', BillingController::class);
});

// API guard (Sanctum)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/api/user', fn (Request $request) => $request->user());
});`,
        },
      ],
    },
    {
      title: {
        en: "Laravel Breeze install & what it gives you",
        np: "Breeze install र features",
        jp: "Breeze のインストールと提供機能",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Laravel Breeze</b> is a starter kit that builds all the auth screens for you — login, register, password reset, email verification, and profile editing — so you can skip the boring boilerplate and focus on your actual app.\n\nYou pick a frontend stack when you install it:\n• <b>Blade</b> — plain HTML templates with Alpine.js sprinkles (great default for most apps)\n• <b>Livewire</b> — reactive components without writing JavaScript\n• <b>React or Vue via Inertia</b> — full SPA feel with Laravel on the backend\n• <b>API only</b> — no views at all, just the backend routes for your own SPA\n\nNeed teams, two-factor auth, or API token management built in? Look at <b>Jetstream</b> instead — it's the heavier option.",
            np: "Breeze minimal auth starter। नयाँ project को लागि उपयुक्त।",
            jp: "Breeze は軽量の認証スターター。重い要件（チーム・2FA）は Jetstream を検討。",
          },
        },
        {
          type: "code",
          title: { en: "Installation steps", np: "Install", jp: "インストール手順" },
          code: `# 1. Require the package
composer require laravel/breeze --dev

# 2. Scaffold (choose a stack)
php artisan breeze:install blade        # Blade + Alpine.js (default)
php artisan breeze:install livewire     # Livewire full-page
php artisan breeze:install react        # Inertia + React
php artisan breeze:install vue          # Inertia + Vue
php artisan breeze:install api          # API-only (no views, for SPAs)

# 3. Install frontend dependencies & build
npm install
npm run dev

# 4. Run migrations (creates users, password_reset_tokens, sessions tables)
php artisan migrate`,
        },
        {
          type: "list",
          variant: "bullet",
          items: [
            {
              en: "<b>Login</b> — `GET /login` + `POST /login` with rate-limiting (5 attempts per minute).",
              np: "Login — rate limiting सहित।",
              jp: "ログイン — レート制限（5回/分）付き。",
            },
            {
              en: "<b>Registration</b> — `GET /register` + `POST /register`; passwords are hashed automatically with `bcrypt`.",
              np: "Registration — `bcrypt` पासवर्ड।",
              jp: "登録 — パスワードは `bcrypt` でハッシュ。",
            },
            {
              en: "<b>Password reset</b> — `forgot-password` → `reset-password` pages; sends a signed reset email.",
              np: "Password reset — signed mail।",
              jp: "パスワードリセット — 署名付きメールで送信。",
            },
            {
              en: "<b>Email verification</b> — `GET /verify-email` with a re-send button; add `MustVerifyEmail` to the User model to enable it.",
              np: "Email verify — `MustVerifyEmail` interface।",
              jp: "メール確認 — `MustVerifyEmail` をモデルに実装。",
            },
            {
              en: "<b>Profile edit</b> — update name, email, and password; delete account.",
              np: "Profile edit पनि।",
              jp: "プロフィール編集・アカウント削除もあり。",
            },
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "If you're not using Breeze and want to register users manually, the steps are:\n• Hash the password with `Hash::make($password)` — <b>never store plain text passwords</b>\n• Create the user record in the database\n• Call `Auth::login($user)` to log them in immediately after creation",
            np: "Manual: `Hash::make()`, user create, `Auth::login()`।",
            jp: "手動登録: `Hash::make()` でハッシュ → ユーザー作成 → `Auth::login()`。",
          },
        },
        {
          type: "code",
          title: { en: "Manual registration example", np: "Manual register", jp: "手動登録の例" },
          code: `use Illuminate\\Support\\Facades\\Auth;
use Illuminate\\Support\\Facades\\Hash;
use App\\Models\\User;

public function store(Request $request): RedirectResponse
{
    $validated = $request->validate([
        'name'     => ['required', 'string', 'max:255'],
        'email'    => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:8', 'confirmed'],
    ]);

    $user = User::create([
        'name'     => $validated['name'],
        'email'    => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    Auth::login($user);

    return redirect('/dashboard');
}`,
        },
      ],
    },
    {
      title: {
        en: "Sanctum: API tokens & SPA auth",
        np: "Sanctum: token र SPA auth",
        jp: "Sanctum: API トークンと SPA 認証",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When a mobile app or a separate frontend (React, Vue) needs to talk to your Laravel backend, it can't use session cookies the way a browser does. That's where <b>Laravel Sanctum</b> comes in.\n\nSanctum supports two modes:\n• <b>API token mode</b> — the client logs in once, gets a token string, and sends that token as a header (`Authorization: Bearer <token>`) on every request.\n  ↳ Best for: mobile apps, third-party API clients\n• <b>SPA cookie mode</b> — for a frontend hosted on the same domain. Uses session cookies just like the web guard, but CSRF-safe.\n  ↳ Best for: a React/Vue app served from the same domain as the API\n\nSanctum is <b>not</b> OAuth2. If you need to let other companies log in via your app (like 'Sign in with MyApp'), use Laravel Passport.",
            np: "Sanctum — SPA cookie auth र API token। OAuth2 को लागि Passport।",
            jp: "Sanctum は SPA クッキー認証と API トークンの 2 モード。OAuth2 は Passport を使用。",
          },
        },
        {
          type: "code",
          title: { en: "Sanctum setup", np: "Setup", jp: "セットアップ" },
          code: `# Install (already included in Laravel 11 by default)
composer require laravel/sanctum

# Publish config + migrations
php artisan vendor:publish --provider="Laravel\\Sanctum\\SanctumServiceProvider"

php artisan migrate`,
        },
        {
          type: "code",
          title: { en: "HasApiTokens on User model", np: "User model", jp: "User モデル" },
          code: `// app/Models/User.php
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}`,
        },
        {
          type: "code",
          title: { en: "Issuing & revoking tokens", np: "Token बनाउने र मेट्ने", jp: "トークン発行と削除" },
          code: `// Issue a token on login
public function login(Request $request): JsonResponse
{
    $user = User::where('email', $request->email)->first();

    if (! $user || ! Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Invalid credentials'], 401);
    }

    // Create token with optional abilities (scopes)
    $token = $user->createToken('mobile-app', ['posts:read', 'posts:write'])
                   ->plainTextToken;

    return response()->json(['token' => $token]);
}

// Revoke current token (logout)
public function logout(Request $request): JsonResponse
{
    $request->user()->currentAccessToken()->delete();
    return response()->json(['message' => 'Logged out']);
}

// Revoke all tokens (e.g. "log out everywhere")
$user->tokens()->delete();

// Protect API routes — routes/api.php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/posts', [PostController::class, 'index']);
    Route::post('/posts', [PostController::class, 'store']);
});`,
        },
        {
          type: "table",
          caption: {
            en: "SPA cookie auth vs API token auth",
            np: "दुई mode तुलना",
            jp: "SPA クッキー vs API トークン",
          },
          headers: [
            { en: "Mode", np: "Mode", jp: "モード" },
            { en: "Use case", np: "प्रयोग", jp: "ユースケース" },
            { en: "Credentials sent as", np: "credential", jp: "認証情報" },
            { en: "Stateful?", np: "Stateful?", jp: "Stateful?" },
          ],
          rows: [
            [
              { en: "SPA Cookie", np: "SPA Cookie", jp: "SPA クッキー" },
              { en: "Same-domain SPA (React, Vue)", np: "Same-domain SPA", jp: "同一ドメイン SPA" },
              { en: "Session cookie (CSRF token required)", np: "Cookie + CSRF", jp: "Cookie + CSRF" },
              { en: "Yes", np: "हो", jp: "Yes" },
            ],
            [
              { en: "API Token", np: "API Token", jp: "API トークン" },
              { en: "Mobile apps, 3rd-party clients", np: "Mobile app", jp: "モバイル・外部クライアント" },
              { en: "`Authorization: Bearer <token>` header", np: "Bearer header", jp: "Bearer ヘッダー" },
              { en: "No", np: "होइन", jp: "No" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Password reset & email verification",
        np: "Password reset र email verification",
        jp: "パスワードリセットとメール確認",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel's <b>password broker</b> handles the full forgot-password flow for you:\n• User submits their email → Laravel generates a short-lived signed token and emails a reset link\n• User clicks the link → Laravel validates the token and lets them set a new password\n• Password is updated → token is deleted so it can't be reused\n\nIf you're using Breeze, all this is wired up automatically. The code below shows how the underlying `Password` facade works — useful if you're building a custom flow.",
            np: "Password broker ले reset flow सम्हाल्छ। Breeze ले automatic गर्छ।",
            jp: "パスワードブローカーがリセット全体を処理。Breeze を使えば自動、カスタムフローにも対応。",
          },
        },
        {
          type: "code",
          title: { en: "Password reset with Password facade", np: "Password facade", jp: "Password ファサード" },
          code: `use Illuminate\\Support\\Facades\\Password;

// 1. Send reset link
$status = Password::sendResetLink($request->only('email'));

if ($status === Password::RESET_LINK_SENT) {
    return back()->with('status', __($status));
}
return back()->withErrors(['email' => __($status)]);

// 2. Reset password (called from reset form)
$status = Password::reset(
    $request->only('email', 'password', 'password_confirmation', 'token'),
    function (User $user, string $password) {
        $user->forceFill(['password' => Hash::make($password)])
             ->setRememberToken(Str::random(60));
        $user->save();
        event(new PasswordReset($user));
    }
);

return $status === Password::PASSWORD_RESET
    ? redirect()->route('login')->with('status', __($status))
    : back()->withErrors(['email' => __($status)]);`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Email verification</b> lets you require users to confirm their email address before they can access certain parts of your app.\n\nTo enable it:\n• Add `implements MustVerifyEmail` to your `User` model\n• Laravel will automatically send a verification email after registration\n• Protect routes with the `verified` middleware — users who haven't verified get redirected to `/email/verify`",
            np: "`MustVerifyEmail` implement गर्नु। `verified` middleware थप्नु।",
            jp: "`MustVerifyEmail` を実装するとメール確認が有効。`verified` ミドルウェアで未確認ユーザーをブロック。",
          },
        },
        {
          type: "code",
          title: { en: "Email verification setup", np: "Email verify", jp: "メール確認の設定" },
          code: `// app/Models/User.php
use Illuminate\\Contracts\\Auth\\MustVerifyEmail;

class User extends Authenticatable implements MustVerifyEmail
{
    // Registration automatically sends verification email
}

// Check in code
if (Auth::user()->hasVerifiedEmail()) {
    // proceed
}

// Manually trigger verification email
$user->sendEmailVerificationNotification();

// routes/web.php — Breeze adds these automatically
Route::get('/email/verify', EmailVerificationPromptController::class)
    ->middleware('auth')
    ->name('verification.notice');

Route::get('/email/verify/{id}/{hash}', VerifyEmailController::class)
    ->middleware(['auth', 'signed', 'throttle:6,1'])
    ->name('verification.verify');`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Breeze, Jetstream, and Fortify?",
        np: "Breeze, Jetstream, Fortify फरक के हो?",
        jp: "Breeze・Jetstream・Fortify の違いは？",
      },
      answer: {
        en: "Think of them as three tiers of auth scaffolding:\n\n• <b>Fortify</b> — the engine. Backend routes and logic only, no views. You build the UI yourself.\n• <b>Breeze</b> — Fortify with simple, clean views added. Covers login, register, password reset, email verify, and profile. Perfect for most projects.\n• <b>Jetstream</b> — the full package. Adds team management, two-factor authentication, API token management, and a richer UI. Use this only if you specifically need teams or 2FA.\n\nFor a new project, start with Breeze.",
        np: "Fortify = headless backend। Breeze = Fortify + views। Jetstream = team, 2FA सहित।",
        jp: "Fortify はビューなしのバックエンドのみ。Breeze は Fortify + シンプルなビュー。Jetstream はチーム・2FA まで含む大型キット。",
      },
    },
    {
      question: {
        en: "Is Sanctum suitable for mobile apps?",
        np: "Mobile app को लागि Sanctum ठीक छ?",
        jp: "Sanctum はモバイルアプリに適していますか？",
      },
      answer: {
        en: "Yes — Sanctum's <b>API token mode</b> is the recommended approach for mobile apps.\n\nThe flow is simple:\n• The app logs in once with email + password\n• Laravel returns a plain-text token\n• The app stores the token securely (iOS Keychain / Android Keystore)\n• Every API request sends the token as `Authorization: Bearer <token>`\n\nTokens can have abilities (scopes) to limit what they can do, and can be revoked individually.\n\nIf you need complex OAuth2 flows — for example, letting third-party apps authenticate via your platform — use Laravel Passport instead.",
        np: "API token mode mobile को लागि राम्रो। Passport OAuth2 को लागि।",
        jp: "API トークンモードがモバイルに最適。OAuth2 が必要なら Passport を。",
      },
    },
    {
      question: {
        en: "How do I add roles to authenticated users?",
        np: "User मा role कसरी थप्ने?",
        jp: "認証済みユーザーにロールを追加する方法は？",
      },
      answer: {
        en: "The simplest approach: add a `role` column to your `users` table with values like `admin`, `editor`, or `viewer`. Then check it wherever you need to: `$user->role === 'admin'`.\n\nFor more advanced role and permission management with database-backed rules (assign/revoke at runtime without redeploying code), use the <b>Spatie Laravel Permission</b> package: `composer require spatie/laravel-permission`. It adds helpful methods like `hasRole()`, `can()`, and `givePermissionTo()`.\n\nYou can also use Gates and Policies (Day 12) to authorize actions without needing a formal role system at all.",
        np: "`role` column सरल। Spatie permission package advanced RBAC को लागि।",
        jp: "`users` テーブルに `role` カラムが最もシンプル。高度な RBAC は Spatie Permission パッケージを使用。",
      },
    },
    {
      question: {
        en: "What is the `remember_token` field for?",
        np: "`remember_token` किस लागि?",
        jp: "`remember_token` フィールドは何のためにあるの？",
      },
      answer: {
        en: "It powers the <b>\"remember me\"</b> checkbox on login forms.\n\nWhen a user logs in with `Auth::attempt($credentials, true)`, Laravel:\n• Stores a long-lived token in the `remember_token` column\n• Sets a persistent cookie in the browser\n\nOn future visits, the browser sends the cookie, Laravel validates it against the database, and the user stays logged in — without re-entering their password.\n\nThe token is rotated every time it's used (so stolen cookies can't be replayed) and cleared completely on logout. Don't remove this column from the `users` migration if you want remember-me to work.",
        np: "\"Remember me\" को लागि। Persistent cookie check गर्छ।",
        jp: "\"Remember me\" ログイン用。永続クッキーと DB トークンを照合して自動ログイン。",
      },
    },
    {
      question: {
        en: "Can I have multiple auth guards?",
        np: "धेरै auth guard राख्न मिल्छ?",
        jp: "複数の認証ガードは持てますか？",
      },
      answer: {
        en: "Yes. Add as many guards as you need in `config/auth.php`.\n\nA common pattern: a separate `admin` guard backed by an `admins` table with its own session. Admins log in via `Auth::guard('admin')->attempt($credentials)` and hit routes protected by `Route::middleware('auth:admin')`.\n\nEach guard is completely independent — an authenticated admin user is not recognized by the `web` guard, and vice versa.",
        np: "`config/auth.php` मा guard थप्न मिल्छ। प्रत्येक guard स्वतन्त्र।",
        jp: "`config/auth.php` に追加可能。`admin` ガードなど別テーブルで独立した認証ができます。",
      },
    },
    {
      question: {
        en: "How do I protect a route for specific user types?",
        np: "विशेष user type को लागि route protect?",
        jp: "特定ユーザータイプのみルートを保護する方法は？",
      },
      answer: {
        en: "Three options, from simplest to most structured:\n\n• <b>Custom middleware</b> — `php artisan make:middleware EnsureUserIsAdmin`. Inside `handle()`, check `$request->user()?->role === 'admin'` and call `abort(403)` if not. Register the middleware with an alias in `bootstrap/app.php` (Laravel 11).\n• <b>Gate</b> — define a one-off rule in `AppServiceProvider::boot()` and check it with `Gate::authorize()`.\n• <b>Policy</b> — for model-based checks, covered in Day 12.",
        np: "Custom middleware वा Gate/Policy। `abort(403)` फर्काउनु।",
        jp: "カスタムミドルウェアか Gate/Policy（Day 12 参照）。`abort(403)` で弾く。",
      },
    },
    {
      question: {
        en: "How do I test authentication in feature tests?",
        np: "Feature test मा auth कसरी test गर्ने?",
        jp: "フィーチャーテストで認証をテストする方法は？",
      },
      answer: {
        en: "Use `$this->actingAs($user)` to act as a logged-in user for the duration of a test request — no need to actually go through the login form.\n\n• For web routes: `$this->actingAs($user)` (uses the `web` guard)\n• For Sanctum API routes: `$this->actingAs($user, 'sanctum')`\n• Create test users with factories: `$user = User::factory()->create()`\n• Assert unauthenticated access redirects: `->assertRedirect('/login')`\n• Assert authenticated access succeeds: `->assertOk()`",
        np: "`actingAs($user)` test मा auth। Factory ले user बनाउने।",
        jp: "`actingAs($user)` でテスト内で認証。Sanctum は第2引数に `'sanctum'` を渡す。",
      },
    },
  ],
};
