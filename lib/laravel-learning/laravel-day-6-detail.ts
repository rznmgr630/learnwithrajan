import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Middleware** sits in the HTTP pipeline between the incoming request and your controller — perfect for cross-cutting concerns like authentication, rate limiting, CORS headers, and string trimming. In **Laravel 11** middleware is registered in `bootstrap/app.php` via `->withMiddleware()` rather than in `Http/Kernel.php`.",
      np: "Middleware HTTP pipeline मा — auth, rate limit, CORS। Laravel 11 मा `bootstrap/app.php` मा दर्ता।",
      jp: "ミドルウェアはリクエストとコントローラの間に置かれ、認証・レート制限・CORS などを一元処理します。Laravel 11 では `bootstrap/app.php` に登録します。",
    },
    {
      en: "The **Request** object (`Illuminate\\Http\\Request`) is injected into every controller method and exposes the full HTTP input: query strings, JSON body, uploaded files, headers, cookies, and IP. **URL generation helpers** (`route()`, `url()`, `asset()`, signed URLs) keep links correct even when the app moves domains.",
      np: "Request object ले input, file, header सब expose गर्छ। URL helper ले link सही राख्छ।",
      jp: "**Request** がコントローラにインジェクトされ、入力・ファイル・ヘッダなどすべて取得可能。URL ヘルパは `route()`・`url()`・`asset()` で一貫したリンクを生成します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Creating & registering middleware",
        np: "Middleware बनाउनु र दर्ता गर्नु",
        jp: "ミドルウェアの作成と登録",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Generate a middleware class with Artisan. The `handle()` method receives the `Request` and a `Closure $next` — call `$next($request)` to pass the request down the pipeline, or return a response early to abort. **After middleware** runs code on the way back out: capture `$response = $next($request)` and modify it before returning.",
            np: "Artisan ले class बनाउँछ। `$next($request)` ले pipeline जारी राख्छ। After middleware ले response modify गर्न सकिन्छ।",
            jp: "Artisan で生成。`handle()` が `$next($request)` を呼ぶとパイプライン継続。`$response = $next($request)` を取得してから変更する「after ミドルウェア」パターンも使えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generate and implement middleware",
            np: "Middleware बनाउनु",
            jp: "ミドルウェアの生成と実装",
          },
          code: `# Generate
php artisan make:middleware EnsureUserIsAdmin

// app/Http/Middleware/EnsureUserIsAdmin.php
<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Symfony\\Component\\HttpFoundation\\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (! $request->user()?->isAdmin()) {
            return redirect('/dashboard')->with('error', 'Admins only.');
        }

        return $next($request); // pass to controller
    }
}

// --- After middleware: modify response on the way back ---
class AddResponseHeader
{
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request); // run controller first
        $response->headers->set('X-App-Version', config('app.version'));
        return $response;
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Laravel 11 registration** lives entirely in `bootstrap/app.php`. You can append/prepend middleware globally, create aliases (short names), and define named groups. The old `Http/Kernel.php` file no longer exists.",
            np: "Laravel 11 मा `bootstrap/app.php` मा मात्र दर्ता। `Http/Kernel.php` छैन।",
            jp: "**Laravel 11** では `bootstrap/app.php` のみで登録。`Http/Kernel.php` は廃止されました。",
          },
        },
        {
          type: "code",
          title: {
            en: "bootstrap/app.php — aliases, groups, global append",
            np: "bootstrap/app.php — दर्ता",
            jp: "bootstrap/app.php への登録",
          },
          code: `// bootstrap/app.php
use App\\Http\\Middleware\\EnsureUserIsAdmin;
use App\\Http\\Middleware\\AddResponseHeader;
use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(/* ... */)
    ->withMiddleware(function (Middleware $middleware) {

        // 1. Global append — runs on every request in the stack
        $middleware->append(AddResponseHeader::class);

        // 2. Named alias — use 'admin' in route definitions
        $middleware->alias([
            'admin' => EnsureUserIsAdmin::class,
        ]);

        // 3. Custom named group
        $middleware->appendToGroup('admin-panel', [
            EnsureUserIsAdmin::class,
            AddResponseHeader::class,
        ]);

        // 4. Prepend to the existing 'web' group
        $middleware->prependToGroup('web', AddResponseHeader::class);
    })
    ->create();

// routes/web.php — using aliases and groups
Route::get('/admin', [AdminController::class, 'index'])->middleware('admin');

