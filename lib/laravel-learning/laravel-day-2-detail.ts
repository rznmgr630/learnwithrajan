import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Routing** maps an HTTP verb + URI to a closure or controller action. In Laravel 11 the `routes/web.php` and `routes/api.php` files are registered inside `bootstrap/app.php` via `->withRouting()`. The **Router** resolves the correct handler, runs the middleware pipeline, and returns a response.",
      np: "Routing HTTP verb + URI लाई closure वा controller मा जोड्छ। Laravel 11 मा `bootstrap/app.php` मा `->withRouting()` बाट register हुन्छ।",
      jp: "ルーティングは HTTP メソッドと URI をクロージャまたはコントローラに結び付けます。Laravel 11 では `bootstrap/app.php` の `->withRouting()` で登録されます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Route basics & parameters",
        np: "Route आधार र parameters",
        jp: "ルートの基礎とパラメータ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel exposes static helpers for every HTTP verb: `Route::get`, `Route::post`, `Route::put`, `Route::patch`, `Route::delete`. Use `Route::any` to accept all verbs, or `Route::match(['get','post'], …)` for a subset.",
            np: "Laravel मा `get`, `post`, `put`, `patch`, `delete`, `any`, `match` route helper छन्।",
            jp: "Laravel はすべての HTTP メソッド向けに静的ヘルパを提供します（`get`・`post`・`put`・`patch`・`delete`・`any`・`match`）。",
          },
        },
        {
          type: "code",
          title: {
            en: "HTTP verb helpers",
            np: "HTTP verb helpers",
            jp: "HTTP メソッドヘルパ",
          },
          code: `use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\UserController;

// GET — read
Route::get('/users', [UserController::class, 'index']);

// POST — create
Route::post('/users', [UserController::class, 'store']);

// PUT / PATCH — replace / partial update
Route::put('/users/{id}', [UserController::class, 'update']);
Route::patch('/users/{id}', [UserController::class, 'update']);

// DELETE — remove
Route::delete('/users/{id}', [UserController::class, 'destroy']);

// Accept any HTTP method
Route::any('/legacy', fn () => 'ok');

// Accept only GET or POST
Route::match(['get', 'post'], '/form', [FormController::class, 'handle']);

// Shorthand: no controller needed when only returning a view
Route::view('/about', 'about');`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Route parameters** are defined with `{name}` (required) or `{name?}` (optional, supply a default). Constrain with `->where('id', '[0-9]+')` or the shorthand helpers like `->whereNumber('id')`, `->whereAlpha('slug')`, `->whereAlphaNumeric('code')`.",
            np: "`{name}` required; `{name?}` optional (default चाहिन्छ)। `->whereNumber()` जस्ता constraint helpers।",
            jp: "`{name}` で必須、`{name?}` でオプション（デフォルト値を設定）。`->whereNumber()` などの制約ヘルパも使えます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Required, optional & constrained parameters",
            np: "Required, optional र constrained parameters",
            jp: "必須・オプション・制約付きパラメータ",
          },
          code: `// Required parameter
Route::get('/users/{id}', fn (string $id) => $id)
    ->whereNumber('id'); // same as ->where('id', '[0-9]+')

// Optional parameter with a default
Route::get('/posts/{page?}', function (int $page = 1) {
    return "Page $page";
});

// Multiple constraints
Route::get('/shop/{category}/{slug}', [ShopController::class, 'show'])
    ->whereAlpha('category')
    ->whereAlphaNumeric('slug');

// Global constraint in AppServiceProvider::boot()
// Route::pattern('id', '[0-9]+');`,
        },
      ],
    },
    {
      title: {
        en: "Named routes & groups",
        np: "Named routes र groups",
        jp: "名前付きルートとグループ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "**Name a route** with `->name('users.index')` so you can generate URLs with `route('users.index')` without hard-coding paths. If the URI ever changes, every `route()` call stays correct automatically.",
            np: "`->name('users.index')` ले URL path बदलिए पनि `route()` सही रहन्छ।",
            jp: "`->name('users.index')` で URI を名前で参照できます。URI が変わっても `route()` 呼び出しは壊れません。",
          },
        },
        {
          type: "code",
          title: {
            en: "Named routes",
            np: "Named routes",
            jp: "名前付きルート",
          },
          code: `Route::get('/users/{id}', [UserController::class, 'show'])
    ->name('users.show');

// Generate URL in a controller or service
$url = route('users.show', ['id' => 42]);          // /users/42
$url = route('users.show', ['id' => 42], false);   // relative: users/42

// In Blade
<a href="{{ route('users.show', $user) }}">View</a>

// Redirect to a named route
return redirect()->route('users.show', ['id' => $user->id]);

// Check the current route name in middleware / controllers
if (request()->routeIs('users.*')) { ... }`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Route groups** share attributes (prefix, name prefix, middleware, controller) across multiple routes. Groups are chainable and nestable.",
            np: "Route groups ले prefix, name, middleware, controller share गर्छन्। chainable र nestable।",
            jp: "ルートグループでプレフィックス・名前・ミドルウェア・コントローラを複数ルートで共有できます。ネスト可能です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Grouping with prefix, name & middleware",
            np: "prefix, name र middleware सहित group",
            jp: "プレフィックス・名前・ミドルウェアでグループ化",
          },
          code: `use App\\Http\\Controllers\\AdminController;

// Prefix + name prefix + middleware
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified'])
    ->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard'])
            ->name('dashboard'); // full name: admin.dashboard

        Route::get('/users', [AdminController::class, 'users'])
            ->name('users'); // admin.users
    });

// Controller group — avoid repeating the class
Route::controller(UserController::class)->group(function () {
    Route::get('/users',       'index');
    Route::post('/users',      'store');
    Route::get('/users/{id}',  'show');
    Route::put('/users/{id}',  'update');
    Route::delete('/users/{id}', 'destroy');
});`,
        },
      ],
    },
    {
      title: {
        en: "Resource routes & API routes",
        np: "Resource routes र API routes",
        jp: "リソースルートと API ルート",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "`Route::resource('posts', PostController::class)` registers **7 conventional routes** in one call. `Route::apiResource()` registers **5** (omits `create` and `edit` which serve HTML forms — not needed for APIs).",
            np: "`Route::resource()` ले 7 routes; `apiResource()` ले 5 (create/edit बिना)।",
            jp: "`Route::resource()` で **7 ルート**を一括登録。`apiResource()` は HTML フォーム不要の API 向けに **5 ルート**のみ。",
          },
        },
        {
          type: "table",
          caption: {
            en: "Resource controller actions registered by `Route::resource('posts', PostController::class)`",
            np: "`Route::resource('posts', PostController::class)` का 7 action",
            jp: "`Route::resource('posts', PostController::class)` で登録される 7 アクション",
          },
          headers: [
            { en: "Verb", np: "Verb", jp: "メソッド" },
            { en: "URI", np: "URI", jp: "URI" },
            { en: "Action", np: "Action", jp: "アクション" },
            { en: "Route name", np: "Route name", jp: "ルート名" },
            { en: "In apiResource?", np: "apiResource मा?", jp: "apiResource?" },
          ],
          rows: [
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/posts`", np: "`/posts`", jp: "`/posts`" },
              { en: "`index`", np: "`index`", jp: "`index`" },
              { en: "`posts.index`", np: "`posts.index`", jp: "`posts.index`" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/posts/create`", np: "`/posts/create`", jp: "`/posts/create`" },
              { en: "`create`", np: "`create`", jp: "`create`" },
              { en: "`posts.create`", np: "`posts.create`", jp: "`posts.create`" },
              { en: "No", np: "होइन", jp: "いいえ" },
            ],
            [
              { en: "POST", np: "POST", jp: "POST" },
              { en: "`/posts`", np: "`/posts`", jp: "`/posts`" },
              { en: "`store`", np: "`store`", jp: "`store`" },
              { en: "`posts.store`", np: "`posts.store`", jp: "`posts.store`" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/posts/{post}`", np: "`/posts/{post}`", jp: "`/posts/{post}`" },
              { en: "`show`", np: "`show`", jp: "`show`" },
              { en: "`posts.show`", np: "`posts.show`", jp: "`posts.show`" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/posts/{post}/edit`", np: "`/posts/{post}/edit`", jp: "`/posts/{post}/edit`" },
              { en: "`edit`", np: "`edit`", jp: "`edit`" },
              { en: "`posts.edit`", np: "`posts.edit`", jp: "`posts.edit`" },
              { en: "No", np: "होइन", jp: "いいえ" },
            ],
            [
              { en: "PUT/PATCH", np: "PUT/PATCH", jp: "PUT/PATCH" },
              { en: "`/posts/{post}`", np: "`/posts/{post}`", jp: "`/posts/{post}`" },
              { en: "`update`", np: "`update`", jp: "`update`" },
              { en: "`posts.update`", np: "`posts.update`", jp: "`posts.update`" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
            [
              { en: "DELETE", np: "DELETE", jp: "DELETE" },
              { en: "`/posts/{post}`", np: "`/posts/{post}`", jp: "`/posts/{post}`" },
              { en: "`destroy`", np: "`destroy`", jp: "`destroy`" },
              { en: "`posts.destroy`", np: "`posts.destroy`", jp: "`posts.destroy`" },
              { en: "Yes", np: "हो", jp: "はい" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Resource & API resource variants",
            np: "Resource र API resource",
            jp: "リソース・API リソースの各形式",
          },
          code: `// Full web resource (7 routes)
Route::resource('posts', PostController::class);

// API resource — 5 routes (no create/edit)
Route::apiResource('posts', PostController::class);

// Limit to specific actions
Route::resource('photos', PhotoController::class)
    ->only(['index', 'show']);

Route::apiResource('comments', CommentController::class)
    ->except(['destroy']);

// Nested resource: /posts/{post}/comments/{comment}
Route::resource('posts.comments', CommentController::class)
    ->scoped(['comment' => 'slug']); // scoped binding on nested route

// Register multiple API resources at once
Route::apiResources([
    'photos'   => PhotoController::class,
    'comments' => CommentController::class,
]);`,
        },
        {
          type: "paragraph",
          text: {
            en: "**Route model binding**: when a route parameter name matches a type-hinted model parameter in the controller, Laravel queries the database automatically and injects the model—or returns **404** if not found. Customize the lookup column with `{post:slug}` or by overriding `getRouteKeyName()` on the model.",
            np: "**Route model binding**: parameter र model type-hint मिल्यो भने Laravel आफैं DB query गर्छ; नभेटे 404। `{post:slug}` वा `getRouteKeyName()` ले column बदल्न।",
            jp: "**ルートモデルバインディング**：パラメータ名とコントローラのモデル型ヒントが一致すると自動で DB から取得（なければ 404）。`{post:slug}` でカラム変更も可。",
          },
        },
        {
          type: "code",
          title: {
            en: "Route model binding (implicit)",
            np: "Route model binding",
            jp: "暗黙のルートモデルバインディング",
          },
          code: `// routes/web.php
Route::get('/posts/{post}', [PostController::class, 'show']);
// {post} → Laravel resolves Post::find($post) automatically

// Controller — Post is injected (or 404 thrown)
public function show(Post $post): View
{
    return view('posts.show', compact('post'));
}

// Customize lookup column to 'slug' instead of 'id'
Route::get('/posts/{post:slug}', [PostController::class, 'show']);

// Or override in the model
public function getRouteKeyName(): string
{
    return 'slug';
}

// Nested scoped binding: comment must belong to the post
Route::get('/posts/{post}/comments/{comment}', [CommentController::class, 'show'])
    ->scopeBindings();`,
        },
        {
          type: "paragraph",
          text: {
            en: "**API routes in Laravel 11**: `routes/api.php` is opt-in; enable it by adding `->withRouting(api: __DIR__.'/../routes/api.php')` in `bootstrap/app.php` (or the installer scaffolds this for you). API routes run through the `api` middleware group (stateless — no sessions, no CSRF). Requests are prefixed with `/api` by default.",
            np: "Laravel 11 मा `api.php` opt-in; `bootstrap/app.php` मा `->withRouting(api:...)` थप्नुस्। stateless — session/CSRF छैन। `/api` prefix।",
            jp: "Laravel 11 の API ルートはオプトイン。`bootstrap/app.php` に `->withRouting(api: ...)` を追加（インストーラが自動設定）。`api` ミドルウェアグループ（ステートレス）で `/api` プレフィックス。",
          },
        },
        {
          type: "code",
          title: {
            en: "Debugging routes with Artisan",
            np: "Artisan ले routes debug गर्ने",
            jp: "Artisan でルートをデバッグ",
          },
          code: `# List all routes
php artisan route:list

# Filter by path prefix
php artisan route:list --path=api

# Filter by route name
php artisan route:list --name=posts

# Show middleware applied to each route
php artisan route:list -v`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `web.php` and `api.php`?",
        np: "`web.php` र `api.php` को फरक?",
        jp: "`web.php` と `api.php` の違いは？",
      },
      answer: {
        en: "`web.php` routes run through the `web` middleware group which enables **sessions**, **CSRF protection**, cookie encryption, and the `auth` guard based on sessions. `api.php` routes use the `api` group: **stateless**, no session, no CSRF—authentication is typically via a token (Sanctum, Passport). When `Accept: application/json` is present, validation failures return 422 JSON instead of a redirect.",
        np: "`web.php` — session, CSRF, cookie। `api.php` — stateless, token auth, JSON। `Accept: application/json` भए 422 JSON।",
        jp: "`web.php` はセッション・CSRF・Cookie 付き。`api.php` はステートレスでトークン認証向け。`Accept: application/json` があれば検証失敗は 422 JSON を返します。",
      },
    },
    {
      question: {
        en: "How do resource route names map to controller methods?",
        np: "Resource route names र controller methods कसरी match हुन्छन्?",
        jp: "リソースルート名とコントローラメソッドの対応は？",
      },
      answer: {
        en: "The pattern is `resource.action`. For `Route::resource('posts', PostController::class)`: `posts.index` → `index()`, `posts.create` → `create()`, `posts.store` → `store()`, `posts.show` → `show()`, `posts.edit` → `edit()`, `posts.update` → `update()`, `posts.destroy` → `destroy()`. For nested resources the prefix stacks: `posts.comments.show`.",
        np: "Pattern: `resource.action`. `posts.index` → `index()`, etc. Nested: `posts.comments.show`।",
        jp: "パターンは `resource.action`。`posts.index` → `index()`、`posts.store` → `store()` など。ネストは `posts.comments.show`。",
      },
    },
    {
      question: {
        en: "Can I have multiple route files beyond `web.php` and `api.php`?",
        np: "Multiple route file राख्न सकिन्छ?",
        jp: "`web.php` と `api.php` 以外にルートファイルを追加できる？",
      },
      answer: {
        en: "Yes. In Laravel 11, add additional files in `bootstrap/app.php` inside `->withRouting()` using the `then` callback, e.g. `then: function () { Route::middleware('web')->group(base_path('routes/auth.php')); }`. In Laravel 10 you added them in `RouteServiceProvider::boot()`.",
        np: "हो। Laravel 11 मा `bootstrap/app.php` को `->withRouting(then: ...)` मा थप्न सकिन्छ।",
        jp: "できます。Laravel 11 では `bootstrap/app.php` の `->withRouting(then: ...)` コールバックで追加ファイルをロードします。",
      },
    },
    {
      question: {
        en: "What is route model binding?",
        np: "Route model binding के हो?",
        jp: "ルートモデルバインディングとは？",
      },
      answer: {
        en: "**Implicit binding**: when a route parameter name matches the variable name of a type-hinted Eloquent model in a controller method, Laravel automatically queries `Model::findOrFail($value)` and injects the instance. If no record exists the response is an automatic 404. **Explicit binding**: you manually call `Route::model('user', User::class)` or `Route::bind('user', fn ($value) => ...)` in a service provider for custom resolution logic.",
        np: "Implicit: parameter name र model type-hint मिल्यो भने Laravel auto `findOrFail`; नभेटे 404। Explicit: `Route::model()` वा `Route::bind()`।",
        jp: "暗黙バインド：パラメータ名と型ヒントが一致すると `findOrFail` を自動実行（なければ 404）。明示バインド：`Route::model()` / `Route::bind()` でカスタムロジックを定義。",
      },
    },
    {
      question: {
        en: "How do I limit an `apiResource` to specific methods?",
        np: "`apiResource` लाई specific methods मा limit कसरी गर्ने?",
        jp: "`apiResource` を特定のメソッドに絞るには？",
      },
      answer: {
        en: "Chain `->only([...])` to whitelist specific actions, or `->except([...])` to blacklist. Example: `Route::apiResource('posts', PostController::class)->only(['index', 'show', 'store'])` registers only those three routes. You can verify with `php artisan route:list --name=posts`.",
        np: "`->only(['index','show','store'])` वा `->except(['destroy'])` chain गर्नुस्। `route:list` ले verify।",
        jp: "`->only([...])` で許可するアクションを絞り込み、`->except([...])` で除外できます。`php artisan route:list --name=posts` で確認してください。",
      },
    },
  ],
};
