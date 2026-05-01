import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_2_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Routing maps HTTP verbs + URIs to closures or controller actions. Laravel’s `routes/web.php` (and `routes/api.php`) are the tables of contents for your app.",
      np: "रूटिङ ले HTTP verb र URI लाई closure वा नियन्त्रकमा जोड्छ। `routes/web.php` मुख्य।",
      jp: "ルーティングは HTTP メソッドと URI をクロージャやコントローラに結び付けます。`routes/web.php` が入口です。",
    },
  ],
  sections: [
    {
      title: { en: "Basic routes & shorthand", np: "आधारभूत रूट", jp: "基本ルート" },
      blocks: [
        {
          type: "code",
          title: { en: "Common patterns", np: "ढाँचाहरू", jp: "よく使うパターン" },
          code: `use Illuminate\\Support\\Facades\\Route;

Route::get('/', fn () => view('welcome'));
Route::view('/', 'welcome'); // same idea when no extra logic

Route::post('/users', function (Illuminate\\Http\\Request $request) {
    return $request->all();
});`,
        },
      ],
    },
    {
      title: { en: "Parameters, constraints & names", np: "प्यारामिटर र नाम", jp: "パラメータと名前" },
      blocks: [
        {
          type: "code",
          title: { en: "Dynamic segments", np: "गतिशील खण्ड", jp: "動的セグメント" },
          code: `Route::get('/users/{id}', fn (string $id) => $id)
    ->where('id', '[0-9]+');

// Multiple params: chain ->where() or use Route::pattern('slug', '...') globally

Route::post('/users/{id}', ...)->name('users.update');`,
        },
        {
          type: "paragraph",
          text: {
            en: "Use `->name('…')` so URLs stay stable when paths change—call `route('users.update', ['id' => 5])` from Blade or redirects.",
            np: "`->name()` ले URL परिवर्तनमा पनि स्थिर नाम। `route()` ले URL बनाउँछ।",
              jp: "`->name()` で名前付きルートに。`route('name', params)` で URL を生成します。",
          },
        },
      ],
    },
    {
      title: { en: "Groups & model binding", np: "समूह र मोडेल बाइन्डिङ", jp: "グループとルートモデル結合" },
      blocks: [
        {
          type: "code",
          title: { en: "Prefix group", np: "prefix समूह", jp: "プレフィックスグループ" },
          code: `use App\\Http\\Controllers\\UserController;

Route::prefix('users')->group(function () {
    Route::get('/', [UserController::class, 'index']);
    Route::post('/', [UserController::class, 'store']);
    Route::put('/{user}', [UserController::class, 'update']);
});

// Implicit binding: {user} resolves User by id (or custom key)
Route::get('/users/{user:first_name}', ...); // custom column

// In User model — useRouteKeyName() or getRouteKeyName()
public function getRouteKeyName(): string { return 'slug'; }`,
        },
      ],
    },
    {
      title: { en: "Catch-all verbs", np: "सबै verb", jp: "任意メソッド" },
      blocks: [
        {
          type: "code",
          code: `Route::any('/legacy', [LegacyController::class, 'handle']);
Route::match(['get', 'post'], '/form', [FormController::class, 'show']);`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Where do API routes live in Laravel 11?",
        np: "API रूट कहाँ?",
        jp: "API ルートはどこ？",
      },
      answer: {
        en: "By convention `routes/api.php` (often prefixed with `/api` via `bootstrap/app.php`). Web cookies/session CSRF patterns differ from token/API clients—keep JSON endpoints in `api` routes and follow `Accept: application/json` expectations.",
        np: "`routes/api.php` मा; प्रायः `/api` प्रिफिक्स। वेब र API फरक सुरक्षा मोडेल।",
        jp: "通常 `routes/api.php`（アプリケーション構成で `/api` プレフィックス）。Web と API はセッション/CSRF の前提が異なります。",
      },
    },
    {
      question: {
        en: "What is route model binding?",
        np: "Route model binding के हो?",
        jp: "ルートモデルバインディングとは？",
      },
      answer: {
        en: "Laravel resolves `{user}` to a `User` instance automatically (404 if missing). Customize the lookup column with `{user:slug}` or override `getRouteKeyName()` / `resolveRouteBinding` on the model.",
        np: "`{user}` ले आफै User खोज्छ। स्तम्भ बदल्न `slug` वा `getRouteKeyName()`।",
        jp: "`{user}` を `User` に自動解決（無ければ 404）。列を変えるには `{user:slug}` やモデルの `getRouteKeyName()` を使います。",
      },
    },
  ],
};
