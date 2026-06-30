import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_15_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "A <b>REST API</b> is how your Laravel backend talks to the outside world — mobile apps, React frontends, third-party services.\n\nThink of it like a restaurant:\n• The <b>client</b> (mobile app, browser) is the customer\n• The <b>API</b> is the menu and the waiter — it defines what you can order and carries requests to the kitchen\n• The <b>server and database</b> are the kitchen — they do the actual work\n\nEvery request uses one of five HTTP verbs:\n• <b>GET</b> — read data (show me the menu)\n• <b>POST</b> — create something new (place an order)\n• <b>PUT / PATCH</b> — update something that exists (change my order)\n• <b>DELETE</b> — remove something (cancel my order)\n\n<b>Why does Sanctum protect the API?</b>\nWithout protection, anyone on the internet could read or delete your data. Sanctum requires every request to carry a token — like showing your membership card at the door. No card, no entry.",
      np: "REST API = backend र client बीचको communication। Sanctum ले token द्वारा सुरक्षित गर्छ। GET/POST/PUT/DELETE verbs।",
      jp: "REST API はバックエンドと外部の通信手段。Sanctum がトークンでリクエストを保護します。",
    },
    {
      en: "In this day we build a complete, working API with authentication and full Posts CRUD:\n\n<b>Auth endpoints (no token needed to call these)</b>\n• `POST /api/register` — create a new account, returns a token\n• `POST /api/login` — log in with email + password, returns a token\n\n<b>Protected endpoints (require `Authorization: Bearer <token>` header)</b>\n• `POST /api/logout` — revoke the current token\n• `GET /api/user` — get the currently logged-in user's profile\n• `GET /api/posts` — list all posts belonging to the logged-in user\n• `POST /api/posts` — create a new post\n• `GET /api/posts/{id}` — get one post by ID\n• `PUT /api/posts/{id}` — update a post\n• `DELETE /api/posts/{id}` — delete a post",
      np: "Auth endpoints (register, login) + protected CRUD endpoints (posts) build गर्छौं।",
      jp: "認証エンドポイント（register・login）と Posts の CRUD を実装します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Sanctum recap & API project setup",
        np: "Sanctum recap र setup",
        jp: "Sanctum の確認とセットアップ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sanctum is already included in Laravel 11 — you don't need to install anything extra for token-based auth. Three things to verify before writing any endpoints:\n\n• <b>`HasApiTokens` trait on your User model</b> — this adds the `createToken()` method\n  ↳ Without this, calling `$user->createToken()` will throw an error\n• <b>`routes/api.php` is registered</b> — in Laravel 11 it's wired up in `bootstrap/app.php` via `->withRouting()`\n  ↳ All routes in this file are automatically prefixed with `/api`\n• <b>`SANCTUM_STATEFUL_DOMAINS`</b> — you only need this for SPA cookie mode (same-domain React/Vue)\n  ↳ For token mode (mobile apps, separate frontends), leave it empty",
            np: "Laravel 11 मा Sanctum built-in। `HasApiTokens`, `api.php`, stateful domains (token mode मा चाहिँदैन)।",
            jp: "Laravel 11 は Sanctum 組み込み済み。`HasApiTokens` の確認と `api.php` の登録を確認。",
          },
        },
        {
          type: "code",
          title: { en: "User model + api.php skeleton", np: "User model र api.php", jp: "User モデルと api.php" },
          code: `// app/Models/User.php
use Laravel\\Sanctum\\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
}

// routes/api.php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\PostController;

// Public routes — no token needed
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected routes — require a valid Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout',      [AuthController::class, 'logout']);
    Route::get('/user',         [AuthController::class, 'me']);
    Route::apiResource('posts', PostController::class);
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>api.php vs web.php — what is the difference?</b>\n\n• <b>`routes/api.php`</b> — for stateless API requests\n  ↳ No session, no CSRF token required\n  ↳ Routes are automatically prefixed with `/api` (so `Route::get('/posts')` becomes `/api/posts`)\n  ↳ Authentication is done via the `Authorization: Bearer <token>` header\n• <b>`routes/web.php`</b> — for browser-based pages\n  ↳ Uses session cookies to remember who is logged in\n  ↳ Requires a CSRF token on every POST/PUT/DELETE form submission\n  ↳ No automatic prefix",
            np: "`api.php` — stateless, `/api` prefix, no CSRF। `web.php` — session, CSRF, browser।",
            jp: "`api.php` はステートレスで `/api` プレフィックス付き。`web.php` はセッションと CSRF が必要。",
          },
        },
        {
          type: "table",
          caption: {
            en: "All endpoints we will build — method, path, auth required, and what it does",
            np: "सबै endpoints — method, path, auth, विवरण",
            jp: "全エンドポイント一覧",
          },
          headers: [
            { en: "Method", np: "Method", jp: "メソッド" },
            { en: "Endpoint", np: "Endpoint", jp: "エンドポイント" },
            { en: "Auth?", np: "Auth?", jp: "認証?" },
            { en: "Description", np: "विवरण", jp: "説明" },
          ],
          rows: [
            [
              { en: "POST", np: "POST", jp: "POST" },
              { en: "`/api/register`", np: "`/api/register`", jp: "`/api/register`" },
              { en: "No", np: "छैन", jp: "不要" },
              { en: "Create account, returns token", np: "नयाँ account, token फर्काउँछ", jp: "アカウント作成・トークン返却" },
            ],
            [
              { en: "POST", np: "POST", jp: "POST" },
              { en: "`/api/login`", np: "`/api/login`", jp: "`/api/login`" },
              { en: "No", np: "छैन", jp: "不要" },
              { en: "Login, returns token", np: "Login, token फर्काउँछ", jp: "ログイン・トークン返却" },
            ],
            [
              { en: "POST", np: "POST", jp: "POST" },
              { en: "`/api/logout`", np: "`/api/logout`", jp: "`/api/logout`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Revoke current token", np: "Token मेट्छ", jp: "トークン削除" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/api/user`", np: "`/api/user`", jp: "`/api/user`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Get logged-in user profile", np: "User profile", jp: "ログインユーザー取得" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/api/posts`", np: "`/api/posts`", jp: "`/api/posts`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "List all posts (current user only)", np: "Posts list", jp: "投稿一覧（自分のみ）" },
            ],
            [
              { en: "POST", np: "POST", jp: "POST" },
              { en: "`/api/posts`", np: "`/api/posts`", jp: "`/api/posts`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Create a new post", np: "Post बनाउने", jp: "投稿作成" },
            ],
            [
              { en: "GET", np: "GET", jp: "GET" },
              { en: "`/api/posts/{id}`", np: "`/api/posts/{id}`", jp: "`/api/posts/{id}`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Get one post by ID", np: "एउटा post", jp: "投稿の詳細取得" },
            ],
            [
              { en: "PUT", np: "PUT", jp: "PUT" },
              { en: "`/api/posts/{id}`", np: "`/api/posts/{id}`", jp: "`/api/posts/{id}`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Update a post", np: "Post update", jp: "投稿の更新" },
            ],
            [
              { en: "DELETE", np: "DELETE", jp: "DELETE" },
              { en: "`/api/posts/{id}`", np: "`/api/posts/{id}`", jp: "`/api/posts/{id}`" },
              { en: "Yes", np: "हो", jp: "必要" },
              { en: "Delete a post", np: "Post मेट्ने", jp: "投稿の削除" },
            ],
          ],
        },
      ],
    },
    {
      title: {
        en: "Auth endpoints — register, login, logout & /me",
        np: "Auth endpoints — register, login, logout, /me",
        jp: "認証エンドポイント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Think of API authentication like a gym membership:\n• <b>Register</b> — sign up at the front desk, get a membership card (token)\n• <b>Login</b> — show your ID at the desk, get a new card if you lost the last one\n• <b>Use the card</b> — swipe it at the door every time you enter (send the token with every request)\n• <b>Logout</b> — hand the card back in, it gets shredded (token is deleted from the database)\n\nThe token is just a long random string. The client (mobile app, browser) stores it and sends it in the `Authorization` header on every protected request:\n`Authorization: Bearer 1|abc123xyz...`",
            np: "Token auth = gym membership analogy। Register → token मिल्छ। प्रत्येक request मा Bearer header।",
            jp: "ジム会員証の比喩で認証を説明。登録→トークン取得→毎回 Bearer ヘッダーで送信→ログアウトで削除。",
          },
        },
        {
          type: "code",
          title: { en: "AuthController — register, login, logout, me", np: "AuthController", jp: "AuthController" },
          code: `<?php
// app/Http/Controllers/Api/AuthController.php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\User;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\Hash;

class AuthController extends Controller
{
    public function register(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ]);

        $user  = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $data = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Delete old tokens so only one active session exists (optional)
        $user->tokens()->delete();

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        // Delete only the token used for this request
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>What is `plainTextToken` and why does it matter?</b>\n\n`createToken()` returns a `NewAccessToken` object. It has two parts:\n• <b>`plainTextToken`</b> — the raw string you return to the client. Looks like `1|abc123xyz...`\n  ↳ This is the only time you can read it — Laravel hashes it immediately after creation\n  ↳ <b>Never log this value</b> — if it leaks, anyone with it can act as that user\n• <b>The token record</b> — stored in the `personal_access_tokens` table as a hash (like a hashed password)\n  ↳ Even if someone reads your database, they cannot recover the original token\n\nThe client should store `plainTextToken` securely — in iOS Keychain, Android Keystore, or an HttpOnly cookie in a browser.",
            np: "`plainTextToken` एक पटक मात्र पढ्न मिल्छ। Database मा hash हुन्छ। Log नगर्नुस्।",
            jp: "`plainTextToken` は一度だけ取得可能。DB にはハッシュで保存。絶対にログに残さないこと。",
          },
        },
        {
          type: "code",
          title: { en: "Auth routes in routes/api.php", np: "Auth routes", jp: "認証ルート" },
          code: `// routes/api.php
use App\\Http\\Controllers\\Api\\AuthController;

// No token required
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Token required
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);
});`,
        },
      ],
    },
    {
      title: {
        en: "Posts CRUD endpoints",
        np: "Posts CRUD endpoints",
        jp: "Posts の CRUD エンドポイント",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "REST APIs follow a naming convention that maps HTTP verbs to actions. Instead of writing 5 routes by hand, Laravel's `Route::apiResource()` registers all of them in one line:\n\n• `GET /api/posts` → `index()` — list resources\n• `POST /api/posts` → `store()` — create a resource\n• `GET /api/posts/{id}` → `show()` — get one resource\n• `PUT /api/posts/{id}` → `update()` — replace/update a resource\n• `DELETE /api/posts/{id}` → `destroy()` — delete a resource\n\n`apiResource()` skips `create()` and `edit()` (which serve HTML forms — APIs don't need them).",
            np: "`Route::apiResource()` ले 5 routes एकैपटक register गर्छ।",
            jp: "`Route::apiResource()` で 5 つのルートを一括登録。HTML フォーム用の `create`/`edit` は除外。",
          },
        },
        {
          type: "code",
          title: { en: "Post model & migration", np: "Post model र migration", jp: "Post モデルとマイグレーション" },
          code: `// database/migrations/xxxx_create_posts_table.php
Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title');
    $table->text('body');
    $table->timestamp('published_at')->nullable();
    $table->timestamps();
});

