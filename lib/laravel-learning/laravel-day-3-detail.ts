import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_3_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Controllers bundle HTTP actions: validate input (often via Form Requests later), call services/models, return responses (views, JSON, redirects). Artisan scaffolds classes under `App\Http\Controllers`.",
      np: "Controllers ले HTTP कार्य समेट्छन् — मोडेल/सेवा र प्रतिक्रिया। `make:controller`।",
      jp: "コントローラ が入力→モデル/サービス→レスポンスをまとめます。`php artisan make:controller` で作成します。",
    },
  ],
  sections: [
    {
      title: { en: "Create controllers", np: "नियन्त्रक सिर्जना", jp: "コントローラ作成" },
      blocks: [
        {
          type: "code",
          code: `php artisan make:controller UserController
php artisan make:controller PostController --resource
php artisan make:controller Api\\BookController --model=Book`,
        },
        {
          type: "paragraph",
          text: {
            en: "`--resource` generates index/store/show/update/destroy stubs mapped by `Route::resource`. Pair with `--model=` to import type hints for binding.",
            np: "`--resource` ले REST कार्यहरू। `--model=` ले टाइप हिन्ट।",
            jp: "`--resource` で REST 風メソッド。`--model=` でモデル連携が楽になります。",
          },
        },
      ],
    },
    {
      title: { en: "HTTP responses", np: "HTTP प्रतिक्रिया", jp: "レスポンスの種類" },
      blocks: [
        {
          type: "code",
          title: { en: "Return shapes", np: "फर्काउने आकार", jp: "返り値の例" },
          code: `return view('users.index', ['users' => $users]);
return 'Plain text';
return ['key' => 'value']; // JSON when Accept expects JSON or route is api
return response()->json(['ok' => true], 201);
return redirect()->route('home');
return redirect('/')->with('status', 'Saved');`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Thin vs fat controllers?",
        np: "पातलो बनाम बाक्लो नियन्त्रक?",
        jp: "薄いコントローラと厚いコントローラ？",
      },
      answer: {
        en: "Keep controllers thin: HTTP concerns + delegation. Push reusable rules into services, actions, or domain classes so you can test logic without HTTP.",
        np: "नियन्त्रक पातलो राख्नुहोस् — दोहोरिने लजिक सेवा वा मोडेलमा।",
        jp: "コントローラは HTTP の出入りに集中し、繰り返しロジックはサービスやドメインに寄せるとテストしやすいです。",
      },
    },
  ],
};
