import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_6_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Middleware wraps the request→response pipeline (auth, trimming strings, rate limits). Register aliases & groups in `bootstrap/app.php` (`->withMiddleware`). `Request` exposes headers, IP, JSON body, files, and helpers like `$request->validated()` after a Form Request.",
      np: "Middleware अनुरोध र प्रतिक्रियाबीच। `bootstrap/app.php` मा दर्ता।",
      jp: "ミドルウェア がリクエストをフィルタ。`bootstrap/app.php` で登録。`Request` で入力・ヘッダ・IP などを読みます。",
    },
  ],
  sections: [
    {
      title: { en: "Middleware registration (Laravel 11)", np: "मिडलवेयर दर्ता", jp: "ミドルウェア登録" },
      blocks: [
        {
          type: "code",
          code: `// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->alias([
        'admin' => \\App\\Http\\Middleware\\EnsureAdmin::class,
    ]);
    $middleware->appendToGroup('staff', [
        \\App\\Http\\Middleware\\VerifyStaff::class,
    ]);
})

// routes/web.php
Route::middleware('staff')->group(function () { ... });
Route::get('/dash', ...)->middleware('admin');`,
        },
      ],
    },
    {
      title: { en: "URL helpers", np: "URL सहायक", jp: "URL ヘルパ" },
      blocks: [
        {
          type: "code",
          code: `use Illuminate\\Support\\Facades\\URL;

url('/profile');
route('profile.show', ['user' => $user]);
URL::current();
URL::full();
URL::previous();
URL::query(['sort' => 'name']);`,
        },
      ],
    },
    {
      title: { en: "Reading requests", np: "अनुरोध पढ्ने", jp: "リクエストの読み取り" },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Common patterns: `$request->input('key')`, `$request->query()`, `$request->boolean('remember')`, `$request->file('avatar')`, `$request->ip()`, `$request->userAgent()`, `$request->route('user')` for bound models.",
            np: "`input`, `file`, `ip`, `route()` आदि।",
            jp: "`input` / `file` / `ip` / `route()` でルートパラメータやモデルにもアクセスできます。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Global vs route middleware?",
        np: "वैश्विक बनाम रूट मिडलवेयर?",
        jp: "グローバルとルート指定の違いは？",
      },
      answer: {
        en: "Global runs on every matching stack (web/api). Route / group middleware scopes behavior—start with route-level until you truly need global side effects.",
        np: "वैश्विक सबैमा; रूटले दायरा सीमित गर्छ।",
        jp: "グローバル はスタック全体。ルート／グループ で適用範囲を絞るのが一般的です。",
      },
    },
  ],
};