// app/Models/Post.php
class Post extends Model
{
    protected $fillable = ['user_id', 'title', 'body', 'published_at'];

    protected $casts = [
        'published_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
        },
        {
          type: "code",
          title: { en: "PostController — full CRUD", np: "PostController", jp: "PostController（CRUD 全メソッド）" },
          code: `<?php
// app/Http/Controllers/Api/PostController.php
namespace App\\Http\\Controllers\\Api;

use App\\Http\\Controllers\\Controller;
use App\\Models\\Post;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class PostController extends Controller
{
    // GET /api/posts — list posts belonging to the logged-in user
    public function index(Request $request): JsonResponse
    {
        $posts = Post::where('user_id', $request->user()->id)
                     ->latest()
                     ->get();

        return response()->json($posts);
    }

    // POST /api/posts — create a new post
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title'        => ['required', 'string', 'max:255'],
            'body'         => ['required', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $post = Post::create([
            'user_id'      => $request->user()->id,
            'title'        => $data['title'],
            'body'         => $data['body'],
            'published_at' => $data['published_at'] ?? null,
        ]);

        return response()->json($post, 201);
    }

    // GET /api/posts/{post} — get one post
    public function show(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($post);
    }

    // PUT /api/posts/{post} — update a post
    public function update(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'title'        => ['sometimes', 'string', 'max:255'],
            'body'         => ['sometimes', 'string'],
            'published_at' => ['nullable', 'date'],
        ]);

        $post->update($data);

        return response()->json($post);
    }

    // DELETE /api/posts/{post} — delete a post
    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $post->delete();

        return response()->json(null, 204);
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Why check ownership on every method?</b>\n\nThe `auth:sanctum` middleware only proves that the request has a valid token — it confirms the user is logged in. It does <b>not</b> check whether they own the specific post being accessed.\n\nWithout the ownership check:\n• User A logs in and gets a token\n• User A sends `DELETE /api/posts/99` where post 99 belongs to User B\n• The request passes `auth:sanctum` because User A has a valid token\n• Without the check, User A deletes User B's post\n\nAlways verify `$post->user_id === $request->user()->id` before reading, updating, or deleting. This is called an <b>object-level authorization check</b> (OWASP calls missing it the #1 API security vulnerability).",
            np: "`auth:sanctum` = logged in मात्र। Ownership check = आफ्नै post मात्र access।",
            jp: "`auth:sanctum` はログイン確認のみ。所有権チェックがないと他のユーザーのデータを操作できてしまう。",
          },
        },
        {
          type: "code",
          title: { en: "Complete routes/api.php", np: "पूरा api.php", jp: "api.php の完成版" },
          code: `// routes/api.php
use Illuminate\\Support\\Facades\\Route;
use App\\Http\\Controllers\\Api\\AuthController;
use App\\Http\\Controllers\\Api\\PostController;

// Public — no token
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Protected — requires valid Sanctum token
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user',    [AuthController::class, 'me']);

    // Registers: GET /posts, POST /posts,
    //            GET /posts/{post}, PUT /posts/{post}, DELETE /posts/{post}
    Route::apiResource('posts', PostController::class);
});`,
        },
      ],
    },
    {
      title: {
        en: "Token abilities & scopes",
        np: "Token abilities र scopes",
        jp: "トークンのアビリティとスコープ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Token abilities are like access levels on a keycard system:\n• A cleaner's keycard opens the office door but not the server room\n• A manager's keycard opens everything\n\nIn Sanctum, you define abilities when creating a token, then check them before sensitive actions. This lets you issue different tokens for different purposes:\n• A <b>read-only API key</b> for a dashboard that should only view data\n• A <b>full-access token</b> for a mobile app that can create and delete\n\nAbilities are stored in the `personal_access_tokens` table alongside the token.",
            np: "Abilities = keycard access level। Read-only token vs full-access token।",
            jp: "アビリティはキーカードのアクセスレベルのようなもの。読み取り専用と全権トークンを使い分けられる。",
          },
        },
        {
          type: "code",
          title: { en: "Creating tokens with abilities & checking them", np: "Abilities सहित token", jp: "アビリティ付きトークンの作成と確認" },
          code: `// 1. Issue a token with specific abilities on login