Route::middleware('admin-panel')->group(function () {
    Route::resource('admin/posts', AdminPostController::class);
});`,
        },
        {
          type: "table",
          caption: {
            en: "Built-in middleware aliases",
            np: "Built-in middleware aliases",
            jp: "組み込みエイリアス一覧",
          },
          headers: [
            { en: "Alias", np: "Alias", jp: "エイリアス" },
            { en: "What it does", np: "के गर्छ", jp: "動作" },
          ],
          rows: [
            [
              { en: "`auth`", np: "`auth`", jp: "`auth`" },
              {
                en: "Redirect unauthenticated users to the login route",
                np: "Unauthenticated user लाई login redirect",
                jp: "未認証ユーザをログインにリダイレクト",
              },
            ],
            [
              { en: "`auth:sanctum`", np: "`auth:sanctum`", jp: "`auth:sanctum`" },
              {
                en: "Sanctum token or session auth for SPA/API",
                np: "Sanctum token/session auth",
                jp: "Sanctum のトークンまたはセッション認証",
              },
            ],
            [
              { en: "`throttle:60,1`", np: "`throttle:60,1`", jp: "`throttle:60,1`" },
              {
                en: "60 requests per 1 minute (fixed)",
                np: "60 requests/minute fixed",
                jp: "固定: 1 分に 60 リクエスト",
              },
            ],
            [
              { en: "`throttle:api`", np: "`throttle:api`", jp: "`throttle:api`" },
              {
                en: "Named rate limiter — configurable by user tier",
                np: "Named limiter — user tier अनुसार सीमा",
                jp: "名前付きリミッタ。ユーザープランで上限変更可",
              },
            ],
            [
              { en: "`verified`", np: "`verified`", jp: "`verified`" },
              {
                en: "Require email verified before granting access",
                np: "Email verified हुनु पर्छ",
                jp: "メール認証済みのみアクセス許可",
              },
            ],
            [
              { en: "`signed`", np: "`signed`", jp: "`signed`" },
              {
                en: "Validate HMAC signature on the URL",
                np: "HMAC signature validate",
                jp: "URL の HMAC 署名を検証",
              },
            ],
            [
              { en: "`can:permission`", np: "`can:permission`", jp: "`can:permission`" },
              {
                en: "Gate / Policy authorization check",
                np: "Gate/Policy authorization",
                jp: "Gate / Policy の認可チェック",
              },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Request object deep dive",
        np: "Request object विस्तार",
        jp: "Request オブジェクト詳細",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Type-hint `Illuminate\\Http\\Request $request` in any controller method and Laravel's service container automatically resolves and injects it. Every HTTP detail you need is available as a method call — no superglobals (`$_POST`, `$_GET`) needed.",
            np: "Controller method मा `Request $request` type-hint — container ले inject। `$_POST` आवश्यक छैन।",
            jp: "コントローラメソッドに `Request $request` と型付けするだけでコンテナが自動注入します。`$_POST` などスーパーグローバルは不要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Reading input data",
            np: "Input पढ्नु",
            jp: "入力の読み取り",
          },
          code: `use Illuminate\\Http\\Request;

public function store(Request $request)
{
    // ---- basic input ----
    $name  = $request->input('name');               // null if missing
    $name  = $request->input('name', 'Anonymous');  // with default
    $all   = $request->all();
    $sub   = $request->only(['name', 'email']);     // whitelist
    $noPass = $request->except(['password', '_token']); // blacklist

    // ---- nested input (dot notation) ----
    $city = $request->input('address.city');
    $tag0 = $request->input('tags.0');

    // ---- presence checks ----
    $request->has('name');       // key present (even if null)
    $request->filled('name');    // present AND non-empty string
    $request->missing('name');   // opposite of has()
    $request->hasAny(['email', 'username']);

    // ---- type-cast helpers ----
    $active = $request->boolean('active');    // "1","true","on","yes" → true
    $page   = $request->integer('page', 1);   // cast to int, default 1
    $amount = $request->float('amount');
    $date   = $request->date('dob', 'Y-m-d'); // Carbon instance

    // ---- query string vs POST body ----
    $q    = $request->query('search');         // ?search=foo only
    $body = $request->post('field');           // POST body only

    // ---- JSON body (Content-Type: application/json) ----
    $payload = $request->json()->all();
    $token   = $request->json('data.token');   // dot-notation on JSON
}`,
        },
        {
          type: "code",
          title: {
            en: "File uploads & request metadata",
            np: "File upload र metadata",
            jp: "ファイルとリクエストメタデータ",
          },
          code: `public function upload(Request $request)
{
    // ---- files ----
    if ($request->hasFile('avatar') && $request->file('avatar')->isValid()) {
        $file = $request->file('avatar');
        $path = $file->store('avatars', 'public'); // returns stored path
        $orig = $file->getClientOriginalName();
        $size = $file->getSize();                  // bytes
        $mime = $file->getMimeType();
    }

    // ---- request metadata ----
    $request->method();           // "GET" | "POST" | "PUT" | …
    $request->isMethod('POST');   // boolean
    $request->path();             // "admin/posts/1"
    $request->url();              // without query string
    $request->fullUrl();          // with query string
    $request->ip();               // client IP (respects trusted proxies)
    $request->userAgent();
    $request->header('Accept');
    $request->bearerToken();      // Authorization: Bearer <token>
    $request->expectsJson();      // true when client wants JSON
    $request->isJson();           // Content-Type: application/json
    $request->ajax();             // X-Requested-With: XMLHttpRequest

    // ---- passing data from middleware to controller ----
    // In middleware:  $request->merge(['tenant_id' => $tenant->id]);
    // In controller: $tenantId = $request->integer('tenant_id');
}`,
        },
      ],
    },
    {
      title: {
        en: "URL generation helpers",
        np: "URL generation helpers",
        jp: "URL 生成ヘルパ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel provides several helpers to generate URLs so you never hard-code paths. `route()` resolves a **named route**, `url()` builds an absolute URL from a path, `action()` targets a controller method, and `asset()` points to `public/`. All respect `APP_URL` in `.env`.",
            np: "`route()`, `url()`, `action()`, `asset()` — `APP_URL` अनुसार absolute URL।",
            jp: "`route()`・`url()`・`action()`・`asset()` は `APP_URL` を基にした絶対 URL を返します。",
          },
        },
        {
          type: "code",
          title: {
            en: "route(), url(), asset() helpers",
            np: "URL helper उदाहरण",
            jp: "URL ヘルパの使用例",
          },
          code: `use App\\Http\\Controllers\\UserController;
