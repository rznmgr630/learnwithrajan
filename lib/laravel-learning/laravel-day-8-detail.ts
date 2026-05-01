import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Session stores per-user server-side state (flash messages, wizard steps). Localization ships translations under `lang/` with `php artisan lang:publish`; call `__('file.key')` or `trans_choice` from Blade/PHP and set `APP_LOCALE` / `App::setLocale()` for runtime switches.",
      np: "Session स्टेट। `lang/` मा अनुवाद, `__()` प्रयोग।",
      jp: "セッション でサーバ側の一時状態。`lang/` と `__()` で多言語化。`APP_LOCALE` を環境ごとに。",
    },
  ],
  sections: [
    {
      title: { en: "Session helpers", np: "सत्र", jp: "セッション" },
      blocks: [
        {
          type: "code",
          code: `session(['cart_id' => 123]);
$value = session('cart_id');
session()->flash('status', 'Saved!');
session()->forget('cart_id');
session()->flush();

// Blade
@if (session('status')) ... @endif`,
        },
      ],
    },
    {
      title: { en: "Translation files", np: "अनुवाद फाइल", jp: "翻訳ファイル" },
      blocks: [
        {
          type: "code",
          code: `// lang/en/common.php
return ['greeting' => 'Hello, :name'];

{{ __('common.greeting', ['name' => $user->name]) }}

App::setLocale('np');`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Session driver choices?",
        np: "सत्र ड्राइभर?",
        jp: "セッションストアの選び方は？",
      },
      answer: {
        en: "Common drivers: `file` (local dev), `database`, `redis` (scalable). Configure via `SESSION_DRIVER` in `.env` and run migrations when using DB sessions.",
        np: "`file`, `database`, `redis` — `.env` मा `SESSION_DRIVER`।",
        jp: "開発は `file`、本番では `redis` / `database` などが一般的。`SESSION_DRIVER` で切り替えます。",
      },
    },
  ],
};