$token = $user->createToken('mobile-app', ['posts:read', 'posts:write'])
               ->plainTextToken;

// 2. Issue a read-only token (e.g. for a dashboard integration)
$readOnlyToken = $user->createToken('dashboard', ['posts:read'])
                      ->plainTextToken;

// 3. Check abilities inside a controller
public function store(Request $request): JsonResponse
{
    if (! $request->user()->tokenCan('posts:write')) {
        return response()->json(['message' => 'This token cannot create posts'], 403);
    }

    // ... create post
}

// 4. Check in a route definition using middleware
Route::middleware(['auth:sanctum', 'abilities:posts:write'])
    ->post('/posts', [PostController::class, 'store']);

// 5. Check for any of multiple abilities
Route::middleware(['auth:sanctum', 'ability:posts:read,posts:write'])
    ->get('/posts', [PostController::class, 'index']);`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Abilities vs Policies — when to use which?</b>\n\n• <b>Token abilities</b> answer: what is this token allowed to do?\n  ↳ Use for different client types — a read-only dashboard token vs a full mobile app token\n  ↳ Checked with `tokenCan('ability')`\n• <b>Policies</b> answer: can this user perform this action on this specific resource?\n  ↳ Use for per-record ownership — can User A edit Post 42?\n  ↳ Checked with `Gate::authorize()` or `$this->authorize()`\n\nIn a real app you use both together: the token ability checks what the client can do, the policy checks what the user owns.",
            np: "Abilities = client type। Policies = resource ownership। दुवै सँगै प्रयोग।",
            jp: "アビリティはクライアントの種類に、Policy はリソースの所有権に使う。実際のアプリでは両方を組み合わせる。",
          },
        },
      ],
    },
    {
      title: {
        en: "Consistent JSON responses & error handling",
        np: "Consistent JSON responses र error handling",
        jp: "一貫した JSON レスポンスとエラー処理",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Imagine every API endpoint returns a different shape:\n• `/api/posts` returns `[{...}, {...}]` (bare array)\n• `/api/login` returns `{token: '...', user: {...}}`\n• `/api/store` returns `{data: {...}, success: true}`\n\nEvery client developer has to learn a different structure for every endpoint — that is a maintenance nightmare.\n\nA <b>consistent response shape</b> means every success response looks the same and every error response looks the same. Clients can write one piece of parsing code and it works everywhere.",
            np: "Consistent shape = clients को लागि predictable। सबै response एउटै structure।",
            jp: "一貫したレスポンス形式により、クライアントは1つのパース処理で全エンドポイントに対応できる。",
          },
        },
        {
          type: "code",
          title: { en: "ApiResponse helper trait", np: "ApiResponse trait", jp: "ApiResponse ヘルパー" },
          code: `<?php
