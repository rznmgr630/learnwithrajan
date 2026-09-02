import type { LessonDay } from "@/lib/learn/lesson-types";

export const LARAVEL_DAY_24_LESSONS: LessonDay = {
  day: 24,
  title: "Localization, collections & helpers",
  totalMinutes: 89,
  difficulty: "Intermediate",
  lessons: [
    {
      id: "localization",
      title: "Localization — language files & __()",
      durationMinutes: 11,
      explanation: "Three things today, and one idea underneath all of them:\n\n```text\nLocalization   →  multiple languages\nCollections    →  transform data\nStrings        →  clean manipulation\nHelpers        →  common operations\nConcurrency    →  parallel work\n```\n\n<b>The goal is not to use every abstraction everywhere.</b> It is to know when Laravel's version makes the code clearer, and when plain PHP already did.\n\n---\n\n### 1. Basic — text that is not in the code\n\nA hard-coded string works until somebody wants a second language:\n\n```text\nEnglish   \"Welcome\"\nJapanese  \"ようこそ\"\nNepali    \"स्वागत छ\"\n```\n\nThe answer is not conditionals scattered through your views. It is to <b>take the text out of the code and look it up by key:</b>\n\n```text\nlang/\n├── en/messages.php\n├── ja/messages.php\n└── ne/messages.php\n```\n\n```php\n// lang/en/messages.php\nreturn ['welcome' => 'Welcome'];\n\n// lang/ja/messages.php\nreturn ['welcome' => 'ようこそ'];\n```\n\n```php\n__('messages.welcome');\n```\n\n```blade\n{{ __('messages.welcome') }}\n```\n\n```text\nmessages.welcome\n       ↓\nthe current locale\n       ↓\nthe translation\n```\n\n<b>Your code never asks which language it is.</b> That `if ($language === 'ja')` is the thing localization exists to delete.\n\n---\n\n### 2. Intermediate — parameters\n\nText with a value in it cannot be split up, because word order differs between languages:\n\n```php\n// ❌ 'Welcome, ' . $name\n```\n\nWhich is fine in English and wrong in a language that puts the name first. <b>Put the placeholder in the translation:</b>\n\n```php\n'welcome' => 'Welcome, :name',\n```\n\n```php\n__('messages.welcome', ['name' => $user->name]);\n```\n\n```text\nWelcome, Rajan\n```\n\nNow each translation owns its own word order, and the code passes values rather than sentence fragments.\n\n<b>That rule generalises: a translation is a whole sentence.</b> Concatenating two translated pieces produces something that reads correctly in the language you tested and awkwardly in the rest.\n\n---\n\n### 3. Advanced — the two file formats\n\nAlongside PHP files keyed by short names, Laravel supports JSON files keyed by the English text:\n\n```text\nlang/ja.json\n```\n\n```json\n{\n    \"Welcome\": \"ようこそ\",\n    \"Dashboard\": \"ダッシュボード\"\n}\n```\n\n```php\n__('Welcome');\n```\n\nSo the choice is what your keys are:\n\n```text\nPHP files                    JSON files\n─────────                    ──────────\n__('messages.welcome')       __('Welcome')\na key, in a namespace        the English text is the key\n\ngrouping and structure       nothing to invent\na missing translation is     a missing translation shows\n  visible as a raw key         readable English\nrenaming a key touches       changing the English text\n  every usage                  changes the key everywhere\n```\n\n<b>Neither is wrong.</b> JSON suits an application whose interface text is written in English and translated afterwards; PHP files suit one where the text is long, grouped or edited by people who are not developers.\n\nPick one per project. Using both is legal and makes \"where is this string\" a two-place question forever.\n\nOne practical note that catches everyone: <b>Blade escapes translated output</b>, exactly as it escapes everything else. A translation containing markup needs `{!! !!}` and therefore the Day 20 judgement about whether that content is trusted, which for a file in your own repository it usually is.\n\nFour more things worth having.\n\n<b>Laravel's own strings live in the vendor package</b>, so to change \"The :attribute field is required.\" you first copy them into your project:\n\n```bash\nphp artisan lang:publish\n```\n\nThat gives you `lang/en/validation.php`, which is where translated validation messages belong. It also has an `attributes` array for field names:\n\n```php\n'attributes' => [\n    'due_on' => 'due date',\n],\n```\n\n<b>Which fixes \"The due on field is required\"</b> in every message at once, rather than per rule.\n\n<b>`trans()` is an alias for `__()`</b>, and `trans_choice()` for the plural form. Identical behaviour; you will meet both in existing code.\n\nBlade has directive forms too:\n\n```blade\n@lang('messages.welcome')\n@choice('messages.invoices', $count)\n```\n\n<b>Prefer `{{ __('...') }}`</b>, because `@lang` does not escape its output, and a translation string containing HTML is a translation string somebody can edit.\n\nAnd a detail that saves a surprise: <b>placeholder capitalisation is part of the placeholder.</b>\n\n```text\n:name    rajan\n:Name    Rajan\n:NAME    RAJAN\n```\n\nSame value, capitalised to match how you wrote it, which is what makes a string work at the start of a sentence without a second key.\n\nOne performance note, in case you were worried: <b>translation files are loaded lazily</b>, only when a key from that file is first read. Twenty locales and fifty files cost nothing on a request that touches none of them.",
      diagram: `Three things, one idea

  Localization  →  multiple languages
  Collections   →  transform data
  Strings       →  clean manipulation
  Helpers       →  common operations
  Concurrency   →  parallel work

  The goal is not to use every abstraction everywhere.
  It is knowing when Laravel's version is clearer, and
  when plain PHP already was.


Text that is not in the code

  English   "Welcome"
  Japanese  "ようこそ"
  Nepali    "स्वागत छ"

  Not conditionals scattered through views. Take the
  text OUT of the code and look it up by key:

    lang/
    ├── en/messages.php
    ├── ja/messages.php
    └── ne/messages.php

    __('messages.welcome')
    {{ __('messages.welcome') }}

      messages.welcome → the current locale → the text

  Your code never asks which language it is. That
  if (\$language === 'ja') is what localization deletes.


Parameters

  ❌ 'Welcome, ' . \$name

  Fine in English. Wrong in a language that puts the
  name first.

    'welcome' => 'Welcome, :name',
    __('messages.welcome', ['name' => \$user->name])

  Each translation owns its own word order, and the code
  passes VALUES rather than sentence fragments.

  A translation is a WHOLE SENTENCE. Concatenating two
  translated pieces reads correctly in the language you
  tested and awkwardly in the rest.


Two file formats

  PHP files                   JSON files
  ─────────                   ──────────
  __('messages.welcome')      __('Welcome')
  a key, in a namespace       the English text IS the key

  grouping and structure      nothing to invent
  a missing translation       a missing translation
    shows a raw key             shows readable English
  renaming a key touches      changing the English text
    every usage                 changes the key everywhere

  Neither is wrong.

    JSON  an interface written in English, translated after
    PHP   long text, grouped, or edited by non-developers

  Pick one per project. Both is legal and makes "where
  is this string" a two-place question forever.


  Blade ESCAPES translated output, like everything else.
  A translation containing markup needs {!! !!} and the
  Day 20 judgement about trust — which for a file in
  your own repository it usually passes.`,
      codeExample: {
        title: "Language files and lookups",
        code: `<?php
// lang/en/messages.php

return [
    'welcome'  => 'Welcome',
    'greeting' => 'Welcome, :name',

    'invoice' => [
        'created'  => 'Invoice :number created.',
        'overdue'  => 'Invoice :number is overdue.',
    ],
];


<?php
// lang/ja/messages.php

return [
    'welcome'  => 'ようこそ',
    'greeting' => ':name さん、ようこそ',

    'invoice' => [
        'created'  => '請求書 :number を作成しました。',
        'overdue'  => '請求書 :number は期限切れです。',
    ],
];

// Notice the greeting: Japanese puts the name first.
// That is exactly why the placeholder lives in the
// translation rather than in a concatenation.


<?php
// ---------- Using them ----------

__('messages.welcome');

__('messages.greeting', ['name' => $user->name]);

// Nested keys use dots all the way down.
__('messages.invoice.created', ['number' => $invoice->number]);
?>

{{-- In Blade --}}
<h1>{{ __('messages.welcome') }}</h1>
<p>{{ __('messages.greeting', ['name' => $user->name]) }}</p>

{{-- Escaped, like everything else. A translation with
     markup needs {!! !!} and the Day 20 judgement. --}}
<p>{!! __('messages.terms_html') !!}</p>


<?php
// ---------- JSON translations ----------

// lang/ja.json
// {
//     "Welcome": "ようこそ",
//     "Dashboard": "ダッシュボード",
//     "Welcome, :name": ":name さん、ようこそ"
// }

__('Welcome');
__('Welcome, :name', ['name' => $user->name]);

// The English text is the key. A missing translation
// shows readable English rather than "messages.welcome".


<?php
// ---------- The rule that matters ----------

// ❌ Two translated fragments. Reads correctly in the
//    language you tested and awkwardly in the rest.
echo __('messages.you_have') . ' ' . $count . ' ' . __('messages.invoices');

// ✓ One sentence, with a placeholder.
echo __('messages.you_have_invoices', ['count' => $count]);

// A translation is a whole sentence. Word order is not
// yours to decide once there is a second language.`,
      },
      keyTakeaways: [
        "<b>Localization takes the text out of the code and looks it up by key</b>, so the code never asks which language it is.",
        "Language files live under `lang/{locale}/`, returning an array of keys and translations.",
        "<b>`__('messages.welcome')` resolves the key against the current locale</b>, and works the same in Blade.",
        "<b>Placeholders belong in the translation</b>, as `:name`, so each language owns its own word order.",
        "<b>A translation is a whole sentence</b>; concatenating translated fragments breaks in other languages.",
        "<b>JSON files key translations by the English text itself</b>, so `__('Welcome')` needs no key invented.",
        "<b>PHP files give grouping and structure; JSON gives readable fallback text</b> when a translation is missing.",
        "Pick one format per project, because using both makes finding a string a two-place question.",
        "<b>Blade escapes translated output</b>, so a translation containing markup needs `{!! !!}` and a trust judgement.",
      ],
      commonMistakes: [
        "<b>Branching on the language in your views.</b> That conditional is what localization exists to remove.",
        "<b>Concatenating a translated string with a value.</b> Word order differs, so the placeholder goes in the translation.",
        "<b>Joining two translated fragments into a sentence.</b> It reads correctly only in the language you tested.",
        "<b>Mixing PHP and JSON translations in one project.</b> Every string is then in one of two places.",
        "<b>Putting markup in a translation and forgetting it is escaped.</b> The tags appear as text.",
      ],
      quiz: [
        {
          question: "What does `__('messages.welcome')` do?",
          options: [
            "Returns the English text",
            "Looks the key up in the current locale's language file",
            "Sets the locale",
            "Escapes the string",
          ],
          correctIndex: 1,
          explanation: "Which is why the code never has to know which language is active.",
        },
        {
          question: "Why should a placeholder live in the translation rather than in a concatenation?",
          options: [
            "It is shorter",
            "Word order differs between languages, so each translation must own it",
            "Concatenation is slower",
            "Blade cannot concatenate",
          ],
          correctIndex: 1,
          explanation: "Japanese puts the name before the greeting; English does not.",
        },
        {
          question: "What is the practical difference between PHP and JSON translation files?",
          options: [
            "JSON is faster",
            "JSON uses the English text as the key, so a missing translation shows readable English",
            "PHP files cannot take parameters",
            "JSON supports more languages",
          ],
          correctIndex: 1,
          explanation: "PHP files give grouping and structure instead.",
        },
        {
          question: "What happens to a translation containing HTML in `{{ __('...') }}`?",
          options: [
            "It renders as HTML",
            "It is escaped and the tags appear as text",
            "Blade strips the tags",
            "It throws",
          ],
          correctIndex: 1,
          explanation: "Blade escapes translated output like any other output.",
        },
      ],
    },
    {
      id: "pluralization-and-locale",
      title: "Pluralization, setting & detecting the locale",
      durationMinutes: 11,
      explanation: "Counting things in more than one language, and deciding which language you are in.\n\n---\n\n### 1. Basic — plurals\n\n```text\n1 post\n5 posts\n```\n\nThe obvious version:\n\n```php\nif ($count === 1) { echo 'post'; } else { echo 'posts'; }\n```\n\nwhich works in English and stops working immediately. <b>Plural rules are a property of the language</b>, and they differ: some languages have one form, some have two, several have three or more, and the rules are not \"is it 1\".\n\nSo the count belongs in the translation:\n\n```php\n'posts' => '{0} No posts|{1} One post|[2,*] :count posts',\n```\n\n```php\ntrans_choice('messages.posts', $count, ['count' => $count]);\n```\n\n```text\n0  →  No posts\n1  →  One post\n5  →  5 posts\n```\n\n<b>The pipe separates forms and the prefix selects one</b>: exact values in braces, ranges in brackets. A translator for another language writes however many forms that language needs, without your code changing.\n\n`trans_choice()` is what you will see in existing applications, and worth recognising for that reason alone.\n\n---\n\n### 2. Intermediate — setting the locale\n\n```php\nApp::setLocale('ja');\n```\n\n```text\nsetLocale('ja')\n      ↓\ncurrent locale = ja\n      ↓\n__('messages.welcome')\n      ↓\nようこそ\n```\n\nIt applies to the current request only, which is exactly right: the locale is a property of who is asking, not of the application.\n\n<b>Which means it has to be set on every request</b>, and the natural place is middleware, before anything renders.\n\n---\n\n### 3. Advanced — deciding which locale\n\nSeveral sources, and they disagree:\n\n```text\nthe user's saved preference\nthe URL\nthe session\nthe Accept-Language header\nthe default\n```\n\n<b>The order matters more than the mechanism:</b>\n\n```text\n1. what the user explicitly chose\n2. the URL or an application setting\n3. the browser's preference\n4. the fallback\n```\n\nAnd the rule underneath: <b>an explicit choice beats a detected one.</b> Somebody who switched your site to English on a Japanese laptop chose English, and re-detecting Japanese on the next page is the application overruling them. It is a small thing that feels broken.\n\n<b>A fallback locale</b> catches what is missing:\n\n```text\nja\n ↓\nno translation for this key\n ↓\nen\n ↓\nthe English text\n```\n\nWithout it, an incomplete translation file shows raw keys, so a half-translated page reads `messages.invoice.overdue` where a sentence should be. With it, that line is in English and the page still makes sense.\n\nThree practical notes.\n\n<b>Putting the locale in the URL is worth it</b> if pages should be linkable and indexable per language. `/ja/invoices` can be shared and cached; a session-only locale cannot.\n\n<b>Locale is not only text.</b> Dates, numbers and currency have formats too, and a translated interface showing `09/01/2026` to a reader who expects `2026-09-01` is only half-localised.\n\n<b>And translation keys need finding.</b> `php artisan lang:missing`-style tooling, or a test that loads every key referenced in your views, is what stops a language file drifting behind the interface.\n\nReading the locale back, as well as setting it:\n\n```php\nApp::getLocale();          // 'ja'\nApp::isLocale('ja');       // true\nApp::currentLocale();\n```\n\n<b>`isLocale()` is the one for a conditional</b>, where a string comparison against `getLocale()` is what people write instead.\n\nAnd the defaults have env keys, not just config entries:\n\n```text\nAPP_LOCALE=en\nAPP_FALLBACK_LOCALE=en\nAPP_FAKER_LOCALE=en_GB\n```\n\n<b>The fallback is what saves a half-translated locale</b>: a key missing from `ja` falls back to `en` rather than rendering the raw key at somebody.",
      diagram: `Plurals

  1 post · 5 posts

  ❌ if (\$count === 1) 'post' else 'posts'

  Works in English. Stops working immediately.

  Plural rules are a property of the LANGUAGE: some have
  one form, some two, several three or more, and the
  rule is not "is it 1".

    'posts' => '{0} No posts|{1} One post|[2,*] :count posts'

    trans_choice('messages.posts', \$count, ['count' => \$count])

      0 → No posts
      1 → One post
      5 → 5 posts

  The pipe separates forms; the prefix selects one.
  Exact values in braces, ranges in brackets.

  A translator writes however many forms their language
  needs, with no change to your code.


Setting the locale

    App::setLocale('ja')
          ↓
    current locale = ja
          ↓
    __('messages.welcome')  →  ようこそ

  It applies to the CURRENT REQUEST, which is right:
  the locale belongs to who is asking, not to the
  application.

  So it must be set on every request — middleware,
  before anything renders.


Deciding which locale

  Sources, and they disagree:

    the user's saved preference
    the URL
    the session
    the Accept-Language header
    the default

  Order matters more than mechanism:

    1. what the user explicitly CHOSE
    2. the URL or an application setting
    3. the browser's preference
    4. the fallback

  An explicit choice beats a detected one. Somebody who
  switched to English on a Japanese laptop chose English.
  Re-detecting Japanese on the next page is the
  application overruling them, and it feels broken.


Fallback

    ja
     ↓
    no translation for this key
     ↓
    en
     ↓
    the English text

  Without it, an incomplete file shows raw keys, so a
  half-translated page reads messages.invoice.overdue
  where a sentence should be.


Three practical notes

  The locale in the URL is worth it if pages should be
  linkable and indexable per language. /ja/invoices can
  be shared and cached; a session-only locale cannot.

  Locale is not only TEXT. Dates, numbers and currency
  have formats too. A translated page showing 09/01/2026
  to someone expecting 2026-09-01 is half-localised.

  Translation keys need finding. Tooling, or a test that
  loads every key your views reference, is what stops a
  language file drifting behind the interface.`,
      codeExample: {
        title: "Plurals, and choosing a locale per request",
        code: `<?php
// ---------- Plurals ----------

// lang/en/messages.php
return [
    'posts'    => '{0} No posts|{1} One post|[2,*] :count posts',
    'invoices' => '{0} No invoices|{1} 1 invoice|[2,*] :count invoices',
];

// lang/ja/messages.php
return [
    // Japanese has one form. The translator decides that,
    // not your code.
    'posts' => ':count 件の投稿',
];


<?php
trans_choice('messages.posts', 0);   // No posts
trans_choice('messages.posts', 1);   // One post
trans_choice('messages.posts', 5, ['count' => 5]);   // 5 posts

// The pipe separates forms.
// {0} {1}   exact values
// [2,*]     a range


<?php
// ---------- Setting it, per request ----------

// app/Http/Middleware/SetLocale.php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\App;

class SetLocale
{
    public function handle(Request $request, Closure $next)
    {
        App::setLocale($this->resolve($request));

        return $next($request);
    }

    protected function resolve(Request $request): string
    {
        $supported = ['en', 'ja', 'ne'];

        // 1. What the user explicitly chose. An explicit
        //    choice beats a detected one, always.
        if ($locale = $request->user()?->locale) {
            return $locale;
        }

        // 2. The URL, or a session set by a language switcher.
        if (in_array($request->segment(1), $supported, true)) {
            return $request->segment(1);
        }

        if ($locale = $request->session()->get('locale')) {
            return $locale;
        }

        // 3. The browser's preference, whitelisted.
        if ($locale = $request->getPreferredLanguage($supported)) {
            return $locale;
        }

        // 4. The fallback.
        return config('app.fallback_locale');
    }
}


<?php
// config/app.php

'locale'          => 'en',
'fallback_locale' => 'en',

// Without a fallback, a half-translated page shows
// "messages.invoice.overdue" where a sentence should be.


<?php
// ---------- The language switcher ----------

Route::post('/locale', function (Request $request) {
    $request->validate([
        'locale' => ['required', 'in:en,ja,ne'],
    ]);

    // Save it against the user when there is one, so the
    // choice survives the next device.
    $request->user()?->update(['locale' => $request->locale]);

    $request->session()->put('locale', $request->locale);

    return back();
});


<?php
// ---------- Locale is not only text ----------

// A translated page showing dates in the wrong format is
// only half localised.
$invoice->created_at
    ->locale(app()->getLocale())
    ->isoFormat('LL');

Number::currency($invoice->total, in: 'JPY', locale: app()->getLocale());`,
      },
      keyTakeaways: [
        "<b>Plural rules are a property of the language</b>, and \"is it 1\" is only the English rule.",
        "<b>The count belongs in the translation</b>, with forms separated by pipes and selected by `{0}`, `{1}` or `[2,*]`.",
        "`trans_choice()` picks the right form, and appears throughout existing Laravel applications.",
        "<b>`App::setLocale()` applies to the current request</b>, because the locale belongs to who is asking.",
        "<b>It has to be set on every request</b>, which means middleware, before anything renders.",
        "<b>An explicit user choice beats a detected one</b>, always: re-detecting overrules somebody who already chose.",
        "The usual order is saved preference, then URL or session, then the browser, then the fallback.",
        "<b>A fallback locale stops a half-translated page showing raw keys</b>, which is what missing translations do.",
        "<b>Putting the locale in the URL makes pages linkable and cacheable per language.</b>",
        "<b>Locale is not only text</b>: dates, numbers and currency have formats too.",
      ],
      commonMistakes: [
        "<b>Branching on the count in PHP.</b> That encodes the English plural rule into your application.",
        "<b>Detecting the locale on every request and ignoring a saved preference.</b> The user's choice is silently overruled.",
        "<b>Trusting `Accept-Language` without a whitelist.</b> A header value should not select an arbitrary file.",
        "<b>Leaving the fallback locale unset.</b> A missing key renders as a raw key in the interface.",
        "<b>Translating the text and leaving dates in one format.</b> The page is half localised and looks it.",
      ],
      quiz: [
        {
          question: "Why not write `if ($count === 1)` for pluralization?",
          options: [
            "It is slower",
            "Plural rules differ by language, and \"is it 1\" is only the English rule",
            "Laravel forbids it",
            "It cannot be translated",
          ],
          correctIndex: 1,
          explanation: "Several languages have three or more forms.",
        },
        {
          question: "Where should the locale be set?",
          options: [
            "In `config/app.php` only",
            "Per request, usually in middleware, because it belongs to who is asking",
            "In the model",
            "At deploy time",
          ],
          correctIndex: 1,
          explanation: "`App::setLocale()` applies to the current request.",
        },
        {
          question: "Which source of locale should win?",
          options: [
            "The `Accept-Language` header",
            "The user's explicit choice",
            "The server default",
            "Whichever is checked first",
          ],
          correctIndex: 1,
          explanation: "Re-detecting overrules somebody who already told you.",
        },
        {
          question: "What does a fallback locale prevent?",
          options: [
            "A 500 error",
            "Missing translations rendering as raw keys in the interface",
            "The wrong date format",
            "An invalid locale being set",
          ],
          correctIndex: 1,
          explanation: "A half-translated page then reads in English rather than in keys.",
        },
      ],
    },
    {
      id: "collections-core",
      title: "Collections — map, filter, reduce & pluck",
      durationMinutes: 12,
      explanation: "You have used collections since Day 14. This is the part that changes how code reads.\n\n---\n\n### 1. Basic — a pipeline instead of a loop\n\n```php\n$users\n    ->filter(...)\n    ->map(...)\n    ->sortBy(...);\n```\n\n```text\nCollection → transform → filter → group → sort → result\n```\n\nEach step does one thing and hands the result to the next, so the shape of the transformation is visible without reading any bodies.\n\n<b>`map()` transforms every item:</b>\n\n```php\n$names = $users->map(fn ($user) => $user->name);\n```\n\n```text\nA → f(A)\nB → f(B)\nC → f(C)\n```\n\nSame number of items, different contents.\n\n<b>`filter()` keeps the ones that pass:</b>\n\n```php\n$active = $users->filter(fn ($user) => $user->active);\n```\n\n```text\nA ✓    A\nB ✗ →  C\nC ✓\nD ✗\n```\n\nFewer items, unchanged contents.\n\n<b>Those two together are most of what you will write</b>, and knowing which one you want is the entire skill: are you changing each item, or removing some?\n\n---\n\n### 2. Intermediate — reduce and pluck\n\n<b>`reduce()` collapses many values into one:</b>\n\n```php\n$total = $orders->reduce(fn ($total, $order) => $total + $order->amount, 0);\n```\n\n```text\n100 + 200 + 300  →  600\n```\n\nThe second argument is the starting value, and forgetting it is the usual bug: without it the first call receives `null`.\n\nFor a plain sum there is a shorter way, and it is clearer:\n\n```php\n$orders->sum('amount');\n```\n\n<b>Reach for `reduce()` when the result is not a number</b>: building a keyed structure, or folding items into an object.\n\n<b>`pluck()` extracts one field:</b>\n\n```php\n$names = $users->pluck('name');\n```\n\nagainst the version everybody writes first:\n\n```php\n$names = [];\nforeach ($users as $user) { $names[] = $user->name; }\n```\n\nSame output, and the first one says what it is doing. `pluck('name', 'id')` keys the result, which is how you build a lookup table in one line.\n\n---\n\n### 3. Advanced — the trap that matters\n\n<b>A collection method runs in PHP; a query method runs in the database.</b> Day 16 said this, and it is worth repeating because collections make it so easy to get wrong:\n\n```text\nUser::where('active', true)->get()      the database filters, 240 rows\nUser::all()->filter(...)               900 rows fetched, PHP discards 660\n```\n\nBoth give the same answer. <b>If the condition can be a `WHERE` clause, it belongs in the query.</b>\n\nThe same applies to `sum()`, `count()` and `groupBy()`: `withSum()` in the query beats summing a loaded collection every time.\n\nThree more things worth knowing.\n\n<b>Collections are immutable.</b> `filter()` returns a new collection and leaves the original alone, which is why a chain is safe and why forgetting to assign the result produces \"nothing happened\".\n\n<b>`filter()` preserves keys.</b> After filtering, the keys are `0, 2, 5`, and `json_encode` turns that into an object rather than an array. `->values()` is the fix, and the symptom is an API returning `{\"0\": …}` instead of `[…]`.\n\n<b>And a chain is not free.</b> Each step iterates the whole collection, so five steps over ten thousand items is fifty thousand iterations. Fine almost always, and worth knowing when it is not.",
      diagram: `A pipeline instead of a loop

  \$users->filter(...)->map(...)->sortBy(...)

    Collection → transform → filter → group → sort → result

  Each step does one thing and hands on the result, so
  the shape of the transformation is visible without
  reading any bodies.


  map()      transform every item

    A → f(A)          same number of items
    B → f(B)          different contents
    C → f(C)

  filter()   keep the ones that pass

    A ✓        A       fewer items
    B ✗   →    C       unchanged contents
    C ✓
    D ✗

  Those two are most of what you write, and the whole
  skill is knowing which you want: are you CHANGING each
  item, or REMOVING some?


reduce and pluck

  \$orders->reduce(fn (\$total, \$o) => \$total + \$o->amount, 0)

    100 + 200 + 300  →  600

  The second argument is the starting value. Forgetting
  it is the usual bug: the first call gets null.

  For a plain sum, ->sum('amount') is shorter and clearer.
  Reach for reduce() when the result is NOT a number:
  a keyed structure, or folding into an object.

  \$users->pluck('name')

    against the version everybody writes first:

      \$names = [];
      foreach (\$users as \$user) { \$names[] = \$user->name; }

  Same output. One of them says what it is doing.
  pluck('name', 'id') keys the result — a lookup table
  in one line.


The trap that matters

  A collection method runs in PHP.
  A query method runs in the DATABASE.

    User::where('active', true)->get()
        the database filters, 240 rows come back

    User::all()->filter(...)
        900 rows fetched, PHP discards 660

  Same answer. If the condition can be a WHERE clause,
  it belongs in the query. Same for sum, count and
  groupBy — withSum() beats summing a loaded collection.


Three more things

  Collections are IMMUTABLE. filter() returns a new one
  and leaves the original alone — which is why chains
  are safe, and why forgetting to assign the result
  looks like "nothing happened".

  filter() PRESERVES KEYS. Afterwards they are 0, 2, 5,
  and json_encode turns that into an object. ->values()
  is the fix. The symptom is an API returning
  {"0": …} instead of […].

  A chain is not free. Each step iterates the whole
  collection: five steps over ten thousand items is
  fifty thousand iterations. Fine almost always.`,
      codeExample: {
        title: "The four you will use most",
        code: `<?php

// ---------- map: change every item ----------

$names = $users->map(fn ($user) => $user->name);

$rows = $invoices->map(fn ($invoice) => [
    'number' => $invoice->number,
    'total'  => $invoice->total->format(),
]);


// ---------- filter: keep some ----------

$active = $users->filter(fn ($user) => $user->active);

// ⚠️ Keys are preserved: 0, 2, 5. json_encode makes that
//    an object. ->values() reindexes.
$active = $users->filter(fn ($user) => $user->active)->values();

// The higher-order form, when the test is a property:
$active = $users->filter->active;


// ---------- reduce: many into one ----------

$total = $orders->reduce(
    fn ($carry, $order) => $carry + $order->amount,
    0,          // ⚠️ without this, the first call gets null
);

// For a plain sum, this is shorter and clearer:
$total = $orders->sum('amount');

// reduce() earns its place when the result is not a number:
$byStatus = $invoices->reduce(function (array $carry, $invoice) {
    $carry[$invoice->status] ??= 0;
    $carry[$invoice->status] += $invoice->total;

    return $carry;
}, []);


// ---------- pluck: one field ----------

$names = $users->pluck('name');

// Keyed: a lookup table in one line.
$namesById = $users->pluck('name', 'id');
// [1 => 'Rajan', 2 => 'Alice']

// Nested with dots.
$countries = $users->pluck('profile.country');


<?php
// ---------- The trap ----------

// ❌ 900 rows fetched, and PHP throws 660 away.
User::all()->filter(fn ($user) => $user->active);

// ✓ The database filters. 240 rows come back.
User::where('active', true)->get();

// ❌ Every invoice loaded to add up one column.
Invoice::all()->sum('total');

// ✓ One query, one number.
Invoice::sum('total');

// ✓ And per customer, without loading any invoices:
Customer::withSum('invoices', 'total')->get();


<?php
// ---------- Immutability ----------

$users->filter(fn ($user) => $user->active);

// $users is unchanged. This line did nothing.

$active = $users->filter(fn ($user) => $user->active);

// Which is also why a chain is safe: no step mutates
// what came before it.`,
      },
      keyTakeaways: [
        "<b>A collection chain shows the shape of a transformation</b> without you reading the bodies.",
        "<b>`map()` changes every item and keeps the count; `filter()` keeps some and leaves them unchanged.</b>",
        "Knowing which of those two you want is most of the skill.",
        "<b>`reduce()` collapses many values into one</b>, and its second argument is the starting value.",
        "For a plain sum, `sum()` is shorter and clearer; `reduce()` earns its place when the result is a structure.",
        "<b>`pluck()` extracts one field</b>, and `pluck('name', 'id')` builds a keyed lookup in a line.",
        "<b>A collection method runs in PHP; a query method runs in the database.</b>",
        "<b>If a condition can be a `WHERE` clause, it belongs in the query</b>, and the same goes for sums and counts.",
        "<b>Collections are immutable</b>, so forgetting to assign the result looks like nothing happened.",
        "<b>`filter()` preserves keys</b>, which turns a JSON array into an object; `values()` is the fix.",
      ],
      commonMistakes: [
        "<b>Calling `all()` and filtering in PHP.</b> Every row is fetched and most are discarded.",
        "<b>Omitting `reduce()`'s initial value.</b> The first iteration receives `null` and the arithmetic breaks.",
        "<b>Forgetting `values()` after `filter()`.</b> The JSON response becomes an object keyed by index.",
        "<b>Not assigning the result of a chain.</b> Collections are immutable, so the original is untouched.",
        "<b>Using `reduce()` for a sum.</b> `sum()` says the same thing in one word.",
      ],
      quiz: [
        {
          question: "What is the difference between `map()` and `filter()`?",
          options: [
            "None",
            "`map()` changes every item; `filter()` removes some and leaves the rest unchanged",
            "`filter()` is faster",
            "`map()` returns an array",
          ],
          correctIndex: 1,
          explanation: "Changing each item, or removing some: that is the question.",
        },
        {
          question: "What is wrong with `User::all()->filter(fn ($u) => $u->active)`?",
          options: [
            "Nothing",
            "Every row is fetched and PHP discards most of them; the database should filter",
            "`filter()` does not work on models",
            "It returns an array",
          ],
          correctIndex: 1,
          explanation: "If the condition can be a `WHERE` clause, it belongs in the query.",
        },
        {
          question: "Why does a filtered collection sometimes serialise as a JSON object?",
          options: [
            "A cast is missing",
            "`filter()` preserves keys, so the indexes are no longer sequential",
            "Collections always serialise as objects",
            "It is a bug",
          ],
          correctIndex: 1,
          explanation: "`->values()` reindexes and restores the array shape.",
        },
        {
          question: "What does `reduce()`'s second argument do?",
          options: [
            "Sets the key",
            "Provides the starting value, without which the first call receives `null`",
            "Limits the iterations",
            "Chooses the field",
          ],
          correctIndex: 1,
          explanation: "Forgetting it is the usual `reduce()` bug.",
        },
      ],
    },
    {
      id: "grouping-and-higher-order",
      title: "groupBy, sortBy, each, when & higher-order messages",
      durationMinutes: 11,
      explanation: "The methods that turn a list into a report, and the syntax that makes short chains readable.\n\n---\n\n### 1. Basic — grouping and sorting\n\n<b>`groupBy()` turns a flat list into a keyed structure:</b>\n\n```php\n$groups = $users->groupBy('department');\n```\n\n```text\nengineering\n ├── User A\n └── User C\n\nsales\n └── User B\n```\n\nWhich is the shape every report wants: totals per customer, invoices per month, orders per status. And it takes a closure when the key is derived rather than a column:\n\n```php\n$users->groupBy(fn ($user) => $user->created_at->format('Y-m'));\n```\n\n<b>`sortBy()` sorts by a field or a computed value:</b>\n\n```php\n$users->sortBy('name');\n$users->sortBy(fn ($user) => $user->created_at);\n$users->sortByDesc('created_at');\n```\n\nAnd the reminder from the last lesson: <b>sorting and grouping in the database is usually better</b>, because `orderBy()` uses an index and `sortBy()` reads every row first. Sort in PHP when the value is not a column, and in the query when it is.\n\n---\n\n### 2. Intermediate — `each()` and `when()`\n\n```php\n$users->each(fn ($user) => $user->notify(...));\n```\n\n<b>`each()` is for side effects</b>, and that is the whole distinction:\n\n```text\nmap()   transform data, return something new\neach()  do something, return nothing useful\n```\n\nUsing `each()` to build a result, by pushing into an outer array, is a `map()` written the long way. And using `map()` for a side effect works and misleads the reader, because a `map()` implies its result is the point.\n\n<b>`when()` applies part of a chain conditionally:</b>\n\n```php\n$posts->when($search, fn ($posts) => $posts->filter(...));\n```\n\n```text\ncondition?\n ├── true  → run the callback\n └── false → carry on unchanged\n```\n\nThe same shape as Day 13's query `when()`, and for the same reason: it keeps an optional step inside the chain rather than breaking it with an `if`.\n\n---\n\n### 3. Advanced — higher-order messages\n\n```php\n$users->each->notify();\n```\n\ninstead of:\n\n```php\n$users->each(fn ($user) => $user->notify());\n```\n\n<b>The collection forwards the call to every item.</b> It works on `each`, `map`, `filter`, `sum`, `sortBy` and several others:\n\n```text\n$users->filter->active\n$invoices->sum->total\n$posts->map->title\n$users->each->notify()\n```\n\nAnd `$users->filter->active` is the line worth looking at, because of what it says:\n\n```text\nforeach ($users as $user) {\n    if ($user->active) { ... }\n}\n```\n\ndescribes the mechanism. `$users->filter->active` describes the intention: <b>give me the active users.</b>\n\nThat is the actual point of this whole lesson. <b>Code that says what you want beats code that says how to get it</b>, and the closure version sits in between.\n\nTwo cautions, because this is easy to overdo.\n\n<b>It only works for a bare property or a no-argument method.</b> Anything else needs the closure, and half a chain in higher-order form with the rest in closures reads worse than either.\n\n<b>And a chain is not automatically clearer than a loop.</b> A five-step chain with three closures spanning twenty lines is harder to follow than the `foreach` it replaced. Use a chain when the pipeline is the point, and a loop when the control flow is.",
      diagram: `Grouping and sorting

  \$users->groupBy('department')

    engineering            The shape every report wants:
     ├── User A            totals per customer, invoices
     └── User C            per month, orders per status
    sales
     └── User B

  With a closure, when the key is derived:

    groupBy(fn (\$u) => \$u->created_at->format('Y-m'))

  \$users->sortBy('name')
  \$users->sortBy(fn (\$u) => \$u->created_at)
  \$users->sortByDesc('created_at')

  ⚠️  Sorting and grouping in the DATABASE is usually
      better: orderBy() uses an index, sortBy() reads
      every row first.

      Sort in PHP when the value is not a column.


each() and when()

  \$users->each(fn (\$user) => \$user->notify(...))

    map()   transform data, return something new
    each()  do something, return nothing useful

  Using each() to build a result by pushing into an
  outer array is a map() written the long way.
  Using map() for a side effect works and misleads:
  a map() implies its result is the point.

  \$posts->when(\$search, fn (\$posts) => \$posts->filter(...))

    condition?
     ├── true  → run the callback
     └── false → carry on unchanged

  Same shape as Day 13's query when(), for the same
  reason: an optional step stays inside the chain.


Higher-order messages

  \$users->each->notify()

  instead of

  \$users->each(fn (\$user) => \$user->notify())

  The collection forwards the call to every item:

    \$users->filter->active
    \$invoices->sum->total
    \$posts->map->title
    \$users->each->notify()


  And this is the line worth looking at:

    foreach (\$users as \$user) {
        if (\$user->active) { ... }
    }
        describes the MECHANISM

    \$users->filter->active
        describes the INTENTION: give me the active users

  Which is the point of the whole lesson. Code that says
  what you WANT beats code that says how to get it. The
  closure version sits in between.


Two cautions

  It only works for a bare property or a no-argument
  method. Anything else needs the closure, and half a
  chain in each style reads worse than either.

  A chain is not automatically clearer than a loop. Five
  steps with three closures over twenty lines is harder
  to follow than the foreach it replaced.

    the pipeline is the point   → a chain
    the control flow is         → a loop`,
      codeExample: {
        title: "Reports, conditionals and intention",
        code: `<?php

// ---------- Grouping: the shape of a report ----------

$byDepartment = $users->groupBy('department');

// engineering => [User A, User C]
// sales       => [User B]

// A derived key.
$byMonth = $invoices->groupBy(
    fn ($invoice) => $invoice->created_at->format('Y-m')
);

// Grouped, then summarised.
$totals = $invoices
    ->groupBy('customer_id')
    ->map(fn ($group) => $group->sum('total'));


// ---------- Sorting ----------

$users->sortBy('name');
$users->sortByDesc('created_at');
$users->sortBy(fn ($user) => $user->invoices->count());

// ⚠️ The last one loads every user's invoices. In the
//    query it is one line and no N+1:
User::withCount('invoices')->orderByDesc('invoices_count')->get();


// ---------- each: for side effects ----------

$users->each(fn ($user) => $user->notify(new InvoiceOverdue()));

// ❌ each() building a result is a map() written long.
$names = [];
$users->each(function ($user) use (&$names) {
    $names[] = $user->name;
});

// ✓
$names = $users->map(fn ($user) => $user->name);


// ---------- when: an optional step in the chain ----------

$results = $posts
    ->when($search, fn ($posts) => $posts->filter(
        fn ($post) => str_contains($post->title, $search)
    ))
    ->when($status, fn ($posts) => $posts->where('status', $status))
    ->sortByDesc('created_at')
    ->values();

// Without when(), that is three ifs and a broken chain.


<?php
// ---------- Higher-order messages ----------

$users->filter->active;          // filter(fn ($u) => $u->active)
$invoices->sum->total;           // sum(fn ($i) => $i->total)
$posts->map->title;              // map(fn ($p) => $p->title)
$users->each->notify();          // each(fn ($u) => $u->notify())

// The comparison worth keeping:

foreach ($users as $user) {
    if ($user->active) {
        // ...
    }
}
// says HOW

$users->filter->active;
// says WHAT: give me the active users


// ⚠️ Only for a bare property or a no-argument method.
//    Anything else needs the closure:
$users->filter(fn ($user) => $user->created_at->isToday());


<?php
// ---------- When a loop is better ----------

// ❌ A chain that is not a pipeline.
$results = $rows
    ->map(function ($row) use (&$errors, $importer) {
        try {
            return $importer->parse($row);
        } catch (ParseException $e) {
            $errors[] = $e->getMessage();
            return null;
        }
    })
    ->filter()
    ->values();

// ✓ Control flow, side effects and early exits: a loop
//   says this more clearly, and there is no prize for
//   fewer lines.
foreach ($rows as $row) {
    try {
        $parsed[] = $importer->parse($row);
    } catch (ParseException $e) {
        $errors[] = $e->getMessage();
        continue;
    }
}`,
      },
      keyTakeaways: [
        "<b>`groupBy()` turns a flat list into the keyed shape every report wants</b>, and takes a closure for derived keys.",
        "<b>`sortBy()` sorts by a field or a computed value</b>, and `sortByDesc()` reverses it.",
        "<b>Sorting and grouping in the query is usually better</b>, because the database has indexes and reads fewer rows.",
        "<b>`each()` is for side effects and `map()` is for transformation</b>, and using one for the other misleads the reader.",
        "Building a result by pushing into an outer array from `each()` is a `map()` written the long way.",
        "<b>`when()` applies part of a chain conditionally</b>, keeping an optional step inside the pipeline.",
        "<b>Higher-order messages forward a call to every item</b>: `$users->filter->active`, `$invoices->sum->total`.",
        "<b>`$users->filter->active` states the intention where a `foreach` states the mechanism.</b>",
        "They only work for a bare property or a no-argument method; anything else needs a closure.",
        "<b>A chain is not automatically clearer than a loop</b>: use a chain when the pipeline is the point.",
      ],
      commonMistakes: [
        "<b>Sorting a loaded collection when the database could order it.</b> Every row is read before sorting.",
        "<b>Using `each()` with a reference to build an array.</b> That is `map()`, spelled awkwardly.",
        "<b>Using `map()` purely for a side effect.</b> The reader expects the result to matter.",
        "<b>Mixing higher-order and closure forms in one chain.</b> It reads worse than either style alone.",
        "<b>Forcing complex control flow into a chain.</b> Early exits and error collection belong in a loop.",
      ],
      quiz: [
        {
          question: "What is the difference between `map()` and `each()`?",
          options: [
            "None",
            "`map()` transforms and returns a new collection; `each()` performs a side effect",
            "`each()` is faster",
            "`map()` cannot use closures",
          ],
          correctIndex: 1,
          explanation: "Using one for the other works and misleads the next reader.",
        },
        {
          question: "What does `$users->filter->active` do?",
          options: [
            "Sorts by the active field",
            "Filters to items whose `active` property is truthy",
            "Sets `active` on each user",
            "Counts the active users",
          ],
          correctIndex: 1,
          explanation: "A higher-order message: the collection forwards the property access.",
        },
        {
          question: "Why is `$users->sortBy(fn ($u) => $u->invoices->count())` risky?",
          options: [
            "`sortBy` cannot take a closure",
            "It loads every user's invoices, which is an N+1 the query could avoid",
            "It returns an array",
            "It mutates the collection",
          ],
          correctIndex: 1,
          explanation: "`withCount()` and `orderByDesc()` do it in one query.",
        },
        {
          question: "When is a `foreach` better than a collection chain?",
          options: [
            "Never",
            "When there is real control flow: early exits, error collection, several side effects",
            "When the collection is large",
            "When the items are models",
          ],
          correctIndex: 1,
          explanation: "There is no prize for fewer lines; readable code wins.",
        },
      ],
    },
    {
      id: "lazy-collections-and-macros",
      title: "Lazy collections, reduceInto & macros",
      durationMinutes: 11,
      explanation: "Collections when the data does not fit, and collections you extend yourself.\n\n---\n\n### 1. Basic — the memory problem\n\nA collection holds every item:\n\n```text\n10 million rows\n       ↓\nCollection\n       ↓\nRAM 💥\n```\n\n<b>A <i>lazy collection</i></b> produces values one at a time instead:\n\n```text\nDatabase\n ↓\nrow 1 → process\nrow 2 → process\nrow 3 → process\n...\n```\n\nWhich is Day 13's `cursor()` and `lazy()`, and the same rule: <b>memory use should not depend on the number of rows.</b>\n\n```php\nUser::lazy()->each(fn ($user) => $user->recalculate());\n\nLazyCollection::make(function () {\n    // yield values\n});\n```\n\nAnd the chain still works:\n\n```php\n->map(...)->filter(...)->each(...)\n```\n\nThe difference is that nothing runs until something asks for a value, and then only enough of it to produce that value.\n\nWhat it is for:\n\n```text\nlarge imports · exports · log files\ndata migrations · ETL jobs\n```\n\nAnything where the input is bigger than memory, or where you do not know how big it is.\n\n---\n\n### 2. Intermediate — `reduceInto()`\n\n`reduce()` carries a value along. When the accumulator is an object you are building up, <b>`reduceInto()` makes that explicit:</b>\n\n```php\n$report = $items->reduceInto(new Report(), function ($report, $item) {\n    $report->add($item);\n\n    return $report;\n});\n```\n\n```text\nitems\n ↓\nReport object\n ↓\nmutate the accumulator\n ↓\nReport object\n```\n\nThe initial value comes first, which reads better when it is a real object with a name, and it makes the type of the result obvious.\n\nUseful when the output is a structure rather than a number:\n\n```text\nDTOs · reports · aggregated objects\ncustom result structures\n```\n\nWhen the result is a total, `sum()` still wins.\n\n---\n\n### 3. Advanced — macros\n\nYou can add your own collection methods:\n\n```php\nCollection::macro('active', function () {\n    return $this->filter(fn ($item) => $item->active);\n});\n```\n\n```php\n$users->active();\n```\n\n<b>You have extended the collection API for the whole application</b>, which is genuinely powerful and genuinely easy to misuse.\n\nThe test is whether the name means something in your domain:\n\n```text\na good macro                  a bad macro\n────────────                  ───────────\na reusable domain concept     a shortcut nobody knows\n\n->overdue()                   ->firstTwoUppercased()\n->totalExcludingTax()         ->doTheThing()\n->activeThisMonth()\n```\n\n<b>The cost of a macro is discoverability.</b> Every Laravel developer knows what `filter()` does; nobody knows what `->flatten2()` does, and it is defined in a service provider they have no reason to open. A macro that saves one line and costs a search is a bad trade.\n\nSo the guidance:\n\n```text\nused in several places, and named after\nsomething your domain actually calls it      →  a macro\n\nused once, or a mechanical shortcut          →  leave it inline\n```\n\nAnd the alternative worth remembering from Day 16: <b>a custom collection class</b> gives the same methods to one model's collections only, which is often what you actually wanted. `Invoice::all()->totalOutstanding()` is discoverable, because it lives on `InvoiceCollection`; a global macro is not.\n\nRegister macros in a service provider, and only ever from your own code: a macro defined in a package that collides with a Laravel method is a debugging afternoon nobody enjoys.",
      diagram: `The memory problem

    10 million rows → Collection → RAM 💥

  A lazy collection produces values one at a time:

    Database
     ↓
    row 1 → process
    row 2 → process
    row 3 → process
    ...

  Which is Day 13's cursor() and lazy(), and the same
  rule: memory use should not depend on the number
  of rows.

    User::lazy()->each(...)
    LazyCollection::make(function () { /* yield */ })

  The chain still works. The difference is that nothing
  runs until something asks for a value, and then only
  enough to produce it.

  For: large imports · exports · log files
       data migrations · ETL jobs

  Anything bigger than memory, or of unknown size.


reduceInto

  reduce() carries a value along. When the accumulator
  is an object you are building, reduceInto() makes
  that explicit:

    \$items->reduceInto(new Report(), function (\$report, \$item) {
        \$report->add(\$item);
        return \$report;
    });

    items → Report object → mutate → Report object

  The initial value comes FIRST, which reads better when
  it is a real object with a name, and makes the result
  type obvious.

  For: DTOs · reports · aggregated objects
       custom result structures

  When the result is a total, sum() still wins.


Macros

  Collection::macro('active', function () {
      return \$this->filter(fn (\$item) => \$item->active);
  });

  \$users->active();

  You have extended the collection API for the whole
  application. Powerful, and easy to misuse.

  a good macro                  a bad macro
  ────────────                  ───────────
  a reusable DOMAIN concept     a shortcut nobody knows

  ->overdue()                   ->firstTwoUppercased()
  ->totalExcludingTax()         ->doTheThing()
  ->activeThisMonth()

  The cost is DISCOVERABILITY. Every Laravel developer
  knows filter(). Nobody knows ->flatten2(), and it is
  defined in a service provider they have no reason to
  open. Saving one line and costing a search is a bad
  trade.

    several places, named after something your
    domain actually calls it        →  a macro
    used once, or mechanical        →  leave it inline


  And the alternative from Day 16: a CUSTOM COLLECTION
  CLASS gives those methods to one model only, which is
  often what you wanted.

    Invoice::all()->totalOutstanding()

  is discoverable — it lives on InvoiceCollection.
  A global macro is not.

  Register macros in a service provider, from your own
  code only. A package macro colliding with a Laravel
  method is a debugging afternoon.`,
      codeExample: {
        title: "Streaming, folding and extending",
        code: `<?php

use Illuminate\\Support\\Collection;
use Illuminate\\Support\\LazyCollection;

// ---------- Lazy: memory does not grow with the rows ----------

// ❌ Ten million models in memory.
User::all()->each(fn ($user) => $user->recalculate());

// ✓ One at a time.
User::lazy()->each(fn ($user) => $user->recalculate());

// And the chain still reads the same.
User::lazy()
    ->filter(fn ($user) => $user->needs_sync)
    ->map(fn ($user) => $user->toSyncPayload())
    ->each(fn ($payload) => $this->push($payload));

// Nothing runs until something asks for a value, and
// then only enough to produce it.


// ---------- A lazy collection from anything ----------

// A log file of unknown size, read line by line.
$lines = LazyCollection::make(function () {
    $handle = fopen(storage_path('logs/laravel.log'), 'r');

    while (($line = fgets($handle)) !== false) {
        yield $line;
    }

    fclose($handle);
});

$errors = $lines
    ->filter(fn ($line) => str_contains($line, 'ERROR'))
    ->take(100)          // stops reading after 100
    ->values();

// take() is where lazy pays off: the file is not read
// past the hundredth error.


<?php
// ---------- reduceInto: the accumulator is an object ----------

$report = $invoices->reduceInto(
    new MonthlyReport(),
    function (MonthlyReport $report, Invoice $invoice) {
        $report->add($invoice);

        return $report;
    },
);

// The initial value first, so the result's type is
// obvious at a glance.

// For a plain total, this still wins:
$total = $invoices->sum('total');


<?php
// ---------- Macros ----------

// app/Providers/AppServiceProvider.php

public function boot(): void
{
    // ✓ A domain concept, used in several places.
    Collection::macro('overdue', function () {
        return $this->filter(fn ($invoice) => $invoice->isOverdue());
    });

    // ❌ A mechanical shortcut nobody will find.
    Collection::macro('f2u', function () {
        return $this->take(2)->map(fn ($s) => strtoupper($s));
    });
}

$invoices->overdue();


<?php
// ---------- Often better: a custom collection class ----------

// Day 16: the methods belong to one model's collections,
// and live somewhere a reader can find them.

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Collection;

class InvoiceCollection extends Collection
{
    public function overdue(): static
    {
        return $this->filter(fn ($invoice) => $invoice->isOverdue());
    }

    public function totalOutstanding(): int
    {
        return $this->reject->is_paid->sum('total');
    }
}

class Invoice extends Model
{
    public function newCollection(array $models = []): InvoiceCollection
    {
        return new InvoiceCollection($models);
    }
}

// Invoice::all()->totalOutstanding()
//
// Discoverable: it is on InvoiceCollection, next to the
// model. A global macro is not.`,
      },
      keyTakeaways: [
        "<b>A collection holds every item, so a large result set exhausts memory.</b>",
        "<b>A lazy collection produces values one at a time</b>, so memory does not grow with the number of rows.",
        "`User::lazy()` and `LazyCollection::make()` both work with the normal chain methods.",
        "<b>Nothing runs until a value is asked for</b>, which is why `take()` can stop the work early.",
        "It suits large imports, exports, log files, migrations and anything of unknown size.",
        "<b>`reduceInto()` puts the accumulator first</b>, which reads better when it is an object you are building.",
        "Use it for reports, DTOs and structures; for a total, `sum()` still wins.",
        "<b>A macro adds a method to every collection in the application.</b>",
        "<b>The cost of a macro is discoverability</b>: nobody knows it exists, and it lives in a provider they will not open.",
        "<b>Write a macro for a named domain concept used in several places</b>, and leave a mechanical shortcut inline.",
        "<b>A custom collection class is often what you wanted</b>, because the methods live next to the model that uses them.",
      ],
      commonMistakes: [
        "<b>Loading a huge table into a collection.</b> Memory scales with rows, and `lazy()` is one word away.",
        "<b>Chaining after `get()` on a large query.</b> The rows are already in memory; `lazy()` had to come first.",
        "<b>Writing a macro for a one-line shortcut.</b> It saves a line and costs the next reader a search.",
        "<b>Defining macros for another team's convenience.</b> Undiscoverable methods are worse than repeated code.",
        "<b>Using `reduceInto()` for a sum.</b> `sum()` says it in one word.",
      ],
      quiz: [
        {
          question: "What problem does a lazy collection solve?",
          options: [
            "Slow queries",
            "Holding every item in memory, which fails on a large result set",
            "Missing eager loads",
            "Duplicate values",
          ],
          correctIndex: 1,
          explanation: "Values are produced one at a time, so memory does not grow with the rows.",
        },
        {
          question: "Why can `take(100)` on a lazy collection stop early?",
          options: [
            "It caches",
            "Nothing runs until a value is asked for, so the source stops being read",
            "It runs a LIMIT query",
            "It cannot stop early",
          ],
          correctIndex: 1,
          explanation: "Which is what makes it work on a file of unknown size.",
        },
        {
          question: "What does `reduceInto()` make clearer than `reduce()`?",
          options: [
            "The iteration order",
            "That the accumulator is a specific object, because it comes first",
            "The performance",
            "The item type",
          ],
          correctIndex: 1,
          explanation: "Useful when the result is a report or a DTO rather than a number.",
        },
        {
          question: "What is the main cost of a collection macro?",
          options: [
            "Performance",
            "Discoverability: nobody knows it exists, and it is defined in a provider they will not open",
            "Memory",
            "It breaks type hints",
          ],
          correctIndex: 1,
          explanation: "A custom collection class keeps the methods next to the model.",
        },
      ],
    },
    {
      id: "strings",
      title: "Strings — Str and Str::of()",
      durationMinutes: 9,
      explanation: "PHP's string functions are a museum of inconsistent argument orders. `Str` is the tidy layer over them.\n\n---\n\n### 1. Basic — the operations you keep needing\n\n```php\nStr::slug('Laravel Eloquent');   // laravel-eloquent\n```\n\nAnd the rest of the set:\n\n```text\nStr::limit()        truncate, with an ellipsis\nStr::contains()     is this in there?\nStr::startsWith()   Str::endsWith()\nStr::replace()\nStr::before()       Str::after()\nStr::headline()     Str::title()\nStr::camel()        Str::snake()      Str::studly()\nStr::random()       Str::uuid()\nStr::mask()\n```\n\n<b>The value is not that these are impossible in plain PHP.</b> It is that `Str::before($email, '@')` says what it does, where `substr($email, 0, strpos($email, '@'))` says how, and gets the argument order wrong once in every codebase.\n\nTwo worth knowing specifically. <b>`Str::slug()` is what turns a title into a URL segment</b>, handling accents and punctuation you would otherwise discover one bug at a time. And <b>`Str::mask()` is for showing a card number or an email partially</b>, which otherwise becomes a hand-written `substr` with an off-by-one.\n\n---\n\n### 2. Intermediate — the fluent form\n\nNested calls read inside out:\n\n```php\nStr::lower(Str::slug($title));\n```\n\nYou read `Str::lower`, then have to find the innermost call to know what happens first. <b>`Str::of()` reverses that:</b>\n\n```php\nStr::of($title)->trim()->lower()->slug();\n```\n\n```text\ninput → trim → lower → slug → result\n```\n\nTop to bottom, in the order it happens. On two operations it barely matters; on five it is the difference between reading it and decoding it.\n\nAnd it ends in whatever you need:\n\n```php\nStr::of($name)->trim()->title()->toString();\n$slug = (string) Str::of($title)->slug();\n```\n\n---\n\n### 3. Advanced — where this fits, and where it does not\n\n<b>`Str` is a convenience, not a validator.</b> `Str::contains($url, 'example.com')` is true for `evil.com/?x=example.com`, and using it as a security check is how a filter gets bypassed. Day 20's rule stands: parse the thing properly, or whitelist.\n\nThe fluent form is also useful in a chain of transformations you might otherwise scatter:\n\n```php\n$reference = Str::of($customer->name)\n    ->ascii()\n    ->upper()\n    ->replaceMatches('/[^A-Z]/', '')\n    ->limit(3, '')\n    ->append('-', $invoice->id);\n```\n\nAll of which could be four statements and three temporary variables. <b>The chain is worth it when the steps have no meaning individually</b>, which is the same test as a collection pipeline.\n\nThree practical notes.\n\n<b>`Str::of()` returns a `Stringable`, not a string.</b> Most places accept it because it casts, and a strict type hint will not. Call `->toString()` when the boundary is strict.\n\n<b>Multibyte is handled.</b> `Str::limit()` and `Str::upper()` do not cut a character in half the way `substr()` and `strtoupper()` can, which matters the first time a Japanese or Nepali name goes through them, and connects directly to the localization at the start of today.\n\n<b>And `Str::random()` is not for anything secret.</b> For a token or a password reset value, use the framework's cryptographic helpers rather than a random string, exactly as Day 18 described.",
      diagram: `The operations you keep needing

  Str::slug('Laravel Eloquent')   →  laravel-eloquent

    Str::limit()       truncate, with an ellipsis
    Str::contains()    startsWith()   endsWith()
    Str::replace()     before()       after()
    Str::headline()    title()
    Str::camel()       snake()        studly()
    Str::random()      uuid()         mask()

  The value is not that these are impossible in PHP.
  It is that

    Str::before(\$email, '@')

  says WHAT it does, where

    substr(\$email, 0, strpos(\$email, '@'))

  says HOW, and gets the argument order wrong once in
  every codebase.

  Two specifically: slug() turns a title into a URL
  segment, handling accents and punctuation you would
  otherwise find one bug at a time. mask() shows a card
  number or an email partially, without a hand-written
  substr and an off-by-one.


The fluent form

  Str::lower(Str::slug(\$title))

  reads inside out: you read lower, then hunt for the
  innermost call to know what happens first.

  Str::of(\$title)->trim()->lower()->slug()

    input → trim → lower → slug → result

  Top to bottom, in the order it happens. On two
  operations it barely matters. On five it is the
  difference between reading and decoding.

  Ends in what you need:
    ->toString()      or      (string) Str::of(...)


Where it fits, and where it does not

  ⚠️  Str is a CONVENIENCE, not a validator.

      Str::contains(\$url, 'example.com')

      is true for evil.com/?x=example.com. Using it as
      a security check is how a filter gets bypassed.
      Parse it properly, or whitelist. Day 20 stands.

  The chain is worth it when the steps have no meaning
  individually — the same test as a collection pipeline.
  Four statements and three temporary variables, or one
  chain that reads in order.


Three practical notes

  Str::of() returns a Stringable, not a string. Most
  places accept it because it casts; a strict type hint
  will not. ->toString() at a strict boundary.

  Multibyte is handled. limit() and upper() do not cut
  a character in half the way substr() and strtoupper()
  can — which matters the first time a Japanese or
  Nepali name goes through, and connects straight back
  to this morning's localization.

  Str::random() is not for anything secret. Tokens and
  reset values use the framework's cryptographic
  helpers, exactly as Day 18 described.`,
      codeExample: {
        title: "Str, and when to chain",
        code: `<?php

use Illuminate\\Support\\Str;

// ---------- The set you will actually use ----------

Str::slug('Laravel Eloquent');              // laravel-eloquent
Str::limit($post->body, 150);               // truncated with …
Str::before($email, '@');                   // the local part
Str::after($path, 'invoices/');
Str::contains($title, 'Laravel');
Str::startsWith($path, 'admin/');
Str::headline('invoice_line_items');        // Invoice Line Items
Str::snake('invoiceLineItems');             // invoice_line_items
Str::camel('invoice_line_items');           // invoiceLineItems
Str::mask($card, '*', 0, -4);               // ************4242
Str::uuid();

// Says what it does:
Str::before($email, '@');

// Says how, and has the argument order wrong somewhere
// in every codebase:
substr($email, 0, strpos($email, '@'));


// ---------- The fluent form ----------

// ❌ Reads inside out.
$slug = Str::lower(Str::slug(trim($title)));

// ✓ Reads in the order it happens.
$slug = Str::of($title)->trim()->lower()->slug();

// input → trim → lower → slug → result


// A chain earns its place when the steps mean nothing
// on their own:
$reference = Str::of($customer->name)
    ->ascii()
    ->upper()
    ->replaceMatches('/[^A-Z]/', '')
    ->limit(3, '')
    ->append('-' . $invoice->id)
    ->toString();

// RAJ-1042
//
// The alternative is four statements and three
// temporary variables that each need a name.


<?php
// ---------- Stringable, not string ----------

$value = Str::of($title)->trim()->lower();   // a Stringable

// Casts almost everywhere:
echo $value;
$post->slug = $value;

// A strict type hint will not:
function save(string $slug) { }

save($value);                 // ❌ TypeError
save($value->toString());     // ✓
save((string) $value);        // ✓


<?php
// ---------- Where Str is the wrong tool ----------

// ❌ True for evil.com/?redirect=example.com
if (Str::contains($url, 'example.com')) {
    return redirect($url);
}

// ✓ Parse it, and check the host.
$host = parse_url($url, PHP_URL_HOST);

if ($host === 'example.com' || Str::endsWith($host, '.example.com')) {
    return redirect($url);
}


// ❌ Not for anything secret.
$token = Str::random(40);

// ✓ Day 18's helpers, for a credential.
$token = $user->createToken('api')->plainTextToken;


<?php
// ---------- Multibyte ----------

// substr() and strtoupper() can cut a character in half.
// Str::limit() and Str::upper() do not.

Str::limit('ラーメンとカレー', 5);     // safe
substr('ラーメンとカレー', 0, 5);       // broken bytes

// Which matters the first time a Japanese or Nepali name
// goes through your string handling.`,
      },
      keyTakeaways: [
        "<b>`Str` is a consistent layer over PHP's string functions</b>, which have inconsistent argument orders.",
        "<b>`Str::before($email, '@')` says what it does</b> where the `substr` and `strpos` version says how.",
        "`slug()`, `limit()`, `mask()`, `headline()` and the case converters cover most of what you need.",
        "<b>Nested `Str::` calls read inside out; `Str::of()` reads in the order things happen.</b>",
        "<b>A chain is worth it when the steps have no meaning individually</b>, the same test as a collection pipeline.",
        "<b>`Str::of()` returns a `Stringable`</b>, which casts almost everywhere but not into a strict `string` type hint.",
        "<b>`Str` is a convenience, not a validator</b>: `contains()` on a URL is not a security check.",
        "<b>`Str` handles multibyte text</b>, where `substr()` and `strtoupper()` can cut a character in half.",
        "<b>`Str::random()` is not for anything secret</b>; credentials use the framework's cryptographic helpers.",
      ],
      commonMistakes: [
        "<b>Using `Str::contains()` to validate a URL or a host.</b> A substring match is trivially bypassed.",
        "<b>Passing a `Stringable` into a strict `string` parameter.</b> Call `toString()` at the boundary.",
        "<b>Using `substr()` on user-supplied text.</b> A multibyte character can be cut in half.",
        "<b>Generating a token with `Str::random()`.</b> Use the framework's cryptographic helpers instead.",
        "<b>Chaining two operations that were already clear.</b> The fluent form pays off at four or five steps.",
      ],
      quiz: [
        {
          question: "Why prefer `Str::before($email, '@')` to the `substr`/`strpos` version?",
          options: [
            "It is faster",
            "It states the intent, and does not depend on an argument order people get wrong",
            "It handles null",
            "It is required by Laravel",
          ],
          correctIndex: 1,
          explanation: "The value is expressiveness, not capability.",
        },
        {
          question: "What does `Str::of()` change?",
          options: [
            "It makes strings immutable",
            "The operations read in the order they happen, rather than inside out",
            "It handles multibyte",
            "It validates the string",
          ],
          correctIndex: 1,
          explanation: "Which matters most on a chain of four or five steps.",
        },
        {
          question: "Is `Str::contains($url, 'example.com')` a safe host check?",
          options: [
            "Yes",
            "No; `evil.com/?x=example.com` passes it",
            "Only with `startsWith`",
            "Only over HTTPS",
          ],
          correctIndex: 1,
          explanation: "Parse the URL and check the host, or whitelist.",
        },
        {
          question: "What does `Str::of($title)->slug()` return?",
          options: [
            "A string",
            "A `Stringable`, which casts in most places but not into a strict `string` type hint",
            "A collection",
            "An array of segments",
          ],
          correctIndex: 1,
          explanation: "`->toString()` at a strict boundary.",
        },
      ],
    },
    {
      id: "helpers",
      title: "Helpers — data_get, tap, retry & friends",
      durationMinutes: 12,
      explanation: "Small functions that replace patterns you would otherwise write out.\n\n---\n\n### 1. Basic — reaching into nested data\n\n```php\n$data = ['user' => ['profile' => ['name' => 'Rajan']]];\n```\n\n```php\n$data['user']['profile']['name'];\n```\n\nwhich works, and throws the moment any level is missing. <b>`data_get()` walks the path safely:</b>\n\n```php\ndata_get($data, 'user.profile.name');          // Rajan\ndata_get($data, 'user.profile.age', 0);        // 0, the default\n```\n\nIt works on arrays and objects alike, and supports `*` to reach across a list:\n\n```php\ndata_get($response, 'data.*.id');\n```\n\nWhich is why it belongs anywhere you handle a JSON response from somebody else: <b>you did not write that structure, so you cannot assume it.</b>\n\n`data_set()` is the other direction, creating the missing levels as it goes:\n\n```php\ndata_set($data, 'user.profile.age', 30);\n```\n\n---\n\n### 2. Intermediate — nulls, retries and guards\n\n<b>`optional()` exists for the days before PHP had a nullsafe operator:</b>\n\n```php\noptional($user->profile)->avatar;\n$user->profile?->avatar;          // prefer this\n```\n\n<b>Use the native operator in new code.</b> `optional()` is worth recognising in existing applications and worth not spreading further. It also has a closure form that occasionally earns its place, but the rule stands.\n\n<b>`retry()` retries an operation:</b>\n\n```php\nretry(3, fn () => callExternalService(), 100);\n```\n\n```text\nattempt 1 → fail → wait → attempt 2 → fail → wait → attempt 3\n```\n\nDay 21's caution applies exactly: <b>retry transient failures, and never a non-idempotent write.</b> A network blip is worth retrying; a validation error is not, and a payment without an idempotency key definitely is not.\n\n<b>`throw_if()` compresses a guard:</b>\n\n```php\nthrow_if($user->is_banned, BannedException::class, 'User is banned.');\n```\n\nagainst the three-line `if`. Useful for a run of guards at the top of a method; less useful for one, where a plain `if` reads better and the debugger stops somewhere sensible.\n\n---\n\n### 3. Advanced — `tap()` and `value()`\n\n<b>`tap()` runs a callback and returns the original value:</b>\n\n```php\n$user = tap(User::find($id), fn ($user) => $user->update(['active' => true]));\n```\n\n```text\nvalue\n ↓\nthe callback receives it\n ↓\nthe ORIGINAL value is returned\n```\n\nWhich matters because `update()` returns a boolean. Without `tap()`, that line is three statements and a variable that exists only to be returned:\n\n```php\n$user = User::find($id);\n$user->update(['active' => true]);\nreturn $user;\n```\n\n<b>`tap()` is at its best when a method returns the wrong thing and you want the subject back.</b>\n\n<b>`value()` resolves a value or calls a closure:</b>\n\n```php\nvalue('x');                     // 'x'\nvalue(fn () => expensive());    // the result\n```\n\nWhich looks pointless until you write an API that accepts either. <b>Every Laravel method taking \"a value or a closure\" uses this internally</b>, and it is the reason `when()`, `data_get()` defaults and cache callbacks all accept both without you thinking about it.\n\nAnd the closing judgement for the whole lesson. These helpers are worth using where they say something:\n\n```text\ndata_get     the structure is not yours to trust\ntap          you want the subject back\nretry        the failure is transient\nvalue        the API accepts either\n```\n\nAnd not worth using where they only save characters. <b>`throw_if()` around one condition, or `tap()` where a variable was fine, makes code shorter and slower to read</b>, which is the trade this whole day is about noticing.",
      diagram: `Reaching into nested data

  \$data['user']['profile']['name']

  Works, and throws the moment a level is missing.

    data_get(\$data, 'user.profile.name')       Rajan
    data_get(\$data, 'user.profile.age', 0)     0, the default

  Arrays and objects alike, and * across a list:

    data_get(\$response, 'data.*.id')

  Which is why it belongs anywhere you handle somebody
  else's JSON: you did not write that structure, so you
  cannot assume it.

    data_set(\$data, 'user.profile.age', 30)

  creates the missing levels as it goes.


Nulls, retries, guards

  optional(\$user->profile)->avatar      the old way
  \$user->profile?->avatar               prefer this

  optional() is worth RECOGNISING in existing code and
  worth not spreading further.

  retry(3, fn () => callExternalService(), 100)

    attempt 1 → fail → wait → attempt 2 → fail → wait
              → attempt 3

  Day 21 applies exactly: retry TRANSIENT failures, and
  never a non-idempotent write. A network blip, yes.
  A validation error, no. A payment without an
  idempotency key, definitely not.

  throw_if(\$user->is_banned, BannedException::class, '...')

  Good for a run of guards at the top of a method.
  Less good for one, where a plain if reads better and
  the debugger stops somewhere sensible.


tap() and value()

  \$user = tap(User::find(\$id), fn (\$u) => \$u->update([...]))

    value
     ↓
    the callback receives it
     ↓
    the ORIGINAL value is returned

  Which matters because update() returns a boolean.
  Without tap(), that is three statements and a variable
  that exists only to be returned.

  tap() is at its best when a method returns the wrong
  thing and you want the subject back.


  value('x')                   'x'
  value(fn () => expensive())  the result

  Pointless until you write an API accepting either.
  Every Laravel method taking "a value or a closure"
  uses this — which is why when(), data_get() defaults
  and cache callbacks all accept both.


The judgement

  Worth it where they SAY something:

    data_get   the structure is not yours to trust
    tap        you want the subject back
    retry      the failure is transient
    value      the API accepts either

  Not worth it where they only save characters.

  throw_if() around one condition, or tap() where a
  variable was fine, makes code shorter and slower to
  read — which is the trade this whole day is about
  noticing.`,
      codeExample: {
        title: "The helpers worth reaching for",
        code: `<?php

// ---------- data_get / data_set ----------

$response = Http::get('https://api.example.com/invoices')->json();

// ❌ Throws the moment the API changes shape.
$id = $response['data'][0]['customer']['id'];

// ✓ You did not write this structure.
$id = data_get($response, 'data.0.customer.id');

$ids = data_get($response, 'data.*.id');          // across a list

$page = data_get($response, 'meta.current_page', 1);   // a default

// The other direction, creating levels as it goes.
data_set($settings, 'notifications.email.invoices', true);


<?php
// ---------- Nulls ----------

optional($user->profile)->avatar;    // the old way
$user->profile?->avatar;             // prefer this in new code

// Worth recognising in an existing codebase, and worth
// not spreading further.


<?php
// ---------- retry ----------

$response = retry(3, fn () => Http::get($url)->throw(), 100);

// With a growing delay and a condition:
retry(3,
    fn () => $this->sync(),
    fn (int $attempt) => $attempt * 200,
    fn ($e) => $e instanceof ConnectionException,
);

// ❌ Day 21: the first attempt may have succeeded and
//    its response been lost.
retry(3, fn () => Http::post('/charge', ['amount' => 5000]));

// ✓ Idempotency key, or do not retry the write.


<?php
// ---------- throw_if ----------

// A run of guards, where the compression pays.
throw_if($user->is_banned, BannedException::class, 'User is banned.');
throw_if(! $user->hasVerifiedEmail(), UnverifiedException::class);
throw_unless($invoice->isDraft(), NotDraftException::class);

// For a single condition, this reads better and the
// debugger stops somewhere useful:
if ($user->is_banned) {
    throw new BannedException('User is banned.');
}


<?php
// ---------- tap ----------

// update() returns a boolean, so without tap() this is
// three statements and a variable that exists only to
// be returned.
$user = User::find($id);
$user->update(['active' => true]);
return $user;

// ✓
return tap(User::findOrFail($id), fn ($user) =>
    $user->update(['active' => true])
);

// Also useful for a side effect inside an expression:
return tap($invoice->lines()->create($data), function ($line) use ($invoice) {
    $invoice->recalculateTotal();
});

// ❌ Where a variable was perfectly clear:
return tap($user, fn ($u) => null);


<?php
// ---------- value ----------

value('x');                        // 'x'
value(fn () => expensiveThing());  // the result

// Which is how every Laravel API that takes "a value or
// a closure" works:

Cache::remember('key', 3600, fn () => $this->report());
data_get($data, 'missing', fn () => $this->default());
$query->when($search, fn ($q) => $q->where(...));

// Writing your own:
public function setDefault(mixed $default): static
{
    $this->default = value($default);

    return $this;
}`,
      },
      keyTakeaways: [
        "<b>`data_get()` walks a nested path safely</b>, on arrays or objects, with a default and `*` across lists.",
        "<b>It belongs anywhere you handle somebody else's JSON</b>, because you cannot assume a structure you did not write.",
        "`data_set()` writes into a nested path, creating the missing levels.",
        "<b>Prefer PHP's `?->` over `optional()` in new code</b>, and recognise `optional()` in existing applications.",
        "<b>`retry()` retries transient failures</b>, with the Day 21 caution: never a non-idempotent write.",
        "<b>`throw_if()` compresses a guard</b>, and pays off for a run of them rather than a single condition.",
        "<b>`tap()` runs a callback and returns the original value</b>, which is what you want when a method returns a boolean.",
        "Without it, that line is three statements and a variable that exists only to be returned.",
        "<b>`value()` resolves a value or calls a closure</b>, which is how every \"value or closure\" API in Laravel works.",
        "<b>Use a helper where it says something, not where it only saves characters.</b>",
      ],
      commonMistakes: [
        "<b>Indexing into an external API response directly.</b> A changed shape becomes an undefined-index error.",
        "<b>Spreading `optional()` through new code.</b> `?->` is native, clearer and shorter.",
        "<b>Retrying a write with no idempotency key.</b> The first attempt may have succeeded silently.",
        "<b>Wrapping a single `if` in `throw_if()`.</b> It is shorter and slower to read, and the debugger stops elsewhere.",
        "<b>Using `tap()` where a plain variable was clear.</b> The helper should earn its place.",
      ],
      quiz: [
        {
          question: "Why use `data_get()` on an external API response?",
          options: [
            "It is faster",
            "You did not write that structure, so a missing level should be a default rather than an error",
            "It caches the result",
            "It validates the response",
          ],
          correctIndex: 1,
          explanation: "It also supports `*` to reach across a list.",
        },
        {
          question: "What should new code use instead of `optional($user->profile)`?",
          options: [
            "`data_get()`",
            "PHP's nullsafe operator, `$user->profile?->avatar`",
            "`tap()`",
            "An if statement",
          ],
          correctIndex: 1,
          explanation: "`optional()` is worth recognising, not spreading.",
        },
        {
          question: "What does `tap()` return?",
          options: [
            "The callback's return value",
            "The original value passed to it",
            "A boolean",
            "Null",
          ],
          correctIndex: 1,
          explanation: "Which is why it suits a method like `update()` that returns a boolean.",
        },
        {
          question: "What is `value()` for?",
          options: [
            "Caching a computed result",
            "Accepting either a plain value or a closure, and resolving whichever it is",
            "Validating a value",
            "Extracting a field",
          ],
          correctIndex: 1,
          explanation: "It is how every \"value or closure\" API in Laravel works internally.",
        },
      ],
    },
    {
      id: "concurrency-and-contracts",
      title: "Concurrency, contracts & expressing intent",
      durationMinutes: 12,
      explanation: "Two more abstractions, and then the judgement the whole day has been building towards.\n\n---\n\n### 1. Basic — concurrency\n\nThree independent pieces of work, done in turn:\n\n```text\nprofile  →  orders  →  notifications\n```\n\n```text\nProfile API       200ms\nOrders API        300ms\nNotifications     150ms\n            ────────────\nsequential        650ms\n```\n\nLaravel's `Concurrency` facade runs them together:\n\n```text\n          ┌→ profile\nRequest ──┼→ orders\n          └→ notifications\n```\n\n```text\nconcurrent   ≈ max(200, 300, 150)  ≈ 300ms\n```\n\nThe same idea as Day 21's `Http::pool()`, generalised: <b>independent work that spends its time waiting can wait at the same time.</b>\n\nAnd the condition is doing the work in that sentence.\n\n---\n\n### 2. Intermediate — when it does not help\n\n<b>Dependent work cannot be parallelised:</b>\n\n```text\ncreate the user\n      ↓\ncreate their profile\n```\n\nThe second needs the first's id. No amount of concurrency changes that; only a design change would.\n\nAnd the other half: <b>concurrency helps work that waits, not work that computes.</b>\n\n```text\nhelps                       does not help\n─────                       ─────────────\nexternal API calls          a tight PHP loop\nseveral independent         one query the database\n  queries                     runs sequentially anyway\nreading several files       work that is already fast\n```\n\nThree independent HTTP calls overlap because each is mostly waiting. Three heavy calculations do not, because they need the same processor.\n\n<b>And it is not free.</b> Each concurrent task has setup cost, so parallelising three things that take five milliseconds each makes the operation slower. Measure before and after; if you cannot state the improvement in milliseconds, you have added complexity for nothing.\n\n---\n\n### 3. Advanced — contracts\n\n<b>A <i>contract</i></b> is an interface Laravel defines for a capability:\n\n```php\nIlluminate\\Contracts\\Cache\\Repository\n```\n\n```text\nContract\n   │ interface\n   ▼\nimplementation\n```\n\nType-hint the contract rather than a concrete class:\n\n```php\npublic function __construct(private CacheRepository $cache) {}\n```\n\n```text\nyour class\n    ↓\nthe contract\n    ↓\nthe container\n    ↓\nRedis, or a file cache, or an array in a test\n```\n\n<b>Your class stops knowing which one it got</b>, which is what makes it replaceable and testable. Swapping Redis for something else, or using an array cache in tests, changes configuration rather than code.\n\nAnd then the caution, which matters more than the technique:\n\n```text\n❌ UserServiceInterface + UserService\n   UserRepositoryInterface + UserRepository\n   UserManagerInterface + UserManager\n```\n\n<b>An interface with exactly one implementation, that will only ever have one, is a file that adds indirection and nothing else.</b> Every reader now opens two files to follow one call.\n\nUse an abstraction when it buys something real:\n\n```text\nseveral implementations exist, or will\nan external boundary you want to fake in tests\nan architectural seam you have deliberately chosen\na framework capability, where the contract already exists\n```\n\nAnd not because interfaces sound senior.\n\n---\n\n### The judgement this day was about\n\nEvery abstraction today has the same shape: it is worth using when it <b>expresses intent</b>, and not worth using when it only saves characters.\n\n```text\nforeach ($users as $user) {\n    if ($user->active) { ... }\n}\n```\n\nsays what to do. \n\n```php\n$users->filter->active\n```\n\nsays <i>give me the active users</i>.\n\nBut a five-step chain with three closures spanning twenty lines says less than the loop it replaced, and that is the same judgement in the other direction.\n\n```text\nuse a collection chain when          a foreach is better when\n───────────────────────────          ───────────────────────\ntransforming, filtering,             the control flow is complex\ngrouping, mapping, aggregating       there are several side effects\nthe pipeline is the point            there are early exits\n                                     the state is complicated\n```\n\n<b>A collection is not better because it is shorter.</b> Readable code wins, and knowing which tool makes this particular code readable is the skill the whole day was for.",
      diagram: `Concurrency

  Three independent pieces of work, in turn:

    profile → orders → notifications

    Profile API      200ms
    Orders API       300ms
    Notifications    150ms
                ────────────
    sequential       650ms

  Together:

            ┌→ profile
  Request ──┼→ orders
            └→ notifications

    concurrent ≈ max(200, 300, 150) ≈ 300ms

  Day 21's Http::pool(), generalised: independent work
  that spends its time WAITING can wait at the same time.


When it does not help

  Dependent work cannot be parallelised:

    create the user → create their profile

  The second needs the first's id. Only a design change
  helps, not concurrency.

  helps                      does not help
  ─────                      ─────────────
  external API calls         a tight PHP loop
  several independent        one query the database
    queries                    runs sequentially anyway
  reading several files      work that is already fast

  Three HTTP calls overlap because each is mostly
  waiting. Three heavy calculations do not: they need
  the same processor.

  ⚠️  It is not free. Each task has setup cost, so
      parallelising three five-millisecond operations
      makes them slower. Measure. If you cannot state
      the improvement in milliseconds, you added
      complexity for nothing.


Contracts

  Illuminate\\Contracts\\Cache\\Repository

    Contract → interface → implementation

  __construct(private CacheRepository \$cache)

    your class → the contract → the container
               → Redis, a file cache, or an array in a test

  Your class stops knowing which one it got, which is
  what makes it replaceable and testable. Swapping the
  implementation is configuration, not code.


  ⚠️  And then the caution:

    ❌ UserServiceInterface + UserService
       UserRepositoryInterface + UserRepository
       UserManagerInterface + UserManager

  An interface with exactly one implementation, that
  will only ever have one, is a file that adds
  indirection and nothing else. Every reader now opens
  two files to follow one call.

  Use an abstraction when it buys something:

    several implementations exist, or will
    an external boundary you want to fake in tests
    an architectural seam you deliberately chose
    a framework capability, where the contract exists

  Not because interfaces sound senior.


The judgement this day was about

  Every abstraction today has the same shape: worth it
  when it EXPRESSES INTENT, not when it saves characters.

    foreach (\$users as \$user) {
        if (\$user->active) { ... }
    }
        says what to DO

    \$users->filter->active
        says give me the active users

  But a five-step chain with three closures over twenty
  lines says LESS than the loop it replaced. Same
  judgement, other direction.

  a chain, when                    a foreach, when
  ─────────────                    ───────────────
  transforming, filtering,         the control flow is complex
  grouping, aggregating            several side effects
  the pipeline is the point        early exits
                                   complicated state

  A collection is not better because it is shorter.
  Readable code wins.`,
      codeExample: {
        title: "Concurrency, contracts, and the judgement",
        code: `<?php

use Illuminate\\Support\\Facades\\Concurrency;

// ---------- Concurrency: independent, waiting work ----------

// ❌ 200 + 300 + 150 = 650ms
$profile       = $this->loadProfile($user);
$orders        = $this->loadOrders($user);
$notifications = $this->loadNotifications($user);

// ✓ ≈ max(200, 300, 150) ≈ 300ms
[$profile, $orders, $notifications] = Concurrency::run([
    fn () => $this->loadProfile($user),
    fn () => $this->loadOrders($user),
    fn () => $this->loadNotifications($user),
]);

// Fire and forget, when nothing needs the result:
Concurrency::defer([
    fn () => $this->warmCache(),
    fn () => $this->pingWebhook(),
]);


// ---------- When it does not help ----------

// ❌ The second needs the first's id.
$user    = User::create($data);
$profile = $user->profile()->create($profileData);

// ❌ Three heavy calculations need the same processor.
Concurrency::run([
    fn () => $this->computeA(),
    fn () => $this->computeB(),
]);

// ❌ Three five-millisecond operations. Setup costs more
//    than the saving.
Concurrency::run([
    fn () => Cache::get('a'),
    fn () => Cache::get('b'),
]);

// Measure. If you cannot state the improvement in
// milliseconds, you added complexity for nothing.


<?php
// ---------- Contracts ----------

namespace App\\Services;

use Illuminate\\Contracts\\Cache\\Repository as CacheRepository;

class ReportService
{
    // ❌ Tied to one implementation.
    // public function __construct(private RedisStore $cache) {}

    // ✓ The container decides which one.
    public function __construct(private CacheRepository $cache) {}

    public function monthly(): array
    {
        return $this->cache->remember('reports.monthly', 3600,
            fn () => $this->build());
    }
}

// Redis in production, an array cache in tests, and this
// class never knew the difference. That is configuration
// rather than code.


<?php
// ---------- Where an interface is NOT worth it ----------

// ❌ One implementation, and there will never be another.
interface UserServiceInterface { public function create(array $data): User; }
class UserService implements UserServiceInterface { }

// Every reader now opens two files to follow one call.

// ✓ An interface where there is a real boundary:
interface PaymentGateway
{
    public function charge(Money $amount, string $token): Payment;
}

class StripeGateway implements PaymentGateway { }
class FakeGateway implements PaymentGateway { }   // for tests

// Two implementations, an external boundary, and a
// reason to fake it. That interface earns its file.


<?php
// ---------- The judgement ----------

// ✓ A pipeline: the chain IS the description.
$result = collect($users)
    ->filter->active
    ->flatMap(fn ($user) => $user->orders
        ->filter(fn ($o) => $o->status === 'paid' && $o->amount > 100)
        ->map(fn ($o) => ['user' => $user->name, 'amount' => $o->amount]))
    ->values();

//   users → active only → their paid orders over 100
//         → shaped → result


// ✓ A loop: the control flow IS the point.
foreach ($rows as $index => $row) {
    if (! $this->valid($row)) {
        $errors[$index] = 'Invalid row';
        continue;
    }

    try {
        $imported[] = $this->import($row);
    } catch (DuplicateException $e) {
        $skipped++;
        continue;
    }

    if (count($imported) >= 1000) {
        break;
    }
}

// Early exits, several side effects, a counter and a
// break. A chain would be shorter and say less.
//
// A collection is not better because it is shorter.`,
      },
      keyTakeaways: [
        "<b>`Concurrency::run()` executes independent tasks together</b>, so the total is the slowest rather than the sum.",
        "It is Day 21's `Http::pool()` generalised to any independent work.",
        "<b>Dependent work cannot be parallelised</b>: the second step needing the first's result is a design fact.",
        "<b>Concurrency helps work that waits, not work that computes</b>, because calculations share one processor.",
        "<b>It is not free</b>, so parallelising several fast operations makes them slower; measure both ways.",
        "<b>A contract is an interface for a capability</b>, and type-hinting it lets the container choose the implementation.",
        "<b>Your class stops knowing which implementation it got</b>, which is what makes it replaceable and testable.",
        "<b>An interface with exactly one implementation adds indirection and nothing else.</b>",
        "Use an abstraction for several implementations, an external boundary, or a seam you deliberately chose.",
        "<b>Every abstraction today is worth it when it expresses intent and not when it only saves characters.</b>",
        "<b>Use a chain when the pipeline is the point and a loop when the control flow is.</b> Readable code wins.",
      ],
      commonMistakes: [
        "<b>Parallelising dependent steps.</b> The second needs the first's result, so nothing overlaps.",
        "<b>Using concurrency for CPU-bound work.</b> It helps waiting, not computing.",
        "<b>Adding concurrency without measuring.</b> On fast operations the setup cost makes it slower.",
        "<b>Creating an interface per class.</b> Two files to follow one call, for no benefit.",
        "<b>Replacing every loop with a chain.</b> A chain with complex control flow says less than the loop did.",
      ],
      quiz: [
        {
          question: "When does concurrency help?",
          options: [
            "Any slow code",
            "Independent work that spends its time waiting, such as several API calls",
            "Tight PHP loops",
            "Database writes",
          ],
          correctIndex: 1,
          explanation: "Calculations share a processor; waiting can overlap.",
        },
        {
          question: "Why can creating a user and their profile not be parallelised?",
          options: [
            "Laravel forbids it",
            "The second needs the first's id, so it is dependent work",
            "Both write to the database",
            "It can be",
          ],
          correctIndex: 1,
          explanation: "Only a design change would help, not concurrency.",
        },
        {
          question: "What does type-hinting a contract buy you?",
          options: [
            "Better performance",
            "The container chooses the implementation, so it can be swapped or faked in tests",
            "Automatic validation",
            "Shorter code",
          ],
          correctIndex: 1,
          explanation: "Redis in production and an array cache in tests, with no code change.",
        },
        {
          question: "When is a `foreach` better than a collection chain?",
          options: [
            "Never",
            "When the control flow is the point: early exits, several side effects, complicated state",
            "When the collection is small",
            "When the items are arrays",
          ],
          correctIndex: 1,
          explanation: "A collection is not better because it is shorter.",
        },
      ],
    },
  ],
  finalQuiz: [
    {
      question: "Why should a placeholder live inside a translation rather than in a concatenation?",
      options: [
        "It is shorter",
        "Word order differs between languages, so each translation must own it",
        "Concatenation is slower",
        "Blade cannot concatenate",
      ],
      correctIndex: 1,
      explanation: "A translation is a whole sentence, not a fragment.",
    },
    {
      question: "What is the practical difference between PHP and JSON translation files?",
      options: [
        "JSON is faster",
        "JSON uses the English text as the key, so a missing translation shows readable English",
        "PHP files cannot take parameters",
        "JSON supports plurals only",
      ],
      correctIndex: 1,
      explanation: "PHP files give grouping and structure instead.",
    },
    {
      question: "Why not write `if ($count === 1)` for pluralization?",
      options: [
        "It is slower",
        "Plural rules differ by language, and several have more than two forms",
        "Laravel forbids it",
        "It cannot be cached",
      ],
      correctIndex: 1,
      explanation: "`trans_choice()` lets each translation define its own forms.",
    },
    {
      question: "Which locale source should win?",
      options: [
        "The `Accept-Language` header",
        "The user's explicit choice",
        "The server default",
        "Whichever is checked first",
      ],
      correctIndex: 1,
      explanation: "Re-detecting overrules somebody who already told you.",
    },
    {
      question: "What is the difference between `map()` and `filter()`?",
      options: [
        "None",
        "`map()` changes every item; `filter()` removes some and leaves the rest unchanged",
        "`filter()` is faster",
        "`map()` returns an array",
      ],
      correctIndex: 1,
      explanation: "Knowing which you want is most of the skill.",
    },
    {
      question: "What is wrong with `User::all()->filter(fn ($u) => $u->active)`?",
      options: [
        "Nothing",
        "Every row is fetched and PHP discards most of them; the database should filter",
        "`filter()` does not work on models",
        "It returns an array",
      ],
      correctIndex: 1,
      explanation: "If the condition can be a `WHERE` clause, it belongs in the query.",
    },
    {
      question: "Why does a filtered collection sometimes serialise as a JSON object?",
      options: [
        "A cast is missing",
        "`filter()` preserves keys, so the indexes are no longer sequential",
        "Collections always serialise as objects",
        "It is a bug",
      ],
      correctIndex: 1,
      explanation: "`->values()` reindexes and restores the array shape.",
    },
    {
      question: "What does a lazy collection solve?",
      options: [
        "Slow queries",
        "Holding every item in memory, which fails on a large result set",
        "Missing eager loads",
        "Duplicate values",
      ],
      correctIndex: 1,
      explanation: "Values are produced one at a time, so memory does not grow with the rows.",
    },
    {
      question: "What is the main cost of a collection macro?",
      options: [
        "Performance",
        "Discoverability: nobody knows it exists, and it lives in a provider they will not open",
        "Memory",
        "It breaks type hints",
      ],
      correctIndex: 1,
      explanation: "A custom collection class keeps the methods next to the model.",
    },
    {
      question: "Is `Str::contains($url, 'example.com')` a safe host check?",
      options: [
        "Yes",
        "No; `evil.com/?x=example.com` passes it",
        "Only with `startsWith`",
        "Only over HTTPS",
      ],
      correctIndex: 1,
      explanation: "Parse the URL and check the host, or whitelist.",
    },
    {
      question: "What does `tap()` return?",
      options: [
        "The callback's return value",
        "The original value passed to it",
        "A boolean",
        "Null",
      ],
      correctIndex: 1,
      explanation: "Which is why it suits a method like `update()` that returns a boolean.",
    },
    {
      question: "When does concurrency help?",
      options: [
        "Any slow code",
        "Independent work that spends its time waiting, such as several API calls",
        "Tight PHP loops",
        "Database writes",
      ],
      correctIndex: 1,
      explanation: "Calculations share a processor; waiting can overlap.",
    },
    {
      question: "When is an interface worth creating?",
      options: [
        "For every service class",
        "When there are several implementations, an external boundary, or a seam you deliberately chose",
        "Whenever the class has dependencies",
        "Never",
      ],
      correctIndex: 1,
      explanation: "One implementation that will only ever be one is indirection and nothing else.",
    },
    {
      question: "When is a `foreach` better than a collection chain?",
      options: [
        "Never",
        "When the control flow is the point: early exits, several side effects, complicated state",
        "When the collection is small",
        "When the items are arrays",
      ],
      correctIndex: 1,
      explanation: "A collection is not better because it is shorter.",
    },
  ],
  project: {
    name: "InvoiceHub",
    goal: "Localize InvoiceHub into three languages and rewrite its ugliest reporting code, keeping only the rewrites that made it clearer.",
    brief: "InvoiceHub speaks English in hard-coded strings, and somewhere in it is a report built from four nested loops that nobody wants to touch.\n\nToday fixes both, and the second half comes with a rule: <b>every rewrite has to be justified out loud.</b> Turning a loop into a chain because it is shorter is not a reason. Turning it into a chain because the transformation becomes visible is. You will rewrite several pieces of code today and you should deliberately keep at least one of them as a loop, because that judgement is the actual skill.\n\nFor the localization half, the test is not that the strings are translated. It is that somebody could add a fourth language by adding one file, with no code change anywhere.",
    steps: [
      "Find every hard-coded user-facing string in InvoiceHub. Write down how many there are before you start; the number is usually a surprise.",
      "Set up `lang/en`, `lang/ja` and `lang/ne`, and decide between PHP and JSON files. Write one sentence explaining the choice, then stick to it.",
      "Move the invoice screens' strings into language files and replace them with `__()`. Confirm nothing in the codebase branches on a language any more.",
      "Find a string built by concatenating a value, such as a greeting or a status line, and convert it to a placeholder. Then check whether the Japanese word order is actually the same, and note what you found.",
      "Add plurals for a count that appears in the interface, such as \"3 invoices\". Use `trans_choice()` and give the Japanese file a single form.",
      "Write a `SetLocale` middleware with the priority order: user preference, then URL or session, then `Accept-Language` whitelisted, then the fallback. Set a fallback locale in config.",
      "Log in, switch to Japanese, then load a page in a browser sending `Accept-Language: en`. Confirm your choice wins, and say why that matters.",
      "Remove one key from the Japanese file and load that page. Note what appears with and without a fallback locale configured.",
      "Format one date and one currency amount for the active locale. Look at the Japanese page and note anything still obviously English.",
      "Now the reporting half. Find the worst nested loop in the codebase, copy it into `NOTES.md` untouched, and write one sentence describing what it produces.",
      "Rewrite it as a collection pipeline. Put both versions side by side and decide honestly which one communicates the intention better.",
      "Check the rewrite for the two traps: is anything filtered in PHP that the database could filter, and does the result need `values()` before it becomes JSON?",
      "Find a second loop with real control flow, such as an importer with error collection and an early exit. Attempt a chain, then keep the loop, and write down why.",
      "Find one place that does something to every item and one that builds a result from every item. Make them `each()` and `map()` respectively, and note whether either was previously the wrong one.",
      "Replace one repeated filter with a higher-order message, and one with a custom collection method on the model. Say which is more discoverable and why.",
      "Take one report that loads a whole table into memory and rewrite it with `lazy()`. Measure peak memory before and after with `memory_get_peak_usage()`.",
      "Find a place that indexes into an external API response directly and replace it with `data_get()`. Then break the response shape deliberately and confirm the failure is now a default rather than an error.",
      "Find three or more independent calls in one request. Time them sequentially, then with `Concurrency::run()`, and record both numbers. If it is not faster, revert it and say so.",
      "Finally, list every rewrite you made and whether it made the code clearer or only shorter. Revert anything in the second category.",
    ],
    acceptance: [
      "Every user-facing string in the invoice screens comes from a language file, and no code branches on the language.",
      "Adding a fourth language requires adding files and nothing else.",
      "A count in the interface pluralises correctly in English and reads correctly in Japanese.",
      "A logged-in user's chosen locale beats their browser's, and you can explain why.",
      "A missing translation falls back to English rather than showing a raw key.",
      "Dates and currency are formatted for the active locale.",
      "The rewritten report produces the same output as the original, and the original is preserved in `NOTES.md`.",
      "Nothing is filtered, summed or sorted in PHP that the database could have done.",
      "At least one loop was deliberately kept, with a written reason.",
      "The lazy rewrite shows a measurable drop in peak memory, with both numbers recorded.",
      "External API access uses `data_get()` and degrades to a default when the shape changes.",
      "The concurrency change is either measurably faster, with numbers, or reverted.",
      "Every rewrite is listed as \"clearer\" or \"only shorter\", and the second list is empty because you reverted them.",
    ],
    stretch: [
      "Write a test that loads every translation key referenced in your Blade views and fails when one is missing from a language file.",
      "Add an `InvoiceCollection` with `overdue()` and `totalOutstanding()`, and compare its discoverability with the equivalent global macros.",
      "Put the locale in the URL as `/ja/invoices`, and write down what that makes possible that a session-only locale does not.",
    ],
  },
};
