import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_5_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Validation** is the gatekeeper between raw HTTP input and your application logic. Laravel offers inline validation via `$request->validate([...])`, a rich library of built-in rules, custom Rule classes, and full-featured **Form Request** objects with lifecycle hooks. Failures on web requests redirect back with flashed errors; failures on API requests return a 422 JSON response.",
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
            en: "Rules can be written as a pipe-delimited string `'required|email|max:255'` or as an array `['required', 'email', 'max:255']`. Prefer the **array syntax** when mixing string rules with `Rule::*` objects — it avoids ambiguity and makes rules easier to read.",
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
            en: "When a validation need isn't covered by built-in rules, create a **custom rule class**. In Laravel 10/11 the modern approach is `ValidationRule` (implements a single `validate()` method). The older `implicit` rule approach still works but the invokable/modern style is preferred.",
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
            en: "A **Form Request** provides `authorize()` + `rules()` plus several lifecycle hooks: `prepareForValidation()` normalizes input before rules run, `passedValidation()` fires after rules pass, `messages()` customizes error text, `attributes()` renames field labels. The `$request->validated()` method returns only the fields that appear in `rules()`, giving you a safe, filtered array for `Model::create()`.",
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
            en: "Validate **nested arrays** using dot notation: `'items.*.name'` validates the `name` key of every element in an `items` array. `'items.0.price'` targets the first element specifically. Combine with `'items' => ['required', 'array', 'min:1']` to validate the array itself first.",
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
        en: "Both ultimately use the same validation engine. `$request->validate([...])` is concise and lives inline in the controller method — fine for 2–4 simple rules. A **Form Request** moves rules, authorization, messages, attributes, and lifecycle hooks into a dedicated testable class. Choose Form Request when rules grow complex, when auth belongs alongside them, or when you need `prepareForValidation`.",
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
        en: "The `$errors` variable is shared with every Blade view via the `web` middleware group. Use `$errors->any()` to check for errors, then `$errors->all()` to get a flat array of all messages. For per-field display use `@error('field')` or `$errors->first('field')`. On API requests, `$errors` is not used — the 422 JSON response contains an `errors` object keyed by field name.",
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
        en: "Use `'file'` (any upload), `'image'` (image types only), `'mimes:jpg,png,pdf'` for specific types, `'max:2048'` for file size in kilobytes, and `'dimensions:min_width=100,min_height=100'` for image dimensions. Always store files via `$request->file('avatar')->store('avatars', 'public')` — never trust the original filename. Ensure your form has `enctype=\"multipart/form-data\"` and `@csrf`.",
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
        en: "`sometimes` makes all the other rules on that field **conditional**: they only apply when the field is actually present in the request payload. Without `sometimes`, absent fields still fail `required` etc. This is useful for PATCH endpoints where only changed fields are sent, or for optional form fields that still need validation when provided.",
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
        en: "Exactly the same way — `$request->validate([...])` or a Form Request. Laravel reads the parsed JSON body when `Content-Type: application/json` is set (and the client sends `Accept: application/json`). On failure, instead of redirecting, Laravel returns a **422 JSON** response with an `errors` object. To force JSON error responses even without the `Accept` header, throw `ValidationException::withMessages([...])` or add the route to the `api` group.",
        np: "Same `validate()` वा Form Request। `Content-Type: application/json` भए JSON body read। fail = 422 JSON। `Accept: application/json` चाहिन्छ।",
        jp: "全く同じ方法です。`Content-Type: application/json` で Laravel は JSON ボディを読みます。失敗時は **422 JSON** を返します。`Accept: application/json` ヘッダーがない場合も API ルートグループなら JSON レスポンスになります。",
      },
    },
  ],
};
