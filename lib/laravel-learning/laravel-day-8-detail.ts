import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_8_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "**Sessions** store per-user server-side state across requests. **Flash data** lives for exactly one request — ideal for success/error messages after a redirect. Together they power the Post-Redirect-Get pattern that prevents duplicate form submissions in browser apps.",
      np: "Session ले per-user state राख्छ। Flash data एक request मात्र — success/error message को लागि।",
      jp: "**セッション** はユーザーごとのサーバー側の状態を管理。**フラッシュデータ** は次のリクエストまでだけ保持され、リダイレクト後のメッセージに最適です。",
    },
    {
      en: "**Caching** dramatically speeds up reads by storing expensive computations or database results. **Redis** is the production-grade driver for both sessions and cache. **Localization** translates your UI via `lang/` files and the `__()` / `trans()` helpers — switch locale at runtime with `App::setLocale()`.",
      np: "Cache ले DB queries cache। Redis production driver। Localization ले `lang/` files द्वारा UI translate।",
      jp: "**キャッシュ** は高コストなクエリ結果を保存して高速化。Redis が本番向けドライバ。**ローカライゼーション** は `lang/` と `__()` で UI を多言語化します。",
    },
  ],
  sections: [
    {
      title: {
        en: "Session & flash data",
        np: "Session र Flash data",
        jp: "セッションとフラッシュデータ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Configure the session driver in `.env` via `SESSION_DRIVER`. The `file` driver is fine for local dev; use `database` or `redis` in production. When using `database`, run `php artisan session:table` and `migrate` first to create the `sessions` table.",
            np: "`.env` मा `SESSION_DRIVER` — `file` local; `redis` वा `database` production।",
            jp: "`.env` の `SESSION_DRIVER` でドライバを選択。ローカルは `file`、本番は `redis` または `database` が一般的です。`database` 使用時は `session:table` + migrate が必要です。",
          },
        },
        {
          type: "code",
          title: {
            en: "Session methods",
            np: "Session methods उदाहरण",
            jp: "セッションメソッドの使用例",
          },
          code: `// ---- Store / retrieve ----
session()->put('cart_id', 42);
session()->put(['user_name' => 'Alice', 'theme' => 'dark']); // multiple

$cartId = session()->get('cart_id');
$cartId = session()->get('cart_id', 0);     // with default
$all    = session()->all();

// ---- Presence checks ----
session()->has('cart_id');      // true even if value is null
session()->exists('cart_id');   // true only if key is in the session
session()->missing('cart_id');  // opposite of has()

// ---- Removal ----
session()->forget('cart_id');           // remove one key
session()->forget(['cart_id', 'theme']); // remove multiple
session()->flush();                      // clear entire session

// ---- Regenerate session ID (do this on login to prevent fixation) ----
session()->regenerate();
session()->invalidate(); // flush + regenerate (on logout)

// ---- Flash data: persists for the NEXT request only ----
session()->flash('status', 'Profile updated!');
session()->flash('error', 'Something went wrong.');

// Keep flash data for one more request (e.g., after another redirect)
session()->reflash();
session()->keep(['status']); // keep only specific keys

// ---- Blade: read flash data ----
// @if (session('status'))
//   <div class="alert">{{ session('status') }}</div>
// @endif`,
        },
        {
          type: "table",
          caption: {
            en: "Session driver comparison",
            np: "Session driver तुलना",
            jp: "セッションドライバの比較",
          },
          headers: [
            { en: "Driver", np: "Driver", jp: "ドライバ" },
            { en: "Pros", np: "फाइदा", jp: "利点" },
            { en: "Cons / notes", np: "बेफाइदा", jp: "注意点" },
          ],
          rows: [
            [
              { en: "`file`", np: "`file`", jp: "`file`" },
              { en: "Zero config, fast for dev", np: "सजिलो setup", jp: "設定不要、開発向け" },
              { en: "Not shared between servers", np: "single server मात्र", jp: "複数サーバーで共有不可" },
            ],
            [
              { en: "`database`", np: "`database`", jp: "`database`" },
              { en: "Persistent, inspectable SQL rows", np: "DB मा inspect गर्न सकिन्छ", jp: "SQL で確認可能" },
              { en: "Adds query per request", np: "हरेक request DB query", jp: "リクエストごとにクエリが発生" },
            ],
            [
              { en: "`redis`", np: "`redis`", jp: "`redis`" },
              { en: "Fast, shared across servers, TTL built-in", np: "तेज, multi-server, TTL", jp: "高速・マルチサーバ・TTL 組み込み" },
              { en: "Redis server required", np: "Redis server चाहिन्छ", jp: "Redis サーバーが必要" },
            ],
            [
              { en: "`cookie`", np: "`cookie`", jp: "`cookie`" },
              { en: "Stateless server side", np: "Server stateless", jp: "サーバー側ステートレス" },
              { en: "4 KB limit, client-side exposure", np: "4 KB सीमा", jp: "4 KB 制限・クライアントに保存" },
            ],
          ],
        },
      ],
    },
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
            en: "Set `CACHE_DRIVER` (or `CACHE_STORE` in Laravel 11) in `.env`. The **cache-aside** pattern is the most common: check the cache first; on a miss, load from the DB, store in cache, then return. `Cache::remember()` implements this in one line.",
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
SESSION_DRIVER=redis
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
            en: "Laravel 11 ships with translations inside `vendor/laravel/framework/src/Illuminate/Translation/lang/`. Run `php artisan lang:publish` to copy them to `lang/` in your project so you can modify them. Application strings live in `lang/{locale}/file.php` (array format) or `lang/{locale}.json` (string-keyed format).",
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
        en: "How do I configure Redis for both sessions and cache?",
        np: "Redis ले session र cache दुवै कसरी?",
        jp: "Redis でセッションとキャッシュの両方を使うには？",
      },
      answer: {
        en: "Set `SESSION_DRIVER=redis` and `CACHE_STORE=redis` in `.env`, along with `REDIS_HOST`, `REDIS_PORT`, and `REDIS_PASSWORD`. Install `predis/predis` (`composer require predis/predis`) or use the `phpredis` PHP extension. For separate Redis databases per concern set `REDIS_CACHE_DB=1` (sessions use DB 0 by default) in `config/database.php`.",
        np: "`.env` मा `SESSION_DRIVER=redis` र `CACHE_STORE=redis`। `predis/predis` install गर्नुस्।",
        jp: "`.env` に `SESSION_DRIVER=redis` と `CACHE_STORE=redis` を設定。`predis/predis` をインストールするか `phpredis` 拡張を使います。",
      },
    },
    {
      question: {
        en: "What is the difference between `session()` and `Cache`?",
        np: "`session()` र `Cache` मा के फरक?",
        jp: "`session()` と `Cache` の違いは？",
      },
      answer: {
        en: "**Sessions** are scoped to an individual user (identified by their session cookie) — data is private and persists across requests for that user until it expires or is cleared. **Cache** is shared across all users (and all server instances when using Redis/Memcached) — it stores public computations like rendered HTML fragments, query results, and computed settings. Never store sensitive user data in the shared cache.",
        np: "Session user-specific (private); Cache सबैले share गर्छन् — query result, rendered HTML। Cache मा sensitive data नराख्नुस्।",
        jp: "セッションはユーザーごとのプライベートなデータ。キャッシュは全ユーザーで共有する公開データ（クエリ結果・HTML など）。機密情報をキャッシュに入れないでください。",
      },
    },
    {
      question: {
        en: "How do I translate validation error messages?",
        np: "Validation error messages translate कसरी गर्ने?",
        jp: "バリデーションエラーメッセージを翻訳するには？",
      },
      answer: {
        en: "Run `php artisan lang:publish` to copy the framework's `validation.php` file into `lang/en/validation.php`. Then create `lang/{locale}/validation.php` with the same keys translated. Laravel automatically uses the active locale when building validation messages. For custom attribute names override the `attributes` array at the bottom of the file.",
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
        en: "Translation strings can contain `:name` placeholders. Pass a second argument array to `__()` or `trans()` to replace them: `__('messages.welcome', ['name' => 'Alice'])` turns `'Welcome, :name!'` into `'Welcome, Alice!'`. Parameter names are case-insensitive; `:Name` capitalizes the first letter and `:NAME` uppercases the entire replacement.",
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
        en: "Yes — Laravel only loads the translation files that are actually called. If you call `__('messages.welcome')` with locale `en`, only `lang/en/messages.php` is loaded. Files for other locales (and other file names in the same locale) are never read. For JSON translations, each `lang/{locale}.json` file is loaded once per request when any key from it is first accessed.",
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
        en: "In the **cache-aside** pattern, the application code is responsible for loading data on cache misses: (1) look up the key in the cache, (2) if missing (cache miss), load from the source (DB), (3) store in the cache with a TTL, (4) return the value. `Cache::remember('key', $ttl, fn() => DB::query())` does all four steps atomically — you just provide the key, TTL, and the closure that loads fresh data.",
        np: "Cache-aside: cache miss भए DB load, cache store, return। `Cache::remember()` ले सबै एक call मा।",
        jp: "キャッシュアサイドは (1) キャッシュを参照、(2) ミスなら DB からロード、(3) TTL 付きでキャッシュに保存、(4) 返却 — の 4 ステップ。`Cache::remember()` がこれをアトミックに 1 行で行います。",
      },
    },
  ],
};
