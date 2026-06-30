import type { RoadmapDayDetail } from "@/lib/challenge-data";

export const LARAVEL_DAY_21_DETAIL: RoadmapDayDetail = {
  overview: [
    {
      en: "A slow app is a broken app — users leave pages that take more than 3 seconds to load, and search engines penalise slow sites. Performance in Laravel is mostly about three things: <b>database queries</b> (too many, or poorly structured), <b>caching</b> (not caching what you could), and <b>background work</b> (doing expensive work synchronously that could run in a queue). Most apps have at least one of these problems by default.",
      np: "Slow app = broken app। Laravel performance: database queries optimize गर्नुस्, caching प्रयोग गर्नुस्, expensive work queue मा पठाउनुस्।",
      jp: "遅いアプリは壊れたアプリ。Laravel のパフォーマンスは主に DB クエリ・キャッシュ・バックグラウンド処理の 3 点。",
    },
    {
      en: "<b>N+1 query problem</b> — the single most common performance bug in Laravel apps\n↳ One query to get 100 posts, then 100 queries to get each post's author = 101 queries\n\n<b>Eager loading & withCount</b> — solving N+1 with `with()` and `withCount()`\n↳ Two queries instead of 101, regardless of how many records you have\n\n<b>Query debugging</b> — Laravel Telescope and Debugbar to spot slow queries\n↳ See every query, its execution time, and where it was called from\n\n<b>Redis caching</b> — caching query results, computed values, and sessions\n↳ ~1ms Redis read vs ~50ms database query\n\n<b>Laravel Horizon</b> — queue monitoring, worker scaling, and failure tracking\n↳ Dashboard showing throughput, wait time, and failed job stack traces",
      np: "N+1 problem, eager loading, Telescope, Redis caching, Horizon — यी 5 topics cover हुन्छन्।",
      jp: "N+1 問題、Eager ロード、Telescope、Redis キャッシュ、Horizon の 5 トピックを学ぶ。",
    },
  ],
  sections: [
    {
      title: {
        en: "The N+1 query problem",
        np: "N+1 query problem",
        jp: "N+1 クエリ問題",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "<b>N+1</b> is when you run 1 query to get a list of records, then run 1 more query for EACH record to fetch related data. With 100 posts, that is 101 database round trips instead of 2.\n\nIt's named \"N+1\" because:\n• 1 query to get the list (the \"1\")\n• N queries to get each item's related data (the \"N\")\n• Total: N+1 queries\n\nEach round trip has overhead: network latency, connection setup, query parsing, index lookup. At scale this tanks response time. A page that loads in 50ms with 10 items takes 5 seconds with 1,000 items.",
            np: "N+1 = 1 query list लिन + N queries प्रत्येक item को related data लिन। 100 posts = 101 queries! Eager loading ले यो fix गर्छ।",
            jp: "N+1 は 1 回のリスト取得 + N 回の関連データ取得。100 件で 101 クエリ。Eager loading で解決。",
          },
        },
        {
          type: "code",
          title: { en: "N+1 problem and the fix", np: "N+1 र fix", jp: "N+1 と解決策" },
          code: `// BAD — N+1 problem (101 queries for 100 posts)
$posts = Post::all(); // 1 query
foreach ($posts as $post) {
    echo $post->author->name; // 1 query per post = 100 more queries
    echo $post->comments->count(); // another 100 queries!
}

// GOOD — Eager loading (3 queries total, regardless of count)
$posts = Post::with(['author', 'comments'])->get();
// Query 1: SELECT * FROM posts
// Query 2: SELECT * FROM users WHERE id IN (1, 2, 3, ...)
// Query 3: SELECT * FROM comments WHERE post_id IN (1, 2, 3, ...)

// BETTER — withCount when you only need the count, not the records
$posts = Post::with('author')->withCount('comments')->get();
// $post->comments_count is now available as a virtual column
// Only 2 queries total — no loading all comment rows into memory

// DETECT N+1 in development — add to AppServiceProvider::boot()
if (app()->isLocal()) {
    \\Illuminate\\Database\\Eloquent\\Model::preventLazyLoading(true);
    // Now Laravel throws an exception instantly when lazy loading is detected
}`,
        },
        {
          type: "paragraph",
          text: {
            en: "The `preventLazyLoading(true)` call is the single most effective way to catch N+1 before it reaches production. It throws a `LazyLoadingViolationException` with the model name and relationship that was lazily loaded, so you can fix it immediately.\n\nUseful variants:\n• `Post::with(['author:id,name', 'tags:id,name'])` — only load specific columns from related models\n• `Post::with(['comments' => fn($q) => $q->latest()->limit(3)])` — constrain eager load queries\n• `$posts->load('author')` — eager load on an already-retrieved collection",
            np: "`preventLazyLoading(true)` production deployment अघि N+1 catch गर्ने best tool हो।",
            jp: "`preventLazyLoading(true)` は N+1 を本番前に検出する最良の方法。関係の制約にも対応。",
          },
        },
      ],
    },
    {
      title: {
        en: "Query optimization — indexes, select & chunking",
        np: "Query optimization — indexes, select र chunking",
        jp: "クエリ最適化 — インデックス・select・チャンク",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Even with N+1 solved, individual queries can be slow. Three common causes:\n\n• <b>Missing indexes</b> — without an index, the database reads every row to find matches\n  ↳ Think of it like a book with no index — you'd read every page to find a word\n  ↳ Add indexes on columns you filter (`WHERE`), sort (`ORDER BY`), or join on\n• <b>Selecting too many columns</b> — `SELECT *` loads every column even if you use only 2\n  ↳ A `posts` table with a `body` TEXT column sends megabytes of data you don't render\n• <b>Loading too many rows at once</b> — `Post::all()` on a million-row table exhausts PHP memory",
            np: "Missing indexes, SELECT *, र large datasets — यी तीन common query performance issues हुन्।",
            jp: "インデックス不足・SELECT * による過剰取得・大量行ロードが遅いクエリの主な原因。",
          },
        },
        {
          type: "code",
          title: { en: "Indexes, column selection & chunking", np: "Indexes, select, chunk", jp: "インデックス・select・チャンク" },
          code: `// INDEXES — add to your migrations
Schema::table('posts', function (Blueprint $table) {
    $table->index('user_id');                        // single column
    $table->index(['user_id', 'published_at']);      // composite (queries filter both)
    $table->index('published_at');                   // for ORDER BY published_at DESC
});

// COLUMN SELECTION — only load what you need
Post::select(['id', 'title', 'published_at', 'user_id'])
    ->with('author:id,name')  // constrain relation columns too
    ->get();

// CHUNKING — process large tables without exhausting memory
// chunk(): loads 500 rows at a time
Post::chunk(500, function (\\Illuminate\\Support\\Collection $posts) {
    foreach ($posts as $post) {
        // process each post
    }
});

// cursor(): memory-efficient generator (one row at a time)
// Good for very large tables; holds DB connection open throughout
foreach (Post::cursor() as $post) {
    // process each post
}

// LOG ALL QUERIES in development
\\DB::enableQueryLog();
$posts = Post::with('author')->get();
$queries = \\DB::getQueryLog();
// $queries is an array of ['query' => '...', 'bindings' => [...], 'time' => 1.23]

// Use DB::listen() for live logging
\\DB::listen(function ($query) {
    if ($query->time > 100) { // log queries slower than 100ms
        logger()->warning("Slow query: {$query->sql}", ['time' => $query->time]);
    }
});`,
        },
        {
          type: "paragraph",
          text: {
            en: "For production query analysis, install Laravel Telescope (`composer require laravel/telescope --dev`) — it records every query with its SQL, bindings, execution time, and the exact line of code that triggered it. It also highlights slow queries in red. Never run Telescope in production without restricting access to admin IPs.",
            np: "Production मा Laravel Telescope install गर्नुस् — सबै queries देखिन्छन् execution time सहित।",
            jp: "本番のクエリ分析には Laravel Telescope を使用。SQL・実行時間・呼び出し元を記録し、遅いクエリを赤でハイライト。",
          },
        },
      ],
    },
    {
      title: {
        en: "Caching with Redis",
        np: "Redis caching",
        jp: "Redis によるキャッシュ",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Caching means storing the result of an expensive operation so you can reuse it without re-computing. <b>Redis</b> is an in-memory key-value store — reads take ~1ms vs ~50ms for a database query.\n\nAnalogy: Redis is like keeping a sticky note on your desk (instant) vs going to the filing cabinet (slower) vs going to the library archive (slowest).\n\nUse Redis for:\n• Frequently-read data that changes rarely (featured posts, nav menus, config)\n• Computed aggregates (leaderboards, total counts)\n• Sessions (faster than database sessions)\n• Rate limiting (Laravel's throttle middleware uses Redis by default)\n• Queue backend (jobs stored in Redis, consumed by workers)",
            np: "Redis = in-memory key-value store। ~1ms read। Frequently-read data, sessions, queues, rate limiting मा प्रयोग गर्नुस्।",
            jp: "Redis はメモリ内 KV ストア。読み取り約 1ms。頻繁に読まれるデータ・セッション・キュー・レート制限に活用。",
          },
        },
        {
          type: "code",
          title: { en: "Cache::remember, tags & invalidation", np: "Cache examples", jp: "キャッシュの例" },
          code: `// Basic caching — compute on miss, serve from cache on hit
$posts = Cache::remember('posts.featured', 3600, function () {
    return Post::featured()->with('author')->orderByDesc('views')->limit(10)->get();
});
// 3600 = TTL in seconds (1 hour)

// Invalidate when data changes (e.g. in PostObserver)
public function updated(Post $post): void
{
    Cache::forget('posts.featured');
}

// Tag-based invalidation — requires Redis (not available with file driver)
// Cache all post-related data under the 'posts' tag
$featured = Cache::tags(['posts'])->remember('featured', 3600, fn() => ...);
$trending = Cache::tags(['posts'])->remember('trending', 1800, fn() => ...);

// Invalidate ALL post caches at once
Cache::tags(['posts'])->flush();

// Per-user cache (prevents cache key collisions)
$key = "user:{$userId}:dashboard";
$dashboard = Cache::remember($key, 600, fn() => buildDashboard($userId));

// Store arbitrary data
Cache::put('maintenance_mode', true, 300); // expires in 5 minutes
Cache::forever('app_version', '2.4.1');    // no expiry
$value = Cache::get('app_version', 'unknown'); // default if missing

// .env configuration
// CACHE_DRIVER=redis
// REDIS_HOST=127.0.0.1
// REDIS_PORT=6379
// SESSION_DRIVER=redis  (store sessions in Redis)`,
        },
        {
          type: "paragraph",
          text: {
            en: "<b>Cache key naming rules</b>:\n• Be specific: `posts.featured` is wrong if multiple tenants share a cache\n• Include IDs: `\"user:{$userId}:posts\"` instead of `\"user_posts\"`\n• Include version if the data structure changes: `\"posts.v2.featured\"`\n• Set sensible TTLs — cache that never expires grows forever and goes stale\n\n<b>When NOT to cache</b>:\n• Data that must be real-time (inventory counts, account balances)\n• Data that changes on every request without a user-specific key\n• Tiny queries that are already fast (single-row primary key lookups — DB buffers those itself)",
            np: "Cache key naming: specific र unique राख्नुस्। TTL sensible राख्नुस्। Inventory/balance जस्ता real-time data cache नगर्नुस्।",
            jp: "キャッシュキーは具体的かつユニークに。TTL を適切に設定。在庫・残高などリアルタイムデータはキャッシュ不可。",
          },
        },
      ],
    },
    {
      title: {
        en: "Laravel Horizon — queue monitoring & scaling",
        np: "Laravel Horizon — queue monitoring",
        jp: "Laravel Horizon — キュー監視とスケーリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Horizon is a dashboard and process manager for Laravel queues. Without it, you manage queue workers manually — launching them with supervisor, guessing how many you need, flying blind when jobs fail.\n\nHorizon gives you:\n• Live dashboard with jobs-per-minute, wait time, throughput\n• Failed jobs with full stack traces and retry button\n• Auto-balancing workers across queues based on real load\n• Slack/email alerts when jobs fail or queues back up",
            np: "Horizon = queue dashboard + process manager। Failed jobs, throughput, auto-balancing — सबै एकै ठाउँमा।",
            jp: "Horizon はキューのダッシュボード＋プロセスマネージャー。失敗ジョブ・スループット・自動バランスを一元管理。",
          },
        },
        {
          type: "code",
          title: { en: "Horizon setup & config", np: "Horizon setup", jp: "Horizon セットアップ" },
          code: `// Install
composer require laravel/horizon
php artisan horizon:install
php artisan migrate  // creates horizon tables

// config/horizon.php — define worker environments
'environments' => [
    'production' => [
        'supervisor-1' => [
            'connection'   => 'redis',
            'queue'        => ['high', 'default', 'low'],
            'balance'      => 'auto',     // smart auto-scaling
            'maxProcesses' => 10,         // max total worker processes
            'memory'       => 128,        // MB per worker (restart if exceeded)
            'timeout'      => 60,         // job time limit in seconds
            'tries'        => 3,          // retry failed jobs 3 times
        ],
    ],
    'local' => [
        'supervisor-1' => [
            'connection'   => 'redis',
            'queue'        => ['default'],
            'balance'      => 'simple',
            'maxProcesses' => 3,
        ],
    ],
],

// Run Horizon
php artisan horizon         // start in foreground (dev)
php artisan horizon:status  // check if running
php artisan horizon:pause   // pause all workers
php artisan horizon:continue

// Prioritise critical jobs
SendWelcomeEmail::dispatch($user)->onQueue('high');
GenerateReport::dispatch($data)->onQueue('low');

// Supervisor config for production (/etc/supervisor/conf.d/horizon.conf)
// [program:horizon]
// command=php /var/www/artisan horizon
// autostart=true
// autorestart=true
// user=www-data`,
        },
        {
          type: "paragraph",
          text: {
            en: "`balance: auto` monitors each queue's depth and spins up more workers for queues with a backlog — it responds to real load rather than distributing blindly. Key settings:\n• `maxProcesses` — set to your server's CPU count (not total RAM)\n• `memory: 128` — worker restarts after using 128MB, preventing gradual memory leaks\n• `tries: 3` — retries a failing job 3 times before marking it as \"failed\"\n• `timeout: 60` — kills a job that runs longer than 60 seconds (prevents zombie workers)\n\nAlways monitor the Horizon dashboard after a new deployment — a new bug can cause jobs to fail silently without Horizon.",
            np: "`balance: auto` real load हेरेर workers थप्छ। `maxProcesses`, `memory`, `tries`, `timeout` सेट गर्नुस्।",
            jp: "`balance: auto` はキューの深さに応じてワーカーを増減。`maxProcesses`・`memory`・`tries`・`timeout` を適切に設定。",
          },
        },
      ],
    },
    {
      title: {
        en: "Telescope — profiling in development",
        np: "Telescope — development debugging",
        jp: "Telescope — 開発時のプロファイリング",
      },
      blocks: [
        {
          type: "paragraph",
          text: {
            en: "Laravel Telescope is a development debugging dashboard. It records every request, query, job, mail, notification, cache hit/miss, schedule firing, and exception — with full context.\n\nAnalogy: it's like having a flight data recorder for your application — when something goes wrong, you replay exactly what happened.\n\nInstall it in development only — never in production without IP restrictions, as it exposes sensitive request data, query results, and environment variables.",
            np: "Telescope = development debugging dashboard। Requests, queries, jobs, mails, exceptions सबै record गर्छ।",
            jp: "Telescope は開発用デバッグダッシュボード。リクエスト・クエリ・ジョブ・例外をすべて記録。本番では IP 制限必須。",
          },
        },
        {
          type: "code",
          title: { en: "Telescope install & restrict to local", np: "Telescope setup", jp: "Telescope のセットアップ" },
          code: `// Install (dev-only)
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate

// Visit /telescope in your browser

// Restrict to local environment — app/Providers/TelescopeServiceProvider.php
use Laravel\\Telescope\\Telescope;

protected function gate(): void
{
    Gate::define('viewTelescope', function ($user = null) {
        return app()->isLocal() || in_array($user?->email, [
            'admin@example.com',
        ]);
    });
}

// Only register in local environment (prevents telescope from loading in prod)
// bootstrap/providers.php — wrap in env check:
// Or in AppServiceProvider::register():
if ($this->app->isLocal()) {
    $this->app->register(\\Laravel\\Telescope\\TelescopeServiceProvider::class);
}

// Key things to watch in Telescope:
// /telescope/requests  — all HTTP requests with query count + duration
// /telescope/queries   — all SQL queries; red = slow (>100ms)
// /telescope/jobs      — queued jobs with payload, attempts, execution time
// /telescope/cache     — hits vs misses per key
// /telescope/exceptions — full stack trace with request context`,
        },
        {
          type: "paragraph",
          text: {
            en: "Key performance metrics to monitor in Telescope:\n• <b>More than 10 queries per request</b> → likely N+1; add `with()` eager loading\n• <b>Any query over 100ms</b> → missing index, or a JOIN scanning too many rows\n• <b>Cache miss rate over 50%</b> → TTL too short, or cache never warming on first request\n• <b>Job memory > 64MB</b> → loading too much data into memory; use `chunk()` or `cursor()`\n• <b>Many duplicate queries</b> → same query running in a loop; move it outside the loop\n\nRun Telescope for a week after every major launch to build a performance baseline before optimising.",
            np: "10+ queries per request → N+1। 100ms+ query → missing index। Cache miss 50%+ → TTL छोटो।",
            jp: "10 クエリ以上→ N+1。100ms 超→インデックス不足。キャッシュミス 50% 超→ TTL 短すぎ。",
          },
        },
      ],
    },
  ],
  faq: [
    {
      question: {
        en: "What is the difference between Cache::remember() and Cache::rememberForever()?",
        np: "`Cache::remember()` र `Cache::rememberForever()` को फरक के हो?",
        jp: "`Cache::remember()` と `Cache::rememberForever()` の違いは?",
      },
      answer: {
        en: "`remember()` takes a TTL in seconds; the cache auto-expires and re-computes on the next access. `rememberForever()` never expires — you must manually call `Cache::forget()` when the data changes. Use `rememberForever()` only when you have a reliable cache-busting strategy (e.g. invalidate in a model observer or event listener). If you forget to bust the cache, users see stale data indefinitely.",
        np: "`remember()` = TTL पछि auto-expire। `rememberForever()` = manual forget चाहिन्छ। Observer मा invalidate गर्नुस्।",
        jp: "`remember()` は TTL 後に自動失効。`rememberForever()` は手動 `forget()` が必要。Observer で確実に無効化できる場合のみ使用。",
      },
    },
    {
      question: {
        en: "Does with() always fix N+1?",
        np: "`with()` ले हमेशा N+1 fix गर्छ?",
        jp: "`with()` は常に N+1 を修正しますか?",
      },
      answer: {
        en: "`with()` fixes N+1 for standard Eloquent relationships when you define the eager load upfront. It does NOT help when: (1) you call a relationship method inside a loop on an already-loaded collection (use `$posts->load('author')` instead), (2) a relationship is accessed in a computed attribute that doesn't know about the eager load, (3) you use raw DB queries instead of Eloquent. Enable `preventLazyLoading()` in development to catch all cases automatically.",
        np: "`with()` standard relationships fix गर्छ। Loop भित्र lazy access गर्दा `$posts->load()` प्रयोग गर्नुस्।",
        jp: "`with()` は標準リレーションに有効。ループ内のアクセスには `$posts->load()` を。`preventLazyLoading()` で全ケースを検出。",
      },
    },
    {
      question: {
        en: "How many queue workers should I run?",
        np: "कति queue workers चलाउनु पर्छ?",
        jp: "キューワーカーはいくつ実行すべきですか?",
      },
      answer: {
        en: "Start with 1 worker per CPU core. Monitor queue depth with Horizon — if jobs are consistently waiting more than 5 seconds, add workers. For mixed-priority workloads, run dedicated workers for the `high` queue (customer-facing, fast) and shared workers for `default` and `low` (background processing). Memory is usually the bottleneck before CPU — if workers are restarting frequently due to the `memory` limit, your jobs are loading too much data.",
        np: "CPU core प्रति 1 worker बाट सुरु गर्नुस्। Horizon मा queue depth monitor गर्नुस्। High queue मा dedicated workers राख्नुस्।",
        jp: "CPU コアあたり 1 ワーカーから開始。Horizon でキュー深度を監視し、待機が多ければ増やす。優先度別のキューには専用ワーカーを。",
      },
    },
    {
      question: {
        en: "What is the difference between chunk() and cursor()?",
        np: "`chunk()` र `cursor()` को फरक के हो?",
        jp: "`chunk()` と `cursor()` の違いは?",
      },
      answer: {
        en: "`chunk()` loads N records at a time into memory, processes them, discards them, then loads the next N. Good for batch operations (bulk inserts, file exports). `cursor()` uses a database cursor — it returns a PHP generator that loads one record at a time, using constant memory regardless of table size. `cursor()` holds the database connection open for the entire operation. Rule: use `cursor()` for read-only iteration over huge tables; use `chunk()` when you need the records as a Collection (for batch DB writes).",
        np: "`chunk()` = N rows एकैपटक memory मा। `cursor()` = one row at a time (generator)। `cursor()` memory-efficient, `chunk()` batch operations मा राम्रो।",
        jp: "`chunk()` は N 件ずつロード。`cursor()` はジェネレーターで 1 件ずつ、メモリ使用量一定。巨大テーブルの読み取りには `cursor()`、バッチ書き込みには `chunk()`。",
      },
    },
    {
      question: {
        en: "When should I NOT use Redis caching?",
        np: "Redis caching कहिले प्रयोग नगर्ने?",
        jp: "Redis キャッシュを使うべきでない場合は?",
      },
      answer: {
        en: "Don't cache: (1) data that must always be fresh — inventory counts, account balances, anything where a stale read causes a real problem; (2) data that changes on every request without a user-specific cache key (you'd always miss); (3) tiny queries that are already fast — single-row primary key lookups are served from the DB's own buffer cache; (4) data the user just wrote — always read directly from DB after writes to avoid showing stale data (read-your-own-writes consistency).",
        np: "Real-time data (inventory, balance), per-request changing data, fast PK lookups — यिनीहरू cache नगर्नुस्।",
        jp: "在庫・残高などリアルタイムデータ、毎リクエスト変わるデータ、高速な PK ルックアップはキャッシュ不要。書き込み直後は DB から直接読む。",
      },
    },
  ],
};
