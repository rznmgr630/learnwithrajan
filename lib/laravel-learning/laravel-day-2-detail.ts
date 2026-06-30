import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Every time a browser visits a URL in your app, Laravel needs to know: which PHP function should handle this request? That is what <b>routing</b> does — it maps a URL (plus an HTTP verb like GET or POST) to a closure or a controller action.\n\n• Route definitions live in `routes/web.php` (browser requests) and `routes/api.php` (API requests)\n• In Laravel 11 both files are registered in `bootstrap/app.php` via `->withRouting()`\n  ↳ The Router reads the incoming URI and verb, finds the matching route definition, runs any middleware attached to it, and calls the handler",
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
            en: "Laravel gives you a static helper for every HTTP verb. You call the helper with the URI and a handler (a closure or a `[Controller::class, 'method']` array):\n• `Route::get` — fetch a resource (read-only)\n• `Route::post` — submit data to create something\n• `Route::put` / `Route::patch` — replace or partially update an existing resource\n• `Route::delete` — remove a resource\n• `Route::any` — accepts every HTTP verb on the same URI\n• `Route::match(['get','post'], ...)` — accepts only the verbs you list",
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
            en: "Sometimes a URL contains a dynamic piece — like a user ID or a post slug. You capture those with <b>route parameters</b>:\n• `{name}` — required. The request will 404 if this segment is missing\n• `{name?}` — optional. You must supply a default value in the closure or controller\n• Add constraints to reject invalid values before they reach your controller — use `->where('id', '[0-9]+')` or the shorthand helpers like `->whereNumber('id')`, `->whereAlpha('slug')`, `->whereAlphaNumeric('code')`\n  ↳ Constraints are checked by the Router, so bad values never even reach your controller",
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
            en: "Hard-coding paths like `/users/42` throughout your codebase is fragile — if the URI ever changes, you have to update it everywhere. <b>Named routes</b> solve this by giving a route a stable name:\n• Add `->name('users.show')` to any route definition\n• Generate the URL anywhere with `route('users.show', ['id' => 42])`\n• If the URI changes later, only the route definition needs updating — every `route()` call stays correct automatically\n  ↳ Convention: use `resource.action` naming, e.g. `users.index`, `users.show`, `users.store`",
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
            en: "When many routes share the same prefix, middleware, or controller, you can stop repeating yourself by wrapping them in a <b>route group</b>. Groups let you set shared attributes once and apply them to every route inside:\n• `->prefix('admin')` — prepends `/admin` to every URI in the group\n• `->name('admin.')` — prepends `admin.` to every route name\n• `->middleware([...])` — applies the same middleware to all routes\n• `->controller(SomeController::class)` — avoids repeating the class on each route\n  ↳ Groups are chainable and nestable — you can put a group inside a group",
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
            en: "Most resources in a web app need the same standard set of operations — list all, show one, show a create form, save, show an edit form, update, delete. Instead of writing all seven routes by hand, `Route::resource()` registers them all in a single line.\n• `Route::resource('posts', PostController::class)` — registers <b>7 routes</b> covering list, create form, save, show, edit form, update, and delete\n• `Route::apiResource('posts', PostController::class)` — registers <b>5 routes</b>, skipping `create` and `edit` (those serve HTML forms, which APIs do not need)\n  ↳ The table below shows every route that gets registered and its controller method name",
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
            en: "<b>Route model binding</b> is a shortcut that saves you from writing `Post::findOrFail($id)` in every controller method. Here is how it works:\n• Name a route parameter the same as the type-hinted model variable in the controller (`{post}` → `Post $post`)\n• Laravel automatically queries the database and injects the model instance\n• If no record is found, Laravel returns a <b>404</b> response automatically — no extra code needed\n• To look up by a column other than `id`, use `{post:slug}` in the route, or override `getRouteKeyName()` on the model",
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
            en: "<b>API routes in Laravel 11</b> — the `routes/api.php` file is opt-in (it does not exist by default). To enable it, add `->withRouting(api: __DIR__.'/../routes/api.php')` inside `bootstrap/app.php`. The Laravel installer can scaffold this for you automatically.\n\nKey differences from `web.php` routes:\n• API routes run through the `api` middleware group — <b>stateless</b>, meaning no sessions and no CSRF tokens\n• All API routes are automatically prefixed with `/api`\n• Authentication is handled via tokens (Sanctum or Passport) instead of sessions",
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
        en: "`web.php` routes run through the `web` middleware group, which enables <b>sessions</b>, <b>CSRF protection</b>, cookie encryption, and session-based authentication. `api.php` routes use the `api` group — <b>stateless</b> with no session or CSRF token. Authentication for API routes is done via tokens (Sanctum, Passport). When a request to an API route has the `Accept: application/json` header, validation failures return a 422 JSON response instead of a redirect.",
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
        en: "The pattern is `resource.action`. For `Route::resource('posts', PostController::class)`: `posts.index` → `index()`, `posts.create` → `create()`, `posts.store` → `store()`, `posts.show` → `show()`, `posts.edit` → `edit()`, `posts.update` → `update()`, `posts.destroy` → `destroy()`. For nested resources the prefix stacks — for example a `posts.comments` resource produces names like `posts.comments.show`.",
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
        en: "Yes. In Laravel 11, add extra route files inside `->withRouting()` in `bootstrap/app.php` using the `then` callback — for example: `then: function () { Route::middleware('web')->group(base_path('routes/auth.php')); }`. In Laravel 10, you added them in `RouteServiceProvider::boot()`.",
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
        en: "<b>Implicit binding</b> — when a route parameter name matches the variable name of a type-hinted Eloquent model in the controller method, Laravel automatically runs `Model::findOrFail($value)` and injects the model. If no record exists the response is an automatic 404. <b>Explicit binding</b> — you manually register custom resolution logic via `Route::model('user', User::class)` or `Route::bind('user', fn ($value) => ...)` in a service provider, for cases where the default lookup is not enough.",
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
        en: "Chain `->only([...])` to allow only specific actions, or `->except([...])` to exclude specific actions. For example: `Route::apiResource('posts', PostController::class)->only(['index', 'show', 'store'])` registers only those three routes. You can verify which routes were registered with `php artisan route:list --name=posts`.",
        np: "`->only(['index','show','store'])` वा `->except(['destroy'])` chain गर्नुस्। `route:list` ले verify।",
        jp: "`->only([...])` で許可するアクションを絞り込み、`->except([...])` で除外できます。`php artisan route:list --name=posts` で確認してください。",
      },
    },
  ],
};
