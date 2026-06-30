import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "When a user submits a form, you need to check the data before your app does anything with it — this is called validation.\n\n<b>Why validation matters</b>\n• Without it, a user could submit an empty email, a password with 1 character, or a negative price\n  ↳ Validation catches bad data at the door, before it reaches your database\n\n<b>How Laravel handles it</b>\n• Inline: call `$request->validate([...])` right inside your controller method — quick for simple forms\n• <b>Form Request</b>: a dedicated class that holds validation rules, authorization checks, and lifecycle hooks — better for complex forms\n• Built-in rules: Laravel ships with 70+ rules like `required`, `email`, `min:8`, `unique` — no extra code needed\n• Custom Rule classes: write your own rule when built-ins aren't enough\n\n<b>What happens when validation fails?</b>\n• Web request (browser form): Laravel automatically redirects back to the form with the errors flashed to the session\n• API request (JSON): Laravel returns a `422 Unprocessable Entity` response with a JSON `errors` object",
      np: "Validation HTTP input र application logic बीचको gatekeeper। inline, built-in rules, custom Rule, Form Request। Web = redirect; API = 422 JSON।",
      jp: "バリデーションは HTTP 入力とアプリロジックの門番です。インライン検証・組み込みルール・カスタムルール・フォームリクエストを使い分けます。Web は redirect、API は 422 JSON で失敗を返します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Built-in validation rules reference",
        np: "Built-in validation rules सन्दर्भ",
        jp: "組み込みバリデーションルール リファレンス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel gives you two ways to write validation rules — and it matters which one you choose.\n\n<b>Pipe string syntax</b> `'required|email|max:255'`\n• Short and readable for simple rules\n  ↳ Gets messy when you mix in objects like `Rule::unique()` or `Rule::in()`\n\n<b>Array syntax</b> `['required', 'email', 'max:255']`\n• Cleaner when mixing plain string rules with `Rule::*` objects\n  ↳ Use this as your default — it scales better and avoids quoting issues",
            np: "Rules pipe string `'required|email'` वा array `['required', 'email']`। `Rule::*` object सहित array syntax राम्रो।",
            jp: "ルールはパイプ区切り文字列または配列で記述できます。`Rule::*` オブジェクトと混在させる場合は配列形式を使いましょう。",
          },
        },
        {
          type: "code",
          title: {
            en: "Inline validation with array syntax",
            np: "Array syntax inline validation",
            jp: "配列形式のインライン検証",
          },
          code: `use Illuminate\\Validation\\Rule;

$validated = $request->validate([
    'name'     => ['required', 'string', 'max:255'],
    'email'    => ['required', 'email:rfc,dns', Rule::unique('users')->ignore($user->id)],
    'password' => ['required', 'string', 'min:8', 'confirmed'],  // expects password_confirmation
    'age'      => ['nullable', 'integer', 'between:18,120'],
    'role'     => ['required', Rule::in(['admin', 'editor', 'viewer'])],
    'avatar'   => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
    'tags'     => ['nullable', 'array', 'max:5'],
    'tags.*'   => ['string', 'max:50'],
    'items.0.price' => ['required', 'numeric', 'min:0'],  // nested array
], [
    // Custom messages (field.rule => message)
    'email.unique'    => 'That email is already taken.',
    'password.min'    => 'Passwords must be at least 8 characters.',
]);`,
        },
        {
          type: "table",
          caption: {
            en: "Most-used built-in validation rules",
            np: "सबैभन्दा धेरै प्रयोग हुने rules",
            jp: "よく使う組み込みバリデーションルール",
          },
          headers: [
            { en: "Rule", np: "Rule", jp: "ルール" },
            { en: "Description", np: "विवरण", jp: "内容" },
          ],
          rows: [
            [
              { en: "`required`", np: "`required`", jp: "`required`" },
              { en: "Field must be present and not empty", np: "उपस्थित र non-empty", jp: "存在かつ空でないこと" },
            ],
            [
              { en: "`nullable`", np: "`nullable`", jp: "`nullable`" },
              { en: "Allow null / empty (combine with other rules)", np: "null/empty अनुमति", jp: "null や空を許可（他ルールと併用）" },
            ],
            [
              { en: "`sometimes`", np: "`sometimes`", jp: "`sometimes`" },
              { en: "Apply rules only when the field is present in the request", np: "field present भएमा मात्र check", jp: "フィールドがリクエストに存在する場合のみ適用" },
            ],
            [
              { en: "`string` / `integer` / `numeric` / `boolean` / `array`", np: "type rules", jp: "型ルール" },
              { en: "Type constraints", np: "type check", jp: "型チェック" },
            ],
            [
              { en: "`email`", np: "`email`", jp: "`email`" },
              { en: "Valid email format (use `email:rfc,dns` for stricter checks)", np: "valid email; `rfc,dns` कडा check", jp: "メールアドレス形式。`email:rfc,dns` で厳密に" },
            ],
            [
              { en: "`url`", np: "`url`", jp: "`url`" },
              { en: "Valid URL", np: "valid URL", jp: "有効な URL" },
            ],
            [
              { en: "`min:n` / `max:n`", np: "`min` / `max`", jp: "`min` / `max`" },
              { en: "Min/max length (string), value (numeric), size (file KB)", np: "min/max length, value, file KB", jp: "最小/最大 — 文字長・数値・ファイルサイズ" },
            ],
            [
              { en: "`between:min,max`", np: "`between`", jp: "`between`" },
              { en: "Value/length/size between two boundaries", np: "min～max 間", jp: "2 つの境界値の間" },
            ],
            [
              { en: "`in:a,b,c`", np: "`in`", jp: "`in`" },
              { en: "Value must be one of the listed options", np: "listed values मा हुनुपर्छ", jp: "列挙された値のどれか" },
            ],
            [
              { en: "`not_in:a,b`", np: "`not_in`", jp: "`not_in`" },
              { en: "Value must NOT be in the listed options", np: "listed values मा हुनु हुँदैन", jp: "列挙値に含まれないこと" },
            ],
            [
              { en: "`unique:table,column,ignore`", np: "`unique`", jp: "`unique`" },
              { en: "Value must be unique in a DB column; ignore a specific ID on update", np: "DB unique; update मा ignore", jp: "DB カラムで一意。更新時に自分の ID を除外" },
            ],
            [
              { en: "`exists:table,column`", np: "`exists`", jp: "`exists`" },
              { en: "Value must exist in a DB column", np: "DB column मा exist", jp: "DB カラムに存在すること" },
            ],
            [
              { en: "`confirmed`", np: "`confirmed`", jp: "`confirmed`" },
              { en: "Field must have a matching `{field}_confirmation` field", np: "`{field}_confirmation` match हुनुपर्छ", jp: "`{field}_confirmation` フィールドと一致すること" },
            ],
            [
              { en: "`date` / `date_format:Y-m-d`", np: "`date`", jp: "`date`" },
              { en: "Valid date string (optionally with specific format)", np: "valid date; optional format", jp: "有効な日付文字列（フォーマット指定可）" },
            ],
            [
              { en: "`regex:/pattern/`", np: "`regex`", jp: "`regex`" },
              { en: "Value must match a regular expression", np: "regex match हुनुपर्छ", jp: "正規表現にマッチすること" },
            ],
            [
              { en: "`image`", np: "`image`", jp: "`image`" },
              { en: "Uploaded file must be an image (jpg/png/gif/svg/webp)", np: "image file", jp: "画像ファイル（jpg/png/gif/svg/webp）" },
            ],
            [
              { en: "`mimes:jpg,pdf`", np: "`mimes`", jp: "`mimes`" },
              { en: "Uploaded file must match given MIME types", np: "MIME type check", jp: "指定 MIME タイプのファイルであること" },
            ],
            [
              { en: "`file`", np: "`file`", jp: "`file`" },
              { en: "Field must be a successfully uploaded file", np: "uploaded file", jp: "正常にアップロードされたファイル" },
            ],
            [
              { en: "`size:n`", np: "`size`", jp: "`size`" },
              { en: "File size must equal n kilobytes exactly", np: "file size n KB", jp: "ファイルサイズが n KB であること" },
            ],
            [
              { en: "`required_if:other,value`", np: "`required_if`", jp: "`required_if`" },
              { en: "Required when another field equals a given value", np: "अर्को field value हुँदा required", jp: "別フィールドが指定値のとき必須" },
            ],
            [
              { en: "`required_unless:other,value`", np: "`required_unless`", jp: "`required_unless`" },
              { en: "Required unless another field equals a given value", np: "अर्को field value नहुँदा required", jp: "別フィールドが指定値でない限り必須" },
            ],
            [
              { en: "`required_with:field1,field2`", np: "`required_with`", jp: "`required_with`" },
              { en: "Required when any of the listed fields are present", np: "listed fields present हुँदा required", jp: "列挙フィールドのどれかが存在するとき必須" },
            ],
          ],
        },
        {
          type: "code",
          title: {
            en: "Fluent Rule objects and conditional rules",
            np: "Fluent Rule objects र conditional rules",
            jp: "Fluent Rule オブジェクトと条件ルール",
          },
          code: `use Illuminate\\Validation\\Rule;
use Illuminate\\Validation\\Rules\\Password;

$request->validate([
    // Unique, ignoring the current record on update
    'email' => [
        'required',
        'email',
        Rule::unique('users', 'email')->ignore($user->id),
    ],

    // Exists scoped to a condition
    'country_id' => [
        'required',
        Rule::exists('countries', 'id')->where('active', 1),
    ],

    // Built-in Password rule (min 8, mixed case, symbols, uncompromised)
    'password' => ['required', 'confirmed', Password::defaults()],

    // Conditional: only validate 'company' when 'type' is 'business'
    'company' => Rule::when(
        fn () => $request->input('type') === 'business',
        ['required', 'string', 'max:100'],
    ),
]);`,
        },
      ],
    },
    {
      title: {
        en: "Custom Rule classes",
        np: "Custom Rule classes",
        jp: "カスタムルールクラス",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Sometimes Laravel's built-in rules won't cover your exact need — for example, validating that a username contains no spaces, or that a product code follows a company-specific format.\n\n<b>Custom Rule classes let you package that logic cleanly</b>\n• Generate one with `php artisan make:rule RuleName`\n• Implement the `validate()` method — call `$fail('message')` if the value is invalid\n  ↳ If `$fail()` is never called, the rule passes\n• In Laravel 10/11, implement `ValidationRule` — the single-method modern approach\n  ↳ The older `Rule` interface still works but the modern style is cleaner",
            np: "Built-in rules पुग्दैन भने custom Rule class बनाउनुस्। Laravel 10/11 मा `ValidationRule` implement गर्ने `validate()` method modern approach।",
            jp: "組み込みルールで対応できない場合はカスタムルールクラスを作成します。Laravel 10/11 では `ValidationRule` の `validate()` メソッドを実装するのが現代的なアプローチです。",
          },
        },
        {
          type: "code",
          title: {
            en: "Generate a custom rule",
            np: "Custom rule बनाउने",
            jp: "カスタムルールの生成",
          },
          code: `php artisan make:rule Uppercase`,
        },
        {
          type: "code",
          title: {
            en: "app/Rules/Uppercase.php — modern ValidationRule",
            np: "Uppercase.php — modern style",
            jp: "Uppercase.php — 現代スタイル",
          },
          code: `<?php
namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class Uppercase implements ValidationRule
{
    /**
     * Run the validation rule.
     * Call $fail() with a message to indicate failure.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if (strtoupper((string) $value) !== (string) $value) {
            $fail("The :attribute must be uppercase.");
        }
    }
}`,
        },
        {
          type: "code",
          title: {
            en: "Using a custom rule in validation",
            np: "Validation मा custom rule प्रयोग",
            jp: "バリデーションでカスタムルールを使う",
          },
          code: `use App\\Rules\\Uppercase;

$request->validate([
    'code' => ['required', 'string', 'max:10', new Uppercase],
]);

// Or in a Form Request's rules()
public function rules(): array
{
    return [
        'code' => ['required', 'string', 'max:10', new Uppercase],
    ];
}`,
        },
        {
          type: "code",
          title: {
            en: "Rule with constructor arguments",
            np: "Constructor arguments सहित Rule",
            jp: "コンストラクタ引数付きのルール",
          },
          code: `<?php
namespace App\\Rules;

use Closure;
use Illuminate\\Contracts\\Validation\\ValidationRule;

class AllowedDomain implements ValidationRule
{
    public function __construct(private array $domains) {}

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $domain = substr(strrchr((string) $value, '@'), 1);

        if (! in_array($domain, $this->domains, true)) {
            $fail("The :attribute must use an allowed email domain.");
        }
    }
}

// Usage
'email' => ['required', 'email', new AllowedDomain(['example.com', 'company.org'])],`,
        },
      ],
    },
    {
      title: {
        en: "Form Requests in depth",
        np: "Form Requests विस्तारमा",
        jp: "フォームリクエストの深掘り",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "A Form Request is a dedicated PHP class that bundles everything related to handling a form — all in one place.\n\n<b>The two required methods</b>\n• `authorize()` — returns `true` if the current user is allowed to make this request, `false` for a 403 Forbidden\n• `rules()` — returns the array of validation rules\n\n<b>Optional lifecycle hooks</b>\n• `prepareForValidation()` — runs before rules, lets you normalize input (e.g. trim whitespace, lowercase an email)\n• `passedValidation()` — runs after rules pass, lets you enrich data (e.g. generate a slug)\n• `messages()` — customize the error messages for specific rules\n• `attributes()` — rename field labels in error messages (e.g. `bio` → `biography`)\n\n<b>The key benefit: `$request->validated()`</b>\n• Returns only the fields defined in `rules()` — nothing more\n  ↳ Safe to pass directly to `Model::create($request->validated())` without mass-assignment risk",
            np: "Form Request: `authorize()`, `rules()`, `prepareForValidation()`, `passedValidation()`, `messages()`, `attributes()`। `$request->validated()` ले rules मा defined fields मात्र।",
            jp: "フォームリクエストは `authorize()`・`rules()` に加えて複数のライフサイクルフックを持ちます。`$request->validated()` は `rules()` に定義されたフィールドのみを返すので、`Model::create()` に安全に渡せます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Full Form Request with all hooks",
            np: "सबै hooks सहित Form Request",
            jp: "すべてのフックを持つフォームリクエスト",
          },
          code: `<?php
namespace App\\Http\\Requests;

use App\\Rules\\AllowedDomain;
use Illuminate\\Foundation\\Http\\FormRequest;
use Illuminate\\Contracts\\Validation\\ValidationRule;
use Illuminate\\Validation\\Rule;
use Illuminate\\Validation\\Rules\\Password;

class UpdateUserRequest extends FormRequest
{
    /**
     * false → 403 Forbidden. Can also return Gate::allows() result.
     */
    public function authorize(): bool
    {
        $user = $this->route('user'); // model bound from route {user}
        return $this->user()->can('update', $user);
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $userId = $this->route('user')->id;

        return [
            'name'     => ['required', 'string', 'max:255'],
            'email'    => [
                'required',
                'email:rfc',
                Rule::unique('users', 'email')->ignore($userId),
                new AllowedDomain(['example.com']),
            ],
            'password' => ['sometimes', 'confirmed', Password::min(8)->mixedCase()->numbers()],
            'bio'      => ['nullable', 'string', 'max:1000'],
            'avatar'   => ['nullable', 'image', 'mimes:jpg,png,webp', 'max:2048'],
            'role'     => ['required', Rule::in(['admin', 'editor', 'viewer'])],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique'       => 'That email address is already registered.',
            'password.confirmed' => 'The password confirmation does not match.',
        ];
    }

    public function attributes(): array
    {
        return [
            'bio'    => 'biography',
            'avatar' => 'profile photo',
        ];
    }

    /**
     * Runs BEFORE rules(). Normalize or transform raw input here.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'name'  => trim($this->name ?? ''),
            'email' => strtolower(trim($this->email ?? '')),
        ]);
    }

    /**
     * Runs AFTER rules() pass. Enrich or log here.
     */
    protected function passedValidation(): void
    {
        // e.g. $this->merge(['slug' => Str::slug($this->name)]);
    }
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "Forms sometimes send arrays of data — like a list of order items. Laravel handles this cleanly with dot notation.\n\n• `'items' => ['required', 'array', 'min:1']` — validate the array itself first (must exist, must have at least 1 item)\n• `'items.*.name'` — validate the `name` key on every item in the array\n  ↳ The `*` is a wildcard that means \"every element\"\n• `'items.0.price'` — validate the `price` of the first element only\n  ↳ Use a number index when you need to target a specific position",
            np: "Nested arrays: `'items.*.name'` ले every item को `name` validate। `'items.0.price'` पहिलो element।",
            jp: "ネスト配列はドット記法で: `'items.*.name'` で全要素の `name` を検証。`'items.0.price'` で最初の要素だけ。",
          },
        },
        {
          type: "code",
          title: {
            en: "Displaying errors in Blade",
            np: "Blade मा errors देखाउने",
            jp: "Blade でエラーを表示する",
          },
          code: `{{-- Single field error --}}
<input name="email" value="{{ old('email') }}">
@error('email')
    <p class="text-red-500 text-sm">{{ $message }}</p>
@enderror

{{-- Check if a field has any error --}}
<input class="{{ $errors->has('name') ? 'border-red-500' : '' }}" name="name">

{{-- All errors as a list --}}
@if ($errors->any())
    <ul class="alert alert-danger">
        @foreach ($errors->all() as $error)
            <li>{{ $error }}</li>
        @endforeach
    </ul>
@endif

{{-- Named error bag (multiple forms on one page) --}}
<form>
    @error('email', 'loginForm')
        <span>{{ $message }}</span>
    @enderror
</form>`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between `$request->validate()` and a Form Request?",
        np: "`validate()` र Form Request को फरक?",
        jp: "`$request->validate()` とフォームリクエストの違いは？",
      },
      answer: {
        en: "Both use the same validation engine under the hood — the difference is where the logic lives.\n\n• `$request->validate([...])` — written directly inside your controller method\n  ↳ Great for simple forms with 2–4 rules\n  ↳ Gets messy when rules grow, authorization is needed, or error messages need customizing\n• <b>Form Request</b> — a separate class dedicated to one form\n  ↳ Keeps the controller clean — the controller just calls `$request->validated()` and moves on\n  ↳ Better when rules are complex, when you need `authorize()`, or when you want `prepareForValidation()`\n  ↳ Easier to unit-test in isolation\n\nRule of thumb: start with `$request->validate()`, switch to a Form Request once you need more than rules.",
        np: "दुवैले same validation engine। `validate()` inline, simple। Form Request — complex, auth, lifecycle hooks, testable।",
        jp: "どちらも同じ検証エンジンを使います。`validate()` はインラインで簡潔。フォームリクエストはルール・認可・フックを専用クラスに分離し、単体テストもしやすくなります。",
      },
    },
    {
      question: {
        en: "How do I show all validation errors at once?",
        np: "सबै validation errors एकैपटक कसरी देखाउने?",
        jp: "全バリデーションエラーを一度に表示するには？",
      },
      answer: {
        en: "Laravel automatically passes validation errors to your Blade views — no manual passing needed.\n\n• `$errors->any()` — returns `true` if there are any errors at all (use to show/hide an error banner)\n• `$errors->all()` — returns a flat array of all error messages across all fields\n• `@error('fieldname') ... @enderror` — Blade directive that only renders when that specific field has an error\n  ↳ `$message` inside the block contains the error text\n• `$errors->first('fieldname')` — returns just the first error for a specific field\n\n<b>On API requests:</b>\n• The `$errors` variable is not used\n  ↳ Laravel returns a `422` JSON response with an `errors` object keyed by field name",
        np: "`$errors->all()` ले सबै messages। `@error('field')` single field। API = 422 JSON `errors` object।",
        jp: "`$errors->all()` で全メッセージを取得。フィールド別は `@error('field')`。API では 422 JSON の `errors` オブジェクトを参照します。",
      },
    },
    {
      question: {
        en: "How do I validate file uploads?",
        np: "File upload validate कसरी गर्ने?",
        jp: "ファイルアップロードの検証方法は？",
      },
      answer: {
        en: "File validation uses the same `validate()` call — just with file-specific rules.\n\n<b>Common file rules</b>\n• `'file'` — any successfully uploaded file\n• `'image'` — image file only (jpg, png, gif, svg, webp)\n• `'mimes:jpg,png,pdf'` — restrict to specific file types\n• `'max:2048'` — maximum file size in kilobytes (2 MB here)\n• `'dimensions:min_width=100,min_height=100'` — image dimension constraints\n\n<b>Storing the file safely</b>\n• Never use the original filename from the user — it could contain path traversal characters\n  ↳ Use `$request->file('avatar')->store('avatars', 'public')` — Laravel generates a safe random filename\n\n<b>One more thing to check</b>\n• Your HTML form must have `enctype=\"multipart/form-data\"` for file uploads to work\n  ↳ Without it, the file will not be sent to PHP at all",
        np: "`file`, `image`, `mimes`, `max` (KB), `dimensions`। Store: `->store('dir', 'public')`। Form: `enctype=\"multipart/form-data\"`।",
        jp: "`file`・`image`・`mimes`・`max`（KB 単位）・`dimensions` を組み合わせます。保存は `->store()` を使用。フォームには `enctype=\"multipart/form-data\"` が必要です。",
      },
    },
    {
      question: {
        en: "What does the `sometimes` rule do?",
        np: "`sometimes` rule के गर्छ?",
        jp: "`sometimes` ルールは何をする？",
      },
      answer: {
        en: "By default, if a field is missing from the request, Laravel still runs all its rules — which can cause unexpected failures.\n\n`sometimes` fixes this by making all other rules on that field conditional:\n• <b>Without `sometimes`</b>: a missing `phone` field fails `max:20` even if the user didn't send it\n• <b>With `sometimes`</b>: rules only apply when the field is actually present in the request\n  ↳ If the field is absent, all rules are skipped\n\n<b>When to use it:</b>\n• PATCH endpoints — only changed fields are sent, not the entire form\n• Optional fields that still need validation rules when they are provided (e.g. a phone number field that, if filled, must be max 20 characters)",
        np: "`sometimes` ले field present भएमा मात्र अन्य rules apply गर्छ। PATCH endpoint वा optional field मा उपयोगी।",
        jp: "`sometimes` は他のルールを「フィールドが存在するときのみ」に限定します。PATCH エンドポイントや、入力があれば検証したいオプションフィールドに便利です。",
      },
    },
    {
      question: {
        en: "How do I validate a JSON body in an API controller?",
        np: "API controller मा JSON body validate कसरी?",
        jp: "API コントローラで JSON ボディを検証するには？",
      },
      answer: {
        en: "The same validation code works for both browser forms and API JSON requests — no changes needed.\n\n<b>What happens automatically</b>\n• When the client sends `Content-Type: application/json`, Laravel reads and parses the JSON body\n• Add `Accept: application/json` in the request header to tell Laravel you want a JSON error response\n  ↳ Without it, Laravel might redirect instead of returning JSON on failure\n\n<b>On failure</b>\n• Laravel returns a `422 Unprocessable Entity` response with an `errors` JSON object\n  ↳ No redirect, no flashed session data — just clean JSON your frontend can read\n\n<b>Tip:</b> Routes inside the `api` middleware group always return JSON errors, even without the `Accept` header",
        np: "Same `validate()` वा Form Request। `Content-Type: application/json` भए JSON body read। fail = 422 JSON। `Accept: application/json` चाहिन्छ।",
        jp: "全く同じ方法です。`Content-Type: application/json` で Laravel は JSON ボディを読みます。失敗時は **422 JSON** を返します。`Accept: application/json` ヘッダーがない場合も API ルートグループなら JSON レスポンスになります。",
      },
    },
  ],
};