// app/Http/Controllers/Api/Concerns/ApiResponse.php
namespace App\\Http\\Controllers\\Api\\Concerns;

use Illuminate\\Http\\JsonResponse;

trait ApiResponse
{
    protected function success(mixed $data, int $status = 200, string $message = ''): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data'    => $data,
        ], $status);
    }

    protected function error(string $message, int $status = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors'  => $errors,
        ], $status);
    }
}

// Using it in PostController
class PostController extends Controller
{
    use ApiResponse;

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([...]);
        $post = Post::create([...]);

        return $this->success($post, 201, 'Post created');
    }

    public function destroy(Request $request, Post $post): JsonResponse
    {
        if ($post->user_id !== $request->user()->id) {
            return $this->error('You do not own this post', 403);
        }

        $post->delete();
        return response()->json(null, 204);
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>HTTP status codes every API developer needs to know</b>\n\n• <b>200 OK</b> — request succeeded (GET, PUT responses)\n• <b>201 Created</b> — a new resource was created (POST responses)\n• <b>204 No Content</b> — succeeded but nothing to return (DELETE responses)\n• <b>400 Bad Request</b> — the client sent something malformed\n• <b>401 Unauthorized</b> — no token, expired token, or invalid token\n  ↳ Laravel's `auth:sanctum` returns this automatically for missing/invalid tokens\n• <b>403 Forbidden</b> — authenticated but not allowed (valid token, wrong owner)\n• <b>404 Not Found</b> — the resource doesn't exist\n• <b>422 Unprocessable Entity</b> — validation failed\n  ↳ Laravel's `$request->validate()` returns this automatically with a JSON errors object",
            np: "200, 201, 204, 400, 401, 403, 404, 422 — सबै REST status codes।",
            jp: "主要 HTTP ステータスコード一覧。401 は Sanctum が自動返却、422 は validate() が自動返却。",
          },
        },
        {
          type: "code",
          title: { en: "Return JSON on unauthenticated API requests (Laravel 11)", np: "401 JSON response", jp: "未認証時の JSON レスポンス設定" },
          code: `// bootstrap/app.php
// By default, unauthenticated requests get redirected to /login (HTML page).
// For API routes, we want a JSON 401 response instead.

use Illuminate\\Auth\\AuthenticationException;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->render(function (AuthenticationException $e, Request $request) {
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated. Please provide a valid token.',
            ], 401);
        }
    });
})`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I test these endpoints in Postman or Insomnia?",
        np: "Postman वा Insomnia मा endpoints कसरी test गर्ने?",
        jp: "Postman や Insomnia でエンドポイントをテストする方法は？",
      },
      answer: {
        en: "Step-by-step:\n\n• <b>Step 1 — Register or Login</b>\n  ↳ Send `POST http://localhost:8000/api/login` with a JSON body: `{\"email\": \"you@example.com\", \"password\": \"yourpassword\"}`\n  ↳ Copy the `token` value from the response\n\n• <b>Step 2 — Add the token to your request</b>\n  ↳ In Postman: open the request → Authorization tab → Type: Bearer Token → paste the token\n  ↳ In Insomnia: Header tab → add `Authorization` → value: `Bearer <paste token here>`\n\n• <b>Step 3 — Make protected requests</b>\n  ↳ The token is now sent automatically on every request from that collection\n  ↳ Try `GET /api/posts` — you should see your posts list\n\n• <b>Tip</b>: in Postman you can save the token as an environment variable and reference it as `{{token}}` in all requests — saves re-pasting every time.",
        np: "Login → token copy → Authorization: Bearer header। Postman environment variable सुझाव।",
        jp: "ログインでトークン取得 → Authorization: Bearer で設定 → 保護されたルートへリクエスト。",
      },
    },
    {
      question: {
        en: "What is the difference between 401 and 403?",
        np: "401 र 403 मा के फरक छ?",
        jp: "401 と 403 の違いは何ですか？",
      },
      answer: {
        en: "Think of a concert venue:\n\n• <b>401 Unauthorized</b> — you didn't show a ticket at all\n  ↳ The API doesn't know who you are — no token, wrong token, or expired token\n  ↳ Laravel's `auth:sanctum` middleware returns this automatically\n  ↳ The fix: log in and get a fresh token\n\n• <b>403 Forbidden</b> — you showed a valid ticket, but it's for the wrong section\n  ↳ The API knows exactly who you are, but you're not allowed to do this specific thing\n  ↳ Example: you're authenticated but you're trying to delete someone else's post\n  ↳ The fix: you either need more permissions, or you're trying to access something you don't own\n\nRule of thumb: 401 means 'prove who you are first'. 403 means 'I know who you are, but no'.",
        np: "401 = token छैन। 403 = token छ तर permission छैन।",
        jp: "401 は未認証（トークンなし・無効）。403 は認証済みだが権限なし（他人のリソースへのアクセスなど）。",
      },
    },
    {
      question: {
        en: "Should I use Route::apiResource() or write routes manually?",
        np: "`apiResource()` वा manual routes?",
        jp: "`Route::apiResource()` と手動ルートどちらを使うべきですか？",
      },
      answer: {
        en: "Use `Route::apiResource()` by default — it registers all 5 standard CRUD routes in one line and follows the REST naming convention automatically.\n\nWrite routes manually when:\n• You need a <b>custom action</b> that isn't one of the 5 standard ones\n  ↳ Example: `POST /api/posts/{post}/publish` — there's no `publish` verb in apiResource\n• You only want a <b>subset of the 5 routes</b>\n  ↳ `Route::apiResource('posts', PostController::class)->only(['index', 'store'])` (read + create only)\n  ↳ `Route::apiResource('posts', PostController::class)->except(['destroy'])` (everything except delete)\n• You need a <b>different URL structure</b> that doesn't match the REST convention",
        np: "`apiResource()` = 5 routes एकैपटक। Custom action को लागि manual।",
        jp: "標準 CRUD は `apiResource()` を使用。カスタムアクションやルートの一部のみ必要な場合は手動で記述。",
      },
    },
    {
      question: {
        en: "How do I revoke all tokens when a user changes their password?",
        np: "Password change हुँदा सबै tokens कसरी revoke गर्ने?",
        jp: "パスワード変更時に全トークンを無効化するには？",
      },
      answer: {
        en: "Call `$user->tokens()->delete()` inside your password update handler. This deletes every token in the `personal_access_tokens` table for that user — they will need to log in again on all devices.\n\nWhere to put it:\n• In your `ProfileController::updatePassword()` method, after calling `$user->update(['password' => Hash::make($new)])`\n• Also useful after a password reset flow\n\nIf you want <b>granular expiry</b> rather than full revocation, Sanctum supports `tokenExpiredAt`:\n`$user->createToken('app', ['*'], now()->addDays(30))` — the token automatically becomes invalid after 30 days.\n\nYou can also set a global expiry in `config/sanctum.php` via the `expiration` key (minutes).",
        np: "`$user->tokens()->delete()` ले सबै tokens delete। `tokenExpiredAt` ले expiry set गर्न सकिन्छ।",
        jp: "`$user->tokens()->delete()` で全トークン削除。期限付きは `tokenExpiredAt` または `config/sanctum.php` の `expiration` を使用。",
      },
    },
    {
      question: {
        en: "Can I use Sanctum with React or Vue on a different domain?",
        np: "अलग domain मा React/Vue सँग Sanctum प्रयोग गर्न मिल्छ?",
        jp: "別ドメインの React/Vue と Sanctum を使えますか？",
      },
      answer: {
        en: "Yes — but the approach depends on whether your frontend and API share the same domain.\n\n• <b>Same domain</b> (e.g., both on `myapp.com`): use <b>SPA cookie mode</b>\n  ↳ The frontend gets a session cookie automatically, no token to manage\n  ↳ Set `SANCTUM_STATEFUL_DOMAINS=myapp.com` in `.env`\n\n• <b>Different domain</b> (e.g., React on `localhost:3000`, Laravel on `localhost:8000`):\n  ↳ Use <b>API token mode</b> — login returns a token, send it as `Authorization: Bearer <token>`\n  ↳ You also need to configure CORS so browsers allow the cross-origin request\n  ↳ Edit `config/cors.php`: set `'allowed_origins' => ['http://localhost:3000']` and `'supports_credentials' => true`\n  ↳ Add `'Access-Control-Allow-Origin'` to `'exposed_headers'`",
        np: "Same domain = SPA cookie mode। Different domain = token mode + CORS configure।",
        jp: "同一ドメインは SPA クッキーモード、別ドメインは API トークンモード + `config/cors.php` の設定が必要。",
      },
    },
    {
      question: {
        en: "How do I return paginated results from my API?",
        np: "API बाट paginated results कसरी फर्काउने?",
        jp: "API でページネーション付きの結果を返すには？",
      },
      answer: {
        en: "Replace `->get()` with `->paginate(15)`. Laravel automatically returns a JSON object with everything your client needs:\n\n• `data` — the array of records for this page\n• `current_page` — which page you're on\n• `last_page` — total number of pages\n• `per_page` — how many records per page\n• `total` — total number of records across all pages\n• `next_page_url` / `prev_page_url` — ready-to-use links for the next and previous pages\n\nThe client requests a specific page by adding `?page=2` to the URL: `GET /api/posts?page=2`.\n\nIf you want to control the page size from the request: `->paginate($request->integer('per_page', 15))` — defaults to 15 but lets the client override it.",
        np: "`->paginate(15)` = automatic pagination JSON। `?page=2` ले page navigate।",
        jp: "`->paginate(15)` で自動的に `data`・`current_page`・`total` 等を含む JSON を返す。`?page=2` でページ指定。",
      },
    },
  ],
};
