import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_12_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "These are two different questions every app needs to answer:\n\n<b>Authentication = who are you?</b>\n• Are you logged in? Who is this user?\n  ↳ Covered in Day 11 — sessions, tokens, Breeze\n\n<b>Authorization = what can you do?</b>\n• Can this logged-in user edit this post? Delete someone else's account?\n  ↳ That's what Day 12 covers — Gates and Policies\n\n<b>API Resources</b> — a separate but related topic: they control exactly what your JSON responses look like, so you don't accidentally expose sensitive model fields to API consumers.",
      np: "Auth = who. Authz = what. Gate र Policy authz को लागि। API Resource = clean JSON।",
      jp: "認証は「誰か」、認可は「何ができるか」。Gate はシンプルなクロージャ、Policy はモデル単位のクラス。API Resource で JSON を整形。",
    },
  ],
  sections: [
    {
      title: {
        en: "Gates — simple closure-based authorization",
        np: "Gate — closure-based authorization",
        jp: "Gate — クロージャベースの認可",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A <b>Gate</b> is the simplest form of authorization — just a closure that returns `true` (allowed) or `false` (denied).\n\nThink of it like a bouncer at a door: you describe the rule once ('only admins and editors can enter'), then check it anywhere in your app.\n\n• Gates are defined in a service provider, usually inside `AppServiceProvider::boot()`\n• The first argument is always the authenticated user — Laravel injects it automatically\n• You can pass extra arguments (like a model) as additional parameters\n• Use Gates for one-off actions that don't belong to a specific model\n  ↳ Example: 'can this user view the analytics dashboard?' — not tied to any single record",
            np: "Gate ले simple closure मा authorization। `AppServiceProvider::boot()` मा define।",
            jp: "Gate はクロージャで認可ルールを定義。`AppServiceProvider::boot()` に記述するのが一般的。",
          },
        },
        {
          type: "code",
          title: { en: "Defining and checking Gates", np: "Gate define र check", jp: "Gate の定義と確認" },
          code: `// app/Providers/AppServiceProvider.php
use Illuminate\\Support\\Facades\\Gate;
use App\\Models\\{Post, User};

public function boot(): void
{
    // Simple gate — no model
    Gate::define('view-reports', function (User $user): bool {
        return in_array($user->role, ['admin', 'editor']);
    });

    // Gate with a model argument
    Gate::define('update-post', function (User $user, Post $post): bool {
        return $user->id === $post->user_id;
    });

    // Gate with before hook (super-admin bypass)
    Gate::before(function (User $user, string $ability): ?bool {
        if ($user->isSuperAdmin()) {
            return true; // short-circuit all checks
        }
        return null;     // defer to normal gates
    });
}`,
        },
        {
          type: "code",
          title: { en: "Checking Gates in controllers & Blade", np: "Check गर्ने तरिका", jp: "Gate のチェック方法" },
          code: `// In a controller
use Illuminate\\Support\\Facades\\Gate;

// Returns bool — use for conditional logic
if (Gate::allows('update-post', $post)) {
    // authorized
}

if (Gate::denies('update-post', $post)) {
    abort(403);
}

// Throws HttpException 403 automatically
Gate::authorize('update-post', $post);

// Via the request user (equivalent to Gate::allows)
if ($request->user()->can('update-post', $post)) {
    // authorized
}

// In Blade
@can('update-post', $post)
    <button>Edit</button>
@elsecan('delete-post', $post)
    <button>Delete</button>
@endcan

@cannot('view-reports')
    <p>Access denied.</p>
@endcannot`,
        },
      ],
    },
    {
      title: {
        en: "Policies — model-bound authorization",
        np: "Policy — model-bound authorization",
        jp: "Policy — モデルに紐づく認可",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "When you have many rules that all relate to one model — 'who can view a Post, create a Post, update a Post, delete a Post?' — putting them all in individual Gates gets messy fast. That's what <b>Policies</b> are for.\n\nA Policy is a PHP class where each method is one authorization rule for that model:\n• `viewAny` — can the user see the list?\n• `view` — can the user see this specific record?\n• `create` — can the user create a new one?\n• `update` — can the user edit this record?\n• `delete` — can the user delete this record?\n\nLaravel auto-discovers policies using naming convention: `Post` model → `PostPolicy` class. No manual registration needed.",
            np: "Policy ले model को सबै authorization logic एकठाउँ। `make:policy` ले generate।",
            jp: "Policy は 1 モデルの認可ロジックをクラスにまとめたもの。命名規則で自動検出される。",
          },
        },
        {
          type: "code",
          title: { en: "Generate & implement a Policy", np: "Policy generate", jp: "Policy の生成と実装" },
          code: `php artisan make:policy PostPolicy --model=Post`,
        },
        {
          type: "code",
          title: { en: "PostPolicy class", np: "Policy class", jp: "Policy クラス" },
          code: `// app/Policies/PostPolicy.php
namespace App\\Policies;

use App\\Models\\{Post, User};
use Illuminate\\Auth\\Access\\HandlesAuthorization;

class PostPolicy
{
    use HandlesAuthorization;

    /** Any user can list posts */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /** Any authenticated user can view a published post */
    public function view(User $user, Post $post): bool
    {
        return $post->published || $user->id === $post->user_id;
    }

    /** Any authenticated user can create */
    public function create(User $user): bool
    {
        return true;
    }

    /** Only the owner can update */
    public function update(User $user, Post $post): bool
    {
        return $user->id === $post->user_id;
    }

    /** Only the owner or an admin can delete */
    public function delete(User $user, Post $post): bool
    {
        return $user->id === $post->user_id || $user->role === 'admin';
    }

    public function restore(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }

    public function forceDelete(User $user, Post $post): bool
    {
        return $user->role === 'admin';
    }
}`,
        },
        {
          type: "code",
          title: { en: "Using policies in controllers & Blade", np: "Controller र Blade मा", jp: "コントローラと Blade での使用" },
          code: `// Controller — throws 403 if policy denies
class PostController extends Controller
{
    public function update(Request $request, Post $post): RedirectResponse
    {
        $this->authorize('update', $post); // uses PostPolicy::update

        $post->update($request->validated());
        return redirect()->route('posts.show', $post);
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Post::class); // no model instance needed
        // ...
    }
}

// Route-model binding with middleware approach
Route::put('/posts/{post}', [PostController::class, 'update'])
    ->middleware('can:update,post'); // auto-resolves policy

// Blade directives
@can('update', $post)
    <a href="{{ route('posts.edit', $post) }}">Edit</a>
@endcan

@can('delete', $post)
    <form method="POST" action="{{ route('posts.destroy', $post) }}">
        @csrf @method('DELETE')
        <button>Delete</button>
    </form>
@endcan`,
        },
        {
          type: "paragraph",
          text: {
            en: "Need to manage roles and permissions from a database — so you can assign or revoke them at runtime without deploying code? The <b>Spatie Laravel Permission</b> package is the standard choice. It adds `assignRole()`, `hasRole()`, `givePermissionTo()`, and `can()` methods backed by database tables.",
            np: "Roles/permissions को लागि Spatie package। DB मा store।",
            jp: "大規模な RBAC には Spatie Laravel Permission パッケージが便利。DB ベースで権限を管理。",
          },
        },
      ],
    },
    {
      title: {
        en: "API Resources — transform Eloquent to JSON",
        np: "API Resource — Eloquent लाई JSON बनाउने",
        jp: "API Resource — Eloquent を JSON に変換",
      },
      blocks: [
        {
          type: "diagram",
          id: "laravel-api-resource",
        },
        {
          type: "paragraph",
          text: {
            en: "When you return an Eloquent model directly from a controller, every column in the database gets sent to the client — including things like `password`, `remember_token`, or internal timestamps you'd rather keep private.\n\n<b>API Resources</b> sit between your models and your JSON responses. They are a transformation layer where you decide exactly:\n• Which fields to include (and which to hide)\n• How to rename or reformat fields\n• Which relationships to include (and only if they're already loaded, to avoid N+1 queries)\n• Which fields to show only to certain users (like admins)\n\nThis keeps your API clean, consistent, and safe — your internal database structure stays private.",
            np: "API Resource ले model र JSON बीच layer। `toArray()` मा field control।",
            jp: "API Resource は Eloquent とレスポンスの間の変換レイヤー。公開フィールドを完全にコントロール。",
          },
        },
        {
          type: "code",
          title: { en: "Generate and implement a Resource", np: "Resource generate", jp: "Resource の生成と実装" },
          code: `php artisan make:resource PostResource
php artisan make:resource PostCollection  # or use ::collection()`,
        },
        {
          type: "code",
          title: { en: "PostResource class", np: "PostResource", jp: "PostResource クラス" },
          code: `// app/Http/Resources/PostResource.php
namespace App\\Http\\Resources;

use Illuminate\\Http\\Request;
use Illuminate\\Http\\Resources\\Json\\JsonResource;

class PostResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'         => $this->id,
            'title'      => $this->title,
            'slug'       => $this->slug,
            'body'       => $this->body,
            'published'  => $this->published_at?->toIso8601String(),
            'author'     => [
                'id'   => $this->user->id,
                'name' => $this->user->name,
            ],

            // Only include 'views' for admin users
            'views' => $this->when(
                $request->user()?->role === 'admin',
                $this->view_count
            ),

            // Only include 'comments' if already eager-loaded (avoids N+1)
            'comments' => CommentResource::collection(
                $this->whenLoaded('comments')
            ),

            // Merge additional fields conditionally
            $this->mergeWhen($this->trashed(), [
                'deleted_at' => $this->deleted_at,
            ]),

            'created_at' => $this->created_at->toIso8601String(),
        ];
    }
}`,
        },
        {
          type: "code",
          title: { en: "Returning Resources from controllers", np: "Controller मा return", jp: "コントローラで Resource を返す" },
          code: `use App\\Http\\Resources\\PostResource;
use App\\Models\\Post;

class PostController extends Controller
{
    // Single resource
    public function show(Post $post): PostResource
    {
        $post->load('comments', 'user');
        return new PostResource($post);
    }

    // Collection (adds 'data' wrapper automatically)
    public function index(): AnonymousResourceCollection
    {
        $posts = Post::with('user')->latest()->paginate(15);
        return PostResource::collection($posts);
        // Pagination metadata is included automatically
    }
}

// JSON response for single resource:
// { "data": { "id": 1, "title": "...", ... } }

// JSON response for collection with pagination:
// {
//   "data": [ {...}, {...} ],
//   "links": { "first": "...", "next": "...", ... },
//   "meta": { "current_page": 1, "total": 42, ... }
// }`,
        },
        {
          type: "paragraph",
          text: {
            en: "For <b>API versioning</b>, group your routes under a version prefix and keep controllers in versioned namespaces.\n\n• Routes go in: `routes/api/v1.php`\n• Controllers live in: `App\\Http\\Controllers\\Api\\V1\\`\n• You can use different Resource classes per version if the response shape changes between versions\n\nThis way, old API clients keep working on `v1` while new clients use `v2`.",
            np: "API versioning: `v1` prefix र versioned namespace।",
            jp: "API バージョニングは `v1` プレフィックスと名前空間で管理。バージョンごとに Resource クラスを切り替えることもできます。",
          },
        },
        {
          type: "code",
          title: { en: "API versioning route setup", np: "API versioning", jp: "API バージョン設定" },
          code: `// routes/api.php
use App\\Http\\Controllers\\Api\\V1\\PostController as V1PostController;
use App\\Http\\Controllers\\Api\\V2\\PostController as V2PostController;

Route::prefix('v1')->group(function () {
    Route::apiResource('posts', V1PostController::class);
});

Route::prefix('v2')->group(function () {
    Route::apiResource('posts', V2PostController::class);
});`,
        },
      ],
    },
    {
      title: {
        en: "Sanctum API tokens in practice",
        np: "Sanctum API token व्यवहारमा",
        jp: "Sanctum API トークンの実践",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Here's the full flow of a typical token-authenticated API:\n\n• Client sends `POST /api/login` with email and password\n• Laravel verifies credentials, issues a token, returns it in the response\n• Client stores the token and sends it as `Authorization: Bearer <token>` on every subsequent request\n• API controllers return <b>API Resources</b> so responses are clean and consistent\n\nIf the API will be called from a web browser on a different domain, you also need to configure CORS to allow that domain.",
            np: "Login → token → Bearer header → API Resource response। Browser को लागि CORS।",
            jp: "ログイン → トークン取得 → Bearer ヘッダーで送信 → API Resource で応答。ブラウザは CORS 設定が必要。",
          },
        },
        {
          type: "code",
          title: { en: "Full Sanctum API auth flow", np: "Sanctum flow", jp: "Sanctum 認証フロー" },
          code: `// routes/api.php
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', fn (Request $request) => new UserResource($request->user()));
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::apiResource('posts', PostController::class);
});

// app/Http/Controllers/Api/AuthController.php
class AuthController extends Controller
{
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (! Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'user'  => new UserResource($user),
            'token' => $token,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}

// config/cors.php — allow your SPA origin
'allowed_origins' => ['https://app.example.com'],
'supports_credentials' => true,`,
        },
        {
          type: "paragraph",
          text: {
            en: "For a <b>same-domain SPA</b> (your React/Vue frontend is served from the same domain as the API), you can skip tokens entirely and use cookie-based auth instead:\n\n• Call `GET /sanctum/csrf-cookie` first — this sets the CSRF cookie in the browser\n• Then log in normally via `POST /login`\n• The browser automatically sends the session cookie with every request\n• No `Authorization: Bearer` header needed",
            np: "SPA cookie auth: `/sanctum/csrf-cookie` पहिले call। Bearer token चाहिँदैन।",
            jp: "SPA クッキー認証は `/sanctum/csrf-cookie` で初期化後、通常ログイン。Bearer 不要。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between a Gate and a Policy?",
        np: "Gate र Policy फरक के हो?",
        jp: "Gate と Policy の違いは？",
      },
      answer: {
        en: "Both are authorization tools — they check whether a user is allowed to do something. The difference is scope:\n\n• <b>Gates</b> — a single closure for a single one-off rule. Best for actions not tied to a specific model (e.g. 'can this user view the reports dashboard?').\n• <b>Policies</b> — a class that groups all the rules for one model. Best when you have multiple CRUD-style checks on the same model (view, create, update, delete).\n\nInternally, calling `$this->authorize('update', $post)` in a controller automatically resolves to `PostPolicy::update` — you don't need to register anything manually.",
        np: "Gate = simple, model-agnostic। Policy = model-specific class। Controller मा `authorize()` ले auto resolve।",
        jp: "Gate はシンプルなクロージャ、Policy はモデル単位のクラス。`authorize()` は Policy を自動解決。",
      },
    },
    {
      question: {
        en: "How do I return a 403 from a policy?",
        np: "Policy मा 403 कसरी फर्काउने?",
        jp: "Policy から 403 を返す方法は？",
      },
      answer: {
        en: "Return `false` from a policy method. When you call `$this->authorize()` in a controller and the policy returns `false`, Laravel automatically throws a 403 `AuthorizationException`.\n\nIf you want to include a custom error message, return a `Response` object instead:\n`return Response::deny('You do not own this post.', 403)`\n\nNote: in Blade, `@can` simply hides or shows the HTML — it doesn't throw an exception.",
        np: "`false` return गर्नु → 403। `Response::deny()` custom message।",
        jp: "`false` を返すと 403 になる。`Response::deny('message')` でカスタムメッセージも可能。",
      },
    },
    {
      question: {
        en: "Can `@can` check policies in Blade?",
        np: "`@can` ले Blade मा policy check गर्छ?",
        jp: "`@can` で Blade に Policy をチェックできますか？",
      },
      answer: {
        en: "Yes. `@can('update', $post)` works exactly the same as `Gate::allows('update', $post)` — it resolves `PostPolicy::update` automatically.\n\n• Pass the model instance when checking model-bound rules: `@can('update', $post)`\n• Pass the class name when there's no instance yet (for create): `@can('create', App\\Models\\Post::class)`\n\n`@can` just shows or hides HTML — it doesn't abort the request. Always also check in the controller or use `$this->authorize()` to enforce the rule on the server side.",
        np: "`@can('update', $post)` — Policy::update call। Model class pass गर्न सकिन्छ।",
        jp: "`@can('update', $post)` は Gate と同じ仕組みで Policy を解決します。",
      },
    },
    {
      question: {
        en: "How do I add metadata to an API Resource response?",
        np: "API Resource response मा metadata थप्ने?",
        jp: "API Resource レスポンスにメタデータを追加する方法は？",
      },
      answer: {
        en: "Override the `with(Request $request): array` method in your Resource or ResourceCollection class. Whatever you return from `with()` appears alongside `data` at the top level of the JSON response.\n\nFor example: `return ['meta' => ['version' => 'v1', 'generated_at' => now()]]`\n\nAlternatively, in the controller you can call `->additional(['meta' => [...]])` when constructing the resource — useful when the metadata depends on something only the controller knows.",
        np: "`with()` method override गर्नु वा `additional()` call।",
        jp: "`with()` をオーバーライドするか、コントローラで `additional()` を呼ぶとメタデータを追加できます。",
      },
    },
    {
      question: {
        en: "How do I version an API in Laravel?",
        np: "Laravel मा API version कसरी?",
        jp: "Laravel で API をバージョニングする方法は？",
      },
      answer: {
        en: "The simplest and most practical approach is <b>URL versioning</b>:\n\n• Prefix your routes: `Route::prefix('v1')->group(...)`\n• Keep controllers in versioned namespaces: `App\\Http\\Controllers\\Api\\V1\\`\n• Use separate Resource classes per version if the response shape changes\n\nAvoid header-based versioning (sending a version in HTTP headers) — it's harder to test, harder to debug in a browser, and harder to document.\n\nLaravel 11 supports loading dedicated route files per version via `bootstrap/app.php`.",
        np: "URL prefix `v1`, `v2`। Versioned namespace। Header versioning सिफारिश होइन।",
        jp: "URL プレフィックス `v1`/`v2` が最もシンプル。バージョン別に名前空間とリソースを分ける。",
      },
    },
    {
      question: {
        en: "What is the `api_token` field vs Sanctum tokens?",
        np: "`api_token` column र Sanctum tokens फरक?",
        jp: "`api_token` カラムと Sanctum トークンの違いは？",
      },
      answer: {
        en: "The old `api_token` column was Laravel's original built-in token system (`driver: token` in `config/auth.php`). It stored a single plain-text token directly in the `users` table — one token per user, no scopes, no revocation, no tracking. Very basic.\n\n<b>Sanctum</b> is the modern replacement. It uses a separate `personal_access_tokens` table and supports:\n• Multiple tokens per user (different apps, different devices)\n• Abilities (scopes) to limit what each token can do\n• Last-used tracking\n• Individual or bulk revocation\n\nNever use the legacy `api_token` approach in a new project.",
        np: "`api_token` पुरानो simple approach। Sanctum ले `personal_access_tokens` table use गर्छ।",
        jp: "`api_token` は古い単一トークン方式。Sanctum は複数トークン・スコープ・失効管理対応の現代的な仕組みです。",
      },
    },
  ],
};
