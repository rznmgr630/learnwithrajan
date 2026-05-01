import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Never trust raw `Request` input. Laravel `validate()` (on `Request` or controller) returns only validated fields and throws `ValidationException` on failure (redirect back with errors + flash old input for web).",
      np: "`validate()` ले नियम लगाउँछ — असफल भए पछाडि errors र `old()`।",
      jp: "`$request->validate([...])` でルールを宣言。失敗時はエラーと `old()` で再表示に便利です。",
    },
  ],
  sections: [
    {
      title: { en: "Rules & messages", np: "नियम र सन्देश", jp: "ルールとメッセージ" },
      blocks: [
        {
          type: "code",
          code: `$request->validate([
    'email' => 'required|email',
    'languages' => 'array',
    'languages.*' => 'string|max:50', // checkbox/array inputs
]);

$request->validate([...], [
    'email.required' => 'Please provide email.',
]);`,
        },
      ],
    },
    {
      title: { en: "Blade errors & publishing lang files", np: "Blade त्रुटि र भाषा", jp: "エラー表示と lang" },
      blocks: [
        {
          type: "code",
          code: `<input name="title" value="{{ old('title') }}">

@error('title')
    <span>{{ $message }}</span>
@enderror

php artisan lang:publish`,
        },
      ],
    },
    {
      title: { en: "Custom rule (Laravel 11)", np: "कस्टम नियम", jp: "カスタムルール" },
      blocks: [
        {
          type: "code",
          code: `php artisan make:rule Uppercase

// App\\Rules\\Uppercase implements ValidationRule
public function validate(string $attribute, mixed $value, Closure $fail): void
{
    if (strtoupper((string) $value) !== (string) $value) {
        $fail('The :attribute must be uppercase.');
    }
}

// usage: 'field' => ['required', new Uppercase]`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "Why does validation redirect “back” with errors?",
        np: "प्रमाणीकरण किन पछाडि redirect?",
        jp: "検証失敗でなぜ前のページに戻る？",
      },
      answer: {
        en: "For `Accept: text/html` requests Laravel stores errors in the session and redirects—your Blade form repopulates via `old()` and `@error`. For APIs (`expectsJson()`), you get a 422 JSON payload instead.",
        np: "वेबमा session errors + redirect; API मा 422 JSON।",
        jp: "Web はセッションにエラーを載せてリダイレクト。API は 422 と JSON が典型です。",
      },
    },
  ],
};