use Illuminate\\Support\\Facades\\URL;

// Named route (most preferred — survives URI changes)
$url = route('users.show', ['user' => $user]);    // /users/42
$url = route('users.show', $user);               // Eloquent model auto-resolves ID

// Absolute URL from path
$url = url('/about');                            // https://app.test/about
$url = url()->current();
$url = url()->previous();

// Controller action URL
$url = action([UserController::class, 'index']);

// Static assets in public/
$img = asset('img/logo.png');                    // https://app.test/img/logo.png
$img = secure_asset('img/logo.png');             // forces https://

// Append query parameters to the current URL
$url = URL::query(['page' => 2, 'sort' => 'name']);`,
        },
        {
          type: "code",
          title: {
            en: "Signed URLs",
            np: "Signed URL उदाहरण",
            jp: "署名付き URL",
          },
          code: `use Illuminate\\Support\\Facades\\URL;

// Permanent signed URL (no expiry)
$link = URL::signedRoute('unsubscribe', ['user' => $user->id]);

// Temporary signed URL (valid for 30 minutes)
$link = URL::temporarySignedRoute(
    'password.reset',
    now()->addMinutes(30),
    ['token' => $token]
);

// Use the 'signed' middleware to auto-validate
Route::get('/unsubscribe/{user}', [UnsubscribeController::class, 'destroy'])
    ->name('unsubscribe')
    ->middleware('signed');

// Or validate manually
if (! URL::hasValidSignature($request)) {
    abort(401, 'Invalid or expired link.');
}`,
        },
        {
          type: "code",
          title: {
            en: "Response helpers & custom headers",
            np: "Response helpers",
            jp: "レスポンスヘルパとカスタムヘッダ",
          },
          code: `// JSON response with custom header
return response()
    ->json(['status' => 'ok', 'data' => $data])
    ->header('X-Request-Id', $requestId)
    ->header('Cache-Control', 'no-store');

// Redirect with flash message
return redirect()->route('posts.index')->with('success', 'Post created!');

// Redirect back with validation errors
return back()->withErrors($validator)->withInput();

// File download
return response()->download(storage_path('app/report.pdf'), 'report.pdf');

// Stream large file without loading into memory
return response()->streamDownload(function () use ($path) {
    echo file_get_contents($path);
}, 'export.csv');

