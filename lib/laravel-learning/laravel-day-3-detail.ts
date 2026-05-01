import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Controllers** organize request-handling logic into PHP classes under `App\\Http\\Controllers`. Laravel's **Service Container** auto-injects constructor dependencies. **Form Requests** extract validation and authorization into dedicated classes, keeping each controller method focused on a single responsibility.",
      np: "Controllers HTTP logic PHP class मा। Form Requests validation र authorization अलग class मा राख्छन्।",
      jp: "コントローラはリクエスト処理ロジックをクラスにまとめます。フォームリクエストで検証と認可を分離し、コントローラを薄く保ちます。",
    },
  ],
  sections: [
    {
      title: {
        en: "Controller types",
        np: "Controller types",
        jp: "コントローラの種類",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel supports three patterns: **basic** (any public methods), **single-action / invokable** (one `__invoke` method), and **resource** (`--resource` scaffolds 7 CRUD methods; `--api` scaffolds 5, skipping `create` and `edit` which serve HTML forms).",
            np: "Basic, single-action (`__invoke`), resource (`--resource` = 7), API resource (`--api` = 5)।",
            jp: "基本・シングルアクション（`__invoke`）・リソース（`--resource` 7 メソッド）・API リソース（`--api` 5 メソッド）。",
          },
        },
        {
          type: "code",
          title: {
            en: "Artisan scaffolding",
            np: "Artisan scaffolding",
            jp: "Artisan でコントローラ生成",
          },
          code: `# Basic controller
php artisan make:controller UserController

# Single-action (invokable) controller
php artisan make:controller ShowDashboard --invokable

# Resource controller (7 methods)
php artisan make:controller PostController --resource

# API resource controller (5 methods, no create/edit)
php artisan make:controller Api\\PostController --api --model=Post`,
        },
        {
          type: "code",
          title: {
            en: "Single-action (invokable) controller",
            np: "Invokable controller",
            jp: "シングルアクションコントローラ",
          },
          code: `<?php
namespace App\\Http\\Controllers;

use App\\Models\\Post;
use Illuminate\\Http\\RedirectResponse;

class PublishPostController extends Controller
{
    // Route: Route::post('/posts/{post}/publish', PublishPostController::class)
    public function __invoke(Post $post): RedirectResponse
    {
        $post->update(['published_at' => now()]);

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post published.');
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Resource controller with constructor injection",
            np: "Resource controller constructor injection सहित",
            jp: "コンストラクタ注入付きリソースコントローラ",
          },
          code: `<?php
namespace App\\Http\\Controllers;

use App\\Models\\Post;
use App\\Services\\PostService;
use Illuminate\\Http\\RedirectResponse;
use Illuminate\\View\\View;

class PostController extends Controller
{
    // Service Container resolves PostService automatically
    public function __construct(private PostService $posts) {}

    public function index(): View
    {
        return view('posts.index', ['posts' => $this->posts->paginate()]);
    }

    public function store(StorePostRequest $request): RedirectResponse
    {
        $post = Post::create($request->validated());

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post created.');
    }

    public function show(Post $post): View
    {
        return view('posts.show', compact('post'));
    }

    public function update(UpdatePostRequest $request, Post $post): RedirectResponse
    {
        $post->update($request->validated());

        return redirect()->route('posts.show', $post);
    }

    public function destroy(Post $post): RedirectResponse
    {
        $post->delete();

        return redirect()->route('posts.index');
    }
}`,
        },
      ],
    },
    {
      title: {
        en: "Form Requests — validation objects",
        np: "Form Requests — validation objects",
        jp: "フォームリクエスト — バリデーションオブジェクト",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A **Form Request** encapsulates `authorize()` (returns bool — `false` yields 403) and `rules()` (the validation rule array). Type-hint it in the controller method and Laravel runs both checks automatically before the method body executes. Retrieve safe data with `$request->validated()`, never `$request->all()`.",
            np: "Form Request मा `authorize()` (false = 403) र `rules()`। type-hint गर्दा auto check। `$request->validated()` ले validated data मात्र।",
            jp: "フォームリクエストは `authorize()`（false で 403）と `rules()` をカプセル化します。型ヒントを書くだけで自動検証。`$request->validated()` で安全なデータのみ取得。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generate a Form Request",
            np: "Form Request बनाउने",
            jp: "フォームリクエスト生成",
          },
          code: `php artisan make:request StorePostRequest`,
        },
        {
          type: "code",
          title: {
            en: "StorePostRequest — complete example",
            np: "StorePostRequest — पूर्ण उदाहरण",
            jp: "StorePostRequest の完全な例",
          },
          code: `<?php
namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class StorePostRequest extends FormRequest
{
    /**
     * Return false to send a 403 Forbidden response.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'     => ['required', 'string', 'max:255'],
            'body'      => ['required', 'string'],
            'category'  => ['required', 'exists:categories,id'],
            'tags'      => ['nullable', 'array', 'max:5'],
            'tags.*'    => ['string', 'max:50'],
            'published' => ['boolean'],
        ];
    }

    /**
     * Custom error messages (optional).
     */
    public function messages(): array
    {
        return [
            'title.required'  => 'A post title is required.',
            'category.exists' => 'Please choose a valid category.',
        ];
    }

    /**
     * Override field labels in error messages (optional).
     */
    public function attributes(): array
    {
        return ['body' => 'post body'];
    }

    /**
     * Normalize input BEFORE validation runs.
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['title' => trim($this->title ?? '')]);
    }

    /**
     * Hook called AFTER validation passes.
     */
    protected function passedValidation(): void
    {
        // log, enrich, or transform validated data here
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Using StorePostRequest in a controller",
            np: "Controller मा Form Request प्रयोग",
            jp: "コントローラでのフォームリクエスト利用",
          },
          code: `<?php
namespace App\\Http\\Controllers;

use App\\Http\\Requests\\StorePostRequest;
use App\\Models\\Post;
use Illuminate\\Http\\RedirectResponse;

class PostController extends Controller
{
    // authorize() + rules() run automatically before this method body
    public function store(StorePostRequest $request): RedirectResponse
    {
        // validated() returns ONLY fields that passed rules()
        $post = Post::create($request->validated());

        return redirect()->route('posts.show', $post)
            ->with('success', 'Post created!');
    }
}`,
        },
      ],
    },
    {
      title: {
        en: "Response types reference",
        np: "Response types सन्दर्भ",
        jp: "レスポンス種別リファレンス",
      },
      blocks: [
        {
          type: "code",
          title: {
            en: "View, JSON, redirect, download & stream",
            np: "View, JSON, redirect, download",
            jp: "ビュー・JSON・リダイレクト・ダウンロード",
          },
          code: `<?php
// View (Blade)
return view('posts.show', compact('post'));
return view('posts.index', ['posts' => Post::paginate(15)]);

// JSON (API)
return response()->json(['data' => $post], 200);
return response()->json(['created' => true], 201);
return response()->json(null, 204);  // DELETE — no body

// Redirects
return redirect('/dashboard');
return redirect()->route('posts.index');
return redirect()->back();
return redirect()->back()->withInput()->withErrors(['title' => 'Required']);
return redirect()->route('posts.edit', $post)
    ->with('warning', 'Review before publishing.');

// Download & file (inline in browser)
return response()->download(storage_path('app/report.pdf'), 'report.pdf');
return response()->file(storage_path('app/logo.png'));

// Custom headers + status
return response('Unauthorized text', 401)
    ->header('X-Custom', 'value');`,
        },
        {
          type: "table",
          caption: {
            en: "Common HTTP status codes",
            np: "सामान्य HTTP status codes",
            jp: "よく使う HTTP ステータスコード",
          },
          headers: [
            { en: "Code", np: "Code", jp: "コード" },
            { en: "Meaning", np: "अर्थ", jp: "意味" },
            { en: "Typical use", np: "प्रयोग", jp: "典型的な用途" },
          ],
          rows: [
            [
              { en: "200", np: "200", jp: "200" },
              { en: "OK", np: "OK", jp: "OK" },
              { en: "Successful GET", np: "सफल GET", jp: "成功した GET" },
            ],
            [
              { en: "201", np: "201", jp: "201" },
              { en: "Created", np: "सिर्जित", jp: "作成完了" },
              { en: "Resource created via POST", np: "POST बाट resource", jp: "POST でリソース作成" },
            ],
            [
              { en: "204", np: "204", jp: "204" },
              { en: "No Content", np: "सामग्री छैन", jp: "内容なし" },
              { en: "Successful DELETE (no body)", np: "DELETE, body छैन", jp: "DELETE 成功（ボディなし）" },
            ],
            [
              { en: "301", np: "301", jp: "301" },
              { en: "Moved Permanently", np: "स्थायी redirect", jp: "恒久リダイレクト" },
              { en: "Permanent URL redirect", np: "स्थायी redirect", jp: "恒久的な転送" },
            ],
            [
              { en: "302", np: "302", jp: "302" },
              { en: "Found (Redirect)", np: "अस्थायी redirect", jp: "一時リダイレクト" },
              { en: "`redirect()` default in Laravel", np: "Laravel default", jp: "Laravel の `redirect()` デフォルト" },
            ],
            [
              { en: "401", np: "401", jp: "401" },
              { en: "Unauthorized", np: "अप्रमाणित", jp: "未認証" },
              { en: "No or invalid auth token", np: "token छैन वा गलत", jp: "認証なし（トークン無効）" },
            ],
            [
              { en: "403", np: "403", jp: "403" },
              { en: "Forbidden", np: "निषिद्ध", jp: "アクセス拒否" },
              { en: "Authenticated but not authorized", np: "प्रमाणित, अनुमति छैन", jp: "認証済みだが権限なし" },
            ],
            [
              { en: "404", np: "404", jp: "404" },
              { en: "Not Found", np: "फेला परेन", jp: "リソース不在" },
              { en: "Route or model not found", np: "route वा model भेटिएन", jp: "ルートやモデルが見つからない" },
            ],
            [
              { en: "422", np: "422", jp: "422" },
              { en: "Unprocessable Content", np: "validation असफल", jp: "バリデーション失敗" },
              { en: "Validation failure (API JSON)", np: "API validation fail", jp: "API バリデーション失敗" },
            ],
            [
              { en: "500", np: "500", jp: "500" },
              { en: "Internal Server Error", np: "सर्भर त्रुटि", jp: "サーバ内部エラー" },
              { en: "Unhandled exception", np: "unhandled exception", jp: "未処理の例外" },
            ],
          ],
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "When should I use a Form Request instead of inline `$request->validate()`?",
        np: "Inline `validate()` र Form Request — कहिले कुन?",
        jp: "インライン `validate()` とフォームリクエストの使い分けは？",
      },
      answer: {
        en: "Use **inline validation** for simple one-off checks (2–3 rules). Use a **Form Request** when the rules are complex, authorization logic belongs alongside them, multiple controller actions share the same rules, or you want to unit-test rules in isolation. Form Requests also give you `prepareForValidation` and `passedValidation` lifecycle hooks.",
        np: "Simple = inline। Complex, auth, reuse = Form Request। lifecycle hooks पनि मिल्छ।",
        jp: "シンプルな検証はインライン。ルールが複雑・認可が伴う・複数アクションで共有の場合はフォームリクエスト。ライフサイクルフックも利用できます。",
      },
    },
    {
      question: {
        en: "What does `authorize()` return and what happens when it returns `false`?",
        np: "`authorize()` false भए के हुन्छ?",
        jp: "`authorize()` が `false` を返すとどうなる？",
      },
      answer: {
        en: "Returning `false` throws an `AuthorizationException`, which the exception handler converts to a **403 Forbidden** response. You can also return a `Gate::response()` object to customize the 403 message. For APIs, this produces a JSON `{message: 'This action is unauthorized.'}` body.",
        np: "`false` = `AuthorizationException` → 403। `Gate::response()` ले message customize। API मा JSON।",
        jp: "`false` で `AuthorizationException` がスローされ **403 Forbidden** に変換。`Gate::response()` でメッセージをカスタマイズ可。API では JSON ボディになります。",
      },
    },
    {
      question: {
        en: "How do I return a 422 from a controller manually (without a Form Request)?",
        np: "Controller बाट manually 422 कसरी?",
        jp: "コントローラから手動で 422 を返すには？",
      },
      answer: {
        en: "Throw `\\Illuminate\\Validation\\ValidationException::withMessages(['field' => ['Error message']])`. Laravel formats it as a 422 with the `errors` key. Alternatively call `abort(422)` for a generic response, or `response()->json(['errors' => [...]], 422)` for full control in an API.",
        np: "`ValidationException::withMessages([...])` throw → 422। `abort(422)` वा `response()->json([...], 422)` पनि।",
        jp: "`ValidationException::withMessages([...])` をスローすると 422 になります。`abort(422)` や `response()->json(['errors' => [...]], 422)` も使えます。",
      },
    },
    {
      question: {
        en: "Can a single controller handle both web (Blade) and API (JSON) responses?",
        np: "एउटै controller ले web र API दुवै handle गर्न?",
        jp: "1 つのコントローラで Web と API 両方を扱える？",
      },
      answer: {
        en: "Technically yes — branch on `$request->expectsJson()`. In practice, keeping separate controllers is cleaner: `App\\Http\\Controllers\\PostController` for web (views + redirects) and `App\\Http\\Controllers\\Api\\PostController` for JSON. The API version skips `create`/`edit` methods.",
        np: "`$request->expectsJson()` ले branch। तर अलग controller cleaner।",
        jp: "技術的には可能。ただし `Api\\` 名前空間にコントローラを分けた方が明確です。",
      },
    },
    {
      question: {
        en: "How do I test HTTP responses in Laravel?",
        np: "HTTP response test कसरी?",
        jp: "HTTP レスポンスのテスト方法は？",
      },
      answer: {
        en: "Use Laravel's HTTP testing helpers (Pest or PHPUnit): `$this->get('/posts')->assertOk()->assertViewIs('posts.index')` or `$this->postJson('/api/posts', $data)->assertCreated()->assertJsonPath('data.title', 'My Post')`. Authenticate with `$this->actingAs($user)`. Run the suite with `php artisan test` or `./vendor/bin/pest`.",
        np: "`$this->get()->assertOk()`, `postJson()->assertCreated()`, `actingAs($user)` — `php artisan test`।",
        jp: "`$this->get('/posts')->assertOk()` や `postJson(...)->assertCreated()` のヘルパを使います。`actingAs($user)` で認証再現。`php artisan test` か `pest` で実行。",
      },
    },
  ],
};
