import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_13_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "Some operations are just slow, and hitting the database on every page load for the same data is wasteful.\n\n• <b>Caching</b> stores the result of an expensive operation (a DB query, an API call) and serves it from memory on the next request\n  ↳ `Cache::remember()` checks, fetches-if-missing, stores, and returns, all in one line\n• <b>Redis</b> is the go-to production cache driver: fast, TTLs built in, and shared across every server in your fleet",
      np: "Cache ले महंगो DB query राख्ने काम गर्छ। Redis production driver।",
      jp: "**キャッシュ** は高コストなクエリ結果を保存して高速化します。Redis が本番向けのドライバです。",
    },
    {
      en: "Once the app is fast, the next question is who can read it.\n\n• <b>Localization</b> lets you translate your UI into any language using `lang/` files and the `__()` helper\n  ↳ Switch locale at runtime with `App::setLocale('np')`, or set `APP_LOCALE` in `.env` for the default\n• Sessions and flash data are Day 10, so today is only about data you cache and text you translate",
      np: "Localization ले `lang/` files र `__()` द्वारा UI translate गर्छ। Session र flash data Day 10 मा छ।",
      jp: "**ローカライゼーション** は `lang/` と `__()` で UI を多言語化します。セッションとフラッシュデータは Day 10 で扱います。",
    },
  ],
  sections: [
    {
      title: {
        en: "Caching — drivers & patterns",
        np: "Cache — drivers र patterns",
        jp: "キャッシュ — ドライバとパターン",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "The <b>cache-aside pattern</b> is the most common caching strategy — and `Cache::remember()` implements all of it in a single line.\n\nHere's what happens step by step:\n• Check the cache for the key — if found, return it immediately (cache hit, no DB query)\n• If not found (cache miss) — run the closure to load fresh data from the database\n• Store the result in the cache with a TTL (time to live) so it expires automatically\n• Return the value\n\nSet the cache backend via `CACHE_STORE` (Laravel 11) or `CACHE_DRIVER` (Laravel 10) in `.env`.",
            np: "`.env` मा `CACHE_STORE`। Cache-aside pattern: cache miss भए DB load, store, return। `Cache::remember()` एक line।",
            jp: "`.env` に `CACHE_STORE` を設定。キャッシュアサイドパターンが最も一般的です。`Cache::remember()` がこれを 1 行で実装します。",
          },
        },
        {
          type: "code",
          title: {
            en: "Cache facade — store, retrieve, remember, tags",
            np: "Cache facade उदाहरण",
            jp: "Cache ファサードの使用例",
          },
          code: `use Illuminate\\Support\\Facades\\Cache;

// ---- Basic put / get ----
Cache::put('key', 'value', 3600);             // 3600 seconds TTL
Cache::put('key', 'value', now()->addHour()); // Carbon TTL
Cache::forever('key', 'value');               // no expiry
$value = Cache::get('key');
$value = Cache::get('key', 'default');        // fallback if missing

// ---- Presence / removal ----
Cache::has('key');      // true if present AND not expired
Cache::missing('key');
Cache::forget('key');
Cache::flush();         // clear the entire cache store

// ---- cache-aside pattern in one call ----
$posts = Cache::remember('home.posts', 3600, function () {
    return Post::published()->latest()->take(10)->get();
});

// RememberForever (no TTL)
$settings = Cache::rememberForever('site.settings', fn () => Setting::all());

// ---- Atomic increment / decrement ----
Cache::increment('api_calls');
Cache::increment('api_calls', 5);
Cache::decrement('stock');

// ---- Cache tags (Redis / Memcached only) ----
Cache::tags(['posts', 'homepage'])->put('featured', $featured, 600);
$featured = Cache::tags(['posts', 'homepage'])->get('featured');
Cache::tags('posts')->flush(); // invalidate all 'posts'-tagged entries

// ---- Retrieve and delete in one call ----
$job = Cache::pull('pending_job');  // get + forget`,
        },
        {
          type: "code",
          title: {
            en: "Redis facade — direct key operations",
            np: "Redis facade उदाहरण",
            jp: "Redis ファサードの直接操作",
          },
          code: `# .env
CACHE_STORE=redis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

use Illuminate\\Support\\Facades\\Redis;

// Basic key operations
Redis::set('user:1:score', 100);
$score = Redis::get('user:1:score');
Redis::expire('user:1:score', 3600);   // TTL in seconds
Redis::del('user:1:score');

// Hash (model-like structure)
Redis::hset('user:1', 'name', 'Alice');
Redis::hset('user:1', 'email', 'alice@example.com');
$name = Redis::hget('user:1', 'name');
$all  = Redis::hgetall('user:1');

// Atomic increment
Redis::incr('page:views');
Redis::incrby('page:views', 5);

// Connect to a non-default connection
Redis::connection('cache')->set('foo', 'bar');`,
        },
      ],
    },
    {
      title: {
        en: "Localization & translations",
        np: "Localization र Translations",
        jp: "ローカライゼーションと翻訳",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel's localization system lets you write your UI strings once and translate them for any language.\n\n• In Laravel 11, the built-in translation strings live inside the vendor package\n  ↳ Run `php artisan lang:publish` to copy them into your project's `lang/` folder so you can edit them\n• Your own strings go in either:\n  ↳ `lang/{locale}/file.php` — PHP array format, organized by file (e.g. `lang/en/messages.php`)\n  ↳ `lang/{locale}.json` — JSON format, keyed by the original English string\n• Use `__('messages.welcome', ['name' => $user->name])` to look up and interpolate a translation",
            np: "`php artisan lang:publish` ले vendor बाट copy। `lang/{locale}/file.php` वा `lang/{locale}.json`।",
            jp: "`php artisan lang:publish` でベンダーから `lang/` にコピー。`lang/{locale}/file.php` か `lang/{locale}.json` に翻訳を書きます。",
          },
        },
        {
          type: "code",
          title: {
            en: "Translation file structure",
            np: "Translation file structure",
            jp: "翻訳ファイルの構造",
          },
          code: `// lang/en/messages.php  — PHP array format
return [
    'welcome'    => 'Welcome, :name!',
    'goodbye'    => 'See you later, :name.',
    'item_count' => '{0} No items|{1} One item|[2,*] :count items',
];

// lang/en.json  — JSON format (keyed by the English string)
{
  "I love Laravel": "I love Laravel",
  "Save changes": "Save changes"
}

// lang/np/messages.php  — Nepali translation
return [
    'welcome' => 'स्वागत छ, :name!',
    'goodbye' => 'फेरि भेटौँला, :name।',
    'item_count' => '{0} कुनै वस्तु छैन|{1} एक वस्तु|[2,*] :count वस्तुहरू',
];`,
        },
        {
          type: "code",
          title: {
            en: "Using translations in PHP and Blade",
            np: "PHP र Blade मा translation",
            jp: "PHP と Blade での翻訳使用",
          },
          code: `// PHP / Controllers
$msg  = __('messages.welcome', ['name' => $user->name]);
$msg  = trans('messages.welcome', ['name' => $user->name]);   // alias

// Pluralization with trans_choice
$line = trans_choice('messages.item_count', $count, ['count' => $count]);

// JSON keys (no file prefix needed)
$label = __('Save changes');     // looks up lang/en.json

// ---- Setting locale ----
use Illuminate\\Support\\Facades\\App;

App::setLocale('np');            // runtime switch
$locale = App::getLocale();      // 'np'
App::isLocale('np');             // true/false
// or set APP_LOCALE=np in .env for the default

// ---- Blade templates ----
// {{ __('messages.welcome', ['name' => $user->name]) }}
// @lang('messages.goodbye', ['name' => $user->name])
// @choice('messages.item_count', $count, ['count' => $count])

// ---- Fallback locale ----
// APP_FALLBACK_LOCALE=en  in .env
// If the key is missing in the current locale, Laravel falls back to this`,
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "How do I configure Redis as the cache driver?",
        np: "Redis लाई cache driver कसरी मिलाउने?",
        jp: "Redis をキャッシュドライバに設定するには？",
      },
      answer: {
        en: "Add these to `.env`:\n• `CACHE_STORE=redis` (`CACHE_DRIVER=redis` on Laravel 10)\n• `REDIS_HOST=127.0.0.1`, `REDIS_PORT=6379`, and `REDIS_PASSWORD` if your Redis server requires one\n\nThen install a PHP Redis client, either `composer require predis/predis` (pure PHP, easy to install) or the `phpredis` PHP extension (faster, but requires server-level access).\n\nGive the cache its own Redis database so a `Cache::flush()` never wipes anything else stored in Redis: set `REDIS_CACHE_DB=1` in `config/database.php`.",
        np: "`.env` मा `CACHE_STORE=redis` र `REDIS_HOST`/`REDIS_PORT`। `predis/predis` install गर्नुस्।",
        jp: "`.env` に `CACHE_STORE=redis` と接続先を設定し、`predis/predis` または `phpredis` 拡張を導入します。",
      },
    },
    {
      question: {
        en: "What is the difference between `session()` and `Cache`?",
        np: "`session()` र `Cache` मा के फरक?",
        jp: "`session()` と `Cache` の違いは？",
      },
      answer: {
        en: "They look similar but serve completely different purposes.\n\n• <b>Sessions</b> (covered on Day 10) are scoped to one user, identified by their session cookie\n  ↳ Data is private: only that user's requests can see it\n  ↳ Examples: \"is the user logged in?\", \"what's in their shopping cart?\"\n• <b>Cache</b> is shared across all users and all server instances (when using Redis)\n  ↳ Data is public: every request on every server can read it\n  ↳ Examples: the homepage posts list (same for every visitor), computed site settings\n\nGolden rule: never store sensitive user-specific data (passwords, tokens, personal info) in the shared cache.",
        np: "Session user-specific (private, Day 10); Cache सबैले share गर्छन् — query result, rendered HTML। Cache मा sensitive data नराख्नुस्।",
        jp: "セッション（Day 10）はユーザーごとのプライベートなデータ。キャッシュは全ユーザーで共有する公開データ（クエリ結果・HTML など）。機密情報をキャッシュに入れないでください。",
      },
    },
    {
      question: {
        en: "How do I translate validation error messages?",
        np: "Validation error messages translate कसरी गर्ने?",
        jp: "バリデーションエラーメッセージを翻訳するには？",
      },
      answer: {
        en: "Run `php artisan lang:publish` to copy Laravel's built-in `validation.php` file into `lang/en/validation.php` in your project.\n\nThen create a new file at `lang/{locale}/validation.php` (e.g. `lang/np/validation.php`) with the same array keys but translated values.\n\nLaravel automatically picks up the active locale when generating validation error messages — no extra code needed. To customize attribute names so errors say \"Email address\" instead of \"email\", override the `attributes` array at the bottom of the file.",
        np: "`php artisan lang:publish` गरेर `lang/en/validation.php` copy। `lang/np/validation.php` बनाउनुस्।",
        jp: "`php artisan lang:publish` で `lang/en/validation.php` をコピーし、`lang/{locale}/validation.php` に翻訳します。属性名は `attributes` 配列でカスタマイズできます。",
      },
    },
    {
      question: {
        en: "What are named translation parameters?",
        np: "Named translation parameters के हुन्?",
        jp: "翻訳の名前付きパラメータとは？",
      },
      answer: {
        en: "Translation strings can contain `:name` placeholders — pass the replacements as an array to `__()` or `trans()`.\n\nExample: `__('messages.welcome', ['name' => 'Alice'])` turns `'Welcome, :name!'` into `'Welcome, Alice!'`.\n\nCase variants work automatically:\n• `:name` — uses the replacement value as-is\n• `:Name` — capitalizes the first letter of the replacement\n• `:NAME` — uppercases the entire replacement value",
        np: "`:name` placeholder — `['name' => 'Alice']` pass गर्नुस्। `:Name` first letter capitalize; `:NAME` uppercase।",
        jp: "`:name` プレースホルダに第 2 引数で値を渡します。`:Name` で先頭を大文字、`:NAME` で全大文字にもなります。",
      },
    },
    {
      question: {
        en: "Can I lazy-load translations by locale to avoid loading all language files at once?",
        np: "Locale अनुसार translation lazy-load गर्न सकिन्छ?",
        jp: "ロケール別に翻訳を遅延ロードできますか？",
      },
      answer: {
        en: "Yes — Laravel is lazy about loading translation files. It only loads a file when a key from it is first accessed.\n\n• Calling `__('messages.welcome')` with locale `en` loads only `lang/en/messages.php`\n  ↳ `lang/np/messages.php` and any other locale files are never touched during that request\n• `lang/{locale}.json` is loaded once per request the first time any of its keys are accessed\n\nThis means you can safely add dozens of translation files for different languages — they won't slow down requests for users in other locales.",
        np: "Laravel ले called भएका files मात्र load गर्छ — सबै at once होइन।",
        jp: "Laravel は実際に呼び出されたファイルだけをロードします。JSON 翻訳は最初のキーアクセス時に 1 回だけ読み込まれます。",
      },
    },
    {
      question: {
        en: "What is the `cache-aside` pattern and how does `Cache::remember()` implement it?",
        np: "Cache-aside pattern के हो र `Cache::remember()` कसरी implement गर्छ?",
        jp: "キャッシュアサイドパターンと `Cache::remember()` の関係は？",
      },
      answer: {
        en: "The <b>cache-aside pattern</b> means the application code is responsible for managing the cache — the cache is not automatically kept in sync with the database.\n\nThe four steps:\n• Check the cache for the key\n• If missing (cache miss) — load fresh data from the source, usually the database\n• Store the result in the cache with a TTL so it expires automatically\n• Return the value\n\n`Cache::remember('key', $ttl, fn() => DB::query())` does all four steps in one call:\n• You provide the key, the TTL in seconds, and a closure that fetches fresh data\n  ↳ The closure only runs on a cache miss — on a hit, it is never called at all",
        np: "Cache-aside: cache miss भए DB load, cache store, return। `Cache::remember()` ले सबै एक call मा।",
        jp: "キャッシュアサイドは (1) キャッシュを参照、(2) ミスなら DB からロード、(3) TTL 付きでキャッシュに保存、(4) 返却 — の 4 ステップ。`Cache::remember()` がこれをアトミックに 1 行で行います。",
      },
    },
  ],
};