// No content (204)
return response()->noContent();`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I pass data from middleware to controllers?",
        np: "Middleware बाट controller मा डेटा कसरी पठाउने?",
        jp: "ミドルウェアからコントローラにデータを渡すには？",
      },
      answer: {
        en: "Use `$request->merge(['key' => $value])` to add attributes to the input bag, or use `$request->attributes->set('key', $value)` for internal server-side data that must not be tampered with via user input. In the controller, read with `$request->get('key')` or `$request->attributes->get('key')`. The `attributes` bag is invisible to user-submitted form data.",
        np: "`$request->merge()` वा `$request->attributes->set()` ले controller मा data पठाउनुस्। `attributes` bag user-tamper-proof छ।",
        jp: "`$request->merge()` か `$request->attributes->set()` でデータを付加し、コントローラで `$request->get()` か `attributes->get()` で読み取ります。`attributes` バッグはユーザー入力から独立しています。",
      },
    },
    {
      question: {
        en: "What is the difference between the `web` and `api` middleware groups?",
        np: "`web` र `api` group मा के फरक?",
        jp: "`web` と `api` ミドルウェアグループの違いは？",
      },
      answer: {
        en: "The `web` group enables cookies, sessions, CSRF protection, and URL signing — everything needed for a stateful browser experience. The `api` group is stateless (no session, no CSRF) and includes `throttle:api` for rate limiting. Never add session-dependent auth to API routes; use `auth:sanctum` or `auth:api` (token-based) instead.",
        np: "`web` stateful (session, CSRF); `api` stateless (throttle)। API मा `auth:sanctum` प्रयोग।",
        jp: "`web` はセッション・CSRF あり。`api` はステートレスでレート制限のみ。API には `auth:sanctum` などトークン認証を使います。",
      },
    },
    {
      question: {
        en: "How does `throttle:api` differ from `throttle:60,1`?",
        np: "`throttle:api` र `throttle:60,1` मा के फरक?",
        jp: "`throttle:api` と `throttle:60,1` はどう違いますか？",
      },
      answer: {
        en: "`throttle:60,1` hard-codes 60 requests per 1 minute for every caller. `throttle:api` reads the named rate limiter `api` defined via `RateLimiter::for('api', function ($request) { … })` — typically in `bootstrap/app.php`. The named limiter can vary limits by user tier, authenticated vs guest, or per-route — far more flexible for real applications.",
        np: "`throttle:60,1` fixed 60/min; `throttle:api` named limiter — tier अनुसार लचिलो।",
        jp: "`throttle:60,1` は固定。`throttle:api` は `RateLimiter::for('api',…)` の名前付きリミッタで、ユーザープランに応じて上限を変えられます。",
      },
    },
    {
      question: {
        en: "Can middleware modify the response after the controller runs?",
        np: "Middleware ले controller पछि response बदल्न सक्छ?",
        jp: "コントローラ実行後にミドルウェアがレスポンスを変更できますか？",
      },
      answer: {
        en: "Yes — this is called **after middleware**. Capture the response: `$response = $next($request)`, then modify it before returning. Typical uses: adding response headers (`X-Response-Time`, `X-App-Version`), logging the response status code, or injecting a debug toolbar. Code placed after `$next($request)` in `handle()` runs on the way back out through the pipeline.",
        np: "After middleware: `$response = $next($request)` capture, modify, return। Header थप्नु, log गर्नु।",
        jp: "`$response = $next($request)` で取得後に変更して `return` する「after ミドルウェア」パターンです。レスポンスヘッダの追加や処理時間のログに使います。",
      },
    },
    {
      question: {
        en: "What is a signed URL and when should I use it?",
        np: "Signed URL के हो र कहिले प्रयोग गर्ने?",
        jp: "署名付き URL とはいつ使いますか？",
      },
      answer: {
        en: "A signed URL has an HMAC signature appended as a query parameter — the URL cannot be modified without invalidating it. Laravel validates it via the `signed` middleware or `URL::hasValidSignature()`. Use it for **email unsubscribe links**, **password reset links**, **invoice download links**, or any unauthenticated but sensitive action. Use `URL::temporarySignedRoute()` to add an expiry time and prevent link reuse.",
        np: "HMAC signature भएको URL — tamper करे invalid। Email unsubscribe, password reset, invoice download को लागि।",
        jp: "HMAC 署名付きの URL で、改ざんすると無効になります。`signed` ミドルウェアか `URL::hasValidSignature()` で検証。メール解除・パスワードリセット・請求書 DL などに使います。",
      },
    },
    {
      question: {
        en: "How do I apply middleware only to specific HTTP methods on a resource controller?",
        np: "Resource controller मा specific method मा मात्र middleware?",
        jp: "リソースコントローラの特定メソッドだけにミドルウェアを適用するには？",
      },
      answer: {
        en: "Use `->only()` or `->except()` on the resource route to limit registered actions, then attach middleware to specific named routes. Alternatively, in the controller constructor use `$this->middleware('auth')->only(['store', 'update', 'destroy'])` — this leaves `index` and `show` public while protecting write actions.",
        np: "Controller constructor मा `$this->middleware('auth')->only(['store','update','destroy'])` — index/show public रहन्छ।",
        jp: "コントローラのコンストラクタで `$this->middleware('auth')->only(['store','update','destroy'])` とすると、`index`・`show` は公開のまま書き込みだけ保護できます。",
      },
    },
  ],
};
