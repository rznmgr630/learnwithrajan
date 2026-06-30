import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Think of middleware as a series of checkpoints that every HTTP request must pass through before reaching your controller.\n\n<b>What does middleware do?</b>\n• It handles concerns that apply to many routes — instead of repeating logic in every controller\n  ↳ Authentication: is this user logged in? If not, redirect to login\n  ↳ Rate limiting: has this user sent too many requests? If so, return a 429 Too Many Requests\n  ↳ CORS headers: add the right headers so browsers allow cross-origin requests\n  ↳ Input trimming: strip whitespace from all string inputs automatically\n\n<b>Laravel 11 change</b>\n• In older versions, middleware was registered in `Http/Kernel.php`\n  ↳ That file no longer exists in Laravel 11 — all middleware registration happens in `bootstrap/app.php` using `->withMiddleware()`",
      np: "Middleware HTTP pipeline मा — auth, rate limit, CORS। Laravel 11 मा `bootstrap/app.php` मा दर्ता।",
      jp: "ミドルウェアはリクエストとコントローラの間に置かれ、認証・レート制限・CORS などを一元処理します。Laravel 11 では `bootstrap/app.php` に登録します。",
    },
    {
      en: "The <b>Request</b> object is your window into everything about the incoming HTTP request — and Laravel automatically injects it into your controller methods.\n\n<b>What you can read from the Request</b>\n• Form inputs and query string values\n• JSON body (when `Content-Type: application/json`)\n• Uploaded files\n• Headers, cookies, the client's IP address\n  ↳ No more `$_POST`, `$_GET`, or `$_FILES` — the Request object is cleaner and testable\n\n<b>URL generation helpers</b>\n• `route('name')`, `url('/path')`, `asset('file.js')` — generate absolute URLs tied to your app's domain\n  ↳ If your app moves domains, only `APP_URL` in `.env` needs to change — all URLs update automatically",
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
            en: "Every middleware is a PHP class with one key method — `handle()`. Laravel calls it on every matching request.\n\n<b>Inside `handle()`</b>\n• `$next($request)` — passes the request further down the pipeline (toward the controller)\n  ↳ Call this to continue; skip it to abort the request early (e.g. return a redirect or 403)\n• Code before `$next($request)` runs on the way in — this is a <b>before middleware</b>\n• Code after `$next($request)` runs on the way out — this is an <b>after middleware</b>\n  ↳ Capture the response: `$response = $next($request)`, modify it, then `return $response`",
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
            en: "In Laravel 11, you register all middleware in `bootstrap/app.php` inside the `->withMiddleware()` callback.\n\n<b>What you can do there</b>\n• `append()` / `prepend()` — add middleware to the global stack (runs on every request)\n• `alias()` — give a middleware a short name so you can use it in route definitions (`->middleware('admin')`)\n• `appendToGroup()` / `prependToGroup()` — add middleware to an existing group like `web` or `api`\n  ↳ Groups let you apply multiple middleware to a set of routes in one line",
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
            en: "To access the current HTTP request in a controller, just type-hint `Request $request` in the method signature — Laravel injects it automatically.\n\n<b>Why this is better than PHP superglobals</b>\n• No more `$_POST['name']`, `$_GET['page']`, `$_FILES['avatar']`\n  ↳ The Request object provides clean, consistent methods for all of these\n• It's testable — you can pass a fake Request in unit tests without making a real HTTP call\n• Dot notation lets you read nested data: `$request->input('address.city')`",
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
            en: "Hard-coding URLs like `/users/42` in your code is fragile — if you rename a route, every hard-coded link breaks.\n\nLaravel's URL helpers solve this:\n• `route('users.show', $user)` — generates a URL from a named route\n  ↳ If the route URI changes, only the route file needs updating — all links stay correct\n• `url('/about')` — builds an absolute URL from a path, using `APP_URL` from `.env`\n• `action([UserController::class, 'index'])` — generates a URL that points to a specific controller method\n• `asset('img/logo.png')` — generates a URL to a file in your `public/` folder\n  ↳ `secure_asset()` forces HTTPS",
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
        en: "Middleware often resolves something useful — like the current tenant or a decoded API token — and needs to hand it to the controller.\n\n<b>Two ways to do it:</b>\n• `$request->merge(['key' => $value])` — adds it to the input bag\n  ↳ Read in controller with `$request->input('key')`\n  ↳ Drawback: users could potentially send a form field with the same name and interfere\n• `$request->attributes->set('key', $value)` — adds it to the server-side attributes bag\n  ↳ Read in controller with `$request->attributes->get('key')`\n  ↳ This bag is completely separate from user-submitted data — safe for internal use",
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
        en: "These two groups reflect two different ways applications work.\n\n<b>`web` group</b>\n• Enables cookies, sessions, and CSRF protection\n• Designed for browser-facing routes — the kind where a user logs in and gets a session cookie\n  ↳ Without CSRF protection, a malicious website could trick a logged-in user into submitting forms\n\n<b>`api` group</b>\n• Stateless — no session, no CSRF\n• Designed for mobile apps and frontends that send a token with every request instead of using cookies\n• Includes `throttle:api` rate limiting\n  ↳ Use `auth:sanctum` for token-based authentication on API routes, not `auth` (which relies on sessions)",
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
        en: "Both limit how many requests a user can make, but in different ways.\n\n<b>`throttle:60,1`</b>\n• Hard-coded: 60 requests per 1 minute for every single caller — no exceptions\n  ↳ Simple but inflexible — an admin user gets the same limit as a free-tier user\n\n<b>`throttle:api`</b>\n• Reads a named rate limiter called `api` that you define in `bootstrap/app.php`\n• The named limiter is a function, so it can return different limits depending on context:\n  ↳ Authenticated users get 1000 requests/minute, guests get 60\n  ↳ Premium plan users get unlimited, free users get 100\n• Much more practical for real applications where different users deserve different limits",
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
        en: "Yes — this is called <b>after middleware</b>, and it's just as common as before middleware.\n\n<b>How it works</b>\n• Instead of returning `$next($request)` directly, capture it: `$response = $next($request)`\n• The controller runs completely at that point\n• Now you can modify `$response` before returning it\n\n<b>Common uses</b>\n• Add security or debug headers to every response: `$response->headers->set('X-App-Version', '1.0')`\n• Log the HTTP status code of every response\n• Inject a debug toolbar (this is how Debugbar works)\n  ↳ Everything after `$next($request)` in `handle()` runs on the way back out",
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
        en: "A signed URL is a regular URL with a cryptographic signature added to it — if anyone changes even one character of the URL, the signature becomes invalid.\n\n<b>How it works</b>\n• Laravel generates the URL with `URL::signedRoute()` and appends a `signature` query parameter\n• When the user visits the URL, Laravel checks the signature with the `signed` middleware\n  ↳ If it's valid, the request proceeds; if tampered, it returns a 403 error\n\n<b>When to use signed URLs</b>\n• Email unsubscribe links — so one user can't unsubscribe another user by guessing the URL\n• Password reset links\n• Invoice or file download links\n• Any unauthenticated action that should only work for a specific intended recipient\n\n<b>Adding an expiry</b>\n• Use `URL::temporarySignedRoute()` to make the link expire after a set time\n  ↳ Prevents old links from being reused indefinitely",
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
        en: "Resource controllers register 7 routes (index, create, store, show, edit, update, destroy) by default — but you often only want middleware on some of them.\n\n<b>Option 1: Controller constructor</b>\n• Use `$this->middleware('auth')->only(['store', 'update', 'destroy'])` in the constructor\n  ↳ `index` and `show` stay public (no auth needed to browse)\n  ↳ `store`, `update`, `destroy` require authentication (write actions)\n• `->except(['index', 'show'])` is the inverse — apply to everything except the listed methods\n\n<b>Option 2: Route definition</b>\n• Use `->only()` or `->except()` on `Route::resource()` to limit which routes are even registered\n  ↳ Then attach middleware to individual named routes using their auto-generated names like `posts.store`",
        np: "Controller constructor मा `$this->middleware('auth')->only(['store','update','destroy'])` — index/show public रहन्छ।",
        jp: "コントローラのコンストラクタで `$this->middleware('auth')->only(['store','update','destroy'])` とすると、`index`・`show` は公開のまま書き込みだけ保護できます。",
      },
    },
  ],
};
