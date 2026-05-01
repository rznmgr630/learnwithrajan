import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_11_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Authentication is the foundation of any real application. Laravel gives you **session-based auth** for web, **token-based auth** via Sanctum for APIs, and **Breeze** as a full starter kit that scaffolds login, register, password reset, and email verification in minutes.",
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
            en: "Laravel ships with two **default guards**: `web` (session cookie) and `api` (token). Guards live in `config/auth.php`. The `web` guard uses the `SessionGuard` driver and the `users` table provider by default. Each guard authenticates requests independently — you can check `Auth::guard('api')->check()` separately from `Auth::check()`.",
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
            en: "The `auth` **middleware** protects routes. Apply it in route files or inside a controller constructor. The `verified` middleware checks `email_verified_at` is not null.",
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
            en: "**Laravel Breeze** is the minimal auth starter. It scaffolds everything and lets you choose a frontend stack. It's perfect for new projects; for heavier needs (teams, 2FA) look at Jetstream.",
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
              en: "**Login** — `GET /login` + `POST /login` with rate-limiting (5 attempts / min).",
              np: "Login — rate limiting सहित।",
              jp: "ログイン — レート制限（5回/分）付き。",
            },
            {
              en: "**Registration** — `GET /register` + `POST /register`; hashes password with `bcrypt`.",
              np: "Registration — `bcrypt` पासवर्ड।",
              jp: "登録 — パスワードは `bcrypt` でハッシュ。",
            },
            {
              en: "**Password reset** — `forgot-password` → `reset-password` pages; sends signed mail.",
              np: "Password reset — signed mail।",
              jp: "パスワードリセット — 署名付きメールで送信。",
            },
            {
              en: "**Email verification** — `GET /verify-email`; re-send button; `MustVerifyEmail` on User model.",
              np: "Email verify — `MustVerifyEmail` interface।",
              jp: "メール確認 — `MustVerifyEmail` をモデルに実装。",
            },
            {
              en: "**Profile edit** — update name/email/password; delete account.",
              np: "Profile edit पनि।",
              jp: "プロフィール編集・アカウント削除もあり。",
            },
          ],
        },
        {
          type: "paragraph",
          text: {
            en: "**Manual user registration** (without Breeze): hash the password with `Hash::make($password)` (never store plain text), create the user record, then call `Auth::login($user)` to auto-log them in.",
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
            en: "**Laravel Sanctum** provides a featherweight token system for SPAs, mobile apps, and simple APIs. It supports two modes: **API token** (issue personal access tokens) and **SPA cookie auth** (stateful, cookie-based, no tokens needed). It does NOT handle OAuth2 — use Passport for that.",
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
            en: "Laravel's **password broker** handles the full reset flow: generate a signed token, email a reset link, validate the token, update the password. You rarely call this manually when using Breeze, but knowing the facade helps for custom flows.",
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
            en: "**Email verification** requires the `User` model to implement `MustVerifyEmail`. After registration, Laravel sends a verification email automatically. Protect routes with the `verified` middleware — unverified users are redirected to `/email/verify`.",
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
        en: "**Fortify** is a headless backend-only auth library — no views, just routes and logic. **Breeze** wraps Fortify with simple views (Blade, Livewire, Inertia) and is ideal for most projects. **Jetstream** is a full-featured kit that adds team management, two-factor authentication, API token management via Sanctum, and a richer UI (Livewire or Inertia). Start with Breeze, upgrade to Jetstream only if you need teams or 2FA.",
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
        en: "Yes — Sanctum's **API token mode** is the recommended approach for mobile apps. The app logs in once, receives a plain-text token, stores it securely (iOS Keychain / Android Keystore), and sends it as `Authorization: Bearer <token>` on every request. Tokens can have abilities (scopes) and can be revoked individually. For complex OAuth2 flows (e.g. third-party apps), use Laravel Passport instead.",
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
        en: "The simplest approach is a `role` column on the `users` table (`admin`, `editor`, `viewer`). For more advanced RBAC with permissions, use the **Spatie Laravel Permission** package (`composer require spatie/laravel-permission`), which provides `hasRole()`, `can()`, and DB-backed permissions. You can also use Gates and Policies (Day 12) to authorize actions without a formal role system.",
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
        en: "When a user logs in with **\"remember me\"** checked (`Auth::attempt($credentials, true)`), Laravel stores a long-lived token in the `remember_token` column and sets a persistent cookie (`laravel_token`). On future visits the cookie is validated against the DB without the user re-entering credentials. The token is rotated on each use and cleared on logout. Never remove this column from the `users` migration if you want remember-me functionality.",
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
        en: "Yes. Add guards in `config/auth.php`. A common pattern is a separate `admin` guard backed by an `admins` table/model with its own session. Example: `Auth::guard('admin')->attempt($credentials)`. Middleware can be scoped: `Route::middleware('auth:admin')`. Each guard is fully independent, so an authenticated `admin` user is not recognized by the `web` guard.",
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
        en: "Use a **Gate** or **Policy** (covered in Day 12), or write a custom middleware. Example custom middleware: `php artisan make:middleware EnsureUserIsAdmin`. Inside the `handle` method, check `$request->user()?->role === 'admin'` and return `abort(403)` or `abort(401)` if not. Register the middleware with an alias in `bootstrap/app.php` (Laravel 11) or `Kernel.php` (Laravel 10).",
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
        en: "Use `$this->actingAs($user)` to authenticate a user for the duration of the test request. For API tests use `$this->actingAs($user, 'sanctum')`. Create users with factories: `$user = User::factory()->create()`. Check responses with `->assertRedirect('/login')` for unauthenticated access and `->assertOk()` for authenticated access.",
        np: "`actingAs($user)` test मा auth। Factory ले user बनाउने।",
        jp: "`actingAs($user)` でテスト内で認証。Sanctum は第2引数に `'sanctum'` を渡す。",
      },
    },
  ],
};
